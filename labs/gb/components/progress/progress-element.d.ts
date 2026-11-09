/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement>;
/**
 * A Material Design 3 Expressive progress indicator: a linear or circular
 * track with a flat (or wavy) active indicator.
 *
 * Set `value` (0 to 1) to show determinate progress.
 *
 * @csspart indicator - The indicator container.
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-thickness
 * @cssprop --height - Linear only.
 * @cssprop --progress
 * @cssprop --size - Circular only.
 * @cssprop --stop-indicator-color
 * @cssprop --stop-indicator-shape
 * @cssprop --stop-indicator-size
 * @cssprop --stop-indicator-trailing-space
 * @cssprop --track-active-indicator-space
 * @cssprop --track-color
 * @cssprop --track-shape
 * @cssprop --track-thickness
 */
export declare class ProgressElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** Whether the indicator is circular instead of linear. */
    circular: boolean;
    /** Whether the active indicator is wavy instead of flat (the default). */
    wavy: boolean;
    /**
     * Progress from 0 to 1. When set, the indicator is determinate; when
     * unset (the default), it is indeterminate.
     */
    value?: number;
    constructor();
    protected render(): import("lit-html").TemplateResult<1>;
}
export {};
