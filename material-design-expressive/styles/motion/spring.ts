/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {parseTime, prefersReducedMotion} from '../../components/shared/disclosure.js';

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
export const EXPRESSIVE_SPRINGS: Readonly<Record<string, SpringSpec>> = {
  'fast-spatial': {damping: 0.6, stiffness: 800},
  'default-spatial': {damping: 0.8, stiffness: 380},
  'slow-spatial': {damping: 0.8, stiffness: 200},
  'fast-effects': {damping: 1, stiffness: 3800},
  'default-effects': {damping: 1, stiffness: 1600},
  'slow-effects': {damping: 1, stiffness: 800},
};

/** The Standard scheme's springs: the spatial ones barely overshoot. */
export const STANDARD_SPRINGS: Readonly<Record<string, SpringSpec>> = {
  ...EXPRESSIVE_SPRINGS,
  'fast-spatial': {damping: 0.9, stiffness: 1400},
  'default-spatial': {damping: 0.9, stiffness: 700},
  'slow-spatial': {damping: 0.9, stiffness: 300},
};

/** The Expressive durations (ms) of the spatial springs, to tell the schemes apart. */
const EXPRESSIVE_SPATIAL_DURATIONS: Readonly<Record<string, number>> = {
  'fast-spatial': 350,
  'default-spatial': 420,
  'slow-spatial': 570,
};

/** The Standard durations (ms) of the spatial springs. */
const STANDARD_SPATIAL_DURATIONS: Readonly<Record<string, number>> = {
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
export function readSpring(element: Element, name: SpringName = 'default-spatial'): SpringSpec {
  const expressive = EXPRESSIVE_SPRINGS[name];
  if (!expressive) return DEFAULT_SPEC;
  const expressiveDuration = EXPRESSIVE_SPATIAL_DURATIONS[name];
  if (expressiveDuration === undefined) return expressive;
  const duration = parseTime(
    getComputedStyle(element).getPropertyValue(`--md-sys-motion-spring-${name}-duration`),
  );
  if (Number.isNaN(duration)) return expressive;
  const standardDuration = STANDARD_SPATIAL_DURATIONS[name];
  return Math.abs(duration - standardDuration) < Math.abs(duration - expressiveDuration)
    ? STANDARD_SPRINGS[name]
    : expressive;
}

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
export function solveSpring(
  spec: SpringSpec,
  displacement: number,
  velocity: number,
  seconds: number,
): SpringState {
  if (seconds <= 0) return {displacement, velocity};
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
  return {displacement: c1 * e1 + c2 * e2, velocity: c1 * r1 * e1 + c2 * r2 * e2};
}

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

const rafScheduler: SpringScheduler = {
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
  spec: SpringSpec;
  private readonly options: SpringOptions;
  private target = 0;
  private fromTarget = 0;
  private fromVelocity = 0;
  private startedAt = 0;
  private handle: number | null = null;
  private _running = false;
  private _position = 0;
  private _velocity = 0;

  constructor(options: SpringOptions = {}) {
    this.options = options;
    this.spec = options.spec ?? DEFAULT_SPEC;
  }

  /** Whether the spring is moving. */
  get running(): boolean {
    return this._running;
  }

  /** The current position (px). */
  get position(): number {
    return this._position;
  }

  /** The current velocity (px/s). */
  get velocity(): number {
    return this._velocity;
  }

  /** Springs from `from` to `to` with an initial velocity (px/s). */
  start(from: number, to: number, velocity = 0): void {
    this.begin(from, to, velocity);
  }

  /**
   * Aims at a new target. A running spring keeps its position and velocity;
   * a resting one starts from where it rests.
   */
  retarget(to: number): void {
    this.begin(this._position, to, this._running ? this._velocity : 0);
  }

  /** Freezes the spring where it is. */
  stop(): void {
    this.cancelFrame();
    this._running = false;
  }

  /** Jumps to the target and rests. */
  finish(): void {
    if (!this._running) return;
    this.rest();
  }

  /**
   * Advances the spring to a time in ms (the frame loop calls this; tests can
   * drive it directly).
   */
  tick(time: number = this.clock()): void {
    if (!this._running) return;
    const state = solveSpring(
      this.spec,
      this.fromTarget,
      this.fromVelocity,
      Math.max(0, time - this.startedAt) / 1000,
    );
    const {restDelta = 0.5, restSpeed = 10} = this.options;
    if (Math.abs(state.displacement) <= restDelta && Math.abs(state.velocity) <= restSpeed) {
      this.rest();
      return;
    }
    this._position = this.target + state.displacement;
    this._velocity = state.velocity;
    this.options.onFrame?.(this._position, this._velocity);
    this.scheduleFrame();
  }

  private begin(from: number, to: number, velocity: number) {
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

  private rest() {
    this.cancelFrame();
    this._running = false;
    this._position = this.target;
    this._velocity = 0;
    this.options.onFrame?.(this.target, 0);
    this.options.onRest?.(this.target);
  }

  private clock() {
    return (this.options.now ?? (() => performance.now()))();
  }

  private scheduleFrame() {
    this.cancelFrame();
    this.handle = (this.options.scheduler ?? rafScheduler).request((time) => {
      this.handle = null;
      this.tick(this.options.now ? this.options.now() : time);
    });
  }

  private cancelFrame() {
    if (this.handle !== null) {
      (this.options.scheduler ?? rafScheduler).cancel(this.handle);
      this.handle = null;
    }
  }
}
