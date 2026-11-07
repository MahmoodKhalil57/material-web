#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Writes the "Spec compliance" page of the 3.0 catalog from local data:
 * numbers and unit ids only, no spec text.
 *
 *   node scripts/m3/gen-compliance-page.mjs          # rewrite the page
 *   node scripts/m3/gen-compliance-page.mjs --check  # exit 1 if it is stale
 *
 * Sources: .m3-specs/spec-checks/units.json (spec-checks.mjs output),
 * scripts/m3/exclusions/*.md, `audit-gb.mjs --gaps`, `gb-baseline.mjs`,
 * scripts/size/gb-budgets.json, and the axe and ARIA row files in
 * labs/gb/components/shared/central/.
 */

import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const OUT = 'docs/3.0/about/compliance.md';
const UNITS = '.m3-specs/spec-checks/units.json';
const EXCLUSIONS = 'scripts/m3/exclusions';
const CENTRAL = 'labs/gb/components/shared/central';
const BUILDABLE = 0.3;
const check = process.argv.includes('--check');

const run = (script, args = []) => {
  try {
    return execFileSync(process.execPath, [script, ...args], {
      encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    return (err.stdout ?? '').toString();
  }
};
const n = (x) => x.toLocaleString('en-US');
const table = (head, rows, align = []) => [
  `| ${head.join(' | ')} |`,
  `| ${head.map((_, i) => (i === 0 ? '---' : align[i] ?? '---:')).join(' | ')} |`,
  ...rows.map((r) => `| ${r.join(' | ')} |`),
].join('\n');

// 1. Spec units.
if (!existsSync(UNITS)) {
  console.error(`${UNITS} is missing; run \`node scripts/m3/spec-checks.mjs --offline\` first.`);
  process.exit(check ? 0 : 1);
}
const units = JSON.parse(await readFile(UNITS, 'utf8'));

// Exclusion reasons: unit id -> reason (the bullet text in scripts/m3/exclusions).
const reasonOf = new Map();
for (const f of (await readdir(EXCLUSIONS)).filter((f) => f.endsWith('.md') && f !== 'README.md').sort()) {
  for (const line of (await readFile(join(EXCLUSIONS, f), 'utf8')).split('\n')) {
    const m = /^- (.*?)\s*<!-- spec-exclude: ([^>]*?) -->/.exec(line);
    if (!m) continue;
    const reason = m[1].split(/[:;]\s/)[0].replace(/\s+/g, ' ').trim();
    for (const id of m[2].split(',')) reasonOf.set(id.trim(), reason.length > 100 ? `${reason.slice(0, 97)}...` : reason);
  }
}

const isTracked = (u) => u.status === 'tracked' || u.status === 'gap' || u.status === 'spec-gap';
const blank = () => ({units: 0, buildable: 0, tested: 0, excluded: 0, tracked: 0, uncovered: 0});
const total = blank();
const pages = new Map();
const reasons = new Map();
const sections = new Map();
for (const u of units) {
  const page = u.page.replace(/^components\//, '').replace(/\.md$/, '');
  const row = pages.get(page) ?? pages.set(page, blank()).get(page);
  for (const r of [row, total]) {
    r.units++;
    if (u.buildable >= BUILDABLE) r.buildable++;
    if (u.tested) r.tested++;
    if (u.status === 'excluded') r.excluded++;
    if (isTracked(u)) r.tracked++;
    if (u.buildable >= BUILDABLE && !u.status && !u.tested) r.uncovered++;
  }
  if (u.status === 'excluded') {
    const reason = reasonOf.get(u.id) ?? (u.rule === 'short-label' ? 'Short label covered by its section' : 'No reason recorded');
    reasons.set(reason, (reasons.get(reason) ?? 0) + 1);
  }
  const key = u.page.startsWith('components/') ? 'components' : u.page.split('/')[0];
  sections.set(key, (sections.get(key) ?? 0) + 1);
}
const unitRows = [...pages].sort(([a], [b]) => a.localeCompare(b)).map(([p, r]) =>
  [`\`${p}\``, n(r.units), n(r.buildable), n(r.tested), n(r.excluded), n(r.tracked), n(r.uncovered)]);
unitRows.push(['**Total**', ...Object.values(total).map((v) => `**${n(v)}**`)]);
const topReasons = [...reasons].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 10);
const reasonRows = topReasons.map(([r, c]) => [r, n(c)]);
const otherReasons = [...reasons.values()].reduce((s, c) => s + c, 0) - topReasons.reduce((s, [, c]) => s + c, 0);
if (otherReasons) reasonRows.push([`${reasons.size - topReasons.length} further reasons`, n(otherReasons)]);

// 2. Token audit.
const gaps = run('scripts/m3/audit-gb.mjs', ['--gaps']);
const tableStart = gaps.indexOf('component      decls');
const auditRows = [];
const auditTotals = /(\d[\d,]*) declarations: (\d+) match the spec, (\d+) derived, (\d+) drift \((\d+) high-confidence\), (\d+) have no spec token; (\d+) spec tokens/.exec(gaps);
if (tableStart >= 0) {
  for (const line of gaps.slice(tableStart).split('\n').slice(1)) {
    const c = line.trim().split(/\s+/);
    if (c.length === 8 && c.slice(1).every((x) => /^\d+$/.test(x))) auditRows.push([`\`${c[0]}\``, ...c.slice(1).map((x) => n(Number(x)))]);
  }
}
const driftNotes = [];
for (const block of run('scripts/m3/audit-gb.mjs').split(/^## /m).slice(1)) {
  const head = block.split('\n')[0].split(' ')[0];
  if (head === 'component') continue;
  for (const l of block.split('\n').filter((l) => /^\s+(E~|\?~|~)\s/.test(l))) {
    const mark = l.trim().split(/\s/)[0];
    const prop = /(--[\w-]+)/.exec(l)?.[1] ?? '';
    const where = /^\s+\S+\s+([^:]+):/.exec(l)?.[1] ?? '';
    const why = mark === 'E~' ? 'deliberate `// EDIT:` override' : mark === '~' ? 'out of date with its binding' : 'inferred binding that may be wrong';
    driftNotes.push([`\`${head}\``, `\`${where}\``, `\`${prop}\``, why]);
  }
}

// 3. axe and ARIA rows.
const axeSrc = await readFile(join(CENTRAL, 'axe-helpers.ts'), 'utf8');
const ariaSrc = await readFile(join(CENTRAL, 'aria-rows.ts'), 'utf8');
const slice = (src, from, to) => {
  const a = src.indexOf(from);
  const b = to ? src.indexOf(to, a) : -1;
  return src.slice(a, b < 0 ? undefined : b);
};
const count = (src, re) => (src.match(re) ?? []).length;
const axeInline = count(slice(axeSrc, 'export const AXE_ROWS', 'export const AXE_GAPS'), /^\s*\{id: '/gm);
const ariaExtra = count(slice(ariaSrc, 'const EXTRA', 'export const OVERLAY_ROWS'), /\bid: '/g);
const overlays = count(slice(ariaSrc, 'export const OVERLAY_ROWS', 'export const ARIA_ROWS'), /'[\w-]+'/g);
const gapKeys = (src, name) => [...slice(src, `export const ${name}`).split('= {').slice(1).join('= {').split(/^\s*};/m)[0].matchAll(/^\s{2}'?([\w-]+)'?:\s*[[{]/gm)].map((m) => m[1]);
const axeGaps = gapKeys(axeSrc, 'AXE_GAPS');
const ariaGaps = gapKeys(ariaSrc, 'ARIA_GAPS');
const list = (xs) => (xs.length ? xs.map((g) => `\`${g}\``).join(', ') : 'none');
const testFiles = (await readdir(CENTRAL)).filter((f) => /^(axe|aria)_(test|gap)\.ts$/.test(f)).sort();

// 4. Baseline.
const base = run('scripts/gb-baseline.mjs');
const cssLine = /CSS: (\d+) files, (\d+) feature uses mapped, (\d+) not widely available/.exec(base);
const jsLine = /JS APIs \(report only\): (\d+) source files, (\d+) tracked members/.exec(base);
const baseOk = /OK: no unguarded/.test(base);
let guarded = 0, allowed = 0, unguarded = 0, jsLimited = 0, jsUndetected = 0;
const baseLines = base.split('\n');
const jsAt = baseLines.findIndex((l) => l.includes('JS APIs'));
for (const [i, l] of baseLines.entries()) {
  const c = l.trim().split(/\s+/);
  if (!/^(css|api)\./.test(c[0]) || c.length < 5) continue;
  if (i < jsAt) {
    const [g, a, u] = c.slice(-3).map(Number);
    guarded += g; allowed += a; unguarded += u;
  } else {
    jsLimited++;
    if (/^\d+$/.test(c[2]) && /^\d+$/.test(c[3]) && Number(c[3]) < Number(c[2])) jsUndetected++;
  }
}

// 5. Size budgets.
const budgets = JSON.parse(await readFile('scripts/size/gb-budgets.json', 'utf8'));
const sizeRows = Object.entries(budgets.components).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) =>
  [`\`${k}\``, n(v.js), n(v.css)]);
const sum = (key) => Object.values(budgets.components).reduce((s, v) => s + v[key], 0);

const md = `---
title: Spec compliance
section: about
order: 2
description: What the spec checks, ARIA and axe results, Baseline use and size budgets say about md-gb-* components.
---

## How compliance is measured

The numbers on this page come from the repository itself and are regenerated
by \`node scripts/m3/gen-compliance-page.mjs\` (\`--check\` fails when this page
is stale). The M3 spec is downloaded with \`npm run m3:update\`, split into
**units** (a sentence, list item, table row or image description, each with an
id), and \`node scripts/m3/spec-checks.mjs --offline\` records what happens to
each one in \`.m3-specs/spec-checks/units.json\`. Only unit counts and ids are
used here, never spec text.

## Spec units

A unit is **buildable** when the classifier scores it at ${BUILDABLE} or more
(it describes something a component can do, not a caption or designer advice).
**Tested** units are cited from a \`*_test.ts\` file under \`labs/gb\` or
\`scripts/m3\` (\`spec: <unit id>\`). **Excluded** units have a written reason in
\`scripts/m3/exclusions/*.md\` (\`spec-exclude:\`). **Tracked** units are known
gaps listed in \`scripts/m3/CHECKLIST.md\` (\`spec-gap:\`). **Uncovered** units
are buildable, with no status and no test; the target is 0.

${table(['Spec page', 'Units', 'Buildable', 'Tested', 'Excluded', 'Tracked', 'Uncovered'], unitRows)}

${n(units.length)} units on ${pages.size} pages (${[...sections].map(([k, v]) => `${k}: ${n(v)}`).join(', ')}).
Buildable units that are neither tested nor excluded are covered another way:
a citation outside a test, a token value checked by the generated spec tests,
a unit judged covered by the LLM review, or a unit that is not a requirement
(image descriptions, overview notes). Those statuses are in \`units.json\` and
\`.m3-specs/spec-checks/report.md\`.

### Excluded units by reason

An exclusion is only valid when no code could satisfy the unit (designer
advice, app content, platform-only rules). If the library could enforce or
default it, it is tracked as a gap instead.

${table(['Reason (from scripts/m3/exclusions)', 'Units'], reasonRows, ['---', '---:'])}

## Token audit

\`node scripts/m3/audit-gb.mjs --gaps\` compares every token declaration in the
\`labs/gb\` token files with the M3 token database. **Match** means the value
equals the spec; **derived** means it is computed from a matching token;
**drift** differs from the spec; **no spec token** has no counterpart in the
database; **gaps** are tokens the Compose reference uses that no gb
declaration implements.

${auditTotals ? `Overall: ${auditTotals[1]} declarations, ${auditTotals[2]} match, ${auditTotals[3]} derived, ${auditTotals[4]} drift (${auditTotals[5]} high-confidence), ${auditTotals[6]} with no spec token, ${auditTotals[7]} spec tokens not implemented.` : 'The audit did not run.'}

${table(['Component', 'Declarations', 'Match', 'Derived', 'Drift', 'No spec token', 'Gaps', 'Unwired'], auditRows)}

${driftNotes.length ? `### Drift

Each drift is listed with the token file section, the custom property and why
it differs. \`E~\` is a deliberate \`// EDIT:\` override of a generated value;
\`?~\` is an inferred binding that may be wrong (the audit cannot always tell
which spec token a declaration belongs to).

${table(['Component', 'Section', 'Property', 'Reason'], driftNotes, ['---', '---', '---', '---'])}` : 'No token drifts.'}

## Accessibility

Two central suites render rows in \`${CENTRAL}\` and run in a real browser:

- **axe** (\`axe_test.ts\`): axe-core with no rule disabled, on every subject of
  the central table (\`subjects.ts\`) plus ${n(axeInline)} overlay rows in their
  open state (\`axe-helpers.ts\`).
- **ARIA 1.3** (\`aria_test.ts\`): the axe rows plus ${n(ariaExtra)} rows that put
  components in the states ARIA depends on (selected, checked, expanded,
  grouped, with panels, with an error), checked against the WAI-ARIA 1.3 role
  and attribute rules. ${n(overlays)} rows are open overlays, so the checks that
  flip state skip them.

Known gaps are rows with a real violation. They move to \`axe_gap.ts\` and
\`aria_gap.ts\` (red on purpose) and are recorded in \`AXE_GAPS\` and
\`ARIA_GAPS\`. Today: axe ${list(axeGaps)}; ARIA ${list(ariaGaps)}.
Suite files: ${list(testFiles)}.

## Baseline

\`npm run gb:baseline\` maps every CSS feature in the compiled \`labs/gb\` CSS
to its web-features Baseline status. A feature that is not widely available
must sit inside a matching \`@supports\` guard or be listed with a reason in
\`scripts/gb-baseline-allow.json\`; anything else fails the run.

${cssLine ? `- CSS: ${n(Number(cssLine[2]))} feature uses in ${cssLine[1]} files; ${cssLine[3]} features are not widely available, used ${guarded + allowed + unguarded} times (${guarded} guarded, ${allowed} allowed with a reason, **${unguarded} unguarded**). Result: ${baseOk ? 'passes' : 'fails'}.` : '- CSS: the check did not run (build the CSS with `npm run gb:check -- --all` first).'}
${jsLine ? `- JavaScript (report only): ${jsLine[2]} tracked Web API members in ${jsLine[1]} source files; ${jsLimited} are not widely available, ${jsUndetected} of them with at least one use that is not feature-detected.` : '- JavaScript: the report did not run.'}

## Size budgets

Each component has a Brotli size budget for JavaScript and CSS in
\`scripts/size/gb-budgets.json\`: the measured size plus ${Math.round(budgets.headroom * 100)}% headroom, enforced by
the size check. Totals across ${sizeRows.length} components: ${n(sum('js'))} bytes of JavaScript and ${n(sum('css'))} bytes of CSS.

${table(['Component', 'JS budget (bytes)', 'CSS budget (bytes)'], sizeRows)}
`;

if (check) {
  const current = existsSync(OUT) ? await readFile(OUT, 'utf8') : '';
  if (current !== md) {
    console.error(`${OUT} is stale; run \`node scripts/m3/gen-compliance-page.mjs\`.`);
    process.exit(1);
  }
  console.log(`${OUT} is up to date.`);
} else {
  await mkdir('docs/3.0/about', {recursive: true});
  await writeFile(OUT, md);
  console.log(`wrote ${OUT}: ${n(units.length)} units, ${total.uncovered} uncovered, ${auditRows.length} components audited.`);
}
