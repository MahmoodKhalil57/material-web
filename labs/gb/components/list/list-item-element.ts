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
import { property, query, state } from "lit/decorators.js";
import { ARIAMixinStrict } from "../../../../internal/aria/aria.js";
import { mixinDelegatesAria } from "../../../../internal/aria/delegate.js";
import {
  internals,
  mixinElementInternals,
} from "../../../behaviors/element-internals.js";
import { DisclosureController } from "../shared/disclosure.js";
import { DragSettleController } from "../shared/drag-settle.js";
import { hasSlotted } from "../shared/has-slotted.js";

import focusRingStyles from "../focus/focus-ring.css" with { type: "css" }; // github-only
// import {styles as focusRingStyles} from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from "../ripple/ripple.css" with { type: "css" }; // github-only
// import {styles as rippleStyles} from '../ripple/ripple.cssresult.js'; // google3-only
import listStyles from "./list.css" with { type: "css" }; // github-only
// import {styles as listStyles} from './list.cssresult.js'; // google3-only

import {
  listItem,
  listItemDragHandle,
  listItemMoveButton,
  listItemRevealButton,
} from "./list.js";

/** The side of a swipeable list item whose actions are revealed. */
export type ListItemRevealed = "" | "leading" | "trailing";

// Compose SwipeToDismissBoxDefaults.positionalThreshold (56.dp): how far an
// item must be swiped past an anchor to settle at the next one.
const POSITIONAL_THRESHOLD_PX = 56;
// Compose SwipeToDismissBox DismissVelocityThreshold (125.dp per second): a
// faster fling settles at the next anchor in its direction.
const VELOCITY_THRESHOLD_PX_PER_S = 125;

/**
 * Returns the label text of a list item: its `aria-label`, or the text of its
 * default slot content (children without a `slot`).
 *
 * @param item The list item.
 * @return The item's label text.
 */
export function getListItemLabel(item: Element): string {
  const ariaLabel = item.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;
  return Array.from(item.childNodes)
    .filter((node) => !(node instanceof Element && node.hasAttribute("slot")))
    .map((node) => node.textContent ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Fired (not composed) on an item whose `checked` changed. */
export const LIST_ITEM_CHECKED_EVENT = "list-item-checked-change";

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(mixinElementInternals(LitElement));

// spec-labels: lists/guidelines/anatomy/selection-controls, lists/guidelines/anatomy, lists/specs/anatomy,
// spec-labels: lists/specs/anatomy/flexibility-slots/slot-accessibility,
// spec-labels: lists/guidelines/anatomy/leading-media/primary-secondary-actions,
// spec-labels: lists/specs/configurations/list-interactions
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
export class ListItemElement extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    listStyles,
    css`
      :host {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        align-items: center;
        position: relative;
      }
      :host([dragging]) {
        z-index: 1;
      }
      :host(:has(> [slot="leading-actions"], > [slot="trailing-actions"])) {
        overflow-x: clip;
      }
      .list-item,
      .list-item-drag-handle,
      .list-item-move-button,
      .list-item-reveal-button,
      .list-item-actions {
        grid-area: 1 / 1;
      }
      .list-item {
        position: relative;
        z-index: 1;
        align-self: stretch;
      }
      .list-item-has-actions {
        touch-action: pan-y;
      }
      .list-item-drag-handle,
      .list-item-move-button,
      .list-item-reveal-button {
        position: relative;
        z-index: 2;
        justify-self: end;
      }
      /* Trailing controls, from the end: drag handle, move down, move up,
         reveal button. */
      .list-item-move-down {
        --_control-offset: var(--reorder-handle-size, 48px);
      }
      .list-item-move-up {
        --_control-offset: calc(2 * var(--reorder-handle-size, 48px));
      }
      :host([reorderable]) .list-item-reveal-button {
        --_control-offset: var(--reorder-handle-size, 48px);
      }
      :host([reorderable][grabbed]) .list-item-reveal-button {
        --_control-offset: calc(3 * var(--reorder-handle-size, 48px));
      }
      .list-item-actions {
        align-self: stretch;
      }
      .list-item-actions:not(:has(.has-slotted)) {
        display: none;
      }
      .list-item-expand-region {
        grid-area: 2 / 1;
      }
      :is(.list-item-leading, .list-item-trailing):not(
        :has(.has-slotted, .list-item-expand-icon, .list-item-select-checkbox)
      ) {
        display: none;
      }
      slot:not(.has-slotted) {
        display: contents;
      }
    `,
  ];

  constructor() {
    super();
    this[internals].role = "listitem";
    this.addEventListener("keydown", this.handleHostKeydown);
    this.addEventListener("focusout", this.handleFocusOut);
  }

  /**
   * Whether the list item is selected.
   */
  @property({ type: Boolean }) checked = false;

  /**
   * Whether the item shows a selection checkbox (hover, or whenever
   * `selectionVisible`). Set by a `selectable` parent `md-gb-list`.
   *
   * @internal
   */
  @property({ type: Boolean, attribute: false }) selectable = false;

  /**
   * Whether the selection checkbox is always shown: the list sets it when
   * selection is the primary activity or once an item is selected
   * (selection.md, "Click"). Otherwise the checkbox shows on hover.
   *
   * @internal
   */
  @property({ type: Boolean, reflect: true, attribute: "selection-visible" })
  selectionVisible = false;

  /**
   * Whether the list item is disabled.
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * Whether the list item is non-interactive.
   */
  @property({ type: Boolean, reflect: true, attribute: "static" })
  nonInteractive = false;

  /**
   * Whether the item expands to reveal the content in its `nested` slot.
   * Expandable items are always interactive.
   */
  @property({ type: Boolean, reflect: true }) expandable = false;

  /**
   * Whether an `expandable` item is expanded.
   */
  @property({ type: Boolean, reflect: true }) expanded = false;

  /**
   * Whether to show a drag handle to reorder the item within its
   * `md-gb-list`. Set by the list when the list is `reorderable`.
   */
  @property({ type: Boolean, reflect: true }) reorderable = false;

  /**
   * Whether the item is being dragged. Set by the list while reordering.
   */
  @property({ type: Boolean, reflect: true }) dragging = false;

  /**
   * The accessible label prefix of the drag handle; the item's label text is
   * appended (e.g. "Reorder Apples").
   */
  @property({ attribute: "drag-handle-label" }) dragHandleLabel = "Reorder";

  /**
   * Whether the item is grabbed for reordering without dragging (with the
   * keyboard or a tap on the drag handle). Set by the list; shows the move up
   * and move down buttons.
   */
  @property({ type: Boolean, reflect: true }) grabbed = false;

  /**
   * The accessible label prefix of the move up button; the item's label text
   * is appended (e.g. "Move up Apples").
   */
  @property({ attribute: "move-up-label" }) moveUpLabel = "Move up";

  /**
   * The accessible label prefix of the move down button; the item's label
   * text is appended.
   */
  @property({ attribute: "move-down-label" }) moveDownLabel = "Move down";

  /**
   * Hides the "more" button that reveals the swipe actions with a tap. Only
   * set it when the app offers another single-pointer way to reach them
   * (e.g. a menu), as the spec requires one.
   */
  @property({ type: Boolean, attribute: "no-reveal-button" })
  noRevealButton = false;

  /**
   * The accessible label prefix of the "more" button; the item's label text
   * is appended (e.g. "More actions Apples").
   */
  @property({ attribute: "reveal-button-label" })
  revealButtonLabel = "More actions";

  /**
   * The side whose swipe actions are revealed, or `''` when closed.
   */
  @property({ reflect: true }) revealed: ListItemRevealed = "";

  /**
   * Set by a parent `md-gb-list` to make the list a single tab stop with
   * arrow-key navigation (roving tabindex, lists.md Keyboard navigation): `0`
   * on the list's tab stop, `-1` on the other items, `null` (default) for an
   * item outside a list. While set, the item's other controls (drag handle,
   * "more" and move buttons, actions) leave the tab order and are reached
   * with Left/Right.
   */
  @property({ attribute: false }) rovingTabIndex: number | null = null;

  @state() private swiping = false;
  @state() private swipedAway = false;
  @state() private labelText = "";

  @query(".list-item") private readonly itemElement!: HTMLElement | null;
  @query(".list-item-drag-handle")
  private readonly dragHandle!: HTMLElement | null;
  @query(".list-item-reveal-button")
  private readonly revealButton!: HTMLElement | null;
  @query('slot[name="leading-actions"]')
  private readonly leadingActionsSlot!: HTMLSlotElement | null;
  @query('slot[name="trailing-actions"]')
  private readonly trailingActionsSlot!: HTMLSlotElement | null;

  /** The swipe offset in logical pixels (positive reveals leading). */
  private offset = 0;

  /** Expand and collapse of an `expandable` item (aria-expanded, inert). */
  protected readonly disclosure = new DisclosureController(this, {
    trigger: () => this.itemElement,
    region: () => this.renderRoot.querySelector<HTMLElement>("#nested"),
    expanded: () => this.expanded,
    setExpanded: (expanded) => {
      this.expanded = expanded;
    },
    disabled: () => this.disabled,
    enabled: () => this.expandable,
  });

  /** Swipe to reveal: drag between the closed and revealed positions. */
  private readonly swipe = new DragSettleController(this, {
    axis: "x",
    // The item itself, so a press on an action never starts a swipe and the
    // click that ends a swipe is suppressed on the item only.
    target: () => this.itemElement,
    anchors: () => this.swipeAnchors(),
    value: () => this.offset,
    bounds: () => ({
      min: this.fullSwipeAnchor() ?? 0,
      max: this.actionsWidth("leading"),
    }),
    velocityThreshold: VELOCITY_THRESHOLD_PX_PER_S,
    // A full swipe needs to cross half the way to it and is never triggered
    // by a fling alone.
    positionalThreshold: (distance) => {
      const toFull = Math.abs(distance - this.fullSwipeDistance()) < 0.5;
      return toFull
        ? distance / 2
        : Math.min(POSITIONAL_THRESHOLD_PX, distance / 2);
    },
    flingAnchors: (anchors) =>
      anchors.filter((a) => a !== this.fullSwipeAnchor()),
    consumeSlop: true,
    disabled: () => this.disabled || !this.hasActions(),
    onDragStart: () => {
      this.swiping = true;
    },
    onDrag: (offset) => this.setOffset(offset),
    // The release velocity carries into a spring that moves the item, which
    // keeps its swiping state (no CSS transition on translate) until it rests.
    onFrame: (position) => this.setOffset(position),
    onSettle: (anchor) => this.settleAt(anchor),
    onCancel: (to) => {
      this.swiping = false;
      this.setOffset(to);
    },
    onSettled: () => {
      this.swiping = false;
      this.finishFullSwipe();
    },
  });

  /** Focuses the item's drag handle, if it has one. */
  focusDragHandle() {
    this.dragHandle?.focus();
  }

  /**
   * Focuses the item itself (its primary action), or its first control when
   * the item is `static` or disabled. Used by `md-gb-list`'s arrow keys.
   */
  focusPrimary() {
    const row = this.rowElements();
    const item = this.itemElement;
    (item && row.includes(item) ? item : row[0])?.focus();
  }

  /**
   * The item's focusable elements in visual order (start to end): leading
   * actions, interactive `avatar`/`leading` content, the item, interactive
   * `trailing` content, the "more" button, the move up / move down buttons,
   * the drag handle and the trailing actions. Left/Right move through them.
   */
  rowElements(): HTMLElement[] {
    const root = this.shadowRoot;
    if (!root) return [];
    const slotted = (name: string) =>
      (
        root
          .querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
          ?.assignedElements({ flatten: true }) ?? []
      ).filter(isInteractive);
    const own = (selector: string) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>(selector)).filter(
        (el) => !el.disabled,
      );
    return [
      ...slotted("leading-actions"),
      ...slotted("avatar"),
      ...slotted("leading"),
      ...own("button#item"),
      ...slotted("trailing"),
      ...own(".list-item-reveal-button"),
      ...own(".list-item-move-up"),
      ...own(".list-item-move-down"),
      ...own(".list-item-drag-handle"),
      ...slotted("trailing-actions"),
    ];
  }

  /**
   * Reveals the swipe actions on one side.
   *
   * @param side The side to reveal.
   */
  reveal(side: "leading" | "trailing") {
    this.revealed = side;
  }

  /** Hides the swipe actions. */
  close() {
    this.revealed = "";
  }

  /**
   * Whether the item is an option of a selectable list: the list sets it so
   * the item has the `option` role and exposes whether it is selected.
   *
   * @internal
   */
  set option(option: boolean) {
    this.isOption = option;
    this.syncOptionAria();
  }

  private isOption = false;

  private syncOptionAria() {
    this[internals].role = this.isOption ? "option" : "listitem";
    this[internals].ariaSelected = this.isOption ? String(this.checked) : null;
    // An option wraps its (natively disabled) button, whose state is not
    // exposed to the option's children (presentational): say it on the option.
    this[internals].ariaDisabled = this.isOption && this.disabled ? "true" : null;
  }

  protected override updated(changed: PropertyValues<this>) {
    if ((changed.has("checked") || changed.has("disabled")) && this.isOption) {
      this.syncOptionAria();
    }
    if (changed.has("checked") && changed.get("checked") !== undefined) {
      // Lets the list show or hide the checkboxes of all items.
      this.dispatchEvent(new Event(LIST_ITEM_CHECKED_EVENT, { bubbles: true }));
    }
    if (changed.has("rovingTabIndex")) this.syncSlottedTabIndex();
    if (changed.has("revealed") && !this.swiping) {
      this.setOffset(this.anchorFor(this.revealed));
    }
  }

  protected override render() {
    const expandable = this.expandable;
    const isStatic = this.nonInteractive && !expandable;
    const state = {
      checked: this.checked,
      disabled: this.disabled,
      static: isStatic,
      expandable,
      expanded: this.expanded,
      reorderable: this.reorderable,
      dragged: this.dragging,
      grabbed: this.reorderable && this.grabbed,
      revealButton: this.showsRevealButton(),
      swiped: this.revealed !== "" || this.swipedAway,
      swiping: this.swiping,
      classes: {
        "list-item-has-actions": this.hasActions(),
        "list-item-selectable": this.selectable,
        "list-item-selection-visible":
          this.selectable && (this.selectionVisible || this.checked),
      },
    };

    let item;
    if (isStatic) {
      item = html`<div
        part="list-item"
        class="${listItem(state)}"
        @click=${this.handleClick}
      >
        ${this.renderContent()}
      </div>`;
    } else {
      // Needed for closure conformance
      const { ariaLabel } = this as ARIAMixinStrict;
      item = html`<button
        id="item"
        part="list-item"
        class="${listItem(state)}"
        ?disabled=${this.disabled}
        aria-label=${ariaLabel || nothing}
        tabindex=${this.rovingTabIndex ?? nothing}
        @click=${this.handleClick}
      >
        ${this.renderContent()}
      </button>`;
    }

    return html`${item}${this.renderDragHandle()}${this.renderMoveButtons()}${this.renderRevealButton()}${this.renderActions()}${this.renderNested()}`;
  }

  /** The tabindex of the item's own secondary buttons. */
  private secondaryTabIndex() {
    return this.rovingTabIndex === null ? nothing : -1;
  }

  /**
   * In a list, takes slotted controls (actions, interactive leading or
   * trailing content) out of the tab order; restores them outside a list.
   */
  private readonly syncSlottedTabIndex = () => {
    const root = this.shadowRoot;
    if (!root) return;
    const managed = this.rovingTabIndex !== null;
    const slots = root.querySelectorAll<HTMLSlotElement>(
      'slot[name$="-actions"], slot[name="leading"], slot[name="trailing"], ' +
        'slot[name="avatar"]',
    );
    for (const slot of slots) {
      for (const el of slot.assignedElements({ flatten: true })) {
        if (managed) {
          if (!isInteractive(el) || el.hasAttribute("tabindex")) continue;
          el.setAttribute("tabindex", "-1");
          removedFromTabOrder.add(el);
        } else if (removedFromTabOrder.has(el)) {
          removedFromTabOrder.delete(el);
          el.removeAttribute("tabindex");
        }
      }
    }
  };

  private labelFor(prefix: string) {
    return [prefix, this.labelText].filter(Boolean).join(" ");
  }

  private showsRevealButton() {
    return !this.noRevealButton && this.hasActions();
  }

  private renderContent() {
    return html`
      <span class="list-item-leading">
        ${
          this.selectable
            ? html`<span
                part="select-checkbox"
                class="list-item-select-checkbox"
                aria-hidden="true"
              ></span>`
            : nothing
        }
        <slot name="avatar" class="list-item-avatar" ${hasSlotted()}></slot>
        <slot
          name="leading"
          ${hasSlotted()}
          @slotchange=${this.syncSlottedTabIndex}
        ></slot>
      </span>
      <span class="list-item-content">
        <slot name="overline" class="list-item-overline" ${hasSlotted()}></slot>
        <slot @slotchange=${this.handleLabelSlotChange}></slot>
        <slot
          name="supporting-text"
          class="list-item-supporting-text"
          ${hasSlotted()}
        ></slot>
      </span>
      <span class="list-item-trailing">
        <slot
          name="trailing-text"
          class="list-item-trailing-text"
          ${hasSlotted()}
        ></slot>
        <slot
          name="trailing"
          ${hasSlotted()}
          @slotchange=${this.syncSlottedTabIndex}
        ></slot>
        ${
          this.expandable
            ? html`<span
                class="list-item-expand-icon"
                aria-hidden="true"
              ></span>`
            : nothing
        }
      </span>
    `;
  }

  private renderDragHandle() {
    if (!this.reorderable) return nothing;
    const label = [this.dragHandleLabel, this.labelText]
      .filter(Boolean)
      .join(" ");
    return html`<button
      part="drag-handle"
      class="${listItemDragHandle()}"
      aria-label=${label}
      tabindex=${this.secondaryTabIndex()}
      ?disabled=${this.disabled}
    ></button>`;
  }

  // Single-pointer alternative to dragging: shown while the item is grabbed.
  // The list moves the item when they are clicked.
  private renderMoveButtons() {
    if (!this.reorderable || !this.grabbed) return nothing;
    return html`<button
        part="move-up"
        class="${listItemMoveButton({ direction: "up" })}"
        aria-label=${this.labelFor(this.moveUpLabel)}
        tabindex=${this.secondaryTabIndex()}
        ?disabled=${this.disabled}
      ></button
      ><button
        part="move-down"
        class="${listItemMoveButton({ direction: "down" })}"
        aria-label=${this.labelFor(this.moveDownLabel)}
        tabindex=${this.secondaryTabIndex()}
        ?disabled=${this.disabled}
      ></button>`;
  }

  // Single-pointer alternative to swiping (spec: a "more" icon).
  private renderRevealButton() {
    if (!this.showsRevealButton()) return nothing;
    return html`<button
      part="reveal-button"
      class="${listItemRevealButton()}"
      aria-label=${this.labelFor(this.revealButtonLabel)}
      aria-expanded=${String(this.revealed !== "")}
      aria-controls="actions"
      tabindex=${this.secondaryTabIndex()}
      ?disabled=${this.disabled}
      @click=${this.handleRevealButtonClick}
    ></button>`;
  }

  private renderActions() {
    return html`<div
      id="actions"
      part="actions"
      class="list-item-actions"
      @focusin=${this.handleActionsFocusIn}
      @slotchange=${this.handleActionsSlotChange}
    >
      <slot
        name="leading-actions"
        class="list-item-actions-leading"
        ${hasSlotted()}
      ></slot>
      <slot
        name="trailing-actions"
        class="list-item-actions-trailing"
        ${hasSlotted()}
      ></slot>
    </div>`;
  }

  private renderNested() {
    if (!this.expandable) return nothing;
    return html`<div
      id="nested"
      part="nested"
      class="list-item-expand-region"
      role="group"
      aria-labelledby="item"
    >
      <div class="list-item-expand-content">
        <slot name="nested"></slot>
      </div>
    </div>`;
  }

  private handleLabelSlotChange() {
    this.labelText = getListItemLabel(this);
  }

  private handleActionsSlotChange() {
    // Re-render to toggle swipe support (`touch-action`).
    this.requestUpdate();
    this.syncSlottedTabIndex();
  }

  private handleRevealButtonClick() {
    if (this.disabled) return;
    if (this.revealed) {
      this.closeByUser();
      return;
    }
    // The trailing actions hold the primary action; reveal them first.
    this.revealByUser(
      this.actionsFor("trailing").length ? "trailing" : "leading",
    );
  }

  private handleClick(event: Event) {
    // The click that ends a swipe is suppressed by the swipe's drag gesture.
    if (this.revealed) {
      // Tapping a swiped item puts it back.
      event.stopImmediatePropagation();
      this.closeByUser();
      return;
    }
    // Otherwise the click toggles an expandable item: the disclosure
    // controller listens on the same button.
  }

  private readonly handleHostKeydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) return;
    if (event.key === "Escape") {
      if (!this.revealed) return;
      event.preventDefault();
      event.stopPropagation();
      this.closeByUser();
      this.itemElement?.focus();
      return;
    }
    const vertical = event.key === "ArrowUp" || event.key === "ArrowDown";
    if (!vertical && event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const path = event.composedPath();
    // Keys from a nested list's items belong to that list.
    if (path.find((node) => node instanceof ListItemElement) !== this) return;
    if (isTextEntry(path[0])) return;
    // Left/Right move between the item's controls in visual order (mirrored
    // in RTL); focusing an action reveals it. Past either end, the parent
    // list moves to the next or previous item (lists.md, Keyboard
    // navigation: "Down and right arrow keys | Moves to the next element in
    // the list").
    const all = this.rowElements();
    // Up and Down only step through the item and its slotted actions, not
    // its drag handle, reorder or reveal buttons or swipe actions.
    const row = vertical
      ? all.filter(
          (el) =>
            !el.matches(
              ".list-item-reveal-button, .list-item-move-up, .list-item-move-down, .list-item-drag-handle",
            ) && !el.closest("[slot$='-actions']"),
        )
      : all;
    // The innermost control in the path: slotted controls sit inside the
    // item button in the flat tree.
    const origin = path.find((node) => row.includes(node as HTMLElement));
    const current = origin ? row.indexOf(origin as HTMLElement) : -1;
    if (current < 0) return;
    // Up and Down step through the actions too, in reading order ("Down and
    // Right arrow keys move focus to the next action of the list item, or to
    // the first action in the next item").
    const forward = vertical
      ? event.key === "ArrowDown"
      : (event.key === "ArrowRight") !== this.isRtl();
    const next = row[current + (forward ? 1 : -1)];
    if (!next) return;
    event.preventDefault();
    if (next === this.itemElement && this.revealed) {
      // Back on the item: put the revealed actions away.
      this.closeByUser();
    }
    next.focus();
  };

  private handleActionsFocusIn(event: FocusEvent) {
    const path = event.composedPath();
    if (this.leadingActionsSlot && path.includes(this.leadingActionsSlot)) {
      this.revealByUser("leading");
    } else if (
      this.trailingActionsSlot &&
      path.includes(this.trailingActionsSlot)
    ) {
      this.revealByUser("trailing");
    }
  }

  private readonly handleFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (!this.revealed || this.swipe.dragging) return;
    if (next && (this.contains(next) || this.shadowRoot?.contains(next))) {
      return;
    }
    this.closeByUser();
  };

  private hasActions() {
    return (
      this.actionsFor("leading").length > 0 ||
      this.actionsFor("trailing").length > 0
    );
  }

  private actionsFor(side: "leading" | "trailing"): Element[] {
    const slot =
      side === "leading" ? this.leadingActionsSlot : this.trailingActionsSlot;
    return slot?.assignedElements({ flatten: true }) ?? [];
  }

  private isRtl() {
    return getComputedStyle(this).direction === "rtl";
  }

  private actionsWidth(side: "leading" | "trailing") {
    if (!this.actionsFor(side).length) return 0;
    const slot =
      side === "leading" ? this.leadingActionsSlot : this.trailingActionsSlot;
    return slot?.getBoundingClientRect().width ?? 0;
  }

  private anchorFor(side: ListItemRevealed) {
    if (side === "leading") return this.actionsWidth("leading");
    if (side === "trailing") return -this.actionsWidth("trailing");
    return 0;
  }

  /** The offset of a full swipe, which triggers the primary action. */
  private fullSwipeAnchor() {
    return this.actionsFor("trailing").length
      ? -(this.itemElement?.offsetWidth ?? 0)
      : undefined;
  }

  /** The swipe positions: closed, each side's actions, and a full swipe. */
  private swipeAnchors() {
    const full = this.fullSwipeAnchor();
    return [
      0,
      this.anchorFor("leading"),
      this.anchorFor("trailing"),
      ...(full === undefined ? [] : [full]),
    ].filter((a, i, all) => all.indexOf(a) === i);
  }

  /** The distance between a full swipe and the trailing actions' anchor. */
  private fullSwipeDistance() {
    const full = this.fullSwipeAnchor();
    return full === undefined
      ? NaN
      : Math.abs(full - this.anchorFor("trailing"));
  }

  /** Applies the anchor a swipe (or the "more" button) settled at. */
  private settleAt(target: number) {
    const full = this.fullSwipeAnchor();
    if (full !== undefined && target === full && full !== 0) {
      // A full swipe clears the item off-screen and triggers the primary
      // action (spec: Swipe); the item then settles back unless the action
      // removed it (finishFullSwipe, after the settle motion).
      this.swipedAway = true;
      const actions = this.actionsFor("trailing");
      (actions[actions.length - 1] as HTMLElement | undefined)?.click();
      return;
    }
    const side: ListItemRevealed =
      target > 0 ? "leading" : target < 0 ? "trailing" : "";
    if (side !== this.revealed) {
      this.revealed = side;
      this.dispatchEvent(new Event("reveal-change", { bubbles: true }));
    }
  }

  private finishFullSwipe() {
    if (!this.swipedAway) return;
    const item = this.itemElement;
    if (item) item.style.transition = "none";
    this.revealed = "";
    this.swipedAway = false;
    this.setOffset(0);
    if (item) {
      void item.offsetWidth;
      item.style.transition = "";
    }
  }

  // The "more" button, focus and the keyboard reach the same positions a
  // swipe does, through the same settle (the single-pointer alternative).
  private revealByUser(side: "leading" | "trailing") {
    if (this.revealed === side) return;
    this.swipe.settleTo(this.anchorFor(side));
    if (this.revealed !== side) {
      // The actions have no width yet (not laid out): still reveal them.
      this.revealed = side;
      this.dispatchEvent(new Event("reveal-change", { bubbles: true }));
    }
  }

  private closeByUser() {
    if (!this.revealed) return;
    this.swipe.settleTo(0);
  }

  private setOffset(offset: number) {
    this.offset = offset;
    const physical = offset * (this.isRtl() ? -1 : 1);
    const translate = offset ? `${physical}px 0` : "";
    if (this.itemElement) this.itemElement.style.translate = translate;
    if (this.dragHandle) this.dragHandle.style.translate = translate;
    if (this.revealButton) this.revealButton.style.translate = translate;
  }
}

/** Slotted controls a list item took out of the tab order. */
const removedFromTabOrder = new WeakSet<Element>();

/**
 * Whether a slotted element is an interactive control: a native control, an
 * element with a tabindex (including the -1 a list item sets) or a custom
 * element that delegates focus (gb buttons, checkboxes, switches...).
 */
function isInteractive(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement) || el.hidden) return false;
  if ((el as HTMLButtonElement).disabled) return false;
  return (
    el.matches(
      "button, input, select, textarea, a[href], [tabindex], [contenteditable]",
    ) || Boolean(el.shadowRoot?.delegatesFocus)
  );
}

const NON_TEXT_INPUTS = new Set([
  "checkbox",
  "radio",
  "button",
  "submit",
  "reset",
  "image",
  "color",
  "file",
]);

/**
 * Whether arrow keys edit text in the element (and must not move focus).
 *
 * @param node The event target.
 * @return Whether the target is a text entry.
 */
export function isTextEntry(node: EventTarget | undefined) {
  if (!(node instanceof HTMLElement)) return false;
  if (node.isContentEditable || node instanceof HTMLTextAreaElement) {
    return true;
  }
  // Ranges use the arrow keys too.
  return node instanceof HTMLInputElement && !NON_TEXT_INPUTS.has(node.type);
}
