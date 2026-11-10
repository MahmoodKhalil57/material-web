/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates the shadcn registry of the md-gb elements (/3.0/r/, see
 * docs/about/shadcn.md): one `registry:ui` item per components
 * directory (a React wrapper file per item, made with @lit/react from the
 * element classes and the events read by gb-elements.mjs), the `md-theme`
 * and `md-theme-m3` themes, and the registry.json index. Used by the Eleventy
 * data file site/content/_data/gbShadcn.cjs; run it alone to write the files:
 *
 *   node scripts/m3/gb-shadcn.mjs <out dir> [registry base URL]
 */

import {mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readGbElements} from './gb-elements.mjs';

const require = createRequire(import.meta.url);
const names = require('../../site/eleventy-helpers/gb-shadcn.cjs');

const ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const COMPONENTS = join(ROOT, 'material-design-expressive', 'components');
const PKG = '@material/web/components';
const SCHEMA_ITEM = 'https://ui.shadcn.com/schema/registry-item.json';
const SCHEMA_REGISTRY = 'https://ui.shadcn.com/schema/registry.json';

const pascal = (s) => s.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
/** md-gb-nav-bar -> MdNavBar */
const componentName = (tag) => pascal(tag.replace('-gb-', '-'));
/** state-change -> onStateChange */
const handlerName = (event) => 'on' + pascal(event);
const stringify = (value) => JSON.stringify(value, null, 2) + '\n';

/** The names exported as types by the sources of a directory: name -> module. */
function exportedTypes(dir) {
  const out = new Map();
  const base = join(COMPONENTS, dir);
  for (const f of readdirSync(base)) {
    if (!f.endsWith('.ts') || f.endsWith('.d.ts') || /_test\.ts$/.test(f)) continue;
    const text = readFileSync(join(base, f), 'utf8');
    for (const m of text.matchAll(/^export (?:declare )?(?:interface|type|class) (\w+)/gm)) out.set(m[1], f.replace(/\.ts$/, '.js'));
  }
  return out;
}

/** The module that exports the class of an md-gb-*.ts entry file. */
function classModule(known, tag, className) {
  const file = known.get(className);
  if (!file) throw new Error(`${tag}: cannot find the module of ${className}`);
  return file;
}

/** The event type for EventName<>, plus the type it needs imported. */
function eventType(type, known) {
  const imports = [];
  if (/^(Event|InputEvent|ToggleEvent|CustomEvent)$/.test(type)) return {type, imports};
  const detail = /^CustomEvent<(.*)>$/.exec(type)?.[1];
  if (detail === undefined) return {type: 'Event', imports};
  if (detail.startsWith('{')) return {type, imports};
  if (known.has(detail)) return {type, imports: [detail]};
  return {type: 'CustomEvent', imports};
}

/** The source of components/ui/md-<name>.tsx for the elements of a directory. */
function wrapperSource(dir, elements, docs) {
  const known = exportedTypes(dir);
  const valueImports = []; // [module, class]
  const typeImports = new Map(); // module -> Set
  const blocks = [];
  for (const el of elements) {
    const mod = classModule(known, el.tag, el.className);
    valueImports.push([mod, el.className]);
    const events = [];
    for (const [name, info] of el.events) {
      const {type, imports} = eventType(info.type, known);
      for (const t of imports) {
        const file = known.get(t);
        if (!typeImports.has(file)) typeImports.set(file, new Set());
        typeImports.get(file).add(t);
      }
      events.push({name, handler: handlerName(name), type});
    }
    const component = componentName(el.tag);
    const doc = [`${el.summary || 'A Material Design component.'} Wraps <${el.tag}>.`, `Docs: ${docs}`].map((l) => ` * ${l.replace(/\*\//g, '* /')}`).join('\n');
    const eventsBlock = events.length
      ? `  events: {\n${events.map((e) => `    ${e.handler}: '${e.name}' as EventName<${e.type}>,`).join('\n')}\n  },\n`
      : '';
    blocks.push(
      `/**\n${doc}\n */\nexport const ${component} = createComponent({\n  react: React,\n  tagName: '${el.tag}',\n  elementClass: ${el.className},\n${eventsBlock}});\n\nexport type ${component}Props = React.ComponentProps<typeof ${component}>;\n`,
    );
  }

  // One element module per tag registers the custom element; the class
  // modules give the typed props.
  const registrations = elements.map((el) => `import '${PKG}/${dir}/${el.tag}.js';`);
  const classImports = valueImports.map(([mod, cls]) => `import {${cls}} from '${PKG}/${dir}/${mod}';`);
  const types = [...typeImports].map(([file, set]) => `import type {${[...set].sort().join(', ')}} from '${PKG}/${dir}/${file}';`);
  const usesEvents = elements.some((el) => el.events.length);
  const lit = `import {createComponent${usesEvents ? ', type EventName' : ''}} from '@lit/react';`;
  return [
    `'use client';\n`,
    `import * as React from 'react';`,
    lit,
    ...registrations,
    ...classImports,
    ...types,
    '',
    blocks.join('\n'),
  ].join('\n');
}

function themeItem(base) {
  const vars = names.themeCssVars();
  return {
    $schema: SCHEMA_ITEM,
    name: 'md-theme',
    type: 'registry:theme',
    title: 'Material Web 3.0 theme bridge',
    description:
      'Loads the Material 3 styles of md-gb (styles/m3.css) and maps the shadcn variables to the M3 color and shape roles, so md-gb elements follow your shadcn theme in light and dark.',
    dependencies: ['@material/web'],
    cssVars: {light: vars, dark: vars},
    css: {
      '@import "@material/web/styles/m3.css"': {},
      // Not in a layer: m3.css sets color-scheme in a layer that would win.
      ':root': {'color-scheme': 'light'},
      '.dark': {'color-scheme': 'dark'},
    },
    docs: `Material Web theme bridge installed. Read how the shadcn variables map to --md-sys-color-* at ${names.SITE_URL}/3.0/about/shadcn/`,
    meta: {docs: `${names.SITE_URL}/3.0/about/shadcn/`},
  };
}

function reverseThemeItem() {
  const {light, dark} = names.baselineRoles();
  const pick = (scheme) => {
    const vars = {};
    for (const [shadcn, role] of names.REVERSE_MAP) {
      if (!scheme[role]) throw new Error(`md-theme-m3: no baseline color for the role ${role}`);
      vars[shadcn] = scheme[role];
    }
    return vars;
  };
  return {
    $schema: SCHEMA_ITEM,
    name: 'md-theme-m3',
    type: 'registry:theme',
    title: 'Material 3 baseline theme for shadcn/ui',
    description:
      'Sets the shadcn variables from the Material 3 baseline color roles (light and dark) and a 12px radius, so shadcn/ui components match md-gb elements.',
    cssVars: {light: {...pick(light), radius: '0.75rem'}, dark: pick(dark)},
    docs: `Material 3 baseline theme installed. Mapping: ${names.SITE_URL}/3.0/about/shadcn/`,
    meta: {docs: `${names.SITE_URL}/3.0/about/shadcn/`},
  };
}

/**
 * Every registry file: [{name, json}] with the items, md-theme, md-theme-m3
 * and `registry` (registry.json, listing the items without file contents).
 *
 * @param base The URL the files are served from (default: names.registryBase()).
 */
export function buildGbShadcn(base = names.registryBase({forFiles: true})) {
  const elements = readGbElements();
  const pages = names.docsPages();
  const files = [];
  const index = [];
  for (const dir of names.elementDirs()) {
    const group = elements.filter((e) => e.dir === dir);
    if (!group.length) continue;
    const name = names.itemName(dir);
    const docs = names.docsUrl(dir, pages);
    const path = `components/ui/${name}.tsx`;
    const tags = group.map((e) => e.tag);
    const item = {
      $schema: SCHEMA_ITEM,
      name,
      type: 'registry:ui',
      title: pascal(name.slice(3)).replace(/([a-z])([A-Z])/g, '$1 $2'),
      description: `${group.map((e) => componentName(e.tag)).join(', ')}: React wrappers for ${tags.map((t) => `<${t}>`).join(', ')} (Material Web 3.0).`,
      dependencies: ['@material/web', '@lit/react'],
      registryDependencies: [`${base}/md-theme.json`],
      files: [{path, type: 'registry:ui', content: wrapperSource(dir, group, docs)}],
      docs: `Client components: in Next.js import them from a 'use client' file. API: ${docs}`,
      meta: {tags, docs},
    };
    files.push({name, json: stringify(item)});
    index.push({...item, files: item.files.map(({content, ...rest}) => rest)});
  }
  const theme = themeItem(base);
  const reverse = reverseThemeItem();
  files.push({name: 'md-theme', json: stringify(theme)}, {name: 'md-theme-m3', json: stringify(reverse)});
  index.push(theme, reverse);
  const registry = {
    $schema: SCHEMA_REGISTRY,
    name: 'material-web',
    homepage: `${names.SITE_URL}/3.0/`,
    items: index.map(({$schema, ...item}) => item),
  };
  files.push({name: 'registry', json: stringify(registry)});
  return files;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = process.argv[2];
  if (!out) throw new Error('usage: node scripts/m3/gb-shadcn.mjs <out dir> [registry base URL]');
  mkdirSync(out, {recursive: true});
  const files = buildGbShadcn(process.argv[3]?.replace(/\/+$/, ''));
  for (const f of files) writeFileSync(join(out, `${f.name}.json`), f.json);
  console.log(`${files.length} files in ${out}`);
}
