/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The library's public API: everything a user of the package
 * can import, read from the sources and their JSDoc.
 *
 *   node scripts/api/gen-api.mjs           # write the files below
 *   node scripts/api/gen-api.mjs --check   # fail if they are stale
 *
 * Writes:
 * - material-design-expressive/custom-elements.json: a Custom Elements
 *   Manifest (schema 2.1.0) of every public module: its custom elements
 *   (attributes, properties, methods, events, slots, CSS parts and CSS
 *   custom properties), classes, functions and variables. Paths are relative
 *   to the package root. The npm package ships it.
 * - material-design-expressive/API.md: the same API for reading and review,
 *   plus types, the global stylesheets and the design tokens (CSS custom
 *   properties), each item with the M3 spec pages it implements
 *   (scripts/m3/spec-map-data.mjs) and the spec sections its source cites
 *   (`// spec-labels:`), and a JSDoc coverage report.
 * - .m3-specs/checklists/API-coverage.md, when the spec mirror is present:
 *   every spec page with the API that implements it, and the public API with
 *   no spec page.
 *
 * The public modules are the ones the package ships under its exports
 * (`./components/*`, `./extras/*`, `./foundations/*`, `./styles/*` and the
 * root `all.js`): the import closure of all.ts and of every module the docs
 * import (the same closure scripts/npm-package.mjs builds), without
 * internal/ and test code.
 */

import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, join, posix, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readGbElements} from '../m3/gb-elements.mjs';
import {FOLDER_PAGES, SPEC_MAP, TOKEN_PAGES} from '../m3/spec-map-data.mjs';
import {cemDeclaration, parseSignature} from './cem.mjs';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LIB = 'material-design-expressive';
const LIB_ABS = join(ROOT, LIB);
const SPECS = join(ROOT, '.m3-specs', 'pages');
const OUT_CEM = join(LIB_ABS, 'custom-elements.json');
const OUT_MD = join(LIB_ABS, 'API.md');
const OUT_COVERAGE = join(ROOT, '.m3-specs', 'checklists', 'API-coverage.md');

/** Folders the package exports. */
const PUBLIC = /^(components|extras|foundations|styles)\//;
/** Test code that lives next to the code it tests. */
const TEST_CODE =
  /(_test|_gap)\.ts$|^testing\/|\/(aria-helpers|aria-internals|aria-rows|axe-helpers|axe-internals|states-helpers|rtl-helpers|predictive-back-harness)\.ts$/;
const MAX_TYPE = 240;

const libRel = (abs) => relative(LIB_ABS, abs).split('\\').join('/');
const toJs = (rel) => rel.replace(/\.ts$/, '.js');
const clean = (text) =>
  (text ?? '')
    .replace(/\{@link\s+(?:[^|}\s]+\s*\|?\s*)?([^}]*)\}/g, '$1')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const firstSentences = (text) => clean((text ?? '').split(/\n\s*\n/)[0]);
const shorten = (text, max = MAX_TYPE) => {
  const t = clean(text);
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

// --- 1. The public modules ---------------------------------------------------

/** The import closure of all.ts and of the docs' imports: public modules and stylesheets. */
function publicModules() {
  const SPEC = /(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g;
  const modules = new Set();
  const sheets = new Set();
  const visit = (rel) => {
    if (modules.has(rel) || !existsSync(join(LIB_ABS, rel))) return;
    modules.add(rel);
    const text = readFileSync(join(LIB_ABS, rel), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    for (const [, spec] of text.matchAll(SPEC)) {
      if (!spec.startsWith('.')) continue;
      const target = posix.normalize(posix.join(posix.dirname(rel), spec));
      if (target.endsWith('.js')) visit(target.replace(/\.js$/, '.ts'));
      else if (target.endsWith('.css')) sheets.add(target);
    }
  };
  visit('all.ts');
  const docs = join(ROOT, 'docs');
  for (const name of readdirSync(docs, {recursive: true})) {
    if (!String(name).endsWith('.md')) continue;
    for (const [, path] of readFileSync(join(docs, name), 'utf8').matchAll(/['"]@material\/web\/([^'"]+)['"]/g)) {
      if (path.endsWith('.js')) visit(path.replace(/\.js$/, '.ts'));
      else if (path.endsWith('.css')) sheets.add(path);
    }
  }
  const isPublic = (rel) => (rel === 'all.ts' || PUBLIC.test(rel)) && !TEST_CODE.test(rel);
  return {
    modules: [...modules].filter(isPublic).sort(),
    // Only the global stylesheets: component stylesheets are their elements' detail.
    stylesheets: [...sheets].filter((s) => s.startsWith('styles/')).sort(),
  };
}

// --- 2. Spec pages ------------------------------------------------------------

/** The URL of a spec page: its `Source:` line in the mirror, or the site path. */
function specUrl(page) {
  const file = join(SPECS, `${page}.md`);
  const source = existsSync(file) && readFileSync(file, 'utf8').match(/^Source: (\S+)/m);
  return source ? source[1] : `https://m3.material.io/${page}`;
}

/** The spec pages of a library-relative path (SPEC_MAP first, then FOLDER_PAGES). */
function pagesOf(rel) {
  const entry = SPEC_MAP.filter((e) => rel.startsWith(`${e.dir}/`)).sort((a, b) => b.dir.length - a.dir.length)[0];
  if (entry) return {pages: entry.pages, note: entry.note ?? ''};
  // A key matches a folder (`styles/color` for `styles/color/x.ts`) or one
  // file by its stem (`styles/m3` for `styles/m3.css`, `styles/m3.cssresult.ts`).
  const stem = rel.replace(/(\.cssresult)?\.(ts|css)$/, '');
  const folder = Object.keys(FOLDER_PAGES)
    .filter((f) => rel.startsWith(`${f}/`) || stem === f)
    .sort((a, b) => b.length - a.length)[0];
  return {pages: folder ? FOLDER_PAGES[folder] : [], note: ''};
}

/** The `// spec-labels:` sections cited by a source file. */
function specLabels(rel) {
  const file = join(LIB_ABS, rel);
  if (!rel || !existsSync(file)) return [];
  const labels = [];
  for (const [, list] of readFileSync(file, 'utf8').matchAll(/^\s*\/\/\s*spec-labels:\s*(.*)$/gm)) {
    labels.push(...list.split(',').map((l) => l.trim()).filter(Boolean));
  }
  return [...new Set(labels)];
}

// --- 3. Exports (TypeScript) -----------------------------------------------

function program(modules) {
  const config = ts.getParsedCommandLineOfConfigFile(join(ROOT, 'scripts', 'api', 'tsconfig.json'), {}, {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: (d) => {
      throw new Error(ts.flattenDiagnosticMessageText(d.messageText, '\n'));
    },
  });
  const types = readdirSync(join(LIB_ABS, 'internal', 'types')).map((f) => join(LIB_ABS, 'internal', 'types', f));
  return ts.createProgram({
    rootNames: [...modules.map((m) => join(LIB_ABS, m)), ...types],
    options: {...config.options, noEmit: true, skipLibCheck: true},
  });
}

const KIND = [
  [ts.isClassDeclaration, 'class'],
  [ts.isFunctionDeclaration, 'function'],
  [ts.isVariableDeclaration, 'variable'],
  [ts.isTypeAliasDeclaration, 'type'],
  [ts.isInterfaceDeclaration, 'interface'],
  [ts.isEnumDeclaration, 'enum'],
];

/** Every export of a module: `{name, kind, from, description, deprecated, signature}`. */
function exportsOf(prog, checker, rel) {
  const source = prog.getSourceFile(join(LIB_ABS, rel));
  const moduleSymbol = source && checker.getSymbolAtLocation(source);
  if (!moduleSymbol) return [];
  const out = [];
  for (const exp of checker.getExportsOfModule(moduleSymbol)) {
    const symbol = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
    const decl = symbol.declarations?.[0];
    if (!decl) continue;
    // `export default <expression>` is a value, like a variable.
    const kind = KIND.find(([is]) => is(decl))?.[1] ?? (ts.isExportAssignment(decl) ? 'variable' : 'other');
    const deprecatedTag = symbol.getJsDocTags(checker).find((t) => t.name === 'deprecated');
    const flags = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
    let signature = '';
    if (kind === 'function') {
      const type = checker.getTypeOfSymbolAtLocation(symbol, decl);
      signature = type
        .getCallSignatures()
        .map((s) => checker.signatureToString(s, undefined, flags))
        .join(' | ');
    } else if (kind === 'variable') {
      signature = checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, decl), undefined, flags);
    } else if (kind === 'class') {
      const heritage = decl.heritageClauses?.map((h) => h.getText()).join(' ') ?? '';
      signature = `class ${symbol.getName()}${heritage ? ` ${heritage}` : ''}`;
    } else if (kind === 'type') {
      signature = decl.type.getText();
    } else if (kind === 'interface') {
      signature = `{${decl.members.map((m) => m.name?.getText() ?? '').filter(Boolean).join('; ')}}`;
    } else if (kind === 'enum') {
      signature = decl.members.map((m) => m.name.getText()).join(' | ');
    }
    out.push({
      name: exp.getName(),
      symbolName: symbol.getName(),
      kind,
      from: libRel(decl.getSourceFile().fileName),
      description: firstSentences(ts.displayPartsToString(symbol.getDocumentationComment(checker))),
      deprecated: deprecatedTag ? clean(ts.displayPartsToString(deprecatedTag.text)) || true : false,
      signature: clean(signature),
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

// --- 4. Design tokens ------------------------------------------------------

/** The `--md-sys-*` / `--md-ref-*` custom properties the global stylesheet declares, by group. */
function designTokens() {
  const css = join(LIB_ABS, 'styles', 'm3.css');
  if (!existsSync(css)) throw new Error('styles/m3.css is missing; run `npm run build` first.');
  const names = new Set(readFileSync(css, 'utf8').match(/--md-(?:sys|ref)-[a-z0-9-]+(?=\s*:)/g) ?? []);
  const groups = new Map();
  for (const name of [...names].sort()) {
    const group = name.replace(/^--md-((?:sys|ref)-[a-z]+)-.*$/, '$1');
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(name);
  }
  return groups;
}

// --- 5. Build --------------------------------------------------------------

export function buildApi() {
  const {modules, stylesheets} = publicModules();
  const prog = program(modules);
  const checker = prog.getTypeChecker();

  // Elements: every public module that registers an md-* tag.
  const registering = modules.filter((m) => /HTMLElementTagNameMap/.test(readFileSync(join(LIB_ABS, m), 'utf8')));
  const elements = readGbElements({files: registering.map((m) => join(LIB_ABS, m)), tags: /^md-(gb|aria)-/}).map(
    (e) => ({
      ...e,
      file: e.file.replace(`${LIB}/`, ''),
      classFile: e.classFile.replace(`${LIB}/`, ''),
      superclassFile: e.superclassFile.replace(`${LIB}/`, ''),
    }),
  );
  const elementByClass = new Map(elements.map((e) => [`${e.classFile}#${e.className}`, e]));
  // Every md-gb element of components/ and extras/ must reach users: all.ts
  // (through components/all.ts) is what defines them and what the package
  // ships.
  const publicTags = new Set(elements.map((e) => e.tag));
  const unreachable = readGbElements().filter((e) => !publicTags.has(e.tag));
  if (unreachable.length) {
    throw new Error(
      `gen-api: not reachable from all.ts, so not in the package: ${unreachable.map((e) => `<${e.tag}> (${e.file})`).join(', ')}. ` +
        'Add them to components/all.ts.',
    );
  }

  const api = modules.map((rel) => ({rel, exports: exportsOf(prog, checker, rel), ...pagesOf(rel)}));
  const tokens = designTokens();

  // custom-elements.json
  const cemModules = [];
  for (const m of api) {
    const declarations = [];
    for (const e of m.exports.filter((x) => x.from === m.rel)) {
      const element = e.kind === 'class' && elementByClass.get(`${m.rel}#${e.symbolName}`);
      let d;
      if (element) {
        d = cemDeclaration(element);
        if (element.superclassFile) d.superclass = {name: element.superclass, module: `/${toJs(element.superclassFile)}`};
      } else if (e.kind === 'class') {
        d = {kind: 'class', name: e.symbolName};
      } else if (e.kind === 'function') {
        d = {kind: 'function', name: e.symbolName};
        const {parameters, returns} = parseSignature(e.signature.split(' | ')[0]);
        if (parameters.length) d.parameters = parameters;
        if (returns) d.return = {type: {text: returns}};
      } else if (e.kind === 'variable') {
        d = {kind: 'variable', name: e.symbolName, type: {text: shorten(e.signature, 500)}};
      } else {
        continue; // Types, interfaces and enums have no manifest kind.
      }
      if (e.description && !d.description) d.description = e.description;
      if (e.deprecated) d.deprecated = e.deprecated;
      if (!declarations.some((x) => x.name === d.name)) declarations.push(d);
    }
    const exports = m.exports
      .filter((e) => ['class', 'function', 'variable'].includes(e.kind))
      .map((e) => ({kind: 'js', name: e.name, declaration: {name: e.symbolName, module: `/${toJs(e.from)}`}}));
    for (const el of elements.filter((x) => x.file === m.rel)) {
      exports.push({
        kind: 'custom-element-definition',
        name: el.tag,
        declaration: {name: el.className, module: `/${toJs(el.classFile || el.file)}`},
      });
    }
    if (declarations.length || exports.length) {
      const mod = {kind: 'javascript-module', path: toJs(m.rel)};
      if (declarations.length) mod.declarations = declarations;
      if (exports.length) mod.exports = exports;
      cemModules.push(mod);
    }
  }
  const manifest = {
    schemaVersion: '2.1.0',
    readme: 'API.md',
    modules: cemModules,
  };

  return {api, elements, stylesheets, tokens, manifest};
}

// --- 6. API.md --------------------------------------------------------------

const code = (s) => `\`${String(s).replace(/`/g, "'").replace(/\|/g, '\\|')}\``;
const cell = (s) => clean(String(s ?? '')).replace(/\|/g, '\\|') || ' ';
const specLinks = (pages) => (pages.length ? pages.map((p) => `[${p.split('/').pop()}](${specUrl(p)})`).join(', ') : 'none');
const anchor = (s) => s.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/ /g, '-');
const PILLARS = [
  ['components', 'Components', 'The components of the M3 components index.'],
  ['extras', 'Extras', "The library's own components, with no page of their own in the M3 components index."],
  ['foundations', 'Foundations', 'Accessibility, interaction, layout and the design tokens.'],
  ['styles', 'Styles', 'Color, elevation, icons, motion, shape, spacing and typography.'],
];

function renderMarkdown({api, elements, stylesheets, tokens}) {
  const lines = [];
  const push = (...l) => lines.push(...l);
  const missing = [];
  const counts = {modules: api.length, elements: elements.length, class: 0, function: 0, variable: 0, type: 0, interface: 0, enum: 0};
  for (const m of api) for (const e of m.exports.filter((x) => x.from === m.rel)) counts[e.kind] = (counts[e.kind] ?? 0) + 1;
  const tokenCount = [...tokens.values()].reduce((n, l) => n + l.length, 0);

  // JSDoc coverage: exports and element members without a description.
  let documented = 0;
  let total = 0;
  const note = (item, has) => {
    total++;
    if (has) documented++;
    else missing.push(item);
  };
  for (const m of api) {
    for (const e of m.exports.filter((x) => x.from === m.rel)) note(`${toJs(m.rel)}: ${e.kind} ${e.name}`, e.description);
  }
  for (const el of elements) {
    note(`<${el.tag}>`, el.summary);
    for (const p of el.props) note(`<${el.tag}> property ${p.name}`, p.description);
    for (const mt of el.methods) {
      if (!/^(connected|disconnected|adopted|attributeChanged)Callback$/.test(mt.name)) note(`<${el.tag}> method ${mt.name}()`, mt.description);
    }
    for (const [name, ev] of el.events) note(`<${el.tag}> event ${name}`, ev.description);
    for (const [name, d] of el.slots) note(`<${el.tag}> slot ${name || '(default)'}`, d);
    for (const [name, d] of el.parts) note(`<${el.tag}> part ${name}`, d);
  }

  push(
    '# Public API',
    '',
    'Generated by `scripts/api/gen-api.mjs` from the sources and their JSDoc; do',
    'not edit. The same API is in `custom-elements.json` (Custom Elements',
    'Manifest 2.1.0), which the npm package ships.',
    '',
    'This is everything a user of the package can import: the modules under',
    'its exports (`components/`, `extras/`, `foundations/`, `styles/` and the',
    'root `all.js`) that the package ships, the global stylesheets and the',
    'design tokens. Each item lists the M3 spec pages it implements',
    '(`scripts/m3/spec-map-data.mjs`) and, for elements, the spec sections its',
    'source cites (`// spec-labels:`).',
    '',
    '| | Count |',
    '| --- | --- |',
    `| Public modules | ${counts.modules} |`,
    `| Custom elements | ${counts.elements} |`,
    `| Classes | ${counts.class} |`,
    `| Functions | ${counts.function} |`,
    `| Constants and variables | ${counts.variable} |`,
    `| Types and interfaces | ${counts.type + counts.interface + counts.enum} |`,
    `| Global stylesheets | ${stylesheets.length} |`,
    `| Design tokens (CSS custom properties) | ${tokenCount} |`,
    `| JSDoc coverage | ${documented} of ${total} (${Math.round((100 * documented) / Math.max(total, 1))}%) |`,
    '',
    '## Contents',
    '',
    ...PILLARS.map(([, title]) => `- [${title}](#${anchor(title)})`),
    '- [All](#all)',
    '- [Global stylesheets](#global-stylesheets)',
    '- [Design tokens](#design-tokens)',
    '- [Missing JSDoc](#missing-jsdoc)',
    '',
  );

  const elementSection = (el) => {
    const {pages, note: specNote} = pagesOf(el.file);
    push(`#### ${code(`<${el.tag}>`)}`, '');
    if (el.deprecated) push(`> **Deprecated.** ${el.deprecated === true ? '' : el.deprecated}`, '');
    push(el.summary || '_No description._', '');
    push(`- Class: ${code(el.className)} in ${code(toJs(el.classFile || el.file))}`);
    push(`- Import: ${code(`import '@material/web/${toJs(el.file)}';`)}`);
    push(`- Spec: ${specLinks(pages)}${specNote ? ` (${specNote})` : ''}`);
    const labels = specLabels(el.classFile);
    if (labels.length) push(`- Spec sections cited: ${labels.map(code).join(', ')}`);
    push('');
    if (el.props.length) {
      push('| Property | Attribute | Type | Default | Description |', '| --- | --- | --- | --- | --- |');
      for (const p of el.props) {
        push(`| ${code(p.name)} | ${p.attribute ? code(p.attribute) + (p.reflect ? ' (reflects)' : '') : ' '} | ${code(shorten(p.type, 80))} | ${p.default ? code(shorten(p.default, 40)) : ' '} | ${cell(p.description)} |`);
      }
      push('');
    }
    const methods = el.methods.filter((m) => !/^(connected|disconnected|adopted|attributeChanged)Callback$/.test(m.name));
    if (methods.length) {
      push('| Method | Signature | Description |', '| --- | --- | --- |');
      for (const m of methods) push(`| ${code(m.name)} | ${code(shorten(m.signature, 120))} | ${cell(m.description)} |`);
      push('');
    }
    if (el.events.length) {
      push('| Event | Type | Description |', '| --- | --- | --- |');
      for (const [name, ev] of el.events) push(`| ${code(name)} | ${code(ev.type)} | ${cell(ev.description)} |`);
      push('');
    }
    const named = (title, list) => {
      if (!list.length) return;
      push(`| ${title} | Description |`, '| --- | --- |');
      for (const [name, d] of list) push(`| ${name ? code(name) : '(default)'} | ${cell(d)} |`);
      push('');
    };
    named('Slot', el.slots);
    named('CSS part', el.parts);
    if (el.cssProps.length) {
      push(`<details><summary>${el.cssProps.length} CSS custom properties</summary>`, '');
      push(el.cssProps.map(([n]) => code(n)).join(', '), '', '</details>', '');
    }
  };

  const moduleSection = (m) => {
    const own = m.exports.filter((e) => e.from === m.rel);
    const reexports = m.exports.filter((e) => e.from !== m.rel);
    if (!own.length && !reexports.length) return false;
    push(`#### ${code(toJs(m.rel))}`, '');
    push(`- Spec: ${specLinks(m.pages)}${m.note ? ` (${m.note})` : ''}`, '');
    if (own.length) {
      push('| Export | Kind | Signature | Description |', '| --- | --- | --- | --- |');
      for (const e of own) {
        const desc = `${e.deprecated ? `**Deprecated.** ${e.deprecated === true ? '' : e.deprecated} ` : ''}${e.description}`;
        push(`| ${code(e.name)} | ${e.kind} | ${e.signature ? code(shorten(e.signature)) : ' '} | ${cell(desc)} |`);
      }
      push('');
    }
    if (reexports.length) {
      push(`Re-exports: ${reexports.map((e) => `${code(e.name)} from ${code(toJs(e.from))}`).join(', ')}`, '');
    }
    return true;
  };

  for (const [prefix, title, about] of PILLARS) {
    push(`## ${title}`, '', about, '');
    const inPillar = (rel) => rel.startsWith(`${prefix}/`);
    const folders = [...new Set(api.filter((m) => inPillar(m.rel)).map((m) => posix.dirname(m.rel)))].sort();
    for (const folder of folders) {
      const els = elements.filter((e) => posix.dirname(e.file) === folder);
      const mods = api.filter((m) => posix.dirname(m.rel) === folder);
      const start = lines.length;
      push(`### ${code(`${folder}/`)}`, '');
      for (const el of els) elementSection(el);
      let any = els.length > 0;
      for (const m of mods) any = moduleSection(m) || any;
      if (!any) lines.length = start;
    }
  }

  push('## All', '', 'The package root: `import \'@material/web/all.js\'` defines every element and adopts the global styles.', '');
  const root = api.find((m) => m.rel === 'all.ts');
  if (root) moduleSection(root);

  push('## Global stylesheets', '', '| Stylesheet | Spec |', '| --- | --- |');
  for (const s of stylesheets) push(`| ${code(s)} | ${specLinks(pagesOf(s).pages)} |`);
  push('');

  push(
    '## Design tokens',
    '',
    'CSS custom properties that `styles/m3.css` declares. Components read them;',
    'apps set them to theme the library.',
    '',
    '| Group | Count | Spec | Properties |',
    '| --- | --- | --- | --- |',
  );
  for (const [group, names] of tokens) {
    const list = names.length > 12 ? `${names.slice(0, 12).map(code).join(', ')}, … (${names.length - 12} more)` : names.map(code).join(', ');
    push(`| ${code(`--md-${group}-*`)} | ${names.length} | ${specLinks(TOKEN_PAGES[group] ?? [])} | ${list} |`);
  }
  push('');

  push('## Missing JSDoc', '', `${missing.length} public items have no description.`, '');
  if (missing.length) push('<details><summary>List</summary>', '', ...missing.map((m) => `- ${code(m)}`), '', '</details>', '');
  return lines.join('\n');
}

// --- 7. Coverage against the spec mirror (local, gitignored) ---------------

function renderCoverage({api, elements, tokens}) {
  if (!existsSync(SPECS)) return null;
  const pages = [];
  for (const area of ['components', 'foundations', 'styles']) {
    for (const name of readdirSync(join(SPECS, area), {recursive: true})) {
      if (String(name).endsWith('.md')) pages.push(`${area}/${String(name).split('\\').join('/').replace(/\.md$/, '')}`);
    }
  }
  pages.sort();
  const users = new Map(pages.map((p) => [p, []]));
  const add = (page, item) => users.get(page)?.push(item);
  for (const el of elements) for (const p of pagesOf(el.file).pages) add(p, `<${el.tag}>`);
  for (const m of api) {
    if (/HTMLElementTagNameMap/.test(readFileSync(join(LIB_ABS, m.rel), 'utf8'))) continue;
    const own = m.exports.filter((e) => e.from === m.rel);
    if (own.length) for (const p of m.pages) add(p, toJs(m.rel));
  }
  for (const [group, names] of tokens) {
    // Every token group implements the design tokens page too.
    for (const p of new Set([...(TOKEN_PAGES[group] ?? []), 'foundations/design-tokens'])) {
      add(p, `--md-${group}-* (${names.length})`);
    }
  }

  const lines = [
    '# Public API coverage of the spec',
    '',
    'Generated by `scripts/api/gen-api.mjs`; do not edit. Every page of the',
    'local spec mirror with the public API that implements it, then the public',
    'API with no spec page. See material-design-expressive/API.md for the API.',
    '',
    '## Spec pages',
    '',
    '| Page | Public API |',
    '| --- | --- |',
  ];
  for (const p of pages) {
    const list = users.get(p);
    lines.push(`| [${p}](${specUrl(p)}) | ${list.length ? list.map(code).join(', ') : '**none**'} |`);
  }
  const without = [
    ...elements.filter((el) => !pagesOf(el.file).pages.length).map((el) => `<${el.tag}>`),
    ...api
      .filter((m) => m.rel !== 'all.ts' && !m.pages.length && m.exports.some((e) => e.from === m.rel))
      .map((m) => toJs(m.rel)),
  ];
  lines.push('', '## Public API with no spec page', '', `${without.length} items.`, '', ...without.map((w) => `- ${code(w)}`), '');
  return lines.join('\n');
}

// --- main -------------------------------------------------------------------

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const check = process.argv.includes('--check');
  const t = Date.now();
  const built = buildApi();
  const outputs = [
    [OUT_CEM, JSON.stringify(built.manifest, null, 1) + '\n'],
    [OUT_MD, renderMarkdown(built) + '\n'],
  ];
  const norm = (s) => s.replace(/\r\n/g, '\n');
  if (check) {
    const stale = outputs.filter(([file, text]) => !existsSync(file) || norm(readFileSync(file, 'utf8')) !== text);
    if (stale.length) {
      console.error(`gen-api: stale: ${stale.map(([f]) => libRel(f)).join(', ')}; run \`node scripts/api/gen-api.mjs\`.`);
      process.exit(1);
    }
    console.log('gen-api: custom-elements.json and API.md are up to date.');
  } else {
    for (const [file, text] of outputs) writeFileSync(file, text);
    const coverage = renderCoverage(built);
    if (coverage) writeFileSync(OUT_COVERAGE, coverage + '\n');
    console.log(
      `gen-api: ${built.api.length} modules, ${built.elements.length} elements, ` +
        `${built.manifest.modules.length} manifest modules${coverage ? ', coverage report' : ''} (${((Date.now() - t) / 1000).toFixed(1)}s).`,
    );
  }
}
