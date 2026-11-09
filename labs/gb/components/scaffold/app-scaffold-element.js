/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, LitElement, } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { isWindowSizeClassAtLeast, WindowSizeClassController, } from '../../styles/layout/window-size-class.js';
import { appScaffoldClasses, resolveNavigation, shouldExpandRail, } from './app-scaffold.js';
import appScaffoldStyles from './app-scaffold.css.js'; // github-only
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
    constructor() {
        super(...arguments);
        /** Which navigation component to show. */
        this.navigation = 'auto';
        /**
         * Whether to expand a slotted navigation rail at large and extra-large
         * windows and collapse it below (spec: breakpoints, swapping components).
         * Applied when the window size class changes.
         */
        this.autoExpandRail = false;
        /**
         * What the navigation rail does while a side sheet is present (spec:
         * breakpoints and scaffold): `keep` it as is, `collapse` it to the
         * collapsed rail, or `hide` it completely. A side sheet is present while
         * the nested pane scaffold shows its tertiary pane or `side-sheet-open`
         * is set.
         */
        this.sideSheetNavigation = 'keep';
        /** Whether an app-managed side sheet is open. */
        this.sideSheetOpen = false;
        this.hasBar = false;
        this.hasRail = false;
        this.hasFab = false;
        this.hasToolbar = false;
        this.contentPaneCount = 1;
        this.paneSideSheet = false;
        this.active = 'none';
        this.lastActive = null;
        this.railObserver = null;
        /** Rails collapsed for a side sheet, with their previous state. */
        this.collapsedForSheet = new Map();
        this.size = new WindowSizeClassController(this, {
            onChange: (windowClass, previous) => {
                if (this.autoExpandRail)
                    this.syncRailExpanded(windowClass);
                this.dispatchEvent(new CustomEvent('window-class-change', {
                    bubbles: true,
                    composed: true,
                    detail: { windowClass, previous },
                }));
            },
            onHeightChange: (windowHeightClass, previous) => {
                this.dispatchEvent(new CustomEvent('window-height-class-change', {
                    bubbles: true,
                    composed: true,
                    detail: { windowHeightClass, previous },
                }));
            },
        });
        this.handlePaneLayoutChange = (event) => {
            const { paneCount, visiblePanes } = event.detail;
            this.contentPaneCount = paneCount;
            this.paneSideSheet = visiblePanes.includes('tertiary');
        };
    }
    /** The current window size class (read-only, reflected). */
    get windowClass() {
        return this.size.value;
    }
    /** The current window height size class (read-only, reflected). */
    get windowHeightClass() {
        return this.size.height;
    }
    /** The navigation component currently shown (read-only, reflected). */
    get activeNavigation() {
        return this.active;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('pane-layout-change', this.handlePaneLayoutChange);
        if (this.hasUpdated)
            this.observeRail();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('pane-layout-change', this.handlePaneLayoutChange);
        this.railObserver?.disconnect();
        this.railObserver = null;
    }
    firstUpdated() {
        this.observeRail();
    }
    observeRail() {
        this.railObserver?.disconnect();
        this.railObserver = new ResizeObserver(() => this.measureRegions());
        for (const region of [this.railRegion, this.companionRegion]) {
            if (region)
                this.railObserver.observe(region);
        }
        this.measureRegions();
    }
    /**
     * Tells a nested pane scaffold how much space the rails take on each side
     * (it keeps a split-pane spacer centered in the window).
     */
    measureRegions() {
        const body = this.bodyRegion;
        if (!body)
            return;
        const width = (region) => region && !region.hidden ? region.getBoundingClientRect().width : 0;
        body.style.setProperty('--md-gb-scaffold-nav-inline-size', `${width(this.railRegion)}px`);
        body.style.setProperty('--md-gb-scaffold-companion-inline-size', `${width(this.companionRegion)}px`);
    }
    get sideSheetPresent() {
        return this.sideSheetOpen || this.paneSideSheet;
    }
    /** Collapses the slotted rails for a side sheet, and restores them. */
    syncRailForSideSheet() {
        const collapse = this.sideSheetPresent && this.sideSheetNavigation === 'collapse';
        const rails = (this.railSlot?.assignedElements({ flatten: true }) ?? []).filter((el) => 'expanded' in el);
        if (collapse) {
            for (const rail of rails) {
                if (!this.collapsedForSheet.has(rail)) {
                    this.collapsedForSheet.set(rail, rail.expanded);
                    rail.expanded = false;
                }
            }
        }
        else {
            for (const [rail, expanded] of this.collapsedForSheet) {
                rail.expanded = expanded;
            }
            this.collapsedForSheet.clear();
        }
    }
    syncRailExpanded(windowClass) {
        if (this.collapsedForSheet.size > 0)
            return;
        const expanded = shouldExpandRail(windowClass);
        for (const el of this.railSlot?.assignedElements({ flatten: true }) ?? []) {
            if ('expanded' in el) {
                el.expanded = expanded;
            }
        }
    }
    handleSlotChange(event) {
        const slot = event.target;
        const has = slot.assignedElements({ flatten: true }).length > 0;
        switch (slot.name) {
            case 'navigation-bar':
                this.hasBar = has;
                break;
            case 'navigation-rail':
                this.hasRail = has;
                if (has && this.autoExpandRail)
                    this.syncRailExpanded(this.size.value);
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
    willUpdate(changed) {
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
    updated() {
        this.measureRegions();
        this.syncRailForSideSheet();
        if (this.active !== this.lastActive) {
            this.lastActive = this.active;
            this.dispatchEvent(new CustomEvent('navigation-change', {
                bubbles: true,
                composed: true,
                detail: { navigation: this.active },
            }));
        }
    }
    render() {
        const rail = this.active === 'rail' &&
            !(this.sideSheetPresent && this.sideSheetNavigation === 'hide');
        const companion = isWindowSizeClassAtLeast(this.size.value, 'large');
        return html `
      <div
        part="scaffold"
        class=${classMap(appScaffoldClasses({ navigation: this.active }))}>
        <div class="app-scaffold-rail" part="rail" ?hidden=${!rail}>
          <slot
            name="navigation-rail"
            @slotchange=${this.handleSlotChange}></slot>
        </div>
        <div
          class="app-scaffold-companion"
          part="companion-rail"
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
/** @nocollapse */
AppScaffoldElement.styles = [
    appScaffoldStyles,
    css `
      :host {
        display: block;
        block-size: 100%;
      }

      :host([hidden]) {
        display: none;
      }
    `,
];
__decorate([
    property({ reflect: true })
], AppScaffoldElement.prototype, "navigation", void 0);
__decorate([
    property({ type: Boolean, attribute: 'auto-expand-rail', reflect: true })
], AppScaffoldElement.prototype, "autoExpandRail", void 0);
__decorate([
    property({ attribute: 'side-sheet-navigation', reflect: true })
], AppScaffoldElement.prototype, "sideSheetNavigation", void 0);
__decorate([
    property({ type: Boolean, attribute: 'side-sheet-open', reflect: true })
], AppScaffoldElement.prototype, "sideSheetOpen", void 0);
__decorate([
    state()
], AppScaffoldElement.prototype, "hasBar", void 0);
__decorate([
    state()
], AppScaffoldElement.prototype, "hasRail", void 0);
__decorate([
    state()
], AppScaffoldElement.prototype, "hasFab", void 0);
__decorate([
    state()
], AppScaffoldElement.prototype, "hasToolbar", void 0);
__decorate([
    state()
], AppScaffoldElement.prototype, "contentPaneCount", void 0);
__decorate([
    state()
], AppScaffoldElement.prototype, "paneSideSheet", void 0);
__decorate([
    query('.app-scaffold-rail')
], AppScaffoldElement.prototype, "railRegion", void 0);
__decorate([
    query('.app-scaffold-companion')
], AppScaffoldElement.prototype, "companionRegion", void 0);
__decorate([
    query('.app-scaffold-body')
], AppScaffoldElement.prototype, "bodyRegion", void 0);
__decorate([
    query('slot[name="navigation-rail"]')
], AppScaffoldElement.prototype, "railSlot", void 0);
//# sourceMappingURL=app-scaffold-element.js.map