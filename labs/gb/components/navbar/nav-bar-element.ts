/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, type PropertyValues} from 'lit';
import {property, state} from 'lit/decorators.js';
import {AriaTablistElement} from '../../../aria/tabs/tablist.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {ScrollBehaviorController} from '../shared/scroll-behavior.js';
import {SelectionController} from '../shared/selection.js';

import navBarStyles from './nav-bar.css' with {type: 'css'}; // github-only
// import {styles as navBarStyles} from './nav-bar.cssresult.js'; // google3-only

import {
  MEDIUM_WINDOW_QUERY,
  navBar,
  type NavBarItemLayout,
  type NavBarLayout,
} from './nav-bar.js';
import {NavBarItemElement} from './nav-bar-item-element.js';

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
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    navBarStyles,
    css`
      :host {
        display: flex;
        width: 100%;
      }
    `,
  ];

  /**
   * The layout orientation of items: `vertical`, `horizontal`, or `auto`
   * (vertical in compact windows, horizontal from medium windows, 600px).
   */
  @property({attribute: 'item-layout', reflect: true})
  itemLayout: NavBarLayout = 'vertical';

  /** How the bar reacts to scrolling: `hide` hides it on scroll down. */
  @property({attribute: 'scroll-behavior', reflect: true})
  scrollBehavior?: 'hide';

  /** The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. */
  @property({attribute: 'scroll-target'}) scrollTarget = '';

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
  protected readonly scrollController = new ScrollBehaviorController(this, {
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
  protected readonly selectionModel = new SelectionController<HTMLElement>(this, {
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

  @state() private mediumWindow = false;
  @state() private itemCount = 0;
  private mediaQuery?: MediaQueryList;
  private readonly onMediaChange = () => {
    this.mediumWindow = Boolean(this.mediaQuery?.matches);
  };

  /** The item layout in use (`auto` resolved for the window width). */
  get resolvedItemLayout(): NavBarItemLayout {
    if (this.itemLayout === 'auto') {
      return this.mediumWindow ? 'horizontal' : 'vertical';
    }
    return this.itemLayout === 'horizontal' ? 'horizontal' : 'vertical';
  }

  /**
   * The 0-based index of the currently active navigation bar item.
   * Alias for `selectedTabIndex`.
   */
  @property({type: Number, attribute: 'selected-index', noAccessor: true})
  get selectedIndex(): number {
    return this.selectedTabIndex;
  }
  set selectedIndex(index: number) {
    this.selectedTabIndex = index;
  }

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, navBarStyles);
    this.mediaQuery = window.matchMedia?.(MEDIUM_WINDOW_QUERY);
    this.mediaQuery?.addEventListener('change', this.onMediaChange);
    this.onMediaChange();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.mediaQuery?.removeEventListener('change', this.onMediaChange);
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (
      changedProperties.has('itemLayout') ||
      changedProperties.has('mediumWindow' as keyof NavBarElement)
    ) {
      this.syncItemsLayout();
    }
  }

  protected override render() {
    return html`
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

  protected override handleSlotChange() {
    super.handleSlotChange();
    this.itemCount = this.tabs.length;
    this.syncItemsLayout();
  }

  private syncItemsLayout() {
    const layout = this.resolvedItemLayout;
    for (const tab of this.tabs) {
      if (tab instanceof NavBarItemElement) {
        tab.itemLayout = layout;
      } else {
        tab.setAttribute('item-layout', layout);
      }
    }
  }
}
