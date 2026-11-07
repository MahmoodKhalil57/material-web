/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property} from 'lit/decorators.js';
import {ripple} from '../ripple/ripple.js';
import {hasSlotted} from '../shared/has-slotted.js';
import {CAROUSEL_ITEM_FRAME_CLASSES, carouselItem} from './carousel.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import carouselItemStyles from './carousel-item.css' with {type: 'css'}; // github-only
// import carouselItemStyles from './carousel-item.cssresult.js'; // google3-only

/**
 * A Material Design carousel item, used in `md-gb-carousel`.
 *
 * The item fills with its visual (an `<img>`, `<video>` or other element in
 * the default slot) and is masked to its current size as it moves through
 * the carousel. Optional label text overlays the visual and fades as the
 * item shrinks.
 *
 * Items are focusable and activatable list items: the whole item is a
 * button, or a link with `href`. Name it with `label` (otherwise its label
 * text names it).
 *
 * @slot - The item visual, such as an `<img>` or `<video>`. It is sized to cover the item.
 * @slot label - Brief label text shown over the visual.
 * @csspart item - The item root.
 * @csspart content - The masked visual and label.
 * @csspart label - The label container.
 * @csspart frame - The masked outline, elevation and focus ring.
 * @csspart action - The button or link that activates the item.
 * @cssprop --carousel-item-fraction - Read-only: the item's current size between the carousel's smallest (0) and large (1) item sizes.
 * @cssprop --carousel-item-size - Read-only: the item's current masked size along the scrolling axis.
 * @cssprop --with-outline-outline-color - Outline color of outlined items.
 * @cssprop --with-outline-outline-width - Outline width of outlined items.
 */
export class CarouselItemElement extends LitElement {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    carouselItemStyles,
  ];

  /** The accessible name of the item. Defaults to its label text. */
  @property() label = '';

  /** Makes the item a link to this URL. */
  @property() href = '';

  /** The link target, with `href`. */
  @property() target = '';

  /** Whether the item is disabled. */
  @property({type: Boolean, reflect: true}) disabled = false;

  /** Whether the item has an outline (`with-outline` tokens). */
  @property({type: Boolean, reflect: true}) outlined = false;

  protected readonly internals = this.attachInternals();

  constructor() {
    super();
    this.internals.role = 'listitem';
  }

  protected override render() {
    return html`<div
      part="item"
      class=${carouselItem({outlined: this.outlined, disabled: this.disabled})}>
      <div part="content" class="carousel-item-content">
        <div class="carousel-item-media"><slot></slot></div>
        <div part="label" class="carousel-item-label" id="label">
          <slot name="label" ${hasSlotted()}></slot>
        </div>
      </div>
      <div part="frame" class=${CAROUSEL_ITEM_FRAME_CLASSES}>
        ${this.renderAction()}
      </div>
    </div>`;
  }

  private renderAction() {
    const label = this.label || nothing;
    const labelledby = this.label ? nothing : 'label';
    if (this.href && !this.disabled) {
      return html`<a
        part="action"
        class="carousel-item-action ripple focus-ring-target"
        href=${this.href}
        target=${this.target || nothing}
        aria-label=${label}
        aria-labelledby=${labelledby}
        ${ripple()}></a>`;
    }
    return html`<button
      part="action"
      class="carousel-item-action ripple focus-ring-target"
      ?disabled=${this.disabled}
      aria-label=${label}
      aria-labelledby=${labelledby}
      ${ripple()}></button>`;
  }
}
