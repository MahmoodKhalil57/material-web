/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement, render} from 'lit';
import {property} from 'lit/decorators.js';

import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '../../behaviors/constraint-validation.js';
import {mixinElementInternals} from '../../behaviors/element-internals.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '../../behaviors/form-associated.js';
import {CheckboxValidator} from '../../behaviors/validators/checkbox-validator.js';
import {
  FormDisabledController,
  FormScopedSelectionController,
  numberAttribute,
  parseNumberState,
  parseToggleState,
  rangeFormData,
  toggleFormState,
  toggleFormValue,
  ToggleFieldController,
} from './form-field.js';

const toggleBase = mixinConstraintValidation(
  mixinFormAssociated(mixinElementInternals(LitElement)),
);

/** A minimal two-state control on the shared form layer. */
class TestToggle extends toggleBase {
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  @property({type: Boolean}) on = false;
  @property({type: Boolean}) required = false;
  @property() value = 'on';

  readonly formDisabled = new FormDisabledController(this);
  readonly field = new ToggleFieldController(this, {
    attribute: 'checked',
    get: () => this.on,
    set: (on) => {
      this.on = on;
    },
  });

  protected override render() {
    return html`<input
      type="checkbox"
      .checked=${this.on}
      data-invalid=${this.field.invalid}
      @change=${this.toggle} />`;
  }

  toggle() {
    this.field.markDirty();
    this.on = !this.on;
  }

  override attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null,
  ) {
    if (this.field?.ignoresAttribute(name)) return;
    super.attributeChangedCallback(name, old, value);
  }

  override get disabled(): boolean {
    return super.disabled || !!this.formDisabled?.value;
  }
  override set disabled(disabled: boolean) {
    super.disabled = disabled;
  }
  override formDisabledCallback(disabled: boolean) {
    this.formDisabled.set(disabled);
  }
  override [getFormValue]() {
    return this.field ? this.field.formValue() : null;
  }
  override [getFormState]() {
    return this.field ? this.field.formState() : null;
  }
  override formResetCallback() {
    this.field.reset();
  }
  override formStateRestoreCallback(state: string) {
    this.field.restore(state);
  }
  override [createValidator]() {
    return new CheckboxValidator(() => ({
      checked: this.on,
      required: this.required,
    }));
  }
  override [getValidityAnchor]() {
    return this.shadowRoot?.querySelector('input') ?? null;
  }
}
customElements.define('test-form-toggle', TestToggle);

interface Radio extends HTMLElement {
  checked: boolean;
  readonly form: HTMLFormElement | null;
}

const radioBase = mixinFormAssociated(mixinElementInternals(LitElement));

/** A minimal radio on the form-scoped group. */
class TestRadio extends radioBase {
  @property({type: Boolean}) checked = false;
  readonly group = new FormScopedSelectionController(this as unknown as Radio);
  constructor() {
    super();
    this.addController(this.group);
  }
  protected override render() {
    return html`<slot></slot>`;
  }
}
customElements.define('test-form-radio', TestRadio);

let container: HTMLElement | undefined;

async function mount(template: unknown) {
  container?.remove();
  container = document.createElement('div');
  document.body.append(container);
  render(template as never, container);
  await settle();
  return container;
}

async function settle() {
  for (const el of container?.querySelectorAll('*') ?? []) {
    await (el as Partial<LitElement>).updateComplete;
  }
  // Selection controllers update siblings in a microtask.
  await new Promise((resolve) => setTimeout(resolve));
  for (const el of container?.querySelectorAll('*') ?? []) {
    await (el as Partial<LitElement>).updateComplete;
  }
}

function entries(form: HTMLFormElement) {
  return [...new FormData(form).entries()];
}

describe('toggle pure helpers', () => {
  // spec: checkbox-bcef9e, switch-305aa0
  it('submit the value while on and nothing while off', () => {
    expect(toggleFormValue(true, 'yes')).toBe('yes');
    expect(toggleFormValue(false, 'yes')).toBeNull();
  });

  // spec: checkbox-bcef9e, switch-305aa0
  it('save the state as text and read only "true" as on', () => {
    expect(toggleFormState(true)).toBe('true');
    expect(toggleFormState(false)).toBe('false');
    expect(parseToggleState('true')).toBeTrue();
    expect(parseToggleState('false')).toBeFalse();
    expect(parseToggleState(null)).toBeFalse();
    expect(parseToggleState('on')).toBeFalse();
  });
});

describe('slider number helpers', () => {
  it('numberAttribute() reads a number, or undefined when missing', () => {
    const el = document.createElement('div');
    el.setAttribute('value', '12');
    el.setAttribute('zero', '0');
    expect(numberAttribute(el, 'value')).toBe(12);
    expect(numberAttribute(el, 'zero')).toBe(0);
    expect(numberAttribute(el, 'missing')).toBeUndefined();
  });

  it('rangeFormData() has one entry per handle, in order', () => {
    const data = rangeFormData('lo', 20, 'hi', 80);
    expect([...data.entries()]).toEqual([
      ['lo', '20'],
      ['hi', '80'],
    ]);
  });

  it('parseNumberState() reads a single value and a range', () => {
    expect(parseNumberState('42')).toEqual([42]);
    expect(
      parseNumberState([
        ['lo', '20'],
        ['hi', '80'],
      ]),
    ).toEqual([20, 80]);
  });
});

describe('ToggleFieldController', () => {
  afterEach(() => container?.remove());

  async function setup(attrs = '') {
    const root = await mount(
      html`<form>
        <fieldset>
          <test-form-toggle name="agree"></test-form-toggle>
        </fieldset>
      </form>`,
    );
    const form = root.querySelector('form')!;
    const el = root.querySelector<TestToggle>('test-form-toggle')!;
    for (const part of attrs.split(' ').filter(Boolean)) {
      const [name, value = ''] = part.split('=');
      el.setAttribute(name, value);
    }
    await el.updateComplete;
    return {root, form, el, fieldset: root.querySelector('fieldset')!};
  }

  describe('form value', () => {
    // spec: checkbox-bcef9e, switch-305aa0
    it('submits the name and value while on, nothing while off', async () => {
      const {form, el} = await setup();
      expect(entries(form)).toEqual([]);
      el.toggle();
      await el.updateComplete;
      expect(entries(form)).toEqual([['agree', 'on']]);
      el.toggle();
      await el.updateComplete;
      expect(entries(form)).toEqual([]);
    });

    // spec: checkbox-bcef9e, switch-305aa0
    it('submits a custom value', async () => {
      const {form, el} = await setup();
      el.value = 'accepted';
      el.on = true;
      await el.updateComplete;
      expect(entries(form)).toEqual([['agree', 'accepted']]);
    });

    // spec: checkbox-bcef9e, switch-305aa0
    it('updates the form data synchronously, before the render', async () => {
      const {form, el} = await setup();
      el.on = true;
      expect(entries(form)).toEqual([['agree', 'on']]);
    });

    it('submits nothing without a name', async () => {
      const {form, el} = await setup();
      el.removeAttribute('name');
      el.on = true;
      await el.updateComplete;
      expect(entries(form)).toEqual([]);
    });
  });

  describe('default state and dirty flag', () => {
    // spec: checkbox-bcef9e, switch-305aa0
    it('defaultOn mirrors the attribute', async () => {
      const {el} = await setup();
      expect(el.field.defaultOn).toBeFalse();
      el.field.defaultOn = true;
      expect(el.hasAttribute('checked')).toBeTrue();
      el.field.defaultOn = false;
      expect(el.hasAttribute('checked')).toBeFalse();
    });

    it('ignores the default attribute once the person changed the state', async () => {
      const {el} = await setup();
      expect(el.field.ignoresAttribute('checked')).toBeFalse();
      el.toggle();
      expect(el.field.isDirty).toBeTrue();
      expect(el.field.ignoresAttribute('checked')).toBeTrue();
      expect(el.field.ignoresAttribute('name')).toBeFalse();
    });

    it('lets the default attribute through while untouched', async () => {
      const {el} = await setup();
      el.field.defaultOn = true;
      expect(el.field.isDirty).toBeFalse();
      expect(el.field.ignoresAttribute('checked')).toBeFalse();
    });
  });

  describe('reset', () => {
    // spec: checkbox-bcef9e, switch-305aa0
    it('form.reset() returns to the default state', async () => {
      const {form, el} = await setup('checked');
      // The attribute is a default; set the state to match.
      el.on = true;
      el.toggle();
      expect(el.on).toBeFalse();
      form.reset();
      await el.updateComplete;
      expect(el.on).toBeTrue();
      expect(entries(form)).toEqual([['agree', 'on']]);
    });

    // spec: checkbox-bcef9e, switch-305aa0
    it('resets to off without a default', async () => {
      const {form, el} = await setup();
      el.toggle();
      form.reset();
      await el.updateComplete;
      expect(el.on).toBeFalse();
      expect(entries(form)).toEqual([]);
    });

    it('clears the dirty flag so the default attribute applies again', async () => {
      const {form, el} = await setup();
      el.toggle();
      form.reset();
      expect(el.field.isDirty).toBeFalse();
      expect(el.field.ignoresAttribute('checked')).toBeFalse();
    });

    it('clears the shown error', async () => {
      const {form, el} = await setup();
      el.required = true;
      el.reportValidity();
      expect(el.field.invalid).toBeTrue();
      form.reset();
      expect(el.field.invalid).toBeFalse();
    });
  });

  describe('state restore', () => {
    // spec: checkbox-bcef9e, switch-305aa0
    it('saves the state as text', async () => {
      const {el} = await setup();
      expect(el[getFormState]()).toBe('false');
      el.on = true;
      expect(el[getFormState]()).toBe('true');
    });

    // spec: checkbox-bcef9e, switch-305aa0
    it('restores on and off from a saved state', async () => {
      const {form, el} = await setup();
      el.formStateRestoreCallback('true');
      await el.updateComplete;
      expect(el.on).toBeTrue();
      expect(entries(form)).toEqual([['agree', 'on']]);
      el.formStateRestoreCallback('false');
      expect(el.on).toBeFalse();
    });
  });

  describe('required and validity', () => {
    // spec: checkbox-bcef9e, switch-305aa0
    it('is invalid with valueMissing while required and off', async () => {
      const {el} = await setup();
      expect(el.validity.valid).toBeTrue();
      el.required = true;
      await el.updateComplete;
      expect(el.validity.valueMissing).toBeTrue();
      expect(el.checkValidity()).toBeFalse();
      expect(el.validationMessage).not.toBe('');
    });

    // spec: checkbox-bcef9e, switch-305aa0
    it('is valid once required and on', async () => {
      const {el} = await setup();
      el.required = true;
      el.toggle();
      await el.updateComplete;
      expect(el.validity.valid).toBeTrue();
      expect(el.checkValidity()).toBeTrue();
    });

    it('setCustomValidity() makes it invalid until cleared', async () => {
      const {el} = await setup();
      el.setCustomValidity('Not now');
      expect(el.validity.customError).toBeTrue();
      expect(el.validationMessage).toBe('Not now');
      expect(el.checkValidity()).toBeFalse();
      el.setCustomValidity('');
      expect(el.validity.valid).toBeTrue();
    });

    it('blocks form submission while invalid', async () => {
      const {form, el} = await setup();
      el.required = true;
      await el.updateComplete;
      expect(form.checkValidity()).toBeFalse();
      let submitted = false;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitted = true;
      });
      form.requestSubmit();
      expect(submitted).toBeFalse();
      el.toggle();
      await el.updateComplete;
      form.requestSubmit();
      expect(submitted).toBeTrue();
    });
  });

  describe('shown error', () => {
    // spec: checkbox-bcef9e
    it('shows after reportValidity() on an invalid control', async () => {
      const {el} = await setup();
      el.required = true;
      await el.updateComplete;
      expect(el.field.invalid).toBeFalse();
      let invalidEvents = 0;
      el.addEventListener('invalid', () => invalidEvents++);
      expect(el.reportValidity()).toBeFalse();
      expect(invalidEvents).toBe(1);
      expect(el.field.invalid).toBeTrue();
      await el.updateComplete;
      expect(
        el.shadowRoot!.querySelector('input')!.getAttribute('data-invalid'),
      ).toBe('true');
    });

    it('shows when a submit is blocked', async () => {
      const {form, el} = await setup();
      el.required = true;
      await el.updateComplete;
      form.requestSubmit();
      expect(el.field.invalid).toBeTrue();
    });

    it('hides as soon as the control is valid', async () => {
      const {el} = await setup();
      el.required = true;
      await el.updateComplete;
      el.reportValidity();
      expect(el.field.invalid).toBeTrue();
      el.toggle();
      await el.updateComplete;
      expect(el.field.invalid).toBeFalse();
    });

    it('does not show for a valid control', async () => {
      const {el} = await setup();
      expect(el.reportValidity()).toBeTrue();
      expect(el.field.invalid).toBeFalse();
    });

    it('stops listening when disconnected', async () => {
      const {el} = await setup();
      el.required = true;
      await el.updateComplete;
      const parent = el.parentElement!;
      el.remove();
      el.dispatchEvent(new Event('invalid'));
      expect(el.field.invalid).toBeFalse();
      parent.append(el);
    });
  });

  describe('disabled by a fieldset', () => {
    // spec: checkbox-290f75, switch-2b763e, radio-button-1541b5, sliders-5f4ed8
    it('follows the fieldset and is left out of the form data', async () => {
      const {form, el, fieldset} = await setup();
      el.on = true;
      await el.updateComplete;
      expect(el.disabled).toBeFalse();
      fieldset.disabled = true;
      await el.updateComplete;
      expect(el.disabled).toBeTrue();
      expect(entries(form)).toEqual([]);
      fieldset.disabled = false;
      await el.updateComplete;
      expect(el.disabled).toBeFalse();
      expect(entries(form)).toEqual([['agree', 'on']]);
    });

    // spec: checkbox-290f75, switch-2b763e, radio-button-1541b5, sliders-5f4ed8
    it('is not validated while disabled', async () => {
      const {el, fieldset} = await setup();
      el.required = true;
      fieldset.disabled = true;
      await el.updateComplete;
      expect(el.willValidate).toBeFalse();
      expect(el.checkValidity()).toBeTrue();
    });
  });
});

describe('FormScopedSelectionController', () => {
  afterEach(() => container?.remove());

  async function setup() {
    const root = await mount(html`
      <test-form-radio name="a" id="loose-1" checked></test-form-radio>
      <form id="one">
        <test-form-radio name="a" id="f1-a"></test-form-radio>
        <test-form-radio name="a" id="f1-b"></test-form-radio>
      </form>
      <form id="two">
        <test-form-radio name="a" id="f2-a"></test-form-radio>
        <test-form-radio name="a" id="f2-b"></test-form-radio>
      </form>
    `);
    const get = (id: string) => root.querySelector<TestRadio>(`#${id}`)!;
    return {root, get};
  }

  // spec: radio-button-68ee76, radio-button-822466
  it('groups radios of the same name and form', async () => {
    const {get} = await setup();
    expect(get('f1-a').group.controls.map((c) => c.id)).toEqual(['f1-a', 'f1-b']);
    expect(get('f2-b').group.controls.map((c) => c.id)).toEqual(['f2-a', 'f2-b']);
  });

  it('keeps radios outside any form in their own group', async () => {
    const {get} = await setup();
    expect(get('loose-1').group.controls.map((c) => c.id)).toEqual(['loose-1']);
  });

  // spec: radio-button-68ee76, radio-button-822466
  it('checking one unchecks only its form siblings', async () => {
    const {get} = await setup();
    get('f1-a').checked = true;
    get('f2-a').checked = true;
    get('f1-a').group.handleCheckedChange();
    get('f2-a').group.handleCheckedChange();
    await settle();
    expect(get('f1-a').checked).toBeTrue();
    get('f1-b').checked = true;
    get('f1-b').group.handleCheckedChange();
    await settle();
    expect(get('f1-a').checked).toBeFalse();
    expect(get('f1-b').checked).toBeTrue();
    expect(get('f2-a').checked).toBeTrue();
    expect(get('loose-1').checked).toBeTrue();
  });

  it('does not group radios without a name', async () => {
    const root = await mount(html`<form>
      <test-form-radio id="x"></test-form-radio>
      <test-form-radio id="y"></test-form-radio>
    </form>`);
    const x = root.querySelector<TestRadio>('#x')!;
    expect(x.group.controls.map((c) => c.id)).toEqual(['x']);
  });
});
