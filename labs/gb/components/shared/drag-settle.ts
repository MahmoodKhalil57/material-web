/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ReactiveController, type ReactiveControllerHost} from 'lit';

import {readMotion} from './disclosure.js';
import {readSpring, Spring} from './spring.js';
import {
  DRAG_SLOP_PX,
  DragGesture,
  type DragAxis,
  settleAnchor,
  type SettleAnchorOptions,
} from './drag-gesture.js';

/**
 * Shared "drag a surface between anchors, settle with a spring on release"
 * behavior: swipe-to-reveal list items, the scaffold's pane drag handle, and
 * (as they adopt it) sheets, drawers, rails and tab panels.
 *
 * - The drag follows the pointer along one axis, clamped to the anchors, and
 *   mirrors in right-to-left layouts (a drag toward the inline end is
 *   positive in both directions).
 * - On release the surface settles at an anchor like Compose's
 *   `AnchoredDraggableState`: a fling faster than the velocity threshold goes
 *   to the next anchor in its direction; a slower release goes to the next
 *   anchor once past the positional threshold, or back to where it started.
 *   A slow drag that passes several anchors can settle on a later one.
 * - A cancelled drag (`pointercancel`, disconnect, `cancel()`) returns to
 *   where it started.
 * - The settle motion takes its duration from the motion tokens and has none
 *   under reduced motion; `onSettled` marks its end.
 * - `step()`, `cycle()` and `settleTo()` are the single-pointer alternative
 *   to dragging (WCAG 2.5.7): they settle through the same path as a release.
 *
 * Spec: foundations/interaction/gestures.md (drag and swipe respond in real
 * time), lists.md (swipe to reveal and its alternative), scaffold.md (drag
 * handles snap to widths, and toggle when selected), bidirectionality-rtl.md
 * (swipes mirror).
 */

/** What caused a settle. */
export type DragSettleSource = 'drag' | 'step' | 'api';

/** Details of a settle. */
export interface DragSettleInfo {
  /** The position the surface started from (the drag's origin). */
  from: number;
  /** The position at release (before settling). */
  offset: number;
  /** The release velocity in px/s, in logical direction (0 without a drag). */
  velocity: number;
  /** What caused the settle. */
  source: DragSettleSource;
}

/** Options of {@link resolveSettle}. */
export interface ResolveSettleOptions extends SettleAnchorOptions {
  /**
   * The anchors a fling may settle on (default all). A fling can then stop
   * short of anchors that need a deliberate drag, such as a swipe that
   * triggers an action.
   */
  flingAnchors?: (anchors: number[]) => number[];
}

/** The anchor nearest to a position (`NaN` without anchors). */
export function nearestAnchor(anchors: readonly number[], position: number): number {
  let best = NaN;
  for (const anchor of anchors) {
    if (Number.isNaN(best) || Math.abs(anchor - position) < Math.abs(best - position)) {
      best = anchor;
    }
  }
  return best;
}

/**
 * Picks the anchor a released drag settles at: like {@link settleAnchor}, but
 * a slow drag that has passed several anchors keeps going while it is past
 * the positional threshold of the next one.
 *
 * @param anchors The anchor positions (any order).
 * @param start The position the drag started at (snapped to its nearest anchor).
 * @param offset The position at release.
 * @param velocity The release velocity in px/s along the same axis.
 * @param options The thresholds; `flingAnchors` limits where a fling lands,
 *     and a release past them falls back to the positional threshold.
 */
export function resolveSettle(
  anchors: readonly number[],
  start: number,
  offset: number,
  velocity: number,
  options: ResolveSettleOptions,
): number {
  const sorted = [...new Set(anchors)].sort((a, b) => a - b);
  if (!sorted.length) return offset;
  const origin = nearestAnchor(sorted, start);
  const fast = velocity !== 0 && Math.abs(velocity) >= Math.abs(options.velocityThreshold);
  const pool = options.flingAnchors?.(sorted) ?? sorted;
  // A release beyond the anchors a fling may reach is decided by the drag
  // alone: a fling doesn't carry on to the anchors it may not settle on.
  const inReach = pool.length > 0 && offset >= Math.min(...pool) && offset <= Math.max(...pool);
  if (fast && inReach) return settleAnchor(pool, origin, offset, velocity, options);
  let from = origin;
  for (let i = 0; i < sorted.length; i++) {
    const next = settleAnchor(sorted, from, offset, 0, options);
    if (next === from) return from;
    const beyond = (offset - next) * (next - from) > 0;
    from = next;
    if (!beyond) break;
  }
  return from;
}

/** Options of {@link DragSettleController}. */
export interface DragSettleOptions {
  /** The axis to drag along. */
  axis: DragAxis;
  /** The element that is pressed to drag. */
  target: () => HTMLElement | null;
  /** The positions the surface can settle at (px, in logical direction). */
  anchors: () => readonly number[];
  /** The surface's settled position when a drag starts. */
  value: () => number;
  /** The release velocity (px/s) above which a fling goes to the next anchor. */
  velocityThreshold: number;
  /** How far past an anchor a release must be to reach the next one. Default half. */
  positionalThreshold?: (distance: number) => number;
  /** The anchors a fling may settle on. See {@link ResolveSettleOptions}. */
  flingAnchors?: (anchors: number[]) => number[];
  /** The range the drag is clamped to. Default the first and last anchor. */
  bounds?: () => {min: number; max: number};
  /**
   * Whether the logical direction is the reverse of the pointer's. Default:
   * right-to-left for the `x` axis, never for `y`.
   */
  reverse?: () => boolean;
  /** Whether dragging is off. */
  disabled?: () => boolean;
  /** Pointer travel before a press becomes a drag. */
  slop?: number;
  /**
   * Whether the travel up to the slop is dropped, so the surface starts
   * moving from where the press became a drag instead of jumping by the slop.
   */
  consumeSlop?: boolean;
  /** Called on a press; return false to ignore it. */
  canStart?: (event: PointerEvent) => boolean;
  /** See `DragGestureOptions.shouldDrag`. */
  shouldDrag?: (delta: number, crossDelta: number, event: PointerEvent) => boolean;
  /** See `DragGestureOptions.captureTarget`. */
  captureTarget?: () => Element | null;
  /** The spring of the settle motion. Default `default-spatial`. */
  spring?: string;
  /** Called when the press became a drag. */
  onDragStart?: (from: number) => void;
  /** Called on every move of a drag with the clamped position. */
  onDrag?: (offset: number) => void;
  /**
   * Called on every frame of the settle with the surface's position and
   * velocity (px and px/s, logical direction). When set, the settle is a
   * spring solved by the controller: it starts at the release position with
   * the release velocity and is retargeted, keeping its velocity, when
   * another settle starts mid-flight. The surface should follow these frames
   * (with no CSS transition on the moved property) and `onSettled` fires
   * when the spring rests. Without it the settle is the spring's CSS
   * transition and `onSettled` fires after the token's duration.
   */
  onFrame?: (position: number, velocity: number) => void;
  /** Called when the surface settles at an anchor: apply the position now. */
  onSettle: (anchor: number, info: DragSettleInfo) => void;
  /** Called when a drag is cancelled, with the position it returns to. */
  onCancel?: (to: number) => void;
  /** Called when the settle motion ends (at once under reduced motion). */
  onSettled?: (anchor: number) => void;
}

/**
 * A Lit controller that turns a pointer drag along one axis into a position
 * between anchors, and settles it on release.
 */
export class DragSettleController implements ReactiveController {
  private gesture: DragGesture | null = null;
  private boundTarget: HTMLElement | null = null;
  private position = 0;
  private origin = 0;
  private sign: 1 | -1 = 1;
  private consumed: number | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private _dragging = false;
  private _settling = false;
  private spring: Spring | null = null;
  private springAnchor = 0;
  private restWaiters: Array<() => void> = [];

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly options: DragSettleOptions,
  ) {
    host.addController(this);
  }

  /** Whether a drag is in progress. */
  get dragging(): boolean {
    return this._dragging;
  }

  /** Whether the surface is settling (the settle motion hasn't ended). */
  get settling(): boolean {
    return this._settling;
  }

  /**
   * Resolves when the settle motion has ended (at once when it isn't
   * settling, and when a new drag grabs it or the host disconnects). A surface
   * that closes on release waits for this before it is taken off screen, so
   * the spring is not cut short.
   */
  whenSettled(): Promise<void> {
    if (!this._settling) return Promise.resolve();
    return new Promise((resolve) => this.restWaiters.push(resolve));
  }

  /** The surface's position during a drag, else its last settled one. */
  get offset(): number {
    return this._dragging || this._settling ? this.position : this.options.value();
  }

  /** The timing of the settle motion (no duration under reduced motion). */
  motion() {
    return readMotion(this.options.target() ?? this.host, this.options.spring);
  }

  hostConnected() {
    this.bind();
  }

  hostDisconnected() {
    this.unbind();
    clearTimeout(this.timer);
    this.spring?.stop();
    this._settling = false;
    this.flushWaiters();
  }

  hostUpdated() {
    this.bind();
  }

  /** Cancels a drag in progress; the surface returns to where it started. */
  cancel() {
    this.gesture?.cancel();
  }

  /**
   * Single-pointer alternative: settles at the next anchor before (`-1`) or
   * after (`1`) the current position.
   *
   * @return Whether there was such an anchor.
   */
  step(direction: 1 | -1): boolean {
    const here = this.options.value();
    const sorted = [...new Set(this.options.anchors())].sort((a, b) => a - b);
    const next = direction > 0 ? sorted.find((a) => a > here) : [...sorted].reverse().find((a) => a < here);
    if (next === undefined) return false;
    this.settle(next, {from: here, offset: here, velocity: 0, source: 'step'});
    return true;
  }

  /**
   * Single-pointer alternative: settles at the next anchor, wrapping from the
   * last one to the first (a drag handle that cycles through its widths).
   */
  cycle(): void {
    const here = this.options.value();
    const sorted = [...new Set(this.options.anchors())].sort((a, b) => a - b);
    if (!sorted.length) return;
    const next = sorted.find((a) => a > here) ?? sorted[0];
    this.settle(next, {from: here, offset: here, velocity: 0, source: 'step'});
  }

  /** Settles at a given position, through the same path as a release. */
  settleTo(anchor: number): void {
    const here = this.options.value();
    this.settle(anchor, {from: here, offset: here, velocity: 0, source: 'api'});
  }

  private bind() {
    const target = this.options.target();
    if (target === this.boundTarget) return;
    this.unbind();
    this.boundTarget = target;
    if (!target) return;
    const o = this.options;
    this.gesture = new DragGesture(target, {
      axis: o.axis,
      slop: o.slop,
      canStart: (event) => !o.disabled?.() && (o.canStart?.(event) ?? true),
      shouldDrag: o.shouldDrag,
      captureTarget: o.captureTarget,
      onStart: () => this.start(),
      onMove: (delta) => this.move(delta),
      onEnd: (delta, velocity) => this.end(delta, velocity),
      onCancel: () => this.cancelled(),
    });
  }

  private unbind() {
    this.gesture?.disconnect();
    this.gesture = null;
    this.boundTarget = null;
  }

  private start() {
    const o = this.options;
    clearTimeout(this.timer);
    // A drag grabs a spring in flight where it is.
    const flying = this.spring?.running ?? false;
    this.spring?.stop();
    this._settling = false;
    this.flushWaiters();
    this._dragging = true;
    this.origin = flying ? this.position : o.value();
    this.position = this.origin;
    this.consumed = null;
    const reverse = o.reverse ? o.reverse() : o.axis === 'x' && getComputedStyle(this.host).direction === 'rtl';
    this.sign = reverse ? -1 : 1;
    o.onDragStart?.(this.origin);
    this.host.requestUpdate();
  }

  private move(delta: number) {
    const o = this.options;
    if (this.consumed === null) {
      const slop = o.slop ?? DRAG_SLOP_PX;
      this.consumed = o.consumeSlop ? Math.sign(delta) * Math.min(Math.abs(delta), slop) : 0;
    }
    const sorted = o.anchors();
    const {min, max} = o.bounds?.() ?? {min: Math.min(...sorted), max: Math.max(...sorted)};
    const raw = this.origin + (delta - this.consumed) * this.sign;
    this.position = sorted.length || o.bounds ? Math.min(max, Math.max(min, raw)) : raw;
    o.onDrag?.(this.position);
  }

  private end(delta: number, gestureVelocity: number) {
    const o = this.options;
    // The release itself can have moved the pointer since the last move.
    this.move(delta);
    const velocity = gestureVelocity * this.sign;
    this._dragging = false;
    const target = resolveSettle(o.anchors(), this.origin, this.position, velocity, {
      velocityThreshold: o.velocityThreshold,
      positionalThreshold: o.positionalThreshold,
      flingAnchors: o.flingAnchors,
    });
    this.settle(target, {from: this.origin, offset: this.position, velocity, source: 'drag'});
  }

  private cancelled() {
    this._dragging = false;
    this.position = this.origin;
    this.options.onCancel?.(this.origin);
    this.host.requestUpdate();
  }

  private settle(anchor: number, info: DragSettleInfo) {
    clearTimeout(this.timer);
    this._dragging = false;
    const flying = this.spring?.running ?? false;
    // A settle in flight carries on from its own position and velocity.
    const from = flying ? this.spring!.position : info.offset;
    const velocity = flying ? this.spring!.velocity : info.velocity;
    this.position = anchor;
    this.options.onSettle(anchor, info);
    const {duration} = this.motion();
    if (this.options.onFrame) {
      this.springTo(anchor, from, velocity, flying, duration === 0);
    } else if (duration > 0) {
      this._settling = true;
      this.timer = setTimeout(() => this.settled(anchor), duration);
    } else {
      this._settling = false;
      this.settled(anchor);
    }
    this.host.requestUpdate();
  }

  /** Runs the settle as a spring from the release position and velocity. */
  private springTo(anchor: number, from: number, velocity: number, flying: boolean, reduced: boolean) {
    const o = this.options;
    const spring = (this.spring ??= new Spring({
      reduced: () => this.motion().reduced,
      onFrame: (position, speed) => {
        this.position = position;
        o.onFrame?.(position, speed);
        this.host.requestUpdate();
      },
      onRest: () => this.settled(this.springAnchor),
    }));
    spring.spec = readSpring(this.options.target() ?? this.host, o.spring);
    this.springAnchor = anchor;
    this._settling = !reduced;
    // Under reduced motion the spring jumps to the anchor and rests.
    if (flying) spring.retarget(anchor);
    else spring.start(from, anchor, velocity);
    this.host.requestUpdate();
  }

  private flushWaiters() {
    const waiters = this.restWaiters;
    this.restWaiters = [];
    for (const resolve of waiters) resolve();
  }

  private settled(anchor: number) {
    this._settling = false;
    this.flushWaiters();
    this.options.onSettled?.(anchor);
    this.host.requestUpdate();
  }
}
