/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, type PropertyValues } from 'lit';
import { AriaTablistElement } from '../../../aria/tabs/tablist.js';
import { AdaptiveController } from '../shared/adaptive.js';
import { type Density } from '../shared/density.js';
import { RovingFocusController } from '../shared/roving-focus.js';
import { ScrollBehaviorController } from '../shared/scroll-behavior.js';
import { SelectionController } from '../shared/selection.js';
import { type TabsVariant } from './tabs.js';
/**
 * A Material Design tabs component.
 *
 * This is a reference implementation of the `.tabs` utility class. The same
 * class can be applied to any element with `role="tablist"`.
 *
 * @slot - Used to display `<md-gb-tab>` children.
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-height
 * @cssprop --active-indicator-inset
 * @cssprop --active-indicator-min-length
 * @cssprop --active-indicator-shape
 * @cssprop --container-color
 * @cssprop --container-height
 * @cssprop --density-step - Tab height removed per density step.
 * @cssprop --container-shape
 * @cssprop --divider-color
 * @cssprop --divider-thickness
 */
export declare class TabsElement extends AriaTablistElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * The visual variant of the tabs.
     */
    variant: TabsVariant;
    /**
     * The density, from 0 (default) to -3. Each step down removes 4px from the
     * tabs' height (48px, or 64px with icon and label); values are clamped to
     * that range.
     *
     * tabs.md "Avoid applying density by default": dense tabs are below the
     * 48x48 CSS pixel target, so let people opt in (a denser layout or theme)
     * and keep the controls that change it at 48x48.
     */
    get density(): Density;
    set density(density: number);
    private densityValue;
    /**
     * Where fixed tabs sit when the window is wider than compact: `center`
     * (default) or `start`, the leading edge. tabs.md, Responsive layout: "The
     * group of tabs should use a fluid margin and align to the center or leading
     * edge of the body region." At compact windows the tabs fill the full width.
     */
    align: 'center' | 'start';
    /**
     * Scrollable tabs: each tab's width is defined by its label (tabs.md) rather
     * than every tab taking the width of the widest, and the bar scrolls when
     * they overflow. Fixed tabs (the default) are equal.
     */
    scrollable: boolean;
    /** Window size class of the viewport; fixed tabs fill only compact windows. */
    protected readonly windowSize: AdaptiveController<Record<string, never>>;
    /**
     * How the tabs react to scrolling: `hide` scrolls them off the screen when
     * the page scrolls down and returns them when it scrolls up (tabs.md). Tabs
     * attached to an app bar (its `tabs` slot) leave this unset: the app bar
     * moves them with itself as one unit.
     */
    scrollBehavior?: 'hide';
    /** The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. */
    scrollTarget: string;
    /** Hides and reveals the tabs on scroll. */
    protected readonly scrollController: ScrollBehaviorController;
    /**
     * The selection model (shared SelectionController): exactly one tab is
     * selected, by click or Space/Enter (the tab turns the key into a click),
     * with a `change` event for user changes. The controller selects during
     * the click, so the tab list's own click handling finds the tab already
     * selected and does nothing.
     */
    protected readonly selectionModel: SelectionController<HTMLElement>;
    /**
     * Arrow keys move focus between the tabs (tabs.md, Keyboard navigation:
     * "Use Arrow/Tab to navigate through items"). The tab list declares
     * `focusgroup` for browsers that ship it; Chromium does not, so the shared
     * RovingFocusController implements the arrows. Moving focus doesn't select:
     * Space and Enter activate the focused tab. Home and End go to the first
     * and last tab.
     */
    protected readonly rovingFocus: RovingFocusController;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private classes;
    private resizeObserver?;
    private labelObserver?;
    private layoutToken;
    /**
     * Lays the tabs out once the tabs have rendered. A tab's label is slotted
     * only after the tab's own update, so measuring in the same microtask as a
     * DOM change would read padding alone. A newer request supersedes this one.
     */
    private scheduleLayout;
    /**
     * Offsets the first tab when the tabs scroll.
     *
     * Tab widths are left to the stylesheet, given the widest tab (`--tabs-widest`). Only the scroll start is set here: the first
     * tab starts `SCROLL_START_OFFSET` in from the leading edge when the bar
     * overflows, so the next tab is visibly cut off (tabs.md, Anatomy).
     */
    private layoutTabs;
    private finishLayout;
    protected updated(changedProperties: PropertyValues<this>): void;
}
