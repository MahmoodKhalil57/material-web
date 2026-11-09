/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * A calendar model for the date picker: plain year / month / day values with
 * no time or time zone, and `Intl`-based, locale aware names and formats.
 * Mirrors Compose's `CalendarModel`.
 */
/** A calendar date. `month` is 1-12. */
export interface CalendarDate {
    year: number;
    month: number;
    day: number;
}
/** The order and delimiter of a locale's numeric date format. */
export interface DateInputFormat {
    /** Field order, e.g. `['m', 'd', 'y']` for en-US. */
    order: Array<'y' | 'm' | 'd'>;
    /** The delimiter between fields, e.g. `/`. */
    delimiter: string;
    /** The pattern shown as the format hint, e.g. `MM/DD/YYYY`. */
    pattern: string;
}
/** Days in a week. */
export declare const DAYS_IN_WEEK = 7;
/** Returns the number of days in a month. */
export declare function daysInMonth(year: number, month: number): number;
/** Whether the values form a real calendar date. */
export declare function isValidDate({ year, month, day }: CalendarDate): boolean;
/** Parses a `YYYY-MM-DD` ISO 8601 date. Returns null if it is not one. */
export declare function parseIsoDate(value: string | null | undefined): CalendarDate | null;
/** Formats a date as `YYYY-MM-DD`. */
export declare function toIsoDate({ year, month, day }: CalendarDate): string;
/** Compares two dates: negative if `a` is earlier, 0 if equal. */
export declare function compareDates(a: CalendarDate, b: CalendarDate): number;
/** Whether two dates are the same day. Null never matches. */
export declare function isSameDate(a: CalendarDate | null | undefined, b: CalendarDate | null | undefined): boolean;
/** Adds days (negative to subtract). */
export declare function addDays(date: CalendarDate, days: number): CalendarDate;
/**
 * Adds months (negative to subtract), keeping the day of month where
 * possible and clamping it to the target month's length otherwise.
 */
export declare function addMonths(date: CalendarDate, months: number): CalendarDate;
/** Returns the first day of the date's month. */
export declare function startOfMonth(date: CalendarDate): CalendarDate;
/** Returns the last day of the date's month. */
export declare function endOfMonth(date: CalendarDate): CalendarDate;
/** The day of the week, 0 (Sunday) to 6 (Saturday). */
export declare function dayOfWeek(date: CalendarDate): number;
/** Returns the first day of the date's week. */
export declare function startOfWeek(date: CalendarDate, firstDayOfWeek: number): CalendarDate;
/** Clamps a date between optional bounds. */
export declare function clampDate(date: CalendarDate, min: CalendarDate | null, max: CalendarDate | null): CalendarDate;
/** Returns today's date in the local time zone. */
export declare function today(): CalendarDate;
/** Returns the default locale: the document's `lang`, else the browser's. */
export declare function defaultLocale(): string;
/**
 * Returns the locale's first day of the week, 0 (Sunday) to 6 (Saturday),
 * from `Intl.Locale` week info. Falls back to Sunday.
 */
export declare function getFirstDayOfWeek(locale: string): number;
/** Weekday names, Sunday first. */
export declare function getWeekdayNames(locale: string): Array<{
    long: string;
    narrow: string;
}>;
/** Month names, January first. */
export declare function getMonthNames(locale: string, style?: 'long' | 'short'): string[];
/** Formats a date with `Intl.DateTimeFormat` options. */
export declare function formatDate(date: CalendarDate, locale: string, options: Intl.DateTimeFormatOptions): string;
/** Formats a number (day or year) with the locale's digits. */
export declare function formatNumber(value: number, locale: string): string;
/**
 * Returns the locale's numeric date field order and delimiter, like
 * Compose's `CalendarModel.getDateInputFormat()`.
 */
export declare function getDateInputFormat(locale: string): DateInputFormat;
/** Formats a date for a text field, e.g. `08/17/2025` (ASCII digits). */
export declare function formatInputDate(date: CalendarDate, format: DateInputFormat): string;
/**
 * Parses typed text leniently, as the spec's accessibility guidance asks:
 * any of dashes, spaces, slashes or dots as delimiters, single-digit months
 * and days, an ISO `YYYY-MM-DD` date, or digits only (`08172025`). Returns
 * null if the text isn't a real date.
 */
export declare function parseInputDate(text: string, format: DateInputFormat): CalendarDate | null;
/**
 * Splits typed range text such as `08/17/2025 – 08/23/2025` into its start
 * and end parts. Accepts an en or em dash, or a hyphen surrounded by spaces,
 * or "to" as the separator.
 */
export declare function splitRangeText(text: string): [string, string] | null;
/** The cells of a month grid: the weeks covering the month. */
export interface MonthGrid {
    /** Each week's dates; `outside` marks days of the adjacent months. */
    weeks: Array<Array<{
        date: CalendarDate;
        outside: boolean;
    }>>;
}
/**
 * Lays out a month as weeks starting on `firstDayOfWeek`. With
 * `fixedWeeks`, always returns 6 weeks (Compose `MaxCalendarRows`).
 */
export declare function getMonthGrid(year: number, month: number, firstDayOfWeek: number, fixedWeeks: boolean): MonthGrid;
