/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// A TypeScript port of the Jetpack Compose Material 3 carousel keyline math:
// `androidx/compose/material3/carousel/Arrangement.kt`, `KeylineList.kt` and
// `Keylines.kt`. Names, structure and comments follow the Kotlin sources so
// the two can be diffed; all sizes are CSS pixels instead of device pixels.

/** `CarouselDefaults.MinSmallItemSize` (40.dp). */
export const MIN_SMALL_ITEM_SIZE = 40;
/** `CarouselDefaults.MaxSmallItemSize` (56.dp). */
export const MAX_SMALL_ITEM_SIZE = 56;
/** `CarouselDefaults.AnchorSize` (10.dp). */
export const ANCHOR_SIZE = 10;
/** `CarouselDefaults.MediumLargeItemDiffThreshold`. */
export const MEDIUM_LARGE_ITEM_DIFF_THRESHOLD = 0.85;

/** `androidx.compose.ui.util.lerp`. */
export function lerp(start: number, stop: number, fraction: number): number {
  return (1 - fraction) * start + fraction * stop;
}

/** `Strategy.kt` `lerp(outputMin, outputMax, inputMin, inputMax, value)`. */
export function lerpRange(
  outputMin: number,
  outputMax: number,
  inputMin: number,
  inputMax: number,
  value: number,
): number {
  if (value <= inputMin) {
    return outputMin;
  } else if (value >= inputMax) {
    return outputMax;
  }
  return lerp(outputMin, outputMax, (value - inputMin) / (inputMax - inputMin));
}

function coerceIn(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// ---------------------------------------------------------------------------
// Arrangement.kt
// ---------------------------------------------------------------------------

/**
 * A fitted arrangement of large, medium and small items
 * (`Arrangement.kt` `class Arrangement`).
 */
export class Arrangement {
  // Specifies a percentage of a medium item's size by which it can be
  // increased or decreased to help fit an arrangement into the carousel's
  // available space.
  private static readonly MEDIUM_ITEM_FLEX_PERCENTAGE = 0.1;

  constructor(
    private readonly priority: number,
    readonly smallSize: number,
    readonly smallCount: number,
    readonly mediumSize: number,
    readonly mediumCount: number,
    readonly largeSize: number,
    readonly largeCount: number,
  ) {}

  private isValid(): boolean {
    if (this.largeCount > 0 && this.smallCount > 0 && this.mediumCount > 0) {
      return (
        this.largeSize > this.mediumSize && this.mediumSize > this.smallSize
      );
    } else if (this.largeCount > 0 && this.smallCount > 0) {
      return this.largeSize > this.smallSize;
    }
    return true;
  }

  /**
   * The cost of this arrangement: lower is better. Arrangements cost less the
   * closer their priority is to 1 and the less their `largeSize` is altered
   * from `targetLargeSize` (`Arrangement.cost`).
   */
  private cost(targetLargeSize: number): number {
    if (!this.isValid()) {
      return Number.MAX_VALUE;
    }
    return Math.abs(targetLargeSize - this.largeSize) * this.priority;
  }

  /** Number of items (keylines) in the arrangement. */
  itemCount(): number {
    return this.largeCount + this.mediumCount + this.smallCount;
  }

  /**
   * Creates an arrangement for every permutation of `smallCounts`,
   * `mediumCounts` and `largeCounts`, fits each into the available space,
   * and returns the one with the lowest cost
   * (`Arrangement.findLowestCostArrangement`).
   */
  static findLowestCostArrangement({
    availableSpace,
    itemSpacing,
    targetSmallSize,
    minSmallSize,
    maxSmallSize,
    smallCounts,
    targetMediumSize,
    mediumCounts,
    targetLargeSize,
    largeCounts,
  }: {
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
  }): Arrangement | null {
    let lowestCostArrangement: Arrangement | null = null;
    let priority = 1;
    for (const largeCount of largeCounts) {
      for (const mediumCount of mediumCounts) {
        for (const smallCount of smallCounts) {
          const arrangement = Arrangement.fit({
            priority,
            availableSpace,
            itemSpacing,
            smallCount,
            smallSize: targetSmallSize,
            minSmallSize,
            maxSmallSize,
            mediumCount,
            mediumSize: targetMediumSize,
            largeCount,
            largeSize: targetLargeSize,
          });
          if (
            lowestCostArrangement === null ||
            arrangement.cost(targetLargeSize) <
              lowestCostArrangement.cost(targetLargeSize)
          ) {
            lowestCostArrangement = arrangement;
            if (lowestCostArrangement.cost(targetLargeSize) === 0) {
              // A cost of 0 didn't alter the large item size at all, and
              // permutations are generated in priority order: nothing can
              // beat it.
              return lowestCostArrangement;
            }
          }
          priority++;
        }
      }
    }
    return lowestCostArrangement;
  }

  /**
   * Fits item sizes for the given counts into `availableSpace`, adjusting
   * small items first, then medium items, and large items last
   * (`Arrangement.fit`).
   */
  private static fit({
    priority,
    availableSpace,
    itemSpacing,
    smallCount,
    smallSize,
    minSmallSize,
    maxSmallSize,
    mediumCount,
    mediumSize,
    largeCount,
    largeSize,
  }: {
    priority: number;
    availableSpace: number;
    itemSpacing: number;
    smallCount: number;
    smallSize: number;
    minSmallSize: number;
    maxSmallSize: number;
    mediumCount: number;
    mediumSize: number;
    largeCount: number;
    largeSize: number;
  }): Arrangement {
    const totalItemCount = largeCount + mediumCount + smallCount;
    const availableSpaceWithoutSpacing =
      availableSpace - (totalItemCount - 1) * itemSpacing;
    let arrangedSmallSize = coerceIn(smallSize, minSmallSize, maxSmallSize);
    let arrangedMediumSize = mediumSize;
    let arrangedLargeSize = largeSize;

    const totalSpaceTakenByArrangement =
      arrangedLargeSize * largeCount +
      arrangedMediumSize * mediumCount +
      arrangedSmallSize * smallCount;
    const delta = availableSpaceWithoutSpacing - totalSpaceTakenByArrangement;
    // First, resize small items within their allowable min-max range to try
    // to fit the arrangement into the available space.
    if (smallCount > 0 && delta > 0) {
      // grow the small items
      arrangedSmallSize += Math.min(
        delta / smallCount,
        maxSmallSize - arrangedSmallSize,
      );
    } else if (smallCount > 0 && delta < 0) {
      // shrink the small items
      arrangedSmallSize += Math.max(
        delta / smallCount,
        minSmallSize - arrangedSmallSize,
      );
    }
    // Zero out small size if there are no small items
    arrangedSmallSize = smallCount > 0 ? arrangedSmallSize : 0;
    arrangedLargeSize = Arrangement.calculateLargeSize(
      availableSpaceWithoutSpacing,
      smallCount,
      arrangedSmallSize,
      mediumCount,
      largeCount,
    );
    arrangedMediumSize = (arrangedLargeSize + arrangedSmallSize) / 2;

    // If the large size has been adjusted away from its target size to fit
    // the arrangement, counter this as much as possible by altering the medium
    // item within its acceptable flex range.
    if (mediumCount > 0 && arrangedLargeSize !== largeSize) {
      const targetAdjustment = (largeSize - arrangedLargeSize) * largeCount;
      const availableMediumFlex =
        arrangedMediumSize *
        Arrangement.MEDIUM_ITEM_FLEX_PERCENTAGE *
        mediumCount;
      const distribute = Math.min(
        Math.abs(targetAdjustment),
        availableMediumFlex,
      );
      if (targetAdjustment > 0) {
        // Reduce the size of the medium item and give it back to the large
        // items
        arrangedMediumSize -= distribute / mediumCount;
        arrangedLargeSize += distribute / largeCount;
      } else {
        // Increase the size of the medium item and take from the large items
        arrangedMediumSize += distribute / mediumCount;
        arrangedLargeSize -= distribute / largeCount;
      }
    }

    return new Arrangement(
      priority,
      arrangedSmallSize,
      smallCount,
      arrangedMediumSize,
      mediumCount,
      arrangedLargeSize,
      largeCount,
    );
  }

  /**
   * Solves `availableSpace = (largeSize * largeCount) +
   * (((largeSize + smallSize) / 2) * mediumCount) + (smallSize * smallCount)`
   * for `largeSize` (`Arrangement.calculateLargeSize`).
   */
  private static calculateLargeSize(
    availableSpace: number,
    smallCount: number,
    smallSize: number,
    mediumCount: number,
    largeCount: number,
  ): number {
    return (
      (availableSpace - (smallCount + mediumCount / 2) * smallSize) /
      (largeCount + mediumCount / 2)
    );
  }
}

// ---------------------------------------------------------------------------
// KeylineList.kt
// ---------------------------------------------------------------------------

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
export function keylineEquals(a: Keyline, b: Keyline): boolean {
  return (
    a === b ||
    (a.size === b.size &&
      a.offset === b.offset &&
      a.unadjustedOffset === b.unadjustedOffset &&
      a.isFocal === b.isFocal &&
      a.isAnchor === b.isAnchor &&
      a.isPivot === b.isPivot &&
      a.cutoff === b.cutoff)
  );
}

function indexOfLast<T>(list: readonly T[], predicate: (t: T) => boolean) {
  for (let i = list.length - 1; i >= 0; i--) {
    if (predicate(list[i])) return i;
  }
  return -1;
}

/**
 * An ordered, start-to-end list of keylines along the scrolling axis
 * (`KeylineList.kt` `class KeylineList`).
 */
export class KeylineList {
  static readonly EMPTY = new KeylineList([]);

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

  constructor(readonly keylines: readonly Keyline[]) {
    let min = Number.MAX_VALUE;
    let max = 0;
    for (const k of keylines) {
      if (k.size < min) min = k.size;
      if (k.size > max) max = k.size;
    }
    this.minSize = min;
    this.maxSize = max;
    this.pivotIndex = keylines.findIndex((k) => k.isPivot);
    this.firstNonAnchorIndex = keylines.findIndex((k) => !k.isAnchor);
    this.lastNonAnchorIndex = indexOfLast(keylines, (k) => !k.isAnchor);
    this.firstFocalIndex = keylines.findIndex((k) => k.isFocal);
    this.lastFocalIndex = indexOfLast(keylines, (k) => k.isFocal);
    this.focalCount = this.lastFocalIndex - this.firstFocalIndex + 1;
  }

  get length() {
    return this.keylines.length;
  }

  get lastIndex() {
    return this.keylines.length - 1;
  }

  isEmpty() {
    return this.keylines.length === 0;
  }

  get(index: number): Keyline {
    return this.keylines[index];
  }

  first(): Keyline {
    return this.keylines[0];
  }

  last(): Keyline {
    return this.keylines[this.keylines.length - 1];
  }

  get pivot(): Keyline {
    return this.keylines[this.pivotIndex];
  }

  get firstNonAnchor(): Keyline {
    return this.keylines[this.firstNonAnchorIndex];
  }

  get lastNonAnchor(): Keyline {
    return this.keylines[this.lastNonAnchorIndex];
  }

  get firstFocal(): Keyline {
    const k = this.keylines[this.firstFocalIndex];
    if (!k) {
      throw new Error('All KeylineLists must have at least one focal keyline');
    }
    return k;
  }

  get lastFocal(): Keyline {
    const k = this.keylines[this.lastFocalIndex];
    if (!k) {
      throw new Error('All KeylineLists must have at least one focal keyline');
    }
    return k;
  }

  /**
   * Whether the first focal item's start is within the container and it is
   * the first non-anchor keyline: the focal range cannot shift further toward
   * the start (`isFirstFocalItemAtStartOfContainer`).
   */
  isFirstFocalItemAtStartOfContainer(): boolean {
    const firstFocalLeft = this.firstFocal.offset - this.firstFocal.size / 2;
    return (
      firstFocalLeft >= 0 &&
      keylineEquals(this.firstFocal, this.firstNonAnchor)
    );
  }

  /**
   * Whether the last focal item's end is within the container and it is the
   * last non-anchor keyline (`isLastFocalItemAtEndOfContainer`).
   */
  isLastFocalItemAtEndOfContainer(carouselMainAxisSize: number): boolean {
    const lastFocalRight = this.lastFocal.offset + this.lastFocal.size / 2;
    return (
      lastFocalRight <= carouselMainAxisSize &&
      keylineEquals(this.lastFocal, this.lastNonAnchor)
    );
  }

  /**
   * The index of the first keyline after the focal range whose size is
   * `size`, or the last index (`firstIndexAfterFocalRangeWithSize`).
   */
  firstIndexAfterFocalRangeWithSize(size: number): number {
    for (let i = this.lastFocalIndex; i <= this.lastIndex; i++) {
      if (this.keylines[i].size === size) return i;
    }
    return this.lastIndex;
  }

  /**
   * The index of the last keyline before the focal range whose size is
   * `size`, or 0 (`lastIndexBeforeFocalRangeWithSize`).
   */
  lastIndexBeforeFocalRangeWithSize(size: number): number {
    for (let i = this.firstFocalIndex - 1; i >= 0; i--) {
      if (this.keylines[i].size === size) return i;
    }
    return 0;
  }

  /**
   * The last keyline whose unadjustedOffset is less than `unadjustedOffset`,
   * or the first keyline (`getKeylineBefore`).
   */
  getKeylineBefore(unadjustedOffset: number): Keyline {
    for (let i = this.keylines.length - 1; i >= 0; i--) {
      const k = this.keylines[i];
      if (k.unadjustedOffset < unadjustedOffset) {
        return k;
      }
    }
    return this.first();
  }

  /**
   * The first keyline whose unadjustedOffset is greater than or equal to
   * `unadjustedOffset`, or the last keyline (`getKeylineAfter`).
   */
  getKeylineAfter(unadjustedOffset: number): Keyline {
    return (
      this.keylines.find((k) => k.unadjustedOffset >= unadjustedOffset) ??
      this.last()
    );
  }

  equals(other: KeylineList): boolean {
    if (this === other) return true;
    if (this.length !== other.length) return false;
    return this.keylines.every((k, i) => keylineEquals(k, other.keylines[i]));
  }
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

interface TmpKeyline {
  size: number;
  isAnchor: boolean;
}

/** `KeylineListScopeImpl`. */
class KeylineListScopeImpl implements KeylineListScope {
  private firstFocalIndex = -1;
  private focalItemSize = 0;
  private readonly tmpKeylines: TmpKeyline[] = [];

  add(size: number, isAnchor = false) {
    this.tmpKeylines.push({size, isAnchor});
    // Save the first "focal" item by looking for the first index of the
    // largest item added to the list.
    if (!isAnchor && size > this.focalItemSize) {
      this.firstFocalIndex = this.tmpKeylines.length - 1;
      this.focalItemSize = size;
    }
  }

  createWithPivot(
    carouselMainAxisSize: number,
    itemSpacing: number,
    pivotIndex: number,
    pivotOffset: number,
  ): KeylineList {
    return new KeylineList(
      this.createKeylinesWithPivot(
        pivotIndex,
        pivotOffset,
        this.firstFocalIndex,
        this.findLastFocalIndex(),
        this.focalItemSize,
        carouselMainAxisSize,
        itemSpacing,
      ),
    );
  }

  createWithAlignment(
    carouselMainAxisSize: number,
    itemSpacing: number,
    carouselAlignment: CarouselAlignment,
  ): KeylineList {
    const lastFocalIndex = this.findLastFocalIndex();
    const focalItemCount = lastFocalIndex - this.firstFocalIndex;
    const pivotIndex = this.firstFocalIndex;
    const focalItemSize = this.focalItemSize;
    let pivotOffset: number;
    if (carouselAlignment === 'center') {
      // If there is an even number of keylines, the itemSpacing will be
      // placed in the center of the container. Divide the item spacing by
      // half before subtracting the pivot item's center.
      const itemSpacingSplit =
        itemSpacing === 0 || focalItemCount % 2 === 0 ? 0 : itemSpacing / 2;
      // Count the number of item spaces between the center of the viewport
      // and the first focal item.
      const itemSpaceCounts = Math.trunc(focalItemCount / 2) * itemSpacing;
      pivotOffset =
        carouselMainAxisSize / 2 -
        (focalItemSize / 2) * focalItemCount -
        itemSpacingSplit -
        itemSpaceCounts;
    } else if (carouselAlignment === 'end') {
      pivotOffset = carouselMainAxisSize - focalItemSize / 2;
    } else {
      pivotOffset = focalItemSize / 2;
    }
    return new KeylineList(
      this.createKeylinesWithPivot(
        pivotIndex,
        pivotOffset,
        this.firstFocalIndex,
        lastFocalIndex,
        focalItemSize,
        carouselMainAxisSize,
        itemSpacing,
      ),
    );
  }

  private findLastFocalIndex(): number {
    if (this.firstFocalIndex < 0) return -1;
    // Walk up from the first focal index while items remain the focal size.
    let lastFocalIndex = this.firstFocalIndex;
    while (
      lastFocalIndex < this.tmpKeylines.length - 1 &&
      this.tmpKeylines[lastFocalIndex + 1].size === this.focalItemSize
    ) {
      lastFocalIndex++;
    }
    return lastFocalIndex;
  }

  /**
   * Converts the temporary keylines to keylines whose offset, unadjusted
   * offset and cutoff are calculated from a pivot
   * (`createKeylinesWithPivot`).
   */
  private createKeylinesWithPivot(
    pivotIndex: number,
    pivotOffset: number,
    firstFocalIndex: number,
    lastFocalIndex: number,
    itemMainAxisSize: number,
    carouselMainAxisSize: number,
    itemSpacing: number,
  ): Keyline[] {
    const tmpKeylines = this.tmpKeylines;
    // Return an empty list if there are no keylines or the pivot is invalid.
    if (
      tmpKeylines.length === 0 ||
      pivotIndex < 0 ||
      pivotIndex >= tmpKeylines.length
    ) {
      return [];
    }
    const isFocal = (i: number) => i >= firstFocalIndex && i <= lastFocalIndex;
    const pivot = tmpKeylines[pivotIndex];
    const keylines: Keyline[] = [];

    let pivotCutoff = 0;
    if (isCutoffLeft(pivot.size, pivotOffset)) {
      pivotCutoff = pivotOffset - pivot.size / 2;
    } else if (isCutoffRight(pivot.size, pivotOffset, carouselMainAxisSize)) {
      pivotCutoff = pivotOffset + pivot.size / 2 - carouselMainAxisSize;
    }
    // Add the pivot keyline first
    keylines.push({
      size: pivot.size,
      offset: pivotOffset,
      unadjustedOffset: pivotOffset,
      isFocal: isFocal(pivotIndex),
      isAnchor: pivot.isAnchor,
      isPivot: true,
      cutoff: pivotCutoff,
    });

    // Keylines before the pivot, inserted at the start in original order.
    let offset = pivotOffset - itemMainAxisSize / 2 - itemSpacing;
    let unadjustedOffset = pivotOffset - itemMainAxisSize / 2 - itemSpacing;
    for (let originalIndex = pivotIndex - 1; originalIndex >= 0; originalIndex--) {
      const tmp = tmpKeylines[originalIndex];
      const tmpOffset = offset - tmp.size / 2;
      const tmpUnadjustedOffset = unadjustedOffset - itemMainAxisSize / 2;
      const cutoff = isCutoffLeft(tmp.size, tmpOffset)
        ? Math.abs(tmpOffset - tmp.size / 2)
        : 0;
      keylines.unshift({
        size: tmp.size,
        offset: tmpOffset,
        unadjustedOffset: tmpUnadjustedOffset,
        isFocal: isFocal(originalIndex),
        isAnchor: tmp.isAnchor,
        isPivot: false,
        cutoff,
      });
      offset -= tmp.size + itemSpacing;
      unadjustedOffset -= itemMainAxisSize + itemSpacing;
    }

    // Keylines after the pivot, appended in original order.
    offset = pivotOffset + itemMainAxisSize / 2 + itemSpacing;
    unadjustedOffset = pivotOffset + itemMainAxisSize / 2 + itemSpacing;
    for (
      let originalIndex = pivotIndex + 1;
      originalIndex < tmpKeylines.length;
      originalIndex++
    ) {
      const tmp = tmpKeylines[originalIndex];
      const tmpOffset = offset + tmp.size / 2;
      const tmpUnadjustedOffset = unadjustedOffset + itemMainAxisSize / 2;
      const cutoff = isCutoffRight(tmp.size, tmpOffset, carouselMainAxisSize)
        ? tmpOffset + tmp.size / 2 - carouselMainAxisSize
        : 0;
      keylines.push({
        size: tmp.size,
        offset: tmpOffset,
        unadjustedOffset: tmpUnadjustedOffset,
        isFocal: isFocal(originalIndex),
        isAnchor: tmp.isAnchor,
        isPivot: false,
        cutoff,
      });
      offset += tmp.size + itemSpacing;
      unadjustedOffset += itemMainAxisSize + itemSpacing;
    }
    return keylines;
  }
}

/** Whether an item of `size` centered at `offset` straddles the start edge. */
function isCutoffLeft(size: number, offset: number) {
  return offset - size / 2 < 0 && offset + size / 2 > 0;
}

/** Whether an item of `size` centered at `offset` straddles the end edge. */
function isCutoffRight(
  size: number,
  offset: number,
  carouselMainAxisSize: number,
) {
  return (
    offset - size / 2 < carouselMainAxisSize &&
    offset + size / 2 > carouselMainAxisSize
  );
}

/** `keylineListOf(carouselMainAxisSize, itemSpacing, carouselAlignment)`. */
export function keylineListOf(
  carouselMainAxisSize: number,
  itemSpacing: number,
  carouselAlignment: CarouselAlignment,
  keylines: (scope: KeylineListScope) => void,
): KeylineList {
  const scope = new KeylineListScopeImpl();
  keylines(scope);
  return scope.createWithAlignment(
    carouselMainAxisSize,
    itemSpacing,
    carouselAlignment,
  );
}

/** `keylineListOf(carouselMainAxisSize, itemSpacing, pivotIndex, pivotOffset)`. */
export function keylineListOfPivot(
  carouselMainAxisSize: number,
  itemSpacing: number,
  pivotIndex: number,
  pivotOffset: number,
  keylines: (scope: KeylineListScope) => void,
): KeylineList {
  const scope = new KeylineListScopeImpl();
  keylines(scope);
  return scope.createWithPivot(
    carouselMainAxisSize,
    itemSpacing,
    pivotIndex,
    pivotOffset,
  );
}

/** `lerp(start: Keyline, end: Keyline, fraction)`. */
export function lerpKeyline(
  start: Keyline,
  end: Keyline,
  fraction: number,
): Keyline {
  return {
    size: lerp(start.size, end.size, fraction),
    offset: lerp(start.offset, end.offset, fraction),
    unadjustedOffset: lerp(
      start.unadjustedOffset,
      end.unadjustedOffset,
      fraction,
    ),
    isFocal: fraction < 0.5 ? start.isFocal : end.isFocal,
    isAnchor: fraction < 0.5 ? start.isAnchor : end.isAnchor,
    isPivot: fraction < 0.5 ? start.isPivot : end.isPivot,
    cutoff: lerp(start.cutoff, end.cutoff, fraction),
  };
}

/** `lerp(from: KeylineList, to: KeylineList, fraction)`. */
export function lerpKeylineList(
  from: KeylineList,
  to: KeylineList,
  fraction: number,
): KeylineList {
  return new KeylineList(
    from.keylines.map((k, i) => lerpKeyline(k, to.keylines[i], fraction)),
  );
}

// ---------------------------------------------------------------------------
// Keylines.kt
// ---------------------------------------------------------------------------

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
export function multiBrowseKeylineList({
  carouselMainAxisSize,
  preferredItemSize,
  itemSpacing,
  itemCount,
  minSmallItemSize = MIN_SMALL_ITEM_SIZE,
  maxSmallItemSize = MAX_SMALL_ITEM_SIZE,
  anchorSize = ANCHOR_SIZE,
}: KeylineOptions & {preferredItemSize: number}): KeylineList {
  if (carouselMainAxisSize === 0 || preferredItemSize === 0) {
    return KeylineList.EMPTY;
  }

  let smallCounts = [1];
  const mediumCounts = [1, 0];

  const targetLargeSize = Math.min(preferredItemSize, carouselMainAxisSize);
  // Ideally a small item is 1/3 the size of the large item and medium items
  // are sized between large and small items. Clamp the small target size
  // within the min-max range and as close to 1/3 of the large size as
  // possible.
  const targetSmallSize = coerceIn(
    targetLargeSize / 3,
    minSmallItemSize,
    maxSmallItemSize,
  );
  const targetMediumSize = (targetLargeSize + targetSmallSize) / 2;

  if (carouselMainAxisSize < minSmallItemSize * 2) {
    // If the available space is too small to fit a large item and small item
    // allow arrangements with no small items.
    smallCounts = [0];
  }

  // Find the minimum space left for large items after filling the carousel
  // with the most permissible medium and small items to determine a
  // plausible minimum large count.
  const minAvailableLargeSpace =
    carouselMainAxisSize -
    targetMediumSize * Math.max(...mediumCounts) -
    maxSmallItemSize * Math.max(...smallCounts);
  const minLargeCount = Math.max(
    1,
    Math.floor(minAvailableLargeSpace / targetLargeSize),
  );
  const maxLargeCount = Math.ceil(carouselMainAxisSize / targetLargeSize);
  const largeCounts = Array.from(
    {length: Math.max(0, maxLargeCount - minLargeCount + 1)},
    (_, i) => maxLargeCount - i,
  );

  let arrangement = Arrangement.findLowestCostArrangement({
    availableSpace: carouselMainAxisSize,
    itemSpacing,
    targetSmallSize,
    minSmallSize: minSmallItemSize,
    maxSmallSize: maxSmallItemSize,
    smallCounts,
    targetMediumSize,
    mediumCounts,
    targetLargeSize,
    largeCounts,
  });

  if (arrangement && arrangement.itemCount() > itemCount) {
    let keylineSurplus = arrangement.itemCount() - itemCount;
    let smallCount = arrangement.smallCount;
    let mediumCount = arrangement.mediumCount;
    while (keylineSurplus > 0) {
      if (smallCount > 0) {
        smallCount -= 1;
      } else if (mediumCount > 1) {
        // Keep at least 1 medium so the large items don't fill the entire
        // carousel in new strategy.
        mediumCount -= 1;
      }
      // large items don't need to be removed even if they are a surplus
      // because large items are already fully unmasked.
      keylineSurplus -= 1;
    }
    arrangement = Arrangement.findLowestCostArrangement({
      availableSpace: carouselMainAxisSize,
      itemSpacing,
      targetSmallSize,
      minSmallSize: minSmallItemSize,
      maxSmallSize: maxSmallItemSize,
      smallCounts: [smallCount],
      targetMediumSize,
      mediumCounts: [mediumCount],
      targetLargeSize,
      largeCounts,
    });
  }

  if (!arrangement) {
    return KeylineList.EMPTY;
  }

  return createLeftAlignedKeylineList(
    carouselMainAxisSize,
    itemSpacing,
    anchorSize,
    anchorSize,
    arrangement,
  );
}

/**
 * Keylines for an uncontained carousel: as many `itemSize` items as fit, plus
 * a medium item cut off by the end edge (`uncontainedKeylineList`).
 */
export function uncontainedKeylineList({
  carouselMainAxisSize,
  itemSize,
  itemSpacing,
  anchorSize = ANCHOR_SIZE,
}: Omit<KeylineOptions, 'itemCount'> & {itemSize: number}): KeylineList {
  if (carouselMainAxisSize === 0 || itemSize === 0) {
    return KeylineList.EMPTY;
  }

  const largeItemSize = Math.min(itemSize + itemSpacing, carouselMainAxisSize);
  // Calculate how much space there is remaining after squeezing in as many
  // large items as we can.
  const largeCount = Math.max(
    1,
    Math.floor(carouselMainAxisSize / largeItemSize),
  );
  const remainingSpace = carouselMainAxisSize - largeCount * largeItemSize;
  const mediumCount = remainingSpace > 0 ? 1 : 0;

  const mediumItemSize = calculateMediumChildSize(
    anchorSize,
    largeItemSize,
    remainingSpace,
  );
  const arrangement = new Arrangement(
    0,
    0,
    0,
    mediumItemSize,
    mediumCount,
    largeItemSize,
    largeCount,
  );

  const xSmallSize = Math.min(anchorSize, itemSize);
  // Make the left anchor size half the cut off item size to make the motion
  // at the left closer to the right where the cut off is.
  const leftAnchorSize = Math.max(xSmallSize, mediumItemSize * 0.5);
  return createLeftAlignedKeylineList(
    carouselMainAxisSize,
    itemSpacing,
    leftAnchorSize,
    anchorSize,
    arrangement,
  );
}

/**
 * Keylines for a hero carousel: one or more large items and one small item,
 * or, centered, large items between two small items (`heroKeylineList`).
 *
 * @param preferredItemSize the desired large item size, or null to fill the
 *     container
 */
export function heroKeylineList({
  carouselMainAxisSize,
  preferredItemSize,
  itemSpacing,
  itemCount,
  isCentered = false,
  minSmallItemSize = MIN_SMALL_ITEM_SIZE,
  maxSmallItemSize = MAX_SMALL_ITEM_SIZE,
  anchorSize = ANCHOR_SIZE,
}: KeylineOptions & {
  preferredItemSize: number | null;
  isCentered?: boolean;
}): KeylineList {
  if (carouselMainAxisSize === 0) {
    return KeylineList.EMPTY;
  }
  // Force arrangements with less than 3 items to be start-aligned since they
  // cannot be centered
  const shouldCenter = isCentered && itemCount >= 3;
  let smallCounts: number[];
  if (itemCount <= 1) {
    // If there is only one item, it should be large with no small items
    smallCounts = [0];
  } else if (shouldCenter) {
    // Centered arrangements always need even numbers of small items
    smallCounts = [2];
  } else {
    // Otherwise make a start-aligned hero carousel with one small item
    smallCounts = [1];
  }

  const targetLargeSize = Math.min(
    preferredItemSize ?? carouselMainAxisSize,
    carouselMainAxisSize,
  );
  // Visually balanced layouts should aim to use small items that are 1/3 the
  // size of large items
  const targetSmallSize = coerceIn(
    targetLargeSize / 3,
    minSmallItemSize,
    maxSmallItemSize,
  );
  // Ensure there is enough space for the required number of small items plus
  // a large item that is at least 25% larger than small items.
  const fullscreenThreshold =
    minSmallItemSize * Math.max(...smallCounts) + minSmallItemSize * 1.25;
  if (carouselMainAxisSize < fullscreenThreshold) {
    smallCounts = [0];
  }

  const minAvailableLargeSpace =
    carouselMainAxisSize - minSmallItemSize * Math.max(...smallCounts);
  const minLargeCount = Math.max(
    1,
    Math.floor(minAvailableLargeSpace / targetLargeSize),
  );
  const maxLargeCount = Math.ceil(carouselMainAxisSize / targetLargeSize);
  const largeCounts = Array.from(
    {length: Math.max(0, maxLargeCount - minLargeCount + 1)},
    (_, i) => maxLargeCount - i,
  );

  const arrangement = Arrangement.findLowestCostArrangement({
    availableSpace: carouselMainAxisSize,
    itemSpacing,
    targetSmallSize,
    minSmallSize: minSmallItemSize,
    maxSmallSize: maxSmallItemSize,
    smallCounts,
    targetMediumSize: 0,
    mediumCounts: [0],
    targetLargeSize,
    largeCounts,
  });

  if (!arrangement) {
    return KeylineList.EMPTY;
  }

  if (shouldCenter && itemCount >= arrangement.itemCount()) {
    // When centered and there are enough items to fill all keyline
    // positions, create a centered arrangement.
    return createCenterAlignedKeylineList(
      carouselMainAxisSize,
      itemSpacing,
      anchorSize,
      anchorSize,
      arrangement,
    );
  }
  return createLeftAlignedKeylineList(
    carouselMainAxisSize,
    itemSpacing,
    anchorSize,
    anchorSize,
    arrangement,
  );
}

/**
 * Keylines for a full-screen carousel: a single large item that fills the
 * container between two anchors. Compose has no full-screen keyline factory;
 * this is `createLeftAlignedKeylineList` with one large item, which is what
 * `heroKeylineList` produces when no small item fits.
 */
export function fullScreenKeylineList({
  carouselMainAxisSize,
  itemSpacing,
  anchorSize = ANCHOR_SIZE,
}: Omit<KeylineOptions, 'itemCount'>): KeylineList {
  if (carouselMainAxisSize === 0) {
    return KeylineList.EMPTY;
  }
  return createLeftAlignedKeylineList(
    carouselMainAxisSize,
    itemSpacing,
    anchorSize,
    anchorSize,
    new Arrangement(0, 0, 0, 0, 0, carouselMainAxisSize, 1),
  );
}

/** `createLeftAlignedKeylineList`. */
export function createLeftAlignedKeylineList(
  carouselMainAxisSize: number,
  itemSpacing: number,
  leftAnchorSize: number,
  rightAnchorSize: number,
  arrangement: Arrangement,
): KeylineList {
  return keylineListOf(carouselMainAxisSize, itemSpacing, 'start', (k) => {
    k.add(leftAnchorSize, true);
    for (let i = 0; i < arrangement.largeCount; i++) k.add(arrangement.largeSize);
    for (let i = 0; i < arrangement.mediumCount; i++) {
      k.add(arrangement.mediumSize);
    }
    for (let i = 0; i < arrangement.smallCount; i++) k.add(arrangement.smallSize);
    k.add(rightAnchorSize, true);
  });
}

/** `createCenterAlignedKeylineList`. */
export function createCenterAlignedKeylineList(
  carouselMainAxisSize: number,
  itemSpacing: number,
  leftAnchorSize: number,
  rightAnchorSize: number,
  arrangement: Arrangement,
): KeylineList {
  const half = (n: number) => Math.trunc(n / 2);
  return keylineListOf(carouselMainAxisSize, itemSpacing, 'center', (k) => {
    k.add(leftAnchorSize, true);
    for (let i = 0; i < half(arrangement.smallCount); i++) {
      k.add(arrangement.smallSize);
    }
    for (let i = 0; i < half(arrangement.mediumCount); i++) {
      k.add(arrangement.mediumSize);
    }
    for (let i = 0; i < arrangement.largeCount; i++) k.add(arrangement.largeSize);
    for (let i = 0; i < half(arrangement.mediumCount); i++) {
      k.add(arrangement.mediumSize);
    }
    for (let i = 0; i < half(arrangement.smallCount); i++) {
      k.add(arrangement.smallSize);
    }
    k.add(rightAnchorSize, true);
  });
}

/** `calculateMediumChildSize` (`Keylines.kt`). */
function calculateMediumChildSize(
  minimumMediumSize: number,
  largeItemSize: number,
  remainingSpace: number,
): number {
  // With the remaining space, add a 'medium' size item that gets
  // sufficiently cut off: ideally a third of it, so 1.5x the remaining space.
  let mediumItemSize = minimumMediumSize;
  const sizeWithThirdCutOff = remainingSpace * 1.5;
  mediumItemSize = Math.max(sizeWithThirdCutOff, mediumItemSize);

  // If the medium child is too similar to the large child it won't create
  // sufficient motion when scrolling between them.
  const largeItemThreshold = largeItemSize * MEDIUM_LARGE_ITEM_DIFF_THRESHOLD;
  if (mediumItemSize > largeItemThreshold) {
    // Choose whichever is bigger between the maximum threshold of the medium
    // child size, or a size such that only 20% of the space is cut off.
    const sizeWithFifthCutOff = remainingSpace * 1.2;
    // The resulting size should not exceed the large item size.
    mediumItemSize = Math.min(
      Math.max(largeItemThreshold, sizeWithFifthCutOff),
      largeItemSize,
    );
  }
  return mediumItemSize;
}
