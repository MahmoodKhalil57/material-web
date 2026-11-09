/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Validator } from '../../../behaviors/validators/validator.js';
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
export declare class TimePickerValidator extends Validator<TimePickerState> {
    private control?;
    protected computeValidity({ required, hasValue }: TimePickerState): {
        validity: ValidityState;
        validationMessage: string;
    };
    protected equals(prev: TimePickerState, next: TimePickerState): boolean;
    protected copy({ required, hasValue }: TimePickerState): {
        required: boolean;
        hasValue: boolean;
    };
}
