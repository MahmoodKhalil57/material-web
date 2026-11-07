/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia} from '@web/test-runner-commands';

import {
  offColorRoles,
  offElevationScale,
  offShapeScale,
  offTypeScale,
} from './scale-helpers.js';
import {renderSubject, SUBJECTS} from './subjects.js';

// Suite 7 of the central CSS/token suites: color roles, shape, type scale and
// elevation, per part. The generated token tests check each token against its
// value; these check what actually renders: every text style, corner, shadow
// and color of every part is on the M3 scale, at rest and disabled (and in
// both color schemes for color roles).

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

// spec: shape-9f7e7b, shape-1a341f
suite('shape scale (central)', 'shape: corner radius scale', (el) => offShapeScale(el));

// spec: typography-c8d861
suite('type scale (central)', 'typography: type scale', (el) => offTypeScale(el));

// spec: elevation-a20c45
suite('elevation scale (central)', 'elevation: levels', (el) => offElevationScale(el));

// spec: color-roles-8239c8, color-roles-e1801e
suite('color roles, light (central)', 'color roles', (el) => offColorRoles(el), 'light');
suite('color roles, dark (central)', 'color roles', (el) => offColorRoles(el), 'dark');

describe('scale checks (negative controls)', () => {
  it('flags an off-scale type style, corner, shadow and color', () => {
    const el = document.createElement('div');
    el.textContent = 'Text';
    el.style.cssText =
      'font: 13px/17px sans-serif; border-radius: 7px; width: 100px; height: 100px;' +
      'box-shadow: 0 3px 3px red; background: #123456';
    document.body.append(el);
    expect(offTypeScale(el).length).toBe(1);
    expect(offShapeScale(el).length).toBeGreaterThan(0);
    expect(offElevationScale(el).length).toBe(1);
    expect(offColorRoles(el).length).toBeGreaterThan(0);
    el.remove();
  });
});
