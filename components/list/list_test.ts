/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import { html } from "lit";
import { Environment } from "../../testing/environment.js";
import { adoptStyles } from "../../styles/adopt-styles.js";
import { styles as m3Styles } from "../../styles/m3.cssresult.js";

import {
  LIST_LONG_PRESS_MS,
  ListElement,
  ListReorderEvent,
} from "./list-element.js";
import { freezeSpringClock, untilTicking } from "../shared/test-dom.js";
import { ListItemElement } from "./list-item-element.js";
import { clampListDensity, listItemClasses, listClasses } from "./list.js";
import "./md-gb-list-item.js";
import "./md-gb-list.js";

adoptStyles(document, [m3Styles]);

function sysColor(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--md-sys-color-${name}`)
    .trim();
}

function prop(element: Element, name: string) {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

function itemOf(item: ListItemElement) {
  return item.shadowRoot!.querySelector<HTMLElement>(".list-item")!;
}

function handleOf(item: ListItemElement) {
  return item.shadowRoot!.querySelector<HTMLButtonElement>(
    ".list-item-drag-handle",
  );
}

function key(target: Element, key: string) {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    composed: true,
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event;
}

function pointer(
  target: Element,
  type: string,
  x: number,
  y: number,
  init: PointerEventInit = {},
) {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      pointerId: 1,
      isPrimary: true,
      button: 0,
      clientX: x,
      clientY: y,
      ...init,
    }),
  );
}

function center(element: Element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

describe("list classes", () => {
  it("adds the reorderable list class", () => {
    expect(listClasses({ reorderable: true })).toEqual(
      jasmine.objectContaining({ "list-reorderable": true }),
    );
  });

  it("adds the interaction item classes", () => {
    expect(
      listItemClasses({
        expandable: true,
        expanded: true,
        reorderable: true,
        dragged: true,
        swiping: true,
      }),
    ).toEqual(
      jasmine.objectContaining({
        "list-item-expandable": true,
        "list-item-expanded": true,
        "list-item-reorderable": true,
        "list-item-dragged": true,
        "list-item-swiped": true,
        "list-item-swiping": true,
      }),
    );
  });

  it("only marks expandable items as expanded", () => {
    expect(
      listItemClasses({ expanded: true })["list-item-expanded"],
    ).toBeFalse();
  });
});

describe("<md-gb-list-item> expand", () => {
  const env = new Environment();

  async function setupTest() {
    const root = env.render(html`
      <md-gb-list>
        <md-gb-list-item expandable>
          Fruits
          <md-gb-list slot="nested">
            <md-gb-list-item>Apples</md-gb-list-item>
            <md-gb-list-item>Pears</md-gb-list-item>
          </md-gb-list>
        </md-gb-list-item>
        <md-gb-list-item>Plain</md-gb-list-item>
      </md-gb-list>
    `);
    await env.waitForStability();
    const [item, plain] = Array.from(
      root.querySelectorAll<ListItemElement>(
        ":scope > md-gb-list > md-gb-list-item",
      ),
    );
    return { item, plain };
  }

  it("renders a collapsed disclosure button", async () => {
    const { item } = await setupTest();
    const button = itemOf(item);
    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    const region = item.shadowRoot!.getElementById(
      button.getAttribute("aria-controls")!,
    )!;
    expect(region).withContext("aria-controls region").not.toBeNull();
    expect(region.getAttribute("role")).toBe("group");
    expect(region.getAttribute("aria-labelledby")).toBe(button.id);
    expect(region.inert).toBeTrue();
    expect(item.shadowRoot!.querySelector(".list-item-expand-icon"))
      .withContext("chevron")
      .not.toBeNull();
  });

  it("does not render disclosure semantics for plain items", async () => {
    const { plain } = await setupTest();
    expect(itemOf(plain).hasAttribute("aria-expanded")).toBeFalse();
    expect(
      plain.shadowRoot!.querySelector(".list-item-expand-region"),
    ).toBeNull();
  });

  it("toggles on click and fires toggle", async () => {
    const { item } = await setupTest();
    const toggle = jasmine.createSpy("toggle");
    item.addEventListener("toggle", toggle);

    itemOf(item).click();
    await env.waitForStability();

    expect(item.expanded).toBeTrue();
    expect(item.hasAttribute("expanded")).toBeTrue();
    expect(toggle).toHaveBeenCalledTimes(1);
    const event = toggle.calls.mostRecent().args[0] as ToggleEvent;
    expect(event.newState).toBe("open");
    expect(event.oldState).toBe("closed");
    const button = itemOf(item);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.classList).toContain("list-item-expanded");
    expect(
      item.shadowRoot!.querySelector<HTMLElement>(".list-item-expand-region")!
        .inert,
    ).toBeFalse();

    itemOf(item).click();
    await env.waitForStability();
    expect(item.expanded).toBeFalse();
    expect((toggle.calls.mostRecent().args[0] as ToggleEvent).newState).toBe(
      "closed",
    );
  });

  it("uses the md.comp.list.expand tokens", async () => {
    const { item } = await setupTest();
    const button = itemOf(item);
    expect(prop(button, "--expand-icon-container-color")).toBe(
      sysColor("surface"),
    );
    item.expanded = true;
    await env.waitForStability();
    expect(prop(button, "--expand-icon-container-color")).toBe(
      sysColor("surface-container"),
    );
    expect(prop(button, "--container-color")).toBe(sysColor("surface"));
  });

  it("does not toggle when disabled", async () => {
    const { item } = await setupTest();
    item.disabled = true;
    await env.waitForStability();
    itemOf(item).click();
    expect(item.expanded).toBeFalse();
  });
});

describe("<md-gb-list> reorder", () => {
  const env = new Environment();

  async function setupTest() {
    const root = env.render(html`
      <md-gb-list reorderable style="width: 360px">
        <md-gb-list-item>Apples</md-gb-list-item>
        <md-gb-list-item>Bananas</md-gb-list-item>
        <md-gb-list-item>Cherries</md-gb-list-item>
      </md-gb-list>
    `);
    await env.waitForStability();
    await env.waitForStability();
    const list = root.querySelector<ListElement>("md-gb-list")!;
    const reorder = jasmine.createSpy("reorder");
    list.addEventListener("reorder", reorder);
    const labels = () =>
      Array.from(list.children).map((el) => el.textContent!.trim());
    const items = () => Array.from(list.children) as ListItemElement[];
    const live = (list as unknown as {liveRegion: HTMLElement}).liveRegion;
    return { list, reorder, labels, items, live };
  }

  it("shows labeled drag handles on every item", async () => {
    const { items } = await setupTest();
    for (const item of items()) {
      expect(item.reorderable).toBeTrue();
      const handle = handleOf(item);
      expect(handle).withContext("drag handle").not.toBeNull();
      expect(handle!.getAttribute("aria-label")).toBe(
        `Reorder ${item.textContent!.trim()}`,
      );
    }
  });

  it("hides the handles when the list is not reorderable", async () => {
    const { list, items } = await setupTest();
    list.reorderable = false;
    await env.waitForStability();
    await env.waitForStability();
    expect(items().every((item) => handleOf(item) === null)).toBeTrue();
  });

  it("reorders with the keyboard and announces it", async () => {
    const { reorder, labels, items, live } = await setupTest();
    const apples = items()[0];
    handleOf(apples)!.focus();

    expect(key(handleOf(apples)!, " ").defaultPrevented).toBeTrue();
    expect(apples.hasAttribute("dragging")).toBeTrue();
    expect(live.textContent).toContain("Apples, grabbed");
    expect(live.textContent).toContain("position 1 of 3");

    key(handleOf(apples)!, "ArrowDown");
    expect(labels()).toEqual(["Bananas", "Apples", "Cherries"]);
    expect(live.textContent).toContain("moved to position 2 of 3");
    expect(apples.shadowRoot!.activeElement)
      .withContext("focus stays on the handle")
      .toBe(handleOf(apples));

    key(handleOf(apples)!, "End");
    expect(labels()).toEqual(["Bananas", "Cherries", "Apples"]);

    key(handleOf(apples)!, "Enter");
    expect(apples.hasAttribute("dragging")).toBeFalse();
    expect(reorder).toHaveBeenCalledTimes(1);
    const event = reorder.calls.mostRecent().args[0] as ListReorderEvent;
    expect(event.from).toBe(0);
    expect(event.to).toBe(2);
    expect(event.item).toBe(apples);
    expect(live.textContent).toContain("Final position 3 of 3");
  });

  it("cancels a keyboard reorder with Escape", async () => {
    const { reorder, labels, items, live } = await setupTest();
    const cherries = items()[2];
    handleOf(cherries)!.focus();
    key(handleOf(cherries)!, "Enter");
    key(handleOf(cherries)!, "ArrowUp");
    key(handleOf(cherries)!, "ArrowUp");
    expect(labels()).toEqual(["Cherries", "Apples", "Bananas"]);

    key(handleOf(cherries)!, "Escape");
    expect(labels()).toEqual(["Apples", "Bananas", "Cherries"]);
    expect(reorder).not.toHaveBeenCalled();
    expect(cherries.hasAttribute("dragging")).toBeFalse();
    expect(live.textContent).toContain("Reorder cancelled");
  });

  it("restores the order when reorder is cancelled", async () => {
    const { list, labels, items } = await setupTest();
    list.addEventListener("reorder", (event) => {
      event.preventDefault();
    });
    const apples = items()[0];
    handleOf(apples)!.focus();
    key(handleOf(apples)!, " ");
    key(handleOf(apples)!, "ArrowDown");
    key(handleOf(apples)!, " ");
    expect(labels()).toEqual(["Apples", "Bananas", "Cherries"]);
  });

  // Until an item is grabbed, the arrow keys only move focus (lists.md
  // Keyboard navigation).
  it("does not move items with arrow keys until one is grabbed", async () => {
    const { labels, items } = await setupTest();
    const [apples, bananas] = items();
    handleOf(apples)!.focus();
    key(handleOf(apples)!, "ArrowDown");
    expect(labels()).toEqual(["Apples", "Bananas", "Cherries"]);
    expect(document.activeElement).toBe(bananas);
  });

  it("reaches the drag handle with the arrow keys", async () => {
    const { items } = await setupTest();
    const apples = items()[0];
    itemOf(apples).focus();
    key(itemOf(apples), "ArrowRight");
    expect(apples.shadowRoot!.activeElement).toBe(handleOf(apples));
    key(handleOf(apples)!, "ArrowLeft");
    expect(apples.shadowRoot!.activeElement).toBe(itemOf(apples));
  });

  it("reorders by dragging the handle", async () => {
    const { list, reorder, labels, items } = await setupTest();
    const [apples, bananas, cherries] = items();
    const handle = handleOf(apples)!;
    const start = center(handle);

    pointer(handle, "pointerdown", start.x, start.y);
    expect(apples.hasAttribute("dragging")).toBeTrue();
    const zone =
      list.shadowRoot!.querySelector<HTMLElement>(".list-drop-zone")!;
    expect(zone.hidden).toBeFalse();

    // Past the center of the second item.
    const target = center(bananas).y + 4;
    pointer(handle, "pointermove", start.x, target);
    expect(apples.style.translate).not.toBe("");
    expect(bananas.style.translate)
      .withContext("the neighbor shifts up")
      .toMatch(/^0px -/);
    expect(cherries.style.translate).toBe("");

    pointer(handle, "pointerup", start.x, target);
    expect(apples.hasAttribute("dragging")).toBeFalse();
    expect(zone.hidden).toBeTrue();
    expect(labels()).toEqual(["Bananas", "Apples", "Cherries"]);
    expect(reorder).toHaveBeenCalledTimes(1);
    const event = reorder.calls.mostRecent().args[0] as ListReorderEvent;
    expect([event.from, event.to]).toEqual([0, 1]);
  });

  it("keeps the order when a drag is cancelled", async () => {
    const { reorder, labels, items } = await setupTest();
    const [apples, , cherries] = items();
    const handle = handleOf(apples)!;
    const start = center(handle);
    pointer(handle, "pointerdown", start.x, start.y);
    pointer(handle, "pointermove", start.x, center(cherries).y + 4);
    pointer(handle, "pointercancel", start.x, center(cherries).y + 4);
    expect(labels()).toEqual(["Apples", "Bananas", "Cherries"]);
    expect(reorder).not.toHaveBeenCalled();
    expect(items().every((item) => item.style.translate === "")).toBeTrue();
  });

  it("uses the md.comp.list.reorder tokens while dragging", async () => {
    const { items } = await setupTest();
    const apples = items()[0];
    handleOf(apples)!.focus();
    key(handleOf(apples)!, " ");
    await env.waitForStability();
    const button = itemOf(apples);
    expect(button.classList).toContain("list-item-dragged");
    expect(prop(button, "--container-color")).toBe(
      sysColor("tertiary-container"),
    );
    expect(prop(button, "--label-text-color")).toBe(
      sysColor("on-tertiary-container"),
    );
    expect(prop(button, "--container-elevation")).toBe(
      prop(document.documentElement, "--md-sys-elevation-shadow-4"),
    );
    const zone =
      apples.parentElement!.shadowRoot!.querySelector(".list-drop-zone")!;
    expect(prop(zone, "--reorder-drop-zone-color")).toBe(
      sysColor("surface-container-low"),
    );
  });
});

describe("<md-gb-list-item> reveal", () => {
  const env = new Environment();

  async function setupTest(dir = "ltr") {
    const root = env.render(html`
      <md-gb-list dir=${dir} style="width: 360px">
        <md-gb-list-item>
          Fresh baked breads
          <button slot="leading-actions" aria-label="Pin">P</button>
          <button slot="trailing-actions" aria-label="Flag">F</button>
          <button slot="trailing-actions" aria-label="Archive">A</button>
        </md-gb-list-item>
      </md-gb-list>
    `);
    await env.waitForStability();
    await env.waitForStability();
    const item = root.querySelector<ListItemElement>("md-gb-list-item")!;
    const [pin, flag, archive] = Array.from(
      item.querySelectorAll<HTMLButtonElement>("button"),
    );
    const change = jasmine.createSpy("reveal-change");
    item.addEventListener("reveal-change", change);
    return { item, pin, flag, archive, change };
  }

  function swipe(item: ListItemElement, dx: number, dy = 0) {
    const el = itemOf(item);
    const { x, y } = center(el);
    pointer(el, "pointerdown", x, y);
    // Past the touch slop, then the rest of the way.
    pointer(el, "pointermove", x + Math.sign(dx) * 10, y + dy);
    pointer(el, "pointermove", x + Math.sign(dx) * 10 + dx, y + dy);
    pointer(el, "pointerup", x + Math.sign(dx) * 10 + dx, y + dy);
  }

  // spec: lists-08ada0
  it("renders the actions behind the item", async () => {
    const { item } = await setupTest();
    const actions =
      item.shadowRoot!.querySelector<HTMLElement>(".list-item-actions")!;
    expect(getComputedStyle(actions).display).toBe("flex");
    expect(item.revealed).toBe("");
    expect(prop(actions, "--reveal-primary-action-color")).toBe(
      sysColor("primary"),
    );
    expect(prop(actions, "--reveal-action-color")).toBe(
      sysColor("secondary-container"),
    );
  });

  it("hides the actions container without actions", async () => {
    const root = env.render(html`<md-gb-list-item>Plain</md-gb-list-item>`);
    await env.waitForStability();
    const item = root.querySelector<ListItemElement>("md-gb-list-item")!;
    const actions = item.shadowRoot!.querySelector(".list-item-actions")!;
    expect(getComputedStyle(actions).display).toBe("none");
  });

  function revealButtonOf(item: ListItemElement) {
    return item.shadowRoot!.querySelector<HTMLElement>(
      ".list-item-reveal-button",
    )!;
  }

  // The arrow keys move through the item's controls in visual order
  // (lists.md Keyboard navigation: Right/Left = next/previous element):
  // leading actions, the item, the "more" button, trailing actions.
  it("reveals the trailing actions with the arrow keys", async () => {
    const { item, flag, change } = await setupTest();
    itemOf(item).focus();
    key(itemOf(item), "ArrowRight");
    await env.waitForStability();
    expect(item.shadowRoot!.activeElement).toBe(revealButtonOf(item));
    expect(item.revealed).toBe("");
    key(revealButtonOf(item), "ArrowRight");
    await env.waitForStability();
    expect(item.revealed).toBe("trailing");
    expect(change).toHaveBeenCalled();
    expect(document.activeElement).toBe(flag);
    expect(itemOf(item).classList).toContain("list-item-swiped");
    expect(itemOf(item).style.translate).toMatch(/^-\d/);

    key(flag, "Escape");
    await env.waitForStability();
    expect(item.revealed).toBe("");
    expect(itemOf(item).style.translate).toBe("");
    expect(item.shadowRoot!.activeElement).toBe(itemOf(item));
  });

  it("reveals the leading actions with the other arrow key", async () => {
    const { item, pin } = await setupTest();
    itemOf(item).focus();
    key(itemOf(item), "ArrowLeft");
    await env.waitForStability();
    expect(item.revealed).toBe("leading");
    expect(document.activeElement).toBe(pin);
  });

  it("mirrors the arrow keys in RTL", async () => {
    const { item } = await setupTest("rtl");
    itemOf(item).focus();
    key(itemOf(item), "ArrowLeft");
    key(revealButtonOf(item), "ArrowLeft");
    await env.waitForStability();
    expect(item.revealed).toBe("trailing");
    expect(itemOf(item).style.translate)
      .withContext("moves toward the start (left in RTL is +x)")
      .toMatch(/^\d/);
  });

  it("reveals the actions that receive focus", async () => {
    const { item, archive } = await setupTest();
    archive.focus();
    await env.waitForStability();
    expect(item.revealed).toBe("trailing");
  });

  it("settles open after a swipe past the threshold", async () => {
    const { item, change } = await setupTest();
    const click = jasmine.createSpy("click");
    item.addEventListener("click", click);
    swipe(item, -70);
    await env.waitForStability();
    expect(item.revealed).toBe("trailing");
    expect(change).toHaveBeenCalledTimes(1);
    // The click that ends the gesture does not activate the item.
    itemOf(item).click();
    expect(click).not.toHaveBeenCalled();
  });

  it("closes when the swiped item is tapped", async () => {
    const { item } = await setupTest();
    item.reveal("trailing");
    await env.waitForStability();
    const click = jasmine.createSpy("click");
    item.addEventListener("click", click);
    itemOf(item).click();
    await env.waitForStability();
    expect(item.revealed).toBe("");
    expect(click).not.toHaveBeenCalled();
  });

  it("does not swipe on a vertical drag", async () => {
    const { item } = await setupTest();
    const el = itemOf(item);
    const { x, y } = center(el);
    pointer(el, "pointerdown", x, y);
    pointer(el, "pointermove", x - 4, y + 20);
    pointer(el, "pointermove", x - 80, y + 20);
    pointer(el, "pointerup", x - 80, y + 20);
    await env.waitForStability();
    expect(item.revealed).toBe("");
    expect(el.style.translate).toBe("");
  });

  it("triggers the primary action on a full swipe", async () => {
    const { item, archive, flag } = await setupTest();
    const archived = jasmine.createSpy("archive");
    const flagged = jasmine.createSpy("flag");
    archive.addEventListener("click", archived);
    flag.addEventListener("click", flagged);
    swipe(item, -300);
    await env.waitForStability();
    expect(archived).toHaveBeenCalledTimes(1);
    expect(flagged).not.toHaveBeenCalled();
    expect(itemOf(item).style.translate).toMatch(/^-[3-9]\d\d(\.\d+)?px/);

    // The spring carries it off screen, then it settles back.
    expect(await untilTicking(() => item.revealed === "" && itemOf(item).style.translate === "")).toBeTrue();
  });

  it("keeps the release velocity: the settle starts moving the way the finger was going", async () => {
    const { item } = await setupTest();
    const clock = freezeSpringClock();
    const el = itemOf(item);
    const { x, y } = center(el);
    const at = (type: string, dx: number, time: number) => {
      const event = new PointerEvent(type, {
        bubbles: true, composed: true, cancelable: true, pointerId: 1,
        isPrimary: true, button: 0, clientX: x + dx, clientY: y,
      });
      Object.defineProperty(event, "timeStamp", { value: time });
      el.dispatchEvent(event);
    };
    // Dragged well past half to the trailing actions, then slowly back toward
    // closed: it still reveals them, but the spring first drifts back.
    at("pointerdown", 0, 0);
    at("pointermove", -10, 10);
    at("pointermove", -108, 900);
    at("pointermove", -106, 920);
    at("pointermove", -104, 940);
    at("pointerup", -104, 945);
    expect(item.revealed).toBe("trailing");
    const released = parseFloat(el.style.translate);
    clock.advance(1);
    expect(parseFloat(el.style.translate)).toBeGreaterThan(released);
  });

  it("opens and closes programmatically", async () => {
    const { item, change } = await setupTest();
    item.reveal("leading");
    await env.waitForStability();
    expect(itemOf(item).style.translate).toMatch(/^\d/);
    item.close();
    await env.waitForStability();
    expect(itemOf(item).style.translate).toBe("");
    expect(change).not.toHaveBeenCalled();
  });
});

describe("<md-gb-list> selection", () => {
  const env = new Environment();

  async function setupTest(selectable = true) {
    const root = env.render(html`
      <md-gb-list ?selectable=${selectable} style="width: 360px">
        <md-gb-list-item>Apples</md-gb-list-item>
        <md-gb-list-item>Bananas</md-gb-list-item>
        <md-gb-list-item>Cherries</md-gb-list-item>
        <md-gb-list-item>Dates</md-gb-list-item>
      </md-gb-list>
    `);
    await env.waitForStability();
    await env.waitForStability();
    const list = root.querySelector<ListElement>("md-gb-list")!;
    const change = jasmine.createSpy("itemselectionchange");
    list.addEventListener("itemselectionchange", change);
    const items = () => Array.from(list.children) as ListItemElement[];
    const checked = () => items().map((item) => item.checked);
    return { list, change, items, checked };
  }

  function longPress(item: Element) {
    const { x, y } = center(item);
    pointer(item, "pointerdown", x, y);
    jasmine.clock().tick(LIST_LONG_PRESS_MS);
  }

  it("selects an item and enters selection mode on a long press", async () => {
    const { list, change, items, checked } = await setupTest();
    longPress(items()[1]);
    const { x, y } = center(items()[1]);
    pointer(items()[1], "pointerup", x, y);
    items()[1].click();
    expect(checked()).toEqual([false, true, false, false]);
    expect(list.selectionMode).toBeTrue();
    expect(list.hasAttribute("selection-mode")).toBeTrue();
    expect(change).toHaveBeenCalledTimes(1);
    const event = change.calls.mostRecent().args[0];
    expect(event.selected).toEqual([items()[1]]);
  });

  it("does not select on a short press", async () => {
    const { items, checked } = await setupTest();
    const { x, y } = center(items()[0]);
    pointer(items()[0], "pointerdown", x, y);
    jasmine.clock().tick(LIST_LONG_PRESS_MS - 100);
    pointer(items()[0], "pointerup", x, y);
    jasmine.clock().tick(200);
    expect(checked()).toEqual([false, false, false, false]);
  });

  it("cancels the long press when the pointer moves first", async () => {
    const { items, checked } = await setupTest();
    const { x, y } = center(items()[0]);
    pointer(items()[0], "pointerdown", x, y);
    pointer(items()[0], "pointermove", x + 20, y);
    jasmine.clock().tick(LIST_LONG_PRESS_MS);
    expect(checked()).toEqual([false, false, false, false]);
  });

  it("toggles items with a tap in selection mode and exits when empty", async () => {
    const { list, items, checked } = await setupTest();
    longPress(items()[0]);
    const { x, y } = center(items()[0]);
    pointer(items()[0], "pointerup", x, y);
    items()[0].click(); // The click that ends the long press is ignored.
    items()[2].click();
    expect(checked()).toEqual([true, false, true, false]);
    items()[0].click();
    items()[2].click();
    expect(checked()).toEqual([false, false, false, false]);
    expect(list.selectionMode).toBeFalse();
    expect(list.hasAttribute("selection-mode")).toBeFalse();
  });

  it("selects a range with a long press and drag", async () => {
    const { items, checked } = await setupTest();
    longPress(items()[0]);
    const end = center(items()[2]);
    pointer(items()[0], "pointermove", end.x, end.y);
    expect(checked()).toEqual([true, true, true, false]);
    // Dragging back shrinks the range.
    const back = center(items()[1]);
    pointer(items()[0], "pointermove", back.x, back.y);
    expect(checked()).toEqual([true, true, false, false]);
    pointer(items()[0], "pointerup", back.x, back.y);
  });

  it("keeps earlier selections outside a dragged range", async () => {
    const { items, checked } = await setupTest();
    items()[3].checked = true;
    longPress(items()[0]);
    const end = center(items()[1]);
    pointer(items()[0], "pointermove", end.x, end.y);
    expect(checked()).toEqual([true, true, false, true]);
  });

  it("does nothing unless selectable", async () => {
    const { items, checked } = await setupTest(false);
    longPress(items()[0]);
    items()[0].click();
    expect(checked()).toEqual([false, false, false, false]);
  });

  it("announces the selection count", async () => {
    const { list, items } = await setupTest();
    longPress(items()[0]);
    const live = (list as unknown as {liveRegion: HTMLElement}).liveRegion;
    expect(live.textContent).toBe("1 selected");
  });
});

describe("<md-gb-list-item> line heights", () => {
  const env = new Environment();

  async function heightOf(template: unknown) {
    const root = env.render(
      html`<md-gb-list style="width: 360px">${template}</md-gb-list>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    const item = root.querySelector<ListItemElement>("md-gb-list-item")!;
    return parseFloat(getComputedStyle(itemOf(item)).minHeight);
  }

  // spec: lists-6e4b72, lists-310ec0, lists-1381de, lists-b19cca
  it("uses the one-, two- and three-line heights", async () => {
    expect(await heightOf(html`<md-gb-list-item>One</md-gb-list-item>`)).toBe(
      56,
    );
    expect(
      await heightOf(
        html`<md-gb-list-item
          >Two<span slot="supporting-text">Supporting</span></md-gb-list-item
        >`,
      ),
    ).toBe(72);
    expect(
      await heightOf(
        html`<md-gb-list-item
          ><span slot="overline">Overline</span>Three<span
            slot="supporting-text"
            >Supporting</span
          ></md-gb-list-item
        >`,
      ),
    ).toBe(88);
  });
});

describe("<md-gb-list> density", () => {
  const env = new Environment();

  it("clamps density to 0..-3 and reflects it", async () => {
    const root = env.render(html`<md-gb-list></md-gb-list>`);
    await env.waitForStability();
    const list = root.querySelector<ListElement>("md-gb-list")!;
    expect(list.density).toBe(0);
    list.density = -7;
    expect(list.density).toBe(-3);
    list.density = 2;
    expect(list.density).toBe(0);
    list.density = -1.6;
    expect(list.density).toBe(-2);
    await env.waitForStability();
    expect(list.getAttribute("density")).toBe("-2");
    expect(clampListDensity(Number.NaN)).toBe(0);
  });

  it("adds the density classes", () => {
    expect(listClasses({ density: -1 })["list-density-1"]).toBeTrue();
    expect(listClasses({ density: -3 })["list-density-3"]).toBeTrue();
    expect(listClasses({})["list-density-1"]).toBeFalse();
  });

  it("removes 4px of height and 2px of padding per step", async () => {
    const root = env.render(html`
      <md-gb-list style="width: 360px">
        <md-gb-list-item>One</md-gb-list-item>
        <md-gb-list-item
          >Two<span slot="supporting-text">Supporting</span></md-gb-list-item
        >
      </md-gb-list>
    `);
    await env.waitForStability();
    await env.waitForStability();
    const list = root.querySelector<ListElement>("md-gb-list")!;
    const [one, two] = Array.from(list.children) as ListItemElement[];
    for (const [density, height, twoHeight, padding] of [
      [0, 56, 72, 10],
      [-1, 52, 68, 8],
      [-2, 48, 64, 6],
      [-3, 44, 60, 4],
    ]) {
      list.density = density;
      await env.waitForStability();
      const style = getComputedStyle(itemOf(one));
      expect(parseFloat(style.minHeight))
        .withContext(`density ${density}`)
        .toBe(height);
      expect(parseFloat(style.paddingTop)).toBe(padding);
      expect(parseFloat(style.paddingBottom)).toBe(padding);
      expect(parseFloat(getComputedStyle(itemOf(two)).minHeight)).toBe(
        twoHeight,
      );
    }
  });
});

describe("<md-gb-list-item> reveal without swiping", () => {
  const env = new Environment();

  async function setupTest(
    template = html`
      <md-gb-list-item>
        Fresh baked breads
        <button slot="leading-actions" aria-label="Pin">P</button>
        <button slot="trailing-actions" aria-label="Archive">A</button>
      </md-gb-list-item>
    `,
  ) {
    const root = env.render(
      html`<md-gb-list style="width: 360px">${template}</md-gb-list>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    const item = root.querySelector<ListItemElement>("md-gb-list-item")!;
    const change = jasmine.createSpy("reveal-change");
    item.addEventListener("reveal-change", change);
    return { item, change };
  }

  function moreOf(item: ListItemElement) {
    return item.shadowRoot!.querySelector<HTMLButtonElement>(
      ".list-item-reveal-button",
    );
  }

  it('shows a labeled "more" button when the item has actions', async () => {
    const { item } = await setupTest();
    const more = moreOf(item)!;
    expect(more).not.toBeNull();
    expect(more.getAttribute("aria-label")).toBe(
      "More actions Fresh baked breads",
    );
    expect(more.getAttribute("aria-expanded")).toBe("false");
    expect(more.getAttribute("aria-controls")).toBe("actions");
    expect(item.shadowRoot!.getElementById("actions")).not.toBeNull();
    const rect = more.getBoundingClientRect();
    expect(rect.width).toBeGreaterThanOrEqual(48);
    expect(rect.height).toBeGreaterThanOrEqual(48);
    expect(itemOf(item).classList).toContain("list-item-has-reveal-button");
  });

  it('has no "more" button without actions or with no-reveal-button', async () => {
    const plain = await setupTest(
      html`<md-gb-list-item>Plain</md-gb-list-item>`,
    );
    expect(moreOf(plain.item)).toBeNull();
    const optOut = await setupTest(html`
      <md-gb-list-item no-reveal-button>
        Item
        <button slot="trailing-actions" aria-label="Archive">A</button>
      </md-gb-list-item>
    `);
    expect(moreOf(optOut.item)).toBeNull();
  });

  it("reveals and hides the actions with a tap", async () => {
    const { item, change } = await setupTest();
    moreOf(item)!.click();
    await env.waitForStability();
    expect(item.revealed).toBe("trailing");
    expect(change).toHaveBeenCalledTimes(1);
    expect(moreOf(item)!.getAttribute("aria-expanded")).toBe("true");
    expect(itemOf(item).style.translate).not.toBe("");
    expect(moreOf(item)!.style.translate)
      .withContext("the button moves with the item")
      .toBe(itemOf(item).style.translate);

    moreOf(item)!.click();
    await env.waitForStability();
    expect(item.revealed).toBe("");
    expect(change).toHaveBeenCalledTimes(2);
  });

  it("reveals the leading actions when there are no trailing ones", async () => {
    const { item } = await setupTest(html`
      <md-gb-list-item>
        Item
        <button slot="leading-actions" aria-label="Pin">P</button>
      </md-gb-list-item>
    `);
    moreOf(item)!.click();
    expect(item.revealed).toBe("leading");
  });

  it("is disabled with the item", async () => {
    const { item } = await setupTest(html`
      <md-gb-list-item disabled>
        Item
        <button slot="trailing-actions" aria-label="Archive">A</button>
      </md-gb-list-item>
    `);
    expect(moreOf(item)!.disabled).toBeTrue();
  });
});

describe("<md-gb-list> reorder without dragging", () => {
  const env = new Environment();

  async function setupTest() {
    const root = env.render(html`
      <md-gb-list reorderable style="width: 360px">
        <md-gb-list-item>Apples</md-gb-list-item>
        <md-gb-list-item>Bananas</md-gb-list-item>
        <md-gb-list-item>Cherries</md-gb-list-item>
      </md-gb-list>
    `);
    await env.waitForStability();
    await env.waitForStability();
    const list = root.querySelector<ListElement>("md-gb-list")!;
    const reorder = jasmine.createSpy("reorder");
    list.addEventListener("reorder", reorder);
    const labels = () =>
      Array.from(list.children).map((el) => el.textContent!.trim());
    const items = () => Array.from(list.children) as ListItemElement[];
    const live = (list as unknown as {liveRegion: HTMLElement}).liveRegion;
    return { list, reorder, labels, items, live };
  }

  function moveButton(item: ListItemElement, direction: "up" | "down") {
    return item.shadowRoot!.querySelector<HTMLButtonElement>(
      `.list-item-move-${direction}`,
    );
  }

  function tap(target: Element) {
    const { x, y } = center(target);
    pointer(target, "pointerdown", x, y);
    pointer(target, "pointerup", x, y);
  }

  it("grabs an item with a tap on the handle and shows move buttons", async () => {
    const { items, live } = await setupTest();
    const apples = items()[0];
    expect(moveButton(apples, "up")).toBeNull();
    tap(handleOf(apples)!);
    await env.waitForStability();
    expect(apples.grabbed).toBeTrue();
    expect(apples.hasAttribute("dragging")).toBeTrue();
    expect(apples.shadowRoot!.activeElement).toBe(handleOf(apples));
    expect(live.textContent).toContain("Apples, grabbed");
    const up = moveButton(apples, "up")!;
    const down = moveButton(apples, "down")!;
    expect(up.getAttribute("aria-label")).toBe("Move up Apples");
    expect(down.getAttribute("aria-label")).toBe("Move down Apples");
    for (const button of [up, down]) {
      const rect = button.getBoundingClientRect();
      expect(rect.width).toBeGreaterThanOrEqual(48);
      expect(rect.height).toBeGreaterThanOrEqual(48);
    }
  });

  it("moves the grabbed item with the move buttons and drops on a tap", async () => {
    const { reorder, labels, items, live } = await setupTest();
    const apples = items()[0];
    tap(handleOf(apples)!);
    await env.waitForStability();

    moveButton(apples, "down")!.focus();
    moveButton(apples, "down")!.click();
    expect(labels()).toEqual(["Bananas", "Apples", "Cherries"]);
    expect(live.textContent).toContain("moved to position 2 of 3");
    expect(apples.shadowRoot!.activeElement)
      .withContext("focus stays on the move button")
      .toBe(moveButton(apples, "down"));
    moveButton(apples, "down")!.click();
    expect(labels()).toEqual(["Bananas", "Cherries", "Apples"]);
    moveButton(apples, "down")!.click();
    expect(labels())
      .withContext("stays at the end")
      .toEqual(["Bananas", "Cherries", "Apples"]);
    moveButton(apples, "up")!.click();
    expect(labels()).toEqual(["Bananas", "Apples", "Cherries"]);
    expect(reorder).not.toHaveBeenCalled();

    tap(handleOf(apples)!);
    await env.waitForStability();
    expect(apples.grabbed).toBeFalse();
    expect(apples.hasAttribute("dragging")).toBeFalse();
    expect(moveButton(apples, "up")).toBeNull();
    expect(reorder).toHaveBeenCalledTimes(1);
    const event = reorder.calls.mostRecent().args[0] as ListReorderEvent;
    expect([event.from, event.to]).toEqual([0, 1]);
    expect(live.textContent).toContain("Final position 2 of 3");
  });

  it("cancels with Escape from a move button", async () => {
    const { reorder, labels, items } = await setupTest();
    const cherries = items()[2];
    tap(handleOf(cherries)!);
    await env.waitForStability();
    moveButton(cherries, "up")!.focus();
    moveButton(cherries, "up")!.click();
    expect(labels()).toEqual(["Apples", "Cherries", "Bananas"]);
    key(moveButton(cherries, "up")!, "Escape");
    expect(labels()).toEqual(["Apples", "Bananas", "Cherries"]);
    expect(cherries.grabbed).toBeFalse();
    expect(reorder).not.toHaveBeenCalled();
  });

  it("shows the move buttons for a keyboard grab too", async () => {
    const { items } = await setupTest();
    const bananas = items()[1];
    handleOf(bananas)!.focus();
    key(handleOf(bananas)!, " ");
    await env.waitForStability();
    expect(bananas.grabbed).toBeTrue();
    expect(moveButton(bananas, "up")).not.toBeNull();
    key(handleOf(bananas)!, "Enter");
    await env.waitForStability();
    expect(bananas.grabbed).toBeFalse();
  });

  it("lays out the trailing controls without overlap", async () => {
    const root = env.render(html`
      <md-gb-list reorderable style="width: 360px">
        <md-gb-list-item>
          Apples
          <span slot="trailing-text">12</span>
          <button slot="trailing-actions" aria-label="Archive">A</button>
        </md-gb-list-item>
      </md-gb-list>
    `);
    await env.waitForStability();
    await env.waitForStability();
    const item = root.querySelector<ListItemElement>("md-gb-list-item")!;
    tap(handleOf(item)!);
    await env.waitForStability();
    const rectOf = (selector: string) =>
      item.shadowRoot!.querySelector(selector)!.getBoundingClientRect();
    const handle = rectOf(".list-item-drag-handle");
    const down = rectOf(".list-item-move-down");
    const up = rectOf(".list-item-move-up");
    const more = rectOf(".list-item-reveal-button");
    const text = item
      .querySelector('[slot="trailing-text"]')!
      .getBoundingClientRect();
    expect(down.right).toBeLessThanOrEqual(handle.left + 0.5);
    expect(up.right).toBeLessThanOrEqual(down.left + 0.5);
    expect(more.right).toBeLessThanOrEqual(up.left + 0.5);
    // The content ends `between-space` before the button's glyph (its 48px
    // target may reach a couple of px into that space, like the handle's).
    expect(text.right).toBeLessThanOrEqual(more.left + (more.width - 20) / 2);
    expect(handle.right).toBeLessThanOrEqual(
      itemOf(item).getBoundingClientRect().right,
    );
  });

  it("tapping another handle drops the grabbed item and grabs that one", async () => {
    const { items } = await setupTest();
    const [apples, bananas] = items();
    tap(handleOf(apples)!);
    await env.waitForStability();
    tap(handleOf(bananas)!);
    await env.waitForStability();
    expect(apples.grabbed).toBeFalse();
    expect(bananas.grabbed).toBeTrue();
  });
});

describe("<md-gb-list> keyboard navigation", () => {
  const env = new Environment();

  async function setupTest(dir = "ltr") {
    const root = env.render(html`
      <md-gb-list reorderable dir=${dir}>
        <md-gb-list-item>
          Apples
          <button slot="trailing-actions" aria-label="Archive">A</button>
        </md-gb-list-item>
        <md-gb-list-item disabled>Bananas</md-gb-list-item>
        <md-gb-list-item>Cherries</md-gb-list-item>
        <md-gb-list-item>Dates</md-gb-list-item>
      </md-gb-list>
    `);
    await env.waitForStability();
    await env.waitForStability();
    const items = Array.from(
      root.querySelectorAll<ListItemElement>("md-gb-list-item"),
    );
    return { root, items };
  }

  function tabIndexOf(el: Element) {
    return (el as HTMLElement).tabIndex;
  }

  it("makes the first and last items tab stops while focus is outside", async () => {
    const { items } = await setupTest();
    expect(items.map((item) => item.rovingTabIndex)).toEqual([0, -1, -1, 0]);
    expect(tabIndexOf(itemOf(items[0]))).toBe(0);
    expect(tabIndexOf(itemOf(items[2]))).toBe(-1);
  });

  it("keeps only the focused item tabbable", async () => {
    const { items } = await setupTest();
    itemOf(items[2]).focus();
    await env.waitForStability();
    expect(items.map((item) => item.rovingTabIndex)).toEqual([-1, -1, 0, -1]);
  });

  it("takes the secondary controls out of the tab order", async () => {
    const { items } = await setupTest();
    expect(tabIndexOf(handleOf(items[0])!)).toBe(-1);
    const archive = items[0].querySelector("button")!;
    expect(archive.getAttribute("tabindex")).toBe("-1");
    const more = items[0].shadowRoot!.querySelector(
      ".list-item-reveal-button",
    )!;
    expect(tabIndexOf(more)).toBe(-1);
  });

  it("moves between items with the arrow keys, skipping disabled ones", async () => {
    const { items } = await setupTest();
    itemOf(items[0]).focus();
    key(itemOf(items[0]), "ArrowDown");
    expect(document.activeElement).toBe(items[2]);
    key(itemOf(items[2]), "ArrowUp");
    expect(document.activeElement).toBe(items[0]);
    key(itemOf(items[0]), "End");
    expect(document.activeElement).toBe(items[3]);
    key(itemOf(items[3]), "ArrowDown");
    expect(document.activeElement).withContext("wraps").toBe(items[0]);
    key(itemOf(items[0]), "Home");
    expect(document.activeElement).toBe(items[0]);
  });

  it("moves through an item's controls with Right before the next item", async () => {
    const { items } = await setupTest();
    const [apples] = items;
    const archive = apples.querySelector("button")!;
    const more = apples.shadowRoot!.querySelector<HTMLElement>(
      ".list-item-reveal-button",
    )!;
    itemOf(apples).focus();
    key(itemOf(apples), "ArrowRight");
    expect(apples.shadowRoot!.activeElement).toBe(more);
    key(more, "ArrowRight");
    expect(apples.shadowRoot!.activeElement).toBe(handleOf(apples));
    key(handleOf(apples)!, "ArrowRight");
    expect(document.activeElement).toBe(archive);
    key(archive, "ArrowRight");
    expect(document.activeElement).toBe(items[2]);
  });

  it("mirrors Left and Right in RTL", async () => {
    const { items } = await setupTest("rtl");
    itemOf(items[2]).focus();
    key(itemOf(items[2]), "ArrowLeft");
    expect(items[2].shadowRoot!.activeElement === handleOf(items[2]))
      .withContext("the drag handle is next in RTL")
      .toBeTrue();
    key(handleOf(items[2])!, "ArrowLeft");
    expect(document.activeElement === items[3]).toBeTrue();
    key(itemOf(items[3]), "ArrowRight");
    expect(document.activeElement === items[2]).toBeTrue();
  });

  it("leaves items outside a list in the tab order", async () => {
    const root = env.render(html`
      <md-gb-list-item reorderable>
        Apples
        <button slot="trailing-actions" aria-label="Archive">A</button>
      </md-gb-list-item>
    `);
    await env.waitForStability();
    const item = root.querySelector<ListItemElement>("md-gb-list-item")!;
    expect(item.rovingTabIndex).toBeNull();
    expect(itemOf(item).hasAttribute("tabindex")).toBeFalse();
    expect(handleOf(item)!.hasAttribute("tabindex")).toBeFalse();
    expect(item.querySelector("button")!.hasAttribute("tabindex")).toBeFalse();
  });

  it("hands a removed item back its tab order", async () => {
    const { root, items } = await setupTest();
    const [apples] = items;
    root.appendChild(apples);
    await env.waitForStability();
    await env.waitForStability();
    expect(apples.rovingTabIndex).toBeNull();
    expect(
      apples.querySelector("button")!.hasAttribute("tabindex"),
    ).toBeFalse();
  });
});
