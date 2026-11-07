/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './md-gb-carousel-item.js';
import {CarouselElement} from './carousel-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design carousel. */
    'md-gb-carousel': CarouselElement;
  }
}

customElements.define('md-gb-carousel', CarouselElement);
