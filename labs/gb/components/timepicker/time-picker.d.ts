/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Time picker display modes: a clock dial or hour and minute text fields. */
export declare const TIME_PICKER_MODES: {
    readonly dial: "dial";
    readonly input: "input";
};
/** Time picker display mode. */
export type TimePickerMode = (typeof TIME_PICKER_MODES)[keyof typeof TIME_PICKER_MODES];
/** Time picker dial layouts. */
export declare const TIME_PICKER_ORIENTATIONS: {
    readonly vertical: "vertical";
    readonly horizontal: "horizontal";
};
/** Time picker dial layout. */
export type TimePickerOrientation = (typeof TIME_PICKER_ORIENTATIONS)[keyof typeof TIME_PICKER_ORIENTATIONS];
/** Which part of the time the dial edits. */
export type TimePickerSelection = 'hour' | 'minute';
/** Time picker CSS classes. */
export declare const TIME_PICKER_CLASSES: {
    readonly density1: `${string}-density-1`;
    readonly density2: `${string}-density-2`;
    readonly density3: `${string}-density-3`;
    readonly timePicker: "time-picker";
    readonly input: "time-picker-input";
    readonly horizontal: "time-picker-horizontal";
    readonly hour24: "time-picker-24h";
    readonly closing: "time-picker-closing";
};
/** State provided to `timePickerClasses()`. */
export interface TimePickerClassesState {
    /** The display mode. Defaults to `dial`. */
    mode?: TimePickerMode;
    /** The dial layout. Defaults to `vertical`. */
    orientation?: TimePickerOrientation;
    /** Whether the picker uses a 24-hour clock (no period selector). */
    hour24?: boolean;
    /** Whether a modal picker is playing its exit transition. */
    closing?: boolean;
    /** The density, 0 (default) to -3 (time-pickers.md "Density"). */
    density?: number;
}
/**
 * Returns the class map object for the time picker container.
 */
export declare function timePickerClasses({ mode, orientation, hour24, closing, density, }?: TimePickerClassesState): ClassInfo;
/**
 * A Lit directive that adds time picker container classes to an element.
 */
export declare const timePicker: (state?: TimePickerClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/** A time of day. */
export interface TimeOfDay {
    /** 0-23. */
    hour: number;
    /** 0-59. */
    minute: number;
}
/**
 * Parses an `HH:MM` (or `HH:MM:SS`) 24-hour time string, like an
 * `<input type="time">` value. Returns null when it is not a valid time.
 */
export declare function parseTime(value: string | null | undefined): TimeOfDay | null;
/** Formats a time as a 24-hour `HH:MM` string. */
export declare function formatTime({ hour, minute }: TimeOfDay): string;
/** The hour shown on a 12-hour clock (1-12) for a 0-23 hour. */
export declare function displayHour12(hour: number): number;
/**
 * Whether the locale formats times with a 24-hour clock, from `Intl`.
 *
 * @param locale A BCP 47 locale; the browser default when empty.
 */
export declare function localeUses24Hour(locale?: string): boolean;
/**
 * The locale's AM and PM labels, from `Intl`.
 *
 * @param locale A BCP 47 locale; the browser default when empty.
 */
export declare function localePeriodLabels(locale?: string): [string, string];
/**
 * The dial angle in degrees, clockwise from 12 o'clock, of a pointer position
 * relative to the dial center.
 */
export declare function pointToAngle(dx: number, dy: number): number;
/**
 * The hour (0-11) or minute (0-59) under a dial angle, rounded to the
 * nearest `step`.
 */
export declare function angleToValue(angle: number, selection: TimePickerSelection, step?: number): number;
/**
 * The dial angle in degrees of a 0-23 hour or 0-59 minute.
 */
export declare function valueToAngle(value: number, selection: TimePickerSelection): number;
/**
 * The angle closest to `from` that points the same way as `to`, so the
 * selector turns the short way round the dial (Compose
 * `endValueForAnimation`).
 */
export declare function nearestAngle(from: number, to: number): number;
