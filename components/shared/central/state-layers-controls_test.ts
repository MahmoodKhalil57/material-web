/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendMouse} from '@web/test-runner-commands';

import {
  center,
  deepActiveElement,
  KNOWN_GAPS,
  prop,
  renderSubject,
  ripplesOf,
  stateLayerAlpha,
  SUBJECTS,
  until,
} from './subjects.js';

// Suite 1 of the central CSS/token suites: state layers
// (foundations/interaction/states.md, "State layer tokens & values": hover
// 8%, focus 10%, pressed 10%, dragged 16% of the content color). This file
// checks the hover layer, its transition and its color for icon buttons, selection controls and chips.
// The pressed layer is in `state-layers-pressed-controls_test.ts`, the focus and
// dragged layers and the hover gating in `state-layers-focus-controls_test.ts`.
// `state-layers_gap.ts` has the checks the components don't meet yet.

const COMPONENTS = ["iconbutton","checkbox","radio","switch","chip"];
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

describe('state layers (central, hover controls)', () => {
  afterEach(leave);

  for (const subject of interactive) {
    describe(subject.id, () => {
      // spec: interaction-states-17d344, interaction-states-85b09d, interaction-states-cbf1a8
      it('shows an 8% hover layer when the cursor is over it', async () => {
        const {el, cleanup} = await renderSubject(subject);
        // (A menu focuses its first item when it opens: a focus layer takes the place of hover.)
        (deepActiveElement() as HTMLElement | null)?.blur();
        const ripples = ripplesOf(el);
        expect(ripples.length).toBeGreaterThan(0);
        expect(ripples.map((r) => prop(r, '--ripple-hover-opacity'))).toEqual(
          jasmine.arrayContaining(['0%']),
        );
        await hover(el);
        await until(() => ripples.some((r) => prop(r, '--ripple-hover-opacity') === '8%'));
        expect(ripples.some((r) => prop(r, '--ripple-hover-opacity') === '8%')).toBeTrue();
        cleanup();
      });

      // spec: interaction-states-50e3c6
      if (!KNOWN_GAPS.hoverFade.includes(subject.id)) it('fades the hover layer in and out with a transition', async () => {
        const {el, cleanup} = await renderSubject(subject);
        const fading = ripplesOf(el).filter((r) => {
          const style = getComputedStyle(r);
          const props = style.transitionProperty.split(',').map((p) => p.trim());
          const durations = style.transitionDuration.split(',').map((d) => parseFloat(d));
          const i = props.indexOf('--ripple-hover-opacity');
          return i >= 0 && durations[i % durations.length] > 0;
        });
        expect(fading.length).toBeGreaterThan(0);
        cleanup();
      });

      // spec: interaction-states-c90ca1, interaction-states-664005, interaction-states-a5d49d
      it('paints the hover layer in the content color', async () => {
        const {el, cleanup} = await renderSubject(subject);
        (deepActiveElement() as HTMLElement | null)?.blur();
        await hover(el);
        // Wait for the hover layer (the state the hover test checks): some parts
        // paint it on a child instead, and the loop below then checks nothing.
        await until(() => ripplesOf(el).some((r) => prop(r, '--ripple-hover-opacity') === '8%'));
        const layered = ripplesOf(el).filter((r) => stateLayerAlpha(r) > 0);
        for (const ripple of layered) {
          const bg = getComputedStyle(ripple).backgroundImage;
          const [r, g, b] = (getComputedStyle(ripple).color.match(/[\d.]+/g) ?? []).map(Number);
          const first = bg.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/);
          expect(first).not.toBeNull();
          expect(Math.round(Number(first![1]) * 255)).toBe(r);
          expect(Math.round(Number(first![2]) * 255)).toBe(g);
          expect(Math.round(Number(first![3]) * 255)).toBe(b);
        }
        cleanup();
      });
    });
  }
});
