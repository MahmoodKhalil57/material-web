/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import fabStyles from '../fab/fab.cssresult.js';
import focusRingStyles from '../focus/focus-ring.cssresult.js';
import rippleStyles from '../ripple/ripple.cssresult.js';
import './md-gb-fab-menu.js';
import './md-gb-fab-menu-item.js';
import {FabMenuElement} from './fab-menu-element.js';
import {
  FAB_MENU_CLASSES,
  type FabMenuActivateDetail,
  fabMenuButtonClasses,
  fabMenuClasses,
  fabMenuItemClasses,
  isFabMenuOpen,
  setFabMenuOpen,
  setupFabMenu,
} from './fab-menu.js';
import fabMenuStyles from './fab-menu.cssresult.js';

describe('FAB menu', () => {
  let container: HTMLElement;
  let cleanup: AbortController;

  beforeAll(() => {
    adoptStyles(document, [
      m3Styles,
      focusRingStyles,
      rippleStyles,
      fabStyles,
      fabMenuStyles,
    ]);
  });

  beforeEach(() => {
    container = document.createElement('div');
    container.style.cssText = 'position: fixed; inset-block-end: 16px; inset-inline-end: 16px';
    document.body.append(container);
    cleanup = new AbortController();
  });

  afterEach(() => {
    cleanup.abort();
    container.remove();
  });

  /** Resolves a CSS value (e.g. a system color) to its computed form. */
  function resolve(property: string, value: string, host = container) {
    const probe = document.createElement('div');
    probe.style.setProperty(property, value);
    host.append(probe);
    const resolved = getComputedStyle(probe).getPropertyValue(property);
    probe.remove();
    return resolved;
  }

  /**
   * Expects `element` to have focus. Compares by identity (a failed
   * `toBe(element)` serializes the whole element).
   */
  function expectFocused(
    element: Element,
    root: DocumentOrShadowRoot = document,
  ) {
    const active = root.activeElement;
    expect(active === element)
      .withContext(`focused: ${active?.outerHTML.slice(0, 80)}`)
      .toBeTrue();
  }

  /** Jumps every running transition to its end. */
  function settle() {
    for (const animation of document.getAnimations()) animation.finish();
  }

  function key(target: Element, key: string, init: KeyboardEventInit = {}) {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    });
    target.dispatchEvent(event);
    return event;
  }

  function classMenu({
    classes = 'fab-menu fab-menu-primary',
    count = 3,
    button = 'fab fab-primary-container fab-menu-button',
  } = {}) {
    const items = Array.from(
      {length: count},
      (_, i) => `<button class="fab-menu-item">Item ${i}</button>`,
    ).join('');
    container.innerHTML = `
      <div class="${classes}">
        <div class="fab-menu-list">${items}</div>
        <button class="${button}" aria-label="Actions">
          <span class="fab-menu-button-icon">+</span>
          <span class="fab-menu-button-close-icon">x</span>
        </button>
      </div>`;
    const menu = container.querySelector<HTMLElement>('.fab-menu')!;
    setupFabMenu(menu, {signal: cleanup.signal});
    return {
      menu,
      list: menu.querySelector<HTMLElement>('.fab-menu-list')!,
      button: menu.querySelector<HTMLElement>('.fab-menu-button')!,
      items: Array.from(menu.querySelectorAll<HTMLElement>('.fab-menu-item')),
    };
  }

  describe('class API', () => {
    it('returns menu classes for the state', () => {
      expect(fabMenuClasses()).toEqual({
        'fab-menu': true,
        'fab-menu-primary': true,
        'fab-menu-secondary': false,
        'fab-menu-tertiary': false,
        'fab-menu-open': false,
        'fab-menu-start': false,
      });
      expect(
        fabMenuClasses({color: 'tertiary', open: true, align: 'start'}),
      ).toEqual(
        jasmine.objectContaining({
          'fab-menu-primary': false,
          'fab-menu-tertiary': true,
          'fab-menu-open': true,
          'fab-menu-start': true,
        }),
      );
    });

    it('reuses the FAB classes for the toggle FAB', () => {
      const classes = fabMenuButtonClasses({color: 'secondary', size: 'lg'});
      expect(classes).toEqual(
        jasmine.objectContaining({
          'fab': true,
          'fab-secondary-container': true,
          'fab-primary-container': false,
          'fab-lg': true,
          'fab-menu-button': true,
          'ripple': true,
        }),
      );
    });

    it('returns item classes with ripples and focus rings', () => {
      expect(fabMenuItemClasses({hover: true})).toEqual(
        jasmine.objectContaining({
          'fab-menu-item': true,
          'ripple': true,
          'focus-ring-outer': true,
          'hover': true,
          'active': false,
        }),
      );
    });
  });

  describe('setupFabMenu()', () => {
    it('adds menu button ARIA', () => {
      const {list, button, items} = classMenu();
      expect(list.getAttribute('role')).toBe('menu');
      expect(list.id).toBeTruthy();
      expect(list.inert).toBeTrue();
      expect(button.getAttribute('aria-haspopup')).toBe('menu');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.getAttribute('aria-controls')).toBe(list.id);
      for (const item of items) {
        expect(item.getAttribute('role')).toBe('menuitem');
        expect(item.tabIndex).toBe(-1);
      }
    });

    // spec: fab-menu-6fcfde, fab-menu-f9c15a, fab-menu-8ec7af, fab-menu-8ab78c
    it('toggles when the FAB is clicked, keeping focus on it', () => {
      const {menu, list, button} = classMenu();
      const toggles: string[] = [];
      menu.addEventListener('toggle', (event) => {
        toggles.push((event as ToggleEvent).newState);
      });
      button.focus();
      button.click();
      expect(isFabMenuOpen(menu)).toBeTrue();
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(list.inert).toBeFalse();
      expectFocused(button);
      button.click();
      expect(isFabMenuOpen(menu)).toBeFalse();
      expect(list.inert).toBeTrue();
      expect(toggles).toEqual(['open', 'closed']);
    });

    it('opens with arrow keys and focuses the first or last item', () => {
      const {menu, button, items} = classMenu();
      button.focus();
      key(button, 'ArrowDown');
      expect(isFabMenuOpen(menu)).toBeTrue();
      expectFocused(items[0]);
      setFabMenuOpen(menu, false, 'button');
      key(button, 'ArrowUp');
      expectFocused(items[2]);
    });

    // spec: fab-menu-dc26b8, fab-menu-fc5c9b, fab-menu-f1c4d4, fab-menu-c75cd5
    it('moves focus from the FAB to the top item with Tab', () => {
      const {menu, button, items} = classMenu();
      button.focus();
      expect(key(button, 'Tab').defaultPrevented).toBeFalse();
      button.click();
      expect(key(button, 'Tab').defaultPrevented).toBeTrue();
      expectFocused(items[0]);
      expect(isFabMenuOpen(menu)).toBeTrue();
    });

    it('navigates items with arrow keys, Home and End', () => {
      const {menu, items} = classMenu();
      setFabMenuOpen(menu, true, 'first-item');
      key(items[0], 'ArrowDown');
      expectFocused(items[1]);
      key(items[1], 'ArrowUp');
      key(items[0], 'ArrowUp');
      expectFocused(items[2]);
      key(items[2], 'ArrowDown');
      expectFocused(items[0]);
      key(items[0], 'End');
      expectFocused(items[2]);
      key(items[2], 'Home');
      expectFocused(items[0]);
    });

    // spec: fab-menu-ca1ce3, fab-menu-e8a4e5
    it('moves through items with Tab and closes after the last one', () => {
      const {menu, button, items} = classMenu();
      setFabMenuOpen(menu, true, 'first-item');
      key(items[0], 'Tab');
      expectFocused(items[1]);
      key(items[1], 'Tab', {shiftKey: true});
      expectFocused(items[0]);
      key(items[0], 'Tab', {shiftKey: true});
      expectFocused(button);
      expect(isFabMenuOpen(menu)).toBeTrue();
      items[2].focus();
      // Not prevented: Tab continues from the FAB, out of the menu.
      expect(key(items[2], 'Tab').defaultPrevented).toBeFalse();
      expect(isFabMenuOpen(menu)).toBeFalse();
      expectFocused(button);
    });

    it('closes on Escape and returns focus to the FAB', () => {
      const {menu, button, items} = classMenu();
      setFabMenuOpen(menu, true, 'last-item');
      expectFocused(items[2]);
      key(items[2], 'Escape');
      expect(isFabMenuOpen(menu)).toBeFalse();
      expectFocused(button);
    });

    it('fires activate and closes when an item is activated', () => {
      const {menu, button, items} = classMenu();
      const activated: HTMLElement[] = [];
      menu.addEventListener('activate', (event) => {
        activated.push((event as CustomEvent<FabMenuActivateDetail>).detail.item);
      });
      setFabMenuOpen(menu, true, 'first-item');
      items[1].click();
      expect(activated.length).toBe(1);
      expect(activated[0] === items[1]).toBeTrue();
      expect(isFabMenuOpen(menu)).toBeFalse();
      expectFocused(button);
    });

    it('stays open when activate is canceled', () => {
      const {menu, items} = classMenu();
      menu.addEventListener('activate', (event) => {
        event.preventDefault();
      });
      setFabMenuOpen(menu, true);
      items[0].click();
      expect(isFabMenuOpen(menu)).toBeTrue();
    });

    // spec: fab-menu-84c94b, fab-menu-e61b91
    it('activates non-button items with Enter and Space', () => {
      container.innerHTML = `
        <div class="fab-menu fab-menu-primary">
          <div class="fab-menu-list"><div class="fab-menu-item">A</div></div>
          <button class="fab fab-menu-button"></button>
        </div>`;
      const menu = container.querySelector<HTMLElement>('.fab-menu')!;
      setupFabMenu(menu, {signal: cleanup.signal});
      const item = menu.querySelector<HTMLElement>('.fab-menu-item')!;
      const clicked = jasmine.createSpy('click');
      item.addEventListener('click', clicked);
      setFabMenuOpen(menu, true, 'first-item');
      key(item, ' ');
      expect(clicked).toHaveBeenCalledTimes(1);
      setFabMenuOpen(menu, true, 'first-item');
      key(item, 'Enter');
      expect(clicked).toHaveBeenCalledTimes(2);
    });

    it('closes when pressing outside of the menu', () => {
      const {menu} = classMenu();
      setFabMenuOpen(menu, true);
      menu.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true}));
      expect(isFabMenuOpen(menu)).toBeTrue();
      document.body.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true}));
      expect(isFabMenuOpen(menu)).toBeFalse();
    });
  });

  describe('styles', () => {
    it('sizes the FAB from the FAB tokens and the close button from the spec', () => {
      const {menu, button} = classMenu();
      let style = getComputedStyle(button);
      expect(style.width).toBe('56px');
      expect(style.height).toBe('56px');
      expect(style.borderRadius).toBe('16px');
      setFabMenuOpen(menu, true);
      settle();
      style = getComputedStyle(button);
      expect(style.width).toBe('56px');
      expect(style.height).toBe('56px');
      // Compose: close button corner radius = size / 2.
      expect(style.borderRadius).toBe('28px');
    });

    // spec: fab-menu-ab7d13, fab-menu-1c5a6e, fab-menu-93569a, fab-menu-891264, fab-menu-3c6061
    it('morphs a large FAB into the close button at its top-end corner', () => {
      const {menu, button} = classMenu({
        button: 'fab fab-primary-container fab-lg fab-menu-button',
      });
      expect(getComputedStyle(button).width).toBe('96px');
      setFabMenuOpen(menu, true);
      settle();
      const style = getComputedStyle(button);
      expect(style.width).toBe('56px');
      expect(style.height).toBe('56px');
      expect(style.marginInlineStart).toBe('40px');
      expect(style.marginBlockEnd).toBe('40px');
      expect(menu.getBoundingClientRect().height).toBe(96);
    });

    for (const color of ['primary', 'secondary', 'tertiary']) {
      // spec: fab-menu-9100dd, fab-menu-4cd34f, fab-menu-07a61e, fab-menu-32c724, fab-menu-b58894, fab-menu-8a7a39, fab-menu-cc1c79, fab-menu-d073c7, fab-menu-76a51a, fab-menu-d4493c, fab-menu-0691f0, fab-menu-5c3009, fab-menu-f92b2d, fab-menu-b8ce89, fab-menu-5c99c3, fab-menu-bc20ba, fab-menu-dce772, fab-menu-60075f, fab-menu-cf46c9, fab-menu-4648ec, fab-menu-d74989, fab-menu-17b062, fab-menu-908b35, fab-menu-7f042e
      it(`uses the ${color} colors`, () => {
        const {menu, button, items} = classMenu({
          classes: `fab-menu fab-menu-${color}`,
          button: `fab fab-${color}-container fab-menu-button`,
        });
        expect(getComputedStyle(button).backgroundColor).toBe(
          resolve('background-color', `var(--md-sys-color-${color}-container)`),
        );
        setFabMenuOpen(menu, true);
        settle();
        expect(getComputedStyle(button).backgroundColor).toBe(
          resolve('background-color', `var(--md-sys-color-${color})`),
        );
        expect(getComputedStyle(button).color).toBe(
          resolve('color', `var(--md-sys-color-on-${color})`),
        );
        const item = getComputedStyle(items[0]);
        expect(item.backgroundColor).toBe(
          resolve('background-color', `var(--md-sys-color-${color}-container)`),
        );
        expect(item.color).toBe(
          resolve('color', `var(--md-sys-color-on-${color}-container)`),
        );
      });
    }

    // spec: fab-menu-1ca329, fab-menu-2315f2
    it('sizes and spaces items from the spec', () => {
      const {menu, button, items} = classMenu();
      setFabMenuOpen(menu, true);
      settle();
      const [first, second, last] = items.map((item) =>
        item.getBoundingClientRect(),
      );
      expect(first.height).toBe(56);
      expect(second.top - first.bottom).toBe(4);
      expect(button.getBoundingClientRect().top - last.bottom).toBe(8);
      // End-aligned with the FAB.
      expect(first.right).toBe(button.getBoundingClientRect().right);
      // Hugs its content: 24px padding on both sides.
      const label = document.createRange();
      label.selectNodeContents(items[0]);
      expect(first.width).toBeCloseTo(label.getBoundingClientRect().width + 48, 0);
      expect(getComputedStyle(items[0]).fontSize).toBe(
        resolve('font-size', 'var(--md-sys-typescale-title-md-size, 16px)'),
      );
    });

    it('aligns items to the start', () => {
      const {menu, button, items} = classMenu({
        classes: 'fab-menu fab-menu-primary fab-menu-start',
      });
      setFabMenuOpen(menu, true);
      settle();
      expect(items[0].getBoundingClientRect().left).toBe(
        button.getBoundingClientRect().left,
      );
    });

    it('hides closed items after their exit animation', () => {
      const {menu, items} = classMenu();
      const item = getComputedStyle(items[0]);
      expect(item.visibility).toBe('hidden');
      expect(item.opacity).toBe('0');
      expect(item.width).toBe('0px');
      setFabMenuOpen(menu, true);
      settle();
      expect(item.visibility).toBe('visible');
      expect(item.opacity).toBe('1');
      setFabMenuOpen(menu, false);
      expect(item.visibility).toBe('visible');
      settle();
      expect(item.visibility).toBe('hidden');
    });

    // spec: fab-menu-59e91a
    it('staggers items bottom-up when opening and top-down when closing', () => {
      const {menu, items} = classMenu();
      const delays = () =>
        items.map((item) => parseFloat(getComputedStyle(item).transitionDelay.split(',')[1]));
      setFabMenuOpen(menu, true);
      const enter = delays();
      expect(enter[2]).toBeLessThan(enter[1]);
      expect(enter[1]).toBeLessThanOrEqual(enter[0]);
      settle();
      setFabMenuOpen(menu, false);
      const exit = delays();
      expect(exit[0]).toBe(0);
      expect(exit[0]).toBeLessThan(exit[1]);
      expect(exit[1]).toBeLessThan(exit[2]);
    });

    it('animates with the motion scheme springs', () => {
      const {button, items} = classMenu();
      const easing = getComputedStyle(button).transitionTimingFunction;
      expect(easing).toContain('linear(');
      expect(getComputedStyle(items[0]).transitionProperty).toContain(
        'inline-size',
      );
    });
  });

  describe('<md-gb-fab-menu>', () => {
    async function element(html: string) {
      container.innerHTML = html;
      const el = container.firstElementChild as FabMenuElement;
      await el.updateComplete;
      const root = el.shadowRoot!;
      return {
        el,
        menu: root.querySelector<HTMLElement>('.fab-menu')!,
        button: root.querySelector<HTMLElement>('.fab-menu-button')!,
        list: root.querySelector<HTMLElement>('.fab-menu-list')!,
        items: Array.from(el.querySelectorAll<HTMLElement>('md-gb-fab-menu-item')),
      };
    }

    const markup = `
      <md-gb-fab-menu aria-label="Create">
        <md-gb-fab-menu-item>First</md-gb-fab-menu-item>
        <md-gb-fab-menu-item>Second</md-gb-fab-menu-item>
        <md-gb-fab-menu-item>Third</md-gb-fab-menu-item>
      </md-gb-fab-menu>`;

    it('renders an accessible menu button', async () => {
      const {button, list, items} = await element(markup);
      expect(button.getAttribute('aria-label')).toBe('Create');
      expect(button.getAttribute('aria-haspopup')).toBe('menu');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.getAttribute('aria-controls')).toBe(list.id);
      expect(list.getAttribute('role')).toBe('menu');
      expect(list.inert).toBeTrue();
      expect(items[0].tabIndex).toBe(-1);
      expect(button.classList.contains('fab-primary-container')).toBeTrue();
    });

    it('opens from the FAB and syncs the open property', async () => {
      const {el, button} = await element(markup);
      const toggle = jasmine.createSpy('toggle');
      el.addEventListener('toggle', toggle);
      button.click();
      await el.updateComplete;
      expect(el.open).toBeTrue();
      expect(el.hasAttribute('open')).toBeTrue();
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(toggle).toHaveBeenCalledTimes(1);
    });

    it('opens when the open property is set', async () => {
      const {el, menu, list} = await element(markup);
      el.open = true;
      await el.updateComplete;
      expect(menu.classList.contains(FAB_MENU_CLASSES.fabMenuOpen)).toBeTrue();
      expect(list.inert).toBeFalse();
    });

    it('navigates slotted items and closes on activation', async () => {
      const {el, button, items} = await element(markup);
      const activate = jasmine.createSpy('activate');
      container.addEventListener('activate', activate);
      button.focus();
      key(button, 'ArrowDown');
      await el.updateComplete;
      expectFocused(items[0]);
      key(items[0], 'ArrowDown');
      expectFocused(items[1]);
      key(items[1], 'Enter');
      await el.updateComplete;
      expect(activate).toHaveBeenCalledTimes(1);
      const {detail} = activate.calls.first()
        .args[0] as CustomEvent<FabMenuActivateDetail>;
      expect(detail.item === items[1]).toBeTrue();
      expect(el.open).toBeFalse();
      expectFocused(button, el.shadowRoot!);
    });

    it('closes on Escape', async () => {
      const {el, button, items} = await element(markup);
      el.open = true;
      await el.updateComplete;
      items[2].focus();
      key(items[2], 'Escape');
      await el.updateComplete;
      expect(el.open).toBeFalse();
      expectFocused(button, el.shadowRoot!);
    });

    it('styles slotted items with the menu colors and stagger', async () => {
      const {el, items} = await element(
        markup.replace('<md-gb-fab-menu ', '<md-gb-fab-menu color="secondary" '),
      );
      el.open = true;
      await el.updateComplete;
      const inner = items[0].shadowRoot!.querySelector<HTMLElement>('.fab-menu-item')!;
      expect(getComputedStyle(items[0]).getPropertyValue('--fab-menu-item-delay')).not.toBe('');
      settle();
      expect(getComputedStyle(inner).backgroundColor).toBe(
        resolve('background-color', 'var(--md-sys-color-secondary-container)'),
      );
      expect(getComputedStyle(items[0]).visibility).toBe('visible');
      expect(inner.getBoundingClientRect().height).toBe(56);
      el.open = false;
      await el.updateComplete;
      settle();
      expect(getComputedStyle(items[0]).visibility).toBe('hidden');
    });
  });
});
