/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing, svg} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../internal/aria/delegate.js';

import loadingIndicatorStyles from './loading-indicator.css' with {type: 'css'}; // github-only
// import {styles as loadingIndicatorStyles} from './loading-indicator.cssresult.js'; // google3-only

import {
  DETERMINATE_INITIAL_PATH,
  INDETERMINATE_INITIAL_PATH,
} from './loading-indicator-paths.js';
import {loadingIndicatorClasses} from './loading-indicator.js';

// Separate variable needed for closure.
// spec-labels: loading-indicator/specs/anatomy, loading-indicator/guidelines/anatomy, loading-indicator/specs/variants, loading-indicator/specs/configurations
const baseClass = mixinDelegatesAria(LitElement);

/**
 * A Material Design 3 Expressive loading indicator: a shape that morphs
 * through Material shapes while it turns.
 *
 * Set `value` (0 to 1) to show determinate progress.
 *
 * @csspart indicator - The indicator container.
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-size
 * @cssprop --container-color
 * @cssprop --container-height
 * @cssprop --container-shape
 * @cssprop --container-width
 * @cssprop --progress
 * @cssprop --size - The container size, clamped to 24dp-240dp (48dp default).
 */
export class LoadingIndicatorElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    loadingIndicatorStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }
    `,
  ];

  /** Whether the indicator has a container. */
  @property({type: Boolean, reflect: true}) contained = false;

  /**
   * Progress from 0 to 1. When set, the indicator is determinate; when
   * unset (the default), it is indeterminate.
   */
  @property({type: Number}) value?: number;

  protected override render() {
    const determinate = this.value !== undefined && !Number.isNaN(this.value);
    const progress = determinate ? Math.min(1, Math.max(0, this.value!)) : 0;
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`<div
      part="indicator"
      class="${classMap(
        loadingIndicatorClasses({contained: this.contained, determinate}),
      )}"
      style="${styleMap(determinate ? {'--progress': String(progress)} : {})}"
      role="progressbar"
      aria-label="${ariaLabel || nothing}"
      aria-valuemin="${determinate ? 0 : nothing}"
      aria-valuemax="${determinate ? 100 : nothing}"
      aria-valuenow="${determinate ? Math.round(progress * 100) : nothing}">
      <span class="loading-indicator-spin" aria-hidden="true">
        ${svg`<svg class="loading-indicator-shape" viewBox="0 0 100 100"><path
          d="${determinate ? DETERMINATE_INITIAL_PATH : INDETERMINATE_INITIAL_PATH}"></path></svg>`}
      </span>
    </div>`;
  }
}
