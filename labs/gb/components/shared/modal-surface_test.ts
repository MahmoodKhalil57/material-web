/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendKeys} from '@web/test-runner-commands';
import {html, LitElement, render} from 'lit';

import {
  deepActiveElement,
  getFocusableElements,
  lockPageScroll,
  MODAL_CLOSE_REASONS,
  ModalSurfaceController,
  type ModalSurfaceOptions,
  SCROLL_LOCK_ATTRIBUTE,
  trapTabFocus,
} from './modal-surface.js';
import {FakeCloseWatcher, useCloseWatcher} from './predictive-back-harness.js';
import {resetEscapeTracking} from './predictive-back.js';
import {until} from './test-dom.js';

/** A surface on a native `<dialog>` with two buttons. */
class TestModalHost extends LitElement {
  options: Partial<ModalSurfaceOptions> = {};
  modal = true;
  controller!: ModalSurfaceController;

  override connectedCallback() {
    this.controller ??= new ModalSurfaceController(this, {
      dialog: () => this.renderRoot.querySelector('dialog'),
      modal: () => this.modal,
      ...this.options,
    });
    super.connectedCallback();
  }

  get dialog() {
    return this.renderRoot.querySelector('dialog')!;
  }

  protected override render() {
    return html`<dialog tabindex="-1">
      <button id="first">First</button>
      <button id="second">Second</button>
      <slot></slot>
    </dialog>`;
  }
}
customElements.define('test-modal-host', TestModalHost);

/** A surface with no dialog; the host owns `expanded` (external mode). */
class TestInlineHost extends LitElement {
  options: Partial<ModalSurfaceOptions> = {};
  expanded = false;
  controller!: ModalSurfaceController;

  override connectedCallback() {
    this.controller ??= new ModalSurfaceController(this, {
      isOpen: () => this.expanded,
      surface: () => this.renderRoot.querySelector('.surface'),
      scrim: () => this.renderRoot.querySelector('.scrim'),
      onCloseRequest: (reason) => {
        this.requests.push(reason);
        this.expanded = false;
        this.requestUpdate();
      },
      ...this.options,
    });
    super.connectedCallback();
  }

  requests: string[] = [];

  protected override render() {
    return html`${this.expanded ? html`<div class="scrim"></div>` : ''}
      <div class="surface">
        <button id="first">First</button>
        <button id="second">Second</button>
      </div>`;
  }
}
customElements.define('test-inline-host', TestInlineHost);

let container: HTMLElement | undefined;

async function mount<T extends LitElement>(
  tag: string,
  setup: (el: T) => void = () => {},
  children = '',
): Promise<T> {
  container?.remove();
  container = document.createElement('div');
  document.body.append(container);
  container.innerHTML = '<button id="trigger">Trigger</button>';
  const el = document.createElement(tag) as T;
  el.innerHTML = children;
  // Options are read when the controller is created, on connection.
  setup(el);
  container.append(el);
  await el.updateComplete;
  return el;
}

const trigger = () => document.querySelector<HTMLElement>('#trigger')!;

function record(el: HTMLElement) {
  const log: string[] = [];
  for (const type of ['open', 'opened', 'close', 'closed']) {
    el.addEventListener(type, (event) => {
      const reason = (event as CustomEvent).detail?.reason;
      log.push(reason ? `${type}:${reason}` : type);
    });
  }
  return log;
}

/**
 * Lets the pending updates and one frame run, for a check that nothing else
 * happened (a close that must not follow, a state that must hold).
 */
async function flush(el: LitElement) {
  await el.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

async function press(key: string) {
  await sendKeys({press: key});
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

const isLocked = () =>
  getComputedStyle(document.documentElement).overflow === 'hidden';

afterEach(() => {
  container?.remove();
  container = undefined;
  resetEscapeTracking();
});

describe('ModalSurfaceController lifecycle', () => {
  it('opens the dialog as a modal and fires open then opened', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    const log = record(el);
    await el.controller.show();
    expect(el.controller.open).toBeTrue();
    expect(el.dialog.open).toBeTrue();
    expect(el.dialog.matches(':modal')).toBeTrue();
    expect(log).toEqual(['open', 'opened']);
  });

  it('keeps the surface closed when open is canceled', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    el.addEventListener('open', (e) => e.preventDefault());
    const log = record(el);
    await el.controller.show();
    expect(el.controller.open).toBeFalse();
    expect(el.dialog.open).toBeFalse();
    expect(log).toEqual(['open']);
  });

  it('closes with a reason: close, then closed, both carrying it', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    await el.controller.show();
    const log = record(el);
    await el.controller.close('custom');
    expect(el.controller.open).toBeFalse();
    expect(el.dialog.open).toBeFalse();
    expect(log).toEqual(['close:custom', 'closed:custom']);
  });

  it('uses the default reason, dismiss, for close()', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    await el.controller.show();
    const log = record(el);
    await el.controller.close();
    expect(log).toEqual([
      `close:${MODAL_CLOSE_REASONS.DISMISS}`,
      `closed:${MODAL_CLOSE_REASONS.DISMISS}`,
    ]);
  });

  it('stays open when close is canceled, and calls onCloseCanceled', async () => {
    const canceled = jasmine.createSpy('canceled');
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {onCloseCanceled: canceled};
    });
    await el.controller.show();
    el.addEventListener('close', (e) => e.preventDefault());
    const log = record(el);
    await el.controller.close();
    expect(el.controller.open).toBeTrue();
    expect(el.dialog.open).toBeTrue();
    expect(canceled).toHaveBeenCalledTimes(1);
    expect(log).toEqual(['close:dismiss']);
  });

  it('ignores show() while open and close() while closed', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    await el.controller.close();
    await el.controller.show();
    const log = record(el);
    await el.controller.show();
    expect(log).toEqual([]);
  });

  it('waits for the motion before opened and closed, with opening / closing flags', async () => {
    const finishes: Array<() => void> = [];
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {
        waitForMotion: () => new Promise<void>((r) => finishes.push(r)),
      };
    });
    const log = record(el);
    const showing = el.controller.show();
    await until(() => finishes.length === 1);
    expect(el.controller.opening).toBeTrue();
    expect(log).toEqual(['open']);
    finishes[0]();
    await showing;
    expect(el.controller.opening).toBeFalse();
    expect(log).toEqual(['open', 'opened']);

    const closing = el.controller.close();
    await until(() => finishes.length === 2);
    expect(el.controller.closing).toBeTrue();
    expect(el.controller.open).toBeFalse();
    expect(el.dialog.open).withContext('dialog stays for the motion').toBeTrue();
    finishes[1]();
    await closing;
    expect(el.controller.closing).toBeFalse();
    expect(el.dialog.open).toBeFalse();
    expect(log.slice(2)).toEqual(['close:dismiss', 'closed:dismiss']);
  });

  it('cancels a closing motion when shown again', async () => {
    let finish!: () => void;
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {
        waitForMotion: (opening) =>
          opening ? undefined : new Promise<void>((r) => (finish = r)),
      };
    });
    await el.controller.show();
    const log = record(el);
    el.controller.close();
    await until(() => !!finish);
    await el.controller.show();
    finish();
    await flush(el);
    expect(el.controller.open).toBeTrue();
    expect(el.dialog.open).toBeTrue();
    expect(log).not.toContain('closed:dismiss');
  });

  it('is not entered until the first frame has rendered', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    expect(el.controller.entered).toBeFalse();
    await el.controller.show();
    expect(el.controller.entered).toBeTrue();
    el.controller.close();
    expect(el.controller.entered).toBeFalse();
  });

  it('bubbles its events only when asked', async () => {
    const plain = await mount<TestModalHost>('test-modal-host');
    const seen: string[] = [];
    container!.addEventListener('opened', () => seen.push('plain'));
    await plain.controller.show();
    const bubbling = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {bubbles: true};
    });
    container!.addEventListener('opened', () => seen.push('bubbling'));
    await bubbling.controller.show();
    expect(seen).toEqual(['bubbling']);
  });

  it('asks for permission after the first render when opened from the start', async () => {
    container?.remove();
    container = document.createElement('div');
    document.body.append(container);
    const host = document.createElement('test-modal-host') as TestModalHost;
    const log = record(host);
    container.append(host);
    host.controller.show();
    await host.updateComplete;
    await until(() => log.includes('opened'));
    expect(log).toEqual(['open', 'opened']);
    expect(host.dialog.open).toBeTrue();
  });

  it('reverts an initial open that is canceled', async () => {
    container?.remove();
    container = document.createElement('div');
    document.body.append(container);
    const host = document.createElement('test-modal-host') as TestModalHost;
    host.addEventListener('open', (e) => e.preventDefault());
    container.append(host);
    const shown = host.controller.show();
    // Opening is requested at once; the canceled `open` event reverts it.
    expect(host.controller.open).toBeTrue();
    expect(await until(() => !host.controller.open)).toBeTrue();
    await shown;
    await host.updateComplete;
    expect(host.controller.open).toBeFalse();
    expect(host.dialog.open).toBeFalse();
  });

  it('runs the hooks around the dialog', async () => {
    const calls: string[] = [];
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {
        onWillShow: () => calls.push('willShow'),
        onBeforeShow: () => calls.push('beforeShow'),
        onShown: () => calls.push('shown'),
        onWillClose: (reason) => calls.push(`willClose:${reason}`),
        onHidden: () => calls.push('hidden'),
      };
    });
    await el.controller.show();
    await el.controller.close('x');
    expect(calls).toEqual([
      'willShow',
      'beforeShow',
      'shown',
      'willClose:x',
      'hidden',
    ]);
  });
});

describe('ModalSurfaceController close requests', () => {
  // spec: dialogs-4f2409, dialogs-5653c5
  it('closes on Escape with the escape reason', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    await el.controller.show();
    const log = record(el);
    await press('Escape');
    await until(() => log.includes('closed:escape'));
    expect(el.controller.open).toBeFalse();
    expect(log).toEqual(['close:escape', 'closed:escape']);
  });

  it('closes on a dialog cancel event as a back request when Escape was not pressed', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    if (typeof el.dialog.requestClose !== 'function') {
      pending('HTMLDialogElement.requestClose() is not supported');
    }
    await el.controller.show();
    const log = record(el);
    el.dialog.requestClose();
    await until(() => log.includes('closed:back'));
    expect(log).toEqual(['close:back', 'closed:back']);
  });

  it('treats a synthetic cancel event as Escape', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    await el.controller.show();
    const log = record(el);
    el.dialog.dispatchEvent(new Event('cancel', {cancelable: true}));
    await until(() => log.includes('closed:escape'));
    expect(log).toEqual(['close:escape', 'closed:escape']);
  });

  it('ignores Escape that another handler already used', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    await el.controller.show();
    const log = record(el);
    const used = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    el.dialog.addEventListener('keydown', (e) => e.preventDefault(), {
      capture: true,
      once: true,
    });
    el.dialog.dispatchEvent(used);
    await flush(el);
    expect(el.controller.open).toBeTrue();
    expect(log).toEqual([]);
  });

  it('routes requests through onCloseRequest instead of closing', async () => {
    const requests: string[] = [];
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {onCloseRequest: (reason) => requests.push(reason)};
    });
    await el.controller.show();
    await press('Escape');
    el.dialog.click();
    expect(requests).toEqual(['escape', 'scrim']);
    expect(el.controller.open).toBeTrue();
  });

  // spec: dialogs-34082e
  it('closes on a scrim click, the dialog itself, with the scrim reason', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    await el.controller.show();
    const log = record(el);
    el.dialog.click();
    await until(() => log.includes('closed:scrim'));
    expect(log).toEqual(['close:scrim', 'closed:scrim']);
  });

  it('does not close when the click lands on content', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    await el.controller.show();
    el.dialog.querySelector<HTMLElement>('#first')!.click();
    expect(el.controller.open).toBeTrue();
  });

  it('does not close when a press started on content and ended on the scrim', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    await el.controller.show();
    const first = el.dialog.querySelector('#first')!;
    first.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true}));
    el.dialog.click();
    expect(el.controller.open).toBeTrue();
    // The next press that starts on the scrim does close.
    el.dialog.dispatchEvent(new PointerEvent('pointerdown'));
    el.dialog.click();
    await until(() => !el.controller.open);
    expect(el.controller.open).toBeFalse();
  });

  it('uses isScrim to tell the scrim from the surface', async () => {
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {isScrim: () => false};
    });
    await el.controller.show();
    el.dialog.click();
    expect(el.controller.open).toBeTrue();
  });

  it('closes on a click on a separate scrim element', async () => {
    const el = await mount<TestInlineHost>('test-inline-host');
    el.expanded = true;
    el.requestUpdate();
    await el.updateComplete;
    el.renderRoot.querySelector<HTMLElement>('.scrim')!.click();
    expect(el.requests).toEqual(['scrim']);
  });

  it('reacts to nothing while it is not modal (standard surface)', async () => {
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.modal = false;
    });
    await el.controller.show();
    const log = record(el);
    el.dialog.dispatchEvent(new Event('cancel', {cancelable: true}));
    el.dialog.dispatchEvent(
      new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
    );
    el.dialog.click();
    await flush(el);
    expect(el.controller.open).toBeTrue();
    expect(log).toEqual([]);
  });

  it('requestClose() does nothing when closed', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    const log = record(el);
    el.controller.requestClose('escape');
    await flush(el);
    expect(log).toEqual([]);
  });

  it('syncs the state when the browser closes the dialog by itself', async () => {
    const forced = jasmine.createSpy('forced');
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {onForcedClose: forced, forcedCloseReason: 'forced'};
    });
    await el.controller.show();
    const log = record(el);
    el.dialog.close();
    await until(() => log.includes('closed:forced'));
    expect(el.controller.open).toBeFalse();
    expect(forced).toHaveBeenCalledTimes(1);
    expect(log).toEqual(['close:forced', 'closed:forced']);
  });

  it('does not treat its own dialog close as a forced close', async () => {
    const forced = jasmine.createSpy('forced');
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {onForcedClose: forced};
    });
    await el.controller.show();
    await el.controller.close();
    await flush(el);
    expect(forced).not.toHaveBeenCalled();
  });

  it('closes when the host disconnects, if asked, without events', async () => {
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {closeOnDisconnect: true};
    });
    await el.controller.show();
    const log = record(el);
    el.remove();
    await flush(el);
    expect(el.controller.open).toBeFalse();
    expect(log).toEqual([]);
    expect(isLocked()).toBeFalse();
  });

  it('stays open when the host disconnects, by default', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    await el.controller.show();
    el.remove();
    expect(el.controller.open).toBeTrue();
    expect(isLocked()).withContext('the lock is released').toBeFalse();
  });
});

describe('ModalSurfaceController back requests without a dialog', () => {
  describe('with CloseWatcher', () => {
    useCloseWatcher(true);

    it('listens for a close watcher while a modal surface is open', async () => {
      const el = await mount<TestInlineHost>('test-inline-host');
      expect(FakeCloseWatcher.active().length).toBe(0);
      el.expanded = true;
      el.requestUpdate();
      await el.updateComplete;
      expect(FakeCloseWatcher.active().length).toBe(1);
      FakeCloseWatcher.instances[0].requestClose();
      await el.updateComplete;
      expect(el.requests).toEqual(['back']);
      expect(FakeCloseWatcher.active().length).toBe(0);
    });

    it('stops listening when the surface closes', async () => {
      const el = await mount<TestInlineHost>('test-inline-host');
      el.expanded = true;
      el.requestUpdate();
      await el.updateComplete;
      el.expanded = false;
      el.requestUpdate();
      await el.updateComplete;
      expect(FakeCloseWatcher.active().length).toBe(0);
    });
  });

  describe('without CloseWatcher', () => {
    useCloseWatcher(false);

    it('falls back to Escape on the document', async () => {
      const el = await mount<TestInlineHost>('test-inline-host');
      el.expanded = true;
      el.requestUpdate();
      await el.updateComplete;
      await press('Escape');
      expect(el.requests).toEqual(['escape']);
    });
  });
});

describe('ModalSurfaceController focus', () => {
  // spec: dialogs-3e7f5f, dialogs-e430df
  it('moves focus to the first focusable element and restores it on close', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    trigger().focus();
    await el.controller.show();
    expect(el.shadowRoot!.activeElement).toBe(el.dialog.querySelector('#first'));
    await el.controller.close();
    expect(document.activeElement).toBe(trigger());
  });

  it('prefers an [autofocus] child of the host', async () => {
    const el = await mount<TestModalHost>(
      'test-modal-host',
      () => {},
      '<button id="auto" autofocus>Auto</button>',
    );
    await el.controller.show();
    expect(document.activeElement).toBe(el.querySelector('#auto'));
  });

  it('uses initialFocus when given', async () => {
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {
        initialFocus: () =>
          host.renderRoot.querySelector<HTMLElement>('#second'),
      };
    });
    await el.controller.show();
    expect(el.shadowRoot!.activeElement).toBe(el.dialog.querySelector('#second'));
  });

  it('focuses the surface when it holds nothing focusable', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    el.dialog.querySelectorAll('button').forEach((b) => b.remove());
    await el.controller.show();
    expect(el.shadowRoot!.activeElement).toBe(el.dialog);
  });

  it('does not move focus for a standard (non-modal) surface', async () => {
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.modal = false;
    });
    trigger().focus();
    await el.controller.show();
    expect(el.dialog.open).toBeTrue();
    expect(el.dialog.matches(':modal')).toBeFalse();
    expect(document.activeElement).toBe(trigger());
  });

  it('leaves focus the user moved elsewhere while it was open', async () => {
    const el = await mount<TestInlineHost>('test-inline-host');
    trigger().focus();
    el.expanded = true;
    el.requestUpdate();
    await el.updateComplete;
    await until(() => el.shadowRoot!.activeElement?.id === 'first');
    const other = document.createElement('button');
    container!.append(other);
    other.focus();
    el.expanded = false;
    el.requestUpdate();
    await el.updateComplete;
    expect(document.activeElement).toBe(other);
  });

  it('does not move focus into a surface that is open from the start (external)', async () => {
    container?.remove();
    container = document.createElement('div');
    document.body.append(container);
    container.innerHTML = '<button id="trigger">Trigger</button>';
    trigger().focus();
    const host = document.createElement('test-inline-host') as TestInlineHost;
    host.expanded = true;
    container.append(host);
    await host.updateComplete;
    expect(document.activeElement).toBe(trigger());
  });

  it('moves focus in, and restores it, for an external surface', async () => {
    const el = await mount<TestInlineHost>('test-inline-host');
    trigger().focus();
    el.expanded = true;
    el.requestUpdate();
    await el.updateComplete;
    await until(() => el.shadowRoot!.activeElement?.id === 'first');
    expect(el.shadowRoot!.activeElement?.id).toBe('first');
    el.expanded = false;
    el.requestUpdate();
    await el.updateComplete;
    expect(document.activeElement).toBe(trigger());
  });

  // spec: dialogs-8a70b0, dialogs-588469, dialogs-37b901, dialogs-534693
  it('cycles focus with Tab and Shift+Tab inside the surface', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    await el.controller.show();
    const id = () => el.shadowRoot!.activeElement?.id;
    expect(id()).toBe('first');
    await press('Tab');
    expect(id()).toBe('second');
    await press('Tab');
    expect(id()).withContext('wraps from last to first').toBe('first');
    await press('Shift+Tab');
    expect(id()).withContext('wraps from first to last').toBe('second');
  });

  it('can turn the focus trap off', async () => {
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.options = {trapFocus: () => false};
    });
    await el.controller.show();
    const second = el.dialog.querySelector<HTMLElement>('#second')!;
    second.focus();
    const tab = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    second.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBeFalse();
  });

  it('traps Tab inside an external surface, searching its shadow root', async () => {
    const el = await mount<TestInlineHost>('test-inline-host');
    el.expanded = true;
    el.requestUpdate();
    await el.updateComplete;
    await until(() => el.shadowRoot!.activeElement?.id === 'first');
    const id = () => el.shadowRoot!.activeElement?.id;
    await press('Tab');
    expect(id()).toBe('second');
    await press('Tab');
    expect(id()).toBe('first');
  });
});

describe('page scroll lock', () => {
  it('locks while a modal surface is open and releases it on close', async () => {
    const el = await mount<TestModalHost>('test-modal-host');
    expect(isLocked()).toBeFalse();
    await el.controller.show();
    expect(isLocked()).toBeTrue();
    expect(document.documentElement.hasAttribute(SCROLL_LOCK_ATTRIBUTE)).toBeTrue();
    await el.controller.close();
    expect(isLocked()).toBeFalse();
  });

  it('never locks for a standard surface', async () => {
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.modal = false;
    });
    await el.controller.show();
    expect(isLocked()).toBeFalse();
  });

  it('locks and releases as a surface turns modal and standard while open', async () => {
    const el = await mount<TestModalHost>('test-modal-host', (host) => {
      host.modal = false;
    });
    await el.controller.show();
    el.modal = true;
    el.requestUpdate();
    await el.updateComplete;
    expect(isLocked()).toBeTrue();
    expect(el.dialog.matches(':modal')).toBeTrue();
    el.modal = false;
    el.requestUpdate();
    await el.updateComplete;
    expect(isLocked()).toBeFalse();
    expect(el.dialog.matches(':modal')).toBeFalse();
  });

  it('locks for an external modal surface', async () => {
    const el = await mount<TestInlineHost>('test-inline-host');
    el.expanded = true;
    el.requestUpdate();
    await el.updateComplete;
    expect(isLocked()).toBeTrue();
    el.expanded = false;
    el.requestUpdate();
    await el.updateComplete;
    expect(isLocked()).toBeFalse();
  });

  it('keeps the lock until the last of several surfaces closes', async () => {
    const a = await mount<TestModalHost>('test-modal-host');
    const bHost = document.createElement('test-modal-host') as TestModalHost;
    container!.append(bHost);
    await bHost.updateComplete;
    await a.controller.show();
    await bHost.controller.show();
    await a.controller.close();
    expect(isLocked()).toBeTrue();
    await bHost.controller.close();
    expect(isLocked()).toBeFalse();
  });

  it('lockPageScroll() counts locks and ignores a second release', () => {
    const one = lockPageScroll();
    const two = lockPageScroll();
    expect(isLocked()).toBeTrue();
    one();
    one();
    expect(isLocked()).withContext('the second lock is still held').toBeTrue();
    two();
    expect(isLocked()).toBeFalse();
  });
});

class TestDelegating extends LitElement {
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  protected override render() {
    return html`<button id="inner1"></button><button id="inner2"></button>`;
  }
}
customElements.define('test-delegating', TestDelegating);

describe('focus helpers', () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement('div');
    document.body.append(root);
  });
  afterEach(() => root.remove());

  it('lists the focusable elements in order, skipping disabled, hidden and tabindex -1', () => {
    root.innerHTML = `
      <button id="a"></button>
      <button disabled></button>
      <button hidden></button>
      <button tabindex="-1"></button>
      <div tabindex="0" id="b"></div>
      <a href="#" id="c"></a>
      <div inert><button></button></div>`;
    expect(getFocusableElements(root).map((e) => e.id)).toEqual(['a', 'b', 'c']);
  });

  it('expands slots and walks shadow roots, counting delegating hosts once', () => {
    const host = document.createElement('div');
    host.attachShadow({mode: 'open'}).innerHTML =
      '<button id="x"></button><slot></slot>';
    host.innerHTML = '<button id="y"></button>';
    const delegating = document.createElement('test-delegating');
    delegating.id = 'delegating';
    root.append(host, delegating);
    expect(getFocusableElements(root).map((e) => e.id)).toEqual([
      'x',
      'y',
      'delegating',
    ]);
  });

  it('deepActiveElement() looks through shadow roots', () => {
    const host = document.createElement('div');
    host.attachShadow({mode: 'open'}).innerHTML = '<button id="in"></button>';
    root.append(host);
    host.shadowRoot!.querySelector<HTMLElement>('#in')!.focus();
    expect(deepActiveElement()?.id).toBe('in');
  });

  it('trapTabFocus() wraps at the ends and keeps focus on an empty surface', () => {
    root.innerHTML = '<button id="a"></button><button id="b"></button>';
    const [a, b] = root.querySelectorAll('button');
    const tab = (shift: boolean, from: Element) => {
      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: shift,
        bubbles: true,
        cancelable: true,
      });
      from.addEventListener('keydown', (e) => trapTabFocus(e as KeyboardEvent, root), {once: true});
      from.dispatchEvent(event);
      return event;
    };
    expect(tab(false, b).defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(a);
    expect(tab(true, a).defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(b);
    expect(tab(false, a).defaultPrevented).withContext('in the middle').toBeFalse();
  });
});

describe('ModalSurfaceController render check', () => {
  it('renders a host without a dialog option safely', async () => {
    container?.remove();
    container = document.createElement('div');
    document.body.append(container);
    class Plain extends LitElement {
      controller = new ModalSurfaceController(this);
      override render() {
        return html`<slot></slot>`;
      }
    }
    customElements.define('test-plain-modal', Plain);
    render(html`<test-plain-modal></test-plain-modal>`, container);
    const el = container.querySelector('test-plain-modal') as Plain;
    await el.updateComplete;
    await el.controller.show();
    expect(el.controller.open).toBeTrue();
    await el.controller.close();
    expect(el.controller.open).toBeFalse();
  });
});
