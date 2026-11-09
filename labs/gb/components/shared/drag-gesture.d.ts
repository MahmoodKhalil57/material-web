/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Pointer travel before a press becomes a drag (Android
 * `ViewConfiguration.getScaledTouchSlop()`, 8dp, which Compose's draggable
 * modifiers use as the touch slop).
 */
export declare const DRAG_SLOP_PX = 8;
/** The axis a drag gesture tracks. */
export type DragAxis = 'x' | 'y';
/** Options of `settleAnchor()`, after Compose `AnchoredDraggableState`. */
export interface SettleAnchorOptions {
    /**
     * How far past its start anchor a released drag must be, given the
     * distance to the next anchor, to settle at that anchor. Defaults to half
     * the distance.
     */
    positionalThreshold?: (distance: number) => number;
    /**
     * The release velocity (px/s) above which a fling settles at the next
     * anchor in its direction, however far it was dragged.
     */
    velocityThreshold: number;
}
/**
 * Picks the anchor a released drag settles at, like Compose's
 * `AnchoredDraggableState`: a fling faster than the velocity threshold
 * settles at the next anchor in the fling's direction; otherwise the drag
 * settles at the next anchor once dragged past the positional threshold
 * between its start anchor and that anchor, or returns to its start anchor.
 *
 * @param anchors The anchor positions (any order).
 * @param start The anchor the drag started at.
 * @param offset The position at release.
 * @param velocity The release velocity, in px/s along the same axis.
 * @param options The thresholds.
 * @return The anchor to settle at.
 */
export declare function settleAnchor(anchors: readonly number[], start: number, offset: number, velocity: number, { positionalThreshold, velocityThreshold, }: SettleAnchorOptions): number;
/** Tracks the velocity of a pointer along one axis, in px/s. */
export declare class VelocityTracker {
    private readonly windowMs;
    private samples;
    /** Samples older than this (ms) before the latest do not count. */
    constructor(windowMs?: number);
    /** Adds a position sample at a time (ms, e.g. `event.timeStamp`). */
    add(position: number, time: number): void;
    /** The velocity over the recent samples, in px/s (0 without samples). */
    get velocity(): number;
    /** Clears the samples. */
    reset(): void;
}
/** Callbacks and options of a `DragGesture`. */
export interface DragGestureOptions {
    /** The axis to track. */
    axis: DragAxis;
    /** Pointer travel before a press becomes a drag. */
    slop?: number;
    /**
     * Called on `pointerdown`. Return false to ignore the press (for example
     * when the component is disabled).
     */
    canStart?: (event: PointerEvent) => boolean;
    /**
     * Called once the pointer moved past the slop, with the travel along the
     * axis and across it. Return false to give the gesture up (for example a
     * press that scrolls instead). Defaults to dragging when the travel along
     * the axis is larger than across it.
     */
    shouldDrag?: (delta: number, crossDelta: number, event: PointerEvent) => boolean;
    /**
     * Hold time (ms) before a press can become a drag ("long press and drag").
     * Moving past the slop before the hold ends the gesture (the page scrolls
     * instead). Once held, `onLongPress` is called and any movement starts the
     * drag, whatever its direction; a release without movement calls
     * `onCancel`.
     */
    longPress?: number;
    /** Called when a press was held for `longPress` ms. */
    onLongPress?: (event: PointerEvent) => void;
    /** Called when the drag starts. */
    onStart?: (event: PointerEvent) => void;
    /** Called on every move while dragging, with the travel since the press. */
    onMove?: (delta: number, event: PointerEvent) => void;
    /** Called on release, with the travel and the release velocity (px/s). */
    onEnd?: (delta: number, velocity: number, event: PointerEvent) => void;
    /** Called when the drag is cancelled (`pointercancel`, `disconnect()`). */
    onCancel?: () => void;
    /** Element to capture the pointer with. Defaults to the target. */
    captureTarget?: () => Element | null;
}
/**
 * A one-axis pointer drag on an element: a press that moves past the drag
 * slop becomes a drag, the pointer is then captured, and the release reports
 * its travel and velocity. The click that follows a drag is suppressed, so a
 * drag over a button or link does not activate it.
 *
 * Touch dragging needs `touch-action` on the target to leave the axis to
 * the page (e.g. `pan-y` for an `x` drag), or the browser cancels the
 * pointer to scroll.
 */
export declare class DragGesture {
    private readonly target;
    private readonly options;
    private pointer;
    private readonly tracker;
    private suppressClick;
    /** Whether a drag is in progress. */
    get dragging(): boolean;
    constructor(target: HTMLElement, options: DragGestureOptions);
    /** Removes the listeners and cancels a drag in progress. */
    disconnect(): void;
    /** Cancels a drag in progress. */
    cancel(): void;
    private readonly handlePointerDown;
    private readonly handlePointerMove;
    private readonly handlePointerUp;
    private readonly handlePointerCancel;
    private readonly handleClick;
    private readonly windowListeners;
    private position;
    private deltas;
    private end;
}
