/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendKeys, sendMouse} from '@web/test-runner-commands';

import {
  center,
  deepActiveElement,
  KNOWN_GAPS,
  prop,
  renderSubject,
  deepElements,
  ripplesOf,
  SUBJECTS,
  type Subject,
} from './subjects.js';
import {colorAlpha, contentAlphas, isWithin} from './style-helpers.js';
import {frames} from './states-helpers.js';

// Suite 4 of the central CSS/token suites: disabled parts
// (foundations/interaction/states.md, Disabled). Disabled states are inherited
// by action, selection and input components only (not FABs, tabs or
// navigation), so those are not in this table. `disabled_gap.ts` has the
// checks that fail.

const COMPONENTS: string[] = ["iconbutton"];
const subjects = SUBJECTS.filter((s) => COMPONENTS.includes(s.component));

/** Menus are the exception: disabled items can receive focus (menus.md). */
const FOCUSABLE_WHEN_DISABLED = ['menu-item'];

/**
 * Disabled container colors: the property that carries the container and the
 * spec's alpha (10% fill; 12% for outlines). Tokens: md.comp.*.disabled.
 * container.opacity / outline.opacity; the "Disabled" state units of
 * buttons-18f1ba (filled), buttons-7942eb (elevated), buttons-01809f
 * (tonal), icon-buttons-e109ae (filled),
 * icon-buttons-2574ed (tonal).
 */
const CONTAINER: Record<string, [string, number]> = {
  'button-filled': ['background-color', 0.1],
  'button-elevated': ['background-color', 0.1],
  'button-tonal': ['background-color', 0.1],
  'icon-button-filled': ['background-color', 0.1],
  'icon-button-tonal': ['background-color', 0.1],
};

const CHANGE_EVENTS = ['change', 'input'];


function disable(subject: Subject, name = 'disabled') {
  return renderSubject(subject, {[name]: true});
}

describe('disabled (central)', () => {
  afterEach(async () => {
    (document.activeElement as HTMLElement | null)?.blur();
    await sendMouse({type: 'move', position: [0, 0]});
  });

  for (const subject of subjects) {
    describe(subject.id, () => {
      if (!FOCUSABLE_WHEN_DISABLED.includes(subject.id) && !KNOWN_GAPS.disabledFocus.includes(subject.id)) {
        // spec: interaction-states-495090
        it('cannot be focused', async () => {
          const {el, cleanup} = await disable(subject);
          await sendKeys({press: 'Shift'});
          el.focus();
          expect(isWithin(el, deepActiveElement())).toBeFalse();
          cleanup();
        });
      }

      if (FOCUSABLE_WHEN_DISABLED.includes(subject.id)) {
        // spec: menus-4cee82, menus-e5e312
        it('can receive focus', async () => {
          const {el, cleanup} = await disable(subject);
          await sendKeys({press: 'Shift'});
          el.focus();
          expect(isWithin(el, deepActiveElement())).toBeTrue();
          cleanup();
        });
      }

      if (subject.disabled!.toggles) {
        // spec: interaction-states-495090, interaction-states-a1ae0a
        it('does not change state or fire change when clicked or activated', async () => {
          const {el, cleanup} = await disable(subject);
          const state = subject.disabled!.toggles as string;
          const read = () => (el as unknown as Record<string, unknown>)[state];
          const before = read();
          let fired = 0;
          for (const name of CHANGE_EVENTS) el.addEventListener(name, () => fired++);
          const c = center(el);
          await sendMouse({type: 'move', position: [c.x, c.y]});
          await sendMouse({type: 'down'});
          await sendMouse({type: 'up'});
          el.focus();
          await sendKeys({press: 'Space'});
          await sendKeys({press: 'Enter'});
          // A disabled part must not react: give the input a few frames to be processed.
          await frames();
          expect(read()).toBe(before);
          expect(fired).toBe(0);
          cleanup();
        });
      }

      if (!subject.noRipple) {
        // spec: interaction-states-0ef6a2, interaction-states-495090
        it('does not show hover or pressed state layers', async () => {
          const {el, cleanup} = await disable(subject);
          const c = center(el);
          await sendMouse({type: 'move', position: [c.x, c.y]});
          await sendMouse({type: 'down'});
          await frames();
          for (const ripple of ripplesOf(el)) {
            const layer = getComputedStyle(ripple).backgroundImage;
            const painted =
              layer !== 'none' &&
              (prop(ripple, '--ripple-hover-opacity') !== '0%' ||
                prop(ripple, '--ripple-press-opacity') !== '0%');
            expect(painted).withContext(layer).toBeFalse();
          }
          await sendMouse({type: 'up'});
          cleanup();
        });
      }

      // spec: buttons-18f1ba, buttons-7942eb, buttons-01809f, icon-buttons-e109ae, icon-buttons-2574ed
      if (CONTAINER[subject.id]) {
        it('paints its container at the disabled container opacity', async () => {
          const {el, cleanup} = await disable(subject);
          const [property, expected] = CONTAINER[subject.id];
          const alphas = deepElements(el).map((e) =>
            Math.round(colorAlpha(getComputedStyle(e).getPropertyValue(property)) * 1000) / 1000,
          );
          expect(alphas).toContain(expected);
          cleanup();
        });
      }

      // spec: interaction-states-fb47ea
      if (!KNOWN_GAPS.disabledContent.includes(subject.id)) it('shows its text content at 38% opacity', async () => {
        const {el, cleanup} = await disable(subject);
        for (const alpha of contentAlphas(el)) expect(alpha).toBeCloseTo(0.38, 2);
        cleanup();
      });

      if (subject.disabled!.soft) {
        // spec: interaction-states-fb47ea
        it('soft-disabled keeps focus, says so with aria-disabled and is not operable', async () => {
          const {el, cleanup} = await disable(subject, 'soft-disabled');
          await sendKeys({press: 'Shift'});
          el.focus();
          const active = deepActiveElement();
          expect(isWithin(el, active)).toBeTrue();
          expect(
            active!.getAttribute('aria-disabled') ?? el.getAttribute('aria-disabled'),
          ).toBe('true');
          let fired = 0;
          for (const name of CHANGE_EVENTS) el.addEventListener(name, () => fired++);
          await sendKeys({press: 'Space'});
          await sendKeys({press: 'Enter'});
          expect(fired).toBe(0);
          cleanup();
        });
      }
    });
  }
});
