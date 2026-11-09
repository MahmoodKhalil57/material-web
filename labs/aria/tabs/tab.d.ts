/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultGroup, LitElement } from 'lit';
declare const baseClass: import("../../behaviors/mixin.js").MixinReturn<import("../../behaviors/mixin.js").MixinReturn<import("../../behaviors/mixin.js").MixinReturn<typeof LitElement, import("../../behaviors/element-internals.js").WithElementInternals>, import("../../behaviors/custom-state-set.js").WithCustomStateSet>, import("../../behaviors/focusable.js").Focusable>;
/**
 * An ARIA tab element.
 *
 * @cssstate selected - Whether the tab is selected.
 */
export declare class AriaTabElement extends baseClass {
    static styles: CSSResultGroup;
    /**
     * ID of the associated `md-aria-tabpanel` element.
     */
    get tabpanel(): string;
    set tabpanel(value: string);
    /**
     * The tabpanel element that is controlled by this tab.
     */
    get tabpanelElement(): Element | null;
    set tabpanelElement(value: Element | null);
    /**
     * Whether the tab is selected.
     */
    get selected(): boolean;
    set selected(value: boolean);
    constructor();
    protected render(): import("lit-html").TemplateResult<1>;
}
export {};
