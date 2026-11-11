/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../../components/card/md-gb-card.js';
import '../../../components/list/md-gb-list.js';
import '../../../components/list/md-gb-list-item.js';

import {sendMouse} from '@web/test-runner-commands';

import {paintFingerprint as paint} from '../../../testing/style-helpers.js';
import {center, deepElements, settle, until} from '../../../testing/subjects.js';

// foundations/interaction/selection.md: cards that can be selected, the
// desktop checkbox patterns of a selectable list, and the avatar as a
// selection shortcut.

type Item = HTMLElement & {checked: boolean};

async function mount(html: string) {
  const container = document.createElement('div');
  container.style.cssText = 'padding:48px;position:relative;width:420px';
  container.innerHTML = html;
  document.body.append(container);
  await settle(container);
  return {container, cleanup: () => container.remove()};
}

/** Whether an item shows a checkbox: a checkbox-like part with a box. */
function showsCheckbox(item: Element) {
  return deepElements(item).some((e) => {
    if (!/checkbox/.test(`${e.localName} ${e.className}`)) return false;
    const r = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.opacity === '1';
  });
}

const LIST = (attrs = '') => `<md-gb-list selectable ${attrs} aria-label="Items" style="width:360px">
    <md-gb-list-item>Apples</md-gb-list-item><md-gb-list-item>Bananas</md-gb-list-item>
    <md-gb-list-item>Cherries</md-gb-list-item></md-gb-list>`;

describe('selection (central)', () => {
  afterEach(async () => {
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: interaction-selection-504d1d
  it('a selectable card toggles its selected state, which changes its look', async () => {
    const {container, cleanup} = await mount(
      `<md-gb-card interactive selectable aria-label="Open" style="width:200px;height:120px">Content</md-gb-card>`,
    );
    const card = container.querySelector('md-gb-card') as HTMLElement & {selected: boolean};
    const before = paint(card);
    const c = center(card);
    await sendMouse({type: 'click', position: [c.x, c.y]});
    await settle(card);
    expect(card.selected).toBeTrue();
    expect(card.shadowRoot!.querySelector('button')!.getAttribute('aria-pressed')).toBe('true');
    expect(await until(() => paint(card) !== before)).toBeTrue();
    cleanup();
  });

  // spec: interaction-selection-8d7a74, interaction-selection-f90e15, interaction-selection-aa398a
  it('on desktop, a checkbox for an item appears when the cursor hovers it, and can be clicked', async () => {
    const {container, cleanup} = await mount(LIST());
    const [one, two] = Array.from(container.querySelectorAll<Item>('md-gb-list-item'));
    expect(showsCheckbox(one)).toBeFalse();
    const c = center(one);
    await sendMouse({type: 'move', position: [c.x, c.y]});
    expect(await until(() => showsCheckbox(one))).toBeTrue();
    expect(showsCheckbox(two)).toBeFalse();
    const box = deepElements(one).find((e) => /checkbox/.test(e.className))!;
    const b = center(box);
    await sendMouse({type: 'click', position: [b.x, b.y]});
    expect(one.checked).toBeTrue();
    cleanup();
  });

  // spec: interaction-selection-8d7a74, interaction-selection-92ffad
  it('on desktop, checkboxes show for all items once one item is selected', async () => {
    const {container, cleanup} = await mount(LIST());
    const items = Array.from(container.querySelectorAll<Item>('md-gb-list-item'));
    items[0].checked = true;
    expect(await until(() => items.every(showsCheckbox))).toBeTrue();
    items[0].checked = false;
    expect(await until(() => items.every((i) => !showsCheckbox(i)))).toBeTrue();
    cleanup();
  });

  // spec: interaction-selection-ef804a
  it('on desktop, checkboxes are always visible when selection is the primary activity', async () => {
    const {container, cleanup} = await mount(LIST('selection-primary'));
    const items = Array.from(container.querySelectorAll<Item>('md-gb-list-item'));
    expect(await until(() => items.every(showsCheckbox))).toBeTrue();
    cleanup();
  });

  // spec: interaction-selection-235498
  it('tapping the avatar of a list item selects it, as a selection shortcut', async () => {
    const {container, cleanup} = await mount(
      `<md-gb-list selectable aria-label="Items" style="width:360px">
        <md-gb-list-item><span slot="avatar">A</span>Apples</md-gb-list-item>
        <md-gb-list-item><span slot="avatar">B</span>Bananas</md-gb-list-item></md-gb-list>`,
    );
    const [one, two] = Array.from(container.querySelectorAll<Item>('md-gb-list-item'));
    const c = center(one.querySelector('[slot=avatar]')!);
    await sendMouse({type: 'click', position: [c.x, c.y]});
    expect(await until(() => one.checked)).toBeTrue();
    expect(two.checked).toBeFalse();
    cleanup();
  });
});
