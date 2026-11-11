/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Checks a json-render spec of the library's catalog before it
 * renders: its structure (json-render's `validateSpec`), its props against
 * the catalog's types (generated from custom-elements.json), its slots and
 * events against the elements' API, and the M3 rules (./m3-rules.js). A
 * spec a model generated can be checked, and the issues sent back to it.
 */

import {validateSpec, type Spec} from '@json-render/core';

import {catalog, COMPONENTS} from './catalog.js';
import {checkM3, m3PromptRules} from './m3-rules.js';

/** A problem with a spec. */
export interface SpecCheckIssue {
  /** `structure`, `props`, `slots`, `events` or `m3`. */
  kind: 'structure' | 'props' | 'slots' | 'events' | 'm3';
  severity: 'error' | 'warning';
  /** The element's key, when the issue is about one. */
  element?: string;
  message: string;
  /** For M3 issues: the rule's id and spec page. */
  rule?: string;
  spec?: string;
}

/** The result of `checkSpec()`. */
export interface SpecCheck {
  /** Whether there are no errors (warnings are allowed). */
  valid: boolean;
  issues: SpecCheckIssue[];
}

type Component = (typeof COMPONENTS)[keyof typeof COMPONENTS];
const components = COMPONENTS as Record<string, Component>;

/** Checks a spec against the catalog, the elements' API and the M3 rules. */
export function checkSpec(spec: Spec): SpecCheck {
  const issues: SpecCheckIssue[] = [];

  for (const issue of validateSpec(spec).issues) {
    issues.push({kind: 'structure', severity: issue.severity, element: issue.elementKey, message: issue.message});
  }

  // The catalog checks the spec's shape and component names. It does not
  // check props when the catalog has more than one component (json-render
  // 0.21 validates them as a record of unknowns), so each element's props are
  // checked against its own component below.
  const result = catalog.validate(spec);
  if (!result.success) {
    for (const issue of result.error?.issues ?? []) {
      const path = issue.path.map(String);
      const element = path[0] === 'elements' ? path[1] : undefined;
      issues.push({kind: 'props', severity: 'error', element, message: `${path.join('.')}: ${issue.message}`});
    }
  }

  for (const [key, el] of Object.entries(spec.elements ?? {})) {
    const component = components[el.type];
    if (!component) continue; // The catalog check reports unknown types.
    const props = component.props.safeParse(el.props ?? {});
    if (!props.success) {
      for (const issue of props.error.issues) {
        const path = ['elements', key, 'props', ...issue.path.map(String)].join('.');
        issues.push({kind: 'props', severity: 'error', element: key, message: `${path}: ${issue.message}`});
      }
    }
    const slots = new Set(component.slots);
    if ((el.children?.length ?? 0) > 0 && !slots.has('default')) {
      issues.push({kind: 'slots', severity: 'error', element: key, message: `${el.type} takes no children.`});
    }
    for (const name of Object.keys(el.slots ?? {})) {
      if (!slots.has(name)) {
        issues.push({
          kind: 'slots',
          severity: 'error',
          element: key,
          message: `${el.type} has no slot "${name}" (slots: ${component.slots.join(', ') || 'none'}).`,
        });
      }
    }
    const events = new Set([...component.events, 'click', 'press']);
    for (const name of Object.keys(el.on ?? {})) {
      if (!events.has(name)) {
        issues.push({
          kind: 'events',
          severity: 'warning',
          element: key,
          message: `${el.type} does not fire "${name}" (events: ${[...events].join(', ')}).`,
        });
      }
    }
    if (component.deprecated) {
      // The M3 rules give the replacement; this covers any deprecated component.
      issues.push({kind: 'm3', severity: 'warning', element: key, message: `${el.type} is deprecated in M3 Expressive.`});
    }
  }

  for (const issue of checkM3(spec)) {
    issues.push({kind: 'm3', severity: issue.severity, element: issue.element, message: issue.message, rule: issue.rule, spec: issue.spec});
  }

  return {valid: !issues.some((i) => i.severity === 'error'), issues};
}

/**
 * The system prompt for generating specs of the catalog: json-render's
 * prompt for the catalog, with the M3 rules (each with its spec quote).
 */
export function m3Prompt(customRules: string[] = []): string {
  return catalog.prompt({customRules: [...m3PromptRules(), ...customRules]});
}
