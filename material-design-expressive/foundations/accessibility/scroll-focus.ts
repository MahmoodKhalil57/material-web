/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** The elements whose tabindex focusableWhileScrollable() set. */
const ours = new WeakSet<Element>();

const SCROLLS = new Set(['auto', 'scroll']);

/** Whether an element scrolls: its content overflows it on an axis that scrolls (not hidden or clipped). */
function overflows(element: Element): boolean {
  const style = getComputedStyle(element);
  return (
    (SCROLLS.has(style.overflowX) && element.scrollWidth > element.clientWidth + 1) ||
    (SCROLLS.has(style.overflowY) && element.scrollHeight > element.clientHeight + 1)
  );
}

/**
 * Keeps a scroll container reachable from the keyboard (WCAG 2.1.1
 * Keyboard): while its content overflows it, it is focusable
 * (`tabindex="0"`), so keyboard users can scroll it with the arrow keys;
 * when the content fits, the tabindex it set is removed. A tabindex the
 * app set is left as it is. It follows the element's size and its
 * content's (a ResizeObserver on both). Returns a function that stops it.
 *
 * Use it for elements that scroll their own content, such as a wide table
 * or a long code block (`overflow: auto`).
 */
export function focusableWhileScrollable(element: HTMLElement): () => void {
  const sync = () => {
    if (overflows(element)) {
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
        ours.add(element);
      }
    } else if (ours.has(element)) {
      element.removeAttribute('tabindex');
      ours.delete(element);
    }
  };
  sync();
  if (typeof ResizeObserver !== 'function') return () => {};
  const observer = new ResizeObserver(sync);
  observer.observe(element);
  for (const child of element.children) observer.observe(child);
  return () => observer.disconnect();
}
