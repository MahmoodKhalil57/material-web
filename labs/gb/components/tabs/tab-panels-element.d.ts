/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement, type PropertyValues } from 'lit';
import { AriaTablistElement } from '../../../aria/tabs/tablist.js';
/**
 * The content of a set of tabs: one `role="tabpanel"` child per tab, in tab
 * order. Shows the selected tab's panel and slides between panels when the
 * selection changes; people can also swipe the content area left or right
 * to move to the next or previous tab (spec Tabs > Behavior > "Swipe within
 * the content area", Gestures > Swipe: "Switch between peer views like
 * tabs").
 *
 * The panels link to an `<md-gb-tabs>` (any `AriaTablistElement`): the
 * `tabs` property, else the element whose id is in `for`, else the previous
 * sibling when it is a tablist. Panel `i` belongs to tab `i`; the panels set
 * each tab's `aria-controls` and each panel's `aria-labelledby`. Selection
 * stays in sync both ways: selecting a tab slides the panels, and a swipe
 * selects the tab (moving its indicator) and fires `change` on the tabs,
 * like a tab click. Without linked tabs, `selectedIndex` drives the panels.
 *
 * Motion follows Compose `HorizontalPager`: a drag moves the panels with the
 * pointer, clamped to the neighboring panels; on release, a fling faster
 * than 400px/s or a drag past half the width settles at the next panel,
 * otherwise back, with the pager's critically damped settle spring.
 * Swiping and slides mirror in right-to-left layouts; with reduced motion
 * the panels change instantly. Inactive panels are `hidden`, and `inert`
 * while they are on screen mid-slide.
 *
 * @slot - The tab panels: elements with `role="tabpanel"`, such as
 *     `<md-aria-tabpanel>` or `<div role="tabpanel">`.
 * @cssprop --transition-duration - Duration of a slide between panels.
 * @cssprop --transition-easing - Easing of a slide between panels.
 */
export declare class TabPanelsElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** The id of the `<md-gb-tabs>` these panels belong to. */
    htmlFor: string;
    /** Whether to turn off swiping between panels. */
    gesturesDisabled: boolean;
    /**
     * The tabs these panels belong to. Setting it overrides `for` and the
     * previous-sibling lookup; set it to `null` to go back to them.
     */
    get tabs(): AriaTablistElement | null;
    set tabs(value: AriaTablistElement | null);
    /**
     * The index of the active panel. With linked tabs, it is the selected
     * tab's index, and setting it selects that tab.
     */
    get selectedIndex(): number;
    set selectedIndex(value: number);
    /** The panels: slotted elements with `role="tabpanel"`. */
    get panels(): HTMLElement[];
    /** The panel that is shown (or being slid to). */
    get activePanel(): HTMLElement | null;
    private explicitTabs;
    private linkedTabs;
    private tabsObserver;
    private standaloneIndex;
    /** The active panel's index, -1 before the first sync. */
    private index;
    /** Panels on screen besides the active one (mid-drag or mid-slide). */
    private readonly visiblePanels;
    private dragWidth;
    /** The fractional panel position while dragging, null otherwise. */
    private dragPosition;
    private slideTimer;
    private sliding;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected updated(changed: PropertyValues<this>): void;
    protected firstUpdated(): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private readonly handleSlotChange;
    /** The `for` tabs, else the previous sibling when it is a tablist. */
    private resolveTabs;
    /** Links to the current tabs (`tabs`, `for` or previous sibling). */
    private linkTabs;
    private observeTabs;
    private readonly handleTabsChange;
    /** The tab elements of the linked tabs. */
    private get tabElements();
    /** Sets `aria-controls` on each tab and `aria-labelledby` on its panel. */
    private linkAria;
    /**
     * Brings the panels in line with the selection: links ARIA, slides to a
     * newly selected panel, and re-applies panel visibility.
     */
    private sync;
    /** Shows the active and sliding panels; hides the rest from everyone. */
    private applyVisibility;
    private setOffset;
    /** The slide duration in ms (0 with reduced motion). */
    private get slideDuration();
    /**
     * Slides from the active panel to `target` (a tab selection). The outgoing
     * panel leaves toward the side opposite the incoming one, which enters
     * from the side of its index, as in a lateral transition between peers.
     */
    private slideTo;
    /**
     * Settles the on-screen panels at the active one from where they are,
     * after a drag.
     */
    private settle;
    /** Finishes the slide when the active panel's transition ends. */
    private waitForSlide;
    private readonly handleTransitionEnd;
    /** Stops a slide's bookkeeping, keeping the panels where they are. */
    private clearSlide;
    /** Ends any slide: only the active panel is shown, at rest. */
    private finishSlide;
    private startDrag;
    /**
     * Swiping between panels: a drag along the reading direction moves the
     * panels with the pointer, and settles at a panel on release (shared
     * DragSettleController; Compose pager snapping: a fling faster than the
     * velocity threshold moves to the next panel in its direction, otherwise
     * the nearer panel past the positional threshold). The anchors are the
     * active panel and its neighbors in px; a drag moves at most one panel and
     * not past the first or last one (pager `pagerSnapDistance` of one page,
     * no overscroll). The panel position grows against the pointer in the
     * reading direction.
     */
    private readonly swipe;
    private positionDrag;
    /**
     * Applies the panel a released drag settles at; the spring then moves the
     * panels there (`onFrame`) and `onSettled` ends the slide.
     */
    private endDrag;
    private cancelDrag;
    /**
     * Selects the tab of a panel a swipe settled at, as a click on it would:
     * the tabs update their selection and indicator and fire `change`.
     */
    private selectFromSwipe;
}
