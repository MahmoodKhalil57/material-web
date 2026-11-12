/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, nothing, type PropertyValues} from 'lit';
import {property, query} from 'lit/decorators.js';
import {live} from 'lit/directives/live.js';
import {type ARIAMixinStrict} from '../../foundations/accessibility/aria/aria.js';
import {stringConverter} from '../../internal/controller/string-converter.js';
import {
  createValidator,
  getValidityAnchor,
} from '../../internal/behaviors/constraint-validation.js';
import {getFormValue} from '../../internal/behaviors/form-associated.js';
import {TextFieldValidator} from '../../internal/behaviors/validators/text-field-validator.js';
import {type Validator} from '../../internal/behaviors/validators/validator.js';
import {isReducedMotion} from '../../styles/motion/motion.js';
import {SelectBase} from './select-base.js';
import {type SelectOptionElement} from './select-option-element.js';
import {
  type AutocompleteFilter,
  matchesFilter,
  SELECT_CLASSES,
} from './select.js';

import autocompleteStyles from './autocomplete.css' with {type: 'css'}; // github-only
// import autocompleteStyles from './autocomplete.cssresult.js'; // google3-only

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
export class AutocompleteElement extends SelectBase {
  /** @nocollapse */
  static override styles = [...SelectBase.styles, autocompleteStyles];

  /** The text in the field. */
  @property() value = '';

  /**
   * The default value, the `value` attribute: what the field shows until the
   * person edits it and what form reset restores.
   */
  get defaultValue(): string {
    return this.getAttribute('value') ?? '';
  }
  set defaultValue(value: string) {
    this.setAttribute('value', value);
  }

  /** Hint text shown in the input while it is empty and the label floats. */
  @property({reflect: true, converter: stringConverter}) placeholder = '';

  /**
   * How options are filtered by the typed text: `contains` (default),
   * `starts-with`, or `none` (the page updates the options itself, e.g. from
   * a server, on `input`).
   */
  @property() filter: AutocompleteFilter = 'contains';

  protected readonly editable = true;

  @query('.text-field-input') private readonly input!: HTMLInputElement | null;

  /**
   * The text the options are filtered by: what the person typed, cleared
   * when they pick an option so that reopening shows every option.
   */
  private query = '';
  /** Restores the `value` attribute and clears native errors. */
  reset() {
    this.valueField.reset();
    this.value = this.defaultValue;
    this.query = '';
  }

  /** Selects all the text. */
  select() {
    this.input?.select();
  }

  override attributeChangedCallback(
    attribute: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (this.valueField?.ignoresAttribute(attribute)) {
      // After user input, the value attribute no longer updates the value.
      return;
    }
    super.attributeChangedCallback(attribute, oldValue, newValue);
  }

  protected override getField() {
    return this.input;
  }

  protected override isPopulated() {
    return !!this.value;
  }

  protected override renderControl(describedBy: string, showError: boolean) {
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`<input
      id="input"
      class="text-field-input"
      part="input"
      role="combobox"
      autocomplete="off"
      aria-autocomplete=${this.filter === 'none' ? 'none' : 'list'}
      aria-controls="listbox"
      aria-expanded=${this.expandedState}
      aria-label=${ariaLabel || nothing}
      aria-labelledby=${!ariaLabel && this.label ? 'label' : nothing}
      aria-describedby=${describedBy || nothing}
      aria-invalid=${showError ? 'true' : 'false'}
      name=${this.name || nothing}
      placeholder=${this.placeholder || nothing}
      ?disabled=${this.disabled}
      ?required=${this.required}
      .value=${live(this.value)}
      @input=${this.handleInput}
      @change=${this.handleChange}
      @keydown=${this.handleKeydown} />`;
  }

  protected override updated(changed: PropertyValues<this>) {
    if (changed.has('filter')) {
      this.applyFilter();
    }
    super.updated(changed);
  }

  protected override handleSlotChange() {
    super.handleSlotChange();
    this.applyFilter();
    this.syncSelected();
  }

  protected override handleFieldClick(path: EventTarget[]) {
    const onArrow = path.some(
      (el) =>
        el instanceof HTMLElement && el.classList.contains(SELECT_CLASSES.arrow),
    );
    if (onArrow) {
      this.open = !this.open;
    } else if (this.visibleOptions.length) {
      this.open = true;
    }
  }

  protected override pickOption(option: SelectOptionElement) {
    const text = option.displayText;
    this.query = '';
    this.applyFilter();
    if (text !== this.value) {
      this.valueField.markDirty();
      this.value = text;
      this.dispatchUserChange();
    }
    this.syncSelected();
  }

  private handleInput(event: InputEvent) {
    this.valueField.markDirty();
    this.value = (event.target as HTMLInputElement).value;
    this.query = this.value;
    this.applyFilter();
    this.syncSelected();
    // A new query clears the active option (no automatic selection).
    this.setActive(null);
    this.open = this.visibleOptions.length > 0;
    // The native `input` event is composed; no need to redispatch it.
  }

  private handleChange(event: Event) {
    this.dispatchEvent(new Event(event.type, {bubbles: true}));
  }

  private handleKeydown(event: KeyboardEvent) {
    if (this.disabled) return;
    const {key} = event;
    if (!this.open) {
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault();
        if (!this.visibleOptions.length) return;
        if (!event.altKey) {
          this.moveActive(key === 'ArrowDown' ? 'first' : 'last');
        }
        this.open = true;
      } else if (key === 'Escape' && this.value) {
        // Escape on a closed combobox clears it (ARIA combobox pattern).
        event.preventDefault();
        this.valueField.markDirty();
        this.value = '';
        this.query = '';
        this.applyFilter();
        this.syncSelected();
        this.dispatchEvent(
          new InputEvent('input', {bubbles: true, composed: true}),
        );
      }
      return;
    }

    if (key === 'Enter') {
      if (this.activeOption) {
        // Picking an option does not submit the form.
        event.preventDefault();
        this.pickActive();
      } else {
        this.open = false;
      }
      return;
    }
    if (key === 'Tab') {
      this.open = false;
      return;
    }
    if (
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Home' ||
      key === 'End'
    ) {
      // Caret keys return to editing the text.
      this.setActive(null);
      return;
    }
    if (this.handleOpenNavigationKey(event)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * Hides the options that do not match the typed text. While the menu is
   * open, the options that stay ease into their new position and the ones
   * that reappear fade in (menus.md "Filtering": "Menu items ease into their
   * new position as the menu is filtered").
   */
  private applyFilter() {
    const listbox = this.listbox;
    const animate =
      !!listbox?.matches(':popover-open') &&
      !isReducedMotion(this);
    const before = new Map<HTMLElement, number>();
    if (animate) {
      for (const option of this.visibleOptions) {
        before.set(option, option.getBoundingClientRect().top);
      }
    }

    for (const option of this.options) {
      option.filtered = !matchesFilter(
        option.typeaheadText,
        this.query,
        this.filter,
      );
    }
    if (this.activeOption?.filtered) {
      this.setActive(null);
    }

    if (!animate) return;
    // The menu's fast spatial / effects springs (see `select.scss`).
    const style = getComputedStyle(listbox!);
    const spring = (name: string) => ({
      duration:
        parseFloat(
          style.getPropertyValue(`--md-sys-motion-spring-fast-${name}-duration`),
        ) || 0,
      easing:
        style.getPropertyValue(`--md-sys-motion-spring-fast-${name}`).trim() ||
        'ease',
    });
    for (const option of this.visibleOptions) {
      const top = before.get(option);
      if (top === undefined) {
        option.animate([{opacity: 0}, {opacity: 1}], spring('effects'));
        continue;
      }
      const dy = top - option.getBoundingClientRect().top;
      if (dy) {
        option.animate(
          [{translate: `0 ${dy}px`}, {translate: '0 0'}],
          spring('spatial'),
        );
      }
    }
  }

  /** Marks the option whose text is the value as selected. */
  private syncSelected() {
    let found = false;
    for (const option of this.options) {
      const match: boolean =
        !found && !!this.value && option.displayText === this.value;
      found ||= match;
      option.selected = match;
    }
  }

  override [getFormValue]() {
    return this.value;
  }

  override formResetCallback() {
    this.reset();
  }

  override formStateRestoreCallback(state: string) {
    this.value = state;
  }

  override [createValidator](): Validator<unknown> {
    return new TextFieldValidator(() => ({
      state: {
        type: 'text',
        value: this.value,
        required: this.required,
        minLength: -1,
        maxLength: -1,
        pattern: '',
        min: '',
        max: '',
        step: '',
      },
      renderedControl: this.input,
    }));
  }

  override [getValidityAnchor](): HTMLElement | null {
    return this.input;
  }
}
