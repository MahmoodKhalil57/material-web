/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../card/md-gb-card.js';
import '../../list/md-gb-list.js';
import '../../list/md-gb-list-item.js';

import {sendMouse} from '@web/test-runner-commands';

import {center, deepElements, settle, sleep} from './subjects.js';
import {paintFingerprint as paint} from './style-helpers.js';

// Gap checks for foundations/interaction/selection.md: cards that can be
// selected, the desktop checkbox patterns of a selectable list, and the avatar
// as a selection shortcut. Run with `npm run gb:check -- --gaps ...`.

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
    const name = `${e.localName} ${e.className}`;
    if (!/checkbox/.test(name)) return false;
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).opacity !== '0';
  });
}

describe('selection (central gaps)', () => {
  afterEach(async () => {
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: interaction-selection-504d1d
  it('a card can be selected: the selected state changes its look', async () => {
    const {container, cleanup} = await mount(
      `<md-gb-card interactive aria-label="Open" style="width:200px;height:120px">Content</md-gb-card>`,
    );
    const card = container.querySelector('md-gb-card') as HTMLElement;
    const before = paint(card);
    card.toggleAttribute('selected', true);
    await settle(card);
    await sleep(150);
    expect(paint(card)).not.toBe(before);
    cleanup();
  });

  const LIST = `<md-gb-list selectable aria-label="Items" style="width:360px">
      <md-gb-list-item>Apples</md-gb-list-item><md-gb-list-item>Bananas</md-gb-list-item>
      <md-gb-list-item>Cherries</md-gb-list-item></md-gb-list>`;

  // spec: interaction-selection-8d7a74, interaction-selection-f90e15, interaction-selection-aa398a
  it('on desktop, a checkbox for an item appears when the cursor hovers it, and can be clicked', async () => {
    const {container, cleanup} = await mount(LIST);
    const [one, two] = Array.from(container.querySelectorAll<HTMLElement & {checked: boolean}>('md-gb-list-item'));
    expect(showsCheckbox(one)).toBeFalse();
    const c = center(one);
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await sleep(150);
    expect(showsCheckbox(one)).toBeTrue();
    expect(showsCheckbox(two)).toBeFalse();
    cleanup();
  });

  // spec: interaction-selection-8d7a74, interaction-selection-92ffad, interaction-selection-ef804a
  it('on desktop, checkboxes show for all items once one item is selected', async () => {
    const {container, cleanup} = await mount(LIST);
    const items = Array.from(container.querySelectorAll<HTMLElement & {checked: boolean}>('md-gb-list-item'));
    items[0].checked = true;
    await settle(container);
    await sleep(150);
    expect(items.every(showsCheckbox)).toBeTrue();
    cleanup();
  });

  // spec: interaction-selection-235498
  it('tapping the avatar of a list item selects it, as a selection shortcut', async () => {
    const {container, cleanup} = await mount(
      `<md-gb-list selectable aria-label="Items" style="width:360px">
        <md-gb-list-item><span slot="avatar">A</span>Apples</md-gb-list-item>
        <md-gb-list-item><span slot="avatar">B</span>Bananas</md-gb-list-item></md-gb-list>`,
    );
    const [one] = Array.from(container.querySelectorAll<HTMLElement & {checked: boolean}>('md-gb-list-item'));
    const avatar = one.querySelector('[slot=avatar]') as HTMLElement;
    const c = center(avatar);
    await sendMouse({type: 'click', position: [c.x, c.y]});
    await sleep(60);
    expect(one.checked).toBeTrue();
    cleanup();
  });
});
