/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement, type PropertyValues } from 'lit';
import { createValidator, getValidityAnchor } from '../../../behaviors/constraint-validation.js';
import { getFormValue } from '../../../behaviors/form-associated.js';
import { onReportValidity } from '../../../behaviors/on-report-validity.js';
import { type Validator } from '../../../behaviors/validators/validator.js';
import { type Density } from '../shared/density.js';
import '../shared/focus-reset.js';
import { type TextFieldVariant } from './text-field.js';
/** Input types supported by the text field. */
export type TextFieldType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'textarea';
/** When the error icon shows: in the error state, or only on focus. */
export type ErrorIconVisibility = 'always' | 'focus';
/** When the supporting text shows: `always`, or `focus` only while focused. */
export type SupportingTextVisibility = 'always' | 'focus';
/** Input types that render a value or mask while empty. */
export type UnsupportedTextFieldType = 'color' | 'date' | 'datetime-local' | 'file' | 'month' | 'time' | 'week';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<(abstract new (...args: any[]) => import("../../../behaviors/element-internals.js").WithElementInternals) & typeof LitElement & import("../../../behaviors/form-associated.js").FormAssociatedConstructor, import("../../../behaviors/form-associated.js").FormAssociated>, import("../../../behaviors/constraint-validation.js").ConstraintValidation>, import("../../../behaviors/on-report-validity.js").OnReportValidity>>;
/**
 * A Material Design text field (filled or outlined).
 *
 * Renders a native `<input>` (or `<textarea>` for `type="textarea"`) in its
 * shadow root, labelled by a floating `<label>` and described by the
 * supporting text, error text and character counter. It is form associated:
 * it submits `value` under `name`, supports constraint validation
 * (`required`, `minlength`, `pattern`, ...), `setCustomValidity()`,
 * `reportValidity()`, and form reset and restore.
 *
 * @fires {InputEvent} input - The native `input` event. --bubbles --composed
 * @fires {Event} change - The native `change` event. --bubbles
 * @fires {Event} select - The native `select` event. --bubbles
 * @fires {Event} invalid - Fired when `checkValidity()` or `reportValidity()` finds the field invalid. --bubbles
 * @slot leading-icon - An icon (or icon button) before the input.
 * @slot trailing-icon - An icon (or icon button) after the input, such as a clear, visibility or error icon.
 * @csspart container - The field's container.
 * @csspart input - The native `<input>` or `<textarea>`.
 * @csspart label - The floating label.
 * @csspart supporting-text - The supporting or error text.
 * @csspart counter - The character counter.
 * @cssprop --active-indicator-color - Filled active indicator color.
 * @cssprop --active-indicator-height - Filled active indicator thickness.
 * @cssprop --caret-color - Input caret color.
 * @cssprop --container-color - Container background color.
 * @cssprop --container-shape - Container corner radius.
 * @cssprop --container-height - Single-line container height.
 * @cssprop --input-text - Input typography.
 * @cssprop --input-text-axes - Input font variation settings.
 * @cssprop --input-text-color - Input text color.
 * @cssprop --input-text-placeholder-color - Placeholder color.
 * @cssprop --input-text-prefix-color - Prefix text color.
 * @cssprop --input-text-suffix-color - Suffix text color.
 * @cssprop --input-text-tracking - Input letter spacing.
 * @cssprop --label-text - Resting label typography.
 * @cssprop --label-text-axes - Label font variation settings.
 * @cssprop --label-text-color - Label color.
 * @cssprop --label-text-populated-size - Floated label font size.
 * @cssprop --label-text-populated-line-height - Floated label line height.
 * @cssprop --label-text-tracking - Label letter spacing.
 * @cssprop --leading-icon-color - Leading icon color.
 * @cssprop --leading-icon-size - Leading icon size.
 * @cssprop --trailing-icon-color - Trailing icon color.
 * @cssprop --trailing-icon-size - Trailing icon size.
 * @cssprop --outline-color - Outlined container outline color.
 * @cssprop --outline-width - Outlined container outline width.
 * @cssprop --outline-label-padding - Space around the floated label in the outline notch.
 * @cssprop --state-layer-color - Hover state layer color (filled).
 * @cssprop --supporting-text - Supporting text typography.
 * @cssprop --supporting-text-axes - Supporting text font variation settings.
 * @cssprop --supporting-text-color - Supporting text color.
 * @cssprop --supporting-text-tracking - Supporting text letter spacing.
 * @cssprop --top-space - Space above the content (filled: above the floated label).
 * @cssprop --bottom-space - Space below the input.
 * @cssprop --leading-space - Start padding without a leading icon.
 * @cssprop --trailing-space - End padding without a trailing icon.
 * @cssprop --icon-leading-space - Start padding before a leading icon.
 * @cssprop --icon-trailing-space - End padding after a trailing icon.
 * @cssprop --icon-input-space - Space between an icon and the input.
 * @cssprop --supporting-text-top-space - Space above the supporting text.
 * @cssprop --counter-space - Space between the supporting text and counter.
 * @cssprop --affix-space - Space between the prefix/suffix and the input.
 * @cssprop --density-step - Container height removed per density step.
 */
export declare class TextFieldElement extends baseClass {
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** The variant: `filled` (default) or `outlined`. */
    variant: TextFieldVariant;
    /**
     * The density, from 0 (default) to -3. Each step down removes 4px from the
     * container height (56px), half above and half below the content; text
     * keeps its size. Values are clamped to that range.
     *
     * text-fields.md "Avoid applying density by default": dense fields are
     * below the 48x48 CSS pixel target, so let people opt in (a denser layout
     * or theme) and keep the controls that change it at 48x48.
     */
    get density(): Density;
    set density(density: number);
    private densityValue;
    /**
     * Whether the field is in a visually invalid state. Overrides the error
     * state set by `reportValidity()`.
     */
    error: boolean;
    /**
     * When the error icon shows in the trailing edge: `always` (default) in
     * the error state, or `focus` only while the field has focus. Its space
     * stays reserved, so focusing the field does not move the text.
     */
    errorIcon: ErrorIconVisibility;
    /**
     * The message that replaces the supporting text while `error` is true. If
     * empty, the supporting text keeps showing. Overrides the message shown by
     * `reportValidity()`.
     */
    errorText: string;
    /**
     * The floating label. It is also the input's accessible name, unless
     * `aria-label` is set.
     */
    label: string;
    /** Hides the asterisk added to the label of a required field. */
    noAsterisk: boolean;
    /**
     * Whether a value is required for form submission. Adds an asterisk to the
     * label.
     */
    required: boolean;
    /** The current value. It is always a string. */
    value: string;
    /**
     * The default value, the `value` attribute: what the field shows until the
     * person edits it and what form reset restores.
     */
    get defaultValue(): string;
    set defaultValue(value: string);
    /** Text shown before the input value, such as a currency symbol. */
    prefixText: string;
    /** Text shown after the input value, such as a unit. */
    suffixText: string;
    /** Whether a leading icon is slotted. Set it for SSR. */
    hasLeadingIcon: boolean;
    /** Whether a trailing icon is slotted. Set it for SSR. */
    hasTrailingIcon: boolean;
    /** Additional information shown below the field. */
    supportingText: string;
    /**
     * When the supporting text shows: `always` (default), or `focus` only while
     * the field has focus (text-fields-aed1bf). Its space stays reserved so the
     * layout does not move, it stays in the input's accessible description, and
     * an error message always shows.
     */
    supportingTextVisibility: SupportingTextVisibility;
    /** Overrides the input's CSS `direction`. */
    textDirection: string;
    /** The number of rows of a `type="textarea"` field. */
    rows: number;
    /** The number of columns of a `type="textarea"` field. */
    cols: number;
    inputMode: string;
    /** The greatest permitted value. */
    max: string;
    /**
     * The maximum number of characters; shows a character counter. -1 for
     * none.
     */
    maxLength: number;
    /** The least permitted value. */
    min: string;
    /** The minimum number of characters. -1 for none. */
    minLength: number;
    /** Hides the spinner of `type="number"` fields. */
    noSpinner: boolean;
    /** A regular expression the value must match. */
    pattern: string;
    /**
     * Hint text shown in the input while it is empty and the label is floated
     * (or there is no label).
     */
    placeholder: string;
    /** Whether the value cannot be edited. */
    readOnly: boolean;
    /** Whether an email field accepts multiple addresses. */
    multiple: boolean;
    /** The step between permitted numeric values. */
    step: string;
    /**
     * The input type, `text` by default. `textarea` renders a multi-line
     * `<textarea>`.
     */
    type: TextFieldType | UnsupportedTextFieldType;
    /** The input's `autocomplete` hint. */
    autocomplete: string;
    name: string;
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled(): boolean;
    set disabled(disabled: boolean);
    formDisabledCallback(disabled: boolean): void;
    private readonly formDisabled;
    setCustomValidity(error: string): void;
    /**
     * Re-announces an error message that did not change (the visible message
     * has `role="alert"`, which only announces changes).
     */
    private readonly announcer;
    /** The dirty value and the error shown after validation. */
    private readonly field;
    private readonly inputOrTextarea;
    /** The direction in which selection occurred. */
    get selectionDirection(): "forward" | "backward" | "none" | null;
    set selectionDirection(value: 'forward' | 'backward' | 'none' | null);
    /** The end of the text selection. */
    get selectionEnd(): number | null;
    set selectionEnd(value: number | null);
    /** The start of the text selection. */
    get selectionStart(): number | null;
    set selectionStart(value: number | null);
    /** The value as a number. */
    get valueAsNumber(): number;
    set valueAsNumber(value: number);
    /** The value as a Date. */
    get valueAsDate(): Date | null;
    set valueAsDate(value: Date | null);
    /** Selects all the text. */
    select(): void;
    /** Replaces a range of text with a new string. */
    setRangeText(replacement: string): void;
    setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void;
    /** Sets the start and end of the text selection. */
    setSelectionRange(start: number | null, end: number | null, direction?: 'forward' | 'backward' | 'none'): void;
    /** Shows the browser picker of a date, time or color field. */
    showPicker(): void;
    /** Decrements a numeric value by `step`, `n` times. */
    stepDown(n?: number): void;
    /** Increments a numeric value by `step`, `n` times. */
    stepUp(n?: number): void;
    /** Resets the value to the `value` attribute and clears native errors. */
    reset(): void;
    focus(options?: FocusOptions): void;
    attributeChangedCallback(attribute: string, oldValue: string | null, newValue: string | null): void;
    protected updated(changed: PropertyValues<this>): void;
    /** Whether the person edited the value and then left the field. */
    private interacted;
    private handleFocusOut;
    protected render(): import("lit-html").TemplateResult<1>;
    private renderInput;
    /**
     * The error icon. In the error state it is labelled "Error" (the spec's
     * label for an icon with no action). Otherwise it is decorative and hidden
     * from assistive technology. With `error-icon="focus"` it is hidden until
     * the field has focus, but keeps its place.
     */
    private renderErrorIcon;
    private renderAffix;
    private getLabelText;
    private handleInput;
    private redispatchEvent;
    private handleContainerClick;
    private handleIconChange;
    private getInputOrTextarea;
    private getInput;
    [getFormValue](): string;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | null): void;
    [createValidator](): Validator<unknown>;
    [getValidityAnchor](): HTMLElement | null;
    [onReportValidity](invalidEvent: Event | null): void;
}
export {};
