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

describe('.md-icon axes', () => {
  const env = new Environment();

  function render(style = '') {
    return env.render(html`<span class="md-icon" style="${style}">star</span>`).querySelector('.md-icon')!;
  }

  // spec: icons-372567, icons-89901b
  it('is an unfilled (outlined) symbol by default', () => {
    expect(axis(render(), 'FILL')).toBe(0);
  });

  // spec: icons-8fccab
  it('has grade 0 by default and accepts -25 for light icons on dark backgrounds', () => {
    expect(axis(render(), 'GRAD')).toBe(0);
    expect(axis(render('--md-icon-grad: -25'), 'GRAD')).toBe(-25);
  });
});
