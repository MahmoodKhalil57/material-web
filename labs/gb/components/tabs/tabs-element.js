/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { property } from 'lit/decorators.js';
import { AriaTablistElement } from '../../../aria/tabs/tablist.js';
import { adoptStyles } from '../../styles/adopt-styles.js';
import { AdaptiveController } from '../shared/adaptive.js';
import { clampDensity } from '../shared/density.js';
import { RovingFocusController } from '../shared/roving-focus.js';
import { ScrollBehaviorController } from '../shared/scroll-behavior.js';
import { SelectionController } from '../shared/selection.js';
import { updateClassList } from '../shared/update-class-list.js';
import tabsStyles from './tabs.css.js'; // github-only
// import tabsStyles from './tabs.cssresult.js'; // google3-only
import { setupTabs, tabsClasses } from './tabs.js';
/**
 * How far the first tab starts from the leading edge when the tabs scroll, in
 * CSS pixels. tabs.md, Anatomy: "Offset the first scrollable tab 52dp from the
 * leading edge so it's clear that more content is available".
 */
const SCROLL_START_OFFSET = 52;
/**
 * A Material Design tabs component.
 *
 * This is a reference implementation of the `.tabs` utility class. The same
 * class can be applied to any element with `role="tablist"`.
 *
 * @slot - Used to display `<md-gb-tab>` children.
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-height
 * @cssprop --active-indicator-inset
 * @cssprop --active-indicator-min-length
 * @cssprop --active-indicator-shape
 * @cssprop --container-color
 * @cssprop --container-height
 * @cssprop --density-step - Tab height removed per density step.
 * @cssprop --container-shape
 * @cssprop --divider-color
 * @cssprop --divider-thickness
 */
// spec-labels: tabs/specs/primary-tabs, tabs/specs/secondary-tabs, tabs/guidelines/anatomy, tabs/guidelines/usage, tabs/specs/measurements
export class TabsElement extends AriaTablistElement {
    /**
     * The density, from 0 (default) to -3. Each step down removes 4px from the
     * tabs' height (48px, or 64px with icon and label); values are clamped to
     * that range.
     *
     * tabs.md "Avoid applying density by default": dense tabs are below the
     * 48x48 CSS pixel target, so let people opt in (a denser layout or theme)
     * and keep the controls that change it at 48x48.
     */
    get density() {
        return this.densityValue;
    }
    set density(density) {
        const old = this.densityValue;
        this.densityValue = clampDensity(Number(density));
        this.requestUpdate('density', old);
    }
    constructor() {
        super();
        /**
         * The visual variant of the tabs.
         */
        this.variant = 'primary';
        this.densityValue = 0;
        /**
         * Where fixed tabs sit when the window is wider than compact: `center`
         * (default) or `start`, the leading edge. tabs.md, Responsive layout: "The
         * group of tabs should use a fluid margin and align to the center or leading
         * edge of the body region." At compact windows the tabs fill the full width.
         */
        this.align = 'center';
        /**
         * Scrollable tabs: each tab's width is defined by its label (tabs.md) rather
         * than every tab taking the width of the widest, and the bar scrolls when
         * they overflow. Fixed tabs (the default) are equal.
         */
        this.scrollable = false;
        /** Window size class of the viewport; fixed tabs fill only compact windows. */
        this.windowSize = new AdaptiveController(this, {
            target: () => window,
        });
        /** The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. */
        this.scrollTarget = '';
        /** Hides and reveals the tabs on scroll. */
        this.scrollController = new ScrollBehaviorController(this, {
            behavior: () => this.scrollBehavior,
            target: () => this.scrollTarget,
            hiddenTransform: 'translateY(-100%)',
        });
        /**
         * The selection model (shared SelectionController): exactly one tab is
         * selected, by click or Space/Enter (the tab turns the key into a click),
         * with a `change` event for user changes. The controller selects during
         * the click, so the tab list's own click handling finds the tab already
         * selected and does nothing.
         */
        // spec: tabs/accessibility/keyboard-navigation
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
        /**
         * Arrow keys move focus between the tabs (tabs.md, Keyboard navigation:
         * "Use Arrow/Tab to navigate through items"). The tab list declares
         * `focusgroup` for browsers that ship it; Chromium does not, so the shared
         * RovingFocusController implements the arrows. Moving focus doesn't select:
         * Space and Enter activate the focused tab. Home and End go to the first
         * and last tab.
         */
        this.rovingFocus = new RovingFocusController(this, {
            items: () => this.tabs,
            orientation: 'horizontal',
            tabStops: 'all',
        });
        this.layoutToken = 0;
        setupTabs(this);
    }
    connectedCallback() {
        super.connectedCallback();
        // Adopt the stylesheet into the scope this element is connected to, so that
        // `.tabs` and the `.tab` children resolve in the same tree scope. The
        // indicator is anchor-positioned and the anchor scope is the connected
        // scope, not the shadow root.
        adoptStyles(this, tabsStyles);
        // Apply initial classes synchronously on connect as a guard against a
        // frame of unstyled content before the first updated lifecycle callback.
        updateClassList(this, this.classes());
        this.resizeObserver ??= new ResizeObserver(() => this.scheduleLayout());
        this.resizeObserver.observe(this);
        this.labelObserver ??= new MutationObserver(() => this.scheduleLayout());
        this.labelObserver.observe(this, {
            childList: true,
            subtree: true,
            characterData: true,
        });
        // Labels measured before a web font loads are the wrong width.
        void document.fonts.ready.then(() => this.scheduleLayout());
        this.scheduleLayout();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.resizeObserver?.disconnect();
        this.labelObserver?.disconnect();
        this.layoutToken++;
    }
    classes() {
        return tabsClasses({ variant: this.variant, density: this.density });
    }
    /**
     * Lays the tabs out once the tabs have rendered. A tab's label is slotted
     * only after the tab's own update, so measuring in the same microtask as a
     * DOM change would read padding alone. A newer request supersedes this one.
     */
    scheduleLayout() {
        const token = ++this.layoutToken;
        const rendered = this.tabs.map((tab) => 'updateComplete' in tab ? tab.updateComplete : undefined);
        void Promise.all(rendered).then(() => {
            if (token === this.layoutToken) {
                this.layoutTabs();
            }
        });
    }
    /**
     * Offsets the first tab when the tabs scroll.
     *
     * Tab widths are left to the stylesheet, given the widest tab (`--tabs-widest`). Only the scroll start is set here: the first
     * tab starts `SCROLL_START_OFFSET` in from the leading edge when the bar
     * overflows, so the next tab is visibly cut off (tabs.md, Anatomy).
     */
    layoutTabs() {
        const tabs = this.tabs;
        if (!this.isConnected || tabs.length === 0) {
            return;
        }
        // Fixed tabs are equal: none is wider than the widest tab (tabs.md,
        // Container and Responsive layout). Measure each tab's natural width, then
        // publish the widest for the stylesheet.
        this.style.removeProperty('--tabs-widest');
        if (this.scrollable) {
            this.finishLayout(tabs);
            return;
        }
        const saved = tabs.map((tab) => tab.style.cssText);
        for (const tab of tabs) {
            tab.style.flex = '0 0 auto';
            tab.style.minInlineSize = '0';
            tab.style.maxInlineSize = 'none';
        }
        const widest = Math.max(...tabs.map((tab) => tab.getBoundingClientRect().width));
        tabs.forEach((tab, i) => (tab.style.cssText = saved[i]));
        this.style.setProperty('--tabs-widest', `${Math.ceil(widest)}px`);
        this.finishLayout(tabs);
    }
    finishLayout(tabs) {
        // Measure without the offset. The offset only adds width, so an overflow
        // stays an overflow once it is applied.
        tabs[0].style.marginInlineStart = '';
        if (this.scrollWidth > this.clientWidth) {
            tabs[0].style.marginInlineStart = `${SCROLL_START_OFFSET}px`;
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('variant') || changedProperties.has('density') ||
            changedProperties.has('scrollable')) {
            // The variant modifier is a utility class rather than an attribute
            // selector so that non-element consumers (raw HTML, React, Angular) use
            // the same hook.
            updateClassList(this, this.classes());
            this.scheduleLayout();
        }
    }
}
/** @nocollapse */
TabsElement.styles = [tabsStyles];
__decorate([
    property({ reflect: true })
], TabsElement.prototype, "variant", void 0);
__decorate([
    property({ type: Number, reflect: true })
], TabsElement.prototype, "density", null);
__decorate([
    property({ reflect: true })
], TabsElement.prototype, "align", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], TabsElement.prototype, "scrollable", void 0);
__decorate([
    property({ attribute: 'scroll-behavior', reflect: true })
], TabsElement.prototype, "scrollBehavior", void 0);
__decorate([
    property({ attribute: 'scroll-target' })
], TabsElement.prototype, "scrollTarget", void 0);
//# sourceMappingURL=tabs-element.js.map