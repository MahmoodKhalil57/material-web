/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Toolbar color configuration types. */
export type ToolbarColor = 'standard' | 'vibrant';
/** Toolbar color configurations. */
export declare const TOOLBAR_COLORS: {
    readonly standard: "standard";
    readonly vibrant: "vibrant";
};
/** Toolbar orientation configuration types. */
export type ToolbarOrientation = 'horizontal' | 'vertical';
/** Toolbar orientation configurations. */
export declare const TOOLBAR_ORIENTATIONS: {
    readonly horizontal: "horizontal";
    readonly vertical: "vertical";
};
/** Toolbar classes constants. */
export declare const TOOLBAR_CLASSES: {
    readonly toolbar: "toolbar";
    readonly toolbarStandard: "toolbar-standard";
    readonly toolbarVibrant: "toolbar-vibrant";
    readonly toolbarHorizontal: "toolbar-horizontal";
    readonly toolbarVertical: "toolbar-vertical";
    readonly toolbarDocked: "toolbar-docked";
};
/** The state provided to the `toolbarClasses()` function. */
export interface ToolbarClassesState {
    /** The color scheme of the toolbar. */
    color?: ToolbarColor;
    /** The layout orientation of the toolbar. */
    orientation?: ToolbarOrientation;
    /** Whether the toolbar is docked across the container width. */
    docked?: boolean;
}
/**
 * Returns toolbar classes to apply based on the given state.
 *
 * @param state The state of the toolbar.
 * @return An object of class names and truthy values if they apply.
 */
export declare function toolbarClasses({ color, orientation, docked, }?: ToolbarClassesState): ClassInfo;
/**
 * Lit directive for element class styling.
 *
 * @example
 * ```ts
 * html`<div class="${toolbar({color: 'vibrant'})}">
 *   <button class="icon-btn"><md-gb-icon>undo</md-gb-icon></button>
 * </div>`;
 * ```
 */
export declare const toolbar: (state?: ToolbarClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
