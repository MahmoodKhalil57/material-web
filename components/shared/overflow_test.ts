/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement, render as litRender} from 'lit';
import {
  OVERFLOW_HIDDEN_ATTRIBUTE,
  OverflowController,
  overflowLabel,
  overflowStyles,
} from './overflow.js';
import {until} from './central/subjects.js';

/** A row of 50px items and a 30px trigger that must fit its container. */
class OverflowHost extends LitElement {
  static override styles = [overflowStyles];
  static override properties = {on: {type: Boolean}};
  on = true;

  readonly overflowing = new OverflowController(this, {
    items: () => Array.from(this.querySelectorAll<HTMLElement>('.item')),
    container: () => this.renderRoot.querySelector<HTMLElement>('.row'),
    trigger: () => this.renderRoot.querySelector<HTMLElement>('.trigger'),
    menu: () => null,
    enabled: () => this.on,
  });

  protected override render() {
    return html`<div class="row" style="display: flex; gap: 0">
      <slot></slot>
      <button class="trigger" style="width: 30px; flex: none">more</button>
    </div>`;
  }
}
customElements.define('test-overflow-host', OverflowHost);

describe('OverflowController', () => {
  let container: HTMLElement;
  let host: OverflowHost;
  let box: HTMLElement;

  async function setup(count = 6, width = 1000) {
    container = document.createElement('div');
    document.body.appendChild(container);
    litRender(
      html`<div id="box" style="width: ${width}px"
        ><test-overflow-host
          >${Array.from(
            {length: count},
            (_, i) =>
              html`<button
                class="item"
                style="width: 50px; flex: none"
                aria-label=${'Item ' + i}
                >${i}</button
              >`,
          )}</test-overflow-host
        ></div
      >`,
      container,
    );
    host = container.querySelector('test-overflow-host') as OverflowHost;
    box = container.querySelector('#box') as HTMLElement;
    await host.updateComplete;
  }

  afterEach(() => {
    container?.remove();
  });

  const items = () => Array.from(host.querySelectorAll<HTMLElement>('.item'));
  const hidden = () => items().filter((i) => i.hidden);
  const trigger = () => host.shadowRoot!.querySelector<HTMLElement>('.trigger')!;

  it('keeps everything when it fits and hides the trigger', async () => {
    await setup(6, 1000);
    // The trigger starts shown, so hiding it proves a measurement ran.
    expect(await until(() => trigger().hidden)).toBeTrue();
    expect(hidden().length).toBe(0);
    expect(trigger().hasAttribute(OVERFLOW_HIDDEN_ATTRIBUTE)).toBeTrue();
    expect(host.overflowing.overflowed.length).toBe(0);
    // Measuring does hide items when they do not fit, and returns them.
    box.style.width = '150px';
    expect(await until(() => hidden().length > 0)).toBeTrue();
    box.style.width = '1000px';
    expect(await until(() => hidden().length === 0 && trigger().hidden)).toBeTrue();
  });

  it('hides trailing items until the rest and the trigger fit, and returns them', async () => {
    await setup(6, 200);
    // 200px: three 50px items and the 30px trigger.
    expect(await until(() => hidden().length === 3)).toBeTrue();
    expect(hidden()).toEqual(items().slice(3));
    expect(host.overflowing.overflowed).toEqual(items().slice(3));
    expect(trigger().hidden).toBeFalse();
    expect(items()[3].hasAttribute(OVERFLOW_HIDDEN_ATTRIBUTE)).toBeTrue();
    expect(getComputedStyle(items()[3]).display).toBe('none');

    box.style.width = '280px';
    expect(await until(() => hidden().length === 1)).toBeTrue();
    box.style.width = '1000px';
    expect(await until(() => hidden().length === 0 && trigger().hidden)).toBeTrue();
  });

  it('shows all items without the trigger when they fit exactly', async () => {
    await setup(4, 200);
    // The trigger starts shown, so hiding it proves a measurement ran.
    expect(await until(() => trigger().hidden)).toBeTrue();
    expect(hidden().length).toBe(0);
    // Narrower than the items and the last one no longer fits.
    box.style.width = '190px';
    expect(await until(() => hidden().length > 0)).toBeTrue();
  });

  it('does nothing while disabled and restores items when turned off', async () => {
    await setup(6, 200);
    expect(await until(() => hidden().length > 0)).toBeTrue();
    host.on = false;
    await host.updateComplete;
    expect(hidden().length).toBe(0);
    expect(trigger().hidden).toBeTrue();
  });

  it('leaves items the app hid alone', async () => {
    await setup(6, 1000);
    items()[1].hidden = true;
    box.style.width = '150px';
    expect(await until(() => hidden().length > 3)).toBeTrue();
    expect(items()[5].hidden).toBeTrue();
    box.style.width = '1000px';
    await until(() => hidden().length === 1);
    expect(hidden()).toEqual([items()[1]]);
    expect(items()[1].hasAttribute(OVERFLOW_HIDDEN_ATTRIBUTE)).toBeFalse();
  });

  it('moves focus to the trigger when the focused item is hidden', async () => {
    await setup(6, 1000);
    await until(() => trigger().hidden);
    items()[5].focus();
    expect(document.activeElement).toBe(items()[5]);
    box.style.width = '200px';
    await until(() => items()[5].hidden);
    expect(host.shadowRoot!.activeElement).toBe(trigger());
  });

  it('does not blur a visible item when it measures again', async () => {
    await setup(6, 200);
    await until(() => hidden().length === 3);
    items()[0].focus();
    host.overflowing.refresh();
    expect(document.activeElement).toBe(items()[0]);
  });

  it('labels an item from aria-label, then text, then title', () => {
    const el = document.createElement('div');
    el.textContent = '  Some   text ';
    expect(overflowLabel(el)).toBe('Some text');
    el.setAttribute('aria-label', 'Label');
    expect(overflowLabel(el)).toBe('Label');
    const empty = document.createElement('div');
    empty.title = 'Title';
    expect(overflowLabel(empty)).toBe('Title');
  });
});
