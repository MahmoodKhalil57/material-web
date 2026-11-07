/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

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

const FOCUSABLE =
  ':is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true],[contenteditable=""])' +
  ':not(:disabled,[disabled],[tabindex^="-"],[inert])';

function isFocusable(element: Element): element is HTMLElement {
  if (element.matches(FOCUSABLE)) {
    return true;
  }
  // A custom element without a tabindex is focusable when its shadow root
  // delegates focus (like `md-gb-button`).
  return (
    element.localName.includes('-') &&
    !element.matches(':disabled,[disabled]') &&
    (element.shadowRoot?.delegatesFocus ?? false)
  );
}

function isRendered(element: Element) {
  return element.checkVisibility?.({visibilityProperty: true}) ?? true;
}

function isDisplayContents(element: Element) {
  return getComputedStyle(element).display === 'contents';
}

/**
 * Returns the keyboard-focusable elements inside `root` in flat tree
 * (rendered) order: slots are expanded to their assigned elements and open
 * shadow roots are walked, except for custom elements that delegate focus,
 * which count as one stop.
 */
export function getFocusableElements(root: Element | ShadowRoot): HTMLElement[] {
  const result: HTMLElement[] = [];
  const visit = (node: Element) => {
    if (node instanceof HTMLSlotElement) {
      const assigned = node.assignedElements({flatten: true});
      const children = assigned.length ? assigned : [...node.children];
      children.forEach(visit);
      return;
    }
    if (node.hasAttribute('inert')) {
      return;
    }
    const rendered = isRendered(node);
    // `display: contents` elements have no box but their children do.
    if (!rendered && !isDisplayContents(node)) {
      return;
    }
    if (rendered && isFocusable(node)) {
      result.push(node);
      if (node.shadowRoot?.delegatesFocus) {
        return;
      }
    }
    const children = node.shadowRoot ? node.shadowRoot.children : node.children;
    [...children].forEach(visit);
  };
  [...root.children].forEach(visit);
  return result;
}

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
      if (event.key !== 'Tab' || event.defaultPrevented) {
        return;
      }
      if (dialog.hasAttribute(NO_FOCUS_TRAP_ATTRIBUTE)) {
        return;
      }
      const focusable = getFocusableElements(dialog);
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const path = event.composedPath();
      const current = path.find(
        (target) => target instanceof HTMLElement && focusable.includes(target),
      );
      if (event.shiftKey && (current === first || !current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !current)) {
        event.preventDefault();
        first.focus();
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
