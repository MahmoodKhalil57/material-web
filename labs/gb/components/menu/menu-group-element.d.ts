/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
import { type MenuItemCheckable } from './menu.js';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement, import("../../../behaviors/element-internals.js").WithElementInternals>;
/**
 * A Material Design menu group component.
 *
 * Groups related items (menus.md "Menu groups"), optionally under a section
 * label, and makes them single- or multi-select (`checkable`). In a menu
 * with `layout="grouped"` each group is its own surface, separated from the
 * next by a gap, and a group the pointer or focus has left morphs to the
 * inactive shape (Compose `DropdownMenuGroup`).
 *
 * @slot - Used to display the menu group's items.
 * @csspart group - The group's root element.
 * @csspart label - The section label.
 */
export declare class MenuGroupElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    checkable: MenuItemCheckable | null;
    /** The section label shown above the group's items. */
    label: string;
    get menu(): HTMLElement | null;
    get items(): HTMLElement[];
    private readonly menuContext;
    private inactive;
    private engaged;
    private hasBeenEngaged;
    private readonly labelId;
    private menuAbort?;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1>;
    protected updated(): void;
    private isEngaged;
}
export {};
