/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../../styles/icon/md-gb-icon.js';
import './md-gb-segmented-button-set.js';
import './md-gb-segmented-button.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {internals} from '../../behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type SegmentedButtonSetElement} from './segmented-button-set-element.js';
import {type SegmentedButtonElement} from './segmented-button-element.js';
import segmentedButtonSetStyles from './segmented-button-set.cssresult.js';
import segmentedButtonStyles from './segmented-button.cssresult.js';

adoptStyles(document, [
  m3Styles,
  segmentedButtonSetStyles,
  segmentedButtonStyles,
]);

/** Converts a computed `rgb()` color to its relative luminance. */
function luminance(color: string) {
  const [r, g, b] = color
    .match(/[\d.]+/g)!
    .slice(0, 3)
    .map((channel) => {
      const c = Number(channel) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

describe('md-gb-segmented-button spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(html`<button id="before">Before</button>${template}`);
    await env.waitForStability();
    const items = Array.from(
      root.querySelectorAll<SegmentedButtonElement>('md-gb-segmented-button'),
    );
    for (const item of items) await item.updateComplete;
    return {items, before: root.querySelector<HTMLElement>('#before')!};
  }

  const button = (item: SegmentedButtonElement) =>
    item.shadowRoot!.querySelector<HTMLButtonElement>('button')!;

  const sortBy = html`<md-gb-segmented-button-set aria-label="Sort by">
    <md-gb-segmented-button value="relevance">Relevance</md-gb-segmented-button>
    <md-gb-segmented-button value="distance">Distance</md-gb-segmented-button>
  </md-gb-segmented-button-set>`;

  // spec: segmented-buttons-7fab56, segmented-buttons-dcf6ff
  it('is navigated to and activated by assistive technology as a radio group', async () => {
    const {items, before} = await render(sortBy);
    const set = document.querySelector<SegmentedButtonSetElement>(
      'md-gb-segmented-button-set',
    )!;
    expect((set as any)[internals].role).toBe('radiogroup');
    expect(button(items[0]).getAttribute('role')).toBe('radio');
    before.focus();
    await sendKeys({press: 'Tab'});
    expect(items[0].shadowRoot!.activeElement).toBe(button(items[0]));
    await sendKeys({press: 'ArrowRight'});
    await sendKeys({press: 'Space'});
    expect(items[1].selected).toBeTrue();
    expect(button(items[1]).getAttribute('aria-checked')).toBe('true');
    expect(button(items[0]).getAttribute('aria-checked')).toBe('false');
  });

  // spec: segmented-buttons-240e8e, segmented-buttons-568712, segmented-buttons-5582b2
  it('labels a segment with its visible label text', async () => {
    const {items} = await render(sortBy);
    // No aria-label overrides the text, so the name assistive technology
    // announces is the visible text, which says what choosing the segment does.
    for (const item of items) {
      expect(button(item).hasAttribute('aria-label')).toBeFalse();
      const slotted = button(item).querySelector(
        'slot:not([name])',
      ) as HTMLSlotElement;
      expect(
        slotted
          .assignedNodes({flatten: true})
          .map((n) => n.textContent)
          .join(''),
      ).toBe(item.textContent!.trim());
    }
    expect(items.map((item) => item.textContent!.trim())).toEqual([
      'Relevance',
      'Distance',
    ]);
  });

  // spec: segmented-buttons-e210d8
  it('labels an icon-only segment by the action it expresses', async () => {
    const {items} = await render(html`
      <md-gb-segmented-button-set aria-label="Price">
        <md-gb-segmented-button value="1" aria-label="Inexpensive">
          <md-gb-icon slot="icon">attach_money</md-gb-icon>
        </md-gb-segmented-button>
        <md-gb-segmented-button value="2" aria-label="Moderate">
          <md-gb-icon slot="icon">attach_money</md-gb-icon>
        </md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    expect(items.map((item) => button(item).getAttribute('aria-label'))).toEqual(
      ['Inexpensive', 'Moderate'],
    );
  });

  // spec: segmented-buttons-391f6a, segmented-buttons-76a694, segmented-buttons-5bf752
  it('draws the outline with at least 3:1 contrast against the surface', async () => {
    const {items} = await render(sortBy);
    const outline = getComputedStyle(button(items[0])).borderTopColor;
    const surface = resolvedColor('--md-sys-color-surface');
    expect(getComputedStyle(button(items[0])).borderTopWidth).not.toBe('0px');
    expect(contrast(outline, surface)).toBeGreaterThanOrEqual(3);
  });
});
