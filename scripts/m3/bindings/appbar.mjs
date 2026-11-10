/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * App bars (`components/appbar`): small (default), medium flexible,
 * large flexible and the search app bar.
 *
 * The baseline medium and large app bars (`md.comp.app-bar.medium`,
 * `md.comp.app-bar.large`) are "no longer recommended" by the M3 Expressive
 * spec (app-bars.md, Variants) and are replaced by the flexible ones, so
 * they are not bound.
 *
 * Mixins (applied by app-bar.scss):
 * - `root` (`.app-bar`): common + small tokens. The search bar (`search-*`)
 *   and on-scroll (`on-scroll-*`) tokens stay prefixed in `root`; the
 *   search app bar is a small app bar holding a search bar (Compose
 *   `AppBarWithSearch`).
 * - `md-flexible` / `lg-flexible` (`.app-bar-md` / `.app-bar-lg`).
 * - `md-flexible-with-subtitle` / `lg-flexible-with-subtitle`: the taller
 *   container when a subtitle is shown.
 */

const AB = 'md.comp.app-bar';
const withSubtitle = {
  only: true,
  pick: {'with-subtitle.container.height': 'container-height'},
};

export default {
  generate: true,
  file: 'components/appbar/_app-bar-tokens.scss',
  // The with-subtitle heights apply through their own mixins.
  exclude: ['^with-subtitle-'],
  root: [{set: AB}, {set: `${AB}.small`}],
  mixins: [
    {name: 'md-flexible', set: `${AB}.medium-flexible`},
    {name: 'lg-flexible', set: `${AB}.large-flexible`},
    {name: 'md-flexible-with-subtitle', set: `${AB}.medium-flexible`, ...withSubtitle},
    {name: 'lg-flexible-with-subtitle', set: `${AB}.large-flexible`, ...withSubtitle},
  ],
};
