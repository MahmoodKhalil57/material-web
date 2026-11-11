/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The docs' search index and its ranking, shared by the search bar
 * (search.ts) and the WebMCP tools (webmcp.ts).
 *
 * - The index (/3.0/search-index.json, site/content/search-index.11ty.cjs)
 *   is fetched on first use and kept for the page.
 * - Ranking: every word of the query should match the page (title,
 *   description) or a section (heading, identifiers, text), by prefix, or
 *   with one typo for longer words. Titles weigh most; a query naming an
 *   element (md-gb-<name>) ranks its component page first.
 */

/** Index format: see site/content/search-index.11ty.cjs. */
interface RawPage {
  u: string;
  t: string;
  s: string;
  d: string;
  x: Array<[string, string, string, string]>;
}

export interface Section {
  page: Page;
  id: string;
  heading: string;
  text: string;
  idents: string;
  lowHeading: string;
  lowText: string;
}

export interface Page {
  url: string;
  title: string;
  section: string;
  description: string;
  slug: string;
  lowTitle: string;
  sections: Section[];
}

/** word -> [sectionIndex, count, ...] per field. */
type Postings = Map<string, number[]>;

const INDEX_URL = '/3.0/search-index.json';
const MAX_PAGES = 8;
const MAX_SECTIONS_PER_PAGE = 3;

/** Field weights: title > heading > identifiers > text. */
const W_TITLE = 10;
const W_HEADING = 6;
const W_IDENT = 4;
const W_TEXT = 1.5;
/** Match quality. */
const Q_EXACT = 1;
const Q_PREFIX = 0.7;
const Q_TYPO = 0.45;

// --- Index -------------------------------------------------------------------

const WORD = /[a-z0-9_]+(?:-[a-z0-9_]+)*/g;

/** Words of a text: whole hyphenated words and their parts. */
function words(text: string): string[] {
  const out: string[] = [];
  for (const w of text.toLowerCase().match(WORD) ?? []) {
    out.push(w);
    if (w.includes('-')) out.push(...w.split('-'));
  }
  return out;
}

export {words};

export class Index {
  readonly pages: Page[] = [];
  readonly sections: Section[] = [];
  /** Page-level words of the title. */
  private readonly title: Postings = new Map();
  private readonly heading: Postings = new Map();
  private readonly ident: Postings = new Map();
  private readonly text: Postings = new Map();
  /** All words, sorted (prefix search by bisection). */
  private vocab: string[] = [];

  constructor(raw: {pages: RawPage[]}) {
    for (const p of raw.pages) {
      const page: Page = {
        url: p.u,
        title: p.t,
        section: p.s,
        description: p.d,
        slug: p.u.replace(/\/$/, '').split('/').pop() ?? '',
        lowTitle: p.t.toLowerCase(),
        sections: [],
      };
      this.pages.push(page);
      const pageIndex = this.pages.length - 1;
      add(this.title, words(p.t + ' ' + p.d), pageIndex);
      for (const [id, heading, text, idents] of p.x) {
        const section: Section = {
          page,
          id,
          heading,
          text,
          idents,
          lowHeading: heading.toLowerCase(),
          lowText: text.toLowerCase(),
        };
        page.sections.push(section);
        const i = this.sections.push(section) - 1;
        add(this.heading, words(heading), i);
        add(this.ident, words(idents), i);
        add(this.text, words(text), i);
      }
    }
    const all = new Set<string>();
    for (const map of [this.title, this.heading, this.ident, this.text]) {
      for (const w of map.keys()) all.add(w);
    }
    this.vocab = [...all].sort();
  }

  /** Vocabulary words matching a query token, with their match quality. */
  private matches(token: string): Array<[string, number]> {
    const out: Array<[string, number]> = [];
    const vocab = this.vocab;
    // Bisect to the first word >= token; prefix matches follow it.
    let lo = 0;
    let hi = vocab.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (vocab[mid] < token) lo = mid + 1;
      else hi = mid;
    }
    let found = false;
    for (let i = lo; i < vocab.length && vocab[i].startsWith(token); i++) {
      out.push([vocab[i], vocab[i] === token ? Q_EXACT : Q_PREFIX]);
      found = true;
    }
    // Typos (edit distance 1) of longer words, when nothing else matched.
    if (!found && token.length >= 5) {
      for (const w of vocab) {
        if (Math.abs(w.length - token.length) > 1) continue;
        if (withinOne(w, token)) out.push([w, Q_TYPO]);
      }
    }
    return out;
  }

  search(query: string): Result[] {
    const tokens = [...new Set(words(query.trim()))];
    // Keep whole hyphenated words only ("md-gb-split-button", not its parts).
    const queryWords = (query.toLowerCase().match(WORD) ?? []).slice(0, 8);
    const toks = queryWords.length ? queryWords : tokens.slice(0, 8);
    if (!toks.length) return [];
    const n = toks.length;
    const full = (1 << n) - 1;
    const phrase = toks.join(' ');
    const raw = query.trim().toLowerCase();

    const secScore = new Float64Array(this.sections.length);
    const secMask = new Int32Array(this.sections.length);
    const pageScore = new Float64Array(this.pages.length);
    const pageMask = new Int32Array(this.pages.length);

    for (let t = 0; t < n; t++) {
      const bit = 1 << t;
      for (const [word, quality] of this.matches(toks[t])) {
        const tp = this.title.get(word);
        if (tp) {
          for (let k = 0; k < tp.length; k += 2) {
            const p = tp[k];
            // A title word counts fully; the description's words less, but
            // the postings do not tell them apart: weight by title match.
            const inTitle = this.pages[p].lowTitle.includes(word);
            pageScore[p] += (inTitle ? W_TITLE : 1) * quality;
            pageMask[p] |= bit;
          }
        }
        this.collect(this.heading.get(word), W_HEADING, quality, bit, secScore, secMask, false);
        this.collect(this.ident.get(word), W_IDENT, quality, bit, secScore, secMask, false);
        this.collect(this.text.get(word), W_TEXT, quality, bit, secScore, secMask, true);
      }
    }

    // Component boost: a query naming md-gb-<slug>[-...].
    for (const tok of toks) {
      if (!tok.startsWith('md-gb-')) continue;
      const name = tok.slice(6);
      let best: Page | null = null;
      for (const page of this.pages) {
        if (page.section !== 'components') continue;
        if (name === page.slug || name.startsWith(page.slug + '-')) {
          if (!best || page.slug.length > best.slug.length) best = page;
        }
      }
      if (best) {
        const i = this.pages.indexOf(best);
        pageScore[i] += name === best.slug ? 40 : 20;
        pageMask[i] = full;
      }
    }

    // Sections: all tokens in the section or its page's title (full match);
    // otherwise partial, only when nothing matches fully.
    interface Hit {
      section: Section;
      score: number;
      complete: boolean;
    }
    const hits: Hit[] = [];
    for (let i = 0; i < this.sections.length; i++) {
      if (!secScore[i] && !(pageMask[this.pageIndex(this.sections[i])] && i === this.firstSection(this.sections[i]))) {
        continue;
      }
      const section = this.sections[i];
      const pi = this.pageIndex(section);
      const mask = secMask[i] | pageMask[pi];
      let score = secScore[i];
      if (n > 1) {
        if (section.lowHeading.includes(phrase)) score += 8;
        else if (section.lowText.includes(phrase)) score += 4;
      } else if (section.lowHeading === raw) {
        score += 4;
      }
      hits.push({section, score, complete: mask === full});
    }
    const anyComplete = hits.some((h) => h.complete);
    const byPage = new Map<Page, Hit[]>();
    for (const hit of hits) {
      if (anyComplete && !hit.complete) continue;
      let list = byPage.get(hit.section.page);
      if (!list) byPage.set(hit.section.page, (list = []));
      list.push(hit);
    }

    const results: Result[] = [];
    for (const [page, list] of byPage) {
      const pi = this.pages.indexOf(page);
      list.sort((a, b) => b.score - a.score);
      let phraseBonus = 0;
      if (n > 1 && page.lowTitle.includes(phrase)) phraseBonus = 10;
      else if (n === 1 && page.lowTitle === raw) phraseBonus = 6;
      const titleScore = pageScore[pi] + phraseBonus;
      let score = titleScore + list[0].score;
      for (let k = 1; k < Math.min(list.length, 4); k++) score += list[k].score * 0.15;
      if (!anyComplete) score *= 0.3;
      results.push({
        page,
        score,
        titleMatch: pageScore[pi] >= W_TITLE * Q_TYPO,
        sections: list.slice(0, MAX_SECTIONS_PER_PAGE).map((h) => h.section),
        tokens: toks,
      });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, MAX_PAGES);
  }

  private collect(
    postings: number[] | undefined,
    weight: number,
    quality: number,
    bit: number,
    score: Float64Array,
    mask: Int32Array,
    logCount: boolean,
  ) {
    if (!postings) return;
    for (let k = 0; k < postings.length; k += 2) {
      const i = postings[k];
      const count = postings[k + 1];
      score[i] += weight * quality * (logCount ? Math.min(1 + Math.log2(count), 3) : 1);
      mask[i] |= bit;
    }
  }

  private pageCache = new Map<Page, number>();
  private pageIndex(section: Section): number {
    let i = this.pageCache.get(section.page);
    if (i === undefined) {
      i = this.pages.indexOf(section.page);
      this.pageCache.set(section.page, i);
    }
    return i;
  }
  private firstSection(section: Section): number {
    return this.sections.indexOf(section.page.sections[0]);
  }
}

export interface Result {
  page: Page;
  score: number;
  titleMatch: boolean;
  sections: Section[];
  tokens: string[];
}

/** Records `index` for each word of the list, with counts: [index, count]. */
function add(map: Postings, list: string[], index: number) {
  const counts = new Map<string, number>();
  for (const w of list) counts.set(w, (counts.get(w) ?? 0) + 1);
  for (const [w, count] of counts) {
    let postings = map.get(w);
    if (!postings) map.set(w, (postings = []));
    postings.push(index, count);
  }
}

/** Whether two strings are at most one edit apart (insert, delete, replace, swap). */
function withinOne(a: string, b: string): boolean {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0;
  while (i < la && i < lb && a[i] === b[i]) i++;
  if (la === lb) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true; // Replace.
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2); // Swap.
  }
  return la > lb ? a.slice(i + 1) === b.slice(i) : b.slice(i + 1) === a.slice(i);
}

let indexPromise: Promise<Index | null> | null = null;

/** The index, fetched once (null when it is unavailable). */
export function loadIndex(): Promise<Index | null> {
  indexPromise ??= fetch(INDEX_URL, {cache: 'no-cache'})
    .then((r) => {
      if (!r.ok) throw new Error(`${r.status}`);
      return r.json();
    })
    .then((raw) => new Index(raw))
    .catch((e) => {
      console.warn('Search index unavailable', e);
      indexPromise = null;
      return null;
    });
  return indexPromise;
}

/** A window of the section text around the first match. */
export function snippet(section: Section, tokens: string[]): string {
  const text = section.text || section.page.description;
  const low = section.lowText || text.toLowerCase();
  let at = -1;
  for (const t of tokens) {
    const i = low.indexOf(t);
    if (i >= 0 && (at < 0 || i < at)) at = i;
  }
  const max = 150;
  if (at < 0) return text.slice(0, max) + (text.length > max ? '…' : '');
  const start = Math.max(0, at - 40);
  let from = start;
  if (start > 0) {
    const space = text.indexOf(' ', start);
    if (space >= 0 && space < at) from = space + 1;
  }
  const out = text.slice(from, from + max);
  return (from > 0 ? '…' : '') + out + (from + max < text.length ? '…' : '');
}
