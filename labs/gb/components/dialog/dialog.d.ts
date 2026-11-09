/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
import { getFocusableElements } from '../shared/modal-surface.js';
/**
 * Dialog CSS classes.
 */
export declare const DIALOG_CLASSES: {
    readonly dialog: "dialog";
    readonly fullScreen: "dialog-full-screen";
    readonly closing: "dialog-closing";
    readonly hasIcon: "dialog-has-icon";
    readonly hasHeadline: "dialog-has-headline";
    readonly hasActions: "dialog-has-actions";
    readonly scrollable: "dialog-scrollable";
    readonly scrolledFromTop: "dialog-scrolled-from-top";
    readonly scrolledFromBottom: "dialog-scrolled-from-bottom";
};
/**
 * State provided to `dialogClasses()`.
 */
export interface DialogClassesState {
    /** Whether the dialog uses the full-screen variant. */
    fullScreen?: boolean;
    /** Whether the dialog is playing its exit transition. */
    closing?: boolean;
    /** Whether the dialog has a hero icon. */
    hasIcon?: boolean;
    /** Whether the dialog has a headline. */
    hasHeadline?: boolean;
    /** Whether the dialog has actions. */
    hasActions?: boolean;
    /** Whether the content overflows and scrolls. */
    scrollable?: boolean;
    /** Whether the content is scrolled away from its top edge. */
    scrolledFromTop?: boolean;
    /** Whether the content is scrolled away from its bottom edge. */
    scrolledFromBottom?: boolean;
}
/**
 * Returns the class map object for the dialog based on given state.
 */
export declare function dialogClasses({ fullScreen, closing, hasIcon, hasHeadline, hasActions, scrollable, scrolledFromTop, scrolledFromBottom, }?: DialogClassesState): ClassInfo;
export { getFocusableElements };
/**
 * Set this attribute on the `<dialog>` to turn off `setupDialog()` focus
 * trapping.
 */
export declare const NO_FOCUS_TRAP_ATTRIBUTE = "data-no-focus-trap";
/**
 * Sets up Tab focus trapping on a modal `<dialog>`: Tab on the last focusable
 * element wraps to the first, and Shift+Tab on the first wraps to the last.
 * A native modal dialog makes the rest of the page inert, but lets Tab leave
 * the page for the browser UI; this keeps focus cycling inside the dialog.
 * Add `data-no-focus-trap` to the dialog to turn it off.
 *
 * @param dialog The `<dialog>` element (or a dialog-like root).
 * @param opts Options, supports AbortSignal for cleanup.
 */
export declare function setupDialog(dialog: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds dialog classes and focus trapping to a
 * `<dialog>` element.
 *
 * @example
 * ```ts
 * html`
 *   <dialog class="${dialog({hasHeadline: true})}">...</dialog>
 * `;
 * ```
 */
export declare const dialog: (state?: DialogClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
