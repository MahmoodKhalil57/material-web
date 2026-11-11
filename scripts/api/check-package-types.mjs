/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Type-checks the built npm package the way a user's project
 * sees it: every public module (custom-elements.json) imported by its package
 * path, typed elements from `document.createElement`, and internal/ blocked by
 * the exports map. Runs once with `moduleResolution: nodenext` and once with
 * `bundler`, both strict and with `skipLibCheck: false`, so the shipped .d.ts
 * files are checked too. Errors inside other packages' types are reported
 * but don't fail the check.
 *
 *   node scripts/api/check-package-types.mjs <package directory>
 *
 * scripts/npm-package.mjs runs it on every build.
 */

import {execFileSync} from 'node:child_process';
import {cpSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const pkgDir = process.argv[2];
if (!pkgDir) {
  console.error('Usage: node scripts/api/check-package-types.mjs <package directory>');
  process.exit(2);
}
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
const cem = JSON.parse(readFileSync(join(pkgDir, 'custom-elements.json'), 'utf8'));
// Inside the repo's node_modules, so `lit` and the other dependencies resolve.
const DIR = join(ROOT, 'node_modules', '.cache', 'package-types');
rmSync(DIR, {recursive: true, force: true});
cpSync(pkgDir, join(DIR, 'node_modules', ...pkg.name.split('/')), {recursive: true});
writeFileSync(join(DIR, 'package.json'), JSON.stringify({name: 'consumer', type: 'module', private: true}));

const name = pkg.name;
const tags = cem.modules.flatMap((m) => (m.exports ?? []).filter((e) => e.kind === 'custom-element-definition').map((e) => e.name));
const source = [
  `import '${name}';`,
  `import '${name}/all.js';`,
  ...cem.modules.map((m, i) => `import * as m${i} from '${name}/${m.path}';`),
  `export const modules = [${cem.modules.map((_, i) => `m${i}`).join(', ')}];`,
  // Every tag is in HTMLElementTagNameMap, so createElement returns its class.
  ...tags.map((tag, i) => `export const e${i}: HTMLElementTagNameMap['${tag}'] = document.createElement('${tag}');`),
  `const slider = document.createElement('md-gb-slider');`,
  `slider.valueStart = 10;`,
  `export const label: string = slider.valueLabel;`,
  `// @ts-expect-error: not a property of the slider`,
  `slider.notAProperty = 1;`,
  `// @ts-expect-error: internal/ is not in the package exports`,
  `export const internal = import('${name}/internal/behaviors/element-internals.js');`,
].join('\n');
writeFileSync(join(DIR, 'consumer.ts'), source + '\n');

let failed = false;
for (const resolution of ['nodenext', 'bundler']) {
  const tsconfig = join(DIR, `tsconfig.${resolution}.json`);
  writeFileSync(
    tsconfig,
    JSON.stringify({
      compilerOptions: {
        target: 'es2022',
        module: resolution === 'bundler' ? 'esnext' : 'nodenext',
        moduleResolution: resolution,
        lib: ['es2022', 'dom', 'dom.iterable'],
        strict: true,
        noEmit: true,
        skipLibCheck: false,
        types: [],
      },
      files: ['consumer.ts'],
    }),
  );
  let output = '';
  try {
    execFileSync(process.execPath, [join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc'), '-p', tsconfig], {encoding: 'utf8', stdio: 'pipe'});
  } catch (e) {
    output = String(e.stdout);
  }
  const errors = output.split('\n').filter((l) => /error TS\d+/.test(l));
  // Errors in this package's files or the consumer fail; other packages' don't.
  const ours = errors.filter((l) => !/^node_modules[\\/](?!\.cache)/.test(l) || l.includes(name));
  const theirs = errors.length - ours.length;
  console.log(
    `check-package-types (${resolution}): ${cem.modules.length} modules, ${tags.length} elements: ` +
      `${ours.length ? `${ours.length} errors` : 'ok'}${theirs ? ` (${theirs} in other packages' types)` : ''}`,
  );
  if (ours.length) {
    failed = true;
    console.log(ours.slice(0, 30).join('\n'));
  }
}
process.exit(failed ? 1 : 0);
