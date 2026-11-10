/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * /3.0/skill/index.json: the files of the md-gb agent skill (skill,
 * copied to /3.0/skill/ by scripts/gb-site-assets.mjs), each with its path
 * inside the skill folder, its absolute URL and its size. An agent installs
 * the skill by downloading every listed file to its path (see "Copy agent
 * prompt" in the Download & copy sheet, and docs/about/ai-agents.md).
 */

const {readdirSync, readFileSync, statSync} = require('node:fs');
const {join} = require('node:path');
const {SITE, absolute} = require('../eleventy-helpers/gb-site.cjs');

const SKILL = join(__dirname, '..', '..', 'material-design-expressive', 'skill');

function walk(dir, prefix = '') {
  const out = [];
  for (const entry of readdirSync(dir, {withFileTypes: true}).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isDirectory()) out.push(...walk(join(dir, entry.name), `${prefix}${entry.name}/`));
    else if (entry.name.endsWith('.md')) out.push(`${prefix}${entry.name}`);
  }
  return out;
}

class GbSkillIndex {
  data() {
    return {permalink: '/3.0/skill/index.json', eleventyExcludeFromCollections: true};
  }

  render() {
    const description = /^description:\s*(.*)$/m.exec(readFileSync(join(SKILL, 'SKILL.md'), 'utf8'))?.[1]?.trim() ?? '';
    // SKILL.md first, then reference/*.md.
    const paths = walk(SKILL).sort((a, b) => (a === 'SKILL.md' ? -1 : b === 'SKILL.md' ? 1 : a.localeCompare(b)));
    return (
      JSON.stringify(
        {
          name: 'md-gb',
          description,
          site: SITE.url,
          install: 'Save each file to <skills folder>/md-gb/<path>, for example ~/.claude/skills/md-gb/SKILL.md.',
          files: paths.map((path) => ({
            path,
            url: absolute(`/3.0/skill/${path}`),
            bytes: statSync(join(SKILL, path)).size,
          })),
        },
        null,
        2,
      ) + '\n'
    );
  }
}

module.exports = GbSkillIndex;
