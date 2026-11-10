/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {hitTargetSize, KNOWN_GAPS, renderSubject, SPEC_EXCEPTIONS, SUBJECTS} from './subjects.js';

// Suite 3 of the central CSS/token suites: touch targets and density.
// "Accessible targets should retain a minimum of 48x48dp, even if the visual
// element ... is smaller" (foundations/layout/grids-spacing.md, Targets) at
// every component density (0 to -3). The target is measured by hit testing:
// the points 23px from the center of the part, in each direction, must still
// hit the part (its own box or a pseudo-element target that extends it).
// `touch-target_gap.ts` has the parts that fall short; SPEC_EXCEPTIONS the
// ones the spec lets fall short.

const DENSITIES = [0, -1, -2, -3];

describe('touch targets (central)', () => {
  for (const subject of SUBJECTS) {
    for (const density of subject.density ? DENSITIES : [0]) {
      const key = `${subject.id}@${density}`;
      if (KNOWN_GAPS.touchTarget.includes(key) || key in SPEC_EXCEPTIONS.touchTarget) continue;
      // spec: layout-grids-spacing-d76a5a, layout-grids-spacing-e48756, layout-grids-spacing-8578d9, layout-grids-spacing-f61b0d, layout-grids-spacing-142dba
      it(`${subject.id} keeps a 48x48 target at density ${density}`, async () => {
        const {el, cleanup} = await renderSubject(
          subject,
          density ? {density: String(density)} : {},
        );
        const size = hitTargetSize(el);
        expect(size.width).toBeGreaterThanOrEqual(subject.targetMin?.width ?? 48);
        expect(size.height).toBeGreaterThanOrEqual(subject.targetMin?.height ?? 48);
        cleanup();
      });
    }
  }
});
