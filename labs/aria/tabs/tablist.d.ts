/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultGroup, LitElement, PropertyValues } from 'lit';
declare const baseClass: import("../../behaviors/mixin.js").MixinReturn<typeof LitElement, import("../../behaviors/element-internals.js").WithElementInternals>;
/**
 * An ARIA tablist element.
 */
export declare class AriaTablistElement extends baseClass {
    static styles: CSSResultGroup;
    /**
     * The tabs of this tablist.
     */
    get tabs(): HTMLElement[];
    /**
     * The currently selected tab, `null` only when there are no tab children.
     *
     * @export
     */
    get selectedTab(): HTMLElement | null;
    set selectedTab(tab: HTMLElement | null);
    /**
     * The index of the currently selected tab.
     *
     * @export
     */
    get selectedTabIndex(): number;
    set selectedTabIndex(index: number);
    /**
     * Whether or not to automatically select a tab when it is focused.
     */
    autoSelect: boolean;
    /**
     * Orientation of the tablist ('horizontal' or 'vertical').
     */
    orientation: 'horizontal' | 'vertical';
    private readonly slotElement;
    constructor();
    protected updated(changedProperties: PropertyValues<this>): void;
    protected render(): import("lit-html").TemplateResult<1>;
    /**
     * Returns true if the element is a valid tab component or role. Subclasses
     * may override this method to determine if an element is a supported tab.
     */
    protected isTab(element: HTMLElement): boolean;
    /**
     * Returns true if the tab is currently selected. Subclasses may override this
     * method to support custom tab selection implementations.
     */
    protected isTabSelected(tab: HTMLElement): boolean;
    /**
     * Updates the selection state of the tab element and visibility of its
     * tabpanel. Subclasses may override this method to support custom tab
     * selection implementations.
     */
    protected setTabSelected(tab: HTMLElement, isSelected: boolean): void;
    protected onTabChange(previousTab: HTMLElement | null): void;
    protected updateSelectedTab(tabToSelect: HTMLElement): void;
    private handleClick;
    private handleFocusin;
    protected handleSlotChange(): void;
}
export {};
