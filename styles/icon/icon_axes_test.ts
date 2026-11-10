/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../adopt-styles.js';

import iconStyles from './md-icon.cssresult.js';
import './md-gb-icon.js';

adoptStyles(document, [iconStyles]);

function axis(element: Element, name: string) {
  const settings = getComputedStyle(element).fontVariationSettings;
  const match = settings.match(new RegExp(`"${name}" (-?[0-9.]+)`));
  return match ? Number(match[1]) : undefined;
}

describe('.md-icon sizes and axes', () => {
  const env = new Environment();

  function render(style = '') {
    return env.render(html`<span class="md-icon" style="${style}">star</span>`).querySelector('.md-icon')!;
  }

  // spec: icons-2b11f3
  it('is displayed as 24dp x 24dp by default', () => {
    const box = render().getBoundingClientRect();
    expect(box.width).toBe(24);
    expect(box.height).toBe(24);
  });

  // spec: icons-54390e, icons-582b4b, icons-3bdd16, icons-f44450, icons-1cb477, icons-45ac4d
  it('supports 20, 24, 40 and 48dp with the optical size following the size', () => {
    for (const size of [20, 24, 40, 48]) {
      const icon = render(`--md-icon-size: ${size}px`);
      const box = icon.getBoundingClientRect();
      expect(box.width).withContext(`${size} width`).toBe(size);
      expect(box.height).withContext(`${size} height`).toBe(size);
      expect(axis(icon, 'opsz')).withContext(`${size} opsz`).toBe(size);
    }
  });

  // spec: icons-73e4bf, icons-eec787, icons-5ea174
  it('has the regular weight (400) by default and accepts 100 (thin) to 700 (bold)', () => {
    expect(axis(render(), 'wght')).toBe(400);
    for (const weight of [100, 200, 300, 500, 600, 700]) {
      expect(axis(render(`--md-icon-wght: ${weight}`), 'wght')).toBe(weight);
    }
  });

  // spec: icons-b01b68, icons-f28a02
  it('accepts a fill from 0 (outlined) to 1 (completely filled)', () => {
    for (const fill of [0, 0.5, 1]) {
      expect(axis(render(`--md-icon-fill: ${fill}`), 'FILL')).toBe(fill);
    }
  });

  // spec: icons-b0414a, icons-b67c77, icons-02d410, icons-e7f3c1
  it('has grade 0 (no thickness change), negative for lighter and positive for heavier strokes', () => {
    expect(axis(render('--md-icon-grad: 0'), 'GRAD')).toBe(0);
    expect(axis(render('--md-icon-grad: -25'), 'GRAD')).toBe(-25);
    expect(axis(render('--md-icon-grad: 200'), 'GRAD')).toBe(200);
  });

  // spec: icons-9364e2
  it('uses Material Symbols and switches to the rounded or sharp style by font', () => {
    expect(getComputedStyle(render()).fontFamily).toContain('Material Symbols');
    expect(getComputedStyle(render('--md-icon-font: "Material Symbols Sharp"')).fontFamily).toContain('Sharp');
    expect(getComputedStyle(render('--md-icon-font: "Material Symbols Rounded"')).fontFamily).toContain('Rounded');
  });
});
