/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../adopt-styles.js';

import iconStyles from './md-icon.cssresult.js';
import './md-gb-icon.js';

adoptStyles(document, [iconStyles]);

/** The value of one axis in a computed `font-variation-settings`. */
function axis(element: Element, name: string) {
  const settings = getComputedStyle(element).fontVariationSettings;
  const match = settings.match(new RegExp(`"${name}" (-?[\\d.]+)`));
  return match ? Number(match[1]) : undefined;
}

describe('.md-icon', () => {
  const env = new Environment();

  function render(style = '') {
    const root = env.render(
      html`<span class="md-icon" style="${style}">star</span>`,
    );
    return root.querySelector('.md-icon')!;
  }

  it('sets the four Material Symbols axes', () => {
    const icon = render();
    expect(axis(icon, 'opsz')).toBe(24);
    expect(axis(icon, 'wght')).toBe(400);
    expect(axis(icon, 'FILL')).toBe(0);
    expect(axis(icon, 'GRAD')).toBeDefined();
  });

  // styles/icons.md: optical sizes range from 20dp to 48dp and follow the
  // icon size.
  for (const [size, opsz] of [
    [16, 20],
    [20, 20],
    [32, 32],
    [40, 40],
    [48, 48],
    [64, 48],
  ]) {
    it(`uses optical size ${opsz} for a ${size}px icon`, () => {
      const icon = render(`--md-icon-size: ${size}px`);
      expect(axis(icon, 'opsz')).toBe(opsz);
    });
  }

  it('keeps an explicit optical size', () => {
    const icon = render('--md-icon-size: 40px; --md-icon-opsz: 24');
    expect(axis(icon, 'opsz')).toBe(24);
  });

  it('uses the filled symbol with --md-icon-fill: 1', () => {
    const icon = render('--md-icon-fill: 1; transition: none');
    expect(axis(icon, 'FILL')).toBe(1);
  });

  it('sets weight and grade', () => {
    const icon = render('--md-icon-wght: 700; --md-icon-grad: 200');
    expect(axis(icon, 'wght')).toBe(700);
    expect(axis(icon, 'GRAD')).toBe(200);
  });

  it('animates the fill', () => {
    const icon = render();
    expect(getComputedStyle(icon).transitionProperty).toContain(
      '--md-icon-fill',
    );
  });

  it('applies to md-gb-icon', () => {
    const root = env.render(
      html`<md-gb-icon style="--md-icon-size: 40px">star</md-gb-icon>`,
    );
    const icon = root.querySelector('md-gb-icon')!;
    expect(icon.classList).toContain('md-icon');
    expect(axis(icon, 'opsz')).toBe(40);
  });
});
