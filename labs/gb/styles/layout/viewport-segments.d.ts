/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Foldable support: finds the fold (hinge) between the viewport segments of
 * a foldable or dual-screen device, via the Viewport Segments API
 * (`window.viewport.segments`, the `horizontal-viewport-segments` and
 * `vertical-viewport-segments` media features).
 *
 * The spec (foundations/layout) defines the fold as "a flexible area of the
 * screen or a hinge that separates two displays on foldable devices" and the
 * spacer as "the space between two panes on a foldable device": two-pane
 * layouts put the spacer on the fold so no pane straddles it.
 *
 * Browsers without the API report no segments, and layouts fall back to
 * their regular behavior. Tests and demos can call
 * `simulateViewportSegments()` to fake a fold.
 */
/** A rectangle in viewport (CSS px) coordinates. */
export interface SegmentRect {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}
/**
 * The direction of the fold line.
 *
 * - `vertical`: segments side by side (book posture, dual screens). Panes
 *   split left and right of the fold.
 * - `horizontal`: segments above each other (tabletop posture). Panes split
 *   above and below the fold.
 */
export type FoldOrientation = 'vertical' | 'horizontal';
/** The fold between two viewport segments, in viewport coordinates. */
export interface Fold extends SegmentRect {
    readonly orientation: FoldOrientation;
}
/** A fold relative to an element (see `foldWithin()`). */
export interface ElementFold {
    readonly orientation: FoldOrientation;
    /**
     * Distance from the element's inline-start edge (vertical fold, mirrored
     * in right-to-left) or top edge (horizontal fold) to the fold, in px.
     */
    readonly start: number;
    /** Width (vertical fold) or height (horizontal fold) of the fold, in px. */
    readonly size: number;
}
/**
 * Fakes the viewport segments (for tests and demos), or restores the real
 * ones with `undefined`. `null` simulates a device without segments.
 */
export declare function simulateViewportSegments(segments: readonly SegmentRect[] | null | undefined): void;
/**
 * Returns the viewport segments, or null when the viewport is one segment
 * or the browser has no Viewport Segments API.
 */
export declare function getViewportSegments(win?: Window): readonly SegmentRect[] | null;
/**
 * Returns the fold between two viewport segments, or null. Segments side
 * by side give a vertical fold, segments above each other a horizontal
 * one. The fold spans the gap between the segments (0 wide for a seamless
 * fold).
 */
export declare function foldFromSegments(segments: readonly SegmentRect[] | null): Fold | null;
/** Returns the current fold of the viewport, or null. */
export declare function getFold(win?: Window): Fold | null;
/**
 * Returns the fold relative to an element's box, or null when the fold does
 * not cross the element.
 *
 * @param fold The fold, in viewport coordinates.
 * @param rect The element's box (`getBoundingClientRect()`).
 * @param rtl Whether the element is right-to-left (a vertical fold's
 *     `start` is then measured from the right edge).
 */
export declare function foldWithin(fold: Fold | null, rect: SegmentRect, rtl?: boolean): ElementFold | null;
/** Options for `observeFold()`. */
export interface ObserveFoldOptions {
    /** Stops observing when aborted. */
    signal?: AbortSignal;
    /** Whether to call the callback right away. Defaults to true. */
    initial?: boolean;
    /** The window to observe. Defaults to `window`. */
    window?: Window;
}
/**
 * Calls `callback` whenever the viewport's fold appears, moves or goes away
 * (posture changes fire the segment media queries and `resize`).
 *
 * @return A function that stops observing.
 */
export declare function observeFold(callback: (fold: Fold | null) => void, { signal, initial, window: win }?: ObserveFoldOptions): () => void;
