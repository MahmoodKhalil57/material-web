/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Gaps: spec requirements the button group does not meet yet. Red until the
// component is fixed; run with `npm run gb:check -- --gaps`.

// import 'jasmine'; (google3-only)
import '../button/md-gb-button.js';
import './md-gb-button-group.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type ButtonElement} from '../button/button-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-button-group> gaps', () => {
  const env = new Environment();

  // buttons.md Disabled: label text is on-surface at 38%. The group's rule for
  // a selected outlined button sets inverse-on-surface even when disabled.
  it('disabled selected outlined button keeps a 38% label', async () => {
    const root = env.render(html`
      <md-gb-button-group selection="single" disabled>
        <md-gb-button color="outlined" selected>One</md-gb-button>
        <md-gb-button color="outlined">Two</md-gb-button>
      </md-gb-button-group>`);
    await env.waitForStability();
    const b = root.querySelector<ButtonElement>('md-gb-button')!;
    const color = getComputedStyle(b.shadowRoot!.querySelector('[part="btn"]')!).color;
    expect(Number(color.match(/\/\s*([\d.]+)\)/)?.[1])).toBeCloseTo(0.38, 2);
  });
});
