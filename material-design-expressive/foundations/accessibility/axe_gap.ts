/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {AXE_GAPS, AXE_ROWS, axeViolations, describeViolations, renderRow} from './axe-helpers.js';

// Gap checks for the axe-core suite (`axe_test.ts`): rows with a real
// violation, one red test per row naming the rule. Run with
// `npm run check -- --gaps ...`.

describe('axe-core accessibility (central gaps)', () => {
  // With no known gaps the suite would have no tests, which the runner
  // reports as a failed file ("Unknown error").
  if (Object.keys(AXE_GAPS).length === 0) {
    it('has no known gaps', () => {
      expect(AXE_GAPS).toEqual({});
    });
  }
  for (const [id, gap] of Object.entries(AXE_GAPS)) {
    it(`${id} has no ${gap.rule} violation (${gap.why})`, async () => {
      const row = AXE_ROWS.find((r) => r.id === id)!;
      const {container, cleanup} = await renderRow(row);
      const violations = (await axeViolations(container)).filter((v) => v.id === gap.rule);
      cleanup();
      expect(violations.length).withContext(describeViolations(violations)).toBe(0);
    });
  }
});
