/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { TooltipElement } from './tooltip-element.js';
declare global {
    interface HTMLElementTagNameMap {
        /** A Material Design plain or rich tooltip. */
        'md-gb-tooltip': TooltipElement;
    }
}
