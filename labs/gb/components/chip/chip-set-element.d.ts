/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement, PropertyValues } from "lit";
import { createValidator, getValidityAnchor } from "../../../behaviors/constraint-validation.js";
import { type FormRestoreState, type FormValue, getFormState, getFormValue } from "../../../behaviors/form-associated.js";
import { type Validator } from "../../../behaviors/validators/validator.js";
import { type Density } from "../shared/density.js";
import { RovingFocusController } from "../shared/roving-focus.js";
import { type SelectionMode } from "../shared/selection.js";
import { ChipElement } from "./chip-element.js";
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<(abstract new (...args: any[]) => import("../../../behaviors/element-internals.js").WithElementInternals) & typeof LitElement & import("../../../behaviors/form-associated.js").FormAssociatedConstructor, import("../../../behaviors/form-associated.js").FormAssociated>, import("../../../behaviors/constraint-validation.js").ConstraintValidation>;
/**
 * A Material Design chip set (`md-gb-chip-set`): a group of `md-gb-chip`s.
 *
 * Chips are laid out in a row with the spec's 8dp space between them and
 * wrap onto more lines, or scroll horizontally in one line with
 * `single-line`.
 *
 * Keyboard (spec: accessibility, keyboard navigation): the set is a single
 * tab stop. Left / Right (mirrored in RTL) move focus between chips, and
 * between a chip's primary action and its remove button; Home / End focus
 * the first / last chip. Disabled chips are skipped (soft-disabled chips
 * stay focusable). When the focused chip is removed, focus moves to the
 * chip that takes its place, or the previous one.
 *
 * Selection (spec: multi-select chip sets): the filter chips in the set are
 * selected by click, Space or Enter. `selection="multiple"` (default) lets
 * any number of chips be selected, `single` at most one, `none` none; with
 * `required`, the selected chip of a single-select set can't be unselected.
 * The set fires `input` and `change` from the chip the user changed, never
 * for programmatic changes. Other chip types perform actions and are not
 * selected.
 *
 * Form: the set is form associated. With a `name` it submits the `value` of
 * the selected chip (single-select) or one entry per selected chip
 * (multiple), and form reset and restore bring the selection back. A chip's
 * `value` defaults to its label. A single-select set with `required` is
 * invalid while nothing is selected. A disabled set, or one in a disabled
 * `<fieldset>`, disables its chips and leaves its value out of the form.
 *
 * Semantics (spec: labeling elements, role on the web): the set is a `grid`
 * with one row and each chip a `gridcell` (unless it has its own `role`).
 * Give the set an `aria-label`.
 *
 * @slot - The chips.
 * @cssprop --chip-set-space - The space between chips and between lines.
 * @cssprop --chip-set-overflow-inset - Room kept for touch targets and focus
 *   rings when a single-line set clips its overflow.
 */
export declare class ChipSetElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** Keep the chips on one line and scroll horizontally instead of wrapping. */
    singleLine: boolean;
    /**
     * The density of the chips, from 0 (default) to -3: each step down removes
     * 4px from the chips' height. A chip's own non-zero `density` wins. Values
     * are clamped to that range.
     */
    get density(): Density;
    set density(density: number);
    private densityValue;
    /** How many filter chips can be selected: `none`, `single` or `multiple`. */
    selection: SelectionMode;
    /** Single-select: the selected chip can't be unselected. */
    required: boolean;
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled(): boolean;
    set disabled(disabled: boolean);
    formDisabledCallback(disabled: boolean): void;
    private readonly formDisabled;
    /**
     * The value of the first selected chip, or `''`. Setting it selects the
     * chip with that value, and only that one.
     */
    get value(): string;
    set value(value: string);
    /**
     * The values of the selected chips. Setting it selects the chips with
     * those values (only the first one in single-select).
     */
    get values(): string[];
    set values(values: string[]);
    /** The chips in the set. */
    get chips(): ChipElement[];
    /** The selected filter chips. */
    get selectedChips(): ChipElement[];
    private readonly childElements;
    /** Index of the focused chip while it is being removed. */
    private removedFocusIndex;
    /**
     * Left / Right (mirrored in RTL), Home / End, wrapping, one tab stop
     * (shared RovingFocusController). Moving backwards enters a chip at its
     * remove button; a chip moves between its own primary action and remove
     * button itself before the set gets the key.
     */
    protected readonly rovingFocus: RovingFocusController;
    /**
     * The selection model (shared SelectionController) over the filter chips.
     * A chip toggles itself when it is clicked on its own, so the controller
     * claims the click inside a set. The remove button of a chip is another
     * action.
     */
    private readonly selectionModel;
    constructor();
    protected render(): import("lit-html").TemplateResult<1>;
    protected updated(changed: PropertyValues<this>): void;
    /** Disables the chips with the set. */
    private syncDisabled;
    [getFormValue](): FormValue | null;
    [getFormState](): FormValue | null;
    formResetCallback(): void;
    formStateRestoreCallback(state: FormRestoreState | null): void;
    [createValidator](): Validator<unknown>;
    [getValidityAnchor](): HTMLElement | null;
    private isFocusable;
    private focusChip;
    private readonly handleRemove;
    private handleSlotChange;
}
export {};
