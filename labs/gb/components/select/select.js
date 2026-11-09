/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { menuItemClasses, setupMenuItem, } from '../menu/menu.js';
import { createClassMapDirective } from '../shared/directives.js';
import { PSEUDO_CLASSES } from '../shared/pseudo-classes.js';
import { setupTextField, textFieldClasses, } from '../textfield/text-field.js';
/** Select CSS classes, added to the text field classes. */
export const SELECT_CLASSES = {
    select: 'select',
    autocomplete: 'autocomplete',
    open: 'select-open',
    // Parts.
    value: 'select-value',
    arrow: 'select-arrow',
    menu: 'select-menu',
};
/**
 * Returns the classes of a select's (or autocomplete's) root element: the
 * text field classes plus the select classes. A select always has a trailing
 * icon, the dropdown arrow.
 *
 * @param state The state of the select.
 * @return An object of class names and truthy values if they apply.
 */
export function selectClasses({ open = false, autocomplete = false, ...textField } = {}) {
    return {
        ...textFieldClasses({ ...textField, hasTrailingIcon: true }),
        [SELECT_CLASSES.select]: true,
        [SELECT_CLASSES.autocomplete]: autocomplete,
        [SELECT_CLASSES.open]: open,
    };
}
/**
 * Sets up a Light DOM select: the text field behavior (clicking the
 * container focuses the field). Opening the menu and selection are left to
 * the page; use `md-gb-select` for the full behavior.
 *
 * @param select The `.select` root element.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupSelect(select, opts) {
    setupTextField(select, opts);
}
/**
 * A Lit directive that adds select classes and setup logic to the `.select`
 * root element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${select({hasLabel: true, populated: true})}">
 *     <div class="text-field-container">
 *       <span class="text-field-label" id="label">Fruit</span>
 *       <div class="text-field-content">
 *         <div class="text-field-input-row">
 *           <div class="text-field-input select-value" role="combobox"
 *               tabindex="0" aria-labelledby="label">Apple</div>
 *         </div>
 *       </div>
 *       <span class="text-field-trailing-icon select-arrow">...</span>
 *     </div>
 *   </div>
 * `;
 * ```
 */
export const select = createClassMapDirective({
    getClasses: selectClasses,
    setupElement: setupSelect,
});
/**
 * Whether an option's text matches a filter query.
 *
 * @param text The option's text.
 * @param query The typed text.
 * @param filter The filter mode.
 * @return True if the option should be shown.
 */
export function matchesFilter(text, query, filter) {
    if (filter === 'none' || !query)
        return true;
    const haystack = text.trim().toLocaleLowerCase();
    const needle = query.trim().toLocaleLowerCase();
    return filter === 'starts-with'
        ? haystack.startsWith(needle)
        : haystack.includes(needle);
}
/**
 * Returns the classes of a select option: a menu item that shows its
 * selection as checked and its active state as keyboard focus.
 *
 * @param state The state of the option.
 * @return An object of class names and truthy values if they apply.
 */
export function selectOptionClasses({ selected = false, active = false, ...menuItem } = {}) {
    return {
        ...menuItemClasses({ ...menuItem, checked: selected, focus: active }),
        [PSEUDO_CLASSES.focusVisible]: active,
    };
}
/**
 * A Lit directive that adds select option (menu item) styling and ripple
 * to its element.
 */
export const selectOption = createClassMapDirective({
    getClasses: selectOptionClasses,
    setupElement: setupMenuItem,
});
//# sourceMappingURL=select.js.map