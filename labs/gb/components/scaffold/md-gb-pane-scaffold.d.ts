/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { PaneScaffoldElement } from './pane-scaffold-element.js';
declare global {
    interface HTMLElementTagNameMap {
        /** A Material Design pane scaffold (list-detail, supporting pane, feed). */
        'md-gb-pane-scaffold': PaneScaffoldElement;
    }
}
