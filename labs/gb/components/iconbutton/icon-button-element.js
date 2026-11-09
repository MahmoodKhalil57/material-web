/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { mixinDelegatesAria } from '../../../../internal/aria/delegate.js';
import { safeHref } from '../../../../internal/directives/safe-href.js';
import { redispatchEvent } from '../../../../internal/events/redispatch-event.js';
import { mixinElementInternals } from '../../../behaviors/element-internals.js';
import { mixinFormAssociated } from '../../../behaviors/form-associated.js';
import { mixinFormSubmitter } from '../../../behaviors/form-submitter.js';
import focusRingStyles from '../focus/focus-ring.cssresult.js';
import rippleStyles from '../ripple/ripple.cssresult.js';
import iconButtonStyles from './icon-button.cssresult.js';
import { clampDensity } from '../shared/density.js';
import { InvokerController } from '../shared/invoker.js';
import '../tooltip/md-gb-tooltip.js';
import { iconButton } from './icon-button.js';
// spec-labels: icon-buttons/specs/color, icon-buttons/specs/variants, icon-buttons/specs/configurations, icon-buttons/specs/anatomy, icon-buttons/guidelines/anatomy
// spec-labels: icon-buttons/guidelines/usage/color, icon-buttons/guidelines/usage/size-width, icon-buttons/specs/measurements, icon-buttons/specs/measurements/target-sizes
// spec-labels: icon-buttons/specs/shape-morph/when-selected, icon-buttons/specs/shape-morph/pressed-state
const baseClass = mixinDelegatesAria(mixinFormSubmitter(mixinFormAssociated(mixinElementInternals(LitElement))));
/**
 * A Material Design icon button component.
 *
 * Like a native button, it can invoke a popover or another element: set
 * `popovertarget` (+ `popovertargetaction`) or `commandfor` (+ `command`) on
 * the host to the id of an element in the same tree.
 *
 * @slot - Used to display an icon.
 * @fires {InputEvent} input - Fired when a toggle icon button is selected or unselected. --bubbles --composed
 * @fires {Event} change - Fired when a toggle button is selected or unselected. --bubbles
 * @csspart icon-btn - The icon button's root element.
 * @cssprop --container-color
 * @cssprop --container-height - Container height at density 0.
 * @cssprop --container-shape - The resolved shape; defaults to the round or square shape.
 * @cssprop --container-shape-round
 * @cssprop --container-shape-square
 * @cssprop --icon-color
 * @cssprop --icon-size
 * @cssprop --leading-space
 * @cssprop --md-icon-fill
 * @cssprop --outline-color
 * @cssprop --outline-width
 * @cssprop --trailing-space
 * @cssprop --density-step - Container height removed per density step.
 * @cssprop --target-size - The minimum touch target size, kept at any density.
 */
export class IconButtonElement extends baseClass {
    /**
     * The density, from 0 (default) to -3. Each step down removes 4px from the
     * container height (and the width of a default-width button); the icon
     * keeps its size and the touch target stays at least 48px. Values are
     * clamped to that range. Density 0 inherits the density of an enclosing
     * `md-gb-button-group`.
     *
     * icon-buttons.md: don't apply density by default; let people opt in to a
     * denser layout.
     */
    get density() {
        return this.densityValue;
    }
    set density(density) {
        const old = this.densityValue;
        this.densityValue = clampDensity(Number(density));
        this.requestUpdate('density', old);
    }
    /**
     * A string indicating the behavior of the button.
     *
     * - "submit" (default): A button that submits its associated form.
     * - "reset": A button that resets its associated form.
     * - "button": A normal button.
     * - "toggle": A toggle button using the `selected` property.
     * - "link": An anchor link (`<a>`). Type is always "link" when `href` is set.
     */
    get type() {
        return this.href ? 'link' : super.type;
    }
    set type(type) {
        if (this.href && type !== 'link') {
            return;
        }
        super.type = type;
    }
    // Resolves `popovertarget` / `commandfor` on the host for the inner button.
    constructor() {
        super();
        /**
         * The color of the button.
         */
        this.color = 'standard';
        /**
         * The size of the button.
         */
        this.size = 'sm';
        /**
         * Changes the shape of the button to be square.
         */
        this.square = false;
        /**
         * Changes the width of the button.
         */
        this.width = '';
        this.densityValue = 0;
        /**
         * Whether or not the button is "soft-disabled" (disabled but still
         * focusable).
         */
        this.softDisabled = false;
        /**
         * Whether or not the button is selected, when `type="toggle"`.
         *
         * TODO: replace reflected `[selected]` with `:state(selected)`
         */
        this.selected = false;
        /**
         * Set when the icon has no filled version: a selected toggle button then
         * shows the icon in semibold weight instead of filled.
         */
        this.unfilledIcon = false;
        /**
         * Shows a tooltip with the button's accessibility label (`aria-label`) on
         * hover and keyboard focus. The label should describe the action, not name
         * the icon.
         */
        this.tooltip = false;
        /**
         * The URL that the link button points to.
         */
        this.href = '';
        /**
         * The filename to use when downloading the linked resource.
         */
        this.download = '';
        /**
         * Where to display the linked `href` URL for a link button.
         */
        this.target = '';
        /**
         * Sets the underlying `HTMLAnchorElement`'s `rel` attribute when `href` is
         * set.
         */
        this.rel = '';
        /**
         * Sets the underlying `HTMLAnchorElement`'s `referrerpolicy` attribute when
         * `href` is set.
         */
        this.referrerPolicy = '';
        new InvokerController(this, () => this.renderRoot?.querySelector('button'));
    }
    render() {
        const classes = iconButton({
            color: this.color,
            size: this.size,
            width: this.width,
            square: this.square,
            density: this.density,
            selected: this.type === 'toggle' ? this.selected : undefined,
            disabled: this.disabled || this.softDisabled,
        });
        const { ariaLabel, ariaHasPopup, ariaExpanded } = this;
        if (this.type === 'link') {
            return html `<a
        id="icon-btn"
        part="icon-btn"
        class=${classes}
        href=${safeHref(this.href)}
        download=${this.download || nothing}
        target=${this.target || nothing}
        rel=${this.rel || nothing}
        referrerpolicy=${this.referrerPolicy || nothing}
        aria-label=${ariaLabel || nothing}
        aria-haspopup=${ariaHasPopup || nothing}
        aria-expanded=${ariaExpanded || nothing}
        aria-disabled=${this.disabled || this.softDisabled || nothing}
        tabindex=${this.disabled && !this.softDisabled ? -1 : nothing}>
        <slot></slot>
      </a>${this.renderTooltip(ariaLabel)}`;
        }
        return html `<button
      id="icon-btn"
      part="icon-btn"
      class=${classes}
      type="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled || nothing}
      aria-label=${ariaLabel || nothing}
      aria-pressed=${this.type === 'toggle' ? this.selected : nothing}
      aria-haspopup=${ariaHasPopup || nothing}
      aria-expanded=${ariaExpanded || nothing}
      @change=${this.handleChange}>
      <slot></slot>
    </button>${this.renderTooltip(ariaLabel)}`;
    }
    renderTooltip(label) {
        return this.tooltip && label
            ? html `<md-gb-tooltip for="icon-btn">${label}</md-gb-tooltip>`
            : nothing;
    }
    handleChange(event) {
        this.selected = event.target.ariaPressed === 'true';
        redispatchEvent(this, event);
    }
}
/** @nocollapse */
IconButtonElement.shadowRootOptions = {
    mode: 'open',
    delegatesFocus: true,
};
/** @nocollapse */
IconButtonElement.styles = [
    focusRingStyles,
    rippleStyles,
    iconButtonStyles,
    css `
      :host {
        --md-icon-fill: 1;
        display: inline-flex;
      }

      :host([type='toggle']:not([selected])) {
        --md-icon-fill: 0;
      }

      :host([type='toggle'][selected]) {
        --md-icon-fill: 1;
      }

      /*
       * A selected toggle whose icon has no filled version gets a semibold
       * icon instead of a filled one.
       */
      :host([type='toggle'][selected][unfilled-icon]) .icon-btn {
        --md-icon-fill: 0;
        --md-icon-wght: 600;
      }

      .icon-btn {
        flex: 1;
      }
    `,
];
__decorate([
    property()
], IconButtonElement.prototype, "color", void 0);
__decorate([
    property()
], IconButtonElement.prototype, "size", void 0);
__decorate([
    property({ type: Boolean })
], IconButtonElement.prototype, "square", void 0);
__decorate([
    property()
], IconButtonElement.prototype, "width", void 0);
__decorate([
    property({ type: Number, reflect: true })
], IconButtonElement.prototype, "density", null);
__decorate([
    property({ noAccessor: true, reflect: true })
], IconButtonElement.prototype, "type", null);
__decorate([
    property({ type: Boolean, attribute: 'soft-disabled', reflect: true })
], IconButtonElement.prototype, "softDisabled", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], IconButtonElement.prototype, "selected", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'unfilled-icon' })
], IconButtonElement.prototype, "unfilledIcon", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], IconButtonElement.prototype, "tooltip", void 0);
__decorate([
    property()
], IconButtonElement.prototype, "href", void 0);
__decorate([
    property()
], IconButtonElement.prototype, "download", void 0);
__decorate([
    property()
], IconButtonElement.prototype, "target", void 0);
__decorate([
    property()
], IconButtonElement.prototype, "rel", void 0);
__decorate([
    property()
], IconButtonElement.prototype, "referrerPolicy", void 0);
//# sourceMappingURL=icon-button-element.js.map