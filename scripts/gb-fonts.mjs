#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Self-hosts small fonts for the /3.0/ site, so visitors never contact a
 * third party and download little: Roboto Flex (OFL) split by unicode range
 * (a page loads the Latin file only), and Material Symbols Outlined (Apache
 * 2.0) subset to the icons the site uses, with all four axes (components set
 * FILL and opsz; the Material Symbols page demos weight and grade).
 *
 *   node scripts/gb-fonts.mjs          # collect icons, download, write; commit the output
 *   node scripts/gb-fonts.mjs --check  # exit 1 if a used icon is missing from the subset
 *
 * Icons used: the text of <md-gb-icon> in docs/3.0, the layout, the site
 * scripts and labs/gb (components and their demos), `icon:` front matter,
 * ligatures in component styles (content: 'arrow_drop_down', or an icon
 * custom property it reads: --icon: 'radio_button_checked'), and quoted
 * strings in the site scripts and components that are Material Symbols
 * names (icons chosen in code, e.g. the theme toggle's). Candidates are
 * matched against Google's list of Material Symbols names.
 *
 * Output: site/content/fonts/gb/ (content-hash file names, served at
 * /fonts/gb/ with an immutable one-year Cache-Control, cache first in the
 * service worker), fonts.css with the @font-face rules, and
 * site/content/_data/gbFonts.json (stylesheet, preload list, icon list).
 */

import {createHash} from 'node:crypto';
import {mkdir, readFile, readdir, rm, stat, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const OUT = join('site', 'content', 'fonts', 'gb');
const DATA = join('site', 'content', '_data', 'gbFonts.json');
// A current Chrome user agent, so Google Fonts answers with woff2.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const ROBOTO = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap';
const SYMBOLS =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
const NAMES =
  'https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/MaterialSymbolsOutlined%5BFILL,GRAD,opsz,wght%5D.codepoints';

// --- Collecting the icons --------------------------------------------------

async function walk(dir, test, out = []) {
  let entries;
  try {
    entries = await readdir(dir, {withFileTypes: true});
  } catch {
    return out;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules') await walk(path, test, out);
    } else if (test(entry.name)) {
      out.push(path);
    }
  }
  return out;
}

/** Sources whose <md-gb-icon> text and front matter name icons. */
async function markupFiles() {
  return [
    ...(await walk('docs', (n) => n.endsWith('.md'))),
    ...(await walk('site/content/_includes', (n) => n.endsWith('.html'))),
    ...(await walk('site/client', (n) => n.endsWith('.ts'))),
    ...(await walk('material-design-expressive/components', (n) => /\.ts$/.test(n) && !/(_test|\.d)\.ts$/.test(n))),
    ...(await walk('material-design-expressive/extras', (n) => /\.ts$/.test(n) && !/(_test|\.d)\.ts$/.test(n))),
    ...(await walk('material-design-expressive/styles', (n) => /\.ts$/.test(n) && !/(_test|\.d)\.ts$/.test(n))),
  ];
}

/** Sources whose quoted strings may be icon names chosen in code. */
async function codeFiles() {
  return [
    ...(await walk('site/client', (n) => n.endsWith('.ts'))),
    ...(await walk('site/spec', (n) => n.endsWith('.cjs'))),
    ...(await walk('site/eleventy', (n) => n.endsWith('.cjs'))),
    ...(await walk('material-design-expressive/components', (n) => /\.ts$/.test(n) && !/(_test|\.d|cssresult)\.ts$/.test(n))),
    ...(await walk('material-design-expressive/extras', (n) => /\.ts$/.test(n) && !/(_test|\.d|cssresult)\.ts$/.test(n))),
  ];
}

/**
 * The icons the site certainly uses (markup, front matter, styles), and the
 * quoted strings that may be icons (filtered by the list of names).
 */
async function collect() {
  const certain = new Set();
  const maybe = new Set();
  for (const file of await markupFiles()) {
    const text = await readFile(file, 'utf8');
    for (const m of text.matchAll(/<md-gb-icon\b[^>]*>\s*([a-z][a-z0-9_]*)\s*<\/md-gb-icon>/g)) certain.add(m[1]);
    for (const m of text.matchAll(/^icon:\s*([a-z][a-z0-9_]*)\s*$/gm)) certain.add(m[1]);
  }
  // The shell spec's icons: the sections ({icon: 'info'}) and icon(key,
  // 'palette') calls.
  const shell = await readFile('site/spec/shell.cjs', 'utf8');
  for (const m of shell.matchAll(/\bicon:\s*'([a-z][a-z0-9_]*)'/g)) certain.add(m[1]);
  for (const m of shell.matchAll(/\bicon\([^,()]+,\s*'([a-z][a-z0-9_]*)'\)/g)) certain.add(m[1]);
  for (const m of shell.matchAll(/\$(?:then|else):\s*'([a-z][a-z0-9_]*)'/g)) certain.add(m[1]);
  // Ligatures in component styles: content: 'arrow_drop_down', or a custom
  // property the content reads (--icon: 'radio_button_checked').
  for (const file of [...(await walk('material-design-expressive/components', (n) => n.endsWith('.scss'))), ...(await walk('material-design-expressive/styles', (n) => n.endsWith('.scss')))]) {
    const text = await readFile(file, 'utf8');
    for (const m of text.matchAll(/(?:\bcontent|--[\w-]*icon[\w-]*):\s*['"]([a-z][a-z0-9_]*)['"]/g)) certain.add(m[1]);
  }
  // Icons chosen in code sit on lines about icons (<md-gb-icon>${...}
  // </md-gb-icon>, icon.textContent = ...) or in a block that opens on one
  // (MODE_ICON = {auto: 'brightness_auto', light: 'light_mode', ...}, its
  // values on the lines below); other quoted words that happen to be icon
  // names (css, title, width) are not icons.
  for (const file of await codeFiles()) {
    const text = await readFile(file, 'utf8');
    let depth = 0;
    for (const line of text.split('\n')) {
      const opens = (line.match(/[{[]/g) ?? []).length;
      const closes = (line.match(/[}\]]/g) ?? []).length;
      if (depth === 0 && /icon/i.test(line) && opens > closes) depth = opens - closes;
      else if (depth > 0) depth = Math.max(0, depth + opens - closes);
      if (depth === 0 && !/icon/i.test(line)) continue;
      for (const m of line.matchAll(/['"`]([a-z][a-z0-9_]{1,40})['"`]/g)) maybe.add(m[1]);
    }
  }
  return {certain, maybe};
}

// --- Downloading -----------------------------------------------------------

async function get(url, as) {
  const res = await fetch(url, {headers: {'User-Agent': UA}});
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return as === 'text' ? res.text() : Buffer.from(await res.arrayBuffer());
}

/** Downloads a Google Fonts CSS and its woff2 files into OUT. */
async function download(cssUrl, isPreloaded) {
  const source = await get(cssUrl, 'text');
  const blocks = source.match(/(?:\/\*[^*]*\*\/\s*)?@font-face\s*\{[^}]*\}/g) ?? [];
  const css = [];
  const preload = [];
  let bytes = 0;
  for (const block of blocks) {
    const url = /url\((https:[^)]+)\)/.exec(block)?.[1];
    if (!url) continue;
    const data = await get(url);
    const family = /font-family:\s*'([^']+)'/.exec(block)[1].replace(/\s+/g, '-').toLowerCase();
    const name = `${family}-${createHash('sha256').update(data).digest('hex').slice(0, 12)}.woff2`;
    await writeFile(join(OUT, name), data);
    bytes += data.length;
    css.push(block.replace(url, `./${name}`).trim());
    if (isPreloaded(block)) preload.push(`/fonts/gb/${name}`);
  }
  return {css, preload, bytes};
}

// --- Main ------------------------------------------------------------------

const {certain, maybe} = await collect();

if (process.argv.includes('--check')) {
  const data = JSON.parse(await readFile(DATA, 'utf8'));
  const subset = new Set(data.icons ?? []);
  const missing = [...certain].filter((name) => !subset.has(name)).sort();
  if (missing.length) {
    console.error(
      `gb-fonts: ${missing.length} icon(s) used but not in the subset font: ${missing.join(', ')}.\n` +
        'Run `node scripts/gb-fonts.mjs` and commit site/content/fonts/gb and site/content/_data/gbFonts.json.',
    );
    process.exit(1);
  }
  console.log(`gb-fonts: all ${certain.size} used icons are in the subset (${subset.size} icons).`);
  process.exit(0);
}

const known = new Set(
  (await get(NAMES, 'text'))
    .split('\n')
    .map((line) => line.split(' ')[0])
    .filter(Boolean),
);
const unknown = [...certain].filter((name) => !known.has(name));
if (unknown.length) {
  console.warn(`gb-fonts: not Material Symbols names (left out): ${unknown.sort().join(', ')}`);
}
const icons = [...new Set([...certain, ...maybe])].filter((name) => known.has(name)).sort();

await rm(OUT, {recursive: true, force: true});
await mkdir(OUT, {recursive: true});
// The Latin subset of Roboto Flex is the one every page needs.
const roboto = await download(ROBOTO, (block) => /\/\* latin \*\//.test(block));
// icon_names must be sorted; the subset keeps all four axes.
const symbols = await download(`${SYMBOLS}&icon_names=${icons.join(',')}&display=block`, () => true);

const css = [
  '/* Generated by scripts/gb-fonts.mjs from Google Fonts. Roboto Flex: SIL Open',
  '   Font License 1.1. Material Symbols (subset to the icons the site uses):',
  '   Apache License 2.0. */',
  '',
  ...roboto.css,
  ...symbols.css,
  // md-gb-icon's font (styles/icons: 'Material Symbols' by default)
  // is this family wherever the fonts are loaded: the site, and the
  // documents without its stylesheet (demo frames, component test pages).
  ":root {\n  --md-icon-font: 'Material Symbols Outlined';\n}",
  '',
].join('\n\n');
await writeFile(join(OUT, 'fonts.css'), css.replace(/\n{3,}/g, '\n\n'));
await writeFile(
  DATA,
  JSON.stringify({stylesheet: '/fonts/gb/fonts.css', preload: [...roboto.preload, ...symbols.preload], icons}, null, 2) + '\n',
);
let total = 0;
for (const f of await readdir(OUT)) total += (await stat(join(OUT, f))).size;
console.log(
  `gb-fonts: Roboto Flex ${(roboto.bytes / 1024).toFixed(0)} KB (all subsets), ` +
    `Material Symbols ${(symbols.bytes / 1024).toFixed(0)} KB (${icons.length} icons); ${(total / 1024).toFixed(0)} KB in all.`,
);
