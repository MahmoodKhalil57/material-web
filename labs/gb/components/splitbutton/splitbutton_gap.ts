/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Gaps: spec requirements the split button does not meet yet. Red until the
// component is fixed; run with `npm run gb:check -- --gaps`.

// import 'jasmine'; (google3-only)
import './md-gb-split-button.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type SplitButtonElement} from './split-button-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-split-button> gaps', () => {
  const env = new Environment();

  // split-button.md "Sizes": the sizes match the sizes offered on buttons
  // (XS 32, S 40, M 56, L 96, XL 136dp). The slotted leading button is a
  // content-box button with the slot's border, so it is taller than its size.
  it('leading and trailing buttons are both exactly the size height', async () => {
    const expected = {xs: 32, sm: 40, md: 56, lg: 96, xl: 136};
    for (const [size, height] of Object.entries(expected)) {
      const root = env.render(html`
        <md-gb-split-button size=${size}>
          <button slot="leading">Save</button>
          <button slot="trailing" aria-label="More"></button>
        </md-gb-split-button>`);
      await env.waitForStability();
      const el = root.querySelector<SplitButtonElement>('md-gb-split-button')!;
      const leading = el.querySelector<HTMLElement>('[slot=leading]')!;
      const trailing = el.querySelector<HTMLElement>('[slot=trailing]')!;
      expect(leading.getBoundingClientRect().height)
        .withContext(`${size} leading`)
        .toBe(height);
      expect(trailing.getBoundingClientRect().height)
        .withContext(`${size} trailing`)
        .toBe(height);
    }
  });
});
