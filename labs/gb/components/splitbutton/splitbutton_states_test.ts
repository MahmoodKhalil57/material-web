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
import {center, deepElements} from '../shared/central/subjects.js';
import {type SplitButtonElement} from './split-button-element.js';

adoptStyles(document, [m3Styles]);

/** Lets the browser run a frame (hover state updates after a mouse move). */
async function frame() {
  await sendMouse({type: 'move', position: [1, 1]});
  await sendMouse({type: 'move', position: [0, 0]});
}

function settle(el: Element) {
  document.body.getBoundingClientRect();
  for (let pass = 0; pass < 2; pass++) {
    for (const a of [
      ...document.getAnimations(),
      ...deepElements(el).flatMap((e) => e.getAnimations()),
    ]) {
      try {
        a.finish();
      } catch {
        // Infinite animations cannot finish.
      }
    }
  }
}

describe('<md-gb-split-button> states', () => {
  const env = new Environment();

  async function setup(size = 'md') {
    const root = env.render(html`
      <button id="before">Before</button>
      <md-gb-split-button size=${size} color="filled" style="margin: 80px">
        <button slot="leading">Save</button>
        <button slot="trailing" aria-label="More" popovertarget="menu"></button>
        <md-gb-menu id="menu"><md-gb-menu-item>One</md-gb-menu-item></md-gb-menu>
      </md-gb-split-button>`);
    await env.waitForStability();
    const el = root.querySelector('md-gb-split-button') as SplitButtonElement;
    const leading = el.querySelector<HTMLElement>('[slot=leading]')!;
    const trailing = el.querySelector<HTMLElement>('[slot=trailing]')!;
    const trailingSlot = el.shadowRoot!.querySelector<HTMLElement>(
      'slot[name=trailing]',
    )!;
    // Radius of the corner the two buttons share.
    const leadingInner = () =>
      parseFloat(getComputedStyle(leading).borderTopRightRadius);
    const trailingInner = () =>
      parseFloat(getComputedStyle(trailingSlot).borderTopLeftRadius);
    return {el, leading, trailing, trailingSlot, leadingInner, trailingInner};
  }

  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: split-button-73d7a4, split-button-4822af, split-button-966ff8, split-button-eb0651, split-button-920aa2
  it('morphs the inner corner of the leading button when hovered, focused and pressed', async () => {
    const {el, leading, leadingInner} = await setup();
    settle(el);
    const rest = leadingInner();
    expect(rest).toBe(4);
    const c = center(leading);
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await env.waitForStability();
    settle(el);
    const hovered = leadingInner();
    expect(hovered).toBeGreaterThan(rest);
    await sendMouse({type: 'move', position: [0, 0]});
    await frame();
    await env.waitForStability();
    settle(el);
    document.querySelector<HTMLElement>('#before')!.focus();
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(leading);
    settle(el);
    expect(leadingInner()).withContext('focused').toBe(hovered);
    leading.blur();
    settle(el);
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await sendMouse({type: 'down'});
    settle(el);
    expect(leadingInner()).withContext('pressed').toBeGreaterThan(rest);
  });

  // spec: split-button-7e8ca9
  it('keeps the inner corner of a disabled leading button at its resting shape', async () => {
    const {el, leading, leadingInner} = await setup();
    (leading as HTMLButtonElement).disabled = true;
    settle(el);
    expect(leadingInner()).toBe(4);
  });

  // spec: split-button-c57278, split-button-43331c, split-button-0e4f06, split-button-cfefa6, split-button-71c25b
  it('morphs the inner corner of the trailing button when hovered, focused and pressed', async () => {
    const {el, trailing, trailingInner} = await setup();
    settle(el);
    const rest = trailingInner();
    expect(rest).toBe(4);
    const c = center(trailing);
    await sendMouse({type: 'move', position: [c.x, c.y]});
    settle(el);
    const hovered = trailingInner();
    expect(hovered).toBeGreaterThan(rest);
    await sendMouse({type: 'move', position: [0, 0]});
    await frame();
    await env.waitForStability();
    settle(el);
    expect(trailingInner()).withContext('away').toBe(rest);
    document.querySelector<HTMLElement>('#before')!.focus();
    await sendKeys({press: 'Tab'});
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(trailing);
    settle(el);
    expect(trailingInner()).withContext('focused').toBe(hovered);
  });

  // spec: split-button-ea7bb0
  it('keeps the inner corner of a disabled trailing button at its resting shape', async () => {
    const {el, trailing, trailingInner} = await setup();
    (trailing as HTMLButtonElement).disabled = true;
    settle(el);
    expect(trailingInner()).toBe(4);
  });

  // spec: split-button-11b552, split-button-87365d, split-button-bc5cfe, split-button-0ef69a, split-button-453a76, split-button-e447e5
  it('selects the trailing button with a full inner corner and a centered icon, keeping its colors', async () => {
    const {el, trailing, trailingSlot, trailingInner} = await setup('md');
    settle(el);
    const offset = () =>
      parseFloat(
        getComputedStyle(trailingSlot).getPropertyValue('--menu-icon-offset'),
      );
    expect(offset()).toBe(2);
    const restColor = getComputedStyle(trailingSlot).backgroundColor;
    const restIconColor = getComputedStyle(trailingSlot).color;
    const toggled = new Promise((resolve) =>
      el
        .querySelector('md-gb-menu')!
        .addEventListener('toggle', resolve, {once: true}),
    );
    trailing.click();
    await toggled;
    settle(el);
    expect(el.selected).toBeTrue();
    expect(trailingInner()).toBe(28);
    expect(offset()).toBe(0);
    expect(getComputedStyle(trailingSlot).backgroundColor).toBe(restColor);
    expect(getComputedStyle(trailingSlot).color).toBe(restIconColor);
  });

  // spec: split-button-559952, split-button-b10f1c, split-button-ea4c69
  it('tells assistive technology whether the menu is expanded or collapsed', async () => {
    const {el, trailing} = await setup();
    expect(trailing.getAttribute('aria-expanded')).toBe('false');
    const toggled = () =>
      new Promise((resolve) =>
        el
          .querySelector('md-gb-menu')!
          .addEventListener('toggle', resolve, {once: true}),
      );
    let t = toggled();
    trailing.click();
    await t;
    expect(trailing.getAttribute('aria-expanded')).toBe('true');
    t = toggled();
    trailing.click();
    await t;
    expect(trailing.getAttribute('aria-expanded')).toBe('false');
  });

  // spec: split-button-4ed3bb, split-button-f9a26b, split-button-f1528a, split-button-072cb6
  it('gives each button of the small sizes a 48x48dp target', async () => {
    for (const size of ['xs', 'sm']) {
      const {el, leading, trailing} = await setup(size);
      settle(el);
      for (const button of [leading, trailing]) {
        const r = button.getBoundingClientRect();
        // A point inside the 48dp target of a button shorter than 48dp, just
        // above its top edge, still hits the button.
        const x = Math.round(r.left + r.width / 2);
        const above = r.top - (48 - r.height) / 2 + 1;
        const hit = document.elementFromPoint(x, above);
        expect(!!hit && (el === hit || el.contains(hit)))
          .withContext(`${size} ${button.slot}`)
          .toBeTrue();
      }
    }
  });
});

describe('<md-gb-split-button> menu placement', () => {
  const env = new Environment();

  async function place(position: string) {
    const root = env.render(html`
      <md-gb-split-button style="position: fixed; ${position}">
        <button slot="leading">Save</button>
        <button slot="trailing" aria-label="More" popovertarget="m2"></button>
        <md-gb-menu id="m2">
          <md-gb-menu-item>A long first option</md-gb-menu-item>
          <md-gb-menu-item>Second</md-gb-menu-item>
        </md-gb-menu>
      </md-gb-split-button>`);
    await env.waitForStability();
    const el = root.querySelector('md-gb-split-button') as SplitButtonElement;
    const trailing = el.querySelector<HTMLElement>('[slot=trailing]')!;
    const menu = el.querySelector('md-gb-menu')!;
    const toggled = new Promise((resolve) =>
      menu.addEventListener('toggle', resolve, {once: true}),
    );
    trailing.click();
    await toggled;
    await env.waitForStability();
    return {
      anchor: trailing.getBoundingClientRect(),
      menu: menu.getBoundingClientRect(),
    };
  }

  // spec: split-button-fa53a8, split-button-099fc6, split-button-37f600, split-button-808fbb, split-button-e3528c, split-button-28705b
  it('places the menu 4dp from the trailing button, aligned with one of its edges, on whichever side has room', async () => {
    const cases = {
      'bottom, end-aligned': 'top: 40px; left: 400px',
      'top, end-aligned': 'bottom: 40px; left: 400px',
      'bottom, start-aligned': 'top: 40px; left: 0px',
      'top, start-aligned': 'bottom: 40px; left: 0px',
    };
    for (const [name, position] of Object.entries(cases)) {
      const {anchor, menu} = await place(position);
      const below = name.startsWith('bottom');
      const gap = below ? menu.top - anchor.bottom : anchor.top - menu.bottom;
      expect(gap).withContext(`${name} gap`).toBeCloseTo(4, 0);
      const startAligned = name.includes('start');
      const edge = startAligned
        ? Math.abs(menu.left - anchor.left)
        : Math.abs(menu.right - anchor.right);
      expect(edge).withContext(`${name} edge`).toBeLessThan(1);
    }
  });
});
