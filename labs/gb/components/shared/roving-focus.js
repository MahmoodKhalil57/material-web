/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** The keys {@link nextFocusIndex} can handle. */
export const ROVING_KEYS = new Set([
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
export function nextFocusIndex(count, current, key, options = {}) {
    const { orientation = 'both', wrap = true, homeEnd = true, rtl = false } = options;
    const canFocus = options.canFocus ?? (() => true);
    if (count <= 0)
        return -1;
    const first = () => {
        for (let i = 0; i < count; i++)
            if (canFocus(i))
                return i;
        return -1;
    };
    const last = () => {
        for (let i = count - 1; i >= 0; i--)
            if (canFocus(i))
                return i;
        return -1;
    };
    if (key === 'Home')
        return homeEnd ? first() : -1;
    if (key === 'End')
        return homeEnd ? last() : -1;
    const vertical = orientation !== 'horizontal';
    const horizontal = orientation !== 'vertical';
    let step = 0;
    if (vertical && key === 'ArrowDown')
        step = 1;
    else if (vertical && key === 'ArrowUp')
        step = -1;
    else if (horizontal && key === 'ArrowRight')
        step = rtl ? -1 : 1;
    else if (horizontal && key === 'ArrowLeft')
        step = rtl ? 1 : -1;
    if (!step)
        return -1;
    if (current < 0)
        return step > 0 ? first() : last();
    for (let n = 1; n < count; n++) {
        const raw = current + step * n;
        if (!wrap && (raw < 0 || raw >= count))
            return -1;
        const i = ((raw % count) + count) % count;
        if (canFocus(i))
            return i;
    }
    return -1;
}
/**
 * Whether an element is laid out right to left: its computed `direction`,
 * which covers the `dir` attribute (inherited) and CSS `direction`.
 */
export function isRtl(element) {
    if (element.isConnected)
        return getComputedStyle(element).direction === 'rtl';
    return element.closest('[dir]')?.getAttribute('dir') === 'rtl';
}
/**
 * Default `canFocus` of {@link RovingFocusController}: visible, and not
 * disabled unless soft-disabled (soft-disabled items stay focusable).
 */
export function canFocusItem(item) {
    if (item.hidden)
        return false;
    const el = item;
    if (el.disabled && !el.softDisabled)
        return false;
    return !item.matches(':disabled');
}
/**
 * Arrow-key focus movement and a roving tab stop for a Lit host.
 *
 * Listens for `keydown` and `focusin` on the host. Call {@link sync} when the
 * items change (slot change, disabled change) so the tab stop stays on a
 * focusable item.
 */
export class RovingFocusController {
    constructor(host, options) {
        this.host = host;
        this.options = options;
        this.tabStopItem = null;
        this.onFocusin = (event) => {
            if (this.tabStops === 'all')
                return;
            const item = this.itemFromEvent(event, this.options.items());
            if (item && item !== this.tabStopItem)
                this.tabStop = item;
        };
        this.onKeydown = (event) => {
            // Shift+arrows extend selections in some composites; leave them alone.
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
                return;
            if (!ROVING_KEYS.has(event.key))
                return;
            const items = this.options.items();
            const from = this.itemFromEvent(event, items);
            if (!from)
                return;
            const canFocus = this.canFocus;
            const rtl = (this.options.rtl ?? (() => isRtl(this.host)))();
            const next = nextFocusIndex(items.length, items.indexOf(from), event.key, {
                orientation: this.options.orientation,
                wrap: this.options.wrap,
                homeEnd: this.options.homeEnd,
                rtl,
                canFocus: (i) => canFocus(items[i]),
            });
            if (next < 0 || items[next] === from)
                return;
            event.preventDefault();
            const forward = event.key === 'ArrowDown' || event.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
            const backward = event.key === 'ArrowUp' || event.key === (rtl ? 'ArrowRight' : 'ArrowLeft');
            this.focus(items[next], forward ? 1 : backward ? -1 : 0);
            this.options.onMove?.(items[next], from);
        };
        host.addController(this);
    }
    /** The item in the tab order (single tab stop mode), or null. */
    get tabStop() {
        return this.tabStopItem;
    }
    set tabStop(item) {
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
        if (this.tabStops === 'all')
            return;
        const items = this.options.items();
        const canFocus = this.canFocus;
        if (!this.tabStopItem || !items.includes(this.tabStopItem) || !canFocus(this.tabStopItem)) {
            const focusable = items.filter(canFocus);
            this.tabStopItem = this.options.initialTabStop?.(focusable) ?? focusable[0] ?? null;
        }
        this.applyTabStops(items);
    }
    /** Moves focus to an item and makes it the tab stop. */
    focus(item, direction = 0) {
        if (this.tabStops === 'single')
            this.tabStop = item;
        (this.options.focusItem ?? ((i) => i.focus()))(item, direction);
    }
    get tabStops() {
        return this.options.tabStops ?? 'single';
    }
    get canFocus() {
        return this.options.canFocus ?? canFocusItem;
    }
    applyTabStops(items = this.options.items()) {
        if (this.tabStops === 'all')
            return;
        const set = this.options.setTabStop ??
            ((item, stop) => {
                item.tabIndex = stop ? 0 : -1;
            });
        for (const item of items)
            set(item, item === this.tabStopItem);
    }
    /** The item an event came from (through shadow roots). */
    itemFromEvent(event, items) {
        const path = event.composedPath();
        return items.find((item) => path.includes(item)) ?? null;
    }
}
//# sourceMappingURL=roving-focus.js.map