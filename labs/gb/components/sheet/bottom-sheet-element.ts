/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, type CSSResultOrNative, html, nothing} from 'lit';
import {property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {focusRingClasses} from '../focus/focus-ring.js';
import {
  BOTTOM_SHEET_STATES,
  bottomSheetClasses,
  type BottomSheetState,
} from './bottom-sheet.js';
import {
  playPredictiveBack,
  type PredictiveBackAnimation,
} from '../shared/predictive-back.js';
import {DragSettleController} from '../shared/drag-settle.js';
import {CLOSE_REASONS} from './sheet.js';
import {SheetBase} from './sheet-base.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import bottomSheetStyles from './bottom-sheet.css' with {type: 'css'}; // github-only
// import bottomSheetStyles from './bottom-sheet.cssresult.js'; // google3-only

/**
 * Compose `BottomSheetDefaults.PositionalThreshold` (56dp): how far a drag must
 * travel from its resting height to settle at the next one.
 */
export const POSITIONAL_THRESHOLD_PX = 56;

/**
 * Compose `BottomSheetDefaults.VelocityThreshold` (125dp/s): a faster release
 * settles at the next height in the fling direction.
 */
export const VELOCITY_THRESHOLD_PX_PER_S = 125;

/**
 * A Material Design bottom sheet: supplementary content anchored to the bottom
 * of the window.
 *
 * A standard sheet sits at the bottom of its positioned container and rests at
 * the peek height or expanded. A modal sheet (`modal`) is a dialog above a
 * scrim; it opens partially expanded (at most half the window) and closes on
 * Escape, a scrim click or a swipe down.
 *
 * The drag handle is a button: activating it (click, Enter or Space) toggles
 * between expanded and partially expanded, or closes the sheet when it has no
 * lower height. Dragging it moves the sheet between its heights; the button
 * is the single-pointer alternative to dragging (WCAG 2.5.7).
 *
 * Predictive back (Android back gesture or button, through the modal
 * dialog's close watcher; or `handleBack()`): the sheet shrinks toward the
 * bottom center, detaching from the window's side edges (Compose
 * `ModalBottomSheet`), then an expanded sheet with a partial height settles
 * partially expanded; otherwise it closes with reason `back`.
 *
 * @fires {Event} open - Fired when the sheet begins opening. Cancelable.
 * @fires {Event} opened - Fired after the opening motion.
 * @fires {CustomEvent<{reason: string}>} close - Fired when the sheet begins closing. Cancelable; canceling keeps it open.
 * @fires {CustomEvent<{reason: string}>} closed - Fired after the closing motion.
 * @fires {Event} state-change - Fired when the user moves the sheet to another height (`state`).
 * @slot - The sheet content. It scrolls when taller than the sheet.
 * @csspart dialog - The `<dialog>` holding the sheet; its `::backdrop` is the scrim.
 * @csspart container - The sheet container.
 * @csspart drag-handle - The drag handle button.
 * @csspart content - The container of the default slot.
 * @cssprop --container-color - Container color.
 * @cssprop --container-elevation - Container box shadow.
 * @cssprop --container-shape - Top corner radius.
 * @cssprop --drag-handle-color - Drag handle color.
 * @cssprop --drag-handle-height - Drag handle height.
 * @cssprop --drag-handle-width - Drag handle width.
 * @cssprop --drag-handle-padding-block - Space above and below the drag handle.
 * @cssprop --max-width - Maximum container width.
 * @cssprop --top-margin - Minimum space above the expanded sheet.
 * @cssprop --wide-margin - Top and side margins when the sheet is wider than its max width.
 * @cssprop --peek-height - Visible height of a partially expanded standard sheet.
 * @cssprop --partially-expanded-height - Maximum visible height of a partially expanded modal sheet.
 * @cssprop --scrim-color - Scrim color of a modal sheet.
 * @cssprop --scrim-opacity - Scrim opacity of a modal sheet.
 */
export class BottomSheetElement extends SheetBase {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    bottomSheetStyles,
    css`
      :host([hidden]) {
        display: none;
      }
    `,
  ];

  /**
   * The resting height while open: `partially-expanded` or `expanded`.
   * Updated when the user drags or activates the drag handle.
   */
  @property({reflect: true}) state: BottomSheetState =
    BOTTOM_SHEET_STATES.partiallyExpanded;

  /**
   * Whether the sheet has no partially expanded height: it opens expanded and
   * the drag handle closes it.
   */
  @property({type: Boolean, attribute: 'skip-partially-expanded'})
  skipPartiallyExpanded = false;

  /** Whether to hide the drag handle (which also disables dragging). */
  @property({type: Boolean, attribute: 'hide-drag-handle'})
  hideDragHandle = false;

  /** Accessible label of the drag handle button. */
  @property({attribute: 'drag-handle-label'}) dragHandleLabel = 'Drag handle';

  /** Accessible label of the sheet dialog. */
  @property() label = 'Bottom sheet';

  @state() private isDragging = false;
  @state() private hasPartialHeight = true;

  private dragOffset: number | null = null;
  private resizeObserver?: ResizeObserver;

  /** The resting height the sheet renders. */
  get effectiveState(): BottomSheetState {
    return this.skipPartiallyExpanded
      ? BOTTOM_SHEET_STATES.expanded
      : this.state;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.resizeObserver ??= new ResizeObserver(() => {
      this.measurePartialHeight();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.endDrag();
  }

  protected override firstUpdated() {
    const panel = this.panel;
    if (panel) {
      this.resizeObserver?.observe(panel);
    }
  }

  protected override willShow() {
    if (this.skipPartiallyExpanded) {
      this.state = BOTTOM_SHEET_STATES.expanded;
    }
  }

  protected override backCloses(): boolean {
    // Compose `ModalBottomSheet` settleToDismiss: back from expanded goes to
    // the partially expanded height when there is one.
    this.measurePartialHeight();
    if (
      this.effectiveState === BOTTOM_SHEET_STATES.expanded &&
      this.hasPartialHeight
    ) {
      this.setState(BOTTOM_SHEET_STATES.partiallyExpanded, true);
      return false;
    }
    return true;
  }

  protected override playPredictiveBack(): PredictiveBackAnimation | null {
    const dialog = this.dialog;
    if (!dialog) {
      return null;
    }
    return playPredictiveBack(dialog, {
      kind: 'bottom-sheet',
      measure: this.panel,
      content: this.renderRoot.querySelector<HTMLElement>(
        '.bottom-sheet-content',
      ),
    });
  }

  /** Expands the sheet to its full height. */
  expand() {
    this.setState(BOTTOM_SHEET_STATES.expanded);
  }

  /** Moves the sheet to its partially expanded height, when it has one. */
  partialExpand() {
    if (!this.skipPartiallyExpanded) {
      this.setState(BOTTOM_SHEET_STATES.partiallyExpanded);
    }
  }

  private setState(next: BottomSheetState, fromUser = false) {
    if (this.state === next) {
      this.requestUpdate();
      return;
    }
    this.state = next;
    if (fromUser) {
      this.dispatchEvent(new Event('state-change', {bubbles: true}));
    }
  }

  /**
   * The translation of the partially expanded sheet: how much of it is below
   * the window. Zero when the whole sheet fits in the partial height.
   */
  private partialOffset(): number {
    const panel = this.panel;
    const probe = this.renderRoot?.querySelector<HTMLElement>(
      '.bottom-sheet-probe',
    );
    if (!panel || !probe) {
      return 0;
    }
    return Math.max(0, panel.offsetHeight - probe.offsetHeight);
  }

  private measurePartialHeight() {
    if (!this.isShown) {
      return;
    }
    this.hasPartialHeight =
      !this.skipPartiallyExpanded && this.partialOffset() > 0.5;
  }

  private get canHide(): boolean {
    return this.modal || !this.hasPartialHeight;
  }

  private readonly handleDragHandleClick = () => {
    this.measurePartialHeight();
    if (!this.hasPartialHeight) {
      this.close(CLOSE_REASONS.DRAG_HANDLE);
      return;
    }
    this.setState(
      this.effectiveState === BOTTOM_SHEET_STATES.partiallyExpanded
        ? BOTTOM_SHEET_STATES.expanded
        : BOTTOM_SHEET_STATES.partiallyExpanded,
      true,
    );
  };

  /**
   * Dragging the handle area moves the sheet between its heights (expanded,
   * partially expanded, hidden) and settles on release like Compose's
   * anchored draggable (shared DragSettleController). The click that follows
   * a drag does not toggle the height (the gesture suppresses it).
   */
  // spec: bottom-sheets-ba6d67, bottom-sheets-350a86, bottom-sheets-95e993, bottom-sheets-aca585, bottom-sheets-2562c2
  protected readonly heightDrag = new DragSettleController(this, {
    axis: 'y',
    target: () => (this.open ? this.dragArea : null),
    anchors: () => this.anchors().map(([offset]) => offset),
    value: () => (this.panel ? currentTranslateY(this.panel) : 0),
    velocityThreshold: VELOCITY_THRESHOLD_PX_PER_S,
    positionalThreshold: () => POSITIONAL_THRESHOLD_PX,
    onDragStart: (from) => {
      this.measurePartialHeight();
      this.isDragging = true;
      this.dragOffset = from;
    },
    onDrag: (offset) => {
      this.dragOffset = offset;
      this.requestUpdate();
    },
    onSettle: (offset) => {
      this.endDrag();
      const target = this.anchors().find(([y]) => y === offset)?.[1];
      if (target === 'hidden') {
        this.close(CLOSE_REASONS.SWIPE);
      } else if (target) {
        this.setState(target, true);
      }
    },
    onCancel: () => this.endDrag(),
  });

  private get dragArea(): HTMLElement | null {
    return (
      this.renderRoot?.querySelector<HTMLElement>('.bottom-sheet-drag-area') ??
      null
    );
  }

  private endDrag() {
    this.dragOffset = null;
    this.isDragging = false;
    this.requestUpdate();
  }

  private anchors(): Array<[number, BottomSheetState | 'hidden']> {
    const anchors: Array<[number, BottomSheetState | 'hidden']> = [
      [0, BOTTOM_SHEET_STATES.expanded],
    ];
    if (this.hasPartialHeight) {
      anchors.push([
        this.partialOffset(),
        BOTTOM_SHEET_STATES.partiallyExpanded,
      ]);
    }
    if (this.canHide) {
      anchors.push([this.panel?.offsetHeight ?? 0, 'hidden']);
    }
    return anchors;
  }

  override render() {
    const classes = bottomSheetClasses({
      root: false,
      modal: this.modal,
      open: this.open,
      closing: this.isClosing,
      state: this.effectiveState,
      dragging: this.isDragging,
    });
    const panelStyle =
      this.dragOffset === null
        ? {}
        : {transform: `translateY(${this.dragOffset}px)`};
    const expanded =
      this.effectiveState === BOTTOM_SHEET_STATES.expanded ||
      !this.hasPartialHeight;

    return html`
      <dialog
        class="sheet-dialog bottom-sheet-dialog ${classMap(classes)}"
        part="dialog"
        aria-label=${this.label || nothing}
      >
        <div class="bottom-sheet-probe" aria-hidden="true"></div>
        <div
          class="sheet-panel bottom-sheet-panel"
          part="container"
          style=${styleMap(panelStyle)}
        >
          ${
            this.hideDragHandle
              ? nothing
              : html`
                  <div
                    class="bottom-sheet-drag-area"
                  >
                    <button
                      type="button"
                      class="bottom-sheet-drag-handle ${classMap(
                        focusRingClasses(),
                      )}"
                      part="drag-handle"
                      aria-label=${this.dragHandleLabel}
                      aria-expanded=${expanded ? 'true' : 'false'}
                      @click=${this.handleDragHandleClick}
                    ></button>
                  </div>
                `
          }
          <div class="bottom-sheet-content" part="content">
            <slot></slot>
          </div>
        </div>
      </dialog>
    `;
  }
}

/** The current vertical translation of an element, in px. */
function currentTranslateY(element: HTMLElement): number {
  const transform = getComputedStyle(element).transform;
  if (!transform || transform === 'none') {
    return 0;
  }
  return new DOMMatrixReadOnly(transform).m42;
}
