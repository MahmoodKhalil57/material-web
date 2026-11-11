/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Writes material-design-expressive/SPEC-MAP.md: each M3 spec
 * page, the library folder that implements it, its custom elements and its
 * docs page. Folder names stay short (`appbar`, not `app-bars`), so this
 * table is how to get from a spec page to the code and back.
 *
 *   node scripts/m3/gen-spec-map.mjs           # write the table
 *   node scripts/m3/gen-spec-map.mjs --check   # fail if it is stale
 *
 * Fails when a component folder or a components spec page is missing from
 * SPEC_MAP, so a new component can't be added without its spec pages.
 * Elements are read from each folder's `md-gb-*.ts` / `md-aria-*.ts` files.
 * Spec pages are checked against the local spec mirror (.m3-specs/pages)
 * when it exists.
 */

import {existsSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {elementDirs} from '../element-dirs.mjs';

const LIB = 'material-design-expressive';
const SPECS = join('.m3-specs', 'pages');
const OUT = join(LIB, 'SPEC-MAP.md');

/**
 * Library folder -> the spec pages it implements (paths under
 * .m3-specs/pages, without `.md`), its docs page (under docs/) and a note.
 */
export const SPEC_MAP = [
  // Components (m3.material.io/components).
  {dir: 'components/appbar', pages: ['components/app-bars'], docs: 'components/app-bar'},
  {dir: 'components/badge', pages: ['components/badges'], docs: 'components/badge'},
  {dir: 'components/button', pages: ['components/buttons', 'components/all-buttons'], docs: 'components/button',
    note: '`all-buttons` is the overview of every button type.'},
  {dir: 'components/buttongroup', pages: ['components/button-groups'], docs: 'components/button-group'},
  {dir: 'components/card', pages: ['components/cards'], docs: 'components/card'},
  {dir: 'components/carousel', pages: ['components/carousel'], docs: 'components/carousel'},
  {dir: 'components/checkbox', pages: ['components/checkbox'], docs: 'components/checkbox'},
  {dir: 'components/chip', pages: ['components/chips'], docs: 'components/chip'},
  {dir: 'components/datepicker', pages: ['components/date-pickers'], docs: 'components/date-picker'},
  {dir: 'components/dialog', pages: ['components/dialogs'], docs: 'components/dialog'},
  {dir: 'components/divider', pages: ['components/divider'], docs: 'components/divider'},
  {dir: 'components/fab', pages: ['components/floating-action-button', 'components/extended-fab'], docs: 'components/fab',
    note: 'One element for both pages: a `label` makes it an extended FAB.'},
  {dir: 'components/fabmenu', pages: ['components/fab-menu'], docs: 'components/fab-menu'},
  {dir: 'components/iconbutton', pages: ['components/icon-buttons'], docs: 'components/icon-button'},
  {dir: 'components/list', pages: ['components/lists'], docs: 'components/list'},
  {dir: 'components/loadingindicator', pages: ['components/loading-indicator'], docs: 'components/loading-indicator'},
  {dir: 'components/menu', pages: ['components/menus'], docs: 'components/menu'},
  {dir: 'components/navbar', pages: ['components/navigation-bar'], docs: 'components/navigation-bar'},
  {dir: 'components/navdrawer', pages: ['components/navigation-drawer'], docs: 'components/navigation-drawer',
    note: 'Deprecated: no longer recommended in M3 Expressive. Use the expanded navigation rail.'},
  {dir: 'components/navrail', pages: ['components/navigation-rail'], docs: 'components/navigation-rail'},
  {dir: 'components/progress', pages: ['components/progress-indicators'], docs: 'components/progress'},
  {dir: 'components/radio', pages: ['components/radio-button'], docs: 'components/radio'},
  {dir: 'components/search', pages: ['components/search'], docs: 'components/search'},
  {dir: 'components/segmentedbutton', pages: ['components/segmented-buttons'], docs: 'components/segmented-button'},
  {dir: 'components/sheet', pages: ['components/bottom-sheets', 'components/side-sheets'], docs: 'components/sheets'},
  {dir: 'components/slider', pages: ['components/sliders'], docs: 'components/slider'},
  {dir: 'components/snackbar', pages: ['components/snackbar'], docs: 'components/snackbar'},
  {dir: 'components/splitbutton', pages: ['components/split-button'], docs: 'components/split-button'},
  {dir: 'components/switch', pages: ['components/switch'], docs: 'components/switch'},
  {dir: 'components/tabs', pages: ['components/tabs'], docs: 'components/tabs'},
  {dir: 'components/textfield', pages: ['components/text-fields'], docs: 'components/text-field'},
  {dir: 'components/timepicker', pages: ['components/time-pickers'], docs: 'components/time-picker'},
  {dir: 'components/toolbar', pages: ['components/toolbars'], docs: 'components/toolbar'},
  {dir: 'components/tooltip', pages: ['components/tooltips'], docs: 'components/tooltip'},
  // Extras (extras/): the library's own components, with no page of their
  // own in the M3 components index. Each follows the pages listed.
  {dir: 'extras/scaffold', pages: ['foundations/layout/scaffold'], docs: 'foundations/scaffold',
    note: 'A Foundations > Layout page, not a component.'},
  {dir: 'extras/select', pages: ['components/menus', 'components/text-fields'], docs: 'components/select',
    note: 'No page of its own: a menu opened from a text field.'},
  {dir: 'extras/pulltorefresh', pages: ['components/loading-indicator'], docs: 'components/pull-to-refresh',
    note: 'No page of its own: the loading indicator page covers pull to refresh.'},
  // Elements outside the component folders.
  {dir: 'styles/icons', pages: ['styles/icons'], docs: 'styles/icons'},
  {dir: 'styles/motion/transitions', pages: ['styles/motion/transitions'], docs: 'styles/motion-transitions'},
  {dir: 'foundations/accessibility/aria', pages: [], docs: null,
    note: 'Headless WAI-ARIA patterns that the components build on; M3 has no page for them.'},
];

const fail = (msg) => {
  console.error(`gen-spec-map: ${msg}`);
  process.exit(1);
};

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'demo' ? [] : walk(p);
    return [p];
  });

const elementsOf = (dir) =>
  walk(join(LIB, dir))
    .map((p) => p.replace(/\\/g, '/').split('/').pop())
    .filter((f) => /^md-(gb|aria)-[a-z0-9-]+\.ts$/.test(f) && !/(_test|\.d)\.ts$/.test(f))
    .map((f) => f.slice(0, -3))
    .sort();

// Every component folder, in every element root, is in the map.
const mapped = new Set(SPEC_MAP.map((e) => e.dir));
for (const {root, name} of elementDirs()) {
  if (!mapped.has(`${root}/${name}`)) fail(`${root}/${name} has no entry in SPEC_MAP`);
}
// components/ is the M3 components index: a folder there owns a components
// page (its first page) that no other components/ folder starts with.
// Anything else (a composite, a layout, a behavior) goes in extras/.
const owners = new Map();
for (const e of SPEC_MAP.filter((e) => e.dir.startsWith('components/'))) {
  const primary = e.pages[0];
  if (!primary?.startsWith('components/')) fail(`${e.dir} has no M3 components page; move it to extras/`);
  if (owners.has(primary)) fail(`${e.dir} and ${owners.get(primary)} both start with ${primary}; one belongs in extras/`);
  owners.set(primary, e.dir);
}
for (const e of SPEC_MAP.filter((e) => e.dir.startsWith('extras/'))) {
  if (!e.note) fail(`${e.dir} needs a note saying which pages it follows`);
}
for (const e of SPEC_MAP) {
  if (!existsSync(join(LIB, e.dir))) fail(`${e.dir} does not exist`);
  if (e.docs && !existsSync(join('docs', `${e.docs}.md`))) fail(`docs/${e.docs}.md does not exist`);
}
// Every components spec page is implemented somewhere (with the mirror).
if (existsSync(SPECS)) {
  const claimed = new Set(SPEC_MAP.flatMap((e) => e.pages));
  for (const e of SPEC_MAP) {
    for (const p of e.pages) {
      if (!existsSync(join(SPECS, `${p}.md`))) fail(`${e.dir}: no spec page ${p}.md`);
    }
  }
  for (const f of readdirSync(join(SPECS, 'components'))) {
    const page = `components/${f.replace(/\.md$/, '')}`;
    if (f.endsWith('.md') && !claimed.has(page)) fail(`spec page ${page} has no folder in SPEC_MAP`);
  }
}

// A page's URL is the `Source:` line the spec mirror recorded; without the
// mirror, the mirror's paths match the site's.
const specUrl = (p) => {
  const file = join(SPECS, `${p}.md`);
  const source = existsSync(file) && readFileSync(file, 'utf8').match(/^Source: (\S+)/m);
  return source ? source[1] : `https://m3.material.io/${p}`;
};
const row = (e) => {
  const pages = e.pages.length
    ? e.pages.map((p) => `[${p.split('/').pop()}](${specUrl(p)})`).join(', ')
    : '-';
  const elements = elementsOf(e.dir).map((t) => `\`${t}\``).join(', ') || '-';
  const docs = e.docs ? `[${e.docs.split('/').pop()}](../docs/${e.docs}.md)` : '-';
  return `| ${pages} | \`${e.dir}/\` | ${elements} | ${docs} | ${e.note ?? ''} |`;
};

const table = (entries) =>
  ['| Spec pages | Folder | Elements | Docs | Notes |', '| --- | --- | --- | --- | --- |', ...entries.map(row)].join('\n');

const text = `# Spec map

Generated by \`scripts/m3/gen-spec-map.mjs\`; edit \`SPEC_MAP\` there, not this file.

Each M3 spec page, the folder that implements it, its custom elements and
its docs page. Folder names are short (\`appbar\`, not \`app-bars\`), so use
this table to go from a spec page to the code. The library's other folders
follow the docs pillars directly (\`foundations/\`, \`styles/\`); see the
repository README.

## Components

\`components/\` holds the components of the M3 components index, one folder
per component.

${table(SPEC_MAP.filter((e) => e.dir.startsWith('components/')))}

## Extras

\`extras/\` holds the library's own components: a composite, a layout and a
behavior that the M3 components index has no page for. Each follows the
pages listed.

${table(SPEC_MAP.filter((e) => e.dir.startsWith('extras/')))}

## Other elements

${table(SPEC_MAP.filter((e) => !/^(components|extras)\//.test(e.dir)))}
`;

if (process.argv.includes('--check')) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : '';
  if (current !== text) fail(`${OUT} is stale; run \`node scripts/m3/gen-spec-map.mjs\`.`);
  console.log(`${OUT} is up to date.`);
} else {
  writeFileSync(OUT, text);
  console.log(`Wrote ${OUT} (${SPEC_MAP.length} rows).`);
}
