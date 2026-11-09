/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { consume, provide } from '@lit/context';
import { css, html, LitElement, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { internals, mixinElementInternals, } from '../../../behaviors/element-internals.js';
import menuStyles from './menu.css.js'; // github-only
// import {styles as menuStyles} from './menu.cssresult.js'; // google3-only
import { MENU_CLASSES, menuContext, menuItemCheckable, } from './menu.js';
// Separate variable needed for closure.
const baseClass = mixinElementInternals(LitElement);
let labelId = 0;
/**
 * A Material Design menu group component.
 *
 * Groups related items (menus.md "Menu groups"), optionally under a section
 * label, and makes them single- or multi-select (`checkable`). In a menu
 * with `layout="grouped"` each group is its own surface, separated from the
 * next by a gap, and a group the pointer or focus has left morphs to the
 * inactive shape (Compose `DropdownMenuGroup`).
 *
 * @slot - Used to display the menu group's items.
 * @csspart group - The group's root element.
 * @csspart label - The section label.
 */
export class MenuGroupElement extends baseClass {
    get menu() {
        return this.menuContext?.menu || null;
    }
    get items() {
        return (this.menuContext?.getItems?.() || []).filter((item) => this.compareDocumentPosition(item) &
            Node.DOCUMENT_POSITION_CONTAINED_BY);
    }
    constructor() {
        super();
        this.checkable = null;
        /** The section label shown above the group's items. */
        this.label = '';
        this.menuContext = null;
        this.inactive = false;
        this.engaged = false;
        this.hasBeenEngaged = false;
        this.labelId = `md-gb-menu-group-label-${++labelId}`;
        this[internals].role = 'group';
        // TODO: single-select items should not be allowed to uncheck themselves.
        // A single change event should be emitted from the group instead.
        this.addEventListener('change', (event) => {
            if (this.checkable === 'single') {
                const composedPath = event.composedPath();
                const items = this.items;
                for (const item of items) {
                    if (!composedPath.includes(item) && item.checked) {
                        item.checked = false;
                    }
                }
            }
        });
        // Compose `shapeByInteraction`: once hovered (or focused), a group that
        // is no longer hovered takes the inactive shape.
        const engage = (engaged) => () => {
            this.engaged = engaged;
            if (engaged)
                this.hasBeenEngaged = true;
            this.inactive = this.hasBeenEngaged && !this.isEngaged();
        };
        this.addEventListener('pointerenter', engage(true));
        this.addEventListener('pointerleave', engage(false));
        this.addEventListener('focusin', engage(true));
        this.addEventListener('focusout', () => {
            this.engaged = this.matches(':hover');
            this.inactive = this.hasBeenEngaged && !this.isEngaged();
        });
    }
    connectedCallback() {
        super.connectedCallback();
        // Groups start over each time the menu opens.
        this.menuAbort = new AbortController();
        queueMicrotask(() => {
            this.menu?.addEventListener('toggle', () => {
                this.hasBeenEngaged = false;
                this.engaged = false;
                this.inactive = false;
            }, { signal: this.menuAbort?.signal });
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.menuAbort?.abort();
    }
    render() {
        return html `<div
      class=${classMap({
            [MENU_CLASSES.group]: true,
            [MENU_CLASSES.groupInactive]: this.inactive,
            // The menu's layout, for browsers without style queries (menu.scss).
            [MENU_CLASSES.menuGrouped]: this.menu?.layout === 'grouped',
        })}
      part="group"
    >
      ${this.label
            ? html `<div
              id=${this.labelId}
              class=${MENU_CLASSES.sectionLabel}
              part="label"
              aria-hidden="true"
            >
              ${this.label}
            </div>`
            : nothing}
      <slot></slot>
    </div>`;
    }
    updated() {
        // The section label names the group; groups without one are
        // presentational.
        this[internals].role = this.label ? 'group' : 'none';
        this[internals].ariaLabel = this.label || null;
    }
    isEngaged() {
        return this.engaged || this.matches(':focus-within');
    }
}
/** @nocollapse */
MenuGroupElement.styles = [
    menuStyles,
    css `
      :host {
        display: contents;
      }
      :host([hidden]) {
        display: none;
      }
    `,
];
__decorate([
    provide({ context: menuItemCheckable }),
    property({ reflect: true })
], MenuGroupElement.prototype, "checkable", void 0);
__decorate([
    property()
], MenuGroupElement.prototype, "label", void 0);
__decorate([
    consume({ context: menuContext, subscribe: true })
], MenuGroupElement.prototype, "menuContext", void 0);
__decorate([
    state()
], MenuGroupElement.prototype, "inactive", void 0);
//# sourceMappingURL=menu-group-element.js.map