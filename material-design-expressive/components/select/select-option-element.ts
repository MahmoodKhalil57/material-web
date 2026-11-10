/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, type CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property, state} from 'lit/decorators.js';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';
import {hasSlotted} from '../shared/has-slotted.js';
import {selectOption} from './select.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import menuStyles from '../menu/menu.css' with {type: 'css'}; // github-only
// import {styles as menuStyles} from '../menu/menu.cssresult.js'; // google3-only

/**
 * Fired (bubbling, not composed) when an option's `selected` property
 * changes, so its select can keep a single selection.
 */
export const SELECTED_CHANGE_EVENT = 'md-gb-select-option-selected-change';

// Separate variable needed for closure.
const baseClass = mixinElementInternals(LitElement);

/**
 * An option of a `md-gb-select` or `md-gb-autocomplete`, styled as a
 * `md-gb-menu-item`.
 *
 * It has the ARIA `option` role. It never takes focus: its select keeps focus
 * on the field and points `aria-activedescendant` at the active option.
 *
 * @slot - The option's label.
 * @slot leading - An icon before the label. Without one, a selected option shows a checkmark.
 * @slot supporting-text - Supporting text below the label.
 * @slot trailing-text - Metadata after the label, such as a keyboard shortcut.
 * @slot trailing - An icon after the label.
 * @csspart menu-item - The option's root element.
 */
export class SelectOptionElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    menuStyles,
    css`
      :host {
        display: flex;
        outline: none;
      }
      :host([hidden]),
      :host(:state(filtered)) {
        display: none;
      }
      .menu-item {
        flex: 1;
        min-inline-size: 0;
      }
      .menu-item-content {
        min-inline-size: 0;
        overflow-wrap: anywhere;
      }
      :is(.menu-item-leading, .menu-item-trailing):not(
          :has(.has-slotted, .checkmark)
        ) {
        display: none;
      }
      slot:not(.has-slotted) {
        display: contents;
      }
      .checkmark {
        display: flex;
        inline-size: var(--leading-icon-size);
        block-size: var(--leading-icon-size);
        fill: currentColor;
      }
    `,
  ];

  /** Whether the option cannot be selected. It can still become active. */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Whether the option is selected. The `selected` attribute is the default
   * selection restored on form reset.
   */
  @property({type: Boolean})
  get selected() {
    return this.isSelected;
  }
  set selected(selected: boolean) {
    const old = this.isSelected;
    selected = !!selected;
    if (old === selected) return;
    this.isSelected = selected;
    this.requestUpdate('selected', old);
    this.dispatchEvent(new Event(SELECTED_CHANGE_EVENT, {bubbles: true}));
  }

  /** The form value. Defaults to `displayText`, like a native `<option>`. */
  @property()
  get value() {
    return this.explicitValue ?? this.displayText;
  }
  set value(value: string) {
    const old = this.value;
    this.explicitValue = value ?? null;
    this.requestUpdate('value', old);
  }

  /**
   * The text shown in the field when the option is selected. Defaults to the
   * option's label text.
   */
  @property({attribute: 'display-text'})
  get displayText() {
    return this.explicitDisplayText ?? this.getLabelText();
  }
  set displayText(text: string) {
    const old = this.displayText;
    this.explicitDisplayText = text ?? null;
    this.requestUpdate('displayText', old);
  }

  /** The text matched by typeahead and filtering. Defaults to `displayText`. */
  @property({attribute: 'typeahead-text'})
  get typeaheadText() {
    return this.explicitTypeaheadText ?? this.displayText;
  }
  set typeaheadText(text: string) {
    const old = this.typeaheadText;
    this.explicitTypeaheadText = text ?? null;
    this.requestUpdate('typeaheadText', old);
  }

  /**
   * Whether the option is the select's active option (its
   * `aria-activedescendant`). Set by the select.
   */
  @state() active = false;

  /** Whether an autocomplete filter hides the option. Set by the select. */
  get filtered() {
    return this[internals].states.has('filtered');
  }
  set filtered(filtered: boolean) {
    if (filtered) {
      this[internals].states.add('filtered');
    } else {
      this[internals].states.delete('filtered');
    }
  }

  private isSelected = false;
  private explicitValue: string | null = null;
  private explicitDisplayText: string | null = null;
  private explicitTypeaheadText: string | null = null;

  constructor() {
    super();
    this[internals].role = 'option';
  }

  protected override render() {
    return html`<div
      part="menu-item"
      class="${selectOption({
        selected: this.selected,
        disabled: this.disabled,
        active: this.active,
      })} ripple-host focus-ring-host">
      <span class="menu-item-leading">
        <slot name="leading" ${hasSlotted()}>
          ${this.selected
            ? html`<svg
                class="checkmark"
                viewBox="0 0 24 24"
                aria-hidden="true">
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>`
            : nothing}
        </slot>
      </span>
      <span class="menu-item-content">
        <slot></slot>
        <slot name="supporting-text" class="menu-item-supporting-text"></slot>
      </span>
      <span class="menu-item-trailing">
        <slot
          name="trailing-text"
          class="menu-item-trailing-text"
          ${hasSlotted()}></slot>
        <slot name="trailing" ${hasSlotted()}></slot>
      </span>
    </div>`;
  }

  protected override updated() {
    this[internals].ariaSelected = String(this.selected);
    this[internals].ariaDisabled = String(this.disabled);
  }

  /** The text of the default slot (the label), without the other slots. */
  private getLabelText() {
    let text = '';
    for (const node of this.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      } else if (
        node instanceof Element &&
        !node.hasAttribute('slot') &&
        !(node instanceof HTMLTemplateElement)
      ) {
        text += node.textContent;
      }
    }
    return text.replace(/\s+/g, ' ').trim();
  }
}
