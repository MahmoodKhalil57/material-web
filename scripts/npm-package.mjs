#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Builds the labs/gb components as an npm package on a branch, the way
 * catalog-pages.mjs builds the site on gh-pages, and publishes from it:
 *
 *   node scripts/npm-package.mjs [--name @mahmoodkhalil/material-web-3-demo]
 *     [--version 0.1.0] [--branch npm-package] [--remote origin] [--push]
 *     [--publish]
 *
 * 1. Follows the relative imports of all.js (the built .js, its
 *    .d.ts and source maps) and copies every module it reaches, at its path,
 *    so the package is the unbundled ES modules and their types. Run
 *    `npx tsc -p tsconfig.json` and `npx tsc -p tsconfig.json` first.
 * 2. Writes a package.json (lit and the other bare imports become
 *    dependencies), README.md and LICENSE.
 * 3. Commits the result to --branch (an orphan branch, in a worktree under
 *    the system temp directory, replaced wholesale); --push pushes it.
 * 4. --publish runs `npm publish --access public` from that branch's tree.
 */

import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {cp, mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, join, relative, resolve} from 'node:path';
import {parseArgs} from 'node:util';

const {values: args} = parseArgs({
  options: {
    name: {type: 'string', default: '@mahmoodkhalil/material-web-3-demo'},
    version: {type: 'string', default: '0.2.0'},
    branch: {type: 'string', default: 'npm-package'},
    remote: {type: 'string', default: 'origin'},
    push: {type: 'boolean', default: false},
    publish: {type: 'boolean', default: false},
  },
});

const ROOT = process.cwd();
const LIB = join(ROOT, 'material-design-expressive');
const ENTRY = 'all.js';
const TREE = join(tmpdir(), 'npm-package-branch');
const main = JSON.parse(await readFile('package.json', 'utf8'));

const log = (...m) => console.log('[npm-package]', ...m);
const git = (argv, cwd = ROOT) => execFileSync('git', argv, {cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit']}).trim();

// --- 1. The module closure -------------------------------------------------

const SPEC = /(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g;
const files = new Set();
const cssTargets = new Set();
const bare = new Set();

async function visit(path) {
  if (files.has(path)) return;
  if (!existsSync(join(LIB, path))) throw new Error(`Missing ${path}; build first.`);
  files.add(path);
  for (const extra of [`${path}.map`, path.replace(/\.js$/, '.d.ts')]) {
    if (existsSync(join(LIB, extra))) files.add(extra);
  }
  const sources = [path];
  const types = path.replace(/\.js$/, '.d.ts');
  if (types !== path && existsSync(join(LIB, types))) sources.push(types);
  for (const source of sources) {
    // Drop comments first: JSDoc examples mention imports that are not there.
    const text = (await readFile(join(LIB, source), 'utf8'))
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    for (const [, spec] of text.matchAll(SPEC)) {
      if (spec.startsWith('.')) {
        const target = relative(LIB, resolve(LIB, dirname(source), spec)).replaceAll('\\', '/');
        if (target.endsWith('.js')) await visit(target);
        else if (target.endsWith('.css')) cssTargets.add(target);
        else files.add(target);
      } else if (source.endsWith('.js')) {
        const parts = spec.split('/');
        bare.add(spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]);
      }
    }
  }
}
await visit(ENTRY);

// The standalone modules the docs tell people to import (dynamic color, the
// transitions, the checkbox group, the global stylesheets) are not all
// reached from all.js: publish every one the docs name, so a documented
// import always resolves.
const DOC_IMPORT = /['"]@material\/web\/([^'"]+)['"]/g;
for (const name of await readdir(join(ROOT, 'docs'), {recursive: true})) {
  if (!name.endsWith('.md')) continue;
  for (const [, path] of (await readFile(join(ROOT, 'docs', name), 'utf8')).matchAll(DOC_IMPORT)) {
    if (path.endsWith('.js')) await visit(path);
    else if (path.endsWith('.css')) cssTargets.add(path);
    else throw new Error(`docs/${name} imports ${path}, which is neither a module nor a stylesheet.`);
  }
}

// Test code never ships: the central suites' helpers live next to the code
// they test (foundations/, styles/) and in testing/.
const TEST_CODE =
  /(_test|_gap)\.(js|d\.ts|js\.map)$|^testing\/|\/(aria-helpers|aria-internals|aria-rows|axe-helpers|axe-internals|states-helpers|rtl-helpers|predictive-back-harness)\.(js|d\.ts|js\.map)$/;
const leaked = [...files].filter((f) => TEST_CODE.test(f));
if (leaked.length) throw new Error(`Test code reached the package: ${leaked.join(', ')}`);
log(`${files.size} files, bare imports: ${[...bare].sort().join(', ')}`);

// --- 2. The package ---------------------------------------------------------

const OUT = join(tmpdir(), 'npm-package-out');
await rm(OUT, {recursive: true, force: true});
for (const file of files) {
  if (!existsSync(join(LIB, file))) continue;
  await mkdir(dirname(join(OUT, file)), {recursive: true});
  await cp(join(LIB, file), join(OUT, file));
}

// The .css modules (`import ... with {type: 'css'}`) are compiled from their
// .scss siblings. build:sass does this in the repo, but its `$(ls ...)` shell
// substitution fails on Windows, so compile the ones needed here, into the
// package only.
const sass = await import('sass');
for (const css of cssTargets) {
  const scss = css.replace(/\.css$/, '.scss');
  if (!existsSync(join(LIB, scss))) throw new Error(`No ${scss} to compile ${css} from.`);
  // The same load paths as the build (internal/sass/ext forwards sass-true).
  const {css: text} = sass.compile(join(LIB, scss), {
    style: 'compressed',
    loadPaths: [join(ROOT, 'node_modules'), join(ROOT, 'node_modules', 'sass-true', 'sass')],
  });
  await mkdir(dirname(join(OUT, css)), {recursive: true});
  await writeFile(join(OUT, css), text);
  // `import sheet from './x.css' with {type: 'css'}` needs a browser or
  // bundler with CSS module scripts. The package ships a plain module instead
  // (the same constructed stylesheet catalog-pages.mjs makes for Pages).
  await writeFile(
    join(OUT, `${css}.js`),
    `const sheet = new CSSStyleSheet();\nsheet.replaceSync(${JSON.stringify(text)});\nexport default sheet;\n`,
  );
}
const CSS_IMPORT = /(from\s+)(['"])([^'"]+\.css)\2\s+with\s*\{\s*type:\s*['"]css['"]\s*\}/g;
for (const file of files) {
  if (!file.endsWith('.js')) continue;
  const path = join(OUT, file);
  const text = await readFile(path, 'utf8');
  const next = text.replace(CSS_IMPORT, (_, from, quote, spec) => `${from}${quote}${spec}.js${quote}`);
  if (next !== text) await writeFile(path, next);
}
log(`${cssTargets.size} stylesheets compiled from .scss, CSS imports rewritten as modules`);

const all = {...main.dependencies, ...main.peerDependencies};
const dependencies = {};
for (const name of [...bare].sort()) {
  if (!all[name]) throw new Error(`No version for ${name} in package.json`);
  dependencies[name] = all[name];
}

await writeFile(
  join(OUT, 'package.json'),
  JSON.stringify(
    {
      name: args.name,
      version: args.version,
      description: 'Demo build of the Material 3 Expressive (labs/gb) web components, from the 3.0 docs site on material-web.',
      type: 'module',
      main: ENTRY,
      module: ENTRY,
      types: ENTRY.replace(/\.js$/, '.d.ts'),
      // The public entry points follow the docs pillars. internal/ is
      // reachable only from the package's own modules.
      exports: {
        '.': {types: './all.d.ts', default: './all.js'},
        // The docs import the root by its file name too.
        './all.js': {types: './all.d.ts', default: './all.js'},
        './components/*': './components/*',
        './extras/*': './extras/*',
        './foundations/*': './foundations/*',
        './styles/*': './styles/*',
        './package.json': './package.json',
      },
      sideEffects: true,
      customElements: 'custom-elements.json',
      dependencies,
      license: 'Apache-2.0',
      repository: {type: 'git', url: 'git+https://github.com/MahmoodKhalil57/material-web.git'},
      homepage: 'https://mahmoodkhalil57.github.io/material-web/3.0/',
      keywords: ['material-design', 'm3', 'material-3-expressive', 'web-components', 'lit'],
    },
    null,
    2,
  ) + '\n',
);
await cp('LICENSE', join(OUT, 'LICENSE'));
// The public API: the Custom Elements Manifest (read by IDEs and tools through
// package.json `customElements`) and its readable form. Both are generated by
// scripts/api/gen-api.mjs and checked in, so fail if they are stale.
execFileSync(process.execPath, [join(ROOT, 'scripts', 'api', 'gen-api.mjs'), '--check'], {stdio: 'inherit'});
await cp(join(LIB, 'custom-elements.json'), join(OUT, 'custom-elements.json'));
await cp(join(LIB, 'API.md'), join(OUT, 'API.md'));
await writeFile(
  join(OUT, 'README.md'),
  `# ${args.name}

A demo build of the Material 3 Expressive web components (labs/gb) from
[material-web](https://github.com/material-components/material-web), as
published on the 3.0 docs site: https://mahmoodkhalil57.github.io/material-web/3.0/

This is an unofficial demo, not a Google release. The components are
unbundled ES modules built on Lit.

\`\`\`sh
npm install ${args.name}
\`\`\`

\`\`\`js
// Defines every md-gb-* element and adopts the M3 styles into the document.
import '${args.name}';
\`\`\`

\`\`\`html
<md-gb-button>Hello</md-gb-button>
\`\`\`

For production, import individual components from
\`${args.name}/components/<name>/<file>.js\` and adopt the styles
yourself. The library's own components with no page in the M3 components
index (select, the layout scaffolds, pull to refresh) are in
\`${args.name}/extras/<name>/<file>.js\`. The other entry points follow the
Material docs: \`${args.name}/foundations/...\` (layout, interaction, accessibility) and
\`${args.name}/styles/...\` (color, motion, icons and the global
stylesheets). \`internal/\` is not public API.

Built from material-web ${main.version} at commit ${git(['rev-parse', '--short', 'HEAD'])}.
`,
);

// The package's types as a user's project sees them (every public module,
// typed elements, internal/ blocked), before anything is committed.
execFileSync(process.execPath, [join(ROOT, 'scripts', 'api', 'check-package-types.mjs'), OUT], {stdio: 'inherit'});

// --- 3. The branch ---------------------------------------------------------

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
  git(['worktree', 'add', '-q', TREE, args.branch]);
} else {
  git(['worktree', 'add', '-q', '--orphan', '-b', args.branch, TREE]);
}
for (const entry of await readdir(TREE)) {
  if (entry !== '.git') await rm(join(TREE, entry), {recursive: true, force: true});
}
await cp(OUT, TREE, {recursive: true});
git(['add', '-A'], TREE);
if (git(['status', '--porcelain'], TREE) !== '') {
  await writeFile(join(tmpdir(), 'npm-package-message.txt'), `package: build of ${git(['rev-parse', '--short', 'HEAD'])} as ${args.version}\n`);
  git(['commit', '-q', '-F', join(tmpdir(), 'npm-package-message.txt')], TREE);
  log(`committed to ${args.branch}`);
} else {
  log('no changes');
}
if (args.push) {
  git(['push', '-q', args.remote, `${args.branch}:${args.branch}`], TREE);
  log(`pushed ${args.branch} to ${args.remote}`);
}
if (args.publish) {
  // npm never replaces a version, so fail before the one-time code prompt.
  let taken = '';
  try {
    taken = execFileSync('npm', ['view', `${args.name}@${args.version}`, 'version'], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], shell: true}).trim();
  } catch {
    // Not published yet: npm view exits non-zero for an unknown version.
  }
  if (taken) throw new Error(`${args.name}@${args.version} is already published; pass --version.`);
  execFileSync('npm', ['publish', '--access', 'public'], {cwd: TREE, stdio: 'inherit', shell: true});
  log(`published ${args.name}@${args.version}`);
}
git(['worktree', 'remove', '--force', TREE]);
log(`package directory: ${OUT}`);
