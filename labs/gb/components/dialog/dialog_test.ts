/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../button/md-gb-button.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import {
  DIALOG_CLASSES,
  dialogClasses,
  getFocusableElements,
  setupDialog,
} from './dialog.js';
import dialogStyles from './dialog.cssresult.js';
import {DialogElement} from './dialog-element.js';
import './md-gb-dialog.js';

// Environment replaces requestAnimationFrame with a mocked setTimeout; keep
// the real one to wait for IntersectionObserver deliveries.
const nextFrame = (() => {
  const raf = window.requestAnimationFrame.bind(window);
  return () => new Promise<void>((resolve) => {
    raf(() => {
      resolve();
    });
  });
})();

// The utility classes must be styled in the document for Light DOM usage.
adoptStyles(document, dialogStyles);

function getDialog(el: DialogElement) {
  const dialog = el.shadowRoot?.querySelector('dialog');
  if (!dialog) {
    throw new Error('Missing inner <dialog>');
  }
  return dialog;
}

function getDeepActiveElement() {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

function pressTab(shiftKey = false) {
  const target = getDeepActiveElement() ?? document.body;
  const event = new KeyboardEvent('keydown', {
    key: 'Tab',
    shiftKey,
    bubbles: true,
    composed: true,
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event;
}

describe('<md-gb-dialog>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`<md-gb-dialog quick>
      <span slot="headline">Reset settings?</span>
      This will reset your app preferences.
      <md-gb-button slot="actions" class="cancel" value="cancel"
        >Cancel</md-gb-button
      >
      <md-gb-button slot="actions" class="accept" value="accept"
        >Accept</md-gb-button
      >
    </md-gb-dialog>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const el = root.querySelector('md-gb-dialog');
    if (!el) {
      throw new Error('Failed to query rendered <md-gb-dialog>');
    }
    return {root, el, dialog: getDialog(el)};
  }

  afterEach(() => {
    for (const el of document.querySelectorAll('md-gb-dialog')) {
      getDialog(el).close();
    }
  });

  describe('initial properties', () => {
    it('initializes with default values', async () => {
      const {el, dialog} = await setupTest();
      expect(el.open).toBeFalse();
      expect(el.fullScreen).toBeFalse();
      expect(el.quick).toBeTrue();
      expect(el.returnValue).toBe('');
      expect(el.type).toBe('');
      expect(el.noFocusTrap).toBeFalse();
      expect(el.closeLabel).toBe('Close');
      expect(dialog.open).toBeFalse();
    });

    it('renders a native dialog with dialog classes', async () => {
      const {dialog} = await setupTest();
      expect(dialog.classList).toContain(DIALOG_CLASSES.dialog);
      expect(dialog.classList).toContain(DIALOG_CLASSES.hasHeadline);
      expect(dialog.classList).toContain(DIALOG_CLASSES.hasActions);
      expect(dialog.classList).not.toContain(DIALOG_CLASSES.hasIcon);
    });

    it('opens when rendered with the open attribute', async () => {
      const {el, dialog} = await setupTest(
        html`<md-gb-dialog open quick>
          <span slot="headline">Title</span>
          Content
        </md-gb-dialog>`,
      );
      await env.waitForStability();
      expect(el.open).toBeTrue();
      expect(dialog.open).toBeTrue();
      expect(dialog.matches(':modal')).toBeTrue();
    });
  });

  describe('accessibility', () => {
    // spec: dialogs-bad019
    it('is an alert dialog by default (basic)', async () => {
      const {dialog} = await setupTest();
      expect(dialog.getAttribute('role')).toBe('alertdialog');
    });

    it('is a dialog when full-screen', async () => {
      const {el, dialog} = await setupTest();
      el.fullScreen = true;
      await el.updateComplete;
      expect(dialog.getAttribute('role')).toBe('dialog');
    });

    it('uses the type property for the role', async () => {
      const {el, dialog} = await setupTest();
      el.type = 'dialog';
      await el.updateComplete;
      expect(dialog.getAttribute('role')).toBe('dialog');
      el.type = 'alert';
      el.fullScreen = true;
      await el.updateComplete;
      expect(dialog.getAttribute('role')).toBe('alertdialog');
    });

    // spec: dialogs-f42094
    it('is labelled by the headline and described by the content', async () => {
      const {el, dialog} = await setupTest();
      expect(dialog.getAttribute('aria-labelledby')).toBe('headline');
      expect(dialog.getAttribute('aria-describedby')).toBe('content');
      const headline = el.shadowRoot!.getElementById('headline')!;
      expect(headline.localName).toBe('h2');
      const content = el.shadowRoot!.getElementById('content')!;
      expect(content.querySelector('slot:not([name])')).not.toBeNull();
    });

    it('uses aria-label instead of the headline when set', async () => {
      const {dialog} = await setupTest(
        html`<md-gb-dialog quick aria-label="Settings">
          <span slot="headline">Title</span>
        </md-gb-dialog>`,
      );
      expect(dialog.getAttribute('aria-label')).toBe('Settings');
      expect(dialog.hasAttribute('aria-labelledby')).toBeFalse();
      expect(dialog.hasAttribute('aria-describedby')).toBeFalse();
    });

    it('hides the hero icon from assistive technology', async () => {
      const {el, dialog} = await setupTest(
        html`<md-gb-dialog quick>
          <svg slot="icon" viewBox="0 0 24 24"></svg>
          <span slot="headline">Title</span>
        </md-gb-dialog>`,
      );
      expect(dialog.classList).toContain(DIALOG_CLASSES.hasIcon);
      const icon = el.shadowRoot!.querySelector('.dialog-icon')!;
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('show() and close()', () => {
    // spec: dialogs-e3e81c
    it('opens as a modal and closes', async () => {
      const {el, dialog} = await setupTest();
      await el.show();
      expect(el.open).toBeTrue();
      expect(el.hasAttribute('open')).toBeTrue();
      expect(dialog.open).toBeTrue();
      expect(dialog.matches(':modal')).toBeTrue();

      await el.close();
      expect(el.open).toBeFalse();
      expect(dialog.open).toBeFalse();
      await el.updateComplete;
      expect(el.hasAttribute('open')).toBeFalse();
    });

    it('opens and closes through the open property', async () => {
      const {el, dialog} = await setupTest();
      const opened = new Promise((resolve) => {
        el.addEventListener('opened', resolve, {once: true});
      });
      el.open = true;
      await opened;
      expect(dialog.open).toBeTrue();

      const closed = new Promise((resolve) => {
        el.addEventListener('closed', resolve, {once: true});
      });
      el.open = false;
      await closed;
      expect(dialog.open).toBeFalse();
    });

    it('fires open, opened, close and closed events', async () => {
      const {el} = await setupTest();
      const events: string[] = [];
      for (const type of ['open', 'opened', 'close', 'closed']) {
        el.addEventListener(type, () => events.push(type));
      }
      await el.show();
      await el.close();
      expect(events).toEqual(['open', 'opened', 'close', 'closed']);
    });

    it('does not open when open is canceled', async () => {
      const {el, dialog} = await setupTest();
      el.addEventListener('open', (event) => event.preventDefault());
      await el.show();
      expect(el.open).toBeFalse();
      expect(dialog.open).toBeFalse();
    });

    it('stays open when close is canceled and keeps returnValue', async () => {
      const {el, dialog} = await setupTest();
      await el.show();
      el.returnValue = 'before';
      el.addEventListener('close', (event) => event.preventDefault(), {
        once: true,
      });
      await el.close('after');
      expect(el.open).toBeTrue();
      expect(dialog.open).toBeTrue();
      expect(el.returnValue).toBe('before');
    });

    it('sets returnValue from close(returnValue)', async () => {
      const {el} = await setupTest();
      await el.show();
      let valueDuringClose = '';
      el.addEventListener('close', () => {
        valueDuringClose = el.returnValue;
      });
      await el.close('accept');
      expect(valueDuringClose).toBe('accept');
      expect(el.returnValue).toBe('accept');
    });

    it('closes with the submitter value of a method="dialog" form', async () => {
      const {el} = await setupTest(
        html`<md-gb-dialog quick>
          <span slot="headline">Title</span>
          <form id="form" method="dialog"></form>
          <md-gb-button slot="actions" form="form" value="ok"
            >OK</md-gb-button
          >
        </md-gb-dialog>`,
      );
      await el.show();
      const closed = new Promise((resolve) => {
        el.addEventListener('closed', resolve, {once: true});
      });
      const form = el.querySelector('form')!;
      const submitter = document.createElement('button');
      submitter.value = 'ok';
      submitter.setAttribute('value', 'ok');
      form.append(submitter);
      form.requestSubmit(submitter);
      await closed;
      expect(el.open).toBeFalse();
      expect(el.returnValue).toBe('ok');
    });

    it('waits for its CSS transitions when not quick', async () => {
      const {el, dialog} = await setupTest();
      el.quick = false;
      await el.updateComplete;
      await el.show();
      expect(dialog.open).toBeTrue();
      const closing = el.close();
      await el.updateComplete;
      expect(dialog.classList).toContain(DIALOG_CLASSES.closing);
      expect(dialog.open).withContext('open during exit').toBeTrue();
      await closing;
      expect(dialog.open).toBeFalse();
      expect(dialog.classList).not.toContain(DIALOG_CLASSES.closing);
    });
  });

  describe('cancel', () => {
    it('cancels on Escape (native cancel)', async () => {
      const {el, dialog} = await setupTest();
      await el.show();
      el.returnValue = 'unchanged';
      const cancelSpy = jasmine.createSpy('cancel');
      el.addEventListener('cancel', cancelSpy);
      const closed = new Promise((resolve) => {
        el.addEventListener('closed', resolve, {once: true});
      });
      const nativeCancel = new Event('cancel', {cancelable: true});
      dialog.dispatchEvent(nativeCancel);
      expect(nativeCancel.defaultPrevented)
        .withContext('native cancel is prevented to animate out')
        .toBeTrue();
      await closed;
      expect(cancelSpy).toHaveBeenCalledTimes(1);
      expect(el.open).toBeFalse();
      expect(el.returnValue).toBe('unchanged');
    });

    it('stays open when cancel is prevented', async () => {
      const {el, dialog} = await setupTest();
      await el.show();
      el.addEventListener('cancel', (event) => event.preventDefault());
      dialog.dispatchEvent(new Event('cancel', {cancelable: true}));
      await env.waitForStability();
      expect(el.open).toBeTrue();
      expect(dialog.open).toBeTrue();
    });

    it('cancels on a scrim click', async () => {
      const {el, dialog} = await setupTest();
      await el.show();
      const cancelSpy = jasmine.createSpy('cancel');
      el.addEventListener('cancel', cancelSpy);
      const init = {bubbles: true, composed: true, clientX: 1, clientY: 1};
      dialog.dispatchEvent(new PointerEvent('pointerdown', init));
      dialog.dispatchEvent(new MouseEvent('click', init));
      expect(cancelSpy).toHaveBeenCalledTimes(1);
      await env.waitForStability();
      expect(el.open).toBeFalse();
    });

    it('does not cancel on a click inside the dialog', async () => {
      const {el} = await setupTest();
      await el.show();
      const cancelSpy = jasmine.createSpy('cancel');
      el.addEventListener('cancel', cancelSpy);
      const content = el.shadowRoot!.querySelector<HTMLElement>(
        '.dialog-content',
      )!;
      const rect = content.getBoundingClientRect();
      const init = {
        bubbles: true,
        composed: true,
        clientX: rect.left + 2,
        clientY: rect.top + 2,
      };
      content.dispatchEvent(new PointerEvent('pointerdown', init));
      content.dispatchEvent(new MouseEvent('click', init));
      expect(cancelSpy).not.toHaveBeenCalled();
      expect(el.open).toBeTrue();
    });

    it('syncs state when the browser closes the dialog', async () => {
      const {el, dialog} = await setupTest();
      await el.show();
      const closedSpy = jasmine.createSpy('closed');
      el.addEventListener('closed', closedSpy);
      dialog.close('forced');
      await new Promise((resolve) => {
        dialog.addEventListener('close', resolve, {once: true});
      });
      expect(el.open).toBeFalse();
      expect(el.returnValue).toBe('forced');
      expect(closedSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('focus', () => {
    it('focuses the first focusable element on open', async () => {
      const {el} = await setupTest();
      await el.show();
      expect(document.activeElement).toBe(el.querySelector('.cancel'));
    });

    it('focuses an autofocus child on open', async () => {
      const {el} = await setupTest(
        html`<md-gb-dialog quick>
          <span slot="headline">Title</span>
          <input class="field" />
          <md-gb-button slot="actions" autofocus class="ok">OK</md-gb-button>
        </md-gb-dialog>`,
      );
      await el.show();
      expect(document.activeElement).toBe(el.querySelector('.ok'));
    });

    it('focuses the dialog when there is nothing focusable', async () => {
      const {el, dialog} = await setupTest(
        html`<md-gb-dialog quick>
          <span slot="headline">Title</span>
          Text only
        </md-gb-dialog>`,
      );
      await el.show();
      expect(el.shadowRoot!.activeElement).toBe(dialog);
    });

    it('restores focus to the previously focused element on close', async () => {
      const {root, el} = await setupTest();
      const opener = document.createElement('button');
      root.prepend(opener);
      opener.focus();
      await el.show();
      expect(document.activeElement).not.toBe(opener);
      await el.close();
      expect(document.activeElement).toBe(opener);
    });

    // spec: dialogs-a0ef2d, dialogs-ff0390
    it('traps Tab focus inside the dialog', async () => {
      const {el} = await setupTest();
      await el.show();
      const cancel = el.querySelector<HTMLElement>('.cancel')!;
      const accept = el.querySelector<HTMLElement>('.accept')!;
      accept.focus();
      expect(pressTab().defaultPrevented).toBeTrue();
      expect(document.activeElement).toBe(cancel);
      expect(pressTab(true).defaultPrevented).toBeTrue();
      expect(document.activeElement).toBe(accept);
    });

    it('lets Tab move normally between middle elements', async () => {
      const {el} = await setupTest();
      await el.show();
      el.querySelector<HTMLElement>('.cancel')!.focus();
      expect(pressTab().defaultPrevented).toBeFalse();
    });

    it('does not trap focus with no-focus-trap', async () => {
      const {el} = await setupTest();
      el.noFocusTrap = true;
      await el.updateComplete;
      await el.show();
      el.querySelector<HTMLElement>('.accept')!.focus();
      expect(pressTab().defaultPrevented).toBeFalse();
    });
  });

  describe('full-screen', () => {
    async function setupFullScreen() {
      return setupTest(
        html`<md-gb-dialog quick full-screen close-label="Discard">
          <span slot="headline">New event</span>
          <input class="field" />
          <md-gb-button slot="actions" class="save" value="save"
            >Save</md-gb-button
          >
        </md-gb-dialog>`,
      );
    }

    // spec: dialogs-f7459c, dialogs-4e6044
    it('renders a close button and the actions in the header', async () => {
      const {el} = await setupFullScreen();
      const header = el.shadowRoot!.querySelector('.dialog-header')!;
      const close = header.querySelector('.dialog-close')!;
      expect(close).not.toBeNull();
      expect(close.getAttribute('aria-label')).toBe('Discard');
      expect(
        header.querySelector('.dialog-header-actions slot[name="actions"]'),
      ).not.toBeNull();
      expect(el.shadowRoot!.querySelector('.dialog-actions')).toBeNull();
    });

    // spec: dialogs-1bb3d9, dialogs-6777bc
    it('fills the window', async () => {
      const {el, dialog} = await setupFullScreen();
      await el.show();
      const rect = dialog.getBoundingClientRect();
      expect(rect.width).toBe(window.innerWidth);
      expect(rect.height).toBe(window.innerHeight);
      const header = el.shadowRoot!.querySelector('.dialog-header')!;
      expect(header.getBoundingClientRect().height).toBe(56);
    });

    it('focuses the close button first', async () => {
      const {el} = await setupFullScreen();
      await el.show();
      expect(el.shadowRoot!.activeElement).toBe(
        el.shadowRoot!.querySelector('.dialog-close'),
      );
    });

    it('cancels when the close button is clicked', async () => {
      const {el} = await setupFullScreen();
      await el.show();
      const cancelSpy = jasmine.createSpy('cancel');
      el.addEventListener('cancel', cancelSpy);
      el.shadowRoot!.querySelector<HTMLElement>('.dialog-close')!.click();
      await env.waitForStability();
      expect(cancelSpy).toHaveBeenCalledTimes(1);
      expect(el.open).toBeFalse();
    });

    it('does not cancel on clicks outside (no scrim)', async () => {
      const {el, dialog} = await setupFullScreen();
      await el.show();
      const cancelSpy = jasmine.createSpy('cancel');
      el.addEventListener('cancel', cancelSpy);
      const init = {bubbles: true, composed: true, clientX: 1, clientY: 1};
      dialog.dispatchEvent(new PointerEvent('pointerdown', init));
      dialog.dispatchEvent(new MouseEvent('click', init));
      expect(cancelSpy).not.toHaveBeenCalled();
    });

    it('traps focus across the header and the content', async () => {
      const {el} = await setupFullScreen();
      await el.show();
      const close = el.shadowRoot!.querySelector('.dialog-close');
      const field = el.querySelector<HTMLElement>('.field')!;
      field.focus();
      // Flat tree order: close, Save (header), field (content).
      expect(pressTab().defaultPrevented).toBeTrue();
      expect(el.shadowRoot!.activeElement).toBe(close);
    });
  });

  describe('layout', () => {
    it('sizes basic dialogs between 280px and 560px', async () => {
      const {el, dialog} = await setupTest(
        html`<md-gb-dialog quick>
          <span slot="headline">Title</span>
          <div style="inline-size: 2000px"></div>
        </md-gb-dialog>`,
      );
      await el.show();
      expect(dialog.getBoundingClientRect().width).toBe(
        Math.min(560, window.innerWidth - 48),
      );
      el.innerHTML = '<span slot="headline">A</span>';
      await env.waitForStability();
      expect(dialog.getBoundingClientRect().width).toBe(280);
    });

    it('shows dividers only when the content scrolls', async () => {
      const {el, dialog} = await setupTest(
        html`<md-gb-dialog quick>
          <span slot="headline">Title</span>
          <div style="block-size: 4000px"></div>
          <md-gb-button slot="actions">OK</md-gb-button>
        </md-gb-dialog>`,
      );
      await el.show();
      // IntersectionObserver delivers on a later frame; how many frames that
      // takes depends on load, so wait for it (up to ~2s) instead of a fixed
      // number of frames.
      for (
        let frames = 0;
        frames < 120 && !dialog.classList.contains(DIALOG_CLASSES.scrollable);
        frames++
      ) {
        await nextFrame();
      }
      await el.updateComplete;
      expect(dialog.classList).toContain(DIALOG_CLASSES.scrollable);
      expect(dialog.classList).toContain(DIALOG_CLASSES.scrolledFromBottom);
      expect(dialog.classList).not.toContain(DIALOG_CLASSES.scrolledFromTop);
      const bottom = el.shadowRoot!.querySelector('.dialog-divider-bottom')!;
      const top = el.shadowRoot!.querySelector('.dialog-divider-top')!;
      expect(getComputedStyle(bottom).visibility).toBe('visible');
      expect(getComputedStyle(top).visibility).toBe('hidden');
    });
  });
});

describe('dialogClasses()', () => {
  it('returns the base class', () => {
    expect(dialogClasses()).toEqual(
      jasmine.objectContaining({[DIALOG_CLASSES.dialog]: true}),
    );
  });

  it('only marks scroll edges when scrollable', () => {
    const classes = dialogClasses({scrolledFromTop: true});
    expect(classes[DIALOG_CLASSES.scrolledFromTop]).toBeFalse();
    const scrolling = dialogClasses({scrollable: true, scrolledFromTop: true});
    expect(scrolling[DIALOG_CLASSES.scrolledFromTop]).toBeTrue();
  });
});

describe('setupDialog()', () => {
  const env = new Environment();

  it('traps focus in a Light DOM dialog', async () => {
    const root = env.render(
      html`<dialog class="dialog">
        <button class="a">A</button><button class="b">B</button>
      </dialog>`,
    );
    const dialog = root.querySelector('dialog')!;
    const controller = new AbortController();
    setupDialog(dialog, {signal: controller.signal});
    dialog.showModal();
    const [a, b] = getFocusableElements(dialog);
    expect(a.className).toBe('a');
    b.focus();
    expect(pressTab().defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(a);
    controller.abort();
    b.focus();
    expect(pressTab().defaultPrevented).toBeFalse();
    dialog.close();
  });
});
