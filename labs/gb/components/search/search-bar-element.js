/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { focusRingClasses } from '../focus/focus-ring.js';
import { ripple, rippleClasses } from '../ripple/ripple.js';
import { hasSlotted } from '../shared/has-slotted.js';
import { SEARCH_BAR_CLASSES, searchBarClasses } from './search.js';
import focusRingStyles from '../focus/focus-ring.css.js'; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css.js'; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import searchBarStyles from './search-bar.css.js'; // github-only
// import searchBarStyles from './search-bar.cssresult.js'; // google3-only
const SEARCH_ICON = html `<svg
  class="search-bar-icon"
  viewBox="0 0 24 24"
  aria-hidden="true">
  <path
    d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
</svg>`;
/**
 * A Material Design search bar: the entry point to focused search.
 *
 * Activating the bar (click, Enter, ArrowDown, or typing) opens its search
 * view, full-screen by default or `docked` below the bar. Slotted results
 * are shown in the view. The back button, Escape, or the scrim close it.
 *
 * The bar's input is a `role="combobox"` that controls the view, and the
 * view's input a combobox that controls its `role="listbox"` results.
 *
 * Style the view with `::part(view)`, e.g.
 * `md-gb-search-bar::part(view) { --container-color: ... }`.
 *
 * @fires {Event} open - Fired when the view begins opening. Cancelable.
 * @fires {Event} opened - Fired when the view has opened and animations finished.
 * @fires {CustomEvent<{reason: string}>} close - Fired when the view begins closing. Cancelable.
 * @fires {CustomEvent<{reason: string}>} closed - Fired when the view has closed.
 * @fires {InputEvent} input - Fired when the search text changes.
 * @fires {Event} change - Fired when the search text is committed.
 * @fires {CustomEvent<{value: string}>} search - Fired when a search is executed with Enter in the view.
 * @slot - Search suggestions or results, shown in the view. Use elements with `role="option"`; slotted elements without a role get it.
 * @slot leading - A navigation icon button. Defaults to a non-functional search icon.
 * @slot trailing - Up to two trailing icons or icon buttons.
 * @slot avatar - A trailing avatar image.
 * @slot view-trailing - Trailing icon buttons in the view's header.
 * @csspart bar - The search bar container.
 * @csspart input - The search bar input.
 * @csspart view - The `md-gb-search-view`.
 * @cssprop --avatar-shape - Avatar shape.
 * @cssprop --avatar-size - Avatar size.
 * @cssprop --contained-avatar-target-size - Avatar tap target size.
 * @cssprop --contained-icon-label-gap - Space between the icon targets and the input.
 * @cssprop --contained-leading-margin - Recommended margin to the start of the window.
 * @cssprop --contained-trailing-margin - Recommended margin to the end of the window.
 * @cssprop --contained-leading-space - Space before the leading icon target.
 * @cssprop --contained-motion-spring - Expand and collapse easing.
 * @cssprop --contained-motion-duration - Expand and collapse duration.
 * @cssprop --contained-no-actions-leading-space - Leading space without a leading icon.
 * @cssprop --contained-no-actions-trailing-space - Trailing space without trailing icons.
 * @cssprop --contained-trailing-actions-gap - Gap between trailing icon targets.
 * @cssprop --contained-trailing-actions-leading-space - Space before the trailing icon targets.
 * @cssprop --contained-trailing-actions-trailing-space - Space after the trailing icon targets.
 * @cssprop --contained-trailing-space - Trailing space.
 * @cssprop --container-color - Container color.
 * @cssprop --container-height - Container height.
 * @cssprop --container-shape - Container shape.
 * @cssprop --icon-size - Icon size.
 * @cssprop --icon-target-size - Icon tap target size.
 * @cssprop --input-text - Input typography.
 * @cssprop --input-text-axes - Input font variation settings.
 * @cssprop --input-text-color - Input text color.
 * @cssprop --input-text-tracking - Input letter spacing.
 * @cssprop --leading-icon-color - Leading icon color.
 * @cssprop --leading-icon-leading-icon-label-space - Divided style space between the leading icon and input.
 * @cssprop --leading-space - Divided style leading space.
 * @cssprop --max-width - Maximum width.
 * @cssprop --min-width - Minimum width.
 * @cssprop --supporting-text - Placeholder typography.
 * @cssprop --supporting-text-axes - Placeholder font variation settings.
 * @cssprop --supporting-text-color - Placeholder color.
 * @cssprop --supporting-text-tracking - Placeholder letter spacing.
 * @cssprop --trailing-icon-color - Trailing icon color.
 * @cssprop --trailing-icon-label-trailing-icon-space - Divided style space between the input and trailing icon.
 * @cssprop --trailing-space - Divided style trailing space.
 */
// spec-labels: search/specs/anatomy, search/guidelines/anatomy, search/guidelines/anatomy/icons-icon-buttons/trailing-icons, search/specs/variants, search/specs/states/search-bar, search/specs/measurements/search-bar
export class SearchBarElement extends LitElement {
    constructor() {
        super(...arguments);
        /** The search text. Shared with the view. */
        this.value = '';
        /** Hinted search text, e.g. "Search messages". */
        this.placeholder = '';
        /**
         * Accessible label of the inputs. Defaults to `placeholder`, per the spec.
         */
        this.label = '';
        /** Whether the search bar is disabled. */
        this.disabled = false;
        /**
         * Opens the view docked below the bar, for medium and larger windows.
         * Otherwise it opens full-screen.
         */
        this.docked = false;
        /** Uses the divided (baseline) view style. */
        this.divided = false;
        /** Whether to skip the open and close animations. */
        this.quick = false;
        /** Accessible label of the view's back button. */
        this.backLabel = 'Back';
        /** Accessible label of the view's clear button. */
        this.clearLabel = 'Clear search';
        /** Accessible label of the results listbox. */
        this.resultsLabel = 'Search results';
        /** Whether the app is searching: shows progress in the view. */
        this.searching = false;
        /** Accessible label of the searching progress indicator. */
        this.searchingLabel = 'Searching';
        /** Announced when suggestions or results become available. */
        this.suggestionsLabel = 'Suggestions available';
        this.isExpandedInternal = false;
        this.handleBarClick = (event) => {
            if (this.disabled || this.isExpandedInternal)
                return;
            // Slotted icon buttons and avatars keep their own actions.
            for (const target of event.composedPath()) {
                if (target === this)
                    break;
                if (target instanceof Element &&
                    target.parentElement === this &&
                    target.slot) {
                    return;
                }
            }
            this.show();
        };
        this.handleInputKeyDown = (event) => {
            if (this.disabled || event.isComposing)
                return;
            if (event.key === 'Enter' || event.key === 'ArrowDown') {
                event.preventDefault();
                this.show();
            }
        };
        this.handleInput = (event) => {
            this.value = event.target.value;
            if (!this.isExpandedInternal) {
                this.show();
            }
        };
        this.handleViewInput = () => {
            this.value = this.view?.value ?? '';
        };
        this.redispatch = (event) => {
            if (event.target !== this.view)
                return;
            const init = { bubbles: event.bubbles, cancelable: event.cancelable };
            const copy = event instanceof CustomEvent
                ? new CustomEvent(event.type, { ...init, detail: event.detail })
                : new Event(event.type, init);
            if (!this.dispatchEvent(copy)) {
                event.preventDefault();
                return;
            }
            if (event.type === 'open' || event.type === 'close') {
                const prev = this.isExpandedInternal;
                this.isExpandedInternal = event.type === 'open';
                this.requestUpdate('expanded', prev);
            }
            if (event.type === 'closed') {
                // Return focus to the bar when it was not restored elsewhere.
                const active = document.activeElement;
                if (!active || active === document.body) {
                    this.focus({ preventScroll: true });
                }
            }
        };
    }
    /** Whether the search view is open. */
    get expanded() {
        return this.isExpandedInternal;
    }
    set expanded(value) {
        if (value === this.isExpandedInternal)
            return;
        if (value) {
            this.show();
        }
        else {
            this.close();
        }
    }
    /** Focuses the search bar input. */
    focus(options) {
        this.input?.focus(options);
    }
    /** Opens the search view. */
    async show() {
        if (this.disabled)
            return;
        await this.updateComplete;
        await this.view?.show();
    }
    /**
     * Closes the search view.
     *
     * @param reason The reason for closing (see `SEARCH_CLOSE_REASONS`).
     */
    async close(reason) {
        await this.updateComplete;
        await this.view?.close(reason);
    }
    render() {
        const expanded = this.isExpandedInternal;
        const label = this.label || this.placeholder || nothing;
        const classes = {
            ...rippleClasses({ disabled: this.disabled }),
            ...focusRingClasses(),
            ...searchBarClasses({ expanded, disabled: this.disabled }),
        };
        return html `
      <div
        class="${classMap(classes)}"
        part="bar"
        ${ripple()}
        @click=${this.handleBarClick}>
        <span class="${SEARCH_BAR_CLASSES.leading}">
          <slot name="leading">${SEARCH_ICON}</slot>
        </span>
        <input
          id="input"
          class="${SEARCH_BAR_CLASSES.input} ripple-target focus-ring-target"
          part="input"
          type="text"
          role="combobox"
          autocomplete="off"
          enterkeyhint="search"
          spellcheck="false"
          aria-haspopup="dialog"
          aria-expanded=${expanded ? 'true' : 'false'}
          aria-controls="view"
          aria-label=${label}
          placeholder=${this.placeholder || nothing}
          ?disabled=${this.disabled}
          .value=${live(this.value)}
          @input=${this.handleInput}
          @keydown=${this.handleInputKeyDown}
          @change=${() => {
            this.dispatchEvent(new Event('change', { bubbles: true }));
        }} />
        <span class="${SEARCH_BAR_CLASSES.trailing}">
          <slot name="trailing" ${hasSlotted()}></slot>
          <slot name="avatar" ${hasSlotted()}></slot>
        </span>
      </div>
      <md-gb-search-view
        id="view"
        part="view"
        .bar=${this}
        .value=${this.value}
        placeholder=${this.placeholder}
        label=${this.label}
        back-label=${this.backLabel}
        clear-label=${this.clearLabel}
        results-label=${this.resultsLabel}
        suggestions-label=${this.suggestionsLabel}
        searching-label=${this.searchingLabel}
        ?searching=${this.searching}
        ?docked=${this.docked}
        ?divided=${this.divided}
        ?quick=${this.quick}
        @input=${this.handleViewInput}
        @open=${this.redispatch}
        @opened=${this.redispatch}
        @close=${this.redispatch}
        @closed=${this.redispatch}
        @change=${this.redispatch}
        @search=${this.redispatch}>
        <slot></slot>
        <slot name="view-trailing" slot="trailing"></slot>
      </md-gb-search-view>
    `;
    }
}
// Layer order is pinned by the `@layer` statement at the top of
// search-bar.scss.
/** @nocollapse */
SearchBarElement.styles = [
    focusRingStyles,
    rippleStyles,
    searchBarStyles,
    css `
      md-gb-search-view {
        display: contents;
      }
    `,
];
__decorate([
    property()
], SearchBarElement.prototype, "value", void 0);
__decorate([
    property()
], SearchBarElement.prototype, "placeholder", void 0);
__decorate([
    property()
], SearchBarElement.prototype, "label", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SearchBarElement.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SearchBarElement.prototype, "docked", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SearchBarElement.prototype, "divided", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SearchBarElement.prototype, "quick", void 0);
__decorate([
    property({ attribute: 'back-label' })
], SearchBarElement.prototype, "backLabel", void 0);
__decorate([
    property({ attribute: 'clear-label' })
], SearchBarElement.prototype, "clearLabel", void 0);
__decorate([
    property({ attribute: 'results-label' })
], SearchBarElement.prototype, "resultsLabel", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SearchBarElement.prototype, "searching", void 0);
__decorate([
    property({ attribute: 'searching-label' })
], SearchBarElement.prototype, "searchingLabel", void 0);
__decorate([
    property({ attribute: 'suggestions-label' })
], SearchBarElement.prototype, "suggestionsLabel", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SearchBarElement.prototype, "expanded", null);
__decorate([
    query('md-gb-search-view')
], SearchBarElement.prototype, "view", void 0);
__decorate([
    query('.search-bar-input')
], SearchBarElement.prototype, "input", void 0);
//# sourceMappingURL=search-bar-element.js.map