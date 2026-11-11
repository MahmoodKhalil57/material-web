/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {StackElement} from './stack-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A column or row of children spaced with the M3 spacing scale. */
    'md-gb-stack': StackElement;
  }
}

if (!customElements.get('md-gb-stack')) {
  customElements.define('md-gb-stack', StackElement);
}
