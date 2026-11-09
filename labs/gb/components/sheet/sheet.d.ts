/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Standard reasons for closing a sheet, passed in the `close` and `closed`
 * event details.
 */
export declare const CLOSE_REASONS: {
    /** `close()` was called without a reason. */
    readonly DISMISS: "dismiss";
    /** The scrim of a modal sheet was clicked. */
    readonly SCRIM: "scrim";
    /** Escape was pressed in a modal sheet. */
    readonly ESCAPE: "escape";
    /**
     * The platform back gesture or button (predictive back) closed a modal
     * sheet, or `handleBack()` was called.
     */
    readonly BACK: "back";
    /** A bottom sheet was swiped or dragged down past its lowest height. */
    readonly SWIPE: "swipe";
    /** The drag handle was activated on a sheet with no lower height. */
    readonly DRAG_HANDLE: "drag-handle";
    /** The built-in close icon button of a side sheet was activated. */
    readonly CLOSE_BUTTON: "close-button";
};
/** Close reason type. */
export type CloseReason = (typeof CLOSE_REASONS)[keyof typeof CLOSE_REASONS] | string;
/**
 * Handles Escape on a Light DOM modal sheet by dispatching a cancelable
 * `close` event with the `escape` reason, or calling `close()` when the
 * element has one.
 *
 * @param sheet The sheet root element.
 * @param isModal Returns whether the sheet is currently modal.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export declare function setupSheetEscape(sheet: HTMLElement, isModal: () => boolean, opts?: {
    signal?: AbortSignal;
}): void;
