/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ProseElement} from './prose-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A container that styles long-form text with the M3 type scale. */
    'md-gb-prose': ProseElement;
  }
}

if (!customElements.get('md-gb-prose')) {
  customElements.define('md-gb-prose', ProseElement);
}
