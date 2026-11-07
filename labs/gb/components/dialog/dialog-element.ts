/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, type CSSResultOrNative, html, isServer, LitElement, nothing} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {divider} from '../divider/divider.js';
import {iconButton} from '../iconbutton/icon-button.js';
import {dialog, getFocusableElements} from './dialog.js';

import dividerStyles from '../divider/divider.css' with {type: 'css'}; // github-only
// import dividerStyles from '../divider/divider.cssresult.js'; // google3-only
import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import iconButtonStyles from '../iconbutton/icon-button.css' with {type: 'css'}; // github-only
// import iconButtonStyles from '../iconbutton/icon-button.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import dialogStyles from './dialog.css' with {type: 'css'}; // github-only
// import dialogStyles from './dialog.cssresult.js'; // google3-only

/** The dialog's accessibility type. */
export type DialogType = 'alert' | 'dialog' | '';

/** Returns the focused element, looking inside open shadow roots. */
function getDeepActiveElement(): HTMLElement | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active as HTMLElement | null;
}

const baseClass = mixinDelegatesAria(LitElement);

/**
 * A Material Design dialog: a modal window in front of app content that
 * provides critical information or asks for a decision. Built on a native
 * modal `<dialog>` (`showModal()`), so the rest of the page is inert while it
 * is open.
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
export class DialogElement extends baseClass {
  // Layer order is pinned by the `@layer` statement at the top of
  // dialog.scss, so `md.comp.dialog` outranks the shared layers.
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    iconButtonStyles,
    dividerStyles,
    dialogStyles,
    css`
      :host([quick]) .dialog,
      :host([quick]) .dialog::backdrop,
      :host([quick]) .dialog-header {
        transition: none;
      }
    `,
  ];

  private isOpenInternal = false;

  /**
   * Opens the dialog when set to `true` and closes it when set to `false`.
   */
  @property({type: Boolean, reflect: true})
  get open(): boolean {
    return this.isOpenInternal;
  }
  set open(value: boolean) {
    if (value === this.isOpenInternal) {
      return;
    }
    if (value) {
      this.show();
    } else {
      this.close();
    }
  }

  /**
   * Uses the full-screen variant: the dialog fills the window, with a header
   * holding a close icon button, the headline and the confirm action. Meant
   * for compact windows; use a basic dialog at larger breakpoints.
   */
  @property({type: Boolean, reflect: true, attribute: 'full-screen'})
  fullScreen = false;

  /**
   * Skips the opening and closing animations.
   */
  @property({type: Boolean, reflect: true}) quick = false;

  /**
   * The dialog's return value, usually which button closed it. Set by
   * `close(returnValue)` and by `<form method="dialog">` submitters' `value`.
   * Canceling (Escape, scrim, close button) leaves it unchanged.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue
   */
  @property({attribute: false}) returnValue = '';

  /**
   * The dialog's accessibility role. `alert` (`role="alertdialog"`) or
   * `dialog` (`role="dialog"`). When empty, basic dialogs are alert dialogs,
   * as the spec asks for on the web, and full-screen dialogs are dialogs.
   */
  @property() type: DialogType = '';

  /**
   * Turns off focus trapping, which keeps Tab and Shift+Tab cycling inside
   * the dialog. Trapping is recommended for accessibility.
   */
  @property({type: Boolean, attribute: 'no-focus-trap'}) noFocusTrap = false;

  /**
   * Accessible label of the full-screen close icon button.
   */
  @property({attribute: 'close-label'}) closeLabel = 'Close';

  @state() private isClosing = false;
  @state() private hasIcon = false;
  @state() private hasHeadline = false;
  @state() private hasActions = false;
  @state() private hasContent = false;
  @state() private isAtScrollTop = true;
  @state() private isAtScrollBottom = true;

  @query('dialog') private readonly dialogElement!: HTMLDialogElement | null;
  @query('.dialog-scroller') private readonly scroller!: HTMLElement | null;
  @query('.dialog-anchor-top') private readonly topAnchor!: HTMLElement | null;
  @query('.dialog-anchor-bottom')
  private readonly bottomAnchor!: HTMLElement | null;

  private transitionCounter = 0;
  private pendingShow = false;
  private isClosingNatively = false;
  private pointerDownOnScrim = false;
  private previouslyFocused: HTMLElement | null = null;
  private intersectionObserver?: IntersectionObserver;

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('submit', this.handleSubmit);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.updateSlotState();
    if (this.pendingShow) {
      this.pendingShow = false;
      this.isOpenInternal = false;
      this.show();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // A disconnected `<dialog>` leaves the top layer without close events.
    if (this.isOpenInternal || this.isClosing) {
      this.transitionCounter++;
      this.isClosing = false;
      this.setOpenInternal(false);
    }
  }

  /**
   * Opens the dialog as a modal and fires a cancelable `open` event, then
   * `opened` after the enter animation. Focus moves to the first child with
   * an `autofocus` attribute, else the first focusable element, else the
   * dialog.
   *
   * @return Resolves after the animation, when `opened` was fired.
   */
  async show(): Promise<void> {
    if (this.isOpenInternal && !this.isClosing) {
      return;
    }
    const token = ++this.transitionCounter;
    this.setOpenInternal(true);
    this.isClosing = false;
    await this.updateComplete;
    if (token !== this.transitionCounter) {
      return;
    }
    if (!this.isConnected) {
      // Dialogs can open before being attached; `showModal()` needs a
      // connected element.
      this.pendingShow = true;
      return;
    }

    const preventOpen = !this.dispatchEvent(
      new Event('open', {cancelable: true}),
    );
    if (preventOpen) {
      this.setOpenInternal(false);
      return;
    }

    const dialogElement = this.dialogElement!;
    if (!dialogElement.open) {
      this.previouslyFocused = getDeepActiveElement();
      dialogElement.showModal();
      if (this.scroller) {
        this.scroller.scrollTop = 0;
      }
      this.focusInitialElement();
    }

    await this.waitForTransitions();
    if (token !== this.transitionCounter) {
      return;
    }
    this.dispatchEvent(new Event('opened'));
  }

  /**
   * Closes the dialog and fires a cancelable `close` event, then `closed`
   * after the exit animation. Focus returns to the element focused before
   * the dialog opened.
   *
   * @param returnValue A value usually indicating which button closed the
   *     dialog. Defaults to the current `returnValue`.
   * @return Resolves after the animation, when `closed` was fired.
   */
  async close(returnValue = this.returnValue): Promise<void> {
    if (!this.isOpenInternal) {
      return;
    }
    const dialogElement = this.dialogElement;
    if (!dialogElement?.open) {
      // Not shown yet (still awaiting render or connection).
      this.transitionCounter++;
      this.pendingShow = false;
      this.setOpenInternal(false);
      return;
    }

    const prevReturnValue = this.returnValue;
    this.returnValue = returnValue;
    const preventClose = !this.dispatchEvent(
      new Event('close', {cancelable: true}),
    );
    if (preventClose) {
      this.returnValue = prevReturnValue;
      return;
    }

    const token = ++this.transitionCounter;
    this.setOpenInternal(false);
    this.isClosing = true;
    await this.updateComplete;
    await this.waitForTransitions();
    if (token !== this.transitionCounter) {
      return;
    }

    this.isClosing = false;
    this.isClosingNatively = true;
    dialogElement.close(returnValue);
    this.isClosingNatively = false;
    await this.updateComplete;
    this.restoreFocus();
    this.dispatchEvent(new Event('closed'));
  }

  private setOpenInternal(open: boolean) {
    const prev = this.isOpenInternal;
    this.isOpenInternal = open;
    this.requestUpdate('open', prev);
  }

  /** Cancels the dialog: a cancelable `cancel` event, then `close()`. */
  private cancel() {
    const preventCancel = !this.dispatchEvent(
      new Event('cancel', {cancelable: true}),
    );
    if (!preventCancel) {
      this.close();
    }
  }

  private focusInitialElement() {
    const autofocus = this.querySelector<HTMLElement>('[autofocus]');
    if (autofocus) {
      autofocus.focus();
      return;
    }
    const [first] = getFocusableElements(this.dialogElement!);
    if (first) {
      first.focus();
    } else {
      this.dialogElement!.focus();
    }
  }

  private restoreFocus() {
    const previous = this.previouslyFocused;
    this.previouslyFocused = null;
    if (!previous?.isConnected) {
      return;
    }
    const active = getDeepActiveElement();
    const focusIsInDialog =
      !active ||
      active === document.body ||
      this.contains(active) ||
      !!this.shadowRoot?.contains(active);
    if (focusIsInDialog) {
      previous.focus();
    }
  }

  /** Waits for the dialog's open or close CSS transitions to finish. */
  private async waitForTransitions() {
    const dialogElement = this.dialogElement;
    if (this.quick || !dialogElement) {
      return;
    }
    // Reading animations flushes style, which starts the transitions. Only
    // the dialog's own (and its `::backdrop`'s) count, not content's.
    const animations = dialogElement
      .getAnimations({subtree: true})
      .filter(
        (animation) =>
          (animation.effect as KeyframeEffect | null)?.target === dialogElement,
      );
    await Promise.all(
      animations.map((animation) =>
        animation.finished.catch(() => {
          // Ignore canceled transitions.
        }),
      ),
    );
  }

  private readonly handleSubmit = (event: SubmitEvent) => {
    const form = event.target as HTMLFormElement;
    if (form.getAttribute('method') !== 'dialog') {
      return;
    }
    // The form is in light DOM, outside the shadow `<dialog>`, so native
    // `method="dialog"` handling would close an outer `<dialog>` instead.
    event.preventDefault();
    this.close(event.submitter?.getAttribute('value') ?? this.returnValue);
  };

  private readonly handleNativeCancel = (event: Event) => {
    if (event.target !== this.dialogElement) {
      return;
    }
    // Always prevent the native close; `close()` animates it out first.
    event.preventDefault();
    this.cancel();
  };

  private readonly handleNativeClose = () => {
    if (this.isClosingNatively) {
      return;
    }
    // The browser closed the dialog without `close()` (for example a second
    // Escape after a prevented cancel, or `requestClose()`): sync state.
    if (!this.isOpenInternal && !this.isClosing) {
      return;
    }
    this.transitionCounter++;
    this.isClosing = false;
    this.returnValue = this.dialogElement?.returnValue ?? this.returnValue;
    if (this.isOpenInternal) {
      this.setOpenInternal(false);
      this.dispatchEvent(new Event('close'));
    }
    this.restoreFocus();
    this.dispatchEvent(new Event('closed'));
  };

  private isOnScrim(event: MouseEvent) {
    const dialogElement = this.dialogElement;
    if (!dialogElement || this.fullScreen || event.composedPath()[0] !== dialogElement) {
      return false;
    }
    const rect = dialogElement.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  }

  private readonly handlePointerDown = (event: PointerEvent) => {
    this.pointerDownOnScrim = this.isOnScrim(event);
  };

  private readonly handleDialogClick = (event: MouseEvent) => {
    // Cancel only when the press both started and ended on the scrim, so a
    // text selection dragged out of the dialog doesn't close it.
    const onScrim = this.pointerDownOnScrim && this.isOnScrim(event);
    this.pointerDownOnScrim = false;
    if (onScrim && this.isOpenInternal) {
      this.cancel();
    }
  };

  private readonly handleCloseClick = () => {
    this.cancel();
  };

  private readonly handleSlotChange = () => {
    this.updateSlotState();
  };

  private updateSlotState() {
    const children = [...this.childNodes];
    const hasSlot = (name: string) =>
      children.some(
        (node) =>
          node instanceof Element && node.getAttribute('slot') === name,
      );
    this.hasIcon = hasSlot('icon');
    this.hasHeadline = hasSlot('headline');
    this.hasActions = hasSlot('actions');
    this.hasContent = children.some((node) =>
      node instanceof Element
        ? !node.hasAttribute('slot')
        : node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim(),
    );
  }

  protected override firstUpdated() {
    if (!this.scroller || !this.topAnchor || !this.bottomAnchor) {
      return;
    }
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const {target, isIntersecting} of entries) {
          if (target === this.topAnchor) {
            this.isAtScrollTop = isIntersecting;
          } else if (target === this.bottomAnchor) {
            this.isAtScrollBottom = isIntersecting;
          }
        }
      },
      {root: this.scroller},
    );
    this.intersectionObserver.observe(this.topAnchor);
    this.intersectionObserver.observe(this.bottomAnchor);
  }

  private get dialogRole(): 'alertdialog' | 'dialog' {
    if (this.type === 'alert') return 'alertdialog';
    if (this.type === 'dialog') return 'dialog';
    return this.fullScreen ? 'dialog' : 'alertdialog';
  }

  protected override render() {
    const visible = this.isOpenInternal || this.isClosing;
    const scrollable =
      visible && !(this.isAtScrollTop && this.isAtScrollBottom);
    // The full-screen variant is set on the host (`:host([full-screen])`),
    // not with the `dialog-full-screen` class; see dialog.scss.
    const classes = dialog({
      closing: this.isClosing,
      hasIcon: this.hasIcon && !this.fullScreen,
      hasHeadline: this.hasHeadline,
      hasActions: this.hasActions,
      scrollable,
      scrolledFromTop: !this.isAtScrollTop,
      scrolledFromBottom: !this.isAtScrollBottom,
    });
    const {ariaLabel} = this as ARIAMixinStrict;

    const actions = html`<slot
      name="actions"
      @slotchange=${this.handleSlotChange}></slot>`;

    return html`
      <dialog
        class="${classes}"
        part="dialog"
        role="${this.dialogRole}"
        tabindex="-1"
        aria-label="${ariaLabel || nothing}"
        aria-labelledby="${this.hasHeadline && !ariaLabel
          ? 'headline'
          : nothing}"
        aria-describedby="${this.hasContent ? 'content' : nothing}"
        ?data-no-focus-trap=${this.noFocusTrap}
        @cancel=${this.handleNativeCancel}
        @close=${this.handleNativeClose}
        @pointerdown=${this.handlePointerDown}
        @click=${this.handleDialogClick}>
        <div class="dialog-header" part="header">
          ${this.fullScreen
            ? html`<button
                type="button"
                class="${iconButton({
                  color: 'standard',
                  size: 'sm',
                  classes: {'dialog-close': true},
                })}"
                part="close-button"
                aria-label="${this.closeLabel}"
                @click=${this.handleCloseClick}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>`
            : nothing}
          <div class="dialog-icon" part="icon" aria-hidden="true">
            <slot name="icon" @slotchange=${this.handleSlotChange}></slot>
          </div>
          <h2 class="dialog-headline" id="headline" part="headline">
            <slot name="headline" @slotchange=${this.handleSlotChange}></slot>
          </h2>
          ${this.fullScreen
            ? html`<div class="dialog-header-actions" part="actions">
                ${actions}
              </div>`
            : nothing}
        </div>
        <hr
          class="${divider({
            classes: {'dialog-divider': true, 'dialog-divider-top': true},
          })}"
          aria-hidden="true" />
        <div class="dialog-scroller" part="scroller">
          <div class="dialog-anchor dialog-anchor-top"></div>
          <div class="dialog-content" id="content" part="content">
            <slot @slotchange=${this.handleSlotChange}></slot>
          </div>
          <div class="dialog-anchor dialog-anchor-bottom"></div>
        </div>
        <hr
          class="${divider({
            classes: {'dialog-divider': true, 'dialog-divider-bottom': true},
          })}"
          aria-hidden="true" />
        ${this.fullScreen
          ? nothing
          : html`<div class="dialog-actions" part="actions">${actions}</div>`}
      </dialog>
    `;
  }
}
