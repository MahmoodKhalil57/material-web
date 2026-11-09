/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, LitElement, nothing, } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { keyed } from 'lit/directives/keyed.js';
import { mixinDelegatesAria } from '../../../../internal/aria/delegate.js';
import { mixinConstraintValidation } from '../../../behaviors/constraint-validation.js';
import { mixinElementInternals } from '../../../behaviors/element-internals.js';
import { mixinFormAssociated } from '../../../behaviors/form-associated.js';
import { mixinOnReportValidity, onReportValidity, } from '../../../behaviors/on-report-validity.js';
import { menu } from '../menu/menu.js';
import { AnchoredOverlayController, composedContains, } from '../shared/anchored-overlay.js';
import { FormDisabledController, ValueFieldController, } from '../shared/form-field.js';
import { SELECT_CLASSES, selectClasses } from './select.js';
import { SelectOptionElement } from './select-option-element.js';
import textFieldStyles from '../textfield/text-field.css.js'; // github-only
// import textFieldStyles from '../textfield/text-field.cssresult.js'; // google3-only
import menuStyles from '../menu/menu.css.js'; // github-only
// import {styles as menuStyles} from '../menu/menu.cssresult.js'; // google3-only
import selectStyles from './select.css.js'; // github-only
// import selectStyles from './select.cssresult.js'; // google3-only
/** How many options PageUp / PageDown move the active option. */
const PAGE_SIZE = 10;
// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(mixinOnReportValidity(mixinConstraintValidation(mixinFormAssociated(mixinElementInternals(LitElement)))));
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
export class SelectBase extends baseClass {
    constructor() {
        super(...arguments);
        /** The variant: `filled` (default) or `outlined`. */
        this.variant = 'filled';
        /** The floating label; also the field's accessible name. */
        this.label = '';
        /** Hides the asterisk added to the label of a required field. */
        this.noAsterisk = false;
        /** Whether a value is required. Adds an asterisk to the label. */
        this.required = false;
        /**
         * Whether the field is in a visually invalid state. Overrides the error
         * state set by `reportValidity()`.
         */
        this.error = false;
        /**
         * The message that replaces the supporting text while `error` is true.
         * Overrides the message shown by `reportValidity()`.
         */
        this.errorText = '';
        /** Additional information shown below the field. */
        this.supportingText = '';
        /** Whether a leading icon is slotted. Set it for SSR. */
        this.hasLeadingIcon = false;
        /** Whether the menu is open. */
        this.open = false;
        this.formDisabled = new FormDisabledController(this);
        /** Bumped to re-announce an unchanged error message. */
        this.errorAnnouncement = 0;
        /** The dirty value and the error shown after validation. */
        this.valueField = new ValueFieldController(this, {
            onRepeat: () => {
                // Re-render the alert so assistive technology announces it again.
                this.errorAnnouncement++;
            },
        });
        /** The option `aria-activedescendant` points at. */
        this.activeOption = null;
        /** Why the menu was last asked to close (a light dismiss), for `close()`. */
        this.dismissReason = null;
        /**
         * The listbox popover under the field's width (Compose
         * `ExposedDropdownMenuBox`): below the field, above it when there is no
         * room; Escape, a press outside or focus leaving the field close it.
         * Focus stays on the field.
         */
        this.overlay = new AnchoredOverlayController(this, {
            surface: () => this.listbox,
            anchor: () => this.shadowRoot?.querySelector('.text-field-container') ??
                null,
            popover: 'manual',
            dismiss: { escape: true, outside: true, focusOut: true },
            contains: (node) => composedContains(this, node),
            returnTarget: () => this.getField(),
            placement: () => ({ placement: 'below', align: 'start', spacing: 0 }),
            onDismiss: (reason) => {
                this.dismissReason = reason;
                this.open = false;
            },
            onPosition: () => {
                // Without CSS anchor positioning: as wide as the field.
                const width = this.overlay.anchorRect()?.width;
                if (width && this.listbox)
                    this.listbox.style.inlineSize = `${width}px`;
            },
        });
    }
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled() {
        return super.disabled || !!this.formDisabled?.value;
    }
    set disabled(disabled) {
        super.disabled = disabled;
    }
    formDisabledCallback(disabled) {
        // Not the attribute: it would keep the field disabled after the fieldset
        // is enabled again.
        this.formDisabled.set(disabled);
    }
    setCustomValidity(error) {
        super.setCustomValidity(error);
        // Shows or clears the message of an error that was already reported.
        this.requestUpdate();
    }
    /** The options: every slotted `md-gb-select-option`. */
    get options() {
        return Array.from(this.querySelectorAll('md-gb-select-option')).filter((option) => option instanceof SelectOptionElement);
    }
    /** The options the autocomplete filter has not hidden. */
    get visibleOptions() {
        return this.options.filter((option) => !option.filtered && !option.hidden);
    }
    /** Opens the menu. */
    showPicker() {
        if (this.disabled)
            return;
        this.open = true;
    }
    focus(options) {
        this.getField()?.focus(options);
    }
    blur() {
        this.getField()?.blur();
    }
    /** The option to activate when the menu opens. */
    initialActiveOption() {
        return null;
    }
    willUpdate(changed) {
        if (this.disabled && this.open) {
            this.open = false;
        }
        super.willUpdate(changed);
    }
    updated(changed) {
        super.updated(changed);
        if (changed.has('open')) {
            this.syncPopover(changed.get('open') !== undefined);
        }
    }
    syncPopover(notify) {
        if (!this.listbox)
            return;
        const shown = this.overlay.isOpen;
        if (this.open === shown)
            return;
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
            }
            else {
                this.activeOption.scrollIntoView({ block: 'nearest' });
            }
        }
        else {
            this.overlay.close(this.dismissReason ?? 'method');
            this.dismissReason = null;
            this.setActive(null);
        }
    }
    render() {
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
        return html `
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
            ? html `<span id="label" class="text-field-label" part="label"
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
            ? html `<div class="text-field-supporting">
              ${keyed(this.errorAnnouncement, html `<span
                  id="supporting-text"
                  class="text-field-supporting-text"
                  part="supporting-text"
                  role=${showError && errorText ? 'alert' : nothing}
                  >${supporting}</span
                >`)}
            </div>`
            : nothing}
        <div
          id="listbox"
          class=${menu({ classes: { [SELECT_CLASSES.menu]: true } })}
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
    getLabelText() {
        if (!this.label)
            return '';
        // The asterisk is part of the accessible name, as in the text field.
        return this.required && !this.noAsterisk ? `${this.label}*` : this.label;
    }
    /** ARIA attributes shared by both comboboxes. */
    get expandedState() {
        return this.open ? 'true' : 'false';
    }
    /**
     * Points `aria-activedescendant` at an option (or nothing) and scrolls it
     * into view.
     */
    setActive(option) {
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
                option.scrollIntoView({ block: 'nearest' });
            }
        }
    }
    /**
     * Moves the active option among the visible options. Disabled options can
     * be active (menus spec: "Disabled menu items can receive focus but aren't
     * selectable"). The active option does not wrap.
     */
    moveActive(to) {
        const options = this.visibleOptions;
        if (!options.length)
            return;
        let index;
        if (to === 'first') {
            index = 0;
        }
        else if (to === 'last') {
            index = options.length - 1;
        }
        else {
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
    handleOpenNavigationKey(event) {
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
    pickActive() {
        const option = this.activeOption;
        if (option && !option.disabled) {
            this.pickOption(option);
            this.open = false;
        }
        else if (!option) {
            this.open = false;
        }
    }
    handleSlotChange() {
        if (this.activeOption && !this.activeOption.isConnected) {
            this.setActive(null);
        }
    }
    handleContainerClick(event) {
        if (this.disabled)
            return;
        const path = event.composedPath();
        // Slotted leading icons may be interactive.
        const inLeadingIcon = path.some((el) => el instanceof HTMLElement &&
            el.classList.contains('text-field-leading-icon'));
        if (inLeadingIcon)
            return;
        this.getField()?.focus();
        this.handleFieldClick(path);
    }
    handleListboxMousedown(event) {
        // Keep focus on the field.
        event.preventDefault();
    }
    handleListboxClick(event) {
        const option = event
            .composedPath()
            .find((el) => el instanceof SelectOptionElement);
        if (!option || option.disabled)
            return;
        this.setActive(option);
        this.pickOption(option);
        this.open = false;
        this.getField()?.focus();
    }
    handleToggle(event) {
        this.dispatchEvent(new Event(event.newState === 'open' ? 'opened' : 'closed'));
    }
    handleLeadingIconChange(event) {
        const slot = event.target;
        this.hasLeadingIcon = slot.assignedElements({ flatten: true }).length > 0;
    }
    /** Dispatches the `input` and `change` events of a user change. */
    dispatchUserChange() {
        this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
        this.dispatchEvent(new Event('change', { bubbles: true }));
    }
    [onReportValidity](invalidEvent) {
        this.valueField.report(invalidEvent);
    }
}
/** @nocollapse */
SelectBase.shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
};
/** @nocollapse */
SelectBase.styles = [
    textFieldStyles,
    menuStyles,
    selectStyles,
    css `
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
__decorate([
    property({ reflect: true })
], SelectBase.prototype, "variant", void 0);
__decorate([
    property()
], SelectBase.prototype, "label", void 0);
__decorate([
    property({ type: Boolean, attribute: 'no-asterisk' })
], SelectBase.prototype, "noAsterisk", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SelectBase.prototype, "required", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SelectBase.prototype, "error", void 0);
__decorate([
    property({ attribute: 'error-text' })
], SelectBase.prototype, "errorText", void 0);
__decorate([
    property({ attribute: 'supporting-text' })
], SelectBase.prototype, "supportingText", void 0);
__decorate([
    property({ type: Boolean, attribute: 'has-leading-icon' })
], SelectBase.prototype, "hasLeadingIcon", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SelectBase.prototype, "open", void 0);
__decorate([
    state()
], SelectBase.prototype, "errorAnnouncement", void 0);
__decorate([
    query('.select-menu')
], SelectBase.prototype, "listbox", void 0);
//# sourceMappingURL=select-base.js.map