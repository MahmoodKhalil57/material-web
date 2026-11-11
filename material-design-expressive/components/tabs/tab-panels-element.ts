/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  type CSSResultOrNative,
  html,
  isServer,
  LitElement,
  type PropertyValues,
} from 'lit';
import {property} from 'lit/decorators.js';
import {AriaTablistElement} from '../../foundations/accessibility/aria/tabs/tablist.js';
import {DragSettleController} from '../../foundations/interaction/gestures/drag-settle.js';
import {isReducedMotion, parseDuration} from '../../styles/motion/motion.js';
import {updateClassList} from '../shared/update-class-list.js';

import tabPanelsStyles from './tab-panels.css' with {type: 'css'}; // github-only
// import tabPanelsStyles from './tab-panels.cssresult.js'; // google3-only

import {
  TAB_PANEL_OFFSET_PROPERTY,
  TAB_PANELS_CLASSES,
  TAB_PANELS_POSITIONAL_THRESHOLD,
  TAB_PANELS_VELOCITY_THRESHOLD_PX_PER_S,
} from './tab-panels.js';

/** Extra time after the transition before the slide is finished anyway. */
const FINISH_FALLBACK_MS = 50;

let nextId = 0;

/** Gives an element an id if it has none, and returns it. */
function ensureId(element: Element, prefix: string) {
  if (!element.id) {
    element.id = `${prefix}-${nextId++}`;
  }
  return element.id;
}

/** Whether a press on this path should not swipe (text editing). */
function isEditablePath(path: EventTarget[]) {
  return path.some(
    (el) =>
      el instanceof HTMLElement &&
      (el.isContentEditable ||
        el.localName === 'input' ||
        el.localName === 'textarea' ||
        el.localName === 'select'),
  );
}

/**
 * The content of a set of tabs: one `role="tabpanel"` child per tab, in tab
 * order. Shows the selected tab's panel and slides between panels when the
 * selection changes; people can also swipe the content area left or right
 * to move to the next or previous tab (spec Tabs > Behavior > "Swipe within
 * the content area", Gestures > Swipe: "Switch between peer views like
 * tabs").
 *
 * The panels link to an `<md-gb-tabs>` (any `AriaTablistElement`): the
 * `tabs` property, else the element whose id is in `for`, else the previous
 * sibling when it is a tablist. Panel `i` belongs to tab `i`; the panels set
 * each tab's `aria-controls` and each panel's `aria-labelledby`. Selection
 * stays in sync both ways: selecting a tab slides the panels, and a swipe
 * selects the tab (moving its indicator) and fires `change` on the tabs,
 * like a tab click. Without linked tabs, `selectedIndex` drives the panels.
 *
 * Motion follows Compose `HorizontalPager`: a drag moves the panels with the
 * pointer, clamped to the neighboring panels; on release, a fling faster
 * than 400px/s or a drag past half the width settles at the next panel,
 * otherwise back, with the pager's critically damped settle spring.
 * Swiping and slides mirror in right-to-left layouts; with reduced motion
 * the panels change instantly. Inactive panels are `hidden`, and `inert`
 * while they are on screen mid-slide.
 *
 * @slot - The tab panels: elements with `role="tabpanel"`, such as
 *     `<md-aria-tabpanel>` or `<div role="tabpanel">`.
 * @cssprop --transition-duration - Duration of a slide between panels.
 * @cssprop --transition-easing - Easing of a slide between panels.
 */
export class TabPanelsElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [tabPanelsStyles];

  /** The id of the `<md-gb-tabs>` these panels belong to. */
  @property({attribute: 'for'}) htmlFor = '';

  /** Whether to turn off swiping between panels. */
  @property({type: Boolean, reflect: true, attribute: 'gestures-disabled'})
  gesturesDisabled = false;

  /**
   * The tabs these panels belong to. Setting it overrides `for` and the
   * previous-sibling lookup; set it to `null` to go back to them.
   */
  get tabs(): AriaTablistElement | null {
    return this.explicitTabs ?? this.resolveTabs();
  }
  set tabs(value: AriaTablistElement | null) {
    this.explicitTabs = value;
    this.linkTabs();
  }

  /**
   * The index of the active panel. With linked tabs, it is the selected
   * tab's index, and setting it selects that tab.
   */
  get selectedIndex(): number {
    return this.index;
  }
  set selectedIndex(value: number) {
    const linked = this.linkedTabs;
    if (linked) {
      linked.selectedTabIndex = value;
      this.sync();
      return;
    }
    this.standaloneIndex = value;
    this.sync();
  }

  /** The panels: slotted elements with `role="tabpanel"`. */
  get panels(): HTMLElement[] {
    const slot = this.renderRoot?.querySelector?.('slot');
    const elements = slot
      ? slot.assignedElements({flatten: true})
      : Array.from(this.children);
    return elements.filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        (el.getAttribute('role') === 'tabpanel' ||
          el.localName === 'md-aria-tabpanel'),
    );
  }

  /** The panel that is shown (or being slid to). */
  get activePanel(): HTMLElement | null {
    return this.panels[this.index] ?? null;
  }

  private explicitTabs: AriaTablistElement | null = null;
  private linkedTabs: AriaTablistElement | null = null;
  private tabsObserver: MutationObserver | null = null;
  private standaloneIndex = 0;
  /** The active panel's index, -1 before the first sync. */
  private index = -1;
  /** Panels on screen besides the active one (mid-drag or mid-slide). */
  private readonly visiblePanels = new Set<HTMLElement>();
  private dragWidth = 0;
  /** The fractional panel position while dragging, null otherwise. */
  private dragPosition: number | null = null;
  private slideTimer: ReturnType<typeof setTimeout> | null = null;
  private sliding = false;

  constructor() {
    super();
    if (isServer) return;
    this.addEventListener('transitionend', this.handleTransitionEnd);
    this.addEventListener('transitioncancel', this.handleTransitionEnd);
  }

  override connectedCallback() {
    super.connectedCallback();
    updateClassList(this, {[TAB_PANELS_CLASSES.tabPanels]: true});
    this.linkTabs();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.dragPosition = null;
    this.finishSlide();
    this.observeTabs(null);
  }

  protected override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (changed.has('htmlFor')) {
      this.linkTabs();
    }
    if (changed.has('gesturesDisabled') && this.gesturesDisabled) {
      this.swipe.cancel();
    }
  }

  protected override firstUpdated() {
    // The tabs may be upgraded or rendered after these panels connected.
    this.linkTabs();
    this.sync();
  }

  protected override render() {
    return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
  }

  private readonly handleSlotChange = () => {
    // Panels that left the slot keep no slide state.
    const panels = new Set(this.panels);
    for (const panel of this.visiblePanels) {
      if (!panels.has(panel)) {
        this.visiblePanels.delete(panel);
        panel.inert = false;
        panel.style.removeProperty(TAB_PANEL_OFFSET_PROPERTY);
      }
    }
    this.linkTabs();
    this.sync();
  };

  /** The `for` tabs, else the previous sibling when it is a tablist. */
  private resolveTabs(): AriaTablistElement | null {
    if (this.htmlFor) {
      const root = this.getRootNode() as Document | ShadowRoot;
      const el = root.getElementById?.(this.htmlFor);
      return el instanceof AriaTablistElement ? el : null;
    }
    const previous = this.previousElementSibling;
    return previous instanceof AriaTablistElement ? previous : null;
  }

  /** Links to the current tabs (`tabs`, `for` or previous sibling). */
  private linkTabs() {
    if (!this.isConnected) {
      return;
    }
    this.observeTabs(this.tabs);
  }

  private observeTabs(tabs: AriaTablistElement | null) {
    if (tabs === this.linkedTabs) {
      return;
    }
    if (this.linkedTabs) {
      this.linkedTabs.removeEventListener('change', this.handleTabsChange);
      this.tabsObserver?.disconnect();
      this.tabsObserver = null;
    }
    this.linkedTabs = tabs;
    if (!tabs) {
      return;
    }
    tabs.addEventListener('change', this.handleTabsChange);
    // Programmatic selection (`selectedTabIndex`, `selected`) fires no event;
    // the tabs reflect it to the `selected` attribute.
    this.tabsObserver = new MutationObserver(() => {
      this.sync();
    });
    this.tabsObserver.observe(tabs, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['selected', 'aria-selected'],
    });
    tabs.updateComplete.then(() => {
      if (this.linkedTabs !== tabs) return;
      // The tabs' initial selection (e.g. a `selectedTabIndex` binding
      // applied after their first render) shows without a slide.
      if (!this.sliding && this.dragPosition === null) {
        this.index = -1;
      }
      this.sync();
    });
    this.sync();
  }

  private readonly handleTabsChange = () => {
    this.sync();
  };

  /** The tab elements of the linked tabs. */
  private get tabElements(): HTMLElement[] {
    return this.linkedTabs?.tabs ?? [];
  }

  /** Sets `aria-controls` on each tab and `aria-labelledby` on its panel. */
  private linkAria(tabs: HTMLElement[], panels: HTMLElement[]) {
    const count = Math.min(tabs.length, panels.length);
    for (let i = 0; i < count; i++) {
      const tab = tabs[i];
      const panel = panels[i];
      if ('tabpanelElement' in tab) {
        // AriaTabElement: `aria-controls` through ElementInternals. The
        // tablist also uses it to hide the panels of unselected tabs.
        (tab as {tabpanelElement: Element | null}).tabpanelElement = panel;
      } else if (tab.getAttribute('aria-controls') !== panel.id) {
        tab.setAttribute('aria-controls', ensureId(panel, 'md-gb-tab-panel'));
      }
      if ('tabElement' in panel) {
        // AriaTabpanelElement: `aria-labelledby` through ElementInternals.
        (panel as {tabElement: Element | null}).tabElement = tab;
      } else if (panel.getAttribute('aria-labelledby') !== tab.id) {
        panel.setAttribute('aria-labelledby', ensureId(tab, 'md-gb-tab'));
      }
    }
  }

  /**
   * Brings the panels in line with the selection: links ARIA, slides to a
   * newly selected panel, and re-applies panel visibility.
   */
  private sync() {
    if (isServer) return;
    const panels = this.panels;
    const linked = this.linkedTabs;
    if (linked) {
      this.linkAria(this.tabElements, panels);
    }
    const selected = linked ? linked.selectedTabIndex : this.standaloneIndex;
    const target = Math.min(Math.max(selected, -1), panels.length - 1);
    if (this.index < 0 || !this.hasUpdated || target < 0) {
      // First sync (or nothing to show): no slide.
      this.index = target;
      this.finishSlide();
      return;
    }
    if (target !== this.index) {
      if (this.dragPosition !== null) {
        // The selection changed mid-drag (a tab click): drop the drag.
        this.swipe.cancel();
      }
      this.slideTo(target);
      return;
    }
    this.applyVisibility();
  }

  /** Shows the active and sliding panels; hides the rest from everyone. */
  private applyVisibility() {
    const active = this.activePanel;
    for (const panel of this.panels) {
      const visible = panel === active || this.visiblePanels.has(panel);
      if (panel.hidden === visible) {
        panel.hidden = !visible;
      }
      const inert = visible && panel !== active;
      if (panel.inert !== inert) {
        panel.inert = inert;
      }
    }
  }

  private setOffset(panel: HTMLElement, offset: number) {
    panel.style.setProperty(TAB_PANEL_OFFSET_PROPERTY, String(offset));
  }

  /** The slide duration in ms (0 with reduced motion). */
  private get slideDuration(): number {
    if (isReducedMotion(this)) {
      return 0;
    }
    return (
      parseDuration(
        getComputedStyle(this).getPropertyValue('--transition-duration'),
      ) ?? 0
    );
  }

  /**
   * Slides from the active panel to `target` (a tab selection). The outgoing
   * panel leaves toward the side opposite the incoming one, which enters
   * from the side of its index, as in a lateral transition between peers.
   */
  private slideTo(target: number) {
    const panels = this.panels;
    const from = panels[this.index] ?? null;
    const to = panels[target] ?? null;
    const side = Math.sign(target - this.index);
    this.index = target;
    if (!from || !to || this.slideDuration === 0) {
      this.finishSlide();
      return;
    }
    // Place the panels at their start positions without a transition.
    this.clearSlide();
    this.visiblePanels.add(from);
    updateClassList(this, {[TAB_PANELS_CLASSES.instant]: true});
    this.applyVisibility();
    this.setOffset(from, 0);
    this.setOffset(to, side);
    // Commit the start positions before transitioning from them.
    this.getBoundingClientRect();
    updateClassList(this, {[TAB_PANELS_CLASSES.instant]: false});
    this.setOffset(from, -side);
    this.setOffset(to, 0);
    this.waitForSlide();
  }

  /**
   * Settles the on-screen panels at the active one from where they are,
   * after a drag.
   */
  private settle() {
    const panels = this.panels;
    if (this.slideDuration === 0) {
      this.finishSlide();
      return;
    }
    for (const panel of this.visiblePanels) {
      this.setOffset(panel, panels.indexOf(panel) - this.index);
    }
    const active = this.activePanel;
    if (active) {
      this.setOffset(active, 0);
    }
    this.applyVisibility();
    this.waitForSlide();
  }

  /** Finishes the slide when the active panel's transition ends. */
  private waitForSlide() {
    this.sliding = true;
    if (this.slideTimer !== null) {
      clearTimeout(this.slideTimer);
    }
    this.slideTimer = setTimeout(() => {
      this.finishSlide();
    }, this.slideDuration + FINISH_FALLBACK_MS);
  }

  private readonly handleTransitionEnd = (event: TransitionEvent) => {
    if (
      this.sliding &&
      event.propertyName === 'translate' &&
      event.target === this.activePanel
    ) {
      this.finishSlide();
    }
  };

  /** Stops a slide's bookkeeping, keeping the panels where they are. */
  private clearSlide() {
    if (this.slideTimer !== null) {
      clearTimeout(this.slideTimer);
      this.slideTimer = null;
    }
    this.sliding = false;
    this.dragPosition = null;
    for (const panel of this.visiblePanels) {
      panel.style.removeProperty(TAB_PANEL_OFFSET_PROPERTY);
    }
    this.visiblePanels.clear();
  }

  /** Ends any slide: only the active panel is shown, at rest. */
  private finishSlide() {
    this.clearSlide();
    this.activePanel?.style.removeProperty(TAB_PANEL_OFFSET_PROPERTY);
    updateClassList(this, {
      [TAB_PANELS_CLASSES.instant]: false,
      [TAB_PANELS_CLASSES.dragging]: false,
    });
    this.applyVisibility();
  }

  private startDrag() {
    this.finishSlide();
    this.dragWidth = this.clientWidth;
    this.dragPosition = this.index;
    updateClassList(this, {[TAB_PANELS_CLASSES.dragging]: true});
    const panels = this.panels;
    for (const neighbor of [panels[this.index - 1], panels[this.index + 1]]) {
      if (neighbor) {
        this.visiblePanels.add(neighbor);
      }
    }
    this.applyVisibility();
    this.positionDrag();
  }

  /**
   * Swiping between panels: a drag along the reading direction moves the
   * panels with the pointer, and settles at a panel on release (shared
   * DragSettleController; Compose pager snapping: a fling faster than the
   * velocity threshold moves to the next panel in its direction, otherwise
   * the nearer panel past the positional threshold). The anchors are the
   * active panel and its neighbors in px; a drag moves at most one panel and
   * not past the first or last one (pager `pagerSnapDistance` of one page,
   * no overscroll). The panel position grows against the pointer in the
   * reading direction.
   */
  // spec: tabs-79df51, tabs-52e127, tabs-fd3bbd
  private readonly swipe = new DragSettleController(this, {
    axis: 'x',
    target: () => this,
    anchors: () => {
      const width = this.clientWidth || 1;
      const last = this.panels.length - 1;
      return [this.index - 1, this.index, this.index + 1]
        .filter((i) => i >= 0 && i <= last)
        .map((i) => i * width);
    },
    value: () => this.index * (this.clientWidth || 1),
    reverse: () => getComputedStyle(this).direction !== 'rtl',
    velocityThreshold: TAB_PANELS_VELOCITY_THRESHOLD_PX_PER_S,
    positionalThreshold: (distance) =>
      distance * TAB_PANELS_POSITIONAL_THRESHOLD,
    disabled: () =>
      this.gesturesDisabled || this.panels.length < 2 || this.index < 0,
    canStart: (event) => !isEditablePath(event.composedPath()),
    onDragStart: () => this.startDrag(),
    onDrag: (offset) => {
      this.dragPosition = offset / (this.dragWidth || 1);
      this.positionDrag();
    },
    // The release velocity carries into a spring that moves the panels, which
    // stay in their drag state (no CSS transition) until it rests. A slide
    // that starts meanwhile (a tab click) clears `dragPosition` and takes over.
    onFrame: (position) => {
      if (this.dragPosition === null) return;
      this.dragPosition = position / (this.dragWidth || 1);
      this.positionDrag();
    },
    onSettled: () => {
      if (this.dragPosition === null) return;
      this.dragPosition = null;
      this.finishSlide();
    },
    onSettle: (anchor) => this.endDrag(Math.round(anchor / (this.dragWidth || 1))),
    onCancel: () => this.cancelDrag(),
  });

  private positionDrag() {
    const position = this.dragPosition ?? this.index;
    const panels = this.panels;
    const active = this.activePanel;
    for (const panel of [active, ...this.visiblePanels]) {
      if (panel) {
        this.setOffset(panel, panels.indexOf(panel) - position);
      }
    }
  }

  /**
   * Applies the panel a released drag settles at; the spring then moves the
   * panels there (`onFrame`) and `onSettled` ends the slide.
   */
  private endDrag(target: number) {
    const changed = target !== this.index;
    // The panel the drag started at stays on screen while it settles away.
    const previous = this.activePanel;
    if (previous) {
      this.visiblePanels.add(previous);
    }
    this.index = target;
    this.applyVisibility();
    if (changed) {
      this.selectFromSwipe(target);
    }
  }

  private cancelDrag() {
    this.dragPosition = null;
    updateClassList(this, {[TAB_PANELS_CLASSES.dragging]: false});
    if (this.isConnected) {
      this.settle();
    }
  }

  /**
   * Selects the tab of a panel a swipe settled at, as a click on it would:
   * the tabs update their selection and indicator and fire `change`.
   */
  private selectFromSwipe(index: number) {
    const linked = this.linkedTabs;
    if (!linked) {
      this.standaloneIndex = index;
      this.dispatchEvent(new Event('change', {bubbles: true}));
      return;
    }
    linked.selectedTabIndex = index;
    // The tablist hides the previous tab's panel; keep it on screen until
    // the settle ends.
    this.applyVisibility();
    const tab = this.tabElements[index];
    tab?.scrollIntoView?.({block: 'nearest', inline: 'nearest'});
    linked.dispatchEvent(new Event('change', {bubbles: true}));
  }
}
