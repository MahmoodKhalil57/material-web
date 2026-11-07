/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia} from '@web/test-runner-commands';

import {
  offColorRoles,
} from './scale-helpers.js';
import {renderSubject, SUBJECTS} from './subjects.js';

// Suite 7 of the central CSS/token suites: color roles, shape, type scale and
// elevation, per part. The generated token tests check each token against its
// value; these check what actually renders: every text style, corner, shadow
// and color of every part is on the M3 scale, at rest and disabled (and in
// both color schemes for color roles). This file: color roles in the light color scheme.

const STATES: Array<[string, Record<string, boolean>]> = [
  ['at rest', {}],
  ['disabled', {disabled: true}],
];

function suite(
  title: string,
  units: string,
  check: (root: Element) => string[],
  scheme?: 'light' | 'dark',
) {
  describe(title, () => {
    if (scheme) {
      beforeEach(() => emulateMedia({colorScheme: scheme}));
      afterEach(() => emulateMedia({colorScheme: 'no-preference'}));
    }
    for (const subject of SUBJECTS) {
      for (const [state, attrs] of STATES) {
        if (state === 'disabled' && !subject.disabled) continue;
        it(`${subject.id} ${state}`, async () => {
          const {el, cleanup} = await renderSubject(subject, attrs);
          expect(check(el)).withContext(units).toEqual([]);
          cleanup();
        });
      }
    }
  });
}

// spec: color-roles-8239c8, color-roles-e1801e
suite('color roles, light (central)', 'color roles', (el) => offColorRoles(el), 'light');
