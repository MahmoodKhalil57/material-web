/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ReactiveController, type ReactiveControllerHost} from 'lit';

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
export const ROVING_KEYS: ReadonlySet<string> = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
]);

/**
 * Returns the index of the item a key moves focus to, or -1 when the key
 * doesn't move focus (not a navigation key for the orientation, no focusable
 * item, or the end of a non-wrapping group).
 *
 * @param count The number of items.
 * @param current The index of the focused item, or -1 when none is.
 * @param key The `KeyboardEvent.key`.
 */
export function nextFocusIndex(
  count: number,
  current: number,
  key: string,
  options: NextFocusOptions = {},
): number {
  const {orientation = 'both', wrap = true, homeEnd = true, rtl = false} = options;
  const canFocus = options.canFocus ?? (() => true);
  if (count <= 0) return -1;
  const first = () => {
    for (let i = 0; i < count; i++) if (canFocus(i)) return i;
    return -1;
  };
  const last = () => {
    for (let i = count - 1; i >= 0; i--) if (canFocus(i)) return i;
    return -1;
  };
  if (key === 'Home') return homeEnd ? first() : -1;
  if (key === 'End') return homeEnd ? last() : -1;

  const vertical = orientation !== 'horizontal';
  const horizontal = orientation !== 'vertical';
  let step = 0;
  if (vertical && key === 'ArrowDown') step = 1;
  else if (vertical && key === 'ArrowUp') step = -1;
  else if (horizontal && key === 'ArrowRight') step = rtl ? -1 : 1;
  else if (horizontal && key === 'ArrowLeft') step = rtl ? 1 : -1;
  if (!step) return -1;

  if (current < 0) return step > 0 ? first() : last();
  for (let n = 1; n < count; n++) {
    const raw = current + step * n;
    if (!wrap && (raw < 0 || raw >= count)) return -1;
    const i = ((raw % count) + count) % count;
    if (canFocus(i)) return i;
  }
  return -1;
}

/**
 * Whether an element is laid out right to left: its computed `direction`,
 * which covers the `dir` attribute (inherited) and CSS `direction`.
 */
export function isRtl(element: Element): boolean {
  if (element.isConnected) return getComputedStyle(element).direction === 'rtl';
  return element.closest('[dir]')?.getAttribute('dir') === 'rtl';
}

/**
 * Default `canFocus` of {@link RovingFocusController}: visible, and not
 * disabled unless soft-disabled (soft-disabled items stay focusable).
 */
export function canFocusItem(item: HTMLElement): boolean {
  if (item.hidden) return false;
  const el = item as HTMLElement & {disabled?: boolean; softDisabled?: boolean};
  if (el.disabled && !el.softDisabled) return false;
  return !item.matches(':disabled');
}

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
export class RovingFocusController implements ReactiveController {
  private tabStopItem: HTMLElement | null = null;

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly options: RovingFocusOptions,
  ) {
    host.addController(this);
  }

  /** The item in the tab order (single tab stop mode), or null. */
  get tabStop(): HTMLElement | null {
    return this.tabStopItem;
  }

  set tabStop(item: HTMLElement | null) {
    this.tabStopItem = item;
    this.applyTabStops();
  }

  hostConnected() {
    this.host.addEventListener('keydown', this.onKeydown);
    this.host.addEventListener('focusin', this.onFocusin);
  }

  hostDisconnected() {
    this.host.removeEventListener('keydown', this.onKeydown);
    this.host.removeEventListener('focusin', this.onFocusin);
  }

  hostUpdated() {
    this.sync();
  }

  /**
   * Keeps the tab stop on a focusable item: the current one if it still can
   * take focus, else the first focusable item.
   */
  sync() {
    if (this.tabStops === 'all') return;
    const items = this.options.items();
    const canFocus = this.canFocus;
    if (!this.tabStopItem || !items.includes(this.tabStopItem) || !canFocus(this.tabStopItem)) {
      const focusable = items.filter(canFocus);
      this.tabStopItem = this.options.initialTabStop?.(focusable) ?? focusable[0] ?? null;
    }
    this.applyTabStops(items);
  }

  /** Moves focus to an item and makes it the tab stop. */
  focus(item: HTMLElement, direction: -1 | 0 | 1 = 0) {
    if (this.tabStops === 'single') this.tabStop = item;
    (this.options.focusItem ?? ((i: HTMLElement) => i.focus()))(item, direction);
  }

  private get tabStops() {
    return this.options.tabStops ?? 'single';
  }

  private get canFocus() {
    return this.options.canFocus ?? canFocusItem;
  }

  private applyTabStops(items = this.options.items()) {
    if (this.tabStops === 'all') return;
    const set =
      this.options.setTabStop ??
      ((item: HTMLElement, stop: boolean) => {
        item.tabIndex = stop ? 0 : -1;
      });
    for (const item of items) set(item, item === this.tabStopItem);
  }

  /** The item an event came from (through shadow roots). */
  private itemFromEvent(event: Event, items: HTMLElement[]) {
    const path = event.composedPath();
    return items.find((item) => path.includes(item)) ?? null;
  }

  private readonly onFocusin = (event: FocusEvent) => {
    if (this.tabStops === 'all') return;
    const item = this.itemFromEvent(event, this.options.items());
    if (item && item !== this.tabStopItem) this.tabStop = item;
  };

  private readonly onKeydown = (event: KeyboardEvent) => {
    // Shift+arrows extend selections in some composites; leave them alone.
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (!ROVING_KEYS.has(event.key)) return;
    const items = this.options.items();
    const from = this.itemFromEvent(event, items);
    if (!from) return;
    const canFocus = this.canFocus;
    const rtl = (this.options.rtl ?? (() => isRtl(this.host)))();
    const next = nextFocusIndex(items.length, items.indexOf(from), event.key, {
      orientation: this.options.orientation,
      wrap: this.options.wrap,
      homeEnd: this.options.homeEnd,
      rtl,
      canFocus: (i) => canFocus(items[i]),
    });
    if (next < 0 || items[next] === from) return;
    event.preventDefault();
    const forward = event.key === 'ArrowDown' || event.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
    const backward = event.key === 'ArrowUp' || event.key === (rtl ? 'ArrowRight' : 'ArrowLeft');
    this.focus(items[next], forward ? 1 : backward ? -1 : 0);
    this.options.onMove?.(items[next], from);
  };
}
