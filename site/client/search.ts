/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Search for the spec shell: the app bar's md-gb-search-bar (in the shell
 * spec) shows `/search/results`; these handlers fill it.
 *
 * - Actions first: the site's controls found by name (toggle the color
 *   mode, customize the theme, the downloads and copies, feedback, the 2.5
 *   site), run with the shell's own action handlers.
 * - Then pages, ranked by the shared index (search-index.ts, as the WebMCP
 *   tools): each page's best section, with a snippet around the match.
 * - Ctrl/Cmd+K and "/" open the search (shell.ts); `?q=term` opens it with
 *   a query.
 */

import type {StateStore} from '@json-render/core';

import type {ActionHandler} from '@material/web/json-render/renderer.js';

import {loadIndex, snippet, words} from './search-index.js';

/** A result in `/search/results`. */
export interface SearchResult {
  key: string;
  title: string;
  snippet: string;
  /** Material Symbols name. */
  icon: string;
  /** A page result's URL. */
  url?: string;
  /** An action result's handler, and its params. */
  action?: string;
  params?: Record<string, unknown>;
}

interface Action {
  key: string;
  title: string;
  /** What it does (shown under the label, searched too). */
  detail: string;
  /** More words it's found by. */
  keywords: string;
  icon: string;
  action: string;
  params?: Record<string, unknown>;
}

const MAX_ACTIONS = 5;

// In order of preference when several match: the links before the copies
// of their text ("github", "npm").
const ACTIONS: Action[] = [
  {key: 'a-theme', title: 'Toggle color mode', detail: 'System, light or dark', keywords: 'theme mode appearance dark light system night day', icon: 'brightness_auto', action: 'cycleColorMode'},
  {key: 'a-motion', title: 'Reduce motion', detail: 'Turn animations off, or back on, on this site', keywords: 'animation animations reduce reduced accessibility vestibular transitions toggle', icon: 'motion_photos_off', action: 'toggleMotion'},
  {key: 'a-customize', title: 'Customize color theme', detail: 'Seed color, scheme and contrast', keywords: 'palette seed scheme variant contrast colors', icon: 'palette', action: 'openTool', params: {tool: 'theme'}},
  {key: 'a-github', title: 'Open GitHub', detail: 'The repository, in a new tab', keywords: 'repository repo source code issues', icon: 'open_in_new', action: 'openTab', params: {url: 'https://github.com/material-components/material-web'}},
  {key: 'a-npm', title: 'Open npm', detail: 'The package, in a new tab', keywords: 'package registry', icon: 'open_in_new', action: 'openTab', params: {url: 'https://www.npmjs.com/package/@material/web'}},
  {key: 'a-feedback', title: 'Send feedback', detail: 'Report a problem or suggest a change', keywords: 'issue bug report problem suggestion', icon: 'feedback', action: 'openFeedback'},
  {key: 'a-version', title: 'Switch to version 2.5', detail: 'The Material Web 2.5 site', keywords: 'toggle version old previous v2 legacy', icon: 'swap_horiz', action: 'openPage', params: {url: '/'}},
  {key: 'a-install', title: 'Install app', detail: 'Add Material Web 3.0 to your device', keywords: 'download pwa offline app', icon: 'install_desktop', action: 'install'},
  {key: 'a-mhtml', title: 'Download website (MHTML)', detail: 'All pages in one file, for offline reading', keywords: 'offline single file save site', icon: 'web', action: 'download', params: {href: '/3.0/material-web-3.0.mhtml', name: 'material-web-3.0.mhtml'}},
  {key: 'a-llms', title: 'Download docs for LLMs (llms-full.txt)', detail: 'All pages as Markdown text', keywords: 'ai markdown text llm agent', icon: 'description', action: 'download', params: {href: '/3.0/llms-full.txt', name: 'llms-full.txt'}},
  {key: 'a-manifest', title: 'Download API (custom-elements.json)', detail: 'Every element, as a Custom Elements Manifest', keywords: 'manifest json elements cem', icon: 'data_object', action: 'download', params: {href: '/3.0/custom-elements.json', name: 'custom-elements.json'}},
  {key: 'a-agent', title: 'Copy agent prompt', detail: 'Tells an AI agent to install the md-gb skill', keywords: 'ai claude skill llm', icon: 'smart_toy', action: 'copy', params: {id: 'agent-prompt', done: 'Copied agent prompt'}},
  {key: 'a-cdn', title: 'Copy CDN script tag', detail: 'A script tag and import map', keywords: 'script importmap esm cdn html', icon: 'code', action: 'copy', params: {id: 'cdn', done: 'Copied CDN script tag'}},
  {key: 'a-github-link', title: 'Copy GitHub link', detail: 'github.com/material-components/material-web', keywords: 'repository repo url source', icon: 'link', action: 'copy', params: {id: 'github', done: 'Copied GitHub link'}},
  {key: 'a-npm-install', title: 'Copy npm install', detail: 'npm install @material/web', keywords: 'package install command terminal', icon: 'terminal', action: 'copy', params: {id: 'npm', done: 'Copied npm install command'}},
  {key: 'a-shadcn', title: 'Copy shadcn npx setup', detail: 'npx shadcn@latest add …/md-theme.json', keywords: 'react registry ui install command', icon: 'deployed_code', action: 'copy', params: {id: 'shadcn', done: 'Copied shadcn setup command'}},
];

/** The actions with a word starting with each word of the query, in order. */
function matchActions(query: string): SearchResult[] {
  const tokens = words(query);
  if (!tokens.length) return [];
  return ACTIONS.filter((a) => {
    const own = words(`${a.title} ${a.detail} ${a.keywords}`);
    return tokens.every((t) => own.some((w) => w.startsWith(t)));
  })
    .slice(0, MAX_ACTIONS)
    .map(({key, title, detail, icon, action, params}) => ({key, title, snippet: detail, icon, action, params}));
}

/** The page results of a query: each page's best section. */
async function matchPages(query: string): Promise<SearchResult[]> {
  const index = await loadIndex();
  if (!index) return [];
  return index.search(query).map((r) => {
    const section = r.sections[0];
    const url = section?.id ? `${r.page.url}#${section.id}` : r.page.url;
    const title = section?.id && section.heading ? `${r.page.title}: ${section.heading}` : r.page.title;
    return {key: url, title, snippet: section ? snippet(section, r.tokens) : r.page.description, icon: 'article', url};
  });
}

/**
 * The search actions, over the shell's state store. `run` calls another
 * action of the shell (an action result's).
 */
export function searchHandlers(
  store: StateStore,
  run: (action: string, params: Record<string, unknown>) => unknown,
): Record<string, ActionHandler> {
  let latest = 0;
  const open = (result: SearchResult | undefined) => {
    if (!result) return;
    if (result.url) {
      location.href = result.url;
      return;
    }
    if (result.action) {
      store.update({'/search/query': '', '/search/results': []});
      closeSearch();
      run(result.action, result.params ?? {});
    }
  };
  const results = () => (store.get('/search/results') as SearchResult[] | undefined) ?? [];
  return {
    search: async () => {
      const ticket = ++latest;
      const query = String(store.get('/search/query') ?? '');
      const found = query.trim() ? [...matchActions(query), ...(await matchPages(query))] : [];
      // A slower earlier search doesn't overwrite a newer one.
      if (ticket === latest) store.set('/search/results', found);
    },
    // `$item` in action params resolves to the item's state path
    // (/search/results/<i>/key), so the handler reads the key from it.
    openResult: ({path}) => {
      const key = store.get(String(path));
      open(results().find((r) => r.key === key));
    },
    openTopResult: () => open(results()[0]),
    openTab: ({url}) => void window.open(String(url), '_blank', 'noopener'),
    openPage: ({url}) => location.assign(String(url)),
  };
}

/** Collapses the search bar's view. */
function closeSearch() {
  const bar = document.querySelector<HTMLElement & {expanded: boolean}>('md-gb-search-bar');
  if (bar) bar.expanded = false;
}

/** Opens the search bar, with `query` when given (`?q=`). */
export function openSearch(store: StateStore, query?: string) {
  const bar = document.querySelector<HTMLElement & {expanded: boolean}>('md-gb-search-bar');
  if (!bar) return;
  bar.expanded = true;
  if (query !== undefined) store.set('/search/query', query);
}
