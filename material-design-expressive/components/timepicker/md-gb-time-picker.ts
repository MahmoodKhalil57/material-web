/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {TimePickerElement} from './time-picker-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design time picker component. */
    'md-gb-time-picker': TimePickerElement;
  }
}

customElements.define('md-gb-time-picker', TimePickerElement);
