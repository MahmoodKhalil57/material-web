/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** M3 window size classes (breakpoints), smallest first. */
export declare const WINDOW_SIZE_CLASSES: readonly ["compact", "medium", "expanded", "large", "extra-large"];
/** An M3 window size class (breakpoint). */
export type WindowSizeClass = (typeof WINDOW_SIZE_CLASSES)[number];
/** Layout values for one window size class. */
export interface WindowSizeClassValues {
    /** Smallest width in the class (inclusive). */
    readonly minWidth: number;
    /** Width where the next class starts (exclusive), or null for the last. */
    readonly maxWidth: number | null;
    /** Leading and trailing window margin. */
    readonly margin: number;
    /** Space between panes. */
    readonly spacer: number;
    /** Default fixed pane width in a fixed-and-flexible layout. */
    readonly fixedPaneWidth: number;
    /** Layout grid columns. */
    readonly columns: number;
    /** Recommended number of visible panes. */
    readonly panesRecommended: number;
    /** Maximum number of visible panes. */
    readonly panesMax: number;
}
/** Layout values per window size class. */
export declare const WINDOW_SIZE_CLASS_VALUES: Readonly<Record<WindowSizeClass, WindowSizeClassValues>>;
/** Maximum width of a standard side sheet used as the third pane. */
export declare const THIRD_PANE_MAX_WIDTH = 400;
/** Recommended drag handle snap widths (expanded and larger). */
export declare const PANE_SNAP_WIDTHS: readonly number[];
/** Whether panes also snap to a split with the spacer visually centered. */
export declare const PANE_SNAP_SPLIT = true;
/**
 * M3 window height size classes, smallest first (spec: breakpoints, "Height
 * breakpoints"; ranges from the Android window size classes it links to).
 */
export declare const WINDOW_HEIGHT_CLASSES: readonly ["compact", "medium", "expanded"];
/** An M3 window height size class. */
export type WindowHeightClass = (typeof WINDOW_HEIGHT_CLASSES)[number];
/** Height range of one window height size class. */
export interface WindowHeightClassValues {
    /** Smallest height in the class (inclusive). */
    readonly minHeight: number;
    /** Height where the next class starts (exclusive), or null for the last. */
    readonly maxHeight: number | null;
}
/** Height ranges per window height size class. */
export declare const WINDOW_HEIGHT_CLASS_VALUES: Readonly<Record<WindowHeightClass, WindowHeightClassValues>>;
/** The window edge a docked pane is pinned to (spec: scaffold, levitate). */
export declare const DOCKED_PANE_EDGE = "bottom";
/**
 * The smallest window size class where a docked pane adapts into a floating
 * pane (spec: "At medium and expanded breakpoints, docked panes can
 * adapt into floating panes").
 */
export declare const DOCKED_PANE_FLOATS_FROM = "medium";
