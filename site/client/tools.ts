/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The spec shell's tools as action handlers over its state store
 * (spec/shell.cjs): Download & copy, Customize theme,
 * Send feedback and Install. The UI is the spec; this file only acts: it
 * copies, downloads, installs, generates the theme's CSS and opens the
 * feedback issue, and reports back through state (`/snack`, `/install`,
 * `/feedback`).
 *
 * The theme uses the old shell's storage keys and cache (gb-theme-css), so
 * the pre-paint script and the reader's saved theme carry over.
 */

import type {StateStore} from '@json-render/core';
import {
  themeFromSource,
  themeToCss,
  type SchemeVariant,
} from '@material/web/styles/color/dynamic-color.js';

import type {ActionHandler} from '@material/web/json-render/renderer.js';

export const DEFAULT_SEED = '#6750a4';
export const DEFAULT_VARIANT: SchemeVariant = 'tonal-spot';
const VARIANTS: readonly SchemeVariant[] = [
  'tonal-spot', 'neutral', 'vibrant', 'expressive', 'fidelity', 'content', 'monochrome', 'rainbow', 'fruit-salad',
];
const CONTRASTS = ['standard', 'medium', 'high'] as const;
type Contrast = (typeof CONTRASTS)[number];
/** Bump with themeToCss output changes (the pre-paint script checks it). */
const THEME_CACHE_VERSION = 3;
const KEYS = {seed: 'gb-seed-color', variant: 'gb-scheme-variant', contrast: 'gb-contrast', css: 'gb-theme-css'};

const GITHUB_URL = 'https://github.com/material-components/material-web';
const NPM_COMMAND = 'npm install @material/web';
const CDN_SNIPPET = `<script type="importmap">
  {"imports": {"@material/web/": "https://esm.run/@material/web/"}}
</script>
<script type="module" src="https://esm.run/@material/web/all.js"></script>`;

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage is off: the choice lasts for the page.
  }
};

/** The saved theme, as the spec's `/theme` state. */
export function savedTheme() {
  const seed = read(KEYS.seed);
  const variant = read(KEYS.variant) as SchemeVariant | null;
  const contrast = read(KEYS.contrast) as Contrast | null;
  const hex = seed && /^#[0-9a-f]{6}$/i.test(seed) ? seed.toLowerCase() : DEFAULT_SEED;
  return {
    seed: hex,
    seedInput: hex,
    variant: variant && VARIANTS.includes(variant) ? variant : DEFAULT_VARIANT,
    contrast: contrast && (CONTRASTS as readonly string[]).includes(contrast) ? contrast : 'standard',
  };
}

/**
 * Applies a theme: the dynamic color CSS of its seed, variant and contrast
 * (light-dark() values, so it follows the color mode; standard contrast also
 * gets high contrast under prefers-contrast: more), cached and saved. The
 * default theme needs no CSS (the baseline tokens).
 */
export function applyTheme({seed, variant, contrast}: {seed: string; variant: SchemeVariant; contrast: Contrast}) {
  const style = document.getElementById('gb-theme-style');
  if (seed === DEFAULT_SEED && variant === DEFAULT_VARIANT && contrast === 'standard') {
    style?.remove();
    for (const key of Object.values(KEYS)) write(key, null);
    return;
  }
  write(KEYS.seed, seed);
  write(KEYS.variant, variant);
  write(KEYS.contrast, contrast);
  const key = [seed, variant, contrast].join('|');
  let css = '';
  try {
    const cached = JSON.parse(read(KEYS.css) ?? 'null');
    if (cached?.v === THEME_CACHE_VERSION && cached.key === key) css = cached.css;
  } catch {
    // Regenerate below.
  }
  if (!css) {
    const make = (level: Contrast) =>
      themeToCss(themeFromSource({source: seed, variant, contrast: level}), {layer: ''});
    css = contrast === 'standard' ? `${make('standard')}@media (prefers-contrast: more){${make('high')}}` : make(contrast);
    write(KEYS.css, JSON.stringify({v: THEME_CACHE_VERSION, key, css}));
  }
  let el = style;
  if (!el) {
    el = document.createElement('style');
    el.id = 'gb-theme-style';
    document.head.append(el);
  }
  el.textContent = css;
}

/** The text of a copy action. */
function copyText(id: string, site: string): string {
  switch (id) {
    case 'agent-prompt':
      return `Install the md-gb skill, then set up Material Web 3.0 in this project.

md-gb is an agent skill about the md-gb-* Material 3 Expressive web components (Material Web 3.0): which tag to pick, and its attributes, slots, events, CSS parts and custom properties.

1. Create the folder ~/.claude/skills/md-gb/ (or <repo>/.claude/skills/md-gb/ to install the skill for this repository only).
2. Fetch ${site}/3.0/skill/index.json. It lists the skill's files, each with a "path" and an absolute "url". Download every file to its path inside the folder: SKILL.md and reference/*.md (keep the reference/ subfolder).
3. In the project, run: ${NPM_COMMAND}
4. Verify: open ~/.claude/skills/md-gb/SKILL.md (its front matter starts with "name: md-gb") and check that reference/ holds one .md file per component.

The documentation is also plain text for you to read: ${site}/3.0/llms.txt is the index of pages, and ${site}/3.0/llms-full.txt holds all of them.
`;
    case 'github':
      return GITHUB_URL;
    case 'npm':
      return NPM_COMMAND;
    case 'cdn':
      return CDN_SNIPPET;
    case 'shadcn':
      return `npx shadcn@latest add ${site}/3.0/r/md-theme.json`;
    default:
      return '';
  }
}

/** Copies text; false when the browser refuses both ways. */
async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // No clipboard API (insecure context) or no permission: the old way.
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.cssText = 'position:fixed;inset-block-start:0;opacity:0;pointer-events:none';
  document.body.append(area);
  const focused = document.activeElement as HTMLElement | null;
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  focused?.focus?.();
  return ok;
}

/** The GitHub new-issue URL of the feedback form. */
export function feedbackUrl(type: string, page: string, message: string): string {
  const pageTitle = document.title.replace(/ - Material Web 3\.0$/, '');
  const params = new URLSearchParams({
    title: `[3.0 docs] ${type}: ${pageTitle}`,
    body: `${message.trim()}\n\n---\nPage: ${page}\nType: ${type}`,
  });
  return `${GITHUB_URL}/issues/new?${params}`;
}

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>;
}
let installPrompt: InstallPromptEvent | null = null;
// Chromium offers the install prompt once, early: keep it for the action.
addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event as InstallPromptEvent;
});

/** The tools' actions, over the shell's state store. */
export function toolHandlers(store: StateStore, siteUrl: string): Record<string, ActionHandler> {
  const notify = (text: string) => store.update({'/snack/text': text, '/snack/open': true});
  return {
    openTool: ({tool}) => store.set('/tool', String(tool)),
    closeTool: () => store.set('/tool', ''),
    download: ({href, name}) => {
      const a = document.createElement('a');
      a.href = String(href);
      a.download = String(name);
      a.hidden = true;
      document.body.append(a);
      a.click();
      a.remove();
      notify(`Downloading ${String(name)}`);
    },
    copy: async ({id, done}) => {
      const ok = await copy(copyText(String(id), siteUrl));
      notify(ok ? String(done) : 'Could not copy: the browser blocked the clipboard');
    },
    install: async () => {
      if (!installPrompt) {
        store.set('/install/open', true);
        return;
      }
      const prompt = installPrompt;
      installPrompt = null;
      try {
        await prompt.prompt();
        const {outcome} = await prompt.userChoice;
        if (outcome === 'accepted') notify('Material Web 3.0 is installed');
      } catch {
        store.set('/install/open', true);
      }
    },
    setSeed: ({seed}) => store.update({'/theme/seed': String(seed), '/theme/seedInput': String(seed)}),
    applySeedInput: () => {
      const value = String(store.get('/theme/seedInput') ?? '').trim();
      const hex = value.startsWith('#') ? value : `#${value}`;
      if (/^#[0-9a-f]{6}$/i.test(hex)) store.set('/theme/seed', hex.toLowerCase());
      else notify('Enter a color as six hex digits, such as #6750a4');
    },
    resetTheme: () => {
      store.update({
        '/theme/seed': DEFAULT_SEED,
        '/theme/seedInput': DEFAULT_SEED,
        '/theme/variant': DEFAULT_VARIANT,
        '/theme/contrast': 'standard',
        '/colorMode': 'auto',
      });
      notify('Theme reset');
    },
    openFeedback: () =>
      store.update({
        '/tool': '',
        '/feedback/page': location.href,
        '/feedback/message': '',
        '/feedback/error': false,
        '/feedback/open': true,
      }),
    submitFeedback: () => {
      const message = String(store.get('/feedback/message') ?? '');
      if (!message.trim()) {
        store.set('/feedback/error', true);
        return;
      }
      const url = feedbackUrl(
        String(store.get('/feedback/type') ?? 'bug'),
        String(store.get('/feedback/page') ?? location.href),
        message,
      );
      open(url, '_blank', 'noopener');
      store.update({'/feedback/open': false, '/feedback/error': false});
    },
  };
}
