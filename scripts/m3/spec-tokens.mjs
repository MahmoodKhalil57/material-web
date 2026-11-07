#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Compiles M3 spec tokens into `labs/gb` component token mixins.
 *
 *   node scripts/m3/spec-tokens.mjs --check [button ...]   report spec drift
 *   node scripts/m3/spec-tokens.mjs --emit button          print generated SCSS
 *   node scripts/m3/spec-tokens.mjs --write [tooltip ...]  regenerate token files
 *
 * Components are configured in `scripts/m3/bindings/<name>.mjs`.
 *
 * `--write` rewrites the whole `_<component>-tokens.scss` of bindings marked
 * `generate: true` (components built from the spec by this pipeline). Such a
 * binding lists the `root` token sets, optional variant `mixins`, and
 * `exclude` patterns for tokens the component styles in CSS instead. Values
 * the spec has no token for are written by hand under an `// EDIT:` comment
 * and kept on regeneration.
 */

import {readdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {compileBinding, compileMixin, norm, parseMixins, sameValue} from './gb-compile.mjs';
import {SpecDb, WEB_CONTEXT} from './spec-db.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

const argv = process.argv.slice(2);
const mode = argv.includes('--write') ? 'write' : argv.includes('--emit') ? 'emit' : 'check';
const names = argv.filter((a) => !a.startsWith('--'));

const db = await SpecDb.load(argv.find((a) => a.startsWith('--specs='))?.slice(8) ?? '.m3-specs');
const bindingNames = names.length
  ? names
  : (await readdir(join(HERE, 'bindings'))).map((f) => f.replace(/\.mjs$/, ''));

let drift = 0;
for (const name of bindingNames) {
  const binding = (await import(pathToFileURL(join(HERE, 'bindings', `${name}.mjs`)).href)).default;
  if (binding.generate) {
    if (mode === 'write' || mode === 'check') await writeTokens(name, binding, mode === 'check');
    continue;
  }
  if (mode === 'write') continue;
  const source = await readFile(binding.file, 'utf8');
  const existing = parseMixins(source);
  const api = new Set(Object.keys(existing.get('root') ?? {}));
  const ignore = new Set(binding.ignore ?? []);
  const unsupported = new Set();

  const generated = new Map();
  for (const mixin of binding.mixins) {
    const decls = compileMixin(db, mixin, WEB_CONTEXT);
    const kept = {};
    for (const [prop, value] of Object.entries(decls)) {
      if (api.size && !api.has(prop)) {
        if (!ignore.has(prop)) unsupported.add(prop);
        continue;
      }
      kept[prop] = value;
    }
    if (Object.keys(kept).length || !mixin.optional) generated.set(mixin.name, kept);
  }

  if (mode === 'emit') {
    console.log(`// Generated from ${db.version} by scripts/m3/spec-tokens.mjs`);
    for (const [mixinName, decls] of generated) {
      console.log(`\n@mixin ${mixinName} {`);
      for (const [p, v] of Object.entries(decls).sort()) console.log(`  --${p}: ${v};`);
      console.log('}');
    }
    continue;
  }

  console.log(`\n## ${name} (${binding.file}) vs spec ${db.version}`);
  for (const [mixinName, decls] of generated) {
    const actual = existing.get(mixinName) ?? {};
    if (!existing.has(mixinName)) {
      const needed = Object.fromEntries(
        Object.entries(decls).filter(
          ([p, v]) => {
            const have = norm(effective(existing, mixin(binding, mixinName), p) ?? '');
            return !sameValue(have, v);
          },
        ),
      );
      if (Object.keys(needed).length) {
        drift++;
        console.log(`  + missing @mixin ${mixinName}: ${fmt(needed)}`);
      }
      continue;
    }
    for (const [prop, want] of Object.entries(decls)) {
      const have = effective(existing, mixin(binding, mixinName), prop);
      if (have === undefined) {
        drift++;
        console.log(`  ! ${mixinName}: --${prop} missing, spec says ${want}`);
      } else if (!sameValue(have, want)) {
        drift++;
        console.log(`  ~ ${mixinName}: --${prop} is ${have}, spec says ${want}`);
      }
    }
    for (const [prop, have] of Object.entries(actual)) {
      if (!(prop in decls) && api.has(prop)) {
        console.log(`  ? ${mixinName}: --${prop}: ${have} is not in the spec binding`);
      }
    }
  }
  if (unsupported.size) {
    console.log(`  - spec tokens outside the component API: ${[...unsupported].sort().join(', ')}`);
  }
}
if (mode === 'check') {
  console.log(`\n${drift} spec difference(s).`);
  if (drift) process.exitCode = 1;
}

/**
 * Writes (or, with `checkOnly`, compares) a generated token file.
 */
async function writeTokens(name, binding, checkOnly) {
  const previous = await readFile(binding.file, 'utf8').catch(() => '');
  const edits = parseEdits(previous);
  const exclude = (binding.exclude ?? []).map((p) => new RegExp(p));
  const compile = (specs) => compileBinding(db, specs, exclude, WEB_CONTEXT).decls;

  const blocks = [];
  const root = compile(binding.root);
  blocks.push(['root', root]);
  for (const m of binding.mixins ?? []) blocks.push([m.name, compile(m)]);

  const sets = [...new Set([binding.root, binding.mixins ?? []].flat().map((m) => m.set))];
  const lines = [
    '//',
    '// Copyright 2026 Google LLC',
    '// SPDX-License-Identifier: Apache-2.0',
    '//',
    '',
    '// Generated by scripts/m3/spec-tokens.mjs from the M3 spec; regenerate',
    '// with `npm run m3:update`. Values the spec has no token for go below an',
    '// `// EDIT:` comment and are kept on regeneration.',
    '//',
    `// Token sets: ${sets.map((s) => `'${s}'`).join(', ')}`,
  ];
  const rootProps = new Set(Object.keys(root));
  for (const [mixinName, decls] of blocks) {
    const manual = edits.get(mixinName) ?? [];
    const manualProps = new Set(manual.map((e) => e.prop));
    lines.push('', `@mixin ${mixinName} {`);
    for (const [p, v] of Object.entries(decls).sort(([a], [b]) => a.localeCompare(b))) {
      if (!manualProps.has(p)) lines.push(`  --${p}: ${v};`);
    }
    for (const e of manual) {
      lines.push(`  // EDIT: ${e.comment}`, `  --${e.prop}: ${e.value};`);
      if (mixinName === 'root') rootProps.add(e.prop);
    }
    lines.push('}');
  }
  lines.push(
    '',
    `// Inherits every \`root\` token from the parent, so values set on the`,
    `// \`md-gb-*\` host still apply inside its shadow root.`,
    '@mixin inherit {',
    ...[...rootProps].sort().map((p) => `  --${p}: inherit;`),
    '}',
    '',
  );
  const text = lines.join('\n');
  if (norm(text) === norm(previous.replace(/\r\n/g, '\n'))) {
    console.log(`${name}: ${binding.file} up to date`);
    return;
  }
  if (checkOnly) {
    drift++;
    console.log(`${name}: ${binding.file} is out of date; run --write`);
    return;
  }
  await writeFile(binding.file, text);
  console.log(`${name}: wrote ${binding.file}`);
}

/** `// EDIT: why` + the declaration after it, per mixin. */
function parseEdits(source) {
  const edits = new Map();
  for (const m of source.replace(/\r\n/g, '\n').matchAll(/@mixin\s+([\w-]+)\s*\{([^}]*)\}/g)) {
    const list = [];
    for (const e of m[2].matchAll(/\/\/ EDIT:[ \t]*([^\n]*)\n\s*--([\w-]+)\s*:\s*([^;]+);/g)) {
      list.push({comment: e[1].trim(), prop: e[2], value: e[3].replace(/\s+/g, ' ').trim()});
    }
    if (list.length) edits.set(m[1], list);
  }
  return edits;
}

function mixin(binding, name) {
  return binding.mixins.find((m) => m.name === name);
}

/**
 * The value a property ends up with when `mixin` applies: its own
 * declaration, else the first mixin it layers over (`inherits`), else `root`.
 */
function effective(existing, mixin, prop) {
  for (const name of [mixin.name, ...(mixin.inherits ?? []), 'root']) {
    const value = existing.get(name)?.[prop];
    if (value !== undefined) return value;
  }
  return undefined;
}

function fmt(decls) {
  return Object.entries(decls).map(([p, v]) => `--${p}: ${v}`).join('; ');
}
