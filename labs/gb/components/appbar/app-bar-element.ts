/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {property, state} from 'lit/decorators.js';

import {appBar, type AppBarSize, type AppBarVariant} from './app-bar.js';
import {styles as appBarStyles} from './app-bar.cssresult.js';

/**
 * A Material Design Expressive App Bar component (`md-gb-app-bar`).
 *
 * Focus not obscured (WCAG 2.4.11): a sticky or fixed app bar must not hide
 * focused elements scrolled under it. Register it with `setupScrollPadding()`
 * (`./scroll-padding.js`, as a `start` bar): it sets
 * `scroll-padding-block-start` and `--md-gb-obscured-block-start` (the bar's
 * height plus the focus indicator) on the scroll container.
 *
 * @slot - Used to display the primary title text of the app bar.
 * @slot subtitle - Used to display an optional subtitle below the title.
 * @slot leading - Used to display the leading navigation icon button (e.g. menu or back).
 * @slot trailing - Used to display trailing action buttons and/or user avatar.
 * @slot search - Used to display the search bar input or controls when
 *     `variant="search"`, inside the search bar container.
 * @fires {CustomEvent<{scrolled: boolean}>} scrollstatechange - Fired when the scrolled state changes. --bubbles --composed
 * @csspart app-bar - The root container element.
 * @cssprop --avatar-size
 * @cssprop --collapsed-height
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height
 * @cssprop --container-shape
 * @cssprop --icon-button-space
 * @cssprop --icon-size
 * @cssprop --leading-icon-color
 * @cssprop --leading-space
 * @cssprop --on-scroll-container-color
 * @cssprop --on-scroll-container-elevation
 * @cssprop --search-container-color
 * @cssprop --search-container-height
 * @cssprop --search-container-shape
 * @cssprop --search-label-color
 * @cssprop --search-label-text-font
 * @cssprop --search-label-text-font-axes
 * @cssprop --search-label-text-font-tracking
 * @cssprop --search-leading-space
 * @cssprop --search-on-scroll-container-color
 * @cssprop --search-trailing-space
 * @cssprop --subtitle-color
 * @cssprop --subtitle-font
 * @cssprop --subtitle-font-axes
 * @cssprop --subtitle-font-tracking
 * @cssprop --title-bottom-space
 * @cssprop --title-color
 * @cssprop --title-font
 * @cssprop --title-font-axes
 * @cssprop --title-font-tracking
 * @cssprop --title-inset
 * @cssprop --trailing-icon-color
 * @cssprop --trailing-space
 */
export class AppBarElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    appBarStyles,
    css`
      :host {
        display: flex;
        width: 100%;
        position: relative;
      }
    `,
  ];

  /** The size of the app bar (`sm`, `md`, `lg`). Defaults to `sm`. */
  @property({reflect: true}) size: AppBarSize = 'sm';

  /** The behavioral variant of the app bar (`standard` or `search`). Defaults to `standard`. */
  @property({reflect: true}) variant: AppBarVariant = 'standard';

  /** Whether the app bar is in its scrolled state. Defaults to `false`. */
  @property({type: Boolean, reflect: true}) scrolled = false;

  /**
   * Whether the title and subtitle are centered instead of leading-aligned
   * (the M3 Expressive "centered text" configuration). Defaults to `false`.
   */
  @property({type: Boolean, reflect: true}) centered = false;

  @state() private hasSubtitle = false;
  @state() private hasLeading = false;

  protected override render() {
    const withSubtitle = this.variant !== 'search' && this.hasSubtitle;
    const directive = appBar({
      size: this.size,
      withSubtitle,
      variant: this.variant,
      scrolled: this.scrolled,
      centered: this.centered,
      hasLeading: this.hasLeading,
    });
    const leading = html`<div class="app-bar-leading">
      <slot name="leading" @slotchange=${this.handleLeadingSlotChange}></slot>
    </div>`;
    const trailing = html`<div class="app-bar-trailing">
      <slot name="trailing"></slot>
    </div>`;

    if (this.variant === 'search') {
      return html`<div part="app-bar" class="${directive}">
        ${leading}
        <div class="app-bar-search-container">
          <div class="app-bar-search-bar">
            <slot name="search"></slot>
          </div>
        </div>
        ${trailing}
      </div>`;
    }

    const title = html`<div class="app-bar-title-wrapper">
      <div class="app-bar-title">
        <slot></slot>
      </div>
      <div class="app-bar-subtitle">
        <slot
          name="subtitle"
          @slotchange=${this.handleSubtitleSlotChange}></slot>
      </div>
    </div>`;

    if (this.size === 'md' || this.size === 'lg') {
      return html`<div part="app-bar" class="${directive}">
        <div class="app-bar-top-row">${leading}${trailing}</div>
        <div class="app-bar-bottom-row">${title}</div>
      </div>`;
    }

    return html`<div part="app-bar" class="${directive}">
      ${leading}${title}${trailing}
    </div>`;
  }

  private handleSubtitleSlotChange(event: Event) {
    this.hasSubtitle = hasContent(event.target as HTMLSlotElement);
  }

  private handleLeadingSlotChange(event: Event) {
    this.hasLeading = hasContent(event.target as HTMLSlotElement);
  }
}

function hasContent(slot: HTMLSlotElement) {
  return slot
    .assignedNodes({flatten: true})
    .some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim(),
    );
}
