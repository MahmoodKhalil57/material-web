/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';
import './md-gb-icon.js';

adoptStyles(document, [m3Styles]);

describe('.md-icon next to text', () => {
  const env = new Environment();

  // spec: icons-f11257
  it('shifts its baseline down 11.5% of the text size', async () => {
    // The symbol matches the 16px text beside it, so 11.5% of 16px is 1.84px.
    const root = env.render(html`<p style="font-size: 16px; margin: 0">
      Text <md-gb-icon style="--md-icon-size: 16px">star</md-gb-icon>
    </p>`);
    await env.waitForStability();
    const icon = root.querySelector('md-gb-icon')!;
    expect(parseFloat(getComputedStyle(icon).verticalAlign)).toBeCloseTo(-1.84, 2);
  });
});
