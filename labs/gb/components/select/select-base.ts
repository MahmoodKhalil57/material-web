/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  type CSSResultOrNative,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {keyed} from 'lit/directives/keyed.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {mixinConstraintValidation} from '../../../behaviors/constraint-validation.js';
import {mixinElementInternals} from '../../../behaviors/element-internals.js';
import {mixinFormAssociated} from '../../../behaviors/form-associated.js';
import {
  mixinOnReportValidity,
  onReportValidity,
} from '../../../behaviors/on-report-validity.js';
import {menu} from '../menu/menu.js';
import {
  AnchoredOverlayController,
  composedContains,
  type OverlayDismissReason,
} from '../shared/anchored-overlay.js';
import {
  FormDisabledController,
  ValueFieldController,
} from '../shared/form-field.js';
import {SELECT_CLASSES, selectClasses, type SelectVariant} from './select.js';
import {SelectOptionElement} from './select-option-element.js';

import textFieldStyles from '../textfield/text-field.css' with {type: 'css'}; // github-only
// import textFieldStyles from '../textfield/text-field.cssresult.js'; // google3-only
import menuStyles from '../menu/menu.css' with {type: 'css'}; // github-only
// import {styles as menuStyles} from '../menu/menu.cssresult.js'; // google3-only
import selectStyles from './select.css' with {type: 'css'}; // github-only
// import selectStyles from './select.cssresult.js'; // google3-only

/** How many options PageUp / PageDown move the active option. */
const PAGE_SIZE = 10;

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(
  mixinOnReportValidity(
    mixinConstraintValidation(
      mixinFormAssociated(mixinElementInternals(LitElement)),
    ),
  ),
);

/**
 * Shared base of `md-gb-select` and `md-gb-autocomplete`: an exposed dropdown
 * menu. It renders a text field (the `md-gb-text-field` structure and styles)
 * whose control has the ARIA `combobox` role, and a `listbox` popover (the
 * `md-gb-menu` styles) anchored to the field and as wide as it, holding the
 * slotted `md-gb-select-option`s.
 *
 * Focus stays on the field; the active option is exposed with
 * `aria-activedescendant` (Compose `ExposedDropdownMenuBox` keeps focus on
 * its anchor).
 */
export abstract class SelectBase extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    textFieldStyles,
    menuStyles,
    selectStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: top;
        min-inline-size: 210px;
      }
      :host([hidden]) {
        display: none;
      }
      .text-field {
        flex: 1;
        min-inline-size: 0;
      }
    `,
  ];

  /** The variant: `filled` (default) or `outlined`. */
  @property({reflect: true}) variant: SelectVariant = 'filled';

  /** The floating label; also the field's accessible name. */
  @property() label = '';

  /** Hides the asterisk added to the label of a required field. */
  @property({type: Boolean, attribute: 'no-asterisk'}) noAsterisk = false;

  /** Whether a value is required. Adds an asterisk to the label. */
  @property({type: Boolean, reflect: true}) required = false;

  /**
   * Whether the field is in a visually invalid state. Overrides the error
   * state set by `reportValidity()`.
   */
  @property({type: Boolean, reflect: true}) error = false;

  /**
   * The message that replaces the supporting text while `error` is true.
   * Overrides the message shown by `reportValidity()`.
   */
  @property({attribute: 'error-text'}) errorText = '';

  /** Additional information shown below the field. */
  @property({attribute: 'supporting-text'}) supportingText = '';

  /** Whether a leading icon is slotted. Set it for SSR. */
  @property({type: Boolean, attribute: 'has-leading-icon'})
  hasLeadingIcon = false;

  /** Whether the menu is open. */
  @property({type: Boolean, reflect: true}) open = false;

  // Writable mixin property for lit-html binding, needed for lit-analyzer.
  declare name: string;

  /** Disabled by the attribute or by a disabled fieldset. */
  override get disabled(): boolean {
    return super.disabled || !!this.formDisabled?.value;
  }
  override set disabled(disabled: boolean) {
    super.disabled = disabled;
  }

  override formDisabledCallback(disabled: boolean) {
    // Not the attribute: it would keep the field disabled after the fieldset
    // is enabled again.
    this.formDisabled.set(disabled);
  }

  private readonly formDisabled = new FormDisabledController(this);

  override setCustomValidity(error: string) {
    super.setCustomValidity(error);
    // Shows or clears the message of an error that was already reported.
    this.requestUpdate();
  }

  /** Bumped to re-announce an unchanged error message. */
  @state() private errorAnnouncement = 0;

  /** The dirty value and the error shown after validation. */
  protected readonly valueField = new ValueFieldController(this, {
    onRepeat: () => {
      // Re-render the alert so assistive technology announces it again.
      this.errorAnnouncement++;
    },
  });

  @query('.select-menu') protected readonly listbox!: HTMLElement | null;

  /** The option `aria-activedescendant` points at. */
  protected activeOption: SelectOptionElement | null = null;

  /** Whether this is the editable autocomplete field. */
  protected abstract readonly editable: boolean;

  /** The options: every slotted `md-gb-select-option`. */
  get options(): SelectOptionElement[] {
    return Array.from(this.querySelectorAll('md-gb-select-option')).filter(
      (option): option is SelectOptionElement =>
        option instanceof SelectOptionElement,
    );
  }

  /** The options the autocomplete filter has not hidden. */
  protected get visibleOptions() {
    return this.options.filter((option) => !option.filtered && !option.hidden);
  }

  /** Why the menu was last asked to close (a light dismiss), for `close()`. */
  private dismissReason: OverlayDismissReason | null = null;

  /**
   * The listbox popover under the field's width (Compose
   * `ExposedDropdownMenuBox`): below the field, above it when there is no
   * room; Escape, a press outside or focus leaving the field close it.
   * Focus stays on the field.
   */
  protected readonly overlay = new AnchoredOverlayController(this, {
    surface: () => this.listbox,
    anchor: () =>
      this.shadowRoot?.querySelector<HTMLElement>('.text-field-container') ??
      null,
    popover: 'manual',
    dismiss: {escape: true, outside: true, focusOut: true},
    contains: (node) => composedContains(this, node),
    returnTarget: () => this.getField(),
    placement: () => ({placement: 'below', align: 'start', spacing: 0}),
    onDismiss: (reason) => {
      this.dismissReason = reason;
      this.open = false;
    },
    onPosition: () => {
      // Without CSS anchor positioning: as wide as the field.
      const width = this.overlay.anchorRect()?.width;
      if (width && this.listbox) this.listbox.style.inlineSize = `${width}px`;
    },
  });

  /** Opens the menu. */
  showPicker() {
    if (this.disabled) return;
    this.open = true;
  }

  override focus(options?: FocusOptions) {
    this.getField()?.focus(options);
  }

  override blur() {
    this.getField()?.blur();
  }

  /** The element with the `combobox` role. */
  protected abstract getField(): HTMLElement | null;

  /** Renders the `combobox` control inside the text field. */
  protected abstract renderControl(
    describedBy: string,
    showError: boolean,
  ): TemplateResult;

  /** Whether the field has content (floats the label). */
  protected abstract isPopulated(): boolean;

  /** Selects an option as the user's choice. */
  protected abstract pickOption(option: SelectOptionElement): void;

  /** The option to activate when the menu opens. */
  protected initialActiveOption(): SelectOptionElement | null {
    return null;
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    if (this.disabled && this.open) {
      this.open = false;
    }
    super.willUpdate(changed);
  }

  protected override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (changed.has('open')) {
      this.syncPopover(changed.get('open') !== undefined);
    }
  }

  private syncPopover(notify: boolean) {
    if (!this.listbox) return;
    const shown = this.overlay.isOpen;
    if (this.open === shown) return;
    if (notify) {
      this.dispatchEvent(new Event(this.open ? 'opening' : 'closing'));
    }
    if (this.open) {
      if (!this.overlay.open()) {
        // Not connected to a document; stays closed.
        this.open = false;
        return;
      }
      if (!this.activeOption) {
        this.setActive(this.initialActiveOption());
      } else {
        this.activeOption.scrollIntoView({block: 'nearest'});
      }
    } else {
      this.overlay.close(this.dismissReason ?? 'method');
      this.dismissReason = null;
      this.setActive(null);
    }
  }

  protected override render() {
    const showError = !this.disabled && this.valueField.hasError;
    const errorText = this.valueField.message;
    const supporting = showError && errorText ? errorText : this.supportingText;
    const labelText = this.getLabelText();
    const classes = selectClasses({
      variant: this.variant,
      populated: this.isPopulated(),
      error: showError,
      hasLabel: !!labelText,
      hasLeadingIcon: this.hasLeadingIcon,
      open: this.open,
      autocomplete: this.editable,
      disabled: this.disabled,
    });

    return html`
      <div class=${classMap(classes)}>
        <div
          class="text-field-container"
          part="container"
          @click=${this.handleContainerClick}>
          <span class="text-field-leading-icon">
            <slot
              name="leading-icon"
              @slotchange=${this.handleLeadingIconChange}></slot>
          </span>
          ${labelText
            ? html`<span id="label" class="text-field-label" part="label"
                >${labelText}</span
              >`
            : nothing}
          <div class="text-field-content">
            <div class="text-field-input-row">
              ${this.renderControl(supporting ? 'supporting-text' : '', showError)}
            </div>
          </div>
          <span
            class="text-field-trailing-icon ${SELECT_CLASSES.arrow}"
            part="arrow"
            aria-hidden="true">
            <slot name="trailing-icon">
              <svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5z" /></svg>
            </slot>
          </span>
          <div class="text-field-outline" aria-hidden="true">
            <div class="text-field-outline-start"></div>
            <div class="text-field-outline-notch">
              <span class="text-field-outline-label">${labelText}</span>
            </div>
            <div class="text-field-outline-end"></div>
          </div>
        </div>
        ${supporting
          ? html`<div class="text-field-supporting">
              ${keyed(
                this.errorAnnouncement,
                html`<span
                  id="supporting-text"
                  class="text-field-supporting-text"
                  part="supporting-text"
                  role=${showError && errorText ? 'alert' : nothing}
                  >${supporting}</span
                >`,
              )}
            </div>`
          : nothing}
        <div
          id="listbox"
          class=${menu({classes: {[SELECT_CLASSES.menu]: true}})}
          part="menu"
          role="listbox"
          aria-labelledby=${labelText ? 'label' : nothing}
          @mousedown=${this.handleListboxMousedown}
          @click=${this.handleListboxClick}
          @toggle=${this.handleToggle}>
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
  }

  protected getLabelText() {
    if (!this.label) return '';
    // The asterisk is part of the accessible name, as in the text field.
    return this.required && !this.noAsterisk ? `${this.label}*` : this.label;
  }

  /** ARIA attributes shared by both comboboxes. */
  protected get expandedState() {
    return this.open ? 'true' : 'false';
  }

  /**
   * Points `aria-activedescendant` at an option (or nothing) and scrolls it
   * into view.
   */
  protected setActive(option: SelectOptionElement | null) {
    if (this.activeOption && this.activeOption !== option) {
      this.activeOption.active = false;
    }
    this.activeOption = option;
    const field = this.getField();
    if (field) {
      field.ariaActiveDescendantElement = option;
    }
    if (option) {
      option.active = true;
      if (this.open) {
        option.scrollIntoView({block: 'nearest'});
      }
    }
  }

  /**
   * Moves the active option among the visible options. Disabled options can
   * be active (menus spec: "Disabled menu items can receive focus but aren't
   * selectable"). The active option does not wrap.
   */
  protected moveActive(to: 'first' | 'last' | number) {
    const options = this.visibleOptions;
    if (!options.length) return;
    let index: number;
    if (to === 'first') {
      index = 0;
    } else if (to === 'last') {
      index = options.length - 1;
    } else {
      const current = this.activeOption
        ? options.indexOf(this.activeOption)
        : -1;
      index =
        current === -1
          ? to > 0
            ? 0
            : options.length - 1
          : Math.min(options.length - 1, Math.max(0, current + to));
    }
    this.setActive(options[index]);
  }

  /**
   * Handles the keys shared by both comboboxes while the menu is open.
   *
   * @return Whether the key was handled.
   */
  protected handleOpenNavigationKey(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        this.moveActive(1);
        return true;
      case 'ArrowUp':
        if (event.altKey) {
          this.pickActive();
          return true;
        }
        this.moveActive(-1);
        return true;
      case 'PageDown':
        this.moveActive(PAGE_SIZE);
        return true;
      case 'PageUp':
        this.moveActive(-PAGE_SIZE);
        return true;
      default:
        return false;
    }
  }

  /** Picks the active option (if it is enabled) and closes the menu. */
  protected pickActive() {
    const option = this.activeOption;
    if (option && !option.disabled) {
      this.pickOption(option);
      this.open = false;
    } else if (!option) {
      this.open = false;
    }
  }

  protected handleSlotChange() {
    if (this.activeOption && !this.activeOption.isConnected) {
      this.setActive(null);
    }
  }

  private handleContainerClick(event: MouseEvent) {
    if (this.disabled) return;
    const path = event.composedPath();
    // Slotted leading icons may be interactive.
    const inLeadingIcon = path.some(
      (el) =>
        el instanceof HTMLElement &&
        el.classList.contains('text-field-leading-icon'),
    );
    if (inLeadingIcon) return;
    this.getField()?.focus();
    this.handleFieldClick(path);
  }

  /** Handles a click on the field (outside the leading icon). */
  protected abstract handleFieldClick(path: EventTarget[]): void;

  private handleListboxMousedown(event: MouseEvent) {
    // Keep focus on the field.
    event.preventDefault();
  }

  private handleListboxClick(event: MouseEvent) {
    const option = event
      .composedPath()
      .find(
        (el): el is SelectOptionElement => el instanceof SelectOptionElement,
      );
    if (!option || option.disabled) return;
    this.setActive(option);
    this.pickOption(option);
    this.open = false;
    this.getField()?.focus();
  }

  private handleToggle(event: ToggleEvent) {
    this.dispatchEvent(
      new Event(event.newState === 'open' ? 'opened' : 'closed'),
    );
  }

  private handleLeadingIconChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasLeadingIcon = slot.assignedElements({flatten: true}).length > 0;
  }

  /** Dispatches the `input` and `change` events of a user change. */
  protected dispatchUserChange() {
    this.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }

  override [onReportValidity](invalidEvent: Event | null) {
    this.valueField.report(invalidEvent);
  }
}
