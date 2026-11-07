/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Red tests: spec requirements the toolbar does not meet yet. Run with
// `npm run gb:check -- --gaps toolbar`.

// import 'jasmine'; (google3-only)

import '../iconbutton/md-gb-icon-button.js';
import './md-gb-toolbar.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-toolbar gaps', () => {
  const env = new Environment();

  // Needs: toolbars-2ba1d1, toolbars-f576ad, toolbars-830ef9
  it('moves the trailing actions that do not fit into an overflow slot', async () => {
    const actions = Array.from(
      {length: 12},
      (_, i) =>
        html`<md-gb-icon-button slot="trailing" aria-label=${'Action ' + i}
          >${i}</md-gb-icon-button
        >`,
    );
    const root = env.render(html`<div style="width: 240px"
      ><md-gb-toolbar
        >${actions}<md-gb-icon-button slot="overflow" aria-label="More"
          >m</md-gb-icon-button
        ></md-gb-toolbar
      ></div
    >`);
    await env.waitForStability();
    const hidden = Array.from(
      root.querySelectorAll<HTMLElement>('[slot=trailing]'),
    ).filter((a) => a.hidden);
    expect(hidden.length).toBeGreaterThan(0);
    expect(
      root.querySelector<HTMLElement>('[slot=overflow]')!.getBoundingClientRect().width,
    ).toBeGreaterThan(0);
  });
});
