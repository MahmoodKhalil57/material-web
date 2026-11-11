#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Fast build-and-test loop for labs/gb components (works on Windows, where
 * `npm run build` / `npm test` don't).
 *
 *   npm run gb:check -- slider            # one component
 *   npm run gb:check -- slider chip       # several
 *   npm run gb:check -- --styles slider   # also recompile styles
 *   npm run gb:check -- --all             # everything (end of a change set)
 *   npm run gb:check -- --no-test slider  # build only
 *   npm run gb:check -- --fast slider     # skip the type check while iterating
 *   npm run gb:check -- --lean slider     # quick check for agents (aim: 1-2 min): implies --fast
 *                                         # and runs only the test files that git reports changed,
 *                                         # or that import a changed file in the named directories
 *   npm run gb:check -- --emit slider     # also write tsc's .js output
 *   npm run gb:check -- --watch slider    # keep running; rerun affected tests on save
 *   npm run gb:check -- --size slider     # also check labs/gb Brotli size budgets (implies --emit)
 *                                         # and validate the compiled CSS with Lightning CSS
                                         # (Baseline widely-available targets) and run gb:baseline
 *   npm run gb:check -- --baseline slider # only the Baseline check (fails on unguarded, non-allowed CSS uses)
 *
 * Steps, each limited to what was asked for:
 *   1. Sass for the named directories (styles too with --styles/--all).
 *   2. .css -> .cssresult.ts for those directories.
 *   3. Type check (tsgo if installed, else tsc), no output.
 *   4. tsc output, only with --emit or --all (the catalog and `npm test` use
 *      the compiled .js; the tests here don't).
 *   5. web-test-runner on the named directories' `*_test.ts`, served from
 *      source by esbuild (web-test-runner.config.js).
 */

import {execFileSync} from 'node:child_process';
import {existsSync, readdirSync, readFileSync, statSync, watch as watchFs, writeFileSync} from 'node:fs';
import {dirname, join, relative} from 'node:path';
import {elementDirs} from './element-dirs.mjs';

const argv = process.argv.slice(2);
const all = argv.includes('--all');
const styles = all || argv.includes('--styles');
const test = !argv.includes('--no-test');
// Type checking takes a few seconds; skip it while iterating (`--fast`).
const watch = argv.includes('--watch');
// `--watch` skips it too: the editor type checks as you go.
// `--lean`: only the tests touched by changed files, no type check.
const lean = argv.includes('--lean');
const typecheck = !argv.includes('--fast') && !watch && !lean;
// Compiled .js is only needed by the catalog and by `npm test`'s file glob.
const baseline = argv.includes('--baseline');
const size = argv.includes('--size');
const emit = argv.includes('--emit') || all || size;
const dirs = argv.filter((a) => !a.startsWith('--'));

const GB = join('material-design-expressive');
if (!all && !dirs.length) {
  console.error('Name at least one components directory, or pass --all.');
  process.exit(2);
}
const targets = all
  ? [GB]
  : dirs.map((d) => {
      // A component name (`slider`, `scaffold`) is looked up in every
      // element root; anything else is a path.
      const named = elementDirs().find((e) => e.name === d);
      const dir = named ? named.dir : d;
      if (!existsSync(dir)) {
        console.error(`No such directory: ${d}`);
        process.exit(2);
      }
      return dir;
    });
// A target may be one test file (`components/x/x_test.ts`): only that
// file runs, and Sass compiles its folder.
const isFile = (p) => statSync(p).isFile();
const folderOf = (p) => (isFile(p) ? dirname(p) : p);
const sassTargets = [...new Set([...targets.map(folderOf), ...(styles && !all ? [join(GB, 'styles')] : [])])];

const started = Date.now();
const step = (name, fn) => {
  const t = Date.now();
  fn();
  console.log(`[gb:check] ${name} ${((Date.now() - t) / 1000).toFixed(1)}s`);
};
// Tools run straight from node_modules: `npx` spends 1-2s per call just
// resolving the binary, which used to be about half of a check.
const node = (script, args) => execFileSync(process.execPath, [script, ...args], {stdio: 'inherit'});
const BIN = {
  tsgo: join('node_modules', '@typescript', 'native-preview', 'bin', 'tsgo'),
  tsc: join('node_modules', 'typescript', 'bin', 'tsc'),
  wtr: join('node_modules', '@web', 'test-runner', 'dist', 'bin.js'),
};

// Sass in this process (same options as the CLI build: compressed, no
// source maps, both load paths); only changed .css files are rewritten.
const sass = await import('sass');
step('sass', () => {
  for (const scss of sassTargets.flatMap((d) => sassFiles(d))) {
    const css = sass.compile(scss, {
      style: 'compressed',
      loadPaths: ['node_modules', join('node_modules', 'sass-true', 'sass')],
      quietDeps: true,
      logger: sass.Logger.silent,
    }).css + '\n'; // The CLI ends files with a newline.
    const out = scss.replace(/\.scss$/, '.css');
    if (!existsSync(out) || readFileSync(out, 'utf8') !== css) writeFileSync(out, css);
  }
});

// Same output as scripts/css-to-ts.js --suffix=.cssresult, without starting a
// Node process per file (slow on Windows). Unchanged files are not rewritten.
step('cssresult', () => {
  for (const cssPath of sassTargets.flatMap((d) => cssFiles(d))) {
    const tsPath = cssPath.replace('.css', '.cssresult.ts');
    const css = readFileSync(cssPath, 'utf8')
      .replace(/\/\*#\ sourceMappingURL=[^\*]+ \*\//, '')
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${');
    const ts = `/**
 * @license
 * Copyright ${new Date().getFullYear()} Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// Generated stylesheet for ${cssPath}.
import {css} from 'lit';
export const styles = css\`${css}\`;
export default styles.styleSheet!;
`;
    if (!existsSync(tsPath) || readFileSync(tsPath, 'utf8') !== ts) writeFileSync(tsPath, ts);
  }
});

// Tests run the TypeScript sources directly (esbuild, see
// web-test-runner.config.js), so the type check only gates the result. tsgo
// (TypeScript's native compiler) when installed, else tsc.
if (typecheck) {
  step('typecheck', () => {
    node(existsSync(BIN.tsgo) ? BIN.tsgo : BIN.tsc, ['-p', 'tsconfig.json', '--noEmit']);
  });
}

if (emit) {
  step('emit', () => {
    node(BIN.tsc, ['-p', 'tsconfig.json', '--incremental', '--tsBuildInfoFile', join('.m3-specs', 'gb.tsbuildinfo')]);
  });
}

if (size) {
  // Budgets are for every component, whatever directories were named.
  step('css-validate', () => node(join('scripts', 'gb-css-validate.mjs'), []));
  step('baseline', () => node(join('scripts', 'gb-baseline.mjs'), []));
  step('size', () => {
    node(BIN.tsc, ['-p', join('scripts', 'tsconfig.json')]);
    node(join('scripts', 'size', 'gb-size.js'), ['--check']);
  });
}

if (baseline && !size) {
  step('baseline', () => node(join('scripts', 'gb-baseline.mjs'), []));
}

if (test) {
  step('test', () => {
    // `*_gap.ts`: red tests for spec features not built yet (`--gaps` runs
    // them instead). They count as tested only once moved into a `*_test.ts`.
    const pattern = argv.includes('--gaps') ? '*_gap.ts' : '*_test.ts';
    const globs = lean
      ? leanTests(pattern)
      : targets.map((d) =>
          isFile(d) ? relative('.', d).replace(/\\/g, '/') : `${relative('.', d).replace(/\\/g, '/')}/**/${pattern}`,
        );
    if (lean) {
      if (!globs.length) {
        console.log('[gb:check] --lean: no changed files with tests in the named directories');
        return;
      }
      console.log(`[gb:check] --lean: ${globs.length} test file(s): ${globs.join(' ')}`);
    }
    if (watch) {
      watchStyles();
      // The runner and its browser stay up; on save it reruns only the test
      // files that load the changed module.
      node(BIN.wtr, [...globs, '--watch']);
    } else {
      node(BIN.wtr, globs);
    }
  });
}

/**
 * `--watch`: recompiles a folder's Sass (and its .cssresult.ts) when one of its
 * .scss files changes; web-test-runner then reruns the tests that load it.
 */
function watchStyles() {
  const pending = new Set();
  let timer;
  for (const dir of sassTargets) {
    watchFs(dir, {recursive: true}, (_, name) => {
      if (!name?.endsWith('.scss')) return;
      pending.add(dir);
      clearTimeout(timer);
      timer = setTimeout(() => {
        const dirs = [...pending].map((d) => relative('.', d));
        pending.clear();
        try {
          execFileSync(process.execPath, [process.argv[1], '--no-test', '--fast', ...dirs], {stdio: 'inherit'});
        } catch {
          // Sass errors are already printed; keep watching.
        }
      }, 50);
    });
  }
}
console.log(`[gb:check] done in ${((Date.now() - started) / 1000).toFixed(1)}s`);

/**
 * `--lean`: test files under the targets that git reports as changed, every
 * test in the folder of a changed .scss, and tests that mention a changed
 * .ts file's name in its folder.
 */
function leanTests(pattern) {
  const changed = execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], {encoding: 'utf8'})
    .split('\n')
    .map((line) => line.slice(3).trim().replace(/^"|"$/g, '').replace(/^.* -> /, ''))
    .filter(Boolean);
  const roots = targets.map((d) => relative('.', d).replace(/\\/g, '/'));
  const inTargets = (p) => roots.some((r) => p === r || p.startsWith(`${r}/`));
  const suffix = pattern.slice(1); // `_test.ts` / `_gap.ts`
  const out = new Set();
  for (const path of changed.filter(inTargets)) {
    if (path.endsWith(suffix)) {
      if (existsSync(path)) out.add(path);
      continue;
    }
    if (!/\.(ts|scss)$/.test(path)) continue;
    const folder = dirname(path);
    const base = path.slice(folder.length + 1).replace(/\.(ts|scss)$/, '').replace(/^_/, '');
    if (!existsSync(folder)) continue;
    for (const name of readdirSync(folder)) {
      if (!name.endsWith(suffix)) continue;
      const file = `${folder}/${name}`;
      // Styles reach every test in their folder; scripts only their importers.
      if (path.endsWith('.scss') || readFileSync(file, 'utf8').includes(base)) out.add(file);
    }
  }
  return [...out];
}

/** Non-partial .scss files (what the Sass CLI compiles for `dir:dir`). */
function sassFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...sassFiles(path));
    else if (name.endsWith('.scss') && !name.startsWith('_')) out.push(path);
  }
  return out;
}

function cssFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'demo') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...cssFiles(path));
    else if (name.endsWith('.css')) out.push(path);
  }
  return out;
}
