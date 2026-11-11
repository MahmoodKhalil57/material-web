/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES} from '../../foundations/interaction/states/pseudo-classes.js';
import {
  isRtl as sharedIsRtl,
  nextFocusIndex as sharedNextFocusIndex,
} from '../../foundations/interaction/inputs/roving-focus.js';

/** Segmented button densities: 0 (default) to -3, 4px shorter per step. */
export type SegmentedButtonDensity = 0 | -1 | -2 | -3;

/** The lowest supported density. */
export const MIN_DENSITY = -3;

/** Segmented button set classes. */
export const SEGMENTED_BUTTON_SET_CLASSES = {
  segmentedButtonSet: 'segmented-button-set',
  density1: 'segmented-button-set-density-1',
  density2: 'segmented-button-set-density-2',
  density3: 'segmented-button-set-density-3',
} as const;

/** Segmented button (segment) classes. */
export const SEGMENTED_BUTTON_CLASSES = {
  segmentedButton: 'segmented-button',
  selected: 'segmented-button-selected',
  withIcon: 'segmented-button-with-icon',
  withLabel: 'segmented-button-with-label',
  withCheckmark: 'segmented-button-with-checkmark',
  touch: 'segmented-button-touch',
  content: 'segmented-button-content',
  graphic: 'segmented-button-graphic',
  checkmark: 'segmented-button-checkmark',
  icon: 'segmented-button-icon',
  label: 'segmented-button-label',
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** Clamps a density to the supported 0..-3 range (integers). */
export function clampDensity(density: number): SegmentedButtonDensity {
  if (!Number.isFinite(density)) return 0;
  return Math.max(
    MIN_DENSITY,
    Math.min(0, Math.round(density)),
  ) as SegmentedButtonDensity;
}

/** The state provided to `segmentedButtonSetClasses()`. */
export interface SegmentedButtonSetClassesState {
  /** The density, 0 (default) to -3. */
  density?: number;
}

/**
 * Returns the segmented button set classes for the given state.
 *
 * @param state The state of the set.
 * @return An object of class names and truthy values if they apply.
 */
export function segmentedButtonSetClasses({
  density = 0,
}: SegmentedButtonSetClassesState = {}): ClassInfo {
  const d = clampDensity(density);
  return {
    [SEGMENTED_BUTTON_SET_CLASSES.segmentedButtonSet]: true,
    [SEGMENTED_BUTTON_SET_CLASSES.density1]: d === -1,
    [SEGMENTED_BUTTON_SET_CLASSES.density2]: d === -2,
    [SEGMENTED_BUTTON_SET_CLASSES.density3]: d === -3,
  };
}

/** The state provided to `segmentedButtonClasses()`. */
export interface SegmentedButtonClassesState {
  /** Whether the segment is selected. */
  selected?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
  /** Whether the segment has a leading icon. */
  withIcon?: boolean;
  /** Whether the segment has label text. */
  withLabel?: boolean;
  /** Whether a checkmark shows when selected. Defaults to true. */
  checkmark?: boolean;
}

/**
 * Returns the segment classes for the given state.
 *
 * @param state The state of the segment.
 * @return An object of class names and truthy values if they apply.
 */
export function segmentedButtonClasses({
  selected = false,
  disabled = false,
  withIcon = false,
  withLabel = true,
  checkmark = true,
}: SegmentedButtonClassesState = {}): ClassInfo {
  return {
    [SEGMENTED_BUTTON_CLASSES.segmentedButton]: true,
    [SEGMENTED_BUTTON_CLASSES.selected]: selected,
    [SEGMENTED_BUTTON_CLASSES.disabled]: disabled,
    [SEGMENTED_BUTTON_CLASSES.withIcon]: withIcon,
    [SEGMENTED_BUTTON_CLASSES.withLabel]: withLabel,
    [SEGMENTED_BUTTON_CLASSES.withCheckmark]: checkmark,
  };
}

/** Keys that move focus between segments. */
const NAVIGATION_KEYS = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
]);

/** Whether `key` moves focus between segments. */
export function isNavigationKey(key: string): boolean {
  return NAVIGATION_KEYS.has(key);
}

/**
 * Returns the index of the segment that a navigation key moves focus to, or
 * -1 if there is none. Focus wraps around and skips segments that `canFocus`
 * rejects (disabled segments). Left and right follow the reading direction:
 * in RTL, ArrowLeft moves to the next segment.
 *
 * @param count The number of segments.
 * @param current The index of the focused segment, or -1.
 * @param key The `KeyboardEvent.key`.
 * @param canFocus Whether the segment at an index can take focus.
 * @param rtl Whether the set is laid out right to left.
 */
export function nextFocusIndex(
  count: number,
  current: number,
  key: string,
  canFocus: (index: number) => boolean,
  rtl = false,
): number {
  return sharedNextFocusIndex(count, current, key, {canFocus, rtl});
}

/** Whether an element is laid out right to left. */
export const isRtl = sharedIsRtl;

/**
 * Sets up arrow-key focus navigation and a roving `tabindex` on a Light DOM
 * `.segmented-button-set` of `.segmented-button` buttons. Selection state is
 * up to the caller (toggle the `selected` class and `aria-checked`).
 *
 * @param set The `.segmented-button-set` element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export function setupSegmentedButtonSet(
  set: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  const items = () =>
    Array.from(set.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.classList.contains(SEGMENTED_BUTTON_CLASSES.segmentedButton) &&
        !child.hidden,
    );
  const canFocus = (item: HTMLElement) =>
    !item.matches(':disabled, .disabled, [aria-disabled="true"]');

  const setTabStop = (stop: HTMLElement | undefined) => {
    for (const item of items()) {
      item.tabIndex = item === stop ? 0 : -1;
    }
  };

  // The first focusable segment is the initial tab stop (spec "Initial
  // focus": the first segment, regardless of selection).
  setTabStop(items().find(canFocus));

  set.addEventListener(
    'focusin',
    (event) => {
      const item = items().find((i) => i === event.target);
      if (item) setTabStop(item);
    },
    opts,
  );

  set.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (event.defaultPrevented || !isNavigationKey(event.key)) return;
      const list = items();
      const current = list.findIndex((i) => i === event.target);
      if (current < 0) return;
      const next = nextFocusIndex(
        list.length,
        current,
        event.key,
        (i) => canFocus(list[i]),
        isRtl(set),
      );
      if (next < 0) return;
      event.preventDefault();
      setTabStop(list[next]);
      list[next].focus();
    },
    opts,
  );
}

/**
 * A Lit directive that adds segmented button set classes and keyboard
 * navigation to an element.
 */
export const segmentedButtonSet =
  createClassMapDirective<SegmentedButtonSetClassesState>({
    getClasses: segmentedButtonSetClasses,
    setupElement: setupSegmentedButtonSet,
  });

/** A Lit directive that adds segment classes to a `<button>`. */
export const segmentedButton =
  createClassMapDirective<SegmentedButtonClassesState>({
    getClasses: segmentedButtonClasses,
  });
