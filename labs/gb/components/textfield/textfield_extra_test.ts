/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-text-field.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type TextFieldElement} from './text-field-element.js';

adoptStyles(document, [m3Styles]);

function luminance(rgb: string) {
  const [r, g, b] = rgb
    .match(/[\d.]+/g)!
    .slice(0, 3)
    .map((v) => {
      const c = Number(v) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The computed color of a color role. */
function role(name: string) {
  const probe = document.createElement('span');
  probe.style.color = `var(--md-sys-color-${name})`;
  document.body.append(probe);
  const out = getComputedStyle(probe).color;
  probe.remove();
  return out;
}

describe('<md-gb-text-field> more spec behavior', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div style="padding: 24px">${template}</div>`);
    await env.waitForStability();
    const fields = root.querySelectorAll<TextFieldElement>('md-gb-text-field');
    const el = fields[fields.length - 1];
    await el.updateComplete;
    return el;
  }

  const container = (el: TextFieldElement) =>
    el.shadowRoot!.querySelector<HTMLElement>('[part=container]')!;

  // spec: text-fields-46edd2, text-fields-4321bc, text-fields-06fdbe
  it('starts as a single line and grows with the text of a multi-line field', async () => {
    const el = await setup(
      html`<md-gb-text-field type="textarea" rows="1" label="Notes"></md-gb-text-field>`,
    );
    const start = container(el).getBoundingClientRect().height;
    const textarea = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;
    expect(textarea.getBoundingClientRect().height).toBeLessThan(40);
    el.value = 'One\nTwo\nThree\nFour\nFive';
    await el.updateComplete;
    expect(container(el).getBoundingClientRect().height).toBeGreaterThan(start + 40);
    // The elements below shift downward.
    expect(el.getBoundingClientRect().height).toBeGreaterThan(start + 40);
  });

  // spec: text-fields-93d3ef, text-fields-d56a64, text-fields-1c73c8
  it('draws the outline of an outlined field with the outline role, at 3:1 against the surface', async () => {
    const el = await setup(
      html`<md-gb-text-field variant="outlined" label="Name"></md-gb-text-field>`,
    );
    const outline = el.shadowRoot!.querySelector<HTMLElement>('.text-field-outline')!;
    const cs = getComputedStyle(outline.querySelector('*') ?? outline);
    const borders = [
      cs.borderTopColor,
      cs.borderLeftColor,
      getComputedStyle(outline).borderTopColor,
      getComputedStyle(outline).borderLeftColor,
    ];
    expect(borders).toContain(role('outline'));
    expect(contrast(role('outline'), role('surface'))).toBeGreaterThanOrEqual(3);
  });

  // spec: text-fields-a9022f
  it('styles a read-only field like a regular one', async () => {
    await setup(html`
      <md-gb-text-field label="Name" value="Ada"></md-gb-text-field>
      <md-gb-text-field label="Name" value="Ada" readonly></md-gb-text-field>`);
    const [regular, readOnly] = [...document.querySelectorAll<TextFieldElement>('md-gb-text-field')].slice(-2);
    await readOnly.updateComplete;
    const input = readOnly.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    expect(input.readOnly).toBeTrue();
    const style = (el: TextFieldElement, selector: string) =>
      getComputedStyle(el.shadowRoot!.querySelector(selector)!);
    expect(style(readOnly, '[part=container]').backgroundColor).toBe(
      style(regular, '[part=container]').backgroundColor,
    );
    expect(style(readOnly, 'input').color).toBe(style(regular, 'input').color);
  });

  // spec: text-fields-73f0ca
  it('names the prefix and the suffix with their own ids, which describe the input', async () => {
    const el = await setup(
      html`<md-gb-text-field label="Price" prefix-text="$" suffix-text="USD"></md-gb-text-field>`,
    );
    const input = el.shadowRoot!.querySelector('input')!;
    const ids = input.getAttribute('aria-describedby')!.split(' ');
    const texts = ids.map((id) => el.shadowRoot!.getElementById(id)?.textContent?.trim());
    expect(texts).toContain('$');
    expect(texts).toContain('USD');
    expect(new Set(ids).size).toBe(ids.length);
  });

  // spec: text-fields-6912e2
  it('includes the supporting text in the label of a required field', async () => {
    const el = await setup(
      html`<md-gb-text-field label="Email" required supporting-text="We never share it"></md-gb-text-field>`,
    );
    const input = el.shadowRoot!.querySelector('input')!;
    const described = input
      .getAttribute('aria-describedby')!
      .split(' ')
      .map((id) => el.shadowRoot!.getElementById(id)?.textContent?.trim());
    expect(input.required).toBeTrue();
    expect(described).toContain('We never share it');
  });
});
