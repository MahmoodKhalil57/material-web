/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  type CSSResultOrNative,
  html,
  nothing,
  type PropertyValues,
} from 'lit';
import {property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {iconButton} from '../iconbutton/icon-button.js';
import {DragGesture, settleAnchor} from '../shared/drag-gesture.js';
import {hasSlotted} from '../shared/has-slotted.js';
import {
  playPredictiveBack,
  type PredictiveBackAnimation,
} from './predictive-back.js';
import {CLOSE_REASONS} from './sheet.js';
import {SheetBase} from './sheet-base.js';
import {
  SIDE_SHEET_CLASSES,
  SIDE_SHEET_POSITIONAL_THRESHOLD,
  SIDE_SHEET_VELOCITY_THRESHOLD_PX_PER_S,
  sideSheetClasses,
} from './side-sheet.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import iconButtonStyles from '../iconbutton/icon-button.css' with {type: 'css'}; // github-only
// import iconButtonStyles from '../iconbutton/icon-button.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import sideSheetStyles from './side-sheet.css' with {type: 'css'}; // github-only
// import sideSheetStyles from './side-sheet.cssresult.js'; // google3-only

// spec-labels: side-sheets/guidelines/anatomy/divider-optional,
// spec-labels: side-sheets/guidelines/anatomy/back-icon-button-optional,
// spec-labels: side-sheets/specs/modal-side-sheet,
// spec-labels: side-sheets/specs/standard-side-sheet/standard-side-sheet-measurements,
// spec-labels: side-sheets/guidelines/anatomy, side-sheets/specs/standard-side-sheet,
// spec-labels: side-sheets/guidelines, side-sheets/specs/modal-side-sheet/modal-side-sheet-measurements,
// spec-labels: side-sheets/guidelines/anatomy/close-icon-button-optional,
// spec-labels: side-sheets/guidelines/anatomy/container,
// spec-labels: side-sheets/guidelines/anatomy/action-buttons-optional
/**
 * A Material Design side sheet: supplementary content along the inline end
 * edge of the window (the left edge in right-to-left layouts).
 *
 * A standard sheet is part of the layout: place it at the end of a flex row
 * and the content beside it shrinks while it opens. A modal sheet (`modal`)
 * is a dialog above a scrim that traps focus and closes on Escape or a scrim
 * click. A `detached` sheet floats inset from the window edges with rounded
 * corners.
 *
 * The header has an optional back icon button (`has-back-button`, fires
 * `back`), the headline and a close icon button that closes the sheet.
 *
 * A modal sheet follows a horizontal drag toward its edge (on the sheet or
 * the scrim) and, released past half its width or flung faster than
 * 400px/s, closes with reason `swipe`; otherwise it springs back open
 * (Compose anchored-draggable thresholds, as in the modal navigation
 * drawer). The close button and the scrim are the single-pointer
 * alternatives (WCAG 2.5.7); keep the close button (`hide-close-button` only
 * when the sheet has another close control). Set `gestures-disabled` to turn
 * swiping off.
 *
 * Predictive back (Android back gesture or button, through the modal
 * dialog's close watcher; or `handleBack()`): the sheet scales toward its
 * edge, detaching from the window's top and bottom edges, then closes with
 * reason `back`.
 *
 * A modal sheet is in the top layer, so nothing on the page covers it or its
 * focused controls; while it is open the rest of the page is inert.
 *
 * @fires {Event} open - Fired when the sheet begins opening. Cancelable.
 * @fires {Event} opened - Fired after the opening motion.
 * @fires {CustomEvent<{reason: string}>} close - Fired when the sheet begins closing. Cancelable; canceling keeps it open.
 * @fires {CustomEvent<{reason: string}>} closed - Fired after the closing motion.
 * @fires {Event} back - Fired when the back icon button is activated.
 * @slot - The sheet content. It scrolls vertically when taller than the sheet.
 * @slot headline - Headline content; replaces the `headline` text.
 * @slot actions - Action buttons at the bottom of the sheet, such as Save and Cancel.
 * @csspart dialog - The `<dialog>` holding the sheet; its `::backdrop` is the scrim.
 * @csspart container - The sheet container.
 * @csspart header - The header row.
 * @csspart headline - The headline.
 * @csspart content - The container of the default slot.
 * @csspart actions - The container of the actions slot.
 * @cssprop --container-color - Container color.
 * @cssprop --container-elevation - Container box shadow.
 * @cssprop --container-shape - Corner radius (the inline start corners of a docked modal sheet; every corner of a detached sheet).
 * @cssprop --container-width - Container width (capped at `--max-width`).
 * @cssprop --container-height - Height of a standard sheet.
 * @cssprop --container-margin - Inset from the window edges (16px when detached).
 * @cssprop --max-width - Maximum container width.
 * @cssprop --divider-color - Divider color.
 * @cssprop --headline - Headline typography.
 * @cssprop --headline-axes - Headline font variation settings.
 * @cssprop --headline-color - Headline color.
 * @cssprop --headline-tracking - Headline letter spacing.
 * @cssprop --padding-inline - Start and end padding.
 * @cssprop --icon-padding-inline - Header padding next to the back or close icon button.
 * @cssprop --header-gap - Space between header elements.
 * @cssprop --header-height - Header minimum height.
 * @cssprop --actions-height - Actions row minimum height.
 * @cssprop --actions-padding-block-start - Space above the actions.
 * @cssprop --actions-padding-block-end - Space below the actions.
 * @cssprop --scrim-color - Scrim color of a modal sheet.
 * @cssprop --scrim-opacity - Scrim opacity of a modal sheet.
 */
export class SideSheetElement extends SheetBase {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    iconButtonStyles,
    sideSheetStyles,
    css`
      :host([hidden]) {
        display: none;
      }
    `,
  ];

  /**
   * Whether the sheet floats inset from the window edges with rounded
   * corners, instead of touching them.
   */
  @property({type: Boolean, reflect: true}) detached = false;

  /**
   * Whether to draw dividers: along the inline start edge of a standard
   * docked sheet, and above the actions.
   */
  @property({type: Boolean, reflect: true}) divider = false;

  /** The headline text. */
  @property() headline = '';

  /** Whether to show the back icon button before the headline. */
  @property({type: Boolean, attribute: 'has-back-button'})
  hasBackButton = false;

  /**
   * Whether to hide the close icon button. Material requires a close
   * affordance in every side sheet; provide another one when hiding it.
   */
  @property({type: Boolean, attribute: 'hide-close-button'})
  hideCloseButton = false;

  /** Accessible label of the back icon button. */
  @property({attribute: 'back-label'}) backLabel = 'Back';

  /** Accessible label of the close icon button. */
  @property({attribute: 'close-label'}) closeLabel = 'Close';

  /**
   * Accessible label of the sheet dialog, used when it has no headline.
   */
  @property() label = '';

  /** Whether to turn off swipe to dismiss on a modal sheet. */
  @property({type: Boolean, attribute: 'gestures-disabled'})
  gesturesDisabled = false;

  /**
   * While a modal sheet is dragged: how far it is dragged toward its edge,
   * in px (0 is open, the sheet width is closed). Null when not dragging.
   */
  @state() private dragOffset: number | null = null;
  private dragWidth = 0;
  /** 1 when the sheet closes toward +x (LTR), -1 in RTL. */
  private dragDirection = 1;
  private dragGesture: DragGesture | null = null;
  private dragTarget: HTMLElement | null = null;

  override connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated) {
      this.syncDragGesture();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.dragGesture?.disconnect();
    this.dragGesture = null;
    this.dragTarget = null;
    this.dragOffset = null;
  }

  protected override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    this.syncDragGesture();
  }

  /** Swipe to dismiss: tracks horizontal drags on the modal `<dialog>`. */
  private syncDragGesture() {
    const target = this.isConnected && this.modal ? this.dialog : null;
    if (target === this.dragTarget) {
      return;
    }
    this.dragGesture?.disconnect();
    this.dragTarget = target;
    this.dragGesture = target
      ? new DragGesture(target, {
          axis: 'x',
          canStart: () =>
            this.modal && this.open && !this.isClosing && !this.gesturesDisabled,
          onStart: () => {
            const panel = this.panel;
            this.dragWidth = panel?.offsetWidth ?? 0;
            this.dragDirection =
              panel && getComputedStyle(panel).direction === 'rtl' ? -1 : 1;
            this.dragOffset = 0;
          },
          onMove: (delta) => {
            this.dragOffset = this.closingOffset(delta);
          },
          onEnd: (delta, velocity) => this.settleDrag(delta, velocity),
          onCancel: () => {
            this.dragOffset = null;
          },
        })
      : null;
  }

  /** How far a drag of `delta` px moved the sheet toward its edge. */
  private closingOffset(delta: number) {
    return Math.min(this.dragWidth, Math.max(0, delta * this.dragDirection));
  }

  /**
   * Settles a released drag open or closed (Compose `AnchoredDraggableState`
   * thresholds). Clearing the drag offset in the same render as the close
   * lets the panel spring from where it was released.
   */
  private settleDrag(delta: number, velocity: number) {
    const offset = this.closingOffset(delta);
    const target = settleAnchor(
      [0, this.dragWidth],
      0,
      offset,
      velocity * this.dragDirection,
      {
        positionalThreshold: (distance) =>
          distance * SIDE_SHEET_POSITIONAL_THRESHOLD,
        velocityThreshold: SIDE_SHEET_VELOCITY_THRESHOLD_PX_PER_S,
      },
    );
    this.dragOffset = null;
    if (this.dragWidth > 0 && target === this.dragWidth) {
      this.close(CLOSE_REASONS.SWIPE);
    }
  }

  protected override playPredictiveBack(): PredictiveBackAnimation | null {
    const dialog = this.dialog;
    if (!dialog) {
      return null;
    }
    return playPredictiveBack(dialog, {
      kind: 'side',
      edge: 'end',
      measure: this.panel,
    });
  }

  private readonly handleBackClick = () => {
    this.dispatchEvent(new Event('back', {bubbles: true}));
  };

  private readonly handleCloseClick = () => {
    this.close(CLOSE_REASONS.CLOSE_BUTTON);
  };

  override render() {
    const classes = sideSheetClasses({
      root: false,
      modal: this.modal,
      detached: this.detached,
      divider: this.divider,
      open: this.open,
      closing: this.isClosing,
    });
    const dragging = this.modal && this.dragOffset !== null;
    const panelStyle = dragging
      ? {transform: `translateX(${this.dragDirection * this.dragOffset!}px)`}
      : {};
    const hasHeadline = !!this.headline || this.hasSlottedHeadline();

    return html`
      <dialog
        class="sheet-dialog side-sheet-dialog ${classMap({
          ...classes,
          [SIDE_SHEET_CLASSES.dragging]: dragging,
        })}"
        part="dialog"
        aria-labelledby=${hasHeadline ? 'headline' : nothing}
        aria-label=${!hasHeadline && this.label ? this.label : nothing}
        @cancel=${this.handleDialogCancel}
        @close=${this.handleDialogClose}
        @pointerdown=${this.handleDialogPointerDown}
        @click=${this.handleDialogClick}
      >
        <div
          class="sheet-panel side-sheet-panel"
          part="container"
          style=${styleMap(panelStyle)}>
          <div class="side-sheet-header" part="header">
            ${
              this.hasBackButton
                ? html`
                    <button
                      type="button"
                      class="${iconButton({
                        classes: {'side-sheet-back': true},
                      })}"
                      aria-label=${this.backLabel}
                      @click=${this.handleBackClick}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                        />
                      </svg>
                    </button>
                  `
                : nothing
            }
            <h2 id="headline" class="side-sheet-headline" part="headline">
              <slot name="headline" @slotchange=${this.handleHeadlineSlotChange}
                >${this.headline}</slot
              >
            </h2>
            ${
              this.hideCloseButton
                ? nothing
                : html`
                    <button
                      type="button"
                      class="${iconButton({
                        classes: {'side-sheet-close': true},
                      })}"
                      aria-label=${this.closeLabel}
                      @click=${this.handleCloseClick}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        />
                      </svg>
                    </button>
                  `
            }
          </div>
          <div class="side-sheet-content" part="content">
            <slot></slot>
          </div>
          <div class="side-sheet-actions" part="actions">
            <slot name="actions" ${hasSlotted()}></slot>
          </div>
        </div>
      </dialog>
    `;
  }

  private hasSlottedHeadline(): boolean {
    return !!this.querySelector(':scope > [slot="headline"]');
  }

  private readonly handleHeadlineSlotChange = () => {
    this.requestUpdate();
  };
}
