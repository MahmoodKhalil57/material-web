/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { FOCUS_RING_CLASSES } from '../focus/focus-ring.js';
import { createClassMapDirective } from '../shared/directives.js';
import { DragGesture } from '../shared/drag-gesture.js';
import { isReducedMotion, onReducedMotionChange } from '../shared/motion.js';
import { PSEUDO_CLASSES } from '../shared/pseudo-classes.js';
import { nextFocusIndex } from '../shared/roving-focus.js';
import { fullScreenKeylineList, heroKeylineList, KeylineList, MAX_SMALL_ITEM_SIZE, MIN_SMALL_ITEM_SIZE, multiBrowseKeylineList, uncontainedKeylineList, } from './keylines.js';
import { calculateMaxScrollOffset, calculateParallaxItemInfo, getSnapPositionOffset, getSnapScrollOffset, placeCarouselItem, Strategy, } from './strategy.js';
/** Carousel layouts. */
export const CAROUSEL_LAYOUTS = {
    multiBrowse: 'multi-browse',
    uncontained: 'uncontained',
    uncontainedMultiAspect: 'uncontained-multi-aspect',
    hero: 'hero',
    fullScreen: 'full-screen',
};
/** The container size up to which a hero carousel shows one large item. */
export const HERO_COMPACT_MAX_SIZE = 600;
/** The large item size of a hero carousel in a container wider than that. */
export const HERO_WIDE_LARGE_ITEM_SIZE = 400;
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
};
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
};
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
};
/** The custom property the carousel sets to the large item size. */
export const CAROUSEL_ITEM_SIZE_PROPERTY = '--_carousel-item-main-size';
/** Whether a layout snaps by default (spec "Behavior > Scrolling"). */
export function layoutSnapsByDefault(layout) {
    return (layout !== CAROUSEL_LAYOUTS.uncontained &&
        layout !== CAROUSEL_LAYOUTS.uncontainedMultiAspect);
}
/**
 * Returns the carousel container classes for the given state.
 *
 * @param state The state of the carousel.
 * @return An object of class names and truthy values if they apply.
 */
export function carouselClasses({ layout = CAROUSEL_LAYOUTS.multiBrowse, alignment = 'start', orientation, scrollMode, } = {}) {
    const snap = scrollMode ? scrollMode === 'snap' : layoutSnapsByDefault(layout);
    const vertical = orientation
        ? orientation === 'vertical'
        : layout === CAROUSEL_LAYOUTS.fullScreen;
    // Hero and full-screen carousels advance one item at a time; multi-browse
    // flings through many (Compose `singleAdvanceFlingBehavior` /
    // `multiBrowseFlingBehavior`).
    const single = layout === CAROUSEL_LAYOUTS.hero || layout === CAROUSEL_LAYOUTS.fullScreen;
    return {
        [CAROUSEL_CLASSES.carousel]: true,
        [CAROUSEL_CLASSES.multiBrowse]: layout === CAROUSEL_LAYOUTS.multiBrowse,
        [CAROUSEL_CLASSES.uncontained]: layout === CAROUSEL_LAYOUTS.uncontained,
        [CAROUSEL_CLASSES.uncontainedMultiAspect]: layout === CAROUSEL_LAYOUTS.uncontainedMultiAspect,
        [CAROUSEL_CLASSES.hero]: layout === CAROUSEL_LAYOUTS.hero,
        [CAROUSEL_CLASSES.fullScreen]: layout === CAROUSEL_LAYOUTS.fullScreen,
        [CAROUSEL_CLASSES.centered]: alignment === 'center' && layout === CAROUSEL_LAYOUTS.hero,
        [CAROUSEL_CLASSES.vertical]: vertical,
        [CAROUSEL_CLASSES.snap]: snap,
        [CAROUSEL_CLASSES.snapSingle]: snap && single,
    };
}
/**
 * Returns the carousel item classes for the given state.
 *
 * @param state The state of the item.
 * @return An object of class names and truthy values if they apply.
 */
export function carouselItemClasses({ outlined = false, hover = false, focus = false, active = false, disabled = false, } = {}) {
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
const FOCUSABLE = 'a[href], area[href], button, input, select, textarea, iframe, summary, ' +
    '[tabindex], [contenteditable=""], [contenteditable="true"]';
function isFocusable(el) {
    if (!(el instanceof HTMLElement))
        return false;
    if (el.matches(':disabled') || el.getAttribute('tabindex') === '-1') {
        return false;
    }
    if (el.localName.includes('-') && el.shadowRoot?.delegatesFocus) {
        return true;
    }
    return el.matches(FOCUSABLE) && el.getClientRects().length > 0;
}
/** Resolves a CSS length to px (px, rem, em, % of `percentBasis`). */
function toPx(value, el, percentBasis) {
    const v = value.trim();
    const num = parseFloat(v);
    if (!Number.isFinite(num))
        return NaN;
    if (v.endsWith('rem')) {
        return num * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
    if (v.endsWith('em'))
        return num * parseFloat(getComputedStyle(el).fontSize);
    if (v.endsWith('%'))
        return (num / 100) * percentBasis;
    return num;
}
const controllers = new WeakMap();
/**
 * Returns the controller set up on a `.carousel` element by `carousel()` or
 * `setupCarousel()`.
 */
export function getCarouselController(carousel) {
    return controllers.get(carousel);
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
    /** The carousel element: the shadow host, or the root in Light DOM. */
    get host() {
        // Read lazily: the directive sets up the root before it is attached.
        const parent = this.root.parentNode;
        return parent instanceof ShadowRoot ? parent.host : this.root;
    }
    constructor(root, { signal } = {}) {
        this.root = root;
        this.strategy = Strategy.EMPTY;
        this.items = [];
        this.snapOffsets = [];
        /** See `Strategy.originShift`. */
        this.originShift = 0;
        /** Uncontained multi-aspect: item starts and sizes along the main axis. */
        this.itemStarts = [];
        this.itemSizes = [];
        this.crossSize = 0;
        this.vertical = false;
        this.rtl = false;
        this.reducedMotion = false;
        this.frame = 0;
        this.animation = 0;
        this.dragStartOffset = 0;
        this.dragStartIndex = 0;
        this.pointerFocus = false;
        this.observed = new WeakSet();
        this.resizeObserver = new ResizeObserver(() => {
            this.measure();
        });
        // Touch and pen scroll natively (with native snapping and momentum); a
        // mouse drags the carousel like a touch would, through the shared
        // DragGesture (slop, pointer capture, release velocity, and no click on the
        // item under the pointer after a drag).
        this.onPointerDown = (event) => {
            this.pointerFocus = true;
            setTimeout(() => {
                this.pointerFocus = false;
            });
            if (event.pointerType === 'mouse' && event.button === 0) {
                this.stopAnimation();
            }
        };
        this.onDragStart = (event) => {
            // Keep images and links from starting a native drag.
            event.preventDefault();
        };
        this.onFocusIn = (event) => {
            if (this.pointerFocus)
                return;
            const index = this.itemIndexOf(event);
            if (index >= 0 && index !== this.currentIndex) {
                this.scrollToIndex(index);
            }
        };
        this.onKeyDown = (event) => {
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
                return;
            }
            const index = this.itemIndexOf(event);
            if (index < 0)
                return;
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
            // Along the carousel: shared roving focus movement, no wrap, RTL-aware.
            // spec: carousel/accessibility/keyboard-navigation, carousel-3c6fc2, carousel-040924, carousel-15628b
            const target = nextFocusIndex(this.items.length, index, event.key, {
                orientation: this.vertical ? 'vertical' : 'horizontal',
                wrap: false,
                rtl: this.rtl,
            });
            if (target >= 0) {
                event.preventDefault();
                this.focusItem(target);
                return;
            }
            if (event.key === next || event.key === previous) {
                // At either end: stay, and don't scroll the page.
                event.preventDefault();
                return;
            }
            if (event.key === leaveForward || event.key === leaveBackward) {
                if (this.focusOutside(event.key === leaveForward))
                    event.preventDefault();
            }
        };
        this.scroller =
            root.querySelector(`:scope > .${CAROUSEL_CLASSES.scroller}`) ??
                root;
        controllers.set(root, this);
        this.reducedMotion = isReducedMotion(root);
        const opts = { signal };
        const passive = { signal, passive: true };
        this.scroller.addEventListener('scroll', () => this.requestUpdate(), passive);
        this.scroller.addEventListener('pointerdown', this.onPointerDown, opts);
        const carousel = this;
        const gesture = new DragGesture(this.scroller, {
            // The scroll axis follows the orientation, which can change.
            get axis() {
                return carousel.vertical ? 'y' : 'x';
            },
            slop: DRAG_SLOP_PX,
            canStart: (event) => event.pointerType === 'mouse',
            onStart: () => this.startDrag(),
            onMove: (delta) => this.setOffset(this.dragStartOffset - delta * this.direction),
            onEnd: (_delta, velocity) => this.endDrag(velocity),
            onCancel: () => this.endDrag(0),
        });
        signal?.addEventListener('abort', () => gesture.disconnect());
        this.scroller.addEventListener('dragstart', this.onDragStart, opts);
        this.scroller.addEventListener('keydown', this.onKeyDown, opts);
        this.scroller.addEventListener('focusin', this.onFocusIn, opts);
        this.scroller.addEventListener('slotchange', () => this.measure(), opts);
        // Any wheel/touch scroll by the user ends a scripted scroll.
        this.scroller.addEventListener('wheel', () => this.stopAnimation(), passive);
        this.scroller.addEventListener('touchstart', () => this.stopAnimation(), passive);
        onReducedMotionChange(() => {
            this.reducedMotion = isReducedMotion(this.root);
            this.measure();
        }, signal);
        this.resizeObserver.observe(this.scroller);
        // Layout, alignment and orientation are read from the classes; children
        // from the scroller (Light DOM) or its slot (the element).
        const mutations = new MutationObserver(() => this.measure());
        mutations.observe(root, { attributes: true, attributeFilter: ['class'] });
        mutations.observe(this.scroller, { childList: true });
        signal?.addEventListener('abort', () => {
            mutations.disconnect();
            this.resizeObserver.disconnect();
            cancelAnimationFrame(this.frame);
            this.stopAnimation();
            controllers.delete(root);
        });
        // Classes are applied after the directive sets up the element.
        queueMicrotask(() => {
            if (!signal?.aborted)
                this.measure();
        });
    }
    /** The carousel items, in order. */
    getItems() {
        const slot = this.scroller.querySelector('slot');
        const elements = slot
            ? slot.assignedElements({ flatten: true })
            : [...this.scroller.children];
        return elements.filter((el) => el instanceof HTMLElement && el.localName !== 'slot');
    }
    /** The layout read from the container's classes. */
    get layout() {
        const list = this.root.classList;
        if (list.contains(CAROUSEL_CLASSES.fullScreen))
            return 'full-screen';
        if (list.contains(CAROUSEL_CLASSES.hero))
            return 'hero';
        if (list.contains(CAROUSEL_CLASSES.uncontainedMultiAspect)) {
            return 'uncontained-multi-aspect';
        }
        if (list.contains(CAROUSEL_CLASSES.uncontained))
            return 'uncontained';
        return 'multi-browse';
    }
    /** The current keyline strategy. */
    getStrategy() {
        return this.strategy;
    }
    /** The index of the item closest to its snapped position. */
    get currentIndex() {
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
        const read = (prop, fallback) => {
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
                        // Compact containers show one large item; wider ones fit more
                        // (guidelines Hero: "On larger screens, more large items are
                        // visible").
                        preferredItemSize: Number.isFinite(preferred)
                            ? preferred
                            : available > HERO_COMPACT_MAX_SIZE
                                ? HERO_WIDE_LARGE_ITEM_SIZE
                                : null,
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
        // A center-aligned hero rests with its first large item in the middle
        // (arrangements that cannot be centered start at the edge).
        const centered = layout === 'hero' &&
            root.classList.contains(CAROUSEL_CLASSES.centered) &&
            !this.reducedMotion &&
            !keylines.isEmpty() &&
            !keylines.isFirstFocalItemAtStartOfContainer();
        this.strategy = new Strategy(keylines, available, itemSpacing, beforeContentPadding, afterContentPadding, centered);
        this.originShift = this.strategy.originShift;
        this.applyCenteredPadding(available, itemSpacing);
        const strategy = this.strategy;
        if (strategy.isValid) {
            scroller.style.setProperty(CAROUSEL_ITEM_SIZE_PROPERTY, `${strategy.itemMainAxisSize}px`);
        }
        else {
            scroller.style.removeProperty(CAROUSEL_ITEM_SIZE_PROPERTY);
        }
        // Snap each item where Compose's `KeylineSnapPosition` rests it: the
        // snap area starts `snapPositionOffset` before the item.
        const margin = this.vertical ? 'scrollMarginBlockStart' : 'scrollMarginInlineStart';
        this.snapOffsets = [];
        this.itemStarts = [];
        this.itemSizes = [];
        if (layout === 'uncontained-multi-aspect') {
            // "Item widths can range anywhere between 9:16 for min width size to
            // 16:9 for max width."
            const minKey = this.vertical ? 'minBlockSize' : 'minInlineSize';
            const maxKey = this.vertical ? 'maxBlockSize' : 'maxInlineSize';
            for (const item of this.items) {
                item.style[minKey] = `${(this.crossSize * 9) / 16}px`;
                item.style[maxKey] = `${(this.crossSize * 16) / 9}px`;
            }
            const scrollerRect = scroller.getBoundingClientRect();
            const offset = this.getOffset();
            for (const item of this.items) {
                item.style[margin] = '';
                const rect = item.getBoundingClientRect();
                let start;
                if (this.vertical) {
                    start = rect.top - scrollerRect.top - scroller.clientTop + offset;
                }
                else if (this.rtl) {
                    start = scrollerRect.right - scroller.clientLeft - rect.right + offset;
                }
                else {
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
        }
        else {
            this.items.forEach((item, i) => {
                if (!strategy.isValid) {
                    item.style[margin] = '';
                    return;
                }
                const position = this.reducedMotion
                    ? 0
                    : strategy.centered
                        ? 0
                        : getSnapPositionOffset(strategy, i, count);
                item.style[margin] = `${Math.max(0, position)}px`;
                this.snapOffsets.push(strategy.centered
                    ? Math.min(i * (strategy.itemMainAxisSize + itemSpacing), this.maxOffset())
                    : this.reducedMotion
                        ? Math.min(i * (strategy.itemMainAxisSize + itemSpacing), calculateMaxScrollOffset(strategy, count))
                        : getSnapScrollOffset(strategy, i, count));
            });
        }
        this.update();
    }
    /** Schedules `update()` for the next animation frame. */
    requestUpdate() {
        if (this.frame)
            return;
        this.frame = requestAnimationFrame(() => {
            this.frame = 0;
            this.update();
        });
    }
    /** Positions every item for the current scroll offset. */
    update() {
        const items = this.items;
        const count = items.length;
        // Scrolling starts `originShift` before the first item's natural place.
        const offset = this.getOffset() - this.originShift;
        const current = this.indexNearest(this.getOffset());
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
                const info = calculateParallaxItemInfo(size, this.crossSize, (this.itemStarts[i] ?? 0) - offset, 0, viewport);
                const visible = info.maskEnd - info.maskStart;
                this.setItem(item, 0, info.maskStart, size - info.maskEnd, info.parallax, size ? visible / size : 1, i, current, count, visible);
            });
            return;
        }
        const strategy = this.strategy;
        if (!strategy.isValid)
            return;
        const maxScrollOffset = calculateMaxScrollOffset(strategy, count);
        const keylines = strategy.getKeylineListForScrollOffset(offset, maxScrollOffset);
        const range = strategy.maxItemSize - strategy.minItemSize;
        items.forEach((item, i) => {
            const placement = placeCarouselItem(strategy, keylines, i, offset);
            const fraction = range > 0 ? (placement.size - strategy.minItemSize) / range : 1;
            this.setItem(item, placement.translation + this.originShift, placement.maskStart, strategy.itemMainAxisSize - placement.maskEnd, null, Math.min(Math.max(fraction, 0), 1), i, current, count, placement.size);
        });
    }
    /**
     * Writes one item's custom properties. Main-axis values are in reading
     * direction and mapped to physical edges here.
     */
    setItem(item, translation, clipStart, clipEnd, parallax, fraction, index, current, count, size) {
        const p = CAROUSEL_ITEM_PROPERTIES;
        const s = item.style;
        const round = (n) => `${Math.round(n * 100) / 100}px`;
        const physical = this.rtl ? -translation : translation;
        s.setProperty(p.translate, translation === 0
            ? 'none'
            : this.vertical
                ? `0 ${round(physical)}`
                : `${round(physical)} 0`);
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
        }
        else {
            const physicalParallax = this.rtl ? -parallax : parallax;
            s.setProperty(p.parallax, this.vertical
                ? `0 ${round(physicalParallax)}`
                : `${round(physicalParallax)} 0`);
        }
        if (size === undefined) {
            s.removeProperty(p.size);
        }
        else {
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
    scrollToIndex(index, behavior = 'smooth') {
        if (!this.snapOffsets.length)
            return;
        const i = Math.min(Math.max(index, 0), this.snapOffsets.length - 1);
        const target = this.snapOffsets[i];
        if (behavior === 'smooth' && !this.reducedMotion) {
            this.animateTo(target, 0);
        }
        else {
            this.stopAnimation();
            this.setOffset(target);
            this.update();
        }
    }
    /**
     * Trailing space of a centered strategy that lets the last item scroll to
     * the middle too. The items stay where they are in the flow (scroll offset
     * `i * stride` rests item `i`); `update()` translates them by
     * `originShift` onto the keylines.
     */
    applyCenteredPadding(available, itemSpacing) {
        const style = this.scroller.style;
        const end = this.vertical ? 'paddingBlockEnd' : 'paddingInlineEnd';
        style[end] = this.strategy.centered
            ? `${Math.max(0, available - this.strategy.itemMainAxisSize)}px`
            : '';
    }
    /** The scroll distance from the start, in reading direction. */
    getOffset() {
        const s = this.scroller;
        if (this.vertical)
            return s.scrollTop;
        return this.rtl ? -s.scrollLeft : s.scrollLeft;
    }
    setOffset(offset) {
        const s = this.scroller;
        if (this.vertical) {
            s.scrollTop = offset;
        }
        else {
            s.scrollLeft = this.rtl ? -offset : offset;
        }
    }
    maxOffset() {
        const s = this.scroller;
        return Math.max(0, this.vertical
            ? s.scrollHeight - s.clientHeight
            : s.scrollWidth - s.clientWidth);
    }
    indexNearest(offset) {
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
    get snaps() {
        return this.root.classList.contains(CAROUSEL_CLASSES.snap);
    }
    /**
     * Animates the scroll offset to `target` with a critically damped spring
     * (Compose snap `spring(StiffnessMediumLow)`), starting at `velocity`
     * (px/ms). Native snapping is paused while it runs.
     */
    animateTo(target, velocity) {
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
    stopAnimation() {
        if (!this.animation)
            return;
        cancelAnimationFrame(this.animation);
        this.animation = 0;
        this.root.classList.remove(CAROUSEL_CLASSES.animating);
    }
    /** Reading-direction sign of a physical pointer movement. */
    get direction() {
        return this.rtl ? -1 : 1;
    }
    startDrag() {
        this.dragStartOffset = this.getOffset();
        this.dragStartIndex = this.currentIndex;
        this.root.classList.add(CAROUSEL_CLASSES.dragging);
    }
    endDrag(velocity) {
        this.root.classList.remove(CAROUSEL_CLASSES.dragging);
        // The gesture reports px/s along the axis; settling takes px/ms of the
        // scroll offset (against the pointer in the reading direction).
        this.settle(this.dragStartIndex, (-velocity * this.direction) / 1000);
    }
    /** Flings from the current offset and snaps (or stops) where it lands. */
    settle(startIndex, velocity) {
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
    itemIndexOf(event) {
        const path = event.composedPath();
        return this.items.findIndex((item) => path.includes(item));
    }
    /** Focuses item `index` and scrolls it to its snapped position. */
    focusItem(index) {
        const item = this.items[index];
        if (!item)
            return;
        const target = item.shadowRoot?.delegatesFocus || item.tabIndex >= 0
            ? item
            : (item.querySelector(FOCUSABLE) ?? item);
        target.focus({ preventScroll: true });
        this.scrollToIndex(index);
    }
    /**
     * Moves focus to the next (or previous) focusable element outside the
     * carousel, in its root.
     *
     * @return Whether focus moved.
     */
    focusOutside(forward) {
        const host = this.host;
        const root = host.getRootNode();
        const candidates = [...root.querySelectorAll('*')].filter((el) => el !== host &&
            !host.contains(el) &&
            !el.contains(host) &&
            isFocusable(el));
        const following = candidates.filter((el) => host.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
        const preceding = candidates.filter((el) => host.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING);
        const target = forward ? following[0] : preceding[preceding.length - 1];
        if (!target)
            return false;
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
export function setupCarousel(carousel, opts) {
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
//# sourceMappingURL=carousel.js.map