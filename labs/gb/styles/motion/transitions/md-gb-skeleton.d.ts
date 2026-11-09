/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { SkeletonElement } from './skeleton-element.js';
declare global {
    interface HTMLElementTagNameMap {
        /** A Material Design skeleton loader. */
        'md-gb-skeleton': SkeletonElement;
    }
}
