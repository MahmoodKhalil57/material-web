/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { html, isServer, LitElement, nothing, } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { mixinDelegatesAria } from '../../../../internal/aria/delegate.js';
import { dispatchActivationClick, isActivationClick, } from '../../../../internal/events/form-label-activation.js';
import { redispatchEvent } from '../../../../internal/events/redispatch-event.js';
import { mixinElementInternals } from '../../../behaviors/element-internals.js';
import { getFormValue, mixinFormAssociated, } from '../../../behaviors/form-associated.js';
import { FormDisabledController, numberAttribute, parseNumberState, rangeFormData, } from '../shared/form-field.js';
import { computeSliderProperties, formatValueIndicatorLabel, handleClasses, handleNubClasses, sliderClasses, } from './slider.js';
import focusRingStyles from '../focus/focus-ring.css.js'; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import sliderStyles from './slider.css.js'; // github-only
// Separate variable needed for closure.
// spec-labels: sliders/specs/anatomy, sliders/guidelines/anatomy, sliders/specs/variants, sliders/specs/configurations, sliders/specs/measurements
const baseClass = mixinDelegatesAria(mixinFormAssociated(mixinElementInternals(LitElement)));
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
    get isRange() {
        return this.range && this.orientation !== 'vertical';
    }
    get nameStart() {
        return this.getAttribute('name-start') ?? this.name;
    }
    set nameStart(name) {
        this.setAttribute('name-start', name);
    }
    get nameEnd() {
        return this.getAttribute('name-end') ?? this.nameStart;
    }
    set nameEnd(name) {
        this.setAttribute('name-end', name);
    }
    get dragTarget() {
        return this.isPointerDragging
            ? this.action?.target
            : undefined;
    }
    constructor() {
        super();
        this.min = 0;
        this.max = 100;
        this.step = 1;
        this.size = 'xs';
        /**
         * The orientation of the slider.
         *
         * Vertical orientation applies to standard, discrete, and centered variants
         * (range is not supported in vertical orientation).
         */
        this.orientation = 'horizontal';
        this.range = false;
        this.centered = false;
        this.ticks = false;
        this.labeled = false;
        this.valueLabel = '';
        this.valueLabelStart = '';
        this.valueLabelEnd = '';
        // The attributes are not `aria-*`: ARIA 1.3 defines no `aria-label-start`,
        // `aria-valuetext-start` and so on, and the prefix is reserved for it.
        this.ariaLabelStart = '';
        this.ariaLabelEnd = '';
        this.ariaValueTextStart = '';
        this.ariaValueTextEnd = '';
        this.formDisabled = new FormDisabledController(this);
        this.startOnTop = false;
        this.handleStartHover = false;
        this.handleEndHover = false;
        this.startFocusVisible = false;
        this.endFocusVisible = false;
        this.handlesOverlapping = false;
        this.isRedispatchingEvent = false;
        this.pointerDownPending = false;
        this.isPointerDragging = false;
        if (!isServer) {
            this.addEventListener('click', (event) => {
                if (this.disabled || !isActivationClick(event) || !this.inputEnd) {
                    return;
                }
                this.focus();
                dispatchActivationClick(this.inputEnd);
            });
        }
    }
    get renderAriaLabelStart() {
        const { ariaLabel } = this;
        return (this.ariaLabelStart ||
            (ariaLabel && `${ariaLabel} start`) ||
            this.valueLabelStart ||
            (this.valueStart !== undefined ? String(this.valueStart) : ''));
    }
    get renderAriaValueTextStart() {
        return (this.ariaValueTextStart ||
            this.valueLabelStart ||
            (this.valueStart !== undefined ? String(this.valueStart) : ''));
    }
    get renderAriaLabelEnd() {
        const { ariaLabel } = this;
        if (this.isRange) {
            return (this.ariaLabelEnd ||
                (ariaLabel && `${ariaLabel} end`) ||
                this.valueLabelEnd ||
                (this.valueEnd !== undefined ? String(this.valueEnd) : ''));
        }
        return (ariaLabel ||
            this.valueLabel ||
            (this.value !== undefined ? String(this.value) : ''));
    }
    get renderAriaValueTextEnd() {
        if (this.isRange) {
            return (this.ariaValueTextEnd ||
                this.valueLabelEnd ||
                (this.valueEnd !== undefined ? String(this.valueEnd) : ''));
        }
        const { ariaValueText } = this;
        return (ariaValueText ||
            this.valueLabel ||
            (this.value !== undefined ? String(this.value) : ''));
    }
    focus() {
        if (this.disabled) {
            return;
        }
        this.inputEnd?.focus();
    }
    connectedCallback() {
        super.connectedCallback();
        this.measureAndObserve();
    }
    disconnectedCallback() {
        this.isPointerDragging = false;
        this.sliderResizeObserver?.disconnect();
        this.sliderResizeObserver = undefined;
        super.disconnectedCallback();
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.measureAndObserve();
    }
    measureAndObserve() {
        if (isServer || !this.sliderEl)
            return;
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
                    const length = Math.round(isVert ? entry.contentRect.height : entry.contentRect.width);
                    if (this.trackLength === length)
                        continue;
                    this.trackLength = length;
                }
            });
            this.sliderResizeObserver.observe(this.sliderEl);
        }
    }
    willUpdate(changed) {
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
        const endValueChanged = (changed.has('valueEnd') && (this.isRange || this.value === undefined)) ||
            changed.has('value') ||
            rangeModeChanged;
        this.renderValueEnd = endValueChanged
            ? this.isRange
                ? this.valueEnd
                : (this.value ?? this.valueEnd)
            : this.inputEnd?.valueAsNumber;
    }
    updated(changed) {
        if (this.isRange && this.inputStart) {
            this.renderValueStart = this.inputStart.valueAsNumber;
        }
        this.renderValueEnd = this.inputEnd.valueAsNumber;
        if (this.isRange && this.inputStart) {
            const segment = (this.max - this.min) / 3;
            if (this.valueStart === undefined) {
                this.inputStart.valueAsNumber = this.min + segment;
                const v = this.inputStart.valueAsNumber;
                this.valueStart = this.renderValueStart = v;
            }
            if (this.valueEnd === undefined) {
                this.inputEnd.valueAsNumber = this.min + 2 * segment;
                const v = this.inputEnd.valueAsNumber;
                this.valueEnd = this.renderValueEnd = v;
            }
        }
        else {
            this.value ??= this.renderValueEnd;
        }
        if (changed.has('range') ||
            changed.has('orientation') ||
            changed.has('renderValueStart') ||
            changed.has('renderValueEnd') ||
            this.isUpdatePending) {
            const startNub = this.handleStart?.querySelector('.slider-handle-nub');
            const endNub = this.handleEnd?.querySelector('.slider-handle-nub');
            this.handlesOverlapping = this.isRange && isOverlapping(startNub, endNub);
        }
        this.performUpdate();
    }
    startAction(event) {
        const target = event.target;
        const fixed = target === this.inputStart ? this.inputEnd : this.inputStart;
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
    finishAction() {
        this.action = undefined;
        this.requestUpdate();
    }
    computeFocusVisible(target) {
        return !this.pointerDownPending && target.matches(':focus-visible');
    }
    handleKeydown(event) {
        if (this.disabled || event.key === 'Tab' || event.defaultPrevented) {
            return;
        }
        this.startAction(event);
        const target = event.target;
        const isStart = target === this.inputStart;
        const isFocusVisible = this.computeFocusVisible(target);
        if (isStart) {
            this.startFocusVisible = isFocusVisible;
        }
        else {
            this.endFocusVisible = isFocusVisible;
        }
        const isVertical = this.orientation === 'vertical';
        if (isVertical && !this.disabled) {
            const stepSize = isFinite(Number(this.step)) && Number(this.step) > 0
                ? Number(this.step)
                : (this.max - this.min) / 100 || 1;
            if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
                event.preventDefault();
                const oldVal = target.valueAsNumber;
                if (this.step === 'any') {
                    target.valueAsNumber = Math.min(this.max, target.valueAsNumber + stepSize);
                }
                else {
                    target.stepUp();
                }
                if (target.valueAsNumber !== oldVal) {
                    target.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
                    target.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
                event.preventDefault();
                const oldVal = target.valueAsNumber;
                if (this.step === 'any') {
                    target.valueAsNumber = Math.max(this.min, target.valueAsNumber - stepSize);
                }
                else {
                    target.stepDown();
                }
                if (target.valueAsNumber !== oldVal) {
                    target.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
                    target.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }
    }
    handleKeyup() {
        this.finishAction();
    }
    handleDown(event) {
        if (this.disabled) {
            return;
        }
        this.pointerDownPending = true;
        this.isPointerDragging = event.isPrimary && event.button === 0;
        try {
            event.target.setPointerCapture?.(event.pointerId);
        }
        catch { }
        this.startAction(event);
        const isStart = event.target === this.inputStart;
        // Since handle moves to pointer on down and there may not be a move,
        // it needs to be considered hovered.
        this.handleStartHover =
            !this.disabled && isStart && Boolean(this.handleStart);
        this.handleEndHover = !this.disabled && !isStart && Boolean(this.handleEnd);
    }
    handleMove(event) {
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
    handleEnter(event) {
        this.handleMove(event);
    }
    handleLeave() {
        this.handleStartHover = false;
        this.handleEndHover = false;
    }
    handleCancel() {
        this.isPointerDragging = false;
        this.pointerDownPending = false;
        this.handleLeave();
        this.startOnTop = this.action?.target === this.inputStart;
        this.finishAction();
    }
    handleLostPointerCapture() {
        this.isPointerDragging = false;
    }
    applyNearestHover(event) {
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
                const isStart = event.target === this.inputStart;
                this.handleStartHover = isStart;
                this.handleEndHover = !isStart;
            }
            else if (distStart < distEnd) {
                this.handleStartHover = true;
                this.handleEndHover = false;
            }
            else {
                this.handleStartHover = false;
                this.handleEndHover = true;
            }
        }
        else {
            this.handleStartHover = startInBounds;
            this.handleEndHover = endInBounds;
        }
    }
    handleReleaseHover(event) {
        if (event.pointerType === 'touch') {
            this.handleStartHover = false;
            this.handleEndHover = false;
            return;
        }
        this.applyNearestHover(event);
    }
    async handlePointerUp(event) {
        this.isPointerDragging = false;
        await this.handleUp(event);
        this.pointerDownPending = false;
        this.handleReleaseHover(event);
    }
    async handleUp(event) {
        if (!this.action) {
            return;
        }
        const { target, values, flipped } = this.action;
        await new Promise(requestAnimationFrame);
        if (target !== undefined) {
            target.focus();
            if (flipped && target.valueAsNumber !== values.get(target)) {
                target.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
        this.finishAction();
    }
    updateOnTop(input) {
        this.startOnTop = input.classList.contains('slider-start');
    }
    handleFocus(event) {
        if (this.disabled) {
            this.startFocusVisible = false;
            this.endFocusVisible = false;
            return;
        }
        const target = event.target;
        this.updateOnTop(target);
        const isStart = target === this.inputStart;
        const isFocusVisible = this.computeFocusVisible(target);
        if (isStart) {
            this.startFocusVisible = isFocusVisible;
        }
        else {
            this.endFocusVisible = isFocusVisible;
        }
    }
    handleBlur(event) {
        const isStart = event.target === this.inputStart;
        if (isStart) {
            this.startFocusVisible = false;
        }
        else {
            this.endFocusVisible = false;
        }
        if (!this.isPointerDragging &&
            !this.pointerDownPending &&
            event.target === this.action?.target) {
            this.finishAction();
        }
    }
    needsClamping() {
        if (!this.action) {
            return false;
        }
        const { target, fixed } = this.action;
        const isStart = target === this.inputStart;
        return isStart
            ? target.valueAsNumber > fixed.valueAsNumber
            : target.valueAsNumber < fixed.valueAsNumber;
    }
    isActionFlipped() {
        const { action } = this;
        if (!action) {
            return false;
        }
        const { target, fixed, values } = action;
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
    flipAction() {
        if (!this.action) {
            return false;
        }
        const { target, fixed, values } = this.action;
        const changed = target.valueAsNumber !== fixed.valueAsNumber;
        target.valueAsNumber = fixed.valueAsNumber;
        fixed.valueAsNumber = values.get(fixed);
        return changed;
    }
    clampAction() {
        if (!this.needsClamping() || !this.action) {
            return false;
        }
        const { target, fixed } = this.action;
        target.valueAsNumber = fixed.valueAsNumber;
        return true;
    }
    handleInput(event) {
        if (this.disabled || this.isRedispatchingEvent) {
            return;
        }
        const target = event.target;
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
            }
            else if (target === this.inputStart &&
                this.inputStart.valueAsNumber > this.inputEnd.valueAsNumber) {
                this.inputStart.valueAsNumber = this.inputEnd.valueAsNumber;
                stopPropagation = true;
            }
            else if (target === this.inputEnd &&
                this.inputEnd.valueAsNumber < this.inputStart.valueAsNumber) {
                this.inputEnd.valueAsNumber = this.inputStart.valueAsNumber;
                stopPropagation = true;
            }
        }
        this.updateOnTop(this.action?.target ?? target);
        if (this.isRange) {
            this.valueStart = this.inputStart.valueAsNumber;
            this.valueEnd = this.inputEnd.valueAsNumber;
        }
        else {
            this.value = this.inputEnd.valueAsNumber;
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
    handleChange(event) {
        const changeTarget = event.target;
        const { target, values } = this.action ?? {};
        const squelch = target && target.valueAsNumber === values?.get(changeTarget);
        if (!squelch) {
            redispatchEvent(this, event);
        }
        this.finishAction();
    }
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled() {
        return super.disabled || !!this.formDisabled?.value;
    }
    set disabled(disabled) {
        super.disabled = disabled;
    }
    formDisabledCallback(disabled) {
        // Not the attribute: it would keep the control disabled after the
        // fieldset is enabled again.
        this.formDisabled.set(disabled);
    }
    [getFormValue]() {
        if (this.isRange) {
            return rangeFormData(this.nameStart, this.valueStart ?? this.renderValueStart ?? this.min, this.nameEnd, this.valueEnd ?? this.renderValueEnd ?? this.max);
        }
        return String(this.value ?? this.renderValueEnd ?? this.min);
    }
    formResetCallback() {
        if (this.isRange) {
            this.valueStart = numberAttribute(this, 'value-start');
            this.valueEnd = numberAttribute(this, 'value-end');
            return;
        }
        this.value = numberAttribute(this, 'value');
    }
    formStateRestoreCallback(state) {
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
    render() {
        let minSpacing;
        if (!isServer) {
            const raw = getComputedStyle(this).getPropertyValue('--stop-indicator-min-spacing') ||
                (this.sliderEl
                    ? getComputedStyle(this.sliderEl).getPropertyValue('--stop-indicator-min-spacing')
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
        const labelStart = this.valueLabelStart || formatValueIndicatorLabel(this.renderValueStart);
        const labelEnd = (isRange ? this.valueLabelEnd : this.valueLabel) ||
            formatValueIndicatorLabel(this.renderValueEnd);
        const dragTarget = this.dragTarget;
        const startOnTop = dragTarget
            ? dragTarget === this.inputStart
            : this.startOnTop;
        const handleStartHover = !this.disabled &&
            this.handleStartHover &&
            (!dragTarget || dragTarget === this.inputStart);
        const handleEndHover = !this.disabled &&
            this.handleEndHover &&
            (!dragTarget || dragTarget === this.inputEnd);
        const isCoincident = isRange &&
            this.renderValueStart !== undefined &&
            this.renderValueStart === this.renderValueEnd;
        const { '--__icon-over-active': _iconOverActive, '--__start-stop-selected': _startStopSelected, '--__end-stop-selected': _endStopSelected, ...cssStyles } = styles;
        return html `
      <div
        class="${classMap(sliderClasses({
            disabled: this.disabled,
            ranged: isRange,
            centered: this.centered,
            vertical: isVertical,
        }))}"
        style=${styleMap(cssStyles)}>
        ${when(isRange, () => html `
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
          `)}
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
          ${when(!this.ticks, () => html `
              ${when(isRange || this.centered, () => html `<div
                    class="slider-boundary-stop slider-start ${classMap({
            'slider-selected': styles['--__start-stop-selected'] === '1',
        })}"></div>`)}
              <div
                class="slider-boundary-stop slider-end ${classMap({
            'slider-selected': styles['--__end-stop-selected'] === '1',
        })}"></div>
            `)}
          ${when(!isRange &&
            !this.centered &&
            !isVertical &&
            (this.size === 'md' || this.size === 'lg' || this.size === 'xl'), () => html `
              <div
                class="slider-icon ${classMap({
            'slider-over-active': styles['--__icon-over-active'] === '1',
        })}"
                aria-hidden="true">
                <slot name="icon"></slot>
              </div>
            `)}
        </div>

        <div class="slider-handles">
          ${when(isRange, () => html `
              <div
                class="${classMap({
            ...handleClasses({
                start: true,
                hover: handleStartHover,
                active: Boolean(!this.disabled && this.action?.target === this.inputStart),
                focusVisible: !this.disabled && this.startFocusVisible,
                disabled: this.disabled,
                onTop: !this.disabled && startOnTop,
                isOverlapping: isRange && this.handlesOverlapping,
            }),
            'slider-is-coincident': isCoincident,
        })}">
                <div
                  class="${classMap(handleNubClasses({
            focusVisible: !this.disabled && this.startFocusVisible,
        }))}"></div>
                ${when(this.labeled, () => html `<div class="slider-label" aria-hidden="true">
                      <span class="slider-label-content">${labelStart}</span>
                    </div>`)}
              </div>
            `)}
          <div
            class="${classMap({
            ...handleClasses({
                end: true,
                hover: handleEndHover,
                active: Boolean(!this.disabled && this.action?.target === this.inputEnd),
                focusVisible: !this.disabled && this.endFocusVisible,
                disabled: this.disabled,
                onTop: !this.disabled && !startOnTop,
                isOverlapping: isRange && this.handlesOverlapping,
            }),
            'slider-is-coincident': isCoincident,
        })}">
            <div
              class="${classMap(handleNubClasses({
            focusVisible: !this.disabled && this.endFocusVisible,
        }))}"></div>
            ${when(this.labeled, () => html `<div class="slider-label" aria-hidden="true">
                  <span class="slider-label-content">${labelEnd}</span>
                </div>`)}
          </div>
        </div>
      </div>
    `;
    }
}
/** @nocollapse */
SliderElement.shadowRootOptions = {
    mode: 'open',
    delegatesFocus: true,
};
/** @nocollapse */
SliderElement.styles = [focusRingStyles, sliderStyles];
__decorate([
    property({ type: Number })
], SliderElement.prototype, "min", void 0);
__decorate([
    property({ type: Number })
], SliderElement.prototype, "max", void 0);
__decorate([
    property({ type: Number })
], SliderElement.prototype, "value", void 0);
__decorate([
    property({ type: Number, attribute: 'value-start' })
], SliderElement.prototype, "valueStart", void 0);
__decorate([
    property({ type: Number, attribute: 'value-end' })
], SliderElement.prototype, "valueEnd", void 0);
__decorate([
    property({
        converter: {
            fromAttribute(value) {
                if (value === 'any')
                    return 'any';
                if (value === null || value === '')
                    return 1;
                const num = Number(value);
                return isNaN(num) || num <= 0 ? 1 : num;
            },
            toAttribute(value) {
                return String(value);
            },
        },
    })
], SliderElement.prototype, "step", void 0);
__decorate([
    property({ type: String, reflect: true })
], SliderElement.prototype, "size", void 0);
__decorate([
    property({ type: String, reflect: true })
], SliderElement.prototype, "orientation", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SliderElement.prototype, "range", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SliderElement.prototype, "centered", void 0);
__decorate([
    property({ type: Boolean })
], SliderElement.prototype, "ticks", void 0);
__decorate([
    property({ type: Boolean })
], SliderElement.prototype, "labeled", void 0);
__decorate([
    property({ attribute: 'value-label' })
], SliderElement.prototype, "valueLabel", void 0);
__decorate([
    property({ attribute: 'value-label-start' })
], SliderElement.prototype, "valueLabelStart", void 0);
__decorate([
    property({ attribute: 'value-label-end' })
], SliderElement.prototype, "valueLabelEnd", void 0);
__decorate([
    property({ attribute: 'label-start' })
], SliderElement.prototype, "ariaLabelStart", void 0);
__decorate([
    property({ attribute: 'label-end' })
], SliderElement.prototype, "ariaLabelEnd", void 0);
__decorate([
    property({ attribute: 'valuetext-start' })
], SliderElement.prototype, "ariaValueTextStart", void 0);
__decorate([
    property({ attribute: 'valuetext-end' })
], SliderElement.prototype, "ariaValueTextEnd", void 0);
__decorate([
    query('input.slider-start')
], SliderElement.prototype, "inputStart", void 0);
__decorate([
    query('input.slider-end')
], SliderElement.prototype, "inputEnd", void 0);
__decorate([
    query('.slider-handle.slider-start')
], SliderElement.prototype, "handleStart", void 0);
__decorate([
    query('.slider-handle.slider-end')
], SliderElement.prototype, "handleEnd", void 0);
__decorate([
    query('.slider')
], SliderElement.prototype, "sliderEl", void 0);
__decorate([
    state()
], SliderElement.prototype, "renderValueStart", void 0);
__decorate([
    state()
], SliderElement.prototype, "renderValueEnd", void 0);
__decorate([
    state()
], SliderElement.prototype, "startOnTop", void 0);
__decorate([
    state()
], SliderElement.prototype, "handleStartHover", void 0);
__decorate([
    state()
], SliderElement.prototype, "handleEndHover", void 0);
__decorate([
    state()
], SliderElement.prototype, "startFocusVisible", void 0);
__decorate([
    state()
], SliderElement.prototype, "endFocusVisible", void 0);
__decorate([
    state()
], SliderElement.prototype, "handlesOverlapping", void 0);
__decorate([
    state()
], SliderElement.prototype, "trackLength", void 0);
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
function inBounds({ x, y }, element) {
    if (!element) {
        return false;
    }
    const { top, left, bottom, right } = element.getBoundingClientRect();
    const rawSize = getComputedStyle(element).getPropertyValue('--state-layer-size');
    const size = Number(rawSize.replace('px', '').trim()) || 0;
    const inflateX = Math.max(0, (size - (right - left)) / 2);
    const inflateY = Math.max(0, (size - (bottom - top)) / 2);
    return (x >= left - inflateX &&
        x <= right + inflateX &&
        y >= top - inflateY &&
        y <= bottom + inflateY);
}
function distanceToCenter({ x, y }, element) {
    const { top, left, bottom, right } = element.getBoundingClientRect();
    const cx = left + (right - left) / 2;
    const cy = top + (bottom - top) / 2;
    return Math.hypot(x - cx, y - cy);
}
function isOverlapping(elA, elB) {
    if (!(elA && elB))
        return false;
    const a = elA.getBoundingClientRect();
    const b = elB.getBoundingClientRect();
    return !(a.top > b.bottom ||
        a.right < b.left ||
        a.bottom < b.top ||
        a.left > b.right);
}
//# sourceMappingURL=slider-element.js.map