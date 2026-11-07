/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Gaps: spec requirements the button does not meet yet. Red until the
// component is fixed; run with `npm run gb:check -- --gaps`.

// import 'jasmine'; (google3-only)
import './md-gb-button.js';

import {sendMouse} from '@web/test-runner-commands';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {center} from '../shared/central/subjects.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-button> gaps', () => {
  afterEach(() => sendMouse({type: 'move', position: [0, 0]}));

  // md.comp.button.{filled,tonal}.hovered.container.elevation = level1 and
  // md.comp.button.elevated.hovered.container.elevation = level2
  // (buttons.md Specs > States, Hovered).
  for (const [color, level] of [
    ['filled', 1],
    ['tonal', 1],
    ['elevated', 2],
  ] as const) {
    it(`${color}: raises the container to elevation ${level} when hovered`, async () => {
      const container = document.createElement('div');
      container.style.padding = '64px';
      container.innerHTML = `<md-gb-button color="${color}">Label</md-gb-button>`;
      document.body.append(container);
      const el = container.firstElementChild as HTMLElement & {updateComplete: Promise<unknown>};
      await el.updateComplete;
      const btn = el.shadowRoot!.querySelector<HTMLElement>('[part="btn"]')!;
      const probe = document.createElement('span');
      probe.style.boxShadow = `var(--md-sys-elevation-shadow-${level})`;
      container.append(probe);
      const expected = getComputedStyle(probe).boxShadow;
      const c = center(btn);
      await sendMouse({type: 'move', position: [c.x, c.y]});
      expect(getComputedStyle(btn).boxShadow).toBe(expected);
      container.remove();
    });
  }
});
