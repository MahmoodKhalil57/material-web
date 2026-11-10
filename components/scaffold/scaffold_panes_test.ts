/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, nothing} from 'lit';
import {Environment} from '../../testing/environment.js';
import {until} from '../shared/central/subjects.js';
import {
  WINDOW_SIZE_CLASSES,
  windowSizeClassValues,
} from '../../styles/layout/window-size-class.js';

import './md-gb-app-scaffold.js';
import './md-gb-pane-scaffold.js';
import {type PaneScaffoldElement} from './pane-scaffold-element.js';
import {planPanes} from './pane-scaffold.js';

describe('pane types and temporary panes', () => {
  const env = new Environment();

  async function setup(width: number, content: ReturnType<typeof html>) {
    const root = env.render(
      html`<div style="width:${width}px;height:500px">${content}</div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    const scaffold = root.querySelector(
      'md-gb-pane-scaffold',
    ) as PaneScaffoldElement;
    const pane = (name: string) =>
      scaffold.shadowRoot!.querySelector<HTMLElement>(`.pane-${name}`)!;
    return {root, scaffold, pane};
  }

  const listDetail = html`<md-gb-pane-scaffold resizable>
    <div slot="secondary">List</div>
    <div>Detail</div>
  </md-gb-pane-scaffold>`;

  // spec: layout-scaffold-172813
  it('chooses the layout and amount of panes by breakpoint and layout type', () => {
    const counts = (layout: 'list-detail' | 'supporting-pane' | 'feed') =>
      WINDOW_SIZE_CLASSES.map(
        (windowClass) =>
          planPanes({layout, windowClass, hasSecondary: true, detailOpen: true})
            .paneCount,
      );
    // Co-planar panes follow the breakpoint's recommended total...
    expect(counts('list-detail')).toEqual([1, 1, 2, 2, 2]);
    // ...and the layout type decides how a window that is too small for
    // two panes shows the second one: show/hide versus reflow.
    expect(
      planPanes({layout: 'list-detail', windowClass: 'compact', hasSecondary: true, detailOpen: true}).mode,
    ).toBe('single');
    expect(
      planPanes({layout: 'supporting-pane', windowClass: 'compact', hasSecondary: true}).mode,
    ).toBe('stacked');
    expect(
      planPanes({layout: 'supporting-pane', windowClass: 'expanded', hasSecondary: true}).mode,
    ).toBe('two-pane');
  });

  // spec: layout-scaffold-6e9c9c
  it('lets a single pane fill any breakpoint, recommended for compact and medium', async () => {
    for (const windowClass of WINDOW_SIZE_CLASSES) {
      const plan = planPanes({layout: 'list-detail', windowClass});
      expect(plan.mode).withContext(windowClass).toBe('single');
      expect(plan.paneCount).withContext(windowClass).toBe(1);
    }
    expect(windowSizeClassValues('compact').panesRecommended).toBe(1);
    expect(windowSizeClassValues('medium').panesRecommended).toBe(1);
    for (const width of [400, 1500]) {
      const {pane} = await setup(
        width,
        html`<md-gb-pane-scaffold><div>Only</div></md-gb-pane-scaffold>`,
      );
      const primary = pane('primary').getBoundingClientRect().width;
      const margins = width < 600 ? 32 : width < 840 ? 48 : 48;
      expect(primary).withContext(`${width}`).toBeGreaterThan(width - margins * 2 - 1);
    }
  });

  // spec: layout-scaffold-089d9d
  it('has a fixed pane and a flexible pane', async () => {
    const measure = async (width: number) => {
      const {pane} = await setup(width, listDetail);
      return {
        fixed: pane('secondary').getBoundingClientRect().width,
        flexible: pane('primary').getBoundingClientRect().width,
      };
    };
    const small = await measure(1000);
    const large = await measure(1100);
    expect(small.fixed).toBeCloseTo(360, 0);
    expect(large.fixed).toBeCloseTo(360, 0);
    expect(large.flexible - small.flexible).toBeCloseTo(100, 0);
  });

  const shown = (s: {pane: (n: string) => HTMLElement}) =>
    getComputedStyle(s.pane('secondary')).display !== 'none';

  // spec: layout-scaffold-f2efe4
  it('keeps a permanent pane and lets a temporary pane come and go', async () => {
    // Permanent: the list pane stays beside the detail at expanded.
    const permanent = await setup(1000, listDetail);
    expect(permanent.scaffold.paneCount).toBe(2);
    // Temporary: a levitated pane exists only while it is open.
    const temporary = await setup(
      500,
      html`<md-gb-pane-scaffold layout="supporting-pane" levitate="floating">
        <div slot="secondary">Task</div>
        <div>Main</div>
      </md-gb-pane-scaffold>`,
    );
    expect(shown(temporary)).toBeFalse();
    temporary.scaffold.openLevitated();
    await env.waitForStability();
    expect(shown(temporary)).toBeTrue();
    temporary.scaffold.closeLevitated();
    await env.waitForStability();
    expect(shown(temporary)).toBeFalse();
  });

  // spec: layout-scaffold-6373e2, layout-scaffold-8c3637, layout-scaffold-1d8e24, layout-scaffold-a423c5
  it('dismisses a temporary pane and the remaining pane fills the space', async () => {
    const {scaffold, pane} = await setup(1000, listDetail);
    const before = pane('primary').getBoundingClientRect().width;
    expect(pane('secondary').getBoundingClientRect().width).toBeGreaterThan(300);
    // The close button of the right pane dismisses it.
    scaffold.collapsedPane = 'secondary';
    await scaffold.updateComplete;
    // The panes animate to their new sizes.
    await Promise.all(
      [...scaffold.shadowRoot!.querySelectorAll('.pane')]
        .flatMap((p) => p.getAnimations())
        .map((a) => a.finished),
    );
    const frame = scaffold.getBoundingClientRect().width;
    const after = pane('primary').getBoundingClientRect().width;
    // Dismissing affected the size of the other pane: it grew to fill.
    expect(after).toBeGreaterThan(before + 300);
    expect(after).toBeGreaterThan(frame * 0.85);
    expect(scaffold.paneCount).toBe(1);
  });

  // spec: layout-scaffold-6373e2, layout-scaffold-8c3637
  it('dismisses a floating temporary pane with Escape', async () => {
    const {root, scaffold, pane} = await setup(
      500,
      html`<md-gb-pane-scaffold layout="supporting-pane" levitate="floating" levitate-open>
        <div slot="secondary"><button class="first">Close</button></div>
        <div>Main</div>
      </md-gb-pane-scaffold>`,
    );
    const closed = jasmine.createSpy('levitate-close');
    scaffold.addEventListener('levitate-close', closed);
    const primaryBefore = pane('primary').getBoundingClientRect().width;
    root.querySelector('.first')!.dispatchEvent(
      new KeyboardEvent('keydown', {key: 'Escape', bubbles: true, composed: true}),
    );
    await until(() => !scaffold.levitateOpen);
    expect(closed).toHaveBeenCalledTimes(1);
    expect(getComputedStyle(pane('secondary')).display).toBe('none');
    expect(pane('primary').getBoundingClientRect().width).toBe(primaryBefore);
  });
});

describe('two-pane layouts beside navigation', () => {
  const env = new Environment();

  async function setup(railWidth: number) {
    const root = env.render(
      html`<div style="width:1000px;height:400px">
        <md-gb-app-scaffold>
          <nav slot="navigation-bar">Bar</nav>
          <nav slot="navigation-rail" style="width:${railWidth}px">Rail</nav>
          <md-gb-pane-scaffold arrangement="split" medium-two-pane>
            <div slot="secondary">List</div>
            <div>Detail</div>
          </md-gb-pane-scaffold>
        </md-gb-app-scaffold>
      </div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    const scaffold = root.querySelector('md-gb-pane-scaffold')!;
    const rect = (name: string) =>
      scaffold.shadowRoot!.querySelector<HTMLElement>(`.pane-${name}`)!.getBoundingClientRect();
    return {rect, frame: root.firstElementChild!.getBoundingClientRect()};
  }

  // spec: layout-scaffold-6cbe67, layout-scaffold-a101cd
  it('only reduces one pane for the rail; the other stays at 50% of the window', async () => {
    const measure = async (railWidth: number) => {
      const {rect, frame} = await setup(railWidth);
      const primary = rect('primary');
      const secondary = rect('secondary');
      return {frame, primary, secondary};
    };
    const none = await measure(0);
    const rail = await measure(96);
    const wide = await measure(220);
    for (const scene of [none, rail, wide]) {
      const {frame, primary} = scene;
      // The trailing pane ends at the window margin and starts right of the
      // centered spacer, i.e. it fills the second half of the window.
      const half = frame.left + frame.width / 2;
      expect(primary.left).toBeGreaterThanOrEqual(half);
      expect(primary.left - half).toBeLessThanOrEqual(24);
    }
    // The other pane is untouched by the rail...
    expect(rail.primary.width).toBeCloseTo(none.primary.width, 0);
    expect(wide.primary.width).toBeCloseTo(none.primary.width, 0);
    // ...and the rail only shrinks the leading pane.
    expect(rail.secondary.width).toBeLessThan(none.secondary.width - 90);
    expect(wide.secondary.width).toBeLessThan(rail.secondary.width - 100);
  });
});

describe('floating panes on large screens', () => {
  const env = new Environment();

  async function setup(width: number, attrs: {modal?: boolean; coplanar?: boolean} = {}) {
    const root = env.render(
      html`<div style="width:${width}px;height:500px">
        <md-gb-pane-scaffold
          layout="supporting-pane"
          levitate="docked"
          levitate-open
          ?levitate-modal=${attrs.modal}
          ?levitate-coplanar=${attrs.coplanar}>
          <div slot="secondary">Panel</div>
          <div>Main</div>
        </md-gb-pane-scaffold>
      </div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    return root.querySelector('md-gb-pane-scaffold') as PaneScaffoldElement;
  }

  // spec: layout-scaffold-00877e
  it('floats by default at large and extra-large, with the scrim optional', () => {
    const state = {
      layout: 'supporting-pane' as const,
      hasSecondary: true,
      levitate: 'docked' as const,
      levitateOpen: true,
    };
    for (const windowClass of ['large', 'extra-large'] as const) {
      const plan = planPanes({...state, windowClass});
      expect(plan.mode).withContext(windowClass).toBe('levitated');
      expect(plan.levitated).withContext(windowClass).toBe('floating');
      // Co-planar stays available as an opt-in.
      expect(planPanes({...state, windowClass, levitateCoplanar: true}).mode)
        .withContext(windowClass)
        .toBe('two-pane');
    }
    expect(planPanes({...state, windowClass: 'expanded'}).mode).toBe('two-pane');
  });

  // spec: layout-scaffold-00877e
  it('shows a floating pane without a scrim, or with one when modal', async () => {
    const plain = await setup(1300);
    expect(plain.mode).toBe('levitated');
    expect(plain.shadowRoot!.querySelector('.pane-scaffold-floating')).not.toBeNull();
    expect(plain.shadowRoot!.querySelector('.pane-scrim')).toBeNull();
    const modal = await setup(1300, {modal: true});
    expect(modal.shadowRoot!.querySelector('.pane-scrim')).not.toBeNull();
    const coplanar = await setup(1300, {coplanar: true});
    expect(coplanar.mode).toBe('two-pane');
  });
});

describe('draggable and resizable floating pane', () => {
  const env = new Environment();

  async function setup(attrs = 'levitate-draggable levitate-resizable', dir = 'ltr') {
    const root = env.render(
      html`<div dir=${dir} style="width:700px;height:500px">
        <md-gb-pane-scaffold
          layout="supporting-pane"
          levitate="floating"
          levitate-open
          levitate-draggable=${attrs.includes('draggable') ? '' : nothing}
          levitate-resizable=${attrs.includes('resizable') ? '' : nothing}>
          <div slot="secondary" style="height:200px">Panel</div>
          <div>Main</div>
        </md-gb-pane-scaffold>
      </div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    const scaffold = root.querySelector('md-gb-pane-scaffold') as PaneScaffoldElement;
    const q = (sel: string) => scaffold.shadowRoot!.querySelector<HTMLElement>(sel);
    return {scaffold, q, pane: () => q('.pane-secondary')!};
  }

  /** The side of the pane its resize handle is on. */
  const handleSide = (
    q: (sel: string) => HTMLElement | null,
    pane: DOMRect,
  ): 'left' | 'right' => {
    const h = q('.float-resize')!.getBoundingClientRect();
    return h.left + h.width / 2 > pane.left + pane.width / 2 ? 'right' : 'left';
  };

  const key = (el: HTMLElement, k: string, shiftKey = false) =>
    el.dispatchEvent(new KeyboardEvent('keydown', {key: k, shiftKey, bubbles: true, composed: true}));

  // spec: layout-scaffold-8f2730
  it('offers no handles unless opted in', async () => {
    const {q} = await setup('');
    expect(q('.float-move')).toBeNull();
    expect(q('.float-resize')).toBeNull();
  });

  // spec: layout-scaffold-8f2730
  it('labels the handles for assistive technology', async () => {
    const {q} = await setup();
    expect(q('.float-move')!.getAttribute('aria-label')).toBe('Move pane');
    expect(q('.float-resize')!.getAttribute('aria-label')).toBe('Resize pane');
    expect(q('.float-move')!.tabIndex).toBe(0);
  });

  const settle = async () => {
    await env.waitForStability();
    await env.waitForStability();
    // The pane animates in (scaling) before it can be measured.
    const panes = document.querySelectorAll('md-gb-pane-scaffold');
    for (const el of panes) {
      const pane = el.shadowRoot?.querySelector('.pane-secondary');
      await Promise.all((pane?.getAnimations() ?? []).map((a) => a.finished));
    }
  };

  const pointer = (
    target: HTMLElement,
    type: string,
    clientX: number,
    clientY: number,
  ) =>
    target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        composed: true,
        pointerId: 1,
        button: 0,
        isPrimary: true,
        pointerType: 'mouse',
        clientX,
        clientY,
      }),
    );

  // spec: layout-scaffold-8f2730
  it('moves with the arrow keys and stays inside the scaffold', async () => {
    const {q, pane} = await setup();
    await settle();
    const start = pane().getBoundingClientRect();
    key(q('.float-move')!, 'ArrowUp');
    await settle();
    expect(pane().getBoundingClientRect().top).toBeCloseTo(start.top - 16, 0);
    expect(pane().getBoundingClientRect().left).toBeCloseTo(start.left, 0);
    const container = pane().offsetParent!.getBoundingClientRect();
    // Shift moves in larger steps; the pane never leaves the scaffold.
    for (let i = 0; i < 12; i++) {
      key(q('.float-move')!, 'ArrowLeft', true);
      await settle();
    }
    expect(pane().getBoundingClientRect().left).toBeCloseTo(container.left, 0);
    for (let i = 0; i < 12; i++) {
      key(q('.float-move')!, 'ArrowRight', true);
      await settle();
    }
    expect(pane().getBoundingClientRect().right).toBeCloseTo(container.right, 0);
  });

  // spec: layout-scaffold-8f2730
  it('moves by dragging the handle', async () => {
    const {q, pane} = await setup();
    await settle();
    const start = pane().getBoundingClientRect();
    const handle = q('.float-move')!;
    const rect = handle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + 8;
    pointer(handle, 'pointerdown', x, y);
    pointer(handle, 'pointermove', x - 20, y - 30);
    pointer(handle, 'pointermove', x - 60, y - 60);
    pointer(handle, 'pointerup', x - 60, y - 60);
    await settle();
    expect(pane().getBoundingClientRect().left).toBeCloseTo(start.left - 60, 0);
    expect(pane().getBoundingClientRect().top).toBeCloseTo(start.top - 60, 0);
  });

  // spec: layout-scaffold-8f2730
  it('resizes with the arrow keys, keeping the anchored edges fixed', async () => {
    const {q, pane} = await setup();
    await settle();
    const start = pane().getBoundingClientRect();
    const side = handleSide(q, start);
    const grow = side === 'right' ? 'ArrowRight' : 'ArrowLeft';
    const shrink = side === 'right' ? 'ArrowLeft' : 'ArrowRight';
    key(q('.float-resize')!, grow);
    await settle();
    expect(pane().getBoundingClientRect().width).toBeCloseTo(start.width + 16, 0);
    // The edge opposite the handle stays where it was.
    const anchored = side === 'right' ? 'left' : 'right';
    expect(pane().getBoundingClientRect()[anchored]).toBeCloseTo(start[anchored], 0);
    key(q('.float-resize')!, 'ArrowUp', true);
    await settle();
    expect(pane().getBoundingClientRect().height).toBeCloseTo(start.height + 64, 0);
    expect(pane().getBoundingClientRect().bottom).toBeCloseTo(start.bottom, 0);
    for (let i = 0; i < 10; i++) {
      key(q('.float-resize')!, shrink, true);
      await settle();
    }
    expect(pane().getBoundingClientRect().width).toBeCloseTo(240, 0);
  });

  // spec: layout-scaffold-8f2730
  it('resizes by dragging the corner handle', async () => {
    const {q, pane} = await setup();
    await settle();
    const before = pane().getBoundingClientRect();
    const out = handleSide(q, before) === 'right' ? 1 : -1;
    const handle = q('.float-resize')!;
    const rect = handle.getBoundingClientRect();
    const x = rect.left + 8;
    const y = rect.top + 8;
    pointer(handle, 'pointerdown', x, y);
    pointer(handle, 'pointermove', x + out * 30, y);
    pointer(handle, 'pointermove', x + out * 50, y - 20);
    pointer(handle, 'pointerup', x + out * 50, y - 20);
    await settle();
    expect(pane().getBoundingClientRect().width).toBeCloseTo(before.width + 50, 0);
    expect(pane().getBoundingClientRect().height).toBeCloseTo(before.height + 20, 0);
  });

  // spec: layout-scaffold-8f2730
  it('mirrors the resize handle in RTL', async () => {
    const ltr = await setup();
    await settle();
    const ltrSide = handleSide(ltr.q, ltr.pane().getBoundingClientRect());
    const {q, pane} = await setup('levitate-draggable levitate-resizable', 'rtl');
    await settle();
    const start = pane().getBoundingClientRect();
    const side = handleSide(q, start);
    expect(side).not.toBe(ltrSide);
    key(q('.float-resize')!, side === 'right' ? 'ArrowRight' : 'ArrowLeft');
    await settle();
    expect(pane().getBoundingClientRect().width).toBeCloseTo(start.width + 16, 0);
  });

  // spec: layout-scaffold-8f2730
  it('resets to the default place when closed and reopened', async () => {
    const {scaffold, q, pane} = await setup();
    await settle();
    const start = pane().getBoundingClientRect();
    key(q('.float-move')!, 'ArrowUp');
    await settle();
    expect(pane().getBoundingClientRect().top).toBeLessThan(start.top);
    scaffold.closeLevitated();
    await settle();
    scaffold.openLevitated();
    await settle();
    expect(pane().getBoundingClientRect().top).toBeCloseTo(start.top, 0);
  });
});
