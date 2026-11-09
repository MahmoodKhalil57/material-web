/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement, PropertyValues } from "lit";
import { DisclosureController } from "../shared/disclosure.js";
/** The side of a swipeable list item whose actions are revealed. */
export type ListItemRevealed = "" | "leading" | "trailing";
/**
 * Returns the label text of a list item: its `aria-label`, or the text of its
 * default slot content (children without a `slot`).
 *
 * @param item The list item.
 * @return The item's label text.
 */
export declare function getListItemLabel(item: Element): string;
/** Fired (not composed) on an item whose `checked` changed. */
export declare const LIST_ITEM_CHECKED_EVENT = "list-item-checked-change";
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement, import("../../../behaviors/element-internals.js").WithElementInternals>>;
/**
 * A Material Design list item component.
 *
 * M3 Expressive interactions:
 * - **Expand**: set `expandable` and slot nested items into `nested`. Clicking
 *   the item toggles `expanded` and fires `toggle`.
 * - **Reorder**: set `reorderable` (or `reorderable` on the parent
 *   `md-gb-list`) to show a drag handle. The list handles dragging. Tapping
 *   the handle grabs the item without dragging and shows move up / move down
 *   buttons (single-pointer alternative, WCAG 2.5.7); tap the handle again to
 *   drop it.
 * - **Reveal**: slot icon buttons into `leading-actions` / `trailing-actions`.
 *   Swipe the item to reveal them; the last trailing action is the primary
 *   action that a full swipe triggers. A "more" button on the item reveals
 *   and hides the actions with a tap (spec Lists > Accessibility > Swipe: a
 *   single-pointer alternative); set `no-reveal-button` when the app offers
 *   another one. Keyboard: Left/Right arrow keys reveal the actions and focus
 *   them, Escape closes; focusing an action (Tab or a screen reader) also
 *   reveals it.
 *
 * @slot - Used to display the item's primary label.
 * @slot avatar - Used to display a circular avatar before the item's content.
 * @slot leading - Used to display icons and content before the item's main content.
 * @slot overline - Used to display overline text above the main label.
 * @slot supporting-text - Used to display supporting text below the main label.
 * @slot trailing-text - Used to display metadata or text after the item's main content.
 * @slot trailing - Used to display icons and content after the item's main content.
 * @slot nested - Nested items or content an `expandable` item reveals.
 * @slot leading-actions - Buttons revealed by swiping toward the end.
 * @slot trailing-actions - Buttons revealed by swiping toward the start. The
 *     last one is the primary action.
 * @csspart list-item - The list item's root element.
 * @csspart drag-handle - The reorder drag handle.
 * @csspart move-up - The button that moves a grabbed item up.
 * @csspart move-down - The button that moves a grabbed item down.
 * @csspart reveal-button - The "more" button that reveals the swipe actions.
 * @csspart actions - The container of the revealed actions.
 * @csspart nested - The expandable region of nested content.
 * @fires toggle - When the user expands or collapses an `expandable` item
 *     (`ToggleEvent`).
 * @fires reveal-change - When the user reveals or hides the swipe actions.
 * @cssprop --container-height
 * @cssprop --container-color
 * @cssprop --container-shape
 * @cssprop --label-text-color
 * @cssprop --label-text
 * @cssprop --label-text-tracking
 * @cssprop --leading-space
 * @cssprop --trailing-space
 * @cssprop --between-space
 * @cssprop --top-space
 * @cssprop --bottom-space
 * @cssprop --density-step - Height removed per density step (set `density` on `md-gb-list`).
 * @cssprop --avatar-size
 * @cssprop --avatar-shape
 * @cssprop --avatar-color
 * @cssprop --avatar-label
 * @cssprop --avatar-label-axes
 * @cssprop --avatar-label-tracking
 * @cssprop --avatar-label-color
 * @cssprop --leading-icon-color
 * @cssprop --leading-icon-size
 * @cssprop --trailing-icon-color
 * @cssprop --trailing-icon-size
 * @cssprop --overline
 * @cssprop --overline-axes
 * @cssprop --overline-tracking
 * @cssprop --overline-color
 * @cssprop --supporting-text
 * @cssprop --supporting-text-axes
 * @cssprop --supporting-text-tracking
 * @cssprop --supporting-text-color
 * @cssprop --trailing-supporting-text
 * @cssprop --trailing-supporting-text-axes
 * @cssprop --trailing-supporting-text-tracking
 * @cssprop --trailing-supporting-text-color
 */
export declare class ListItemElement extends baseClass {
    /** @nocollapse */
    static shadowRootOptions: {
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    constructor();
    /**
     * Whether the list item is selected.
     */
    checked: boolean;
    /**
     * Whether the item shows a selection checkbox (hover, or whenever
     * `selectionVisible`). Set by a `selectable` parent `md-gb-list`.
     *
     * @internal
     */
    selectable: boolean;
    /**
     * Whether the selection checkbox is always shown: the list sets it when
     * selection is the primary activity or once an item is selected
     * (selection.md, "Click"). Otherwise the checkbox shows on hover.
     *
     * @internal
     */
    selectionVisible: boolean;
    /**
     * Whether the list item is disabled.
     */
    disabled: boolean;
    /**
     * Whether the list item is non-interactive.
     */
    nonInteractive: boolean;
    /**
     * Whether the item expands to reveal the content in its `nested` slot.
     * Expandable items are always interactive.
     */
    expandable: boolean;
    /**
     * Whether an `expandable` item is expanded.
     */
    expanded: boolean;
    /**
     * Whether to show a drag handle to reorder the item within its
     * `md-gb-list`. Set by the list when the list is `reorderable`.
     */
    reorderable: boolean;
    /**
     * Whether the item is being dragged. Set by the list while reordering.
     */
    dragging: boolean;
    /**
     * The accessible label prefix of the drag handle; the item's label text is
     * appended (e.g. "Reorder Apples").
     */
    dragHandleLabel: string;
    /**
     * Whether the item is grabbed for reordering without dragging (with the
     * keyboard or a tap on the drag handle). Set by the list; shows the move up
     * and move down buttons.
     */
    grabbed: boolean;
    /**
     * The accessible label prefix of the move up button; the item's label text
     * is appended (e.g. "Move up Apples").
     */
    moveUpLabel: string;
    /**
     * The accessible label prefix of the move down button; the item's label
     * text is appended.
     */
    moveDownLabel: string;
    /**
     * Hides the "more" button that reveals the swipe actions with a tap. Only
     * set it when the app offers another single-pointer way to reach them
     * (e.g. a menu), as the spec requires one.
     */
    noRevealButton: boolean;
    /**
     * The accessible label prefix of the "more" button; the item's label text
     * is appended (e.g. "More actions Apples").
     */
    revealButtonLabel: string;
    /**
     * The side whose swipe actions are revealed, or `''` when closed.
     */
    revealed: ListItemRevealed;
    /**
     * Set by a parent `md-gb-list` to make the list a single tab stop with
     * arrow-key navigation (roving tabindex, lists.md Keyboard navigation): `0`
     * on the list's tab stop, `-1` on the other items, `null` (default) for an
     * item outside a list. While set, the item's other controls (drag handle,
     * "more" and move buttons, actions) leave the tab order and are reached
     * with Left/Right.
     */
    rovingTabIndex: number | null;
    private swiping;
    private swipedAway;
    private labelText;
    private readonly itemElement;
    private readonly dragHandle;
    private readonly revealButton;
    private readonly leadingActionsSlot;
    private readonly trailingActionsSlot;
    /** The swipe offset in logical pixels (positive reveals leading). */
    private offset;
    /** Expand and collapse of an `expandable` item (aria-expanded, inert). */
    protected readonly disclosure: DisclosureController;
    /** Swipe to reveal: drag between the closed and revealed positions. */
    private readonly swipe;
    /** Focuses the item's drag handle, if it has one. */
    focusDragHandle(): void;
    /**
     * Focuses the item itself (its primary action), or its first control when
     * the item is `static` or disabled. Used by `md-gb-list`'s arrow keys.
     */
    focusPrimary(): void;
    /**
     * The item's focusable elements in visual order (start to end): leading
     * actions, interactive `avatar`/`leading` content, the item, interactive
     * `trailing` content, the "more" button, the move up / move down buttons,
     * the drag handle and the trailing actions. Left/Right move through them.
     */
    rowElements(): HTMLElement[];
    /**
     * Reveals the swipe actions on one side.
     *
     * @param side The side to reveal.
     */
    reveal(side: "leading" | "trailing"): void;
    /** Hides the swipe actions. */
    close(): void;
    /**
     * Whether the item is an option of a selectable list: the list sets it so
     * the item has the `option` role and exposes whether it is selected.
     *
     * @internal
     */
    set option(option: boolean);
    private isOption;
    private syncOptionAria;
    protected updated(changed: PropertyValues<this>): void;
    protected render(): import("lit-html").TemplateResult<1>;
    /** The tabindex of the item's own secondary buttons. */
    private secondaryTabIndex;
    /**
     * In a list, takes slotted controls (actions, interactive leading or
     * trailing content) out of the tab order; restores them outside a list.
     */
    private readonly syncSlottedTabIndex;
    private labelFor;
    private showsRevealButton;
    private renderContent;
    private renderDragHandle;
    private renderMoveButtons;
    private renderRevealButton;
    private renderActions;
    private renderNested;
    private handleLabelSlotChange;
    private handleActionsSlotChange;
    private handleRevealButtonClick;
    private handleClick;
    private readonly handleHostKeydown;
    private handleActionsFocusIn;
    private readonly handleFocusOut;
    private hasActions;
    private actionsFor;
    private isRtl;
    private actionsWidth;
    private anchorFor;
    /** The offset of a full swipe, which triggers the primary action. */
    private fullSwipeAnchor;
    /** The swipe positions: closed, each side's actions, and a full swipe. */
    private swipeAnchors;
    /** The distance between a full swipe and the trailing actions' anchor. */
    private fullSwipeDistance;
    /** Applies the anchor a swipe (or the "more" button) settled at. */
    private settleAt;
    private finishFullSwipe;
    private revealByUser;
    private closeByUser;
    private setOffset;
}
/**
 * Whether arrow keys edit text in the element (and must not move focus).
 *
 * @param node The event target.
 * @return Whether the target is a text entry.
 */
export declare function isTextEntry(node: EventTarget | undefined): boolean;
export {};
