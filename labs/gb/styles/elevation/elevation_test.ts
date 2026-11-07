/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

function shadowOf(level: number) {
  const el = document.createElement('div');
  el.style.boxShadow = `var(--md-sys-elevation-shadow-${level})`;
  document.body.append(el);
  const value = getComputedStyle(el).boxShadow;
  el.remove();
  return value;
}

/** Y offset and blur of every layer of a computed box-shadow. */
function layers(shadow: string) {
  if (shadow === 'none') return [];
  return shadow.split(/,(?![^(]*\))/).map((layer) => {
    const lengths = layer.match(/-?[\d.]+px/g)!.map(parseFloat);
    return {y: lengths[1], blur: lengths[2]};
  });
}

describe('elevation levels', () => {
  // spec: elevation-b8f4f2, elevation-85ecf8, elevation-b8f6c5
  it('has six levels, 0 to +5, where level 0 has no shadow of its own', () => {
    expect(shadowOf(0)).toBe('none');
    for (let level = 1; level <= 5; level++) {
      expect(shadowOf(level)).withContext(`level ${level}`).not.toBe('none');
    }
  });

  // spec: elevation-2433cc, elevation-0b0e6b, elevation-e0fbcb, elevation-352177, elevation-8b03b7, elevation-f09f9d, elevation-d5df86, elevation-73b4cf, elevation-c00a3d, elevation-e0ca4c
  it('casts a larger, softer shadow for each level of height', () => {
    let previous = {y: 0, blur: 0};
    for (let level = 1; level <= 5; level++) {
      const ambient = layers(shadowOf(level)).reduce((a, b) => (b.blur > a.blur ? b : a));
      expect(ambient.blur).withContext(`level ${level} blur`).toBeGreaterThan(previous.blur);
      expect(ambient.y).withContext(`level ${level} offset`).toBeGreaterThanOrEqual(previous.y);
      previous = ambient;
    }
  });

  // spec: elevation-721f84, elevation-b2ea71
  it('separates surfaces by tone difference by default, not only by shadow', () => {
    const color = (role: string) => {
      const el = document.createElement('div');
      el.style.backgroundColor = `var(--md-sys-color-${role})`;
      document.body.append(el);
      const value = getComputedStyle(el).backgroundColor;
      el.remove();
      return value;
    };
    const roles = ['surface-container-lowest', 'surface-container-low', 'surface-container', 'surface-container-high', 'surface-container-highest'];
    expect(new Set(roles.map(color)).size).toBe(roles.length);
  });
});
