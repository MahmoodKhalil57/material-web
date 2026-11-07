/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Red tests: spec requirements the toolbar does not meet yet.

// import 'jasmine'; (google3-only)

import '../iconbutton/md-gb-icon-button.js';
import './md-gb-toolbar.js';

import {html} from 'lit';
import {sendKeys} from '@web/test-runner-commands';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-toolbar gaps', () => {
  const env = new Environment();

  // The toolbar only sets the `focusgroup` attribute, which Chrome does not
  // implement by default, so arrow keys do not move focus.
  // spec: toolbars-1d1826, toolbars-cde7d0
  it('moves focus between controls with the arrow keys', async () => {
    const root = env.render(html`<md-gb-toolbar>
      <md-gb-icon-button aria-label="Bold">b</md-gb-icon-button>
      <md-gb-icon-button aria-label="Italic">i</md-gb-icon-button>
    </md-gb-toolbar>`);
    await env.waitForStability();
    const [first, second] = Array.from(
      root.querySelectorAll<HTMLElement>('md-gb-icon-button'),
    );
    first.focus();
    await sendKeys({press: 'ArrowRight'});
    expect(document.activeElement).toBe(second);
  });
});
