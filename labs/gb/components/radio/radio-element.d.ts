/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
import { createValidator, getValidityAnchor } from '../../../behaviors/constraint-validation.js';
import { getFormState, getFormValue } from '../../../behaviors/form-associated.js';
import { RadioValidator } from '../../../behaviors/validators/radio-validator.js';
import { type Density } from '../shared/density.js';
declare const radioBaseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<(abstract new (...args: any[]) => import("../../../behaviors/element-internals.js").WithElementInternals) & (abstract new (...args: any[]) => import("../../../behaviors/focusable.js").Focusable) & typeof LitElement & import("../../../behaviors/form-associated.js").FormAssociatedConstructor, import("../../../behaviors/form-associated.js").FormAssociated>, import("../../../behaviors/constraint-validation.js").ConstraintValidation>;
/**
 * A Material Design radio component.
 *
 * @fires {InputEvent} input - Fired when the radio is checked (but not unchecked). --bubbles --composed
 * @fires {Event} change - Fired when the radio is checked (but not unchecked). --bubbles
 * @csspart radio - The radio's root element.
 * @cssprop --icon-color
 * @cssprop --icon-size
 * @cssprop --state-layer-color
 * @cssprop --state-layer-shape
 * @cssprop --state-layer-size - State layer size at density 0.
 * @cssprop --density-step - Size removed per density step.
 * @cssprop --target-size - The minimum touch target size, kept at any density.
 */
export declare class RadioElement extends radioBaseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * Whether or not the radio is selected.
     */
    get checked(): boolean;
    set checked(checked: boolean);
    /**
     * The default checked state of the radio.
     */
    get defaultChecked(): boolean;
    set defaultChecked(value: boolean);
    /**
     * Whether or not the radio is required. If any radio is required in a group,
     * all radios are implicitly required.
     */
    required: boolean;
    /**
     * The element value to use in form submission when checked.
     */
    value: string;
    /**
     * The density, from 0 (default) to -3. Each step down removes 4px from the
     * radio's layout box (48px) and state layer (40px); the touch target stays
     * 48px. Values are clamped to that range.
     *
     * radio-button.md: don't apply density by default; let people opt in to a
     * denser layout.
     */
    get density(): Density;
    set density(density: number);
    private densityValue;
    private readonly radio;
    /** The radio group: same `name`, same root and same form. */
    private readonly selectionController;
    /**
     * Form value, default state, dirty checkedness (the `checked` attribute only
     * updates the state until the radio is interacted with), reset and restore.
     */
    private readonly formDisabled;
    private readonly field;
    private isFocused;
    constructor();
    protected render(): import("lit-html").TemplateResult<1>;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled(): boolean;
    set disabled(disabled: boolean);
    formDisabledCallback(disabled: boolean): void;
    [getFormValue](): string;
    [getFormState](): string;
    formResetCallback(): void;
    formStateRestoreCallback(state: string): void;
    [createValidator](): RadioValidator;
    [getValidityAnchor](): HTMLElement;
}
export {};
