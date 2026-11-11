/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {DemoElement} from './demo-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** An example and its code. */
    'md-gb-demo': DemoElement;
  }
}

if (!customElements.get('md-gb-demo')) {
  customElements.define('md-gb-demo', DemoElement);
}
