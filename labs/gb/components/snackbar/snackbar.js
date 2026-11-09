/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { createClassMapDirective } from '../shared/directives.js';
/**
 * Standard reasons for closing a snackbar.
 */
export const CLOSE_REASONS = {
    ACTION: 'action',
    DISMISS: 'dismiss',
    TIMEOUT: 'timeout',
};
/**
 * Snackbar CSS classes.
 */
export const SNACKBAR_CLASSES = {
    snackbar: 'snackbar',
    open: 'snackbar-open',
    opening: 'snackbar-opening',
    closing: 'snackbar-closing',
    fixed: 'snackbar-fixed',
};
/**
 * Returns the class map object for the snackbar based on given state.
 */
export function snackbarClasses({ open = false, opening = false, closing = false, fixed = false, } = {}) {
    return {
        [SNACKBAR_CLASSES.snackbar]: true,
        [SNACKBAR_CLASSES.open]: open,
        [SNACKBAR_CLASSES.opening]: opening,
        [SNACKBAR_CLASSES.closing]: closing,
        [SNACKBAR_CLASSES.fixed]: fixed,
    };
}
/**
 * Sets up snackbar accessibility and keydown behavior on an element.
 *
 * @param snackbar The snackbar root element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export function setupSnackbar(snackbar, opts) {
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            const el = snackbar;
            if (el.open === false) {
                return;
            }
            event.preventDefault();
            if (typeof el.close === 'function') {
                el.close(CLOSE_REASONS.DISMISS);
            }
            else {
                snackbar.dispatchEvent(new CustomEvent('close', {
                    bubbles: true,
                    cancelable: true,
                    detail: { reason: CLOSE_REASONS.DISMISS },
                }));
            }
        }
    };
    snackbar.addEventListener('keydown', handleKeyDown, opts);
}
/**
 * A Lit directive that adds snackbar classes and setup logic to an element.
 */
export const snackbar = createClassMapDirective({
    getClasses: snackbarClasses,
    setupElement: setupSnackbar,
});
//# sourceMappingURL=snackbar.js.map