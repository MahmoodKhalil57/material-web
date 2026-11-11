/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Validator} from '../../internal/behaviors/validators/validator.js';

/** Constraint validation properties for a date picker. */
export interface DatePickerState {
  /** Whether a value is required. */
  readonly required: boolean;
  /**
   * Whether the committed value is complete: a date, or a range with both a
   * start and an end date.
   */
  readonly complete: boolean;
}

/**
 * A validator for the date picker's `required` constraint: a required picker
 * with no date (or an incomplete range) is `valueMissing`. The message comes
 * from a platform `<input required>`, so it is localized by the browser.
 */
export class DatePickerValidator extends Validator<DatePickerState> {
  private control?: HTMLInputElement;

  protected override computeValidity({required, complete}: DatePickerState) {
    if (!this.control) {
      this.control = document.createElement('input');
    }
    this.control.required = required;
    this.control.value = complete ? 'x' : '';
    return {
      validity: this.control.validity,
      validationMessage: this.control.validationMessage,
    };
  }

  protected override equals(prev: DatePickerState, next: DatePickerState) {
    return prev.required === next.required && prev.complete === next.complete;
  }

  protected override copy({required, complete}: DatePickerState) {
    return {required, complete};
  }
}
