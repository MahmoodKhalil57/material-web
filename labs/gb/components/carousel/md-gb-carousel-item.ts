/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CarouselItemElement} from './carousel-item-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design carousel item. */
    'md-gb-carousel-item': CarouselItemElement;
  }
}

customElements.define('md-gb-carousel-item', CarouselItemElement);
