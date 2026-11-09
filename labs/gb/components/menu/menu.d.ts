/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Menu context provided to menu items. */
export interface MenuContext {
    /** The item's parent menu. */
    readonly menu: HTMLElement;
    /** Returns the menu's items. */
    getItems: () => HTMLElement[];
    /** Callback for menu items to register themselves with the menu. */
    itemConnected(item: HTMLElement): void;
    /** Callback for menu items to unregister themselves with the menu. */
    itemDisconnected(item: HTMLElement): void;
}
/** Menu context to provide to menu items. */
export declare const menuContext: {
    __context__: MenuContext;
};
/** Menu color configuration types. */
export type MenuColor = 'standard' | 'vibrant';
/** Menu color configurations. */
export declare const MENU_COLORS: {
    readonly standard: "standard";
    readonly vibrant: "vibrant";
};
/**
 * Menu layouts (menus.md "Vertical menus layout"): `standard` items in one
 * surface, or `grouped` groups of items on separate surfaces with gaps
 * between them.
 */
export type MenuLayout = 'standard' | 'grouped';
/** Menu classes. */
export declare const MENU_CLASSES: {
    readonly group: "menu-group";
    readonly groupInactive: "menu-group-inactive";
    readonly sectionLabel: "menu-section-label";
    readonly density1: `${string}-density-1`;
    readonly density2: `${string}-density-2`;
    readonly density3: `${string}-density-3`;
    readonly menu: "menu";
    readonly menuVibrant: "menu-vibrant";
    readonly menuGrouped: "menu-grouped";
    readonly menuActive: "menu-active";
    readonly menuInactive: "menu-inactive";
};
/** Submenu focus states of a menu. */
export type MenuSubmenuState = 'active' | 'inactive';
/** The state provided to the `menuClasses()` function. */
export interface MenuClassesState {
    /** The color of the menu. */
    color?: MenuColor;
    /** The layout of the menu, `standard` by default. */
    layout?: MenuLayout;
    /**
     * In a menu with submenus, whether this menu holds focus (`active`) or has
     * revealed a submenu that holds focus (`inactive`). The menu's corners
     * morph between the two.
     */
    submenu?: MenuSubmenuState;
    /**
     * The density, 0 (default) to -3 (menus.md "Density", web only). The
     * menu's items and submenus inherit it.
     */
    density?: number;
}
/**
 * Returns the menu classes to apply to an element based on the given state.
 *
 * @param state The state of the menu.
 * @return An object of class names and truthy values if they apply.
 */
export declare function menuClasses({ color, layout, submenu, density, }?: MenuClassesState): ClassInfo;
/**
 * Sets up menu functionality for the given element.
 *
 * @param menu The element on which to set up menu functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupMenu(menu: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds menu styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`<div class="${menu()}">TODO: add examples</div>`;
 * ```
 */
export declare const menu: (state?: MenuClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/** Whether a group of menu items are single or multiple selectable. */
export type MenuItemCheckable = 'single' | 'multiple';
/** Context provided to menu items for the checkable state of a menu item group. */
export declare const menuItemCheckable: {
    __context__: MenuItemCheckable;
};
/** Menu item classes. */
export declare const MENU_ITEM_CLASSES: {
    readonly menuItem: "menu-item";
    readonly checked: string;
    readonly hover: string;
    readonly focus: string;
    readonly active: string;
    readonly disabled: string;
};
/** The state provided to the `menuItemClasses()` function. */
export interface MenuItemClassesState {
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
}
/**
 * Returns the menu item classes to apply to an element based on the given
 * state.
 *
 * @param state The state of the menu item.
 * @return An object of class names and truthy values if they apply.
 */
export declare function menuItemClasses({ checked, hover, focus, active, disabled, }?: MenuItemClassesState): ClassInfo;
/**
 * Sets up menu item functionality for the given element.
 *
 * @param menuItem The element on which to set up menu item functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupMenuItem(menuItem: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds menu item styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`<div class="${menuItem()}">TODO: add examples</div>`;
 * ```
 */
export declare const menuItem: (state?: MenuItemClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
