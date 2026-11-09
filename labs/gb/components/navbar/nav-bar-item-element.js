/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { AriaTabElement } from '../../../aria/tabs/tab.js';
import { internals } from '../../../behaviors/element-internals.js';
import { isFocusable } from '../../../behaviors/focusable.js';
import { adoptStyles } from '../../styles/adopt-styles.js';
import { NavLinkController, navLinkStyles } from '../shared/nav-link.js';
import focusRingStyles from '../focus/focus-ring.css' with { type: 'css' }; // github-only
// import {styles as focusRingStyles} from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with { type: 'css' }; // github-only
// import {styles as rippleStyles} from '../ripple/ripple.cssresult.js'; // google3-only
import navBarStyles from './nav-bar.css' with { type: 'css' }; // github-only
// import {styles as navBarStyles} from './nav-bar.cssresult.js'; // google3-only
import { navBarItem } from './nav-bar.js';
/**
 * A Material Design gBreeze navigation bar item component.
 *
 * @slot - Used to display the item's label text.
 * @slot icon - Used to display the item's icon (`md-gb-icon`).
 * @slot badge - Used to display a custom badge on the item's icon.
 * @csspart nav-bar-item - The navigation bar item's presentational container.
 * @csspart indicator - The active indicator / icon container element.
 * @csspart label - The label text container element.
 * @cssstate selected - Whether the navigation bar item is selected.
 */
// spec-labels: navigation-bar/specs/anatomy, navigation-bar/guidelines/anatomy, navigation-bar/specs/states
export class NavBarItemElement extends AriaTabElement {
    constructor() {
        super();
        this.navLink = new NavLinkController(this);
        /** Whether the navigation bar item is disabled. */
        this.disabled = false;
        /** The layout orientation of the item ('vertical' or 'horizontal'). */
        this.itemLayout = 'vertical';
        /**
         * The URL the destination links to. The item is then a link (role `link`,
         * `aria-current="page"` while selected) instead of a tab.
         */
        this.href = '';
        /** Where to open the linked `href`, e.g. `_blank`. */
        this.target = '';
        /** The link's `rel` attribute, when `href` is set. */
        this.rel = '';
        /** Optional label text if not provided via default slot. */
        this.label = '';
        /**
         * Whether the icon has no filled style. The active destination then uses
         * the semibold icon weight instead of the filled icon.
         */
        this.unfilledIcon = false;
        /** Optional badge text (or 'dot' / 'true' for a small dot badge). */
        this.badge = '';
        this.addEventListener('click', (event) => {
            if (this.disabled) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });
    }
    get selected() {
        return this.href ? this.navLink.selected : super.selected;
    }
    set selected(value) {
        const oldValue = this.selected;
        super.selected = value;
        // A link keeps its state apart from `aria-selected`, which it can't have.
        if (this.navLink) {
            this.navLink.selected = Boolean(value);
            this.navLink.sync();
        }
        this.requestUpdate('active', oldValue);
    }
    /** Activates the destination: follows its link, else clicks the tab. */
    click() {
        if (!this.navLink.activate())
            super.click();
    }
    /** Whether the navigation bar item is active. Alias for `selected`. */
    get active() {
        return this.selected;
    }
    set active(value) {
        this.selected = value;
    }
    connectedCallback() {
        super.connectedCallback();
        adoptStyles(this, [focusRingStyles, rippleStyles, navBarStyles]);
        this.syncSlottedIcons();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('disabled')) {
            this[internals].ariaDisabled = String(this.disabled);
            this[isFocusable] = !this.disabled;
        }
    }
    render() {
        const isActive = this.selected;
        const isDotBadge = this.badge === 'dot' || this.badge === 'true';
        const hasBadge = Boolean(this.badge);
        return html `
      <div
        part="nav-bar-item"
        class="${navBarItem({
            active: isActive,
            disabled: this.disabled,
            itemLayout: this.itemLayout,
        })} ripple-host focus-ring-host"
        ?disabled=${this.disabled}>
        <span class="nav-bar-item-content">
          <span part="indicator" class="nav-bar-item-icon-container">
            <span class="nav-bar-item-icon">
              <slot name="icon" @slotchange=${this.syncSlottedIcons}></slot>
            </span>
            ${hasBadge
            ? html `<span
                  class="nav-bar-item-badge ${isDotBadge
                ? 'nav-bar-item-badge-dot'
                : ''}">
                  ${isDotBadge ? nothing : this.badge}
                </span>`
            : html `<slot name="badge"></slot>`}
          </span>
          <span part="label" class="nav-bar-item-label">
            <slot @slotchange=${this.syncSlottedIcons}>${this.label}</slot>
          </span>
        </span>
        ${this.navLink.render()}
      </div>
    `;
    }
    syncSlottedIcons() {
        const icons = this.querySelectorAll('md-gb-icon:not([slot])');
        for (const icon of Array.from(icons)) {
            icon.setAttribute('slot', 'icon');
        }
    }
}
/** @nocollapse */
NavBarItemElement.styles = [
    focusRingStyles,
    rippleStyles,
    navBarStyles,
    navLinkStyles,
    css `
      :host {
        display: flex;
        outline: none;
      }

      /* An icon with no filled style uses the semibold weight when active. */
      :host([unfilled-icon][active]) .nav-bar-item {
        --md-icon-fill: 0;
        --md-icon-wght: 600;
      }
    `,
];
__decorate([
    property({ type: Boolean, reflect: true, noAccessor: true })
], NavBarItemElement.prototype, "active", null);
__decorate([
    property({ type: Boolean, reflect: true })
], NavBarItemElement.prototype, "disabled", void 0);
__decorate([
    property({ attribute: 'item-layout', reflect: true })
], NavBarItemElement.prototype, "itemLayout", void 0);
__decorate([
    property()
], NavBarItemElement.prototype, "href", void 0);
__decorate([
    property()
], NavBarItemElement.prototype, "target", void 0);
__decorate([
    property()
], NavBarItemElement.prototype, "rel", void 0);
__decorate([
    property()
], NavBarItemElement.prototype, "label", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'unfilled-icon' })
], NavBarItemElement.prototype, "unfilledIcon", void 0);
__decorate([
    property()
], NavBarItemElement.prototype, "badge", void 0);
//# sourceMappingURL=nav-bar-item-element.js.map