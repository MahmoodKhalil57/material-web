/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';
import {setupSheetEscape} from './sheet.js';

/** The heights a bottom sheet rests at while open. */
export const BOTTOM_SHEET_STATES = {
  /** The full height of the content, up to the window top margin. */
  expanded: 'expanded',
  /**
   * The peek height of a standard sheet, or at most half the window height
   * for a modal sheet.
   */
  partiallyExpanded: 'partially-expanded',
} as const;

/** A bottom sheet resting height. */
export type BottomSheetState =
  (typeof BOTTOM_SHEET_STATES)[keyof typeof BOTTOM_SHEET_STATES];

/** Bottom sheet CSS classes. */
export const BOTTOM_SHEET_CLASSES = {
  /** The token root. Use on the Light DOM sheet element. */
  bottomSheet: 'bottom-sheet',
  modal: 'bottom-sheet-modal',
  open: 'bottom-sheet-open',
  closing: 'bottom-sheet-closing',
  expanded: 'bottom-sheet-expanded',
  partiallyExpanded: 'bottom-sheet-partially-expanded',
  dragging: 'bottom-sheet-dragging',
  // Parts.
  panel: 'bottom-sheet-panel',
  dragArea: 'bottom-sheet-drag-area',
  dragHandle: 'bottom-sheet-drag-handle',
  content: 'bottom-sheet-content',
} as const;

/** State provided to `bottomSheetClasses()`. */
export interface BottomSheetClassesState {
  /** Whether the sheet is modal (above a scrim). */
  modal?: boolean;
  /** Whether the sheet is open (or opening). */
  open?: boolean;
  /** Whether the sheet is animating closed. */
  closing?: boolean;
  /** The resting height. */
  state?: BottomSheetState;
  /** Whether the sheet follows a pointer drag. */
  dragging?: boolean;
  /**
   * Whether to add the `.bottom-sheet` token root class. The element renders
   * its tokens on its host instead, so it passes `false`.
   */
  root?: boolean;
}

/** Returns the class map object for a bottom sheet. */
export function bottomSheetClasses({
  modal = false,
  open = false,
  closing = false,
  state = BOTTOM_SHEET_STATES.partiallyExpanded,
  dragging = false,
  root = true,
}: BottomSheetClassesState = {}): ClassInfo {
  return {
    [BOTTOM_SHEET_CLASSES.bottomSheet]: root,
    [BOTTOM_SHEET_CLASSES.modal]: modal,
    [BOTTOM_SHEET_CLASSES.open]: open,
    [BOTTOM_SHEET_CLASSES.closing]: closing,
    [BOTTOM_SHEET_CLASSES.expanded]: state === BOTTOM_SHEET_STATES.expanded,
    [BOTTOM_SHEET_CLASSES.partiallyExpanded]:
      state === BOTTOM_SHEET_STATES.partiallyExpanded,
    [BOTTOM_SHEET_CLASSES.dragging]: dragging,
  };
}

/**
 * Sets up Light DOM bottom sheet behavior: Escape on a modal sheet requests a
 * close (a cancelable `close` event with the `escape` reason).
 *
 * @param sheet The bottom sheet root element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export function setupBottomSheet(
  sheet: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupSheetEscape(
    sheet,
    () => sheet.classList.contains(BOTTOM_SHEET_CLASSES.modal),
    opts,
  );
}

/** A Lit directive that adds bottom sheet classes and setup logic. */
export const bottomSheet = createClassMapDirective({
  getClasses: bottomSheetClasses,
  setupElement: setupBottomSheet,
});
