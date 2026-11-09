/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Optional performance marks for the shared plumbing (motion waits, overflow
 * measure passes, scroll steps), shown as a custom track in the Chrome
 * DevTools Performance panel.
 *
 * Off by default. Turn it on before the first measure with any of:
 *
 * - `globalThis.MD_GB_DEBUG_PERF = true`
 * - the `md-gb-perf` query parameter (`?md-gb-perf`)
 * - `localStorage.setItem('md-gb-perf', '1')`
 *
 * The flag is read once, on first use. Each span becomes a
 * `performance.measure()` carrying the `detail.devtools` extension data
 * (track "md-gb" in the group "Material"). While the flag is off, a call
 * costs one boolean check and allocates nothing: {@link perfStart} returns
 * -1 and {@link perfEnd} returns at once.
 */
/** The DevTools track of the measures. */
export const PERF_TRACK = 'md-gb';
/** The DevTools track group of the measures. */
export const PERF_TRACK_GROUP = 'Material';
/** The `localStorage` key and URL parameter that turn the debug flag on. */
export const PERF_FLAG = 'md-gb-perf';
let enabled;
function readFlag() {
    try {
        if (globalThis.MD_GB_DEBUG_PERF) {
            return true;
        }
        if (typeof location !== 'undefined' &&
            new URLSearchParams(location.search).has(PERF_FLAG)) {
            return true;
        }
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(PERF_FLAG) !== null;
        }
    }
    catch {
        // Storage or location blocked: stay off.
    }
    return false;
}
/** Whether the debug flag is on. Read once, then cached. */
export function perfEnabled() {
    return (enabled ??= readFlag());
}
/**
 * Forces the flag (`true` or `false`), or reads it again on the next use
 * (no argument). For tests and for turning it on at runtime.
 */
export function setPerfEnabled(value) {
    enabled = value;
}
/** Starts a span. Returns its start time, or -1 when the flag is off. */
export function perfStart() {
    return perfEnabled() ? performance.now() : -1;
}
/**
 * Ends the span started by {@link perfStart}, recording a measure named
 * `name`. Does nothing for the -1 of a span started while the flag was off.
 * `detail` is shown in the DevTools tooltip.
 */
export function perfEnd(name, start, detail) {
    if (start < 0) {
        return;
    }
    try {
        performance.measure(name, {
            start,
            end: performance.now(),
            detail: {
                ...detail,
                devtools: {
                    dataType: 'track-entry',
                    track: PERF_TRACK,
                    trackGroup: PERF_TRACK_GROUP,
                    color: 'primary',
                },
            },
        });
    }
    catch {
        // A browser without the options form of measure(): drop the span.
    }
}
/**
 * Runs `fn` as a span named `name` and returns its result. A promise result
 * ends the span when it settles. Prefer {@link perfStart} and
 * {@link perfEnd} in hot paths, where the closure is an allocation.
 */
export function perfSpan(name, fn) {
    const start = perfStart();
    if (start < 0) {
        return fn();
    }
    let result;
    try {
        result = fn();
    }
    catch (error) {
        perfEnd(name, start);
        throw error;
    }
    if (result instanceof Promise) {
        const end = () => perfEnd(name, start);
        result.then(end, end);
    }
    else {
        perfEnd(name, start);
    }
    return result;
}
//# sourceMappingURL=perf.js.map