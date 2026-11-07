#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * API reference tables for the `md-gb-*` elements of one labs/gb component
 * directory, as markdown for the /3.0/ catalog pages (used by
 * scripts/catalog-dev.mjs). The data comes from the TypeScript sources through
 * the reader shared with gen-agent-skill.mjs.
 *
 *   node scripts/m3/gen-api-docs.mjs button   # print the tables for one directory
 *   node scripts/m3/gen-api-docs.mjs          # list the directories
 */

import {readGbElements} from './gb-elements.mjs';

let cache;
const elements = () => (cache ??= readGbElements());

/** Escapes a table cell; braces become entities so the template engine ignores them. */
const esc = (s) =>
  String(s)
    .replace(/ --[a-z]+/g, '')
    .replace(/\|/g, '\\|')
    .replace(/[{}]/g, (c) => `&#${c.charCodeAt(0)};`);
const code = (s) => '`' + esc(s).replace(/`/g, "'") + '`';

/** The labs/gb component directories that have elements. */
export function gbApiDirs() {
  return [...new Set(elements().map((e) => e.dir))].sort();
}

/** Markdown (`### <tag>` and `####` sections) for every element in `dir`. */
export function gbApiMarkdown(dir) {
  const out = [];
  for (const e of elements().filter((el) => el.dir === dir)) {
    out.push(`### &lt;${e.tag}&gt;`, '');
    if (e.summary) out.push(esc(e.summary), '');
    if (e.props.length) {
      out.push('#### Attributes and properties', '', '| Property | Attribute | Type | Default | Description |', '| --- | --- | --- | --- | --- |');
      for (const p of e.props) {
        const attr = p.attribute ? code(p.attribute) + (p.reflect ? ' (reflects)' : '') : 'property only';
        out.push(`| ${code(p.name)} | ${attr} | ${code(p.type)} | ${p.default ? code(p.default) : ''} | ${esc(p.description)} |`);
      }
      out.push('');
    }
    const list = (heading, items) => {
      if (items.length) out.push(`#### ${heading}`, '', ...items, '');
    };
    list('Slots', e.slots.map(([n, d]) => `*   ${n ? code(n) : 'default slot'}${d ? ': ' + esc(d) : ''}`));
    list('Events', e.events.map(([n, v]) => `*   ${code(n)} (${code(v.type)})${v.description ? ': ' + esc(v.description) : ''}`));
    list('Methods', e.methods.map((m) => `*   ${code(m.name)}: ${code(m.signature)}${m.description ? ' ' + esc(m.description) : ''}`));
    list('CSS parts', e.parts.map(([n, d]) => `*   ${code('::part(' + n + ')')}${d ? ': ' + esc(d) : ''}`));
    list('CSS custom properties', e.cssProps.map(([n, d]) => `*   ${code(n)}${d ? ': ' + esc(d) : ''}`));
  }
  return out.join('\n').replace(/\n+$/, '\n');
}

if (import.meta.url === new URL(process.argv[1], 'file://').href || process.argv[1]?.endsWith('gen-api-docs.mjs')) {
  const dir = process.argv[2];
  console.log(dir ? gbApiMarkdown(dir) : gbApiDirs().join('\n'));
}
