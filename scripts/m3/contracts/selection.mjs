/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contract tests for the shared selection controller
 * (`components/shared/selection.ts`): each component's selection mode,
 * Space / Enter selection, `required`, ARIA state, events and form value,
 * proven through the real element and real key presses. The controller's own
 * rules are tested once in `shared/selection_test.ts`.
 *
 * Entry:
 * - imports: side-effect modules, relative to the component directory.
 * - fixture: group markup. `${ATTRS}` is replaced by the mode / required /
 *   name attributes, `${ITEMS}` by the items.
 * - item: one item's markup. `${LABEL}` is its label and value, `${EXTRA}` an
 *   attribute string (`disabled` where the test needs it).
 * - items: selector of the items inside the fixture.
 * - modes: group attributes for each selection mode the component has
 *   (`single`, `multiple`, `none`); `defaultMode` is the one tests use first.
 * - requiredAttr: the attribute that makes a single-select required. When
 *   `alwaysRequired`, the component always keeps one item selected (tabs,
 *   navigation bar) and has no such attribute.
 * - unselect: whether a single-select item can be unselected (not required).
 * - initial: `none`, or `first` when the component selects its first item.
 * - m3Styles: adopt the global M3 styles (tabs and the navigation bar need
 *   the tokens; without them the page crashes in anchor positioning).
 * - state: where the item's ARIA state lives: `{in: 'shadow', selector,
 *   attribute}` (a shadow root element), `{in: 'host', attribute}` or
 *   `{in: 'internals', attribute}` (ElementInternals, e.g. `aria-selected`);
 *   `absentInNone` when `none` mode has no state at all.
 * - roles: `{selector, single, multiple}`, the role of the item's control per
 *   mode.
 * - events: the events a user change dispatches on the group.
 * - disabled: the attribute that disables an item, if items can be disabled.
 * - form: `{name}` when the group is form-associated.
 * - spec: unit IDs per check: select, keys, multiple, none, required,
 *   unselect, aria, roles, events, disabled, form.
 */
export const entries = {
  buttongroup: {
    imports: ['./md-gb-button-group.js', '../button/md-gb-button.js'],
    fixture: '<md-gb-button-group aria-label="Text formatting"${ATTRS}>${ITEMS}</md-gb-button-group>',
    item: '<md-gb-button value="${LABEL}"${EXTRA}>${LABEL}</md-gb-button>',
    items: 'md-gb-button',
    modes: {single: 'selection="single"', multiple: 'selection="multiple"', none: 'selection="none"'},
    defaultMode: 'single',
    requiredAttr: 'required',
    unselect: true,
    initial: 'none',
    state: {in: 'shadow', selector: '[part="btn"]', attribute: 'aria-pressed', absentInNone: true},
    events: ['input', 'change'],
    disabled: 'disabled',
    spec: {
      select: ['button-groups-44ca7f', 'button-groups-8b0224'],
      keys: ['button-groups-257fef', 'button-groups-d2318f', 'button-groups-2138f9', 'button-groups-03dfe3'],
      multiple: ['button-groups-44ca7f', 'button-groups-8b0224'],
      none: [],
      required: ['button-groups-8b0224'],
      unselect: [],
      aria: ['button-groups-a9d07e'],
      events: [],
      disabled: [],
    },
  },
  segmentedbutton: {
    imports: ['./md-gb-segmented-button-set.js', './md-gb-segmented-button.js'],
    fixture: '<md-gb-segmented-button-set aria-label="View"${ATTRS}>${ITEMS}</md-gb-segmented-button-set>',
    item: '<md-gb-segmented-button value="${LABEL}"${EXTRA}>${LABEL}</md-gb-segmented-button>',
    items: 'md-gb-segmented-button',
    modes: {single: '', multiple: 'multiselect'},
    defaultMode: 'single',
    requiredAttr: 'required',
    unselect: true,
    initial: 'none',
    state: {in: 'shadow', selector: 'button', attribute: 'aria-checked'},
    roles: {selector: 'button', single: 'radio', multiple: 'checkbox'},
    events: ['input', 'change'],
    disabled: 'disabled',
    form: {name: 'view'},
    spec: {
      select: ['segmented-buttons-79f767', 'segmented-buttons-337f94', 'segmented-buttons-9e32e7'],
      keys: [
        'segmented-buttons-79dd8e',
        'segmented-buttons-8e637f',
        'segmented-buttons-01263b',
        'segmented-buttons-4e972d',
      ],
      multiple: [
        'segmented-buttons-ad49bf',
        'segmented-buttons-a6ff04',
        'segmented-buttons-244706',
        'segmented-buttons-160c2f',
        'segmented-buttons-44b2d9',
        'segmented-buttons-7fabff',
      ],
      required: [],
      unselect: ['segmented-buttons-79dd8e'],
      aria: ['segmented-buttons-5e14ea', 'segmented-buttons-3c4a1d'],
      roles: ['segmented-buttons-5e14ea', 'segmented-buttons-3c4a1d', 'segmented-buttons-7f895a'],
      events: [],
      disabled: [],
      form: [],
    },
  },
  chip: {
    imports: ['./md-gb-chip-set.js', './md-gb-chip.js'],
    fixture: '<md-gb-chip-set aria-label="Filters"${ATTRS}>${ITEMS}</md-gb-chip-set>',
    item: '<md-gb-chip type="filter"${EXTRA}>${LABEL}</md-gb-chip>',
    items: 'md-gb-chip',
    modes: {single: 'selection="single"', multiple: 'selection="multiple"', none: 'selection="none"'},
    defaultMode: 'multiple',
    requiredAttr: 'required',
    unselect: true,
    initial: 'none',
    state: {in: 'shadow', selector: 'button[part="chip"]', attribute: 'aria-pressed'},
    events: ['input', 'change'],
    disabled: 'disabled',
    spec: {
      select: ['chips-d48c6d', 'chips-38712d', 'chips-e76874'],
      keys: ['chips-cfa8a5', 'chips-b762ef'],
      multiple: ['chips-b762ef'],
      none: [],
      required: [],
      unselect: ['chips-cfa8a5', 'chips-b762ef'],
      aria: ['chips-d48c6d'],
      events: [],
      disabled: [],
    },
  },
  tabs: {
    imports: ['./md-gb-tabs.js', './md-gb-tab.js'],
    fixture: '<md-gb-tabs aria-label="Views"${ATTRS}>${ITEMS}</md-gb-tabs>',
    item: '<md-gb-tab${EXTRA}><span slot="label">${LABEL}</span></md-gb-tab>',
    items: 'md-gb-tab',
    modes: {single: ''},
    defaultMode: 'single',
    alwaysRequired: true,
    unselect: false,
    initial: 'first',
    m3Styles: true,
    state: {in: 'internals', attribute: 'aria-selected'},
    events: ['change'],
    spec: {
      select: ['tabs-0a5698'],
      keys: ['tabs-0a5698', 'tabs-85861b'],
      required: ['tabs-f32b3b'],
      aria: [],
      events: [],
    },
  },
  navbar: {
    imports: ['./md-gb-nav-bar.js', './md-gb-nav-bar-item.js'],
    fixture: '<md-gb-nav-bar aria-label="Main"${ATTRS}>${ITEMS}</md-gb-nav-bar>',
    item: '<md-gb-nav-bar-item${EXTRA}>${LABEL}</md-gb-nav-bar-item>',
    items: 'md-gb-nav-bar-item',
    modes: {single: ''},
    defaultMode: 'single',
    alwaysRequired: true,
    unselect: false,
    initial: 'first',
    m3Styles: true,
    state: {in: 'internals', attribute: 'aria-selected'},
    events: ['change'],
    disabled: 'disabled',
    spec: {
      select: ['navigation-bar-0d46a4'],
      keys: ['navigation-bar-0d46a4', 'navigation-bar-5077b0'],
      required: [],
      aria: [],
      events: [],
      disabled: [],
    },
  },
};

const LABELS = ['Alpha', 'Bravo', 'Charlie', 'Delta'];

const camel = (attribute) => attribute.replace(/-(\w)/g, (_, c) => c.toUpperCase());

/** Turns `${LABEL}` / `${EXTRA}` in a config string into template placeholders. */
const placeholders = (text) => text.replaceAll('${LABEL}', '${label}').replaceAll('${EXTRA}', '${extra}');

export function tests(dir, c) {
  const tag = c.fixture.match(/^<([\w-]+)/)[1];
  const cite = (key) => (c.spec[key]?.length ? `    // spec: ${c.spec[key].join(', ')}\n` : '');
  const L = LABELS;
  const modes = Object.keys(c.modes);
  const hasSingle = modes.includes('single');
  const hasMultiple = modes.includes('multiple');
  const hasNone = modes.includes('none');
  const attrs = Object.fromEntries(Object.entries(c.modes).map(([mode, attr]) => [mode, attr]));
  const required = c.requiredAttr || c.alwaysRequired;
  const stateAttr = c.state.attribute;
  const usesInternals = c.state.in === 'internals';

  // The ARIA value of one item, per where the component keeps it.
  const ariaRead =
    c.state.in === 'shadow'
      ? `item.shadowRoot!.querySelector('${c.state.selector}')?.getAttribute('${stateAttr}') ?? null`
      : c.state.in === 'host'
        ? `item.getAttribute('${stateAttr}')`
        : `(item as unknown as Record<symbol, Record<string, string | null>>)[internals]['${camel(stateAttr)}']`;

  const cases = [];

  if (hasSingle) {
    cases.push(`  it('selects the clicked item and unselects the previous one (single-select)', async () => {
${cite('select')}    const f = await setupSelection({mode: 'single'});
    f.items[1].click();
    await settle();
    expect(selectedLabels(f)).toEqual(['${L[1]}']);
    f.items[2].click();
    await settle();
    expect(selectedLabels(f)).toEqual(['${L[2]}']);
  });`);

    cases.push(`  it('selects the focused item with Space and with Enter', async () => {
${cite('keys')}    const f = await setupSelection({mode: 'single'});
    await focusItem(f, 1);
    await press('Space');
    expect(selectedLabels(f)).toEqual(['${L[1]}']);
    await focusItem(f, 2);
    await press('Enter');
    expect(selectedLabels(f)).toEqual(['${L[2]}']);
  });`);
  }

  if (c.initial === 'first') {
    cases.push(`  it('starts with the first item selected', async () => {
${cite('required')}    const f = await setupSelection({mode: 'single'});
    expect(selectedLabels(f)).toEqual(['${L[0]}']);
  });`);
  }

  if (hasMultiple) {
    cases.push(`  it('toggles items independently in multi-select', async () => {
${cite('multiple')}    const f = await setupSelection({mode: 'multiple'});
    f.items[0].click();
    f.items[2].click();
    await settle();
    expect(selectedLabels(f)).toEqual(['${L[0]}', '${L[2]}']);
    f.items[0].click();
    await settle();
    expect(selectedLabels(f)).toEqual(['${L[2]}']);
  });`);

    cases.push(`  it('selects and unselects the focused item with Space and Enter (multi-select)', async () => {
${cite('multiple')}    const f = await setupSelection({mode: 'multiple'});
    await focusItem(f, 0);
    await press('Space');
    await focusItem(f, 1);
    await press('Enter');
    expect(selectedLabels(f)).toEqual(['${L[0]}', '${L[1]}']);
    await focusItem(f, 0);
    await press('Space');
    expect(selectedLabels(f)).toEqual(['${L[1]}']);
    await focusItem(f, 1);
    await press('Enter');
    expect(selectedLabels(f)).toEqual([]);
  });`);

    cases.push(`  it('lets every item be selected, or none, in multi-select even when required', async () => {
${cite('multiple')}    const f = await setupSelection({mode: 'multiple'${c.requiredAttr ? ', required: true' : ''}});
    for (const item of f.items) item.click();
    await settle();
    expect(selectedLabels(f)).toEqual(SELECTION_LABELS);
    for (const item of f.items) item.click();
    await settle();
    expect(selectedLabels(f)).toEqual([]);
  });`);
  }

  if (hasNone) {
    cases.push(`  it('selects nothing and fires no events in none mode', async () => {
${cite('none')}    const f = await setupSelection({mode: 'none'});
    const log = recordSelectionEvents(f.group);
    f.items[1].click();
    await focusItem(f, 2);
    await press('Space');
    expect(selectedLabels(f)).toEqual([]);
    expect(log).toEqual([]);
  });`);
  }

  if (hasSingle && required) {
    cases.push(`  it('keeps the selected item selected when ${c.alwaysRequired ? 'it is clicked or activated again' : 'required'}, but still switches', async () => {
${cite('required')}    const f = await setupSelection({mode: 'single', required: true});
    f.items[1].click();
    await settle();
    f.items[1].click();
    await settle();
    expect(selectedLabels(f)).toEqual(['${L[1]}']);
    await focusItem(f, 1);
    await press('Space');
    await press('Enter');
    expect(selectedLabels(f)).toEqual(['${L[1]}']);
    f.items[3].click();
    await settle();
    expect(selectedLabels(f)).toEqual(['${L[3]}']);
  });`);
  }

  if (hasSingle && c.unselect) {
    cases.push(`  it('unselects the selected item when it is activated again (not required)', async () => {
${cite('unselect')}    const f = await setupSelection({mode: 'single'});
    f.items[1].click();
    await settle();
    f.items[1].click();
    await settle();
    expect(selectedLabels(f)).toEqual([]);
    await focusItem(f, 2);
    await press('Space');
    expect(selectedLabels(f)).toEqual(['${L[2]}']);
    await press('Enter');
    expect(selectedLabels(f)).toEqual([]);
  });`);
  }

  const none = c.initial === 'first' ? 'first' : 'none';
  const expectState = (pick) => `[${L.map((_, i) => (pick(i) === 'null' ? 'null' : `'${pick(i)}'`)).join(', ')}]`;
  cases.push(`  it('reflects the selection as ${stateAttr}${c.state.in === 'internals' ? ' (ElementInternals)' : ''} on each item', async () => {
${cite('aria')}    const f = await setupSelection({mode: '${hasSingle ? 'single' : c.defaultMode}'});
    expect(ariaStates(f)).toEqual(${none === 'first' ? expectState((i) => (i === 0 ? 'true' : 'false')) : expectState(() => 'false')});
    f.items[1].click();
    await settle();
    expect(ariaStates(f)).toEqual(${expectState((i) => (i === 1 ? 'true' : 'false'))});
    f.items[1].click();
    await settle();
    expect(ariaStates(f)).toEqual(${c.unselect ? expectState(() => 'false') : expectState((i) => (i === 1 ? 'true' : 'false'))});
  });`);

  if (hasMultiple) {
    cases.push(`  it('reflects every selected item as ${stateAttr} in multi-select', async () => {
${cite('aria')}    const f = await setupSelection({mode: 'multiple'});
    f.items[0].click();
    f.items[2].click();
    await settle();
    expect(ariaStates(f)).toEqual(${expectState((i) => (i === 0 || i === 2 ? 'true' : 'false'))});
  });`);
  }

  if (hasNone && c.state.absentInNone) {
    cases.push(`  it('has no ${stateAttr} state in none mode (the buttons only act)', async () => {
${cite('aria')}    const f = await setupSelection({mode: 'none'});
    expect(ariaStates(f)).toEqual(${expectState(() => 'null')});
  });`);
  }

  if (c.roles) {
    cases.push(`  it('is a ${c.roles.single} group in single-select and a ${c.roles.multiple} group in multi-select', async () => {
${cite('roles')}    const single = await setupSelection({mode: 'single'});
    expect(single.items.map((item) => item.shadowRoot!.querySelector('${c.roles.selector}')?.getAttribute('role'))).toEqual(
      SELECTION_LABELS.map(() => '${c.roles.single}'),
    );
    const multiple = await setupSelection({mode: 'multiple'});
    expect(multiple.items.map((item) => item.shadowRoot!.querySelector('${c.roles.selector}')?.getAttribute('role'))).toEqual(
      SELECTION_LABELS.map(() => '${c.roles.multiple}'),
    );
  });`);
  }

  const evs = c.events.map((e) => `'${e}'`).join(', ');
  cases.push(`  it('fires ${c.events.join(' then ')} on the group when the user selects, by click and by key', async () => {
${cite('events')}    const f = await setupSelection({mode: '${hasSingle ? 'single' : c.defaultMode}'});
    const log = recordSelectionEvents(f.group);
    f.items[1].click();
    await settle();
    expect(log).toEqual([${c.events.map((e) => `'${e}'`).join(', ')}]);
    log.length = 0;
    await focusItem(f, 2);
    await press('Space');
    expect(log).toEqual([${evs}]);
  });`);

  cases.push(`  it('fires no events when the selection is changed programmatically', async () => {
${cite('events')}    const f = await setupSelection({mode: '${hasSingle ? 'single' : c.defaultMode}'});
    const log = recordSelectionEvents(f.group);
    (f.items[2] as HTMLElement & {selected: boolean}).selected = true;
    await settle();
    expect(selectedLabels(f)).toContain('${L[2]}');
    expect(log).toEqual([]);
  });`);

  if (hasSingle && required) {
    cases.push(`  it('fires no events when nothing changes (the selected item of a required group)', async () => {
${cite('events')}    const f = await setupSelection({mode: 'single', required: true});
    f.items[1].click();
    await settle();
    const log = recordSelectionEvents(f.group);
    f.items[1].click();
    await settle();
    expect(log).toEqual([]);
  });`);
  }

  if (c.disabled) {
    cases.push(`  it('does not select a disabled item', async () => {
${cite('disabled')}    const f = await setupSelection({mode: '${hasSingle ? 'single' : c.defaultMode}', disabled: 1});
    const before = selectedLabels(f);
    const log = recordSelectionEvents(f.group);
    f.items[1].click();
    await settle();
    expect(selectedLabels(f)).toEqual(before);
    expect(log).toEqual([]);
  });`);
  }

  if (c.form) {
    cases.push(`  it('submits the selected value (single-select)', async () => {
${cite('form')}    const f = await setupSelection({mode: 'single', name: true});
    expect(formEntries(f)).toEqual([]);
    f.items[1].click();
    await settle();
    expect(formEntries(f)).toEqual(['${L[1]}']);
    f.items[2].click();
    await settle();
    expect(formEntries(f)).toEqual(['${L[2]}']);
  });`);
    cases.push(`  it('submits one entry per selected item (multi-select)', async () => {
${cite('form')}    const f = await setupSelection({mode: 'multiple', name: true});
    f.items[0].click();
    f.items[2].click();
    await settle();
    expect(formEntries(f)).toEqual(['${L[0]}', '${L[2]}']);
  });`);
    cases.push(`  it('has the form value updated before the events fire, and restores it on form reset', async () => {
${cite('form')}    const f = await setupSelection({mode: 'single', name: true});
    let atChange: string[] = [];
    f.group.addEventListener('change', () => (atChange = formEntries(f)));
    f.items[3].click();
    await settle();
    expect(atChange).toEqual(['${L[3]}']);
    f.form.reset();
    await settle();
    expect(formEntries(f)).toEqual([]);
    expect(selectedLabels(f)).toEqual([]);
  });`);
  }

  const modeAttrs = JSON.stringify(attrs);
  const itemFn = placeholders(c.item);
  const fixture = c.fixture.replace('${ITEMS}', '${items}').replace('${ATTRS}', '${attrs}');
  const setup = `${c.m3Styles ? '\nadoptStyles(document, [m3Styles]);\n' : ''}
const SELECTION_LABELS = ${JSON.stringify(L)};
const SELECTION_MODE_ATTRS: {[mode: string]: string} = ${modeAttrs};

interface SelectionFixture {
  form: HTMLFormElement;
  group: HTMLElement;
  items: HTMLElement[];
}

async function setupSelection(opts: {
  mode: string;
  required?: boolean;
  disabled?: number;
  name?: boolean;
}): Promise<SelectionFixture> {
  const root = await mount(html\`\`);
  const attrs = [
    SELECTION_MODE_ATTRS[opts.mode],
    opts.required ? '${c.requiredAttr ?? ''}' : '',
    opts.name ? 'name="${c.form?.name ?? ''}"' : '',
  ]
    .filter(Boolean)
    .map((attr) => ' ' + attr)
    .join('');
  const item = (label: string, extra: string) => \`${itemFn}\`;
  const items = SELECTION_LABELS.map((label, i) => item(label, opts.disabled === i ? ' ${c.disabled ?? ''}' : '')).join('');
  root.innerHTML = \`<form>${fixture}</form>\`;
  await settle();
  const f = {
    form: root.querySelector('form')!,
    group: root.querySelector<HTMLElement>('${tag}')!,
    items: [...root.querySelectorAll<HTMLElement>('${c.items}')],
  };
  await settle();
  return f;
}

/** The labels of the selected items, in order. */
function selectedLabels(f: SelectionFixture) {
  return f.items.filter((item) => (item as HTMLElement & {selected: boolean}).selected).map((item) => item.textContent!.trim());
}

/** The ARIA state of each item. */
function ariaStates(f: SelectionFixture) {
  return f.items.map((item) => ${ariaRead});
}

/** The event types the group dispatches, in order. */
function recordSelectionEvents(group: HTMLElement) {
  const log: string[] = [];
  for (const type of ['input', 'change']) group.addEventListener(type, () => log.push(type));
  return log;
}
${
  c.form
    ? `
/** The values the form submits for the group. */
function formEntries(f: SelectionFixture) {
  return new FormData(f.form).getAll('${c.form.name}') as string[];
}
`
    : ''
}`;
  // The template literal in `item` above needs the items' label as text.
  return {
    // The generator only writes side-effect imports, so named imports
    // ride along in the module specifier.
    imports: [
      ...c.imports,
      ...(usesInternals ? ["../../../behaviors/element-internals.js';\nimport {internals} from '../../../behaviors/element-internals.js"] : []),
      ...(c.m3Styles
        ? ["../../styles/adopt-styles.js';\nimport {adoptStyles} from '../../styles/adopt-styles.js';\nimport {styles as m3Styles} from '../../styles/m3.cssresult.js"]
        : []),
    ],
    setup,
    describe: `describe('<${tag}> selection contract (SelectionController: ${[
      hasNone && 'none',
      hasSingle && (c.alwaysRequired ? 'single, always one selected' : 'single'),
      hasMultiple && 'multiple',
      c.requiredAttr && 'required',
    ]
      .filter(Boolean)
      .join(', ')})', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`,
  };
}
