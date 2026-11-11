/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property, query} from 'lit/decorators.js';
import {ARIAMixinStrict} from '../../foundations/accessibility/aria/aria.js';
import {mixinDelegatesAria} from '../../foundations/accessibility/aria/delegate.js';
import {redispatchEvent} from '../../internal/events/redispatch-event.js';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '../../internal/behaviors/constraint-validation.js';
import {mixinElementInternals} from '../../internal/behaviors/element-internals.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '../../internal/behaviors/form-associated.js';
import {CheckboxValidator} from '../../internal/behaviors/validators/checkbox-validator.js';

import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../../foundations/interaction/states/ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../../foundations/interaction/states/ripple/ripple.cssresult.js'; // google3-only
import checkboxStyles from './checkbox.css' with {type: 'css'}; // github-only
// import checkboxStyles from './checkbox.cssresult.js'; // google3-only

import {clampDensity, type Density} from '../../foundations/layout/density.js';
import {
  FormDisabledController,
  ToggleFieldController,
} from '../shared/form-field.js';
import {LabelTextController} from '../../foundations/accessibility/label-text.js';
import {checkbox} from './checkbox.js';

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(
  mixinConstraintValidation(
    mixinFormAssociated(mixinElementInternals(LitElement)),
  ),
);

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
// spec-labels: checkbox/specs/checkbox, checkbox/guidelines/anatomy, checkbox/specs/color, checkbox/specs/measurements
export class CheckboxElement extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    checkboxStyles,
    css`
      :host {
        display: inline-flex;
      }
      .checkbox {
        flex: 1;
      }
    `,
  ];

  /**
   * Whether or not the checkbox is invalid.
   */
  @property({type: Boolean}) error = false;

  /**
   * Whether or not the checkbox is selected.
   */
  @property({type: Boolean}) checked = false;

  /**
   * The default checked state of the checkbox.
   */
  get defaultChecked(): boolean {
    return this.field.defaultOn;
  }
  set defaultChecked(value: boolean) {
    this.field.defaultOn = value;
  }

  /**
   * Whether or not the checkbox is indeterminate.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes
   */
  @property({type: Boolean}) indeterminate = false;

  /**
   * When true, require the checkbox to be selected when participating in
   * form submission.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#validation
   */
  @property({type: Boolean}) required = false;

  /**
   * The value of the checkbox that is submitted with a form when selected.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value
   */
  @property() value = 'on';

  /**
   * The density, from 0 (default) to -3. Each step down removes 4px from the
   * checkbox's layout box (48px) and state layer (40px); the touch target
   * stays 48px. Values are clamped to that range.
   *
   * checkbox.md: don't apply density by default; let people opt in to a
   * denser layout.
   */
  @property({type: Number, reflect: true})
  get density(): Density {
    return this.densityValue;
  }
  set density(density: number) {
    const old = this.densityValue;
    this.densityValue = clampDensity(Number(density));
    this.requestUpdate('density', old);
  }
  private densityValue: Density = 0;

  @query('input')
  private readonly input!: HTMLInputElement | null;
  /**
   * Form value, default state, dirty checkedness (the `checked` attribute only
   * updates the state until the checkbox is interacted with), reset, restore
   * and the error shown after `reportValidity()`.
   */
  private readonly formDisabled = new FormDisabledController(this);
  private readonly field = new ToggleFieldController(this, {
    attribute: 'checked',
    get: () => this.checked,
    set: (on) => {
      this.checked = on;
    },
  });

  /**
   * The adjacent `<label>` text, used as the accessibility label when there
   * is no `aria-label` (spec: the label is the adjacent text label).
   */
  private readonly labelFromText = new LabelTextController(this);

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.handleHostClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.handleHostClick);
  }

  /**
   * Selecting the text label clicks the checkbox element itself (not the
   * input in its shadow root); pass it on so the label selects it too.
   */
  private readonly handleHostClick = (event: MouseEvent) => {
    if (event.composedPath()[0] === this) this.input?.click();
  };

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel, ariaInvalid} = this as ARIAMixinStrict;
    const invalid = this.error || this.field.invalid;
    return html`
      <input
        part="checkbox"
        class="${checkbox({invalid, density: this.density})}"
        type="checkbox"
        aria-checked=${this.indeterminate ? 'mixed' : nothing}
        aria-label=${ariaLabel || this.labelFromText.text || nothing}
        aria-invalid=${ariaInvalid || invalid || nothing}
        ?disabled=${this.disabled}
        ?required=${this.required}
        .indeterminate=${this.indeterminate}
        .checked=${this.checked}
        @input=${this.handleInput}
        @change=${this.handleChange} />
    `;
  }

  private handleInput(event: Event) {
    this.field.markDirty();
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = target.indeterminate;
    // <input> 'input' event bubbles and is composed, don't re-dispatch it.
  }

  private handleChange(event: Event) {
    this.field.markDirty();
    // <input> 'change' event is not composed, re-dispatch it.
    redispatchEvent(this, event);
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    // The 'checked' attribute does not update checkboxes that have been
    // interacted with.
    if (this.field?.ignoresAttribute(name)) return;

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /** Disabled by the attribute or by a disabled fieldset. */
  override get disabled(): boolean {
    return super.disabled || !!this.formDisabled?.value;
  }
  override set disabled(disabled: boolean) {
    super.disabled = disabled;
  }

  override formDisabledCallback(disabled: boolean) {
    // Not the attribute: it would keep the control disabled after the
    // fieldset is enabled again.
    this.formDisabled.set(disabled);
  }

  override [getFormValue]() {
    // Called while the base class constructs, before `field` exists.
    return this.field ? this.field.formValue() : null;
  }

  override [getFormState]() {
    return this.field ? this.field.formState() : null;
  }

  override formResetCallback() {
    this.field.reset();
  }

  override formStateRestoreCallback(state: string) {
    this.field.restore(state);
  }

  override [createValidator]() {
    return new CheckboxValidator(() => this);
  }

  override [getValidityAnchor]() {
    return this.input;
  }
}
