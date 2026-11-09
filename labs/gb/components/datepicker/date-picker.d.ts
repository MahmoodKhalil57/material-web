/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
import { type CalendarDate } from './calendar.js';
/** Date picker variants. */
export type DatePickerVariant = 'docked' | 'modal';
/** Date picker variant values. */
export declare const DATE_PICKER_VARIANTS: {
    readonly docked: "docked";
    readonly modal: "modal";
};
/** Modal date picker display modes: the calendar or text input. */
export type DatePickerMode = 'picker' | 'input';
/** Reasons a date picker closes. */
export declare const DATE_PICKER_CLOSE_REASONS: {
    readonly CONFIRM: "confirm";
    readonly CANCEL: "cancel";
};
/** Date picker CSS classes. */
export declare const DATE_PICKER_CLASSES: {
    readonly datePicker: "date-picker";
    readonly modal: "date-picker-modal";
    readonly input: "date-picker-input";
    readonly range: "date-picker-range";
    readonly open: "date-picker-open";
    readonly closing: "date-picker-closing";
    readonly inline: "date-picker-inline";
    readonly scrolling: "date-picker-scrolling";
    readonly fullscreen: "date-picker-fullscreen";
    readonly day: "date-picker-day";
    readonly daySelected: "date-picker-day-selected";
    readonly dayToday: "date-picker-day-today";
    readonly dayOutside: "date-picker-day-outside";
    readonly dayDisabled: "date-picker-day-disabled";
    readonly dayInRange: "date-picker-day-in-range";
    readonly dayRangeStart: "date-picker-day-range-start";
    readonly dayRangeEnd: "date-picker-day-range-end";
};
/** State provided to `datePickerClasses()`. */
export interface DatePickerClassesState {
    /** The `modal` variant (otherwise docked). */
    modal?: boolean;
    /** The modal date input (text entry) mode. */
    input?: boolean;
    /** Range selection. */
    range?: boolean;
    /** Whether the popup is open. */
    open?: boolean;
    /** Whether the popup is animating closed. */
    closing?: boolean;
    /** Rendered in the page flow instead of a popup or dialog. */
    inline?: boolean;
    /**
     * Modal range selection: a vertically scrolling list of months instead of
     * one month with arrows.
     */
    scrolling?: boolean;
    /** The modal full-screen layout (close icon button and Save). */
    fullscreen?: boolean;
}
/** Returns the class map for the date picker container. */
export declare function datePickerClasses({ modal, input, range, open, closing, inline, scrolling, fullscreen, }?: DatePickerClassesState): ClassInfo;
/** State provided to `datePickerDayClasses()`. */
export interface DatePickerDayClassesState {
    selected?: boolean;
    today?: boolean;
    outside?: boolean;
    disabled?: boolean;
    /** Between the range start and end (inclusive) of a complete range. */
    inRange?: boolean;
    rangeStart?: boolean;
    rangeEnd?: boolean;
}
/** Returns the class map for a date cell's visual (`.date-picker-day`). */
export declare function datePickerDayClasses({ selected, today, outside, disabled, inRange, rangeStart, rangeEnd, }?: DatePickerDayClassesState): ClassInfo;
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
export declare function getKeyboardTargetDate(event: Pick<KeyboardEvent, 'key' | 'shiftKey'>, date: CalendarDate, { rtl }?: {
    rtl?: boolean;
}): CalendarDate | null;
/**
 * Sets up the date picker container: Escape inside a Light DOM date picker
 * dispatches a cancelable `cancel` event.
 *
 * @param element The date picker container.
 * @param opts Options, supports an AbortSignal for cleanup.
 */
export declare function setupDatePicker(element: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds the date picker container classes and setup.
 */
export declare const datePicker: (state?: DatePickerClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/**
 * A Lit directive that adds the date cell classes.
 */
export declare const datePickerDay: (state?: DatePickerDayClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
