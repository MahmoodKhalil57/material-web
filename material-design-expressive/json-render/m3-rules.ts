/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview M3 rules that a json-render spec is checked against, beyond
 * what the catalog's prop types express: counts, deprecations and required
 * content from the M3 spec pages. Each rule quotes its page word for word;
 * scripts/api/gen-json-render.mjs fails when a quote is no longer on its
 * page of the local spec mirror. The rules go into the generation prompt
 * (`m3Prompt()`) and are checked by `checkM3()`.
 *
 * Imports are type-only, so Node can load this file directly.
 */

import type {Spec, UIElement} from '@json-render/core';

/** A rule broken by a spec. */
export interface M3Issue {
  /** The rule's id. */
  rule: string;
  /** `error` for a "can"/"must" rule, `warning` for a "should" rule. */
  severity: 'error' | 'warning';
  /** The key of the element that breaks it. */
  element: string;
  /** What is wrong, in plain words. */
  message: string;
  /** The spec page the rule comes from. */
  spec: string;
}

/** An M3 rule with its source and its check. */
export interface M3Rule {
  id: string;
  /** The catalog component it applies to. */
  component: string;
  severity: 'error' | 'warning';
  /** The rule, as given to the generation prompt. */
  rule: string;
  /** The spec page (under m3.material.io) and the sentence the rule rests on. */
  source: {page: string; quote: string};
  /** The elements of a spec that break the rule, with why. */
  check(index: SpecIndex): Array<{element: string; message: string}>;
}

/** A spec with parent and child lookups. */
export interface SpecIndex {
  spec: Spec;
  /** Every element of a type, as [key, element]. */
  ofType(type: string): Array<[string, UIElement]>;
  /** The parent key of an element (through children or slots). */
  parentOf(key: string): string | undefined;
  /** The elements of a slot of an element (`default` for children). */
  slot(key: string, slot?: string): Array<[string, UIElement]>;
  /** An element and all its descendants. */
  subtree(key: string): Array<[string, UIElement]>;
}

/** Indexes a spec for the rules. */
export function indexSpec(spec: Spec): SpecIndex {
  const elements = spec.elements ?? {};
  const parents = new Map<string, string>();
  for (const [key, el] of Object.entries(elements)) {
    for (const child of el.children ?? []) parents.set(child, key);
    for (const keys of Object.values(el.slots ?? {})) {
      for (const child of keys) parents.set(child, key);
    }
  }
  const entry = (key: string): Array<[string, UIElement]> =>
    elements[key] ? [[key, elements[key]]] : [];
  const index: SpecIndex = {
    spec,
    ofType: (type) => Object.entries(elements).filter(([, el]) => el.type === type),
    parentOf: (key) => parents.get(key),
    slot: (key, slot = 'default') => {
      const el = elements[key];
      const keys = slot === 'default' ? (el?.children ?? []) : (el?.slots?.[slot] ?? []);
      return keys.flatMap(entry);
    },
    subtree: (key) => {
      const out: Array<[string, UIElement]> = [];
      const seen = new Set<string>();
      const walk = (k: string) => {
        if (seen.has(k) || !elements[k]) return;
        seen.add(k);
        out.push([k, elements[k]]);
        const el = elements[k];
        for (const child of el.children ?? []) walk(child);
        for (const keys of Object.values(el.slots ?? {})) for (const child of keys) walk(child);
      };
      walk(key);
      return out;
    },
  };
  return index;
}

/** Children counts are only known when the children don't repeat over state. */
const counted = (el: UIElement) => !el.repeat;

/** Whether an element has non-empty text in its default slot. */
function hasText(index: SpecIndex, key: string): boolean {
  return index.slot(key).some(([, child]) => {
    if (child.type !== 'Text') return false;
    const text = (child.props as {text?: unknown}).text;
    return typeof text !== 'string' || text.trim() !== '';
  });
}

const between = (n: number, min: number, max: number) => n >= min && n <= max;

/** The M3 rules, by component. */
export const M3_RULES: M3Rule[] = [
  {
    id: 'navigation-drawer-deprecated',
    component: 'NavDrawer',
    severity: 'warning',
    rule: 'Do not use NavDrawer (deprecated in M3 Expressive); use NavRail with expanded instead.',
    source: {
      page: 'components/navigation-drawer',
      quote: 'The navigation drawer is no longer recommended in the Material 3 Expressive update',
    },
    check: (index) =>
      index.ofType('NavDrawer').map(([key]) => ({
        element: key,
        message: 'NavDrawer is deprecated in M3 Expressive; use NavRail with expanded.',
      })),
  },
  {
    id: 'segmented-buttons-2-to-5',
    component: 'SegmentedButtonSet',
    severity: 'error',
    rule: 'A SegmentedButtonSet has 2 to 5 SegmentedButton children; use chips for more.',
    source: {
      page: 'components/segmented-buttons',
      quote: 'There can be anywhere from 2 to 5 segments in single-select and multi-select segmented buttons',
    },
    check: (index) =>
      index
        .ofType('SegmentedButtonSet')
        .filter(([, el]) => counted(el))
        .map(([key]) => [key, index.slot(key).filter(([, c]) => c.type === 'SegmentedButton').length] as const)
        .filter(([, n]) => !between(n, 2, 5))
        .map(([key, n]) => ({element: key, message: `${n} segments; segmented buttons have 2 to 5.`})),
  },
  {
    id: 'navigation-bar-3-to-5',
    component: 'NavBar',
    severity: 'error',
    rule: 'A NavBar has 3 to 5 NavBarItem destinations.',
    source: {page: 'components/navigation-bar', quote: 'Navigation bars can have three to five destinations'},
    check: (index) =>
      index
        .ofType('NavBar')
        .filter(([, el]) => counted(el))
        .map(([key]) => [key, index.slot(key).filter(([, c]) => c.type === 'NavBarItem').length] as const)
        .filter(([, n]) => !between(n, 3, 5))
        .map(([key, n]) => ({element: key, message: `${n} destinations; navigation bars have 3 to 5.`})),
  },
  {
    id: 'one-snackbar',
    component: 'Snackbar',
    severity: 'warning',
    rule: 'Show one Snackbar at a time; put several in a SnackbarHost, which queues them.',
    source: {page: 'components/snackbar', quote: 'Only one snackbar may be displayed at a time.'},
    check: (index) => {
      const loose = index
        .ofType('Snackbar')
        .filter(([key]) => index.spec.elements[index.parentOf(key) ?? '']?.type !== 'SnackbarHost');
      return loose.length > 1
        ? loose.slice(1).map(([key]) => ({
            element: key,
            message: `${loose.length} snackbars outside a SnackbarHost; only one is shown at a time.`,
          }))
        : [];
    },
  },
  {
    id: 'dialog-max-2-actions',
    component: 'Dialog',
    severity: 'warning',
    rule: 'A Dialog has at most two actions (buttons) in its "actions" slot.',
    source: {page: 'components/dialogs', quote: 'Dialogs should contain a maximum of two actions.'},
    check: (index) =>
      index
        .ofType('Dialog')
        .map(([key]) => {
          const actions = index
            .slot(key, 'actions')
            .flatMap(([k]) => index.subtree(k))
            .filter(([, el]) => el.type === 'Button' || (el.type === 'Html' && (el.props as {tag?: unknown}).tag === 'button'));
          return [key, actions.length] as const;
        })
        .filter(([, n]) => n > 2)
        .map(([key, n]) => ({element: key, message: `${n} actions; dialogs have at most two.`})),
  },
  {
    id: 'fab-menu-max-6',
    component: 'FabMenu',
    severity: 'error',
    rule: 'A FabMenu has up to six FabMenuItem children.',
    source: {page: 'components/fab-menu', quote: 'The FAB menu can have up to six items'},
    check: (index) =>
      index
        .ofType('FabMenu')
        .filter(([, el]) => counted(el))
        .map(([key]) => [key, index.slot(key).filter(([, c]) => c.type === 'FabMenuItem').length] as const)
        .filter(([, n]) => n > 6)
        .map(([key, n]) => ({element: key, message: `${n} items; the FAB menu has up to six.`})),
  },
  {
    id: 'fab-menu-item-label',
    component: 'FabMenuItem',
    severity: 'warning',
    rule: 'Every FabMenuItem has label text (a Text child) next to its icon.',
    source: {page: 'components/fab-menu', quote: 'FAB menu items should always have label text.'},
    check: (index) =>
      index
        .ofType('FabMenuItem')
        .filter(([key]) => !hasText(index, key))
        .map(([key]) => ({element: key, message: 'FAB menu item without label text.'})),
  },
  {
    id: 'one-extended-fab',
    component: 'Fab',
    severity: 'warning',
    rule: 'Use at most one extended Fab (a Fab with a label) per screen.',
    source: {
      page: 'components/extended-fab',
      quote: 'Like the regular FAB, only one extended FAB should be used per screen.',
    },
    check: (index) => {
      const extended = index.ofType('Fab').filter(([, el]) => {
        const label = (el.props as {label?: unknown}).label;
        return label !== undefined && label !== '';
      });
      return extended.length > 1
        ? extended.slice(1).map(([key]) => ({
            element: key,
            message: `${extended.length} extended FABs; use at most one per screen.`,
          }))
        : [];
    },
  },
];

/** The URL of a rule's spec page. */
export function ruleUrl(rule: M3Rule): string {
  return `https://m3.material.io/${rule.source.page}`;
}

/** Checks a spec against the M3 rules. */
export function checkM3(spec: Spec): M3Issue[] {
  const index = indexSpec(spec);
  return M3_RULES.flatMap((rule) =>
    rule.check(index).map(({element, message}) => ({
      rule: rule.id,
      severity: rule.severity,
      element,
      message,
      spec: ruleUrl(rule),
    })),
  );
}

/** The M3 rules as prompt rules, each with its spec page and quote. */
export function m3PromptRules(): string[] {
  return M3_RULES.map((r) => `${r.rule} (M3 ${r.source.page}: "${r.source.quote}")`);
}
