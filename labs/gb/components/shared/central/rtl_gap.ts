/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {unmirrored} from './rtl-helpers.js';
import {KNOWN_GAPS} from './subjects.js';

// Gap checks for suite 5 (RTL): parts whose RTL layout is not the mirror of
// the LTR layout. Run with `npm run gb:check -- --gaps ...`.

describe('RTL (central gaps)', () => {
  for (const id of KNOWN_GAPS.rtlMirror) {
    // spec: layout-bidirectionality-rtl-b465b1, layout-bidirectionality-rtl-4d6f2c, layout-bidirectionality-rtl-be21f1
    it(`${id} mirrors its layout in RTL`, async () => {
      expect(await unmirrored(id)).toEqual([]);
    });
  }
});
