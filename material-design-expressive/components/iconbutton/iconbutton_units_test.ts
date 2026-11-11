/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-icon-button.js';
import '../buttongroup/md-gb-button-group.js';
import '../tooltip/md-gb-tooltip.js';
import '../../styles/icons/md-gb-icon.js';

import {sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {center} from '../../testing/subjects.js';
import {type IconButtonElement} from './icon-button-element.js';

adoptStyles(document, [m3Styles]);

function luminance(rgb: number[]) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: number[], b: number[]) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Resolves any CSS color (`color()`, `hsl(from ...)`) to 8-bit rgb. */
function toRgb(color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const context = canvas.getContext('2d', {willReadFrequently: true})!;
  context.fillStyle = '#000';
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
  return {rgb: [r, g, b], alpha: a / 255};
}

function colorOf(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return toRgb(color).rgb;
}

function finishAll(el: Element) {
  const btn = el.shadowRoot!.querySelector('[part="icon-btn"]')!;
  for (const a of [...el.getAnimations(), ...btn.getAnimations({subtree: true})]) {
    try {
      a.finish();
    } catch {
      // Infinite animations cannot finish.
    }
  }
}

describe('<md-gb-icon-button> spec units', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div style="padding: 32px">${template}</div>`);
    await env.waitForStability();
    const buttons = [
      ...root.querySelectorAll<IconButtonElement>('md-gb-icon-button'),
    ];
    const btn = (b: IconButtonElement) =>
      b.shadowRoot!.querySelector<HTMLElement>('[part="icon-btn"]')!;
    return {root, buttons, btn};
  }

  // spec: icon-buttons-598302
  it('comes in filled, tonal, outlined and standard configurations', async () => {
    const {buttons, btn} = await setup(html`
      ${['filled', 'tonal', 'outlined', 'standard'].map(
        (color) => html`<md-gb-icon-button color=${color} aria-label=${color}>
          <md-gb-icon>star</md-gb-icon>
        </md-gb-icon-button>`,
      )}
    `);
    const looks = buttons.map((b) => {
      const style = getComputedStyle(btn(b));
      return [style.backgroundColor, style.borderTopColor].join('|');
    });
    expect(new Set(looks).size).withContext(looks.join(' ; ')).toBe(4);
  });

  // spec: icon-buttons-9b245a, icon-buttons-ef09d4
  it('keeps the icon at 3:1 contrast or more with the surface or its container', async () => {
    const {buttons, btn} = await setup(html`
      ${['filled', 'tonal', 'outlined', 'standard'].flatMap((color) =>
        ['', 'toggle'].map(
          (type) => html`<md-gb-icon-button
            color=${color}
            type=${type}
            aria-label=${color}>
            <md-gb-icon>star</md-gb-icon>
          </md-gb-icon-button>`,
        ),
      )}
    `);
    const surface = colorOf('--md-sys-color-surface');
    for (const b of buttons) {
      const style = getComputedStyle(btn(b));
      const container = toRgb(style.backgroundColor);
      const background = container.alpha === 0 ? surface : container.rgb;
      const ratio = contrast(toRgb(style.color).rgb, background);
      expect(ratio)
        .withContext(`${b.color} ${b.type}`)
        .toBeGreaterThanOrEqual(3);
    }
  });

  // spec: icon-buttons-8261f7, icon-buttons-89154b, icon-buttons-a0cb67
  it('shows a semibold icon when selected if the icon has no filled version', async () => {
    const {buttons, btn} = await setup(html`
      <md-gb-icon-button type="toggle" selected unfilled-icon aria-label="a">
        <md-gb-icon>star</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button type="toggle" unfilled-icon aria-label="b">
        <md-gb-icon>star</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button type="toggle" selected aria-label="c">
        <md-gb-icon>star</md-gb-icon>
      </md-gb-icon-button>
    `);
    const prop = (b: IconButtonElement, name: string) =>
      getComputedStyle(btn(b)).getPropertyValue(name).trim();
    const [semibold, unselected, filled] = buttons;
    expect(prop(semibold, '--md-icon-wght')).toBe('600');
    expect(prop(semibold, '--md-icon-fill')).toBe('0');
    expect(prop(unselected, '--md-icon-wght')).not.toBe('600');
    // An icon with a filled version is filled, not semibold.
    expect(prop(filled, '--md-icon-fill')).toBe('1');
    expect(prop(filled, '--md-icon-wght')).not.toBe('600');
  });

  // spec: icon-buttons-b13885, icon-buttons-d87030, icon-buttons-9c2ef9
  it('shows a tooltip with its accessibility label on hover and focus', async () => {
    const {buttons, btn} = await setup(html`
      <md-gb-icon-button tooltip aria-label="Add to favorites">
        <md-gb-icon>favorite</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button aria-label="No tooltip">
        <md-gb-icon>favorite</md-gb-icon>
      </md-gb-icon-button>
    `);
    const tip = buttons[0].shadowRoot!.querySelector('md-gb-tooltip')!;
    expect(buttons[1].shadowRoot!.querySelector('md-gb-tooltip')).toBeNull();
    // The tooltip describes the action, not the icon's name.
    expect(tip.textContent?.trim()).toBe('Add to favorites');
    const open = () => tip.matches(':popover-open');
    expect(open()).toBeFalse();
    btn(buttons[0]).dispatchEvent(
      new PointerEvent('pointerenter', {pointerType: 'mouse', composed: true}),
    );
    jasmine.clock().tick(1000);
    expect(open()).withContext('hover').toBeTrue();
    tip.hide();
    expect(open()).toBeFalse();
    buttons[0].focus();
    jasmine.clock().tick(1000);
    expect(open()).withContext('focus').toBeTrue();
    tip.hide();
  });

  // spec: icon-buttons-dde11a, icon-buttons-af8ced
  it('keeps a 48dp touch target for every size, even when nested', async () => {
    const {buttons, btn} = await setup(html`
      <div style="display: flex">
        ${['xs', 'sm', 'md'].map(
          (size) => html`<md-gb-icon-button size=${size} aria-label=${size}>
            <md-gb-icon>star</md-gb-icon>
          </md-gb-icon-button>`,
        )}
      </div>
    `);
    for (const b of buttons) {
      const hit = btn(b).getBoundingClientRect();
      const target = parseFloat(
        getComputedStyle(btn(b)).getPropertyValue('--target-size') || '0',
      );
      // The hit area (layout box or touch-target expansion) is >= 48dp.
      expect(Math.max(hit.width, target))
        .withContext(b.size)
        .toBeGreaterThanOrEqual(48);
    }
  });

  // spec: icon-buttons-b4f14b, icon-buttons-c5f717
  it('responds with its neighbors in a button group when pressed', async () => {
    const {buttons, btn} = await setup(html`
      <md-gb-button-group>
        ${['One', 'Two', 'Three'].map(
          (label) => html`<md-gb-icon-button aria-label=${label}>
            <md-gb-icon>star</md-gb-icon>
          </md-gb-icon-button>`,
        )}
      </md-gb-button-group>
    `);
    const [one, two, three] = buttons;
    const before = {
      w: two.getBoundingClientRect().width,
      x: three.getBoundingClientRect().left,
    };
    const c = center(btn(two));
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await sendMouse({type: 'down'});
    for (const el of [one, two, three]) finishAll(el);
    expect(two.getBoundingClientRect().width).toBeGreaterThan(before.w);
    expect(three.getBoundingClientRect().left).toBeGreaterThan(before.x);
    await sendMouse({type: 'up'});
    await sendMouse({type: 'move', position: [0, 0]});
  });
});
