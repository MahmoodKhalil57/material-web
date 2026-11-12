/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, html, LitElement, type CSSResultOrNative} from 'lit';
import {property, query} from 'lit/decorators.js';

import {focusableWhileScrollable} from '../../foundations/accessibility/scroll-focus.js';
import {tokenize} from './highlight.js';

/**
 * One file of a demo's code, highlighted: the `code` of a `language`, shown
 * in a `md-gb-demo` under its `label`. The code is a property (not markup),
 * so a JSON spec can carry it.
 *
 * Highlighting uses the M3 color roles: tags and keywords in primary,
 * attributes and properties in tertiary, strings in secondary, comments in
 * on-surface-variant.
 *
 * @cssprop --max-lines - Lines shown while the demo collapses its code.
 */
export class DemoCodeElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    css`
      :host {
        display: block;
      }
      :host([hidden]) {
        display: none;
      }
      pre {
        margin: 0;
        padding: var(--md-sys-space-200, 16px);
        overflow: auto;
        font-family: ui-monospace, 'Roboto Mono', SFMono-Regular, Menlo, Consolas, monospace;
        font-size: var(--md-sys-typescale-body-md-size, 14px);
        line-height: var(--md-sys-typescale-body-md-line-height, 20px);
        color: var(--md-sys-color-on-surface);
        tab-size: 2;
      }
      :host([collapsed]) pre {
        max-block-size: calc(var(--max-lines, 4) * var(--md-sys-typescale-body-md-line-height, 20px));
        overflow: hidden;
        mask-image: linear-gradient(to bottom, black 60%, transparent);
      }
      .tag,
      .keyword {
        color: var(--md-sys-color-primary);
      }
      .attr,
      .property,
      .number {
        color: var(--md-sys-color-tertiary);
      }
      .string {
        color: var(--md-sys-color-secondary);
      }
      .comment {
        color: var(--md-sys-color-on-surface-variant);
        font-style: italic;
      }
      .punctuation {
        color: var(--md-sys-color-on-surface-variant);
      }
    `,
  ];

  /** The code, as plain text. */
  @property() code = '';

  /** Its language: `html`, `css`, `js` or `ts` (others aren't highlighted). */
  @property({reflect: true}) language = 'html';

  /** The file's name in the demo's tabs (default: the language). */
  @property() label = '';

  /** Whether only the first lines show (the demo's Show code expands it). */
  @property({type: Boolean, reflect: true}) collapsed = false;

  /** The number of lines of the code. */
  get lines(): number {
    return this.code ? this.code.split('\n').length : 0;
  }

  @query('pre') private readonly pre!: HTMLElement | null;
  private stopScrollFocus?: () => void;

  override connectedCallback() {
    super.connectedCallback();
    // Once rendered again (moved in the page).
    if (this.hasUpdated && this.pre) this.stopScrollFocus = focusableWhileScrollable(this.pre);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.stopScrollFocus?.();
  }

  protected override firstUpdated() {
    // A long line scrolls the code: the keyboard can reach and scroll it.
    if (this.pre) this.stopScrollFocus = focusableWhileScrollable(this.pre);
  }

  protected override render() {
    const tokens = tokenize(this.code, this.language);
    return html`<pre part="code"><code>${tokens.map((t) =>
      t.kind ? html`<span class=${t.kind}>${t.text}</span>` : t.text,
    )}</code></pre>`;
  }
}
