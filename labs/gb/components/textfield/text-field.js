/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { createClassMapDirective } from '../shared/directives.js';
import { densityClasses, densityClassNames } from '../shared/density.js';
import { PSEUDO_CLASSES } from '../shared/pseudo-classes.js';
/** Text field CSS classes. */
export const TEXT_FIELD_CLASSES = {
    textField: 'text-field',
    filled: 'text-field-filled',
    outlined: 'text-field-outlined',
    populated: 'text-field-populated',
    error: 'text-field-error',
    hasLabel: 'text-field-has-label',
    hasLeadingIcon: 'text-field-has-leading-icon',
    hasTrailingIcon: 'text-field-has-trailing-icon',
    textarea: 'text-field-textarea',
    noSpinner: 'text-field-no-spinner',
    hover: PSEUDO_CLASSES.hover,
    focus: PSEUDO_CLASSES.focus,
    disabled: PSEUDO_CLASSES.disabled,
    ...densityClassNames('text-field'),
    // Parts.
    container: 'text-field-container',
    content: 'text-field-content',
    inputRow: 'text-field-input-row',
    input: 'text-field-input',
    label: 'text-field-label',
    leadingIcon: 'text-field-leading-icon',
    trailingIcon: 'text-field-trailing-icon',
    prefix: 'text-field-prefix',
    suffix: 'text-field-suffix',
    outline: 'text-field-outline',
    supporting: 'text-field-supporting',
    supportingText: 'text-field-supporting-text',
    counter: 'text-field-counter',
    errorIconFocus: 'text-field-error-icon-focus',
    supportingTextFocus: 'text-field-supporting-text-focus',
};
/**
 * Returns the text field classes to apply to the root element.
 *
 * @param state The state of the text field.
 * @return An object of class names and truthy values if they apply.
 */
export function textFieldClasses({ variant = 'filled', populated = false, error = false, hasLabel = false, hasLeadingIcon = false, hasTrailingIcon = false, textarea = false, noSpinner = false, hover = false, focus = false, disabled = false, density = 0, } = {}) {
    return {
        [TEXT_FIELD_CLASSES.textField]: true,
        [TEXT_FIELD_CLASSES.filled]: variant !== 'outlined',
        [TEXT_FIELD_CLASSES.outlined]: variant === 'outlined',
        [TEXT_FIELD_CLASSES.populated]: populated,
        [TEXT_FIELD_CLASSES.error]: error,
        [TEXT_FIELD_CLASSES.hasLabel]: hasLabel,
        [TEXT_FIELD_CLASSES.hasLeadingIcon]: hasLeadingIcon,
        [TEXT_FIELD_CLASSES.hasTrailingIcon]: hasTrailingIcon,
        [TEXT_FIELD_CLASSES.textarea]: textarea,
        [TEXT_FIELD_CLASSES.noSpinner]: noSpinner,
        [TEXT_FIELD_CLASSES.hover]: hover,
        [TEXT_FIELD_CLASSES.focus]: focus,
        [TEXT_FIELD_CLASSES.disabled]: disabled,
        ...densityClasses(TEXT_FIELD_CLASSES.textField, density),
    };
}
/**
 * Sets up a Light DOM text field: keeps the `populated` class in sync with
 * the value of its `.text-field-input`, and focuses the input when the
 * container is clicked.
 *
 * @param textField The `.text-field` root element.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupTextField(textField, opts) {
    const getInput = () => textField.querySelector(`.${TEXT_FIELD_CLASSES.input}`);
    const sync = () => {
        const input = getInput();
        if (input) {
            textField.classList.toggle(TEXT_FIELD_CLASSES.populated, !!input.value);
        }
    };
    textField.addEventListener('input', sync, opts);
    textField.addEventListener('change', sync, opts);
    textField.addEventListener('click', (event) => {
        const input = getInput();
        const target = event.target;
        if (!input ||
            input.disabled ||
            !target?.closest?.(`.${TEXT_FIELD_CLASSES.container}`) ||
            target.closest(`.${TEXT_FIELD_CLASSES.leadingIcon}, .${TEXT_FIELD_CLASSES.trailingIcon}`)) {
            return;
        }
        if (target !== input) {
            input.focus();
        }
    }, opts);
    sync();
}
/**
 * A Lit directive that adds text field classes and setup logic to the
 * `.text-field` root element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${textField({hasLabel: true})}">
 *     <div class="text-field-container">
 *       <label class="text-field-label" for="name">Name</label>
 *       <div class="text-field-content">
 *         <div class="text-field-input-row">
 *           <input id="name" class="text-field-input" />
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * `;
 * ```
 */
export const textField = createClassMapDirective({
    getClasses: textFieldClasses,
    setupElement: setupTextField,
});
//# sourceMappingURL=text-field.js.map