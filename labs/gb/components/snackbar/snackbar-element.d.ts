/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement, type PropertyValues } from 'lit';
/**
 * Animation duration for snackbar appearance in milliseconds.
 */
export declare const OPEN_DURATION_MS = 150;
/**
 * Animation duration for snackbar disappearance in milliseconds.
 */
export declare const CLOSE_DURATION_MS = 75;
/**
 * A Material Design snackbar component.
 *
 * The message is announced in a polite live region when the snackbar opens,
 * without moving focus (snackbar.md, Accessibility). The live region stays in
 * the page while the snackbar is closed, so each message is announced.
 *
 * To show consecutive snackbars one at a time, use `md-gb-snackbar-host`.
 *
 * Placement: snackbars appear above FABs and docked toolbars (snackbar.md,
 * "Snackbars and floating action buttons"). Set `anchor` to the FAB (or the
 * bottom bar) and the snackbar sits `--bottom-offset` above it, so it covers
 * neither the FAB nor its focus indicator.
 *
 * @fires {Event} open - Fired when the snackbar begins opening.
 * @fires {Event} opened - Fired when the snackbar has opened and animations finished.
 * @fires {CustomEvent<{reason: string}>} close - Fired when the snackbar begins closing.
 * @fires {CustomEvent<{reason: string}>} closed - Fired when the snackbar has closed.
 * @slot - Default slot for rich content (rendered after `label-text`). If both `label-text` and slotted content are provided, both render.
 * @slot action - Slot for a custom action button; replaces the built-in action rendered from `action-label`. Prefer the `action-label` attribute, which renders a text button matching the spec. A slotted plain `<button>` is styled by the snackbar, with hover, focus and pressed states. A slotted text `<md-gb-button>` gets the `--action-label-text*` colors and typography, but keeps its own 16px padding and pressed shape, because its component tokens can't be set from outside its shadow root.
 * @slot dismiss - Slot for dismiss button (falls back to close icon button when `has-close-button` is set).
 * @csspart surface - The surface container of the snackbar.
 * @csspart label - The container wrapping the label content.
 * @csspart actions - The container wrapping action and dismiss slots.
 * @cssprop --action-label-text-color - Action button label text color.
 * @cssprop --action-label-text - Action button label typography.
 * @cssprop --action-label-text-axes - Action button label typography font variation settings.
 * @cssprop --action-label-text-tracking - Action button label letter spacing.
 * @cssprop --container-color - Container background color.
 * @cssprop --container-elevation - Container box shadow elevation.
 * @cssprop --container-shape - Container border radius.
 * @cssprop --icon-color - Close icon color.
 * @cssprop --icon-size - Close icon size.
 * @cssprop --supporting-text - Supporting label typography.
 * @cssprop --supporting-text-axes - Supporting label typography font variation settings.
 * @cssprop --supporting-text-color - Supporting label text color.
 * @cssprop --supporting-text-tracking - Supporting label letter spacing.
 * @cssprop --min-width - Minimum surface width in wide layout.
 * @cssprop --max-width - Maximum surface width in wide layout.
 * @cssprop --with-single-line-container-height - Single-line container height (spec 48dp).
 * @cssprop --with-two-lines-container-height - Two-line container height (spec 68dp).
 * @cssprop --min-height - Minimum surface height (the single-line height).
 * @cssprop --bottom-offset - Inset block end distance from container bottom, or from the top of the `anchor`.
 * @cssprop --position - CSS position property (`absolute` by default).
 * @cssprop --z-index - Z-index of the snackbar.
 */
export declare class SnackbarElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    private isOpenInternal;
    /**
     * Whether the snackbar is currently open.
     */
    get open(): boolean;
    set open(value: boolean);
    /**
     * Time in milliseconds before the snackbar automatically dismisses.
     * Set to 0 or a negative value (e.g. -1) to disable auto-dismiss. Read when
     * the snackbar opens; changing it while open takes effect on the next open.
     */
    timeoutMs: number;
    /**
     * Whether the snackbar should be positioned relative to the viewport (fixed).
     */
    fixed: boolean;
    /**
     * Accessible label for the built-in dismiss button.
     */
    closeLabel: string;
    /**
     * Supporting message text to display. Rendered before default slot content.
     */
    labelText: string;
    /**
     * Visible text of the built-in action button. Rendered only when non-empty
     * and nothing is slotted into `action`.
     */
    actionLabel: string;
    /**
     * Whether to display a close icon button.
     */
    hasCloseButton: boolean;
    /**
     * Whether to skip opening and closing transition delays.
     */
    quick: boolean;
    /**
     * Where a snackbar sits on wide layouts: `center` (default) or `start`
     * (left-aligned). Use the same value wherever snackbars appear, so they
     * always show in the same spot. Compact layouts span the width.
     */
    align: 'center' | 'start';
    /**
     * The id of an element the snackbar appears above, such as a FAB or a
     * docked toolbar, in the snackbar's root (document or shadow root). See
     * `anchorElement`.
     */
    anchor: string;
    /**
     * An element the snackbar appears above, such as a FAB or a docked
     * toolbar: while open, the snackbar's bottom edge sits `--bottom-offset`
     * above the element's top edge. Takes precedence over `anchor`.
     */
    anchorElement: HTMLElement | null;
    private isOpening;
    private isClosing;
    /** The polite live region that announces each message. */
    private readonly announcer;
    private isHovered;
    private isFocused;
    private isPaused;
    private autoDismissTimerId;
    private remainingTimeMs;
    private timerStartTime;
    private transitionCounter;
    private anchorTracking;
    private anchorObserver;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected updated(changed: PropertyValues<this>): void;
    /** The element the snackbar appears above, if any. */
    get resolvedAnchor(): HTMLElement | null;
    /**
     * Places the snackbar above its anchor. Called while open when the window
     * or the anchor resizes; call it after moving the anchor.
     */
    updateAnchorPosition(): void;
    /**
     * The distance from the bottom of the snackbar's containing block to the
     * top of the anchor, or null when the anchor isn't rendered.
     */
    private anchorOffset;
    private isShown;
    private syncAnchorTracking;
    private stopAnchorTracking;
    /**
     * The announced text: the message (label text and slotted text) and the
     * action label.
     */
    private announcementText;
    /**
     * Opens the snackbar.
     */
    show(): Promise<void>;
    /**
     * Closes the snackbar.
     *
     * @param reason The reason for closing (e.g. 'action', 'dismiss', 'timeout').
     */
    close(reason?: string): Promise<void>;
    /**
     * Waits for the surface transition to end (the fade stays with reduced
     * motion), or `durationMs` when the browser has not started it yet.
     */
    private waitForAnimation;
    /** Whether the snackbar has an action (built-in or slotted). */
    private get hasAction();
    private startAutoDismissTimer;
    private scheduleAutoDismiss;
    private clearAutoDismissTimer;
    private pauseAutoDismissTimer;
    private resumeAutoDismissTimer;
    private readonly handleMouseEnter;
    private readonly handleMouseLeave;
    /** The element that had focus before it moved into the snackbar. */
    private returnFocusTo;
    /**
     * Moves focus to the action of an open snackbar with an action
     * (`Alt+G`, snackbar.md Accessibility). Document this shortcut for users,
     * for example in a help article.
     */
    private readonly handleFocusShortcut;
    /**
     * Returns focus when the snackbar closes while it holds focus: to the
     * element that had it before, else to the next most logical element on the
     * page (the next focusable after the snackbar, or the last one before it).
     */
    private restoreFocus;
    private readonly handleFocusIn;
    private readonly handleFocusOut;
    private readonly handleKeyDown;
    private readonly handleClick;
    private readonly handleDismissClick;
    render(): import("lit-html").TemplateResult<1>;
}
