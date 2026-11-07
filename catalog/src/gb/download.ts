/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The "Download and copy" menu of the app bar (imported by gb.ts; markup in
 * site/_includes/gb/default.html):
 *
 * - Install app: the PWA install prompt (`beforeinstallprompt`), hidden once
 *   the app is installed or running as one. Where the browser never offers
 *   the prompt (Safari, Firefox) the item opens a dialog with the steps of
 *   each browser instead.
 * - Downloads (the single-file site, llms-full.txt, custom-elements.json):
 *   a temporary `<a download>` is clicked, since menu items are not links.
 *   The size of each file shows in its supporting text; the first time the
 *   menu opens it asks the server (HEAD), and an item whose file is missing
 *   is hidden.
 * - Copy items: the text goes to the clipboard (`navigator.clipboard`, else a
 *   hidden textarea and `execCommand('copy')`), and an `md-gb-snackbar`
 *   confirms it; the snackbar announces its message in a polite live region.
 *
 * Nothing runs until the menu is opened or an item is chosen, so a prerendered
 * page does no clipboard, network or install work.
 */

import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/dialog/md-gb-dialog.js';
import '@material/web/labs/gb/components/divider/md-gb-divider.js';
// The menu first: items and groups find it through a context, which only
// reaches those upgraded after it is defined.
import '@material/web/labs/gb/components/menu/md-gb-menu.js';
import '@material/web/labs/gb/components/menu/md-gb-menu-group.js';
import '@material/web/labs/gb/components/menu/md-gb-menu-item.js';
import '@material/web/labs/gb/components/snackbar/md-gb-snackbar.js';

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>;
}

interface Dialog extends HTMLElement {
  show(): Promise<void>;
}

interface Snackbar extends HTMLElement {
  labelText: string;
  show(): Promise<void> | void;
}

const menu = document.getElementById('gb-download-menu');

/** The text of a copy item, built when it is chosen. */
function copyText(id: string, site: string): string {
  switch (id) {
    case 'agent-prompt':
      return agentPrompt(site);
    case 'npm':
      return NPM_COMMAND;
    case 'cdn':
      return CDN_SNIPPET;
    default:
      return '';
  }
}

const NPM_COMMAND = 'npm install @material/web';

const CDN_SNIPPET = `<script type="importmap">
  {"imports": {"@material/web/": "https://esm.run/@material/web/"}}
</script>
<script type="module" src="https://esm.run/@material/web/labs/gb/all.js"></script>`;

/** Plain text for an AI coding agent: install the md-gb skill. */
function agentPrompt(site: string): string {
  return `Install the md-gb skill, then set up Material Web 3.0 in this project.

md-gb is an agent skill about the md-gb-* Material 3 Expressive web components (Material Web 3.0): which tag to pick, and its attributes, slots, events, CSS parts and custom properties.

1. Create the folder ~/.claude/skills/md-gb/ (or <repo>/.claude/skills/md-gb/ to install the skill for this repository only).
2. Fetch ${site}/3.0/skill/index.json. It lists the skill's files, each with a "path" and an absolute "url". Download every file to its path inside the folder: SKILL.md and reference/*.md (keep the reference/ subfolder).
3. In the project, run: ${NPM_COMMAND}
4. Verify: open ~/.claude/skills/md-gb/SKILL.md (its front matter starts with "name: md-gb") and check that reference/ holds one .md file per component.

The documentation is also plain text for you to read: ${site}/3.0/llms.txt is the index of pages, and ${site}/3.0/llms-full.txt holds all of them.
`;
}

/** Copies text; resolves false when the browser refuses both ways. */
async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // No clipboard API (insecure context) or permission denied: the old way.
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.cssText = 'position:fixed;inset-block-start:0;inset-inline-start:0;opacity:0;pointer-events:none';
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

function notify(message: string) {
  const snackbar = document.getElementById('gb-snackbar') as Snackbar | null;
  if (!snackbar) return;
  snackbar.labelText = message;
  void snackbar.show();
}

/** Saves a file of this site without leaving the page. */
function download(href: string, name: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  a.hidden = true;
  document.body.append(a);
  a.click();
  a.remove();
}

// --- Install ---------------------------------------------------------------

let installPrompt: InstallPromptEvent | null = null;
const installItem = document.getElementById('gb-install');

const installedModes = [
  '(display-mode: standalone)',
  '(display-mode: minimal-ui)',
  '(display-mode: window-controls-overlay)',
];
const isInstalled = () =>
  installedModes.some((query) => matchMedia(query).matches) ||
  (navigator as Navigator & {standalone?: boolean}).standalone === true;

let installed = false;
function syncInstall() {
  if (installItem) installItem.hidden = installed || isInstalled();
}

// Chromium offers the prompt once, early: keep it for the menu item.
addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event as InstallPromptEvent;
});
addEventListener('appinstalled', () => {
  installed = true;
  installPrompt = null;
  syncInstall();
  notify('Material Web 3.0 is installed');
});
for (const query of installedModes) {
  matchMedia(query).addEventListener('change', syncInstall);
}

async function install() {
  if (installPrompt) {
    const prompt = installPrompt;
    installPrompt = null; // A prompt can be used once.
    try {
      await prompt.prompt();
      const {outcome} = await prompt.userChoice;
      if (outcome === 'accepted') installed = true;
      syncInstall();
    } catch {
      showInstallSteps();
    }
    return;
  }
  showInstallSteps();
}

/** The steps of each browser, the one in use first. */
function showInstallSteps() {
  const dialog = document.getElementById('gb-install-dialog') as Dialog | null;
  if (!dialog) return;
  const ua = navigator.userAgent;
  const mobileSafari = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const safari = /Safari\//.test(ua) && !/Chrom(e|ium)|Edg\/|OPR\//.test(ua);
  const firefox = /Firefox\//.test(ua);
  const list = dialog.querySelector<HTMLElement>('[data-install-steps]');
  if (list) {
    const items = [...list.children] as HTMLElement[];
    const first = mobileSafari ? 'ios' : safari ? 'safari' : firefox ? 'firefox' : 'chromium';
    items.sort((a, b) => Number(b.dataset['browser'] === first) - Number(a.dataset['browser'] === first));
    list.replaceChildren(...items);
  }
  void dialog.show();
}

syncInstall();

// --- Menu ------------------------------------------------------------------

function formatSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Fills in the sizes of the downloads and hides the ones that are not built. */
async function loadDownloads() {
  const items = menu?.querySelectorAll<HTMLElement>('[data-download]') ?? [];
  await Promise.all(
    [...items].map(async (item) => {
      const href = item.dataset['download']!;
      const text = item.querySelector<HTMLElement>('[slot="supporting-text"]');
      try {
        const response = await fetch(href, {method: 'HEAD'});
        if (!response.ok) {
          item.hidden = true;
          return;
        }
        const length = Number(response.headers.get('content-length'));
        if (length > 0 && text) {
          text.textContent = `${text.dataset['base']} (${formatSize(length)})`;
        }
      } catch {
        // Offline or blocked: leave the item as it is.
      }
    }),
  );
}

let loaded = false;
menu?.addEventListener('toggle', (event) => {
  if ((event as ToggleEvent).newState !== 'open' || event.target !== menu) return;
  syncInstall();
  if (loaded) return;
  loaded = true;
  void loadDownloads();
});

menu?.addEventListener('click', (event) => {
  const item = (event.target as Element).closest<HTMLElement>('md-gb-menu-item');
  if (!item || !menu.contains(item)) return;
  const site = menu.dataset['siteUrl'] ?? location.origin;
  if (item.dataset['action'] === 'install') {
    void install();
  } else if (item.dataset['download']) {
    download(item.dataset['download'], item.dataset['filename'] ?? '');
  } else if (item.dataset['copy']) {
    const text = copyText(item.dataset['copy'], site);
    void copy(text).then((ok) =>
      notify(ok ? (item.dataset['copied'] ?? 'Copied') : 'Could not copy. Select the text on the page instead'),
    );
  }
});
