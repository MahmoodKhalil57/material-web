/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * WebMCP tools of the /3.0/ docs (imported by shell.ts).
 *
 * Follows the WebMCP draft (https://webmachinelearning.github.io/webmcp/,
 * Draft Community Group Report): `document.modelContext.registerTool(tool,
 * {signal})` with `tool = {name, title, description, inputSchema, execute,
 * annotations}`. `execute(input, {signal})` returns any JSON-serializable
 * value; the browser serializes it for the agent. Older builds expose the same
 * object as `navigator.modelContext`, which is used when `document` has none.
 * The draft has no declarative (form) API, so only the imperative one is used.
 *
 * Nothing is registered where the API is missing, on prerendered pages before
 * they are shown, or outside /3.0/ (the v2.5 site). The tools reuse the search
 * index and ranking of search-index.ts (as the search bar) and the Markdown
 * of every page (URL + ".md").
 * `window.gbDocsTools` maps each tool name to its execute function, for the
 * demo on the AI agents page and for debugging.
 */

import {loadIndex, snippet, type Index, type Page, type Section} from './search-index.js';

interface ToolDefinition {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: {readOnlyHint: boolean};
  execute: (input?: Record<string, unknown>) => Promise<unknown>;
}

interface ModelContext {
  registerTool(
    tool: ToolDefinition,
    options?: {signal?: AbortSignal},
  ): Promise<void> | void;
}

const BASE = '/3.0/';
const SECTIONS = ['about', 'foundations', 'styles', 'components'];
const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;
/** Characters of Markdown returned by one call. */
const MAX_CHARS = 12000;

const origin = () => location.origin;
const abs = (path: string) => origin() + path;

// --- Data ------------------------------------------------------------------------

const markdownCache = new Map<string, Promise<string>>();

/** The Markdown of a page (URL + ".md"), fetched once. */
function loadMarkdown(pageUrl: string): Promise<string> {
  let promise = markdownCache.get(pageUrl);
  if (!promise) {
    promise = fetch(markdownUrlPath(pageUrl))
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.text();
      })
      .catch((e) => {
        markdownCache.delete(pageUrl);
        throw e;
      });
    markdownCache.set(pageUrl, promise);
  }
  return promise;
}

/** /3.0/components/button/ -> /3.0/components/button.md; /3.0/ -> /3.0/index.md. */
function markdownUrlPath(pageUrl: string): string {
  return pageUrl === BASE ? BASE + 'index.md' : pageUrl.replace(/\/$/, '') + '.md';
}

async function requireIndex(): Promise<Index> {
  const index = await loadIndex();
  if (!index) throw new Error('The docs search index is unavailable.');
  return index;
}

class ToolError extends Error {}

/** Resolves "components/button", "/3.0/components/button/#x" or a full URL to a page. */
function resolvePage(index: Index, input: unknown): Page {
  if (typeof input !== 'string' || !input.trim()) {
    throw new ToolError('Pass "path" (for example "/3.0/components/button/").');
  }
  let path = input.trim();
  if (/^https?:\/\//i.test(path)) {
    const url = new URL(path);
    if (url.origin !== origin()) throw new ToolError('Only pages of this site are available.');
    path = url.pathname;
  }
  path = path.split('#')[0].split('?')[0].replace(/\.md$/, '');
  if (!path.startsWith('/')) path = '/' + path;
  if (!path.startsWith(BASE)) path = BASE.slice(0, -1) + path;
  if (!path.endsWith('/')) path += '/';
  const page = index.pages.find((p) => p.url === path);
  if (!page) {
    const slug = path.replace(/\/$/, '').split('/').pop() ?? '';
    const near = index.pages.filter((p) => p.slug.includes(slug) || slug.includes(p.slug)).slice(0, 5);
    throw new ToolError(
      `No page at ${path}. ` +
        (near.length ? `Similar: ${near.map((p) => p.url).join(', ')}. ` : '') +
        'Use list_pages or search_docs to find the right one.',
    );
  }
  return page;
}

// --- Markdown ----------------------------------------------------------------------

interface Heading {
  level: number;
  text: string;
  /** Index of the heading's line. */
  line: number;
}

function decode(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function plain(text: string): string {
  return decode(text).replace(/[`*_]/g, '').trim();
}

function slugify(text: string): string {
  return plain(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** The ATX headings of a Markdown document, outside fenced code. */
function parseHeadings(lines: string[]): Heading[] {
  const out: Heading[] = [];
  let fence = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (f) {
      if (!fence) fence = f[1];
      else if (f[1][0] === fence[0] && f[1].length >= fence.length) fence = '';
      continue;
    }
    if (fence) continue;
    const h = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (h) out.push({level: h[1].length, text: plain(h[2]), line: i});
  }
  return out;
}

/** The Markdown of the heading at `i` up to the next heading of the same or a higher level. */
function sliceSection(lines: string[], headings: Heading[], i: number): string {
  const start = headings[i].line;
  let end = lines.length;
  for (let j = i + 1; j < headings.length; j++) {
    if (headings[j].level <= headings[i].level) {
      end = headings[j].line;
      break;
    }
  }
  return lines.slice(start, end).join('\n').trim();
}

/** Finds a heading by text or anchor id: exact first, then a unique partial match. */
function findHeading(headings: Heading[], wanted: string, ids: Map<string, string>): number {
  const raw = wanted.trim().replace(/^#/, '');
  const low = plain(raw).toLowerCase();
  const slug = slugify(raw);
  const exact = headings.findIndex(
    (h) => h.text.toLowerCase() === low || slugify(h.text) === slug || ids.get(raw) === h.text,
  );
  if (exact >= 0) return exact;
  const partial = headings.map((h, i) => (h.text.toLowerCase().includes(low) ? i : -1)).filter((i) => i >= 0);
  return partial.length === 1 ? partial[0] : -1;
}

/** Caps Markdown at MAX_CHARS from `offset`, cutting at a line break. */
function capped(markdown: string, offset: number) {
  const total = markdown.length;
  const from = Math.min(Math.max(0, offset), total);
  let end = Math.min(total, from + MAX_CHARS);
  if (end < total) {
    const cut = markdown.lastIndexOf('\n', end);
    if (cut > from + MAX_CHARS / 2) end = cut;
  }
  const result: {markdown: string; truncated: boolean; note?: string; totalChars: number} = {
    markdown: markdown.slice(from, end),
    truncated: end < total || from > 0,
    totalChars: total,
  };
  if (end < total) {
    result.note = `Truncated: characters ${from}-${end} of ${total}. Call again with offset=${end} for the rest, or pass "section" to get one part.`;
  } else if (from > 0) {
    result.note = `Characters ${from}-${total} of ${total} (the end).`;
  }
  return result;
}

// --- Tools -------------------------------------------------------------------------

const sectionLabel = (page: Page) => page.section;

async function searchDocs(input: Record<string, unknown> = {}) {
  const query = typeof input['query'] === 'string' ? input['query'].trim() : '';
  if (!query) throw new ToolError('Pass a non-empty "query".');
  const limit = Math.min(Math.max(Math.floor(Number(input['limit'] ?? DEFAULT_LIMIT)) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const index = await requireIndex();
  const results: Array<{
    title: string;
    section: string;
    heading: string;
    url: string;
    snippet: string;
  }> = [];
  for (const r of index.search(query)) {
    const rows: Array<{heading: string; url: string; snip: string}> = [];
    if (r.titleMatch || !r.sections.length) {
      const intro = r.page.sections[0];
      rows.push({
        heading: r.page.title,
        url: r.page.url,
        snip: r.page.description || (intro ? snippet(intro, r.tokens) : ''),
      });
    }
    for (const s of r.sections as Section[]) {
      if (!s.id) {
        if (!rows.length) rows.push({heading: r.page.title, url: r.page.url, snip: snippet(s, r.tokens)});
        continue;
      }
      rows.push({heading: s.heading, url: `${r.page.url}#${s.id}`, snip: snippet(s, r.tokens)});
    }
    for (const row of rows) {
      results.push({
        title: r.page.title,
        section: sectionLabel(r.page),
        heading: row.heading,
        url: abs(row.url),
        snippet: row.snip,
      });
    }
  }
  return {query, count: Math.min(results.length, limit), results: results.slice(0, limit)};
}

async function getPage(input: Record<string, unknown> = {}) {
  const index = await requireIndex();
  const page = resolvePage(index, input['path'] ?? input['url']);
  const md = await loadMarkdown(page.url);
  const base = {title: page.title, url: abs(page.url), markdownUrl: abs(markdownUrlPath(page.url))};
  const offset = Number(input['offset'] ?? 0) || 0;
  const wanted = typeof input['section'] === 'string' ? input['section'].trim() : '';
  if (!wanted) return {...base, ...capped(md, offset)};

  const lines = md.split('\n');
  const headings = parseHeadings(lines);
  const ids = new Map(page.sections.map((s) => [s.id, s.heading]));
  const i = findHeading(headings, wanted, ids);
  if (i < 0) {
    throw new ToolError(
      `No section "${wanted}" on ${page.url}. Sections: ${headings
        .filter((h) => h.level === 2 || h.level === 3)
        .map((h) => h.text)
        .join('; ')}.`,
    );
  }
  return {...base, section: headings[i].text, ...capped(sliceSection(lines, headings, i), offset)};
}

async function listPages(input: Record<string, unknown> = {}) {
  const wanted = typeof input['section'] === 'string' ? input['section'].trim().toLowerCase() : '';
  if (wanted && !SECTIONS.includes(wanted)) {
    throw new ToolError(`"section" must be one of ${SECTIONS.join(', ')}.`);
  }
  const index = await requireIndex();
  const pages = index.pages
    .filter((p) => !wanted || p.section === wanted)
    .map((p) => ({
      title: p.title,
      section: p.section,
      description: p.description,
      url: abs(p.url),
      markdownUrl: abs(markdownUrlPath(p.url)),
    }));
  return {count: pages.length, pages};
}

async function getComponentApi(input: Record<string, unknown> = {}) {
  const name = String(input['tag'] ?? input['name'] ?? '').trim().toLowerCase();
  if (!name) throw new ToolError('Pass "tag" (for example "md-gb-button") or a component name ("split button").');
  const tag = name.startsWith('md-gb-') ? name : 'md-gb-' + name.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const index = await requireIndex();
  // The component page named by the tag: the longest slug that prefixes it.
  const body = tag.slice(6);
  let page: Page | undefined;
  for (const p of index.pages) {
    if (p.section !== 'components') continue;
    if (body === p.slug || body.startsWith(p.slug + '-')) {
      if (!page || p.slug.length > page.slug.length) page = p;
    }
  }
  if (!page) {
    throw new ToolError(`No component page for "${tag}". Use search_docs with the element name, or list_pages with section "components".`);
  }
  const md = await loadMarkdown(page.url);
  const lines = md.split('\n');
  const headings = parseHeadings(lines);
  const api = headings.findIndex((h) => h.level === 2 && h.text.toLowerCase() === 'api reference');
  if (api < 0) throw new ToolError(`${page.url} has no API reference section.`);
  const apiLines = sliceSection(lines, headings, api).split('\n');
  const apiHeadings = parseHeadings(apiLines);
  const element = apiHeadings.findIndex((h) => h.level === 3 && h.text.toLowerCase() === `<${tag}>`);
  const elements = apiHeadings.filter((h) => h.level === 3).map((h) => h.text);
  const base = {tag, page: abs(page.url), markdownUrl: abs(markdownUrlPath(page.url))};
  if (element < 0) {
    return {
      ...base,
      note: `${page.url} documents ${elements.join(', ')}; "${tag}" is not one of them, so the whole API reference is returned.`,
      ...capped(apiLines.join('\n'), 0),
    };
  }
  return {...base, ...capped(sliceSection(apiLines, apiHeadings, element), 0)};
}

function getCurrentPage() {
  const h1 = document.querySelector('main h1')?.textContent?.trim();
  const outline = [...document.querySelectorAll<HTMLElement>('main h2[id], main h3[id]')]
    .filter((h) => !h.closest('md-gb-dialog, dialog, [inert]'))
    .map((h) => ({
      level: Number(h.localName[1]),
      heading: h.textContent?.trim() ?? '',
      id: h.id,
      url: `${origin()}${location.pathname}#${h.id}`,
    }));
  const path = location.pathname;
  return Promise.resolve({
    title: h1 || document.title,
    url: origin() + path,
    markdownUrl: abs(markdownUrlPath(path.endsWith('/') ? path : path + '/')),
    hash: location.hash.slice(1) || undefined,
    outline,
  });
}

// --- Registration --------------------------------------------------------------------

/** Wraps a tool so that failures come back as `{error}` for the agent to read. */
function safe(run: (input?: Record<string, unknown>) => Promise<unknown>) {
  return async (input?: Record<string, unknown>) => {
    try {
      return await run(input ?? {});
    } catch (e) {
      return {error: e instanceof Error ? e.message : String(e)};
    }
  };
}

const tools: ToolDefinition[] = [
  {
    name: 'search_docs',
    title: 'Search the Material Web 3.0 docs',
    description:
      'Search the Material Web 3.0 (md-gb-*) documentation. Use this first for any question about a component, attribute, token, style or guideline; it returns the best matching sections with a snippet and a URL with an #anchor. Then call get_page with that URL (and the heading as "section") to read the details.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {type: 'string', description: 'Words to look for, for example "split button menu" or "md-gb-dialog close".'},
        limit: {type: 'integer', minimum: 1, maximum: MAX_LIMIT, default: DEFAULT_LIMIT, description: 'Maximum number of results.'},
      },
      required: ['query'],
      additionalProperties: false,
    },
    annotations: {readOnlyHint: true},
    execute: safe(searchDocs),
  },
  {
    name: 'get_page',
    title: 'Get a docs page as Markdown',
    description:
      'Read a page of the Material Web 3.0 docs as Markdown, or just one section of it. Use it after search_docs or list_pages when you need the full text, examples or accessibility notes. Long pages are cut off: pass "section" (a heading such as "Anatomy" or an anchor id) or "offset" to continue.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {type: 'string', description: 'Page path or URL, for example "/3.0/components/button/" or "components/button".'},
        url: {type: 'string', description: 'Alias of "path": a full URL of this site.'},
        section: {type: 'string', description: 'Heading text or anchor id of one section, for example "Anatomy" or "accessibility".'},
        offset: {type: 'integer', minimum: 0, description: 'Start at this character, to continue a truncated result.'},
      },
      anyOf: [{required: ['path']}, {required: ['url']}],
      additionalProperties: false,
    },
    annotations: {readOnlyHint: true},
    execute: safe(getPage),
  },
  {
    name: 'list_pages',
    title: 'List the docs pages',
    description:
      'List the pages of the Material Web 3.0 docs with title, description and URLs. Use it to see what exists (for example every component) before choosing pages to read; use search_docs when you have keywords.',
    inputSchema: {
      type: 'object',
      properties: {
        section: {type: 'string', enum: SECTIONS, description: 'Only the pages of this section.'},
      },
      additionalProperties: false,
    },
    annotations: {readOnlyHint: true},
    execute: safe(listPages),
  },
  {
    name: 'get_component_api',
    title: 'Get the API of a component',
    description:
      'Get the API reference of one md-gb-* element as Markdown: properties and attributes, slots, events, methods, CSS parts and CSS custom properties. Use it when writing or checking code that uses a component, instead of reading the whole page.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {type: 'string', description: 'Element tag such as "md-gb-split-button", or a component name such as "split button".'},
      },
      required: ['tag'],
      additionalProperties: false,
    },
    annotations: {readOnlyHint: true},
    execute: safe(getComponentApi),
  },
  {
    name: 'get_current_page',
    title: 'Get the current docs page',
    description:
      'Describe the docs page the user is looking at: title, URL, outline (h2 and h3 with anchors) and the URL of its Markdown. Use it to answer questions such as "what does this page say" or "explain this section", then read it with get_page.',
    inputSchema: {type: 'object', properties: {}, additionalProperties: false},
    annotations: {readOnlyHint: true},
    execute: safe(getCurrentPage),
  },
];

function modelContext(): ModelContext | undefined {
  return (
    (document as Document & {modelContext?: ModelContext}).modelContext ??
    (navigator as Navigator & {modelContext?: ModelContext}).modelContext
  );
}

function register() {
  // The execute functions by name, also without WebMCP (the AI agents page demo).
  (window as unknown as {gbDocsTools: Record<string, ToolDefinition['execute']>}).gbDocsTools =
    Object.fromEntries(tools.map((t) => [t.name, t.execute]));

  const context = modelContext();
  if (!context || typeof context.registerTool !== 'function') return;
  for (const tool of tools) {
    try {
      // Rejections (a duplicate name, a missing permission) just leave the tool out.
      Promise.resolve(context.registerTool(tool)).catch(() => {});
    } catch {
      // Same for builds that throw synchronously.
    }
  }
}

if (location.pathname.startsWith(BASE)) {
  if ((document as Document & {prerendering?: boolean}).prerendering) {
    document.addEventListener('prerenderingchange', register, {once: true});
  } else {
    register();
  }
}
