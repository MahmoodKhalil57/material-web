#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates contract tests: each library component declares in CONTRACTS
 * which shared controllers it uses and with what options, and this writes
 * `components/<dir>/<dir>_contract_test.ts` with the shared checks
 * for each one, pressing real keys in a browser. The controllers themselves
 * are tested once in `components/shared/*_test.ts`; contract tests
 * prove each component wires them up as its spec page says, and cite those
 * spec units (`// spec:`).
 *
 *   node scripts/m3/gen-contract-tests.mjs            # all components
 *   node scripts/m3/gen-contract-tests.mjs list       # one
 *   node scripts/m3/gen-contract-tests.mjs --check    # fail if out of date
 */

import {readdir, readFile, writeFile} from 'node:fs/promises';
import {elementDir} from '../element-dirs.mjs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const GB = 'material-design-expressive/components';

/**
 * Per component: the controllers it uses and their contract.
 *
 * rovingFocus:
 * - imports: side-effect modules, relative to the component directory.
 * - fixture: lit `html` source of the group; `${ITEMS}` is replaced with the
 *   items. `item(label, i)` returns one item's markup (`disabled` is added by
 *   the test where needed).
 * - items: selector of the items inside the fixture.
 * - orientation / wrap / homeEnd / tabStops: the RovingFocusController
 *   options the component must behave like.
 * - spec: unit or section IDs each check proves (cited in the generated
 *   test). Keys: entry (Tab enters on the first item, container not
 *   focusable), arrows, wrap, rtl, homeEnd, disabled, tabStops.
 */
export const CONTRACTS = {
  buttongroup: {
    rovingFocus: {
      imports: ['./md-gb-button-group.js', '../button/md-gb-button.js'],
      fixture: '<md-gb-button-group aria-label="Text formatting">${ITEMS}</md-gb-button-group>',
      item: '<md-gb-button>${LABEL}</md-gb-button>',
      items: 'md-gb-button',
      orientation: 'horizontal',
      wrap: true,
      homeEnd: false,
      tabStops: 'all',
      spec: {
        entry: ['button-groups-5e4950', 'button-groups-ebecb4', 'button-groups-ceae8c', 'button-groups-1c8984', 'button-groups-257fef'],
        arrows: ['button-groups-257fef', 'button-groups-9760fc', 'button-groups/accessibility/keyboard-navigation'],
        rtl: [],
        disabled: [],
        tabStops: ['button-groups-ebecb4'],
      },
    },
  },
  chip: {
    rovingFocus: {
      imports: ['./md-gb-chip-set.js', './md-gb-chip.js'],
      fixture: '<md-gb-chip-set aria-label="Filters">${ITEMS}</md-gb-chip-set>',
      item: '<md-gb-chip>${LABEL}</md-gb-chip>',
      items: 'md-gb-chip',
      orientation: 'horizontal',
      wrap: true,
      homeEnd: true,
      tabStops: 'single',
      spec: {
        entry: ['chips-f0b349', 'chips-d79f9d'],
        arrows: ['chips-b57e33'],
        rtl: [],
        disabled: [],
        tabStops: ['chips-fd3d00'],
      },
    },
  },
  navdrawer: {
    rovingFocus: {
      imports: ['./md-gb-nav-drawer.js', './md-gb-nav-drawer-item.js'],
      fixture: '<md-gb-nav-drawer open aria-label="Mail">${ITEMS}</md-gb-nav-drawer>',
      item: '<md-gb-nav-drawer-item>${LABEL}</md-gb-nav-drawer-item>',
      items: 'md-gb-nav-drawer-item',
      orientation: 'vertical',
      wrap: true,
      homeEnd: true,
      tabStops: 'single',
      spec: {
        entry: ['navigation-drawer-054d25', 'navigation-drawer-b59187', 'navigation-drawer-e712cc'],
        arrows: ['navigation-drawer-943104', 'navigation-drawer-75bcc7'],
        rtl: [],
        disabled: [],
        tabStops: [],
      },
    },
  },
  segmentedbutton: {
    rovingFocus: {
      imports: ['./md-gb-segmented-button-set.js', './md-gb-segmented-button.js'],
      fixture: '<md-gb-segmented-button-set aria-label="View">${ITEMS}</md-gb-segmented-button-set>',
      item: '<md-gb-segmented-button value="${LABEL}">${LABEL}</md-gb-segmented-button>',
      items: 'md-gb-segmented-button',
      orientation: 'both',
      wrap: true,
      homeEnd: true,
      tabStops: 'single',
      spec: {
        entry: ['segmented-buttons-e08c31', 'segmented-buttons-4c08e6'],
        arrows: ['segmented-buttons-e7c14b', 'segmented-buttons/accessibility/use-cases/keyboard-navigation'],
        rtl: ['segmented-buttons-40eeca', 'segmented-buttons-3f65bc'],
        disabled: [],
        tabStops: ['segmented-buttons-e7c14b'],
      },
    },
  },
};

const LABELS = ['Alpha', 'Bravo', 'Charlie', 'Delta'];

function rovingTests(dir, c) {
  const tag = c.fixture.match(/^<([\w-]+)/)[1];
  const items = LABELS.map((label) => c.item.replaceAll('${LABEL}', label)).join('\n      ');
  const cite = (key) => (c.spec[key]?.length ? `    // spec: ${c.spec[key].join(', ')}\n` : '');
  const horizontal = c.orientation !== 'vertical';
  const vertical = c.orientation !== 'horizontal';
  const fwd = horizontal ? 'ArrowRight' : 'ArrowDown';
  const back = horizontal ? 'ArrowLeft' : 'ArrowUp';
  const cases = [];

  cases.push(`  it('is entered with Tab on the first item; the container takes no focus', async () => {
${cite('entry')}    const f = await setup();
    f.before.focus();
    await press('Tab');
    expect(focusedIndex(f.items)).toBe(0);
    expect(f.group.matches(':focus')).toBeFalse();
  });`);

  cases.push(`  it('moves focus to the next and previous item with ${fwd} / ${back}', async () => {
${cite('arrows')}    const f = await setup();
    await focusItem(f, 1);
    await press('${fwd}');
    expect(focusedIndex(f.items)).toBe(2);
    await press('${back}');
    await press('${back}');
    expect(focusedIndex(f.items)).toBe(0);
  });`);

  if (horizontal && vertical) {
    cases.push(`  it('also moves with ArrowDown / ArrowUp', async () => {
${cite('arrows')}    const f = await setup();
    await focusItem(f, 1);
    await press('ArrowDown');
    expect(focusedIndex(f.items)).toBe(2);
    await press('ArrowUp');
    expect(focusedIndex(f.items)).toBe(1);
  });`);
  } else {
    const other = horizontal ? 'ArrowDown' : 'ArrowRight';
    cases.push(`  it('does not move focus with ${other} (${c.orientation} only)', async () => {
${cite('arrows')}    const f = await setup();
    await focusItem(f, 1);
    await press('${other}');
    expect(focusedIndex(f.items)).toBe(1);
  });`);
  }

  cases.push(
    c.wrap
      ? `  it('wraps from the last item to the first and back', async () => {
${cite('arrows')}    const f = await setup();
    await focusItem(f, -1);
    await press('${fwd}');
    expect(focusedIndex(f.items)).toBe(0);
    await press('${back}');
    expect(focusedIndex(f.items)).toBe(f.items.length - 1);
  });`
      : `  it('stops at the ends', async () => {
${cite('arrows')}    const f = await setup();
    await focusItem(f, -1);
    await press('${fwd}');
    expect(focusedIndex(f.items)).toBe(f.items.length - 1);
  });`,
  );

  if (horizontal) {
    cases.push(`  it('mirrors Left and Right in right-to-left layouts, and Tab still enters on the first item', async () => {
${cite('rtl')}    const f = await setup({dir: 'rtl'});
    f.before.focus();
    await press('Tab');
    expect(focusedIndex(f.items)).toBe(0);
    await press('ArrowLeft');
    expect(focusedIndex(f.items)).toBe(1);
    await press('ArrowRight');
    expect(focusedIndex(f.items)).toBe(0);
  });`);
  }

  cases.push(
    c.homeEnd
      ? `  it('moves to the first and last item with Home and End', async () => {
${cite('homeEnd')}    const f = await setup();
    await focusItem(f, 1);
    await press('End');
    expect(focusedIndex(f.items)).toBe(f.items.length - 1);
    await press('Home');
    expect(focusedIndex(f.items)).toBe(0);
  });`
      : `  it('does not move focus with Home and End', async () => {
    const f = await setup();
    await focusItem(f, 1);
    await press('End');
    expect(focusedIndex(f.items)).toBe(1);
  });`,
  );

  cases.push(`  it('skips disabled items', async () => {
${cite('disabled')}    const f = await setup({disabled: 1});
    await focusItem(f, 0);
    await press('${fwd}');
    expect(focusedIndex(f.items)).toBe(2);
  });`);

  cases.push(
    c.tabStops === 'single'
      ? `  it('is one tab stop that remembers the last focused item', async () => {
${cite('tabStops')}    const f = await setup();
    await focusItem(f, 0);
    await press('${fwd}');
    await press('${fwd}');
    await press('Tab');
    expect(document.activeElement).toBe(f.after);
    await press('Shift+Tab');
    expect(focusedIndex(f.items)).toBe(2);
  });`
      : `  it('keeps every item in the tab order', async () => {
${cite('tabStops')}    const f = await setup();
    await focusItem(f, 0);
    await press('Tab');
    expect(focusedIndex(f.items)).toBe(1);
  });`,
  );

  return {
    tag,
    imports: c.imports,
    setup: `async function setup(opts: {dir?: string; disabled?: number} = {}) {
  const root = await mount(html\`
    <button id="before">Before</button>
    <div dir=\${opts.dir ?? 'ltr'}>
      ${c.fixture.replace('${ITEMS}', `\n      ${items}\n      `)}
    </div>
    <button id="after">After</button>
  \`);
  const items = [...root.querySelectorAll<HTMLElement>('${c.items}')];
  if (opts.disabled !== undefined) {
    items[opts.disabled].setAttribute('disabled', '');
    await settle();
  }
  return {
    group: root.querySelector<HTMLElement>('${tag}')!,
    items,
    before: root.querySelector<HTMLElement>('#before')!,
    after: root.querySelector<HTMLElement>('#after')!,
  };
}`,
    describe: `describe('<${tag}> roving focus contract (RovingFocusController: ${c.orientation}, ${c.wrap ? 'wrap' : 'no wrap'}, ${c.homeEnd ? 'Home/End' : 'no Home/End'}, ${c.tabStops === 'single' ? 'one tab stop' : 'every item tabbable'})', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`,
  };
}

/** Shared helpers of a generated file; each is emitted only when used. */
const HELPERS = {
  mount: `let container: HTMLElement | undefined;

async function mount(template: TemplateResult) {
  container?.remove();
  container = document.createElement('div');
  document.body.appendChild(container);
  render(template, container);
  await settle();
  return container;
}`,
  settle: `/** Waits for Lit updates and a frame. */
async function settle(root: ParentNode = document.body) {
  for (const el of root.querySelectorAll('*')) {
    const update = (el as Partial<ReactiveElement>).updateComplete;
    if (update) await update;
    if (el.shadowRoot) await settle(el.shadowRoot);
  }
  if (root !== document.body) return;
  await new Promise((resolve) => requestAnimationFrame(resolve));
}`,
  press: `/** Presses a key (or a chord such as \`Shift+Tab\`) on a real keyboard. */
async function press(key: string) {
  await sendKeys({press: key});
  await settle();
}`,
  focusedIndex: `/** The index of the item that holds focus (also inside its shadow root), or -1. */
function focusedIndex(items: Element[]) {
  const path: Element[] = [];
  let el = document.activeElement;
  while (el) {
    path.push(el);
    el = el.shadowRoot?.activeElement ?? null;
  }
  return items.findIndex((item) => path.some((e) => e === item || item.contains(e)));
}`,
  focusItem: `/** Focuses item \`index\` (negative counts from the end). */
async function focusItem(f: {items: HTMLElement[]}, index: number) {
  f.items[(index + f.items.length) % f.items.length].focus();
  await settle();
}`,
};

function file(dir, parts) {
  const imports = [...new Set(parts.flatMap((p) => p.imports))].map((m) => `import '${m}';`).join('\n');
  const body = parts.map((p) => `${p.setup}\n\n${p.describe}`).join('\n\n');
  // Emit only the helpers and imports the tests use: unused locals fail the
  // type check.
  // A module that defines its own `press` (or imports `sendKeys` itself) in
  // every test doesn't get the shared one.
  const defines = (name) => new RegExp(`(const|function) \\{?${name}\\b`).test(body);
  const uses = (name) => new RegExp(`\\b${name}\\(`).test(body) && !defines(name);
  const used = new Set(['mount', 'press', 'focusedIndex', 'focusItem'].filter(uses));
  if (used.has('mount') || used.has('press') || used.has('focusItem') || uses('settle')) used.add('settle');
  const helpers = Object.keys(HELPERS).filter((h) => used.has(h)).map((h) => HELPERS[h]);
  const lit = [
    /\bhtml`/.test(body) ? 'html' : '',
    used.has('mount') ? 'render' : '',
    used.has('settle') ? 'type ReactiveElement' : '',
    used.has('mount') ? 'type TemplateResult' : '',
  ].filter(Boolean);
  const head = [
    "// import 'jasmine'; (google3-only)",
    used.has('press') || uses('sendKeys') ?"import {sendKeys} from '@web/test-runner-commands';" : '',
    lit.length ? `import {${lit.join(', ')}} from 'lit';` : '',
    imports,
  ]
    .filter(Boolean)
    .join('\n');
  return `/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// AUTOGENERATED. DO NOT MODIFY.
// To modify this file, edit CONTRACTS in scripts/m3/gen-contract-tests.mjs (or
// its module in scripts/m3/contracts/) and run:
// node scripts/m3/gen-contract-tests.mjs ${dir}
//
// Contract tests: this component wires up the shared controllers (tested in
// components/shared/) as its spec page says.

${head}

${helpers.length ? `${helpers.join('\n\n')}\n\n` : ''}${body}
`;
}


/**
 * Contract templates of the other shared controllers, one module per
 * controller in `scripts/m3/contracts/<controller>.mjs`, each exporting:
 * - `entries`: `{[componentDir]: config}`;
 * - `tests(dir, config)`: `{imports: string[], setup: string, describe:
 *   string}` like {@link rovingTests}, where `setup` defines uniquely named
 *   helpers (e.g. `setupModal`) because all parts share one file and its
 *   helpers (`mount`, `settle`, `press`, `focusedIndex`, `focusItem`).
 */
const MODULES = [];
for (const f of (await readdir(join('scripts', 'm3', 'contracts')).catch(() => [])).sort()) {
  if (f.endsWith('.mjs')) MODULES.push(await import(pathToFileURL(join('scripts', 'm3', 'contracts', f)).href));
}

const argv = process.argv.slice(2);
const check = argv.includes('--check');
const only = argv.filter((a) => !a.startsWith('--'));
let stale = 0;
const dirs = [...new Set([...Object.keys(CONTRACTS), ...MODULES.flatMap((m) => Object.keys(m.entries))])].sort();
for (const dir of dirs) {
  if (only.length && !only.includes(dir)) continue;
  const contract = CONTRACTS[dir] ?? {};
  const parts = [];
  if (contract.rovingFocus) parts.push(rovingTests(dir, contract.rovingFocus));
  for (const m of MODULES) if (m.entries[dir]) parts.push(m.tests(dir, m.entries[dir]));
  const out = join(elementDir(dir), `${dir}_contract_test.ts`);
  const text = file(dir, parts);
  const old = await readFile(out, 'utf8').catch(() => '');
  if (old.replace(/\r\n/g, '\n') === text) continue;
  if (check) {
    stale++;
    console.log(`out of date: ${out}`);
    continue;
  }
  await writeFile(out, text);
  console.log(`wrote ${out}`);
}
if (check && stale) process.exitCode = 1;
