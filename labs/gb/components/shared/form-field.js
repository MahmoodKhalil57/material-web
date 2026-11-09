/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { SingleSelectionController, } from '../../../../radio/internal/single-selection-controller.js';
import { Validator } from '../../../behaviors/validators/validator.js';
/** The form value of a toggle: its value while on, nothing while off. */
export function toggleFormValue(on, value) {
    return on ? value : null;
}
/** The form state of a toggle, as saved for a restore. */
export function toggleFormState(on) {
    return String(on);
}
/** Reads a saved toggle state. Anything but `'true'` is off. */
export function parseToggleState(state) {
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
export class ToggleFieldController {
    constructor(host, options) {
        this.host = host;
        this.options = options;
        /**
         * Whether the error is shown: set when the control reports itself invalid
         * (`reportValidity()`, a blocked submit), cleared as soon as it is valid.
         */
        this.invalid = false;
        this.dirty = false;
        this.handleInvalid = () => {
            if (this.invalid)
                return;
            this.invalid = true;
            this.host.requestUpdate();
        };
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
    get defaultOn() {
        return this.host.hasAttribute(this.options.attribute);
    }
    set defaultOn(on) {
        this.host.toggleAttribute(this.options.attribute, on || false);
    }
    /** Whether the person has changed the state since the last reset. */
    get isDirty() {
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
    ignoresAttribute(name) {
        return name === this.options.attribute && this.dirty;
    }
    formValue() {
        return toggleFormValue(this.options.get(), this.host.value);
    }
    formState() {
        return toggleFormState(this.options.get());
    }
    /** Back to the default state; the attribute applies again. */
    reset() {
        this.dirty = false;
        this.invalid = false;
        this.options.set(this.defaultOn);
    }
    restore(state) {
        this.options.set(parseToggleState(state));
    }
}
/**
 * A radio group scoped to its form. `SingleSelectionController` groups by
 * `name` within the root node; this also requires the same owner form (or no
 * form), so same-named radios in different forms don't uncheck each other
 * or share validity.
 */
export class FormScopedSelectionController extends SingleSelectionController {
    constructor(selectionHost) {
        super(selectionHost);
        this.selectionHost = selectionHost;
    }
    get controls() {
        const form = this.selectionHost.form;
        const all = super.controls;
        if (all.length === 1)
            return all;
        return all.filter((control) => (control.form ?? null) ===
            (form ?? null));
    }
}
/** Reads a numeric attribute, or `undefined` when it is missing. */
export function numberAttribute(element, name) {
    const value = element.getAttribute(name);
    return value !== null ? Number(value) : undefined;
}
/** A range slider's form value: two entries, one per handle. */
export function rangeFormData(nameStart, valueStart, nameEnd, valueEnd) {
    const data = new FormData();
    data.append(nameStart, String(valueStart));
    data.append(nameEnd, String(valueEnd));
    return data;
}
/**
 * Reads a saved slider state: `[start, end]` for a range (saved as form
 * entries), `[value]` for a single value.
 */
export function parseNumberState(state) {
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
    constructor(host) {
        this.host = host;
        /** Whether a disabled fieldset (or form) currently disables the host. */
        this.value = false;
    }
    set(disabled) {
        if (disabled === this.value)
            return;
        this.value = disabled;
        this.host.requestUpdate();
    }
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
export class ValueFieldController {
    constructor(host, options = {}) {
        this.host = host;
        this.options = options;
        /** Whether `reportValidity()` found the field invalid. */
        this.nativeError = false;
        /** The validation message found by `reportValidity()`. */
        this.nativeErrorText = '';
        this.dirty = false;
        host.addController(this);
    }
    hostUpdated() {
        if (!this.nativeError)
            return;
        const { validity, validationMessage } = this.host;
        if (validity.valid) {
            this.clear();
        }
        else if (validationMessage !== this.nativeErrorText) {
            this.nativeErrorText = validationMessage;
            this.host.requestUpdate();
        }
    }
    /** Whether the error state shows: the page's `error` or a reported one. */
    get hasError() {
        return this.host.error || this.nativeError;
    }
    /** The error text: the page's, or the reported validation message. */
    get message() {
        return this.host.error ? this.host.errorText : this.nativeErrorText;
    }
    /** Whether the person has changed the value since the last reset. */
    get isDirty() {
        return this.dirty;
    }
    /** The person changed the value; the `value` attribute no longer applies. */
    markDirty() {
        this.dirty = true;
    }
    /** Whether an attribute change is ignored (`value` after the person edited). */
    ignoresAttribute(name) {
        return name === 'value' && this.dirty;
    }
    /** Back to the default value: the attribute applies again, no error. */
    reset() {
        this.dirty = false;
        this.clear();
    }
    /** Forward from `[onReportValidity]`; stops the browser pop-up. */
    report(invalidEvent) {
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
    clear() {
        if (!this.nativeError && !this.nativeErrorText)
            return;
        this.nativeError = false;
        this.nativeErrorText = '';
        this.host.requestUpdate();
    }
}
/**
 * Constraint validation of a selection group: while `required`, nothing
 * selected is `valueMissing`, with the browser's own message for a required
 * choice (a required `<select>`).
 */
export class SelectionGroupValidator extends Validator {
    computeValidity(state) {
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
    equals(prev, next) {
        return prev.required === next.required && prev.hasSelection === next.hasSelection;
    }
    copy({ required, hasSelection }) {
        return { required, hasSelection };
    }
}
//# sourceMappingURL=form-field.js.map