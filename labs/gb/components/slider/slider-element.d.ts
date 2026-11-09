/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement, PropertyValues } from 'lit';
import { getFormValue } from '../../../behaviors/form-associated.js';
import { type SliderOrientation, type SliderSize } from './slider.js';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<(abstract new (...args: any[]) => import("../../../behaviors/element-internals.js").WithElementInternals) & typeof LitElement & import("../../../behaviors/form-associated.js").FormAssociatedConstructor, import("../../../behaviors/form-associated.js").FormAssociated>>;
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
export declare class SliderElement extends baseClass {
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    min: number;
    max: number;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
    step: number | 'any';
    size: SliderSize;
    /**
     * The orientation of the slider.
     *
     * Vertical orientation applies to standard, discrete, and centered variants
     * (range is not supported in vertical orientation).
     */
    orientation: SliderOrientation;
    range: boolean;
    centered: boolean;
    ticks: boolean;
    labeled: boolean;
    valueLabel: string;
    valueLabelStart: string;
    valueLabelEnd: string;
    ariaLabelStart: string;
    ariaLabelEnd: string;
    ariaValueTextStart: string;
    ariaValueTextEnd: string;
    private readonly formDisabled;
    private get isRange();
    get nameStart(): string;
    set nameStart(name: string);
    get nameEnd(): string;
    set nameEnd(name: string);
    readonly inputStart: HTMLInputElement | null;
    readonly inputEnd: HTMLInputElement | null;
    readonly handleStart: HTMLDivElement | null;
    readonly handleEnd: HTMLDivElement | null;
    private readonly sliderEl;
    protected renderValueStart?: number;
    protected renderValueEnd?: number;
    protected startOnTop: boolean;
    private handleStartHover;
    private handleEndHover;
    private startFocusVisible;
    private endFocusVisible;
    private handlesOverlapping;
    private trackLength?;
    private sliderResizeObserver?;
    private isRedispatchingEvent;
    private action?;
    private pointerDownPending;
    private isPointerDragging;
    private get dragTarget();
    constructor();
    private get renderAriaLabelStart();
    private get renderAriaValueTextStart();
    private get renderAriaLabelEnd();
    private get renderAriaValueTextEnd();
    focus(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(changedProperties: PropertyValues): void;
    private measureAndObserve;
    protected willUpdate(changed: PropertyValues): void;
    protected updated(changed: PropertyValues): void;
    private startAction;
    private finishAction;
    private computeFocusVisible;
    private handleKeydown;
    private handleKeyup;
    private handleDown;
    private handleMove;
    private handleEnter;
    private handleLeave;
    private handleCancel;
    private handleLostPointerCapture;
    private applyNearestHover;
    private handleReleaseHover;
    private handlePointerUp;
    private handleUp;
    private updateOnTop;
    private handleFocus;
    private handleBlur;
    private needsClamping;
    private isActionFlipped;
    private flipAction;
    private clampAction;
    private handleInput;
    private handleChange;
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled(): boolean;
    set disabled(disabled: boolean);
    formDisabledCallback(disabled: boolean): void;
    [getFormValue](): string | FormData;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | Array<[string, string]> | null): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
export {};
