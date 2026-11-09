/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Loading indicator classes. */
export declare const LOADING_INDICATOR_CLASSES: {
    readonly loadingIndicator: "loading-indicator";
    readonly loadingIndicatorContained: "loading-indicator-contained";
    readonly loadingIndicatorDeterminate: "loading-indicator-determinate";
    readonly loadingIndicatorSpin: "loading-indicator-spin";
    readonly loadingIndicatorShape: "loading-indicator-shape";
};
/** The state provided to the `loadingIndicatorClasses()` function. */
export interface LoadingIndicatorClassesState {
    /** Whether the indicator has a container. */
    contained?: boolean;
    /**
     * Whether the indicator shows progress. Set progress (0 to 1) with the
     * `--progress` custom property.
     */
    determinate?: boolean;
}
/**
 * Returns the loading indicator classes to apply to an element based on the
 * given state.
 *
 * @param state The state of the loading indicator.
 * @return An object of class names and truthy values if they apply.
 */
export declare function loadingIndicatorClasses({ contained, determinate, }?: LoadingIndicatorClassesState): ClassInfo;
/**
 * Sets up a loading indicator element: adds the animated shape if the
 * element has none, and a `progressbar` role if it has no role.
 *
 * @param element The loading indicator element.
 */
export declare function setupLoadingIndicator(element: HTMLElement): void;
/**
 * A Lit directive that adds loading indicator styling to its element and
 * creates its animated shape.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${loadingIndicator()}" aria-label="Loading"></div>
 *   <div class="${loadingIndicator({contained: true})}" aria-label="Loading">
 *   </div>
 *   <div
 *     class="${loadingIndicator({determinate: true})}"
 *     style="--progress: 0.4"
 *     aria-label="Downloading"
 *     aria-valuenow="40"></div>
 * `;
 * ```
 */
export declare const loadingIndicator: (state?: LoadingIndicatorClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
