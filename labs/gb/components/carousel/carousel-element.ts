/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type CSSResultOrNative, html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {
  carousel,
  type CarouselAlignment,
  type CarouselController,
  type CarouselLayout,
  type CarouselOrientation,
  type CarouselScrollMode,
  getCarouselController,
} from './carousel.js';

import carouselStyles from './carousel.css' with {type: 'css'}; // github-only
// import carouselStyles from './carousel.cssresult.js'; // google3-only

/**
 * A Material Design carousel: a scrollable list of visual items that change
 * size as they move through the layout.
 *
 * Layouts (spec "Specs"):
 * - `multi-browse` (default): large, medium and small items; snap-scrolls.
 * - `uncontained`: same-size items that scroll to the container's edges;
 *   scrolls freely.
 * - `uncontained-multi-aspect`: uncontained items of their own widths (set a
 *   width or `aspect-ratio` on each item) that mask with parallax at the
 *   edges.
 * - `hero`: one or more large items and a small item; snap-scrolls one item
 *   at a time. `alignment="center"` centers the large item between two small
 *   items.
 * - `full-screen`: one edge-to-edge item; scrolls vertically and snaps.
 *
 * Set the large item width with `--item-width` (default: the layout's
 * choice). Give the carousel a height with `--height` or `block-size`.
 *
 * The host is a `region` with the `carousel` role description; label it
 * with `aria-label`. Items are a list, so assistive technology announces the
 * focused item's position and the item count. Tab moves through the items,
 * the arrow keys move between them (Home/End jump to the ends), and up/down
 * (left/right in a vertical carousel) move focus out of the carousel. With
 * `prefers-reduced-motion`, items keep one size and lose the parallax.
 *
 * @slot - The `md-gb-carousel-item` elements.
 * @csspart carousel - The container.
 * @csspart scroller - The scroll container (`role="list"`).
 * @cssprop --height - Carousel height (default 221px, Compose samples).
 * @cssprop --item-width - Preferred large item width (multi-browse, hero) or item width (uncontained). `auto` picks a layout default.
 * @cssprop --item-spacing - Space between items.
 * @cssprop --full-screen-item-spacing - Space between full-screen items.
 * @cssprop --padding-inline - Leading/trailing container padding.
 * @cssprop --padding-block - Top/bottom container padding.
 * @cssprop --small-item-min-width - Minimum small item width.
 * @cssprop --small-item-max-width - Maximum small item width.
 * @cssprop --container-color - Item container color, behind its visual.
 * @cssprop --container-elevation - Item elevation.
 * @cssprop --container-shape - Item corner radius.
 * @cssprop --label-text - Item label typography.
 * @cssprop --label-text-axes - Item label font variation settings.
 * @cssprop --label-text-color - Item label color.
 * @cssprop --label-text-tracking - Item label letter spacing.
 * @cssprop --label-scrim-color - Scrim behind item labels.
 * @cssprop --label-padding - Item label padding.
 */
export class CarouselElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [carouselStyles];

  /** The carousel layout. */
  @property({reflect: true}) layout: CarouselLayout = 'multi-browse';

  /** Start or center alignment of the hero layout. */
  @property({reflect: true}) alignment: CarouselAlignment = 'start';

  /**
   * The scrolling axis. Defaults to vertical for the full-screen layout and
   * horizontal for the others.
   */
  @property({reflect: true}) orientation?: CarouselOrientation;

  /**
   * `snap` snaps items into the layout when released; `free` lets them stop
   * anywhere. Defaults to `free` for uncontained layouts and `snap` for the
   * others.
   */
  @property({attribute: 'scroll-mode', reflect: true})
  scrollMode?: CarouselScrollMode;

  protected readonly internals = this.attachInternals();

  constructor() {
    super();
    this.internals.role = 'region';
    this.internals.ariaRoleDescription = 'carousel';
  }

  /** The carousel items. */
  get items(): HTMLElement[] {
    return this.controller?.getItems() ?? [];
  }

  /** The index of the item at (or closest to) its snapped position. */
  get currentIndex(): number {
    return this.controller?.currentIndex ?? 0;
  }

  /**
   * Scrolls an item to its snapped position in the layout.
   *
   * @param index The item index.
   * @param behavior `smooth` (default) animates with the snap spring.
   */
  scrollToItem(index: number, behavior: ScrollBehavior = 'smooth') {
    this.controller?.scrollToIndex(index, behavior);
  }

  /** Scrolls to the next item. */
  next(behavior: ScrollBehavior = 'smooth') {
    this.scrollToItem(this.currentIndex + 1, behavior);
  }

  /** Scrolls to the previous item. */
  previous(behavior: ScrollBehavior = 'smooth') {
    this.scrollToItem(this.currentIndex - 1, behavior);
  }

  /**
   * Recomputes the layout. The carousel does this on resize and when items
   * or properties change; call it after changing `--item-width` or other
   * layout tokens.
   */
  relayout() {
    this.controller?.measure();
  }

  private get controller(): CarouselController | undefined {
    const root = this.renderRoot?.querySelector<HTMLElement>('.carousel');
    return root ? getCarouselController(root) : undefined;
  }

  protected override render() {
    return html`<div
      part="carousel"
      class=${carousel({
        layout: this.layout,
        alignment: this.alignment,
        orientation: this.orientation,
        scrollMode: this.scrollMode,
      })}>
      <div part="scroller" class="carousel-scroller" role="list">
        <slot></slot>
      </div>
    </div>`;
  }

  protected override updated() {
    // Properties map to classes; lay out again with the new classes.
    this.controller?.measure();
  }
}
