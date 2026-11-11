/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {DragGesture} from '../../foundations/interaction/gestures/drag-gesture.js';
import {createClassMapDirective} from '../../components/shared/directives.js';

/**
 * Compose `PullToRefreshDefaults.PositionalThreshold` (80dp): how far the
 * indicator must be pulled before releasing it refreshes.
 */
export const PULL_TO_REFRESH_THRESHOLD_PX = 80;

/**
 * Compose `PullToRefresh.kt` `DragMultiplier`: the indicator moves half as far
 * as the pointer.
 */
export const PULL_TO_REFRESH_DRAG_MULTIPLIER = 0.5;

/** Pull to refresh classes constants. */
export const PULL_TO_REFRESH_CLASSES = {
  pullToRefresh: 'pull-to-refresh',
  /** The baseline circular arrow indicator instead of a loading indicator. */
  pullToRefreshCircular: 'pull-to-refresh-circular',
  /** The indicator follows the pointer (no transitions). */
  pullToRefreshPulling: 'pull-to-refresh-pulling',
  /** The indicator rests at the threshold while content refreshes. */
  pullToRefreshRefreshing: 'pull-to-refresh-refreshing',
  pullToRefreshDisabled: 'pull-to-refresh-disabled',
  /** The element that scrolls the content. */
  pullToRefreshScroller: 'pull-to-refresh-scroller',
  /** Set on the scroller while it is scrolled to the top. */
  pullToRefreshAtTop: 'pull-to-refresh-at-top',
  /** The indicator container, positioned at the top center. */
  pullToRefreshIndicator: 'pull-to-refresh-indicator',
} as const;

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
export function pullToRefreshClasses({
  indicator = 'loading',
  pulling = false,
  refreshing = false,
  disabled = false,
}: PullToRefreshClassesState = {}): ClassInfo {
  return {
    [PULL_TO_REFRESH_CLASSES.pullToRefresh]: true,
    [PULL_TO_REFRESH_CLASSES.pullToRefreshCircular]: indicator === 'circular',
    [PULL_TO_REFRESH_CLASSES.pullToRefreshPulling]: Boolean(pulling),
    [PULL_TO_REFRESH_CLASSES.pullToRefreshRefreshing]: Boolean(refreshing),
    [PULL_TO_REFRESH_CLASSES.pullToRefreshDisabled]: Boolean(disabled),
  };
}

/**
 * The indicator's offset for a pull, from Compose `calculateVerticalOffset()`:
 * it follows the (multiplied) pull up to the threshold, then slows down with
 * a non-linear tension, up to 3/2 of the threshold beyond it.
 *
 * @param pulled How far the pointer pulled (px).
 * @param threshold The positional threshold (px).
 * @return The indicator offset (px).
 */
export function pullToRefreshOffset(pulled: number, threshold: number): number {
  const adjusted = Math.max(0, pulled) * PULL_TO_REFRESH_DRAG_MULTIPLIER;
  if (adjusted <= threshold || threshold <= 0) {
    return adjusted;
  }
  // How far beyond the threshold, as a fraction of the threshold, limited to
  // 200% and eased.
  const overshoot = Math.min(2, Math.max(0, adjusted / threshold - 1));
  const tension = overshoot - overshoot ** 2 / 4;
  return threshold + threshold * tension;
}

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
export function pullToRefreshArrow(progress: number): PullToRefreshArrow {
  // Discard the first 40% of progress; scale the rest to 0..100%.
  const adjusted = (Math.max(Math.min(1, progress) - 0.4, 0) * 5) / 3;
  const overshoot = Math.min(2, Math.max(0, Math.abs(progress) - 1));
  const tension = overshoot - overshoot ** 2 / 4;
  const endTrim = adjusted * 0.8; // MaxProgressArc
  // Compose rotates the canvas by `rotation` degrees and draws the arc at
  // `rotation * 360` degrees.
  const rotation = (-0.25 + 0.4 * adjusted + tension) * 0.5;
  return {
    rotation,
    startAngle: rotation * 360,
    endAngle: (rotation + endTrim) * 360,
    scale: Math.min(1, adjusted),
    alpha: progress >= 1 ? 1 : 0.3,
  };
}

/** Whether a press is inside content that is scrolled away from its top. */
function isScrolledDown(event: Event): boolean {
  for (const target of event.composedPath()) {
    if (target instanceof Element && target.scrollTop > 0) {
      return true;
    }
  }
  return false;
}

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
export class PullToRefreshGesture {
  private readonly drag: DragGesture;
  private scroller: HTMLElement | null = null;
  private pulled = 0;

  constructor(
    target: HTMLElement,
    private readonly options: PullToRefreshGestureOptions,
  ) {
    this.drag = new DragGesture(target, {
      axis: 'y',
      canStart: (event) => options.enabled() && !isScrolledDown(event),
      shouldDrag: (delta, crossDelta) =>
        delta > 0 && Math.abs(delta) > Math.abs(crossDelta),
      onStart: () => {
        this.pulled = 0;
      },
      onMove: (delta) => {
        this.pulled = Math.max(0, delta);
        options.onPull(this.fraction());
      },
      onEnd: (delta) => {
        this.pulled = Math.max(0, delta);
        const refresh =
          this.pulled * PULL_TO_REFRESH_DRAG_MULTIPLIER > options.threshold();
        this.pulled = 0;
        options.onRelease(refresh);
      },
      onCancel: () => {
        this.pulled = 0;
        options.onRelease(false);
      },
    });
    this.syncScroller();
  }

  /** Re-reads the scroller (call after it is re-rendered). */
  syncScroller() {
    const scroller = this.options.scroller();
    if (scroller === this.scroller) {
      this.updateAtTop();
      return;
    }
    this.scroller?.removeEventListener('scroll', this.updateAtTop);
    this.scroller = scroller;
    scroller?.addEventListener('scroll', this.updateAtTop, {passive: true});
    this.updateAtTop();
  }

  /** Removes the listeners and cancels a pull in progress. */
  disconnect() {
    this.drag.disconnect();
    this.scroller?.removeEventListener('scroll', this.updateAtTop);
    this.scroller = null;
  }

  private fraction() {
    const threshold = this.options.threshold();
    return threshold > 0
      ? pullToRefreshOffset(this.pulled, threshold) / threshold
      : 0;
  }

  private readonly updateAtTop = () => {
    this.scroller?.classList.toggle(
      PULL_TO_REFRESH_CLASSES.pullToRefreshAtTop,
      this.scroller.scrollTop <= 0,
    );
  };
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
export function setupPullToRefresh(
  element: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  const {pullToRefreshPulling, pullToRefreshRefreshing, pullToRefreshDisabled} =
    PULL_TO_REFRESH_CLASSES;
  const gesture = new PullToRefreshGesture(element, {
    scroller: () =>
      element.querySelector<HTMLElement>(
        `.${PULL_TO_REFRESH_CLASSES.pullToRefreshScroller}`,
      ),
    threshold: () => PULL_TO_REFRESH_THRESHOLD_PX,
    enabled: () =>
      !element.classList.contains(pullToRefreshDisabled) &&
      !element.classList.contains(pullToRefreshRefreshing),
    onPull: (fraction) => {
      element.style.setProperty('--pull-to-refresh-fraction', String(fraction));
      element.classList.toggle(pullToRefreshPulling, fraction > 0);
    },
    onRelease: (refresh) => {
      element.style.removeProperty('--pull-to-refresh-fraction');
      element.classList.remove(pullToRefreshPulling);
      if (
        refresh &&
        element.dispatchEvent(new Event('refresh', {cancelable: true}))
      ) {
        element.classList.add(pullToRefreshRefreshing);
      }
    },
  });
  opts?.signal?.addEventListener('abort', () => {
    gesture.disconnect();
  });
}

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
export const pullToRefresh = createClassMapDirective<PullToRefreshClassesState>(
  {
    getClasses: pullToRefreshClasses,
    setupElement: setupPullToRefresh,
  },
);
