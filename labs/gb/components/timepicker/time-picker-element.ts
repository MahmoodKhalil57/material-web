/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

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
import {styleMap} from 'lit/directives/style-map.js';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '../../../behaviors/constraint-validation.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '../../../behaviors/form-associated.js';
import {mixinElementInternals} from '../../../behaviors/element-internals.js';
import {button} from '../button/button.js';
import {iconButton} from '../iconbutton/icon-button.js';
import {ripple} from '../ripple/ripple.js';
import {AnnouncerController} from '../shared/announcer.js';
import {clampDensity, type Density} from '../shared/density.js';
import {FormDisabledController} from '../shared/form-field.js';
import {ModalSurfaceController} from '../shared/modal-surface.js';
import {TimePickerValidator} from './time-picker-validator.js';
import {waitForMotion} from '../shared/motion.js';
import {
  angleToValue,
  displayHour12,
  formatTime,
  localePeriodLabels,
  localeUses24Hour,
  nearestAngle,
  parseTime,
  pointToAngle,
  timePickerClasses,
  type TimeOfDay,
  type TimePickerMode,
  type TimePickerOrientation,
  type TimePickerSelection,
  valueToAngle,
} from './time-picker.js';

import buttonStyles from '../button/button.css' with {type: 'css'}; // github-only
// import buttonStyles from '../button/button.cssresult.js'; // google3-only
import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import iconButtonStyles from '../iconbutton/icon-button.css' with {type: 'css'}; // github-only
// import iconButtonStyles from '../iconbutton/icon-button.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import timePickerStyles from './time-picker.css' with {type: 'css'}; // github-only
// import timePickerStyles from './time-picker.cssresult.js'; // google3-only

/** The 12-hour clock dial labels, clockwise from the top. */
const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
/** The 24-hour outer ring: hours 0-11. */
const HOURS_24_OUTER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
/** The 24-hour inner ring: hours 12-23. */
const HOURS_24_INNER = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

// Compose OuterCircleToSizeRatio, InnerCircleToSizeRatio and MaxDistance,
// relative to the 256dp ClockDialContainerSize.
const OUTER_RADIUS_RATIO = 101 / 256;
const INNER_RADIUS_RATIO = 69 / 256;
const INNER_RING_MAX_DISTANCE_RATIO = 74 / 256;

/** How long typed digits combine into one number (type-ahead). */
const TYPE_AHEAD_MS = 1000;

/**
 * Viewport where the automatic orientation picks the horizontal layout: a
 * landscape viewport too short for the vertical dial (spec page "Adaptive
 * design": landscape when viewport height is limited, Compose
 * `defaultTimePickerLayoutType`).
 */
export const HORIZONTAL_LAYOUT_QUERY =
  '(orientation: landscape) and (max-height: 599.98px)';

/**
 * Viewport where the horizontal dial layout no longer fits without scrolling
 * (406dp tall plus the dialog's 24dp window margins): the dial picker falls
 * back to the input picker (spec page "Adaptive design": "Time pickers can
 * fallback to the input time picker when there isn't enough vertical real
 * estate to present the landscape orientation without scrolling").
 */
export const INPUT_FALLBACK_QUERY =
  '(orientation: landscape) and (max-height: 453.98px)';

const KEYBOARD_ICON =
  'M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z';
const CLOCK_ICON =
  'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z';

/** The 12/24-hour setting: from the locale (`''`) or forced. */
export type TimePickerHourCycle = '' | '12' | '24';

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function currentTime(): TimeOfDay {
  const now = new Date();
  return {hour: now.getHours(), minute: now.getMinutes()};
}

// spec-labels: time-pickers/guidelines/anatomy, time-pickers/specs/anatomy/time-picker-dial, time-pickers/specs/anatomy/time-picker-input
// spec-labels: time-pickers/specs/measurements/time-picker-dial-vertical, time-pickers/specs/measurements/time-picker-dial-horizontal, time-pickers/specs/measurements/time-picker-input
// spec-labels: time-pickers/specs/states, time-pickers/specs/configurations/vertical-orientation-and-horizontal-orientation
// spec-labels: time-pickers/specs/configurations/12-hour-and-24-hour-time-picker-inputs
const baseClass = mixinConstraintValidation(
  mixinFormAssociated(mixinElementInternals(LitElement)),
);

/**
 * A Material Design time picker: lets people pick an hour and minute on a
 * clock dial, or type them in hour and minute fields.
 *
 * The dial mode shows hour and minute time selectors above (vertical) or
 * beside (horizontal) a clock dial. Picking an hour on the dial (tap or drag
 * the selector handle) moves on to the minutes. 12-hour clocks show an AM/PM
 * period selector; 24-hour clocks show hours 12-23 on an inner ring. The
 * input mode shows hour and minute text fields. The keyboard / clock icon
 * button switches modes.
 *
 * By default the picker renders inline. With `modal`, it opens as a modal
 * dialog above a scrim (`show()` / `close()` / `open`); Cancel, Escape and a
 * scrim click cancel it, and OK confirms it.
 *
 * The value is a 24-hour `HH:MM` string like `<input type="time">`, and is
 * submitted with forms under `name`. With actions (default), the value is
 * committed by OK; with `hide-actions`, every change commits.
 *
 * @fires {Event} input - Fired whenever the picked time changes (dial drag, key, typed digits, period). Read the pending time from `pendingValue`.
 * @fires {Event} change - Fired when a new `value` is committed (OK, or the end of an interaction with `hide-actions`).
 * @fires {Event} cancel - Fired when picking is canceled (Cancel, Escape, scrim click). Cancelable for a modal picker; canceling keeps it open.
 * @fires {Event} open - Fired when a modal picker opens.
 * @fires {Event} close - Fired when a modal picker closes.
 * @csspart container - The picker container (a `<dialog>` when modal).
 * @csspart headline - The headline.
 * @csspart dial - The clock dial.
 * @csspart actions - The actions row.
 * @cssprop --container-color - Container color.
 * @cssprop --container-elevation - Container elevation (modal).
 * @cssprop --container-shape - Container corner radius.
 * @cssprop --container-padding - Container padding.
 * @cssprop --headline - Headline typography.
 * @cssprop --headline-color - Headline color.
 * @cssprop --clock-dial-color - Clock dial color.
 * @cssprop --clock-dial-container-size - Clock dial size.
 * @cssprop --clock-dial-label-text - Clock dial number typography.
 * @cssprop --clock-dial-unselected-label-text-color - Clock dial number color.
 * @cssprop --clock-dial-selected-label-text-color - Clock dial number color under the selector handle.
 * @cssprop --clock-dial-selector-handle-container-color - Selector handle color.
 * @cssprop --clock-dial-selector-handle-container-size - Selector handle size.
 * @cssprop --clock-dial-selector-track-container-color - Selector track color.
 * @cssprop --clock-dial-selector-track-container-width - Selector track width.
 * @cssprop --clock-dial-selector-center-container-color - Selector center dot color.
 * @cssprop --clock-dial-selector-center-container-size - Selector center dot size.
 * @cssprop --time-selector-container-width - Hour and minute selector width.
 * @cssprop --time-selector-24h-vertical-container-width - Hour and minute selector width in the 24-hour vertical layout.
 * @cssprop --time-selector-container-height - Hour and minute selector height.
 * @cssprop --time-selector-container-shape - Hour and minute selector corner radius.
 * @cssprop --time-selector-label-text - Hour and minute selector typography.
 * @cssprop --time-selector-selected-container-color - Selected hour or minute selector color.
 * @cssprop --time-selector-selected-label-text-color - Selected hour or minute selector text color.
 * @cssprop --time-selector-unselected-container-color - Unselected hour or minute selector color.
 * @cssprop --time-selector-unselected-label-text-color - Unselected hour or minute selector text color.
 * @cssprop --time-selector-separator - Separator typography.
 * @cssprop --time-selector-separator-color - Separator color.
 * @cssprop --period-selector-container-shape - Period selector corner radius.
 * @cssprop --period-selector-outline-color - Period selector outline color.
 * @cssprop --period-selector-outline-width - Period selector outline width.
 * @cssprop --period-selector-label-text - Period selector typography.
 * @cssprop --period-selector-selected-container-color - Selected period color.
 * @cssprop --period-selector-selected-label-text-color - Selected period text color.
 * @cssprop --period-selector-unselected-label-text-color - Unselected period text color.
 * @cssprop --period-selector-vertical-container-width - Vertical period selector width.
 * @cssprop --period-selector-vertical-container-height - Vertical period selector height.
 * @cssprop --period-selector-horizontal-container-width - Horizontal period selector width.
 * @cssprop --period-selector-horizontal-container-height - Horizontal period selector height.
 * @cssprop --time-input-field-container-width - Input mode field width.
 * @cssprop --time-input-field-container-height - Input mode field height.
 * @cssprop --time-input-field-container-color - Input mode field color.
 * @cssprop --time-input-field-focus-container-color - Focused input mode field color.
 * @cssprop --time-input-field-focus-outline-color - Focused input mode field outline color.
 * @cssprop --time-input-field-label-text - Input mode field typography.
 * @cssprop --time-input-field-supporting-text - Input mode field label typography.
 * @cssprop --scrim-color - Modal scrim color.
 * @cssprop --scrim-opacity - Modal scrim opacity.
 * @cssprop --density-step - Size removed per density step (time selectors,
 *   input fields, period selector, dial).
 */
export class TimePickerElement extends baseClass {
  // Layer order is pinned by the `@layer` statement at the top of
  // time-picker.scss, so `md.comp.time-picker` outranks the shared layers.
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    iconButtonStyles,
    buttonStyles,
    timePickerStyles,
    css`
      :host([quick]) *,
      :host([quick]) .time-picker::backdrop {
        transition: none !important;
      }
    `,
  ];

  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * The committed time as a 24-hour `HH:MM` string (`<input type="time">`
   * format), or `''` when no time is set.
   */
  @property()
  get value(): string {
    return this.committed ? formatTime(this.committed) : '';
  }
  set value(value: string) {
    const prev = this.value;
    this.committed = parseTime(value);
    if (!this.isInteracting) {
      this.resetPending();
    }
    this.requestUpdate('value', prev);
  }

  /**
   * `dial` (clock dial) or `input` (hour and minute text fields).
   */
  @property({reflect: true}) mode: TimePickerMode = 'dial';

  /**
   * The dial layout: `vertical`, `horizontal`, or `''` (default) to pick
   * one from the viewport (horizontal in short landscape viewports).
   */
  @property({reflect: true}) orientation: TimePickerOrientation | '' = '';

  /**
   * The density, from 0 (default) to -3 (time-pickers.md "Density",
   * "High-density time picker"). Each step down removes 4px from the time
   * selectors (80px), input fields (72px), the period selector (which
   * follows their height) and the dial (256px); the time selectors, fields
   * and dial labels stay at least 48px. The horizontal layout, used
   * when the viewport is short, keeps the full-size dial ("Don't apply
   * density to the time picker dial when the viewport is constrained.
   * Instead, use an input picker"). Values are clamped to that range.
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
   * `12` (with an AM/PM period selector), `24`, or `''` (default) to follow
   * the locale's clock (`Intl.DateTimeFormat`).
   */
  @property({attribute: 'hour-cycle'}) hourCycle: TimePickerHourCycle = '';

  /**
   * The locale used for the 12/24-hour default and the AM/PM labels. Defaults
   * to the browser locale.
   */
  @property() locale = '';

  /**
   * The headline. Defaults to "Select time" (dial) or "Enter time" (input).
   */
  @property() headline = '';

  /** Renders the picker as a modal dialog, shown with `show()` or `open`. */
  @property({type: Boolean, reflect: true}) modal = false;

  /** Hides the Cancel and OK actions; every change commits the value. */
  @property({type: Boolean, reflect: true, attribute: 'hide-actions'})
  hideActions = false;

  /** Hides the dial / input mode toggle button. */
  @property({type: Boolean, reflect: true, attribute: 'hide-mode-toggle'})
  hideModeToggle = false;

  /** Skips transitions. */
  @property({type: Boolean, reflect: true}) quick = false;

  /**
   * Whether a time is required: with no time the picker is invalid
   * (`valueMissing`) and blocks the form's submit.
   */
  @property({type: Boolean, reflect: true}) required = false;

  /** Cancel action label. */
  @property({attribute: 'cancel-label'}) cancelLabel = 'Cancel';

  /** OK action label. */
  @property({attribute: 'confirm-label'}) confirmLabel = 'OK';

  /** Accessible label of the hour selector and the dial in hour mode. */
  @property({attribute: 'select-hour-label'}) selectHourLabel = 'Select hour';

  /** Accessible label of the minute selector and the dial in minute mode. */
  @property({attribute: 'select-minute-label'})
  selectMinuteLabel = 'Select minutes';

  /** Accessible label of the period selector. */
  @property({attribute: 'period-label'}) periodLabel = 'Select AM or PM';

  /** Hour field label (input mode). */
  @property({attribute: 'hour-label'}) hourLabel = 'Hour';

  /** Minute field label (input mode). */
  @property({attribute: 'minute-label'}) minuteLabel = 'Minute';

  /** Accessible label of the mode toggle in dial mode. */
  @property({attribute: 'input-mode-label'})
  inputModeLabel = 'Switch to text input mode';

  /** Accessible label of the mode toggle in input mode. */
  @property({attribute: 'dial-mode-label'}) dialModeLabel =
    'Switch to clock mode';

  /**
   * Whether a modal picker is open. Setting it opens or closes the picker.
   */
  @property({type: Boolean, reflect: true})
  get open(): boolean {
    return this.modalSurface.open;
  }
  set open(value: boolean) {
    if (value === this.modalSurface.open) {
      return;
    }
    if (value) {
      this.show();
    } else {
      this.close();
    }
  }

  /** Which part of the time the dial edits. */
  @property({attribute: false}) selection: TimePickerSelection = 'hour';

  /** The time being picked, as `HH:MM`; committed to `value` by OK. */
  get pendingValue(): string {
    return formatTime(this.pending);
  }

  /** Whether the picker uses a 24-hour clock. */
  get is24Hour(): boolean {
    if (this.hourCycle === '24') return true;
    if (this.hourCycle === '12') return false;
    return localeUses24Hour(this.locale);
  }

  /** The dial layout in use. */
  get effectiveOrientation(): TimePickerOrientation {
    if (this.orientation) return this.orientation;
    return this.viewportIsShort ? 'horizontal' : 'vertical';
  }

  @state() private pending: TimeOfDay = {hour: 0, minute: 0};
  @state() private dragging = false;
  @state() private hourText = '';
  @state() private minuteText = '';
  @state() private hourInvalid = false;
  @state() private minuteInvalid = false;
  /** Announces the selection (hour or minutes) and the mode to screen readers. */
  private readonly announcer = new AnnouncerController(this, {
    container: () => this.container,
  });
  @state() private viewportIsShort = false;

  @query('.time-picker') private readonly container!: HTMLElement | null;
  @query('.time-picker-dial') private readonly dial!: HTMLElement | null;

  private committed: TimeOfDay | null = null;
  private isInteracting = false;
  private pendingChanged = false;
  /** The selector angle, unwrapped so it always turns the short way. */
  private angle = 0;
  private pointerStart: {x: number; y: number} | null = null;
  private typeAhead = '';
  private typeAheadTimer?: ReturnType<typeof setTimeout>;

  /**
   * Opens and closes the modal `<dialog>`, closes it with Escape, back or
   * the scrim, traps and restores focus, locks page scrolling and fires the
   * `open`, `opened`, `close` and `closed` events.
   */
  private readonly modalSurface = new ModalSurfaceController(this, {
    dialog: () =>
      this.container instanceof HTMLDialogElement ? this.container : null,
    surface: () => this.container,
    modal: () => this.modal,
    closeOnDisconnect: true,
    isScrim: (event) => this.isOnScrim(event),
    initialFocus: () =>
      this.shadowRoot?.querySelector<HTMLElement>(
        this.mode === 'input'
          ? 'input[data-selection="hour"]'
          : '.time-picker-selector[data-selection="hour"]',
      ),
    waitForMotion: () => this.waitForTransitions(),
    onCloseRequest: (reason) => {
      this.cancel(reason);
    },
  });

  /** Disabled by a disabled fieldset, which the attribute can't follow. */
  private readonly formDisabled = new FormDisabledController(this);

  private get isClosing() {
    return this.modalSurface.closing;
  }
  private mediaQuery?: MediaQueryList;
  private fallbackQuery?: MediaQueryList;
  /** The input mode is in use only because the viewport is too short. */
  private inputFromFallback = false;

  constructor() {
    super();
    if (!isServer) {
      this.resetPending();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!isServer && window.matchMedia) {
      this.mediaQuery = window.matchMedia(HORIZONTAL_LAYOUT_QUERY);
      this.viewportIsShort = this.mediaQuery.matches;
      this.mediaQuery.addEventListener('change', this.handleViewportChange);
      this.fallbackQuery = window.matchMedia(INPUT_FALLBACK_QUERY);
      this.fallbackQuery.addEventListener('change', this.applyInputFallback);
      this.applyInputFallback();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.mediaQuery?.removeEventListener('change', this.handleViewportChange);
    this.fallbackQuery?.removeEventListener('change', this.applyInputFallback);
    clearTimeout(this.typeAheadTimer);
  }

  /** Disabled by the attribute or by a disabled fieldset. */
  override get disabled(): boolean {
    return super.disabled || !!this.formDisabled?.value;
  }
  override set disabled(disabled: boolean) {
    super.disabled = disabled;
  }

  override formDisabledCallback(disabled: boolean) {
    // Not the attribute: it would keep the picker disabled after the
    // fieldset is enabled again.
    this.formDisabled.set(disabled);
  }

  /**
   * Opens a modal picker on the committed time, starting with the hours.
   * Fires `open`.
   */
  show(): Promise<void> {
    if (this.modalSurface.open && !this.modalSurface.closing) {
      return Promise.resolve();
    }
    this.resetPending();
    this.selection = 'hour';
    return this.modalSurface.show();
  }

  /**
   * Closes a modal picker without committing. Fires a cancelable `close`
   * event with `detail.reason`, then `closed` after the exit transition.
   *
   * @param reason Why the picker closes (`confirm`, `cancel`, `escape`,
   *     `back`, `scrim` or your own). Defaults to `dismiss`.
   */
  close(reason?: string): Promise<void> {
    return this.modalSurface.close(reason);
  }

  /**
   * Commits the pending time to `value` (firing `change` when it differs) and
   * closes a modal picker. What the OK action does.
   */
  confirm() {
    const prev = this.value;
    this.committed = {...this.pending};
    this.requestUpdate('value', prev);
    if (this.value !== prev) {
      this.dispatchEvent(new Event('change', {bubbles: true}));
    }
    this.close('confirm');
  }

  /**
   * Discards the pending time and fires `cancel`; a modal picker closes
   * unless the event is canceled (canceling keeps the pending time). What the
   * Cancel action does.
   */
  cancel(reason = 'cancel') {
    const proceed = this.dispatchEvent(new Event('cancel', {cancelable: true}));
    if (!proceed) {
      return;
    }
    this.resetPending();
    this.close(reason);
  }

  /** Switches between the dial and input modes. */
  toggleMode() {
    this.inputFromFallback = false;
    this.mode = this.mode === 'dial' ? 'input' : 'dial';
    this.syncFieldText();
    this.announce(this.headlineText);
  }

  override formResetCallback() {
    this.value = this.getAttribute('value') ?? '';
  }

  override formStateRestoreCallback(state: string) {
    this.value = state;
  }

  override [createValidator]() {
    return new TimePickerValidator(() => ({
      required: this.required,
      hasValue: !!this.committed,
    }));
  }

  /** The picker is not a single field: no element shows the browser's pop-up. */
  override [getValidityAnchor](): HTMLElement | null {
    return null;
  }

  override [getFormValue]() {
    return this.committed ? formatTime(this.committed) : null;
  }

  override [getFormState]() {
    return this[getFormValue]();
  }

  private get headlineText() {
    return (
      this.headline || (this.mode === 'input' ? 'Enter time' : 'Select time')
    );
  }

  private get autoCommit() {
    return this.hideActions;
  }

  private get isPm() {
    return this.pending.hour >= 12;
  }

  private resetPending() {
    this.pending = this.committed ? {...this.committed} : currentTime();
    this.syncFieldText();
  }

  private syncFieldText() {
    this.hourText = pad(this.displayHour(this.pending.hour));
    this.minuteText = pad(this.pending.minute);
    this.hourInvalid = false;
    this.minuteInvalid = false;
  }

  private displayHour(hour: number) {
    return this.is24Hour ? hour : displayHour12(hour);
  }

  /** Updates the pending time and fires `input` when it changed. */
  private setPending(time: TimeOfDay) {
    if (
      time.hour === this.pending.hour &&
      time.minute === this.pending.minute
    ) {
      return;
    }
    this.pending = time;
    this.pendingChanged = true;
    if (this.autoCommit) {
      const prev = this.value;
      this.committed = {...time};
      this.requestUpdate('value', prev);
    }
    this.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
  }

  /** Ends an interaction; with `hide-actions`, fires `change`. */
  private endInteraction() {
    if (this.autoCommit && this.pendingChanged) {
      this.dispatchEvent(new Event('change', {bubbles: true}));
    }
    this.pendingChanged = false;
  }

  private setSelection(selection: TimePickerSelection) {
    if (this.selection === selection) {
      return;
    }
    this.selection = selection;
    this.announce(
      selection === 'hour' ? this.selectHourLabel : this.selectMinuteLabel,
    );
  }

  private announce(message: string) {
    this.announcer.announce(message);
  }

  private setHour(hour: number) {
    this.setPending({
      hour: ((hour % 24) + 24) % 24,
      minute: this.pending.minute,
    });
  }

  private setMinute(minute: number) {
    this.setPending({
      hour: this.pending.hour,
      minute: ((minute % 60) + 60) % 60,
    });
  }

  /** Sets the hour from a displayed hour (1-12 on a 12-hour clock). */
  private setDisplayHour(display: number) {
    if (this.is24Hour) {
      this.setHour(display);
    } else {
      this.setHour((display % 12) + (this.isPm ? 12 : 0));
    }
  }

  private setPeriod(pm: boolean) {
    if (pm === this.isPm) {
      return;
    }
    this.setHour(this.pending.hour + (pm ? 12 : -12));
    this.endInteraction();
  }

  // ---- Dial ----

  private dialPoint(event: PointerEvent) {
    const rect = this.dial!.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    return {
      angle: pointToAngle(dx, dy),
      distance: Math.hypot(dx, dy) / (rect.width || 1),
    };
  }

  /** Applies a dial position; `step` rounds minutes (5 for taps). */
  private applyDialPoint(
    {angle, distance}: {angle: number; distance: number},
    step: number,
  ) {
    if (this.selection === 'minute') {
      this.setMinute(angleToValue(angle, 'minute', step));
      return;
    }
    const hour = angleToValue(angle, 'hour');
    if (this.is24Hour) {
      const inner = distance < INNER_RING_MAX_DISTANCE_RATIO;
      this.setHour(inner ? hour + 12 : hour);
    } else {
      this.setHour(hour + (this.isPm ? 12 : 0));
    }
  }

  private readonly handleDialPointerDown = (event: PointerEvent) => {
    if (this.disabled || event.button !== 0 || !this.dial) {
      return;
    }
    event.preventDefault();
    this.dial.focus({preventScroll: true});
    try {
      this.dial.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic pointers can't be captured.
    }
    this.pointerStart = {x: event.clientX, y: event.clientY};
    this.isInteracting = true;
  };

  private readonly handleDialPointerMove = (event: PointerEvent) => {
    if (!this.pointerStart) {
      return;
    }
    const moved = Math.hypot(
      event.clientX - this.pointerStart.x,
      event.clientY - this.pointerStart.y,
    );
    if (!this.dragging && moved < 4) {
      return;
    }
    this.dragging = true;
    const point = this.dialPoint(event);
    this.dragAngle = point.angle;
    this.applyDialPoint(point, 1);
    this.requestUpdate();
  };

  private readonly handleDialPointerUp = (event: PointerEvent) => {
    if (!this.pointerStart) {
      return;
    }
    if (!this.dragging) {
      // A tap snaps minutes to multiples of 5 (Compose `onTap`).
      this.applyDialPoint(this.dialPoint(event), 5);
    }
    this.finishDialGesture();
  };

  private readonly handleDialPointerCancel = () => {
    if (this.pointerStart) {
      this.finishDialGesture();
    }
  };

  private finishDialGesture() {
    this.pointerStart = null;
    this.dragging = false;
    this.dragAngle = null;
    this.isInteracting = false;
    this.endInteraction();
    // Picking an hour moves on to the minutes (Compose autoSwitchToMinute).
    if (this.selection === 'hour') {
      this.setSelection('minute');
    }
  }

  private dragAngle: number | null = null;

  private readonly handleDialKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) return;
    const hour = this.selection === 'hour';
    const step = (delta: number) => {
      if (hour) {
        this.setDisplayHour(this.displayHour(this.pending.hour) + delta);
      } else {
        this.setMinute(this.pending.minute + delta);
      }
    };
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        step(1);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        step(-1);
        break;
      case 'PageUp':
        step(hour ? 3 : 5);
        break;
      case 'PageDown':
        step(hour ? -3 : -5);
        break;
      case 'Home':
        if (hour) this.setDisplayHour(this.is24Hour ? 0 : 1);
        else this.setMinute(0);
        break;
      case 'End':
        if (hour) this.setDisplayHour(this.is24Hour ? 23 : 12);
        else this.setMinute(59);
        break;
      case 'Enter':
      case ' ':
        if (hour) {
          this.setSelection('minute');
        } else if (event.key === 'Enter' && !this.hideActions) {
          this.confirm();
        }
        break;
      default:
        if (this.handleTypedDigit(event, this.selection)) break;
        return;
    }
    event.preventDefault();
    this.endInteraction();
  };

  /**
   * Types a digit into the hour or minute: digits typed within a second
   * combine (`1` then `0` is 10), like a native time input.
   */
  private handleTypedDigit(
    event: KeyboardEvent,
    selection: TimePickerSelection,
  ): boolean {
    if (
      !/^\d$/.test(event.key) ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return false;
    }
    const combined = this.typeAhead + event.key;
    const max = selection === 'minute' ? 59 : this.is24Hour ? 23 : 12;
    const min = selection === 'hour' && !this.is24Hour ? 1 : 0;
    let text =
      Number(combined) <= max && combined.length <= 2 ? combined : event.key;
    let number = Number(text);
    if (number < min) {
      // `0` alone is no 12-hour hour yet; wait for the next digit.
      this.typeAhead = text;
      this.restartTypeAhead();
      return true;
    }
    if (number > max) {
      text = '';
      number = Number(event.key);
    }
    if (selection === 'hour') {
      this.setDisplayHour(number);
    } else {
      this.setMinute(number);
    }
    // A second digit couldn't make a valid number: move on.
    const done = text.length >= 2 || number * 10 > max;
    this.typeAhead = done ? '' : text;
    this.restartTypeAhead();
    if (done && selection === 'hour') {
      this.setSelection('minute');
    }
    return true;
  }

  private restartTypeAhead() {
    clearTimeout(this.typeAheadTimer);
    if (this.typeAhead) {
      this.typeAheadTimer = setTimeout(() => {
        this.typeAhead = '';
      }, TYPE_AHEAD_MS);
    }
  }

  // ---- Time selectors and period selector ----

  private readonly handleSelectorClick = (event: Event) => {
    const selection = (event.currentTarget as HTMLElement).dataset[
      'selection'
    ] as TimePickerSelection;
    this.typeAhead = '';
    this.setSelection(selection);
  };

  private readonly handleSelectorKeyDown = (event: KeyboardEvent) => {
    const selection = (event.currentTarget as HTMLElement).dataset[
      'selection'
    ] as TimePickerSelection;
    if (selection !== this.selection && /^\d$/.test(event.key)) {
      this.typeAhead = '';
      this.setSelection(selection);
    }
    if (this.handleTypedDigit(event, selection)) {
      event.preventDefault();
      this.endInteraction();
      if (this.selection !== selection) {
        // The hour is complete: continue typing in the minutes.
        this.updateComplete.then(() => {
          this.shadowRoot
            ?.querySelector<HTMLElement>('[data-selection="minute"]')
            ?.focus();
        });
      }
    }
  };

  private readonly handlePeriodClick = (event: Event) => {
    const pm = (event.currentTarget as HTMLElement).dataset['period'] === 'pm';
    this.setPeriod(pm);
  };

  private readonly handlePeriodKeyDown = (event: KeyboardEvent) => {
    if (
      !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    ) {
      return;
    }
    event.preventDefault();
    this.setPeriod(!this.isPm);
    this.updateComplete.then(() => {
      this.shadowRoot
        ?.querySelector<HTMLElement>(
          '.time-picker-period [aria-checked="true"]',
        )
        ?.focus();
    });
  };

  // ---- Input mode fields ----

  private readonly handleFieldInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const hour = input.dataset['selection'] === 'hour';
    const text = input.value.replace(/\D/g, '').slice(0, 2);
    input.value = text;
    const number = Number(text);
    const valid =
      text !== '' &&
      (hour
        ? this.is24Hour
          ? number <= 23
          : number >= 1 && number <= 12
        : number <= 59);
    if (hour) {
      this.hourText = text;
      this.hourInvalid = text.length === 2 && !valid;
    } else {
      this.minuteText = text;
      this.minuteInvalid = text.length === 2 && !valid;
    }
    if (!valid) {
      return;
    }
    if (hour) {
      this.setDisplayHour(number);
    } else {
      this.setMinute(number);
    }
    // A complete hour moves on to the minute field (Compose
    // shouldSwitchFocusToMinute).
    if (hour && text.length === 2) {
      const minute = this.shadowRoot?.querySelector<HTMLInputElement>(
        'input[data-selection="minute"]',
      );
      minute?.focus();
      minute?.select();
    }
  };

  private readonly handleFieldFocus = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.selection = input.dataset['selection'] as TimePickerSelection;
    input.select();
  };

  private readonly handleFieldBlur = () => {
    this.syncFieldText();
    this.endInteraction();
  };

  private readonly handleFieldKeyDown = (event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement;
    const hour = input.dataset['selection'] === 'hour';
    const delta =
      event.key === 'ArrowUp' ? 1 : event.key === 'ArrowDown' ? -1 : 0;
    if (delta) {
      event.preventDefault();
      if (hour) {
        this.setDisplayHour(this.displayHour(this.pending.hour) + delta);
      } else {
        this.setMinute(this.pending.minute + delta);
      }
      this.syncFieldText();
      this.endInteraction();
      this.updateComplete.then(() => input.select());
    } else if (event.key === 'Enter' && !this.hideActions) {
      event.preventDefault();
      this.confirm();
    }
  };

  // ---- Modal ----

  private async waitForTransitions() {
    if (this.quick) {
      return;
    }
    await waitForMotion(this.container);
  }

  private isOnScrim(event: MouseEvent) {
    const dialog = this.container;
    if (!dialog || event.composedPath()[0] !== dialog) {
      return false;
    }
    const rect = dialog.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  }

  private readonly handleViewportChange = (event: MediaQueryListEvent) => {
    this.viewportIsShort = event.matches;
  };

  /**
   * Falls back to the input picker while the viewport is too short for the
   * dial, and returns to the dial when it grows again. An explicit
   * `orientation`, or the person's own mode choice, is left alone.
   */
  private readonly applyInputFallback = () => {
    const tooShort = !!this.fallbackQuery?.matches;
    if (tooShort && this.mode === 'dial' && !this.orientation) {
      this.inputFromFallback = true;
      this.mode = 'input';
      this.syncFieldText();
    } else if (!tooShort && this.inputFromFallback) {
      this.inputFromFallback = false;
      if (this.mode === 'input') {
        this.mode = 'dial';
        this.syncFieldText();
      }
    }
  };

  // ---- Rendering ----

  protected override willUpdate(changed: PropertyValues<this>) {
    if (changed.has('hourCycle') || changed.has('locale')) {
      this.syncFieldText();
    }
    // Turn the selector the short way to its new angle (Compose
    // `endValueForAnimation`); while dragging it follows the pointer.
    const target =
      this.dragAngle ??
      valueToAngle(
        this.selection === 'hour' ? this.pending.hour : this.pending.minute,
        this.selection,
      );
    this.angle = nearestAngle(this.angle, target);
  }

  protected override render() {
    const orientation = this.effectiveOrientation;
    const hour24 = this.is24Hour;
    const classes = timePickerClasses({
      // The input mode is set on the host (`:host([mode=input])`), not with
      // the `time-picker-input` class, so input token values set on the host
      // still apply inside the shadow root; see time-picker.scss.
      mode: 'dial',
      orientation,
      hour24,
      closing: this.isClosing,
    });
    const classAttr = Object.entries(classes)
      .filter(([, on]) => on)
      .map(([name]) => name)
      .concat(this.dragging ? ['time-picker-dragging'] : [])
      .join(' ');

    const content = html`
      <div class="time-picker-headline" id="headline" part="headline">
        ${this.headlineText}
      </div>
      <div class="time-picker-body">
        ${this.mode === 'input' ? this.renderInputs() : this.renderDialMode()}
      </div>
      ${this.renderActions()}
    `;

    if (this.modal) {
      return html`<dialog
        class="${classAttr}"
        part="container"
        aria-labelledby="headline"
      >
        ${content}
      </dialog>`;
    }
    return html`<div
      class="${classAttr}"
      part="container"
      role="group"
      aria-labelledby="headline"
    >
      ${content}
    </div>`;
  }

  private renderDialMode() {
    return html`
      <div class="time-picker-display">
        <div class="time-picker-time">
          ${this.renderSelector('hour')}
          <span class="time-picker-separator" aria-hidden="true">:</span>
          ${this.renderSelector('minute')}
        </div>
        ${this.renderPeriod()}
      </div>
      ${this.renderDial()}
    `;
  }

  private renderSelector(selection: TimePickerSelection) {
    const selected = this.selection === selection;
    const value =
      selection === 'hour'
        ? this.displayHour(this.pending.hour)
        : this.pending.minute;
    const label =
      selection === 'hour' ? this.selectHourLabel : this.selectMinuteLabel;
    return html`<button
      type="button"
      class="time-picker-selector ripple focus-ring-outer ${
        selected ? 'time-picker-selector-selected' : ''
      }"
      data-selection=${selection}
      aria-pressed=${selected ? 'true' : 'false'}
      aria-label="${label}, ${this.valueText(selection, value)}"
      ?disabled=${this.disabled}
      @click=${this.handleSelectorClick}
      @keydown=${this.handleSelectorKeyDown}
      ${ripple()}
    >
      ${pad(value)}
    </button>`;
  }

  private renderPeriod() {
    if (this.is24Hour) {
      return nothing;
    }
    const [am, pm] = localePeriodLabels(this.locale);
    const period = (isPm: boolean, label: string) => {
      const checked = isPm === this.isPm;
      return html`<button
        type="button"
        role="radio"
        class="time-picker-period-button ripple focus-ring-inner ${
          checked ? 'time-picker-period-selected' : ''
        }"
        data-period=${isPm ? 'pm' : 'am'}
        aria-checked=${checked ? 'true' : 'false'}
        tabindex=${checked ? '0' : '-1'}
        ?disabled=${this.disabled}
        @click=${this.handlePeriodClick}
        @keydown=${this.handlePeriodKeyDown}
        ${ripple()}
      >
        ${label}
      </button>`;
    };
    return html`<div
      class="time-picker-period"
      role="radiogroup"
      aria-label=${this.periodLabel}
    >
      ${period(false, am)}${period(true, pm)}
    </div>`;
  }

  private renderDial() {
    const hourMode = this.selection === 'hour';
    const hour24 = this.is24Hour;
    const inner = hourMode && hour24 && this.pending.hour >= 12;
    const value = hourMode
      ? this.displayHour(this.pending.hour)
      : this.pending.minute;
    const radius = inner ? INNER_RADIUS_RATIO : OUTER_RADIUS_RATIO;

    const labels = (selection: TimePickerSelection) => {
      if (selection === 'minute') {
        return this.renderRing(MINUTES, OUTER_RADIUS_RATIO, (m) => pad(m));
      }
      if (!hour24) {
        return this.renderRing(HOURS_12, OUTER_RADIUS_RATIO, String);
      }
      return html`${this.renderRing(HOURS_24_OUTER, OUTER_RADIUS_RATIO, (h) =>
        h === 0 ? '00' : String(h),
      )}${this.renderRing(HOURS_24_INNER, INNER_RADIUS_RATIO, String, true)}`;
    };

    const dialStyle = {
      '--_angle': `${this.angle}deg`,
      '--_radius': String(radius),
    };

    return html`<div
      class="time-picker-dial focus-ring-outer"
      part="dial"
      role="slider"
      tabindex=${this.disabled ? '-1' : '0'}
      aria-label=${hourMode ? this.selectHourLabel : this.selectMinuteLabel}
      aria-valuemin=${hourMode ? (hour24 ? 0 : 1) : 0}
      aria-valuemax=${hourMode ? (hour24 ? 23 : 12) : 59}
      aria-valuenow=${value}
      aria-valuetext=${this.dialValueText(this.selection, value)}
      aria-disabled=${this.disabled ? 'true' : nothing}
      style=${styleMap(dialStyle)}
      @pointerdown=${this.handleDialPointerDown}
      @pointermove=${this.handleDialPointerMove}
      @pointerup=${this.handleDialPointerUp}
      @pointercancel=${this.handleDialPointerCancel}
      @keydown=${this.handleDialKeyDown}
    >
      <div
        class="time-picker-dial-face time-picker-dial-face-hour"
        ?data-active=${hourMode}
        aria-hidden="true"
      >
        ${labels('hour')}
      </div>
      <div
        class="time-picker-dial-face time-picker-dial-face-minute"
        ?data-active=${!hourMode}
        aria-hidden="true"
      >
        ${labels('minute')}
      </div>
      <div class="time-picker-dial-arm" aria-hidden="true">
        <div class="time-picker-dial-track"></div>
        <div class="time-picker-dial-handle">
          <div class="time-picker-dial-handle-labels">
            ${labels(this.selection)}
          </div>
        </div>
      </div>
      <div class="time-picker-dial-center" aria-hidden="true"></div>
    </div>`;
  }

  private renderRing(
    values: number[],
    radius: number,
    format: (value: number) => string,
    inner = false,
  ): TemplateResult {
    return html`${values.map((value, index) => {
      const angle = (index * 30 * Math.PI) / 180;
      const style = {
        left: `${50 + radius * 100 * Math.sin(angle)}%`,
        top: `${50 - radius * 100 * Math.cos(angle)}%`,
      };
      return html`<span
        class="time-picker-dial-label ${
          inner ? 'time-picker-dial-label-inner' : ''
        }"
        style=${styleMap(style)}
        >${format(value)}</span
      >`;
    })}`;
  }

  private renderInputs() {
    const field = (selection: TimePickerSelection) => {
      const hour = selection === 'hour';
      const label = hour ? this.hourLabel : this.minuteLabel;
      const invalid = hour ? this.hourInvalid : this.minuteInvalid;
      return html`<label
        class="time-picker-field ${invalid ? 'time-picker-field-error' : ''}"
      >
        <input
          class="time-picker-field-input"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          maxlength="2"
          data-selection=${selection}
          aria-label=${label}
          aria-invalid=${invalid ? 'true' : 'false'}
          .value=${hour ? this.hourText : this.minuteText}
          ?disabled=${this.disabled}
          @input=${this.handleFieldInput}
          @focus=${this.handleFieldFocus}
          @blur=${this.handleFieldBlur}
          @keydown=${this.handleFieldKeyDown}
        />
        <span class="time-picker-field-label" aria-hidden="true">${label}</span>
      </label>`;
    };
    return html`
      <div class="time-picker-display">
        <div class="time-picker-time">
          ${field('hour')}
          <span class="time-picker-separator" aria-hidden="true">:</span>
          ${field('minute')}
        </div>
        ${this.renderPeriod()}
      </div>
    `;
  }

  private renderActions() {
    const showToggle = !this.hideModeToggle;
    if (this.hideActions && !showToggle) {
      return nothing;
    }
    const toDial = this.mode === 'input';
    return html`<div class="time-picker-actions" part="actions">
      ${
        showToggle
          ? html`<button
              type="button"
              class="${iconButton({
                color: 'standard',
                size: 'sm',
                classes: {'time-picker-mode-toggle': true},
              })}"
              aria-label=${toDial ? this.dialModeLabel : this.inputModeLabel}
              ?disabled=${this.disabled}
              @click=${this.toggleMode}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d=${toDial ? CLOCK_ICON : KEYBOARD_ICON} />
              </svg>
            </button>`
          : nothing
      }
      <span class="time-picker-actions-spacer"></span>
      ${
        this.hideActions
          ? nothing
          : html`<button
                type="button"
                class="${button({
                  color: 'text',
                  size: 'sm',
                  classes: {'time-picker-cancel': true},
                })}"
                ?disabled=${this.disabled}
                @click=${this.cancel}
              >
                ${this.cancelLabel}
              </button>
              <button
                type="button"
                class="${button({
                  color: 'text',
                  size: 'sm',
                  classes: {'time-picker-confirm': true},
                })}"
                ?disabled=${this.disabled}
                @click=${this.confirm}
              >
                ${this.confirmLabel}
              </button>`
      }
    </div>`;
  }

  /**
   * What the dial reads: the selection out of the total, such as "Hour 7 of
   * 12" (time-pickers.md Accessibility, Dial selector).
   */
  private dialValueText(selection: TimePickerSelection, value: number) {
    if (selection === 'minute') {
      return `Minute ${value} of 60`;
    }
    return `Hour ${value} of ${this.is24Hour ? 24 : 12}`;
  }

  private valueText(selection: TimePickerSelection, value: number) {
    if (selection === 'minute') {
      return `${value} minutes`;
    }
    return this.is24Hour ? `${value} hours` : `${value} o'clock`;
  }
}
