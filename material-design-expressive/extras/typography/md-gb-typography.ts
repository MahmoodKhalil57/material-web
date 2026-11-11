/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {TypographyElement} from './typography-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** Text in one role of the M3 type scale and a color role. */
    'md-gb-typography': TypographyElement;
  }
}

if (!customElements.get('md-gb-typography')) {
  customElements.define('md-gb-typography', TypographyElement);
}
