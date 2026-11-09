/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement>;
/**
 * A Material Design 3 Expressive loading indicator: a shape that morphs
 * through Material shapes while it turns.
 *
 * Set `value` (0 to 1) to show determinate progress.
 *
 * @csspart indicator - The indicator container.
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-size
 * @cssprop --container-color
 * @cssprop --container-height
 * @cssprop --container-shape
 * @cssprop --container-width
 * @cssprop --progress
 * @cssprop --size - The container size, clamped to 24dp-240dp (48dp default).
 */
export declare class LoadingIndicatorElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** Whether the indicator has a container. */
    contained: boolean;
    /**
     * Progress from 0 to 1. When set, the indicator is determinate; when
     * unset (the default), it is indeterminate.
     */
    value?: number;
    protected render(): import("lit-html").TemplateResult<1>;
}
export {};
