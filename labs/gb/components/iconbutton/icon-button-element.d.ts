/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
import { type Density } from '../shared/density.js';
import type { IconButtonColor, IconButtonSize, IconButtonWidth } from './icon-button.js';
import '../tooltip/md-gb-tooltip.js';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<(abstract new (...args: any[]) => import("../../../behaviors/element-internals.js").WithElementInternals) & typeof LitElement & import("../../../behaviors/form-associated.js").FormAssociatedConstructor, import("../../../behaviors/form-associated.js").FormAssociated>, import("../../../behaviors/form-submitter.js").FormSubmitter>>;
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
export declare class IconButtonElement extends baseClass {
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * The color of the button.
     */
    color: IconButtonColor;
    /**
     * The size of the button.
     */
    size: IconButtonSize;
    /**
     * Changes the shape of the button to be square.
     */
    square: boolean;
    /**
     * Changes the width of the button.
     */
    width: IconButtonWidth;
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
    get density(): Density;
    set density(density: number);
    private densityValue;
    /**
     * A string indicating the behavior of the button.
     *
     * - "submit" (default): A button that submits its associated form.
     * - "reset": A button that resets its associated form.
     * - "button": A normal button.
     * - "toggle": A toggle button using the `selected` property.
     * - "link": An anchor link (`<a>`). Type is always "link" when `href` is set.
     */
    get type(): string;
    set type(type: string);
    /**
     * Whether or not the button is "soft-disabled" (disabled but still
     * focusable).
     */
    softDisabled: boolean;
    /**
     * Whether or not the button is selected, when `type="toggle"`.
     *
     * TODO: replace reflected `[selected]` with `:state(selected)`
     */
    selected: boolean;
    /**
     * Set when the icon has no filled version: a selected toggle button then
     * shows the icon in semibold weight instead of filled.
     */
    unfilledIcon: boolean;
    /**
     * Shows a tooltip with the button's accessibility label (`aria-label`) on
     * hover and keyboard focus. The label should describe the action, not name
     * the icon.
     */
    tooltip: boolean;
    /**
     * The URL that the link button points to.
     */
    href: string;
    /**
     * The filename to use when downloading the linked resource.
     */
    download: string;
    /**
     * Where to display the linked `href` URL for a link button.
     */
    target: '_blank' | '_parent' | '_self' | '_top' | '';
    /**
     * Sets the underlying `HTMLAnchorElement`'s `rel` attribute when `href` is
     * set.
     */
    rel: string;
    /**
     * Sets the underlying `HTMLAnchorElement`'s `referrerpolicy` attribute when
     * `href` is set.
     */
    referrerPolicy: string;
    constructor();
    protected render(): import("lit-html").TemplateResult<1>;
    private renderTooltip;
    private handleChange;
}
export {};
