/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Gaps: spec rules the sheets do not meet yet. Red until the component is
// fixed; run with `npm run gb:check -- --gaps`.

// import 'jasmine'; (google3-only)
import './md-gb-side-sheet.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type SideSheetElement} from './side-sheet-element.js';

adoptStyles(document, [m3Styles]);

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

describe('md-gb-side-sheet gaps', () => {
  const env = new Environment();

  // spec: side-sheets-1a579d
  it('draws the standard side sheet divider with the outline variant role', async () => {
    const root = env.render(html`
      <div style="display: flex; block-size: 400px; inline-size: 800px">
        <main style="flex: 1">Main</main>
        <md-gb-side-sheet quick divider headline="Title"></md-gb-side-sheet>
      </div>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-side-sheet') as SideSheetElement;
    await sheet.show();
    const panel = sheet.shadowRoot!.querySelector('.sheet-panel')!;
    expect(getComputedStyle(panel).borderInlineStartColor).toBe(
      resolvedColor('--md-sys-color-outline-variant'),
    );
  });
});
