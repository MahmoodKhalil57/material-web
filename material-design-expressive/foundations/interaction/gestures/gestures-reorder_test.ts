/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../../components/list/md-gb-list.js';
import '../../../components/list/md-gb-list-item.js';

import {center, settle, until} from '../../../testing/subjects.js';

// foundations/interaction/gestures.md: pick up and move.

function touch(type: string, target: Element, x: number, y: number) {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      pointerId: 5,
      pointerType: 'touch',
      isPrimary: true,
      button: 0,
      clientX: x,
      clientY: y,
    }),
  );
}

async function mount(attrs: string) {
  const container = document.createElement('div');
  container.style.cssText = 'padding:24px;width:420px';
  container.innerHTML = `<md-gb-list ${attrs} style="width:360px" aria-label="Items"><md-gb-list-item>Apples</md-gb-list-item><md-gb-list-item>Bananas</md-gb-list-item><md-gb-list-item>Cherries</md-gb-list-item></md-gb-list>`;
  document.body.append(container);
  await settle(container);
  await settle(container);
  const items = Array.from(container.querySelectorAll<HTMLElement>('md-gb-list-item'));
  const labels = () => Array.from(container.querySelectorAll('md-gb-list-item')).map((i) => i.textContent!.trim());
  return {container, items, labels};
}

describe('gestures (central)', () => {
  // spec: interaction-gestures-54a60e
  it('picks up and moves a list item with a long press and drag (reorder)', async () => {
    const {container, items, labels} = await mount('reorderable');
    const from = center(items[0]);
    const to = center(items[1]);
    touch('pointerdown', items[0], from.x, from.y);
    expect(await until(() => items[0].hasAttribute('dragging'))).toBeTrue();
    touch('pointermove', items[0], from.x, Math.round((from.y + to.y) / 2));
    touch('pointermove', items[0], to.x, to.y + 6);
    touch('pointerup', items[0], to.x, to.y + 6);
    expect(await until(() => labels()[0] === 'Bananas')).toBeTrue();
    expect(labels()).toEqual(['Bananas', 'Apples', 'Cherries']);
    expect(items[0].hasAttribute('dragging')).toBeFalse();
    container.remove();
  });

  it('a quick drag is not a long press: the list does not reorder', async () => {
    const {container, items, labels} = await mount('reorderable');
    const from = center(items[0]);
    const to = center(items[1]);
    touch('pointerdown', items[0], from.x, from.y);
    touch('pointermove', items[0], to.x, to.y + 6);
    touch('pointerup', items[0], to.x, to.y + 6);
    await settle(container);
    expect(labels()).toEqual(['Apples', 'Bananas', 'Cherries']);
    container.remove();
  });
});
