/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {SegmentedButtonElement} from './segmented-button-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** One segment of a Material Design segmented button set. */
    'md-gb-segmented-button': SegmentedButtonElement;
  }
}

customElements.define('md-gb-segmented-button', SegmentedButtonElement);
