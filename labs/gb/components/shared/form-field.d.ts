/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
import { SingleSelectionController, type SingleSelectionElement } from '../../../../radio/internal/single-selection-controller.js';
import { Validator } from '../../../behaviors/validators/validator.js';
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
export declare function toggleFormValue(on: boolean, value: string): string | null;
/** The form state of a toggle, as saved for a restore. */
export declare function toggleFormState(on: boolean): string;
/** Reads a saved toggle state. Anything but `'true'` is off. */
export declare function parseToggleState(state: unknown): boolean;
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
export declare class ToggleFieldController implements ReactiveController {
    private readonly host;
    private readonly options;
    /**
     * Whether the error is shown: set when the control reports itself invalid
     * (`reportValidity()`, a blocked submit), cleared as soon as it is valid.
     */
    invalid: boolean;
    private dirty;
    constructor(host: ToggleFieldHost, options: ToggleFieldOptions);
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdate(): void;
    /** The default state: whether the default attribute is present. */
    get defaultOn(): boolean;
    set defaultOn(on: boolean);
    /** Whether the person has changed the state since the last reset. */
    get isDirty(): boolean;
    /** The person changed the state; the default attribute no longer applies. */
    markDirty(): void;
    /**
     * Whether an attribute change must be ignored: like `<input>`, the default
     * attribute no longer sets the state once the person changed it.
     */
    ignoresAttribute(name: string): boolean;
    formValue(): string | null;
    formState(): string;
    /** Back to the default state; the attribute applies again. */
    reset(): void;
    restore(state: unknown): void;
    private readonly handleInvalid;
}
/**
 * A radio group scoped to its form. `SingleSelectionController` groups by
 * `name` within the root node; this also requires the same owner form (or no
 * form), so same-named radios in different forms don't uncheck each other
 * or share validity.
 */
export declare class FormScopedSelectionController extends SingleSelectionController {
    private readonly selectionHost;
    constructor(selectionHost: SingleSelectionElement);
    get controls(): [SingleSelectionElement, ...SingleSelectionElement[]];
}
/** Reads a numeric attribute, or `undefined` when it is missing. */
export declare function numberAttribute(element: Element, name: string): number | undefined;
/** A range slider's form value: two entries, one per handle. */
export declare function rangeFormData(nameStart: string, valueStart: number, nameEnd: string, valueEnd: number): FormData;
/**
 * Reads a saved slider state: `[start, end]` for a range (saved as form
 * entries), `[value]` for a single value.
 */
export declare function parseNumberState(state: string | Array<[string, string]> | null): number[];
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
export declare class FormDisabledController {
    private readonly host;
    /** Whether a disabled fieldset (or form) currently disables the host. */
    value: boolean;
    constructor(host: ReactiveControllerHost);
    set(disabled: boolean): void;
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
export declare class ValueFieldController implements ReactiveController {
    private readonly host;
    private readonly options;
    /** Whether `reportValidity()` found the field invalid. */
    nativeError: boolean;
    /** The validation message found by `reportValidity()`. */
    nativeErrorText: string;
    private dirty;
    constructor(host: ValueFieldHost, options?: {
        /** The shown message was reported again unchanged. */
        onRepeat?: (message: string) => void;
    });
    hostUpdated(): void;
    /** Whether the error state shows: the page's `error` or a reported one. */
    get hasError(): boolean;
    /** The error text: the page's, or the reported validation message. */
    get message(): string;
    /** Whether the person has changed the value since the last reset. */
    get isDirty(): boolean;
    /** The person changed the value; the `value` attribute no longer applies. */
    markDirty(): void;
    /** Whether an attribute change is ignored (`value` after the person edited). */
    ignoresAttribute(name: string): boolean;
    /** Back to the default value: the attribute applies again, no error. */
    reset(): void;
    /** Forward from `[onReportValidity]`; stops the browser pop-up. */
    report(invalidEvent: Event | null): void;
    private clear;
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
export declare class SelectionGroupValidator extends Validator<SelectionGroupState> {
    private control?;
    protected computeValidity(state: SelectionGroupState): {
        validity: ValidityState;
        validationMessage: string;
    };
    protected equals(prev: SelectionGroupState, next: SelectionGroupState): boolean;
    protected copy({ required, hasSelection }: SelectionGroupState): {
        required: boolean;
        hasSelection: boolean;
    };
}
