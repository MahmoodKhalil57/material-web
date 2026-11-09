/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { createClassMapDirective } from '../shared/directives.js';
import { rippleClasses } from '../ripple/ripple.js';
import { addDays, addMonths, DAYS_IN_WEEK, endOfMonth, startOfMonth, } from './calendar.js';
/** Date picker variant values. */
export const DATE_PICKER_VARIANTS = {
    docked: 'docked',
    modal: 'modal',
};
/** Reasons a date picker closes. */
export const DATE_PICKER_CLOSE_REASONS = {
    CONFIRM: 'confirm',
    CANCEL: 'cancel',
};
/** Date picker CSS classes. */
export const DATE_PICKER_CLASSES = {
    datePicker: 'date-picker',
    modal: 'date-picker-modal',
    input: 'date-picker-input',
    range: 'date-picker-range',
    open: 'date-picker-open',
    closing: 'date-picker-closing',
    inline: 'date-picker-inline',
    scrolling: 'date-picker-scrolling',
    fullscreen: 'date-picker-fullscreen',
    day: 'date-picker-day',
    daySelected: 'date-picker-day-selected',
    dayToday: 'date-picker-day-today',
    dayOutside: 'date-picker-day-outside',
    dayDisabled: 'date-picker-day-disabled',
    dayInRange: 'date-picker-day-in-range',
    dayRangeStart: 'date-picker-day-range-start',
    dayRangeEnd: 'date-picker-day-range-end',
};
/** Returns the class map for the date picker container. */
export function datePickerClasses({ modal = false, input = false, range = false, open = false, closing = false, inline = false, scrolling = false, fullscreen = false, } = {}) {
    return {
        [DATE_PICKER_CLASSES.datePicker]: true,
        [DATE_PICKER_CLASSES.modal]: modal,
        [DATE_PICKER_CLASSES.input]: modal && input,
        [DATE_PICKER_CLASSES.range]: range,
        [DATE_PICKER_CLASSES.open]: open,
        [DATE_PICKER_CLASSES.closing]: closing,
        [DATE_PICKER_CLASSES.inline]: inline,
        [DATE_PICKER_CLASSES.scrolling]: scrolling,
        [DATE_PICKER_CLASSES.fullscreen]: fullscreen,
    };
}
/** Returns the class map for a date cell's visual (`.date-picker-day`). */
export function datePickerDayClasses({ selected = false, today = false, outside = false, disabled = false, inRange = false, rangeStart = false, rangeEnd = false, } = {}) {
    return {
        ...rippleClasses({ disabled }),
        [DATE_PICKER_CLASSES.day]: true,
        [DATE_PICKER_CLASSES.daySelected]: selected,
        [DATE_PICKER_CLASSES.dayToday]: today,
        [DATE_PICKER_CLASSES.dayOutside]: outside,
        [DATE_PICKER_CLASSES.dayDisabled]: disabled,
        [DATE_PICKER_CLASSES.dayInRange]: inRange,
        [DATE_PICKER_CLASSES.dayRangeStart]: rangeStart,
        [DATE_PICKER_CLASSES.dayRangeEnd]: rangeEnd,
    };
}
/**
 * Returns the date a calendar grid key press moves focus to, or null if the
 * key isn't a grid navigation key. Follows the M3 spec's keyboard table and
 * the WAI-ARIA date picker dialog pattern:
 *
 * - Left / Right: previous / next day (mirrored in RTL).
 * - Up / Down: same day of the previous / next week.
 * - Home / End: first / last day of the month (spec).
 * - Page Up / Page Down: same day of the previous / next month.
 * - Shift + Page Up / Page Down: same day of the previous / next year.
 */
export function getKeyboardTargetDate(event, date, { rtl = false } = {}) {
    const forward = rtl ? -1 : 1;
    switch (event.key) {
        case 'ArrowLeft':
            return addDays(date, -forward);
        case 'ArrowRight':
            return addDays(date, forward);
        case 'ArrowUp':
            return addDays(date, -DAYS_IN_WEEK);
        case 'ArrowDown':
            return addDays(date, DAYS_IN_WEEK);
        case 'Home':
            return startOfMonth(date);
        case 'End':
            return endOfMonth(date);
        case 'PageUp':
            return addMonths(date, event.shiftKey ? -12 : -1);
        case 'PageDown':
            return addMonths(date, event.shiftKey ? 12 : 1);
        default:
            return null;
    }
}
/**
 * Sets up the date picker container: Escape inside a Light DOM date picker
 * dispatches a cancelable `cancel` event.
 *
 * @param element The date picker container.
 * @param opts Options, supports an AbortSignal for cleanup.
 */
export function setupDatePicker(element, opts) {
    element.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || event.defaultPrevented) {
            return;
        }
        element.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true }));
    }, opts);
}
/**
 * A Lit directive that adds the date picker container classes and setup.
 */
export const datePicker = createClassMapDirective({
    getClasses: datePickerClasses,
    setupElement: setupDatePicker,
});
/**
 * A Lit directive that adds the date cell classes.
 */
export const datePickerDay = createClassMapDirective({
    getClasses: datePickerDayClasses,
});
//# sourceMappingURL=date-picker.js.map