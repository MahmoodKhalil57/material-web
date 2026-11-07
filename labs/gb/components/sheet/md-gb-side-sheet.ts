/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {SideSheetElement} from './side-sheet-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design side sheet. */
    'md-gb-side-sheet': SideSheetElement;
  }
}

customElements.define('md-gb-side-sheet', SideSheetElement);
