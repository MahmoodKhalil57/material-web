/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, isServer, LitElement, } from 'lit';
import { property, query } from 'lit/decorators.js';
import { afterDispatch, setupDispatchHooks, } from '../../../internal/events/dispatch-hooks.js';
import { internals, mixinElementInternals, } from '../../behaviors/element-internals.js';
const baseClass = mixinElementInternals(LitElement);
/**
 * An ARIA tablist element.
 */
export class AriaTablistElement extends baseClass {
    /**
     * The tabs of this tablist.
     */
    get tabs() {
        return (this.slotElement
            ?.assignedElements({ flatten: true })
            .filter((el) => this.isTab(el)) ?? []);
    }
    /**
     * The currently selected tab, `null` only when there are no tab children.
     *
     * @export
     */
    get selectedTab() {
        return this.tabs.find((tab) => this.isTabSelected(tab)) ?? null;
    }
    set selectedTab(tab) {
        // Ignore setting selectedTab to null. As long as there are children, one
        // tab must be selected.
        if (tab) {
            this.updateSelectedTab(tab);
        }
    }
    /**
     * The index of the currently selected tab.
     *
     * @export
     */
    get selectedTabIndex() {
        return this.tabs.findIndex((tab) => this.isTabSelected(tab));
    }
    set selectedTabIndex(index) {
        const selectTabAtIndex = () => {
            const tab = this.tabs[index];
            // Ignore out-of-bound indices.
            if (tab) {
                this.updateSelectedTab(tab);
            }
        };
        if (!this.slotElement) {
            // This is needed to support setting the selectedTabIndex via a lit
            // property binding.
            //
            // ```ts
            // html`
            //   <md-aria-tablist .selectedTabIndex=${1}>
            //     <md-aria-tab>First</md-aria-tab>
            //     <md-aria-tab>Second</md-aria-tab>
            //   </md-aria-tablist>
            // `;
            // ```
            //
            // It's needed since lit's rendering lifecycle is asynchronous, and the
            // `<slot>` element hasn't rendered, so `tabs` is empty.
            this.updateComplete.then(selectTabAtIndex);
            return;
        }
        selectTabAtIndex();
    }
    constructor() {
        super();
        /**
         * Whether or not to automatically select a tab when it is focused.
         */
        this.autoSelect = false;
        /**
         * Orientation of the tablist ('horizontal' or 'vertical').
         */
        this.orientation = 'horizontal';
        if (isServer)
            return;
        this[internals].role = 'tablist';
        setupDispatchHooks(this, 'click', 'focusin');
        this.addEventListener('click', this.handleClick.bind(this));
        this.addEventListener('focusin', this.handleFocusin.bind(this));
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('orientation') ||
            !this.hasAttribute('focusgroup')) {
            const isVertical = this.orientation === 'vertical';
            this[internals].ariaOrientation = isVertical ? 'vertical' : 'horizontal';
            this.setAttribute('focusgroup', `tablist ${isVertical ? 'block' : 'inline'}`);
        }
    }
    render() {
        return html `<slot @slotchange=${this.handleSlotChange}></slot>`;
    }
    /**
     * Returns true if the element is a valid tab component or role. Subclasses
     * may override this method to determine if an element is a supported tab.
     */
    isTab(element) {
        return isAriaTabLike(element);
    }
    /**
     * Returns true if the tab is currently selected. Subclasses may override this
     * method to support custom tab selection implementations.
     */
    isTabSelected(tab) {
        if (!isAriaTabLike(tab))
            return false;
        return tab.selected;
    }
    /**
     * Updates the selection state of the tab element and visibility of its
     * tabpanel. Subclasses may override this method to support custom tab
     * selection implementations.
     */
    setTabSelected(tab, isSelected) {
        if (!isAriaTabLike(tab))
            return;
        tab.selected = isSelected;
        const panel = tab.tabpanelElement;
        if (panel) {
            panel.hidden = !isSelected;
        }
    }
    onTabChange(previousTab) {
        this.dispatchEvent(new Event('change', { bubbles: true }));
    }
    updateSelectedTab(tabToSelect) {
        const { tabs } = this;
        const tabToSelectIndex = tabs.indexOf(tabToSelect);
        if (tabToSelectIndex === -1) {
            // Ignore setting selectedTab to a tab element that is not a child.
            return;
        }
        for (const tab of tabs) {
            this.setTabSelected(tab, tab === tabToSelect);
        }
    }
    handleClick(event) {
        // event.composedPath() needs to be called before dispatch completes.
        const tab = event
            .composedPath()
            .find((el) => this.isTab(el));
        // Allow event to bubble
        afterDispatch(event, () => {
            if (event.defaultPrevented) {
                return;
            }
            if (tab && !this.isTabSelected(tab)) {
                const previousTab = this.selectedTab;
                this.updateSelectedTab(tab);
                this.onTabChange(previousTab);
            }
        });
    }
    handleFocusin(event) {
        if (this.autoSelect) {
            this.handleClick(event);
        }
    }
    handleSlotChange() {
        const tabToSelect = this.selectedTab ?? this.tabs[0];
        if (tabToSelect) {
            // Sync tab selection state when slotted content changes. If the active
            // tab was removed or none selected, auto-select the first tab. There
            // should always be a single selected tab while the tablist has children.
            this.updateSelectedTab(tabToSelect);
        }
    }
}
AriaTablistElement.styles = css `
    :host {
      display: flex;
    }
    :host([orientation='vertical']) {
      flex-direction: column;
    }
  `;
__decorate([
    property({ type: Number })
], AriaTablistElement.prototype, "selectedTabIndex", null);
__decorate([
    property({ type: Boolean })
], AriaTablistElement.prototype, "autoSelect", void 0);
__decorate([
    property({ reflect: true })
], AriaTablistElement.prototype, "orientation", void 0);
__decorate([
    query('slot:not([name])')
], AriaTablistElement.prototype, "slotElement", void 0);
function isAriaTabLike(element) {
    return Boolean(element &&
        typeof element === 'object' &&
        'selected' in element &&
        'tabpanelElement' in element);
}
//# sourceMappingURL=tablist.js.map