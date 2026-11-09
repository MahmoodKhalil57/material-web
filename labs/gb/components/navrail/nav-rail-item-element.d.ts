/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, type PropertyValues } from 'lit';
import { AriaTabElement } from '../../../aria/tabs/tab.js';
import { type NavRailItemLayout } from './nav-rail.js';
/**
 * A Material Design navigation rail item component.
 *
 * @slot - Used to display the item's label text.
 * @slot icon - Used to display the item's icon (`md-gb-icon`).
 * @slot badge - Used to display a custom badge on the item's icon.
 * @csspart nav-rail-item - The navigation rail item's presentational container.
 * @csspart indicator - The active indicator / icon container element.
 * @csspart label - The label text container element.
 * @cssstate selected - Whether the navigation rail item is selected.
 */
export declare class NavRailItemElement extends AriaTabElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    private readonly navLink;
    constructor();
    get selected(): boolean;
    set selected(value: boolean);
    /** Activates the destination: follows its link, else clicks the tab. */
    click(): void;
    /**
     * Whether the navigation rail item is active. Alias for `selected`.
     *
     * TODO: replace reflected `[active]` with `:state(selected)`
     */
    get active(): boolean;
    set active(value: boolean);
    /** Whether the navigation rail item is disabled. */
    disabled: boolean;
    /** The layout orientation of the item ('vertical' or 'horizontal'). */
    itemLayout: NavRailItemLayout;
    /**
     * The URL the destination links to. The item is then a link (role `link`,
     * `aria-current="page"` while selected) instead of a tab.
     */
    href: string;
    /** Where to open the linked `href`, e.g. `_blank`. */
    target: '_blank' | '_parent' | '_self' | '_top' | '';
    /** The link's `rel` attribute, when `href` is set. */
    rel: string;
    /** Optional label text if not provided via default slot. */
    label: string;
    /**
     * Whether the icon has no filled style. The active destination then uses
     * the semibold icon weight instead of the filled icon.
     */
    unfilledIcon: boolean;
    /**
     * Whether the destination is secondary: it shows only while the rail is
     * expanded.
     */
    secondary: boolean;
    /** Optional badge text (or 'dot' / 'true' for a small dot badge). */
    badge: string;
    connectedCallback(): void;
    protected updated(changedProperties: PropertyValues<this>): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
