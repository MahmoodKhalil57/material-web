/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import './md-gb-app-scaffold.js';
import './md-gb-pane-scaffold.js';
import {type AppScaffoldElement} from './app-scaffold-element.js';
import {type PaneScaffoldElement} from './pane-scaffold-element.js';

adoptStyles(document, [m3Styles]);

// layout-overview.md, Containment: "Explicit grouping uses distinct colors or
// outlines to visually delineate content." color/roles.md: "The most common
// combination of surface roles uses surface for a background area and
// surface container for a navigation area."
describe('explicit pane grouping', () => {
  const env = new Environment();

  /** The color a role resolves to at `el`, as the browser computes it. */
  function role(el: Element, name: string) {
    const probe = document.createElement('div');
    probe.style.backgroundColor = `var(--md-sys-color-${name})`;
    el.append(probe);
    const color = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return color;
  }

  async function setup(navigationColor: string) {
    const root = env.render(html`
      <div class="outside"></div>
      <md-gb-app-scaffold navigation-color=${navigationColor} style="block-size: 400px">
        <md-gb-pane-scaffold grouping="explicit" layout="supporting-pane">
          <div class="body" style="block-size: 2000px">Body</div>
        </md-gb-pane-scaffold>
      </md-gb-app-scaffold>
    `);
    await env.waitForStability();
    const app = root.querySelector('md-gb-app-scaffold') as AppScaffoldElement;
    const panes = root.querySelector('md-gb-pane-scaffold') as PaneScaffoldElement;
    await app.updateComplete;
    await panes.updateComplete;
    return {
      app,
      panes,
      outside: root.querySelector('.outside')!,
      body: root.querySelector('.body')!,
      pane: panes.shadowRoot!.querySelector<HTMLElement>('.pane')!,
    };
  }

  it('puts the navigation area on surface container and the pane on surface', async () => {
    const {app, outside, body, pane} = await setup('surface-container');
    const surface = role(outside, 'surface');
    const container = role(outside, 'surface-container');
    const grid = app.shadowRoot!.querySelector('.app-scaffold')!;
    expect(getComputedStyle(grid).backgroundColor).toBe(container);
    expect(getComputedStyle(pane).backgroundColor).toBe(surface);
    // The pane's content sees the body's own roles again.
    expect(role(body, 'surface')).toBe(surface);
    expect(role(body, 'surface-container')).toBe(container);
  });

  it('steps the navigation area up one level, so its containers stand out', async () => {
    const {app, outside} = await setup('surface-container');
    const grid = app.shadowRoot!.querySelector('.app-scaffold')!;
    expect(role(grid, 'surface')).toBe(role(outside, 'surface-container'));
    expect(role(grid, 'surface-container')).toBe(role(outside, 'surface-container-high'));
  });

  it('gives the pane extra-large corners', async () => {
    const {pane} = await setup('surface-container');
    expect(getComputedStyle(pane).borderTopLeftRadius).toBe('28px');
  });

  it('scrolls inside the pane, not the content region', async () => {
    const {app, pane} = await setup('surface');
    const content = app.shadowRoot!.querySelector<HTMLElement>('.app-scaffold-content')!;
    expect(pane.scrollHeight).toBeGreaterThan(pane.clientHeight);
    expect(content.scrollHeight).toBe(content.clientHeight);
  });

  it('keeps absolutely positioned content inside the pane', async () => {
    const {app, body} = await setup('surface');
    const marker = document.createElement('div');
    marker.style.cssText = 'position: absolute; inset-block-start: 1800px; block-size: 10px';
    body.append(marker);
    const content = app.shadowRoot!.querySelector<HTMLElement>('.app-scaffold-content')!;
    expect(content.scrollHeight).toBe(content.clientHeight);
  });
});
