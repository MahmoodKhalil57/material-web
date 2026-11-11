/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CSSResultOrNative,
  html,
  isServer,
  LitElement,
  nothing,
  PropertyValues,
} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {when} from 'lit/directives/when.js';
import {ARIAMixinStrict} from '../../foundations/accessibility/aria/aria.js';
import {mixinDelegatesAria} from '../../foundations/accessibility/aria/delegate.js';
import {
  dispatchActivationClick,
  isActivationClick,
} from '../../internal/events/form-label-activation.js';
import {redispatchEvent} from '../../internal/events/redispatch-event.js';
import {mixinElementInternals} from '../../internal/behaviors/element-internals.js';
import {
  getFormValue,
  mixinFormAssociated,
} from '../../internal/behaviors/form-associated.js';
import {
  FormDisabledController,
  numberAttribute,
  parseNumberState,
  rangeFormData,
} from '../shared/form-field.js';
import {
  computeSliderProperties,
  formatValueIndicatorLabel,
  handleClasses,
  handleNubClasses,
  sliderClasses,
  type SliderOrientation,
  type SliderSize,
} from './slider.js';

import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.cssresult.js'; // google3-only
import sliderStyles from './slider.css' with {type: 'css'}; // github-only
// import sliderStyles from './slider.cssresult.js'; // google3-only

interface Action {
  canFlip: boolean;
  flipped: boolean;
  target: HTMLInputElement;
  fixed: HTMLInputElement;
  values: Map<HTMLInputElement, number>;
}

// Separate variable needed for closure.
// spec-labels: sliders/specs/anatomy, sliders/guidelines/anatomy, sliders/specs/variants, sliders/specs/configurations, sliders/specs/measurements
const baseClass = mixinDelegatesAria(
  mixinFormAssociated(mixinElementInternals(LitElement)),
);

/**
 * A Material Design slider component.
 *
 * This component does not format numbers; formatting is the application's
 * responsibility via `valueLabel` and `ariaValueText*`.
 * Note: An optional leading inset icon slot (`slot="icon"`) is supported on
 * the standard horizontal slider only (not range, not centered, and not
 * vertical) for sizes `md`, `lg`, and `xl`. Slotted icons should use
 * `<md-gb-icon slot="icon">` (e.g.
 * `<md-gb-icon slot="icon">volume_up</md-gb-icon>`).
 *
 * @fires {InputEvent} input - Fired when the slider value changes from user interaction. --bubbles --composed
 * @fires {Event} change - Fired when the slider value commit changes from user interaction. --bubbles
 * @cssprop --active-track-color
 * @cssprop --inactive-track-color
 * @cssprop --handle-color
 * @cssprop --handle-shape
 * @cssprop --handle-width
 * @cssprop --focus-handle-width
 * @cssprop --handle-height
 * @cssprop --active-handle-leading-space
 * @cssprop --active-track-inner-corner-size
 * @cssprop --stop-indicator-color
 * @cssprop --stop-indicator-color-selected
 * @cssprop --stop-indicator-size
 * @cssprop --stop-indicator-min-spacing
 * @cssprop --track-height
 * @cssprop --track-shape
 * @cssprop --inactive-track-shape-trailing
 * @cssprop --value-indicator-color
 * @cssprop --value-indicator-label-text-color
 * @cssprop --value-indicator-bottom-space
 * @cssprop --value-indicator-width
 * @cssprop --state-layer-size
 * @cssprop --with-overlap-handle-outline-color
 * @cssprop --with-overlap-handle-outline-width
 * @cssprop --icon-size
 * @cssprop --icon-color
 * @cssprop --icon-color-active
 */
export class SliderElement extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [focusRingStyles, sliderStyles];

  /** The smallest value. */
  @property({type: Number}) min = 0;
  /** The largest value. */
  @property({type: Number}) max = 100;
  /** The value of a standard or centered slider (not `range`). */
  @property({type: Number}) value?: number;
  /** The lower value of a `range` slider. */
  @property({type: Number, attribute: 'value-start'}) valueStart?: number;
  /** The upper value of a `range` slider. */
  @property({type: Number, attribute: 'value-end'}) valueEnd?: number;
  /**
   * The step between values, or `'any'` for a continuous slider. Arrow keys
   * move by one step; with `ticks`, a stop shows at each step.
   */
  @property({
    converter: {
      fromAttribute(value: string | null): number | 'any' {
        if (value === 'any') return 'any';
        if (value === null || value === '') return 1;
        const num = Number(value);
        return isNaN(num) || num <= 0 ? 1 : num;
      },
      toAttribute(value: number | 'any'): string | null {
        return String(value);
      },
    },
  })
  step: number | 'any' = 1;
  /** The size: `xs` (default), `sm`, `md`, `lg` or `xl`. */
  @property({type: String, reflect: true}) size: SliderSize = 'xs';
  /**
   * The orientation of the slider.
   *
   * Vertical orientation applies to standard, discrete, and centered variants
   * (range is not supported in vertical orientation).
   */
  @property({type: String, reflect: true})
  orientation: SliderOrientation = 'horizontal';
  /** Whether the slider selects a range with two handles (`value-start`, `value-end`). */
  @property({type: Boolean, reflect: true}) range = false;
  /** Whether the active track starts at the middle of the range, for values with a neutral point. */
  @property({type: Boolean, reflect: true}) centered = false;
  /** Whether to show a stop indicator at each `step`. */
  @property({type: Boolean}) ticks = false;
  /** Whether to show the value indicator above the handle while it is hovered, pressed or keyboard-focused. */
  @property({type: Boolean}) labeled = false;
  /**
   * The text of the value indicator and the handle's accessible value, when
   * the number alone is unclear (`5 minutes`). The slider does not format
   * numbers itself.
   */
  @property({attribute: 'value-label'}) valueLabel = '';
  /** `value-label` for the lower handle of a `range` slider. */
  @property({attribute: 'value-label-start'}) valueLabelStart = '';
  /** `value-label` for the upper handle of a `range` slider. */
  @property({attribute: 'value-label-end'}) valueLabelEnd = '';
  // The attributes are not `aria-*`: ARIA 1.3 defines no `aria-label-start`,
  // `aria-valuetext-start` and so on, and the prefix is reserved for it.
  /** The accessible name of the lower handle of a `range` slider (default: `aria-label` + " start"). */
  @property({attribute: 'label-start'}) ariaLabelStart = '';
  /** The accessible name of the upper handle of a `range` slider (default: `aria-label` + " end"). */
  @property({attribute: 'label-end'}) ariaLabelEnd = '';
  /** The accessible value text of the lower handle (default: `value-label-start`, then the number). */
  @property({attribute: 'valuetext-start'}) ariaValueTextStart = '';
  /** The accessible value text of the upper handle (default: `value-label-end`, then the number). */
  @property({attribute: 'valuetext-end'}) ariaValueTextEnd = '';

  private readonly formDisabled = new FormDisabledController(this);

  private get isRange(): boolean {
    return this.range && this.orientation !== 'vertical';
  }

  get nameStart() {
    return this.getAttribute('name-start') ?? this.name;
  }
  set nameStart(name: string) {
    this.setAttribute('name-start', name);
  }

  get nameEnd() {
    return this.getAttribute('name-end') ?? this.nameStart;
  }
  set nameEnd(name: string) {
    this.setAttribute('name-end', name);
  }

  @query('input.slider-start') readonly inputStart!: HTMLInputElement | null;
  @query('input.slider-end') readonly inputEnd!: HTMLInputElement | null;
  @query('.slider-handle.slider-start')
  readonly handleStart!: HTMLDivElement | null;
  @query('.slider-handle.slider-end')
  readonly handleEnd!: HTMLDivElement | null;

  @query('.slider') private readonly sliderEl!: HTMLElement | null;

  @state() protected renderValueStart?: number;
  @state() protected renderValueEnd?: number;
  @state() protected startOnTop = false;
  @state() private handleStartHover = false;
  @state() private handleEndHover = false;
  @state() private startFocusVisible = false;
  @state() private endFocusVisible = false;
  @state() private handlesOverlapping = false;
  @state() private trackLength?: number;

  private sliderResizeObserver?: ResizeObserver;
  private isRedispatchingEvent = false;
  private action?: Action;
  private pointerDownPending = false;
  private isPointerDragging = false;
  private get dragTarget(): HTMLInputElement | undefined {
    return this.isPointerDragging
      ? (this.action?.target as HTMLInputElement | undefined)
      : undefined;
  }

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('click', (event: MouseEvent) => {
        if (this.disabled || !isActivationClick(event) || !this.inputEnd) {
          return;
        }
        this.focus();
        dispatchActivationClick(this.inputEnd);
      });
    }
  }

  private get renderAriaLabelStart() {
    const {ariaLabel} = this as ARIAMixinStrict;
    return (
      this.ariaLabelStart ||
      (ariaLabel && `${ariaLabel} start`) ||
      this.valueLabelStart ||
      (this.valueStart !== undefined ? String(this.valueStart) : '')
    );
  }

  private get renderAriaValueTextStart() {
    return (
      this.ariaValueTextStart ||
      this.valueLabelStart ||
      (this.valueStart !== undefined ? String(this.valueStart) : '')
    );
  }

  private get renderAriaLabelEnd() {
    const {ariaLabel} = this as ARIAMixinStrict;
    if (this.isRange) {
      return (
        this.ariaLabelEnd ||
        (ariaLabel && `${ariaLabel} end`) ||
        this.valueLabelEnd ||
        (this.valueEnd !== undefined ? String(this.valueEnd) : '')
      );
    }
    return (
      ariaLabel ||
      this.valueLabel ||
      (this.value !== undefined ? String(this.value) : '')
    );
  }

  private get renderAriaValueTextEnd() {
    if (this.isRange) {
      return (
        this.ariaValueTextEnd ||
        this.valueLabelEnd ||
        (this.valueEnd !== undefined ? String(this.valueEnd) : '')
      );
    }
    const {ariaValueText} = this as ARIAMixinStrict;
    return (
      ariaValueText ||
      this.valueLabel ||
      (this.value !== undefined ? String(this.value) : '')
    );
  }

  override focus() {
    if (this.disabled) {
      return;
    }
    this.inputEnd?.focus();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.measureAndObserve();
  }

  override disconnectedCallback() {
    this.isPointerDragging = false;
    this.sliderResizeObserver?.disconnect();
    this.sliderResizeObserver = undefined;
    super.disconnectedCallback();
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.measureAndObserve();
  }

  private measureAndObserve() {
    if (isServer || !this.sliderEl) return;
    const isVertical = this.orientation === 'vertical';
    const rect = this.sliderEl.getBoundingClientRect();
    const initialLength = Math.round(isVertical ? rect.height : rect.width);
    if (initialLength > 0 && this.trackLength !== initialLength) {
      this.trackLength = initialLength;
    }
    if (!this.sliderResizeObserver) {
      this.sliderResizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const isVert = this.orientation === 'vertical';
          const length = Math.round(
            isVert ? entry.contentRect.height : entry.contentRect.width,
          );
          if (this.trackLength === length) continue;
          this.trackLength = length;
        }
      });
      this.sliderResizeObserver.observe(this.sliderEl);
    }
  }

  protected override willUpdate(changed: PropertyValues) {
    if (changed.has('disabled') && this.disabled) {
      this.isPointerDragging = false;
      this.pointerDownPending = false;
      this.handleStartHover = false;
      this.handleEndHover = false;
      this.startFocusVisible = false;
      this.endFocusVisible = false;
      this.action = undefined;
    }
    const rangeModeChanged = changed.has('range') || changed.has('orientation');
    this.renderValueStart =
      changed.has('valueStart') || rangeModeChanged
        ? this.valueStart
        : this.inputStart?.valueAsNumber;
    const endValueChanged =
      (changed.has('valueEnd') && (this.isRange || this.value === undefined)) ||
      changed.has('value') ||
      rangeModeChanged;
    this.renderValueEnd = endValueChanged
      ? this.isRange
        ? this.valueEnd
        : (this.value ?? this.valueEnd)
      : this.inputEnd?.valueAsNumber;
  }

  protected override updated(changed: PropertyValues) {
    if (this.isRange && this.inputStart) {
      this.renderValueStart = this.inputStart.valueAsNumber;
    }
    this.renderValueEnd = this.inputEnd!.valueAsNumber;

    if (this.isRange && this.inputStart) {
      const segment = (this.max - this.min) / 3;
      if (this.valueStart === undefined) {
        this.inputStart.valueAsNumber = this.min + segment;
        const v = this.inputStart.valueAsNumber;
        this.valueStart = this.renderValueStart = v;
      }
      if (this.valueEnd === undefined) {
        this.inputEnd!.valueAsNumber = this.min + 2 * segment;
        const v = this.inputEnd!.valueAsNumber;
        this.valueEnd = this.renderValueEnd = v;
      }
    } else {
      this.value ??= this.renderValueEnd;
    }

    if (
      changed.has('range') ||
      changed.has('orientation') ||
      changed.has('renderValueStart') ||
      changed.has('renderValueEnd') ||
      this.isUpdatePending
    ) {
      const startNub = this.handleStart?.querySelector('.slider-handle-nub');
      const endNub = this.handleEnd?.querySelector('.slider-handle-nub');
      this.handlesOverlapping = this.isRange && isOverlapping(startNub, endNub);
    }

    this.performUpdate();
  }

  private startAction(event: Event) {
    const target = event.target as HTMLInputElement;
    const fixed =
      target === this.inputStart ? this.inputEnd! : this.inputStart!;
    this.action = {
      canFlip: event.type === 'pointerdown',
      flipped: false,
      target,
      fixed,
      values: new Map([
        [target, target.valueAsNumber],
        [fixed, fixed?.valueAsNumber],
      ]),
    };
    this.requestUpdate();
  }

  private finishAction() {
    this.action = undefined;
    this.requestUpdate();
  }

  private computeFocusVisible(target: HTMLInputElement) {
    return !this.pointerDownPending && target.matches(':focus-visible');
  }

  private handleKeydown(event: KeyboardEvent) {
    if (this.disabled || event.key === 'Tab' || event.defaultPrevented) {
      return;
    }
    this.startAction(event);
    const target = event.target as HTMLInputElement;
    const isStart = target === this.inputStart;
    const isFocusVisible = this.computeFocusVisible(target);
    if (isStart) {
      this.startFocusVisible = isFocusVisible;
    } else {
      this.endFocusVisible = isFocusVisible;
    }

    const isVertical = this.orientation === 'vertical';
    if (isVertical && !this.disabled) {
      const stepSize =
        isFinite(Number(this.step)) && Number(this.step) > 0
          ? Number(this.step)
          : (this.max - this.min) / 100 || 1;
      if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
        event.preventDefault();
        const oldVal = target.valueAsNumber;
        if (this.step === 'any') {
          target.valueAsNumber = Math.min(
            this.max,
            target.valueAsNumber + stepSize,
          );
        } else {
          target.stepUp();
        }
        if (target.valueAsNumber !== oldVal) {
          target.dispatchEvent(
            new InputEvent('input', {bubbles: true, composed: true}),
          );
          target.dispatchEvent(new Event('change', {bubbles: true}));
        }
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const oldVal = target.valueAsNumber;
        if (this.step === 'any') {
          target.valueAsNumber = Math.max(
            this.min,
            target.valueAsNumber - stepSize,
          );
        } else {
          target.stepDown();
        }
        if (target.valueAsNumber !== oldVal) {
          target.dispatchEvent(
            new InputEvent('input', {bubbles: true, composed: true}),
          );
          target.dispatchEvent(new Event('change', {bubbles: true}));
        }
      }
    }
  }

  private handleKeyup() {
    this.finishAction();
  }

  private handleDown(event: PointerEvent) {
    if (this.disabled) {
      return;
    }
    this.pointerDownPending = true;
    this.isPointerDragging = event.isPrimary && event.button === 0;
    try {
      (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    } catch {}
    this.startAction(event);
    const isStart = (event.target as HTMLInputElement) === this.inputStart;
    // Since handle moves to pointer on down and there may not be a move,
    // it needs to be considered hovered.
    this.handleStartHover =
      !this.disabled && isStart && Boolean(this.handleStart);
    this.handleEndHover = !this.disabled && !isStart && Boolean(this.handleEnd);
  }

  private handleMove(event: PointerEvent) {
    if (this.isPointerDragging && event.buttons === 0) {
      this.isPointerDragging = false;
    }
    if (this.disabled) {
      this.handleStartHover = false;
      this.handleEndHover = false;
      return;
    }
    const dragTarget = this.dragTarget;
    if (dragTarget) {
      const isStart = dragTarget === this.inputStart;
      this.handleStartHover = isStart && inBounds(event, this.handleStart);
      this.handleEndHover = !isStart && inBounds(event, this.handleEnd);
      return;
    }
    this.applyNearestHover(event);
  }

  private handleEnter(event: PointerEvent) {
    this.handleMove(event);
  }

  private handleLeave() {
    this.handleStartHover = false;
    this.handleEndHover = false;
  }

  private handleCancel() {
    this.isPointerDragging = false;
    this.pointerDownPending = false;
    this.handleLeave();
    this.startOnTop = this.action?.target === this.inputStart;
    this.finishAction();
  }

  private handleLostPointerCapture() {
    this.isPointerDragging = false;
  }

  private applyNearestHover(event: PointerEvent) {
    if (this.disabled) {
      this.handleStartHover = false;
      this.handleEndHover = false;
      return;
    }
    const startInBounds = inBounds(event, this.handleStart);
    const endInBounds = inBounds(event, this.handleEnd);
    if (!this.handleStart || !this.handleEnd) {
      this.handleStartHover = false;
      this.handleEndHover = Boolean(this.handleEnd && endInBounds);
      return;
    }
    if (startInBounds && endInBounds) {
      const distStart = distanceToCenter(event, this.handleStart);
      const distEnd = distanceToCenter(event, this.handleEnd);
      if (Math.abs(distStart - distEnd) < 0.5) {
        const isStart = (event.target as HTMLInputElement) === this.inputStart;
        this.handleStartHover = isStart;
        this.handleEndHover = !isStart;
      } else if (distStart < distEnd) {
        this.handleStartHover = true;
        this.handleEndHover = false;
      } else {
        this.handleStartHover = false;
        this.handleEndHover = true;
      }
    } else {
      this.handleStartHover = startInBounds;
      this.handleEndHover = endInBounds;
    }
  }

  private handleReleaseHover(event: PointerEvent) {
    if (event.pointerType === 'touch') {
      this.handleStartHover = false;
      this.handleEndHover = false;
      return;
    }
    this.applyNearestHover(event);
  }

  private async handlePointerUp(event: PointerEvent) {
    this.isPointerDragging = false;
    await this.handleUp(event);
    this.pointerDownPending = false;
    this.handleReleaseHover(event);
  }

  private async handleUp(event: PointerEvent) {
    if (!this.action) {
      return;
    }

    const {target, values, flipped} = this.action;
    await new Promise(requestAnimationFrame);
    if (target !== undefined) {
      target.focus();
      if (flipped && target.valueAsNumber !== values.get(target)!) {
        target.dispatchEvent(new Event('change', {bubbles: true}));
      }
    }
    this.finishAction();
  }

  private updateOnTop(input: HTMLInputElement) {
    this.startOnTop = input.classList.contains('slider-start');
  }

  private handleFocus(event: FocusEvent) {
    if (this.disabled) {
      this.startFocusVisible = false;
      this.endFocusVisible = false;
      return;
    }
    const target = event.target as HTMLInputElement;
    this.updateOnTop(target);
    const isStart = target === this.inputStart;
    const isFocusVisible = this.computeFocusVisible(target);
    if (isStart) {
      this.startFocusVisible = isFocusVisible;
    } else {
      this.endFocusVisible = isFocusVisible;
    }
  }

  private handleBlur(event: FocusEvent) {
    const isStart = (event.target as HTMLInputElement) === this.inputStart;
    if (isStart) {
      this.startFocusVisible = false;
    } else {
      this.endFocusVisible = false;
    }
    if (
      !this.isPointerDragging &&
      !this.pointerDownPending &&
      event.target === this.action?.target
    ) {
      this.finishAction();
    }
  }

  private needsClamping() {
    if (!this.action) {
      return false;
    }

    const {target, fixed} = this.action;
    const isStart = target === this.inputStart;
    return isStart
      ? target.valueAsNumber > fixed.valueAsNumber
      : target.valueAsNumber < fixed.valueAsNumber;
  }

  private isActionFlipped() {
    const {action} = this;
    if (!action) {
      return false;
    }

    const {target, fixed, values} = action;
    if (action.canFlip) {
      action.canFlip = false;
      const coincident = values.get(target) === values.get(fixed);
      if (coincident && this.needsClamping()) {
        action.flipped = true;
        action.target = fixed;
        action.fixed = target;
      }
    }
    return action.flipped;
  }

  private flipAction() {
    if (!this.action) {
      return false;
    }

    const {target, fixed, values} = this.action;
    const changed = target.valueAsNumber !== fixed.valueAsNumber;
    target.valueAsNumber = fixed.valueAsNumber;
    fixed.valueAsNumber = values.get(fixed)!;
    return changed;
  }

  private clampAction() {
    if (!this.needsClamping() || !this.action) {
      return false;
    }
    const {target, fixed} = this.action;
    target.valueAsNumber = fixed.valueAsNumber;
    return true;
  }

  private handleInput(event: InputEvent) {
    if (this.disabled || this.isRedispatchingEvent) {
      return;
    }
    const target = event.target as HTMLInputElement;
    let stopPropagation = false;
    let redispatch = false;
    if (this.isRange && this.inputStart && this.inputEnd) {
      if (this.action) {
        if (this.isActionFlipped()) {
          stopPropagation = true;
          redispatch = this.flipAction();
        }
        if (this.clampAction()) {
          stopPropagation = true;
          redispatch = false;
        }
      } else if (
        target === this.inputStart &&
        this.inputStart.valueAsNumber > this.inputEnd.valueAsNumber
      ) {
        this.inputStart.valueAsNumber = this.inputEnd.valueAsNumber;
        stopPropagation = true;
      } else if (
        target === this.inputEnd &&
        this.inputEnd.valueAsNumber < this.inputStart.valueAsNumber
      ) {
        this.inputEnd.valueAsNumber = this.inputStart.valueAsNumber;
        stopPropagation = true;
      }
    }
    this.updateOnTop(this.action?.target ?? target);
    if (this.isRange) {
      this.valueStart = this.inputStart!.valueAsNumber;
      this.valueEnd = this.inputEnd!.valueAsNumber;
    } else {
      this.value = this.inputEnd!.valueAsNumber;
    }
    if (stopPropagation) {
      event.stopPropagation();
    }
    if (redispatch) {
      this.isRedispatchingEvent = true;
      redispatchEvent(target, event);
      this.isRedispatchingEvent = false;
    }
  }

  private handleChange(event: Event) {
    const changeTarget = event.target as HTMLInputElement;
    const {target, values} = this.action ?? {};
    const squelch =
      target && target.valueAsNumber === values?.get(changeTarget);
    if (!squelch) {
      redispatchEvent(this, event);
    }
    this.finishAction();
  }

  /** Disabled by the attribute or by a disabled fieldset. */
  override get disabled(): boolean {
    return super.disabled || !!this.formDisabled?.value;
  }
  override set disabled(disabled: boolean) {
    super.disabled = disabled;
  }

  override formDisabledCallback(disabled: boolean) {
    // Not the attribute: it would keep the control disabled after the
    // fieldset is enabled again.
    this.formDisabled.set(disabled);
  }

  override [getFormValue]() {
    if (this.isRange) {
      return rangeFormData(
        this.nameStart,
        this.valueStart ?? this.renderValueStart ?? this.min,
        this.nameEnd,
        this.valueEnd ?? this.renderValueEnd ?? this.max,
      );
    }

    return String(this.value ?? this.renderValueEnd ?? this.min);
  }

  override formResetCallback() {
    if (this.isRange) {
      this.valueStart = numberAttribute(this, 'value-start');
      this.valueEnd = numberAttribute(this, 'value-end');
      return;
    }
    this.value = numberAttribute(this, 'value');
  }

  override formStateRestoreCallback(
    state: string | Array<[string, string]> | null,
  ) {
    const [first, second] = parseNumberState(state);
    if (Array.isArray(state)) {
      this.valueStart = first;
      this.valueEnd = second;
      this.range = true;
      return;
    }

    this.value = first;
    this.range = false;
  }

  protected override render() {
    let minSpacing: number | undefined;
    if (!isServer) {
      const raw =
        getComputedStyle(this).getPropertyValue(
          '--stop-indicator-min-spacing',
        ) ||
        (this.sliderEl
          ? getComputedStyle(this.sliderEl).getPropertyValue(
              '--stop-indicator-min-spacing',
            )
          : '');
      const parsed = Number(raw.replace('px', '').trim());
      if (isFinite(parsed) && parsed > 0) {
        minSpacing = parsed;
      }
    }

    const isVertical = this.orientation === 'vertical';
    const isRange = this.isRange;

    const styles = computeSliderProperties({
      min: this.min,
      max: this.max,
      step: this.step,
      size: this.size,
      range: isRange,
      centered: this.centered,
      vertical: isVertical,
      valueStart: this.renderValueStart,
      valueEnd: this.renderValueEnd,
      value: this.renderValueEnd,
      trackLength: this.trackLength,
      minSpacing,
    });

    const labelStart =
      this.valueLabelStart || formatValueIndicatorLabel(this.renderValueStart);
    const labelEnd =
      (isRange ? this.valueLabelEnd : this.valueLabel) ||
      formatValueIndicatorLabel(this.renderValueEnd);

    const dragTarget = this.dragTarget;
    const startOnTop = dragTarget
      ? dragTarget === this.inputStart
      : this.startOnTop;
    const handleStartHover =
      !this.disabled &&
      this.handleStartHover &&
      (!dragTarget || dragTarget === this.inputStart);
    const handleEndHover =
      !this.disabled &&
      this.handleEndHover &&
      (!dragTarget || dragTarget === this.inputEnd);
    const isCoincident =
      isRange &&
      this.renderValueStart !== undefined &&
      this.renderValueStart === this.renderValueEnd;

    const {
      '--__icon-over-active': _iconOverActive,
      '--__start-stop-selected': _startStopSelected,
      '--__end-stop-selected': _endStopSelected,
      ...cssStyles
    } = styles;

    return html`
      <div
        class="${classMap(
          sliderClasses({
            disabled: this.disabled,
            ranged: isRange,
            centered: this.centered,
            vertical: isVertical,
          }),
        )}"
        style=${styleMap(cssStyles)}>
        ${when(
          isRange,
          () => html`
            <input
              type="range"
              class="slider-start"
              orient=${isVertical ? 'vertical' : nothing}
              .tabIndex=${0}
              ?disabled=${this.disabled}
              .min=${String(this.min)}
              .max=${String(this.max)}
              .step=${String(this.step)}
              .value=${String(this.renderValueStart)}
              aria-label=${this.renderAriaLabelStart || nothing}
              aria-valuetext=${this.renderAriaValueTextStart || nothing}
              aria-valuemin=${this.min}
              aria-valuemax=${this.valueEnd ?? this.max}
              @keydown=${this.handleKeydown}
              @keyup=${this.handleKeyup}
              @pointerdown=${this.handleDown}
              @pointerup=${this.handlePointerUp}
              @pointercancel=${this.handleCancel}
              @lostpointercapture=${this.handleLostPointerCapture}
              @pointerenter=${this.handleEnter}
              @pointermove=${this.handleMove}
              @pointerleave=${this.handleLeave}
              @input=${this.handleInput}
              @change=${this.handleChange}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur} />
          `,
        )}
        <input
          type="range"
          class="slider-end"
          orient=${isVertical ? 'vertical' : nothing}
          .tabIndex=${0}
          ?disabled=${this.disabled}
          .min=${String(this.min)}
          .max=${String(this.max)}
          .step=${String(this.step)}
          .value=${String(this.renderValueEnd)}
          aria-label=${this.renderAriaLabelEnd || nothing}
          aria-valuetext=${this.renderAriaValueTextEnd || nothing}
          aria-valuemin=${isRange ? (this.valueStart ?? this.min) : this.min}
          aria-valuemax=${this.max}
          @keydown=${this.handleKeydown}
          @keyup=${this.handleKeyup}
          @pointerdown=${this.handleDown}
          @pointerup=${this.handlePointerUp}
          @pointercancel=${this.handleCancel}
          @lostpointercapture=${this.handleLostPointerCapture}
          @pointerenter=${this.handleEnter}
          @pointermove=${this.handleMove}
          @pointerleave=${this.handleLeave}
          @input=${this.handleInput}
          @change=${this.handleChange}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur} />

        <div class="slider-track">
          <div
            class="slider-inactive-lead slider-track-box ${classMap({
              'slider-ticks': this.ticks,
            })}"></div>
          <div
            class="slider-active slider-track-box ${classMap({
              'slider-ticks': this.ticks,
            })}"></div>
          <div
            class="slider-inactive-trail slider-track-box ${classMap({
              'slider-ticks': this.ticks,
            })}"></div>
          ${when(
            !this.ticks,
            () => html`
              ${when(
                isRange || this.centered,
                () =>
                  html`<div
                    class="slider-boundary-stop slider-start ${classMap({
                      'slider-selected':
                        styles['--__start-stop-selected'] === '1',
                    })}"></div>`,
              )}
              <div
                class="slider-boundary-stop slider-end ${classMap({
                  'slider-selected': styles['--__end-stop-selected'] === '1',
                })}"></div>
            `,
          )}
          ${when(
            !isRange &&
              !this.centered &&
              !isVertical &&
              (this.size === 'md' || this.size === 'lg' || this.size === 'xl'),
            () => html`
              <div
                class="slider-icon ${classMap({
                  'slider-over-active': styles['--__icon-over-active'] === '1',
                })}"
                aria-hidden="true">
                <slot name="icon"></slot>
              </div>
            `,
          )}
        </div>

        <div class="slider-handles">
          ${when(
            isRange,
            () => html`
              <div
                class="${classMap({
                  ...handleClasses({
                    start: true,
                    hover: handleStartHover,
                    active: Boolean(
                      !this.disabled && this.action?.target === this.inputStart,
                    ),
                    focusVisible: !this.disabled && this.startFocusVisible,
                    disabled: this.disabled,
                    onTop: !this.disabled && startOnTop,
                    isOverlapping: isRange && this.handlesOverlapping,
                  }),
                  'slider-is-coincident': isCoincident,
                })}">
                <div
                  class="${classMap(
                    handleNubClasses({
                      focusVisible: !this.disabled && this.startFocusVisible,
                    }),
                  )}"></div>
                ${when(
                  this.labeled,
                  () =>
                    html`<div class="slider-label" aria-hidden="true">
                      <span class="slider-label-content">${labelStart}</span>
                    </div>`,
                )}
              </div>
            `,
          )}
          <div
            class="${classMap({
              ...handleClasses({
                end: true,
                hover: handleEndHover,
                active: Boolean(
                  !this.disabled && this.action?.target === this.inputEnd,
                ),
                focusVisible: !this.disabled && this.endFocusVisible,
                disabled: this.disabled,
                onTop: !this.disabled && !startOnTop,
                isOverlapping: isRange && this.handlesOverlapping,
              }),
              'slider-is-coincident': isCoincident,
            })}">
            <div
              class="${classMap(
                handleNubClasses({
                  focusVisible: !this.disabled && this.endFocusVisible,
                }),
              )}"></div>
            ${when(
              this.labeled,
              () =>
                html`<div class="slider-label" aria-hidden="true">
                  <span class="slider-label-content">${labelEnd}</span>
                </div>`,
            )}
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * Determines whether a pointer event falls within the bounds of a handle element,
 * applying symmetric hit-area inflation based on `--state-layer-size`.
 *
 * Note: Fine pointers (40px state layer with 44px handle height and 4px handle width)
 * produce inflateX = 18px and inflateY = 0px, maintaining bit-for-bit identical behavior
 * to the legacy horizontal-only hit slop. Coarse pointers (48px state layer) intentionally
 * yield inflateY = 2px ((48 - 44) / 2) because the coarse touch target exceeds the 44px
 * handle height. This is a deliberate small vertical hit-area expansion,
 * not a regression.
 */
function inBounds({x, y}: PointerEvent, element?: HTMLElement | null) {
  if (!element) {
    return false;
  }
  const {top, left, bottom, right} = element.getBoundingClientRect();
  const rawSize =
    getComputedStyle(element).getPropertyValue('--state-layer-size');
  const size = Number(rawSize.replace('px', '').trim()) || 0;
  const inflateX = Math.max(0, (size - (right - left)) / 2);
  const inflateY = Math.max(0, (size - (bottom - top)) / 2);
  return (
    x >= left - inflateX &&
    x <= right + inflateX &&
    y >= top - inflateY &&
    y <= bottom + inflateY
  );
}

function distanceToCenter({x, y}: PointerEvent, element: HTMLElement) {
  const {top, left, bottom, right} = element.getBoundingClientRect();
  const cx = left + (right - left) / 2;
  const cy = top + (bottom - top) / 2;
  return Math.hypot(x - cx, y - cy);
}

function isOverlapping(
  elA: Element | null | undefined,
  elB: Element | null | undefined,
) {
  if (!(elA && elB)) return false;
  const a = elA.getBoundingClientRect();
  const b = elB.getBoundingClientRect();
  return !(
    a.top > b.bottom ||
    a.right < b.left ||
    a.bottom < b.top ||
    a.left > b.right
  );
}
