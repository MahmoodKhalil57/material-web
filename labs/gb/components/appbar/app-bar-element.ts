/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {property, state} from 'lit/decorators.js';

import {
  AdaptiveController,
  type AdaptiveOptions,
} from '../shared/adaptive.js';

import {ScrollBehaviorController} from '../shared/scroll-behavior.js';

import {appBar, type AppBarSize, type AppBarVariant} from './app-bar.js';
import {styles as appBarStyles} from './app-bar.cssresult.js';

/**
 * A Material Design Expressive App Bar component (`md-gb-app-bar`).
 *
 * Scroll behavior (app-bars.md "Scrolling"): `scroll-behavior="hide"` hides
 * the app bar when the page scrolls down and reveals it when scrolling up;
 * `scroll-behavior="compress"` turns a medium or large flexible app bar into a
 * small one as soon as the page is scrolled and keeps it small until the page
 * is back at the top. `scroll-target` is the id of the scrolling element
 * (default: the window). Both set `scrolled` for the on-scroll color. Make the
 * app bar sticky or fixed at the top of the page. See `ScrollBehaviorController`.
 *
 * Adaptive design (app-bars.md "Adaptive design", "Resizing"): the app bar
 * fills the width of its container and tracks that width's window size class
 * (`window-size-class` attribute). Trailing actions beyond the class's limit
 * (`TRAILING_ACTIONS`: 2 up to medium, 4 from expanded: the search app bar's
 * "up to four trailing icons on larger screens") are hidden and listed in the
 * `overflowchange` event; they show again at larger sizes. Put the overflow
 * menu button in the `overflow` slot; it is only shown while actions are
 * collapsed.
 *
 * Focus not obscured (WCAG 2.4.11): a sticky or fixed app bar must not hide
 * focused elements scrolled under it. Register it with `setupScrollPadding()`
 * (`./scroll-padding.js`, as a `start` bar): it sets
 * `scroll-padding-block-start` and `--md-gb-obscured-block-start` (the bar's
 * height plus the focus indicator) on the scroll container.
 *
 * @slot - Used to display the primary title text of the app bar.
 * @slot subtitle - Used to display an optional subtitle below the title.
 * @slot image - An optional image or logo. In a small app bar it can replace
 *     the title text; in medium and large flexible app bars it appears above
 *     the text.
 * @slot tabs - Optional `md-gb-tabs` attached below the app bar. They are part
 *     of the app bar's box, so they hide and reveal with it as one unit
 *     (tabs.md: "When tabs are attached to a component, they should appear
 *     and move as a single unit").
 * @slot leading - Used to display the leading navigation icon button (e.g. menu or back).
 * @slot trailing - Used to display trailing action buttons and/or user avatar.
 * @slot search - Used to display the search bar input or controls when
 *     `variant="search"`, inside the search bar container.
 * @slot overflow - Used to display an overflow menu button. Shown only while
 *     trailing actions are collapsed (see "Adaptive design" above).
 * @fires {CustomEvent<{overflowed: Element[]}>} overflowchange - Fired when the trailing actions that collapse at the current window size class change. --bubbles --composed
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
// spec-labels: app-bars/specs/anatomy, app-bars/guidelines/anatomy, app-bars/guidelines/anatomy/headline, app-bars/guidelines/anatomy/leading-button, app-bars/specs/anatomy/subtitle, app-bars/specs/anatomy/search, app-bars/guidelines/usage, app-bars/specs/variants, app-bars/specs/baseline-app-bars
/** The most trailing actions the app bar shows at a window size class. */
export interface AppBarAdaptiveOptions {
  trailingActions: number;
}

/**
 * Trailing actions per window size class: two on small windows, up to four on
 * larger ones. Larger classes inherit from the next smaller one.
 */
export const TRAILING_ACTIONS: AdaptiveOptions<AppBarAdaptiveOptions> = {
  compact: {trailingActions: 2},
  expanded: {trailingActions: 4},
};

export class AppBarElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    appBarStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
      }
      /* Lets the inner bar read its stuck state (scrolled color) in CSS. */
      @supports (container-type: scroll-state) {
        :host {
          container-type: scroll-state;
        }
      }
    `,
  ];

  /** The size of the app bar (`sm`, `md`, `lg`). Defaults to `sm`. */
  @property({reflect: true}) size: AppBarSize = 'sm';

  /** The behavioral variant of the app bar (`standard` or `search`). Defaults to `standard`. */
  @property({reflect: true}) variant: AppBarVariant = 'standard';

  /**
   * Whether the app bar is in its scrolled state. Defaults to `false`. A
   * medium or large flexible app bar in its scrolled state is shown as a small
   * one (app-bars.md: "When scrolled, medium flexible and large flexible app
   * bars can transform into small app bars").
   */
  @property({type: Boolean, reflect: true}) scrolled = false;

  /**
   * How the app bar reacts to scrolling: `hide` (hide on scroll down, reveal
   * on scroll up) or `compress` (medium and large flexible app bars become
   * small until scrolled back to the top).
   */
  @property({attribute: 'scroll-behavior', reflect: true})
  scrollBehavior?: 'hide' | 'compress';

  /** The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. */
  @property({attribute: 'scroll-target'}) scrollTarget = '';

  /** Hides, reveals or compresses the app bar with the scroll target. */
  protected readonly scrollController = new ScrollBehaviorController(this, {
    behavior: () => this.scrollBehavior,
    target: () => this.scrollTarget,
    hiddenTransform: 'translateY(-100%)',
    onScrolledChange: (scrolled) => {
      if (
        this.scrollBehavior === 'compress' ||
        (this.scrollBehavior === 'hide' && this.size === 'sm')
      ) {
        this.scrolled = scrolled;
        this.dispatchEvent(
          new CustomEvent('scrollstatechange', {
            bubbles: true,
            composed: true,
            detail: {scrolled},
          }),
        );
      }
    },
  });

  /**
   * Whether the title and subtitle are centered instead of leading-aligned
   * (the M3 Expressive "centered text" configuration). Defaults to `false`.
   */
  @property({type: Boolean, reflect: true}) centered = false;

  /** The window size class of the app bar's width and its per-class limits. */
  protected readonly adaptive = new AdaptiveController<AppBarAdaptiveOptions>(
    this,
    {base: {trailingActions: 2}, options: TRAILING_ACTIONS},
  );

  /** The trailing actions hidden at the current window size class. */
  get overflowedActions(): readonly Element[] {
    return this.overflowed;
  }

  @state() private overflowed: Element[] = [];
  private readonly hiddenByOverflow = new WeakSet<Element>();
  @state() private hasSubtitle = false;
  @state() private hasLeading = false;

  protected override render() {
    const withSubtitle = this.variant !== 'search' && this.hasSubtitle;
    // A scrolled flexible app bar is a small one.
    const size = this.scrolled ? 'sm' : this.size;
    const directive = appBar({
      size,
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
      <slot
        name="trailing"
        @slotchange=${this.handleTrailingSlotChange}></slot>
      <slot name="overflow" ?hidden=${this.overflowed.length === 0}></slot>
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
      </div>
      <slot name="tabs"></slot>`;
    }

    const title = html`<div class="app-bar-title-wrapper">
      <div class="app-bar-image"><slot name="image"></slot></div>
      <div class="app-bar-title">
        <slot></slot>
      </div>
      <div class="app-bar-subtitle">
        <slot
          name="subtitle"
          @slotchange=${this.handleSubtitleSlotChange}></slot>
      </div>
    </div>`;

    const tabs = html`<slot name="tabs"></slot>`;
    if (size === 'md' || size === 'lg') {
      return html`<div part="app-bar" class="${directive}">
        <div class="app-bar-top-row">${leading}${trailing}</div>
        <div class="app-bar-bottom-row">${title}</div>
      </div>${tabs}`;
    }

    return html`<div part="app-bar" class="${directive}">
      ${leading}${title}${trailing}
    </div>${tabs}`;
  }

  protected override updated() {
    this.updateOverflow();
  }

  /**
   * Hides the trailing actions beyond the limit of the current window size
   * class and shows those that fit again.
   */
  private updateOverflow() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(
      'slot[name="trailing"]',
    );
    const actions = slot?.assignedElements({flatten: true}) ?? [];
    const limit = this.adaptive.options.trailingActions;
    const overflowed: Element[] = [];
    actions.forEach((action, index) => {
      if (index >= limit) {
        overflowed.push(action);
        this.hiddenByOverflow.add(action);
        action.toggleAttribute('hidden', true);
      } else if (this.hiddenByOverflow.has(action)) {
        this.hiddenByOverflow.delete(action);
        action.toggleAttribute('hidden', false);
      }
    });
    const same =
      overflowed.length === this.overflowed.length &&
      overflowed.every((action, i) => action === this.overflowed[i]);
    if (same) return;
    this.overflowed = overflowed;
    this.toggleAttribute('overflowing', overflowed.length > 0);
    this.dispatchEvent(
      new CustomEvent('overflowchange', {
        detail: {overflowed},
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleTrailingSlotChange() {
    this.updateOverflow();
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
