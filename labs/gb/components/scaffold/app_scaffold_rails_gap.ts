/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// Red tests (gaps): not counted as tested. Spec layout/scaffold "Rails":
// rails fill the perimeter space around the panes: a navigation rail and a
// companion rail occupy the leading and trailing sides of a large window; on
// compact screens the top and bottom rail regions can hold a floating toolbar
// (and the FAB). md-gb-app-scaffold has navigation-rail, navigation-bar, fab,
// top-app-bar and snackbar slots only: no trailing companion rail region and
// no toolbar region.
// Units: layout-scaffold-66bb92, layout-scaffold-8504d2, layout-scaffold-170db1,
// layout-scaffold-236688, layout-overview-80b2f7, layout-overview-de1192,
// layout-scaffold-4b82c4, layout-scaffold-d3a7e1.

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import './md-gb-app-scaffold.js';

describe('<md-gb-app-scaffold> rail regions (gap)', () => {
  const env = new Environment();

  async function setup(width: number) {
    const root = env.render(
      html`<div style="width:${width}px;height:600px">
        <md-gb-app-scaffold>
          <nav slot="navigation-bar">Bar</nav>
          <nav slot="navigation-rail" class="rail" style="width:96px">Rail</nav>
          <aside slot="companion-rail" class="companion" style="width:96px">Companion</aside>
          <div slot="toolbar" class="toolbar" style="height:64px">Toolbar</div>
          <div class="content">Content</div>
        </md-gb-app-scaffold>
      </div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    return root;
  }

  it('puts a companion rail on the trailing side of a large window', async () => {
    const root = await setup(1300);
    const rail = root.querySelector('.rail')!.getBoundingClientRect();
    const companion = root.querySelector('.companion')!.getBoundingClientRect();
    const content = root.querySelector('.content')!.getBoundingClientRect();
    expect(rail.right).toBeLessThanOrEqual(content.left + 1);
    expect(companion.width).toBeGreaterThan(0);
    expect(companion.left).toBeGreaterThanOrEqual(content.right - 1);
  });

  it('floats a toolbar in the bottom rail region of a compact window', async () => {
    const root = await setup(400);
    const toolbar = root.querySelector('.toolbar')!.getBoundingClientRect();
    const content = root.querySelector('.content')!.getBoundingClientRect();
    expect(toolbar.height).toBeGreaterThan(0);
    expect(toolbar.bottom).toBeLessThanOrEqual(content.bottom + 1);
  });
});
