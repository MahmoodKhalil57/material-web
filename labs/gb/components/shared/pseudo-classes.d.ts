/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export { isDisabled } from '../../../aria/pseudo-classes.js';
/**
 * Cross-component classes for emulating pseudo-classes.
 *
 * All components that style with psuedo-classes for their DOM structure also
 * support emulating these states.
 *
 * @example
 * ```html
 * <button class="ripple active">Pressed ripple</button>
 * ```
 */
export declare const PSEUDO_CLASSES: {
    active: string;
    checked: string;
    disabled: string;
    focus: string;
    focusVisible: string;
    hover: string;
    indeterminate: string;
    invalid: string;
};
