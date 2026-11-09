/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { TabPanelsElement } from './tab-panels-element.js';
declare global {
    interface HTMLElementTagNameMap {
        /** The swipeable content panels of a set of Material Design tabs. */
        'md-gb-tab-panels': TabPanelsElement;
    }
}
