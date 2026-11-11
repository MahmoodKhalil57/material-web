/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../components/appbar/md-gb-app-bar.js';
import '../../components/badge/md-gb-badge.js';
import '../../components/chip/md-gb-chip.js';
import '../../components/chip/md-gb-chip-set.js';
import '../../components/fab/md-gb-fab.js';
import '../../components/iconbutton/md-gb-icon-button.js';
import '../../components/navrail/md-gb-nav-rail.js';
import '../../components/navrail/md-gb-nav-rail-item.js';
import '../../components/progress/md-gb-progress.js';
import '../../components/scaffold/md-gb-pane-scaffold.js';
import '../../components/timepicker/md-gb-time-picker.js';
import '../../components/toolbar/md-gb-toolbar.js';

import {deepElements, settle} from '../../testing/subjects.js';

// Foundations > Layout > Bidirectionality & RTL
// (foundations/layout/bidirectionality-rtl.md): the layouts and component
// examples of the page, in LTR and RTL. The mirroring of every component's own
// layout is `rtl_test.ts`.

async function mount(html: string, dir: 'ltr' | 'rtl') {
  const container = document.createElement('div');
  container.dir = dir;
  container.style.cssText = 'width:1000px;position:relative;padding:20px';
  container.innerHTML = html;
  document.body.append(container);
  await settle(container);
  await settle(container);
  return {container, cleanup: () => container.remove()};
}

/** Mounts the same markup in LTR and RTL. */
async function both(html: string) {
  return {ltr: await mount(html, 'ltr'), rtl: await mount(html, 'rtl')};
}

const rect = (e: Element) => e.getBoundingClientRect();
const q = (root: Element, selector: string) => root.querySelector<HTMLElement>(selector)!;

describe('canonical layouts in RTL', () => {
  const LIST_DETAIL = `<md-gb-pane-scaffold style="height:300px"><div slot="secondary" id="list">List</div><div id="detail">Detail</div></md-gb-pane-scaffold>`;
  const SUPPORTING = `<md-gb-pane-scaffold layout="supporting-pane" style="height:300px"><div slot="secondary" id="support">Support</div><div id="main">Main</div></md-gb-pane-scaffold>`;

  // spec: layout-bidirectionality-rtl-6afc24, layout-bidirectionality-rtl-cea25d, layout-bidirectionality-rtl-021ddf
  it('mirrors list-detail: two side-by-side panes, the list on the leading (right) side in RTL', async () => {
    const {ltr, rtl} = await both(LIST_DETAIL);
    const l = {list: rect(q(ltr.container, '#list')), detail: rect(q(ltr.container, '#detail'))};
    const r = {list: rect(q(rtl.container, '#list')), detail: rect(q(rtl.container, '#detail'))};
    // Side by side on a large window.
    expect(l.list.right).toBeLessThanOrEqual(l.detail.left);
    expect(r.detail.right).toBeLessThanOrEqual(r.list.left);
    // The text of the panes is aligned and flows right to left.
    expect(getComputedStyle(q(rtl.container, '#list')).direction).toBe('rtl');
    expect(getComputedStyle(q(rtl.container, '#list')).textAlign).toMatch(/start|right/);
    ltr.cleanup();
    rtl.cleanup();
  });

  // spec: layout-bidirectionality-rtl-802d85
  it('shows list-detail as a single pane at compact widths', async () => {
    const {container, cleanup} = await mount(
      `<md-gb-pane-scaffold style="height:300px;width:400px"><div slot="secondary" id="list">List</div><div id="detail">Detail</div></md-gb-pane-scaffold>`,
      'rtl',
    );
    const scaffold = q(container, 'md-gb-pane-scaffold');
    expect(scaffold.getAttribute('mode')).toBe('single');
    expect(scaffold.getAttribute('pane-count')).toBe('1');
    cleanup();
  });

  // spec: layout-bidirectionality-rtl-8c430a, layout-bidirectionality-rtl-05d597
  it('mirrors the feed layout: the order of the items starts on the right', async () => {
    const items = Array.from({length: 4}, (_, i) => `<div class="item" style="height:80px">Item ${i}</div>`).join('');
    const feed = `<md-gb-pane-scaffold layout="feed" style="width:1000px">${items}</md-gb-pane-scaffold>`;
    const {ltr, rtl} = await both(feed);
    const first = (c: Element) => rect(c.querySelector('.item')!);
    const second = (c: Element) => rect(c.querySelectorAll('.item')[1]);
    // The first item is the leftmost in LTR and the rightmost in RTL, and the
    // second item sits after it on the same row.
    if (Math.abs(first(ltr.container).top - second(ltr.container).top) < 2) {
      expect(first(ltr.container).left).toBeLessThan(second(ltr.container).left);
      expect(first(rtl.container).left).toBeGreaterThan(second(rtl.container).left);
    }
    expect(first(rtl.container).right).toBeGreaterThan(first(rtl.container).left);
    expect(getComputedStyle(q(rtl.container, '.item')).direction).toBe('rtl');
    ltr.cleanup();
    rtl.cleanup();
  });

  // spec: layout-bidirectionality-rtl-be3bb9, layout-bidirectionality-rtl-5fa3d9, layout-bidirectionality-rtl-1c5f18
  it('mirrors the supporting pane layout: the supporting pane moves to the left, its text flows right to left', async () => {
    const {ltr, rtl} = await both(SUPPORTING);
    expect(rect(q(ltr.container, '#support')).left).toBeGreaterThan(rect(q(ltr.container, '#main')).left);
    const support = rect(q(rtl.container, '#support'));
    const main = rect(q(rtl.container, '#main'));
    expect(support.right).toBeLessThanOrEqual(main.left);
    expect(getComputedStyle(q(rtl.container, '#support')).direction).toBe('rtl');
    ltr.cleanup();
    rtl.cleanup();
  });
});

describe('component examples in RTL', () => {
  // spec: layout-bidirectionality-rtl-53535e, layout-bidirectionality-rtl-5d64ff, layout-bidirectionality-rtl-f89338
  it('places badges at the top left of their icon in RTL', async () => {
    const html = (badge: string) => `<span class="icon" style="position:relative;display:inline-block;inline-size:24px;block-size:24px">${badge}</span><span>Inbox</span>`;
    for (const badge of ['<md-gb-badge anchored></md-gb-badge>', '<md-gb-badge anchored value="3"></md-gb-badge>']) {
      const {ltr, rtl} = await both(html(badge));
      const l = {icon: rect(q(ltr.container, '.icon')), badge: rect(q(ltr.container, 'md-gb-badge'))};
      const r = {icon: rect(q(rtl.container, '.icon')), badge: rect(q(rtl.container, 'md-gb-badge'))};
      // LTR: top right of the icon. RTL: the mirror image, top left.
      expect(l.badge.right).toBeGreaterThan(l.icon.left + l.icon.width / 2);
      expect(r.badge.left).toBeLessThan(r.icon.left + r.icon.width / 2);
      expect(Math.round(r.icon.left - r.badge.left)).toBe(Math.round(l.badge.right - l.icon.right));
      expect(Math.round(r.badge.top - r.icon.top)).toBe(Math.round(l.badge.top - l.icon.top));
      ltr.cleanup();
      rtl.cleanup();
    }
  });

  // spec: layout-bidirectionality-rtl-a525a6, layout-bidirectionality-rtl-4a8285
  it('mirrors the order of the tools of a toolbar, with the FAB on the left in RTL', async () => {
    const html = `<md-gb-toolbar style="width:400px"><md-gb-icon-button aria-label="Edit" id="t1"><md-gb-icon>edit</md-gb-icon></md-gb-icon-button><md-gb-icon-button aria-label="Share" id="t2"><md-gb-icon>share</md-gb-icon></md-gb-icon-button><md-gb-fab slot="fab" aria-label="Add" id="fab"><md-gb-icon>add</md-gb-icon></md-gb-fab></md-gb-toolbar>`;
    const {ltr, rtl} = await both(html);
    const at = (c: Element) => ({t1: rect(q(c, '#t1')), t2: rect(q(c, '#t2')), fab: rect(q(c, '#fab'))});
    const l = at(ltr.container);
    const r = at(rtl.container);
    expect(l.t1.left).toBeLessThan(l.t2.left);
    expect(r.t1.left).toBeGreaterThan(r.t2.left);
    expect(l.fab.left).toBeGreaterThan(l.t2.left);
    expect(r.fab.right).toBeLessThan(r.t2.left);
    ltr.cleanup();
    rtl.cleanup();
  });

  // spec: layout-bidirectionality-rtl-560711, layout-bidirectionality-rtl-1e8b30, layout-bidirectionality-rtl-ca3b66
  it('mirrors the layout of an app bar: leading action on the right, trailing action on the left', async () => {
    const html = `<md-gb-app-bar><md-gb-icon-button slot="leading" aria-label="Back" id="lead"><md-gb-icon>arrow_back</md-gb-icon></md-gb-icon-button>Title<md-gb-icon-button slot="trailing" aria-label="Search" id="trail"><md-gb-icon>search</md-gb-icon></md-gb-icon-button></md-gb-app-bar>`;
    const {ltr, rtl} = await both(html);
    const bar = (c: Element) => rect(q(c, 'md-gb-app-bar'));
    expect(rect(q(ltr.container, '#lead')).left - bar(ltr.container).left).toBeLessThan(40);
    expect(rect(q(ltr.container, '#trail')).right).toBeGreaterThan(bar(ltr.container).right - 40);
    expect(bar(rtl.container).right - rect(q(rtl.container, '#lead')).right).toBeLessThan(40);
    expect(rect(q(rtl.container, '#trail')).left).toBeLessThan(bar(rtl.container).left + 40);
    ltr.cleanup();
    rtl.cleanup();
  });

  // spec: layout-bidirectionality-rtl-063245, layout-bidirectionality-rtl-782f87, layout-bidirectionality-rtl-f9e514, layout-bidirectionality-rtl-bd3499
  it('sets a navigation rail on the leading edge: left in LTR, right in RTL', async () => {
    const html = `<div style="display:flex;height:300px"><md-gb-nav-rail aria-label="Main" id="rail"><md-gb-nav-rail-item selected><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-rail-item></md-gb-nav-rail><main style="flex:1" id="content">Content</main></div>`;
    const {ltr, rtl} = await both(html);
    expect(rect(q(ltr.container, '#rail')).left).toBeLessThan(rect(q(ltr.container, '#content')).left);
    expect(rect(q(rtl.container, '#rail')).left).toBeGreaterThan(rect(q(rtl.container, '#content')).left);
    ltr.cleanup();
    rtl.cleanup();
  });

  // spec: layout-bidirectionality-rtl-089350, layout-bidirectionality-rtl-878222
  it('opens an expanded navigation rail from the leading edge: left in LTR, right in RTL', async () => {
    const html = `<md-gb-nav-rail modal expanded quick aria-label="Main" id="rail"><md-gb-nav-rail-item selected>Home</md-gb-nav-rail-item></md-gb-nav-rail>`;
    const {ltr, rtl} = await both(html);
    const panel = (c: Element) => rect(q(c, '#rail').shadowRoot!.querySelector('.nav-rail')!);
    const lc = rect(ltr.container);
    const rc = rect(rtl.container);
    expect(Math.round(panel(ltr.container).left - lc.left)).toBeLessThanOrEqual(20);
    expect(Math.round(rc.right - panel(rtl.container).right)).toBeLessThanOrEqual(20);
    ltr.cleanup();
    rtl.cleanup();
  });

  // spec: layout-bidirectionality-rtl-1074a5
  it('places the trailing icon of a chip on the right in LTR and on the left in RTL', async () => {
    const html = `<md-gb-chip-set><md-gb-chip type="input" id="chip">Label<md-gb-icon slot="trailing-icon">close</md-gb-icon></md-gb-chip></md-gb-chip-set>`;
    const {ltr, rtl} = await both(html);
    const side = (c: Element) => {
      const chip = rect(q(c, '#chip'));
      const icon = rect(q(c, '#chip md-gb-icon'));
      return icon.left + icon.width / 2 > chip.left + chip.width / 2 ? 'right' : 'left';
    };
    expect(side(ltr.container)).toBe('right');
    expect(side(rtl.container)).toBe('left');
    ltr.cleanup();
    rtl.cleanup();
  });
});

describe('time in RTL', () => {
  /** The inactive (remaining) track and the whole bar of a linear progress. */
  function remaining(c: Element) {
    const bar = q(c, 'md-gb-progress');
    const track = bar.shadowRoot!.querySelector('.progress-track-1')!;
    return {bar: rect(bar), track: rect(track)};
  }

  // spec: layout-bidirectionality-rtl-acb885, layout-bidirectionality-rtl-4998c3
  it('fills a linear progress indicator from the right in RTL, and from the left when it is kept LTR', async () => {
    const html = `<md-gb-progress value="0.5" style="width:300px" aria-label="Progress"></md-gb-progress>`;
    const {ltr, rtl} = await both(html);
    const l = remaining(ltr.container);
    const r = remaining(rtl.container);
    // The part still to do is at the end: right in LTR, left in RTL.
    expect(l.track.right).toBeGreaterThan(l.bar.right - 8);
    expect(r.track.left).toBeLessThan(r.bar.left + 8);
    ltr.cleanup();
    rtl.cleanup();
    // Hebrew: the indicator stays LTR when its direction is set.
    const kept = await mount(`<div dir="ltr">${html}</div>`, 'rtl');
    const k = remaining(kept.container);
    expect(k.track.right).toBeGreaterThan(k.bar.right - 8);
    kept.cleanup();
  });

  // spec: layout-bidirectionality-rtl-0010cb, layout-bidirectionality-rtl-e876da
  it('moves a circular progress indicator the same way, clockwise, in RTL (it is not mirrored)', async () => {
    const html = `<md-gb-progress circular value="0.5" aria-label="Progress"></md-gb-progress>`;
    const {ltr, rtl} = await both(html);
    const transforms = (c: Element) => deepElements(q(c, 'md-gb-progress')).map((e) => getComputedStyle(e).transform);
    expect(transforms(rtl.container)).toEqual(transforms(ltr.container));
    // No horizontal flip anywhere in its parts.
    for (const t of transforms(rtl.container)) {
      const m = t.match(/matrix\(([^)]+)\)/);
      if (m) expect(Number(m[1].split(',')[0])).toBeGreaterThan(-0.5);
    }
    ltr.cleanup();
    rtl.cleanup();
  });

  const PICKER = `<md-gb-time-picker value="03:00" hour-cycle="12" quick></md-gb-time-picker>`;

  // spec: layout-bidirectionality-rtl-c9a344, layout-bidirectionality-rtl-de083e, layout-bidirectionality-rtl-4b057d
  it('keeps the dial of a clock turning clockwise in RTL: 3 on the right, 9 on the left', async () => {
    const {ltr, rtl} = await both(PICKER);
    const labelRect = (c: Element, text: string) => {
      const picker = q(c, 'md-gb-time-picker');
      const label = deepElements(picker).find(
        (e) => e.classList.contains('time-picker-dial-label') && e.textContent!.trim() === text,
      )!;
      return rect(label);
    };
    for (const c of [ltr.container, rtl.container]) {
      const dial = rect(deepElements(q(c, 'md-gb-time-picker')).find((e) => e.classList.contains('time-picker-dial-face'))!);
      const centerX = dial.left + dial.width / 2;
      expect(labelRect(c, '3').left).toBeGreaterThan(centerX);
      expect(labelRect(c, '9').right).toBeLessThan(centerX);
      expect(labelRect(c, '12').top).toBeLessThan(labelRect(c, '6').top);
    }
    ltr.cleanup();
    rtl.cleanup();
  });

  // spec: layout-bidirectionality-rtl-f438f3, layout-bidirectionality-rtl-4b057d
  it('puts the AM/PM selector of a 12-hour clock on the left in RTL (mirrored UI elements)', async () => {
    const {ltr, rtl} = await both(PICKER);
    const side = (c: Element) => {
      const picker = q(c, 'md-gb-time-picker');
      const all = deepElements(picker);
      const period = all.find((e) => e.classList.contains('time-picker-period'))!;
      const time = all.find((e) => e.classList.contains('time-picker-time'))!;
      return rect(period).left + rect(period).width / 2 > rect(time).left + rect(time).width / 2 ? 'right' : 'left';
    };
    expect(side(ltr.container)).toBe('right');
    expect(side(rtl.container)).toBe('left');
    ltr.cleanup();
    rtl.cleanup();
  });
});
