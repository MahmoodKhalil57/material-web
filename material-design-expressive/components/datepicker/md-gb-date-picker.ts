/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {DatePickerElement} from './date-picker-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design date picker (docked or modal, single date or range). */
    'md-gb-date-picker': DatePickerElement;
  }
}

customElements.define('md-gb-date-picker', DatePickerElement);
