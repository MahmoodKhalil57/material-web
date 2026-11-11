/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia} from '@web/test-runner-commands';

import {KNOWN_GAPS, renderSubject, SUBJECTS} from '../../testing/subjects.js';
import {spatialTransitions} from '../../testing/style-helpers.js';

// Suite 6 of the central CSS/token suites: reduced motion
// (styles/motion/transitions.md, "Follows accessibility settings"). With the
// reduced-motion setting on (emulated here), transitions "use subtle fades
// instead of intense sliding or scaling animations" and "disable decorative
// effects like parallax or shape morphing": no element may transition a
// spatial property (position, size, transform, corner shape). `all` counts,
// since it includes them. `reduced-motion_gap.ts` has the parts that still do.

describe('reduced motion (central)', () => {
  afterEach(() => emulateMedia({reducedMotion: 'no-preference'}));

  for (const subject of SUBJECTS) {
    if (KNOWN_GAPS.reducedMotion.includes(subject.id)) continue;
    // spec: motion-transitions-1ec6c0, motion-transitions-cab46b, motion-transitions-3bb2d7
    it(`${subject.id} has no spatial transitions with reduced motion on`, async () => {
      await emulateMedia({reducedMotion: 'reduce'});
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBeTrue();
      const {el, cleanup} = await renderSubject(subject);
      expect(spatialTransitions(el)).toEqual([]);
      cleanup();
    });
  }
});
