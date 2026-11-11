/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generates the json-render catalog of the library from its
 * public API (scripts/api/gen-api.mjs), and checks the M3 rules against the
 * spec.
 *
 *   node scripts/api/gen-json-render.mjs           # write the files below
 *   node scripts/api/gen-json-render.mjs --check   # fail if they are stale
 *
 * Writes:
 * - material-design-expressive/json-render/catalog.ts: one catalog
 *   component per md-gb-* element and per ARIA element they pair with
 *   (PAIRED_ARIA) (its JSON-serializable properties as Zod
 *   types that also take $-expressions, its slots, events, description,
 *   deprecation and M3 spec pages), plus the Text and Html primitives.
 * - material-design-expressive/json-render/CATALOG.md: the catalog and the
 *   M3 rules for review, with each component's spec pages.
 *
 * Checks, and fails on:
 * - an M3 rule (json-render/m3-rules.ts) whose component is not in the
 *   catalog;
 * - with the spec mirror (.m3-specs/pages), an M3 rule whose quote is no
 *   longer on its page.
 */

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {buildApi, pagesOf, specUrl} from './gen-api.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIR = join(ROOT, 'material-design-expressive', 'json-render');
const OUT_TS = join(DIR, 'catalog.ts');
const OUT_MD = join(DIR, 'CATALOG.md');
const SPECS = join(ROOT, '.m3-specs', 'pages');

/**
 * The ARIA elements the md-gb ones pair with, which a UI of the catalog
 * needs too: md-gb-tab's `tabpanel` is the id of an md-aria-tabpanel.
 */
const PAIRED_ARIA = new Set(['md-aria-tabpanel']);

/** md-gb-nav-bar -> NavBar, md-aria-tabpanel -> AriaTabpanel. */
const pascal = (tag) =>
  tag
    .replace(/^md-gb-/, '')
    .replace(/^md-/, '')
    .split('-')
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join('');
const str = (s) => JSON.stringify(s);
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/**
 * The Zod source of a manifest type text, or undefined when the type isn't
 * JSON-serializable (objects, functions, elements, dates).
 */
function zodOf(type) {
  const t = type.trim();
  if (t === 'boolean') return 'z.boolean()';
  if (t === 'string') return 'z.string()';
  if (t === 'number') return 'z.number()';
  if (t === 'string[]') return 'z.array(z.string())';
  if (t === 'number[]') return 'z.array(z.number())';
  const parts = t.split('|').map((p) => p.trim());
  const literals = [];
  const extra = new Set();
  for (const p of parts) {
    if (/^"[^"]*"$/.test(p) || /^-?\d+(\.\d+)?$/.test(p)) literals.push(JSON.parse(p));
    else if (p === 'undefined' || p === 'null') continue;
    else if (p === 'string' || p === 'number' || p === 'boolean') extra.add(p);
    else return undefined;
  }
  if (!literals.length) return extra.size === 1 ? `z.${[...extra][0]}()` : undefined;
  if (extra.has('string')) return 'z.string()';
  const strings = literals.filter((l) => typeof l === 'string');
  const base =
    strings.length === literals.length
      ? `z.enum([${strings.map(str).join(', ')}])`
      : `z.union([${literals.map((l) => `z.literal(${str(l)})`).join(', ')}])`;
  return extra.size ? `z.union([${base}, ${[...extra].map((e) => `z.${e}()`).join(', ')}])` : base;
}

/** The catalog components of the public elements. */
function components(elements) {
  return elements
    .filter((e) => e.tag.startsWith('md-gb-') || PAIRED_ARIA.has(e.tag))
    .map((e) => {
      const props = [];
      const skipped = [];
      for (const p of e.props) {
        const zod = zodOf(p.type);
        if (zod) props.push({name: p.name, zod, description: clean(p.description), attribute: p.attribute, boolean: p.type === 'boolean'});
        else skipped.push(`${p.name}: ${p.type}`);
      }
      // Every element takes an accessible name (ARIAMixin `ariaLabel`).
      if (!props.some((p) => p.name === 'ariaLabel')) {
        props.push({name: 'ariaLabel', zod: 'z.string()', description: 'The accessible name (aria-label).', attribute: 'aria-label', boolean: false});
      }
      // And an id, for the references between elements: a tab's
      // `tabpanel`, a menu's `anchor`, a navigation bar's `scroll-target`.
      if (!props.some((p) => p.name === 'id')) {
        props.push({name: 'id', zod: 'z.string()', description: 'The element id, for references from other elements (a tab\'s `tabpanel`, a menu\'s `anchor`).', attribute: 'id', boolean: false});
      }
      props.sort((a, b) => a.name.localeCompare(b.name));
      const slots = e.slots.map(([name]) => name || 'default');
      const events = e.events.map(([name]) => name);
      const {pages} = pagesOf(e.file);
      const spec = pages.map(specUrl);
      const deprecated = Boolean(e.deprecated);
      const description = [
        clean(e.summary).replace(/\.?$/, '.'),
        deprecated ? 'DEPRECATED in M3 Expressive, do not use.' : '',
        slots.length ? `Slots: ${slots.join(', ')}.` : 'No children.',
        events.length ? `Events: ${events.join(', ')}.` : '',
        pages.length ? `M3: ${pages.map((p) => p.split('/').pop()).join(', ')}.` : '',
      ]
        .filter(Boolean)
        .join(' ');
      return {name: pascal(e.tag), tag: e.tag, props, skipped, slots, events, description, deprecated, spec, pages};
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c, i, list) => {
      // One component per name: a second one would overwrite the first in
      // the catalog object (Text and Html are the primitives).
      if (['Text', 'Html'].includes(c.name) || list[i - 1]?.name === c.name) {
        throw new Error(`gen-json-render: <${c.tag}> is named ${c.name}, which the catalog already has; rename the element.`);
      }
      return c;
    });
}

/** catalog.ts */
function renderCatalog(list) {
  const lines = [
    '/**',
    ' * @license',
    ' * Copyright 2026 Google LLC',
    ' * SPDX-License-Identifier: Apache-2.0',
    ' */',
    '',
    '// Generated by scripts/api/gen-json-render.mjs from the public API',
    '// (custom-elements.json); do not edit.',
    '',
    "import {z} from 'zod';",
    "import {dynamic, schema} from './schema.js';",
    '',
    '/** The tag of the Text primitive: a text node, not an element. */',
    "export const TEXT_TAG = '#text';",
    '/** The tag of the Html primitive: its `tag` prop names the native element. */',
    "export const HTML_TAG = '#html';",
    '',
    '/** The native elements the Html primitive may create. */',
    'export const HTML_TAGS = [',
    "  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'button', 'label',",
    "  'section', 'header', 'footer', 'nav', 'main', 'aside', 'article', 'ul', 'ol', 'li',",
    "  'dl', 'dt', 'dd', 'strong', 'em', 'b', 'i', 'small', 'sub', 'sup', 'code', 'kbd',",
    "  'pre', 'blockquote', 'hr', 'br', 'figure', 'figcaption', 'img', 'table', 'thead',",
    "  'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'details', 'summary',",
    '] as const;',
    '',
    '/** Native elements without content or a closing tag. */',
    "export const HTML_VOID_TAGS = ['hr', 'br', 'img'] as const;",
    '',
    '/**',
    ' * The attributes the Html primitive sets, by prop: plain values. The href',
    ' * and src props are sanitized separately; ariaLabel is aria-label.',
    ' */',
    'export const HTML_ATTRIBUTES = {',
    "  id: 'id',",
    "  role: 'role',",
    "  alt: 'alt',",
    "  type: 'type',",
    "  popovertarget: 'popovertarget',",
    "  target: 'target',",
    "  lang: 'lang',",
    "  colspan: 'colspan',",
    "  rowspan: 'rowspan',",
    "  scope: 'scope',",
    "  ariaLabel: 'aria-label',",
    '} as const;',
    '',
    '/**',
    ' * The catalog components: one per md-gb-* element and md-aria-tabpanel (the',
    ' * panel of md-gb-tab), plus the Text and Html primitives. Props are the',
    ' * elements\' JSON-serializable properties.',
    ' */',
    'export const COMPONENTS = {',
    '  Text: {',
    "    tag: TEXT_TAG,",
    '    props: z.object({text: dynamic(z.string())}).strict(),',
    '    slots: [] as string[],',
    '    events: [] as string[],',
    '    attributes: {} as Record<string, string>,',
    '    booleans: [] as string[],',
    "    description: 'A text node: a label, an icon name or any text. Put it in a component\\'s children.',",
    '    deprecated: false,',
    '    spec: [] as string[],',
    '  },',
    '  Html: {',
    '    tag: HTML_TAG,',
    '    props: z',
    '      .object({',
    '        tag: z.enum(HTML_TAGS),',
    '        text: dynamic(z.string()).optional(),',
    '        id: z.string().optional(),',
    '        role: z.string().optional(),',
    '        ariaLabel: dynamic(z.string()).optional(),',
    '        href: dynamic(z.string()).optional(),',
    '        src: dynamic(z.string()).optional(),',
    '        alt: dynamic(z.string()).optional(),',
    "        type: z.enum(['button', 'submit', 'reset']).optional(),",
    '        popovertarget: z.string().optional(),',
    "        target: z.enum(['_self', '_blank']).optional(),",
    '        lang: z.string().optional(),',
    '        colspan: z.number().int().positive().optional(),',
    '        rowspan: z.number().int().positive().optional(),',
    "        scope: z.enum(['row', 'col', 'rowgroup', 'colgroup']).optional(),",
    '      })',
    '      .strict(),',
    "    slots: ['default'],",
    "    events: ['click', 'input', 'change'],",
    '    attributes: {} as Record<string, string>,',
    '    booleans: [] as string[],',
    "    description: 'A native element for slots that take plain HTML (a heading, a button of a split button, a panel). Prefer a catalog component when one exists.',",
    '    deprecated: false,',
    '    spec: [] as string[],',
    '  },',
  ];
  for (const c of list) {
    lines.push(`  ${c.name}: {`, `    tag: ${str(c.tag)},`, '    props: z');
    lines.push('      .object({');
    for (const p of c.props) {
      if (p.description) lines.push(`        /** ${p.description.replace(/\*\//g, '* /')} */`);
      lines.push(`        ${p.name}: dynamic(${p.zod}).optional(),`);
    }
    lines.push('      })', '      .strict(),');
    if (c.skipped.length) lines.push(`    // Not JSON-serializable, so not in the catalog: ${c.skipped.join('; ').replace(/\*\//g, '* /')}`);
    lines.push(
      `    slots: [${c.slots.map(str).join(', ')}] as string[],`,
      `    events: [${c.events.map(str).join(', ')}] as string[],`,
      `    attributes: {${c.props.filter((p) => p.attribute).map((p) => `${p.name}: ${str(p.attribute)}`).join(', ')}} as Record<string, string>,`,
      `    booleans: [${c.props.filter((p) => p.boolean).map((p) => str(p.name)).join(', ')}] as string[],`,
      `    description: ${str(c.description)},`,
      `    deprecated: ${c.deprecated},`,
      `    spec: [${c.spec.map(str).join(', ')}] as string[],`,
      '  },',
    );
  }
  lines.push(
    '};',
    '',
    '/** The name of a catalog component. */',
    'export type ComponentName = keyof typeof COMPONENTS;',
    '',
    '/** The catalog: the components above, and no actions beyond the built-in ones. */',
    'export const catalog = schema.createCatalog({components: COMPONENTS, actions: {}});',
    '',
  );
  return lines.join('\n');
}

/** CATALOG.md */
function renderMarkdown(list, rules) {
  const code = (s) => `\`${s}\``;
  const lines = [
    '# json-render catalog',
    '',
    'Generated by `scripts/api/gen-json-render.mjs` from the public API; do not',
    'edit. The catalog (`catalog.ts`) has one component per `md-gb-*` element',
    'and `md-aria-tabpanel` (the panel of `md-gb-tab`), with its',
    'JSON-serializable properties, slots and events, plus the `Text`',
    'and `Html` primitives. `renderSpec()` (`renderer.ts`) renders specs of it;',
    '`checkSpec()` (`check.ts`) validates them against the catalog and the M3',
    'rules below.',
    '',
    `| Component | Tag | Props | Slots | Events | M3 spec |`,
    '| --- | --- | --- | --- | --- | --- |',
  ];
  for (const c of list) {
    const spec = c.pages.length ? c.pages.map((p, i) => `[${p.split('/').pop()}](${c.spec[i]})`).join(', ') : 'none';
    lines.push(
      `| ${code(c.name)}${c.deprecated ? ' (deprecated)' : ''} | ${code(c.tag)} | ${c.props.length}${c.skipped.length ? ` (+${c.skipped.length} not JSON)` : ''} | ${c.slots.join(', ') || ' '} | ${c.events.join(', ') || ' '} | ${spec} |`,
    );
  }
  lines.push(
    '',
    '## M3 rules',
    '',
    'Checked by `checkM3()` and given to the generation prompt (`m3Prompt()`).',
    'Each quote is checked against its spec page on every generation.',
    '',
    '| Rule | Component | Severity | Spec |',
    '| --- | --- | --- | --- |',
  );
  for (const r of rules) {
    lines.push(`| ${r.rule} | ${code(r.component)} | ${r.severity} | [${r.source.page}](https://m3.material.io/${r.source.page}): "${r.source.quote}" |`);
  }
  lines.push('');
  return lines.join('\n');
}

const check = process.argv.includes('--check');
const {elements} = buildApi();
const list = components(elements);
// m3-rules.ts has type-only imports, so Node loads it directly.
const {M3_RULES} = await import(pathToFileURL(join(DIR, 'm3-rules.ts')).href);

const problems = [];
const names = new Set([...list.map((c) => c.name), 'Text', 'Html']);
for (const r of M3_RULES) {
  if (!names.has(r.component)) problems.push(`rule ${r.id}: no catalog component ${r.component}`);
  const page = join(SPECS, `${r.source.page}.md`);
  if (existsSync(SPECS)) {
    const text = existsSync(page) ? readFileSync(page, 'utf8').replace(/\s+/g, ' ') : '';
    if (!text.includes(r.source.quote)) problems.push(`rule ${r.id}: quote not on ${r.source.page}: "${r.source.quote}"`);
  }
}
if (problems.length) {
  console.error(`gen-json-render:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

const outputs = [
  [OUT_TS, renderCatalog(list)],
  [OUT_MD, renderMarkdown(list, M3_RULES)],
];
const norm = (s) => s.replace(/\r\n/g, '\n');
if (check) {
  const stale = outputs.filter(([file, text]) => !existsSync(file) || norm(readFileSync(file, 'utf8')) !== text);
  if (stale.length) {
    console.error(`gen-json-render: stale: ${stale.map(([f]) => f).join(', ')}; run \`node scripts/api/gen-json-render.mjs\`.`);
    process.exit(1);
  }
  console.log(`gen-json-render: catalog is up to date (${list.length} components, ${M3_RULES.length} M3 rules).`);
} else {
  for (const [file, text] of outputs) writeFileSync(file, text);
  const props = list.reduce((n, c) => n + c.props.length, 0);
  const skipped = list.reduce((n, c) => n + c.skipped.length, 0);
  console.log(
    `gen-json-render: ${list.length} components (+ Text, Html), ${props} props (${skipped} not JSON-serializable), ` +
      `${M3_RULES.length} M3 rules${existsSync(SPECS) ? ', quotes verified' : ''}.`,
  );
}
