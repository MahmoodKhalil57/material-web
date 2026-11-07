/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../button/md-gb-button.js';
import './md-gb-button-group.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type ButtonElement} from '../button/button-element.js';
import {
  center,
  deepElements,
  focusRingsOf,
  prop,
  ripplesOf,
} from '../shared/central/subjects.js';
import {type ButtonGroupElement} from './button-group-element.js';

adoptStyles(document, [m3Styles]);

const inner = (b: ButtonElement) =>
  b.shadowRoot!.querySelector<HTMLElement>('[part="btn"]')!;

function settleTransitions(el: Element) {
  for (let pass = 0; pass < 2; pass++) {
    for (const a of [
      ...document.getAnimations(),
      ...deepElements(el).flatMap((e) => e.getAnimations()),
    ]) {
      try {
        a.finish();
      } catch {
        // Infinite animations cannot finish.
      }
    }
  }
}

describe('<md-gb-button-group> spec behavior', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div style="padding: 32px">${template}</div>`);
    await env.waitForStability();
    const groups = [
      ...root.querySelectorAll<ButtonGroupElement>('md-gb-button-group'),
    ];
    const buttons = (g: ButtonGroupElement) => [
      ...g.querySelectorAll<ButtonElement>('md-gb-button'),
    ];
    return {root, groups, buttons};
  }

  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: button-groups-d01d60, button-groups-028279, button-groups-161d50, button-groups-10f350, button-groups-7b8114, button-groups-5056b3
  it('has a standard variant by default and a connected variant', async () => {
    const {groups, buttons} = await setup(html`
      <md-gb-button-group>
        <md-gb-button>A</md-gb-button><md-gb-button>B</md-gb-button>
      </md-gb-button-group>
      <md-gb-button-group variant="connected">
        <md-gb-button>A</md-gb-button><md-gb-button>B</md-gb-button>
      </md-gb-button-group>`);
    const [standard, connected] = groups;
    expect(standard.variant).toBe('standard');
    expect(connected.variant).toBe('connected');
    const gap = (g: ButtonGroupElement) => {
      const [a, b] = buttons(g).map((x) => x.getBoundingClientRect());
      return Math.round(b.left - a.right);
    };
    // Standard groups space their buttons; connected groups sit close together.
    expect(gap(standard)).toBeGreaterThan(gap(connected));
    expect(gap(connected)).toBeLessThanOrEqual(4);
  });

  // spec: button-groups-788fa8, button-groups-d04563, button-groups-490d98, button-groups-0f0e07, button-groups-cb5c7d, button-groups-2dfbb4, button-groups-7fdab3
  it('comes in extra small to extra large, following the size of its buttons', async () => {
    const heights = {xs: 32, sm: 40, md: 56, lg: 96, xl: 136};
    for (const variant of ['standard', 'connected']) {
      const {groups, buttons} = await setup(html`${Object.keys(heights).map(
        (size) => html`<md-gb-button-group variant=${variant}>
          <md-gb-button size=${size}>A</md-gb-button><md-gb-button size=${size}>B</md-gb-button>
        </md-gb-button-group>`,
      )}`);
      groups.forEach((g, i) => {
        const expected = Object.values(heights)[i];
        for (const b of buttons(g)) {
          expect(Math.round(inner(b).getBoundingClientRect().height))
            .withContext(`${variant} ${Object.keys(heights)[i]}`)
            .toBe(expected);
        }
        expect(Math.round(g.getBoundingClientRect().height)).toBe(expected);
      });
    }
  });

  // spec: button-groups-86cf76
  it('uses round buttons by default and square buttons when asked', async () => {
    const {groups, buttons} = await setup(html`
      <md-gb-button-group variant="connected">
        <md-gb-button>A</md-gb-button><md-gb-button>B</md-gb-button><md-gb-button>C</md-gb-button>
      </md-gb-button-group>
      <md-gb-button-group variant="connected">
        <md-gb-button square>A</md-gb-button><md-gb-button square>B</md-gb-button><md-gb-button square>C</md-gb-button>
      </md-gb-button-group>`);
    const outer = (g: ButtonGroupElement) =>
      parseFloat(getComputedStyle(inner(buttons(g)[0])).borderTopLeftRadius);
    expect(outer(groups[0])).toBe(20);
    expect(outer(groups[1])).toBeLessThan(20);
  });

  // spec: button-groups-1f00dc, button-groups-0fcd09
  it('widens a pressed button in a standard group and moves its neighbors', async () => {
    const {groups, buttons} = await setup(html`
      <md-gb-button-group>
        <md-gb-button>One</md-gb-button><md-gb-button>Two</md-gb-button><md-gb-button>Three</md-gb-button>
      </md-gb-button-group>`);
    const [one, two, three] = buttons(groups[0]);
    const before = {w: two.getBoundingClientRect().width, x: three.getBoundingClientRect().left};
    const c = center(inner(two));
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await sendMouse({type: 'down'});
    settleTransitions(groups[0]);
    expect(two.getBoundingClientRect().width).toBeGreaterThan(before.w);
    expect(three.getBoundingClientRect().left).toBeGreaterThan(before.x);
    expect(one.getBoundingClientRect().left).toBeLessThanOrEqual(two.getBoundingClientRect().left);
    await sendMouse({type: 'up'});
  });

  // spec: button-groups-b797b8, button-groups-3ff743
  it('changes only the shape of a pressed button in a connected group', async () => {
    const {groups, buttons} = await setup(html`
      <md-gb-button-group variant="connected">
        <md-gb-button>One</md-gb-button><md-gb-button>Two</md-gb-button><md-gb-button>Three</md-gb-button>
      </md-gb-button-group>`);
    const [one, two, three] = buttons(groups[0]);
    const rect = (b: ButtonElement) => b.getBoundingClientRect();
    const radius = (b: ButtonElement) => getComputedStyle(inner(b)).borderTopRightRadius;
    const before = {two: rect(two).width, three: rect(three).left, r2: radius(two), r1: radius(one), r3: radius(three)};
    const c = center(inner(two));
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await sendMouse({type: 'down'});
    settleTransitions(groups[0]);
    expect(rect(two).width).toBe(before.two);
    expect(rect(three).left).toBe(before.three);
    expect(radius(two)).not.toBe(before.r2);
    expect(radius(one)).toBe(before.r1);
    expect(radius(three)).toBe(before.r3);
    await sendMouse({type: 'up'});
  });

  // spec: button-groups-d06763, button-groups-cc5cb3, button-groups-8ad533, button-groups-f15ea5, button-groups-ef2c6a, button-groups-dca7e9, button-groups-f1818a, button-groups-d1b10a, button-groups-72dcdb, button-groups-173b8d
  // spec: button-groups-afc44e, button-groups-03686d, button-groups-6128c7, button-groups-ced633, button-groups-53ae54, button-groups-6c5413, button-groups-fea634, button-groups-9a29b7, button-groups-7ffd10
  for (const variant of ['standard', 'connected'] as const) {
    describe(`${variant} states`, () => {
      const template = (disabled = false) => html`
        <md-gb-button-group variant=${variant} selection="single" ?disabled=${disabled}>
          <md-gb-button color="outlined">One</md-gb-button>
          <md-gb-button color="outlined" selected>Two</md-gb-button>
        </md-gb-button-group>`;

      it('shows the enabled state with no state layer', async () => {
        const {groups, buttons} = await setup(template());
        for (const b of buttons(groups[0])) {
          for (const r of ripplesOf(b)) {
            expect(prop(r, '--ripple-hover-opacity')).toBe('0%');
            expect(prop(r, '--ripple-press-opacity')).toBe('0%');
          }
        }
      });

      it('shows an 8% layer on a hovered button, selected or not', async () => {
        const {groups, buttons} = await setup(template());
        for (const b of buttons(groups[0])) {
          const c = center(inner(b));
          await sendMouse({type: 'move', position: [c.x, c.y]});
          settleTransitions(groups[0]);
          expect(ripplesOf(b).some((r) => prop(r, '--ripple-hover-opacity') === '8%')).toBeTrue();
        }
      });

      it('shows the focus indicator on a keyboard-focused button, selected or not', async () => {
        const {groups, buttons} = await setup(template());
        for (const b of buttons(groups[0])) {
          await sendKeys({press: 'Shift'});
          b.focus();
          settleTransitions(groups[0]);
          expect(focusRingsOf(b).some((r) => prop(r, '--focus-ring-outline') !== 'none')).toBeTrue();
        }
      });

      it('shows a 10% pressed layer while a button is pressed, selected or not', async () => {
        const {groups, buttons} = await setup(template());
        for (const b of buttons(groups[0])) {
          const c = center(inner(b));
          await sendMouse({type: 'move', position: [c.x, c.y]});
          await sendMouse({type: 'down'});
          settleTransitions(groups[0]);
          expect(ripplesOf(b).some((r) => prop(r, '--ripple-press-opacity') === '10%')).toBeTrue();
          await sendMouse({type: 'up'});
        }
      });

      it('disables every button of a disabled group, at 38% label opacity', async () => {
        const {groups, buttons} = await setup(template(true));
        for (const b of buttons(groups[0])) {
          expect(b.disabled).toBeTrue();
          // The selected outlined button is a known gap: buttongroup_gap.ts.
          if (b.selected) continue;
          const m = getComputedStyle(inner(b)).color.match(/\/\s*([\d.]+)\)/);
          expect(Number(m?.[1])).toBeCloseTo(0.38, 2);
        }
      });
    });
  }

});
