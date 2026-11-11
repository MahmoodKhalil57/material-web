/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, isServer, LitElement} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {
  afterDispatch,
  setupDispatchHooks,
} from '../../internal/events/dispatch-hooks.js';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '../../internal/behaviors/constraint-validation.js';
import {
  internals,
  mixinElementInternals,
} from '../../internal/behaviors/element-internals.js';
import {mixinFocusable} from '../../internal/behaviors/focusable.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '../../internal/behaviors/form-associated.js';
import {RadioValidator} from '../../internal/behaviors/validators/radio-validator.js';

import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../../foundations/interaction/states/ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../../foundations/interaction/states/ripple/ripple.cssresult.js'; // google3-only
import radioStyles from './radio.css' with {type: 'css'}; // github-only
// import {styles as radioStyles} from './radio.cssresult.js'; // google3-only

import {clampDensity, type Density} from '../../foundations/layout/density.js';
import {
  FormDisabledController,
  FormScopedSelectionController,
  ToggleFieldController,
} from '../shared/form-field.js';
import {radio} from './radio.js';

// Separate variable needed for closure.
const radioBaseClass = mixinConstraintValidation(
  mixinFormAssociated(mixinElementInternals(mixinFocusable(LitElement))),
);

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
// spec-labels: radio-button/specs, radio-button/guidelines/anatomy, radio-button/guidelines/usage
export class RadioElement extends radioBaseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    radioStyles,
    css`
      :host {
        display: inline-flex;
        outline: none;
      }
      .radio {
        flex: 1;
      }
    `,
  ];

  /**
   * Whether or not the radio is selected.
   */
  @property({type: Boolean})
  get checked() {
    return this[internals].ariaChecked === 'true';
  }
  set checked(checked: boolean) {
    const wasChecked = this.checked;
    if (wasChecked === checked) {
      return;
    }

    this[internals].ariaChecked = String(checked);
    this.requestUpdate('checked', wasChecked);
    this.selectionController.handleCheckedChange();
  }

  /**
   * The default checked state of the radio.
   */
  get defaultChecked(): boolean {
    return this.field.defaultOn;
  }
  set defaultChecked(value: boolean) {
    this.field.defaultOn = value;
  }

  /**
   * Whether or not the radio is required. If any radio is required in a group,
   * all radios are implicitly required.
   */
  @property({type: Boolean}) required = false;

  /**
   * The element value to use in form submission when checked.
   */
  @property() value = 'on';

  /**
   * The density, from 0 (default) to -3. Each step down removes 4px from the
   * radio's layout box (48px) and state layer (40px); the touch target stays
   * 48px. Values are clamped to that range.
   *
   * radio-button.md: don't apply density by default; let people opt in to a
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

  @query('.radio') private readonly radio!: HTMLElement;
  /** The radio group: same `name`, same root and same form. */
  private readonly selectionController = new FormScopedSelectionController(
    this,
  );
  /**
   * Form value, default state, dirty checkedness (the `checked` attribute only
   * updates the state until the radio is interacted with), reset and restore.
   */
  private readonly formDisabled = new FormDisabledController(this);
  private readonly field = new ToggleFieldController(this, {
    attribute: 'checked',
    get: () => this.checked,
    set: (on) => {
      this.checked = on;
    },
  });
  @state() private isFocused = false;

  constructor() {
    super();
    if (isServer) return;
    this[internals].role = 'radio';
    // aria-checked is required on the radio role (axe: aria-required-attr).
    this[internals].ariaChecked = 'false';
    this.addController(this.selectionController);
    setupDispatchHooks(this, 'click', 'keydown');
    this.addEventListener('click', (event) => {
      // Return if disabled, or already checked since clicking on a checked
      // radio does not dispatch events.
      if (this.disabled || this.checked) return;
      afterDispatch(event, () => {
        if (event.defaultPrevented) return;
        // Per spec, clicking on a radio input always selects it.
        this.checked = true;
        this.field.markDirty();
        this.dispatchEvent(new Event('change', {bubbles: true}));
        this.dispatchEvent(
          new InputEvent('input', {bubbles: true, composed: true}),
        );
      });
    });

    this.addEventListener('keydown', (event) => {
      afterDispatch(event, () => {
        if (event.key !== ' ' || event.defaultPrevented) {
          return;
        }

        this.click();
      });
    });

    this.addEventListener('focus', () => {
      this.isFocused = true;
    });

    this.addEventListener('blur', () => {
      this.isFocused = false;
    });
  }

  protected override render() {
    return html`<div
      part="radio"
      class="ripple-host focus-ring-host ${radio({
        checked: this.checked,
        disabled: this.disabled,
        focus: this.isFocused,
        density: this.density,
      })}"></div>`;
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    // The 'checked' attribute does not update radios that have been
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
    return new RadioValidator(() => {
      if (!this.selectionController) {
        // Validation runs on superclass construction, so selection controller
        // might not actually be ready until this class constructs.
        return [this];
      }

      return this.selectionController.controls as [
        RadioElement,
        ...RadioElement[],
      ];
    });
  }

  override [getValidityAnchor]() {
    return this.radio;
  }
}
