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
import { type AutocompleteFilter } from './select.js';
/**
 * A Material Design autocomplete text field: an editable text field with a
 * menu of suggestions that filters as the person types (menus spec,
 * "Filtering"; Compose `ExposedDropdownMenuBox` with a `PrimaryEditable`
 * anchor).
 *
 * Follows the ARIA editable combobox pattern with list autocomplete: the
 * `<input>` has the `combobox` role and keeps focus, the menu is a `listbox`
 * of `md-gb-select-option`s and `aria-activedescendant` marks the active
 * option.
 *
 * Keyboard: typing filters and opens the menu; Down / Up open it (Alt+Down
 * without moving) and move the active option; Enter and Alt+Up pick the
 * active option; Escape closes the menu, or clears the text when it is
 * closed.
 *
 * `value` is the text. Picking an option sets it to the option's
 * `displayText`. It is form associated and supports `required`.
 *
 * @fires {InputEvent} input - The text changed by typing or picking an option. --bubbles --composed
 * @fires {Event} change - The text was committed (picked option or native change). --bubbles
 * @fires {Event} opening - The menu is about to open.
 * @fires {Event} opened - The menu opened.
 * @fires {Event} closing - The menu is about to close.
 * @fires {Event} closed - The menu closed.
 * @fires {Event} invalid - Fired when `checkValidity()` or `reportValidity()` finds the field invalid. --bubbles
 * @slot - The `md-gb-select-option` suggestions.
 * @slot leading-icon - An icon before the input.
 * @slot trailing-icon - Replaces the dropdown arrow icon.
 * @csspart container - The field's container.
 * @csspart input - The native `<input>`.
 * @csspart label - The floating label.
 * @csspart arrow - The dropdown arrow.
 * @csspart supporting-text - The supporting or error text.
 * @csspart menu - The `listbox` menu.
 * @cssprop --caret-color - Input caret color.
 * @cssprop --container-color - Field container color.
 * @cssprop --input-text-color - Input text color.
 * @cssprop --label-text-color - Label color.
 * @cssprop --menu-min-width - Minimum menu width.
 * @cssprop --trailing-icon-expanded-rotation - Dropdown arrow rotation while open.
 */
export declare class AutocompleteElement extends SelectBase {
    /** @nocollapse */
    static styles: import("lit").CSSResultOrNative[];
    /** The text in the field. */
    value: string;
    /**
     * The default value, the `value` attribute: what the field shows until the
     * person edits it and what form reset restores.
     */
    get defaultValue(): string;
    set defaultValue(value: string);
    /** Hint text shown in the input while it is empty and the label floats. */
    placeholder: string;
    /**
     * How options are filtered by the typed text: `contains` (default),
     * `starts-with`, or `none` (the page updates the options itself, e.g. from
     * a server, on `input`).
     */
    filter: AutocompleteFilter;
    protected readonly editable = true;
    private readonly input;
    /**
     * The text the options are filtered by: what the person typed, cleared
     * when they pick an option so that reopening shows every option.
     */
    private query;
    /** Restores the `value` attribute and clears native errors. */
    reset(): void;
    /** Selects all the text. */
    select(): void;
    attributeChangedCallback(attribute: string, oldValue: string | null, newValue: string | null): void;
    protected getField(): HTMLInputElement;
    protected isPopulated(): boolean;
    protected renderControl(describedBy: string, showError: boolean): import("lit-html").TemplateResult<1>;
    protected updated(changed: PropertyValues<this>): void;
    protected handleSlotChange(): void;
    protected handleFieldClick(path: EventTarget[]): void;
    protected pickOption(option: SelectOptionElement): void;
    private handleInput;
    private handleChange;
    private handleKeydown;
    /**
     * Hides the options that do not match the typed text. While the menu is
     * open, the options that stay ease into their new position and the ones
     * that reappear fade in (menus.md "Filtering": "Menu items ease into their
     * new position as the menu is filtered").
     */
    private applyFilter;
    /** Marks the option whose text is the value as selected. */
    private syncSelected;
    [getFormValue](): string;
    formResetCallback(): void;
    formStateRestoreCallback(state: string): void;
    [createValidator](): Validator<unknown>;
    [getValidityAnchor](): HTMLElement | null;
}
