/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../list/md-gb-list.js';
import '../../list/md-gb-list-item.js';
import '../../navbar/md-gb-nav-bar.js';
import '../../navbar/md-gb-nav-bar-item.js';
import '../../navrail/md-gb-nav-rail.js';
import '../../navrail/md-gb-nav-rail-item.js';
import '../../navdrawer/md-gb-nav-drawer.js';
import '../../navdrawer/md-gb-nav-drawer-item.js';
import '../../tabs/md-gb-tabs.js';
import '../../tabs/md-gb-tab.js';
import '../../slider/md-gb-slider.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';

import {center, deepElements, renderSubject, settle, sleep, SUBJECTS, type Subject} from './subjects.js';
import {paintFingerprint as paint} from './style-helpers.js';

// Foundations > Interaction > Selection (foundations/interaction/selection.md):
// how selection is shown, which parts take part, and how people select with
// touch, a cursor, or the keyboard.

const subject = (id: string): Subject => SUBJECTS.find((s) => s.id === id)!;

async function mount(html: string) {
  const container = document.createElement('div');
  container.style.cssText = 'padding:48px;position:relative;width:420px';
  container.innerHTML = html;
  document.body.append(container);
  await settle(container);
  return {container, cleanup: () => container.remove()};
}

/** A touch long press on an element: pointer down, hold, release. */
async function touchLongPress(target: Element) {
  const c = center(target);
  const init = {
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    pointerId: 7,
    bubbles: true,
    composed: true,
    clientX: c.x,
    clientY: c.y,
  };
  target.dispatchEvent(new PointerEvent('pointerdown', init));
  await sleep(450);
  target.dispatchEvent(new PointerEvent('pointerup', init));
  // The click that follows the release belongs to the long press.
  (target as HTMLElement).click();
  await sleep(20);
}

describe('selection indicators (central)', () => {
  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
    (document.activeElement as HTMLElement | null)?.blur();
  });

  /** Parts that can be selected, with the state they toggle. */
  const SELECTABLE: Array<[string, string, string]> = [
    ['chip-filter', 'selected', 'chips'],
    ['segmented-button', 'selected', 'segmented buttons'],
    ['checkbox', 'checked', 'checkboxes'],
    ['radio', 'checked', 'radio buttons'],
    ['switch', 'selected', 'switches'],
    ['button-toggle', 'selected', 'toggle buttons'],
    ['icon-button-toggle', 'selected', 'icon buttons'],
  ];

  // spec: interaction-selection-ad9ccb, interaction-selection-298bcc, interaction-selection-3a99c3, interaction-selection-1c8dd6, interaction-selection-3e106f, interaction-selection-51e678, interaction-selection-3ffe78, interaction-selection-b1b63a, interaction-selection-856cb9, interaction-selection-03be0d, interaction-selection-a6f97a
  for (const [id, attr, label] of SELECTABLE) {
    it(`shows selection with a visible change: ${label}`, async () => {
      const {el, cleanup} = await renderSubject(subject(id));
      const before = paint(el);
      el.toggleAttribute(attr, true);
      await settle(el);
      // Finish the transition of the new look.
      for (const a of el.getAnimations({subtree: true})) a.finish();
      for (const a of (el.shadowRoot?.getAnimations?.() ?? []) as Animation[]) a.finish();
      await sleep(50);
      expect(paint(el)).withContext(id).not.toBe(before);
      cleanup();
    });
  }

  // spec: interaction-selection-ad9ccb, interaction-selection-c0739a
  it('shows the selected value of a slider as a visible change', async () => {
    const {el, cleanup} = await renderSubject(subject('slider'));
    const shape = () =>
      deepElements(el).map((e) => `${Math.round(e.getBoundingClientRect().left)},${Math.round(e.getBoundingClientRect().width)}`).join('|');
    const before = shape();
    (el as unknown as {value: number}).value = 80;
    await settle(el);
    await sleep(150);
    expect(shape()).not.toBe(before);
    cleanup();
  });

  // spec: interaction-selection-ad9ccb, interaction-selection-05e235, interaction-selection-07f10e
  it('shows a selected list item with a color change and a check mark or checkbox', async () => {
    const {container, cleanup} = await mount(
      `<md-gb-list aria-label="Items"><md-gb-list-item>One</md-gb-list-item><md-gb-list-item>Two</md-gb-list-item></md-gb-list>`,
    );
    const item = container.querySelector('md-gb-list-item') as HTMLElement & {checked: boolean};
    const before = paint(item);
    item.checked = true;
    await settle(item);
    await sleep(120);
    expect(paint(item)).not.toBe(before);
    cleanup();
  });

  // spec: interaction-selection-e909ef
  it('selects a whole component (a chip) or just one part of a component (a segment of a segmented button)', async () => {
    const whole = await renderSubject(subject('chip-filter'));
    const resting = paint(whole.el);
    whole.el.toggleAttribute('selected', true);
    await settle(whole.el);
    await sleep(120);
    expect(paint(whole.el)).not.toBe(resting);
    whole.cleanup();

    const {container, cleanup} = await renderSubject(subject('segmented-button'));
    const [one, two] = Array.from(container.querySelectorAll<HTMLElement>('md-gb-segmented-button'));
    const twoBefore = paint(two);
    const oneBefore = paint(one);
    one.toggleAttribute('selected', true);
    await settle(container);
    await sleep(120);
    expect(paint(one)).not.toBe(oneBefore);
    expect(paint(two)).toBe(twoBefore);
    cleanup();
  });

  // spec: interaction-selection-ae43f2
  for (const [id, attr] of SELECTABLE.filter(([id]) => id !== 'radio')) {
    it(`selects ${id} with a click (cursor, tap) and with the keyboard`, async () => {
      const {el, cleanup} = await renderSubject(subject(id));
      const read = () => (el as unknown as Record<string, unknown>)[attr];
      expect(read()).toBeFalsy();
      const c = center(el);
      await sendMouse({type: 'click', position: [c.x, c.y]});
      await sleep(30);
      expect(read()).toBeTruthy();
      await sendKeys({press: 'Shift'});
      el.focus();
      await sendKeys({press: 'Space'});
      await sleep(30);
      expect(read()).toBeFalsy();
      cleanup();
    });
  }

  describe('active indicator', () => {
    /** Elements of a group that report the current item. */
    function reported(group: Element) {
      const all = [group, ...group.querySelectorAll('*')] as Element[];
      return all.filter(
        (e) =>
          e.hasAttribute('selected') ||
          e.getAttribute('aria-selected') === 'true' ||
          e.getAttribute('aria-current') === 'page' ||
          e.getAttribute('aria-current') === 'true' ||
          (e as unknown as {selected?: boolean; active?: boolean}).selected === true ||
          (e as unknown as {active?: boolean}).active === true,
      );
    }

    const GROUPS: Array<[string, string, string]> = [
      ['navigation bar', `<md-gb-nav-bar><md-gb-nav-bar-item><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-bar-item><md-gb-nav-bar-item><md-gb-icon slot="icon">mail</md-gb-icon>Mail</md-gb-nav-bar-item></md-gb-nav-bar>`, 'md-gb-nav-bar-item'],
      ['navigation rail', `<md-gb-nav-rail><md-gb-nav-rail-item><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-rail-item><md-gb-nav-rail-item><md-gb-icon slot="icon">mail</md-gb-icon>Mail</md-gb-nav-rail-item></md-gb-nav-rail>`, 'md-gb-nav-rail-item'],
      ['tabs', `<md-gb-tabs aria-label="Tabs"><md-gb-tab><span slot="label">One</span></md-gb-tab><md-gb-tab><span slot="label">Two</span></md-gb-tab></md-gb-tabs>`, 'md-gb-tab'],
    ];

    // spec: interaction-selection-5c0435, interaction-selection-12328f, interaction-selection-ee3bc2, interaction-selection-5ff2fd
    for (const [label, html, itemTag] of GROUPS) {
      it(`marks only one ${label} item as the current one at a time, with an active indicator`, async () => {
        const {container, cleanup} = await mount(html);
        const [one, two] = Array.from(container.querySelectorAll<HTMLElement>(itemTag));
        const group = one.parentElement!;
        one.click();
        await settle(container);
        expect(reported(group).filter((e) => e.localName === itemTag)).toEqual([one]);
        const indicatorBefore = paint(one);
        two.click();
        await settle(container);
        for (const a of group.getAnimations({subtree: true})) a.finish();
        await sleep(50);
        expect(reported(group).filter((e) => e.localName === itemTag)).toEqual([two]);
        // The indicator moved: the first item no longer looks the same as selected.
        expect(paint(one)).not.toBe(indicatorBefore);
        cleanup();
      });
    }

    // spec: interaction-selection-5c0435, interaction-selection-12328f
    it('marks only one navigation drawer item as the current one at a time', async () => {
      const {container, cleanup} = await renderSubject(subject('nav-drawer-item'));
      const items = Array.from(container.querySelectorAll<HTMLElement>('md-gb-nav-drawer-item'));
      items[0].click();
      await settle(container);
      items[1].click();
      await settle(container);
      const selected = items.filter((i) => (i as unknown as {selected: boolean}).selected);
      expect(selected).toEqual([items[1]]);
      cleanup();
    });
  });
});

describe('types of selection (central)', () => {
  /** A selectable list of four items. */
  async function mountList() {
    const {container, cleanup} = await mount(`<md-gb-list selectable aria-label="Items" style="width:360px">
        <md-gb-list-item>Apples</md-gb-list-item><md-gb-list-item>Bananas</md-gb-list-item>
        <md-gb-list-item>Cherries</md-gb-list-item><md-gb-list-item>Dates</md-gb-list-item></md-gb-list>`);
    const list = container.querySelector('md-gb-list') as HTMLElement & {selectionMode: boolean};
    const items = Array.from(container.querySelectorAll<HTMLElement & {checked: boolean}>('md-gb-list-item'));
    const checked = () => items.map((i) => i.checked);
    return {list, items, checked, cleanup};
  }

  // spec: interaction-selection-063d34, interaction-selection-fe377e, interaction-selection-0c21c1
  it('selects an item and enters selection mode with a long press on touch', async () => {
    const {list, items, checked, cleanup} = await mountList();
    await touchLongPress(items[1]);
    expect(checked()).toEqual([false, true, false, false]);
    expect(list.selectionMode).toBeTrue();
    cleanup();
  });

  // spec: interaction-selection-17dbc7, interaction-selection-bfb565
  it('selects more items with a tap each, and leaves selection mode when all are unselected', async () => {
    const {list, items, checked, cleanup} = await mountList();
    await touchLongPress(items[0]);
    items[2].click();
    await sleep(20);
    expect(checked()).toEqual([true, false, true, false]);
    items[0].click();
    items[2].click();
    await sleep(20);
    expect(checked()).toEqual([false, false, false, false]);
    expect(list.selectionMode).toBeFalse();
    cleanup();
  });

  // spec: interaction-selection-f0b20f, interaction-selection-34f7f5
  it('selects several items at once with a long press and drag across them', async () => {
    const {items, checked, cleanup} = await mountList();
    const from = center(items[0]);
    const to = center(items[2]);
    const init = {pointerType: 'touch', isPrimary: true, button: 0, pointerId: 9, bubbles: true, composed: true, cancelable: true};
    items[0].dispatchEvent(new PointerEvent('pointerdown', {...init, clientX: from.x, clientY: from.y}));
    await sleep(450);
    items[0].dispatchEvent(new PointerEvent('pointermove', {...init, clientX: to.x, clientY: to.y}));
    items[2].dispatchEvent(new PointerEvent('pointerup', {...init, clientX: to.x, clientY: to.y}));
    await sleep(20);
    expect(checked()).toEqual([true, true, true, false]);
    cleanup();
  });
});
