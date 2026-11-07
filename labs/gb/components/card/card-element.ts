/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property} from 'lit/decorators.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {ripple} from '../ripple/ripple.js';
import {fxSlot} from '../shared/fx.js';
import {hasSlotted} from '../shared/has-slotted.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import cardStyles from './card.css' with {type: 'css'}; // github-only
// import cardStyles from './card.cssresult.js'; // google3-only

import {type CardColor, card} from './card.js';

// Separate variable needed for closure.
// spec-labels: cards/specs/elevated-card, cards/specs/filled-card, cards/specs/outlined-card, cards/guidelines/usage
const baseClass = mixinDelegatesAria(LitElement);

/**
 * A Material Design card.
 *
 * @slot - Used to display the card's content. The card has 16dp left/right padding; set `--padding-inline: 0` for full-bleed content. Add padding to content, not the host <md-gb-card> element.
 * @slot container - Used to set a custom background container for the card.
 * @csspart card - The card's root element.
 * @csspart card-btn - The card's main action (a button, or a link when `href` is set), when interactive.
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-shape
 * @cssprop --disabled-content-opacity
 * @cssprop --outline-color
 * @cssprop --outline-width
 * @cssprop --state-layer-color
 */
export class CardElement extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    cardStyles,
    css`
      :host {
        display: inline-flex;
        isolation: isolate;
      }
      .card {
        flex: 1;
        position: relative;
      }
      .card:has([name='container'].has-slotted) {
        background-color: transparent;
      }
      slot[name='container'] {
        display: block;
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        --color: var(--container-color);
        z-index: -1;
        transition: inherit;
      }
      :is(.disabled, [aria-disabled='true']) > slot:not([name])::slotted(*) {
        opacity: var(--disabled-content-opacity);
      }
      slot[name='container']::slotted(*) {
        width: 100%;
        height: 100%;
      }
    `,
  ];

  /** The color of the card. */
  @property() color: CardColor = 'outlined';

  /** Whether the card is disabled. */
  @property({type: Boolean}) disabled = false;

  /** Whether the card is interactive. */
  @property({type: Boolean}) interactive = false;

  /**
   * Whether the card is picked up and being dragged (raised elevation). The
   * app moves the card. Spec Cards > Accessibility > Dragging and dismissing
   * (WCAG 2.5.7): also offer a single-pointer alternative, e.g. a menu opened
   * by tapping a "more" button or pressing and holding the card, with move
   * and delete actions (see the "Reorder (drag or menu)" demo). Don't let
   * the menu cover the card.
   */
  @property({type: Boolean, reflect: true}) dragged = false;

  /**
   * Whether an interactive card can be selected: activating it toggles
   * `selected` (selection.md lists cards among the components that can be
   * selected).
   */
  @property({type: Boolean, reflect: true}) selectable = false;

  /**
   * Whether a `selectable` card is selected. A selected card shows a check
   * mark and a change in surface color.
   */
  @property({type: Boolean, reflect: true}) selected = false;

  /**
   * Makes an interactive card a link (spec: directly actionable cards have the
   * button or link role).
   */
  @property() href = '';

  /** The link target, when `href` is set. */
  @property() target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

  protected override render() {
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`<div
      part="card"
      class="${card({
        color: this.color,
        disabled: this.disabled,
        dragged: this.dragged,
        interactive: this.interactive,
        selected: this.selectable && this.selected,
      })}">
      ${this.renderAction(ariaLabel)}
      <slot></slot>
      <slot name="container" ${hasSlotted()} ${fxSlot()}></slot>
    </div>`;
  }

  private renderAction(ariaLabel: string | null) {
    if (!this.interactive) return nothing;
    if (this.href) {
      // A disabled link has no href, so it is neither focusable nor followed.
      return html`<a
        part="card-btn"
        class="card-btn ripple focus-ring-target ${this.disabled
          ? 'disabled'
          : ''}"
        ${ripple()}
        href="${this.disabled ? nothing : this.href}"
        target="${this.target || nothing}"
        aria-disabled="${this.disabled ? 'true' : nothing}"
        aria-label="${ariaLabel || nothing}"></a>`;
    }
    return html`<button
      part="card-btn"
      class="card-btn ripple focus-ring-target"
      ${ripple()}
      ?disabled="${this.disabled}"
      aria-pressed="${this.selectable ? String(this.selected) : nothing}"
      @click="${this.handleToggle}"
      aria-label="${ariaLabel || nothing}"></button>`;
  }

  private readonly handleToggle = () => {
    if (!this.selectable || this.disabled) return;
    this.selected = !this.selected;
    this.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }
}
