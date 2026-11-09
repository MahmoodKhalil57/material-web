/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
import { type Density } from '../shared/density.js';
import { type MenuColor, type MenuLayout } from './menu.js';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement, import("../../../behaviors/focusable.js").Focusable>, import("../../../behaviors/element-internals.js").WithElementInternals>;
/**
 * How long a touch must be held to open a context menu (the Android
 * `ViewConfiguration.getLongPressTimeout()` default Compose uses for long
 * presses), and how far it may move.
 */
export declare const LONG_PRESS_MS = 400;
/** The closest `md-gb-menu` that contains `node` (itself included). */
export declare function closestMenu(node: Element | null): MenuElement | null;
/**
 * A Material Design vertical menu.
 *
 * Menus are popovers: open them with a `popovertarget` invoker,
 * `showPopover()`, `showAt()` or as a context menu (`context-for`).
 *
 * Keyboard (menus.md "Keyboard navigation"): on the closed menu's button
 * (its `popovertarget` or `commandfor` invoker), Up and Down open the menu
 * ("For closed menus: Opens menu") and focus its first item; Space and Enter
 * open it natively. In the open menu, Up and Down move between items
 * (disabled items included: "Disabled menu items can receive focus"), Home
 * and End go to the first and last item, letters move to the next item
 * starting with them, Escape and Tab close the menu. In a submenu, Left
 * (Right in RTL) closes it and returns focus to its item.
 *
 * @slot - The menu's items, groups and dividers.
 * @csspart menu - The menu's root element.
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-shape
 * @cssprop --container-min-width
 * @cssprop --container-max-width
 * @cssprop --gap - Space between groups in the grouped layout.
 * @cssprop --group-padding
 * @cssprop --group-shape
 * @cssprop --section-label-text-color
 * @cssprop --section-label-text
 * @cssprop --density-step - Item height removed per density step (set on
 *   the items).
 */
export declare class MenuElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** The color style: `standard` (surface-based) or `vibrant` (tertiary). */
    color: MenuColor;
    /**
     * The layout: `standard` items on one surface, or `grouped`
     * `md-gb-menu-group`s on separate surfaces with gaps between them.
     */
    layout: MenuLayout;
    /**
     * The id of an element (in the same root) that opens this menu as a
     * context menu on a secondary click, the context menu key or a long press
     * (menus.md "Context menus ... usually open with a secondary click";
     * "Performs a specific action to trigger the menu, like right-click or
     * press-and-hold").
     */
    contextFor: string;
    /**
     * The id of a text field (in the same root) the menu is attached to. As
     * the person types in it, the menu opens (without taking focus) and shows
     * only the items whose label contains the text, case-insensitively
     * (menus.md "Filtering": "As someone types, the list of menu options
     * filters to show relevant results"). The remaining items ease into
     * their new position ("Menu items ease into their new position as the menu
     * is filtered"), unless motion is reduced. Fires `filter` with the query.
     */
    filterFor: string;
    /** The text the menu is filtered by. Empty shows every item. */
    get filterQuery(): string;
    private filterText;
    private filterAbort?;
    /**
     * The density, from 0 (default) to -3 (menus.md "Density": "On web only,
     * density levels control the spacing between elements. Increasing density
     * decreases the top and bottom padding"). Each step removes 4px from the
     * items' height; submenus inherit it. Values are clamped to that range.
     *
     * Dense items are smaller than the 48px recommended target, so don't
     * apply density by default; let people opt in (grids-spacing.md "Avoid
     * applying component scaling by default").
     */
    get density(): Density;
    set density(density: number);
    private densityValue;
    /** The menu item whose submenu this menu is, if any. */
    get parentItem(): HTMLElement | null;
    /** The menu's items (not those of its submenus), in document order. */
    get items(): HTMLElement[];
    /** Every item of the menu, filtered out ones included. */
    private get allItems();
    /**
     * Whether a submenu of this menu holds focus or the pointer (menus.md
     * "Focus": "the corners of the focused submenu become more rounded, while
     * the unfocused submenu becomes less rounded").
     */
    private inactive;
    /**
     * Set before opening to keep focus where it is (submenus opened by
     * hovering); reset when the menu opens.
     */
    skipInitialFocus: boolean;
    private readonly itemsSet;
    private typeahead;
    private typeaheadTime;
    private contextTarget;
    private contextAbort?;
    private longPressTimer;
    private longPressOpened;
    private invokerAbort?;
    /** The invoker that opened the menu from the keyboard, for focus return. */
    private keyboardInvoker;
    /** The invokers marked `aria-expanded` while the menu is open. */
    private markedInvokers;
    /**
     * The popover (shown in front of all other UI), its position next to the
     * invoker or parent item (flipping when there is no room; context menus at
     * the pointer), light dismiss with a reason, and focus returning to the
     * invoker.
     */
    private readonly overlay;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private cssValue;
    protected updated(changed: Map<string, unknown>): void;
    /**
     * Shows only the items whose label contains `query`, easing the others
     * into their new position.
     */
    filter(query: string): void;
    private bindFilterTarget;
    /**
     * Opens the menu at a point in the viewport (a context menu), keeping it
     * inside the window: it opens below and after the point, and flips when
     * there is no room.
     *
     * @param x The viewport x coordinate (`clientX`).
     * @param y The viewport y coordinate (`clientY`).
     */
    showAt(x: number, y: number): void;
    /** Closes this menu and every menu it is a submenu of. */
    closeAll(): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private handleKeydown;
    /**
     * Up and Down on the closed menu's button open the menu (menus.md
     * "Keyboard navigation": "Up and Down arrows: For closed menus: Opens
     * menu"). A native `popovertarget` button only opens it with Space, Enter
     * or a click. Listens in the menu's root, where its invokers are.
     */
    private bindInvokerKeys;
    /**
     * Marks the menu's invokers as expanded while it is open, the hook for
     * the trigger components to draw it pressed (menus.md "Selecting": "the
     * corresponding button or icon button should remain the same visually,
     * with the addition of a pressed state ... even when opening from a
     * keyboard shortcut"). It follows the popover's toggle, so every way of
     * opening the menu is covered.
     */
    private markInvokers;
    private activeElementOutside;
    private bindContextTarget;
    private unbindContextTarget;
}
export {};
