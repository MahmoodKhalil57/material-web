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
 */

import {createHash} from 'node:crypto';
import {existsSync, statSync} from 'node:fs';
import {copyFile, mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

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
  const {ogName, sectionLabel} = require(join(CATALOG, 'eleventy-helpers', 'gb-site.cjs'));
  const list = [];
  for (const section of SECTIONS) {
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

/** Builds the Open Graph images and the manifest icons. */
export async function buildSiteAssets({log} = {}) {
  const {baselineColors} = require(join(CATALOG, 'eleventy-helpers', 'gb-site.cjs'));
  const c = baselineColors().light;
  await mkdir(OUT, {recursive: true});
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
  await buildSiteAssets({log: console.log});
}
