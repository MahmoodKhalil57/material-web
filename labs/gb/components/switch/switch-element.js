/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { mixinDelegatesAria } from '../../../../internal/aria/delegate.js';
import { redispatchEvent } from '../../../../internal/events/redispatch-event.js';
import { createValidator, getValidityAnchor, mixinConstraintValidation, } from '../../../behaviors/constraint-validation.js';
import { hasState, mixinCustomStateSet, toggleState, } from '../../../behaviors/custom-state-set.js';
import { mixinElementInternals } from '../../../behaviors/element-internals.js';
import { getFormState, getFormValue, mixinFormAssociated, } from '../../../behaviors/form-associated.js';
import { CheckboxValidator } from '../../../behaviors/validators/checkbox-validator.js';
import { clampDensity } from '../shared/density.js';
import { FormDisabledController, ToggleFieldController, } from '../shared/form-field.js';
import { hasSlotted } from '../shared/has-slotted.js';
import { LabelTextController } from '../shared/label-text.js';
import focusRingStyles from '../focus/focus-ring.css' with { type: 'css' }; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with { type: 'css' }; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import switchStyles from './switch.css' with { type: 'css' }; // github-only
// import switchStyles from './switch.cssresult.js'; // google3-only
import { switchToggle } from './switch.js';
/** How far (px) a pointer must move to count as a drag instead of a tap. */
const DRAG_THRESHOLD = 8;
// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(mixinConstraintValidation(mixinFormAssociated(mixinCustomStateSet(mixinElementInternals(LitElement)))));
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
// spec-labels: switch/specs, switch/guidelines/anatomy, switch/guidelines/usage, switch/specs/configurations, switch/specs/measurements
export class SwitchElement extends baseClass {
    constructor() {
        super(...arguments);
        /**
         * When true, require the switch to be selected when participating in
         * form submission.
         *
         * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#validation
         */
        this.required = false;
        /**
         * The value associated with this switch on form submission. `null` is
         * submitted when `selected` is `false`.
         */
        this.value = 'on';
        this.densityValue = 0;
        /**
         * Form value, default state, dirty checkedness (the `selected` attribute only
         * updates the state until the switch is interacted with), reset and restore.
         */
        this.formDisabled = new FormDisabledController(this);
        this.field = new ToggleFieldController(this, {
            attribute: 'selected',
            get: () => this.selected,
            set: (on) => {
                this.selected = on;
            },
        });
        /**
         * The adjacent `<label>` text, used as the accessibility label when there
         * is no `aria-label` (spec: the label is the adjacent text label).
         */
        this.labelFromText = new LabelTextController(this);
        /**
         * Selecting the text label clicks the switch element itself (not the
         * button in its shadow root); pass it on so the label selects it too.
         */
        this.handleHostClick = (event) => {
            if (event.composedPath()[0] === this)
                this.button?.click();
        };
        // Dragging the handle (touch or pointer): a drag toward the other end
        // switches it, like a tap; a drag toward the end it is already at keeps it.
        this.dragStartX = null;
        this.dragDistance = 0;
        this.suppressClick = false;
        this.handlePointerDown = (event) => {
            this.dragStartX = event.clientX;
            this.dragDistance = 0;
        };
        this.handlePointerMove = (event) => {
            if (this.dragStartX === null)
                return;
            this.dragDistance = event.clientX - this.dragStartX;
        };
        this.handlePointerUp = () => {
            const distance = this.dragDistance;
            this.dragStartX = null;
            this.dragDistance = 0;
            if (Math.abs(distance) < DRAG_THRESHOLD)
                return;
            const rtl = getComputedStyle(this).direction === 'rtl';
            const towardOn = rtl ? distance < 0 : distance > 0;
            if (towardOn === this.selected) {
                // The click that follows this release must not toggle.
                this.suppressClick = true;
                setTimeout(() => {
                    this.suppressClick = false;
                }, 0);
            }
        };
        /** Runs on the host in the capture phase, before the button toggles. */
        this.clickCapture = (event) => {
            if (!this.suppressClick)
                return;
            this.suppressClick = false;
            event.stopImmediatePropagation();
            event.preventDefault();
        };
    }
    /**
     * Puts the switch in the selected state and sets the form submission value to
     * the `value` property.
     */
    get selected() {
        return this[hasState]('selected');
    }
    set selected(value) {
        const old = this.selected;
        this[toggleState]('selected', value);
        // Updates the form value synchronously.
        this.requestUpdate('selected', old);
    }
    /**
     * The default selected state of the switch.
     */
    get defaultSelected() {
        return this.field.defaultOn;
    }
    set defaultSelected(value) {
        this.field.defaultOn = value;
    }
    /**
     * The density, from 0 (default) to -3. Each step down removes 4px from the
     * state layer (40px); the track keeps its size and the touch target stays
     * 48px. Values are clamped to that range.
     *
     * switch.md: don't apply density by default; let people opt in to a
     * denser layout.
     */
    get density() {
        return this.densityValue;
    }
    set density(density) {
        const old = this.densityValue;
        this.densityValue = clampDensity(Number(density));
        this.requestUpdate('density', old);
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('click', this.clickCapture, true);
        this.addEventListener('click', this.handleHostClick);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this.clickCapture, true);
        this.removeEventListener('click', this.handleHostClick);
    }
    render() {
        const { ariaLabel } = this;
        return html `
      <button
        role="switch"
        part="switch"
        class="${switchToggle({ density: this.density })}"
        aria-checked="${this.selected ? 'true' : 'false'}"
        aria-label=${ariaLabel || this.labelFromText.text || nothing}
        ?disabled=${this.disabled}
        @pointerdown=${this.handlePointerDown}
        @pointermove=${this.handlePointerMove}
        @pointerup=${this.handlePointerUp}
        @change=${this.handleChange}>
        <span class="switch-touch" aria-hidden="true"></span>
        <slot name="off-icon" class="switch-icon-off" ${hasSlotted()}></slot>
        <slot name="on-icon" class="switch-icon-on"></slot>
      </button>
    `;
    }
    handleChange(event) {
        this.field.markDirty();
        this.selected = this.button?.ariaChecked === 'true';
        // Change event is not composed, re-dispatch it.
        redispatchEvent(this, event);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // The 'selected' attribute does not update switches that have been
        // interacted with.
        if (this.field?.ignoresAttribute(name))
            return;
        super.attributeChangedCallback(name, oldValue, newValue);
    }
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled() {
        return super.disabled || !!this.formDisabled?.value;
    }
    set disabled(disabled) {
        super.disabled = disabled;
    }
    formDisabledCallback(disabled) {
        // Not the attribute: it would keep the control disabled after the
        // fieldset is enabled again.
        this.formDisabled.set(disabled);
    }
    [getFormValue]() {
        // Called while the base class constructs, before `field` exists.
        return this.field ? this.field.formValue() : null;
    }
    [getFormState]() {
        return this.field ? this.field.formState() : null;
    }
    formResetCallback() {
        this.field.reset();
    }
    formStateRestoreCallback(state) {
        this.field.restore(state);
    }
    [createValidator]() {
        return new CheckboxValidator(() => ({
            checked: this.selected,
            required: this.required,
        }));
    }
    [getValidityAnchor]() {
        return this.button;
    }
}
/** @nocollapse */
SwitchElement.shadowRootOptions = {
    mode: 'open',
    delegatesFocus: true,
};
/** @nocollapse */
SwitchElement.styles = [
    focusRingStyles,
    rippleStyles,
    switchStyles,
    css `
      :host {
        display: inline-flex;
      }
      .switch {
        flex: 1;
      }
      ::slotted(*) {
        grid-area: handle;
      }
    `,
];
__decorate([
    property({ type: Boolean })
], SwitchElement.prototype, "selected", null);
__decorate([
    property({ type: Boolean })
], SwitchElement.prototype, "required", void 0);
__decorate([
    property()
], SwitchElement.prototype, "value", void 0);
__decorate([
    property({ type: Number, reflect: true })
], SwitchElement.prototype, "density", null);
__decorate([
    query('button')
], SwitchElement.prototype, "button", void 0);
//# sourceMappingURL=switch-element.js.map