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
import {styleMap} from 'lit/directives/style-map.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import {styles as focusRingStyles} from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import {styles as rippleStyles} from '../ripple/ripple.cssresult.js'; // google3-only
import navDrawerStyles from './nav-drawer.css' with {type: 'css'}; // github-only
// import {styles as navDrawerStyles} from './nav-drawer.cssresult.js'; // google3-only

import {DragSettleController} from '../shared/drag-settle.js';
import {ModalSurfaceController} from '../shared/modal-surface.js';
import {RovingFocusController} from '../shared/roving-focus.js';
import {
  NAV_DRAWER_CLASSES,
  NAV_DRAWER_CLOSE_REASONS,
  NAV_DRAWER_POSITIONAL_THRESHOLD,
  NAV_DRAWER_VELOCITY_THRESHOLD_PX_PER_S,
  navDrawerClasses,
  navDrawerDialogClasses,
} from './nav-drawer.js';
import {NavDrawerItemElement} from './nav-drawer-item-element.js';

/** Default accessible name of the drawer (Compose `Strings.NavigationMenu`). */
const DEFAULT_LABEL = 'Navigation menu';

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(LitElement);

// spec-labels: navigation-drawer/specs/measurements/standard-navigation-drawer,
// spec-labels: navigation-drawer/guidelines/usage,
// spec-labels: navigation-drawer/specs/measurements/modal-navigation-drawer,
// spec-labels: navigation-drawer/guidelines/anatomy,
// spec-labels: navigation-drawer/guidelines/usage/modal-navigation-drawer, navigation-drawer/specs
/**
 * A Material Design navigation drawer.
 *
 * A standard drawer sits next to the app content and slides in and out with
 * `open`. A `modal` drawer opens over a scrim in a modal `<dialog>`: focus is
 * trapped inside it and restored when it closes, and it closes on Escape, a
 * scrim click, when an item is selected, or when it is swiped toward its edge
 * (Compose `ModalNavigationDrawer`: the drawer follows a horizontal drag on
 * the drawer or the scrim, and a release past half its width or a fling
 * faster than 400px/s settles it closed with the spatial spring, otherwise it
 * settles back open). Set `gestures-disabled` to turn swiping off.
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

  /** Whether the drawer is open. */
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

  /**
   * Whether swiping a modal drawer closed is turned off (Compose
   * `gesturesEnabled = false`). Escape, the scrim and `close()` still close
   * it.
   */
  @property({type: Boolean, reflect: true, attribute: 'gestures-disabled'})
  gesturesDisabled = false;

  /**
   * While a modal drawer is dragged: how far it is dragged toward its edge,
   * from 0 (open) to its width (closed).
   */
  @state() private dragOffset: number | null = null;

  /** Whether a swiped drawer is settling closed (spatial spring). */
  @state() private swipeSettling = false;

  private dragWidth = 0;
  /** 1 when the drawer closes toward the left (LTR), -1 toward the right. */
  private dragDirection = 1;

  @query('.nav-drawer') private readonly sheet!: HTMLElement | null;
  @query('dialog') private readonly dialog!: HTMLDialogElement | null;

  /**
   * A modal drawer is a native `<dialog>` over a scrim: Escape, back and
   * scrim close requests, a focus trap, initial focus on the first item,
   * focus restore and page scroll lock. A standard drawer only opens and
   * closes.
   */
  private readonly modalSurface = new ModalSurfaceController(this, {
    dialog: () => this.dialog,
    scrim: () => this.shadowRoot?.querySelector<HTMLElement>('.nav-drawer-scrim') ?? null,
    modal: () => this.modal,
    defaultReason: NAV_DRAWER_CLOSE_REASONS.method,
    waitForMotion: () => this.waitForTransitions(),
    // Initial focus lands on the first destination (navigation-drawer.md).
    initialFocus: () => this.items.find((item) => !item.disabled),
  });

  /** Whether the sheet is on screen (drives the transitions). */
  private get visible(): boolean {
    return this.modalSurface.entered;
  }

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
  }

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, [focusRingStyles, rippleStyles, navDrawerStyles]);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.dragOffset = null;
  }

  /** Opens the drawer. Resolves once it has finished animating. */
  show(): Promise<void> {
    return this.modalSurface.show();
  }

  /**
   * Closes the drawer. Resolves once it has finished animating.
   *
   * @param reason Why the drawer closes, given in the `close` and `closed`
   *     events (see `NAV_DRAWER_CLOSE_REASONS`).
   */
  close(reason: string = NAV_DRAWER_CLOSE_REASONS.method): Promise<void> {
    return this.modalSurface.close(reason);
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
    this.syncTabStops();
  }

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    const label = ariaLabel || DEFAULT_LABEL;
    const dragging = this.modal && this.dragOffset !== null;
    const sheetStyle = dragging
      ? {translate: `${-this.dragDirection * this.dragOffset!}px 0`}
      : {};
    const scrimStyle =
      dragging && this.dragWidth > 0
        ? {opacity: String(1 - this.dragOffset! / this.dragWidth)}
        : {};
    const sheet = html`
      <div
        part="drawer"
        class=${classMap({
          ...navDrawerClasses({modal: this.modal, open: this.visible}),
          [NAV_DRAWER_CLASSES.navDrawerDragging]: dragging,
          [NAV_DRAWER_CLASSES.navDrawerSwipeSettle]:
            this.modal && this.swipeSettling,
        })}
        style=${styleMap(sheetStyle)}>
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
        aria-label=${label}>
        <div
          part="scrim"
          class=${classMap({
            [NAV_DRAWER_CLASSES.navDrawerScrim]: true,
            [NAV_DRAWER_CLASSES.navDrawerDragging]: dragging,
          })}
          style=${styleMap(scrimStyle)}
          aria-hidden="true"></div>
        ${sheet}
      </dialog>
    `;
  }

  /**
   * Swipe to dismiss: a drag on the modal `<dialog>` (the sheet or the
   * scrim) moves the sheet between the open and closed anchors, and settles
   * on release like Compose's `AnchoredDraggableState`. Shared
   * DragSettleController, with the closing direction positive.
   */
  // spec: navigation-drawer-d450da, navigation-drawer-f7bd4b, navigation-drawer-3f8d7a
  protected readonly swipe = new DragSettleController(this, {
    axis: 'x',
    target: () => (this.modal ? this.dialog : null),
    anchors: () => [0, this.sheet?.offsetWidth ?? 0],
    value: () => 0,
    // The drawer closes toward the left in LTR: against the pointer's x.
    reverse: () => !this.sheetIsRtl(),
    velocityThreshold: NAV_DRAWER_VELOCITY_THRESHOLD_PX_PER_S,
    positionalThreshold: (distance) =>
      distance * NAV_DRAWER_POSITIONAL_THRESHOLD,
    disabled: () =>
      !(this.modal && this.open && this.visible) || this.gesturesDisabled,
    onDragStart: () => {
      this.dragWidth = this.sheet?.offsetWidth ?? 0;
      this.dragDirection = this.sheetIsRtl() ? -1 : 1;
      this.dragOffset = 0;
    },
    onDrag: (offset) => {
      this.dragOffset = offset;
    },
    // Clearing the offset in the same update as the open/closed change lets
    // the sheet transition from where it was released.
    onSettle: (anchor) => {
      this.dragOffset = null;
      if (this.dragWidth > 0 && anchor === this.dragWidth) {
        this.swipeSettling = true;
        this.close(NAV_DRAWER_CLOSE_REASONS.swipe).finally(() => {
          this.swipeSettling = false;
        });
      }
    },
    onCancel: () => {
      this.dragOffset = null;
    },
  });

  private sheetIsRtl() {
    const sheet = this.sheet;
    return !!sheet && getComputedStyle(sheet).direction === 'rtl';
  }

  private async waitForTransitions() {
    // A freshly opened drawer renders a closed frame first and enters on the
    // next update: wait for that render, or the open transition isn't there
    // to wait for yet and `show()` resolves before the drawer is on screen.
    while (this.isConnected && this.isUpdatePending) {
      await this.updateComplete;
    }
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

  /**
   * Up / Down (wrapping), Home / End and one tab stop (shared
   * RovingFocusController). Tab enters on the first destination, as the
   * spec's initial focus rule says, not on the selected one.
   */
  // spec: navigation-drawer-943104, navigation-drawer-e712cc, navigation-drawer-054d25, navigation-drawer-b59187
  protected readonly rovingFocus = new RovingFocusController(this, {
    items: () => this.items,
    orientation: 'vertical',
    canFocus: (item) => !(item as NavDrawerItemElement).disabled,
    setTabStop: (item, stop) => {
      (item as NavDrawerItemElement).tabStop = stop;
    },
  });

  private syncTabStops(focused?: NavDrawerItemElement) {
    if (focused) this.rovingFocus.tabStop = focused;
    else this.rovingFocus.sync();
  }

  private handleSlotChange() {
    this.syncTabStops();
  }

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
