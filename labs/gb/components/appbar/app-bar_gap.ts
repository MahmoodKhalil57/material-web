/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Red tests: spec requirements the app bar does not meet yet. Run with
// `npm run gb:check -- --gaps appbar`.

// import 'jasmine'; (google3-only)

import './md-gb-app-bar.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {AppBarElement} from './app-bar-element.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-app-bar gaps', () => {
  const env = new Environment();

  async function height(size: string, scrolled: boolean) {
    const root = env.render(
      html`<md-gb-app-bar size=${size} ?scrolled=${scrolled}>Title</md-gb-app-bar>`,
    );
    await env.waitForStability();
    const appBar = root.querySelector('md-gb-app-bar') as AppBarElement;
    await appBar.updateComplete;
    appBar.shadowRoot!.getAnimations().forEach((a) => a.finish());
    return appBar.shadowRoot!.querySelector('.app-bar')!.getBoundingClientRect().height;
  }

  // Needs: app-bars-5d7418, app-bars-66c0e7, app-bars-971ae8, app-bars-302c28
  it('collapses a medium or large flexible app bar into a small one when scrolled', async () => {
    const small = await height('sm', false);
    expect(await height('md', true)).toBe(small);
    expect(await height('lg', true)).toBe(small);
  });
});
