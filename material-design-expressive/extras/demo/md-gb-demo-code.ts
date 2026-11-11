/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {DemoCodeElement} from './demo-code-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** One highlighted file of a demo's code. */
    'md-gb-demo-code': DemoCodeElement;
  }
}

if (!customElements.get('md-gb-demo-code')) {
  customElements.define('md-gb-demo-code', DemoCodeElement);
}
