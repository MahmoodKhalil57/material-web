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

/**
 * Resolves as soon as `check()` is truthy, checking once per frame, or after
 * `timeout` ms (then the test's own assertion reports the failure). Use it
 * instead of a fixed sleep before checking a state.
 *
 * Each check waits for the next frame or 16ms, whichever comes first: the
 * test `Environment` (testing/environment.ts) replaces `requestAnimationFrame`
 * with a queue it only flushes on demand, so a frame alone could never come.
 */
export async function until(check: () => unknown, {timeout = 1000} = {}): Promise<boolean> {
  const end = performance.now() + timeout;
  while (!check()) {
    if (performance.now() > end) return false;
    await new Promise((r) => {
      requestAnimationFrame(r);
      setTimeout(r, 16);
    });
  }
  return true;
}
