/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generated images of the /3.0/ docs, built by scripts/catalog-dev.mjs
 * (buildSite) before Eleventy copies them to /3.0/og/ and /3.0/icons/:
 *
 * - catalog/_dev-gb/og/<section>-<slug>.png: the 1200x630 Open Graph image of
 *   every page (title, section, description, wordmark, M3 Expressive shapes,
 *   baseline md-sys-color tokens), rendered from an HTML template by
 *   Playwright. Cached by a hash of the page's text and the template in
 *   catalog/_dev-gb/og-cache, so a rebuild renders only changed pages.
 * - catalog/_dev-gb/icons/: icon-192.png, icon-512.png and
 *   icon-maskable-512.png of the web app manifest, rendered from
 *   catalog/site/images/favicon.svg (re-rendered when it changes).
 * - catalog/_dev-gb/custom-elements.json: the API of every md-gb element as a
 *   Custom Elements Manifest (/3.0/custom-elements.json), read from the labs/gb
 *   sources; cached by a stamp of them.
 * - catalog/_dev-gb/skill/: the agent skill (labs/gb/skill) as /3.0/skill/.
 * - buildSnapshot() (after the pages are served, off the critical path): the
 *   single-file download of the docs, /3.0/material-web-3.0.mhtml, made by
 *   Chromium from /3.0/all/ and cached by a hash of that page. Run alone with
 *   `node scripts/gb-site-assets.mjs --snapshot http://localhost:8000`.
 */

import {createHash} from 'node:crypto';
import {existsSync, statSync} from 'node:fs';
import {copyFile, cp, mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = join(import.meta.dirname, '..');
const CATALOG = join(ROOT, 'catalog');
const OUT = join(CATALOG, '_dev-gb');
const FAVICON = join(CATALOG, 'site', 'images', 'favicon.svg');
const FONT = join(CATALOG, 'site', 'fonts', 'google-sans', 'regular.woff2');
const SECTIONS = ['about', 'foundations', 'styles', 'components'];
const CONCURRENCY = 6;
/** Bump to re-render every image after a change to the template. */
const TEMPLATE_VERSION = 3;

/** The font inline: the render page (about:blank) can't load file: URLs. */
const fontUrl = async () => `data:font/woff2;base64,${(await readFile(FONT)).toString('base64')}`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The pages: {name, title, section, description} from docs/3.0 front matter. */
async function pages() {
  const matter = require('gray-matter');
  const {SECTIONS: SECTION_INFO, ogName, sectionLabel} = require(join(CATALOG, 'eleventy-helpers', 'gb-site.cjs'));
  const list = [];
  for (const section of SECTIONS) {
    // The section's index page (/3.0/<section>/).
    const info = SECTION_INFO.find((s) => s.id === section);
    list.push({
      name: ogName(`/3.0/${section}/`, section),
      title: info.label,
      section: info.label,
      description: info.description,
    });
    const dir = join(ROOT, 'docs', '3.0', section);
    for (const f of (await readdir(dir)).sort()) {
      if (!f.endsWith('.md') || f === 'README.md') continue;
      const {data} = matter(await readFile(join(dir, f), 'utf8'));
      const url = `/3.0/${section}/${f.slice(0, -3)}/`;
      list.push({
        name: ogName(url, section),
        title: String(data.title ?? f.slice(0, -3)),
        section: sectionLabel(section),
        description: String(data.description ?? ''),
      });
    }
  }
  return list;
}

/** A scalloped "cookie" shape (path in a 100x100 box). */
function cookie(lobes, depth) {
  const pts = [];
  for (let i = 0; i < 180; i++) {
    const t = (i / 180) * Math.PI * 2;
    const r = 46 * (1 - depth + depth * (0.5 + 0.5 * Math.cos(lobes * t)));
    pts.push(`${(50 + r * Math.cos(t)).toFixed(2)},${(50 + r * Math.sin(t)).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

/** The Open Graph image of a page as a document. */
function ogDocument(page, c, font, logo) {
  const titleSize = page.title.length > 22 ? 84 : page.title.length > 14 ? 104 : 120;
  const flower = cookie(8, 0.1);
  const sunny = cookie(12, 0.06);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'GS'; src: url(${font}) format('woff2'); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
body { inline-size: 1200px; block-size: 630px; overflow: hidden; position: relative;
  background: ${c.surface}; color: ${c.onSurface}; font-family: 'GS', 'Roboto Flex', Roboto, 'Segoe UI', system-ui, sans-serif; }
.shape { position: absolute; }
.text { position: absolute; inset: 0 auto 0 0; inline-size: 780px; padding: 72px 0 64px 80px;
  display: flex; flex-direction: column; justify-content: space-between; }
.chip { display: inline-block; padding: 8px 22px; border-radius: 999px; background: ${c.secondaryContainer};
  color: ${c.onSurface}; font-size: 26px; font-weight: 500; letter-spacing: .02em; }
h1 { font-size: ${titleSize}px; line-height: 1.04; font-weight: 500; letter-spacing: -.02em; margin-block: 28px 24px; }
p { font-size: 30px; line-height: 1.38; color: ${c.onSurfaceVariant}; display: -webkit-box;
  -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.brand { display: flex; align-items: center; gap: 18px; font-size: 32px; font-weight: 500; color: ${c.primary}; }
.brand img { inline-size: 52px; block-size: 52px; }
</style></head><body>
<svg class="shape" style="left:800px;top:-90px;width:520px;height:520px" viewBox="0 0 100 100"><path d="${flower}" fill="${c.primaryContainer}"/></svg>
<svg class="shape" style="left:880px;top:330px;width:250px;height:250px" viewBox="0 0 100 100"><path d="${sunny}" fill="${c.tertiaryContainer}"/></svg>
<svg class="shape" style="left:760px;top:420px;width:190px;height:190px" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="${c.primary}"/></svg>
<svg class="shape" style="left:1010px;top:300px;width:230px;height:120px" viewBox="0 0 230 120"><rect width="230" height="120" rx="60" fill="${c.secondaryContainer}"/></svg>
<svg class="shape" style="left:700px;top:90px;width:130px;height:130px" viewBox="0 0 100 100"><rect x="4" y="4" width="92" height="92" rx="38" fill="${c.tertiaryContainer}"/></svg>
<div class="text"><div><span class="chip">${esc(page.section)}</span><h1>${esc(page.title)}</h1><p>${esc(page.description)}</p></div>
<div class="brand"><img src="${logo}" alt="">Material Web 3.0</div></div>
</body></html>`;
}

async function launch() {
  let chromium;
  try {
    ({chromium} = await import('playwright'));
  } catch {
    console.warn('playwright is not installed; /3.0/ gets no Open Graph images or icons.');
    return null;
  }
  return chromium.launch();
}

/** Renders `jobs` ({make(page) -> Promise}) with a few pages at a time. */
async function pool(browser, jobs, options = {}) {
  const context = await browser.newContext(options);
  const queue = [...jobs];
  await Promise.all(
    Array.from({length: Math.min(CONCURRENCY, queue.length)}, async () => {
      const page = await context.newPage();
      for (let job; (job = queue.shift()); ) await job(page);
      await page.close();
    }),
  );
  await context.close();
}

/** Open Graph images: only the pages whose hash has no cached image. */
async function buildOgImages(browser, c, log) {
  const list = await pages();
  const cache = join(OUT, 'og-cache');
  const dir = join(OUT, 'og');
  await mkdir(cache, {recursive: true});
  await rm(dir, {recursive: true, force: true});
  await mkdir(dir, {recursive: true});
  const logo = `data:image/svg+xml;base64,${(await readFile(FAVICON)).toString('base64')}`;
  const font = await fontUrl();
  const jobs = [];
  const used = new Set();
  for (const p of list) {
    const doc = ogDocument(p, c, font, logo);
    const hash = createHash('sha1').update(`${TEMPLATE_VERSION}\n${doc}`).digest('hex').slice(0, 16);
    const cached = join(cache, `${hash}.png`);
    used.add(`${hash}.png`);
    if (!existsSync(cached)) {
      jobs.push(async (page) => {
        await page.setContent(doc, {waitUntil: 'load'});
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({path: cached, clip: {x: 0, y: 0, width: 1200, height: 630}});
      });
    }
  }
  if (jobs.length) {
    if (!browser) return;
    await pool(browser, jobs, {viewport: {width: 1200, height: 630}});
  }
  for (const p of list) {
    const doc = ogDocument(p, c, font, logo);
    const hash = createHash('sha1').update(`${TEMPLATE_VERSION}\n${doc}`).digest('hex').slice(0, 16);
    if (existsSync(join(cache, `${hash}.png`))) await copyFile(join(cache, `${hash}.png`), join(dir, `${p.name}.png`));
  }
  // Images of pages that changed or are gone.
  for (const f of await readdir(cache)) if (!used.has(f)) await rm(join(cache, f), {force: true});
  log?.(`Open Graph images: ${list.length} pages, ${jobs.length} rendered`);
}

/** Manifest icons from favicon.svg (cached until the SVG changes). */
async function buildIcons(browser, c, log) {
  const dir = join(OUT, 'icons');
  const targets = {'icon-192.png': [192, false], 'icon-512.png': [512, false], 'icon-maskable-512.png': [512, true]};
  const stamp = statSync(FAVICON).mtimeMs;
  const fresh = Object.keys(targets).every((f) => {
    const p = join(dir, f);
    return existsSync(p) && statSync(p).mtimeMs >= stamp;
  });
  if (fresh || !browser) return;
  await mkdir(dir, {recursive: true});
  const svg = (await readFile(FAVICON)).toString('base64');
  const brand = /<rect[^>]*fill="(#[0-9a-fA-F]{6})"/.exec(await readFile(FAVICON, 'utf8'))?.[1] ?? c.primary;
  const jobs = Object.entries(targets).map(([file, [size, maskable]]) => async (page) => {
    await page.setViewportSize({width: size, height: size});
    // Maskable: full-bleed brand color, logo inside the 80% safe zone.
    const inner = maskable ? Math.round(size * 0.66) : size;
    await page.setContent(
      `<!doctype html><style>html,body{margin:0;block-size:100%;display:grid;place-items:center;background:${maskable ? brand : 'transparent'}}` +
        `img{inline-size:${inner}px;block-size:${inner}px}</style><img src="data:image/svg+xml;base64,${svg}" alt="">`,
      {waitUntil: 'load'},
    );
    await page.screenshot({path: join(dir, file), omitBackground: !maskable});
  });
  await pool(browser, jobs);
  log?.('Manifest icons rendered');
}

// ---------------------------------------------------------------------------
// API manifest and agent skill.

const COMPONENTS = join(ROOT, 'labs', 'gb', 'components');
const SKILL = join(ROOT, 'labs', 'gb', 'skill');
/** Bump to regenerate custom-elements.json after changing how it is written. */
const API_VERSION = 2;

/** The sources whose change changes the API: stat of every component .ts. */
async function apiStamp() {
  const hash = createHash('sha1').update(`${API_VERSION}\n`);
  const files = [join(ROOT, 'scripts', 'm3', 'gb-elements.mjs'), fileURLToPath(import.meta.url)];
  const walkDir = async (dir) => {
    for (const e of await readdir(dir, {withFileTypes: true})) {
      const path = join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'demo') await walkDir(path);
      } else if (/\.ts$/.test(e.name) && !/(\.d|_test|_gap|_spec|_units)\.ts$/.test(e.name)) {
        files.push(path);
      }
    }
  };
  await walkDir(COMPONENTS);
  files.sort();
  for (const f of files) {
    const s = statSync(f);
    hash.update(`${f}\n${s.size}\n${Math.floor(s.mtimeMs)}\n`);
  }
  return hash.digest('hex').slice(0, 16);
}

/** `(a: T, b?: U) => R` -> {parameters, returns} (top-level parts only). */
function parseSignature(signature) {
  if (!signature.startsWith('(')) return {parameters: [], returns: ''};
  const split = (text) => {
    const parts = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '=' && text[i + 1] === '>') i++;
      else if ('([{<'.includes(ch)) depth++;
      else if (')]}>'.includes(ch)) depth--;
      else if (ch === ',' && depth === 0) {
        parts.push(text.slice(start, i));
        start = i + 1;
      }
    }
    parts.push(text.slice(start));
    return parts.map((p) => p.trim()).filter(Boolean);
  };
  let depth = 0;
  let close = -1;
  for (let i = 0; i < signature.length; i++) {
    if (signature[i] === '=' && signature[i + 1] === '>' && depth === 0) break;
    if ('([{'.includes(signature[i])) depth++;
    else if (')]}'.includes(signature[i]) && --depth === 0) {
      close = i;
      break;
    }
  }
  if (close < 0) return {parameters: [], returns: ''};
  const parameters = split(signature.slice(1, close)).map((p) => {
    const m = /^(\.\.\.)?([\w$]+)(\?)?\s*(?::\s*([\s\S]*))?$/.exec(p);
    if (!m) return {name: p};
    const out = {name: m[2]};
    if (m[4]) out.type = {text: m[4].trim()};
    if (m[3]) out.optional = true;
    if (m[1]) out.rest = true;
    return out;
  });
  const returns = /^\s*=>\s*([\s\S]*)$/.exec(signature.slice(close + 1))?.[1]?.trim() ?? '';
  return {parameters, returns};
}

/** One element as a Custom Elements Manifest class declaration. */
function cemDeclaration(e) {
  const attributes = [];
  const members = [];
  for (const p of e.props) {
    const field = {
      kind: 'field',
      name: p.name,
      type: {text: p.type},
      privacy: 'public',
    };
    if (p.default) field.default = p.default;
    if (p.description) field.description = p.description;
    if (p.attribute) {
      field.attribute = p.attribute;
      if (p.reflect) field.reflects = true;
      const attribute = {name: p.attribute, type: {text: p.type}, fieldName: p.name};
      if (p.default) attribute.default = p.default;
      if (p.description) attribute.description = p.description;
      attributes.push(attribute);
    }
    members.push(field);
  }
  for (const m of e.methods) {
    // Custom element lifecycle callbacks are not API.
    if (/^(connected|disconnected|adopted|attributeChanged)Callback$/.test(m.name)) continue;
    const {parameters, returns} = parseSignature(m.signature);
    const method = {kind: 'method', name: m.name, privacy: 'public'};
    if (m.description) method.description = m.description;
    if (parameters.length) method.parameters = parameters;
    if (returns) method.return = {type: {text: returns}};
    members.push(method);
  }
  const declaration = {kind: 'class', name: e.className, tagName: e.tag, customElement: true};
  if (e.summary) {
    declaration.description = e.summary;
    declaration.summary = e.summary;
  }
  if (e.superclass) declaration.superclass = {name: e.superclass, module: `/${e.superclassFile.replace(/\.ts$/, '.js')}`};
  if (attributes.length) declaration.attributes = attributes;
  if (members.length) declaration.members = members;
  const named = (list, extra) => list.map(([name, description]) => ({name, ...(description ? {description} : {}), ...extra?.(name)}));
  if (e.events.length) {
    declaration.events = e.events.map(([name, {type, description}]) => ({
      name,
      type: {text: type},
      ...(description ? {description} : {}),
    }));
  }
  if (e.slots.length) declaration.slots = named(e.slots);
  if (e.parts.length) declaration.cssParts = named(e.parts);
  if (e.cssProps.length) declaration.cssProperties = named(e.cssProps);
  return declaration;
}

/**
 * custom-elements.json (https://github.com/webcomponents/custom-elements-manifest,
 * schema 2.1.0): every md-gb element with its attributes, members, events,
 * slots, CSS parts and CSS custom properties, read from the labs/gb sources
 * (scripts/m3/gb-elements.mjs). Paths are relative to the @material/web
 * package root. Cached by a stamp of the sources; the type check of the
 * compiler API takes seconds.
 */
async function buildApiManifest(log) {
  const file = join(OUT, 'custom-elements.json');
  const stampFile = join(OUT, 'custom-elements.stamp');
  const stamp = await apiStamp();
  if (existsSync(file) && existsSync(stampFile) && (await readFile(stampFile, 'utf8')) === stamp) return;
  const {readGbElements} = await import(pathToFileURL(join(ROOT, 'scripts', 'm3', 'gb-elements.mjs')).href);
  const t = Date.now();
  const elements = readGbElements();
  const modules = elements.map((e) => {
    const path = e.file.replace(/\.ts$/, '.js');
    return {
      kind: 'javascript-module',
      path,
      declarations: [cemDeclaration(e)],
      exports: [
        {kind: 'js', name: e.className, declaration: {name: e.className, module: path}},
        {kind: 'custom-element-definition', name: e.tag, declaration: {name: e.className, module: path}},
      ],
    };
  });
  const manifest = {schemaVersion: '2.1.0', readme: 'Material Web 3.0 (labs/gb): the md-gb-* custom elements.', modules};
  await writeFile(file, JSON.stringify(manifest, null, 1) + '\n');
  await writeFile(stampFile, stamp);
  log?.(`custom-elements.json: ${elements.length} elements (${((Date.now() - t) / 1000).toFixed(1)}s)`);
}

/** The agent skill (labs/gb/skill) as /3.0/skill/ (its index.json is an Eleventy template). */
async function copySkill() {
  const dest = join(OUT, 'skill');
  await rm(dest, {recursive: true, force: true});
  await cp(SKILL, dest, {recursive: true});
}

// ---------------------------------------------------------------------------
// Single-file download of the docs.

/** Bump to rebuild the snapshot after changing how it is made. */
const SNAPSHOT_VERSION = 7;
export const SNAPSHOT_NAME = 'material-web-3.0.mhtml';
const SNAPSHOT_CACHE = join(OUT, 'mhtml-cache');
const SITE_DIR = join(CATALOG, process.env.NODE_ENV === 'DEV' ? '_dev' : '_prod');

/** Hash of what the snapshot is made from: the all-pages document and the shell script. */
async function snapshotHash(siteDir) {
  const page = join(siteDir, '3.0', 'all', 'index.html');
  if (!existsSync(page)) return null;
  const hash = createHash('sha1').update(`${SNAPSHOT_VERSION}\n`);
  hash.update(await readFile(page));
  for (const extra of [join(siteDir, 'js', 'gb', 'gb.js'), join(siteDir, 'js', 'gb', 'gb.css')]) {
    if (existsSync(extra)) hash.update(await readFile(extra));
  }
  return hash.digest('hex').slice(0, 16);
}

/**
 * Puts the cached snapshot of the current all-pages document in the site
 * (a copy: cheap, so it can run on the critical path). Returns whether the
 * cache had it.
 */
export async function restoreSnapshot({siteDir = SITE_DIR} = {}) {
  const hash = await snapshotHash(siteDir);
  const cached = hash && join(SNAPSHOT_CACHE, `${hash}.mhtml`);
  if (!cached || !existsSync(cached)) return false;
  await copyFile(cached, join(siteDir, '3.0', SNAPSHOT_NAME));
  return true;
}

/**
 * Chromium's own MHTML (`Page.captureSnapshot`) cannot hold this site: it
 * drops the styles of shadow roots (every md-gb element has one), writes the
 * legacy `shadowmode` attribute that no parser reads, and loses `font: var()`
 * declarations that sit next to `font-variation-settings`. So the page is
 * serialized in Chromium and the MHTML written here: the document with its
 * shadow roots as declarative shadow DOM (`<template shadowrootmode>`, which
 * the parser of any current browser attaches without script), the adopted
 * stylesheets as <style> elements, and the stylesheets, fonts and images it
 * refers to as parts of the file (so the demos' iframes find them too).
 */

/** Records the text of constructed stylesheets, which cannot be read back faithfully. */
const RECORD_STYLES = `(() => {
  const sources = new WeakMap();
  const proto = CSSStyleSheet.prototype;
  for (const name of ['replaceSync', 'replace']) {
    const original = proto[name];
    proto[name] = function (text) {
      sources.set(this, String(text));
      return original.call(this, text);
    };
  }
  window.__gbCssSource = (sheet) => sources.get(sheet);
})();`;

/** Runs in the page: the static document, and the URLs it needs. */
function serializeStatic() {
  const urls = new Set();
  const shared = new Map();
  const lookup = (win, sheet) => win.__gbCssSource?.(sheet) ?? [...sheet.cssRules].map((r) => r.cssText).join('\n');

  /** Static markup of a document; the documents of its iframes too (as srcdoc). */
  function serialize(doc) {
    const win = doc.defaultView;
    const roots = [];
    // Deepest first: a root's styles are added before its host is serialized.
    const walk = (root) => {
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) walk(el.shadowRoot);
      }
      if (root !== doc) roots.push(root);
    };
    walk(doc);
    // The same styles sit in hundreds of shadow roots: one part of the file
    // per distinct text, which each root links to.
    const sheets = (root) => {
      if (!root.adoptedStyleSheets.length) return;
      const text = root.adoptedStyleSheets.map((s) => lookup(win, s)).join('\n');
      let href = shared.get(text);
      if (!href) {
        href = `${location.origin}/__styles/${shared.size + 1}.css`;
        shared.set(text, href);
      }
      const link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      (root === doc ? doc.head : root).append(link);
      root.adoptedStyleSheets = [];
    };
    sheets(doc);
    roots.forEach(sheets);
    // Documents of the demos' iframes.
    for (const frame of doc.querySelectorAll('iframe')) {
      const inner = frame.contentDocument;
      if (!inner) continue;
      frame.setAttribute('srcdoc', serialize(inner));
      frame.removeAttribute('loading');
    }
    // No script upgrades the elements here (their shadow roots are already
    // attached), so the "hidden until defined" rules must not apply.
    const keep = doc.createElement('style');
    keep.textContent = ':not(:defined) { visibility: visible !important; }';
    doc.head.append(keep);
    // Scripts would run again and fail offline; copy buttons do nothing without them.
    for (const el of doc.querySelectorAll('script, link[rel~="modulepreload"], link[rel~="prefetch"], .gb-copy, .gb-demo-toggle')) {
      el.remove();
    }
    for (const link of doc.querySelectorAll('link[rel~="stylesheet"], link[rel~="icon"]')) {
      if (link.href && !link.href.startsWith('data:')) urls.add(link.href);
    }
    for (const img of doc.querySelectorAll('img[src]')) {
      if (img.src && !img.src.startsWith('data:')) urls.add(img.src);
    }
    return '<!DOCTYPE html>' + doc.documentElement.getHTML({shadowRoots: roots});
  }
  const html = serialize(document);
  return {html, urls: [...urls], styles: [...shared].map(([text, href]) => ({href, text}))};
}

/** Quoted-printable (RFC 2045) of a UTF-8 string, lines of at most 76 characters. */
function quotedPrintable(text) {
  const out = [];
  let line = '';
  const push = (chunk) => {
    if (line.length + chunk.length > 75) {
      out.push(line + '=');
      line = '';
    }
    line += chunk;
  };
  const bytes = Buffer.from(text.replace(/\r\n?/g, '\n'), 'utf8');
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b === 10) {
      // A space or tab at the end of a line must be encoded.
      if (line.endsWith(' ') || line.endsWith('\t')) {
        const last = line.at(-1);
        line = line.slice(0, -1);
        push(`=${last === ' ' ? '20' : '09'}`);
      }
      out.push(line);
      line = '';
    } else if (b === 61 || b > 126 || (b < 32 && b !== 9)) {
      push('=' + b.toString(16).toUpperCase().padStart(2, '0'));
    } else {
      push(String.fromCharCode(b));
    }
  }
  out.push(line);
  return out.join('\r\n');
}

const base64Lines = (buffer) => buffer.toString('base64').replace(/.{76}/g, '$&\r\n');

/** A MHTML file: the document first, then the resources it refers to. */
function mhtml({location, title, html, parts}) {
  const boundary = `----MultipartBoundary--MaterialWeb3--${createHash('sha1').update(html).digest('hex').slice(0, 24)}----`;
  const encodedTitle = /^[\x20-\x7e]*$/.test(title) ? title : `=?utf-8?B?${Buffer.from(title).toString('base64')}?=`;
  const lines = [
    'From: <Saved by Material Web docs>',
    `Snapshot-Content-Location: ${location}`,
    `Subject: ${encodedTitle}`,
    `Date: ${new Date().toUTCString().replace('GMT', '+0000')}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/related;\r\n\ttype="text/html";\r\n\tboundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="utf-8"',
    'Content-Transfer-Encoding: quoted-printable',
    `Content-Location: ${location}`,
    '',
    quotedPrintable(html),
  ];
  for (const part of parts) {
    const text = /^text\/|json|svg/.test(part.type);
    lines.push(
      '',
      `--${boundary}`,
      `Content-Type: ${part.type}`,
      `Content-Transfer-Encoding: ${text ? 'quoted-printable' : 'base64'}`,
      `Content-Location: ${part.url}`,
      '',
      text ? quotedPrintable(part.body.toString('utf8')) : base64Lines(part.body).replace(/\r\n$/, ''),
    );
  }
  lines.push('', `--${boundary}--`, '');
  return lines.join('\r\n');
}

/**
 * Browsers open MHTML with every form control disabled, so the components'
 * inner buttons and inputs would all match `:disabled` and look disabled.
 * Their real disabled state is the attribute, so the stylesheets test that.
 */
const enabled = (css) => css.replace(/:disabled\b/g, '[disabled]').replace(/:enabled\b/g, ':not([disabled])');

/** The resources of a stylesheet: its fonts, images and @imports. */
function cssUrls(css, base) {
  const found = new Set();
  for (const m of css.matchAll(/url\(\s*(['"]?)([^)'"]+)\1\s*\)|@import\s+(['"])([^'"]+)\3/g)) {
    const ref = (m[2] ?? m[4]).trim();
    if (!ref || ref.startsWith('data:') || ref.startsWith('#')) continue;
    try {
      found.add(new URL(ref, base).href);
    } catch {
      // Not a URL.
    }
  }
  return [...found];
}

/** Opens `url`, waits for the demos, and returns the page as a MHTML file (a string). */
async function captureMhtml(browser, url) {
  const context = await browser.newContext({viewport: {width: 1100, height: 900}, reducedMotion: 'reduce'});
  try {
    await context.addInitScript(RECORD_STYLES);
    const page = await context.newPage();
    await page.goto(url, {waitUntil: 'load', timeout: 60000});
    // Readers load the demo iframes as they scroll to them; load them all, a
    // few at a time (84 at once exhaust the browser), each batch settled first.
    await page.evaluate(async () => {
      const frames = [...document.querySelectorAll('iframe')];
      const ready = (f) => {
        const d = f.contentDocument;
        if (!d || d.readyState !== 'complete' || f.contentWindow.location.href === 'about:blank') return false;
        return ![...d.querySelectorAll('*')].some((el) => el.localName.startsWith('md-gb-') && !f.contentWindow.customElements.get(el.localName));
      };
      for (let i = 0; i < frames.length; i += 6) {
        const batch = frames.slice(i, i + 6);
        batch.forEach((f) => window.gbLoadDemo?.(f));
        const until = Date.now() + 30000;
        while (Date.now() < until && !batch.every(ready)) await new Promise((r) => setTimeout(r, 100));
      }
    });
    // Demos settle: every md-gb element (the page's and the iframes') defined
    // and rendered, fonts loaded, the network quiet.
    await page.waitForFunction(
      () => {
        const roots = [document, ...[...document.querySelectorAll('iframe')].map((f) => f.contentDocument)];
        if (roots.some((d) => !d || d.readyState !== 'complete' || d.defaultView.location.href === 'about:blank')) return false;
        return roots.every(
          (d) => ![...d.querySelectorAll('*')].some((el) => el.localName.startsWith('md-gb-') && !d.defaultView.customElements.get(el.localName)),
        );
      },
      null,
      {timeout: 90000, polling: 250},
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle', {timeout: 30000}).catch(() => {});
    // A few frames for the first render of the components.
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 500)))));

    const userAgent = await page.evaluate(() => navigator.userAgent);
    const {html, urls, styles} = await page.evaluate(serializeStatic);
    const title = await page.title();

    // Fetch what the document refers to (outside the page: no CORS), the
    // stylesheets' fonts and images too.
    const parts = new Map();
    for (const {href, text} of styles) {
      parts.set(href, {url: href, type: 'text/css', body: Buffer.from(enabled(text), 'utf8')});
    }
    // Two font links define the icon font: the page's (static, 0.4 MB) and a
    // demo's (variable, with the FILL axis, 5 MB). Keep the variable one.
    const subset = urls.some((u) => /Material\+Symbols\+Outlined:[^&]*FILL/.test(u));
    const queue = [...urls, ...styles.flatMap(({href, text}) => cssUrls(text, href))];
    while (queue.length) {
      const next = queue.splice(0, 8);
      await Promise.all(
        next.map(async (resource) => {
          if (parts.has(resource)) return;
          parts.set(resource, null);
          const response = await context.request.get(resource, {headers: {'user-agent': userAgent}}).catch(() => null);
          if (!response?.ok()) return;
          const type = (response.headers()['content-type'] ?? 'application/octet-stream').split(';')[0].trim();
          let body = await response.body();
          if (type === 'text/css') {
            let css = enabled(body.toString('utf8'));
            body = Buffer.from(css, 'utf8');
            if (subset && /fonts\.googleapis\.com/.test(resource) && !/FILL/.test(resource)) {
              css = css.replace(/@font-face\s*\{[^}]*Material Symbols Outlined[^}]*\}/g, '');
              body = Buffer.from(css, 'utf8');
            }
            queue.push(...cssUrls(css, resource));
          }
          parts.set(resource, {url: resource, type, body});
        }),
      );
    }
    return mhtml({location: url, title, html, parts: [...parts.values()].filter(Boolean)});
  } finally {
    await context.close();
  }
}

/**
 * Makes /3.0/material-web-3.0.mhtml: Chromium opens /3.0/all/ of the running
 * site (`baseUrl`) and saves it as one MHTML file, which goes to the cache
 * (keyed by a hash of the page and the shell) and into the site. Skipped when
 * the cache has it. Slow (many seconds), so callers run it off the critical
 * path, after the pages are served.
 */
export async function buildSnapshot({baseUrl, siteDir = SITE_DIR, log} = {}) {
  if (await restoreSnapshot({siteDir})) return 'cached';
  const hash = await snapshotHash(siteDir);
  if (!hash) return 'no-page';
  const browser = await launch();
  if (!browser) return 'no-playwright';
  const t = Date.now();
  let data;
  try {
    data = await captureMhtml(browser, `${baseUrl.replace(/\/$/, '')}/3.0/all/`);
  } finally {
    await browser.close();
  }
  // The site changed while capturing: this snapshot is already stale.
  if ((await snapshotHash(siteDir)) !== hash) return 'stale';
  await mkdir(SNAPSHOT_CACHE, {recursive: true});
  await writeFile(join(SNAPSHOT_CACHE, `${hash}.mhtml`), data);
  for (const f of await readdir(SNAPSHOT_CACHE)) if (f !== `${hash}.mhtml`) await rm(join(SNAPSHOT_CACHE, f), {force: true});
  await copyFile(join(SNAPSHOT_CACHE, `${hash}.mhtml`), join(siteDir, '3.0', SNAPSHOT_NAME));
  log?.(`${SNAPSHOT_NAME}: ${(data.length / 1048576).toFixed(1)} MB (${((Date.now() - t) / 1000).toFixed(1)}s)`);
  return 'built';
}

/** Builds the Open Graph images, the manifest icons, custom-elements.json and the skill files. */
export async function buildSiteAssets({log} = {}) {
  const {baselineColors} = require(join(CATALOG, 'eleventy-helpers', 'gb-site.cjs'));
  const c = baselineColors().light;
  await mkdir(OUT, {recursive: true});
  await copySkill();
  await buildApiManifest(log);
  let browser = null;
  try {
    // Launch lazily: nothing to render on a rebuild without changes.
    const list = await pages();
    const logoCss = existsSync(FAVICON);
    const needed = logoCss && (!(await cachedAll(list, c)) || !iconsFresh());
    if (needed) browser = await launch();
    await buildOgImages(browser, c, log);
    await buildIcons(browser, c, log);
  } finally {
    await browser?.close();
  }
}

function iconsFresh() {
  const stamp = statSync(FAVICON).mtimeMs;
  return ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png'].every((f) => {
    const p = join(OUT, 'icons', f);
    return existsSync(p) && statSync(p).mtimeMs >= stamp;
  });
}

async function cachedAll(list, c) {
  const logo = `data:image/svg+xml;base64,${(await readFile(FAVICON)).toString('base64')}`;
  const font = await fontUrl();
  return list.every((p) => {
    const hash = createHash('sha1').update(`${TEMPLATE_VERSION}\n${ogDocument(p, c, font, logo)}`).digest('hex').slice(0, 16);
    return existsSync(join(OUT, 'og-cache', `${hash}.png`));
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const at = process.argv.indexOf('--snapshot');
  if (at > 0) {
    // node scripts/gb-site-assets.mjs --snapshot http://localhost:8000
    console.log(await buildSnapshot({baseUrl: process.argv[at + 1], log: console.log}));
  } else {
    await buildSiteAssets({log: console.log});
  }
}
