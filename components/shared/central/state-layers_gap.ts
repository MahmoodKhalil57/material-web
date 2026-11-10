/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {
  isHoverMedia,
  KNOWN_GAPS,
  renderSubject,
  ripplesOf,
  sheetsOf,
  SUBJECTS,
  walkRules,
} from './subjects.js';

// Gap checks for suite 1 (state layers): subjects that don't meet the spec
// yet. Run with `npm run gb:check -- --gaps ...`. The rest of the checks are
// in `state-layers_test.ts` and `state-layers-gated_test.ts`.

describe('state layers (central gaps)', () => {
  // With no known gaps the suite would have no tests, which the runner
  // reports as a failed file ("Unknown error").
  if (KNOWN_GAPS.hoverGate.length === 0 && KNOWN_GAPS.hoverFade.length === 0) {
    it("has no known gaps", () => {
    expect(KNOWN_GAPS.hoverGate).toEqual([]);
    expect(KNOWN_GAPS.hoverFade).toEqual([]);
    });
  }
  // spec: interaction-states-cbf1a8, interaction-states-e2f309
  for (const id of KNOWN_GAPS.hoverGate) {
    it(`${id}: gates every :hover rule on (hover: hover)`, async () => {
      const {el, cleanup} = await renderSubject(SUBJECTS.find((s) => s.id === id)!);
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

  // spec: interaction-states-50e3c6
  for (const id of KNOWN_GAPS.hoverFade) {
    it(`${id}: fades the hover layer in and out with a transition`, async () => {
      const {el, cleanup} = await renderSubject(SUBJECTS.find((s) => s.id === id)!);
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
  }
});
