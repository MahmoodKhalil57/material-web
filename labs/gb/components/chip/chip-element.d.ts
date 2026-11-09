/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement, PropertyValues } from "lit";
import { type Density } from "../shared/density.js";
import { type ChipColor, type ChipType } from "./chip.js";
/**
 * A Material Design chip (`md-gb-chip`): an assist, filter, input or
 * suggestion chip.
 *
 * - Assist chips (`type="assist"`, the default) perform an action; with
 *   `href` they are links.
 * - Filter chips (`type="filter"`) toggle `selected` and show a checkmark
 *   when selected.
 * - Input chips (`type="input"`) represent user input; add `removable` for a
 *   remove button, and an avatar in the `icon` slot (`class="chip-avatar"`
 *   or an `<img>`). Add `editable` to let people correct the text (an
 *   email address, say): the first click or Enter selects the chip, a second
 *   interaction on the selected chip (or a double click) turns it back into
 *   a text string to edit. Enter or leaving the field commits, Escape
 *   cancels. A chip with only a remove icon (no label, icon or avatar) is
 *   one focusable element, the remove button.
 * - Suggestion chips (`type="suggestion"`) offer dynamic suggestions.
 *
 * Assist, filter and suggestion chips are flat (outlined) unless `elevated`.
 *
 * @slot - The chip label text.
 * @slot icon - An optional leading icon, or an avatar (`class="chip-avatar"`
 *     or an `<img>`; input chips).
 * @slot trailing-icon - An optional trailing icon (filter chips, e.g. a
 *     drop-down arrow).
 * @slot remove-icon - The remove button icon when `removable` (default: the
 *     `close` symbol).
 * @fires {Event} remove - Fired when the remove button is activated, or
 *     Backspace / Delete is pressed on a removable chip. --bubbles --composed
 * @fires {Event} change - Fired when a filter chip's selection changes.
 *     --bubbles
 * @fires {InputEvent} input - Fired when a filter chip's selection changes.
 *     --bubbles --composed
 * @fires {CustomEvent} edit - Fired when an `editable` chip's new text is
 *     committed; `detail` has `value` and `previousValue`. --bubbles
 *     --composed
 * @fires {Event} update-focus - Fired when `disabled` changes, so a chip set
 *     can update its tab stop. --bubbles
 * @csspart chip - The root container element.
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height - Container height at density 0.
 * @cssprop --container-shape
 * @cssprop --label-text
 * @cssprop --label-text-color
 * @cssprop --leading-icon-color
 * @cssprop --leading-icon-size
 * @cssprop --trailing-icon-color
 * @cssprop --trailing-icon-size
 * @cssprop --avatar-opacity
 * @cssprop --avatar-shape
 * @cssprop --avatar-size
 * @cssprop --outline-color
 * @cssprop --outline-width
 * @cssprop --leading-space
 * @cssprop --trailing-space
 * @cssprop --icon-label-space
 * @cssprop --density-step - Container height removed per density step.
 * @cssprop --target-size - The minimum touch target size, kept at any density.
 */
export declare class ChipElement extends LitElement {
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** The chip type: `assist` (default), `filter`, `input` or `suggestion`. */
    type: ChipType;
    /**
     * Elevated container, for chips on images or complex backgrounds. Input
     * chips have no elevated style.
     */
    elevated: boolean;
    /** @deprecated Use `elevated`. `color="elevated"` sets the elevated style. */
    color: ChipColor;
    /** Whether the filter (or input) chip is selected. */
    selected: boolean;
    /** Whether the chip has a remove button (input chips). */
    removable: boolean;
    /**
     * Whether the text of an input chip can be edited (chips.md "Input chips":
     * "Input chips can support editing to change their contents, such as
     * correcting an email address"). Editing starts by interacting with the
     * chip: a second click, Enter or Space on the selected chip, or a double
     * click. Committing with Enter or by leaving the field changes the chip's
     * text and fires `edit`; Escape (or emptying the text) keeps the old text.
     */
    editable: boolean;
    /** Whether the chip is being dragged (spec dragged state elevation). */
    dragged: boolean;
    /** Whether the chip is disabled. */
    disabled: boolean;
    /**
     * The value a chip set submits while the chip is selected. Defaults to the
     * label text, like a native `<option>`.
     */
    get value(): string;
    set value(value: string | null);
    private explicitValue;
    /** Whether the chip's set is disabled (a disabled form fieldset). */
    groupDisabled: boolean;
    /** Disabled by itself or by its set. */
    get effectivelyDisabled(): boolean;
    /** Whether the chip is soft-disabled (`aria-disabled="true"` while preserving focusability). */
    softDisabled: boolean;
    /**
     * The remove button's accessible label. Defaults to "Remove {chip label}"
     * (spec: the remove action is labeled separately).
     */
    removeLabel: string;
    /** The URL destination; makes an assist chip a link. */
    href: string;
    /** Where to display the linked `href` URL for a link chip. */
    target: "_blank" | "_parent" | "_self" | "_top" | "";
    /**
     * Sets the underlying `HTMLAnchorElement`'s `rel` attribute when `href` is
     * set.
     */
    rel: string;
    /**
     * Sets the underlying `HTMLAnchorElement`'s `referrerpolicy` attribute when
     * `href` is set.
     */
    referrerPolicy: string;
    /**
     * The density, from 0 (default) to -3. Each step down removes 4px from the
     * container height (32px); the label and icons keep their size and the
     * touch target stays 48px (chips.md: "regardless of placement or
     * density"). Values are clamped to that range. Density 0 inherits the
     * density of an enclosing `md-gb-chip-set`.
     *
     * chips.md: don't apply density by default; let people opt in to a denser
     * layout.
     */
    get density(): Density;
    set density(density: number);
    private densityValue;
    private hasLeadingIcon;
    private hasAvatar;
    private hasTrailingIcon;
    private label;
    /** Whether the remove button has focus (takes the primary action out of
     * the tab order, so Shift+Tab leaves the chip). */
    private removeFocused;
    private editing;
    private readonly editInput;
    /** Whether the chip is currently turned into a text string for editing. */
    get isEditing(): boolean;
    private readonly primaryAction;
    private readonly removeAction;
    constructor();
    /**
     * Focuses the chip's primary action, or its remove button with
     * `{trailing: true}` (chip set navigation backwards into a chip).
     */
    focus(options?: FocusOptions & {
        trailing?: boolean;
    }): void;
    /**
     * Turns an editable input chip into a text string to edit. Does nothing
     * for other chips.
     */
    startEdit(): void;
    /** Ends editing and applies the new text (empty or unchanged text keeps the old). */
    commitEdit(): void;
    /** Ends editing and keeps the old text. */
    cancelEdit(): void;
    private finishEdit;
    /** Replaces the chip's text, keeping its icons and other children. */
    private setLabelText;
    private handleEditKeydown;
    /**
     * An editable chip is selected by its first activation and edited by the
     * next one (chips.md: "either by selecting it or by a second interaction
     * after selection").
     */
    private handleActivate;
    protected updated(changed: PropertyValues<this>): void;
    private get isFilter();
    protected render(): import("lit-html").TemplateResult<1>;
    private renderContent;
    private renderRemoveButton;
    private handleIconSlotChange;
    private handleTrailingIconSlotChange;
    private handleLabelSlotChange;
    private handleChange;
    private handleKeydown;
    /**
     * Left / Right (mirrored in RTL) move focus between the primary action and
     * the remove button, like the legacy multi-action chip. Moving past either
     * end is left to the chip set.
     */
    private readonly handleActionNavigation;
    private handleRemoveFocus;
    private handleRemoveBlur;
    private handleRemove;
    private remove_;
}
