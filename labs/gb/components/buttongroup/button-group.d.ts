/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Button group variant layout types. */
export type ButtonGroupVariant = 'standard' | 'connected';
/** Button group resizing types (empty: by variant). */
export type ButtonGroupResizing = 'fixed' | 'flexible' | '';
/** Button group selection types. */
export type ButtonGroupSelection = 'none' | 'single' | 'multiple';
/** Button group variant layout configurations. */
export declare const BUTTON_GROUP_VARIANTS: {
    readonly standard: "standard";
    readonly connected: "connected";
};
/** Button group selection configurations. */
export declare const BUTTON_GROUP_SELECTIONS: {
    readonly none: "none";
    readonly single: "single";
    readonly multiple: "multiple";
};
/** Button group classes. */
export declare const BUTTON_GROUP_CLASSES: {
    density1: `${string}-density-1`;
    density2: `${string}-density-2`;
    density3: `${string}-density-3`;
    btnGroup: string;
    btnGroupStandard: string;
    btnGroupConnected: string;
    disabled: string;
};
/** The state provided to the `buttonGroupClasses()` function. */
export interface ButtonGroupClassesState {
    /** The visual variant of the button group. Defaults to `'standard'`. */
    variant?: ButtonGroupVariant;
    /** Whether the button group is disabled. */
    disabled?: boolean;
    /** The density of the buttons inside, 0 (default) to -3. */
    density?: number;
}
/**
 * Returns the button group classes to apply to an element based on the given state.
 *
 * @param state The state of the button group.
 * @return An object of class names and truthy values if they apply.
 */
export declare function buttonGroupClasses({ variant, disabled, density, }?: ButtonGroupClassesState): ClassInfo;
/**
 * A Lit directive that applies button group classes.
 */
export declare const buttonGroup: (state?: ButtonGroupClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/**
 * An item managed by a ButtonGroup.
 */
export interface ButtonGroupItem {
    selected?: boolean;
    disabled?: boolean;
    softDisabled?: boolean;
    href?: string;
}
/**
 * Checks if a ButtonGroupItem is selectable.
 * Disabled, soft-disabled, or link items are not selectable.
 */
export declare function isItemSelectable(item: ButtonGroupItem): boolean;
/** Options provided to the `normalizeSelection()` function. */
export interface NormalizeSelectionOptions<T extends ButtonGroupItem = ButtonGroupItem> {
    /** The selection mode. */
    selection?: ButtonGroupSelection;
    /** Whether selection is required in single-select mode. */
    required?: boolean;
    /** The item preferred to keep selected during normalization. */
    preferred?: T;
}
/**
 * Selection normalization of button group items: the shared
 * `normalizeSelection()` rules (none: nothing selected; single: at most one,
 * the preferred or last selected; required: the first selectable item when
 * none is selected; multiple: unchanged), applied to `item.selected` in
 * place.
 */
export declare function normalizeSelection<T extends ButtonGroupItem>(items: T[], options: NormalizeSelectionOptions<T>): void;
/** Options provided to the `shouldBlockToggle()` function. */
export interface ShouldBlockToggleOptions {
    /** The selection mode. */
    selection?: ButtonGroupSelection;
    /** Whether selection is required in single-select mode. */
    required?: boolean;
}
/**
 * Whether a toggle interaction on item `i` should be blocked: in required
 * single-select mode, clicking the selected button must not unselect it, so
 * exactly one item stays selected.
 */
export declare function shouldBlockToggle(items: ButtonGroupItem[], i: number, options: ShouldBlockToggleOptions): boolean;
