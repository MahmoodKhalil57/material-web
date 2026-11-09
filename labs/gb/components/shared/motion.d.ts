/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Shared motion plumbing for components that script their motion: reading
 * spring durations from the motion tokens, following the reduced motion
 * setting, and waiting for transitions and animations to end.
 *
 * - Durations come from the motion tokens
 *   (`--md-sys-motion-spring-<speed>-<spatial|effects>-duration`), so the
 *   motion scheme (expressive or standard) and reduced motion apply without
 *   the component knowing about them.
 * - Reduced motion turns spatial motion off (sliding, scaling, shape
 *   morphing, parallax) and keeps effects (fades, color): the spatial tokens
 *   resolve to 0ms under `prefers-reduced-motion: reduce` and inside
 *   `.md-motion-reduced`, the effects tokens do not change.
 * - Waiting never hangs: `waitForMotion()` resolves when the animations end
 *   or when its timeout runs out.
 *
 * Spec: `styles/motion` (motion physics: spatial and effects springs;
 * transitions, "Follows accessibility settings").
 */
/** The speed of a spring token. */
export type SpringSpeed = 'fast' | 'default' | 'slow';
/** The kind of a spring token: spatial (position, size, shape) or effects (color, opacity). */
export type SpringKind = 'spatial' | 'effects';
/** The media query of the platform's reduced motion setting. */
export declare const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
/** The class that opts a subtree into reduced motion (see the motion tokens). */
export declare const REDUCED_MOTION_CLASS = "md-motion-reduced";
/**
 * Durations (ms) of the springs in the M3 Expressive scheme, used when the
 * motion tokens are not loaded.
 */
export declare const FALLBACK_SPRING_DURATIONS: Readonly<Record<`${SpringSpeed}-${SpringKind}`, number>>;
/** The name of a spring's duration token. */
export declare function springDurationToken(speed: SpringSpeed, kind: SpringKind): string;
/**
 * Parses a CSS time (`350ms`, `0.35s`, `0s`) to milliseconds. Returns
 * undefined for anything else (empty, unset or invalid values).
 */
export declare function parseDuration(value: string | null | undefined): number;
/** Whether the platform's reduced motion setting is on. */
export declare function prefersReducedMotion(): boolean;
/**
 * Whether motion is reduced for `element`: the platform setting, or an
 * ancestor with `.md-motion-reduced` (also across shadow roots).
 */
export declare function isReducedMotion(element?: Element | null): boolean;
/**
 * Calls `listener` with the new value when the platform's reduced motion
 * setting changes, until `signal` aborts. Returns a function that stops
 * listening.
 */
export declare function onReducedMotionChange(listener: (reduced: boolean) => void, signal?: AbortSignal): () => void;
/**
 * The duration (ms) of a spring for `element`, read from the motion tokens
 * it inherits. Spatial springs are 0 when motion is reduced; effects springs
 * are kept. Falls back to the Expressive duration when the token is unset.
 */
export declare function springDuration(element: Element, speed: SpringSpeed, kind: SpringKind): number;
/**
 * A timeout for waiting on a spring: its duration plus some slack, so a
 * slow frame does not cut the motion short.
 */
export declare function springTimeout(element: Element, speed: SpringSpeed, kind: SpringKind): number;
/** Why {@link waitForMotion} returned. */
export type MotionWaitResult = 'none' | 'finished' | 'timeout' | 'aborted';
/** Options of {@link waitForMotion}. */
export interface WaitForMotionOptions {
    /**
     * The longest wait (ms), after which the promise resolves anyway (an
     * animation that never ends). Default 1000.
     */
    timeout?: number;
    /**
     * How long to wait (ms) when nothing animates at the time of the call,
     * for a transition the browser has not started yet. Default 0 (resolve
     * at once). Capped by `timeout`.
     */
    idle?: number;
    /** Whether to wait for animations of descendants too. Default false. */
    subtree?: boolean;
    /** Ends the wait early with `'aborted'`. */
    signal?: AbortSignal;
}
/**
 * Waits for the transitions and animations running on `element` to end
 * (`element.getAnimations()`), but never longer than `timeout`. Canceled
 * animations count as ended. Never rejects.
 */
export declare function waitForMotion(element: Element | null | undefined, { timeout, idle, subtree, signal }?: WaitForMotionOptions): Promise<MotionWaitResult>;
/**
 * Waits `duration` ms (at once for 0 or less, or when `signal` aborts). For
 * motion that has no animation object to wait for.
 */
export declare function waitForDuration(duration: number, signal?: AbortSignal): Promise<void>;
