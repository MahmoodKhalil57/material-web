/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { nothing, type ReactiveController, type ReactiveControllerHost } from 'lit';
import { internals } from '../../../behaviors/element-internals.js';
/**
 * Fired (bubbling, not composed) by a navigation bar or rail item when it
 * becomes or stops being a link, so its bar can pick the role that fits its
 * destinations.
 */
export declare const NAV_LINK_CHANGE = "nav-link-change";
/** A navigation bar or rail item that can be a link. */
export interface NavLinkHost extends ReactiveControllerHost, HTMLElement {
    href: string;
    target: string;
    rel: string;
    disabled: boolean;
    readonly renderRoot: HTMLElement | DocumentFragment;
    [internals]: ElementInternals;
}
/**
 * Makes a navigation bar or rail item (a tab) a link destination when `href`
 * is set, like the navigation drawer's item (navigation-bar.md,
 * navigation-rail.md: destinations navigate).
 *
 * The item stays the single focus stop, with the role `link` and
 * `aria-current="page"` while selected (`aria-selected` is not allowed on a
 * link). A transparent anchor over the item carries the navigation, so mouse
 * modifiers, the context menu and "open in a new tab" work natively; Enter on
 * the item activates it. Space doesn't activate a link. Without `href` the
 * item keeps the `tab` role and `aria-selected`.
 */
export declare class NavLinkController implements ReactiveController {
    private readonly host;
    /** The item's selected state, which `aria-selected` can't hold on a link. */
    selected: boolean;
    private isLink;
    constructor(host: NavLinkHost);
    hostUpdated(): void;
    /** Applies the tab or link semantics for the current `href` and selection. */
    sync(): void;
    /** Clicks the anchor, which navigates; false when the item isn't a link. */
    activate(): boolean;
    /** The anchor to render over the item while it is a link. */
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
    private get anchor();
    private readonly handleClick;
}
/** Styles for the anchor that covers a link item. */
export declare const navLinkStyles: import("lit").CSSResult;
/** Whether any of the bar's destinations is a link. */
export declare function hasLinkItems(items: readonly HTMLElement[]): boolean;
