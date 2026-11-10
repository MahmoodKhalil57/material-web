#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Baseline check for labs/gb, driven by https://github.com/web-platform-dx/web-features
 * (the `web-features` package; the browser targets come from
 * `baseline-browser-mapping`).
 *
 *   npm run gb:baseline                 # CSS (fails) + JS API report
 *   npm run gb:baseline -- --verbose    # list every use, not just unguarded
 *   npm run gb:baseline -- --css-only   # skip the JS report
 *
 * CSS: every compiled labs/gb **\/*.css is parsed (css-tree). Each property,
 * keyword value, function, unit, at-rule, media/container feature, pseudo-class
 * and pseudo-element is mapped to a BCD key, then to a web-features feature
 * and its Baseline status (`high` = widely available). A use that is not
 * widely available passes when
 *   - an enclosing `@supports` tests it (its name appears in the condition), or
 *   - scripts/gb-baseline-allow.json lists it with a reason (a progressive
 *     enhancement that degrades safely without a guard).
 * Anything else is "unguarded" and fails the run (exit 1).
 *
 * JS: report only. Known Web API members used by the labs/gb sources are
 * looked up the same way; for each non-widely-available one the script says
 * whether the use sites appear to feature-detect it.
 *
 * Run `npm run gb:check -- --all` first: the .css files are build output.
 */

import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {getCompatibleVersions} from 'baseline-browser-mapping';

const require = createRequire(import.meta.url);

/** Packs `major.minor` into Lightning CSS's `major << 16 | minor << 8`. */
const encode = (version) => {
  const [major, minor = '0'] = String(version).split('.');
  return (Number(major) << 16) | (Number(minor) << 8);
};

/**
 * Lightning CSS targets for Baseline "widely available" (the core browser set
 * minus the Android variants, which Lightning names `android`/`ios_saf`).
 * Returns `{targets, versions}`; `versions` is the printable form.
 */
export function baselineTargets() {
  const rows = getCompatibleVersions({suppressWarnings: true});
  const names = {chrome: 'chrome', edge: 'edge', firefox: 'firefox', safari: 'safari', safari_ios: 'ios_saf'};
  const targets = {};
  const versions = {};
  for (const {browser, version} of rows) {
    const key = names[browser];
    if (!key) continue; // chrome_android / firefox_android: no Lightning name worth adding
    targets[key] = encode(version);
    versions[key] = version;
  }
  return {targets, versions};
}

// ---------------------------------------------------------------------------
// Everything below only runs when invoked as a script.
// ---------------------------------------------------------------------------

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await main();
}

async function main() {
  const {parse, generate} = require('css-tree');
  const {features} = require('web-features');
  const argv = process.argv.slice(2);
  const verbose = argv.includes('--verbose');
  const cssOnly = argv.includes('--css-only');
  const ROOT = join('material-design-expressive');

  // ---- BCD key -> {feature, baseline} ------------------------------------
  /** @type {Map<string, {feature: string, baseline: 'high'|'low'|false}>} */
  const KEYS = new Map();
  for (const [id, f] of Object.entries(features)) {
    if (f.kind !== 'feature') continue;
    for (const key of f.compat_features ?? []) {
      const baseline = f.status.by_compat_key?.[key]?.baseline ?? f.status.baseline;
      const prev = KEYS.get(key);
      // A key listed by several features: keep the least mature status.
      if (!prev || rank(baseline) < rank(prev.baseline)) KEYS.set(key, {feature: id, baseline});
    }
  }
  function rank(b) {
    return b === 'high' ? 2 : b === 'low' ? 1 : 0;
  }
  const first = (...candidates) => candidates.find((k) => KEYS.has(k));

  // ---- allow list ---------------------------------------------------------
  const allowPath = join('scripts', 'gb-baseline-allow.json');
  const allow = existsSync(allowPath) ? JSON.parse(readFileSync(allowPath, 'utf8')) : [];
  for (const entry of allow) {
    if (!(entry.key || entry.feature) || !entry.reason) throw new Error(`${allowPath}: every entry needs "key" or "feature", and "reason"`);
  }
  const isAllowed = (key, file) =>
    allow.find((e) => (e.key === key || e.feature === KEYS.get(key)?.feature) && (!e.files || e.files.some((f) => file.includes(f))));

  // ---- CSS ----------------------------------------------------------------
  const cssFiles = (dir) => {
    const out = [];
    for (const name of readdirSync(dir)) {
      if (name === 'node_modules') continue;
      const path = join(dir, name);
      if (statSync(path).isDirectory()) out.push(...cssFiles(path));
      else if (name.endsWith('.css')) out.push(path);
    }
    return out;
  };

  /** One finding: a BCD key used at a place, with the names that identify it. */
  const uses = [];
  const unmapped = new Map();
  const note = (key, names, ctx, what) => {
    uses.push({key, names, file: ctx.file, where: ctx.where(), what, guards: ctx.guards.slice()});
  };
  const unknown = (kind, name) => unmapped.set(`${kind} ${name}`, (unmapped.get(`${kind} ${name}`) ?? 0) + 1);

  const FN_NAMES = (f) => [
    `css.types.${f}`, `css.types.color.${f}`, `css.types.transform-function.${f}`,
    `css.types.basic-shape.${f}`, `css.types.gradient.${f}`, `css.types.image.${f}`,
    `css.types.filter-function.${f}`, `css.types.easing-function.${f}`, `css.types.${f}_function`,
  ];
  const NOT_FUNCTIONS = new Set(['var', 'calc', 'rgb', 'rgba', 'hsl', 'hsla', 'url', 'min', 'max', 'clamp']);
  // Functions that need an explicit lookup even though they are old: all are
  // resolved through KEYS, so being in this set only skips the "unmapped" note.

  function scanValue(prop, value, ctx, custom) {
    // Functions (incl. relative color syntax `hsl(from ...)`).
    for (const m of value.matchAll(/([a-z][a-z0-9-]*)\(\s*(from\b)?/gi)) {
      const fn = m[1].toLowerCase();
      if (m[2] && /^(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)$/.test(fn)) {
        const key = first('css.types.color.relative_color', 'css.types.color.relative-color');
        if (key) note(key, ['from', fn], ctx, `${prop}: ${fn}(from ...)`);
        else unknown('relative-color', fn);
      }
      const key = first(...FN_NAMES(fn));
      if (key) note(key, [fn], ctx, `${prop}: ${fn}()`);
      else if (!NOT_FUNCTIONS.has(fn) && !/^(translate|scale|rotate|skew|matrix|cubic-bezier|steps|linear|ease|env|counter|attr|format|local|rect|inset|circle|ellipse|polygon|path)/.test(fn)) {
        if (!KEYS.has(`css.types.${fn}`)) unknown('function', fn);
      }
    }
    // Units.
    for (const m of value.matchAll(/[\d.]([a-z]{2,4})\b/g)) {
      const key = first(`css.types.length.${m[1]}`);
      if (key) note(key, [m[1]], ctx, `${prop}: <length>${m[1]}`);
    }
    if (custom) return;
    // Keyword values that have their own BCD entry (e.g. container-type: scroll-state).
    for (const m of value.matchAll(/(?<![\w-])([a-z][a-z-]*)(?![\w-]*\()/gi)) {
      const kw = m[1].toLowerCase();
      const key = first(`css.properties.${prop}.${kw}`, `css.types.${prop}-value.${kw}`);
      // The property row already covers a property that is itself not widely available.
      const propInfo = KEYS.get(`css.properties.${prop}`);
      if (key && (!propInfo || propInfo.baseline === 'high')) note(key, [prop, kw], ctx, `${prop}: ${kw}`);
    }
  }

  function scanSelector(node, ctx, ruleText) {
    const walk = (n) => {
      switch (n.type) {
        case 'PseudoClassSelector':
        case 'PseudoElementSelector': {
          const name = n.name.toLowerCase();
          const key = first(`css.selectors.${name}`, `css.selectors.${name}function`);
          if (key) note(key, [name], ctx, `selector ${n.type === 'PseudoClassSelector' ? ':' : '::'}${name}`);
          else if (!name.startsWith('-')) unknown('selector', name);
          break;
        }
        case 'NestingSelector':
          note('css.selectors.nesting', ['&'], ctx, 'selector &');
          break;
      }
      if (n.children) n.children.forEach(walk);
    };
    walk(node);
  }

  function visitBlock(block, ctx) {
    if (!block?.children) return;
    block.children.forEach((child) => {
      switch (child.type) {
        case 'Declaration': {
          const prop = child.property.toLowerCase();
          const custom = prop.startsWith('--');
          const value = child.value.type === 'Raw' ? child.value.value : generate(child.value);
          if (!custom) {
            const key = first(`css.properties.${prop}`);
            if (key) note(key, [prop], {...ctx, where: () => `${ctx.where()} { ${prop} }`}, `property ${prop}`);
            else if (!prop.startsWith('-')) unknown('property', prop);
          }
          const c2 = {...ctx, where: () => `${ctx.where()} { ${prop} }`};
          scanValue(prop, value, c2, custom);
          break;
        }
        case 'Rule': {
          const text = generate(child.prelude);
          const c2 = {...ctx, where: () => (ctx.parent ? `${ctx.parent()} ${text}` : text), parent: undefined};
          const c3 = {...c2, parent: c2.where};
          if (child.prelude.type === 'SelectorList') scanSelector(child.prelude, c2, text);
          visitBlock(child.block, c3);
          break;
        }
        case 'Atrule':
          visitAtrule(child, ctx);
          break;
        case 'Raw':
          ctx.raw++;
          break;
      }
    });
  }

  function visitAtrule(rule, ctx) {
    const name = rule.name.toLowerCase();
    const prelude = rule.prelude ? generate(rule.prelude) : '';
    const label = `@${name}${prelude ? ' ' + prelude : ''}`;
    const here = {...ctx, where: () => (ctx.where() ? `${ctx.where()} ${label}` : label)};
    const key = first(`css.at-rules.${name}`);
    if (key) note(key, [name], here, `at-rule @${name}`);
    else if (!['keyframes', 'media', 'theme', 'utility', 'font-face', 'import', 'charset', 'namespace', 'page', 'supports', 'layer', 'container', 'property', 'scope', 'starting-style'].includes(name)) unknown('at-rule', name);

    if (name === 'media' || name === 'container') {
      for (const m of prelude.matchAll(/\(\s*([a-z-]+)\s*[:)>< =]/gi)) {
        const k = first(`css.at-rules.${name}.${m[1].toLowerCase()}`);
        if (k) note(k, [m[1].toLowerCase()], here, `@${name} (${m[1]})`);
      }
      if (/[<>]=?/.test(prelude)) {
        const k = first('css.at-rules.media.range_syntax', 'css.at-rules.container.range_syntax');
        if (k) note(k, ['<', '>'], here, `@${name} range syntax`);
      }
      const sq = prelude.match(/scroll-state\(\s*([a-z-]+)/i);
      if (name === 'container' && sq) {
        const k = first(`css.at-rules.container.scroll-state_queries.${sq[1]}`, 'css.at-rules.container.scroll-state_queries');
        if (k) note(k, ['scroll-state', sq[1]], here, `@container scroll-state(${sq[1]})`);
      }
      if (name === 'container' && /(^|[\s(])style\(/i.test(prelude)) {
        const k = first('css.at-rules.container.style_queries_for_custom_properties');
        if (k) note(k, ['style'], here, '@container style()');
      }
      if (name === 'container' && /(^|[\s(])(anchored)\(/i.test(prelude)) {
        const k = first('css.at-rules.container.anchor_position_queries');
        if (k) note(k, ['anchored'], here, '@container anchored()');
      }
    }
    if (name === 'media') scanValue('@media', prelude, here, true);
    if (name === 'container') scanValue('@container', prelude, here, true);

    const inner = name === 'supports' ? {...here, guards: [...ctx.guards, prelude]} : here;
    if (name === 'property') return; // descriptors, not declarations
    visitBlock(rule.block, inner);
  }

  const files = cssFiles(ROOT);
  if (!files.length) {
    console.error('No compiled .css files under labs/gb. Run `npm run gb:check -- --all` first.');
    process.exit(2);
  }
  let raw = 0;
  for (const file of files) {
    const rel = relative('.', file).replaceAll('\\', '/');
    if (rel.endsWith('styles/tailwind.css')) continue; // Tailwind input, not plain CSS
    const ast = parse(readFileSync(file, 'utf8'), {positions: false, parseCustomProperty: false});
    const ctx = {file: rel, guards: [], where: () => '', raw: 0};
    visitBlock({children: ast.children}, ctx);
    raw += ctx.raw;
  }

  // ---- classify -----------------------------------------------------------
  const guardedBy = (use) =>
    use.guards.some((g) => use.names.some((n) => new RegExp(`(^|[^\\w-])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`, 'i').test(g)));
  /** @type {Map<string, {key: string, feature: string, baseline: any, uses: number, guarded: number, allowed: number, unguarded: any[]}>} */
  const table = new Map();
  for (const u of uses) {
    const info = KEYS.get(u.key);
    if (!info || info.baseline === 'high') continue;
    let row = table.get(u.key);
    if (!row) table.set(u.key, (row = {key: u.key, feature: info.feature, baseline: info.baseline, uses: 0, guarded: 0, allowed: 0, unguarded: []}));
    row.uses++;
    if (guardedBy(u)) row.guarded++;
    else if (isAllowed(u.key, u.file)) row.allowed++;
    else row.unguarded.push(u);
  }

  const rows = [...table.values()].sort((a, b) => a.key.localeCompare(b.key));
  const status = (b) => (b === 'low' ? 'newly' : 'limited');
  console.log(`[gb:baseline] CSS: ${files.length} files, ${uses.length} feature uses mapped, ${rows.length} not widely available`);
  if (rows.length) {
    const w = Math.max(...rows.map((r) => r.key.length));
    const wf = Math.max(...rows.map((r) => r.feature.length));
    console.log(`${'BCD key'.padEnd(w)}  ${'web-features id'.padEnd(wf)}  baseline  uses  guarded  allowed  unguarded`);
    for (const r of rows) {
      console.log(
        `${r.key.padEnd(w)}  ${r.feature.padEnd(wf)}  ${status(r.baseline).padEnd(8)}  ${String(r.uses).padStart(4)}  ${String(r.guarded).padStart(7)}  ${String(r.allowed).padStart(7)}  ${String(r.unguarded.length).padStart(9)}`,
      );
    }
  }
  if (verbose) {
    console.log('\nAll non-widely-available uses:');
    for (const u of uses) {
      const info = KEYS.get(u.key);
      if (info && info.baseline !== 'high') console.log(`  ${u.file}: ${u.where} -> ${u.what} [${u.key}] ${guardedBy(u) ? 'guarded' : isAllowed(u.key, u.file) ? 'allowed' : 'UNGUARDED'}`);
    }
    if (unmapped.size) console.log(`\nNot found in web-features (ignored): ${[...unmapped].map(([k, n]) => `${k}x${n}`).join(', ')}`);
  }
  if (raw) console.log(`note: ${raw} unparsed block fragments (css-tree could not parse them; not checked)`);

  const failures = rows.flatMap((r) => r.unguarded);
  if (failures.length) {
    console.error('\nUnguarded, not allowed (BCD key (feature): uses, files, first selector):');
    const byKey = new Map();
    for (const u of failures) (byKey.get(u.key) ?? byKey.set(u.key, []).get(u.key)).push(u);
    for (const [key, list] of byKey) {
      const fileCounts = new Map();
      for (const u of list) {
        const f = u.file.replace('', '');
        fileCounts.set(f, (fileCounts.get(f) ?? 0) + 1);
      }
      console.error(`  ${key} (${KEYS.get(key).feature}): ${list.length} in ${[...fileCounts].map(([f, n]) => `${f}${n > 1 ? ` x${n}` : ''}`).join(', ')}`);
      console.error(`      e.g. ${list[0].where.slice(0, 160)} -> ${list[0].what}`);
    }
    console.error(`\nGuard each with @supports, or add it to ${allowPath} with a reason if it degrades safely.`);
  }

  if (!cssOnly) jsReport();

  const {versions} = baselineTargets();
  console.log(`\n[gb:baseline] widely available targets: ${Object.entries(versions).map(([b, v]) => `${b} ${v}`).join(', ')}`);
  console.log(`[gb:baseline] ${failures.length ? `FAIL: ${failures.length} unguarded use(s)` : 'OK: no unguarded, non-allowed CSS uses'}`);
  process.exit(failures.length ? 1 : 0);

  // ---- JS (report only) ----------------------------------------------------
  function jsReport() {
    /** [regex on source, BCD key, label, detection regex (any match nearby counts)] */
    const API = [
      [/\bshowPopover\b/, 'api.HTMLElement.showPopover'],
      [/\bhidePopover\b/, 'api.HTMLElement.hidePopover'],
      [/\btogglePopover\b/, 'api.HTMLElement.togglePopover'],
      [/\.popover\b|\bpopover\s*=/, 'api.HTMLElement.popover'],
      [/\bToggleEvent\b/, 'api.ToggleEvent'],
      [/\bCloseWatcher\b/, 'api.CloseWatcher'],
      [/\bCSS\.registerProperty\b/, 'api.CSS.registerProperty_static'],
      [/\bscrollend\b/, 'api.Element.scrollend_event'],
      [/\bnavigation\.(addEventListener|navigate|currentEntry|entries|canGoBack)|\bwindow\.navigation\b/, 'api.Navigation'],
      [/\bResizeObserver\b/, 'api.ResizeObserver'],
      [/\bIntersectionObserver\b/, 'api.IntersectionObserver'],
      [/\battachInternals\b/, 'api.HTMLElement.attachInternals'],
      [/\bshowPicker\b/, 'api.HTMLInputElement.showPicker'],
      [/\badoptedStyleSheets\b/, 'api.Document.adoptedStyleSheets'],
      [/\.replaceSync\b/, 'api.CSSStyleSheet.replaceSync'],
      [/\bstartViewTransition\b/, 'api.Document.startViewTransition'],
      [/\bgetAnimations\b/, 'api.Element.getAnimations'],
      [/\bcheckVisibility\b/, 'api.Element.checkVisibility'],
      [/\bshowModal\b/, 'api.HTMLDialogElement.showModal'],
      [/\.inert\b/, 'api.HTMLElement.inert'],
      [/\bcommandfor\b|\bcommandForElement\b/, 'api.HTMLButtonElement.commandForElement'],
      [/\bpopoverTargetElement\b/, 'api.HTMLButtonElement.popoverTargetElement'],
      [/\bsetValidity\b/, 'api.ElementInternals.setValidity'],
      [/\bsetPointerCapture\b/, 'api.Element.setPointerCapture'],
      [/\bfindLast\b/, 'javascript.builtins.Array.findLast'],
      [/\bIntl\.Locale\b/, 'javascript.builtins.Intl.Locale'],
      [/\bIntl\.getCanonicalLocales\b/, 'javascript.builtins.Intl.getCanonicalLocales'],
      [/\bscheduler\.(yield|postTask)\b/, 'api.Scheduler'],
      [/\banchorElement\b/, 'api.HTMLElement.popover'], // popover anchoring uses the anchor attribute
      [/\bPerformanceObserver\b/, 'api.PerformanceObserver'],
      [/\.animate\(/, 'api.Element.animate'],
      [/\bFormData\b/, 'api.FormData'],
      [/\bdelegatesFocus\b/, 'api.ShadowRoot.delegatesFocus'],
      [/\bassignedElements\b/, 'api.HTMLSlotElement.assignedElements'],
      [/\bfocusVisible\b/, 'api.FocusEvent'], // option name only; resolved below if absent
    ];
    // ARIA reflection on ElementInternals: internals.ariaLabel, internals.role ...
    const ariaRe = /\b(?:internals|#internals|_internals)\.(aria[A-Z]\w*|role)\b/g;
    // Element-reference ARIA reflection on Element (ariaActiveDescendantElement ...).
    const ariaElRe = /\.(aria\w+Elements?)\b/g;

    const srcFiles = [];
    const walkDir = (dir) => {
      for (const name of readdirSync(dir)) {
        if (name === 'node_modules' || name === 'demo' || name === 'skill') continue;
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walkDir(p);
        else if (/\.ts$/.test(name) && !/(_test|_gap|\.cssresult|\.d)\.ts$/.test(name) && !p.includes(join('shared', 'central'))) srcFiles.push(p);
      }
    };
    walkDir(ROOT);

    /** key -> {sites: [{file, line, detected}]} */
    const found = new Map();
    const add = (key, file, lines, i, member) => {
      if (!KEYS.has(key)) return;
      const lo = Math.max(0, i - 8), hi = Math.min(lines.length, i + 4);
      const ctxText = lines.slice(lo, hi).join('\n');
      const m = member.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Feature detection: `'x' in o`, `typeof x`, `x?.`, `CSS.supports`, `if (o.x)` / `o.x &&`, `.x?.(`.
      const detected = new RegExp(`['"\`]${m}['"\`]\\s+in\\b|typeof\\s+[\\w.]*${m}|${m}\\s*\\?\\.|\\?\\.\\s*${m}|CSS\\.supports|(?:if\\s*\\(|&&|\\|\\||!)\\s*[\\w.]*${m}\\b|\\b${m}\\b\\s*(?:&&|\\|\\||\\?)|globalThis|catch\\s*[({]`).test(ctxText) ||
        // A guard elsewhere in the file (wrapper helpers such as supportsX()).
        new RegExp(`['"\`]${m}['"\`]\\s+in\\b|typeof\\b[^;\n]*\\b${m}\\b`).test(lines.join('\n'));
      (found.get(key) ?? found.set(key, []).get(key)).push({file: relative('.', file).replaceAll('\\', '/'), line: i + 1, detected});
    };
    for (const file of srcFiles) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((text, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(text)) return;
        for (const [re, key] of API) {
          if (key === 'api.FocusEvent') continue;
          const m = text.match(re);
          if (m) add(key, file, lines, i, m[0].replace(/^\W+|\W+$/g, '') || m[0]);
        }
        for (const m of text.matchAll(ariaRe)) add(`api.ElementInternals.${m[1]}`, file, lines, i, m[1]);
        for (const m of text.matchAll(ariaElRe)) add(`api.Element.${m[1]}`, file, lines, i, m[1]);
      });
    }

    console.log(`\n[gb:baseline] JS APIs (report only): ${srcFiles.length} source files, ${found.size} tracked members used`);
    const out = [...found].map(([key, sites]) => ({key, info: KEYS.get(key), sites})).sort((a, b) => a.key.localeCompare(b.key));
    const weak = out.filter((o) => o.info.baseline !== 'high');
    if (verbose) for (const o of out) if (o.info.baseline === 'high') console.log(`  high    ${o.key} (${o.sites.length})`);
    if (!weak.length) return console.log('  every tracked member is widely available');
    const w = Math.max(...weak.map((o) => o.key.length));
    console.log(`${'BCD key'.padEnd(w)}  baseline  sites  detected  first undetected site`);
    for (const o of weak) {
      const undetected = o.sites.filter((s) => !s.detected);
      console.log(
        `${o.key.padEnd(w)}  ${status(o.info.baseline).padEnd(8)}  ${String(o.sites.length).padStart(5)}  ${String(o.sites.length - undetected.length).padStart(8)}  ${undetected[0] ? `${undetected[0].file}:${undetected[0].line}` : '-'}`,
      );
    }
  }
}
