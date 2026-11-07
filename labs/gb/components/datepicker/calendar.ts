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
export const DAYS_IN_WEEK = 7;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function toUtc({year, month, day}: CalendarDate): Date {
  const date = new Date(Date.UTC(2000, month - 1, day));
  date.setUTCFullYear(year);
  return date;
}

function fromUtc(date: Date): CalendarDate {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

/** Returns the number of days in a month. */
export function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Whether the values form a real calendar date. */
export function isValidDate({year, month, day}: CalendarDate): boolean {
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    year >= 1 &&
    year <= 9999 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month)
  );
}

/** Parses a `YYYY-MM-DD` ISO 8601 date. Returns null if it is not one. */
export function parseIsoDate(value: string | null | undefined): CalendarDate | null {
  const match = ISO_DATE.exec(value?.trim() ?? '');
  if (!match) {
    return null;
  }
  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
  return isValidDate(date) ? date : null;
}

/** Formats a date as `YYYY-MM-DD`. */
export function toIsoDate({year, month, day}: CalendarDate): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Compares two dates: negative if `a` is earlier, 0 if equal. */
export function compareDates(a: CalendarDate, b: CalendarDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day;
}

/** Whether two dates are the same day. Null never matches. */
export function isSameDate(
  a: CalendarDate | null | undefined,
  b: CalendarDate | null | undefined,
): boolean {
  return !!a && !!b && compareDates(a, b) === 0;
}

/** Adds days (negative to subtract). */
export function addDays(date: CalendarDate, days: number): CalendarDate {
  const utc = toUtc(date);
  utc.setUTCDate(utc.getUTCDate() + days);
  return fromUtc(utc);
}

/**
 * Adds months (negative to subtract), keeping the day of month where
 * possible and clamping it to the target month's length otherwise.
 */
export function addMonths(date: CalendarDate, months: number): CalendarDate {
  const index = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return {year, month, day: Math.min(date.day, daysInMonth(year, month))};
}

/** Returns the first day of the date's month. */
export function startOfMonth(date: CalendarDate): CalendarDate {
  return {year: date.year, month: date.month, day: 1};
}

/** Returns the last day of the date's month. */
export function endOfMonth(date: CalendarDate): CalendarDate {
  return {
    year: date.year,
    month: date.month,
    day: daysInMonth(date.year, date.month),
  };
}

/** The day of the week, 0 (Sunday) to 6 (Saturday). */
export function dayOfWeek(date: CalendarDate): number {
  return toUtc(date).getUTCDay();
}

/** Returns the first day of the date's week. */
export function startOfWeek(
  date: CalendarDate,
  firstDayOfWeek: number,
): CalendarDate {
  const offset = (dayOfWeek(date) - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  return addDays(date, -offset);
}

/** Clamps a date between optional bounds. */
export function clampDate(
  date: CalendarDate,
  min: CalendarDate | null,
  max: CalendarDate | null,
): CalendarDate {
  if (min && compareDates(date, min) < 0) return min;
  if (max && compareDates(date, max) > 0) return max;
  return date;
}

/** Returns today's date in the local time zone. */
export function today(): CalendarDate {
  const now = new Date();
  return {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
}

/** Returns the default locale: the document's `lang`, else the browser's. */
export function defaultLocale(): string {
  const lang =
    typeof document !== 'undefined' ? document.documentElement.lang : '';
  return lang || (typeof navigator !== 'undefined' ? navigator.language : '') || 'en-US';
}

function safeLocale(locale: string): string {
  try {
    return Intl.getCanonicalLocales(locale)[0] ?? 'en-US';
  } catch {
    return 'en-US';
  }
}

interface WeekInfo {
  firstDay: number;
}

/**
 * Returns the locale's first day of the week, 0 (Sunday) to 6 (Saturday),
 * from `Intl.Locale` week info. Falls back to Sunday.
 */
export function getFirstDayOfWeek(locale: string): number {
  try {
    const intlLocale = new Intl.Locale(safeLocale(locale)) as Intl.Locale & {
      getWeekInfo?: () => WeekInfo;
      weekInfo?: WeekInfo;
    };
    const info = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
    if (info?.firstDay) {
      // Intl uses 1 (Monday) to 7 (Sunday).
      return info.firstDay % 7;
    }
  } catch {
    // Unsupported; fall through.
  }
  return 0;
}

/** Weekday names, Sunday first. */
export function getWeekdayNames(
  locale: string,
): Array<{long: string; narrow: string}> {
  const loc = safeLocale(locale);
  const long = new Intl.DateTimeFormat(loc, {weekday: 'long', timeZone: 'UTC'});
  const narrow = new Intl.DateTimeFormat(loc, {
    weekday: 'narrow',
    timeZone: 'UTC',
  });
  const names = [];
  // 2023-01-01 was a Sunday.
  for (let i = 0; i < DAYS_IN_WEEK; i++) {
    const date = new Date(Date.UTC(2023, 0, 1 + i));
    names.push({long: long.format(date), narrow: narrow.format(date)});
  }
  return names;
}

/** Month names, January first. */
export function getMonthNames(
  locale: string,
  style: 'long' | 'short' = 'long',
): string[] {
  const format = new Intl.DateTimeFormat(safeLocale(locale), {
    month: style,
    timeZone: 'UTC',
  });
  const names = [];
  for (let i = 0; i < 12; i++) {
    names.push(format.format(new Date(Date.UTC(2023, i, 1))));
  }
  return names;
}

const dateFormats = new Map<string, Intl.DateTimeFormat>();
const numberFormats = new Map<string, Intl.NumberFormat>();

/** Formats a date with `Intl.DateTimeFormat` options. */
export function formatDate(
  date: CalendarDate,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const key = `${locale}|${JSON.stringify(options)}`;
  let format = dateFormats.get(key);
  if (!format) {
    format = new Intl.DateTimeFormat(safeLocale(locale), {
      ...options,
      timeZone: 'UTC',
    });
    dateFormats.set(key, format);
  }
  return format.format(toUtc(date));
}

/** Formats a number (day or year) with the locale's digits. */
export function formatNumber(value: number, locale: string): string {
  let format = numberFormats.get(locale);
  if (!format) {
    format = new Intl.NumberFormat(safeLocale(locale), {useGrouping: false});
    numberFormats.set(locale, format);
  }
  return format.format(value);
}

/**
 * Returns the locale's numeric date field order and delimiter, like
 * Compose's `CalendarModel.getDateInputFormat()`.
 */
export function getDateInputFormat(locale: string): DateInputFormat {
  const parts = new Intl.DateTimeFormat(safeLocale(locale), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).formatToParts(new Date(Date.UTC(2023, 11, 31)));
  const order: Array<'y' | 'm' | 'd'> = [];
  let delimiter = '';
  for (const part of parts) {
    if (part.type === 'year') order.push('y');
    else if (part.type === 'month') order.push('m');
    else if (part.type === 'day') order.push('d');
    else if (part.type === 'literal' && !delimiter && order.length) {
      delimiter = part.value.trim();
    }
  }
  if (order.length !== 3) {
    order.splice(0, order.length, 'm', 'd', 'y');
  }
  delimiter ||= '/';
  const letters = {y: 'YYYY', m: 'MM', d: 'DD'};
  return {
    order,
    delimiter,
    pattern: order.map((field) => letters[field]).join(delimiter),
  };
}

/** Formats a date for a text field, e.g. `08/17/2025` (ASCII digits). */
export function formatInputDate(
  date: CalendarDate,
  format: DateInputFormat,
): string {
  const fields = {
    y: String(date.year).padStart(4, '0'),
    m: String(date.month).padStart(2, '0'),
    d: String(date.day).padStart(2, '0'),
  };
  return format.order.map((field) => fields[field]).join(format.delimiter);
}

/**
 * Parses typed text leniently, as the spec's accessibility guidance asks:
 * any of dashes, spaces, slashes or dots as delimiters, single-digit months
 * and days, an ISO `YYYY-MM-DD` date, or digits only (`08172025`). Returns
 * null if the text isn't a real date.
 */
export function parseInputDate(
  text: string,
  format: DateInputFormat,
): CalendarDate | null {
  const value = text.trim();
  if (!value) {
    return null;
  }
  const iso = parseIsoDate(value);
  if (iso) {
    return iso;
  }
  let fields = value.split(/[^0-9]+/).filter(Boolean);
  if (fields.length === 1 && fields[0].length === 8) {
    const digits = fields[0];
    const lengths = {y: 4, m: 2, d: 2};
    fields = [];
    let index = 0;
    for (const field of format.order) {
      fields.push(digits.slice(index, index + lengths[field]));
      index += lengths[field];
    }
  }
  if (fields.length !== 3) {
    return null;
  }
  const result: Partial<Record<'y' | 'm' | 'd', number>> = {};
  for (let i = 0; i < 3; i++) {
    const field = format.order[i];
    const digits = fields[i];
    if (field === 'y' ? digits.length !== 4 : digits.length > 2) {
      return null;
    }
    result[field] = Number(digits);
  }
  const date = {year: result.y!, month: result.m!, day: result.d!};
  return isValidDate(date) ? date : null;
}

/**
 * Splits typed range text such as `08/17/2025 – 08/23/2025` into its start
 * and end parts. Accepts an en or em dash, or a hyphen surrounded by spaces,
 * or "to" as the separator.
 */
export function splitRangeText(text: string): [string, string] | null {
  const parts = text.split(/\s*[–—]\s*|\s+-\s+|\s+to\s+/i);
  if (parts.length !== 2) {
    return null;
  }
  return [parts[0], parts[1]];
}

/** The cells of a month grid: the weeks covering the month. */
export interface MonthGrid {
  /** Each week's dates; `outside` marks days of the adjacent months. */
  weeks: Array<Array<{date: CalendarDate; outside: boolean}>>;
}

/**
 * Lays out a month as weeks starting on `firstDayOfWeek`. With
 * `fixedWeeks`, always returns 6 weeks (Compose `MaxCalendarRows`).
 */
export function getMonthGrid(
  year: number,
  month: number,
  firstDayOfWeek: number,
  fixedWeeks: boolean,
): MonthGrid {
  const first = {year, month, day: 1};
  const leading =
    (dayOfWeek(first) - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const total = leading + daysInMonth(year, month);
  const weekCount = fixedWeeks ? 6 : Math.ceil(total / DAYS_IN_WEEK);
  const weeks: MonthGrid['weeks'] = [];
  let date = addDays(first, -leading);
  for (let w = 0; w < weekCount; w++) {
    const week = [];
    for (let d = 0; d < DAYS_IN_WEEK; d++) {
      week.push({date, outside: date.month !== month});
      date = addDays(date, 1);
    }
    weeks.push(week);
  }
  return {weeks};
}
