/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';
import {setupSheetEscape} from './sheet.js';

/** Side sheet CSS classes. */
export const SIDE_SHEET_CLASSES = {
  /** The token root. Use on the Light DOM sheet element. */
  sideSheet: 'side-sheet',
  modal: 'side-sheet-modal',
  detached: 'side-sheet-detached',
  divider: 'side-sheet-divider',
  open: 'side-sheet-open',
  closing: 'side-sheet-closing',
  /** A modal sheet follows a swipe toward its edge. */
  dragging: 'side-sheet-dragging',
  // Parts.
  panel: 'side-sheet-panel',
  header: 'side-sheet-header',
  back: 'side-sheet-back',
  headline: 'side-sheet-headline',
  close: 'side-sheet-close',
  content: 'side-sheet-content',
  actions: 'side-sheet-actions',
} as const;

/**
 * How far past open (as a fraction of its width) a released swipe must drag a
 * modal side sheet to close it. Compose's anchored-draggable default, as in
 * `ModalNavigationDrawer`.
 */
export const SIDE_SHEET_POSITIONAL_THRESHOLD = 0.5;

/**
 * The fling velocity (px/s) toward the edge that closes a modal side sheet
 * however far it was dragged (Compose drawer `DrawerVelocityThreshold`,
 * 400dp/s).
 */
export const SIDE_SHEET_VELOCITY_THRESHOLD_PX_PER_S = 400;

/** State provided to `sideSheetClasses()`. */
export interface SideSheetClassesState {
  /** Whether the sheet is modal (above a scrim). */
  modal?: boolean;
  /** Whether the sheet floats inset from the window edges. */
  detached?: boolean;
  /** Whether to draw dividers (inline start edge, above actions). */
  divider?: boolean;
  /** Whether the sheet is open (or opening). */
  open?: boolean;
  /** Whether the sheet is animating closed. */
  closing?: boolean;
  /**
   * Whether to add the `.side-sheet` token root class. The element renders
   * its tokens on its host instead, so it passes `false`.
   */
  root?: boolean;
}

/** Returns the class map object for a side sheet. */
export function sideSheetClasses({
  modal = false,
  detached = false,
  divider = false,
  open = false,
  closing = false,
  root = true,
}: SideSheetClassesState = {}): ClassInfo {
  return {
    [SIDE_SHEET_CLASSES.sideSheet]: root,
    [SIDE_SHEET_CLASSES.modal]: modal,
    [SIDE_SHEET_CLASSES.detached]: detached,
    [SIDE_SHEET_CLASSES.divider]: divider,
    [SIDE_SHEET_CLASSES.open]: open,
    [SIDE_SHEET_CLASSES.closing]: closing,
  };
}

/**
 * Sets up Light DOM side sheet behavior: Escape on a modal sheet requests a
 * close (a cancelable `close` event with the `escape` reason).
 *
 * @param sheet The side sheet root element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export function setupSideSheet(
  sheet: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupSheetEscape(
    sheet,
    () => sheet.classList.contains(SIDE_SHEET_CLASSES.modal),
    opts,
  );
}

/** A Lit directive that adds side sheet classes and setup logic. */
export const sideSheet = createClassMapDirective({
  getClasses: sideSheetClasses,
  setupElement: setupSideSheet,
});
