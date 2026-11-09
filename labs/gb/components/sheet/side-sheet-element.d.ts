/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative } from 'lit';
import { DragSettleController } from '../shared/drag-settle.js';
import { type PredictiveBackAnimation } from '../shared/predictive-back.js';
import { SheetBase } from './sheet-base.js';
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
export declare class SideSheetElement extends SheetBase {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * Whether the sheet floats inset from the window edges with rounded
     * corners, instead of touching them.
     */
    detached: boolean;
    /**
     * Whether to draw dividers: along the inline start edge of a standard
     * docked sheet, and above the actions.
     */
    divider: boolean;
    /** The headline text. */
    headline: string;
    /** Whether to show the back icon button before the headline. */
    hasBackButton: boolean;
    /**
     * Whether to hide the close icon button. Material requires a close
     * affordance in every side sheet; provide another one when hiding it.
     */
    hideCloseButton: boolean;
    /** Accessible label of the back icon button. */
    backLabel: string;
    /** Accessible label of the close icon button. */
    closeLabel: string;
    /**
     * Accessible label of the sheet dialog, used when it has no headline.
     */
    label: string;
    /** Whether to turn off swipe to dismiss on a modal sheet. */
    gesturesDisabled: boolean;
    /**
     * While a modal sheet is dragged: how far it is dragged toward its edge,
     * in px (0 is open, the sheet width is closed). Null when not dragging.
     */
    private dragOffset;
    private dragWidth;
    /** 1 when the sheet closes toward +x (LTR), -1 in RTL. */
    private dragDirection;
    disconnectedCallback(): void;
    /**
     * Swipe to dismiss: a drag on the modal `<dialog>` moves the sheet between
     * the open and closed anchors and settles on release (Compose
     * `AnchoredDraggableState` thresholds). Shared DragSettleController, with
     * the closing direction positive. The settle is a spring that starts at
     * the release position with the release velocity.
     */
    protected readonly swipe: DragSettleController;
    protected gestureSettled(): Promise<void>;
    private panelIsRtl;
    protected playPredictiveBack(): PredictiveBackAnimation | null;
    private readonly handleBackClick;
    private readonly handleCloseClick;
    render(): import("lit-html").TemplateResult<1>;
    private hasSlottedHeadline;
    private readonly handleHeadlineSlotChange;
}
