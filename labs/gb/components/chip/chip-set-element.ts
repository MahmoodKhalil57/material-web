/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { CSSResultOrNative, html, isServer, LitElement } from "lit";
import { property, queryAssignedElements } from "lit/decorators.js";
import { clampDensity, type Density } from "../shared/density.js";
import { RovingFocusController } from "../shared/roving-focus.js";
import { ChipElement } from "./chip-element.js";
import { styles as chipSetStyles } from "./chip-set.cssresult.js";

/**
 * A Material Design chip set (`md-gb-chip-set`): a group of `md-gb-chip`s.
 *
 * Chips are laid out in a row with the spec's 8dp space between them and
 * wrap onto more lines, or scroll horizontally in one line with
 * `single-line`.
 *
 * Keyboard (spec: accessibility, keyboard navigation): the set is a single
 * tab stop. Left / Right (mirrored in RTL) move focus between chips, and
 * between a chip's primary action and its remove button; Home / End focus
 * the first / last chip. Disabled chips are skipped (soft-disabled chips
 * stay focusable). When the focused chip is removed, focus moves to the
 * chip that takes its place, or the previous one.
 *
 * Semantics (spec: labeling elements, role on the web): the set is a `grid`
 * with one row and each chip a `gridcell` (unless it has its own `role`).
 * Give the set an `aria-label`.
 *
 * @slot - The chips.
 * @cssprop --chip-set-space - The space between chips and between lines.
 * @cssprop --chip-set-overflow-inset - Room kept for touch targets and focus
 *   rings when a single-line set clips its overflow.
 */
export class ChipSetElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [chipSetStyles];

  /** Keep the chips on one line and scroll horizontally instead of wrapping. */
  @property({ type: Boolean, reflect: true, attribute: "single-line" })
  singleLine = false;

  /**
   * The density of the chips, from 0 (default) to -3: each step down removes
   * 4px from the chips' height. A chip's own non-zero `density` wins. Values
   * are clamped to that range.
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

  /** The chips in the set. */
  get chips(): ChipElement[] {
    return this.childElements.filter(
      (child): child is ChipElement => child instanceof ChipElement,
    );
  }

  @queryAssignedElements({ flatten: true })
  private readonly childElements!: HTMLElement[];

  private readonly internals =
    // Cast needed for closure
    (this as HTMLElement).attachInternals();

  /** Index of the focused chip while it is being removed. */
  private removedFocusIndex = -1;

  /**
   * Left / Right (mirrored in RTL), Home / End, wrapping, one tab stop
   * (shared RovingFocusController). Moving backwards enters a chip at its
   * remove button; a chip moves between its own primary action and remove
   * button itself before the set gets the key.
   */
  // spec: chips/accessibility/keyboard-navigation
  protected readonly rovingFocus = new RovingFocusController(this, {
    items: () => this.chips,
    orientation: "horizontal",
    canFocus: (chip) => this.isFocusable(chip as ChipElement),
    focusItem: (chip, direction) =>
      (chip as ChipElement).focus({ trailing: direction < 0 }),
  });

  constructor() {
    super();
    if (!isServer) {
      this.internals.role = "grid";
      this.addEventListener("update-focus", () => this.rovingFocus.sync());
      // Capture: record the focused chip before a `remove` listener on the
      // chip itself takes it out of the DOM.
      this.addEventListener("remove", this.handleRemove, { capture: true });
    }
  }

  protected override render() {
    return html`<div role="row">
      <slot @slotchange=${this.handleSlotChange}></slot>
    </div>`;
  }

  private isFocusable(chip: ChipElement) {
    return !chip.disabled && !chip.hidden;
  }

  private focusChip(chip: ChipElement) {
    this.rovingFocus.focus(chip);
  }

  private readonly handleRemove = (event: Event) => {
    const chips = this.chips;
    const index = chips.findIndex((chip) =>
      chip.contains(event.target as Node),
    );
    this.removedFocusIndex =
      index >= 0 && chips[index].matches(":focus-within") ? index : -1;
  };

  private handleSlotChange() {
    const { chips } = this;
    for (const chip of chips) {
      if (!chip.hasAttribute("role")) {
        chip.setAttribute("role", "gridcell");
      }
    }

    const index = this.removedFocusIndex;
    this.removedFocusIndex = -1;
    const activeChip = chips.some((chip) => chip.matches(":focus-within"));
    if (index >= 0 && !activeChip) {
      // The focused chip was removed: focus the chip now at its index (the
      // next one), else the nearest previous one.
      const next =
        chips.slice(index).find((chip) => this.isFocusable(chip)) ??
        chips
          .slice(0, index)
          .reverse()
          .find((chip) => this.isFocusable(chip));
      if (next) {
        this.focusChip(next);
        return;
      }
    }
    this.rovingFocus.sync();
  }
}
