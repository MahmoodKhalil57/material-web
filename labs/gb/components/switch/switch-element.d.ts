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
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<(abstract new (...args: any[]) => import("../../../behaviors/custom-state-set.js").WithCustomStateSet) & (abstract new (...args: any[]) => import("../../../behaviors/element-internals.js").WithElementInternals) & typeof LitElement & import("../../../behaviors/form-associated.js").FormAssociatedConstructor, import("../../../behaviors/form-associated.js").FormAssociated>, import("../../../behaviors/constraint-validation.js").ConstraintValidation>>;
/**
 * A Material Design switch component.
 *
 * @slot off-icon - Used to show an icon when the switch is unselected.
 * @slot on-icon - Used to show an icon when the switch is selected.
 * @fires {InputEvent} input - Fired when the switch is selected or unselected. --bubbles --composed
 * @fires {Event} change - Fired when the switch is selected or unselected. --bubbles
 * @csspart switch - The switch's root element.
 * @cssprop --handle-color
 * @cssprop --handle-height
 * @cssprop --handle-shape
 * @cssprop --handle-width
 * @cssprop --with-icon-handle-height
 * @cssprop --with-icon-handle-width
 * @cssprop --icon-color
 * @cssprop --icon-size
 * @cssprop --state-layer-color
 * @cssprop --state-layer-shape
 * @cssprop --state-layer-size - State layer size at density 0.
 * @cssprop --track-color
 * @cssprop --track-height
 * @cssprop --track-opacity
 * @cssprop --track-outline-color
 * @cssprop --track-outline-width
 * @cssprop --track-shape
 * @cssprop --track-width
 * @cssprop --density-step - State layer size removed per density step.
 * @cssprop --target-size - The minimum touch target size, kept at any density.
 */
export declare class SwitchElement extends baseClass {
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * Puts the switch in the selected state and sets the form submission value to
     * the `value` property.
     */
    get selected(): boolean;
    set selected(value: boolean);
    /**
     * The default selected state of the switch.
     */
    get defaultSelected(): boolean;
    set defaultSelected(value: boolean);
    /**
     * When true, require the switch to be selected when participating in
     * form submission.
     *
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#validation
     */
    required: boolean;
    /**
     * The value associated with this switch on form submission. `null` is
     * submitted when `selected` is `false`.
     */
    value: string;
    /**
     * The density, from 0 (default) to -3. Each step down removes 4px from the
     * state layer (40px); the track keeps its size and the touch target stays
     * 48px. Values are clamped to that range.
     *
     * switch.md: don't apply density by default; let people opt in to a
     * denser layout.
     */
    get density(): Density;
    set density(density: number);
    private densityValue;
    private readonly button;
    /**
     * Form value, default state, dirty checkedness (the `selected` attribute only
     * updates the state until the switch is interacted with), reset and restore.
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
     * Selecting the text label clicks the switch element itself (not the
     * button in its shadow root); pass it on so the label selects it too.
     */
    private readonly handleHostClick;
    protected render(): import("lit-html").TemplateResult<1>;
    private dragStartX;
    private dragDistance;
    private suppressClick;
    private readonly handlePointerDown;
    private readonly handlePointerMove;
    private readonly handlePointerUp;
    /** Runs on the host in the capture phase, before the button toggles. */
    private readonly clickCapture;
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
    [getValidityAnchor](): HTMLButtonElement;
}
export {};
