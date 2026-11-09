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
export const DRAG_SLOP_PX = 8;
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
export function settleAnchor(anchors, start, offset, velocity, { positionalThreshold = (distance) => distance / 2, velocityThreshold, }) {
    const sorted = [...anchors].sort((a, b) => a - b);
    if (!sorted.length) {
        return offset;
    }
    const next = (from, forward) => forward
        ? (sorted.find((a) => a > from) ?? sorted[sorted.length - 1])
        : ([...sorted].reverse().find((a) => a < from) ?? sorted[0]);
    if (Math.abs(velocity) >= Math.abs(velocityThreshold) && velocity !== 0) {
        return next(offset, velocity > 0);
    }
    if (offset === start) {
        return start;
    }
    const neighbor = next(start, offset > start);
    const distance = Math.abs(neighbor - start);
    const travelled = Math.abs(offset - start);
    return travelled > Math.abs(positionalThreshold(distance)) ? neighbor : start;
}
/** Tracks the velocity of a pointer along one axis, in px/s. */
export class VelocityTracker {
    /** Samples older than this (ms) before the latest do not count. */
    constructor(windowMs = 100) {
        this.windowMs = windowMs;
        this.samples = [];
    }
    /** Adds a position sample at a time (ms, e.g. `event.timeStamp`). */
    add(position, time) {
        this.samples.push({ position, time });
        const cutoff = time - this.windowMs;
        while (this.samples.length > 2 && this.samples[0].time < cutoff) {
            this.samples.shift();
        }
    }
    /** The velocity over the recent samples, in px/s (0 without samples). */
    get velocity() {
        const first = this.samples[0];
        const last = this.samples[this.samples.length - 1];
        if (!first || first === last) {
            return 0;
        }
        // Samples in the same millisecond count as 1ms apart.
        const dt = Math.max(1, last.time - first.time);
        return ((last.position - first.position) / dt) * 1000;
    }
    /** Clears the samples. */
    reset() {
        this.samples = [];
    }
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
export class DragGesture {
    /** Whether a drag is in progress. */
    get dragging() {
        return Boolean(this.pointer?.dragging);
    }
    constructor(target, options) {
        this.target = target;
        this.options = options;
        this.pointer = null;
        this.tracker = new VelocityTracker();
        this.suppressClick = false;
        this.handlePointerDown = (event) => {
            if (this.pointer ||
                !event.isPrimary ||
                (event.pointerType === 'mouse' && event.button !== 0) ||
                (this.options.canStart && !this.options.canStart(event))) {
                return;
            }
            this.suppressClick = false;
            this.pointer = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                dragging: false,
                held: false,
            };
            const hold = this.options.longPress;
            if (hold !== undefined) {
                const pointer = this.pointer;
                pointer.timer = globalThis.setTimeout(() => {
                    if (this.pointer !== pointer)
                        return;
                    pointer.held = true;
                    this.options.onLongPress?.(event);
                }, hold);
            }
            this.tracker.reset();
            this.tracker.add(this.position(event), event.timeStamp);
            // Track the pointer on the window: a fast drag leaves the target before
            // the slop is reached and pointer capture starts.
            for (const [type, listener] of this.windowListeners) {
                window.addEventListener(type, listener, true);
            }
        };
        this.handlePointerMove = (event) => {
            const pointer = this.pointer;
            if (!pointer || event.pointerId !== pointer.pointerId) {
                return;
            }
            const { delta, crossDelta } = this.deltas(event);
            this.tracker.add(this.position(event), event.timeStamp);
            if (!pointer.dragging) {
                const slop = this.options.slop ?? DRAG_SLOP_PX;
                const travel = Math.hypot(delta, crossDelta);
                const waiting = this.options.longPress !== undefined && !pointer.held;
                if (pointer.held) {
                    // Held: any movement picks the item up.
                    if (travel < 1)
                        return;
                }
                else if (travel < slop) {
                    return;
                }
                const shouldDrag = waiting
                    ? false
                    : pointer.held ||
                        (this.options.shouldDrag
                            ? this.options.shouldDrag(delta, crossDelta, event)
                            : Math.abs(delta) > Math.abs(crossDelta));
                if (!shouldDrag) {
                    this.end();
                    return;
                }
                pointer.dragging = true;
                // Capture only once dragging, so a tap still clicks its target.
                try {
                    (this.options.captureTarget?.() ?? this.target).setPointerCapture(event.pointerId);
                }
                catch {
                    // The pointer is no longer active (or is synthetic).
                }
                this.options.onStart?.(event);
            }
            // A mouse press that turns into a drag must not select text on the way.
            const selection = this.target.ownerDocument.getSelection();
            if (selection && !selection.isCollapsed) {
                selection.removeAllRanges();
            }
            this.options.onMove?.(delta, event);
        };
        this.handlePointerUp = (event) => {
            const pointer = this.pointer;
            if (!pointer || event.pointerId !== pointer.pointerId) {
                return;
            }
            if (!pointer.dragging) {
                const held = pointer.held;
                this.end();
                if (held) {
                    // A held press that never moved: keep the click from activating.
                    this.suppressClick = true;
                    globalThis.setTimeout(() => {
                        this.suppressClick = false;
                    });
                    this.options.onCancel?.();
                }
                return;
            }
            const { delta } = this.deltas(event);
            this.tracker.add(this.position(event), event.timeStamp);
            const velocity = this.tracker.velocity;
            // The click that follows a drag must not activate what is under it.
            this.suppressClick = true;
            globalThis.setTimeout(() => {
                this.suppressClick = false;
            });
            this.end();
            this.options.onEnd?.(delta, velocity, event);
        };
        this.handlePointerCancel = (event) => {
            if (this.pointer && event.pointerId === this.pointer.pointerId) {
                this.cancel();
            }
        };
        this.handleClick = (event) => {
            if (this.suppressClick) {
                this.suppressClick = false;
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        };
        this.windowListeners = [
            ['pointermove', this.handlePointerMove],
            ['pointerup', this.handlePointerUp],
            ['pointercancel', this.handlePointerCancel],
        ];
        target.addEventListener('pointerdown', this.handlePointerDown);
        target.addEventListener('click', this.handleClick, true);
    }
    /** Removes the listeners and cancels a drag in progress. */
    disconnect() {
        this.cancel();
        this.target.removeEventListener('pointerdown', this.handlePointerDown);
        this.target.removeEventListener('click', this.handleClick, true);
    }
    /** Cancels a drag in progress. */
    cancel() {
        const wasActive = this.dragging || Boolean(this.pointer?.held);
        this.end();
        if (wasActive) {
            this.options.onCancel?.();
        }
    }
    position(event) {
        return this.options.axis === 'x' ? event.clientX : event.clientY;
    }
    deltas(event) {
        const pointer = this.pointer;
        const dx = event.clientX - pointer.startX;
        const dy = event.clientY - pointer.startY;
        return this.options.axis === 'x'
            ? { delta: dx, crossDelta: dy }
            : { delta: dy, crossDelta: dx };
    }
    end() {
        clearTimeout(this.pointer?.timer);
        for (const [type, listener] of this.windowListeners) {
            window.removeEventListener(type, listener, true);
        }
        this.pointer = null;
    }
}
//# sourceMappingURL=drag-gesture.js.map