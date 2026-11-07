/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  CSSResultOrNative,
  html,
  LitElement,
  type PropertyValues,
} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import {styles as focusRingStyles} from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import {styles as rippleStyles} from '../ripple/ripple.cssresult.js'; // google3-only
import navDrawerStyles from './nav-drawer.css' with {type: 'css'}; // github-only
// import {styles as navDrawerStyles} from './nav-drawer.cssresult.js'; // google3-only

import {
  getNextNavDrawerItem,
  NAV_DRAWER_CLOSE_REASONS,
  navDrawerClasses,
  navDrawerDialogClasses,
} from './nav-drawer.js';
import {NavDrawerItemElement} from './nav-drawer-item-element.js';

/** Default accessible name of the drawer (Compose `Strings.NavigationMenu`). */
const DEFAULT_LABEL = 'Navigation menu';

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(LitElement);

/**
 * A Material Design navigation drawer.
 *
 * A standard drawer sits next to the app content and slides in and out with
 * `open`. A `modal` drawer opens over a scrim in a modal `<dialog>`: focus is
 * trapped inside it and restored when it closes, and it closes on Escape, a
 * scrim click, or when an item is selected.
 *
 * @slot - Navigation items (`md-gb-nav-drawer-item`), section labels (headings
 *     or `.nav-drawer-section-label`) and dividers (`md-gb-divider` or `<hr>`).
 * @slot headline - Optional headline shown above the items.
 * @csspart drawer - The drawer sheet.
 * @csspart nav - The `<nav>` landmark.
 * @csspart dialog - The modal drawer's `<dialog>`.
 * @csspart scrim - The modal drawer's scrim.
 * @fires {Event} open - Fired when the drawer starts opening. --cancelable
 * @fires {Event} opened - Fired when the drawer has opened and finished animating.
 * @fires {CustomEvent<{reason: string}>} close - Fired when the drawer starts closing. --cancelable
 * @fires {CustomEvent<{reason: string}>} closed - Fired when the drawer has closed and finished animating.
 * @fires {Event} change - Fired when the user selects a different item. --bubbles
 * @cssprop --active-focus-icon-color
 * @cssprop --active-focus-label-text-color
 * @cssprop --active-hover-icon-color
 * @cssprop --active-hover-label-text-color
 * @cssprop --active-icon-color
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-height
 * @cssprop --active-indicator-shape
 * @cssprop --active-indicator-width
 * @cssprop --active-label-text
 * @cssprop --active-label-text-axes
 * @cssprop --active-label-text-color
 * @cssprop --active-pressed-icon-color
 * @cssprop --active-pressed-label-text-color
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height
 * @cssprop --container-padding-block
 * @cssprop --container-padding-inline
 * @cssprop --container-shape - Radius of the end corners.
 * @cssprop --container-width
 * @cssprop --container-width-minimum
 * @cssprop --divider-inset
 * @cssprop --headline
 * @cssprop --headline-axes
 * @cssprop --headline-color
 * @cssprop --headline-tracking
 * @cssprop --icon-size
 * @cssprop --inactive-focus-icon-color
 * @cssprop --inactive-focus-label-text-color
 * @cssprop --inactive-hover-icon-color
 * @cssprop --inactive-hover-label-text-color
 * @cssprop --inactive-icon-color
 * @cssprop --inactive-label-text-color
 * @cssprop --inactive-pressed-icon-color
 * @cssprop --inactive-pressed-label-text-color
 * @cssprop --item-icon-label-space
 * @cssprop --item-leading-space
 * @cssprop --item-trailing-space
 * @cssprop --label-text
 * @cssprop --label-text-axes
 * @cssprop --label-text-tracking
 * @cssprop --large-badge-label
 * @cssprop --large-badge-label-axes
 * @cssprop --large-badge-label-color
 * @cssprop --large-badge-label-tracking
 * @cssprop --motion-close-duration
 * @cssprop --motion-close-easing
 * @cssprop --motion-effects-duration
 * @cssprop --motion-effects-easing
 * @cssprop --motion-open-duration
 * @cssprop --motion-open-easing
 * @cssprop --scrim-color
 * @cssprop --section-label-height
 * @cssprop --section-label-leading-space
 */
export class NavDrawerElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    navDrawerStyles,
    css`
      :host {
        block-size: 100%;
        display: block;
        flex: none;
      }

      :host([modal]) {
        display: contents;
      }

      :host([hidden]) {
        display: none;
      }

      :host([quick]) :is(.nav-drawer, .nav-drawer-scrim) {
        transition: none;
      }
    `,
  ];

  private isOpenInternal = false;

  /** Whether the drawer is open. */
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
      this.close(NAV_DRAWER_CLOSE_REASONS.method);
    }
  }

  /**
   * Whether the drawer is modal: it opens over a scrim that blocks the rest of
   * the app, instead of sitting next to the content.
   */
  @property({type: Boolean, reflect: true}) modal = false;

  /** Whether to skip the open and close transitions. */
  @property({type: Boolean, reflect: true}) quick = false;

  /** Whether the sheet is on screen (drives the transitions). */
  @state() private visible = false;

  @query('.nav-drawer') private readonly sheet!: HTMLElement | null;
  @query('dialog') private readonly dialog!: HTMLDialogElement | null;

  private transitionCounter = 0;
  private restoreFocusTo: HTMLElement | null = null;

  /** The drawer's items. */
  get items(): NavDrawerItemElement[] {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(
      'slot:not([name])',
    );
    const elements = slot
      ? slot.assignedElements({flatten: true})
      : Array.from(this.children);
    return elements.filter(
      (el): el is NavDrawerItemElement => el instanceof NavDrawerItemElement,
    );
  }

  /** The selected item, if any. */
  get selectedItem(): NavDrawerItemElement | null {
    return this.items.find((item) => item.selected) ?? null;
  }

  constructor() {
    super();
    this.addEventListener('click', this.handleItemClick);
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('focusin', this.handleFocusIn);
  }

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, [focusRingStyles, rippleStyles, navDrawerStyles]);
  }

  /** Opens the drawer. Resolves once it has finished animating. */
  async show(): Promise<void> {
    if (this.isOpenInternal) {
      return;
    }
    const preventOpen = !this.dispatchEvent(
      new Event('open', {cancelable: true}),
    );
    if (preventOpen) {
      return;
    }

    const token = ++this.transitionCounter;
    // A drawer that starts open renders open without animating.
    const initial = !this.hasUpdated;
    this.isOpenInternal = true;
    this.requestUpdate('open', false);
    if (initial) {
      this.visible = true;
    }
    await this.updateComplete;
    if (token !== this.transitionCounter) {
      return;
    }

    if (this.modal) {
      this.showDialog();
      // Render the closed sheet before sliding it in.
      this.sheet?.getBoundingClientRect();
    }
    this.visible = true;
    await this.updateComplete;
    if (this.modal) {
      this.focusInitialItem();
    }
    await this.waitForTransitions();
    if (token !== this.transitionCounter) {
      return;
    }
    this.dispatchEvent(new Event('opened'));
  }

  /**
   * Closes the drawer. Resolves once it has finished animating.
   *
   * @param reason Why the drawer closes, given in the `close` and `closed`
   *     events (see `NAV_DRAWER_CLOSE_REASONS`).
   */
  async close(
    reason: string = NAV_DRAWER_CLOSE_REASONS.method,
  ): Promise<void> {
    if (!this.isOpenInternal) {
      return;
    }
    const preventClose = !this.dispatchEvent(
      new CustomEvent('close', {cancelable: true, detail: {reason}}),
    );
    if (preventClose) {
      return;
    }

    const token = ++this.transitionCounter;
    this.isOpenInternal = false;
    this.requestUpdate('open', true);
    this.visible = false;
    await this.updateComplete;
    await this.waitForTransitions();
    if (token !== this.transitionCounter) {
      return;
    }
    this.closeDialog();
    this.dispatchEvent(new CustomEvent('closed', {detail: {reason}}));
  }

  /**
   * Opens the drawer when closed, closes it when open.
   *
   * @return A promise that resolves once the drawer has finished animating.
   */
  toggle(): Promise<void> {
    return this.open ? this.close() : this.show();
  }

  protected override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (changed.has('modal') && changed.get('modal') !== undefined) {
      // Switching between standard and modal while open: show the new
      // container without animating.
      if (this.open && this.modal) {
        this.showDialog();
      }
      if (!this.modal) {
        this.restoreFocusTo = null;
      }
    }
    this.syncTabStops();
  }

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    const label = ariaLabel || DEFAULT_LABEL;
    const sheet = html`
      <div
        part="drawer"
        class=${classMap(
          navDrawerClasses({modal: this.modal, open: this.visible}),
        )}>
        <nav part="nav" class="nav-drawer-nav" aria-label=${label}>
          <slot name="headline"></slot>
          <slot @slotchange=${this.handleSlotChange}></slot>
        </nav>
      </div>
    `;
    if (!this.modal) {
      return sheet;
    }
    return html`
      <dialog
        part="dialog"
        class=${classMap(navDrawerDialogClasses({open: this.visible}))}
        aria-label=${label}
        @cancel=${this.handleCancel}
        @close=${this.handleDialogClose}>
        <div
          part="scrim"
          class="nav-drawer-scrim"
          aria-hidden="true"
          @click=${this.handleScrimClick}></div>
        ${sheet}
      </dialog>
    `;
  }

  private showDialog() {
    const dialog = this.dialog;
    if (!dialog || dialog.open || !this.isConnected) {
      return;
    }
    this.restoreFocusTo = getDeepActiveElement();
    dialog.showModal();
  }

  private closeDialog() {
    const dialog = this.dialog;
    if (dialog?.open) {
      dialog.close();
    }
    const restoreTo = this.restoreFocusTo;
    this.restoreFocusTo = null;
    if (restoreTo?.isConnected) {
      restoreTo.focus();
    }
  }

  private focusInitialItem() {
    // Initial focus lands on the selected item, else the first item.
    const items = this.items.filter((item) => !item.disabled);
    const target = items.find((item) => item.selected) ?? items[0];
    target?.focus();
  }

  private async waitForTransitions() {
    const sheet = this.sheet;
    if (!sheet || this.quick) {
      return;
    }
    const targets = [sheet, this.shadowRoot?.querySelector('.nav-drawer-scrim')];
    const animations = targets.flatMap(
      (el) => (el as HTMLElement | null)?.getAnimations() ?? [],
    );
    await Promise.all(
      animations.map((animation) => animation.finished.catch(() => {})),
    );
  }

  private syncTabStops(focused?: NavDrawerItemElement) {
    const items = this.items.filter((item) => !item.disabled);
    const stop =
      focused ?? items.find((item) => item.selected) ?? items[0] ?? null;
    for (const item of this.items) {
      item.tabStop = item === stop;
    }
  }

  private handleSlotChange() {
    this.syncTabStops();
  }

  private readonly handleCancel = (event: Event) => {
    // Escape: animate the close instead of closing the dialog at once.
    event.preventDefault();
    this.close(NAV_DRAWER_CLOSE_REASONS.escape);
  };

  private readonly handleDialogClose = () => {
    // The dialog was closed without `close()`, e.g. by the browser.
    if (this.isOpenInternal) {
      this.transitionCounter++;
      this.isOpenInternal = false;
      this.visible = false;
      this.requestUpdate('open', true);
      this.restoreFocusTo = null;
      this.dispatchEvent(
        new CustomEvent('closed', {
          detail: {reason: NAV_DRAWER_CLOSE_REASONS.escape},
        }),
      );
    }
  };

  private readonly handleScrimClick = () => {
    this.close(NAV_DRAWER_CLOSE_REASONS.scrim);
  };

  private readonly handleItemClick = (event: MouseEvent) => {
    const item = this.findItem(event);
    if (!item || item.disabled) {
      return;
    }
    if (!item.selected) {
      for (const other of this.items) {
        other.selected = other === item;
      }
      this.dispatchEvent(new Event('change', {bubbles: true}));
    }
    this.syncTabStops(item);
    if (this.modal && this.open) {
      this.close(NAV_DRAWER_CLOSE_REASONS.item);
    }
  };

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }
    const current = this.findItem(event);
    if (!current) {
      return;
    }
    const items = this.items.filter((item) => !item.disabled);
    const next = getNextNavDrawerItem(items, current, event.key);
    if (!next) {
      return;
    }
    event.preventDefault();
    this.syncTabStops(next);
    next.focus();
  };

  private readonly handleFocusIn = (event: FocusEvent) => {
    const item = this.findItem(event);
    if (item && !item.disabled) {
      this.syncTabStops(item);
    }
  };

  private findItem(event: Event): NavDrawerItemElement | null {
    for (const target of event.composedPath()) {
      if (target === this) {
        return null;
      }
      if (target instanceof NavDrawerItemElement) {
        return this.items.includes(target) ? target : null;
      }
    }
    return null;
  }
}

function getDeepActiveElement(): HTMLElement | null {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active instanceof HTMLElement && active !== document.body
    ? active
    : null;
}
