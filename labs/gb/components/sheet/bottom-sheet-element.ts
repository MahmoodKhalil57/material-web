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
import {CLOSE_REASONS} from './sheet.js';
import {SheetBase} from './sheet-base.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import bottomSheetStyles from './bottom-sheet.css' with {type: 'css'}; // github-only
// import bottomSheetStyles from './bottom-sheet.cssresult.js'; // google3-only

/** Pointer travel before a press on the drag area becomes a drag. */
const DRAG_SLOP_PX = 8;

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

interface DragState {
  pointerId: number;
  startY: number;
  startOffset: number;
  lastY: number;
  lastTime: number;
  velocity: number;
  dragging: boolean;
}

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
 * lower height. Dragging it moves the sheet between its heights.
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
 * @cssprop --minimized-container-shape - Top corner radius while hidden.
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
  private drag: DragState | null = null;
  private suppressClick = false;
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
    if (this.suppressClick) {
      this.suppressClick = false;
      return;
    }
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

  private readonly handlePointerDown = (event: PointerEvent) => {
    if (
      this.drag ||
      !this.open ||
      (event.pointerType === 'mouse' && event.button !== 0)
    ) {
      return;
    }
    const panel = this.panel;
    if (!panel) {
      return;
    }
    this.suppressClick = false;
    // Track the pointer on the window: a fast drag leaves the drag area
    // before the drag slop is reached and pointer capture starts.
    for (const [type, listener] of this.windowListeners) {
      window.addEventListener(type, listener as EventListener, true);
    }
    this.drag = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startOffset: currentTranslateY(panel),
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocity: 0,
      dragging: false,
    };
  };

  private readonly handlePointerMove = (event: PointerEvent) => {
    const drag = this.drag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    const delta = event.clientY - drag.startY;
    if (!drag.dragging) {
      if (Math.abs(delta) < DRAG_SLOP_PX) {
        return;
      }
      drag.dragging = true;
      this.measurePartialHeight();
      // Capture only once dragging, so a tap still clicks the handle button.
      try {
        this.dragArea?.setPointerCapture(event.pointerId);
      } catch {
        // The pointer is no longer active (or is synthetic).
      }
      this.isDragging = true;
    }
    // px/s over the last move; events in the same millisecond count as 1ms.
    const dt = Math.max(1, event.timeStamp - drag.lastTime);
    drag.velocity = ((event.clientY - drag.lastY) / dt) * 1000;
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;
    const max = this.maxOffset();
    this.dragOffset = Math.min(max, Math.max(0, drag.startOffset + delta));
    this.requestUpdate();
  };

  private readonly handlePointerUp = (event: PointerEvent) => {
    const drag = this.drag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    if (!drag.dragging) {
      this.endDrag();
      return;
    }
    // The click that follows a drag must not toggle the height.
    this.suppressClick = true;
    globalThis.setTimeout(() => {
      this.suppressClick = false;
    });
    const offset = this.dragOffset ?? drag.startOffset;
    const target = this.settleTarget(drag.startOffset, offset, drag.velocity);
    this.endDrag();
    if (target === 'hidden') {
      this.close(CLOSE_REASONS.SWIPE);
    } else {
      this.setState(target, true);
    }
  };

  private readonly handlePointerCancel = (event: PointerEvent) => {
    if (this.drag && event.pointerId === this.drag.pointerId) {
      this.endDrag();
    }
  };

  private readonly windowListeners: Array<
    [string, (event: PointerEvent) => void]
  > = [
    ['pointermove', this.handlePointerMove],
    ['pointerup', this.handlePointerUp],
    ['pointercancel', this.handlePointerCancel],
  ];

  private get dragArea(): HTMLElement | null {
    return (
      this.renderRoot?.querySelector<HTMLElement>('.bottom-sheet-drag-area') ??
      null
    );
  }

  private endDrag() {
    for (const [type, listener] of this.windowListeners) {
      window.removeEventListener(type, listener as EventListener, true);
    }
    this.drag = null;
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

  private maxOffset(): number {
    const anchors = this.anchors();
    return anchors[anchors.length - 1][0];
  }

  /**
   * Picks the height a released drag settles at, like Compose's anchored
   * draggable: a fling past the velocity threshold goes to the next height
   * in its direction; otherwise the sheet moves on to the next height once
   * dragged past the positional threshold, or returns.
   */
  private settleTarget(
    startOffset: number,
    offset: number,
    velocity: number,
  ): BottomSheetState | 'hidden' {
    const anchors = this.anchors();
    const below = anchors.filter(([y]) => y > offset);
    const above = anchors.filter(([y]) => y <= offset);
    const lower = below[0] ?? anchors[anchors.length - 1];
    const upper = above[above.length - 1] ?? anchors[0];
    if (Math.abs(velocity) > VELOCITY_THRESHOLD_PX_PER_S) {
      return velocity > 0 ? lower[1] : upper[1];
    }
    if (offset > startOffset) {
      return offset - upper[0] >= POSITIONAL_THRESHOLD_PX ? lower[1] : upper[1];
    }
    return lower[0] - offset >= POSITIONAL_THRESHOLD_PX ? upper[1] : lower[1];
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
        @cancel=${this.handleDialogCancel}
        @close=${this.handleDialogClose}
        @pointerdown=${this.handleDialogPointerDown}
        @click=${this.handleDialogClick}
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
                    @pointerdown=${this.handlePointerDown}
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
