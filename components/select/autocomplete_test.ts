/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// Expectations compare indices and booleans, not elements: a failing
// expectation on an element can stall the test runner while it serializes
// the element.

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {TEXT_FIELD_CLASSES} from '../textfield/text-field.js';

import './md-gb-autocomplete.js';
import {type AutocompleteElement} from './autocomplete-element.js';
import {type SelectBase} from './select-base.js';
import {type SelectOptionElement} from './select-option-element.js';
import {SELECT_CLASSES} from './select.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-autocomplete>', () => {
  const env = new Environment();

  const states = html`
    <md-gb-select-option>Alabama</md-gb-select-option>
    <md-gb-select-option>Alaska</md-gb-select-option>
    <md-gb-select-option>Arizona</md-gb-select-option>
    <md-gb-select-option disabled>Arkansas</md-gb-select-option>
    <md-gb-select-option>California</md-gb-select-option>
  `;

  async function setupTest(
    template = html`<md-gb-autocomplete label="State"
      >${states}</md-gb-autocomplete
    >`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const autocomplete = root.querySelector(
      'md-gb-autocomplete',
    ) as AutocompleteElement;
    if (!autocomplete) {
      throw new Error('Failed to query rendered <md-gb-autocomplete>');
    }
    await autocomplete.updateComplete;
    const shadow = autocomplete.shadowRoot!;
    const input = shadow.querySelector('input') as HTMLInputElement;
    const fieldRoot = shadow.querySelector('.select') as HTMLElement;
    const options = autocomplete.options;
    const visible = () =>
      autocomplete.options
        .filter((option) => getComputedStyle(option).display !== 'none')
        .map((option) => option.displayText);
    return {root, autocomplete, shadow, input, fieldRoot, options, visible};
  }

  async function type(autocomplete: AutocompleteElement, input: HTMLInputElement, text: string) {
    input.value = text;
    input.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
    await autocomplete.updateComplete;
  }


  /** The index of the active option (`aria-activedescendant`), or -1. */
  function activeIndex(field: HTMLElement) {
    const active = field.ariaActiveDescendantElement;
    const host = field.getRootNode() as ShadowRoot;
    return (host.host as SelectBase).options.indexOf(
      active as SelectOptionElement,
    );
  }

  async function key(
    autocomplete: AutocompleteElement,
    input: HTMLInputElement,
    keyName: string,
    init: KeyboardEventInit = {},
  ) {
    const event = new KeyboardEvent('keydown', {
      key: keyName,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    });
    input.dispatchEvent(event);
    await autocomplete.updateComplete;
    return event;
  }

  describe('rendering', () => {
    it('renders an editable text field with a dropdown arrow', async () => {
      const {fieldRoot, input} = await setupTest();
      expect(input.tagName).toBe('INPUT');
      expect(fieldRoot.classList).toContain(SELECT_CLASSES.autocomplete);
      expect(fieldRoot.classList).toContain(TEXT_FIELD_CLASSES.filled);
      expect(fieldRoot.classList).toContain(TEXT_FIELD_CLASSES.hasTrailingIcon);
    });

    it('uses the autocomplete caret color', async () => {
      const {autocomplete} = await setupTest();
      const input = autocomplete.shadowRoot!.querySelector('input')!;
      const primary = getComputedStyle(document.documentElement)
        .getPropertyValue('--md-sys-color-primary')
        .trim();
      expect(getComputedStyle(autocomplete).getPropertyValue('--caret-color')).toBe(
        primary,
      );
      expect(getComputedStyle(input).caretColor).not.toBe('auto');
    });

    it('renders the outlined variant', async () => {
      const {fieldRoot} = await setupTest(
        html`<md-gb-autocomplete variant="outlined" label="State"
          >${states}</md-gb-autocomplete
        >`,
      );
      expect(fieldRoot.classList).toContain(TEXT_FIELD_CLASSES.outlined);
    });
  });

  describe('accessibility', () => {
    it('uses the editable combobox pattern', async () => {
      const {input} = await setupTest();
      expect(input.getAttribute('role')).toBe('combobox');
      expect(input.getAttribute('aria-autocomplete')).toBe('list');
      expect(input.getAttribute('aria-controls')).toBe('listbox');
      expect(input.getAttribute('aria-expanded')).toBe('false');
      expect(input.getAttribute('autocomplete')).toBe('off');
    });

    it('drops aria-autocomplete without filtering', async () => {
      const {input} = await setupTest(
        html`<md-gb-autocomplete filter="none">${states}</md-gb-autocomplete>`,
      );
      expect(input.getAttribute('aria-autocomplete')).toBe('none');
    });
  });

  describe('filtering', () => {
    it('filters the options by the typed text and opens', async () => {
      const {autocomplete, input, visible} = await setupTest();
      await type(autocomplete, input, 'ala');
      expect(autocomplete.open).toBeTrue();
      expect(input.getAttribute('aria-expanded')).toBe('true');
      expect(visible()).toEqual(['Alabama', 'Alaska']);
      await type(autocomplete, input, 'zona');
      expect(visible()).toEqual(['Arizona']);
    });

    it('eases the remaining options into their new position', async () => {
      const {autocomplete, input, options} = await setupTest();
      await type(autocomplete, input, 'a');
      expect(autocomplete.open).toBeTrue();
      // California moves up when the other options are filtered out.
      await type(autocomplete, input, 'c');
      const california = options[4];
      console.log('DBG', california.getAnimations().length, JSON.stringify(california.getAnimations().map(a=>(a.effect as KeyframeEffect).getKeyframes())), (autocomplete as any).listbox?.matches(':popover-open'));
      const motion = california
        .getAnimations()
        .find((a) =>
          ((a.effect as KeyframeEffect).getKeyframes()[0] as Keyframe)[
            'translate'
          ]?.toString().startsWith('0px '),
        );
      expect(motion).toBeDefined();
      // Options shown again fade in.
      await type(autocomplete, input, 'a');
      expect(options[0].getAnimations().length).toBeGreaterThan(0);
    });

    it('closes when nothing matches', async () => {
      const {autocomplete, input, visible} = await setupTest();
      await type(autocomplete, input, 'xyz');
      expect(visible()).toEqual([]);
      expect(autocomplete.open).toBeFalse();
    });

    it('filters by prefix with filter="starts-with"', async () => {
      const {autocomplete, input, visible} = await setupTest(
        html`<md-gb-autocomplete filter="starts-with"
          >${states}</md-gb-autocomplete
        >`,
      );
      await type(autocomplete, input, 'a');
      expect(visible()).toEqual(['Alabama', 'Alaska', 'Arizona', 'Arkansas']);
      await type(autocomplete, input, 'ifornia');
      expect(visible()).toEqual([]);
    });

    it('does not filter with filter="none"', async () => {
      const {autocomplete, input, visible} = await setupTest(
        html`<md-gb-autocomplete filter="none">${states}</md-gb-autocomplete>`,
      );
      await type(autocomplete, input, 'xyz');
      expect(visible().length).toBe(5);
    });
  });

  describe('keyboard', () => {
    it('opens with Down on the first visible option', async () => {
      const {autocomplete, input} = await setupTest();
      await key(autocomplete, input, 'ArrowDown');
      expect(autocomplete.open).toBeTrue();
      expect(activeIndex(input)).toBe(0);
    });

    it('opens with Alt+Down without an active option', async () => {
      const {autocomplete, input} = await setupTest();
      await key(autocomplete, input, 'ArrowDown', {altKey: true});
      expect(autocomplete.open).toBeTrue();
      expect(activeIndex(input)).toBe(-1);
    });

    it('moves among the visible options and picks with Enter', async () => {
      const {autocomplete, input, options} = await setupTest();
      const change = jasmine.createSpy('change');
      autocomplete.addEventListener('change', change);
      await type(autocomplete, input, 'a');
      // Typing clears the active option.
      expect(activeIndex(input)).toBe(-1);
      await key(autocomplete, input, 'ArrowDown');
      await key(autocomplete, input, 'ArrowDown');
      expect(activeIndex(input)).toBe(1);
      const enter = await key(autocomplete, input, 'Enter');
      expect(enter.defaultPrevented).toBeTrue();
      expect(autocomplete.value).toBe('Alaska');
      expect(input.value).toBe('Alaska');
      expect(autocomplete.open).toBeFalse();
      expect(change).toHaveBeenCalledTimes(1);
      expect(options[1].selected).toBeTrue();
    });

    it('does not pick a disabled option', async () => {
      const {autocomplete, input} = await setupTest();
      await type(autocomplete, input, 'kansas');
      await key(autocomplete, input, 'ArrowDown');
      expect(activeIndex(input)).toBe(3);
      await key(autocomplete, input, 'Enter');
      expect(autocomplete.value).toBe('kansas');
    });

    it('closes with Escape, then clears with Escape', async () => {
      const {autocomplete, input} = await setupTest();
      await type(autocomplete, input, 'al');
      await key(autocomplete, input, 'Escape');
      expect(autocomplete.open).toBeFalse();
      expect(autocomplete.value).toBe('al');
      await key(autocomplete, input, 'Escape');
      expect(autocomplete.value).toBe('');
    });

    it('shows every option again after picking one', async () => {
      const {autocomplete, input, visible} = await setupTest();
      await type(autocomplete, input, 'cal');
      await key(autocomplete, input, 'ArrowDown');
      await key(autocomplete, input, 'Enter');
      expect(autocomplete.value).toBe('California');
      expect(visible().length).toBe(5);
    });
  });

  describe('pointer', () => {
    it('toggles the menu from the arrow', async () => {
      const {autocomplete, shadow} = await setupTest();
      const arrow = shadow.querySelector(
        `.${SELECT_CLASSES.arrow}`,
      ) as HTMLElement;
      arrow.click();
      await autocomplete.updateComplete;
      expect(autocomplete.open).toBeTrue();
      arrow.click();
      await autocomplete.updateComplete;
      expect(autocomplete.open).toBeFalse();
    });

    it('picks a clicked option', async () => {
      const {autocomplete, options} = await setupTest();
      autocomplete.open = true;
      await autocomplete.updateComplete;
      options[2].click();
      await autocomplete.updateComplete;
      expect(autocomplete.value).toBe('Arizona');
      expect(autocomplete.open).toBeFalse();
    });
  });

  describe('forms', () => {
    it('submits the text under its name', async () => {
      const {root, autocomplete, input} = await setupTest(
        html`<form>
          <md-gb-autocomplete name="state">${states}</md-gb-autocomplete>
        </form>`,
      );
      await type(autocomplete, input, 'Texas');
      expect(new FormData(root.querySelector('form')!).get('state')).toBe(
        'Texas',
      );
    });

    it('is invalid when required and empty', async () => {
      const {autocomplete, input} = await setupTest(
        html`<md-gb-autocomplete required label="State"
          >${states}</md-gb-autocomplete
        >`,
      );
      expect(autocomplete.checkValidity()).toBeFalse();
      await type(autocomplete, input, 'Ohio');
      expect(autocomplete.checkValidity()).toBeTrue();
    });

    it('resets to the value attribute', async () => {
      const {root, autocomplete, input} = await setupTest(
        html`<form>
          <md-gb-autocomplete value="Alaska">${states}</md-gb-autocomplete>
        </form>`,
      );
      await type(autocomplete, input, 'Ohio');
      root.querySelector('form')!.reset();
      expect(autocomplete.value).toBe('Alaska');
    });
  });
});
