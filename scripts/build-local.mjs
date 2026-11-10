/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Builds the library in place (Sass -> CSS -> CSSResult modules -> tsc) with
 * the same steps as `npm run build`, but without shell-specific syntax, so it
 * also works on Windows.
 */

import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {readdir, readFile, stat, writeFile} from 'node:fs/promises';
import {dirname, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Runs `npx <args>` in `cwd`, cross-platform. */
export function npx(args, {cwd = ROOT, env} = {}) {
  execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {...process.env, ...env},
  });
}

/** Runs a Node script in `cwd`. */
export function nodeScript(args, {cwd = ROOT, env} = {}) {
  execFileSync(process.execPath, args, {cwd, stdio: 'inherit', env: {...process.env, ...env}});
}

export async function buildLibrary({log = (s) => console.log(`\n[build] ${s}`)} = {}) {
  log('Compiling build scripts');
  npx(['tsc', '-b', 'scripts/tsconfig.json']);

  log('Generating token metadata');
  const tokenDir = join(ROOT, 'tokens', 'versions');
  const tokenFiles = [];
  for (const version of await readdir(tokenDir)) {
    const dir = join(tokenDir, version, 'sass');
    const scan = existsSync(dir) ? dir : join(tokenDir, version);
    if (!(await stat(scan)).isDirectory()) continue;
    for (const f of await readdir(scan)) {
      if (/^_md-.*\.scss$/.test(f) && !f.endsWith('-meta.scss')) tokenFiles.push(join(scan, f));
    }
  }
  nodeScript(['scripts/generate-sass-token-meta.js', ...tokenFiles]);

  log('Compiling Sass');
  // v3 only: labs/ (labs/gb and labs/aria). The shared Sass in sass/ext is
  // loaded from there; the v2.5 component folders are gone on this branch.
  const dirs = ['labs:labs'];
  npx([
    'sass',
    '--style=compressed',
    '--no-source-map',
    '--quiet',
    '--load-path=node_modules',
    '--load-path=node_modules/sass-true/sass',
    ...dirs,
  ]);

  log('Converting CSS to CSSResult modules');
  for (const css of await walk(ROOT, (p) => p.endsWith('.css'))) {
    const content = (await readFile(css, 'utf8'))
      .replace(/\/\*# sourceMappingURL=[^*]+ \*\//, '')
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${');
    await writeFile(
      css.replace(/\.css$/, '.cssresult.ts'),
      `/**\n * @license\n * Copyright 2026 Google LLC\n * SPDX-License-Identifier: Apache-2.0\n */\n` +
        `// Generated stylesheet for ${relative(ROOT, css).replace(/\\/g, '/')}.\n` +
        `import {css} from 'lit';\nexport const styles = css\`${content}\`;\nexport default styles.styleSheet!;\n`,
    );
  }

  log('Compiling TypeScript');
  npx(['tsc', '--pretty']);
  npx(['tsc', '--pretty', '-p', 'labs/gb/tsconfig.json']);
}

async function walk(dir, keep, out = []) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.') || entry.name === 'catalog') continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, keep, out);
    else if (keep(p)) out.push(p);
  }
  return out;
}

// `npm run build`
if (process.argv[1]?.replace(/\\/g, '/').endsWith('/build-local.mjs')) {
  await buildLibrary();
}
