/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Shortcodes of docs/3.0/about/shadcn.md and the component pages:
 *
 * - `{% gbshadcn "button" %}`: the one-line command that installs the
 *   registry item of the labs/gb/components directories given (several
 *   directories give one command with several URLs).
 * - `{% gbshadcnmap %}`: the table of the shadcn -> M3 mapping of md-theme.
 * - `{% gbshadcnreverse %}`: the table of the M3 -> shadcn mapping of
 *   md-theme-m3.
 */

const names = require('../gb-shadcn.cjs');

const registry = () => names.registryBase();

function gbShadcn(eleventyConfig) {
  eleventyConfig.addShortcode('gbshadcn', function (...dirs) {
    const known = names.elementDirs();
    for (const dir of dirs) {
      if (!known.includes(dir)) {
        throw new Error(`gbshadcn "${dir}" (${this.page?.inputPath}): no md-gb elements in that directory`);
      }
    }
    const urls = dirs.map((dir) => `${registry()}/${names.itemName(dir)}.json`).join(' ');
    return `\n\n**Install with shadcn/ui:** \`npx shadcn@latest add ${urls}\` ([setup](/3.0/about/shadcn/))\n\n`;
  });

  eleventyConfig.addShortcode('gbshadcnmap', () => {
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

  eleventyConfig.addShortcode('gbshadcnreverse', () => {
    const rows = names.REVERSE_MAP.map(([shadcn, role]) => `| \`--${shadcn}\` | \`--md-sys-color-${role}\` |`);
    return ['', '| shadcn variable | M3 baseline role |', '| --- | --- |', ...rows, '', '`--radius` is `0.75rem`, the M3 medium corner.', ''].join('\n');
  });
}

module.exports = gbShadcn;
