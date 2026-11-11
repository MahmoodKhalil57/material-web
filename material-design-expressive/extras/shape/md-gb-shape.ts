/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ShapeElement} from './shape-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A decorative Material shape that can morph into another. */
    'md-gb-shape': ShapeElement;
  }
}

if (!customElements.get('md-gb-shape')) {
  customElements.define('md-gb-shape', ShapeElement);
}
