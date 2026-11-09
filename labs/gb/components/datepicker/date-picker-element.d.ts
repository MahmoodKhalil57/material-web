/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import '../textfield/md-gb-text-field.js';
import '../tooltip/md-gb-tooltip.js';
import { type CSSResultOrNative, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { createValidator, getValidityAnchor } from '../../../behaviors/constraint-validation.js';
import { getFormValue } from '../../../behaviors/form-associated.js';
import { onReportValidity } from '../../../behaviors/on-report-validity.js';
import { type Density } from '../shared/density.js';
import { type DatePickerMode, type DatePickerVariant } from './date-picker.js';
import { DatePickerValidator } from './date-picker-validator.js';
/**
 * The date picker's user-facing strings. Defaults are Compose Material 3's
 * English strings. `{0}` and `{1}` are replaced with arguments.
 */
export interface DatePickerStrings {
    /** Modal supporting text (single date). */
    title: string;
    /** Modal supporting text (range). */
    rangeTitle: string;
    /** Modal date input supporting text (range). */
    rangeInputTitle: string;
    /** Modal headline with no date selected. */
    headline: string;
    /** Modal date input headline with no date entered. */
    inputHeadline: string;
    startDate: string;
    endDate: string;
    /** Docked field and date input label (single date). */
    dateLabel: string;
    /** Docked field label (range). */
    rangeLabel: string;
    confirm: string;
    cancel: string;
    clear: string;
    /** Full-screen close icon button label. */
    close: string;
    /** Full-screen confirm button. */
    save: string;
    today: string;
    inRange: string;
    previousMonth: string;
    nextMonth: string;
    previousYear: string;
    nextYear: string;
    /** Docked month menu button label prefix. */
    selectMonth: string;
    /** Docked year menu button label prefix. */
    selectYear: string;
    switchToYearSelection: string;
    switchToDaySelection: string;
    switchToInput: string;
    switchToCalendar: string;
    /** Docked calendar icon button label. */
    openCalendar: string;
    monthList: string;
    yearList: string;
    /** `{0}`: the format pattern. */
    invalidPattern: string;
    /** `{0}`, `{1}`: the first and last year. */
    yearOutOfRange: string;
    /** `{0}`: the date. */
    notAllowed: string;
    invalidRange: string;
    /** Keyboard shortcut hints, shown in the arrow and menu button tooltips. */
    previousMonthShortcut: string;
    nextMonthShortcut: string;
    previousYearShortcut: string;
    nextYearShortcut: string;
    monthMenuShortcut: string;
    yearMenuShortcut: string;
    /** A button tooltip: `{0}` is the button's label, `{1}` its shortcut. */
    shortcutTooltip: string;
}
/** Default (English) strings, from Compose Material 3. */
export declare const DEFAULT_DATE_PICKER_STRINGS: DatePickerStrings;
/** The value detail of `input` and `change` events. */
export interface DatePickerValueDetail {
    /** The ISO date (`YYYY-MM-DD`), or the ISO interval `start/end` for a range. */
    value: string;
    /** The (start) date, or ''. */
    start: string;
    /** The range end date, or ''. */
    end: string;
}
/** Default selectable years (Compose `DatePickerDefaults.YearRange`). */
export declare const DEFAULT_YEAR_RANGE: readonly [1900, 2100];
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<(abstract new (...args: any[]) => import("../../../behaviors/element-internals.js").WithElementInternals) & typeof LitElement & import("../../../behaviors/form-associated.js").FormAssociatedConstructor, import("../../../behaviors/form-associated.js").FormAssociated>, import("../../../behaviors/constraint-validation.js").ConstraintValidation>, import("../../../behaviors/on-report-validity.js").OnReportValidity>;
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
export declare class DatePickerElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** `docked` (default) or `modal`. */
    variant: DatePickerVariant;
    /** Selects a start and end date. */
    range: boolean;
    /**
     * Renders the calendar surface in the page flow, always visible, instead
     * of a docked popup (without the text field) or a modal dialog.
     */
    inline: boolean;
    /**
     * Modal: the full-screen layout the spec recommends on compact windows.
     * The dialog covers the window and has a close (x) icon button and a
     * **Save** button in place of Cancel and OK.
     */
    fullscreen: boolean;
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
    get density(): Density;
    set density(density: number);
    private densityValue;
    /**
     * A value is required: with no date (or a range without an end date) the
     * picker is invalid (`valueMissing`).
     */
    required: boolean;
    /** Modal: shows the calendar (`picker`) or the date input (`input`). */
    mode: DatePickerMode;
    /**
     * The committed value: an ISO date (`YYYY-MM-DD`), or an ISO interval
     * (`start/end`) when `range` is set. Empty when nothing is selected.
     */
    value: string;
    /** The earliest selectable date (ISO). */
    min: string;
    /** The latest selectable date (ISO). */
    max: string;
    /** A BCP 47 locale. Defaults to the document's `lang`, else the browser's. */
    locale: string;
    /**
     * The first day of the week, 0 (Sunday) to 6 (Saturday). -1 (default)
     * uses the locale's.
     */
    firstDayOfWeek: number;
    /** Docked: the text field label. Defaults to "Date" (range: "Dates"). */
    label: string;
    /** Docked: the field's supporting text. Defaults to the date format, e.g. MM/DD/YYYY. */
    supportingText: string;
    /** Hides the Cancel and OK buttons; a selection is committed right away. */
    hideActions: boolean;
    /** Shows a Clear button that removes the selection. */
    clearable: boolean;
    /** Forces the error state of the docked field. */
    error: boolean;
    /** The message shown on the docked field while `error` is set. */
    errorText: string;
    /** Skips animations. */
    quick: boolean;
    /**
     * Returns true for dates that can't be selected (in addition to dates
     * outside `min` / `max`). Receives an ISO date.
     */
    isDateDisabled: ((date: string) => boolean) | null;
    /** Overrides for the user-facing strings. */
    strings: Partial<DatePickerStrings>;
    private dockedOpen;
    /** Whether the popup (docked) or dialog (modal) is open. */
    get open(): boolean;
    set open(value: boolean);
    /** The committed start date (ISO), or ''. */
    get start(): string;
    set start(value: string);
    /** The committed range end date (ISO), or ''. */
    get end(): string;
    set end(value: string);
    /** The pending (not yet confirmed) value, in the format of `value`. */
    get pendingValue(): string;
    private pendingStart;
    private pendingEnd;
    private displayYear;
    private displayMonth;
    private focusedDate;
    private focusedIndex;
    private view;
    private dockedClosing;
    /** Announces month changes to screen readers (polite). */
    private readonly announcer;
    /**
     * Modal variant: opens and closes the `<dialog>`, closes it with Escape,
     * back or the scrim, traps and restores focus, locks page scrolling and
     * fires the `open`, `opened`, `close` and `closed` events.
     */
    private readonly modalSurface;
    /** Docked variant: the calendar popup below the field. */
    private readonly overlay;
    /** Disabled by a disabled fieldset, which the attribute can't follow. */
    private readonly formDisabled;
    /** The dirty value and the validation error shown on the docked field. */
    private readonly field;
    private slide;
    private slideKey;
    private fieldText;
    private fieldError;
    private inputTexts;
    private inputErrors;
    /** Horizontal drag of the month (px) during a swipe, else null. */
    private dragOffset;
    /** The swipe was released and the month is springing into place. */
    private swipeSettling;
    private listScrollTop;
    private listHeight;
    private monthHeight;
    private readonly surface;
    private readonly dialogElement;
    private readonly textField;
    private readonly calendarButton;
    private focusAfterUpdate;
    private transitionCounter;
    /** The modal headline as last rendered, for the announcer. */
    private headlineLabelText;
    private announcedHeadline;
    private cachedFormat;
    private swipe;
    private suppressClick;
    /** Scroll the month list to the displayed month on the next layout. */
    private pendingListScroll;
    constructor();
    disconnectedCallback(): void;
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled(): boolean;
    set disabled(disabled: boolean);
    formDisabledCallback(disabled: boolean): void;
    attributeChangedCallback(attribute: string, oldValue: string | null, newValue: string | null): void;
    focus(options?: FocusOptions): void;
    /**
     * Opens the calendar popup (docked) or dialog (modal). The pending
     * selection starts from `value`, and focus moves to the selected date (or
     * today).
     */
    show(): Promise<void>;
    /**
     * Closes the popup or dialog without changing the value (use `confirm()`
     * to commit the pending selection).
     *
     * @param reason Passed in the `close` event's detail: `confirm`,
     *     `cancel`, or for a dialog `escape`, `back` or `scrim`.
     */
    close(reason?: string): Promise<void>;
    /**
     * Commits the pending selection to `value` (firing `change` if it changed)
     * and closes the popup or dialog. In the date input mode, invalid text
     * shows its error and keeps the picker open.
     *
     * @return Whether the selection was committed.
     */
    confirm(): boolean;
    /**
     * Discards the pending selection: fires a cancelable `cancel` event, then
     * closes the popup or dialog.
     *
     * @return Whether the picker was canceled (`cancel` wasn't prevented).
     */
    cancel(reason?: string): boolean;
    /** Shows the given month (`year`, `month` 1-12) in the calendar. */
    showMonth(year: number, month: number): void;
    [getFormValue](): string;
    formResetCallback(): void;
    formStateRestoreCallback(state: string): void;
    [createValidator](): DatePickerValidator;
    [getValidityAnchor](): HTMLElement;
    /** The committed value is a date, or a range with a start and an end. */
    private get isValueComplete();
    /** Docked: an invalid picker shows its validation message on the field. */
    [onReportValidity](invalidEvent: Event | null): void;
    private get resolvedStrings();
    private get resolvedLocale();
    private get firstDay();
    private get inputFormat();
    private get minDate();
    private get maxDate();
    private get yearRange();
    private get firstSelectable();
    private get lastSelectable();
    private get isModal();
    /** The modal range calendar: a vertically scrolling list of months. */
    private get isScrolling();
    /** The number of months in the scrolling month list (whole years). */
    private get monthCount();
    /** The month's position in the scrolling month list. */
    private monthIndex;
    private isRtl;
    private parseValue;
    private serialize;
    private valueDetail;
    /** Whether the date can be selected. */
    private isDisabled;
    private clampToRange;
    private get isSelectionComplete();
    private resetPending;
    private formatForInput;
    private formatFieldText;
    /** Validates a typed date; returns an error message or ''. */
    private validateDate;
    private commit;
    private dispatchInput;
    /** Selects a date as a click would. Returns whether it was selectable. */
    private selectDate;
    private setDockedOpen;
    /** Whether the picker is open (the dialog or the docked popup). */
    private get isOpenInternal();
    /** Whether the picker is animating closed. */
    private get isClosing();
    /** The modal variant renders a dialog (not inline). */
    private get isModalDialog();
    /** The docked variant renders a popup (not inline). */
    private get isDockedPopup();
    /** Shows the month of `date` and moves the roving focus into it. */
    private goToMonth;
    private canGoToMonth;
    private navigate;
    protected willUpdate(changed: PropertyValues<this>): void;
    protected updated(): void;
    /**
     * Announces the modal headline (the selected date or range) when a pick
     * changes it; opening the dialog doesn't announce it again.
     */
    private announceHeadline;
    private getFocusTarget;
    /**
     * Measures the scrolling month list (month height, viewport) and scrolls
     * it to the displayed month when asked to. The list is laid out only once
     * the dialog is open, so this retries on later updates until it is.
     */
    private syncMonthList;
    private waitForTransitions;
    /** The gap between the docked field and its popup. */
    private anchorSpacing;
    private readonly handleHostKeydown;
    private closeList;
    private readonly handleGridClick;
    private readonly handleGridKeydown;
    private openList;
    private readonly handleListKeydown;
    private readonly handleListClick;
    private selectListItem;
    private isListItemDisabled;
    private readonly handleCalendarButtonClick;
    private readonly handleFieldInput;
    private readonly handleFieldChange;
    private readonly handleFieldKeydown;
    /** Parses and commits the docked field's text, or shows its error. */
    private commitFieldText;
    private handleInputTextInput;
    private handleInputTextChange;
    private handleInputKeydown;
    /** Validates and reformats one date input field. */
    private validateInput;
    private validateInputs;
    private readonly handleModeToggle;
    private readonly handleClear;
    private isOnScrim;
    /** The month offset that a drag toward `dx` (physical px) reveals. */
    private swipeMonths;
    private readonly handleSwipeStart;
    private readonly handleSwipeMove;
    private readonly handleSwipeEnd;
    private addSwipeSample;
    /** Horizontal velocity (px/s) over the last samples; 0 after a pause. */
    private swipeVelocity;
    private readonly handleSwipeCancel;
    /** A swipe ends with a click on the calendar; it must not pick a date. */
    private readonly handleSwipeClick;
    /**
     * Springs the dragged month to `target` (px; the default effects spring,
     * like Compose's month snap), then shows the month `months` away.
     */
    private settleSwipe;
    private readonly handleListScroll;
    protected render(): TemplateResult<1>;
    private renderField;
    private renderSurface;
    private readonly handleSurfaceKeydown;
    private renderModalHeader;
    /**
     * The full-screen row: a close (x) icon button that cancels and a Save
     * text button that confirms (spec: "Mobile full-screen pickers also have
     * an additional close affordance (x) icon button and Save confirmation").
     */
    private renderFullscreenBar;
    private renderCalendar;
    private renderNavButton;
    /**
     * A plain tooltip for an element of the calendar (spec accessibility:
     * "providing the shortcut key in the tooltip"; truncated weekday labels).
     */
    private renderTooltip;
    private renderMenuButton;
    private renderDockedHeader;
    private renderModalNav;
    private renderDays;
    /**
     * The weekday labels. Narrow names are shown; the full name is the label
     * and, on pointer hover, a tooltip (spec: "Days of the week are not
     * interactive ... yet the tooltip is available on hover").
     */
    private renderWeekdays;
    /** A month's weeks (`role="rowgroup"`). */
    private renderWeeks;
    /**
     * The modal range calendar: the weekdays, then a vertically scrolling list
     * of every month in the year range, each with a month subhead (Compose
     * VerticalMonthsList). Months have one height, so only the months in view
     * (and the one holding the focused date) are rendered.
     */
    private renderScrollingMonths;
    private renderListMonth;
    private renderDay;
    private renderMonthList;
    private renderYearList;
    private renderListItem;
    private renderInputs;
    private renderActions;
}
export {};
