/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {DialogElement} from './dialog-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design dialog component. */
    'md-gb-dialog': DialogElement;
  }
}

customElements.define('md-gb-dialog', DialogElement);
