/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { perfEnd, perfStart } from './perf.js';
/** The media query of the platform's reduced motion setting. */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
/** The class that opts a subtree into reduced motion (see the motion tokens). */
export const REDUCED_MOTION_CLASS = 'md-motion-reduced';
/**
 * Durations (ms) of the springs in the M3 Expressive scheme, used when the
 * motion tokens are not loaded.
 */
export const FALLBACK_SPRING_DURATIONS = {
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
export function springDurationToken(speed, kind) {
    return `--md-sys-motion-spring-${speed}-${kind}-duration`;
}
/**
 * Parses a CSS time (`350ms`, `0.35s`, `0s`) to milliseconds. Returns
 * undefined for anything else (empty, unset or invalid values).
 */
export function parseDuration(value) {
    const match = /^\s*(-?(?:\d+\.?\d*|\.\d+))(ms|s)\s*$/i.exec(value ?? '');
    if (!match) {
        return undefined;
    }
    const time = parseFloat(match[1]) * (match[2].toLowerCase() === 's' ? 1000 : 1);
    return time < 0 ? 0 : time;
}
/** Whether the platform's reduced motion setting is on. */
export function prefersReducedMotion() {
    return (typeof matchMedia === 'function' && matchMedia(REDUCED_MOTION_QUERY).matches);
}
/**
 * Whether motion is reduced for `element`: the platform setting, or an
 * ancestor with `.md-motion-reduced` (also across shadow roots).
 */
export function isReducedMotion(element) {
    if (prefersReducedMotion()) {
        return true;
    }
    let node = element;
    while (node) {
        if (node.classList?.contains(REDUCED_MOTION_CLASS)) {
            return true;
        }
        const root = node.getRootNode();
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
export function onReducedMotionChange(listener, signal) {
    if (typeof matchMedia !== 'function') {
        return () => { };
    }
    const query = matchMedia(REDUCED_MOTION_QUERY);
    const handle = () => listener(query.matches);
    const stop = () => query.removeEventListener('change', handle);
    query.addEventListener('change', handle);
    signal?.addEventListener('abort', stop, { once: true });
    return stop;
}
/**
 * The duration (ms) of a spring for `element`, read from the motion tokens
 * it inherits. Spatial springs are 0 when motion is reduced; effects springs
 * are kept. Falls back to the Expressive duration when the token is unset.
 */
export function springDuration(element, speed, kind) {
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
export function springTimeout(element, speed, kind) {
    return springDuration(element, speed, kind) + TIMEOUT_SLACK_MS;
}
/**
 * Waits for the transitions and animations running on `element` to end
 * (`element.getAnimations()`), but never longer than `timeout`. Canceled
 * animations count as ended. Never rejects.
 */
export function waitForMotion(element, { timeout = 1000, idle = 0, subtree = false, signal } = {}) {
    if (signal?.aborted) {
        return Promise.resolve('aborted');
    }
    const animations = element && typeof element.getAnimations === 'function'
        ? element
            .getAnimations({ subtree })
            .filter((a) => subtree ||
            a.effect?.target === element)
        : [];
    if (animations.length === 0 && idle <= 0) {
        return Promise.resolve('none');
    }
    const perf = perfStart();
    return new Promise((resolve) => {
        const onAbort = () => done('aborted');
        const done = (result) => {
            perfEnd('waitForMotion', perf, { result });
            clearTimeout(timer);
            signal?.removeEventListener('abort', onAbort);
            resolve(result);
        };
        signal?.addEventListener('abort', onAbort, { once: true });
        const limit = Math.max(0, timeout);
        let timer;
        if (animations.length > 0) {
            timer = setTimeout(() => done('timeout'), limit);
            Promise.all(animations.map((a) => a.finished.catch(() => { }))).then(() => done('finished'));
        }
        else {
            // Nothing animates yet: give a transition that is about to start `idle` ms.
            timer = setTimeout(() => done('none'), Math.min(idle, limit));
        }
    });
}
/**
 * Waits `duration` ms (at once for 0 or less, or when `signal` aborts). For
 * motion that has no animation object to wait for.
 */
export function waitForDuration(duration, signal) {
    const perf = perfStart();
    return new Promise((resolve) => {
        if (duration <= 0 || signal?.aborted) {
            resolve();
            return;
        }
        const done = () => {
            perfEnd('waitForDuration', perf, { duration });
            clearTimeout(timer);
            signal?.removeEventListener('abort', done);
            resolve();
        };
        const timer = setTimeout(done, duration);
        signal?.addEventListener('abort', done, { once: true });
    });
}
//# sourceMappingURL=motion.js.map