/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/**
 * Search bar CSS classes.
 */
export const SEARCH_BAR_CLASSES = {
  searchBar: 'search-bar',
  expanded: 'search-bar-expanded',
  disabled: 'search-bar-disabled',
  leading: 'search-bar-leading',
  input: 'search-bar-input',
  trailing: 'search-bar-trailing',
} as const;

/**
 * Search view CSS classes.
 *
 * `search-view` is the token root: it declares the search view tokens, like
 * `md-gb-search-view`'s host. The `<dialog>` inside the element omits it so
 * that token values set on the host still apply.
 */
export const SEARCH_VIEW_CLASSES = {
  searchView: 'search-view',
  dialog: 'search-view-dialog',
  open: 'search-view-open',
  opening: 'search-view-opening',
  closing: 'search-view-closing',
  docked: 'search-view-docked',
  divided: 'search-view-divided',
  anchored: 'search-view-anchored',
  container: 'search-view-container',
  header: 'search-view-header',
  input: 'search-view-input',
  divider: 'search-view-divider',
  results: 'search-view-results',
} as const;

/**
 * State provided to `searchBarClasses()`.
 */
export interface SearchBarClassesState {
  /** Whether the bar's search view is open. */
  expanded?: boolean;
  /** Whether the bar is disabled. */
  disabled?: boolean;
}

/**
 * Returns the class map object for a search bar based on the given state.
 */
export function searchBarClasses({
  expanded = false,
  disabled = false,
}: SearchBarClassesState = {}): ClassInfo {
  return {
    [SEARCH_BAR_CLASSES.searchBar]: true,
    [SEARCH_BAR_CLASSES.expanded]: expanded,
    [SEARCH_BAR_CLASSES.disabled]: disabled,
  };
}

/**
 * State provided to `searchViewClasses()`.
 */
export interface SearchViewClassesState {
  /**
   * Whether the element declares the search view tokens. Defaults to true;
   * `md-gb-search-view` passes false for its inner `<dialog>`, since its host
   * declares them.
   */
  tokens?: boolean;
  open?: boolean;
  opening?: boolean;
  closing?: boolean;
  /** Docked layout: a drop-down below the search bar. Else full-screen. */
  docked?: boolean;
  /** Divided (baseline) style. Else contained (M3 Expressive). */
  divided?: boolean;
  /** Whether the view is positioned over a search bar. */
  anchored?: boolean;
}

/**
 * Returns the class map object for a search view `<dialog>` based on the
 * given state.
 */
export function searchViewClasses({
  tokens = true,
  open = false,
  opening = false,
  closing = false,
  docked = false,
  divided = false,
  anchored = false,
}: SearchViewClassesState = {}): ClassInfo {
  return {
    [SEARCH_VIEW_CLASSES.searchView]: tokens,
    [SEARCH_VIEW_CLASSES.dialog]: true,
    [SEARCH_VIEW_CLASSES.open]: open,
    [SEARCH_VIEW_CLASSES.opening]: opening,
    [SEARCH_VIEW_CLASSES.closing]: closing,
    [SEARCH_VIEW_CLASSES.docked]: docked,
    [SEARCH_VIEW_CLASSES.divided]: divided,
    [SEARCH_VIEW_CLASSES.anchored]: anchored,
  };
}

/**
 * The enabled `[role=option]` elements of a search view's results container,
 * including elements assigned to a `<slot>` inside it.
 */
export function getResultOptions(results: Element): HTMLElement[] {
  const roots: Element[] = [];
  for (const child of results.children) {
    if (child instanceof HTMLSlotElement) {
      roots.push(...child.assignedElements({flatten: true}));
    } else {
      roots.push(child);
    }
  }
  const options: HTMLElement[] = [];
  for (const el of roots) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.matches('[role="option"]')) options.push(el);
    options.push(...el.querySelectorAll<HTMLElement>('[role="option"]'));
  }
  return options.filter(
    (option) =>
      !option.hidden &&
      option.getAttribute('aria-disabled') !== 'true' &&
      !option.hasAttribute('disabled'),
  );
}

/**
 * Sets up search view keyboard behavior on a `<dialog>` element: Escape
 * closes the view, and the arrow keys move focus between the input and the
 * `[role=option]` results.
 *
 * Closing calls the dialog's `close()`; `md-gb-search-view` handles these
 * keys itself so that it can animate closed.
 *
 * @param view The search view `<dialog>` element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export function setupSearchView(
  view: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  const closeView = () => {
    const el = view as HTMLElement & {close?: () => void};
    el.close?.();
  };

  view.addEventListener(
    'cancel',
    (event) => {
      // Escape (or the platform back gesture) animates closed instead of
      // closing immediately.
      event.preventDefault();
      closeView();
    },
    opts,
  );

  view.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeView();
        return;
      }
      const input = view.querySelector<HTMLInputElement>(
        `.${SEARCH_VIEW_CLASSES.input}`,
      );
      const results = view.querySelector(`.${SEARCH_VIEW_CLASSES.results}`);
      if (!input || !results) return;
      moveResultFocus(event, input, getResultOptions(results));
    },
    opts,
  );
}

/**
 * Moves focus between a search input and its result options for an arrow,
 * Home or End key. Returns true when the key was handled.
 */
export function moveResultFocus(
  event: KeyboardEvent,
  input: HTMLElement,
  options: HTMLElement[],
): boolean {
  if (!options.length) return false;
  const path = event.composedPath();
  const fromInput = path.includes(input);
  const current = options.findIndex((option) => path.includes(option));
  if (!fromInput && current === -1) return false;

  let next: HTMLElement | null = null;
  switch (event.key) {
    case 'ArrowDown':
      next = fromInput ? options[0] : options[current + 1] ?? options[0];
      break;
    case 'ArrowUp':
      if (fromInput) {
        next = options[options.length - 1];
      } else {
        next = current === 0 ? input : options[current - 1];
      }
      break;
    case 'Home':
      if (!fromInput) next = options[0];
      break;
    case 'End':
      if (!fromInput) next = options[options.length - 1];
      break;
    default:
      break;
  }
  if (!next) return false;
  event.preventDefault();
  if (next !== input && !next.hasAttribute('tabindex')) {
    next.tabIndex = -1;
  }
  next.focus();
  return true;
}

/**
 * A Lit directive that adds search bar classes to an element.
 */
export const searchBar = createClassMapDirective({
  getClasses: searchBarClasses,
});

/**
 * A Lit directive that adds search view classes and keyboard behavior to a
 * `<dialog>` element.
 */
export const searchView = createClassMapDirective({
  getClasses: searchViewClasses,
  setupElement: setupSearchView,
});
