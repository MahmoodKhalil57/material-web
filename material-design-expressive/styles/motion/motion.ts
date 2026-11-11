/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {perfEnd, perfStart} from '../../components/shared/perf.js';

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
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** The class that opts a subtree into reduced motion (see the motion tokens). */
export const REDUCED_MOTION_CLASS = 'md-motion-reduced';

/**
 * Durations (ms) of the springs in the M3 Expressive scheme, used when the
 * motion tokens are not loaded.
 */
export const FALLBACK_SPRING_DURATIONS: Readonly<
  Record<`${SpringSpeed}-${SpringKind}`, number>
> = {
  'fast-spatial': 350,
  'default-spatial': 420,
  'slow-spatial': 570,
  'fast-effects': 140,
  'default-effects': 220,
  'slow-effects': 300,
};

/** Time added to a spring's duration for {@link springTimeout}. */
const TIMEOUT_SLACK_MS = 100;

/** The name of a spring's duration token. */
export function springDurationToken(speed: SpringSpeed, kind: SpringKind) {
  return `--md-sys-motion-spring-${speed}-${kind}-duration`;
}

/**
 * Parses a CSS time (`350ms`, `0.35s`, `0s`) to milliseconds. Returns
 * undefined for anything else (empty, unset or invalid values).
 */
export function parseDuration(value: string | null | undefined) {
  const match = /^\s*(-?(?:\d+\.?\d*|\.\d+))(ms|s)\s*$/i.exec(value ?? '');
  if (!match) {
    return undefined;
  }
  const time =
    parseFloat(match[1]) * (match[2].toLowerCase() === 's' ? 1000 : 1);
  return time < 0 ? 0 : time;
}

/** Whether the platform's reduced motion setting is on. */
export function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia === 'function' && matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

/**
 * Whether motion is reduced for `element`: the platform setting, or an
 * ancestor with `.md-motion-reduced` (also across shadow roots).
 */
export function isReducedMotion(element?: Element | null): boolean {
  if (prefersReducedMotion()) {
    return true;
  }
  let node: Element | null | undefined = element;
  while (node) {
    if (node.classList?.contains(REDUCED_MOTION_CLASS)) {
      return true;
    }
    const root: Node = node.getRootNode();
    node =
      node.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
  }
  return false;
}

/**
 * Calls `listener` with the new value when the platform's reduced motion
 * setting changes, until `signal` aborts. Returns a function that stops
 * listening.
 */
export function onReducedMotionChange(
  listener: (reduced: boolean) => void,
  signal?: AbortSignal,
): () => void {
  if (typeof matchMedia !== 'function') {
    return () => {};
  }
  const query = matchMedia(REDUCED_MOTION_QUERY);
  const handle = () => listener(query.matches);
  const stop = () => query.removeEventListener('change', handle);
  query.addEventListener('change', handle);
  signal?.addEventListener('abort', stop, {once: true});
  return stop;
}

/**
 * The duration (ms) of a spring for `element`, read from the motion tokens
 * it inherits. Spatial springs are 0 when motion is reduced; effects springs
 * are kept. Falls back to the Expressive duration when the token is unset.
 */
export function springDuration(
  element: Element,
  speed: SpringSpeed,
  kind: SpringKind,
): number {
  if (kind === 'spatial' && isReducedMotion(element)) {
    return 0;
  }
  const token = springDurationToken(speed, kind);
  const value = element.isConnected
    ? getComputedStyle(element).getPropertyValue(token)
    : '';
  return parseDuration(value) ?? FALLBACK_SPRING_DURATIONS[`${speed}-${kind}`];
}

/**
 * A timeout for waiting on a spring: its duration plus some slack, so a
 * slow frame does not cut the motion short.
 */
export function springTimeout(
  element: Element,
  speed: SpringSpeed,
  kind: SpringKind,
): number {
  return springDuration(element, speed, kind) + TIMEOUT_SLACK_MS;
}

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
export function waitForMotion(
  element: Element | null | undefined,
  {timeout = 1000, idle = 0, subtree = false, signal}: WaitForMotionOptions = {},
): Promise<MotionWaitResult> {
  if (signal?.aborted) {
    return Promise.resolve('aborted');
  }
  const animations =
    element && typeof element.getAnimations === 'function'
      ? element
          .getAnimations({subtree})
          .filter(
            (a) =>
              subtree ||
              (a.effect as KeyframeEffect | null)?.target === element,
          )
      : [];
  if (animations.length === 0 && idle <= 0) {
    return Promise.resolve('none');
  }
  const perf = perfStart();
  return new Promise((resolve) => {
    const onAbort = () => done('aborted');
    const done = (result: MotionWaitResult) => {
      perfEnd('waitForMotion', perf, {result});
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      resolve(result);
    };
    signal?.addEventListener('abort', onAbort, {once: true});
    const limit = Math.max(0, timeout);
    let timer: ReturnType<typeof setTimeout>;
    if (animations.length > 0) {
      timer = setTimeout(() => done('timeout'), limit);
      Promise.all(animations.map((a) => a.finished.catch(() => {}))).then(() =>
        done('finished'),
      );
    } else {
      // Nothing animates yet: give a transition that is about to start `idle` ms.
      timer = setTimeout(() => done('none'), Math.min(idle, limit));
    }
  });
}

/**
 * Waits `duration` ms (at once for 0 or less, or when `signal` aborts). For
 * motion that has no animation object to wait for.
 */
export function waitForDuration(duration: number, signal?: AbortSignal) {
  const perf = perfStart();
  return new Promise<void>((resolve) => {
    if (duration <= 0 || signal?.aborted) {
      resolve();
      return;
    }
    const done = () => {
      perfEnd('waitForDuration', perf, {duration});
      clearTimeout(timer);
      signal?.removeEventListener('abort', done);
      resolve();
    };
    const timer = setTimeout(done, duration);
    signal?.addEventListener('abort', done, {once: true});
  });
}
