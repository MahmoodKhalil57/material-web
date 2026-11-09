/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement } from 'lit';
import { type TooltipPlacement, type TooltipVariant } from './tooltip.js';
/** Why a tooltip closed, in the `close` / `closed` event detail. */
export type TooltipCloseReason = 'pointer' | 'blur' | 'escape' | 'outside' | 'toggle' | 'replaced' | 'method';
/**
 * A Material Design tooltip: a plain tooltip that labels an element, or a
 * rich tooltip with an optional subhead and text buttons.
 *
 * Anchor it with `for="<anchor id>"` (an element in the same root) or the
 * `anchorElement` property. The tooltip shows when the anchor is hovered,
 * keyboard focused or long-pressed, and hides 1.5 seconds after the pointer
 * leaves (immediately on blur or Escape). A `persistent` rich tooltip instead
 * toggles when the anchor is clicked and stays until the user interacts
 * elsewhere or presses Escape.
 *
 * Plain tooltips, and rich tooltips without actions, have the `tooltip` role
 * and describe the anchor through `aria-describedby`. A rich tooltip with
 * slotted actions is a non-modal `dialog` labelled by its subhead; Tab from
 * the anchor moves focus into it, and focus is never trapped.
 *
 * @fires {Event} open - Fired before the tooltip opens. Cancelable.
 * @fires {Event} opened - Fired after the tooltip opens.
 * @fires {CustomEvent<{reason: string}>} close - Fired before the tooltip closes. Cancelable.
 * @fires {CustomEvent<{reason: string}>} closed - Fired after the tooltip closes.
 * @slot - The supporting text.
 * @slot subhead - Rich tooltip subhead; replaces the `subhead` attribute.
 * @slot action - Rich tooltip text buttons (up to two), e.g. `<md-gb-button color="text">`.
 * @csspart tooltip - The tooltip surface.
 * @csspart caret - The caret.
 * @csspart subhead - The subhead container.
 * @csspart supporting-text - The supporting text container.
 * @csspart actions - The actions container.
 * @cssprop --container-color - Container color.
 * @cssprop --container-elevation - Container box shadow.
 * @cssprop --container-shape - Container corner radius.
 * @cssprop --supporting-text - Supporting text typography.
 * @cssprop --supporting-text-axes - Supporting text font variation settings.
 * @cssprop --supporting-text-color - Supporting text color.
 * @cssprop --supporting-text-tracking - Supporting text letter spacing.
 * @cssprop --subhead - Rich subhead typography.
 * @cssprop --subhead-axes - Rich subhead font variation settings.
 * @cssprop --subhead-color - Rich subhead color.
 * @cssprop --subhead-tracking - Rich subhead letter spacing.
 * @cssprop --action-label-text - Rich action typography.
 * @cssprop --action-label-text-axes - Rich action font variation settings.
 * @cssprop --action-label-text-color - Rich action label color.
 * @cssprop --action-label-text-tracking - Rich action letter spacing.
 * @cssprop --min-width - Minimum container width.
 * @cssprop --min-height - Minimum container height.
 * @cssprop --max-width - Maximum container width.
 * @cssprop --padding-block - Container block padding.
 * @cssprop --padding-inline - Container inline padding.
 * @cssprop --actions-padding-block-end - Rich container bottom padding below actions.
 * @cssprop --subhead-spacing - Space below the rich subhead.
 * @cssprop --actions-spacing - Space above the rich actions.
 * @cssprop --actions-gap - Space between rich actions.
 * @cssprop --anchor-spacing - Distance between the anchor and the tooltip (or its caret).
 * @cssprop --caret-width - Caret base width.
 * @cssprop --caret-height - Caret height.
 * @cssprop --viewport-margin - Minimum distance from the viewport edges.
 */
export declare class TooltipElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** Plain or rich. */
    variant: TooltipVariant;
    /** The id of the anchor element, in the same root as the tooltip. */
    htmlFor: string;
    /**
     * Preferred side of the anchor. Defaults to `above` for plain tooltips and
     * `below` for rich ones. Flips when there isn't room.
     */
    placement: TooltipPlacement | '';
    /**
     * Rich only: opens when the anchor is clicked instead of on hover / focus,
     * and stays open until the user interacts with another element.
     */
    persistent: boolean;
    /**
     * Plain only: the anchor has no visual boundary, such as a text baseline,
     * so the tooltip sits 8dp from it instead of 4dp.
     */
    noBoundary: boolean;
    /**
     * How the tooltip lines up with its anchor along the placement side:
     * `center` (plain default) or `start` (rich default). A rich tooltip can
     * be `center`ed below its anchor on desktop.
     */
    align: 'start' | 'center' | '';
    /** Whether to draw a caret pointing at the anchor. */
    caret: boolean;
    /** Rich only: subhead text. Replaced by content in the `subhead` slot. */
    subhead: string;
    /** Hover delay before showing, in milliseconds. */
    showDelay: number;
    /** Delay before hiding after the pointer leaves, in milliseconds. */
    hideDelay: number;
    /** Skips the open / close animation. */
    quick: boolean;
    /** Whether the tooltip is open. */
    get open(): boolean;
    set open(value: boolean);
    /**
     * The anchor element. Set it to anchor to an element directly; otherwise
     * it is the element whose id is `for`.
     */
    get anchorElement(): HTMLElement | null;
    set anchorElement(element: HTMLElement | null);
    /** The side of the anchor the tooltip is on. */
    private side;
    private hasSlottedSubhead;
    private hasActions;
    private readonly internals;
    private isOpenInternal;
    private pendingOpen;
    private explicitAnchor;
    private boundAnchor;
    private anchorAbort;
    private addedDescribedBy;
    private addedExpanded;
    private addedHasPopup;
    private showTimer?;
    private hideTimer?;
    private longPressTimer?;
    private longPressStart;
    private longPressShown;
    private suppressClickUntil;
    private restoringFocus;
    /**
     * The popover, its position next to the anchor, light dismiss (Escape, a
     * press or focus outside) and the return of focus to the anchor.
     */
    private readonly overlay;
    /** Whether the anchor is inside an app bar (also through shadow roots). */
    private anchorInAppBar;
    private get isRich();
    private get isPersistent();
    /** A rich tooltip with actions is a non-modal dialog. */
    private get isDialog();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Opens the tooltip, closing any other open tooltip. */
    show(): void;
    /** Closes the tooltip. */
    hide(): void;
    private close;
    private finishHide;
    /** Recomputes the tooltip's position next to its anchor. */
    reposition(): void;
    private applyPosition;
    protected firstUpdated(): void;
    protected updated(changed: Map<string, unknown>): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private handleSubheadSlotChange;
    private handleActionSlotChange;
    private get subheadText();
    private syncAria;
    private syncAnchorExpanded;
    private addDescribedBy;
    private removeDescribedBy;
    private bindAnchor;
    private unbindAnchor;
    private clearTimers;
    private scheduleShow;
    private scheduleHide;
    private cancelHide;
    /**
     * The tooltip's interactive elements in reading order (top to bottom):
     * links in the supporting text, then the actions.
     */
    private interactiveElements;
    private focusFirstAction;
    private readonly handleAnchorPointerEnter;
    private readonly handleAnchorPointerLeave;
    private readonly handleAnchorPointerDown;
    private readonly handleAnchorPointerMove;
    private readonly handleAnchorPointerUp;
    private readonly handleAnchorContextMenu;
    private readonly handleAnchorClick;
    private readonly handleAnchorFocusIn;
    private readonly handleAnchorFocusOut;
    private readonly handleAnchorKeyDown;
    private readonly handleTooltipPointerEnter;
    private readonly handleTooltipPointerLeave;
    private readonly handleTooltipFocusOut;
    private readonly handleTooltipKeyDown;
}
