/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../internal/aria/delegate.js';
import {type FabSize} from '../fab/fab.js';
import {applyDisclosure} from '../shared/disclosure.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import fabStyles from '../fab/fab.css' with {type: 'css'}; // github-only
// import {styles as fabStyles} from '../fab/fab.cssresult.js'; // google3-only
import fabMenuStyles from './fab-menu.css' with {type: 'css'}; // github-only
// import {styles as fabMenuStyles} from './fab-menu.cssresult.js'; // google3-only

import {
  FAB_MENU_ALIGNS,
  FAB_MENU_COLORS,
  fabMenuButton,
  fabMenuClasses,
  setupFabMenu,
  type FabMenuAlign,
  type FabMenuColor,
} from './fab-menu.js';

// Separate variable needed for closure.
// spec-labels: fab-menu/specs/anatomy, fab-menu/guidelines/anatomy, fab-menu/specs/variants, fab-menu/specs/configurations
const baseClass = mixinDelegatesAria(LitElement);

/**
 * A Material Design 3 Expressive FAB menu: a FAB that opens a list of
 * related actions and morphs into the menu's close button.
 *
 * Set `aria-label` to describe the menu that the FAB opens.
 *
 * Focus not obscured (WCAG 2.4.11, fab-menu.md): place the FAB menu where
 * its FAB and open list don't completely hide a focused element or its
 * focus indicator; partly covering an element is fine. When it floats over
 * scrolling content, register it with `setupScrollPadding()`
 * (`appbar/scroll-padding.js`, as an `end` bar), and anchor snackbars to it.
 *
 * @slot - The menu's items, typically `<md-gb-fab-menu-item>`s.
 * @slot icon - The FAB's icon. Defaults to an "add" icon.
 * @slot close-icon - The close button's icon. Defaults to a "close" icon.
 * @fires {ToggleEvent} toggle - Fired when the menu opens or closes from user
 *     interaction, before the change. Cancel it to keep the menu as it is.
 * @fires {CustomEvent<FabMenuActivateDetail>} activate - Fired when an item is
 *     activated, before the menu closes. Cancel it to keep the menu open.
 *     --bubbles --composed
 * @csspart fab-menu - The menu's root element.
 * @csspart list - The menu's list of items.
 * @csspart button - The FAB that toggles the menu.
 * @cssprop --close-button-between-space
 * @cssprop --close-button-container-elevation
 * @cssprop --close-button-container-height
 * @cssprop --close-button-container-shape
 * @cssprop --close-button-container-width
 * @cssprop --close-button-icon-size
 * @cssprop --item-between-space
 * @cssprop --item-container-elevation
 * @cssprop --item-container-height
 * @cssprop --item-container-shape
 * @cssprop --item-icon-label-space
 * @cssprop --item-icon-size
 * @cssprop --item-label-text
 * @cssprop --item-label-text-axes
 * @cssprop --item-label-text-tracking
 * @cssprop --item-leading-space
 * @cssprop --item-trailing-space
 */
export class FabMenuElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    fabStyles,
    fabMenuStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: bottom;
      }
      slot[name] {
        display: contents;
      }
    `,
  ];

  /** Whether the menu is open. */
  @property({type: Boolean, reflect: true}) open = false;

  /** The color of the FAB, close button and items. */
  @property() color: FabMenuColor = FAB_MENU_COLORS.primary;

  /** The size of the FAB. The close button is always the same size. */
  @property() size: FabSize = 'default';

  /** The alignment of the items. Defaults to the end, as the FAB. */
  @property() align: FabMenuAlign = FAB_MENU_ALIGNS.end;

  /** The menu's items. */
  get items(): HTMLElement[] {
    return (this.itemSlot?.assignedElements({flatten: true}) ?? []).filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );
  }

  @query('.fab-menu') private readonly root!: HTMLElement | null;
  @query('.fab-menu-list slot') private readonly itemSlot!: HTMLSlotElement | null;
  private cleanup?: AbortController;

  override connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated) this.setupMenu();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup?.abort();
  }

  protected override firstUpdated() {
    this.setupMenu();
  }

  protected override updated() {
    // aria-expanded, aria-controls and the list's inert follow `open`.
    applyDisclosure(this.open, {
      trigger: this.renderRoot.querySelector<HTMLElement>('#button'),
      region: this.renderRoot.querySelector<HTMLElement>('#list'),
    });
  }

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`<div
      part="fab-menu"
      class="${classMap(
        fabMenuClasses({color: this.color, open: this.open, align: this.align}),
      )}">
      <div
        part="list"
        class="fab-menu-list"
        id="list"
        role="menu"
        aria-labelledby="button">
        <slot></slot>
      </div>
      <button
        part="button"
        id="button"
        class="${fabMenuButton({color: this.color, size: this.size})}"
        aria-label="${ariaLabel || nothing}"
        aria-haspopup="menu">
        <span class="fab-menu-button-icon" aria-hidden="true">
          <slot name="icon"
            ><span class="fab-menu-icon-font">add</span></slot
          >
        </span>
        <span class="fab-menu-button-close-icon" aria-hidden="true">
          <slot name="close-icon"
            ><span class="fab-menu-icon-font">close</span></slot
          >
        </span>
      </button>
    </div>`;
  }

  private setupMenu() {
    const root = this.root;
    if (!root) return;
    this.cleanup?.abort();
    this.cleanup = new AbortController();
    const {signal} = this.cleanup;
    setupFabMenu(root, {signal, getItems: () => this.items});
    root.addEventListener(
      'toggle',
      (event) => {
        // Before the change: cancelling the host's event keeps the state.
        const {newState, oldState} = event as ToggleEvent;
        const outer = new ToggleEvent('toggle', {
          newState,
          oldState,
          cancelable: true,
        });
        this.dispatchEvent(outer);
        if (outer.defaultPrevented) {
          event.preventDefault();
          return;
        }
        this.open = newState === 'open';
      },
      {signal},
    );
  }
}
