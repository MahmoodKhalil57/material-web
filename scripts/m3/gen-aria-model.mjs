#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Reads the saved WAI-ARIA 1.3 recommendation draft and writes the role and
 * state/property model that the central ARIA suite
 * (`foundations/accessibility/aria_test.ts`) checks components
 * against. The HTML is the source of truth; the output stays in the ignored
 * `.m3-specs/aria/` folder (W3C text is not committed).
 *
 *   node scripts/m3/gen-aria-model.mjs [--spot]
 *
 * `--spot` additionally prints a few roles for a hand check against the HTML.
 */

import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = join(root, '.m3-specs', 'Accessible Rich Internet Applications (WAI-ARIA) 1.3.html');
const OUT = join(root, '.m3-specs', 'aria', 'aria-1.3-model.json');

const html = readFileSync(SRC, 'utf8');

const text = (s) =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

/** The `<td class="cls">` content of a section, or ''. */
function cell(section, cls) {
  const m = section.match(new RegExp(`<td class="${cls}"[^>]*>([\\s\\S]*?)</td>`));
  return m ? m[1] : '';
}

/** `<li>` items of a cell: the first <code> name plus the rest of the text. */
function items(cellHtml) {
  const out = [];
  const lis = [...cellHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  const pieces = lis.length ? lis : cellHtml.trim() ? [cellHtml] : [];
  for (const li of pieces) {
    const name = ((li.match(/<code>([^<]+)<\/code>/) || [])[1] || '').replace(/\s*\(state\)\s*$/, '');
    if (!name) continue;
    const note = text(li.replace(/<code>[^<]+<\/code>/, ''));
    out.push({name, note});
  }
  return out;
}

const sectionRe = /<section class="(role|state|property)([^"]*)" id="([^"]+)">/g;
const marks = [...html.matchAll(sectionRe)];
const roles = {};
const attrs = {};

marks.forEach((m, i) => {
  const kind = m[1];
  const classes = m[2];
  const id = m[3];
  const end = i + 1 < marks.length ? marks[i + 1].index : html.indexOf('</main>', m.index);
  const sec = html.slice(m.index, end > m.index ? end : html.length);

  if (kind === 'role') {
    const inherited = items(cell(sec, 'role-inherited')).map((x) => ({
      name: x.name,
      deprecated: /deprecated/.test(x.note),
    }));
    const supported = items(cell(sec, 'role-properties')).map((x) => ({
      name: x.name,
      deprecated: /deprecated/.test(x.note),
    }));
    const allowedChildren = items(cell(sec, 'role-mustcontain'));
    const nameFrom = text(cell(sec, 'role-namefrom'))
      .split(/[,\s]+/)
      .filter(Boolean);
    const abstractCell = text(cell(sec, 'role-abstract'));
    roles[id] = {
      abstract: /true/i.test(abstractCell) || /\bAbstract\b/i.test(classes),
      superclass: items(cell(sec, 'role-parent')).map((x) => x.name),
      subclasses: items(cell(sec, 'role-children')).map((x) => x.name),
      // Roles an element of this role must be an accessibility child of
      // ("Required Accessibility Parent Roles", 5.2.7). Empty: no requirement.
      requiredContext: items(cell(sec, 'role-scope')).map((x) => ({role: x.name, note: x.note})),
      // "Allowed Accessibility Child Roles" (5.2.6): when non-empty, the
      // accessibility children MUST have one of these roles. `note` keeps a
      // condition such as "with a role of presentation".
      allowedChildren: allowedChildren.map((x) => ({role: x.name, note: x.note})),
      requiredProps: items(cell(sec, 'role-required-properties')).map((x) => x.name),
      supportedProps: supported,
      inheritedProps: inherited,
      prohibitedProps: items(cell(sec, 'role-disallowed')).map((x) => x.name),
      nameFrom: nameFrom.filter((x) => /^(author|contents|prohibited)$/.test(x)),
      nameRequired: /true/i.test(text(cell(sec, 'role-namerequired'))),
      childrenPresentational: /true/i.test(text(cell(sec, 'role-childpresentational'))),
      implicitValues: text(cell(sec, 'implicit-values')),
    };
    return;
  }

  // state or property
  const valueType = text(cell(sec, 'state-value') || cell(sec, 'property-value'));
  const appl = cell(sec, `${kind}-applicability`);
  const values = [];
  let def;
  for (const row of sec.matchAll(/<th class="value-name"[^>]*>([\s\S]*?)<\/th>/g)) {
    const raw = row[1];
    const isDefault = /class="default"/.test(raw) || /\(default\)/.test(text(raw));
    const name = text(raw).replace(/\s*\(default\)\s*$/, '');
    values.push(name);
    if (isDefault) def = name;
  }
  attrs[id] = {
    kind,
    deprecated: /\bdeprecated\b/.test(classes),
    valueType,
    values,
    default: def,
    usedInRoles: items(appl).map((x) => x.name),
    usedInAllElements: /All elements/i.test(text(appl)),
    inheritsInto: items(cell(sec, `${kind}-descendants`)).map((x) => x.name),
    deprecatedOnRoles: [],
    globalDeprecatedNote: undefined,
  };
});

// Derive per-attribute deprecation on roles from the role tables.
for (const [role, r] of Object.entries(roles)) {
  for (const p of [...r.supportedProps, ...r.inheritedProps]) {
    if (p.deprecated && attrs[p.name] && !attrs[p.name].deprecatedOnRoles.includes(role)) {
      attrs[p.name].deprecatedOnRoles.push(role);
    }
  }
}
for (const a of Object.values(attrs)) delete a.globalDeprecatedNote;

// Global attributes: those inherited by `roletype` (the root of the role tree).
const globals = Object.entries(attrs).filter(([, a]) => a.usedInAllElements).map(([n]) => n);
for (const p of [...(roles.roletype?.supportedProps ?? []), ...(roles.roletype?.inheritedProps ?? [])]) globals.push(p.name);

const model = {
  source: 'WAI-ARIA 1.3 (saved HTML)',
  roles,
  attrs,
  globals: [...new Set(globals)].sort(),
};

mkdirSync(dirname(OUT), {recursive: true});
writeFileSync(OUT, JSON.stringify(model, null, 1));

const roleList = Object.values(roles);
console.log(`roles: ${roleList.length} (${roleList.filter((r) => r.abstract).length} abstract)`);
console.log(
  `attributes: ${Object.keys(attrs).length} ` +
    `(${Object.values(attrs).filter((a) => a.kind === 'state').length} states, ` +
    `${Object.values(attrs).filter((a) => a.kind === 'property').length} properties, ` +
    `${Object.values(attrs).filter((a) => a.deprecated).length} deprecated: ` +
    `${Object.entries(attrs).filter(([, a]) => a.deprecated).map(([n]) => n).join(', ')})`,
);
console.log(
  `roles with required props: ${roleList.filter((r) => r.requiredProps.length).length}, ` +
    `required context: ${roleList.filter((r) => r.requiredContext.length).length}, ` +
    `allowed children: ${roleList.filter((r) => r.allowedChildren.length).length}, ` +
    `prohibited props: ${roleList.filter((r) => r.prohibitedProps.length).length}, ` +
    `name prohibited: ${roleList.filter((r) => r.nameFrom.includes('prohibited')).length}, ` +
    `name required: ${roleList.filter((r) => r.nameRequired).length}, ` +
    `children presentational: ${roleList.filter((r) => r.childrenPresentational).length}`,
);
console.log(`global attributes: ${model.globals.length}`);
console.log(`wrote ${OUT}`);

if (process.argv.includes('--spot')) {
  for (const name of [
    'listbox', 'option', 'tab', 'tablist', 'tabpanel', 'menu', 'menuitem', 'radio',
    'switch', 'slider', 'dialog', 'combobox', 'gridcell', 'toolbar',
  ]) {
    const r = roles[name];
    console.log(`\n== ${name}`);
    console.log(` abstract=${r.abstract} superclass=${r.superclass.join(',')}`);
    console.log(` requiredContext=${r.requiredContext.map((c) => c.role + (c.note ? ' [' + c.note + ']' : '')).join(' | ')}`);
    console.log(` allowedChildren=${r.allowedChildren.map((c) => c.role + (c.note ? ' [' + c.note + ']' : '')).join(' | ')}`);
    console.log(` requiredProps=${r.requiredProps.join(',')}`);
    console.log(` supported=${r.supportedProps.map((p) => p.name + (p.deprecated ? '(dep)' : '')).join(',')}`);
    console.log(` prohibited=${r.prohibitedProps.join(',')}`);
    console.log(` nameFrom=${r.nameFrom.join(',')} nameRequired=${r.nameRequired} childrenPresentational=${r.childrenPresentational}`);
  }
}
