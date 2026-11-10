/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {NavDrawerItemElement} from './nav-drawer-item-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design navigation drawer item custom element. */
    'md-gb-nav-drawer-item': NavDrawerItemElement;
  }
}

if (!customElements.get('md-gb-nav-drawer-item')) {
  customElements.define('md-gb-nav-drawer-item', NavDrawerItemElement);
}
