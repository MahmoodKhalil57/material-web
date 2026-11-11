/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

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
 * override.
 *
 * @slot - The text: native elements such as `<h2>`, `<p>`, `<ul>`, `<a>`,
 *     `<pre>`, `<table>`, and components.
 */
export class ProseElement extends HTMLElement {
  connectedCallback() {
    adoptStyles(this, proseStyles);
  }
}
