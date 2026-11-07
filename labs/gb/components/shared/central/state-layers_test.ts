/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendMouse} from '@web/test-runner-commands';

import {
  center,
  prop,
  renderSubject,
  ripplesOf,
  sheetsOf,
  sleep,
  stateLayerAlpha,
  KNOWN_GAPS,
  SUBJECTS,
  walkRules,
  isHoverMedia,
} from './subjects.js';

// Suite 1 of the central CSS/token suites: state layers
// (foundations/interaction/states.md, "State layer tokens & values": hover
// 8%, focus 10%, pressed 10%, dragged 16% of the content color).
// `state-layers_gap.ts` has the checks the components don't meet yet.

const interactive = SUBJECTS.filter((s) => s.disabled && !s.noRipple);

async function hover(el: Element) {
  const c = center(el);
  await sendMouse({type: 'move', position: [c.x, c.y]});
  await sleep(120);
}

async function leave() {
  await sendMouse({type: 'up'}).catch(() => {});
  await sendMouse({type: 'move', position: [0, 0]});
  await sleep(40);
}

describe('state layers (central)', () => {
  afterEach(leave);

  for (const subject of interactive) {
    describe(subject.id, () => {
      // spec: interaction-states-17d344, interaction-states-85b09d, interaction-states-cbf1a8
      it('shows an 8% hover layer when the cursor is over it', async () => {
        const {el, cleanup} = await renderSubject(subject);
        const ripples = ripplesOf(el);
        expect(ripples.length).toBeGreaterThan(0);
        expect(ripples.map((r) => prop(r, '--ripple-hover-opacity'))).toEqual(
          jasmine.arrayContaining(['0%']),
        );
        await hover(el);
        expect(ripples.some((r) => prop(r, '--ripple-hover-opacity') === '8%')).toBeTrue();
        cleanup();
      });

      // spec: interaction-states-ef6972, interaction-states-ba2793
      it('shows a 10% pressed (ripple) layer while pressed', async () => {
        const {el, cleanup} = await renderSubject(subject);
        const ripples = ripplesOf(el);
        await hover(el);
        await sendMouse({type: 'down'});
        await sleep(150);
        expect(ripples.some((r) => prop(r, '--ripple-press-opacity') === '10%')).toBeTrue();
        await sendMouse({type: 'up'});
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
        await hover(el);
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
