/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type CSSResultOrNative, html, LitElement, PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '../../../behaviors/constraint-validation.js';
import {
  internals,
  mixinElementInternals,
} from '../../../behaviors/element-internals.js';
import {
  type FormRestoreState,
  type FormValue,
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '../../../behaviors/form-associated.js';
import {type Validator} from '../../../behaviors/validators/validator.js';
import {
  FormDisabledController,
  SelectionGroupValidator,
} from '../shared/form-field.js';
import {RovingFocusController} from '../shared/roving-focus.js';
import {SelectionController} from '../shared/selection.js';
import {
  clampDensity,
  type SegmentedButtonDensity,
} from './segmented-button.js';
import {type SegmentedButtonElement} from './segmented-button-element.js';

import segmentedButtonSetStyles from './segmented-button-set.css' with {type: 'css'}; // github-only
// import segmentedButtonSetStyles from './segmented-button-set.cssresult.js'; // google3-only

const SEGMENT_TAG = 'md-gb-segmented-button';

// Separate variable needed for closure.
// spec-labels: segmented-buttons/guidelines, segmented-buttons/guidelines/usage
const baseClass = mixinConstraintValidation(
  mixinFormAssociated(mixinElementInternals(LitElement)),
);

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
export class SegmentedButtonSetElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [segmentedButtonSetStyles];

  /** Whether more than one segment can be selected. */
  @property({type: Boolean, reflect: true}) multiselect = false;

  /**
   * In single-select mode, whether a segment must stay selected: the
   * selected segment can't be unselected.
   */
  @property({type: Boolean, reflect: true}) required = false;

  /**
   * The density, from 0 (default, 40px) to -3. Each step down removes 4px
   * from the height. Values are clamped to that range.
   */
  @property({type: Number, reflect: true})
  get density(): SegmentedButtonDensity {
    return this.densityValue;
  }
  set density(density: number) {
    const old = this.densityValue;
    this.densityValue = clampDensity(Number(density));
    this.requestUpdate('density', old);
  }
  private densityValue: SegmentedButtonDensity = 0;

  /** Disabled by the attribute or by a disabled fieldset. */
  override get disabled(): boolean {
    return super.disabled || !!this.formDisabled?.value;
  }
  override set disabled(disabled: boolean) {
    super.disabled = disabled;
  }

  override formDisabledCallback(disabled: boolean) {
    // Not the attribute: it would keep the set disabled after the fieldset
    // is enabled again.
    this.formDisabled.set(disabled);
  }

  private readonly formDisabled = new FormDisabledController(this);

  /** The segment that takes focus when tabbing into the set. */
  private tabStop: SegmentedButtonElement | null = null;

  /**
   * The selection model (shared SelectionController): single (radio) or
   * multiple (checkbox) with `required`, Space/Enter/click selection, the
   * `input` and `change` events for user changes, and the form value. A
   * segment's native button turns Space and Enter into a click.
   */
  // spec: segmented-buttons/accessibility/use-cases/interaction-style
  protected readonly selection = new SelectionController<SegmentedButtonElement>(this, {
    items: () => this.segments,
    mode: () => (this.multiselect ? 'multiple' : 'single'),
    required: () => this.required,
    // `required` only stops a selected segment from being unselected.
    autoSelectFirst: false,
    canSelect: (segment) => !segment.effectivelyDisabled,
    onChange: (segment) => {
      if (segment) this.tabStop = segment;
      this.syncSegments();
    },
  });

  /** Keeps segments in sync when they are added, removed, disabled or hidden. */
  private readonly childObserver = new MutationObserver(() => {
    this.syncSegments();
    // Update the form value.
    this.requestUpdate();
  });

  constructor() {
    super();
    this[internals].role = 'radiogroup';
    this.addEventListener('click', (event) => {
      const segment = this.segmentFromEvent(event);
      if (segment?.effectivelyDisabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    });
    this.addEventListener('focusin', (event) => {
      const segment = this.segmentFromEvent(event);
      if (segment && segment !== this.tabStop) {
        this.tabStop = segment;
        this.syncSegments();
      }
    });
  }

  /** The `md-gb-segmented-button` children. */
  get segments(): SegmentedButtonElement[] {
    return Array.from(this.children).filter(
      (child): child is SegmentedButtonElement =>
        child.localName === SEGMENT_TAG,
    );
  }

  /** The selected segments. */
  get selectedSegments(): SegmentedButtonElement[] {
    return this.selection.selectedItems;
  }

  /** The index of the first selected segment, or -1. */
  get selectedIndex(): number {
    return this.selection.selectedIndex;
  }

  /** The indices of every selected segment. */
  get selectedIndices(): number[] {
    return this.selection.selectedIndices;
  }

  /**
   * The value of the selected segment (the first one in multi-select), or
   * `''`. Setting it selects the segment with that value, and only that one.
   */
  get value(): string {
    return this.selection.value;
  }
  set value(value: string) {
    this.values = value ? [value] : [];
  }

  /**
   * The values of the selected segments. Setting it selects the segments with
   * those values (only the first one in single-select).
   */
  get values(): string[] {
    return this.selection.values;
  }
  set values(values: string[]) {
    this.selection.setValues(values);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.childObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'hidden'],
    });
    this.selection.normalize();
    this.syncSegments();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.childObserver.disconnect();
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has('multiselect')) {
      this[internals].role = this.multiselect ? 'group' : 'radiogroup';
      this.selection.normalize();
    }
    this[internals].ariaRequired =
      this.required && !this.multiselect ? 'true' : null;
    this[internals].ariaDisabled = this.disabled ? 'true' : null;
    this.syncSegments();
  }

  protected override render() {
    return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
  }

  override [getFormValue](): FormValue | null {
    // `requestUpdate()` runs before the field initializers on construction.
    return this.selection ? this.selection.formValue(this.name) : null;
  }

  override [getFormState](): FormValue | null {
    return this[getFormValue]();
  }

  override formResetCallback() {
    this.selection.reset();
  }

  override formStateRestoreCallback(state: FormRestoreState | null) {
    if (typeof state === 'string') {
      this.value = state;
    } else if (state instanceof FormData) {
      this.values = state
        .getAll(this.name)
        .filter((v): v is string => typeof v === 'string');
    } else {
      this.values = [];
    }
  }

  override [createValidator](): Validator<unknown> {
    return new SelectionGroupValidator(() => ({
      required: this.required && !this.multiselect,
      // Validity is read while the base class constructs.
      hasSelection: !!this.selection && this.selection.selectedItems.length > 0,
    }));
  }

  override [getValidityAnchor](): HTMLElement | null {
    return this.selection ? (this.segments[0] ?? null) : null;
  }

  private handleSlotChange() {
    this.selection.normalize();
    this.syncSegments();
    this.requestUpdate();
  }

  private segmentFromEvent(event: Event): SegmentedButtonElement | undefined {
    const path = event.composedPath();
    return this.segments.find((segment) => path.includes(segment));
  }

  /**
   * Arrow keys, Home and End move focus between segments (shared
   * RovingFocusController). The set keeps its own tab stop because a segment
   * takes focus through its `focusable` property (see syncSegments).
   */
  // spec: segmented-buttons/accessibility/use-cases/keyboard-navigation
  protected readonly rovingFocus = new RovingFocusController(this, {
    items: () => this.navigableSegments(),
    canFocus: (segment) => !(segment as SegmentedButtonElement).effectivelyDisabled,
    setTabStop: () => {},
    onMove: (segment) => {
      this.tabStop = segment as SegmentedButtonElement;
      this.syncSegments();
    },
  });

  private navigableSegments() {
    return this.segments.filter((segment) => !segment.hidden);
  }

  /** Pushes the set's mode, disabled state and tab stop to its segments. */
  private syncSegments() {
    const segments = this.segments;
    const focusable = this.navigableSegments().filter(
      (segment) => !segment.disabled && !this.disabled,
    );
    if (!this.tabStop || !focusable.includes(this.tabStop)) {
      // Spec "Initial focus": the first segment, regardless of selection.
      this.tabStop = focusable[0] ?? null;
    }
    for (const segment of segments) {
      segment.mode = this.multiselect ? 'multiple' : 'single';
      segment.groupDisabled = this.disabled;
      segment.focusable = segment === this.tabStop;
    }
  }
}
