#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Runs the material-web.dev catalog locally against the local build, with the
 * M3 Expressive `labs/gb` components added under an "M3 Expressive" section.
 * Works on Windows, macOS and Linux.
 *
 *   npm run catalog:dev                    # build everything, serve, open
 *   npm run catalog:dev -- --skip-build    # reuse the last library build
 *   npm run catalog:dev -- --port 8000 --lib-port 8001 --no-open
 *
 * On material-web.dev, stories run in a playground that loads the published
 * @material/web from unpkg. Here the playground sandbox and an import map
 * point at a second local server that serves this repo, so every story (old
 * and new components) runs the code in your working tree.
 */

import {existsSync} from 'node:fs';
import {cp, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {buildLibrary, nodeScript, npx, ROOT} from './build-local.mjs';

const CATALOG = join(ROOT, 'catalog');
const GB = join(ROOT, 'labs', 'gb', 'components');
const OUT = join(CATALOG, '_dev');

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const PORT = Number(arg('port', 8000));
const LIB_PORT = Number(arg('lib-port', 8001));
const LIB = `http://localhost:${LIB_PORT}/`;
const log = (s) => console.log(`\n[catalog:dev] ${s}`);
const DEV_ENV = {NODE_ENV: 'DEV'};

if (!argv.includes('--skip-build')) await buildLibrary({log});

log('Copying docs and stories');
nodeScript(['scripts/copy-docs.mjs'], {cwd: CATALOG});
nodeScript(['scripts/copy-stories.mjs'], {cwd: CATALOG});
const expressive = await addExpressiveComponents();

log('Bundling catalog scripts');
nodeScript(['esbuild.config.mjs'], {cwd: CATALOG, env: DEV_ENV});

log('Building pages (Eleventy)');
await rm(OUT, {recursive: true, force: true});
npx(['eleventy'], {cwd: CATALOG, env: DEV_ENV});

log('Pointing playgrounds at the local build');
await useLocalLibrary();

await serve();
log(
  `Catalog: http://localhost:${PORT}/  (${expressive.length} M3 Expressive components)\n` +
    `[catalog:dev] Library: ${LIB} (serves this repo for the playground)\n` +
    `[catalog:dev] After editing sources, rerun (add --skip-build if only docs or demos changed).`,
);

// ---------------------------------------------------------------------------

/**
 * Adds a stories folder and a docs page for every labs/gb component that has
 * a demo. Both land in gitignored catalog folders.
 */
async function addExpressiveComponents() {
  const added = [];
  for (const dir of (await readdir(GB)).sort()) {
    const demo = join(GB, dir, 'demo');
    if (!existsSync(join(demo, 'demo.ts'))) continue;
    const dirname = `gb-${dir}`;
    const stories = join(CATALOG, 'stories', dirname);
    await rm(stories, {recursive: true, force: true});
    await cp(demo, stories, {recursive: true});
    await writeFile(
      join(stories, 'project.json'),
      JSON.stringify(
        {extends: '/assets/stories/base.json', files: {'demo.ts': {hidden: true}, 'stories.ts': {}}},
        null,
        2,
      ) + '\n',
    );
    const doc = await describeComponent(dir);
    await writeFile(join(CATALOG, 'site', 'components', `${dirname}.md`), docsPage(dir, dirname, doc));
    added.push(doc.title);
  }
  console.log(`${added.length} M3 Expressive components: ${added.join(', ')}`);
  return added;
}

/** Reads the title from the demo and the API from the element's jsdoc. */
async function describeComponent(dir) {
  const files = await readdir(join(GB, dir));
  const demo = await readFile(join(GB, dir, 'demo', 'demo.ts'), 'utf8');
  const title = demo.match(/MaterialCollection<[^>]*>>\(\s*'([^']+)'/)?.[1] ?? dir;

  // Tag names from md-gb-*.ts registrations.
  const tags = new Map(); // class -> tag
  for (const f of files.filter((f) => /^md-gb-.*\.ts$/.test(f) && !f.endsWith('.d.ts'))) {
    const src = await readFile(join(GB, dir, f), 'utf8');
    for (const m of src.matchAll(/customElements\.define\(\s*'([^']+)'\s*,\s*(\w+)\s*\)/g)) tags.set(m[2], m[1]);
  }

  const elements = [];
  for (const f of files.filter((f) => /-element\.ts$/.test(f) && !f.endsWith('.d.ts'))) {
    const src = (await readFile(join(GB, dir, f), 'utf8')).replace(/\r\n/g, '\n');
    const cls = src.match(/\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*export class (\w+)/);
    if (!cls) continue;
    const doc = jsdoc(cls[1]);
    const properties = [];
    for (const m of src.matchAll(
      /\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*@property\(([^)]*)\)\s*(?:override\s+)?(?:accessor\s+)?(\w+)\??\s*(?::\s*([^=;]+?))?\s*(?:=\s*([^;]+))?;/g,
    )) {
      const [, comment, options, name, type, value] = m;
      const attribute = options.match(/attribute:\s*'([^']+)'/)?.[1] ?? name.toLowerCase();
      properties.push({
        name,
        attribute: /attribute:\s*false/.test(options) ? '' : attribute,
        type: (type ?? options.match(/type:\s*(\w+)/)?.[1] ?? '').trim(),
        default: (value ?? '').trim(),
        description: jsdoc(comment).text,
      });
    }
    elements.push({tag: tags.get(cls[2]) ?? '', className: cls[2], ...doc, properties});
  }
  return {title, elements};
}

function jsdoc(block) {
  const lines = block.split('\n').map((l) => l.replace(/^\s*\* ?/, '').trimEnd());
  const text = [];
  const tags = {cssprop: [], fires: [], slot: [], csspart: []};
  for (const line of lines) {
    const m = line.match(/^@(cssprop|fires|slot|csspart)\s+(.*)$/);
    if (m) tags[m[1]].push(m[2]);
    else if (!line.startsWith('@') && !Object.values(tags).some((t) => t.length)) text.push(line);
  }
  return {text: text.join(' ').replace(/\s+/g, ' ').trim(), ...tags};
}

function docsPage(dir, dirname, {title, elements}) {
  const main = elements.find((e) => e.tag) ?? elements[0];
  const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/[{}]/g, (c) => `&#${c.charCodeAt(0)};`);
  const usage = elements
    .filter((e) => e.tag)
    .map((e) => `import '@material/web/labs/gb/components/${dir}/${e.tag}.js';`)
    .join('\n');
  const api = elements
    .filter((e) => e.tag)
    .map((e) => {
      const out = [`### &lt;${e.tag}&gt;`, '', e.text, ''];
      if (e.properties.length) {
        out.push('#### Properties', '', '| Property | Attribute | Type | Default | Description |', '| --- | --- | --- | --- | --- |');
        for (const p of e.properties) {
          out.push(`| \`${p.name}\` | ${p.attribute ? `\`${p.attribute}\`` : ''} | \`${esc(p.type)}\` | ${p.default ? `\`${esc(p.default)}\`` : ''} | ${esc(p.description)} |`);
        }
        out.push('');
      }
      const list = (heading, items) => {
        if (!items.length) return;
        out.push(`#### ${heading}`, '', ...items.map((i) => `*   ${esc(i.replace(/^(\S+)/, '`$1`'))}`), '');
      };
      list('Slots', e.slot);
      list('Events', e.fires);
      list('CSS parts', e.csspart);
      list('CSS custom properties', e.cssprop);
      return out.join('\n');
    })
    .join('\n');

  return `---
name: ${title}
dirname: ${dirname}
expressive: true
tags: [expressive]
ssrOnly: true
---

<catalog-component-header>
<catalog-component-header-title slot="title">

# ${title}

${esc(main?.text ?? '')}

This is an M3 Expressive component from \`labs/gb\`, built locally from this
repository.

</catalog-component-header-title>

<lit-island on:visible import="/js/hydration-entrypoints/playground-elements.js" class="hero" aria-label="${title} examples">
<playground-project id="hero" project-src="/assets/stories/{{ dirname }}/project.json"></playground-project>
<playground-preview project="hero" style="display: block; height: 440px; border-radius: 28px; overflow: hidden;"><md-circular-progress indeterminate></md-circular-progress></playground-preview>
</lit-island>

</catalog-component-header>

{% playgroundexample dirname=dirname %}

## Usage

\`\`\`js
${usage}
\`\`\`

Every component also has a class API for plain HTML; see
\`labs/gb/components/${dir}/\` and its stories above.

## API

${api}
`;
}

/** Points the playground sandbox and import map at the local library. */
async function useLocalLibrary() {
  const sandbox = `${LIB}node_modules/playground-elements/`;
  const importMap = {
    imports: {
      '@material/web/': LIB,
      'lit': `${LIB}node_modules/lit/index.js`,
      'lit/': `${LIB}node_modules/lit/`,
      '@lit/context': `${LIB}node_modules/@lit/context/index.js`,
      'postdoc-lib': `${LIB}node_modules/postdoc-lib/lib/postdoc.js`,
    },
  };
  let pages = 0;
  let projects = 0;
  for (const file of await walk(OUT)) {
    if (file.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      if (!html.includes('<playground-project')) continue;
      await writeFile(file, html.replace(/<playground-project(?![^>]*sandbox-base-url)/g, `<playground-project sandbox-base-url="${sandbox}"`));
      pages++;
    } else if (file.endsWith('project.json')) {
      const project = JSON.parse(await readFile(file, 'utf8'));
      project.importMap = importMap;
      await writeFile(file, JSON.stringify(project, null, 2));
      projects++;
    }
  }
  console.log(`${pages} pages and ${projects} playground projects use ${LIB}`);
}

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

async function serve() {
  const {startDevServer} = await import('@web/dev-server');
  // The library: this repo, with bare imports resolved, for the playground.
  await startDevServer({
    config: {
      rootDir: ROOT,
      port: LIB_PORT,
      nodeResolve: true,
      middleware: [
        (ctx, next) => {
          ctx.set('Access-Control-Allow-Origin', '*');
          return next();
        },
      ],
    },
    readCliArgs: false,
    readFileConfig: false,
    logStartMessage: false,
  });
  // The catalog site.
  await startDevServer({
    config: {rootDir: OUT, port: PORT, open: argv.includes('--no-open') ? false : '/'},
    readCliArgs: false,
    readFileConfig: false,
    logStartMessage: false,
  });
}
