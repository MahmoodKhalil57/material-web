/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement, render} from 'lit';

import {
  canFocusItem,
  isRtl,
  nextFocusIndex,
  ROVING_KEYS,
  RovingFocusController,
  type RovingFocusOptions,
} from './roving-focus.js';

describe('nextFocusIndex()', () => {
  const all = () => true;

  it('moves to the next and previous item with Down/Up and Right/Left', () => {
    expect(nextFocusIndex(4, 1, 'ArrowDown')).toBe(2);
    expect(nextFocusIndex(4, 1, 'ArrowUp')).toBe(0);
    expect(nextFocusIndex(4, 1, 'ArrowRight')).toBe(2);
    expect(nextFocusIndex(4, 1, 'ArrowLeft')).toBe(0);
  });

  it('wraps at both ends by default', () => {
    expect(nextFocusIndex(4, 3, 'ArrowDown')).toBe(0);
    expect(nextFocusIndex(4, 0, 'ArrowUp')).toBe(3);
  });

  it('stops at the ends without wrap', () => {
    expect(nextFocusIndex(4, 3, 'ArrowDown', {wrap: false})).toBe(-1);
    expect(nextFocusIndex(4, 0, 'ArrowUp', {wrap: false})).toBe(-1);
    expect(nextFocusIndex(4, 1, 'ArrowDown', {wrap: false})).toBe(2);
  });

  it('mirrors Left and Right in RTL, not Up and Down', () => {
    expect(nextFocusIndex(4, 1, 'ArrowRight', {rtl: true})).toBe(0);
    expect(nextFocusIndex(4, 1, 'ArrowLeft', {rtl: true})).toBe(2);
    expect(nextFocusIndex(4, 1, 'ArrowDown', {rtl: true})).toBe(2);
  });

  it('only handles the arrows of its orientation', () => {
    expect(nextFocusIndex(4, 1, 'ArrowDown', {orientation: 'horizontal'})).toBe(-1);
    expect(nextFocusIndex(4, 1, 'ArrowRight', {orientation: 'horizontal'})).toBe(2);
    expect(nextFocusIndex(4, 1, 'ArrowRight', {orientation: 'vertical'})).toBe(-1);
    expect(nextFocusIndex(4, 1, 'ArrowDown', {orientation: 'vertical'})).toBe(2);
  });

  it('moves to the first and last item with Home and End', () => {
    expect(nextFocusIndex(4, 2, 'Home')).toBe(0);
    expect(nextFocusIndex(4, 1, 'End')).toBe(3);
    expect(nextFocusIndex(4, 1, 'Home', {homeEnd: false})).toBe(-1);
  });

  it('skips items that cannot take focus, also for Home and End', () => {
    const canFocus = (i: number) => i !== 2 && i !== 0;
    expect(nextFocusIndex(4, 1, 'ArrowDown', {canFocus})).toBe(3);
    expect(nextFocusIndex(4, 3, 'ArrowDown', {canFocus})).toBe(1);
    expect(nextFocusIndex(4, 3, 'Home', {canFocus})).toBe(1);
    expect(nextFocusIndex(4, 1, 'End', {canFocus: (i) => i !== 3})).toBe(2);
  });

  it('enters at the first or last focusable item when none is focused', () => {
    expect(nextFocusIndex(4, -1, 'ArrowDown', {canFocus: (i) => i > 0})).toBe(1);
    expect(nextFocusIndex(4, -1, 'ArrowUp', {canFocus: (i) => i < 3})).toBe(2);
  });

  it('returns -1 for other keys, empty groups and groups with nothing focusable', () => {
    expect(nextFocusIndex(4, 1, 'Enter')).toBe(-1);
    expect(nextFocusIndex(4, 1, 'PageDown')).toBe(-1);
    expect(nextFocusIndex(0, -1, 'ArrowDown')).toBe(-1);
    expect(nextFocusIndex(3, 0, 'ArrowDown', {canFocus: (i) => i === 0})).toBe(-1);
    expect(nextFocusIndex(3, 0, 'End', {canFocus: () => false})).toBe(-1);
  });

  it('lists exactly the keys it handles', () => {
    expect([...ROVING_KEYS].sort()).toEqual(
      ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home'],
    );
    expect(nextFocusIndex(2, 0, 'ArrowDown', {canFocus: all})).toBe(1);
  });
});

describe('isRtl() and canFocusItem()', () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement('div');
    document.body.append(root);
  });
  afterEach(() => root.remove());

  it('reads the direction from dir, inheritance and CSS direction', () => {
    root.innerHTML = '<div dir="rtl"><span></span></div><div><span></span></div><div style="direction: rtl"><span></span></div>';
    const [rtl, ltr, css] = root.querySelectorAll('span');
    expect(isRtl(rtl)).toBeTrue();
    expect(isRtl(ltr)).toBeFalse();
    expect(isRtl(css)).toBeTrue();
  });

  it('rejects hidden and disabled items but keeps soft-disabled ones', () => {
    root.innerHTML = '<button></button><button hidden></button><button disabled></button>';
    const [plain, hidden, disabled] = root.querySelectorAll('button');
    expect(canFocusItem(plain)).toBeTrue();
    expect(canFocusItem(hidden)).toBeFalse();
    expect(canFocusItem(disabled)).toBeFalse();
    const soft = Object.assign(document.createElement('div'), {disabled: true, softDisabled: true});
    expect(canFocusItem(soft)).toBeTrue();
    const hard = Object.assign(document.createElement('div'), {disabled: true});
    expect(canFocusItem(hard)).toBeFalse();
  });
});

/** A minimal composite host: items are its `<button>` children. */
class TestRovingHost extends LitElement {
  options: Partial<RovingFocusOptions> = {};
  controller!: RovingFocusController;

  override connectedCallback() {
    this.controller ??= new RovingFocusController(this, {
      items: () => Array.from(this.querySelectorAll<HTMLElement>(':scope > button, :scope > test-roving-item')),
      ...this.options,
    });
    super.connectedCallback();
  }

  protected override render() {
    return html`<slot></slot>`;
  }
}
customElements.define('test-roving-host', TestRovingHost);

/** An item that takes focus inside its own shadow root. */
class TestRovingItem extends LitElement {
  static override shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true};
  protected override render() {
    return html`<button>inner</button>`;
  }
}
customElements.define('test-roving-item', TestRovingItem);

describe('RovingFocusController', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.append(root);
  });
  afterEach(() => {
    render(html``, root);
    root.remove();
  });

  async function setup(
    options: Partial<RovingFocusOptions> = {},
    items = html`<button>a</button><button>b</button><button>c</button><button>d</button>`,
    dir = 'ltr',
  ) {
    const host = document.createElement('test-roving-host') as TestRovingHost;
    host.options = options;
    host.dir = dir;
    render(items, host);
    root.append(host);
    await host.updateComplete;
    const buttons = Array.from(host.children) as HTMLElement[];
    return {host, buttons};
  }

  function press(target: Element, key: string, init: KeyboardEventInit = {}) {
    const event = new KeyboardEvent('keydown', {key, bubbles: true, composed: true, cancelable: true, ...init});
    target.dispatchEvent(event);
    return event;
  }

  const active = () => {
    let el = document.activeElement;
    while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
    return el;
  };

  it('keeps exactly one tab stop, on the first focusable item', async () => {
    const {buttons} = await setup({}, html`<button disabled>a</button><button>b</button><button>c</button>`);
    expect(buttons.map((b) => b.tabIndex)).toEqual([-1, 0, -1]);
  });

  it('moves focus and the tab stop with the arrow keys, and prevents the default', async () => {
    const {buttons} = await setup();
    buttons[0].focus();
    const event = press(buttons[0], 'ArrowDown');
    expect(event.defaultPrevented).toBeTrue();
    expect(active()).toBe(buttons[1]);
    expect(buttons.map((b) => b.tabIndex)).toEqual([-1, 0, -1, -1]);
  });

  it('wraps, and moves to the ends with Home and End', async () => {
    const {buttons} = await setup();
    buttons[3].focus();
    press(buttons[3], 'ArrowRight');
    expect(active()).toBe(buttons[0]);
    press(buttons[0], 'End');
    expect(active()).toBe(buttons[3]);
    press(buttons[3], 'Home');
    expect(active()).toBe(buttons[0]);
  });

  it('stops at the ends when wrap is off, without preventing the key', async () => {
    const {buttons} = await setup({wrap: false});
    buttons[3].focus();
    const event = press(buttons[3], 'ArrowDown');
    expect(event.defaultPrevented).toBeFalse();
    expect(active()).toBe(buttons[3]);
  });

  it('mirrors Left and Right in RTL', async () => {
    const {buttons} = await setup({orientation: 'horizontal'}, undefined, 'rtl');
    buttons[1].focus();
    press(buttons[1], 'ArrowLeft');
    expect(active()).toBe(buttons[2]);
    press(buttons[2], 'ArrowRight');
    expect(active()).toBe(buttons[1]);
  });

  it('ignores the arrows of the other orientation', async () => {
    const {buttons} = await setup({orientation: 'horizontal'});
    buttons[1].focus();
    const event = press(buttons[1], 'ArrowDown');
    expect(event.defaultPrevented).toBeFalse();
    expect(active()).toBe(buttons[1]);
  });

  it('skips disabled items and keeps soft-disabled ones reachable', async () => {
    const {buttons} = await setup(
      {},
      html`<button>a</button><button disabled>b</button><button aria-disabled="true">c</button>`,
    );
    Object.assign(buttons[2], {disabled: false, softDisabled: true});
    buttons[0].focus();
    press(buttons[0], 'ArrowDown');
    expect(active()).toBe(buttons[2]);
  });

  it('leaves keys with modifiers, other keys and prevented keys alone', async () => {
    const {buttons} = await setup();
    buttons[0].focus();
    for (const init of [{altKey: true}, {ctrlKey: true}, {metaKey: true}, {shiftKey: true}]) {
      expect(press(buttons[0], 'ArrowDown', init).defaultPrevented).toBeFalse();
    }
    expect(press(buttons[0], 'Enter').defaultPrevented).toBeFalse();
    const prevented = new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true, cancelable: true});
    prevented.preventDefault();
    buttons[0].dispatchEvent(prevented);
    expect(active()).toBe(buttons[0]);
  });

  it('follows focus that arrives another way (click, Tab, script)', async () => {
    const {buttons} = await setup();
    buttons[2].focus();
    expect(buttons.map((b) => b.tabIndex)).toEqual([-1, -1, 0, -1]);
  });

  it('moves the tab stop off an item that becomes disabled on sync()', async () => {
    const {host, buttons} = await setup();
    buttons[1].focus();
    (buttons[1] as HTMLButtonElement).disabled = true;
    host.controller.sync();
    expect(buttons.map((b) => b.tabIndex)).toEqual([0, -1, -1, -1]);
  });

  it('leaves the tab order alone with tabStops "all"', async () => {
    const {buttons} = await setup({tabStops: 'all'});
    expect(buttons.map((b) => b.tabIndex)).toEqual([0, 0, 0, 0]);
    buttons[0].focus();
    press(buttons[0], 'ArrowDown');
    expect(active()).toBe(buttons[1]);
    expect(buttons.map((b) => b.tabIndex)).toEqual([0, 0, 0, 0]);
  });

  it('finds the item through shadow roots (events from inner elements)', async () => {
    const {buttons} = await setup(
      {},
      html`<test-roving-item></test-roving-item><test-roving-item></test-roving-item>`,
    );
    await Promise.all(buttons.map((b) => (b as LitElement).updateComplete));
    const inner = buttons[0].shadowRoot!.querySelector('button')!;
    inner.focus();
    press(inner, 'ArrowDown');
    expect(active()).toBe(buttons[1].shadowRoot!.querySelector('button'));
  });

  it('uses the custom tab stop, focus and move hooks', async () => {
    const stops: string[] = [];
    const moves: string[] = [];
    const {buttons} = await setup({
      setTabStop: (item, stop) => {
        if (stop) stops.push(item.textContent!);
      },
      focusItem: (item) => item.focus(),
      onMove: (item, from) => moves.push(`${from?.textContent}->${item.textContent}`),
    });
    buttons[0].focus();
    press(buttons[0], 'ArrowDown');
    expect(stops).toContain('b');
    expect(moves).toEqual(['a->b']);
  });

  it('starts the tab stop on initialTabStop, else the first focusable item', async () => {
    const {buttons} = await setup({initialTabStop: (items) => items.find((b) => b.hasAttribute('data-selected'))},
      html`<button>a</button><button data-selected>b</button><button>c</button>`);
    expect(buttons.map((b) => b.tabIndex)).toEqual([-1, 0, -1]);
    const plain = await setup({initialTabStop: () => undefined});
    expect(plain.buttons.map((b) => b.tabIndex)).toEqual([0, -1, -1, -1]);
  });

  it('tells focusItem the direction of the move, in reading order', async () => {
    const seen: number[] = [];
    const {buttons} = await setup(
      {focusItem: (item, direction) => (seen.push(direction), item.focus())},
      undefined,
      'rtl',
    );
    buttons[1].focus();
    press(buttons[1], 'ArrowLeft'); // forward in RTL
    press(buttons[2], 'ArrowRight'); // backward in RTL
    press(buttons[1], 'ArrowDown');
    press(buttons[2], 'Home');
    expect(seen).toEqual([1, -1, 1, 0]);
  });

  it('stops listening when disconnected', async () => {
    const {host, buttons} = await setup();
    host.remove();
    root.append(...buttons);
    buttons[0].focus();
    expect(press(buttons[0], 'ArrowDown').defaultPrevented).toBeFalse();
  });
});
