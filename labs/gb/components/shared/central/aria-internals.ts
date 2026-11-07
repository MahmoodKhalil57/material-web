/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Remembers the `ElementInternals` of every element that
 * attaches them, so the ARIA suite can read the role, ARIA state and element
 * references a component sets there (browsers expose these to assistive
 * technology, but nothing outside the element can reach them otherwise).
 * Import this module before any component is defined.
 */

const internals = new WeakMap<Element, ElementInternals>();

const attach = HTMLElement.prototype.attachInternals;
HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
  const result = attach.call(this);
  internals.set(this, result);
  return result;
};

/** The internals an element attached, if any. */
export function internalsOf(el: Element): ElementInternals | undefined {
  return internals.get(el);
}
