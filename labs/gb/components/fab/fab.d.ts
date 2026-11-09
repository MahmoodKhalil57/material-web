/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Fab color configuration types. */
export type FabColor = 'primary' | 'primary-container' | 'secondary' | 'secondary-container' | 'tertiary' | 'tertiary-container';
/** Fab size configuration types. */
export type FabSize = 'sm' | 'default' | 'md' | 'lg';
/** Fab color configurations. */
export declare const FAB_COLORS: {
    readonly primary: "primary";
    readonly primaryContainer: "primary-container";
    readonly secondary: "secondary";
    readonly secondaryContainer: "secondary-container";
    readonly tertiary: "tertiary";
    readonly tertiaryContainer: "tertiary-container";
};
/** Fab size configurations. */
export declare const FAB_SIZES: {
    readonly sm: "sm";
    readonly default: "default";
    readonly md: "md";
    readonly lg: "lg";
};
/** Fab classes. */
export declare const FAB_CLASSES: {
    readonly fab: "fab";
    readonly fabPrimary: "fab-primary";
    readonly fabPrimaryContainer: "fab-primary-container";
    readonly fabSecondary: "fab-secondary";
    readonly fabSecondaryContainer: "fab-secondary-container";
    readonly fabTertiary: "fab-tertiary";
    readonly fabTertiaryContainer: "fab-tertiary-container";
    readonly fabSm: "fab-sm";
    readonly fabMd: "fab-md";
    readonly fabLg: "fab-lg";
    readonly fabCollapsed: "fab-collapsed";
    readonly fabLabel: "fab-label";
    readonly hover: string;
    readonly active: string;
};
/** The state provided to the `fabClasses()` function. */
export interface FabClassesState {
    /** The color of the fab. */
    color?: FabColor;
    /**
     * The size of the fab. With a label, `default`, `md` and `lg` are the
     * small, medium and large extended FABs. `sm` is the small (40dp) FAB,
     * icon-only; the spec no longer recommends it.
     */
    size?: FabSize;
    /**
     * Whether an extended FAB shows its label (Compose `expanded`). `false`
     * collapses the `.fab-label` so the FAB becomes an icon-only FAB.
     * Defaults to `true`.
     */
    expanded?: boolean;
    /** Emulates `:hover`. */
    hover?: boolean;
    /** Emulates `:active`. */
    active?: boolean;
}
/**
 * Returns the fab classes to apply to an element based on the given state.
 *
 * @param state The state of the fab.
 * @return An object of class names and truthy values if they apply.
 */
export declare function fabClasses({ color, size, expanded, hover, active, }?: FabClassesState): ClassInfo;
/**
 * Sets up fab functionality for the given element.
 *
 * @param fab The element on which to set up fab functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupFab(fab: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds fab styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`
 *   <button class="${fab()}">
 *     <md-icon>add</md-icon>
 *   </button>
 *
 *   <button class="${fab({expanded})}">
 *     <md-icon>add</md-icon>
 *     <span class="fab-label">Extended</span>
 *   </button>
 * `;
 * ```
 */
export declare const fab: (state?: FabClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/** Options for `setupCollapseOnScroll()`. */
export interface CollapseOnScrollOptions {
    /** Removes the scroll listener when aborted. */
    signal?: AbortSignal;
    /**
     * The distance in pixels to scroll in one direction before the FAB changes
     * state, so small scroll jitter does not toggle it. Defaults to `8`.
     */
    threshold?: number;
}
/**
 * Collapses an extended FAB while `target` scrolls down and expands it while
 * it scrolls up or reaches the top (M3 extended FAB, Motion: "The extended FAB
 * can transform into a FAB when scrolling down, and back to an extended FAB
 * when scrolling up").
 *
 * @example
 * ```ts
 * setupCollapseOnScroll(list, (expanded) => {
 *   fabEl.expanded = expanded;
 * });
 * ```
 *
 * @param target The scroll container, or `window` for the document.
 * @param onExpandedChange Called with the new expanded state when it changes.
 * @param opts Options, including a cleanup `signal`.
 */
export declare function setupCollapseOnScroll(target: Element | Window, onExpandedChange: (expanded: boolean) => void, { signal, threshold }?: CollapseOnScrollOptions): void;
