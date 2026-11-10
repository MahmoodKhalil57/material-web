/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Spec unit tests for menus: color styles, selection, focus and dividers.

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import './md-gb-menu.js';
import './md-gb-menu-group.js';
import './md-gb-menu-item.js';
import {type MenuElement} from './menu-element.js';
import {type MenuItemElement} from './menu-item-element.js';
import menuStyles from './menu.cssresult.js';

adoptStyles(document, [m3Styles, menuStyles]);

function toggled(element: HTMLElement) {
  return new Promise<void>((resolve) => {
    element.addEventListener('toggle', () => resolve(), {once: true});
  });
}

describe('menus spec units', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`${template}`);
    await env.waitForStability();
    const menu = root.querySelector('#menu') as MenuElement;
    return {root, menu, items: menu.items as MenuItemElement[]};
  }

  async function open(menu: MenuElement) {
    const done = toggled(menu);
    menu.showPopover();
    await done;
    jasmine.clock().tick(1);
    await menu.updateComplete;
  }

  function key(target: Element, keyName: string) {
    target.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: keyName,
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }

  const containerColor = (menu: MenuElement) =>
    getComputedStyle(menu.shadowRoot!.querySelector('.menu')!).getPropertyValue(
      '--container-color',
    );

  // spec: menus-d95733, menus-c3ec62, menus-11fe09, menus-4cf304, menus-cd1a31
  it('maps standard to surface and vibrant to tertiary container', async () => {
    const {root, menu} = await setup(html`
      <md-gb-menu id="menu"><md-gb-menu-item>A</md-gb-menu-item></md-gb-menu>
      <md-gb-menu id="vibrant" color="vibrant">
        <md-gb-menu-item>A</md-gb-menu-item>
      </md-gb-menu>
    `);
    const vibrant = root.querySelector('#vibrant') as MenuElement;
    await vibrant.updateComplete;
    const resolve = (role: string) => {
      const probe = document.createElement('div');
      probe.style.color = `var(--md-sys-color-${role})`;
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    };
    const paint = (m: MenuElement) => {
      const probe = m.shadowRoot!.querySelector('.menu')! as HTMLElement;
      return getComputedStyle(probe).backgroundColor;
    };
    expect(paint(menu)).toBe(resolve('surface-container-low'));
    expect(paint(vibrant)).toBe(resolve('tertiary-container'));
    // Vibrant is the more prominent style, so it is opt-in: menus are
    // standard unless asked otherwise.
    expect(menu.color).toBe('standard');
    expect(vibrant.color).toBe('vibrant');
    expect(containerColor(menu)).not.toBe(containerColor(vibrant));
  });

  // spec: menus-5c1ae8
  it('keeps a multi-select menu open while items toggle', async () => {
    const {menu, items} = await setup(html`
      <md-gb-menu id="menu">
        <md-gb-menu-group checkable="multiple">
          <md-gb-menu-item>A</md-gb-menu-item>
          <md-gb-menu-item>B</md-gb-menu-item>
        </md-gb-menu-group>
      </md-gb-menu>
    `);
    await open(menu);
    items[0].click();
    items[1].click();
    expect(items[0].checked).toBeTrue();
    expect(items[1].checked).toBeTrue();
    expect(menu.matches(':popover-open')).toBeTrue();
  });

  // spec: menus-442c70
  it('selects the focused item with Enter and Space', async () => {
    const {menu, items} = await setup(html`
      <md-gb-menu id="menu">
        <md-gb-menu-group checkable="multiple">
          <md-gb-menu-item>A</md-gb-menu-item>
          <md-gb-menu-item>B</md-gb-menu-item>
        </md-gb-menu-group>
      </md-gb-menu>
    `);
    await open(menu);
    items[0].focus();
    key(items[0], 'Enter');
    key(items[1], ' ');
    expect(items[0].checked).toBeTrue();
    expect(items[1].checked).toBeTrue();
  });

  // spec: menus-35ee0d, menus-61a1c2
  it('skips dividers when moving focus', async () => {
    const {menu, items} = await setup(html`
      <md-gb-menu id="menu">
        <md-gb-menu-item>A</md-gb-menu-item>
        <hr class="divider" />
        <md-gb-menu-item>B</md-gb-menu-item>
      </md-gb-menu>
    `);
    await open(menu);
    expect(items.length).toBe(2);
    items[0].focus();
    key(items[0], 'ArrowDown');
    expect(document.activeElement).toBe(items[1]);
    const divider = menu.querySelector<HTMLElement>('.divider')!;
    expect(divider.tabIndex).toBeLessThan(0);
    expect(divider.matches(':focus')).toBeFalse();
  });

  // spec: menus-8e9be3
  it('shows an unavailable item disabled instead of removing it', async () => {
    const {menu, items} = await setup(html`
      <md-gb-menu id="menu">
        <md-gb-menu-item>A</md-gb-menu-item>
        <md-gb-menu-item disabled>B</md-gb-menu-item>
      </md-gb-menu>
    `);
    await open(menu);
    expect(items.length).toBe(2);
    expect(items[1].disabled).toBeTrue();
    const part = items[1].shadowRoot!.querySelector('.menu-item')!;
    expect(Number(getComputedStyle(part).opacity) < 1 ||
      getComputedStyle(part).color !== getComputedStyle(items[0].shadowRoot!.querySelector('.menu-item')!).color,
    ).toBeTrue();
  });
});
