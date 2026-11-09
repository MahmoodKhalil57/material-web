/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement>;
/**
 * A Material Design navigation drawer item (destination).
 *
 * Renders a link when `href` is set, otherwise a button. The selected item is
 * marked with `aria-current="page"` and the active indicator.
 *
 * @slot - The item's label text.
 * @slot icon - The item's leading icon (`md-gb-icon`). Filled when selected.
 * @slot badge - Trailing badge label text (overrides the `badge` property).
 * @csspart item - The item's link or button.
 * @csspart icon - The icon container.
 * @csspart label - The label text container.
 * @csspart badge - The trailing badge label container.
 */
export declare class NavDrawerItemElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** Whether the item is the selected (current) destination. */
    selected: boolean;
    /** Whether the item is disabled. */
    disabled: boolean;
    /** The URL the item links to. Renders a link (`<a>`) when set. */
    href: string;
    /** Where to open the linked `href`, e.g. `_blank`. */
    target: '_blank' | '_parent' | '_self' | '_top' | '';
    /** The link's `rel` attribute, when `href` is set. */
    rel: string;
    /**
     * Trailing badge label text, such as an unread count. Ignored when content
     * is slotted into `badge`.
     */
    badge: string;
    /**
     * Whether the item is in the tab order. The parent `md-gb-nav-drawer`
     * manages this to provide a single tab stop with arrow key navigation.
     */
    tabStop: boolean;
    private hasIcon;
    private hasSlottedBadge;
    private readonly itemElement;
    connectedCallback(): void;
    /** Focuses the item's link or button. */
    focus(options?: FocusOptions): void;
    blur(): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private handleClick;
    private handleIconSlotChange;
    private handleBadgeSlotChange;
}
export {};
