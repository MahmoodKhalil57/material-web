/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The shell of a /3.0/ page as a json-render spec of the library's catalog
 * (material-design-expressive/json-render): the site's whole UI is the
 * library's components, laid out by md-gb-app-scaffold, with no markup or
 * styles of its own.
 *
 * - The app's root: an app scaffold (fullscreen) that shows a navigation
 *   rail from medium windows and a navigation bar below (scaffold.md,
 *   breakpoints.md), expanding the rail on large windows.
 * - Top app bar: the site name, and actions for the color mode and reduced
 *   motion, and a link to the repository.
 * - Navigation rail: the sections, and the current section's pages as the
 *   expanded rail's secondary items (the components by group). Navigation
 *   bar: the sections.
 * - Content: in md-gb-prose, the title, the description, previous / next
 *   links, and the page's content (an element with id `gb-content` that the
 *   page's HTML fills until pages are specs too).
 * - Companion rail (large windows): the page outline.
 *
 * State: `/colorMode` ('auto' | 'light' | 'dark'), `/reduceMotion`,
 * `/railExpanded`. Actions (src/spec/shell.ts): `cycleColorMode`.
 */

const SECTIONS = [
  {id: 'about', label: 'About', icon: 'info'},
  {id: 'foundations', label: 'Foundations', icon: 'foundation'},
  {id: 'styles', label: 'Styles', icon: 'palette'},
  {id: 'components', label: 'Components', icon: 'widgets'},
];

const GROUPS = [
  {id: 'buttons', label: 'Buttons'},
  {id: 'pickers', label: 'Date & time pickers'},
  {id: 'progress', label: 'Loading & progress'},
  {id: 'navigation', label: 'Navigation'},
  {id: 'sheets', label: 'Sheets'},
  {id: 'other', label: 'All other components'},
];

const REPO = 'https://github.com/MahmoodKhalil57/material-web';

/** Previous and next pages in the rail's order (as gb-pager.cjs). */
function pager(pages, url) {
  const sequence = [{url: '/3.0/', title: 'Home'}];
  for (const section of SECTIONS) {
    sequence.push({url: `/3.0/${section.id}/`, title: `${section.label} overview`});
    for (const page of pagesOf(pages, section.id)) sequence.push({url: page.url, title: page.title});
  }
  const index = sequence.findIndex((entry) => entry.url === url);
  return index < 0 ? {} : {prev: sequence[index - 1], next: sequence[index + 1]};
}

/** A section's pages in rail order (components by group, then order). */
function pagesOf(pages, section) {
  const inSection = pages.filter((p) => p.section === section);
  const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title);
  if (section !== 'components') return inSection.sort(byOrder);
  return GROUPS.flatMap((g) => inSection.filter((p) => (p.category ?? 'other') === g.id).sort(byOrder));
}

/** The h2 and h3 of the content, as [{level, id, text}]. */
function outlineOf(html) {
  const out = [];
  for (const m of String(html).matchAll(/<h([23])\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)) {
    const text = m[3].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
    if (text) out.push({level: Number(m[1]), id: m[2], text});
  }
  return out;
}

/**
 * The shell spec of a page.
 *
 * @param {object} page `{url, title, description, section}` of the page.
 * @param {Array<{url, title, section, category, order}>} pages Every page.
 * @param {string} content The page's content HTML (for its outline).
 */
function shellSpec(page, pages, content) {
  const elements = {};
  const add = (key, el) => {
    if (elements[key]) throw new Error(`gb-shell-spec: duplicate key ${key}`);
    elements[key] = {children: [], ...el};
    return key;
  };
  const text = (key, value) => add(key, {type: 'Text', props: {text: value}});
  const icon = (key, name) => {
    text(`${key}-name`, name);
    return add(key, {type: 'Icon', props: {}, children: [`${key}-name`]});
  };
  const current = page.section || 'about';
  const url = page.url;

  // Top app bar.
  add('appbar', {
    type: 'AppBar',
    props: {variant: 'standard', ariaLabel: 'Material Web 3.0'},
    // The headline; the site's home is the rail's first destination.
    children: [text('site-name', 'Material Web 3.0')],
    slots: {
      trailing: [
        add('color-mode', {
          type: 'IconButton',
          props: {
            tooltip: true,
            ariaLabel: {$template: 'Color mode: ${/colorMode}. Change it'},
          },
          children: [
            add('color-mode-icon', {
              type: 'Icon',
              props: {},
              children: [
                add('color-mode-icon-name', {
                  type: 'Text',
                  props: {
                    text: {
                      $cond: {$state: '/colorMode', eq: 'dark'},
                      $then: 'dark_mode',
                      $else: {$cond: {$state: '/colorMode', eq: 'light'}, $then: 'light_mode', $else: 'brightness_auto'},
                    },
                  },
                }),
              ],
            }),
          ],
          on: {click: {action: 'cycleColorMode'}},
        }),
        add('motion', {
          type: 'IconButton',
          props: {type: 'toggle', tooltip: true, ariaLabel: 'Reduce motion', selected: {$bindState: '/reduceMotion'}},
          children: [icon('motion-icon', 'motion_photos_off')],
        }),
        add('repo', {
          type: 'IconButton',
          props: {href: REPO, target: '_blank', tooltip: true, ariaLabel: 'Source on GitHub'},
          children: [icon('repo-icon', 'code')],
        }),
      ],
    },
  });

  // Navigation rail: the sections, then the current section's pages.
  const railItems = [];
  for (const section of SECTIONS) {
    railItems.push(
      add(`rail-${section.id}`, {
        type: 'NavRailItem',
        props: {href: `/3.0/${section.id}/`, selected: section.id === current},
        children: [text(`rail-${section.id}-label`, section.label)],
        slots: {icon: [icon(`rail-${section.id}-icon`, section.icon)]},
      }),
    );
  }
  for (const [i, p] of pagesOf(pages, current).entries()) {
    railItems.push(
      add(`rail-page-${i}`, {
        type: 'NavRailItem',
        props: {href: p.url, secondary: true, selected: p.url === url},
        children: [text(`rail-page-${i}-label`, p.title)],
      }),
    );
  }
  add('rail', {
    type: 'NavRail',
    props: {collapsible: true, expanded: {$bindState: '/railExpanded'}, ariaLabel: 'Site'},
    children: railItems,
  });

  // Navigation bar (compact windows): the sections.
  add('bar', {
    type: 'NavBar',
    props: {ariaLabel: 'Site'},
    children: SECTIONS.map((section) =>
      add(`bar-${section.id}`, {
        type: 'NavBarItem',
        props: {href: `/3.0/${section.id}/`, selected: section.id === current},
        children: [text(`bar-${section.id}-label`, section.label)],
        slots: {icon: [icon(`bar-${section.id}-icon`, section.icon)]},
      }),
    ),
  });

  // Content: title, description, the page's HTML, previous / next.
  const {prev, next} = pager(pages, url);
  const pagerLink = (key, entry, rel) =>
    add(key, {
      type: 'Button',
      props: {color: 'text', href: entry.url, rel},
      children: rel === 'prev'
        ? [icon(`${key}-icon`, 'arrow_back'), text(`${key}-label`, `Previous: ${entry.title}`)]
        : [text(`${key}-label`, `Next: ${entry.title}`), icon(`${key}-icon`, 'arrow_forward')],
    });
  const pagerNav = add('pager', {
    type: 'Html',
    props: {tag: 'nav', ariaLabel: 'Previous and next pages'},
    children: [...(prev ? [pagerLink('pager-prev', prev, 'prev')] : []), ...(next ? [pagerLink('pager-next', next, 'next')] : [])],
  });
  const article = [];
  if (page.title) article.push(add('title', {type: 'Html', props: {tag: 'h1', text: page.title}}));
  if (page.description) article.push(add('lede', {type: 'Html', props: {tag: 'p', text: page.description}}));
  article.push(add('content', {type: 'Html', props: {tag: 'div', id: 'gb-content'}}));
  article.push(pagerNav);
  add('main', {
    type: 'Html',
    props: {tag: 'main', id: 'main'},
    children: [add('article', {type: 'Prose', props: {}, children: article})],
  });

  // Outline (large windows): the content's h2 and h3.
  const outline = outlineOf(content);
  const slots = {'top-app-bar': ['appbar'], 'navigation-rail': ['rail'], 'navigation-bar': ['bar']};
  if (outline.length) {
    // h2 entries, each with its h3 entries in a nested list.
    const items = [];
    let parent;
    for (const [i, h] of outline.entries()) {
      const link = add(`outline-${i}-link`, {type: 'Html', props: {tag: 'a', href: `#${h.id}`, text: h.text}});
      const item = add(`outline-${i}`, {type: 'Html', props: {tag: 'li'}, children: [link]});
      if (h.level === 3 && parent) {
        const sub = `${parent}-sub`;
        if (!elements[sub]) {
          add(sub, {type: 'Html', props: {tag: 'ul'}});
          elements[parent].children.push(sub);
        }
        elements[sub].children.push(item);
      } else {
        items.push(item);
        parent = item;
      }
    }
    add('outline', {
      type: 'Html',
      props: {tag: 'nav', ariaLabel: 'On this page'},
      children: [
        add('outline-prose', {
          type: 'Prose',
          props: {},
          children: [add('outline-title', {type: 'Html', props: {tag: 'p', text: 'On this page'}}), add('outline-list', {type: 'Html', props: {tag: 'ul'}, children: items})],
        }),
      ],
    });
    slots['companion-rail'] = ['outline'];
  }

  add('root', {
    type: 'AppScaffold',
    props: {fullscreen: true, navigation: 'auto', autoExpandRail: true},
    children: ['main'],
    slots,
  });

  return {
    root: 'root',
    elements,
    state: {colorMode: 'auto', reduceMotion: false, railExpanded: true},
  };
}

module.exports = {shellSpec, SECTIONS, GROUPS, outlineOf, pager};
