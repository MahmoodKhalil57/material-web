/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, LitElement, nothing, } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { styleMap } from 'lit/directives/style-map.js';
import { mixinDelegatesAria } from '../../../../internal/aria/delegate.js';
import { stringConverter } from '../../../../internal/controller/string-converter.js';
import { redispatchEvent } from '../../../../internal/events/redispatch-event.js';
import { createValidator, getValidityAnchor, mixinConstraintValidation, } from '../../../behaviors/constraint-validation.js';
import { mixinElementInternals } from '../../../behaviors/element-internals.js';
import { getFormValue, mixinFormAssociated, } from '../../../behaviors/form-associated.js';
import { mixinOnReportValidity, onReportValidity, } from '../../../behaviors/on-report-validity.js';
import { TextFieldValidator } from '../../../behaviors/validators/text-field-validator.js';
import { AnnouncerController } from '../shared/announcer.js';
import { clampDensity } from '../shared/density.js';
import { FormDisabledController, ValueFieldController, } from '../shared/form-field.js';
// Escape leaves the field: the caret goes away, the text stays (spec:
// interaction-inputs-e456f0), also when no other component loaded it.
import '../shared/focus-reset.js';
import { TEXT_FIELD_CLASSES, textFieldClasses, } from './text-field.js';
import textFieldStyles from './text-field.css.js'; // github-only
// Types whose native control always shows content, so the label stays
// floated.
const ALWAYS_POPULATED_TYPES = new Set([
    'color',
    'date',
    'datetime-local',
    'file',
    'month',
    'time',
    'week',
]);
// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(mixinOnReportValidity(mixinConstraintValidation(mixinFormAssociated(mixinElementInternals(LitElement)))));
// spec-labels: layout-bidirectionality-rtl/tab-1/component-examples/text-fields
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
// spec-labels: text-fields/specs/filled-text-field, text-fields/specs/outlined-text-field, text-fields/guidelines/anatomy/filled-text-field, text-fields/guidelines/anatomy/outlined-text-field, text-fields/guidelines/anatomy/icons-images, text-fields/guidelines/usage, text-fields/guidelines/anatomy/supporting-text-character-counter, text-fields/specs/filled-text-field/filled-text-field-configurations, text-fields/specs/outlined-text-field/outlined-text-field-configurations
export class TextFieldElement extends baseClass {
    constructor() {
        super(...arguments);
        /** The variant: `filled` (default) or `outlined`. */
        this.variant = 'filled';
        this.densityValue = 0;
        /**
         * Whether the field is in a visually invalid state. Overrides the error
         * state set by `reportValidity()`.
         */
        this.error = false;
        /**
         * When the error icon shows in the trailing edge: `always` (default) in
         * the error state, or `focus` only while the field has focus. Its space
         * stays reserved, so focusing the field does not move the text.
         */
        this.errorIcon = 'always';
        /**
         * The message that replaces the supporting text while `error` is true. If
         * empty, the supporting text keeps showing. Overrides the message shown by
         * `reportValidity()`.
         */
        this.errorText = '';
        /**
         * The floating label. It is also the input's accessible name, unless
         * `aria-label` is set.
         */
        this.label = '';
        /** Hides the asterisk added to the label of a required field. */
        this.noAsterisk = false;
        /**
         * Whether a value is required for form submission. Adds an asterisk to the
         * label.
         */
        this.required = false;
        /** The current value. It is always a string. */
        this.value = '';
        /** Text shown before the input value, such as a currency symbol. */
        this.prefixText = '';
        /** Text shown after the input value, such as a unit. */
        this.suffixText = '';
        /** Whether a leading icon is slotted. Set it for SSR. */
        this.hasLeadingIcon = false;
        /** Whether a trailing icon is slotted. Set it for SSR. */
        this.hasTrailingIcon = false;
        /** Additional information shown below the field. */
        this.supportingText = '';
        /**
         * When the supporting text shows: `always` (default), or `focus` only while
         * the field has focus (text-fields-aed1bf). Its space stays reserved so the
         * layout does not move, it stays in the input's accessible description, and
         * an error message always shows.
         */
        this.supportingTextVisibility = 'always';
        /** Overrides the input's CSS `direction`. */
        this.textDirection = '';
        /** The number of rows of a `type="textarea"` field. */
        this.rows = 2;
        /** The number of columns of a `type="textarea"` field. */
        this.cols = 20;
        this.inputMode = '';
        /** The greatest permitted value. */
        this.max = '';
        /**
         * The maximum number of characters; shows a character counter. -1 for
         * none.
         */
        this.maxLength = -1;
        /** The least permitted value. */
        this.min = '';
        /** The minimum number of characters. -1 for none. */
        this.minLength = -1;
        /** Hides the spinner of `type="number"` fields. */
        this.noSpinner = false;
        /** A regular expression the value must match. */
        this.pattern = '';
        /**
         * Hint text shown in the input while it is empty and the label is floated
         * (or there is no label).
         */
        this.placeholder = '';
        /** Whether the value cannot be edited. */
        this.readOnly = false;
        /** Whether an email field accepts multiple addresses. */
        this.multiple = false;
        /** The step between permitted numeric values. */
        this.step = '';
        /**
         * The input type, `text` by default. `textarea` renders a multi-line
         * `<textarea>`.
         */
        this.type = 'text';
        /** The input's `autocomplete` hint. */
        this.autocomplete = '';
        this.formDisabled = new FormDisabledController(this);
        /**
         * Re-announces an error message that did not change (the visible message
         * has `role="alert"`, which only announces changes).
         */
        this.announcer = new AnnouncerController(this);
        /** The dirty value and the error shown after validation. */
        this.field = new ValueFieldController(this, {
            onRepeat: (message) => this.announcer.announce(message, 'assertive'),
        });
        /** Whether the person edited the value and then left the field. */
        this.interacted = false;
    }
    /**
     * The density, from 0 (default) to -3. Each step down removes 4px from the
     * container height (56px), half above and half below the content; text
     * keeps its size. Values are clamped to that range.
     *
     * text-fields.md "Avoid applying density by default": dense fields are
     * below the 48x48 CSS pixel target, so let people opt in (a denser layout
     * or theme) and keep the controls that change it at 48x48.
     */
    get density() {
        return this.densityValue;
    }
    set density(density) {
        const old = this.densityValue;
        this.densityValue = clampDensity(Number(density));
        this.requestUpdate('density', old);
    }
    /**
     * The default value, the `value` attribute: what the field shows until the
     * person edits it and what form reset restores.
     */
    get defaultValue() {
        return this.getAttribute('value') ?? '';
    }
    set defaultValue(value) {
        this.setAttribute('value', value);
    }
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled() {
        return super.disabled || !!this.formDisabled?.value;
    }
    set disabled(disabled) {
        super.disabled = disabled;
    }
    formDisabledCallback(disabled) {
        // Not the attribute: it would keep the field disabled after the fieldset
        // is enabled again.
        this.formDisabled.set(disabled);
    }
    setCustomValidity(error) {
        super.setCustomValidity(error);
        // Shows or clears the message of an error that was already reported.
        this.requestUpdate();
    }
    /** The direction in which selection occurred. */
    get selectionDirection() {
        return this.getInputOrTextarea().selectionDirection;
    }
    set selectionDirection(value) {
        this.getInputOrTextarea().selectionDirection = value;
    }
    /** The end of the text selection. */
    get selectionEnd() {
        return this.getInputOrTextarea().selectionEnd;
    }
    set selectionEnd(value) {
        this.getInputOrTextarea().selectionEnd = value;
    }
    /** The start of the text selection. */
    get selectionStart() {
        return this.getInputOrTextarea().selectionStart;
    }
    set selectionStart(value) {
        this.getInputOrTextarea().selectionStart = value;
    }
    /** The value as a number. */
    get valueAsNumber() {
        return this.getInput()?.valueAsNumber ?? NaN;
    }
    set valueAsNumber(value) {
        const input = this.getInput();
        if (!input)
            return;
        input.valueAsNumber = value;
        this.value = input.value;
    }
    /** The value as a Date. */
    get valueAsDate() {
        return this.getInput()?.valueAsDate ?? null;
    }
    set valueAsDate(value) {
        const input = this.getInput();
        if (!input)
            return;
        input.valueAsDate = value;
        this.value = input.value;
    }
    /** Selects all the text. */
    select() {
        this.getInputOrTextarea().select();
    }
    setRangeText(...args) {
        this.getInputOrTextarea().setRangeText(...args);
        this.value = this.getInputOrTextarea().value;
    }
    /** Sets the start and end of the text selection. */
    setSelectionRange(start, end, direction) {
        this.getInputOrTextarea().setSelectionRange(start, end, direction);
    }
    /** Shows the browser picker of a date, time or color field. */
    showPicker() {
        this.getInput()?.showPicker();
    }
    /** Decrements a numeric value by `step`, `n` times. */
    stepDown(n) {
        const input = this.getInput();
        if (!input)
            return;
        input.stepDown(n);
        this.value = input.value;
    }
    /** Increments a numeric value by `step`, `n` times. */
    stepUp(n) {
        const input = this.getInput();
        if (!input)
            return;
        input.stepUp(n);
        this.value = input.value;
    }
    /** Resets the value to the `value` attribute and clears native errors. */
    reset() {
        this.field.reset();
        this.interacted = false;
        this.value = this.defaultValue;
    }
    focus(options) {
        // A focusable slotted icon button would otherwise take delegated focus.
        this.getInputOrTextarea().focus(options);
    }
    attributeChangedCallback(attribute, oldValue, newValue) {
        if (this.field?.ignoresAttribute(attribute)) {
            // After user input, the value attribute no longer updates the value
            // (until reset), like a native <input>.
            return;
        }
        super.attributeChangedCallback(attribute, oldValue, newValue);
    }
    updated(changed) {
        super.updated(changed);
        // A change such as `type` can change the native value without an event.
        const value = this.getInputOrTextarea().value;
        if (this.value !== value) {
            this.value = value;
        }
    }
    handleFocusOut() {
        if (!this.field.isDirty || this.interacted)
            return;
        this.interacted = true;
        this.requestUpdate();
    }
    render() {
        const textarea = this.type === 'textarea';
        // Like `:user-invalid`: once the person edited the value and left the
        // field, an invalid value shows the error until it is valid again.
        const userInvalid = this.interacted && !this.validity.valid;
        const showError = !this.disabled && (this.field.hasError || userInvalid);
        const errorText = this.field.hasError
            ? this.field.message
            : userInvalid
                ? this.validationMessage
                : '';
        const supporting = showError && errorText ? errorText : this.supportingText;
        const hasCounter = (this.maxLength ?? -1) > -1;
        const describedBy = [
            this.prefixText && !textarea ? 'prefix' : '',
            this.suffixText && !textarea ? 'suffix' : '',
            supporting ? 'supporting-text' : '',
            hasCounter ? 'counter' : '',
        ]
            .filter(Boolean)
            .join(' ');
        const classes = textFieldClasses({
            variant: this.variant,
            populated: !!this.value || ALWAYS_POPULATED_TYPES.has(this.type),
            error: showError,
            hasLabel: !!this.label,
            hasLeadingIcon: this.hasLeadingIcon,
            // The error icon takes the trailing box, like a trailing icon.
            hasTrailingIcon: this.hasTrailingIcon || showError,
            textarea,
            noSpinner: this.noSpinner,
            disabled: this.disabled,
            density: this.density,
        });
        const labelText = this.getLabelText();
        return html `
      <div class=${classMap(classes)}>
        <div
          class="text-field-container"
          part="container"
          @click=${this.handleContainerClick}
        >
          <span class="text-field-leading-icon">
            <slot
              name="leading-icon"
              @slotchange=${this.handleIconChange}
            ></slot>
          </span>
          ${labelText
            ? html `<label
                  id="label"
                  class="text-field-label"
                  part="label"
                  for="input"
                  >${labelText}</label
                >`
            : nothing}
          <div class="text-field-content">
            <div class="text-field-input-row">
              ${this.renderAffix('prefix', this.prefixText, textarea)}
              ${this.renderInput(textarea, showError, describedBy)}
              ${this.renderAffix('suffix', this.suffixText, textarea)}
            </div>
          </div>
          <span class="text-field-trailing-icon">
            <slot
              name="trailing-icon"
              @slotchange=${this.handleIconChange}
            ></slot>
            ${this.renderErrorIcon(showError)}
          </span>
          <div class="text-field-outline" aria-hidden="true">
            <div class="text-field-outline-start"></div>
            <div class="text-field-outline-notch">
              <span class="text-field-outline-label">${labelText}</span>
            </div>
            <div class="text-field-outline-end"></div>
          </div>
        </div>
        ${supporting || hasCounter
            ? html `<div class="text-field-supporting">
                <span
                  id="supporting-text"
                  class=${classMap({
                'text-field-supporting-text': true,
                [TEXT_FIELD_CLASSES.supportingTextFocus]: this.supportingTextVisibility === 'focus' &&
                    !(showError && errorText),
            })}
                  part="supporting-text"
                  role=${showError && errorText ? 'alert' : nothing}
                  >${supporting}</span
                >
                ${hasCounter
                ? html `<span
                        id="counter"
                        class="text-field-counter"
                        part="counter"
                        aria-label="Character count, ${this.value.length}/${this.maxLength}"
                        >${this.value.length}/${this.maxLength}</span
                      >`
                : nothing}
              </div>`
            : nothing}
      </div>
    `;
    }
    renderInput(textarea, showError, describedBy) {
        const style = styleMap({
            direction: this.textDirection || null,
            '--_rows': textarea ? String(this.rows) : null,
        });
        const { ariaLabel } = this;
        // lit-analyzer `autocomplete` types are too strict.
        // tslint:disable-next-line:no-any
        const autocomplete = (this.autocomplete || nothing);
        // These may be null if the attribute is removed, and `null > -1` is true.
        const hasMaxLength = (this.maxLength ?? -1) > -1;
        const hasMinLength = (this.minLength ?? -1) > -1;
        if (textarea) {
            return html `<textarea
        id="input"
        class="text-field-input"
        part="input"
        style=${style}
        aria-describedby=${describedBy || nothing}
        aria-invalid=${showError ? 'true' : 'false'}
        aria-label=${ariaLabel || nothing}
        autocomplete=${autocomplete}
        name=${this.name || nothing}
        ?disabled=${this.disabled}
        maxlength=${hasMaxLength ? this.maxLength : nothing}
        minlength=${hasMinLength ? this.minLength : nothing}
        placeholder=${this.placeholder || nothing}
        ?readonly=${this.readOnly}
        ?required=${this.required}
        rows=${this.rows}
        cols=${this.cols}
        .value=${live(this.value)}
        @change=${this.redispatchEvent}
        @input=${this.handleInput}
        @focusout=${this.handleFocusOut}
        @select=${this.redispatchEvent}
      ></textarea>`;
        }
        // tslint:disable-next-line:no-any
        const inputMode = (this.inputMode || nothing);
        return html `<input
      id="input"
      class="text-field-input"
      part="input"
      style=${style}
      aria-describedby=${describedBy || nothing}
      aria-invalid=${showError ? 'true' : 'false'}
      aria-label=${ariaLabel || nothing}
      autocomplete=${autocomplete}
      name=${this.name || nothing}
      ?disabled=${this.disabled}
      inputmode=${inputMode}
      max=${(this.max || nothing)}
      maxlength=${hasMaxLength ? this.maxLength : nothing}
      min=${(this.min || nothing)}
      minlength=${hasMinLength ? this.minLength : nothing}
      pattern=${this.pattern || nothing}
      placeholder=${this.placeholder || nothing}
      ?readonly=${this.readOnly}
      ?required=${this.required}
      ?multiple=${this.multiple}
      step=${(this.step || nothing)}
      type=${this.type}
      .value=${live(this.value)}
      @change=${this.redispatchEvent}
      @input=${this.handleInput}
      @focusout=${this.handleFocusOut}
      @select=${this.redispatchEvent}
    />`;
    }
    /**
     * The error icon. In the error state it is labelled "Error" (the spec's
     * label for an icon with no action). Otherwise it is decorative and hidden
     * from assistive technology. With `error-icon="focus"` it is hidden until
     * the field has focus, but keeps its place.
     */
    renderErrorIcon(showError) {
        const classes = classMap({
            'text-field-error-icon': true,
            [TEXT_FIELD_CLASSES.errorIconFocus]: this.errorIcon === 'focus',
        });
        return html `<svg
      class=${classes}
      viewBox="0 0 24 24"
      role=${showError ? 'img' : nothing}
      aria-label=${showError ? 'Error' : nothing}
      aria-hidden=${showError ? nothing : 'true'}
      focusable="false"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
      />
    </svg>`;
    }
    renderAffix(id, text, textarea) {
        if (!text || textarea) {
            return nothing;
        }
        return html `<span id=${id} class="text-field-${id}">${text}</span>`;
    }
    getLabelText() {
        if (!this.label) {
            return '';
        }
        // The asterisk is part of the accessible name (spec: "The accessibility
        // label must include the asterisk").
        return this.required && !this.noAsterisk ? `${this.label}*` : this.label;
    }
    handleInput(event) {
        this.field.markDirty();
        this.value = event.target.value;
        // The native `input` event is composed; no need to redispatch it.
    }
    redispatchEvent(event) {
        redispatchEvent(this, event);
    }
    handleContainerClick(event) {
        if (this.disabled)
            return;
        const path = event.composedPath();
        const input = this.inputOrTextarea;
        if (!input || path.includes(input))
            return;
        // Icons may be interactive (e.g. a clear button); leave their focus.
        const inIcon = path.some((el) => el instanceof HTMLElement &&
            (el.classList.contains('text-field-leading-icon') ||
                el.classList.contains('text-field-trailing-icon')));
        if (!inIcon) {
            input.focus();
        }
    }
    handleIconChange(event) {
        const slot = event.target;
        const has = slot.assignedElements({ flatten: true }).length > 0;
        if (slot.name === 'leading-icon') {
            this.hasLeadingIcon = has;
        }
        else {
            this.hasTrailingIcon = has;
        }
    }
    getInputOrTextarea() {
        if (!this.inputOrTextarea) {
            // Render synchronously if the element was never connected, e.g.
            // `document.createElement('md-gb-text-field').focus()`.
            this.connectedCallback();
            this.scheduleUpdate();
        }
        if (this.isUpdatePending) {
            // Sync constraint properties (such as `required`) before calling input
            // APIs that depend on them.
            this.scheduleUpdate();
        }
        return this.inputOrTextarea;
    }
    getInput() {
        if (this.type === 'textarea') {
            return null;
        }
        return this.getInputOrTextarea();
    }
    [getFormValue]() {
        return this.value;
    }
    formResetCallback() {
        this.reset();
    }
    formStateRestoreCallback(state) {
        this.value = state ?? '';
    }
    [createValidator]() {
        return new TextFieldValidator(() => ({
            state: this,
            renderedControl: this.inputOrTextarea,
        }));
    }
    [getValidityAnchor]() {
        return this.inputOrTextarea;
    }
    [onReportValidity](invalidEvent) {
        this.field.report(invalidEvent);
    }
}
/** @nocollapse */
TextFieldElement.shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
};
/** @nocollapse */
TextFieldElement.styles = [
    textFieldStyles,
    css `
      :host {
        display: inline-flex;
        vertical-align: top;
      }
      :host([hidden]) {
        display: none;
      }
      .text-field {
        flex: 1;
        min-inline-size: 0;
      }
    `,
];
__decorate([
    property({ reflect: true })
], TextFieldElement.prototype, "variant", void 0);
__decorate([
    property({ type: Number, reflect: true })
], TextFieldElement.prototype, "density", null);
__decorate([
    property({ type: Boolean, reflect: true })
], TextFieldElement.prototype, "error", void 0);
__decorate([
    property({ attribute: 'error-icon' })
], TextFieldElement.prototype, "errorIcon", void 0);
__decorate([
    property({ attribute: 'error-text' })
], TextFieldElement.prototype, "errorText", void 0);
__decorate([
    property()
], TextFieldElement.prototype, "label", void 0);
__decorate([
    property({ type: Boolean, attribute: 'no-asterisk' })
], TextFieldElement.prototype, "noAsterisk", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], TextFieldElement.prototype, "required", void 0);
__decorate([
    property()
], TextFieldElement.prototype, "value", void 0);
__decorate([
    property({ attribute: 'prefix-text' })
], TextFieldElement.prototype, "prefixText", void 0);
__decorate([
    property({ attribute: 'suffix-text' })
], TextFieldElement.prototype, "suffixText", void 0);
__decorate([
    property({ type: Boolean, attribute: 'has-leading-icon' })
], TextFieldElement.prototype, "hasLeadingIcon", void 0);
__decorate([
    property({ type: Boolean, attribute: 'has-trailing-icon' })
], TextFieldElement.prototype, "hasTrailingIcon", void 0);
__decorate([
    property({ attribute: 'supporting-text' })
], TextFieldElement.prototype, "supportingText", void 0);
__decorate([
    property({ attribute: 'supporting-text-visibility' })
], TextFieldElement.prototype, "supportingTextVisibility", void 0);
__decorate([
    property({ attribute: 'text-direction' })
], TextFieldElement.prototype, "textDirection", void 0);
__decorate([
    property({ type: Number })
], TextFieldElement.prototype, "rows", void 0);
__decorate([
    property({ type: Number })
], TextFieldElement.prototype, "cols", void 0);
__decorate([
    property({ reflect: true })
], TextFieldElement.prototype, "inputMode", void 0);
__decorate([
    property()
], TextFieldElement.prototype, "max", void 0);
__decorate([
    property({ type: Number })
], TextFieldElement.prototype, "maxLength", void 0);
__decorate([
    property()
], TextFieldElement.prototype, "min", void 0);
__decorate([
    property({ type: Number })
], TextFieldElement.prototype, "minLength", void 0);
__decorate([
    property({ type: Boolean, attribute: 'no-spinner' })
], TextFieldElement.prototype, "noSpinner", void 0);
__decorate([
    property()
], TextFieldElement.prototype, "pattern", void 0);
__decorate([
    property({ reflect: true, converter: stringConverter })
], TextFieldElement.prototype, "placeholder", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], TextFieldElement.prototype, "readOnly", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], TextFieldElement.prototype, "multiple", void 0);
__decorate([
    property()
], TextFieldElement.prototype, "step", void 0);
__decorate([
    property({ reflect: true })
], TextFieldElement.prototype, "type", void 0);
__decorate([
    property({ reflect: true })
], TextFieldElement.prototype, "autocomplete", void 0);
__decorate([
    query('.text-field-input')
], TextFieldElement.prototype, "inputOrTextarea", void 0);
//# sourceMappingURL=text-field-element.js.map