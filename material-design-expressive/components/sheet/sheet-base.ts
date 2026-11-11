/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {ModalSurfaceController} from '../shared/modal-surface.js';
import {
  BACK_REASON,
  type PredictiveBackAnimation,
} from '../../foundations/interaction/gestures/predictive-back.js';
import {isReducedMotion} from '../../styles/motion/motion.js';
import {CLOSE_REASONS} from './sheet.js';

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
export abstract class SheetBase extends LitElement {
  /** Whether the sheet is open. Setting it calls `show()` or `close()`. */
  @property({type: Boolean, reflect: true})
  get open(): boolean {
    return this.modalSurface.open;
  }
  set open(value: boolean) {
    if (value === this.modalSurface.open) {
      return;
    }
    if (value) {
      this.show();
    } else {
      this.close(CLOSE_REASONS.DISMISS);
    }
  }

  /**
   * Whether the sheet is modal: shown above a scrim, blocking the rest of the
   * page, and closed by Escape or a scrim click.
   */
  @property({type: Boolean, reflect: true}) modal = false;

  /** Whether to skip the opening and closing motion. */
  @property({type: Boolean, reflect: true}) quick = false;

  /** Escape, back and scrim close requests, focus, scroll lock and events. */
  protected readonly modalSurface: ModalSurfaceController =
    new ModalSurfaceController(this, {
      dialog: () => this.dialog,
      modal: () => this.modal,
      bubbles: true,
      defaultReason: CLOSE_REASONS.DISMISS,
      waitForMotion: () => this.waitForMotion(),
      onWillShow: () => {
        this.willShow();
      },
      onCloseRequest: (reason) => {
        if (reason === BACK_REASON) {
          this.handleBack();
        } else {
          this.close(reason);
        }
      },
      // Settle back to the resting height after a drag or swipe.
      onCloseCanceled: () => {
        this.requestUpdate();
      },
    });

  /** Whether the sheet is playing its opening motion. */
  protected get isOpening(): boolean {
    return this.modalSurface.opening;
  }

  /** Whether the sheet is playing its closing motion. */
  protected get isClosing(): boolean {
    return this.modalSurface.closing;
  }

  /** The `<dialog>` that holds the sheet. */
  protected get dialog(): HTMLDialogElement | null {
    return this.renderRoot?.querySelector('dialog.sheet-dialog') ?? null;
  }

  /** The sheet container inside the dialog. */
  protected get panel(): HTMLElement | null {
    return this.renderRoot?.querySelector('.sheet-panel') ?? null;
  }

  /** Whether the dialog is shown (open, opening or closing). */
  protected get isShown(): boolean {
    return this.modalSurface.shown;
  }

  /** Opens the sheet. Resolves after the opening motion. */
  show(): Promise<void> {
    return this.modalSurface.show();
  }

  /**
   * Closes the sheet. Resolves after the closing motion.
   *
   * @param reason The reason for closing, passed in the `close` and `closed`
   *     event details (see `CLOSE_REASONS`).
   */
  close(reason: string = CLOSE_REASONS.DISMISS): Promise<void> {
    return this.modalSurface.close(reason);
  }

  /** Called when the sheet starts opening, before it renders open. */
  protected willShow() {}

  /**
   * Handles a back request (the Android back gesture or button, which a
   * modal sheet receives through its dialog): plays the predictive back
   * motion and closes the sheet with reason `back`. If the `close` event is
   * canceled, the sheet settles back. Resolves after the closing motion.
   *
   * Call it for an in-app back control that should behave like the system
   * back.
   */
  async handleBack(): Promise<void> {
    if (!this.open || this.isClosing) {
      return;
    }
    const motion = this.shouldAnimate() ? this.playPredictiveBack() : null;
    await motion?.finished;
    if (!this.open) {
      motion?.cancel();
      return;
    }
    if (!this.backCloses()) {
      // The sheet stays open at another height.
      await motion?.settle();
      return;
    }
    // Hold the back progress through the closing motion.
    await this.close(BACK_REASON);
    if (this.open) {
      await motion?.settle();
    } else {
      motion?.cancel();
    }
  }

  /**
   * Called by `handleBack()` after the back progress: returns whether back
   * closes the sheet. A subclass can move the sheet instead (Compose's
   * bottom sheet goes from expanded to partially expanded) and return false.
   */
  protected backCloses(): boolean {
    return true;
  }

  /** Plays the predictive back transform. Overridden by each sheet. */
  protected playPredictiveBack(): PredictiveBackAnimation | null {
    return null;
  }

  /** Whether the sheet animates (not `quick`, no reduced motion). */
  protected shouldAnimate(): boolean {
    return !this.quick && !isReducedMotion(this);
  }

  /** Resolves when a gesture's settle spring has ended. */
  protected gestureSettled(): Promise<void> {
    return Promise.resolve();
  }

  /** Waits for the panel's and host's CSS transitions to finish. */
  private async waitForMotion(): Promise<void> {
    // A swipe's spring (not a CSS animation) moves the panel off screen.
    await this.gestureSettled();
    if (!this.shouldAnimate()) {
      return;
    }
    // `getAnimations()` flushes style, so transitions that the last render
    // started (including `@starting-style` entries) are listed.
    const animations = [
      ...this.getAnimations(),
      ...(this.panel?.getAnimations() ?? []),
    ];
    await Promise.all(animations.map((a) => a.finished)).catch(() => {});
  }
}
