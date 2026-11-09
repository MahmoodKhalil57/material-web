/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
/**
 * A Material Design divider component.
 *
 * @csspart divider - The divider element.
 * @cssprop --color
 * @cssprop --thickness
 * @cssprop --inset-leading-space
 * @cssprop --inset-trailing-space
 */
export declare class DividerElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * Whether or not the divider is vertical.
     */
    vertical: boolean;
    /** Indents both ends 16dp (spec: middle-inset divider). */
    inset: boolean;
    /** Indents the leading end 16dp (spec: inset divider). */
    insetStart: boolean;
    /** Indents the trailing end 16dp. */
    insetEnd: boolean;
    protected render(): import("lit-html").TemplateResult<1>;
}
