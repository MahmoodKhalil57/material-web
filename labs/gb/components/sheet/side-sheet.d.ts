/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Side sheet CSS classes. */
export declare const SIDE_SHEET_CLASSES: {
    /** The token root. Use on the Light DOM sheet element. */
    readonly sideSheet: "side-sheet";
    readonly modal: "side-sheet-modal";
    readonly detached: "side-sheet-detached";
    readonly divider: "side-sheet-divider";
    readonly open: "side-sheet-open";
    readonly closing: "side-sheet-closing";
    /** A modal sheet follows a swipe toward its edge. */
    readonly dragging: "side-sheet-dragging";
    readonly panel: "side-sheet-panel";
    readonly header: "side-sheet-header";
    readonly back: "side-sheet-back";
    readonly headline: "side-sheet-headline";
    readonly close: "side-sheet-close";
    readonly content: "side-sheet-content";
    readonly actions: "side-sheet-actions";
};
/**
 * How far past open (as a fraction of its width) a released swipe must drag a
 * modal side sheet to close it. Compose's anchored-draggable default, as in
 * `ModalNavigationDrawer`.
 */
export declare const SIDE_SHEET_POSITIONAL_THRESHOLD = 0.5;
/**
 * The fling velocity (px/s) toward the edge that closes a modal side sheet
 * however far it was dragged (Compose drawer `DrawerVelocityThreshold`,
 * 400dp/s).
 */
export declare const SIDE_SHEET_VELOCITY_THRESHOLD_PX_PER_S = 400;
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
export declare function sideSheetClasses({ modal, detached, divider, open, closing, root, }?: SideSheetClassesState): ClassInfo;
/**
 * Sets up Light DOM side sheet behavior: Escape on a modal sheet requests a
 * close (a cancelable `close` event with the `escape` reason).
 *
 * @param sheet The side sheet root element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export declare function setupSideSheet(sheet: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/** A Lit directive that adds side sheet classes and setup logic. */
export declare const sideSheet: (state?: SideSheetClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
