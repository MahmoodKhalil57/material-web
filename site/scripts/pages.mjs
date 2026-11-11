#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Publishes the docs site (/3.0/; / redirects to it) as a static site on a
 * GitHub Pages branch, built here, with no Actions:
 *
 *   node site/scripts/pages.mjs [--base /material-web/] [--src site/_dev]
 *     [--branch gh-pages] [--remote origin] [--push]
 *
 * 1. Copies the built site (`npm run catalog:dev` writes site/_dev; its
 *    build must be ready) to a work directory.
 * 2. Bundles labs/gb into lib/ (esbuild: every module, at its path, so the
 *    pages' and demos' imports resolve as they do against the dev library
 *    server; CSS module scripts become constructed stylesheets, for every
 *    browser), and copies the labs/gb stylesheets.
 * 3. Rewrites the site for its base path on Pages (--base): root-relative
 *    links, the 3.0 shell's script strings and JSON urls get the prefix,
 *    and the dev library server (http://localhost:8001/) becomes <base>lib/.
 *    Each page gets modulepreload links for the whole
 *    module graph of the components it imports.
 * 4. Commits the result to --branch (an orphan branch, in a worktree under
 *    the system temp directory, replaced wholesale) with .nojekyll, and with
 *    --push pushes it to --remote. GitHub Pages serves that branch's root.
 */

import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {cp, mkdir, readdir, readFile, rm, stat, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, extname, join, relative} from 'node:path';
import {parseArgs} from 'node:util';
import * as esbuild from 'esbuild';

const {values: args} = parseArgs({
  options: {
    base: {type: 'string', default: '/material-web/'},
    src: {type: 'string', default: 'site/_dev'},
    branch: {type: 'string', default: 'gh-pages'},
    remote: {type: 'string', default: 'origin'},
    push: {type: 'boolean', default: false},
  },
});

const ROOT = process.cwd();
const BASE = args.base.endsWith('/') ? args.base : `${args.base}/`;
const DEV_LIB = 'http://localhost:8001/';
const OUT = join(tmpdir(), 'catalog-pages-site');
const TREE = join(tmpdir(), 'catalog-pages-branch');

const log = (...m) => console.log('[catalog-pages]', ...m);
const git = (argv, cwd = ROOT) => execFileSync('git', argv, {cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit']}).trim();

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

// --- 1. The built site --------------------------------------------------------

if (!existsSync(join(args.src, '3.0', 'index.html'))) {
  console.error(`${args.src} has no built site; run npm run catalog:dev and wait for its build.`);
  process.exit(1);
}
log(`copying ${args.src}`);
await rm(OUT, {recursive: true, force: true});
await cp(args.src, OUT, {recursive: true});

// --- 2. labs/gb as static modules -------------------------------------------------

log('bundling labs/gb into lib/');
const sources = [
  ...(await walk(join(ROOT, 'material-design-expressive', 'components')))
    .concat(await walk(join(ROOT, 'material-design-expressive', 'extras')))
    .concat(await walk(join(ROOT, 'material-design-expressive', 'styles')))
    .filter(
    (f) => f.endsWith('.js') && !/(_test|\.stories|[\\/]demo[\\/]|[\\/]skill[\\/])/.test(f) && !f.includes('node_modules'),
  ),
  // The ARIA elements the pages use beside labs/gb (md-aria-tabpanel).
  ...(await walk(join(ROOT, 'material-design-expressive', 'foundations', 'accessibility', 'aria'))).filter((f) => /[\\/]md-aria-[a-z0-9-]+\.js$/.test(f) && !f.includes('_test')),
];
const cssAsStylesheet = {
  name: 'css-modules-as-stylesheets',
  setup(build) {
    build.onResolve({filter: /\.css$/}, (a) =>
      a.with?.type === 'css' ? {path: join(a.resolveDir, a.path), namespace: 'css-module'} : undefined,
    );
    build.onLoad({filter: /.*/, namespace: 'css-module'}, async (a) => ({
      contents: `const sheet = new CSSStyleSheet();\nsheet.replaceSync(${JSON.stringify(await readFile(a.path, 'utf8'))});\nexport default sheet;\n`,
      loader: 'js',
    }));
  },
};
const {metafile} = await esbuild.build({
  metafile: true,
  entryPoints: sources,
  outbase: ROOT,
  outdir: join(OUT, 'lib'),
  bundle: true,
  splitting: true,
  format: 'esm',
  minify: true,
  target: 'es2022',
  chunkNames: 'chunks/[name]-[hash]',
  plugins: [cssAsStylesheet],
  logLevel: 'warning',
});
for (const f of (await walk(join(ROOT, 'material-design-expressive', 'components'))).concat(await walk(join(ROOT, 'material-design-expressive', 'styles'))).filter((f) => f.endsWith('.css') && !f.includes('node_modules'))) {
  const to = join(OUT, 'lib', relative(ROOT, f));
  await mkdir(dirname(to), {recursive: true});
  await cp(f, to);
}
log(`${sources.length} modules`);

// Each output's static imports (esbuild's metafile), by URL under lib/: a
// page lists the whole graph of the components it imports as modulepreload
// links, so the browser fetches every chunk at once instead of discovering
// them one level of imports at a time.
const libUrl = (out) => `${BASE}lib/${relative(join(OUT, 'lib'), join(ROOT, out)).replaceAll('\\', '/')}`;
const staticImports = new Map();
for (const [out, info] of Object.entries(metafile.outputs)) {
  if (!out.endsWith('.js')) continue;
  staticImports.set(
    libUrl(out),
    info.imports.filter((i) => i.kind === 'import-statement' && !i.external).map((i) => libUrl(i.path)),
  );
}
function moduleGraph(entries) {
  const seen = new Set();
  const visit = (url) => {
    if (seen.has(url) || !staticImports.has(url)) return;
    seen.add(url);
    for (const dep of staticImports.get(url)) visit(dep);
  };
  entries.forEach(visit);
  return [...seen];
}

// --- 3. The base path -------------------------------------------------------------------

log(`rewriting for ${BASE}`);
const top = (await readdir(OUT)).filter((n) => n !== 'lib').map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
// A root-relative URL at the start of an attribute, a string or url(): one
// of the site's top-level files or folders, or the root itself.
const rooted = new RegExp(`(["'\`(=]|&quot;|&#39;)/((?:${top.join('|')})(?=[/"'\`?#)&\\s]|$))`, 'g');
const TEXT = new Set(['.html', '.js', '.mjs', '.css', '.json', '.webmanifest', '.xml', '.txt', '.md', '.svg']);
let files = 0;
let preloaded = 0;
for (const file of await walk(OUT)) {
  if (!TEXT.has(extname(file)) || file.startsWith(join(OUT, 'lib'))) continue;
  let text = await readFile(file, 'utf8');
  const before = text;
  text = text
    .replaceAll(DEV_LIB, `${BASE}lib/`)
    .replace(rooted, `$1${BASE}$2`)
    // Links to the root itself (it redirects to /3.0/).
    .replace(/(href=|href=\\?&quot;|assign\()(["'])\/\2/g, `$1$2${BASE}$2`)
    .replace(/href="\/"/g, `href="${BASE}"`);
  if (file.endsWith('.html')) {
    const libPrefix = `${BASE}lib/`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const entries = [...text.matchAll(new RegExp(`import\\('(${libPrefix}[^']+\\.js)'\\)`, 'g'))].map((m) => m[1]);
    const graph = moduleGraph(entries);
    if (graph.length && text.includes('</head>')) {
      const links = graph.map((url) => `<link rel="modulepreload" href="${url}">`).join('');
      text = text.replace('</head>', `${links}</head>`);
      preloaded++;
    }
  }
  if (text !== before) {
    await writeFile(file, text);
    files++;
  }
}
await writeFile(join(OUT, '.nojekyll'), '');
log(`${files} files rewritten, ${preloaded} pages with modulepreload links`);

// --- 4. The branch --------------------------------------------------------------------

const exists = git(['ls-remote', '--heads', args.remote, args.branch]) !== '';
await rm(TREE, {recursive: true, force: true});
git(['worktree', 'prune']);
let local = true;
try {
  git(['rev-parse', '--verify', '--quiet', `refs/heads/${args.branch}`]);
} catch {
  local = false;
}
if (exists) {
  git(['fetch', '-q', args.remote, args.branch]);
  git(['worktree', 'add', '-q', '-B', args.branch, TREE, `${args.remote}/${args.branch}`]);
} else if (local) {
  // Built before, never pushed.
  git(['worktree', 'add', '-q', TREE, args.branch]);
} else {
  git(['worktree', 'add', '-q', '--orphan', '-b', args.branch, TREE]);
}
for (const entry of await readdir(TREE)) {
  if (entry !== '.git') await rm(join(TREE, entry), {recursive: true, force: true});
}
await cp(OUT, TREE, {recursive: true});
git(['add', '-A'], TREE);
const source = git(['rev-parse', '--short', 'HEAD']);
const changed = git(['status', '--porcelain'], TREE) !== '';
if (changed) {
  await writeFile(join(tmpdir(), 'catalog-pages-message.txt'), `site: build of ${source} for ${BASE}\n`);
  git(['commit', '-q', '-F', join(tmpdir(), 'catalog-pages-message.txt')], TREE);
  log(`committed to ${args.branch}`);
} else {
  log('no changes');
}
if (args.push) {
  git(['push', '-q', args.remote, `${args.branch}:${args.branch}`], TREE);
  log(`pushed ${args.branch} to ${args.remote}`);
}
const size = (await Promise.all((await walk(OUT)).map((f) => stat(f).then((s) => s.size)))).reduce((a, b) => a + b, 0);
log(`${(size / 1048576).toFixed(1)} MB; preview: ${OUT}`);
git(['worktree', 'remove', '--force', TREE]);
