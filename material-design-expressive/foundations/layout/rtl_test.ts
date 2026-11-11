/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../components/menu/md-gb-menu.js';
import '../../components/menu/md-gb-menu-item.js';

import {unmirrored, horizontalScale} from './rtl-helpers.js';
import {deepElements, KNOWN_GAPS, settle, SUBJECTS} from '../../testing/subjects.js';

// Suite 5 of the central CSS/token suites: RTL
// (foundations/layout/bidirectionality-rtl.md). A layout that is changed from
// LTR to RTL mirrors: every box in the component lands where the mirror image
// of its LTR box is, inside the component's own box. Directional icons (back,
// forward, submenu arrows) mirror. `rtl_gap.ts` has the parts that don't.

describe('RTL (central)', () => {
  for (const subject of SUBJECTS) {
    if (KNOWN_GAPS.rtlMirror.includes(subject.id)) continue;
    // spec: layout-bidirectionality-rtl-b465b1, layout-bidirectionality-rtl-4d6f2c, layout-bidirectionality-rtl-be21f1
    it(`${subject.id} mirrors its layout in RTL`, async () => {
      expect(await unmirrored(subject.id)).toEqual([]);
    });
  }
});

describe('RTL directional icons (central)', () => {
  // spec: layout-bidirectionality-rtl-b0a174, layout-bidirectionality-rtl-3150b5
  it('mirrors the submenu arrow of a menu item', async () => {
    const container = document.createElement('div');
    container.dir = 'rtl';
    container.innerHTML = `<md-gb-menu aria-label="m"><md-gb-menu-item data-subject>Share<md-gb-menu slot="submenu"><md-gb-menu-item>Email</md-gb-menu-item></md-gb-menu></md-gb-menu-item></md-gb-menu>`;
    document.body.append(container);
    await settle(container);
    const item = container.querySelector('[data-subject]')!;
    const arrow = deepElements(item).find((e) => e.classList.contains('menu-item-submenu-icon'));
    expect(arrow).toBeDefined();
    expect(horizontalScale(arrow!)).toBe(-1);
    container.dir = 'ltr';
    expect(horizontalScale(arrow!)).toBe(1);
    container.remove();
  });
});
