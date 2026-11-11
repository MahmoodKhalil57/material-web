/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../components/appbar/md-gb-app-bar.js';
import '../../components/buttongroup/md-gb-button-group.js';
import '../../components/carousel/md-gb-carousel.js';
import '../../components/carousel/md-gb-carousel-item.js';
import '../../components/datepicker/md-gb-date-picker.js';
import '../../components/dialog/md-gb-dialog.js';
import '../../components/fabmenu/md-gb-fab-menu.js';
import '../../components/fabmenu/md-gb-fab-menu-item.js';
import '../../components/sheet/md-gb-bottom-sheet.js';
import '../../components/sheet/md-gb-side-sheet.js';
import '../../components/splitbutton/md-gb-split-button.js';
import '../../components/timepicker/md-gb-time-picker.js';
import '../../components/search/md-gb-search-bar.js';
import '../../components/toolbar/md-gb-toolbar.js';
import '../../components/tooltip/md-gb-tooltip.js';
import {deepElements, loadSubject, settle} from '../../testing/subjects.js';

// Central suite: the resting elevation of every component in the spec's
// component table (styles/elevation). A resting part is on md.sys.elevation.level
// 0 to 3 (levels 4 and 5 are for interaction states, tested elsewhere). Each
// level's shadow is that level's token, `--md-sys-elevation-shadow-N`
// (styles/elevation). Level 0 has no shadow. Each row renders the
// component at rest and checks the elevation shadows its parts paint: level 0
// paints none, level N paints exactly the level N shadow. Shadows that are not
// an elevation level (such as a tonal extension) are not elevation and are
// ignored. Rows where the table
// disagrees with the component page or token are in `RESOLVED`.

interface Row {
  id: string;
  level: number;
  html: string;
  /** The parts whose shadows the row checks; default: the whole rendered row. */
  pick?: (container: HTMLElement) => Element[];
  /** Opens or otherwise readies the rendered container. */
  prepare?: (container: HTMLElement) => Promise<void> | void;
}

/** The shadow the level token gives (`none` at level 0), as computed. */
function shadowFor(level: number): string {
  const el = document.createElement('div');
  el.style.boxShadow = level === 0 ? 'none' : `var(--md-sys-elevation-shadow-${level})`;
  document.body.append(el);
  const value = getComputedStyle(el).boxShadow;
  el.remove();
  return value;
}

/** The elevation levels 1 to 5 as computed shadows, by level. */
const LEVEL_SHADOWS = [1, 2, 3, 4, 5].map((level) => [level, shadowFor(level)] as const);

/** Renders a row's markup in a fresh container, at rest. */
async function render(row: Row) {
  // The rows cover nearly every component: load them all.
  await loadSubject();
  const container = document.createElement('div');
  container.style.cssText = 'padding:64px;display:block;position:relative';
  container.innerHTML = row.html;
  document.body.append(container);
  await row.prepare?.(container);
  await settle(container);
  // Finish any entrance animation, so the resting shadow is the one shown.
  for (const e of deepElements(container)) e.getAnimations().forEach((a) => a.finish());
  await settle(container);
  return {container, cleanup: () => container.remove()};
}

/**
 * The elevation levels whose shadow the parts paint. A part's box-shadow may
 * hold more layers than the level (a tonal extension), so a level is painted
 * when its layers appear in the computed shadow.
 */
function paintedLevels(parts: Element[]): number[] {
  const painted: string[] = [];
  for (const part of parts) {
    for (const e of deepElements(part)) {
      const shadow = getComputedStyle(e).boxShadow;
      if (shadow !== 'none') painted.push(shadow);
    }
  }
  return LEVEL_SHADOWS.filter(([, shadow]) => painted.some((p) => p.includes(shadow))).map(
    ([level]) => level,
  );
}

const DEFAULT_PICK = (container: HTMLElement) => [container];

const LEVEL_0: Row[] = [
  {id: 'button-filled', level: 0, html: `<md-gb-button color="filled">Label</md-gb-button>`},
  {id: 'button-tonal', level: 0, html: `<md-gb-button color="tonal">Label</md-gb-button>`},
  {id: 'button-outlined', level: 0, html: `<md-gb-button color="outlined">Label</md-gb-button>`},
  {id: 'button-group', level: 0, html: `<md-gb-button-group aria-label="Group"><md-gb-button>One</md-gb-button><md-gb-button>Two</md-gb-button></md-gb-button-group>`},
  {id: 'split-button', level: 0, html: `<md-gb-split-button><button slot="leading">Label</button><button slot="trailing" aria-label="More">v</button></md-gb-split-button>`},
  {id: 'icon-button-standard', level: 0, html: `<md-gb-icon-button color="standard" aria-label="Favorite"><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button>`},
  {id: 'icon-button-filled', level: 0, html: `<md-gb-icon-button color="filled" aria-label="Favorite"><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button>`},
  {id: 'icon-button-tonal', level: 0, html: `<md-gb-icon-button color="tonal" aria-label="Favorite"><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button>`},
  {id: 'icon-button-outlined', level: 0, html: `<md-gb-icon-button color="outlined" aria-label="Favorite"><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button>`},
  {id: 'chip-assist', level: 0, html: `<md-gb-chip-set><md-gb-chip type="assist">Label</md-gb-chip></md-gb-chip-set>`},
  {id: 'chip-filter', level: 0, html: `<md-gb-chip-set><md-gb-chip type="filter">Label</md-gb-chip></md-gb-chip-set>`},
  {id: 'segmented-button', level: 0, html: `<md-gb-segmented-button-set aria-label="Sort"><md-gb-segmented-button value="a">Day</md-gb-segmented-button><md-gb-segmented-button value="b">Week</md-gb-segmented-button></md-gb-segmented-button-set>`},
  {id: 'card-filled', level: 0, html: `<md-gb-card color="filled" style="width:200px;height:120px">Content</md-gb-card>`},
  {id: 'card-outlined', level: 0, html: `<md-gb-card color="outlined" style="width:200px;height:120px">Content</md-gb-card>`},
  {id: 'carousel', level: 0, html: `<md-gb-carousel aria-label="Carousel"><md-gb-carousel-item>One</md-gb-carousel-item><md-gb-carousel-item>Two</md-gb-carousel-item></md-gb-carousel>`},
  {id: 'list', level: 0, html: `<md-gb-list aria-label="Items"><md-gb-list-item>One</md-gb-list-item><md-gb-list-item>Two</md-gb-list-item></md-gb-list>`},
  {id: 'nav-rail', level: 0, html: `<md-gb-nav-rail><md-gb-nav-rail-item><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-rail-item><md-gb-nav-rail-item><md-gb-icon slot="icon">mail</md-gb-icon>Mail</md-gb-nav-rail-item></md-gb-nav-rail>`},
  {
    id: 'nav-rail-fab',
    level: 0,
    html: `<md-gb-nav-rail><md-gb-fab slot="header" aria-label="Create"><md-gb-icon>add</md-gb-icon></md-gb-fab><md-gb-nav-rail-item><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-rail-item></md-gb-nav-rail>`,
    pick: (c) => [c.querySelector('md-gb-fab')!],
  },
  {
    id: 'nav-rail-extended-fab',
    level: 0,
    html: `<md-gb-nav-rail><md-gb-fab slot="header" label="Create"><md-gb-icon>add</md-gb-icon></md-gb-fab><md-gb-nav-rail-item><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-rail-item></md-gb-nav-rail>`,
    pick: (c) => [c.querySelector('md-gb-fab')!],
  },
  {
    id: 'fab-menu-list-items',
    level: 0,
    html: `<md-gb-fab-menu open aria-label="Actions"><md-gb-fab-menu-item label="Edit"><md-gb-icon slot="icon">edit</md-gb-icon></md-gb-fab-menu-item><md-gb-fab-menu-item label="Share"><md-gb-icon slot="icon">share</md-gb-icon></md-gb-fab-menu-item></md-gb-fab-menu>`,
    pick: (c) => Array.from(c.querySelectorAll('md-gb-fab-menu-item')),
  },
  {id: 'tabs', level: 0, html: `<md-gb-tabs aria-label="Tabs"><md-gb-tab><span slot="label">One</span></md-gb-tab><md-gb-tab><span slot="label">Two</span></md-gb-tab></md-gb-tabs>`},
  {id: 'slider', level: 0, html: `<md-gb-slider style="width:300px" value="40" aria-label="Volume"></md-gb-slider>`},
  {id: 'app-bar', level: 0, html: `<md-gb-app-bar></md-gb-app-bar>`},
  {id: 'dialog-full-screen', level: 0, html: `<md-gb-dialog open full-screen always-full-screen aria-label="Dialog">Content</md-gb-dialog>`},
  // Above compact a full-screen dialog is a basic dialog (dialogs-daddf8).
  {id: 'dialog-full-screen-adaptive', level: 3, html: `<md-gb-dialog open full-screen aria-label="Dialog">Content</md-gb-dialog>`},
  {id: 'side-sheet-docked', level: 0, html: `<md-gb-side-sheet open label="Sheet">Content</md-gb-side-sheet>`},
];

const LEVEL_1: Row[] = [
  {id: 'button-elevated', level: 1, html: `<md-gb-button color="elevated">Label</md-gb-button>`},
  {id: 'card-elevated', level: 1, html: `<md-gb-card color="elevated" style="width:200px;height:120px">Content</md-gb-card>`},
  {id: 'chip-suggestion-elevated', level: 1, html: `<md-gb-chip-set><md-gb-chip type="suggestion" elevated>Label</md-gb-chip></md-gb-chip-set>`},
  {
    id: 'nav-drawer-modal',
    level: 1,
    html: `<md-gb-nav-drawer modal quick open aria-label="Mail"><md-gb-nav-drawer-item>Inbox</md-gb-nav-drawer-item><md-gb-nav-drawer-item>Sent</md-gb-nav-drawer-item></md-gb-nav-drawer>`,
  },
  {id: 'bottom-sheet-modal', level: 1, html: `<md-gb-bottom-sheet modal quick open label="Share">Content</md-gb-bottom-sheet>`},
  {id: 'side-sheet-modal', level: 1, html: `<md-gb-side-sheet modal open label="Sheet">Content</md-gb-side-sheet>`},
];

const LEVEL_2: Row[] = [
  {
    id: 'menu',
    level: 2,
    html: `<md-gb-menu aria-label="Menu"><md-gb-menu-item>Cut</md-gb-menu-item><md-gb-menu-item>Copy</md-gb-menu-item></md-gb-menu>`,
    prepare: (c) => (c.querySelector('md-gb-menu') as HTMLElement).showPopover(),
  },
  {id: 'nav-bar', level: 2, html: `<md-gb-nav-bar><md-gb-nav-bar-item><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-bar-item><md-gb-nav-bar-item><md-gb-icon slot="icon">mail</md-gb-icon>Mail</md-gb-nav-bar-item></md-gb-nav-bar>`},
  {id: 'rich-tooltip', level: 2, html: `<md-gb-tooltip variant="rich" persistent subhead="Subhead">Supporting text</md-gb-tooltip>`},
];

const LEVEL_3: Row[] = [
  {id: 'fab', level: 3, html: `<md-gb-fab aria-label="Create"><md-gb-icon>add</md-gb-icon></md-gb-fab>`},
  {id: 'fab-small', level: 3, html: `<md-gb-fab size="sm" aria-label="Create"><md-gb-icon>add</md-gb-icon></md-gb-fab>`},
  {id: 'extended-fab', level: 3, html: `<md-gb-fab label="Create"><md-gb-icon>add</md-gb-icon></md-gb-fab>`},
  {
    id: 'fab-menu-close-button',
    level: 3,
    html: `<md-gb-fab-menu open aria-label="Actions"><md-gb-fab-menu-item label="Edit"><md-gb-icon slot="icon">edit</md-gb-icon></md-gb-fab-menu-item></md-gb-fab-menu>`,
    pick: (c) => [c.querySelector('md-gb-fab-menu')!.shadowRoot!.querySelector('#button')!],
  },
  {id: 'dialog-modal', level: 3, html: `<md-gb-dialog open aria-label="Dialog">Content</md-gb-dialog>`},
  {id: 'date-picker-modal', level: 3, html: `<md-gb-date-picker variant="modal" open label="Date"></md-gb-date-picker>`},
  {id: 'date-picker-docked', level: 3, html: `<md-gb-date-picker open label="Date"></md-gb-date-picker>`},
  {id: 'time-picker-modal', level: 3, html: `<md-gb-time-picker modal open></md-gb-time-picker>`},
];

/**
 * Rows where the table disagrees with another source and the other source
 * wins (scripts/m3/TODO.md, "Resolved from the specs").
 */
const RESOLVED: Row[] = [
  // The table lists search at level 3. The search page says the bar has "no
  // shadow by default" and Compose agrees (SearchBarDefaults: shadow and tonal
  // elevation level 0): the level shows as its tone (see the tone checks below).
  {id: 'search-bar', level: 0, html: `<md-gb-search-bar placeholder="Search" style="width:360px"></md-gb-search-bar>`},
  // The table lists the floating toolbar at level 2; its token
  // (md.comp.toolbar.floating.container.elevation) is level 3, which wins.
  {
    id: 'floating-toolbar',
    level: 3,
    html: `<md-gb-toolbar aria-label="Tools"><md-gb-icon-button aria-label="Bold"><md-gb-icon>format_bold</md-gb-icon></md-gb-icon-button></md-gb-toolbar>`,
    pick: (c) => [c.querySelector('md-gb-toolbar')!.shadowRoot!.querySelector('.toolbar')!],
  },
];

/** One row per component: its parts must paint exactly the row's level. */
function suite(title: string, rows: Row[]) {
  describe(title, () => {
    for (const row of rows) {
      it(`${row.id} rests at level ${row.level}`, async () => {
        const {container, cleanup} = await render(row);
        const parts = (row.pick ?? DEFAULT_PICK)(container);
        const levels = paintedLevels(parts);
        if (row.level === 0) {
          expect(levels).withContext(`${row.id}: level 0 paints no elevation shadow`).toEqual([]);
        } else {
          expect(levels).withContext(`${row.id}: resting level ${row.level}`).toEqual([row.level]);
        }
        cleanup();
      });
    }
  });
}

describe('elevation levels (central)', () => {
  // spec: elevation-2dc660, elevation-7d2103
  suite('resting level 0: buttons, icon buttons, chips, cards, lists, rails, tabs and sheets', LEVEL_0);

  // spec: elevation-2dc660, elevation-7f1215
  suite('resting level 1: elevated buttons, cards and chips, modal drawers and sheets', LEVEL_1);

  // spec: elevation-2dc660, elevation-07b182
  suite('resting level 2: menus, navigation bars and rich tooltips', LEVEL_2);

  // spec: elevation-2dc660, elevation-55fb01, elevation-23a31c
  suite('resting level 3: FABs, dialogs and pickers', LEVEL_3);

  // spec: elevation-55fb01
  // (The floating toolbar row deviates from elevation-07b182, which lists it
  // at level 2; that unit is cited by the level 2 suite above.)
  suite('where the table disagrees with the component page or its token', RESOLVED);
});

// Elevation shown as a tone instead of a shadow (elevation.md: "Elevation can
// be shown as tonal surface colors or shadows").
describe('elevation levels shown by tone (central)', () => {
  /** The computed color of a color role. */
  function role(name: string) {
    const probe = document.createElement('span');
    probe.style.color = `var(--md-sys-color-${name})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }

  /** The background painted by the first element under `root` that paints one. */
  function fill(root: Element) {
    for (const e of deepElements(root)) {
      const color = getComputedStyle(e).backgroundColor;
      if (color !== 'rgba(0, 0, 0, 0)') return color;
    }
    return 'none';
  }

  async function mount(markup: string) {
    const container = document.createElement('div');
    container.innerHTML = markup;
    document.body.append(container);
    await settle(container);
    for (const e of deepElements(container)) e.getAnimations().forEach((a) => a.finish());
    return container;
  }

  // spec: elevation-55fb01
  it('search bar shows level 3 as the surface container high fill, without a shadow', async () => {
    await loadSubject();
    const c = await mount('<md-gb-search-bar placeholder="Search" style="width:360px"></md-gb-search-bar>');
    expect(fill(c.firstElementChild!)).toBe(role('surface-container-high'));
    c.remove();
  });

  // spec: elevation-4aa184
  // The app bar page says the scrolled state has no drop shadow; its level 2
  // (md.comp.app-bar.on-scroll.container.elevation) is the surface container fill.
  it('scrolled app bar shows level 2 as the surface container fill, without a shadow', async () => {
    const c = await mount('<md-gb-app-bar scrolled><span slot="headline">Title</span></md-gb-app-bar>');
    const bar = c.firstElementChild!;
    expect(fill(bar)).toBe(role('surface-container'));
    expect(deepElements(bar).every((e) => getComputedStyle(e).boxShadow === 'none')).toBeTrue();
    c.remove();
  });
});
