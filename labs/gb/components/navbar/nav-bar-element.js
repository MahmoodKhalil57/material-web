/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { AriaTablistElement } from '../../../aria/tabs/tablist.js';
import { internals } from '../../../behaviors/element-internals.js';
import { adoptStyles } from '../../styles/adopt-styles.js';
import { hasLinkItems, NAV_LINK_CHANGE } from '../shared/nav-link.js';
import { ScrollBehaviorController } from '../shared/scroll-behavior.js';
import { SelectionController } from '../shared/selection.js';
import navBarStyles from './nav-bar.css' with { type: 'css' }; // github-only
// import {styles as navBarStyles} from './nav-bar.cssresult.js'; // google3-only
import { MEDIUM_WINDOW_QUERY, navBar, } from './nav-bar.js';
import { NavBarItemElement } from './nav-bar-item-element.js';
/**
 * A Material Design gBreeze navigation bar component.
 *
 * Scroll behavior (navigation-bar.md): `scroll-behavior="hide"` hides the bar
 * when the page scrolls down and reveals it when scrolling up;
 * `scroll-target` is the id of the scrolling element (default: the window).
 * Make the bar fixed or sticky at the bottom of the page.
 *
 * @slot - Used to display navigation bar items (`md-gb-nav-bar-item`).
 * @csspart nav-bar - The navigation bar's root container.
 * @fires {Event} change - Fired when the selected navigation bar item changes. --bubbles
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height
 * @cssprop --container-shadow-color
 * @cssprop --container-shape
 * @cssprop --item-active-icon-color
 * @cssprop --item-active-indicator-color
 * @cssprop --item-active-indicator-height
 * @cssprop --item-active-indicator-icon-label-space
 * @cssprop --item-active-indicator-leading-space
 * @cssprop --item-active-indicator-shape
 * @cssprop --item-active-indicator-trailing-space
 * @cssprop --item-active-indicator-width
 * @cssprop --item-active-label-text-color
 * @cssprop --item-active-state-layer-color
 * @cssprop --item-between-space
 * @cssprop --item-container-between-space
 * @cssprop --item-icon-size
 * @cssprop --item-inactive-icon-color
 * @cssprop --item-inactive-label-text-color
 * @cssprop --item-inactive-state-layer-color
 * @cssprop --item-label-text
 * @cssprop --item-label-text-axes
 * @cssprop --item-label-text-tracking
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 */
// spec-labels: navigation-bar/specs/variants, navigation-bar/specs/configurations
export class NavBarElement extends AriaTablistElement {
    constructor() {
        super(...arguments);
        /**
         * The layout orientation of items: `vertical`, `horizontal`, or `auto`
         * (vertical in compact windows, horizontal from medium windows, 600px).
         */
        this.itemLayout = 'vertical';
        /** The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. */
        this.scrollTarget = '';
        /**
         * Hides and reveals the bar on scroll.
         *
         * Accessibility: "Don't hide the navigation bar on scroll when a screen
         * reader is active" (navigation-bar-791f1a). A web page cannot detect a
         * screen reader, so the bar errs on the side of staying: it never hides
         * while focus is inside it, and never when the page scrolls because of a
         * key press (`keyboardKeepsVisible`: screen reader and switch users move
         * with the keyboard), so only wheel, touch, pointer and programmatic
         * scrolling hide it. Focus moving into a hidden bar reveals it. An app can
         * also keep it visible for good by not setting `scroll-behavior`.
         */
        this.scrollController = new ScrollBehaviorController(this, {
            behavior: () => this.scrollBehavior,
            target: () => this.scrollTarget,
            hiddenTransform: 'translateY(100%)',
            keyboardKeepsVisible: true,
        });
        /**
         * The selection model (shared SelectionController): exactly one tab is
         * selected, by click or Space/Enter (the tab turns the key into a click),
         * with a `change` event for user changes. The controller selects during
         * the click, so the tab list's own click handling finds the tab already
         * selected and does nothing.
         */
        // spec: navigation-bar/accessibility/keyboard-navigation
        this.selectionModel = new SelectionController(this, {
            items: () => this.tabs,
            mode: () => 'single',
            required: () => true,
            // The tab list selects the first tab when its tabs change.
            autoSelectFirst: false,
            isSelected: (tab) => this.isTabSelected(tab),
            setSelected: (tab, selected) => this.setTabSelected(tab, selected),
            events: ['change'],
            vetoable: false,
        });
        this.mediumWindow = false;
        this.itemCount = 0;
        this.onMediaChange = () => {
            this.mediumWindow = Boolean(this.mediaQuery?.matches);
        };
        /**
         * Destinations that are links make the bar a navigation landmark of links;
         * a tab list can only hold tabs. Without links it stays a tab list.
         */
        this.syncRole = () => {
            const state = this[internals];
            if (hasLinkItems(this.tabs)) {
                state.role = 'navigation';
                state.ariaOrientation = null;
            }
            else {
                state.role = 'tablist';
                state.ariaOrientation = this.orientation;
            }
        };
    }
    /** The item layout in use (`auto` resolved for the window width). */
    get resolvedItemLayout() {
        if (this.itemLayout === 'auto') {
            return this.mediumWindow ? 'horizontal' : 'vertical';
        }
        return this.itemLayout === 'horizontal' ? 'horizontal' : 'vertical';
    }
    /**
     * The 0-based index of the currently active navigation bar item.
     * Alias for `selectedTabIndex`.
     */
    get selectedIndex() {
        return this.selectedTabIndex;
    }
    set selectedIndex(index) {
        this.selectedTabIndex = index;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener(NAV_LINK_CHANGE, this.syncRole);
        adoptStyles(this, navBarStyles);
        this.mediaQuery = window.matchMedia?.(MEDIUM_WINDOW_QUERY);
        this.mediaQuery?.addEventListener('change', this.onMediaChange);
        this.onMediaChange();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener(NAV_LINK_CHANGE, this.syncRole);
        this.mediaQuery?.removeEventListener('change', this.onMediaChange);
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('itemLayout') ||
            changedProperties.has('mediumWindow')) {
            this.syncItemsLayout();
        }
    }
    render() {
        return html `
      <div
        part="nav-bar"
        class="${navBar({
            itemLayout: this.resolvedItemLayout,
        })}"
        style="--_nav-bar-items: ${this.itemCount || 1}">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
    }
    handleSlotChange() {
        super.handleSlotChange();
        this.syncRole();
        this.itemCount = this.tabs.length;
        this.syncItemsLayout();
    }
    syncItemsLayout() {
        const layout = this.resolvedItemLayout;
        for (const tab of this.tabs) {
            if (tab instanceof NavBarItemElement) {
                tab.itemLayout = layout;
            }
            else {
                tab.setAttribute('item-layout', layout);
            }
        }
    }
}
/** @nocollapse */
NavBarElement.styles = [
    navBarStyles,
    css `
      :host {
        display: flex;
        width: 100%;
      }
    `,
];
__decorate([
    property({ attribute: 'item-layout', reflect: true })
], NavBarElement.prototype, "itemLayout", void 0);
__decorate([
    property({ attribute: 'scroll-behavior', reflect: true })
], NavBarElement.prototype, "scrollBehavior", void 0);
__decorate([
    property({ attribute: 'scroll-target' })
], NavBarElement.prototype, "scrollTarget", void 0);
__decorate([
    state()
], NavBarElement.prototype, "mediumWindow", void 0);
__decorate([
    state()
], NavBarElement.prototype, "itemCount", void 0);
__decorate([
    property({ type: Number, attribute: 'selected-index', noAccessor: true })
], NavBarElement.prototype, "selectedIndex", null);
//# sourceMappingURL=nav-bar-element.js.map