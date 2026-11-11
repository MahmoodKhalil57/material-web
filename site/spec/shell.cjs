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
 * `/railExpanded`, `/route` ('' | 'loading' | 'linear'), and the tools' and
 * search's. Actions (client/shell.ts): `cycleColorMode`, `toggleMotion`,
 * the tools' (tools.ts) and the search's (search.ts).
 */

// The sections and the Components groups (docs/<section>/README.md).
const {SECTIONS, COMPONENT_GROUPS: GROUPS} = require('../eleventy/site.cjs');

const REPO = 'https://github.com/MahmoodKhalil57/material-web';

/** Previous and next pages in the rail's order. */
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
  // Search (app-bars.md, Search app bar): the results are a repeat over
  // `/search/results`, which client/search.ts fills as the query changes:
  // the site's actions, then pages.
  add('search', {
    type: 'SearchBar',
    props: {placeholder: 'Search Material Web', ariaLabel: 'Search Material Web', value: {$bindState: '/search/query'}},
    repeat: {statePath: '/search/results', key: 'key'},
    children: [
      add('search-result', {
        type: 'ListItem',
        props: {},
        children: [add('search-result-title', {type: 'Text', props: {text: {$item: 'title'}}})],
        slots: {
          leading: [
            add('search-result-icon', {type: 'Icon', props: {}, children: [add('search-result-icon-name', {type: 'Text', props: {text: {$item: 'icon'}}})]}),
          ],
          'supporting-text': [add('search-result-snippet', {type: 'Text', props: {text: {$item: 'snippet'}}})],
        },
        on: {click: {action: 'openResult', params: {path: {$item: 'key'}}}},
      }),
    ],
    on: {input: {action: 'search'}, search: {action: 'openTopResult'}},
  });
  add('appbar', {
    type: 'AppBar',
    props: {variant: 'search', ariaLabel: 'Material Web 3.0'},
    // The headline; the site's home is the rail's first destination.
    children: [text('site-name', 'Material Web 3.0')],
    slots: {
      search: ['search'],
      // Up to four trailing actions (app-bars.md, Search app bar).
      trailing: [
        add('theme-open', {
          type: 'IconButton',
          props: {tooltip: true, ariaLabel: 'Customize theme'},
          children: [icon('theme-open-icon', 'palette')],
          on: {click: {action: 'openTool', params: {tool: 'theme'}}},
        }),
        add('download-open', {
          type: 'IconButton',
          props: {tooltip: true, ariaLabel: 'Download and copy'},
          children: [icon('download-open-icon', 'download')],
          on: {click: {action: 'openTool', params: {tool: 'download'}}},
        }),
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
    props: {id: 'gb-rail', collapsible: true, expanded: {$bindState: '/railExpanded'}, ariaLabel: 'Site'},
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
  // Route progress (client/navigation.ts sets `/route`), following the M3
  // progress indicator guidance ("Expected wait time"): the loading
  // indicator for a wait over 200ms, the linear indicator after 5s.
  article.push(
    add('route', {
      type: 'Html',
      props: {tag: 'div'},
      children: [
        add('route-loading', {type: 'LoadingIndicator', props: {contained: true, ariaLabel: 'Loading page'}, visible: {$state: '/route', eq: 'loading'}}),
        add('route-linear', {type: 'Progress', props: {ariaLabel: 'Loading page'}, visible: {$state: '/route', eq: 'linear'}}),
      ],
    }),
  );
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

  const overlays = tools({add, text, icon});
  slots.snackbar = ['snack'];

  add('root', {
    type: 'AppScaffold',
    props: {fullscreen: true, navigation: 'auto', autoExpandRail: true},
    children: ['main', ...overlays],
    slots,
  });

  return {
    root: 'root',
    elements,
    state: {
      colorMode: 'auto',
      reduceMotion: false,
      railExpanded: true,
      siteUrl: page.siteUrl ?? '',
      tool: '',
      theme: {seed: '#6750a4', seedInput: '#6750a4', variant: 'tonal-spot', contrast: 'standard'},
      feedback: {open: false, page: '', type: 'bug', message: '', error: false},
      install: {open: false},
      snack: {open: false, text: ''},
      search: {query: '', results: []},
      route: '',
    },
  };
}

const SEEDS = [
  ['#6750a4', 'Purple'],
  ['#0061a4', 'Blue'],
  ['#006a6a', 'Teal'],
  ['#386a20', 'Green'],
  ['#9c4300', 'Orange'],
  ['#b3261e', 'Red'],
  ['#8b4a62', 'Pink'],
];
const VARIANTS = [
  ['tonal-spot', 'Tonal spot'],
  ['neutral', 'Neutral'],
  ['vibrant', 'Vibrant'],
  ['expressive', 'Expressive'],
  ['fidelity', 'Fidelity'],
  ['content', 'Content'],
  ['monochrome', 'Monochrome'],
  ['rainbow', 'Rainbow'],
  ['fruit-salad', 'Fruit salad'],
];

/** `{$cond: {$state: path, eq: value}, $then: true, $else: false}` */
const is = (path, value) => ({$cond: {$state: path, eq: value}, $then: true, $else: false});

/**
 * The tools: the Download & copy and Customize theme side sheets, the Send
 * feedback and Install dialogs and the snackbar (client/tools.ts acts on
 * them). Returns the overlay keys for the scaffold's content.
 */
function tools({add, text, icon}) {
  const heading = (key, value) => add(key, {type: 'Html', props: {tag: 'h3', text: value}});
  /** A list action: icon, label, supporting text, and an action on click. */
  const action = (key, iconName, label, support, binding) =>
    add(key, {
      type: 'ListItem',
      props: {},
      children: [text(`${key}-label`, label)],
      slots: {leading: [icon(`${key}-icon`, iconName)], 'supporting-text': [text(`${key}-support`, support)]},
      on: {click: binding},
    });
  const list = (key, label, items) => add(key, {type: 'List', props: {ariaLabel: label}, children: items});
  const sheet = (key, tool, headline, children) =>
    add(key, {
      type: 'SideSheet',
      props: {modal: true, headline, open: is('/tool', tool)},
      children,
      on: {closed: {action: 'closeTool'}},
    });

  // Download & copy.
  const download = (key, iconName, label, support, href) =>
    action(key, iconName, label, support, {action: 'download', params: {href, name: href.split('/').pop()}});
  const copy = (key, iconName, label, support, id, done) => action(key, iconName, label, support, {action: 'copy', params: {id, done}});
  sheet('download-sheet', 'download', 'Download & copy', [
    add('download-body', {
      type: 'Prose',
      props: {},
      children: [
        heading('download-h', 'Download'),
        list('download-list', 'Download', [
          action('dl-install', 'install_desktop', 'Install app', 'Add Material Web 3.0 to your device', {action: 'install'}),
          download('dl-mhtml', 'web', 'Website (MHTML, single file)', 'All pages in one file, for offline reading', '/3.0/material-web-3.0.mhtml'),
          download('dl-llms', 'description', 'Docs for LLMs (llms-full.txt)', 'All pages as Markdown text', '/3.0/llms-full.txt'),
          download('dl-cem', 'data_object', 'API (custom-elements.json)', 'Every element, as a Custom Elements Manifest', '/3.0/custom-elements.json'),
        ]),
        heading('copy-h', 'Copy'),
        list('copy-list', 'Copy', [
          copy('cp-agent', 'smart_toy', 'Copy agent prompt', 'Tells an AI agent to install the md-gb skill', 'agent-prompt', 'Copied agent prompt'),
          copy('cp-cdn', 'code', 'Copy CDN script tag', '<script type="module" src="https://esm.run/…/all.js">', 'cdn', 'Copied CDN script tag'),
          copy('cp-github', 'link', 'Copy GitHub link', 'github.com/material-components/material-web', 'github', 'Copied GitHub link'),
          copy('cp-npm', 'terminal', 'Copy npm install', 'npm install @material/web', 'npm', 'Copied npm install command'),
          copy('cp-shadcn', 'deployed_code', 'Copy shadcn npx setup', 'npx shadcn@latest add …/md-theme.json', 'shadcn', 'Copied shadcn setup command'),
        ]),
        heading('more-h', 'More'),
        add('more-links', {
          type: 'Html',
          props: {tag: 'p'},
          children: [
            add('more-github', {type: 'Button', props: {color: 'text', href: REPO, target: '_blank'}, children: [icon('more-github-icon', 'code'), text('more-github-label', 'GitHub')]}),
            add('more-npm', {
              type: 'Button',
              props: {color: 'text', href: 'https://www.npmjs.com/package/@material/web', target: '_blank'},
              children: [icon('more-npm-icon', 'deployed_code'), text('more-npm-label', 'npm')],
            }),
            add('more-v25', {type: 'Button', props: {color: 'text', href: '/'}, children: [icon('more-v25-icon', 'history'), text('more-v25-label', 'v2.5.0')]}),
            add('more-feedback', {
              type: 'Button',
              props: {color: 'text'},
              children: [icon('more-feedback-icon', 'feedback'), text('more-feedback-label', 'Send feedback')],
              on: {click: {action: 'openFeedback'}},
            }),
          ],
        }),
      ],
    }),
  ]);

  // Customize theme.
  const segment = (key, path, value, label) =>
    add(key, {
      type: 'SegmentedButton',
      props: {label, value, noCheckmark: true, selected: is(path, value)},
      on: {click: {action: 'setState', params: {statePath: path, value}}},
    });
  sheet('theme-sheet', 'theme', 'Customize theme', [
    add('theme-body', {
      type: 'Prose',
      props: {},
      children: [
        add('theme-note', {type: 'Html', props: {tag: 'p', text: 'Changes apply to this site and its demos, and are remembered in this browser.'}}),
        heading('seed-h', 'Seed color'),
        add('seed-chips', {
          type: 'ChipSet',
          props: {selection: 'single', ariaLabel: 'Seed color'},
          children: SEEDS.map(([hex, name]) =>
            add(`seed-${name.toLowerCase()}`, {
              type: 'Chip',
              props: {type: 'filter', value: hex, selected: is('/theme/seed', hex)},
              children: [text(`seed-${name.toLowerCase()}-label`, name)],
              on: {click: {action: 'setSeed', params: {seed: hex}}},
            }),
          ),
        }),
        add('seed-field', {
          type: 'TextField',
          props: {label: 'Custom color (hex)', value: {$bindState: '/theme/seedInput'}, supportingText: 'Six hex digits, such as #6750a4'},
          on: {change: {action: 'applySeedInput'}},
        }),
        heading('variant-h', 'Scheme variant'),
        add('variant', {
          type: 'Select',
          props: {label: 'Scheme variant', value: {$bindState: '/theme/variant'}},
          children: VARIANTS.map(([value, label]) =>
            add(`variant-${value}`, {type: 'SelectOption', props: {value}, children: [text(`variant-${value}-label`, label)]}),
          ),
        }),
        heading('mode-h', 'Color mode'),
        add('mode', {
          type: 'SegmentedButtonSet',
          props: {required: true, ariaLabel: 'Color mode'},
          children: [
            segment('mode-auto', '/colorMode', 'auto', 'System'),
            segment('mode-light', '/colorMode', 'light', 'Light'),
            segment('mode-dark', '/colorMode', 'dark', 'Dark'),
          ],
        }),
        heading('contrast-h', 'Contrast'),
        add('contrast', {
          type: 'SegmentedButtonSet',
          props: {required: true, ariaLabel: 'Contrast'},
          children: [
            segment('contrast-standard', '/theme/contrast', 'standard', 'Standard'),
            segment('contrast-medium', '/theme/contrast', 'medium', 'Medium'),
            segment('contrast-high', '/theme/contrast', 'high', 'High'),
          ],
        }),
        add('theme-actions', {
          type: 'Html',
          props: {tag: 'p'},
          children: [add('theme-reset', {type: 'Button', props: {color: 'tonal'}, children: [text('theme-reset-label', 'Reset')], on: {click: {action: 'resetTheme'}}})],
        }),
      ],
    }),
  ]);

  // Send feedback: a prefilled GitHub issue (no backend).
  add('feedback', {
    type: 'Dialog',
    props: {open: {$bindState: '/feedback/open'}},
    children: [
      add('feedback-page', {type: 'TextField', props: {label: 'Page', value: {$bindState: '/feedback/page'}}}),
      add('feedback-type', {
        type: 'Select',
        props: {label: 'Type', value: {$bindState: '/feedback/type'}},
        children: [
          ['bug', 'Bug'],
          ['docs', 'Documentation'],
          ['idea', 'Idea'],
        ].map(([value, label]) => add(`feedback-type-${value}`, {type: 'SelectOption', props: {value}, children: [text(`feedback-type-${value}-label`, label)]})),
      }),
      add('feedback-message', {
        type: 'TextField',
        props: {
          label: 'Message',
          type: 'textarea',
          rows: 4,
          required: true,
          errorText: 'Add a message',
          error: {$state: '/feedback/error'},
          value: {$bindState: '/feedback/message'},
        },
      }),
      add('feedback-note', {
        type: 'Prose',
        props: {},
        children: [add('feedback-note-p', {type: 'Html', props: {tag: 'small', text: 'Opens a new GitHub issue for material-components/material-web in a new tab, with this filled in.'}})],
      }),
    ],
    slots: {
      headline: [text('feedback-headline', 'Send feedback')],
      actions: [
        add('feedback-cancel', {
          type: 'Button',
          props: {color: 'text'},
          children: [text('feedback-cancel-label', 'Cancel')],
          on: {click: {action: 'setState', params: {statePath: '/feedback/open', value: false}}},
        }),
        add('feedback-submit', {type: 'Button', props: {}, children: [text('feedback-submit-label', 'Open issue')], on: {click: {action: 'submitFeedback'}}}),
      ],
    },
  });

  // Install: the browser's own steps when it offered no prompt.
  const step = (key, browser, how) =>
    add(key, {
      type: 'Html',
      props: {tag: 'li'},
      children: [add(`${key}-b`, {type: 'Html', props: {tag: 'strong', text: `${browser}: `}}), text(`${key}-t`, how)],
    });
  add('install', {
    type: 'Dialog',
    props: {open: {$bindState: '/install/open'}},
    children: [
      add('install-body', {
        type: 'Prose',
        props: {},
        children: [
          add('install-p', {type: 'Html', props: {tag: 'p', text: 'Your browser did not offer to install the docs as an app. Install them from the browser instead:'}}),
          add('install-steps', {
            type: 'Html',
            props: {tag: 'ul'},
            children: [
              step('install-chromium', 'Chrome and Edge', 'open the browser menu and choose Install Material Web 3.0 (Chrome: Cast, save and share, Install page as app), or use the install icon in the address bar.'),
              step('install-safari', 'Safari on Mac', 'choose File, then Add to Dock.'),
              step('install-ios', 'Safari on iPhone and iPad', 'tap Share, then Add to Home Screen.'),
              step('install-firefox', 'Firefox', 'Firefox on Android has Install in its menu. Firefox on desktop cannot install web apps; bookmark this page instead.'),
            ],
          }),
        ],
      }),
    ],
    slots: {
      headline: [text('install-headline', 'Install Material Web 3.0')],
      actions: [
        add('install-close', {
          type: 'Button',
          props: {},
          children: [text('install-close-label', 'Close')],
          on: {click: {action: 'setState', params: {statePath: '/install/open', value: false}}},
        }),
      ],
    },
  });

  add('snack', {
    type: 'Snackbar',
    props: {labelText: {$state: '/snack/text'}, open: {$bindState: '/snack/open'}, timeoutMs: 4000},
  });

  return ['download-sheet', 'theme-sheet', 'feedback', 'install'];
}

module.exports = {shellSpec, SECTIONS, GROUPS, outlineOf, pager};
