/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement, PropertyValues } from "lit";
import { type ButtonElement } from "../button/button-element.js";
import "../iconbutton/md-gb-icon-button.js";
import "../menu/md-gb-menu.js";
import "../menu/md-gb-menu-item.js";
import { type Density } from "../shared/density.js";
import { OverflowController } from "../shared/overflow.js";
import { RovingFocusController } from "../shared/roving-focus.js";
import { type ButtonGroupSelection, type ButtonGroupVariant, type ButtonGroupResizing } from "./button-group.js";
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement, import("../../../behaviors/element-internals.js").WithElementInternals>;
/**
 * A Material Design button group component.
 *
 * @slot - Used to display buttons.
 * @slot overflow - Replaces the default overflow button (see `overflowMenu`).
 * @fires {InputEvent} input - Fired when selection changes. --bubbles --composed
 * @fires {Event} change - Fired when selection changes. --bubbles
 * @cssprop --between-space
 * @cssprop --pressed-item-width-multiplier
 * @cssprop --motion-spring-fast-spatial
 * @cssprop --motion-spring-fast-spatial-duration
 * @cssprop --inner-corner-size
 * @cssprop --pressed-inner-corner-size
 * @cssprop --outer-corner-size
 * @cssprop --outer-corner-square-size
 * @cssprop --density-step - Button height removed per density step.
 */
export declare class ButtonGroupElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    constructor();
    /** The visual variant of the button group. */
    variant: ButtonGroupVariant;
    /** The selection mode. */
    selection: ButtonGroupSelection;
    /** Whether selection is required in single-select mode. */
    required: boolean;
    /** Whether the button group is disabled. */
    disabled: boolean;
    /**
     * The density of the buttons inside, from 0 (default) to -3. Each step down
     * removes 4px from the buttons' height (button-groups.md: "Button groups
     * adapt to the height of the buttons inside, including when density is
     * applied"); touch targets stay 48px. A button's own non-zero `density`
     * wins. Values are clamped to that range.
     */
    get density(): Density;
    set density(density: number);
    private densityValue;
    /**
     * Whether the buttons at the trailing edge that do not fit collapse into a
     * trailing overflow menu, and come back when the group has room again
     * (button-groups.md, Adaptive design: "Buttons at the trailing edge of the
     * button group can be customized to collapse into an overflow menu at
     * smaller breakpoints, and become visible again at larger sizes."). The
     * group is as wide as its container allows: give it a width, or put it in
     * a narrower container, to make buttons overflow. Choosing a menu entry
     * clicks the original button.
     */
    overflowMenu: boolean;
    /**
     * How the group and its buttons resize (button-groups.md, Resizing).
     * `fixed`: every button keeps the width its own size and width give it.
     * `flexible`: the group fills the width of its container and its buttons
     * grow with it; an icon button does not stretch past its set width, and a
     * button with `resizing="fixed"` keeps its width. A button with
     * `resizing="flexible"` in a fixed group grows when the group is given
     * more width. Unset: a connected group is flexible (it spans its
     * surface), a standard group is fixed.
     */
    resizing: ButtonGroupResizing;
    /**
     * Buttons that do not fit hide, last first, and the menu entries click
     * them (shared OverflowController).
     */
    protected readonly overflowing: OverflowController;
    private readonly assignedElementsList;
    private readonly groupDisabledButtons;
    /**
     * The selection model (shared SelectionController): none, single (with
     * `required`) or multiple, selected by click and Space/Enter, `input` and
     * `change` events for user changes. The buttons are toggle buttons that
     * would toggle themselves, so the controller claims the click.
     */
    private readonly selectionModel;
    /** Returns all child `md-gb-button` elements. */
    get buttons(): ButtonElement[];
    /** Returns currently selected buttons. */
    get selectedButtons(): ButtonElement[];
    /** Returns index of first selected button or -1. */
    get selectedIndex(): number;
    /** Returns indices of all selected buttons. */
    get selectedIndices(): number[];
    /** Value of the currently selected button (or first selected). */
    get value(): string;
    /** Silent setter for single-select mode. */
    set value(val: string);
    /** Values of all currently selected buttons. */
    get values(): string[];
    connectedCallback(): void;
    protected firstUpdated(changedProperties: PropertyValues<this>): void;
    protected updated(changedProperties: PropertyValues<this>): void;
    private syncButtonsDisabledAndType;
    /**
     * Arrow keys move focus between the buttons (button-groups.md, Keyboard
     * navigation: "Arrow keys | Navigate inside the component"). Left/Right
     * follow the reading direction (mirrored in RTL) and wrap, like the
     * `focusgroup="toolbar wrap inline"` the group also declares (Chromium does
     * not ship `focusgroup`, so the shared RovingFocusController implements it).
     * Every button stays in the tab order ("Tab | Navigate between buttons").
     * Disabled buttons are skipped; soft-disabled ones stay focusable.
     */
    protected readonly rovingFocus: RovingFocusController;
    protected handleSlotChange(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
export {};
