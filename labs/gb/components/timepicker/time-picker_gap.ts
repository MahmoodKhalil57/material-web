/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Red tests: the spec requires behavior labs/gb does not implement yet.

// import 'jasmine'; (google3-only)

import {setViewport} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import './md-gb-time-picker.js';

describe('time picker gaps', () => {
  const env = new Environment();

  // spec: time-pickers-79857b, time-pickers-eff744
  it('fits fully inside a 400px-high viewport', async () => {
    await setViewport({width: 900, height: 400});
    try {
      const root = env.render(html`<md-gb-time-picker
        value="14:30"
        hour-cycle="12"
        quick
      ></md-gb-time-picker>`);
      await env.waitForStability();
      const picker = root.querySelector('md-gb-time-picker')!;
      const rect = picker.shadowRoot!.querySelector('.time-picker')!.getBoundingClientRect();
      expect(rect.height).toBeLessThanOrEqual(window.innerHeight);
    } finally {
      await setViewport({width: 800, height: 600});
    }
  });
});
