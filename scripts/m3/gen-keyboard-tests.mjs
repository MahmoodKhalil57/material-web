#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates browser tests from the "Keyboard navigation" tables in the M3
 * spec pages' accessibility sections.
 *
 * Each table row (keys, action) is parsed into key presses and mapped to an
 * assertion template (focus enters the component, focus moves to the next or
 * previous item, selects, activates, changes the value, opens, closes, ...).
 * The component knowledge (element tags, how to render a fixture, how to
 * read focus, selection and value) lives in `COMPONENT_SETS` below. A row
 * that no template or component config can map makes the generator fail, so
 * spec changes surface instead of being silently dropped.
 *
 * Tests press real keys (`sendKeys` from @web/test-runner-commands), so
 * native behavior (Tab order, buttons activating on Space and Enter, range
 * inputs, popovers) is exercised too.
 *
 *   node scripts/m3/gen-keyboard-tests.mjs [component ...]   # write
 *   node scripts/m3/gen-keyboard-tests.mjs --check           # exit 1 if stale
 *
 * Writes `components/<dir>/<dir>_keyboard_spec_test.ts`.
 */

import {readFile, writeFile} from 'node:fs/promises';
import {elementDir} from '../element-dirs.mjs';
import {join} from 'node:path';
import {assignIds, normalize, pageUnits} from './spec-units.mjs';

const SPECS = '.m3-specs';
const PAGES = join(SPECS, 'pages/components');
const GB = 'material-design-expressive/components';

const argv = process.argv.slice(2);
const check = argv.includes('--check');
// Generate every case as `it` (to find mismatches after a spec change).
const allIt = argv.includes('--it');
const only = argv.filter((a) => !a.startsWith('--'));

// ---------------------------------------------------------------------------
// Component config: everything the templates need to know about a component.
//
// - page: the spec page (`.m3-specs/pages/components/<page>.json`).
// - imports: side-effect modules (relative to the component directory).
// - typeImports: [['type X', './x.js']]: emitted when the code uses X.
// - fixture: TypeScript source defining
//     `async function setup(opts: SetupOptions = {}): Promise<Fixture>`
//   (use the shared `mount()` and `fixture()` helpers) and any accessors the
//   features below need.
// - features: what the fixture supports, checked by the templates:
//     selected  `selectedIndices(f): number[]`, `setup({selected})`
//     value     `valueOf(f): number`, `setup({step})`
//     menu      `openMenu(f)`, `isOpen(el)`, `f.invoker`, `f.menu`
//     submenu   `f.submenu`, `f.submenuItems`, `f.items[submenuItem]`
// - arrows: which arrow keys an unqualified "Arrows" row means.
// - entry: where Tab lands when the row says focus enters the component:
//     'first' (default) or 'invoker' (a menu button).
// - state: menus only: the default state ('open') for rows without a
//   "For open/closed menus:" clause.
// - select: the fixture for "selects" rows: `setup` options and the item.
// - value: slider value fixture: start, min, max, interval (the step used
//   for "one interval or one stop indicator").
// - labels: item labels (typeahead).
// - phrases: per-component [regex, category] overrides, checked before
//   the shared ACTIONS.
// - mismatches: case title -> why gb differs from the spec. These cases
//   are generated as `xit` so the gap stays visible.
// ---------------------------------------------------------------------------

const ALL_ARROWS = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'];

export const COMPONENT_SETS = {
  buttongroup: {
    page: 'button-groups',
    tag: 'md-gb-button-group',
    imports: ['./md-gb-button-group.js', '../button/md-gb-button.js'],
    arrows: ['ArrowRight', 'ArrowLeft'],
    fixture: `
async function setup(): Promise<Fixture> {
  const root = await mount(html\`
    <button id="before">Before</button>
    <md-gb-button-group aria-label="Text formatting">
      <md-gb-button>Bold</md-gb-button>
      <md-gb-button>Italic</md-gb-button>
      <md-gb-button>Underline</md-gb-button>
    </md-gb-button-group>
    <button id="after">After</button>
  \`);
  return fixture(root, [...root.querySelectorAll<HTMLElement>('md-gb-button')]);
}`,
  },

  carousel: {
    page: 'carousel',
    tag: 'md-gb-carousel',
    imports: ['./md-gb-carousel.js', './md-gb-carousel-item.js'],
    arrows: ['ArrowRight', 'ArrowLeft'],
    fixture: `
async function setup(): Promise<Fixture> {
  const root = await mount(html\`
    <button id="before">Before</button>
    <md-gb-carousel
      aria-label="Destinations"
      style="inline-size: 800px; --item-width: 186px; --height: 200px">
      \${[0, 1, 2, 3, 4, 5].map(
        (i) =>
          html\`<md-gb-carousel-item label="Item \${i}">
            <div style="background: gray"></div>
          </md-gb-carousel-item>\`,
      )}
    </md-gb-carousel>
    <button id="after">After</button>
  \`);
  return fixture(root, [
    ...root.querySelectorAll<HTMLElement>('md-gb-carousel-item'),
  ]);
}`,
  },

  list: {
    page: 'lists',
    tag: 'md-gb-list',
    imports: ['./md-gb-list.js', './md-gb-list-item.js'],
    typeImports: [['type ListItemElement', './list-item-element.js']],
    features: ['selected'],
    // "To select a list item not yet selected": a selectable list in
    // selection mode (one item already selected).
    select: {setup: {selected: 0}, item: 1},
    fixture: `
async function setup(opts: SetupOptions = {}): Promise<Fixture> {
  const root = await mount(html\`
    <button id="before">Before</button>
    <md-gb-list selectable aria-label="Fruits">
      \${['Apples', 'Bananas', 'Cherries'].map(
        (label, i) =>
          html\`<md-gb-list-item ?checked=\${opts.selected === i}
            >\${label}</md-gb-list-item
          >\`,
      )}
    </md-gb-list>
    <button id="after">After</button>
  \`);
  return fixture(root, [
    ...root.querySelectorAll<HTMLElement>('md-gb-list-item'),
  ]);
}

function selectedIndices(f: Fixture) {
  return f.items.flatMap((item, i) =>
    (item as ListItemElement).checked ? [i] : [],
  );
}`,
  },

  radio: {
    page: 'radio-button',
    tag: 'md-gb-radio',
    imports: ['./md-gb-radio.js'],
    typeImports: [['type RadioElement', './radio-element.js']],
    features: ['selected'],
    arrows: ALL_ARROWS,
    select: {setup: {}, item: 1},
    fixture: `
async function setup(opts: SetupOptions = {}): Promise<Fixture> {
  const root = await mount(html\`
    <button id="before">Before</button>
    <div role="radiogroup" aria-label="Size">
      \${[0, 1, 2].map(
        (i) =>
          html\`<md-gb-radio
            name="size"
            value=\${i}
            aria-label="Option \${i}"
            ?checked=\${opts.selected === i}></md-gb-radio>\`,
      )}
    </div>
    <button id="after">After</button>
  \`);
  return fixture(root, [...root.querySelectorAll<HTMLElement>('md-gb-radio')]);
}

function selectedIndices(f: Fixture) {
  return f.items.flatMap((item, i) =>
    (item as RadioElement).checked ? [i] : [],
  );
}`,
  },

  segmentedbutton: {
    page: 'segmented-buttons',
    tag: 'md-gb-segmented-button-set',
    imports: ['./md-gb-segmented-button-set.js', './md-gb-segmented-button.js'],
    typeImports: [
      ['type SegmentedButtonElement', './segmented-button-element.js'],
    ],
    features: ['selected'],
    arrows: ALL_ARROWS,
    fixture: `
async function setup(opts: SetupOptions = {}): Promise<Fixture> {
  const root = await mount(html\`
    <button id="before">Before</button>
    <md-gb-segmented-button-set aria-label="View">
      \${['Day', 'Week', 'Month'].map(
        (label, i) =>
          html\`<md-gb-segmented-button
            value=\${label}
            ?selected=\${opts.selected === i}
            >\${label}</md-gb-segmented-button
          >\`,
      )}
    </md-gb-segmented-button-set>
    <button id="after">After</button>
  \`);
  return fixture(root, [
    ...root.querySelectorAll<HTMLElement>('md-gb-segmented-button'),
  ]);
}

function selectedIndices(f: Fixture) {
  return f.items.flatMap((item, i) =>
    (item as SegmentedButtonElement).selected ? [i] : [],
  );
}`,
  },

  slider: {
    page: 'sliders',
    tag: 'md-gb-slider',
    imports: ['./md-gb-slider.js'],
    typeImports: [['type SliderElement', './slider-element.js']],
    features: ['value'],
    arrows: ALL_ARROWS,
    value: {start: 50, min: 0, max: 100, step: 1, interval: 10},
    fixture: `
async function setup(opts: SetupOptions = {}): Promise<Fixture> {
  const root = await mount(html\`
    <button id="before">Before</button>
    <md-gb-slider
      aria-label="Volume"
      min="0"
      max="100"
      value="50"
      step=\${opts.step ?? 1}
      ?ticks=\${opts.step !== undefined}></md-gb-slider>
    <button id="after">After</button>
  \`);
  return fixture(root, [...root.querySelectorAll<HTMLElement>('md-gb-slider')]);
}

function valueOf(f: Fixture) {
  return (f.items[0] as SliderElement).value;
}`,
  },

  menu: {
    page: 'menus',
    tag: 'md-gb-menu',
    imports: ['./md-gb-menu.js', './md-gb-menu-item.js'],
    typeImports: [['type MenuElement', './menu-element.js']],
    features: ['menu', 'submenu', 'activate'],
    entry: 'invoker',
    state: 'open',
    labels: ['Cut', 'Copy', 'Paste', 'Share'],
    submenuItem: 3,
    // "Selects a menu item": activates it and closes the menu.
    select: {setup: {}, item: 0, closes: true},
    fixture: `
async function setup(): Promise<Fixture> {
  const root = await mount(html\`
    <button id="before">Before</button>
    <button id="invoker" popovertarget="menu">Edit</button>
    <md-gb-menu id="menu">
      <md-gb-menu-item>Cut</md-gb-menu-item>
      <md-gb-menu-item>Copy</md-gb-menu-item>
      <md-gb-menu-item>Paste</md-gb-menu-item>
      <md-gb-menu-item>
        Share
        <md-gb-menu slot="submenu" id="submenu">
          <md-gb-menu-item>Email</md-gb-menu-item>
          <md-gb-menu-item>Message</md-gb-menu-item>
        </md-gb-menu>
      </md-gb-menu-item>
    </md-gb-menu>
    <button id="after">After</button>
  \`);
  const menu = root.querySelector<MenuElement>('#menu')!;
  const submenu = root.querySelector<MenuElement>('#submenu')!;
  return {
    ...fixture(root, menu.items),
    menu,
    submenu,
    submenuItems: submenu.items,
    invoker: root.querySelector<HTMLElement>('#invoker')!,
  };
}

function isOpen(menu: Element) {
  return menu.matches(':popover-open');
}

/**
 * Opens the menu from its invoker, as a click would, and waits for the
 * menu's (async) toggle event, which focuses its first item.
 */
async function openMenu(f: Fixture) {
  const opened = new Promise((resolve) => {
    f.menu.addEventListener('toggle', resolve, {once: true});
  });
  f.invoker.focus();
  f.invoker.click();
  await opened;
  await settle();
}`,
  },
};

// ---------------------------------------------------------------------------
// Parsing the spec tables.
// ---------------------------------------------------------------------------

/** Action phrase -> template category. First match wins. */
const ACTIONS = [
  ['typeahead', /next (menu )?item starting with/],
  ['submenu', /opens or closes a submenu/],
  ['close', /^closes? (the )?menu/],
  ['open', /^opens? (the )?menu/],
  ['home-end', /first and last values?/],
  ['step-value', /increase and decrease the value by one/],
  ['select-step', /moves focus and selects the previous or next/],
  [
    'focus-step',
    /moves? (focus )?to the (previous or next|next|previous)|navigate inside the component/,
  ],
  [
    'focus-enter',
    /moves focus (in)?to|focus lands on|navigate between buttons|move focus to the first/,
  ],
  ['select', /^(to )?selects? (a |the )?(focused )?[\w ]*(item|button)/],
  ['activate', /^activates? (a |the )?focused/],
];

/** Key words in the "Keys" column -> key names. */
const KEY_WORDS = {
  tab: 'Tab',
  shift: 'Shift',
  space: 'Space',
  enter: 'Enter',
  escape: 'Escape',
  esc: 'Escape',
  home: 'Home',
  end: 'End',
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  arrows: 'Arrows',
  'arrow keys': 'Arrows',
  letters: 'Letters',
};

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const text = (html) =>
  decode(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

/** Finds the keyboard table (a Keys / Actions header) in a page's JSON. */
async function keyboardTable(page) {
  const json = JSON.parse(await readFile(join(PAGES, `${page}.json`), 'utf8'));
  const chunks = [];
  (function walk(node) {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === 'object') {
      if (typeof node.htmlValue === 'string') chunks.push(node.htmlValue);
      Object.values(node).forEach(walk);
    }
  })(json);
  const tables = [];
  for (const html of chunks) {
    for (const [table] of html.matchAll(/<table[\s\S]*?<\/table>/g)) {
      const rows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/g)].map(([tr]) =>
        [...tr.matchAll(/<t([hd])[^>]*>([\s\S]*?)<\/t\1>/g)].map((m) => m[2]),
      );
      const header = rows[0]?.map(text).map((s) => s.toLowerCase());
      if (header?.[0] === 'keys' && /^actions?$/.test(header[1] ?? '')) {
        tables.push(rows.slice(1));
      }
    }
  }
  if (tables.length !== 1) {
    throw new Error(
      `${page}: expected one Keys/Actions table, found ${tables.length}`,
    );
  }
  return tables[0].map(([keys, action], i) => {
    if (keys === undefined || action === undefined) {
      throw new Error(`${page}: keyboard table row ${i + 1} has no action`);
    }
    // Multi-paragraph actions ("For closed menus: ... For open menus: ...").
    const clauses = action
      .split(/<\/p>|<br\s*\/?>/)
      .map(text)
      .filter(Boolean);
    return {keys: text(keys), action: clauses.join(' '), clauses};
  });
}

/**
 * Parses a "Keys" cell into alternatives. Each alternative is a list of keys
 * pressed together ("Shift + Tab", "Space & Arrows").
 */
/** Spec units (spec-units.mjs) of a page's keyboard navigation section. */
async function keyboardUnits(page) {
  const file = `components/${page}.md`;
  const md = await readFile(join(SPECS, 'pages', file), 'utf8');
  return assignIds(pageUnits(file, md)).filter((u) =>
    /keyboard/i.test(u.headings.at(-1) ?? ''),
  );
}

/**
 * IDs of the spec units that hold a keyboard table row: units with a cell
 * (or text) equal to the row's keys, its action or one of its action
 * clauses (the markdown export can split a row across units).
 */
function rowUnits(row, units) {
  const words = (s) =>
    normalize(s)
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  const wanted = new Set([row.keys, row.action, ...row.clauses].map(words));
  return units
    .filter((u) =>
      u.text
        .split(' | ')
        .some(
          (cell) =>
            wanted.has(words(cell)) ||
            wanted.has(words(cell.replace(/^.*?: /, ''))),
        ),
    )
    .map((u) => u.id);
}

function parseKeys(cell, where) {
  const s = cell.toLowerCase().replace(/\s+/g, ' ').trim();
  return s.split(/ (?:or|and) /).map((alt) =>
    alt.split(/ ?[+&] ?/).map((word) => {
      const w = word
        .trim()
        .replace(/ arrows?( keys?)?$/, '')
        .replace(/^arrow$/, 'arrows');
      const key = KEY_WORDS[w];
      if (!key) throw new Error(`${where}: unknown key "${word}" in "${cell}"`);
      return key;
    }),
  );
}

function categorize(phrase, config) {
  const p = phrase.toLowerCase();
  for (const [re, id] of config.phrases ?? []) if (re.test(p)) return id;
  for (const [id, re] of ACTIONS) if (re.test(p)) return id;
  return undefined;
}

// ---------------------------------------------------------------------------
// Assertion templates. Each returns cases: {title, body} with `body` the
// TypeScript statements of the test.
// ---------------------------------------------------------------------------

const NEXT = new Set(['ArrowRight', 'ArrowDown']);

function arrowsFor(keys, config, where) {
  const out = [];
  for (const key of keys) {
    if (key === 'Arrows') {
      if (!config.arrows) {
        throw new Error(`${where}: "Arrows" needs \`arrows\` in the config`);
      }
      out.push(...config.arrows);
    } else if (key.startsWith('Arrow')) {
      out.push(key);
    }
  }
  return out;
}

function requireFeature(config, feature, where) {
  if (!(config.features ?? []).includes(feature)) {
    throw new Error(
      `${where}: needs fixture feature "${feature}" (add it to COMPONENT_SETS)`,
    );
  }
}

function prelude(config, state) {
  return config.features?.includes('menu') && state === 'open'
    ? ['await openMenu(f);']
    : [];
}

const TEMPLATES = {
  'focus-enter'({alternatives, phrase, config}) {
    const cases = [];
    const p = phrase.toLowerCase();
    const selectedOr = /to the selected [\w ]+, or the (first|last)/.exec(p);
    for (const alt of alternatives) {
      const shift = alt.includes('Shift');
      if (!alt.includes('Tab')) continue;
      const key = shift ? 'Shift+Tab' : 'Tab';
      const from = shift ? 'f.after' : 'f.before';
      if (config.entry === 'invoker') {
        cases.push({
          title: `${key} moves focus to the menu button`,
          body: [
            'const f = await setup();',
            `${from}.focus();`,
            `await press('${key}');`,
            'expect(isFocused(f.invoker)).toBeTrue();',
          ],
        });
        continue;
      }
      const edge = shift ? 'last' : 'first';
      const edgeIndex = shift ? 'f.items.length - 1' : '0';
      if (selectedOr) {
        cases.push({
          title: `${key} moves focus to the ${edge} item when none is selected`,
          body: [
            'const f = await setup();',
            `${from}.focus();`,
            `await press('${key}');`,
            `expect(focusedIndex(f.items)).toBe(${edgeIndex});`,
          ],
        });
        cases.push({
          title: `${key} moves focus to the selected item`,
          body: [
            'const f = await setup({selected: 1});',
            `${from}.focus();`,
            `await press('${key}');`,
            'expect(focusedIndex(f.items)).toBe(1);',
          ],
        });
        continue;
      }
      cases.push({
        title: `${key} moves focus to the ${edge} item`,
        body: [
          'const f = await setup();',
          `${from}.focus();`,
          `await press('${key}');`,
          `expect(focusedIndex(f.items)).toBe(${edgeIndex});`,
        ],
      });
      // "To move focus to the first list item, last list item, or outside
      // of the list component".
      if (!shift && /first [\w ]*item, last [\w ]*item/.test(p)) {
        cases.push({
          title: 'Shift+Tab moves focus to the last item',
          body: [
            'const f = await setup();',
            'f.after.focus();',
            "await press('Shift+Tab');",
            'expect(focusedIndex(f.items)).toBe(f.items.length - 1);',
          ],
        });
      }
      if (!shift && /outside/.test(p)) {
        cases.push({
          title: 'Tab from an item moves focus outside the component',
          body: [
            'const f = await setup();',
            'await focusItem(f, 0);',
            "await press('Tab');",
            'expect(isFocused(f.after)).toBeTrue();',
          ],
        });
      }
    }
    return cases;
  },

  'focus-step'(ctx) {
    return stepCases(ctx, false);
  },

  'select-step'(ctx) {
    requireFeature(ctx.config, 'selected', ctx.where);
    return stepCases(ctx, true);
  },

  select({alternatives, phrase, config, where, state}) {
    const keys = alternatives
      .flat()
      .filter((k) => k === 'Space' || k === 'Enter');
    if (!keys.length)
      throw new Error(`${where}: "select" needs Space or Enter`);
    const select = config.select;
    if (!select) throw new Error(`${where}: needs \`select\` in the config`);
    const opts = JSON.stringify(select.setup ?? {}).replace(/"/g, '');
    const cases = [];
    for (const key of keys) {
      if (select.closes) {
        requireFeature(config, 'menu', where);
        cases.push({
          title: `${state ? `${state}: ` : ''}${key} selects the focused item and closes the menu`,
          body: [
            `const f = await setup(${opts === '{}' ? '' : opts});`,
            ...prelude(config, 'open'),
            `await focusItem(f, ${select.item});`,
            `await press('${key}');`,
            `expect(f.activated).toEqual([${select.item}]);`,
            'expect(isOpen(f.menu)).toBeFalse();',
          ],
        });
        continue;
      }
      requireFeature(config, 'selected', where);
      const body = [
        `const f = await setup(${opts === '{}' ? '' : opts});`,
        `await focusItem(f, ${select.item});`,
        `await press('${key}');`,
        `expect(selectedIndices(f)).toContain(${select.item});`,
      ];
      if (/if already selected, does nothing/i.test(phrase)) {
        body.push(
          `await press('${key}');`,
          `expect(selectedIndices(f)).toEqual([${select.item}]);`,
        );
      }
      cases.push({title: `${key} selects the focused item`, body});
    }
    return cases;
  },

  activate({alternatives, where}) {
    const keys = alternatives
      .flat()
      .filter((k) => k === 'Space' || k === 'Enter');
    if (!keys.length)
      throw new Error(`${where}: "activate" needs Space or Enter`);
    return keys.map((key) => ({
      title: `${key} activates the focused item`,
      body: [
        'const f = await setup();',
        'await focusItem(f, 1);',
        `await press('${key}');`,
        'expect(f.activated).toEqual([1]);',
      ],
    }));
  },

  'step-value'({alternatives, phrase, config, where}) {
    requireFeature(config, 'value', where);
    const v = config.value;
    // "by one interval or one stop indicator" with Space held: a slider with
    // stops moves by one stop.
    const interval = /one interval/i.test(phrase);
    const cases = [];
    for (const alt of alternatives) {
      const held = alt.filter((k) => !k.startsWith('Arrow') && k !== 'Arrows');
      for (const key of arrowsFor(alt, config, where)) {
        const sign = key === 'ArrowRight' || key === 'ArrowUp' ? 1 : -1;
        const step = interval ? v.interval : v.step;
        const want = v.start + sign * step;
        const how = held.length
          ? `await hold(${JSON.stringify(held)}, '${key}');`
          : `await press('${key}');`;
        cases.push({
          title: `${[...held, key].join('+')} ${sign > 0 ? 'increases' : 'decreases'} the value by one ${interval ? 'stop' : 'step'}`,
          body: [
            `const f = await setup(${interval ? `{step: ${v.interval}}` : ''});`,
            'await focusItem(f, 0);',
            how,
            `expect(valueOf(f)).toBe(${want});`,
          ],
        });
      }
    }
    return cases;
  },

  'home-end'({alternatives, config, where}) {
    requireFeature(config, 'value', where);
    const v = config.value;
    return alternatives.flat().map((key) => {
      if (key !== 'Home' && key !== 'End') {
        throw new Error(`${where}: "first and last values" needs Home or End`);
      }
      const want = key === 'Home' ? v.min : v.max;
      return {
        title: `${key} sets the ${key === 'Home' ? 'minimum' : 'maximum'} value`,
        body: [
          'const f = await setup();',
          'await focusItem(f, 0);',
          `await press('${key}');`,
          `expect(valueOf(f)).toBe(${want});`,
        ],
      };
    });
  },

  open({alternatives, phrase, config, where, state}) {
    requireFeature(config, 'menu', where);
    if (state && state !== 'closed') {
      throw new Error(`${where}: "opens menu" applies to closed menus`);
    }
    const cases = [];
    for (const key of alternatives.flat()) {
      cases.push({
        title: `closed: ${key} on the menu button opens the menu`,
        body: [
          'const f = await setup();',
          'f.invoker.focus();',
          `await press('${key}');`,
          'expect(isOpen(f.menu)).toBeTrue();',
          'expect(focusedIndex(f.items)).toBe(0);',
        ],
      });
      if (/submenu/i.test(phrase)) {
        requireFeature(config, 'submenu', where);
        cases.push({
          title: `${key} on an item with a submenu opens the submenu`,
          body: [
            'const f = await setup();',
            'await openMenu(f);',
            `await focusItem(f, ${config.submenuItem});`,
            `await press('${key}');`,
            'expect(isOpen(f.submenu)).toBeTrue();',
            'expect(focusedIndex(f.submenuItems)).toBe(0);',
          ],
        });
      }
    }
    return cases;
  },

  close({alternatives, config, where}) {
    requireFeature(config, 'menu', where);
    return alternatives.flat().map((key) => ({
      title: `${key} closes the menu and returns focus to the menu button`,
      body: [
        'const f = await setup();',
        'await openMenu(f);',
        'await focusItem(f, 0);',
        `await press('${key}');`,
        'expect(isOpen(f.menu)).toBeFalse();',
        'expect(isFocused(f.invoker)).toBeTrue();',
      ],
    }));
  },

  submenu({alternatives, config, where}) {
    requireFeature(config, 'submenu', where);
    const keys = alternatives.flat();
    if (!keys.includes('ArrowRight') || !keys.includes('ArrowLeft')) {
      throw new Error(
        `${where}: "opens or closes a submenu" needs Left and Right`,
      );
    }
    const i = config.submenuItem;
    return [
      {
        title: 'ArrowRight opens the submenu of the focused item',
        body: [
          'const f = await setup();',
          'await openMenu(f);',
          `await focusItem(f, ${i});`,
          "await press('ArrowRight');",
          'expect(isOpen(f.submenu)).toBeTrue();',
          'expect(focusedIndex(f.submenuItems)).toBe(0);',
        ],
      },
      {
        title: 'ArrowLeft closes the submenu and focuses its item',
        body: [
          'const f = await setup();',
          'await openMenu(f);',
          `await focusItem(f, ${i});`,
          "await press('ArrowRight');",
          "await press('ArrowLeft');",
          'expect(isOpen(f.submenu)).toBeFalse();',
          'expect(isOpen(f.menu)).toBeTrue();',
          `expect(focusedIndex(f.items)).toBe(${i});`,
        ],
      },
    ];
  },

  typeahead({alternatives, config, where}) {
    if (!alternatives.flat().includes('Letters')) {
      throw new Error(`${where}: typeahead needs "Letters"`);
    }
    const labels = config.labels;
    if (!labels) throw new Error(`${where}: typeahead needs \`labels\``);
    // Pressed on item 0: the first item past item 1 whose letter no earlier
    // item starts with, so focus has to skip items to get there.
    const letterOf = (i) => labels[i][0].toLowerCase();
    const want = labels.findIndex(
      (_, i) =>
        i > 1 &&
        !labels.slice(0, i).some((_, j) => letterOf(j) === letterOf(i)),
    );
    if (want < 0) {
      throw new Error(`${where}: \`labels\` need a unique letter past item 1`);
    }
    const letter = letterOf(want);
    return [
      {
        title: `a letter moves focus to the next item starting with it`,
        body: [
          'const f = await setup();',
          ...prelude(config, 'open'),
          'await focusItem(f, 0);',
          `await press('${letter}');`,
          `expect(focusedIndex(f.items)).toBe(${want});`,
        ],
      },
    ];
  },
};

function stepCases({alternatives, phrase, config, where, state}, selects) {
  const cases = [];
  const wraps = /wrap/i.test(phrase);
  const prefix = state === 'closed' ? 'closed: ' : '';
  const keys = alternatives.flat();
  const steps = [];
  if (keys.includes('Tab')) {
    steps.push(['Tab', true]);
    if (/previous/i.test(phrase)) steps.push(['Shift+Tab', false]);
  }
  for (const key of arrowsFor(keys, config, where))
    steps.push([key, NEXT.has(key)]);
  if (!steps.length) throw new Error(`${where}: no navigation keys`);
  for (const [key, next] of steps) {
    const pairs = [
      [next ? '0' : '1', next ? '1' : '0', next ? 'next' : 'previous'],
    ];
    if (wraps) {
      pairs.push(
        next
          ? ['-1', '0', 'wrap-next']
          : ['0', 'f.items.length - 1', 'wrap-previous'],
      );
    }
    for (const [from, to, kind] of pairs) {
      const title =
        kind === 'wrap-next'
          ? `${key} wraps from the last item to the first`
          : kind === 'wrap-previous'
            ? `${key} wraps from the first item to the last`
            : `${key} moves focus to the ${kind} item`;
      const body = [
        'const f = await setup();',
        ...prelude(config, state ?? config.state),
        `await focusItem(f, ${from});`,
        `await press('${key}');`,
        `expect(focusedIndex(f.items)).toBe(${to});`,
      ];
      if (selects) {
        body.push(
          `expect(selectedIndices(f)).toEqual([${to === 'f.items.length - 1' ? 'f.items.length - 1' : to}]);`,
        );
      }
      cases.push({
        title: `${prefix}${title}${selects ? ' and selects it' : ''}`,
        body,
      });
    }
  }
  return cases;
}

// ---------------------------------------------------------------------------
// Output.
// ---------------------------------------------------------------------------

/**
 * Helpers emitted into every test file. A block is emitted only when the
 * rest of the file (or another emitted block) uses its name.
 */
const RUNTIME = [
  [
    'SetupOptions',
    `interface SetupOptions {
  /** Index of the item to render selected. */
  selected?: number;
  /** Value step (sliders). */
  step?: number;
}`,
  ],
  [
    'Fixture',
    `interface Fixture {
  root: HTMLElement;
  items: HTMLElement[];
  before: HTMLElement;
  after: HTMLElement;
  /** Indices of the items that received a click (activation). */
  activated: number[];
  // Menus.
  invoker?: HTMLElement;
  menu?: HTMLElement;
  submenu?: HTMLElement;
  submenuItems?: HTMLElement[];
}`,
  ],
  ['container', `let container: HTMLElement | undefined;`],
  [
    'mount',
    `async function mount(template: TemplateResult) {
  container?.remove();
  container = document.createElement('div');
  document.body.appendChild(container);
  render(template, container);
  await settle();
  return container;
}`,
  ],
  [
    'fixture',
    `function fixture(root: HTMLElement, items: HTMLElement[]): Fixture {
  const activated: number[] = [];
  items.forEach((item, i) => {
    item.addEventListener('click', (event) => {
      // Clicks bubbling from nested items (submenus) are not this item's.
      const path = event.composedPath();
      if (path.find((el) => items.includes(el as HTMLElement)) === item) {
        activated.push(i);
      }
    });
  });
  return {
    root,
    items,
    activated,
    before: root.querySelector<HTMLElement>('#before')!,
    after: root.querySelector<HTMLElement>('#after')!,
  };
}`,
  ],
  [
    'settle',
    `/** Waits for Lit updates, a frame and pending timeouts. */
async function settle(root: ParentNode = document.body) {
  for (const el of root.querySelectorAll('*')) {
    const update = (el as Partial<ReactiveElement>).updateComplete;
    if (update) await update;
    if (el.shadowRoot) await settle(el.shadowRoot);
  }
  if (root !== document.body) return;
  // Twice: popover toggle events, and the timeouts they start, can land
  // after the next frame.
  for (let i = 0; i < 2; i++) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => setTimeout(resolve));
  }
}`,
  ],
  [
    'press',
    `/** Presses a key (or a chord such as \`Shift+Tab\`) on a real keyboard. */
async function press(key: string) {
  await sendKeys({press: key});
  await settle();
}`,
  ],
  [
    'hold',
    `/** Holds keys down while pressing another. */
async function hold(held: string[], key: string) {
  for (const k of held) await sendKeys({down: k});
  await sendKeys({press: key});
  for (const k of [...held].reverse()) await sendKeys({up: k});
  await settle();
}`,
  ],
  [
    'focusPath',
    `/** The focused element and the focused elements of its shadow roots. */
function focusPath() {
  const path: Element[] = [];
  let el = document.activeElement;
  while (el) {
    path.push(el);
    el = el.shadowRoot?.activeElement ?? null;
  }
  return path;
}`,
  ],
  [
    'isFocused',
    `function isFocused(target: Element) {
  return focusPath().includes(target);
}`,
  ],
  [
    'focusedIndex',
    `/** The index of the item that holds focus, or -1. */
function focusedIndex(items: Element[]) {
  const path = focusPath();
  return items.findIndex((item) =>
    path.some((el) => el === item || item.contains(el)),
  );
}`,
  ],
  [
    'focusItem',
    `/** Focuses item \`index\` (negative counts from the end). */
async function focusItem(f: Fixture, index: number) {
  f.items[(index + f.items.length) % f.items.length].focus();
  await settle();
}`,
  ],
];

/** The runtime blocks that `code` uses, transitively, in RUNTIME order. */
function runtimeFor(code) {
  const used = new Set();
  let grew = true;
  while (grew) {
    grew = false;
    const haystack = [
      code,
      ...RUNTIME.filter(([n]) => used.has(n)).map(([, s]) => s),
    ].join('\n');
    for (const [name] of RUNTIME) {
      if (used.has(name)) continue;
      if (new RegExp(`\\b${name}\\b`).test(haystack)) {
        used.add(name);
        grew = true;
      }
    }
  }
  return RUNTIME.filter(([n]) => used.has(n))
    .map(([, s]) => s)
    .join('\n\n');
}

const indent = (lines, n) =>
  lines.map((l) => (l ? ' '.repeat(n) + l : l)).join('\n');

function testFile(dir, config, rows, version) {
  const usedMismatches = new Set();
  const describes = [];
  const titles = new Set();
  for (const row of rows) {
    const its = [];
    for (const c of row.cases) {
      if (titles.has(c.title)) continue; // e.g. Tab in two rows
      titles.add(c.title);
      const reason = allIt ? undefined : config.mismatches?.[c.title];
      if (reason) usedMismatches.add(c.title);
      its.push(
        [
          ...(reason ? [`// Spec mismatch: ${reason}.`] : []),
          `${reason ? 'xit' : 'it'}(${JSON.stringify(c.title)}, async () => {`,
          indent(c.body, 2),
          '});',
        ].join('\n'),
      );
    }
    if (!its.length) continue;
    // Cite the row's spec units (spec-checks.mjs) when a case checks it;
    // a row whose cases are all known mismatches stays uncovered.
    const live = its.some((s) => !s.includes('xit('));
    describes.push(
      [
        `// Spec: "${row.keys}" | "${row.action}"`,
        ...(live && row.units.length ? [`// spec: ${row.units.join(', ')}`] : []),
        `describe(${JSON.stringify(`${row.keys}: ${row.action}`)}, () => {`,
        indent(its.join('\n\n').split('\n'), 2),
        '});',
      ].join('\n'),
    );
  }
  const stale = Object.keys(config.mismatches ?? {}).filter(
    (t) => !usedMismatches.has(t),
  );
  if (stale.length && !allIt) {
    throw new Error(
      `${dir}: mismatches no longer generated (spec changed?): ${stale.join('; ')}`,
    );
  }

  let fixtureSource = config.fixture.trim();
  const body = describes.join('\n\n');
  // Drop accessors the generated cases do not use (noUnusedLocals).
  for (const accessor of ['selectedIndices', 'valueOf']) {
    if (!body.includes(`${accessor}(`)) {
      fixtureSource = fixtureSource.replace(
        new RegExp(`\\n+function ${accessor}\\b[\\s\\S]*?\\n}`),
        '',
      );
    }
  }
  const runtime = runtimeFor(`${fixtureSource}\n${body}\ncontainer`);
  const code = `${runtime}\n${fixtureSource}\n${body}`;
  const typeImports = (config.typeImports ?? [])
    .filter(([name]) =>
      new RegExp(`\\b${name.replace(/^type /, '')}\\b`).test(code),
    )
    .map(([name, from]) => `import {${name}} from '${from}';`);

  return `/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// AUTOGENERATED. DO NOT MODIFY.
// To modify this file, run: node scripts/m3/gen-keyboard-tests.mjs ${dir}
// Spec: m3.material.io ${version}, ${config.page} "Keyboard navigation"
//
// Each case presses real keys and checks the behavior the spec's keyboard
// table lists for that key. \`xit\` cases are known differences from the spec.

// import 'jasmine'; (google3-only)
import {sendKeys} from '@web/test-runner-commands';
import {html, render, type ReactiveElement, type TemplateResult} from 'lit';
${config.imports.map((m) => `import '${m}';`).join('\n')}
${typeImports.join('\n')}

${runtime}

${fixtureSource}

describe('<${config.tag}> keyboard (spec)', () => {
  afterEach(() => {
    container?.remove();
    container = undefined;
  });

${indent(body.split('\n'), 2)}
});
`.replace(/\n{3,}/g, '\n\n');
}

const manifest = JSON.parse(
  await readFile(join(SPECS, 'manifest.json'), 'utf8'),
);
let stale = 0;
for (const [dir, config] of Object.entries(COMPONENT_SETS)) {
  if (only.length && !only.includes(dir)) continue;
  const table = await keyboardTable(config.page);
  const specUnits = await keyboardUnits(config.page);
  const rows = [];
  for (const [n, row] of table.entries()) {
    const where = `${config.page} keyboard row ${n + 1} ("${row.keys}" | "${row.action}")`;
    const alternatives = parseKeys(row.keys, where);
    // Rows with "For closed menus: / For open menus:" clauses map each clause.
    const clauses = row.clauses
      .map((clause) => {
        const m = /^for (open|closed) [\w ]+?: (.*)$/i.exec(clause);
        return m ? {state: m[1].toLowerCase(), phrase: m[2]} : {phrase: clause};
      })
      .reduce((acc, c) => {
        // Join continuation paragraphs without a state prefix.
        if (!c.state && acc.length)
          acc[acc.length - 1].phrase += ` ${c.phrase}`;
        else acc.push(c);
        return acc;
      }, []);
    const cases = [];
    for (const {state, phrase} of clauses) {
      const category = categorize(phrase, config);
      if (!category) {
        throw new Error(
          `${where}: no assertion template matches "${phrase}". Add a phrase to ACTIONS or the component's \`phrases\`.`,
        );
      }
      const made = TEMPLATES[category]({
        alternatives,
        phrase,
        config,
        where: `${where} [${category}]`,
        state,
      });
      if (!made.length) {
        throw new Error(`${where}: template "${category}" produced no cases`);
      }
      cases.push(...made);
    }
    const units = rowUnits(row, specUnits);
    if (!units.length) console.log(`  ${where}: no spec unit to cite`);
    rows.push({...row, cases, units});
  }
  const out = join(elementDir(dir), `${dir}_keyboard_spec_test.ts`);
  const source = testFile(dir, config, rows, manifest.carbonVersion);
  const count = rows.reduce((n, r) => n + r.cases.length, 0);
  if (check) {
    const current = await readFile(out, 'utf8').catch(() => '');
    if (current !== source) {
      stale++;
      console.log(`${out}: out of date`);
    }
  } else {
    await writeFile(out, source);
    console.log(`${out}: ${rows.length} rows, ${count} cases`);
  }
}
if (check && stale) process.exit(1);
