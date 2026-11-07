/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-fab-menu.js';
import './md-gb-fab-menu-item.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {
  center,
  deepElements,
  prop,
  ripplesOf,
} from '../shared/central/subjects.js';

adoptStyles(document, [m3Styles]);

const containers: HTMLElement[] = [];

type Menu = HTMLElement & {updateComplete: Promise<unknown>; open: boolean};

async function mount(attrs = '', wrapper = '', count = 3, open = true) {
  const container = document.createElement('div');
  container.style.cssText = 'padding:200px 64px 64px';
  containers.push(container);
  const items = Array.from({length: count}, (_, i) => `<md-gb-fab-menu-item>Item ${i + 1}</md-gb-fab-menu-item>`).join('');
  container.innerHTML = `<div ${wrapper}><md-gb-fab-menu aria-label="Create" ${attrs} ${open ? 'open' : ''}>${items}</md-gb-fab-menu></div>`;
  document.body.append(container);
  const el = container.querySelector('md-gb-fab-menu') as Menu;
  await el.updateComplete;
  settle(el);
  const button = el.shadowRoot!.querySelector<HTMLElement>('.fab-menu-button')!;
  const list = Array.from(el.querySelectorAll<HTMLElement>('md-gb-fab-menu-item'));
  const inner = (item: HTMLElement) =>
    item.shadowRoot!.querySelector<HTMLElement>('.fab-menu-item')!;
  return {el, button, items: list, inner};
}

function settle(el: Element) {
  for (let pass = 0; pass < 3; pass++) {
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

function resolved(property: string, value: string) {
  const probe = document.createElement('span');
  probe.style.setProperty(property, value);
  document.body.append(probe);
  const out = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return out;
}

const shadow = (level: number) => resolved('box-shadow', `var(--md-sys-elevation-shadow-${level})`);

describe('<md-gb-fab-menu> spec behavior', () => {
  afterEach(async () => {
    for (const c of containers.splice(0)) c.remove();
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: fab-menu-b1fd5d, fab-menu-4a2512, fab-menu-097891, fab-menu-21f469, fab-menu-8bd414
  for (const color of ['primary', 'secondary', 'tertiary']) {
    it(`shows the ${color} close button enabled, hovered, focused and pressed`, async () => {
      const {el, button} = await mount(`color="${color}"`);
      const colors = (what: string) => {
        const css = getComputedStyle(button);
        expect(css.backgroundColor).withContext(what).toBe(
          resolved('background-color', `var(--md-sys-color-${color})`),
        );
        expect(css.color).withContext(what).toBe(resolved('color', `var(--md-sys-color-on-${color})`));
        return css;
      };
      // Enabled: elevation 3, no state layer.
      expect(colors('enabled').boxShadow).toBe(shadow(3));
      for (const r of ripplesOf(el)) {
        expect(prop(r, '--ripple-hover-opacity')).toBe('0%');
      }
      // Hovered: 8% layer, elevation 4.
      const c = center(button);
      await sendMouse({type: 'move', position: [c.x, c.y]});
      settle(el);
      expect(ripplesOf(el).some((r) => prop(r, '--ripple-hover-opacity') === '8%')).toBeTrue();
      expect(colors('hovered').boxShadow).toBe(shadow(4));
      // Focused: ring, 10% layer, elevation 3.
      await sendKeys({press: 'Shift'});
      button.focus();
      await sendMouse({type: 'move', position: [0, 0]});
      settle(el);
      expect(button.matches(':focus-visible')).toBeTrue();
      expect(ripplesOf(el).some((r) => prop(r, '--ripple-hover-opacity') === '10%')).toBeTrue();
      expect(colors('focused').boxShadow).toBe(shadow(3));
      // Pressed: 10% layer, elevation 3.
      const c2 = center(button);
      await sendMouse({type: 'move', position: [c2.x, c2.y]});
      await sendMouse({type: 'down'});
      settle(el);
      expect(ripplesOf(el).some((r) => prop(r, '--ripple-press-opacity') === '10%')).toBeTrue();
      expect(colors('pressed').boxShadow).toBe(shadow(3));
    });
  }

  // Item elevation on hover, focus and press is not asserted here, so the item state units (fab-menu-6c5b8e, 8325c5, 06ab28, 7c48a9, 05974c) are not cited.
  it('shows menu items enabled, hovered, focused and pressed with 8%, 10% and 10% layers', async () => {
    const {el, items, inner} = await mount();
    const item = items[0];
    const part = inner(item);
    const layer = (name: string) =>
      deepElements(item).some((e) => e.classList.contains('ripple') && prop(e, name) !== '0%');
    expect(layer('--ripple-hover-opacity')).toBeFalse();
    expect(layer('--ripple-press-opacity')).toBeFalse();
    const c = center(part);
    await sendMouse({type: 'move', position: [c.x, c.y]});
    settle(el);
    expect(deepElements(item).some((e) => e.classList.contains('ripple') && prop(e, '--ripple-hover-opacity') === '8%')).toBeTrue();
    await sendKeys({press: 'Shift'});
    item.focus();
    settle(el);
    expect(deepElements(item).some((e) => e.classList.contains('ripple') && prop(e, '--ripple-hover-opacity') === '10%')).toBeTrue();
    await sendMouse({type: 'down'});
    settle(el);
    expect(deepElements(item).some((e) => e.classList.contains('ripple') && prop(e, '--ripple-press-opacity') === '10%')).toBeTrue();
  });

  // spec: fab-menu-cb3b9d, fab-menu-251a9b
  it('holds 2 to 6 items, all laid out one above the other', async () => {
    for (const count of [2, 6]) {
      const {items} = await mount('', '', count);
      expect(items.length).toBe(count);
      const tops = items.map((i) => Math.round(i.getBoundingClientRect().top));
      expect(new Set(tops).size).withContext(`${count} items`).toBe(count);
      for (const i of items) expect(getComputedStyle(i).visibility).toBe('visible');
    }
  });

  // spec: fab-menu-67df5c
  it('opens from a FAB of any size', async () => {
    for (const size of ['sm', 'default', 'md', 'lg']) {
      const {el, items} = await mount(`size="${size}"`, '', 3, false);
      el.open = true;
      await el.updateComplete;
      settle(el);
      expect(getComputedStyle(items[0]).visibility).withContext(size).toBe('visible');
    }
  });

  // spec: fab-menu-88b0bd
  it('aligns to the other side in right-to-left, with its content mirrored', async () => {
    const ltr = await mount('', '', 3);
    const rtl = await mount('', 'dir="rtl"', 3);
    const edge = (m: Awaited<ReturnType<typeof mount>>, side: 'left' | 'right') =>
      Math.round(m.items[0].getBoundingClientRect()[side] - m.button.getBoundingClientRect()[side]);
    expect(edge(ltr, 'right')).toBe(0);
    expect(edge(rtl, 'left')).toBe(0);
    const part = rtl.inner(rtl.items[0]);
    expect(getComputedStyle(part).direction).toBe('rtl');
  });

  // spec: fab-menu-9abcc4, fab-menu-c601bf
  it('is a menu opened by a labeled menu button', async () => {
    const {el, button} = await mount('', '', 3, false);
    expect(button.getAttribute('aria-label')).toBe('Create');
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(el.shadowRoot!.querySelector('[role="menu"]')).not.toBeNull();
  });
});
