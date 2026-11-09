/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, isServer, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { afterDispatch, setupDispatchHooks, } from '../../../internal/events/dispatch-hooks.js';
import { queryAssociatedById } from '../../aria/query-associated.js';
import { mixinCustomStateSet, toggleState, } from '../../behaviors/custom-state-set.js';
import { internals, mixinElementInternals, } from '../../behaviors/element-internals.js';
import { mixinFocusable } from '../../behaviors/focusable.js';
const baseClass = mixinFocusable(mixinCustomStateSet(mixinElementInternals(LitElement)));
/**
 * An ARIA tab element.
 *
 * @cssstate selected - Whether the tab is selected.
 */
export class AriaTabElement extends baseClass {
    /**
     * ID of the associated `md-aria-tabpanel` element.
     */
    get tabpanel() {
        return this.tabpanelElement?.id || '';
    }
    set tabpanel(value) {
        this.tabpanelElement = queryAssociatedById(this, value);
    }
    /**
     * The tabpanel element that is controlled by this tab.
     */
    get tabpanelElement() {
        return this[internals].ariaControlsElements?.[0] || null;
    }
    set tabpanelElement(value) {
        const previousValue = this.tabpanelElement;
        if (value === previousValue)
            return;
        this[internals].ariaControlsElements = value ? [value] : [];
    }
    /**
     * Whether the tab is selected.
     */
    get selected() {
        return this[internals].ariaSelected === 'true';
    }
    set selected(value) {
        const oldValue = this.selected;
        value = Boolean(value); // coerce for safety
        this[internals].ariaSelected = String(value);
        this[toggleState]('selected', value);
        // Request update manually for Lit 2 compatibility, where user-defined
        // accessors are not automatically wrapped by createProperty().
        // May be removed once Lit 2 is no longer supported.
        this.requestUpdate('selected', oldValue);
    }
    constructor() {
        super();
        if (isServer)
            return;
        this[internals].role = 'tab';
        setupDispatchHooks(this, 'keydown');
        this.addEventListener('keydown', (event) => {
            afterDispatch(event, () => {
                if (event.defaultPrevented) {
                    return;
                }
                if (event.key === 'Enter' || event.key === ' ') {
                    // Prevent default behavior such as scrolling when pressing spacebar.
                    event.preventDefault();
                    this.click();
                }
            });
        });
    }
    render() {
        return html `<slot></slot>`;
    }
}
AriaTabElement.styles = css `
    :host {
      display: inline-block;
      cursor: pointer;
    }
  `;
__decorate([
    property({ type: String, reflect: true, noAccessor: true })
], AriaTabElement.prototype, "tabpanel", null);
__decorate([
    property({ type: Boolean, reflect: true })
], AriaTabElement.prototype, "selected", null);
//# sourceMappingURL=tab.js.map