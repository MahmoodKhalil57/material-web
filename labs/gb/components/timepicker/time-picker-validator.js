/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Validator } from '../../../behaviors/validators/validator.js';
/**
 * A validator for the time picker's `required` constraint: a required picker
 * with no time is `valueMissing`. The message comes from a platform
 * `<input required>`, so the browser localizes it.
 */
export class TimePickerValidator extends Validator {
    computeValidity({ required, hasValue }) {
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
    equals(prev, next) {
        return prev.required === next.required && prev.hasValue === next.hasValue;
    }
    copy({ required, hasValue }) {
        return { required, hasValue };
    }
}
//# sourceMappingURL=time-picker-validator.js.map