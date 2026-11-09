/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Validator } from '../../../behaviors/validators/validator.js';
/**
 * A validator for the date picker's `required` constraint: a required picker
 * with no date (or an incomplete range) is `valueMissing`. The message comes
 * from a platform `<input required>`, so it is localized by the browser.
 */
export class DatePickerValidator extends Validator {
    computeValidity({ required, complete }) {
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
    equals(prev, next) {
        return prev.required === next.required && prev.complete === next.complete;
    }
    copy({ required, complete }) {
        return { required, complete };
    }
}
//# sourceMappingURL=date-picker-validator.js.map