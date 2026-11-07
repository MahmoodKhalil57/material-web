/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../list/md-gb-list.js';
import '../../list/md-gb-list-item.js';

import {center, settle, sleep} from './subjects.js';

// Gap checks for foundations/interaction/gestures.md. Run with
// `npm run gb:check -- --gaps ...`.

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

describe('gestures (central gaps)', () => {
  // spec: interaction-gestures-54a60e
  it('picks up and moves a list item with a long press and drag (reorder)', async () => {
    const container = document.createElement('div');
    container.style.cssText = 'padding:24px;width:420px';
    container.innerHTML = `<md-gb-list reorderable style="width:360px" aria-label="Items"><md-gb-list-item>Apples</md-gb-list-item><md-gb-list-item>Bananas</md-gb-list-item><md-gb-list-item>Cherries</md-gb-list-item></md-gb-list>`;
    document.body.append(container);
    await settle(container);
    await settle(container);
    const items = Array.from(container.querySelectorAll<HTMLElement>('md-gb-list-item'));
    const labels = () => Array.from(container.querySelectorAll('md-gb-list-item')).map((i) => i.textContent!.trim());
    const from = center(items[0]);
    const to = center(items[1]);
    touch('pointerdown', items[0], from.x, from.y);
    await sleep(500);
    touch('pointermove', items[0], from.x, Math.round((from.y + to.y) / 2));
    touch('pointermove', items[0], to.x, to.y + 6);
    touch('pointerup', items[0], to.x, to.y + 6);
    await sleep(100);
    expect(labels()).toEqual(['Bananas', 'Apples', 'Cherries']);
    container.remove();
  });
});
