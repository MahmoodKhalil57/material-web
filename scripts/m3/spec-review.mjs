#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Opt-in LLM review of the uncovered spec units (one per cluster), run by
 * `node scripts/m3/spec-checks.mjs --review` or standalone.
 *
 * Two providers (`--provider`, default `anthropic`):
 *
 * - `anthropic`: `claude-haiku-5-5` via `@anthropic-ai/sdk` (key from
 *   `ANTHROPIC_API_KEY`), structured output (JSON schema), effort `--effort`
 *   (default EFFORT). Units are grouped by gb component directory; the
 *   system prompt is the fixed reviewer instructions plus that component's
 *   full source (every .ts / .scss outside demo/, no tests or generated
 *   files, plus the small `../shared/` files it imports), line-numbered and
 *   prompt-cached. The user message is the spec sentence, page, heading path
 *   and the keyword candidates (spec-autocite.mjs) as hints. Per component
 *   the first unit is sent alone (to write the cache), the rest with 32
 *   concurrent requests. Foundation pages (no component dir) and components
 *   over ~90K tokens get the snippet prompt below instead.
 * - `openrouter`: `deepseek/deepseek-v4-flash` (OpenRouter chat completions,
 *   JSON mode, temperature 0, key from `OPENROUTER_API_KEY`) with the code
 *   around the unit's top-3 keyword candidates, line-numbered (prompt 1/2).
 *
 * Either way the model answers `covered` / `gap` / `not-applicable` with a
 * file, line and an exact quote. Nothing the model says is trusted as is: a
 * `covered` verdict counts only when the quote (whitespace-normalized) is in
 * a shown file within ±5 lines of the cited line, inside the shown code, and
 * is not only comments; otherwise it becomes `unverified` (treated like
 * `gap`).
 *
 * Verdicts are cached in `.m3-specs/spec-checks/review.jsonl`, keyed by unit
 * ID + a hash of the prompt (prompt version, model, effort, file list and
 * code shown), so each model's verdicts are cached separately and a unit is
 * reviewed again only when it or the code shown changes.
 *
 * REVIEW_MODE `agree` (default): two-model agreement. The first reviewer
 * (`--provider`, default Haiku) reviews every unit; units it judges covered
 * (verified quote) get a second review by `--second` (default
 * `claude-sonnet-5-5`, effort `--second-effort`, default SECOND_EFFORT) with
 * byte-identical instructions (prompt 3) and the same code. A unit is
 * `auto-review` only when both verdicts are covered and both quotes verify
 * (they may cite different lines); the evidence names both models, both
 * file:line and both quote hashes. Disagreements, gaps, unverified quotes and
 * every `not-applicable` verdict (labelled "model: not applicable?", the
 * model's reason kept as a note) go to the review queue
 * `.m3-specs/spec-checks/review-gaps/<component>.md`. `not-applicable` never
 * sets a status unless ACCEPT_NOT_APPLICABLE is switched on (off by default;
 * see there). spec-autocite.mjs applies the verdicts (IDs and evidence only
 * in `scripts/m3/spec-autocite.json`).
 *
 *   node scripts/m3/spec-review.mjs                # review uncovered units of the last report
 *   node scripts/m3/spec-review.mjs --limit 50     # at most 50 API calls
 *   node scripts/m3/spec-review.mjs --gold <file>  # calibration: [{id, expect: gap|covered}]
 *   node scripts/m3/spec-review.mjs --max-usd 5    # stop when spend passes $5 (default)
 *   node scripts/m3/spec-review.mjs --prompt 1     # openrouter prompt version (default PROMPT)
 *   node scripts/m3/spec-review.mjs --provider openrouter   # DeepSeek instead of Claude
 *   node scripts/m3/spec-review.mjs --effort medium         # anthropic effort (default EFFORT)
 *   node scripts/m3/spec-review.mjs --second claude-sonnet-5-5 --second-effort medium  # second reviewer (agree mode)
 *   node scripts/m3/spec-review.mjs --gold <file> --reviewer second  # calibrate the second reviewer alone
 *
 * `--provider` and `--effort` are read from the command line of whichever
 * script imports this module, so they work with spec-checks.mjs too.
 *
 * Standalone runs only fill the cache (and the gap queue); run spec-checks.mjs
 * afterwards to apply the verdicts to the report.
 */

import {createHash} from 'node:crypto';
import {elementDir} from '../element-dirs.mjs';
import {appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import {FatalApiError, chat, usage} from './openrouter.mjs';

const cliArg = (name) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

export const PROVIDERS = {
  anthropic: {model: 'claude-haiku-5-5', keyVar: 'ANTHROPIC_API_KEY'},
  openrouter: {model: 'deepseek/deepseek-v4-flash', keyVar: 'OPENROUTER_API_KEY'},
};
/** `--provider anthropic|openrouter`. */
export const PROVIDER = cliArg('--provider') ?? 'anthropic';
if (!PROVIDERS[PROVIDER]) throw new Error(`--provider must be one of ${Object.keys(PROVIDERS).join(', ')}`);
export const MODEL = PROVIDERS[PROVIDER].model;
/** Anthropic `output_config.effort` (`--effort`). */
export const EFFORT = cliArg('--effort') ?? 'low';
/** Whether a provider's API key (default: the selected one) is in the environment. */
export const hasKey = (provider = PROVIDER) => Boolean(process.env[PROVIDERS[provider].keyVar]);

/** Second reviewer of agree mode (`--second`, an Anthropic model). */
export const SECOND_MODEL = cliArg('--second') ?? 'claude-sonnet-5-5';
/**
 * Effort of the second reviewer (`--second-effort`). Calibrated on the gold
 * set (scratch gold-set.json, 195 units) on 2026-11-07, see the note at
 * REVIEW_MODE.
 */
export const SECOND_EFFORT = cliArg('--second-effort') ?? 'medium';

/** A reviewer: provider, model, effort. */
export const PRIMARY = {provider: PROVIDER, model: MODEL, effort: PROVIDER === 'anthropic' ? EFFORT : undefined};
export const SECOND = {provider: 'anthropic', model: SECOND_MODEL, effort: SECOND_EFFORT, fallback: true, maxTokens: 16000};
/**
 * Final gate (stage 3, `--final`, default `claude-opus-5-5`, effort
 * `--final-effort`, default medium): reviews every unit that did not end as
 * agreed-covered, with the earlier verdicts and reasons as labelled context.
 * Its verdict is binding (see REVIEW_MODE). `--stages 2` stops before it.
 */
export const FINAL = {provider: 'anthropic', model: cliArg('--final') ?? 'claude-opus-5-5', effort: cliArg('--final-effort') ?? 'medium', fallback: true, maxTokens: 4096, final: true};
/** How many review stages run in agree mode (`--stages 1|2|3`, default 3). */
export const STAGES = Number(cliArg('--stages') ?? 3);

export const REVIEW_FILE = '.m3-specs/spec-checks/review.jsonl';
export const GAPS_DIR = '.m3-specs/spec-checks/review-gaps';
const GB = 'material-design-expressive/components';
/** A component folder by name, in components/ or extras/ (posix). */
const dirPath = (d) => elementDir(d).replace(/\\/g, '/');
const CONCURRENCY = 24;
/** Concurrent requests per component after its cache-writing first unit. */
const ANTHROPIC_CONCURRENCY = 32;
/** Final gate: components reviewed at once, and concurrent requests per component. */
const FINAL_GROUPS = 8;
const FINAL_CONCURRENCY = 5;
/** Components whose source is larger than this (estimated tokens) get the snippet prompt. */
const MAX_SOURCE_TOKENS = 90_000;
/** `../shared/` files up to this size are added to a component's source. */
const MAX_SHARED_BYTES = 12_000;
/**
 * USD per token per Anthropic model; the long rate applies above `longAbove`
 * prompt tokens. Cache writes cost 1.25x input; cache reads `cacheRead` (or
 * 0.1x input).
 */
const PRICES = {
  'claude-haiku-5-5': {input: 0.1e-6, output: 0.5e-6, longInput: 0.5e-6, longOutput: 2.5e-6, longAbove: 100_000},
  'claude-sonnet-5-5': {input: 2e-6, output: 10e-6, cacheRead: 0.2e-6, longAbove: Infinity},
};
/** Lines of code shown around each candidate. */
const CONTEXT = 20;
/** How far the quote may be from the cited line. */
const QUOTE_WINDOW = 5;

const COMMON_RULES = `You review whether a Material 3 web component library implements one sentence of the Material 3 spec.
The library is Lit web components (TypeScript) styled with SCSS and CSS custom properties.
You are shown the spec sentence with its page and heading path, the component's file list, and code snippets (line-numbered) found by keyword search. The snippets may be unrelated to the sentence.

Verdicts:
- "covered": ONLY if the shown code clearly implements the requirement, all of it. A matching name, token, comment, TODO, or test title alone is not enough. Do not assume code you cannot see.
- "not-applicable": the sentence is not a requirement for a web component library: Android-, iOS-, Compose- or XR-only behavior; advice to app designers about when or how to use the component, layout or content choices left to the app; writing or copy advice; design-process prose; plain descriptions of examples or images; marketing text.
- "gap": everything else, including requirements the shown code does not clearly implement.

For "covered", "file" is one of the snippet files, "line" is a line number shown, and "quote" is code copied exactly from the snippet at or next to that line (one or a few consecutive lines, without the line-number prefix) that implements the requirement. For other verdicts use "file": "", "line": 0, "quote": "".
"reason": one sentence in your own words (do not copy the spec text).`;

export const PROMPTS = {
  1: {
    system: `${COMMON_RULES}

Answer with strict JSON only:
{"verdict": "covered"|"gap"|"not-applicable", "file": "...", "line": N, "quote": "...", "reason": "..."}`,
  },
  2: {
    system: `${COMMON_RULES}

First split the requirement into its checkable parts (each condition, value, key, state or behavior it states), then for each part find the shown line that implements it. Say "covered" only if every part has such a line; one missing part makes it a "gap". Quote the line for the most specific part.

Answer with strict JSON only:
{"parts": [{"part": "...", "line": N|null}], "verdict": "covered"|"gap"|"not-applicable", "file": "...", "line": N, "quote": "...", "reason": "..."}`,
  },
  // Anthropic: fixed instructions (identical bytes in every request, so they
  // and the component source after them are prompt-cached); structured output.
  3: {
    system: `You review whether a Material 3 web component library implements one sentence of the Material 3 spec.
The library is Lit web components (TypeScript) styled with SCSS and CSS custom properties.
You are shown the code of the gb component the sentence belongs to: normally its full source in the system prompt (every .ts and .scss file, plus the shared helpers it imports), each file under a "=== <path> (<n> lines) ===" header; for foundation pages and very large components, code snippets found by keyword search in the user message instead. Every code line starts with its line number and "| ". The user message gives the spec sentence with its page and heading path, plus candidate locations found by keyword search. Candidates are only hints and may be unrelated; you may cite any line of the shown code.

Verdicts:
- "covered": ONLY if the shown code clearly implements the requirement, all of it. A matching name, token, comment, TODO, or test title alone is not enough. Do not assume code you cannot see.
- "not-applicable": the sentence is not a requirement for a web component library: Android-, iOS-, Compose- or XR-only behavior; advice to app designers about when or how to use the component, layout or content choices left to the app; writing or copy advice; design-process prose; plain descriptions of examples or images; marketing text.
- "gap": everything else, including requirements the shown code does not clearly implement.

Decide "not-applicable" from the sentence alone, never from the code: a behavior, state, interaction, layout rule (including responsive and right-to-left rules), measurement or accessibility rule that the component or the library's styles could implement is a requirement even when it says "should" or addresses designers. If the code lacks it, the verdict is "gap", not "not-applicable".
Short labels and captions (a variant, size, configuration, anatomy part or state name; an image or diagram caption that names parts or values) and overview or changelog sentences that announce features state that the component has those things: judge them "covered" if the shown code has every named thing, else "gap".

First split the requirement into its checkable parts (each condition, value, key, state or behavior it states), then for each part find the shown line that implements it ("at": "<path>:<line>", or "" when none). Say "covered" only if every part has such a line; one missing part makes it a "gap".

For "covered", "file" is the path of a shown file exactly as in its header, "line" is the line number of the code that implements the most specific part, and "quote" is that code copied exactly from the file (one or a few consecutive lines within 5 lines of "line", without the line-number prefix). For other verdicts use "file": "", "line": 0, "quote": "".
"reason": one sentence in your own words (do not copy the spec text).`,
  },
};
/** Prompt version used unless `--prompt` says otherwise (3 is the Anthropic prompt). */
export const PROMPT = PROVIDER === 'anthropic' ? 3 : 2;
/** Prompt versions for each provider. */
const PROVIDER_PROMPTS = {anthropic: [3], openrouter: [1, 2]};

/** Structured output schema of prompt 3. */
const ANSWER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['parts', 'verdict', 'file', 'line', 'quote', 'reason'],
  properties: {
    parts: {
      type: 'array',
      items: {type: 'object', additionalProperties: false, required: ['part', 'at'], properties: {part: {type: 'string'}, at: {type: 'string'}}},
    },
    verdict: {type: 'string', enum: ['covered', 'gap', 'not-applicable']},
    file: {type: 'string'},
    line: {type: 'integer'},
    quote: {type: 'string'},
    reason: {type: 'string'},
  },
};

/**
 * `agree` (default): `auto-review` only when the first reviewer and SECOND
 * both judge `covered` with verified quotes; everything else, including all
 * `not-applicable` verdicts, goes to the review queue (see the file comment).
 * `triage`: verdicts only order the review queue; nothing is covered by the
 * model. `cover`: verified `covered` verdicts of one model become
 * `auto-review` (and `not-applicable` ones `review-not-applicable` only with
 * ACCEPT_NOT_APPLICABLE).
 *
 * Triage because the calibration gate (false-covered <= 5% and gap recall >=
 * 90% on known gaps, `--gold`) failed on 2026-11-07: prompt 1 8.8% / 58.4%,
 * prompt 2 6.2% / 64.6% (113 known gaps, 82 known covered). Most misses were
 * label-pass sentences that are not gaps (captions, content advice, features
 * gb has); on the hand-labeled gold gaps prompt 2 scored 0/23 false-covered,
 * 22/23 recall. Switch to `cover` only after a gate pass on clean labels.
 *
 * claude-haiku-5-5 (prompt 3, full component source), same 195 units: effort
 * low 14.2% / 52.2% on the full set, 79% of known covered judged covered; on
 * the 23 hand-labeled gold gaps 1/23 false-covered, 21/23 recall (gate
 * PASS). Effort medium: 23.9% / 48.7%, gold gaps 2/23 and 19/23 (FAIL), so
 * EFFORT is low. Most full-set false-covered are label-pass "gaps" that gb
 * has (measurement captions, variant names).
 */
// `agree` applies the cached verdicts (Haiku + Sonnet agreement, Opus final
// gate) on every run without API calls. New paid runs are Haiku only (the
// API guard below refuses Sonnet/Opus): use `--review --review-mode triage`,
// and do the second opinion / final gate on the subscription.
export const REVIEW_MODE = cliArg('--review-mode') ?? 'agree';
if (!['agree', 'triage', 'cover'].includes(REVIEW_MODE)) throw new Error('--review-mode must be agree, triage or cover');

/**
 * Whether a `not-applicable` verdict may set the status
 * `review-not-applicable` (`cover` mode only). Off: on 2026-11-07 a full
 * Haiku run judged 1,641 units not applicable, too many to accept unchecked,
 * so they go to the review queue as "model: not applicable?" for a person to
 * confirm (then cite or mark them by hand). The code path stays in
 * spec-autocite.mjs (`reviewAcceptsNA`).
 */
export const ACCEPT_NOT_APPLICABLE = false;

/** Final-gate schema: prompt 3's plus the missing feature of a gap. */
const FINAL_SCHEMA = {
  ...ANSWER_SCHEMA,
  required: [...ANSWER_SCHEMA.required, 'feature'],
  properties: {...ANSWER_SCHEMA.properties, feature: {type: 'string'}},
};

// --- Prompt ---------------------------------------------------------------------

const fileCache = new Map();
function fileLines(file) {
  if (!fileCache.has(file)) fileCache.set(file, existsSync(file) ? readFileSync(file, 'utf8').split(/\r?\n/) : null);
  return fileCache.get(file);
}

/** Source files of a gb component dir (no demos, compiled output or generated CSS). */
export function componentFiles(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, {withFileTypes: true})) {
      const p = `${d}/${e.name}`;
      if (e.isDirectory()) {
        if (e.name !== 'demo' && e.name !== 'node_modules') walk(p);
      } else if (/\.(ts|scss|md)$/.test(e.name) && !/\.(d\.ts|cssresult\.ts)$/.test(e.name)) out.push(p);
    }
  };
  if (existsSync(dir)) walk(dir);
  return out.sort();
}

/** `[{file, from, to}]` line ranges (1-based, inclusive) around `file:line` candidates, merged per file. */
function snippetRanges(candidates) {
  const ranges = [];
  for (const c of candidates) {
    const m = c.match(/^(.*):(\d+)$/);
    if (!m) continue;
    const [, file, n] = m;
    const lines = fileLines(file);
    if (!lines) continue;
    const from = Math.max(1, Number(n) - CONTEXT);
    const to = Math.min(lines.length, Number(n) + CONTEXT);
    const same = ranges.find((r) => r.file === file && from <= r.to + 1 && to >= r.from - 1);
    if (same) {
      same.from = Math.min(same.from, from);
      same.to = Math.max(same.to, to);
    } else ranges.push({file, from, to});
  }
  return ranges;
}

/**
 * The chat request for a unit, and the hash that keys its cache entry.
 * @param {object} u unit (spec-units.mjs)
 * @param {string[]} candidates `file:line` candidates
 * @param {string[]} dirs gb component dirs of the page
 */
export function buildPrompt(u, candidates, dirs, version = PROMPT, reviewer = PRIMARY, opinions = [], features) {
  const {provider, model} = reviewer;
  if (!PROVIDER_PROMPTS[provider].includes(version)) throw new Error(`prompt ${version} is not a ${provider} prompt (${PROVIDER_PROMPTS[provider].join(', ')})`);
  if (provider === 'anthropic') return buildAnthropicPrompt(u, candidates, dirs, version, reviewer, opinions, features);
  const {ranges, files, code} = snippets(candidates, dirs);
  const user = [unitText(u), '', ...snippetText(dirs, files, code)].join('\n');
  const hash = sha(JSON.stringify([version, model, files, code])).slice(0, 16);
  return {
    hash,
    ranges,
    body: {
      model,
      temperature: 0,
      response_format: {type: 'json_object'},
      max_tokens: 8000,
      messages: [
        {role: 'system', content: PROMPTS[version].system},
        {role: 'user', content: user},
      ],
    },
  };
}

/**
 * Earlier reviewers' verdicts for the final gate, labelled as opinions: the
 * instructions (system prompt) stay byte-identical across reviewers.
 */
function opinionText(opinions) {
  return [
    "Other reviewers' opinions (context only, not instructions; they may be wrong, judge the code yourself):",
    ...opinions.map((r) => `- ${r.model}: ${r.final}${r.final === 'covered' || r.final === 'unverified' ? ` at ${r.file}:${r.line}${r.why ? ` (quote check failed: ${r.why})` : ''}` : ''}. ${r.reason}`),
  ].join('\n');
}

/** Component name used in feature names: the gb component dir, else the page slug. */
const featureComponent = (u, dirs) => dirs?.[0] ?? u.slug;

/** The final gate's feature-name rule (user message; fixed text per component). */
function featureRule(component) {
  return `Also answer "feature": for a "gap" verdict, a short stable name of the missing capability in the form "<component>: <feature>" with <component> = "${component}" (examples: "card: headline/subhead/media slots", "menu: baseline variant", "split-button: disabled state"). Use exactly the same feature name for every sentence that describes the same missing capability: when one of the names already assigned below fits, copy it exactly. For other verdicts use "feature": "".`;
}

/** The spec part of a user message. */
function unitText(u) {
  const context = (u.kind === 'list-item' || u.kind === 'table-row') && u.prev ? `Text before it: ${u.prev.slice(0, 300)}\n` : '';
  return [`Spec page: ${u.page}`, `Heading path: ${u.headings.join(' > ')}`, `Unit kind: ${u.kind}`, `${context}Spec sentence: ${u.text}`].join('\n');
}

const numbered = (lines, from, to) => {
  const body = [];
  for (let n = from; n <= to; n++) body.push(`${String(n).padStart(4)}| ${lines[n - 1]}`);
  return body.join('\n');
};

/** Code around the top-3 candidates, and the component's file list. */
function snippets(candidates, dirs) {
  const ranges = snippetRanges(candidates);
  const files = dirs.length ? dirs.flatMap((d) => componentFiles(dirPath(d))) : componentFiles('material-design-expressive/styles');
  const code = ranges.map((r) => `=== ${r.file} (lines ${r.from}-${r.to}) ===\n${numbered(fileLines(r.file), r.from, r.to)}`);
  return {ranges, files, code};
}

function snippetText(dirs, files, code) {
  return [
    `gb component directory: ${dirs.length ? dirs.map(dirPath).join(', ') : '(none; foundation page — shared styles in styles)'}`,
    `Files:\n${files.map((f) => `- ${f}`).join('\n') || '(none)'}`,
    '',
    code.length ? `Code snippets:\n\n${code.join('\n\n')}` : 'Code snippets: (no keyword candidates found)',
  ];
}

/** Source files shown in full: .ts / .scss outside demo/, no tests, declarations or generated CSS. */
export function sourceFiles(dir) {
  return componentFiles(dir).filter((f) => /\.(ts|scss)$/.test(f) && !/_test\.ts$/.test(f));
}

/** Small `../shared/` files imported by `files` (TS imports and SCSS @use / @forward). */
function sharedImports(files) {
  const out = new Set();
  for (const f of files) {
    const text = (fileLines(f) ?? []).join('\n');
    for (const m of text.matchAll(/(?:from\s+|import\s+|@use\s+|@forward\s+)['"](?:\.\.\/)+(?:components\/)?shared\/([\w./-]+?)(?:\.js)?['"]/g)) {
      const name = m[1];
      const candidates = [`${GB}/shared/${name}.ts`, `${GB}/shared/_${name}.scss`, `${GB}/shared/${name}.scss`];
      const hit = candidates.find((c) => existsSync(c) && statSync(c).size <= MAX_SHARED_BYTES);
      if (hit) out.add(hit);
    }
  }
  return [...out].sort();
}

const sources = new Map();
/**
 * The line-numbered full source of gb component dirs (second system block),
 * or `tooBig` when it would exceed MAX_SOURCE_TOKENS.
 */
function componentSource(dirs) {
  const key = dirs.join(',');
  if (!sources.has(key)) {
    const own = dirs.flatMap((d) => sourceFiles(dirPath(d)));
    const files = [...own, ...sharedImports(own)];
    const text = files
      .map((f) => {
        const lines = fileLines(f);
        return `=== ${f} (${lines.length} lines) ===\n${numbered(lines, 1, lines.length)}`;
      })
      .join('\n\n');
    // ~3 characters per token for line-numbered code (an overestimate).
    const tokens = Math.round(text.length / 3);
    sources.set(key, {key, files, text: `Source of ${dirs.map(dirPath).join(', ')}:\n\n${text}`, tokens, tooBig: tokens > MAX_SOURCE_TOKENS, hash: sha(text).slice(0, 16)});
  }
  return sources.get(key);
}

/** The Anthropic request for a unit: full component source when it fits, else snippets. */
function buildAnthropicPrompt(u, candidates, dirs, version, {model, effort, fallback, maxTokens, final}, opinions, features) {
  const src = dirs.length ? componentSource(dirs) : null;
  const full = Boolean(src && !src.tooBig);
  const instructions = {type: 'text', text: PROMPTS[version].system};
  let system, ranges, user, shown;
  if (full) {
    ranges = src.files.map((file) => ({file, from: 1, to: fileLines(file).length}));
    system = [instructions, {type: 'text', text: src.text, cache_control: {type: 'ephemeral'}}];
    user = [unitText(u), '', `Candidate locations (keyword search hints): ${candidates.join(', ') || '(none)'}`].join('\n');
    shown = src.hash;
  } else {
    const s = snippets(candidates, dirs);
    ranges = s.ranges;
    // Only the instructions are shared between requests here.
    system = [{...instructions, cache_control: {type: 'ephemeral'}}];
    user = [unitText(u), '', ...snippetText(dirs, s.files, s.code)].join('\n');
    shown = [s.files, s.code];
  }
  if (opinions.length) user += `\n\n${opinionText(opinions)}`;
  // The final gate also names the missing feature of a gap. The rule and the
  // feature names assigned so far go in the user message (the system prompt
  // stays byte-identical across reviewers); the names are not hashed, so the
  // cache key does not depend on the order units were reviewed in.
  const component = featureComponent(u, dirs);
  if (final) user += `\n\n${featureRule(component)}`;
  const hashedUser = user;
  if (final) {
    user += features?.length
      ? `\nFeature names already assigned for ${component}:\n${features.map((f) => `- ${f}`).join('\n')}`
      : `\nFeature names already assigned for ${component}: (none yet)`;
  }
  const hash = sha(JSON.stringify([version, sha(PROMPTS[version].system), model, effort, shown, hashedUser])).slice(0, 16);
  return {
    hash,
    ranges,
    group: full ? src.key : '(snippets)',
    component,
    // No temperature / top_p / thinking: Sonnet 5.5 rejects non-default
    // sampling and thinks adaptively; Haiku runs the same way.
    body: {
      model,
      // Thinking counts against max_tokens on Sonnet / Opus.
      max_tokens: maxTokens ?? 2048,
      system,
      messages: [{role: 'user', content: user}],
      output_config: {effort, format: {type: 'json_schema', schema: final ? FINAL_SCHEMA : ANSWER_SCHEMA}},
      // Server-side fallback on refusals (beta); a refusal that remains is an error.
      ...(fallback ? {betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default'} : {}),
    },
  };
}

// --- Verification -----------------------------------------------------------------

const ws = (s) => s.replace(/\s+/g, ' ').trim();
const isComment = (line) => /^\s*(\/\/|\/?\*|<!--|-->|#)/.test(line) || !line.trim();

/**
 * The final verdict of a model answer: `covered` only when the quote is
 * really in the shown code near the cited line.
 * @return {{final: string, why?: string}}
 */
export function verify(answer, ranges) {
  const v = answer.verdict;
  if (v === 'gap' || v === 'not-applicable') return {final: v};
  if (v !== 'covered') return {final: 'unverified', why: `invalid verdict ${JSON.stringify(v)}`};
  const file = String(answer.file ?? '').replace(/\\/g, '/').replace(/^\.\//, '');
  const line = Number(answer.line);
  const shown = ranges.filter((r) => r.file === file);
  if (!shown.length) return {final: 'unverified', why: 'file not among the snippets'};
  if (!Number.isInteger(line) || !shown.some((r) => line >= r.from - QUOTE_WINDOW && line <= r.to + QUOTE_WINDOW)) {
    return {final: 'unverified', why: 'line outside the snippets'};
  }
  const qLines = String(answer.quote ?? '')
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*\d+\|\s?/, ''));
  const quote = ws(qLines.join(' '));
  if (quote.replace(/\s/g, '').length < 6) return {final: 'unverified', why: 'quote too short'};
  if (qLines.every(isComment)) return {final: 'unverified', why: 'quote is only comments'};
  const lines = fileLines(file);
  const lo = Math.max(1, line - QUOTE_WINDOW);
  const hi = Math.min(lines.length, line + QUOTE_WINDOW);
  const windowText = ws(lines.slice(lo - 1, hi).join(' '));
  if (!windowText.includes(quote)) return {final: 'unverified', why: 'quote not found within ±5 lines'};
  return {final: 'covered'};
}

// --- Cache ----------------------------------------------------------------------------

/**
 * `${id}|${hash}` -> row (exact prompt), and `latest|${id}|${model}|${effort}`
 * -> the latest row of that unit and reviewer (see {@link cachedVerdict}).
 */
export function readCache(file = REVIEW_FILE) {
  const map = new Map();
  if (!existsSync(file)) return map;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      map.set(`${row.id}|${row.hash}`, row);
      map.set(`latest|${row.id}|${row.model}|${row.effort ?? ''}`, row);
    } catch {
      // A line cut short by an interrupted run.
    }
  }
  return map;
}

/**
 * The cached verdict for a unit: the row of this exact prompt, else the
 * reviewer's latest row for the unit when it still holds. A prompt changes
 * whenever its code hints or component source change, even when the code a
 * verdict relies on doesn't; so a `covered` verdict stays valid while its
 * quoted code is still in the cited file (lines may have moved), and other
 * verdicts carry over as they are (gaps are tracked; re-review to upgrade).
 */
export function cachedVerdict(cache, id, hash, reviewer) {
  const exact = cache.get(`${id}|${hash}`);
  if (exact) return exact;
  const row = cache.get(`latest|${id}|${reviewer.model}|${reviewer.effort ?? ''}`);
  if (!row) return undefined;
  if (row.final !== 'covered') return row;
  const file = String(row.file ?? '').replace(/\\/g, '/');
  const quote = ws(String(row.quote ?? '').split(/\r?\n/).map((l) => l.replace(/^\s*\d+\|\s?/, '')).join(' '));
  if (!file || !quote || !existsSync(file)) return undefined;
  return ws(readFileSync(file, 'utf8')).includes(quote) ? row : undefined;
}

// --- Review ----------------------------------------------------------------------------

/**
 * Reviews `items` (`[{u, candidates, dirs}]`): cached verdicts for unchanged
 * prompts, API calls for the rest when `api` is set.
 * @return {Promise<{results: Map<string, object>, note: string, missing: number}>}
 *   unit ID -> cache row (`final` is covered / unverified / gap / not-applicable)
 */
export async function reviewUnits(items, {api = false, maxUsd = 5, limit = Infinity, version, reviewer = PRIMARY, log = console.log, concurrency} = {}) {
  version ??= reviewer === PRIMARY ? PROMPT : 3;
  const {provider, model, effort} = reviewer;
  mkdirSync('.m3-specs/spec-checks', {recursive: true});
  const cache = readCache();
  const results = new Map();
  const todo = [];
  for (const item of items) {
    const p = buildPrompt(item.u, item.candidates ?? [], item.dirs ?? [], version, reviewer, item.opinions ?? []);
    const hit = cachedVerdict(cache, item.u.id, p.hash, reviewer);
    if (hit) results.set(item.u.id, hit);
    else todo.push({...item, p});
  }
  // Final gate: feature names assigned so far, per component (cached rows first).
  const features = new Map();
  const addFeature = (component, f) => {
    if (!f) return;
    if (!features.has(component)) features.set(component, []);
    if (!features.get(component).includes(f)) features.get(component).push(f);
  };
  if (reviewer.final) for (const item of items) addFeature(featureComponent(item.u, item.dirs), results.get(item.u.id)?.feature);
  let note = '';
  if (todo.length && !api) note = `${todo.length} units not reviewed (no --review / API key)`;
  if (todo.length && api) {
    log(`Reviewing ${todo.length} units with ${model}${provider === 'anthropic' ? ` (effort ${effort})` : ''} (${results.size} cached)...`);
    const startCost = spent();
    const startTokens = {...anthropicUsage};
    const started = Date.now();
    let done = 0;
    let errors = 0;
    let budget = limit;
    const run = async (item) => {
      if (note) return;
      if (spent() - startCost > maxUsd) {
        note = `spend cap $${maxUsd} reached`;
        return;
      }
      if (budget-- <= 0) {
        note = '--limit reached';
        return;
      }
      try {
        // Rebuilt at call time so the feature list is current (same hash).
        if (reviewer.final) item.p = buildPrompt(item.u, item.candidates ?? [], item.dirs ?? [], version, reviewer, item.opinions ?? [], features.get(item.p.component));
        const row = await (provider === 'anthropic' ? reviewOneAnthropic(item, version, reviewer) : reviewOne(item, version, reviewer));
        results.set(item.u.id, row);
        if (reviewer.final) addFeature(item.p.component, row.feature);
        appendFileSync(REVIEW_FILE, JSON.stringify(row) + '\n');
      } catch (err) {
        if (isFatal(err)) {
          note = `API error, stopped: ${err.message.slice(0, 200)}`;
          return;
        }
        if (++errors <= 5) log(`  ${item.u.id}: ${err.message.slice(0, 200)}`);
      }
      if (++done % 250 === 0) log(`  ${done}/${todo.length} $${(spent() - startCost).toFixed(3)} ${((Date.now() - started) / 1000).toFixed(0)}s`);
    };
    if (provider === 'anthropic') {
      // Per component: the first unit alone writes the prompt cache, the rest read it.
      const groups = new Map();
      for (const item of todo) {
        if (!groups.has(item.p.group)) groups.set(item.p.group, []);
        groups.get(item.p.group).push(item);
      }
      const runGroup = async (list) => {
        if (note) return;
        await run(list[0]);
        await pool(list.slice(1), concurrency ?? (reviewer.final ? FINAL_CONCURRENCY : ANTHROPIC_CONCURRENCY), run);
      };
      // The final gate runs several components at once with fewer requests
      // each, so later units of a component see the feature names assigned.
      await pool([...groups.values()], reviewer.final ? FINAL_GROUPS : 1, runGroup);
    } else {
      await pool(todo, concurrency ?? CONCURRENCY, run);
    }
    log(`Reviewed ${done} units in ${((Date.now() - started) / 1000).toFixed(0)}s, $${(spent() - startCost).toFixed(4)}${errors ? `, ${errors} errors` : ''}${note ? ` (${note})` : ''}.`);
    if (provider === 'anthropic') {
      const d = Object.fromEntries(Object.keys(anthropicUsage).map((k) => [k, anthropicUsage[k] - startTokens[k]]));
      const prompt = d.input + d.cacheWrite + d.cacheRead;
      log(`Tokens: ${d.input} input, ${d.cacheWrite} cache write, ${d.cacheRead} cache read, ${d.output} output in ${d.calls} calls; cache read ${prompt ? ((d.cacheRead / prompt) * 100).toFixed(1) : 0}% of prompt tokens; ${d.stopErrors} refusal / max_tokens stops.`);
    }
  }
  return {results, note, missing: items.length - results.size};
}

/**
 * Agree mode: stage 1 (PRIMARY) on every item, stage 2 (SECOND) on the
 * items stage 1 judged covered, stage 3 (FINAL) on the items that are not
 * agreed-covered after stage 2. Each stage reads and writes its own cache rows
 * (keyed by model through the prompt hash).
 *
 * Combined row per unit (`final`):
 * - `covered`: both stage 1 and 2 covered with verified quotes (`stage: 2`),
 *   or FINAL covered with a verified quote (`stage: 3`). `models`,
 *   `evidence` (file:line) and `quoteHashes` name every model that counts.
 * - `not-applicable` (`binding: true`): FINAL judged it not applicable.
 * - Queue categories: `gap` (FINAL gap, or stage 1 gap without a FINAL
 *   verdict), `unverified` (a covered verdict whose quote failed the check),
 *   `disagree` (stage 1 covered, stage 2 not, no FINAL verdict),
 *   `not-applicable?` (stage 1 not applicable, no FINAL verdict), `pending`
 *   (a needed verdict is missing: not run yet, refusal or error).
 * `notes` keeps every model's verdict and reason.
 * @return {Promise<{results: Map<string, object>, note: string, missing: number, stages: object}>}
 */
export async function reviewAgree(items, {api = false, maxUsd = 5, maxUsdFinal = 120, stages = STAGES, log = console.log, limit = Infinity} = {}) {
  // Stage 1 per unit; stages 2 and 3 in section batches (unless --per-unit).
  const run = (list, reviewer, cap, ok) => (reviewer !== PRIMARY && BATCH ? reviewBatches : reviewUnits)(list, {api: api && ok, maxUsd: cap, reviewer, log, limit});
  const notes = [];
  const s1 = await run(items, PRIMARY, maxUsd, hasKey(PRIMARY.provider));
  if (s1.note) notes.push(`${PRIMARY.model}: ${s1.note}`);
  const firstCovered = items.filter((x) => s1.results.get(x.u.id)?.final === 'covered');
  const s2 = stages >= 2 && firstCovered.length ? await run(firstCovered, SECOND, maxUsd, hasKey('anthropic')) : {results: new Map(), note: ''};
  if (s2.note) notes.push(`${SECOND.model}: ${s2.note}`);
  const agreed = (id) => s1.results.get(id)?.final === 'covered' && s2.results.get(id)?.final === 'covered';
  const rest = items.filter((x) => !agreed(x.u.id)).map((x) => ({...x, opinions: [s1.results.get(x.u.id), s2.results.get(x.u.id)].filter(Boolean)}));
  const s3 = stages >= 3 && rest.length ? await run(rest, FINAL, maxUsdFinal, hasKey('anthropic')) : {results: new Map(), note: ''};
  if (s3.note) notes.push(`${FINAL.model}: ${s3.note}`);

  const results = new Map();
  for (const {u} of items) {
    const rows = [s1.results.get(u.id), s2.results.get(u.id), s3.results.get(u.id)];
    const [r1, r2, r3] = rows;
    if (!r1 && !r3) continue;
    const base = {id: u.id, notes: rows.filter(Boolean).map((r) => ({model: r.model, final: r.final, reason: r.reason, ...(r.file ? {at: `${r.file}:${r.line}`} : {}), ...(r.why ? {why: r.why} : {})}))};
    const cover = (rs, stage) => ({...base, final: 'covered', stage, model: rs.map((r) => r.model).join(' + '), models: rs.map((r) => r.model), evidence: rs.map((r) => `${r.file}:${r.line}`), quoteHashes: rs.map((r) => r.quoteHash), file: rs.at(-1).file, line: rs.at(-1).line, reason: rs.at(-1).reason});
    let row;
    if (agreed(u.id)) row = cover([r1, r2], 2);
    else if (r3) {
      if (r3.final === 'covered') row = cover([r3], 3);
      else row = {...base, final: r3.final, stage: 3, model: r3.model, reason: r3.reason, ...(r3.feature ? {feature: r3.feature} : {}), ...(r3.final === 'not-applicable' ? {binding: true} : {}), ...(r3.why ? {why: r3.why} : {}), ...(r3.final === 'unverified' ? {file: r3.file, line: r3.line} : {})};
    } else if (r1.final === 'covered') {
      row = r2 ? {...base, final: r2.final === 'unverified' ? 'unverified' : 'disagree', stage: 2, model: `${r1.model} + ${r2.model}`, reason: r1.reason, file: r1.file, line: r1.line} : {...base, final: 'pending', stage: 1, model: r1.model, reason: `${SECOND.model} verdict missing`, file: r1.file, line: r1.line};
    } else {
      row = {...base, final: r1.final === 'not-applicable' ? 'not-applicable?' : r1.final, stage: 1, model: r1.model, reason: r1.reason, ...(r1.why ? {why: r1.why} : {}), ...(r1.final === 'unverified' ? {file: r1.file, line: r1.line} : {})};
    }
    results.set(u.id, row);
  }
  const count = (m) => {
    const c = {};
    for (const r of m.values()) c[r.final] = (c[r.final] ?? 0) + 1;
    return c;
  };
  return {results, note: notes.join('; '), missing: items.length - results.size, stages: {first: count(s1.results), second: count(s2.results), final: count(s3.results), combined: count(results), secondAsked: firstCovered.length, finalAsked: rest.length}};
}

// --- Section batches (stages 2 and 3) ---------------------------------------------------

/** Stages 2 and 3 review whole sections per call (`--per-unit` turns it off). */
export const BATCH = !process.argv.includes('--per-unit');
/** Batch prompt version (part of the cache key). */
const BATCH_PROMPT = 4;
/** Units per batch at most; bigger sections split at their next heading level. */
const MAX_BATCH = 40;
/** Batched calls: components at once, and calls per component. */
const BATCH_GROUPS = 8;
const BATCH_CONCURRENCY = 3;
/** Max output tokens of a batched call (thinking included; stays under the SDK's non-streaming limit). */
const BATCH_MAX_TOKENS = 16000;

const BATCH_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['features', 'units'],
  properties: {
    features: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'status', 'file', 'line', 'quote', 'reason'],
        properties: {
          name: {type: 'string'},
          status: {type: 'string', enum: ['implemented', 'missing', 'not-applicable']},
          file: {type: 'string'},
          line: {type: 'integer'},
          quote: {type: 'string'},
          reason: {type: 'string'},
        },
      },
    },
    units: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'feature', 'verdict'],
        properties: {id: {type: 'string'}, feature: {type: 'string'}, verdict: {type: 'string', enum: ['covered', 'gap', 'not-applicable']}},
      },
    },
  },
};

/** The batch rules (user message, fixed text per component). */
function batchRule(component) {
  return `This request lists several spec sentences from one section. Judge each sentence by the rules in the system prompt, but answer with the batch format below instead of the single-sentence fields:
- "features": group the sentences by the capability they describe, one entry per capability. "name" is a short stable name "<component>: <feature>" with <component> = "${component}" (examples: "card: headline/subhead/media slots", "menu: baseline variant", "split-button: disabled state"); when a name from "Feature names already assigned" fits, copy it exactly, so the same capability keeps the same name in every section. "status": "implemented" when the shown code implements the capability for every sentence assigned to it, "missing" when it does not, "not-applicable" when those sentences are not requirements for a web component library (same rule as "not-applicable" above). For "implemented", "file", "line" and "quote" follow the rules for "covered" above (exact code from a shown file, within 5 lines of "line"); otherwise use "", 0, "". "reason": one sentence in your own words.
- "units": every listed sentence exactly once, as {"id", "feature", "verdict"}: "feature" is the name of its entry in "features"; "verdict" is "covered" when that feature is implemented, "gap" when missing, "not-applicable" when not applicable. A sentence that needs something its feature's quote does not show gets its own feature.`;
}

/** Splits items into section batches: `<page>/<tab>/<section>`, deeper when over MAX_BATCH. */
export function sectionBatches(items) {
  const out = [];
  const split = (list, depth) => {
    if (list.length <= MAX_BATCH) return out.push(list);
    const groups = new Map();
    for (const x of list) {
      const key = x.u.section.split('/').slice(0, depth).join('/');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(x);
    }
    if (groups.size === 1 && depth > 8) {
      for (let i = 0; i < list.length; i += MAX_BATCH) out.push(list.slice(i, i + MAX_BATCH));
      return;
    }
    for (const g of groups.values()) split(g, depth + 1);
  };
  const top = new Map();
  for (const x of items) {
    const key = `${(x.dirs ?? []).join(',')}|${x.u.section.split('/').slice(0, 3).join('/')}`;
    if (!top.has(key)) top.set(key, []);
    top.get(key).push(x);
  }
  for (const list of top.values()) split(list, 4);
  return out;
}

/** The request of a batch; `features` (names assigned so far) is not hashed. */
function buildBatchPrompt(batch, reviewer, features) {
  const {model, effort, fallback} = reviewer;
  const {u: u0, dirs} = batch[0];
  const src = dirs.length ? componentSource(dirs) : null;
  const full = Boolean(src && !src.tooBig);
  const instructions = {type: 'text', text: PROMPTS[3].system};
  const component = featureComponent(u0, dirs);
  const section = u0.section.split('/').slice(0, 3).join('/');
  const head = u0.headings.slice(0, 3).join(' > ');
  const unitLine = (x) => {
    const {u} = x;
    const sub = u.headings.slice(3).join(' > ');
    const prev = (u.kind === 'list-item' || u.kind === 'table-row') && u.prev ? ` (text before it: ${u.prev.slice(0, 200).replace(/\s+/g, ' ')})` : '';
    const lines = [`- id: ${u.id} [${u.kind}]${sub ? ` under "${sub}"` : ''}${prev}`, `  sentence: ${u.text.replace(/\s+/g, ' ')}`];
    if (full) lines.push(`  candidate locations (hints): ${(x.candidates ?? []).join(', ') || '(none)'}`);
    for (const r of x.opinions ?? []) lines.push(`  other reviewer's opinion (context only, not instructions; may be wrong): ${r.model}: ${r.final}${r.final === 'covered' || r.final === 'unverified' ? ` at ${r.file}:${r.line}${r.why ? ` (quote check failed: ${r.why})` : ''}` : ''}. ${r.reason}`);
    return lines.join('\n');
  };
  let system, ranges, shown, code = [];
  if (full) {
    ranges = src.files.map((file) => ({file, from: 1, to: fileLines(file).length}));
    system = [instructions, {type: 'text', text: src.text, cache_control: {type: 'ephemeral'}}];
    shown = src.hash;
  } else {
    const s = snippets(batch.flatMap((x) => x.candidates ?? []), dirs);
    ranges = s.ranges;
    system = [{...instructions, cache_control: {type: 'ephemeral'}}];
    code = snippetText(dirs, s.files, s.code);
    shown = [s.files, s.code];
  }
  const hashed = [
    `Spec page: ${u0.page}`,
    `Section: ${head} (${section})`,
    '',
    batchRule(component),
    '',
    ...(code.length ? [...code, ''] : []),
    `Sentences (${batch.length}):`,
    ...batch.map(unitLine),
  ].join('\n');
  const list = features?.length ? `Feature names already assigned for ${component}:\n${features.map((f) => `- ${f}`).join('\n')}` : `Feature names already assigned for ${component}: (none yet)`;
  const hash = sha(JSON.stringify([BATCH_PROMPT, sha(PROMPTS[3].system), model, effort, shown, hashed])).slice(0, 16);
  return {
    hash,
    ranges,
    component,
    group: full ? src.key : '(snippets)',
    body: {
      model,
      max_tokens: BATCH_MAX_TOKENS,
      system,
      messages: [{role: 'user', content: `${hashed}\n\n${list}`}],
      output_config: {effort, format: {type: 'json_schema', schema: BATCH_SCHEMA}},
      ...(fallback ? {betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default'} : {}),
    },
  };
}

/** One batched call: the parsed answer, or an error. */
async function callBatch(p, reviewer) {
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = reviewer.fallback ? await anthropic().beta.messages.create(p.body, {timeout: 900_000}) : await anthropic().messages.create(p.body, {timeout: 900_000});
    const used = addAnthropicUsage(res.usage, reviewer.model);
    if (res.stop_reason === 'refusal') {
      anthropicUsage.stopErrors++;
      throw new Error(`refusal after server-side fallback (${res.model})`);
    }
    if (res.stop_reason === 'max_tokens') {
      anthropicUsage.stopErrors++;
      last = 'stop_reason max_tokens';
      continue;
    }
    const text = res.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
    try {
      return {answer: JSON.parse(text), cost: used.cost, tokens: used.tokens, servedBy: res.model !== reviewer.model ? res.model : undefined};
    } catch {
      last = `not JSON: ${text.slice(0, 120)}`;
    }
  }
  throw new Error(`no answer after 2 tries (${last})`);
}

const STATUS_OF = {covered: 'implemented', gap: 'missing', 'not-applicable': 'not-applicable'};

/** Cache rows of a batch answer for the units in `batch` that it answers. */
function batchRows(batch, p, answer, reviewer, extra) {
  const features = new Map((answer.features ?? []).map((f) => [String(f.name ?? '').trim(), f]));
  const verified = new Map();
  const rows = new Map();
  const ids = new Set(batch.map((x) => x.u.id));
  for (const a of answer.units ?? []) {
    const id = String(a.id ?? '').trim();
    if (!ids.has(id) || rows.has(id)) continue;
    const name = String(a.feature ?? '').trim();
    const f = features.get(name);
    const verdict = String(a.verdict ?? '');
    let final = verdict;
    let why;
    if (!['covered', 'gap', 'not-applicable'].includes(verdict)) [final, why] = ['unverified', `invalid verdict ${JSON.stringify(verdict)}`];
    else if (!f) [final, why] = verdict === 'covered' ? ['unverified', 'feature not in features'] : verdict === 'not-applicable' ? ['gap', 'feature not in features'] : ['gap', undefined];
    else if (f.status !== STATUS_OF[verdict]) [final, why] = verdict === 'covered' ? ['unverified', `verdict covered but feature ${f.status}`] : ['gap', `verdict ${verdict} but feature ${f.status}`];
    else if (verdict === 'covered') {
      if (!verified.has(name)) verified.set(name, verify({verdict: 'covered', file: f.file, line: f.line, quote: f.quote}, p.ranges));
      const v = verified.get(name);
      final = v.final;
      why = v.why;
    }
    const quote = f && verdict === 'covered' ? ws(String(f.quote ?? '')) : '';
    rows.set(id, {
      id,
      hash: p.hash,
      prompt: BATCH_PROMPT,
      model: reviewer.model,
      effort: reviewer.effort,
      verdict,
      final,
      ...(why ? {why} : {}),
      file: quote ? f.file : '',
      line: quote ? Number(f.line) || 0 : 0,
      quote,
      quoteHash: quote ? sha(quote).slice(0, 12) : '',
      reason: String(f?.reason ?? '').slice(0, 400),
      feature: name,
      featureStatus: f?.status ?? '',
      batch: batch.length,
      ...extra,
    });
  }
  return rows;
}

/**
 * Reviews `items` in section batches with `reviewer` (one call per batch;
 * one re-ask for ids the answer left out, the rest are errors). Same result
 * shape as reviewUnits: unit ID -> cache row.
 */
export async function reviewBatches(items, {api = false, maxUsd = 5, limit = Infinity, reviewer = SECOND, log = console.log} = {}) {
  mkdirSync('.m3-specs/spec-checks', {recursive: true});
  const cache = readCache();
  const results = new Map();
  const todo = [];
  const assigned = new Map();
  const addFeature = (component, f) => {
    if (!f) return;
    if (!assigned.has(component)) assigned.set(component, []);
    if (!assigned.get(component).includes(f)) assigned.get(component).push(f);
  };
  for (const batch of sectionBatches(items)) {
    const p = buildBatchPrompt(batch, reviewer, []);
    const hits = batch.map((x) => cachedVerdict(cache, x.u.id, p.hash, reviewer));
    if (hits.every(Boolean)) {
      for (const r of hits) {
        results.set(r.id, r);
        addFeature(p.component, r.feature);
      }
    } else todo.push({batch, p});
  }
  let note = '';
  const units = todo.reduce((n, b) => n + b.batch.length, 0);
  if (todo.length && !api) note = `${units} units in ${todo.length} batches not reviewed (no --review / API key)`;
  if (todo.length && api) {
    log(`Reviewing ${units} units in ${todo.length} section batches with ${reviewer.model} (effort ${reviewer.effort}) (${results.size} cached)...`);
    const startCost = spent();
    const started = Date.now();
    let done = 0;
    let errors = 0;
    let calls = 0;
    let budget = limit;
    const run = async (item) => {
      if (note) return;
      if (spent() - startCost > maxUsd) return void (note = `spend cap $${maxUsd} reached`);
      if (budget-- <= 0) return void (note = '--limit reached');
      const {batch} = item;
      try {
        const t0 = Date.now();
        const p = buildBatchPrompt(batch, reviewer, assigned.get(item.p.component));
        calls++;
        const r = await callBatch(p, reviewer);
        const extra = (x) => ({cost: x.cost / batch.length, ms: Date.now() - t0, ...(x.servedBy ? {servedBy: x.servedBy} : {})});
        let rows = batchRows(batch, p, r.answer, reviewer, extra(r));
        for (const f of r.answer.features ?? []) addFeature(p.component, String(f.name ?? '').trim());
        const left = batch.filter((x) => !rows.has(x.u.id));
        if (left.length) {
          // Re-ask once for the ids the answer left out (rows keep the batch hash).
          const p2 = buildBatchPrompt(left, reviewer, assigned.get(item.p.component));
          calls++;
          const r2 = await callBatch(p2, reviewer);
          const rows2 = batchRows(left, {...p2, hash: p.hash}, r2.answer, reviewer, extra(r2));
          for (const f of r2.answer.features ?? []) addFeature(p.component, String(f.name ?? '').trim());
          rows = new Map([...rows, ...rows2]);
          const still = left.filter((x) => !rows.has(x.u.id)).length;
          if (still && ++errors <= 5) log(`  ${batch[0].u.section}: ${still} ids missing after the re-ask`);
        }
        for (const row of rows.values()) {
          results.set(row.id, row);
          appendFileSync(REVIEW_FILE, JSON.stringify(row) + '\n');
        }
      } catch (err) {
        if (isFatal(err)) return void (note = `API error, stopped: ${err.message.slice(0, 200)}`);
        if (++errors <= 5) log(`  ${batch[0].u.section}: ${err.message.slice(0, 200)}`);
      }
      if (++done % 50 === 0) log(`  ${done}/${todo.length} batches $${(spent() - startCost).toFixed(3)} ${((Date.now() - started) / 1000).toFixed(0)}s`);
    };
    const groups = new Map();
    for (const item of todo) {
      if (!groups.has(item.p.group)) groups.set(item.p.group, []);
      groups.get(item.p.group).push(item);
    }
    await pool([...groups.values()], BATCH_GROUPS, async (list) => {
      if (note) return;
      await run(list[0]);
      await pool(list.slice(1), BATCH_CONCURRENCY, run);
    });
    log(`Reviewed ${done} batches (${calls} calls) in ${((Date.now() - started) / 1000).toFixed(0)}s, $${(spent() - startCost).toFixed(4)}${errors ? `, ${errors} errors` : ''}${note ? ` (${note})` : ''}.`);
  }
  return {results, note, missing: items.length - results.size, batches: todo.length};
}

/** Runs `fn` over `list` with at most `n` calls in flight. */
async function pool(list, n, fn) {
  let i = 0;
  await Promise.all(Array.from({length: Math.min(n, list.length)}, async () => {
    while (i < list.length) await fn(list[i++]);
  }));
}

/** Errors that retrying cannot fix (bad key, no credits, bad request): stop the run. */
function isFatal(err) {
  if (err instanceof FatalApiError) return true;
  return err instanceof Anthropic.APIError && [400, 401, 403, 404, 413].includes(err.status);
}

/** Token and USD totals of the Anthropic calls in this process. */
export const anthropicUsage = {cost: 0, calls: 0, input: 0, cacheWrite: 0, cacheRead: 0, output: 0, stopErrors: 0};
/** USD and calls per Anthropic model in this process. */
export const anthropicByModel = {};
/** USD spent in this process, both providers. */
export const spent = () => usage.cost + anthropicUsage.cost;

/** Adds `response.usage` to anthropicUsage; returns its cost. */
function addAnthropicUsage(u, model) {
  const PRICE = PRICES[model] ?? PRICES['claude-sonnet-5-5'];
  const input = u?.input_tokens ?? 0;
  const cacheWrite = u?.cache_creation_input_tokens ?? 0;
  const cacheRead = u?.cache_read_input_tokens ?? 0;
  const output = u?.output_tokens ?? 0;
  const long = input + cacheWrite + cacheRead > PRICE.longAbove;
  const rate = long ? PRICE.longInput : PRICE.input;
  const readRate = PRICE.cacheRead && !long ? PRICE.cacheRead : 0.1 * rate;
  const cost = (input + 1.25 * cacheWrite) * rate + cacheRead * readRate + output * (long ? PRICE.longOutput : PRICE.output);
  Object.assign(anthropicUsage, {
    cost: anthropicUsage.cost + cost,
    calls: anthropicUsage.calls + 1,
    input: anthropicUsage.input + input,
    cacheWrite: anthropicUsage.cacheWrite + cacheWrite,
    cacheRead: anthropicUsage.cacheRead + cacheRead,
    output: anthropicUsage.output + output,
  });
  const m = (anthropicByModel[model] ??= {cost: 0, calls: 0});
  m.cost += cost;
  m.calls++;
  return {cost, tokens: {input, cacheWrite, cacheRead, output}};
}

let anthropicClient;
/**
 * Paid API use is limited to wide parallel Haiku runs. Sonnet / Opus level
 * review (second opinion, final gate) is done by agents on a subscription,
 * not through this script, so any other model is refused here.
 */
const PAID_MODEL = /^claude-haiku-/;
const anthropic = () => (anthropicClient ??= guardModels(new Anthropic({maxRetries: 6})));

function guardModels(client) {
  const check = (body) => {
    if (!PAID_MODEL.test(body?.model ?? '')) {
      throw new Error(`spec-review: refusing paid API call with model "${body?.model}"; only claude-haiku-* runs through the API (Sonnet/Opus review runs on the subscription).`);
    }
  };
  for (const api of [client.messages, client.beta.messages]) {
    const create = api.create.bind(api);
    api.create = (body, options) => {
      check(body);
      return create(body, options);
    };
  }
  return client;
}

async function reviewOneAnthropic(item, version, reviewer) {
  let last;
  let cost = 0;
  const t0 = Date.now();
  // One retry on a refusal / max_tokens stop or an unparsable answer (with
  // the server-side fallback, a refusal that remains is an error at once).
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = reviewer.fallback ? await anthropic().beta.messages.create(item.p.body) : await anthropic().messages.create(item.p.body);
    const used = addAnthropicUsage(res.usage, reviewer.model);
    cost += used.cost;
    if (res.stop_reason === 'refusal' || res.stop_reason === 'max_tokens') {
      anthropicUsage.stopErrors++;
      last = `stop_reason ${res.stop_reason}`;
      if (reviewer.fallback && res.stop_reason === 'refusal') throw new Error(`refusal after server-side fallback (${res.model})`);
      continue;
    }
    const text = res.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
    let answer;
    try {
      answer = JSON.parse(text);
    } catch {
      last = `not JSON: ${text.slice(0, 120)}`;
      continue;
    }
    const served = res.model && res.model !== reviewer.model ? {servedBy: res.model} : {};
    return answerRow(item, version, answer, reviewer, {cost, tokens: used.tokens, ms: Date.now() - t0, ...served});
  }
  throw new Error(`no answer after 2 tries (${last})`);
}

async function reviewOne(item, version, reviewer) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    const t0 = Date.now();
    const res = await chat(item.p.body);
    const content = res.choices?.[0]?.message?.content ?? '';
    let answer;
    try {
      answer = JSON.parse(content.replace(/^```(?:json)?\s*|\s*```$/g, ''));
    } catch {
      last = `not JSON: ${content.slice(0, 120)}`;
      continue;
    }
    answer.verdict = String(answer.verdict ?? '').toLowerCase().replace(/[_ ]/g, '-');
    if (!['covered', 'gap', 'not-applicable'].includes(answer.verdict)) {
      last = `no verdict: ${content.slice(0, 120)}`;
      continue;
    }
    return answerRow(item, version, answer, reviewer, {cost: res.usage?.cost ?? 0, ms: Date.now() - t0});
  }
  throw new Error(`no JSON answer after 3 tries (${last})`);
}

/** The cache row of a model answer. */
function answerRow(item, version, answer, reviewer, extra) {
  const {final, why} = verify(answer, item.p.ranges);
  const quote = ws(String(answer.quote ?? ''));
  return {
    id: item.u.id,
    hash: item.p.hash,
    prompt: version,
    model: reviewer.model,
    ...(reviewer.effort ? {effort: reviewer.effort} : {}),
    verdict: answer.verdict,
    final,
    ...(why ? {why} : {}),
    file: answer.file || '',
    line: Number(answer.line) || 0,
    quote,
    quoteHash: quote ? sha(quote).slice(0, 12) : '',
    reason: String(answer.reason ?? '').slice(0, 400),
    ...(answer.parts ? {parts: answer.parts} : {}),
    ...(reviewer.final ? {feature: answer.verdict === 'gap' ? String(answer.feature ?? '').trim().slice(0, 120) : ''} : {}),
    ...extra,
  };
}

// --- Gap queue -------------------------------------------------------------------------

/**
 * Writes `review-gaps/<component>.md`: units reviewed as `gap` or
 * `unverified`, grouped by component dir (or page slug for foundation pages).
 * @param {{u: object, dirs: string[]}[]} items
 * @param {Map<string, object>} results
 */
export function writeGapQueue(items, results, mode = REVIEW_MODE) {
  rmSync(GAPS_DIR, {recursive: true, force: true});
  mkdirSync(GAPS_DIR, {recursive: true});
  if (mode === 'agree') return writeAgreeQueue(items, results);
  const groups = new Map();
  for (const {u, dirs} of items) {
    const r = results.get(u.id);
    if (!r || (mode === 'cover' && r.final !== 'gap' && r.final !== 'unverified')) continue;
    const name = dirs?.[0] ?? u.slug;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push({u, r});
  }
  const triage = mode !== 'cover';
  const ORDER = ['covered', 'unverified', 'gap', 'not-applicable'];
  const index = triage
    ? ['# Review queue (triage)', '', `Uncovered spec units with the verdict of ${MODEL}, which only orders the review (REVIEW_MODE = triage in scripts/m3/spec-review.mjs: the model covers nothing). Per component: \`covered\` (quote verified; confirm and cite) first, then \`unverified\`, \`gap\` (build queue), \`not-applicable\`. Generated by \`node scripts/m3/spec-checks.mjs --review\`.`, '', '| Component | Covered (to confirm) | Unverified | Gaps | Not applicable |', '| --- | ---: | ---: | ---: | ---: |']
    : ['# Review gaps (build queue)', '', `Uncovered spec units that ${MODEL} reviewed as \`gap\` (or \`covered\` without a verifiable quote: \`unverified\`). Generated by \`node scripts/m3/spec-checks.mjs --review\`; build, then cite with \`// spec: <id>\`.`, '', '| Component | Gaps | Unverified |', '| --- | ---: | ---: |'];
  const gapsOf = (list) => list.filter((x) => x.r.final === 'gap' || x.r.final === 'unverified').length;
  for (const [name, all] of [...groups].sort((a, b) => gapsOf(b[1]) - gapsOf(a[1]))) {
    const list = triage ? ORDER.flatMap((v) => all.filter((x) => x.r.final === v)) : all;
    const md = [triage ? `# ${name}: ${list.length} reviewed units (${gapsOf(list)} gaps)` : `# ${name}: ${list.length} review gaps`, ''];
    let section;
    let verdict;
    for (const {u, r} of list) {
      if (triage && r.final !== verdict) {
        verdict = r.final;
        section = undefined;
        md.push('', `# Verdict: ${verdict}`, '');
      }
      if (u.section !== section) {
        section = u.section;
        md.push('', `## ${u.headings.slice(1).join(' > ') || '(intro)'} \`${u.section}\``, '');
      }
      const text = u.text.replace(/\s+/g, ' ');
      const at = r.final === 'covered' ? ` → ${r.file}:${r.line}` : '';
      md.push(`- \`${u.id}\`${r.final === 'unverified' && !triage ? ' (unverified)' : ''}: ${text.length > 300 ? `${text.slice(0, 300)}…` : text}${at}\n  - ${r.reason}${r.why ? ` [${r.why}]` : ''}`);
    }
    writeFileSync(join(GAPS_DIR, `${name}.md`), md.join('\n') + '\n');
    const n = (v) => list.filter((x) => x.r.final === v).length;
    index.push(triage ? `| [${name}](${name}.md) | ${n('covered')} | ${n('unverified')} | ${n('gap')} | ${n('not-applicable')} |` : `| [${name}](${name}.md) | ${n('gap')} | ${n('unverified')} |`);
  }
  writeFileSync(join(GAPS_DIR, 'index.md'), index.join('\n') + '\n');
  return groups;
}

/** Queue categories of agree mode, in queue order, with their headings. */
export const AGREE_QUEUE = {
  'gap': 'gap (build queue)',
  'disagree': 'models disagree',
  'unverified': 'unverified (claimed covered, quote check failed)',
  'not-applicable?': 'model: not applicable? (confirm)',
  'pending': 'pending (a verdict is missing: not run, refusal or error)',
};

/** The agree-mode queue: every reviewed unit that is not covered or binding not-applicable. */
function writeAgreeQueue(items, results) {
  const groups = new Map();
  for (const {u, dirs} of items) {
    const r = results.get(u.id);
    if (!r || !(r.final in AGREE_QUEUE)) continue;
    const name = dirs?.[0] ?? u.slug;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push({u, r});
  }
  const cats = Object.keys(AGREE_QUEUE);
  const index = [
    '# Review queue (agree mode)',
    '',
    `Uncovered spec units left after the two-model agreement (${PRIMARY.model} + ${SECOND.model}) and the final gate (${FINAL.model}, binding), see REVIEW_MODE in scripts/m3/spec-review.mjs. Every model's verdict and reason is listed per unit. Generated by \`node scripts/m3/spec-checks.mjs --review\`; build, then cite with \`// spec: <id>\`.`,
    '',
    `| Component | Total | ${cats.map((c) => AGREE_QUEUE[c]).join(' | ')} |`,
    `| --- | ---: | ${cats.map(() => '---:').join(' | ')} |`,
  ];
  for (const [name, all] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
    const md = [`# ${name}: ${all.length} units to review`, ''];
    for (const c of cats) {
      const list = all.filter((x) => x.r.final === c);
      if (!list.length) continue;
      md.push('', `# ${AGREE_QUEUE[c]} (${list.length})`, '');
      let section;
      for (const {u, r} of list) {
        if (u.section !== section) {
          section = u.section;
          md.push('', `## ${u.headings.slice(1).join(' > ') || '(intro)'} \`${u.section}\``, '');
        }
        const text = u.text.replace(/\s+/g, ' ');
        md.push(`- \`${u.id}\`: ${text.length > 300 ? `${text.slice(0, 300)}…` : text}`);
        for (const n of r.notes ?? []) md.push(`  - ${n.model}: ${n.final}${n.at && n.final !== 'gap' && n.final !== 'not-applicable' ? ` at ${n.at}` : ''}${n.why ? ` [${n.why}]` : ''}. ${n.reason}`);
      }
    }
    writeFileSync(join(GAPS_DIR, `${name}.md`), md.join('\n') + '\n');
    index.push(`| [${name}](${name}.md) | ${all.length} | ${cats.map((c) => all.filter((x) => x.r.final === c).length).join(' | ')} |`);
  }
  writeFileSync(join(GAPS_DIR, 'index.md'), index.join('\n') + '\n');
  writeFeatures(items, results);
  return groups;
}

/** Normative wording counted per feature. */
const NORMATIVE = /\b(must|should|never|don['’]t|do not)\b/i;

/**
 * `review-gaps/features.md`: the final gate's gaps grouped by the missing
 * feature it named, sorted by component then size.
 */
function writeFeatures(items, results) {
  const byFeature = new Map();
  for (const {u, dirs} of items) {
    const r = results.get(u.id);
    if (r?.final !== 'gap' || r.stage !== 3) continue;
    const feature = r.feature || `${featureComponent(u, dirs)}: (unnamed)`;
    if (!byFeature.has(feature)) byFeature.set(feature, {component: feature.split(':')[0].trim(), name: feature.slice(feature.indexOf(':') + 1).trim(), units: []});
    byFeature.get(feature).units.push(u);
  }
  const rows = [...byFeature.values()].sort((a, b) => (a.component < b.component ? -1 : a.component > b.component ? 1 : b.units.length - a.units.length));
  const md = [
    '# Missing features (final-gate gaps)',
    '',
    `${rows.length} distinct features named by ${FINAL.model} for ${rows.reduce((n, f) => n + f.units.length, 0)} gap units. "Normative": sentences with must / should / never / don't / do not. Generated by \`node scripts/m3/spec-checks.mjs --review\`.`,
    '',
    '| Component | Feature | Sentences | Normative | Example units |',
    '| --- | --- | ---: | ---: | --- |',
    ...rows.map((f) => `| ${f.component} | ${f.name.replace(/\|/g, '\\|')} | ${f.units.length} | ${f.units.filter((u) => NORMATIVE.test(u.text)).length} | ${f.units.slice(0, 3).map((u) => `\`${u.id}\``).join(', ')} |`),
  ];
  writeFileSync(join(GAPS_DIR, 'features.md'), md.join('\n') + '\n');
}

function sha(s) {
  return createHash('sha256').update(s).digest('hex');
}

// --- CLI -------------------------------------------------------------------------------

async function main() {
  const argv = process.argv.slice(2);
  const option = (name) => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const {loadUnits} = await import('./spec-units.mjs');
  const {PAGE_DIRS, findCandidates} = await import('./spec-autocite.mjs');
  const version = Number(option('--prompt') ?? PROMPT);
  const maxUsd = Number(option('--max-usd') ?? 5);
  const limit = Number(option('--limit') ?? Infinity);
  const gold = option('--gold');
  const reviewer = {first: PRIMARY, second: SECOND, final: FINAL}[option('--reviewer') ?? 'first'];
  if (!reviewer) throw new Error('--reviewer must be first, second or final');
  const api = hasKey(reviewer.provider) && !argv.includes('--offline');
  if (!hasKey(reviewer.provider)) console.log(`${PROVIDERS[reviewer.provider].keyVar} not set: cache only.`);

  const units = new Map(loadUnits().map((u) => [u.id, u]));
  const report = JSON.parse(readFileSync('.m3-specs/spec-checks/report.json', 'utf8'));
  const reported = new Map(report.pages.flatMap((p) => p.uncovered).map((x) => [x.id, x]));
  const dirsOf = (u) => PAGE_DIRS[u.slug] ?? [];
  const started = Date.now();

  if (gold) {
    const set = JSON.parse(readFileSync(gold, 'utf8')).filter((g) => units.has(g.id));
    const extracted = new Map();
    if (existsSync('.m3-specs/spec-checks/extracted.jsonl')) {
      for (const l of readFileSync('.m3-specs/spec-checks/extracted.jsonl', 'utf8').split('\n')) if (l.trim()) {
        const r = JSON.parse(l);
        extracted.set(r.id, r);
      }
    }
    const need = set.filter((g) => !reported.get(g.id)?.candidates).map((g) => units.get(g.id));
    const found = findCandidates(need, extracted);
    const items = set.map((g) => {
      const u = units.get(g.id);
      return {u, dirs: dirsOf(u), candidates: reported.get(g.id)?.candidates ?? found.get(g.id) ?? []};
    });
    const {results} =
      reviewer !== PRIMARY && BATCH
        ? await reviewBatches(items, {api, maxUsd, limit, reviewer})
        : await reviewUnits(items, {api, maxUsd, limit, version: reviewer === PRIMARY ? version : 3, reviewer});
    printConfusion(set, results);
    const hand = set.filter((g) => g.source === 'gold');
    if (hand.length && hand.length < set.length) {
      console.log(`\nHand-labelled gold only (${hand.length}):`);
      printConfusion(hand, results);
    }
    const wrong = set.filter((g) => g.expect === 'gap' && results.get(g.id)?.final === 'covered');
    if (wrong.length) console.log('\nKnown gaps judged covered:');
    for (const g of wrong) {
      const r = results.get(g.id);
      console.log(`- ${g.id} [${g.source ?? ''}] -> ${r.file}:${r.line}\n    ${units.get(g.id).text.slice(0, 240)}\n    quote: ${r.quote.slice(0, 200)}\n    ${r.reason}`);
    }
    console.log(`Cost this run: ${costLine()}, ${((Date.now() - started) / 1000).toFixed(0)}s.`);
    return;
  }

  const items = [...reported.values()]
    .filter((x) => !x.rep && units.has(x.id))
    .map((x) => ({u: units.get(x.id), dirs: dirsOf(units.get(x.id)), candidates: x.candidates ?? []}));
  const agree = REVIEW_MODE === 'agree';
  const out = agree
    ? await reviewAgree(items, {api: !argv.includes('--offline'), maxUsd, maxUsdFinal: Number(option('--max-usd-final') ?? 120), limit})
    : await reviewUnits(items, {api, maxUsd, limit, version});
  const {results, note} = out;
  const groups = writeGapQueue(items, results);
  const count = {};
  for (const r of results.values()) count[r.final] = (count[r.final] ?? 0) + 1;
  if (agree) console.log('Stages:', JSON.stringify(out.stages));
  console.log(`Verdicts for ${results.size}/${items.length} units:`, count, note ? `(${note})` : '');
  console.log(`Gap queue: ${GAPS_DIR}/ (${[...groups.values()].reduce((n, g) => n + g.length, 0)} units, ${groups.size} components).`);
  console.log(`Cost this run: ${costLine()}, ${((Date.now() - started) / 1000).toFixed(0)}s.`);
  console.log('Run `node scripts/m3/spec-checks.mjs` to apply the verdicts.');
}

/** USD and token totals of this process. */
export function costLine() {
  if (!anthropicUsage.calls) return `$${usage.cost.toFixed(4)} (${usage.calls} calls, ${usage.inputTokens} in / ${usage.outputTokens} out tokens)`;
  const a = anthropicUsage;
  const prompt = a.input + a.cacheWrite + a.cacheRead;
  const per = Object.entries(anthropicByModel).map(([m, x]) => `${m} $${x.cost.toFixed(4)} / ${x.calls} calls`).join(', ');
  return `$${spent().toFixed(4)} (${a.calls} calls; ${a.input} input, ${a.cacheWrite} cache write, ${a.cacheRead} cache read (${prompt ? ((a.cacheRead / prompt) * 100).toFixed(1) : 0}%), ${a.output} output tokens; ${per})`;
}

/** Confusion table of a calibration run; gate: false-covered <= 5% and gap recall >= 90%. */
function printConfusion(set, results) {
  const cols = ['covered', 'unverified', 'gap', 'not-applicable', '(none)'];
  const rows = {};
  for (const g of set) {
    const f = results.get(g.id)?.final ?? '(none)';
    rows[g.expect] ??= Object.fromEntries(cols.map((c) => [c, 0]));
    rows[g.expect][f]++;
  }
  console.log(`\n| expected \\ judged | ${cols.join(' | ')} | total |`);
  console.log(`| --- | ${cols.map(() => '---:').join(' | ')} | ---: |`);
  for (const [k, r] of Object.entries(rows)) console.log(`| ${k} | ${cols.map((c) => r[c]).join(' | ')} | ${cols.reduce((n, c) => n + r[c], 0)} |`);
  const gap = rows.gap;
  if (gap) {
    const n = cols.reduce((s, c) => s + gap[c], 0) - gap['(none)'];
    const falseCovered = gap.covered / n;
    const recall = (gap.gap + gap.unverified) / n;
    console.log(`\nKnown gaps: false-covered ${(falseCovered * 100).toFixed(1)}% (${gap.covered}/${n}), gap recall ${(recall * 100).toFixed(1)}% (${gap.gap + gap.unverified}/${n}), not-covered incl. n/a ${(((n - gap.covered) / n) * 100).toFixed(1)}%.`);
    console.log(`Gate (false-covered <= 5% and gap recall >= 90%): ${falseCovered <= 0.05 && recall >= 0.9 ? 'PASS' : 'FAIL'}`);
  }
  if (rows.covered) {
    const c = rows.covered;
    const n = cols.reduce((s, k) => s + c[k], 0) - c['(none)'];
    console.log(`Known covered: verified covered ${((c.covered / n) * 100).toFixed(1)}% (${c.covered}/${n}).`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
