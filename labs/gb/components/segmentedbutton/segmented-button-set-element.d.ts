/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement, PropertyValues } from 'lit';
import { createValidator, getValidityAnchor } from '../../../behaviors/constraint-validation.js';
import { type FormRestoreState, type FormValue, getFormState, getFormValue } from '../../../behaviors/form-associated.js';
import { type Validator } from '../../../behaviors/validators/validator.js';
import { RovingFocusController } from '../shared/roving-focus.js';
import { SelectionController } from '../shared/selection.js';
import { type SegmentedButtonDensity } from './segmented-button.js';
import { type SegmentedButtonElement } from './segmented-button-element.js';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<(abstract new (...args: any[]) => import("../../../behaviors/element-internals.js").WithElementInternals) & typeof LitElement & import("../../../behaviors/form-associated.js").FormAssociatedConstructor, import("../../../behaviors/form-associated.js").FormAssociated>, import("../../../behaviors/constraint-validation.js").ConstraintValidation>;
/**
 * A Material Design segmented button set: two to five
 * `md-gb-segmented-button` segments for picking options, switching views or
 * sorting.
 *
 * Note: M3 Expressive recommends the connected button group
 * (`md-gb-button-group variant="connected"`) instead; segmented buttons
 * remain in the M3 spec.
 *
 * - Single-select (default): at most one segment is selected; the set is a
 *   `radiogroup` of `radio` segments. With `required`, the selected segment
 *   can't be unselected.
 * - Multi-select (`multiselect`): any number of segments, from none to all,
 *   can be selected; the set is a `group` of `checkbox` segments.
 *
 * Keyboard (spec Accessibility): Tab moves focus to the set (one tab stop,
 * initially the first segment regardless of selection), arrow keys move focus
 * between segments (left/right follow the reading direction), Home/End go to
 * the first/last segment, and Space or Enter selects or unselects the focused
 * segment.
 *
 * The set is form-associated: with a `name`, it submits the `value` of the
 * selected segment (single-select) or one entry per selected segment
 * (multi-select); form reset and restore bring the selection back. A
 * single-select set with `required` is invalid while nothing is selected.
 * A disabled set, or one in a disabled `<fieldset>`, disables its segments
 * and leaves its value out of the form.
 *
 * @slot - The `md-gb-segmented-button` segments.
 * @fires {InputEvent} input - Fired when the user changes the selection. --bubbles --composed
 * @fires {Event} change - Fired when the user changes the selection. --bubbles
 * @cssprop --container-height - Segment height at density 0.
 * @cssprop --container-shape - Outer corner radius of the first and last segments.
 * @cssprop --icon-size - Icon and checkmark size.
 * @cssprop --label-text - Label typography.
 * @cssprop --label-text-axes - Label font variation settings.
 * @cssprop --label-text-tracking - Label letter spacing.
 * @cssprop --outline-color - Outline color.
 * @cssprop --outline-width - Outline width.
 * @cssprop --leading-space - Padding before each segment's content.
 * @cssprop --trailing-space - Padding after each segment's content.
 * @cssprop --icon-label-space - Space between the icon and the label.
 * @cssprop --target-size - Minimum touch target height.
 * @cssprop --min-width - Minimum segment width.
 * @cssprop --density-step - Height removed per density step.
 */
export declare class SegmentedButtonSetElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** Whether more than one segment can be selected. */
    multiselect: boolean;
    /**
     * In single-select mode, whether a segment must stay selected: the
     * selected segment can't be unselected.
     */
    required: boolean;
    /**
     * The density, from 0 (default, 40px) to -3. Each step down removes 4px
     * from the height. Values are clamped to that range.
     */
    get density(): SegmentedButtonDensity;
    set density(density: number);
    private densityValue;
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled(): boolean;
    set disabled(disabled: boolean);
    formDisabledCallback(disabled: boolean): void;
    private readonly formDisabled;
    /** The segment that takes focus when tabbing into the set. */
    private tabStop;
    /**
     * The selection model (shared SelectionController): single (radio) or
     * multiple (checkbox) with `required`, Space/Enter/click selection, the
     * `input` and `change` events for user changes, and the form value. A
     * segment's native button turns Space and Enter into a click.
     */
    protected readonly selection: SelectionController<SegmentedButtonElement>;
    /** Keeps segments in sync when they are added, removed, disabled or hidden. */
    private readonly childObserver;
    constructor();
    /** The `md-gb-segmented-button` children. */
    get segments(): SegmentedButtonElement[];
    /** The selected segments. */
    get selectedSegments(): SegmentedButtonElement[];
    /** The index of the first selected segment, or -1. */
    get selectedIndex(): number;
    /** The indices of every selected segment. */
    get selectedIndices(): number[];
    /**
     * The value of the selected segment (the first one in multi-select), or
     * `''`. Setting it selects the segment with that value, and only that one.
     */
    get value(): string;
    set value(value: string);
    /**
     * The values of the selected segments. Setting it selects the segments with
     * those values (only the first one in single-select).
     */
    get values(): string[];
    set values(values: string[]);
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected updated(changed: PropertyValues<this>): void;
    protected render(): import("lit-html").TemplateResult<1>;
    [getFormValue](): FormValue | null;
    [getFormState](): FormValue | null;
    formResetCallback(): void;
    formStateRestoreCallback(state: FormRestoreState | null): void;
    [createValidator](): Validator<unknown>;
    [getValidityAnchor](): HTMLElement | null;
    private handleSlotChange;
    private segmentFromEvent;
    /**
     * Arrow keys, Home and End move focus between segments (shared
     * RovingFocusController). The set keeps its own tab stop because a segment
     * takes focus through its `focusable` property (see syncSegments).
     */
    protected readonly rovingFocus: RovingFocusController;
    private navigableSegments;
    /** Pushes the set's mode, disabled state and tab stop to its segments. */
    private syncSegments;
}
export {};
