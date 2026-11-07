/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// Red test (gap): not counted as tested. Spec layout/breakpoints "Expanded":
// in a split-pane layout the spacer is visually centered in the window by
// default, even with an expanded navigation rail: the navigation components
// shrink the leading pane, so the navigation and the first pane fill 50% of
// the window. Today the pane scaffold centers the spacer in the area beside
// the rail, so it sits right of the window center.
// Needs: md-gb-app-scaffold telling a nested md-gb-pane-scaffold how much
// leading space the rail takes (a CSS variable or property).
// Units: layout-breakpoints-e0012f, layout-breakpoints-68f992,
// layout-breakpoints-74b819, layout-breakpoints-b5ee27.

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import './md-gb-app-scaffold.js';
import './md-gb-pane-scaffold.js';
import {type PaneScaffoldElement} from './pane-scaffold-element.js';

describe('split-pane layout', () => {
  const env = new Environment();

  async function setup(width: number, railWidth: number) {
    const root = env.render(
      html`<div style="width:${width}px;height:400px">
        <md-gb-app-scaffold>
          <nav slot="navigation-bar">Bar</nav>
          <nav slot="navigation-rail" style="width:${railWidth}px">Rail</nav>
          <md-gb-pane-scaffold arrangement="split" medium-two-pane>
            <div slot="secondary">List</div>
            <div>Detail</div>
          </md-gb-pane-scaffold>
        </md-gb-app-scaffold>
      </div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    const scaffold = root.querySelector('md-gb-pane-scaffold') as PaneScaffoldElement;
    const pane = (name: string) =>
      scaffold.shadowRoot!.querySelector<HTMLElement>(`.pane-${name}`)!.getBoundingClientRect();
    return {root, scaffold, pane, frame: root.firstElementChild!.getBoundingClientRect()};
  }

    it('visually centers the spacer by shrinking the leading pane for the navigation', async () => {
    for (const railWidth of [96, 220]) {
      const {pane, frame} = await setup(1000, railWidth);
      const leading = pane('secondary');
      const trailing = pane('primary');
      const center = (leading.right + trailing.left) / 2;
      expect(center).withContext(`rail ${railWidth}`).toBeCloseTo(frame.left + frame.width / 2, 0);
      // The navigation and the first pane together fill half of the window.
      expect(leading.right - frame.left).withContext(`rail ${railWidth}`).toBeLessThanOrEqual(frame.width / 2);
      expect(leading.width).toBeGreaterThan(0);
      expect(trailing.width).toBeGreaterThan(0);
    }
  });
});

