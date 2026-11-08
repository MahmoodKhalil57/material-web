/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, nothing, type PropertyValues} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {AriaTablistElement} from '../../../aria/tabs/tablist.js';
import {internals} from '../../../behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {hasLinkItems, NAV_LINK_CHANGE} from '../shared/nav-link.js';
import {setupRipple} from '../ripple/ripple.js';
import {DragSettleController} from '../shared/drag-settle.js';
import {ModalSurfaceController} from '../shared/modal-surface.js';
import {RovingFocusController} from '../shared/roving-focus.js';
import {BACK_REASON, playPredictiveBack} from '../shared/predictive-back.js';

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

// spec-labels: navigation-rail/specs/anatomy, navigation-rail/guidelines/anatomy, navigation-rail/specs/variants, navigation-rail/specs/baseline-navigation-rail
// spec-labels: navigation-rail/specs/baseline-navigation-rail/configurations, navigation-rail/specs/variants/baseline-variants
const HEADER_FAB_SELECTOR = 'md-gb-fab, .fab';

/** A slotted child's box, and a destination's icon and active pill. */
interface MorphRects {
  box: DOMRect;
  icon: DOMRect | null;
  pill: DOMRect | null;
}

/**
 * A destination's icon, label and active pill: the indicator around the
 * icon in the collapsed (vertical) layout, the pill around icon and label
 * in the expanded (horizontal) one. Empty for other children.
 */
function morphParts(el: Element) {
  const root = el instanceof NavRailItemElement ? el.shadowRoot : null;
  const item = root?.querySelector<HTMLElement>('.nav-rail-item');
  if (!root || !item) return {icon: null, label: null, pill: null};
  const horizontal = item.classList.contains('nav-rail-item-horizontal');
  return {
    icon: root.querySelector<HTMLElement>('.nav-rail-item-icon'),
    label: root.querySelector<HTMLElement>('.nav-rail-item-label'),
    pill: root.querySelector<HTMLElement>(
      horizontal ? '.nav-rail-item-content' : '.nav-rail-item-indicator',
    ),
  };
}

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
 * @fires {CustomEvent<{expanded: boolean, reason?: string}>} toggle - Fired when the expanded state is toggled. --bubbles
 * @csspart scrim - The modal rail's scrim, while expanded.
 *
 * A `modal` rail expands over the content with a scrim, like Compose
 * `ModalWideNavigationRail`. Clicking the scrim, pressing Escape or swiping
 * the rail toward its edge collapses it. The scrim (and the menu button of a
 * `collapsible` rail) are the single-pointer alternatives to the swipe.
 * While a modal rail is expanded, focus moves into it, Tab stays inside it,
 * page scrolling is locked, and focus returns to the previous element when
 * it collapses. The `toggle` event's `detail.reason` says why a modal rail
 * collapsed (`escape`, `back`, `scrim` or `swipe`).
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

      /* Hide when collapsed: no collapsed rail, no space in the layout. */
      :host([hide-when-collapsed]:not([expanded])) {
        display: none;
      }

      :host([hide-when-collapsed]) .nav-rail-modal-host {
        inline-size: 0;
      }

      /* Navigation rail, Divider: on the edge next to the content. */
      :host([divider]) .nav-rail {
        border-inline-end: 1px solid var(--md-sys-color-outline-variant);
      }

      /* Scrolling: elevating the rail to level 1 separates it from content. */
      :host([elevated]) .nav-rail {
        box-shadow: var(--md-sys-elevation-shadow-1);
      }

      /* Secondary destinations show only in the expanded rail. */
      :host(:not([expanded])) ::slotted(md-gb-nav-rail-item[secondary]) {
        display: none;
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

  /**
   * Arrow keys move focus between the destinations (navigation-rail.md,
   * Keyboard navigation: "Tab / Arrows | Navigate between interactive
   * elements"). The rail declares `focusgroup` for browsers that ship it;
   * Chromium does not, so the shared RovingFocusController implements the
   * arrows. Every destination stays in the tab order. Disabled destinations
   * are skipped.
   */
  protected readonly rovingFocus = new RovingFocusController(this, {
    items: () => this.tabs,
    orientation: 'both',
    homeEnd: false,
    tabStops: 'all',
  });

  /**
   * Whether a vertical divider marks the edge of the rail next to the app's
   * content.
   */
  @property({type: Boolean, reflect: true}) divider = false;

  /**
   * Whether the rail is elevated to level 1, to distinguish it from content
   * that scrolls underneath it.
   */
  @property({type: Boolean, reflect: true}) elevated = false;

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
   * Hide when collapsed (navigation-rail.md): the collapsed rail is not shown
   * and takes no space, so the body content fills in. The expanded rail
   * (always modal in this mode) appears over the content when the app's
   * menu button calls `expand()` or `toggle()`; keep that menu button
   * accessible.
   */
  @property({type: Boolean, reflect: true, attribute: 'hide-when-collapsed'})
  hideWhenCollapsed = false;

  /** Whether the expanded rail is modal, explicitly or when hiding. */
  private get isModal(): boolean {
    return this.modal || this.hideWhenCollapsed;
  }

  /**
   * Whether the collapsed rail uses the narrow width
   * (`md.comp.nav-rail.collapsed.narrow.container.width`, 80dp).
   */
  @property({type: Boolean, reflect: true}) narrow = false;

  /** The swipe-to-dismiss offset (px toward the start edge) while dragging. */
  @state() private dragOffset: number | null = null;

  @query('.nav-rail')
  private readonly railElement!: HTMLElement | null;

  private collapseReason: string | undefined;

  /**
   * The modal expanded rail: Escape, back and scrim close requests, focus
   * in, trap and restore, and page scroll lock. The rail owns `expanded`.
   */
  protected readonly modalSurface = new ModalSurfaceController(this, {
    isOpen: () => this.isModal && this.expanded,
    modal: () => this.isModal,
    surface: () => this,
    scrim: () =>
      this.shadowRoot?.querySelector<HTMLElement>('.nav-rail-scrim') ?? null,
    onCloseRequest: (reason) => {
      if (reason === BACK_REASON) {
        this.handleBack();
      } else {
        this.collapseFor(reason);
      }
    },
  });

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
    const reason = this.collapseReason;
    this.collapseReason = undefined;
    this.dispatchEvent(
      new CustomEvent('toggle', {
        bubbles: true,
        composed: true,
        detail: {expanded: this.expanded, reason},
      }),
    );
    return this.expanded;
  }

  /** Expands the navigation rail. */
  expand(): void {
    this.toggle(true);
  }

  /** Collapses the rail, reporting why in the `toggle` event's `detail.reason`. */
  private collapseFor(reason: string) {
    this.collapseReason = reason;
    this.toggle(false);
    this.collapseReason = undefined;
  }

  /** Collapses the navigation rail. */
  collapse(): void {
    this.toggle(false);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener(NAV_LINK_CHANGE, this.syncRole);
    adoptStyles(this, [focusRingStyles, rippleStyles, navRailStyles]);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(NAV_LINK_CHANGE, this.syncRole);
    this.menuButtonAbortController?.abort();
    this.menuButtonAbortController = null;
  }

  /** Where things were before expanding or collapsing (see `morph`). */
  private morphFrom: Map<Element, MorphRects> | null = null;

  protected override willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);
    if (
      changedProperties.has('expanded') &&
      this.hasUpdated &&
      this.isConnected &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      this.morphFrom = this.measureMorph();
    }
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
    if (this.morphFrom) {
      const from = this.morphFrom;
      this.morphFrom = null;
      void this.morph(from);
    }
    if (changedProperties.has('collapsible')) {
      this.setupBuiltInMenuButton();
    }
  }

  /**
   * Handles a back request (the Android back gesture or button) on the modal
   * expanded rail: plays the predictive back motion, then collapses the rail.
   * Call it for an in-app back control that should behave like the system
   * back. Resolves after the back motion.
   */
  async handleBack(): Promise<void> {
    if (!this.isModal || !this.expanded) {
      return;
    }
    const rail = this.railElement;
    const motion = rail
      ? playPredictiveBack(rail, {kind: 'side', edge: 'start'})
      : null;
    await motion?.finished;
    if (!this.isModal || !this.expanded) {
      motion?.cancel();
      return;
    }
    this.collapseFor(BACK_REASON);
    // The rail stays on screen collapsed: settle back to its resting scale
    // while it collapses.
    await motion?.settle();
  }

  protected override render() {
    const effectiveLayout: NavRailItemLayout = this.expanded
      ? 'horizontal'
      : this.itemLayout;
    const showHeader = this.hasHeader || this.collapsible;
    const showBuiltInMenuButton = this.collapsible && !this.hasSlottedToggle;

    const modalOpen = this.isModal && this.expanded;
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
          modal: this.isModal,
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
    if (!this.isModal) {
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
            aria-hidden="true"></div>`
        : nothing}
      ${rail}
    </div>`;
  }

  /**
   * Swipe to dismiss the expanded modal rail: a drag on the rail moves it
   * between the expanded and collapsed anchors and settles on release
   * (shared DragSettleController, with the closing direction positive).
   */
  // spec: navigation-rail-b492a0
  protected readonly swipe = new DragSettleController(this, {
    axis: 'x',
    target: () =>
      this.isConnected && this.isModal && this.expanded ? this.railElement : null,
    anchors: () => [0, this.railElement?.offsetWidth ?? 0],
    value: () => 0,
    // The rail closes toward the left in LTR: against the pointer's x.
    reverse: () => !this.railIsRtl(),
    velocityThreshold: NAV_RAIL_VELOCITY_THRESHOLD_PX_PER_S,
    positionalThreshold: (distance) => distance * NAV_RAIL_POSITIONAL_THRESHOLD,
    disabled: () => !(this.isModal && this.expanded),
    onDragStart: () => {
      this.dragWidth = this.railElement?.offsetWidth ?? 0;
      this.dragDirection = this.railIsRtl() ? -1 : 1;
      this.dragOffset = 0;
    },
    onDrag: (offset) => {
      this.dragOffset = offset;
    },
    onSettle: (anchor) => {
      this.dragOffset = null;
      if (this.dragWidth > 0 && anchor === this.dragWidth) {
        this.collapseFor('swipe');
      }
    },
    onCancel: () => {
      this.dragOffset = null;
    },
  });

  private railIsRtl() {
    const rail = this.railElement;
    return !!rail && getComputedStyle(rail).direction === 'rtl';
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

  /**
   * Destinations that are links make the bar a navigation landmark of links;
   * a tab list can only hold tabs. Without links it stays a tab list.
   */
  private readonly syncRole = () => {
    const state = this[internals];
    if (hasLinkItems(this.tabs)) {
      state.role = 'navigation';
      state.ariaOrientation = null;
    } else {
      state.role = 'tablist';
      state.ariaOrientation = this.orientation;
    }
  };

  protected override handleSlotChange() {
    super.handleSlotChange();
    this.syncRole();
    this.syncItemsLayout();
  }

  /** The slotted children, and each destination's icon and active pill. */
  private measureMorph(): Map<Element, MorphRects> {
    const rects = new Map<Element, MorphRects>();
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    for (const el of slot?.assignedElements({flatten: true}) ?? []) {
      const parts = morphParts(el);
      rects.set(el, {
        box: el.getBoundingClientRect(),
        icon: parts.icon?.getBoundingClientRect() ?? null,
        pill: parts.pill?.getBoundingClientRect() ?? null,
      });
    }
    return rects;
  }

  /**
   * Collapsed and expanded rails transform into each other
   * (navigation-rail.md: they "match visually and can transition into each
   * other"; the menu button changes them). The destinations' icons are
   * persistent: each moves from where it was to where it is now, and the
   * active indicator stretches between the icon's pill and the pill around
   * icon and label, on the rail's spatial spring (`--motion-duration`,
   * `--motion-easing`), while the labels, laid out anew, fade in (default
   * effects) and destinations shown only now (secondary ones) fade in.
   * Nothing runs under reduced motion.
   */
  private async morph(from: Map<Element, MorphRects>) {
    const items = [...from.keys()];
    await Promise.all(
      items.map((el) => (el as Partial<NavRailItemElement>).updateComplete),
    );
    const style = getComputedStyle(this.railElement ?? this);
    const spatial: KeyframeAnimationOptions = {
      duration: parseFloat(style.getPropertyValue('--motion-duration')) || 420,
      easing: style.getPropertyValue('--motion-easing').trim() || 'ease',
    };
    const effects: KeyframeAnimationOptions = {
      duration:
        parseFloat(style.getPropertyValue('--md-sys-motion-spring-default-effects-duration')) ||
        220,
      easing:
        style.getPropertyValue('--md-sys-motion-spring-default-effects').trim() || 'ease',
      fill: 'backwards',
    };
    for (const el of items) {
      const before = from.get(el)!;
      const box = el.getBoundingClientRect();
      if (!box.width) continue;
      // Shown only now: fades in where it is.
      if (!before.box.width) {
        el.animate({opacity: [0, 1]}, effects);
        continue;
      }
      const parts = morphParts(el);
      if (parts.icon && before.icon) {
        const now = parts.icon.getBoundingClientRect();
        parts.icon.animate(
          {
            translate: [
              `${before.icon.left - now.left}px ${before.icon.top - now.top}px`,
              '0px 0px',
            ],
          },
          spatial,
        );
      }
      parts.label?.animate({opacity: [0, 1]}, effects);
      if (parts.pill && before.pill && (el as NavRailItemElement).selected) {
        const now = parts.pill.getBoundingClientRect();
        parts.pill.animate(
          {
            inset: [
              `${before.pill.top - now.top}px ${now.right - before.pill.right}px ${now.bottom - before.pill.bottom}px ${before.pill.left - now.left}px`,
              '0px',
            ],
          },
          {...spatial, pseudoElement: '::before'},
        );
      }
    }
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
