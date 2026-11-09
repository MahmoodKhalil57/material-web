/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/**
 * The chip types of the M3 spec: assist, filter, input and suggestion.
 *
 * `action` (= `assist`), `toggle` (= `filter`) and `link` (an assist chip
 * rendered as a link) are kept as aliases of earlier gb types.
 */
export type ChipType = 'assist' | 'filter' | 'input' | 'suggestion' | 'action' | 'toggle' | 'link';
/** The spec chip type for a (possibly legacy) chip type. */
export type SpecChipType = 'assist' | 'filter' | 'input' | 'suggestion';
/**
 * Chip container style: flat (outlined, the default) or elevated.
 *
 * `outlined` is an alias of `flat`. `filled` and `tonal` are not spec styles
 * and render as `flat`.
 */
export type ChipColor = 'flat' | 'elevated' | 'outlined' | 'filled' | 'tonal';
/** Chip styles. */
export declare const CHIP_COLORS: {
    readonly flat: "flat";
    readonly elevated: "elevated";
};
/** Chip classes. */
export declare const CHIP_CLASSES: {
    readonly density1: `${string}-density-1`;
    readonly density2: `${string}-density-2`;
    readonly density3: `${string}-density-3`;
    readonly chip: "chip";
    readonly chipAssist: "chip-assist";
    readonly chipFilter: "chip-filter";
    readonly chipInput: "chip-input";
    readonly chipSuggestion: "chip-suggestion";
    readonly chipElevated: "chip-elevated";
    readonly chipSelected: "chip-selected";
    readonly chipRemovable: "chip-removable";
    readonly chipWithLeadingIcon: "chip-with-leading-icon";
    readonly chipWithTrailingIcon: "chip-with-trailing-icon";
    readonly chipWithAvatar: "chip-with-avatar";
    readonly dragged: "dragged";
    readonly disabled: string;
    /** The primary action button of a removable chip. */
    readonly action: "chip-action";
    /** The remove button of a removable chip. */
    readonly remove: "chip-remove";
};
/** Chip set classes (`.chip-set` on any container). */
export declare const CHIP_SET_CLASSES: {
    readonly density1: `${string}-density-1`;
    readonly density2: `${string}-density-2`;
    readonly density3: `${string}-density-3`;
    readonly chipSet: "chip-set";
    readonly singleLine: "chip-set-single-line";
};
/** Maps legacy gb chip types to the spec chip types. */
export declare function specChipType(type?: ChipType): SpecChipType;
/** The state provided to the `chipClasses()` function. */
export interface ChipClassesState {
    /** The chip type (`assist`, `filter`, `input`, `suggestion`). */
    type?: ChipType;
    /**
     * Elevated container (spec: on images or complex backgrounds). Input chips
     * have no elevated style.
     */
    elevated?: boolean;
    /** @deprecated Use `elevated`. `'elevated'` sets `elevated`. */
    color?: ChipColor;
    /** Whether the filter or input chip is selected. */
    selected?: boolean;
    /** Whether the chip has a trailing remove button. */
    removable?: boolean;
    /** Whether the chip has a leading icon. */
    withLeadingIcon?: boolean;
    /** Whether the chip has a trailing icon (or remove button). */
    withTrailingIcon?: boolean;
    /** Whether the chip has a leading avatar (input chips). */
    withAvatar?: boolean;
    /** Emulates the dragged state. */
    dragged?: boolean;
    /** Emulates `:disabled`. */
    disabled?: boolean;
    /**
     * The density, 0 (default) to -3. Density 0 inherits the density of an
     * enclosing chip set.
     */
    density?: number;
}
/**
 * Returns the chip classes to apply to an element based on the given state.
 *
 * @param state The state of the chip.
 * @return An object of class names and truthy values if they apply.
 */
export declare function chipClasses({ type, elevated, color, selected, removable, withLeadingIcon, withTrailingIcon, withAvatar, dragged, disabled, density, }?: ChipClassesState): ClassInfo;
/**
 * Sets up chip functionality for the given element.
 *
 * @param chip The element on which to set up chip functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupChip(chip: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds chip styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`<button class="${chip({type: 'assist', elevated: true})}">Assist</button>`;
 * html`<button class="${chip({type: 'filter'})}" aria-pressed="false">Filter</button>`;
 * ```
 */
export declare const chip: (state?: ChipClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
