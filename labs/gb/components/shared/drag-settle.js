/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { readMotion } from './disclosure.js';
import { readSpring, Spring } from './spring.js';
import { DRAG_SLOP_PX, DragGesture, settleAnchor, } from './drag-gesture.js';
/** The anchor nearest to a position (`NaN` without anchors). */
export function nearestAnchor(anchors, position) {
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
export function resolveSettle(anchors, start, offset, velocity, options) {
    const sorted = [...new Set(anchors)].sort((a, b) => a - b);
    if (!sorted.length)
        return offset;
    const origin = nearestAnchor(sorted, start);
    const fast = velocity !== 0 && Math.abs(velocity) >= Math.abs(options.velocityThreshold);
    const pool = options.flingAnchors?.(sorted) ?? sorted;
    // A release beyond the anchors a fling may reach is decided by the drag
    // alone: a fling doesn't carry on to the anchors it may not settle on.
    const inReach = pool.length > 0 && offset >= Math.min(...pool) && offset <= Math.max(...pool);
    if (fast && inReach)
        return settleAnchor(pool, origin, offset, velocity, options);
    let from = origin;
    for (let i = 0; i < sorted.length; i++) {
        const next = settleAnchor(sorted, from, offset, 0, options);
        if (next === from)
            return from;
        const beyond = (offset - next) * (next - from) > 0;
        from = next;
        if (!beyond)
            break;
    }
    return from;
}
/**
 * A Lit controller that turns a pointer drag along one axis into a position
 * between anchors, and settles it on release.
 */
export class DragSettleController {
    constructor(host, options) {
        this.host = host;
        this.options = options;
        this.gesture = null;
        this.boundTarget = null;
        this.position = 0;
        this.origin = 0;
        this.sign = 1;
        this.consumed = null;
        this._dragging = false;
        this._settling = false;
        this.spring = null;
        this.springAnchor = 0;
        this.restWaiters = [];
        host.addController(this);
    }
    /** Whether a drag is in progress. */
    get dragging() {
        return this._dragging;
    }
    /** Whether the surface is settling (the settle motion hasn't ended). */
    get settling() {
        return this._settling;
    }
    /**
     * Resolves when the settle motion has ended (at once when it isn't
     * settling, and when a new drag grabs it or the host disconnects). A surface
     * that closes on release waits for this before it is taken off screen, so
     * the spring is not cut short.
     */
    whenSettled() {
        if (!this._settling)
            return Promise.resolve();
        return new Promise((resolve) => this.restWaiters.push(resolve));
    }
    /** The surface's position during a drag, else its last settled one. */
    get offset() {
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
    step(direction) {
        const here = this.options.value();
        const sorted = [...new Set(this.options.anchors())].sort((a, b) => a - b);
        const next = direction > 0 ? sorted.find((a) => a > here) : [...sorted].reverse().find((a) => a < here);
        if (next === undefined)
            return false;
        this.settle(next, { from: here, offset: here, velocity: 0, source: 'step' });
        return true;
    }
    /**
     * Single-pointer alternative: settles at the next anchor, wrapping from the
     * last one to the first (a drag handle that cycles through its widths).
     */
    cycle() {
        const here = this.options.value();
        const sorted = [...new Set(this.options.anchors())].sort((a, b) => a - b);
        if (!sorted.length)
            return;
        const next = sorted.find((a) => a > here) ?? sorted[0];
        this.settle(next, { from: here, offset: here, velocity: 0, source: 'step' });
    }
    /** Settles at a given position, through the same path as a release. */
    settleTo(anchor) {
        const here = this.options.value();
        this.settle(anchor, { from: here, offset: here, velocity: 0, source: 'api' });
    }
    bind() {
        const target = this.options.target();
        if (target === this.boundTarget)
            return;
        this.unbind();
        this.boundTarget = target;
        if (!target)
            return;
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
    unbind() {
        this.gesture?.disconnect();
        this.gesture = null;
        this.boundTarget = null;
    }
    start() {
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
    move(delta) {
        const o = this.options;
        if (this.consumed === null) {
            const slop = o.slop ?? DRAG_SLOP_PX;
            this.consumed = o.consumeSlop ? Math.sign(delta) * Math.min(Math.abs(delta), slop) : 0;
        }
        const sorted = o.anchors();
        const { min, max } = o.bounds?.() ?? { min: Math.min(...sorted), max: Math.max(...sorted) };
        const raw = this.origin + (delta - this.consumed) * this.sign;
        this.position = sorted.length || o.bounds ? Math.min(max, Math.max(min, raw)) : raw;
        o.onDrag?.(this.position);
    }
    end(delta, gestureVelocity) {
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
        this.settle(target, { from: this.origin, offset: this.position, velocity, source: 'drag' });
    }
    cancelled() {
        this._dragging = false;
        this.position = this.origin;
        this.options.onCancel?.(this.origin);
        this.host.requestUpdate();
    }
    settle(anchor, info) {
        clearTimeout(this.timer);
        this._dragging = false;
        const flying = this.spring?.running ?? false;
        // A settle in flight carries on from its own position and velocity.
        const from = flying ? this.spring.position : info.offset;
        const velocity = flying ? this.spring.velocity : info.velocity;
        this.position = anchor;
        this.options.onSettle(anchor, info);
        const { duration } = this.motion();
        if (this.options.onFrame) {
            this.springTo(anchor, from, velocity, flying, duration === 0);
        }
        else if (duration > 0) {
            this._settling = true;
            this.timer = setTimeout(() => this.settled(anchor), duration);
        }
        else {
            this._settling = false;
            this.settled(anchor);
        }
        this.host.requestUpdate();
    }
    /** Runs the settle as a spring from the release position and velocity. */
    springTo(anchor, from, velocity, flying, reduced) {
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
        if (flying)
            spring.retarget(anchor);
        else
            spring.start(from, anchor, velocity);
        this.host.requestUpdate();
    }
    flushWaiters() {
        const waiters = this.restWaiters;
        this.restWaiters = [];
        for (const resolve of waiters)
            resolve();
    }
    settled(anchor) {
        this._settling = false;
        this.flushWaiters();
        this.options.onSettled?.(anchor);
        this.host.requestUpdate();
    }
}
//# sourceMappingURL=drag-settle.js.map