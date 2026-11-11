/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {GridElement} from './grid-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** The M3 layout grid: columns that adapt across breakpoints. */
    'md-gb-grid': GridElement;
  }
}

if (!customElements.get('md-gb-grid')) {
  customElements.define('md-gb-grid', GridElement);
}
