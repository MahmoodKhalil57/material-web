/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/**
 * Compose `PullToRefreshDefaults.PositionalThreshold` (80dp): how far the
 * indicator must be pulled before releasing it refreshes.
 */
export declare const PULL_TO_REFRESH_THRESHOLD_PX = 80;
/**
 * Compose `PullToRefresh.kt` `DragMultiplier`: the indicator moves half as far
 * as the pointer.
 */
export declare const PULL_TO_REFRESH_DRAG_MULTIPLIER = 0.5;
/** Pull to refresh classes constants. */
export declare const PULL_TO_REFRESH_CLASSES: {
    readonly pullToRefresh: "pull-to-refresh";
    /** The baseline circular arrow indicator instead of a loading indicator. */
    readonly pullToRefreshCircular: "pull-to-refresh-circular";
    /** The indicator follows the pointer (no transitions). */
    readonly pullToRefreshPulling: "pull-to-refresh-pulling";
    /** The indicator rests at the threshold while content refreshes. */
    readonly pullToRefreshRefreshing: "pull-to-refresh-refreshing";
    readonly pullToRefreshDisabled: "pull-to-refresh-disabled";
    /** The element that scrolls the content. */
    readonly pullToRefreshScroller: "pull-to-refresh-scroller";
    /** Set on the scroller while it is scrolled to the top. */
    readonly pullToRefreshAtTop: "pull-to-refresh-at-top";
    /** The indicator container, positioned at the top center. */
    readonly pullToRefreshIndicator: "pull-to-refresh-indicator";
};
/** Pull to refresh indicator styles. */
export type PullToRefreshIndicator = 'loading' | 'circular';
/** The state provided to the `pullToRefreshClasses()` function. */
export interface PullToRefreshClassesState {
    /**
     * The indicator: `loading` (M3 Expressive contained loading indicator, the
     * default) or `circular` (circular arrow and progress indicator).
     */
    indicator?: PullToRefreshIndicator;
    /** Whether the indicator follows the pointer. */
    pulling?: boolean;
    /** Whether content is refreshing. */
    refreshing?: boolean;
    /** Whether pulling is turned off. */
    disabled?: boolean;
}
/**
 * Returns pull to refresh classes to apply based on the given state.
 *
 * @param state The state of the pull to refresh container.
 * @return An object of class names and truthy values if they apply.
 */
export declare function pullToRefreshClasses({ indicator, pulling, refreshing, disabled, }?: PullToRefreshClassesState): ClassInfo;
/**
 * The indicator's offset for a pull, from Compose `calculateVerticalOffset()`:
 * it follows the (multiplied) pull up to the threshold, then slows down with
 * a non-linear tension, up to 3/2 of the threshold beyond it.
 *
 * @param pulled How far the pointer pulled (px).
 * @param threshold The positional threshold (px).
 * @return The indicator offset (px).
 */
export declare function pullToRefreshOffset(pulled: number, threshold: number): number;
/** The circular arrow indicator geometry for a pull fraction. */
export interface PullToRefreshArrow {
    /** Rotation of the arc and the arrow, in degrees. */
    rotation: number;
    /** Arc start angle, in degrees (0 at 3 o'clock, clockwise). */
    startAngle: number;
    /** Arc end angle, in degrees. */
    endAngle: number;
    /** Arrow head scale, 0 to 1. */
    scale: number;
    /** Opacity: 1 once past the threshold, 0.3 before. */
    alpha: number;
}
/**
 * Computes the circular arrow indicator for a pull fraction, from Compose
 * `ArrowValues()` (itself from Android's `SwipeRefreshLayout`).
 *
 * @param progress The pull fraction (1 at the threshold, up to 2.5 beyond).
 * @return The arc and arrow geometry.
 */
export declare function pullToRefreshArrow(progress: number): PullToRefreshArrow;
/** Options of a `PullToRefreshGesture`. */
export interface PullToRefreshGestureOptions {
    /** The element that scrolls the content. */
    scroller: () => HTMLElement | null;
    /** The positional threshold (px). */
    threshold: () => number;
    /** Whether a pull can start (not disabled or refreshing). */
    enabled: () => boolean;
    /**
     * Called while pulling with the pull fraction: the indicator offset over
     * the threshold (1 at the threshold).
     */
    onPull: (fraction: number) => void;
    /**
     * Called on release (or cancel), with whether the pull passed the
     * threshold.
     */
    onRelease: (refresh: boolean) => void;
}
/**
 * The pull gesture of a pull to refresh container: a downward drag that
 * starts while the content is scrolled to its top, after Compose
 * `Modifier.pullToRefresh()`. Pulling back up undoes the pull; releasing
 * past the threshold refreshes (Compose: `adjustedDistancePulled >
 * thresholdPx`).
 *
 * It also marks the scroller with `.pull-to-refresh-at-top` while it is
 * scrolled to the top, so its `touch-action` leaves downward touch drags to
 * the gesture instead of the browser.
 */
export declare class PullToRefreshGesture {
    private readonly options;
    private readonly drag;
    private scroller;
    private pulled;
    constructor(target: HTMLElement, options: PullToRefreshGestureOptions);
    /** Re-reads the scroller (call after it is re-rendered). */
    syncScroller(): void;
    /** Removes the listeners and cancels a pull in progress. */
    disconnect(): void;
    private fraction;
    private readonly updateAtTop;
}
/**
 * Sets up pull to refresh on a Light DOM `.pull-to-refresh` element that
 * holds a `.pull-to-refresh-scroller` and a `.pull-to-refresh-indicator`.
 *
 * While pulling, it sets `--pull-to-refresh-fraction` and the
 * `.pull-to-refresh-pulling` class. Releasing past the threshold fires a
 * cancelable `refresh` event and, unless it is cancelled, adds
 * `.pull-to-refresh-refreshing`; remove that class when the content has
 * refreshed.
 *
 * @param element The `.pull-to-refresh` element.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupPullToRefresh(element: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * Lit directive for Light DOM pull to refresh class styling and the pull
 * gesture.
 *
 * @example
 * ```ts
 * html`<div class="${pullToRefresh()}" @refresh=${reload}>
 *   <div class="pull-to-refresh-scroller">...</div>
 *   <div class="pull-to-refresh-indicator">
 *     <div class="${loadingIndicator({contained: true})}"
 *         aria-label="Refreshing"></div>
 *   </div>
 * </div>`;
 * ```
 */
export declare const pullToRefresh: (state?: PullToRefreshClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
