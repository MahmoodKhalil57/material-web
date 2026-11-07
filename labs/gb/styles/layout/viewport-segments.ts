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

interface ViewportWithSegments {
  readonly segments?: readonly SegmentRect[] | null;
}

let simulated: readonly SegmentRect[] | null | undefined = undefined;
const simulationListeners = new Set<() => void>();

/**
 * Fakes the viewport segments (for tests and demos), or restores the real
 * ones with `undefined`. `null` simulates a device without segments.
 */
export function simulateViewportSegments(
  segments: readonly SegmentRect[] | null | undefined,
) {
  simulated = segments;
  for (const listener of simulationListeners) {
    listener();
  }
}

/**
 * Returns the viewport segments, or null when the viewport is one segment
 * or the browser has no Viewport Segments API.
 */
export function getViewportSegments(
  win: Window = window,
): readonly SegmentRect[] | null {
  if (simulated !== undefined) {
    return simulated;
  }
  const viewport = (win as Window & {viewport?: ViewportWithSegments}).viewport;
  const segments = viewport?.segments;
  return segments && segments.length > 1 ? segments : null;
}

/**
 * Returns the fold between two viewport segments, or null. Segments side
 * by side give a vertical fold, segments above each other a horizontal
 * one. The fold spans the gap between the segments (0 wide for a seamless
 * fold).
 */
export function foldFromSegments(
  segments: readonly SegmentRect[] | null,
): Fold | null {
  if (!segments || segments.length !== 2) {
    return null;
  }
  const [a, b] = segments;
  const sideBySide =
    Math.abs(a.y - b.y) < 1 && Math.abs(a.height - b.height) < 1;
  if (sideBySide) {
    const [first, second] = a.x <= b.x ? [a, b] : [b, a];
    const x = first.x + first.width;
    return {
      orientation: 'vertical',
      x,
      y: Math.min(a.y, b.y),
      width: Math.max(0, second.x - x),
      height: Math.max(a.height, b.height),
    };
  }
  const stacked = Math.abs(a.x - b.x) < 1 && Math.abs(a.width - b.width) < 1;
  if (stacked) {
    const [first, second] = a.y <= b.y ? [a, b] : [b, a];
    const y = first.y + first.height;
    return {
      orientation: 'horizontal',
      x: Math.min(a.x, b.x),
      y,
      width: Math.max(a.width, b.width),
      height: Math.max(0, second.y - y),
    };
  }
  return null;
}

/** Returns the current fold of the viewport, or null. */
export function getFold(win: Window = window): Fold | null {
  return foldFromSegments(getViewportSegments(win));
}

/**
 * Returns the fold relative to an element's box, or null when the fold does
 * not cross the element.
 *
 * @param fold The fold, in viewport coordinates.
 * @param rect The element's box (`getBoundingClientRect()`).
 * @param rtl Whether the element is right-to-left (a vertical fold's
 *     `start` is then measured from the right edge).
 */
export function foldWithin(
  fold: Fold | null,
  rect: SegmentRect,
  rtl = false,
): ElementFold | null {
  if (!fold) {
    return null;
  }
  if (fold.orientation === 'vertical') {
    const left = fold.x - rect.x;
    const right = rect.x + rect.width - (fold.x + fold.width);
    // The fold must lie inside the element, with room on both sides.
    if (left <= 0 || right <= 0) {
      return null;
    }
    return {
      orientation: 'vertical',
      start: rtl ? right : left,
      size: fold.width,
    };
  }
  const top = fold.y - rect.y;
  const bottom = rect.y + rect.height - (fold.y + fold.height);
  if (top <= 0 || bottom <= 0) {
    return null;
  }
  return {orientation: 'horizontal', start: top, size: fold.height};
}

/** Options for `observeFold()`. */
export interface ObserveFoldOptions {
  /** Stops observing when aborted. */
  signal?: AbortSignal;
  /** Whether to call the callback right away. Defaults to true. */
  initial?: boolean;
  /** The window to observe. Defaults to `window`. */
  window?: Window;
}

const sameFold = (a: Fold | null, b: Fold | null) =>
  a === b ||
  (!!a &&
    !!b &&
    a.orientation === b.orientation &&
    a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height);

/**
 * Calls `callback` whenever the viewport's fold appears, moves or goes away
 * (posture changes fire the segment media queries and `resize`).
 *
 * @return A function that stops observing.
 */
export function observeFold(
  callback: (fold: Fold | null) => void,
  {signal, initial = true, window: win = window}: ObserveFoldOptions = {},
): () => void {
  let current: Fold | null = initial ? null : getFold(win);
  let first = initial;
  const update = () => {
    const fold = getFold(win);
    if (!first && sameFold(fold, current)) {
      return;
    }
    first = false;
    current = fold;
    callback(fold);
  };
  const queries = [
    '(horizontal-viewport-segments: 2)',
    '(vertical-viewport-segments: 2)',
  ].map((query) => win.matchMedia(query));
  for (const query of queries) {
    query.addEventListener('change', update);
  }
  win.addEventListener('resize', update);
  simulationListeners.add(update);
  const stop = () => {
    for (const query of queries) {
      query.removeEventListener('change', update);
    }
    win.removeEventListener('resize', update);
    simulationListeners.delete(update);
  };
  if (signal) {
    if (signal.aborted) {
      stop();
      return stop;
    }
    signal.addEventListener('abort', stop, {once: true});
  }
  if (initial) {
    update();
  }
  return stop;
}
