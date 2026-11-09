/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement } from 'lit';
import { type CarouselAlignment, type CarouselLayout, type CarouselOrientation, type CarouselScrollMode } from './carousel.js';
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
export declare class CarouselElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** The carousel layout. */
    layout: CarouselLayout;
    /** Start or center alignment of the hero layout. */
    alignment: CarouselAlignment;
    /**
     * The scrolling axis. Defaults to vertical for the full-screen layout and
     * horizontal for the others.
     */
    orientation?: CarouselOrientation;
    /**
     * `snap` snaps items into the layout when released; `free` lets them stop
     * anywhere. Defaults to `free` for uncontained layouts and `snap` for the
     * others.
     */
    scrollMode?: CarouselScrollMode;
    protected readonly internals: ElementInternals;
    constructor();
    /** The carousel items. */
    get items(): HTMLElement[];
    /** The index of the item at (or closest to) its snapped position. */
    get currentIndex(): number;
    /**
     * Scrolls an item to its snapped position in the layout.
     *
     * @param index The item index.
     * @param behavior `smooth` (default) animates with the snap spring.
     */
    scrollToItem(index: number, behavior?: ScrollBehavior): void;
    /** Scrolls to the next item. */
    next(behavior?: ScrollBehavior): void;
    /** Scrolls to the previous item. */
    previous(behavior?: ScrollBehavior): void;
    /**
     * Recomputes the layout. The carousel does this on resize and when items
     * or properties change; call it after changing `--item-width` or other
     * layout tokens.
     */
    relayout(): void;
    private get controller();
    protected render(): import("lit-html").TemplateResult<1>;
    protected updated(): void;
}
