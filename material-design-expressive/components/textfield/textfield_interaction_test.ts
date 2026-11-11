/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-text-field.js';
import '../select/md-gb-select.js';
import '../select/md-gb-autocomplete.js';

import {sendKeys} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {isHoverMedia, sheetsOf, walkRules} from '../../testing/subjects.js';
import {type TextFieldElement} from './text-field-element.js';

adoptStyles(document, [m3Styles]);

describe('text field hover gating (touch leaves no stuck hover layer)', () => {
  const env = new Environment();

  const tags = [
    'md-gb-text-field',
    'md-gb-select',
    'md-gb-autocomplete',
  ] as const;

  for (const tag of tags) {
    describe(`<${tag}>`, () => {
      async function setup() {
        const root = env.render(
          html`<div style="padding: 24px">
            ${
              tag === 'md-gb-text-field'
                ? html`<md-gb-text-field label="Name"></md-gb-text-field>`
                : tag === 'md-gb-select'
                  ? html`<md-gb-select label="Fruit"></md-gb-select>`
                  : html`<md-gb-autocomplete
                      label="Fruit"
                    ></md-gb-autocomplete>`
            }
          </div>`,
        );
        await env.waitForStability();
        const el = root.querySelector(tag) as TextFieldElement;
        await el.updateComplete;
        return el;
      }

      // spec: interaction-states-ef6972
      it('applies the real :hover only inside (hover: hover), and .hover outside it', async () => {
        const el = await setup();
        const rules = sheetsOf(el).flatMap((sheet) =>
          walkRules(sheet.cssRules),
        );
        const real = rules.filter(({rule}) =>
          rule.selectorText.includes(':hover'),
        );
        const emulated = rules.filter(({rule}) =>
          /\.hover\b/.test(rule.selectorText),
        );
        expect(real.length).toBeGreaterThan(0);
        expect(emulated.length).toBeGreaterThan(0);
        // Every rule that reacts to a real pointer is gated on hover support.
        expect(
          real
            .filter(({media}) => !isHoverMedia(media))
            .map((r) => r.rule.selectorText),
        ).toEqual([]);
        // The emulation class works on every pointer.
        expect(
          emulated.filter(
            ({rule, media}) =>
              isHoverMedia(media) && !rule.selectorText.includes(':hover'),
          ),
        ).toEqual([]);
        expect(emulated.some(({media}) => !isHoverMedia(media))).toBeTrue();
      });

      // spec: interaction-states-ef6972
      it('still shows the hover state through the .hover emulation class', async () => {
        const el = await setup();
        const field = el.shadowRoot!.querySelector(
          '.text-field',
        ) as HTMLElement;
        const container = field.querySelector(
          '.text-field-container',
        ) as HTMLElement;
        const snapshot = () => {
          const styles = [
            field,
            container,
            ...Array.from(field.querySelectorAll<HTMLElement>('*')),
          ].flatMap((e) =>
            [undefined, '::before', '::after'].map((pseudo) => {
              const cs = getComputedStyle(e, pseudo);
              return [
                cs.backgroundColor,
                cs.color,
                cs.borderColor,
                cs.boxShadow,
                cs.opacity,
              ].join('|');
            }),
          );
          return styles.join('\n');
        };
        // No transitions, so the new state shows without waiting for them.
        const noMotion = new CSSStyleSheet();
        noMotion.replaceSync(
          '*, *::before, *::after { transition: none !important; }',
        );
        el.shadowRoot!.adoptedStyleSheets.push(noMotion);
        const before = snapshot();
        field.classList.add('hover');
        expect(snapshot()).not.toBe(before);
      });
    });
  }
});

describe('<md-gb-text-field> error after interaction (:user-invalid)', () => {
  const env = new Environment();

  async function setup() {
    const root = env.render(
      html`<div style="padding: 24px">
        <md-gb-text-field
          label="Code"
          required
          pattern="[a-z]+"
          supporting-text="Help"
        ></md-gb-text-field>
        <button id="other">other</button>
      </div>`,
    );
    await env.waitForStability();
    const el = root.querySelector('md-gb-text-field') as TextFieldElement;
    await el.updateComplete;
    return {el, other: root.querySelector('#other') as HTMLElement};
  }

  const input = (el: TextFieldElement) =>
    el.shadowRoot!.querySelector('input')!;
  const supporting = (el: TextFieldElement) =>
    el
      .shadowRoot!.querySelector('.text-field-supporting-text')!
      .textContent!.trim();
  const showsError = (el: TextFieldElement) =>
    el
      .shadowRoot!.querySelector('.text-field')!
      .classList.contains('text-field-error');

  // spec: text-fields-a273a8, text-fields-ff83d3
  it('shows no error on an invalid field the person has not touched', async () => {
    const {el} = await setup();
    expect(el.validity.valid).toBeFalse();
    expect(showsError(el)).toBeFalse();
    expect(input(el).getAttribute('aria-invalid')).toBe('false');
    expect(supporting(el)).toBe('Help');
  });

  // spec: text-fields-a273a8, text-fields-ff83d3
  it('shows the error and swaps the supporting text after typing invalid text and leaving', async () => {
    const {el, other} = await setup();
    el.focus();
    await sendKeys({type: '123'});
    // Still editing: no error yet.
    await el.updateComplete;
    expect(showsError(el)).toBeFalse();
    other.focus();

    await el.updateComplete;
    expect(showsError(el)).toBe(true);
    expect(input(el).getAttribute('aria-invalid')).toBe('true');
    expect(supporting(el)).toBe(el.validationMessage);
    // Fixing the value clears it.
    el.focus();
    el.select();
    await sendKeys({type: 'abc'});
    await el.updateComplete;
    expect(showsError(el)).toBe(false);
    expect(supporting(el)).toBe('Help');
  });

  // spec: text-fields-a273a8, text-fields-ff83d3
  it('shows the error of an emptied required field after leaving it', async () => {
    const {el, other} = await setup();
    el.focus();
    await sendKeys({type: 'a'});
    await sendKeys({press: 'Backspace'});
    other.focus();
    await el.updateComplete;
    expect(showsError(el)).toBe(true);
  });

  // spec: text-fields-a273a8, text-fields-ff83d3
  it('lets the error property force the error state and text on an untouched field', async () => {
    const {el} = await setup();
    el.error = true;
    el.errorText = 'Pick another';
    await el.updateComplete;
    expect(showsError(el)).toBeTrue();
    expect(supporting(el)).toBe('Pick another');
  });

  // spec: text-fields-a273a8, text-fields-ff83d3
  it('still shows the error when reportValidity() is called on an untouched field', async () => {
    const {el} = await setup();
    expect(el.reportValidity()).toBeFalse();
    await el.updateComplete;
    expect(showsError(el)).toBe(true);
    expect(supporting(el)).toBe(el.validationMessage);
  });

  it('clears the interaction state on reset()', async () => {
    const {el, other} = await setup();
    el.focus();
    await sendKeys({type: '1'});
    other.focus();
    await el.updateComplete;
    expect(showsError(el)).toBe(true);
    el.reset();
    await el.updateComplete;
    await el.updateComplete;
    expect(showsError(el)).toBe(false);
  });
});
