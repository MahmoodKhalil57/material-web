/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, nothing, type PropertyValues} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {AriaTablistElement} from '../../../aria/tabs/tablist.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {setupRipple} from '../ripple/ripple.js';
import {DragGesture, settleAnchor} from '../shared/drag-gesture.js';
import {
  BACK_REASON,
  BackHandler,
  type CloseRequestSource,
  playPredictiveBack,
} from '../sheet/predictive-back.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import {styles as focusRingStyles} from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import {styles as rippleStyles} from '../ripple/ripple.cssresult.js'; // google3-only
import navRailStyles from './nav-rail.css' with {type: 'css'}; // github-only
// import {styles as navRailStyles} from './nav-rail.cssresult.js'; // google3-only

import {
  navRail,
  type NavRailAlignment,
  type NavRailItemLayout,
} from './nav-rail.js';
import {NavRailItemElement} from './nav-rail-item-element.js';

const HEADER_TOGGLE_SELECTOR = [
  'md-gb-icon-button',
  '.icon-btn',
  '.nav-rail-menu-button',
  '[data-nav-rail-toggle]',
  '[nav-rail-toggle]',
].join(', ');

const HEADER_FAB_SELECTOR = 'md-gb-fab, .fab';

/**
 * Compose AnchoredDraggableDefaults / ModalWideNavigationRail: a modal rail
 * released past half its width, or flung faster than 125dp/s toward its
 * edge, collapses.
 */
export const NAV_RAIL_POSITIONAL_THRESHOLD = 0.5;
/** See `NAV_RAIL_POSITIONAL_THRESHOLD`. */
export const NAV_RAIL_VELOCITY_THRESHOLD_PX_PER_S = 125;

/**
 * A Material Design navigation rail component.
 *
 * @slot - Used to display navigation rail items (`md-gb-nav-rail-item`).
 * @slot header - Used to display optional header controls (menu button, FAB).
 * @csspart nav-rail - The navigation rail's root container.
 * @csspart header - The navigation rail's header container.
 * @csspart menu-button - The built-in expand/collapse menu button when `collapsible`.
 * @csspart items - The navigation rail's items container.
 * @fires {Event} change - Fired when the selected item changes. --bubbles
 * @fires {Event} toggle - Fired when the expanded state is toggled. --bubbles
 * @csspart scrim - The modal rail's scrim, while expanded.
 *
 * A `modal` rail expands over the content with a scrim, like Compose
 * `ModalWideNavigationRail`. Clicking the scrim, pressing Escape or swiping
 * the rail toward its edge collapses it. The scrim (and the menu button of a
 * `collapsible` rail) are the single-pointer alternatives to the swipe.
 *
 * Predictive back applies to the modal expanded rail (navigation-rail.md):
 * while it is expanded the rail listens for back requests with a
 * `CloseWatcher` (the Android back gesture or button, and Escape), falling
 * back to Escape on the document where `CloseWatcher` is missing. A back
 * request plays the predictive back motion (the rail pops off its edge,
 * Compose `ModalWideNavigationRail` scales) and collapses the rail.
 *
 * A FAB (`md-gb-fab` with a `label`) in the header is an extended FAB while
 * the rail is expanded and an icon FAB while it is collapsed.
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-shape
 * @cssprop --container-vertical-padding
 * @cssprop --collapsed-item-vertical-space
 * @cssprop --collapsed-narrow-container-width
 * @cssprop --collapsed-top-space
 * @cssprop --container-width
 * @cssprop --expanded-top-space
 * @cssprop --expanded-container-color
 * @cssprop --expanded-container-width-maximum
 * @cssprop --expanded-container-width-minimum
 * @cssprop --expanded-modal-container-color
 * @cssprop --header-space-minimum
 * @cssprop --item-active-focused-icon-color
 * @cssprop --item-active-focused-label-text-color
 * @cssprop --item-active-hovered-icon-color
 * @cssprop --item-active-hovered-label-text-color
 * @cssprop --item-active-icon-color
 * @cssprop --item-active-indicator-color
 * @cssprop --item-active-indicator-height
 * @cssprop --item-active-indicator-shape
 * @cssprop --item-active-indicator-width
 * @cssprop --item-active-label-text-color
 * @cssprop --item-active-pressed-icon-color
 * @cssprop --item-active-pressed-label-text-color
 * @cssprop --item-active-state-layer-color
 * @cssprop --item-container-height
 * @cssprop --item-container-vertical-space
 * @cssprop --item-full-width-leading-space
 * @cssprop --item-full-width-trailing-space
 * @cssprop --item-horizontal-active-indicator-height
 * @cssprop --item-horizontal-icon-label-space
 * @cssprop --item-icon-size
 * @cssprop --item-inactive-focused-icon-color
 * @cssprop --item-inactive-focused-label-text-color
 * @cssprop --item-inactive-hovered-icon-color
 * @cssprop --item-inactive-hovered-label-text-color
 * @cssprop --item-inactive-icon-color
 * @cssprop --item-inactive-label-text-color
 * @cssprop --item-inactive-pressed-icon-color
 * @cssprop --item-inactive-pressed-label-text-color
 * @cssprop --item-inactive-state-layer-color
 * @cssprop --item-label-text-font
 * @cssprop --item-label-text-font-axes
 * @cssprop --item-label-text-font-tracking
 * @cssprop --item-outer-space
 * @cssprop --item-vertical-icon-label-space
 * @cssprop --item-vertical-leading-space
 * @cssprop --item-vertical-trailing-space
 * @cssprop --modal-container-elevation
 * @cssprop --modal-container-shape
 * @cssprop --modal-scrim-color
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 */
export class NavRailElement extends AriaTablistElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    navRailStyles,
    css`
      :host {
        block-size: 100%;
        display: inline-flex;
        flex-direction: column;
        outline: none;
      }

      .nav-rail ::slotted(:focus-within),
      .nav-rail-items ::slotted(:focus-within) {
        z-index: 1;
      }

      .nav-rail-header ::slotted(md-gb-icon-button),
      .nav-rail-header ::slotted(.icon-btn),
      .nav-rail-header ::slotted([data-nav-rail-toggle]),
      .nav-rail-header ::slotted([nav-rail-toggle]) {
        margin-inline-start: 8px;
      }
    `,
  ];

  override orientation: 'horizontal' | 'vertical' = 'vertical';

  /** Whether the navigation rail is expanded to show horizontal items. */
  @property({type: Boolean, reflect: true}) expanded = false;

  /**
   * Whether the navigation rail renders a built-in expand/collapse menu button
   * in the header when no toggle button is slotted into `slot="header"`.
   */
  @property({type: Boolean, reflect: true}) collapsible = false;

  /**
   * Whether the expanded navigation rail is modal: it opens over the content
   * with a scrim, with modal elevation and shape.
   */
  @property({type: Boolean, reflect: true}) modal = false;

  /**
   * Whether the collapsed rail uses the narrow width
   * (`md.comp.nav-rail.collapsed.narrow.container.width`, 80dp).
   */
  @property({type: Boolean, reflect: true}) narrow = false;

  /** The swipe-to-dismiss offset (px toward the start edge) while dragging. */
  @state() private dragOffset: number | null = null;

  @query('.nav-rail')
  private readonly railElement!: HTMLElement | null;

  private readonly backHandler = new BackHandler((source) => {
    this.handleBackRequest(source);
  });

  private dragGesture: DragGesture | null = null;
  private dragTarget: HTMLElement | null = null;
  private dragWidth = 0;
  private dragDirection = 1;

  /** Vertical alignment of items ('top', 'center', or 'bottom'). */
  @property({reflect: true}) alignment: NavRailAlignment = 'top';

  /** The layout orientation of items ('vertical' or 'horizontal'). */
  @property({attribute: 'item-layout', reflect: true})
  itemLayout: NavRailItemLayout = 'vertical';

  @state() private hasHeader = false;
  @state() private hasSlottedToggle = false;

  @query('slot[name="header"]')
  private readonly headerSlot!: HTMLSlotElement | null;

  @query('.nav-rail-menu-button')
  private readonly menuButtonElement!: HTMLButtonElement | null;

  private menuButtonAbortController: AbortController | null = null;

  /**
   * The 0-based index of the currently active navigation rail item.
   * Alias for `selectedTabIndex`.
   */
  @property({type: Number, attribute: 'selected-index', noAccessor: true})
  get selectedIndex(): number {
    return this.selectedTabIndex;
  }
  set selectedIndex(index: number) {
    this.selectedTabIndex = index;
  }

  /**
   * Toggles the expanded state of the navigation rail.
   *
   * @param force Optional boolean to force expanded (`true`) or collapsed (`false`).
   * @return The new `expanded` state.
   */
  toggle(force?: boolean): boolean {
    const nextExpanded = force !== undefined ? Boolean(force) : !this.expanded;
    if (this.expanded === nextExpanded) {
      return this.expanded;
    }
    this.expanded = nextExpanded;
    this.dispatchEvent(new Event('toggle', {bubbles: true, composed: true}));
    return this.expanded;
  }

  /** Expands the navigation rail. */
  expand(): void {
    this.toggle(true);
  }

  /** Collapses the navigation rail. */
  collapse(): void {
    this.toggle(false);
  }

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, [focusRingStyles, rippleStyles, navRailStyles]);
    this.addEventListener('keydown', this.handleKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeydown);
    this.backHandler.disable();
    this.dragGesture?.disconnect();
    this.dragGesture = null;
    this.dragTarget = null;
    this.menuButtonAbortController?.abort();
    this.menuButtonAbortController = null;
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (
      changedProperties.has('expanded') ||
      changedProperties.has('itemLayout')
    ) {
      this.syncItemsLayout();
      this.syncHeaderState();
    }
    if (changedProperties.has('collapsible')) {
      this.setupBuiltInMenuButton();
    }
    this.syncDragGesture();
    this.syncBackHandler();
  }

  /**
   * Handles a back request (the Android back gesture or button) on the modal
   * expanded rail: plays the predictive back motion, then collapses the rail.
   * Call it for an in-app back control that should behave like the system
   * back. Resolves after the back motion.
   */
  async handleBack(): Promise<void> {
    if (!this.modal || !this.expanded) {
      return;
    }
    const rail = this.railElement;
    const motion = rail
      ? playPredictiveBack(rail, {kind: 'side', edge: 'start'})
      : null;
    await motion?.finished;
    if (!this.modal || !this.expanded) {
      motion?.cancel();
      return;
    }
    this.toggle(false);
    // The rail stays on screen collapsed: settle back to its resting scale
    // while it collapses.
    await motion?.settle();
  }

  private handleBackRequest(source: CloseRequestSource) {
    if (source === BACK_REASON) {
      this.handleBack();
    } else {
      this.toggle(false);
    }
  }

  /** Listens for back requests while the modal rail is expanded. */
  private syncBackHandler() {
    if (this.isConnected && this.modal && this.expanded) {
      this.backHandler.enable();
    } else {
      this.backHandler.disable();
    }
  }

  protected override render() {
    const effectiveLayout: NavRailItemLayout = this.expanded
      ? 'horizontal'
      : this.itemLayout;
    const showHeader = this.hasHeader || this.collapsible;
    const showBuiltInMenuButton = this.collapsible && !this.hasSlottedToggle;

    const modalOpen = this.modal && this.expanded;
    const dragging = modalOpen && this.dragOffset !== null;
    const railStyle = dragging
      ? `translate: ${-this.dragDirection * this.dragOffset!}px 0`
      : nothing;
    const rail = html`
      <div
        part="nav-rail"
        class="${navRail({
          alignment: this.alignment,
          expanded: this.expanded,
          itemLayout: effectiveLayout,
          modal: this.modal,
          narrow: this.narrow,
          dragging,
        })}"
        style=${railStyle}>
        <div
          part="header"
          class="nav-rail-header"
          ?hidden=${!showHeader}
          @click=${this.handleHeaderClick}>
          ${showBuiltInMenuButton
            ? html`
                <button
                  type="button"
                  part="menu-button"
                  class="nav-rail-menu-button ripple focus-ring-inner"
                  aria-label=${this.expanded
                    ? 'Collapse navigation rail'
                    : 'Expand navigation rail'}
                  aria-expanded=${this.expanded ? 'true' : 'false'}
                  @click=${this.handleMenuButtonClick}>
                  <span aria-hidden="true">
                    ${this.expanded ? 'menu_open' : 'menu'}
                  </span>
                </button>
              `
            : nothing}
          <slot name="header" @slotchange=${this.handleHeaderSlotChange}></slot>
        </div>
        <div part="items" class="nav-rail-items">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
    if (!this.modal) {
      return rail;
    }
    const scrimStyle =
      dragging && this.dragWidth > 0
        ? `opacity: ${1 - this.dragOffset! / this.dragWidth}`
        : nothing;
    return html`<div
      class="nav-rail-modal-host ${this.narrow
        ? 'nav-rail-modal-host-narrow'
        : ''}">
      ${modalOpen
        ? html`<div
            part="scrim"
            class="nav-rail-scrim"
            style=${scrimStyle}
            aria-hidden="true"
            @click=${this.handleScrimClick}></div>`
        : nothing}
      ${rail}
    </div>`;
  }

  private handleScrimClick() {
    this.toggle(false);
  }

  private readonly handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.modal && this.expanded) {
      event.preventDefault();
      event.stopPropagation();
      this.toggle(false);
    }
  };

  /** Swipe to dismiss: tracks horizontal drags on the expanded modal rail. */
  private syncDragGesture() {
    const target =
      this.isConnected && this.modal && this.expanded ? this.railElement : null;
    if (target === this.dragTarget) {
      return;
    }
    this.dragGesture?.disconnect();
    this.dragTarget = target;
    this.dragGesture = target
      ? new DragGesture(target, {
          axis: 'x',
          canStart: () => this.modal && this.expanded,
          onStart: () => {
            this.dragWidth = target.offsetWidth;
            this.dragDirection =
              getComputedStyle(target).direction === 'rtl' ? -1 : 1;
            this.dragOffset = 0;
          },
          onMove: (delta) => {
            this.dragOffset = this.closingOffset(delta);
          },
          onEnd: (delta, velocity) => {
            this.settleDrag(delta, velocity);
          },
          onCancel: () => {
            this.dragOffset = null;
          },
        })
      : null;
  }

  /** How far a drag of `delta` px moved the rail toward its edge. */
  private closingOffset(delta: number) {
    return Math.min(this.dragWidth, Math.max(0, -delta * this.dragDirection));
  }

  /** Settles a released drag at the expanded or collapsed anchor. */
  private settleDrag(delta: number, velocity: number) {
    const offset = this.closingOffset(delta);
    const target = settleAnchor(
      [0, this.dragWidth],
      0,
      offset,
      -velocity * this.dragDirection,
      {
        positionalThreshold: (distance) =>
          distance * NAV_RAIL_POSITIONAL_THRESHOLD,
        velocityThreshold: NAV_RAIL_VELOCITY_THRESHOLD_PX_PER_S,
      },
    );
    this.dragOffset = null;
    if (this.dragWidth > 0 && target === this.dragWidth) {
      this.toggle(false);
    }
  }

  private setupBuiltInMenuButton() {
    this.menuButtonAbortController?.abort();
    this.menuButtonAbortController = null;
    if (this.menuButtonElement) {
      this.menuButtonAbortController = new AbortController();
      setupRipple(this.menuButtonElement, {
        signal: this.menuButtonAbortController.signal,
      });
    }
  }

  private handleMenuButtonClick(event: Event) {
    event.stopPropagation();
    this.toggle();
  }

  private handleHeaderClick(event: Event) {
    if (event.defaultPrevented) {
      return;
    }
    const headerElements =
      this.headerSlot?.assignedElements({flatten: true}) ?? [];
    if (headerElements.length === 0) {
      return;
    }
    const path = event.composedPath();
    for (const node of path) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }
      if (
        node.matches(HEADER_FAB_SELECTOR) ||
        node.hasAttribute('data-nav-rail-no-toggle')
      ) {
        return;
      }
      if (
        headerElements.includes(node) &&
        node.matches(HEADER_TOGGLE_SELECTOR)
      ) {
        this.toggle();
        return;
      }
    }
  }

  private handleHeaderSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const assigned = slot.assignedElements({flatten: true});
    this.hasHeader = assigned.length > 0;
    this.hasSlottedToggle = assigned.some(
      (el) =>
        el instanceof HTMLElement &&
        !el.matches(HEADER_FAB_SELECTOR) &&
        !el.hasAttribute('data-nav-rail-no-toggle') &&
        el.matches(HEADER_TOGGLE_SELECTOR),
    );
    this.syncHeaderState();
    this.setupBuiltInMenuButton();
  }

  private syncHeaderState() {
    const assigned = this.headerSlot?.assignedElements({flatten: true}) ?? [];
    for (const el of assigned) {
      if (!(el instanceof HTMLElement)) {
        continue;
      }
      if (
        !el.matches(HEADER_FAB_SELECTOR) &&
        !el.hasAttribute('data-nav-rail-no-toggle') &&
        el.matches(HEADER_TOGGLE_SELECTOR)
      ) {
        el.setAttribute('aria-expanded', String(this.expanded));
        const iconEl =
          el.querySelector('md-gb-icon, .md-icon') ??
          (el.matches('md-gb-icon, .md-icon') ? el : null);
        if (iconEl) {
          const targetIcon = this.expanded ? 'menu_open' : 'menu';
          for (const childNode of Array.from(iconEl.childNodes)) {
            if (childNode.nodeType === Node.TEXT_NODE) {
              const text = childNode.textContent?.trim();
              if (
                (text === 'menu' || text === 'menu_open') &&
                text !== targetIcon
              ) {
                childNode.textContent = targetIcon;
              }
            }
          }
        }
      } else if (el.matches('md-gb-fab') && 'expanded' in el) {
        // The expanded rail's FAB is an extended FAB (navigation-rail.md);
        // the collapsed rail shows the icon FAB.
        (el as HTMLElement & {expanded: boolean}).expanded = this.expanded;
      } else if (el.matches(HEADER_FAB_SELECTOR)) {
        const labelElements = el.querySelectorAll(
          ':scope > :not(md-gb-icon, .md-icon)',
        );
        for (const labelEl of Array.from(labelElements)) {
          if (labelEl instanceof HTMLElement) {
            labelEl.toggleAttribute('hidden', !this.expanded);
          }
        }
      }
    }
  }

  protected override handleSlotChange() {
    super.handleSlotChange();
    this.syncItemsLayout();
  }

  private syncItemsLayout() {
    const effectiveLayout: NavRailItemLayout = this.expanded
      ? 'horizontal'
      : this.itemLayout;
    for (const tab of this.tabs) {
      if (tab instanceof NavRailItemElement) {
        tab.itemLayout = effectiveLayout;
      } else {
        tab.setAttribute('item-layout', effectiveLayout);
      }
    }
  }
}
