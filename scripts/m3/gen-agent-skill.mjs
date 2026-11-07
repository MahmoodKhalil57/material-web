#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Writes a Claude Code skill that teaches an agent to use the `md-gb-*`
 * elements of labs/gb: `labs/gb/skill/SKILL.md` plus one reference file per
 * component directory under `labs/gb/skill/reference/`.
 *
 *   node scripts/m3/gen-agent-skill.mjs           # write
 *   node scripts/m3/gen-agent-skill.mjs --check   # fail if the output is stale
 *
 * Sources:
 * - The elements' API (tag, attributes and properties with types and
 *   defaults, slots, events, CSS parts and custom properties, public
 *   methods) comes from the TypeScript sources, read with the compiler API
 *   and the JSDoc of each class. The Custom Elements Manifest
 *   (`npm run build:manifest`, now working for labs/gb) holds most of the
 *   same data, but not all of it: classes extending a mixin chain
 *   (`baseClass = mixinX(mixinY(LitElement))`) lose the mixin-inherited
 *   properties (disabled, name, value, form, ...), the analyzer does not
 *   record `customElements.define` tag names (the build script patches them
 *   in), and it has no flag for property-only versus attribute properties. So
 *   the TypeScript reader stays the source for this skill.
 * - Usage rules come from the component entries of scripts/m3/CHECKLIST.md
 *   (our own summaries) and the "app owns this" lines of
 *   scripts/m3/exclusions/*.md. No spec page text is copied.
 *
 * The output has no timestamps, so a repeated run is byte-identical.
 */

import {existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync} from 'node:fs';
import {join, relative, resolve, sep} from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const ROOT = process.cwd();
const GB = resolve(ROOT, 'labs/gb');
const COMPONENTS = join(GB, 'components');
const OUT = join(GB, 'skill');
const CHECKLIST = 'scripts/m3/CHECKLIST.md';
const EXCLUSIONS = 'scripts/m3/exclusions';
const check = process.argv.includes('--check');

const norm = (s) => s.replace(/\r\n/g, '\n');
const posix = (p) => p.split(sep).join('/');

// ---------------------------------------------------------------------------
// 1. Elements from the TypeScript sources.

const entryFiles = readdirSync(COMPONENTS, {withFileTypes: true})
  .filter((d) => d.isDirectory() && d.name !== 'shared')
  .flatMap((d) =>
    readdirSync(join(COMPONENTS, d.name))
      .filter((f) => /^md-gb-.*\.ts$/.test(f) && !f.endsWith('.d.ts'))
      .map((f) => join(COMPONENTS, d.name, f)),
  )
  .sort();

const cfgPath = join(GB, 'tsconfig.json');
const cfg = ts.readConfigFile(cfgPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, GB);
const program = ts.createProgram({
  rootNames: [...entryFiles, join(ROOT, 'types/css-imports.d.ts')],
  options: {...parsed.options, noEmit: true, skipLibCheck: true},
});
const checker = program.getTypeChecker();

/** Tag -> {dir, tag, className, summary, ...}. */
const elements = [];
for (const file of entryFiles) {
  const source = program.getSourceFile(file);
  const dir = posix(relative(COMPONENTS, file)).split('/')[0];
  ts.forEachChild(source, function visit(node) {
    if (ts.isPropertySignature(node) && node.type && node.name) {
      const tag = node.name.text ?? node.name.getText().replace(/['"]/g, '');
      if (/^md-gb-/.test(tag)) elements.push(describe(dir, tag, node, file));
    }
    ts.forEachChild(node, visit);
  });
}
elements.sort((a, b) => a.tag.localeCompare(b.tag));

function describe(dir, tag, node, file) {
  const type = checker.getTypeFromTypeNode(node.type);
  const symbol = type.getSymbol();
  const classes = classChain(type);
  const own = ts.getJSDocCommentsAndTags(node).find(ts.isJSDoc);
  const summary = firstParagraph(flatten(own?.comment) || classes.map(docText).find(Boolean) || '');
  return {
    dir,
    tag,
    file: posix(relative(ROOT, file)),
    className: symbol?.getName() ?? '',
    summary,
    ...collectApi(type, classes),
  };
}

/** The class declarations of a type and its base classes, most derived first. */
function classChain(type) {
  const out = [];
  const seen = new Set();
  (function walk(t) {
    const sym = t.getSymbol();
    for (const d of sym?.declarations ?? []) {
      if (ts.isClassDeclaration(d) && !seen.has(d) && !isLibrary(d.getSourceFile())) {
        seen.add(d);
        out.push(d);
      }
    }
    if (sym && sym.flags & (ts.SymbolFlags.Class | ts.SymbolFlags.Interface)) {
      for (const base of checker.getBaseTypes(t)) walk(base);
    }
  })(type);
  return out;
}

function isLibrary(sf) {
  return program.isSourceFileDefaultLibrary(sf) || /node_modules/.test(sf.fileName);
}

function docText(decl) {
  const doc = ts.getJSDocCommentsAndTags(decl).find(ts.isJSDoc);
  return doc ? flatten(doc.comment) : '';
}

function flatten(comment) {
  if (!comment) return '';
  if (typeof comment === 'string') return comment;
  return comment.map((c) => c.text ?? '').join('');
}

function firstParagraph(text) {
  return clean(text.split(/\n\s*\n/)[0] ?? '');
}

function clean(text) {
  return text
    .replace(/\{@link\s+(?:[^|}\s]+\s*\|?\s*)?([^}]*)\}/g, '$1')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectApi(type, classes) {
  const slots = new Map();
  const events = new Map();
  const parts = new Map();
  const cssProps = new Map();
  for (const decl of [...classes].reverse()) {
    for (const tag of ts.getJSDocTags(decl)) {
      const name = tag.tagName.text;
      const text = clean(flatten(tag.comment));
      if (name === 'slot') {
        const m = text.match(/^(?:(\S+)\s+-\s*|-\s*)?(.*)$/);
        slots.set(m[1] ?? '', m[2]);
      } else if (name === 'fires' || name === 'event') {
        const m = text.match(/^(?:\{([^}]*)\}\s*)?(\S+)\s*(?:-\s*)?(.*)$/);
        if (m) events.set(m[2], {type: m[1] ?? 'Event', description: m[3]});
      } else if (name === 'csspart') {
        const m = text.match(/^(\S+)\s*(?:-\s*)?(.*)$/);
        if (m) parts.set(m[1], m[2]);
      } else if (name === 'cssprop' || name === 'cssproperty') {
        const m = text.match(/^(\S+)\s*(?:-\s*)?(.*)$/);
        if (m) cssProps.set(m[1], m[2]);
      }
    }
  }
  const props = [];
  const methods = [];
  for (const sym of checker.getPropertiesOfType(type)) {
    const name = sym.getName();
    if (name.startsWith('_') || name.startsWith('#')) continue;
    const decls = sym.declarations ?? [];
    if (!decls.length || decls.every((d) => isLibrary(d.getSourceFile()))) continue;
    const flags = decls.map((d) => ts.getCombinedModifierFlags(d));
    if (flags.some((f) => f & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected))) continue;
    if (flags.some((f) => f & ts.ModifierFlags.Static)) continue;
    const reactive = decls.map(propertyDecorator).find(Boolean);
    const doc = clean(ts.displayPartsToString(sym.getDocumentationComment(checker)));
    if (reactive) {
      const primary = decls.find((d) => ts.isPropertyDeclaration(d) && d.initializer);
      const propType = checker.typeToString(
        checker.getTypeOfSymbolAtLocation(sym, decls[0]),
        undefined,
        ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
      );
      props.push({
        name,
        attribute: reactive.attribute === false ? '' : (reactive.attribute ?? name.toLowerCase()),
        reflect: !!reactive.reflect,
        type: propType,
        default: primary ? primary.initializer.getText().replace(/\s+/g, ' ') : '',
        description: doc,
      });
    } else if (decls.some((d) => ts.isMethodDeclaration(d)) && !isFrameworkFile(decls[0])) {
      methods.push({
        name,
        signature: checker.typeToString(
          checker.getTypeOfSymbolAtLocation(sym, decls[0]),
          undefined,
          ts.TypeFormatFlags.NoTruncation,
        ),
        description: doc,
      });
    }
  }
  props.sort((a, b) => a.name.localeCompare(b.name));
  methods.sort((a, b) => a.name.localeCompare(b.name));
  const sorted = (m) => [...m].sort(([a], [b]) => a.localeCompare(b));
  return {
    props,
    methods,
    slots: sorted(slots),
    events: sorted(events),
    parts: sorted(parts),
    cssProps: sorted(cssProps),
  };
}

/** Methods of Lit and the mixins' plumbing are not part of the usage API. */
function isFrameworkFile(decl) {
  return /[\\/]internal[\\/]/.test(decl.getSourceFile().fileName) && !/labs[\\/]gb/.test(decl.getSourceFile().fileName)
    ? true
    : /[\\/]lit[\\/]|reactive-element/.test(decl.getSourceFile().fileName);
}

/** The options of a `@property(...)` decorator on a declaration, or undefined. */
function propertyDecorator(decl) {
  for (const dec of ts.canHaveDecorators(decl) ? (ts.getDecorators(decl) ?? []) : []) {
    const call = dec.expression;
    const name = ts.isCallExpression(call) ? call.expression.getText() : call.getText();
    if (name !== 'property') continue;
    const opts = {};
    const arg = ts.isCallExpression(call) ? call.arguments[0] : undefined;
    if (arg && ts.isObjectLiteralExpression(arg)) {
      for (const p of arg.properties) {
        if (!ts.isPropertyAssignment(p)) continue;
        const key = p.name.getText();
        if (key === 'attribute') opts.attribute = p.initializer.kind === ts.SyntaxKind.FalseKeyword ? false : p.initializer.text;
        else if (key === 'reflect') opts.reflect = p.initializer.kind === ts.SyntaxKind.TrueKeyword;
      }
    }
    return opts;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// 2. Usage rules from the checklist and the exclusions.

const checklist = norm(readFileSync(CHECKLIST, 'utf8'));
const componentSection = checklist.slice(checklist.indexOf('## Components'), checklist.indexOf('\n## Styles'));
const rulesByDir = new Map();
{
  let current;
  for (const line of componentSection.split('\n')) {
    const top = line.match(/^- \[[x~ -]\] \*\*(.+?)\*\*(?: \((.*?)\))?/);
    if (top) {
      const dirs = [...(top[2] ?? '').matchAll(/`([a-z]+)`/g)].map((m) => m[1]);
      current = {title: top[1], notes: []};
      for (const d of dirs.slice(0, 1)) {
        if (!rulesByDir.has(d)) rulesByDir.set(d, []);
        rulesByDir.get(d).push(current);
      }
      continue;
    }
    const sub = line.match(/^ {2}- (\[[x~ -]\] )?(.*)$/);
    if (sub && current) {
      const text = cleanRule(sub[2]);
      if (!text || /^Tokens ·/.test(text)) continue;
      const partial = sub[1] && sub[1] !== '[x] ';
      current.notes.push(partial ? `${text} (not complete in labs/gb)` : text);
    }
  }
}

function cleanRule(text) {
  return text
    .replace(/<!--.*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Exclusion lines that say the app owns something. */
const appOwned = [];
for (const file of readdirSync(EXCLUSIONS).filter((f) => f.endsWith('.md') && f !== 'README.md').sort()) {
  let heading = '';
  for (const raw of norm(readFileSync(join(EXCLUSIONS, file), 'utf8')).split('\n')) {
    const h = raw.match(/^## (.*)/);
    if (h) heading = h[1];
    const bullet = raw.match(/^- (.*)/);
    if (!bullet) continue;
    const text = cleanRule(bullet[1]);
    if (/\bapp(?:'s| content| author| sets| picks| decides| builds| chooses| owns|\b)|consumer/i.test(text) && /\bapp\b|app's|consumer/i.test(text)) {
      if (!/caption|figure|list label|legend/i.test(heading + ' ' + text)) appOwned.push({heading, text});
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Markdown.

const code = (s) => '`' + String(s).replace(/`/g, "'") + '`';
const cell = (s) => String(s).replace(/\|/g, '\\|');

function elementDoc(e) {
  const out = [];
  out.push(`### ${code('<' + e.tag + '>')}`, '');
  if (e.summary) out.push(e.summary, '');
  out.push(`Source: ${code(e.file)}  `, `Import: ${code("import '@material/web/labs/gb/components/" + e.dir + "/" + e.tag + ".js';")}`, '');
  if (e.props.length) {
    out.push('Attributes and properties', '', '| Property | Attribute | Type | Default | Notes |', '| --- | --- | --- | --- | --- |');
    for (const p of e.props) {
      const attr = p.attribute ? code(p.attribute) + (p.reflect ? ' (reflects)' : '') : 'property only';
      out.push(`| ${code(p.name)} | ${attr} | ${code(cell(p.type))} | ${p.default ? code(cell(p.default)) : ''} | ${cell(p.description)} |`);
    }
    out.push('');
  }
  if (e.slots.length) {
    out.push('Slots', '');
    for (const [n, d] of e.slots) out.push(`- ${n ? code(n) : 'default slot'}${d ? ': ' + d : ''}`);
    out.push('');
  }
  if (e.events.length) {
    out.push('Events', '');
    for (const [n, v] of e.events) out.push(`- ${code(n)} (${code(v.type)})${v.description ? ': ' + v.description : ''}`);
    out.push('');
  }
  if (e.methods.length) {
    out.push('Methods', '');
    for (const m of e.methods) out.push(`- ${code(m.name)}: ${code(m.signature)}${m.description ? ' ' + m.description : ''}`);
    out.push('');
  }
  if (e.parts.length) {
    out.push('CSS parts', '');
    for (const [n, d] of e.parts) out.push(`- ${code('::part(' + n + ')')}${d ? ': ' + d : ''}`);
    out.push('');
  }
  if (e.cssProps.length) {
    out.push('CSS custom properties', '');
    for (const [n, d] of e.cssProps) out.push(`- ${code(n)}${d ? ': ' + d : ''}`);
    out.push('');
  }
  return out;
}

function referenceFile(dir, els) {
  const out = [`# ${dir}`, '', `Elements: ${els.map((e) => code(e.tag)).join(', ')}.`, ''];
  const rules = rulesByDir.get(dir) ?? [];
  if (rules.length) {
    out.push('## Usage rules', '', 'Behavior the component implements or expects the app to follow (summarized from the project checklist).', '');
    for (const r of rules) {
      out.push(`- **${r.title}**`);
      for (const n of r.notes) out.push(`  - ${n}`);
    }
    out.push('');
  }
  out.push('## API', '');
  for (const e of els) out.push(...elementDoc(e));
  return out.join('\n').replace(/\n+$/, '\n');
}

const byDir = new Map();
for (const e of elements) {
  if (!byDir.has(e.dir)) byDir.set(e.dir, []);
  byDir.get(e.dir).push(e);
}

const files = new Map();
for (const [dir, els] of [...byDir].sort(([a], [b]) => a.localeCompare(b))) {
  files.set(`reference/${dir}.md`, referenceFile(dir, els));
}
files.set('reference/app-owned.md', appOwnedFile());
files.set('SKILL.md', skillFile());

function appOwnedFile() {
  const out = [
    '# What the app owns',
    '',
    'The components render the control and its states. These parts stay in the app\'s markup, layout or logic; do not look for an attribute that does them.',
    '',
  ];
  let last;
  for (const {heading, text} of appOwned) {
    if (heading !== last) {
      out.push('', `## ${heading || 'General'}`, '');
      last = heading;
    }
    out.push(`- ${text}`);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\n+$/, '\n');
}

function skillFile() {
  const dirs = [...byDir.keys()].sort();
  const out = [
    '---',
    'name: md-gb',
    'description: Use when writing or reviewing HTML, Lit templates or CSS that uses the md-gb-* Material 3 Expressive web components from labs/gb (buttons, FABs, app bars, dialogs, sheets, lists, menus, text fields, tabs, navigation, sliders, pickers and more): which tag to pick, its attributes, slots, events, CSS parts and custom properties, and what the app must provide itself.',
    '---',
    '',
    '# md-gb: Material 3 Expressive web components',
    '',
    `Generated by ${code('scripts/m3/gen-agent-skill.mjs')} from the component sources and ${code('scripts/m3/CHECKLIST.md')}. Do not edit by hand; run ${code('npm run m3:update')} or the script to refresh.`,
    '',
    '## How to use',
    '',
    `1. Find the component below and open its reference file (${code('reference/<component>.md')}) before writing markup. It lists every tag with attributes, properties, slots, events, CSS parts, custom properties and the usage rules the library follows.`,
    `2. Import only the elements you use, for example ${code("import '@material/web/labs/gb/components/button/md-gb-button.js';")}; ${code('components/all.js')} registers everything.`,
    '3. Use attributes for static configuration and properties for state set from code. Boolean attributes are present or absent: never write `selected="false"`.',
    '4. Style with the documented CSS custom properties and parts. Colors, shapes, type and motion come from the M3 tokens (`--md-sys-*`); override tokens instead of hard-coding values.',
    `5. Read ${code('reference/app-owned.md')} for what stays in the app: labels, layout placement, content, and decisions such as which variant to show at which window size.`,
    '6. Form-associated elements list `name`, `value` and `disabled` in their property table; use the native `input` and `change` events the events list names.',
    '7. Every interactive control needs an accessible name: visible label text in the default slot or an `aria-label`. Icon-only controls always need `aria-label`.',
    '',
    '## Components',
    '',
    '| Component | Elements |',
    '| --- | --- |',
  ];
  for (const dir of dirs) {
    out.push(`| [${dir}](reference/${dir}.md) | ${byDir.get(dir).map((e) => code(e.tag)).join(', ')} |`);
  }
  out.push('', '## Element summaries', '');
  for (const e of elements) out.push(`- ${code(e.tag)}: ${e.summary || 'See the reference file.'}`);
  out.push('');
  return out.join('\n');
}

// ---------------------------------------------------------------------------
// 4. Write or check.

const expected = new Map([...files].map(([p, t]) => [p, norm(t)]));
const existing = new Map();
(function scan(dir, prefix = '') {
  if (!existsSync(dir)) return;
  for (const d of readdirSync(dir, {withFileTypes: true})) {
    if (d.isDirectory()) scan(join(dir, d.name), `${prefix}${d.name}/`);
    else existing.set(`${prefix}${d.name}`, norm(readFileSync(join(dir, d.name), 'utf8')));
  }
})(OUT);

let stale = 0;
for (const [p, text] of expected) {
  if (existing.get(p) === text) continue;
  stale++;
  if (check) console.log(`out of date: labs/gb/skill/${p}`);
  else {
    const target = join(OUT, p);
    mkdirSync(join(target, '..'), {recursive: true});
    writeFileSync(target, text);
  }
}
for (const p of existing.keys()) {
  if (expected.has(p)) continue;
  stale++;
  if (check) console.log(`unexpected: labs/gb/skill/${p}`);
  else rmSync(join(OUT, p));
}
if (check) {
  if (stale) {
    console.log('Run: node scripts/m3/gen-agent-skill.mjs');
    process.exitCode = 1;
  } else console.log(`agent skill up to date (${expected.size} files)`);
} else console.log(`agent skill: ${expected.size} files, ${stale} written, ${elements.length} elements`);
