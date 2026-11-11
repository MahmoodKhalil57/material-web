/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {hitTargetSize, KNOWN_GAPS, renderSubject, SUBJECTS} from '../../testing/subjects.js';

// Gap checks for suite 3 (touch targets): parts whose hit target is smaller
// than 48x48 at some density. Run with `npm run gb:check -- --gaps ...`.

describe('touch targets (central gaps)', () => {
  // With no known gaps the suite would have no tests, which the runner
  // reports as a failed file ("Unknown error").
  if (KNOWN_GAPS.touchTarget.length === 0) {
    it("has no known gaps", () => {
    expect(KNOWN_GAPS.touchTarget).toEqual([]);
    });
  }
  for (const key of KNOWN_GAPS.touchTarget) {
    const [id, density] = key.split('@');
    const subject = SUBJECTS.find((s) => s.id === id)!;
    // spec: layout-grids-spacing-d76a5a, layout-grids-spacing-e48756, layout-grids-spacing-8578d9
    // (text fields: text-fields-8b894b; tabs: tabs-955059, tabs-c6715d)
    it(`${id} keeps a 48x48 target at density ${density}`, async () => {
      const {el, cleanup} = await renderSubject(subject, density === '0' ? {} : {density});
      const size = hitTargetSize(el);
      expect(size.width).toBeGreaterThanOrEqual(48);
      expect(size.height).toBeGreaterThanOrEqual(48);
      cleanup();
    });
  }
});
