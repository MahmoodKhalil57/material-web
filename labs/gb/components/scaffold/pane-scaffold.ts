/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {type FoldOrientation} from '../../styles/layout/viewport-segments.js';
import {
  DOCKED_PANE_FLOATS_FROM,
  isWindowSizeClassAtLeast,
  PANE_SNAP_SPLIT,
  PANE_SNAP_WIDTHS,
  type WindowSizeClass,
  windowSizeClassValues,
} from '../../styles/layout/window-size-class.js';
import {createClassMapDirective} from '../shared/directives.js';

/**
 * Canonical layouts (spec: foundations/layout/canonical-examples).
 *
 * - `list-detail`: a list pane (`secondary`) and a detail pane (primary).
 *   Single-pane windows show one of them at a time (show and hide).
 * - `supporting-pane`: a focus pane (primary) and a supporting pane
 *   (`secondary`). Single-pane windows stack the supporting pane below the
 *   focus pane (reflow).
 * - `feed`: the primary pane lays its children on a grid whose column count
 *   grows with the window. A `secondary` pane behaves like a supporting pane.
 */
export type PaneScaffoldLayout = 'list-detail' | 'supporting-pane' | 'feed';

/**
 * Two-pane arrangements (spec: foundations/layout/scaffold, panes).
 *
 * - `fixed-flexible`: the secondary pane has a fixed width (360dp at
 *   expanded, 412dp at large and extra-large); the primary pane flexes.
 * - `split`: two flexible panes with the spacer visually centered in the
 *   window, even beside a navigation rail.
 *
 * Two-pane medium windows always split 50/50.
 */
export type PaneArrangement = 'fixed-flexible' | 'split';

/** Where the secondary pane sits in a two-pane layout. */
export type PanePosition = 'start' | 'end';

/** How resizing with the drag handle is kept (spec: pane resizing). */
export type PaneResizeBehavior = 'persistent' | 'temporary';

/**
 * What a tap (or Enter / Space) on the drag handle does. The spec: "The drag
 * handle should also toggle between layout sizes when selected. This can be
 * a tap, double tap, or long press" (foundations/layout/scaffold, Pane
 * expansion & resizing); it is also the single-pointer alternative to
 * dragging (WCAG 2.5.7).
 *
 * - `toggle`: switches between one pane (secondary collapsed) and two.
 * - `cycle`: steps through the snap widths (360px, 412px, split) and then
 *   collapses the secondary pane, so every snap width is reachable without
 *   dragging.
 */
export type PaneHandleTap = 'toggle' | 'cycle';

/**
 * The levitate adaptive strategy for the secondary pane of supporting pane
 * and feed layouts (spec: foundations/layout/scaffold, "Levitate"). In
 * windows too small for two co-planar panes, instead of reflowing below the
 * primary pane, the secondary pane is elevated above it:
 *
 * - `none`: no levitation; the panes reflow (stack).
 * - `floating`: a floating pane above the primary pane, inset from the
 *   window edges, like a non-modal dialog.
 * - `docked`: a pane pinned to the bottom edge, like a bottom sheet, at
 *   compact; it adapts into a floating pane at medium and expanded.
 *
 * Where two panes fit, the pane is co-planar again.
 */
export type PaneLevitate = 'none' | 'floating' | 'docked';

/** How a levitated pane is presented. */
export type LevitatedPresentation = 'floating' | 'docked';

/** A pane of the scaffold. */
export type PaneName = 'primary' | 'secondary' | 'tertiary';

/**
 * How the panes are arranged for the current window size class.
 *
 * - `single`: one pane fills the scaffold.
 * - `two-pane`: co-planar panes side by side.
 * - `stacked`: panes reflow vertically (supporting pane below).
 * - `levitated`: the primary pane fills the scaffold and the secondary
 *   pane floats or docks above it (see `PaneLevitate`).
 */
export type PaneMode = 'single' | 'two-pane' | 'stacked' | 'levitated';

/** Input to `planPanes()`. */
export interface PanePlanState {
  layout: PaneScaffoldLayout;
  windowClass: WindowSizeClass;
  /** Show two panes in medium windows (spec: low-density content only). */
  mediumTwoPane?: boolean;
  hasSecondary?: boolean;
  hasTertiary?: boolean;
  /** List-detail: whether the detail (primary) pane has content to show. */
  detailOpen?: boolean;
  /** A pane collapsed with the drag handle. */
  collapsedPane?: 'primary' | 'secondary' | null;
  /** The levitate strategy for the secondary pane. */
  levitate?: PaneLevitate;
  /** Whether a levitated secondary pane is shown. */
  levitateOpen?: boolean;
  /** The orientation of a fold (hinge) that crosses the scaffold, if any. */
  fold?: FoldOrientation | null;
}

/** Output of `planPanes()`. */
export interface PanePlan {
  mode: PaneMode;
  /** Visible panes, excluding the tertiary pane. */
  visible: Array<'primary' | 'secondary'>;
  /** Whether the tertiary pane is shown. */
  tertiary: boolean;
  /** Co-planar panes visible side by side (a stack counts as one). */
  paneCount: number;
  /** The fold the panes split at, or null. */
  fold: FoldOrientation | null;
  /** How the secondary pane is levitated in `levitated` mode, or null. */
  levitated: LevitatedPresentation | null;
}

/**
 * Decides which panes are visible and how, following the pane totals per
 * window size class (spec: compact 1, medium 1 (or 2), expanded and large 2,
 * extra-large 2 (or 3)).
 *
 * On foldables, panes keep off the fold (spec: the spacer is "the space
 * between two panes on a foldable device"): a vertical fold (book posture,
 * dual screens) always shows two panes split at the fold, one per segment;
 * a horizontal fold (tabletop posture) stacks the supporting pane of
 * supporting pane and feed layouts below the fold. A layout with a single
 * pane can't split and ignores the fold.
 */
export function planPanes({
  layout,
  windowClass,
  mediumTwoPane = false,
  hasSecondary = false,
  hasTertiary = false,
  detailOpen = false,
  collapsedPane = null,
  levitate = 'none',
  levitateOpen = false,
  fold = null,
}: PanePlanState): PanePlan {
  const {panesRecommended, panesMax} = windowSizeClassValues(windowClass);
  const twoPane =
    panesMax >= 2 &&
    (panesRecommended >= 2 || (windowClass === 'medium' && mediumTwoPane));
  // A standard side sheet can be a third pane at extra-large only.
  const tertiary = hasTertiary && panesMax >= 3;

  const none: Pick<PanePlan, 'fold' | 'levitated'> = {
    fold: null,
    levitated: null,
  };

  if (!hasSecondary) {
    return {
      mode: 'single',
      visible: ['primary'],
      tertiary,
      paneCount: tertiary ? 2 : 1,
      ...none,
    };
  }

  if (fold === 'vertical') {
    // One pane per segment; collapsing a pane would put the other on the
    // fold, and a third pane would not fit a segment.
    return {
      mode: 'two-pane',
      visible: ['secondary', 'primary'],
      tertiary: false,
      paneCount: 2,
      fold,
      levitated: null,
    };
  }

  if (fold === 'horizontal' && layout !== 'list-detail') {
    return {
      mode: 'stacked',
      visible: ['primary', 'secondary'],
      tertiary: false,
      paneCount: 1,
      fold,
      levitated: null,
    };
  }

  if (twoPane) {
    const visible: PanePlan['visible'] =
      collapsedPane === 'secondary'
        ? ['primary']
        : collapsedPane === 'primary'
          ? ['secondary']
          : ['secondary', 'primary'];
    return {
      mode: 'two-pane',
      visible,
      tertiary,
      paneCount: visible.length + (tertiary ? 1 : 0),
      ...none,
    };
  }

  if (layout === 'list-detail') {
    // Only one view is visible at a time, either list or detail.
    return {
      mode: 'single',
      visible: [detailOpen ? 'primary' : 'secondary'],
      tertiary: false,
      paneCount: 1,
      ...none,
    };
  }

  if (levitate !== 'none') {
    // A docked pane adapts into a floating pane at medium and expanded.
    const docked =
      levitate === 'docked' &&
      !isWindowSizeClassAtLeast(
        windowClass,
        DOCKED_PANE_FLOATS_FROM as WindowSizeClass,
      );
    return {
      mode: 'levitated',
      visible: levitateOpen ? ['primary', 'secondary'] : ['primary'],
      tertiary: false,
      paneCount: 1,
      fold: null,
      levitated: docked ? 'docked' : 'floating',
    };
  }

  // Supporting pane and feed: the supporting pane appears below.
  return {
    mode: 'stacked',
    visible: ['primary', 'secondary'],
    tertiary: false,
    paneCount: 1,
    ...none,
  };
}

/**
 * Returns the widths the secondary pane snaps to when the drag handle is
 * released, smallest first: 0 (collapsed), the spec's custom widths (360dp,
 * 412dp) and the centered split at expanded and larger, or 50% at medium,
 * and `available` (the other pane collapsed).
 *
 * @param windowClass The current window size class.
 * @param available The width shared by the two panes (without the spacer).
 * @param splitWidth The secondary width that visually centers the spacer.
 */
export function paneSnapTargets(
  windowClass: WindowSizeClass,
  available: number,
  splitWidth = available / 2,
): number[] {
  const targets = new Set<number>([0, Math.round(available)]);
  if (isWindowSizeClassAtLeast(windowClass, 'expanded')) {
    for (const width of PANE_SNAP_WIDTHS) {
      if (width < available) targets.add(width);
    }
    if (PANE_SNAP_SPLIT) targets.add(Math.round(splitWidth));
  } else {
    targets.add(Math.round(splitWidth));
  }
  return [...targets]
    .filter((width) => width >= 0 && width <= available)
    .sort((a, b) => a - b);
}

/**
 * Returns the secondary width a `cycle` tap on the drag handle moves to: the
 * next snap width wider than `current`, then 0 (secondary collapsed), then the
 * narrowest snap width again.
 *
 * @param current The current secondary width (0 when collapsed, `available`
 *     when the primary pane is collapsed).
 * @param targets The snap targets (`paneSnapTargets`).
 * @param available The width of both panes.
 * @return The next secondary width.
 */
export function nextPaneSnapTarget(
  current: number,
  targets: number[],
  available: number,
): number {
  const widths = targets.filter((t) => t > 0 && t < available);
  if (!widths.length) return current > 0 ? 0 : available;
  if (current <= 0 || current >= available) return widths[0];
  return widths.find((t) => t > current + 1) ?? 0;
}

/** Returns the target closest to `width`. */
export function nearestSnapTarget(width: number, targets: number[]): number {
  let best = targets[0] ?? 0;
  for (const target of targets) {
    if (Math.abs(target - width) < Math.abs(best - width)) best = target;
  }
  return best;
}

/** Pane scaffold CSS classes. */
export const PANE_SCAFFOLD_CLASSES = {
  paneScaffold: 'pane-scaffold',
  single: 'pane-scaffold-single',
  twoPane: 'pane-scaffold-two-pane',
  stacked: 'pane-scaffold-stacked',
  split: 'pane-scaffold-split',
  secondaryEnd: 'pane-scaffold-secondary-end',
  tertiary: 'pane-scaffold-tertiary',
  feed: 'pane-scaffold-feed',
  dragging: 'pane-scaffold-dragging',
  levitated: 'pane-scaffold-levitated',
  floating: 'pane-scaffold-floating',
  docked: 'pane-scaffold-docked',
  foldVertical: 'pane-scaffold-fold-vertical',
  foldHorizontal: 'pane-scaffold-fold-horizontal',
} as const;

/** State provided to `paneScaffoldClasses()`. */
export interface PaneScaffoldClassesState {
  mode?: PaneMode;
  layout?: PaneScaffoldLayout;
  split?: boolean;
  secondaryPosition?: PanePosition;
  tertiary?: boolean;
  dragging?: boolean;
  /** How the secondary pane is levitated, in `levitated` mode. */
  levitated?: LevitatedPresentation | null;
  /** The fold the panes split at. */
  fold?: FoldOrientation | null;
}

/** Returns the class map object for the pane scaffold. */
export function paneScaffoldClasses({
  mode = 'single',
  layout = 'list-detail',
  split = false,
  secondaryPosition = 'start',
  tertiary = false,
  dragging = false,
  levitated = null,
  fold = null,
}: PaneScaffoldClassesState = {}): ClassInfo {
  return {
    [PANE_SCAFFOLD_CLASSES.paneScaffold]: true,
    [PANE_SCAFFOLD_CLASSES.single]: mode === 'single',
    [PANE_SCAFFOLD_CLASSES.twoPane]: mode === 'two-pane',
    [PANE_SCAFFOLD_CLASSES.stacked]: mode === 'stacked',
    [PANE_SCAFFOLD_CLASSES.split]: split && mode === 'two-pane',
    [PANE_SCAFFOLD_CLASSES.secondaryEnd]: secondaryPosition === 'end',
    [PANE_SCAFFOLD_CLASSES.tertiary]: tertiary,
    [PANE_SCAFFOLD_CLASSES.feed]: layout === 'feed',
    [PANE_SCAFFOLD_CLASSES.dragging]: dragging,
    [PANE_SCAFFOLD_CLASSES.levitated]: mode === 'levitated',
    [PANE_SCAFFOLD_CLASSES.floating]:
      mode === 'levitated' && levitated === 'floating',
    [PANE_SCAFFOLD_CLASSES.docked]:
      mode === 'levitated' && levitated === 'docked',
    [PANE_SCAFFOLD_CLASSES.foldVertical]: fold === 'vertical',
    [PANE_SCAFFOLD_CLASSES.foldHorizontal]: fold === 'horizontal',
  };
}

/**
 * A Lit directive that adds pane scaffold classes to an element.
 */
export const paneScaffold = createClassMapDirective({
  getClasses: paneScaffoldClasses,
});
