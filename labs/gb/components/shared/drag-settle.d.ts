/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
import { type DragAxis, type SettleAnchorOptions } from './drag-gesture.js';
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
export declare function nearestAnchor(anchors: readonly number[], position: number): number;
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
export declare function resolveSettle(anchors: readonly number[], start: number, offset: number, velocity: number, options: ResolveSettleOptions): number;
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
    bounds?: () => {
        min: number;
        max: number;
    };
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
export declare class DragSettleController implements ReactiveController {
    private readonly host;
    private readonly options;
    private gesture;
    private boundTarget;
    private position;
    private origin;
    private sign;
    private consumed;
    private timer;
    private _dragging;
    private _settling;
    private spring;
    private springAnchor;
    private restWaiters;
    constructor(host: ReactiveControllerHost & HTMLElement, options: DragSettleOptions);
    /** Whether a drag is in progress. */
    get dragging(): boolean;
    /** Whether the surface is settling (the settle motion hasn't ended). */
    get settling(): boolean;
    /**
     * Resolves when the settle motion has ended (at once when it isn't
     * settling, and when a new drag grabs it or the host disconnects). A surface
     * that closes on release waits for this before it is taken off screen, so
     * the spring is not cut short.
     */
    whenSettled(): Promise<void>;
    /** The surface's position during a drag, else its last settled one. */
    get offset(): number;
    /** The timing of the settle motion (no duration under reduced motion). */
    motion(): import("./disclosure.js").MotionTiming;
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdated(): void;
    /** Cancels a drag in progress; the surface returns to where it started. */
    cancel(): void;
    /**
     * Single-pointer alternative: settles at the next anchor before (`-1`) or
     * after (`1`) the current position.
     *
     * @return Whether there was such an anchor.
     */
    step(direction: 1 | -1): boolean;
    /**
     * Single-pointer alternative: settles at the next anchor, wrapping from the
     * last one to the first (a drag handle that cycles through its widths).
     */
    cycle(): void;
    /** Settles at a given position, through the same path as a release. */
    settleTo(anchor: number): void;
    private bind;
    private unbind;
    private start;
    private move;
    private end;
    private cancelled;
    private settle;
    /** Runs the settle as a spring from the release position and velocity. */
    private springTo;
    private flushWaiters;
    private settled;
}
