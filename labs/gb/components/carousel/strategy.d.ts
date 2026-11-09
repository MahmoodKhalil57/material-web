/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Keyline, KeylineList } from './keylines.js';
/**
 * Derives the scroll-dependent keyline lists of a carousel from its default
 * keylines: the steps that shift the focal range to the start and end of the
 * container as the carousel scrolls to its first and last items
 * (`Strategy.kt` `class Strategy`).
 */
export declare class Strategy {
    readonly defaultKeylines: KeylineList;
    readonly availableSpace: number;
    readonly itemSpacing: number;
    readonly beforeContentPadding: number;
    readonly afterContentPadding: number;
    readonly centered: boolean;
    static readonly EMPTY: Strategy;
    readonly startKeylineSteps: KeylineList[];
    readonly endKeylineSteps: KeylineList[];
    readonly minItemSize: number;
    readonly maxItemSize: number;
    /** The scroll distance needed to move through all start steps. */
    private readonly startShiftDistance;
    /** The scroll distance needed to move through all end steps. */
    private readonly endShiftDistance;
    /** Fraction of `startShiftDistance` scrolled at each start step. */
    private readonly startShiftPoints;
    /** Fraction of `endShiftDistance` scrolled at each end step. */
    private readonly endShiftPoints;
    /** True if this strategy has valid keylines for a valid container. */
    readonly isValid: boolean;
    private lastStartAndEndKeylineListSteps;
    private cachedScrollOffset;
    private cachedMaxScrollOffset;
    private cachedRoundToNearestStep;
    private cachedKeylineList;
    /**
     * @param defaultKeylines the keylines for a left-to-right (or
     *     top-to-bottom) layout
     * @param availableSpace the size of the carousel container in the
     *     scrolling axis
     * @param itemSpacing the space between items
     * @param beforeContentPadding the padding to add before the list content
     * @param afterContentPadding the padding to add after the list content
     * @param centered whether the focal items rest in the middle of the
     *     container (center-aligned hero): the keylines then never shift to the
     *     start or end, and the scroll origin is offset by `originShift`
     *     instead, so the first item rests centered.
     */
    constructor(defaultKeylines: KeylineList, availableSpace: number, itemSpacing: number, beforeContentPadding: number, afterContentPadding: number, centered?: boolean);
    /**
     * For a `centered` strategy, how far the first item's natural position is
     * shifted into the container so that it rests on the first focal keyline;
     * 0 otherwise. The scroller needs this much leading space.
     */
    get originShift(): number;
    /** The size of items when in focus and fully unmasked. */
    get itemMainAxisSize(): number;
    /**
     * The keyline list for `scrollOffset` (`getKeylineListForScrollOffset`).
     *
     * @param roundToNearestStep true to return a complete shift step
     */
    getKeylineListForScrollOffset(scrollOffset: number, maxScrollOffset: number, roundToNearestStep?: boolean): KeylineList;
    private getKeylineListForScrollOffsetInternal;
}
/**
 * The distance from the container's start at which item `itemIndex` rests
 * when snapped (`getSnapPositionOffset`).
 */
export declare function getSnapPositionOffset(strategy: Strategy, itemIndex: number, itemCount: number): number;
/**
 * `calculateMaxScrollOffset` (`Carousel.kt`): the scroll range of items laid
 * out end-to-end at `itemMainAxisSize`.
 */
export declare function calculateMaxScrollOffset(strategy: Strategy, itemCount: number): number;
/**
 * The scroll offset at which item `index` is snapped: its end-to-end start
 * minus its snap position offset, clamped to the scroll range.
 */
export declare function getSnapScrollOffset(strategy: Strategy, index: number, itemCount: number): number;
/** Where to draw one carousel item for the current scroll offset. */
export interface CarouselItemPlacement {
    /** The masked (visible) size of the item along the main axis. */
    size: number;
    /** Mask start along the main axis, from the item's start edge. */
    maskStart: number;
    /** Mask end along the main axis, from the item's start edge. */
    maskEnd: number;
    /** Translation along the main axis, in reading direction. */
    translation: number;
    /** The interpolated keyline the item uses. */
    keyline: Keyline;
}
/**
 * The mask and translation of item `index` (`Modifier.carouselItem` in
 * `Carousel.kt`). Items are laid out end-to-end at `itemMainAxisSize`; each
 * is masked to its interpolated keyline's size, centered, and translated so
 * that masked items sit edge to edge.
 */
export declare function placeCarouselItem(strategy: Strategy, keylines: KeylineList, index: number, scrollOffset: number): CarouselItemPlacement;
/** `CarouselParallaxScrollEffectItemInfo`. */
export interface ParallaxItemInfo {
    maskStart: number;
    maskEnd: number;
    parallax: number;
    maskProgress: number;
}
/**
 * The mask and parallax of an item in a list of items of their own sizes as
 * it enters or leaves the viewport (`calculateItemInfo` in
 * `CarouselParallaxScrollEffect.kt`), used by the uncontained multi-aspect
 * ratio layout.
 */
export declare function calculateParallaxItemInfo(itemMainAxisSize: number, itemCrossAxisSize: number, itemOffset: number, viewportStartOffset: number, viewportEndOffset: number): ParallaxItemInfo;
