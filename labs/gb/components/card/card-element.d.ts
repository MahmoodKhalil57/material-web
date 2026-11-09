/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
import { type CardColor } from './card.js';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement>;
/**
 * A Material Design card.
 *
 * @slot - Used to display the card's content. The card has 16dp left/right padding; set `--padding-inline: 0` for full-bleed content. Add padding to content, not the host <md-gb-card> element.
 * @slot container - Used to set a custom background container for the card.
 * @csspart card - The card's root element.
 * @csspart card-btn - The card's main action (a button, or a link when `href` is set), when interactive.
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-shape
 * @cssprop --disabled-content-opacity
 * @cssprop --outline-color
 * @cssprop --outline-width
 * @cssprop --state-layer-color
 */
export declare class CardElement extends baseClass {
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** The color of the card. */
    color: CardColor;
    /** Whether the card is disabled. */
    disabled: boolean;
    /** Whether the card is interactive. */
    interactive: boolean;
    /**
     * Whether the card is picked up and being dragged (raised elevation). The
     * app moves the card. Spec Cards > Accessibility > Dragging and dismissing
     * (WCAG 2.5.7): also offer a single-pointer alternative, e.g. a menu opened
     * by tapping a "more" button or pressing and holding the card, with move
     * and delete actions (see the "Reorder (drag or menu)" demo). Don't let
     * the menu cover the card.
     */
    dragged: boolean;
    /**
     * Whether an interactive card can be selected: activating it toggles
     * `selected` (selection.md lists cards among the components that can be
     * selected).
     */
    selectable: boolean;
    /**
     * Whether a `selectable` card is selected. A selected card shows a check
     * mark and a change in surface color.
     */
    selected: boolean;
    /**
     * Makes an interactive card a link (spec: directly actionable cards have the
     * button or link role).
     */
    href: string;
    /** The link target, when `href` is set. */
    target: '_blank' | '_parent' | '_self' | '_top' | '';
    protected render(): import("lit-html").TemplateResult<1>;
    private renderAction;
    private readonly handleToggle;
}
export {};
