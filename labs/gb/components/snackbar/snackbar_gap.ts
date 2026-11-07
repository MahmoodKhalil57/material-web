/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Gaps: spec rules the snackbar does not meet yet. Red until fixed; run with
// `npm run gb:check -- --gaps`.

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import './md-gb-snackbar.js';
import {type SnackbarElement} from './snackbar-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-snackbar> gaps', () => {
  const env = new Environment();

  // spec: snackbar-fbf72d
  // The guideline says compact snackbars expand from 48dp to 64dp for two
  // lines; the token database (and its generated spec test) has a 68dp
  // two-line container, which the component follows.
  it('is 64dp tall with two lines of text on a compact layout', async () => {
    const root = env.render(
      html`<div style="width: 360px; height: 300px; position: relative">
        <md-gb-snackbar
          open
          quick
          label-text="A message long enough that it needs to wrap onto a second line on a compact layout"></md-gb-snackbar>
      </div>`,
    );
    await env.waitForStability();
    const snackbar = root.querySelector('md-gb-snackbar') as SnackbarElement;
    await snackbar.updateComplete;
    snackbar.shadowRoot!.getAnimations().forEach((a) => a.finish());
    const surface = snackbar.shadowRoot!.querySelector('.snackbar-surface')!;
    expect(surface.getBoundingClientRect().height).toBe(64);
  });
});
