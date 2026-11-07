/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Segments are defined first, so the set sees upgraded segments.
import './md-gb-segmented-button.js';

import {SegmentedButtonSetElement} from './segmented-button-set-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design segmented button set. */
    'md-gb-segmented-button-set': SegmentedButtonSetElement;
  }
}

customElements.define('md-gb-segmented-button-set', SegmentedButtonSetElement);
