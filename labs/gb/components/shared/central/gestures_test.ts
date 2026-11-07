/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../../../aria/tabs/md-aria-tabpanel.js';
import '../../list/md-gb-list.js';
import '../../list/md-gb-list-item.js';
import '../../tabs/md-gb-tabs.js';
import '../../tabs/md-gb-tab.js';
import '../../tabs/md-gb-tab-panels.js';

import {sendMouse} from '@web/test-runner-commands';

import {center, settle, sleep} from './subjects.js';

// Foundations > Interaction > Gestures (foundations/interaction/gestures.md):
// the touch gestures that components respond to. Scrolling, panning, pinch,
// double tap to zoom and compound gestures are the platform's or the app's
// content (listed in `scripts/m3/exclusions/interaction-motion.md`).

async function mount(html: string, dir = 'ltr') {
  const container = document.createElement('div');
  container.dir = dir;
  container.style.cssText = 'padding:24px;position:relative;width:420px';
  container.innerHTML = html;
  document.body.append(container);
  await settle(container);
  await settle(container);
  return {container, cleanup: () => container.remove()};
}

/** Dispatches a touch pointer event with a given time stamp. */
function touch(type: string, target: Element, x: number, y: number, time = 0) {
  const event = new PointerEvent(type, {
    bubbles: true,
    composed: true,
    cancelable: true,
    pointerId: 3,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    clientX: x,
    clientY: y,
  });
  Object.defineProperty(event, 'timeStamp', {value: time});
  target.dispatchEvent(event);
}

/** A swipe along x: pointer down at `from`, moves, up at `to` (a quick flick). */
async function swipe(target: Element, from: number, to: number, y: number) {
  touch('pointerdown', target, from, y, 0);
  const steps = 4;
  for (let i = 1; i <= steps; i++) {
    touch('pointermove', target, from + ((to - from) * i) / steps, y, i * 40);
  }
  await sleep(20);
  touch('pointerup', target, to, y, steps * 40 + 20);
  await sleep(60);
}

const TABS = `<md-gb-tabs aria-label="Views">
    <md-gb-tab><span slot="label">One</span></md-gb-tab>
    <md-gb-tab><span slot="label">Two</span></md-gb-tab>
    <md-gb-tab><span slot="label">Three</span></md-gb-tab></md-gb-tabs>
  <md-gb-tab-panels style="inline-size:400px">
    <md-aria-tabpanel>Panel one</md-aria-tabpanel>
    <md-aria-tabpanel>Panel two</md-aria-tabpanel>
    <md-aria-tabpanel>Panel three</md-aria-tabpanel></md-gb-tab-panels>`;

describe('gestures (central)', () => {
  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: interaction-gestures-a18734, interaction-gestures-bf6fbd
  it('swipes horizontally between peer views like tabs', async () => {
    const {container, cleanup} = await mount(TABS);
    const tabs = container.querySelector('md-gb-tabs') as HTMLElement & {selectedTabIndex: number};
    const panel = container.querySelector('md-aria-tabpanel') as HTMLElement;
    const r = panel.getBoundingClientRect();
    expect(tabs.selectedTabIndex).toBe(0);
    await swipe(panel, Math.round(r.right - 20), Math.round(r.left + 40), Math.round(r.top + 10));
    await sleep(300);
    expect(tabs.selectedTabIndex).toBe(1);
    cleanup();
  });

  // spec: interaction-gestures-a18734, interaction-gestures-bf6fbd, layout-bidirectionality-rtl-f4b9c2
  it('mirrors the swipe between peer views in right-to-left layouts', async () => {
    const {container, cleanup} = await mount(TABS, 'rtl');
    const tabs = container.querySelector('md-gb-tabs') as HTMLElement & {selectedTabIndex: number};
    const panel = container.querySelector('md-aria-tabpanel') as HTMLElement;
    const r = panel.getBoundingClientRect();
    // The next view is reached by swiping to the right (toward the end side).
    await swipe(panel, Math.round(r.left + 20), Math.round(r.right - 40), Math.round(r.top + 10));
    await sleep(300);
    expect(tabs.selectedTabIndex).toBe(1);
    cleanup();
  });

  const LIST_ITEM = (extra = '') => `<md-gb-list ${extra} style="width:360px" aria-label="Items">
      <md-gb-list-item>Fresh baked breads
        <button slot="leading-actions" aria-label="Pin">P</button>
        <button slot="trailing-actions" aria-label="Archive">A</button>
      </md-gb-list-item></md-gb-list>`;

  // spec: interaction-gestures-a18734, interaction-gestures-ae499a
  it('swipes a list item to complete actions: the actions are revealed', async () => {
    const {container, cleanup} = await mount(LIST_ITEM());
    const item = container.querySelector('md-gb-list-item') as HTMLElement & {revealed: string};
    const body = item.shadowRoot!.querySelector('.list-item') as HTMLElement;
    const r = body.getBoundingClientRect();
    const y = Math.round(r.top + r.height / 2);
    expect(item.revealed).toBe('');
    await swipe(body, Math.round(r.right - 40), Math.round(r.right - 140), y);
    await sleep(300);
    expect(item.revealed).toBe('trailing');
    cleanup();
  });

  // spec: interaction-gestures-ae499a, layout-bidirectionality-rtl-f4b9c2
  it('reveals the actions from the opposite side in right-to-left layouts', async () => {
    const {container, cleanup} = await mount(LIST_ITEM(), 'rtl');
    const item = container.querySelector('md-gb-list-item') as HTMLElement & {revealed: string};
    const body = item.shadowRoot!.querySelector('.list-item') as HTMLElement;
    const r = body.getBoundingClientRect();
    const y = Math.round(r.top + r.height / 2);
    // Trailing actions sit at the left in RTL, so the swipe goes to the right.
    await swipe(body, Math.round(r.left + 40), Math.round(r.left + 140), y);
    await sleep(300);
    expect(item.revealed).toBe('trailing');
    cleanup();
  });

  // spec: interaction-gestures-cd4784, interaction-gestures-58aa44
  it('selects a list item with a long press (extra functionality on press and hold)', async () => {
    const {container, cleanup} = await mount(
      `<md-gb-list selectable style="width:360px" aria-label="Items"><md-gb-list-item>Apples</md-gb-list-item><md-gb-list-item>Bananas</md-gb-list-item></md-gb-list>`,
    );
    const [one, two] = Array.from(container.querySelectorAll<HTMLElement & {checked: boolean}>('md-gb-list-item'));
    const c = center(one);
    touch('pointerdown', one, c.x, c.y);
    await sleep(450);
    touch('pointerup', one, c.x, c.y);
    expect(one.checked).toBeTrue();
    expect(two.checked).toBeFalse();
    cleanup();
  });

  // spec: interaction-gestures-d51b5f, interaction-gestures-10d031
  it('reorders a list by dragging a list item', async () => {
    const {container, cleanup} = await mount(
      `<md-gb-list reorderable style="width:360px" aria-label="Items"><md-gb-list-item>Apples</md-gb-list-item><md-gb-list-item>Bananas</md-gb-list-item><md-gb-list-item>Cherries</md-gb-list-item></md-gb-list>`,
    );
    const items = Array.from(container.querySelectorAll<HTMLElement>('md-gb-list-item'));
    const labels = () => Array.from(container.querySelectorAll('md-gb-list-item')).map((i) => i.textContent!.trim());
    const handle = items[0].shadowRoot!.querySelector('.list-item-drag-handle') as HTMLElement;
    const c = center(handle);
    const target = center(items[1]).y + 6;
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await sendMouse({type: 'down'});
    await sendMouse({type: 'move', position: [c.x, Math.round((c.y + target) / 2)]});
    await sendMouse({type: 'move', position: [c.x, target]});
    await sendMouse({type: 'up'});
    await sleep(100);
    expect(labels()).toEqual(['Bananas', 'Apples', 'Cherries']);
    cleanup();
  });
});
