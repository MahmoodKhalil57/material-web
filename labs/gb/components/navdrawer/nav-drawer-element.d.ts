/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement, type PropertyValues } from 'lit';
import { DragSettleController } from '../shared/drag-settle.js';
import { RovingFocusController } from '../shared/roving-focus.js';
import { NavDrawerItemElement } from './nav-drawer-item-element.js';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement>;
/**
 * A Material Design navigation drawer.
 *
 * A standard drawer sits next to the app content and slides in and out with
 * `open`. A `modal` drawer opens over a scrim in a modal `<dialog>`: focus is
 * trapped inside it and restored when it closes, and it closes on Escape, a
 * scrim click, when an item is selected, or when it is swiped toward its edge
 * (Compose `ModalNavigationDrawer`: the drawer follows a horizontal drag on
 * the drawer or the scrim, and a release past half its width or a fling
 * faster than 400px/s settles it closed with the spatial spring, otherwise it
 * settles back open). Set `gestures-disabled` to turn swiping off.
 *
 * @slot - Navigation items (`md-gb-nav-drawer-item`), section labels (headings
 *     or `.nav-drawer-section-label`) and dividers (`md-gb-divider` or `<hr>`).
 * @slot headline - Optional headline shown above the items.
 * @csspart drawer - The drawer sheet.
 * @csspart nav - The `<nav>` landmark.
 * @csspart dialog - The modal drawer's `<dialog>`.
 * @csspart scrim - The modal drawer's scrim.
 * @fires {Event} open - Fired when the drawer starts opening. --cancelable
 * @fires {Event} opened - Fired when the drawer has opened and finished animating.
 * @fires {CustomEvent<{reason: string}>} close - Fired when the drawer starts closing. --cancelable
 * @fires {CustomEvent<{reason: string}>} closed - Fired when the drawer has closed and finished animating.
 * @fires {Event} change - Fired when the user selects a different item. --bubbles
 * @cssprop --active-focus-icon-color
 * @cssprop --active-focus-label-text-color
 * @cssprop --active-hover-icon-color
 * @cssprop --active-hover-label-text-color
 * @cssprop --active-icon-color
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-height
 * @cssprop --active-indicator-shape
 * @cssprop --active-indicator-width
 * @cssprop --active-label-text
 * @cssprop --active-label-text-axes
 * @cssprop --active-label-text-color
 * @cssprop --active-pressed-icon-color
 * @cssprop --active-pressed-label-text-color
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height
 * @cssprop --container-padding-block
 * @cssprop --container-padding-inline
 * @cssprop --container-shape - Radius of the end corners.
 * @cssprop --container-width
 * @cssprop --container-width-minimum
 * @cssprop --divider-inset
 * @cssprop --headline
 * @cssprop --headline-axes
 * @cssprop --headline-color
 * @cssprop --headline-tracking
 * @cssprop --icon-size
 * @cssprop --inactive-focus-icon-color
 * @cssprop --inactive-focus-label-text-color
 * @cssprop --inactive-hover-icon-color
 * @cssprop --inactive-hover-label-text-color
 * @cssprop --inactive-icon-color
 * @cssprop --inactive-label-text-color
 * @cssprop --inactive-pressed-icon-color
 * @cssprop --inactive-pressed-label-text-color
 * @cssprop --item-icon-label-space
 * @cssprop --item-leading-space
 * @cssprop --item-trailing-space
 * @cssprop --label-text
 * @cssprop --label-text-axes
 * @cssprop --label-text-tracking
 * @cssprop --large-badge-label
 * @cssprop --large-badge-label-axes
 * @cssprop --large-badge-label-color
 * @cssprop --large-badge-label-tracking
 * @cssprop --motion-close-duration
 * @cssprop --motion-close-easing
 * @cssprop --motion-effects-duration
 * @cssprop --motion-effects-easing
 * @cssprop --motion-open-duration
 * @cssprop --motion-open-easing
 * @cssprop --scrim-color
 * @cssprop --section-label-height
 * @cssprop --section-label-leading-space
 * @cssprop --scrollbar-gutter - `stable` reserves the scrollbar gutter, so a
 *     scrollbar that appears doesn't move the items (default `auto`: where
 *     scrollbars take space it would narrow the 12dp indicator padding).
 */
export declare class NavDrawerElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** Whether the drawer is open. */
    get open(): boolean;
    set open(value: boolean);
    /**
     * Whether the drawer is modal: it opens over a scrim that blocks the rest of
     * the app, instead of sitting next to the content.
     */
    modal: boolean;
    /** Whether to skip the open and close transitions. */
    quick: boolean;
    /**
     * The accessible name of the navigation landmark. Use it instead of
     * `aria-label` when the host sits outside any landmark: the host's
     * `aria-label` moves to a data attribute that checkers (axe `region`) still
     * read as a name on a host that has no landmark role.
     */
    label: string;
    /**
     * Whether swiping a modal drawer closed is turned off (Compose
     * `gesturesEnabled = false`). Escape, the scrim and `close()` still close
     * it.
     */
    gesturesDisabled: boolean;
    /**
     * While a modal drawer is dragged: how far it is dragged toward its edge,
     * from 0 (open) to its width (closed).
     */
    private dragOffset;
    /** Whether a swiped drawer is settling closed (spatial spring). */
    private swipeSettling;
    private dragWidth;
    /** 1 when the drawer closes toward the left (LTR), -1 toward the right. */
    private dragDirection;
    private readonly sheet;
    private readonly dialog;
    /**
     * A modal drawer is a native `<dialog>` over a scrim: Escape, back and
     * scrim close requests, a focus trap, initial focus on the first item,
     * focus restore and page scroll lock. A standard drawer only opens and
     * closes.
     */
    private readonly modalSurface;
    /** Whether the sheet is on screen (drives the transitions). */
    private get visible();
    /** The drawer's items. */
    get items(): NavDrawerItemElement[];
    /** The selected item, if any. */
    get selectedItem(): NavDrawerItemElement | null;
    constructor();
    /** Keeps the tab stop on a visible item when items are hidden or shown. */
    private readonly hiddenObserver;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Opens the drawer. Resolves once it has finished animating. */
    show(): Promise<void>;
    /**
     * Closes the drawer. Resolves once it has finished animating.
     *
     * @param reason Why the drawer closes, given in the `close` and `closed`
     *     events (see `NAV_DRAWER_CLOSE_REASONS`).
     */
    close(reason?: string): Promise<void>;
    /**
     * Opens the drawer when closed, closes it when open.
     *
     * @return A promise that resolves once the drawer has finished animating.
     */
    toggle(): Promise<void>;
    protected updated(changed: PropertyValues<this>): void;
    protected render(): import("lit-html").TemplateResult<1>;
    /**
     * Swipe to dismiss: a drag on the modal `<dialog>` (the sheet or the
     * scrim) moves the sheet between the open and closed anchors, and settles
     * on release like Compose's `AnchoredDraggableState`. Shared
     * DragSettleController, with the closing direction positive.
     */
    protected readonly swipe: DragSettleController;
    private sheetIsRtl;
    private waitForTransitions;
    /**
     * Up / Down (wrapping), Home / End and one tab stop (shared
     * RovingFocusController). Tab enters on the first destination, as the
     * spec's initial focus rule says, not on the selected one.
     */
    protected readonly rovingFocus: RovingFocusController;
    private syncTabStops;
    private handleSlotChange;
    private readonly handleItemClick;
    private findItem;
}
export {};
