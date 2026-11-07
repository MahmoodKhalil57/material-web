/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {KNOWN_GAPS, renderSubject, SUBJECTS} from './subjects.js';
import {contentAlphas} from './style-helpers.js';

// Gap checks for suite 4 (disabled): text that is not at the spec's 38%.
// (The outlined buttons' 12% outline is checked in `disabled-outline_test.ts`.)
// Run with `npm run gb:check -- --gaps ...`.

describe('disabled (central gaps)', () => {
  for (const id of KNOWN_GAPS.disabledContent) {
    // spec: interaction-states-fb47ea (text fields: text-fields-70a237,
    // text-fields-7c17c3; cards: cards-996afd, cards-115d45, cards-63b06f)
    it(`${id}: shows its text content at 38% opacity when disabled`, async () => {
      const {el, cleanup} = await renderSubject(SUBJECTS.find((s) => s.id === id)!, {
        disabled: true,
      });
      const alphas = contentAlphas(el);
      expect(alphas.length).toBeGreaterThan(0);
      for (const alpha of alphas) expect(alpha).toBeCloseTo(0.38, 2);
      cleanup();
    });
  }
});
