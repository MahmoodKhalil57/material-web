/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {focusableWhileScrollable} from '../../foundations/accessibility/scroll-focus.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import proseStyles from './prose.css' with {type: 'css'}; // github-only
// import {styles as proseStyles} from './prose.cssresult.js'; // google3-only

// spec-labels: typography/applying-type, typography/type-scale-tokens
/**
 * A container for long-form text in native elements (headings, paragraphs,
 * lists, links, quotes, tables, code): it styles them with the M3 type scale,
 * color roles, shape and spacing tokens.
 *
 * The children stay in the light DOM (no shadow root), so its content is
 * the page's: headings join the document outline, and links and text stay
 * searchable and selectable. Its stylesheet is adopted into its document or
 * shadow root, with low-specificity (`:where()`) selectors the app can
 * override. It leaves the examples of md-gb-demo, and the text of
 * md-gb-typography (which has a type role of its own), as they are.
 *
 * Wide tables and code blocks scroll sideways; while one does, it is
 * focusable, so keyboard users can scroll it (WCAG 2.1.1). Content added
 * later gets the same.
 *
 * @slot - The text: native elements such as `<h2>`, `<p>`, `<ul>`, `<a>`,
 *     `<pre>`, `<table>`, and components.
 */
export class ProseElement extends HTMLElement {
  /** The scroll containers it keeps focusable, with the function that stops it. */
  private readonly scrollers = new Map<HTMLElement, () => void>();
  private observer?: MutationObserver;

  connectedCallback() {
    adoptStyles(this, proseStyles);
    this.syncScrollers();
    this.observer ??= new MutationObserver(() => this.syncScrollers());
    this.observer.observe(this, {childList: true, subtree: true});
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    for (const stop of this.scrollers.values()) stop();
    this.scrollers.clear();
  }

  /** Follows the tables and code blocks its styles make scroll. */
  private syncScrollers() {
    const current = new Set(
      [...this.querySelectorAll<HTMLElement>('table, pre')].filter((el) => !el.closest('md-gb-demo, md-gb-typography')),
    );
    for (const [el, stop] of this.scrollers) {
      if (!current.has(el)) {
        stop();
        this.scrollers.delete(el);
      }
    }
    for (const el of current) {
      if (!this.scrollers.has(el)) this.scrollers.set(el, focusableWhileScrollable(el));
    }
  }
}
