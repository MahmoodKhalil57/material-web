/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
/**
 * Shared keyboard focus movement inside a composite component (a group of
 * items that arrow keys move between): button groups, segmented buttons,
 * chip sets, lists, menus, tabs, navigation, pickers.
 *
 * - Arrow keys move to the next or previous focusable item along the
 *   orientation. Left and Right follow the reading direction (mirrored in
 *   RTL).
 * - Focus wraps at the ends unless `wrap` is false.
 * - Home and End move to the first and last focusable item.
 * - Items that `canFocus` rejects are skipped (disabled; soft-disabled items
 *   stay focusable).
 * - `tabStops: 'single'` keeps one item in the tab order (roving tabindex):
 *   Tab enters the group on the last focused item, or the first focusable
 *   one. `'all'` leaves every item in the tab order and only adds arrows.
 *
 * Keys pressed with Alt, Ctrl, Meta or Shift, and keys a handler already
 * prevented, are left alone.
 *
 * Spec: the keyboard tables of the component pages ("Arrow keys | Navigate
 * inside the component", "Home/End"), WAI-ARIA composite widget practice.
 */
/** Which arrow keys move focus. */
export type RovingOrientation = 'horizontal' | 'vertical' | 'both';
/** Options of {@link nextFocusIndex}. */
export interface NextFocusOptions {
    /** Which arrow keys move focus. Default `'both'`. */
    orientation?: RovingOrientation;
    /** Whether focus wraps from the last item to the first and back. Default true. */
    wrap?: boolean;
    /** Whether Home and End move to the first and last item. Default true. */
    homeEnd?: boolean;
    /** Whether the items are laid out right to left. Default false. */
    rtl?: boolean;
    /** Whether the item at an index can take focus. Default: every item. */
    canFocus?: (index: number) => boolean;
}
/** The keys {@link nextFocusIndex} can handle. */
export declare const ROVING_KEYS: ReadonlySet<string>;
/**
 * Returns the index of the item a key moves focus to, or -1 when the key
 * doesn't move focus (not a navigation key for the orientation, no focusable
 * item, or the end of a non-wrapping group).
 *
 * @param count The number of items.
 * @param current The index of the focused item, or -1 when none is.
 * @param key The `KeyboardEvent.key`.
 */
export declare function nextFocusIndex(count: number, current: number, key: string, options?: NextFocusOptions): number;
/**
 * Whether an element is laid out right to left: its computed `direction`,
 * which covers the `dir` attribute (inherited) and CSS `direction`.
 */
export declare function isRtl(element: Element): boolean;
/**
 * Default `canFocus` of {@link RovingFocusController}: visible, and not
 * disabled unless soft-disabled (soft-disabled items stay focusable).
 */
export declare function canFocusItem(item: HTMLElement): boolean;
/** Options of {@link RovingFocusController}. */
export interface RovingFocusOptions {
    /** The items, in navigation order. Called on every key press. */
    items: () => HTMLElement[];
    /** Which arrow keys move focus. Default `'both'`. */
    orientation?: RovingOrientation;
    /** Whether focus wraps at the ends. Default true. */
    wrap?: boolean;
    /** Whether Home and End move to the first and last item. Default true. */
    homeEnd?: boolean;
    /**
     * `'single'`: one item is in the tab order (roving tabindex). `'all'`: every
     * item stays in the tab order; arrows only add movement. Default `'single'`.
     */
    tabStops?: 'single' | 'all';
    /** Whether an item can take focus. Default {@link canFocusItem}. */
    canFocus?: (item: HTMLElement) => boolean;
    /**
     * The tab stop when none is set yet (or it can't take focus any more),
     * chosen from the focusable items, e.g. the selected destination of a
     * navigation drawer. Default: the first focusable item.
     */
    initialTabStop?: (focusable: HTMLElement[]) => HTMLElement | undefined;
    /**
     * Puts an item in or out of the tab order (single tab stop mode). Default:
     * `tabIndex` 0 or -1.
     */
    setTabStop?: (item: HTMLElement, isTabStop: boolean) => void;
    /**
     * Moves focus to an item. `direction` is 1 for a forward key, -1 for a
     * backward key (in reading order, so RTL is already applied) and 0 for
     * Home, End or a programmatic move: e.g. a chip entered backwards focuses
     * its remove button. Default `item.focus()`.
     */
    focusItem?: (item: HTMLElement, direction: -1 | 0 | 1) => void;
    /** Whether the group is laid out right to left. Default `:dir(rtl)` of the host. */
    rtl?: () => boolean;
    /** Called after a key moved focus. */
    onMove?: (item: HTMLElement, from: HTMLElement | null) => void;
}
/**
 * Arrow-key focus movement and a roving tab stop for a Lit host.
 *
 * Listens for `keydown` and `focusin` on the host. Call {@link sync} when the
 * items change (slot change, disabled change) so the tab stop stays on a
 * focusable item.
 */
export declare class RovingFocusController implements ReactiveController {
    private readonly host;
    private readonly options;
    private tabStopItem;
    constructor(host: ReactiveControllerHost & HTMLElement, options: RovingFocusOptions);
    /** The item in the tab order (single tab stop mode), or null. */
    get tabStop(): HTMLElement | null;
    set tabStop(item: HTMLElement | null);
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdated(): void;
    /**
     * Keeps the tab stop on a focusable item: the current one if it still can
     * take focus, else the first focusable item.
     */
    sync(): void;
    /** Moves focus to an item and makes it the tab stop. */
    focus(item: HTMLElement, direction?: -1 | 0 | 1): void;
    private get tabStops();
    private get canFocus();
    private applyTabStops;
    /** The item an event came from (through shadow roots). */
    private itemFromEvent;
    private readonly onFocusin;
    private readonly onKeydown;
}
