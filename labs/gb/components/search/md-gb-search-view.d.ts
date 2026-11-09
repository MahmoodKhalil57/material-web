/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { SearchViewElement } from './search-view-element.js';
declare global {
    interface HTMLElementTagNameMap {
        /** Focused search: suggestions or results opened from a search bar. */
        'md-gb-search-view': SearchViewElement;
    }
}
