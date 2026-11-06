/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LoadingIndicatorElement} from './loading-indicator-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-loading-indicator': LoadingIndicatorElement;
  }
}

customElements.define('md-gb-loading-indicator', LoadingIndicatorElement);
