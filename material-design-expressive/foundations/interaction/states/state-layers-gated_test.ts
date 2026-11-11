/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {
  isHoverMedia,
  renderSubject,
  sheetsOf,
  SUBJECTS,
  walkRules,
} from '../../../testing/subjects.js';

// Suite 1 (state layers), the rule split: pressed and focus rules sit outside
// any `(hover: hover)` query, only hover is gated (foundations/interaction/
// states.md). Renders every interactive part, so it runs in its own file.

const interactive = SUBJECTS.filter((s) => s.disabled && !s.noRipple);

describe('state layers (central, hover gating rules)', () => {
  // spec: interaction-states-ef6972, interaction-states-820c79
  // (constraint from ENGINEERING-BACKLOG item 1: only hover may be gated)
  it('keeps pressed and focus rules outside any (hover: hover) media query', async () => {
    const offenders = new Set<string>();
    for (const subject of interactive) {
      const {el, cleanup} = await renderSubject(subject);
      for (const sheet of sheetsOf(el)) {
        for (const {rule, media} of walkRules(sheet.cssRules)) {
          if (isHoverMedia(media) && /:(active|focus)/.test(rule.selectorText)) {
            offenders.add(`${subject.component}: ${rule.selectorText}`);
          }
        }
      }
      cleanup();
    }
    expect([...offenders]).toEqual([]);
  });
});
