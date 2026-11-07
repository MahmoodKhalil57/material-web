/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {fabClasses, type FabSize} from '../fab/fab.js';
import {focusRingClasses} from '../focus/focus-ring.js';
import {rippleClasses, setupRipple} from '../ripple/ripple.js';
import {applyDisclosure, requestToggle} from '../shared/disclosure.js';
import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES} from '../shared/pseudo-classes.js';
import {nextFocusIndex} from '../shared/roving-focus.js';

/**
 * FAB menu color configuration types. The FAB uses the `<color>-container`
 * FAB colors, the close button `<color>` and the items `<color>-container`.
 */
export type FabMenuColor = 'primary' | 'secondary' | 'tertiary';

/** FAB menu item alignment configuration types. */
export type FabMenuAlign = 'end' | 'start';

/** FAB menu color configurations. */
export const FAB_MENU_COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
} as const;

/** FAB menu item alignment configurations. */
export const FAB_MENU_ALIGNS = {
  end: 'end',
  start: 'start',
} as const;

/** FAB menu classes. */
export const FAB_MENU_CLASSES = {
  fabMenu: 'fab-menu',
  fabMenuPrimary: 'fab-menu-primary',
  fabMenuSecondary: 'fab-menu-secondary',
  fabMenuTertiary: 'fab-menu-tertiary',
  fabMenuOpen: 'fab-menu-open',
  fabMenuStart: 'fab-menu-start',
  fabMenuList: 'fab-menu-list',
  fabMenuButton: 'fab-menu-button',
  fabMenuButtonIcon: 'fab-menu-button-icon',
  fabMenuButtonCloseIcon: 'fab-menu-button-close-icon',
  fabMenuIconFont: 'fab-menu-icon-font',
  fabMenuItem: 'fab-menu-item',
  hover: PSEUDO_CLASSES.hover,
  focusVisible: PSEUDO_CLASSES.focusVisible,
  active: PSEUDO_CLASSES.active,
} as const;

/** The state provided to the `fabMenuClasses()` function. */
export interface FabMenuClassesState {
  /** The color of the FAB menu. Defaults to primary. */
  color?: FabMenuColor;
  /** Whether the menu is open. */
  open?: boolean;
  /** The alignment of the items. Defaults to end, as the FAB. */
  align?: FabMenuAlign;
}

/**
 * Returns the FAB menu classes to apply to the menu's root element based on
 * the given state.
 *
 * @param state The state of the FAB menu.
 * @return An object of class names and truthy values if they apply.
 */
export function fabMenuClasses({
  color = FAB_MENU_COLORS.primary,
  open = false,
  align = FAB_MENU_ALIGNS.end,
}: FabMenuClassesState = {}): ClassInfo {
  return {
    [FAB_MENU_CLASSES.fabMenu]: true,
    [FAB_MENU_CLASSES.fabMenuPrimary]:
      color === FAB_MENU_COLORS.primary || !color,
    [FAB_MENU_CLASSES.fabMenuSecondary]: color === FAB_MENU_COLORS.secondary,
    [FAB_MENU_CLASSES.fabMenuTertiary]: color === FAB_MENU_COLORS.tertiary,
    [FAB_MENU_CLASSES.fabMenuOpen]: open,
    [FAB_MENU_CLASSES.fabMenuStart]: align === FAB_MENU_ALIGNS.start,
  };
}

/** The state provided to the `fabMenuButtonClasses()` function. */
export interface FabMenuButtonClassesState {
  /** The color of the FAB menu. Defaults to primary. */
  color?: FabMenuColor;
  /** The size of the FAB. The close button is always the same size. */
  size?: FabSize;
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
}

/**
 * Returns the classes of the FAB that toggles a FAB menu: a FAB of the
 * menu's container color that morphs into the close button.
 *
 * @param state The state of the FAB.
 * @return An object of class names and truthy values if they apply.
 */
export function fabMenuButtonClasses({
  color = FAB_MENU_COLORS.primary,
  size,
  hover = false,
  active = false,
}: FabMenuButtonClassesState = {}): ClassInfo {
  return {
    ...fabClasses({color: `${color || 'primary'}-container`, size, hover, active}),
    [FAB_MENU_CLASSES.fabMenuButton]: true,
  };
}

/** The state provided to the `fabMenuItemClasses()` function. */
export interface FabMenuItemClassesState {
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:focus-visible`. */
  focusVisible?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
}

/**
 * Returns the FAB menu item classes to apply to an element based on the
 * given state.
 *
 * @param state The state of the item.
 * @return An object of class names and truthy values if they apply.
 */
export function fabMenuItemClasses({
  hover = false,
  focusVisible = false,
  active = false,
}: FabMenuItemClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [FAB_MENU_CLASSES.fabMenuItem]: true,
    [FAB_MENU_CLASSES.hover]: hover,
    [FAB_MENU_CLASSES.focusVisible]: focusVisible,
    [FAB_MENU_CLASSES.active]: active,
  };
}

/** Detail of the `activate` event, fired when a menu item is activated. */
export interface FabMenuActivateDetail {
  /** The activated item. */
  item: HTMLElement;
}

/** Options for `setupFabMenu()`. */
export interface SetupFabMenuOptions {
  /** Removes the menu's listeners when aborted. */
  signal?: AbortSignal;
  /**
   * Returns the menu's items. Defaults to the `.fab-menu-item` (or
   * `[role="menuitem"]`) children of the `.fab-menu-list`.
   */
  getItems?: () => HTMLElement[];
}

/** Where to move focus when opening or closing a FAB menu. */
export type FabMenuFocus = 'button' | 'first-item' | 'last-item';

const menuItems = new WeakMap<HTMLElement, () => HTMLElement[]>();

function buttonOf(menu: HTMLElement) {
  return menu.querySelector<HTMLElement>(`.${FAB_MENU_CLASSES.fabMenuButton}`);
}

function listOf(menu: HTMLElement) {
  return menu.querySelector<HTMLElement>(`.${FAB_MENU_CLASSES.fabMenuList}`);
}

function itemsOf(menu: HTMLElement): HTMLElement[] {
  const getItems = menuItems.get(menu);
  if (getItems) return getItems();
  const list = listOf(menu);
  if (!list) return [];
  return Array.from(list.children).filter((child): child is HTMLElement =>
    child.matches(`.${FAB_MENU_CLASSES.fabMenuItem}, [role="menuitem"]`),
  );
}

/**
 * Returns whether a FAB menu is open.
 *
 * @param menu The FAB menu's root element.
 * @return Whether the menu is open.
 */
export function isFabMenuOpen(menu: HTMLElement): boolean {
  return menu.classList.contains(FAB_MENU_CLASSES.fabMenuOpen);
}

/**
 * Opens or closes a FAB menu: toggles its open class, the FAB's
 * `aria-expanded` / `aria-controls` and the list's `inert` (the shared
 * disclosure), and optionally moves focus. When the state changes it first
 * fires a cancelable `toggle` event on the menu (a `ToggleEvent`, before the
 * change); cancelling it leaves the menu as it is.
 *
 * @param menu The FAB menu's root element.
 * @param open Whether the menu should be open.
 * @param focus Where to move focus afterwards, if anywhere.
 * @return Whether the menu is open afterwards.
 */
export function setFabMenuOpen(
  menu: HTMLElement,
  open: boolean,
  focus?: FabMenuFocus,
): boolean {
  const wasOpen = isFabMenuOpen(menu);
  if (wasOpen !== open && !requestToggle(menu, wasOpen)) return wasOpen;
  const button = buttonOf(menu);
  const list = listOf(menu);
  // Move focus out of the list before it becomes inert.
  if (focus === 'button') button?.focus();
  if (wasOpen !== open) {
    menu.classList.toggle(FAB_MENU_CLASSES.fabMenuOpen, open);
    applyDisclosure(open, {trigger: button, region: list});
  }
  if (focus === 'first-item') itemsOf(menu)[0]?.focus();
  if (focus === 'last-item') {
    const items = itemsOf(menu);
    items[items.length - 1]?.focus();
  }
  return open;
}

function isNativelyActivated(item: HTMLElement) {
  return item.matches('button, a[href], input, [contenteditable]');
}

/**
 * Sets up FAB menu functionality (WAI-ARIA menu button) for the given
 * element:
 *
 * - The FAB toggles the menu. Focus stays on it when the menu opens (M3).
 *   ArrowDown / ArrowUp open the menu and focus the first / last item, and
 *   Tab moves from the FAB to the top item, as in Compose.
 * - Arrow keys, Home and End move between items, Tab and Shift+Tab move
 *   through them in order, and Tab past the last item closes the menu.
 * - Escape closes the menu and returns focus to the FAB.
 * - Activating an item fires a cancelable `activate` event and closes the
 *   menu. So does pressing outside of the menu.
 * - ARIA: `aria-haspopup`, `aria-expanded` and `aria-controls` on the FAB,
 *   `role="menu"` on the list and `role="menuitem"` on items without a role.
 *
 * @param menu The FAB menu's root element.
 * @param opts Setup options, supports a cleanup `signal` and `getItems`.
 */
// spec: fab-menu-6fcfde, fab-menu-f9c15a, fab-menu-8ec7af, fab-menu-fc5c9b
export function setupFabMenu(
  menu: HTMLElement,
  opts: SetupFabMenuOptions = {},
): void {
  const {signal} = opts;
  if (opts.getItems) menuItems.set(menu, opts.getItems);
  const button = buttonOf(menu);
  const list = listOf(menu);
  const open = isFabMenuOpen(menu);
  if (list) {
    if (!list.id) list.id = `fab-menu-list-${++idCounter}`;
    if (!list.hasAttribute('role')) list.setAttribute('role', 'menu');
  }
  applyDisclosure(open, {trigger: button, region: list});
  if (button) {
    button.setAttribute('aria-haspopup', 'menu');
    if (list && button.id && !list.hasAttribute('aria-labelledby')) {
      list.setAttribute('aria-labelledby', button.id);
    }
  }
  for (const item of itemsOf(menu)) {
    if (!item.hasAttribute('role')) item.setAttribute('role', 'menuitem');
    if (!item.hasAttribute('tabindex')) item.tabIndex = -1;
  }

  const itemFor = (event: Event) => {
    const items = itemsOf(menu);
    return event
      .composedPath()
      .find((target): target is HTMLElement =>
        items.includes(target as HTMLElement),
      );
  };

  menu.addEventListener(
    'click',
    (event) => {
      if (button && event.composedPath().includes(button)) {
        setFabMenuOpen(menu, !isFabMenuOpen(menu));
        return;
      }
      const item = itemFor(event);
      if (!item || !isFabMenuOpen(menu)) return;
      const activate = new CustomEvent<FabMenuActivateDetail>('activate', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {item},
      });
      if (menu.dispatchEvent(activate)) {
        setFabMenuOpen(menu, false, 'button');
      }
    },
    {signal},
  );

  menu.addEventListener(
    'keydown',
    (event) => {
      if (event.defaultPrevented) return;
      const isOpen = isFabMenuOpen(menu);
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        event.stopPropagation();
        setFabMenuOpen(menu, false, 'button');
        return;
      }

      if (button && event.composedPath()[0] === button) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setFabMenuOpen(menu, true, 'first-item');
            break;
          case 'ArrowUp':
            event.preventDefault();
            setFabMenuOpen(menu, true, 'last-item');
            break;
          case 'Tab':
            if (isOpen && !event.shiftKey && itemsOf(menu).length) {
              event.preventDefault();
              itemsOf(menu)[0].focus();
            }
            break;
          default:
            break;
        }
        return;
      }

      const item = itemFor(event);
      if (!item) return;
      const items = itemsOf(menu);
      const index = items.indexOf(item);
      const focusItem = (i: number) => {
        event.preventDefault();
        items[(i + items.length) % items.length].focus();
      };
      // Up / Down (wrapping), Home / End: shared roving focus movement. Like
      // other menu items, disabled items stay focusable.
      // spec: fab-menu/accessibility/keyboard-navigation, fab-menu-8ab78c, fab-menu-dc26b8, fab-menu-e8a4e5
      if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        const next = nextFocusIndex(items.length, index, event.key, {orientation: 'vertical'});
        if (next >= 0) {
          focusItem(next);
          return;
        }
      }
      switch (event.key) {
        case 'Tab':
          if (event.shiftKey) {
            event.preventDefault();
            if (index === 0) button?.focus();
            else items[index - 1].focus();
          } else if (index < items.length - 1) {
            focusItem(index + 1);
          } else {
            // Close and let Tab continue from the FAB, out of the menu.
            setFabMenuOpen(menu, false, 'button');
          }
          break;
        case 'Enter':
        case ' ':
          if (!isNativelyActivated(item)) {
            event.preventDefault();
            item.click();
          }
          break;
        default:
          break;
      }
    },
    {signal},
  );

  // Close when pressing outside of the menu.
  document.addEventListener(
    'pointerdown',
    (event) => {
      if (isFabMenuOpen(menu) && !event.composedPath().includes(menu)) {
        setFabMenuOpen(menu, false);
      }
    },
    {signal},
  );
}

let idCounter = 0;

/**
 * A Lit directive that adds FAB menu styling and functionality to its
 * element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${fabMenu()}">
 *     <div class="fab-menu-list">
 *       <button class="${fabMenuItem()}">
 *         <md-gb-icon>edit</md-gb-icon>Edit
 *       </button>
 *       <button class="${fabMenuItem()}">
 *         <md-gb-icon>share</md-gb-icon>Share
 *       </button>
 *     </div>
 *     <button class="${fabMenuButton()}" aria-label="Item actions">
 *       <md-gb-icon class="fab-menu-button-icon">add</md-gb-icon>
 *       <md-gb-icon class="fab-menu-button-close-icon">close</md-gb-icon>
 *     </button>
 *   </div>
 * `;
 * ```
 */
export const fabMenu = createClassMapDirective({
  getClasses: fabMenuClasses,
  setupElement: (element, opts) => {
    // Items and the button render after the root; set up once they exist.
    queueMicrotask(() => {
      if (!opts.signal.aborted) setupFabMenu(element, opts);
    });
  },
});

/** A Lit directive that adds FAB menu toggle FAB styling and ripples. */
export const fabMenuButton = createClassMapDirective({
  getClasses: fabMenuButtonClasses,
  setupElement: setupRipple,
});

/** A Lit directive that adds FAB menu item styling and ripples. */
export const fabMenuItem = createClassMapDirective({
  getClasses: fabMenuItemClasses,
  setupElement: setupRipple,
});
