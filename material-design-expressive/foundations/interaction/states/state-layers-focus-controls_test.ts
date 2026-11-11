/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendKeys, sendMouse} from '@web/test-runner-commands';

import {
  isHoverMedia,
  KNOWN_GAPS,
  paintedLayerAlpha,
  renderSubject,
  ripplesOf,
  sheetsOf,
  SUBJECTS,
  until,
  walkRules,
} from '../../../testing/subjects.js';

// Suite 1 (state layers), second half: the 10% focus layer and the 16% dragged
// layer (foundations/interaction/states.md), and the hover gating: every :hover
// rule sits inside `@media (hover: hover)`. The hover layer is in
// `state-layers_test.ts`, the pressed layer in `state-layers-pressed_test.ts`
// and the rule split in `state-layers-gated_test.ts`. `state-layers_gap.ts` has
// the subjects that don't meet these yet.

const COMPONENTS = ["iconbutton","checkbox","radio","switch","chip"];
const interactive = SUBJECTS.filter((s) => s.disabled && !s.noRipple && COMPONENTS.includes(s.component));

/** The painted state-layer alpha of every ripple of a subject. */
const paintedAlphas = (el: Element) => ripplesOf(el).map((r) => paintedLayerAlpha(r));

describe('state layers (central, focus and dragged controls)', () => {
  afterEach(async () => {
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: interaction-states-cbf1a8, interaction-states-e2f309, interaction-inputs-7b9c68
  // (ENGINEERING-BACKLOG item 1): "Hover states are initiated by the user
  // pausing over an interactive element using a cursor", so touch taps must not
  // leave a hover layer on.
  for (const subject of interactive) {
    if (KNOWN_GAPS.hoverGate.includes(subject.id)) continue;
    it(`${subject.id}: gates every :hover rule on (hover: hover)`, async () => {
      const {el, cleanup} = await renderSubject(subject);
      const ungated: string[] = [];
      for (const sheet of sheetsOf(el)) {
        for (const {rule, media} of walkRules(sheet.cssRules)) {
          if (/:hover/.test(rule.selectorText) && !isHoverMedia(media)) {
            ungated.push(rule.selectorText.slice(0, 80));
          }
        }
      }
      expect(ungated).toEqual([]);
      cleanup();
    });
  }

  // spec: interaction-states-820c79, interaction-states-455094
  for (const subject of interactive) {
    it(`${subject.id}: shows a 10% focus layer on keyboard focus`, async () => {
      const {el, cleanup} = await renderSubject(subject);
      await sendKeys({press: 'Shift'});
      el.focus();
      await until(() => paintedAlphas(el).includes(0.1));
      expect(paintedAlphas(el)).toContain(0.1);
      cleanup();
    });
  }

  // spec: interaction-states-8fef55, interaction-states-70f155, interaction-states-a5e3ef
  for (const [id, attr] of [
    ['chip-assist', 'dragged'],
  ] as Array<[string, string]>) {
    it(`${id}: shows a 16% dragged layer while ${attr}`, async () => {
      const subject = SUBJECTS.find((s) => s.id === id)!;
      const {el, cleanup} = await renderSubject(subject, {[attr]: true});
      await until(() => paintedAlphas(el).includes(0.16));
      expect(paintedAlphas(el)).toContain(0.16);
      cleanup();
    });
  }
});
