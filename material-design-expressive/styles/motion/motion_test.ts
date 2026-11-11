/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia} from '@web/test-runner-commands';

import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

import {
  FALLBACK_SPRING_DURATIONS,
  isReducedMotion,
  onReducedMotionChange,
  parseDuration,
  prefersReducedMotion,
  springDuration,
  springDurationToken,
  springTimeout,
  waitForDuration,
  waitForMotion,
} from './motion.js';
import {until} from '../../components/shared/test-dom.js';

adoptStyles(document, [m3Styles]);

let host: HTMLElement;

beforeEach(() => {
  host = document.createElement('div');
  document.body.append(host);
});

afterEach(async () => {
  host.remove();
  await emulateMedia({reducedMotion: 'no-preference'});
});

/** Two frames: lets media query change events and their listeners run. */
function twoFrames() {
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve)),
  );
}

/** Starts a long animation of an opacity transition on `el`. */
function animate(el: HTMLElement, duration: number) {
  return el.animate([{opacity: 0}, {opacity: 1}], {duration});
}

describe('parseDuration()', () => {
  it('reads milliseconds and seconds', () => {
    expect(parseDuration('350ms')).toBe(350);
    expect(parseDuration('0.35s')).toBe(350);
    expect(parseDuration(' 2s ')).toBe(2000);
    expect(parseDuration('.5s')).toBe(500);
    expect(parseDuration('0ms')).toBe(0);
    expect(parseDuration('140MS')).toBe(140);
  });

  it('returns undefined for values that are not times', () => {
    expect(parseDuration('')).toBeUndefined();
    expect(parseDuration(null)).toBeUndefined();
    expect(parseDuration(undefined)).toBeUndefined();
    expect(parseDuration('linear')).toBeUndefined();
    expect(parseDuration('350')).toBeUndefined();
    expect(parseDuration('fast')).toBeUndefined();
  });

  it('treats a negative time as 0', () => {
    expect(parseDuration('-5ms')).toBe(0);
  });
});

describe('springDurationToken()', () => {
  it('names the duration token of each spring', () => {
    // spec: motion-overview-067c1f
    expect(springDurationToken('fast', 'spatial')).toBe(
      '--md-sys-motion-spring-fast-spatial-duration',
    );
    expect(springDurationToken('slow', 'effects')).toBe(
      '--md-sys-motion-spring-slow-effects-duration',
    );
  });
});

describe('springDuration()', () => {
  // spec: motion-overview-067c1f
  it('reads the six duration tokens (spatial and effects; fast, default, slow)', () => {
    for (const speed of ['fast', 'default', 'slow'] as const) {
      for (const kind of ['spatial', 'effects'] as const) {
        const expected = parseDuration(
          getComputedStyle(host).getPropertyValue(
            springDurationToken(speed, kind),
          ),
        )!;
        expect(springDuration(host, speed, kind))
          .withContext(`${speed} ${kind}`)
          .toBe(expected);
        expect(expected).toBeGreaterThan(0);
      }
    }
  });

  // spec: motion-overview-f68785, motion-overview-020295
  it('follows the motion scheme of the element', () => {
    const expressive = springDuration(host, 'fast', 'spatial');
    host.classList.add('md-motion-standard');
    const standard = springDuration(host, 'fast', 'spatial');
    expect(standard).toBe(160);
    expect(expressive).toBe(350);
  });

  it('reads a token set on the element itself', () => {
    host.style.setProperty('--md-sys-motion-spring-default-effects-duration', '0.5s');
    expect(springDuration(host, 'default', 'effects')).toBe(500);
  });

  it('falls back to the Expressive duration when the tokens are not loaded', () => {
    host.style.setProperty('--md-sys-motion-spring-slow-spatial-duration', 'oops');
    expect(springDuration(host, 'slow', 'spatial')).toBe(
      FALLBACK_SPRING_DURATIONS['slow-spatial'],
    );
    const detached = document.createElement('div');
    expect(springDuration(detached, 'fast', 'effects')).toBe(
      FALLBACK_SPRING_DURATIONS['fast-effects'],
    );
  });

  describe('reduced motion', () => {
    // spec: motion-transitions-ec3f87, motion-transitions-1ec6c0, motion-transitions-cab46b, motion-transitions-3bb2d7
    it('is 0 for spatial springs and unchanged for effects springs with the platform setting on', async () => {
      const spatial = springDuration(host, 'default', 'spatial');
      const effects = springDuration(host, 'default', 'effects');
      expect(spatial).toBeGreaterThan(0);
      await emulateMedia({reducedMotion: 'reduce'});
      for (const speed of ['fast', 'default', 'slow'] as const) {
        expect(springDuration(host, speed, 'spatial'))
          .withContext(speed)
          .toBe(0);
      }
      expect(springDuration(host, 'default', 'effects')).toBe(effects);
    });

    // spec: motion-transitions-cab46b, motion-transitions-3bb2d7
    it('is 0 for spatial springs inside .md-motion-reduced, also across shadow roots', () => {
      const outer = document.createElement('div');
      outer.classList.add('md-motion-reduced');
      const root = outer.attachShadow({mode: 'open'});
      const inner = document.createElement('div');
      root.append(inner);
      host.append(outer);
      expect(springDuration(inner, 'fast', 'spatial')).toBe(0);
      expect(springDuration(inner, 'fast', 'effects')).toBeGreaterThan(0);
      expect(springDuration(host, 'fast', 'spatial')).toBeGreaterThan(0);
    });

    it('keeps the effects fade even when the spatial tokens are not loaded', async () => {
      await emulateMedia({reducedMotion: 'reduce'});
      const detached = document.createElement('div');
      expect(springDuration(detached, 'default', 'spatial')).toBe(0);
      expect(springDuration(detached, 'default', 'effects')).toBe(
        FALLBACK_SPRING_DURATIONS['default-effects'],
      );
    });
  });
});

describe('springTimeout()', () => {
  it('is the spring duration plus slack', () => {
    const duration = springDuration(host, 'default', 'effects');
    expect(springTimeout(host, 'default', 'effects')).toBeGreaterThan(duration);
    expect(springTimeout(host, 'default', 'effects')).toBeLessThanOrEqual(
      duration + 250,
    );
  });

  it('is only the slack for a spatial spring when motion is reduced', async () => {
    await emulateMedia({reducedMotion: 'reduce'});
    expect(springTimeout(host, 'slow', 'spatial')).toBeLessThanOrEqual(250);
  });
});

describe('reduced motion setting', () => {
  // spec: motion-transitions-ec3f87, motion-transitions-1ec6c0
  it('is read from the platform', async () => {
    expect(prefersReducedMotion()).toBeFalse();
    expect(isReducedMotion(host)).toBeFalse();
    await emulateMedia({reducedMotion: 'reduce'});
    expect(prefersReducedMotion()).toBeTrue();
    expect(isReducedMotion(host)).toBeTrue();
    expect(isReducedMotion()).toBeTrue();
  });

  it('is also on inside .md-motion-reduced', () => {
    const child = document.createElement('span');
    host.classList.add('md-motion-reduced');
    host.append(child);
    expect(isReducedMotion(child)).toBeTrue();
    expect(isReducedMotion(document.body)).toBeFalse();
    expect(isReducedMotion(null)).toBeFalse();
  });

  it('notifies listeners of changes until stopped or aborted', async () => {
    const seen: boolean[] = [];
    const stop = onReducedMotionChange((reduced) => seen.push(reduced));
    const abort = new AbortController();
    const aborted: boolean[] = [];
    onReducedMotionChange((reduced) => aborted.push(reduced), abort.signal);
    await emulateMedia({reducedMotion: 'reduce'});
    await until(() => seen.length > 0 && aborted.length > 0);
    expect(seen).toEqual([true]);
    expect(aborted).toEqual([true]);
    stop();
    abort.abort();
    await emulateMedia({reducedMotion: 'no-preference'});
    await twoFrames();
    expect(seen).toEqual([true]);
    expect(aborted).toEqual([true]);
  });
});

describe('waitForMotion()', () => {
  it('resolves at once when nothing animates', async () => {
    const start = performance.now();
    expect(await waitForMotion(host)).toBe('none');
    expect(performance.now() - start).toBeLessThan(50);
  });

  it('resolves for a missing element', async () => {
    expect(await waitForMotion(null)).toBe('none');
    expect(await waitForMotion(undefined, {idle: 5})).toBe('none');
  });

  it('waits for an animation to finish', async () => {
    const animation = animate(host, 80);
    const start = performance.now();
    expect(await waitForMotion(host)).toBe('finished');
    expect(performance.now() - start).toBeGreaterThanOrEqual(60);
    expect(animation.playState).toBe('finished');
  });

  it('waits for a CSS transition', async () => {
    host.style.cssText = 'opacity:0;transition:opacity 80ms linear';
    getComputedStyle(host).opacity;
    host.style.opacity = '1';
    const start = performance.now();
    expect(await waitForMotion(host)).toBe('finished');
    expect(performance.now() - start).toBeGreaterThanOrEqual(60);
  });

  it('waits for all animations of the element', async () => {
    animate(host, 40);
    const slow = animate(host, 120);
    expect(await waitForMotion(host)).toBe('finished');
    expect(slow.playState).toBe('finished');
  });

  it('gives up after the timeout when an animation does not end', async () => {
    const animation = animate(host, 60000);
    const start = performance.now();
    expect(await waitForMotion(host, {timeout: 60})).toBe('timeout');
    expect(performance.now() - start).toBeLessThan(500);
    animation.cancel();
  });

  it('counts a canceled animation as ended', async () => {
    const animation = animate(host, 60000);
    const result = waitForMotion(host, {timeout: 2000});
    animation.cancel();
    expect(await result).toBe('finished');
  });

  it('ignores animations of descendants unless asked for the subtree', async () => {
    const child = document.createElement('span');
    host.append(child);
    const animation = animate(child, 60000);
    expect(await waitForMotion(host, {timeout: 50})).toBe('none');
    expect(await waitForMotion(host, {timeout: 50, subtree: true})).toBe(
      'timeout',
    );
    animation.cancel();
  });

  it('waits `idle` ms for a transition that has not started yet', async () => {
    const start = performance.now();
    expect(await waitForMotion(host, {idle: 40})).toBe('none');
    expect(performance.now() - start).toBeGreaterThanOrEqual(30);
  });

  it('never waits longer than the timeout, also for `idle`', async () => {
    const start = performance.now();
    await waitForMotion(host, {idle: 5000, timeout: 30});
    expect(performance.now() - start).toBeLessThan(500);
  });

  it('ends early when the signal aborts', async () => {
    const animation = animate(host, 60000);
    const abort = new AbortController();
    const result = waitForMotion(host, {timeout: 5000, signal: abort.signal});
    abort.abort();
    expect(await result).toBe('aborted');
    animation.cancel();
    abort.abort();
    expect(await waitForMotion(host, {signal: abort.signal})).toBe('aborted');
  });
});

describe('waitForDuration()', () => {
  it('waits the given time', async () => {
    const start = performance.now();
    await waitForDuration(50);
    expect(performance.now() - start).toBeGreaterThanOrEqual(40);
  });

  it('resolves at once for zero and negative durations', async () => {
    const start = performance.now();
    await waitForDuration(0);
    await waitForDuration(-5);
    expect(performance.now() - start).toBeLessThan(30);
  });

  it('ends early when the signal aborts', async () => {
    const abort = new AbortController();
    const start = performance.now();
    const waiting = waitForDuration(5000, abort.signal);
    abort.abort();
    await waiting;
    expect(performance.now() - start).toBeLessThan(500);
    await waitForDuration(5000, abort.signal);
  });
});
