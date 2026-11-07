/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Tests for the menu's trigger state and for filtering while typing.

// import 'jasmine'; (google3-only)

import '../textfield/md-gb-text-field.js';
import './md-gb-menu-item.js';
import './md-gb-menu.js';

import {sendKeys} from '@web/test-runner-commands';
import {html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import {buttonClasses} from '../button/button.js';
import {styles as buttonStyles} from '../button/button.cssresult.js';
import {styles as rippleStyles} from '../ripple/ripple.cssresult.js';
import {MenuElement} from './menu-element.js';

adoptStyles(document, [m3Styles, buttonStyles, rippleStyles]);

// Environment mocks requestAnimationFrame, which the shared `until` waits on.
const realRaf = window.requestAnimationFrame.bind(window);
async function until(check: () => unknown, timeout = 1000) {
  const end = performance.now() + timeout;
  while (!check() && performance.now() < end) {
    await new Promise((resolve) => realRaf(resolve));
  }
  return Boolean(check());
}

describe('md-gb-menu trigger and filtering', () => {
  const env = new Environment();

  async function render(template: ReturnType<typeof html>) {
    const root = env.render(template);
    await env.waitForStability();
    const menu = root.querySelector('md-gb-menu') as MenuElement;
    await menu.updateComplete;
    return {root, menu};
  }

  const labels = (menu: MenuElement) =>
    menu.items.map((item) => item.textContent!.trim());

  describe('trigger', () => {
    // spec: menus-698263, menus-baa57f
    it('is marked expanded while the menu is open and not after it closes', async () => {
      const {root, menu} = await render(html`
        <button id="trigger" popovertarget="menu">Open</button>
        <md-gb-menu id="menu"><md-gb-menu-item>One</md-gb-menu-item></md-gb-menu>
      `);
      const trigger = root.querySelector<HTMLElement>('#trigger')!;
      trigger.click();
      expect(await until(() => menu.matches(':popover-open'))).toBeTrue();
      expect(await until(() => trigger.getAttribute('aria-expanded') === 'true')).toBeTrue();
      menu.hidePopover();
      expect(await until(() => !menu.matches(':popover-open'))).toBeTrue();
      expect(await until(() => trigger.getAttribute('aria-expanded') === 'false')).toBeTrue();
    });

    // spec: menus-761694
    it('is marked expanded when opened from the keyboard', async () => {
      const {root, menu} = await render(html`
        <button id="trigger" popovertarget="menu">Open</button>
        <md-gb-menu id="menu"><md-gb-menu-item>One</md-gb-menu-item></md-gb-menu>
      `);
      const trigger = root.querySelector<HTMLElement>('#trigger')!;
      trigger.focus();
      await sendKeys({press: 'ArrowDown'});
      expect(await until(() => menu.matches(':popover-open'))).toBeTrue();
      expect(await until(() => trigger.getAttribute('aria-expanded') === 'true')).toBeTrue();
      await sendKeys({press: 'Escape'});
      expect(await until(() => !menu.matches(':popover-open'))).toBeTrue();
      expect(await until(() => trigger.getAttribute('aria-expanded') === 'false')).toBeTrue();
    });

    // spec: menus-baa57f
    it('keeps its button looking the same with the pressed state layer added while open', async () => {
      const {root, menu} = await render(html`
        <button
          id="trigger"
          class=${classMap(buttonClasses({color: 'tonal'}))}
          popovertarget="menu">
          Open
        </button>
        <md-gb-menu id="menu"><md-gb-menu-item>One</md-gb-menu-item></md-gb-menu>
      `);
      const trigger = root.querySelector<HTMLElement>('#trigger')!;
      const style = getComputedStyle(trigger);
      const look = () => ({color: style.backgroundColor, shape: style.borderRadius});
      const before = look();
      const press = () => style.getPropertyValue('--ripple-press-opacity').trim();
      expect(press()).toBe('0%');
      trigger.click();
      expect(await until(() => trigger.getAttribute('aria-expanded') === 'true')).toBeTrue();
      // The layer fades in (the ripple transitions its opacity).
      expect(await until(() => press() === '10%', 2000)).toBeTrue();
      expect(style.getPropertyValue('--ripple-scale').trim()).toBe('100%');
      expect(look()).toEqual(before);
      menu.hidePopover();
      expect(await until(() => press() === '0%', 2000)).toBeTrue();
    });
  });

  describe('filtering', () => {
    const template = (extra = '') => html`
      <md-gb-text-field id="field" label="Fruit"></md-gb-text-field>
      <md-gb-menu id="menu" filter-for="field" class=${extra}>
        <md-gb-menu-item>Apple</md-gb-menu-item>
        <md-gb-menu-item>Apricot</md-gb-menu-item>
        <md-gb-menu-item>Banana</md-gb-menu-item>
        <md-gb-menu-item>Cherry</md-gb-menu-item>
      </md-gb-menu>
    `;

    // spec: menus-e2bb48, menus-7b2947
    it('filters its items to match what is typed in the attached text field', async () => {
      const {root, menu} = await render(template());
      const field = root.querySelector<HTMLElement>('md-gb-text-field')!;
      field.focus();
      await sendKeys({type: 'ap'});
      expect(await until(() => labels(menu).length === 2)).toBeTrue();
      expect(labels(menu)).toEqual(['Apple', 'Apricot']);
      expect(menu.matches(':popover-open')).toBeTrue();
      // The text field keeps focus; the menu does not take it.
      expect(document.activeElement).toBe(field);
      await sendKeys({type: 'r'});
      expect(await until(() => labels(menu).length === 1)).toBeTrue();
      expect(labels(menu)).toEqual(['Apricot']);
      await sendKeys({press: 'Backspace'});
      await sendKeys({press: 'Backspace'});
      await sendKeys({press: 'Backspace'});
      expect(await until(() => labels(menu).length === 4)).toBeTrue();
      expect(labels(menu)).toEqual(['Apple', 'Apricot', 'Banana', 'Cherry']);
    });

    it('skips filtered out items when moving focus with the arrow keys', async () => {
      const {menu} = await render(template());
      menu.showPopover();
      menu.filter('an');
      expect(labels(menu)).toEqual(['Banana']);
      expect(menu.items.length).toBe(1);
      expect(menu.querySelectorAll('[hidden]').length).toBe(3);

      // 'e' leaves Apple and Cherry, with the hidden Apricot and Banana
      // between them.
      menu.filter('e');
      expect(labels(menu)).toEqual(['Apple', 'Cherry']);
      const [apple, cherry] = menu.items;
      apple.focus();
      expect(await until(() => document.activeElement === apple)).toBeTrue();
      await sendKeys({press: 'ArrowDown'});
      expect(await until(() => document.activeElement === cherry)).toBeTrue();
      await sendKeys({press: 'ArrowUp'});
      expect(await until(() => document.activeElement === apple)).toBeTrue();
    });

    // spec: menus-667232
    it('eases the remaining items into their new position', async () => {
      const {menu} = await render(template());
      menu.showPopover();
      const banana = menu.items[2];
      const animate = spyOn(banana, 'animate').and.callThrough();
      menu.filter('ba');
      expect(animate).toHaveBeenCalled();
      const frames = animate.calls.mostRecent().args[0] as Keyframe[];
      expect(frames[0]['transform']).toMatch(/translateY\(-?[\d.]+px\)/);
      expect(frames[1]['transform']).toBe('none');
    });

    // spec: menus-667232
    it('does not animate the items when motion is reduced', async () => {
      const {menu} = await render(template('md-motion-reduced'));
      menu.showPopover();
      const banana = menu.items[2];
      const animate = spyOn(banana, 'animate').and.callThrough();
      menu.filter('ba');
      expect(animate).not.toHaveBeenCalled();
      expect(labels(menu)).toEqual(['Banana']);
    });
  });
});
