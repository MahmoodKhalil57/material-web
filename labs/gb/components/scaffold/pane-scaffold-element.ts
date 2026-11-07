/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  type CSSResultOrNative,
  html,
  LitElement,
  nothing,
  type PropertyValues,
} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {DragSettleController} from '../shared/drag-settle.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {
  type ElementFold,
  type Fold,
  foldWithin,
  observeFold,
} from '../../styles/layout/viewport-segments.js';
import {
  type WindowHeightClass,
  WindowSizeClassController,
  type WindowSizeClass,
} from '../../styles/layout/window-size-class.js';
import {
  nextPaneSnapTarget,
  type PaneArrangement,
  type PaneHandleTap,
  type PaneLevitate,
  type PaneMode,
  type PaneName,
  type PanePlan,
  type PanePosition,
  type PaneResizeBehavior,
  type PaneScaffoldLayout,
  paneScaffoldClasses,
  paneSnapTargets,
  planPanes,
} from './pane-scaffold.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import paneScaffoldStyles from './pane-scaffold.css' with {type: 'css'}; // github-only
// import paneScaffoldStyles from './pane-scaffold.cssresult.js'; // google3-only

/** Detail of the `window-class-change` event. */
export interface WindowClassChangeDetail {
  windowClass: WindowSizeClass;
  previous: WindowSizeClass | null;
}

/** Detail of the `window-height-class-change` event. */
export interface WindowHeightClassChangeDetail {
  windowHeightClass: WindowHeightClass;
  previous: WindowHeightClass | null;
}

/** Detail of the `pane-layout-change` event. */
export interface PaneLayoutChangeDetail {
  windowClass: WindowSizeClass;
  mode: PaneMode;
  /** Co-planar panes visible side by side. */
  paneCount: number;
  visiblePanes: PaneName[];
}

/** Detail of the `pane-resize` event. */
export interface PaneResizeDetail {
  /** The secondary pane width set with the drag handle, or null (default). */
  paneWidth: number | null;
  collapsedPane: 'primary' | 'secondary' | null;
}

/**
 * The handle's release velocity (px/s) above which a fling goes to the next
 * snap width in its direction.
 */
const RESIZE_VELOCITY_THRESHOLD_PX_PER_S = 500;

/** Focusable descendants, for moving focus into a modal levitated pane. */
const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Returns the focused element, looking into shadow roots. */
function deepActiveElement(): HTMLElement | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active instanceof HTMLElement ? active : null;
}

/** The app scaffold tag; a pane scaffold inside one follows its class. */
const APP_SCAFFOLD_TAG = 'md-gb-app-scaffold';

// spec-labels: layout-canonical-examples/list-detail/usage/dividing-space,
// spec-labels: layout-canonical-examples/list-detail/across-breakpoints/medium,
// spec-labels: layout-canonical-examples/supporting-pane/dividing-space,
// spec-labels: layout-canonical-examples/feed/across-breakpoints/compact,
// spec-labels: layout-canonical-examples/list-detail,
// spec-labels: layout-canonical-examples/list-detail/across-breakpoints/expanded-large-extra-large,
// spec-labels: layout-canonical-examples/list-detail/across-breakpoints/compact,
// spec-labels: layout-bidirectionality-rtl/tab-1/canonical-layout-examples/list-detail
/**
 * A Material Design pane scaffold: one to three panes that adapt to the
 * window size class, with the canonical list-detail, supporting pane and
 * feed layouts.
 *
 * Margins, the spacer between panes, the fixed pane width and the number of
 * visible panes follow the spec per window size class: compact (< 600px, one
 * pane, 16px margins), medium (600–839px, one pane or two 50/50 panes with
 * `medium-two-pane`, 24px), expanded (840–1199px, two panes, 360px fixed
 * pane), large (1200–1599px, two panes, 412px fixed pane) and extra-large
 * (1600px+, two panes plus an optional third).
 *
 * The window size class is measured from the scaffold's own width, or taken
 * from the enclosing `md-gb-app-scaffold` (which measures the window), and
 * reflected as the `window-class` attribute (with `mode` and `pane-count`,
 * so content can style itself, e.g. show a back button only when
 * `mode="single"`). Slotted content inherits the `--md-sys-layout-*`
 * tokens of that class.
 *
 * @slot - The primary (flexible) pane: the detail pane of a list-detail
 *     layout, the focus pane of a supporting pane layout, or the feed items
 *     (laid out on a grid) of a feed layout.
 * @slot secondary - The secondary pane: the list of a list-detail layout or
 *     the supporting pane. It is the fixed pane in fixed-and-flexible
 *     arrangements.
 * @slot tertiary - An optional third pane (e.g. a standard side sheet),
 *     shown at extra-large only.
 * @slot placeholder - Shown in the primary pane of a two-pane list-detail
 *     layout while `detail-open` is false (no item selected).
 *
 * Levitate (spec: scaffold, "Levitate"): with `levitate="floating"` or
 * `levitate="docked"`, the secondary pane of a supporting pane or feed
 * layout floats above the primary pane (or docks to the bottom edge at
 * compact, like a bottom sheet) in windows too small for two co-planar
 * panes, while `levitate-open` is set. `levitate-modal` makes it modal:
 * a scrim covers the panes, the primary pane is inert, focus moves into the
 * pane and back to the trigger, and the pane closes when something behind
 * it is used or Escape is pressed. Modality is scoped to the scaffold; use
 * `md-gb-dialog` or `md-gb-sheet` for app-wide modals.
 *
 * Foldables: the scaffold reads the fold (hinge) from the Viewport Segments
 * API and keeps panes off it. A vertical fold splits two panes at the fold
 * with the spacer on it (at least the spacer width); a horizontal fold
 * (tabletop) stacks the supporting pane below it. The fold crossing the
 * scaffold is reflected as the `fold` attribute (`vertical` or
 * `horizontal`). Browsers without the API keep the regular layout.
 * @csspart scaffold - The flex container of the panes.
 * @csspart pane - Each pane.
 * @csspart primary - The primary pane.
 * @csspart secondary - The secondary pane.
 * @csspart tertiary - The tertiary pane.
 * @csspart spacer - The spacer between panes.
 * @csspart drag-handle - The drag handle.
 * @csspart scrim - The scrim behind a modal levitated pane.
 * @cssprop --pane-container-color - Pane background (transparent: panes
 *     blend with the background, implicit grouping).
 * @cssprop --pane-container-shape - Pane corner radius.
 * @cssprop --feed-columns - Overrides the number of feed grid columns.
 * @cssprop --md-gb-scaffold-nav-inline-size - Width of a navigation rail
 *     beside the scaffold, so split panes keep the spacer centered in the
 *     window. Set by `md-gb-app-scaffold`.
 * @fires {CustomEvent<WindowClassChangeDetail>} window-class-change - Fired
 *     when the window size class changes. --bubbles --composed
 * @fires {CustomEvent<WindowHeightClassChangeDetail>} window-height-class-change
 *     - Fired when the window height size class changes. --bubbles --composed
 * @fires {CustomEvent<PaneLayoutChangeDetail>} pane-layout-change - Fired when
 *     the visible panes change. --bubbles --composed
 * @fires {Event} levitate-close - Fired when the scaffold closes a levitated
 *     pane (Escape, or using something behind a modal pane). --bubbles
 *     --composed
 * @fires {CustomEvent<PaneResizeDetail>} pane-resize - Fired when the panes
 *     are resized or collapsed with the drag handle. --bubbles --composed
 */
// spec-labels: layout-scaffold/panes/panes, layout-scaffold/panes/panes/two-pane-layouts
export class PaneScaffoldElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    paneScaffoldStyles,
    css`
      :host {
        display: block;
        block-size: 100%;
      }

      :host([hidden]),
      slot[hidden] {
        display: none;
      }
    `,
  ];

  /** The canonical layout. */
  @property({reflect: true}) layout: PaneScaffoldLayout = 'list-detail';

  /** How two panes share the width. */
  @property({reflect: true}) arrangement: PaneArrangement = 'fixed-flexible';

  /**
   * Where the secondary pane sits in two-pane layouts. Defaults to `start`
   * for list-detail and `end` for supporting pane and feed layouts. Mirrors
   * in right-to-left.
   */
  @property({attribute: 'secondary-position', reflect: true})
  secondaryPosition: PanePosition | undefined = undefined;

  /**
   * Whether medium windows show two panes (50% each) instead of one. The
   * spec limits this to low-density content such as settings.
   */
  @property({type: Boolean, attribute: 'medium-two-pane', reflect: true})
  mediumTwoPane = false;

  /**
   * List-detail: whether an item is selected. Single-pane windows show the
   * detail (primary) pane when true and the list (secondary) pane when
   * false; two-pane windows show the `placeholder` slot instead of the
   * detail while false.
   */
  @property({type: Boolean, attribute: 'detail-open', reflect: true})
  detailOpen = false;

  /** Whether two-pane layouts render a drag handle to resize the panes. */
  @property({type: Boolean, reflect: true}) resizable = false;

  /**
   * Width in px of the secondary pane set with the drag handle, or null for
   * the default width. Set it to restore a persisted width.
   */
  @property({type: Number, attribute: 'pane-width'})
  paneWidth: number | null = null;

  /** A pane collapsed with the drag handle, or null. */
  @property({attribute: 'collapsed-pane', reflect: true})
  collapsedPane: 'primary' | 'secondary' | null = null;

  /**
   * `persistent` keeps a resized width or collapsed pane across window size
   * class changes; `temporary` returns to the default layout. Defaults to
   * persistent for list-detail and temporary for the other layouts.
   */
  @property({attribute: 'resize-behavior'})
  resizeBehavior: PaneResizeBehavior | undefined = undefined;

  /**
   * The levitate strategy for the secondary pane of supporting pane and
   * feed layouts in windows too small for two panes: `none` reflows it
   * below the primary pane, `floating` floats it above, `docked` docks it
   * to the bottom edge at compact (floating from medium).
   */
  @property({reflect: true}) levitate: PaneLevitate = 'none';

  /** Whether the levitated secondary pane is shown. */
  @property({type: Boolean, attribute: 'levitate-open', reflect: true})
  levitateOpen = false;

  /** Whether the levitated secondary pane is modal (scrim, inert panes). */
  @property({type: Boolean, attribute: 'levitate-modal', reflect: true})
  levitateModal = false;

  /** Accessible label of a modal levitated pane (its dialog role). */
  @property({attribute: 'levitate-label'}) levitateLabel = '';

  /** Accessible label of the drag handle. */
  @property({attribute: 'drag-handle-label'})
  dragHandleLabel = 'Resize panes';

  /**
   * What a tap, Enter or Space on the drag handle does, the single-pointer
   * alternative to dragging it: `toggle` (default) switches between one and
   * two panes; `cycle` steps through the snap widths and then collapses the
   * secondary pane.
   */
  @property({attribute: 'handle-tap'}) handleTap: PaneHandleTap = 'toggle';

  /** The current window size class (read-only, reflected). */
  get windowClass(): WindowSizeClass {
    return this.size.value;
  }

  /** The current window height size class (read-only, reflected). */
  get windowHeightClass(): WindowHeightClass {
    return this.size.height;
  }

  /**
   * The fold (hinge) crossing the scaffold, relative to its inline-start /
   * top edge, or null (read-only).
   */
  get fold(): ElementFold | null {
    return this.elementFold;
  }

  /** Co-planar panes currently visible side by side (read-only). */
  get paneCount(): number {
    return this.plan.paneCount;
  }

  /** How panes are currently arranged (read-only). */
  get mode(): PaneMode {
    return this.plan.mode;
  }

  /** Whether only one pane is visible at a time (read-only). */
  get singlePane(): boolean {
    return this.plan.mode !== 'two-pane';
  }

  @state() private hasSecondary = false;
  @state() private hasTertiary = false;
  @state() private hasPlaceholder = false;
  @state() private pressed = false;
  @state() private elementFold: ElementFold | null = null;

  @query('.pane-primary') private readonly primaryPane!: HTMLElement | null;
  @query('.pane-secondary')
  private readonly secondaryPane!: HTMLElement | null;
  @query('.drag-handle') private readonly dragHandle!: HTMLElement | null;

  private plan: PanePlan = planPanes({
    layout: 'list-detail',
    windowClass: 'compact',
  });
  private appScaffold: HTMLElement | null = null;
  private lastSecondaryFocus: HTMLElement | null = null;
  private lastLayoutKey = '';
  private viewportFold: Fold | null = null;
  private foldResizeObserver: ResizeObserver | null = null;
  private stopFold: (() => void) | null = null;
  private lastFocusBeforeOpen: HTMLElement | null = null;
  private outsideListening = false;

  private readonly size = new WindowSizeClassController(this, {
    target: () => {
      this.appScaffold = this.findAppScaffold();
      return this.appScaffold ? null : this;
    },
    onChange: (windowClass, previous) => {
      if (previous && this.effectiveResizeBehavior === 'temporary') {
        this.paneWidth = null;
        this.collapsedPane = null;
      }
      this.dispatchEvent(
        new CustomEvent<WindowClassChangeDetail>('window-class-change', {
          bubbles: true,
          composed: true,
          detail: {windowClass, previous},
        }),
      );
    },
    onHeightChange: (windowHeightClass, previous) => {
      this.dispatchEvent(
        new CustomEvent<WindowHeightClassChangeDetail>(
          'window-height-class-change',
          {
            bubbles: true,
            composed: true,
            detail: {windowHeightClass, previous},
          },
        ),
      );
    },
  });

  override connectedCallback() {
    super.connectedCallback();
    if (this.appScaffold) {
      this.appScaffold.addEventListener(
        'window-class-change',
        this.handleAppScaffoldClass,
      );
      this.appScaffold.addEventListener(
        'window-height-class-change',
        this.handleAppScaffoldHeightClass,
      );
      const app = this.appScaffold as HTMLElement & {
        windowClass?: WindowSizeClass;
        windowHeightClass?: WindowHeightClass;
      };
      if (app.windowClass) this.size.set(app.windowClass);
      if (app.windowHeightClass) this.size.setHeight(app.windowHeightClass);
    }
    this.stopFold = observeFold((fold) => {
      this.viewportFold = fold;
      this.observeFoldResize();
      this.measureFold();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.appScaffold?.removeEventListener(
      'window-class-change',
      this.handleAppScaffoldClass,
    );
    this.appScaffold?.removeEventListener(
      'window-height-class-change',
      this.handleAppScaffoldHeightClass,
    );
    this.appScaffold = null;
    this.stopFold?.();
    this.stopFold = null;
    this.viewportFold = null;
    this.foldResizeObserver?.disconnect();
    this.foldResizeObserver = null;
    this.listenOutside(false);
  }

  /** List-detail: shows the detail pane (e.g. after selecting an item). */
  openDetail() {
    this.detailOpen = true;
  }

  /**
   * List-detail: returns to the list (e.g. from the detail pane's back
   * button in a single-pane window).
   */
  closeDetail() {
    this.detailOpen = false;
  }

  /** Shows the levitated secondary pane. */
  openLevitated() {
    this.levitateOpen = true;
  }

  /** Hides the levitated secondary pane. */
  closeLevitated() {
    this.levitateOpen = false;
  }

  /** Returns the panes to their default widths. */
  resetPaneWidth() {
    this.setResize(null, null);
  }

  private get effectiveResizeBehavior(): PaneResizeBehavior {
    return (
      this.resizeBehavior ??
      (this.layout === 'list-detail' ? 'persistent' : 'temporary')
    );
  }

  private get effectivePosition(): PanePosition {
    return (
      this.secondaryPosition ??
      (this.layout === 'list-detail' ? 'start' : 'end')
    );
  }

  private findAppScaffold(): HTMLElement | null {
    let node: Node | null = this.parentNode;
    while (node) {
      if (node instanceof HTMLElement && node.localName === APP_SCAFFOLD_TAG) {
        return node;
      }
      node = node instanceof ShadowRoot ? node.host : (node.parentNode ?? null);
    }
    return null;
  }

  private readonly handleAppScaffoldHeightClass = (event: Event) => {
    if (event.target !== this.appScaffold) return;
    const {windowHeightClass} = (
      event as CustomEvent<WindowHeightClassChangeDetail>
    ).detail;
    this.size.setHeight(windowHeightClass);
  };

  // --- Folds -----------------------------------------------------------------

  /** Re-measures the fold when the scaffold resizes. */
  private observeFoldResize() {
    if (!this.viewportFold) {
      this.foldResizeObserver?.disconnect();
      this.foldResizeObserver = null;
      return;
    }
    if (this.foldResizeObserver) return;
    this.foldResizeObserver = new ResizeObserver(() => {
      this.measureFold();
    });
    this.foldResizeObserver.observe(this);
  }

  /**
   * Finds where the viewport's fold crosses the scaffold. Call it after
   * moving the scaffold without resizing it.
   */
  measureFold() {
    const rtl =
      !!this.viewportFold && getComputedStyle(this).direction === 'rtl';
    const fold = foldWithin(
      this.viewportFold,
      this.getBoundingClientRect(),
      rtl,
    );
    const current = this.elementFold;
    if (
      fold?.orientation === current?.orientation &&
      fold?.start === current?.start &&
      fold?.size === current?.size
    ) {
      return;
    }
    this.elementFold = fold;
  }

  // --- Levitate --------------------------------------------------------------

  /** Whether a modal levitated pane is showing. */
  private get modalOpen(): boolean {
    return (
      this.plan.mode === 'levitated' &&
      this.levitateModal &&
      this.plan.visible.includes('secondary')
    );
  }

  private listenOutside(listen: boolean) {
    if (listen === this.outsideListening) return;
    this.outsideListening = listen;
    if (listen) {
      document.addEventListener('pointerdown', this.handleOutsidePointer, true);
    } else {
      document.removeEventListener(
        'pointerdown',
        this.handleOutsidePointer,
        true,
      );
    }
  }

  /** A modal floating pane closes when something behind it is used. */
  private readonly handleOutsidePointer = (event: PointerEvent) => {
    if (!this.modalOpen || !this.secondaryPane) return;
    if (event.composedPath().includes(this.secondaryPane)) return;
    this.dismissLevitated();
  };

  private readonly handleSecondaryKeyDown = (event: KeyboardEvent) => {
    if (
      event.key !== 'Escape' ||
      this.plan.mode !== 'levitated' ||
      !this.levitateOpen
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.dismissLevitated();
  };

  private dismissLevitated() {
    if (!this.levitateOpen) return;
    this.levitateOpen = false;
    this.dispatchEvent(
      new Event('levitate-close', {bubbles: true, composed: true}),
    );
  }

  /** Moves focus into a modal pane: its first focusable element. */
  private focusLevitated() {
    const pane = this.secondaryPane;
    if (!pane) return;
    const slot = pane.querySelector<HTMLSlotElement>('slot[name="secondary"]');
    for (const el of slot?.assignedElements({flatten: true}) ?? []) {
      const target = el.matches(FOCUSABLE) ? el : el.querySelector(FOCUSABLE);
      if (target instanceof HTMLElement) {
        target.focus();
        return;
      }
    }
    pane.focus();
  }

  /**
   * Modal levitated panes take focus when they open and give it back to the
   * trigger when they close (spec: accessibility, floating panes). A
   * non-modal pane gives focus back only if it had it.
   */
  private levitatedOpenChanged() {
    if (this.plan.mode !== 'levitated') return;
    if (this.levitateOpen) {
      if (this.levitateModal) this.focusLevitated();
      return;
    }
    const target = this.lastFocusBeforeOpen;
    this.lastFocusBeforeOpen = null;
    const active = deepActiveElement();
    const focusInPane =
      !!active &&
      (this.secondaryPane?.contains(active) ||
        (this.contains(active) && !!active.closest('[slot="secondary"]')));
    const focusLost = !active || active === document.body || focusInPane;
    if (target?.isConnected && focusLost) {
      target.focus();
    }
  }

  private readonly handleAppScaffoldClass = (event: Event) => {
    if (event.target !== this.appScaffold) return;
    const {windowClass} = (event as CustomEvent<WindowClassChangeDetail>)
      .detail;
    this.size.set(windowClass);
  };

  protected override willUpdate(changed: PropertyValues<this>) {
    // A different layout starts from its default pane widths.
    if (changed.has('layout') && changed.get('layout') !== undefined) {
      this.paneWidth = null;
      this.collapsedPane = null;
    }
    this.plan = planPanes({
      layout: this.layout,
      windowClass: this.size.value,
      mediumTwoPane: this.mediumTwoPane,
      hasSecondary: this.hasSecondary,
      hasTertiary: this.hasTertiary,
      detailOpen: this.detailOpen,
      collapsedPane: this.collapsedPane,
      levitate: this.levitate,
      levitateOpen: this.levitateOpen,
      fold: this.elementFold?.orientation ?? null,
    });
    if (this.getAttribute('window-class') !== this.size.value) {
      this.setAttribute('window-class', this.size.value);
    }
    if (this.getAttribute('window-height-class') !== this.size.height) {
      this.setAttribute('window-height-class', this.size.height);
    }
    this.setAttribute('pane-count', String(this.plan.paneCount));
    this.setAttribute('mode', this.plan.mode);
    if (this.elementFold) {
      this.setAttribute('fold', this.elementFold.orientation);
    } else {
      this.removeAttribute('fold');
    }
    // Remember where focus was when a levitated pane opens (the trigger).
    if (changed.has('levitateOpen') && this.levitateOpen) {
      const active = deepActiveElement();
      this.lastFocusBeforeOpen =
        active && active !== document.body ? active : null;
    }
  }

  protected override updated(changed: PropertyValues<this>) {
    this.syncHandleValue();
    const key = `${this.size.value}|${this.plan.mode}|${this.plan.visible.join()}|${this.plan.tertiary}`;
    if (key !== this.lastLayoutKey) {
      this.lastLayoutKey = key;
      const visiblePanes: PaneName[] = [...this.plan.visible];
      if (this.plan.tertiary) visiblePanes.push('tertiary');
      this.dispatchEvent(
        new CustomEvent<PaneLayoutChangeDetail>('pane-layout-change', {
          bubbles: true,
          composed: true,
          detail: {
            windowClass: this.size.value,
            mode: this.plan.mode,
            paneCount: this.plan.paneCount,
            visiblePanes,
          },
        }),
      );
    }
    this.listenOutside(this.modalOpen);
    if (
      changed.has('levitateOpen') &&
      changed.get('levitateOpen') !== undefined
    ) {
      this.levitatedOpenChanged();
    }
    if (
      changed.has('detailOpen') &&
      changed.get('detailOpen') !== undefined &&
      this.layout === 'list-detail' &&
      this.plan.mode === 'single'
    ) {
      this.moveFocusAfterNavigation();
    }
  }

  /**
   * In a single-pane list-detail layout, opening the detail replaces the
   * list: move focus into the detail, and back to the list item that was
   * focused when returning.
   */
  private moveFocusAfterNavigation() {
    const active = this.containsFocus();
    if (!active) return;
    if (this.detailOpen) {
      this.primaryPane?.focus();
    } else if (this.lastSecondaryFocus?.isConnected) {
      this.lastSecondaryFocus.focus();
    } else {
      this.secondaryPane?.focus();
    }
  }

  private containsFocus(): boolean {
    // Focus is on a slotted (light DOM) element or on a pane in the shadow.
    return this.matches(':focus-within');
  }

  private readonly handleSecondaryFocusIn = (event: FocusEvent) => {
    const target = event.composedPath()[0];
    if (target instanceof HTMLElement && target !== this.secondaryPane) {
      this.lastSecondaryFocus = target;
    }
  };

  private handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const has = slot
      .assignedNodes({flatten: true})
      .some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE ||
          (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()),
      );
    switch (slot.name) {
      case 'secondary':
        this.hasSecondary = has;
        break;
      case 'tertiary':
        this.hasTertiary = has;
        break;
      case 'placeholder':
        this.hasPlaceholder = has;
        break;
      default:
        break;
    }
  }

  // --- Resizing --------------------------------------------------------------

  private setResize(
    paneWidth: number | null,
    collapsedPane: 'primary' | 'secondary' | null,
  ) {
    if (paneWidth === this.paneWidth && collapsedPane === this.collapsedPane) {
      return;
    }
    this.paneWidth = paneWidth;
    this.collapsedPane = collapsedPane;
    this.dispatchEvent(
      new CustomEvent<PaneResizeDetail>('pane-resize', {
        bubbles: true,
        composed: true,
        detail: {paneWidth, collapsedPane},
      }),
    );
  }

  /** The secondary pane is on the visual left. */
  private get secondaryOnLeft(): boolean {
    const rtl = getComputedStyle(this).direction === 'rtl';
    return (this.effectivePosition === 'start') !== rtl;
  }

  /** Width shared by the two panes, and the current secondary width. */
  private measurePanes(): {available: number; current: number} {
    const secondary = this.secondaryPane?.getBoundingClientRect().width ?? 0;
    const primary = this.primaryPane?.getBoundingClientRect().width ?? 0;
    const available = secondary + primary;
    // Prefer the state over the measured width, which lags behind while
    // the panes animate to a new width.
    const current =
      this.collapsedPane === 'secondary'
        ? 0
        : this.collapsedPane === 'primary'
          ? available
          : Math.min(available, this.paneWidth ?? secondary);
    return {available, current};
  }

  /** Secondary width that centers the spacer in the window. */
  private splitWidth(available: number): number {
    const nav =
      parseFloat(
        getComputedStyle(this).getPropertyValue(
          '--md-gb-scaffold-nav-inline-size',
        ),
      ) || 0;
    const offset = this.plan.tertiary ? 0 : nav / 2;
    return this.effectivePosition === 'start'
      ? available / 2 - offset
      : available / 2 + offset;
  }

  private snapTargets(available: number): number[] {
    return paneSnapTargets(
      this.size.value,
      available,
      this.splitWidth(available),
    );
  }

  /** Applies a secondary width, collapsing a pane at either end. */
  private applyWidth(width: number, available: number) {
    if (width <= 0) {
      this.setResize(this.paneWidth, 'secondary');
    } else if (width >= available) {
      this.setResize(this.paneWidth, 'primary');
    } else {
      this.setResize(Math.round(width), null);
    }
  }

  /** A press on the handle, until it is released (the pressed state). */
  private readonly handlePress = () => {
    this.pressed = true;
    const release = () => {
      this.pressed = false;
      window.removeEventListener('pointerup', release, true);
      window.removeEventListener('pointercancel', release, true);
    };
    window.addEventListener('pointerup', release, true);
    window.addEventListener('pointercancel', release, true);
  };

  /** The snap widths while a drag lasts (measured once, at its start). */
  private dragSnap: {available: number; targets: number[]} | null = null;

  private snapAnchors(): number[] {
    if (this.dragSnap) return this.dragSnap.targets;
    const {available} = this.measurePanes();
    return this.snapTargets(available);
  }

  /**
   * Dragging the handle resizes the secondary pane freely and settles on a
   * snap width at release; the handle's tap and keys reach the same widths
   * through `settleTo()` (the single-pointer alternative).
   */
  private readonly resizeDrag = new DragSettleController(this, {
    axis: 'x',
    target: () => this.dragHandle,
    anchors: () => this.snapAnchors(),
    value: () => this.measurePanes().current,
    bounds: () => ({min: 0, max: this.measurePanes().available}),
    // The secondary pane grows toward the handle's side of the other pane.
    reverse: () => !this.secondaryOnLeft,
    velocityThreshold: RESIZE_VELOCITY_THRESHOLD_PX_PER_S,
    onDragStart: () => {
      const {available} = this.measurePanes();
      this.dragSnap = {available, targets: this.snapTargets(available)};
    },
    onDrag: (width) => {
      // Free resize while dragging; snapping happens on release.
      this.paneWidth = Math.round(width);
      this.collapsedPane = null;
    },
    onSettle: (width, {source}) => {
      const available = this.dragSnap?.available ?? this.measurePanes().available;
      this.dragSnap = null;
      if (source === 'drag') {
        // Report the snapped state, even if it equals the drag width.
        this.paneWidth = null;
        this.collapsedPane = null;
      }
      this.applyWidth(width, available);
    },
    onCancel: () => {
      this.dragSnap = null;
      this.paneWidth = null;
      this.collapsedPane = null;
    },
  });

  private get dragging() {
    return this.resizeDrag.dragging;
  }

  /**
   * Tap, Enter or Space: toggle between one and two panes, or (`cycle`) step
   * to the next snap width.
   */
  private toggleCollapsed() {
    if (this.handleTap === 'cycle') {
      const {available, current} = this.measurePanes();
      this.resizeDrag.settleTo(
        nextPaneSnapTarget(current, this.snapTargets(available), available),
      );
      return;
    }
    if (this.collapsedPane) {
      this.setResize(this.paneWidth, null);
    } else {
      this.setResize(this.paneWidth, 'secondary');
    }
  }

  // The click that ends a drag is suppressed by the drag gesture.
  private readonly handleHandleClick = () => {
    this.toggleCollapsed();
  };

  private readonly handleHandleKeyDown = (event: KeyboardEvent) => {
    const {available, current} = this.measurePanes();
    const targets = this.snapTargets(available);
    let next: number | null = null;
    const grow = (dir: 1 | -1) =>
      dir > 0
        ? (targets.find((t) => t > current + 1) ?? available)
        : ([...targets].reverse().find((t) => t < current - 1) ?? 0);
    switch (event.key) {
      case 'ArrowLeft':
        next = grow(this.secondaryOnLeft ? -1 : 1);
        break;
      case 'ArrowRight':
        next = grow(this.secondaryOnLeft ? 1 : -1);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = available;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleCollapsed();
        return;
      default:
        return;
    }
    event.preventDefault();
    this.resizeDrag.settleTo(next);
  };

  // --- Rendering -------------------------------------------------------------

  private renderPane(name: 'primary' | 'secondary', first: boolean) {
    const {mode, visible} = this.plan;
    const isVisible = visible.includes(name);
    const other = name === 'primary' ? 'secondary' : 'primary';
    const hidden = !isVisible && mode !== 'two-pane';
    const collapsed = !isVisible && mode === 'two-pane';
    const fill =
      mode === 'two-pane' && isVisible && this.collapsedPane === other;
    const classes = {
      pane: true,
      [`pane-${name}`]: true,
      'pane-hidden': hidden,
      'pane-collapsed': collapsed,
      'pane-fill': fill,
      'pane-first': first,
    };
    if (name === 'secondary') {
      const modal = mode === 'levitated' && this.levitateModal;
      return html`<div
        class=${classMap(classes)}
        part="pane secondary"
        id="secondary"
        tabindex="-1"
        role=${modal ? 'dialog' : nothing}
        aria-label=${modal && this.levitateLabel ? this.levitateLabel : nothing}
        @focusin=${this.handleSecondaryFocusIn}
        @keydown=${this.handleSecondaryKeyDown}>
        <slot name="secondary" @slotchange=${this.handleSlotChange}></slot>
      </div>`;
    }
    const showPlaceholder =
      this.layout === 'list-detail' &&
      mode === 'two-pane' &&
      !this.detailOpen &&
      this.hasPlaceholder;
    return html`<div
      class=${classMap(classes)}
      part="pane primary"
      id="primary"
      tabindex="-1"
      ?inert=${this.modalOpen}>
      <slot ?hidden=${showPlaceholder}></slot>
      <slot
        name="placeholder"
        ?hidden=${!showPlaceholder}
        @slotchange=${this.handleSlotChange}></slot>
    </div>`;
  }

  private renderDragHandle() {
    if (!this.resizable || this.plan.mode !== 'two-pane' || this.plan.fold) {
      return nothing;
    }
    return html`<div
      class=${classMap({
        'drag-handle': true,
        'focus-ring-outer': true,
        'drag-handle-pressed': this.pressed && !this.dragging,
        'drag-handle-dragged': this.dragging,
      })}
      part="drag-handle"
      role="separator"
      tabindex="0"
      aria-orientation="vertical"
      aria-controls="secondary"
      aria-label=${this.dragHandleLabel}
      aria-valuemin="0"
      aria-valuemax="100"
      @pointerdown=${this.handlePress}
      @click=${this.handleHandleClick}
      @keydown=${this.handleHandleKeyDown}>
      <span class="drag-handle-indicator"></span>
    </div>`;
  }

  /** Reports the secondary pane width as a percentage of both panes. */
  private syncHandleValue() {
    const handle = this.dragHandle;
    if (!handle) return;
    const {available, current} = this.measurePanes();
    const percent = available > 0 ? Math.round((current / available) * 100) : 0;
    handle.setAttribute('aria-valuenow', String(percent));
  }

  protected override render() {
    const {mode, visible, tertiary, fold, levitated} = this.plan;
    const position = this.effectivePosition;
    // Stacked panes keep the supporting pane below the focus pane, and the
    // DOM order follows the visual order so focus order matches. A
    // levitated pane follows the primary pane in reading order.
    const secondaryFirst =
      position === 'start' && mode !== 'stacked' && mode !== 'levitated';
    const split =
      mode === 'two-pane' &&
      (this.arrangement === 'split' || this.size.value === 'medium');
    const spacerHidden =
      mode === 'single' ||
      mode === 'levitated' ||
      (visible.length < 2 && !this.resizable);
    const style: Record<string, string> = {};
    if (fold && this.elementFold) {
      style['--_fold-start'] = `${this.elementFold.start}px`;
      style['--_fold-size'] = `${this.elementFold.size}px`;
    } else if (this.paneWidth !== null && mode === 'two-pane') {
      style['--_pane-width'] = `${this.paneWidth}px`;
    }
    return html`
      <div
        part="scaffold"
        class=${classMap(
          paneScaffoldClasses({
            mode,
            layout: this.layout,
            split,
            secondaryPosition: position,
            tertiary,
            dragging: this.dragging,
            levitated,
            fold,
          }),
        )}
        style=${styleMap(style)}>
        ${this.renderPane(secondaryFirst ? 'secondary' : 'primary', true)}
        <div
          part="spacer"
          class=${classMap({
            'pane-spacer': true,
            'pane-spacer-main': true,
            'pane-spacer-hidden': spacerHidden,
          })}>
          ${this.renderDragHandle()}
        </div>
        ${this.modalOpen
          ? html`<div class="pane-scrim" part="scrim" aria-hidden="true"></div>`
          : nothing}
        ${this.renderPane(secondaryFirst ? 'primary' : 'secondary', false)}
        <div
          part="spacer"
          class=${classMap({
            'pane-spacer': true,
            'pane-spacer-hidden': !tertiary,
          })}></div>
        <div
          class=${classMap({
            pane: true,
            'pane-tertiary': true,
            'pane-hidden': !tertiary,
          })}
          part="pane tertiary"
          id="tertiary">
          <slot name="tertiary" @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
  }
}
