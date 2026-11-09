/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Standard reasons for closing a sheet, passed in the `close` and `closed`
 * event details.
 */
export const CLOSE_REASONS = {
    /** `close()` was called without a reason. */
    DISMISS: 'dismiss',
    /** The scrim of a modal sheet was clicked. */
    SCRIM: 'scrim',
    /** Escape was pressed in a modal sheet. */
    ESCAPE: 'escape',
    /**
     * The platform back gesture or button (predictive back) closed a modal
     * sheet, or `handleBack()` was called.
     */
    BACK: 'back',
    /** A bottom sheet was swiped or dragged down past its lowest height. */
    SWIPE: 'swipe',
    /** The drag handle was activated on a sheet with no lower height. */
    DRAG_HANDLE: 'drag-handle',
    /** The built-in close icon button of a side sheet was activated. */
    CLOSE_BUTTON: 'close-button',
};
/**
 * Handles Escape on a Light DOM modal sheet by dispatching a cancelable
 * `close` event with the `escape` reason, or calling `close()` when the
 * element has one.
 *
 * @param sheet The sheet root element.
 * @param isModal Returns whether the sheet is currently modal.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export function setupSheetEscape(sheet, isModal, opts) {
    sheet.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || event.defaultPrevented || !isModal()) {
            return;
        }
        const el = sheet;
        event.preventDefault();
        if (typeof el.close === 'function' &&
            !(el instanceof HTMLDialogElement)) {
            el.close(CLOSE_REASONS.ESCAPE);
            return;
        }
        sheet.dispatchEvent(new CustomEvent('close', {
            bubbles: true,
            cancelable: true,
            detail: { reason: CLOSE_REASONS.ESCAPE },
        }));
    }, opts);
}
//# sourceMappingURL=sheet.js.map