/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {deepElements, KNOWN_GAPS, renderSubject, SUBJECTS} from './subjects.js';
import {colorAlpha} from './style-helpers.js';

// Suite 4 (disabled), outlined parts: the disabled outline is painted at 12%
// of the outline color (md.comp.outlined-button.disabled.outline.opacity and
// md.comp.outlined-icon-button.disabled.outline.opacity).

describe('disabled outline (central)', () => {
  for (const id of ['button-outlined', 'icon-button-outlined']) {
    if (KNOWN_GAPS.disabledOutline.includes(id)) continue;
    // spec: buttons-271ce7, icon-buttons-522a79 (disabled outline opacity 12%)
    it(`${id}: paints its disabled outline at 12%`, async () => {
      const {el, cleanup} = await renderSubject(SUBJECTS.find((s) => s.id === id)!, {
        disabled: true,
      });
      const alphas = deepElements(el).map(
        (e) => Math.round(colorAlpha(getComputedStyle(e).borderTopColor) * 1000) / 1000,
      );
      expect(alphas).toContain(0.12);
      cleanup();
    });
  }
});
