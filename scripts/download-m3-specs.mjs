#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Downloads the Material Design 3 guidelines from https://m3.material.io into
 * a local, gitignored folder so they can be turned into tests.
 *
 * m3.material.io is a client-rendered Angular app, so mirroring the HTML is
 * useless. Instead this script reads the same JSON the app fetches:
 *
 *   - Page routes + content ids are embedded in the main JS bundle.
 *   - Page content:  /_dsm/content/m3/<carbonVersion>/<fileId>.json
 *   - Token tables:  /_dsm/data/dsdb-m3/<carbonVersion>/TOKEN_TABLE.<id>.json
 *
 * Output (default `.m3-specs/`):
 *
 *   manifest.json                  version, every route, fetch status
 *   pages/<slug>.json              raw page content
 *   pages/<slug>.md                readable text extraction of the page
 *   tokens/raw/<id>.json           raw token database export (can be ~20MB)
 *   tokens/<set>.json              flattened tokens, grouped by token set
 *                                  (e.g. md.comp.button.filled.json)
 *
 * Usage:
 *   node scripts/download-m3-specs.mjs [--out .m3-specs] [--only components]
 *        [--concurrency 4] [--force]
 *
 * `--only` keeps routes whose slug starts with the given prefix (repeatable).
 * `--force` re-downloads files that already exist.
 */

import {mkdir, readFile, stat, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';

const ORIGIN = 'https://m3.material.io';
const UA = 'material-web-spec-downloader (+https://github.com/material-components/material-web)';

const args = parseArgs(process.argv.slice(2));
const OUT = args.out ?? '.m3-specs';
const CONCURRENCY = Number(args.concurrency ?? 4);
const ONLY = [].concat(args.only ?? []);
let FORCE = Boolean(args.force);
// Mirrors robots.txt disallow rules.
const DISALLOWED = [/^archive/, /^search\.html/];

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

async function main() {
  console.log(`Fetching ${ORIGIN} ...`);
  const indexHtml = await fetchText(`${ORIGIN}/`);
  const mainSrc = indexHtml.match(/src="(\/static\/angular\/main\.[^"]+\.js)"/)?.[1];
  if (!mainSrc) throw new Error('Could not find main bundle in index.html');
  const bundle = await fetchText(ORIGIN + mainSrc);

  const carbonVersion = args.version ?? bundle.match(/carbonVersion:"([^"]+)"/)?.[1];
  if (!carbonVersion) throw new Error('Could not find carbonVersion in bundle');
  const routes = extractRoutes(bundle);
  console.log(`Content version ${carbonVersion}, ${routes.length} routes.`);

  // Cached files are only valid for the content version they came from.
  try {
    const previous = JSON.parse(await readFile(join(OUT, 'manifest.json'), 'utf8'));
    if (previous.carbonVersion !== carbonVersion) {
      console.log(`Content changed since ${previous.carbonVersion}; re-downloading everything.`);
      FORCE = true;
    }
  } catch {
    // First download.
  }

  const selected = routes.filter(
    (r) =>
      r.exportedCarbonFileId &&
      !DISALLOWED.some((re) => re.test(r.slug)) &&
      (ONLY.length === 0 || ONLY.some((p) => r.slug.startsWith(p))),
  );
  console.log(`Downloading ${selected.length} pages to ${OUT}/ ...`);

  const tokenResources = new Map(); // id -> [slugs]
  const otherModules = new Map(); // "TYPE.id" -> [slugs]
  const results = await pool(selected, CONCURRENCY, async (route) => {
    const slug = route.slug || 'index';
    const jsonPath = join(OUT, 'pages', `${slug}.json`);
    try {
      let page;
      if (!FORCE && (await exists(jsonPath))) {
        page = JSON.parse(await readFile(jsonPath, 'utf8'));
      } else {
        page = await fetchJson(
          `${ORIGIN}/_dsm/content/m3/${carbonVersion}/${route.exportedCarbonFileId}`,
        );
        await writeOut(jsonPath, JSON.stringify(page, null, 2));
      }
      await writeOut(join(OUT, 'pages', `${slug}.md`), pageToMarkdown(page, route));
      for (const chunk of iterChunks(page)) {
        const {libraryModuleType: type, resourceName} = chunk;
        if (!type || !resourceName) continue;
        if (type === 'TOKEN_TABLE') {
          const id = resourceName.split('components/')[1];
          if (id) push(tokenResources, id, slug);
        } else if (type !== 'STATUS_TABLE') {
          const id = resourceName.split('/')[1];
          if (id) push(otherModules, `${type}.${id}`, slug);
        }
      }
      console.log(`  ok   ${slug}`);
      return {slug, ok: true};
    } catch (err) {
      console.warn(`  FAIL ${slug}: ${err.message}`);
      return {slug, ok: false, error: err.message};
    }
  });

  console.log(`Downloading ${tokenResources.size} token tables ...`);
  const tokenSets = new Map(); // tokenSetName -> {tokenName: entry}
  await pool([...tokenResources.keys()], 2, async (id) => {
    const rawPath = join(OUT, 'tokens', 'raw', `${id}.json`);
    try {
      let raw;
      if (!FORCE && (await exists(rawPath))) {
        raw = await readFile(rawPath, 'utf8');
      } else {
        raw = await fetchText(
          `${ORIGIN}/_dsm/data/dsdb-m3/${carbonVersion}/TOKEN_TABLE.${id}.json`,
        );
        await writeOut(rawPath, raw);
      }
      flattenTokens(JSON.parse(raw).system, tokenSets);
      console.log(`  ok   tokens ${id} (${tokenResources.get(id).join(', ')})`);
    } catch (err) {
      console.warn(`  FAIL tokens ${id}: ${err.message}`);
    }
  });
  for (const [setName, tokens] of tokenSets) {
    const sorted = Object.fromEntries(
      Object.entries(tokens).sort(([a], [b]) => a.localeCompare(b)),
    );
    await writeOut(join(OUT, 'tokens', `${setName}.json`), JSON.stringify(sorted, null, 2));
  }

  await pool([...otherModules.keys()], 2, async (key) => {
    const path = join(OUT, 'modules', `${key}.json`);
    if (!FORCE && (await exists(path))) return;
    try {
      await writeOut(path, await fetchText(`${ORIGIN}/_dsm/data/dsdb-m3/${carbonVersion}/${key}.json`));
    } catch (err) {
      console.warn(`  FAIL module ${key}: ${err.message}`);
    }
  });

  // "get-started" is not a carbon page; the app loads it from a CMS endpoint.
  if (ONLY.length === 0 || ONLY.some((p) => 'get-started'.startsWith(p))) {
    try {
      const guide = await fetchText(`${ORIGIN}/guide-page-content`);
      await writeOut(join(OUT, 'pages', 'get-started.json'), guide);
      results.push({slug: 'get-started', ok: true});
    } catch (err) {
      results.push({slug: 'get-started', ok: false, error: err.message});
    }
  }

  const failed = results.filter((r) => !r.ok);
  await writeOut(
    join(OUT, 'manifest.json'),
    JSON.stringify(
      {
        source: ORIGIN,
        carbonVersion,
        downloadedAt: new Date().toISOString(),
        routes,
        tokenTables: Object.fromEntries(tokenResources),
        tokenSets: [...tokenSets.keys()].sort(),
        failed,
      },
      null,
      2,
    ),
  );
  console.log(
    `Done: ${results.length - failed.length}/${results.length} pages, ` +
      `${tokenSets.size} token sets. Output in ${OUT}/`,
  );
  if (failed.length) process.exitCode = 1;
}

/**
 * The route table is an inlined `JSON.parse('{"v":[...]}')` in the bundle.
 * Several such tables exist; the routes one has `exportedCarbonFileId`s.
 */
function extractRoutes(bundle) {
  const marker = `JSON.parse('{"v":[{"slug"`;
  for (let at = bundle.indexOf(marker); at >= 0; at = bundle.indexOf(marker, at + 1)) {
    const routes = parseInlineJson(bundle, at + "JSON.parse('".length).v;
    if (routes.some((r) => 'exportedCarbonFileId' in r)) return routes;
  }
  throw new Error('Could not find route table in bundle');
}

function parseInlineJson(bundle, i) {
  let literal = '';
  for (; i < bundle.length; i++) {
    const c = bundle[i];
    if (c === '\\') {
      const n = bundle[++i];
      // Undo JS single-quoted string escaping without evaluating code.
      literal += n === "'" ? "'" : n === '\\' ? '\\\\' : n === 'n' ? '\\n' : '\\' + n;
    } else if (c === "'") {
      break;
    } else {
      literal += c;
    }
  }
  return JSON.parse(literal);
}

function* iterChunks(page) {
  for (const section of page.sections ?? []) {
    for (const block of section.contentBlocks ?? []) {
      yield* block.contentChunks ?? [];
    }
  }
}

function pageToMarkdown(page, route) {
  const lines = [
    `# ${page.headerTitle || page.title || route.slug}`,
    '',
    `Source: ${ORIGIN}/${route.slug}`,
    `Updated: ${page.updatedTimestamp ?? 'unknown'}`,
    '',
  ];
  if (page.description) lines.push(htmlToText(page.description), '');
  for (const section of page.sections ?? []) {
    if (section.isVisible === false) continue;
    if (section.name) lines.push(`## ${section.name}`, '');
    for (const block of section.contentBlocks ?? []) {
      if (block.isHidden) continue;
      if (block.title) lines.push(`### ${htmlToText(block.title)}`, '');
      for (const chunk of block.contentChunks ?? []) {
        if (chunk.htmlValue) lines.push(htmlToText(chunk.htmlValue), '');
        if (chunk.snippetCode) {
          lines.push('```' + (chunk.snippetLanguage ?? ''), chunk.snippetCode, '```', '');
        }
        const media = chunk.imageUrl || chunk.videoUrl;
        if (media || chunk.altText) {
          lines.push(`[${chunk.contentChunkType}: ${chunk.altText || ''}](${media || ''})`);
        }
        if (chunk.libraryModuleType) {
          lines.push(`[${chunk.libraryModuleType}: ${chunk.resourceName ?? ''}]`);
        }
        if (chunk.footer) lines.push('', htmlToText(chunk.footer));
        if (media || chunk.altText || chunk.libraryModuleType || chunk.footer) lines.push('');
      }
    }
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

function htmlToText(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<h([1-6])[^>]*>/gi, (_, n) => '\n' + '#'.repeat(Math.min(6, Number(n) + 1)) + ' ')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/(p|div|ul|ol|tr|table)>/gi, '\n')
    .replace(/<(td|th)[^>]*>/gi, ' | ')
    .replace(/<a [^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<(strong|b)>(.*?)<\/\1>/gi, '**$2**')
    .replace(/<code>(.*?)<\/code>/gi, '`$1`')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Flattens a design system export into
 * `{tokenSetName: {tokenName: {type, deprecated?, contexts: [...]}}}`.
 * Each context lists the context tags it applies to (e.g. theme=dark) and
 * either a reference (`ref`) to another token or a literal `value`.
 */
function flattenTokens(system, out) {
  const tagNames = new Map();
  for (const g of system.contextTagGroups ?? []) tagNames.set(g.name, g.contextTagGroupName);
  for (const t of system.tags ?? []) {
    const group = tagNames.get(t.name.split('/tags/')[0]) ?? 'unknown';
    tagNames.set(t.name, [group, t.tagName ?? t.displayName]);
  }
  const values = new Map((system.values ?? []).map((v) => [v.name, v]));
  const setNames = new Map(
    (system.tokenSets ?? []).map((s) => [s.name, s.tokenSetName ?? s.displayName]),
  );
  const trees = system.contextualReferenceTrees ?? {};
  const META = new Set([
    'name', 'tokenName', 'revisionId', 'revisionCreateTime', 'state',
    'createTime', 'contextTags', 'specificityScore',
  ]);

  for (const token of system.tokens ?? []) {
    if (token.state && token.state !== 'ACTIVE') continue;
    const setName = setNames.get(token.name.split('/tokens/')[0]) ?? 'unknown';
    const contexts = [];
    for (const ctx of trees[token.name]?.contextualReferenceTree ?? []) {
      const tags = {};
      for (const tag of ctx.contextTags ?? []) {
        const [group, name] = tagNames.get(tag) ?? ['unknown', tag];
        tags[group] = name;
      }
      const tree = ctx.referenceTree ?? {};
      const entry = {tags};
      const ref = tree.childNodes?.[0]?.tokenName;
      if (ref) entry.ref = ref;
      const literal = values.get(tree.value?.name);
      if (literal) {
        const value = Object.fromEntries(
          Object.entries(literal).filter(([k]) => !META.has(k)),
        );
        if (Object.keys(value).length) entry.value = value;
        if (!ref && literal.tokenName) entry.ref = literal.tokenName;
      }
      if (ctx.resolvedValue && !ctx.resolvedValue.undefined) entry.resolved = ctx.resolvedValue;
      contexts.push(entry);
    }
    const set = out.get(setName) ?? {};
    out.set(setName, set);
    set[token.tokenName] = {
      type: token.tokenValueType,
      ...(token.deprecationMessage ? {deprecated: token.deprecationMessage.message} : {}),
      contexts,
    };
  }
}

async function fetchText(url, attempt = 0) {
  const res = await fetch(url, {headers: {'user-agent': UA}});
  if (res.status === 429 || res.status >= 500) {
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      return fetchText(url, attempt + 1);
    }
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

async function writeOut(path, data) {
  await mkdir(dirname(path), {recursive: true});
  await writeFile(path, data);
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function push(map, key, value) {
  const list = map.get(key) ?? [];
  if (!list.includes(value)) list.push(value);
  map.set(key, list);
}

async function pool(items, size, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({length: Math.min(size, items.length)}, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]);
      }
    }),
  );
  return results;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const m = argv[i].match(/^--([^=]+)(?:=(.*))?$/);
    if (!m) continue;
    const [, key, inline] = m;
    const value =
      inline ?? (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true);
    out[key] = key in out ? [].concat(out[key], value) : value;
  }
  return out;
}
