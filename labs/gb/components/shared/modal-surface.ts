/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ReactiveController, type ReactiveElement} from 'lit';
import {
  BACK_REASON,
  BackHandler,
  closeRequestSource,
  ESCAPE_REASON,
} from './predictive-back.js';

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
} as const;

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
export function deepActiveElement(): HTMLElement | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active instanceof HTMLElement && active !== document.body
    ? active
    : null;
}

const FOCUSABLE =
  ':is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true],[contenteditable=""])' +
  ':not(:disabled,[disabled],[tabindex^="-"],[inert])';

function isFocusable(element: Element): element is HTMLElement {
  if (element.matches(FOCUSABLE)) {
    return true;
  }
  // A custom element without a tabindex is focusable when its shadow root
  // delegates focus (like `md-gb-button`).
  return (
    element.localName.includes('-') &&
    !element.matches(':disabled,[disabled]') &&
    (element.shadowRoot?.delegatesFocus ?? false)
  );
}

function isRendered(element: Element) {
  return element.checkVisibility?.({visibilityProperty: true}) ?? true;
}

function isDisplayContents(element: Element) {
  return getComputedStyle(element).display === 'contents';
}

/**
 * Returns the keyboard-focusable elements inside `root` in flat tree
 * (rendered) order: slots are expanded to their assigned elements and open
 * shadow roots are walked, except for custom elements that delegate focus,
 * which count as one stop.
 */
export function getFocusableElements(
  root: Element | ShadowRoot,
): HTMLElement[] {
  const result: HTMLElement[] = [];
  const visit = (node: Element) => {
    if (node instanceof HTMLSlotElement) {
      const assigned = node.assignedElements({flatten: true});
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
export function trapTabFocus(event: KeyboardEvent, surface: HTMLElement) {
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
  } else if (!event.shiftKey && (current === last || !current)) {
    event.preventDefault();
    first.focus();
  }
}

/** The attribute that marks the root element while page scroll is locked. */
export const SCROLL_LOCK_ATTRIBUTE = 'data-md-gb-scroll-lock';

let scrollLocks = 0;
let scrollLockStyles: CSSStyleSheet | null = null;

/**
 * Locks page scrolling with CSS: marks the root element, and a document style
 * rule (`:root[data-md-gb-scroll-lock]`) hides its overflow. Locks count, so
 * stacked modal surfaces release the page only when the last one closes.
 * Returns the function that releases this lock.
 */
export function lockPageScroll(): () => void {
  if (scrollLocks++ === 0) {
    if (!scrollLockStyles && typeof CSSStyleSheet !== 'undefined') {
      scrollLockStyles = new CSSStyleSheet();
      scrollLockStyles.replaceSync(
        `:root[${SCROLL_LOCK_ATTRIBUTE}] {overflow: hidden;}`,
      );
    }
    if (
      scrollLockStyles &&
      !document.adoptedStyleSheets.includes(scrollLockStyles)
    ) {
      document.adoptedStyleSheets = [
        ...document.adoptedStyleSheets,
        scrollLockStyles,
      ];
    }
    document.documentElement.setAttribute(SCROLL_LOCK_ATTRIBUTE, '');
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--scrollLocks === 0) {
      document.documentElement.removeAttribute(SCROLL_LOCK_ATTRIBUTE);
    }
  };
}

/** The state of a modal surface. */
export class ModalSurfaceController implements ReactiveController {
  private isOpenInternal = false;
  private isOpeningInternal = false;
  private isClosingInternal = false;
  private isEnteredInternal = false;
  /** Whether the `open` event passed (a never-rendered host asks after its first render). */
  private approved = false;
  private token = 0;
  private wasShown = false;
  private pendingFocus = false;
  private returnFocusTo: HTMLElement | null = null;
  private releaseScrollLock: (() => void) | null = null;
  private pressOnScrim: boolean | null = null;
  private syncedOnce = false;
  private binding: {
    dialog: HTMLDialogElement | null;
    surface: HTMLElement | null;
    scrim: HTMLElement | null;
    abort: AbortController;
  } | null = null;

  private readonly backHandler = new BackHandler((source) => {
    this.requestClose(source);
  });

  constructor(
    private readonly host: ReactiveElement,
    private readonly options: ModalSurfaceOptions = {},
  ) {
    host.addController(this);
  }

  /** Whether the surface is open (opening or open, not closing). */
  get open(): boolean {
    return this.options.isOpen ? this.options.isOpen() : this.isOpenInternal;
  }

  /** Whether the opening motion is running. */
  get opening(): boolean {
    return this.isOpeningInternal;
  }

  /** Whether the closing motion is running. */
  get closing(): boolean {
    return this.isClosingInternal;
  }

  /**
   * Whether the surface has been put on screen and is open: false while a
   * freshly opened surface renders its first, closed frame, so the next
   * frame can transition in.
   */
  get entered(): boolean {
    return this.options.isOpen ? this.open : this.isEnteredInternal;
  }

  /** Whether the surface is on screen (open or closing). */
  get shown(): boolean {
    return this.open || this.isClosingInternal;
  }

  /** Whether the surface is modal now. */
  get modal(): boolean {
    return this.options.modal ? this.options.modal() : true;
  }

  /**
   * Opens the surface. Fires a cancelable `open` event, then `opened` after
   * the opening motion. Resolves when `opened` was fired.
   */
  async show(): Promise<void> {
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
  async close(reason: string = this.defaultReason): Promise<void> {
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
  requestClose(reason: ModalCloseRequest): void {
    if (!this.open || !this.modal) {
      return;
    }
    if (this.options.onCloseRequest) {
      this.options.onCloseRequest(reason);
    } else {
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

  private get defaultReason(): string {
    return this.options.defaultReason ?? MODAL_CLOSE_REASONS.DISMISS;
  }

  private reset() {
    this.isOpenInternal = false;
    this.isOpeningInternal = false;
    this.isClosingInternal = false;
    this.isEnteredInternal = false;
    this.approved = false;
  }

  private fire(type: string, cancelable: boolean, reason?: string): boolean {
    const init = {bubbles: !!this.options.bubbles, cancelable};
    const event =
      reason === undefined
        ? new Event(type, init)
        : new CustomEvent(type, {...init, detail: {reason}});
    return this.host.dispatchEvent(event);
  }

  private async motion(opening: boolean) {
    try {
      await this.options.waitForMotion?.(opening);
    } catch {
      // A canceled animation ends the motion early.
    }
  }

  /** Brings the dialog, focus, scroll lock and back handling in line with the state. */
  private sync() {
    const {host, options} = this;
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
        } else {
          // Not `show()`, which moves focus into the dialog: a standard
          // surface opens beside the content without taking focus.
          dialog.setAttribute('open', '');
        }
        freshlyShown = true;
      }
    } else if (freshlyShown) {
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
    } else if (!modal) {
      this.releaseScrollLock?.();
      this.releaseScrollLock = null;
    }
    if (!dialog && modal) {
      this.backHandler.enable();
    } else {
      this.backHandler.disable();
    }
    this.syncedOnce = true;
  }

  /** The surface left the screen: close the dialog, unlock, restore focus. */
  private hide(dialog: HTMLDialogElement | null) {
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

  private focusIn(dialog: HTMLDialogElement | null) {
    const surface = this.options.surface?.() ?? dialog;
    const target =
      this.options.initialFocus?.() ??
      this.host.querySelector<HTMLElement>('[autofocus]') ??
      surface?.querySelector<HTMLElement>('[autofocus]') ??
      (surface ? getFocusableElements(surface.shadowRoot ?? surface)[0] : null) ??
      surface;
    target?.focus();
  }

  private restoreFocus() {
    const target = this.returnFocusTo;
    this.returnFocusTo = null;
    if (!target?.isConnected) {
      return;
    }
    // Focus the user already moved elsewhere stays. Focus that fell to the
    // body (closing the dialog can drop it there) counts as no focus.
    const active = deepActiveElement();
    if (
      !active ||
      active === document.body ||
      active === document.documentElement ||
      this.host.matches(':focus-within')
    ) {
      target.focus();
    }
  }

  private bind(dialog: HTMLDialogElement | null) {
    const surface = this.options.surface?.() ?? dialog;
    const scrim = this.options.scrim?.() ?? dialog;
    const current = this.binding;
    if (
      current &&
      current.dialog === dialog &&
      current.surface === surface &&
      current.scrim === scrim
    ) {
      return;
    }
    this.unbind();
    const abort = new AbortController();
    const {signal} = abort;
    dialog?.addEventListener('cancel', this.handleCancel, {signal});
    dialog?.addEventListener('close', this.handleNativeClose, {signal});
    surface?.addEventListener('keydown', this.handleKeyDown, {signal});
    scrim?.addEventListener('pointerdown', this.handlePointerDown, {signal});
    scrim?.addEventListener('click', this.handleClick, {signal});
    this.binding = {dialog, surface, scrim, abort};
  }

  private unbind() {
    this.binding?.abort.abort();
    this.binding = null;
  }

  /**
   * A close request on a modal dialog (Escape, or the back gesture or button):
   * animate closed instead of closing at once.
   */
  private readonly handleCancel = (event: Event) => {
    event.preventDefault();
    this.requestClose(closeRequestSource(event));
  };

  /**
   * The dialog closed without `close()`, for example after the browser forced
   * a close following repeated canceled Escape presses. Syncs the state.
   */
  private readonly handleNativeClose = () => {
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

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || !this.shown || !this.modal) {
      return;
    }
    if (event.key === 'Escape') {
      if (!event.isComposing) {
        event.preventDefault();
        this.requestClose(ESCAPE_REASON);
      }
    } else if (event.key === 'Tab' && (this.options.trapFocus?.() ?? true)) {
      if (this.binding?.surface) trapTabFocus(event, this.binding.surface);
    }
  };

  private isScrimEvent(event: MouseEvent): boolean {
    return this.options.isScrim
      ? this.options.isScrim(event)
      : event.target === event.currentTarget;
  }

  private readonly handlePointerDown = (event: PointerEvent) => {
    this.pressOnScrim = this.isScrimEvent(event);
  };

  /**
   * A click on the scrim closes the surface, unless the press started
   * elsewhere (a text selection dragged out of a dialog).
   */
  private readonly handleClick = (event: MouseEvent) => {
    const started = this.pressOnScrim;
    this.pressOnScrim = null;
    if (started !== false && this.isScrimEvent(event)) {
      this.requestClose(MODAL_CLOSE_REASONS.SCRIM);
    }
  };
}
