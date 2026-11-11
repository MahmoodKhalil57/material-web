/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {guard} from 'lit/directives/guard.js';
import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../internal/aria/delegate.js';
import {safeHref} from '../../internal/directives/safe-href.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.css' with {type: 'css'}; // github-only
// import {styles as focusRingStyles} from '../../foundations/interaction/states/focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../../foundations/interaction/states/ripple/ripple.css' with {type: 'css'}; // github-only
// import {styles as rippleStyles} from '../../foundations/interaction/states/ripple/ripple.cssresult.js'; // google3-only
import navDrawerStyles from './nav-drawer.css' with {type: 'css'}; // github-only
// import {styles as navDrawerStyles} from './nav-drawer.cssresult.js'; // google3-only

import {navDrawerItem} from './nav-drawer.js';

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(LitElement);

/**
 * A Material Design navigation drawer item (destination).
 *
 * Renders a link when `href` is set, otherwise a button. The selected item is
 * marked with `aria-current="page"` and the active indicator.
 *
 * @slot - The item's label text.
 * @slot icon - The item's leading icon (`md-gb-icon`). Filled when selected.
 * @slot badge - Trailing badge label text (overrides the `badge` property).
 * @csspart item - The item's link or button.
 * @csspart icon - The icon container.
 * @csspart label - The label text container.
 * @csspart badge - The trailing badge label container.
 */
export class NavDrawerItemElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    navDrawerStyles,
    css`
      :host {
        display: flex;
        flex: none;
        outline: none;
      }

      :host([hidden]) {
        display: none;
      }
    `,
  ];

  /** Whether the item is the selected (current) destination. */
  @property({type: Boolean, reflect: true}) selected = false;

  /** Whether the item is disabled. */
  @property({type: Boolean, reflect: true}) disabled = false;

  /** The URL the item links to. Renders a link (`<a>`) when set. */
  @property() href = '';

  /** Where to open the linked `href`, e.g. `_blank`. */
  @property() target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

  /** The link's `rel` attribute, when `href` is set. */
  @property() rel = '';

  /**
   * Trailing badge label text, such as an unread count. Ignored when content
   * is slotted into `badge`.
   */
  @property() badge = '';

  /**
   * Whether the item is in the tab order. The parent `md-gb-nav-drawer`
   * manages this to provide a single tab stop with arrow key navigation.
   */
  @property({type: Boolean, attribute: false}) tabStop = true;

  @state() private hasIcon = false;
  @state() private hasSlottedBadge = false;

  @query('.nav-drawer-item')
  private readonly itemElement!: HTMLElement | null;

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, [focusRingStyles, rippleStyles, navDrawerStyles]);
  }

  /** Focuses the item's link or button. */
  override focus(options?: FocusOptions) {
    if (this.itemElement) {
      this.itemElement.focus(options);
    } else {
      this.updateComplete.then(() => this.itemElement?.focus(options));
    }
  }

  override blur() {
    this.itemElement?.blur();
  }

  protected override render() {
    const classes = navDrawerItem({
      active: this.selected,
      disabled: this.disabled,
    });
    const content = html`
      <span part="icon" class="nav-drawer-item-icon" ?hidden=${!this.hasIcon}>
        <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>
      </span>
      <span part="label" class="nav-drawer-item-label"><slot></slot></span>
      <span
        part="badge"
        class="nav-drawer-item-badge"
        ?hidden=${!this.hasSlottedBadge && !this.badge}>
        <slot name="badge" @slotchange=${this.handleBadgeSlotChange}
          >${this.badge}</slot
        >
      </span>
    `;
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    const tabindex = this.tabStop && !this.disabled ? 0 : -1;
    const current = this.selected ? 'page' : nothing;

    if (this.href) {
      return html`<a
        part="item"
        class=${classes}
        href=${
          // `safeHref` resets the attribute on every render, which blurs a
          // focused link; only update it when the URL changes.
          guard([this.href, this.disabled], () =>
            this.disabled ? nothing : safeHref(this.href),
          )
        }
        target=${this.target || nothing}
        rel=${this.rel || nothing}
        aria-current=${current}
        aria-disabled=${this.disabled || nothing}
        aria-label=${ariaLabel || nothing}
        tabindex=${tabindex}
        @click=${this.handleClick}
        >${content}</a
      >`;
    }
    return html`<button
      part="item"
      type="button"
      class=${classes}
      ?disabled=${this.disabled}
      aria-current=${current}
      aria-label=${ariaLabel || nothing}
      tabindex=${tabindex}
      @click=${this.handleClick}>
      ${content}
    </button>`;
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  private handleIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasIcon = slot.assignedNodes().length > 0;
  }

  private handleBadgeSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasSlottedBadge = slot.assignedNodes().length > 0;
  }
}
