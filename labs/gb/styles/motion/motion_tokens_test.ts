/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

import transitionStyles from './transitions/md-motion-transitions.cssresult.js';

adoptStyles(document, [m3Styles, transitionStyles]);

// Tests for the motion token pages (styles/motion/easing-and-duration.md and
// overview.md): the duration and easing tokens, the spring tokens of the two
// motion schemes, and the web curves that mimic the springs.

function root(name: string, el: Element = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

/** The progress of a `cubic-bezier()` at time `t` (0 to 1). */
function bezier(curve: string, t: number) {
  const [x1, y1, x2, y2] = curve.match(/-?[\d.]+/g)!.map(Number);
  const at = (a: number, b: number, s: number) =>
    3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (at(x1, x2, mid) < t) lo = mid;
    else hi = mid;
  }
  return at(y1, y2, (lo + hi) / 2);
}

/** The speed of a curve in 100 equal slices of its duration. */
function speeds(curve: string) {
  const out: number[] = [];
  for (let i = 0; i < 100; i++) {
    out.push((bezier(curve, (i + 1) / 100) - bezier(curve, i / 100)) * 100);
  }
  return out;
}

const DURATIONS: Record<string, number> = {
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  'extra-long1': 700,
  'extra-long2': 800,
  'extra-long3': 900,
  'extra-long4': 1000,
};

describe('duration tokens', () => {
  for (const [name, ms] of Object.entries(DURATIONS)) {
    it(`defines md.sys.motion.duration.${name} as ${ms}ms`, () => {
      expect(root(`--md-sys-motion-duration-${name}`)).toBe(`${ms}ms`);
    });
  }

  // spec: motion-easing-and-duration-37cbb3, motion-easing-and-duration-445444, motion-easing-and-duration-84c719, motion-easing-and-duration-605948, motion-easing-and-duration-63f90d
  it('defines the short durations (50 to 200ms) for small utility transitions', () => {
    const values = [1, 2, 3, 4].map((n) => parseFloat(root(`--md-sys-motion-duration-short${n}`)));
    expect(values).toEqual([50, 100, 150, 200]);
  });

  // spec: motion-easing-and-duration-c31f7e, motion-easing-and-duration-ccc125, motion-easing-and-duration-8a460d, motion-easing-and-duration-3d9cd4, motion-easing-and-duration-9e9f61
  it('defines the medium durations (250 to 400ms) for transitions over a medium area', () => {
    const values = [1, 2, 3, 4].map((n) => parseFloat(root(`--md-sys-motion-duration-medium${n}`)));
    expect(values).toEqual([250, 300, 350, 400]);
  });

  // spec: motion-easing-and-duration-08bc4c, motion-easing-and-duration-2da31f, motion-easing-and-duration-d6dba1, motion-easing-and-duration-b20aa8, motion-easing-and-duration-876563, motion-easing-and-duration-8b6dac
  it('defines the long durations (450 to 600ms) for large expressive transitions', () => {
    const values = [1, 2, 3, 4].map((n) => parseFloat(root(`--md-sys-motion-duration-long${n}`)));
    expect(values).toEqual([450, 500, 550, 600]);
  });

  // spec: motion-easing-and-duration-9ab7a0, motion-easing-and-duration-1d576a, motion-easing-and-duration-69e782, motion-easing-and-duration-32984a
  it('defines the extra long durations (700 to 1000ms)', () => {
    const values = [1, 2, 3, 4].map((n) => parseFloat(root(`--md-sys-motion-duration-extra-long${n}`)));
    expect(values).toEqual([700, 800, 900, 1000]);
  });

  // spec: motion-easing-and-duration-012863
  it('exposes duration and easing as design tokens (custom properties)', () => {
    const names = Object.keys(DURATIONS).map((n) => `--md-sys-motion-duration-${n}`);
    for (const set of ['standard', 'emphasized']) {
      for (const kind of ['', '-accelerate', '-decelerate']) {
        names.push(`--md-sys-motion-easing-${set}${kind}`);
      }
    }
    for (const name of names) expect(root(name)).withContext(name).not.toBe('');
  });
});

describe('easing tokens', () => {
  // spec: motion-easing-and-duration-1e0e24, motion-easing-and-duration-679b54
  it('defines the standard easing set as the CSS curves of the spec', () => {
    expect(root('--md-sys-motion-easing-standard')).toBe('cubic-bezier(0.2, 0, 0, 1)');
    expect(root('--md-sys-motion-easing-standard-decelerate')).toBe('cubic-bezier(0, 0, 0, 1)');
    expect(root('--md-sys-motion-easing-standard-accelerate')).toBe('cubic-bezier(0.3, 0, 1, 1)');
  });

  // spec: motion-easing-and-duration-316c0f, motion-easing-and-duration-aca9a2
  it('defines the emphasized decelerate and accelerate curves and falls back to standard for the base curve on the web', () => {
    expect(root('--md-sys-motion-easing-emphasized-decelerate')).toBe('cubic-bezier(0.05, 0.7, 0.1, 1)');
    expect(root('--md-sys-motion-easing-emphasized-accelerate')).toBe('cubic-bezier(0.3, 0, 0.8, 0.15)');
    expect(root('--md-sys-motion-easing-emphasized')).toBe(root('--md-sys-motion-easing-standard'));
  });

  // spec: motion-easing-and-duration-a4803e, motion-easing-and-duration-5200fa
  it('speeds up quickly and comes to a gentle rest for begin-and-end-on-screen (emphasized and standard)', () => {
    for (const name of ['standard', 'emphasized']) {
      const s = speeds(root(`--md-sys-motion-easing-${name}`));
      const peak = Math.max(...s);
      // Reaches peak speed early and ends nearly at rest.
      expect(s.indexOf(peak)).withContext(name).toBeLessThan(40);
      expect(s[99]).withContext(name).toBeLessThan(peak * 0.1);
    }
  });

  // spec: motion-easing-and-duration-af0d25
  it('begins at peak velocity and comes to a gentle rest for entering the screen (decelerate)', () => {
    for (const name of ['standard-decelerate', 'emphasized-decelerate']) {
      const s = speeds(root(`--md-sys-motion-easing-${name}`));
      expect(s[0]).withContext(name).toBe(Math.max(...s));
      expect(s[99]).withContext(name).toBeLessThan(s[0] * 0.1);
    }
  });

  // spec: motion-easing-and-duration-ba47d2, motion-easing-and-duration-f78f34
  it('begins at rest and ends at peak velocity for exiting the screen permanently (accelerate)', () => {
    for (const name of ['standard-accelerate', 'emphasized-accelerate']) {
      const s = speeds(root(`--md-sys-motion-easing-${name}`));
      expect(s[99]).withContext(name).toBe(Math.max(...s));
      expect(s[0]).withContext(name).toBeLessThan(s[99] * 0.1);
    }
    // The library's exit transition uses the accelerate curve.
    expect(root('--md-transition-exit-easing')).toBe(root('--md-sys-motion-easing-emphasized-accelerate'));
  });

  // spec: motion-easing-and-duration-8c64e2
  it('ends at rest just off screen for exiting temporarily (plain emphasized)', () => {
    const temporary = root('--md-transition-exit-temporary-easing');
    expect(temporary).toBe(root('--md-sys-motion-easing-emphasized'));
    const s = speeds(temporary);
    expect(s[99]).toBeLessThan(Math.max(...s) * 0.1);
  });

  // spec: motion-easing-and-duration-42e44c
  it('uses the emphasized set for the transitions of the library', () => {
    for (const name of ['container-transform', 'shared-axis', 'fade-through', 'lateral']) {
      expect(root(`--md-transition-${name}-easing`)).withContext(name).toBe(root('--md-sys-motion-easing-emphasized'));
    }
    expect(root('--md-transition-enter-easing')).toBe(root('--md-sys-motion-easing-emphasized-decelerate'));
    expect(root('--md-transition-exit-easing')).toBe(root('--md-sys-motion-easing-emphasized-accelerate'));
  });
});

describe('suggested easing and duration pairs (standard set)', () => {
  // spec: motion-easing-and-duration-dddf14, motion-easing-and-duration-40fbe6
  it('begins and ends on screen with standard easing over 300ms (medium2)', () => {
    expect(root('--md-sys-motion-duration-medium2')).toBe('300ms');
    expect(root('--md-sys-motion-easing-standard')).toBe('cubic-bezier(0.2, 0, 0, 1)');
  });

  // spec: motion-easing-and-duration-e3247a
  it('enters the screen with standard decelerate over 250ms (medium1)', () => {
    expect(root('--md-sys-motion-duration-medium1')).toBe('250ms');
    expect(root('--md-sys-motion-easing-standard-decelerate')).toBe('cubic-bezier(0, 0, 0, 1)');
  });

  // spec: motion-easing-and-duration-f4207b
  it('exits the screen with standard accelerate over 200ms (short4)', () => {
    expect(root('--md-sys-motion-duration-short4')).toBe('200ms');
    expect(root('--md-sys-motion-easing-standard-accelerate')).toBe('cubic-bezier(0.3, 0, 1, 1)');
  });
});

describe('durations by size and direction', () => {
  // spec: motion-easing-and-duration-3abfe0
  it('uses a shorter duration to exit, dismiss or collapse than to enter', () => {
    expect(parseFloat(root('--md-transition-exit-duration'))).toBeLessThan(parseFloat(root('--md-transition-enter-duration')));
    expect(parseFloat(root('--md-transition-reduced-duration'))).toBeLessThanOrEqual(parseFloat(root('--md-transition-enter-duration')));
  });

  // spec: motion-easing-and-duration-f67fff
  it('gives transitions over a large area a longer duration than small component transitions', () => {
    const small = parseFloat(root('--md-sys-motion-duration-short4'));
    expect(parseFloat(root('--md-transition-container-transform-duration'))).toBeGreaterThan(small);
    expect(parseFloat(root('--md-transition-lateral-duration'))).toBeGreaterThan(small);
    expect(parseFloat(root('--md-transition-shared-axis-duration'))).toBeGreaterThan(small);
  });
});

describe('spring tokens and motion schemes', () => {
  let scope: HTMLElement;
  beforeEach(() => {
    scope = document.createElement('div');
    document.body.append(scope);
  });
  afterEach(() => scope.remove());

  /** The peak output of a `linear()` easing. */
  function peak(easing: string) {
    const body = easing.replace(/^linear\(|\)$/g, '');
    return Math.max(...body.split(',').map((part) => parseFloat(part.trim().split(/\s+/)[0])));
  }

  // spec: motion-overview-bc9409
  it('defines a spring as stiffness, damping and an initial velocity of zero: one easing and one duration', () => {
    for (const speed of ['fast', 'default', 'slow']) {
      for (const kind of ['spatial', 'effects']) {
        const name = `--md-sys-motion-spring-${speed}-${kind}`;
        expect(root(name, scope)).withContext(name).toMatch(/^linear\(0,/);
        expect(parseFloat(root(`${name}-duration`, scope))).withContext(name).toBeGreaterThan(0);
      }
    }
  });

  // spec: motion-overview-1c47fd, motion-overview-7dab83, motion-overview-c3e642, motion-overview-9f6fe1
  it('overshoots the final value with the expressive spatial springs', () => {
    for (const speed of ['fast', 'default', 'slow']) {
      expect(peak(root(`--md-sys-motion-spring-${speed}-spatial`, scope))).withContext(speed).toBeGreaterThan(1.005);
    }
  });

  // spec: motion-overview-b5d645
  it('has no overshoot in the effects springs (color and opacity)', () => {
    for (const scheme of ['', 'md-motion-standard']) {
      if (scheme) scope.classList.add(scheme);
      for (const speed of ['fast', 'default', 'slow']) {
        expect(peak(root(`--md-sys-motion-spring-${speed}-effects`, scope))).withContext(`${scheme} ${speed}`).toBeLessThanOrEqual(1);
      }
    }
  });

  // spec: motion-overview-f2c75d, motion-overview-10a102
  it('eases into the final value with minimal bounce in the standard scheme', () => {
    scope.classList.add('md-motion-standard');
    for (const speed of ['fast', 'default', 'slow']) {
      expect(peak(root(`--md-sys-motion-spring-${speed}-spatial`, scope))).withContext(speed).toBeLessThanOrEqual(1.001);
    }
  });

  // spec: motion-overview-a6a730, motion-overview-f6f68c
  it('switches between the expressive and the standard scheme with a class', () => {
    const expressive = root('--md-sys-motion-spring-default-spatial', scope);
    scope.classList.add('md-motion-standard');
    expect(root('--md-sys-motion-spring-default-spatial', scope)).not.toBe(expressive);
    scope.classList.remove('md-motion-standard');
    expect(root('--md-sys-motion-spring-default-spatial', scope)).toBe(expressive);
  });

  // spec: motion-overview-a212f5, motion-overview-1cf832
  it('lets one element use another scheme, or custom values, than its page', () => {
    const inner = document.createElement('div');
    scope.classList.add('md-motion-standard');
    scope.append(inner);
    const standard = root('--md-sys-motion-spring-default-spatial', scope);
    // A custom scheme overrides the tokens on any element.
    inner.style.setProperty('--md-sys-motion-spring-default-spatial', 'linear(0, 1)');
    inner.style.setProperty('--md-sys-motion-spring-default-spatial-duration', '123ms');
    expect(root('--md-sys-motion-spring-default-spatial', inner)).toBe('linear(0, 1)');
    expect(root('--md-sys-motion-spring-default-spatial-duration', inner)).toBe('123ms');
    expect(root('--md-sys-motion-spring-default-spatial', scope)).toBe(standard);
    // The page keeps the expressive scheme.
    expect(root('--md-sys-motion-spring-default-spatial')).not.toBe(standard);
  });

  // spec: motion-overview-b7fcb9, motion-overview-5240e5
  it('makes fast springs shorter than default and default shorter than slow', () => {
    for (const scheme of ['', 'md-motion-standard']) {
      if (scheme) scope.classList.add(scheme);
      for (const kind of ['spatial', 'effects']) {
        const [fast, def, slow] = ['fast', 'default', 'slow'].map((speed) =>
          parseFloat(root(`--md-sys-motion-spring-${speed}-${kind}-duration`, scope)),
        );
        expect(fast).withContext(`${scheme} ${kind}`).toBeLessThan(def);
        expect(def).withContext(`${scheme} ${kind}`).toBeLessThan(slow);
      }
    }
  });

  // spec: motion-overview-9f6fe1, motion-overview-b5d645
  it('has a spatial and an effects spring in each of fast, default and slow', () => {
    for (const speed of ['fast', 'default', 'slow']) {
      for (const kind of ['spatial', 'effects']) {
        expect(root(`--md-sys-motion-spring-${speed}-${kind}`, scope)).not.toBe('');
      }
    }
  });
});

describe('web curves that mimic the springs', () => {
  let scope: HTMLElement;
  beforeEach(() => {
    scope = document.createElement('div');
    document.body.append(scope);
  });
  afterEach(() => scope.remove());

  const EXPRESSIVE: Record<string, [string, number]> = {
    'fast-spatial': ['0.42, 1.67, 0.21, 0.9', 350],
    'default-spatial': ['0.38, 1.21, 0.22, 1', 500],
    'slow-spatial': ['0.39, 1.29, 0.35, 0.98', 650],
    'fast-effects': ['0.31, 0.94, 0.34, 1', 150],
    'default-effects': ['0.34, 0.8, 0.34, 1', 200],
    'slow-effects': ['0.34, 0.88, 0.34, 1', 300],
  };
  const STANDARD: Record<string, [string, number]> = {
    'fast-spatial': ['0.27, 1.06, 0.18, 1', 350],
    'default-spatial': ['0.27, 1.06, 0.18, 1', 500],
    'slow-spatial': ['0.27, 1.06, 0.18, 1', 750],
    'fast-effects': ['0.31, 0.94, 0.34, 1', 150],
    'default-effects': ['0.34, 0.8, 0.34, 1', 200],
    'slow-effects': ['0.34, 0.88, 0.34, 1', 300],
  };

  const IDS: Record<string, string> = {
    'expressive:fast-spatial': 'motion-overview-7077b2',
    'expressive:default-spatial': 'motion-overview-b9ea85',
    'expressive:slow-spatial': 'motion-overview-745407',
    'expressive:fast-effects': 'motion-overview-8c4c68',
    'expressive:default-effects': 'motion-overview-dfd7c0',
    'expressive:slow-effects': 'motion-overview-ac8ad8',
    'standard:fast-spatial': 'motion-overview-9f2bc1',
    'standard:default-spatial': 'motion-overview-e385f4',
    'standard:slow-spatial': 'motion-overview-54990c',
    'standard:fast-effects': 'motion-overview-0aae43',
    'standard:default-effects': 'motion-overview-111edb',
    'standard:slow-effects': 'motion-overview-7bf462',
  };

  // spec: motion-overview-7077b2, motion-overview-b9ea85, motion-overview-745407, motion-overview-8c4c68, motion-overview-dfd7c0, motion-overview-ac8ad8
  it('converts the expressive springs to cubic-bezier curves with the durations of the spec', () => {
    for (const [name, [curve, ms]] of Object.entries(EXPRESSIVE)) {
      expect(root(`--md-sys-motion-curve-${name}`, scope)).withContext(IDS[`expressive:${name}`]).toBe(`cubic-bezier(${curve})`);
      expect(root(`--md-sys-motion-curve-${name}-duration`, scope)).withContext(name).toBe(`${ms}ms`);
    }
  });

  // spec: motion-overview-9f2bc1, motion-overview-e385f4, motion-overview-54990c, motion-overview-0aae43, motion-overview-111edb, motion-overview-7bf462
  it('converts the standard springs to cubic-bezier curves with the durations of the spec', () => {
    scope.classList.add('md-motion-standard');
    for (const [name, [curve, ms]] of Object.entries(STANDARD)) {
      expect(root(`--md-sys-motion-curve-${name}`, scope)).withContext(IDS[`standard:${name}`]).toBe(`cubic-bezier(${curve})`);
      expect(root(`--md-sys-motion-curve-${name}-duration`, scope)).withContext(name).toBe(`${ms}ms`);
    }
  });

  // spec: motion-overview-8883e4
  it('offers both the springs (linear()) and curves that mimic them', () => {
    expect(root('--md-sys-motion-spring-default-spatial', scope)).toMatch(/^linear\(/);
    expect(root('--md-sys-motion-curve-default-spatial', scope)).toMatch(/^cubic-bezier\(/);
  });

  it('collapses the spatial curves with reduced motion like the spatial springs', () => {
    scope.classList.add('md-motion-reduced');
    expect(root('--md-sys-motion-curve-fast-spatial-duration', scope)).toBe('0ms');
    expect(root('--md-sys-motion-curve-fast-effects-duration', scope)).toBe('150ms');
  });
});
