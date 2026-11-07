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
const VELOCITY_THRESHOLD_PX_PER_MS = 0.125;
// Android ViewConfiguration touch slop (8dp): movement before a press becomes
// a swipe.
const TOUCH_SLOP_PX = 8;
// Pointer samples used to estimate the fling velocity.
const VELOCITY_WINDOW_MS = 100;
// --md-sys-motion-spring-default-spatial-duration, the settle motion.
const SETTLE_MS = 420;

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

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(mixinElementInternals(LitElement));

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
        align-items: inherit;
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
        :has(.has-slotted, .list-item-expand-icon)
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
    this.addEventListener("pointerdown", this.handlePointerDown);
    this.addEventListener("pointermove", this.handlePointerMove);
    this.addEventListener("pointerup", this.handlePointerUp);
    this.addEventListener("pointercancel", this.handlePointerCancel);
    this.addEventListener("keydown", this.handleHostKeydown);
    this.addEventListener("focusout", this.handleFocusOut);
  }

  /**
   * Whether the list item is selected.
   */
  @property({ type: Boolean }) checked = false;

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
  private gesture: {
    pointerId: number;
    startX: number;
    startY: number;
    startOffset: number;
    active: boolean;
    samples: Array<{ t: number; x: number }>;
  } | null = null;
  private suppressClick = false;
  private fullSwipeTimeout?: ReturnType<typeof setTimeout>;

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

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.fullSwipeTimeout);
  }

  protected override updated(changed: PropertyValues<this>) {
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
      classes: { "list-item-has-actions": this.hasActions() },
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
        aria-expanded=${expandable ? String(this.expanded) : nothing}
        aria-controls=${expandable ? "nested" : nothing}
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
      ?inert=${!this.expanded}
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
    if (this.suppressClick) {
      // The click that ends a swipe gesture.
      this.suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (this.revealed) {
      // Tapping a swiped item puts it back.
      event.stopImmediatePropagation();
      this.closeByUser();
      return;
    }
    if (this.expandable && !this.disabled) {
      const oldState = this.expanded ? "open" : "closed";
      this.expanded = !this.expanded;
      const newState = this.expanded ? "open" : "closed";
      this.dispatchEvent(new ToggleEvent("toggle", { newState, oldState }));
    }
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
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
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
    const row = this.rowElements();
    const current = row.findIndex((el) => path.includes(el));
    if (current < 0) return;
    const forward = (event.key === "ArrowRight") !== this.isRtl();
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
    if (!this.revealed || this.gesture) return;
    if (next && (this.contains(next) || this.shadowRoot?.contains(next))) {
      return;
    }
    this.closeByUser();
  };

  private readonly handlePointerDown = (event: PointerEvent) => {
    this.suppressClick = false;
    if (!this.hasActions() || this.disabled) return;
    if (event.button !== 0 || !event.isPrimary) return;
    const item = this.itemElement;
    if (!item || !event.composedPath().includes(item)) return;
    clearTimeout(this.fullSwipeTimeout);
    this.gesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: this.offset,
      active: false,
      samples: [{ t: event.timeStamp, x: event.clientX }],
    };
  };

  private readonly handlePointerMove = (event: PointerEvent) => {
    const gesture = this.gesture;
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (!gesture.active) {
      if (Math.abs(dy) > TOUCH_SLOP_PX && Math.abs(dy) >= Math.abs(dx)) {
        // A vertical scroll, not a swipe.
        this.gesture = null;
        return;
      }
      if (Math.abs(dx) <= TOUCH_SLOP_PX) return;
      gesture.active = true;
      gesture.startX = event.clientX;
      this.swiping = true;
      try {
        this.itemElement?.setPointerCapture(event.pointerId);
      } catch {
        // The pointer may already be released.
      }
    }
    event.preventDefault();
    gesture.samples.push({ t: event.timeStamp, x: event.clientX });
    while (
      gesture.samples.length > 2 &&
      event.timeStamp - gesture.samples[0].t > VELOCITY_WINDOW_MS
    ) {
      gesture.samples.shift();
    }
    const logical =
      gesture.startOffset +
      (event.clientX - gesture.startX) * (this.isRtl() ? -1 : 1);
    this.setOffset(this.clampOffset(logical));
  };

  private readonly handlePointerUp = (event: PointerEvent) => {
    const gesture = this.gesture;
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    this.gesture = null;
    if (!gesture.active) return;
    this.suppressClick = true;
    this.swiping = false;
    const first = gesture.samples[0];
    const last = gesture.samples[gesture.samples.length - 1];
    const dt = last.t - first.t;
    const velocity =
      dt > 0 ? ((last.x - first.x) / dt) * (this.isRtl() ? -1 : 1) : 0;
    this.settle(this.computeTarget(this.offset, velocity, gesture.startOffset));
  };

  private readonly handlePointerCancel = (event: PointerEvent) => {
    const gesture = this.gesture;
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    this.gesture = null;
    if (!gesture.active) return;
    this.swiping = false;
    this.setOffset(this.anchorFor(this.revealed));
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

  private clampOffset(offset: number) {
    const min = this.fullSwipeAnchor() ?? 0;
    const max = this.actionsWidth("leading");
    return Math.min(max, Math.max(min, offset));
  }

  /**
   * Picks the anchor a released swipe settles at, like Compose's
   * AnchoredDraggable: a fast fling goes to the next anchor in its direction,
   * otherwise the item must travel the positional threshold past an anchor.
   */
  private computeTarget(offset: number, velocity: number, from: number) {
    const full = this.fullSwipeAnchor();
    const anchors = [
      0,
      this.anchorFor("leading"),
      this.anchorFor("trailing"),
      ...(full === undefined ? [] : [full]),
    ]
      .filter((a, i, all) => all.indexOf(a) === i)
      .sort((a, b) => a - b);
    const lower = [...anchors].reverse().find((a) => a <= offset);
    const upper = anchors.find((a) => a >= offset);
    if (lower === undefined) return upper!;
    if (upper === undefined || lower === upper) return lower;
    // A full swipe needs to cross half the remaining distance and is never
    // triggered by a fling alone.
    const toFull = full !== undefined && lower === full;
    if (!toFull && Math.abs(velocity) >= VELOCITY_THRESHOLD_PX_PER_MS) {
      return velocity > 0 ? upper : lower;
    }
    const threshold = toFull
      ? (upper - lower) / 2
      : Math.min(POSITIONAL_THRESHOLD_PX, (upper - lower) / 2);
    if (from <= lower) return offset - lower >= threshold ? upper : lower;
    if (from >= upper) return upper - offset >= threshold ? lower : upper;
    return offset - lower < upper - offset ? lower : upper;
  }

  private settle(target: number) {
    const full = this.fullSwipeAnchor();
    if (full !== undefined && target === full && full !== 0) {
      // A full swipe clears the item off-screen and triggers the primary
      // action (spec: Swipe), then the item settles back unless the action
      // removed it.
      this.setOffset(full);
      this.swipedAway = true;
      const actions = this.actionsFor("trailing");
      (actions[actions.length - 1] as HTMLElement | undefined)?.click();
      const reduceMotion = matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      this.fullSwipeTimeout = setTimeout(
        () => {
          const item = this.itemElement;
          if (item) item.style.transition = "none";
          this.revealed = "";
          this.swipedAway = false;
          this.setOffset(0);
          if (item) {
            void item.offsetWidth;
            item.style.transition = "";
          }
        },
        reduceMotion ? 0 : SETTLE_MS,
      );
      return;
    }
    const side: ListItemRevealed =
      target > 0 ? "leading" : target < 0 ? "trailing" : "";
    this.setOffset(target);
    if (side !== this.revealed) {
      this.revealed = side;
      this.dispatchEvent(new Event("reveal-change", { bubbles: true }));
    }
  }

  private revealByUser(side: "leading" | "trailing") {
    if (this.revealed === side) return;
    this.revealed = side;
    this.dispatchEvent(new Event("reveal-change", { bubbles: true }));
  }

  private closeByUser() {
    if (!this.revealed) return;
    this.revealed = "";
    this.dispatchEvent(new Event("reveal-change", { bubbles: true }));
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
