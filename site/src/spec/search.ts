/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Search for the spec shell: the app bar's md-gb-search-bar (in the shell
 * spec) shows `/search/results`; these handlers fill it from the site's
 * search index (/3.0/search-index.json, content/gb-search-index.11ty.cjs).
 *
 * Scoring: every word of the query must match a page section (its page
 * title, heading, identifiers or text); title matches weigh most. Results are
 * the best sections, at most one per page, with a snippet around the match.
 */

import type {StateStore} from '@json-render/core';

import type {ActionHandler} from '@material/web/json-render/renderer.js';

/** A page of the index: url, title, section, description, sections. */
interface IndexPage {
  u: string;
  t: string;
  s: string;
  d: string;
  /** [heading id, heading, text, identifiers] */
  x: Array<[string, string, string, string]>;
}

/** A result in `/search/results`. */
export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
}

const MAX_RESULTS = 8;
let index: Promise<IndexPage[]> | undefined;

function loadIndex(): Promise<IndexPage[]> {
  index ??= fetch('/3.0/search-index.json')
    .then((r) => (r.ok ? r.json() : {pages: []}))
    .then((data: {pages?: IndexPage[]}) => data.pages ?? [])
    .catch(() => []);
  return index;
}

const words = (query: string) =>
  query
    .toLowerCase()
    .split(/[^\p{L}\p{N}-]+/u)
    .filter((w) => w.length > 1);

/** The text around the first match of a word, on one line. */
function snippet(text: string, word: string): string {
  const at = text.toLowerCase().indexOf(word);
  if (at < 0) return text.slice(0, 120);
  const start = Math.max(0, at - 40);
  return `${start ? '…' : ''}${text.slice(start, start + 120).replace(/\s+/g, ' ').trim()}…`;
}

/** The best matches of a query in the index. */
export function search(pages: IndexPage[], query: string): SearchResult[] {
  const q = words(query);
  if (!q.length) return [];
  const best = new Map<string, SearchResult & {score: number}>();
  for (const page of pages) {
    for (const [id, heading, text, identifiers] of page.x) {
      const fields = [
        [page.t.toLowerCase(), 10],
        [heading.toLowerCase(), 6],
        [identifiers.toLowerCase(), 4],
        [text.toLowerCase(), 1],
      ] as const;
      let score = 0;
      for (const w of q) {
        const hit = fields.reduce((s, [field, weight]) => (field.includes(w) ? s + weight : s), 0);
        if (!hit) {
          score = 0;
          break;
        }
        score += hit;
      }
      if (!score) continue;
      const url = id ? `${page.u}#${id}` : page.u;
      const current = best.get(page.u);
      if (!current || score > current.score) {
        best.set(page.u, {
          url,
          title: heading ? `${page.t}: ${heading}` : page.t,
          snippet: snippet(text || page.d, q[0]),
          score,
        });
      }
    }
  }
  return [...best.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(({url, title, snippet}) => ({url, title, snippet}));
}

/** The search actions, over the shell's state store. */
export function searchHandlers(store: StateStore): Record<string, ActionHandler> {
  let latest = 0;
  return {
    search: async () => {
      const ticket = ++latest;
      const query = String(store.get('/search/query') ?? '');
      const results = search(await loadIndex(), query);
      // A slower earlier search doesn't overwrite a newer one.
      if (ticket === latest) store.set('/search/results', results);
    },
    openResult: ({path}) => {
      const url = store.get(String(path));
      if (typeof url === 'string') location.href = url;
    },
    openTopResult: () => {
      const [top] = (store.get('/search/results') as SearchResult[] | undefined) ?? [];
      if (top) location.href = top.url;
    },
  };
}
