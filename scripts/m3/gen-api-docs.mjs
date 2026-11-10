#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * API reference for the `md-gb-*` elements of one labs/gb component directory,
 * as markdown for the /3.0/ catalog pages (used by the `gbapi` shortcode,
 * site/eleventy-helpers/shortcodes/gb.cjs). Per element: `### <tag>`, one
 * line about it, then only the tables that have rows, each under an `####`
 * title (the page outline shows H2 and H3 only). The data comes from the
 * TypeScript sources through scripts/m3/gb-elements.mjs.
 *
 *   node scripts/m3/gen-api-docs.mjs button   # print the API for one directory
 *   node scripts/m3/gen-api-docs.mjs          # list the directories
 */

import {readGbElements} from './gb-elements.mjs';

let cache;
const elements = () => (cache ??= readGbElements());

/** Escapes a table cell; braces become entities so the template engine ignores them. */
const esc = (s) =>
  String(s)
    .replace(/\s+--[a-z]+/g, '')
    .replace(/\|/g, '\|')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[{}]/g, (c) => `&#${c.charCodeAt(0)};`);
/** Code in a cell. The inner text is escaped as HTML, so a `<code>` element is used. */
const code = (s) => '<code>' + esc(String(s).replace(/\s+/g, ' ')) + '</code>';
/** Backticked prose (`close()`) becomes code. */
const prose = (s) =>
  esc(s).replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
const desc = (s) => (s ? `<span class="gb-desc">${prose(s)}</span>` : '');

/** Inherited Lit lifecycle callbacks are not part of the API. */
const LIFECYCLE = /Callback$/;

/** The labs/gb component directories that have elements. */
export function gbApiDirs() {
  return [...new Set(elements().map((e) => e.dir))].sort();
}

const table = (title, head, rows) =>
  rows.length
    ? [`#### ${title}`, '', `| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`), '']
    : [];

/** Markdown for every element in `dir`. */
export function gbApiMarkdown(dir) {
  const out = [];
  for (const e of elements().filter((el) => el.dir === dir)) {
    out.push(`### &lt;${e.tag}&gt;`, '');
    if (e.summary) out.push(prose(e.summary.replace(/\.?$/, '.')), '');
    out.push(
      ...table(
        'Properties',
        ['Property', 'Attribute', 'Type', 'Default'],
        e.props.map((p) => [
          code(p.name) + (p.description ? '<br>' + desc(p.description) : ''),
          p.attribute ? code(p.attribute) : '',
          code(p.type),
          p.default ? code(p.default) : '',
        ]),
      ),
      ...table(
        'Slots',
        ['Slot', 'Description'],
        e.slots.map(([n, d]) => [n ? code(n) : 'default', prose(d)]),
      ),
      ...table(
        'Events',
        ['Event', 'Description'],
        e.events.map(([n, v]) => [code(n) + '<br>' + desc(v.type), prose(v.description)]),
      ),
      ...table(
        'Methods',
        ['Method', 'Description'],
        e.methods
          .filter((m) => !LIFECYCLE.test(m.name))
          .map((m) => [code(m.name) + '<br>' + desc(m.signature), prose(m.description)]),
      ),
      ...table(
        'CSS parts',
        ['Part', 'Description'],
        e.parts.map(([n, d]) => [code('::part(' + n + ')'), prose(d)]),
      ),
      ...table(
        'CSS custom properties',
        ['Property', 'Description'],
        e.cssProps.map(([n, d]) => [code(n), prose(d)]),
      ),
    );
  }
  return out.join('\n').replace(/\n+$/, '\n');
}

if (process.argv[1]?.endsWith('gen-api-docs.mjs')) {
  const dir = process.argv[2];
  console.log(dir ? gbApiMarkdown(dir) : gbApiDirs().join('\n'));
}
