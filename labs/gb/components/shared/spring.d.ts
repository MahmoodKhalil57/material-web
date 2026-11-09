/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * A small spring solver for gestures: the `md.sys.motion.spring` tokens as
 * physics instead of a CSS easing, so a fling can hand its release velocity to
 * the settle and a settle can be retargeted mid-flight without a jump in
 * speed (Compose's `spring(dampingRatio, stiffness)`, unit mass).
 *
 * The motion is solved in closed form (under-, critically and over-damped),
 * so it doesn't depend on the frame rate. A `requestAnimationFrame` loop
 * samples it. Under reduced motion a spring jumps to its target.
 *
 * Spec: foundations/styles/motion (motion physics: springs for spatial and
 * effects motion, interruption and retargeting), interaction/gestures.md
 * (gestures respond in real time and keep their momentum).
 */
/** The physics of a spring. */
export interface SpringSpec {
    /** Damping ratio (1 is critically damped, below 1 overshoots). */
    damping: number;
    /** Stiffness (the unit-mass spring constant). */
    stiffness: number;
}
/** A spring token name: `<fast|default|slow>-<spatial|effects>`. */
export type SpringName = string;
/** The Expressive scheme's springs (`md.sys.motion.spring.*`). */
export declare const EXPRESSIVE_SPRINGS: Readonly<Record<string, SpringSpec>>;
/** The Standard scheme's springs: the spatial ones barely overshoot. */
export declare const STANDARD_SPRINGS: Readonly<Record<string, SpringSpec>>;
/**
 * Reads a spring from the motion tokens in the context of an element: its
 * damping and stiffness. The tokens carry a spring's easing and duration, so
 * the scheme (Expressive or Standard) is told from the duration; an
 * unknown name falls back to `default-spatial`.
 *
 * @param element The element whose tokens apply.
 * @param name The spring token name. Default `default-spatial`.
 */
export declare function readSpring(element: Element, name?: SpringName): SpringSpec;
/** A spring's displacement from its target and speed. */
export interface SpringState {
    /** Distance from the target (px). */
    displacement: number;
    /** Speed (px/s). */
    velocity: number;
}
/**
 * Solves a spring in closed form: where a spring released `displacement` away
 * from its target, with `velocity`, is after `seconds`.
 */
export declare function solveSpring(spec: SpringSpec, displacement: number, velocity: number, seconds: number): SpringState;
/** Frame scheduling, replaceable for tests. */
export interface SpringScheduler {
    request(callback: (time: number) => void): number;
    cancel(handle: number): void;
}
/** Options of {@link Spring}. */
export interface SpringOptions {
    /** The physics. Can be replaced between runs (`spring.spec = ...`). */
    spec?: SpringSpec;
    /** Called with the position (px) and velocity (px/s) on every frame. */
    onFrame?: (position: number, velocity: number) => void;
    /** Called once when the spring comes to rest at its target. */
    onRest?: (position: number) => void;
    /** The distance (px) from the target below which the spring may rest. Default 0.5. */
    restDelta?: number;
    /** The speed (px/s) below which the spring may rest. Default 10. */
    restSpeed?: number;
    /** Whether motion is reduced: the spring then jumps to its target. Default the platform setting. */
    reduced?: () => boolean;
    /** The clock in ms. Default `performance.now()`. */
    now?: () => number;
    /** The frame loop. Default `requestAnimationFrame`. */
    scheduler?: SpringScheduler;
}
/**
 * One spring on one axis, driven by `requestAnimationFrame`.
 *
 * - `start(from, to, velocity)` springs toward `to` with an initial velocity
 *   (a fling's release velocity).
 * - `retarget(to)` aims a running spring at a new target and keeps its
 *   position and velocity, so the motion stays continuous.
 * - `stop()` freezes it where it is; `finish()` jumps to the target.
 */
export declare class Spring {
    spec: SpringSpec;
    private readonly options;
    private target;
    private fromTarget;
    private fromVelocity;
    private startedAt;
    private handle;
    private _running;
    private _position;
    private _velocity;
    constructor(options?: SpringOptions);
    /** Whether the spring is moving. */
    get running(): boolean;
    /** The current position (px). */
    get position(): number;
    /** The current velocity (px/s). */
    get velocity(): number;
    /** Springs from `from` to `to` with an initial velocity (px/s). */
    start(from: number, to: number, velocity?: number): void;
    /**
     * Aims at a new target. A running spring keeps its position and velocity;
     * a resting one starts from where it rests.
     */
    retarget(to: number): void;
    /** Freezes the spring where it is. */
    stop(): void;
    /** Jumps to the target and rests. */
    finish(): void;
    /**
     * Advances the spring to a time in ms (the frame loop calls this; tests can
     * drive it directly).
     */
    tick(time?: number): void;
    private begin;
    private rest;
    private clock;
    private scheduleFrame;
    private cancelFrame;
}
