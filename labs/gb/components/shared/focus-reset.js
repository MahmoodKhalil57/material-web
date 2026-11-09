/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { deepActiveElement } from './anchored-overlay.js';
/**
 * The Escape key leaves the focused element (interaction/inputs.md "Physical
 * keyboard", Escape key): "The Escape key should remove any visible focus
 * indicators and set the focus order to 0" and "should remove the text cursor
 * when typing, but should not remove already-typed text".
 *
 * A document level listener blurs the focused element (its focus ring and a
 * text field's caret go away, the typed text stays) and moves the sequential
 * focus starting point to the top of the document, so the next Tab starts
 * from the first focusable element.
 *
 * Escape that already did something else is left alone: a handler that
 * called `preventDefault()`, and Escape that closed a popover or dialog (it
 * moved focus itself, back to the invoker). Escape inside an input method
 * composition is left to the editor.
 */
let installed = false;
/** Moves the sequential focus navigation starting point to the document start. */
export function resetFocusOrder() {
    const body = document.body;
    if (!body)
        return;
    const hadTabindex = body.hasAttribute('tabindex');
    if (!hadTabindex)
        body.tabIndex = -1;
    body.focus({ preventScroll: true });
    if (!hadTabindex)
        body.removeAttribute('tabindex');
}
/** Removes focus from the focused element and resets the focus order. */
export function leaveFocus() {
    const active = deepActiveElement();
    if (!active || active === document.body)
        return;
    active.blur?.();
    resetFocusOrder();
}
/**
 * Installs the Escape key behavior once per document. Safe to call from
 * every component module.
 */
export function installEscapeFocusReset() {
    if (installed || typeof document === 'undefined')
        return;
    installed = true;
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' ||
            event.defaultPrevented ||
            event.isComposing ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey) {
            return;
        }
        const before = deepActiveElement();
        if (!before || before === document.body)
            return;
        // Let an overlay that Escape closes move focus first.
        setTimeout(() => {
            if (deepActiveElement() === before)
                leaveFocus();
        });
    });
}
installEscapeFocusReset();
//# sourceMappingURL=focus-reset.js.map