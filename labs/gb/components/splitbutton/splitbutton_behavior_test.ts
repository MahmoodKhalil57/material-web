/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-split-button.js';
import '../menu/md-gb-menu.js';
import '../menu/md-gb-menu-item.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type SplitButtonElement} from './split-button-element.js';

adoptStyles(document, [m3Styles]);

const ROLES = [
  '--md-sys-color-primary: rgb(1, 1, 1)',
  '--md-sys-color-secondary-container: rgb(2, 2, 2)',
  '--md-sys-color-surface-container-low: rgb(3, 3, 3)',
  '--md-sys-color-outline-variant: rgb(4, 4, 4)',
].join(';');

describe('<md-gb-split-button> spec behavior', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div style=${ROLES}>${template}</div>`);
    await env.waitForStability();
    const els = [...root.querySelectorAll<SplitButtonElement>('md-gb-split-button')];
    const slot = (e: SplitButtonElement, name: string) =>
      e.shadowRoot!.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)!;
    return {root, els, slot};
  }

  const split = (attrs = '') => html`
    <md-gb-split-button ${attrs}>
      <button slot="leading">Save</button>
      <button slot="trailing" aria-label="More" popovertarget="m"></button>
    </md-gb-split-button>`;

  const finish = (el: HTMLElement) =>
    el.getAnimations({subtree: true}).forEach((a) => a.finish());

  // spec: split-button-0d53dc, split-button-d68eea
  it('has a label on one part of the button and a menu icon on the other', async () => {
    const {els, slot} = await setup(split());
    const leading = slot(els[0], 'leading');
    const trailing = slot(els[0], 'trailing');
    expect(leading.assignedElements()[0].textContent).toBe('Save');
    expect(trailing.assignedElements()[0].textContent).toBe('');
    expect(getComputedStyle(trailing, '::after').content).toContain(
      'arrow_drop_down',
    );
    expect(getComputedStyle(leading, '::after').content).not.toContain(
      'arrow_drop_down',
    );
    expect(leading.getBoundingClientRect().right).toBeLessThanOrEqual(
      trailing.getBoundingClientRect().left,
    );
  });

  // spec: split-button-332e4e, split-button-fbfaf0, split-button-106a71, split-button-7f8d8f, split-button-0c56ac, split-button-956b0f, split-button-73e12d, split-button-82acc2, split-button-d07172, split-button-1bd6d9, split-button-43a21d
  it('comes in the five button sizes, small by default', async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    const {els, slot} = await setup(html`
      <md-gb-split-button>
        <button slot="leading">Save</button><button slot="trailing" aria-label="More"></button>
      </md-gb-split-button>
      ${sizes.map(
        (size) => html`<md-gb-split-button size=${size}>
          <button slot="leading">Save</button><button slot="trailing" aria-label="More"></button>
        </md-gb-split-button>`,
      )}`);
    expect(els[0].size).toBe('sm');
    const height = (e: SplitButtonElement) =>
      Math.round(
        slot(e, 'trailing').assignedElements()[0].getBoundingClientRect().height,
      );
    const heights = els.slice(1).map(height);
    // Same heights as buttons (the trailing button): 32, 40, 56, 96, 136.
    expect(heights).toEqual([32, 40, 56, 96, 136]);
    expect(height(els[0])).toBe(40);
  });

  // spec: split-button-31c445, split-button-6da640, split-button-a48617, split-button-93f54b, split-button-bdb384, split-button-d3d18c, split-button-f1021a, split-button-0a7ecd, split-button-74fae2
  it('comes in elevated, filled, tonal and outlined colors from the button color roles', async () => {
    const colors = ['filled', 'tonal', 'elevated', 'outlined'];
    const {els, slot} = await setup(html`${colors.map(
      (color) => html`<md-gb-split-button color=${color}>
        <button slot="leading">Save</button><button slot="trailing" aria-label="More"></button>
      </md-gb-split-button>`,
    )}`);
    const bg = (e: SplitButtonElement) =>
      getComputedStyle(slot(e, 'leading')).backgroundColor;
    expect(bg(els[0])).toBe('rgb(1, 1, 1)');
    expect(bg(els[1])).toBe('rgb(2, 2, 2)');
    expect(bg(els[2])).toBe('rgb(3, 3, 3)');
    expect(bg(els[3])).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(slot(els[3], 'leading')).borderTopColor).not.toBe(
      'rgba(0, 0, 0, 0)',
    );
    // The trailing button shares the color of the leading one.
    for (const e of els) {
      expect(getComputedStyle(slot(e, 'trailing')).backgroundColor).toBe(bg(e));
    }
  });

  // spec: split-button-ab5734, split-button-aa5186
  it('rotates the menu icon 180 degrees when the trailing button is selected', async () => {
    const {els, slot} = await setup(split());
    const icon = () => getComputedStyle(slot(els[0], 'trailing'), '::after');
    expect(icon().transform).toBe('none');
    els[0].selected = true;
    await env.waitForStability();
    finish(slot(els[0], 'trailing'));
    const m = new DOMMatrix(icon().transform);
    expect(Math.round(m.a)).toBe(-1);
    expect(Math.round(m.d)).toBe(-1);
    els[0].selected = false;
    await env.waitForStability();
    finish(slot(els[0], 'trailing'));
    expect(icon().transform).toBe('none');
  });

  // spec: split-button-25f8f3
  it('rotates the menu icon with the standard motion scheme', async () => {
    const {els, slot} = await setup(split());
    const style = getComputedStyle(slot(els[0], 'trailing'), '::after');
    const probe = document.createElement('div');
    probe.style.transitionTimingFunction = 'var(--md-sys-motion-easing-standard)';
    probe.style.transitionDuration = 'var(--md-sys-motion-duration-short4)';
    els[0].after(probe);
    const standard = getComputedStyle(probe);
    expect(style.transitionProperty).toBe('transform');
    expect(style.transitionTimingFunction).toBe(standard.transitionTimingFunction);
    expect(style.transitionDuration).toBe(standard.transitionDuration);
    probe.remove();
  });

  // spec: split-button-c82c5a, split-button-019c5b
  it('opens a menu or any other popover from the trailing button and tracks it as selected', async () => {
    const {els} = await setup(html`
      <md-gb-split-button>
        <button slot="leading">Save</button>
        <button slot="trailing" id="t1" aria-label="More" popovertarget="m1"></button>
        <md-gb-menu id="m1"><md-gb-menu-item>One</md-gb-menu-item></md-gb-menu>
      </md-gb-split-button>
      <md-gb-split-button>
        <button slot="leading">Pick</button>
        <button slot="trailing" id="t2" aria-label="More" popovertarget="card"></button>
        <div id="card" popover>A card</div>
      </md-gb-split-button>`);
    const [menuButton, cardButton] = els;
    const toggled = (el: Element) =>
      new Promise((resolve) => el.addEventListener('toggle', resolve, {once: true}));
    const menuToggled = toggled(menuButton.querySelector('md-gb-menu')!);
    menuButton.querySelector<HTMLElement>('#t1')!.click();
    await menuToggled;
    expect(menuButton.querySelector('md-gb-menu')!.matches(':popover-open')).withContext('menu open').toBeTrue();
    expect(menuButton.selected).withContext("menu selected").toBeTrue();
    const cardToggled = toggled(cardButton.querySelector('#card')!);
    cardButton.querySelector<HTMLElement>('#t2')!.click();
    await cardToggled;
    expect(cardButton.querySelector('#card')!.matches(':popover-open')).withContext('card open').toBeTrue();
    expect(cardButton.selected).withContext("card selected").toBeTrue();
    const cardClosed = toggled(cardButton.querySelector('#card')!);
    cardButton.querySelector<HTMLElement>('#t2')!.click();
    await cardClosed;
    expect(cardButton.selected).toBeFalse();
  });

  // spec: split-button-a1e18a, split-button-5b7b5a, split-button-9dc38a, split-button-6c89bf
  it('moves focus from the leading to the trailing button with Tab', async () => {
    const {els} = await setup(split());
    const [leading, trailing] = [
      els[0].querySelector<HTMLElement>('[slot=leading]')!,
      els[0].querySelector<HTMLElement>('[slot=trailing]')!,
    ];
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(leading);
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(trailing);
  });

  // spec: split-button-a6048a
  it('keeps the leading button first in right-to-left and lays it out on the right', async () => {
    const {els} = await setup(html`<div dir="rtl">${split()}</div>`);
    const leading = els[0].querySelector<HTMLElement>('[slot=leading]')!;
    const trailing = els[0].querySelector<HTMLElement>('[slot=trailing]')!;
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(leading);
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(trailing);
    expect(leading.getBoundingClientRect().left).toBeGreaterThan(
      trailing.getBoundingClientRect().left,
    );
  });

  // spec: split-button-d3bdc9
  it('activates the focused button with Space or Enter', async () => {
    const {els} = await setup(split());
    const leading = els[0].querySelector<HTMLElement>('[slot=leading]')!;
    let clicks = 0;
    leading.addEventListener('click', () => clicks++);
    leading.focus();
    await sendKeys({press: 'Enter'});
    await sendKeys({press: 'Space'});
    expect(clicks).toBe(2);
  });

  // spec: split-button-ab3f83
  // split-button.md Sizes: the leading and trailing buttons are exactly the
  // size height (XS 32, S 40, M 56, L 96, XL 136dp).
  it('makes the leading and trailing buttons exactly the size height', async () => {
    const expected = {xs: 32, sm: 40, md: 56, lg: 96, xl: 136};
    for (const [size, height] of Object.entries(expected)) {
      const root = env.render(html`
        <md-gb-split-button size=${size}>
          <button slot="leading">Save</button>
          <button slot="trailing" aria-label="More"></button>
        </md-gb-split-button>`);
      await env.waitForStability();
      const el = root.querySelector<SplitButtonElement>('md-gb-split-button')!;
      const leading = el.querySelector<HTMLElement>('[slot=leading]')!;
      const trailing = el.querySelector<HTMLElement>('[slot=trailing]')!;
      expect(leading.getBoundingClientRect().height).withContext(`${size} leading`).toBe(height);
      expect(trailing.getBoundingClientRect().height).withContext(`${size} trailing`).toBe(height);
    }
  });

  describe('pointer targets', () => {
    async function setupMenu() {
      const {els, slot} = await setup(html`
        <md-gb-split-button>
          <button slot="leading">Save</button>
          <button slot="trailing" aria-label="More" popovertarget="pm"></button>
          <md-gb-menu id="pm"><md-gb-menu-item>One</md-gb-menu-item></md-gb-menu>
        </md-gb-split-button>
        <button id="outside">Outside</button>`);
      const menu = els[0].querySelector('md-gb-menu')!;
      return {el: els[0], slot, menu};
    }
    const center = (r: DOMRect): [number, number] => [
      Math.round(r.x + r.width / 2),
      Math.round(r.y + r.height / 2),
    ];

    it('opens the menu from a click on the menu icon', async () => {
      const {el, slot, menu} = await setupMenu();
      // The icon is the trailing slot's ::after, centered in the slot.
      const opened = new Promise((r) => menu.addEventListener('toggle', r, {once: true}));
      await sendMouse({type: 'click', position: center(slot(el, 'trailing').getBoundingClientRect())});
      await opened;
      expect(menu.matches(':popover-open')).toBeTrue();
    });

    it('activates the trailing button from its touch target outside the button', async () => {
      const {el, slot, menu} = await setupMenu();
      const r = slot(el, 'trailing').getBoundingClientRect();
      // Just below the button, inside the 48dp touch target (the size is 40).
      const opened = new Promise((r) => menu.addEventListener('toggle', r, {once: true}));
      await sendMouse({type: 'click', position: [Math.round(r.x + r.width / 2), Math.round(r.bottom + 2)]});
      await opened;
      expect(menu.matches(':popover-open')).toBeTrue();
    });

    it('keeps its touch targets around the buttons, not over the page', async () => {
      const {el} = await setupMenu();
      const host = el.getBoundingClientRect();
      const outside = document.getElementById('outside')!;
      const [x, y] = center(outside.getBoundingClientRect());
      // The leading slot is display: contents; its touch target once sized
      // against the viewport and covered everything near the split button.
      expect(document.elementFromPoint(x, y)).toBe(outside);
      const far = document.elementFromPoint(Math.round(host.x + host.width / 2), Math.round(host.bottom + 40));
      expect(far === el || el.contains(far)).withContext('40px below the split button').toBeFalse();
    });
  });
});
