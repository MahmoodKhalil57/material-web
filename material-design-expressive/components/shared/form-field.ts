/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  type ReactiveController,
  type ReactiveControllerHost,
} from 'lit';

import {
  SingleSelectionController,
  type SingleSelectionElement,
} from '../../foundations/interaction/selection/single-selection-controller.js';
import {Validator} from '../../internal/behaviors/validators/validator.js';

/**
 * The form layer shared by the labs/gb toggle controls (checkbox, radio,
 * switch) and slider. Form association, `required`, validity and
 * `setCustomValidity()` come from `labs/behaviors` (form-associated and
 * constraint-validation); this adds what those controls each used to
 * duplicate:
 *
 * - the form value (`value` while on, nothing while off) and form state,
 * - the default (the `checked` / `selected` attribute) and its dirty flag,
 * - form reset and state restore,
 * - showing the error after `reportValidity()` or a blocked submit,
 * - radio groups scoped to their form,
 * - the number helpers sliders use for value, reset and restore.
 *
 * Disabled-by-fieldset is `formDisabledCallback()` in the form-associated
 * mixin; the controls render `disabled` from it.
 */

/** What a toggle control exposes to its field controller. */
export interface ToggleFieldHost extends ReactiveControllerHost, HTMLElement {
  /** The value submitted while on. */
  value: string;
  /** Validity from `labs/behaviors` constraint validation. */
  readonly validity: ValidityState;
}

/** How a toggle control reads and writes its on/off state. */
export interface ToggleFieldOptions {
  /** The attribute that holds the default state (`checked`, `selected`). */
  attribute: string;
  /** Reads the state. */
  get: () => boolean;
  /** Writes the state. */
  set: (on: boolean) => void;
}

/** The form value of a toggle: its value while on, nothing while off. */
export function toggleFormValue(on: boolean, value: string): string | null {
  return on ? value : null;
}

/** The form state of a toggle, as saved for a restore. */
export function toggleFormState(on: boolean): string {
  return String(on);
}

/** Reads a saved toggle state. Anything but `'true'` is off. */
export function parseToggleState(state: unknown): boolean {
  return state === 'true';
}

/**
 * Form behavior of a two-state control: value, default state with
 * `<input>` dirty checkedness, reset, restore and the shown error.
 *
 * The control calls `markDirty()` when the person changes it, forwards
 * `formValue()`, `formState()`, `formResetCallback()` and
 * `formStateRestoreCallback()` here, and asks `ignoresAttribute()` in
 * `attributeChangedCallback()`.
 *
 * Create it as a class field. The form mixins call `formValue()` while the
 * base class is still constructing, so read it as
 * `this.field ? this.field.formValue() : null`.
 */
export class ToggleFieldController implements ReactiveController {
  /**
   * Whether the error is shown: set when the control reports itself invalid
   * (`reportValidity()`, a blocked submit), cleared as soon as it is valid.
   */
  invalid = false;

  private dirty = false;

  constructor(
    private readonly host: ToggleFieldHost,
    private readonly options: ToggleFieldOptions,
  ) {
    host.addController(this);
  }

  hostConnected() {
    this.host.addEventListener('invalid', this.handleInvalid);
  }

  hostDisconnected() {
    this.host.removeEventListener('invalid', this.handleInvalid);
  }

  hostUpdate() {
    if (this.invalid && this.host.validity.valid) {
      this.invalid = false;
    }
  }

  /** The default state: whether the default attribute is present. */
  get defaultOn(): boolean {
    return this.host.hasAttribute(this.options.attribute);
  }
  set defaultOn(on: boolean) {
    this.host.toggleAttribute(this.options.attribute, on || false);
  }

  /** Whether the person has changed the state since the last reset. */
  get isDirty(): boolean {
    return this.dirty;
  }

  /** The person changed the state; the default attribute no longer applies. */
  markDirty() {
    this.dirty = true;
  }

  /**
   * Whether an attribute change must be ignored: like `<input>`, the default
   * attribute no longer sets the state once the person changed it.
   */
  ignoresAttribute(name: string): boolean {
    return name === this.options.attribute && this.dirty;
  }

  formValue(): string | null {
    return toggleFormValue(this.options.get(), this.host.value);
  }

  formState(): string {
    return toggleFormState(this.options.get());
  }

  /** Back to the default state; the attribute applies again. */
  reset() {
    this.dirty = false;
    this.invalid = false;
    this.options.set(this.defaultOn);
  }

  restore(state: unknown) {
    this.options.set(parseToggleState(state));
  }

  private readonly handleInvalid = () => {
    if (this.invalid) return;
    this.invalid = true;
    this.host.requestUpdate();
  };
}

/**
 * A radio group scoped to its form. `SingleSelectionController` groups by
 * `name` within the root node; this also requires the same owner form (or no
 * form), so same-named radios in different forms don't uncheck each other
 * or share validity.
 */
export class FormScopedSelectionController extends SingleSelectionController {
  constructor(private readonly selectionHost: SingleSelectionElement) {
    super(selectionHost);
  }

  override get controls(): [SingleSelectionElement, ...SingleSelectionElement[]] {
    const form = (this.selectionHost as {form?: HTMLFormElement | null}).form;
    const all = super.controls;
    if (all.length === 1) return all;
    return all.filter(
      (control) =>
        ((control as {form?: HTMLFormElement | null}).form ?? null) ===
        (form ?? null),
    ) as [SingleSelectionElement, ...SingleSelectionElement[]];
  }
}

/** Reads a numeric attribute, or `undefined` when it is missing. */
export function numberAttribute(
  element: Element,
  name: string,
): number | undefined {
  const value = element.getAttribute(name);
  return value !== null ? Number(value) : undefined;
}

/** A range slider's form value: two entries, one per handle. */
export function rangeFormData(
  nameStart: string,
  valueStart: number,
  nameEnd: string,
  valueEnd: number,
): FormData {
  const data = new FormData();
  data.append(nameStart, String(valueStart));
  data.append(nameEnd, String(valueEnd));
  return data;
}

/**
 * Reads a saved slider state: `[start, end]` for a range (saved as form
 * entries), `[value]` for a single value.
 */
export function parseNumberState(
  state: string | Array<[string, string]> | null,
): number[] {
  if (Array.isArray(state)) {
    return state.map(([, value]) => Number(value));
  }
  return [Number(state)];
}

/**
 * Whether an ancestor `<fieldset disabled>` disables the control.
 *
 * The form-associated mixin copies `formDisabledCallback()` into the
 * `disabled` attribute. That attribute then keeps the control disabled by
 * itself, so the browser never calls `formDisabledCallback(false)` when the
 * fieldset is enabled again. Controls keep the fieldset state here instead
 * and report `super.disabled || this.formDisabled.value`:
 *
 * ```ts
 * override get disabled() { return super.disabled || !!this.formDisabled?.value; }
 * override set disabled(value: boolean) { super.disabled = value; }
 * override formDisabledCallback(disabled: boolean) { this.formDisabled.set(disabled); }
 * ```
 */
export class FormDisabledController {
  /** Whether a disabled fieldset (or form) currently disables the host. */
  value = false;

  constructor(private readonly host: ReactiveControllerHost) {}

  set(disabled: boolean) {
    if (disabled === this.value) return;
    this.value = disabled;
    this.host.requestUpdate();
  }
}

/** What a text-like field (text field, select, autocomplete) exposes. */
export interface ValueFieldHost extends ReactiveControllerHost, HTMLElement {
  /** The page forces the error state. */
  error: boolean;
  /** The message the page shows while `error` is set. */
  errorText: string;
  /** Validity from `labs/behaviors` constraint validation. */
  readonly validity: ValidityState;
  /** The message of the current validity problem. */
  readonly validationMessage: string;
}

/**
 * Form behavior shared by the single-value fields: the `<input>` dirty flag
 * for the `value` attribute and the error shown after validation.
 *
 * The error follows the spec ("replace supporting text with error text"):
 * `reportValidity()` or a blocked submit shows the validation message in
 * place of the supporting text (the field forwards `[onReportValidity]` to
 * `report()`), it follows the message while the field stays invalid, and it
 * goes away as soon as the field is valid. A page's own `error` and
 * `errorText` win over it.
 *
 * Create it as a class field; the field calls `markDirty()` when the person
 * changes the value, asks `ignoresAttribute()` in `attributeChangedCallback()`
 * and calls `reset()` from its own `reset()`.
 */
export class ValueFieldController implements ReactiveController {
  /** Whether `reportValidity()` found the field invalid. */
  nativeError = false;
  /** The validation message found by `reportValidity()`. */
  nativeErrorText = '';

  private dirty = false;

  constructor(
    private readonly host: ValueFieldHost,
    private readonly options: {
      /** The shown message was reported again unchanged. */
      onRepeat?: (message: string) => void;
    } = {},
  ) {
    host.addController(this);
  }

  hostUpdated() {
    if (!this.nativeError) return;
    const {validity, validationMessage} = this.host;
    if (validity.valid) {
      this.clear();
    } else if (validationMessage !== this.nativeErrorText) {
      this.nativeErrorText = validationMessage;
      this.host.requestUpdate();
    }
  }

  /** Whether the error state shows: the page's `error` or a reported one. */
  get hasError(): boolean {
    return this.host.error || this.nativeError;
  }

  /** The error text: the page's, or the reported validation message. */
  get message(): string {
    return this.host.error ? this.host.errorText : this.nativeErrorText;
  }

  /** Whether the person has changed the value since the last reset. */
  get isDirty(): boolean {
    return this.dirty;
  }

  /** The person changed the value; the `value` attribute no longer applies. */
  markDirty() {
    this.dirty = true;
  }

  /** Whether an attribute change is ignored (`value` after the person edited). */
  ignoresAttribute(name: string): boolean {
    return name === 'value' && this.dirty;
  }

  /** Back to the default value: the attribute applies again, no error. */
  reset() {
    this.dirty = false;
    this.clear();
  }

  /** Forward from `[onReportValidity]`; stops the browser pop-up. */
  report(invalidEvent: Event | null) {
    // Show the message in the field instead of the browser pop-up.
    invalidEvent?.preventDefault();
    const previous = this.message;
    const was = this.nativeError;
    this.nativeError = !!invalidEvent;
    this.nativeErrorText = this.host.validationMessage;
    const next = this.message;
    if (was && this.nativeError && previous === next) {
      // The alert did not change, so assistive technology would stay silent.
      this.options.onRepeat?.(next);
    }
    this.host.requestUpdate();
  }

  private clear() {
    if (!this.nativeError && !this.nativeErrorText) return;
    this.nativeError = false;
    this.nativeErrorText = '';
    this.host.requestUpdate();
  }
}

/** What a selection group (chip set, segmented set) exposes to validation. */
export interface SelectionGroupState {
  /** Whether the group needs a selection. */
  readonly required: boolean;
  /** Whether anything is selected. */
  readonly hasSelection: boolean;
}

/**
 * Constraint validation of a selection group: while `required`, nothing
 * selected is `valueMissing`, with the browser's own message for a required
 * choice (a required `<select>`).
 */
export class SelectionGroupValidator extends Validator<SelectionGroupState> {
  private control?: HTMLSelectElement;

  protected override computeValidity(state: SelectionGroupState) {
    if (!this.control) {
      // An empty first option is the "nothing selected" placeholder.
      this.control = document.createElement('select');
      this.control.append(new Option('', ''), new Option('selected', 'selected'));
    }
    this.control.required = state.required;
    this.control.value = state.hasSelection ? 'selected' : '';
    return {
      validity: this.control.validity,
      validationMessage: this.control.validationMessage,
    };
  }

  protected override equals(prev: SelectionGroupState, next: SelectionGroupState) {
    return prev.required === next.required && prev.hasSelection === next.hasSelection;
  }

  protected override copy({required, hasSelection}: SelectionGroupState) {
    return {required, hasSelection};
  }
}
