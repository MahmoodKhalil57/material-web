/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Progress indicator classes. */
export declare const PROGRESS_CLASSES: {
    readonly progress: "progress";
    readonly progressCircular: "progress-circular";
    readonly progressWavy: "progress-wavy";
    readonly progressDeterminate: "progress-determinate";
    readonly progressContainer: "progress-container";
    readonly progressTrack: "progress-track";
    readonly progressStop: "progress-stop";
    readonly progressWave: "progress-wave";
    readonly progressRing: "progress-ring";
    readonly progressRingTrack: "progress-ring-track";
    readonly progressActive: "progress-active";
};
/** The state provided to the `progressClasses()` function. */
export interface ProgressClassesState {
    /** Whether the indicator is circular instead of linear. */
    circular?: boolean;
    /** Whether the active indicator is wavy instead of flat (the default). */
    wavy?: boolean;
    /**
     * Whether the indicator shows progress. Set progress (0 to 1) with the
     * `--progress` custom property.
     */
    determinate?: boolean;
}
/**
 * Returns the progress indicator classes to apply to an element based on the
 * given state.
 *
 * @param state The state of the progress indicator.
 * @return An object of class names and truthy values if they apply.
 */
export declare function progressClasses({ circular, wavy, determinate, }?: ProgressClassesState): ClassInfo;
/**
 * Registers the custom properties the progress indicator animates.
 *
 * The styles also declare them with `@property`, but `@property` rules do not
 * apply in shadow roots.
 */
export declare function registerProgressProperties(): void;
/**
 * Creates the parts of a progress indicator: track segments, a stop
 * indicator and the active indicator(s), for both linear and circular
 * indicators so the shape can change later.
 */
export declare function createProgressContainer(): HTMLElement;
/**
 * Sets up a progress indicator element: adds its parts if the element has
 * none, and a `progressbar` role if it has no role.
 *
 * @param element The progress indicator element.
 */
export declare function setupProgress(element: HTMLElement): void;
/**
 * A Lit directive that adds progress indicator styling to its element and
 * creates its parts.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${progress()}" aria-label="Loading"></div>
 *   <div class="${progress({circular: true})}" aria-label="Loading"></div>
 *   <div
 *     class="${progress({determinate: true})}"
 *     style="--progress: 0.4"
 *     aria-label="Downloading"
 *     aria-valuemin="0"
 *     aria-valuemax="100"
 *     aria-valuenow="40"></div>
 * `;
 * ```
 */
export declare const progress: (state?: ProgressClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
