/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, type PropertyValues } from 'lit';
import { AriaTablistElement } from '../../../aria/tabs/tablist.js';
import { ScrollBehaviorController } from '../shared/scroll-behavior.js';
import { SelectionController } from '../shared/selection.js';
import { type NavBarItemLayout, type NavBarLayout } from './nav-bar.js';
/**
 * A Material Design gBreeze navigation bar component.
 *
 * Scroll behavior (navigation-bar.md): `scroll-behavior="hide"` hides the bar
 * when the page scrolls down and reveals it when scrolling up;
 * `scroll-target` is the id of the scrolling element (default: the window).
 * Make the bar fixed or sticky at the bottom of the page.
 *
 * @slot - Used to display navigation bar items (`md-gb-nav-bar-item`).
 * @csspart nav-bar - The navigation bar's root container.
 * @fires {Event} change - Fired when the selected navigation bar item changes. --bubbles
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height
 * @cssprop --container-shadow-color
 * @cssprop --container-shape
 * @cssprop --item-active-icon-color
 * @cssprop --item-active-indicator-color
 * @cssprop --item-active-indicator-height
 * @cssprop --item-active-indicator-icon-label-space
 * @cssprop --item-active-indicator-leading-space
 * @cssprop --item-active-indicator-shape
 * @cssprop --item-active-indicator-trailing-space
 * @cssprop --item-active-indicator-width
 * @cssprop --item-active-label-text-color
 * @cssprop --item-active-state-layer-color
 * @cssprop --item-between-space
 * @cssprop --item-container-between-space
 * @cssprop --item-icon-size
 * @cssprop --item-inactive-icon-color
 * @cssprop --item-inactive-label-text-color
 * @cssprop --item-inactive-state-layer-color
 * @cssprop --item-label-text
 * @cssprop --item-label-text-axes
 * @cssprop --item-label-text-tracking
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 */
export declare class NavBarElement extends AriaTablistElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * The layout orientation of items: `vertical`, `horizontal`, or `auto`
     * (vertical in compact windows, horizontal from medium windows, 600px).
     */
    itemLayout: NavBarLayout;
    /** How the bar reacts to scrolling: `hide` hides it on scroll down. */
    scrollBehavior?: 'hide';
    /** The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. */
    scrollTarget: string;
    /**
     * Hides and reveals the bar on scroll.
     *
     * Accessibility: "Don't hide the navigation bar on scroll when a screen
     * reader is active" (navigation-bar-791f1a). A web page cannot detect a
     * screen reader, so the bar errs on the side of staying: it never hides
     * while focus is inside it, and never when the page scrolls because of a
     * key press (`keyboardKeepsVisible`: screen reader and switch users move
     * with the keyboard), so only wheel, touch, pointer and programmatic
     * scrolling hide it. Focus moving into a hidden bar reveals it. An app can
     * also keep it visible for good by not setting `scroll-behavior`.
     */
    protected readonly scrollController: ScrollBehaviorController;
    /**
     * The selection model (shared SelectionController): exactly one tab is
     * selected, by click or Space/Enter (the tab turns the key into a click),
     * with a `change` event for user changes. The controller selects during
     * the click, so the tab list's own click handling finds the tab already
     * selected and does nothing.
     */
    protected readonly selectionModel: SelectionController<HTMLElement>;
    private mediumWindow;
    private itemCount;
    private mediaQuery?;
    private readonly onMediaChange;
    /** The item layout in use (`auto` resolved for the window width). */
    get resolvedItemLayout(): NavBarItemLayout;
    /**
     * The 0-based index of the currently active navigation bar item.
     * Alias for `selectedTabIndex`.
     */
    get selectedIndex(): number;
    set selectedIndex(index: number);
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected updated(changedProperties: PropertyValues<this>): void;
    protected render(): import("lit-html").TemplateResult<1>;
    /**
     * Destinations that are links make the bar a navigation landmark of links;
     * a tab list can only hold tabs. Without links it stays a tab list.
     */
    private readonly syncRole;
    protected handleSlotChange(): void;
    private syncItemsLayout;
}
