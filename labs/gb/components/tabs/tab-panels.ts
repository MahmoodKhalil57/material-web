/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** Tab panels classes, applied to the `<md-gb-tab-panels>` host. */
export const TAB_PANELS_CLASSES = {
  tabPanels: 'tab-panels',
  /** A swipe is in progress: the panels follow the pointer, no transition. */
  dragging: 'tab-panels-dragging',
  /** Panels are being placed at their start positions, no transition. */
  instant: 'tab-panels-instant',
} as const;

/**
 * The fraction of the panel width a released swipe must travel to settle at
 * the next panel (Compose foundation `PagerDefaults.flingBehavior`,
 * `snapPositionalThreshold = 0.5f`).
 */
export const TAB_PANELS_POSITIONAL_THRESHOLD = 0.5;

/**
 * The release velocity (px/s) above which a swipe settles at the next panel
 * in its direction however short it was (Compose foundation pager,
 * `MinFlingVelocityDp = 400.dp`).
 */
export const TAB_PANELS_VELOCITY_THRESHOLD_PX_PER_S = 400;

/**
 * The custom property holding a panel's offset from the visible slot, in
 * panel widths along the reading direction (0 is shown, 1 is the next slot,
 * -1 the previous one). Set on each slotted panel.
 */
export const TAB_PANEL_OFFSET_PROPERTY = '--_tab-panel-offset';
