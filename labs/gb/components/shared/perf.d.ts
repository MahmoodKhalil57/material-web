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
export declare const PERF_TRACK = "md-gb";
/** The DevTools track group of the measures. */
export declare const PERF_TRACK_GROUP = "Material";
/** The `localStorage` key and URL parameter that turn the debug flag on. */
export declare const PERF_FLAG = "md-gb-perf";
/** Whether the debug flag is on. Read once, then cached. */
export declare function perfEnabled(): boolean;
/**
 * Forces the flag (`true` or `false`), or reads it again on the next use
 * (no argument). For tests and for turning it on at runtime.
 */
export declare function setPerfEnabled(value?: boolean): void;
/** Starts a span. Returns its start time, or -1 when the flag is off. */
export declare function perfStart(): number;
/**
 * Ends the span started by {@link perfStart}, recording a measure named
 * `name`. Does nothing for the -1 of a span started while the flag was off.
 * `detail` is shown in the DevTools tooltip.
 */
export declare function perfEnd(name: string, start: number, detail?: Record<string, unknown>): void;
/**
 * Runs `fn` as a span named `name` and returns its result. A promise result
 * ends the span when it settles. Prefer {@link perfStart} and
 * {@link perfEnd} in hot paths, where the closure is an allocation.
 */
export declare function perfSpan<T>(name: string, fn: () => T): T;
