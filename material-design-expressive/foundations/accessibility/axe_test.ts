/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {AXE_GAPS, AXE_ROWS, axeViolations, describeViolations, renderRow} from './axe-helpers.js';

// Central suite: automated accessibility checks. axe-core (WCAG 2.0 A/AA, 2.1
// AA and 2.2 AA rules, none disabled) runs on every subject of the central
// table and on the overlays in their open state, with the m3 styles adopted so
// the contrast rules see the real colors. Rows with a real violation are in
// `AXE_GAPS` and run as red tests in `axe_gap.ts`. The roles and ARIA state
// that components set through ElementInternals are mirrored to attributes
// first (axe reads attributes only; `axe-internals.ts`).

describe('axe-core accessibility (central)', () => {
  it('reports a violation when there is one (the checks can fail)', async () => {
    const probe = document.createElement('div');
    probe.innerHTML =
      '<p style="color:#ccc;background:#fff">Low contrast</p><button></button>';
    document.body.append(probe);
    const violations = await axeViolations(probe);
    probe.remove();
    expect(violations.map((v) => v.id)).toContain('color-contrast');
    expect(violations.map((v) => v.id)).toContain('button-name');
  });

  for (const row of AXE_ROWS) {
    if (row.id in AXE_GAPS) continue;
    it(`${row.id} has no axe violations`, async () => {
      const {container, cleanup} = await renderRow(row);
      const violations = await axeViolations(container);
      cleanup();
      expect(violations.length).withContext(describeViolations(violations)).toBe(0);
    });
  }
});
