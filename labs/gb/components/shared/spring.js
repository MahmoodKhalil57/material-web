/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { parseTime, prefersReducedMotion } from './disclosure.js';
/** The Expressive scheme's springs (`md.sys.motion.spring.*`). */
export const EXPRESSIVE_SPRINGS = {
    'fast-spatial': { damping: 0.6, stiffness: 800 },
    'default-spatial': { damping: 0.8, stiffness: 380 },
    'slow-spatial': { damping: 0.8, stiffness: 200 },
    'fast-effects': { damping: 1, stiffness: 3800 },
    'default-effects': { damping: 1, stiffness: 1600 },
    'slow-effects': { damping: 1, stiffness: 800 },
};
/** The Standard scheme's springs: the spatial ones barely overshoot. */
export const STANDARD_SPRINGS = {
    ...EXPRESSIVE_SPRINGS,
    'fast-spatial': { damping: 0.9, stiffness: 1400 },
    'default-spatial': { damping: 0.9, stiffness: 700 },
    'slow-spatial': { damping: 0.9, stiffness: 300 },
};
/** The Expressive durations (ms) of the spatial springs, to tell the schemes apart. */
const EXPRESSIVE_SPATIAL_DURATIONS = {
    'fast-spatial': 350,
    'default-spatial': 420,
    'slow-spatial': 570,
};
/** The Standard durations (ms) of the spatial springs. */
const STANDARD_SPATIAL_DURATIONS = {
    'fast-spatial': 160,
    'default-spatial': 220,
    'slow-spatial': 340,
};
const DEFAULT_SPEC = EXPRESSIVE_SPRINGS['default-spatial'];
/**
 * Reads a spring from the motion tokens in the context of an element: its
 * damping and stiffness. The tokens carry a spring's easing and duration, so
 * the scheme (Expressive or Standard) is told from the duration; an
 * unknown name falls back to `default-spatial`.
 *
 * @param element The element whose tokens apply.
 * @param name The spring token name. Default `default-spatial`.
 */
export function readSpring(element, name = 'default-spatial') {
    const expressive = EXPRESSIVE_SPRINGS[name];
    if (!expressive)
        return DEFAULT_SPEC;
    const expressiveDuration = EXPRESSIVE_SPATIAL_DURATIONS[name];
    if (expressiveDuration === undefined)
        return expressive;
    const duration = parseTime(getComputedStyle(element).getPropertyValue(`--md-sys-motion-spring-${name}-duration`));
    if (Number.isNaN(duration))
        return expressive;
    const standardDuration = STANDARD_SPATIAL_DURATIONS[name];
    return Math.abs(duration - standardDuration) < Math.abs(duration - expressiveDuration)
        ? STANDARD_SPRINGS[name]
        : expressive;
}
/**
 * Solves a spring in closed form: where a spring released `displacement` away
 * from its target, with `velocity`, is after `seconds`.
 */
export function solveSpring(spec, displacement, velocity, seconds) {
    if (seconds <= 0)
        return { displacement, velocity };
    const w = Math.sqrt(spec.stiffness);
    const z = spec.damping;
    const t = seconds;
    if (Math.abs(z - 1) < 1e-6) {
        const c = velocity + w * displacement;
        const e = Math.exp(-w * t);
        return {
            displacement: e * (displacement + c * t),
            velocity: e * (c - w * (displacement + c * t)),
        };
    }
    if (z < 1) {
        const a = z * w;
        const wd = w * Math.sqrt(1 - z * z);
        const b = (velocity + a * displacement) / wd;
        const e = Math.exp(-a * t);
        const cos = Math.cos(wd * t);
        const sin = Math.sin(wd * t);
        return {
            displacement: e * (displacement * cos + b * sin),
            velocity: e * ((wd * b - a * displacement) * cos - (a * b + wd * displacement) * sin),
        };
    }
    const s = w * Math.sqrt(z * z - 1);
    const r1 = -z * w + s;
    const r2 = -z * w - s;
    const c2 = (velocity - r1 * displacement) / (r2 - r1);
    const c1 = displacement - c2;
    const e1 = Math.exp(r1 * t);
    const e2 = Math.exp(r2 * t);
    return { displacement: c1 * e1 + c2 * e2, velocity: c1 * r1 * e1 + c2 * r2 * e2 };
}
const rafScheduler = {
    request: (callback) => requestAnimationFrame(callback),
    cancel: (handle) => cancelAnimationFrame(handle),
};
/**
 * One spring on one axis, driven by `requestAnimationFrame`.
 *
 * - `start(from, to, velocity)` springs toward `to` with an initial velocity
 *   (a fling's release velocity).
 * - `retarget(to)` aims a running spring at a new target and keeps its
 *   position and velocity, so the motion stays continuous.
 * - `stop()` freezes it where it is; `finish()` jumps to the target.
 */
export class Spring {
    constructor(options = {}) {
        this.target = 0;
        this.fromTarget = 0;
        this.fromVelocity = 0;
        this.startedAt = 0;
        this.handle = null;
        this._running = false;
        this._position = 0;
        this._velocity = 0;
        this.options = options;
        this.spec = options.spec ?? DEFAULT_SPEC;
    }
    /** Whether the spring is moving. */
    get running() {
        return this._running;
    }
    /** The current position (px). */
    get position() {
        return this._position;
    }
    /** The current velocity (px/s). */
    get velocity() {
        return this._velocity;
    }
    /** Springs from `from` to `to` with an initial velocity (px/s). */
    start(from, to, velocity = 0) {
        this.begin(from, to, velocity);
    }
    /**
     * Aims at a new target. A running spring keeps its position and velocity;
     * a resting one starts from where it rests.
     */
    retarget(to) {
        this.begin(this._position, to, this._running ? this._velocity : 0);
    }
    /** Freezes the spring where it is. */
    stop() {
        this.cancelFrame();
        this._running = false;
    }
    /** Jumps to the target and rests. */
    finish() {
        if (!this._running)
            return;
        this.rest();
    }
    /**
     * Advances the spring to a time in ms (the frame loop calls this; tests can
     * drive it directly).
     */
    tick(time = this.clock()) {
        if (!this._running)
            return;
        const state = solveSpring(this.spec, this.fromTarget, this.fromVelocity, Math.max(0, time - this.startedAt) / 1000);
        const { restDelta = 0.5, restSpeed = 10 } = this.options;
        if (Math.abs(state.displacement) <= restDelta && Math.abs(state.velocity) <= restSpeed) {
            this.rest();
            return;
        }
        this._position = this.target + state.displacement;
        this._velocity = state.velocity;
        this.options.onFrame?.(this._position, this._velocity);
        this.scheduleFrame();
    }
    begin(from, to, velocity) {
        this.cancelFrame();
        this.target = to;
        this._position = from;
        this._velocity = velocity;
        this._running = true;
        const reduced = this.options.reduced ?? prefersReducedMotion;
        if (reduced() || (from === to && velocity === 0)) {
            this.rest();
            return;
        }
        this.fromTarget = from - to;
        this.fromVelocity = velocity;
        this.startedAt = this.clock();
        this.scheduleFrame();
    }
    rest() {
        this.cancelFrame();
        this._running = false;
        this._position = this.target;
        this._velocity = 0;
        this.options.onFrame?.(this.target, 0);
        this.options.onRest?.(this.target);
    }
    clock() {
        return (this.options.now ?? (() => performance.now()))();
    }
    scheduleFrame() {
        this.cancelFrame();
        this.handle = (this.options.scheduler ?? rafScheduler).request((time) => {
            this.handle = null;
            this.tick(this.options.now ? this.options.now() : time);
        });
    }
    cancelFrame() {
        if (this.handle !== null) {
            (this.options.scheduler ?? rafScheduler).cancel(this.handle);
            this.handle = null;
        }
    }
}
//# sourceMappingURL=spring.js.map