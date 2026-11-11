/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {
  isWindowSizeClassAtLeast,
  type WindowHeightClass,
  type WindowSizeClass,
} from '../../foundations/layout/window-size-class.js';
import {createClassMapDirective} from '../../components/shared/directives.js';

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
export function resolveNavigation({
  navigation,
  windowClass,
  heightClass = 'medium',
  paneCount = 1,
  hasBar = false,
  hasRail = false,
}: ResolveNavigationState): ActiveNavigation {
  if (navigation === 'none') return 'none';
  let preferred: 'bar' | 'rail';
  if (navigation === 'auto') {
    if (windowClass === 'compact') {
      preferred = 'bar';
    } else if (windowClass === 'medium') {
      preferred = paneCount >= 2 && heightClass !== 'compact' ? 'bar' : 'rail';
    } else {
      preferred = 'rail';
    }
  } else {
    preferred = navigation;
  }
  if (preferred === 'bar') {
    return hasBar ? 'bar' : hasRail ? 'rail' : 'none';
  }
  return hasRail ? 'rail' : hasBar ? 'bar' : 'none';
}

/**
 * Whether an automatically expanded navigation rail should be expanded: a
 * collapsed rail at medium and expanded becomes an expanded rail at large and
 * extra-large (spec: breakpoints, "What should be swapped?").
 */
export function shouldExpandRail(windowClass: WindowSizeClass): boolean {
  return isWindowSizeClassAtLeast(windowClass, 'large');
}

/** App scaffold CSS classes. */
export const APP_SCAFFOLD_CLASSES = {
  appScaffold: 'app-scaffold',
  navBar: 'app-scaffold-nav-bar',
  navRail: 'app-scaffold-nav-rail',
} as const;

/** State provided to `appScaffoldClasses()`. */
export interface AppScaffoldClassesState {
  navigation?: ActiveNavigation;
}

/** Returns the class map object for the app scaffold. */
export function appScaffoldClasses({
  navigation = 'none',
}: AppScaffoldClassesState = {}): ClassInfo {
  return {
    [APP_SCAFFOLD_CLASSES.appScaffold]: true,
    [APP_SCAFFOLD_CLASSES.navBar]: navigation === 'bar',
    [APP_SCAFFOLD_CLASSES.navRail]: navigation === 'rail',
  };
}

/**
 * A Lit directive that adds app scaffold classes to an element.
 */
export const appScaffold = createClassMapDirective({
  getClasses: appScaffoldClasses,
});
