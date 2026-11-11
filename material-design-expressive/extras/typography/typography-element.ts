/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, html, LitElement, unsafeCSS} from 'lit';
import {property} from 'lit/decorators.js';

/** A role of the M3 type scale (styles/typography: `--md-sys-typescale-<scale>`). */
export type TypeScale =
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'headline-lg'
  | 'headline-md'
  | 'headline-sm'
  | 'title-lg'
  | 'title-md'
  | 'title-sm'
  | 'label-lg'
  | 'label-md'
  | 'label-sm'
  | 'body-lg'
  | 'body-md'
  | 'body-sm';

const SCALES: readonly TypeScale[] = [
  'display-lg', 'display-md', 'display-sm', 'headline-lg', 'headline-md', 'headline-sm',
  'title-lg', 'title-md', 'title-sm', 'label-lg', 'label-md', 'label-sm', 'body-lg', 'body-md', 'body-sm',
];

/** The color role of the text; `inherit` keeps the surrounding color. */
export type TextColor =
  | 'inherit'
  | 'on-surface'
  | 'on-surface-variant'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error';

const COLORS: readonly Exclude<TextColor, 'inherit'>[] = [
  'on-surface', 'on-surface-variant', 'primary', 'secondary', 'tertiary', 'error',
];

const scaleRules = SCALES.map(
  (s) =>
    `:host([scale='${s}']) { --_font: var(--md-sys-typescale-${s}); --_tracking: var(--md-sys-typescale-${s}-tracking); }\n` +
    `:host([scale='${s}'][emphasized]) { --_font: var(--md-sys-typescale-emphasized-${s}); }`,
).join('\n');
const colorRules = COLORS.map((c) => `:host([color='${c}']) { color: var(--md-sys-color-${c}); }`).join('\n');

// spec-labels: typography/applying-type, typography/type-scale-tokens
/**
 * Text in one role of the M3 type scale (m3.material.io/styles/typography):
 * display, headline, title, label or body, in large, medium or small, and
 * optionally emphasized; and in a color role.
 *
 * Its content is text, or a native heading or paragraph: a heading keeps
 * its level in the document outline and takes the role's style instead of
 * the browser's (no margins, the role's font). For long-form text with many
 * elements, use md-gb-prose.
 *
 * @slot - The text, or a heading or paragraph with the text.
 */
export class TypographyElement extends LitElement {
  static override styles = [
    css`
      :host {
        display: block;
        font: var(--_font, inherit);
        letter-spacing: var(--_tracking, inherit);
        overflow-wrap: break-word;
      }
      :host([hidden]) {
        display: none;
      }
      ::slotted(:is(h1, h2, h3, h4, h5, h6, p)) {
        margin: 0;
        font: inherit;
        letter-spacing: inherit;
        color: inherit;
      }
    `,
    unsafeCSS(scaleRules),
    unsafeCSS(colorRules),
  ];

  /** The role of the type scale. */
  @property({reflect: true}) scale: TypeScale = 'body-md';

  /** Whether to use the role's emphasized style (a heavier weight). */
  @property({type: Boolean, reflect: true}) emphasized = false;

  /** The color role of the text. */
  @property({reflect: true}) color: TextColor = 'inherit';

  protected override render() {
    return html`<slot></slot>`;
  }
}
