/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property} from 'lit/decorators.js';
import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../internal/aria/delegate.js';
import {safeHref} from '../../internal/directives/safe-href.js';
import {redispatchEvent} from '../../internal/events/redispatch-event.js';
import {mixinElementInternals} from '../../internal/behaviors/element-internals.js';
import {mixinFormAssociated} from '../../internal/behaviors/form-associated.js';
import {mixinFormSubmitter} from '../../internal/behaviors/form-submitter.js';

import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.cssresult.js';
import rippleStyles from '../../foundations/interaction/states/ripple/ripple.cssresult.js';
import iconButtonStyles from './icon-button.cssresult.js';

import {clampDensity, type Density} from '../../foundations/layout/density.js';
import {InvokerController} from '../../foundations/interaction/inputs/invoker.js';
import type {
  IconButtonColor,
  IconButtonSize,
  IconButtonWidth,
} from './icon-button.js';
import '../tooltip/md-gb-tooltip.js';
import {iconButton} from './icon-button.js';

// spec-labels: icon-buttons/specs/color, icon-buttons/specs/variants, icon-buttons/specs/configurations, icon-buttons/specs/anatomy, icon-buttons/guidelines/anatomy
// spec-labels: icon-buttons/guidelines/usage/color, icon-buttons/guidelines/usage/size-width, icon-buttons/specs/measurements, icon-buttons/specs/measurements/target-sizes
// spec-labels: icon-buttons/specs/shape-morph/when-selected, icon-buttons/specs/shape-morph/pressed-state
const baseClass = mixinDelegatesAria(
  mixinFormSubmitter(mixinFormAssociated(mixinElementInternals(LitElement))),
);

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
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    iconButtonStyles,
    css`
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

  /**
   * The color of the button.
   */
  @property() color: IconButtonColor = 'standard';

  /**
   * The size of the button.
   */
  @property() size: IconButtonSize = 'sm';

  /**
   * Changes the shape of the button to be square.
   */
  @property({type: Boolean}) square = false;

  /**
   * Changes the width of the button.
   */
  @property() width: IconButtonWidth = '';

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
  @property({type: Number, reflect: true})
  get density(): Density {
    return this.densityValue;
  }
  set density(density: number) {
    const old = this.densityValue;
    this.densityValue = clampDensity(Number(density));
    this.requestUpdate('density', old);
  }
  private densityValue: Density = 0;

  /**
   * A string indicating the behavior of the button.
   *
   * - "submit" (default): A button that submits its associated form.
   * - "reset": A button that resets its associated form.
   * - "button": A normal button.
   * - "toggle": A toggle button using the `selected` property.
   * - "link": An anchor link (`<a>`). Type is always "link" when `href` is set.
   */
  @property({noAccessor: true, reflect: true})
  override get type(): string {
    return this.href ? 'link' : super.type;
  }
  override set type(type: string) {
    if (this.href && type !== 'link') {
      return;
    }
    super.type = type;
  }

  /**
   * Whether or not the button is "soft-disabled" (disabled but still
   * focusable).
   */
  @property({type: Boolean, attribute: 'soft-disabled', reflect: true})
  softDisabled = false;

  /**
   * Whether or not the button is selected, when `type="toggle"`.
   *
   * TODO: replace reflected `[selected]` with `:state(selected)`
   */
  @property({type: Boolean, reflect: true}) selected = false;

  /**
   * Set when the icon has no filled version: a selected toggle button then
   * shows the icon in semibold weight instead of filled.
   */
  @property({type: Boolean, reflect: true, attribute: 'unfilled-icon'})
  unfilledIcon = false;

  /**
   * Shows a tooltip with the button's accessibility label (`aria-label`) on
   * hover and keyboard focus. The label should describe the action, not name
   * the icon.
   */
  @property({type: Boolean, reflect: true}) tooltip = false;

  /**
   * The URL that the link button points to.
   */
  @property() href = '';

  /**
   * The filename to use when downloading the linked resource.
   */
  @property() download = '';

  /**
   * Where to display the linked `href` URL for a link button.
   */
  @property() target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

  /**
   * Sets the underlying `HTMLAnchorElement`'s `rel` attribute when `href` is
   * set.
   */
  @property() rel = '';

  /**
   * Sets the underlying `HTMLAnchorElement`'s `referrerpolicy` attribute when
   * `href` is set.
   */
  @property() referrerPolicy = '';

  // Resolves `popovertarget` / `commandfor` on the host for the inner button.
  constructor() {
    super();
    new InvokerController(this, () => this.renderRoot?.querySelector('button'));
  }

  protected override render() {
    const classes = iconButton({
      color: this.color,
      size: this.size,
      width: this.width,
      square: this.square,
      density: this.density,
      selected: this.type === 'toggle' ? this.selected : undefined,
      disabled: this.disabled || this.softDisabled,
    });

    const {ariaLabel, ariaHasPopup, ariaExpanded} = this as ARIAMixinStrict;
    if (this.type === 'link') {
      return html`<a
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

    return html`<button
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

  private renderTooltip(label: string | null) {
    return this.tooltip && label
      ? html`<md-gb-tooltip for="icon-btn">${label}</md-gb-tooltip>`
      : nothing;
  }

  private handleChange(event: Event) {
    this.selected = (event.target as HTMLElement).ariaPressed === 'true';
    redispatchEvent(this, event);
  }
}
