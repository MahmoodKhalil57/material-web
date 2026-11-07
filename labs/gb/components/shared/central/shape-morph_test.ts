/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendMouse} from '@web/test-runner-commands';

import {center, renderSubject, until} from './subjects.js';
import {frames, reset, settleMotion, subject} from './states-helpers.js';

// Shape morphs (buttons > Shape morph, icon buttons > Shape morph): the corner
// radius animates between a "full" shape and a smaller one on press and when
// selected. `--md-sys-shape-corner-full` is `50cqmin`, which resolves against
// the nearest size container or the viewport rather than the element, so a
// full corner used to animate from a radius far above half the height: nothing
// visibly changed for ~100ms and then the corner snapped. A full shape on an
// element that morphs must be half the element's own height (Compose
// CircleShape), so the animation interpolates between visible values.

interface Sample {
  t: number;
  /** The computed (unclamped) radius. */
  radius: number;
  /** The drawn radius: the computed radius clamped to half the shorter side. */
  visible: number;
}

/** The part of the subject that draws the container. */
function container(el: HTMLElement): HTMLElement {
  return el.shadowRoot!.querySelector<HTMLElement>('[part=btn], [part=icon-btn]')!;
}

function read(part: HTMLElement, t: number): Sample {
  const box = part.getBoundingClientRect();
  const radius = parseFloat(getComputedStyle(part).borderTopLeftRadius);
  return {t, radius, visible: Math.min(radius, Math.min(box.width, box.height) / 2)};
}

/** The radius a `--md-sys-shape-corner-*` token resolves to. */
function tokenRadius(name: string): number {
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;width:200px;height:200px;border-radius:var(--md-sys-shape-corner-${name})`;
  document.body.append(probe);
  const r = parseFloat(getComputedStyle(probe).borderTopLeftRadius);
  probe.remove();
  return r;
}

/** Samples the drawn radius every frame while `act` runs, for `ms`. */
async function sample(part: HTMLElement, act: () => Promise<unknown> | unknown, ms = 450) {
  const samples: Sample[] = [];
  let running = true;
  let t0 = performance.now();
  const loop = () => {
    if (!running) return;
    samples.push(read(part, performance.now() - t0));
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  await act();
  t0 = performance.now();
  await new Promise((r) => setTimeout(r, ms));
  running = false;
  return samples.filter((s) => s.t >= -50);
}

/** Asserts a smooth, immediate morph from `from` to `to` in drawn pixels. */
function expectSmoothMorph(samples: Sample[], from: number, to: number) {
  const total = Math.abs(to - from);
  expect(total).toBeGreaterThan(2);
  const after = samples.filter((s) => s.t >= 0);
  // Visible change within the first ~50ms: no dead time.
  const early = after.filter((s) => s.t <= 50);
  const moved = Math.max(...early.map((s) => Math.abs(s.visible - from)));
  expect(moved).toBeGreaterThan(total * 0.1);
  // No single-frame jump larger than 40% of the total change.
  let biggest = 0;
  for (let i = 1; i < samples.length; i++) {
    biggest = Math.max(biggest, Math.abs(samples[i].visible - samples[i - 1].visible));
  }
  expect(biggest).toBeLessThanOrEqual(total * 0.4);
  // It ends on the target.
  expect(after[after.length - 1].visible).toBeCloseTo(to, 0);
}

describe('shape morph (central)', () => {
  afterEach(reset);

  // Press: [subject id, pressed corner token].
  const PRESS: Array<[string, string]> = [
    ['button-filled', 'sm'],
    ['button-xs', 'sm'],
    ['button-md', 'md'],
    ['button-xl', 'lg'],
    ['icon-button-filled', 'sm'],
    ['icon-button-xs', 'sm'],
  ];

  for (const [id, pressed] of PRESS) {
    it(`morphs a full corner on press and release without dead time: ${id}`, async () => {
      const {el, cleanup} = await renderSubject(subject(id));
      const part = container(el);
      const half = part.getBoundingClientRect().height / 2;
      const target = tokenRadius(pressed);
      settleMotion();
      // At rest the corner is half the container height, not 50cqmin.
      expect(Math.abs(read(part, 0).radius - half)).toBeLessThanOrEqual(1);

      const c = center(el);
      await sendMouse({type: 'move', position: [c.x, c.y]});
      await frames();
      settleMotion();

      const down = await sample(part, () => sendMouse({type: 'down'}));
      expectSmoothMorph(down, half, target);
      // The pressed corner is the token value.
      expect(Math.abs(read(part, 0).radius - target)).toBeLessThanOrEqual(1);

      const up = await sample(part, () => sendMouse({type: 'up'}));
      expectSmoothMorph(up, target, half);
      cleanup();
    });
  }

  // Selected toggle: a full corner becomes the medium corner.
  for (const id of ['button-toggle', 'icon-button-toggle']) {
    it(`morphs a full corner when selected without dead time: ${id}`, async () => {
      const {el, cleanup} = await renderSubject(subject(id));
      const part = container(el);
      const half = part.getBoundingClientRect().height / 2;
      const target = tokenRadius('md');
      settleMotion();
      expect(Math.abs(read(part, 0).radius - half)).toBeLessThanOrEqual(1);

      const on = await sample(part, () => {
        (el as HTMLElement & {selected: boolean}).selected = true;
      });
      await until(() => Math.abs(read(part, 0).radius - target) <= 1);
      expectSmoothMorph(on, half, target);
      cleanup();
    });
  }
});
