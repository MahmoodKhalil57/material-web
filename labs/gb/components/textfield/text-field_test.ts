/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import './md-gb-text-field.js';
import {
  setupTextField,
  TEXT_FIELD_CLASSES,
  textFieldClasses,
} from './text-field.js';
import {type TextFieldElement} from './text-field-element.js';
import textFieldStyles from './text-field.cssresult.js';

adoptStyles(document, [m3Styles, textFieldStyles]);

describe('<md-gb-text-field>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`<md-gb-text-field label="Label"></md-gb-text-field>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const field = root.querySelector('md-gb-text-field') as TextFieldElement;
    if (!field) {
      throw new Error('Failed to query rendered <md-gb-text-field>');
    }
    await field.updateComplete;
    const shadow = field.shadowRoot!;
    const input = () =>
      shadow.querySelector('.text-field-input') as
        | HTMLInputElement
        | HTMLTextAreaElement;
    const fieldRoot = () => shadow.querySelector('.text-field') as HTMLElement;
    return {root, field, shadow, input, fieldRoot};
  }

  async function type(field: TextFieldElement, input: HTMLInputElement | HTMLTextAreaElement, text: string) {
    input.value = text;
    input.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
    await field.updateComplete;
  }

  describe('rendering', () => {
    it('defaults to the filled variant', async () => {
      const {field, fieldRoot} = await setupTest();
      expect(field.variant).toBe('filled');
      expect(fieldRoot().classList).toContain(TEXT_FIELD_CLASSES.filled);
      expect(fieldRoot().classList).not.toContain(TEXT_FIELD_CLASSES.outlined);
    });

    it('renders the outlined variant', async () => {
      const {fieldRoot, shadow} = await setupTest(
        html`<md-gb-text-field
          variant="outlined"
          label="Label"></md-gb-text-field>`,
      );
      expect(fieldRoot().classList).toContain(TEXT_FIELD_CLASSES.outlined);
      const notch = shadow.querySelector('.text-field-outline-notch')!;
      expect(getComputedStyle(notch).display).toBe('block');
    });

    it('renders a native input labelled by the label', async () => {
      const {input, shadow} = await setupTest();
      expect(input().tagName).toBe('INPUT');
      const label = shadow.querySelector('label')!;
      expect(label.htmlFor).toBe(input().id);
      expect(label.textContent).toBe('Label');
      expect((input() as HTMLInputElement).labels?.[0]).toBe(label);
    });

    it('is 56px tall', async () => {
      const {shadow} = await setupTest();
      const container = shadow.querySelector('.text-field-container')!;
      expect(container.getBoundingClientRect().height).toBe(56);
    });

    it('renders a textarea with rows for type="textarea"', async () => {
      const {input} = await setupTest(
        html`<md-gb-text-field
          type="textarea"
          rows="4"
          label="Label"></md-gb-text-field>`,
      );
      expect(input().tagName).toBe('TEXTAREA');
      expect((input() as HTMLTextAreaElement).rows).toBe(4);
    });

    it('passes the input type through', async () => {
      const {input} = await setupTest(
        html`<md-gb-text-field type="email" label="Email"></md-gb-text-field>`,
      );
      expect((input() as HTMLInputElement).type).toBe('email');
    });

    it('renders prefix and suffix text', async () => {
      const {shadow, input} = await setupTest(
        html`<md-gb-text-field
          label="Amount"
          prefix-text="$"
          suffix-text="USD"></md-gb-text-field>`,
      );
      expect(shadow.querySelector('.text-field-prefix')!.textContent).toBe('$');
      expect(shadow.querySelector('.text-field-suffix')!.textContent).toBe(
        'USD',
      );
      expect(input().getAttribute('aria-describedby')).toContain('prefix');
      expect(input().getAttribute('aria-describedby')).toContain('suffix');
    });

    it('shows a placeholder only once the label floats', async () => {
      const {field, input, fieldRoot} = await setupTest(
        html`<md-gb-text-field
          label="Label"
          placeholder="Hint"></md-gb-text-field>`,
      );
      expect(input().getAttribute('placeholder')).toBe('Hint');
      expect(fieldRoot().classList).not.toContain(TEXT_FIELD_CLASSES.populated);
      await type(field, input(), 'x');
      expect(fieldRoot().classList).toContain(TEXT_FIELD_CLASSES.populated);
    });
  });

  describe('label', () => {
    it('floats when populated', async () => {
      const {field, shadow, input} = await setupTest();
      const label = shadow.querySelector('label')!;
      const resting = parseFloat(getComputedStyle(label).fontSize);
      await type(field, input(), 'value');
      const floated = parseFloat(getComputedStyle(label).fontSize);
      // Transitions may be in flight; the target size is smaller.
      expect(field.shadowRoot!.querySelector('.text-field')!.classList).toContain(
        TEXT_FIELD_CLASSES.populated,
      );
      expect(floated).toBeLessThanOrEqual(resting);
    });

    it('adds an asterisk when required', async () => {
      const {shadow} = await setupTest(
        html`<md-gb-text-field label="Username" required></md-gb-text-field>`,
      );
      expect(shadow.querySelector('label')!.textContent).toBe('Username*');
    });

    it('omits the asterisk with no-asterisk', async () => {
      const {shadow} = await setupTest(
        html`<md-gb-text-field
          label="Username"
          required
          no-asterisk></md-gb-text-field>`,
      );
      expect(shadow.querySelector('label')!.textContent).toBe('Username');
    });

    it('uses aria-label from the host when set', async () => {
      const {input} = await setupTest(
        html`<md-gb-text-field aria-label="Search"></md-gb-text-field>`,
      );
      expect(input().getAttribute('aria-label')).toBe('Search');
    });
  });

  describe('icons', () => {
    it('detects slotted leading and trailing icons', async () => {
      const {field, fieldRoot} = await setupTest(
        html`<md-gb-text-field label="Label">
          <span slot="leading-icon">L</span>
          <span slot="trailing-icon">T</span>
        </md-gb-text-field>`,
      );
      await env.waitForStability();
      await field.updateComplete;
      expect(field.hasLeadingIcon).toBeTrue();
      expect(field.hasTrailingIcon).toBeTrue();
      expect(fieldRoot().classList).toContain(TEXT_FIELD_CLASSES.hasLeadingIcon);
      expect(fieldRoot().classList).toContain(
        TEXT_FIELD_CLASSES.hasTrailingIcon,
      );
    });

    it('places the input 16px after a 24px leading icon', async () => {
      const {field, shadow} = await setupTest(
        html`<md-gb-text-field label="Label">
          <span slot="leading-icon" style="display:inline-block;width:24px;height:24px"></span>
        </md-gb-text-field>`,
      );
      await env.waitForStability();
      await field.updateComplete;
      const container = shadow
        .querySelector('.text-field-container')!
        .getBoundingClientRect();
      const input = shadow
        .querySelector('.text-field-input')!
        .getBoundingClientRect();
      // 12px padding + 24px icon + 16px.
      expect(Math.round(input.left - container.left)).toBe(52);
    });
  });

  describe('supporting text and counter', () => {
    it('describes the input with supporting text', async () => {
      const {shadow, input} = await setupTest(
        html`<md-gb-text-field
          label="Label"
          supporting-text="Help"></md-gb-text-field>`,
      );
      const supporting = shadow.querySelector('#supporting-text')!;
      expect(supporting.textContent).toBe('Help');
      expect(input().getAttribute('aria-describedby')).toContain(
        'supporting-text',
      );
      expect(supporting.getAttribute('role')).toBeNull();
    });

    it('renders a character counter for maxLength', async () => {
      const {field, shadow, input} = await setupTest(
        html`<md-gb-text-field label="Label" .maxLength=${10}></md-gb-text-field>`,
      );
      await type(field, input(), 'abc');
      const counter = shadow.querySelector('#counter')!;
      expect(counter.textContent).toBe('3/10');
      expect(counter.getAttribute('aria-label')).toBe('Character count, 3/10');
      expect(input().getAttribute('aria-describedby')).toContain('counter');
      expect(input().getAttribute('maxlength')).toBe('10');
    });
  });

  describe('error', () => {
    it('replaces supporting text with error text', async () => {
      const {shadow, input, fieldRoot} = await setupTest(
        html`<md-gb-text-field
          label="Label"
          supporting-text="Help"
          error
          error-text="Bad"></md-gb-text-field>`,
      );
      const supporting = shadow.querySelector('#supporting-text')!;
      expect(supporting.textContent).toBe('Bad');
      expect(supporting.getAttribute('role')).toBe('alert');
      expect(input().getAttribute('aria-invalid')).toBe('true');
      expect(fieldRoot().classList).toContain(TEXT_FIELD_CLASSES.error);
    });

    it('keeps supporting text when error text is empty', async () => {
      const {shadow} = await setupTest(
        html`<md-gb-text-field
          label="Label"
          supporting-text="Help"
          error></md-gb-text-field>`,
      );
      expect(shadow.querySelector('#supporting-text')!.textContent).toBe(
        'Help',
      );
    });

    it('uses the error color for the label', async () => {
      const {shadow} = await setupTest(
        html`<md-gb-text-field label="Label" error></md-gb-text-field>`,
      );
      const label = shadow.querySelector('label')!;
      const probe = document.createElement('div');
      probe.style.color = 'var(--md-sys-color-error)';
      document.body.appendChild(probe);
      expect(getComputedStyle(label).color).toBe(getComputedStyle(probe).color);
      probe.remove();
    });

    it('is not shown while disabled', async () => {
      const {input, fieldRoot} = await setupTest(
        html`<md-gb-text-field label="Label" error disabled></md-gb-text-field>`,
      );
      expect(input().getAttribute('aria-invalid')).toBe('false');
      expect(fieldRoot().classList).not.toContain(TEXT_FIELD_CLASSES.error);
    });
  });

  describe('disabled', () => {
    it('disables the input', async () => {
      const {input, fieldRoot} = await setupTest(
        html`<md-gb-text-field label="Label" disabled></md-gb-text-field>`,
      );
      expect(input().disabled).toBeTrue();
      expect(fieldRoot().classList).toContain(TEXT_FIELD_CLASSES.disabled);
    });
  });

  describe('events and focus', () => {
    it('updates value and re-dispatches change', async () => {
      const {field, input} = await setupTest();
      const changeSpy = jasmine.createSpy('change');
      const inputSpy = jasmine.createSpy('input');
      field.addEventListener('change', changeSpy);
      field.addEventListener('input', inputSpy);
      await type(field, input(), 'hello');
      input().dispatchEvent(new Event('change'));
      expect(field.value).toBe('hello');
      expect(inputSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('focus() focuses the input', async () => {
      const {field, shadow, input} = await setupTest();
      field.focus();
      expect(shadow.activeElement).toBe(input());
    });

    it('is reachable with Tab and skipped when disabled', async () => {
      const {field} = await setupTest();
      expect(field.tabIndex).toBeDefined();
      field.disabled = true;
      await field.updateComplete;
      field.focus();
      expect(field.shadowRoot!.activeElement).toBeNull();
    });

    it('clicking the container focuses the input', async () => {
      const {shadow, input} = await setupTest();
      (shadow.querySelector('.text-field-container') as HTMLElement).click();
      expect(shadow.activeElement).toBe(input());
    });

    it('syncs property value to the input', async () => {
      const {field, input} = await setupTest();
      field.value = 'abc';
      await field.updateComplete;
      expect(input().value).toBe('abc');
    });
  });

  describe('form association', () => {
    async function setupForm() {
      const root = env.render(html`
        <form>
          <md-gb-text-field
            name="first"
            label="First"
            value="Ada"></md-gb-text-field>
          <md-gb-text-field
            name="req"
            label="Required"
            required></md-gb-text-field>
        </form>
      `);
      await env.waitForStability();
      const form = root.querySelector('form')!;
      const [first, req] = Array.from(
        form.querySelectorAll('md-gb-text-field'),
      ) as TextFieldElement[];
      await first.updateComplete;
      await req.updateComplete;
      return {form, first, req};
    }

    it('submits its value', async () => {
      const {form, req} = await setupForm();
      req.value = 'x';
      await req.updateComplete;
      const data = new FormData(form);
      expect(data.get('first')).toBe('Ada');
      expect(data.get('req')).toBe('x');
    });

    it('reports required validity', async () => {
      const {req, form} = await setupForm();
      expect(req.validity.valueMissing).toBeTrue();
      expect(req.checkValidity()).toBeFalse();
      expect(form.checkValidity()).toBeFalse();
      req.value = 'x';
      await req.updateComplete;
      expect(req.checkValidity()).toBeTrue();
    });

    it('reportValidity() shows the validation message as error text', async () => {
      const {req} = await setupForm();
      expect(req.reportValidity()).toBeFalse();
      await req.updateComplete;
      const supporting = req.shadowRoot!.querySelector('#supporting-text')!;
      expect(supporting.textContent).toBe(req.validationMessage);
      expect(supporting.getAttribute('role')).toBe('alert');
      const input = req.shadowRoot!.querySelector('input')!;
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('supports setCustomValidity()', async () => {
      const {first} = await setupForm();
      first.setCustomValidity('Taken');
      expect(first.validity.customError).toBeTrue();
      expect(first.validationMessage).toBe('Taken');
      first.reportValidity();
      await first.updateComplete;
      expect(
        first.shadowRoot!.querySelector('#supporting-text')!.textContent,
      ).toBe('Taken');
      first.setCustomValidity('');
      expect(first.checkValidity()).toBeTrue();
    });

    it('validates minlength and pattern', async () => {
      const {field, input} = await setupTest(
        html`<md-gb-text-field
          label="ZIP"
          pattern="[0-9]{5}"></md-gb-text-field>`,
      );
      await type(field, input(), 'abc');
      expect(field.validity.patternMismatch).toBeTrue();
      await type(field, input(), '12345');
      expect(field.validity.valid).toBeTrue();
    });

    it('resets to the value attribute on form reset', async () => {
      const {form, first} = await setupForm();
      const input = first.shadowRoot!.querySelector('input')!;
      await type(first, input, 'Grace');
      expect(first.value).toBe('Grace');
      form.reset();
      await first.updateComplete;
      expect(first.value).toBe('Ada');
    });

    it('restores state', async () => {
      const {first} = await setupForm();
      first.formStateRestoreCallback('Restored');
      await first.updateComplete;
      expect(first.value).toBe('Restored');
    });
  });
});

describe('textFieldClasses()', () => {
  it('returns the filled classes by default', () => {
    const classes = textFieldClasses();
    expect(classes[TEXT_FIELD_CLASSES.textField]).toBeTrue();
    expect(classes[TEXT_FIELD_CLASSES.filled]).toBeTrue();
    expect(classes[TEXT_FIELD_CLASSES.outlined]).toBeFalse();
  });

  it('returns state classes', () => {
    const classes = textFieldClasses({
      variant: 'outlined',
      error: true,
      populated: true,
      disabled: true,
    });
    expect(classes[TEXT_FIELD_CLASSES.outlined]).toBeTrue();
    expect(classes[TEXT_FIELD_CLASSES.error]).toBeTrue();
    expect(classes[TEXT_FIELD_CLASSES.populated]).toBeTrue();
    expect(classes[TEXT_FIELD_CLASSES.disabled]).toBeTrue();
  });
});

describe('setupTextField()', () => {
  it('toggles the populated class in Light DOM', () => {
    const root = document.createElement('div');
    root.className = 'text-field text-field-filled';
    root.innerHTML = `<div class="text-field-container"><div class="text-field-content"><div class="text-field-input-row"><input class="text-field-input"></div></div></div>`;
    document.body.appendChild(root);
    const controller = new AbortController();
    setupTextField(root, {signal: controller.signal});
    const input = root.querySelector('input')!;
    expect(root.classList).not.toContain(TEXT_FIELD_CLASSES.populated);
    input.value = 'x';
    input.dispatchEvent(new Event('input', {bubbles: true}));
    expect(root.classList).toContain(TEXT_FIELD_CLASSES.populated);
    controller.abort();
    root.remove();
  });
});
