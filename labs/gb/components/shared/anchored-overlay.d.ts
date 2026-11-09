/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
/**
 * Shared behavior of surfaces anchored to another element: menus, select
 * and autocomplete dropdowns, tooltips, the menu of a split button.
 *
 * - The surface is a popover, shown in the top layer in front of all other
 *   UI ("Menus appear in front of all other UI elements").
 * - It sits next to its anchor and stays inside the window: it is placed on
 *   the preferred side, flips to the opposite one when there is no room, and
 *   is then clamped to the window edges. CSS anchor positioning
 *   (`position-area`) does this in the component's styles; where the browser
 *   lacks it, or when the component asks for it (`positioning: 'js'`, for
 *   tooltips whose caret follows the anchor, or a context menu opened at a
 *   point), {@link computeOverlayPosition} does the same in JS.
 * - Light dismiss: Escape and a press outside close the surface. Each close
 *   has a reason ({@link OverlayCloseReason}); closing the surface closes it
 *   whoever asked (the browser's own light dismiss of `popover="auto"`
 *   included, which the controller labels).
 * - When focus was inside the surface, closing returns it to the invoker
 *   ("Where focus is placed after closing the menu depends on the app":
 *   back to the element that opened it).
 *
 * The controller is driven by the surface's `beforetoggle` and `toggle`
 * events, so it also follows opens and closes the browser starts (a
 * `popovertarget` click, native light dismiss).
 */
/** Why a surface closed. Components may pass their own strings to `close()`. */
export type OverlayCloseReason = 'escape' | 'outside' | 'focus' | 'method' | 'native';
/** What a light dismiss asks for. */
export type OverlayDismissReason = 'escape' | 'outside' | 'focus';
/** Preferred side of the anchor. `start` and `end` follow the writing direction. */
export type OverlayPlacement = 'above' | 'below' | 'start' | 'end';
/** The physical side of the anchor a surface ended up on. */
export type OverlaySide = 'above' | 'below' | 'left' | 'right';
/** A rectangle in viewport coordinates. */
export interface OverlayRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
/** Distances kept from the window edges. */
export interface OverlayMargin {
    inline: number;
    blockStart: number;
    blockEnd: number;
}
/** Input to {@link computeOverlayPosition}. */
export interface OverlayPositionInput {
    /** The anchor's bounding client rect. */
    anchor: OverlayRect;
    /** The surface's untransformed size. */
    surface: {
        width: number;
        height: number;
    };
    /** The viewport size. */
    viewport: {
        width: number;
        height: number;
    };
    placement: OverlayPlacement;
    /**
     * `center` centers the surface on the anchor; `start` aligns it to the
     * anchor's start edge so it extends toward the end (above / below), or to
     * the anchor's top edge (start / end); `end` aligns it to the anchor's end
     * edge so it extends toward the start (above / below; a split button's
     * menu).
     */
    align?: 'center' | 'start' | 'end';
    /** Gap between the anchor and the surface (including any caret). */
    spacing?: number;
    /** Minimum distance kept from the viewport edges. */
    margin?: number | OverlayMargin;
    /** Minimum distance between a caret's center and a surface corner. */
    caretInset?: number;
    rtl?: boolean;
}
/** Output of {@link computeOverlayPosition}. */
export interface OverlayPosition {
    /** Viewport x of the surface's left edge. */
    x: number;
    /** Viewport y of the surface's top edge. */
    y: number;
    side: OverlaySide;
    /**
     * The caret's center along the edge facing the anchor, from the surface's
     * left (above / below) or top (left / right) edge.
     */
    caretOffset: number;
}
/**
 * Positions a surface next to its anchor, after Compose's
 * `TooltipPositionProviderImpl`: prefer the requested side, flip to the
 * opposite side when it doesn't fit, then keep the surface inside the
 * viewport.
 */
export declare function computeOverlayPosition({ anchor, surface, viewport, placement, align, spacing, margin, caretInset, rtl, }: OverlayPositionInput): OverlayPosition;
/** `node` is `parent` or inside it, across shadow roots. */
export declare function composedContains(parent: Node | null, node: Node | null): boolean;
/** The focused element, looking inside open shadow roots. */
export declare function deepActiveElement(): Element | null;
/**
 * Pretends the browser does (`true`) or does not (`false`) have CSS anchor
 * positioning, so tests can drive the JS fallback in a browser that has it.
 * `null` goes back to detecting it. Takes effect when a surface next opens.
 */
export declare function forceAnchorPositioningSupport(value: boolean | null): void;
/** Whether the browser positions elements with CSS anchor positioning. */
export declare function supportsAnchorPositioning(): boolean;
/** What the controller needs to place a surface; see {@link AnchoredOverlayOptions.placement}. */
export interface OverlayPlacementOptions {
    placement: OverlayPlacement;
    align?: 'center' | 'start' | 'end';
    spacing?: number;
    margin?: number | OverlayMargin;
    caretInset?: number;
}
/** Which interactions dismiss a surface. */
export interface OverlayDismissOptions {
    /** Escape closes it. Default true. */
    escape?: boolean;
    /** A press outside the surface and its anchor closes it. Default true. */
    outside?: boolean;
    /** Focus moving to an element outside closes it. Default false. */
    focusIn?: boolean;
    /**
     * Focus leaving the surface, anchor and `contains` regions (also to
     * nothing, as a click on the page background does) closes it. Default
     * false.
     */
    focusOut?: boolean;
}
/** Options of {@link AnchoredOverlayController}. */
export interface AnchoredOverlayOptions {
    /** The popover element. */
    surface: () => HTMLElement | null;
    /**
     * The element the surface is placed next to. Also the default place focus
     * returns to.
     */
    anchor?: () => HTMLElement | null;
    /**
     * The `popover` mode given to a surface that has none. `auto` surfaces are
     * light dismissed by the browser (the controller labels the reason);
     * `manual` ones by the controller. Default `manual`.
     */
    popover?: 'auto' | 'manual';
    /**
     * `css`: the component's styles place the surface (`position-area`), and
     * the controller takes over only where the browser lacks CSS anchor
     * positioning. `js`: the controller always places it. Default `css`.
     */
    positioning?: 'css' | 'js';
    /** Where the controller places the surface (JS positioning and the fallback). */
    placement?: () => OverlayPlacementOptions;
    dismiss?: OverlayDismissOptions;
    /** More elements that count as inside (for outside press and focus). */
    contains?: (node: Node) => boolean;
    /**
     * Called when a light dismiss asks to close the surface (manual surfaces).
     * Default: `close(reason)`. Components that own an `open` property set it.
     */
    onDismiss?: (reason: OverlayDismissReason) => void;
    /** Return false to keep the surface open. Called by `close()`. */
    beforeClose?: (reason: string) => boolean;
    /**
     * Return focus to the invoker when it was inside the surface (optionally
     * only for some close reasons). Default true.
     */
    restoreFocus?: boolean | ((reason: string) => boolean);
    /**
     * The element focus returns to, decided when the surface opens. Default:
     * the toggle event's source (the invoker), else the element that had focus
     * outside the surface, else the anchor.
     */
    returnTarget?: (source: HTMLElement | null) => HTMLElement | null;
    /** The surface has opened. `source` is its invoker, if known. */
    onOpen?: (source: HTMLElement | null) => void;
    /** The surface has closed, with the reason. */
    onClose?: (reason: string) => void;
    /** JS positioning computed a new position. */
    onPosition?: (position: OverlayPosition) => void;
}
/** A Lit controller for surfaces anchored to another element. */
export declare class AnchoredOverlayController implements ReactiveController {
    private readonly options;
    /** The invoker of the open surface, if known. */
    source: HTMLElement | null;
    /** Why the surface last closed. */
    closeReason: string | null;
    /** The side of the anchor the surface is on (after JS positioning). */
    side: OverlaySide | null;
    private surface;
    private surfaceAbort;
    private openAbort;
    private active;
    private focusWasInside;
    private returnTo;
    private pending;
    private point;
    private appliedInline;
    private frame;
    private resizeObserver?;
    constructor(host: ReactiveControllerHost & HTMLElement, options: AnchoredOverlayOptions);
    /** Whether the surface is open. */
    get isOpen(): boolean;
    hostConnected(): void;
    hostUpdated(): void;
    hostDisconnected(): void;
    /**
     * Opens the surface.
     *
     * @param source The invoker, for focus return.
     * @return Whether it is open.
     */
    open(source?: HTMLElement | null): boolean;
    /**
     * Opens the surface at a point in the viewport (a context menu): below and
     * after the point, flipping when there is no room.
     */
    openAt(x: number, y: number, source?: HTMLElement | null): boolean;
    /**
     * Closes the surface.
     *
     * @param reason Why; recorded in {@link closeReason}.
     * @return Whether it closed (`beforeClose` may keep it open).
     */
    close(reason?: string): boolean;
    /** The anchor's bounding rect. */
    anchorRect(): DOMRect | undefined;
    /** Recomputes the JS position (scroll, resize, size change, anchor move). */
    reposition(): void;
    /** Takes the surface out of CSS anchor positioning. */
    private takeOver;
    private get usesJs();
    /** Finds the surface and listens to its toggle events. */
    private bind;
    private handleOpened;
    private handleClosed;
    private captureFocus;
    private restoreFocusIfNeeded;
    /** The event came from the surface, its anchor or another inside region. */
    private isInside;
    private listen;
    private stopListening;
}
