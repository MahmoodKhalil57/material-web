#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates browser tests asserting that each `labs/gb` component renders the
 * M3 spec value for every token declaration bound to a spec token.
 *
 * For each `@include <comp>-tokens.<mixin>` in a component stylesheet, the
 * selector chain is turned into markup that matches it (choosing the class or
 * attribute alternative of each `:is()/:where()` state, e.g. `.hover`), and a
 * test compares the property's computed value with the spec value, both
 * resolved by the browser through a real CSS property (color, border-radius,
 * box-shadow, font, ...), so `16px` and `var(--md-sys-space-200)` compare equal.
 *
 *   node scripts/m3/gen-spec-tests.mjs [component ...]
 *
 * Writes `labs/gb/components/<dir>/<dir>_spec_test.ts`.
 */

import {readdir, readFile, writeFile} from 'node:fs/promises';
import {basename, join} from 'node:path';
import {COMPONENT_SETS, GB, loadBindings} from './gb-bindings.mjs';
import {loadUnits} from './spec-units.mjs';

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const {db, analyze} = await loadBindings();

/** Pseudo-classes satisfied by rendering a single, unmatched child. */
const IGNORED_PSEUDOS = /^:(first-child|last-child|only-child|first-of-type|last-of-type|not\(.*\))$/;

/** Token value type -> CSS property used to resolve values in the browser. */
const PROBE = {
  COLOR: 'color',
  LENGTH: 'width',
  SHAPE: 'border-top-left-radius',
  ELEVATION: 'box-shadow',
  OPACITY: 'opacity',
  DURATION: 'transition-duration',
  CUBIC_BEZIER: 'transition-timing-function',
  TYPOGRAPHY: 'font',
};

/** gb component -> the spec pages whose token tables its tests check. */
const SPEC_PAGES = {
  appbar: ['app-bars'],
  badge: ['badges'],
  button: ['buttons'],
  buttongroup: ['button-groups'],
  card: ['cards'],
  carousel: ['carousel'],
  checkbox: ['checkbox'],
  chip: ['chips'],
  datepicker: ['date-pickers'],
  dialog: ['dialogs'],
  fab: ['floating-action-button', 'extended-fab'],
  fabmenu: ['fab-menu'],
  iconbutton: ['icon-buttons'],
  list: ['lists'],
  loadingindicator: ['loading-indicator'],
  menu: ['menus'],
  navbar: ['navigation-bar'],
  navdrawer: ['navigation-drawer'],
  navrail: ['navigation-rail'],
  progress: ['progress-indicators'],
  radio: ['radio-button'],
  search: ['search'],
  sheet: ['bottom-sheets', 'side-sheets'],
  slider: ['sliders'],
  splitbutton: ['split-button'],
  switch: ['switch'],
  textfield: ['text-fields'],
  timepicker: ['time-pickers'],
  toolbar: ['toolbars'],
  tooltip: ['tooltips'],
};

const summary = [];
for (const dir of (await readdir(GB)).sort()) {
  if (!COMPONENT_SETS[dir] || (only.length && !only.includes(dir))) continue;
  const result = await analyze(dir);
  if (!result) continue;

  const styles = await componentStyles(dir);
  const includes = new Map(); // mixin -> markup
  const unbuildable = new Set();
  for (const {file, source} of styles) {
    for (const {ns, mixin: name, selector, styles: queries} of includedSelectors(source)) {
      const mixin = `${ns}.${name}`;
      if (includes.has(mixin)) continue;
      // First alternative of the selector list that markup can match.
      let markup;
      for (const alternative of selector ?? []) {
        markup = markupFor(alternative, queries);
        if (markup) break;
      }
      if (markup) includes.set(mixin, {markup, file});
      else if (name !== 'inherit') unbuildable.add(mixin);
    }
  }

  const cases = [];
  for (const r of result.records) {
    if (r.status !== 'match' && !(r.status === 'drift' && r.confident)) continue;
    const target = includes.get(`${r.ns}.${r.mixin}`);
    if (!target || r.want === undefined) continue;
    // gb may spell a full corner as `50%`; it only equals the spec's full
    // corner relative to the element's box, which a probe cannot reproduce.
    if (/corner-full/.test(r.want) && r.have !== r.want) continue;
    // A weak binding (through a sibling mixin's word, e.g. a root default
    // that a size mixin always overrides) is a guess, and a `1.15` factor
    // matching a `15%` multiplier cannot be resolved through one property.
    if (r.weak || (/%$/.test(r.want) && !/%/.test(r.have))) continue;
    const property = probeProperty(r.prop, db.type(r.token), r.want);
    if (!property) continue;
    cases.push({
      // Components with several token files name the file too.
      mixin: result.files.length > 1 ? `${r.ns}.${r.mixin}` : r.mixin,
      prop: r.prop,
      token: r.token,
      // gb has no `corner-value` properties (see `equivalent`).
      spec: r.want.replace(/--md-sys-shape-corner-value-/g, '--md-sys-shape-corner-'),
      property,
      markup: target.markup,
    });
  }
  if (!cases.length) continue;

  const out = join(GB, dir, `${dir}_spec_test.ts`);
  await writeFile(out, testFile(dir, styles.map((s) => s.file), cases));
  summary.push(`${dir}: ${cases.length} cases${unbuildable.size ? `, ${unbuildable.size} mixins with selectors that cannot be rendered statically (${[...unbuildable].join(', ')})` : ''}`);
}
console.log(`Spec tests (spec ${db.version}):\n  ${summary.join('\n  ')}`);

/** Stylesheets of a component that include its token mixins. */
async function componentStyles(dir) {
  const out = [];
  for (const f of await readdir(join(GB, dir))) {
    if (!f.endsWith('.scss') || f.startsWith('_')) continue;
    const source = await readFile(join(GB, dir, f), 'utf8');
    if (/@include\s+[\w-]+-tokens\./.test(source)) out.push({file: basename(f, '.scss'), source});
  }
  return out;
}

/**
 * Walks SCSS blocks and returns `{mixin, selector, styles}` for each
 * `@include <x>-tokens.<mixin>`, with `selector` the resolved alternatives of
 * the full selector (null when it uses interpolation) and `styles` the
 * enclosing `@container style()` conditions.
 */
export function includedSelectors(source) {
  const text = source.replace(/\r\n/g, '\n').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  // Entries: {selector} for style rules (null when unresolvable), or
  // {style} for `@container style(--x: v)` blocks, or {} for other at-rules.
  const stack = [];
  const found = [];
  const currentSelector = () => {
    for (let i = stack.length - 1; i >= 0; i--) {
      if ('selector' in stack[i]) return stack[i].selector;
    }
    return undefined;
  };
  let buf = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '#' && text[i + 1] === '{') {
      const end = text.indexOf('}', i);
      buf += text.slice(i, end + 1);
      i = end;
    } else if (c === '{') {
      const head = buf.trim();
      buf = '';
      const parent = currentSelector();
      const style = head.match(/^@container\s+style\(\s*(--[\w-]+)\s*:\s*([^)]+?)\s*\)/);
      if (style) stack.push({style: `${style[1]}: ${style[2]}`});
      else if (head.startsWith('@')) stack.push({});
      else if (head.includes('#{') || parent === null) stack.push({selector: null});
      else stack.push({selector: combine(parent, head)});
    } else if (c === '}') {
      stack.pop();
      buf = '';
    } else if (c === ';') {
      const m = buf.trim().match(/^@include\s+([\w-]+-tokens)\.([\w-]+)/);
      if (m) {
        found.push({
          ns: m[1],
          mixin: m[2],
          selector: currentSelector() ?? null,
          styles: stack.filter((e) => e.style).map((e) => e.style),
        });
      }
      buf = '';
    } else {
      buf += c;
    }
  }
  return found;
}

/**
 * Resolves a nested selector list against its parent's alternatives,
 * returning every combination (capped) so a renderable one can be chosen.
 */
function combine(parents, childList) {
  const children = splitTop(childList, /,/);
  const out = [];
  for (const parent of parents ?? ['']) {
    for (const child of children) {
      if (!parent) out.push(child.replace(/&/g, ''));
      else out.push(child.includes('&') ? child.replace(/&/g, parent) : `${parent} ${child}`);
    }
  }
  return out.slice(0, 32);
}

/** Splits on `sep` outside parentheses/brackets. */
function splitTop(s, sep) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const c of s) {
    if (c === '(' || c === '[') depth++;
    if (c === ')' || c === ']') depth--;
    if (depth === 0 && sep.test(c)) {
      parts.push(cur);
      cur = '';
    } else cur += c;
  }
  parts.push(cur);
  return parts.map((p) => p.trim()).filter(Boolean);
}

/**
 * Builds nested markup matching `selector`, marking the innermost element with
 * `data-spec-target`. Returns undefined when the selector needs a state that
 * cannot be expressed in markup (e.g. a bare `:hover` or a pseudo-element).
 */
export function markupFor(selector, styles = []) {
  const compounds = splitTop(selector.replace(/\s*>\s*/g, ' '), /\s/);
  const elements = [];
  for (const compound of compounds) {
    const el = parseCompound(compound);
    if (!el) return undefined;
    elements.push(el);
  }
  const open = (el, extra = []) => {
    const attrs = [
      el.classes.size ? `class="${[...el.classes].join(' ')}"` : '',
      ...[...el.attrs].map(([k, v]) => (v === '' ? k : `${k}="${v}"`)),
      ...extra,
    ].filter(Boolean);
    return `<${el.tag}${attrs.length ? ' ' + attrs.join(' ') : ''}>`;
  };
  const target = elements[elements.length - 1];
  // Siblings keep :first-child / :last-child rules from matching unless the
  // selector asks for them.
  const before = target.position.first || target.position.only ? '' : '<span></span>';
  const after = target.position.last || target.position.only ? '' : '<span></span>';
  let html = '';
  for (const el of elements.slice(0, -1)) html += open(el);
  html += before + open(target, ['data-spec-target']) + `</${target.tag}>` + after;
  for (let i = elements.length - 2; i >= 0; i--) html += `</${elements[i].tag}>`;
  // Container style queries (`@container style(--x: v)`) query the parent.
  if (styles.length) html = `<div style="${styles.join('; ')}">${html}</div>`;
  return html;
}

function parseCompound(compound) {
  const el = {tag: 'div', classes: new Set(), attrs: new Map(), position: {}};
  let rest = compound;
  const tag = rest.match(/^[a-z][\w-]*/);
  if (tag) {
    el.tag = tag[0];
    rest = rest.slice(tag[0].length);
  }
  while (rest) {
    let m;
    if ((m = rest.match(/^\.([\w-]+)/))) {
      el.classes.add(m[1]);
    } else if ((m = rest.match(/^\[([\w-]+)(?:=['"]?([^'"\]]*)['"]?)?\]/))) {
      el.attrs.set(m[1], m[2] ?? '');
    } else if ((m = rest.match(/^:(is|where)\(/))) {
      const end = matchParen(rest, m[0].length - 1);
      const inner = rest.slice(m[0].length, end);
      const choice = splitTop(inner, /,/).find((alt) => /^[.[]/.test(alt));
      if (choice) {
        const sub = parseCompound(choice);
        if (!sub) return undefined;
        sub.classes.forEach((c) => el.classes.add(c));
        sub.attrs.forEach((v, k) => el.attrs.set(k, v));
      } else if (/(^|,)\s*:disabled/.test(inner)) {
        el.tag = 'button';
        el.attrs.set('disabled', '');
      } else if (!splitTop(inner, /,/).every((alt) => IGNORED_PSEUDOS.test(alt))) {
        return undefined;
      }
      rest = rest.slice(end + 1);
      continue;
    } else if ((m = rest.match(/^:not\(/))) {
      rest = rest.slice(matchParen(rest, m[0].length - 1) + 1);
      continue;
    } else if ((m = rest.match(/^:disabled/))) {
      el.tag = 'button';
      el.attrs.set('disabled', '');
    } else if ((m = rest.match(/^:[\w-]+(\([^)]*\))?/)) && IGNORED_PSEUDOS.test(m[0])) {
      if (/^:(first-child|first-of-type)$/.test(m[0])) el.position.first = true;
      if (/^:(last-child|last-of-type)$/.test(m[0])) el.position.last = true;
      if (m[0] === ':only-child') el.position.only = true;
    } else {
      return undefined; // bare :hover, ::before, :has(), ...
    }
    rest = rest.slice(m[0].length);
  }
  return el;
}

function matchParen(s, open) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '(') depth++;
    if (s[i] === ')' && --depth === 0) return i;
  }
  return s.length;
}

function probeProperty(prop, type, spec) {
  if (/-axes$/.test(prop)) return 'font-variation-settings';
  if (/-tracking$/.test(prop)) return 'letter-spacing';
  // A composite type style: `var(--md-sys-typescale-<style>)`.
  if (/^var\(--md-sys-typescale-[\w-]+\)$/.test(spec) && !/-(font|weight|size|line-height)\)$/.test(spec)) {
    return 'font';
  }
  if (/-tracking$/.test(prop)) return 'letter-spacing';
  if (/(^|-)color$/.test(prop)) return 'color';
  if (/(^|-)elevation$/.test(prop)) return 'box-shadow';
  if (/(^|-)shape$/.test(prop)) return 'border-top-left-radius';
  if (/(^|-)opacity$/.test(prop)) return 'opacity';
  return PROBE[type];
}

/**
 * Section IDs (spec-units.mjs) of the "Specs > Tokens & specs" sections the
 * generated cases verify: the page's token table. Cited for spec-checks.mjs.
 */
function tokenSections(dir) {
  // Cached on the function: testFile runs before later module-level lets.
  const sections = (tokenSections.cache ??= new Set(loadUnits().map((u) => u.section)));
  return (SPEC_PAGES[dir] ?? [])
    .map((page) => `${page}/specs/tokens-specs`)
    .filter((s) => sections.has(s));
}

function testFile(dir, files, cases) {
  const imports = files
    .map((f, i) => `import styles${i} from './${f}.cssresult.js';`)
    .join('\n');
  return `/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// AUTOGENERATED. DO NOT MODIFY.
// To modify this file, run: node scripts/m3/gen-spec-tests.mjs ${dir}
// Spec: m3.material.io ${db.version}${tokenSections(dir).map((s) => `\n// spec: ${s}`).join('')}
//
// Each case renders markup matching the selector that includes a token mixin
// and checks that the property resolves to the M3 spec value.

// import 'jasmine'; (google3-only)
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
${imports}

interface SpecCase {
  mixin: string;
  prop: string;
  token: string;
  spec: string;
  property: string;
  markup: string;
}

const CASES: SpecCase[] = ${JSON.stringify(cases, null, 2)};

/** Resolves a CSS value through \`property\` in the context of \`host\`. */
function resolve(host: HTMLElement, property: string, value: string): string {
  const probe = document.createElement('span');
  probe.style.position = 'absolute';
  probe.style.setProperty(property, value);
  host.append(probe);
  const resolved = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return resolved;
}

describe('${dir} matches the M3 spec (generated)', () => {
  let container: HTMLElement;

  beforeAll(() => {
    adoptStyles(document, [m3Styles, ${files.map((_, i) => `styles${i}`).join(', ')}]);
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  for (const c of CASES) {
    it(\`\${c.mixin}: --\${c.prop} is \${c.token}\`, () => {
      container.innerHTML = c.markup;
      const target = container.querySelector<HTMLElement>('[data-spec-target]')!;
      const actual = resolve(target, c.property, \`var(--\${c.prop})\`);
      const expected = resolve(target, c.property, c.spec);
      expect(actual).withContext(\`spec \${c.spec}\`).toBe(expected);
    });
  }
});
`;
}
