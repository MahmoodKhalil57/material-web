/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia} from '@web/test-runner-commands';

import {KNOWN_GAPS, renderSubject, SUBJECTS} from './subjects.js';
import {spatialTransitions} from './style-helpers.js';

// Gap checks for suite 6 (reduced motion): parts that still transition a
// spatial property (label float, indicator growth, shape morph, clip-path
// reveal) with `prefers-reduced-motion: reduce`. Run with `--gaps`.

describe('reduced motion (central gaps)', () => {
  afterEach(() => emulateMedia({reducedMotion: 'no-preference'}));

  for (const id of KNOWN_GAPS.reducedMotion) {
    // spec: motion-transitions-1ec6c0, motion-transitions-cab46b, motion-transitions-3bb2d7
    it(`${id} has no spatial transitions with reduced motion on`, async () => {
      await emulateMedia({reducedMotion: 'reduce'});
      const {el, cleanup} = await renderSubject(SUBJECTS.find((s) => s.id === id)!);
      expect(spatialTransitions(el)).toEqual([]);
      cleanup();
    });
  }
});
