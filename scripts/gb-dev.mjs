#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A local dev site for the `labs/gb` components (M3 Expressive), using each
 * component's `demo/` stories and the catalog's story framework (knob panel),
 * served from the locally built library. Works on Windows, macOS and Linux.
 *
 *   npm run gb:dev                      # build, then serve and open
 *   npm run gb:dev -- --skip-build      # serve the last build
 *   npm run gb:dev -- --port 8100 --no-open
 *
 * Generated pages go to `.gb-dev/` (gitignored).
 */

import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdir, readdir, readFile, rm, stat, writeFile} from 'node:fs/promises';
import {basename, dirname, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '.gb-dev');
const GB = join(ROOT, 'labs', 'gb', 'components');
const STORIES = join(ROOT, 'catalog', 'stories');

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const SKIP_BUILD = argv.includes('--skip-build');
const PORT = Number(arg('port', 8000));
const OPEN = !argv.includes('--no-open');

process.chdir(ROOT);
if (!SKIP_BUILD) await build();
const components = await generate();
await serve(components);

// ---------------------------------------------------------------------------
// Build: the same steps as `npm run build`, without shell-specific syntax.

async function build() {
  const step = (label) => console.log(`\n[gb:dev] ${label}`);
  const npx = (args) =>
    execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

  step('Compiling build scripts');
  npx(['tsc', '-b', 'scripts/tsconfig.json']);

  step('Generating token metadata');
  const tokenDir = join('tokens', 'versions');
  const tokenFiles = [];
  for (const version of await readdir(tokenDir)) {
    const dir = join(tokenDir, version, 'sass');
    const scan = existsSync(dir) ? dir : join(tokenDir, version);
    if (!(await stat(scan)).isDirectory()) continue;
    for (const f of await readdir(scan)) {
      if (/^_md-.*\.scss$/.test(f) && !f.endsWith('-meta.scss')) tokenFiles.push(join(scan, f));
    }
  }
  execFileSync(process.execPath, ['scripts/generate-sass-token-meta.js', ...tokenFiles], {stdio: 'inherit'});

  step('Compiling Sass');
  const skip = new Set(['node_modules', 'catalog', 'scripts', 'docs', 'types', 'migrations']);
  const dirs = [];
  for (const entry of await readdir(ROOT, {withFileTypes: true})) {
    if (entry.isDirectory() && !entry.name.startsWith('.') && !skip.has(entry.name)) {
      dirs.push(`${entry.name}:${entry.name}`);
    }
  }
  npx([
    'sass',
    '--style=compressed',
    '--no-source-map',
    '--quiet',
    '--load-path=node_modules',
    '--load-path=node_modules/sass-true/sass',
    ...dirs,
  ]);

  step('Converting CSS to CSSResult modules');
  let converted = 0;
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
    converted++;
  }
  console.log(`${converted} stylesheets`);

  step('Compiling TypeScript');
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

// ---------------------------------------------------------------------------
// Generate: transpile demos + story framework into .gb-dev/ and add pages.

async function generate() {
  const esbuild = await import('esbuild');
  await rm(OUT, {recursive: true, force: true});

  const tsconfigRaw = {compilerOptions: {experimentalDecorators: true, useDefineForClassFields: false}};
  // `@material/web/<path>` is this repo, served from the site root.
  const toSiteRoot = (code) => code.replace(/(['"])@material\/web\//g, '$1/');

  const transpile = async (from, to, rewrite = (s) => s) => {
    // Demos import compiled CSS as `.css` modules (some with named imports,
    // which CSS module scripts do not have); use the generated CSSResult
    // modules, which export both `styles` and the default stylesheet.
    const source = (await readFile(from, 'utf8')).replace(
      /(['"])([^'"]+)\.css\1\s+with\s*\{\s*type:\s*['"]css['"]\s*\}/g,
      '$1$2.cssresult.js$1',
    );
    const {code} = await esbuild.transform(source, {loader: 'ts', format: 'esm', target: 'esnext', tsconfigRaw});
    await mkdir(dirname(to), {recursive: true});
    await writeFile(to, toSiteRoot(rewrite(code)));
  };

  // The catalog's story framework (knob panel, stories renderer), bundled so
  // type-only exports resolve; lit and the components stay shared imports.
  await esbuild.build({
    entryPoints: [join(STORIES, 'index.ts'), join(STORIES, 'material-collection.ts')],
    outdir: join(OUT, '_stories'),
    bundle: true,
    splitting: true,
    format: 'esm',
    target: 'esnext',
    external: ['lit', 'lit/*', 'postdoc-lib', '@material/web/*'],
    tsconfigRaw,
    write: true,
    logLevel: 'warning',
  });
  for (const f of await readdir(join(OUT, '_stories'))) {
    if (f.endsWith('.js')) {
      const p = join(OUT, '_stories', f);
      await writeFile(p, toSiteRoot(await readFile(p, 'utf8')));
    }
  }

  const components = [];
  for (const name of (await readdir(GB)).sort()) {
    const demo = join(GB, name, 'demo');
    if (!existsSync(join(demo, 'demo.ts'))) continue;
    for (const f of await readdir(demo)) {
      if (!f.endsWith('.ts')) continue;
      await transpile(join(demo, f), join(OUT, name, f.replace(/\.ts$/, '.js')), (code) =>
        code.replace(/(['"])\.\/(material-collection|index)\.js\1/g, '$1../_stories/$2.js$1'),
      );
    }
    const title = (await readFile(join(demo, 'demo.ts'), 'utf8')).match(/MaterialCollection<[^>]*>>\(\s*'([^']+)'/)?.[1] ?? name;
    components.push({name, title});
    await writeFile(join(OUT, name, 'index.html'), page(`${title} · gb`, `<script type="module" src="./demo.js"></script>`));
  }

  await writeFile(join(OUT, '_shell.js'), shell(components));
  await writeFile(
    join(OUT, 'index.html'),
    page(
      'Material 3 Expressive (labs/gb)',
      `<main class="gb-dev-home">
        <h1>Material 3 Expressive · labs/gb</h1>
        <p>Local build of every <code>labs/gb</code> component. Each page has the
        component's stories and a knob panel; use the bar above to switch
        theme and motion scheme.</p>
        <ul>${components.map((c) => `<li><a href="./${c.name}/">${c.title}</a></li>`).join('')}</ul>
      </main>`,
    ),
  );
  console.log(`\n[gb:dev] Generated ${components.length} component pages in ${relative(ROOT, OUT)}/`);
  return components;
}

function page(title, body) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
    <link rel="stylesheet" href="/labs/gb/styles/m3.css" />
    <style>
      :root {
        background-color: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);
        font-family: 'Roboto Flex', system-ui, sans-serif;
      }
      body { margin: 0; }
      .gb-dev-home { max-width: 720px; margin: 0 auto; padding: 24px 16px; }
      .gb-dev-home h1 { font: var(--md-sys-typescale-headline-md); }
      .gb-dev-home ul { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; padding: 0; list-style: none; }
      .gb-dev-home a { display: block; padding: 12px 16px; border-radius: var(--md-sys-shape-corner-lg); background: var(--md-sys-color-surface-container); color: inherit; text-decoration: none; }
      .gb-dev-home a:hover { background: var(--md-sys-color-secondary-container); }
    </style>
    <script type="module" src="/.gb-dev/_shell.js"></script>
  </head>
  <body>
    ${body}
  </body>
</html>
`;
}

/** Top bar: component picker, theme and motion scheme switches. */
function shell(components) {
  return `// Generated by scripts/gb-dev.mjs.
const COMPONENTS = ${JSON.stringify(components)};
const root = document.documentElement;
const store = {
  get: (k, d) => { try { return localStorage.getItem('gb-dev:' + k) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem('gb-dev:' + k, v); } catch {} },
};
function applyTheme(theme) {
  root.style.colorScheme = theme === 'auto' ? 'light dark' : theme;
}
function applyMotion(motion) {
  root.classList.toggle('md-motion-standard', motion === 'standard');
}
applyTheme(store.get('theme', 'auto'));
applyMotion(store.get('motion', 'expressive'));

const current = location.pathname.split('/').filter(Boolean).at(-1);
const bar = document.createElement('header');
bar.innerHTML = \`
  <style>
    .gb-dev-bar { position: sticky; top: 0; z-index: 10; display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
      padding: 8px 16px; background: var(--md-sys-color-surface-container); color: var(--md-sys-color-on-surface);
      font: 500 14px/20px 'Roboto Flex', system-ui, sans-serif; }
    .gb-dev-bar a { color: inherit; text-decoration: none; font-weight: 700; }
    .gb-dev-bar label { display: inline-flex; gap: 6px; align-items: center; }
    .gb-dev-bar select { font: inherit; padding: 4px 8px; border-radius: 8px; }
    .gb-dev-bar .spacer { flex: 1; }
  </style>
  <nav class="gb-dev-bar">
    <a href="/.gb-dev/">labs/gb</a>
    <select aria-label="Component">
      <option value="">All components</option>
      \${COMPONENTS.map((c) => \`<option value="\${c.name}" \${c.name === current ? 'selected' : ''}>\${c.title}</option>\`).join('')}
    </select>
    <span class="spacer"></span>
    <label>Theme <select data-theme>
      <option value="auto">Auto</option><option value="light">Light</option><option value="dark">Dark</option>
    </select></label>
    <label>Motion <select data-motion>
      <option value="expressive">Expressive</option><option value="standard">Standard</option>
    </select></label>
  </nav>\`;
const [picker, theme, motion] = bar.querySelectorAll('select');
picker.addEventListener('change', () => { location.href = '/.gb-dev/' + (picker.value ? picker.value + '/' : ''); });
theme.value = store.get('theme', 'auto');
motion.value = store.get('motion', 'expressive');
theme.addEventListener('change', () => { store.set('theme', theme.value); applyTheme(theme.value); });
motion.addEventListener('change', () => { store.set('motion', motion.value); applyMotion(motion.value); });
const mount = () => document.body.prepend(bar);
document.body ? mount() : addEventListener('DOMContentLoaded', mount);
`;
}

// ---------------------------------------------------------------------------
// Serve.

async function serve(components) {
  const {startDevServer} = await import('@web/dev-server');
  await startDevServer({
    config: {
      rootDir: ROOT,
      port: PORT,
      nodeResolve: true,
      open: OPEN ? '/.gb-dev/' : false,
      watch: false,
    },
    readCliArgs: false,
    readFileConfig: false,
  });
  console.log(
    `\n[gb:dev] ${components.length} components at http://localhost:${PORT}/.gb-dev/` +
      `\n[gb:dev] After editing sources, rerun to rebuild (or pass --skip-build to only regenerate pages).`,
  );
}
