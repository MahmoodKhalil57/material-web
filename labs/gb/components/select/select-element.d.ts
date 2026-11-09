/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type PropertyValues } from 'lit';
import { createValidator, getValidityAnchor } from '../../../behaviors/constraint-validation.js';
import { getFormValue } from '../../../behaviors/form-associated.js';
import { type Validator } from '../../../behaviors/validators/validator.js';
import { SelectBase } from './select-base.js';
import { type SelectOptionElement } from './select-option-element.js';
/**
 * A Material Design select: a text field that opens a menu of options and
 * shows the selected option (an exposed dropdown menu, Compose
 * `ExposedDropdownMenuBox` with a read-only `PrimaryNotEditable` anchor).
 *
 * Follows the ARIA select-only combobox pattern: the field has the
 * `combobox` role and keeps focus, the menu is a `listbox` of
 * `md-gb-select-option`s, and `aria-activedescendant` marks the active
 * option.
 *
 * Keyboard: Alt+Down, Down, Up, Enter, Space, Home and End open the menu;
 * Up/Down, Home/End and PageUp/PageDown move the active option; Enter, Space,
 * Tab and Alt+Up select it and close; Escape closes; typing a character moves
 * to the next option starting with the typed text.
 *
 * It is form associated: it submits `value` under `name`, supports
 * `required`, `setCustomValidity()`, `reportValidity()`, and form reset and
 * restore.
 *
 * @fires {InputEvent} input - The person selected a different option. --bubbles --composed
 * @fires {Event} change - The person selected a different option. --bubbles
 * @fires {Event} opening - The menu is about to open.
 * @fires {Event} opened - The menu opened.
 * @fires {Event} closing - The menu is about to close.
 * @fires {Event} closed - The menu closed.
 * @fires {Event} invalid - Fired when `checkValidity()` or `reportValidity()` finds the select invalid. --bubbles
 * @slot - The `md-gb-select-option`s (and dividers).
 * @slot leading-icon - An icon before the selected text.
 * @slot trailing-icon - Replaces the dropdown arrow icon.
 * @csspart container - The field's container.
 * @csspart field - The `combobox` showing the selected text.
 * @csspart label - The floating label.
 * @csspart arrow - The dropdown arrow.
 * @csspart supporting-text - The supporting or error text.
 * @csspart menu - The `listbox` menu.
 * @cssprop --active-indicator-color - Filled active indicator color.
 * @cssprop --active-indicator-height - Filled active indicator thickness.
 * @cssprop --container-color - Field container color.
 * @cssprop --container-shape - Field container corner radius.
 * @cssprop --input-text - Selected text typography.
 * @cssprop --input-text-axes - Selected text font variation settings.
 * @cssprop --input-text-color - Selected text color.
 * @cssprop --input-text-tracking - Selected text letter spacing.
 * @cssprop --label-text - Label typography.
 * @cssprop --label-text-axes - Label font variation settings.
 * @cssprop --label-text-color - Label color.
 * @cssprop --label-text-populated-line-height - Floated label line height.
 * @cssprop --label-text-populated-size - Floated label font size.
 * @cssprop --label-text-tracking - Label letter spacing.
 * @cssprop --leading-icon-color - Leading icon color.
 * @cssprop --leading-icon-size - Leading icon size.
 * @cssprop --menu-closed-scale - Scale the menu opens from.
 * @cssprop --menu-min-width - Minimum menu width.
 * @cssprop --menu-window-margin - Space kept between the menu and the window edge.
 * @cssprop --outline-color - Outlined container outline color.
 * @cssprop --outline-width - Outlined container outline width.
 * @cssprop --supporting-text - Supporting text typography.
 * @cssprop --supporting-text-axes - Supporting text font variation settings.
 * @cssprop --supporting-text-color - Supporting text color.
 * @cssprop --supporting-text-tracking - Supporting text letter spacing.
 * @cssprop --trailing-icon-color - Dropdown arrow color.
 * @cssprop --trailing-icon-expanded-rotation - Dropdown arrow rotation while open.
 * @cssprop --trailing-icon-size - Dropdown arrow size.
 */
export declare class SelectElement extends SelectBase {
    /**
     * The value of the selected option, or `''`. Setting it selects the first
     * option with that value (or none).
     */
    get value(): string;
    set value(value: string);
    /** The index of the selected option, or -1. */
    get selectedIndex(): number;
    set selectedIndex(index: number);
    /** The selected options (at most one). */
    get selectedOptions(): SelectOptionElement[];
    /**
     * The text shown in the field. Defaults to the selected option's
     * `displayText`; set it for SSR.
     */
    get displayText(): string;
    set displayText(text: string);
    /** The longest time between typeahead keystrokes, in milliseconds. */
    typeaheadDelay: number;
    protected readonly editable = false;
    private readonly field;
    /** A `value` or `selectedIndex` set before the options were available. */
    private requested;
    /** Whether the select is changing its options' `selected`. */
    private syncing;
    private explicitDisplayText;
    private typeaheadBuffer;
    private lastTypeaheadTime;
    constructor();
    /** Selects the first option with the given value. */
    select(value: string): void;
    /** Selects the option at the given index. */
    selectIndex(index: number): void;
    /** Restores the default selection (`selected` attributes). */
    reset(): void;
    protected getField(): HTMLElement;
    protected isPopulated(): boolean;
    protected initialActiveOption(): SelectOptionElement;
    protected renderControl(describedBy: string, showError: boolean): import("lit-html").TemplateResult<1>;
    protected firstUpdated(changed: PropertyValues<this>): void;
    protected handleSlotChange(): void;
    protected handleFieldClick(): void;
    protected pickOption(option: SelectOptionElement): void;
    private handleKeydown;
    private isTypeaheadKey;
    /**
     * Moves the active option to the next option whose text starts with the
     * typed characters. Typing the same character repeatedly cycles through
     * the options starting with it. Opens the menu (menus spec: "Letters: Focus
     * moves to the next menu item starting with letter").
     */
    private typeahead;
    /** Applies a `value` or `selectedIndex` set by the page. */
    private applyRequested;
    /** Selects one option (or none) and deselects the others. */
    private selectOnly;
    /** Keeps only the last selected option, like a native `<select>`. */
    private enforceSingleSelection;
    private selectionChanged;
    [getFormValue](): string;
    formResetCallback(): void;
    formStateRestoreCallback(state: string): void;
    [createValidator](): Validator<unknown>;
    [getValidityAnchor](): HTMLElement | null;
}
