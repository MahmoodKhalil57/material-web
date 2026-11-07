/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Gaps: spec rules the navigation rail does not meet yet. Red until the
// component is fixed; run with `npm run gb:check -- --gaps`.

// import 'jasmine'; (google3-only)
import './md-gb-nav-rail.js';
import './md-gb-nav-rail-item.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {NavRailElement} from './nav-rail-element.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-nav-rail gaps', () => {
  const env = new Environment();

  // spec: navigation-rail-448efb
  it('keeps the full label visible by growing the item vertically', async () => {
    const root = env.render(html`
      <md-gb-nav-rail>
        <md-gb-nav-rail-item selected>Inbox</md-gb-nav-rail-item>
        <md-gb-nav-rail-item>Notifications and updates</md-gb-nav-rail-item>
      </md-gb-nav-rail>
    `);
    await env.waitForStability();
    const rail = root.querySelector('md-gb-nav-rail') as NavRailElement;
    const [short, long] = Array.from(
      rail.querySelectorAll('md-gb-nav-rail-item'),
    );
    const label = long.shadowRoot!.querySelector<HTMLElement>(
      '.nav-rail-item-label',
    )!;
    // The whole label is shown (it wraps) and the item grows to hold it.
    expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
    expect(long.getBoundingClientRect().height).toBeGreaterThan(
      short.getBoundingClientRect().height,
    );
  });
});
