/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement, PropertyValues } from 'lit';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement, import("../../../behaviors/focusable.js").Focusable>, import("../../../behaviors/element-internals.js").WithElementInternals>;
/**
 * How long the pointer rests on (or leaves) an item before its submenu opens
 * (or closes); the `md-sub-menu` `hover-open-delay` / `hover-close-delay`
 * defaults.
 */
export declare const SUBMENU_HOVER_DELAY_MS = 400;
/** A submenu: an `md-gb-menu` slotted into an item's `submenu` slot. */
interface Submenu extends HTMLElement {
    closeAll?: () => void;
}
/**
 * A Material Design menu item component.
 *
 * An item can open a submenu: an `md-gb-menu` in its `submenu` slot. The
 * submenu opens next to the item on click, Enter, Space, Right (Left in
 * RTL) or after the pointer rests on the item, and closes when the pointer
 * leaves both or on Left (Right in RTL) / Escape (menus.md "Left and Right
 * arrows: Opens or closes a submenu").
 *
 * @slot - Used to display the item's primary label.
 * @slot leading - Used to display icons and content before the item's main content.
 * @slot supporting-text - Used to display supporting text below the main label.
 * @slot trailing-text - Used to display metadata or text after the item's main content.
 * @slot trailing - Used to display icons and content after the item's main content.
 * @slot submenu - An `md-gb-menu` to open as this item's submenu.
 * @fires {Event} change - Fired when a checkbox or menu item is checked or unchecked. --bubbles
 * @fires {InputEvent} input - Fired when a checkbox or menu item is checked or unchecked. --bubbles --composed
 * @csspart menu-item - The menu item's root element.
 * @cssprop --between-space
 * @cssprop --bottom-space
 * @cssprop --container-color
 * @cssprop --height
 * @cssprop --inner-corner-corner-size
 * @cssprop --label-text-color
 * @cssprop --label-text
 * @cssprop --label-text-axes
 * @cssprop --label-text-tracking
 * @cssprop --leading-icon-color
 * @cssprop --leading-icon-size
 * @cssprop --leading-space
 * @cssprop --shape
 * @cssprop --supporting-text-color
 * @cssprop --supporting-text
 * @cssprop --supporting-text-axes
 * @cssprop --supporting-text-tracking
 * @cssprop --top-space
 * @cssprop --trailing-icon-color
 * @cssprop --trailing-icon-size
 * @cssprop --trailing-space
 * @cssprop --trailing-supporting-text
 * @cssprop --trailing-supporting-text-axes
 * @cssprop --trailing-supporting-text-color
 * @cssprop --trailing-supporting-text-tracking
 */
export declare class MenuItemElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    checked: boolean;
    disabled: boolean;
    get menu(): HTMLElement | null;
    /**
     * The menu's color as a class on the item's root, for browsers without
     * style queries (menu.scss).
     */
    private syncVibrantClass;
    /** The item's submenu, if it has one. */
    get submenu(): Submenu | null;
    private readonly menuContext?;
    private readonly checkable?;
    private hasSubmenu;
    private expanded;
    private hoverTimer;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Opens the item's submenu next to it and focuses its first item.
     *
     * @param focus Whether to move focus into the submenu (default true).
     */
    openSubmenu(focus?: boolean): void;
    /** Closes the item's submenu. */
    closeSubmenu(): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private renderContent;
    /**
     * The label of an item with text and an icon is the text: its icons are
     * decorative (menus.md, Labeling elements), so a slotted icon without a
     * label of its own is hidden from assistive technology.
     */
    private readonly markIconsDecorative;
    protected willUpdate(changed: PropertyValues<this>): void;
    /** The role and checked state follow the group's `checkable` context. */
    private syncRole;
    protected updated(): void;
    private readonly onSubmenuToggle;
    private readonly onSubmenuPointerEnter;
    private readonly onSubmenuPointerLeave;
    private onSubmenuSlotChange;
    private boundSubmenus;
    private scheduleHover;
    private isFromSubmenu;
}
export {};
