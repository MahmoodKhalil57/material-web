/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement, type PropertyValues } from 'lit';
import { type WindowHeightClass, type WindowSizeClass } from '../../styles/layout/window-size-class.js';
import { type ActiveNavigation, type ScaffoldNavigation, type SideSheetNavigation } from './app-scaffold.js';
/** Detail of the `navigation-change` event. */
export interface NavigationChangeDetail {
    navigation: ActiveNavigation;
}
/**
 * A Material Design app scaffold: the bars and rails around an app's
 * content (spec: foundations/layout/scaffold). It measures its own width as
 * the window, reflects the window size class as `window-class` (and the
 * window height size class as `window-height-class`), and swaps the
 * navigation component per the spec's breakpoints: a navigation bar at
 * compact, a navigation rail at medium and larger (a bar at medium when a
 * nested `md-gb-pane-scaffold` shows two panes, unless the window height
 * is compact).
 *
 * Provide both a `md-gb-nav-bar` and a `md-gb-nav-rail` with the same
 * destinations, and keep their selection in sync; only one is shown.
 *
 * @slot - The content, typically an `md-gb-pane-scaffold`. Scrolls.
 * @slot top-app-bar - A top app bar (`md-gb-app-bar`), beside the rail.
 * @slot navigation-bar - A navigation bar (`md-gb-nav-bar`) at the bottom.
 * @slot navigation-rail - A navigation rail (`md-gb-nav-rail`) at the
 *     leading edge.
 * @slot companion-rail - A companion rail on the trailing side of large
 *     and extra-large windows, holding supporting controls or actions that
 *     modify or relate to the content in a pane.
 * @slot toolbar - A toolbar floating in the bottom rail region, centered
 *     above the navigation bar (mobile).
 * @slot fab - A FAB, 16px from the trailing and bottom edges of the content.
 * @slot snackbar - A snackbar host (`md-gb-snackbar`), above the FAB.
 * @csspart scaffold - The scaffold grid.
 * @csspart rail - The navigation rail region.
 * @csspart companion-rail - The companion rail region.
 * @csspart toolbar - The floating toolbar region.
 * @csspart top-app-bar - The top app bar region.
 * @csspart body - The content region (content, FAB and snackbar).
 * @csspart content - The scrolling content container.
 * @cssprop --scrollbar-gutter - `stable` reserves the content's scrollbar
 *     gutter, so a scrollbar that appears doesn't move the content (default
 *     `auto`: the pane widths are measured to the edges).
 * @csspart navigation-bar - The navigation bar region.
 * @cssprop --container-color - Scaffold background.
 * @cssprop --content-color - Scaffold content color.
 * @fires {CustomEvent<WindowClassChangeDetail>} window-class-change - Fired
 *     when the window size class changes. --bubbles --composed
 * @fires {CustomEvent<WindowHeightClassChangeDetail>} window-height-class-change
 *     - Fired when the window height size class changes. --bubbles --composed
 * @fires {CustomEvent<NavigationChangeDetail>} navigation-change - Fired when
 *     the shown navigation component changes. --bubbles --composed
 */
export declare class AppScaffoldElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** Which navigation component to show. */
    navigation: ScaffoldNavigation;
    /**
     * Whether to expand a slotted navigation rail at large and extra-large
     * windows and collapse it below (spec: breakpoints, swapping components).
     * Applied when the window size class changes.
     */
    autoExpandRail: boolean;
    /**
     * What the navigation rail does while a side sheet is present (spec:
     * breakpoints and scaffold): `keep` it as is, `collapse` it to the
     * collapsed rail, or `hide` it completely. A side sheet is present while
     * the nested pane scaffold shows its tertiary pane or `side-sheet-open`
     * is set.
     */
    sideSheetNavigation: SideSheetNavigation;
    /** Whether an app-managed side sheet is open. */
    sideSheetOpen: boolean;
    /** The current window size class (read-only, reflected). */
    get windowClass(): WindowSizeClass;
    /** The current window height size class (read-only, reflected). */
    get windowHeightClass(): WindowHeightClass;
    /** The navigation component currently shown (read-only, reflected). */
    get activeNavigation(): ActiveNavigation;
    private hasBar;
    private hasRail;
    private hasFab;
    private hasToolbar;
    private contentPaneCount;
    private paneSideSheet;
    private readonly railRegion;
    private readonly companionRegion;
    private readonly bodyRegion;
    private readonly railSlot;
    private active;
    private lastActive;
    private railObserver;
    /** Rails collapsed for a side sheet, with their previous state. */
    private readonly collapsedForSheet;
    private readonly size;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(): void;
    private observeRail;
    /**
     * Tells a nested pane scaffold how much space the rails take on each side
     * (it keeps a split-pane spacer centered in the window).
     */
    private measureRegions;
    private readonly handlePaneLayoutChange;
    private get sideSheetPresent();
    /** Collapses the slotted rails for a side sheet, and restores them. */
    private syncRailForSideSheet;
    private syncRailExpanded;
    private handleSlotChange;
    protected willUpdate(changed: PropertyValues<this>): void;
    protected updated(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
