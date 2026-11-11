/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// Expectations compare indices and booleans, not elements: a failing
// expectation on an element can stall the test runner while it serializes
// the element.

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {internals} from '../../internal/behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import './md-gb-menu.js';
import './md-gb-menu-group.js';
import './md-gb-menu-item.js';
import {MENU_CLASSES, menuClasses} from './menu.js';
import {LONG_PRESS_MS, type MenuElement} from './menu-element.js';
import {type MenuGroupElement} from './menu-group-element.js';
import {
  SUBMENU_HOVER_DELAY_MS,
  type MenuItemElement,
} from './menu-item-element.js';
import menuStyles from './menu.cssresult.js';

adoptStyles(document, [m3Styles, menuStyles]);

/** Waits for a popover's (async) `toggle` event. */
function toggled(element: HTMLElement) {
  return new Promise<void>((resolve) => {
    element.addEventListener('toggle', () => resolve(), {once: true});
  });
}

describe('<md-gb-menu>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`
      <md-gb-menu id="menu">
        <md-gb-menu-item>Cut</md-gb-menu-item>
        <md-gb-menu-item disabled>Copy</md-gb-menu-item>
        <md-gb-menu-item>Paste</md-gb-menu-item>
        <md-gb-menu-item>
          Share
          <md-gb-menu slot="submenu" id="submenu">
            <md-gb-menu-item>Email</md-gb-menu-item>
            <md-gb-menu-item>Message</md-gb-menu-item>
          </md-gb-menu>
        </md-gb-menu-item>
      </md-gb-menu>
    `,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const menu = root.querySelector('#menu') as MenuElement;
    const items = menu.items as MenuItemElement[];
    const submenu = root.querySelector('#submenu') as MenuElement | null;
    return {root, menu, items, submenu};
  }

  async function open(menu: MenuElement) {
    const done = toggled(menu);
    menu.showPopover();
    await done;
    jasmine.clock().tick(1);
    await menu.updateComplete;
  }

  function key(target: Element, keyName: string, timeStamp?: number) {
    const event = new KeyboardEvent('keydown', {
      key: keyName,
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    if (timeStamp !== undefined) {
      Object.defineProperty(event, 'timeStamp', {value: timeStamp});
    }
    target.dispatchEvent(event);
    return event;
  }

  function focusedIndex(items: HTMLElement[]) {
    return items.findIndex((item) => item.matches(':focus'));
  }

  describe('rendering', () => {
    it('has the menu and menu item roles', async () => {
      const {menu, items} = await setupTest();
      expect(menu[internals].role).toBe('menu');
      expect(items[0][internals].role).toBe('menuitem');
    });

    it('is an auto popover', async () => {
      const {menu} = await setupTest();
      expect(menu.popover).toBe('auto');
    });

    it('lists only its own items, not its submenus', async () => {
      const {items, submenu} = await setupTest();
      expect(items.length).toBe(4);
      expect(submenu!.items.length).toBe(2);
    });

    it('rounds the outer corners of the first and last items', async () => {
      const {items} = await setupTest();
      const part = (item: HTMLElement) =>
        getComputedStyle(item.shadowRoot!.querySelector('.menu-item')!);
      // md.comp.menus.menu-item.first-child.shape / inner-corner (md / xs).
      expect(part(items[0]).borderTopLeftRadius).toBe('12px');
      expect(part(items[0]).borderBottomLeftRadius).toBe('4px');
      expect(part(items[2]).borderTopLeftRadius).toBe('4px');
      expect(part(items[3]).borderTopLeftRadius).toBe('4px');
      expect(part(items[3]).borderBottomRightRadius).toBe('12px');
    });

    // spec: menus-14f041
    it('rounds every corner of a selected item', async () => {
      const {items} = await setupTest();
      items[2].checked = true;
      await items[2].updateComplete;
      const part = getComputedStyle(
        items[2].shadowRoot!.querySelector('.menu-item')!,
      );
      // md.comp.menus.menu-item.selected.shape (md).
      expect(part.borderTopLeftRadius).toBe('12px');
      expect(part.borderBottomRightRadius).toBe('12px');
    });

    // spec: menus-962801, menus-e401ee
    it('keeps a 48px target for 44px items', async () => {
      const {menu, items} = await setupTest();
      await open(menu);
      expect(items[0].getBoundingClientRect().height).toBeGreaterThanOrEqual(
        48,
      );
    });
  });

  describe('keyboard', () => {
    // spec: menus-7c5dc4
    it('focuses the first item when opened', async () => {
      const {menu, items} = await setupTest();
      await open(menu);
      expect(focusedIndex(items)).toBe(0);
    });

    it('moves focus with Up, Down, Home and End, including disabled items', async () => {
      const {menu, items} = await setupTest();
      await open(menu);
      key(items[0], 'ArrowDown');
      // "Disabled menu items can receive focus".
      expect(focusedIndex(items)).toBe(1);
      key(items[1], 'End');
      expect(focusedIndex(items)).toBe(3);
      key(items[3], 'ArrowDown');
      expect(focusedIndex(items)).toBe(0);
      key(items[0], 'ArrowUp');
      expect(focusedIndex(items)).toBe(3);
      key(items[3], 'Home');
      expect(focusedIndex(items)).toBe(0);
    });

    it('does not select disabled items', async () => {
      const {menu, items} = await setupTest();
      await open(menu);
      const click = jasmine.createSpy('click');
      items[1].addEventListener('click', click);
      items[1].focus();
      key(items[1], 'Enter');
      expect(menu.matches(':popover-open')).toBeTrue();
    });

    it('moves focus to the next item starting with a typed letter', async () => {
      const {menu, items} = await setupTest();
      await open(menu);
      key(items[0], 's', 1000);
      expect(focusedIndex(items)).toBe(3);
      // After a pause, a new search starts.
      key(items[3], 'p', 2000);
      expect(focusedIndex(items)).toBe(2);
      // Typing one letter again cycles through the items starting with it.
      key(items[2], 'c', 3000);
      expect(focusedIndex(items)).toBe(0);
      key(items[0], 'c', 3100);
      expect(focusedIndex(items)).toBe(1);
      // Letters typed in quick succession extend the search.
      key(items[1], 'p', 4000);
      key(items[2], 'a', 4100);
      expect(focusedIndex(items)).toBe(2);
    });

    it('closes on Escape', async () => {
      const {menu} = await setupTest();
      await open(menu);
      const done = toggled(menu);
      document.activeElement!.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
      );
      // Light dismiss runs on the real keyboard event; close explicitly when
      // a synthetic event is ignored.
      if (menu.matches(':popover-open')) menu.hidePopover();
      await done;
      expect(menu.matches(':popover-open')).toBeFalse();
    });

    // spec: menus-9997b0
    it('closes when an item is selected', async () => {
      const {menu, items} = await setupTest();
      await open(menu);
      const done = toggled(menu);
      items[0].click();
      await done;
      expect(menu.matches(':popover-open')).toBeFalse();
    });
  });

  describe('menu button', () => {
    async function setupInvoker() {
      const result = await setupTest(html`
        <button id="invoker" popovertarget="menu">Edit</button>
        <md-gb-menu id="menu">
          <md-gb-menu-item>Cut</md-gb-menu-item>
          <md-gb-menu-item>Copy</md-gb-menu-item>
          <md-gb-menu-item>Paste</md-gb-menu-item>
        </md-gb-menu>
      `);
      const invoker = result.root.querySelector('#invoker') as HTMLElement;
      return {...result, invoker};
    }

    // menus.md "Keyboard navigation": "Up and Down arrows: For closed
    // menus: Opens menu".
    for (const arrow of ['ArrowDown', 'ArrowUp']) {
      it(`opens the closed menu with ${arrow} and focuses the first item`, async () => {
        const {menu, items, invoker} = await setupInvoker();
        invoker.focus();
        const done = toggled(menu);
        const event = key(invoker, arrow);
        await done;
        jasmine.clock().tick(1);
        expect(event.defaultPrevented).toBeTrue();
        expect(menu.matches(':popover-open')).toBeTrue();
        expect(focusedIndex(items)).toBe(0);
      });
    }

    it('returns focus to the button when closed', async () => {
      const {menu, invoker} = await setupInvoker();
      invoker.focus();
      const opened = toggled(menu);
      key(invoker, 'ArrowDown');
      await opened;
      jasmine.clock().tick(1);
      const closed = toggled(menu);
      menu.hidePopover();
      await closed;
      expect(document.activeElement === invoker).toBeTrue();
    });

    it('ignores arrows on other elements and with modifiers', async () => {
      const {root, menu, invoker} = await setupInvoker();
      const other = document.createElement('button');
      root.appendChild(other);
      expect(key(other, 'ArrowDown').defaultPrevented).toBeFalse();
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        altKey: true,
        bubbles: true,
        cancelable: true,
      });
      invoker.dispatchEvent(event);
      expect(event.defaultPrevented).toBeFalse();
      expect(menu.matches(':popover-open')).toBeFalse();
    });
  });

  describe('density', () => {
    // spec: menus-98d439
    it('defaults to 0, clamps to 0..-3 and reflects', async () => {
      const {menu} = await setupTest();
      expect(menu.density).toBe(0);
      menu.density = -7;
      expect(menu.density).toBe(-3);
      menu.density = 1;
      expect(menu.density).toBe(0);
      menu.density = -1.6;
      await menu.updateComplete;
      expect(menu.density).toBe(-2);
      expect(menu.getAttribute('density')).toBe('-2');
    });

    // spec: menus-f2762d
    it('removes 4px of item height per step', async () => {
      const {menu, items, submenu} = await setupTest();
      await open(menu);
      for (const [density, height] of [
        [0, 48],
        [-1, 44],
        [-2, 40],
        [-3, 36],
      ]) {
        menu.density = density;
        await menu.updateComplete;
        expect(items[0].getBoundingClientRect().height)
          .withContext(`density ${density}`)
          .toBe(height);
      }
      // Submenu items inherit the menu's density.
      const part = submenu!.items[0].shadowRoot!.querySelector('.menu-item')!;
      expect(getComputedStyle(part).minHeight).toBe('36px');
    });
  });

  describe('submenus', () => {
    it('marks the item as opening a menu', async () => {
      const {items} = await setupTest();
      await items[3].updateComplete;
      expect(items[3][internals].ariaHasPopup).toBe('menu');
      expect(items[3][internals].ariaExpanded).toBe('false');
      expect(items[0][internals].ariaHasPopup).toBeNull();
      expect(
        items[3].shadowRoot!.querySelector('.menu-item-submenu-icon'),
      ).not.toBeNull();
    });

    // spec: menus-442139
    it('opens with Right and focuses its first item', async () => {
      const {menu, items, submenu} = await setupTest();
      await open(menu);
      items[3].focus();
      const done = toggled(submenu!);
      key(items[3], 'ArrowRight');
      await done;
      jasmine.clock().tick(1);
      await items[3].updateComplete;
      expect(submenu!.matches(':popover-open')).toBeTrue();
      // The parent menu stays open (nested popover).
      expect(menu.matches(':popover-open')).toBeTrue();
      expect(focusedIndex(submenu!.items)).toBe(0);
      expect(items[3][internals].ariaExpanded).toBe('true');
    });

    it('opens with Enter and on click without closing the menu', async () => {
      const {menu, items, submenu} = await setupTest();
      await open(menu);
      const done = toggled(submenu!);
      items[3].click();
      await done;
      expect(submenu!.matches(':popover-open')).toBeTrue();
      expect(menu.matches(':popover-open')).toBeTrue();
    });

    it('closes with Left and returns focus to its item', async () => {
      const {menu, items, submenu} = await setupTest();
      await open(menu);
      items[3].focus();
      let done = toggled(submenu!);
      key(items[3], 'ArrowRight');
      await done;
      jasmine.clock().tick(1);
      done = toggled(submenu!);
      key(submenu!.items[0], 'ArrowLeft');
      await done;
      expect(submenu!.matches(':popover-open')).toBeFalse();
      expect(menu.matches(':popover-open')).toBeTrue();
      expect(focusedIndex(items)).toBe(3);
    });

    it('uses Left to open and Right to close in RTL', async () => {
      const {menu, items, submenu} = await setupTest(html`
        <md-gb-menu id="menu" dir="rtl">
          <md-gb-menu-item>
            Share
            <md-gb-menu slot="submenu" id="submenu">
              <md-gb-menu-item>Email</md-gb-menu-item>
            </md-gb-menu>
          </md-gb-menu-item>
        </md-gb-menu>
      `);
      await open(menu);
      items[0].focus();
      key(items[0], 'ArrowRight');
      expect(submenu!.matches(':popover-open')).toBeFalse();
      let done = toggled(submenu!);
      key(items[0], 'ArrowLeft');
      await done;
      jasmine.clock().tick(1);
      expect(submenu!.matches(':popover-open')).toBeTrue();
      done = toggled(submenu!);
      key(submenu!.items[0], 'ArrowRight');
      await done;
      expect(submenu!.matches(':popover-open')).toBeFalse();
    });

    it('makes the parent menu inactive while the submenu holds focus', async () => {
      const {menu, items, submenu} = await setupTest();
      await open(menu);
      items[3].focus();
      const done = toggled(submenu!);
      key(items[3], 'ArrowRight');
      await done;
      jasmine.clock().tick(1);
      await menu.updateComplete;
      const part = (m: MenuElement) => m.shadowRoot!.querySelector('.menu')!;
      expect(
        part(menu).classList.contains(MENU_CLASSES.menuInactive),
      ).toBeTrue();
      expect(
        part(submenu!).classList.contains(MENU_CLASSES.menuInactive),
      ).toBeFalse();
      items[0].focus();
      await menu.updateComplete;
      expect(
        part(menu).classList.contains(MENU_CLASSES.menuInactive),
      ).toBeFalse();
    });

    it('closes every menu when a submenu item is selected', async () => {
      const {menu, items, submenu} = await setupTest();
      await open(menu);
      let done = toggled(submenu!);
      items[3].click();
      await done;
      done = toggled(menu);
      submenu!.items[1].click();
      await done;
      expect(menu.matches(':popover-open')).toBeFalse();
      expect(submenu!.matches(':popover-open')).toBeFalse();
    });

    it('opens after the pointer rests on the item', async () => {
      const {menu, items, submenu} = await setupTest();
      await open(menu);
      items[3].dispatchEvent(
        new PointerEvent('pointerenter', {pointerType: 'mouse'}),
      );
      jasmine.clock().tick(SUBMENU_HOVER_DELAY_MS - 1);
      expect(submenu!.matches(':popover-open')).toBeFalse();
      jasmine.clock().tick(1);
      expect(submenu!.matches(':popover-open')).toBeTrue();
      items[3].dispatchEvent(
        new PointerEvent('pointerleave', {pointerType: 'mouse'}),
      );
      jasmine.clock().tick(SUBMENU_HOVER_DELAY_MS);
      expect(submenu!.matches(':popover-open')).toBeFalse();
    });
  });

  describe('groups', () => {
    it('renders a section label that names the group', async () => {
      const {root} = await setupTest(html`
        <md-gb-menu id="menu">
          <md-gb-menu-group label="Sort by">
            <md-gb-menu-item>Name</md-gb-menu-item>
          </md-gb-menu-group>
          <md-gb-menu-group>
            <md-gb-menu-item>Size</md-gb-menu-item>
          </md-gb-menu-group>
        </md-gb-menu>
      `);
      const [labelled, plain] = Array.from(
        root.querySelectorAll('md-gb-menu-group'),
      ) as MenuGroupElement[];
      const label = labelled.shadowRoot!.querySelector(
        `.${MENU_CLASSES.sectionLabel}`,
      );
      expect(label?.textContent?.trim()).toBe('Sort by');
      expect(labelled[internals].role).toBe('group');
      expect(labelled[internals].ariaLabel).toBe('Sort by');
      expect(plain[internals].role).toBe('none');
    });

    // spec: menus-84240e, menus-6c46c3, menus-0fc992, menus-a5c30b
    it('separates groups with gaps in the grouped layout', async () => {
      const {root, menu} = await setupTest(html`
        <md-gb-menu id="menu" layout="grouped">
          <md-gb-menu-group>
            <md-gb-menu-item>One</md-gb-menu-item>
          </md-gb-menu-group>
          <md-gb-menu-group>
            <md-gb-menu-item>Two</md-gb-menu-item>
          </md-gb-menu-group>
          <md-gb-menu-group>
            <md-gb-menu-item>Three</md-gb-menu-item>
          </md-gb-menu-group>
        </md-gb-menu>
      `);
      await open(menu);
      const container = menu.shadowRoot!.querySelector('.menu')!;
      expect(container.classList.contains(MENU_CLASSES.menuGrouped)).toBeTrue();
      // md.comp.menus.gap (2dp).
      expect(getComputedStyle(container).rowGap).toBe('2px');
      const surfaces = Array.from(
        root.querySelectorAll('md-gb-menu-group'),
      ).map((group) =>
        getComputedStyle(group.shadowRoot!.querySelector('.menu-group')!),
      );
      expect(surfaces[0].display).toBe('flex');
      // First group: container shape on top, group shape below.
      expect(surfaces[0].borderTopLeftRadius).toBe('16px');
      expect(surfaces[0].borderBottomLeftRadius).toBe('8px');
      expect(surfaces[1].borderTopLeftRadius).toBe('8px');
      expect(surfaces[2].borderBottomLeftRadius).toBe('16px');
      expect(surfaces[0].backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    });

    it('keeps groups transparent in the standard layout', async () => {
      const {root} = await setupTest(html`
        <md-gb-menu id="menu">
          <md-gb-menu-group
            ><md-gb-menu-item>One</md-gb-menu-item></md-gb-menu-group
          >
        </md-gb-menu>
      `);
      const group = root.querySelector('md-gb-menu-group')!;
      expect(
        getComputedStyle(group.shadowRoot!.querySelector('.menu-group')!)
          .display,
      ).toBe('contents');
    });

    it('marks a group inactive once the pointer leaves it', async () => {
      const {root} = await setupTest(html`
        <md-gb-menu id="menu" layout="grouped">
          <md-gb-menu-group
            ><md-gb-menu-item>One</md-gb-menu-item></md-gb-menu-group
          >
        </md-gb-menu>
      `);
      const group = root.querySelector('md-gb-menu-group') as MenuGroupElement;
      const part = group.shadowRoot!.querySelector('.menu-group')!;
      group.dispatchEvent(new PointerEvent('pointerenter'));
      await group.updateComplete;
      expect(part.classList.contains(MENU_CLASSES.groupInactive)).toBeFalse();
      group.dispatchEvent(new PointerEvent('pointerleave'));
      await group.updateComplete;
      expect(part.classList.contains(MENU_CLASSES.groupInactive)).toBeTrue();
    });

    it('makes items of a single-select group exclusive', async () => {
      const {root} = await setupTest(html`
        <md-gb-menu id="menu">
          <md-gb-menu-group checkable="single">
            <md-gb-menu-item checked>One</md-gb-menu-item>
            <md-gb-menu-item>Two</md-gb-menu-item>
          </md-gb-menu-group>
        </md-gb-menu>
      `);
      const [one, two] = Array.from(
        root.querySelectorAll('md-gb-menu-item'),
      ) as MenuItemElement[];
      await one.updateComplete;
      expect(one[internals].role).toBe('menuitemradio');
      two.click();
      expect(two.checked).toBeTrue();
      expect(one.checked).toBeFalse();
    });
  });

  describe('context menus', () => {
    async function setupContext() {
      const result = await setupTest(html`
        <div id="target" style="inline-size: 200px; block-size: 100px">
          Target
        </div>
        <md-gb-menu id="menu" context-for="target">
          <md-gb-menu-item>Open</md-gb-menu-item>
          <md-gb-menu-item>Delete</md-gb-menu-item>
        </md-gb-menu>
      `);
      const target = result.root.querySelector('#target') as HTMLElement;
      return {...result, target};
    }

    // spec: menus-2a9e9f, menus-c96306, menus-e642e4
    it('opens at the pointer on a secondary click', async () => {
      const {menu, target} = await setupContext();
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 40,
        clientY: 30,
      });
      target.dispatchEvent(event);
      expect(event.defaultPrevented).toBeTrue();
      expect(menu.matches(':popover-open')).toBeTrue();
      const rect = menu.getBoundingClientRect();
      expect(Math.round(rect.left)).toBe(40);
      expect(Math.round(rect.top)).toBe(30);
    });

    it('opens after a long press with touch', async () => {
      const {menu, target} = await setupContext();
      target.dispatchEvent(
        new PointerEvent('pointerdown', {
          pointerType: 'touch',
          clientX: 20,
          clientY: 20,
        }),
      );
      jasmine.clock().tick(LONG_PRESS_MS - 1);
      expect(menu.matches(':popover-open')).toBeFalse();
      jasmine.clock().tick(1);
      expect(menu.matches(':popover-open')).toBeTrue();
    });

    it('does not open when the touch moves or lifts early', async () => {
      const {menu, target} = await setupContext();
      target.dispatchEvent(
        new PointerEvent('pointerdown', {
          pointerType: 'touch',
          clientX: 20,
          clientY: 20,
        }),
      );
      target.dispatchEvent(
        new PointerEvent('pointermove', {
          pointerType: 'touch',
          clientX: 60,
          clientY: 20,
        }),
      );
      jasmine.clock().tick(LONG_PRESS_MS);
      expect(menu.matches(':popover-open')).toBeFalse();
      target.dispatchEvent(
        new PointerEvent('pointerdown', {
          pointerType: 'touch',
          clientX: 20,
          clientY: 20,
        }),
      );
      target.dispatchEvent(
        new PointerEvent('pointerup', {pointerType: 'touch'}),
      );
      jasmine.clock().tick(LONG_PRESS_MS);
      expect(menu.matches(':popover-open')).toBeFalse();
    });

    it('opens toward the inline start in RTL', async () => {
      const {menu, target} = await setupContext();
      menu.dir = 'rtl';
      target.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 400,
          clientY: 30,
        }),
      );
      const rect = menu.getBoundingClientRect();
      expect(Math.round(rect.right)).toBe(400);
    });
  });
});

describe('menuClasses()', () => {
  it('adds the layout and color classes', () => {
    expect(menuClasses({color: 'vibrant', layout: 'grouped'})).toEqual(
      jasmine.objectContaining({
        [MENU_CLASSES.menu]: true,
        [MENU_CLASSES.menuVibrant]: true,
        [MENU_CLASSES.menuGrouped]: true,
      }),
    );
  });

  it('adds the density classes', () => {
    expect(menuClasses({density: -2})[MENU_CLASSES.density2]).toBeTrue();
    expect(menuClasses({})[MENU_CLASSES.density1]).toBeFalse();
  });
});
