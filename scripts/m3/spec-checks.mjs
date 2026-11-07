#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Computes spec coverage from citations.
 *
 * 1. Splits every in-scope spec page into units (spec-units.mjs): sentences,
 *    list items, table rows and image captions, each with a stable ID.
 * 2. Classifies each unit with Clef (OpenRouter Decisions API): is it
 *    something the component library must build (`buildable`, 0..1), and of
 *    what kind. Results are cached in `.m3-specs/spec-checks/classified.jsonl`
 *    keyed by unit ID, so only new or changed units are classified.
 * 3. With `--extract`, pulls subject / condition / keys / dp values out of
 *    each buildable unit with Clairic (cached in `extracted.jsonl`).
 * 4. Scans `labs/gb/` and `scripts/m3/` for citations.
 * 5. Reduces the rest mechanically (spec-autocite.mjs, no LLM): units that
 *    state no requirement (`not-a-requirement`, by named rules), units whose
 *    values and subject match the component's resolved tokens (`auto-token`),
 *    captions of fully token-covered Specs sections (`auto-section`), and
 *    clusters of identical / near-identical text (citing one member covers
 *    the cluster). Writes `scripts/m3/spec-autocite.json` (IDs and evidence
 *    only) and one review file per page, with candidate code locations, to
 *    `.m3-specs/spec-checks/pages/`.
 * 6. Reports every buildable unit still uncovered, and citations of IDs that
 *    no longer exist (the spec changed).
 *
 * Coverage comes only from citations: a comment whose text starts with
 * `spec:` followed by unit or section IDs, comma separated, e.g.
 *
 *   // spec: <unit-id>, <page-slug>/<heading-slug>/<subheading-slug>
 *   <!-- spec: <unit-id> -->
 *
 * (unit IDs look like `sliders-` + 6 hex digits, section IDs like
 * `sliders/accessibility/keyboard-navigation`).
 *
 * A section ID covers every unit in the section and its subsections. Find IDs
 * in the report or with `--find`.
 *
 *   node scripts/m3/spec-checks.mjs                 # classify new units, report
 *   node scripts/m3/spec-checks.mjs --extract       # also run Clairic
 *   node scripts/m3/spec-checks.mjs --offline       # no API calls (cache only)
 *   node scripts/m3/spec-checks.mjs --limit 100     # at most 100 API calls
 *   node scripts/m3/spec-checks.mjs --summary       # print the summary (markdown)
 *   node scripts/m3/spec-checks.mjs --find "Page up"  # look up unit IDs
 *
 * Without `OPENROUTER_API_KEY`, classification is skipped and the report
 * counts the units that are still unclassified.
 *
 * Writes `.m3-specs/spec-checks/{report.md,report.json,units.json}`.
 */

import {existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, appendFileSync} from 'node:fs';
import {basename, join, relative, sep} from 'node:path';
import {loadUnits} from './spec-units.mjs';
import {FatalApiError, hasKey, post, usage} from './openrouter.mjs';
import {AUTOCITE_FILE, autocite} from './spec-autocite.mjs';

const OUT = '.m3-specs/spec-checks';
const CLASSIFIED = join(OUT, 'classified.jsonl');
const EXTRACTED = join(OUT, 'extracted.jsonl');
const SCAN = ['labs/gb', 'scripts/m3'];

/** Units at or above this `buildable` score must be cited. */
const THRESHOLD = 0.3;
const CONCURRENCY = 24;

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const offline = flag('--offline');
const extract = flag('--extract');
const summaryOnly = flag('--summary');
const limit = Number(option('--limit') ?? Infinity);
const find = option('--find');

const log = (...args) => (summaryOnly ? console.error : console.log)(...args);

const units = loadUnits();
const byId = new Map(units.map((u) => [u.id, u]));

if (find !== undefined) {
  const re = new RegExp(find, 'i');
  for (const u of units) {
    if (re.test(u.text) || re.test(u.heading)) {
      console.log(`${u.id}  [${u.section}]\n    ${u.kind}: ${u.text.slice(0, 200)}`);
    }
  }
  process.exit(0);
}

mkdirSync(OUT, {recursive: true});
const classified = readJsonl(CLASSIFIED);
const extracted = readJsonl(EXTRACTED);

// --- Classification (Clef) --------------------------------------------------

const QUESTIONS = {
  buildable: {
    type: 'noul',
    instructions:
      'The spec text states something a web UI component library itself must implement or expose: a component variant or configuration, an anatomy part, a state, a behavior or interaction, a keyboard or screen-reader rule, a responsive/adaptive rule, a motion rule, a measurement, or a theming capability. Answer no for advice to app designers about when or how to use a component, writing or content guidance, marketing text, examples of app use cases, or plain descriptions with no requirement.',
  },
  kind: {
    type: 'choice',
    instructions: 'What kind of statement is it?',
    criteria: {
      variant_or_anatomy: null,
      behavior: null,
      keyboard_or_screen_reader: null,
      adaptive_layout: null,
      motion: null,
      visual_measurement: null,
      theming: null,
      usage_advice: null,
      description: null,
    },
  },
};

/** Clef reads roughly the first 2K tokens of the state; keep it short. */
function clefState(u) {
  return [
    `Material 3 spec page: ${u.page}`,
    `Section: ${u.heading}`,
    u.kind === 'list-item' || u.kind === 'table-row' ? `Preceding text: ${u.prev.slice(0, 300)}` : '',
    `Spec text (${u.kind}): ${u.text.slice(0, 1200)}`,
  ].filter(Boolean);
}

const FIELDS = {
  subject: {type: 'text', instructions: 'Which element, variant or part the requirement is about, copied from the Requirement'},
  condition: {
    type: 'text',
    instructions: 'When or under what circumstances it applies (the trigger, input, window size or state), copied from the Requirement',
  },
  keys: {type: 'list', items: 'text', instructions: 'Individual keyboard keys, e.g. Tab, Enter, Page up'},
  values_dp: {type: 'list', items: 'number', instructions: 'Sizes or distances in dp'},
};

function clairicState(u) {
  return [
    `Component: ${basename(u.page, '.md')}`,
    // Tab headings ("Tab 1") read as the Tab key.
    `Section: ${u.headings.slice(1).filter((h) => !/^Tab \d+$/.test(h)).join(' > ')}`,
    `Requirement: ${u.text}`,
  ].join('\n');
}

const isBuildable = (u) => (classified.get(u.id)?.buildable ?? -1) >= THRESHOLD;

let apiNote = '';
let budget = limit;
if (offline) apiNote = 'offline: no API calls';
else if (!hasKey()) apiNote = 'OPENROUTER_API_KEY not set: classification skipped';
else {
  const todo = units.filter((u) => !classified.has(u.id));
  if (todo.length) log(`Classifying ${todo.length} new units with Clef...`);
  await pool(todo, CLASSIFIED, classified, async (u) => {
    const r = await post('decisions', {model: 'cloudflare/clef', state: clefState(u), questions: QUESTIONS});
    return {
      id: u.id,
      buildable: r.answers.buildable.noul,
      kind: r.answers.kind.choice,
      kindConf: r.answers.kind.confidence,
    };
  });
  if (extract && !apiNote) {
    const todo = units.filter((u) => isBuildable(u) && !extracted.has(u.id));
    if (todo.length) log(`Extracting ${todo.length} buildable units with Clairic...`);
    await pool(todo, EXTRACTED, extracted, async (u) => {
      const r = await post('extractions', {model: 'cloudflare/clairic', state: clairicState(u), fields: FIELDS});
      const out = {id: u.id};
      for (const k of Object.keys(FIELDS)) out[k] = r.answers?.[k]?.value ?? null;
      return out;
    });
  }
}

/**
 * Runs `fn` over `items` with CONCURRENCY workers, appending each result to
 * `file` (so an interrupted run resumes) and to `cache`. Stops on the first
 * error retrying cannot fix, or when the call budget runs out.
 */
async function pool(items, file, cache, fn) {
  let i = 0;
  let errors = 0;
  let done = 0;
  async function worker() {
    while (i < items.length && !apiNote) {
      if (budget <= 0) {
        apiNote = `--limit reached`;
        return;
      }
      budget--;
      const item = items[i++];
      try {
        const result = await fn(item);
        cache.set(result.id, result);
        appendFileSync(file, JSON.stringify(result) + '\n');
      } catch (err) {
        if (err instanceof FatalApiError) {
          apiNote = `API error, stopped: ${err.message.slice(0, 200)}`;
          return;
        }
        if (++errors <= 5) log(`  ${item.id}: ${err.message}`);
      }
      if (++done % 500 === 0) log(`  ${done}/${items.length} $${usage.cost.toFixed(3)}`);
    }
  }
  await Promise.all(Array.from({length: CONCURRENCY}, worker));
}

// Keep only current units in the caches (they are keyed by text hash, so a
// changed sentence is a new ID; the old entry would never be read again).
writeJsonl(CLASSIFIED, units.map((u) => classified.get(u.id)).filter(Boolean));
writeJsonl(EXTRACTED, units.map((u) => extracted.get(u.id)).filter(Boolean));

// --- Citations ----------------------------------------------------------------

const slugs = new Set(units.map((u) => u.slug));
const sections = new Map(); // section ID -> units in it and its subsections
for (const u of units) {
  const parts = u.section.split('/');
  for (let n = 2; n <= parts.length; n++) {
    const s = parts.slice(0, n).join('/');
    if (!sections.has(s)) sections.set(s, []);
    sections.get(s).push(u);
  }
}

const citations = scanCitations();
const cited = new Map(); // unit ID -> [file:line]
const stale = [];
for (const c of citations) {
  const hit = byId.has(c.id) ? [byId.get(c.id)] : sections.get(c.id);
  if (!hit) {
    stale.push(c);
    continue;
  }
  for (const u of hit) {
    if (!cited.has(u.id)) cited.set(u.id, []);
    cited.get(u.id).push(c.where);
  }
}

function scanCitations() {
  const out = [];
  const files = [];
  for (const root of SCAN) walk(root, files);
  const present = new Set(files);
  for (const file of files) {
    // Compiled output of a TypeScript source cites the same thing.
    if (/\.js$/.test(file) && present.has(file.replace(/\.js$/, '.ts'))) continue;
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, n) => {
      const m = line.match(/(?:\/\/|\/\*+|<!--|^\s*\*|^\s*#)\s*spec:\s*(.*)/);
      if (!m) return;
      const list = m[1].replace(/\s*(\*\/|-->).*$/, '');
      for (const token of list.split(/[\s,]+/)) {
        if (looksLikeId(token)) out.push({id: token, where: `${file}:${n + 1}`});
      }
    });
  }
  return out;
}

function looksLikeId(token) {
  if (/^[a-z0-9-]+(\/[a-z0-9-]+)+$/.test(token)) return true;
  const m = token.match(/^([a-z0-9-]+)-([0-9a-f]{6,})$/);
  return Boolean(m && (slugs.has(m[1]) || /\d/.test(m[2])));
}

function walk(dir, files) {
  for (const e of readdirSync(dir, {withFileTypes: true})) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.(ts|js|mjs|scss|css|md|html)$/.test(e.name) && !/\.(d\.ts|cssresult\.js)$/.test(e.name)) {
      files.push(relative('.', p).split(sep).join('/'));
    }
  }
}

// --- Mechanical reduction -------------------------------------------------------

const {status} = await autocite({units, isBuildable, classified, extracted, cited});

// --- Report -------------------------------------------------------------------

const pages = new Map();
for (const u of units) {
  if (!pages.has(u.page)) {
    pages.set(u.page, {
      page: u.page,
      slug: u.slug,
      units: 0,
      classified: 0,
      buildable: 0,
      cited: 0,
      autoToken: 0,
      autoSection: 0,
      notARequirement: 0,
      clusters: 0,
      uncovered: [],
    });
  }
  const p = pages.get(u.page);
  p.units++;
  if (classified.has(u.id)) p.classified++;
  if (!isBuildable(u)) continue;
  p.buildable++;
  const s = status.get(u.id);
  if (s.status === 'cited') p.cited++;
  else if (s.status === 'auto-token') p.autoToken++;
  else if (s.status === 'auto-section') p.autoSection++;
  else if (s.status === 'not-a-requirement') p.notARequirement++;
  else {
    p.uncovered.push(u);
    if (!s.rep) p.clusters++;
  }
}
const pageList = [...pages.values()];
const total = (k) => pageList.reduce((n, p) => n + (Array.isArray(p[k]) ? p[k].length : p[k]), 0);
const totals = {
  units: units.length,
  classified: total('classified'),
  buildable: total('buildable'),
  cited: total('cited'),
  autoToken: total('autoToken'),
  autoSection: total('autoSection'),
  notARequirement: total('notARequirement'),
  uncovered: total('uncovered'),
  clusters: total('clusters'),
  citations: citations.length,
  stale: stale.length,
};
const cost = {calls: usage.calls, usd: Number(usage.cost.toFixed(5))};

const md = [];
md.push('# Spec coverage (computed from citations)\n');
md.push(...summaryLines());
md.push('\n## Uncovered buildable units\n');
md.push('Grouped by page, then section. Cite a unit or a whole section (`<!-- spec: <section> -->` style comments work in markdown). Per-page review files with candidate code locations, one line per cluster of duplicate text: `.m3-specs/spec-checks/pages/index.md`.\n');
for (const p of pageList.filter((p) => p.uncovered.length)) {
  md.push(`### ${p.page} (${p.uncovered.length} of ${p.buildable} uncovered)\n`);
  let section;
  for (const u of p.uncovered) {
    if (u.section !== section) {
      section = u.section;
      md.push(`\n**${u.headings.slice(1).join(' > ') || '(intro)'}** \`${u.section}\`\n`);
    }
    const x = extracted.get(u.id);
    const extra = x ? [x.keys?.length ? `keys: ${x.keys.join(', ')}` : '', x.values_dp?.length ? `dp: ${x.values_dp.join(', ')}` : ''].filter(Boolean).join('; ') : '';
    const c = classified.get(u.id);
    const rep = status.get(u.id).rep;
    md.push(`- \`${u.id}\` _${c.kind}_ ${c.buildable.toFixed(2)}: ${oneLine(u.text, 400)}${extra ? ` (${extra})` : ''}${rep ? ` (same text as \`${rep}\`)` : ''}`);
  }
  md.push('');
}
writeFileSync(join(OUT, 'report.md'), md.join('\n') + '\n');
writeFileSync(
  join(OUT, 'report.json'),
  JSON.stringify(
    {
      threshold: THRESHOLD,
      totals,
      cost,
      api: apiNote || 'ok',
      stale,
      pages: pageList.map((p) => ({
        ...p,
        uncovered: p.uncovered.map((u) => ({
          id: u.id,
          section: u.section,
          heading: u.heading,
          kind: classified.get(u.id).kind,
          buildable: classified.get(u.id).buildable,
          text: u.text,
          ...(status.get(u.id).rep ? {rep: status.get(u.id).rep} : {}),
          ...(status.get(u.id).cluster ? {cluster: status.get(u.id).cluster} : {}),
          ...(status.get(u.id).candidates ? {candidates: status.get(u.id).candidates} : {}),
          ...(extracted.has(u.id) ? {extracted: extracted.get(u.id)} : {}),
        })),
      })),
      unclassified: units.filter((u) => !classified.has(u.id)).map((u) => u.id),
    },
    null,
    1,
  ),
);
writeFileSync(
  join(OUT, 'units.json'),
  JSON.stringify(
    units.map((u) => ({
      id: u.id,
      section: u.section,
      page: u.page,
      heading: u.heading,
      kind: u.kind,
      text: u.text,
      buildable: classified.get(u.id)?.buildable ?? null,
      class: classified.get(u.id)?.kind ?? null,
      cited: cited.get(u.id) ?? [],
      status: status.get(u.id)?.status ?? null,
      rule: status.get(u.id)?.rule ?? null,
      evidence: status.get(u.id)?.evidence ?? null,
    })),
  ),
);

if (summaryOnly) console.log(summaryLines().join('\n'));
else {
  console.log(summaryLines().join('\n'));
  console.log(`\nFull report: ${join(OUT, 'report.md')}`);
}

function summaryLines() {
  const lines = [];
  const unclassified = totals.units - totals.classified;
  lines.push(
    `- ${totals.units} spec units on ${pageList.length} pages; ${totals.classified} classified` +
      (unclassified ? ` (**${unclassified} unclassified**: ${apiNote || 'API errors'})` : '') +
      `; ${totals.buildable} buildable (Clef score >= ${THRESHOLD}).`,
  );
  lines.push(
    `- Buildable units: ${totals.cited} cited (directly or through a cited cluster member), ${totals.autoToken} auto-token, ${totals.autoSection} auto-section, ${totals.notARequirement} not a requirement, **${totals.uncovered} uncovered** (${totals.clusters} after merging duplicate text); ${totals.citations} citations scanned in ${SCAN.join(', ')}. Auto statuses, rules and evidence: \`${AUTOCITE_FILE}\`.`,
  );
  lines.push(`- API this run: ${cost.calls} calls, $${cost.usd}${apiNote ? ` (${apiNote})` : ''}.`);
  lines.push('', '| Page | Buildable | Cited | Auto-token | Auto-section | Not a req. | Uncovered | Clusters |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  const top = [...pageList].sort((a, b) => b.clusters - a.clusters).slice(0, 20);
  for (const p of top) {
    lines.push(`| ${p.page} | ${p.buildable} | ${p.cited} | ${p.autoToken} | ${p.autoSection} | ${p.notARequirement} | ${p.uncovered.length} | ${p.clusters} |`);
  }
  if (pageList.length > 20) lines.push(`| (${pageList.length - 20} more pages) | | | | | | | |`);
  lines.push('');
  if (stale.length) {
    lines.push(`**${stale.length} stale citations** (IDs no longer in the spec; re-cite the changed text):`, '');
    for (const s of stale.slice(0, 50)) lines.push(`- \`${s.id}\` at ${s.where}`);
    if (stale.length > 50) lines.push(`- ... ${stale.length - 50} more in ${join(OUT, 'report.json')}`);
  } else lines.push('No stale citations.');
  lines.push(
    '',
    `Full list: \`${join(OUT, 'report.md').split(sep).join('/')}\`. Cite with a \`spec:\` comment listing unit or section IDs; find IDs with \`node scripts/m3/spec-checks.mjs --find <regex>\`.`,
  );
  return lines;
}

// --- Helpers ------------------------------------------------------------------

function readJsonl(file) {
  const map = new Map();
  if (!existsSync(file)) return map;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      map.set(row.id, row);
    } catch {
      // A line cut short by an interrupted run.
    }
  }
  return map;
}

function writeJsonl(file, rows) {
  writeFileSync(file, rows.map((r) => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : ''));
}

function oneLine(text, max) {
  const t = text.replace(/\|/g, '\\|');
  return t.length > max ? `${t.slice(0, max)}…` : t;
}
