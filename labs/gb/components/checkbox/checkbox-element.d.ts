/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
import { createValidator, getValidityAnchor } from '../../../behaviors/constraint-validation.js';
import { getFormState, getFormValue } from '../../../behaviors/form-associated.js';
import { CheckboxValidator } from '../../../behaviors/validators/checkbox-validator.js';
import { type Density } from '../shared/density.js';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<(abstract new (...args: any[]) => import("../../../behaviors/element-internals.js").WithElementInternals) & typeof LitElement & import("../../../behaviors/form-associated.js").FormAssociatedConstructor, import("../../../behaviors/form-associated.js").FormAssociated>, import("../../../behaviors/constraint-validation.js").ConstraintValidation>>;
/**
 * A Material Design checkbox component.
 *
 * @fires {InputEvent} input - Fired when the checkbox is checked or unchecked. --bubbles --composed
 * @fires {Event} change - Fired when the checkbox is checked or unchecked. --bubbles
 * @csspart checkbox - The checkbox's root element.
 * @cssprop --container-color
 * @cssprop --container-shape
 * @cssprop --container-size
 * @cssprop --icon-color
 * @cssprop --icon-size
 * @cssprop --outline-color
 * @cssprop --outline-width
 * @cssprop --state-layer-color
 * @cssprop --state-layer-shape
 * @cssprop --state-layer-size - State layer size at density 0.
 * @cssprop --density-step - Size removed per density step.
 * @cssprop --target-size - The minimum touch target size, kept at any density.
 */
export declare class CheckboxElement extends baseClass {
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * Whether or not the checkbox is invalid.
     */
    error: boolean;
    /**
     * Whether or not the checkbox is selected.
     */
    checked: boolean;
    /**
     * The default checked state of the checkbox.
     */
    get defaultChecked(): boolean;
    set defaultChecked(value: boolean);
    /**
     * Whether or not the checkbox is indeterminate.
     *
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes
     */
    indeterminate: boolean;
    /**
     * When true, require the checkbox to be selected when participating in
     * form submission.
     *
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#validation
     */
    required: boolean;
    /**
     * The value of the checkbox that is submitted with a form when selected.
     *
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value
     */
    value: string;
    /**
     * The density, from 0 (default) to -3. Each step down removes 4px from the
     * checkbox's layout box (48px) and state layer (40px); the touch target
     * stays 48px. Values are clamped to that range.
     *
     * checkbox.md: don't apply density by default; let people opt in to a
     * denser layout.
     */
    get density(): Density;
    set density(density: number);
    private densityValue;
    private readonly input;
    /**
     * Form value, default state, dirty checkedness (the `checked` attribute only
     * updates the state until the checkbox is interacted with), reset, restore
     * and the error shown after `reportValidity()`.
     */
    private readonly formDisabled;
    private readonly field;
    /**
     * The adjacent `<label>` text, used as the accessibility label when there
     * is no `aria-label` (spec: the label is the adjacent text label).
     */
    private readonly labelFromText;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Selecting the text label clicks the checkbox element itself (not the
     * input in its shadow root); pass it on so the label selects it too.
     */
    private readonly handleHostClick;
    protected render(): import("lit-html").TemplateResult<1>;
    private handleInput;
    private handleChange;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled(): boolean;
    set disabled(disabled: boolean);
    formDisabledCallback(disabled: boolean): void;
    [getFormValue](): string;
    [getFormState](): string;
    formResetCallback(): void;
    formStateRestoreCallback(state: string): void;
    [createValidator](): CheckboxValidator;
    [getValidityAnchor](): HTMLInputElement;
}
export {};
