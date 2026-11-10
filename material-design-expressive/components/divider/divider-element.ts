/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';

import dividerStyles from './divider.css' with {type: 'css'}; // github-only
// import {styles as dividerStyles} from './divider.cssresult.js'; // google3-only

import {divider} from './divider.js';

/**
 * A Material Design divider component.
 *
 * @csspart divider - The divider element.
 * @cssprop --color
 * @cssprop --thickness
 * @cssprop --inset-leading-space
 * @cssprop --inset-trailing-space
 */
export class DividerElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    dividerStyles,
    css`
      :host {
        display: flex;
      }
      .divider {
        flex: 1;
      }
      :host(:not([vertical])) {
        width: 100%;
      }
      :host([vertical]) {
        min-height: 100%;
      }
    `,
  ];

  /**
   * Whether or not the divider is vertical.
   */
  @property({type: Boolean, reflect: true}) vertical = false;

  /** Indents both ends 16dp (spec: middle-inset divider). */
  @property({type: Boolean, reflect: true}) inset = false;

  /** Indents the leading end 16dp (spec: inset divider). */
  @property({type: Boolean, reflect: true, attribute: 'inset-start'})
  insetStart = false;

  /** Indents the trailing end 16dp. */
  @property({type: Boolean, reflect: true, attribute: 'inset-end'})
  insetEnd = false;

  protected override render() {
    return html`<div part="divider" class="${divider(this)}"></div>`;
  }
}
