/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * DOM helpers for the component tests that only need to measure or wait, kept
 * apart from the central subject table (`central/subjects.ts`), which imports
 * every component and so costs seconds to load in each test file. The
 * definitions match the ones in `central/subjects.ts`.
 */

/** All elements under and including `root`, descending into open shadow roots. */
export function deepElements(root: Element | ShadowRoot): Element[] {
  const out: Element[] = [];
  const visit = (node: Element | ShadowRoot) => {
    if (node instanceof Element) out.push(node);
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    for (const child of Array.from(node.children)) visit(child);
  };
  visit(root);
  return out;
}

/** The center of an element's box in viewport coordinates. */
export function center(el: Element) {
  const r = el.getBoundingClientRect();
  return {x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2)};
}

/** The ripple (state layer) elements of a subject, in its shadow trees. */
export function ripplesOf(el: Element): HTMLElement[] {
  return deepElements(el).filter((e) => e.classList.contains('ripple')) as HTMLElement[];
}

/** The focus ring elements of a subject, in its shadow trees and itself. */
export function focusRingsOf(el: Element): HTMLElement[] {
  return deepElements(el).filter((e) =>
    e.classList.contains('focus-ring-outer') || e.classList.contains('focus-ring-inner'),
  ) as HTMLElement[];
}

/** A computed custom property, trimmed. */
export function prop(el: Element, name: string, pseudo?: string): string {
  return getComputedStyle(el, pseudo).getPropertyValue(name).trim();
}

// The browser's own timers, captured when this module loads: the test
// `Environment` (testing/environment.ts) installs Jasmine's mock clock and
// replaces `requestAnimationFrame`, so waiting on the globals at call time
// could never resolve.
const realRaf = globalThis.requestAnimationFrame.bind(globalThis);
const realSetTimeout = globalThis.setTimeout.bind(globalThis);

/**
 * Resolves as soon as `check()` is truthy, checking once per frame (or every
 * 16ms when frames are throttled), or after `timeout` ms (then the test's own
 * assertion reports the failure). Use it instead of a fixed sleep before
 * checking a state. Works inside `Environment` suites (real timers).
 */
export async function until(check: () => unknown, {timeout = 1000} = {}): Promise<boolean> {
  const end = performance.now() + timeout;
  while (!check()) {
    if (performance.now() > end) return false;
    await new Promise((r) => {
      realRaf(r);
      realSetTimeout(r, 16);
    });
  }
  return true;
}

/**
 * Like {@link until}, for suites on the test `Environment`: its mocked clock
 * runs `requestAnimationFrame` callbacks (a spring's frames) only when ticked,
 * so this ticks it once per check.
 */
export function untilTicking(check: () => unknown, options?: {timeout?: number}): Promise<boolean> {
  return until(() => {
    jasmine.clock().tick(1);
    return check();
  }, options);
}

/**
 * Freezes `performance.now()` (the clock a spring runs on) for the rest of
 * the spec, so a test can step a spring a known time: `advance(ms)` moves the
 * clock and runs the pending frame of the `Environment`'s mocked clock.
 */
export function freezeSpringClock(): {advance(ms: number): void} {
  let now = performance.now();
  spyOn(performance, 'now').and.callFake(() => now);
  return {
    advance(ms: number) {
      now += ms;
      jasmine.clock().tick(1);
    },
  };
}
