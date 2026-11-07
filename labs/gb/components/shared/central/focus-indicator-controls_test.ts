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
  deepElements,
  focusRingsOf,
  KNOWN_GAPS,
  prop,
  renderSubject,
  SUBJECTS,
  until,
} from './subjects.js';

// Suite 2 of the central CSS/token suites: the keyboard focus indicator
// (foundations/interaction/states.md, Focused > Keyboard focus indicator). The
// ring's thickness, offsets and color are the md.sys.state.focus-indicator
// tokens (tokens/versions/latest/sass/_md-sys-state-focus-indicator.scss):
// thickness 3px, outer offset 2px, inner offset -3px; the color is the
// secondary role.
const THICKNESS = '3px';
const OUTER_OFFSET = '2px';
const INNER_OFFSET = '-3px';

const COMPONENTS: string[] = ["iconbutton","checkbox","radio","switch","chip"];
const ringed = SUBJECTS.filter(
  (s) => COMPONENTS.includes(s.component) && s.disabled && !s.input && s.id !== 'slider' && !KNOWN_GAPS.focusRing.includes(s.id),
);

/** Moves focus the way a keyboard user does (the last input was a key). */
async function focusByKeyboard(el: HTMLElement) {
  await sendKeys({press: 'Shift'});
  el.focus();
  // The ring grows from nothing: finish that, then wait until it is drawn.
  restingState(el);
  await until(() => shownRings(el).length > 0 && shownRings(el).every((r) => drawnOutline(r) !== null));
}

/** Finishes the ring's grow/shrink animations (also in shadow roots). */
function restingState(el: Element) {
  for (let pass = 0; pass < 3; pass++) {
    const animations = [
      ...document.getAnimations(),
      ...deepElements(el).flatMap((e) => e.getAnimations()),
    ];
    for (const a of animations) {
      try {
        a.finish();
      } catch {
        // An infinite animation cannot finish.
      }
    }
    document.body.getBoundingClientRect();
  }
}

/** The rings that are currently showing (their outline variable is set). */
function shownRings(el: Element) {
  return focusRingsOf(el).filter((r) => prop(r, '--focus-ring-outline') !== 'none');
}

/**
 * The outline that is drawn for a ring: on the ring element, or on its
 * ::before / ::after when the component draws it there (checkbox, radio, tabs).
 */
function drawnOutline(ring: Element) {
  for (const pseudo of [undefined, '::before', '::after']) {
    const style = getComputedStyle(ring, pseudo);
    if (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) {
      return {style, onPseudo: !!pseudo};
    }
  }
  return null;
}

describe('focus indicator (central)', () => {
  afterEach(async () => {
    (document.activeElement as HTMLElement | null)?.blur();
    await sendMouse({type: 'move', position: [0, 0]});
  });

  for (const subject of ringed) {
    describe(subject.id, () => {
      // spec: interaction-states-51c31c, interaction-states-589805, interaction-states-2696df, interaction-inputs-b66e1c, interaction-inputs-dc5017
      it('shows a ring-like keyboard focus indicator when focused with the keyboard', async () => {
        const {el, cleanup} = await renderSubject(subject);
        expect(focusRingsOf(el).length).toBeGreaterThan(0);
        // (A menu focuses its first item when it opens.)
        (deepActiveElement() as HTMLElement | null)?.blur();
        await until(() => !deepElements(el).includes(deepActiveElement()!));
        expect(shownRings(el).length).toBe(0);
        await focusByKeyboard(el);
        const rings = shownRings(el);
        expect(rings.length).toBeGreaterThan(0);
        for (const ring of rings) {
          expect(drawnOutline(ring)?.style.outlineStyle).toBe('solid');
        }
        cleanup();
      });

      // spec: interaction-states-51c31c, interaction-states-1ffb30
      it('draws the ring with the focus-indicator thickness, offset and color tokens', async () => {
        const {el, cleanup} = await renderSubject(subject);
        await focusByKeyboard(el);
        // The ring grows and shrinks to its resting size; jump to the end.
        restingState(el);
        const secondary = prop(document.documentElement, '--md-sys-color-secondary');
        expect(secondary).not.toBe('');
        const rings = shownRings(el);
        expect(rings.length).toBeGreaterThan(0);
        for (const ring of rings) {
          const outline = prop(ring, '--focus-ring-outline');
          expect(outline).toBe(`${THICKNESS} solid ${secondary}`);
          const inner = ring.matches('.focus-ring-inner');
          expect(prop(ring, '--focus-ring-offset')).toBe(inner ? INNER_OFFSET : OUTER_OFFSET);
          // The resting size is read from the painted outline when it is on the
          // ring element; a ring painted on a pseudo-element keeps animating
          // in the test browser, so its variables (checked above) stand in.
          const drawn = drawnOutline(ring)!;
          if (!drawn.onPseudo) {
            expect(drawn.style.outlineWidth).toBe(THICKNESS);
            expect(drawn.style.outlineOffset).toBe(inner ? INNER_OFFSET : OUTER_OFFSET);
          }
        }
        cleanup();
      });

      // spec: interaction-states-51c31c, interaction-states-589805
      it('does not show the ring when focus comes from a pointer', async () => {
        const {el, cleanup} = await renderSubject(subject);
        const c = center(el);
        await sendMouse({type: 'move', position: [c.x, c.y]});
        await sendMouse({type: 'down'});
        await sendMouse({type: 'up'});
        // The pointer gives the part focus; wait for that, then check no ring.
        await until(() => deepElements(el).includes(deepActiveElement()!));
        expect(shownRings(el).length).toBe(0);
        cleanup();
      });
    });
  }
});
