/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Divider classes. */
export declare const DIVIDER_CLASSES: {
    readonly divider: "divider";
    readonly dividerVertical: "divider-vertical";
    readonly dividerInset: "divider-inset";
    readonly dividerInsetStart: "divider-inset-start";
    readonly dividerInsetEnd: "divider-inset-end";
};
/** The state provided to the `dividerClasses()` function. */
export interface DividerClassesState {
    /** Whether the divider is vertical. */
    vertical?: boolean;
    /** Indents both ends (spec: middle-inset divider). */
    inset?: boolean;
    /** Indents the leading end (spec: inset divider). */
    insetStart?: boolean;
    /** Indents the trailing end. */
    insetEnd?: boolean;
}
/**
 * Returns the divider classes to apply to an element based on the given state.
 *
 * @param state The state of the divider.
 * @return An object of class names and truthy values if they apply.
 */
export declare function dividerClasses({ vertical, inset, insetStart, insetEnd, }?: DividerClassesState): ClassInfo;
/**
 * A Lit directive that adds divider styling to its element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="flex flex-col">
 *     <div>Vertical</div>
 *     <hr class="${divider()}">
 *     <div>Items</div>
 *   </div>
 *
 *   <div class="flex flex-row">
 *     <div>Horizontal</div>
 *     <hr class="${divider({vertical: true})}">
 *     <div>Items</div>
 *   </div>
 * `;
 * ```
 */
export declare const divider: (state?: DividerClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
