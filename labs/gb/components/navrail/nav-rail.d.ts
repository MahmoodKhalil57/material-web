/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Navigation rail vertical alignment configuration types. */
export type NavRailAlignment = 'top' | 'center' | 'bottom';
/** Navigation rail vertical alignment configurations. */
export declare const NAV_RAIL_ALIGNMENTS: {
    readonly top: "top";
    readonly center: "center";
    readonly bottom: "bottom";
};
/** Navigation rail item layout configuration types. */
export type NavRailItemLayout = 'vertical' | 'horizontal';
/** Navigation rail item layout configurations. */
export declare const NAV_RAIL_ITEM_LAYOUTS: {
    readonly vertical: "vertical";
    readonly horizontal: "horizontal";
};
/** Navigation rail classes constants. */
export declare const NAV_RAIL_CLASSES: {
    readonly navRail: "nav-rail";
    readonly navRailExpanded: "nav-rail-expanded";
    readonly navRailModal: "nav-rail-modal";
    readonly navRailNarrow: "nav-rail-narrow";
    readonly navRailDragging: "nav-rail-dragging";
    readonly navRailAlignTop: "nav-rail-align-top";
    readonly navRailAlignCenter: "nav-rail-align-center";
    readonly navRailAlignBottom: "nav-rail-align-bottom";
    readonly navRailVertical: "nav-rail-vertical";
    readonly navRailHorizontal: "nav-rail-horizontal";
    readonly navRailHeader: "nav-rail-header";
    readonly navRailMenuButton: "nav-rail-menu-button";
    readonly navRailItems: "nav-rail-items";
};
/** The state provided to the `navRailClasses()` function. */
export interface NavRailClassesState {
    /** Vertical alignment of items within the navigation rail. */
    alignment?: NavRailAlignment;
    /** Whether the navigation rail is expanded. */
    expanded?: boolean;
    /** The layout orientation of items inside the navigation rail. */
    itemLayout?: NavRailItemLayout;
    /** Whether the navigation rail is in a modal state. */
    modal?: boolean;
    /** Whether the collapsed rail uses the narrow (80dp) width. */
    narrow?: boolean;
    /** Whether a modal rail is being swiped (`.nav-rail-dragging`). */
    dragging?: boolean;
}
/**
 * Returns navigation rail classes to apply based on the given state.
 *
 * @param state The state of the navigation rail.
 * @return An object of class names and truthy values if they apply.
 */
export declare function navRailClasses({ alignment, expanded, itemLayout, modal, narrow, dragging, }?: NavRailClassesState): ClassInfo;
/**
 * Lit directive for navigation rail element class styling.
 *
 * @example
 * ```ts
 * html`<nav class="${navRail({alignment: 'top'})}">
 *   <button class="${navRailItem({selected: true})}">Home</button>
 * </nav>`;
 * ```
 */
export declare const navRail: (state?: NavRailClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/** Navigation rail item classes constants. */
export declare const NAV_RAIL_ITEM_CLASSES: {
    readonly navRailItem: "nav-rail-item";
    readonly navRailItemActive: "nav-rail-item-active";
    readonly navRailItemVertical: "nav-rail-item-vertical";
    readonly navRailItemHorizontal: "nav-rail-item-horizontal";
    readonly navRailItemContent: "nav-rail-item-content";
    readonly navRailItemIndicator: "nav-rail-item-indicator";
    readonly navRailItemIcon: "nav-rail-item-icon";
    readonly navRailItemLabel: "nav-rail-item-label";
    readonly navRailItemBadge: "nav-rail-item-badge";
    readonly navRailItemBadgeDot: "nav-rail-item-badge-dot";
};
/** The state provided to the `navRailItemClasses()` function. */
export interface NavRailItemClassesState {
    /** Whether the navigation rail item is active/selected. */
    active?: boolean;
    /** Whether the navigation rail item is disabled. */
    disabled?: boolean;
    /** The item layout orientation ('vertical' or 'horizontal'). */
    itemLayout?: NavRailItemLayout;
    /** Whether the navigation rail item is selected. */
    selected?: boolean;
}
/**
 * Returns navigation rail item classes to apply based on the given state.
 *
 * @param state The state of the navigation rail item.
 * @return An object of class names and truthy values if they apply.
 */
export declare function navRailItemClasses({ active, disabled, itemLayout, selected, }?: NavRailItemClassesState): ClassInfo;
/**
 * Sets up navigation rail item functionality for the given element.
 *
 * @param item The element on which to set up navigation rail item behavior.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupNavRailItem(item: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * Lit directive for navigation rail item element class styling.
 */
export declare const navRailItem: (state?: NavRailItemClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
