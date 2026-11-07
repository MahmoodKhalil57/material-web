/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendMouse} from '@web/test-runner-commands';

import {center, prop, renderSubject, ripplesOf, SUBJECTS, until} from './subjects.js';

// Suite 1 of the central CSS/token suites, pressed layer: 10% of the content
// color while the pointer is held down (see `state-layers_test.ts`).

const COMPONENTS = ["button","fab"];
const interactive = SUBJECTS.filter((s) => s.disabled && !s.noRipple && COMPONENTS.includes(s.component));

/** Finishes open/close motion (a menu grows in) so the cursor lands on the rest position. */
function restMotion() {
  for (const a of document.getAnimations()) {
    try {
      a.finish();
    } catch {
      // An infinite animation cannot finish.
    }
  }
}

/** Moves the cursor onto a part and finishes the hover fade (the layer's end value is checked). */
async function hover(el: Element) {
  restMotion();
  const c = center(el);
  await sendMouse({type: 'move', position: [c.x, c.y]});
  restMotion();
}

async function leave() {
  await sendMouse({type: 'up'}).catch(() => {});
  await sendMouse({type: 'move', position: [0, 0]});
}

describe('state layers (central, pressed)', () => {
  afterEach(leave);

  for (const subject of interactive) {
    describe(subject.id, () => {
      // spec: interaction-states-ef6972, interaction-states-ba2793
      it('shows a 10% pressed (ripple) layer while pressed', async () => {
        const {el, cleanup} = await renderSubject(subject);
        const ripples = ripplesOf(el);
        await hover(el);
        await sendMouse({type: 'down'});
        restMotion();
        await until(() => ripples.some((r) => prop(r, '--ripple-press-opacity') === '10%'));
        expect(ripples.some((r) => prop(r, '--ripple-press-opacity') === '10%')).toBeTrue();
        await sendMouse({type: 'up'});
        cleanup();
      });
    });
  }
});
