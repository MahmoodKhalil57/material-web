/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Navigation bar item layout configuration types. */
export type NavBarItemLayout = 'vertical' | 'horizontal';
/**
 * The navigation bar's item layout: a fixed layout, or `auto` for vertical
 * items in compact windows and horizontal items from medium windows
 * (navigation-bar.md: "In compact windows, navigation bars use vertical
 * items. In medium windows, navigation bars should use horizontal items.").
 */
export type NavBarLayout = NavBarItemLayout | 'auto';
/** The smallest medium window width (M3 window size classes). */
export declare const MEDIUM_WINDOW_QUERY = "(min-width: 600px)";
/** Navigation bar item layout configurations. */
export declare const NAV_BAR_ITEM_LAYOUTS: {
    readonly vertical: "vertical";
    readonly horizontal: "horizontal";
};
/** Navigation bar classes constants. */
export declare const NAV_BAR_CLASSES: {
    readonly navBar: "nav-bar";
    readonly navBarVertical: "nav-bar-vertical";
    readonly navBarHorizontal: "nav-bar-horizontal";
};
/** The state provided to the `navBarClasses()` function. */
export interface NavBarClassesState {
    /** The layout orientation of items inside the navigation bar. */
    itemLayout?: NavBarItemLayout;
}
/**
 * Returns navigation bar classes to apply based on the given state.
 *
 * @param state The state of the navigation bar.
 * @return An object of class names and truthy values if they apply.
 */
export declare function navBarClasses({ itemLayout, }?: NavBarClassesState): ClassInfo;
/**
 * Lit directive for navigation bar element class styling.
 *
 * @example
 * ```ts
 * html`<nav class="${navBar({itemLayout: 'vertical'})}">
 *   <button class="${navBarItem({active: true})}">Home</button>
 * </nav>`;
 * ```
 */
export declare const navBar: (state?: NavBarClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/** Navigation bar item classes constants. */
export declare const NAV_BAR_ITEM_CLASSES: {
    readonly navBarItem: "nav-bar-item";
    readonly navBarItemActive: "nav-bar-item-active";
    readonly navBarItemVertical: "nav-bar-item-vertical";
    readonly navBarItemHorizontal: "nav-bar-item-horizontal";
    readonly navBarItemContent: "nav-bar-item-content";
    readonly navBarItemIconContainer: "nav-bar-item-icon-container";
    readonly navBarItemIcon: "nav-bar-item-icon";
    readonly navBarItemLabel: "nav-bar-item-label";
    readonly navBarItemBadge: "nav-bar-item-badge";
    readonly navBarItemBadgeDot: "nav-bar-item-badge-dot";
};
/** The state provided to the `navBarItemClasses()` function. */
export interface NavBarItemClassesState {
    /** Whether the navigation bar item is active/selected. */
    active?: boolean;
    /** Alias for `active`. */
    selected?: boolean;
    /** Whether the navigation bar item is disabled. */
    disabled?: boolean;
    /** The item layout orientation ('vertical' or 'horizontal'). */
    itemLayout?: NavBarItemLayout;
}
/**
 * Returns navigation bar item classes to apply based on the given state.
 *
 * @param state The state of the navigation bar item.
 * @return An object of class names and truthy values if they apply.
 */
export declare function navBarItemClasses({ active, selected, disabled, itemLayout, }?: NavBarItemClassesState): ClassInfo;
/**
 * Sets up navigation bar item functionality for the given element.
 *
 * @param item The element on which to set up navigation bar item functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupNavBarItem(item: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * Lit directive for navigation bar item element class styling.
 */
export declare const navBarItem: (state?: NavBarItemClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
