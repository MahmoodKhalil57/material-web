/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { createValidator, getValidityAnchor } from '../../../behaviors/constraint-validation.js';
import { getFormState, getFormValue } from '../../../behaviors/form-associated.js';
import { type Density } from '../shared/density.js';
import { TimePickerValidator } from './time-picker-validator.js';
import { type TimePickerMode, type TimePickerOrientation, type TimePickerSelection } from './time-picker.js';
/**
 * Viewport where the automatic orientation picks the horizontal layout: a
 * landscape viewport too short for the vertical dial (spec page "Adaptive
 * design": landscape when viewport height is limited, Compose
 * `defaultTimePickerLayoutType`).
 */
export declare const HORIZONTAL_LAYOUT_QUERY = "(orientation: landscape) and (max-height: 599.98px)";
/**
 * Viewport where the horizontal dial layout no longer fits without scrolling
 * (406dp tall plus the dialog's 24dp window margins): the dial picker falls
 * back to the input picker (spec page "Adaptive design": "Time pickers can
 * fallback to the input time picker when there isn't enough vertical real
 * estate to present the landscape orientation without scrolling").
 */
export declare const INPUT_FALLBACK_QUERY = "(orientation: landscape) and (max-height: 453.98px)";
/** The 12/24-hour setting: from the locale (`''`) or forced. */
export type TimePickerHourCycle = '' | '12' | '24';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<(abstract new (...args: any[]) => import("../../../behaviors/element-internals.js").WithElementInternals) & typeof LitElement & import("../../../behaviors/form-associated.js").FormAssociatedConstructor, import("../../../behaviors/form-associated.js").FormAssociated>, import("../../../behaviors/constraint-validation.js").ConstraintValidation>;
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
export declare class TimePickerElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /**
     * The committed time as a 24-hour `HH:MM` string (`<input type="time">`
     * format), or `''` when no time is set.
     */
    get value(): string;
    set value(value: string);
    /**
     * `dial` (clock dial) or `input` (hour and minute text fields).
     */
    mode: TimePickerMode;
    /**
     * The dial layout: `vertical`, `horizontal`, or `''` (default) to pick
     * one from the viewport (horizontal in short landscape viewports).
     */
    orientation: TimePickerOrientation | '';
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
    get density(): Density;
    set density(density: number);
    private densityValue;
    /**
     * `12` (with an AM/PM period selector), `24`, or `''` (default) to follow
     * the locale's clock (`Intl.DateTimeFormat`).
     */
    hourCycle: TimePickerHourCycle;
    /**
     * The locale used for the 12/24-hour default and the AM/PM labels. Defaults
     * to the browser locale.
     */
    locale: string;
    /**
     * The headline. Defaults to "Select time" (dial) or "Enter time" (input).
     */
    headline: string;
    /** Renders the picker as a modal dialog, shown with `show()` or `open`. */
    modal: boolean;
    /** Hides the Cancel and OK actions; every change commits the value. */
    hideActions: boolean;
    /** Hides the dial / input mode toggle button. */
    hideModeToggle: boolean;
    /** Skips transitions. */
    quick: boolean;
    /**
     * Whether a time is required: with no time the picker is invalid
     * (`valueMissing`) and blocks the form's submit.
     */
    required: boolean;
    /** Cancel action label. */
    cancelLabel: string;
    /** OK action label. */
    confirmLabel: string;
    /** Accessible label of the hour selector and the dial in hour mode. */
    selectHourLabel: string;
    /** Accessible label of the minute selector and the dial in minute mode. */
    selectMinuteLabel: string;
    /** Accessible label of the period selector. */
    periodLabel: string;
    /** Hour field label (input mode). */
    hourLabel: string;
    /** Minute field label (input mode). */
    minuteLabel: string;
    /** Accessible label of the mode toggle in dial mode. */
    inputModeLabel: string;
    /** Accessible label of the mode toggle in input mode. */
    dialModeLabel: string;
    /**
     * Whether a modal picker is open. Setting it opens or closes the picker.
     */
    get open(): boolean;
    set open(value: boolean);
    /** Which part of the time the dial edits. */
    selection: TimePickerSelection;
    /** The time being picked, as `HH:MM`; committed to `value` by OK. */
    get pendingValue(): string;
    /** Whether the picker uses a 24-hour clock. */
    get is24Hour(): boolean;
    /** The dial layout in use. */
    get effectiveOrientation(): TimePickerOrientation;
    private pending;
    private dragging;
    private hourText;
    private minuteText;
    private hourInvalid;
    private minuteInvalid;
    /** Announces the selection (hour or minutes) and the mode to screen readers. */
    private readonly announcer;
    private viewportIsShort;
    private readonly container;
    private readonly dial;
    private committed;
    private isInteracting;
    private pendingChanged;
    /** The selector angle, unwrapped so it always turns the short way. */
    private angle;
    private pointerStart;
    private typeAhead;
    private typeAheadTimer?;
    /**
     * Opens and closes the modal `<dialog>`, closes it with Escape, back or
     * the scrim, traps and restores focus, locks page scrolling and fires the
     * `open`, `opened`, `close` and `closed` events.
     */
    private readonly modalSurface;
    /** Disabled by a disabled fieldset, which the attribute can't follow. */
    private readonly formDisabled;
    private get isClosing();
    private mediaQuery?;
    private fallbackQuery?;
    /** The input mode is in use only because the viewport is too short. */
    private inputFromFallback;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled(): boolean;
    set disabled(disabled: boolean);
    formDisabledCallback(disabled: boolean): void;
    /**
     * Opens a modal picker on the committed time, starting with the hours.
     * Fires `open`.
     */
    show(): Promise<void>;
    /**
     * Closes a modal picker without committing. Fires a cancelable `close`
     * event with `detail.reason`, then `closed` after the exit transition.
     *
     * @param reason Why the picker closes (`confirm`, `cancel`, `escape`,
     *     `back`, `scrim` or your own). Defaults to `dismiss`.
     */
    close(reason?: string): Promise<void>;
    /**
     * Commits the pending time to `value` (firing `change` when it differs) and
     * closes a modal picker. What the OK action does.
     */
    confirm(): void;
    /**
     * Discards the pending time and fires `cancel`; a modal picker closes
     * unless the event is canceled (canceling keeps the pending time). What the
     * Cancel action does.
     */
    cancel(reason?: string): void;
    /** Switches between the dial and input modes. */
    toggleMode(): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string): void;
    [createValidator](): TimePickerValidator;
    /** The picker is not a single field: no element shows the browser's pop-up. */
    [getValidityAnchor](): HTMLElement | null;
    [getFormValue](): string;
    [getFormState](): string;
    private get headlineText();
    private get autoCommit();
    private get isPm();
    private resetPending;
    private syncFieldText;
    private displayHour;
    /** Updates the pending time and fires `input` when it changed. */
    private setPending;
    /** Ends an interaction; with `hide-actions`, fires `change`. */
    private endInteraction;
    private setSelection;
    private announce;
    private setHour;
    private setMinute;
    /** Sets the hour from a displayed hour (1-12 on a 12-hour clock). */
    private setDisplayHour;
    private setPeriod;
    private dialPoint;
    /** Applies a dial position; `step` rounds minutes (5 for taps). */
    private applyDialPoint;
    private readonly handleDialPointerDown;
    private readonly handleDialPointerMove;
    private readonly handleDialPointerUp;
    private readonly handleDialPointerCancel;
    private finishDialGesture;
    private dragAngle;
    private readonly handleDialKeyDown;
    /**
     * Types a digit into the hour or minute: digits typed within a second
     * combine (`1` then `0` is 10), like a native time input.
     */
    private handleTypedDigit;
    private restartTypeAhead;
    private readonly handleSelectorClick;
    private readonly handleSelectorKeyDown;
    private readonly handlePeriodClick;
    private readonly handlePeriodKeyDown;
    private readonly handleFieldInput;
    private readonly handleFieldFocus;
    private readonly handleFieldBlur;
    private readonly handleFieldKeyDown;
    private waitForTransitions;
    private isOnScrim;
    private readonly handleViewportChange;
    /**
     * Falls back to the input picker while the viewport is too short for the
     * dial, and returns to the dial when it grows again. An explicit
     * `orientation`, or the person's own mode choice, is left alone.
     */
    private readonly applyInputFallback;
    protected willUpdate(changed: PropertyValues<this>): void;
    protected render(): TemplateResult<1>;
    private renderDialMode;
    private renderSelector;
    private renderPeriod;
    private renderDial;
    private renderRing;
    private renderInputs;
    private renderActions;
    /**
     * What the dial reads: the selection out of the total, such as "Hour 7 of
     * 12" (time-pickers.md Accessibility, Dial selector).
     */
    private dialValueText;
    private valueText;
}
export {};
