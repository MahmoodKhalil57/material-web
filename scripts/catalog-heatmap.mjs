/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Layers same-size screenshots of the /3.0/ pages (scripts/catalog-walk.mjs
// --shots) into a heatmap of what stays the same and what changes from page
// to page:
//
// - common.png: each pixel's most common color across the pages (the shared
//   layout, with the content that differs everywhere blurred into noise).
// - heatmap.png: the common image, dimmed, with each pixel colored by how
//   many pages differ from it there:
//     unchanged on every page    the dimmed common image
//     differs on a few pages     cyan: variations of the shared layout, the
//                                ones to keep or streamline (--rare, 10%)
//     differs on more pages      yellow to red, by the share of pages
// - outliers/<page>.png for the pages with the most cyan pixels: that page
//   with its own outlying pixels in cyan.
//
// It reports, per page, how many of the rare pixels it owns and where.
//
//   node scripts/catalog-heatmap.mjs <dir of .png> [--rare 0.1] [--top 8]
//     [--tolerance 24]

import {mkdirSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {basename, join} from 'node:path';
import {parseArgs} from 'node:util';
import {pathToFileURL} from 'node:url';
import {readPng, writePng} from './png.mjs';

/**
 * Builds the heatmap of `files` into `out`.
 * @param {string[]} files PNG paths, all the same size.
 * @param {string} out Output directory.
 * @param {{rare?: number, top?: number, tolerance?: number, log?: (line: string) => void}} options
 *   `tolerance`: colors closer than this (per channel, 0..255) count as the
 *   same. Text antialiasing differs by a few levels, so screenshots with
 *   text want ~24; without text, tonal surfaces a few levels apart (an
 *   indicator on its container) need ~2.
 * @return {{rows: Array<{page: string, pixels: number, box: number[]}>}}
 */
export function buildHeatmap(files, out, {rare = 0.1, top = 8, tolerance = 24, log = console.log} = {}) {
  const near = (data, i, color) =>
    Math.abs(data[i] - ((color >> 16) & 255)) <= tolerance &&
    Math.abs(data[i + 1] - ((color >> 8) & 255)) <= tolerance &&
    Math.abs(data[i + 2] - (color & 255)) <= tolerance;
  if (!files.length) throw new Error('no screenshots');
  const load = (file) => readPng(readFileSync(file));
  const first = load(files[0]);
  const {width, height} = first;
  const size = width * height;

  // Pass 1: each pixel's majority color (Boyer-Moore vote, near colors
  // agree), so nothing but one candidate per pixel is kept in memory.
  const candidate = new Uint32Array(size);
  const votes = new Uint16Array(size);
  for (const [n, file] of files.entries()) {
    const {data, width: w, height: h} = n ? load(file) : first;
    if (w !== width || h !== height) throw new Error(`${file}: ${w}x${h}, not ${width}x${height}`);
    for (let p = 0, i = 0; p < size; p++, i += 4) {
      if (!votes[p]) {
        candidate[p] = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
        votes[p] = 1;
      } else if (near(data, i, candidate[p])) {
        votes[p]++;
      } else {
        votes[p]--;
      }
    }
  }

  // Pass 2: per pixel, how many pages differ from it; per page, where.
  const differs = new Uint16Array(size);
  const masks = files.map((file) => {
    const {data} = load(file);
    const mask = new Uint8Array(size);
    for (let p = 0, i = 0; p < size; p++, i += 4) {
      if (!near(data, i, candidate[p])) {
        mask[p] = 1;
        differs[p]++;
      }
    }
    return mask;
  });

  const limit = Math.max(1, Math.floor(files.length * rare));
  const common = new Uint8Array(size * 4);
  const heat = new Uint8Array(size * 4);
  let stable = 0;
  let rarePixels = 0;
  for (let p = 0, i = 0; p < size; p++, i += 4) {
    const r = (candidate[p] >> 16) & 255;
    const g = (candidate[p] >> 8) & 255;
    const b = candidate[p] & 255;
    common.set([r, g, b, 255], i);
    const gray = Math.round((0.3 * r + 0.59 * g + 0.11 * b) * 0.35 + 40);
    const n = differs[p];
    if (!n) {
      stable++;
      heat.set([gray, gray, gray, 255], i);
    } else if (n <= limit) {
      rarePixels++;
      heat.set([0, 220, 255, 255], i);
    } else {
      // Yellow (just past the rare band) to red (every page).
      const t = (n - limit) / Math.max(1, files.length - limit);
      heat.set([255, Math.round(220 * (1 - t)), 0, 255], i);
    }
  }
  mkdirSync(join(out, 'outliers'), {recursive: true});
  writeFileSync(join(out, 'common.png'), writePng({width, height, data: common}));
  writeFileSync(join(out, 'heatmap.png'), writePng({width, height, data: heat}));

  // Per page: the rare pixels it owns, and their bounding box.
  const rows = files.map((file, n) => {
    const mask = masks[n];
    let pixels = 0;
    let x0 = width;
    let y0 = height;
    let x1 = -1;
    let y1 = -1;
    for (let p = 0; p < size; p++) {
      if (!mask[p] || differs[p] > limit) continue;
      pixels++;
      const x = p % width;
      const y = (p / width) | 0;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    return {page: basename(file, '.png'), file, n, pixels, box: pixels ? [x0, y0, x1, y1] : []};
  });
  const ranked = rows.filter((r) => r.pixels).sort((a, b) => b.pixels - a.pixels);
  for (const row of ranked.slice(0, top)) {
    const {data} = load(row.file);
    const mask = masks[row.n];
    for (let p = 0, i = 0; p < size; p++, i += 4) {
      if (mask[p] && differs[p] <= limit) data.set([0, 220, 255, 255], i);
    }
    writeFileSync(join(out, 'outliers', `${row.page}.png`), writePng({width, height, data}));
  }

  const pct = (n) => `${((100 * n) / size).toFixed(1)}%`;
  log(`\nheatmap of ${files.length} pages (${width}x${height}): ${out}`);
  log(`  unchanged on every page ${pct(stable)}, differs on ${limit} or fewer pages (cyan) ${pct(rarePixels)}, on more ${pct(size - stable - rarePixels)}`);
  if (ranked.length) {
    log(`  pages owning the cyan pixels (x0,y0-x1,y1):`);
    for (const row of ranked.slice(0, top)) {
      log(`  ${String(row.pixels).padStart(8)} px  ${row.box.slice(0, 2).join(',')}-${row.box.slice(2).join(',')}  ${row.page}`);
    }
  }
  return {rows};
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const {values, positionals} = parseArgs({
    allowPositionals: true,
    options: {
      rare: {type: 'string', default: '0.1'},
      top: {type: 'string', default: '8'},
      tolerance: {type: 'string', default: '24'},
    },
  });
  const dir = positionals[0];
  if (!dir) throw new Error('usage: node scripts/catalog-heatmap.mjs <dir of .png>');
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.png'))
    .sort()
    .map((f) => join(dir, f));
  buildHeatmap(files, join(dir, 'heatmap'), {
    rare: Number(values.rare),
    top: Number(values.top),
    tolerance: Number(values.tolerance),
  });
}
