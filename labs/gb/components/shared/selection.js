/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { afterDispatch, setupDispatchHooks } from '../../../../internal/events/dispatch-hooks.js';
/**
 * The selected state after the user activates the item at `index`. Returns a
 * new array (the input is not changed).
 *
 * - `none`: unchanged.
 * - `single`: selects the item and unselects the others; activating the
 *   selected item unselects it unless `required`.
 * - `multiple`: toggles the item.
 *
 * An item that isn't selectable (`selectable[index]` false) changes nothing.
 */
export function nextSelection(selected, index, rules, selectable) {
    const next = [...selected];
    if (index < 0 || index >= next.length)
        return next;
    if (rules.mode === 'none' || selectable?.[index] === false)
        return next;
    if (rules.mode === 'multiple') {
        next[index] = !next[index];
        return next;
    }
    if (next[index]) {
        if (!rules.required)
            next[index] = false;
        return next;
    }
    return next.map((_, i) => i === index);
}
/**
 * Makes a selected state consistent with the rules. Returns a new array.
 *
 * - `none`: nothing selected.
 * - `single`: at most one selected: the `preferred` item if it is selected,
 *   else the last selected one. With `required` and none selected, the first
 *   selectable item.
 * - `multiple`: unchanged.
 */
export function normalizeSelection(selected, rules, options = {}) {
    if (rules.mode === 'none')
        return selected.map(() => false);
    if (rules.mode === 'multiple')
        return [...selected];
    const on = selected.flatMap((value, i) => (value ? [i] : []));
    if (on.length > 1) {
        const keep = options.preferred !== undefined && selected[options.preferred]
            ? options.preferred
            : on[on.length - 1];
        return selected.map((_, i) => i === keep);
    }
    if (on.length === 0 && rules.required) {
        const first = selected.findIndex((_, i) => options.selectable?.[i] !== false);
        return selected.map((_, i) => i === first);
    }
    return [...selected];
}
/**
 * The value of the ARIA attribute for a selected state, or null when the
 * attribute should be removed (`aria-current` is only present on the current
 * item, with the value `page`).
 */
export function ariaSelectionValue(aria, selected) {
    if (aria === 'current')
        return selected ? 'page' : null;
    return selected ? 'true' : 'false';
}
/**
 * Selection for a Lit host: click (and optionally Space/Enter) handling,
 * the none / single / multiple model with `required`, ARIA reflection, user
 * `input`/`change` events and the form value.
 *
 * Listens for `click` and `keydown` on the host. Call {@link normalize} when
 * the items or the rules change (slot change, mode change).
 */
export class SelectionController {
    constructor(host, options) {
        this.host = host;
        this.options = options;
        this.defaults = new WeakMap();
        this.observer = null;
        this.onClick = (event) => {
            if (event.defaultPrevented)
                return;
            const item = this.itemFromEvent(event);
            if (!item || this.options.ignore?.(event, item))
                return;
            const claim = this.options.claimClicks;
            if ((typeof claim === 'function' ? claim() : claim) && this.canSelect(item)) {
                event.preventDefault();
                this.activate(item);
                return;
            }
            if (this.options.vetoable === false) {
                this.activate(item);
                return;
            }
            afterDispatch(event, () => {
                if (!event.defaultPrevented)
                    this.activate(item);
            });
        };
        this.onKeydown = (event) => {
            if (this.options.keys !== 'controller')
                return;
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
                return;
            if (event.key !== 'Enter' && event.key !== ' ')
                return;
            const item = this.itemFromEvent(event);
            if (!item || this.options.ignore?.(event, item))
                return;
            // Space would scroll the page.
            event.preventDefault();
            if (!event.repeat)
                this.activate(item);
        };
        host.addController(this);
        setupDispatchHooks(host, 'click');
    }
    /** The selection mode. */
    get mode() {
        return this.options.mode();
    }
    /** Whether the selected item can't be unselected (single mode). */
    get required() {
        return this.mode === 'single' && Boolean(this.options.required?.());
    }
    /** The selected items. */
    get selectedItems() {
        return this.items.filter((item) => this.isSelected(item));
    }
    /** The index of the first selected item, or -1. */
    get selectedIndex() {
        return this.items.findIndex((item) => this.isSelected(item));
    }
    /** The indices of all selected items. */
    get selectedIndices() {
        return this.items.flatMap((item, i) => (this.isSelected(item) ? [i] : []));
    }
    /** The value of the first selected item, or `''`. */
    get value() {
        const item = this.selectedItems[0];
        return item ? this.valueOf(item) : '';
    }
    /** The values of the selected items. */
    get values() {
        return this.selectedItems.map((item) => this.valueOf(item));
    }
    hostConnected() {
        this.host.addEventListener('click', this.onClick);
        this.host.addEventListener('keydown', this.onKeydown);
        if (this.options.observe !== false) {
            this.observer = new MutationObserver((records) => this.onMutations(records));
            this.observer.observe(this.host, {
                subtree: true,
                attributes: true,
                attributeFilter: ['selected'],
            });
        }
    }
    hostDisconnected() {
        this.host.removeEventListener('click', this.onClick);
        this.host.removeEventListener('keydown', this.onKeydown);
        this.observer?.disconnect();
        this.observer = null;
    }
    hostUpdated() {
        this.syncAria();
    }
    /**
     * Selects the items with these values (only the first match in single
     * mode), unselecting the others. Programmatic: no events.
     */
    setValues(values) {
        const single = this.mode !== 'multiple';
        let found = false;
        for (const item of this.items) {
            const on = values.includes(this.valueOf(item)) && !(single && found);
            found ||= on;
            this.apply(item, on);
        }
        this.finish(null);
    }
    /** Selects or unselects an item. Programmatic: no events. */
    select(item, selected = true) {
        if (!this.items.includes(item))
            return;
        if (selected && this.mode === 'single') {
            for (const other of this.items)
                this.apply(other, other === item);
        }
        else {
            this.apply(item, selected);
        }
        this.finish(null);
    }
    /** Unselects every item. Programmatic: no events. */
    clear() {
        for (const item of this.items)
            this.apply(item, false);
        this.finish(null);
    }
    /**
     * What the user does to an item (click, Space, Enter): selects it, or
     * toggles it as the mode and `required` say. Dispatches `input` and
     * `change` when the selection changed. Returns whether it changed.
     */
    activate(item) {
        const items = this.items;
        const index = items.indexOf(item);
        if (index < 0 || !this.canSelect(item))
            return false;
        const before = items.map((i) => this.isSelected(i));
        const rules = { mode: this.mode, required: this.required };
        const after = nextSelection(before, index, rules, items.map((i) => this.canSelect(i)));
        if (after.every((value, i) => value === before[i]))
            return false;
        after.forEach((value, i) => this.apply(items[i], value));
        this.finish(item);
        const from = this.options.eventsFrom ?? 'host';
        for (const type of this.options.events ?? ['input', 'change']) {
            const make = (bubbles) => type === 'input'
                ? new InputEvent('input', { bubbles, composed: bubbles })
                : new Event('change', { bubbles });
            if (from === 'both')
                item.dispatchEvent(make(false));
            (from === 'item' ? item : this.host).dispatchEvent(make(true));
        }
        return true;
    }
    /**
     * Makes the selection consistent with the mode and `required`. Call it
     * after the items or the rules change. Programmatic: no events.
     *
     * @param preferred The item to keep when single mode finds several selected.
     */
    normalize(preferred) {
        const items = this.items;
        const before = items.map((i) => this.isSelected(i));
        const after = normalizeSelection(before, { mode: this.mode, required: this.required && this.options.autoSelectFirst !== false }, {
            preferred: preferred ? items.indexOf(preferred) : undefined,
            selectable: items.map((i) => this.canSelect(i)),
        });
        let changed = false;
        after.forEach((value, i) => {
            if (value !== before[i]) {
                this.apply(items[i], value);
                changed = true;
            }
        });
        this.rememberDefaults();
        if (changed)
            this.finish(null);
        else
            this.syncAria();
    }
    /** Remembers each item's current state as its default for {@link reset}. */
    rememberDefaults() {
        for (const item of this.items) {
            if (!this.defaults.has(item))
                this.defaults.set(item, this.isSelected(item));
        }
    }
    /** Restores the remembered states (form reset). Programmatic: no events. */
    reset() {
        for (const item of this.items)
            this.apply(item, this.defaults.get(item) ?? false);
        this.finish(null);
    }
    /**
     * The form value: nothing selected is `null`; single mode is the selected
     * item's value; multiple mode is a `FormData` with one `name` entry per
     * selected item.
     */
    formValue(name) {
        const values = this.values;
        if (!values.length)
            return null;
        if (this.mode !== 'multiple')
            return values[0];
        const data = new FormData();
        for (const value of values)
            data.append(name, value);
        return data;
    }
    /** Writes the ARIA attribute on every item (when `aria` is set). */
    syncAria() {
        const aria = this.options.aria;
        if (!aria)
            return;
        for (const item of this.items) {
            const target = this.options.ariaTarget?.(item) ?? item;
            const value = ariaSelectionValue(aria, this.isSelected(item));
            if (value === null)
                target.removeAttribute(`aria-${aria}`);
            else if (target.getAttribute(`aria-${aria}`) !== value)
                target.setAttribute(`aria-${aria}`, value);
        }
    }
    get items() {
        return this.options.items();
    }
    isSelected(item) {
        return this.options.isSelected ? this.options.isSelected(item) : Boolean(item.selected);
    }
    apply(item, selected) {
        if (this.isSelected(item) === selected)
            return;
        if (this.options.setSelected)
            this.options.setSelected(item, selected);
        else
            item.selected = selected;
    }
    canSelect(item) {
        if (this.options.canSelect)
            return this.options.canSelect(item);
        const el = item;
        return !el.disabled && !el.softDisabled && !el.hidden;
    }
    valueOf(item) {
        return item.value ?? '';
    }
    finish(item) {
        this.observer?.takeRecords();
        this.syncAria();
        this.options.onChange?.(item);
        // Updates a form-associated host's value before any event.
        this.host.requestUpdate();
    }
    itemFromEvent(event) {
        const path = event.composedPath();
        return this.items.find((item) => path.includes(item));
    }
    /** Keeps the rules when items change their `selected` attribute on their own. */
    onMutations(records) {
        const items = this.items;
        let changed = false;
        let preferred;
        for (const record of records) {
            const target = record.target;
            if (!items.includes(target))
                continue;
            changed = true;
            if (this.isSelected(target))
                preferred = target;
        }
        if (!changed)
            return;
        this.normalize(preferred);
        this.options.onChange?.(null);
        this.host.requestUpdate();
    }
}
//# sourceMappingURL=selection.js.map