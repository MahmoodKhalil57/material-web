/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {Environment} from '../../testing/environment.js';
import '../../components/button/md-gb-button.js';
import '../../components/buttongroup/md-gb-button-group.js';
import type {ButtonGroupElement} from '../../components/buttongroup/button-group-element.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);

describe('density', () => {
  const env = new Environment();

  // spec: layout-grids-spacing-29fd31, layout-grids-spacing-a07958, layout-grids-spacing-3e4e0c, spacing-a9d250, spacing-c64da4, layout-grids-spacing-31505e
  it('moves to negative steps that remove 4dp of height without scaling the text', async () => {
    const root = env.render(html`
      <md-gb-button-group aria-label="Group" variant="connected">
        <md-gb-button size="md">One</md-gb-button>
        <md-gb-button size="md">Two</md-gb-button>
      </md-gb-button-group>`);
    await env.waitForStability();
    const group = root.querySelector('md-gb-button-group') as ButtonGroupElement;
    const button = root.querySelector('md-gb-button')!.shadowRoot!.querySelector('[part="btn"]') as HTMLElement;
    const measure = async (density: number) => {
      group.density = density;
      await env.waitForStability();
      return {height: button.getBoundingClientRect().height, font: getComputedStyle(button).fontSize};
    };
    const base = await measure(0);
    for (const density of [-1, -2, -3]) {
      const dense = await measure(density);
      expect(dense.height).withContext(`density ${density}`).toBe(base.height + 4 * density);
      expect(dense.font).withContext(`density ${density}`).toBe(base.font);
    }
  });
});
