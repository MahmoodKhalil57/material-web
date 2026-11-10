/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';
import {getFocusableElements, trapTabFocus} from '../shared/modal-surface.js';

/**
 * Dialog CSS classes.
 */
export const DIALOG_CLASSES = {
  dialog: 'dialog',
  fullScreen: 'dialog-full-screen',
  closing: 'dialog-closing',
  hasIcon: 'dialog-has-icon',
  hasHeadline: 'dialog-has-headline',
  hasActions: 'dialog-has-actions',
  scrollable: 'dialog-scrollable',
  scrolledFromTop: 'dialog-scrolled-from-top',
  scrolledFromBottom: 'dialog-scrolled-from-bottom',
} as const;

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
export function dialogClasses({
  fullScreen = false,
  closing = false,
  hasIcon = false,
  hasHeadline = false,
  hasActions = false,
  scrollable = false,
  scrolledFromTop = false,
  scrolledFromBottom = false,
}: DialogClassesState = {}): ClassInfo {
  return {
    [DIALOG_CLASSES.dialog]: true,
    [DIALOG_CLASSES.fullScreen]: fullScreen,
    [DIALOG_CLASSES.closing]: closing,
    [DIALOG_CLASSES.hasIcon]: hasIcon,
    [DIALOG_CLASSES.hasHeadline]: hasHeadline,
    [DIALOG_CLASSES.hasActions]: hasActions,
    [DIALOG_CLASSES.scrollable]: scrollable,
    [DIALOG_CLASSES.scrolledFromTop]: scrollable && scrolledFromTop,
    [DIALOG_CLASSES.scrolledFromBottom]: scrollable && scrolledFromBottom,
  };
}

export {getFocusableElements};

/**
 * Set this attribute on the `<dialog>` to turn off `setupDialog()` focus
 * trapping.
 */
export const NO_FOCUS_TRAP_ATTRIBUTE = 'data-no-focus-trap';

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
export function setupDialog(
  dialog: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  dialog.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (
        event.key === 'Tab' &&
        !event.defaultPrevented &&
        !dialog.hasAttribute(NO_FOCUS_TRAP_ATTRIBUTE)
      ) {
        trapTabFocus(event, dialog);
      }
    },
    opts,
  );
}

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
export const dialog = createClassMapDirective({
  getClasses: dialogClasses,
  setupElement: setupDialog,
});
