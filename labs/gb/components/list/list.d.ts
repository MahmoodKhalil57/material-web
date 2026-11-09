/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** List classes. */
export declare const LIST_CLASSES: {
    readonly list: "list";
    readonly listSegmented: "list-segmented";
    readonly listReorderable: "list-reorderable";
    readonly listDropZone: "list-drop-zone";
    readonly listLiveRegion: "list-live-region";
    readonly listDensity1: "list-density-1";
    readonly listDensity2: "list-density-2";
    readonly listDensity3: "list-density-3";
};
/** A list density, 0 (default) to -3. */
export type ListDensity = 0 | -1 | -2 | -3;
/** The lowest supported list density. */
export declare const LIST_MIN_DENSITY = -3;
/**
 * Clamps a density to the supported 0..-3 range (integers), like
 * `md-gb-segmented-button-set`.
 *
 * @param density The requested density.
 * @return The supported density.
 */
export declare function clampListDensity(density: number): ListDensity;
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
export declare function listClasses({ segmented, reorderable, density, }?: ListClassesState): ClassInfo;
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
export declare const list: (state?: ListClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/** List item classes. */
export declare const LIST_ITEM_CLASSES: {
    readonly listItem: "list-item";
    readonly listItemStatic: "list-item-static";
    readonly listItemContent: "list-item-content";
    readonly listItemLeading: "list-item-leading";
    readonly listItemTrailing: "list-item-trailing";
    readonly listItemOverline: "list-item-overline";
    readonly listItemSupportingText: "list-item-supporting-text";
    readonly listItemTrailingText: "list-item-trailing-text";
    readonly listItemAvatar: "list-item-avatar";
    readonly listItemExpandable: "list-item-expandable";
    readonly listItemExpanded: "list-item-expanded";
    readonly listItemExpandIcon: "list-item-expand-icon";
    readonly listItemExpandRegion: "list-item-expand-region";
    readonly listItemExpandContent: "list-item-expand-content";
    readonly listItemReorderable: "list-item-reorderable";
    readonly listItemDragged: "list-item-dragged";
    readonly listItemDragHandle: "list-item-drag-handle";
    readonly listItemGrabbed: "list-item-grabbed";
    readonly listItemMoveButton: "list-item-move-button";
    readonly listItemMoveUp: "list-item-move-up";
    readonly listItemMoveDown: "list-item-move-down";
    readonly listItemHasRevealButton: "list-item-has-reveal-button";
    readonly listItemRevealButton: "list-item-reveal-button";
    readonly listItemSwiped: "list-item-swiped";
    readonly listItemSwiping: "list-item-swiping";
    readonly listItemActions: "list-item-actions";
    readonly listItemActionsLeading: "list-item-actions-leading";
    readonly listItemActionsTrailing: "list-item-actions-trailing";
    readonly checked: string;
    readonly hover: string;
    readonly focus: string;
    readonly active: string;
    readonly disabled: string;
};
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
export declare function listItemClasses({ static: staticItem, checked, hover, focus, active, disabled, expandable, expanded, reorderable, dragged, grabbed, revealButton, swiped, swiping, }?: ListItemClassesState): ClassInfo;
/**
 * Sets up list item functionality for the given element.
 *
 * @param listItem The element on which to set up list item functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupListItem(listItem: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
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
export declare const listItem: (state?: ListItemClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/**
 * Returns the classes for a list item's drag handle, a sibling of the
 * `.list-item` (after it) that grabs the item for reordering.
 *
 * @return An object of class names and truthy values if they apply.
 */
export declare function listItemDragHandleClasses(): ClassInfo;
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
export declare const listItemDragHandle: (state?: import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/**
 * Returns the classes for a list item's move up / move down button: the
 * single-pointer alternative to dragging a grabbed item (WCAG 2.5.7). Like the
 * drag handle, it is a sibling of the `.list-item`.
 *
 * @param state Which way the button moves the item (`direction`).
 * @return An object of class names and truthy values if they apply.
 */
export declare function listItemMoveButtonClasses({ direction, }?: {
    direction?: 'up' | 'down';
}): ClassInfo;
/**
 * A Lit directive that adds list item move button styling and ripples to its
 * element.
 */
export declare const listItemMoveButton: (state?: {
    direction?: "up" | "down";
} & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/**
 * Returns the classes for a list item's "more" button, which reveals its swipe
 * actions with a tap (spec Lists > Accessibility > Swipe: "List items that
 * can be swiped should include alternative ways to access hidden actions,
 * such as a more icon"). A sibling of the `.list-item`.
 *
 * @return An object of class names and truthy values if they apply.
 */
export declare function listItemRevealButtonClasses(): ClassInfo;
/**
 * A Lit directive that adds list item reveal button styling and ripples to
 * its element.
 */
export declare const listItemRevealButton: (state?: import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
