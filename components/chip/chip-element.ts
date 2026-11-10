/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  CSSResultOrNative,
  html,
  isServer,
  LitElement,
  nothing,
  PropertyValues,
} from "lit";
import { property, query, state } from "lit/decorators.js";
import { safeHref } from "../../internal/directives/safe-href.js";
import { redispatchEvent } from "../../internal/events/redispatch-event.js";
import { clampDensity, type Density } from "../shared/density.js";
import focusRingStyles from "../focus/focus-ring.cssresult.js";
import rippleStyles from "../ripple/ripple.cssresult.js";
import {
  CHIP_CLASSES,
  chip,
  type ChipColor,
  type ChipType,
  specChipType,
} from "./chip.js";
import { styles as chipStyles } from "./chip.cssresult.js";
// spec-labels: chips/guidelines/anatomy, chips/guidelines/usage/variants, chips/specs/assist-chip, chips/specs/suggestion-chip, chips/specs/filter-chip, chips/specs/input-chip
// spec-labels: chips/specs/assist-chip/assist-chip-measurements, chips/specs/suggestion-chip/suggestion-chip-measurements, chips/specs/filter-chip/filter-chip-measurements, chips/specs/input-chip/input-chip-measurements

/**
 * A Material Design chip (`md-gb-chip`): an assist, filter, input or
 * suggestion chip.
 *
 * - Assist chips (`type="assist"`, the default) perform an action; with
 *   `href` they are links.
 * - Filter chips (`type="filter"`) toggle `selected` and show a checkmark
 *   when selected.
 * - Input chips (`type="input"`) represent user input; add `removable` for a
 *   remove button, and an avatar in the `icon` slot (`class="chip-avatar"`
 *   or an `<img>`). Add `editable` to let people correct the text (an
 *   email address, say): the first click or Enter selects the chip, a second
 *   interaction on the selected chip (or a double click) turns it back into
 *   a text string to edit. Enter or leaving the field commits, Escape
 *   cancels. A chip with only a remove icon (no label, icon or avatar) is
 *   one focusable element, the remove button.
 * - Suggestion chips (`type="suggestion"`) offer dynamic suggestions.
 *
 * Assist, filter and suggestion chips are flat (outlined) unless `elevated`.
 *
 * @slot - The chip label text.
 * @slot icon - An optional leading icon, or an avatar (`class="chip-avatar"`
 *     or an `<img>`; input chips).
 * @slot trailing-icon - An optional trailing icon (filter chips, e.g. a
 *     drop-down arrow).
 * @slot remove-icon - The remove button icon when `removable` (default: the
 *     `close` symbol).
 * @fires {Event} remove - Fired when the remove button is activated, or
 *     Backspace / Delete is pressed on a removable chip. --bubbles --composed
 * @fires {Event} change - Fired when a filter chip's selection changes.
 *     --bubbles
 * @fires {InputEvent} input - Fired when a filter chip's selection changes.
 *     --bubbles --composed
 * @fires {CustomEvent} edit - Fired when an `editable` chip's new text is
 *     committed; `detail` has `value` and `previousValue`. --bubbles
 *     --composed
 * @fires {Event} update-focus - Fired when `disabled` changes, so a chip set
 *     can update its tab stop. --bubbles
 * @csspart chip - The root container element.
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height - Container height at density 0.
 * @cssprop --container-shape
 * @cssprop --label-text
 * @cssprop --label-text-color
 * @cssprop --leading-icon-color
 * @cssprop --leading-icon-size
 * @cssprop --trailing-icon-color
 * @cssprop --trailing-icon-size
 * @cssprop --avatar-opacity
 * @cssprop --avatar-shape
 * @cssprop --avatar-size
 * @cssprop --outline-color
 * @cssprop --outline-width
 * @cssprop --leading-space
 * @cssprop --trailing-space
 * @cssprop --icon-label-space
 * @cssprop --density-step - Container height removed per density step.
 * @cssprop --target-size - The minimum touch target size, kept at any density.
 */
export class ChipElement extends LitElement {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    chipStyles,
    css`
      :host {
        display: inline-flex;
        max-inline-size: 100%;
        vertical-align: middle;
      }
      :host([hidden]) {
        display: none;
      }
      .chip {
        flex: 1;
      }
      [hidden] {
        display: none !important;
      }
      .chip-edit {
        flex: 1;
        min-inline-size: 4ch;
        margin: 0;
        border: none;
        outline: none;
        background: none;
        padding-inline: var(--leading-space, 12px) var(--trailing-space, 12px);
        color: var(--label-text-color, inherit);
        font: inherit;
      }
    `,
  ];

  /** The chip type: `assist` (default), `filter`, `input` or `suggestion`. */
  @property() type: ChipType = "assist";

  /**
   * Elevated container, for chips on images or complex backgrounds. Input
   * chips have no elevated style.
   */
  @property({ type: Boolean, reflect: true }) elevated = false;

  /** @deprecated Use `elevated`. `color="elevated"` sets the elevated style. */
  @property() color: ChipColor = "flat";

  /** Whether the filter (or input) chip is selected. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Whether the chip has a remove button (input chips). */
  @property({ type: Boolean, reflect: true }) removable = false;

  /**
   * Whether the text of an input chip can be edited (chips.md "Input chips":
   * "Input chips can support editing to change their contents, such as
   * correcting an email address"). Editing starts by interacting with the
   * chip: a second click, Enter or Space on the selected chip, or a double
   * click. Committing with Enter or by leaving the field changes the chip's
   * text and fires `edit`; Escape (or emptying the text) keeps the old text.
   */
  @property({ type: Boolean, reflect: true }) editable = false;

  /** Whether the chip is being dragged (spec dragged state elevation). */
  @property({ type: Boolean, reflect: true }) dragged = false;

  /** Whether the chip is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The value a chip set submits while the chip is selected. Defaults to the
   * label text, like a native `<option>`.
   */
  @property()
  get value(): string {
    return this.explicitValue ?? (this.label || this.textContent?.trim() || "");
  }
  set value(value: string | null) {
    const old = this.value;
    this.explicitValue = value;
    this.requestUpdate("value", old);
  }
  private explicitValue: string | null = null;

  /** Whether the chip's set is disabled (a disabled form fieldset). */
  @property({ attribute: false }) groupDisabled = false;

  /** Disabled by itself or by its set. */
  get effectivelyDisabled(): boolean {
    return this.disabled || this.groupDisabled;
  }

  /** Whether the chip is soft-disabled (`aria-disabled="true"` while preserving focusability). */
  @property({ type: Boolean, attribute: "soft-disabled", reflect: true })
  softDisabled = false;

  /**
   * The remove button's accessible label. Defaults to "Remove {chip label}"
   * (spec: the remove action is labeled separately).
   */
  @property({ attribute: "remove-label" }) removeLabel = "";

  /** The URL destination; makes an assist chip a link. */
  @property() href = "";

  /** Where to display the linked `href` URL for a link chip. */
  @property() target: "_blank" | "_parent" | "_self" | "_top" | "" = "";

  /**
   * Sets the underlying `HTMLAnchorElement`'s `rel` attribute when `href` is
   * set.
   */
  @property() rel = "";

  /**
   * Sets the underlying `HTMLAnchorElement`'s `referrerpolicy` attribute when
   * `href` is set.
   */
  @property() referrerPolicy = "";

  /**
   * The density, from 0 (default) to -3. Each step down removes 4px from the
   * container height (32px); the label and icons keep their size and the
   * touch target stays 48px (chips.md: "regardless of placement or
   * density"). Values are clamped to that range. Density 0 inherits the
   * density of an enclosing `md-gb-chip-set`.
   *
   * chips.md: don't apply density by default; let people opt in to a denser
   * layout.
   */
  @property({ type: Number, reflect: true })
  get density(): Density {
    return this.densityValue;
  }
  set density(density: number) {
    const old = this.densityValue;
    this.densityValue = clampDensity(Number(density));
    this.requestUpdate("density", old);
  }
  private densityValue: Density = 0;

  @state() private hasLeadingIcon = false;
  @state() private hasAvatar = false;
  @state() private hasTrailingIcon = false;
  @state() private label = "";
  /** Whether the remove button has focus (takes the primary action out of
   * the tab order, so Shift+Tab leaves the chip). */
  @state() private removeFocused = false;
  @state() private editing = false;
  @query(".chip-edit") private readonly editInput!: HTMLInputElement | null;

  /** Whether the chip is currently turned into a text string for editing. */
  get isEditing(): boolean {
    return this.editing;
  }

  @query(".chip-action, .chip:not(div)")
  private readonly primaryAction!: HTMLElement | null;
  @query(".chip-remove") private readonly removeAction!: HTMLElement | null;

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener("keydown", this.handleActionNavigation);
      this.addEventListener("dblclick", () => this.startEdit());
    }
  }

  /**
   * Focuses the chip's primary action, or its remove button with
   * `{trailing: true}` (chip set navigation backwards into a chip).
   */
  override focus(options?: FocusOptions & { trailing?: boolean }) {
    if (this.effectivelyDisabled) return;
    if (options?.trailing && this.removeAction) {
      this.removeAction.focus(options);
      return;
    }
    if (this.primaryAction) {
      this.primaryAction.focus(options);
      return;
    }
    super.focus(options);
  }

  /**
   * Turns an editable input chip into a text string to edit. Does nothing
   * for other chips.
   */
  startEdit() {
    if (
      !this.editable ||
      this.editing ||
      specChipType(this.type) !== "input" ||
      this.effectivelyDisabled ||
      this.softDisabled
    ) {
      return;
    }
    // The label state follows slotchange; read the text directly in case it
    // has not fired yet.
    this.label = Array.from(this.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim() || this.label;
    this.selected = true;
    this.editing = true;
    void this.updateComplete.then(() => {
      const input = this.editInput;
      input?.focus();
      input?.select();
    });
  }

  /** Ends editing and applies the new text (empty or unchanged text keeps the old). */
  commitEdit() {
    if (!this.editing) return;
    const previousValue = this.label;
    const text = (this.editInput?.value ?? "").replace(/\s+/g, " ").trim();
    this.finishEdit();
    if (!text || text === previousValue) return;
    this.setLabelText(text);
    this.label = text;
    this.dispatchEvent(
      new CustomEvent("edit", {
        detail: { value: text, previousValue },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Ends editing and keeps the old text. */
  cancelEdit() {
    if (!this.editing) return;
    this.finishEdit();
  }

  private finishEdit() {
    const hadFocus = this.shadowRoot?.activeElement === this.editInput;
    this.editing = false;
    if (hadFocus) {
      void this.updateComplete.then(() => this.focus());
    }
  }

  /** Replaces the chip's text, keeping its icons and other children. */
  private setLabelText(text: string) {
    const texts = Array.from(this.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
    );
    if (texts.length === 0) {
      this.append(document.createTextNode(text));
      return;
    }
    texts[0].textContent = text;
    texts.slice(1).forEach((node) => node.remove());
  }

  private handleEditKeydown(event: KeyboardEvent) {
    // Keys typed in the field are the field's: not the chip set's arrow keys
    // or the chip's Backspace removal.
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      this.commitEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.cancelEdit();
    }
  }

  /**
   * An editable chip is selected by its first activation and edited by the
   * next one (chips.md: "either by selecting it or by a second interaction
   * after selection").
   */
  private handleActivate() {
    if (!this.editable || specChipType(this.type) !== "input") return;
    if (this.selected) {
      this.startEdit();
    } else {
      this.selected = true;
    }
  }

  protected override updated(changed: PropertyValues<this>) {
    if ((changed.has("disabled") && changed.get("disabled") !== undefined) ||
      (changed.has("groupDisabled") && changed.get("groupDisabled") !== undefined)) {
      this.dispatchEvent(new Event("update-focus", { bubbles: true }));
    }
  }

  private get isFilter() {
    return specChipType(this.type) === "filter";
  }

  protected override render() {
    const isFilterSelected = this.isFilter && this.selected;
    const withAvatar = this.hasAvatar && !isFilterSelected;
    const withLeadingIcon = this.hasLeadingIcon || isFilterSelected;
    const pressed = this.isFilter ? String(this.selected) : nothing;

    const chipClasses = chip({
      type: this.href ? "link" : this.type,
      elevated: this.elevated || this.color === "elevated",
      selected: this.selected,
      removable: this.removable,
      dragged: this.dragged,
      disabled: this.softDisabled || this.effectivelyDisabled,
      withLeadingIcon,
      withAvatar,
      withTrailingIcon: this.removable || this.hasTrailingIcon,
      density: this.density,
    });

    const content = this.renderContent(isFilterSelected);

    if (this.editing) {
      const editLabel = this.label ? `Edit ${this.label}` : "Edit";
      return html`<div part="chip" class="${chipClasses}">
        <input
          class="chip-edit"
          type="text"
          aria-label=${editLabel}
          .value=${this.label}
          @keydown=${this.handleEditKeydown}
          @blur=${() => this.commitEdit()}
        />
        ${this.removable ? this.renderRemoveButton() : nothing}
      </div>`;
    }

    if (
      this.removable &&
      !this.href &&
      !this.label &&
      !this.hasLeadingIcon &&
      !this.hasAvatar
    ) {
      // Only a remove icon: the whole chip is the remove button (one
      // focusable element).
      return html`<button
        part="chip"
        class="${chipClasses}"
        type="button"
        aria-label=${this.removeLabel || "Remove"}
        ?disabled=${this.effectivelyDisabled}
        aria-disabled=${this.softDisabled ? "true" : nothing}
        @click=${this.handleRemove}
        @keydown=${this.handleKeydown}
      >
        ${content}
        <span class="chip-trailing-icon" aria-hidden="true">
          <slot name="remove-icon"
            ><span class="chip-glyph">close</span></slot
          >
        </span>
      </button>`;
    }

    if (this.href || this.type === "link") {
      return html`<a
        part="chip"
        class="${chipClasses}"
        href=${safeHref(this.href)}
        target=${
          (this.target as "_blank" | "_parent" | "_self" | "_top") || nothing
        }
        rel=${this.rel || nothing}
        referrerpolicy=${this.referrerPolicy || nothing}
        aria-disabled=${this.effectivelyDisabled || this.softDisabled ? "true" : nothing}
        tabindex=${this.effectivelyDisabled && !this.softDisabled ? -1 : nothing}
        @keydown=${this.handleKeydown}
      >
        ${content}
      </a>`;
    }

    if (this.removable) {
      // Two actions: the chip content and the remove button are separate
      // focusable elements (spec: input chip remove action).
      return html`<div
        part="chip"
        class="${chipClasses}"
        @change=${this.handleChange}
      >
        <button
          class="${CHIP_CLASSES.action} focus-ring-target ripple-target"
          type="button"
          tabindex=${this.removeFocused ? -1 : nothing}
          ?disabled=${this.effectivelyDisabled}
          aria-disabled=${this.softDisabled ? "true" : nothing}
          aria-pressed=${pressed}
          @click=${this.handleActivate}
          @keydown=${this.handleKeydown}
        >
          ${content}
        </button>
        ${this.renderRemoveButton()}
      </div>`;
    }

    return html`<button
      part="chip"
      class="${chipClasses}"
      type="button"
      ?disabled=${this.effectivelyDisabled}
      aria-disabled=${this.softDisabled ? "true" : nothing}
      aria-pressed=${pressed}
      @click=${this.handleActivate}
      @keydown=${this.handleKeydown}
      @change=${this.handleChange}
    >
      ${content}
    </button>`;
  }

  private renderContent(isFilterSelected: boolean) {
    const showLeading = this.hasLeadingIcon || isFilterSelected;
    // Icons and images are decorative (spec: hide image); the label names
    // the chip.
    return html`
      <span class="chip-icon" aria-hidden="true" ?hidden=${!showLeading}>
        ${
          isFilterSelected
            ? html`<span class="chip-glyph chip-checkmark">check</span>`
            : nothing
        }
        <slot
          name="icon"
          ?hidden=${isFilterSelected}
          @slotchange=${this.handleIconSlotChange}
        ></slot>
      </span>
      <span class="chip-label"
        ><slot @slotchange=${this.handleLabelSlotChange}></slot
      ></span>
      <span
        class="chip-trailing-icon"
        aria-hidden="true"
        ?hidden=${!this.hasTrailingIcon}
      >
        <slot
          name="trailing-icon"
          @slotchange=${this.handleTrailingIconSlotChange}
        ></slot>
      </span>
    `;
  }

  private renderRemoveButton() {
    const label =
      this.removeLabel || (this.label ? `Remove ${this.label}` : "Remove");
    return html`<button
      class="${CHIP_CLASSES.remove} focus-ring-outer"
      type="button"
      aria-label=${label}
      tabindex="-1"
      ?disabled=${this.effectivelyDisabled}
      aria-disabled=${this.softDisabled ? "true" : nothing}
      @focus=${this.handleRemoveFocus}
      @blur=${this.handleRemoveBlur}
      @click=${this.handleRemove}
    >
      <slot name="remove-icon" aria-hidden="true"
        ><span class="chip-glyph">close</span></slot
      >
    </button>`;
  }

  private handleIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const elements = slot.assignedElements({ flatten: true });
    this.hasLeadingIcon = elements.length > 0;
    this.hasAvatar = elements.some(
      (el) =>
        el.classList.contains("chip-avatar") ||
        el.hasAttribute("avatar") ||
        el.localName === "img",
    );
  }

  private handleTrailingIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasTrailingIcon = slot.assignedElements({ flatten: true }).length > 0;
  }

  private handleLabelSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    // A slot that render() removed (editing) reports its nodes as gone.
    if (!slot.isConnected) return;
    this.label = slot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  }

  private handleChange(event: Event) {
    const root = event.target as HTMLElement;
    const toggle =
      root.querySelector<HTMLElement>(`:scope > .${CHIP_CLASSES.action}`) ??
      root;
    this.selected = toggle.ariaPressed === "true";
    redispatchEvent(this, event);
  }

  private handleKeydown(event: KeyboardEvent) {
    // Spec keyboard navigation: Backspace or Delete removes the focused
    // input chip.
    if (
      this.removable &&
      (event.key === "Backspace" || event.key === "Delete")
    ) {
      event.preventDefault();
      this.remove_();
    }
  }

  /**
   * Left / Right (mirrored in RTL) move focus between the primary action and
   * the remove button, like the legacy multi-action chip. Moving past either
   * end is left to the chip set.
   */
  private readonly handleActionNavigation = (event: KeyboardEvent) => {
    const isLeft = event.key === "ArrowLeft";
    const isRight = event.key === "ArrowRight";
    const { primaryAction, removeAction } = this;
    if ((!isLeft && !isRight) || !primaryAction || !removeAction) return;

    const isRtl = getComputedStyle(this).direction === "rtl";
    const forwards = isRtl ? isLeft : isRight;
    const active = this.shadowRoot!.activeElement;
    if (
      (forwards && active === removeAction) ||
      (!forwards && active === primaryAction)
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    (forwards ? removeAction : primaryAction).focus();
  };

  private handleRemoveFocus() {
    this.removeFocused = true;
  }

  private handleRemoveBlur() {
    this.removeFocused = false;
  }

  private handleRemove(event: Event) {
    event.stopPropagation();
    this.remove_();
  }

  private remove_() {
    if (this.effectivelyDisabled || this.softDisabled) return;
    this.dispatchEvent(new Event("remove", { bubbles: true, composed: true }));
  }
}
