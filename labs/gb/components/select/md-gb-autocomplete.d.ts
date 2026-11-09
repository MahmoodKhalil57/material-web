/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import './md-gb-select-option.js';
import { AutocompleteElement } from './autocomplete-element.js';
declare global {
    interface HTMLElementTagNameMap {
        /** A Material Design component. */
        'md-gb-autocomplete': AutocompleteElement;
    }
}
