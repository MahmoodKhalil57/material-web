/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
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
export declare function nextSelection(selected: readonly boolean[], index: number, rules: SelectionRules, selectable?: readonly boolean[]): boolean[];
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
export declare function normalizeSelection(selected: readonly boolean[], rules: SelectionRules, options?: NormalizeOptions): boolean[];
/**
 * The value of the ARIA attribute for a selected state, or null when the
 * attribute should be removed (`aria-current` is only present on the current
 * item, with the value `page`).
 */
export declare function ariaSelectionValue(aria: SelectionAria, selected: boolean): string | null;
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
export declare class SelectionController<T extends HTMLElement = HTMLElement> implements ReactiveController {
    private readonly host;
    private readonly options;
    private readonly defaults;
    private observer;
    constructor(host: ReactiveControllerHost & HTMLElement, options: SelectionOptions<T>);
    /** The selection mode. */
    get mode(): SelectionMode;
    /** Whether the selected item can't be unselected (single mode). */
    get required(): boolean;
    /** The selected items. */
    get selectedItems(): T[];
    /** The index of the first selected item, or -1. */
    get selectedIndex(): number;
    /** The indices of all selected items. */
    get selectedIndices(): number[];
    /** The value of the first selected item, or `''`. */
    get value(): string;
    /** The values of the selected items. */
    get values(): string[];
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdated(): void;
    /**
     * Selects the items with these values (only the first match in single
     * mode), unselecting the others. Programmatic: no events.
     */
    setValues(values: readonly string[]): void;
    /** Selects or unselects an item. Programmatic: no events. */
    select(item: T, selected?: boolean): void;
    /** Unselects every item. Programmatic: no events. */
    clear(): void;
    /**
     * What the user does to an item (click, Space, Enter): selects it, or
     * toggles it as the mode and `required` say. Dispatches `input` and
     * `change` when the selection changed. Returns whether it changed.
     */
    activate(item: T): boolean;
    /**
     * Makes the selection consistent with the mode and `required`. Call it
     * after the items or the rules change. Programmatic: no events.
     *
     * @param preferred The item to keep when single mode finds several selected.
     */
    normalize(preferred?: T): void;
    /** Remembers each item's current state as its default for {@link reset}. */
    rememberDefaults(): void;
    /** Restores the remembered states (form reset). Programmatic: no events. */
    reset(): void;
    /**
     * The form value: nothing selected is `null`; single mode is the selected
     * item's value; multiple mode is a `FormData` with one `name` entry per
     * selected item.
     */
    formValue(name: string): string | FormData | null;
    /** Writes the ARIA attribute on every item (when `aria` is set). */
    syncAria(): void;
    private get items();
    private isSelected;
    private apply;
    private canSelect;
    private valueOf;
    private finish;
    private itemFromEvent;
    private readonly onClick;
    private readonly onKeydown;
    /** Keeps the rules when items change their `selected` attribute on their own. */
    private onMutations;
}
