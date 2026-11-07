/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendKeys} from '@web/test-runner-commands';

import {
  isHoverMedia,
  KNOWN_GAPS,
  paintedLayerAlpha,
  renderSubject,
  ripplesOf,
  sheetsOf,
  SUBJECTS,
  walkRules,
} from './subjects.js';

// Suite 1 (state layers), second half: hover gating, the 10% focus layer and
// the 16% dragged layer (foundations/interaction/states.md).
// `state-layers_gap.ts` has the subjects that don't meet them yet.

const interactive = SUBJECTS.filter((s) => s.disabled && !s.noRipple);

describe('state layers (central, hover gating, focus, dragged)', () => {
  // spec: interaction-states-cbf1a8, interaction-states-e2f309
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
      await new Promise((r) => setTimeout(r, 100));
      const layers = ripplesOf(el).map((r) => paintedLayerAlpha(r));
      expect(layers).toContain(0.1);
      cleanup();
    });
  }

  // spec: interaction-states-8fef55, interaction-states-70f155, interaction-states-a5e3ef
  for (const [id, attr] of [
    ['card-interactive', 'dragged'],
    ['chip-assist', 'dragged'],
    ['list-item', 'dragging'],
  ]) {
    it(`${id}: shows a 16% dragged layer while ${attr}`, async () => {
      const subject = SUBJECTS.find((s) => s.id === id)!;
      const {el, cleanup} = await renderSubject(subject, {[attr]: true});
      await new Promise((r) => setTimeout(r, 100));
      const layers = ripplesOf(el).map((r) => paintedLayerAlpha(r));
      expect(layers).toContain(0.16);
      cleanup();
    });
  }
});
