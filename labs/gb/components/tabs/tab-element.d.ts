/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative } from 'lit';
import { AriaTabElement } from '../../../aria/tabs/tab.js';
/**
 * A Material Design tab component.
 *
 * This is a reference implementation of the `.tab` utility class. The same
 * class can be applied to any element with `role="tab"`.
 *
 * @slot - Used to display an optional leading icon, such as `<md-gb-icon>`.
 *     Icons are unclassed; the tab sets `--md-icon-*` for them.
 * @slot label - Used to display the tab's label. `<span class="tab-label">` in
 *     the default slot is equivalent. Bare text is not supported.
 * @slot badge - Used to display an optional badge, such as `<span class="badge tab-badge">`.
 * @cssstate selected - Whether the tab is selected.
 * @cssprop --badge-space
 * @cssprop --focus-indicator-clearance
 * @cssprop --focus-indicator-inset
 * @cssprop --focus-indicator-shape
 * @cssprop --icon-badge-inset
 * @cssprop --icon-color
 * @cssprop --icon-label-space
 * @cssprop --icon-size
 * @cssprop --label-text
 * @cssprop --label-text-axes
 * @cssprop --label-text-color
 * @cssprop --label-text-tracking
 * @cssprop --leading-space
 * @cssprop --stacked-icon-label-space
 * @cssprop --tab-scroll-margin
 * @cssprop --trailing-space
 */
export declare class TabElement extends AriaTabElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    connectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
