/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { html, isServer, LitElement, } from "lit";
import { property, queryAssignedElements } from "lit/decorators.js";
import { createValidator, getValidityAnchor, mixinConstraintValidation, } from "../../../behaviors/constraint-validation.js";
import { internals, mixinElementInternals, } from "../../../behaviors/element-internals.js";
import { getFormState, getFormValue, mixinFormAssociated, } from "../../../behaviors/form-associated.js";
import { clampDensity } from "../shared/density.js";
import { FormDisabledController, SelectionGroupValidator, } from "../shared/form-field.js";
import { RovingFocusController } from "../shared/roving-focus.js";
import { SelectionController } from "../shared/selection.js";
import { ChipElement } from "./chip-element.js";
import { specChipType } from "./chip.js";
import { styles as chipSetStyles } from "./chip-set.cssresult.js";
// Separate variable needed for closure.
const baseClass = mixinConstraintValidation(mixinFormAssociated(mixinElementInternals(LitElement)));
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
export class ChipSetElement extends baseClass {
    /**
     * The density of the chips, from 0 (default) to -3: each step down removes
     * 4px from the chips' height. A chip's own non-zero `density` wins. Values
     * are clamped to that range.
     */
    get density() {
        return this.densityValue;
    }
    set density(density) {
        const old = this.densityValue;
        this.densityValue = clampDensity(Number(density));
        this.requestUpdate("density", old);
    }
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled() {
        return super.disabled || !!this.formDisabled?.value;
    }
    set disabled(disabled) {
        super.disabled = disabled;
    }
    formDisabledCallback(disabled) {
        // Not the attribute: it would keep the set disabled after the fieldset
        // is enabled again.
        this.formDisabled.set(disabled);
    }
    /**
     * The value of the first selected chip, or `''`. Setting it selects the
     * chip with that value, and only that one.
     */
    get value() {
        return this.selectionModel.value;
    }
    set value(value) {
        this.values = value ? [value] : [];
    }
    /**
     * The values of the selected chips. Setting it selects the chips with
     * those values (only the first one in single-select).
     */
    get values() {
        return this.selectionModel.values;
    }
    set values(values) {
        this.selectionModel.setValues(values);
    }
    /** The chips in the set. */
    get chips() {
        return this.childElements.filter((child) => child instanceof ChipElement);
    }
    /** The selected filter chips. */
    get selectedChips() {
        return this.selectionModel.selectedItems;
    }
    constructor() {
        super();
        /** Keep the chips on one line and scroll horizontally instead of wrapping. */
        this.singleLine = false;
        this.densityValue = 0;
        /** How many filter chips can be selected: `none`, `single` or `multiple`. */
        this.selection = "multiple";
        /** Single-select: the selected chip can't be unselected. */
        this.required = false;
        this.formDisabled = new FormDisabledController(this);
        /** Index of the focused chip while it is being removed. */
        this.removedFocusIndex = -1;
        /**
         * Left / Right (mirrored in RTL), Home / End, wrapping, one tab stop
         * (shared RovingFocusController). Moving backwards enters a chip at its
         * remove button; a chip moves between its own primary action and remove
         * button itself before the set gets the key.
         */
        // spec: chips/accessibility/keyboard-navigation
        this.rovingFocus = new RovingFocusController(this, {
            items: () => this.chips,
            orientation: "horizontal",
            canFocus: (chip) => this.isFocusable(chip),
            focusItem: (chip, direction) => chip.focus({ trailing: direction < 0 }),
        });
        /**
         * The selection model (shared SelectionController) over the filter chips.
         * A chip toggles itself when it is clicked on its own, so the controller
         * claims the click inside a set. The remove button of a chip is another
         * action.
         */
        // spec: chips/accessibility/keyboard-navigation
        this.selectionModel = new SelectionController(this, {
            items: () => this.chips.filter((chip) => specChipType(chip.type) === "filter"),
            mode: () => this.selection,
            required: () => this.required,
            canSelect: (chip) => !chip.effectivelyDisabled && !chip.softDisabled && !chip.hidden,
            ignore: (event) => event.composedPath().some((el) => el instanceof Element && el.classList.contains("chip-remove")),
            claimClicks: true,
            eventsFrom: "item",
        });
        this.handleRemove = (event) => {
            const chips = this.chips;
            const index = chips.findIndex((chip) => chip.contains(event.target));
            this.removedFocusIndex =
                index >= 0 && chips[index].matches(":focus-within") ? index : -1;
        };
        if (!isServer) {
            this[internals].role = "grid";
            this.addEventListener("update-focus", () => this.rovingFocus.sync());
            // Capture: record the focused chip before a `remove` listener on the
            // chip itself takes it out of the DOM.
            this.addEventListener("remove", this.handleRemove, { capture: true });
        }
    }
    render() {
        return html `<div role="row">
      <slot @slotchange=${this.handleSlotChange}></slot>
    </div>`;
    }
    updated(changed) {
        super.updated(changed);
        if (changed.has("selection") || changed.has("required")) {
            this.selectionModel.normalize();
        }
        this[internals].ariaDisabled = this.disabled ? "true" : null;
        this.syncDisabled();
    }
    /** Disables the chips with the set. */
    syncDisabled() {
        const { disabled } = this;
        for (const chip of this.chips) {
            chip.groupDisabled = disabled;
        }
    }
    [getFormValue]() {
        // `requestUpdate()` runs before the field initializers on construction.
        return this.selectionModel ? this.selectionModel.formValue(this.name) : null;
    }
    [getFormState]() {
        return this[getFormValue]();
    }
    formResetCallback() {
        this.selectionModel.reset();
    }
    formStateRestoreCallback(state) {
        if (typeof state === "string") {
            this.value = state;
        }
        else if (state instanceof FormData) {
            this.values = state
                .getAll(this.name)
                .filter((v) => typeof v === "string");
        }
        else {
            this.values = [];
        }
    }
    [createValidator]() {
        return new SelectionGroupValidator(() => ({
            required: this.required && this.selection === "single",
            // Validity is read while the base class constructs.
            hasSelection: !!this.selectionModel && this.selectedChips.length > 0,
        }));
    }
    [getValidityAnchor]() {
        return this.selectionModel ? (this.chips[0] ?? null) : null;
    }
    isFocusable(chip) {
        return !chip.effectivelyDisabled && !chip.hidden;
    }
    focusChip(chip) {
        this.rovingFocus.focus(chip);
    }
    handleSlotChange() {
        const { chips } = this;
        for (const chip of chips) {
            if (!chip.hasAttribute("role")) {
                chip.setAttribute("role", "gridcell");
            }
        }
        const index = this.removedFocusIndex;
        this.removedFocusIndex = -1;
        const activeChip = chips.some((chip) => chip.matches(":focus-within"));
        if (index >= 0 && !activeChip) {
            // The focused chip was removed: focus the chip now at its index (the
            // next one), else the nearest previous one.
            const next = chips.slice(index).find((chip) => this.isFocusable(chip)) ??
                chips
                    .slice(0, index)
                    .reverse()
                    .find((chip) => this.isFocusable(chip));
            if (next) {
                this.focusChip(next);
                return;
            }
        }
        this.syncDisabled();
        this.rovingFocus.sync();
        this.selectionModel.normalize();
    }
}
/** @nocollapse */
ChipSetElement.styles = [chipSetStyles];
__decorate([
    property({ type: Boolean, reflect: true, attribute: "single-line" })
], ChipSetElement.prototype, "singleLine", void 0);
__decorate([
    property({ type: Number, reflect: true })
], ChipSetElement.prototype, "density", null);
__decorate([
    property({ reflect: true })
], ChipSetElement.prototype, "selection", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], ChipSetElement.prototype, "required", void 0);
__decorate([
    queryAssignedElements({ flatten: true })
], ChipSetElement.prototype, "childElements", void 0);
//# sourceMappingURL=chip-set-element.js.map