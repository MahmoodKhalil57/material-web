/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../../styles/icon/md-gb-icon.js';
import './md-gb-nav-rail.js';
import './md-gb-nav-rail-item.js';

import {sendKeys} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {until} from '../shared/central/subjects.js';
import {NavRailElement} from './nav-rail-element.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-nav-rail hide when collapsed', () => {
  const env = new Environment();

  async function render() {
    const root = env.render(
      html`<div style="display:flex;width:600px;height:400px">
        <md-gb-nav-rail hide-when-collapsed>
          <md-gb-nav-rail-item selected>
            <md-gb-icon slot="icon">inbox</md-gb-icon>Inbox
          </md-gb-nav-rail-item>
          <md-gb-nav-rail-item>
            <md-gb-icon slot="icon">send</md-gb-icon>Sent
          </md-gb-nav-rail-item>
        </md-gb-nav-rail>
        <main style="flex:1" class="body">Body</main>
      </div>`,
    );
    await env.waitForStability();
    const rail = root.querySelector('md-gb-nav-rail') as NavRailElement;
    await rail.updateComplete;
    return {
      rail,
      body: root.querySelector('.body') as HTMLElement,
      frame: root.firstElementChild as HTMLElement,
    };
  }

  // spec: navigation-rail-9d8ecf, navigation-rail-5580bd
  it('does not show the collapsed rail, and the body fills in', async () => {
    const {rail, body, frame} = await render();
    expect(getComputedStyle(rail).display).toBe('none');
    expect(rail.getBoundingClientRect().width).toBe(0);
    expect(body.getBoundingClientRect().width).toBe(
      frame.getBoundingClientRect().width,
    );
  });

  // spec: navigation-rail-8afb99, navigation-rail-5580bd
  it('appears over the content as a modal rail when the menu button expands it', async () => {
    const {rail, body, frame} = await render();
    rail.expand();
    await rail.updateComplete;
    await env.waitForStability();
    expect(getComputedStyle(rail).display).not.toBe('none');
    const part = rail.shadowRoot!.querySelector('[part~="nav-rail"]')!;
    expect(part.classList.contains('nav-rail-modal')).toBeTrue();
    expect(part.getBoundingClientRect().width).toBeGreaterThan(200);
    // The body is not pushed aside.
    expect(body.getBoundingClientRect().width).toBe(
      frame.getBoundingClientRect().width,
    );
    expect(rail.shadowRoot!.querySelector('[part~="scrim"]')).not.toBeNull();
  });

  // spec: navigation-rail-c63d97, navigation-rail-9d8ecf
  it('hides again when collapsed with Escape, keeping the menu button usable', async () => {
    const {rail} = await render();
    rail.toggle();
    await rail.updateComplete;
    expect(await until(() => rail.matches(':focus-within'))).toBeTrue();
    await sendKeys({press: 'Escape'});
    expect(await until(() => !rail.expanded)).toBeTrue();
    await env.waitForStability();
    expect(getComputedStyle(rail).display).toBe('none');
    rail.toggle();
    expect(rail.expanded).toBeTrue();
  });
});
