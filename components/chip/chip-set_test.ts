/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import { html } from "lit";
import { Environment } from "../../testing/environment.js";
import { internals } from "../../behaviors/element-internals.js";
import { styles as m3Styles } from "../../styles/m3.cssresult.js";
import { adoptStyles } from "../../styles/adopt-styles.js";

import { ChipElement } from "./chip-element.js";
import { ChipSetElement } from "./chip-set-element.js";
import "./md-gb-chip.js";
import "./md-gb-chip-set.js";

adoptStyles(document, [m3Styles]);

describe("<md-gb-chip-set>", () => {
  const env = new Environment();

  async function setup(template: ReturnType<typeof html>) {
    const root = env.render(template);
    const set = root.querySelector("md-gb-chip-set") as ChipSetElement;
    await env.waitForStability();
    for (const chip of set.chips) await chip.updateComplete;
    return { set, chips: set.chips };
  }

  /** The deepest focused element. */
  function activeElement() {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active;
  }

  function press(key: string) {
    activeElement()!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }

  function primary(chip: ChipElement) {
    return chip.shadowRoot!.querySelector<HTMLElement>(
      ".chip-action, .chip:not(div)",
    )!;
  }

  function removeButton(chip: ChipElement) {
    return chip.shadowRoot!.querySelector<HTMLElement>(".chip-remove")!;
  }

  const three = html`<md-gb-chip-set aria-label="Chips">
    <md-gb-chip>One</md-gb-chip>
    <md-gb-chip>Two</md-gb-chip>
    <md-gb-chip>Three</md-gb-chip>
  </md-gb-chip-set>`;

  it("returns only chip children", async () => {
    const { set } = await setup(
      html`<md-gb-chip-set>
        <div>Not a chip</div>
        <md-gb-chip>Chip</md-gb-chip>
      </md-gb-chip-set>`,
    );
    expect(set.chips.length).toBe(1);
    expect(set.chips[0].localName).toBe("md-gb-chip");
  });

  describe("layout", () => {
    it("lays chips out in a wrapping row with the spec 8dp space", async () => {
      const { set } = await setup(three);
      const style = getComputedStyle(set);
      expect(style.display).toBe("flex");
      expect(style.flexWrap).toBe("wrap");
      expect(style.columnGap).toBe("8px");
      expect(style.rowGap).toBe("8px");
    });

    it("keeps chips on one scrolling line with single-line", async () => {
      const { set } = await setup(
        html`<md-gb-chip-set single-line>
          <md-gb-chip>One</md-gb-chip>
        </md-gb-chip-set>`,
      );
      const style = getComputedStyle(set);
      expect(style.flexWrap).toBe("nowrap");
      expect(style.overflowX).toBe("auto");
    });
  });

  describe("accessibility", () => {
    it("is a grid of gridcells (spec role on the web)", async () => {
      const { set, chips } = await setup(three);
      // ElementInternals role (no host attribute).
      expect(set[internals].role).toBe("grid");
      expect(set.shadowRoot!.querySelector('[role="row"]')).not.toBeNull();
      for (const chip of chips) {
        expect(chip.getAttribute("role")).toBe("gridcell");
      }
    });

    it("keeps a role set on a chip", async () => {
      const { chips } = await setup(
        html`<md-gb-chip-set>
          <md-gb-chip role="presentation">One</md-gb-chip>
        </md-gb-chip-set>`,
      );
      expect(chips[0].getAttribute("role")).toBe("presentation");
    });
  });

  describe("navigation", () => {
    it("is one tab stop: the first chip", async () => {
      const { chips } = await setup(three);
      expect(chips.map((chip) => chip.getAttribute("tabindex"))).toEqual([
        "0",
        "-1",
        "-1",
      ]);
    });

    it("skips disabled chips for the tab stop", async () => {
      const { chips } = await setup(
        html`<md-gb-chip-set>
          <md-gb-chip disabled>One</md-gb-chip>
          <md-gb-chip>Two</md-gb-chip>
        </md-gb-chip-set>`,
      );
      expect(chips[0].tabIndex).toBe(-1);
      expect(chips[1].tabIndex).toBe(0);
    });

    it("moves the tab stop to the focused chip", async () => {
      const { chips } = await setup(three);
      chips[2].focus();
      expect(chips.map((chip) => chip.tabIndex)).toEqual([-1, -1, 0]);
    });

    it("moves focus with ArrowRight / ArrowLeft and wraps", async () => {
      const { chips } = await setup(three);
      chips[0].focus();
      press("ArrowRight");
      expect(chips[1].matches(":focus-within")).toBeTrue();
      press("ArrowLeft");
      expect(chips[0].matches(":focus-within")).toBeTrue();
      press("ArrowLeft");
      expect(chips[2].matches(":focus-within")).withContext("wraps").toBeTrue();
      press("ArrowRight");
      expect(chips[0].matches(":focus-within")).withContext("wraps").toBeTrue();
    });

    it("mirrors the arrow keys in RTL", async () => {
      const { set, chips } = await setup(three);
      set.style.direction = "rtl";
      chips[0].focus();
      press("ArrowLeft");
      expect(chips[1].matches(":focus-within")).toBeTrue();
      press("ArrowRight");
      expect(chips[0].matches(":focus-within")).toBeTrue();
    });

    it("focuses the first / last chip with Home / End", async () => {
      const { chips } = await setup(three);
      chips[1].focus();
      press("End");
      expect(chips[2].matches(":focus-within")).toBeTrue();
      press("Home");
      expect(chips[0].matches(":focus-within")).toBeTrue();
    });

    it("skips disabled chips but not soft-disabled ones", async () => {
      const { chips } = await setup(
        html`<md-gb-chip-set>
          <md-gb-chip>One</md-gb-chip>
          <md-gb-chip disabled>Two</md-gb-chip>
          <md-gb-chip soft-disabled>Three</md-gb-chip>
        </md-gb-chip-set>`,
      );
      chips[0].focus();
      press("ArrowRight");
      expect(chips[2].matches(":focus-within")).toBeTrue();
    });

    it("updates the tab stop when a chip is disabled", async () => {
      const { chips } = await setup(three);
      chips[0].disabled = true;
      await chips[0].updateComplete;
      expect(chips[0].tabIndex).toBe(-1);
      expect(chips[1].tabIndex).toBe(0);
    });

    // spec: chips-afb975
    it("moves between a chip primary action and remove button", async () => {
      const { chips } = await setup(
        html`<md-gb-chip-set>
          <md-gb-chip type="input" removable>One</md-gb-chip>
          <md-gb-chip type="input" removable>Two</md-gb-chip>
        </md-gb-chip-set>`,
      );
      chips[0].focus();
      expect(activeElement()).toBe(primary(chips[0]));
      press("ArrowRight");
      expect(activeElement()).toBe(removeButton(chips[0]));
      press("ArrowRight");
      expect(activeElement()).toBe(primary(chips[1]));
      press("ArrowLeft");
      expect(activeElement())
        .withContext("backwards enters a chip at its remove button")
        .toBe(removeButton(chips[0]));
      press("ArrowLeft");
      expect(activeElement()).toBe(primary(chips[0]));
    });

    it("keeps the remove button out of the tab order", async () => {
      const { chips } = await setup(
        html`<md-gb-chip-set>
          <md-gb-chip type="input" removable>One</md-gb-chip>
        </md-gb-chip-set>`,
      );
      expect(removeButton(chips[0]).tabIndex).toBe(-1);
      removeButton(chips[0]).focus();
      await chips[0].updateComplete;
      expect(primary(chips[0]).tabIndex)
        .withContext("Shift+Tab leaves the chip from the remove button")
        .toBe(-1);
      primary(chips[0]).focus();
      await chips[0].updateComplete;
      expect(primary(chips[0]).tabIndex).toBe(0);
    });
  });

  describe("removing chips", () => {
    async function setupRemovable() {
      return setup(
        html`<md-gb-chip-set
          @remove=${(event: Event) => (event.target as Element).remove()}
        >
          <md-gb-chip type="input" removable>One</md-gb-chip>
          <md-gb-chip type="input" removable>Two</md-gb-chip>
          <md-gb-chip type="input" removable>Three</md-gb-chip>
        </md-gb-chip-set>`,
      );
    }

    it("focuses the next chip when the focused chip is removed", async () => {
      const { set, chips } = await setupRemovable();
      chips[1].focus();
      press("Delete");
      await env.waitForStability();
      expect(set.chips.length).toBe(2);
      expect(chips[2].matches(":focus-within")).toBeTrue();
      expect(chips[2].tabIndex).toBe(0);
    });

    it("focuses the previous chip when the last chip is removed", async () => {
      const { chips } = await setupRemovable();
      chips[2].focus({ trailing: true } as FocusOptions);
      removeButton(chips[2]).click();
      await env.waitForStability();
      expect(chips[1].matches(":focus-within")).toBeTrue();
    });

    it("does not move focus when an unfocused chip is removed", async () => {
      const { chips } = await setupRemovable();
      chips[0].focus();
      chips[2].dispatchEvent(new Event("remove", { bubbles: true }));
      await env.waitForStability();
      expect(chips[0].matches(":focus-within")).toBeTrue();
    });
  });
});
