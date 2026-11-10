/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {TextFieldElement} from './text-field-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design text field (filled or outlined). */
    'md-gb-text-field': TextFieldElement;
  }
}

customElements.define('md-gb-text-field', TextFieldElement);
