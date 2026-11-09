/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import '../textfield/md-gb-text-field.js';
import '../tooltip/md-gb-tooltip.js';
import { css, html, isServer, LitElement, nothing, } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { keyed } from 'lit/directives/keyed.js';
import { repeat } from 'lit/directives/repeat.js';
import { live } from 'lit/directives/live.js';
import { styleMap } from 'lit/directives/style-map.js';
import { createValidator, getValidityAnchor, mixinConstraintValidation, } from '../../../behaviors/constraint-validation.js';
import { mixinElementInternals } from '../../../behaviors/element-internals.js';
import { getFormValue, mixinFormAssociated, } from '../../../behaviors/form-associated.js';
import { mixinOnReportValidity, onReportValidity, } from '../../../behaviors/on-report-validity.js';
import { button } from '../button/button.js';
import { divider } from '../divider/divider.js';
import { iconButton } from '../iconbutton/icon-button.js';
import { ripple } from '../ripple/ripple.js';
import { AnchoredOverlayController, composedContains, } from '../shared/anchored-overlay.js';
import { AnnouncerController } from '../shared/announcer.js';
import { clampDensity } from '../shared/density.js';
import { FormDisabledController, ValueFieldController, } from '../shared/form-field.js';
import { ModalSurfaceController } from '../shared/modal-surface.js';
import { isReducedMotion, waitForMotion } from '../shared/motion.js';
import { addMonths, clampDate, compareDates, daysInMonth, defaultLocale, formatDate, formatInputDate, formatNumber, getDateInputFormat, getFirstDayOfWeek, getMonthGrid, getMonthNames, getWeekdayNames, isSameDate, parseInputDate, parseIsoDate, splitRangeText, toIsoDate, today, } from './calendar.js';
import { DATE_PICKER_CLOSE_REASONS, datePickerClasses, datePickerDayClasses, getKeyboardTargetDate, } from './date-picker.js';
import { DatePickerValidator } from './date-picker-validator.js';
import buttonStyles from '../button/button.css.js'; // github-only
// import buttonStyles from '../button/button.cssresult.js'; // google3-only
import dividerStyles from '../divider/divider.css.js'; // github-only
// import dividerStyles from '../divider/divider.cssresult.js'; // google3-only
import focusRingStyles from '../focus/focus-ring.css.js'; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import iconButtonStyles from '../iconbutton/icon-button.css.js'; // github-only
// import iconButtonStyles from '../iconbutton/icon-button.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css.js'; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import datePickerStyles from './date-picker.css.js'; // github-only
/** Default (English) strings, from Compose Material 3. */
export const DEFAULT_DATE_PICKER_STRINGS = {
    title: 'Select date',
    rangeTitle: 'Select dates',
    rangeInputTitle: 'Enter dates',
    headline: 'Selected date',
    inputHeadline: 'Entered date',
    startDate: 'Start date',
    endDate: 'End date',
    dateLabel: 'Date',
    rangeLabel: 'Dates',
    confirm: 'OK',
    cancel: 'Cancel',
    clear: 'Clear',
    close: 'Close',
    save: 'Save',
    today: 'Today',
    inRange: 'In range',
    previousMonth: 'Change to previous month',
    nextMonth: 'Change to next month',
    previousYear: 'Change to previous year',
    nextYear: 'Change to next year',
    selectMonth: 'Select month',
    selectYear: 'Select year',
    switchToYearSelection: 'Switch to selecting a year',
    switchToDaySelection: 'Switch to selecting a day',
    switchToInput: 'Switch to text input mode',
    switchToCalendar: 'Switch to calendar input mode',
    openCalendar: 'Choose date',
    monthList: 'Month',
    yearList: 'Year',
    invalidPattern: 'Date does not match expected pattern: {0}',
    yearOutOfRange: 'Date out of expected year range {0} - {1}',
    notAllowed: 'Date not allowed: {0}',
    invalidRange: 'Invalid date range input',
    // Spec accessibility: "providing the shortcut key in the tooltip"
    // (keyboard navigation table).
    previousMonthShortcut: 'Page Up',
    nextMonthShortcut: 'Page Down',
    previousYearShortcut: 'Shift + Page Up',
    nextYearShortcut: 'Shift + Page Down',
    monthMenuShortcut: 'Shift + M',
    yearMenuShortcut: 'Shift + Y',
    shortcutTooltip: '{0} ({1})',
};
/** Default selectable years (Compose `DatePickerDefaults.YearRange`). */
export const DEFAULT_YEAR_RANGE = [1900, 2100];
const ICONS = {
    previous: 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z',
    next: 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
    dropDown: 'M7 10l5 5 5-5z',
    edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    calendar: 'M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z',
    check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
};
function icon(path, classes = '') {
    return html `<svg
    class="date-picker-icon ${classes}"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="${path}" />
  </svg>`;
}
function formatString(template, ...args) {
    return template.replace(/\{(\d)\}/g, (_, i) => args[Number(i)] ?? '');
}
const baseClass = mixinOnReportValidity(mixinConstraintValidation(mixinFormAssociated(mixinElementInternals(LitElement))));
/**
 * Pointer travel (px) before a drag on the calendar becomes a month swipe
 * (Android ViewConfiguration touch slop, 8.dp).
 */
const SWIPE_SLOP_PX = 8;
/**
 * Release velocity (px/s) above which a swipe moves to the next month in its
 * direction even if it covered less than half the width (Compose
 * PagerDefaults / snap fling minimum velocity, 400.dp/s).
 */
const SWIPE_FLING_VELOCITY = 400;
/**
 * The release velocity is measured over the last 100 ms of the drag (Compose
 * VelocityTracker horizon).
 */
const SWIPE_VELOCITY_HORIZON_MS = 100;
/** Months rendered beyond the visible ones in the scrolling month list. */
const MONTH_LIST_OVERSCAN = 1;
/**
 * The scrolling month list's month height before it is measured: the
 * subhead (20 + 20 + 8) and six 48dp weeks (Compose Month, MaxCalendarRows).
 */
const DEFAULT_MONTH_HEIGHT = 48 + 6 * 48;
// spec-labels: date-pickers/specs/modal-date-picker,
// spec-labels: date-pickers/guidelines/anatomy/full-screen-date-picker,
// spec-labels: date-pickers/guidelines/anatomy/docked-date-picker,
// spec-labels: date-pickers/specs/modal-date-picker/modal-date-picker-configurations,
// spec-labels: date-pickers/specs/docked-date-picker,
// spec-labels: date-pickers/specs/modal-date-input/modal-date-input-configurations,
// spec-labels: date-pickers/guidelines/anatomy/modal-date-picker,
// spec-labels: date-pickers/guidelines/anatomy/modal-date-input, date-pickers/guidelines/usage,
// spec-labels: date-pickers/specs/modal-date-input,
// spec-labels: date-pickers/specs/docked-date-picker/docked-date-picker-configurations
/**
 * A Material Design date picker: lets people select a date or a range of
 * dates.
 *
 * Variants:
 * - `docked` (default): an outlined text field for typing a date, with a
 *   calendar icon button that opens a calendar just below the field. The
 *   calendar has month and year menus and previous / next arrows.
 * - `modal`: a modal dialog (open it with `show()` or `open`) with a
 *   headline showing the selection, a calendar with a year grid, and an
 *   edit icon that switches to the modal date input (`mode="input"`).
 *
 * Set `range` to select a start and end date. The modal range picker shows a
 * vertically scrolling list of months with month subheads (spec: "To
 * navigate across months, scroll vertically"); the other calendars show one
 * month, changed with the arrows, Page Up / Page Down or a horizontal swipe.
 * Set `fullscreen` on a modal picker for the full-screen layout recommended
 * on compact windows (a close icon button and **Save**). Set `inline` to
 * render the calendar surface in the page flow instead of a popup or dialog.
 *
 * Selections in the calendar are pending until confirmed with **OK** (or
 * Enter on a date); **Cancel**, Escape or a click outside discards them. With
 * `hide-actions`, a selection is committed right away.
 *
 * The value is an ISO 8601 date (`2025-08-17`), or an ISO 8601 interval
 * (`2025-08-17/2025-08-23`) for a range. It is form associated: the value
 * is submitted under `name`, and `required` makes an empty value (or a range
 * without an end date) invalid.
 *
 * Month and weekday names, the first day of the week, digits and the date
 * input format follow `locale` (default: the document's `lang`) through
 * `Intl`.
 *
 * @fires {CustomEvent<DatePickerValueDetail>} input - The pending selection changed (a date was picked or a valid date typed). --bubbles --composed
 * @fires {CustomEvent<DatePickerValueDetail>} change - The value was committed (OK, Enter, typing in the docked field, or a pick with `hide-actions`). --bubbles
 * @fires {Event} open - The popup or dialog opened.
 * @fires {Event} cancel - The selection was dismissed (Cancel, Escape or a click outside). Cancelable: canceling keeps the picker open.
 * @fires {CustomEvent<{reason: string}>} close - The popup or dialog began closing; `reason` is `confirm` or `cancel`.
 * @csspart container - The picker surface.
 * @csspart field - The docked text field.
 * @csspart header - The header (modal headline region, or docked menus).
 * @csspart grid - The month grid.
 * @csspart actions - The text buttons row.
 * @cssprop --container-color - Surface color.
 * @cssprop --container-elevation - Surface shadow.
 * @cssprop --container-shape - Surface corner radius.
 * @cssprop --container-width - Surface width.
 * @cssprop --date-container-width - Date indicator width.
 * @cssprop --date-container-height - Date indicator height.
 * @cssprop --date-container-shape - Date indicator shape.
 * @cssprop --date-label-text - Date typography.
 * @cssprop --date-selected-container-color - Selected date indicator color.
 * @cssprop --date-selected-label-text-color - Selected date color.
 * @cssprop --date-today-container-outline-color - Today's outline color.
 * @cssprop --date-today-container-outline-width - Today's outline width.
 * @cssprop --date-today-label-text-color - Today's date color.
 * @cssprop --date-unselected-label-text-color - Unselected date color.
 * @cssprop --date-unselected-outside-month-label-text-color - Docked: adjacent month date color.
 * @cssprop --date-disabled-label-text-color - Disabled date color.
 * @cssprop --weekdays-label-text - Weekday label typography.
 * @cssprop --weekdays-label-text-color - Weekday label color.
 * @cssprop --header-headline - Modal headline typography.
 * @cssprop --header-headline-color - Modal headline color.
 * @cssprop --header-supporting-text - Modal supporting text typography.
 * @cssprop --header-supporting-text-color - Modal supporting text color.
 * @cssprop --menu-button-label-text-color - Month / year menu button color.
 * @cssprop --menu-list-item-selected-container-color - Docked selected month / year color.
 * @cssprop --range-selection-active-indicator-container-color - In-range highlight color.
 * @cssprop --range-selection-date-in-range-label-text-color - In-range date color.
 * @cssprop --year-selection-year-selected-container-color - Selected year color.
 * @cssprop --year-selection-year-selected-label-text-color - Selected year label color.
 * @cssprop --year-selection-year-unselected-label-text-color - Unselected year color.
 * @cssprop --divider-color - Divider color.
 * @cssprop --scrim-color - Modal scrim color.
 * @cssprop --scrim-opacity - Modal scrim opacity.
 * @cssprop --anchor-spacing - Docked: distance between the field and the calendar.
 * @cssprop --range-selection-month-subhead - Modal range: month subhead typography.
 * @cssprop --range-selection-month-subhead-color - Modal range: month subhead color.
 * @cssprop --range-selection-header-container-height - Full-screen header height.
 * @cssprop --range-selection-container-shape - Full-screen surface corner radius.
 * @cssprop --range-selection-container-elevation - Full-screen surface shadow.
 */
export class DatePickerElement extends baseClass {
    /**
     * The density of the picker's text fields (the docked field and the modal
     * input mode's fields), from 0 (default) to -3, as `md-gb-text-field`
     * `density`. Values are clamped to that range.
     *
     * The calendar itself never gets denser (date-pickers.md, Accessibility:
     * "Interactive targets for all elements meet Material's 48x48dp minimum
     * touch target requirement. Increasing density would negatively impact
     * accessibility by limiting tappable/clickable targets"): its dates, menus
     * and buttons keep their size, including inside a dense container.
     */
    get density() {
        return this.densityValue;
    }
    set density(density) {
        const old = this.densityValue;
        this.densityValue = clampDensity(Number(density));
        this.requestUpdate('density', old);
    }
    /** Whether the popup (docked) or dialog (modal) is open. */
    get open() {
        return this.isOpenInternal;
    }
    set open(value) {
        if (value === this.isOpenInternal) {
            return;
        }
        if (value) {
            this.show();
        }
        else {
            this.close(DATE_PICKER_CLOSE_REASONS.CANCEL);
        }
    }
    /** The committed start date (ISO), or ''. */
    get start() {
        const [start] = this.parseValue(this.value);
        return start ? toIsoDate(start) : '';
    }
    set start(value) {
        this.value = this.serialize(parseIsoDate(value), parseIsoDate(this.end));
    }
    /** The committed range end date (ISO), or ''. */
    get end() {
        const [, end] = this.parseValue(this.value);
        return end ? toIsoDate(end) : '';
    }
    set end(value) {
        this.value = this.serialize(parseIsoDate(this.start), parseIsoDate(value));
    }
    /** The pending (not yet confirmed) value, in the format of `value`. */
    get pendingValue() {
        return this.serialize(this.pendingStart, this.pendingEnd);
    }
    constructor() {
        super();
        /** `docked` (default) or `modal`. */
        this.variant = 'docked';
        /** Selects a start and end date. */
        this.range = false;
        /**
         * Renders the calendar surface in the page flow, always visible, instead
         * of a docked popup (without the text field) or a modal dialog.
         */
        this.inline = false;
        /**
         * Modal: the full-screen layout the spec recommends on compact windows.
         * The dialog covers the window and has a close (x) icon button and a
         * **Save** button in place of Cancel and OK.
         */
        this.fullscreen = false;
        this.densityValue = 0;
        /**
         * A value is required: with no date (or a range without an end date) the
         * picker is invalid (`valueMissing`).
         */
        this.required = false;
        /** Modal: shows the calendar (`picker`) or the date input (`input`). */
        this.mode = 'picker';
        /**
         * The committed value: an ISO date (`YYYY-MM-DD`), or an ISO interval
         * (`start/end`) when `range` is set. Empty when nothing is selected.
         */
        this.value = '';
        /** The earliest selectable date (ISO). */
        this.min = '';
        /** The latest selectable date (ISO). */
        this.max = '';
        /** A BCP 47 locale. Defaults to the document's `lang`, else the browser's. */
        this.locale = '';
        /**
         * The first day of the week, 0 (Sunday) to 6 (Saturday). -1 (default)
         * uses the locale's.
         */
        this.firstDayOfWeek = -1;
        /** Docked: the text field label. Defaults to "Date" (range: "Dates"). */
        this.label = '';
        /** Docked: the field's supporting text. Defaults to the date format, e.g. MM/DD/YYYY. */
        this.supportingText = '';
        /** Hides the Cancel and OK buttons; a selection is committed right away. */
        this.hideActions = false;
        /** Shows a Clear button that removes the selection. */
        this.clearable = false;
        /** Forces the error state of the docked field. */
        this.error = false;
        /** The message shown on the docked field while `error` is set. */
        this.errorText = '';
        /** Skips animations. */
        this.quick = false;
        /**
         * Returns true for dates that can't be selected (in addition to dates
         * outside `min` / `max`). Receives an ISO date.
         */
        this.isDateDisabled = null;
        /** Overrides for the user-facing strings. */
        this.strings = {};
        this.dockedOpen = false;
        this.pendingStart = null;
        this.pendingEnd = null;
        this.displayYear = 0;
        this.displayMonth = 1;
        this.focusedDate = today();
        this.focusedIndex = 0;
        this.view = 'days';
        this.dockedClosing = false;
        /** Announces month changes to screen readers (polite). */
        this.announcer = new AnnouncerController(this, {
            container: () => this.surface,
        });
        /**
         * Modal variant: opens and closes the `<dialog>`, closes it with Escape,
         * back or the scrim, traps and restores focus, locks page scrolling and
         * fires the `open`, `opened`, `close` and `closed` events.
         */
        this.modalSurface = new ModalSurfaceController(this, {
            dialog: () => (this.isModalDialog ? this.dialogElement : null),
            surface: () => (this.isModalDialog ? this.dialogElement : null),
            modal: () => this.isModalDialog,
            closeOnDisconnect: true,
            isScrim: (event) => this.isOnScrim(event),
            initialFocus: () => this.mode === 'input'
                ? this.renderRoot.querySelector('.date-picker-inputs md-gb-text-field')
                : this.getFocusTarget(),
            waitForMotion: () => this.waitForTransitions(),
            onCloseRequest: (reason) => {
                if (reason === 'escape' && this.view !== 'days') {
                    // Close the month / year list instead of the dialog.
                    this.closeList();
                    return;
                }
                this.cancel(reason);
            },
        });
        /** Docked variant: the calendar popup below the field. */
        this.overlay = new AnchoredOverlayController(this, {
            surface: () => (this.isDockedPopup ? this.surface : null),
            anchor: () => this.renderRoot.querySelector('.date-picker-field'),
            positioning: 'js',
            placement: () => ({
                placement: 'below',
                align: 'start',
                spacing: this.anchorSpacing(),
                margin: 0,
            }),
            // Escape is handled by the picker (it closes an open month or year list
            // first).
            dismiss: { escape: false },
            contains: (node) => composedContains(this, node),
            onDismiss: () => {
                this.cancel();
            },
            returnTarget: () => this.calendarButton,
        });
        /** Disabled by a disabled fieldset, which the attribute can't follow. */
        this.formDisabled = new FormDisabledController(this);
        /** The dirty value and the validation error shown on the docked field. */
        this.field = new ValueFieldController(this);
        this.slide = '';
        this.slideKey = 0;
        this.fieldText = '';
        this.fieldError = '';
        this.inputTexts = ['', ''];
        this.inputErrors = ['', ''];
        /** Horizontal drag of the month (px) during a swipe, else null. */
        this.dragOffset = null;
        /** The swipe was released and the month is springing into place. */
        this.swipeSettling = false;
        this.listScrollTop = 0;
        this.listHeight = 0;
        this.monthHeight = DEFAULT_MONTH_HEIGHT;
        this.focusAfterUpdate = '';
        this.transitionCounter = 0;
        /** The modal headline as last rendered, for the announcer. */
        this.headlineLabelText = '';
        this.announcedHeadline = null;
        this.cachedFormat = null;
        this.swipe = null;
        this.suppressClick = false;
        /** Scroll the month list to the displayed month on the next layout. */
        this.pendingListScroll = true;
        // ---------------------------------------------------------------------
        // Event handlers.
        this.handleHostKeydown = (event) => {
            if (event.defaultPrevented) {
                return;
            }
            const target = event.composedPath()[0];
            const inTextInput = target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement;
            if (event.key === 'Escape' &&
                this.variant === 'docked' &&
                this.isOpenInternal) {
                event.preventDefault();
                if (this.view !== 'days') {
                    this.closeList();
                    return;
                }
                this.cancel();
                return;
            }
            if (event.key === 'Escape' && this.view !== 'days') {
                // Close the month / year list instead of the dialog.
                event.preventDefault();
                this.closeList();
                return;
            }
            if (!event.shiftKey ||
                inTextInput ||
                event.ctrlKey ||
                event.metaKey ||
                event.altKey) {
                return;
            }
            const key = event.key.toLowerCase();
            if (key === 'm' && !this.isModal) {
                event.preventDefault();
                this.renderRoot
                    .querySelector('.date-picker-month-menu')
                    ?.focus();
            }
            else if (key === 'y') {
                event.preventDefault();
                this.renderRoot
                    .querySelector('.date-picker-year-menu')
                    ?.focus();
            }
        };
        this.handleGridClick = (event) => {
            const cell = event.target.closest('[data-date]');
            const date = parseIsoDate(cell?.dataset['date']);
            if (date) {
                this.selectDate(date);
            }
        };
        this.handleGridKeydown = (event) => {
            const cell = event.target.closest('[data-date]');
            const date = parseIsoDate(cell?.dataset['date']);
            if (!date) {
                return;
            }
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const selected = this.selectDate(date);
                // Spec keyboard table: Enter closes the calendar and saves the date.
                if (event.key === 'Enter' &&
                    selected &&
                    !this.hideActions &&
                    this.isSelectionComplete) {
                    this.confirm();
                }
                return;
            }
            const target = getKeyboardTargetDate(event, date, { rtl: this.isRtl() });
            if (!target) {
                return;
            }
            event.preventDefault();
            this.goToMonth(this.clampToRange(target));
            this.focusAfterUpdate = 'date';
        };
        this.handleListKeydown = (event) => {
            const option = event.target.closest('[data-index]');
            if (!option) {
                return;
            }
            const index = Number(option.dataset['index']);
            const count = this.view === 'months' ? 12 : this.yearRange[1] - this.yearRange[0] + 1;
            const columns = this.isModal && this.view === 'years' ? 3 : 1;
            const forward = this.isRtl() ? -1 : 1;
            let next = null;
            switch (event.key) {
                case 'ArrowLeft':
                    next = columns > 1 ? index - forward : null;
                    break;
                case 'ArrowRight':
                    next = columns > 1 ? index + forward : null;
                    break;
                case 'ArrowUp':
                    next = index - columns;
                    break;
                case 'ArrowDown':
                    next = index + columns;
                    break;
                case 'Home':
                    next = 0;
                    break;
                case 'End':
                    next = count - 1;
                    break;
                case 'PageUp':
                    next = index - columns * 4;
                    break;
                case 'PageDown':
                    next = index + columns * 4;
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    this.selectListItem(index);
                    return;
                default:
                    return;
            }
            if (next === null) {
                return;
            }
            event.preventDefault();
            this.focusedIndex = Math.max(0, Math.min(count - 1, next));
            this.focusAfterUpdate = 'list';
        };
        this.handleListClick = (event) => {
            const option = event.target.closest('[data-index]');
            if (option && option.getAttribute('aria-disabled') !== 'true') {
                this.selectListItem(Number(option.dataset['index']));
            }
        };
        this.handleCalendarButtonClick = () => {
            if (this.isOpenInternal) {
                this.cancel();
            }
            else {
                this.show();
            }
        };
        this.handleFieldInput = (event) => {
            event.stopPropagation();
            this.fieldText = event.target.value;
            this.fieldError = '';
        };
        this.handleFieldChange = (event) => {
            event.stopPropagation();
            this.commitFieldText();
        };
        this.handleFieldKeydown = (event) => {
            if (event.key === 'Enter') {
                this.commitFieldText();
            }
            else if (event.key === 'ArrowDown' && event.altKey) {
                event.preventDefault();
                this.show();
            }
        };
        this.handleModeToggle = () => {
            if (this.mode === 'picker') {
                this.inputTexts = [
                    this.formatForInput(this.pendingStart),
                    this.formatForInput(this.pendingEnd),
                ];
                this.inputErrors = ['', ''];
                this.mode = 'input';
                this.focusAfterUpdate = 'input';
            }
            else {
                this.mode = 'picker';
                this.view = 'days';
                const anchor = this.clampToRange(this.pendingStart ?? today());
                this.displayYear = anchor.year;
                this.displayMonth = anchor.month;
                this.focusedDate = anchor;
                this.slide = '';
                this.pendingListScroll = true;
                this.focusAfterUpdate = 'date';
            }
        };
        this.handleClear = () => {
            this.pendingStart = null;
            this.pendingEnd = null;
            this.inputTexts = ['', ''];
            this.inputErrors = ['', ''];
            this.dispatchInput();
        };
        this.handleSwipeStart = (event) => {
            this.suppressClick = false;
            if (!event.isPrimary || event.button !== 0 || this.swipeSettling) {
                return;
            }
            this.swipe = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                samples: [{ x: event.clientX, time: event.timeStamp }],
                active: false,
            };
        };
        this.handleSwipeMove = (event) => {
            const swipe = this.swipe;
            if (!swipe || event.pointerId !== swipe.pointerId) {
                return;
            }
            const dx = event.clientX - swipe.startX;
            const dy = event.clientY - swipe.startY;
            if (!swipe.active) {
                if (Math.abs(dx) < SWIPE_SLOP_PX && Math.abs(dy) < SWIPE_SLOP_PX) {
                    return;
                }
                if (Math.abs(dy) >= Math.abs(dx)) {
                    // A vertical gesture: leave it to the page.
                    this.swipe = null;
                    return;
                }
                swipe.active = true;
                try {
                    event.currentTarget.setPointerCapture(event.pointerId);
                }
                catch {
                    // The pointer is already gone.
                }
            }
            this.addSwipeSample(swipe, event);
            const width = event.currentTarget.clientWidth;
            // The calendar doesn't move past the first or last selectable month.
            const months = this.swipeMonths(dx);
            this.dragOffset =
                months && !this.canGoToMonth(months)
                    ? 0
                    : Math.max(-width, Math.min(width, dx));
            event.preventDefault();
        };
        this.handleSwipeEnd = (event) => {
            const swipe = this.swipe;
            if (!swipe || event.pointerId !== swipe.pointerId) {
                return;
            }
            this.swipe = null;
            if (!swipe.active) {
                return;
            }
            this.suppressClick = true;
            this.addSwipeSample(swipe, event);
            const velocity = this.swipeVelocity(swipe);
            const width = event.currentTarget.clientWidth || 1;
            const offset = this.dragOffset ?? 0;
            // Compose snap fling: a fling moves to the next month in its direction;
            // otherwise the month snaps to the closest position.
            let pages = 0;
            if (Math.abs(velocity) > SWIPE_FLING_VELOCITY &&
                Math.sign(velocity) === Math.sign(offset)) {
                pages = Math.sign(offset);
            }
            else if (Math.abs(offset) > width / 2) {
                pages = Math.sign(offset);
            }
            let months = this.swipeMonths(pages);
            if (months && !this.canGoToMonth(months)) {
                pages = 0;
                months = 0;
            }
            this.settleSwipe(pages * width, months);
        };
        this.handleSwipeCancel = (event) => {
            if (this.swipe?.pointerId !== event.pointerId) {
                return;
            }
            const active = this.swipe.active;
            this.swipe = null;
            if (active) {
                this.settleSwipe(0, 0);
            }
        };
        /** A swipe ends with a click on the calendar; it must not pick a date. */
        this.handleSwipeClick = {
            handleEvent: (event) => {
                if (!this.suppressClick) {
                    return;
                }
                this.suppressClick = false;
                event.preventDefault();
                event.stopPropagation();
            },
            capture: true,
        };
        this.handleListScroll = (event) => {
            const list = event.currentTarget;
            this.listScrollTop = list.scrollTop;
            this.listHeight = list.clientHeight;
            // Compose updateDisplayedMonth: the first visible month is displayed.
            const index = Math.max(0, Math.min(this.monthCount - 1, Math.floor((list.scrollTop + 1) / this.monthHeight)));
            this.displayYear = this.yearRange[0] + Math.floor(index / 12);
            this.displayMonth = (index % 12) + 1;
        };
        this.handleSurfaceKeydown = (event) => {
            // Keep Tab inside the docked popup's natural order; nothing to do here
            // yet besides stopping text field shortcuts from reaching the host.
            if (event.key === 'Tab' &&
                this.variant === 'docked' &&
                this.isOpenInternal) {
                const surface = this.surface;
                const focusable = surface
                    ? [
                        ...surface.querySelectorAll('button:not([disabled]), [tabindex="0"]'),
                    ].filter((el) => el.offsetParent !== null || el.getClientRects().length)
                    : [];
                if (!focusable.length)
                    return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                const active = this.shadowRoot?.activeElement;
                if (event.shiftKey && active === first) {
                    event.preventDefault();
                    last.focus();
                }
                else if (!event.shiftKey && active === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };
        if (!isServer) {
            this.addEventListener('keydown', this.handleHostKeydown);
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.dockedOpen || this.dockedClosing) {
            this.transitionCounter++;
            this.dockedClosing = false;
            this.setDockedOpen(false);
        }
    }
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled() {
        return super.disabled || !!this.formDisabled?.value;
    }
    set disabled(disabled) {
        super.disabled = disabled;
    }
    formDisabledCallback(disabled) {
        // Not the attribute: it would keep the picker disabled after the
        // fieldset is enabled again.
        this.formDisabled.set(disabled);
    }
    attributeChangedCallback(attribute, oldValue, newValue) {
        if (this.field?.ignoresAttribute(attribute)) {
            // After the person picked a date, the value attribute no longer
            // updates the value (until reset), like a native <input>.
            return;
        }
        super.attributeChangedCallback(attribute, oldValue, newValue);
    }
    focus(options) {
        if (this.inline || this.isOpenInternal) {
            this.getFocusTarget()?.focus(options);
            return;
        }
        if (this.variant === 'docked') {
            this.textField?.focus(options);
            return;
        }
        super.focus(options);
    }
    /**
     * Opens the calendar popup (docked) or dialog (modal). The pending
     * selection starts from `value`, and focus moves to the selected date (or
     * today).
     */
    async show() {
        if (this.inline || (this.isOpenInternal && !this.isClosing)) {
            return;
        }
        if (!this.hasUpdated) {
            // The variant may still be set by later attributes.
            await this.updateComplete;
            if (this.inline) {
                return;
            }
        }
        this.resetPending();
        this.view = 'days';
        if (this.isModal) {
            return this.modalSurface.show();
        }
        const token = ++this.transitionCounter;
        this.dockedClosing = false;
        this.setDockedOpen(true);
        await this.updateComplete;
        if (token !== this.transitionCounter || !this.isConnected) {
            return;
        }
        this.overlay.open(this.calendarButton);
        this.focusAfterUpdate = 'date';
        this.requestUpdate();
        this.dispatchEvent(new Event('open'));
    }
    /**
     * Closes the popup or dialog without changing the value (use `confirm()`
     * to commit the pending selection).
     *
     * @param reason Passed in the `close` event's detail: `confirm`,
     *     `cancel`, or for a dialog `escape`, `back` or `scrim`.
     */
    async close(reason = DATE_PICKER_CLOSE_REASONS.CANCEL) {
        if (this.isModal) {
            return this.modalSurface.close(reason);
        }
        if (!this.dockedOpen) {
            return;
        }
        this.dispatchEvent(new CustomEvent('close', { detail: { reason } }));
        const token = ++this.transitionCounter;
        this.setDockedOpen(false);
        this.dockedClosing = true;
        await this.updateComplete;
        await this.waitForTransitions();
        if (token !== this.transitionCounter) {
            return;
        }
        this.dockedClosing = false;
        this.overlay.close(reason);
        await this.updateComplete;
    }
    /**
     * Commits the pending selection to `value` (firing `change` if it changed)
     * and closes the popup or dialog. In the date input mode, invalid text
     * shows its error and keeps the picker open.
     *
     * @return Whether the selection was committed.
     */
    confirm() {
        if (this.variant === 'modal' &&
            this.mode === 'input' &&
            !this.validateInputs()) {
            this.focusAfterUpdate = 'input';
            this.requestUpdate();
            return false;
        }
        this.commit(this.serialize(this.pendingStart, this.pendingEnd));
        if (!this.inline) {
            this.close(DATE_PICKER_CLOSE_REASONS.CONFIRM);
        }
        return true;
    }
    /**
     * Discards the pending selection: fires a cancelable `cancel` event, then
     * closes the popup or dialog.
     *
     * @return Whether the picker was canceled (`cancel` wasn't prevented).
     */
    cancel(reason = DATE_PICKER_CLOSE_REASONS.CANCEL) {
        const proceed = this.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true }));
        if (!proceed) {
            return false;
        }
        this.resetPending();
        if (!this.inline) {
            this.close(reason);
        }
        return true;
    }
    /** Shows the given month (`year`, `month` 1-12) in the calendar. */
    showMonth(year, month) {
        this.goToMonth({ year, month, day: this.focusedDate.day });
        this.pendingListScroll = true;
    }
    [getFormValue]() {
        return this.value || null;
    }
    formResetCallback() {
        this.field.reset();
        this.value = this.getAttribute('value') ?? '';
    }
    formStateRestoreCallback(state) {
        this.value = state;
    }
    [createValidator]() {
        return new DatePickerValidator(() => ({
            required: this.required,
            complete: this.isValueComplete,
        }));
    }
    [getValidityAnchor]() {
        return this.variant === 'docked' && !this.inline ? this.textField : null;
    }
    /** The committed value is a date, or a range with a start and an end. */
    get isValueComplete() {
        const [start, end] = this.parseValue(this.value ?? '');
        return this.range ? !!(start && end) : !!start;
    }
    /** Docked: an invalid picker shows its validation message on the field. */
    [onReportValidity](invalidEvent) {
        if (this.variant === 'docked' && !this.inline) {
            this.field.report(invalidEvent);
        }
    }
    // ---------------------------------------------------------------------
    // Model helpers.
    get resolvedStrings() {
        return { ...DEFAULT_DATE_PICKER_STRINGS, ...this.strings };
    }
    get resolvedLocale() {
        return this.locale || defaultLocale();
    }
    get firstDay() {
        return this.firstDayOfWeek >= 0 && this.firstDayOfWeek <= 6
            ? Math.floor(this.firstDayOfWeek)
            : getFirstDayOfWeek(this.resolvedLocale);
    }
    get inputFormat() {
        const locale = this.resolvedLocale;
        if (this.cachedFormat?.locale !== locale) {
            this.cachedFormat = { locale, format: getDateInputFormat(locale) };
        }
        return this.cachedFormat.format;
    }
    get minDate() {
        const min = parseIsoDate(this.min);
        const max = parseIsoDate(this.max);
        return min && max && compareDates(min, max) > 0 ? null : min;
    }
    get maxDate() {
        const min = parseIsoDate(this.min);
        const max = parseIsoDate(this.max);
        return min && max && compareDates(min, max) > 0 ? null : max;
    }
    get yearRange() {
        return [
            this.minDate?.year ?? DEFAULT_YEAR_RANGE[0],
            this.maxDate?.year ?? DEFAULT_YEAR_RANGE[1],
        ];
    }
    get firstSelectable() {
        return this.minDate ?? { year: this.yearRange[0], month: 1, day: 1 };
    }
    get lastSelectable() {
        return this.maxDate ?? { year: this.yearRange[1], month: 12, day: 31 };
    }
    get isModal() {
        return this.variant === 'modal';
    }
    /** The modal range calendar: a vertically scrolling list of months. */
    get isScrolling() {
        return this.isModal && this.range && this.mode !== 'input';
    }
    /** The number of months in the scrolling month list (whole years). */
    get monthCount() {
        const [first, last] = this.yearRange;
        return (last - first + 1) * 12;
    }
    /** The month's position in the scrolling month list. */
    monthIndex(year, month) {
        return (year - this.yearRange[0]) * 12 + month - 1;
    }
    isRtl() {
        try {
            return this.matches(':dir(rtl)');
        }
        catch {
            return getComputedStyle(this).direction === 'rtl';
        }
    }
    parseValue(value) {
        if (!this.range) {
            return [parseIsoDate(value), null];
        }
        const [start = '', end = ''] = value.split('/');
        const startDate = parseIsoDate(start);
        const endDate = parseIsoDate(end);
        if (startDate && endDate && compareDates(endDate, startDate) < 0) {
            return [startDate, null];
        }
        return [startDate, startDate ? endDate : null];
    }
    serialize(start, end) {
        if (!start) {
            return '';
        }
        if (!this.range) {
            return toIsoDate(start);
        }
        return `${toIsoDate(start)}/${end ? toIsoDate(end) : ''}`;
    }
    valueDetail(value) {
        const [start, end] = this.parseValue(value);
        return {
            value,
            start: start ? toIsoDate(start) : '',
            end: end ? toIsoDate(end) : '',
        };
    }
    /** Whether the date can be selected. */
    isDisabled(date) {
        if (compareDates(date, this.firstSelectable) < 0 ||
            compareDates(date, this.lastSelectable) > 0) {
            return true;
        }
        return !!this.isDateDisabled?.(toIsoDate(date));
    }
    clampToRange(date) {
        return clampDate(date, this.firstSelectable, this.lastSelectable);
    }
    get isSelectionComplete() {
        return this.range
            ? !!(this.pendingStart && this.pendingEnd)
            : !!this.pendingStart;
    }
    resetPending() {
        const [start, end] = this.parseValue(this.value);
        this.pendingStart = start;
        this.pendingEnd = end;
        const anchor = this.clampToRange(start ?? today());
        this.focusedDate = anchor;
        this.displayYear = anchor.year;
        this.displayMonth = anchor.month;
        this.slide = '';
        this.inputTexts = [this.formatForInput(start), this.formatForInput(end)];
        this.inputErrors = ['', ''];
        this.swipe = null;
        this.dragOffset = null;
        this.swipeSettling = false;
        this.pendingListScroll = true;
    }
    formatForInput(date) {
        return date ? formatInputDate(date, this.inputFormat) : '';
    }
    formatFieldText() {
        const [start, end] = this.parseValue(this.value);
        if (!this.range) {
            return this.formatForInput(start);
        }
        if (!start) {
            return '';
        }
        return `${this.formatForInput(start)} – ${this.formatForInput(end)}`.trim();
    }
    /** Validates a typed date; returns an error message or ''. */
    validateDate(date) {
        const strings = this.resolvedStrings;
        if (!date) {
            return formatString(strings.invalidPattern, this.inputFormat.pattern);
        }
        const [first, last] = this.yearRange;
        if (date.year < first || date.year > last) {
            return formatString(strings.yearOutOfRange, formatNumber(first, this.resolvedLocale), formatNumber(last, this.resolvedLocale));
        }
        if (this.isDisabled(date)) {
            return formatString(strings.notAllowed, formatDate(date, this.resolvedLocale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }));
        }
        return '';
    }
    commit(value) {
        if (value === this.value) {
            return;
        }
        this.field.markDirty();
        this.value = value;
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            detail: this.valueDetail(value),
        }));
    }
    dispatchInput() {
        this.dispatchEvent(new CustomEvent('input', {
            bubbles: true,
            composed: true,
            detail: this.valueDetail(this.pendingValue),
        }));
    }
    /** Selects a date as a click would. Returns whether it was selectable. */
    selectDate(date) {
        if (this.isDisabled(date)) {
            return false;
        }
        if (!this.range) {
            this.pendingStart = date;
        }
        else if (!this.pendingStart || this.pendingEnd) {
            this.pendingStart = date;
            this.pendingEnd = null;
        }
        else if (compareDates(date, this.pendingStart) >= 0) {
            this.pendingEnd = date;
        }
        else {
            this.pendingStart = date;
        }
        this.focusedDate = date;
        if (!this.isScrolling &&
            (date.year !== this.displayYear || date.month !== this.displayMonth)) {
            this.goToMonth(date);
        }
        this.dispatchInput();
        if (this.hideActions && this.isSelectionComplete) {
            this.confirm();
        }
        return true;
    }
    setDockedOpen(open) {
        const prev = this.dockedOpen;
        this.dockedOpen = open;
        this.requestUpdate('open', prev);
    }
    /** Whether the picker is open (the dialog or the docked popup). */
    get isOpenInternal() {
        return this.isModal ? this.modalSurface.open : this.dockedOpen;
    }
    /** Whether the picker is animating closed. */
    get isClosing() {
        return this.isModal ? this.modalSurface.closing : this.dockedClosing;
    }
    /** The modal variant renders a dialog (not inline). */
    get isModalDialog() {
        return this.isModal && !this.inline;
    }
    /** The docked variant renders a popup (not inline). */
    get isDockedPopup() {
        return !this.isModal && !this.inline;
    }
    /** Shows the month of `date` and moves the roving focus into it. */
    goToMonth(date) {
        const target = {
            year: date.year,
            month: date.month,
            day: Math.min(date.day, daysInMonth(date.year, date.month)),
        };
        const direction = target.year * 12 +
            target.month -
            (this.displayYear * 12 + this.displayMonth);
        if (direction !== 0) {
            this.slide = direction > 0 ? 'next' : 'prev';
            this.slideKey++;
            this.displayYear = target.year;
            this.displayMonth = target.month;
            this.announcer.announce(formatDate(target, this.resolvedLocale, {
                year: 'numeric',
                month: 'long',
            }));
        }
        this.focusedDate = target;
    }
    canGoToMonth(offset) {
        const target = addMonths({ year: this.displayYear, month: this.displayMonth, day: 1 }, offset);
        const first = this.firstSelectable;
        const last = this.lastSelectable;
        const index = target.year * 12 + target.month;
        return (index >= first.year * 12 + first.month &&
            index <= last.year * 12 + last.month);
    }
    navigate(offset) {
        if (!this.canGoToMonth(offset)) {
            return;
        }
        this.goToMonth(addMonths(this.focusedDate, offset));
    }
    // ---------------------------------------------------------------------
    // Lifecycle.
    willUpdate(changed) {
        if (changed.has('value') || changed.has('range') || changed.has('locale')) {
            this.fieldText = this.formatFieldText();
            this.fieldError = '';
            if (!this.isOpenInternal || this.inline) {
                this.resetPending();
            }
        }
        if (this.displayYear === 0) {
            this.resetPending();
        }
        if (changed.has('range') ||
            changed.has('variant') ||
            changed.has('mode') ||
            changed.has('min') ||
            changed.has('max')) {
            this.pendingListScroll = true;
        }
    }
    updated() {
        this.syncMonthList();
        this.announceHeadline();
        const focus = this.focusAfterUpdate;
        if (!focus) {
            return;
        }
        this.focusAfterUpdate = '';
        if (focus === 'input') {
            this.renderRoot
                .querySelector('.date-picker-inputs md-gb-text-field')
                ?.focus();
            return;
        }
        const target = this.getFocusTarget();
        if (this.isScrolling && focus === 'date') {
            // Keep the month list still unless the date is out of view.
            target?.focus({ preventScroll: true });
            target?.scrollIntoView?.({ block: 'nearest' });
            return;
        }
        target?.focus();
        if (focus === 'list') {
            target?.scrollIntoView?.({ block: 'center' });
        }
    }
    /**
     * Announces the modal headline (the selected date or range) when a pick
     * changes it; opening the dialog doesn't announce it again.
     */
    announceHeadline() {
        if (!this.isModalDialog || !this.isOpenInternal) {
            this.announcedHeadline = null;
            return;
        }
        const label = this.headlineLabelText;
        if (this.announcedHeadline !== null && label !== this.announcedHeadline) {
            this.announcer.announce(label);
        }
        this.announcedHeadline = label;
    }
    getFocusTarget() {
        if (this.view !== 'days') {
            return this.renderRoot.querySelector('.date-picker-list [tabindex="0"]');
        }
        return this.renderRoot.querySelector('.date-picker-grid [tabindex="0"], .date-picker-months [tabindex="0"]');
    }
    /**
     * Measures the scrolling month list (month height, viewport) and scrolls
     * it to the displayed month when asked to. The list is laid out only once
     * the dialog is open, so this retries on later updates until it is.
     */
    syncMonthList() {
        const list = this.renderRoot.querySelector('.date-picker-months');
        if (!list || list.clientHeight === 0) {
            return;
        }
        const height = list.querySelector('.date-picker-month')?.offsetHeight ?? 0;
        if (height > 0 && height !== this.monthHeight) {
            // Re-render at the measured height first; scroll on the next update.
            this.monthHeight = height;
            return;
        }
        if (list.clientHeight !== this.listHeight) {
            this.listHeight = list.clientHeight;
        }
        if (this.pendingListScroll) {
            this.pendingListScroll = false;
            // Compose DateRangePickerContent: scrollToItem(displayed month).
            list.scrollTop =
                this.monthIndex(this.displayYear, this.displayMonth) * this.monthHeight;
            this.listScrollTop = list.scrollTop;
        }
    }
    async waitForTransitions() {
        const element = this.isModal ? this.dialogElement : this.surface;
        if (this.quick || !element) {
            return;
        }
        await waitForMotion(element);
    }
    /** The gap between the docked field and its popup. */
    anchorSpacing() {
        const surface = this.surface;
        return surface
            ? parseFloat(getComputedStyle(surface).getPropertyValue('--anchor-spacing')) || 0
            : 0;
    }
    closeList() {
        const menu = this.view === 'months' ? 'month' : 'year';
        this.view = 'days';
        this.updateComplete.then(() => {
            this.renderRoot
                .querySelector(`.date-picker-${menu}-menu`)
                ?.focus();
        });
    }
    openList(view) {
        if (this.view === view) {
            this.view = 'days';
            return;
        }
        this.view = view;
        this.focusedIndex =
            view === 'months'
                ? this.displayMonth - 1
                : this.displayYear - this.yearRange[0];
        this.focusAfterUpdate = 'list';
    }
    selectListItem(index) {
        const isMonths = this.view === 'months';
        const year = isMonths ? this.displayYear : this.yearRange[0] + index;
        const month = isMonths ? index + 1 : this.displayMonth;
        if (this.isListItemDisabled(isMonths ? 'months' : 'years', index)) {
            return;
        }
        const target = this.clampToRange({
            year,
            month,
            day: Math.min(this.focusedDate.day, daysInMonth(year, month)),
        });
        this.view = 'days';
        this.goToMonth(target);
        this.focusAfterUpdate = 'date';
    }
    isListItemDisabled(view, index) {
        const first = this.firstSelectable;
        const last = this.lastSelectable;
        if (view === 'months') {
            const value = this.displayYear * 12 + index + 1;
            return (value < first.year * 12 + first.month ||
                value > last.year * 12 + last.month);
        }
        const year = this.yearRange[0] + index;
        return year < first.year || year > last.year;
    }
    /** Parses and commits the docked field's text, or shows its error. */
    commitFieldText() {
        const text = this.fieldText.trim();
        if (!text) {
            this.fieldError = '';
            this.commit('');
            this.resetPending();
            return;
        }
        let start;
        let end = null;
        if (this.range) {
            const parts = splitRangeText(text);
            start = parts ? parseInputDate(parts[0], this.inputFormat) : null;
            end = parts ? parseInputDate(parts[1], this.inputFormat) : null;
            const error = this.validateDate(start) || this.validateDate(end);
            if (error) {
                this.fieldError = error;
                return;
            }
            if (compareDates(end, start) < 0) {
                this.fieldError = this.resolvedStrings.invalidRange;
                return;
            }
        }
        else {
            start = parseInputDate(text, this.inputFormat);
            const error = this.validateDate(start);
            if (error) {
                this.fieldError = error;
                return;
            }
        }
        this.fieldError = '';
        this.commit(this.serialize(start, end));
        // Reformat what was typed (spec: format after Enter or leaving the field).
        this.fieldText = this.formatFieldText();
        this.resetPending();
    }
    handleInputTextInput(index, event) {
        event.stopPropagation();
        const text = event.target.value;
        const texts = [...this.inputTexts];
        texts[index] = text;
        this.inputTexts = texts;
        const errors = [...this.inputErrors];
        errors[index] = '';
        this.inputErrors = errors;
        const date = parseInputDate(text, this.inputFormat);
        const valid = date && !this.validateDate(date) ? date : null;
        if (index === 0) {
            this.pendingStart = valid;
            if (!valid)
                this.pendingEnd = null;
            else if (this.range) {
                this.pendingEnd = parseInputDate(this.inputTexts[1], this.inputFormat);
                if (this.pendingEnd &&
                    (this.validateDate(this.pendingEnd) ||
                        compareDates(this.pendingEnd, valid) < 0)) {
                    this.pendingEnd = null;
                }
            }
        }
        else {
            this.pendingEnd =
                valid &&
                    this.pendingStart &&
                    compareDates(valid, this.pendingStart) >= 0
                    ? valid
                    : null;
        }
        if (valid) {
            this.goToMonth(valid);
        }
        this.dispatchInput();
    }
    handleInputTextChange(index, event) {
        event.stopPropagation();
        this.validateInput(index);
    }
    handleInputKeydown(index, event) {
        if (event.key !== 'Enter') {
            return;
        }
        event.preventDefault();
        if (this.validateInput(index) && (!this.range || index === 1)) {
            this.confirm();
        }
    }
    /** Validates and reformats one date input field. */
    validateInput(index) {
        const text = this.inputTexts[index].trim();
        const errors = [...this.inputErrors];
        if (!text) {
            errors[index] = '';
            this.inputErrors = errors;
            return true;
        }
        const date = parseInputDate(text, this.inputFormat);
        let error = this.validateDate(date);
        if (!error && index === 1 && this.range) {
            const start = parseInputDate(this.inputTexts[0], this.inputFormat);
            if (start && compareDates(date, start) < 0) {
                error = this.resolvedStrings.invalidRange;
            }
        }
        errors[index] = error;
        this.inputErrors = errors;
        if (!error && date) {
            const texts = [...this.inputTexts];
            texts[index] = formatInputDate(date, this.inputFormat);
            this.inputTexts = texts;
        }
        return !error;
    }
    validateInputs() {
        const first = this.validateInput(0);
        const second = this.range ? this.validateInput(1) : true;
        return first && second;
    }
    isOnScrim(event) {
        const dialogElement = this.dialogElement;
        if (!dialogElement || event.composedPath()[0] !== dialogElement) {
            return false;
        }
        const rect = dialogElement.getBoundingClientRect();
        return (event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom);
    }
    // ---------------------------------------------------------------------
    // Month swipe (one-month calendars) and the scrolling month list.
    /** The month offset that a drag toward `dx` (physical px) reveals. */
    swipeMonths(dx) {
        if (dx === 0) {
            return 0;
        }
        // Dragging right reveals the previous month (the next one in RTL).
        const forward = this.isRtl() ? -1 : 1;
        return dx > 0 ? -forward : forward;
    }
    addSwipeSample(swipe, event) {
        swipe.samples.push({ x: event.clientX, time: event.timeStamp });
        const oldest = event.timeStamp - SWIPE_VELOCITY_HORIZON_MS;
        while (swipe.samples.length > 2 && swipe.samples[0].time < oldest) {
            swipe.samples.shift();
        }
    }
    /** Horizontal velocity (px/s) over the last samples; 0 after a pause. */
    swipeVelocity(swipe) {
        const last = swipe.samples[swipe.samples.length - 1];
        const first = swipe.samples.find((sample) => sample.time >= last.time - SWIPE_VELOCITY_HORIZON_MS);
        if (!first || first === last || last.time <= first.time) {
            return 0;
        }
        return ((last.x - first.x) / (last.time - first.time)) * 1000;
    }
    /**
     * Springs the dragged month to `target` (px; the default effects spring,
     * like Compose's month snap), then shows the month `months` away.
     */
    async settleSwipe(target, months) {
        const finish = () => {
            const hadFocus = !!this.renderRoot
                .querySelector('.date-picker-pager')
                ?.contains(this.shadowRoot?.activeElement ?? null);
            this.swipeSettling = false;
            this.dragOffset = null;
            if (months) {
                this.navigate(months);
                // The swipe already moved the month in.
                this.slide = '';
                if (hadFocus) {
                    this.focusAfterUpdate = 'date';
                }
            }
        };
        // Reduced motion: the month changes without the slide (spatial motion off).
        if (this.quick || isReducedMotion(this) || this.dragOffset === target) {
            finish();
            return;
        }
        this.swipeSettling = true;
        this.dragOffset = target;
        await this.updateComplete;
        const track = this.renderRoot.querySelector('.date-picker-pager-track');
        await waitForMotion(track);
        if (this.swipeSettling && this.dragOffset === target) {
            finish();
        }
    }
    // ---------------------------------------------------------------------
    // Rendering.
    render() {
        if (this.inline) {
            return this.renderSurface();
        }
        if (this.isModal) {
            const titleId = 'title';
            return html `<dialog
        class="${classMap({
                'date-picker-dialog': true,
                'date-picker-dialog-closing': this.isClosing,
                'date-picker-dialog-fullscreen': this.fullscreen,
            })}"
        aria-labelledby="${titleId}"
        aria-describedby="headline"
      >
        ${this.modalSurface.shown ? this.renderSurface() : nothing}
      </dialog>`;
        }
        return html `${this.renderField()}${this.renderSurface()}`;
    }
    renderField() {
        const strings = this.resolvedStrings;
        const pattern = this.range
            ? `${this.inputFormat.pattern} – ${this.inputFormat.pattern}`
            : this.inputFormat.pattern;
        return html `<div class="date-picker-field">
      <md-gb-text-field
        class="date-picker-text-field"
        part="field"
        variant="outlined"
        density="${this.density}"
        label="${this.label || (this.range ? strings.rangeLabel : strings.dateLabel)}"
        placeholder="${pattern}"
        supporting-text="${this.supportingText || pattern}"
        autocomplete="off"
        .value=${live(this.fieldText)}
        ?error=${!!this.fieldError || this.field.hasError}
        error-text="${this.fieldError || this.field.message}"
        ?disabled=${this.disabled}
        has-trailing-icon
        @input=${this.handleFieldInput}
        @change=${this.handleFieldChange}
        @keydown=${this.handleFieldKeydown}
      >
        <button
          slot="trailing-icon"
          type="button"
          class="${iconButton({
            color: 'standard',
            size: 'sm',
            classes: { 'date-picker-calendar-button': true },
        })}"
          aria-label="${strings.openCalendar}"
          aria-haspopup="dialog"
          aria-expanded="${this.isOpenInternal ? 'true' : 'false'}"
          aria-controls="surface"
          ?disabled=${this.disabled}
          @click=${this.handleCalendarButtonClick}
        >
          ${icon(ICONS.calendar)}
        </button>
      </md-gb-text-field>
    </div>`;
    }
    renderSurface() {
        const strings = this.resolvedStrings;
        const input = this.isModal && this.mode === 'input';
        const classes = datePickerClasses({
            // The element marks the variants on its host; see date-picker.scss.
            range: this.range,
            open: this.isOpenInternal,
            closing: this.isClosing,
            inline: this.inline,
            scrolling: this.isScrolling,
            fullscreen: this.isModal && this.fullscreen,
        });
        const popup = !this.inline && !this.isModal;
        const title = this.range ? strings.rangeTitle : strings.title;
        return html `<div
      class="${classMap(classes)}"
      id="surface"
      part="container"
      popover=${popup ? 'manual' : nothing}
      role=${this.isModal ? nothing : popup ? 'dialog' : 'group'}
      aria-label=${this.isModal ? nothing : title}
      @keydown=${this.handleSurfaceKeydown}
    >
      ${this.isModal ? this.renderModalHeader() : nothing}
      ${input ? this.renderInputs() : this.renderCalendar()}
      ${this.renderActions()}
    </div>`;
    }
    renderModalHeader() {
        const strings = this.resolvedStrings;
        const input = this.mode === 'input';
        const locale = this.resolvedLocale;
        let title = this.range ? strings.rangeTitle : strings.title;
        if (this.range && input) {
            title = strings.rangeInputTitle;
        }
        let headline;
        let headlineLabel;
        const longFormat = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        if (this.range) {
            const short = {
                month: 'short',
                day: 'numeric',
            };
            const startText = this.pendingStart
                ? formatDate(this.pendingStart, locale, short)
                : strings.startDate;
            const endText = this.pendingEnd
                ? formatDate(this.pendingEnd, locale, short)
                : strings.endDate;
            headline = html `<span>${startText}</span
        ><span aria-hidden="true"> – </span><span>${endText}</span>`;
            headlineLabel = `${strings.startDate}: ${this.pendingStart
                ? formatDate(this.pendingStart, locale, longFormat)
                : '-'}, ${strings.endDate}: ${this.pendingEnd ? formatDate(this.pendingEnd, locale, longFormat) : '-'}`;
        }
        else {
            headline = this.pendingStart
                ? formatDate(this.pendingStart, locale, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                })
                : input
                    ? strings.inputHeadline
                    : strings.headline;
            headlineLabel = this.pendingStart
                ? formatDate(this.pendingStart, locale, longFormat)
                : String(headline);
        }
        this.headlineLabelText = headlineLabel;
        const fullscreen = this.fullscreen;
        return html `<div
        class="date-picker-header date-picker-modal-header"
        part="header"
      >
        ${fullscreen ? this.renderFullscreenBar() : nothing}
        <div class="date-picker-supporting-text" id="title">${title}</div>
        <div class="date-picker-headline-row">
          <div
            class="date-picker-headline"
            id="headline"
            role="heading"
            aria-level="2"
            aria-label="${headlineLabel}"
          >
            ${headline}
          </div>
          <button
            type="button"
            class="${iconButton({
            color: 'standard',
            size: 'sm',
            classes: { 'date-picker-mode-toggle': true },
        })}"
            aria-label="${input ? strings.switchToCalendar : strings.switchToInput}"
            ?disabled=${this.disabled}
            @click=${this.handleModeToggle}
          >
            ${icon(input ? ICONS.calendar : ICONS.edit)}
          </button>
        </div>
      </div>
      <hr
        class="${divider({ classes: { 'date-picker-divider': true } })}"
        aria-hidden="true"
      />`;
    }
    /**
     * The full-screen row: a close (x) icon button that cancels and a Save
     * text button that confirms (spec: "Mobile full-screen pickers also have
     * an additional close affordance (x) icon button and Save confirmation").
     */
    renderFullscreenBar() {
        const strings = this.resolvedStrings;
        return html `<div class="date-picker-fullscreen-bar">
      <button
        type="button"
        class="${iconButton({
            color: 'standard',
            size: 'sm',
            classes: { 'date-picker-close': true },
        })}"
        aria-label="${strings.close}"
        ?disabled=${this.disabled}
        @click=${() => {
            this.cancel();
        }}
      >
        ${icon(ICONS.close)}
      </button>
      ${this.hideActions
            ? nothing
            : html `<button
              type="button"
              class="${button({
                color: 'text',
                size: 'sm',
                classes: { 'date-picker-save': true },
            })}"
              ?disabled=${this.disabled}
              @click=${() => {
                this.confirm();
            }}
            >
              ${strings.save}
            </button>`}
    </div>`;
    }
    renderCalendar() {
        if (this.isScrolling) {
            return html `<div class="date-picker-calendar">
        ${this.renderScrollingMonths()}
      </div>`;
        }
        return html `<div class="date-picker-calendar">
      ${this.isModal ? this.renderModalNav() : this.renderDockedHeader()}
      <div class="date-picker-body">
        ${this.view === 'days'
            ? this.renderDays()
            : this.view === 'months'
                ? this.renderMonthList()
                : this.renderYearList()}
      </div>
    </div>`;
    }
    renderNavButton(path, label, offset, extraClass) {
        const strings = this.resolvedStrings;
        const id = extraClass.replace('date-picker-', '');
        const shortcut = {
            [-12]: [strings.previousYearShortcut, 'Shift+PageUp'],
            [-1]: [strings.previousMonthShortcut, 'PageUp'],
            [1]: [strings.nextMonthShortcut, 'PageDown'],
            [12]: [strings.nextYearShortcut, 'Shift+PageDown'],
        }[offset];
        return html `<button
        type="button"
        id="${id}"
        class="${iconButton({
            color: 'standard',
            size: 'sm',
            classes: { 'date-picker-nav-button': true, [extraClass]: true },
        })}"
        aria-label="${label}"
        aria-keyshortcuts="${shortcut[1]}"
        ?disabled=${!this.canGoToMonth(offset) || this.disabled}
        @click=${() => {
            this.navigate(offset);
        }}
      >
        ${icon(path, 'date-picker-icon-flip')}
      </button>
      ${this.renderTooltip(id, formatString(strings.shortcutTooltip, label, shortcut[0]))}`;
    }
    /**
     * A plain tooltip for an element of the calendar (spec accessibility:
     * "providing the shortcut key in the tooltip"; truncated weekday labels).
     */
    renderTooltip(anchorId, text) {
        return html `<md-gb-tooltip
      class="date-picker-tooltip"
      for="${anchorId}"
      ?quick=${this.quick}
      >${text}</md-gb-tooltip
    >`;
    }
    renderMenuButton(text, label, expanded, disabled, menuClass, onClick) {
        const strings = this.resolvedStrings;
        const id = menuClass.replace('date-picker-', '');
        const months = menuClass === 'date-picker-month-menu';
        const tooltip = formatString(strings.shortcutTooltip, months
            ? strings.selectMonth
            : this.isModal
                ? strings.switchToYearSelection
                : strings.selectYear, months ? strings.monthMenuShortcut : strings.yearMenuShortcut);
        return html `<button
        type="button"
        id="${id}"
        aria-keyshortcuts="${months ? 'Shift+M' : 'Shift+Y'}"
        class="${button({
            color: 'text',
            size: 'sm',
            classes: { 'date-picker-menu-button': true, [menuClass]: true },
        })}"
        aria-label="${label}"
        aria-haspopup="listbox"
        aria-expanded="${expanded ? 'true' : 'false'}"
        ?disabled=${disabled || this.disabled}
        @click=${onClick}
      >
        <span class="date-picker-menu-button-label">${text}</span>
        ${icon(ICONS.dropDown, `date-picker-menu-button-icon ${expanded ? 'date-picker-menu-button-icon-expanded' : ''}`)}
      </button>
      ${this.renderTooltip(id, tooltip)}`;
    }
    renderDockedHeader() {
        const strings = this.resolvedStrings;
        const locale = this.resolvedLocale;
        const displayed = {
            year: this.displayYear,
            month: this.displayMonth,
            day: 1,
        };
        const monthsOpen = this.view === 'months';
        const yearsOpen = this.view === 'years';
        const shortMonth = formatDate(displayed, locale, { month: 'short' });
        const longMonth = formatDate(displayed, locale, { month: 'long' });
        const year = formatNumber(this.displayYear, locale);
        return html `<div
        class="date-picker-header date-picker-docked-header ${this.view !== 'days' ? 'date-picker-header-list-open' : ''}"
        part="header"
      >
        <div class="date-picker-menu-group">
          ${this.renderNavButton(ICONS.previous, strings.previousMonth, -1, 'date-picker-previous-month')}
          ${this.renderMenuButton(shortMonth, `${strings.selectMonth}, ${longMonth}`, monthsOpen, yearsOpen, 'date-picker-month-menu', () => {
            this.openList('months');
        })}
          ${this.renderNavButton(ICONS.next, strings.nextMonth, 1, 'date-picker-next-month')}
        </div>
        <div class="date-picker-menu-group">
          ${this.renderNavButton(ICONS.previous, strings.previousYear, -12, 'date-picker-previous-year')}
          ${this.renderMenuButton(year, `${strings.selectYear}, ${year}`, yearsOpen, monthsOpen, 'date-picker-year-menu', () => {
            this.openList('years');
        })}
          ${this.renderNavButton(ICONS.next, strings.nextYear, 12, 'date-picker-next-year')}
        </div>
      </div>
      ${this.view !== 'days'
            ? html `<hr
              class="${divider({ classes: { 'date-picker-divider': true } })}"
              aria-hidden="true"
            />`
            : nothing}`;
    }
    renderModalNav() {
        const strings = this.resolvedStrings;
        const displayed = {
            year: this.displayYear,
            month: this.displayMonth,
            day: 1,
        };
        const monthYear = formatDate(displayed, this.resolvedLocale, {
            year: 'numeric',
            month: 'long',
        });
        const yearsOpen = this.view === 'years';
        return html `<div class="date-picker-nav" part="header">
      ${this.renderMenuButton(monthYear, `${monthYear}, ${yearsOpen ? strings.switchToDaySelection : strings.switchToYearSelection}`, yearsOpen, false, 'date-picker-year-menu', () => {
            this.openList('years');
        })}
      ${yearsOpen
            ? nothing
            : html `<div class="date-picker-nav-arrows">
              ${this.renderNavButton(ICONS.previous, strings.previousMonth, -1, 'date-picker-previous-month')}
              ${this.renderNavButton(ICONS.next, strings.nextMonth, 1, 'date-picker-next-month')}
            </div>`}
    </div>`;
    }
    renderDays() {
        const locale = this.resolvedLocale;
        const monthYear = formatDate({ year: this.displayYear, month: this.displayMonth, day: 1 }, locale, { year: 'numeric', month: 'long' });
        const slideClass = this.slide ? `date-picker-weeks-${this.slide}` : '';
        const dragging = this.dragOffset !== null;
        const displayed = {
            year: this.displayYear,
            month: this.displayMonth,
            day: 1,
        };
        // While swiping, the previous and next months sit beside the displayed
        // one (Compose's horizontal month pager).
        const adjacent = (offset) => {
            if (!this.canGoToMonth(offset)) {
                return nothing;
            }
            const month = addMonths(displayed, offset);
            return this.renderWeeks(month.year, month.month, `date-picker-weeks-adjacent date-picker-weeks-adjacent-${offset < 0 ? 'prev' : 'next'}`, true);
        };
        return html `<div
      class="date-picker-grid"
      part="grid"
      role="grid"
      aria-label="${monthYear}"
      @click=${this.handleGridClick}
      @keydown=${this.handleGridKeydown}
    >
      ${this.renderWeekdays(true)}
      <div
        class="${classMap({
            'date-picker-pager': true,
            'date-picker-pager-dragging': dragging,
        })}"
        @pointerdown=${this.handleSwipeStart}
        @pointermove=${this.handleSwipeMove}
        @pointerup=${this.handleSwipeEnd}
        @pointercancel=${this.handleSwipeCancel}
        @click=${this.handleSwipeClick}
      >
        <div
          class="${classMap({
            'date-picker-pager-track': true,
            'date-picker-pager-settling': this.swipeSettling,
        })}"
          style=${styleMap({ translate: dragging ? `${this.dragOffset}px 0` : undefined })}
        >
          ${keyed(this.slideKey, this.renderWeeks(this.displayYear, this.displayMonth, slideClass))}
          ${dragging ? html `${adjacent(-1)}${adjacent(1)}` : nothing}
        </div>
      </div>
    </div>`;
    }
    /**
     * The weekday labels. Narrow names are shown; the full name is the label
     * and, on pointer hover, a tooltip (spec: "Days of the week are not
     * interactive ... yet the tooltip is available on hover").
     */
    renderWeekdays(inGrid) {
        const locale = this.resolvedLocale;
        const firstDay = this.firstDay;
        const weekdays = getWeekdayNames(locale);
        const ordered = [
            ...weekdays.slice(firstDay),
            ...weekdays.slice(0, firstDay),
        ];
        return html `<div
        class="date-picker-weekdays"
        role=${inGrid ? 'row' : nothing}
        aria-hidden=${inGrid ? nothing : 'true'}
      >
        ${ordered.map((name, index) => html `<div
              class="date-picker-weekday"
              id="weekday-${index}"
              role=${inGrid ? 'columnheader' : nothing}
              aria-label="${name.long}"
            >
              <span aria-hidden="true">${name.narrow}</span>
            </div>`)}
      </div>
      <div class="date-picker-weekday-tooltips">
        ${ordered.map((name, index) => this.renderTooltip(`weekday-${index}`, name.long))}
      </div>`;
    }
    /** A month's weeks (`role="rowgroup"`). */
    renderWeeks(year, month, classes = '', hidden = false) {
        const grid = getMonthGrid(year, month, this.firstDay, this.isModal);
        return html `<div
      class="date-picker-weeks ${classes}"
      role="rowgroup"
      aria-hidden=${hidden ? 'true' : nothing}
      ?inert=${hidden}
    >
      ${grid.weeks.map((week) => html `<div class="date-picker-week" role="row">
            ${week.map(({ date, outside }) => this.renderDay(date, outside))}
          </div>`)}
    </div>`;
    }
    /**
     * The modal range calendar: the weekdays, then a vertically scrolling list
     * of every month in the year range, each with a month subhead (Compose
     * VerticalMonthsList). Months have one height, so only the months in view
     * (and the one holding the focused date) are rendered.
     */
    renderScrollingMonths() {
        const count = this.monthCount;
        const height = this.monthHeight;
        const viewport = Math.min(this.listHeight || height * 2, typeof window === 'undefined' ? Infinity : window.innerHeight || Infinity);
        const first = Math.max(0, Math.floor(this.listScrollTop / height) - MONTH_LIST_OVERSCAN);
        const last = Math.min(count - 1, Math.ceil((this.listScrollTop + viewport) / height) -
            1 +
            MONTH_LIST_OVERSCAN);
        const indices = [];
        for (let index = first; index <= last; index++) {
            indices.push(index);
        }
        const focused = this.monthIndex(this.focusedDate.year, this.focusedDate.month);
        if (focused >= 0 &&
            focused < count &&
            (focused < first || focused > last)) {
            indices.push(focused);
        }
        return html `<div class="date-picker-scrolling-weekdays">
        ${this.renderWeekdays(false)}
      </div>
      <div
        class="date-picker-months"
        @scroll=${this.handleListScroll}
        @click=${this.handleGridClick}
        @keydown=${this.handleGridKeydown}
      >
        <div
          class="date-picker-months-content"
          style=${styleMap({ blockSize: `${count * height}px` })}
        >
          ${repeat(indices, (index) => index, (index) => this.renderListMonth(index, height))}
        </div>
      </div>`;
    }
    renderListMonth(index, height) {
        const year = this.yearRange[0] + Math.floor(index / 12);
        const month = (index % 12) + 1;
        const label = formatDate({ year, month, day: 1 }, this.resolvedLocale, {
            year: 'numeric',
            month: 'long',
        });
        return html `<div
      class="date-picker-month"
      data-month="${toIsoDate({ year, month, day: 1 }).slice(0, 7)}"
      style=${styleMap({ insetBlockStart: `${index * height}px` })}
    >
      <div class="date-picker-month-subhead" id="month-${index}">${label}</div>
      <div
        class="date-picker-month-grid"
        part="grid"
        role="grid"
        aria-labelledby="month-${index}"
      >
        ${this.renderWeeks(year, month)}
      </div>
    </div>`;
    }
    renderDay(date, outside) {
        if (outside && this.isModal) {
            return html `<div class="date-picker-cell" role="gridcell"></div>`;
        }
        const strings = this.resolvedStrings;
        const locale = this.resolvedLocale;
        const start = this.pendingStart;
        const end = this.range ? this.pendingEnd : null;
        const isToday = isSameDate(date, today());
        const isStart = isSameDate(date, start);
        const isEnd = isSameDate(date, end);
        const selected = !outside && (isStart || isEnd);
        const complete = !!(this.range && start && end && !isSameDate(start, end));
        const inRange = !outside &&
            complete &&
            compareDates(date, start) >= 0 &&
            compareDates(date, end) <= 0;
        const disabled = this.isDisabled(date) || this.disabled;
        const focusable = !outside && isSameDate(date, this.focusedDate);
        const descriptions = [];
        if (this.range && isStart)
            descriptions.push(strings.startDate);
        else if (this.range && isEnd)
            descriptions.push(strings.endDate);
        else if (inRange)
            descriptions.push(strings.inRange);
        if (isToday)
            descriptions.push(strings.today);
        descriptions.push(formatDate(date, locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }));
        const cellClasses = {
            'date-picker-cell': true,
            'ripple-target': true,
            'focus-ring-target': true,
            'date-picker-cell-in-range': inRange,
            'date-picker-cell-range-start': inRange && isStart,
            'date-picker-cell-range-end': inRange && isEnd,
            'date-picker-cell-outside': outside,
        };
        return html `<div
      class="${classMap(cellClasses)}"
      role="gridcell"
      tabindex="${focusable ? 0 : -1}"
      aria-selected="${selected ? 'true' : 'false'}"
      aria-disabled="${disabled ? 'true' : nothing}"
      aria-current="${isToday ? 'date' : nothing}"
      aria-label="${descriptions.join(', ')}"
      data-date="${toIsoDate(date)}"
      ${ripple()}
    >
      <span
        class="${classMap({
            ...datePickerDayClasses({
                selected,
                today: isToday,
                outside,
                disabled,
                inRange,
                rangeStart: inRange && isStart,
                rangeEnd: inRange && isEnd,
            }),
            'focus-ring-outer': true,
        })}"
        aria-hidden="true"
        >${formatNumber(date.day, locale)}</span
      >
    </div>`;
    }
    renderMonthList() {
        const strings = this.resolvedStrings;
        const names = getMonthNames(this.resolvedLocale, 'long');
        return html `<div
      class="date-picker-list date-picker-month-list"
      role="listbox"
      aria-label="${strings.monthList}"
      @click=${this.handleListClick}
      @keydown=${this.handleListKeydown}
    >
      ${names.map((name, index) => this.renderListItem(name, index, index === this.displayMonth - 1, 'months'))}
    </div>`;
    }
    renderYearList() {
        const strings = this.resolvedStrings;
        const [first, last] = this.yearRange;
        const items = [];
        const currentYear = today().year;
        for (let year = first; year <= last; year++) {
            items.push(this.renderListItem(formatNumber(year, this.resolvedLocale), year - first, year === this.displayYear, 'years', year === currentYear));
        }
        return html `<div
      class="date-picker-list date-picker-year-list ${this.isModal ? 'date-picker-year-grid' : ''}"
      role="listbox"
      aria-label="${strings.yearList}"
      @click=${this.handleListClick}
      @keydown=${this.handleListKeydown}
    >
      ${items}
    </div>`;
    }
    renderListItem(label, index, selected, view, current = false) {
        const disabled = this.isListItemDisabled(view, index) || this.disabled;
        const yearGrid = this.isModal && view === 'years';
        return html `<div
      class="${classMap({
            'date-picker-list-item': true,
            'date-picker-list-item-selected': selected,
            'date-picker-list-item-current': current,
            'date-picker-year': yearGrid,
            'ripple-target': true,
            'focus-ring-target': true,
        })}"
      role="option"
      tabindex="${index === this.focusedIndex ? 0 : -1}"
      aria-selected="${selected ? 'true' : 'false'}"
      aria-disabled="${disabled ? 'true' : nothing}"
      data-index="${index}"
      ${ripple()}
    >
      <span
        class="${classMap({
            'date-picker-list-item-content': true,
            ripple: true,
            disabled,
            'focus-ring-outer': yearGrid,
            'focus-ring-inner': !yearGrid,
        })}"
        >${yearGrid
            ? nothing
            : html `<span class="date-picker-list-item-icon"
                >${selected ? icon(ICONS.check) : nothing}</span
              >`}<span class="date-picker-list-item-label">${label}</span></span
      >
    </div>`;
    }
    renderInputs() {
        const strings = this.resolvedStrings;
        const pattern = this.inputFormat.pattern;
        const field = (index, label) => html `<md-gb-text-field
        variant="outlined"
        density="${this.density}"
        class="date-picker-input-field"
        label="${label}"
        placeholder="${pattern}"
        supporting-text="${pattern}"
        autocomplete="off"
        inputmode="numeric"
        ?disabled=${this.disabled}
        .value=${live(this.inputTexts[index])}
        ?error=${!!this.inputErrors[index]}
        error-text="${this.inputErrors[index]}"
        @input=${(event) => {
            this.handleInputTextInput(index, event);
        }}
        @change=${(event) => {
            this.handleInputTextChange(index, event);
        }}
        @keydown=${(event) => {
            this.handleInputKeydown(index, event);
        }}
      ></md-gb-text-field>`;
        return html `<div class="date-picker-inputs">
      ${this.range
            ? html `${field(0, strings.startDate)}${field(1, strings.endDate)}`
            : field(0, strings.dateLabel)}
    </div>`;
    }
    renderActions() {
        // The docked menus replace the calendar and its actions; the modal
        // dialog keeps its actions below the year grid (Compose DatePickerDialog).
        if (this.hideActions ||
            (this.view !== 'days' && !this.isModal) ||
            // Full screen: the close icon button and Save replace the actions.
            (this.isModal && this.fullscreen)) {
            return nothing;
        }
        const strings = this.resolvedStrings;
        const textButton = (extra) => button({ color: 'text', size: 'sm', classes: { [extra]: true } });
        return html `<div class="date-picker-actions" part="actions">
      ${this.clearable
            ? html `<button
              type="button"
              class="${textButton('date-picker-clear')}"
              ?disabled=${this.disabled}
              @click=${this.handleClear}
            >
              ${strings.clear}
            </button>`
            : nothing}
      <span class="date-picker-actions-spacer"></span>
      <button
        type="button"
        class="${textButton('date-picker-cancel')}"
        ?disabled=${this.disabled}
        @click=${() => {
            this.cancel();
        }}
      >
        ${strings.cancel}
      </button>
      <button
        type="button"
        class="${textButton('date-picker-confirm')}"
        ?disabled=${this.disabled}
        @click=${() => {
            this.confirm();
        }}
      >
        ${strings.confirm}
      </button>
    </div>`;
    }
}
// Layer order is pinned by the `@layer` statement at the top of
// date-picker.scss, so `md.comp.date-picker` outranks the shared layers.
/** @nocollapse */
DatePickerElement.styles = [
    focusRingStyles,
    rippleStyles,
    iconButtonStyles,
    buttonStyles,
    dividerStyles,
    datePickerStyles,
    css `
      :host([hidden]) {
        display: none;
      }
      :host([quick]) *,
      :host([quick]) .date-picker-dialog::backdrop {
        transition: none !important;
        animation: none !important;
      }
    `,
];
__decorate([
    property({ reflect: true })
], DatePickerElement.prototype, "variant", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], DatePickerElement.prototype, "range", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], DatePickerElement.prototype, "inline", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], DatePickerElement.prototype, "fullscreen", void 0);
__decorate([
    property({ type: Number, reflect: true })
], DatePickerElement.prototype, "density", null);
__decorate([
    property({ type: Boolean, reflect: true })
], DatePickerElement.prototype, "required", void 0);
__decorate([
    property({ reflect: true })
], DatePickerElement.prototype, "mode", void 0);
__decorate([
    property()
], DatePickerElement.prototype, "value", void 0);
__decorate([
    property()
], DatePickerElement.prototype, "min", void 0);
__decorate([
    property()
], DatePickerElement.prototype, "max", void 0);
__decorate([
    property()
], DatePickerElement.prototype, "locale", void 0);
__decorate([
    property({ type: Number, attribute: 'first-day-of-week' })
], DatePickerElement.prototype, "firstDayOfWeek", void 0);
__decorate([
    property()
], DatePickerElement.prototype, "label", void 0);
__decorate([
    property({ attribute: 'supporting-text' })
], DatePickerElement.prototype, "supportingText", void 0);
__decorate([
    property({ type: Boolean, attribute: 'hide-actions' })
], DatePickerElement.prototype, "hideActions", void 0);
__decorate([
    property({ type: Boolean })
], DatePickerElement.prototype, "clearable", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], DatePickerElement.prototype, "error", void 0);
__decorate([
    property({ attribute: 'error-text' })
], DatePickerElement.prototype, "errorText", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], DatePickerElement.prototype, "quick", void 0);
__decorate([
    property({ attribute: false })
], DatePickerElement.prototype, "isDateDisabled", void 0);
__decorate([
    property({ attribute: false })
], DatePickerElement.prototype, "strings", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], DatePickerElement.prototype, "open", null);
__decorate([
    state()
], DatePickerElement.prototype, "pendingStart", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "pendingEnd", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "displayYear", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "displayMonth", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "focusedDate", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "focusedIndex", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "view", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "dockedClosing", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "slide", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "slideKey", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "fieldText", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "fieldError", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "inputTexts", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "inputErrors", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "dragOffset", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "swipeSettling", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "listScrollTop", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "listHeight", void 0);
__decorate([
    state()
], DatePickerElement.prototype, "monthHeight", void 0);
__decorate([
    query('.date-picker')
], DatePickerElement.prototype, "surface", void 0);
__decorate([
    query('dialog')
], DatePickerElement.prototype, "dialogElement", void 0);
__decorate([
    query('.date-picker-text-field')
], DatePickerElement.prototype, "textField", void 0);
__decorate([
    query('.date-picker-calendar-button')
], DatePickerElement.prototype, "calendarButton", void 0);
//# sourceMappingURL=date-picker-element.js.map