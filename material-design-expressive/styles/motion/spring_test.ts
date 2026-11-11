/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {
  EXPRESSIVE_SPRINGS,
  readSpring,
  solveSpring,
  Spring,
  type SpringOptions,
  STANDARD_SPRINGS,
} from './spring.js';
import {until} from '../../components/shared/test-dom.js';

/** A clock and frame loop the test advances by hand. */
class ManualFrames {
  time = 0;
  private callback: ((time: number) => void) | null = null;
  readonly scheduler = {
    request: (callback: (time: number) => void) => {
      this.callback = callback;
      return 1;
    },
    cancel: () => {
      this.callback = null;
    },
  };
  readonly now = () => this.time;

  /** Runs one frame `ms` later; false when no frame was pending. */
  frame(ms = 16): boolean {
    const callback = this.callback;
    if (!callback) return false;
    this.callback = null;
    this.time += ms;
    callback(this.time);
    return true;
  }
}

function setup(options: SpringOptions = {}) {
  const frames = new ManualFrames();
  const positions: number[] = [];
  const velocities: number[] = [];
  const rests: number[] = [];
  const spring = new Spring({
    spec: EXPRESSIVE_SPRINGS['default-spatial'],
    reduced: () => false,
    now: frames.now,
    scheduler: frames.scheduler,
    onFrame: (position, velocity) => {
      positions.push(position);
      velocities.push(velocity);
    },
    onRest: (position) => rests.push(position),
    ...options,
  });
  return {spring, frames, positions, velocities, rests};
}

describe('solveSpring()', () => {
  it('starts where it was released, with the given velocity', () => {
    for (const spec of [
      {damping: 0.8, stiffness: 380},
      {damping: 1, stiffness: 1600},
      {damping: 1.5, stiffness: 800},
    ]) {
      const state = solveSpring(spec, -80, 300, 0);
      expect(state.displacement).toBe(-80);
      expect(state.velocity).toBe(300);
    }
  });

  it('matches a numeric integration of the spring (damped, critical and over-damped)', () => {
    for (const spec of [
      EXPRESSIVE_SPRINGS['fast-spatial'],
      EXPRESSIVE_SPRINGS['default-spatial'],
      EXPRESSIVE_SPRINGS['default-effects'],
      {damping: 1.4, stiffness: 600},
    ]) {
      let x = -100;
      let v = 250;
      const dt = 0.0001;
      for (let t = 0; t < 0.3; t += dt) {
        // Semi-implicit Euler: a = -k x - c v, c = 2 damping sqrt(k).
        v += (-spec.stiffness * x - 2 * spec.damping * Math.sqrt(spec.stiffness) * v) * dt;
        x += v * dt;
      }
      const state = solveSpring(spec, -100, 250, 0.3);
      expect(state.displacement).toBeCloseTo(x, 0);
      expect(state.velocity / 100).toBeCloseTo(v / 100, 0);
    }
  });

  it('overshoots when under-damped and never when critically damped', () => {
    const peak = (damping: number) => {
      let max = -Infinity;
      for (let t = 0; t < 1; t += 0.005) {
        max = Math.max(max, solveSpring({damping, stiffness: 380}, -100, 0, t).displacement);
      }
      return max;
    };
    expect(peak(0.8)).toBeGreaterThan(0.5);
    expect(peak(1)).toBeLessThanOrEqual(0);
  });

  // The `--md-sys-motion-spring-default-spatial` easing crosses its target at
  // about 51% of its 420ms (damping 0.8, stiffness 380).
  it('reproduces the token easings of the default spatial spring', () => {
    const state = solveSpring(EXPRESSIVE_SPRINGS['default-spatial'], -1, 0, 0.2136);
    expect(state.displacement).toBeCloseTo(0, 2);
  });
});

describe('readSpring()', () => {
  let host: HTMLElement;
  beforeEach(() => {
    host = document.createElement('div');
    document.body.append(host);
  });
  afterEach(() => host.remove());

  it('reads the Expressive spring from the tokens', () => {
    host.style.setProperty('--md-sys-motion-spring-default-spatial-duration', '420ms');
    expect(readSpring(host)).toEqual({damping: 0.8, stiffness: 380});
    expect(readSpring(host, 'fast-effects')).toEqual({damping: 1, stiffness: 3800});
  });

  it('reads the Standard spring inside the Standard scheme', () => {
    host.style.setProperty('--md-sys-motion-spring-default-spatial-duration', '220ms');
    host.style.setProperty('--md-sys-motion-spring-fast-spatial-duration', '160ms');
    expect(readSpring(host)).toEqual(STANDARD_SPRINGS['default-spatial']);
    expect(readSpring(host, 'fast-spatial')).toEqual({damping: 0.9, stiffness: 1400});
  });

  it('falls back to the default spatial spring for an unknown name', () => {
    expect(readSpring(host, 'nope')).toEqual(EXPRESSIVE_SPRINGS['default-spatial']);
  });
});

describe('Spring', () => {
  it('springs from a position to a target and rests there', () => {
    const {spring, frames, positions, rests} = setup();
    spring.start(0, 100);
    expect(spring.running).toBeTrue();
    let guard = 0;
    while (frames.frame() && guard++ < 500);
    expect(spring.running).toBeFalse();
    expect(rests).toEqual([100]);
    expect(positions[positions.length - 1]).toBe(100);
    // The default spatial spring overshoots a little.
    expect(Math.max(...positions)).toBeGreaterThan(100);
    expect(spring.position).toBe(100);
    expect(spring.velocity).toBe(0);
  });

  it('keeps the release velocity at the start (velocity continuity)', () => {
    const {spring, frames, velocities, positions} = setup();
    // Released at 20px going 2000px/s toward 100.
    spring.start(20, 100, 2000);
    frames.frame(1);
    // 1ms in, the speed is the release speed within the spring's pull (< 1%
    // of its pull per ms: k * 80px * 1ms = 30px/s) and it has moved on.
    expect(velocities[0]).toBeGreaterThan(2000 - 60);
    expect(velocities[0]).toBeLessThan(2000 + 60);
    expect(positions[0]).toBeCloseTo(22, 0);
  });

  it('keeps a fling going even when released moving away from the target', () => {
    const {spring, frames, velocities} = setup();
    spring.start(50, 100, -800);
    frames.frame(8);
    expect(velocities[0]).toBeLessThan(0);
    frames.frame(100);
    expect(velocities[velocities.length - 1]).toBeGreaterThan(0);
  });

  it('retargets mid-flight with the same position and velocity', () => {
    const {spring, frames, positions, velocities} = setup();
    spring.start(0, 100, 0);
    for (let i = 0; i < 4; i++) frames.frame();
    const before = positions[positions.length - 1];
    const speed = velocities[velocities.length - 1];
    expect(speed).toBeGreaterThan(0);
    spring.retarget(300);
    expect(spring.running).toBeTrue();
    expect(spring.position).toBe(before);
    expect(spring.velocity).toBe(speed);
    frames.frame(1);
    // No jump in position or speed at the new target.
    expect(Math.abs(positions[positions.length - 1] - before)).toBeLessThan(speed * 0.002 + 1);
    expect(Math.abs(velocities[velocities.length - 1] - speed)).toBeLessThan(0.05 * 380 * 300);
    let guard = 0;
    while (frames.frame() && guard++ < 500);
    expect(positions[positions.length - 1]).toBe(300);
  });

  it('retargets a resting spring from where it rests', () => {
    const {spring, frames, rests} = setup();
    spring.start(0, 50);
    let guard = 0;
    while (frames.frame() && guard++ < 500);
    spring.retarget(0);
    expect(spring.running).toBeTrue();
    expect(spring.velocity).toBe(0);
    while (frames.frame() && guard++ < 1000);
    expect(rests).toEqual([50, 0]);
  });

  it('stops where it is, and finishes at the target', () => {
    const {spring, frames, rests} = setup();
    spring.start(0, 100);
    frames.frame();
    frames.frame();
    const at = spring.position;
    spring.stop();
    expect(spring.running).toBeFalse();
    expect(frames.frame()).toBeFalse();
    expect(spring.position).toBe(at);
    expect(rests).toEqual([]);

    spring.start(at, 100);
    spring.finish();
    expect(spring.position).toBe(100);
    expect(rests).toEqual([100]);
  });

  it('rests only once it is near the target and slow', () => {
    const {spring, frames, rests} = setup({restDelta: 0.5, restSpeed: 10});
    spring.start(0, 100);
    frames.frame(100);
    expect(rests).toEqual([]);
    let guard = 0;
    while (frames.frame() && guard++ < 500);
    expect(rests.length).toBe(1);
  });

  it('is not tied to the frame rate', () => {
    const slow = setup();
    const fast = setup();
    slow.spring.start(0, 100, 500);
    fast.spring.start(0, 100, 500);
    slow.frames.frame(160);
    for (let i = 0; i < 10; i++) fast.frames.frame(16);
    expect(slow.positions[0]).toBeCloseTo(fast.positions[fast.positions.length - 1], 3);
  });

  describe('reduced motion', () => {
    it('jumps to the target at once, with one frame and a rest', () => {
      const {spring, frames, positions, rests} = setup({reduced: () => true});
      spring.start(0, 100, 2000);
      expect(spring.running).toBeFalse();
      expect(positions).toEqual([100]);
      expect(rests).toEqual([100]);
      expect(frames.frame()).toBeFalse();
    });

    it('jumps when retargeted too', () => {
      let reduced = false;
      const {spring, rests, positions} = setup({reduced: () => reduced});
      spring.start(0, 100);
      reduced = true;
      spring.retarget(40);
      expect(spring.running).toBeFalse();
      expect(positions[positions.length - 1]).toBe(40);
      expect(rests).toEqual([40]);
    });
  });

  it('uses requestAnimationFrame by default', async () => {
    const rests: number[] = [];
    const spring = new Spring({reduced: () => false, onRest: (p) => rests.push(p)});
    spring.start(0, 10);
    await until(() => rests.length, {timeout: 3000});
    expect(rests).toEqual([10]);
  });
});
