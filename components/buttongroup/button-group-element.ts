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
import { property, queryAssignedElements } from "lit/decorators.js";
import {
  internals,
  mixinElementInternals,
} from "../../behaviors/element-internals.js";
import { adoptStyles } from "../../styles/adopt-styles.js";
import { type ButtonElement } from "../button/button-element.js";
import "../iconbutton/md-gb-icon-button.js";
import "../menu/md-gb-menu.js";
import "../menu/md-gb-menu-item.js";
import { clampDensity, type Density } from "../shared/density.js";
import {
  OverflowController,
  overflowIcon,
  overflowStyles,
  renderOverflowMenu,
} from "../shared/overflow.js";
import { RovingFocusController } from "../shared/roving-focus.js";
import { SelectionController } from "../shared/selection.js";
import { updateClassList } from "../shared/update-class-list.js";
import {
  buttonGroupClasses,
  type ButtonGroupSelection,
  type ButtonGroupVariant,
  type ButtonGroupResizing,
  isItemSelectable,
} from "./button-group.js";

import buttonGroupStyles from "./button-group.css" with { type: "css" }; // github-only
// import buttonGroupStyles from './button-group.cssresult.js'; // google3-only

// Separate variable needed for closure.
const baseClass = mixinElementInternals(LitElement);

// spec-labels: button-groups/specs/variants, button-groups/specs/states/connected-button-group,
// spec-labels: button-groups/specs/configurations, button-groups/specs/anatomy/color,
// spec-labels: button-groups/specs/states/standard-button-group,
// spec-labels: button-groups/specs/anatomy/common-layouts, button-groups/specs/anatomy,
// spec-labels: button-groups/guidelines/anatomy
/**
 * A Material Design button group component.
 *
 * @slot - Used to display buttons.
 * @slot overflow - Replaces the default overflow button (see `overflowMenu`).
 * @fires {InputEvent} input - Fired when selection changes. --bubbles --composed
 * @fires {Event} change - Fired when selection changes. --bubbles
 * @cssprop --between-space
 * @cssprop --pressed-item-width-multiplier
 * @cssprop --motion-spring-fast-spatial
 * @cssprop --motion-spring-fast-spatial-duration
 * @cssprop --inner-corner-size
 * @cssprop --pressed-inner-corner-size
 * @cssprop --outer-corner-size
 * @cssprop --outer-corner-square-size
 * @cssprop --density-step - Button height removed per density step.
 */
export class ButtonGroupElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    buttonGroupStyles,
    overflowStyles,
    css`
      /* A group with an overflow menu stays inside its container, so buttons
         that do not fit overflow instead of widening the group. */
      :host([overflow-menu]) {
        max-inline-size: 100%;
      }
    `,
  ];

  constructor() {
    super();
    this[internals].role = "toolbar";

    // Disabled buttons don't reach the group's listeners.
    this.addEventListener("click", (event: MouseEvent): void => {
      const path = event.composedPath();
      const button = this.buttons.find((b) => path.includes(b));
      if (button && (button.disabled || button.softDisabled)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    });
  }

  /** The visual variant of the button group. */
  @property({ reflect: true }) variant: ButtonGroupVariant = "standard";

  /** The selection mode. */
  @property({ reflect: true }) selection: ButtonGroupSelection = "none";

  /** Whether selection is required in single-select mode. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Whether the button group is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The density of the buttons inside, from 0 (default) to -3. Each step down
   * removes 4px from the buttons' height (button-groups.md: "Button groups
   * adapt to the height of the buttons inside, including when density is
   * applied"); touch targets stay 48px. A button's own non-zero `density`
   * wins. Values are clamped to that range.
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

  /**
   * Whether the buttons at the trailing edge that do not fit collapse into a
   * trailing overflow menu, and come back when the group has room again
   * (button-groups.md, Adaptive design: "Buttons at the trailing edge of the
   * button group can be customized to collapse into an overflow menu at
   * smaller breakpoints, and become visible again at larger sizes."). The
   * group is as wide as its container allows: give it a width, or put it in
   * a narrower container, to make buttons overflow. Choosing a menu entry
   * clicks the original button.
   */
  @property({ type: Boolean, reflect: true, attribute: "overflow-menu" })
  overflowMenu = false;

  /**
   * How the group and its buttons resize (button-groups.md, Resizing).
   * `fixed`: every button keeps the width its own size and width give it.
   * `flexible`: the group fills the width of its container and its buttons
   * grow with it; an icon button does not stretch past its set width, and a
   * button with `resizing="fixed"` keeps its width. A button with
   * `resizing="flexible"` in a fixed group grows when the group is given
   * more width. Unset: a connected group is flexible (it spans its
   * surface), a standard group is fixed.
   */
  @property({ reflect: true }) resizing: ButtonGroupResizing = "";

  /**
   * Buttons that do not fit hide, last first, and the menu entries click
   * them (shared OverflowController).
   */
  protected readonly overflowing = new OverflowController(this, {
    items: () => this.buttons,
    container: () => this,
    trigger: () =>
      (this.renderRoot
        ?.querySelector<HTMLSlotElement>("slot[name=overflow]")
        ?.assignedElements({ flatten: true })[0] as HTMLElement | undefined) ??
      null,
    menu: () =>
      this.renderRoot?.querySelector<HTMLElement>(".overflow-menu") ?? null,
    enabled: () => this.overflowMenu,
  });

  @queryAssignedElements({ flatten: true })
  private readonly assignedElementsList!: HTMLElement[];

  private readonly groupDisabledButtons = new WeakSet<HTMLElement>();

  /**
   * The selection model (shared SelectionController): none, single (with
   * `required`) or multiple, selected by click and Space/Enter, `input` and
   * `change` events for user changes. The buttons are toggle buttons that
   * would toggle themselves, so the controller claims the click.
   */
  // spec: button-groups/accessibility/keyboard-navigation
  private readonly selectionModel = new SelectionController<ButtonElement>(this, {
    items: () => this.buttons,
    mode: () => this.selection,
    required: () => this.required,
    canSelect: isItemSelectable,
    claimClicks: () => this.selection !== "none",
    // Listeners on a button itself get the events too.
    eventsFrom: "both",
  });

  /** Returns all child `md-gb-button` elements. */
  get buttons(): ButtonElement[] {
    return this.assignedElementsList.filter(
      (node): node is ButtonElement => node.localName === "md-gb-button",
    );
  }

  /** Returns currently selected buttons. */
  get selectedButtons(): ButtonElement[] {
    return this.selectionModel.selectedItems;
  }

  /** Returns index of first selected button or -1. */
  get selectedIndex(): number {
    return this.selectionModel.selectedIndex;
  }

  /** Returns indices of all selected buttons. */
  get selectedIndices(): number[] {
    return this.selectionModel.selectedIndices;
  }

  /** Value of the currently selected button (or first selected). */
  get value(): string {
    return this.selectionModel.value;
  }

  /** Silent setter for single-select mode. */
  set value(val: string) {
    if (this.selection !== "single") return;
    this.selectionModel.setValues([val]);
    this.selectionModel.normalize();
  }

  /** Values of all currently selected buttons. */
  get values(): string[] {
    return this.selectionModel.values;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    adoptStyles(this, buttonGroupStyles);
    updateClassList(
      this,
      buttonGroupClasses({
        variant: this.variant,
        disabled: this.disabled,
        density: this.density,
      }),
    );
  }

  protected override firstUpdated(
    changedProperties: PropertyValues<this>,
  ): void {
    super.firstUpdated(changedProperties);
    this.syncButtonsDisabledAndType();
    this.selectionModel.normalize();
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    if (!this.hasAttribute("focusgroup")) {
      this.setAttribute("focusgroup", "toolbar wrap inline");
    }

    if (
      changedProperties.has("variant") ||
      changedProperties.has("disabled") ||
      changedProperties.has("density")
    ) {
      updateClassList(
        this,
        buttonGroupClasses({
          variant: this.variant,
          disabled: this.disabled,
          density: this.density,
        }),
      );
    }

    if (
      changedProperties.has("selection") ||
      changedProperties.has("disabled")
    ) {
      this.syncButtonsDisabledAndType();
    }

    if (
      changedProperties.has("selection") ||
      changedProperties.has("required")
    ) {
      this.selectionModel.normalize();
    }
  }

  private syncButtonsDisabledAndType(): void {
    const buttons = this.buttons;
    for (const button of buttons) {
      const hasHref = button.hasAttribute("href") || Boolean(button.href);
      if (!hasHref) {
        const targetType = this.selection === "none" ? "button" : "toggle";
        button.setAttribute("type", targetType);
      }

      if (this.disabled) {
        if (!button.disabled) {
          this.groupDisabledButtons.add(button);
          button.disabled = true;
        }
      } else {
        if (this.groupDisabledButtons.has(button)) {
          this.groupDisabledButtons.delete(button);
          button.disabled = false;
        }
      }
    }
  }

  /**
   * Arrow keys move focus between the buttons (button-groups.md, Keyboard
   * navigation: "Arrow keys | Navigate inside the component"). Left/Right
   * follow the reading direction (mirrored in RTL) and wrap, like the
   * `focusgroup="toolbar wrap inline"` the group also declares (Chromium does
   * not ship `focusgroup`, so the shared RovingFocusController implements it).
   * Every button stays in the tab order ("Tab | Navigate between buttons").
   * Disabled buttons are skipped; soft-disabled ones stay focusable.
   */
  // spec: button-groups/accessibility/keyboard-navigation
  protected readonly rovingFocus = new RovingFocusController(this, {
    items: () => this.buttons,
    orientation: "horizontal",
    homeEnd: false,
    tabStops: "all",
  });

  protected handleSlotChange(): void {
    this.syncButtonsDisabledAndType();
    this.selectionModel.normalize();
    this.overflowing.refresh();
  }

  protected override render() {
    return html`<slot @slotchange=${this.handleSlotChange}></slot
      ><slot name="overflow"
        >${this.overflowMenu
          ? html`<md-gb-icon-button
              class="overflow-trigger"
              aria-label="More buttons"
              >${overflowIcon}</md-gb-icon-button
            >`
          : nothing}</slot
      >${renderOverflowMenu(this.overflowing)}`;
  }
}
