/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import '../../components/iconbutton/md-gb-icon-button.js';
import {hitTargetSize} from '../../components/shared/central/subjects.js';
import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';
import './md-gb-icon.js';

adoptStyles(document, [m3Styles]);

// Icon buttons around symbols: a 24dp symbol (size sm) and a 20dp one (size xs)
// keep a 48x48dp hit target at every density. The hit size is measured as in
// shared/central/subjects.ts (hitTargetSize). The central touch-target suite
// covers the same parts; these cases pin the icon units.
describe('icon button targets around symbols', () => {
  const env = new Environment();
  const DENSITIES = ['0', '-1', '-2', '-3'];

  async function button(size: string, density: string) {
    // Padding keeps the 48dp targets inside the viewport for hit testing.
    const root = env.render(html`<div style="padding: 64px; position: relative">
      <md-gb-icon-button
        data-subject
        size=${size}
        density=${density}
        aria-label="Favorite"
      ><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button>
    </div>`);
    await env.waitForStability();
    const el = root.querySelector('md-gb-icon-button')!;
    const icon = el.querySelector('md-gb-icon')!;
    return {el, icon};
  }

  // spec: icons-9a51c6
  it('gives a 24dp symbol a 48dp target', async () => {
    const {el, icon} = await button('sm', '0');
    expect(getComputedStyle(icon).fontSize).toBe('24px');
    const size = hitTargetSize(el);
    expect(size.width).toBeGreaterThanOrEqual(48);
    expect(size.height).toBeGreaterThanOrEqual(48);
  });

  // spec: icons-5223a8
  it('gives a 20dp symbol a target of at least 40dp (48dp here)', async () => {
    const {el, icon} = await button('xs', '0');
    expect(getComputedStyle(icon).fontSize).toBe('20px');
    const size = hitTargetSize(el);
    expect(size.width).toBeGreaterThanOrEqual(40);
    expect(size.height).toBeGreaterThanOrEqual(40);
    expect(size.width).toBeGreaterThanOrEqual(48);
    expect(size.height).toBeGreaterThanOrEqual(48);
  });

  // spec: icons-cb80d0, layout-grids-spacing-616eac, layout-grids-spacing-7e70fa, layout-grids-spacing-2d453f
  it('condenses the visual container with density but keeps the 48dp target', async () => {
    for (const size of ['sm', 'xs']) {
      const heights: number[] = [];
      for (const density of DENSITIES) {
        const {el} = await button(size, density);
        const hit = hitTargetSize(el);
        expect(hit.width).withContext(`${size} width at ${density}`).toBeGreaterThanOrEqual(48);
        expect(hit.height).withContext(`${size} height at ${density}`).toBeGreaterThanOrEqual(48);
        heights.push(el.getBoundingClientRect().height);
      }
      // Condensed: the visible container gets smaller as density steps down.
      expect(heights[3]).withContext(`${size} density -3 vs 0`).toBeLessThan(heights[0]);
    }
  });
});
