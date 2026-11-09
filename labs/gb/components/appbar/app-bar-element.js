/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { AdaptiveController, } from '../shared/adaptive.js';
import { ScrollBehaviorController } from '../shared/scroll-behavior.js';
import { appBar } from './app-bar.js';
import { styles as appBarStyles } from './app-bar.cssresult.js';
/**
 * Trailing actions per window size class: two on small windows, up to four on
 * larger ones. Larger classes inherit from the next smaller one.
 */
export const TRAILING_ACTIONS = {
    compact: { trailingActions: 2 },
    expanded: { trailingActions: 4 },
};
export class AppBarElement extends LitElement {
    constructor() {
        super(...arguments);
        /** The size of the app bar (`sm`, `md`, `lg`). Defaults to `sm`. */
        this.size = 'sm';
        /** The behavioral variant of the app bar (`standard` or `search`). Defaults to `standard`. */
        this.variant = 'standard';
        /**
         * Whether the app bar is in its scrolled state. Defaults to `false`. A
         * medium or large flexible app bar in its scrolled state is shown as a small
         * one (app-bars.md: "When scrolled, medium flexible and large flexible app
         * bars can transform into small app bars").
         */
        this.scrolled = false;
        /** The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. */
        this.scrollTarget = '';
        /** Hides, reveals or compresses the app bar with the scroll target. */
        this.scrollController = new ScrollBehaviorController(this, {
            behavior: () => this.scrollBehavior,
            target: () => this.scrollTarget,
            hiddenTransform: 'translateY(-100%)',
            onScrolledChange: (scrolled) => {
                if (this.scrollBehavior === 'compress' ||
                    (this.scrollBehavior === 'hide' && this.size === 'sm')) {
                    this.scrolled = scrolled;
                    this.dispatchEvent(new CustomEvent('scrollstatechange', {
                        bubbles: true,
                        composed: true,
                        detail: { scrolled },
                    }));
                }
            },
        });
        /**
         * Whether the title and subtitle are centered instead of leading-aligned
         * (the M3 Expressive "centered text" configuration). Defaults to `false`.
         */
        this.centered = false;
        /** The window size class of the app bar's width and its per-class limits. */
        this.adaptive = new AdaptiveController(this, { base: { trailingActions: 2 }, options: TRAILING_ACTIONS });
        this.overflowed = [];
        this.hiddenByOverflow = new WeakSet();
        this.hasSubtitle = false;
        this.hasLeading = false;
    }
    /** The trailing actions hidden at the current window size class. */
    get overflowedActions() {
        return this.overflowed;
    }
    render() {
        const withSubtitle = this.variant !== 'search' && this.hasSubtitle;
        // A scrolled flexible app bar is a small one.
        const size = this.scrolled ? 'sm' : this.size;
        const directive = appBar({
            size,
            withSubtitle,
            variant: this.variant,
            scrolled: this.scrolled,
            centered: this.centered,
            hasLeading: this.hasLeading,
        });
        const leading = html `<div class="app-bar-leading">
      <slot name="leading" @slotchange=${this.handleLeadingSlotChange}></slot>
    </div>`;
        const trailing = html `<div class="app-bar-trailing">
      <slot
        name="trailing"
        @slotchange=${this.handleTrailingSlotChange}></slot>
      <slot name="overflow" ?hidden=${this.overflowed.length === 0}></slot>
    </div>`;
        if (this.variant === 'search') {
            return html `<div part="app-bar" class="${directive}">
        ${leading}
        <div class="app-bar-search-container">
          <div class="app-bar-search-bar">
            <slot name="search"></slot>
          </div>
        </div>
        ${trailing}
      </div>
      <slot name="tabs"></slot>`;
        }
        const title = html `<div class="app-bar-title-wrapper">
      <div class="app-bar-image"><slot name="image"></slot></div>
      <div class="app-bar-title">
        <slot></slot>
      </div>
      <div class="app-bar-subtitle">
        <slot
          name="subtitle"
          @slotchange=${this.handleSubtitleSlotChange}></slot>
      </div>
    </div>`;
        const tabs = html `<slot name="tabs"></slot>`;
        if (size === 'md' || size === 'lg') {
            return html `<div part="app-bar" class="${directive}">
        <div class="app-bar-top-row">${leading}${trailing}</div>
        <div class="app-bar-bottom-row">${title}</div>
      </div>${tabs}`;
        }
        return html `<div part="app-bar" class="${directive}">
      ${leading}${title}${trailing}
    </div>${tabs}`;
    }
    updated() {
        this.updateOverflow();
    }
    /**
     * Hides the trailing actions beyond the limit of the current window size
     * class and shows those that fit again.
     */
    updateOverflow() {
        const slot = this.shadowRoot?.querySelector('slot[name="trailing"]');
        const actions = slot?.assignedElements({ flatten: true }) ?? [];
        const limit = this.adaptive.options.trailingActions;
        const overflowed = [];
        actions.forEach((action, index) => {
            if (index >= limit) {
                overflowed.push(action);
                this.hiddenByOverflow.add(action);
                action.toggleAttribute('hidden', true);
            }
            else if (this.hiddenByOverflow.has(action)) {
                this.hiddenByOverflow.delete(action);
                action.toggleAttribute('hidden', false);
            }
        });
        const same = overflowed.length === this.overflowed.length &&
            overflowed.every((action, i) => action === this.overflowed[i]);
        if (same)
            return;
        this.overflowed = overflowed;
        this.toggleAttribute('overflowing', overflowed.length > 0);
        this.dispatchEvent(new CustomEvent('overflowchange', {
            detail: { overflowed },
            bubbles: true,
            composed: true,
        }));
    }
    handleTrailingSlotChange() {
        this.updateOverflow();
    }
    handleSubtitleSlotChange(event) {
        this.hasSubtitle = hasContent(event.target);
    }
    handleLeadingSlotChange(event) {
        this.hasLeading = hasContent(event.target);
    }
}
/** @nocollapse */
AppBarElement.styles = [
    appBarStyles,
    css `
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
      }
      /* Lets the inner bar read its stuck state (scrolled color) in CSS. */
      @supports (container-type: scroll-state) {
        :host {
          container-type: scroll-state;
        }
      }
    `,
];
__decorate([
    property({ reflect: true })
], AppBarElement.prototype, "size", void 0);
__decorate([
    property({ reflect: true })
], AppBarElement.prototype, "variant", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], AppBarElement.prototype, "scrolled", void 0);
__decorate([
    property({ attribute: 'scroll-behavior', reflect: true })
], AppBarElement.prototype, "scrollBehavior", void 0);
__decorate([
    property({ attribute: 'scroll-target' })
], AppBarElement.prototype, "scrollTarget", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], AppBarElement.prototype, "centered", void 0);
__decorate([
    state()
], AppBarElement.prototype, "overflowed", void 0);
__decorate([
    state()
], AppBarElement.prototype, "hasSubtitle", void 0);
__decorate([
    state()
], AppBarElement.prototype, "hasLeading", void 0);
function hasContent(slot) {
    return slot
        .assignedNodes({ flatten: true })
        .some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim());
}
//# sourceMappingURL=app-bar-element.js.map