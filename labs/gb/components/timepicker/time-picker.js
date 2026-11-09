/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { densityClasses, densityClassNames } from '../shared/density.js';
import { createClassMapDirective } from '../shared/directives.js';
/** Time picker display modes: a clock dial or hour and minute text fields. */
export const TIME_PICKER_MODES = {
    dial: 'dial',
    input: 'input',
};
/** Time picker dial layouts. */
export const TIME_PICKER_ORIENTATIONS = {
    vertical: 'vertical',
    horizontal: 'horizontal',
};
/** Time picker CSS classes. */
export const TIME_PICKER_CLASSES = {
    timePicker: 'time-picker',
    input: 'time-picker-input',
    horizontal: 'time-picker-horizontal',
    hour24: 'time-picker-24h',
    closing: 'time-picker-closing',
    ...densityClassNames('time-picker'),
};
/**
 * Returns the class map object for the time picker container.
 */
export function timePickerClasses({ mode = TIME_PICKER_MODES.dial, orientation = TIME_PICKER_ORIENTATIONS.vertical, hour24 = false, closing = false, density = 0, } = {}) {
    return {
        [TIME_PICKER_CLASSES.timePicker]: true,
        [TIME_PICKER_CLASSES.input]: mode === TIME_PICKER_MODES.input,
        [TIME_PICKER_CLASSES.horizontal]: orientation === TIME_PICKER_ORIENTATIONS.horizontal,
        [TIME_PICKER_CLASSES.hour24]: hour24,
        [TIME_PICKER_CLASSES.closing]: closing,
        ...densityClasses(TIME_PICKER_CLASSES.timePicker, density),
    };
}
/**
 * A Lit directive that adds time picker container classes to an element.
 */
export const timePicker = createClassMapDirective({
    getClasses: timePickerClasses,
});
/**
 * Parses an `HH:MM` (or `HH:MM:SS`) 24-hour time string, like an
 * `<input type="time">` value. Returns null when it is not a valid time.
 */
export function parseTime(value) {
    const match = /^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/.exec((value ?? '').trim());
    if (!match) {
        return null;
    }
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour > 23 || minute > 59) {
        return null;
    }
    return { hour, minute };
}
/** Formats a time as a 24-hour `HH:MM` string. */
export function formatTime({ hour, minute }) {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
/** The hour shown on a 12-hour clock (1-12) for a 0-23 hour. */
export function displayHour12(hour) {
    return hour % 12 || 12;
}
/**
 * Whether the locale formats times with a 24-hour clock, from `Intl`.
 *
 * @param locale A BCP 47 locale; the browser default when empty.
 */
export function localeUses24Hour(locale) {
    try {
        const { hourCycle, hour12 } = new Intl.DateTimeFormat(locale || undefined, {
            hour: 'numeric',
        }).resolvedOptions();
        if (hourCycle) {
            return hourCycle === 'h23' || hourCycle === 'h24';
        }
        return hour12 === false;
    }
    catch {
        return false;
    }
}
/**
 * The locale's AM and PM labels, from `Intl`.
 *
 * @param locale A BCP 47 locale; the browser default when empty.
 */
export function localePeriodLabels(locale) {
    const label = (hour, fallback) => {
        try {
            const parts = new Intl.DateTimeFormat(locale || undefined, {
                hour: 'numeric',
                hourCycle: 'h12',
                timeZone: 'UTC',
            }).formatToParts(new Date(Date.UTC(2000, 0, 1, hour)));
            return parts.find((part) => part.type === 'dayPeriod')?.value || fallback;
        }
        catch {
            return fallback;
        }
    };
    return [label(9, 'AM'), label(21, 'PM')];
}
/**
 * The dial angle in degrees, clockwise from 12 o'clock, of a pointer position
 * relative to the dial center.
 */
export function pointToAngle(dx, dy) {
    const degrees = (Math.atan2(dx, -dy) * 180) / Math.PI;
    return degrees < 0 ? degrees + 360 : degrees;
}
/**
 * The hour (0-11) or minute (0-59) under a dial angle, rounded to the
 * nearest `step`.
 */
export function angleToValue(angle, selection, step = 1) {
    const count = selection === 'hour' ? 12 : 60;
    const perUnit = 360 / count;
    const value = Math.round(angle / perUnit / step) * step;
    return ((value % count) + count) % count;
}
/**
 * The dial angle in degrees of a 0-23 hour or 0-59 minute.
 */
export function valueToAngle(value, selection) {
    return selection === 'hour' ? (value % 12) * 30 : value * 6;
}
/**
 * The angle closest to `from` that points the same way as `to`, so the
 * selector turns the short way round the dial (Compose
 * `endValueForAnimation`).
 */
export function nearestAngle(from, to) {
    let diff = (to - from) % 360;
    if (diff > 180)
        diff -= 360;
    if (diff <= -180)
        diff += 360;
    return from + diff;
}
//# sourceMappingURL=time-picker.js.map