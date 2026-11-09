/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/**
 * Standard reasons for closing a snackbar.
 */
export declare const CLOSE_REASONS: {
    readonly ACTION: "action";
    readonly DISMISS: "dismiss";
    readonly TIMEOUT: "timeout";
};
/**
 * Close reason type.
 */
export type CloseReason = (typeof CLOSE_REASONS)[keyof typeof CLOSE_REASONS] | string;
/**
 * Snackbar CSS classes.
 */
export declare const SNACKBAR_CLASSES: {
    readonly snackbar: "snackbar";
    readonly open: "snackbar-open";
    readonly opening: "snackbar-opening";
    readonly closing: "snackbar-closing";
    readonly fixed: "snackbar-fixed";
};
/**
 * State provided to `snackbarClasses()`.
 */
export interface SnackbarClassesState {
    open?: boolean;
    opening?: boolean;
    closing?: boolean;
    fixed?: boolean;
}
/**
 * Returns the class map object for the snackbar based on given state.
 */
export declare function snackbarClasses({ open, opening, closing, fixed, }?: SnackbarClassesState): ClassInfo;
/**
 * Sets up snackbar accessibility and keydown behavior on an element.
 *
 * @param snackbar The snackbar root element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export declare function setupSnackbar(snackbar: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds snackbar classes and setup logic to an element.
 */
export declare const snackbar: (state?: SnackbarClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
