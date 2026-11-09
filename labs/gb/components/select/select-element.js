/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { createValidator, getValidityAnchor, } from '../../../behaviors/constraint-validation.js';
import { getFormValue } from '../../../behaviors/form-associated.js';
import { SelectValidator } from '../../../behaviors/validators/select-validator.js';
import { SelectBase } from './select-base.js';
import { SELECTED_CHANGE_EVENT, } from './select-option-element.js';
import { SELECT_CLASSES } from './select.js';
/** Default typeahead buffer time, as in `md-select`. */
const DEFAULT_TYPEAHEAD_DELAY = 200;
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
export class SelectElement extends SelectBase {
    /**
     * The value of the selected option, or `''`. Setting it selects the first
     * option with that value (or none).
     */
    get value() {
        return this.selectedOptions[0]?.value ?? '';
    }
    set value(value) {
        this.requested = { value: String(value ?? '') };
        this.applyRequested();
    }
    /** The index of the selected option, or -1. */
    get selectedIndex() {
        return this.options.findIndex((option) => option.selected);
    }
    set selectedIndex(index) {
        this.requested = { index: Number(index) };
        this.applyRequested();
    }
    /** The selected options (at most one). */
    get selectedOptions() {
        const selected = this.options.find((option) => option.selected);
        return selected ? [selected] : [];
    }
    /**
     * The text shown in the field. Defaults to the selected option's
     * `displayText`; set it for SSR.
     */
    get displayText() {
        return this.explicitDisplayText ?? this.selectedOptions[0]?.displayText ?? '';
    }
    set displayText(text) {
        const old = this.displayText;
        this.explicitDisplayText = text || null;
        this.requestUpdate('displayText', old);
    }
    constructor() {
        super();
        /** The longest time between typeahead keystrokes, in milliseconds. */
        this.typeaheadDelay = DEFAULT_TYPEAHEAD_DELAY;
        this.editable = false;
        /** A `value` or `selectedIndex` set before the options were available. */
        this.requested = null;
        /** Whether the select is changing its options' `selected`. */
        this.syncing = false;
        this.explicitDisplayText = null;
        this.typeaheadBuffer = '';
        this.lastTypeaheadTime = -Infinity;
        this.addEventListener(SELECTED_CHANGE_EVENT, (event) => {
            if (this.syncing)
                return;
            const option = event.target;
            this.requested = null;
            if (option.selected) {
                this.selectOnly(option);
            }
            else {
                this.selectionChanged();
            }
        });
    }
    /** Selects the first option with the given value. */
    select(value) {
        this.value = value;
    }
    /** Selects the option at the given index. */
    selectIndex(index) {
        this.selectedIndex = index;
    }
    /** Restores the default selection (`selected` attributes). */
    reset() {
        this.requested = null;
        this.syncing = true;
        for (const option of this.options) {
            option.selected = option.hasAttribute('selected');
        }
        this.syncing = false;
        this.enforceSingleSelection();
        this.valueField.reset();
    }
    getField() {
        return this.field;
    }
    isPopulated() {
        return !!this.displayText;
    }
    initialActiveOption() {
        return this.selectedOptions[0] ?? this.visibleOptions[0] ?? null;
    }
    renderControl(describedBy, showError) {
        const { ariaLabel } = this;
        return html `<div
      id="field"
      class="text-field-input ${SELECT_CLASSES.value}"
      part="field"
      role="combobox"
      tabindex=${this.disabled ? '-1' : '0'}
      aria-controls="listbox"
      aria-expanded=${this.expandedState}
      aria-haspopup="listbox"
      aria-label=${ariaLabel || nothing}
      aria-labelledby=${!ariaLabel && this.label ? 'label' : nothing}
      aria-describedby=${describedBy || nothing}
      aria-invalid=${showError ? 'true' : 'false'}
      aria-required=${this.required ? 'true' : 'false'}
      aria-disabled=${this.disabled ? 'true' : 'false'}
      @keydown=${this.handleKeydown}>
      ${this.displayText}
    </div>`;
    }
    firstUpdated(changed) {
        super.firstUpdated(changed);
        this.applyRequested();
    }
    handleSlotChange() {
        super.handleSlotChange();
        if (this.requested) {
            this.applyRequested();
        }
        else {
            this.enforceSingleSelection();
        }
    }
    handleFieldClick() {
        this.open = !this.open;
    }
    pickOption(option) {
        const previous = this.selectedOptions[0];
        this.requested = null;
        this.selectOnly(option);
        if (previous !== option) {
            this.dispatchUserChange();
        }
    }
    handleKeydown(event) {
        if (this.disabled)
            return;
        const { key } = event;
        const typing = this.isTypeaheadKey(event);
        if (typing) {
            event.preventDefault();
            this.typeahead(event);
            return;
        }
        if (!this.open) {
            switch (key) {
                case 'ArrowDown':
                case 'ArrowUp':
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    this.open = true;
                    return;
                case 'Home':
                case 'End':
                    event.preventDefault();
                    this.open = true;
                    this.moveActive(key === 'Home' ? 'first' : 'last');
                    return;
                default:
                    return;
            }
        }
        if (key === 'Enter' || key === ' ') {
            event.preventDefault();
            this.pickActive();
            return;
        }
        if (key === 'Tab') {
            // Select the active option and let focus move on (ARIA select-only
            // combobox pattern).
            this.pickActive();
            this.open = false;
            return;
        }
        if (key === 'Home' || key === 'End') {
            event.preventDefault();
            this.moveActive(key === 'Home' ? 'first' : 'last');
            return;
        }
        if (this.handleOpenNavigationKey(event)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    isTypeaheadKey(event) {
        if (event.ctrlKey || event.metaKey || event.altKey)
            return false;
        if (event.key.length !== 1)
            return false;
        // Space selects, unless it continues a typed search ("New York").
        if (event.key === ' ') {
            return (!!this.typeaheadBuffer &&
                event.timeStamp - this.lastTypeaheadTime <= this.typeaheadDelay);
        }
        return true;
    }
    /**
     * Moves the active option to the next option whose text starts with the
     * typed characters. Typing the same character repeatedly cycles through
     * the options starting with it. Opens the menu (menus spec: "Letters: Focus
     * moves to the next menu item starting with letter").
     */
    typeahead(event) {
        if (event.timeStamp - this.lastTypeaheadTime > this.typeaheadDelay) {
            this.typeaheadBuffer = '';
        }
        this.lastTypeaheadTime = event.timeStamp;
        this.typeaheadBuffer += event.key.toLocaleLowerCase();
        const buffer = this.typeaheadBuffer;
        const repeated = [...buffer].every((char) => char === buffer[0]);
        const search = repeated ? buffer[0] : buffer;
        const options = this.visibleOptions;
        if (!options.length)
            return;
        const current = this.activeOption ?? this.selectedOptions[0] ?? null;
        const currentIndex = current ? options.indexOf(current) : -1;
        // A new search, or cycling, starts after the current option; a longer
        // search keeps the current option if it still matches.
        const start = repeated ? currentIndex + 1 : Math.max(currentIndex, 0);
        for (let i = 0; i < options.length; i++) {
            const option = options[(start + i) % options.length];
            if (option.typeaheadText.toLocaleLowerCase().startsWith(search)) {
                // Opening keeps an option that is already active.
                this.setActive(option);
                this.open = true;
                return;
            }
        }
    }
    /** Applies a `value` or `selectedIndex` set by the page. */
    applyRequested() {
        const request = this.requested;
        const options = this.options;
        if (!request || !options.length)
            return;
        let target;
        if (request.index !== undefined) {
            target = options[request.index] ?? null;
            this.requested = null;
        }
        else {
            target =
                options.find((option) => option.value === request.value) ?? null;
            // Keep an unmatched value in case its option is added later.
            if (target || request.value === '') {
                this.requested = null;
            }
        }
        this.selectOnly(target);
    }
    /** Selects one option (or none) and deselects the others. */
    selectOnly(target) {
        this.syncing = true;
        for (const option of this.options) {
            option.selected = option === target;
        }
        this.syncing = false;
        this.selectionChanged();
    }
    /** Keeps only the last selected option, like a native `<select>`. */
    enforceSingleSelection() {
        const selected = this.options.filter((option) => option.selected);
        if (selected.length > 1) {
            this.selectOnly(selected[selected.length - 1]);
        }
        else {
            this.selectionChanged();
        }
    }
    selectionChanged() {
        this.explicitDisplayText = null;
        // Re-renders the text and updates the form value and validity.
        this.requestUpdate();
    }
    [getFormValue]() {
        return this.value;
    }
    formResetCallback() {
        this.reset();
    }
    formStateRestoreCallback(state) {
        this.value = state;
    }
    [createValidator]() {
        return new SelectValidator(() => this);
    }
    [getValidityAnchor]() {
        return this.field;
    }
}
__decorate([
    property()
], SelectElement.prototype, "value", null);
__decorate([
    property({ type: Number, attribute: 'selected-index' })
], SelectElement.prototype, "selectedIndex", null);
__decorate([
    property({ attribute: 'display-text' })
], SelectElement.prototype, "displayText", null);
__decorate([
    property({ type: Number, attribute: 'typeahead-delay' })
], SelectElement.prototype, "typeaheadDelay", void 0);
__decorate([
    query('.select-value')
], SelectElement.prototype, "field", void 0);
//# sourceMappingURL=select-element.js.map