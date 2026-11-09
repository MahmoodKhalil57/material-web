/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { BACK_REASON, BackHandler, closeRequestSource, ESCAPE_REASON, } from './predictive-back.js';
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
export const MODAL_CLOSE_REASONS = {
    /** `close()` was called without a reason. */
    DISMISS: 'dismiss',
    /** Escape was pressed. */
    ESCAPE: ESCAPE_REASON,
    /** The Android back gesture or button. */
    BACK: BACK_REASON,
    /** The scrim was clicked. */
    SCRIM: 'scrim',
};
/** The focused element, looking through open shadow roots. */
export function deepActiveElement() {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) {
        active = active.shadowRoot.activeElement;
    }
    return active instanceof HTMLElement && active !== document.body
        ? active
        : null;
}
const FOCUSABLE = ':is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true],[contenteditable=""])' +
    ':not(:disabled,[disabled],[tabindex^="-"],[inert])';
function isFocusable(element) {
    if (element.matches(FOCUSABLE)) {
        return true;
    }
    // A custom element without a tabindex is focusable when its shadow root
    // delegates focus (like `md-gb-button`).
    return (element.localName.includes('-') &&
        !element.matches(':disabled,[disabled]') &&
        (element.shadowRoot?.delegatesFocus ?? false));
}
function isRendered(element) {
    return element.checkVisibility?.({ visibilityProperty: true }) ?? true;
}
function isDisplayContents(element) {
    return getComputedStyle(element).display === 'contents';
}
/**
 * Returns the keyboard-focusable elements inside `root` in flat tree
 * (rendered) order: slots are expanded to their assigned elements and open
 * shadow roots are walked, except for custom elements that delegate focus,
 * which count as one stop. With `first`, returns only the first one.
 */
export function getFocusableElements(root, { first = false } = {}) {
    const result = [];
    const visit = (node) => {
        // With `first`, the walk stops at the first one: each element it checks
        // is a style lookup (checkVisibility), and a surface such as a rail with
        // its destinations has hundreds.
        if (first && result.length) {
            return;
        }
        if (node instanceof HTMLSlotElement) {
            const assigned = node.assignedElements({ flatten: true });
            const children = assigned.length ? assigned : [...node.children];
            children.forEach(visit);
            return;
        }
        if (node.hasAttribute('inert')) {
            return;
        }
        const rendered = isRendered(node);
        // `display: contents` elements have no box but their children do.
        if (!rendered && !isDisplayContents(node)) {
            return;
        }
        if (rendered && isFocusable(node)) {
            result.push(node);
            if (node.shadowRoot?.delegatesFocus) {
                return;
            }
        }
        const children = node.shadowRoot ? node.shadowRoot.children : node.children;
        [...children].forEach(visit);
    };
    [...root.children].forEach(visit);
    return result;
}
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
export function trapTabFocus(event, surface) {
    const focusable = getFocusableElements(surface.shadowRoot ?? surface);
    if (!focusable.length) {
        event.preventDefault();
        surface.focus();
        return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = event
        .composedPath()
        .find((t) => t instanceof HTMLElement && focusable.includes(t));
    if (event.shiftKey && (current === first || !current)) {
        event.preventDefault();
        last.focus();
    }
    else if (!event.shiftKey && (current === last || !current)) {
        event.preventDefault();
        first.focus();
    }
}
/** The attribute that marks the root element while page scroll is locked. */
export const SCROLL_LOCK_ATTRIBUTE = 'data-md-gb-scroll-lock';
let scrollLocks = 0;
let scrollLockStyles = null;
/**
 * Locks page scrolling with CSS: marks the root element, and a document style
 * rule (`:root[data-md-gb-scroll-lock]`) hides its overflow. Locks count, so
 * stacked modal surfaces release the page only when the last one closes.
 * Returns the function that releases this lock.
 */
export function lockPageScroll() {
    if (scrollLocks++ === 0) {
        if (!scrollLockStyles && typeof CSSStyleSheet !== 'undefined') {
            scrollLockStyles = new CSSStyleSheet();
            scrollLockStyles.replaceSync(`:root[${SCROLL_LOCK_ATTRIBUTE}] {overflow: hidden;}`);
        }
        if (scrollLockStyles &&
            !document.adoptedStyleSheets.includes(scrollLockStyles)) {
            document.adoptedStyleSheets = [
                ...document.adoptedStyleSheets,
                scrollLockStyles,
            ];
        }
        document.documentElement.setAttribute(SCROLL_LOCK_ATTRIBUTE, '');
    }
    let released = false;
    return () => {
        if (released)
            return;
        released = true;
        if (--scrollLocks === 0) {
            document.documentElement.removeAttribute(SCROLL_LOCK_ATTRIBUTE);
        }
    };
}
/** The state of a modal surface. */
export class ModalSurfaceController {
    constructor(host, options = {}) {
        this.host = host;
        this.options = options;
        this.isOpenInternal = false;
        this.isOpeningInternal = false;
        this.isClosingInternal = false;
        this.isEnteredInternal = false;
        /** Whether the `open` event passed (a never-rendered host asks after its first render). */
        this.approved = false;
        this.token = 0;
        this.wasShown = false;
        this.pendingFocus = false;
        this.returnFocusTo = null;
        this.releaseScrollLock = null;
        this.pressOnScrim = null;
        this.syncedOnce = false;
        this.binding = null;
        this.backHandler = new BackHandler((source) => {
            this.requestClose(source);
        });
        /**
         * A close request on a modal dialog (Escape, or the back gesture or button):
         * animate closed instead of closing at once.
         */
        this.handleCancel = (event) => {
            event.preventDefault();
            this.requestClose(closeRequestSource(event));
        };
        /**
         * The dialog closed without `close()`, for example after the browser forced
         * a close following repeated canceled Escape presses. Syncs the state.
         */
        this.handleNativeClose = () => {
            const dialog = this.options.dialog?.();
            if (this.options.isOpen || !this.isOpenInternal || !dialog || dialog.open) {
                return;
            }
            this.token++;
            this.reset();
            this.host.requestUpdate('open', true);
            this.options.onForcedClose?.(dialog);
            this.sync();
            const reason = this.options.forcedCloseReason ?? MODAL_CLOSE_REASONS.ESCAPE;
            this.fire('close', false, reason);
            this.fire('closed', false, reason);
        };
        this.handleKeyDown = (event) => {
            if (event.defaultPrevented || !this.shown || !this.modal) {
                return;
            }
            if (event.key === 'Escape') {
                if (!event.isComposing) {
                    event.preventDefault();
                    this.requestClose(ESCAPE_REASON);
                }
            }
            else if (event.key === 'Tab' && (this.options.trapFocus?.() ?? true)) {
                if (this.binding?.surface)
                    trapTabFocus(event, this.binding.surface);
            }
        };
        this.handlePointerDown = (event) => {
            this.pressOnScrim = this.isScrimEvent(event);
        };
        /**
         * A click on the scrim closes the surface, unless the press started
         * elsewhere (a text selection dragged out of a dialog).
         */
        this.handleClick = (event) => {
            const started = this.pressOnScrim;
            this.pressOnScrim = null;
            if (started !== false && this.isScrimEvent(event)) {
                this.requestClose(MODAL_CLOSE_REASONS.SCRIM);
            }
        };
        host.addController(this);
    }
    /** Whether the surface is open (opening or open, not closing). */
    get open() {
        return this.options.isOpen ? this.options.isOpen() : this.isOpenInternal;
    }
    /** Whether the opening motion is running. */
    get opening() {
        return this.isOpeningInternal;
    }
    /** Whether the closing motion is running. */
    get closing() {
        return this.isClosingInternal;
    }
    /**
     * Whether the surface has been put on screen and is open: false while a
     * freshly opened surface renders its first, closed frame, so the next
     * frame can transition in.
     */
    get entered() {
        return this.options.isOpen ? this.open : this.isEnteredInternal;
    }
    /** Whether the surface is on screen (open or closing). */
    get shown() {
        return this.open || this.isClosingInternal;
    }
    /** Whether the surface is modal now. */
    get modal() {
        return this.options.modal ? this.options.modal() : true;
    }
    /**
     * Opens the surface. Fires a cancelable `open` event, then `opened` after
     * the opening motion. Resolves when `opened` was fired.
     */
    async show() {
        if (this.options.isOpen || (this.isOpenInternal && !this.closing)) {
            return;
        }
        // A host that never rendered (opened by an attribute) asks after its
        // first render, so listeners attached after creation hear `open`.
        const initial = !this.host.hasUpdated;
        if (!initial && !this.fire('open', true)) {
            return;
        }
        const token = ++this.token;
        if (!this.wasShown) {
            this.returnFocusTo = deepActiveElement();
        }
        this.options.onWillShow?.();
        const prev = this.isOpenInternal;
        this.isOpenInternal = true;
        this.isClosingInternal = false;
        this.isOpeningInternal = true;
        this.isEnteredInternal = initial ? true : this.isEnteredInternal;
        this.approved = !initial;
        this.host.requestUpdate('open', prev);
        await this.host.updateComplete;
        if (token !== this.token) {
            return;
        }
        if (initial) {
            if (!this.fire('open', true)) {
                this.reset();
                this.host.requestUpdate('open', true);
                return;
            }
            this.approved = true;
            this.sync();
            await this.host.updateComplete;
            if (token !== this.token) {
                return;
            }
        }
        await this.motion(true);
        if (token !== this.token) {
            return;
        }
        this.isOpeningInternal = false;
        this.host.requestUpdate();
        this.fire('opened', false);
    }
    /**
     * Closes the surface. Fires a cancelable `close` event with
     * `detail.reason`, then `closed` after the closing motion. Resolves when
     * `closed` was fired.
     */
    async close(reason = this.defaultReason) {
        if (this.options.isOpen || !this.isOpenInternal) {
            return;
        }
        if (!this.approved) {
            // Still waiting for its first render: nothing is on screen.
            this.token++;
            this.reset();
            this.host.requestUpdate('open', true);
            return;
        }
        if (!this.fire('close', true, reason)) {
            this.options.onCloseCanceled?.();
            return;
        }
        const token = ++this.token;
        this.options.onWillClose?.(reason);
        this.isOpenInternal = false;
        this.isOpeningInternal = false;
        this.isEnteredInternal = false;
        this.isClosingInternal = true;
        this.host.requestUpdate('open', true);
        await this.host.updateComplete;
        if (token !== this.token) {
            return;
        }
        await this.motion(false);
        if (token !== this.token) {
            return;
        }
        this.isClosingInternal = false;
        this.host.requestUpdate();
        // The update closes the dialog and restores focus.
        await this.host.updateComplete;
        this.fire('closed', false, reason);
    }
    /**
     * Handles a close request as if the user made it: Escape, back or a scrim
     * click on a modal surface. Does nothing when the surface isn't open and
     * modal.
     */
    requestClose(reason) {
        if (!this.open || !this.modal) {
            return;
        }
        if (this.options.onCloseRequest) {
            this.options.onCloseRequest(reason);
        }
        else {
            this.close(reason);
        }
    }
    hostDisconnected() {
        this.unbind();
        this.backHandler.disable();
        this.releaseScrollLock?.();
        this.releaseScrollLock = null;
        this.pendingFocus = false;
        if (this.isClosingInternal) {
            this.token++;
            this.isClosingInternal = false;
        }
        if (this.options.closeOnDisconnect && this.isOpenInternal) {
            this.token++;
            // A disconnected `<dialog>` leaves the top layer without close events.
            this.options.dialog?.()?.close();
            this.reset();
            this.host.requestUpdate('open', true);
        }
    }
    hostUpdated() {
        this.sync();
    }
    get defaultReason() {
        return this.options.defaultReason ?? MODAL_CLOSE_REASONS.DISMISS;
    }
    reset() {
        this.isOpenInternal = false;
        this.isOpeningInternal = false;
        this.isClosingInternal = false;
        this.isEnteredInternal = false;
        this.approved = false;
    }
    fire(type, cancelable, reason) {
        const init = { bubbles: !!this.options.bubbles, cancelable };
        const event = reason === undefined
            ? new Event(type, init)
            : new CustomEvent(type, { ...init, detail: { reason } });
        return this.host.dispatchEvent(event);
    }
    async motion(opening) {
        try {
            await this.options.waitForMotion?.(opening);
        }
        catch {
            // A canceled animation ends the motion early.
        }
    }
    /** Brings the dialog, focus, scroll lock and back handling in line with the state. */
    sync() {
        const { host, options } = this;
        const dialog = options.dialog?.() ?? null;
        this.bind(dialog);
        const external = !!options.isOpen;
        const onScreen = this.shown && (this.approved || external);
        const modal = this.modal;
        if (!onScreen) {
            this.hide(dialog);
            this.syncedOnce = true;
            return;
        }
        if (!host.isConnected) {
            return;
        }
        // A modal surface that is open from the start doesn't take focus.
        const initiallyOpen = external && !this.syncedOnce;
        let freshlyShown = false;
        if (!this.wasShown) {
            this.wasShown = true;
            freshlyShown = true;
            if (!initiallyOpen && !this.returnFocusTo) {
                this.returnFocusTo = deepActiveElement();
            }
        }
        if (dialog) {
            if (dialog.open && dialog.matches(':modal') !== modal) {
                dialog.close();
            }
            if (!dialog.open) {
                options.onBeforeShow?.();
                if (modal) {
                    dialog.showModal();
                }
                else {
                    // Not `show()`, which moves focus into the dialog: a standard
                    // surface opens beside the content without taking focus.
                    dialog.setAttribute('open', '');
                }
                freshlyShown = true;
            }
        }
        else if (freshlyShown) {
            options.onBeforeShow?.();
        }
        if (freshlyShown && modal && !initiallyOpen) {
            this.pendingFocus = true;
        }
        // Focus moves once the entered frame is rendered, so a surface that
        // hides its closed frame (visibility) can take it.
        if (this.pendingFocus && this.entered) {
            this.pendingFocus = false;
            this.focusIn(dialog);
        }
        if (this.open && !this.entered) {
            // Render the closed frame before the surface transitions in.
            (dialog ?? options.surface?.() ?? host).getBoundingClientRect();
            this.isEnteredInternal = true;
            host.requestUpdate();
        }
        if (freshlyShown) {
            options.onShown?.();
        }
        if (modal && !this.releaseScrollLock) {
            this.releaseScrollLock = lockPageScroll();
        }
        else if (!modal) {
            this.releaseScrollLock?.();
            this.releaseScrollLock = null;
        }
        if (!dialog && modal) {
            this.backHandler.enable();
        }
        else {
            this.backHandler.disable();
        }
        this.syncedOnce = true;
    }
    /** The surface left the screen: close the dialog, unlock, restore focus. */
    hide(dialog) {
        this.backHandler.disable();
        this.releaseScrollLock?.();
        this.releaseScrollLock = null;
        this.pendingFocus = false;
        if (dialog?.open) {
            dialog.close();
        }
        if (this.wasShown) {
            this.wasShown = false;
            this.isEnteredInternal = false;
            this.options.onHidden?.();
            this.restoreFocus();
        }
    }
    focusIn(dialog) {
        const surface = this.options.surface?.() ?? dialog;
        const target = this.options.initialFocus?.() ??
            this.host.querySelector('[autofocus]') ??
            surface?.querySelector('[autofocus]') ??
            (surface
                ? getFocusableElements(surface.shadowRoot ?? surface, { first: true })[0]
                : null) ??
            surface;
        target?.focus();
    }
    restoreFocus() {
        const target = this.returnFocusTo;
        this.returnFocusTo = null;
        if (!target?.isConnected) {
            return;
        }
        // Focus the user already moved elsewhere stays. Focus that fell to the
        // body (closing the dialog can drop it there) counts as no focus.
        const active = deepActiveElement();
        if (!active ||
            active === document.body ||
            active === document.documentElement ||
            this.host.matches(':focus-within')) {
            target.focus();
        }
    }
    bind(dialog) {
        const surface = this.options.surface?.() ?? dialog;
        const scrim = this.options.scrim?.() ?? dialog;
        const current = this.binding;
        if (current &&
            current.dialog === dialog &&
            current.surface === surface &&
            current.scrim === scrim) {
            return;
        }
        this.unbind();
        const abort = new AbortController();
        const { signal } = abort;
        dialog?.addEventListener('cancel', this.handleCancel, { signal });
        dialog?.addEventListener('close', this.handleNativeClose, { signal });
        surface?.addEventListener('keydown', this.handleKeyDown, { signal });
        scrim?.addEventListener('pointerdown', this.handlePointerDown, { signal });
        scrim?.addEventListener('click', this.handleClick, { signal });
        this.binding = { dialog, surface, scrim, abort };
    }
    unbind() {
        this.binding?.abort.abort();
        this.binding = null;
    }
    isScrimEvent(event) {
        return this.options.isScrim
            ? this.options.isScrim(event)
            : event.target === event.currentTarget;
    }
}
//# sourceMappingURL=modal-surface.js.map