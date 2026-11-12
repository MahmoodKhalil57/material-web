#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Runs the material-web.dev catalog locally against the local build, with the
 * M3 Expressive `labs/gb` components documented under /3.0/ (docs/3.0).
 * Works on Windows, macOS and Linux.
 *
 *   npm run catalog:dev                    # build everything, serve, open
 *   npm run catalog:dev -- --skip-build    # reuse the last library build
 *   npm run catalog:dev -- --no-watch      # don't rebuild pages on edits
 *   node site/scripts/wait.mjs          # wait for the next (re)build
 *
 * A run stops the previous one (pid in site/.catalog-dev.json), then keeps
 * watching docs (including docs/3.0), site/src, site/content/_includes and
 * labs/gb demos, rebuilding the pages in place (~15s) without restarting.
 *   npm run catalog:dev -- --port 8000 --lib-port 8001 --no-open
 *
 * The demos load the library from a second local server that serves this
 * repo, so every demo runs the code in your working tree.
 */

import * as fsSync from 'node:fs';
import {existsSync} from 'node:fs';
import {cp, mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildLibrary, nodeScript, npx, ROOT} from '../../scripts/build-local.mjs';
import {elementDir, elementNames} from '../../scripts/element-dirs.mjs';
import {buildSiteAssets, buildSnapshot, restoreSnapshot} from './assets.mjs';

const CATALOG = join(ROOT, 'site');
const gbDir = (dir) => elementDir(dir, ROOT);
const OUT = join(CATALOG, '_dev');
const EXAMPLES = join(CATALOG, '_dev-gb');

// The stand-in for the catalog story framework (demo-shim.mjs).
const SHIM = await readFile(join(import.meta.dirname, 'demo-shim.mjs'), 'utf8');

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const PORT = Number(arg('port', 8000));
/** The window the framed demos are measured in: the one site/scripts/walk.mjs pages through. */
const FRAME_WINDOW = {width: 1300, height: 900};
// State of refreshSnapshot() (declared up here: main() runs before the rest of the module).
let snapshotRunning = false;
let snapshotAgain = false;
const LIB_PORT = Number(arg('lib-port', 8001));
const LIB = `http://localhost:${LIB_PORT}/`;
// The library folders, served from material-design-expressive/ at the library server's root.
const LIB_FOLDERS = /^\/(foundations|styles|components|extras|internal|skill|testing|all(_test)?\.(js|ts|d\.ts))(\/|$)/;
// Each step prints the time since the previous one, to see where a run spends it.
const started = Date.now();
let lastStep = started;
/** Finished builds, for site/scripts/wait.mjs. */
let builds = 0;
const log = (s) => {
  const now = Date.now();
  console.log(`
[catalog:dev] (+${((now - lastStep) / 1000).toFixed(1)}s) ${s}`);
  lastStep = now;
};
// MWC_GB_LIB is the library server the /3.0/ demos (gbexample) load from.
const DEV_ENV = {NODE_ENV: 'DEV', MWC_GB_LIB: LIB};

/** Runs the dev catalog (not when this file is imported for its helpers). */
async function main() {
  // One instance at a time: a run stops the previous one (its servers would
  // hold the ports) and records its state for `site/scripts/wait.mjs`.
  await stopPreviousInstance();
  await writeState({status: 'building'});

  if (!argv.includes('--skip-build')) await buildLibrary({log});

  await startLibraryServer();
  const {pages, demos} = await buildSite({first: true});
  await startCatalogServer();
  await fitFrames();
  await writeState({status: 'ready'});
  refreshSnapshot();
  const watching = !argv.includes('--no-watch');
  if (watching) watchSources();
  log(
    `Catalog: http://localhost:${PORT}/3.0/  (${pages} pages, demos for ${demos} components)
` +
      `[catalog:dev] Library: ${LIB} (serves this repo for the demos)\n` +
      (watching
        ? `[catalog:dev] Watching docs, docs/3.0, catalog sources and gb demos: edits rebuild the pages in place.\n` +
          `[catalog:dev] Wait for a rebuild with: node site/scripts/wait.mjs\n`
        : '') +
      `[catalog:dev] Library source changes need \`npm run catalog:dev\` again (or gb-check --emit), since the demos load compiled .js.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();

// ---------------------------------------------------------------------------

/**
 * Builds the site pages: "/3.0/" (docs/3.0
 * as Markdown with the labs/gb demos), the catalog scripts and Eleventy. Run
 * once at start and again by the watcher; the servers keep running.
 */
async function buildSite({first = false} = {}) {
  // Generated pages (gitignored) of earlier runs, including the old 3.0 overlay.
  for (const dir of ['3.0']) {
    await rm(join(CATALOG, 'content', dir), {recursive: true, force: true});
  }

  log('Preparing the labs/gb demos');
  const gbDirs = await gbDemoDirs();
  await prepareExamples(gbDirs);
  const examples = await captureExamples(gbDirs);
  await writeFile(
    join(EXAMPLES, 'examples.json'),
    JSON.stringify(
      Object.fromEntries(
        [...examples].map(([dir, stories]) => [dir, stories.map((s) => ({...s, slug: slugify(s.name)}))]),
      ),
    ),
  );
  const pages = await copyGbDocs();

  // Open Graph images and manifest icons (cached; Eleventy copies them).
  log('Rendering Open Graph images and icons');
  await buildSiteAssets({log: console.log});

  log('Bundling catalog scripts');
  nodeScript(['esbuild.config.mjs'], {cwd: CATALOG, env: DEV_ENV});

  log('Building pages (Eleventy)');
  // A rebuild writes over the served output instead of deleting it first, so
  // the running server never answers 404 mid-build.
  if (first) await rm(OUT, {recursive: true, force: true});
  npx(['eleventy'], {cwd: CATALOG, env: DEV_ENV});

  // The single-file download of the docs, when its inputs are unchanged (a
  // copy; the Chromium run for a changed one starts after the build is ready).
  await restoreSnapshot({siteDir: OUT});
  return {pages, demos: examples.size};
}

/**
 * Makes /3.0/material-web-3.0.mhtml (Chromium opens /3.0/all/ of the served
 * site: seconds) after a build is ready, so it is never on the critical path.
 * A build that changes the page while it runs queues one more run; the file
 * of the previous build stays served meanwhile.
 */
function refreshSnapshot() {
  if (snapshotRunning) {
    snapshotAgain = true;
    return;
  }
  snapshotRunning = true;
  buildSnapshot({baseUrl: `http://localhost:${PORT}`, siteDir: OUT, log})
    .catch((e) => console.warn(`[catalog:dev] single-file download not built: ${e?.message ?? e}`))
    .finally(() => {
      snapshotRunning = false;
      if (snapshotAgain) {
        snapshotAgain = false;
        refreshSnapshot();
      }
    });
}

/** Story name -> the id used by {% gbexample "<dir>/<story>" %}. */
function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Copies docs/3.0 (plain Markdown) into site/content/3.0, with the directory
 * data that gives every page the gb layout, the gb3 tag and its permalink
 * /3.0/<section>/<slug>/, and /3.0/ itself (the intro page).
 */
async function copyGbDocs() {
  const dest = join(CATALOG, 'content', '3.0');
  // The READMEs aren't pages: docs/README.md is the page template for
  // authors, a section's README its index page's text (eleventy/site.cjs).
  await cp(join(ROOT, 'docs'), dest, {recursive: true, filter: (src) => !src.endsWith('README.md')});
  await writeFile(
    join(dest, '3.0.json'),
    JSON.stringify(
      {
        // The spec shell: every UI element a json-render spec of the
        // library's catalog.
        layout: 'spec.html',
        tags: ['gb3'],
        permalink: '/3.0/{{ section }}/{{ page.fileSlug }}/',
      },
      null,
      2,
    ) + '\n',
  );
  // /3.0/ is docs/index.md (the home page), else the intro page.
  if (!existsSync(join(ROOT, 'docs', 'index.md'))) {
    const intro = await readFile(join(dest, 'about', 'intro.md'), 'utf8');
    await writeFile(
      join(dest, 'index.md'),
      intro.replace(/^---\n/, '---\npermalink: /3.0/\neleventyExcludeFromCollections: true\n'),
    );
  }
  return (await walk(join(ROOT, 'docs'))).filter((f) => f.endsWith('.md') && !f.endsWith('README.md')).length;
}

/** catalog-dev's state for other tools: pid, status, builds, time. */
function stateFile() {
  return join(CATALOG, '.catalog-dev.json');
}

async function writeState(fields) {
  if (fields.status === 'ready') builds++;
  await writeFile(
    stateFile(),
    JSON.stringify({pid: process.pid, port: PORT, libPort: LIB_PORT, builds, at: Date.now(), ...fields}, null, 2),
  );
}

/**
 * Stops the catalog-dev run recorded in the state file (its servers hold the
 * ports) and waits until the ports are free.
 */
async function stopPreviousInstance() {
  let previous;
  try {
    previous = JSON.parse(await readFile(stateFile(), 'utf8'));
  } catch {
    return;
  }
  if (!previous.pid || previous.pid === process.pid) return;
  try {
    process.kill(previous.pid);
    log(`Stopped the previous catalog:dev run (pid ${previous.pid})`);
  } catch {
    // Already gone.
  }
  const {createServer} = await import('node:net');
  const free = (port) =>
    new Promise((resolve) => {
      const server = createServer()
        .once('error', () => resolve(false))
        .once('listening', () => server.close(() => resolve(true)))
        .listen(port);
    });
  for (let i = 0; i < 50; i++) {
    if ((await free(PORT)) && (await free(LIB_PORT))) return;
    await new Promise((r) => setTimeout(r, 200));
  }
}

/**
 * Rebuilds the pages when docs (including docs/3.0), catalog sources or gb demos change
 * (debounced; a change during a build queues one more build).
 */
function watchSources() {
  const {watch} = /** @type {typeof import('node:fs')} */ (fsSync);
  const roots = [
    join(ROOT, 'docs'),
    join(CATALOG, 'client'),
    join(CATALOG, 'content', '_includes'),
    join(CATALOG, 'content', 'index.html'),
    // The specs, shortcodes and the Eleventy config (each build runs a fresh
    // Eleventy process, so a rebuild picks up their changes).
    join(CATALOG, 'specs'),
    join(CATALOG, 'eleventy'),
    join(CATALOG, 'eleventy.config.cjs'),
    // Site data and the generated-file templates (search index, llms.txt,
    // sitemap, Markdown pages...). Not all of site/site: builds write into it.
    join(CATALOG, 'content', '_data'),
    ...fsSync
      .readdirSync(join(CATALOG, 'content'))
      .filter((n) => n.endsWith('.11ty.cjs'))
      .map((n) => join(CATALOG, 'content', n)),
    join(ROOT),
  ];
  let timer;
  let building = false;
  let again = false;
  // When the current (or last) build started: files not modified since were
  // only read by it (Windows reports reads of watched folders as changes).
  let buildStarted = Date.now();
  // A source file changed (not a folder, not a file only read by the build);
  // under labs/gb only demos affect the pages.
  const relevant = (root, name) => {
    if (!name || !/\.(md|html|njk|ts|js|mjs|cjs|json|scss|css)$/.test(name)) return false;
    // Under labs/gb: demos, and compiled .js (gb-check --emit), which the
    // /3.0/ shell bundle (site/src/gb) includes; else the shell keeps the
    // old components and, defined first, wins over the library server's.
    if (
      root === join(ROOT) &&
      !/[\\/]demo[\\/]/.test(name) &&
      !(/\.js$/.test(name) && !/_test\.js$/.test(name))
    ) {
      return false;
    }
    try {
      // A watched file (index.html, eleventy.config.cjs) is its own path.
      const path = /\.(html|cjs)$/.test(root) ? root : join(root, name);
      return fsSync.statSync(path).mtimeMs > buildStarted;
    } catch {
      return true; // Deleted: rebuild.
    }
  };
  const rebuild = async () => {
    if (building) {
      again = true;
      return;
    }
    building = true;
    buildStarted = Date.now();
    try {
      await writeState({status: 'building'});
      const t = Date.now();
      await buildSite();
      await fitFrames();
      // A change during the build queues another one: stay "building" so
      // site/scripts/wait.mjs doesn't report the stale pages as ready.
      await writeState({status: again ? 'building' : 'ready'});
      if (!again) refreshSnapshot();
      log(`Rebuilt in ${((Date.now() - t) / 1000).toFixed(1)}s`);
    } catch (e) {
      console.error(e);
      await writeState({status: 'error', error: String(e?.message ?? e)});
    } finally {
      building = false;
      if (again) {
        again = false;
        rebuild();
      }
    }
  };
  for (const root of roots) {
    if (!existsSync(root)) continue;
    watch(root, {recursive: true}, (_, name) => {
      if (!relevant(root, name)) return;
      clearTimeout(timer);
      // Tell site/scripts/wait.mjs a rebuild is coming (before the debounce).
      if (!building) writeState({status: 'pending'});
      if (process.env.CATALOG_DEV_DEBUG) console.log(`[catalog:dev] change: ${join(root, name ?? "")}`);
      timer = setTimeout(rebuild, 300);
    });
  }
}

/**
 * Foundations and styles with a demo, shown as their own pages: page key ->
 * folder under material-design-expressive.
 */
function styleDemos() {
  return {
    'focus': 'foundations/interaction/states/focus',
    'ripple': 'foundations/interaction/states/ripple',
    'style-color': 'styles/color',
    'style-icon': 'styles/icons',
    'style-layout': 'foundations/layout',
    'style-transitions': 'styles/motion/transitions',
  };
}

/** Source folder of a component (or style) key. */
function srcDir(dir) {
  const styles = styleDemos();
  return dir in styles ? join(ROOT, 'material-design-expressive', styles[dir]) : gbDir(dir);
}

/** labs/gb components (and styles) that have a demo. */
async function gbDemoDirs() {
  const dirs = [];
  for (const dir of [...new Set([...elementNames(ROOT), ...Object.keys(styleDemos())])].sort()) {
    if (existsSync(join(srcDir(dir), 'demo', 'demo.ts'))) dirs.push(dir);
  }
  return dirs;
}

/**
 * Transpiles each component's demo (demo.ts + stories.ts) into
 * site/_dev-gb/<dir>/ with a stand-in for the catalog story framework that
 * renders each story into the docs page (or, in capture mode, records its
 * HTML). Served by the library server so bare imports resolve.
 */
async function prepareExamples(dirs) {
  const esbuild = await import('esbuild');
  // Keep the generated images (site/scripts/assets.mjs): they are cached.
  const keep = new Set(['og', 'og-cache', 'icons']);
  for (const entry of existsSync(EXAMPLES) ? await readdir(EXAMPLES) : []) {
    if (!keep.has(entry)) await rm(join(EXAMPLES, entry), {recursive: true, force: true});
  }
  const tsconfigRaw = {compilerOptions: {experimentalDecorators: true, useDefineForClassFields: false}};
  for (const dir of dirs) {
    const demo = join(srcDir(dir), 'demo');
    for (const f of await readdir(demo)) {
      if (!f.endsWith('.ts')) continue;
      const source = (await readFile(join(demo, f), 'utf8')).replace(
        /(['"])([^'"]+)\.css\1\s+with\s*\{\s*type:\s*['"]css['"]\s*\}/g,
        '$1$2.cssresult.js$1',
      );
      const {code} = await esbuild.transform(source, {loader: 'ts', format: 'esm', target: 'esnext', tsconfigRaw});
      await mkdir(join(EXAMPLES, dir), {recursive: true});
      await writeFile(
        join(EXAMPLES, dir, f.replace(/\.ts$/, '.js')),
        code
          .replace(/(['"])@material\/web\//g, '$1/')
          .replace(/(['"])\.\/(material-collection|index)\.js\1/g, '$1./_shim.js$1'),
      );
      // The shim knows which component's stories it renders (hosts carry data-gb-dir).
      await writeFile(
        join(EXAMPLES, dir, '_shim.js'),
        `import {setUpDemo as set} from '../_shim.js';\nexport * from '../_shim.js';\n` +
          `export const setUpDemo = (collection) => set(collection, '${dir}');\n`,
      );
    }
  }
  await writeFile(join(EXAMPLES, '_shim.js'), SHIM);
  await writeFile(
    join(EXAMPLES, 'capture.html'),
    `<!doctype html><html data-gb-capture><head><meta charset="utf-8"></head><body>
<script type="module">
const dir = new URLSearchParams(location.search).get('dir');
import('./' + dir + '/demo.js').catch((e) => { window.__gbError = String(e); });
</script></body></html>\n`,
  );
}

/**
 * Measures the framed demos (md-gb-demo with a `srcdoc` document) of the
 * built pages whose height isn't known yet, and builds the pages again when
 * one is new: each frame then reserves its exact height
 * (site/eleventy/frame-heights.cjs), and the page doesn't move as it loads.
 * Heights are kept by the frame's document, so a build measures only new or
 * changed frames.
 */
async function fitFrames() {
  const {FILE, frameKey} = createRequire(import.meta.url)('../eleventy/frame-heights.cjs');
  const known = existsSync(FILE) ? JSON.parse(await readFile(FILE, 'utf8')) : {};
  const decode = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  // The pages with a frame whose height isn't known.
  const pages = [];
  for (const file of await walk(join(OUT, '3.0'))) {
    if (!file.endsWith('index.html')) continue;
    const html = await readFile(file, 'utf8');
    const frames = [...html.matchAll(/<md-gb-demo [^>]*?srcdoc="([^"]*)"/g)].map((m) => decode(m[1]));
    if (frames.some((srcdoc) => !(frameKey(srcdoc) in known))) {
      pages.push('/' + file.slice(OUT.length + 1).replace(/\\/g, '/').replace(/index\.html$/, ''));
    }
  }
  if (!pages.length) return;
  log(`Measuring the framed demos of ${pages.length} pages`);
  const {chromium} = await import('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({viewport: FRAME_WINDOW});
  // The heights the frames post (md-gb-demo-height), the latest by frame.
  await page.addInitScript(() => {
    window.__posted = new Map();
    addEventListener('message', (e) => {
      if (e.data?.type === 'md-gb-demo-height' && typeof e.data.height === 'number') window.__posted.set(e.source, Math.ceil(e.data.height));
    });
  });
  let measured = 0;
  for (const path of pages) {
    await page.goto(`http://localhost:${PORT}${path}`, {waitUntil: 'networkidle'});
    // Each frame loads when it nears the viewport (loading=lazy), then posts
    // its settled height, which md-gb-demo gives its frame.
    const heights = await page.evaluate(async () => {
      const demos = [...document.querySelectorAll('md-gb-demo[srcdoc]')];
      for (const demo of demos) {
        demo.scrollIntoView({block: 'center'});
        await new Promise((r) => setTimeout(r, 150));
      }
      const posted = (demo) => window.__posted.get(demo.shadowRoot?.querySelector('iframe')?.contentWindow);
      // Settled: every frame posted, and nothing changed for 300ms (or 4s).
      let last = '';
      let still = 0;
      for (let i = 0; i < 40 && still < 3; i++) {
        await new Promise((r) => setTimeout(r, 100));
        const now = demos.map(posted).join(',');
        still = demos.every((d) => posted(d) !== undefined) && now === last ? still + 1 : 0;
        last = now;
      }
      return demos.map((d) => [d.srcdoc, posted(d)]);
    });
    for (const [srcdoc, height] of heights) {
      if (!Number.isFinite(height)) continue;
      known[frameKey(srcdoc)] = height;
      measured++;
    }
  }
  await browser.close();
  await mkdir(EXAMPLES, {recursive: true});
  await writeFile(FILE, JSON.stringify(known, null, 2) + '\n');
  log(`Measured ${measured} frames; building the pages again with their heights`);
  npx(['eleventy'], {cwd: CATALOG, env: DEV_ENV});
}

/** Renders every story in headless Chromium and returns its HTML. */
async function captureExamples(dirs) {
  let chromium;
  try {
    ({chromium} = await import('playwright'));
  } catch {
    console.warn('playwright is not installed; /3.0/ pages get no demos.');
    return new Map();
  }
  const browser = await chromium.launch();
  const examples = new Map();
  for (const dir of dirs) {
    // A fresh page per component: one page for all of them runs out of
    // resources (net::ERR_INSUFFICIENT_RESOURCES).
    const page = await browser.newPage();
    try {
      await page.goto(`${LIB}site/_dev-gb/capture.html?dir=${dir}`);
      await page.waitForFunction(() => window.__gbCapture || window.__gbError, null, {timeout: 20000});
      const {stories, error} = await page.evaluate(() => ({stories: window.__gbCapture, error: window.__gbError}));
      if (error) throw new Error(error);
      // Heights at the phone content width, in a phone-sized window (demos
      // can depend on the window size): 400px window, 16px gutters.
      await page.setViewportSize({width: 400, height: 900});
      const narrow = await page.evaluate(async () => {
        const hosts = [...document.querySelectorAll('[data-gb-captured]')];
        for (const h of hosts) h.style.inlineSize = '368px';
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        return hosts.map((h) => Math.ceil(h.getBoundingClientRect().height));
      });
      stories.forEach((s, i) => (s.narrowHeight = narrow[i]));
      examples.set(dir, stories.map((s) => ({name: s.name, html: formatHtml(s.html), height: s.height, narrowHeight: s.narrowHeight})));
    } catch (err) {
      console.warn(`  ${dir}: could not capture examples (${err.message.split('\n')[0]})`);
    } finally {
      await page.close();
    }
  }
  await browser.close();
  console.log(`Captured examples for ${examples.size}/${dirs.length} components`);
  return examples;
}

/** Minimal HTML pretty-printer for captured story markup. */
function formatHtml(html) {
  const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;
  const tokens = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s(class|style)=""/g, '')
    // Boolean attributes as written: `selected`, not `selected=""`.
    .replace(/\s([a-z][\w:-]*)=""/g, ' $1')
    .match(/<[^>]+>|[^<]+/g) ?? [];
  const lines = [];
  let depth = 0;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const pad = '  '.repeat(depth);
    if (/^<\//.test(t)) {
      depth = Math.max(0, depth - 1);
      lines.push('  '.repeat(depth) + t);
    } else if (/^</.test(t)) {
      const tag = t.match(/^<([\w-]+)/)?.[1] ?? '';
      const text = tokens[i + 1];
      const close = tokens[i + 2];
      // <tag>text</tag> on one line.
      if (text && !/^</.test(text) && close === `</${tag}>`) {
        lines.push(pad + t + text.trim().replace(/\s+/g, ' ') + close);
        i += 2;
      } else if (tokens[i + 1] === `</${tag}>`) {
        lines.push(pad + t + tokens[i + 1]);
        i += 1;
      } else {
        lines.push(pad + t);
        if (!VOID.test(tag) && !t.endsWith('/>')) depth++;
      }
    } else if (t.trim()) {
      lines.push(pad + t.trim().replace(/\s+/g, ' '));
    }
  }
  return lines.join('\n');
}

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

/** The library: this repo, with bare imports resolved (the demos). */
async function startLibraryServer() {
  const {startDevServer} = await import('@web/dev-server');
  await startDevServer({
    config: {
      rootDir: ROOT,
      port: LIB_PORT,
      nodeResolve: true,
      middleware: [
        (ctx, next) => {
          ctx.set('Access-Control-Allow-Origin', '*');
          // The library's folders live under material-design-expressive/:
          // /components/x.js is served from material-design-expressive/components/x.js.
          if (LIB_FOLDERS.test(ctx.path)) ctx.path = '/material-design-expressive' + ctx.path;
          return next();
        },
      ],
    },
    readCliArgs: false,
    readFileConfig: false,
    logStartMessage: false,
  });
}

/** The catalog site. */
async function startCatalogServer() {
  const {startDevServer} = await import('@web/dev-server');
  await startDevServer({
    config: {
      rootDir: OUT,
      port: PORT,
      open: argv.includes('--no-open') ? false : '/',
      middleware: [
        // The Markdown pages of /3.0/ and the manifest, with their real types.
        async (ctx, next) => {
          await next();
          if (ctx.status !== 200) return;
          if (/\.md$/.test(ctx.path)) ctx.type = 'text/markdown; charset=utf-8';
          else if (/\.webmanifest$/.test(ctx.path)) ctx.type = 'application/manifest+json';
          // Content-hashed fonts (site/scripts/fonts.mjs): the browser keeps them without asking again, in dev too.
          if (/^\/fonts\/gb\/[^/]+\.woff2$/.test(ctx.path)) {
            ctx.set('Cache-Control', 'public, max-age=31536000, immutable');
          }
        },
      ],
    },
    readCliArgs: false,
    readFileConfig: false,
    logStartMessage: false,
  });
}
