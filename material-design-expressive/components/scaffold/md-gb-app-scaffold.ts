/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AppScaffoldElement} from './app-scaffold-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design app scaffold (bars, rails, FAB, snackbar). */
    'md-gb-app-scaffold': AppScaffoldElement;
  }
}

customElements.define('md-gb-app-scaffold', AppScaffoldElement);
