/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ReactiveController, type ReactiveControllerHost} from 'lit';

import {afterDispatch, setupDispatchHooks} from '../../internal/events/dispatch-hooks.js';

/**
 * Shared selection model of a group of items: button groups, segmented
 * buttons, chip sets, tabs, navigation bars (and, later, lists, menus and
 * selects).
 *
 * - Modes: `none` (items only perform actions), `single` (at most one item is
 *   selected, like radio buttons) and `multiple` (any number, like
 *   checkboxes).
 * - `required` (single mode only): the selected item can't be unselected, and
 *   normalizing selects the first selectable item when none is. In multiple
 *   mode selection is never required ("a user may concurrently select
 *   anywhere from all to none of the options").
 * - A click or, with `keys: 'controller'`, Space or Enter on an item selects
 *   it (and unselects it in multiple mode, or in single mode unless
 *   required). Native buttons and tab-like elements already turn Space and
 *   Enter into a click, so the default `keys: 'native'` relies on that. A
 *   click is applied after it finished dispatching, so a listener that
 *   cancels it (`preventDefault()`) vetoes the selection; with `claimClicks`
 *   it is applied right away instead.
 * - `input` and `change` events are dispatched only for user interaction,
 *   never for programmatic changes. The state is reflected as the ARIA
 *   attribute of the item's role: `aria-checked` (radio, checkbox),
 *   `aria-pressed` (toggle button), `aria-selected` (tab, option) or
 *   `aria-current` (current destination).
 * - Form-associated hosts get their value from {@link
 *   SelectionController.formValue}.
 *
 * Spec: the selection, keyboard ("Space or Enter selects the focused item")
 * and labeling ("single-select behaves like radio buttons, multi-select like
 * checkboxes") sections of the button group, segmented button, chip, tab and
 * navigation bar pages.
 */

/** How many items can be selected. */
export type SelectionMode = 'none' | 'single' | 'multiple';

/**
 * The ARIA attribute that carries the selected state, by the item's role:
 * `checked` (radio, checkbox, switch), `pressed` (toggle button), `selected`
 * (tab, option) or `current` (the current page or destination).
 */
export type SelectionAria = 'checked' | 'pressed' | 'selected' | 'current';

/** Rules of the pure selection helpers. */
export interface SelectionRules {
  /** The selection mode. */
  mode: SelectionMode;
  /** Single mode: the selected item can't be unselected. */
  required?: boolean;
}

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
export function nextSelection(
  selected: readonly boolean[],
  index: number,
  rules: SelectionRules,
  selectable?: readonly boolean[],
): boolean[] {
  const next = [...selected];
  if (index < 0 || index >= next.length) return next;
  if (rules.mode === 'none' || selectable?.[index] === false) return next;
  if (rules.mode === 'multiple') {
    next[index] = !next[index];
    return next;
  }
  if (next[index]) {
    if (!rules.required) next[index] = false;
    return next;
  }
  return next.map((_, i) => i === index);
}

/** Options of {@link normalizeSelection}. */
export interface NormalizeOptions {
  /** The index to keep when single mode finds several selected items. */
  preferred?: number;
  /** Which items can be selected (for the `required` fallback). */
  selectable?: readonly boolean[];
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
export function normalizeSelection(
  selected: readonly boolean[],
  rules: SelectionRules,
  options: NormalizeOptions = {},
): boolean[] {
  if (rules.mode === 'none') return selected.map(() => false);
  if (rules.mode === 'multiple') return [...selected];
  const on = selected.flatMap((value, i) => (value ? [i] : []));
  if (on.length > 1) {
    const keep =
      options.preferred !== undefined && selected[options.preferred]
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
export function ariaSelectionValue(aria: SelectionAria, selected: boolean): string | null {
  if (aria === 'current') return selected ? 'page' : null;
  return selected ? 'true' : 'false';
}

/** Options of {@link SelectionController}. */
export interface SelectionOptions<T extends HTMLElement = HTMLElement> {
  /** The items, in order. Called often. */
  items: () => T[];
  /** The selection mode. */
  mode: () => SelectionMode;
  /** Single mode: the selected item can't be unselected. */
  required?: () => boolean;
  /**
   * Whether {@link SelectionController.normalize} (and a programmatic
   * unselect) selects the first selectable item when `required` and none is
   * selected. Default true.
   */
  autoSelectFirst?: boolean;
  /** Whether an item is selected. Default: its `selected` property. */
  isSelected?: (item: T) => boolean;
  /** Selects or unselects an item. Default: sets its `selected` property. */
  setSelected?: (item: T, selected: boolean) => void;
  /**
   * Whether an item can be selected by the user. Default: not `disabled`,
   * `softDisabled` or `hidden`. An item that can't be selected is also
   * skipped by the `required` fallback.
   */
  canSelect?: (item: T) => boolean;
  /**
   * Whether a click or key press on an item is not a selection (e.g. the
   * remove button of a chip).
   */
  ignore?: (event: Event, item: T) => boolean;
  /**
   * The ARIA attribute the controller reflects on each item. Leave it out
   * when the items render their own ARIA state from `selected` (a shadow
   * `<button aria-pressed>`, tabs through ElementInternals).
   */
  aria?: SelectionAria;
  /** The element that carries the ARIA attribute. Default: the item. */
  ariaTarget?: (item: T) => Element;
  /**
   * `native` (default): Space and Enter already click the item (buttons,
   * tabs). `controller`: the controller selects on Enter and Space keydown.
   */
  keys?: 'native' | 'controller';
  /**
   * Calls `preventDefault()` on the clicks of selectable items, so an item
   * that toggles itself on click (a toggle button, a filter chip) or a base
   * class that selects on click leaves the selection to the controller.
   * Clicks on items that can't be selected (links, disabled) stay untouched.
   */
  claimClicks?: boolean | (() => boolean);
  /**
   * Whether a click is applied after it finished dispatching, so a listener
   * that cancels it vetoes the selection. Default true. Set it to false when
   * the host's base class also selects after the click (tab lists): applying
   * the selection during the click leaves that code with nothing to do.
   */
  vetoable?: boolean;
  /** Which events a user change dispatches. Default both. */
  events?: ReadonlyArray<'input' | 'change'>;
  /**
   * Where the events are dispatched. Default `host`. `item`: from the
   * activated item, bubbling to the host. `both`: from the host, and also
   * (without bubbling) from the item, for listeners on the item itself.
   */
  eventsFrom?: 'host' | 'item' | 'both';
  /**
   * Watches the items' `selected` attribute so that programmatic changes
   * keep the mode and `required` rules (a second item selected in single
   * mode unselects the first). Default true.
   */
  observe?: boolean;
  /**
   * Called after the selection changed, before the events: `item` is the
   * item the user activated, or null for programmatic changes.
   */
  onChange?: (item: T | null) => void;
}

/**
 * Selection for a Lit host: click (and optionally Space/Enter) handling,
 * the none / single / multiple model with `required`, ARIA reflection, user
 * `input`/`change` events and the form value.
 *
 * Listens for `click` and `keydown` on the host. Call {@link normalize} when
 * the items or the rules change (slot change, mode change).
 */
export class SelectionController<T extends HTMLElement = HTMLElement> implements ReactiveController {
  private readonly defaults = new WeakMap<T, boolean>();
  private observer: MutationObserver | null = null;

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly options: SelectionOptions<T>,
  ) {
    host.addController(this);
    setupDispatchHooks(host, 'click');
  }

  /** The selection mode. */
  get mode(): SelectionMode {
    return this.options.mode();
  }

  /** Whether the selected item can't be unselected (single mode). */
  get required(): boolean {
    return this.mode === 'single' && Boolean(this.options.required?.());
  }

  /** The selected items. */
  get selectedItems(): T[] {
    return this.items.filter((item) => this.isSelected(item));
  }

  /** The index of the first selected item, or -1. */
  get selectedIndex(): number {
    return this.items.findIndex((item) => this.isSelected(item));
  }

  /** The indices of all selected items. */
  get selectedIndices(): number[] {
    return this.items.flatMap((item, i) => (this.isSelected(item) ? [i] : []));
  }

  /** The value of the first selected item, or `''`. */
  get value(): string {
    const item = this.selectedItems[0];
    return item ? this.valueOf(item) : '';
  }

  /** The values of the selected items. */
  get values(): string[] {
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
  setValues(values: readonly string[]) {
    const single = this.mode !== 'multiple';
    let found = false;
    for (const item of this.items) {
      const on: boolean = values.includes(this.valueOf(item)) && !(single && found);
      found ||= on;
      this.apply(item, on);
    }
    this.finish(null);
  }

  /** Selects or unselects an item. Programmatic: no events. */
  select(item: T, selected = true) {
    if (!this.items.includes(item)) return;
    if (selected && this.mode === 'single') {
      for (const other of this.items) this.apply(other, other === item);
    } else {
      this.apply(item, selected);
    }
    this.finish(null);
  }

  /** Unselects every item. Programmatic: no events. */
  clear() {
    for (const item of this.items) this.apply(item, false);
    this.finish(null);
  }

  /**
   * What the user does to an item (click, Space, Enter): selects it, or
   * toggles it as the mode and `required` say. Dispatches `input` and
   * `change` when the selection changed. Returns whether it changed.
   */
  activate(item: T): boolean {
    const items = this.items;
    const index = items.indexOf(item);
    if (index < 0 || !this.canSelect(item)) return false;
    const before = items.map((i) => this.isSelected(i));
    const rules = {mode: this.mode, required: this.required};
    const after = nextSelection(
      before,
      index,
      rules,
      items.map((i) => this.canSelect(i)),
    );
    if (after.every((value, i) => value === before[i])) return false;
    after.forEach((value, i) => this.apply(items[i], value));
    this.finish(item);
    const from = this.options.eventsFrom ?? 'host';
    for (const type of this.options.events ?? ['input', 'change']) {
      const make = (bubbles: boolean) =>
        type === 'input'
          ? new InputEvent('input', {bubbles, composed: bubbles})
          : new Event('change', {bubbles});
      if (from === 'both') item.dispatchEvent(make(false));
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
  normalize(preferred?: T) {
    const items = this.items;
    const before = items.map((i) => this.isSelected(i));
    const after = normalizeSelection(
      before,
      {mode: this.mode, required: this.required && this.options.autoSelectFirst !== false},
      {
        preferred: preferred ? items.indexOf(preferred) : undefined,
        selectable: items.map((i) => this.canSelect(i)),
      },
    );
    let changed = false;
    after.forEach((value, i) => {
      if (value !== before[i]) {
        this.apply(items[i], value);
        changed = true;
      }
    });
    this.rememberDefaults();
    if (changed) this.finish(null);
    else this.syncAria();
  }

  /** Remembers each item's current state as its default for {@link reset}. */
  rememberDefaults() {
    for (const item of this.items) {
      if (!this.defaults.has(item)) this.defaults.set(item, this.isSelected(item));
    }
  }

  /** Restores the remembered states (form reset). Programmatic: no events. */
  reset() {
    for (const item of this.items) this.apply(item, this.defaults.get(item) ?? false);
    this.finish(null);
  }

  /**
   * The form value: nothing selected is `null`; single mode is the selected
   * item's value; multiple mode is a `FormData` with one `name` entry per
   * selected item.
   */
  formValue(name: string): string | FormData | null {
    const values = this.values;
    if (!values.length) return null;
    if (this.mode !== 'multiple') return values[0];
    const data = new FormData();
    for (const value of values) data.append(name, value);
    return data;
  }

  /** Writes the ARIA attribute on every item (when `aria` is set). */
  syncAria() {
    const aria = this.options.aria;
    if (!aria) return;
    for (const item of this.items) {
      const target = this.options.ariaTarget?.(item) ?? item;
      const value = ariaSelectionValue(aria, this.isSelected(item));
      if (value === null) target.removeAttribute(`aria-${aria}`);
      else if (target.getAttribute(`aria-${aria}`) !== value) target.setAttribute(`aria-${aria}`, value);
    }
  }

  private get items() {
    return this.options.items();
  }

  private isSelected(item: T) {
    return this.options.isSelected ? this.options.isSelected(item) : Boolean((item as {selected?: boolean}).selected);
  }

  private apply(item: T, selected: boolean) {
    if (this.isSelected(item) === selected) return;
    if (this.options.setSelected) this.options.setSelected(item, selected);
    else (item as {selected?: boolean}).selected = selected;
  }

  private canSelect(item: T) {
    if (this.options.canSelect) return this.options.canSelect(item);
    const el = item as T & {disabled?: boolean; softDisabled?: boolean};
    return !el.disabled && !el.softDisabled && !el.hidden;
  }

  private valueOf(item: T) {
    return (item as {value?: string}).value ?? '';
  }

  private finish(item: T | null) {
    this.observer?.takeRecords();
    this.syncAria();
    this.options.onChange?.(item);
    // Updates a form-associated host's value before any event.
    this.host.requestUpdate();
  }

  private itemFromEvent(event: Event) {
    const path = event.composedPath();
    return this.items.find((item) => path.includes(item));
  }

  private readonly onClick = (event: MouseEvent) => {
    if (event.defaultPrevented) return;
    const item = this.itemFromEvent(event);
    if (!item || this.options.ignore?.(event, item)) return;
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
      if (!event.defaultPrevented) this.activate(item);
    });
  };

  private readonly onKeydown = (event: KeyboardEvent) => {
    if (this.options.keys !== 'controller') return;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const item = this.itemFromEvent(event);
    if (!item || this.options.ignore?.(event, item)) return;
    // Space would scroll the page.
    event.preventDefault();
    if (!event.repeat) this.activate(item);
  };

  /** Keeps the rules when items change their `selected` attribute on their own. */
  private onMutations(records: MutationRecord[]) {
    const items = this.items;
    let changed = false;
    let preferred: T | undefined;
    for (const record of records) {
      const target = record.target as T;
      if (!items.includes(target)) continue;
      changed = true;
      if (this.isSelected(target)) preferred = target;
    }
    if (!changed) return;
    this.normalize(preferred);
    this.options.onChange?.(null);
    this.host.requestUpdate();
  }
}
