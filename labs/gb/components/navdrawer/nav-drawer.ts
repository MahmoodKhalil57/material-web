/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {FOCUS_RING_CLASSES} from '../focus/focus-ring.js';
import {RIPPLE_CLASSES, setupRipple} from '../ripple/ripple.js';
import {createClassMapDirective} from '../shared/directives.js';
import {nextFocusIndex} from '../shared/roving-focus.js';

/** Reasons a navigation drawer closes, given in `close`/`closed` events. */
export const NAV_DRAWER_CLOSE_REASONS = {
  /** `close()` was called or `open` was set to false. */
  method: 'method',
  /** The scrim of a modal drawer was clicked. */
  scrim: 'scrim',
  /** Escape was pressed in a modal drawer. */
  escape: 'escape',
  /** An item of a modal drawer was selected. */
  item: 'item',
  /** A modal drawer was swiped (dragged or flung) toward its edge. */
  swipe: 'swipe',
} as const;

/** Navigation drawer close reason type. */
export type NavDrawerCloseReason =
  | (typeof NAV_DRAWER_CLOSE_REASONS)[keyof typeof NAV_DRAWER_CLOSE_REASONS]
  | string;

/** Navigation drawer classes constants. */
export const NAV_DRAWER_CLASSES = {
  navDrawer: 'nav-drawer',
  navDrawerModal: 'nav-drawer-modal',
  navDrawerOpen: 'nav-drawer-open',
  /** A modal drawer sheet that follows the pointer (no transitions). */
  navDrawerDragging: 'nav-drawer-dragging',
  /** A modal drawer sheet settling closed after a swipe. */
  navDrawerSwipeSettle: 'nav-drawer-swipe-settle',
  navDrawerDialog: 'nav-drawer-dialog',
  navDrawerDialogOpen: 'nav-drawer-dialog-open',
  navDrawerScrim: 'nav-drawer-scrim',
  navDrawerNav: 'nav-drawer-nav',
  navDrawerHeadline: 'nav-drawer-headline',
  navDrawerSectionLabel: 'nav-drawer-section-label',
  navDrawerDivider: 'nav-drawer-divider',
} as const;

/** The state provided to the `navDrawerClasses()` function. */
export interface NavDrawerClassesState {
  /** Whether the drawer is modal (over a scrim). */
  modal?: boolean;
  /** Whether the drawer is open (on screen). */
  open?: boolean;
}

/**
 * Returns navigation drawer sheet classes to apply based on the given state.
 *
 * @param state The state of the navigation drawer.
 * @return An object of class names and truthy values if they apply.
 */
export function navDrawerClasses({
  modal = false,
  open = false,
}: NavDrawerClassesState = {}): ClassInfo {
  return {
    [NAV_DRAWER_CLASSES.navDrawer]: true,
    [NAV_DRAWER_CLASSES.navDrawerModal]: Boolean(modal),
    [NAV_DRAWER_CLASSES.navDrawerOpen]: Boolean(open),
  };
}

/**
 * Returns the classes of a modal navigation drawer's `<dialog>`.
 *
 * @param state The state of the navigation drawer.
 * @return An object of class names and truthy values if they apply.
 */
export function navDrawerDialogClasses({
  open = false,
}: Pick<NavDrawerClassesState, 'open'> = {}): ClassInfo {
  return {
    [NAV_DRAWER_CLASSES.navDrawerDialog]: true,
    [NAV_DRAWER_CLASSES.navDrawerDialogOpen]: Boolean(open),
  };
}

/**
 * Compose `NavigationDrawer.kt` `DrawerPositionalThreshold`: a released drag
 * closes the drawer once dragged past this fraction of its width.
 */
export const NAV_DRAWER_POSITIONAL_THRESHOLD = 0.5;

/**
 * Compose `NavigationDrawer.kt` `DrawerVelocityThreshold` (400dp/s): a faster
 * fling toward the edge closes the drawer however far it was dragged.
 */
export const NAV_DRAWER_VELOCITY_THRESHOLD_PX_PER_S = 400;

/** Selector for the enabled, focusable items of a Light DOM drawer. */
const LIGHT_DOM_ITEM_SELECTOR =
  '.nav-drawer-item:not(:disabled, [aria-disabled="true"])';

/**
 * Returns the item to move focus to for a navigation key, or `null` if the key
 * does not move focus. Arrow keys wrap around.
 *
 * @param items The enabled items, in order.
 * @param current The currently focused item.
 * @param key The `KeyboardEvent.key` pressed.
 * @return The next item to focus, or `null`.
 */
export function getNextNavDrawerItem<T>(
  items: readonly T[],
  current: T | null,
  key: string,
): T | null {
  const index = current === null ? -1 : items.indexOf(current);
  const next = nextFocusIndex(items.length, index, key, {orientation: 'vertical'});
  return next < 0 ? null : items[next];
}

/**
 * Sets up roving keyboard focus (arrow keys, Home and End) on a Light DOM
 * navigation drawer. Only the active item (or the first item) is in the tab
 * order.
 *
 * @param drawer The `.nav-drawer` element.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupNavDrawer(
  drawer: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  const getItems = () =>
    Array.from(drawer.querySelectorAll<HTMLElement>(LIGHT_DOM_ITEM_SELECTOR));

  const syncTabStops = (focused?: HTMLElement) => {
    const items = getItems();
    const stop =
      focused ??
      items.find((item) =>
        item.matches(
          '.nav-drawer-item-active, [aria-current]:not([aria-current="false"])',
        ),
      ) ??
      items[0];
    for (const item of items) {
      item.tabIndex = item === stop ? 0 : -1;
    }
  };

  drawer.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      const items = getItems();
      const current = items.find((item) => item.contains(event.target as Node));
      if (!current) {
        return;
      }
      const next = getNextNavDrawerItem(items, current, event.key);
      if (!next) {
        return;
      }
      event.preventDefault();
      syncTabStops(next);
      next.focus();
    },
    opts,
  );

  drawer.addEventListener(
    'focusin',
    (event: FocusEvent) => {
      const current = getItems().find((item) =>
        item.contains(event.target as Node),
      );
      if (current) {
        syncTabStops(current);
      }
    },
    opts,
  );

  syncTabStops();
}

/**
 * Lit directive for navigation drawer sheet class styling and roving focus.
 *
 * @example
 * ```ts
 * html`<nav class="${navDrawer({open: true})}" aria-label="Mail">
 *   <h2 class="nav-drawer-headline">Mail</h2>
 *   <a class="${navDrawerItem({active: true})}" href="/inbox"
 *       aria-current="page">
 *     <span class="nav-drawer-item-icon md-icon">inbox</span>
 *     <span class="nav-drawer-item-label">Inbox</span>
 *     <span class="nav-drawer-item-badge">24</span>
 *   </a>
 * </nav>`;
 * ```
 */
export const navDrawer = createClassMapDirective<NavDrawerClassesState>({
  getClasses: navDrawerClasses,
  setupElement: setupNavDrawer,
});

/** Navigation drawer item classes constants. */
export const NAV_DRAWER_ITEM_CLASSES = {
  navDrawerItem: 'nav-drawer-item',
  navDrawerItemActive: 'nav-drawer-item-active',
  navDrawerItemIcon: 'nav-drawer-item-icon',
  navDrawerItemLabel: 'nav-drawer-item-label',
  navDrawerItemBadge: 'nav-drawer-item-badge',
} as const;

/** The state provided to the `navDrawerItemClasses()` function. */
export interface NavDrawerItemClassesState {
  /** Whether the item is the active (selected) destination. */
  active?: boolean;
  /** Whether the item is disabled. */
  disabled?: boolean;
}

/**
 * Returns navigation drawer item classes to apply based on the given state.
 *
 * @param state The state of the navigation drawer item.
 * @return An object of class names and truthy values if they apply.
 */
export function navDrawerItemClasses({
  active = false,
  disabled = false,
}: NavDrawerItemClassesState = {}): ClassInfo {
  return {
    [RIPPLE_CLASSES.ripple]: true,
    [RIPPLE_CLASSES.disabled]: Boolean(disabled),
    [FOCUS_RING_CLASSES.focusRingInner]: true,
    [NAV_DRAWER_ITEM_CLASSES.navDrawerItem]: true,
    [NAV_DRAWER_ITEM_CLASSES.navDrawerItemActive]: Boolean(active),
  };
}

/**
 * Sets up navigation drawer item functionality (the ripple) for the given
 * element.
 *
 * @param item The element on which to set up navigation drawer item behavior.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupNavDrawerItem(
  item: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupRipple(item, opts);
}

/**
 * Lit directive for navigation drawer item element class styling.
 */
export const navDrawerItem = createClassMapDirective<NavDrawerItemClassesState>(
  {
    getClasses: navDrawerItemClasses,
    setupElement: setupNavDrawerItem,
  },
);
