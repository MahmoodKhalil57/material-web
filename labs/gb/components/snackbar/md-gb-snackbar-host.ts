/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './md-gb-snackbar.js';

import {SnackbarHostElement} from './snackbar-host-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** Shows queued snackbars one at a time. */
    'md-gb-snackbar-host': SnackbarHostElement;
  }
}

customElements.define('md-gb-snackbar-host', SnackbarHostElement);
