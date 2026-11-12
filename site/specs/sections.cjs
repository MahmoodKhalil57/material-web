/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The content spec of a section's index page (/3.0/<section>/): a hero (the
 * section's name, intro and page count, with M3 Expressive shapes that
 * morph in turn) and a grid of cards, one per page: a shape with the page's
 * icon, its title (the link) and its description. Components are grouped
 * like m3.material.io/components (the `category` of docs/components pages).
 *
 * Built from the library's catalog only: Stack, Grid, Card, Shape, Icon,
 * Typography and Html.
 */

const {COMPONENT_GROUPS, sectionPages} = require('../eleventy/site.cjs');
const {specBuilder} = require('./builder.cjs');

// The cards' shapes, each morphing into the next card's on hover and focus,
// and the container roles they cycle through.
const SHAPES = ['cookie9Sided', 'clover4Leaf', 'sunny', 'flower', 'puffy', 'cookie6Sided', 'softBurst', 'pill', 'pentagon', 'cookie12Sided', 'gem', 'burst'];
const COLORS = ['primary-container', 'secondary-container', 'tertiary-container'];

/** The Material Symbols of the components (their pages have no `icon`). */
const COMPONENT_ICONS = {
  'app-bar': 'web_asset', badge: 'counter_1', 'button-group': 'view_column', button: 'smart_button',
  card: 'article', carousel: 'view_carousel', checkbox: 'check_box', chip: 'label',
  'date-picker': 'calendar_month', dialog: 'chat_bubble', divider: 'horizontal_rule',
  'fab-menu': 'menu_open', fab: 'edit', 'icon-button': 'favorite', list: 'list',
  'loading-indicator': 'progress_activity', menu: 'more_vert', 'navigation-bar': 'bottom_navigation',
  'navigation-drawer': 'left_panel_open', 'navigation-rail': 'side_navigation', progress: 'linear_scale',
  'pull-to-refresh': 'refresh', radio: 'radio_button_checked', search: 'search',
  'segmented-button': 'splitscreen', select: 'arrow_drop_down_circle', sheets: 'view_agenda',
  slider: 'tune', snackbar: 'info', 'split-button': 'splitscreen_right', switch: 'toggle_on', tabs: 'tab',
  'text-field': 'text_fields', 'time-picker': 'schedule', toolbar: 'build', tooltip: 'chat_bubble',
};

/** Pages the docs advise against, with the chip their card shows. */
const ADVISORIES = {'segmented-button': 'Not recommended'};

/** The hero's shapes: [shape, morphs into, color, size]. */
const HERO_SHAPES = [
  ['cookie9Sided', 'flower', 'primary-container', 96],
  ['clover4Leaf', 'clover8Leaf', 'tertiary-container', 72],
  ['sunny', 'softBurst', 'secondary-container', 72],
  ['pill', 'oval', 'primary-container', 96],
];

/**
 * @param {{id: string, label: string, intro: string}} section
 * @return {{root: string, elements: object}}
 */
function sectionSpec(section) {
  const b = specBuilder(`section-${section.id}`);
  const pages = sectionPages(section.id);

  const hero = b.el('Stack', {direction: 'row', wrap: true, alignItems: 'center', justifyContent: 'space-between', gap: '600'}, [
    b.el('Stack', {gap: '200'}, [
      b.el('Typography', {scale: 'label-lg', color: 'primary'}, ['Material Web 3.0']),
      b.el('Typography', {scale: 'display-sm'}, [b.html('h1', {}, [section.label])]),
      b.el('Typography', {scale: 'title-lg', color: 'on-surface-variant'}, [b.html('p', {}, [section.intro])]),
      b.el('Typography', {scale: 'body-md', color: 'on-surface-variant'}, [
        b.html('p', {}, [`${pages.length} pages · `, b.html('a', {href: `/3.0/${section.id}.md`}, ['View as Markdown'])]),
      ]),
    ]),
    b.el(
      'Stack',
      {direction: 'row', gap: '200', alignItems: 'center'},
      HERO_SHAPES.map(([shape, to, color, size], delay) => b.el('Shape', {shape, to, loop: true, delay, color, size})),
    ),
  ]);

  let index = 0;
  const card = (page, level) => {
    const i = index++;
    const icon = section.id === 'components' ? COMPONENT_ICONS[page.slug] ?? 'widgets' : page.icon || 'article';
    const advisory = ADVISORIES[page.slug];
    return b.el('Card', {color: 'filled', href: page.url}, [
      b.el('Stack', {gap: '150', paddingBlock: '200'}, [
        b.el(
          'Shape',
          {shape: SHAPES[i % SHAPES.length], to: SHAPES[(i + 1) % SHAPES.length], morphOnHover: true, color: COLORS[i % COLORS.length], size: 72},
          [b.el('Icon', {}, [icon])],
        ),
        // The card's title: in the page outline, with an id of its own.
        b.el('Typography', {scale: 'title-md'}, [b.html(`h${level}`, {id: `card-${page.slug}`}, [page.title])]),
        advisory ? b.el('Typography', {scale: 'label-md', color: 'error'}, [advisory]) : null,
        b.el('Typography', {scale: 'body-md', color: 'on-surface-variant'}, [b.html('p', {}, [page.summary || page.description])]),
      ]),
    ]);
  };

  const body =
    section.id === 'components'
      ? COMPONENT_GROUPS.map((group) => {
          const items = pages.filter((p) => (p.category ?? 'other') === group.id);
          if (!items.length) return null;
          return b.el('Stack', {gap: '300'}, [
            b.el('Typography', {scale: 'headline-sm'}, [b.html('h2', {id: `group-${group.id}`}, [group.label])]),
            b.el('Grid', {span: 4}, items.map((p) => card(p, 3))),
          ]);
        })
      : // No groups: the cards' titles are the page's h2.
        [b.el('Grid', {span: 4}, pages.map((p) => card(p, 2)))];

  return b.spec(b.el('Stack', {gap: '800'}, [hero, ...body]));
}

module.exports = {sectionSpec};
