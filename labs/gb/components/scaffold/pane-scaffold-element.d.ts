/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement, type PropertyValues } from 'lit';
import { type ElementFold } from '../../styles/layout/viewport-segments.js';
import { type WindowHeightClass, type WindowSizeClass } from '../../styles/layout/window-size-class.js';
import { type PaneArrangement, type PaneHandleTap, type PaneLevitate, type PaneMode, type PaneName, type PanePosition, type PaneResizeBehavior, type PaneScaffoldLayout } from './pane-scaffold.js';
/** Detail of the `window-class-change` event. */
export interface WindowClassChangeDetail {
    windowClass: WindowSizeClass;
    previous: WindowSizeClass | null;
}
/** Detail of the `window-height-class-change` event. */
export interface WindowHeightClassChangeDetail {
    windowHeightClass: WindowHeightClass;
    previous: WindowHeightClass | null;
}
/** Detail of the `pane-layout-change` event. */
export interface PaneLayoutChangeDetail {
    windowClass: WindowSizeClass;
    mode: PaneMode;
    /** Co-planar panes visible side by side. */
    paneCount: number;
    visiblePanes: PaneName[];
}
/** Detail of the `pane-resize` event. */
export interface PaneResizeDetail {
    /** The secondary pane width set with the drag handle, or null (default). */
    paneWidth: number | null;
    collapsedPane: 'primary' | 'secondary' | null;
}
/**
 * A Material Design pane scaffold: one to three panes that adapt to the
 * window size class, with the canonical list-detail, supporting pane and
 * feed layouts.
 *
 * Margins, the spacer between panes, the fixed pane width and the number of
 * visible panes follow the spec per window size class: compact (< 600px, one
 * pane, 16px margins), medium (600–839px, one pane or two 50/50 panes with
 * `medium-two-pane`, 24px), expanded (840–1199px, two panes, 360px fixed
 * pane), large (1200–1599px, two panes, 412px fixed pane) and extra-large
 * (1600px+, two panes plus an optional third).
 *
 * The window size class is measured from the scaffold's own width, or taken
 * from the enclosing `md-gb-app-scaffold` (which measures the window), and
 * reflected as the `window-class` attribute (with `mode` and `pane-count`,
 * so content can style itself, e.g. show a back button only when
 * `mode="single"`). Slotted content inherits the `--md-sys-layout-*`
 * tokens of that class.
 *
 * @slot - The primary (flexible) pane: the detail pane of a list-detail
 *     layout, the focus pane of a supporting pane layout, or the feed items
 *     (laid out on a grid) of a feed layout.
 * @slot secondary - The secondary pane: the list of a list-detail layout or
 *     the supporting pane. It is the fixed pane in fixed-and-flexible
 *     arrangements.
 * @slot tertiary - An optional third pane (e.g. a standard side sheet),
 *     shown at extra-large only.
 * @slot placeholder - Shown in the primary pane of a two-pane list-detail
 *     layout while `detail-open` is false (no item selected).
 *
 * Levitate (spec: scaffold, "Levitate"): with `levitate="floating"` or
 * `levitate="docked"`, the secondary pane of a supporting pane or feed
 * layout floats above the primary pane (or docks to the bottom edge at
 * compact, like a bottom sheet) in windows too small for two co-planar
 * panes, while `levitate-open` is set. `levitate-modal` makes it modal:
 * a scrim covers the panes, the primary pane is inert, focus moves into the
 * pane and back to the trigger, and the pane closes when something behind
 * it is used or Escape is pressed. Modality is scoped to the scaffold; use
 * `md-gb-dialog` or `md-gb-sheet` for app-wide modals.
 *
 * At large and extra-large windows a levitated pane keeps floating (spec:
 * "On large screens, floating panes are the default"); the scrim is optional
 * (`levitate-modal` adds it). `levitate-coplanar` opts into a co-planar pane
 * there instead. `levitate-draggable` and `levitate-resizable` add a move
 * handle and a resize corner to a floating pane: drag them, or focus them and
 * use the arrow keys (Shift moves in larger steps). `levitate-change` fires
 * after each move or resize.
 *
 * Foldables: the scaffold reads the fold (hinge) from the Viewport Segments
 * API and keeps panes off it. A vertical fold splits two panes at the fold
 * with the spacer on it (at least the spacer width); a horizontal fold
 * (tabletop) stacks the supporting pane below it. The fold crossing the
 * scaffold is reflected as the `fold` attribute (`vertical` or
 * `horizontal`). Browsers without the API keep the regular layout.
 * @csspart scaffold - The flex container of the panes.
 * @csspart pane - Each pane.
 * @csspart primary - The primary pane.
 * @csspart secondary - The secondary pane.
 * @csspart tertiary - The tertiary pane.
 * @csspart spacer - The spacer between panes.
 * @csspart drag-handle - The drag handle.
 * @csspart scrim - The scrim behind a modal levitated pane.
 * @cssprop --pane-container-color - Pane background (transparent: panes
 *     blend with the background, implicit grouping).
 * @cssprop --pane-container-shape - Pane corner radius.
 * @cssprop --feed-columns - Overrides the number of feed grid columns.
 * @cssprop --md-gb-scaffold-nav-inline-size - Width of a navigation rail
 *     beside the scaffold, so split panes keep the spacer centered in the
 *     window. Set by `md-gb-app-scaffold`.
 * @cssprop --md-gb-scaffold-companion-inline-size - Width of a companion rail
 *     on the trailing side of the scaffold. Set by `md-gb-app-scaffold`.
 * @cssprop --scrollbar-gutter - `stable` reserves the panes' scrollbar
 *     gutters, so a scrollbar that appears doesn't move their content
 *     (default `auto`: the spacer is centered on the pane edges).
 * @fires {CustomEvent<WindowClassChangeDetail>} window-class-change - Fired
 *     when the window size class changes. --bubbles --composed
 * @fires {CustomEvent<WindowHeightClassChangeDetail>} window-height-class-change
 *     - Fired when the window height size class changes. --bubbles --composed
 * @fires {CustomEvent<PaneLayoutChangeDetail>} pane-layout-change - Fired when
 *     the visible panes change. --bubbles --composed
 * @fires {Event} levitate-close - Fired when the scaffold closes a levitated
 *     pane (Escape, or using something behind a modal pane). --bubbles
 *     --composed
 * @fires {CustomEvent<PaneResizeDetail>} pane-resize - Fired when the panes
 *     are resized or collapsed with the drag handle. --bubbles --composed
 */
export declare class PaneScaffoldElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** The canonical layout. */
    layout: PaneScaffoldLayout;
    /** How two panes share the width. */
    arrangement: PaneArrangement;
    /**
     * Where the secondary pane sits in two-pane layouts. Defaults to `start`
     * for list-detail and `end` for supporting pane and feed layouts. Mirrors
     * in right-to-left.
     */
    secondaryPosition: PanePosition | undefined;
    /**
     * Whether medium windows show two panes (50% each) instead of one. The
     * spec limits this to low-density content such as settings.
     */
    mediumTwoPane: boolean;
    /**
     * List-detail: whether an item is selected. Single-pane windows show the
     * detail (primary) pane when true and the list (secondary) pane when
     * false; two-pane windows show the `placeholder` slot instead of the
     * detail while false.
     */
    detailOpen: boolean;
    /** Whether two-pane layouts render a drag handle to resize the panes. */
    resizable: boolean;
    /**
     * Width in px of the secondary pane set with the drag handle, or null for
     * the default width. Set it to restore a persisted width.
     */
    paneWidth: number | null;
    /** A pane collapsed with the drag handle, or null. */
    collapsedPane: 'primary' | 'secondary' | null;
    /**
     * `persistent` keeps a resized width or collapsed pane across window size
     * class changes; `temporary` returns to the default layout. Defaults to
     * persistent for list-detail and temporary for the other layouts.
     */
    resizeBehavior: PaneResizeBehavior | undefined;
    /**
     * The levitate strategy for the secondary pane of supporting pane and
     * feed layouts in windows too small for two panes: `none` reflows it
     * below the primary pane, `floating` floats it above, `docked` docks it
     * to the bottom edge at compact (floating from medium).
     */
    levitate: PaneLevitate;
    /** Whether the levitated secondary pane is shown. */
    levitateOpen: boolean;
    /** Whether the levitated secondary pane is modal (scrim, inert panes). */
    levitateModal: boolean;
    /**
     * Keeps a levitated pane co-planar at large and extra-large windows. By
     * default it floats there (spec: scaffold, "On large screens: floating
     * panes are the default").
     */
    levitateCoplanar: boolean;
    /**
     * Lets a floating pane be dragged by its handle, or moved with the arrow
     * keys while the handle is focused (spec: scaffold, floating panes "can be
     * customized to be dragged or resized").
     */
    levitateDraggable: boolean;
    /**
     * Lets a floating pane be resized by its corner handle, or with the arrow
     * keys while the handle is focused.
     */
    levitateResizable: boolean;
    /** Accessible label of the floating pane's move handle. */
    levitateMoveLabel: string;
    /** Accessible label of the floating pane's resize handle. */
    levitateResizeLabel: string;
    /** Accessible label of a modal levitated pane (its dialog role). */
    levitateLabel: string;
    /**
     * Accessible label of the stacked panes' scroll region. Only used while the
     * stacked panes overflow and hold nothing focusable: the region is then
     * focusable (so the keyboard can scroll it) and a labelled `region`.
     */
    scrollLabel: string;
    /** Accessible label of the drag handle. */
    dragHandleLabel: string;
    /**
     * What a tap, Enter or Space on the drag handle does, the single-pointer
     * alternative to dragging it: `toggle` (default) switches between one and
     * two panes; `cycle` steps through the snap widths and then collapses the
     * secondary pane.
     */
    handleTap: PaneHandleTap;
    /** The current window size class (read-only, reflected). */
    get windowClass(): WindowSizeClass;
    /** The current window height size class (read-only, reflected). */
    get windowHeightClass(): WindowHeightClass;
    /**
     * The fold (hinge) crossing the scaffold, relative to its inline-start /
     * top edge, or null (read-only).
     */
    get fold(): ElementFold | null;
    /** Co-planar panes currently visible side by side (read-only). */
    get paneCount(): number;
    /** How panes are currently arranged (read-only). */
    get mode(): PaneMode;
    /** Whether only one pane is visible at a time (read-only). */
    get singlePane(): boolean;
    private hasSecondary;
    private hasTertiary;
    private hasPlaceholder;
    private pressed;
    /** The floating pane's offset from its default place, in px. */
    private floatX;
    private floatY;
    /** The floating pane's size once resized, in px. */
    private floatWidth;
    private floatHeight;
    private elementFold;
    private readonly primaryPane;
    private readonly secondaryPane;
    private readonly dragHandle;
    private plan;
    private appScaffold;
    private lastSecondaryFocus;
    private lastLayoutKey;
    private viewportFold;
    private foldResizeObserver;
    private scrollObserver;
    private readonly scrollTargets;
    private stopFold;
    private lastFocusBeforeOpen;
    private outsideListening;
    private readonly size;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Whether the floating pane shows its move and resize handles. */
    private get floatControls();
    private floatGestures;
    private disconnectFloatGestures;
    /** Binds pointer gestures to the handles that are currently rendered. */
    private syncFloatGestures;
    private createFloatGesture;
    /** Moves the floating pane to an offset, keeping it inside the scaffold. */
    private moveFloatTo;
    /** Resizes the floating pane, within the scaffold and a minimum size. */
    private resizeFloatTo;
    private dispatchFloatChange;
    private resetFloat;
    /** The arrow key's travel, in px (right/down positive), or null. */
    private floatKeyDelta;
    private readonly handleFloatMoveKeyDown;
    private readonly handleFloatResizeKeyDown;
    private renderFloatControls;
    /** List-detail: shows the detail pane (e.g. after selecting an item). */
    openDetail(): void;
    /**
     * List-detail: returns to the list (e.g. from the detail pane's back
     * button in a single-pane window).
     */
    closeDetail(): void;
    /** Shows the levitated secondary pane. */
    openLevitated(): void;
    /** Hides the levitated secondary pane. */
    closeLevitated(): void;
    /** Returns the panes to their default widths. */
    resetPaneWidth(): void;
    private get effectiveResizeBehavior();
    private get effectivePosition();
    private findAppScaffold;
    private readonly handleAppScaffoldHeightClass;
    /** Re-measures the fold when the scaffold resizes. */
    private observeFoldResize;
    /**
     * Finds where the viewport's fold crosses the scaffold. Call it after
     * moving the scaffold without resizing it.
     */
    measureFold(): void;
    /** Whether a modal levitated pane is showing. */
    private get modalOpen();
    private listenOutside;
    /** A modal floating pane closes when something behind it is used. */
    private readonly handleOutsidePointer;
    private readonly handleSecondaryKeyDown;
    private dismissLevitated;
    /** Moves focus into a modal pane: its first focusable element. */
    private focusLevitated;
    /**
     * Modal levitated panes take focus when they open and give it back to the
     * trigger when they close (spec: accessibility, floating panes). A
     * non-modal pane gives focus back only if it had it.
     */
    private levitatedOpenChanged;
    private readonly handleAppScaffoldClass;
    protected willUpdate(changed: PropertyValues<this>): void;
    protected updated(changed: PropertyValues<this>): void;
    /**
     * In a single-pane list-detail layout, opening the detail replaces the
     * list: move focus into the detail, and back to the list item that was
     * focused when returning.
     */
    private moveFocusAfterNavigation;
    private containsFocus;
    private readonly handleSecondaryFocusIn;
    /**
     * Makes the stacked scroller keyboard-scrollable when it needs to be: it
     * overflows and holds nothing focusable, so a keyboard user has no other
     * way to scroll it (axe `scrollable-region-focusable`). It then gets
     * `tabindex="0"`, and, because a focusable element needs a name,
     * `role="region"` and an `aria-label`. A scroller that doesn't overflow,
     * or whose content has a focus stop (the browser scrolls to it), is left
     * out of the tab order and out of the landmarks.
     */
    private syncScroller;
    private handleSlotChange;
    private setResize;
    /** The secondary pane is on the visual left. */
    private get secondaryOnLeft();
    /** Width shared by the two panes, and the current secondary width. */
    private measurePanes;
    /** Secondary width that centers the spacer in the window. */
    private splitWidth;
    private snapTargets;
    /** Applies a secondary width, collapsing a pane at either end. */
    private applyWidth;
    /** A press on the handle, until it is released (the pressed state). */
    private readonly handlePress;
    /** The snap widths while a drag lasts (measured once, at its start). */
    private dragSnap;
    private snapAnchors;
    /**
     * Dragging the handle resizes the secondary pane freely and settles on a
     * snap width at release; the handle's tap and keys reach the same widths
     * through `settleTo()` (the single-pointer alternative).
     */
    private readonly resizeDrag;
    private get dragging();
    /**
     * Tap, Enter or Space: toggle between one and two panes, or (`cycle`) step
     * to the next snap width.
     */
    private toggleCollapsed;
    private readonly handleHandleClick;
    private readonly handleHandleKeyDown;
    private renderPane;
    private renderDragHandle;
    /** Reports the secondary pane width as a percentage of both panes. */
    private syncHandleValue;
    protected render(): import("lit-html").TemplateResult<1>;
}
