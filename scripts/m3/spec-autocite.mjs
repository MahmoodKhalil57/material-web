/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Mechanical reduction of the uncovered spec units (no LLM), run by
 * spec-checks.mjs after citations are scanned:
 *
 * 1. `not-a-requirement`: units that state no library requirement, by the
 *    explicit rules in `NAR_RULES` (Clef kind + no normative wording,
 *    designer-addressed sentences in usage sections, table status cells).
 * 2. `auto-token`: units stating a measurement / color role / shape / type
 *    scale / elevation whose value AND subject match a resolved token of the
 *    page's gb component (its `_*-tokens.scss` declarations and the
 *    `*_spec_test.ts` cases, with token values resolved through SpecDb).
 *    Every value in the unit must match, and every subject word of the unit
 *    ("track", "handle", "label") must be a word of the matching custom
 *    property, its mixin or its spec token. Numbers alone never match.
 * 3. `auto-section`: the value-less captions and intros of a Specs color /
 *    measurements / tokens section whose every value-bearing unit is
 *    `auto-token` (the section is then covered as a whole).
 * 4. Clusters: units with the same normalized text, or token sets with
 *    Jaccard >= 0.9, across pages. Citing any member covers the cluster;
 *    one representative per cluster is listed for review.
 *
 * Then, for each remaining uncovered representative, finds the top
 * `file:line` candidates in the component's sources by keyword search
 * (keys, values, ARIA words, content nouns), and writes one review file per
 * page to `.m3-specs/spec-checks/pages/`.
 *
 * With a `review` callback (spec-review.mjs, `spec-checks.mjs --review`), the
 * uncovered representatives then get the LLM review's verdicts: `auto-review`
 * (covered, with a verified quote) and `review-not-applicable`; cluster
 * members take their representative's verdict. Gaps stay uncovered.
 *
 * `scripts/m3/spec-autocite.json` (committed) holds only IDs, statuses, rule
 * names and evidence (file:line, custom property and token names), never
 * spec text.
 */

import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {COMPONENT_SETS, GB} from './gb-bindings.mjs';
import {SpecDb} from './spec-db.mjs';
import {slug} from './spec-units.mjs';

export const AUTOCITE_FILE = 'scripts/m3/spec-autocite.json';

/**
 * Spec page slug -> gb component dirs. A superset of gen-spec-tests.mjs'
 * SPEC_PAGES (which lists only pages whose token tables have tests).
 */
export const PAGE_DIRS = {
  'all-buttons': ['button'],
  'app-bars': ['appbar'],
  'badges': ['badge'],
  'bottom-sheets': ['sheet'],
  'button-groups': ['buttongroup'],
  'buttons': ['button'],
  'cards': ['card'],
  'carousel': ['carousel'],
  'checkbox': ['checkbox'],
  'chips': ['chip'],
  'date-pickers': ['datepicker'],
  'dialogs': ['dialog'],
  'divider': ['divider'],
  'extended-fab': ['fab'],
  'fab-menu': ['fabmenu'],
  'floating-action-button': ['fab'],
  'icon-buttons': ['iconbutton'],
  'lists': ['list'],
  'loading-indicator': ['loadingindicator'],
  'menus': ['menu'],
  'navigation-bar': ['navbar'],
  'navigation-drawer': ['navdrawer'],
  'navigation-rail': ['navrail'],
  'progress-indicators': ['progress'],
  'radio-button': ['radio'],
  'search': ['search'],
  'segmented-buttons': ['segmentedbutton'],
  'side-sheets': ['sheet'],
  'sliders': ['slider'],
  'snackbar': ['snackbar'],
  'split-button': ['splitbutton'],
  'switch': ['switch'],
  'tabs': ['tabs'],
  'text-fields': ['textfield'],
  'time-pickers': ['timepicker'],
  'toolbars': ['toolbar'],
  'tooltips': ['tooltip'],
  'layout-scaffold': ['scaffold'],
};

/** Rules for `not-a-requirement`; reported by name, reversible by deleting a rule. */
export const NAR_RULES = {
  'clef-description': 'Clef kind "description" with no normative wording (must/should/never/always/don\'t/avoid/required/only) and no capability, default or behavior wording (can/may/by default/contains/when/if/appears/moves/expands/...; see CAPABILITY); not a short label (list item or table cell of <= 4 words)',
  'clef-usage-advice': 'Clef kind "usage_advice", same wording conditions as clef-description',
  'usage-section-designer': 'In a Guidelines > Usage / Best practices / Examples type section, a sentence addressed to the app designer ("Use X to/when/for", "X is best for", "can be used to/for/in", "Consider", "Choose")',
  'designer-imperative': 'Clef kind "usage_advice" sentence that tells the designer which component or content to choose ("Use/Don\'t use/Avoid using/Choose/Consider/Place/Write/Keep ... concise")',
  'table-status-cell': 'Table cell that only says Available / Yes / No / -- / N/A / (default), under generic column headers only (Attribute, Value, Status, M3 Expressive): the requirement is the row\'s label unit',
  'image-description': 'Alt text of a spec image with no values (dp/px/%/ms, color roles, shapes, type scale) and no normative wording: it describes the picture; the rule it illustrates is stated in the text',
  'overview-notes': 'Overview tab (release notes, differences from M2, availability, resources) with no values: the features it announces are specified again in the Specs and Guidelines tabs',
};

/**
 * Short labels (list items / table cells of <= 4 words, no values): anatomy
 * part names, legend entries, variant names. They mean something only inside
 * their section, so they are covered by citing the section, not one by one.
 */
const LABEL_STATUS = 'label';

/**
 * Whether lone color roles in a Specs color legend count as covered when a
 * spec test checks that role. Off: the part they color is only in the image.
 */
const COLOR_LEGEND_AUTOCITE = false;

const MODAL = /\b(must|should(n.t)?|never|always|don.t|do not|can.t|cannot|required?|requires|need(s)? to|avoid|only|make sure|ensure)\b/i;
const USAGE_SECTION = /\/(usage|best-practices|when-to-use|choosing[a-z-]*|examples?|use-cases|principles|overview-principles)(\/|$)/;
const DESIGNER_SENTENCE = [
  /^(use|choose|consider|pick|select)\b(?! (the )?(arrow|tab|enter|space|escape|esc)\b)/i,
  /\b(is|are) (best|ideal|great|useful|well-suited|recommended) (for|in|when|to)\b/i,
  /\bcan (also )?be used (to|for|in|when|with|as|on)\b/i,
  /\b(is|are) (typically|often|commonly|primarily|generally) used\b/i,
  /\bhelp(s)? (people|users) (to )?(find|understand|choose|navigate|focus|take)\b/i,
];
const DESIGNER_IMPERATIVE = /^(use|don.t use|do not use|avoid using|choose|consider|place|don.t place|position|write|keep (the )?(label|text|title|headline|content|copy|it)\b.*\b(short|concise|brief|clear)|limit (the number|text|labels?)|pair|combine)\b/i;
const GENERIC_HEADER = /^(attribute|value|status|availability|available|m3 expressive|m3|baseline)$/i;
/** Wording of a capability, default or behavior: kept even when Clef calls it a description. */
const CAPABILITY = new RegExp(
  `\\b(can|could|may|by default|automatically|when|if|while|after|before|until|unless|has|have|consists? of|made up of|make sure|ensure|(${[
    'default', 'contain', 'include', 'start', 'appear', 'display', 'show', 'hide', 'move', 'change', 'expand', 'collapse', 'open', 'close',
    'scroll', 'resize', 'adapt', 'wrap', 'truncate', 'animate', 'transition', 'focus', 'select', 'place', 'position', 'align', 'anchor',
    'stay', 'remain', 'persist', 'reflow', 'swap', 'replace', 'dismiss', 'morph', 'shrink', 'grow', 'stretch', 'fill', 'span',
  ].join('|')})(s|es|d|ed|ing)?)\\b`,
  'i',
);
const STATUS_CELL =/^(available|not available|yes|no|n\/a|--|—|-|none|unavailable)( \(default\))?$/i;

// --- Value vocabulary -----------------------------------------------------------

const COLOR_ROLES = [
  'primary', 'on-primary', 'primary-container', 'on-primary-container', 'primary-fixed', 'primary-fixed-dim', 'on-primary-fixed', 'on-primary-fixed-variant',
  'secondary', 'on-secondary', 'secondary-container', 'on-secondary-container', 'secondary-fixed', 'secondary-fixed-dim', 'on-secondary-fixed', 'on-secondary-fixed-variant',
  'tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container', 'tertiary-fixed', 'tertiary-fixed-dim', 'on-tertiary-fixed', 'on-tertiary-fixed-variant',
  'error', 'on-error', 'error-container', 'on-error-container',
  'surface', 'on-surface', 'surface-variant', 'on-surface-variant', 'surface-dim', 'surface-bright',
  'surface-container-lowest', 'surface-container-low', 'surface-container', 'surface-container-high', 'surface-container-highest',
  'inverse-surface', 'inverse-on-surface', 'inverse-primary', 'outline', 'outline-variant', 'shadow', 'scrim', 'surface-tint',
];
// Longest first so "on primary container" wins over "primary".
const ROLE_RE = new RegExp(`\\b(${[...COLOR_ROLES].sort((a, b) => b.length - a.length).map((r) => r.replace(/-/g, '[ -]')).join('|')})\\b`, 'gi');
const SIZE = {xs: 'small', sm: 'small', md: 'medium', lg: 'large', xl: 'large'};
const TYPE_RE = /\b(display|headline|title|body|label)[ -](large|medium|small|lg|md|sm)\b(?:[ -]emphasized)?/gi;
const SHAPE_NAMES = {
  'none': 'none', 'extra small': 'xs', 'small': 'sm', 'medium': 'md', 'large': 'lg', 'large increased': 'lg-increased',
  'extra large': 'xl', 'extra large increased': 'xl-increased', 'extra extra large': 'xxl', 'full': 'full',
};
const SHAPE_RE = /\b(?:corner[ -])?(extra extra large|extra large increased|extra large|large increased|extra small|small|medium|large|full|none)\b(?:[ -]corner)?/gi;

const SYS_SHAPE_PX = {none: 0, xs: 4, sm: 8, md: 12, lg: 16, 'lg-increased': 20, xl: 28, 'xl-increased': 32, xxl: 48};

// --- Words ------------------------------------------------------------------------

const STOP = new Set(
  ('a an the of and or to for with in on at by is are be been being it its this that these those from as into onto than then ' +
    'use used using uses can may will each all any both either per via also only just now new standard default recommended optional ' +
    'min minimum max maximum approximately about around least most up down attribute value values xs xl sm md lg s m l x ' +
    'dp px measurement measurements specs spec size-xs element elements item items part parts slightly fully always ' +
    'when which who what where there here has have had do does not no yes available common configuration configurations variant variants ' +
    'type types style styles version m3 expressive baseline other same different such like more less much very ' +
    'light dark scheme schemes theme themes role roles token tokens set sets').split(' '),
);
const DIM = {
  height: 'height', tall: 'height', width: 'width', wide: 'width', size: 'size', diameter: 'size',
  shape: 'shape', corner: 'shape', radius: 'shape', rounded: 'shape', roundness: 'shape',
  padding: 'space', space: 'space', spacing: 'space', gap: 'space', margin: 'space', offset: 'space', distance: 'space',
  color: 'color', colour: 'color', elevation: 'elevation', shadow: 'elevation',
  font: 'type', typeface: 'type', typography: 'type', typescale: 'type', type: 'type',
};
const STATE_WORDS = new Set(['selected', 'unselected', 'pressed', 'hovered', 'hover', 'focused', 'focus', 'disabled', 'enabled', 'dragged', 'active', 'inactive', 'checked', 'unchecked', 'open', 'closed', 'collapsed', 'expanded']);
const QUALIFIER = {leading: 'leading', left: 'leading', start: 'leading', trailing: 'trailing', right: 'trailing', end: 'trailing', top: 'top', bottom: 'bottom'};

function singular(w) {
  if (w.length > 3 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 3 && w.endsWith('s') && !/(ss|us|is)$/.test(w)) return w.slice(0, -1);
  return w;
}

function words(text) {
  return (text.toLowerCase().match(/[a-z]+/g) ?? []).map(singular);
}

/** Component-name words of a page (`navigation-rail` -> navigation, rail, nav). */
function componentWords(pageSlug) {
  const w = new Set(words(pageSlug.replace(/-/g, ' ')));
  if (w.has('navigation')) w.add('nav');
  if (w.has('floating') || w.has('fab')) ['fab', 'floating', 'action', 'button', 'extended'].forEach((x) => w.add(x));
  return w;
}

/** Text without markdown links, emphasis and video/image wrappers. */
function plain(text) {
  return text
    .replace(/\[(?:VIDEO|IMAGE):\s*/g, '')
    .replace(/\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]+/g, '');
}

// --- Unit values and subject -----------------------------------------------------

/** `{values: [{kind, v}], subject: {parts, quals, dims}}` of a unit's text. */
export function unitClaims(text, colorSection = false) {
  let t = plain(text);
  const values = [];
  for (const m of t.matchAll(/(\d+(?:\.\d+)?)\s*(dp|px)\b/gi)) values.push({kind: 'px', v: Number(m[1])});
  // 48x48dp: both numbers.
  for (const m of t.matchAll(/(\d+(?:\.\d+)?)\s*x\s*\d+(?:\.\d+)?\s*(dp|px)\b/gi)) values.push({kind: 'px', v: Number(m[1])});
  t = t.replace(/\d+(?:\.\d+)?\s*(x\s*\d+(?:\.\d+)?\s*)?(dp|px)\b/gi, ' ');
  for (const m of t.matchAll(TYPE_RE)) {
    values.push({kind: 'type', v: `${m[1].toLowerCase()}-${SIZE[m[2].toLowerCase()] ?? m[2].toLowerCase()}`});
  }
  t = t.replace(TYPE_RE, ' ');
  // A role word is a color claim only in color context: a color section, the
  // word "color", the whole cell, or after a colon ("Search container: surface
  // container"); "Period selector outline" names a part.
  const colorContext = colorSection || /\bcolou?rs?\b/i.test(t);
  for (const m of t.matchAll(ROLE_RE)) {
    const before = t.slice(0, m.index);
    const whole = t.replace(/\((optional|default)\)/gi, '').trim().toLowerCase() === m[1].toLowerCase();
    if (colorContext || whole || /:\s*$/.test(before)) values.push({kind: 'role', v: m[1].toLowerCase().replace(/ /g, '-')});
  }
  t = t.replace(ROLE_RE, ' ');
  for (const m of t.matchAll(/\blevel\s*([0-5])\b/gi)) values.push({kind: 'elevation', v: Number(m[1])});
  t = t.replace(/\blevel\s*[0-5]\b/gi, ' ');
  // Words before shape names are only counted when the unit talks about shape.
  const ws = words(t);
  const dims = new Set(ws.filter((w) => DIM[w]).map((w) => DIM[w]));
  if (dims.has('shape')) {
    for (const m of t.matchAll(SHAPE_RE)) values.push({kind: 'shape', v: SHAPE_NAMES[m[1].toLowerCase()]});
    t = t.replace(SHAPE_RE, ' ');
  }
  const quals = new Set();
  const parts = new Set();
  for (const w of words(t)) {
    if (DIM[w] || STOP.has(w) || w.length < 3) continue;
    if (QUALIFIER[w]) quals.add(QUALIFIER[w]);
    else parts.add(w);
  }
  return {values, subject: {parts, quals, dims, pairs: pairsOf(words(t))}};
}

// --- gb facts -------------------------------------------------------------------

/**
 * Resolved token facts of a gb component dir:
 * `{words, dim, values: [{kind, v}], evidence}` per declaration / spec test case.
 */
function componentFacts(dir, db) {
  const facts = [];
  const base = join(GB, dir);
  if (!existsSync(base)) return facts;
  // Spec tokens bound to a property, from the generated spec tests.
  const tokensOf = new Map(); // `${mixin}|${prop}` -> [{token, where}]
  for (const f of readdirSync(base)) {
    if (!f.endsWith('_spec_test.ts')) continue;
    const path = `${base}/${f}`.replace(/\\/g, '/');
    const lines = readFileSync(path, 'utf8').split('\n');
    const start = lines.findIndex((l) => /^const CASES: SpecCase\[\] = \[/.test(l));
    if (start < 0) continue;
    const end = lines.findIndex((l, i) => i > start && /^\];/.test(l));
    let cases;
    try {
      cases = JSON.parse(`[${lines.slice(start + 1, end).join('\n')}]`);
    } catch {
      continue;
    }
    let li = start;
    for (const c of cases) {
      while (li < end && !lines[li].includes(`"token": ${JSON.stringify(c.token)}`)) li++;
      const where = `${path}:${li + 1}`;
      const mixin = c.mixin.split('.').at(-1);
      const key = `${mixin}|${c.prop}`;
      if (!tokensOf.has(key)) tokensOf.set(key, []);
      tokensOf.get(key).push({token: c.token, where});
      const vals = [...cssValues(c.spec), ...specDbValues(db, c.token)];
      facts.push({...fact([c.prop, mixin, c.token], c.prop, vals, `${where} ${c.token}`), token: c.token});
    }
  }
  for (const f of readdirSync(base)) {
    if (!/^_.*-tokens\.scss$/.test(f)) continue;
    const path = `${base}/${f}`.replace(/\\/g, '/');
    let mixin = 'root';
    readFileSync(path, 'utf8')
      .split('\n')
      .forEach((line, n) => {
        const mx = line.match(/^\s*@mixin\s+([\w-]+)/);
        if (mx) mixin = mx[1];
        const m = line.match(/^\s*--([\w-]+)\s*:\s*([^;]+);/);
        if (!m) return;
        const [, prop, value] = m;
        const bound = tokensOf.get(`${mixin}|${prop}`) ?? [];
        const vals = cssValues(value);
        if (!vals.length) return;
        facts.push(fact([prop, mixin, ...bound.map((b) => b.token)], prop, vals, `${path}:${n + 1} --${prop}`));
      });
  }
  return facts;
}

/** Adjacent word pairs ("time selector"), for compound part names. */
function pairsOf(ws) {
  const out = new Set();
  for (let i = 1; i < ws.length; i++) out.add(`${ws[i - 1]} ${ws[i]}`);
  return out;
}

function fact(names, prop, values, evidence) {
  const ws = new Set();
  const pairs = new Set();
  for (const n of names) {
    for (const x of pairsOf(words(n.replace(/[.-]/g, ' ')))) pairs.add(x);
    for (const w of words(n.replace(/[.-]/g, ' '))) {
      ws.add(w);
      if (QUALIFIER[w]) ws.add(QUALIFIER[w]);
    }
  }
  // The property's own dimension: the last dimension word of its name.
  const pw = words(prop.replace(/-/g, ' '));
  let dim;
  for (const w of pw) if (DIM[w]) dim = DIM[w];
  if (/(^|-)(gap|between)(-|$)/.test(prop)) dim = 'space';
  return {words: ws, pairs, dim, values, evidence};
}

/** Canonical values of a CSS declaration value. */
function cssValues(value) {
  const out = [];
  for (const m of value.matchAll(/(-?\d+(?:\.\d+)?)px\b/g)) out.push({kind: 'px', v: Number(m[1])});
  for (const m of value.matchAll(/--md-sys-space-(\d+)\b/g)) out.push({kind: 'px', v: (Number(m[1]) / 100) * 8});
  for (const m of value.matchAll(/--md-sys-color-([a-z-]+)/g)) out.push({kind: 'role', v: m[1]});
  for (const m of value.matchAll(/--md-sys-shape-corner-([a-z-]+?)(?:-(?:top|end|start|bottom))?\)/g)) {
    out.push({kind: 'shape', v: m[1]});
    if (SYS_SHAPE_PX[m[1]] !== undefined) out.push({kind: 'px', v: SYS_SHAPE_PX[m[1]]});
  }
  for (const m of value.matchAll(/--md-sys-typescale-(display|headline|title|body|label)-(lg|md|sm|large|medium|small)\b/g)) {
    out.push({kind: 'type', v: `${m[1]}-${SIZE[m[2]] ?? m[2]}`});
  }
  for (const m of value.matchAll(/--md-sys-elevation-(?:shadow|level)-?(\d)/g)) out.push({kind: 'elevation', v: Number(m[1])});
  return out;
}

/** The spec DB value of a token (dp length, color role, shape, type scale, elevation). */
function specDbValues(db, token) {
  const out = [];
  const r = db.resolve(token);
  if (!r) return out;
  const len = r.value?.length;
  if (len?.unit === 'DIPS') out.push({kind: 'px', v: len.value});
  const ref = r.ref ?? '';
  let m;
  if ((m = ref.match(/^md\.sys\.color\.([a-z-]+)$/))) out.push({kind: 'role', v: m[1]});
  if ((m = ref.match(/^md\.sys\.shape\.corner\.(.+)$/))) {
    const name = {'extra-small': 'xs', small: 'sm', medium: 'md', large: 'lg', 'large-increased': 'lg-increased', 'extra-large': 'xl', 'extra-large-increased': 'xl-increased', 'extra-extra-large': 'xxl', full: 'full', none: 'none'}[m[1]];
    if (name) out.push({kind: 'shape', v: name});
  }
  if ((m = ref.match(/^md\.sys\.typescale\.(display|headline|title|body|label)-(large|medium|small)/))) out.push({kind: 'type', v: `${m[1]}-${m[2]}`});
  if ((m = ref.match(/^md\.sys\.elevation\.level(\d)$/))) out.push({kind: 'elevation', v: Number(m[1])});
  return out;
}

/** Token sets of pages that share a gb dir with another page. */
const PAGE_SETS = {
  'bottom-sheets': ['md.comp.sheet.bottom'],
  'side-sheets': ['md.comp.sheet.side'],
  'floating-action-button': ['md.comp.fab'],
  'extended-fab': ['md.comp.extended-fab'],
};

/**
 * Whether a spec-tested token belongs to the page (its token sets) and to the
 * variant the color section names ("Assist chip color" -> `assist`), when the
 * component's tested tokens use that word at all.
 */
function legendScope(u, token, facts, cw) {
  const sets = PAGE_SETS[u.slug];
  if (sets && !sets.some((s) => token.startsWith(`${s}.`))) return false;
  const tested = facts.filter((f) => f.token).map((f) => f.token);
  const tw = new Set(words(token.replace(/[.-]/g, ' ')));
  for (const w of words(u.headings.slice(2).join(' '))) {
    if (cw.has(w) || STOP.has(w) || DIM[w] || w.length < 3) continue;
    if (tested.some((t) => words(t.replace(/[.-]/g, ' ')).includes(w)) && !tw.has(w)) return false;
  }
  return true;
}

const DIM_OF_KIND = {role: 'color', type: 'type', shape: 'shape', elevation: 'elevation'};

/** Whether a fact's dimension satisfies the unit's dimension words for a value kind. */
function dimOk(fact, dims, kind) {
  if (kind !== 'px') {
    if (fact.dim && fact.dim !== DIM_OF_KIND[kind] && !(kind === 'type' && /font|type/.test([...fact.words].join(' ')))) return false;
    return true;
  }
  if (!dims.size || !fact.dim) return false;
  for (const d of dims) {
    if (d === fact.dim) return true;
    if (d === 'size' && (fact.dim === 'height' || fact.dim === 'width')) return true;
    if ((d === 'height' || d === 'width') && fact.dim === 'size') return true;
  }
  return false;
}

function subjectOk(fact, subject, known) {
  for (const p of subject.parts) if (!fact.words.has(p)) return false;
  // A compound the component's tokens use ("time selector") must be the
  // fact's too: "period-selector" does not match "Time selector container".
  for (const x of subject.pairs ?? []) if (known.has(x) && !fact.pairs.has(x)) return false;
  if (subject.quals.size && ![...subject.quals].some((q) => fact.words.has(q))) return false;
  return true;
}

function valueEq(a, b) {
  return a.kind === b.kind && (a.kind === 'px' ? Math.abs(a.v - b.v) < 0.01 : a.v === b.v);
}

/** Evidence for every claimed value, or null. */
function matchClaims(claims, facts) {
  const {values, subject} = claims;
  if (!values.length) return null;
  const evidence = new Set();
  const known = new Set(facts.flatMap((f) => [...f.pairs]));
  for (const val of values) {
    const hit = facts.find((f) => dimOk(f, subject.dims, val.kind) && subjectOk(f, subject, known) && f.values.some((v) => valueEq(v, val)));
    if (!hit) return null;
    evidence.add(hit.evidence);
  }
  return [...evidence];
}

// --- Main -------------------------------------------------------------------------

/**
 * @param {object} o
 * @param {object[]} o.units all units (spec-units.mjs), page order
 * @param {(u: object) => boolean} o.isBuildable
 * @param {Map<string, object>} o.classified Clef results by unit ID
 * @param {Map<string, object>} o.extracted Clairic results by unit ID
 * @param {Map<string, string[]>} o.cited unit ID -> citation sites
 * @param {(reps: object[]) => Promise<Map<string, object>>} [o.review] LLM review
 *   of the uncovered representatives (`[{u, candidates}]`): unit ID -> verdict row
 * @param {boolean} [o.reviewCovers] whether verdicts set statuses (`cover`
 *   and `agree` modes) or are only attached to uncovered units as `review`
 *   (triage). In agree mode a row's `final` is the combined verdict of
 *   spec-review.mjs reviewAgree (`covered` names every model that counts).
 * @param {boolean} [o.reviewAcceptsNA] whether a `not-applicable` verdict
 *   becomes `review-not-applicable` (`cover` mode with
 *   ACCEPT_NOT_APPLICABLE, off by default). In agree mode only a binding
 *   verdict of the final gate (`binding: true`) does.
 * @return {Promise<{status: Map<string, object>, clusters: string[][], sections: object}>}
 */
export async function autocite({units, isBuildable, classified, extracted, cited, labelCited = new Map(), review, reviewCovers = false, reviewAcceptsNA = false}) {
  const db = await SpecDb.load('.m3-specs');
  const buildable = units.filter(isBuildable);
  const kindOf = (u) => classified.get(u.id)?.kind;
  /** id -> {status, rule?, evidence?} */
  const status = new Map();

  // Clusters first, so a citation of any member covers the cluster.
  const clusters = clusterUnits(buildable);
  const clusterOf = new Map();
  for (const c of clusters) for (const id of c) clusterOf.set(id, c);
  for (const u of buildable) {
    if (cited.has(u.id)) {
      status.set(u.id, {status: 'cited'});
      continue;
    }
    const via = (clusterOf.get(u.id) ?? []).find((id) => cited.has(id));
    if (via) status.set(u.id, {status: 'cited', rule: 'cluster', evidence: [via]});
  }

  // Token auto-coverage.
  const factsByDir = new Map();
  const factsFor = (pageSlug) => {
    const dirs = PAGE_DIRS[pageSlug] ?? [];
    const sets = PAGE_SETS[pageSlug];
    return dirs.flatMap((d) => {
      if (!factsByDir.has(d)) factsByDir.set(d, componentFacts(d, db));
      // Spec-tested tokens of a sibling page (bottom vs side sheet) do not count.
      return factsByDir.get(d).filter((f) => !sets || !f.token || sets.some((s) => f.token.startsWith(`${s}.`)));
    });
  };
  const index = new Map(units.map((u, i) => [u.id, i]));
  const claimsOf = new Map();
  const claims = (u) => {
    if (!claimsOf.has(u.id)) claimsOf.set(u.id, unitClaims(u.text, /colou?r/.test(u.section.split('/').at(-1))));
    return claimsOf.get(u.id);
  };
  for (const u of buildable) {
    if (status.has(u.id)) continue;
    const facts = factsFor(u.slug);
    if (!facts.length) continue;
    const c = claims(u);
    if (!c.values.length) continue;
    const cw = componentWords(u.slug);
    let subject = {...c.subject, parts: new Set([...c.subject.parts].filter((w) => !cw.has(w)))};
    let rule = 'token-value';
    // A table under "Corner sizes" states shapes without saying so per row.
    if (!subject.dims.size && subject.parts.size && u.kind === 'table-row') {
      const hd = new Set(words(u.headings.at(-1) ?? '').filter((w) => DIM[w]).map((w) => DIM[w]));
      if (hd.size === 1) subject = {...subject, dims: hd};
    }
    // A table value cell ("44dp | XS: 52dp") takes its subject from the label
    // cell before it ("Handle height").
    // Tables may group label cells under a part label ("Time selector
    // container", then "Width", "96dp", "Height", "80dp"): the part is the
    // nearest earlier label cell without a dimension word.
    let group = null;
    let ownTable = true;
    if (!subject.parts.size && !subject.dims.size && u.kind === 'table-row') {
      const k = index.get(u.id);
      const prev = units[k - 1];
      if (prev && prev.section === u.section && prev.kind === 'table-row' && !claims(prev).values.length) {
        const pc = claims(prev).subject;
        subject = {parts: new Set([...pc.parts].filter((w) => !cw.has(w))), quals: pc.quals, dims: pc.dims, pairs: pc.pairs};
        rule = 'token-value-label-cell';
        for (let j = k - 2; j >= 0 && j > k - 40; j--) {
          const x = units[j];
          if (x.section !== u.section || x.kind !== 'table-row') break;
          if (GENERIC_HEADER.test(plain(x.text).trim())) break;
          const xc = claims(x);
          if (xc.values.length || xc.subject.dims.size) continue;
          if (!/^[A-Z]/.test(plain(x.text).trim())) {
            ownTable = false;
            break;
          }
          group = new Set([...xc.subject.parts].filter((w) => !cw.has(w)));
          subject = {...subject, pairs: new Set([...subject.pairs, ...xc.subject.pairs])};
          break;
        }
        if (group?.size) subject = {...subject, parts: new Set([...subject.parts, ...group])};
      }
    }
    // A size / shape of the component itself is its container's (not when
    // the table names other parts above, which we could not read).
    if (!subject.parts.size && ownTable && !group && [...subject.dims].some((d) => ['height', 'width', 'size', 'shape'].includes(d))) {
      subject = {...subject, parts: new Set(['container'])};
      rule = rule === 'token-value' ? 'token-value-container' : rule;
    }
    // Color legend items ("Primary", "Surface container low (optional)") in a
    // color section: the part a role applies to is only in the spec image, so
    // a matching token can't prove the right part uses it. Kept uncovered
    // (needs a citation after review) to stay faithful to the spec; set
    // COLOR_LEGEND_AUTOCITE to true to count role matches anyway.
    const bare = plain(u.text).replace(/\((optional|default)\)/gi, '').replace(/^[A-Z0-9]{1,2}[.:]\s*/, '').trim();
    if (u.kind === 'list-item' && /color/.test(u.section.split('/').at(-1)) && c.values.length === 1 && c.values[0].kind === 'role' && words(bare).join('-') === c.values[0].v) {
      const role = c.values[0].v;
      const hit = COLOR_LEGEND_AUTOCITE && facts.find((f) => f.token && f.dim === 'color' && f.values.some((v) => v.kind === 'role' && v.v === role) && legendScope(u, f.token, facts, cw));
      if (hit) status.set(u.id, {status: 'auto-token', rule: 'color-legend-tested', evidence: [hit.evidence]});
      continue;
    }
    // "Size (unselected)": a state alone does not name the part (the part is
    // a group label further up the table).
    if (![...subject.parts].some((w) => !STATE_WORDS.has(w))) continue;
    const ev = matchClaims({values: c.values, subject}, facts);
    if (ev) status.set(u.id, {status: 'auto-token', rule, evidence: ev});
  }
  // The label cell of a matched value cell.
  for (const u of buildable) {
    if (status.has(u.id) || u.kind !== 'table-row' || claims(u).values.length) continue;
    const next = units[index.get(u.id) + 1];
    const s = next && status.get(next.id);
    if (s?.rule === 'token-value-label-cell' && next.section === u.section) {
      status.set(u.id, {status: 'auto-token', rule: 'token-label-cell', evidence: [next.id, ...s.evidence]});
    }
  }

  // Not a requirement.
  for (const u of buildable) {
    if (status.has(u.id)) continue;
    const rule = narRule(u, kindOf(u));
    if (rule) status.set(u.id, {status: 'not-a-requirement', rule});
  }

  // Section auto-coverage: Specs color / measurements / tokens sections.
  const sections = {};
  const bySection = new Map();
  for (const u of buildable) {
    if (!/\/specs?\//.test(`${u.section}/`) || !/(color|measurement|tokens|spec)/.test(u.section.split('/').at(-1))) continue;
    if (!bySection.has(u.section)) bySection.set(u.section, []);
    bySection.get(u.section).push(u);
  }
  for (const [section, list] of bySection) {
    const valued = list.filter((u) => claims(u).values.length);
    const auto = valued.filter((u) => status.get(u.id)?.status === 'auto-token');
    if (!auto.length || auto.length !== valued.filter((u) => status.get(u.id)?.status !== 'cited').length) continue;
    // Uncovered value-less units that a section citation would cover: captions
    // and intros, never normative sentences.
    const rest = list.filter((u) => !status.has(u.id));
    if (rest.some((u) => MODAL.test(u.text) || claims(u).values.length)) continue;
    for (const u of rest) status.set(u.id, {status: 'auto-section', rule: 'specs-section-all-tokens', evidence: [section]});
    sections[section] = {units: list.length, autoToken: auto.length};
  }

  // Short labels wait for a section citation.
  for (const u of buildable) {
    if (status.has(u.id)) continue;
    const text = plain(u.text).trim();
    // Not in Accessibility: short cells there are key names and labels that
    // keyboard tests and ARIA checks cite one by one.
    if ((u.kind === 'list-item' || u.kind === 'table-row') && words(text).length <= 4 && !hasValues(u) && !MODAL.test(text) && !/^accessib/.test(tabOf(u))) {
      // Covered when the section (or an enclosing one) has a `spec-labels:` citation.
      const parts = u.section.split('/');
      const where = parts.map((_, i) => labelCited.get(parts.slice(0, i + 1).join('/'))).find(Boolean);
      status.set(
        u.id,
        where
          ? {status: 'cited', rule: 'section-labels', evidence: where}
          : {status: LABEL_STATUS, rule: 'short-label', evidence: [u.section]},
      );
    }
  }

  for (const u of buildable) if (!status.has(u.id)) status.set(u.id, {status: 'uncovered'});

  // Representatives of the remaining units: the first uncovered member.
  for (const c of clusters) {
    const open = c.filter((id) => status.get(id).status === 'uncovered');
    for (const id of open) {
      const s = status.get(id);
      s.cluster = c.length;
      if (id !== open[0]) s.rep = open[0];
    }
  }

  const candidates = findCandidates(
    buildable.filter((u) => status.get(u.id).status === 'uncovered' && !status.get(u.id).rep),
    extracted,
  );
  for (const [id, list] of candidates) status.get(id).candidates = list;

  if (review) {
    const reps = buildable.filter((u) => status.get(u.id).status === 'uncovered' && !status.get(u.id).rep);
    const results = await review(reps.map((u) => ({u, candidates: status.get(u.id).candidates ?? []})));
    for (const u of buildable) {
      const s = status.get(u.id);
      if (s.status !== 'uncovered') continue;
      const r = results.get(s.rep ?? u.id);
      if (!r) continue;
      const via = s.rep ? {via: s.rep} : {};
      const rule = s.rep ? 'cluster' : 'llm-review';
      if (reviewCovers && r.final === 'covered') {
        const agree = r.models ? {models: r.models, quoteHashes: r.quoteHashes, final: r.stage === 3 ? r.models[0] : 'agreement'} : {quoteHash: r.quoteHash};
        status.set(u.id, {status: 'auto-review', rule, evidence: r.evidence ?? [`${r.file}:${r.line}`], model: r.model, ...agree, ...via});
      } else if (reviewCovers && r.final === 'not-applicable' && (r.binding || reviewAcceptsNA)) {
        status.set(u.id, {status: 'review-not-applicable', rule, reason: r.reason, model: r.model, ...via});
      } else {
        s.review = r.final;
        if (r.final === 'covered') s.reviewAt = `${r.file}:${r.line}`;
      }
    }
  }

  writeAutocite(status, clusters, sections);
  writePages(units, buildable, status, classified);
  return {status, clusters, sections};
}

/** Top-level tab of a unit: `overview`, `specs`, `guidelines`, `accessibility`, ... */
function tabOf(u) {
  return u.section.split('/')[1] ?? '';
}

/** Whether a unit states a value: dp/px/%/ms numbers or a color/shape/type token. */
function hasValues(u) {
  return /\d+(\.\d+)?\s?(dp|px|%|ms)\b/i.test(u.text) || unitClaims(u.text, /color/.test(u.section)).values.length > 0;
}

function narRule(u, kind) {
  const text = plain(u.text).trim();
  const short = (u.kind === 'list-item' || u.kind === 'table-row') && words(text).length <= 4;
  if (u.kind === 'image' && !hasValues(u) && !MODAL.test(text)) return 'image-description';
  if (/^overview/.test(tabOf(u)) && !hasValues(u)) return 'overview-notes';
  if (u.kind === 'table-row') {
    // Column headers are prefixes ("Square: Available"); a content header
    // carries the requirement, so every prefix must be generic too.
    const cells = text.split(' | ').flatMap((c) => c.split(/:\s*/)).map((c) => c.trim()).filter(Boolean);
    if (cells.every((c) => STATUS_CELL.test(c) || GENERIC_HEADER.test(c))) return 'table-status-cell';
  }
  const normative = MODAL.test(text) || CAPABILITY.test(text);
  if (kind === 'description' && !normative && !short) return 'clef-description';
  if (kind === 'usage_advice' && !normative && !short) return 'clef-usage-advice';
  // The rest of the sentence, without the designer phrase, must not state a
  // capability or behavior ("They're displayed in dialogs and can be used to").
  const rest = (re) => {
    const r = text.replace(re, ' ');
    return !MODAL.test(r) && !CAPABILITY.test(r);
  };
  if (USAGE_SECTION.test(u.section) && u.kind !== 'table-row') {
    const re = DESIGNER_SENTENCE.find((re) => re.test(text));
    if (re && rest(re)) return 'usage-section-designer';
  }
  if (kind === 'usage_advice' && u.kind === 'sentence' && DESIGNER_IMPERATIVE.test(text) && rest(DESIGNER_IMPERATIVE)) {
    return 'designer-imperative';
  }
  return null;
}

// --- Clusters -----------------------------------------------------------------------

/**
 * Clusters of unit IDs (size >= 2): identical normalized text, or token sets
 * with Jaccard >= 0.9. Units of fewer than 4 words are never clustered: short
 * labels and value cells ("Enabled", "8dp") mean different things in place.
 */
export function clusterUnits(units, threshold = 0.9) {
  const sets = units.map((u) => [...new Set(plain(u.text).toLowerCase().match(/[a-z0-9]+/g) ?? [])]);
  const eligible = units.map((u, i) => (sets[i].filter((w) => /[a-z]/.test(w)).length >= 4 ? i : -1)).filter((i) => i >= 0);
  const parent = units.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (a, b) => (parent[find(a)] = find(b));
  // Prefix filtering: sort each set by global rarity; two sets with
  // Jaccard >= t share a token among the first |s| - ceil(t|s|) + 1 tokens.
  const df = new Map();
  for (const i of eligible) for (const w of sets[i]) df.set(w, (df.get(w) ?? 0) + 1);
  const order = (w) => df.get(w);
  const sorted = new Map(eligible.map((i) => [i, [...sets[i]].sort((a, b) => order(a) - order(b) || (a < b ? -1 : 1))]));
  const prefixIndex = new Map();
  for (const i of eligible) {
    const s = sorted.get(i);
    const p = s.length - Math.ceil(threshold * s.length) + 1;
    const seen = new Set();
    for (const w of s.slice(0, p)) {
      for (const j of prefixIndex.get(w) ?? []) {
        if (seen.has(j)) continue;
        seen.add(j);
        const a = sets[i], b = sets[j];
        const small = Math.min(a.length, b.length), big = Math.max(a.length, b.length);
        if (small / big < threshold) continue;
        const bs = new Set(b);
        const as = new Set(a);
        let inter = 0;
        for (const x of a) if (bs.has(x)) inter++;
        // Words in only one of them must not change the subject ("Search app
        // bar ..." vs "App bar ..."): only stopwords and numbers may differ.
        const diff = [...a.filter((x) => !bs.has(x)), ...b.filter((x) => !as.has(x))];
        if (inter / (a.length + b.length - inter) >= threshold && diff.every((x) => STOP.has(singular(x)) || /^\d+$/.test(x))) union(i, j);
      }
      if (!prefixIndex.has(w)) prefixIndex.set(w, []);
      prefixIndex.get(w).push(i);
    }
  }
  const groups = new Map();
  for (const i of eligible) {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(units[i].id);
  }
  return [...groups.values()].filter((g) => g.length > 1);
}

// --- Candidate locations ------------------------------------------------------------

/** Spec key names -> `KeyboardEvent.key` / `.code` values, matched exactly in code. */
const KEYS = [
  [/\bShift\s*\+\s*Tab\b/, ['Tab', 'shiftKey']],
  [/\bTab\b(?! \d)/, ['Tab']],
  [/\b(Enter|Return)\b/, ['Enter']],
  [/\bSpace(bar)?\b/, [' ', 'Space']],
  [/\bEsc(ape)?\b/, ['Escape']],
  [/\bPage ?up\b/i, ['PageUp']],
  [/\bPage ?down\b/i, ['PageDown']],
  [/\bHome\b/, ['Home']],
  [/\bEnd\b/, ['End']],
  [/\b(Up|Down)\b.*\barrow|\b(up|down) arrow/i, ['ArrowUp', 'ArrowDown']],
  [/\b(Left|Right)\b.*\barrow|\b(left|right) arrow/i, ['ArrowLeft', 'ArrowRight']],
  [/\barrows?\b|\barrow keys?\b/i, ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']],
  [/\bDelete\b|\bBackspace\b/, ['Delete', 'Backspace']],
];
const KEY_VALUES = new Set(KEYS.flatMap(([, k]) => k));
const ARIA = /\b(aria-[a-z]+|role|label(l)?ed|screen reader|accessib\w*|focus\w*|announce\w*|live region|tabindex|disabled|selected|checked|expanded|pressed)\b/gi;

/** Indexed sources of a gb dir: lines with their word sets. */
function dirIndex(dir) {
  const files = [];
  const walk = (d) => {
    for (const e of readdirSync(d, {withFileTypes: true})) {
      const p = `${d}/${e.name}`;
      if (e.isDirectory()) {
        if (e.name !== 'demo' && e.name !== 'node_modules') walk(p);
      } else if (/\.(ts|scss)$/.test(e.name) && !/\.(d\.ts|cssresult\.ts)$/.test(e.name) && !/_spec_test\.ts$/.test(e.name)) files.push(p);
    }
  };
  if (existsSync(dir)) walk(dir);
  const lines = [];
  const df = new Map();
  const idents = new Set();
  for (const file of files) {
    const weight = /_test\.ts$/.test(file) ? 0.6 : 1;
    const ts = file.endsWith('.ts');
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((text, n) => {
        const comment = /^\s*(\/\/|\*|\/\*)/.test(text);
        const keys = new Set();
        if (!comment && ts) {
          for (const m of text.matchAll(/['"`]([^'"`]{1,12})['"`]|\b([A-Z][A-Za-z]+|shiftKey)\b/g)) {
            const k = m[1] ?? m[2];
            if (KEY_VALUES.has(k)) keys.add(`key:${k}`);
          }
        }
        const raw = text.match(/[A-Za-z][\w-]*|'[^']*'/g) ?? [];
        const ws = new Set();
        for (const r of raw) {
          const low = r.toLowerCase();
          ws.add(low);
          for (const p of r.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(/[^a-z]+/)) if (p) ws.add(singular(p));
          if (!comment) for (const p of r.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(/[^a-z]+/)) if (p.length > 2) idents.add(singular(p));
        }
        for (const m of text.matchAll(/(\d+(?:\.\d+)?)px/g)) ws.add(`${m[1]}px`);
        for (const k of keys) ws.add(k);
        if (!ws.size) return;
        for (const w of ws) df.set(w, (df.get(w) ?? 0) + 1);
        lines.push({file, n: n + 1, ws, weight: weight * (comment ? 0.6 : 1)});
      });
  }
  return {lines, df, idents};
}

export function findCandidates(units, extracted) {
  const indexes = new Map();
  const shared = dirIndex(`${GB}/shared`);
  const styles = dirIndex('styles');
  const out = new Map();
  for (const u of units) {
    const dirs = PAGE_DIRS[u.slug] ?? [];
    const text = plain(u.text);
    const pools = dirs.map((d) => {
      if (!indexes.has(d)) indexes.set(d, dirIndex(`${GB}/${d}`));
      return indexes.get(d);
    });
    pools.push(shared);
    if (!dirs.length || /\b(color|typescale|type scale|shape|corner|elevation|motion|easing|duration|spring|font)\b/i.test(text)) pools.push(styles);
    const terms = new Map(); // term -> weight
    const add = (w, weight) => terms.set(w, Math.max(weight, terms.get(w) ?? 0));
    for (const [re, codes] of KEYS) if (re.test(text)) for (const c of codes) add(`key:${c}`, 4);
    for (const k of extracted.get(u.id)?.keys ?? []) for (const [re, codes] of KEYS) if (re.test(k)) for (const c of codes) add(`key:${c}`, 4);
    for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s*dp\b/gi)) add(`${m[1]}px`, 2.5);
    for (const m of text.matchAll(ARIA)) for (const w of words(m[1])) if (w.length > 2) add(w, 2);
    const subj = new Set(words(extracted.get(u.id)?.subject ?? ''));
    for (const w of words(text)) {
      if (STOP.has(w) || w.length < 3 || terms.has(w)) continue;
      add(w, subj.has(w) ? 1.5 : 1);
    }
    const scored = [];
    for (const pool of pools) {
      const N = pool.lines.length || 1;
      const weights = new Map();
      for (const [w, t] of terms) {
        const df = pool.df.get(w);
        if (!df) continue;
        const idf = Math.log(1 + N / df);
        weights.set(w, t * idf * (pool.idents.has(w) || w.startsWith('key:') ? 2 : 1));
      }
      if (!weights.size) continue;
      for (const l of pool.lines) {
        let s = 0;
        let hits = 0;
        for (const [w, score] of weights) {
          if (!l.ws.has(w)) continue;
          s += score;
          hits++;
        }
        if (hits >= 2 || s >= 6) scored.push({where: `${l.file}:${l.n}`, file: l.file, n: l.n, s: s * l.weight * (pool === shared || pool === styles ? 0.7 : 1)});
      }
    }
    scored.sort((a, b) => b.s - a.s);
    const pick = [];
    for (const c of scored) {
      if (pick.some((p) => p.file === c.file && Math.abs(p.n - c.n) < 15)) continue;
      pick.push(c);
      if (pick.length === 3) break;
    }
    if (pick.length) out.set(u.id, pick.map((p) => p.where));
  }
  return out;
}

// --- Output --------------------------------------------------------------------------

function writeAutocite(status, clusters, sections) {
  const out = {
    note: 'Generated by scripts/m3/spec-checks.mjs (spec-autocite.mjs). IDs, rules and evidence only; no spec text.',
    rules: {
      'not-a-requirement': NAR_RULES,
      'auto-token': {
        'token-value': 'every dp / color role / shape / type scale / elevation value in the unit equals a resolved value of a gb token whose property, mixin or spec token names contain every subject word',
        'token-value-label-cell': 'token-value, with the subject from the table label cell before the value cell',
        'token-value-container': 'token-value of a size or shape stated for the component itself: matched against its container properties',
        'token-label-cell': 'a table label cell whose value cell is token-value-label-cell',
        'color-legend-tested': 'a lone color role in a Specs color legend (the numbered part is only in the image) that a generated spec test checks gb renders, for a token of this page and of the variant the section names',
      },
      'auto-section': {'specs-section-all-tokens': 'value-less captions/intros of a Specs color/measurements/tokens section whose every value-bearing unit is auto-token'},
      'cited': {cluster: 'another member of the unit\'s cluster is cited'},
      'auto-review': {
        'llm-review': 'LLM review (scripts/m3/spec-review.mjs): in agree mode either two models (models, final: agreement) both judged the shown code implements the unit, or the final-gate model (final: <model>) did after they did not agree; every quote (hashes given) was found in its cited file within ±5 lines of the cited line (evidence: one file:line per model)',
        'cluster': 'the cluster representative (via) is auto-review',
      },
      'review-not-applicable': {
        'llm-review': 'the final-gate LLM (model given; binding) judged the unit is not a requirement for a web component library (platform-only, app-designer or copy advice, design-process prose); reason given',
        'cluster': 'the cluster representative (via) is review-not-applicable',
      },
      'label': {'short-label': 'list item / table cell of <= 4 words with no values or normative wording (anatomy part, legend entry, variant name); covered by citing its section'},
    },
    autoToken: {},
    notARequirement: {},
    autoSection: {},
    /** section -> label unit IDs waiting for a section citation */
    labels: {},
    autoReview: {},
    reviewNotApplicable: {},
    clusters: clusters.map((c) => c),
    sections,
  };
  for (const [id, s] of [...status].sort(([a], [b]) => (a < b ? -1 : 1))) {
    if (s.status === 'auto-token') out.autoToken[id] = {rule: s.rule, evidence: s.evidence};
    else if (s.status === 'auto-section') out.autoSection[id] = s.evidence[0];
    else if (s.status === 'not-a-requirement') (out.notARequirement[s.rule] ??= []).push(id);
    else if (s.status === 'label') (out.labels[s.evidence[0]] ??= []).push(id);
    else if (s.status === 'auto-review') out.autoReview[id] = s.via ? {rule: s.rule, via: s.via} : {rule: s.rule, evidence: s.evidence, ...(s.models ? {models: s.models, quoteHashes: s.quoteHashes, final: s.final} : {model: s.model, quoteHash: s.quoteHash})};
    else if (s.status === 'review-not-applicable') out.reviewNotApplicable[id] = s.via ? {rule: s.rule, via: s.via} : {rule: s.rule, model: s.model, reason: s.reason};
  }
  writeFileSync(AUTOCITE_FILE, JSON.stringify(out, null, 1) + '\n');
}

const PAGES_DIR = '.m3-specs/spec-checks/pages';
const MAX_PER_FILE = 150;

function writePages(units, buildable, status, classified) {
  rmSync(PAGES_DIR, {recursive: true, force: true});
  mkdirSync(PAGES_DIR, {recursive: true});
  const byPage = new Map();
  for (const u of buildable) {
    if (!byPage.has(u.page)) byPage.set(u.page, []);
    byPage.get(u.page).push(u);
  }
  const index = ['# Remaining spec units per page', '', 'Generated by `node scripts/m3/spec-checks.mjs`. "Remaining" counts uncovered units; "Listed" counts the units listed for review (one per cluster of identical or near-identical text; citing it covers the cluster). Rules and evidence for the auto statuses: `scripts/m3/spec-autocite.json`.', '', '| Page | Buildable | Cited | Auto-token | Auto-section | Not a req. | Remaining | Listed | Files |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |'];
  for (const [page, list] of byPage) {
    const count = (st) => list.filter((u) => status.get(u.id).status === st).length;
    const listed = list.filter((u) => status.get(u.id).status === 'uncovered' && !status.get(u.id).rep);
    const elsewhere = list.filter((u) => status.get(u.id).rep).length;
    const s = list[0].slug;
    const files = [];
    for (const [name, group] of splitGroups(s, listed, 1)) {
      files.push(name);
      const md = [`# ${page}${name === s ? '' : ` (${group[0].headings.slice(1, group.depth + 1).join(' > ')})`}`, ''];
      md.push(`${group.length} remaining units to review${elsewhere && name === s ? `; ${elsewhere} more are duplicates of units listed on other pages` : ''}. Each line: ID, Clef kind, text, cluster size (×N), and candidate locations from keyword search. Cite with \`// spec: <id>\` or a section ID.`, '');
      let heading;
      for (const u of group) {
        if (u.heading !== heading) {
          heading = u.heading;
          md.push('', `## ${u.headings.slice(1).join(' > ') || '(intro)'} \`${u.section}\``, '');
        }
        const st = status.get(u.id);
        const text = plain(u.text).replace(/\s+/g, ' ').replace(/\|/g, '\\|');
        const cand = (st.candidates?.length ? ` → ${st.candidates.join(', ')}` : ' → (no candidates)') + (st.review ? ` · review: ${st.review}${st.reviewAt ? ` at ${st.reviewAt}` : ''}` : '');
        md.push(`- \`${u.id}\` _${classified.get(u.id)?.kind}_${st.cluster ? ` ×${st.cluster}` : ''}: ${text.length > 160 ? `${text.slice(0, 160)}…` : text}${cand}`);
      }
      writeFileSync(join(PAGES_DIR, `${name}.md`), md.join('\n') + '\n');
    }
    index.push(`| ${page} | ${list.length} | ${count('cited')} | ${count('auto-token')} | ${count('auto-section')} | ${count('not-a-requirement')} | ${count('uncovered')} | ${listed.length} | ${files.map((f) => `[${f}](${f}.md)`).join(' ')} |`);
  }
  writeFileSync(join(PAGES_DIR, 'index.md'), index.join('\n') + '\n');
}

/** [[fileName, units]] with at most MAX_PER_FILE units each, split by heading level. */
function splitGroups(name, list, depth) {
  if (list.length <= MAX_PER_FILE || depth > 3) {
    const g = [...list];
    g.depth = depth - 1;
    return [[name, g]];
  }
  const by = new Map();
  for (const u of list) {
    const h = u.headings[depth] ?? '';
    if (!by.has(h)) by.set(h, []);
    by.get(h).push(u);
  }
  if (by.size === 1) return splitGroups(name, list, depth + 1);
  return [...by].flatMap(([h, g]) => splitGroups(`${name}--${slug(h || 'intro')}`, g, depth + 1));
}
