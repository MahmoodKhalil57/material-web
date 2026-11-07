/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../button/md-gb-button.js';
import '../../sheet/md-gb-bottom-sheet.js';
import '../../sheet/md-gb-side-sheet.js';

import {sendMouse} from '@web/test-runner-commands';

import {center, deepElements, settle, until} from './subjects.js';
import {frames} from './states-helpers.js';

// Styles > Motion > Transitions > Enter and exit (styles/motion/transitions.md)
// as the sheets use it: which sheets share the elevation of the main content,
// and from which edge they come.

async function mount(html: string) {
  const container = document.createElement('div');
  container.style.cssText = 'width:800px;height:400px;position:relative';
  container.innerHTML = html;
  document.body.append(container);
  await settle(container);
  await settle(container);
  return {container, cleanup: () => container.remove()};
}

const shadows = (el: Element) =>
  deepElements(el).map((e) => getComputedStyle(e).boxShadow).filter((s) => s !== 'none');

describe('enter and exit with sheets (central)', () => {
  afterEach(() => sendMouse({type: 'move', position: [0, 0]}));

  // spec: motion-transitions-f8cae2, motion-transitions-fb9c84
  it('enters and exits a standard (coplanar) side sheet at the same elevation as the main content', async () => {
    const {container, cleanup} = await mount(`<md-gb-side-sheet quick open aria-label="Details"><p>Content</p></md-gb-side-sheet>`);
    const sheet = container.querySelector('md-gb-side-sheet') as HTMLElement;
    expect(shadows(sheet)).toEqual([]);
    cleanup();
  });

  // spec: motion-transitions-d4a732, motion-transitions-f4616c, motion-transitions-07fb0a
  it('introduces a standard bottom sheet in context of the main UI, leaving both regions usable', async () => {
    const {container, cleanup} = await mount(
      `<md-gb-button id="behind" style="position:absolute;left:20px;top:20px">Map action</md-gb-button>
       <md-gb-bottom-sheet quick open aria-label="Details"><p>Sheet content</p></md-gb-bottom-sheet>`,
    );
    const sheet = container.querySelector('md-gb-bottom-sheet') as HTMLElement & {open: boolean; modal: boolean};
    const behind = container.querySelector('#behind') as HTMLElement;
    expect(sheet.open).toBeTrue();
    expect(sheet.modal).toBeFalse();
    let clicks = 0;
    behind.addEventListener('click', () => clicks++);
    const c = center(behind);
    await sendMouse({type: 'click', position: [c.x, c.y]});
    await until(() => clicks === 1);
    // The sheet must stay open: give any reaction a few frames to show.
    await frames();
    expect(clicks).toBe(1);
    expect(sheet.open).toBeTrue();
    cleanup();
  });

  // spec: motion-transitions-0c3ea4
  it('enters a bottom sheet from the bottom of the screen', async () => {
    const {container, cleanup} = await mount(`<md-gb-bottom-sheet quick modal open aria-label="Sheet"><p>Content</p></md-gb-bottom-sheet>`);
    const sheet = container.querySelector('md-gb-bottom-sheet') as HTMLElement;
    const panel = deepElements(sheet).find((e) => e.classList.contains('bottom-sheet-panel'))!;
    const r = panel.getBoundingClientRect();
    expect(Math.round(r.bottom)).toBe(window.innerHeight);
    cleanup();
  });
});
