/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, type PropertyValues} from 'lit';
import {property, state} from 'lit/decorators.js';
import {CLOSE_REASONS, deepActiveElement} from './sheet.js';

/**
 * Shared open/close lifecycle of `md-gb-bottom-sheet` and `md-gb-side-sheet`.
 *
 * Each sheet renders a `<dialog class="sheet-dialog">` holding a
 * `.sheet-panel`. A modal sheet opens it with `showModal()`, which puts it in
 * the top layer above a `::backdrop` scrim, makes the rest of the page inert
 * (the focus trap) and moves focus into the sheet. A standard sheet opens it
 * non-modally in the page, without moving or trapping focus.
 *
 * Closing animates the panel out first and closes the `<dialog>` after, then
 * returns focus to the element focused when the sheet opened.
 */
export abstract class SheetBase extends LitElement {
  private isOpenInternal = false;

  /** Whether the sheet is open. Setting it calls `show()` or `close()`. */
  @property({type: Boolean, reflect: true})
  get open(): boolean {
    return this.isOpenInternal;
  }
  set open(value: boolean) {
    if (value === this.isOpenInternal) {
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

  @state() protected isOpening = false;
  @state() protected isClosing = false;

  private transitionCounter = 0;
  private returnFocusTo: HTMLElement | null = null;
  private scrimPointerDown = false;

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
    return this.isOpenInternal || this.isClosing;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // A removed sheet can't finish its close motion; settle it closed.
    if (this.isClosing) {
      this.transitionCounter++;
      this.isClosing = false;
    }
  }

  /** Opens the sheet. Resolves after the opening motion. */
  async show(): Promise<void> {
    if (this.isOpenInternal && !this.isClosing) {
      return;
    }
    const preventOpen = !this.dispatchEvent(
      new Event('open', {bubbles: true, cancelable: true}),
    );
    if (preventOpen) {
      return;
    }

    const token = ++this.transitionCounter;
    if (!this.isClosing) {
      this.returnFocusTo = deepActiveElement();
    }
    this.willShow();
    const prev = this.isOpenInternal;
    this.isOpenInternal = true;
    this.requestUpdate('open', prev);
    this.isClosing = false;
    this.isOpening = true;
    await this.updateComplete;
    if (token !== this.transitionCounter) {
      return;
    }
    await this.waitForMotion();
    if (token !== this.transitionCounter) {
      return;
    }
    this.isOpening = false;
    this.dispatchEvent(new Event('opened', {bubbles: true}));
  }

  /**
   * Closes the sheet. Resolves after the closing motion.
   *
   * @param reason The reason for closing, passed in the `close` and `closed`
   *     event details (see `CLOSE_REASONS`).
   */
  async close(reason: string = CLOSE_REASONS.DISMISS): Promise<void> {
    if (!this.isOpenInternal) {
      return;
    }
    const preventClose = !this.dispatchEvent(
      new CustomEvent('close', {
        bubbles: true,
        cancelable: true,
        detail: {reason},
      }),
    );
    if (preventClose) {
      // Settle back to the resting height after a drag or swipe.
      this.requestUpdate();
      return;
    }

    const token = ++this.transitionCounter;
    const prev = this.isOpenInternal;
    this.isOpenInternal = false;
    this.requestUpdate('open', prev);
    this.isOpening = false;
    this.isClosing = true;
    await this.updateComplete;
    if (token !== this.transitionCounter) {
      return;
    }
    await this.waitForMotion();
    if (token !== this.transitionCounter) {
      return;
    }
    this.isClosing = false;
    await this.updateComplete;
    this.restoreFocus();
    this.dispatchEvent(
      new CustomEvent('closed', {bubbles: true, detail: {reason}}),
    );
  }

  /** Called when the sheet starts opening, before it renders open. */
  protected willShow() {}

  protected override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    this.syncDialog(changed.has('modal'));
  }

  /** Opens or closes the `<dialog>` to match the sheet state. */
  private syncDialog(modalChanged: boolean) {
    const dialog = this.dialog;
    if (!dialog) {
      return;
    }
    if (!this.isShown) {
      if (dialog.open) {
        dialog.close();
      }
      return;
    }
    const isModal = dialog.matches(':modal');
    if (dialog.open && (modalChanged || isModal !== this.modal)) {
      dialog.close();
    }
    if (dialog.open || !this.isConnected) {
      return;
    }
    if (this.modal) {
      dialog.showModal();
    } else {
      // Not `show()`, which moves focus into the dialog: a standard sheet
      // opens beside the content without taking focus.
      dialog.setAttribute('open', '');
    }
  }

  /** Waits for the panel's and host's CSS transitions to finish. */
  private async waitForMotion(): Promise<void> {
    const reducedMotion = globalThis.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )?.matches;
    if (this.quick || reducedMotion) {
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

  private restoreFocus() {
    const target = this.returnFocusTo;
    this.returnFocusTo = null;
    if (!target?.isConnected) {
      return;
    }
    const active = deepActiveElement();
    const focusLeft =
      !active || active === document.body || this.matches(':focus-within');
    if (focusLeft) {
      target.focus();
    }
  }

  // The listeners below are bound on the rendered `<dialog>`.

  /** Escape on a modal dialog: animate closed instead of closing at once. */
  protected readonly handleDialogCancel = (event: Event) => {
    event.preventDefault();
    if (this.modal) {
      this.close(CLOSE_REASONS.ESCAPE);
    }
  };

  /**
   * The dialog closed without `close()`, e.g. the browser forced a close
   * after repeated Escape presses. Sync the sheet state.
   */
  protected readonly handleDialogClose = () => {
    const dialog = this.dialog;
    if (!this.isOpenInternal || !dialog || dialog.open) {
      return;
    }
    this.transitionCounter++;
    this.isOpenInternal = false;
    this.isOpening = false;
    this.isClosing = false;
    this.requestUpdate('open', true);
    this.restoreFocus();
    const detail = {reason: CLOSE_REASONS.ESCAPE};
    this.dispatchEvent(new CustomEvent('close', {bubbles: true, detail}));
    this.dispatchEvent(new CustomEvent('closed', {bubbles: true, detail}));
  };

  /** Pointer down on the dialog itself, outside the panel, is on the scrim. */
  protected readonly handleDialogPointerDown = (event: PointerEvent) => {
    this.scrimPointerDown = event.target === event.currentTarget;
  };

  /** A click that started and ended on the scrim closes a modal sheet. */
  protected readonly handleDialogClick = (event: MouseEvent) => {
    const onScrim =
      event.target === event.currentTarget && this.scrimPointerDown;
    this.scrimPointerDown = false;
    if (onScrim && this.modal) {
      this.close(CLOSE_REASONS.SCRIM);
    }
  };
}
