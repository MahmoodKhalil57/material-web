/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../../styles/icon/md-gb-icon.js';
import '../button/md-gb-button.js';
import '../iconbutton/md-gb-icon-button.js';
import './md-gb-button-group.js';

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {BUTTON_GROUP_CLASSES, buttonGroupClasses} from './button-group.js';
import {type ButtonGroupElement} from './button-group-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-button-group> density', () => {
  const env = new Environment();

  async function setup(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const group = root.querySelector(
      'md-gb-button-group',
    ) as ButtonGroupElement;
    await group.updateComplete;
    return {root, group};
  }

  function part(element: Element, name: string) {
    return element.shadowRoot!.querySelector(`[part="${name}"]`)!;
  }

  const buttons = (size: string) => html`
    <md-gb-button-group aria-label="Group" variant="connected">
      <md-gb-button size=${size}>One</md-gb-button>
      <md-gb-button size=${size}>Two</md-gb-button>
    </md-gb-button-group>
  `;

  it('defaults to density 0', async () => {
    const {group} = await setup(buttons('sm'));
    expect(group.density).toBe(0);
    expect(group.classList).not.toContain(BUTTON_GROUP_CLASSES.density1);
  });

  // buttons.md, Measurements: container heights per size.
  for (const [size, height] of [
    ['xs', 32],
    ['sm', 40],
    ['md', 56],
  ] as const) {
    it(`removes 4px per step from ${size} buttons inside`, async () => {
      const {root, group} = await setup(buttons(size));
      const [one, two] = Array.from(root.querySelectorAll('md-gb-button'));
      for (const density of [0, -1, -2, -3]) {
        group.density = density;
        await env.waitForStability();
        // The label keeps its size (grids-spacing.md: "Text size shouldn't
        // change as the container size scales"), so an extra-small button
        // at -3 stops at its 24px content height.
        const expected = Math.max(24, height + 4 * density);
        expect(part(one, 'btn').getBoundingClientRect().height)
          .withContext(`${size} density ${density}`)
          .toBe(expected);
        expect(part(two, 'btn').getBoundingClientRect().height)
          .withContext(`${size} density ${density}`)
          .toBe(expected);
      }
    });
  }

  it('applies its density to icon buttons inside', async () => {
    const {root, group} = await setup(html`
      <md-gb-button-group aria-label="Group" density="-2">
        <md-gb-icon-button aria-label="Bold">
          <md-gb-icon>format_bold</md-gb-icon>
        </md-gb-icon-button>
      </md-gb-button-group>
    `);
    const button = root.querySelector('md-gb-icon-button')!;
    expect(group.density).toBe(-2);
    expect(part(button, 'icon-btn').getBoundingClientRect().height).toBe(32);
  });

  it('keeps 48px touch targets', async () => {
    const {root, group} = await setup(buttons('xs'));
    group.density = -3;
    await env.waitForStability();
    const target = getComputedStyle(
      part(root.querySelector('md-gb-button')!, 'btn'),
      '::before',
    );
    expect(target.height).toBe('48px');
  });

  it('keeps full outer corners on dense connected buttons', async () => {
    const {root, group} = await setup(buttons('sm'));
    group.density = -2;
    await env.waitForStability();
    const first = part(root.querySelector('md-gb-button')!, 'btn');
    // Half the 32px dense height.
    expect(getComputedStyle(first).borderStartStartRadius).toBe('16px');
  });

  it('clamps density to 0..-3 and reflects it', async () => {
    const {group} = await setup(buttons('sm'));
    group.density = -7;
    await env.waitForStability();
    expect(group.density).toBe(-3);
    expect(group.getAttribute('density')).toBe('-3');
    expect(group.classList).toContain(BUTTON_GROUP_CLASSES.density3);
    group.density = 2;
    await env.waitForStability();
    expect(group.density).toBe(0);
    expect(group.classList).not.toContain(BUTTON_GROUP_CLASSES.density3);
  });
});

describe('buttonGroupClasses() density', () => {
  it('adds one class per density step', () => {
    expect(buttonGroupClasses({density: -1})).toEqual(
      jasmine.objectContaining({
        [BUTTON_GROUP_CLASSES.density1]: true,
        [BUTTON_GROUP_CLASSES.density2]: false,
        [BUTTON_GROUP_CLASSES.density3]: false,
      }),
    );
  });
});
