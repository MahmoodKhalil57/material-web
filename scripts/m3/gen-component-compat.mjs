#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Writes site/content/_data/compat.json, the Compatibility section of each
 * /3.0/ component page (the `compat` shortcode): numbers and ids only, no
 * spec text, from the repository's own checks.
 *
 *   node scripts/m3/gen-component-compat.mjs [--lighthouse <dir>]
 *
 * Per component (docs/components/<slug>.md, its labs/gb directory from
 * the page's `{% api %}`):
 *
 * - m3: its M3 spec pages (m3.material.io), the spec units of those pages
 *   (.m3-specs/spec-checks/units.json: buildable, tested, excluded, tracked,
 *   uncovered) and its token audit (scripts/m3/audit-gb.mjs --gaps).
 * - baseline: the browser targets of Baseline widely available, and the
 *   features the component uses that aren't widely available, each guarded
 *   (@supports) or allowed with a reason (scripts/gb-baseline.mjs --verbose,
 *   the web-features package), plus its newer JavaScript APIs.
 * - aria: the WAI-ARIA roles it renders (from its sources), the APG pattern
 *   of each, its rows in the central axe and WAI-ARIA 1.3 suites
 *   (foundations/accessibility) and their known gaps.
 * - lighthouse: the category scores and the failed audits of the
 *   component's test page (/3.0/lab/<slug>/: its first example alone,
 *   site/content/lab.11ty.cjs), not of its docs page
 *   (site/scripts/lighthouse.mjs --desktop --out <dir> on those pages,
 *   read from <dir>/desktop); kept from the last run when no reports are
 *   given.
 */

import {execFileSync} from 'node:child_process';
import {elementDir} from '../element-dirs.mjs';
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {join} from 'node:path';
import {parseArgs} from 'node:util';

const require = createRequire(import.meta.url);
const {values: args} = parseArgs({options: {lighthouse: {type: 'string'}}});

const OUT = 'site/content/_data/compat.json';
const DOCS = 'docs/components';
const LABS = 'material-design-expressive/components';
// The central axe and ARIA suites, and the table of subjects they render.
const CENTRAL = 'material-design-expressive/foundations/accessibility';
const SUBJECTS = 'material-design-expressive/testing/subjects.ts';
const BUILDABLE = 0.3;

const run = (script, argv = []) => {
  try {
    return execFileSync(process.execPath, [script, ...argv], {
      encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    return (err.stdout ?? '').toString();
  }
};

// The M3 spec pages of each docs page (m3.material.io/components/<page>).
const SPEC_PAGES = {
  'app-bar': ['app-bars'], badge: ['badges'], 'button-group': ['button-groups'], button: ['buttons'],
  card: ['cards'], carousel: ['carousel'], checkbox: ['checkbox'], chip: ['chips'],
  'date-picker': ['date-pickers'], dialog: ['dialogs'], divider: ['divider'], 'fab-menu': ['fab-menu'],
  fab: ['floating-action-button', 'extended-fab'], 'icon-button': ['icon-buttons'], list: ['lists'],
  'loading-indicator': ['loading-indicator'], menu: ['menus'], 'navigation-bar': ['navigation-bar'],
  'navigation-drawer': ['navigation-drawer'], 'navigation-rail': ['navigation-rail'],
  progress: ['progress-indicators'], 'pull-to-refresh': [], radio: ['radio-button'], search: ['search'],
  'segmented-button': ['segmented-buttons'], select: ['menus'], sheets: ['bottom-sheets', 'side-sheets'],
  slider: ['sliders'], snackbar: ['snackbar'], 'split-button': ['split-button'], switch: ['switch'],
  tabs: ['tabs'], 'text-field': ['text-fields'], 'time-picker': ['time-pickers'], toolbar: ['toolbars'],
  tooltip: ['tooltips'],
};

// The WAI-ARIA APG pattern of a role (w3.org/WAI/ARIA/apg/patterns/<slug>/).
const APG = {
  button: ['Button', 'button'], checkbox: ['Checkbox', 'checkbox'], dialog: ['Dialog (Modal)', 'dialog-modal'],
  alertdialog: ['Alert and Message Dialogs', 'alertdialog'], menu: ['Menu and Menubar', 'menubar'],
  menuitem: ['Menu and Menubar', 'menubar'], menuitemcheckbox: ['Menu and Menubar', 'menubar'],
  menuitemradio: ['Menu and Menubar', 'menubar'], tablist: ['Tabs', 'tabs'], tab: ['Tabs', 'tabs'],
  slider: ['Slider', 'slider'], switch: ['Switch', 'switch'], radiogroup: ['Radio Group', 'radio'],
  radio: ['Radio Group', 'radio'], listbox: ['Listbox', 'listbox'], option: ['Listbox', 'listbox'],
  combobox: ['Combobox', 'combobox'], toolbar: ['Toolbar', 'toolbar'], tooltip: ['Tooltip', 'tooltip'],
  grid: ['Grid', 'grid'], spinbutton: ['Spinbutton', 'spinbutton'], alert: ['Alert', 'alert'],
  link: ['Link', 'link'], meter: ['Meter', 'meter'], tree: ['Treeview', 'treeview'],
  treeitem: ['Treeview', 'treeview'], feed: ['Feed', 'feed'], separator: ['Window Splitter', 'windowsplitter'],
};
// Roles that are structure, not a pattern of their own.
const STRUCTURAL = new Set(['none', 'presentation', 'group', 'img', 'row', 'gridcell', 'rowgroup', 'columnheader', 'rowheader', 'cell', 'list', 'listitem', 'region', 'status', 'log', 'heading', 'document', 'application', 'banner', 'navigation', 'complementary', 'contentinfo', 'main', 'search', 'form', 'article', 'progressbar', 'separator', 'textbox', 'searchbox']);
// WAI-ARIA 1.3 roles (abstract roles left out): what a template's role
// attribute can be, so other quoted words aren't taken for roles.
const ARIA_ROLES = new Set(`alert alertdialog application article banner blockquote button caption cell checkbox code
columnheader combobox comment complementary contentinfo definition deletion dialog directory document emphasis feed
figure form generic grid gridcell group heading image img insertion link list listbox listitem log main mark marquee
math menu menubar menuitem menuitemcheckbox menuitemradio meter navigation none note option paragraph presentation
progressbar radio radiogroup region row rowgroup rowheader scrollbar search searchbox separator slider spinbutton
status strong subscript suggestion superscript switch tab table tablist tabpanel term textbox time timer toolbar
tooltip tree treegrid treeitem`.split(/\s+/));

// --- Pages and their labs/gb directories -------------------------------------

const slugs = readdirSync(DOCS).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)).sort();
const dirOf = (slug) => /\{%\s*api\s+"([\w-]+)"/.exec(readFileSync(join(DOCS, `${slug}.md`), 'utf8'))?.[1] ?? '';
const sourcesOf = (dir) =>
  dir && existsSync(elementDir(dir))
    ? readdirSync(elementDir(dir)).filter((f) => f.endsWith('.ts') && !/(_test|\.d|cssresult)\.ts$/.test(f)).map((f) => join(elementDir(dir), f))
    : [];
const tagsOf = (dir) =>
  dir && existsSync(elementDir(dir)) ? readdirSync(elementDir(dir)).filter((f) => /^md-gb-[\w-]+\.ts$/.test(f) && !f.endsWith('.d.ts')).map((f) => f.slice(0, -3)) : [];

// --- M3: spec units and the token audit -----------------------------------------

const UNITS = '.m3-specs/spec-checks/units.json';
const units = existsSync(UNITS) ? JSON.parse(readFileSync(UNITS, 'utf8')) : [];
const isTracked = (u) => u.status === 'tracked' || u.status === 'gap' || u.status === 'spec-gap';
function specUnits(pages) {
  const r = {units: 0, buildable: 0, tested: 0, excluded: 0, tracked: 0, uncovered: 0};
  for (const u of units) {
    if (!pages.includes(u.page.replace(/^components\//, '').replace(/\.md$/, ''))) continue;
    r.units++;
    if (u.buildable >= BUILDABLE) r.buildable++;
    if (u.tested) r.tested++;
    if (u.status === 'excluded') r.excluded++;
    if (isTracked(u)) r.tracked++;
    if (u.buildable >= BUILDABLE && !u.status && !u.tested) r.uncovered++;
  }
  return r;
}
const tokenAudit = new Map();
const gaps = run('scripts/m3/audit-gb.mjs', ['--gaps']);
const tableAt = gaps.indexOf('component      decls');
if (tableAt >= 0) {
  for (const line of gaps.slice(tableAt).split('\n').slice(1)) {
    const c = line.trim().split(/\s+/);
    if (c.length === 8 && c.slice(1).every((x) => /^\d+$/.test(x))) {
      const [decls, match, derived, drift, none] = c.slice(1).map(Number);
      tokenAudit.set(c[0], {decls, match, derived, drift, none});
    }
  }
}

// --- Baseline ----------------------------------------------------------------------

const {features} = require('web-features');
const baseline = run('scripts/gb-baseline.mjs', ['--verbose']);
const targets = Object.fromEntries(
  [.../widely available targets: (.*)/.exec(baseline)?.[1]?.matchAll(/(\w+) ([\d.]+)/g) ?? []].map((m) => [m[1], m[2]]),
);
// BCD key -> web-features id, from the summary table.
const featureOfKey = new Map();
for (const line of baseline.split('\n')) {
  const c = line.trim().split(/\s+/);
  if (/^css\./.test(c[0]) && c.length >= 7 && /^(limited|newly)$/.test(c[2])) featureOfKey.set(c[0], c[1]);
}
const cssUses = new Map(); // dir -> Map(feature id -> Set(guarded|allowed))
for (const m of baseline.matchAll(/^\s+labs\/gb\/components\/([\w-]+)\/[^:]+:.*\[(css\.[^\]]+)\] (guarded|allowed|unguarded)$/gm)) {
  const [, dir, key, how] = m;
  const id = featureOfKey.get(key) ?? key;
  const byFeature = cssUses.get(dir) ?? cssUses.set(dir, new Map()).get(dir);
  (byFeature.get(id) ?? byFeature.set(id, new Set()).get(id)).add(how);
}
// The JavaScript APIs of the report that aren't widely available, by source
// pattern.
const JS_APIS = [
  ['CloseWatcher', /\bCloseWatcher\b/, 'close-watcher'],
  ['CSS.registerProperty()', /CSS\.registerProperty\b/, 'registered-custom-properties'],
  ['document.startViewTransition()', /startViewTransition\b/, 'view-transitions'],
  ['ariaActiveDescendantElement', /ariaActiveDescendantElement\b/, 'aria-attribute-reflection'],
  ['commandForElement (invoker commands)', /commandForElement\b|\bcommandfor\b/, 'invoker-commands'],
  ['popover', /\.popover\b|\bpopover=|showPopover|hidePopover/, 'popover'],
];
const statusOf = (id) => {
  const s = features[id]?.status?.baseline;
  return s === 'high' ? 'widely' : s === 'low' ? 'newly' : 'limited';
};

// --- ARIA ---------------------------------------------------------------------------

const subjectsSrc = [SUBJECTS, join(CENTRAL, 'aria-rows.ts'), join(CENTRAL, 'axe-helpers.ts')]
  .map((f) => (existsSync(f) ? readFileSync(f, 'utf8') : ''))
  .join('\n');
const rowChunks = subjectsSrc.split(/\bid: '/).slice(1);
const gapCount = (name, file) => {
  const src = existsSync(join(CENTRAL, file)) ? readFileSync(join(CENTRAL, file), 'utf8') : '';
  const body = src.split(`export const ${name}`)[1]?.split(/\n\}?;?\n\n/)[0] ?? '';
  return [...body.matchAll(/^\s{2}'?([\w-]+)'?:\s*[[{]/gm)].map((m) => m[1]);
};
const axeGaps = gapCount('AXE_GAPS', 'axe-helpers.ts');
const ariaGaps = gapCount('ARIA_GAPS', 'aria-rows.ts');

// Native elements in a template (html`...`) and their implicit roles.
const IMPLICIT = [
  [/<button\b/, 'button'],
  [/<a\b[^>]*\bhref=/, 'link'],
  [/<dialog\b/, 'dialog'],
  [/<input\b[^>]*type="checkbox"[^>]*\bswitch\b|role="switch"/, 'switch'],
  [/<input\b[^>]*type="checkbox"/, 'checkbox'],
  [/<input\b[^>]*type="radio"/, 'radio'],
  [/<input\b[^>]*type="range"/, 'slider'],
  [/<textarea\b|<input\b(?![^>]*type="(?:checkbox|radio|range|hidden)")/, 'textbox'],
  [/<progress\b/, 'progressbar'],
  [/<hr\b/, 'separator'],
];

function rolesOf(dir) {
  const roles = new Set();
  for (const f of sourcesOf(dir)) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/\.role\s*=\s*(?:[^;'"]*\?\s*)?['"]([a-z]+)['"](?:\s*:\s*['"]([a-z]+)['"])?/g)) {
      roles.add(m[1]);
      if (m[2]) roles.add(m[2]);
    }
    for (const m of src.matchAll(/\brole="([a-z]+)"/g)) roles.add(m[1]);
    for (const m of src.matchAll(/\brole=\$\{[^}]*?['"]([a-z]+)['"][^}]*?['"]([a-z]+)['"]/g)) {
      roles.add(m[1]);
      roles.add(m[2]);
    }
    // Native elements in the templates, by their implicit roles.
    for (const [re, role] of IMPLICIT) if (re.test(src)) roles.add(role);
  }
  return [...roles].filter((r) => ARIA_ROLES.has(r) && r !== 'none' && r !== 'presentation').sort();
}

// --- Lighthouse ----------------------------------------------------------------------

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
function lighthouseOf(slug) {
  // The component's test page (site/content/lab.11ty.cjs), not its docs page.
  const file = args.lighthouse ? join(args.lighthouse, 'desktop', `3.0-lab-${slug}.report.json`) : '';
  if (!file || !existsSync(file)) {
    // The last run's, when it was of the test page.
    const last = previous.components?.[slug]?.lighthouse;
    return last?.page?.startsWith('/3.0/lab/') ? last : null;
  }
  const report = JSON.parse(readFileSync(file, 'utf8'));
  const score = (id) => Math.round((report.categories[id]?.score ?? 0) * 100);
  const failed = Object.values(report.audits)
    .filter((a) => a.score !== null && a.score < 0.9 && !['informative', 'manual', 'notApplicable'].includes(a.scoreDisplayMode))
    .map((a) => a.title);
  return {
    page: `/3.0/lab/${slug}/`,
    performance: score('performance'),
    accessibility: score('accessibility'),
    bestPractices: score('best-practices'),
    seo: score('seo'),
    failed,
    preset: 'desktop',
    version: report.lighthouseVersion,
    date: report.fetchTime.slice(0, 10),
  };
}

// --- Write ---------------------------------------------------------------------------

const components = {};
for (const slug of slugs) {
  const dir = dirOf(slug);
  const pages = SPEC_PAGES[slug] ?? [];
  const sources = sourcesOf(dir).map((f) => readFileSync(f, 'utf8')).join('\n');
  const uses = cssUses.get(dir) ?? new Map();
  const tags = tagsOf(dir);
  const rows = rowChunks.filter((chunk) => tags.some((t) => chunk.includes(`<${t}`))).length;
  const roles = rolesOf(dir);
  const patterns = [...new Map(roles.filter((r) => APG[r] && !STRUCTURAL.has(r)).map((r) => [APG[r][1], APG[r][0]]))].map(
    ([path, name]) => ({name, url: `https://www.w3.org/WAI/ARIA/apg/patterns/${path}/`}),
  );
  components[slug] = {
    m3: {
      pages: pages.map((p) => ({name: p, url: `https://m3.material.io/components/${p}/overview`})),
      ...specUnits(pages),
      tokens: tokenAudit.get(dir) ?? null,
    },
    baseline: {
      enhancements: [...uses]
        .map(([id, how]) => ({
          id,
          name: features[id]?.name ?? id,
          status: statusOf(id),
          how: how.has('unguarded') ? 'unguarded' : how.has('guarded') ? 'guarded' : 'allowed',
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      js: JS_APIS.filter(([, re]) => re.test(sources)).map(([name, , id]) => ({name, id, status: statusOf(id)})).filter((a) => a.status !== 'widely'),
    },
    aria: {
      roles,
      patterns,
      rows,
      gaps: [...axeGaps, ...ariaGaps].filter((g) => tags.some((t) => g.includes(t.replace(/^md-gb-/, '')))).length,
    },
    lighthouse: lighthouseOf(slug),
  };
}

writeFileSync(OUT, JSON.stringify({targets, components}, null, 2) + '\n');
const withLh = Object.values(components).filter((c) => c.lighthouse).length;
console.log(`gen-component-compat: ${slugs.length} components -> ${OUT} (${withLh} with Lighthouse scores)`);
