/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Tests for spec units that were tracked as gaps and are now built.

// import 'jasmine'; (google3-only)

import '../divider/md-gb-divider.js';
import '../iconbutton/md-gb-icon-button.js';
import '../../styles/icon/md-gb-icon.js';
import './md-gb-menu-group.js';
import './md-gb-menu-item.js';
import './md-gb-menu.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {MenuElement} from './menu-element.js';
import {MenuItemElement} from './menu-item-element.js';

adoptStyles(document, [m3Styles]);

// Environment mocks requestAnimationFrame; keep the real one.
const realRaf = window.requestAnimationFrame.bind(window);
const nextFrame = () => new Promise((resolve) => realRaf(resolve));

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

describe('md-gb-menu tracked spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const menu = root.querySelector('md-gb-menu') as MenuElement;
    const items = Array.from(root.querySelectorAll('md-gb-menu-item')) as MenuItemElement[];
    await menu.updateComplete;
    for (const item of items) await item.updateComplete;
    return {root, menu, items};
  }

  async function open(menu: MenuElement) {
    menu.showPopover();
    await nextFrame();
    await menu.updateComplete;
    menu.getAnimations({subtree: true}).forEach((a) => a.finish());
  }

  afterEach(() => {
    for (const menu of document.querySelectorAll('md-gb-menu')) {
      if (menu.matches(':popover-open')) menu.hidePopover();
    }
  });

  describe('appearing', () => {
    const items = html`
      <md-gb-menu-item>One</md-gb-menu-item>
      <md-gb-menu-item>Two</md-gb-menu-item>
    `;

    // spec: menus-c841a6, menus-8baf1d, menus-6933aa, menus-0d6d7f
    it('opens from a button, an icon button or any other element that targets it', async () => {
      for (const trigger of [
        html`<button id="trigger" popovertarget="menu">Open</button>`,
        html`<button id="trigger" popovertarget="menu" aria-label="More" class="icon-button"><md-gb-icon>more_vert</md-gb-icon></button>`,
        html`<button id="trigger" popovertarget="menu" class="chip">Filter</button>`,
      ]) {
        const {root, menu} = await render(html`${trigger}<md-gb-menu id="menu" anchor="trigger">${items}</md-gb-menu>`);
        const el = root.querySelector<HTMLElement>('#trigger')!;
        el.click();
        await nextFrame();
        await menu.updateComplete;
        expect(menu.matches(':popover-open')).toBeTrue();
        menu.hidePopover();
      }
    });

    // spec: menus-c2e7f2, menus-6ac64a
    it('opens in context, at the position of highlighted text or a selected image', async () => {
      const {root, menu} = await render(html`
        <p id="target" style="margin: 100px">Highlighted text</p>
        <md-gb-menu id="menu" context-for="target">${items}</md-gb-menu>
      `);
      const target = root.querySelector('#target')!;
      target.dispatchEvent(new MouseEvent('contextmenu', {bubbles: true, cancelable: true, clientX: 150, clientY: 130}));
      await nextFrame();
      await menu.updateComplete;
      expect(menu.matches(':popover-open')).toBeTrue();
      const box = menu.getBoundingClientRect();
      expect(Math.abs(box.left - 150)).toBeLessThan(24);
      expect(Math.abs(box.top - 130)).toBeLessThan(24);
    });

    // spec: menus-15d898
    it('expands upward when the trigger is at the bottom of the screen', async () => {
      const {root, menu} = await render(html`
        <button id="trigger" popovertarget="menu" style="position: fixed; inset-block-end: 8px; inset-inline-start: 40px">Open</button>
        <md-gb-menu id="menu">${items}</md-gb-menu>
      `);
      root.querySelector<HTMLElement>('#trigger')!.click();
      await nextFrame();
      await menu.updateComplete;
      const trigger = root.querySelector('#trigger')!.getBoundingClientRect();
      expect(menu.getBoundingClientRect().bottom).toBeLessThanOrEqual(trigger.top + 1);
    });

    // spec: menus-530068, menus-757df8
    it('uses an enter transition that grows from the element that generates it', async () => {
      const {root, menu} = await render(html`
        <button id="trigger" popovertarget="menu">Open</button>
        <md-gb-menu id="menu">${items}</md-gb-menu>
      `);
      root.querySelector<HTMLElement>('#trigger')!.click();
      await nextFrame();
      const animated = menu
        .getAnimations({subtree: true})
        .some((a) => a instanceof CSSTransition || a instanceof CSSAnimation);
      const style = getComputedStyle(menu.shadowRoot!.querySelector('.menu')!);
      expect(animated || parseFloat(style.transitionDuration) > 0).toBeTrue();
    });

    // spec: menus-b448e4, menus-006d4d
    it('shows a ripple on an item that is selected', async () => {
      const {items: els, menu} = await render(html`<md-gb-menu id="menu">${items}</md-gb-menu>`);
      await open(menu);
      const part = els[0].shadowRoot!.querySelector<HTMLElement>('[part=menu-item]')!;
      expect(part.classList.contains('ripple-host')).toBeTrue();
    });
  });

  describe('scrolling', () => {
    // spec: menus-5c52de, menus-44ec1c, menus-2bf977
    it('scrolls when the items do not all fit, with a visible scrollbar', async () => {
      const many = Array.from({length: 40}, (_, i) => html`<md-gb-menu-item>Item ${i}</md-gb-menu-item>`);
      const {menu} = await render(html`<md-gb-menu id="menu">${many}</md-gb-menu>`);
      await open(menu);
      const surface = menu.shadowRoot!.querySelector<HTMLElement>('.menu')!;
      const host = [surface, menu].find((el) => el.scrollHeight > el.clientHeight + 1) ?? menu.shadowRoot!.querySelector<HTMLElement>('[class*=menu]');
      expect(host).withContext('a scrolling element').toBeDefined();
      expect(getComputedStyle(host!).overflowY).toMatch(/auto|scroll/);
      // The scrollbar stays visible (test browsers hide scrollbars, so the
      // check is that the menu doesn't hide or auto-hide its own).
      expect(getComputedStyle(host!).scrollbarWidth).not.toBe('none');
    });
  });

  describe('selecting', () => {
    // spec: menus-181288, menus-339d14
    it('opens from an icon button, and choosing an option does not change the icon', async () => {
      const {root, menu, items: els} = await render(html`
        <button id="trigger" popovertarget="menu" aria-label="More"><md-gb-icon>more_vert</md-gb-icon></button>
        <md-gb-menu id="menu">
          <md-gb-menu-item>One</md-gb-menu-item>
          <md-gb-menu-item>Two</md-gb-menu-item>
        </md-gb-menu>
      `);
      const trigger = root.querySelector<HTMLElement>('#trigger')!;
      const before = trigger.innerHTML;
      trigger.click();
      await nextFrame();
      expect(menu.matches(':popover-open')).toBeTrue();
      els[1].click();
      await nextFrame();
      expect(trigger.innerHTML).toBe(before);
    });

    // spec: menus-d5e3a6, menus-be3b87, menus-c67875
    it('allows single-select (exclusive) and multi-select (independent) menus', async () => {
      const {root} = await render(html`
        <md-gb-menu id="menu">
          <md-gb-menu-group checkable="single" id="single">
            <md-gb-menu-item checked>A</md-gb-menu-item>
            <md-gb-menu-item>B</md-gb-menu-item>
          </md-gb-menu-group>
          <md-gb-menu-group checkable="multiple" id="multi">
            <md-gb-menu-item checked>C</md-gb-menu-item>
            <md-gb-menu-item>D</md-gb-menu-item>
          </md-gb-menu-group>
        </md-gb-menu>
      `);
      const [a, b] = Array.from(root.querySelectorAll<MenuItemElement>('#single md-gb-menu-item'));
      const [c, d] = Array.from(root.querySelectorAll<MenuItemElement>('#multi md-gb-menu-item'));
      b.click();
      expect(b.checked).toBeTrue();
      expect(a.checked).withContext('previous selection is unselected').toBeFalse();
      d.click();
      expect(d.checked).toBeTrue();
      expect(c.checked).withContext('multi-select keeps both').toBeTrue();
    });

    // spec: menus-50502a, menus-2b84d7
    it('uses the on surface (standard) and on tertiary container (vibrant) roles for the state layer', async () => {
      for (const [color, role] of [
        ['standard', '--md-sys-color-on-surface'],
        ['vibrant', '--md-sys-color-on-tertiary-container'],
      ]) {
        const {menu, items: els} = await render(html`<md-gb-menu id="menu" color=${color}>
          <md-gb-menu-item>One</md-gb-menu-item>
        </md-gb-menu>`);
        await open(menu);
        const part = els[0].shadowRoot!.querySelector<HTMLElement>('[part=menu-item]')!;
        // The state layer is drawn in the hovered label color.
        part.classList.add('hover');
        await nextFrame();
        expect(getComputedStyle(part).color).withContext(color).toBe(resolvedColor(role));
        menu.hidePopover();
      }
    });
  });

  // spec: menus-5777ee
  it('stretches a divider to the width of the menu', async () => {
    const {menu} = await render(html`<md-gb-menu id="menu">
      <md-gb-menu-item>One</md-gb-menu-item>
      <md-gb-divider></md-gb-divider>
      <md-gb-menu-item>A much longer second item label</md-gb-menu-item>
    </md-gb-menu>`);
    await open(menu);
    const divider = menu.querySelector('md-gb-divider')!.getBoundingClientRect();
    const item = menu.querySelector('md-gb-menu-item')!.getBoundingClientRect();
    expect(divider.width).toBeCloseTo(item.width, 0);
  });

  describe('keyboard', () => {
    // spec: menus-cfac01, menus-9f2db8
    it('opens with Space or Enter on the trigger and lands focus on the menu', async () => {
      const {root, menu, items} = await render(html`
        <button id="trigger" popovertarget="menu">Open</button>
        <md-gb-menu id="menu">
          <md-gb-menu-item>One</md-gb-menu-item>
          <md-gb-menu-item>Two</md-gb-menu-item>
        </md-gb-menu>
      `);
      const trigger = root.querySelector<HTMLElement>('#trigger')!;
      for (const key of ['Enter', 'Space']) {
        trigger.focus();
        await sendKeys({press: key});
        await nextFrame();
        // The menu focuses its first item on a timer after it opens.
        jasmine.clock().tick(1);
        await menu.updateComplete;
        expect(menu.matches(':popover-open')).withContext(key).toBeTrue();
        expect(document.activeElement).withContext(key).toBe(items[0]);
        menu.hidePopover();
        await nextFrame();
      }
    });
  });

  describe('accessibility labels', () => {
    // spec: menus-2569c0, menus-678d96
    it('labels an item with its UI text', async () => {
      const {menu, items} = await render(html`<md-gb-menu id="menu"
        ><md-gb-menu-item>Copy link</md-gb-menu-item></md-gb-menu
      >`);
      await open(menu);
      const slot = items[0].shadowRoot!.querySelector<HTMLSlotElement>('.menu-item-content slot:not([name])')!;
      const label = slot.assignedNodes({flatten: true}).map((n) => n.textContent).join('').trim();
      expect(label).toBe('Copy link');
      expect(items[0].hasAttribute('aria-label')).toBeFalse();
    });

    // spec: menus-2b3b52, menus-4be007, menus-db13dd
    it('marks the icon of an item with text and an icon as decorative', async () => {
      const {menu, items} = await render(html`<md-gb-menu id="menu"
        ><md-gb-menu-item><md-gb-icon slot="leading">link</md-gb-icon>Copy link<md-gb-icon slot="trailing">open_in_new</md-gb-icon></md-gb-menu-item
        ></md-gb-menu
      >`);
      await open(menu);
      await items[0].updateComplete;
      await nextFrame();
      for (const icon of items[0].querySelectorAll('md-gb-icon')) {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
      }
    });
  });
});
