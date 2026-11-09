/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
import { Strategy } from './strategy.js';
/** Carousel layouts. */
export declare const CAROUSEL_LAYOUTS: {
    readonly multiBrowse: "multi-browse";
    readonly uncontained: "uncontained";
    readonly uncontainedMultiAspect: "uncontained-multi-aspect";
    readonly hero: "hero";
    readonly fullScreen: "full-screen";
};
/** Carousel layout type. */
export type CarouselLayout = (typeof CAROUSEL_LAYOUTS)[keyof typeof CAROUSEL_LAYOUTS];
/** The container size up to which a hero carousel shows one large item. */
export declare const HERO_COMPACT_MAX_SIZE = 600;
/** The large item size of a hero carousel in a container wider than that. */
export declare const HERO_WIDE_LARGE_ITEM_SIZE = 400;
/** Carousel alignment. `center` applies to the hero layout. */
export type CarouselAlignment = 'start' | 'center';
/** Carousel scrolling axis. */
export type CarouselOrientation = 'horizontal' | 'vertical';
/**
 * How a carousel scrolls: `snap` snaps items to the layout when released,
 * `free` stops anywhere. Defaults to `free` for uncontained layouts and
 * `snap` for the others (spec "Behavior > Scrolling").
 */
export type CarouselScrollMode = 'snap' | 'free';
/** Carousel classes. */
export declare const CAROUSEL_CLASSES: {
    readonly carousel: "carousel";
    readonly multiBrowse: "carousel-multi-browse";
    readonly uncontained: "carousel-uncontained";
    readonly uncontainedMultiAspect: "carousel-uncontained-multi-aspect";
    readonly hero: "carousel-hero";
    readonly fullScreen: "carousel-full-screen";
    readonly centered: "carousel-centered";
    readonly vertical: "carousel-vertical";
    readonly snap: "carousel-snap";
    readonly snapSingle: "carousel-snap-single";
    readonly scroller: "carousel-scroller";
    readonly dragging: "carousel-dragging";
    readonly animating: "carousel-animating";
};
/** Carousel item classes. */
export declare const CAROUSEL_ITEM_CLASSES: {
    readonly item: "carousel-item";
    readonly outlined: "carousel-item-outlined";
    readonly content: "carousel-item-content";
    readonly media: "carousel-item-media";
    readonly label: "carousel-item-label";
    readonly frame: "carousel-item-frame";
    readonly action: "carousel-item-action";
    readonly hover: string;
    readonly focus: string;
    readonly active: string;
    readonly disabled: string;
};
/**
 * Custom properties the carousel sets on each item for the current scroll
 * position. Items and their content read them.
 */
export declare const CAROUSEL_ITEM_PROPERTIES: {
    /** Item translation (`translate` value). */
    readonly translate: "--_carousel-item-translate";
    /** Mask insets from each physical edge of the item, in px. */
    readonly clipTop: "--_carousel-item-clip-top";
    readonly clipRight: "--_carousel-item-clip-right";
    readonly clipBottom: "--_carousel-item-clip-bottom";
    readonly clipLeft: "--_carousel-item-clip-left";
    /** Content parallax (`translate` value), uncontained multi-aspect only. */
    readonly parallax: "--_carousel-item-parallax";
    /** The item's masked size along the scrolling axis, in px. */
    readonly size: "--carousel-item-size";
    /**
     * The item's masked size between the carousel's smallest (0) and largest
     * (1) item size; content such as labels can fade with it.
     */
    readonly fraction: "--carousel-item-fraction";
};
/** The custom property the carousel sets to the large item size. */
export declare const CAROUSEL_ITEM_SIZE_PROPERTY = "--_carousel-item-main-size";
/** The state provided to `carouselClasses()`. */
export interface CarouselClassesState {
    /** The carousel layout. Defaults to multi-browse. */
    layout?: CarouselLayout;
    /** Start or center alignment (hero layout). */
    alignment?: CarouselAlignment;
    /** The scrolling axis. Defaults to vertical for full-screen. */
    orientation?: CarouselOrientation;
    /** Snap or free scrolling. Defaults to the layout's recommendation. */
    scrollMode?: CarouselScrollMode;
}
/** Whether a layout snaps by default (spec "Behavior > Scrolling"). */
export declare function layoutSnapsByDefault(layout: CarouselLayout): boolean;
/**
 * Returns the carousel container classes for the given state.
 *
 * @param state The state of the carousel.
 * @return An object of class names and truthy values if they apply.
 */
export declare function carouselClasses({ layout, alignment, orientation, scrollMode, }?: CarouselClassesState): ClassInfo;
/** The state provided to `carouselItemClasses()`. */
export interface CarouselItemClassesState {
    /** Whether the item has an outline (`with-outline` tokens). */
    outlined?: boolean;
    /** Emulates `:hover`. */
    hover?: boolean;
    /** Emulates `:focus-within`. */
    focus?: boolean;
    /** Emulates `:active`. */
    active?: boolean;
    /** Whether the item is disabled. */
    disabled?: boolean;
}
/**
 * Returns the carousel item classes for the given state.
 *
 * @param state The state of the item.
 * @return An object of class names and truthy values if they apply.
 */
export declare function carouselItemClasses({ outlined, hover, focus, active, disabled, }?: CarouselItemClassesState): ClassInfo;
/** The class for an item's focus frame (outer focus ring). */
export declare const CAROUSEL_ITEM_FRAME_CLASSES: string;
/**
 * Compose `CarouselDefaults.singleAdvanceFlingBehavior` snap animation:
 * `spring(stiffness = Spring.StiffnessMediumLow)`, no bounce.
 */
export declare const SNAP_SPRING_STIFFNESS = 400;
/**
 * Returns the controller set up on a `.carousel` element by `carousel()` or
 * `setupCarousel()`.
 */
export declare function getCarouselController(carousel: HTMLElement): CarouselController | undefined;
/**
 * Lays out and drives a carousel: computes the keyline strategy once per
 * resize, then on every scroll frame sets each item's mask, translation and
 * size fraction (`CAROUSEL_ITEM_PROPERTIES`). Handles snapping, mouse drag,
 * keyboard navigation and reduced motion.
 *
 * The keyline and strategy math is a port of Compose Material 3's carousel
 * (see `keylines.ts` and `strategy.ts`); items are laid out end-to-end in a
 * native scroll container at the strategy's large item size, like Compose's
 * `Pager`, and masked/translated onto the keylines with CSS.
 */
export declare class CarouselController {
    readonly root: HTMLElement;
    /** The scroll container. */
    readonly scroller: HTMLElement;
    /** The carousel element: the shadow host, or the root in Light DOM. */
    get host(): HTMLElement;
    private strategy;
    private items;
    private snapOffsets;
    /** See `Strategy.originShift`. */
    private originShift;
    /** Uncontained multi-aspect: item starts and sizes along the main axis. */
    private itemStarts;
    private itemSizes;
    private crossSize;
    private vertical;
    private rtl;
    private reducedMotion;
    private frame;
    private animation;
    private dragStartOffset;
    private dragStartIndex;
    private pointerFocus;
    private readonly observed;
    private readonly resizeObserver;
    constructor(root: HTMLElement, { signal }?: {
        signal?: AbortSignal;
    });
    /** The carousel items, in order. */
    getItems(): HTMLElement[];
    /** The layout read from the container's classes. */
    get layout(): CarouselLayout;
    /** The current keyline strategy. */
    getStrategy(): Strategy;
    /** The index of the item closest to its snapped position. */
    get currentIndex(): number;
    /**
     * Recomputes the keylines for the container size, item count and tokens,
     * then repositions the items. Called on resize and when items or classes
     * change.
     */
    measure(): void;
    /** Schedules `update()` for the next animation frame. */
    requestUpdate(): void;
    /** Positions every item for the current scroll offset. */
    update(): void;
    /**
     * Writes one item's custom properties. Main-axis values are in reading
     * direction and mapped to physical edges here.
     */
    private setItem;
    /**
     * Scrolls item `index` to its snapped position.
     *
     * @param index The item index.
     * @param behavior `smooth` animates with the carousel's snap spring.
     */
    scrollToIndex(index: number, behavior?: ScrollBehavior): void;
    /**
     * Trailing space of a centered strategy that lets the last item scroll to
     * the middle too. The items stay where they are in the flow (scroll offset
     * `i * stride` rests item `i`); `update()` translates them by
     * `originShift` onto the keylines.
     */
    private applyCenteredPadding;
    /** The scroll distance from the start, in reading direction. */
    getOffset(): number;
    private setOffset;
    private maxOffset;
    private indexNearest;
    private get snaps();
    /**
     * Animates the scroll offset to `target` with a critically damped spring
     * (Compose snap `spring(StiffnessMediumLow)`), starting at `velocity`
     * (px/ms). Native snapping is paused while it runs.
     */
    private animateTo;
    private stopAnimation;
    /** Reading-direction sign of a physical pointer movement. */
    private get direction();
    private readonly onPointerDown;
    private startDrag;
    private endDrag;
    private readonly onDragStart;
    /** Flings from the current offset and snaps (or stops) where it lands. */
    private settle;
    private itemIndexOf;
    /** Focuses item `index` and scrolls it to its snapped position. */
    focusItem(index: number): void;
    private readonly onFocusIn;
    private readonly onKeyDown;
    /**
     * Moves focus to the next (or previous) focusable element outside the
     * carousel, in its root.
     *
     * @return Whether focus moved.
     */
    focusOutside(forward: boolean): boolean;
}
/**
 * Sets up a carousel on a `.carousel` element whose `.carousel-scroller`
 * child holds the items (or is the element itself).
 *
 * @param carousel The carousel root element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export declare function setupCarousel(carousel: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds carousel classes and the keyline layout to a
 * `.carousel` element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${carousel({layout: 'hero'})}" role="region"
 *       aria-roledescription="carousel" aria-label="Featured">
 *     <ul class="carousel-scroller">
 *       <li class="${carouselItem()}">...</li>
 *     </ul>
 *   </div>
 * `;
 * ```
 */
export declare const carousel: (state?: CarouselClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/** A Lit directive that adds carousel item classes to an element. */
export declare const carouselItem: (state?: CarouselItemClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
