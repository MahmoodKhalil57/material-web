/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Validator} from '../../../behaviors/validators/validator.js';

/** Constraint validation properties for a time picker. */
export interface TimePickerState {
  /** Whether a value is required. */
  readonly required: boolean;
  /** Whether a time is committed. */
  readonly hasValue: boolean;
}

/**
 * A validator for the time picker's `required` constraint: a required picker
 * with no time is `valueMissing`. The message comes from a platform
 * `<input required>`, so the browser localizes it.
 */
export class TimePickerValidator extends Validator<TimePickerState> {
  private control?: HTMLInputElement;

  protected override computeValidity({required, hasValue}: TimePickerState) {
    if (!this.control) {
      this.control = document.createElement('input');
    }
    this.control.required = required;
    this.control.value = hasValue ? 'x' : '';
    return {
      validity: this.control.validity,
      validationMessage: this.control.validationMessage,
    };
  }

  protected override equals(prev: TimePickerState, next: TimePickerState) {
    return prev.required === next.required && prev.hasValue === next.hasValue;
  }

  protected override copy({required, hasValue}: TimePickerState) {
    return {required, hasValue};
  }
}
