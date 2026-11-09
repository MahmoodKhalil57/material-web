/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement, type PropertyValues } from 'lit';
import { DisclosureController } from '../shared/disclosure.js';
import '../iconbutton/md-gb-icon-button.js';
import '../menu/md-gb-menu.js';
import '../menu/md-gb-menu-item.js';
import { OverflowController } from '../shared/overflow.js';
import { ScrollBehaviorController } from '../shared/scroll-behavior.js';
import { RovingFocusController } from '../shared/roving-focus.js';
import { type ToolbarColor, type ToolbarOrientation } from './toolbar.js';
/**
 * A Material Design gBreeze toolbar component.
 *
 * Focus not obscured (WCAG 2.4.11): a docked or floating toolbar that stays
 * over scrolling content (sticky or fixed) must not hide focused elements.
 * Register it with `setupScrollPadding()` (`appbar/scroll-padding.js`, as an
 * `end` bar): it sets `scroll-padding-block-end` and
 * `--md-gb-obscured-block-end` on the scroll container so focused elements
 * and their focus indicators scroll clear of the toolbar. Snackbars should
 * appear above the toolbar: set their `anchor` to it.
 *
 * @slot - Used to display toolbar items (buttons, icon buttons, or custom
 *   content).
 * @slot leading - Used to display leading toolbar items.
 * @slot trailing - Used to display trailing toolbar items.
 * @slot fab - An optional FAB (`md-gb-fab`) shown next to a floating
 *     toolbar, colored by the toolbar's `color` (standard: secondary
 *     container, vibrant: tertiary container).
 * @csspart toolbar - The toolbar's root container.
 * @csspart toolbar-with-fab - The toolbar and FAB layout, with a FAB.
 * @cssprop --button-container-color
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-leading-space
 * @cssprop --container-shape
 * @cssprop --container-spacing
 * @cssprop --container-trailing-space
 * @cssprop --docked-container-elevation
 * @cssprop --docked-container-height
 * @cssprop --docked-container-leading-space
 * @cssprop --docked-container-max-spacing
 * @cssprop --docked-container-min-spacing
 * @cssprop --docked-container-shape
 * @cssprop --docked-container-trailing-space
 * @cssprop --horizontal-container-height
 * @cssprop --icon-color
 * @cssprop --label-text-color
 * @cssprop --min-button-size
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 * @cssprop --selected-button-container-color
 * @cssprop --selected-icon-color
 * @cssprop --selected-label-text-color
 * @cssprop --vertical-container-width
 */
export declare class ToolbarElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    protected readonly internals: ElementInternals;
    constructor();
    /** The color scheme of the toolbar. */
    color: ToolbarColor;
    /** The layout orientation. */
    orientation: ToolbarOrientation;
    /** Whether the toolbar is docked across full width. */
    docked: boolean;
    /**
     * Whether a floating toolbar with a FAB shows its items. When `false`,
     * the toolbar collapses and its FAB grows to the medium size (Compose
     * floating toolbar `expanded`). Set `expanded="false"` from markup.
     */
    expanded: boolean;
    /** Which side of a floating toolbar the FAB is on (`end` or `start`). */
    fabPosition: 'start' | 'end';
    private hasFab;
    /** A collapsed floating toolbar with a FAB hides its items (inert). */
    protected readonly disclosure: DisclosureController;
    /**
     * Arrow keys move focus between the controls (toolbars.md: the toolbar
     * declares `focusgroup="toolbar wrap inline|block"`, which Chromium does
     * not ship, so the shared RovingFocusController implements it). Up and
     * Down move in a vertical toolbar, Left and Right in a horizontal one
     * (mirrored in RTL). Every control stays in the tab order ("Use Tab to
     * navigate through all other actions"). Disabled controls are skipped.
     */
    protected readonly rovingFocus: RovingFocusController;
    /**
     * The toolbar's interactive controls in the leading, default and trailing
     * slots.
     *
     * @internal
     */
    get controls(): HTMLElement[];
    /**
     * Whether trailing actions that do not fit move into an overflow menu in
     * the trailing slot (toolbars.md, Adaptive design). On by itself when an
     * `overflow` slot trigger is provided; this turns it on with the default
     * "More actions" button.
     */
    overflowMenu: boolean;
    private hasOverflowSlot;
    /**
     * Trailing actions hide, last first, while they do not fit the toolbar's
     * width (the window, the parent or a `max-width` on the toolbar), and
     * return when it grows. The menu in the trailing slot lists them and
     * clicks the original action (toolbars.md: "If there's not enough space
     * for all items, put them in an overflow menu in the trailing slot.").
     */
    protected readonly overflowing: OverflowController;
    /**
     * How a docked or floating toolbar reacts to scrolling: `hide` slides it
     * beyond the bottom edge when the page scrolls down and back on scroll up
     * (toolbars.md: docked and floating toolbars "can animate offscreen").
     */
    scrollBehavior?: 'hide';
    /** The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. */
    scrollTarget: string;
    /** Hides and reveals the toolbar on scroll (see `scroll-behavior`). */
    protected readonly scrollController: ScrollBehaviorController;
    private get trailingActions();
    connectedCallback(): void;
    protected willUpdate(): void;
    protected updated(changedProperties: PropertyValues<this>): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private handleTrailingSlotChange;
    private handleOverflowSlotChange;
    private handleFabSlotChange;
}
