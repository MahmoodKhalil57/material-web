/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {focusRingClasses} from '../../foundations/interaction/states/focus/focus-ring.js';
import {rippleClasses, setupRipple} from '../../foundations/interaction/states/ripple/ripple.js';
import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES} from '../../foundations/interaction/states/pseudo-classes.js';

/** Fab color configuration types. */
export type FabColor =
  | 'primary'
  | 'primary-container'
  | 'secondary'
  | 'secondary-container'
  | 'tertiary'
  | 'tertiary-container';

/** Fab size configuration types. */
export type FabSize = 'sm' | 'default' | 'md' | 'lg';

/** Fab color configurations. */
export const FAB_COLORS = {
  primary: 'primary',
  primaryContainer: 'primary-container',
  secondary: 'secondary',
  secondaryContainer: 'secondary-container',
  tertiary: 'tertiary',
  tertiaryContainer: 'tertiary-container',
} as const;

/** Fab size configurations. */
export const FAB_SIZES = {
  sm: 'sm',
  default: 'default',
  md: 'md',
  lg: 'lg',
} as const;

/** Fab classes. */
export const FAB_CLASSES = {
  fab: 'fab',
  fabPrimary: 'fab-primary',
  fabPrimaryContainer: 'fab-primary-container',
  fabSecondary: 'fab-secondary',
  fabSecondaryContainer: 'fab-secondary-container',
  fabTertiary: 'fab-tertiary',
  fabTertiaryContainer: 'fab-tertiary-container',
  fabSm: 'fab-sm',
  fabMd: 'fab-md',
  fabLg: 'fab-lg',
  fabCollapsed: 'fab-collapsed',
  fabLabel: 'fab-label',
  hover: PSEUDO_CLASSES.hover,
  active: PSEUDO_CLASSES.active,
} as const;

/** The state provided to the `fabClasses()` function. */
export interface FabClassesState {
  /** The color of the fab. */
  color?: FabColor;
  /**
   * The size of the fab. With a label, `default`, `md` and `lg` are the
   * small, medium and large extended FABs. `sm` is the small (40dp) FAB,
   * icon-only; the spec no longer recommends it.
   */
  size?: FabSize;
  /**
   * Whether an extended FAB shows its label (Compose `expanded`). `false`
   * collapses the `.fab-label` so the FAB becomes an icon-only FAB.
   * Defaults to `true`.
   */
  expanded?: boolean;
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
}

/**
 * Returns the fab classes to apply to an element based on the given state.
 *
 * @param state The state of the fab.
 * @return An object of class names and truthy values if they apply.
 */
export function fabClasses({
  color,
  size,
  expanded = true,
  hover = false,
  active = false,
}: FabClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [FAB_CLASSES.fab]: true,
    [FAB_CLASSES.fabPrimary]: color === FAB_COLORS.primary,
    [FAB_CLASSES.fabPrimaryContainer]:
      color === FAB_COLORS.primaryContainer || !color,
    [FAB_CLASSES.fabSecondary]: color === FAB_COLORS.secondary,
    [FAB_CLASSES.fabSecondaryContainer]:
      color === FAB_COLORS.secondaryContainer,
    [FAB_CLASSES.fabTertiary]: color === FAB_COLORS.tertiary,
    [FAB_CLASSES.fabTertiaryContainer]: color === FAB_COLORS.tertiaryContainer,
    [FAB_CLASSES.fabSm]: size === FAB_SIZES.sm,
    [FAB_CLASSES.fabMd]: size === FAB_SIZES.md,
    [FAB_CLASSES.fabLg]: size === FAB_SIZES.lg,
    [FAB_CLASSES.fabCollapsed]: !expanded,
    [FAB_CLASSES.hover]: hover,
    [FAB_CLASSES.active]: active,
  };
}

/**
 * Sets up fab functionality for the given element.
 *
 * @param fab The element on which to set up fab functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupFab(
  fab: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupRipple(fab, opts);
}

/**
 * A Lit directive that adds fab styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`
 *   <button class="${fab()}">
 *     <md-icon>add</md-icon>
 *   </button>
 *
 *   <button class="${fab({expanded})}">
 *     <md-icon>add</md-icon>
 *     <span class="fab-label">Extended</span>
 *   </button>
 * `;
 * ```
 */
export const fab = createClassMapDirective({
  getClasses: fabClasses,
  setupElement: setupFab,
});

/** Options for `setupCollapseOnScroll()`. */
export interface CollapseOnScrollOptions {
  /** Removes the scroll listener when aborted. */
  signal?: AbortSignal;
  /**
   * The distance in pixels to scroll in one direction before the FAB changes
   * state, so small scroll jitter does not toggle it. Defaults to `8`.
   */
  threshold?: number;
}

/**
 * Collapses an extended FAB while `target` scrolls down and expands it while
 * it scrolls up or reaches the top (M3 extended FAB, Motion: "The extended FAB
 * can transform into a FAB when scrolling down, and back to an extended FAB
 * when scrolling up").
 *
 * @example
 * ```ts
 * setupCollapseOnScroll(list, (expanded) => {
 *   fabEl.expanded = expanded;
 * });
 * ```
 *
 * @param target The scroll container, or `window` for the document.
 * @param onExpandedChange Called with the new expanded state when it changes.
 * @param opts Options, including a cleanup `signal`.
 */
export function setupCollapseOnScroll(
  target: Element | Window,
  onExpandedChange: (expanded: boolean) => void,
  {signal, threshold = 8}: CollapseOnScrollOptions = {},
): void {
  const scrollTop = () =>
    target instanceof Element
      ? target.scrollTop
      : (target.document.scrollingElement?.scrollTop ?? target.scrollY);
  let expanded = true;
  // Scroll position where the current scroll direction started.
  let anchor = scrollTop();
  let last = anchor;
  target.addEventListener(
    'scroll',
    () => {
      const top = scrollTop();
      if ((top - last) * (last - anchor) < 0) {
        anchor = last; // Direction changed.
      }
      last = top;
      let next = expanded;
      if (top <= 0) {
        next = true;
      } else if (top - anchor > threshold) {
        next = false;
      } else if (anchor - top > threshold) {
        next = true;
      }
      if (next !== expanded) {
        expanded = next;
        onExpandedChange(expanded);
      }
    },
    {passive: true, signal},
  );
}
