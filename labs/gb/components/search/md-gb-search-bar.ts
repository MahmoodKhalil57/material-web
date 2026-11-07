/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './md-gb-search-view.js';

import {SearchBarElement} from './search-bar-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design search bar. */
    'md-gb-search-bar': SearchBarElement;
  }
}

customElements.define('md-gb-search-bar', SearchBarElement);
