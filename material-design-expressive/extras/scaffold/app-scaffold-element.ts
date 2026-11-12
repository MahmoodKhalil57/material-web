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
import {classMap} from 'lit/directives/class-map.js';
import {
  isWindowSizeClassAtLeast,
  type WindowHeightClass,
  WindowSizeClassController,
  type WindowSizeClass,
} from '../../foundations/layout/window-size-class.js';
import {
  type ActiveNavigation,
  appScaffoldClasses,
  resolveNavigation,
  type ScaffoldNavigation,
  shouldExpandRail,
  type SideSheetNavigation,
} from './app-scaffold.js';
import {
  type PaneLayoutChangeDetail,
  type WindowClassChangeDetail,
  type WindowHeightClassChangeDetail,
} from './pane-scaffold-element.js';

import appScaffoldStyles from './app-scaffold.css' with {type: 'css'}; // github-only
// import appScaffoldStyles from './app-scaffold.cssresult.js'; // google3-only

/** Detail of the `navigation-change` event. */
export interface NavigationChangeDetail {
  navigation: ActiveNavigation;
}

// spec-labels: layout-breakpoints/expanded/navigation, layout-breakpoints/medium/panes/two-pane-layout,
// spec-labels: layout-breakpoints/large-extra-large/navigation, layout-breakpoints/medium/navigation
/**
 * A Material Design app scaffold: the bars and rails around an app's
 * content (spec: foundations/layout/scaffold). It measures its own width as
 * the window, reflects the window size class as `window-class` (and the
 * window height size class as `window-height-class`), and swaps the
 * navigation component per the spec's breakpoints: a navigation bar at
 * compact, a navigation rail at medium and larger (a bar at medium when a
 * nested `md-gb-pane-scaffold` shows two panes, unless the window height
 * is compact).
 *
 * Provide both a `md-gb-nav-bar` and a `md-gb-nav-rail` with the same
 * destinations, and keep their selection in sync; only one is shown.
 *
 * @slot - The content, typically an `md-gb-pane-scaffold`. Scrolls.
 * @slot top-app-bar - A top app bar (`md-gb-app-bar`), beside the rail.
 * @slot navigation-bar - A navigation bar (`md-gb-nav-bar`) at the bottom.
 * @slot navigation-rail - A navigation rail (`md-gb-nav-rail`) at the
 *     leading edge.
 * @slot companion-rail - A companion rail on the trailing side of large
 *     and extra-large windows, holding supporting controls or actions that
 *     modify or relate to the content in a pane.
 * @slot toolbar - A toolbar floating in the bottom rail region, centered
 *     above the navigation bar (mobile).
 * @slot fab - A FAB, 16px from the trailing and bottom edges of the content.
 * @slot snackbar - A snackbar host (`md-gb-snackbar`), above the FAB.
 * @csspart scaffold - The scaffold grid.
 * @csspart rail - The navigation rail region.
 * @csspart companion-rail - The companion rail region.
 * @csspart toolbar - The floating toolbar region.
 * @csspart top-app-bar - The top app bar region.
 * @csspart body - The content region (content, FAB and snackbar).
 * @csspart content - The scrolling content container.
 * @cssprop --scrollbar-gutter - `stable` reserves the content's scrollbar
 *     gutter, so a scrollbar that appears doesn't move the content (default
 *     `auto`: the pane widths are measured to the edges).
 * @csspart navigation-bar - The navigation bar region.
 * @cssprop --md-gb-scaffold-content-block-size - Set by the scaffold on its
 *     content (read it, don't set it): the visible height (px) of the
 *     scrolling content region, for content that stays in view as it
 *     scrolls, such as a `sticky` `md-gb-nav-rail` beside the panes.
 * @cssprop --container-color - Scaffold background.
 * @cssprop --content-color - Scaffold content color.
 * @fires {CustomEvent<WindowClassChangeDetail>} window-class-change - Fired
 *     when the window size class changes. --bubbles --composed
 * @fires {CustomEvent<WindowHeightClassChangeDetail>} window-height-class-change
 *     - Fired when the window height size class changes. --bubbles --composed
 * @fires {CustomEvent<NavigationChangeDetail>} navigation-change - Fired when
 *     the shown navigation component changes. --bubbles --composed
 */
export class AppScaffoldElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    appScaffoldStyles,
    css`
      :host {
        display: block;
        block-size: 100%;
      }

      :host([hidden]) {
        display: none;
      }

      /* The app's root layout: the window, whatever the page's own margins. */
      :host([fullscreen]) {
        position: fixed;
        inset: 0;
        block-size: auto;
      }
    `,
  ];

  /**
   * Whether the scaffold is the app's root layout and fills the window (the
   * viewport, past the body's margins), so a page needs no styles of its own
   * to lay out its bars, rails and content.
   */
  @property({type: Boolean, reflect: true}) fullscreen = false;

  /** Which navigation component to show. */
  @property({reflect: true}) navigation: ScaffoldNavigation = 'auto';

  /**
   * Whether to expand a slotted navigation rail at large and extra-large
   * windows and collapse it below (spec: breakpoints, swapping components).
   * Applied when the window size class changes.
   */
  @property({type: Boolean, attribute: 'auto-expand-rail', reflect: true})
  autoExpandRail = false;

  /**
   * What the navigation rail does while a side sheet is present (spec:
   * breakpoints and scaffold): `keep` it as is, `collapse` it to the
   * collapsed rail, or `hide` it completely. A side sheet is present while
   * the nested pane scaffold shows its tertiary pane or `side-sheet-open`
   * is set.
   */
  @property({attribute: 'side-sheet-navigation', reflect: true})
  sideSheetNavigation: SideSheetNavigation = 'keep';

  /**
   * The width (px) of the companion rail region; 0 (default) sizes it to
   * its content. A fixed width keeps the content beside it at the same
   * width from page to page, whatever the rail holds (an outline of
   * longer or shorter headings).
   */
  @property({type: Number, attribute: 'companion-width'}) companionWidth = 0;

  /** Whether an app-managed side sheet is open. */
  @property({type: Boolean, attribute: 'side-sheet-open', reflect: true})
  sideSheetOpen = false;

  /** The current window size class (read-only, reflected). */
  get windowClass(): WindowSizeClass {
    return this.size.value;
  }

  /** The current window height size class (read-only, reflected). */
  get windowHeightClass(): WindowHeightClass {
    return this.size.height;
  }

  /** The navigation component currently shown (read-only, reflected). */
  get activeNavigation(): ActiveNavigation {
    return this.active;
  }

  @state() private hasBar = false;
  @state() private hasRail = false;
  @state() private hasFab = false;
  @state() private hasToolbar = false;
  @state() private contentPaneCount = 1;
  @state() private paneSideSheet = false;

  @query('.app-scaffold-rail') private readonly railRegion!: HTMLElement | null;
  @query('.app-scaffold-companion')
  private readonly companionRegion!: HTMLElement | null;
  @query('.app-scaffold-body') private readonly bodyRegion!: HTMLElement | null;
  @query('.app-scaffold-content')
  private readonly contentRegion!: HTMLElement | null;
  @query('slot[name="navigation-rail"]')
  private readonly railSlot!: HTMLSlotElement | null;

  private active: ActiveNavigation = 'none';
  private lastActive: ActiveNavigation | null = null;
  private railObserver: ResizeObserver | null = null;
  /** Rails collapsed for a side sheet, with their previous state. */
  private readonly collapsedForSheet = new Map<HTMLElement, boolean>();

  private readonly size = new WindowSizeClassController(this, {
    onChange: (windowClass, previous) => {
      if (this.autoExpandRail) this.syncRailExpanded(windowClass);
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
    this.addEventListener('pane-layout-change', this.handlePaneLayoutChange);
    if (this.hasUpdated) this.observeRail();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('pane-layout-change', this.handlePaneLayoutChange);
    this.railObserver?.disconnect();
    this.railObserver = null;
  }

  protected override firstUpdated() {
    this.observeRail();
  }

  private observeRail() {
    this.railObserver?.disconnect();
    this.railObserver = new ResizeObserver(() => this.measureRegions());
    for (const region of [this.railRegion, this.companionRegion, this.contentRegion]) {
      if (region) this.railObserver.observe(region);
    }
    this.measureRegions();
  }

  /**
   * Tells a nested pane scaffold how much space the rails take on each side
   * (it keeps a split-pane spacer centered in the window), and the content
   * how tall its visible region is (for a sticky rail). Measured on the
   * first update too, so the first frame already has the sizes.
   */
  private measureRegions() {
    const body = this.bodyRegion;
    if (!body) return;
    const width = (region: HTMLElement | null) =>
      region && !region.hidden ? region.getBoundingClientRect().width : 0;
    body.style.setProperty(
      '--md-gb-scaffold-nav-inline-size',
      `${width(this.railRegion)}px`,
    );
    body.style.setProperty(
      '--md-gb-scaffold-companion-inline-size',
      `${width(this.companionRegion)}px`,
    );
    if (this.contentRegion) {
      body.style.setProperty(
        '--md-gb-scaffold-content-block-size',
        `${this.contentRegion.clientHeight}px`,
      );
    }
  }

  private readonly handlePaneLayoutChange = (event: Event) => {
    const {paneCount, visiblePanes} = (
      event as CustomEvent<PaneLayoutChangeDetail>
    ).detail;
    this.contentPaneCount = paneCount;
    this.paneSideSheet = visiblePanes.includes('tertiary');
  };

  private get sideSheetPresent(): boolean {
    return this.sideSheetOpen || this.paneSideSheet;
  }

  /** Collapses the slotted rails for a side sheet, and restores them. */
  private syncRailForSideSheet() {
    const collapse =
      this.sideSheetPresent && this.sideSheetNavigation === 'collapse';
    const rails = (
      this.railSlot?.assignedElements({flatten: true}) ?? []
    ).filter((el): el is HTMLElement & {expanded: boolean} => 'expanded' in el);
    if (collapse) {
      for (const rail of rails) {
        if (!this.collapsedForSheet.has(rail)) {
          this.collapsedForSheet.set(rail, rail.expanded);
          rail.expanded = false;
        }
      }
    } else {
      for (const [rail, expanded] of this.collapsedForSheet) {
        (rail as HTMLElement & {expanded: boolean}).expanded = expanded;
      }
      this.collapsedForSheet.clear();
    }
  }

  private syncRailExpanded(windowClass: WindowSizeClass) {
    if (this.collapsedForSheet.size > 0) return;
    const expanded = shouldExpandRail(windowClass);
    for (const el of this.railSlot?.assignedElements({flatten: true}) ?? []) {
      if ('expanded' in el) {
        (el as HTMLElement & {expanded: boolean}).expanded = expanded;
      }
    }
  }

  private handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const has = slot.assignedElements({flatten: true}).length > 0;
    switch (slot.name) {
      case 'navigation-bar':
        this.hasBar = has;
        break;
      case 'navigation-rail':
        this.hasRail = has;
        if (has && this.autoExpandRail) this.syncRailExpanded(this.size.value);
        this.syncRailForSideSheet();
        break;
      case 'fab':
        this.hasFab = has;
        break;
      case 'toolbar':
        this.hasToolbar = has;
        break;
      default:
        break;
    }
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    this.active = resolveNavigation({
      navigation: this.navigation,
      windowClass: this.size.value,
      heightClass: this.size.height,
      paneCount: this.contentPaneCount,
      hasBar: this.hasBar,
      hasRail: this.hasRail,
    });
    if (this.getAttribute('window-class') !== this.size.value) {
      this.setAttribute('window-class', this.size.value);
    }
    if (this.getAttribute('window-height-class') !== this.size.height) {
      this.setAttribute('window-height-class', this.size.height);
    }
    this.setAttribute('active-navigation', this.active);
    if (changed.has('autoExpandRail') && this.autoExpandRail) {
      this.syncRailExpanded(this.size.value);
    }
  }

  protected override updated() {
    this.measureRegions();
    this.syncRailForSideSheet();
    if (this.active !== this.lastActive) {
      this.lastActive = this.active;
      this.dispatchEvent(
        new CustomEvent<NavigationChangeDetail>('navigation-change', {
          bubbles: true,
          composed: true,
          detail: {navigation: this.active},
        }),
      );
    }
  }

  protected override render() {
    const rail =
      this.active === 'rail' &&
      !(this.sideSheetPresent && this.sideSheetNavigation === 'hide');
    const companion = isWindowSizeClassAtLeast(this.size.value, 'large');
    return html`
      <div
        part="scaffold"
        class=${classMap(appScaffoldClasses({navigation: this.active}))}>
        <div class="app-scaffold-rail" part="rail" ?hidden=${!rail}>
          <slot
            name="navigation-rail"
            @slotchange=${this.handleSlotChange}></slot>
        </div>
        <div
          class="app-scaffold-companion"
          part="companion-rail"
          style=${this.companionWidth > 0 ? `inline-size: ${this.companionWidth}px` : nothing}
          ?hidden=${!companion}>
          <slot name="companion-rail"></slot>
        </div>
        <div class="app-scaffold-top" part="top-app-bar">
          <slot name="top-app-bar"></slot>
        </div>
        <div class="app-scaffold-body" part="body">
          <div class="app-scaffold-content" part="content">
            <slot></slot>
          </div>
          <div class="app-scaffold-overlay">
            <div class="app-scaffold-snackbar">
              <slot name="snackbar"></slot>
            </div>
            <div class="app-scaffold-bottom-rail">
              <div
                class="app-scaffold-toolbar"
                part="toolbar"
                ?hidden=${!this.hasToolbar}>
                <slot
                  name="toolbar"
                  @slotchange=${this.handleSlotChange}></slot>
              </div>
              <div class="app-scaffold-fab" ?hidden=${!this.hasFab}>
                <slot name="fab" @slotchange=${this.handleSlotChange}></slot>
              </div>
            </div>
          </div>
        </div>
        <div
          class="app-scaffold-bar"
          part="navigation-bar"
          ?hidden=${this.active !== 'bar'}>
          <slot
            name="navigation-bar"
            @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
  }
}
