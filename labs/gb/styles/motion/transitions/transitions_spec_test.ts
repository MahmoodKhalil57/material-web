/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../../adopt-styles.js';
import {styles as m3Styles} from '../../m3.cssresult.js';

import transitionStyles from './md-motion-transitions.cssresult.js';
import {
  CONTAINER_TRANSFORM_FADE,
  containerTransform,
  enter,
  enterExitClasses,
  exit,
  FADE_THROUGH_THRESHOLD,
  fadeThrough,
  fadeThroughKeyframes,
  lateral,
  lateralKeyframes,
  reducedKeyframes,
  sharedAxis,
  sharedAxisKeyframes,
  SKELETON_CLASSES,
  TRANSITION_CLASSES,
  transitionTiming,
  VIEW_TRANSITION_NAMES,
  type Choreography,
} from './transitions.js';

adoptStyles(document, [m3Styles, transitionStyles]);

// Spec checks for styles/motion/transitions.md: the six transition patterns
// and "What makes a good transition". The mechanics of each pattern are in
// `transitions_test.ts`; this file checks the spec's rules about them.

function root(name: string, el: Element = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

/** The opacity of a keyframe list at progress `p` (linear between keyframes). */
function opacityAt(frames: Keyframe[], p: number) {
  const stops = frames
    .filter((f) => f['opacity'] !== undefined)
    .map((f) => ({offset: f['offset'] as number, opacity: Number(f['opacity'])}));
  if (stops[0].offset > 0) stops.unshift({offset: 0, opacity: stops[0].opacity});
  if (stops[stops.length - 1].offset < 1) {
    stops.push({offset: 1, opacity: stops[stops.length - 1].opacity});
  }
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (p >= a.offset && p <= b.offset) {
      return b.offset === a.offset ? b.opacity : a.opacity + ((b.opacity - a.opacity) * (p - a.offset)) / (b.offset - a.offset);
    }
  }
  return 1;
}

/** The progress values at which both contents are partially transparent. */
function crossFades({out, in: incoming}: Choreography) {
  const found: number[] = [];
  for (let p = 0.005; p < 1; p += 0.005) {
    const o = opacityAt(out, p);
    const i = opacityAt(incoming, p);
    // Both visible at once, either of them still partially transparent.
    if (o > 0.001 && i > 0.001) found.push(Math.round(p * 1000) / 1000);
  }
  return found;
}

describe('transition patterns', () => {
  // spec: motion-transitions-f46ec5
  it('implements the six patterns: container transform, forward and backward, lateral, top level, enter and exit, skeleton loaders', () => {
    for (const fn of [containerTransform, sharedAxis, lateral, fadeThrough, enter, exit]) {
      expect(typeof fn).toBe('function');
    }
    expect(TRANSITION_CLASSES.enter).toBe('md-transition-enter');
    expect(TRANSITION_CLASSES.exit).toBe('md-transition-exit');
    expect(SKELETON_CLASSES.skeleton).toBe('md-skeleton');
    expect(VIEW_TRANSITION_NAMES.containerTransform).toBe('md-container-transform');
  });

  // spec: motion-transitions-630b81, motion-transitions-4464c7, motion-transitions-eebc6a
  it('connects container transform states with one persistent, named container', () => {
    // Only one element carries the name at a time (the container); the content
    // inside it cross-fades, so only the important element persists.
    expect(Object.values(VIEW_TRANSITION_NAMES).filter((n) => n.includes('container'))).toEqual([
      'md-container-transform',
    ]);
    const group = root('--md-transition-container-transform-duration');
    expect(parseFloat(group)).toBeGreaterThan(0);
  });

  describe('forward and backward (shared axis)', () => {
    // spec: motion-transitions-5b3c0b
    it('fades as the screens slide', () => {
      const {out, in: incoming} = sharedAxisKeyframes('forward');
      expect(out.some((f) => f['opacity'] !== undefined)).toBeTrue();
      expect(incoming.some((f) => f['opacity'] !== undefined)).toBeTrue();
      expect(out.some((f) => f['translate'] !== undefined)).toBeTrue();
      expect(incoming.some((f) => f['translate'] !== undefined)).toBeTrue();
    });

    // spec: motion-transitions-b748e5
    it('moves along one axis, in one direction', () => {
      for (const direction of ['forward', 'backward'] as const) {
        for (const [axis, pattern] of [['x', /^-?[\d.]+px 0(px)?$/], ['y', /^0(px)? -?[\d.]+px$/]] as const) {
          const {out, in: incoming} = sharedAxisKeyframes(direction, {axis});
          const moves = [...out, ...incoming].map((f) => f['translate'] as string).filter(Boolean);
          expect(moves.length).toBeGreaterThan(0);
          for (const move of moves) expect(move).withContext(`${direction} ${axis}`).toMatch(pattern);
          expect(JSON.stringify([out, incoming])).not.toContain('scale');
          // The outgoing content leaves toward where the incoming one came from:
          // the whole view moves as one.
          const outEnd = parseFloat((out[out.length - 1]['translate'] as string).split(' ')[axis === 'x' ? 0 : 1]);
          const inStart = parseFloat((incoming[0]['translate'] as string).split(' ')[axis === 'x' ? 0 : 1]);
          expect(Math.sign(outEnd)).toBe(-Math.sign(inStart));
        }
      }
    });
  });

  describe('lateral', () => {
    // spec: motion-transitions-3da5d2, motion-transitions-97ca4c
    it('slides in unison without a fade or parallax effect', () => {
      for (const direction of ['next', 'previous'] as const) {
        const {out, in: incoming} = lateralKeyframes(direction);
        expect(JSON.stringify([out, incoming])).not.toMatch(/opacity|scale/);
        // Both pages cover the same distance (no parallax).
        expect(Math.abs(parseFloat(out[1]['translate'] as string))).toBe(100);
        expect(Math.abs(parseFloat(incoming[0]['translate'] as string))).toBe(100);
      }
    });
  });

  describe('top level (fade through)', () => {
    // spec: motion-transitions-6f8a8e
    it('fades the exiting screen out quickly and then fades the entering screen in', () => {
      const {out, in: incoming} = fadeThroughKeyframes();
      expect(opacityAt(out, FADE_THROUGH_THRESHOLD)).toBe(0);
      expect(FADE_THROUGH_THRESHOLD).toBeLessThan(0.5);
      expect(opacityAt(incoming, FADE_THROUGH_THRESHOLD)).toBe(0);
      expect(opacityAt(incoming, 1)).toBe(1);
    });
  });
});

describe('what makes a good transition', () => {
  const patterns: Array<[string, Choreography]> = [
    ['fade through', fadeThroughKeyframes()],
    ['shared axis x forward', sharedAxisKeyframes('forward')],
    ['shared axis x backward', sharedAxisKeyframes('backward')],
    ['shared axis y', sharedAxisKeyframes('forward', {axis: 'y'})],
    ['shared axis z', sharedAxisKeyframes('forward', {axis: 'z'})],
    ['reduced motion', reducedKeyframes()],
  ];

  // spec: motion-transitions-e38c87, motion-transitions-5a1055, motion-transitions-43d61e, motion-transitions-1b3aea
  it('fully fades the outgoing content out before the incoming content fades in', () => {
    for (const [name, choreography] of patterns) {
      expect(crossFades(choreography)).withContext(name).toEqual([]);
    }
  });

  // spec: motion-transitions-21511d
  it('keeps a needed cross fade quick, during the fastest part of the transition', () => {
    for (const phase of ['enter', 'return'] as const) {
      const [from, to] = CONTAINER_TRANSFORM_FADE[phase];
      expect(to - from).withContext(phase).toBeLessThanOrEqual(0.35);
    }
    // Entering, the fade is over by the time the emphasized curve is half done.
    expect(CONTAINER_TRANSFORM_FADE.enter[1]).toBeLessThanOrEqual(0.3);
    expect(FADE_THROUGH_THRESHOLD).toBeLessThanOrEqual(0.35);
  });

  // spec: motion-transitions-dd5611
  it('does not slowly fade components in on top of other content (the fade is much shorter than the move)', () => {
    const fade = parseFloat(root('--md-transition-enter-fade-duration'));
    expect(fade).toBeLessThanOrEqual(100);
    expect(fade).toBeLessThan(parseFloat(root('--md-transition-enter-duration')) / 2);
    const el = document.createElement('div');
    el.className = 'md-transition-enter';
    document.body.append(el);
    const durations = getComputedStyle(el).animationDuration.split(',').map((d) => parseFloat(d) * 1000);
    expect(Math.min(...durations)).toBeLessThanOrEqual(100);
    el.remove();
  });

  // spec: motion-transitions-325a6d, motion-transitions-b45a85
  it('animates by default instead of cutting, and reduced motion still fades instead of jumping', () => {
    for (const name of ['container-transform', 'shared-axis', 'fade-through', 'lateral', 'reduced'] as const) {
      expect(transitionTiming(name).duration).withContext(name).toBeGreaterThan(0);
    }
    const el = document.createElement('div');
    el.className = 'md-transition-enter md-transition-reduced';
    document.body.append(el);
    expect(getComputedStyle(el).animationName).toBe('md-transition-fade-in');
    expect(parseFloat(getComputedStyle(el).animationDuration)).toBeGreaterThan(0);
    el.remove();
  });

  // spec: motion-transitions-38f131
  it('uses plain easing curves, not bouncy springs, for common transitions', () => {
    for (const name of ['container-transform', 'shared-axis', 'fade-through', 'lateral', 'enter', 'exit', 'reduced']) {
      const easing = root(`--md-transition-${name}-easing`);
      expect(easing).withContext(name).toMatch(/^cubic-bezier\(/);
      const [, y1, , y2] = easing.match(/-?[\d.]+/g)!.map(Number);
      // y values inside [0, 1] never overshoot.
      expect(y1).toBeGreaterThanOrEqual(0);
      expect(y1).toBeLessThanOrEqual(1);
      expect(y2).toBeGreaterThanOrEqual(0);
      expect(y2).toBeLessThanOrEqual(1);
    }
  });
});

describe('enter and exit', () => {
  /** The `--_translate` vector a class combination sets on an element. */
  function translateOf(classes: string, dir: 'ltr' | 'rtl' = 'ltr') {
    const el = document.createElement('div');
    el.dir = dir;
    el.className = `md-transition-enter md-transition-slide ${classes}`;
    document.body.append(el);
    const value = getComputedStyle(el).getPropertyValue('--_translate').trim();
    el.remove();
    return value;
  }

  // spec: motion-transitions-17c3b6
  it('avoids scale and z-axis motion by default', () => {
    expect(enterExitClasses('enter')[TRANSITION_CLASSES.scale]).toBeFalse();
    expect(enterExitClasses('enter', {style: 'slide'})[TRANSITION_CLASSES.scale]).toBeFalse();
    // Shared axis defaults to the x axis, not z.
    const {in: incoming} = sharedAxisKeyframes('forward');
    expect(JSON.stringify(incoming)).not.toContain('scale');
  });

  // spec: motion-transitions-28feb6, motion-transitions-4486fd
  it('expands and collapses along the x or y axis, and slides on and off screen along one axis', () => {
    for (const origin of ['top', 'bottom', 'start', 'end'] as const) {
      const vector = translateOf(TRANSITION_CLASSES[`from${origin[0].toUpperCase()}${origin.slice(1)}` as 'fromTop']);
      const [x, y] = vector.split(' ');
      // One of the two components is 0: movement on a single axis.
      expect(parseFloat(x) === 0 || parseFloat(y) === 0).withContext(origin).toBeTrue();
    }
  });

  // spec: motion-transitions-e3086a, motion-transitions-518f9a, motion-transitions-0c3ea4, motion-transitions-16cc39
  it('enters from the edge it comes from, a bottom sheet from the bottom by default, a drawer from the start edge', () => {
    expect(translateOf('md-transition-from-top')).toBe('0 -100%');
    expect(translateOf('md-transition-from-bottom')).toBe('0 100%');
    expect(translateOf('md-transition-from-start')).toBe('-100% 0');
    expect(translateOf('md-transition-from-end')).toBe('100% 0');
    // Sheets slide in from the bottom unless told otherwise.
    expect(enterExitClasses('enter', {style: 'slide'})[TRANSITION_CLASSES.fromBottom]).toBeTrue();
  });

  // spec: motion-transitions-16cc39
  it('mirrors the start and end edges in RTL', () => {
    expect(translateOf('md-transition-from-start', 'rtl')).toBe('100% 0');
    expect(translateOf('md-transition-from-end', 'rtl')).toBe('-100% 0');
  });
});
