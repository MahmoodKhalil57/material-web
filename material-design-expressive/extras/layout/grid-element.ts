/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, html, LitElement, unsafeCSS, type CSSResult} from 'lit';
import {property} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

import {WINDOW_SIZE_CLASS_VALUES, WINDOW_SIZE_CLASSES} from '../../foundations/layout/layout-values.js';

/**
 * Columns and spacer of each window size class, as media queries on the
 * window (foundations/layout/layout-values.ts).
 */
function windowClassRules(): CSSResult {
  const rules = WINDOW_SIZE_CLASSES.map((name) => {
    const {minWidth, columns, spacer} = WINDOW_SIZE_CLASS_VALUES[name];
    const body = `.grid { --_columns: ${columns}; --_spacer: ${spacer}px; }`;
    return minWidth === 0 ? body : `@media (min-width: ${minWidth}px) { ${body} }`;
  });
  return unsafeCSS(rules.join('\n'));
}

// spec-labels: layout-grids-spacing/grids
/**
 * The M3 layout grid (m3.material.io/foundations/layout/grids-spacing): its
 * children are placed on columns that adapt across breakpoints (4 compact,
 * 8 medium and expanded, 12 large and extra-large), with the breakpoint's
 * spacer between them.
 *
 * Each child spans `span` columns, at most all of them: with the default
 * of 4, children such as cards stand one per row on compact windows, two
 * on medium and expanded, and three on large and extra-large. The children
 * of a row share its height, so cards of different lengths keep a steady
 * rhythm.
 *
 * @slot - The grid's items.
 */
export class GridElement extends LitElement {
  static override styles = [
    css`
      :host {
        display: block;
      }
      :host([hidden]) {
        display: none;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(var(--_columns), minmax(0, 1fr));
        gap: var(--_spacer);
      }
      ::slotted(*) {
        grid-column: span min(var(--_span), var(--_columns));
        min-inline-size: 0;
      }
    `,
    windowClassRules(),
  ];

  /**
   * The number of columns each child spans (1 to 12), at most the window
   * size class's columns. 1, 2, 4 or 12 make full rows at every breakpoint.
   */
  @property({type: Number, reflect: true}) span = 4;

  protected override render() {
    const span = Math.min(12, Math.max(1, Math.round(Number(this.span)) || 4));
    return html`<div class="grid" style=${styleMap({'--_span': String(span)})}><slot></slot></div>`;
  }
}
