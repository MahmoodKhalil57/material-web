/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

import transitionStyles from './transitions/md-motion-transitions.cssresult.js';
import {transitionTiming} from './transitions/transitions.js';

adoptStyles(document, [m3Styles, transitionStyles]);

function timing(name: string) {
  return {
    duration: parseFloat(root('--md-transition-' + name + '-duration')),
    easing: root('--md-transition-' + name + '-easing'),
  };
}

function root(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

describe('easing and duration tokens', () => {
  // spec: motion-easing-and-duration-184c72, motion-easing-and-duration-479cf7, motion-easing-and-duration-d6f5ab, motion-easing-and-duration-7c525c
  it('defines the standard easing set as cubic beziers', () => {
    expect(root('--md-sys-motion-easing-standard')).toMatch(/^cubic-bezier\(/);
    expect(root('--md-sys-motion-easing-standard-accelerate')).toBe('cubic-bezier(0.3, 0, 1, 1)');
    expect(root('--md-sys-motion-easing-standard-decelerate')).toBe('cubic-bezier(0, 0, 0, 1)');
  });

  // spec: motion-easing-and-duration-ec9e43, motion-easing-and-duration-f35833, motion-easing-and-duration-43fe08, motion-easing-and-duration-ded9f8, motion-easing-and-duration-5e6898
  it('defines the emphasized easing set', () => {
    expect(root('--md-sys-motion-easing-emphasized')).not.toBe('');
    expect(root('--md-sys-motion-easing-emphasized-decelerate')).toBe('cubic-bezier(0.05, 0.7, 0.1, 1)');
    expect(root('--md-sys-motion-easing-emphasized-accelerate')).toBe('cubic-bezier(0.3, 0, 0.8, 0.15)');
  });
});

describe('suggested easing and duration pairs', () => {
  // spec: motion-easing-and-duration-1925b3, motion-easing-and-duration-1994cd, motion-easing-and-duration-c78201, motion-easing-and-duration-dc8db0, motion-easing-and-duration-cae1b4, motion-easing-and-duration-1a40f1
  it('slides on and off screen with emphasized easing over 500ms', () => {
    const lateral = transitionTiming('lateral');
    expect(lateral.duration).toBe(500);
    expect(lateral.easing).toBe(root('--md-sys-motion-easing-emphasized'));
    const container = transitionTiming('container-transform');
    expect(container.duration).toBe(500);
    expect(container.easing).toBe(root('--md-sys-motion-easing-emphasized'));
  });

  // spec: motion-easing-and-duration-05a3f8, motion-easing-and-duration-865908, motion-easing-and-duration-bbb652
  it('enters the screen with emphasized decelerate over 400ms', () => {
    const enter = timing('enter');
    expect(enter.duration).toBe(400);
    expect(enter.easing).toBe(root('--md-sys-motion-easing-emphasized-decelerate'));
  });

  // spec: motion-easing-and-duration-6a6a6a, motion-easing-and-duration-0e99ac, motion-easing-and-duration-3dca3a
  it('exits the screen with emphasized accelerate over 200ms, faster than enter', () => {
    const exit = timing('exit');
    expect(exit.duration).toBe(200);
    expect(exit.easing).toBe(root('--md-sys-motion-easing-emphasized-accelerate'));
    expect(exit.duration).toBeLessThan(timing('enter').duration);
  });

  // spec: motion-easing-and-duration-198f32
  it('exits temporarily with plain emphasized easing', () => {
    expect(root('--md-transition-exit-temporary-easing')).toBe(root('--md-sys-motion-easing-emphasized'));
  });
});

describe('enter and exit patterns', () => {
  let el: HTMLElement;
  beforeEach(() => {
    el = document.createElement('div');
    document.body.append(el);
  });
  afterEach(() => el.remove());

  // spec: motion-transitions-e0c27b, motion-easing-and-duration-e389c9
  it('slides a sheet in and out without fading, decelerating in and accelerating out', () => {
    el.className = 'md-transition-enter md-transition-slide';
    let style = getComputedStyle(el);
    expect(style.animationName).toBe('md-transition-slide-in');
    expect(style.animationTimingFunction).toBe(root('--md-sys-motion-easing-emphasized-decelerate'));
    el.className = 'md-transition-exit md-transition-slide';
    style = getComputedStyle(el);
    expect(style.animationName).toBe('md-transition-slide-out');
    expect(style.animationTimingFunction).toBe(root('--md-sys-motion-easing-emphasized-accelerate'));
  });

  // spec: motion-transitions-9fad1a
  it('uses a short duration for the fade of an entering dialog', () => {
    expect(parseFloat(root('--md-transition-enter-fade-duration'))).toBeLessThanOrEqual(100);
    expect(parseFloat(root('--md-transition-enter-fade-duration'))).toBeLessThan(parseFloat(root('--md-transition-enter-duration')));
  });
});
