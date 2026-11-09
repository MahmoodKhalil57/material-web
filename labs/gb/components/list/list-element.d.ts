/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement, PropertyValues } from "lit";
import { type ListDensity } from "./list.js";
/**
 * Screen reader announcements while reordering. Positions are 1-based.
 */
export interface ListReorderMessages {
    /** The item was grabbed with the keyboard. */
    grabbed(label: string, position: number, total: number): string;
    /** A grabbed item was moved. */
    moved(label: string, position: number, total: number): string;
    /** The item was dropped. */
    dropped(label: string, position: number, total: number): string;
    /** The reorder was cancelled. */
    cancelled(label: string, position: number, total: number): string;
}
/** The default (English) reorder announcements. */
export declare const LIST_REORDER_MESSAGES: ListReorderMessages;
/**
 * Fired on the list when the user drops an item at a new position.
 *
 * The list moves the item in the DOM unless the event is cancelled with
 * `preventDefault()`, in which case the list keeps (or restores) the original
 * order so that the app can update its data and re-render instead.
 */
export declare class ListReorderEvent extends Event {
    /** The item's original index. */
    readonly from: number;
    /** The item's new index. */
    readonly to: number;
    /** The reordered item. */
    readonly item: HTMLElement;
    static readonly type = "reorder";
    constructor(
    /** The item's original index. */
    from: number, 
    /** The item's new index. */
    to: number, 
    /** The reordered item. */
    item: HTMLElement);
}
declare global {
    interface HTMLElementEventMap {
        itemselectionchange: ListSelectionChangeEvent;
        reorder: ListReorderEvent;
    }
}
/**
 * How long a press must be held to select an item (Android
 * `ViewConfiguration` long press timeout, which Compose's
 * `combinedClickable` uses).
 */
export declare const LIST_LONG_PRESS_MS = 400;
/** Pointer travel that cancels a pending long press (drag slop). */
export declare const LIST_LONG_PRESS_SLOP_PX = 8;
/**
 * Fired on the list when the user changes which items are selected with a
 * long press, a long press and drag, or a tap in selection mode.
 */
export declare class ListSelectionChangeEvent extends Event {
    /** The selected items, in list order. */
    readonly selected: HTMLElement[];
    static readonly type = "itemselectionchange";
    constructor(
    /** The selected items, in list order. */
    selected: HTMLElement[]);
}
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement, import("../../../behaviors/element-internals.js").WithElementInternals>;
/**
 * A Material Design list component.
 *
 * Set `reorderable` to let the user reorder the items (M3 Expressive
 * md.comp.list.reorder): each item shows a drag handle. Drag the handle with a
 * pointer, or focus it and press Space or Enter to grab the item, the up and
 * down arrow keys (or Home and End) to move it, Space or Enter to drop it, and
 * Escape to cancel. Changes are announced to screen readers.
 *
 * Single-pointer alternative to dragging (WCAG 2.5.7): tap the handle to grab
 * the item, then tap its move up / move down buttons; tap the handle again to
 * drop it (or move focus away).
 *
 * Selection checkboxes (selection.md, "Click"): in a `selectable` list every
 * item shows a checkbox for itself while the cursor hovers it, and all items
 * show one once an item is selected. Set `selection-primary` for lists whose
 * main activity is selecting: the checkboxes are then always visible. Tapping
 * an item's avatar selects it (a selection shortcut).
 *
 * Long press an item of a `reorderable` list (that is not `selectable`) and
 * drag it to move it, without using its drag handle (interaction gestures:
 * "A long press and drag allows people to reorder content").
 *
 * Set `density` (0 to -3) for denser lists (foundations Layout > Spacing >
 * Density): each step removes 4px from the item height and 2px from its top
 * and bottom padding.
 *
 * Set `selectable` for multi-selection (selection.md): long press an item to
 * select it and enter selection mode, then tap items to select or unselect
 * them; selection mode ends when no item is selected. Long press and drag
 * across items to select them in a batch. Items are selected through their
 * `checked` property.
 *
 * @slot - Used to display list items.
 * @csspart list - The list's root element.
 * @csspart drop-zone - The drop target shown while dragging.
 * @fires reorder - When the user drops an item at a new position
 *     (`ListReorderEvent` with `from`, `to` and `item`). Cancelable.
 * @fires itemselectionchange - When the user changes the selected items of a
 *     `selectable` list (`ListSelectionChangeEvent` with `selected`).
 * @cssprop --container-shape
 * @cssprop --gap
 */
export declare class ListElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    constructor();
    /**
     * Whether to render the list with segmented items.
     */
    segmented: boolean;
    /**
     * Whether the items can be reordered. Shows a drag handle on every item.
     */
    reorderable: boolean;
    /**
     * Whether selecting is the list's primary activity: a `selectable` list then
     * always shows the selection checkboxes (on desktop).
     */
    selectionPrimary: boolean;
    /**
     * Whether the user can select several items with a long press (and drag),
     * and by tapping them while in selection mode.
     */
    selectable: boolean;
    /**
     * The density, from 0 (default) to -3. Each step down removes 4px from the
     * items' height (spec foundations Density: "decreasing the top and bottom
     * padding or overall height by 4dp"). Values are clamped to that range.
     * Like `md-gb-segmented-button-set`'s `density`.
     */
    get density(): ListDensity;
    set density(density: number);
    private densityValue;
    /**
     * Whether a `selectable` list is in selection mode (an item is selected):
     * taps select or unselect items instead of activating them.
     */
    get selectionMode(): boolean;
    /** The selected (`checked`) items. */
    get selectedItems(): HTMLElement[];
    /**
     * The screen reader announcements made while reordering.
     */
    reorderMessages: ListReorderMessages;
    private readonly slotElement;
    private readonly dropZone;
    /**
     * The live region for selection and reorder announcements. It lives in the
     * document, outside the list: inside the list it would be a child of the
     * `list`/`listbox` role, which only allows items (axe
     * aria-required-children).
     */
    private liveRegion;
    private pointerDrag;
    private longPress;
    private suppressNextClick;
    private keyboardDrag;
    private movingItem;
    /** A press on the handle of the grabbed item: a tap drops it. */
    private tapDropPointer;
    /** The item a long press picked up and the press' start (client y). */
    private pressedItem;
    private pickedUp;
    private readonly reorderGesture;
    /** Items whose `rovingTabIndex` the list set. */
    private readonly managedItems;
    /** The list's items (its slotted elements). */
    get items(): HTMLElement[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected updated(changed: PropertyValues<this>): void;
    protected render(): import("lit-html").TemplateResult<1>;
    /**
     * On the web a selectable list is a `listbox` of `option`s that expose
     * whether they are selected; a list that isn't selectable keeps the plain
     * list roles (lists.md, Labeling elements). The accessible label of the
     * list should describe the type of selection.
     */
    private syncListboxRoles;
    private handleSlotChange;
    /** The `md-gb-list-item`s whose tab order the list manages. */
    private navigationItems;
    /**
     * Makes the list one tab stop (lists.md, Keyboard navigation: "Tab | To
     * move focus to the first list item, last list item, or outside of the
     * list component"). While focus is in the list only the item holding it is
     * tabbable, so Tab leaves the list; while focus is outside, the first and
     * last items are, so Tab enters at the first item and Shift+Tab at the
     * last one.
     *
     * @param leaving Whether focus is leaving the list.
     */
    private syncTabStops;
    private readonly handleNavigationFocusIn;
    private readonly handleNavigationFocusOut;
    /**
     * Arrow keys move focus between the items (lists.md, Keyboard navigation):
     * Down and Right to the next item, Up and Left to the previous one,
     * wrapping at either end. Left/Right are mirrored in RTL, and first move
     * through an item's own controls (its actions, drag handle...), which the
     * item handles. Home and End go to the first and last item.
     */
    private readonly handleNavigationKeydown;
    /** Reflects selection mode as `selection-mode` (for styling). */
    private syncSelectionMode;
    /** A `checked` change by the app: the other items' checkboxes follow. */
    private readonly handleItemChecked;
    /** The selectable item an event came from, or null. */
    private findSelectableItem;
    private readonly handleSelectPointerDown;
    /** The press was held: select the item and start a drag selection. */
    private startLongPress;
    private readonly handleSelectPointerMove;
    private readonly handleSelectPointerUp;
    private readonly handleSelectPointerCancel;
    /** A long press opens no context menu on items it selects. */
    private readonly handleContextMenu;
    private cancelLongPress;
    /** In selection mode, a tap toggles the item instead of activating it. */
    private readonly handleSelectClick;
    /** The index of the item at a viewport y coordinate, or -1. */
    private itemIndexAt;
    /**
     * Selects the items between the long-pressed item and `index`; items
     * outside the range return to their selection before the drag.
     */
    private selectRange;
    private selectionChanged;
    /** Shows or hides the drag handles of the items. */
    private syncReorderable;
    /** Finds the drag handle and item an event came from. */
    private findHandle;
    private readonly handlePointerDown;
    private beginPointerDrag;
    /** Whether a press may become a long press and drag to reorder. */
    private canLongPressReorder;
    /** The item an event came from, unless it hit one of the item's controls. */
    private reorderItemAt;
    private releasePickedUp;
    private readonly handlePointerMove;
    private movePointerDrag;
    private readonly handlePointerUp;
    private readonly handlePointerCancel;
    private endPointerDrag;
    private showDropZone;
    /** Grabs an item to move it with the keyboard or its move buttons. */
    private grab;
    /** Moves the grabbed item when its move up / move down button is clicked. */
    private readonly handleMoveButtonClick;
    private readonly handleKeydown;
    private readonly handleFocusOut;
    private keyboardMove;
    private endKeyboardDrag;
    /**
     * Moves an item to an index, keeping focus on the item's control that had
     * it (its drag handle or a move button).
     */
    private moveItem;
    private measure;
    /** Animates items from their measured positions to where they are now. */
    private animateFrom;
    private announce;
}
export {};
