/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
import { type WindowHeightClass, type WindowSizeClass } from '../../styles/layout/window-size-class.js';
/**
 * Which navigation component the app scaffold shows.
 *
 * - `auto`: per the spec's breakpoints: a navigation bar at compact, a
 *   navigation rail at medium (or a bar when the content shows two panes,
 *   unless the window height is compact), a navigation rail at expanded and
 *   larger.
 * - `bar` / `rail`: always that component.
 * - `none`: no navigation.
 */
export type ScaffoldNavigation = 'auto' | 'bar' | 'rail' | 'none';
/** What the navigation rail does while a side sheet is present. */
export type SideSheetNavigation = 'keep' | 'collapse' | 'hide';
/** The navigation component actually shown. */
export type ActiveNavigation = 'bar' | 'rail' | 'none';
/** Input to `resolveNavigation()`. */
export interface ResolveNavigationState {
    navigation: ScaffoldNavigation;
    windowClass: WindowSizeClass;
    /** The window height size class. */
    heightClass?: WindowHeightClass;
    /** Co-planar panes in the content (from a nested pane scaffold). */
    paneCount?: number;
    hasBar?: boolean;
    hasRail?: boolean;
}
/**
 * Picks the navigation component for a window size class (spec:
 * foundations/layout/breakpoints, "Common swappable components" and the
 * medium navigation guidance: single-pane layouts use a navigation rail,
 * two-pane layouts a navigation bar). Falls back to whichever component is
 * provided.
 *
 * Height (spec: breakpoints, "Height breakpoints" adjust the layout "when
 * available vertical space is unusually small"): in a compact-height window
 * (e.g. a phone or foldable in landscape) a medium window keeps the
 * navigation rail for two panes instead of a bar, which would take scarce
 * vertical space.
 */
export declare function resolveNavigation({ navigation, windowClass, heightClass, paneCount, hasBar, hasRail, }: ResolveNavigationState): ActiveNavigation;
/**
 * Whether an automatically expanded navigation rail should be expanded: a
 * collapsed rail at medium and expanded becomes an expanded rail at large and
 * extra-large (spec: breakpoints, "What should be swapped?").
 */
export declare function shouldExpandRail(windowClass: WindowSizeClass): boolean;
/** App scaffold CSS classes. */
export declare const APP_SCAFFOLD_CLASSES: {
    readonly appScaffold: "app-scaffold";
    readonly navBar: "app-scaffold-nav-bar";
    readonly navRail: "app-scaffold-nav-rail";
};
/** State provided to `appScaffoldClasses()`. */
export interface AppScaffoldClassesState {
    navigation?: ActiveNavigation;
}
/** Returns the class map object for the app scaffold. */
export declare function appScaffoldClasses({ navigation, }?: AppScaffoldClassesState): ClassInfo;
/**
 * A Lit directive that adds app scaffold classes to an element.
 */
export declare const appScaffold: (state?: AppScaffoldClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
