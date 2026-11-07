/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property, query} from 'lit/decorators.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {redispatchEvent} from '../../../../internal/events/redispatch-event.js';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '../../../behaviors/constraint-validation.js';
import {
  hasState,
  mixinCustomStateSet,
  toggleState,
} from '../../../behaviors/custom-state-set.js';
import {mixinElementInternals} from '../../../behaviors/element-internals.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '../../../behaviors/form-associated.js';
import {CheckboxValidator} from '../../../behaviors/validators/checkbox-validator.js';
import {clampDensity, type Density} from '../shared/density.js';
import {
  FormDisabledController,
  ToggleFieldController,
} from '../shared/form-field.js';
import {hasSlotted} from '../shared/has-slotted.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import switchStyles from './switch.css' with {type: 'css'}; // github-only
// import switchStyles from './switch.cssresult.js'; // google3-only

import {switchToggle} from './switch.js';

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(
  mixinConstraintValidation(
    mixinFormAssociated(mixinCustomStateSet(mixinElementInternals(LitElement))),
  ),
);

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
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    switchStyles,
    css`
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

  /**
   * Puts the switch in the selected state and sets the form submission value to
   * the `value` property.
   */
  @property({type: Boolean})
  get selected() {
    return this[hasState]('selected');
  }
  set selected(value: boolean) {
    const old = this.selected;
    this[toggleState]('selected', value);
    // Updates the form value synchronously.
    this.requestUpdate('selected', old);
  }

  /**
   * The default selected state of the switch.
   */
  get defaultSelected(): boolean {
    return this.field.defaultOn;
  }
  set defaultSelected(value: boolean) {
    this.field.defaultOn = value;
  }

  /**
   * When true, require the switch to be selected when participating in
   * form submission.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#validation
   */
  @property({type: Boolean}) required = false;

  /**
   * The value associated with this switch on form submission. `null` is
   * submitted when `selected` is `false`.
   */
  @property() value = 'on';

  /**
   * The density, from 0 (default) to -3. Each step down removes 4px from the
   * state layer (40px); the track keeps its size and the touch target stays
   * 48px. Values are clamped to that range.
   *
   * switch.md: don't apply density by default; let people opt in to a
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

  @query('button')
  private readonly button!: HTMLButtonElement | null;

  /**
   * Form value, default state, dirty checkedness (the `selected` attribute only
   * updates the state until the switch is interacted with), reset and restore.
   */
  private readonly formDisabled = new FormDisabledController(this);
  private readonly field = new ToggleFieldController(this, {
    attribute: 'selected',
    get: () => this.selected,
    set: (on) => {
      this.selected = on;
    },
  });

  protected override render() {
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <button
        role="switch"
        part="switch"
        class="${switchToggle({density: this.density})}"
        aria-checked="${this.selected ? 'true' : 'false'}"
        aria-label=${ariaLabel || nothing}
        ?disabled=${this.disabled}
        @change=${this.handleChange}>
        <span class="switch-touch" aria-hidden="true"></span>
        <slot name="off-icon" class="switch-icon-off" ${hasSlotted()}></slot>
        <slot name="on-icon" class="switch-icon-on"></slot>
      </button>
    `;
  }

  private handleChange(event: Event) {
    this.field.markDirty();
    this.selected = this.button?.ariaChecked === 'true';
    // Change event is not composed, re-dispatch it.
    redispatchEvent(this, event);
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    // The 'selected' attribute does not update switches that have been
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
    return new CheckboxValidator(() => ({
      checked: this.selected,
      required: this.required,
    }));
  }

  override [getValidityAnchor]() {
    return this.button;
  }
}
