/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Slider size configuration types. */
export type SliderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
/** Slider orientation configuration types. */
export type SliderOrientation = 'horizontal' | 'vertical';
/** Slider classes. */
export declare const SLIDER_CLASSES: {
    readonly slider: "slider";
    readonly ranged: "slider-ranged";
    readonly disabled: string;
    readonly centered: "slider-centered";
    readonly vertical: "slider-vertical";
};
/** Default inset icon padding in pixels, following Material web conventions. */
export declare const ICON_PADDING_PX = 10;
/** Default inset icon size in pixels, sourced from Android M3E Slider.md. */
export declare const ICON_SIZE_PX = 24;
/** Inset icon size in pixels for extra-large (`xl`) sliders. */
export declare const ICON_SIZE_XL_PX = 32;
/**
 * Crossover distance from leading track edge in pixels where the icon color
 * flips between inactive and active track colors.
 */
export declare const ICON_CROSSOVER_PX: number;
/** Handle classes. */
export declare const HANDLE_CLASSES: {
    readonly handle: "slider-handle";
    readonly start: "slider-start";
    readonly end: "slider-end";
    readonly onTop: "slider-on-top";
    readonly isOverlapping: "slider-is-overlapping";
    readonly focusVisible: string;
    readonly hover: string;
    readonly active: string;
    readonly disabled: string;
};
/** The state provided to the `sliderClasses()` function. */
export interface SliderClassesState {
    /** Emulates `:disabled`. */
    disabled?: boolean;
    /** Whether the slider is in range mode. */
    ranged?: boolean;
    /** Whether the slider is centered. */
    centered?: boolean;
    /** Whether the slider is in vertical orientation. */
    vertical?: boolean;
}
/**
 * Returns the slider classes to apply to an element based on the given state.
 *
 * @param state The state of the slider.
 * @return An object of class names and truthy values if they apply.
 */
export declare function sliderClasses({ disabled, ranged, centered, vertical, }?: SliderClassesState): ClassInfo;
/** The state provided to the `handleClasses()` function. */
export interface HandleClassesState {
    start?: boolean;
    end?: boolean;
    hover?: boolean;
    active?: boolean;
    focusVisible?: boolean;
    disabled?: boolean;
    onTop?: boolean;
    isOverlapping?: boolean;
}
/**
 * Returns the handle classes to apply to a handle element based on the given state.
 *
 * @param state The state of the handle.
 * @return An object of class names and truthy values if they apply.
 */
export declare function handleClasses({ start, end, hover, active, focusVisible, disabled, onTop, isOverlapping, }?: HandleClassesState): ClassInfo;
/** The state provided to the `handleNubClasses()` function. */
export interface HandleNubClassesState {
    focusVisible?: boolean;
}
/**
 * Returns the handle nub classes to apply to a handle nub element.
 *
 * @param state The state of the handle nub.
 * @return An object of class names and truthy values if they apply.
 */
export declare function handleNubClasses({ focusVisible, }?: HandleNubClassesState): ClassInfo;
/** State values passed to `computeSliderProperties()`. */
export interface SliderStateValues {
    min?: number;
    max?: number;
    step?: number | 'any';
    value?: number;
    valueStart?: number;
    valueEnd?: number;
    size?: SliderSize;
    range?: boolean;
    centered?: boolean;
    vertical?: boolean;
    trackLength?: number;
    minSpacing?: number;
}
/** Default handle width in pixels. */
export declare const HANDLE_WIDTH_PX = 4;
/** Default handle half-width in pixels. */
export declare const HANDLE_HALF_WIDTH_PX = 2;
/** Default slider gap in pixels. */
export declare const SLIDER_GAP_PX = 8;
/**
 * Default minimum spacing between stop indicator centers in pixels (2x stop-indicator-size).
 * Ensures stop dots remain visually distinct and do not bleed together.
 */
export declare const DEFAULT_MIN_STOP_SPACING_PX = 8;
/**
 * Pure function that computes the number of stop intervals for a slider,
 * applying legibility, non-integer, and bounds guards.
 *
 * @param min Minimum slider value.
 * @param max Maximum slider value.
 * @param step Step size between stops.
 * @param trackLengthPx Length of track in pixels. If undefined, spacing guard is skipped.
 * @param handleWidthPx Width of handle in pixels (default 4).
 * @param minSpacingPx Minimum distance between stop centers in pixels (default 8).
 * @return The interval count (painted stops = n + 1). Returns 0 if suppressed or invalid.
 */
export declare function computeStopIntervals(min: number, max: number, step?: number | 'any', trackLengthPx?: number, handleWidthPx?: number, minSpacingPx?: number): number;
/**
 * Pure function that computes normalized custom property fractions and flags
 * required by the slider stylesheet.
 *
 * @param values Current state values of the slider.
 * @return A dictionary of `--__*` CSS custom properties and string values.
 */
export declare function computeSliderProperties(values: SliderStateValues): Record<string, string>;
/**
 * Sets up slider functionality for the given root element.
 *
 * @param rootEl The root element on which to set up slider functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupSlider(rootEl: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds slider styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${slider()}">
 *     <input type="range" class="slider-end focus-ring-target" min="0" max="100" value="50">
 *     <div class="slider-track">
 *       <div class="slider-inactive-lead slider-track-box"></div>
 *       <div class="slider-active slider-track-box"></div>
 *       <div class="slider-inactive-trail slider-track-box"></div>
 *       <div class="slider-boundary-stop slider-end"></div>
 *     </div>
 *     <div class="slider-handles">
 *       <div class="slider-handle slider-end"></div>
 *     </div>
 *   </div>
 * `;
 * ```
 */
export declare const slider: (state?: SliderClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/**
 * Formats an automatic value indicator numeric value according to character limit rules:
 * - Reduced fractional digits until the rendered string fits 4 characters.
 * - Integers pass through as-is even if longer than 4 characters.
 * - Examples: 73.625 -> '73.6', 100.5 -> '101', -12.75 -> '-13', 0.25 -> '0.25', 1000 -> '1000', -50 -> '-50'.
 */
export declare function formatValueIndicatorLabel(value?: number): string;
