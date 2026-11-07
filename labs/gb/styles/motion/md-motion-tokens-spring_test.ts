/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
// spec-labels: motion-overview/how-it-works/spring-tokens/speed
import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

describe('spring motion tokens', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.append(el);
  });

  afterEach(() => {
    el.remove();
  });

  function prop(name: string) {
    return getComputedStyle(el).getPropertyValue(name).trim();
  }

  it('defines every spring as a linear() easing and a duration', () => {
    for (const speed of ['fast', 'default', 'slow']) {
      for (const kind of ['spatial', 'effects']) {
        const name = `--md-sys-motion-spring-${speed}-${kind}`;
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
          expect(prop(name)).withContext(name).toMatch(/^linear\(/);
          expect(parseFloat(prop(`${name}-duration`))).toBeGreaterThan(0);
        }
      }
    }
  });

  // Spec (styles/motion/transitions, "Follows accessibility settings"):
  // reduced motion uses fades instead of sliding, scaling or shape morphing.
  it('makes spatial springs instant and keeps effects springs in .md-motion-reduced', () => {
    const effects = prop('--md-sys-motion-spring-default-effects-duration');
    el.classList.add('md-motion-reduced');
    for (const speed of ['fast', 'default', 'slow']) {
      expect(prop(`--md-sys-motion-spring-${speed}-spatial-duration`)).toBe('0ms');
      expect(prop(`--md-sys-motion-spring-${speed}-spatial`)).toBe('linear');
    }
    expect(prop('--md-sys-motion-spring-default-effects-duration')).toBe(effects);
    expect(parseFloat(effects)).toBeGreaterThan(0);
  });

  it('applies reduced motion inside the standard motion scheme', () => {
    el.classList.add('md-motion-standard');
    expect(parseFloat(prop('--md-sys-motion-spring-fast-spatial-duration'))).toBeGreaterThan(0);
    const child = document.createElement('div');
    child.classList.add('md-motion-reduced');
    el.append(child);
    expect(
      getComputedStyle(child).getPropertyValue('--md-sys-motion-spring-fast-spatial-duration').trim(),
    ).toBe('0ms');
  });
});
