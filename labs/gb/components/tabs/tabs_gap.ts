/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Red tests: spec requirements the tabs do not meet yet. Run with
// `npm run gb:check -- --gaps tabs`.

// import 'jasmine'; (google3-only)

import './md-gb-tab.js';
import './md-gb-tabs.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {styles as tabsStyles} from './tabs.cssresult.js';

adoptStyles(document, [m3Styles, tabsStyles]);

describe('md-gb-tabs gaps', () => {
  const env = new Environment();

  // Needs: tabs-bf79b7, tabs-7ce157, tabs-09e737
  it('offsets the first tab of scrollable tabs by 52dp from the leading edge', async () => {
    const root = env.render(html`<div style="width: 240px"
      ><md-gb-tabs aria-label="Trips">
        ${['Flights', 'Hotels', 'Car rental', 'Trains', 'Cruises'].map(
          (label) => html`<md-gb-tab><span slot="label">${label}</span></md-gb-tab>`,
        )}
      </md-gb-tabs></div
    >`);
    await env.waitForStability();
    const tabs = root.querySelector('md-gb-tabs')!;
    expect(tabs.scrollWidth).toBeGreaterThan(tabs.clientWidth);
    const first = tabs.querySelector('md-gb-tab')!.getBoundingClientRect();
    expect(first.left - tabs.getBoundingClientRect().left).toBeCloseTo(52, 0);
  });
});
