/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** App Bar size configuration types. */
export type AppBarSize = 'sm' | 'md' | 'lg';
/** App Bar size configurations. */
export declare const APP_BAR_SIZES: {
    readonly sm: "sm";
    readonly md: "md";
    readonly lg: "lg";
};
/** App Bar variant configuration types. */
export type AppBarVariant = 'standard' | 'search';
/** App Bar variant configurations. */
export declare const APP_BAR_VARIANTS: {
    readonly standard: "standard";
    readonly search: "search";
};
/** App Bar classes. */
export declare const APP_BAR_CLASSES: {
    readonly appBar: "app-bar";
    readonly appBarSm: "app-bar-sm";
    readonly appBarMd: "app-bar-md";
    readonly appBarLg: "app-bar-lg";
    readonly appBarWithSubtitle: "app-bar-with-subtitle";
    readonly appBarSearch: "app-bar-search";
    readonly appBarScrolled: "app-bar-scrolled";
    readonly appBarCentered: "app-bar-centered";
    readonly appBarHasLeading: "app-bar-has-leading";
};
/** The state provided to the `appBarClasses()` function. */
export interface AppBarClassesState {
    /** The size of the app bar (`sm`, `md`, `lg`). */
    size?: AppBarSize;
    /** Whether the app bar has a subtitle. */
    withSubtitle?: boolean;
    /** The behavior variant (`standard` or `search`). */
    variant?: AppBarVariant;
    /** Whether the app bar is in a scrolled or docked state (`.app-bar-scrolled`). */
    scrolled?: boolean;
    /** Whether the title and subtitle are centered (`.app-bar-centered`). */
    centered?: boolean;
    /**
     * Whether the app bar has a leading element (`.app-bar-has-leading`).
     * Without one, the small app bar title starts at the title inset.
     */
    hasLeading?: boolean;
}
/**
 * Returns the app bar classes to apply to an element based on the given state.
 *
 * @param state The state of the app bar.
 * @return An object of class names and truthy values if they apply.
 */
export declare function appBarClasses({ size, withSubtitle, variant, scrolled, centered, hasLeading, }?: AppBarClassesState): ClassInfo;
/**
 * Sets up optional scroll target tracking for the given app bar element when an explicit `scrollTarget` is provided.
 *
 * @param appBar The element on which to set up app bar functionality.
 * @param opts Setup options, containing an explicit `scrollTarget` and optional cleanup `signal`.
 */
export declare function setupAppBar(appBar: HTMLElement, opts?: {
    signal?: AbortSignal;
    scrollTarget?: HTMLElement | Window;
}): void;
/**
 * A Lit directive that adds app bar styling and optional scroll tracking functionality to its element.
 *
 * @example
 * ```ts
 * html`<div class="${appBar({size: 'md', scrolled: true})}">
 *   <div class="app-bar-top-row">...</div>
 *   <div class="app-bar-bottom-row">...</div>
 * </div>`;
 * ```
 */
export declare const appBar: (state?: AppBarClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
