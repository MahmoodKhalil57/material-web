/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './aria-internals.js';

import {ariaViolations, describeAria, loadModel, SECTIONS, type Rule} from './aria-helpers.js';
import {ARIA_GAPS, ARIA_ROWS, isGap} from './aria-rows.js';
import {renderRow} from './axe-helpers.js';

// Gap checks for the WAI-ARIA 1.3 suite (`aria_test.ts`): rows with a real
// violation, one red test per violation naming the role, the attribute and the
// spec section. Run with `npm run check -- --gaps ...`.

describe('WAI-ARIA 1.3 (central gaps)', () => {
  // With no known gaps the suite would have no tests, which the runner
  // reports as a failed file ("Unknown error").
  if (Object.keys(ARIA_GAPS).length === 0) {
    it('has no known gaps', () => {
      expect(ARIA_GAPS).toEqual({});
    });
  }
  for (const [id, gaps] of Object.entries(ARIA_GAPS)) {
    for (const gap of gaps) {
      it(`${id}: role ${gap.role} has no ${gap.rule} violation on ${gap.attr || 'its name'} (${SECTIONS[gap.rule as Rule]}): ${gap.why}`, async () => {
        await loadModel();
        const row = ARIA_ROWS.find((r) => r.id === id)!;
        const {container, cleanup} = await renderRow(row);
        const violations = (await ariaViolations(container)).filter(
          (v) => isGap(v, gap),
        );
        cleanup();
        expect(violations.length).withContext(describeAria(violations)).toBe(0);
      }, 30000);
    }
  }
});
