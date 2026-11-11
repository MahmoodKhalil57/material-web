/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {FOCUS_RING_CLASSES} from '../../foundations/interaction/states/focus/focus-ring.js';
import {RIPPLE_CLASSES, setupRipple} from '../../foundations/interaction/states/ripple/ripple.js';
import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES} from '../../foundations/interaction/states/pseudo-classes.js';

/** List classes. */
export const LIST_CLASSES = {
  list: 'list',
  listSegmented: 'list-segmented',
  listReorderable: 'list-reorderable',
  listDropZone: 'list-drop-zone',
  listLiveRegion: 'list-live-region',
  listDensity1: 'list-density-1',
  listDensity2: 'list-density-2',
  listDensity3: 'list-density-3',
} as const;

/** A list density, 0 (default) to -3. */
export type ListDensity = 0 | -1 | -2 | -3;

/** The lowest supported list density. */
export const LIST_MIN_DENSITY = -3;

/**
 * Clamps a density to the supported 0..-3 range (integers), like
 * `md-gb-segmented-button-set`.
 *
 * @param density The requested density.
 * @return The supported density.
 */
export function clampListDensity(density: number): ListDensity {
  if (!Number.isFinite(density)) return 0;
  return Math.max(
    LIST_MIN_DENSITY,
    Math.min(0, Math.round(density)),
  ) as ListDensity;
}

/** The state provided to the `listClasses()` function. */
export interface ListClassesState {
  /** Whether to render the list with segmented items. */
  segmented?: boolean;
  /** Whether the list's items can be reordered by dragging. */
  reorderable?: boolean;
  /**
   * The density, 0 (default) to -3. Each step down removes 4px from the
   * item height and 2px from its top and bottom padding.
   */
  density?: number;
}

/**
 * Returns the list classes to apply to an element based on the given state.
 *
 * @param state The state of the list.
 * @return An object of class names and truthy values if they apply.
 */
export function listClasses({
  segmented = false,
  reorderable = false,
  density = 0,
}: ListClassesState = {}): ClassInfo {
  const d = clampListDensity(density);
  return {
    [LIST_CLASSES.list]: true,
    [LIST_CLASSES.listSegmented]: segmented,
    [LIST_CLASSES.listReorderable]: reorderable,
    [LIST_CLASSES.listDensity1]: d === -1,
    [LIST_CLASSES.listDensity2]: d === -2,
    [LIST_CLASSES.listDensity3]: d === -3,
  };
}

/**
 * A Lit directive that adds list styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`
 *   <ul class="${list()}">
 *     <li><button class="${listItem()}">List item 1</button></li>
 *     <li><button class="${listItem()}">List item 2</button></li>
 *     <li><button class="${listItem()}">List item 3</button></li>
 *   </ul>
 * `;
 * ```
 */
export const list = createClassMapDirective({
  getClasses: listClasses,
});

/** List item classes. */
export const LIST_ITEM_CLASSES = {
  listItem: 'list-item',
  listItemStatic: 'list-item-static',
  listItemContent: 'list-item-content',
  listItemLeading: 'list-item-leading',
  listItemTrailing: 'list-item-trailing',
  listItemOverline: 'list-item-overline',
  listItemSupportingText: 'list-item-supporting-text',
  listItemTrailingText: 'list-item-trailing-text',
  listItemAvatar: 'list-item-avatar',
  // M3 Expressive list interactions.
  listItemExpandable: 'list-item-expandable',
  listItemExpanded: 'list-item-expanded',
  listItemExpandIcon: 'list-item-expand-icon',
  listItemExpandRegion: 'list-item-expand-region',
  listItemExpandContent: 'list-item-expand-content',
  listItemReorderable: 'list-item-reorderable',
  listItemDragged: 'list-item-dragged',
  listItemDragHandle: 'list-item-drag-handle',
  // Single-pointer alternatives to dragging (WCAG 2.5.7).
  listItemGrabbed: 'list-item-grabbed',
  listItemMoveButton: 'list-item-move-button',
  listItemMoveUp: 'list-item-move-up',
  listItemMoveDown: 'list-item-move-down',
  listItemHasRevealButton: 'list-item-has-reveal-button',
  listItemRevealButton: 'list-item-reveal-button',
  listItemSwiped: 'list-item-swiped',
  listItemSwiping: 'list-item-swiping',
  listItemActions: 'list-item-actions',
  listItemActionsLeading: 'list-item-actions-leading',
  listItemActionsTrailing: 'list-item-actions-trailing',
  checked: PSEUDO_CLASSES.checked,
  hover: PSEUDO_CLASSES.hover,
  focus: PSEUDO_CLASSES.focus,
  active: PSEUDO_CLASSES.active,
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** The state provided to the `listItemClasses()` function. */
export interface ListItemClassesState {
  /** Whether the list item is non-interactive. */
  static?: boolean;
  /** Emulates `:checked`. */
  checked?: boolean;
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:focus`. */
  focus?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
  /** Whether the item expands to reveal nested content. */
  expandable?: boolean;
  /** Whether an expandable item is expanded. */
  expanded?: boolean;
  /** Whether the item has a drag handle to reorder it. */
  reorderable?: boolean;
  /** Whether the item is being dragged (reordered). */
  dragged?: boolean;
  /**
   * Whether the item is grabbed without dragging (keyboard or a tap on the
   * drag handle) and shows its move up / move down buttons.
   */
  grabbed?: boolean;
  /** Whether the item shows a button that reveals its swipe actions. */
  revealButton?: boolean;
  /** Whether the item is swiped away from its resting position. */
  swiped?: boolean;
  /** Whether the item is following a swipe gesture (no settle motion). */
  swiping?: boolean;
}

/**
 * Returns the list item classes to apply to an element based on the given
 * state.
 *
 * @param state The state of the list item.
 * @return An object of class names and truthy values if they apply.
 */
export function listItemClasses({
  static: staticItem = false,
  checked = false,
  hover = false,
  focus = false,
  active = false,
  disabled = false,
  expandable = false,
  expanded = false,
  reorderable = false,
  dragged = false,
  grabbed = false,
  revealButton = false,
  swiped = false,
  swiping = false,
}: ListItemClassesState = {}): ClassInfo {
  return {
    [RIPPLE_CLASSES.ripple]: !staticItem,
    [FOCUS_RING_CLASSES.focusRingInner]: !staticItem,
    [LIST_ITEM_CLASSES.listItem]: true,
    [LIST_ITEM_CLASSES.listItemStatic]: staticItem,
    [LIST_ITEM_CLASSES.checked]: checked,
    [LIST_ITEM_CLASSES.hover]: hover,
    [LIST_ITEM_CLASSES.focus]: focus,
    [LIST_ITEM_CLASSES.active]: active,
    [LIST_ITEM_CLASSES.disabled]: disabled,
    [LIST_ITEM_CLASSES.listItemExpandable]: expandable,
    [LIST_ITEM_CLASSES.listItemExpanded]: expandable && expanded,
    [LIST_ITEM_CLASSES.listItemReorderable]: reorderable,
    [LIST_ITEM_CLASSES.listItemDragged]: dragged,
    [LIST_ITEM_CLASSES.listItemGrabbed]: grabbed,
    [LIST_ITEM_CLASSES.listItemHasRevealButton]: revealButton,
    [LIST_ITEM_CLASSES.listItemSwiped]: swiped || swiping,
    [LIST_ITEM_CLASSES.listItemSwiping]: swiping,
  };
}

/**
 * Sets up list item functionality for the given element.
 *
 * @param listItem The element on which to set up list item functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupListItem(
  listItem: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupRipple(listItem, opts);
}

/**
 * A Lit directive that adds list item styling and functionality to its element.
 *
 *
 * @example
 * ```ts
 * html`
 *   <ul class="${list()}">
 *     <li><button class="${listItem()}">List item 1</button></li>
 *     <li><button class="${listItem()}">List item 2</button></li>
 *     <li><button class="${listItem()}">List item 3</button></li>
 *   </ul>
 * `;
 * ```
 */
export const listItem = createClassMapDirective({
  getClasses: listItemClasses,
  setupElement: setupListItem,
});

/**
 * Returns the classes for a list item's drag handle, a sibling of the
 * `.list-item` (after it) that grabs the item for reordering.
 *
 * @return An object of class names and truthy values if they apply.
 */
export function listItemDragHandleClasses(): ClassInfo {
  return {
    [RIPPLE_CLASSES.ripple]: true,
    [FOCUS_RING_CLASSES.focusRingOuter]: true,
    [LIST_ITEM_CLASSES.listItemDragHandle]: true,
  };
}

/**
 * A Lit directive that adds list item drag handle styling and ripples to its
 * element.
 *
 * @example
 * ```ts
 * html`
 *   <li>
 *     <div class="${listItem({static: true, reorderable: true})}">Item</div>
 *     <button class="${listItemDragHandle()}" aria-label="Reorder Item">
 *     </button>
 *   </li>
 * `;
 * ```
 */
export const listItemDragHandle = createClassMapDirective({
  getClasses: listItemDragHandleClasses,
  setupElement: setupRipple,
});

/**
 * Returns the classes for a list item's move up / move down button: the
 * single-pointer alternative to dragging a grabbed item (WCAG 2.5.7). Like the
 * drag handle, it is a sibling of the `.list-item`.
 *
 * @param state Which way the button moves the item (`direction`).
 * @return An object of class names and truthy values if they apply.
 */
export function listItemMoveButtonClasses({
  direction = 'down',
}: {direction?: 'up' | 'down'} = {}): ClassInfo {
  return {
    [RIPPLE_CLASSES.ripple]: true,
    [FOCUS_RING_CLASSES.focusRingOuter]: true,
    [LIST_ITEM_CLASSES.listItemMoveButton]: true,
    [LIST_ITEM_CLASSES.listItemMoveUp]: direction === 'up',
    [LIST_ITEM_CLASSES.listItemMoveDown]: direction === 'down',
  };
}

/**
 * A Lit directive that adds list item move button styling and ripples to its
 * element.
 */
export const listItemMoveButton = createClassMapDirective({
  getClasses: listItemMoveButtonClasses,
  setupElement: setupRipple,
});

/**
 * Returns the classes for a list item's "more" button, which reveals its swipe
 * actions with a tap (spec Lists > Accessibility > Swipe: "List items that
 * can be swiped should include alternative ways to access hidden actions,
 * such as a more icon"). A sibling of the `.list-item`.
 *
 * @return An object of class names and truthy values if they apply.
 */
export function listItemRevealButtonClasses(): ClassInfo {
  return {
    [RIPPLE_CLASSES.ripple]: true,
    [FOCUS_RING_CLASSES.focusRingOuter]: true,
    [LIST_ITEM_CLASSES.listItemRevealButton]: true,
  };
}

/**
 * A Lit directive that adds list item reveal button styling and ripples to
 * its element.
 */
export const listItemRevealButton = createClassMapDirective({
  getClasses: listItemRevealButtonClasses,
  setupElement: setupRipple,
});
