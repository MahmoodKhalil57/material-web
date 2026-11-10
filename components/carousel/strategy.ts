/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// A TypeScript port of the Jetpack Compose Material 3 carousel strategy and
// item placement: `androidx/compose/material3/carousel/Strategy.kt`,
// `KeylineSnapPosition.kt`, the `Modifier.carouselItem` layout in
// `Carousel.kt`, and `calculateItemInfo` in
// `CarouselParallaxScrollEffect.kt`.

import {
  type Keyline,
  keylineEquals,
  KeylineList,
  keylineListOfPivot,
  lerp,
  lerpKeyline,
  lerpKeylineList,
  lerpRange,
} from './keylines.js';

/**
 * Derives the scroll-dependent keyline lists of a carousel from its default
 * keylines: the steps that shift the focal range to the start and end of the
 * container as the carousel scrolls to its first and last items
 * (`Strategy.kt` `class Strategy`).
 */
export class Strategy {
  static readonly EMPTY = new Strategy(KeylineList.EMPTY, 0, 0, 0, 0);

  readonly startKeylineSteps: KeylineList[];
  readonly endKeylineSteps: KeylineList[];
  readonly minItemSize: number;
  readonly maxItemSize: number;
  /** The scroll distance needed to move through all start steps. */
  private readonly startShiftDistance: number;
  /** The scroll distance needed to move through all end steps. */
  private readonly endShiftDistance: number;
  /** Fraction of `startShiftDistance` scrolled at each start step. */
  private readonly startShiftPoints: number[];
  /** Fraction of `endShiftDistance` scrolled at each end step. */
  private readonly endShiftPoints: number[];
  /** True if this strategy has valid keylines for a valid container. */
  readonly isValid: boolean;

  private lastStartAndEndKeylineListSteps: KeylineList[] | null = null;
  private cachedScrollOffset = -1;
  private cachedMaxScrollOffset = -1;
  private cachedRoundToNearestStep = false;
  private cachedKeylineList: KeylineList | null = null;

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
  constructor(
    readonly defaultKeylines: KeylineList,
    readonly availableSpace: number,
    readonly itemSpacing: number,
    readonly beforeContentPadding: number,
    readonly afterContentPadding: number,
    readonly centered = false,
  ) {
    this.startKeylineSteps = centered
      ? [defaultKeylines]
      : getStartKeylineSteps(
          defaultKeylines,
          availableSpace,
          itemSpacing,
          beforeContentPadding,
        );
    this.endKeylineSteps = centered
      ? [defaultKeylines]
      : getEndKeylineSteps(
          defaultKeylines,
          availableSpace,
          itemSpacing,
          afterContentPadding,
        );
    let min = defaultKeylines.minSize;
    let max = defaultKeylines.maxSize;
    for (const step of [...this.startKeylineSteps, ...this.endKeylineSteps]) {
      if (step.minSize < min) min = step.minSize;
      if (step.maxSize > max) max = step.maxSize;
    }
    this.minItemSize = min;
    this.maxItemSize = max;
    this.startShiftDistance = getStartShiftDistance(
      this.startKeylineSteps,
      beforeContentPadding,
    );
    this.endShiftDistance = getEndShiftDistance(
      this.endKeylineSteps,
      afterContentPadding,
    );
    this.startShiftPoints = getStepInterpolationPoints(
      this.startShiftDistance,
      this.startKeylineSteps,
      true,
    );
    this.endShiftPoints = getStepInterpolationPoints(
      this.endShiftDistance,
      this.endKeylineSteps,
      false,
    );
    this.isValid =
      !defaultKeylines.isEmpty() &&
      availableSpace !== 0 &&
      this.itemMainAxisSize !== 0;
  }

  /**
   * For a `centered` strategy, how far the first item's natural position is
   * shifted into the container so that it rests on the first focal keyline;
   * 0 otherwise. The scroller needs this much leading space.
   */
  get originShift(): number {
    if (!this.centered || this.defaultKeylines.isEmpty()) return 0;
    return Math.max(
      0,
      Math.round(
        this.defaultKeylines.firstFocal.unadjustedOffset -
          this.itemMainAxisSize / 2,
      ),
    );
  }

  /** The size of items when in focus and fully unmasked. */
  get itemMainAxisSize(): number {
    return this.defaultKeylines.isEmpty()
      ? 0
      : this.defaultKeylines.firstFocal.size;
  }

  /**
   * The keyline list for `scrollOffset` (`getKeylineListForScrollOffset`).
   *
   * @param roundToNearestStep true to return a complete shift step
   */
  getKeylineListForScrollOffset(
    scrollOffset: number,
    maxScrollOffset: number,
    roundToNearestStep = false,
  ): KeylineList {
    if (
      scrollOffset === this.cachedScrollOffset &&
      maxScrollOffset === this.cachedMaxScrollOffset &&
      roundToNearestStep === this.cachedRoundToNearestStep &&
      this.cachedKeylineList
    ) {
      return this.cachedKeylineList;
    }
    const result = this.getKeylineListForScrollOffsetInternal(
      scrollOffset,
      maxScrollOffset,
      roundToNearestStep,
    );
    this.cachedScrollOffset = scrollOffset;
    this.cachedMaxScrollOffset = maxScrollOffset;
    this.cachedRoundToNearestStep = roundToNearestStep;
    this.cachedKeylineList = result;
    return result;
  }

  private getKeylineListForScrollOffsetInternal(
    scrollOffset: number,
    maxScrollOffset: number,
    roundToNearestStep: boolean,
  ): KeylineList {
    // Centered strategies keep the focal items in the middle.
    if (this.centered) return this.defaultKeylines;
    // The scroll offset could be slightly negative due to rounding.
    const positiveScrollOffset = Math.max(0, scrollOffset);
    const startShiftOffset = this.startShiftDistance;
    const endShiftOffset = Math.max(0, maxScrollOffset - this.endShiftDistance);

    // If we're not within either shift range, return the default keylines
    if (
      positiveScrollOffset >= startShiftOffset &&
      positiveScrollOffset <= endShiftOffset
    ) {
      return this.defaultKeylines;
    }

    let interpolation = lerpRange(
      1,
      0,
      0,
      startShiftOffset,
      positiveScrollOffset,
    );
    let shiftPoints = this.startShiftPoints;
    let steps = this.startKeylineSteps;

    if (positiveScrollOffset > endShiftOffset) {
      interpolation = lerpRange(
        0,
        1,
        endShiftOffset,
        maxScrollOffset,
        positiveScrollOffset,
      );
      shiftPoints = this.endShiftPoints;
      steps = this.endKeylineSteps;

      // If end shifting begins at the beginning of the list, interpolate
      // directly from the last start step to the last end step and skip the
      // default step.
      if (
        endShiftOffset < 0.01 &&
        this.startKeylineSteps.length === 2 &&
        this.endKeylineSteps.length === 2
      ) {
        this.lastStartAndEndKeylineListSteps ??= [
          this.startKeylineSteps[this.startKeylineSteps.length - 1],
          this.endKeylineSteps[this.endKeylineSteps.length - 1],
        ];
        steps = this.lastStartAndEndKeylineListSteps;
      }
    }

    let fromStepIndex = 0;
    let toStepIndex = 0;
    let steppedInterpolation = 0;
    let lowerBounds = shiftPoints[0];
    for (let i = 1; i < steps.length; i++) {
      const upperBounds = shiftPoints[i];
      if (interpolation <= upperBounds) {
        fromStepIndex = i - 1;
        toStepIndex = i;
        steppedInterpolation = lerpRange(
          0,
          1,
          lowerBounds,
          upperBounds,
          interpolation,
        );
        break;
      }
      lowerBounds = upperBounds;
    }

    if (roundToNearestStep) {
      return Math.round(steppedInterpolation) === 0
        ? steps[fromStepIndex]
        : steps[toStepIndex];
    }

    return lerpKeylineList(
      steps[fromStepIndex],
      steps[toStepIndex],
      steppedInterpolation,
    );
  }
}

/** `getStartShiftDistance` (`Strategy.kt`). */
function getStartShiftDistance(
  startKeylineSteps: KeylineList[],
  beforeContentPadding: number,
): number {
  if (startKeylineSteps.length === 0) return 0;
  return Math.max(
    startKeylineSteps[startKeylineSteps.length - 1].first().unadjustedOffset -
      startKeylineSteps[0].first().unadjustedOffset,
    beforeContentPadding,
  );
}

/** `getEndShiftDistance` (`Strategy.kt`). */
function getEndShiftDistance(
  endKeylineSteps: KeylineList[],
  afterContentPadding: number,
): number {
  if (endKeylineSteps.length === 0) return 0;
  return Math.max(
    endKeylineSteps[0].last().unadjustedOffset -
      endKeylineSteps[endKeylineSteps.length - 1].last().unadjustedOffset,
    afterContentPadding,
  );
}

/**
 * The keyline lists that shift the focal range to the start of the container
 * as the carousel scrolls to its first item (`getStartKeylineSteps`).
 */
function getStartKeylineSteps(
  defaultKeylines: KeylineList,
  carouselMainAxisSize: number,
  itemSpacing: number,
  beforeContentPadding: number,
): KeylineList[] {
  if (defaultKeylines.isEmpty()) return [];
  const steps: KeylineList[] = [defaultKeylines];

  if (defaultKeylines.isFirstFocalItemAtStartOfContainer()) {
    if (beforeContentPadding !== 0) {
      steps.push(
        createShiftedKeylineListForContentPadding(
          defaultKeylines,
          carouselMainAxisSize,
          itemSpacing,
          beforeContentPadding,
          defaultKeylines.firstFocal,
          defaultKeylines.firstFocalIndex,
        ),
      );
    }
    return steps;
  }

  const startIndex = defaultKeylines.firstNonAnchorIndex;
  const endIndex = defaultKeylines.firstFocalIndex;
  const numberOfSteps = endIndex - startIndex;

  // If there are no steps but we need to account for a cutoff, create a list
  // of keylines shifted for the cutoff.
  if (numberOfSteps <= 0 && defaultKeylines.firstFocal.cutoff > 0) {
    steps.push(
      moveKeylineAndCreateShiftedKeylineList(
        defaultKeylines,
        0,
        0,
        carouselMainAxisSize,
        itemSpacing,
      ),
    );
    return steps;
  }

  for (let i = 0; i < numberOfSteps; i++) {
    const prevStep = steps[steps.length - 1];
    const originalItemIndex = startIndex + i;
    let dstIndex = defaultKeylines.lastIndex;
    if (originalItemIndex > 0) {
      const originalNeighborBeforeSize =
        defaultKeylines.get(originalItemIndex - 1).size;
      dstIndex =
        prevStep.firstIndexAfterFocalRangeWithSize(originalNeighborBeforeSize) -
        1;
    }
    steps.push(
      moveKeylineAndCreateShiftedKeylineList(
        prevStep,
        defaultKeylines.firstNonAnchorIndex,
        dstIndex,
        carouselMainAxisSize,
        itemSpacing,
      ),
    );
  }

  if (beforeContentPadding !== 0) {
    const last = steps[steps.length - 1];
    steps[steps.length - 1] = createShiftedKeylineListForContentPadding(
      last,
      carouselMainAxisSize,
      itemSpacing,
      beforeContentPadding,
      last.firstFocal,
      last.firstFocalIndex,
    );
  }
  return steps;
}

/**
 * The keyline lists that shift the focal range to the end of the container
 * as the carousel scrolls to its last item (`getEndKeylineSteps`).
 */
function getEndKeylineSteps(
  defaultKeylines: KeylineList,
  carouselMainAxisSize: number,
  itemSpacing: number,
  afterContentPadding: number,
): KeylineList[] {
  if (defaultKeylines.isEmpty()) return [];
  const steps: KeylineList[] = [defaultKeylines];

  if (defaultKeylines.isLastFocalItemAtEndOfContainer(carouselMainAxisSize)) {
    if (afterContentPadding !== 0) {
      steps.push(
        createShiftedKeylineListForContentPadding(
          defaultKeylines,
          carouselMainAxisSize,
          itemSpacing,
          -afterContentPadding,
          defaultKeylines.lastFocal,
          defaultKeylines.lastFocalIndex,
        ),
      );
    }
    return steps;
  }

  const startIndex = defaultKeylines.lastFocalIndex;
  const endIndex = defaultKeylines.lastNonAnchorIndex;
  const numberOfSteps = endIndex - startIndex;

  if (numberOfSteps <= 0 && defaultKeylines.lastFocal.cutoff > 0) {
    steps.push(
      moveKeylineAndCreateShiftedKeylineList(
        defaultKeylines,
        0,
        0,
        carouselMainAxisSize,
        itemSpacing,
      ),
    );
    return steps;
  }

  for (let i = 0; i < numberOfSteps; i++) {
    const prevStep = steps[steps.length - 1];
    const originalItemIndex = endIndex - i;
    let dstIndex = 0;
    if (originalItemIndex < defaultKeylines.lastIndex) {
      const originalNeighborAfterSize =
        defaultKeylines.get(originalItemIndex + 1).size;
      dstIndex =
        prevStep.lastIndexBeforeFocalRangeWithSize(originalNeighborAfterSize) +
        1;
    }
    steps.push(
      moveKeylineAndCreateShiftedKeylineList(
        prevStep,
        defaultKeylines.lastNonAnchorIndex,
        dstIndex,
        carouselMainAxisSize,
        itemSpacing,
      ),
    );
  }

  if (afterContentPadding !== 0) {
    const last = steps[steps.length - 1];
    steps[steps.length - 1] = createShiftedKeylineListForContentPadding(
      last,
      carouselMainAxisSize,
      itemSpacing,
      -afterContentPadding,
      last.lastFocal,
      last.lastFocalIndex,
    );
  }
  return steps;
}

/**
 * Shrinks every non-anchor keyline to make room for content padding
 * (`createShiftedKeylineListForContentPadding`).
 */
function createShiftedKeylineListForContentPadding(
  from: KeylineList,
  carouselMainAxisSize: number,
  itemSpacing: number,
  contentPadding: number,
  pivot: Keyline,
  pivotIndex: number,
): KeylineList {
  const numberOfNonAnchorKeylines = from.keylines.filter(
    (k) => !k.isAnchor,
  ).length;
  const sizeReduction = contentPadding / numberOfNonAnchorKeylines;
  // Create a new keyline list with offsets adjusted for each item's reduction
  // in size.
  const newKeylines = keylineListOfPivot(
    carouselMainAxisSize,
    itemSpacing,
    pivotIndex,
    pivot.offset - sizeReduction / 2 + contentPadding,
    (scope) => {
      for (const k of from.keylines) {
        scope.add(k.size - Math.abs(sizeReduction), k.isAnchor);
      }
    },
  );
  // Reset each item's unadjusted offset back to the incoming value: items are
  // still laid out end-to-end with the original item size.
  return new KeylineList(
    newKeylines.keylines.map((k, i) => ({
      ...k,
      unadjustedOffset: from.get(i).unadjustedOffset,
    })),
  );
}

/** `moveKeylineAndCreateShiftedKeylineList` (`Strategy.kt`). */
function moveKeylineAndCreateShiftedKeylineList(
  from: KeylineList,
  srcIndex: number,
  dstIndex: number,
  carouselMainAxisSize: number,
  itemSpacing: number,
): KeylineList {
  // -1 if the pivot is shifting left/top, 1 if shifting right/bottom
  const pivotDir = srcIndex > dstIndex ? 1 : -1;
  const pivotDelta =
    (from.get(srcIndex).size - from.get(srcIndex).cutoff + itemSpacing) *
    pivotDir;
  const newPivotIndex = from.pivotIndex + pivotDir;
  const newPivotOffset = from.pivot.offset + pivotDelta;
  const moved = [...from.keylines];
  const [keyline] = moved.splice(srcIndex, 1);
  moved.splice(dstIndex, 0, keyline);
  return keylineListOfPivot(
    carouselMainAxisSize,
    itemSpacing,
    newPivotIndex,
    newPivotOffset,
    (scope) => {
      for (const k of moved) scope.add(k.size, k.isAnchor);
    },
  );
}

/** `getStepInterpolationPoints` (`Strategy.kt`). */
function getStepInterpolationPoints(
  totalShiftDistance: number,
  steps: KeylineList[],
  isShiftingLeft: boolean,
): number[] {
  const points = [0];
  if (totalShiftDistance === 0 || steps.length === 0) {
    return points;
  }
  for (let i = 1; i < steps.length; i++) {
    const prevKeylines = steps[i - 1];
    const currKeylines = steps[i];
    const distanceShifted = isShiftingLeft
      ? currKeylines.first().unadjustedOffset -
        prevKeylines.first().unadjustedOffset
      : prevKeylines.last().unadjustedOffset -
        currKeylines.last().unadjustedOffset;
    const stepPercentage = distanceShifted / totalShiftDistance;
    points.push(i === steps.length - 1 ? 1 : points[i - 1] + stepPercentage);
  }
  return points;
}

// ---------------------------------------------------------------------------
// KeylineSnapPosition.kt
// ---------------------------------------------------------------------------

/**
 * The distance from the container's start at which item `itemIndex` rests
 * when snapped (`getSnapPositionOffset`).
 */
export function getSnapPositionOffset(
  strategy: Strategy,
  itemIndex: number,
  itemCount: number,
): number {
  if (!strategy.isValid) return 0;
  // Default to snapping the first focal keyline to its resting position.
  let offset = Math.round(
    strategy.defaultKeylines.firstFocal.unadjustedOffset -
      strategy.itemMainAxisSize / 2,
  );

  const startSteps = strategy.startKeylineSteps;
  if (itemIndex <= startSteps.length - 1) {
    // Items at the start of the list align with their corresponding step
    // index when in focus. Steps go from the default step to the first start
    // step, so get the step from last to first.
    const stepIndex = Math.min(
      Math.max(startSteps.length - 1 - itemIndex, 0),
      startSteps.length - 1,
    );
    const startKeylines = startSteps[stepIndex];
    offset = Math.round(
      startKeylines.firstFocal.unadjustedOffset -
        strategy.itemMainAxisSize / 2,
    );
  }

  const endSteps = strategy.endKeylineSteps;
  const lastItemIndex = itemCount - 1;
  if (
    itemIndex >= lastItemIndex - (endSteps.length - 1) &&
    // If all items fall on focal keylines, skip the end steps
    itemCount > strategy.defaultKeylines.focalCount
  ) {
    const stepIndex = Math.min(
      Math.max(endSteps.length - 1 - (lastItemIndex - itemIndex), 0),
      endSteps.length - 1,
    );
    const endKeylines = endSteps[stepIndex];
    offset = Math.round(
      endKeylines.lastFocal.unadjustedOffset - strategy.itemMainAxisSize / 2,
    );
  }
  return offset;
}

// ---------------------------------------------------------------------------
// Carousel.kt
// ---------------------------------------------------------------------------

/**
 * `calculateMaxScrollOffset` (`Carousel.kt`): the scroll range of items laid
 * out end-to-end at `itemMainAxisSize`.
 */
export function calculateMaxScrollOffset(
  strategy: Strategy,
  itemCount: number,
): number {
  const maxScrollPossible =
    strategy.itemMainAxisSize * itemCount +
    strategy.itemSpacing * (itemCount - 1);
  return Math.max(0, maxScrollPossible - strategy.availableSpace);
}

/**
 * The scroll offset at which item `index` is snapped: its end-to-end start
 * minus its snap position offset, clamped to the scroll range.
 */
export function getSnapScrollOffset(
  strategy: Strategy,
  index: number,
  itemCount: number,
): number {
  const itemSizeWithSpacing = strategy.itemMainAxisSize + strategy.itemSpacing;
  const offset =
    index * itemSizeWithSpacing -
    getSnapPositionOffset(strategy, index, itemCount);
  return Math.min(
    Math.max(offset, 0),
    calculateMaxScrollOffset(strategy, itemCount),
  );
}

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

function getProgress(before: Keyline, after: Keyline, unadjustedOffset: number) {
  if (keylineEquals(before, after)) {
    return 1;
  }
  const total = after.unadjustedOffset - before.unadjustedOffset;
  return (unadjustedOffset - before.unadjustedOffset) / total;
}

/**
 * The mask and translation of item `index` (`Modifier.carouselItem` in
 * `Carousel.kt`). Items are laid out end-to-end at `itemMainAxisSize`; each
 * is masked to its interpolated keyline's size, centered, and translated so
 * that masked items sit edge to edge.
 */
export function placeCarouselItem(
  strategy: Strategy,
  keylines: KeylineList,
  index: number,
  scrollOffset: number,
): CarouselItemPlacement {
  const itemMainAxisSize = strategy.itemMainAxisSize;
  // Find center of the item at this index
  const itemSizeWithSpacing = itemMainAxisSize + strategy.itemSpacing;
  const unadjustedCenter =
    index * itemSizeWithSpacing + itemMainAxisSize / 2 - scrollOffset;

  // Find the keyline before and after this item's center and create an
  // interpolated keyline for its clip shape and offset
  const keylineBefore = keylines.getKeylineBefore(unadjustedCenter);
  const keylineAfter = keylines.getKeylineAfter(unadjustedCenter);
  const progress = getProgress(keylineBefore, keylineAfter, unadjustedCenter);
  const interpolatedKeyline = lerpKeyline(keylineBefore, keylineAfter, progress);
  const isOutOfKeylineBounds = keylineEquals(keylineBefore, keylineAfter);

  const center = itemMainAxisSize / 2;
  const halfMaskSize = interpolatedKeyline.size / 2;

  // After clipping, the items will have white space between them. Translate
  // the items to pin their edges together.
  let translation = interpolatedKeyline.offset - unadjustedCenter;
  if (isOutOfKeylineBounds) {
    // Beyond the first or last keyline, keep offsetting the item by cutting
    // its unadjustedOffset according to its masked size.
    const outOfBoundsOffset =
      (unadjustedCenter - interpolatedKeyline.unadjustedOffset) /
      interpolatedKeyline.size;
    translation += outOfBoundsOffset;
  }
  return {
    size: interpolatedKeyline.size,
    maskStart: center - halfMaskSize,
    maskEnd: center + halfMaskSize,
    translation,
    keyline: interpolatedKeyline,
  };
}

// ---------------------------------------------------------------------------
// CarouselParallaxScrollEffect.kt
// ---------------------------------------------------------------------------

/** `CarouselParallaxScrollEffectItemInfo`. */
export interface ParallaxItemInfo {
  maskStart: number;
  maskEnd: number;
  parallax: number;
  maskProgress: number;
}

/** Mask intensity based on the item's aspect ratio (`getMaskIntensity`). */
function getMaskIntensity(itemMainAxisSize: number, itemCrossAxisSize: number) {
  const ar = itemMainAxisSize / itemCrossAxisSize;
  if (ar > 16 / 9) return 1 / 2;
  if (ar < 16 / 9 && ar > 1) return lerpRange(1 / 3, 1 / 2, 1, 16 / 9, ar);
  if (ar < 1 && ar > 9 / 16) return lerpRange(1 / 4, 1 / 3, 9 / 16, 1, ar);
  return 1 / 4;
}

/**
 * The mask and parallax of an item in a list of items of their own sizes as
 * it enters or leaves the viewport (`calculateItemInfo` in
 * `CarouselParallaxScrollEffect.kt`), used by the uncontained multi-aspect
 * ratio layout.
 */
export function calculateParallaxItemInfo(
  itemMainAxisSize: number,
  itemCrossAxisSize: number,
  itemOffset: number,
  viewportStartOffset: number,
  viewportEndOffset: number,
): ParallaxItemInfo {
  if (itemMainAxisSize === 0) {
    return {maskStart: 0, maskEnd: 0, parallax: 0, maskProgress: 0};
  }
  const maskIntensity = getMaskIntensity(itemMainAxisSize, itemCrossAxisSize);
  const parallaxDistance = itemMainAxisSize * maskIntensity;

  // When the item is entering/exiting the start side of the viewport
  if (itemOffset < viewportStartOffset) {
    const offscreenDistance = viewportStartOffset - itemOffset;
    const maskProgress = Math.min(
      Math.max(offscreenDistance / itemMainAxisSize, 0),
      1,
    );
    return {
      maskStart: lerp(0, itemMainAxisSize * (1 - maskIntensity), maskProgress),
      maskEnd: itemMainAxisSize,
      parallax: lerp(0, parallaxDistance, maskProgress),
      maskProgress,
    };
  }

  // When the item is entering/exiting the end side of the viewport
  if (itemOffset > viewportEndOffset - itemMainAxisSize) {
    const offscreenDistance = -(
      viewportEndOffset -
      itemOffset -
      itemMainAxisSize
    );
    const maskProgress = Math.min(
      Math.max(offscreenDistance / itemMainAxisSize, 0),
      1,
    );
    return {
      maskStart: 0,
      maskEnd: lerp(itemMainAxisSize, itemMainAxisSize * maskIntensity, maskProgress),
      parallax: -lerp(0, parallaxDistance, maskProgress),
      maskProgress,
    };
  }

  return {maskStart: 0, maskEnd: itemMainAxisSize, parallax: 0, maskProgress: 0};
}
