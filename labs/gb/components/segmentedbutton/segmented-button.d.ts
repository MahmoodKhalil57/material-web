/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
import { isRtl as sharedIsRtl } from '../shared/roving-focus.js';
/** Segmented button densities: 0 (default) to -3, 4px shorter per step. */
export type SegmentedButtonDensity = 0 | -1 | -2 | -3;
/** The lowest supported density. */
export declare const MIN_DENSITY = -3;
/** Segmented button set classes. */
export declare const SEGMENTED_BUTTON_SET_CLASSES: {
    readonly segmentedButtonSet: "segmented-button-set";
    readonly density1: "segmented-button-set-density-1";
    readonly density2: "segmented-button-set-density-2";
    readonly density3: "segmented-button-set-density-3";
};
/** Segmented button (segment) classes. */
export declare const SEGMENTED_BUTTON_CLASSES: {
    readonly segmentedButton: "segmented-button";
    readonly selected: "segmented-button-selected";
    readonly withIcon: "segmented-button-with-icon";
    readonly withLabel: "segmented-button-with-label";
    readonly withCheckmark: "segmented-button-with-checkmark";
    readonly touch: "segmented-button-touch";
    readonly content: "segmented-button-content";
    readonly graphic: "segmented-button-graphic";
    readonly checkmark: "segmented-button-checkmark";
    readonly icon: "segmented-button-icon";
    readonly label: "segmented-button-label";
    readonly disabled: string;
};
/** Clamps a density to the supported 0..-3 range (integers). */
export declare function clampDensity(density: number): SegmentedButtonDensity;
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
export declare function segmentedButtonSetClasses({ density, }?: SegmentedButtonSetClassesState): ClassInfo;
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
export declare function segmentedButtonClasses({ selected, disabled, withIcon, withLabel, checkmark, }?: SegmentedButtonClassesState): ClassInfo;
/** Whether `key` moves focus between segments. */
export declare function isNavigationKey(key: string): boolean;
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
export declare function nextFocusIndex(count: number, current: number, key: string, canFocus: (index: number) => boolean, rtl?: boolean): number;
/** Whether an element is laid out right to left. */
export declare const isRtl: typeof sharedIsRtl;
/**
 * Sets up arrow-key focus navigation and a roving `tabindex` on a Light DOM
 * `.segmented-button-set` of `.segmented-button` buttons. Selection state is
 * up to the caller (toggle the `selected` class and `aria-checked`).
 *
 * @param set The `.segmented-button-set` element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export declare function setupSegmentedButtonSet(set: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds segmented button set classes and keyboard
 * navigation to an element.
 */
export declare const segmentedButtonSet: (state?: SegmentedButtonSetClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/** A Lit directive that adds segment classes to a `<button>`. */
export declare const segmentedButton: (state?: SegmentedButtonClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
