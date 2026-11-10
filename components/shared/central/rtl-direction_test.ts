/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)


import {renderSubject, settle, SUBJECTS} from './subjects.js';

// Suite 5 of the central CSS/token suites: RTL
// (foundations/layout/bidirectionality-rtl.md). A layout that is changed from
// LTR to RTL mirrors: every box in the component lands where the mirror image
// of its LTR box is, inside the component's own box. Directional icons (back,
// forward, submenu arrows) mirror. `rtl_gap.ts` has the parts that don't.

describe('RTL text direction (central)', () => {
  for (const subject of SUBJECTS) {
    // spec: layout-bidirectionality-rtl-7c4554, layout-bidirectionality-rtl-763eb5
    it(`${subject.id} follows the inherited direction for text`, async () => {
      const {container, el, cleanup} = await renderSubject(subject);
      container.dir = 'rtl';
      await settle(container);
      expect(getComputedStyle(el).direction).toBe('rtl');
      cleanup();
    });
  }
});
