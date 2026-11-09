/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement } from 'lit';
/**
 * A Material Design carousel item, used in `md-gb-carousel`.
 *
 * The item fills with its visual (an `<img>`, `<video>` or other element in
 * the default slot) and is masked to its current size as it moves through
 * the carousel. Optional label text overlays the visual and fades as the
 * item shrinks.
 *
 * Items are focusable and activatable list items: the whole item is a
 * button, or a link with `href`. Name it with `label` (otherwise its label
 * text names it).
 *
 * @slot - The item visual, such as an `<img>` or `<video>`. It is sized to cover the item.
 * @slot label - Brief label text shown over the visual.
 * @csspart item - The item root.
 * @csspart content - The masked visual and label.
 * @csspart label - The label container.
 * @csspart frame - The masked outline, elevation and focus ring.
 * @csspart action - The button or link that activates the item.
 * @cssprop --carousel-item-fraction - Read-only: the item's current size between the carousel's smallest (0) and large (1) item sizes.
 * @cssprop --carousel-item-size - Read-only: the item's current masked size along the scrolling axis.
 * @cssprop --with-outline-outline-color - Outline color of outlined items.
 * @cssprop --with-outline-outline-width - Outline width of outlined items.
 */
export declare class CarouselItemElement extends LitElement {
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** The accessible name of the item. Defaults to its label text. */
    label: string;
    /** Makes the item a link to this URL. */
    href: string;
    /** The link target, with `href`. */
    target: string;
    /** Whether the item is disabled. */
    disabled: boolean;
    /** Whether the item has an outline (`with-outline` tokens). */
    outlined: boolean;
    protected readonly internals: ElementInternals;
    constructor();
    protected render(): import("lit-html").TemplateResult<1>;
    private renderAction;
}
