/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Red tests: spec requirements the menu does not meet yet. Run with
// `npm run gb:check -- --gaps menu`.

// import 'jasmine'; (google3-only)

import './md-gb-menu-item.js';
import './md-gb-menu.js';

import {sendKeys} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-menu gaps', () => {
  const env = new Environment();

  // The trigger keeps its look and only gains a pressed state (menus.md,
  // Selecting). The menu marks the trigger as expanded, the hook for the
  // trigger components to draw it pressed.
  // Needs: menus-698263, menus-baa57f, menus-761694
  it('marks its trigger as pressed (expanded) while it is open, also when opened from the keyboard', async () => {
    const root = env.render(html`
      <button id="trigger" popovertarget="menu">Open</button>
      <md-gb-menu id="menu"><md-gb-menu-item>One</md-gb-menu-item></md-gb-menu>
    `);
    await env.waitForStability();
    const trigger = root.querySelector<HTMLElement>('#trigger')!;
    trigger.focus();
    await sendKeys({press: 'Enter'});
    await env.waitForStability();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });
});
