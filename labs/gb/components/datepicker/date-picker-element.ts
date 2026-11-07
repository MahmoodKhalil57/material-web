/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../textfield/md-gb-text-field.js';
import '../tooltip/md-gb-tooltip.js';

import {
  css,
  type CSSResultOrNative,
  html,
  isServer,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {keyed} from 'lit/directives/keyed.js';
import {repeat} from 'lit/directives/repeat.js';
import {live} from 'lit/directives/live.js';
import {styleMap} from 'lit/directives/style-map.js';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '../../../behaviors/constraint-validation.js';
import {mixinElementInternals} from '../../../behaviors/element-internals.js';
import {
  getFormValue,
  mixinFormAssociated,
} from '../../../behaviors/form-associated.js';
import {button} from '../button/button.js';
import {divider} from '../divider/divider.js';
import {iconButton} from '../iconbutton/icon-button.js';
import {ripple} from '../ripple/ripple.js';
import {clampDensity, type Density} from '../shared/density.js';
import {
  addMonths,
  type CalendarDate,
  clampDate,
  compareDates,
  type DateInputFormat,
  daysInMonth,
  defaultLocale,
  formatDate,
  formatInputDate,
  formatNumber,
  getDateInputFormat,
  getFirstDayOfWeek,
  getMonthGrid,
  getMonthNames,
  getWeekdayNames,
  isSameDate,
  parseInputDate,
  parseIsoDate,
  splitRangeText,
  toIsoDate,
  today,
} from './calendar.js';
import {
  DATE_PICKER_CLOSE_REASONS,
  datePickerClasses,
  datePickerDayClasses,
  type DatePickerMode,
  type DatePickerVariant,
  getKeyboardTargetDate,
} from './date-picker.js';
import {DatePickerValidator} from './date-picker-validator.js';

import buttonStyles from '../button/button.css' with {type: 'css'}; // github-only
// import buttonStyles from '../button/button.cssresult.js'; // google3-only
import dividerStyles from '../divider/divider.css' with {type: 'css'}; // github-only
// import dividerStyles from '../divider/divider.cssresult.js'; // google3-only
import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import iconButtonStyles from '../iconbutton/icon-button.css' with {type: 'css'}; // github-only
// import iconButtonStyles from '../iconbutton/icon-button.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import datePickerStyles from './date-picker.css' with {type: 'css'}; // github-only
// import datePickerStyles from './date-picker.cssresult.js'; // google3-only

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
export const DEFAULT_DATE_PICKER_STRINGS: DatePickerStrings = {
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
export const DEFAULT_YEAR_RANGE = [1900, 2100] as const;

type View = 'days' | 'months' | 'years';

const ICONS = {
  previous: 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  next: 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  dropDown: 'M7 10l5 5 5-5z',
  edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  calendar:
    'M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z',
  check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  close:
    'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
};

function icon(path: string, classes = '') {
  return html`<svg
    class="date-picker-icon ${classes}"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="${path}" />
  </svg>`;
}

function formatString(template: string, ...args: string[]) {
  return template.replace(/\{(\d)\}/g, (_, i) => args[Number(i)] ?? '');
}

/** Returns the focused element, looking inside open shadow roots. */
function getDeepActiveElement(): HTMLElement | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active as HTMLElement | null;
}

const baseClass = mixinConstraintValidation(
  mixinFormAssociated(mixinElementInternals(LitElement)),
);

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
  // Layer order is pinned by the `@layer` statement at the top of
  // date-picker.scss, so `md.comp.date-picker` outranks the shared layers.
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    iconButtonStyles,
    buttonStyles,
    dividerStyles,
    datePickerStyles,
    css`
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

  /** `docked` (default) or `modal`. */
  @property({reflect: true}) variant: DatePickerVariant = 'docked';

  /** Selects a start and end date. */
  @property({type: Boolean, reflect: true}) range = false;

  /**
   * Renders the calendar surface in the page flow, always visible, instead
   * of a docked popup (without the text field) or a modal dialog.
   */
  @property({type: Boolean, reflect: true}) inline = false;

  /**
   * Modal: the full-screen layout the spec recommends on compact windows.
   * The dialog covers the window and has a close (x) icon button and a
   * **Save** button in place of Cancel and OK.
   */
  @property({type: Boolean, reflect: true}) fullscreen = false;

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
  @property({type: Number, reflect: true})
  get density(): Density {
    return this.densityValue;
  }
  set density(density: number) {
    const old = this.densityValue;
    this.densityValue = clampDensity(Number(density));
    this.requestUpdate('density', old);
  }
  private densityValue: Density = 0;

  /**
   * A value is required: with no date (or a range without an end date) the
   * picker is invalid (`valueMissing`).
   */
  @property({type: Boolean, reflect: true}) required = false;

  /** Modal: shows the calendar (`picker`) or the date input (`input`). */
  @property({reflect: true}) mode: DatePickerMode = 'picker';

  /**
   * The committed value: an ISO date (`YYYY-MM-DD`), or an ISO interval
   * (`start/end`) when `range` is set. Empty when nothing is selected.
   */
  @property() value = '';

  /** The earliest selectable date (ISO). */
  @property() min = '';

  /** The latest selectable date (ISO). */
  @property() max = '';

  /** A BCP 47 locale. Defaults to the document's `lang`, else the browser's. */
  @property() locale = '';

  /**
   * The first day of the week, 0 (Sunday) to 6 (Saturday). -1 (default)
   * uses the locale's.
   */
  @property({type: Number, attribute: 'first-day-of-week'})
  firstDayOfWeek = -1;

  /** Docked: the text field label. Defaults to "Date" (range: "Dates"). */
  @property() label = '';

  /** Docked: the field's supporting text. Defaults to the date format, e.g. MM/DD/YYYY. */
  @property({attribute: 'supporting-text'}) supportingText = '';

  /** Hides the Cancel and OK buttons; a selection is committed right away. */
  @property({type: Boolean, attribute: 'hide-actions'}) hideActions = false;

  /** Shows a Clear button that removes the selection. */
  @property({type: Boolean}) clearable = false;

  /** Skips animations. */
  @property({type: Boolean, reflect: true}) quick = false;

  /**
   * Returns true for dates that can't be selected (in addition to dates
   * outside `min` / `max`). Receives an ISO date.
   */
  @property({attribute: false}) isDateDisabled:
    ((date: string) => boolean) | null = null;

  /** Overrides for the user-facing strings. */
  @property({attribute: false}) strings: Partial<DatePickerStrings> = {};

  private isOpenInternal = false;

  /** Whether the popup (docked) or dialog (modal) is open. */
  @property({type: Boolean, reflect: true})
  get open(): boolean {
    return this.isOpenInternal;
  }
  set open(value: boolean) {
    if (value === this.isOpenInternal) {
      return;
    }
    if (value) {
      this.show();
    } else {
      this.close(DATE_PICKER_CLOSE_REASONS.CANCEL);
    }
  }

  /** The committed start date (ISO), or ''. */
  get start(): string {
    const [start] = this.parseValue(this.value);
    return start ? toIsoDate(start) : '';
  }
  set start(value: string) {
    this.value = this.serialize(parseIsoDate(value), parseIsoDate(this.end));
  }

  /** The committed range end date (ISO), or ''. */
  get end(): string {
    const [, end] = this.parseValue(this.value);
    return end ? toIsoDate(end) : '';
  }
  set end(value: string) {
    this.value = this.serialize(parseIsoDate(this.start), parseIsoDate(value));
  }

  /** The pending (not yet confirmed) value, in the format of `value`. */
  get pendingValue(): string {
    return this.serialize(this.pendingStart, this.pendingEnd);
  }

  @state() private pendingStart: CalendarDate | null = null;
  @state() private pendingEnd: CalendarDate | null = null;
  @state() private displayYear = 0;
  @state() private displayMonth = 1;
  @state() private focusedDate: CalendarDate = today();
  @state() private focusedIndex = 0;
  @state() private view: View = 'days';
  @state() private isClosing = false;
  @state() private liveText = '';
  @state() private slide: '' | 'next' | 'prev' = '';
  @state() private slideKey = 0;
  @state() private fieldText = '';
  @state() private fieldError = '';
  @state() private inputTexts: [string, string] = ['', ''];
  @state() private inputErrors: [string, string] = ['', ''];
  /** Horizontal drag of the month (px) during a swipe, else null. */
  @state() private dragOffset: number | null = null;
  /** The swipe was released and the month is springing into place. */
  @state() private swipeSettling = false;
  @state() private listScrollTop = 0;
  @state() private listHeight = 0;
  @state() private monthHeight = DEFAULT_MONTH_HEIGHT;

  @query('.date-picker') private readonly surface!: HTMLElement | null;
  @query('dialog') private readonly dialogElement!: HTMLDialogElement | null;
  @query('.date-picker-text-field')
  private readonly textField!: HTMLElement | null;
  @query('.date-picker-calendar-button')
  private readonly calendarButton!: HTMLElement | null;

  private focusAfterUpdate: 'date' | 'list' | 'input' | '' = '';
  private transitionCounter = 0;
  private previouslyFocused: HTMLElement | null = null;
  private openAbort: AbortController | null = null;
  private cachedFormat: {locale: string; format: DateInputFormat} | null = null;
  private swipe: {
    pointerId: number;
    startX: number;
    startY: number;
    /** Recent pointer positions, for the release velocity. */
    samples: Array<{x: number; time: number}>;
    active: boolean;
  } | null = null;
  private suppressClick = false;
  /** Scroll the month list to the displayed month on the next layout. */
  private pendingListScroll = true;

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('keydown', this.handleHostKeydown);
      this.addEventListener('invalid', this.handleInvalid);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.openAbort?.abort();
    this.openAbort = null;
    if (this.isOpenInternal || this.isClosing) {
      this.transitionCounter++;
      this.isClosing = false;
      this.setOpenInternal(false);
    }
  }

  override focus(options?: FocusOptions) {
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
  async show(): Promise<void> {
    if (this.inline || (this.isOpenInternal && !this.isClosing)) {
      return;
    }
    const token = ++this.transitionCounter;
    this.resetPending();
    this.view = 'days';
    this.previouslyFocused = getDeepActiveElement();
    this.isClosing = false;
    this.setOpenInternal(true);
    await this.updateComplete;
    if (token !== this.transitionCounter || !this.isConnected) {
      return;
    }
    if (this.variant === 'modal') {
      const dialogElement = this.dialogElement;
      if (dialogElement && !dialogElement.open) {
        dialogElement.showModal();
      }
    } else {
      const surface = this.surface;
      try {
        if (surface && !surface.matches(':popover-open')) {
          surface.showPopover();
        }
      } catch {
        // Popover unsupported: the surface stays absolutely positioned.
      }
      this.positionPopup();
      this.listenWhileOpen();
    }
    this.focusAfterUpdate =
      this.mode === 'input' && this.variant === 'modal' ? 'input' : 'date';
    this.requestUpdate();
    this.dispatchEvent(new Event('open'));
  }

  /**
   * Closes the popup or dialog without changing the value (use `confirm()`
   * to commit the pending selection).
   *
   * @param reason Passed in the `close` event's detail.
   */
  async close(
    reason: string = DATE_PICKER_CLOSE_REASONS.CANCEL,
  ): Promise<void> {
    if (!this.isOpenInternal) {
      return;
    }
    this.dispatchEvent(new CustomEvent('close', {detail: {reason}}));
    const token = ++this.transitionCounter;
    this.openAbort?.abort();
    this.openAbort = null;
    this.setOpenInternal(false);
    this.isClosing = true;
    await this.updateComplete;
    await this.waitForTransitions();
    if (token !== this.transitionCounter) {
      return;
    }
    this.isClosing = false;
    if (this.variant === 'modal') {
      this.dialogElement?.close();
    } else {
      try {
        this.surface?.hidePopover();
      } catch {
        // Not shown as a popover.
      }
    }
    await this.updateComplete;
    this.restoreFocus();
  }

  /**
   * Commits the pending selection to `value` (firing `change` if it changed)
   * and closes the popup or dialog. In the date input mode, invalid text
   * shows its error and keeps the picker open.
   *
   * @return Whether the selection was committed.
   */
  confirm(): boolean {
    if (
      this.variant === 'modal' &&
      this.mode === 'input' &&
      !this.validateInputs()
    ) {
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
  cancel(): boolean {
    const proceed = this.dispatchEvent(
      new Event('cancel', {bubbles: true, cancelable: true}),
    );
    if (!proceed) {
      return false;
    }
    this.resetPending();
    if (!this.inline) {
      this.close(DATE_PICKER_CLOSE_REASONS.CANCEL);
    }
    return true;
  }

  /** Shows the given month (`year`, `month` 1-12) in the calendar. */
  showMonth(year: number, month: number) {
    this.goToMonth({year, month, day: this.focusedDate.day});
    this.pendingListScroll = true;
  }

  override [getFormValue]() {
    return this.value || null;
  }

  override formResetCallback() {
    this.value = this.getAttribute('value') ?? '';
  }

  override formStateRestoreCallback(state: string) {
    this.value = state;
  }

  override [createValidator]() {
    return new DatePickerValidator(() => ({
      required: this.required,
      complete: this.isValueComplete,
    }));
  }

  override [getValidityAnchor]() {
    return this.variant === 'docked' && !this.inline ? this.textField : null;
  }

  /** The committed value is a date, or a range with a start and an end. */
  private get isValueComplete() {
    const [start, end] = this.parseValue(this.value ?? '');
    return this.range ? !!(start && end) : !!start;
  }

  /** Docked: an invalid picker shows its validation message on the field. */
  private readonly handleInvalid = (event: Event) => {
    if (event.defaultPrevented || this.variant !== 'docked' || this.inline) {
      return;
    }
    this.fieldError = this.validationMessage;
  };

  // ---------------------------------------------------------------------
  // Model helpers.

  private get resolvedStrings(): DatePickerStrings {
    return {...DEFAULT_DATE_PICKER_STRINGS, ...this.strings};
  }

  private get resolvedLocale() {
    return this.locale || defaultLocale();
  }

  private get firstDay() {
    return this.firstDayOfWeek >= 0 && this.firstDayOfWeek <= 6
      ? Math.floor(this.firstDayOfWeek)
      : getFirstDayOfWeek(this.resolvedLocale);
  }

  private get inputFormat(): DateInputFormat {
    const locale = this.resolvedLocale;
    if (this.cachedFormat?.locale !== locale) {
      this.cachedFormat = {locale, format: getDateInputFormat(locale)};
    }
    return this.cachedFormat.format;
  }

  private get minDate() {
    const min = parseIsoDate(this.min);
    const max = parseIsoDate(this.max);
    return min && max && compareDates(min, max) > 0 ? null : min;
  }

  private get maxDate() {
    const min = parseIsoDate(this.min);
    const max = parseIsoDate(this.max);
    return min && max && compareDates(min, max) > 0 ? null : max;
  }

  private get yearRange(): [number, number] {
    return [
      this.minDate?.year ?? DEFAULT_YEAR_RANGE[0],
      this.maxDate?.year ?? DEFAULT_YEAR_RANGE[1],
    ];
  }

  private get firstSelectable(): CalendarDate {
    return this.minDate ?? {year: this.yearRange[0], month: 1, day: 1};
  }

  private get lastSelectable(): CalendarDate {
    return this.maxDate ?? {year: this.yearRange[1], month: 12, day: 31};
  }

  private get isModal() {
    return this.variant === 'modal';
  }

  /** The modal range calendar: a vertically scrolling list of months. */
  private get isScrolling() {
    return this.isModal && this.range && this.mode !== 'input';
  }

  /** The number of months in the scrolling month list (whole years). */
  private get monthCount() {
    const [first, last] = this.yearRange;
    return (last - first + 1) * 12;
  }

  /** The month's position in the scrolling month list. */
  private monthIndex(year: number, month: number) {
    return (year - this.yearRange[0]) * 12 + month - 1;
  }

  private isRtl() {
    try {
      return this.matches(':dir(rtl)');
    } catch {
      return getComputedStyle(this).direction === 'rtl';
    }
  }

  private parseValue(
    value: string,
  ): [CalendarDate | null, CalendarDate | null] {
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

  private serialize(start: CalendarDate | null, end: CalendarDate | null) {
    if (!start) {
      return '';
    }
    if (!this.range) {
      return toIsoDate(start);
    }
    return `${toIsoDate(start)}/${end ? toIsoDate(end) : ''}`;
  }

  private valueDetail(value: string): DatePickerValueDetail {
    const [start, end] = this.parseValue(value);
    return {
      value,
      start: start ? toIsoDate(start) : '',
      end: end ? toIsoDate(end) : '',
    };
  }

  /** Whether the date can be selected. */
  private isDisabled(date: CalendarDate) {
    if (
      compareDates(date, this.firstSelectable) < 0 ||
      compareDates(date, this.lastSelectable) > 0
    ) {
      return true;
    }
    return !!this.isDateDisabled?.(toIsoDate(date));
  }

  private clampToRange(date: CalendarDate) {
    return clampDate(date, this.firstSelectable, this.lastSelectable);
  }

  private get isSelectionComplete() {
    return this.range
      ? !!(this.pendingStart && this.pendingEnd)
      : !!this.pendingStart;
  }

  private resetPending() {
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

  private formatForInput(date: CalendarDate | null) {
    return date ? formatInputDate(date, this.inputFormat) : '';
  }

  private formatFieldText() {
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
  private validateDate(date: CalendarDate | null): string {
    const strings = this.resolvedStrings;
    if (!date) {
      return formatString(strings.invalidPattern, this.inputFormat.pattern);
    }
    const [first, last] = this.yearRange;
    if (date.year < first || date.year > last) {
      return formatString(
        strings.yearOutOfRange,
        formatNumber(first, this.resolvedLocale),
        formatNumber(last, this.resolvedLocale),
      );
    }
    if (this.isDisabled(date)) {
      return formatString(
        strings.notAllowed,
        formatDate(date, this.resolvedLocale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      );
    }
    return '';
  }

  private commit(value: string) {
    if (value === this.value) {
      return;
    }
    this.value = value;
    this.dispatchEvent(
      new CustomEvent<DatePickerValueDetail>('change', {
        bubbles: true,
        detail: this.valueDetail(value),
      }),
    );
  }

  private dispatchInput() {
    this.dispatchEvent(
      new CustomEvent<DatePickerValueDetail>('input', {
        bubbles: true,
        composed: true,
        detail: this.valueDetail(this.pendingValue),
      }),
    );
  }

  /** Selects a date as a click would. Returns whether it was selectable. */
  private selectDate(date: CalendarDate): boolean {
    if (this.isDisabled(date)) {
      return false;
    }
    if (!this.range) {
      this.pendingStart = date;
    } else if (!this.pendingStart || this.pendingEnd) {
      this.pendingStart = date;
      this.pendingEnd = null;
    } else if (compareDates(date, this.pendingStart) >= 0) {
      this.pendingEnd = date;
    } else {
      this.pendingStart = date;
    }
    this.focusedDate = date;
    if (
      !this.isScrolling &&
      (date.year !== this.displayYear || date.month !== this.displayMonth)
    ) {
      this.goToMonth(date);
    }
    this.dispatchInput();
    if (this.hideActions && this.isSelectionComplete) {
      this.confirm();
    }
    return true;
  }

  private setOpenInternal(open: boolean) {
    const prev = this.isOpenInternal;
    this.isOpenInternal = open;
    this.requestUpdate('open', prev);
  }

  /** Shows the month of `date` and moves the roving focus into it. */
  private goToMonth(date: CalendarDate) {
    const target = {
      year: date.year,
      month: date.month,
      day: Math.min(date.day, daysInMonth(date.year, date.month)),
    };
    const direction =
      target.year * 12 +
      target.month -
      (this.displayYear * 12 + this.displayMonth);
    if (direction !== 0) {
      this.slide = direction > 0 ? 'next' : 'prev';
      this.slideKey++;
      this.displayYear = target.year;
      this.displayMonth = target.month;
      this.liveText = formatDate(target, this.resolvedLocale, {
        year: 'numeric',
        month: 'long',
      });
    }
    this.focusedDate = target;
  }

  private canGoToMonth(offset: number) {
    const target = addMonths(
      {year: this.displayYear, month: this.displayMonth, day: 1},
      offset,
    );
    const first = this.firstSelectable;
    const last = this.lastSelectable;
    const index = target.year * 12 + target.month;
    return (
      index >= first.year * 12 + first.month &&
      index <= last.year * 12 + last.month
    );
  }

  private navigate(offset: number) {
    if (!this.canGoToMonth(offset)) {
      return;
    }
    this.goToMonth(addMonths(this.focusedDate, offset));
  }

  // ---------------------------------------------------------------------
  // Lifecycle.

  protected override willUpdate(changed: PropertyValues<this>) {
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
    if (
      changed.has('range') ||
      changed.has('variant') ||
      changed.has('mode') ||
      changed.has('min') ||
      changed.has('max')
    ) {
      this.pendingListScroll = true;
    }
  }

  protected override updated() {
    this.syncMonthList();
    const focus = this.focusAfterUpdate;
    if (!focus) {
      return;
    }
    this.focusAfterUpdate = '';
    if (focus === 'input') {
      this.renderRoot
        .querySelector<HTMLElement>('.date-picker-inputs md-gb-text-field')
        ?.focus();
      return;
    }
    const target = this.getFocusTarget();
    if (this.isScrolling && focus === 'date') {
      // Keep the month list still unless the date is out of view.
      target?.focus({preventScroll: true});
      target?.scrollIntoView?.({block: 'nearest'});
      return;
    }
    target?.focus();
    if (focus === 'list') {
      target?.scrollIntoView?.({block: 'center'});
    }
  }

  private getFocusTarget(): HTMLElement | null {
    if (this.view !== 'days') {
      return this.renderRoot.querySelector<HTMLElement>(
        '.date-picker-list [tabindex="0"]',
      );
    }
    return this.renderRoot.querySelector<HTMLElement>(
      '.date-picker-grid [tabindex="0"], .date-picker-months [tabindex="0"]',
    );
  }

  /**
   * Measures the scrolling month list (month height, viewport) and scrolls
   * it to the displayed month when asked to. The list is laid out only once
   * the dialog is open, so this retries on later updates until it is.
   */
  private syncMonthList() {
    const list = this.renderRoot.querySelector<HTMLElement>(
      '.date-picker-months',
    );
    if (!list || list.clientHeight === 0) {
      return;
    }
    const height =
      list.querySelector<HTMLElement>('.date-picker-month')?.offsetHeight ?? 0;
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

  private restoreFocus() {
    const previous = this.previouslyFocused;
    this.previouslyFocused = null;
    const active = getDeepActiveElement();
    if (active && active !== document.body && !this.containsDeep(active)) {
      // Focus already moved elsewhere (e.g. a click outside).
      return;
    }
    if (this.variant === 'docked') {
      this.calendarButton?.focus();
    } else if (previous?.isConnected) {
      previous.focus();
    }
  }

  /** Whether the node is this element or inside it, across shadow roots. */
  private containsDeep(node: Node) {
    let current: Node | null = node;
    while (current) {
      if (current === this) {
        return true;
      }
      const root = current.getRootNode();
      current = root instanceof ShadowRoot ? root.host : null;
    }
    return false;
  }

  private async waitForTransitions() {
    const element = this.isModal ? this.dialogElement : this.surface;
    if (this.quick || !element) {
      return;
    }
    const animations = element
      .getAnimations({subtree: true})
      .filter(
        (animation) =>
          (animation.effect as KeyframeEffect | null)?.target === element,
      );
    await Promise.all(
      animations.map((animation) =>
        animation.finished.catch(() => {
          // Ignore canceled transitions.
        }),
      ),
    );
  }

  /** Light dismiss and repositioning while the docked popup is open. */
  private listenWhileOpen() {
    this.openAbort?.abort();
    const abort = new AbortController();
    this.openAbort = abort;
    const {signal} = abort;
    document.addEventListener(
      'pointerdown',
      (event) => {
        if (!event.composedPath().includes(this)) {
          this.cancel();
        }
      },
      {signal, capture: true},
    );
    const reposition = () => {
      this.positionPopup();
    };
    window.addEventListener('resize', reposition, {signal});
    window.addEventListener('scroll', reposition, {signal, capture: true});
  }

  /** Places the docked popup below the field (above it if it doesn't fit). */
  private positionPopup() {
    const surface = this.surface;
    const anchor =
      this.renderRoot.querySelector<HTMLElement>('.date-picker-field');
    if (!surface || !anchor || this.inline || this.isModal) {
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const spacing =
      parseFloat(
        getComputedStyle(surface).getPropertyValue('--anchor-spacing'),
      ) || 0;
    const height = surface.offsetHeight;
    const width = surface.offsetWidth;
    const below = rect.bottom + spacing;
    const fitsBelow = below + height <= window.innerHeight;
    const top =
      fitsBelow || rect.top - spacing - height < 0
        ? below
        : rect.top - spacing - height;
    let left = this.isRtl() ? rect.right - width : rect.left;
    left = Math.max(0, Math.min(left, window.innerWidth - width));
    surface.style.top = `${Math.round(top)}px`;
    surface.style.left = `${Math.round(left)}px`;
  }

  // ---------------------------------------------------------------------
  // Event handlers.

  private readonly handleHostKeydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }
    const target = event.composedPath()[0];
    const inTextInput =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement;
    if (
      event.key === 'Escape' &&
      this.variant === 'docked' &&
      this.isOpenInternal
    ) {
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
    if (
      !event.shiftKey ||
      inTextInput ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }
    const key = event.key.toLowerCase();
    if (key === 'm' && !this.isModal) {
      event.preventDefault();
      this.renderRoot
        .querySelector<HTMLElement>('.date-picker-month-menu')
        ?.focus();
    } else if (key === 'y') {
      event.preventDefault();
      this.renderRoot
        .querySelector<HTMLElement>('.date-picker-year-menu')
        ?.focus();
    }
  };

  private closeList() {
    const menu = this.view === 'months' ? 'month' : 'year';
    this.view = 'days';
    this.updateComplete.then(() => {
      this.renderRoot
        .querySelector<HTMLElement>(`.date-picker-${menu}-menu`)
        ?.focus();
    });
  }

  private readonly handleGridClick = (event: MouseEvent) => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-date]',
    );
    const date = parseIsoDate(cell?.dataset['date']);
    if (date) {
      this.selectDate(date);
    }
  };

  private readonly handleGridKeydown = (event: KeyboardEvent) => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-date]',
    );
    const date = parseIsoDate(cell?.dataset['date']);
    if (!date) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const selected = this.selectDate(date);
      // Spec keyboard table: Enter closes the calendar and saves the date.
      if (
        event.key === 'Enter' &&
        selected &&
        !this.hideActions &&
        this.isSelectionComplete
      ) {
        this.confirm();
      }
      return;
    }
    const target = getKeyboardTargetDate(event, date, {rtl: this.isRtl()});
    if (!target) {
      return;
    }
    event.preventDefault();
    this.goToMonth(this.clampToRange(target));
    this.focusAfterUpdate = 'date';
  };

  private openList(view: View) {
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

  private readonly handleListKeydown = (event: KeyboardEvent) => {
    const option = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-index]',
    );
    if (!option) {
      return;
    }
    const index = Number(option.dataset['index']);
    const count =
      this.view === 'months' ? 12 : this.yearRange[1] - this.yearRange[0] + 1;
    const columns = this.isModal && this.view === 'years' ? 3 : 1;
    const forward = this.isRtl() ? -1 : 1;
    let next: number | null = null;
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

  private readonly handleListClick = (event: MouseEvent) => {
    const option = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-index]',
    );
    if (option && option.getAttribute('aria-disabled') !== 'true') {
      this.selectListItem(Number(option.dataset['index']));
    }
  };

  private selectListItem(index: number) {
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

  private isListItemDisabled(view: View, index: number) {
    const first = this.firstSelectable;
    const last = this.lastSelectable;
    if (view === 'months') {
      const value = this.displayYear * 12 + index + 1;
      return (
        value < first.year * 12 + first.month ||
        value > last.year * 12 + last.month
      );
    }
    const year = this.yearRange[0] + index;
    return year < first.year || year > last.year;
  }

  private readonly handleCalendarButtonClick = () => {
    if (this.isOpenInternal) {
      this.cancel();
    } else {
      this.show();
    }
  };

  private readonly handleFieldInput = (event: Event) => {
    event.stopPropagation();
    this.fieldText = (event.target as HTMLInputElement).value;
    this.fieldError = '';
  };

  private readonly handleFieldChange = (event: Event) => {
    event.stopPropagation();
    this.commitFieldText();
  };

  private readonly handleFieldKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.commitFieldText();
    } else if (event.key === 'ArrowDown' && event.altKey) {
      event.preventDefault();
      this.show();
    }
  };

  /** Parses and commits the docked field's text, or shows its error. */
  private commitFieldText() {
    const text = this.fieldText.trim();
    if (!text) {
      this.fieldError = '';
      this.commit('');
      this.resetPending();
      return;
    }
    let start: CalendarDate | null;
    let end: CalendarDate | null = null;
    if (this.range) {
      const parts = splitRangeText(text);
      start = parts ? parseInputDate(parts[0], this.inputFormat) : null;
      end = parts ? parseInputDate(parts[1], this.inputFormat) : null;
      const error = this.validateDate(start) || this.validateDate(end);
      if (error) {
        this.fieldError = error;
        return;
      }
      if (compareDates(end!, start!) < 0) {
        this.fieldError = this.resolvedStrings.invalidRange;
        return;
      }
    } else {
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

  private handleInputTextInput(index: 0 | 1, event: Event) {
    event.stopPropagation();
    const text = (event.target as HTMLInputElement).value;
    const texts: [string, string] = [...this.inputTexts];
    texts[index] = text;
    this.inputTexts = texts;
    const errors: [string, string] = [...this.inputErrors];
    errors[index] = '';
    this.inputErrors = errors;
    const date = parseInputDate(text, this.inputFormat);
    const valid = date && !this.validateDate(date) ? date : null;
    if (index === 0) {
      this.pendingStart = valid;
      if (!valid) this.pendingEnd = null;
      else if (this.range) {
        this.pendingEnd = parseInputDate(this.inputTexts[1], this.inputFormat);
        if (
          this.pendingEnd &&
          (this.validateDate(this.pendingEnd) ||
            compareDates(this.pendingEnd, valid) < 0)
        ) {
          this.pendingEnd = null;
        }
      }
    } else {
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

  private handleInputTextChange(index: 0 | 1, event: Event) {
    event.stopPropagation();
    this.validateInput(index);
  }

  private handleInputKeydown(index: 0 | 1, event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    if (this.validateInput(index) && (!this.range || index === 1)) {
      this.confirm();
    }
  }

  /** Validates and reformats one date input field. */
  private validateInput(index: 0 | 1): boolean {
    const text = this.inputTexts[index].trim();
    const errors: [string, string] = [...this.inputErrors];
    if (!text) {
      errors[index] = '';
      this.inputErrors = errors;
      return true;
    }
    const date = parseInputDate(text, this.inputFormat);
    let error = this.validateDate(date);
    if (!error && index === 1 && this.range) {
      const start = parseInputDate(this.inputTexts[0], this.inputFormat);
      if (start && compareDates(date!, start) < 0) {
        error = this.resolvedStrings.invalidRange;
      }
    }
    errors[index] = error;
    this.inputErrors = errors;
    if (!error && date) {
      const texts: [string, string] = [...this.inputTexts];
      texts[index] = formatInputDate(date, this.inputFormat);
      this.inputTexts = texts;
    }
    return !error;
  }

  private validateInputs() {
    const first = this.validateInput(0);
    const second = this.range ? this.validateInput(1) : true;
    return first && second;
  }

  private readonly handleModeToggle = () => {
    if (this.mode === 'picker') {
      this.inputTexts = [
        this.formatForInput(this.pendingStart),
        this.formatForInput(this.pendingEnd),
      ];
      this.inputErrors = ['', ''];
      this.mode = 'input';
      this.focusAfterUpdate = 'input';
    } else {
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

  private readonly handleClear = () => {
    this.pendingStart = null;
    this.pendingEnd = null;
    this.inputTexts = ['', ''];
    this.inputErrors = ['', ''];
    this.dispatchInput();
  };

  private readonly handleNativeCancel = (event: Event) => {
    if (event.target !== this.dialogElement) {
      return;
    }
    event.preventDefault();
    this.cancel();
  };

  private readonly handleNativeClose = () => {
    // The browser closed the dialog without `close()`: sync state.
    if (this.isOpenInternal) {
      this.transitionCounter++;
      this.isClosing = false;
      this.setOpenInternal(false);
      this.dispatchEvent(
        new CustomEvent('close', {
          detail: {reason: DATE_PICKER_CLOSE_REASONS.CANCEL},
        }),
      );
    }
  };

  private pointerDownOnScrim = false;

  private isOnScrim(event: MouseEvent) {
    const dialogElement = this.dialogElement;
    if (!dialogElement || event.composedPath()[0] !== dialogElement) {
      return false;
    }
    const rect = dialogElement.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  }

  private readonly handleDialogPointerDown = (event: PointerEvent) => {
    this.pointerDownOnScrim = this.isOnScrim(event);
  };

  private readonly handleDialogClick = (event: MouseEvent) => {
    const onScrim = this.pointerDownOnScrim && this.isOnScrim(event);
    this.pointerDownOnScrim = false;
    if (onScrim && this.isOpenInternal) {
      this.cancel();
    }
  };

  // ---------------------------------------------------------------------
  // Month swipe (one-month calendars) and the scrolling month list.

  /** The month offset that a drag toward `dx` (physical px) reveals. */
  private swipeMonths(dx: number) {
    if (dx === 0) {
      return 0;
    }
    // Dragging right reveals the previous month (the next one in RTL).
    const forward = this.isRtl() ? -1 : 1;
    return dx > 0 ? -forward : forward;
  }

  private readonly handleSwipeStart = (event: PointerEvent) => {
    this.suppressClick = false;
    if (!event.isPrimary || event.button !== 0 || this.swipeSettling) {
      return;
    }
    this.swipe = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      samples: [{x: event.clientX, time: event.timeStamp}],
      active: false,
    };
  };

  private readonly handleSwipeMove = (event: PointerEvent) => {
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
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      } catch {
        // The pointer is already gone.
      }
    }
    this.addSwipeSample(swipe, event);
    const width = (event.currentTarget as HTMLElement).clientWidth;
    // The calendar doesn't move past the first or last selectable month.
    const months = this.swipeMonths(dx);
    this.dragOffset =
      months && !this.canGoToMonth(months)
        ? 0
        : Math.max(-width, Math.min(width, dx));
    event.preventDefault();
  };

  private readonly handleSwipeEnd = (event: PointerEvent) => {
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
    const width = (event.currentTarget as HTMLElement).clientWidth || 1;
    const offset = this.dragOffset ?? 0;
    // Compose snap fling: a fling moves to the next month in its direction;
    // otherwise the month snaps to the closest position.
    let pages = 0;
    if (
      Math.abs(velocity) > SWIPE_FLING_VELOCITY &&
      Math.sign(velocity) === Math.sign(offset)
    ) {
      pages = Math.sign(offset);
    } else if (Math.abs(offset) > width / 2) {
      pages = Math.sign(offset);
    }
    let months = this.swipeMonths(pages);
    if (months && !this.canGoToMonth(months)) {
      pages = 0;
      months = 0;
    }
    this.settleSwipe(pages * width, months);
  };

  private addSwipeSample(
    swipe: NonNullable<DatePickerElement['swipe']>,
    event: PointerEvent,
  ) {
    swipe.samples.push({x: event.clientX, time: event.timeStamp});
    const oldest = event.timeStamp - SWIPE_VELOCITY_HORIZON_MS;
    while (swipe.samples.length > 2 && swipe.samples[0].time < oldest) {
      swipe.samples.shift();
    }
  }

  /** Horizontal velocity (px/s) over the last samples; 0 after a pause. */
  private swipeVelocity(swipe: NonNullable<DatePickerElement['swipe']>) {
    const last = swipe.samples[swipe.samples.length - 1];
    const first = swipe.samples.find(
      (sample) => sample.time >= last.time - SWIPE_VELOCITY_HORIZON_MS,
    );
    if (!first || first === last || last.time <= first.time) {
      return 0;
    }
    return ((last.x - first.x) / (last.time - first.time)) * 1000;
  }

  private readonly handleSwipeCancel = (event: PointerEvent) => {
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
  private readonly handleSwipeClick = {
    handleEvent: (event: MouseEvent) => {
      if (!this.suppressClick) {
        return;
      }
      this.suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    },
    capture: true,
  };

  /**
   * Springs the dragged month to `target` (px; the default effects spring,
   * like Compose's month snap), then shows the month `months` away.
   */
  private async settleSwipe(target: number, months: number) {
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
    const reduceMotion =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.quick || reduceMotion || this.dragOffset === target) {
      finish();
      return;
    }
    this.swipeSettling = true;
    this.dragOffset = target;
    await this.updateComplete;
    const track = this.renderRoot.querySelector('.date-picker-pager-track');
    await Promise.all(
      (track?.getAnimations() ?? []).map((animation) =>
        animation.finished.catch(() => {
          // Canceled: finish anyway.
        }),
      ),
    );
    if (this.swipeSettling && this.dragOffset === target) {
      finish();
    }
  }

  private readonly handleListScroll = (event: Event) => {
    const list = event.currentTarget as HTMLElement;
    this.listScrollTop = list.scrollTop;
    this.listHeight = list.clientHeight;
    // Compose updateDisplayedMonth: the first visible month is displayed.
    const index = Math.max(
      0,
      Math.min(
        this.monthCount - 1,
        Math.floor((list.scrollTop + 1) / this.monthHeight),
      ),
    );
    this.displayYear = this.yearRange[0] + Math.floor(index / 12);
    this.displayMonth = (index % 12) + 1;
  };

  // ---------------------------------------------------------------------
  // Rendering.

  protected override render() {
    if (this.inline) {
      return this.renderSurface();
    }
    if (this.isModal) {
      const titleId = 'title';
      return html`<dialog
        class="${classMap({
          'date-picker-dialog': true,
          'date-picker-dialog-closing': this.isClosing,
          'date-picker-dialog-fullscreen': this.fullscreen,
        })}"
        aria-labelledby="${titleId}"
        aria-describedby="headline"
        @cancel=${this.handleNativeCancel}
        @close=${this.handleNativeClose}
        @pointerdown=${this.handleDialogPointerDown}
        @click=${this.handleDialogClick}
      >
        ${this.isOpenInternal || this.isClosing ? this.renderSurface() : nothing}
      </dialog>`;
    }
    return html`${this.renderField()}${this.renderSurface()}`;
  }

  private renderField() {
    const strings = this.resolvedStrings;
    const pattern = this.range
      ? `${this.inputFormat.pattern} – ${this.inputFormat.pattern}`
      : this.inputFormat.pattern;
    return html`<div class="date-picker-field">
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
        ?error=${!!this.fieldError}
        error-text="${this.fieldError}"
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
            classes: {'date-picker-calendar-button': true},
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

  private renderSurface() {
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
    return html`<div
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
      <div class="date-picker-live" aria-live="polite" aria-atomic="true">
        ${this.liveText}
      </div>
    </div>`;
  }

  private readonly handleSurfaceKeydown = (event: KeyboardEvent) => {
    // Keep Tab inside the docked popup's natural order; nothing to do here
    // yet besides stopping text field shortcuts from reaching the host.
    if (
      event.key === 'Tab' &&
      this.variant === 'docked' &&
      this.isOpenInternal
    ) {
      const surface = this.surface;
      const focusable = surface
        ? [
            ...surface.querySelectorAll<HTMLElement>(
              'button:not([disabled]), [tabindex="0"]',
            ),
          ].filter(
            (el) => el.offsetParent !== null || el.getClientRects().length,
          )
        : [];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = this.shadowRoot?.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  private renderModalHeader() {
    const strings = this.resolvedStrings;
    const input = this.mode === 'input';
    const locale = this.resolvedLocale;
    let title = this.range ? strings.rangeTitle : strings.title;
    if (this.range && input) {
      title = strings.rangeInputTitle;
    }
    let headline: TemplateResult | string;
    let headlineLabel: string;
    const longFormat: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    if (this.range) {
      const short: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
      };
      const startText = this.pendingStart
        ? formatDate(this.pendingStart, locale, short)
        : strings.startDate;
      const endText = this.pendingEnd
        ? formatDate(this.pendingEnd, locale, short)
        : strings.endDate;
      headline = html`<span>${startText}</span
        ><span aria-hidden="true"> – </span><span>${endText}</span>`;
      headlineLabel = `${strings.startDate}: ${
        this.pendingStart
          ? formatDate(this.pendingStart, locale, longFormat)
          : '-'
      }, ${strings.endDate}: ${
        this.pendingEnd ? formatDate(this.pendingEnd, locale, longFormat) : '-'
      }`;
    } else {
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
    const fullscreen = this.fullscreen;
    return html`<div
        class="date-picker-header date-picker-modal-header"
        part="header"
      >
        ${fullscreen ? this.renderFullscreenBar() : nothing}
        <div class="date-picker-supporting-text" id="title">${title}</div>
        <div class="date-picker-headline-row">
          <div
            class="date-picker-headline"
            id="headline"
            aria-live="polite"
            aria-label="${headlineLabel}"
          >
            ${headline}
          </div>
          <button
            type="button"
            class="${iconButton({
              color: 'standard',
              size: 'sm',
              classes: {'date-picker-mode-toggle': true},
            })}"
            aria-label="${input ? strings.switchToCalendar : strings.switchToInput}"
            @click=${this.handleModeToggle}
          >
            ${icon(input ? ICONS.calendar : ICONS.edit)}
          </button>
        </div>
      </div>
      <hr
        class="${divider({classes: {'date-picker-divider': true}})}"
        aria-hidden="true"
      />`;
  }

  /**
   * The full-screen row: a close (x) icon button that cancels and a Save
   * text button that confirms (spec: "Mobile full-screen pickers also have
   * an additional close affordance (x) icon button and Save confirmation").
   */
  private renderFullscreenBar() {
    const strings = this.resolvedStrings;
    return html`<div class="date-picker-fullscreen-bar">
      <button
        type="button"
        class="${iconButton({
          color: 'standard',
          size: 'sm',
          classes: {'date-picker-close': true},
        })}"
        aria-label="${strings.close}"
        @click=${() => {
          this.cancel();
        }}
      >
        ${icon(ICONS.close)}
      </button>
      ${
        this.hideActions
          ? nothing
          : html`<button
              type="button"
              class="${button({
                color: 'text',
                size: 'sm',
                classes: {'date-picker-save': true},
              })}"
              @click=${() => {
                this.confirm();
              }}
            >
              ${strings.save}
            </button>`
      }
    </div>`;
  }

  private renderCalendar() {
    if (this.isScrolling) {
      return html`<div class="date-picker-calendar">
        ${this.renderScrollingMonths()}
      </div>`;
    }
    return html`<div class="date-picker-calendar">
      ${this.isModal ? this.renderModalNav() : this.renderDockedHeader()}
      <div class="date-picker-body">
        ${
          this.view === 'days'
            ? this.renderDays()
            : this.view === 'months'
              ? this.renderMonthList()
              : this.renderYearList()
        }
      </div>
    </div>`;
  }

  private renderNavButton(
    path: string,
    label: string,
    offset: -12 | -1 | 1 | 12,
    extraClass: string,
  ) {
    const strings = this.resolvedStrings;
    const id = extraClass.replace('date-picker-', '');
    const shortcut = {
      [-12]: [strings.previousYearShortcut, 'Shift+PageUp'],
      [-1]: [strings.previousMonthShortcut, 'PageUp'],
      [1]: [strings.nextMonthShortcut, 'PageDown'],
      [12]: [strings.nextYearShortcut, 'Shift+PageDown'],
    }[offset];
    return html`<button
        type="button"
        id="${id}"
        class="${iconButton({
          color: 'standard',
          size: 'sm',
          classes: {'date-picker-nav-button': true, [extraClass]: true},
        })}"
        aria-label="${label}"
        aria-keyshortcuts="${shortcut[1]}"
        ?disabled=${!this.canGoToMonth(offset)}
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
  private renderTooltip(anchorId: string, text: string) {
    return html`<md-gb-tooltip
      class="date-picker-tooltip"
      for="${anchorId}"
      ?quick=${this.quick}
      >${text}</md-gb-tooltip
    >`;
  }

  private renderMenuButton(
    text: string,
    label: string,
    expanded: boolean,
    disabled: boolean,
    menuClass: string,
    onClick: () => void,
  ) {
    const strings = this.resolvedStrings;
    const id = menuClass.replace('date-picker-', '');
    const months = menuClass === 'date-picker-month-menu';
    const tooltip = formatString(
      strings.shortcutTooltip,
      months
        ? strings.selectMonth
        : this.isModal
          ? strings.switchToYearSelection
          : strings.selectYear,
      months ? strings.monthMenuShortcut : strings.yearMenuShortcut,
    );
    return html`<button
        type="button"
        id="${id}"
        aria-keyshortcuts="${months ? 'Shift+M' : 'Shift+Y'}"
        class="${button({
          color: 'text',
          size: 'sm',
          classes: {'date-picker-menu-button': true, [menuClass]: true},
        })}"
        aria-label="${label}"
        aria-haspopup="listbox"
        aria-expanded="${expanded ? 'true' : 'false'}"
        ?disabled=${disabled}
        @click=${onClick}
      >
        <span class="date-picker-menu-button-label">${text}</span>
        ${icon(
          ICONS.dropDown,
          `date-picker-menu-button-icon ${expanded ? 'date-picker-menu-button-icon-expanded' : ''}`,
        )}
      </button>
      ${this.renderTooltip(id, tooltip)}`;
  }

  private renderDockedHeader() {
    const strings = this.resolvedStrings;
    const locale = this.resolvedLocale;
    const displayed = {
      year: this.displayYear,
      month: this.displayMonth,
      day: 1,
    };
    const monthsOpen = this.view === 'months';
    const yearsOpen = this.view === 'years';
    const shortMonth = formatDate(displayed, locale, {month: 'short'});
    const longMonth = formatDate(displayed, locale, {month: 'long'});
    const year = formatNumber(this.displayYear, locale);
    return html`<div
        class="date-picker-header date-picker-docked-header ${
          this.view !== 'days' ? 'date-picker-header-list-open' : ''
        }"
        part="header"
      >
        <div class="date-picker-menu-group">
          ${this.renderNavButton(ICONS.previous, strings.previousMonth, -1, 'date-picker-previous-month')}
          ${this.renderMenuButton(
            shortMonth,
            `${strings.selectMonth}, ${longMonth}`,
            monthsOpen,
            yearsOpen,
            'date-picker-month-menu',
            () => {
              this.openList('months');
            },
          )}
          ${this.renderNavButton(ICONS.next, strings.nextMonth, 1, 'date-picker-next-month')}
        </div>
        <div class="date-picker-menu-group">
          ${this.renderNavButton(ICONS.previous, strings.previousYear, -12, 'date-picker-previous-year')}
          ${this.renderMenuButton(
            year,
            `${strings.selectYear}, ${year}`,
            yearsOpen,
            monthsOpen,
            'date-picker-year-menu',
            () => {
              this.openList('years');
            },
          )}
          ${this.renderNavButton(ICONS.next, strings.nextYear, 12, 'date-picker-next-year')}
        </div>
      </div>
      ${
        this.view !== 'days'
          ? html`<hr
              class="${divider({classes: {'date-picker-divider': true}})}"
              aria-hidden="true"
            />`
          : nothing
      }`;
  }

  private renderModalNav() {
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
    return html`<div class="date-picker-nav" part="header">
      ${this.renderMenuButton(
        monthYear,
        `${monthYear}, ${yearsOpen ? strings.switchToDaySelection : strings.switchToYearSelection}`,
        yearsOpen,
        false,
        'date-picker-year-menu',
        () => {
          this.openList('years');
        },
      )}
      ${
        yearsOpen
          ? nothing
          : html`<div class="date-picker-nav-arrows">
              ${this.renderNavButton(ICONS.previous, strings.previousMonth, -1, 'date-picker-previous-month')}
              ${this.renderNavButton(ICONS.next, strings.nextMonth, 1, 'date-picker-next-month')}
            </div>`
      }
    </div>`;
  }

  private renderDays() {
    const locale = this.resolvedLocale;
    const monthYear = formatDate(
      {year: this.displayYear, month: this.displayMonth, day: 1},
      locale,
      {year: 'numeric', month: 'long'},
    );
    const slideClass = this.slide ? `date-picker-weeks-${this.slide}` : '';
    const dragging = this.dragOffset !== null;
    const displayed = {
      year: this.displayYear,
      month: this.displayMonth,
      day: 1,
    };
    // While swiping, the previous and next months sit beside the displayed
    // one (Compose's horizontal month pager).
    const adjacent = (offset: -1 | 1) => {
      if (!this.canGoToMonth(offset)) {
        return nothing;
      }
      const month = addMonths(displayed, offset);
      return this.renderWeeks(
        month.year,
        month.month,
        `date-picker-weeks-adjacent date-picker-weeks-adjacent-${offset < 0 ? 'prev' : 'next'}`,
        true,
      );
    };
    return html`<div
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
          style=${styleMap({translate: dragging ? `${this.dragOffset}px 0` : undefined})}
        >
          ${keyed(
            this.slideKey,
            this.renderWeeks(this.displayYear, this.displayMonth, slideClass),
          )}
          ${dragging ? html`${adjacent(-1)}${adjacent(1)}` : nothing}
        </div>
      </div>
    </div>`;
  }

  /**
   * The weekday labels. Narrow names are shown; the full name is the label
   * and, on pointer hover, a tooltip (spec: "Days of the week are not
   * interactive ... yet the tooltip is available on hover").
   */
  private renderWeekdays(inGrid: boolean) {
    const locale = this.resolvedLocale;
    const firstDay = this.firstDay;
    const weekdays = getWeekdayNames(locale);
    const ordered = [
      ...weekdays.slice(firstDay),
      ...weekdays.slice(0, firstDay),
    ];
    return html`<div
        class="date-picker-weekdays"
        role=${inGrid ? 'row' : nothing}
        aria-hidden=${inGrid ? nothing : 'true'}
      >
        ${ordered.map(
          (name, index) =>
            html`<div
              class="date-picker-weekday"
              id="weekday-${index}"
              role=${inGrid ? 'columnheader' : nothing}
              aria-label="${name.long}"
            >
              <span aria-hidden="true">${name.narrow}</span>
            </div>`,
        )}
      </div>
      <div class="date-picker-weekday-tooltips">
        ${ordered.map((name, index) =>
          this.renderTooltip(`weekday-${index}`, name.long),
        )}
      </div>`;
  }

  /** A month's weeks (`role="rowgroup"`). */
  private renderWeeks(
    year: number,
    month: number,
    classes = '',
    hidden = false,
  ) {
    const grid = getMonthGrid(year, month, this.firstDay, this.isModal);
    return html`<div
      class="date-picker-weeks ${classes}"
      role="rowgroup"
      aria-hidden=${hidden ? 'true' : nothing}
      ?inert=${hidden}
    >
      ${grid.weeks.map(
        (week) =>
          html`<div class="date-picker-week" role="row">
            ${week.map(({date, outside}) => this.renderDay(date, outside))}
          </div>`,
      )}
    </div>`;
  }

  /**
   * The modal range calendar: the weekdays, then a vertically scrolling list
   * of every month in the year range, each with a month subhead (Compose
   * VerticalMonthsList). Months have one height, so only the months in view
   * (and the one holding the focused date) are rendered.
   */
  private renderScrollingMonths() {
    const count = this.monthCount;
    const height = this.monthHeight;
    const viewport = Math.min(
      this.listHeight || height * 2,
      typeof window === 'undefined' ? Infinity : window.innerHeight || Infinity,
    );
    const first = Math.max(
      0,
      Math.floor(this.listScrollTop / height) - MONTH_LIST_OVERSCAN,
    );
    const last = Math.min(
      count - 1,
      Math.ceil((this.listScrollTop + viewport) / height) -
        1 +
        MONTH_LIST_OVERSCAN,
    );
    const indices: number[] = [];
    for (let index = first; index <= last; index++) {
      indices.push(index);
    }
    const focused = this.monthIndex(
      this.focusedDate.year,
      this.focusedDate.month,
    );
    if (
      focused >= 0 &&
      focused < count &&
      (focused < first || focused > last)
    ) {
      indices.push(focused);
    }
    return html`<div class="date-picker-scrolling-weekdays">
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
          style=${styleMap({blockSize: `${count * height}px`})}
        >
          ${repeat(
            indices,
            (index) => index,
            (index) => this.renderListMonth(index, height),
          )}
        </div>
      </div>`;
  }

  private renderListMonth(index: number, height: number) {
    const year = this.yearRange[0] + Math.floor(index / 12);
    const month = (index % 12) + 1;
    const label = formatDate({year, month, day: 1}, this.resolvedLocale, {
      year: 'numeric',
      month: 'long',
    });
    return html`<div
      class="date-picker-month"
      data-month="${toIsoDate({year, month, day: 1}).slice(0, 7)}"
      style=${styleMap({insetBlockStart: `${index * height}px`})}
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

  private renderDay(date: CalendarDate, outside: boolean) {
    if (outside && this.isModal) {
      return html`<div class="date-picker-cell" role="gridcell"></div>`;
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
    const inRange =
      !outside &&
      complete &&
      compareDates(date, start!) >= 0 &&
      compareDates(date, end!) <= 0;
    const disabled = this.isDisabled(date);
    const focusable = !outside && isSameDate(date, this.focusedDate);
    const descriptions = [];
    if (this.range && isStart) descriptions.push(strings.startDate);
    else if (this.range && isEnd) descriptions.push(strings.endDate);
    else if (inRange) descriptions.push(strings.inRange);
    if (isToday) descriptions.push(strings.today);
    descriptions.push(
      formatDate(date, locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    );
    const cellClasses = {
      'date-picker-cell': true,
      'ripple-target': true,
      'focus-ring-target': true,
      'date-picker-cell-in-range': inRange,
      'date-picker-cell-range-start': inRange && isStart,
      'date-picker-cell-range-end': inRange && isEnd,
      'date-picker-cell-outside': outside,
    };
    return html`<div
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

  private renderMonthList() {
    const strings = this.resolvedStrings;
    const names = getMonthNames(this.resolvedLocale, 'long');
    return html`<div
      class="date-picker-list date-picker-month-list"
      role="listbox"
      aria-label="${strings.monthList}"
      @click=${this.handleListClick}
      @keydown=${this.handleListKeydown}
    >
      ${names.map((name, index) =>
        this.renderListItem(
          name,
          index,
          index === this.displayMonth - 1,
          'months',
        ),
      )}
    </div>`;
  }

  private renderYearList() {
    const strings = this.resolvedStrings;
    const [first, last] = this.yearRange;
    const items = [];
    const currentYear = today().year;
    for (let year = first; year <= last; year++) {
      items.push(
        this.renderListItem(
          formatNumber(year, this.resolvedLocale),
          year - first,
          year === this.displayYear,
          'years',
          year === currentYear,
        ),
      );
    }
    return html`<div
      class="date-picker-list date-picker-year-list ${
        this.isModal ? 'date-picker-year-grid' : ''
      }"
      role="listbox"
      aria-label="${strings.yearList}"
      @click=${this.handleListClick}
      @keydown=${this.handleListKeydown}
    >
      ${items}
    </div>`;
  }

  private renderListItem(
    label: string,
    index: number,
    selected: boolean,
    view: View,
    current = false,
  ) {
    const disabled = this.isListItemDisabled(view, index);
    const yearGrid = this.isModal && view === 'years';
    return html`<div
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
        >${
          yearGrid
            ? nothing
            : html`<span class="date-picker-list-item-icon"
                >${selected ? icon(ICONS.check) : nothing}</span
              >`
        }<span class="date-picker-list-item-label">${label}</span></span
      >
    </div>`;
  }

  private renderInputs() {
    const strings = this.resolvedStrings;
    const pattern = this.inputFormat.pattern;
    const field = (index: 0 | 1, label: string) =>
      html`<md-gb-text-field
        variant="outlined"
        density="${this.density}"
        class="date-picker-input-field"
        label="${label}"
        placeholder="${pattern}"
        supporting-text="${pattern}"
        autocomplete="off"
        inputmode="numeric"
        .value=${live(this.inputTexts[index])}
        ?error=${!!this.inputErrors[index]}
        error-text="${this.inputErrors[index]}"
        @input=${(event: Event) => {
          this.handleInputTextInput(index, event);
        }}
        @change=${(event: Event) => {
          this.handleInputTextChange(index, event);
        }}
        @keydown=${(event: KeyboardEvent) => {
          this.handleInputKeydown(index, event);
        }}
      ></md-gb-text-field>`;
    return html`<div class="date-picker-inputs">
      ${
        this.range
          ? html`${field(0, strings.startDate)}${field(1, strings.endDate)}`
          : field(0, strings.dateLabel)
      }
    </div>`;
  }

  private renderActions() {
    // The docked menus replace the calendar and its actions; the modal
    // dialog keeps its actions below the year grid (Compose DatePickerDialog).
    if (
      this.hideActions ||
      (this.view !== 'days' && !this.isModal) ||
      // Full screen: the close icon button and Save replace the actions.
      (this.isModal && this.fullscreen)
    ) {
      return nothing;
    }
    const strings = this.resolvedStrings;
    const textButton = (extra: string) =>
      button({color: 'text', size: 'sm', classes: {[extra]: true}});
    return html`<div class="date-picker-actions" part="actions">
      ${
        this.clearable
          ? html`<button
              type="button"
              class="${textButton('date-picker-clear')}"
              @click=${this.handleClear}
            >
              ${strings.clear}
            </button>`
          : nothing
      }
      <span class="date-picker-actions-spacer"></span>
      <button
        type="button"
        class="${textButton('date-picker-cancel')}"
        @click=${() => {
          this.cancel();
        }}
      >
        ${strings.cancel}
      </button>
      <button
        type="button"
        class="${textButton('date-picker-confirm')}"
        @click=${() => {
          this.confirm();
        }}
      >
        ${strings.confirm}
      </button>
    </div>`;
  }
}
