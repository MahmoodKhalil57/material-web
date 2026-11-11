/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {
  internals,
  mixinElementInternals,
} from '../../internal/behaviors/element-internals.js';

import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../../foundations/interaction/states/ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../../foundations/interaction/states/ripple/ripple.cssresult.js'; // google3-only
import fabMenuStyles from './fab-menu.css' with {type: 'css'}; // github-only
// import {styles as fabMenuStyles} from './fab-menu.cssresult.js'; // google3-only

import {fabMenuItem} from './fab-menu.js';

// Separate variable needed for closure.
const baseClass = mixinElementInternals(LitElement);

/**
 * A Material Design 3 Expressive FAB menu item, for use in an
 * `<md-gb-fab-menu>`. Its colors, sizes and animation come from the menu.
 *
 * @slot - The item's label. FAB menu items should always have a label.
 * @slot icon - The item's leading icon.
 * @csspart item - The item's container.
 */
export class FabMenuItemElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    fabMenuStyles,
    css`
      :host {
        display: flex;
        outline: none;
      }
      ::slotted(*) {
        flex: none;
      }
    `,
  ];

  constructor() {
    super();
    this[internals].role = 'menuitem';
    this.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.click();
      }
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    // Items are focused by the menu with arrow keys (roving focus).
    if (!this.hasAttribute('tabindex')) this.tabIndex = -1;
  }

  protected override render() {
    return html`<div
      part="item"
      class="${fabMenuItem()} ripple-host focus-ring-host">
      <slot name="icon"></slot>
      <slot></slot>
    </div>`;
  }
}
