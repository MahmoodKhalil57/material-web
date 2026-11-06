/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Loads the design system database exported by m3.material.io (downloaded by
 * `scripts/download-m3-specs.mjs`) and resolves tokens for a given context,
 * e.g. `{platform: 'web', audience: '3p', theme: 'light'}`.
 */

import {readdir, readFile} from 'node:fs/promises';
import {join} from 'node:path';

/** The context material-web ships: web, third-party, static fonts. */
export const WEB_CONTEXT = Object.freeze({
  platform: 'web',
  audience: '3p',
  font: 'static',
  theme: 'light',
});

export class SpecDb {
  /** @param {string} specsDir the `.m3-specs` folder */
  static async load(specsDir = '.m3-specs') {
    const db = new SpecDb();
    // Style modules (color, typography, ...) hold the md.sys/md.ref tokens;
    // token tables hold the md.comp tokens. Load modules first so system
    // token metadata comes from the system's own export.
    for (const dir of [join(specsDir, 'modules'), join(specsDir, 'tokens', 'raw')]) {
      let files = [];
      try {
        files = (await readdir(dir)).filter((f) => f.endsWith('.json')).sort();
      } catch {
        continue;
      }
      for (const file of files) {
        db.add(JSON.parse(await readFile(join(dir, file), 'utf8')).system);
      }
    }
    const manifest = JSON.parse(await readFile(join(specsDir, 'manifest.json'), 'utf8'));
    db.version = manifest.carbonVersion;
    return db;
  }

  constructor() {
    /** tokenName -> {token, set, contexts} */
    this.tokens = new Map();
    /** tokenSetName -> [tokenName] */
    this.sets = new Map();
    /** tag resource name -> {group, tag, specificity} */
    this.tags = new Map();
    /** group name -> {specificity, defaultTag} */
    this.groups = new Map();
    this.values = new Map();
    /** display group resource name -> {displayName, parentGroup} */
    this.displayGroups = new Map();
  }

  add(system) {
    if (!system) return;
    const groupByResource = new Map();
    for (const g of system.contextTagGroups ?? []) {
      groupByResource.set(g.name, g);
      if (!this.groups.has(g.contextTagGroupName)) {
        this.groups.set(g.contextTagGroupName, {specificity: g.specificity, defaultTag: g.defaultTag});
      }
    }
    for (const t of system.tags ?? []) {
      const g = groupByResource.get(t.name.split('/tags/')[0]);
      if (!g) continue;
      this.tags.set(t.name, {group: g.contextTagGroupName, tag: t.tagName, specificity: g.specificity});
    }
    // Resolve default tag resource names to tag names once tags are known.
    for (const group of this.groups.values()) {
      if (group.defaultTag?.includes('/')) {
        group.default = this.tags.get(group.defaultTag)?.tag;
      }
    }
    for (const v of system.values ?? []) this.values.set(v.name, v);
    for (const g of system.displayGroups ?? []) {
      if (!this.displayGroups.has(g.name)) this.displayGroups.set(g.name, g);
    }
    const setNames = new Map(
      (system.tokenSets ?? []).map((s) => [s.name, s.tokenSetName ?? s.displayName]),
    );
    const trees = system.contextualReferenceTrees ?? {};
    for (const token of system.tokens ?? []) {
      if (token.state && token.state !== 'ACTIVE') continue;
      if (this.tokens.has(token.tokenName)) continue;
      const set = setNames.get(token.name.split('/tokens/')[0]) ?? 'unknown';
      this.tokens.set(token.tokenName, {
        token,
        set,
        contexts: trees[token.name]?.contextualReferenceTree ?? [],
      });
      const list = this.sets.get(set) ?? [];
      list.push(token.tokenName);
      this.sets.set(set, list);
    }
  }

  /** Token names in a set, without deprecated tokens. */
  tokensInSet(setName) {
    return (this.sets.get(setName) ?? []).filter(
      (name) => !this.tokens.get(name).token.deprecationMessage,
    );
  }

  /** `Parent group / Group` display path of a token, if any. */
  displayPath(tokenName) {
    const parts = [];
    let group = this.displayGroups.get(this.tokens.get(tokenName)?.token.displayGroup);
    while (group) {
      parts.unshift(group.displayName);
      group = this.displayGroups.get(group.parentGroup);
    }
    return parts.join(' / ');
  }

  type(tokenName) {
    return this.tokens.get(tokenName)?.token.tokenValueType;
  }

  /**
   * Picks the most specific contextual value whose tags all match `ctx`.
   * Groups missing from `ctx` use the group's default tag.
   *
   * @return {{ref?: string, value?: object, resolved?: object} | undefined}
   */
  resolve(tokenName, ctx = WEB_CONTEXT) {
    const entry = this.tokens.get(tokenName);
    if (!entry) return undefined;
    let best;
    let bestScore = -1;
    for (const c of entry.contexts) {
      let score = 0;
      let matches = true;
      for (const tagRef of c.contextTags ?? []) {
        const tag = this.tags.get(tagRef);
        if (!tag) continue;
        const want = ctx[tag.group] ?? this.groups.get(tag.group)?.default;
        if (want !== tag.tag) {
          matches = false;
          break;
        }
        score += 2 ** tag.specificity;
      }
      if (matches && score > bestScore) {
        best = c;
        bestScore = score;
      }
    }
    if (!best) return undefined;
    const tree = best.referenceTree ?? {};
    const literal = this.values.get(tree.value?.name);
    // An alias's value record names the target token. Composite values
    // (typography, springs) list their parts as child nodes instead, so
    // child nodes only count as an alias when the value record is missing.
    const ref = literal ? literal.tokenName : tree.childNodes?.[0]?.tokenName;
    const resolved = best.resolvedValue?.undefined ? undefined : best.resolvedValue;
    return {
      ref: ref && ref !== tokenName ? ref : undefined,
      value: literal && !literal.tokenName ? literal : undefined,
      resolved,
    };
  }
}
