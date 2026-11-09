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
import focusRingStyles from '../focus/focus-ring.css.js'; // github-only
// import {styles as focusRingStyles} from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css.js'; // github-only
// import {styles as rippleStyles} from '../ripple/ripple.cssresult.js'; // google3-only
import navRailStyles from './nav-rail.css.js'; // github-only
// import {styles as navRailStyles} from './nav-rail.cssresult.js'; // google3-only
import { navRailItem } from './nav-rail.js';
/**
 * A Material Design navigation rail item component.
 *
 * @slot - Used to display the item's label text.
 * @slot icon - Used to display the item's icon (`md-gb-icon`).
 * @slot badge - Used to display a custom badge on the item's icon.
 * @csspart nav-rail-item - The navigation rail item's presentational container.
 * @csspart indicator - The active indicator / icon container element.
 * @csspart label - The label text container element.
 * @cssstate selected - Whether the navigation rail item is selected.
 */
export class NavRailItemElement extends AriaTabElement {
    constructor() {
        super();
        this.navLink = new NavLinkController(this);
        /** Whether the navigation rail item is disabled. */
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
        /**
         * Whether the destination is secondary: it shows only while the rail is
         * expanded.
         */
        this.secondary = false;
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
    /**
     * Whether the navigation rail item is active. Alias for `selected`.
     *
     * TODO: replace reflected `[active]` with `:state(selected)`
     */
    get active() {
        return this.selected;
    }
    set active(value) {
        this.selected = value;
    }
    connectedCallback() {
        super.connectedCallback();
        adoptStyles(this, [focusRingStyles, rippleStyles, navRailStyles]);
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('disabled')) {
            this[internals].ariaDisabled = String(this.disabled);
            this[isFocusable] = !this.disabled;
        }
    }
    render() {
        const isSelected = this.selected;
        const isDotBadge = this.badge === 'dot' || this.badge === 'true';
        const hasBadge = Boolean(this.badge);
        return html `
      <div
        part="nav-rail-item"
        class="${navRailItem({
            disabled: this.disabled,
            itemLayout: this.itemLayout,
            selected: isSelected,
        })} ripple-host focus-ring-host"
        ?disabled=${this.disabled}>
        <span class="nav-rail-item-content">
          <span part="indicator" class="nav-rail-item-indicator">
            <span class="nav-rail-item-icon">
              <slot name="icon"></slot>
            </span>
          </span>
          <span part="label" class="nav-rail-item-label">
            <slot>${this.label}</slot>
          </span>
          ${hasBadge
            ? html `<span
                class="nav-rail-item-badge ${isDotBadge
                ? 'nav-rail-item-badge-dot'
                : ''}">
                ${isDotBadge ? nothing : this.badge}
              </span>`
            : html `<slot name="badge"></slot>`}
        </span>
        ${this.navLink.render()}
      </div>
    `;
    }
}
/** @nocollapse */
NavRailItemElement.styles = [
    focusRingStyles,
    rippleStyles,
    navRailStyles,
    navLinkStyles,
    css `
      :host {
        display: flex;
        inline-size: 100%;
        outline: none;
      }

      /* An icon with no filled style uses the semibold weight when active. */
      :host([unfilled-icon][selected]) .nav-rail-item {
        --md-icon-fill: 0;
        --md-icon-wght: 600;
      }

      @media (hover: hover) {
        :host(:hover) .nav-rail-item {
          --md-icon-color: var(--item-inactive-hovered-icon-color);
          color: var(--item-inactive-hovered-label-text-color);
        }
      }

      :host(:focus-visible) .nav-rail-item,
      :host(:focus-within) .nav-rail-item {
        --md-icon-color: var(--item-inactive-focused-icon-color);
        color: var(--item-inactive-focused-label-text-color);
      }

      :host(:active) .nav-rail-item {
        --md-icon-color: var(--item-inactive-pressed-icon-color);
        color: var(--item-inactive-pressed-label-text-color);
      }

      @media (hover: hover) {
        :host(:hover)
          .nav-rail-item:is(.nav-rail-item-active, [aria-selected='true']) {
          --md-icon-color: var(--item-active-hovered-icon-color);
          color: var(--item-active-hovered-label-text-color);
        }
      }

      :host(:focus-visible)
        .nav-rail-item:is(.nav-rail-item-active, [aria-selected='true']),
      :host(:focus-within)
        .nav-rail-item:is(.nav-rail-item-active, [aria-selected='true']) {
        --md-icon-color: var(--item-active-focused-icon-color);
        color: var(--item-active-focused-label-text-color);
      }

      :host(:active)
        .nav-rail-item:is(.nav-rail-item-active, [aria-selected='true']) {
        --md-icon-color: var(--item-active-pressed-icon-color);
        color: var(--item-active-pressed-label-text-color);
      }
    `,
];
__decorate([
    property({ type: Boolean, reflect: true, noAccessor: true })
], NavRailItemElement.prototype, "active", null);
__decorate([
    property({ type: Boolean, reflect: true })
], NavRailItemElement.prototype, "disabled", void 0);
__decorate([
    property({ attribute: 'item-layout', reflect: true })
], NavRailItemElement.prototype, "itemLayout", void 0);
__decorate([
    property()
], NavRailItemElement.prototype, "href", void 0);
__decorate([
    property()
], NavRailItemElement.prototype, "target", void 0);
__decorate([
    property()
], NavRailItemElement.prototype, "rel", void 0);
__decorate([
    property()
], NavRailItemElement.prototype, "label", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'unfilled-icon' })
], NavRailItemElement.prototype, "unfilledIcon", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], NavRailItemElement.prototype, "secondary", void 0);
__decorate([
    property()
], NavRailItemElement.prototype, "badge", void 0);
//# sourceMappingURL=nav-rail-item-element.js.map