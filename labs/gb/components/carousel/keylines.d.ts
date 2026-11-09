/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** `CarouselDefaults.MinSmallItemSize` (40.dp). */
export declare const MIN_SMALL_ITEM_SIZE = 40;
/** `CarouselDefaults.MaxSmallItemSize` (56.dp). */
export declare const MAX_SMALL_ITEM_SIZE = 56;
/** `CarouselDefaults.AnchorSize` (10.dp). */
export declare const ANCHOR_SIZE = 10;
/** `CarouselDefaults.MediumLargeItemDiffThreshold`. */
export declare const MEDIUM_LARGE_ITEM_DIFF_THRESHOLD = 0.85;
/** `androidx.compose.ui.util.lerp`. */
export declare function lerp(start: number, stop: number, fraction: number): number;
/** `Strategy.kt` `lerp(outputMin, outputMax, inputMin, inputMax, value)`. */
export declare function lerpRange(outputMin: number, outputMax: number, inputMin: number, inputMax: number, value: number): number;
/**
 * A fitted arrangement of large, medium and small items
 * (`Arrangement.kt` `class Arrangement`).
 */
export declare class Arrangement {
    private readonly priority;
    readonly smallSize: number;
    readonly smallCount: number;
    readonly mediumSize: number;
    readonly mediumCount: number;
    readonly largeSize: number;
    readonly largeCount: number;
    private static readonly MEDIUM_ITEM_FLEX_PERCENTAGE;
    constructor(priority: number, smallSize: number, smallCount: number, mediumSize: number, mediumCount: number, largeSize: number, largeCount: number);
    private isValid;
    /**
     * The cost of this arrangement: lower is better. Arrangements cost less the
     * closer their priority is to 1 and the less their `largeSize` is altered
     * from `targetLargeSize` (`Arrangement.cost`).
     */
    private cost;
    /** Number of items (keylines) in the arrangement. */
    itemCount(): number;
    /**
     * Creates an arrangement for every permutation of `smallCounts`,
     * `mediumCounts` and `largeCounts`, fits each into the available space,
     * and returns the one with the lowest cost
     * (`Arrangement.findLowestCostArrangement`).
     */
    static findLowestCostArrangement({ availableSpace, itemSpacing, targetSmallSize, minSmallSize, maxSmallSize, smallCounts, targetMediumSize, mediumCounts, targetLargeSize, largeCounts, }: {
        availableSpace: number;
        itemSpacing: number;
        targetSmallSize: number;
        minSmallSize: number;
        maxSmallSize: number;
        smallCounts: number[];
        targetMediumSize: number;
        mediumCounts: number[];
        targetLargeSize: number;
        largeCounts: number[];
    }): Arrangement | null;
    /**
     * Fits item sizes for the given counts into `availableSpace`, adjusting
     * small items first, then medium items, and large items last
     * (`Arrangement.fit`).
     */
    private static fit;
    /**
     * Solves `availableSpace = (largeSize * largeCount) +
     * (((largeSize + smallSize) / 2) * mediumCount) + (smallSize * smallCount)`
     * for `largeSize` (`Arrangement.calculateLargeSize`).
     */
    private static calculateLargeSize;
}
/**
 * A structure that is fixed at a specific `offset` along a scrolling axis and
 * defines properties of an item when its center is located at `offset`
 * (`KeylineList.kt` `data class Keyline`).
 */
export interface Keyline {
    /** The size of the item in px (masked size) at this keyline. */
    readonly size: number;
    /** Where the item's center is placed along the scrolling axis. */
    readonly offset: number;
    /** Where the item's center would be if items were laid out end-to-end. */
    readonly unadjustedOffset: number;
    /** Whether items at this keyline are fully unmasked (large). */
    readonly isFocal: boolean;
    /** Whether this keyline is never shifted (the off-screen end keylines). */
    readonly isAnchor: boolean;
    /** Whether all other keylines are calculated from this one. */
    readonly isPivot: boolean;
    /** How much of the item is cut off by the container's edge. */
    readonly cutoff: number;
}
/** Data class equality of two keylines. */
export declare function keylineEquals(a: Keyline, b: Keyline): boolean;
/**
 * An ordered, start-to-end list of keylines along the scrolling axis
 * (`KeylineList.kt` `class KeylineList`).
 */
export declare class KeylineList {
    readonly keylines: readonly Keyline[];
    static readonly EMPTY: KeylineList;
    readonly minSize: number;
    readonly maxSize: number;
    /** Index of the keyline all other keyline offsets are calculated from. */
    readonly pivotIndex: number;
    /** Index of the first non-anchor keyline, or -1. */
    readonly firstNonAnchorIndex: number;
    /** Index of the last non-anchor keyline, or -1. */
    readonly lastNonAnchorIndex: number;
    /** Index of the first focal keyline, or -1. */
    readonly firstFocalIndex: number;
    /** Index of the last focal keyline, or -1. */
    readonly lastFocalIndex: number;
    /** The total number of focal keylines. */
    readonly focalCount: number;
    constructor(keylines: readonly Keyline[]);
    get length(): number;
    get lastIndex(): number;
    isEmpty(): boolean;
    get(index: number): Keyline;
    first(): Keyline;
    last(): Keyline;
    get pivot(): Keyline;
    get firstNonAnchor(): Keyline;
    get lastNonAnchor(): Keyline;
    get firstFocal(): Keyline;
    get lastFocal(): Keyline;
    /**
     * Whether the first focal item's start is within the container and it is
     * the first non-anchor keyline: the focal range cannot shift further toward
     * the start (`isFirstFocalItemAtStartOfContainer`).
     */
    isFirstFocalItemAtStartOfContainer(): boolean;
    /**
     * Whether the last focal item's end is within the container and it is the
     * last non-anchor keyline (`isLastFocalItemAtEndOfContainer`).
     */
    isLastFocalItemAtEndOfContainer(carouselMainAxisSize: number): boolean;
    /**
     * The index of the first keyline after the focal range whose size is
     * `size`, or the last index (`firstIndexAfterFocalRangeWithSize`).
     */
    firstIndexAfterFocalRangeWithSize(size: number): number;
    /**
     * The index of the last keyline before the focal range whose size is
     * `size`, or 0 (`lastIndexBeforeFocalRangeWithSize`).
     */
    lastIndexBeforeFocalRangeWithSize(size: number): number;
    /**
     * The last keyline whose unadjustedOffset is less than `unadjustedOffset`,
     * or the first keyline (`getKeylineBefore`).
     */
    getKeylineBefore(unadjustedOffset: number): Keyline;
    /**
     * The first keyline whose unadjustedOffset is greater than or equal to
     * `unadjustedOffset`, or the last keyline (`getKeylineAfter`).
     */
    getKeylineAfter(unadjustedOffset: number): Keyline;
    equals(other: KeylineList): boolean;
}
/** `CarouselAlignment` (`Carousel.kt`). */
export type CarouselAlignment = 'start' | 'center' | 'end';
/** `KeylineListScope`: adds keylines in the order they appear. */
export interface KeylineListScope {
    /**
     * @param size the size of an item in px at this keyline
     * @param isAnchor true if this keyline should not be shifted - usually the
     *     first and last fully off-screen keylines
     */
    add(size: number, isAnchor?: boolean): void;
}
/** `keylineListOf(carouselMainAxisSize, itemSpacing, carouselAlignment)`. */
export declare function keylineListOf(carouselMainAxisSize: number, itemSpacing: number, carouselAlignment: CarouselAlignment, keylines: (scope: KeylineListScope) => void): KeylineList;
/** `keylineListOf(carouselMainAxisSize, itemSpacing, pivotIndex, pivotOffset)`. */
export declare function keylineListOfPivot(carouselMainAxisSize: number, itemSpacing: number, pivotIndex: number, pivotOffset: number, keylines: (scope: KeylineListScope) => void): KeylineList;
/** `lerp(start: Keyline, end: Keyline, fraction)`. */
export declare function lerpKeyline(start: Keyline, end: Keyline, fraction: number): Keyline;
/** `lerp(from: KeylineList, to: KeylineList, fraction)`. */
export declare function lerpKeylineList(from: KeylineList, to: KeylineList, fraction: number): KeylineList;
/** Options shared by the keyline list factories. */
export interface KeylineOptions {
    /** The size of the carousel container in the scrolling axis. */
    carouselMainAxisSize: number;
    /** The space between items. */
    itemSpacing: number;
    /** The number of items in the carousel. */
    itemCount: number;
    /** `CarouselDefaults.MinSmallItemSize`. */
    minSmallItemSize?: number;
    /** `CarouselDefaults.MaxSmallItemSize`. */
    maxSmallItemSize?: number;
    /** `CarouselDefaults.AnchorSize`. */
    anchorSize?: number;
}
/**
 * Keylines for a multi-browse carousel: large items followed by medium and
 * small items, fitted to the container (`multiBrowseKeylineList`).
 *
 * @param preferredItemSize the desired size of large items
 */
export declare function multiBrowseKeylineList({ carouselMainAxisSize, preferredItemSize, itemSpacing, itemCount, minSmallItemSize, maxSmallItemSize, anchorSize, }: KeylineOptions & {
    preferredItemSize: number;
}): KeylineList;
/**
 * Keylines for an uncontained carousel: as many `itemSize` items as fit, plus
 * a medium item cut off by the end edge (`uncontainedKeylineList`).
 */
export declare function uncontainedKeylineList({ carouselMainAxisSize, itemSize, itemSpacing, anchorSize, }: Omit<KeylineOptions, 'itemCount'> & {
    itemSize: number;
}): KeylineList;
/**
 * Keylines for a hero carousel: one or more large items and one small item,
 * or, centered, large items between two small items (`heroKeylineList`).
 *
 * @param preferredItemSize the desired large item size, or null to fill the
 *     container
 */
export declare function heroKeylineList({ carouselMainAxisSize, preferredItemSize, itemSpacing, itemCount, isCentered, minSmallItemSize, maxSmallItemSize, anchorSize, }: KeylineOptions & {
    preferredItemSize: number | null;
    isCentered?: boolean;
}): KeylineList;
/**
 * Keylines for a full-screen carousel: a single large item that fills the
 * container between two anchors. Compose has no full-screen keyline factory;
 * this is `createLeftAlignedKeylineList` with one large item, which is what
 * `heroKeylineList` produces when no small item fits.
 */
export declare function fullScreenKeylineList({ carouselMainAxisSize, itemSpacing, anchorSize, }: Omit<KeylineOptions, 'itemCount'>): KeylineList;
/** `createLeftAlignedKeylineList`. */
export declare function createLeftAlignedKeylineList(carouselMainAxisSize: number, itemSpacing: number, leftAnchorSize: number, rightAnchorSize: number, arrangement: Arrangement): KeylineList;
/** `createCenterAlignedKeylineList`. */
export declare function createCenterAlignedKeylineList(carouselMainAxisSize: number, itemSpacing: number, leftAnchorSize: number, rightAnchorSize: number, arrangement: Arrangement): KeylineList;
