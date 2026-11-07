/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import {simulateViewportSegments} from '../../styles/layout/viewport-segments.js';

import {type AppScaffoldElement} from './app-scaffold-element.js';
import {resolveNavigation, shouldExpandRail} from './app-scaffold.js';
import './md-gb-app-scaffold.js';
import './md-gb-pane-scaffold.js';
import {
  type PaneResizeDetail,
  type PaneScaffoldElement,
} from './pane-scaffold-element.js';
import {
  nearestSnapTarget,
  nextPaneSnapTarget,
  paneScaffoldClasses,
  paneSnapTargets,
  planPanes,
} from './pane-scaffold.js';

/** Waits for the element's next window size class change. */
function classChange(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    el.addEventListener('window-class-change', () => resolve(), {once: true});
  });
}

describe('planPanes()', () => {
  it('shows the list in a compact list-detail layout', () => {
    const plan = planPanes({
      layout: 'list-detail',
      windowClass: 'compact',
      hasSecondary: true,
    });
    expect(plan.mode).toBe('single');
    expect(plan.visible).toEqual(['secondary']);
  });

  it('shows the detail in a compact list-detail layout when open', () => {
    const plan = planPanes({
      layout: 'list-detail',
      windowClass: 'compact',
      hasSecondary: true,
      detailOpen: true,
    });
    expect(plan.visible).toEqual(['primary']);
  });

  it('uses one pane at medium unless medium-two-pane is set', () => {
    const state = {
      layout: 'list-detail' as const,
      windowClass: 'medium' as const,
      hasSecondary: true,
    };
    expect(planPanes(state).mode).toBe('single');
    expect(planPanes({...state, mediumTwoPane: true}).mode).toBe('two-pane');
  });

  it('uses two panes at expanded, large and extra-large', () => {
    for (const windowClass of ['expanded', 'large', 'extra-large'] as const) {
      const plan = planPanes({
        layout: 'list-detail',
        windowClass,
        hasSecondary: true,
      });
      expect(plan.mode).withContext(windowClass).toBe('two-pane');
      expect(plan.paneCount).withContext(windowClass).toBe(2);
    }
  });

  // spec: layout-canonical-examples-eaec2e, layout-canonical-examples-444991, layout-canonical-examples-d27fc5, layout-canonical-examples-d28065
  it('stacks the supporting pane below at compact and medium', () => {
    for (const windowClass of ['compact', 'medium'] as const) {
      const plan = planPanes({
        layout: 'supporting-pane',
        windowClass,
        hasSecondary: true,
      });
      expect(plan.mode).withContext(windowClass).toBe('stacked');
      expect(plan.visible).toEqual(['primary', 'secondary']);
    }
  });

  // spec: layout-scaffold-88b22a, layout-scaffold-8b2cb5
  it('shows a third pane at extra-large only', () => {
    const state = {
      layout: 'list-detail' as const,
      hasSecondary: true,
      hasTertiary: true,
    };
    expect(planPanes({...state, windowClass: 'large'}).tertiary).toBeFalse();
    const xl = planPanes({...state, windowClass: 'extra-large'});
    expect(xl.tertiary).toBeTrue();
    expect(xl.paneCount).toBe(3);
  });

  it('hides a collapsed pane', () => {
    const plan = planPanes({
      layout: 'list-detail',
      windowClass: 'expanded',
      hasSecondary: true,
      collapsedPane: 'secondary',
    });
    expect(plan.visible).toEqual(['primary']);
    expect(plan.paneCount).toBe(1);
  });
});

describe('paneSnapTargets()', () => {
  // spec: layout-breakpoints-d481ce, layout-scaffold-57e7c5, layout-overview-378e6d, layout-scaffold-40a879, layout-scaffold-583685, layout-scaffold-dddd06
  it('snaps to 0, 360, 412, split and full at expanded and larger', () => {
    expect(paneSnapTargets('large', 1000, 480)).toEqual([
      0, 360, 412, 480, 1000,
    ]);
  });

  it('snaps to 0, half and full at medium', () => {
    expect(paneSnapTargets('medium', 600)).toEqual([0, 300, 600]);
  });

  it('drops widths larger than the available space', () => {
    expect(paneSnapTargets('expanded', 400, 200)).toEqual([0, 200, 360, 400]);
  });

  it('picks the nearest target', () => {
    expect(nearestSnapTarget(390, [0, 360, 412])).toBe(412);
    expect(nearestSnapTarget(40, [0, 360, 412])).toBe(0);
  });
});

describe('resolveNavigation()', () => {
  const both = {hasBar: true, hasRail: true};

  it('follows the spec per window size class', () => {
    const nav = (
      windowClass: Parameters<typeof resolveNavigation>[0]['windowClass'],
      paneCount = 1,
    ) =>
      resolveNavigation({
        navigation: 'auto',
        windowClass,
        paneCount,
        ...both,
      });
    expect(nav('compact')).toBe('bar');
    expect(nav('medium')).toBe('rail');
    expect(nav('medium', 2)).toBe('bar');
    expect(nav('expanded')).toBe('rail');
    expect(nav('extra-large', 2)).toBe('rail');
  });

  it('falls back to the provided component', () => {
    expect(
      resolveNavigation({
        navigation: 'auto',
        windowClass: 'compact',
        hasRail: true,
      }),
    ).toBe('rail');
    expect(
      resolveNavigation({
        navigation: 'rail',
        windowClass: 'large',
        hasBar: true,
      }),
    ).toBe('bar');
    expect(
      resolveNavigation({navigation: 'none', windowClass: 'large', ...both}),
    ).toBe('none');
  });

  it('expands the rail at large and extra-large', () => {
    expect(shouldExpandRail('expanded')).toBeFalse();
    expect(shouldExpandRail('large')).toBeTrue();
  });
});

describe('paneScaffoldClasses()', () => {
  it('maps the state to classes', () => {
    expect(
      paneScaffoldClasses({mode: 'two-pane', split: true, layout: 'feed'}),
    ).toEqual(
      jasmine.objectContaining({
        'pane-scaffold': true,
        'pane-scaffold-two-pane': true,
        'pane-scaffold-split': true,
        'pane-scaffold-feed': true,
        'pane-scaffold-single': false,
      }),
    );
  });
});

describe('<md-gb-pane-scaffold>', () => {
  const env = new Environment();

  async function setup(
    width: number,
    content: TemplateResult,
    dir: 'ltr' | 'rtl' = 'ltr',
  ) {
    const root = env.render(
      html`<div dir=${dir} style="width:${width}px;height:400px">
        ${content}
      </div>`,
    );
    await env.waitForStability();
    const scaffold = root.querySelector('md-gb-pane-scaffold')!;
    const frame = root.firstElementChild as HTMLElement;
    const pane = (name: string) =>
      scaffold.shadowRoot!.querySelector<HTMLElement>(`.pane-${name}`)!;
    const isShown = (name: string) => {
      const el = pane(name);
      const style = getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    };
    return {root, scaffold, frame, pane, isShown};
  }

  const listDetail = () =>
    html`<md-gb-pane-scaffold>
      <div slot="secondary"><button class="item">Item</button></div>
      <div class="detail">Detail</div>
      <div slot="placeholder" class="placeholder">Select an item</div>
    </md-gb-pane-scaffold>`;

  it('reflects the window size class of its own width', async () => {
    const {scaffold} = await setup(500, listDetail());
    expect(scaffold.windowClass).toBe('compact');
    expect(scaffold.getAttribute('window-class')).toBe('compact');
  });

  it('applies the class margins to the panes', async () => {
    const {scaffold} = await setup(500, listDetail());
    const container = scaffold.shadowRoot!.querySelector('.pane-scaffold')!;
    expect(getComputedStyle(container).paddingInlineStart).toBe('16px');
  });

  // spec: layout-canonical-examples-9a00d0, layout-canonical-examples-771ee3, layout-canonical-examples-f0fe0a, layout-canonical-examples-a6b1a8
  it('shows one pane at compact and swaps to the detail', async () => {
    const {scaffold, isShown} = await setup(500, listDetail());
    expect(isShown('secondary')).toBeTrue();
    expect(isShown('primary')).toBeFalse();
    expect(scaffold.singlePane).toBeTrue();
    expect(scaffold.getAttribute('mode')).toBe('single');

    scaffold.openDetail();
    await env.waitForStability();
    expect(isShown('secondary')).toBeFalse();
    expect(isShown('primary')).toBeTrue();

    scaffold.closeDetail();
    await env.waitForStability();
    expect(isShown('secondary')).toBeTrue();
  });

  it('moves focus to the detail and back in a single pane', async () => {
    const {root, scaffold, pane} = await setup(500, listDetail());
    const item = root.querySelector<HTMLButtonElement>('.item')!;
    item.focus();
    scaffold.openDetail();
    await env.waitForStability();
    expect(scaffold.shadowRoot!.activeElement).toBe(pane('primary'));
    scaffold.closeDetail();
    await env.waitForStability();
    expect(document.activeElement).toBe(item);
  });

  // spec: layout-scaffold-404e4f, layout-scaffold-c07466, layout-canonical-examples-c5a94a, layout-canonical-examples-566b84, layout-overview-efb0eb, layout-scaffold-5bc59b, layout-breakpoints-4e1827
  it('shows both panes at expanded with a 360px fixed list', async () => {
    const {scaffold, pane, isShown} = await setup(1000, listDetail());
    expect(scaffold.windowClass).toBe('expanded');
    expect(isShown('secondary')).toBeTrue();
    expect(isShown('primary')).toBeTrue();
    expect(pane('secondary').getBoundingClientRect().width).toBeCloseTo(360, 0);
    expect(scaffold.paneCount).toBe(2);
    expect(scaffold.getAttribute('pane-count')).toBe('2');
  });

  it('uses a 412px fixed pane at large', async () => {
    const {pane} = await setup(1300, listDetail());
    expect(pane('secondary').getBoundingClientRect().width).toBeCloseTo(412, 0);
  });

  // spec: layout-canonical-examples-6600fc, layout-canonical-examples-dd3b35
  it('shows the placeholder in two panes until the detail opens', async () => {
    const {root, scaffold} = await setup(1000, listDetail());
    const placeholder = root.querySelector<HTMLElement>('.placeholder')!;
    const detail = root.querySelector<HTMLElement>('.detail')!;
    expect(placeholder.getClientRects().length).toBeGreaterThan(0);
    expect(detail.getClientRects().length).toBe(0);
    scaffold.detailOpen = true;
    await env.waitForStability();
    expect(placeholder.getClientRects().length).toBe(0);
    expect(detail.getClientRects().length).toBeGreaterThan(0);
  });

  // spec: layout-scaffold-39c2e5, layout-scaffold-83733f, layout-breakpoints-4e025d, layout-breakpoints-780cd4, layout-breakpoints-26fc7f, layout-scaffold-2867c6
  it('splits medium two-pane layouts 50/50', async () => {
    const {scaffold, pane} = await setup(
      700,
      html`<md-gb-pane-scaffold medium-two-pane>
        <div slot="secondary">List</div>
        <div>Detail</div>
      </md-gb-pane-scaffold>`,
    );
    expect(scaffold.mode).toBe('two-pane');
    const a = pane('secondary').getBoundingClientRect().width;
    const b = pane('primary').getBoundingClientRect().width;
    // 700 - 2 * 24 margin - 24 spacer = 628 => 314 each.
    expect(a).toBeCloseTo(314, 0);
    expect(b).toBeCloseTo(314, 0);
  });

  // spec: layout-scaffold-742d83, layout-scaffold-48f69f, layout-scaffold-ba81a9, layout-scaffold-c80a1a, layout-scaffold-2e92e2, layout-canonical-examples-e3a17d
  it('reflows when the window size class changes', async () => {
    const {scaffold, frame, isShown} = await setup(1000, listDetail());
    expect(scaffold.mode).toBe('two-pane');
    const changed = classChange(scaffold);
    frame.style.width = '500px';
    await changed;
    await env.waitForStability();
    expect(scaffold.windowClass).toBe('compact');
    expect(scaffold.mode).toBe('single');
    expect(isShown('primary')).toBeFalse();
  });

  it('fires pane-layout-change with the visible panes', async () => {
    const root = env.render(html`<div style="width:1000px"></div>`);
    const frame = root.firstElementChild as HTMLElement;
    const events: Array<{paneCount: number; visiblePanes: string[]}> = [];
    frame.addEventListener('pane-layout-change', (e) => {
      events.push((e as CustomEvent).detail);
    });
    const scaffold = document.createElement('md-gb-pane-scaffold');
    scaffold.innerHTML = '<div slot="secondary">List</div><div>Detail</div>';
    frame.appendChild(scaffold);
    await env.waitForStability();
    await env.waitForStability();
    const last = events[events.length - 1];
    expect(last.paneCount).toBe(2);
    expect(last.visiblePanes).toEqual(['secondary', 'primary']);
  });

  describe('supporting pane', () => {
    const supporting = html`<md-gb-pane-scaffold layout="supporting-pane">
      <div class="focus">Focus</div>
      <div slot="secondary" class="support">Support</div>
    </md-gb-pane-scaffold>`;

    // spec: layout-scaffold-8cd68d, layout-scaffold-eb9816, layout-scaffold-805c34
    it('stacks the supporting pane below at compact', async () => {
      const {scaffold, pane} = await setup(500, supporting);
      expect(scaffold.mode).toBe('stacked');
      expect(pane('secondary').getBoundingClientRect().top).toBeGreaterThan(
        pane('primary').getBoundingClientRect().top,
      );
    });

    // spec: layout-scaffold-404346, layout-scaffold-7d34b7, layout-canonical-examples-5e54c8, layout-canonical-examples-4d9065, layout-canonical-examples-a32f8d
    it('puts a 360px supporting pane on the trailing side at expanded', async () => {
      const {pane} = await setup(1000, supporting);
      const primary = pane('primary').getBoundingClientRect();
      const secondary = pane('secondary').getBoundingClientRect();
      expect(secondary.width).toBeCloseTo(360, 0);
      expect(secondary.left).toBeGreaterThan(primary.left);
    });

    it('mirrors in RTL', async () => {
      const {pane} = await setup(1000, supporting, 'rtl');
      const primary = pane('primary').getBoundingClientRect();
      const secondary = pane('secondary').getBoundingClientRect();
      expect(secondary.left).toBeLessThan(primary.left);
    });
  });

  describe('feed', () => {
    const feed = html`<md-gb-pane-scaffold layout="feed">
      ${[1, 2, 3, 4, 5, 6].map((i) => html`<div class="card">${i}</div>`)}
    </md-gb-pane-scaffold>`;

    function columnCount(scaffold: PaneScaffoldElement) {
      const primary = scaffold.shadowRoot!.querySelector('.pane-primary')!;
      return getComputedStyle(primary)
        .gridTemplateColumns.split(' ')
        .filter(Boolean).length;
    }

    // spec: layout-canonical-examples-34064f, layout-canonical-examples-7da338, layout-canonical-examples-d1ebe0
    it('stacks the feed at compact', async () => {
      const {scaffold} = await setup(500, feed);
      expect(columnCount(scaffold)).toBe(1);
    });

    // spec: layout-canonical-examples-34064f, layout-canonical-examples-e5fdf6, layout-canonical-examples-71a1c8, layout-canonical-examples-5c7c7f, layout-canonical-examples-bfdef6, layout-canonical-examples-25c7b4, layout-canonical-examples-9a6102
    it('adds columns as the window grows', async () => {
      const {scaffold, frame} = await setup(700, feed);
      expect(columnCount(scaffold)).toBe(4);
      const changed = classChange(scaffold);
      frame.style.width = '1300px';
      await changed;
      await env.waitForStability();
      expect(columnCount(scaffold)).toBe(6);
    });
  });

  // spec: layout-scaffold-88b22a, layout-scaffold-8b2cb5, layout-scaffold-3e9154, layout-overview-402541
  it('shows the tertiary pane at extra-large only', async () => {
    const content = html`<md-gb-pane-scaffold>
      <div slot="secondary">List</div>
      <div>Detail</div>
      <div slot="tertiary">Sheet</div>
    </md-gb-pane-scaffold>`;
    const large = await setup(1300, content);
    expect(large.isShown('tertiary')).toBeFalse();
    const xl = await setup(1700, content);
    expect(xl.isShown('tertiary')).toBeTrue();
    expect(xl.scaffold.paneCount).toBe(3);
    expect(
      xl.pane('tertiary').getBoundingClientRect().width,
    ).toBeLessThanOrEqual(400);
  });

  describe('drag handle', () => {
    const resizable = html`<md-gb-pane-scaffold resizable>
      <div slot="secondary">List</div>
      <div>Detail</div>
    </md-gb-pane-scaffold>`;

    function handleOf(scaffold: PaneScaffoldElement) {
      return scaffold.shadowRoot!.querySelector<HTMLElement>('.drag-handle');
    }

    it('is not rendered in single-pane windows', async () => {
      const {scaffold} = await setup(500, resizable);
      expect(handleOf(scaffold)).toBeNull();
    });

    it('is a focusable vertical separator', async () => {
      const {scaffold} = await setup(1000, resizable);
      const handle = handleOf(scaffold)!;
      expect(handle.getAttribute('role')).toBe('separator');
      expect(handle.getAttribute('aria-orientation')).toBe('vertical');
      expect(handle.getAttribute('aria-controls')).toBe('secondary');
      expect(handle.getAttribute('aria-label')).toBe('Resize panes');
      expect(handle.tabIndex).toBe(0);
      expect(Number(handle.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
    });

    it('collapses and restores with Home and Enter', async () => {
      const {scaffold, isShown} = await setup(1000, resizable);
      const handle = handleOf(scaffold)!;
      const events: unknown[] = [];
      scaffold.addEventListener('pane-resize', (e) =>
        events.push((e as CustomEvent).detail),
      );
      handle.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Home', bubbles: true}),
      );
      await env.waitForStability();
      expect(scaffold.collapsedPane).toBe('secondary');
      expect(scaffold.paneCount).toBe(1);
      expect(events.length).toBe(1);

      handle.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}),
      );
      await env.waitForStability();
      expect(scaffold.collapsedPane).toBeNull();
      expect(isShown('secondary')).toBeTrue();
    });

    it('steps to the next snap width with the arrow keys', async () => {
      const {scaffold} = await setup(1000, resizable);
      const handle = handleOf(scaffold)!;
      // Secondary starts at 360 on the left; ArrowRight grows it to the
      // next snap width, 412.
      handle.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
      await env.waitForStability();
      expect(scaffold.paneWidth).toBe(412);
      handle.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}),
      );
      await env.waitForStability();
      expect(scaffold.paneWidth).toBe(360);
    });

    it('mirrors arrow keys in RTL', async () => {
      const {scaffold} = await setup(1000, resizable, 'rtl');
      const handle = handleOf(scaffold)!;
      // The list is on the right: ArrowLeft grows it.
      handle.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}),
      );
      await env.waitForStability();
      expect(scaffold.paneWidth).toBe(412);
    });

    it('toggles on tap', async () => {
      const {scaffold} = await setup(1000, resizable);
      handleOf(scaffold)!.click();
      await env.waitForStability();
      expect(scaffold.collapsedPane).toBe('secondary');
      // A second tap restores two panes (single-pointer alternative).
      handleOf(scaffold)!.click();
      await env.waitForStability();
      expect(scaffold.collapsedPane).toBeNull();
    });

    it('cycles the snap widths on tap with handle-tap="cycle"', async () => {
      const {scaffold} = await setup(
        1000,
        html`<md-gb-pane-scaffold resizable handle-tap="cycle">
          <div slot="secondary">List</div>
          <div>Detail</div>
        </md-gb-pane-scaffold>`,
      );
      const events: PaneResizeDetail[] = [];
      scaffold.addEventListener('pane-resize', (e) =>
        events.push((e as CustomEvent<PaneResizeDetail>).detail),
      );
      // Secondary starts at 360: tap to 412, then the split width, then
      // collapse, then back to 360. No dragging needed (WCAG 2.5.7).
      const widths: Array<number | null> = [];
      for (let i = 0; i < 4; i++) {
        handleOf(scaffold)!.click();
        await env.waitForStability();
        widths.push(
          scaffold.collapsedPane === 'secondary' ? 0 : scaffold.paneWidth,
        );
      }
      expect(widths[0]).toBe(412);
      expect(widths[1]).toBeGreaterThan(412);
      expect(widths[2]).toBe(0);
      expect(widths[3]).toBe(360);
      expect(events.length).toBe(4);
    });

    it('cycles with Enter too', async () => {
      const {scaffold} = await setup(
        1000,
        html`<md-gb-pane-scaffold resizable handle-tap="cycle">
          <div slot="secondary">List</div>
          <div>Detail</div>
        </md-gb-pane-scaffold>`,
      );
      handleOf(scaffold)!.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}),
      );
      await env.waitForStability();
      expect(scaffold.paneWidth).toBe(412);
    });

    it('nextPaneSnapTarget steps through the snap widths', () => {
      const targets = [0, 360, 412, 500, 1000];
      expect(nextPaneSnapTarget(360, targets, 1000)).toBe(412);
      expect(nextPaneSnapTarget(412, targets, 1000)).toBe(500);
      expect(nextPaneSnapTarget(500, targets, 1000)).toBe(0);
      expect(nextPaneSnapTarget(0, targets, 1000)).toBe(360);
      expect(nextPaneSnapTarget(1000, targets, 1000)).toBe(360);
      expect(nextPaneSnapTarget(380, targets, 1000)).toBe(412);
      expect(nextPaneSnapTarget(300, [0, 600], 600)).toBe(0);
    });

    it('resizes by dragging and snaps on release', async () => {
      const {scaffold, pane} = await setup(1000, resizable);
      const handle = handleOf(scaffold)!;
      const rect = handle.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const pointer = (type: string, clientX: number) =>
        handle.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            composed: true,
            pointerId: 1,
            button: 0,
            isPrimary: true,
            clientX,
            clientY: y,
          }),
        );
      pointer('pointerdown', x);
      pointer('pointermove', x + 30);
      await env.waitForStability();
      expect(scaffold.paneWidth).toBe(390);
      expect(
        handle.classList.contains('drag-handle-dragged') ||
          handleOf(scaffold)!.classList.contains('drag-handle-dragged'),
      ).toBeTrue();
      pointer('pointerup', x + 30);
      await env.waitForStability();
      // 390 snaps to 412 (nearest of 360, 412, split ~476).
      expect(scaffold.paneWidth).toBe(412);
      expect(pane('secondary').style.visibility).toBe('');
    });

    // spec: layout-scaffold-57ce22, layout-scaffold-c2f2c5, layout-scaffold-c601e9
    it('keeps a persistent width across window size classes', async () => {
      const {scaffold, frame} = await setup(1000, resizable);
      scaffold.paneWidth = 412;
      await env.waitForStability();
      const changed = classChange(scaffold);
      frame.style.width = '1300px';
      await changed;
      await env.waitForStability();
      expect(scaffold.paneWidth).toBe(412);
    });

    // spec: layout-scaffold-ed4644, layout-scaffold-dc4248
    it('resets a temporary width when the class changes', async () => {
      const {scaffold, frame} = await setup(
        1000,
        html`<md-gb-pane-scaffold layout="supporting-pane" resizable>
          <div>Focus</div>
          <div slot="secondary">Support</div>
        </md-gb-pane-scaffold>`,
      );
      scaffold.paneWidth = 412;
      await env.waitForStability();
      const changed = classChange(scaffold);
      frame.style.width = '1300px';
      await changed;
      await env.waitForStability();
      expect(scaffold.paneWidth).toBeNull();
    });
  });
});

describe('<md-gb-app-scaffold>', () => {
  const env = new Environment();

  async function setup(width: number, content?: TemplateResult) {
    const root = env.render(
      html`<div style="width:${width}px;height:500px">
        ${content ??
        html`<md-gb-app-scaffold>
          <header slot="top-app-bar">App bar</header>
          <nav slot="navigation-bar" class="bar">Bar</nav>
          <nav slot="navigation-rail" class="rail" style="width:96px">Rail</nav>
          <div class="content">Content</div>
          <button slot="fab" class="fab">FAB</button>
        </md-gb-app-scaffold>`}
      </div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    const scaffold = root.querySelector('md-gb-app-scaffold')!;
    const frame = root.firstElementChild as HTMLElement;
    const shown = (selector: string) =>
      root.querySelector(selector)!.getClientRects().length > 0;
    return {root, scaffold, frame, shown};
  }

  // spec: layout-breakpoints-621aba
  it('shows the navigation bar at compact', async () => {
    const {scaffold, shown} = await setup(400);
    expect(scaffold.windowClass).toBe('compact');
    expect(scaffold.activeNavigation).toBe('bar');
    expect(scaffold.getAttribute('active-navigation')).toBe('bar');
    expect(shown('.bar')).toBeTrue();
    expect(shown('.rail')).toBeFalse();
  });

  // spec: layout-breakpoints-bb5a9a, layout-overview-d0b913
  it('shows the navigation rail at medium and larger', async () => {
    const {scaffold, shown} = await setup(700);
    expect(scaffold.activeNavigation).toBe('rail');
    expect(shown('.rail')).toBeTrue();
    expect(shown('.bar')).toBeFalse();
  });

  // spec: layout-breakpoints-02069b, layout-breakpoints-635c4e, layout-breakpoints-0f0313
  it('places the rail on the leading edge and the bar at the bottom', async () => {
    const wide = await setup(1000);
    const rail = wide.root.querySelector('.rail')!.getBoundingClientRect();
    const content = wide.root
      .querySelector('.content')!
      .getBoundingClientRect();
    expect(rail.left).toBeLessThan(content.left);

    const narrow = await setup(400);
    const bar = narrow.root.querySelector('.bar')!.getBoundingClientRect();
    const content2 = narrow.root
      .querySelector('.content')!
      .getBoundingClientRect();
    expect(bar.top).toBeGreaterThan(content2.top);
  });

  // spec: layout-scaffold-cbfa10
  it('places the FAB 16px from the trailing and bottom edges', async () => {
    const {root, scaffold} = await setup(400);
    const fab = root.querySelector('.fab')!.getBoundingClientRect();
    const body = scaffold
      .shadowRoot!.querySelector('.app-scaffold-body')!
      .getBoundingClientRect();
    expect(body.right - fab.right).toBeCloseTo(16, 0);
    expect(body.bottom - fab.bottom).toBeCloseTo(16, 0);
  });

  // spec: layout-breakpoints-b044e6
  it('swaps to a bar at medium when the content shows two panes', async () => {
    const {scaffold} = await setup(
      700,
      html`<md-gb-app-scaffold>
        <nav slot="navigation-bar">Bar</nav>
        <nav slot="navigation-rail" style="width:96px">Rail</nav>
        <md-gb-pane-scaffold medium-two-pane>
          <div slot="secondary">List</div>
          <div>Detail</div>
        </md-gb-pane-scaffold>
      </md-gb-app-scaffold>`,
    );
    await env.waitForStability();
    expect(scaffold.activeNavigation).toBe('bar');
  });

  it('gives a nested pane scaffold the window class', async () => {
    const {root, scaffold} = await setup(
      900,
      html`<md-gb-app-scaffold>
        <nav slot="navigation-rail" style="width:96px">Rail</nav>
        <md-gb-pane-scaffold>
          <div slot="secondary">List</div>
          <div>Detail</div>
        </md-gb-pane-scaffold>
      </md-gb-app-scaffold>`,
    );
    const panes = root.querySelector('md-gb-pane-scaffold')!;
    // The pane scaffold is ~804px wide (medium), but the window is expanded.
    expect(scaffold.windowClass).toBe('expanded');
    expect(panes.windowClass).toBe('expanded');
    expect(panes.mode).toBe('two-pane');
  });

  // spec: layout-breakpoints-6c6a54, layout-breakpoints-302a10, layout-breakpoints-01072a, layout-breakpoints-c2b572, layout-breakpoints-7ea162, layout-breakpoints-3e0c7f, layout-breakpoints-2d095e, layout-breakpoints-614389, layout-breakpoints-a2e842, layout-breakpoints-53dd5c, layout-breakpoints-f38151, layout-overview-f78bee, layout-overview-e9b657
  it('follows window resizes and fires window-class-change', async () => {
    const {scaffold, frame} = await setup(400);
    const changed = classChange(scaffold);
    frame.style.width = '1300px';
    await changed;
    await env.waitForStability();
    expect(scaffold.windowClass).toBe('large');
    expect(scaffold.activeNavigation).toBe('rail');
  });

  // spec: layout-overview-94783c
  it('auto-expands a slotted rail at large', async () => {
    const {root} = await setup(
      1300,
      html`<md-gb-app-scaffold auto-expand-rail>
        <fake-rail slot="navigation-rail"></fake-rail>
        <div>Content</div>
      </md-gb-app-scaffold>`,
    );
    const rail = root.querySelector('fake-rail') as HTMLElement & {
      expanded: boolean;
    };
    expect(rail.expanded).toBeTrue();
  });

  it('honors navigation="none"', async () => {
    const {scaffold, shown} = await setup(
      400,
      html`<md-gb-app-scaffold navigation="none">
        <nav slot="navigation-bar" class="bar">Bar</nav>
        <div>Content</div>
      </md-gb-app-scaffold>`,
    );
    expect((scaffold as AppScaffoldElement).activeNavigation).toBe('none');
    expect(shown('.bar')).toBeFalse();
  });
});

describe('planPanes() on foldables and with levitate', () => {
  // spec: layout-breakpoints-3fc971
  it('splits two panes at a vertical fold even in compact windows', () => {
    for (const layout of ['list-detail', 'supporting-pane'] as const) {
      const plan = planPanes({
        layout,
        windowClass: 'compact',
        hasSecondary: true,
        collapsedPane: 'secondary',
        fold: 'vertical',
      });
      expect(plan.mode).withContext(layout).toBe('two-pane');
      expect(plan.visible)
        .withContext(layout)
        .toEqual(['secondary', 'primary']);
      expect(plan.fold).withContext(layout).toBe('vertical');
    }
  });

  it('stacks supporting panes at a horizontal fold', () => {
    const plan = planPanes({
      layout: 'supporting-pane',
      windowClass: 'expanded',
      hasSecondary: true,
      fold: 'horizontal',
    });
    expect(plan.mode).toBe('stacked');
    expect(plan.fold).toBe('horizontal');
    // List-detail keeps its regular layout.
    const listDetail = planPanes({
      layout: 'list-detail',
      windowClass: 'expanded',
      hasSecondary: true,
      fold: 'horizontal',
    });
    expect(listDetail.mode).toBe('two-pane');
    expect(listDetail.fold).toBeNull();
  });

  it('ignores a fold without a second pane', () => {
    const plan = planPanes({
      layout: 'supporting-pane',
      windowClass: 'compact',
      fold: 'vertical',
    });
    expect(plan.mode).toBe('single');
    expect(plan.fold).toBeNull();
  });

  // spec: layout-scaffold-416a94, layout-overview-483276, layout-scaffold-588dd9, layout-overview-61a52d
  it('docks at compact and floats at medium (spec: levitate)', () => {
    const state = {
      layout: 'supporting-pane' as const,
      hasSecondary: true,
      levitate: 'docked' as const,
      levitateOpen: true,
    };
    const compact = planPanes({...state, windowClass: 'compact'});
    expect(compact.mode).toBe('levitated');
    expect(compact.levitated).toBe('docked');
    expect(compact.visible).toEqual(['primary', 'secondary']);
    expect(planPanes({...state, windowClass: 'medium'}).levitated).toBe(
      'floating',
    );
    // Co-planar again where two panes fit.
    const expanded = planPanes({...state, windowClass: 'expanded'});
    expect(expanded.mode).toBe('two-pane');
    expect(expanded.levitated).toBeNull();
  });

  it('hides a closed levitated pane', () => {
    const plan = planPanes({
      layout: 'feed',
      windowClass: 'compact',
      hasSecondary: true,
      levitate: 'floating',
    });
    expect(plan.mode).toBe('levitated');
    expect(plan.levitated).toBe('floating');
    expect(plan.visible).toEqual(['primary']);
  });

  it('maps levitate and fold state to classes', () => {
    expect(
      paneScaffoldClasses({mode: 'levitated', levitated: 'docked'}),
    ).toEqual(
      jasmine.objectContaining({
        'pane-scaffold-levitated': true,
        'pane-scaffold-docked': true,
        'pane-scaffold-floating': false,
      }),
    );
    expect(paneScaffoldClasses({mode: 'two-pane', fold: 'vertical'})).toEqual(
      jasmine.objectContaining({'pane-scaffold-fold-vertical': true}),
    );
  });
});

describe('resolveNavigation() with window height', () => {
  it('keeps the rail for two panes at medium in compact height', () => {
    const state = {
      navigation: 'auto' as const,
      windowClass: 'medium' as const,
      paneCount: 2,
      hasBar: true,
      hasRail: true,
    };
    expect(resolveNavigation({...state, heightClass: 'medium'})).toBe('bar');
    expect(resolveNavigation({...state, heightClass: 'compact'})).toBe('rail');
    expect(
      resolveNavigation({
        ...state,
        windowClass: 'compact',
        heightClass: 'compact',
      }),
    ).toBe('bar');
  });
});

describe('<md-gb-pane-scaffold> height, folds and levitate', () => {
  const env = new Environment();

  afterEach(() => {
    simulateViewportSegments(undefined);
  });

  async function setup(
    width: number,
    content: TemplateResult,
    {height = 400, dir = 'ltr'}: {height?: number; dir?: 'ltr' | 'rtl'} = {},
  ) {
    const root = env.render(
      html`<div dir=${dir} style="width:${width}px;height:${height}px">
        ${content}
      </div>`,
    );
    await env.waitForStability();
    const scaffold = root.querySelector('md-gb-pane-scaffold')!;
    const frame = root.firstElementChild as HTMLElement;
    const pane = (name: string) =>
      scaffold.shadowRoot!.querySelector<HTMLElement>(`.pane-${name}`)!;
    return {root, scaffold, frame, pane};
  }

  /** Simulates two segments split at `at` px (from the frame's edge). */
  async function fold(
    frame: HTMLElement,
    orientation: 'vertical' | 'horizontal',
    at: number,
    size: number,
  ) {
    const r = frame.getBoundingClientRect();
    simulateViewportSegments(
      orientation === 'vertical'
        ? [
            {x: 0, y: 0, width: r.left + at, height: 2000},
            {x: r.left + at + size, y: 0, width: 2000, height: 2000},
          ]
        : [
            {x: 0, y: 0, width: 4000, height: r.top + at},
            {x: 0, y: r.top + at + size, width: 4000, height: 2000},
          ],
    );
    await env.waitForStability();
    await env.waitForStability();
  }

  const listDetail = () =>
    html`<md-gb-pane-scaffold resizable>
      <div slot="secondary">List</div>
      <div>Detail</div>
    </md-gb-pane-scaffold>`;

  const supporting = (attrs = '') =>
    html`<md-gb-pane-scaffold
      layout="supporting-pane"
      levitate=${attrs.includes('docked')
        ? 'docked'
        : attrs.includes('floating')
          ? 'floating'
          : 'none'}
      ?levitate-modal=${attrs.includes('modal')}
      levitate-label="Comments">
      <div class="focus"><button class="trigger">Open</button></div>
      <div slot="secondary" class="support">
        <button class="first">First</button>
      </div>
    </md-gb-pane-scaffold>`;

  it('reflects the window height size class', async () => {
    const {scaffold, frame} = await setup(500, listDetail());
    expect(scaffold.windowHeightClass).toBe('compact');
    expect(scaffold.getAttribute('window-height-class')).toBe('compact');
    const changed = new Promise<CustomEvent>((resolve) => {
      scaffold.addEventListener(
        'window-height-class-change',
        (e) => resolve(e as CustomEvent),
        {once: true},
      );
    });
    frame.style.height = '1000px';
    const event = await changed;
    await env.waitForStability();
    expect(event.detail).toEqual({
      windowHeightClass: 'expanded',
      previous: 'compact',
    });
    expect(scaffold.getAttribute('window-height-class')).toBe('expanded');
  });

  // spec: layout-canonical-examples-b063d7
  it('splits two panes at a vertical hinge', async () => {
    const {scaffold, frame, pane} = await setup(800, listDetail());
    expect(scaffold.mode).toBe('single');
    await fold(frame, 'vertical', 400, 30);
    expect(scaffold.getAttribute('fold')).toBe('vertical');
    expect(scaffold.fold).toEqual({
      orientation: 'vertical',
      start: 400,
      size: 30,
    });
    expect(scaffold.mode).toBe('two-pane');
    const left = frame.getBoundingClientRect().left;
    const secondary = pane('secondary').getBoundingClientRect();
    const primary = pane('primary').getBoundingClientRect();
    // The hinge (30px) is wider than the 24px spacer: panes end at its edges.
    expect(secondary.right - left).toBeCloseTo(400, 0);
    expect(primary.left - left).toBeCloseTo(430, 0);
    // No drag handle across a hinge.
    expect(scaffold.shadowRoot!.querySelector('.drag-handle')).toBeNull();
  });

  it('centers the spacer on a seamless fold', async () => {
    const {frame, pane} = await setup(1000, listDetail());
    await fold(frame, 'vertical', 600, 0);
    const left = frame.getBoundingClientRect().left;
    const secondary = pane('secondary').getBoundingClientRect();
    const primary = pane('primary').getBoundingClientRect();
    // Expanded spacer is 24px, centered on the fold at 600.
    expect(secondary.right - left).toBeCloseTo(588, 0);
    expect(primary.left - left).toBeCloseTo(612, 0);
  });

  it('mirrors the fold split in RTL', async () => {
    const {frame, pane} = await setup(800, listDetail(), {dir: 'rtl'});
    await fold(frame, 'vertical', 300, 20);
    const left = frame.getBoundingClientRect().left;
    // The list (inline-start) is on the right of the hinge. 800px is
    // medium: the 24px spacer is wider than the 20px hinge and centered on
    // it (310).
    expect(pane('secondary').getBoundingClientRect().left - left).toBeCloseTo(
      322,
      0,
    );
    expect(pane('primary').getBoundingClientRect().right - left).toBeCloseTo(
      298,
      0,
    );
  });

  it('stacks the supporting pane below a tabletop fold', async () => {
    const {scaffold, frame, pane} = await setup(1000, supporting(), {
      height: 600,
    });
    expect(scaffold.mode).toBe('two-pane');
    await fold(frame, 'horizontal', 300, 0);
    expect(scaffold.mode).toBe('stacked');
    const top = frame.getBoundingClientRect().top;
    expect(pane('primary').getBoundingClientRect().bottom - top).toBeCloseTo(
      288,
      0,
    );
    expect(pane('secondary').getBoundingClientRect().top - top).toBeCloseTo(
      312,
      0,
    );
  });

  it('falls back to the regular layout when the fold goes away', async () => {
    const {scaffold, frame} = await setup(800, listDetail());
    await fold(frame, 'vertical', 400, 0);
    expect(scaffold.mode).toBe('two-pane');
    simulateViewportSegments(null);
    await env.waitForStability();
    expect(scaffold.hasAttribute('fold')).toBeFalse();
    expect(scaffold.mode).toBe('single');
  });

  // spec: layout-scaffold-6a42d4, layout-scaffold-8822f9
  it('floats the supporting pane above the primary pane', async () => {
    const {scaffold, pane} = await setup(500, supporting('floating'));
    expect(scaffold.mode).toBe('levitated');
    expect(getComputedStyle(pane('secondary')).display).toBe('none');
    scaffold.openLevitated();
    await env.waitForStability();
    const secondary = pane('secondary');
    const container = secondary.offsetParent as HTMLElement;
    expect(getComputedStyle(secondary).position).toBe('absolute');
    // Inset 16px (compact margin) from the bottom and trailing edges, at the
    // 360px fixed pane width.
    expect(secondary.offsetWidth).toBe(360);
    expect(
      container.clientWidth - (secondary.offsetLeft + secondary.offsetWidth),
    ).toBe(16);
    expect(
      container.clientHeight - (secondary.offsetTop + secondary.offsetHeight),
    ).toBe(16);
    // The primary pane still fills the scaffold underneath.
    expect(pane('primary').offsetWidth).toBe(500 - 32);
    expect(
      scaffold.shadowRoot!.querySelector('.pane-scaffold-floating'),
    ).not.toBeNull();
  });

  // spec: layout-scaffold-e39320
  it('docks the supporting pane to the bottom edge at compact', async () => {
    const {scaffold, pane} = await setup(500, supporting('docked'));
    scaffold.levitateOpen = true;
    await env.waitForStability();
    const secondary = pane('secondary');
    const container = secondary.offsetParent as HTMLElement;
    expect(secondary.offsetWidth).toBe(container.clientWidth);
    expect(secondary.offsetTop + secondary.offsetHeight).toBe(
      container.clientHeight,
    );
  });

  // spec: layout-scaffold-a75925, layout-scaffold-94f2e1
  it('adapts a docked pane into a floating pane at medium', async () => {
    const {scaffold} = await setup(700, supporting('docked'));
    scaffold.openLevitated();
    await env.waitForStability();
    expect(scaffold.mode).toBe('levitated');
    expect(
      scaffold.shadowRoot!.querySelector('.pane-scaffold-floating'),
    ).not.toBeNull();
  });

  // spec: layout-scaffold-9515e4, layout-scaffold-7bcfc8, layout-scaffold-bf27ae
  it('shows a levitated pane co-planar where two panes fit', async () => {
    const {scaffold, pane} = await setup(1000, supporting('docked'));
    expect(scaffold.mode).toBe('two-pane');
    expect(getComputedStyle(pane('secondary')).position).toBe('static');
  });

  it('closes a non-modal levitated pane with Escape', async () => {
    const {root, scaffold} = await setup(500, supporting('floating'));
    const trigger = root.querySelector<HTMLButtonElement>('.trigger')!;
    trigger.focus();
    scaffold.openLevitated();
    await env.waitForStability();
    // Non-modal: focus stays where it was.
    expect(document.activeElement).toBe(trigger);
    root.querySelector<HTMLButtonElement>('.first')!.focus();
    const closed = jasmine.createSpy('levitate-close');
    scaffold.addEventListener('levitate-close', closed);
    root.querySelector('.first')!.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
      }),
    );
    await env.waitForStability();
    expect(scaffold.levitateOpen).toBeFalse();
    expect(closed).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);
  });

  describe('modal levitated pane', () => {
    // spec: layout-scaffold-a8434d, layout-scaffold-92ba79, layout-scaffold-7fa733, layout-scaffold-11321f
    it('moves focus in, makes the panes behind inert and shows a scrim', async () => {
      const {root, scaffold, pane} = await setup(
        500,
        supporting('floating modal'),
      );
      const trigger = root.querySelector<HTMLButtonElement>('.trigger')!;
      trigger.focus();
      scaffold.openLevitated();
      await env.waitForStability();
      expect(document.activeElement).toBe(root.querySelector('.first'));
      expect(pane('primary').inert).toBeTrue();
      expect(pane('secondary').getAttribute('role')).toBe('dialog');
      expect(pane('secondary').getAttribute('aria-label')).toBe('Comments');
      expect(scaffold.shadowRoot!.querySelector('.pane-scrim')).not.toBeNull();

      scaffold.closeLevitated();
      await env.waitForStability();
      expect(pane('primary').inert).toBeFalse();
      expect(scaffold.shadowRoot!.querySelector('.pane-scrim')).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });

    // spec: layout-scaffold-dd960b
    it('closes when something behind it is used', async () => {
      const {root, scaffold} = await setup(500, supporting('docked modal'));
      root.querySelector<HTMLButtonElement>('.trigger')!.focus();
      scaffold.openLevitated();
      await env.waitForStability();
      const closed = jasmine.createSpy('levitate-close');
      scaffold.addEventListener('levitate-close', closed);
      // A press inside the pane keeps it open.
      root
        .querySelector('.first')!
        .dispatchEvent(
          new PointerEvent('pointerdown', {bubbles: true, composed: true}),
        );
      expect(closed).not.toHaveBeenCalled();
      scaffold
        .shadowRoot!.querySelector('.pane-scrim')!
        .dispatchEvent(
          new PointerEvent('pointerdown', {bubbles: true, composed: true}),
        );
      await env.waitForStability();
      expect(closed).toHaveBeenCalledTimes(1);
      expect(scaffold.levitateOpen).toBeFalse();
      expect(document.activeElement).toBe(root.querySelector('.trigger'));
    });
  });
});

describe('<md-gb-app-scaffold> window height', () => {
  const env = new Environment();

  it('reflects the height class and keeps the rail in compact height', async () => {
    const root = env.render(
      html`<div style="width:700px;height:400px">
        <md-gb-app-scaffold>
          <nav slot="navigation-bar">Bar</nav>
          <nav slot="navigation-rail" style="width:96px">Rail</nav>
          <md-gb-pane-scaffold medium-two-pane>
            <div slot="secondary">List</div>
            <div>Detail</div>
          </md-gb-pane-scaffold>
        </md-gb-app-scaffold>
      </div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    const scaffold = root.querySelector('md-gb-app-scaffold')!;
    const panes = root.querySelector('md-gb-pane-scaffold')!;
    expect(scaffold.windowHeightClass).toBe('compact');
    expect(scaffold.getAttribute('window-height-class')).toBe('compact');
    expect(panes.windowHeightClass).toBe('compact');
    expect(panes.mode).toBe('two-pane');
    expect(scaffold.activeNavigation).toBe('rail');
  });
});

/** A stand-in for md-gb-nav-rail with an `expanded` property. */
class FakeRail extends HTMLElement {
  expanded = false;
}
customElements.define('fake-rail', FakeRail);
