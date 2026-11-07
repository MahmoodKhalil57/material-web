/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, type CSSResultOrNative, html, isServer, LitElement, nothing} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {divider} from '../divider/divider.js';
import {iconButton} from '../iconbutton/icon-button.js';
import {AdaptiveController} from '../shared/adaptive.js';
import {ModalSurfaceController} from '../shared/modal-surface.js';
import {dialogClasses} from './dialog.js';

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

const baseClass = mixinDelegatesAria(LitElement);

// spec-labels: dialogs/specs/full-screen-dialogs, dialogs/guidelines/anatomy/full-screen-dialog,
// spec-labels: dialogs/specs/basic-dialogs/basic-dialog-measurements, dialogs/specs/basic-dialogs,
// spec-labels: dialogs/guidelines/anatomy/basic-dialog, dialogs/guidelines/usage,
// spec-labels: dialogs/guidelines/adaptive-design
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

  /**
   * Opens the dialog when set to `true` and closes it when set to `false`.
   */
  @property({type: Boolean, reflect: true})
  get open(): boolean {
    return this.modalSurface.open;
  }
  set open(value: boolean) {
    if (value === this.modalSurface.open) {
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
   * Full-screen dialogs are for compact windows only (dialogs.md: use a basic
   * dialog at medium and expanded). So `full-screen` applies at compact
   * windows and the dialog is a basic dialog above, with the same slots. The
   * host gets `adaptive-basic` while it falls back. Set `always-full-screen`
   * to keep the full-screen variant at every window size.
   */
  @property({type: Boolean, reflect: true, attribute: 'always-full-screen'})
  alwaysFullScreen = false;

  /** Window size class of the viewport. */
  private readonly windowSize = new AdaptiveController(this, {
    target: () => window,
    reflect: false,
  });

  /** Whether the dialog currently renders as the full-screen variant. */
  private get isFullScreen(): boolean {
    return (
      this.fullScreen &&
      (this.alwaysFullScreen || this.windowSize.sizeClass === 'compact')
    );
  }

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

  private previousReturnValue = '';
  private intersectionObserver?: IntersectionObserver;

  /**
   * Opens and closes the native dialog, closes it with Escape, back or the
   * scrim, traps and restores focus, locks page scrolling and fires the
   * `open`, `opened`, `close` and `closed` events.
   */
  private readonly modalSurface = new ModalSurfaceController(this, {
    dialog: () => this.dialogElement,
    closeOnDisconnect: true,
    trapFocus: () => !this.noFocusTrap,
    isScrim: (event) => this.isOnScrim(event),
    waitForMotion: () => this.waitForTransitions(),
    onCloseRequest: (reason) => {
      this.cancel(reason);
    },
    onShown: () => {
      if (this.scroller) {
        this.scroller.scrollTop = 0;
      }
    },
    onCloseCanceled: () => {
      this.returnValue = this.previousReturnValue;
    },
    onForcedClose: (dialog) => {
      this.returnValue = dialog.returnValue ?? this.returnValue;
    },
  });

  private get isClosing() {
    return this.modalSurface.closing;
  }

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('submit', this.handleSubmit);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.updateSlotState();
  }

  /**
   * Opens the dialog as a modal and fires a cancelable `open` event, then
   * `opened` after the enter animation. Focus moves to the first child with
   * an `autofocus` attribute, else the first focusable element, else the
   * dialog.
   *
   * @return Resolves after the animation, when `opened` was fired.
   */
  show(): Promise<void> {
    return this.modalSurface.show();
  }

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
  async close(returnValue = this.returnValue, reason?: string): Promise<void> {
    if (!this.modalSurface.open) {
      return;
    }
    this.previousReturnValue = this.returnValue;
    this.returnValue = returnValue;
    await this.modalSurface.close(reason);
  }

  /** Cancels the dialog: a cancelable `cancel` event, then `close()`. */
  private cancel(reason: string) {
    const preventCancel = !this.dispatchEvent(
      new Event('cancel', {cancelable: true}),
    );
    if (!preventCancel) {
      this.close(this.returnValue, reason);
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

  private isOnScrim(event: MouseEvent) {
    const dialogElement = this.dialogElement;
    if (!dialogElement || this.isFullScreen || event.composedPath()[0] !== dialogElement) {
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

  private readonly handleCloseClick = () => {
    this.cancel('close-button');
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

  protected override willUpdate() {
    this.toggleAttribute(
      'adaptive-basic',
      this.fullScreen && !this.isFullScreen,
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
    return this.isFullScreen ? 'dialog' : 'alertdialog';
  }

  protected override render() {
    const visible = this.modalSurface.shown;
    const scrollable =
      visible && !(this.isAtScrollTop && this.isAtScrollBottom);
    // The full-screen variant is set on the host (`:host([full-screen])`),
    // not with the `dialog-full-screen` class; see dialog.scss.
    const classes = classMap(dialogClasses({
      closing: this.isClosing,
      hasIcon: this.hasIcon && !this.isFullScreen,
      hasHeadline: this.hasHeadline,
      hasActions: this.hasActions,
      scrollable,
      scrolledFromTop: !this.isAtScrollTop,
      scrolledFromBottom: !this.isAtScrollBottom,
    }));
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
>
        <div class="dialog-header" part="header">
          ${this.isFullScreen
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
          <h2
            class="dialog-headline"
            id="headline"
            part="headline"
            aria-hidden="${this.hasHeadline ? nothing : 'true'}">
            <slot name="headline" @slotchange=${this.handleSlotChange}></slot>
          </h2>
          ${this.isFullScreen
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
        ${this.isFullScreen
          ? nothing
          : html`<div class="dialog-actions" part="actions">${actions}</div>`}
      </dialog>
    `;
  }
}
