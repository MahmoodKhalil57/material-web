/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Search of the /3.0/ docs (imported by gb.ts; styles in search.css).
 *
 * - The index (/3.0/search-index.json, catalog/site/gb-search-index.11ty.cjs)
 *   is fetched on first use (button hover/focus, or opening) and kept for the
 *   page; the service worker serves it network first (sw.ts).
 * - The dialog follows the M3 search view (.m3-specs/pages/components/search*):
 *   full-screen on compact windows, a docked modal on wider ones. It is a
 *   native modal `<dialog>` in the light DOM rather than md-gb-search-view or
 *   md-gb-dialog with a text field: the WAI-ARIA combobox pattern needs
 *   `aria-activedescendant` on the input to point at the options, and an ID
 *   reference cannot cross a shadow root.
 * - Ctrl/Cmd+K and "/" open it; ?q=term opens it with a query; a result's
 *   heading is scrolled to and briefly highlighted.
 */

/** Index format: see catalog/site/gb-search-index.11ty.cjs. */
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
const RECENT_KEY = 'gb-search-recent';
const HIT_KEY = 'gb-search-hit';
const MAX_RECENT = 6;
const MAX_PAGES = 8;
const MAX_SECTIONS_PER_PAGE = 3;
const SECTION_LABELS: Record<string, string> = {
  about: 'About',
  foundations: 'Foundations',
  styles: 'Styles',
  components: 'Components',
};
const SUGGESTIONS = ['Button', 'Color', 'Accessibility', 'md-gb-dialog', 'Motion'];

// --- Actions -----------------------------------------------------------------
// What the site's controls do, found by name: the color theme, the theme
// sheet, the downloads and copies of Download & copy, the project's links,
// Send feedback and the 2.5 site. Each runs the control on the page (the
// same behavior, focus return and confirmation), after the search closes.

interface Action {
  id: string;
  label: string;
  /** What it does (shown under the label, searched too). */
  detail: string;
  /** More words it's found by. */
  keywords: string;
  /** Material Symbols name. */
  icon: string;
  run: () => void;
}

/** Runs a control of the page (it may be hidden, like the sheet's items). */
const press = (selector: string) => () => document.querySelector<HTMLElement>(selector)?.click();
const openTab = (url: string) => () => void window.open(url, '_blank', 'noopener');

// In order of preference when several match (MAX_ACTIONS are listed): the
// links before the copies of their text ("github", "npm").
const ACTIONS: Action[] = [
  {id: 'theme', label: 'Toggle color theme', detail: 'System, light or dark', keywords: 'mode appearance dark light system night day', icon: 'brightness_auto', run: press('#gb-theme')},
  {id: 'motion', label: 'Reduce motion', detail: 'Turn animations off, or back on, on this site', keywords: 'animation animations motion reduce reduced slow device performance accessibility vestibular transitions toggle', icon: 'motion_photos_off', run: press('#gb-motion')},
  {id: 'customize', label: 'Customize color theme', detail: 'Source color, scheme and contrast', keywords: 'palette seed scheme variant contrast colors', icon: 'palette', run: press('[data-tool="theme"]')},
  {id: 'github', label: 'Open GitHub', detail: 'The repository, in a new tab', keywords: 'repository repo source code issues', icon: 'open_in_new', run: openTab('https://github.com/material-components/material-web')},
  {id: 'npm', label: 'Open npm', detail: 'The package, in a new tab', keywords: 'package registry', icon: 'open_in_new', run: openTab('https://www.npmjs.com/package/@material/web')},
  {id: 'feedback', label: 'Send feedback', detail: 'Report a problem or suggest a change', keywords: 'issue bug report problem suggestion', icon: 'feedback', run: press('.gb-rail-foot [data-tool="feedback"]')},
  {id: 'version', label: 'Switch to version 2.5', detail: 'The Material Web 2.5 site', keywords: 'toggle version old previous v2 legacy', icon: 'swap_horiz', run: () => location.assign('/')},
  {id: 'install', label: 'Install app', detail: 'Add Material Web 3.0 to your device', keywords: 'download pwa offline app', icon: 'install_desktop', run: press('#gb-install')},
  {id: 'mhtml', label: 'Download website (MHTML)', detail: 'All pages in one file, for offline reading', keywords: 'offline single file save site', icon: 'web', run: press('#gb-download-body [data-download$=".mhtml"]')},
  {id: 'llms', label: 'Download docs for LLMs (llms-full.txt)', detail: 'All pages as Markdown text', keywords: 'ai markdown text llm agent', icon: 'description', run: press('#gb-download-body [data-download$="llms-full.txt"]')},
  {id: 'manifest', label: 'Download API (custom-elements.json)', detail: 'Every element, as a Custom Elements Manifest', keywords: 'manifest json elements cem', icon: 'data_object', run: press('#gb-download-body [data-download$="custom-elements.json"]')},
  {id: 'agent', label: 'Copy agent prompt', detail: 'Tells an AI agent to install the md-gb skill', keywords: 'ai claude skill llm', icon: 'smart_toy', run: press('[data-copy="agent-prompt"]')},
  {id: 'cdn', label: 'Copy CDN script tag', detail: 'A script tag and import map', keywords: 'script importmap esm cdn html', icon: 'code', run: press('[data-copy="cdn"]')},
  {id: 'github-link', label: 'Copy GitHub link', detail: 'github.com/material-components/material-web', keywords: 'repository repo url source', icon: 'link', run: press('[data-copy="github"]')},
  {id: 'npm-install', label: 'Copy npm install', detail: 'npm install @material/web', keywords: 'package install command terminal', icon: 'terminal', run: press('[data-copy="npm"]')},
  {id: 'shadcn', label: 'Copy shadcn npx setup', detail: 'npx shadcn@latest add …/md-theme.json', keywords: 'react registry ui install command', icon: 'deployed_code', run: press('[data-copy="shadcn"]')},
];
/** All five copies show for "copy". */
const MAX_ACTIONS = 5;

/**
 * The actions whose label, detail or keywords have a word starting with
 * each word of the query, in the list's order.
 */
function matchActions(query: string): Action[] {
  const tokens = words(query);
  if (!tokens.length) return [];
  return ACTIONS.filter((action) => {
    const own = words(`${action.label} ${action.detail} ${action.keywords}`);
    return tokens.every((t) => own.some((w) => w.startsWith(t)));
  }).slice(0, MAX_ACTIONS);
}

/**
 * Which option is chosen first, the actions listed before the pages: the
 * first action whose name has the query's words ("download", "2.5"),
 * unless a page's title has them too ("color"), where the action wins only
 * if the query starts its name ("copy npm", "toggle theme"). Else the
 * first page.
 */
function firstChoice(query: string, actions: Action[], results: Result[]): number {
  const tokens = words(query);
  const named = actions.findIndex((a) => {
    const label = words(a.label);
    return tokens.every((t) => label.some((w) => w.startsWith(t)));
  });
  if (named < 0) return results.length ? actions.length : 0;
  const starts = words(actions[named].label)[0].startsWith(tokens[0]);
  if (results[0]?.titleMatch && !starts) return actions.length;
  return named;
}

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

// --- Storage -----------------------------------------------------------------

function readRecent(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(list) ? list.filter((s) => typeof s === 'string').slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
  } catch {
    // Storage can be blocked; recent searches just are not kept.
  }
}

function remember(query: string) {
  const q = query.trim();
  if (q.length < 2) return;
  writeRecent([q, ...readRecent().filter((r) => r.toLowerCase() !== q.toLowerCase())]);
}

// --- Dialog ------------------------------------------------------------------

const isMac = /mac|iphone|ipad|ipod/i.test(
  (navigator as Navigator & {userAgentData?: {platform?: string}}).userAgentData?.platform ||
    navigator.platform ||
    '',
);

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let indexPromise: Promise<Index | null> | null = null;
let index: Index | null = null;

/** Also used by webmcp.ts, which shares the index and the ranking. */
export function loadIndex(): Promise<Index | null> {
  indexPromise ??= fetch(INDEX_URL, {cache: 'no-cache'})
    .then((r) => {
      if (!r.ok) throw new Error(`${r.status}`);
      return r.json();
    })
    .then((raw) => (index = new Index(raw)))
    .catch((e) => {
      console.warn('Search index unavailable', e);
      indexPromise = null;
      return null;
    });
  return indexPromise;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Appends `text` with the query tokens wrapped in <mark>. */
function highlight(parent: HTMLElement, text: string, tokens: string[]) {
  const pattern = tokens
    .filter((t) => t.length > 0)
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!pattern.length) {
    parent.append(text);
    return;
  }
  const re = new RegExp(`(${pattern.join('|')})`, 'gi');
  let last = 0;
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0;
    if (at > last) parent.append(text.slice(last, at));
    parent.append(el('mark', undefined, m[0]));
    last = at + m[0].length;
  }
  if (last < text.length) parent.append(text.slice(last));
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

class SearchDialog {
  private dialog!: HTMLDialogElement;
  private input!: HTMLInputElement;
  private list!: HTMLElement;
  private status!: HTMLElement;
  private clearButton!: HTMLElement;
  private footer!: HTMLElement;
  private opener: HTMLElement | null = null;
  private options: HTMLAnchorElement[] = [];
  private active = -1;
  private counter = 0;
  private statusTimer = 0;
  private built = false;
  private recentButton: HTMLElement | null = null;

  get isOpen() {
    return this.built && this.dialog.open;
  }

  private build() {
    if (this.built) return;
    this.built = true;
    const dialog = (this.dialog = el('dialog', 'gb-search'));
    dialog.setAttribute('aria-label', 'Search docs');
    dialog.innerHTML = `
      <div class="gb-search-container">
        <div class="gb-search-header">
          <md-gb-icon-button class="gb-search-back" aria-label="Close search"><md-gb-icon>arrow_back</md-gb-icon></md-gb-icon-button>
          <md-gb-icon class="gb-search-lead" aria-hidden="true">search</md-gb-icon>
          <input class="gb-search-input" type="text" role="combobox" autocomplete="off" autocapitalize="off"
            spellcheck="false" enterkeyhint="search" aria-autocomplete="list" aria-expanded="false"
            aria-controls="gb-search-list" aria-label="Search docs" placeholder="Search docs">
          <md-gb-icon-button class="gb-search-clear" aria-label="Clear search" hidden><md-gb-icon>close</md-gb-icon></md-gb-icon-button>
        </div>
        <div class="gb-search-body">
          <div class="gb-search-list" id="gb-search-list" role="listbox" aria-label="Search results"></div>
          <div class="gb-search-empty" hidden></div>
        </div>
        <div class="gb-search-footer">
          <button type="button" class="gb-search-recent-clear" hidden>Clear recent searches</button>
          <span class="gb-search-keys" aria-hidden="true">
            <kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> open <kbd>${isMac ? '⌘' : 'Ctrl'}</kbd><kbd>↵</kbd> new tab <kbd>esc</kbd> close
          </span>
        </div>
        <div class="gb-search-status" role="status" aria-live="polite"></div>
      </div>`;
    document.body.append(dialog);
    this.input = dialog.querySelector('.gb-search-input')!;
    this.list = dialog.querySelector('.gb-search-list')!;
    this.status = dialog.querySelector('.gb-search-status')!;
    this.clearButton = dialog.querySelector('.gb-search-clear')!;
    this.footer = dialog.querySelector('.gb-search-footer')!;
    this.recentButton = dialog.querySelector('.gb-search-recent-clear');

    this.input.addEventListener('input', () => this.update());
    this.input.addEventListener('keydown', (e) => this.onKey(e));
    this.clearButton.addEventListener('click', () => {
      this.input.value = '';
      this.update();
      this.input.focus();
    });
    dialog.querySelector('.gb-search-back')!.addEventListener('click', () => this.close());
    this.recentButton?.addEventListener('click', () => {
      writeRecent([]);
      this.update();
      this.input.focus();
    });
    // A click on the scrim (the dialog itself, outside the container).
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) this.close();
    });
    dialog.addEventListener('close', () => this.onClosed());
    // Options are links: a click navigates; remember the query first.
    this.list.addEventListener('click', (e) => {
      const option = (e.target as Element).closest<HTMLAnchorElement>('a[role="option"]');
      if (option) this.go(option, e as MouseEvent);
    });
    this.list.addEventListener('pointermove', (e) => {
      const option = (e.target as Element).closest<HTMLAnchorElement>('[role="option"]');
      const i = option ? this.options.indexOf(option as HTMLAnchorElement) : -1;
      if (i >= 0 && i !== this.active) this.setActive(i, false);
    });
  }

  async open(query?: string) {
    this.build();
    if (this.dialog.open) {
      this.input.focus();
      this.input.select();
      return;
    }
    const active = document.activeElement;
    this.opener = active instanceof HTMLElement && active !== document.body ? active : null;
    for (const b of document.querySelectorAll('[data-gb-search]')) b.setAttribute('aria-expanded', 'true');
    this.dialog.showModal();
    if (query !== undefined) this.input.value = query;
    this.input.focus();
    this.input.select();
    this.update();
    await loadIndex();
    if (this.dialog.open) this.update();
  }

  close() {
    if (this.isOpen) this.dialog.close();
  }

  private onClosed() {
    for (const b of document.querySelectorAll('[data-gb-search]')) b.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('aria-expanded', 'false');
    // Back to where the search was opened from.
    const opener = this.opener;
    this.opener = null;
    if (opener?.isConnected) opener.focus({preventScroll: true});
    const url = new URL(location.href);
    if (url.searchParams.has('q')) {
      url.searchParams.delete('q');
      history.replaceState(history.state, '', url);
    }
  }

  private announce(message: string) {
    clearTimeout(this.statusTimer);
    // A pause, so typing does not queue an announcement per keystroke.
    this.statusTimer = window.setTimeout(() => {
      this.status.textContent = message;
    }, 350);
  }

  private update() {
    const query = this.input.value;
    this.clearButton.hidden = !query;
    this.list.replaceChildren();
    this.options = [];
    this.active = -1;
    const empty = this.dialog.querySelector<HTMLElement>('.gb-search-empty')!;
    empty.hidden = true;
    this.recentButton!.hidden = true;
    this.dialog.toggleAttribute('data-has-results', false);

    if (!query.trim()) {
      this.renderIdle();
      return;
    }
    const actions = matchActions(query);
    if (!index && !actions.length) {
      this.setExpanded(false);
      this.status.textContent = '';
      empty.hidden = false;
      empty.textContent = 'Loading the index…';
      return;
    }
    const results = index?.search(query) ?? [];
    if (actions.length) {
      this.dialog.toggleAttribute('data-has-results', true);
      this.renderActions(actions);
      if (results.length) this.renderResults(results);
      this.setExpanded(true);
      this.setActive(firstChoice(query, actions, results), true);
      const count = this.options.length;
      this.announce(`${count} result${count === 1 ? '' : 's'}`);
      return;
    }
    if (!results.length) {
      this.setExpanded(false);
      empty.hidden = false;
      empty.replaceChildren();
      empty.append(el('p', 'gb-search-empty-title', `No results for “${query.trim()}”`));
      empty.append(
        el('p', 'gb-search-empty-hint', 'Check the spelling, or try a component name such as Button, a token or an attribute.'),
      );
      this.announce(`No results for ${query.trim()}`);
      return;
    }
    this.renderResults(results);
    const count = this.options.length;
    this.announce(`${count} result${count === 1 ? '' : 's'}`);
  }

  private setExpanded(expanded: boolean) {
    this.input.setAttribute('aria-expanded', String(expanded));
    if (!expanded) this.input.removeAttribute('aria-activedescendant');
  }

  private renderIdle() {
    const recent = readRecent();
    const group = el('div');
    group.setAttribute('role', 'group');
    const title = el('div', 'gb-search-group-title', recent.length ? 'Recent searches' : 'Suggestions');
    title.id = 'gb-search-g-idle';
    title.setAttribute('role', 'presentation');
    group.setAttribute('aria-labelledby', title.id);
    group.append(title);
    for (const term of recent.length ? recent : SUGGESTIONS) {
      const option = el('a', 'gb-search-option gb-search-term');
      option.setAttribute('role', 'option');
      option.tabIndex = -1;
      option.id = `gb-search-o-${this.counter++}`;
      option.dataset['term'] = term;
      const icon = el('md-gb-icon');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = recent.length ? 'history' : 'search';
      option.append(icon, el('span', 'gb-search-term-text', term));
      option.addEventListener('click', (e) => {
        e.preventDefault();
        this.input.value = term;
        this.update();
        this.input.focus();
      });
      group.append(option);
      this.options.push(option as HTMLAnchorElement);
    }
    this.list.append(group);
    this.recentButton!.hidden = !recent.length;
    this.setExpanded(true);
    // Nothing is chosen until an arrow key: Enter on an empty query does nothing.
    this.status.textContent = '';
  }

  private renderActions(actions: Action[]) {
    const tokens = words(this.input.value);
    const group = el('div', 'gb-search-group');
    group.setAttribute('role', 'group');
    const title = el('div', 'gb-search-group-title', 'Actions');
    title.setAttribute('role', 'presentation');
    title.id = 'gb-search-g-actions';
    group.setAttribute('aria-labelledby', title.id);
    group.append(title);
    for (const action of actions) {
      const option = el('a', 'gb-search-option gb-search-action');
      option.setAttribute('role', 'option');
      option.tabIndex = -1;
      option.id = `gb-search-o-${this.counter++}`;
      option.dataset['action'] = action.id;
      const icon = el('md-gb-icon');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = action.icon;
      const text = el('span', 'gb-search-action-text');
      const name = el('span', 'gb-search-name');
      highlight(name, action.label, tokens);
      const detail = el('span', 'gb-search-snippet');
      highlight(detail, action.detail, tokens);
      text.append(name, detail);
      option.append(icon, text);
      group.append(option);
      this.options.push(option as HTMLAnchorElement);
    }
    this.list.append(group);
  }

  private renderResults(results: Result[]) {
    this.dialog.toggleAttribute('data-has-results', true);
    let g = 0;
    for (const r of results) {
      const group = el('div', 'gb-search-group');
      group.setAttribute('role', 'group');
      const title = el('div', 'gb-search-group-title');
      title.setAttribute('role', 'presentation');
      title.id = `gb-search-g-${g++}`;
      group.setAttribute('aria-labelledby', title.id);
      title.append(el('span', 'gb-search-group-name', r.page.title), ' ');
      title.append(el('span', 'gb-search-group-section', SECTION_LABELS[r.page.section] ?? r.page.section));
      group.append(title);

      const rows: Array<{section: Section | null; heading: string; snip: string; href: string}> = [];
      // The page itself first when its title matched, or no section did.
      if (r.titleMatch || !r.sections.length) {
        const intro = r.page.sections[0];
        rows.push({
          section: null,
          heading: r.page.title,
          snip: r.page.description || (intro ? snippet(intro, r.tokens) : ''),
          href: r.page.url,
        });
      }
      for (const s of r.sections) {
        if (!s.id) {
          if (rows.length) continue;
          rows.push({section: s, heading: r.page.title, snip: snippet(s, r.tokens), href: r.page.url});
          continue;
        }
        rows.push({section: s, heading: s.heading, snip: snippet(s, r.tokens), href: `${r.page.url}#${s.id}`});
      }
      for (const row of rows) {
        const option = el('a', 'gb-search-option');
        option.setAttribute('role', 'option');
        option.tabIndex = -1;
        option.id = `gb-search-o-${this.counter++}`;
        option.href = row.href;
        const name = el('span', 'gb-search-name');
        highlight(name, row.heading, r.tokens);
        const text = el('span', 'gb-search-snippet');
        highlight(text, row.snip, r.tokens);
        option.append(name, text);
        group.append(option);
        this.options.push(option);
      }
      this.list.append(group);
    }
    this.setExpanded(true);
    this.setActive(0, true);
  }

  private setActive(i: number, scroll: boolean) {
    this.options[this.active]?.removeAttribute('aria-selected');
    this.active = i;
    const option = this.options[i];
    if (!option) {
      this.input.removeAttribute('aria-activedescendant');
      return;
    }
    option.setAttribute('aria-selected', 'true');
    this.input.setAttribute('aria-activedescendant', option.id);
    if (scroll) option.scrollIntoView({block: 'nearest'});
  }

  private onKey(e: KeyboardEvent) {
    if (e.isComposing) return;
    const n = this.options.length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (n) this.setActive(this.active < n - 1 ? this.active + 1 : 0, true);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (n) this.setActive(this.active > 0 ? this.active - 1 : n - 1, true);
        break;
      case 'Enter': {
        const option = this.options[this.active];
        if (!option) break;
        e.preventDefault();
        if (option.dataset['term'] !== undefined) {
          this.input.value = option.dataset['term']!;
          this.update();
        } else {
          this.go(option, e);
        }
        break;
      }
    }
  }

  /** Opens a result: in a new tab with Ctrl/Cmd (click or Enter). */
  private go(option: HTMLAnchorElement, e: MouseEvent | KeyboardEvent) {
    if (option.dataset['term'] !== undefined) return;
    const action = ACTIONS.find((a) => a.id === option.dataset['action']);
    if (action) {
      // The search closes first, so what the action opens (a sheet, a
      // dialog, the snackbar) isn't under it: it runs once the dialog has
      // closed and focus has returned to where the search was opened from
      // (onClosed), so a sheet or dialog it opens keeps the focus.
      e.preventDefault();
      this.dialog.addEventListener('close', () => action.run(), {once: true});
      this.close();
      return;
    }
    const href = option.href;
    const modified = e.ctrlKey || e.metaKey;
    remember(this.input.value);
    const target = new URL(href);
    if (modified) {
      e.preventDefault();
      window.open(href, '_blank', 'noopener');
      return;
    }
    if (e.shiftKey && 'button' in e) return; // Browser default: new window.
    e.preventDefault();
    if (target.hash) {
      try {
        sessionStorage.setItem(HIT_KEY, decodeURIComponent(target.hash.slice(1)));
      } catch {
        // No highlight after a page load; same-page navigation still works.
      }
    }
    const samePage = target.pathname === location.pathname && target.hash;
    this.opener = null;
    this.close();
    if (samePage) {
      history.pushState(null, '', target.hash);
      revealHash();
    } else {
      location.assign(href);
    }
  }
}

// --- Heading highlight -----------------------------------------------------------

/** Scrolls to the heading of the URL's fragment and highlights it, if search led here. */
function revealHash(onLoad = false) {
  let id = '';
  try {
    id = sessionStorage.getItem(HIT_KEY) ?? '';
    sessionStorage.removeItem(HIT_KEY);
  } catch {
    return;
  }
  if (!id || decodeURIComponent(location.hash.slice(1)) !== id) return;
  const heading = document.getElementById(id);
  if (!heading) return;
  const target = heading.closest<HTMLElement>('.heading') ?? heading;
  if (!onLoad) {
    heading.scrollIntoView({block: 'start', behavior: reduced() ? 'auto' : 'smooth'});
  }
  heading.tabIndex = -1;
  heading.focus({preventScroll: true});
  target.classList.remove('gb-search-hit');
  // Restart the animation.
  void target.offsetWidth;
  target.classList.add('gb-search-hit');
  setTimeout(() => target.classList.remove('gb-search-hit'), 2400);
}

// --- Wiring ----------------------------------------------------------------------

const dialog = new SearchDialog();

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    /^(input|textarea|select)$/i.test(target.localName) ||
    target.localName.startsWith('md-gb-') && /text-field|select|slider|search/.test(target.localName)
  );
}

function setUpTriggers() {
  const hint = isMac ? '⌘K' : 'Ctrl K';
  for (const button of document.querySelectorAll<HTMLElement>('[data-gb-search]')) {
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
    const keys = button.querySelector('.gb-search-hint');
    if (keys) keys.textContent = hint;
    button.setAttribute('aria-keyshortcuts', isMac ? 'Meta+K /' : 'Control+K /');
    // The tooltip of an icon button shows its label: add the shortcut to it.
    if (button.hasAttribute('data-gb-search-tip')) {
      button.setAttribute('aria-label', `Search docs (${hint})`);
    }
    button.addEventListener('click', () => void dialog.open());
    // Warm the index before the click.
    button.addEventListener('pointerenter', () => void loadIndex(), {once: true});
    button.addEventListener('focus', () => void loadIndex(), {once: true});
  }
}

addEventListener('keydown', (e) => {
  if (e.defaultPrevented || e.isComposing) return;
  const key = e.key.toLowerCase();
  if (key === 'k' && (isMac ? e.metaKey : e.ctrlKey) && !e.altKey && !e.shiftKey) {
    e.preventDefault();
    if (dialog.isOpen) dialog.close();
    else void dialog.open();
  } else if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !dialog.isOpen) {
    if (isEditable(e.composedPath()[0])) return;
    e.preventDefault();
    void dialog.open();
  }
});

setUpTriggers();

const initial = new URLSearchParams(location.search).get('q');
if (initial !== null) {
  void dialog.open(initial);
}

// A result of the last search led here.
if (location.hash) {
  if (document.readyState === 'complete') revealHash(true);
  else addEventListener('load', () => revealHash(true), {once: true});
}
