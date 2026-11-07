/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {FOCUS_RING_CLASSES} from '../focus/focus-ring.js';
import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES} from '../shared/pseudo-classes.js';
import {
  fullScreenKeylineList,
  heroKeylineList,
  KeylineList,
  MAX_SMALL_ITEM_SIZE,
  MIN_SMALL_ITEM_SIZE,
  multiBrowseKeylineList,
  uncontainedKeylineList,
} from './keylines.js';
import {
  calculateMaxScrollOffset,
  calculateParallaxItemInfo,
  getSnapPositionOffset,
  getSnapScrollOffset,
  placeCarouselItem,
  Strategy,
} from './strategy.js';

/** Carousel layouts. */
export const CAROUSEL_LAYOUTS = {
  multiBrowse: 'multi-browse',
  uncontained: 'uncontained',
  uncontainedMultiAspect: 'uncontained-multi-aspect',
  hero: 'hero',
  fullScreen: 'full-screen',
} as const;

/** Carousel layout type. */
export type CarouselLayout =
  (typeof CAROUSEL_LAYOUTS)[keyof typeof CAROUSEL_LAYOUTS];

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
export const CAROUSEL_CLASSES = {
  carousel: 'carousel',
  multiBrowse: 'carousel-multi-browse',
  uncontained: 'carousel-uncontained',
  uncontainedMultiAspect: 'carousel-uncontained-multi-aspect',
  hero: 'carousel-hero',
  fullScreen: 'carousel-full-screen',
  centered: 'carousel-centered',
  vertical: 'carousel-vertical',
  snap: 'carousel-snap',
  snapSingle: 'carousel-snap-single',
  scroller: 'carousel-scroller',
  dragging: 'carousel-dragging',
  animating: 'carousel-animating',
} as const;

/** Carousel item classes. */
export const CAROUSEL_ITEM_CLASSES = {
  item: 'carousel-item',
  outlined: 'carousel-item-outlined',
  content: 'carousel-item-content',
  media: 'carousel-item-media',
  label: 'carousel-item-label',
  frame: 'carousel-item-frame',
  action: 'carousel-item-action',
  hover: PSEUDO_CLASSES.hover,
  focus: PSEUDO_CLASSES.focus,
  active: PSEUDO_CLASSES.active,
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/**
 * Custom properties the carousel sets on each item for the current scroll
 * position. Items and their content read them.
 */
export const CAROUSEL_ITEM_PROPERTIES = {
  /** Item translation (`translate` value). */
  translate: '--_carousel-item-translate',
  /** Mask insets from each physical edge of the item, in px. */
  clipTop: '--_carousel-item-clip-top',
  clipRight: '--_carousel-item-clip-right',
  clipBottom: '--_carousel-item-clip-bottom',
  clipLeft: '--_carousel-item-clip-left',
  /** Content parallax (`translate` value), uncontained multi-aspect only. */
  parallax: '--_carousel-item-parallax',
  /** The item's masked size along the scrolling axis, in px. */
  size: '--carousel-item-size',
  /**
   * The item's masked size between the carousel's smallest (0) and largest
   * (1) item size; content such as labels can fade with it.
   */
  fraction: '--carousel-item-fraction',
} as const;

/** The custom property the carousel sets to the large item size. */
export const CAROUSEL_ITEM_SIZE_PROPERTY = '--_carousel-item-main-size';

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
export function layoutSnapsByDefault(layout: CarouselLayout): boolean {
  return (
    layout !== CAROUSEL_LAYOUTS.uncontained &&
    layout !== CAROUSEL_LAYOUTS.uncontainedMultiAspect
  );
}

/**
 * Returns the carousel container classes for the given state.
 *
 * @param state The state of the carousel.
 * @return An object of class names and truthy values if they apply.
 */
export function carouselClasses({
  layout = CAROUSEL_LAYOUTS.multiBrowse,
  alignment = 'start',
  orientation,
  scrollMode,
}: CarouselClassesState = {}): ClassInfo {
  const snap = scrollMode ? scrollMode === 'snap' : layoutSnapsByDefault(layout);
  const vertical = orientation
    ? orientation === 'vertical'
    : layout === CAROUSEL_LAYOUTS.fullScreen;
  // Hero and full-screen carousels advance one item at a time; multi-browse
  // flings through many (Compose `singleAdvanceFlingBehavior` /
  // `multiBrowseFlingBehavior`).
  const single =
    layout === CAROUSEL_LAYOUTS.hero || layout === CAROUSEL_LAYOUTS.fullScreen;
  return {
    [CAROUSEL_CLASSES.carousel]: true,
    [CAROUSEL_CLASSES.multiBrowse]: layout === CAROUSEL_LAYOUTS.multiBrowse,
    [CAROUSEL_CLASSES.uncontained]: layout === CAROUSEL_LAYOUTS.uncontained,
    [CAROUSEL_CLASSES.uncontainedMultiAspect]:
      layout === CAROUSEL_LAYOUTS.uncontainedMultiAspect,
    [CAROUSEL_CLASSES.hero]: layout === CAROUSEL_LAYOUTS.hero,
    [CAROUSEL_CLASSES.fullScreen]: layout === CAROUSEL_LAYOUTS.fullScreen,
    [CAROUSEL_CLASSES.centered]:
      alignment === 'center' && layout === CAROUSEL_LAYOUTS.hero,
    [CAROUSEL_CLASSES.vertical]: vertical,
    [CAROUSEL_CLASSES.snap]: snap,
    [CAROUSEL_CLASSES.snapSingle]: snap && single,
  };
}

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
export function carouselItemClasses({
  outlined = false,
  hover = false,
  focus = false,
  active = false,
  disabled = false,
}: CarouselItemClassesState = {}): ClassInfo {
  return {
    [CAROUSEL_ITEM_CLASSES.item]: true,
    [CAROUSEL_ITEM_CLASSES.outlined]: outlined,
    [CAROUSEL_ITEM_CLASSES.hover]: hover,
    [CAROUSEL_ITEM_CLASSES.focus]: focus,
    [CAROUSEL_ITEM_CLASSES.active]: active,
    [CAROUSEL_ITEM_CLASSES.disabled]: disabled,
  };
}

/** The class for an item's focus frame (outer focus ring). */
export const CAROUSEL_ITEM_FRAME_CLASSES = [
  CAROUSEL_ITEM_CLASSES.frame,
  FOCUS_RING_CLASSES.focusRingOuter,
].join(' ');

/**
 * Compose `CarouselDefaults.singleAdvanceFlingBehavior` snap animation:
 * `spring(stiffness = Spring.StiffnessMediumLow)`, no bounce.
 */
export const SNAP_SPRING_STIFFNESS = 400;

/** Pointer travel (px) before a mouse press becomes a drag. */
const DRAG_SLOP_PX = 6;

/** Velocity projection for a mouse drag release (ms of travel). */
const FLING_PROJECTION_MS = 250;

const FOCUSABLE =
  'a[href], area[href], button, input, select, textarea, iframe, summary, ' +
  '[tabindex], [contenteditable=""], [contenteditable="true"]';

function isFocusable(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  if (el.matches(':disabled') || el.getAttribute('tabindex') === '-1') {
    return false;
  }
  if (el.localName.includes('-') && el.shadowRoot?.delegatesFocus) {
    return true;
  }
  return el.matches(FOCUSABLE) && el.getClientRects().length > 0;
}

/** Resolves a CSS length to px (px, rem, em, % of `percentBasis`). */
function toPx(value: string, el: Element, percentBasis: number): number {
  const v = value.trim();
  const num = parseFloat(v);
  if (!Number.isFinite(num)) return NaN;
  if (v.endsWith('rem')) {
    return num * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  if (v.endsWith('em')) return num * parseFloat(getComputedStyle(el).fontSize);
  if (v.endsWith('%')) return (num / 100) * percentBasis;
  return num;
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

const controllers = new WeakMap<HTMLElement, CarouselController>();

/**
 * Returns the controller set up on a `.carousel` element by `carousel()` or
 * `setupCarousel()`.
 */
export function getCarouselController(
  carousel: HTMLElement,
): CarouselController | undefined {
  return controllers.get(carousel);
}

interface DragState {
  pointerId: number;
  start: number;
  startOffset: number;
  startIndex: number;
  last: number;
  lastTime: number;
  velocity: number;
  active: boolean;
}

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
export class CarouselController {
  /** The scroll container. */
  readonly scroller: HTMLElement;
  /** The carousel element: the shadow host, or the root in Light DOM. */
  get host(): HTMLElement {
    // Read lazily: the directive sets up the root before it is attached.
    const parent = this.root.parentNode;
    return parent instanceof ShadowRoot ? (parent.host as HTMLElement) : this.root;
  }

  private strategy = Strategy.EMPTY;
  private items: HTMLElement[] = [];
  private snapOffsets: number[] = [];
  /** Uncontained multi-aspect: item starts and sizes along the main axis. */
  private itemStarts: number[] = [];
  private itemSizes: number[] = [];
  private crossSize = 0;
  private vertical = false;
  private rtl = false;
  private reducedMotion = prefersReducedMotion();
  private frame = 0;
  private animation = 0;
  private drag: DragState | null = null;
  private pointerFocus = false;
  private readonly observed = new WeakSet<Element>();
  private readonly resizeObserver = new ResizeObserver(() => {
    this.measure();
  });

  constructor(
    readonly root: HTMLElement,
    {signal}: {signal?: AbortSignal} = {},
  ) {
    this.scroller =
      root.querySelector<HTMLElement>(`:scope > .${CAROUSEL_CLASSES.scroller}`) ??
      root;
    controllers.set(root, this);

    const opts = {signal};
    const passive = {signal, passive: true};
    this.scroller.addEventListener('scroll', () => this.requestUpdate(), passive);
    this.scroller.addEventListener('pointerdown', this.onPointerDown, opts);
    this.scroller.addEventListener('pointermove', this.onPointerMove, opts);
    this.scroller.addEventListener('pointerup', this.onPointerUp, opts);
    this.scroller.addEventListener('pointercancel', this.onPointerUp, opts);
    this.scroller.addEventListener('dragstart', this.onDragStart, opts);
    this.scroller.addEventListener('keydown', this.onKeyDown, opts);
    this.scroller.addEventListener('focusin', this.onFocusIn, opts);
    this.scroller.addEventListener('slotchange', () => this.measure(), opts);
    // Any wheel/touch scroll by the user ends a scripted scroll.
    this.scroller.addEventListener('wheel', () => this.stopAnimation(), passive);
    this.scroller.addEventListener(
      'touchstart',
      () => this.stopAnimation(),
      passive,
    );

    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    motion?.addEventListener(
      'change',
      () => {
        this.reducedMotion = motion.matches;
        this.measure();
      },
      opts,
    );

    this.resizeObserver.observe(this.scroller);
    // Layout, alignment and orientation are read from the classes; children
    // from the scroller (Light DOM) or its slot (the element).
    const mutations = new MutationObserver(() => this.measure());
    mutations.observe(root, {attributes: true, attributeFilter: ['class']});
    mutations.observe(this.scroller, {childList: true});
    signal?.addEventListener('abort', () => {
      mutations.disconnect();
      this.resizeObserver.disconnect();
      cancelAnimationFrame(this.frame);
      this.stopAnimation();
      controllers.delete(root);
    });
    // Classes are applied after the directive sets up the element.
    queueMicrotask(() => {
      if (!signal?.aborted) this.measure();
    });
  }

  /** The carousel items, in order. */
  getItems(): HTMLElement[] {
    const slot = this.scroller.querySelector('slot');
    const elements = slot
      ? slot.assignedElements({flatten: true})
      : [...this.scroller.children];
    return elements.filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el.localName !== 'slot',
    );
  }

  /** The layout read from the container's classes. */
  get layout(): CarouselLayout {
    const list = this.root.classList;
    if (list.contains(CAROUSEL_CLASSES.fullScreen)) return 'full-screen';
    if (list.contains(CAROUSEL_CLASSES.hero)) return 'hero';
    if (list.contains(CAROUSEL_CLASSES.uncontainedMultiAspect)) {
      return 'uncontained-multi-aspect';
    }
    if (list.contains(CAROUSEL_CLASSES.uncontained)) return 'uncontained';
    return 'multi-browse';
  }

  /** The current keyline strategy. */
  getStrategy(): Strategy {
    return this.strategy;
  }

  /** The index of the item closest to its snapped position. */
  get currentIndex(): number {
    return this.indexNearest(this.getOffset());
  }

  /**
   * Recomputes the keylines for the container size, item count and tokens,
   * then repositions the items. Called on resize and when items or classes
   * change.
   */
  measure() {
    const root = this.root;
    const scroller = this.scroller;
    this.items = this.getItems();
    const count = this.items.length;
    const style = getComputedStyle(root);
    this.vertical = root.classList.contains(CAROUSEL_CLASSES.vertical);
    this.rtl = !this.vertical && getComputedStyle(scroller).direction === 'rtl';
    const available = this.vertical ? scroller.clientHeight : scroller.clientWidth;
    this.crossSize = this.vertical ? scroller.clientWidth : scroller.clientHeight;
    const read = (prop: string, fallback: number) => {
      const value = toPx(style.getPropertyValue(prop), root, available);
      return Number.isFinite(value) ? value : fallback;
    };
    const itemSpacing = read('--_item-spacing', 0);
    const preferred = read('--item-width', NaN);
    const minSmallItemSize = read('--small-item-min-width', MIN_SMALL_ITEM_SIZE);
    const maxSmallItemSize = read('--small-item-max-width', MAX_SMALL_ITEM_SIZE);
    const beforeContentPadding = read('--_content-padding-start', 0);
    const afterContentPadding = read('--_content-padding-end', 0);
    const layout = this.layout;

    let keylines = KeylineList.EMPTY;
    const options = {
      carouselMainAxisSize: available,
      itemSpacing,
      itemCount: count,
      minSmallItemSize,
      maxSmallItemSize,
    };
    if (available > 0 && count > 0) {
      switch (layout) {
        case 'multi-browse':
          keylines = multiBrowseKeylineList({
            ...options,
            // Compose requires a preferred size; without one, aim for three
            // visible items (spec "Adaptive design": up to three at compact).
            preferredItemSize: Number.isFinite(preferred)
              ? preferred
              : available / 2,
          });
          break;
        case 'uncontained':
          keylines = uncontainedKeylineList({
            ...options,
            itemSize: Number.isFinite(preferred) ? preferred : available * 0.8,
          });
          break;
        case 'hero':
          keylines = heroKeylineList({
            ...options,
            preferredItemSize: Number.isFinite(preferred) ? preferred : null,
            isCentered: root.classList.contains(CAROUSEL_CLASSES.centered),
          });
          break;
        case 'full-screen':
          keylines = fullScreenKeylineList(options);
          break;
        default:
          break;
      }
    }
    this.strategy = new Strategy(
      keylines,
      available,
      itemSpacing,
      beforeContentPadding,
      afterContentPadding,
    );

    const strategy = this.strategy;
    if (strategy.isValid) {
      scroller.style.setProperty(
        CAROUSEL_ITEM_SIZE_PROPERTY,
        `${strategy.itemMainAxisSize}px`,
      );
    } else {
      scroller.style.removeProperty(CAROUSEL_ITEM_SIZE_PROPERTY);
    }

    // Snap each item where Compose's `KeylineSnapPosition` rests it: the
    // snap area starts `snapPositionOffset` before the item.
    const margin = this.vertical ? 'scrollMarginBlockStart' : 'scrollMarginInlineStart';
    this.snapOffsets = [];
    this.itemStarts = [];
    this.itemSizes = [];
    if (layout === 'uncontained-multi-aspect') {
      const scrollerRect = scroller.getBoundingClientRect();
      const offset = this.getOffset();
      for (const item of this.items) {
        item.style[margin] = '';
        const rect = item.getBoundingClientRect();
        let start: number;
        if (this.vertical) {
          start = rect.top - scrollerRect.top - scroller.clientTop + offset;
        } else if (this.rtl) {
          start = scrollerRect.right - scroller.clientLeft - rect.right + offset;
        } else {
          start = rect.left - scrollerRect.left - scroller.clientLeft + offset;
        }
        this.itemStarts.push(start);
        this.itemSizes.push(this.vertical ? rect.height : rect.width);
        this.snapOffsets.push(Math.max(0, start - beforeContentPadding));
        if (!this.observed.has(item)) {
          this.observed.add(item);
          this.resizeObserver.observe(item);
        }
      }
    } else {
      this.items.forEach((item, i) => {
        if (!strategy.isValid) {
          item.style[margin] = '';
          return;
        }
        const position = this.reducedMotion
          ? 0
          : getSnapPositionOffset(strategy, i, count);
        item.style[margin] = `${Math.max(0, position)}px`;
        this.snapOffsets.push(
          this.reducedMotion
            ? Math.min(
                i * (strategy.itemMainAxisSize + itemSpacing),
                calculateMaxScrollOffset(strategy, count),
              )
            : getSnapScrollOffset(strategy, i, count),
        );
      });
    }
    this.update();
  }

  /** Schedules `update()` for the next animation frame. */
  requestUpdate() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.update();
    });
  }

  /** Positions every item for the current scroll offset. */
  update() {
    const items = this.items;
    const count = items.length;
    const offset = this.getOffset();
    const current = this.indexNearest(offset);
    const layout = this.layout;

    if (this.reducedMotion) {
      // Spec "Reduced motion": no parallax, and items no longer expand as
      // they come into view. All items are the same size.
      items.forEach((item, i) => {
        this.setItem(item, 0, 0, 0, null, 1, i, current, count);
      });
      return;
    }

    if (layout === 'uncontained-multi-aspect') {
      const viewport = this.vertical
        ? this.scroller.clientHeight
        : this.scroller.clientWidth;
      items.forEach((item, i) => {
        const size = this.itemSizes[i] ?? 0;
        const info = calculateParallaxItemInfo(
          size,
          this.crossSize,
          (this.itemStarts[i] ?? 0) - offset,
          0,
          viewport,
        );
        const visible = info.maskEnd - info.maskStart;
        this.setItem(
          item,
          0,
          info.maskStart,
          size - info.maskEnd,
          info.parallax,
          size ? visible / size : 1,
          i,
          current,
          count,
          visible,
        );
      });
      return;
    }

    const strategy = this.strategy;
    if (!strategy.isValid) return;
    const maxScrollOffset = calculateMaxScrollOffset(strategy, count);
    const keylines = strategy.getKeylineListForScrollOffset(
      offset,
      maxScrollOffset,
    );
    const range = strategy.maxItemSize - strategy.minItemSize;
    items.forEach((item, i) => {
      const placement = placeCarouselItem(strategy, keylines, i, offset);
      const fraction =
        range > 0 ? (placement.size - strategy.minItemSize) / range : 1;
      this.setItem(
        item,
        placement.translation,
        placement.maskStart,
        strategy.itemMainAxisSize - placement.maskEnd,
        null,
        Math.min(Math.max(fraction, 0), 1),
        i,
        current,
        count,
        placement.size,
      );
    });
  }

  /**
   * Writes one item's custom properties. Main-axis values are in reading
   * direction and mapped to physical edges here.
   */
  private setItem(
    item: HTMLElement,
    translation: number,
    clipStart: number,
    clipEnd: number,
    parallax: number | null,
    fraction: number,
    index: number,
    current: number,
    count: number,
    size?: number,
  ) {
    const p = CAROUSEL_ITEM_PROPERTIES;
    const s = item.style;
    const round = (n: number) => `${Math.round(n * 100) / 100}px`;
    const physical = this.rtl ? -translation : translation;
    s.setProperty(
      p.translate,
      translation === 0
        ? 'none'
        : this.vertical
          ? `0 ${round(physical)}`
          : `${round(physical)} 0`,
    );
    const [top, right, bottom, left] = this.vertical
      ? [clipStart, 0, clipEnd, 0]
      : this.rtl
        ? [0, clipStart, 0, clipEnd]
        : [0, clipEnd, 0, clipStart];
    s.setProperty(p.clipTop, round(top));
    s.setProperty(p.clipRight, round(right));
    s.setProperty(p.clipBottom, round(bottom));
    s.setProperty(p.clipLeft, round(left));
    if (parallax === null || parallax === 0) {
      s.removeProperty(p.parallax);
    } else {
      const physicalParallax = this.rtl ? -parallax : parallax;
      s.setProperty(
        p.parallax,
        this.vertical
          ? `0 ${round(physicalParallax)}`
          : `${round(physicalParallax)} 0`,
      );
    }
    if (size === undefined) {
      s.removeProperty(p.size);
    } else {
      s.setProperty(p.size, round(size));
    }
    s.setProperty(p.fraction, String(Math.round(fraction * 1000) / 1000));
    // The focal item is in front; neighbors descend with distance
    // (`Modifier.carouselItem` zIndex).
    s.zIndex = String(count - Math.abs(index - current));
  }

  /**
   * Scrolls item `index` to its snapped position.
   *
   * @param index The item index.
   * @param behavior `smooth` animates with the carousel's snap spring.
   */
  scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
    if (!this.snapOffsets.length) return;
    const i = Math.min(Math.max(index, 0), this.snapOffsets.length - 1);
    const target = this.snapOffsets[i];
    if (behavior === 'smooth' && !this.reducedMotion) {
      this.animateTo(target, 0);
    } else {
      this.stopAnimation();
      this.setOffset(target);
      this.update();
    }
  }

  /** The scroll distance from the start, in reading direction. */
  getOffset(): number {
    const s = this.scroller;
    if (this.vertical) return s.scrollTop;
    return this.rtl ? -s.scrollLeft : s.scrollLeft;
  }

  private setOffset(offset: number) {
    const s = this.scroller;
    if (this.vertical) {
      s.scrollTop = offset;
    } else {
      s.scrollLeft = this.rtl ? -offset : offset;
    }
  }

  private maxOffset() {
    const s = this.scroller;
    return Math.max(
      0,
      this.vertical
        ? s.scrollHeight - s.clientHeight
        : s.scrollWidth - s.clientWidth,
    );
  }

  private indexNearest(offset: number) {
    let best = 0;
    let bestDistance = Infinity;
    this.snapOffsets.forEach((snap, i) => {
      const distance = Math.abs(snap - offset);
      if (distance < bestDistance) {
        best = i;
        bestDistance = distance;
      }
    });
    return best;
  }

  private get snaps() {
    return this.root.classList.contains(CAROUSEL_CLASSES.snap);
  }

  /**
   * Animates the scroll offset to `target` with a critically damped spring
   * (Compose snap `spring(StiffnessMediumLow)`), starting at `velocity`
   * (px/ms). Native snapping is paused while it runs.
   */
  private animateTo(target: number, velocity: number) {
    this.stopAnimation();
    const from = this.getOffset();
    const max = this.maxOffset();
    const to = Math.min(Math.max(target, 0), max);
    if (Math.abs(to - from) < 0.5) {
      this.setOffset(to);
      return;
    }
    const omega = Math.sqrt(SNAP_SPRING_STIFFNESS);
    const x0 = from - to;
    const v0 = velocity * 1000;
    const start = performance.now();
    this.root.classList.add(CAROUSEL_CLASSES.animating);
    const step = () => {
      const t = (performance.now() - start) / 1000;
      const decay = Math.exp(-omega * t);
      const x = (x0 + (v0 + omega * x0) * t) * decay;
      const v = (v0 - omega * (v0 + omega * x0) * t) * decay;
      if ((Math.abs(x) < 0.5 && Math.abs(v) < 20) || t > 2) {
        this.setOffset(to);
        this.animation = 0;
        this.root.classList.remove(CAROUSEL_CLASSES.animating);
        return;
      }
      this.setOffset(to + x);
      this.animation = requestAnimationFrame(step);
    };
    this.animation = requestAnimationFrame(step);
  }

  private stopAnimation() {
    if (!this.animation) return;
    cancelAnimationFrame(this.animation);
    this.animation = 0;
    this.root.classList.remove(CAROUSEL_CLASSES.animating);
  }

  private pointerPosition(event: PointerEvent) {
    return this.vertical ? event.clientY : event.clientX;
  }

  /** Reading-direction sign of a physical pointer movement. */
  private get direction() {
    return this.rtl ? -1 : 1;
  }

  // Touch and pen scroll natively (with native snapping and momentum); a
  // mouse drags the carousel like a touch would.
  private readonly onPointerDown = (event: PointerEvent) => {
    this.pointerFocus = true;
    setTimeout(() => {
      this.pointerFocus = false;
    });
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    this.stopAnimation();
    const position = this.pointerPosition(event);
    this.drag = {
      pointerId: event.pointerId,
      start: position,
      startOffset: this.getOffset(),
      startIndex: this.currentIndex,
      last: position,
      lastTime: event.timeStamp,
      velocity: 0,
      active: false,
    };
  };

  private readonly onPointerMove = (event: PointerEvent) => {
    const drag = this.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const position = this.pointerPosition(event);
    const delta = position - drag.start;
    if (!drag.active) {
      if (Math.abs(delta) < DRAG_SLOP_PX) return;
      drag.active = true;
      this.scroller.setPointerCapture?.(drag.pointerId);
      this.root.classList.add(CAROUSEL_CLASSES.dragging);
    }
    const dt = event.timeStamp - drag.lastTime;
    if (dt > 0) {
      const v = (position - drag.last) / dt;
      drag.velocity = drag.velocity * 0.2 + v * 0.8;
    }
    drag.last = position;
    drag.lastTime = event.timeStamp;
    this.setOffset(drag.startOffset - delta * this.direction);
  };

  private readonly onPointerUp = (event: PointerEvent) => {
    const drag = this.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    this.drag = null;
    if (!drag.active) return;
    this.scroller.releasePointerCapture?.(drag.pointerId);
    this.root.classList.remove(CAROUSEL_CLASSES.dragging);
    // A drag is not a click on the item under the pointer.
    const suppressClick = (click: Event) => {
      click.preventDefault();
      click.stopPropagation();
    };
    this.scroller.addEventListener('click', suppressClick, {
      capture: true,
      once: true,
    });
    setTimeout(() => {
      this.scroller.removeEventListener('click', suppressClick, {capture: true});
    });
    const offsetVelocity =
      event.type === 'pointercancel' ? 0 : -drag.velocity * this.direction;
    this.settle(drag.startIndex, offsetVelocity);
  };

  private readonly onDragStart = (event: DragEvent) => {
    // Keep images and links from starting a native drag.
    event.preventDefault();
  };

  /** Flings from the current offset and snaps (or stops) where it lands. */
  private settle(startIndex: number, velocity: number) {
    const offset = this.getOffset();
    const projected = offset + velocity * FLING_PROJECTION_MS;
    if (!this.snaps || !this.snapOffsets.length) {
      this.animateTo(projected, velocity);
      return;
    }
    let target = this.indexNearest(projected);
    if (this.root.classList.contains(CAROUSEL_CLASSES.snapSingle)) {
      // `PagerSnapDistance.atMost(1)`: hero and full-screen advance one item.
      target = Math.min(Math.max(target, startIndex - 1), startIndex + 1);
    }
    this.animateTo(this.snapOffsets[target], velocity);
  }

  private itemIndexOf(event: Event) {
    const path = event.composedPath();
    return this.items.findIndex((item) => path.includes(item));
  }

  /** Focuses item `index` and scrolls it to its snapped position. */
  focusItem(index: number) {
    const item = this.items[index];
    if (!item) return;
    const target =
      item.shadowRoot?.delegatesFocus || item.tabIndex >= 0
        ? item
        : (item.querySelector<HTMLElement>(FOCUSABLE) ?? item);
    target.focus({preventScroll: true});
    this.scrollToIndex(index);
  }

  private readonly onFocusIn = (event: FocusEvent) => {
    if (this.pointerFocus) return;
    const index = this.itemIndexOf(event);
    if (index >= 0 && index !== this.currentIndex) {
      this.scrollToIndex(index);
    }
  };

  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const index = this.itemIndexOf(event);
    if (index < 0) return;
    const next = this.vertical
      ? 'ArrowDown'
      : this.rtl
        ? 'ArrowLeft'
        : 'ArrowRight';
    const previous = this.vertical
      ? 'ArrowUp'
      : this.rtl
        ? 'ArrowRight'
        : 'ArrowLeft';
    // Spec "Initial focus": up and down leave the carousel.
    const leaveForward = this.vertical
      ? this.rtl
        ? 'ArrowLeft'
        : 'ArrowRight'
      : 'ArrowDown';
    const leaveBackward = this.vertical
      ? this.rtl
        ? 'ArrowRight'
        : 'ArrowLeft'
      : 'ArrowUp';
    const last = this.items.length - 1;
    let target = -1;
    switch (event.key) {
      case next:
        target = Math.min(index + 1, last);
        break;
      case previous:
        target = Math.max(index - 1, 0);
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = last;
        break;
      case leaveForward:
      case leaveBackward:
        if (this.focusOutside(event.key === leaveForward)) {
          event.preventDefault();
        }
        return;
      default:
        return;
    }
    event.preventDefault();
    this.focusItem(target);
  };

  /**
   * Moves focus to the next (or previous) focusable element outside the
   * carousel, in its root.
   *
   * @return Whether focus moved.
   */
  focusOutside(forward: boolean): boolean {
    const host = this.host;
    const root = host.getRootNode() as Document | ShadowRoot;
    const candidates = [...root.querySelectorAll('*')].filter(
        (el) =>
          el !== host &&
          !host.contains(el) &&
          !el.contains(host) &&
          isFocusable(el),
      ) as HTMLElement[];
    const following = candidates.filter(
      (el) =>
        host.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
    const preceding = candidates.filter(
      (el) =>
        host.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING,
    );
    const target = forward ? following[0] : preceding[preceding.length - 1];
    if (!target) return false;
    target.focus();
    return true;
  }
}

/**
 * Sets up a carousel on a `.carousel` element whose `.carousel-scroller`
 * child holds the items (or is the element itself).
 *
 * @param carousel The carousel root element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export function setupCarousel(
  carousel: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  new CarouselController(carousel, opts);
}

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
export const carousel = createClassMapDirective({
  getClasses: carouselClasses,
  setupElement: setupCarousel,
});

/** A Lit directive that adds carousel item classes to an element. */
export const carouselItem = createClassMapDirective({
  getClasses: carouselItemClasses,
});
