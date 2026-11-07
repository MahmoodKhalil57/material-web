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
  type PropertyValues,
} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {
  type WindowHeightClass,
  WindowSizeClassController,
  type WindowSizeClass,
} from '../../styles/layout/window-size-class.js';
import {
  type ActiveNavigation,
  appScaffoldClasses,
  resolveNavigation,
  type ScaffoldNavigation,
  shouldExpandRail,
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
 * @slot fab - A FAB, 16px from the trailing and bottom edges of the content.
 * @slot snackbar - A snackbar host (`md-gb-snackbar`), above the FAB.
 * @csspart scaffold - The scaffold grid.
 * @csspart rail - The navigation rail region.
 * @csspart top-app-bar - The top app bar region.
 * @csspart body - The content region (content, FAB and snackbar).
 * @csspart content - The scrolling content container.
 * @csspart navigation-bar - The navigation bar region.
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
    `,
  ];

  /** Which navigation component to show. */
  @property({reflect: true}) navigation: ScaffoldNavigation = 'auto';

  /**
   * Whether to expand a slotted navigation rail at large and extra-large
   * windows and collapse it below (spec: breakpoints, swapping components).
   * Applied when the window size class changes.
   */
  @property({type: Boolean, attribute: 'auto-expand-rail', reflect: true})
  autoExpandRail = false;

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
  @state() private contentPaneCount = 1;
  @state() private railInlineSize = 0;

  @query('.app-scaffold-rail') private readonly railRegion!: HTMLElement | null;
  @query('slot[name="navigation-rail"]')
  private readonly railSlot!: HTMLSlotElement | null;

  private active: ActiveNavigation = 'none';
  private lastActive: ActiveNavigation | null = null;
  private railObserver: ResizeObserver | null = null;

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
    const region = this.railRegion;
    if (!region) return;
    this.railObserver = new ResizeObserver(() => {
      const width = region.getBoundingClientRect().width;
      if (width !== this.railInlineSize) this.railInlineSize = width;
    });
    this.railObserver.observe(region);
  }

  private readonly handlePaneLayoutChange = (event: Event) => {
    const {paneCount} = (event as CustomEvent<PaneLayoutChangeDetail>).detail;
    this.contentPaneCount = paneCount;
  };

  private syncRailExpanded(windowClass: WindowSizeClass) {
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
        break;
      case 'fab':
        this.hasFab = has;
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
    const rail = this.active === 'rail';
    const bodyStyle = {
      '--md-gb-scaffold-nav-inline-size': `${rail ? this.railInlineSize : 0}px`,
    };
    return html`
      <div
        part="scaffold"
        class=${classMap(appScaffoldClasses({navigation: this.active}))}>
        <div class="app-scaffold-rail" part="rail" ?hidden=${!rail}>
          <slot
            name="navigation-rail"
            @slotchange=${this.handleSlotChange}></slot>
        </div>
        <div class="app-scaffold-top" part="top-app-bar">
          <slot name="top-app-bar"></slot>
        </div>
        <div class="app-scaffold-body" part="body" style=${styleMap(bodyStyle)}>
          <div class="app-scaffold-content" part="content">
            <slot></slot>
          </div>
          <div class="app-scaffold-overlay">
            <div class="app-scaffold-snackbar">
              <slot name="snackbar"></slot>
            </div>
            <div class="app-scaffold-fab" ?hidden=${!this.hasFab}>
              <slot name="fab" @slotchange=${this.handleSlotChange}></slot>
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
