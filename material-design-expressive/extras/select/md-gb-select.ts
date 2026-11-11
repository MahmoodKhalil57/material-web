/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './md-gb-select-option.js';
import {SelectElement} from './select-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-select': SelectElement;
  }
}

customElements.define('md-gb-select', SelectElement);
