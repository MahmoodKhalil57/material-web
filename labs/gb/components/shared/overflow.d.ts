/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost, type TemplateResult } from 'lit';
/**
 * Shared overflow menu: the trailing items of a row (button group, toolbar)
 * that do not fit move into a menu opened by a trailing overflow button, and
 * come back when space returns.
 *
 * - The host's `container` must not wrap or shrink its items. An item
 *   overflows when the container's content is wider (taller, for
 *   `axis: 'block'`) than the container: the container is bounded by its
 *   parent, a `max-width`, or a fixed width.
 * - The trailing items hide first, one at a time, until the content fits
 *   with the trigger shown. The trigger is shown only while an item is
 *   hidden. A hidden item keeps its place in the DOM, its listeners and its
 *   state: it is `hidden` and carries `data-overflow-hidden`.
 * - The menu lists the hidden items in order. Choosing one clicks the
 *   original item, so its handlers, links and toggle state run unchanged.
 *   Each menu item reads the original's label (`aria-label`, else its
 *   text) and `disabled` state.
 * - The container, the host, the host's parent and the items are observed
 *   with a ResizeObserver, so items return when the window grows. Call
 *   {@link refresh} after a slot change.
 * - The trigger opens the menu on click, Enter and Space (its click), and
 *   Up and Down ("For closed menus: Opens menu"). Items hidden by the app
 *   itself (`hidden` it set) are left alone.
 *
 * Spec: button-groups.md and toolbars.md, Adaptive design / Presentation:
 * "Buttons at the trailing edge of the button group can be customized to
 * collapse into an overflow menu at smaller breakpoints, and become visible
 * again at larger sizes. Place the overflow menu at the trailing end."
 */
/** Marks an item (or the trigger) the controller keeps hidden. */
export declare const OVERFLOW_HIDDEN_ATTRIBUTE = "data-overflow-hidden";
/**
 * Styles for hosts: an overflowed item stays out of the layout even when its
 * own styles set `display`.
 */
export declare const overflowStyles: import("lit").CSSResult;
/** The icon of the default overflow button (three dots, vertical). */
export declare const overflowIcon: TemplateResult<1>;
/** Options of {@link OverflowController}. */
export interface OverflowOptions {
    /**
     * The items that may overflow, in order; the last one hides first. Called
     * on every measure.
     */
    items: () => HTMLElement[];
    /** The element whose content must fit (not wrap, not shrink its items). */
    container: () => HTMLElement | null;
    /**
     * The overflow trigger (a button). Shown only while an item is hidden.
     * Make it a child of the container.
     */
    trigger: () => HTMLElement | null;
    /** The `md-gb-menu` that lists the hidden items. */
    menu: () => HTMLElement | null;
    /** Whether overflow is on. Default true. Off, every item shows. */
    enabled?: () => boolean;
    /** The axis the items are laid out along. Default `'inline'`. */
    axis?: () => 'inline' | 'block';
}
/** Gets the label of an item for the overflow menu. */
export declare function overflowLabel(item: HTMLElement): string;
/**
 * Moves the trailing items of a Lit host into an overflow menu while they do
 * not fit. See the file comment.
 */
export declare class OverflowController implements ReactiveController {
    private readonly host;
    private readonly options;
    private readonly hiddenByUs;
    private readonly observer;
    private observed;
    private measuring;
    private frame;
    private menuAbort?;
    private menuNode;
    private closedAt;
    private overflowedItems;
    constructor(host: ReactiveControllerHost & HTMLElement, options: OverflowOptions);
    /** The items that are hidden in the menu now, in order. */
    get overflowed(): readonly HTMLElement[];
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdated(): void;
    /** Measures again now (after a slot change or an item change). */
    refresh(): void;
    /** Opens the menu next to the trigger. */
    open(): void;
    /** Closes the menu. */
    close(): void;
    /** Clicks the original item behind a menu entry. */
    activate(item: HTMLElement): void;
    private observe;
    private setHidden;
    private measure;
    private watchMenu;
    private readonly onClick;
    private readonly onKeydown;
}
/** Options of {@link renderOverflowMenu}. */
export interface RenderOverflowMenuOptions {
    /** Called when the menu closes. */
    onClose?: () => void;
}
/**
 * Renders the overflow menu of a host: an `md-gb-menu` (import
 * `menu/md-gb-menu.js` and `menu/md-gb-menu-item.js`) with an entry for each
 * hidden item. Choosing an entry clicks the original.
 */
export declare function renderOverflowMenu(controller: OverflowController, options?: RenderOverflowMenuOptions): TemplateResult;
