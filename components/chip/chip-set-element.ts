/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CSSResultOrNative,
  html,
  isServer,
  LitElement,
  PropertyValues,
} from "lit";
import { property, queryAssignedElements } from "lit/decorators.js";
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from "../../behaviors/constraint-validation.js";
import {
  internals,
  mixinElementInternals,
} from "../../behaviors/element-internals.js";
import {
  type FormRestoreState,
  type FormValue,
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from "../../behaviors/form-associated.js";
import { type Validator } from "../../behaviors/validators/validator.js";
import { clampDensity, type Density } from "../shared/density.js";
import {
  FormDisabledController,
  SelectionGroupValidator,
} from "../shared/form-field.js";
import { RovingFocusController } from "../shared/roving-focus.js";
import { SelectionController, type SelectionMode } from "../shared/selection.js";
import { ChipElement } from "./chip-element.js";
import { specChipType } from "./chip.js";
import { styles as chipSetStyles } from "./chip-set.cssresult.js";

// Separate variable needed for closure.
const baseClass = mixinConstraintValidation(
  mixinFormAssociated(mixinElementInternals(LitElement)),
);

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
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [chipSetStyles];

  /** Keep the chips on one line and scroll horizontally instead of wrapping. */
  @property({ type: Boolean, reflect: true, attribute: "single-line" })
  singleLine = false;

  /**
   * The density of the chips, from 0 (default) to -3: each step down removes
   * 4px from the chips' height. A chip's own non-zero `density` wins. Values
   * are clamped to that range.
   */
  @property({ type: Number, reflect: true })
  get density(): Density {
    return this.densityValue;
  }
  set density(density: number) {
    const old = this.densityValue;
    this.densityValue = clampDensity(Number(density));
    this.requestUpdate("density", old);
  }
  private densityValue: Density = 0;

  /** How many filter chips can be selected: `none`, `single` or `multiple`. */
  @property({ reflect: true }) selection: SelectionMode = "multiple";

  /** Single-select: the selected chip can't be unselected. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Disabled by the attribute or by a disabled fieldset. */
  override get disabled(): boolean {
    return super.disabled || !!this.formDisabled?.value;
  }
  override set disabled(disabled: boolean) {
    super.disabled = disabled;
  }

  override formDisabledCallback(disabled: boolean) {
    // Not the attribute: it would keep the set disabled after the fieldset
    // is enabled again.
    this.formDisabled.set(disabled);
  }

  private readonly formDisabled = new FormDisabledController(this);

  /**
   * The value of the first selected chip, or `''`. Setting it selects the
   * chip with that value, and only that one.
   */
  get value(): string {
    return this.selectionModel.value;
  }
  set value(value: string) {
    this.values = value ? [value] : [];
  }

  /**
   * The values of the selected chips. Setting it selects the chips with
   * those values (only the first one in single-select).
   */
  get values(): string[] {
    return this.selectionModel.values;
  }
  set values(values: string[]) {
    this.selectionModel.setValues(values);
  }

  /** The chips in the set. */
  get chips(): ChipElement[] {
    return this.childElements.filter(
      (child): child is ChipElement => child instanceof ChipElement,
    );
  }

  /** The selected filter chips. */
  get selectedChips(): ChipElement[] {
    return this.selectionModel.selectedItems;
  }

  @queryAssignedElements({ flatten: true })
  private readonly childElements!: HTMLElement[];

  /** Index of the focused chip while it is being removed. */
  private removedFocusIndex = -1;

  /**
   * Left / Right (mirrored in RTL), Home / End, wrapping, one tab stop
   * (shared RovingFocusController). Moving backwards enters a chip at its
   * remove button; a chip moves between its own primary action and remove
   * button itself before the set gets the key.
   */
  // spec: chips/accessibility/keyboard-navigation
  protected readonly rovingFocus = new RovingFocusController(this, {
    items: () => this.chips,
    orientation: "horizontal",
    canFocus: (chip) => this.isFocusable(chip as ChipElement),
    focusItem: (chip, direction) =>
      (chip as ChipElement).focus({ trailing: direction < 0 }),
  });

  /**
   * The selection model (shared SelectionController) over the filter chips.
   * A chip toggles itself when it is clicked on its own, so the controller
   * claims the click inside a set. The remove button of a chip is another
   * action.
   */
  // spec: chips/accessibility/keyboard-navigation
  private readonly selectionModel = new SelectionController<ChipElement>(this, {
    items: () => this.chips.filter((chip) => specChipType(chip.type) === "filter"),
    mode: () => this.selection,
    required: () => this.required,
    canSelect: (chip) =>
      !chip.effectivelyDisabled && !chip.softDisabled && !chip.hidden,
    ignore: (event) =>
      event.composedPath().some((el) => el instanceof Element && el.classList.contains("chip-remove")),
    claimClicks: true,
    eventsFrom: "item",
  });

  constructor() {
    super();
    if (!isServer) {
      this[internals].role = "grid";
      this.addEventListener("update-focus", () => this.rovingFocus.sync());
      // Capture: record the focused chip before a `remove` listener on the
      // chip itself takes it out of the DOM.
      this.addEventListener("remove", this.handleRemove, { capture: true });
    }
  }

  protected override render() {
    return html`<div role="row">
      <slot @slotchange=${this.handleSlotChange}></slot>
    </div>`;
  }

  protected override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (changed.has("selection") || changed.has("required")) {
      this.selectionModel.normalize();
    }
    this[internals].ariaDisabled = this.disabled ? "true" : null;
    this.syncDisabled();
  }

  /** Disables the chips with the set. */
  private syncDisabled() {
    const { disabled } = this;
    for (const chip of this.chips) {
      chip.groupDisabled = disabled;
    }
  }

  override [getFormValue](): FormValue | null {
    // `requestUpdate()` runs before the field initializers on construction.
    return this.selectionModel ? this.selectionModel.formValue(this.name) : null;
  }

  override [getFormState](): FormValue | null {
    return this[getFormValue]();
  }

  override formResetCallback() {
    this.selectionModel.reset();
  }

  override formStateRestoreCallback(state: FormRestoreState | null) {
    if (typeof state === "string") {
      this.value = state;
    } else if (state instanceof FormData) {
      this.values = state
        .getAll(this.name)
        .filter((v): v is string => typeof v === "string");
    } else {
      this.values = [];
    }
  }

  override [createValidator](): Validator<unknown> {
    return new SelectionGroupValidator(() => ({
      required: this.required && this.selection === "single",
      // Validity is read while the base class constructs.
      hasSelection: !!this.selectionModel && this.selectedChips.length > 0,
    }));
  }

  override [getValidityAnchor](): HTMLElement | null {
    return this.selectionModel ? (this.chips[0] ?? null) : null;
  }

  private isFocusable(chip: ChipElement) {
    return !chip.effectivelyDisabled && !chip.hidden;
  }

  private focusChip(chip: ChipElement) {
    this.rovingFocus.focus(chip);
  }

  private readonly handleRemove = (event: Event) => {
    const chips = this.chips;
    const index = chips.findIndex((chip) =>
      chip.contains(event.target as Node),
    );
    this.removedFocusIndex =
      index >= 0 && chips[index].matches(":focus-within") ? index : -1;
  };

  private handleSlotChange() {
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
      const next =
        chips.slice(index).find((chip) => this.isFocusable(chip)) ??
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
