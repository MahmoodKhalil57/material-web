/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/**
 * Reasons for closing a search view, passed in the `close` and `closed`
 * event details.
 */
export declare const SEARCH_CLOSE_REASONS: {
    /** `close()` was called without a reason, or `open` was set to false. */
    readonly DISMISS: "dismiss";
    /** Escape was pressed in the view. */
    readonly ESCAPE: "escape";
    /** The Android back gesture or button (predictive back), or `handleBack()`. */
    readonly BACK: "back";
    /** The view's back icon button was activated. */
    readonly BACK_BUTTON: "back-button";
    /** The scrim of a docked view was clicked. */
    readonly SCRIM: "scrim";
};
/** Search view close reason type. */
export type SearchCloseReason = (typeof SEARCH_CLOSE_REASONS)[keyof typeof SEARCH_CLOSE_REASONS] | string;
/**
 * Search bar CSS classes.
 */
export declare const SEARCH_BAR_CLASSES: {
    readonly searchBar: "search-bar";
    readonly expanded: "search-bar-expanded";
    readonly disabled: "search-bar-disabled";
    readonly leading: "search-bar-leading";
    readonly input: "search-bar-input";
    readonly trailing: "search-bar-trailing";
};
/**
 * Search view CSS classes.
 *
 * `search-view` is the token root: it declares the search view tokens, like
 * `md-gb-search-view`'s host. The `<dialog>` inside the element omits it so
 * that token values set on the host still apply.
 */
export declare const SEARCH_VIEW_CLASSES: {
    readonly searchView: "search-view";
    readonly dialog: "search-view-dialog";
    readonly open: "search-view-open";
    readonly opening: "search-view-opening";
    readonly closing: "search-view-closing";
    readonly docked: "search-view-docked";
    readonly divided: "search-view-divided";
    readonly anchored: "search-view-anchored";
    readonly container: "search-view-container";
    readonly header: "search-view-header";
    readonly input: "search-view-input";
    readonly divider: "search-view-divider";
    readonly results: "search-view-results";
};
/**
 * State provided to `searchBarClasses()`.
 */
export interface SearchBarClassesState {
    /** Whether the bar's search view is open. */
    expanded?: boolean;
    /** Whether the bar is disabled. */
    disabled?: boolean;
}
/**
 * Returns the class map object for a search bar based on the given state.
 */
export declare function searchBarClasses({ expanded, disabled, }?: SearchBarClassesState): ClassInfo;
/**
 * State provided to `searchViewClasses()`.
 */
export interface SearchViewClassesState {
    /**
     * Whether the element declares the search view tokens. Defaults to true;
     * `md-gb-search-view` passes false for its inner `<dialog>`, since its host
     * declares them.
     */
    tokens?: boolean;
    open?: boolean;
    opening?: boolean;
    closing?: boolean;
    /** Docked layout: a drop-down below the search bar. Else full-screen. */
    docked?: boolean;
    /** Divided (baseline) style. Else contained (M3 Expressive). */
    divided?: boolean;
    /** Whether the view is positioned over a search bar. */
    anchored?: boolean;
}
/**
 * Returns the class map object for a search view `<dialog>` based on the
 * given state.
 */
export declare function searchViewClasses({ tokens, open, opening, closing, docked, divided, anchored, }?: SearchViewClassesState): ClassInfo;
/**
 * The enabled `[role=option]` elements of a search view's results container,
 * including elements assigned to a `<slot>` inside it.
 */
export declare function getResultOptions(results: Element): HTMLElement[];
/**
 * Sets up search view keyboard behavior on a `<dialog>` element: Escape
 * closes the view, and the arrow keys move focus between the input and the
 * `[role=option]` results.
 *
 * Closing calls the dialog's `close()`; `md-gb-search-view` handles these
 * keys itself so that it can animate closed.
 *
 * @param view The search view `<dialog>` element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export declare function setupSearchView(view: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * Moves focus between a search input and its result options for an arrow,
 * Home or End key. Returns true when the key was handled.
 */
export declare function moveResultFocus(event: KeyboardEvent, input: HTMLElement, options: HTMLElement[]): boolean;
/**
 * A Lit directive that adds search bar classes to an element.
 */
export declare const searchBar: (state?: SearchBarClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/**
 * A Lit directive that adds search view classes and keyboard behavior to a
 * `<dialog>` element.
 */
export declare const searchView: (state?: SearchViewClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
