/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Shortcodes of docs/about/shadcn.md and the component pages:
 *
 * - `{% shadcn "button" %}`: the one-line command that installs the
 *   registry item of the components directories given (several
 *   directories give one command with several URLs).
 * - `{% shadcnmap %}`: the table of the shadcn -> M3 mapping of md-theme.
 * - `{% shadcnreverse %}`: the table of the M3 -> shadcn mapping of
 *   md-theme-m3.
 */

const names = require('./shadcn.cjs');

const registry = () => names.registryBase();

function shadcnShortcodes(eleventyConfig) {
  eleventyConfig.addShortcode('shadcn', function (...dirs) {
    const known = names.elementDirs();
    for (const dir of dirs) {
      if (!known.includes(dir)) {
        throw new Error(`shadcn "${dir}" (${this.page?.inputPath}): no md-gb elements in that directory`);
      }
    }
    const urls = dirs.map((dir) => `${registry()}/${names.itemName(dir)}.json`).join(' ');
    return `\n\n**Install with shadcn/ui:** \`npx shadcn@latest add ${urls}\` ([setup](/3.0/about/shadcn/))\n\n`;
  });

  eleventyConfig.addShortcode('shadcnmap', () => {
    const rows = names.ROLE_MAP.map(([role, expr, note]) => `| \`--md-sys-color-${role}\` | \`${expr}\` | ${note} |`);
    const shape = names.SHAPE_MAP.map(([size, factor]) => `| \`--md-sys-shape-corner-${size}\` | \`calc(var(--radius) * ${factor})\` |`);
    return [
      '',
      '| M3 role | shadcn value | Why |',
      '| --- | --- | --- |',
      ...rows,
      '',
      'Corners follow `--radius` (the px values are the M3 ones at shadcn\'s default `0.625rem`). `--md-sys-shape-corner-value-*` get the same values.',
      '',
      '| M3 corner | shadcn value |',
      '| --- | --- |',
      ...shape,
      '',
    ].join('\n');
  });

  eleventyConfig.addShortcode('shadcnreverse', () => {
    const rows = names.REVERSE_MAP.map(([shadcn, role]) => `| \`--${shadcn}\` | \`--md-sys-color-${role}\` |`);
    return ['', '| shadcn variable | M3 baseline role |', '| --- | --- |', ...rows, '', '`--radius` is `0.75rem`, the M3 medium corner.', ''].join('\n');
  });
}

module.exports = shadcnShortcodes;
