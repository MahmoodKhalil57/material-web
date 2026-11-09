/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Reasons a navigation drawer closes, given in `close`/`closed` events. */
export declare const NAV_DRAWER_CLOSE_REASONS: {
    /** `close()` was called or `open` was set to false. */
    readonly method: "method";
    /** The scrim of a modal drawer was clicked. */
    readonly scrim: "scrim";
    /** Escape was pressed in a modal drawer. */
    readonly escape: "escape";
    /** The Android back gesture or button closed a modal drawer. */
    readonly back: "back";
    /** An item of a modal drawer was selected. */
    readonly item: "item";
    /** A modal drawer was swiped (dragged or flung) toward its edge. */
    readonly swipe: "swipe";
};
/** Navigation drawer close reason type. */
export type NavDrawerCloseReason = (typeof NAV_DRAWER_CLOSE_REASONS)[keyof typeof NAV_DRAWER_CLOSE_REASONS] | string;
/** Navigation drawer classes constants. */
export declare const NAV_DRAWER_CLASSES: {
    readonly navDrawer: "nav-drawer";
    readonly navDrawerModal: "nav-drawer-modal";
    readonly navDrawerOpen: "nav-drawer-open";
    /** A modal drawer sheet that follows the pointer (no transitions). */
    readonly navDrawerDragging: "nav-drawer-dragging";
    /** A modal drawer sheet settling closed after a swipe. */
    readonly navDrawerSwipeSettle: "nav-drawer-swipe-settle";
    readonly navDrawerDialog: "nav-drawer-dialog";
    readonly navDrawerDialogOpen: "nav-drawer-dialog-open";
    readonly navDrawerScrim: "nav-drawer-scrim";
    readonly navDrawerNav: "nav-drawer-nav";
    readonly navDrawerHeadline: "nav-drawer-headline";
    readonly navDrawerSectionLabel: "nav-drawer-section-label";
    readonly navDrawerDivider: "nav-drawer-divider";
};
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
export declare function navDrawerClasses({ modal, open, }?: NavDrawerClassesState): ClassInfo;
/**
 * Returns the classes of a modal navigation drawer's `<dialog>`.
 *
 * @param state The state of the navigation drawer.
 * @return An object of class names and truthy values if they apply.
 */
export declare function navDrawerDialogClasses({ open, }?: Pick<NavDrawerClassesState, 'open'>): ClassInfo;
/**
 * Compose `NavigationDrawer.kt` `DrawerPositionalThreshold`: a released drag
 * closes the drawer once dragged past this fraction of its width.
 */
export declare const NAV_DRAWER_POSITIONAL_THRESHOLD = 0.5;
/**
 * Compose `NavigationDrawer.kt` `DrawerVelocityThreshold` (400dp/s): a faster
 * fling toward the edge closes the drawer however far it was dragged.
 */
export declare const NAV_DRAWER_VELOCITY_THRESHOLD_PX_PER_S = 400;
/**
 * Returns the item to move focus to for a navigation key, or `null` if the key
 * does not move focus. Arrow keys wrap around.
 *
 * @param items The enabled items, in order.
 * @param current The currently focused item.
 * @param key The `KeyboardEvent.key` pressed.
 * @return The next item to focus, or `null`.
 */
export declare function getNextNavDrawerItem<T>(items: readonly T[], current: T | null, key: string): T | null;
/**
 * Sets up roving keyboard focus (arrow keys, Home and End) on a Light DOM
 * navigation drawer. Only the active item (or the first item) is in the tab
 * order.
 *
 * @param drawer The `.nav-drawer` element.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupNavDrawer(drawer: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
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
export declare const navDrawer: (state?: NavDrawerClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/** Navigation drawer item classes constants. */
export declare const NAV_DRAWER_ITEM_CLASSES: {
    readonly navDrawerItem: "nav-drawer-item";
    readonly navDrawerItemActive: "nav-drawer-item-active";
    readonly navDrawerItemIcon: "nav-drawer-item-icon";
    readonly navDrawerItemLabel: "nav-drawer-item-label";
    readonly navDrawerItemBadge: "nav-drawer-item-badge";
};
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
export declare function navDrawerItemClasses({ active, disabled, }?: NavDrawerItemClassesState): ClassInfo;
/**
 * Sets up navigation drawer item functionality (the ripple) for the given
 * element.
 *
 * @param item The element on which to set up navigation drawer item behavior.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupNavDrawerItem(item: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * Lit directive for navigation drawer item element class styling.
 */
export declare const navDrawerItem: (state?: NavDrawerItemClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
