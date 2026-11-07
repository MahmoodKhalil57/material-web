/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  CSSResultOrNative,
  html,
  LitElement,
  nothing,
  PropertyValues,
} from "lit";
import { property, query } from "lit/decorators.js";
import {
  internals,
  mixinElementInternals,
} from "../../../behaviors/element-internals.js";

import listStyles from "./list.css" with { type: "css" }; // github-only
// import {styles as listStyles} from './list.cssresult.js'; // google3-only

import { DragGesture } from "../shared/drag-gesture.js";
import { isRtl, nextFocusIndex } from "../shared/roving-focus.js";
import {
  LIST_ITEM_CLASSES,
  type ListDensity,
  clampListDensity,
  list,
} from "./list.js";
import {
  getListItemLabel,
  isTextEntry,
  LIST_ITEM_CHECKED_EVENT,
  ListItemElement,
} from "./list-item-element.js";

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
export const LIST_REORDER_MESSAGES: ListReorderMessages = {
  grabbed: (label, position, total) =>
    `${label}, grabbed. Current position ${position} of ${total}. ` +
    "Press the up and down arrow keys to move, Space to drop, " +
    "or Escape to cancel.",
  moved: (label, position, total) =>
    `${label}, moved to position ${position} of ${total}.`,
  dropped: (label, position, total) =>
    `${label}, dropped. Final position ${position} of ${total}.`,
  cancelled: (label, position, total) =>
    `Reorder cancelled. ${label} returned to position ${position} of ${total}.`,
};

/**
 * Fired on the list when the user drops an item at a new position.
 *
 * The list moves the item in the DOM unless the event is cancelled with
 * `preventDefault()`, in which case the list keeps (or restores) the original
 * order so that the app can update its data and re-render instead.
 */
export class ListReorderEvent extends Event {
  static readonly type = "reorder";

  constructor(
    /** The item's original index. */
    readonly from: number,
    /** The item's new index. */
    readonly to: number,
    /** The reordered item. */
    readonly item: HTMLElement,
  ) {
    super(ListReorderEvent.type, { bubbles: true, cancelable: true });
  }
}

declare global {
  interface HTMLElementEventMap {
    itemselectionchange: ListSelectionChangeEvent;
    reorder: ListReorderEvent;
  }
}

interface PointerDrag {
  pointerId: number;
  item: HTMLElement;
  items: HTMLElement[];
  rects: DOMRect[];
  from: number;
  to: number;
  startY: number;
  hostTop: number;
  /** Whether the pointer moved past the slop (a drag, not a tap). */
  moved: boolean;
  /** Whether a long press and drag (`DragGesture`) drives it, not a handle. */
  gesture?: boolean;
}

interface KeyboardDrag {
  item: HTMLElement;
  from: number;
}

/**
 * How long a press must be held to select an item (Android
 * `ViewConfiguration` long press timeout, which Compose's
 * `combinedClickable` uses).
 */
export const LIST_LONG_PRESS_MS = 400;

/** Pointer travel that cancels a pending long press (drag slop). */
export const LIST_LONG_PRESS_SLOP_PX = 8;

/**
 * Fired on the list when the user changes which items are selected with a
 * long press, a long press and drag, or a tap in selection mode.
 */
export class ListSelectionChangeEvent extends Event {
  static readonly type = "itemselectionchange";

  constructor(
    /** The selected items, in list order. */
    readonly selected: HTMLElement[],
  ) {
    super(ListSelectionChangeEvent.type, { bubbles: true });
  }
}

/** A press on an item that may become a long press (and drag). */
interface LongPress {
  pointerId: number;
  item: HTMLElement;
  startX: number;
  startY: number;
  timer?: ReturnType<typeof setTimeout>;
  /** Set once the press was held: dragging now selects a range. */
  active: boolean;
  anchor: number;
  /** Each item's selection before the drag, restored outside the range. */
  before: boolean[];
}

// Separate variable needed for closure.
const baseClass = mixinElementInternals(LitElement);

// spec-labels: lists/specs/configurations/styles
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
export class ListElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    listStyles,
    css`
      :host {
        display: flex;
        position: relative;
      }
      .list {
        flex: 1;
      }
      .list-drop-zone {
        inset-inline: 0;
      }
      .list-drop-zone[hidden] {
        display: none;
      }
    `,
  ];

  constructor() {
    super();
    this[internals].role = "list";
    this.addEventListener("pointerdown", this.handlePointerDown);
    this.addEventListener("pointermove", this.handlePointerMove);
    this.addEventListener("pointerup", this.handlePointerUp);
    this.addEventListener("pointercancel", this.handlePointerCancel);
    this.addEventListener("keydown", this.handleKeydown);
    this.addEventListener("focusout", this.handleFocusOut);
    this.addEventListener("pointerdown", this.handleSelectPointerDown);
    this.addEventListener("pointermove", this.handleSelectPointerMove);
    this.addEventListener("pointerup", this.handleSelectPointerUp);
    this.addEventListener("pointercancel", this.handleSelectPointerCancel);
    this.addEventListener("click", this.handleSelectClick, true);
    this.addEventListener(LIST_ITEM_CHECKED_EVENT, this.handleItemChecked);
    this.addEventListener("contextmenu", this.handleContextMenu);
    this.addEventListener("click", this.handleMoveButtonClick);
    this.addEventListener("keydown", this.handleNavigationKeydown);
    this.addEventListener("focusin", this.handleNavigationFocusIn);
    this.addEventListener("focusout", this.handleNavigationFocusOut);
  }

  /**
   * Whether to render the list with segmented items.
   */
  @property({ type: Boolean }) segmented = false;

  /**
   * Whether the items can be reordered. Shows a drag handle on every item.
   */
  @property({ type: Boolean, reflect: true }) reorderable = false;

  /**
   * Whether selecting is the list's primary activity: a `selectable` list then
   * always shows the selection checkboxes (on desktop).
   */
  @property({ type: Boolean, reflect: true, attribute: "selection-primary" })
  selectionPrimary = false;

  /**
   * Whether the user can select several items with a long press (and drag),
   * and by tapping them while in selection mode.
   */
  @property({ type: Boolean, reflect: true }) selectable = false;

  /**
   * The density, from 0 (default) to -3. Each step down removes 4px from the
   * items' height (spec foundations Density: "decreasing the top and bottom
   * padding or overall height by 4dp"). Values are clamped to that range.
   * Like `md-gb-segmented-button-set`'s `density`.
   */
  @property({ type: Number, reflect: true })
  get density(): ListDensity {
    return this.densityValue;
  }
  set density(density: number) {
    const old = this.densityValue;
    this.densityValue = clampListDensity(Number(density));
    this.requestUpdate("density", old);
  }
  private densityValue: ListDensity = 0;

  /**
   * Whether a `selectable` list is in selection mode (an item is selected):
   * taps select or unselect items instead of activating them.
   */
  get selectionMode(): boolean {
    return this.selectable && this.items.some(isChecked);
  }

  /** The selected (`checked`) items. */
  get selectedItems(): HTMLElement[] {
    return this.items.filter(isChecked);
  }

  /**
   * The screen reader announcements made while reordering.
   */
  @property({ attribute: false })
  reorderMessages: ListReorderMessages = LIST_REORDER_MESSAGES;

  @query("slot") private readonly slotElement!: HTMLSlotElement | null;
  @query(".list-drop-zone") private readonly dropZone!: HTMLElement | null;
  @query(".list-live-region") private readonly liveRegion!: HTMLElement | null;

  private pointerDrag: PointerDrag | null = null;
  private longPress: LongPress | null = null;
  private suppressNextClick = false;
  private keyboardDrag: KeyboardDrag | null = null;
  private movingItem = false;
  /** A press on the handle of the grabbed item: a tap drops it. */
  private tapDropPointer: number | null = null;
  /** The item a long press picked up and the press' start (client y). */
  private pressedItem: HTMLElement | null = null;
  private pickedUp: { item: HTMLElement; startY: number } | null = null;
  private readonly reorderGesture = new DragGesture(this, {
    axis: "y",
    longPress: LIST_LONG_PRESS_MS,
    slop: LIST_LONG_PRESS_SLOP_PX,
    canStart: (event) => this.canLongPressReorder(event),
    onLongPress: (event) => {
      const item = this.pressedItem;
      if (!item) return;
      this.pickedUp = { item, startY: event.clientY };
      setDragging(item, true);
      this.addEventListener("touchmove", preventDefault, { passive: false });
    },
    onStart: (event) => {
      const picked = this.pickedUp;
      if (!picked) return;
      this.beginPointerDrag(picked.item, event.pointerId, picked.startY, true);
    },
    onMove: (delta) => {
      if (this.pointerDrag?.gesture) this.movePointerDrag(delta, true);
    },
    onEnd: () => {
      if (this.pointerDrag?.gesture) this.endPointerDrag(true);
      this.releasePickedUp();
    },
    onCancel: () => {
      if (this.pointerDrag?.gesture) this.endPointerDrag(false);
      this.releasePickedUp();
    },
  });
  /** Items whose `rovingTabIndex` the list set. */
  private readonly managedItems = new Set<ListItemElement>();

  /** The list's items (its slotted elements). */
  get items(): HTMLElement[] {
    return (this.slotElement?.assignedElements({ flatten: true }) ?? []).filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.reorderGesture.cancel();
  }

  protected override updated(changed: PropertyValues<this>) {
    if (changed.has("reorderable")) {
      this.syncReorderable(true);
    }
    if (changed.has("selectionPrimary")) this.syncSelectionMode();
    if (changed.has("selectable")) {
      this.syncSelectionMode();
      this.syncListboxRoles();
      if (!this.selectable) this.cancelLongPress();
    }
  }

  protected override render() {
    return html`${
        this.reorderable
          ? html`<div
              part="drop-zone"
              class="list-drop-zone"
              aria-hidden="true"
              hidden
            ></div>`
          : nothing
      }
      <div part="list" class="${list(this)}">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
      <div
        class="list-live-region"
        aria-live="assertive"
        aria-atomic="true"
      ></div>`;
  }

  /**
   * On the web a selectable list is a `listbox` of `option`s that expose
   * whether they are selected; a list that isn't selectable keeps the plain
   * list roles (lists.md, Labeling elements). The accessible label of the
   * list should describe the type of selection.
   */
  private syncListboxRoles() {
    this[internals].role = this.selectable ? "listbox" : "list";
    this[internals].ariaMultiSelectable = this.selectable ? "true" : null;
    for (const item of this.navigationItems()) {
      item.option = this.selectable;
      item.selectable = this.selectable;
    }
  }

  private handleSlotChange() {
    this.syncListboxRoles();
    this.syncReorderable(false);
    this.syncSelectionMode();
    this.syncTabStops();
    // Items that just upgraded render their controls after this.
    void Promise.all(
      this.items.map((item) => (item as Partial<LitElement>).updateComplete),
    ).then(() => {
      this.syncTabStops();
    });
  }

  /** The `md-gb-list-item`s whose tab order the list manages. */
  private navigationItems(): ListItemElement[] {
    return this.items.filter(
      (el): el is ListItemElement => el instanceof ListItemElement,
    );
  }

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
  private syncTabStops(leaving = false) {
    const items = this.navigationItems();
    for (const item of this.managedItems) {
      if (!items.includes(item)) {
        item.rovingTabIndex = null;
        this.managedItems.delete(item);
      }
    }
    const focusable = items.filter(canFocus);
    const focused = leaving
      ? undefined
      : items.find((item) => item.matches(":focus-within"));
    // Focus enters on the selected item when the list has one ("The first
    // element in a list should always receive focus, unless the list has a
    // selected element"), else on the first (Tab) or last (Shift+Tab) item.
    const selected = focusable.find(isChecked);
    const stops = focused
      ? [focused]
      : selected
        ? [selected]
        : [focusable[0], focusable[focusable.length - 1]];
    for (const item of items) {
      this.managedItems.add(item);
      item.rovingTabIndex = stops.includes(item) ? 0 : -1;
    }
  }

  private readonly handleNavigationFocusIn = () => {
    this.syncTabStops();
  };

  private readonly handleNavigationFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && this.contains(next)) return;
    this.syncTabStops(true);
  };

  /**
   * Arrow keys move focus between the items (lists.md, Keyboard navigation):
   * Down and Right to the next item, Up and Left to the previous one,
   * wrapping at either end. Left/Right are mirrored in RTL, and first move
   * through an item's own controls (its actions, drag handle...), which the
   * item handles. Home and End go to the first and last item.
   */
  private readonly handleNavigationKeydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || this.pointerDrag) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const path = event.composedPath();
    // A nested list handles its own items.
    if (path.find((node) => node instanceof ListElement) !== this) return;
    if (isTextEntry(path[0])) return;
    const items = this.navigationItems().filter(canFocus);
    const current = items.findIndex((item) => path.includes(item));
    if (current < 0) return;
    // Shared roving focus movement (both axes, wrapping, RTL-aware).
    // spec: lists/accessibility/keyboard-navigation, lists-35bc03
    const to = nextFocusIndex(items.length, current, event.key, {
      rtl: isRtl(this),
    });
    if (to < 0) return;
    event.preventDefault();
    items[to].focusPrimary();
  };

  /** Reflects selection mode as `selection-mode` (for styling). */
  private syncSelectionMode() {
    const mode = this.selectionMode;
    this.toggleAttribute("selection-mode", mode);
    // Checkboxes show on every item once one is selected, or always when
    // selection is the primary activity; otherwise on hover (CSS).
    const visible = this.selectable && (mode || this.selectionPrimary);
    for (const item of this.navigationItems()) item.selectionVisible = visible;
  }

  /** A `checked` change by the app: the other items' checkboxes follow. */
  private readonly handleItemChecked = () => {
    this.syncSelectionMode();
  };

  /** The selectable item an event came from, or null. */
  private findSelectableItem(event: Event) {
    if (!this.selectable) return null;
    const path = event.composedPath();
    // Drag handles and swipe actions keep their own gestures.
    const inControl = path.some(
      (node) =>
        node instanceof HTMLElement &&
        (node.classList.contains(LIST_ITEM_CLASSES.listItemDragHandle) ||
          node.classList.contains(LIST_ITEM_CLASSES.listItemMoveButton) ||
          node.classList.contains(LIST_ITEM_CLASSES.listItemRevealButton) ||
          node.matches('[slot$="-actions"]')),
    );
    if (inControl) return null;
    const item = this.items.find((el) => path.includes(el));
    if (!item || !("checked" in item)) return null;
    if (item.hasAttribute("disabled") || item.hasAttribute("static")) {
      return null;
    }
    return item;
  }

  private readonly handleSelectPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary) return;
    if (this.pointerDrag || this.keyboardDrag || this.longPress) return;
    const item = this.findSelectableItem(event);
    if (!item) return;
    const items = this.items;
    const press: LongPress = {
      pointerId: event.pointerId,
      item,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      anchor: items.indexOf(item),
      before: items.map(isChecked),
    };
    press.timer = setTimeout(() => {
      this.startLongPress(press);
    }, LIST_LONG_PRESS_MS);
    this.longPress = press;
  };

  /** The press was held: select the item and start a drag selection. */
  private startLongPress(press: LongPress) {
    if (this.longPress !== press) return;
    press.active = true;
    this.suppressNextClick = true;
    try {
      this.setPointerCapture(press.pointerId);
    } catch {
      // The pointer may already be released.
    }
    // Touch: stop the page from scrolling while dragging the selection.
    this.addEventListener("touchmove", preventDefault, { passive: false });
    this.selectRange(press, press.anchor);
  }

  private readonly handleSelectPointerMove = (event: PointerEvent) => {
    const press = this.longPress;
    if (!press || event.pointerId !== press.pointerId) return;
    if (!press.active) {
      const moved = Math.hypot(
        event.clientX - press.startX,
        event.clientY - press.startY,
      );
      if (moved > LIST_LONG_PRESS_SLOP_PX) this.cancelLongPress();
      return;
    }
    event.preventDefault();
    const index = this.itemIndexAt(event.clientY);
    if (index >= 0) this.selectRange(press, index);
  };

  private readonly handleSelectPointerUp = (event: PointerEvent) => {
    const press = this.longPress;
    if (!press || event.pointerId !== press.pointerId) return;
    this.cancelLongPress();
  };

  private readonly handleSelectPointerCancel = (event: PointerEvent) => {
    const press = this.longPress;
    if (!press || event.pointerId !== press.pointerId) return;
    this.cancelLongPress();
  };

  /** A long press opens no context menu on items it selects. */
  private readonly handleContextMenu = (event: Event) => {
    if (this.longPress?.active || this.suppressNextClick || this.pickedUp) {
      event.preventDefault();
    }
  };

  private cancelLongPress() {
    const press = this.longPress;
    if (!press) return;
    clearTimeout(press.timer);
    this.longPress = null;
    this.removeEventListener("touchmove", preventDefault);
    if (press.active) {
      try {
        this.releasePointerCapture(press.pointerId);
      } catch {
        // Already released.
      }
    }
  }

  /** In selection mode, a tap toggles the item instead of activating it. */
  private readonly handleSelectClick = (event: MouseEvent) => {
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const item = this.findSelectableItem(event);
    if (!item) return;
    // A tap on the checkbox, or on the avatar (a selection shortcut), selects
    // the item even when no item is selected yet.
    const shortcut = event
      .composedPath()
      .some(
        (node) =>
          node instanceof HTMLElement &&
          (node.classList.contains("list-item-select-checkbox") ||
            node.slot === "avatar"),
      );
    if (!this.selectionMode && !shortcut) return;
    event.preventDefault();
    event.stopPropagation();
    setChecked(item, !isChecked(item));
    this.selectionChanged();
  };

  /** The index of the item at a viewport y coordinate, or -1. */
  private itemIndexAt(y: number) {
    const items = this.items;
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect();
      if (y >= rect.top && y < rect.bottom) return i;
    }
    if (!items.length) return -1;
    if (y < items[0].getBoundingClientRect().top) return 0;
    return items.length - 1;
  }

  /**
   * Selects the items between the long-pressed item and `index`; items
   * outside the range return to their selection before the drag.
   */
  private selectRange(press: LongPress, index: number) {
    const items = this.items;
    const lo = Math.min(press.anchor, index);
    const hi = Math.max(press.anchor, index);
    let changed = false;
    items.forEach((item, i) => {
      if (!("checked" in item) || item.hasAttribute("disabled")) return;
      const want = i >= lo && i <= hi ? true : (press.before[i] ?? false);
      if (isChecked(item) !== want) {
        setChecked(item, want);
        changed = true;
      }
    });
    if (changed) this.selectionChanged();
  }

  private selectionChanged() {
    this.syncSelectionMode();
    const selected = this.selectedItems;
    if (this.liveRegion) {
      this.liveRegion.textContent = `${selected.length} selected`;
    }
    this.dispatchEvent(new ListSelectionChangeEvent(selected));
  }

  /** Shows or hides the drag handles of the items. */
  private syncReorderable(force: boolean) {
    if (!this.reorderable && !force) return;
    for (const item of this.items) {
      if ("reorderable" in item) {
        (item as HTMLElement & { reorderable: boolean }).reorderable =
          this.reorderable;
      }
    }
  }

  /** Finds the drag handle and item an event came from. */
  private findHandle(event: Event) {
    if (!this.reorderable) return null;
    const path = event.composedPath();
    const handle = path.find(
      (node): node is HTMLElement =>
        node instanceof HTMLElement &&
        node.classList.contains(LIST_ITEM_CLASSES.listItemDragHandle),
    );
    if (!handle || (handle as HTMLButtonElement).disabled) return null;
    const item = this.items.find((el) => path.includes(el));
    return item ? { handle, item } : null;
  }

  private readonly handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary || this.pointerDrag) return;
    const hit = this.findHandle(event);
    if (!hit) return;
    if (this.keyboardDrag) {
      if (this.keyboardDrag.item === hit.item) {
        // Tapping the grabbed item's handle drops it (on release).
        event.preventDefault();
        this.tapDropPointer = event.pointerId;
        return;
      }
      this.endKeyboardDrag(true);
    }
    event.preventDefault();
    try {
      hit.handle.setPointerCapture(event.pointerId);
    } catch {
      // The pointer may already be released.
    }
    this.beginPointerDrag(hit.item, event.pointerId, event.clientY, false);
  };

  private beginPointerDrag(
    item: HTMLElement,
    pointerId: number,
    startY: number,
    gesture: boolean,
  ) {
    const items = this.items;
    const from = items.indexOf(item);
    this.pointerDrag = {
      pointerId,
      item,
      items,
      rects: items.map((el) => el.getBoundingClientRect()),
      from,
      to: from,
      startY,
      hostTop: this.getBoundingClientRect().top,
      moved: gesture,
      gesture,
    };
    setDragging(item, true);
    this.showDropZone(this.pointerDrag);
  }

  /** Whether a press may become a long press and drag to reorder. */
  private canLongPressReorder(event: PointerEvent) {
    if (!this.reorderable || this.selectable) return false;
    if (this.pointerDrag || this.keyboardDrag) return false;
    this.pressedItem = this.reorderItemAt(event);
    return Boolean(this.pressedItem);
  }

  /** The item an event came from, unless it hit one of the item's controls. */
  private reorderItemAt(event: Event) {
    const path = event.composedPath();
    const inControl = path.some(
      (node) =>
        node instanceof HTMLElement &&
        (node.classList.contains(LIST_ITEM_CLASSES.listItemDragHandle) ||
          node.classList.contains(LIST_ITEM_CLASSES.listItemMoveButton) ||
          node.classList.contains(LIST_ITEM_CLASSES.listItemRevealButton) ||
          node.matches('[slot$="-actions"]')),
    );
    if (inControl) return null;
    const item = this.items.find((el) => path.includes(el));
    if (!item || item.hasAttribute("disabled") || item.hasAttribute("static")) {
      return null;
    }
    return item;
  }

  private releasePickedUp() {
    const picked = this.pickedUp;
    if (!picked) return;
    this.pickedUp = null;
    this.removeEventListener("touchmove", preventDefault);
    if (!this.pointerDrag) setDragging(picked.item, false);
  }

  private readonly handlePointerMove = (event: PointerEvent) => {
    const drag = this.pointerDrag;
    if (!drag || drag.gesture || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    this.movePointerDrag(event.clientY - drag.startY, false);
  };

  private movePointerDrag(dy: number, gesture: boolean) {
    const drag = this.pointerDrag;
    if (!drag || Boolean(drag.gesture) !== gesture) return;
    const { rects, from, items } = drag;
    if (!drag.moved && Math.abs(dy) <= LIST_LONG_PRESS_SLOP_PX) return;
    drag.moved = true;
    drag.item.style.translate = `0 ${dy}px`;

    // The slot under the dragged item's center.
    const center = rects[from].top + rects[from].height / 2 + dy;
    let to = from;
    for (let i = from + 1; i < rects.length; i++) {
      if (center > rects[i].top + rects[i].height / 2) to = i;
    }
    for (let i = from - 1; i >= 0; i--) {
      if (center < rects[i].top + rects[i].height / 2) to = i;
    }
    drag.to = to;

    // Neighbors between the old and new slot shift by the dragged item.
    const shift = slotSize(rects, from);
    items.forEach((el, i) => {
      let offset = 0;
      if (i > from && i <= to) offset = -shift;
      if (i < from && i >= to) offset = shift;
      el.style.translate =
        i === from ? el.style.translate : offset ? `0 ${offset}px` : "";
    });
    this.showDropZone(drag);
  }

  private readonly handlePointerUp = (event: PointerEvent) => {
    if (this.tapDropPointer === event.pointerId) {
      this.tapDropPointer = null;
      this.endKeyboardDrag(true);
      return;
    }
    const drag = this.pointerDrag;
    if (!drag || drag.gesture || event.pointerId !== drag.pointerId) return;
    if (!drag.moved) {
      // A tap on the handle: grab the item to move it with its move up /
      // move down buttons (single-pointer alternative to dragging).
      this.endPointerDrag(false);
      (
        drag.item as HTMLElement & { focusDragHandle?: () => void }
      ).focusDragHandle?.();
      this.grab(drag.item);
      return;
    }
    this.endPointerDrag(true);
  };

  private readonly handlePointerCancel = (event: PointerEvent) => {
    if (this.tapDropPointer === event.pointerId) this.tapDropPointer = null;
    const drag = this.pointerDrag;
    if (!drag || drag.gesture || event.pointerId !== drag.pointerId) return;
    this.endPointerDrag(false);
  };

  private endPointerDrag(commit: boolean) {
    const drag = this.pointerDrag;
    if (!drag) return;
    this.pointerDrag = null;
    if (this.dropZone) this.dropZone.hidden = true;
    const to = commit ? drag.to : drag.from;
    const before = this.measure();
    for (const el of drag.items) el.style.translate = "";
    setDragging(drag.item, false);
    let moved = false;
    if (to !== drag.from) {
      moved = this.dispatchEvent(
        new ListReorderEvent(drag.from, to, drag.item),
      );
      if (moved) this.moveItem(drag.item, to);
    }
    this.animateFrom(before);
    if (moved) {
      this.announce("dropped", drag.item);
    }
  }

  private showDropZone(drag: PointerDrag) {
    const zone = this.dropZone;
    if (!zone) return;
    const { rects, from, to } = drag;
    const rect = rects[from];
    const top = to > from ? rects[to].bottom - rect.height : rects[to].top;
    zone.hidden = false;
    zone.style.top = `${rect.top - drag.hostTop}px`;
    zone.style.height = `${rect.height}px`;
    zone.style.translate = `0 ${top - rect.top}px`;
  }

  /** Grabs an item to move it with the keyboard or its move buttons. */
  private grab(item: HTMLElement) {
    this.keyboardDrag = { item, from: this.items.indexOf(item) };
    setDragging(item, true);
    item.toggleAttribute("grabbed", true);
    this.announce("grabbed", item);
  }

  /** Moves the grabbed item when its move up / move down button is clicked. */
  private readonly handleMoveButtonClick = (event: MouseEvent) => {
    const drag = this.keyboardDrag;
    if (!drag) return;
    const path = event.composedPath();
    const button = path.find(
      (node): node is HTMLButtonElement =>
        node instanceof HTMLElement &&
        node.classList.contains(LIST_ITEM_CLASSES.listItemMoveButton),
    );
    if (!button || button.disabled || !path.includes(drag.item)) return;
    const index = this.items.indexOf(drag.item);
    const up = button.classList.contains(LIST_ITEM_CLASSES.listItemMoveUp);
    this.keyboardMove(index + (up ? -1 : 1));
  };

  private readonly handleKeydown = (event: KeyboardEvent) => {
    const hit = this.findHandle(event);
    const grabbed = this.keyboardDrag;
    if (
      !hit &&
      grabbed &&
      event.key === "Escape" &&
      event.composedPath().includes(grabbed.item)
    ) {
      // Escape from a move button cancels too.
      event.preventDefault();
      event.stopPropagation();
      this.endKeyboardDrag(false);
      (
        grabbed.item as HTMLElement & { focusDragHandle?: () => void }
      ).focusDragHandle?.();
      return;
    }
    if (!hit || this.pointerDrag) return;
    const drag = this.keyboardDrag;
    if (!drag) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        this.grab(hit.item);
      }
      return;
    }
    if (drag.item !== hit.item) return;
    const items = this.items;
    const index = items.indexOf(drag.item);
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        this.keyboardMove(index - 1);
        break;
      case "ArrowDown":
        event.preventDefault();
        this.keyboardMove(index + 1);
        break;
      case "Home":
        event.preventDefault();
        this.keyboardMove(0);
        break;
      case "End":
        event.preventDefault();
        this.keyboardMove(items.length - 1);
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        this.endKeyboardDrag(true);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        this.endKeyboardDrag(false);
        break;
      default:
        break;
    }
  };

  private readonly handleFocusOut = (event: FocusEvent) => {
    // Moving focus away drops the grabbed item where it is; moving it to the
    // item's own move buttons does not.
    const drag = this.keyboardDrag;
    if (!drag || this.movingItem) return;
    const next = event.relatedTarget as Node | null;
    if (next && (next === drag.item || drag.item.contains(next))) return;
    this.endKeyboardDrag(true);
  };

  private keyboardMove(index: number) {
    const drag = this.keyboardDrag;
    if (!drag) return;
    const items = this.items;
    const to = Math.max(0, Math.min(items.length - 1, index));
    if (to === items.indexOf(drag.item)) return;
    const before = this.measure();
    this.moveItem(drag.item, to);
    this.animateFrom(before);
    this.announce("moved", drag.item);
  }

  private endKeyboardDrag(commit: boolean) {
    const drag = this.keyboardDrag;
    if (!drag) return;
    this.keyboardDrag = null;
    this.tapDropPointer = null;
    setDragging(drag.item, false);
    drag.item.toggleAttribute("grabbed", false);
    const to = this.items.indexOf(drag.item);
    let restore = !commit;
    if (commit && to !== drag.from) {
      restore = !this.dispatchEvent(
        new ListReorderEvent(drag.from, to, drag.item),
      );
    }
    if (restore && to !== drag.from) {
      const before = this.measure();
      this.moveItem(drag.item, drag.from);
      this.animateFrom(before);
    }
    this.announce(commit ? "dropped" : "cancelled", drag.item);
  }

  /**
   * Moves an item to an index, keeping focus on the item's control that had
   * it (its drag handle or a move button).
   */
  private moveItem(item: HTMLElement, to: number) {
    const others = this.items.filter((el) => el !== item);
    const hadFocus = item.matches(":focus-within");
    const focused = item.shadowRoot?.activeElement as HTMLElement | null;
    this.movingItem = true;
    try {
      if (to < others.length) {
        others[to].before(item);
      } else if (others.length) {
        others[others.length - 1].after(item);
      }
      if (focused?.isConnected) {
        focused.focus();
      } else if (hadFocus) {
        (
          item as HTMLElement & { focusDragHandle?: () => void }
        ).focusDragHandle?.();
      }
    } finally {
      this.movingItem = false;
    }
    // The first and last items may have changed.
    this.syncTabStops();
  }

  private measure() {
    return new Map(
      this.items.map((el) => [el, el.getBoundingClientRect().top]),
    );
  }

  /** Animates items from their measured positions to where they are now. */
  private animateFrom(before: Map<HTMLElement, number>) {
    for (const el of this.items) {
      const top = before.get(el);
      if (top === undefined) continue;
      const delta = top - el.getBoundingClientRect().top;
      if (!delta) continue;
      el.style.transition = "none";
      el.style.translate = `0 ${delta}px`;
      void el.offsetWidth;
      el.style.transition = "";
      el.style.translate = "";
    }
  }

  private announce(message: keyof ListReorderMessages, item: HTMLElement) {
    if (!this.liveRegion) return;
    const items = this.items;
    this.liveRegion.textContent = this.reorderMessages[message](
      getListItemLabel(item),
      items.indexOf(item) + 1,
      items.length,
    );
  }
}

/** The distance between the starts of an item and its neighbor. */
function slotSize(rects: DOMRect[], index: number) {
  const rect = rects[index];
  const gap =
    index + 1 < rects.length
      ? rects[index + 1].top - rect.bottom
      : index > 0
        ? rect.top - rects[index - 1].bottom
        : 0;
  return rect.height + gap;
}

function isChecked(item: HTMLElement) {
  return Boolean((item as HTMLElement & { checked?: boolean }).checked);
}

function setChecked(item: HTMLElement, checked: boolean) {
  (item as HTMLElement & { checked: boolean }).checked = checked;
}

function preventDefault(event: Event) {
  event.preventDefault();
}

/** Marks an item as dragged, synchronously (for the CSS that follows it). */
function setDragging(item: HTMLElement, dragging: boolean) {
  item.toggleAttribute("dragging", dragging);
}

/** Whether a list item can take focus (it has a focusable control). */
function canFocus(item: ListItemElement) {
  return item.hasUpdated ? item.rowElements().length > 0 : !item.disabled;
}
