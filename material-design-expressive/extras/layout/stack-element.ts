/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, html, LitElement, unsafeCSS} from 'lit';
import {property} from 'lit/decorators.js';

/** A step of the M3 spacing scale (styles/spacing: `--md-sys-space-<step>`). */
export type SpaceStep =
  | '0'
  | '25'
  | '50'
  | '75'
  | '100'
  | '125'
  | '150'
  | '175'
  | '200'
  | '250'
  | '300'
  | '400'
  | '450'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

const STEPS: readonly SpaceStep[] = [
  '0', '25', '50', '75', '100', '125', '150', '175', '200', '250', '300', '400', '450', '500', '600', '700', '800', '900',
];

/** How the children line up across the stack. */
export type StackAlign = 'stretch' | 'start' | 'center' | 'end' | 'baseline';

/** How the children share the space along the stack. */
export type StackJustify = 'start' | 'center' | 'end' | 'space-between';

// spec-labels: layout-grids-spacing/spacing
/**
 * A column or row of children with a step of the M3 spacing scale between
 * them (m3.material.io/foundations/layout/grids-spacing, Spacing): close
 * spacing groups related elements, generous spacing separates groups and
 * gives the most important content room.
 *
 * A row can `wrap` onto more lines when it runs out of room (a hero's text
 * and illustration side by side on wide windows, one above the other on
 * narrow ones).
 *
 * @slot - The stack's items.
 */
export class StackElement extends LitElement {
  static override styles = [
    css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--_gap, var(--md-sys-space-200));
    }
    :host([hidden]) {
      display: none;
    }
    :host([direction='row']) {
      flex-direction: row;
    }
    :host([wrap]) {
      flex-wrap: wrap;
    }
    :host([align='start']) {
      align-items: flex-start;
    }
    :host([align='center']) {
      align-items: center;
    }
    :host([align='end']) {
      align-items: flex-end;
    }
    :host([align='baseline']) {
      align-items: baseline;
    }
    :host([justify='center']) {
      justify-content: center;
    }
    :host([justify='end']) {
      justify-content: flex-end;
    }
    :host([justify='space-between']) {
      justify-content: space-between;
    }
    ::slotted(*) {
      min-inline-size: 0;
    }
    :host([direction='row'][wrap]) ::slotted(*) {
      flex: 1 1 auto;
    }
  `,
    unsafeCSS(STEPS.map((s) => `:host([gap='${s}']) { --_gap: var(--md-sys-space-${s}); }`).join('\n')),
  ];

  /** Children one below the other (`column`) or side by side (`row`). */
  @property({reflect: true}) direction: 'column' | 'row' = 'column';

  /** The space between children: a step of the spacing scale (200 is 16px). */
  @property({reflect: true}) gap: SpaceStep = '200';

  /** How the children line up across the stack. */
  @property({reflect: true}) align: StackAlign = 'stretch';

  /** How the children share the space along the stack. */
  @property({reflect: true}) justify: StackJustify = 'start';

  /** Whether a row wraps onto more lines when its children don't fit. */
  @property({type: Boolean, reflect: true}) wrap = false;

  protected override render() {
    return html`<slot></slot>`;
  }
}
