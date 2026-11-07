/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Splits the downloaded M3 spec pages (`.m3-specs/pages/**\/*.md`) into
 * units: each sentence, list item, table row (cells prefixed with their
 * column header) and image caption, tagged with its page and heading path.
 *
 * Every unit has a stable ID, `<page-slug>-<hex>`, hashed from the page and
 * the unit's normalized text, so it survives edits elsewhere on the page.
 * Every heading path has a section ID, `<page-slug>/<heading-slug>/...`
 * (the page's H1 left out), which covers the section and its subsections.
 *
 * Code cites units or sections in a comment starting with `spec:` (see
 * spec-checks.mjs).
 */

import {createHash} from 'node:crypto';
import {readdirSync, readFileSync} from 'node:fs';
import {join, relative, sep} from 'node:path';

export const PAGES = '.m3-specs/pages';

/** Pages with no component-library requirements, and the index pages. */
export const SKIP =
  /^(foundations\/(content-design|xr)\/|foundations\/(glossary|watches|writing)\.md$|(components|styles|foundations)\.md$)/;

/** Hex digits of a unit ID (more only when two IDs on a page collide). */
const HEX = 6;

/** `components/sliders.md` -> `sliders`, `styles/color/roles.md` -> `color-roles`. */
export function pageSlug(page) {
  const parts = page.replace(/\.md$/, '').split('/').slice(1);
  if (!parts.length) return slug(page.replace(/\.md$/, ''));
  // `layout/layout-overview` -> `layout-overview`.
  for (let i = parts.length - 1; i > 0; i--) {
    if (parts[i].startsWith(`${parts[i - 1]}-`)) parts.splice(i - 1, 1);
  }
  return parts.map(slug).join('-');
}

export function slug(text) {
  return (
    text
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[*_`]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'x'
  );
}

/** Text as hashed: markdown emphasis removed, whitespace collapsed, lowercase. */
export function normalize(text) {
  return text
    .replace(/[*_`]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Section ID of a heading path (H1 first). */
export function sectionId(page, headings) {
  return [pageSlug(page), ...headings.slice(1).map(slug)].join('/');
}

/** In-scope page paths, relative to `root`, sorted. */
export function specPages(root = PAGES) {
  const files = [];
  (function walk(dir) {
    for (const e of readdirSync(dir, {withFileTypes: true})) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md')) {
        files.push(relative(root, p).split(sep).join('/'));
      }
    }
  })(root);
  return files.sort().filter((f) => !SKIP.test(f));
}

/**
 * Units of one page's markdown, in page order:
 * `{page, heading, headings, kind, text}` (no IDs; see `assignIds`).
 */
export function pageUnits(page, markdown) {
  const units = [];
  const lines = markdown.replace(/\r/g, '').split('\n');
  const heads = [];
  let tableHead = null;
  // The table row pushed from the previous line: a separator line after it
  // makes it the header of a new table.
  let lastRow = null;
  let para = [];
  const push = (kind, text) => {
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length < 3) return;
    const headings = heads.filter(Boolean);
    units.push({page, heading: headings.join(' > '), headings, kind, text});
  };
  const flush = () => {
    const t = para.join(' ').trim();
    para = [];
    if (!t) return;
    for (const s of t.split(/(?<=[.!?])\s+(?=[A-Z“"(])/)) push('sentence', s);
  };
  for (const raw of lines) {
    const l = raw.trim();
    if (/^(Source|Updated):/.test(l) || l.startsWith('[STATUS_TABLE')) continue;
    const h = l.match(/^(#{1,6})\s+(.*)/);
    if (h) {
      flush();
      tableHead = null;
      heads.length = h[1].length - 1;
      heads[h[1].length - 1] = h[2].trim();
      continue;
    }
    if (l.startsWith('|')) {
      flush();
      const cells = l
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c) || c === '')) {
        if (lastRow && cells.some(Boolean)) {
          units.splice(lastRow.at);
          tableHead = lastRow.cells;
        }
        lastRow = null;
        continue;
      }
      if (!tableHead) {
        tableHead = cells;
        lastRow = null;
        continue;
      }
      lastRow = {cells, at: units.length};
      push(
        'table-row',
        cells
          .map((c, i) => (tableHead[i] ? `${tableHead[i]}: ${c}` : c))
          .filter((c) => c && !/:\s*$/.test(c))
          .join(' | '),
      );
      continue;
    }
    lastRow = null;
    // The export splits table cells over several lines, with blank lines and
    // cell text between rows, so a table only ends at the next heading.
    const img = l.match(/^\[IMAGE:\s*(.*?)\]\(/);
    if (img) {
      flush();
      push('image', img[1]);
      continue;
    }
    if (!l) {
      flush();
      continue;
    }
    const li = l.match(/^([-*]|\d+\.)\s+(.*)/);
    if (li) {
      flush();
      push('list-item', li[2]);
      continue;
    }
    para.push(l);
  }
  flush();
  return units;
}

/**
 * Adds `id`, `slug`, `section` and `prev` (the preceding unit's text) to the
 * units of one page. Identical texts on a page are told apart by their
 * occurrence (`#2`, `#3`, ...); IDs whose first HEX digits collide are
 * lengthened until unique.
 */
export function assignIds(units) {
  const seen = new Map();
  const full = units.map((u) => {
    const n = normalize(u.text);
    const k = (seen.get(n) ?? 0) + 1;
    seen.set(n, k);
    return createHash('sha1')
      .update(`${u.page}\n${n}${k > 1 ? `#${k}` : ''}`)
      .digest('hex');
  });
  const len = full.map(() => HEX);
  for (let grew = true; grew; ) {
    grew = false;
    const by = new Map();
    full.forEach((h, i) => {
      const p = h.slice(0, len[i]);
      by.set(p, [...(by.get(p) ?? []), i]);
    });
    for (const group of by.values()) {
      if (group.length < 2) continue;
      for (const i of group) len[i] += 2;
      grew = true;
    }
  }
  return units.map((u, i) => {
    const s = pageSlug(u.page);
    return {
      id: `${s}-${full[i].slice(0, len[i])}`,
      slug: s,
      section: sectionId(u.page, u.headings),
      ...u,
      prev: units[i - 1]?.text ?? '',
    };
  });
}

/** All units of all in-scope pages, with IDs. */
export function loadUnits(root = PAGES) {
  const units = [];
  const slugs = new Map();
  for (const page of specPages(root)) {
    const s = pageSlug(page);
    if (slugs.has(s)) {
      throw new Error(`page slug "${s}" of ${page} collides with ${slugs.get(s)}`);
    }
    slugs.set(s, page);
    const md = readFileSync(join(root, page), 'utf8');
    units.push(...assignIds(pageUnits(page, md)));
  }
  return units;
}
