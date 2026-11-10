/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// The split button's menu without CSS anchor positioning, forced in a browser
// that has it: below the trailing button, its end edge aligned with the
// button's, 4dp from it (split-button.scss, shared/anchored-overlay.ts).

import './md-gb-split-button.js';
import '../menu/md-gb-menu.js';
import '../menu/md-gb-menu-item.js';

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {forceAnchorPositioningSupport} from '../shared/anchored-overlay.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-split-button> menu without CSS anchor positioning', () => {
  const env = new Environment();

  beforeEach(() => forceAnchorPositioningSupport(false));
  afterEach(() => forceAnchorPositioningSupport(null));

  async function setup(style: string, dir = 'ltr') {
    const root = env.render(html`
      <div dir=${dir} style="position: fixed; ${style}">
        <md-gb-split-button>
          <button slot="leading">Save</button>
          <button slot="trailing" aria-label="More" popovertarget="m"></button>
          <md-gb-menu id="m">
            <md-gb-menu-item>One</md-gb-menu-item>
            <md-gb-menu-item>Two</md-gb-menu-item>
          </md-gb-menu>
        </md-gb-split-button>
      </div>
    `);
    await env.waitForStability();
    const menu = root.querySelector('md-gb-menu')!;
    const trailing = root.querySelector<HTMLElement>('[slot=trailing]')!;
    const opened = new Promise((resolve) =>
      menu.addEventListener('toggle', resolve, {once: true}),
    );
    trailing.click();
    await opened;
    await env.waitForStability();
    await Promise.all(menu.getAnimations().map((a) => a.finished));
    return {menu, trailing};
  }

  it('opens 4dp below the trailing button, end edges aligned', async () => {
    const {menu, trailing} = await setup('left: 300px; top: 100px');
    const a = trailing.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    expect(menu.style.position).toBe('fixed');
    expect(Math.round(m.top)).toBe(Math.round(a.bottom + 4));
    expect(Math.round(m.right)).toBe(Math.round(a.right));
  });

  it('aligns the start edges in right-to-left', async () => {
    const {menu, trailing} = await setup('left: 300px; top: 100px', 'rtl');
    const a = trailing.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    expect(Math.round(m.left)).toBe(Math.round(a.left));
  });

  it('opens above the button when there is no room below', async () => {
    const {menu, trailing} = await setup(
      `left: 300px; top: ${window.innerHeight - 50}px`,
    );
    const a = trailing.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    expect(Math.round(m.bottom)).toBe(Math.round(a.top - 4));
  });
});
