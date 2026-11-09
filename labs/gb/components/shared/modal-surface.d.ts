/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveElement } from 'lit';
/**
 * Shared behavior of modal surfaces: dialogs, modal bottom and side sheets,
 * the modal navigation drawer and rail, and the search view.
 *
 * A modal surface blocks the rest of the app until it is dismissed
 * (dialogs.md: "Dialogs disable all app functionality when they appear";
 * bottom-sheets.md, navigation-drawer.md: modal surfaces use a scrim to block
 * interaction with the rest of the app). The controller covers:
 *
 * - Open and close of a native `<dialog>` with `showModal()` (the scrim is its
 *   `::backdrop`, or an element inside it), or of a surface with no dialog.
 * - `open` / `opened` / `close` / `closed` events; `open` and `close` are
 *   cancelable, and `close` and `closed` carry `detail.reason`.
 * - Close requests: Escape, the dialog's `cancel` event, a `CloseWatcher` (the
 *   Android back gesture or button) for surfaces without a dialog, and a click
 *   on the scrim. Each reaches `onCloseRequest` with a reason (`escape`,
 *   `back` or `scrim`); the default closes the surface with that reason.
 * - Focus: moves into the surface when it opens (the `[autofocus]` element,
 *   else the first focusable element), cycles with Tab and Shift+Tab, and
 *   returns to the element focused before it opened once it closes.
 * - Page scroll lock while a modal surface is shown. A surface that is not
 *   `modal` (standard sheets and drawers) never locks scrolling, moves focus,
 *   traps focus or reacts to Escape.
 *
 * Two modes:
 * - Lifecycle (default): the controller owns the open state; the host
 *   exposes `open` through `controller.open` and calls `show()` / `close()`.
 * - External (`isOpen` given): the host owns the state (for example the
 *   modal navigation rail's `expanded`); the controller handles focus, scroll
 *   lock, back and close requests, and reports them through `onCloseRequest`.
 *
 * The controller binds its listeners to the elements the options return after
 * every host update, so templates don't wire `cancel`, `close`, `keydown` or
 * pointer handlers themselves.
 */
/** Close reasons the controller itself produces. */
export declare const MODAL_CLOSE_REASONS: {
    /** `close()` was called without a reason. */
    readonly DISMISS: "dismiss";
    /** Escape was pressed. */
    readonly ESCAPE: "escape";
    /** The Android back gesture or button. */
    readonly BACK: "back";
    /** The scrim was clicked. */
    readonly SCRIM: "scrim";
};
/** Where a close request comes from. */
export type ModalCloseRequest = 'escape' | 'back' | 'scrim';
/** Options of {@link ModalSurfaceController}. */
export interface ModalSurfaceOptions {
    /** The native `<dialog>` of the surface, when it renders one. */
    dialog?: () => HTMLDialogElement | null;
    /**
     * The element Escape, Tab and focus lookups use. Defaults to the dialog.
     * A host with a shadow root is searched through that shadow root.
     */
    surface?: () => HTMLElement | null;
    /**
     * The scrim element, when it is not the dialog's own `::backdrop`.
     * Defaults to the dialog.
     */
    scrim?: () => HTMLElement | null;
    /** Whether the surface is currently modal. Default: always. */
    modal?: () => boolean;
    /**
     * External mode: whether the host is open. When given, the host owns the
     * state and `show()` / `close()` do nothing.
     */
    isOpen?: () => boolean;
    /** Whether a click or press is on the scrim. Default: it hit the scrim element itself. */
    isScrim?: (event: MouseEvent) => boolean;
    /** Whether Tab is trapped inside the surface. Default: true. */
    trapFocus?: () => boolean;
    /**
     * The element to focus when a modal surface opens. Default: the
     * `[autofocus]` element, else the first focusable element, else the surface.
     */
    initialFocus?: () => HTMLElement | null | undefined;
    /** Whether events bubble. Default: false. */
    bubbles?: boolean;
    /** Reason of `close()` without an argument. Default: `dismiss`. */
    defaultReason?: string;
    /** Reason when the browser closes the dialog by itself. Default: `escape`. */
    forcedCloseReason?: string;
    /** Whether disconnecting the host closes the surface. Default: false. */
    closeOnDisconnect?: boolean;
    /**
     * Called for Escape, back and scrim close requests of a modal surface.
     * Default: `close(reason)`.
     */
    onCloseRequest?: (reason: ModalCloseRequest) => void;
    /** Resolves when the opening (`true`) or closing (`false`) motion ends. */
    waitForMotion?: (opening: boolean) => Promise<unknown> | void;
    /** Called before the state changes to open. */
    onWillShow?: () => void;
    /** Called before the dialog is shown. */
    onBeforeShow?: () => void;
    /** Called after the dialog is shown (and again if it is shown anew). */
    onShown?: () => void;
    /** Called when a close starts, after its `close` event wasn't canceled. */
    onWillClose?: (reason: string) => void;
    /** Called when a `close` event was canceled. */
    onCloseCanceled?: () => void;
    /** Called after the surface left the screen and the dialog closed. */
    onHidden?: () => void;
    /** Called when the browser closed the dialog by itself. */
    onForcedClose?: (dialog: HTMLDialogElement) => void;
}
/** The focused element, looking through open shadow roots. */
export declare function deepActiveElement(): HTMLElement | null;
/**
 * Returns the keyboard-focusable elements inside `root` in flat tree
 * (rendered) order: slots are expanded to their assigned elements and open
 * shadow roots are walked, except for custom elements that delegate focus,
 * which count as one stop. With `first`, returns only the first one.
 */
export declare function getFocusableElements(root: Element | ShadowRoot, { first }?: {
    first?: boolean;
}): HTMLElement[];
/**
 * Keeps Tab and Shift+Tab inside a surface: Tab on the last focusable
 * element wraps to the first, and Shift+Tab on the first wraps to the last.
 * A native modal dialog makes the rest of the page inert, but lets Tab leave
 * the page for the browser UI. A host with a shadow root is searched through
 * that shadow root.
 *
 * @param event The `keydown` event of a Tab press.
 * @param surface The element focus stays in.
 */
export declare function trapTabFocus(event: KeyboardEvent, surface: HTMLElement): void;
/** The attribute that marks the root element while page scroll is locked. */
export declare const SCROLL_LOCK_ATTRIBUTE = "data-md-gb-scroll-lock";
/**
 * Locks page scrolling with CSS: marks the root element, and a document style
 * rule (`:root[data-md-gb-scroll-lock]`) hides its overflow. Locks count, so
 * stacked modal surfaces release the page only when the last one closes.
 * Returns the function that releases this lock.
 */
export declare function lockPageScroll(): () => void;
/** The state of a modal surface. */
export declare class ModalSurfaceController implements ReactiveController {
    private readonly host;
    private readonly options;
    private isOpenInternal;
    private isOpeningInternal;
    private isClosingInternal;
    private isEnteredInternal;
    /** Whether the `open` event passed (a never-rendered host asks after its first render). */
    private approved;
    private token;
    private wasShown;
    private pendingFocus;
    private returnFocusTo;
    private releaseScrollLock;
    private pressOnScrim;
    private syncedOnce;
    private binding;
    private readonly backHandler;
    constructor(host: ReactiveElement, options?: ModalSurfaceOptions);
    /** Whether the surface is open (opening or open, not closing). */
    get open(): boolean;
    /** Whether the opening motion is running. */
    get opening(): boolean;
    /** Whether the closing motion is running. */
    get closing(): boolean;
    /**
     * Whether the surface has been put on screen and is open: false while a
     * freshly opened surface renders its first, closed frame, so the next
     * frame can transition in.
     */
    get entered(): boolean;
    /** Whether the surface is on screen (open or closing). */
    get shown(): boolean;
    /** Whether the surface is modal now. */
    get modal(): boolean;
    /**
     * Opens the surface. Fires a cancelable `open` event, then `opened` after
     * the opening motion. Resolves when `opened` was fired.
     */
    show(): Promise<void>;
    /**
     * Closes the surface. Fires a cancelable `close` event with
     * `detail.reason`, then `closed` after the closing motion. Resolves when
     * `closed` was fired.
     */
    close(reason?: string): Promise<void>;
    /**
     * Handles a close request as if the user made it: Escape, back or a scrim
     * click on a modal surface. Does nothing when the surface isn't open and
     * modal.
     */
    requestClose(reason: ModalCloseRequest): void;
    hostDisconnected(): void;
    hostUpdated(): void;
    private get defaultReason();
    private reset;
    private fire;
    private motion;
    /** Brings the dialog, focus, scroll lock and back handling in line with the state. */
    private sync;
    /** The surface left the screen: close the dialog, unlock, restore focus. */
    private hide;
    private focusIn;
    private restoreFocus;
    private bind;
    private unbind;
    /**
     * A close request on a modal dialog (Escape, or the back gesture or button):
     * animate closed instead of closing at once.
     */
    private readonly handleCancel;
    /**
     * The dialog closed without `close()`, for example after the browser forced
     * a close following repeated canceled Escape presses. Syncs the state.
     */
    private readonly handleNativeClose;
    private readonly handleKeyDown;
    private isScrimEvent;
    private readonly handlePointerDown;
    /**
     * A click on the scrim closes the surface, unless the press started
     * elsewhere (a text selection dragged out of a dialog).
     */
    private readonly handleClick;
}
