/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative } from 'lit';
import { type BottomSheetState } from './bottom-sheet.js';
import { type PredictiveBackAnimation } from '../shared/predictive-back.js';
import { DragSettleController } from '../shared/drag-settle.js';
import { SheetBase } from './sheet-base.js';
/**
 * Compose `BottomSheetDefaults.PositionalThreshold` (56dp): how far a drag must
 * travel from its resting height to settle at the next one.
 */
export declare const POSITIONAL_THRESHOLD_PX = 56;
/**
 * Compose `BottomSheetDefaults.VelocityThreshold` (125dp/s): a faster release
 * settles at the next height in the fling direction.
 */
export declare const VELOCITY_THRESHOLD_PX_PER_S = 125;
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
export declare class BottomSheetElement extends SheetBase {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * The resting height while open: `partially-expanded` or `expanded`.
     * Updated when the user drags or activates the drag handle.
     */
    state: BottomSheetState;
    /**
     * Whether the sheet has no partially expanded height: it opens expanded and
     * the drag handle closes it.
     */
    skipPartiallyExpanded: boolean;
    /** Whether to hide the drag handle (which also disables dragging). */
    hideDragHandle: boolean;
    /** Accessible label of the drag handle button. */
    dragHandleLabel: string;
    /** Accessible label of the sheet dialog. */
    label: string;
    /** Accessible label of the collapse icon button of a full-screen sheet. */
    collapseLabel: string;
    /** Accessible label of the close icon button of a full-screen sheet. */
    closeLabel: string;
    /**
     * Whether the sheet is open at full-screen height (expanded up to the top
     * margin). It then shows an app bar with a collapse icon button (standard
     * sheets with a partially expanded height) or a close icon button (modal
     * sheets).
     */
    private fullHeight;
    private isDragging;
    private hasPartialHeight;
    private dragOffset;
    private resizeObserver?;
    /** The resting height the sheet renders. */
    get effectiveState(): BottomSheetState;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(): void;
    protected updated(): void;
    private measureFullHeight;
    private handleAppBarClick;
    private renderAppBar;
    protected willShow(): void;
    protected backCloses(): boolean;
    protected playPredictiveBack(): PredictiveBackAnimation | null;
    /** Expands the sheet to its full height. */
    expand(): void;
    /** Moves the sheet to its partially expanded height, when it has one. */
    partialExpand(): void;
    private setState;
    /**
     * The translation of the partially expanded sheet: how much of it is below
     * the window. Zero when the whole sheet fits in the partial height.
     */
    private partialOffset;
    private measurePartialHeight;
    private get canHide();
    private readonly handleDragHandleClick;
    /**
     * Dragging the handle area moves the sheet between its heights (expanded,
     * partially expanded, hidden) and settles on release like Compose's
     * anchored draggable (shared DragSettleController). The click that follows
     * a drag does not toggle the height (the gesture suppresses it).
     */
    protected readonly heightDrag: DragSettleController;
    protected gestureSettled(): Promise<void>;
    private get dragArea();
    private endDrag;
    private anchors;
    render(): import("lit-html").TemplateResult<1>;
}
