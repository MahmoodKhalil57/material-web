/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { LitElement } from 'lit';
import { ModalSurfaceController } from '../shared/modal-surface.js';
import { type PredictiveBackAnimation } from '../shared/predictive-back.js';
/**
 * Shared open/close lifecycle of `md-gb-bottom-sheet` and `md-gb-side-sheet`,
 * on the shared `ModalSurfaceController`.
 *
 * Each sheet renders a `<dialog class="sheet-dialog">` holding a
 * `.sheet-panel`. A modal sheet opens it with `showModal()`, which puts it in
 * the top layer above a `::backdrop` scrim, makes the rest of the page inert
 * (the focus trap), moves focus into the sheet and locks page scrolling. A
 * standard sheet opens it non-modally in the page, without moving or trapping
 * focus or locking scrolling.
 *
 * Closing animates the panel out first and closes the `<dialog>` after, then
 * returns focus to the element focused when the sheet opened.
 *
 * Predictive back: the modal `<dialog>` receives the platform's close
 * requests (its close watcher) as `cancel` events. Escape closes with reason
 * `escape`; the Android back gesture or button plays the predictive back
 * motion and closes with reason `back` (see `handleBack()`).
 */
export declare abstract class SheetBase extends LitElement {
    /** Whether the sheet is open. Setting it calls `show()` or `close()`. */
    get open(): boolean;
    set open(value: boolean);
    /**
     * Whether the sheet is modal: shown above a scrim, blocking the rest of the
     * page, and closed by Escape or a scrim click.
     */
    modal: boolean;
    /** Whether to skip the opening and closing motion. */
    quick: boolean;
    /** Escape, back and scrim close requests, focus, scroll lock and events. */
    protected readonly modalSurface: ModalSurfaceController;
    /** Whether the sheet is playing its opening motion. */
    protected get isOpening(): boolean;
    /** Whether the sheet is playing its closing motion. */
    protected get isClosing(): boolean;
    /** The `<dialog>` that holds the sheet. */
    protected get dialog(): HTMLDialogElement | null;
    /** The sheet container inside the dialog. */
    protected get panel(): HTMLElement | null;
    /** Whether the dialog is shown (open, opening or closing). */
    protected get isShown(): boolean;
    /** Opens the sheet. Resolves after the opening motion. */
    show(): Promise<void>;
    /**
     * Closes the sheet. Resolves after the closing motion.
     *
     * @param reason The reason for closing, passed in the `close` and `closed`
     *     event details (see `CLOSE_REASONS`).
     */
    close(reason?: string): Promise<void>;
    /** Called when the sheet starts opening, before it renders open. */
    protected willShow(): void;
    /**
     * Handles a back request (the Android back gesture or button, which a
     * modal sheet receives through its dialog): plays the predictive back
     * motion and closes the sheet with reason `back`. If the `close` event is
     * canceled, the sheet settles back. Resolves after the closing motion.
     *
     * Call it for an in-app back control that should behave like the system
     * back.
     */
    handleBack(): Promise<void>;
    /**
     * Called by `handleBack()` after the back progress: returns whether back
     * closes the sheet. A subclass can move the sheet instead (Compose's
     * bottom sheet goes from expanded to partially expanded) and return false.
     */
    protected backCloses(): boolean;
    /** Plays the predictive back transform. Overridden by each sheet. */
    protected playPredictiveBack(): PredictiveBackAnimation | null;
    /** Whether the sheet animates (not `quick`, no reduced motion). */
    protected shouldAnimate(): boolean;
    /** Resolves when a gesture's settle spring has ended. */
    protected gestureSettled(): Promise<void>;
    /** Waits for the panel's and host's CSS transitions to finish. */
    private waitForMotion;
}
