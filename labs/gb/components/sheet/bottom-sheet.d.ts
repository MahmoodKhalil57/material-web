/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** The heights a bottom sheet rests at while open. */
export declare const BOTTOM_SHEET_STATES: {
    /** The full height of the content, up to the window top margin. */
    readonly expanded: "expanded";
    /**
     * The peek height of a standard sheet, or at most half the window height
     * for a modal sheet.
     */
    readonly partiallyExpanded: "partially-expanded";
};
/** A bottom sheet resting height. */
export type BottomSheetState = (typeof BOTTOM_SHEET_STATES)[keyof typeof BOTTOM_SHEET_STATES];
/** Bottom sheet CSS classes. */
export declare const BOTTOM_SHEET_CLASSES: {
    /** The token root. Use on the Light DOM sheet element. */
    readonly bottomSheet: "bottom-sheet";
    readonly modal: "bottom-sheet-modal";
    readonly open: "bottom-sheet-open";
    readonly closing: "bottom-sheet-closing";
    readonly expanded: "bottom-sheet-expanded";
    readonly partiallyExpanded: "bottom-sheet-partially-expanded";
    readonly dragging: "bottom-sheet-dragging";
    readonly panel: "bottom-sheet-panel";
    readonly dragArea: "bottom-sheet-drag-area";
    readonly dragHandle: "bottom-sheet-drag-handle";
    readonly content: "bottom-sheet-content";
};
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
export declare function bottomSheetClasses({ modal, open, closing, state, dragging, root, }?: BottomSheetClassesState): ClassInfo;
/**
 * Sets up Light DOM bottom sheet behavior: Escape on a modal sheet requests a
 * close (a cancelable `close` event with the `escape` reason).
 *
 * @param sheet The bottom sheet root element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export declare function setupBottomSheet(sheet: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/** A Lit directive that adds bottom sheet classes and setup logic. */
export declare const bottomSheet: (state?: BottomSheetClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
