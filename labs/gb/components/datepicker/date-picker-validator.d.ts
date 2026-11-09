/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Validator } from '../../../behaviors/validators/validator.js';
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
export declare class DatePickerValidator extends Validator<DatePickerState> {
    private control?;
    protected computeValidity({ required, complete }: DatePickerState): {
        validity: ValidityState;
        validationMessage: string;
    };
    protected equals(prev: DatePickerState, next: DatePickerState): boolean;
    protected copy({ required, complete }: DatePickerState): {
        required: boolean;
        complete: boolean;
    };
}
