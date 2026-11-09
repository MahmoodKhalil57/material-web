/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** The visual variant of a tabs container. */
export type TabsVariant = 'primary' | 'secondary';
/** Tabs classes. */
export declare const TABS_CLASSES: {
    readonly density1: `${string}-density-1`;
    readonly density2: `${string}-density-2`;
    readonly density3: `${string}-density-3`;
    readonly tabs: "tabs";
    readonly tabsSecondary: "tabs-secondary";
};
/** The state provided to the `tabsClasses()` function. */
export interface TabsClassesState {
    /** The visual variant of the tabs. Defaults to `'primary'`. */
    variant?: TabsVariant;
    /**
     * The density, 0 (default) to -3. tabs.md: "Don't apply density to tabs
     * by default"; let people opt in to a denser layout.
     */
    density?: number;
}
/**
 * Returns the tabs classes to apply to an element based on the given state.
 *
 * @param state The state of the tabs.
 * @return An object of class names and truthy values if they apply.
 */
export declare function tabsClasses({ variant, density, }?: TabsClassesState): ClassInfo;
/**
 * Sets up tabs functionality for the given element.
 *
 * @param tabsElement The element on which to set up tabs functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupTabs(tabsElement: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds tabs styling to its element.
 *
 * The element is responsible for its own ARIA: add `role="tablist"` and
 * `focusgroup="tablist inline"` when not using `<md-gb-tabs>`.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${tabs()}" role="tablist" focusgroup="tablist inline">
 *     <button class="${tab({selected: true})}" role="tab" aria-selected="true">
 *       <span class="tab-label">Tab 1</span>
 *     </button>
 *     <button class="${tab()}" role="tab" aria-selected="false">
 *       <span class="tab-label">Tab 2</span>
 *     </button>
 *   </div>
 * `;
 * ```
 */
export declare const tabs: (state?: TabsClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/** Tab classes. */
export declare const TAB_CLASSES: {
    readonly tab: "tab";
    readonly tabLabel: "tab-label";
    readonly tabBadge: "tab-badge";
    readonly selected: "selected";
    readonly focusRingInner: string;
    readonly ripple: string;
};
/** The state provided to the `tabClasses()` function. */
export interface TabClassesState {
    /** Whether the tab is selected. */
    selected?: boolean;
}
/**
 * Returns the tab classes to apply to an element based on the given state.
 *
 * `<md-gb-tab>` does not use this function: it emits `:state(selected)`, which
 * the stylesheet matches alongside `.selected` and `[aria-selected="true"]`.
 *
 * @param state The state of the tab.
 * @return An object of class names and truthy values if they apply.
 */
export declare function tabClasses({ selected, }?: TabClassesState): ClassInfo;
/**
 * A Lit directive that adds tab styling to its element.
 *
 * Labels must be marked up with `class="tab-label"` (or `slot="label"` inside
 * `<md-gb-tab>`). Bare text is not a supported authoring form. Icons are
 * unclassed children; the tab sets `--md-icon-*` for them.
 *
 * @example
 * ```ts
 * // Applies class="tab focus-ring-inner ripple [selected]"
 * html`
 *   <button class="${tab({selected})}" role="tab" aria-selected="${selected}">
 *     <md-gb-icon>flight</md-gb-icon>
 *     <span class="tab-label">Flights</span>
 *   </button>
 * `;
 * ```
 */
export declare const tab: (state?: TabClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
