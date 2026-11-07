/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contract tests for the shared form layer
 * (`labs/gb/components/shared/form-field.ts` on `labs/behaviors`): each
 * component's form value, reset, state restore, required / validity,
 * reportValidity and fieldset-disabled behavior, proven through the real
 * element, a real `<form>` and real key presses.
 *
 * The M3 pages for these four components say little about forms, so the
 * checks cite the units they sit on: toggling on and off (checkbox, switch),
 * single selection of a radio group, the slider keyboard values, and each
 * Disabled state.
 *
 * Entry (`kind`: toggle | radio | slider | text | select | chips | segmented
 * | picker):
 * - tag / imports: the element and its side-effect modules.
 * - toggle: `state` (property and default attribute: `checked` or
 *   `selected`), `inner` (selector of the focusable control in the shadow
 *   root), `shownError` (whether `reportValidity()` also shows the error).
 * - spec: unit IDs per check (`value`, `reset`, `restore`, `required`,
 *   `error`, `disabled`, plus `group`, `scope` for radio).
 *
 * The single-value fields (`text`, `select`) share the value / default
 * value / dirty / error shown in place of the supporting text of
 * `ValueFieldController`; `select` entries also cover the autocomplete of
 * their directory (`autocomplete: {tag, imports, spec}`). `text` takes
 * `counter` (a character counter) and `children` (markup inside the
 * element). The selection groups (`chips`, `segmented`) submit the selected
 * values (`item`: markup of one item with `${VALUE}` and `${LABEL}`, `press`:
 * how an item is selected, always Space on the focused item).
 *
 * The `picker` kind (date and time picker) submits the committed value that
 * the person picks with real keys:
 * - attrs: attributes of every instance (name, label, quick, modal).
 * - initial: the default value, set with the `value` attribute.
 * - pick: TS statements that pick a different value with real keys (they use
 *   `f.el`, may `await`); the value ends up different from `initial`.
 * - validation: false when the element has no constraint validation (no
 *   `required`, `validity`).
 * - dirty: whether the `value` attribute is ignored after the person picked.
 * - shownError: selector of the element in the shadow root that gets the
 *   `error` state when `reportValidity()` finds the picker invalid (null:
 *   only the `invalid` event fires).
 * - innerDisabled: selector of a control in the shadow root that a disabled
 *   fieldset disables (null: none).
 */
export const entries = {
  checkbox: {
    kind: 'toggle',
    tag: 'md-gb-checkbox',
    imports: ['./md-gb-checkbox.js'],
    state: 'checked',
    inner: 'input',
    shownError: true,
    spec: {
      value: ['checkbox-bcef9e', 'checkbox-fb9c40'],
      reset: ['checkbox-bcef9e'],
      restore: ['checkbox-bcef9e'],
      required: ['checkbox-bcef9e'],
      error: ['checkbox-bcef9e'],
      disabled: ['checkbox-290f75'],
    },
  },
  switch: {
    kind: 'toggle',
    tag: 'md-gb-switch',
    imports: ['./md-gb-switch.js'],
    state: 'selected',
    inner: 'button',
    shownError: false,
    spec: {
      value: ['switch-305aa0', 'switch-66bd83', 'switch-e438f9'],
      reset: ['switch-305aa0'],
      restore: ['switch-305aa0'],
      required: ['switch-305aa0'],
      error: ['switch-305aa0'],
      disabled: ['switch-2b763e'],
    },
  },
  radio: {
    kind: 'radio',
    tag: 'md-gb-radio',
    imports: ['./md-gb-radio.js'],
    spec: {
      value: ['radio-button-68ee76', 'radio-button-822466', 'radio-button-4a92aa'],
      group: ['radio-button-68ee76', 'radio-button-822466', 'radio-button-663210', 'radio-button-b150b7', 'radio-button-45c957', 'radio-button-d939ba'],
      scope: ['radio-button-68ee76', 'radio-button-822466'],
      reset: ['radio-button-e9e213', 'radio-button-68ee76'],
      restore: ['radio-button-e9e213', 'radio-button-22e734'],
      required: ['radio-button-e9e213', 'radio-button-22e734'],
      disabled: ['radio-button-1541b5'],
    },
  },
  textfield: {
    kind: 'text',
    tag: 'md-gb-text-field',
    imports: ['./md-gb-text-field.js'],
    counter: true,
    spec: {
      value: [],
      reset: [],
      restore: [],
      required: ['text-fields-bb9bb0', 'text-fields-c95e3a'],
      error: ['text-fields-a273a8', 'text-fields-ff83d3', 'text-fields-f07a24', 'text-fields-f329f6'],
      counter: ['text-fields-647ded', 'text-fields-cf0f7a'],
      disabled: ['text-fields-70a237', 'text-fields-08ec44', 'text-fields-7c17c3', 'text-fields-d37c73'],
    },
  },
  select: {
    kind: 'select',
    tag: 'md-gb-select',
    imports: ['./md-gb-select.js', './md-gb-select-option.js', './md-gb-autocomplete.js'],
    spec: {
      value: ['menus-c16cb5', 'menus-6fe29e'],
      reset: ['menus-6fe29e'],
      restore: ['menus-6fe29e'],
      required: ['text-fields-bb9bb0', 'text-fields-c95e3a'],
      error: ['text-fields-a273a8', 'text-fields-ff83d3', 'text-fields-f07a24', 'text-fields-f329f6'],
      disabled: ['menus-6fe29e'],
    },
    autocomplete: {
      tag: 'md-gb-autocomplete',
      spec: {
        value: ['menus-8d4414'],
        reset: ['menus-8d4414'],
        restore: ['menus-8d4414'],
        required: ['text-fields-bb9bb0', 'text-fields-c95e3a'],
        error: ['text-fields-a273a8', 'text-fields-ff83d3', 'text-fields-f07a24', 'text-fields-f329f6'],
        disabled: ['menus-8d4414'],
      },
    },
  },
  chip: {
    kind: 'chips',
    tag: 'md-gb-chip-set',
    imports: ['./md-gb-chip-set.js', './md-gb-chip.js'],
    item: '<md-gb-chip type="filter" ${VALUE}>${LABEL}</md-gb-chip>',
    spec: {
      value: ['chips-3352ae'],
      reset: ['chips-3352ae'],
      restore: ['chips-3352ae'],
      required: ['chips-3352ae'],
      disabled: ['chips-d8aa2a'],
    },
  },
  segmentedbutton: {
    kind: 'segmented',
    tag: 'md-gb-segmented-button-set',
    imports: ['./md-gb-segmented-button-set.js', './md-gb-segmented-button.js'],
    item: '<md-gb-segmented-button ${VALUE}>${LABEL}</md-gb-segmented-button>',
    spec: {
      value: ['segmented-buttons-79f767', 'segmented-buttons-ad49bf'],
      reset: ['segmented-buttons-79f767', 'segmented-buttons-ad49bf'],
      restore: ['segmented-buttons-79f767', 'segmented-buttons-ad49bf'],
      required: ['segmented-buttons-79f767'],
      disabled: ['segmented-buttons-9bbe3e'],
    },
  },
  datepicker: {
    kind: 'picker',
    tag: 'md-gb-date-picker',
    imports: ['./md-gb-date-picker.js'],
    attrs: 'quick label="Date"',
    initial: '2025-08-17',
    other: '2025-09-02',
    pick: `await f.el.show();
  await settle();
  await press('ArrowRight');
  await press('Enter');`,
    dirty: true,
    shownError: 'md-gb-text-field',
    innerDisabled: '.date-picker-calendar-button',
    spec: {
      value: [],
      reset: [],
      restore: [],
      required: [],
      error: [],
      disabled: ['date-pickers-f856b3'],
    },
  },
  timepicker: {
    kind: 'picker',
    tag: 'md-gb-time-picker',
    imports: ['./md-gb-time-picker.js'],
    attrs: 'modal quick mode="input"',
    initial: '09:30',
    other: '11:15',
    pick: `await f.el.show();
  await settle();
  await press('ArrowUp');
  await press('Enter');`,
    dirty: false,
    shownError: null,
    innerDisabled: null,
    spec: {
      value: [],
      reset: [],
      restore: [],
      required: [],
      error: [],
      disabled: [],
    },
  },
  slider: {
    kind: 'slider',
    tag: 'md-gb-slider',
    imports: ['./md-gb-slider.js'],
    spec: {
      value: ['sliders-6c23ec', 'sliders-85ad1d'],
      range: ['sliders-6c23ec'],
      reset: ['sliders-6c23ec'],
      restore: ['sliders-6c23ec'],
      disabled: ['sliders-5f4ed8'],
    },
  },
};

const cite = (c, key) => (c.spec[key]?.length ? `    // spec: ${c.spec[key].join(', ')}\n` : '');

export function tests(dir, c) {
  const make = {
    toggle: toggleTests,
    radio: radioTests,
    slider: sliderTests,
    text: textTests,
    picker: pickerTests,
    select: selectTests,
    chips: groupTests,
    segmented: groupTests,
  }[c.kind];
  return make(dir, c);
}

/** Shared helpers of the form contract (names are unique in the file). */
const COMMON = `/** The form's entries, as submitted. */
function submittedEntries(form: HTMLFormElement) {
  return [...new FormData(form).entries()].map(([k, v]) => [k, String(v)]);
}`;

function toggleTests(dir, c) {
  const {tag, state, inner} = c;
  const setup = `${COMMON}

async function setupFormToggle(attrs: Record<string, string> = {}) {
  const root = await mount(html\`
    <form>
      <fieldset>
        <${tag} name="agree" aria-label="Agree"></${tag}>
      </fieldset>
    </form>
    <button id="after">After</button>
  \`);
  const el = root.querySelector<any>('${tag}')!;
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  await settle();
  return {
    el,
    form: root.querySelector('form')!,
    fieldset: root.querySelector('fieldset')!,
    after: root.querySelector<HTMLElement>('#after')!,
  };
}

/** Toggles with a real key press on the focused control. */
async function toggleFormByKey(el: HTMLElement) {
  el.focus();
  await press('Space');
}`;

  const cases = [];
  cases.push(`  it('submits the name and value while on and nothing while off', async () => {
${cite(c, 'value')}    const f = await setupFormToggle();
    expect(submittedEntries(f.form)).toEqual([]);
    await toggleFormByKey(f.el);
    expect(f.el.${state}).toBeTrue();
    expect(submittedEntries(f.form)).toEqual([['agree', 'on']]);
    await toggleFormByKey(f.el);
    expect(f.el.${state}).toBeFalse();
    expect(submittedEntries(f.form)).toEqual([]);
  });

  it('submits a custom value', async () => {
${cite(c, 'value')}    const f = await setupFormToggle({value: 'accepted'});
    f.el.${state} = true;
    await settle();
    expect(submittedEntries(f.form)).toEqual([['agree', 'accepted']]);
  });`);
  cases.push(`  it('starts in the default state set by the attribute', async () => {
${cite(c, 'reset')}    const f = await setupFormToggle({${state}: ''});
    expect(f.el.${state}).toBeTrue();
    expect(f.el.default${cap(state)}).toBeTrue();
    expect(submittedEntries(f.form)).toEqual([['agree', 'on']]);
  });

  it('resets to the default state', async () => {
${cite(c, 'reset')}    const on = await setupFormToggle({${state}: ''});
    await toggleFormByKey(on.el);
    expect(on.el.${state}).toBeFalse();
    on.form.reset();
    await settle();
    expect(on.el.${state}).toBeTrue();
    expect(submittedEntries(on.form)).toEqual([['agree', 'on']]);

    const off = await setupFormToggle();
    await toggleFormByKey(off.el);
    off.form.reset();
    await settle();
    expect(off.el.${state}).toBeFalse();
    expect(submittedEntries(off.form)).toEqual([]);
  });

  it('ignores the default attribute after the person changed it, until reset', async () => {
${cite(c, 'reset')}    const f = await setupFormToggle();
    await toggleFormByKey(f.el);
    f.el.removeAttribute('${state}');
    f.el.setAttribute('${state}', '');
    expect(f.el.${state}).toBeTrue();
    f.el.toggleAttribute('${state}', false);
    expect(f.el.${state}).toBeTrue();
    f.form.reset();
    await settle();
    f.el.setAttribute('${state}', '');
    await settle();
    expect(f.el.${state}).toBeTrue();
    expect(submittedEntries(f.form)).toEqual([['agree', 'on']]);
  });`);
  cases.push(`  it('restores the saved state', async () => {
${cite(c, 'restore')}    const f = await setupFormToggle();
    f.el.formStateRestoreCallback('true', 'restore');
    await settle();
    expect(f.el.${state}).toBeTrue();
    expect(submittedEntries(f.form)).toEqual([['agree', 'on']]);
    f.el.formStateRestoreCallback('false', 'restore');
    await settle();
    expect(f.el.${state}).toBeFalse();
  });`);
  cases.push(`  it('is invalid while required and off, valid once on', async () => {
${cite(c, 'required')}    const f = await setupFormToggle({required: ''});
    expect(f.el.validity.valueMissing).toBeTrue();
    expect(f.el.checkValidity()).toBeFalse();
    expect(f.form.checkValidity()).toBeFalse();
    await toggleFormByKey(f.el);
    expect(f.el.validity.valid).toBeTrue();
    expect(f.form.checkValidity()).toBeTrue();
  });

  it('setCustomValidity() invalidates until cleared', async () => {
${cite(c, 'required')}    const f = await setupFormToggle();
    f.el.setCustomValidity('Not allowed');
    expect(f.el.validity.customError).toBeTrue();
    expect(f.el.validationMessage).toBe('Not allowed');
    expect(f.el.checkValidity()).toBeFalse();
    f.el.setCustomValidity('');
    expect(f.el.validity.valid).toBeTrue();
  });

  it('blocks a submit while invalid and lets it through once valid', async () => {
${cite(c, 'required')}    const f = await setupFormToggle({required: ''});
    let submitted = 0;
    f.form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitted++;
    });
    f.form.requestSubmit();
    expect(submitted).toBe(0);
    await toggleFormByKey(f.el);
    f.form.requestSubmit();
    expect(submitted).toBe(1);
  });`);
  cases.push(
    c.shownError
      ? `  it('reportValidity() fires invalid and shows the error until valid', async () => {
${cite(c, 'error')}    const f = await setupFormToggle({required: ''});
    const control = () => f.el.shadowRoot!.querySelector('${inner}')!;
    let invalid = 0;
    f.el.addEventListener('invalid', () => invalid++);
    expect(control().getAttribute('aria-invalid')).toBeNull();
    expect(f.el.reportValidity()).toBeFalse();
    await settle();
    expect(invalid).toBe(1);
    expect(control().getAttribute('aria-invalid')).toBe('true');
    expect(control().classList.contains('invalid')).toBeTrue();
    await toggleFormByKey(f.el);
    expect(control().getAttribute('aria-invalid')).toBeNull();
    expect(control().classList.contains('invalid')).toBeFalse();
  });

  it('shows the error when a submit is blocked', async () => {
${cite(c, 'error')}    const f = await setupFormToggle({required: ''});
    f.form.requestSubmit();
    await settle();
    expect(f.el.shadowRoot!.querySelector('${inner}')!.getAttribute('aria-invalid')).toBe('true');
  });`
      : `  it('reportValidity() fires invalid and reports false while required and off', async () => {
${cite(c, 'error')}    const f = await setupFormToggle({required: ''});
    let invalid = 0;
    f.el.addEventListener('invalid', () => invalid++);
    expect(f.el.reportValidity()).toBeFalse();
    expect(invalid).toBe(1);
    await toggleFormByKey(f.el);
    expect(f.el.reportValidity()).toBeTrue();
    expect(invalid).toBe(1);
  });`,
  );
  cases.push(`  it('follows a disabled fieldset, is left out of the form and recovers', async () => {
${cite(c, 'disabled')}    const f = await setupFormToggle();
    f.el.${state} = true;
    await settle();
    expect(f.el.disabled).toBeFalse();
    f.fieldset.disabled = true;
    await settle();
    expect(f.el.disabled).toBeTrue();
    expect((f.el.shadowRoot!.querySelector('${inner}') as HTMLInputElement).disabled).toBeTrue();
    expect(submittedEntries(f.form)).toEqual([]);
    f.fieldset.disabled = false;
    await settle();
    expect(f.el.disabled).toBeFalse();
    expect((f.el.shadowRoot!.querySelector('${inner}') as HTMLInputElement).disabled).toBeFalse();
    expect(submittedEntries(f.form)).toEqual([['agree', 'on']]);
  });

  it('does not toggle by key while a fieldset disables it', async () => {
${cite(c, 'disabled')}    const f = await setupFormToggle();
    f.fieldset.disabled = true;
    await settle();
    f.el.focus();
    await press('Space');
    expect(f.el.${state}).toBeFalse();
  });

  it('is not validated while disabled', async () => {
${cite(c, 'disabled')}    const f = await setupFormToggle({required: ''});
    f.fieldset.disabled = true;
    await settle();
    expect(f.el.willValidate).toBeFalse();
    expect(f.form.checkValidity()).toBeTrue();
  });`);

  return {
    tag,
    imports: c.imports,
    setup,
    describe: `describe('<${tag}> form contract (shared form layer)', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`,
  };
}

function cap(s) {
  return s[0].toUpperCase() + s.slice(1);
}

function radioTests(dir, c) {
  const {tag} = c;
  const setup = `${COMMON}

async function setupFormRadio(opts: {required?: boolean; checked?: number} = {}) {
  const radio = (i: number, form: string) =>
    html\`<${tag}
      name="size"
      value=\${form + i}
      aria-label=\${'Option ' + i}
      ?required=\${opts.required ?? false}></${tag}>\`;
  const root = await mount(html\`
    <form id="one">
      <fieldset>\${[0, 1, 2].map((i) => radio(i, 'a'))}</fieldset>
    </form>
    <form id="two">\${[0, 1, 2].map((i) => radio(i, 'b'))}</form>
    <button id="after">After</button>
  \`);
  const radios = (form: string) =>
    [...root.querySelectorAll<any>('#' + form + ' ${tag}')];
  if (opts.checked !== undefined) {
    radios('one')[opts.checked].setAttribute('checked', '');
  }
  await settle();
  return {
    root,
    a: radios('one'),
    b: radios('two'),
    formA: root.querySelector<HTMLFormElement>('#one')!,
    formB: root.querySelector<HTMLFormElement>('#two')!,
    fieldset: root.querySelector('fieldset')!,
  };
}

/** Focuses a radio and selects it with Space, on a real keyboard. */
async function selectFormRadio(radio: HTMLElement) {
  radio.focus();
  await press('Space');
}`;
  const cases = [];
  cases.push(`  it('submits only the selected radio of the group', async () => {
${cite(c, 'value')}    const f = await setupFormRadio();
    expect(submittedEntries(f.formA)).toEqual([]);
    await selectFormRadio(f.a[1]);
    expect(submittedEntries(f.formA)).toEqual([['size', 'a1']]);
    await selectFormRadio(f.a[2]);
    expect(submittedEntries(f.formA)).toEqual([['size', 'a2']]);
  });

  it('submits the radio that arrow keys selected', async () => {
${cite(c, 'value')}    const f = await setupFormRadio({checked: 0});
    f.a[0].focus();
    await press('ArrowDown');
    expect(submittedEntries(f.formA)).toEqual([['size', 'a1']]);
    await press('ArrowUp');
    await press('ArrowUp');
    expect(submittedEntries(f.formA)).toEqual([['size', 'a2']]);
  });`);
  cases.push(`  it('has at most one selected radio per group', async () => {
${cite(c, 'group')}    const f = await setupFormRadio();
    await selectFormRadio(f.a[0]);
    await selectFormRadio(f.a[2]);
    expect(f.a.map((r: any) => r.checked)).toEqual([false, false, true]);
  });

  it('scopes the group to its form: same name in two forms are independent', async () => {
${cite(c, 'scope')}    const f = await setupFormRadio();
    await selectFormRadio(f.a[1]);
    await selectFormRadio(f.b[2]);
    expect(f.a.map((r: any) => r.checked)).toEqual([false, true, false]);
    expect(f.b.map((r: any) => r.checked)).toEqual([false, false, true]);
    expect(submittedEntries(f.formA)).toEqual([['size', 'a1']]);
    expect(submittedEntries(f.formB)).toEqual([['size', 'b2']]);
    await selectFormRadio(f.a[0]);
    expect(f.b.map((r: any) => r.checked)).toEqual([false, false, true]);
  });`);
  cases.push(`  it('resets to the default selection, or to none', async () => {
${cite(c, 'reset')}    const f = await setupFormRadio({checked: 1});
    expect(submittedEntries(f.formA)).toEqual([['size', 'a1']]);
    await selectFormRadio(f.a[2]);
    expect(submittedEntries(f.formA)).toEqual([['size', 'a2']]);
    f.formA.reset();
    await settle();
    expect(f.a.map((r: any) => r.checked)).toEqual([false, true, false]);
    expect(submittedEntries(f.formA)).toEqual([['size', 'a1']]);

    const none = await setupFormRadio();
    await selectFormRadio(none.a[0]);
    none.formA.reset();
    await settle();
    expect(none.a.map((r: any) => r.checked)).toEqual([false, false, false]);
    expect(submittedEntries(none.formA)).toEqual([]);
  });

  it('resetting one form leaves the other form\\'s selection', async () => {
${cite(c, 'reset')}    const f = await setupFormRadio();
    await selectFormRadio(f.a[0]);
    await selectFormRadio(f.b[1]);
    f.formA.reset();
    await settle();
    expect(submittedEntries(f.formA)).toEqual([]);
    expect(submittedEntries(f.formB)).toEqual([['size', 'b1']]);
  });`);
  cases.push(`  it('restores the saved selection and unselects the group\\'s others', async () => {
${cite(c, 'restore')}    const f = await setupFormRadio({checked: 0});
    f.a[2].formStateRestoreCallback('true', 'restore');
    await settle();
    expect(f.a.map((r: any) => r.checked)).toEqual([false, false, true]);
    expect(submittedEntries(f.formA)).toEqual([['size', 'a2']]);
  });`);
  cases.push(`  it('is invalid while the group is required and none is selected', async () => {
${cite(c, 'required')}    const f = await setupFormRadio({required: true});
    expect(f.a[0].validity.valueMissing).toBeTrue();
    expect(f.formA.checkValidity()).toBeFalse();
    await selectFormRadio(f.a[1]);
    // The whole group is valid, not only the selected radio.
    expect(f.a.map((r: any) => r.validity.valid)).toEqual([true, true, true]);
    expect(f.formA.checkValidity()).toBeTrue();
    // The other form's group is still unselected and required.
    expect(f.formB.checkValidity()).toBeFalse();
  });

  it('is required when any radio of the group is required', async () => {
${cite(c, 'required')}    const f = await setupFormRadio();
    expect(f.formA.checkValidity()).toBeTrue();
    f.a[2].required = true;
    await settle();
    expect(f.a[0].validity.valueMissing).toBeTrue();
    expect(f.formA.checkValidity()).toBeFalse();
  });

  it('setCustomValidity() invalidates that radio until cleared', async () => {
${cite(c, 'required')}    const f = await setupFormRadio();
    f.a[0].setCustomValidity('Pick another');
    expect(f.a[0].validationMessage).toBe('Pick another');
    expect(f.formA.checkValidity()).toBeFalse();
    f.a[0].setCustomValidity('');
    expect(f.formA.checkValidity()).toBeTrue();
  });

  it('reportValidity() fires invalid on an unselected required group', async () => {
${cite(c, 'required')}    const f = await setupFormRadio({required: true});
    let invalid = 0;
    f.a[0].addEventListener('invalid', () => invalid++);
    expect(f.a[0].reportValidity()).toBeFalse();
    expect(invalid).toBe(1);
  });`);
  cases.push(`  it('follows a disabled fieldset, is left out of the form and recovers', async () => {
${cite(c, 'disabled')}    const f = await setupFormRadio({checked: 1});
    expect(f.a[1].disabled).toBeFalse();
    f.fieldset.disabled = true;
    await settle();
    expect(f.a.every((r: any) => r.disabled)).toBeTrue();
    expect(submittedEntries(f.formA)).toEqual([]);
    f.fieldset.disabled = false;
    await settle();
    expect(f.a.some((r: any) => r.disabled)).toBeFalse();
    expect(submittedEntries(f.formA)).toEqual([['size', 'a1']]);
  });

  it('does not select by key while a fieldset disables it', async () => {
${cite(c, 'disabled')}    const f = await setupFormRadio();
    f.fieldset.disabled = true;
    await settle();
    f.a[0].focus();
    await press('Space');
    expect(f.a[0].checked).toBeFalse();
  });`);
  return {
    tag,
    imports: c.imports,
    setup,
    describe: `describe('<${tag}> form contract (shared form layer)', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`,
  };
}

function sliderTests(dir, c) {
  const {tag} = c;
  const setup = `${COMMON}

async function setupFormSlider(attrs: Record<string, string> = {}) {
  const root = await mount(html\`
    <form>
      <fieldset>
        <${tag} name="volume" aria-label="Volume"></${tag}>
      </fieldset>
    </form>
  \`);
  const el = root.querySelector<any>('${tag}')!;
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  await settle();
  return {
    el,
    form: root.querySelector('form')!,
    fieldset: root.querySelector('fieldset')!,
  };
}`;
  const cases = [];
  cases.push(`  it('submits its name and value', async () => {
${cite(c, 'value')}    const f = await setupFormSlider();
    expect(submittedEntries(f.form)).toEqual([['volume', '50']]);
    f.el.setAttribute('value', '30');
    await settle();
    expect(submittedEntries(f.form)).toEqual([['volume', '30']]);
  });

  it('submits the value an arrow key and Home / End set', async () => {
${cite(c, 'value')}    const f = await setupFormSlider({value: '30'});
    f.el.focus();
    await press('ArrowRight');
    expect(submittedEntries(f.form)).toEqual([['volume', '31']]);
    await press('ArrowLeft');
    await press('ArrowLeft');
    expect(submittedEntries(f.form)).toEqual([['volume', '29']]);
    await press('End');
    expect(submittedEntries(f.form)).toEqual([['volume', '100']]);
    await press('Home');
    expect(submittedEntries(f.form)).toEqual([['volume', '0']]);
  });

  it('submits both handles of a range under name-start and name-end', async () => {
${cite(c, 'range')}    const f = await setupFormSlider({range: '', 'value-start': '20', 'value-end': '80', 'name-start': 'lo', 'name-end': 'hi'});
    expect(submittedEntries(f.form)).toEqual([['lo', '20'], ['hi', '80']]);
    f.el.focus();
    await press('ArrowRight');
    // The focused handle moves one step; the names stay.
    const moved = submittedEntries(f.form);
    expect(moved.map(([name]) => name)).toEqual(['lo', 'hi']);
    expect(moved.reduce((sum, [, v]) => sum + Number(v), 0)).toBe(101);
  });

  it('falls back to its name for both handles of a range', async () => {
${cite(c, 'range')}    const f = await setupFormSlider({range: '', 'value-start': '20', 'value-end': '80'});
    expect(submittedEntries(f.form)).toEqual([['volume', '20'], ['volume', '80']]);
  });`);
  cases.push(`  it('resets to the value attribute', async () => {
${cite(c, 'reset')}    const f = await setupFormSlider({value: '30'});
    f.el.focus();
    await press('ArrowRight');
    await press('ArrowRight');
    expect(submittedEntries(f.form)).toEqual([['volume', '32']]);
    f.form.reset();
    await settle();
    expect(f.el.value).toBe(30);
    expect(submittedEntries(f.form)).toEqual([['volume', '30']]);
  });

  it('resets a range to its value-start and value-end attributes', async () => {
${cite(c, 'reset')}    const f = await setupFormSlider({range: '', 'value-start': '20', 'value-end': '80', 'name-start': 'lo', 'name-end': 'hi'});
    f.el.focus();
    await press('ArrowRight');
    f.form.reset();
    await settle();
    expect(submittedEntries(f.form)).toEqual([['lo', '20'], ['hi', '80']]);
  });`);
  cases.push(`  it('restores a saved value and a saved range', async () => {
${cite(c, 'restore')}    const f = await setupFormSlider();
    f.el.formStateRestoreCallback('12', 'restore');
    await settle();
    expect(f.el.value).toBe(12);
    expect(f.el.range).toBeFalse();
    expect(submittedEntries(f.form)).toEqual([['volume', '12']]);
    f.el.formStateRestoreCallback([['volume', '10'], ['volume', '90']], 'restore');
    await settle();
    expect(f.el.range).toBeTrue();
    expect(submittedEntries(f.form)).toEqual([['volume', '10'], ['volume', '90']]);
  });`);
  cases.push(`  it('follows a disabled fieldset, is left out of the form and recovers', async () => {
${cite(c, 'disabled')}    const f = await setupFormSlider();
    expect(f.el.disabled).toBeFalse();
    f.fieldset.disabled = true;
    await settle();
    expect(f.el.disabled).toBeTrue();
    expect((f.el.shadowRoot!.querySelector('input') as HTMLInputElement).disabled).toBeTrue();
    expect(submittedEntries(f.form)).toEqual([]);
    f.fieldset.disabled = false;
    await settle();
    expect(f.el.disabled).toBeFalse();
    expect((f.el.shadowRoot!.querySelector('input') as HTMLInputElement).disabled).toBeFalse();
    expect(submittedEntries(f.form)).toEqual([['volume', '50']]);
  });

  it('does not change by key while a fieldset disables it', async () => {
${cite(c, 'disabled')}    const f = await setupFormSlider({value: '30'});
    f.fieldset.disabled = true;
    await settle();
    f.el.focus();
    await press('ArrowRight');
    expect(f.el.value).toBe(30);
  });`);
  return {
    tag,
    imports: c.imports,
    setup,
    describe: `describe('<${tag}> form contract (shared form layer)', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`,
  };
}

/** Spec citation of a check for any spec map. */
const citeIn = (spec, key) => (spec[key]?.length ? `    // spec: ${spec[key].join(', ')}\n` : '');

/**
 * Checks of a single-value text field: `<input>` based text field and the
 * autocomplete. `names` keeps the helpers of several fields in one file
 * apart.
 */
function textCases({tag, children, counter, spec}, names) {
  const {setupName, typeName} = names;
  const setup = `async function ${setupName}(attrs: Record<string, string> = {}) {
  const root = await mount(html\`
    <form>
      <fieldset>
        <${tag} name="q" label="Name" supporting-text="Enter your name">${children ?? ''}</${tag}>
      </fieldset>
    </form>
  \`);
  const el = root.querySelector<any>('${tag}')!;
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  await settle();
  return {
    el,
    form: root.querySelector('form')!,
    fieldset: root.querySelector('fieldset')!,
    input: () => (el.shadowRoot as ShadowRoot).querySelector<HTMLInputElement>('input')!,
    label: () => el.shadowRoot!.querySelector('.text-field-label')!.textContent!.trim(),
    /** The supporting or error text shown, one entry per element. */
    supporting: () =>
      [...el.shadowRoot!.querySelectorAll('.text-field-supporting-text')].map((e) => e.textContent!.trim()),
  };
}

/** Replaces the text by typing on a real keyboard. */
async function ${typeName}(el: any, text: string) {
  el.focus();
  el.select();
  await sendKeys({type: text});
  await settle();
}`;
  const s = (key) => citeIn(spec, key);
  const cases = [];
  cases.push(`  it('submits the typed text under its name', async () => {
${s('value')}    const f = await ${setupName}();
    await ${typeName}(f.el, 'Ada');
    expect(f.el.value).toBe('Ada');
    expect(submittedEntries(f.form)).toEqual([['q', 'Ada']]);
  });`);
  cases.push(`  it('shows the value attribute as the default and ignores it once edited, until reset', async () => {
${s('reset')}    const f = await ${setupName}({value: 'Ada'});
    expect(f.el.value).toBe('Ada');
    expect(f.el.defaultValue).toBe('Ada');
    expect(submittedEntries(f.form)).toEqual([['q', 'Ada']]);
    await ${typeName}(f.el, 'Bob');
    expect(submittedEntries(f.form)).toEqual([['q', 'Bob']]);
    f.el.setAttribute('value', 'Eve');
    await settle();
    expect(f.el.value).toBe('Bob');
    f.form.reset();
    await settle();
    expect(f.el.value).toBe('Eve');
    expect(submittedEntries(f.form)).toEqual([['q', 'Eve']]);
    f.el.setAttribute('value', 'Zed');
    await settle();
    expect(f.el.value).toBe('Zed');
  });

  it('resets to an empty value without a value attribute', async () => {
${s('reset')}    const f = await ${setupName}();
    await ${typeName}(f.el, 'Ada');
    f.form.reset();
    await settle();
    expect(f.el.value).toBe('');
    expect(f.input().value).toBe('');
  });`);
  cases.push(`  it('restores the saved value', async () => {
${s('restore')}    const f = await ${setupName}();
    f.el.formStateRestoreCallback('saved', 'restore');
    await settle();
    expect(f.el.value).toBe('saved');
    expect(f.input().value).toBe('saved');
    expect(submittedEntries(f.form)).toEqual([['q', 'saved']]);
  });`);
  cases.push(`  it('is invalid while required and empty, valid once typed, and marks the label', async () => {
${s('required')}    const f = await ${setupName}({required: ''});
    expect(f.label()).toBe('Name*');
    expect(f.el.validity.valueMissing).toBeTrue();
    expect(f.el.checkValidity()).toBeFalse();
    expect(f.form.checkValidity()).toBeFalse();
    await ${typeName}(f.el, 'Ada');
    expect(f.el.validity.valid).toBeTrue();
    expect(f.form.checkValidity()).toBeTrue();
  });

  it('setCustomValidity() invalidates until cleared', async () => {
${s('required')}    const f = await ${setupName}();
    f.el.setCustomValidity('Taken');
    expect(f.el.validity.customError).toBeTrue();
    expect(f.el.validationMessage).toBe('Taken');
    expect(f.form.checkValidity()).toBeFalse();
    f.el.setCustomValidity('');
    expect(f.el.validity.valid).toBeTrue();
  });

  it('blocks a submit while invalid and lets it through once valid', async () => {
${s('required')}    const f = await ${setupName}({required: ''});
    let submitted = 0;
    f.form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitted++;
    });
    f.form.requestSubmit();
    expect(submitted).toBe(0);
    await ${typeName}(f.el, 'Ada');
    f.form.requestSubmit();
    expect(submitted).toBe(1);
  });`);
  cases.push(`  it('reportValidity() replaces the supporting text with the error text until valid', async () => {
${s('error')}    const f = await ${setupName}({required: ''});
    let invalid = 0;
    f.el.addEventListener('invalid', () => invalid++);
    expect(f.supporting()).toEqual(['Enter your name']);
    expect(f.el.reportValidity()).toBeFalse();
    await settle();
    expect(invalid).toBe(1);
    const message = f.el.validationMessage;
    expect(message).not.toBe('');
    // One line of text: the error replaces the supporting text, not adds to it.
    expect(f.supporting()).toEqual([message]);
    expect(f.el.shadowRoot!.querySelector('[role="alert"]')!.textContent!.trim()).toBe(message);
    expect(f.input().getAttribute('aria-invalid')).toBe('true');
    await ${typeName}(f.el, 'Ada');
    expect(f.supporting()).toEqual(['Enter your name']);
    expect(f.el.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
    expect(f.input().getAttribute('aria-invalid')).toBe('false');
  });

  it('shows the error when a submit is blocked', async () => {
${s('error')}    const f = await ${setupName}({required: ''});
    f.form.requestSubmit();
    await settle();
    expect(f.supporting()).toEqual([f.el.validationMessage]);
    expect(f.input().getAttribute('aria-invalid')).toBe('true');
  });

  it('shows and follows a custom validity message', async () => {
${s('error')}    const f = await ${setupName}();
    f.el.setCustomValidity('Taken');
    expect(f.el.reportValidity()).toBeFalse();
    await settle();
    expect(f.supporting()).toEqual(['Taken']);
    f.el.setCustomValidity('Reserved');
    await settle();
    expect(f.supporting()).toEqual(['Reserved']);
    f.el.setCustomValidity('');
    await settle();
    expect(f.supporting()).toEqual(['Enter your name']);
  });

  it('prefers the error and error text the page sets', async () => {
${s('error')}    const f = await ${setupName}({required: '', error: '', 'error-text': 'Use your real name'});
    expect(f.supporting()).toEqual(['Use your real name']);
    expect(f.el.reportValidity()).toBeFalse();
    await settle();
    expect(f.supporting()).toEqual(['Use your real name']);
  });

  it('clears the error on form reset', async () => {
${s('error')}    const f = await ${setupName}({required: ''});
    f.el.reportValidity();
    await settle();
    expect(f.input().getAttribute('aria-invalid')).toBe('true');
    f.form.reset();
    await settle();
    expect(f.supporting()).toEqual(['Enter your name']);
    expect(f.input().getAttribute('aria-invalid')).toBe('false');
  });`);
  if (counter) {
    cases.push(`  it('counts the characters against the limit', async () => {
${s('counter')}    const f = await ${setupName}({maxlength: '10'});
    const counter = () => f.el.shadowRoot!.querySelector('.text-field-counter')!.textContent!.trim();
    expect(counter()).toBe('0/10');
    await ${typeName}(f.el, 'Ada');
    expect(counter()).toBe('3/10');
  });`);
  }
  cases.push(`  it('follows a disabled fieldset, is left out of the form and recovers', async () => {
${s('disabled')}    const f = await ${setupName}({value: 'Ada', required: ''});
    expect(f.el.disabled).toBeFalse();
    f.fieldset.disabled = true;
    await settle();
    expect(f.el.disabled).toBeTrue();
    expect(f.input().disabled).toBeTrue();
    expect(submittedEntries(f.form)).toEqual([]);
    expect(f.el.willValidate).toBeFalse();
    f.fieldset.disabled = false;
    await settle();
    expect(f.el.disabled).toBeFalse();
    expect(f.input().disabled).toBeFalse();
    expect(submittedEntries(f.form)).toEqual([['q', 'Ada']]);
    expect(f.el.willValidate).toBeTrue();
  });`);
  return {setup, cases};
}

function textTests(dir, c) {
  const {setup, cases} = textCases(c, {setupName: 'setupFormText', typeName: 'typeFormText'});
  return {
    tag: c.tag,
    imports: c.imports,
    setup: `${COMMON}\n\n${setup}`,
    describe: `describe('<${c.tag}> form contract (shared form layer)', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`,
  };
}

const OPTIONS = `
          <md-gb-select-option value="s">Small</md-gb-select-option>
          <md-gb-select-option value="m">Medium</md-gb-select-option>
          <md-gb-select-option value="l">Large</md-gb-select-option>
        `;

function selectTests(dir, c) {
  const {tag} = c;
  const s = (key) => citeIn(c.spec, key);
  const ac = textCases(
    {tag: c.autocomplete.tag, children: OPTIONS, counter: false, spec: c.autocomplete.spec},
    {setupName: 'setupFormAutocomplete', typeName: 'typeFormAutocomplete'},
  );
  const setup = `${COMMON}

async function setupFormSelect(attrs: Record<string, string> = {}, selected = -1) {
  const root = await mount(html\`
    <form>
      <fieldset>
        <${tag} name="size" label="Size" supporting-text="Pick one">
          <md-gb-select-option value="s" ?selected=\${selected === 0}>Small</md-gb-select-option>
          <md-gb-select-option value="m" ?selected=\${selected === 1}>Medium</md-gb-select-option>
          <md-gb-select-option value="l" ?selected=\${selected === 2}>Large</md-gb-select-option>
        </${tag}>
      </fieldset>
    </form>
  \`);
  const el = root.querySelector<any>('${tag}')!;
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  await settle();
  return {
    el,
    form: root.querySelector('form')!,
    fieldset: root.querySelector('fieldset')!,
    field: () => (el.shadowRoot as ShadowRoot).querySelector<HTMLElement>('[role="combobox"]')!,
    label: () => el.shadowRoot!.querySelector('.text-field-label')!.textContent!.trim(),
    /** The supporting or error text shown, one entry per element. */
    supporting: () =>
      [...el.shadowRoot!.querySelectorAll('.text-field-supporting-text')].map((e) => e.textContent!.trim()),
  };
}

/** Picks option \`index\` with real keys: open, go to the first, arrow down, Enter. */
async function pickFormSelect(el: HTMLElement, index: number) {
  el.focus();
  await press('Enter');
  await press('Home');
  for (let i = 0; i < index; i++) await press('ArrowDown');
  await press('Enter');
}

${ac.setup}`;
  const cases = [];
  cases.push(`  it('submits the value of the picked option under its name', async () => {
${s('value')}    const f = await setupFormSelect();
    await pickFormSelect(f.el, 1);
    expect(f.el.value).toBe('m');
    expect(submittedEntries(f.form)).toEqual([['size', 'm']]);
    await pickFormSelect(f.el, 2);
    expect(submittedEntries(f.form)).toEqual([['size', 'l']]);
  });`);
  cases.push(`  it('starts on the option with the selected attribute and resets to it', async () => {
${s('reset')}    const f = await setupFormSelect({}, 1);
    expect(f.el.value).toBe('m');
    expect(submittedEntries(f.form)).toEqual([['size', 'm']]);
    await pickFormSelect(f.el, 2);
    expect(submittedEntries(f.form)).toEqual([['size', 'l']]);
    f.form.reset();
    await settle();
    expect(f.el.value).toBe('m');
    expect(submittedEntries(f.form)).toEqual([['size', 'm']]);
  });

  it('resets to no selection without a selected attribute', async () => {
${s('reset')}    const f = await setupFormSelect();
    await pickFormSelect(f.el, 0);
    expect(f.el.value).toBe('s');
    f.form.reset();
    await settle();
    expect(f.el.value).toBe('');
    expect(f.el.displayText).toBe('');
  });`);
  cases.push(`  it('restores the saved value', async () => {
${s('restore')}    const f = await setupFormSelect();
    f.el.formStateRestoreCallback('l', 'restore');
    await settle();
    expect(f.el.value).toBe('l');
    expect(f.el.displayText).toBe('Large');
    expect(submittedEntries(f.form)).toEqual([['size', 'l']]);
  });`);
  cases.push(`  it('is invalid while required and empty, valid once picked, and marks the label', async () => {
${s('required')}    const f = await setupFormSelect({required: ''});
    expect(f.label()).toBe('Size*');
    expect(f.el.validity.valueMissing).toBeTrue();
    expect(f.form.checkValidity()).toBeFalse();
    await pickFormSelect(f.el, 0);
    expect(f.el.validity.valid).toBeTrue();
    expect(f.form.checkValidity()).toBeTrue();
  });

  it('setCustomValidity() invalidates until cleared', async () => {
${s('required')}    const f = await setupFormSelect();
    f.el.setCustomValidity('Sold out');
    expect(f.el.validity.customError).toBeTrue();
    expect(f.el.validationMessage).toBe('Sold out');
    expect(f.form.checkValidity()).toBeFalse();
    f.el.setCustomValidity('');
    expect(f.el.validity.valid).toBeTrue();
  });

  it('blocks a submit while invalid and lets it through once valid', async () => {
${s('required')}    const f = await setupFormSelect({required: ''});
    let submitted = 0;
    f.form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitted++;
    });
    f.form.requestSubmit();
    expect(submitted).toBe(0);
    await pickFormSelect(f.el, 1);
    f.form.requestSubmit();
    expect(submitted).toBe(1);
  });`);
  cases.push(`  it('reportValidity() replaces the supporting text with the error text until valid', async () => {
${s('error')}    const f = await setupFormSelect({required: ''});
    let invalid = 0;
    f.el.addEventListener('invalid', () => invalid++);
    expect(f.supporting()).toEqual(['Pick one']);
    expect(f.el.reportValidity()).toBeFalse();
    await settle();
    expect(invalid).toBe(1);
    const message = f.el.validationMessage;
    expect(message).not.toBe('');
    // One line of text: the error replaces the supporting text, not adds to it.
    expect(f.supporting()).toEqual([message]);
    expect(f.el.shadowRoot!.querySelector('[role="alert"]')!.textContent!.trim()).toBe(message);
    expect(f.field().getAttribute('aria-invalid')).toBe('true');
    await pickFormSelect(f.el, 0);
    expect(f.supporting()).toEqual(['Pick one']);
    expect(f.el.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
    expect(f.field().getAttribute('aria-invalid')).toBe('false');
  });

  it('shows the error when a submit is blocked', async () => {
${s('error')}    const f = await setupFormSelect({required: ''});
    f.form.requestSubmit();
    await settle();
    expect(f.supporting()).toEqual([f.el.validationMessage]);
    expect(f.field().getAttribute('aria-invalid')).toBe('true');
  });

  it('prefers the error and error text the page sets', async () => {
${s('error')}    const f = await setupFormSelect({required: '', error: '', 'error-text': 'Choose a size'});
    expect(f.supporting()).toEqual(['Choose a size']);
    expect(f.el.reportValidity()).toBeFalse();
    await settle();
    expect(f.supporting()).toEqual(['Choose a size']);
  });

  it('clears the error on form reset', async () => {
${s('error')}    const f = await setupFormSelect({required: ''});
    f.el.reportValidity();
    await settle();
    expect(f.field().getAttribute('aria-invalid')).toBe('true');
    f.form.reset();
    await settle();
    expect(f.supporting()).toEqual(['Pick one']);
    expect(f.field().getAttribute('aria-invalid')).toBe('false');
  });`);
  cases.push(`  it('follows a disabled fieldset, is left out of the form and recovers', async () => {
${s('disabled')}    const f = await setupFormSelect({required: ''}, 1);
    expect(f.el.disabled).toBeFalse();
    f.fieldset.disabled = true;
    await settle();
    expect(f.el.disabled).toBeTrue();
    expect(f.field().getAttribute('aria-disabled')).toBe('true');
    expect(submittedEntries(f.form)).toEqual([]);
    expect(f.el.willValidate).toBeFalse();
    f.el.focus();
    await press('Enter');
    expect(f.el.open).toBeFalse();
    f.fieldset.disabled = false;
    await settle();
    expect(f.el.disabled).toBeFalse();
    expect(f.field().getAttribute('aria-disabled')).toBe('false');
    expect(submittedEntries(f.form)).toEqual([['size', 'm']]);
    expect(f.el.willValidate).toBeTrue();
  });`);
  return {
    tag,
    imports: c.imports,
    setup,
    describe: `describe('<${tag}> form contract (shared form layer)', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});

describe('<${c.autocomplete.tag}> form contract (shared form layer)', () => {
  afterEach(() => container?.remove());

${ac.cases.join('\n\n')}
});`,
  };
}

/** Chip set and segmented set: the selected values are the form value. */
function groupTests(dir, c) {
  const {tag} = c;
  const chips = c.kind === 'chips';
  const s = (key) => citeIn(c.spec, key);
  const values = chips ? ['a', 'b', null] : ['a', 'b', 'c'];
  const labels = ['Alpha', 'Beta', 'Gamma'];
  // A chip without a value submits its label.
  const submitted = chips ? ['a', 'b', 'Gamma'] : ['a', 'b', 'c'];
  const items = labels
    .map((label, i) =>
      c.item
        .replace('${VALUE}', `${values[i] ? `value="${values[i]}" ` : ''}?selected=\${on.includes(${i})} ?disabled=\${off.includes(${i})}`)
        .replace('${LABEL}', label),
    )
    .join('\n        ');
  const multi = chips ? {} : {multiselect: ''};
  const single = chips ? {selection: 'single'} : {};
  const attrs = (o) => JSON.stringify(o).replace(/"/g, "'");
  // The mode is set before the items are slotted, as a page's markup does.
  const mode = chips
    ? 'selection=\${attrs[\'selection\'] ?? \'multiple\'}'
    : '?multiselect=\${\'multiselect\' in attrs}';
  const setup = `${COMMON}

async function setupFormGroup(
  attrs: Record<string, string> = {},
  on: number[] = [],
  off: number[] = [],
) {
  const root = await mount(html\`
    <form>
      <fieldset>
        <${tag} name="pick" aria-label="Pick" ${mode} ?required=\${'required' in attrs}>
        ${items}
        </${tag}>
      </fieldset>
    </form>
  \`);
  const el = root.querySelector<any>('${tag}')!;
  await settle();
  return {
    el,
    form: root.querySelector('form')!,
    fieldset: root.querySelector('fieldset')!,
    items: [...el.children] as any[],
  };
}

/** Selects or unselects item \`index\` with Space on the focused item. */
async function toggleFormGroup(f: {items: HTMLElement[]}, index: number) {
  f.items[index].focus();
  await press('Space');
}`;
  const cases = [];
  cases.push(`  it('submits one entry per selected item under the name of the set', async () => {
${s('value')}    const f = await setupFormGroup(${attrs(multi)});
    expect(submittedEntries(f.form)).toEqual([]);
    await toggleFormGroup(f, 0);
    await toggleFormGroup(f, 2);
    expect(f.el.values).toEqual(['a', '${submitted[2]}']);
    expect(submittedEntries(f.form)).toEqual([['pick', 'a'], ['pick', '${submitted[2]}']]);
    await toggleFormGroup(f, 0);
    expect(submittedEntries(f.form)).toEqual([['pick', '${submitted[2]}']]);
  });

  it('submits only the selected item of a single-select set', async () => {
${s('value')}    const f = await setupFormGroup(${attrs(single)});
    await toggleFormGroup(f, 0);
    await toggleFormGroup(f, 1);
    expect(f.el.value).toBe('b');
    expect(submittedEntries(f.form)).toEqual([['pick', 'b']]);
  });${
    chips
      ? `

  it('submits the label of a chip without a value', async () => {
${s('value')}    const f = await setupFormGroup(${attrs(single)});
    await toggleFormGroup(f, 2);
    expect(submittedEntries(f.form)).toEqual([['pick', 'Gamma']]);
  });`
      : ''
  }`);
  cases.push(`  it('starts with the selected items and resets to them', async () => {
${s('reset')}    const f = await setupFormGroup(${attrs(multi)}, [0, 2]);
    expect(submittedEntries(f.form)).toEqual([['pick', 'a'], ['pick', '${submitted[2]}']]);
    await toggleFormGroup(f, 1);
    await toggleFormGroup(f, 0);
    expect(submittedEntries(f.form)).toEqual([['pick', 'b'], ['pick', '${submitted[2]}']]);
    f.form.reset();
    await settle();
    expect(f.items.map((item) => item.selected)).toEqual([true, false, true]);
    expect(submittedEntries(f.form)).toEqual([['pick', 'a'], ['pick', '${submitted[2]}']]);
  });

  it('resets a single-select set to its default or to none', async () => {
${s('reset')}    const f = await setupFormGroup(${attrs(single)}, [1]);
    await toggleFormGroup(f, 0);
    expect(submittedEntries(f.form)).toEqual([['pick', 'a']]);
    f.form.reset();
    await settle();
    expect(submittedEntries(f.form)).toEqual([['pick', 'b']]);

    const none = await setupFormGroup(${attrs(single)});
    await toggleFormGroup(none, 0);
    none.form.reset();
    await settle();
    expect(none.items.map((item) => item.selected)).toEqual([false, false, false]);
    expect(submittedEntries(none.form)).toEqual([]);
  });`);
  cases.push(`  it('restores the saved selection', async () => {
${s('restore')}    const f = await setupFormGroup(${attrs(multi)}, [0]);
    const saved = new FormData();
    saved.append('pick', 'b');
    saved.append('pick', '${submitted[2]}');
    f.el.formStateRestoreCallback(saved, 'restore');
    await settle();
    expect(f.items.map((item) => item.selected)).toEqual([false, true, true]);
    expect(submittedEntries(f.form)).toEqual([['pick', 'b'], ['pick', '${submitted[2]}']]);
    f.el.formStateRestoreCallback(null, 'restore');
    await settle();
    expect(submittedEntries(f.form)).toEqual([]);
  });

  it('restores a saved single value', async () => {
${s('restore')}    const f = await setupFormGroup(${attrs(single)});
    f.el.formStateRestoreCallback('b', 'restore');
    await settle();
    expect(f.items.map((item) => item.selected)).toEqual([false, true, false]);
    expect(submittedEntries(f.form)).toEqual([['pick', 'b']]);
  });`);
  cases.push(
    chips
      ? `  it('is invalid while required and nothing can be selected, valid otherwise', async () => {
${s('required')}    const none = await setupFormGroup({selection: 'single', required: ''}, [], [0, 1, 2]);
    expect(none.el.validity.valueMissing).toBeTrue();
    expect(none.form.checkValidity()).toBeFalse();
    // A required single-select set keeps one chip selected.
    const f = await setupFormGroup({selection: 'single', required: ''});
    expect(f.items.filter((item) => item.selected).length).toBe(1);
    expect(f.el.validity.valid).toBeTrue();
    expect(f.form.checkValidity()).toBeTrue();
  });`
      : `  it('is invalid while required and nothing is selected, valid once selected', async () => {
${s('required')}    const f = await setupFormGroup({required: ''});
    expect(f.el.validity.valueMissing).toBeTrue();
    expect(f.form.checkValidity()).toBeFalse();
    await toggleFormGroup(f, 1);
    expect(f.el.validity.valid).toBeTrue();
    expect(f.form.checkValidity()).toBeTrue();
    // The selected segment can't be unselected, so the set stays valid.
    await toggleFormGroup(f, 1);
    expect(f.form.checkValidity()).toBeTrue();
  });

  it('does not require a selection in a multi-select set', async () => {
${s('required')}    const f = await setupFormGroup({required: '', multiselect: ''});
    expect(f.form.checkValidity()).toBeTrue();
  });`,
  );
  cases.push(`  it('setCustomValidity() invalidates until cleared', async () => {
${s('required')}    const f = await setupFormGroup();
    f.el.setCustomValidity('Pick two');
    expect(f.el.validity.customError).toBeTrue();
    expect(f.el.validationMessage).toBe('Pick two');
    expect(f.form.checkValidity()).toBeFalse();
    f.el.setCustomValidity('');
    expect(f.el.validity.valid).toBeTrue();
  });

  it('blocks a submit while invalid and lets it through once valid', async () => {
${s('required')}    const f = await setupFormGroup(${chips ? "{selection: 'single', required: ''}, [], [0, 1, 2]" : "{required: ''}"});
    let submitted = 0;
    f.form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitted++;
    });
    f.form.requestSubmit();
    expect(submitted).toBe(0);
    ${chips ? "f.el.setAttribute('selection', 'multiple');" : 'await toggleFormGroup(f, 0);'}
    await settle();
    f.form.requestSubmit();
    expect(submitted).toBe(1);
  });`);
  cases.push(`  it('follows a disabled fieldset, is left out of the form and recovers', async () => {
${s('disabled')}    const f = await setupFormGroup(${attrs(multi)}, [0]);
    expect(f.el.disabled).toBeFalse();
    f.fieldset.disabled = true;
    await settle();
    expect(f.el.disabled).toBeTrue();
    expect(f.items.every((item) => item.effectivelyDisabled)).toBeTrue();
    expect(submittedEntries(f.form)).toEqual([]);
    await toggleFormGroup(f, 1);
    expect(f.items.map((item) => item.selected)).toEqual([true, false, false]);
    f.fieldset.disabled = false;
    await settle();
    expect(f.el.disabled).toBeFalse();
    expect(f.items.some((item) => item.effectivelyDisabled)).toBeFalse();
    expect(submittedEntries(f.form)).toEqual([['pick', 'a']]);
    await toggleFormGroup(f, 1);
    expect(submittedEntries(f.form)).toEqual([['pick', 'a'], ['pick', 'b']]);
  });

  it('keeps an item that is disabled itself disabled after the set recovers', async () => {
${s('disabled')}    const f = await setupFormGroup(${attrs(multi)}, [], [2]);
    f.fieldset.disabled = true;
    await settle();
    f.fieldset.disabled = false;
    await settle();
    expect(f.items.map((item) => item.effectivelyDisabled)).toEqual([false, false, true]);
  });`);
  return {
    tag,
    imports: c.imports,
    setup,
    describe: `describe('<${tag}> form contract (shared form layer)', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`,
  };
}

function pickerTests(dir, c) {
  const {tag} = c;
  const s = (key) => citeIn(c.spec, key);
  const inner = (expected) =>
    c.innerDisabled
      ? `
    expect((f.el.shadowRoot!.querySelector('${c.innerDisabled}') as HTMLButtonElement).disabled).to${expected ? 'BeTrue' : 'BeFalse'}();`
      : '';
  const setup = `${COMMON}

async function setupFormPicker(attrs: Record<string, string> = {}) {
  const root = await mount(html\`
    <form>
      <fieldset>
        <${tag} name="when" ${c.attrs}></${tag}>
      </fieldset>
    </form>
  \`);
  const el = root.querySelector<any>('${tag}')!;
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  await settle();
  return {
    el,
    form: root.querySelector('form')!,
    fieldset: root.querySelector('fieldset')!,
  };
}

/** Picks a different value with real keys. */
async function pickFormPicker(f: {el: any}) {
  ${c.pick}
  await settle();
}`;
  const cases = [];
  cases.push(`  it('submits the picked value under its name, and nothing before', async () => {
${s('value')}    const f = await setupFormPicker();
    expect(f.el.value).toBe('');
    expect(submittedEntries(f.form)).toEqual([]);
    await pickFormPicker(f);
    expect(f.el.value).not.toBe('');
    expect(submittedEntries(f.form)).toEqual([['when', f.el.value]]);
  });`);
  cases.push(`  it('starts on the value attribute and resets to it', async () => {
${s('reset')}    const f = await setupFormPicker({value: '${c.initial}'});
    expect(f.el.value).toBe('${c.initial}');
    expect(submittedEntries(f.form)).toEqual([['when', '${c.initial}']]);
    await pickFormPicker(f);
    expect(f.el.value).not.toBe('${c.initial}');
    f.form.reset();
    await settle();
    expect(f.el.value).toBe('${c.initial}');
    expect(submittedEntries(f.form)).toEqual([['when', '${c.initial}']]);
  });`);
  if (c.dirty) {
    cases.push(`  it('ignores the value attribute after the person picked, until reset', async () => {
${s('reset')}    const f = await setupFormPicker({value: '${c.initial}'});
    await pickFormPicker(f);
    const picked = f.el.value;
    f.el.setAttribute('value', '${c.other}');
    await settle();
    expect(f.el.value).toBe(picked);
    f.form.reset();
    await settle();
    f.el.setAttribute('value', '${c.other}');
    await settle();
    expect(f.el.value).toBe('${c.other}');
  });`);
  }
  cases.push(`  it('restores the saved value', async () => {
${s('restore')}    const f = await setupFormPicker();
    f.el.formStateRestoreCallback('${c.initial}', 'restore');
    await settle();
    expect(f.el.value).toBe('${c.initial}');
    expect(submittedEntries(f.form)).toEqual([['when', '${c.initial}']]);
  });`);
  if (c.validation !== false) cases.push(`  it('is invalid while required and empty, valid once picked', async () => {
${s('required')}    const f = await setupFormPicker({required: ''});
    expect(f.el.validity.valueMissing).toBeTrue();
    expect(f.form.checkValidity()).toBeFalse();
    await pickFormPicker(f);
    expect(f.el.validity.valid).toBeTrue();
    expect(f.form.checkValidity()).toBeTrue();
  });

  it('setCustomValidity() invalidates until cleared', async () => {
${s('required')}    const f = await setupFormPicker();
    f.el.setCustomValidity('Not available');
    expect(f.el.validity.customError).toBeTrue();
    expect(f.el.validationMessage).toBe('Not available');
    expect(f.form.checkValidity()).toBeFalse();
    f.el.setCustomValidity('');
    expect(f.el.validity.valid).toBeTrue();
  });

  it('blocks a submit while invalid and lets it through once valid', async () => {
${s('required')}    const f = await setupFormPicker({required: ''});
    let submitted = 0;
    f.form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitted++;
    });
    f.form.requestSubmit();
    expect(submitted).toBe(0);
    await pickFormPicker(f);
    f.form.requestSubmit();
    expect(submitted).toBe(1);
  });`);
  if (c.validation !== false) cases.push(
    c.shownError
      ? `  it('reportValidity() fires invalid and shows the error until valid', async () => {
${s('error')}    const f = await setupFormPicker({required: ''});
    const shown = () => (f.el.shadowRoot!.querySelector('${c.shownError}') as any).error as boolean;
    let invalid = 0;
    f.el.addEventListener('invalid', () => invalid++);
    expect(shown()).toBeFalse();
    expect(f.el.reportValidity()).toBeFalse();
    await settle();
    expect(invalid).toBe(1);
    expect(shown()).toBeTrue();
    await pickFormPicker(f);
    expect(shown()).toBeFalse();
  });`
      : `  it('reportValidity() fires invalid and reports false while required and empty', async () => {
${s('error')}    const f = await setupFormPicker({required: ''});
    let invalid = 0;
    f.el.addEventListener('invalid', () => invalid++);
    expect(f.el.reportValidity()).toBeFalse();
    expect(invalid).toBe(1);
    await pickFormPicker(f);
    expect(f.el.reportValidity()).toBeTrue();
    expect(invalid).toBe(1);
  });`,
  );
  cases.push(`  it('follows a disabled fieldset, is left out of the form and recovers', async () => {
${s('disabled')}    const f = await setupFormPicker({value: '${c.initial}'});
    expect(f.el.disabled).toBeFalse();
    f.fieldset.disabled = true;
    await settle();
    expect(f.el.disabled).toBeTrue();${inner(true)}
    expect(submittedEntries(f.form)).toEqual([]);
    f.fieldset.disabled = false;
    await settle();
    expect(f.el.disabled).toBeFalse();${inner(false)}
    expect(submittedEntries(f.form)).toEqual([['when', '${c.initial}']]);
  });`);
  if (c.validation !== false) cases.push(`  it('is not validated while disabled', async () => {
${s('disabled')}    const f = await setupFormPicker({required: ''});
    f.fieldset.disabled = true;
    await settle();
    expect(f.el.willValidate).toBeFalse();
    expect(f.form.checkValidity()).toBeTrue();
  });`);
  return {
    tag,
    imports: c.imports,
    setup,
    describe: `describe('<${tag}> form contract (shared form layer)', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`,
  };
}
