/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement } from 'lit';
/** The dialog's accessibility type. */
export type DialogType = 'alert' | 'dialog' | '';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement>;
/**
 * A Material Design dialog: a modal window in front of app content that
 * provides critical information or asks for a decision. Built on a native
 * modal `<dialog>` (`showModal()`), so the rest of the page is inert while it
 * is open. The dialog is in the top layer, so no other element (app bars,
 * FABs, snackbars) can cover it or its focused controls (dialogs.md: dialogs
 * shouldn't be obscured by other elements).
 *
 * Two variants: basic (default) and `full-screen`. Close it with `close()`,
 * a `<form method="dialog">` submit (the submitter's `value` becomes the
 * `returnValue`), Escape, a scrim click (basic) or the close icon button
 * (full-screen); the last three cancel the dialog (a cancelable `cancel`
 * event, then `close`).
 *
 * @fires {Event} open - Fired when the dialog begins opening. Cancelable.
 * @fires {Event} opened - Fired when the dialog has opened and animations finished.
 * @fires {Event} close - Fired when the dialog begins closing; `returnValue` is already set. Cancelable.
 * @fires {Event} closed - Fired when the dialog has closed and animations finished.
 * @fires {Event} cancel - Fired when the dialog is canceled with Escape, a scrim click or the full-screen close button. Cancelable; canceling keeps the dialog open.
 * @slot - The supporting text or custom content (lists, form fields). Scrolls between the pinned headline and actions when it overflows.
 * @slot headline - The headline. Labels the dialog (`aria-labelledby`).
 * @slot icon - An optional hero icon above the headline (basic only). Centers the headline.
 * @slot actions - The action buttons, dismissive first and confirming last. Basic: end-aligned below the content. Full-screen: the confirm action at the end of the header.
 * @csspart header - The headline region (full-screen: the header bar).
 * @csspart icon - The hero icon container.
 * @csspart headline - The headline element.
 * @csspart scroller - The scroll container of the content.
 * @csspart content - The content container.
 * @csspart actions - The actions container.
 * @csspart close-button - The full-screen close icon button.
 * @cssprop --action-focus-label-text-color - Action label text color when focused.
 * @cssprop --action-hover-label-text-color - Action label text color when hovered.
 * @cssprop --action-label-text - Action label typography.
 * @cssprop --action-label-text-axes - Action label typography font variation settings.
 * @cssprop --action-label-text-color - Action label text color.
 * @cssprop --action-label-text-tracking - Action label letter spacing.
 * @cssprop --action-pressed-label-text-color - Action label text color when pressed.
 * @cssprop --container-color - Container background color.
 * @cssprop --container-elevation - Container box shadow elevation.
 * @cssprop --container-shape - Container border radius.
 * @cssprop --headline - Headline typography.
 * @cssprop --headline-axes - Headline typography font variation settings.
 * @cssprop --headline-color - Headline color.
 * @cssprop --headline-tracking - Headline letter spacing.
 * @cssprop --supporting-text - Supporting text typography.
 * @cssprop --supporting-text-axes - Supporting text typography font variation settings.
 * @cssprop --supporting-text-color - Supporting text color.
 * @cssprop --supporting-text-tracking - Supporting text letter spacing.
 * @cssprop --with-icon-icon-color - Hero icon color.
 * @cssprop --with-icon-icon-size - Hero icon size.
 * @cssprop --min-width - Basic dialog minimum width.
 * @cssprop --max-width - Basic dialog maximum width.
 * @cssprop --scrim-color - Scrim color.
 * @cssprop --scrim-opacity - Scrim opacity.
 * @cssprop --header-container-color - Full-screen header color.
 * @cssprop --header-container-elevation - Full-screen header elevation.
 * @cssprop --header-container-height - Full-screen header height.
 * @cssprop --header-on-scroll-container-color - Full-screen header color when the content is scrolled.
 * @cssprop --header-on-scroll-container-elevation - Full-screen header elevation when the content is scrolled.
 * @cssprop --header-headline - Full-screen headline typography.
 * @cssprop --header-headline-axes - Full-screen headline typography font variation settings.
 * @cssprop --header-headline-color - Full-screen headline color.
 * @cssprop --header-headline-tracking - Full-screen headline letter spacing.
 * @cssprop --header-icon-color - Full-screen close icon color.
 * @cssprop --header-icon-size - Full-screen close icon size.
 * @cssprop --header-action-label-text - Full-screen action label typography.
 * @cssprop --header-action-label-text-axes - Full-screen action label typography font variation settings.
 * @cssprop --header-action-label-text-color - Full-screen action label color.
 * @cssprop --header-action-label-text-tracking - Full-screen action label letter spacing.
 */
export declare class DialogElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * Opens the dialog when set to `true` and closes it when set to `false`.
     */
    get open(): boolean;
    set open(value: boolean);
    /**
     * Uses the full-screen variant: the dialog fills the window, with a header
     * holding a close icon button, the headline and the confirm action. Meant
     * for compact windows; use a basic dialog at larger breakpoints.
     */
    fullScreen: boolean;
    /**
     * Full-screen dialogs are for compact windows only (dialogs.md: use a basic
     * dialog at medium and expanded). So `full-screen` applies at compact
     * windows and the dialog is a basic dialog above, with the same slots. The
     * host gets `adaptive-basic` while it falls back. Set `always-full-screen`
     * to keep the full-screen variant at every window size.
     */
    alwaysFullScreen: boolean;
    /** Window size class of the viewport. */
    private readonly windowSize;
    /** Whether the dialog currently renders as the full-screen variant. */
    private get isFullScreen();
    /**
     * Skips the opening and closing animations.
     */
    quick: boolean;
    /**
     * The dialog's return value, usually which button closed it. Set by
     * `close(returnValue)` and by `<form method="dialog">` submitters' `value`.
     * Canceling (Escape, scrim, close button) leaves it unchanged.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue
     */
    returnValue: string;
    /**
     * The dialog's accessibility role. `alert` (`role="alertdialog"`) or
     * `dialog` (`role="dialog"`). When empty, basic dialogs are alert dialogs,
     * as the spec asks for on the web, and full-screen dialogs are dialogs.
     */
    type: DialogType;
    /**
     * Turns off focus trapping, which keeps Tab and Shift+Tab cycling inside
     * the dialog. Trapping is recommended for accessibility.
     */
    noFocusTrap: boolean;
    /**
     * Accessible label of the full-screen close icon button.
     */
    closeLabel: string;
    private hasIcon;
    private hasHeadline;
    private hasActions;
    private hasContent;
    private isAtScrollTop;
    private isAtScrollBottom;
    private readonly dialogElement;
    private readonly scroller;
    private readonly topAnchor;
    private readonly bottomAnchor;
    private previousReturnValue;
    private intersectionObserver?;
    /**
     * Opens and closes the native dialog, closes it with Escape, back or the
     * scrim, traps and restores focus, locks page scrolling and fires the
     * `open`, `opened`, `close` and `closed` events.
     */
    private readonly modalSurface;
    private get isClosing();
    constructor();
    connectedCallback(): void;
    /**
     * Opens the dialog as a modal and fires a cancelable `open` event, then
     * `opened` after the enter animation. Focus moves to the first child with
     * an `autofocus` attribute, else the first focusable element, else the
     * dialog.
     *
     * @return Resolves after the animation, when `opened` was fired.
     */
    show(): Promise<void>;
    /**
     * Closes the dialog and fires a cancelable `close` event, then `closed`
     * after the exit animation. Focus returns to the element focused before
     * the dialog opened.
     *
     * @param returnValue A value usually indicating which button closed the
     *     dialog. Defaults to the current `returnValue`.
     * @param reason Why the dialog closes, given in `detail.reason` of the
     *     `close` and `closed` events. Defaults to `dismiss`; Escape, back,
     *     scrim and close button requests use `escape`, `back`, `scrim` and
     *     `close-button`.
     * @return Resolves after the animation, when `closed` was fired.
     */
    close(returnValue?: string, reason?: string): Promise<void>;
    /** Cancels the dialog: a cancelable `cancel` event, then `close()`. */
    private cancel;
    /** Waits for the dialog's open or close CSS transitions to finish. */
    private waitForTransitions;
    private readonly handleSubmit;
    private isOnScrim;
    private readonly handleCloseClick;
    private readonly handleSlotChange;
    private updateSlotState;
    protected willUpdate(): void;
    protected firstUpdated(): void;
    private get dialogRole();
    protected render(): import("lit-html").TemplateResult<1>;
}
export {};
