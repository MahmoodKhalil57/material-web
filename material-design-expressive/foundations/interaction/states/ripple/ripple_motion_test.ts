/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia} from '@web/test-runner-commands';

import {adoptStyles} from '../../../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../../../styles/m3.cssresult.js';
import {until} from '../../../../components/shared/test-dom.js';

import {setupRipple} from './ripple.js';
import rippleStyles from './ripple.cssresult.js';

// The pressed ripple follows Compose's material3-ripple (RippleAnimation.kt):
// the layer fades in over 75ms, the circle grows over 225ms (fast-out
// slow-in) while its center moves to the middle (linear), and the fade out
// (150ms linear) starts only after the press is released AND the growth is
// done. The tests sample the ripple custom properties once per frame.

adoptStyles(document, [m3Styles, rippleStyles]);

interface Sample {
  t: number;
  scale: number;
  opacity: number;
  x: number;
  active: boolean;
  animations: string[];
}

const num = (value: string) => parseFloat(value);

/** Records the ripple's layer values every frame until `stop()`. */
function sampler(el: HTMLElement) {
  const samples: Sample[] = [];
  const t0 = performance.now();
  let running = true;
  const frame = () => {
    const style = getComputedStyle(el);
    samples.push({
      t: performance.now() - t0,
      scale: num(style.getPropertyValue('--ripple-scale')),
      opacity: num(style.getPropertyValue('--ripple-press-opacity')),
      x: num(style.getPropertyValue('--ripple-x')),
      active: el.classList.contains('active'),
      animations: el
        .getAnimations()
        .map((a) => (a as Partial<CSSAnimation>).animationName ?? ''),
    });
    if (running) requestAnimationFrame(frame);
  };
  frame();
  return {
    samples,
    /** Waits until `ms` have passed since the start. */
    async until(ms: number) {
      await until(() => performance.now() - t0 >= ms, {timeout: ms + 1000});
    },
    stop() {
      running = false;
    },
  };
}

/** The sample closest to time `t`. */
function at(samples: Sample[], t: number): Sample {
  return samples.reduce((best, s) =>
    Math.abs(s.t - t) < Math.abs(best.t - t) ? s : best,
  );
}

/** First time (after `from`) a sample satisfies `check`. */
function firstTime(samples: Sample[], check: (s: Sample) => boolean, from = 0) {
  return samples.find((s) => s.t >= from && check(s))?.t;
}

describe('ripple motion', () => {
  let el: HTMLButtonElement;
  let abort: AbortController;

  beforeEach(async () => {
    abort = new AbortController();
    el = document.createElement('button');
    el.className = 'ripple';
    el.style.cssText =
      'display:block;position:fixed;left:20px;top:20px;inline-size:200px;block-size:100px;color:black';
    document.body.append(el);
    setupRipple(el, {signal: abort.signal});
    // Let the rest animation of a new ripple end.
    await until(() => el.getAnimations().length === 0);
  });

  afterEach(async () => {
    abort.abort();
    el.remove();
    await emulateMedia({reducedMotion: 'no-preference'});
  });

  // The press starts 10% across the element, 50% down.
  const down = () =>
    el.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        clientX: 40,
        clientY: 70,
        pointerId: 1,
      }),
    );
  const up = () =>
    window.dispatchEvent(new PointerEvent('pointerup', {pointerId: 1}));
  const key = (type: 'keydown' | 'keyup', k = ' ') =>
    el.dispatchEvent(new KeyboardEvent(type, {key: k, bubbles: true}));

  /** No frame may move the circle backwards while it is visible. */
  function expectSmoothGrowth(samples: Sample[]) {
    const visible = samples.filter((s) => s.opacity > 0.5);
    for (let i = 1; i < visible.length; i++) {
      expect(visible[i].scale)
        .withContext(`scale at ${visible[i].t.toFixed(0)}ms`)
        .toBeGreaterThanOrEqual(visible[i - 1].scale - 0.01);
    }
  }

  // spec: interaction-states-ef6972, interaction-states-ba2793
  it('a quick 50ms press grows for 225ms, then fades out over 150ms', async () => {
    down();
    const rec = sampler(el);
    setTimeout(up, 50);
    await rec.until(700);
    rec.stop();
    const s = rec.samples;

    // Fade in over 75ms.
    expect(at(s, 90).opacity).toBeCloseTo(10, 0);
    expect(at(s, 20).opacity).toBeLessThan(10);

    // The press is released at 50ms but stays until the growth is done.
    expect(at(s, 200).opacity).toBeCloseTo(10, 0);
    expect(at(s, 200).active).toBeTrue();
    expect(at(s, 200).scale).toBeLessThan(100);
    expect(at(s, 250).scale).toBeCloseTo(100, 0);

    // The circle ends its growth at about 225ms and does not jump later.
    const grown = firstTime(s, (x) => x.scale >= 99.5)!;
    expect(grown).toBeGreaterThan(190);
    expect(grown).toBeLessThan(270);
    expectSmoothGrowth(s);

    // Then it fades out over 150ms.
    const faded = firstTime(s, (x) => x.opacity <= 0.01, 100)!;
    expect(faded).toBeGreaterThan(grown + 100);
    expect(faded).toBeLessThan(grown + 150 + 70);

    // The center moves linearly from the touch point (10%) to the middle.
    expect(at(s, 5).x).toBeCloseTo(10, -1);
    const mid = at(s, 112).x;
    expect(mid).toBeGreaterThan(22);
    expect(mid).toBeLessThan(38);
    expect(at(s, 250).x).toBeCloseTo(50, 0);
  });

  // spec: interaction-states-ef6972, interaction-states-ba2793
  it('a long press holds the full ripple until release, then fades over 150ms', async () => {
    down();
    const rec = sampler(el);
    setTimeout(up, 600);
    await rec.until(1000);
    rec.stop();
    const s = rec.samples;

    for (const t of [300, 400, 500, 580]) {
      expect(at(s, t).opacity).withContext(`${t}ms`).toBeCloseTo(10, 0);
      expect(at(s, t).scale).withContext(`${t}ms`).toBeCloseTo(100, 0);
    }
    expectSmoothGrowth(s);

    const released = 600;
    const faded = firstTime(s, (x) => x.opacity <= 0.01, released)!;
    expect(faded).toBeGreaterThan(released + 100);
    expect(faded).toBeLessThan(released + 150 + 70);
    // The circle does not move while it fades (no jump at release).
    for (const x of s.filter((x) => x.t > released + 20 && x.opacity > 0.5)) {
      expect(x.scale).toBeCloseTo(100, 0);
      expect(x.x).toBeCloseTo(50, 0);
    }
  });

  // spec: interaction-states-ef6972, interaction-states-ba2793
  it('a keyboard press (Space) shows the same ripple from the center', async () => {
    key('keydown');
    const rec = sampler(el);
    setTimeout(() => key('keyup'), 50);
    await rec.until(700);
    rec.stop();
    const s = rec.samples;

    expect(at(s, 90).opacity).toBeCloseTo(10, 0);
    expect(at(s, 200).opacity).toBeCloseTo(10, 0);
    expect(at(s, 250).scale).toBeCloseTo(100, 0);
    for (const x of s.filter((x) => x.opacity > 0.5)) {
      expect(x.x).withContext(`x at ${x.t.toFixed(0)}ms`).toBeCloseTo(50, 0);
    }
    expectSmoothGrowth(s);
    expect(firstTime(s, (x) => x.opacity <= 0.01, 100)!).toBeLessThan(
      225 + 150 + 70,
    );
  });

  // spec: interaction-states-ef6972, interaction-states-ba2793
  it('a keyboard press (Enter) is one press, not restarted by its click', async () => {
    key('keydown', 'Enter');
    const rec = sampler(el);
    el.click();
    setTimeout(() => key('keyup', 'Enter'), 30);
    await rec.until(500);
    rec.stop();
    // A restarted animation would drop the scale back to 20%.
    expectSmoothGrowth(rec.samples);
    expect(at(rec.samples, 250).scale).toBeCloseTo(100, 0);
  });

  // spec: interaction-states-ef6972, interaction-states-ba2793
  it('reduced motion has no growing circle, only an opacity change', async () => {
    await emulateMedia({reducedMotion: 'reduce'});
    down();
    const rec = sampler(el);
    setTimeout(up, 50);
    await rec.until(500);
    rec.stop();
    const s = rec.samples;

    for (const x of s) {
      expect(x.animations.filter((a) => a.startsWith('ripple-press'))).toEqual(
        [],
      );
    }
    expect(at(s, 0).scale).toBeCloseTo(100, 0);
    expect(at(s, 90).opacity).toBeCloseTo(10, 0);
    expect(getComputedStyle(el).backgroundImage).toMatch(/circle,/);
    const faded = firstTime(s, (x) => x.opacity <= 0.01, 100)!;
    expect(faded).toBeLessThan(225 + 150 + 70);
  });

  it('hides the browser tap highlight so touch shows only the ripple', () => {
    expect(
      getComputedStyle(el).getPropertyValue('-webkit-tap-highlight-color'),
    ).toBe('rgba(0, 0, 0, 0)');
    const target = document.createElement('a');
    target.className = 'ripple-target';
    document.body.append(target);
    expect(
      getComputedStyle(target).getPropertyValue('-webkit-tap-highlight-color'),
    ).toBe('rgba(0, 0, 0, 0)');
    target.remove();
  });
});
