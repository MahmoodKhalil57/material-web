/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-app-bar.js';

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {AppBarElement} from './app-bar-element.js';

adoptStyles(document, [m3Styles]);

function inner(appBar: AppBarElement) {
  return appBar.shadowRoot!.querySelector<HTMLElement>('.app-bar')!;
}

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

/** The computed font of an element using the type scale token as `font`. */
function typeScale(token: string) {
  const probe = document.createElement('div');
  probe.style.font = `var(${token})`;
  document.body.appendChild(probe);
  const style = getComputedStyle(probe);
  const result = {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    fontFamily: style.fontFamily,
  };
  probe.remove();
  return result;
}

function fontOf(el: Element) {
  const style = getComputedStyle(el);
  return {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    fontFamily: style.fontFamily,
  };
}

describe('md-gb-app-bar spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const appBar = root.querySelector('md-gb-app-bar') as AppBarElement;
    await appBar.updateComplete;
    await appBar.updateComplete;
    return appBar;
  }

  async function settleTransitions() {
    await env.waitForStability();
    document.body.offsetHeight;
    const roots: DocumentOrShadowRoot[] = [document];
    document
      .querySelectorAll('md-gb-app-bar')
      .forEach((el) => roots.push(el.shadowRoot!));
    for (const r of roots) r.getAnimations().forEach((a) => a.finish());
    document.body.offsetHeight;
  }

  // spec: app-bars-7b7aeb, app-bars-b44d66, app-bars-591490, app-bars-fbdb42
  it('has the default heights of the small, medium and large flexible bars', async () => {
    const heights: Record<string, string> = {};
    for (const size of ['sm', 'md', 'lg']) {
      const appBar = await render(
        html`<md-gb-app-bar size=${size}>Title</md-gb-app-bar>`,
      );
      heights[size] = getComputedStyle(inner(appBar)).minHeight;
      expect(inner(appBar).getBoundingClientRect().height).toBeGreaterThanOrEqual(
        parseFloat(heights[size]),
      );
    }
    expect(heights).toEqual({sm: '64px', md: '112px', lg: '120px'});
  });

  // spec: app-bars-03b763
  it('uses straight corners', async () => {
    const appBar = await render(html`<md-gb-app-bar>Title</md-gb-app-bar>`);
    expect(getComputedStyle(inner(appBar)).borderTopLeftRadius).toBe('0px');
  });

  // spec: app-bars-1d8d02, app-bars-9c11d2, app-bars-3ce172, app-bars-e3e94e
  it('matches the background when flat and fills with a contrasting color on scroll', async () => {
    const appBar = await render(html`<md-gb-app-bar>Title</md-gb-app-bar>`);
    const bar = inner(appBar);
    await settleTransitions();
    expect(getComputedStyle(bar).backgroundColor).toBe(
      resolvedColor('--md-sys-color-surface'),
    );
    expect(getComputedStyle(bar).boxShadow).toBe('none');
    appBar.scrolled = true;
    await appBar.updateComplete;
    await settleTransitions();
    expect(getComputedStyle(bar).backgroundColor).toBe(
      resolvedColor('--md-sys-color-surface-container'),
    );
    expect(getComputedStyle(bar).boxShadow).not.toBe('none');
  });

  // spec: app-bars-abc1ef, app-bars-d2f0aa, app-bars-a1ad83, app-bars-374c9e, app-bars-439d46
  it('sets the headline typography by app bar variant', async () => {
    const expected: Record<string, string> = {
      sm: '--md-sys-typescale-title-lg',
      md: '--md-sys-typescale-headline-md',
      lg: '--md-sys-typescale-display-sm',
    };
    for (const [size, token] of Object.entries(expected)) {
      const appBar = await render(
        html`<md-gb-app-bar size=${size}>Title</md-gb-app-bar>`,
      );
      const title = inner(appBar).querySelector('.app-bar-title')!;
      expect(fontOf(title)).toEqual(typeScale(token));
    }
  });

  // spec: app-bars-e0c13b, app-bars-36eb87, app-bars-ea439b, app-bars-541a1d
  it('sets the subtitle typography by app bar variant', async () => {
    const expected: Record<string, string> = {
      sm: '--md-sys-typescale-label-md',
      md: '--md-sys-typescale-label-lg',
      lg: '--md-sys-typescale-title-md',
    };
    for (const [size, token] of Object.entries(expected)) {
      const appBar = await render(
        html`<md-gb-app-bar size=${size}
          >Title<span slot="subtitle">Sub</span></md-gb-app-bar
        >`,
      );
      const subtitle = inner(appBar).querySelector('.app-bar-subtitle')!;
      expect(fontOf(subtitle)).toEqual(typeScale(token));
    }
  });

  // spec: app-bars-e4d2ec
  it('does not wrap the headline of a small app bar', async () => {
    const appBar = await render(
      html`<div style="width: 240px"
        ><md-gb-app-bar
          >A very long headline that cannot fit on one line of the bar</md-gb-app-bar
        ></div
      >`,
    );
    const title = inner(appBar).querySelector<HTMLElement>('.app-bar-title')!;
    expect(getComputedStyle(title).whiteSpace).toBe('nowrap');
    const lineHeight = parseFloat(getComputedStyle(title).lineHeight);
    expect(title.getBoundingClientRect().height).toBeLessThanOrEqual(lineHeight + 1);
  });

  // spec: app-bars-3d0f82
  it('holds the navigation icon, headline and actions in one container', async () => {
    const appBar = await render(
      html`<div style="width: 600px"
        ><md-gb-app-bar>
          <button slot="leading" style="width: 48px">B</button>
          Title
          <button slot="trailing" style="width: 48px">A</button>
        </md-gb-app-bar></div
      >`,
    );
    const bar = inner(appBar).getBoundingClientRect();
    const lead = appBar.querySelector('[slot=leading]')!.getBoundingClientRect();
    const title = inner(appBar)
      .querySelector('.app-bar-title-wrapper')!
      .getBoundingClientRect();
    const trail = appBar.querySelector('[slot=trailing]')!.getBoundingClientRect();
    expect(lead.right).toBeLessThanOrEqual(title.left);
    expect(title.right).toBeLessThanOrEqual(trail.left);
    for (const r of [lead, title, trail]) {
      expect(r.left).toBeGreaterThanOrEqual(bar.left);
      expect(r.right).toBeLessThanOrEqual(bar.right);
    }
  });

  // spec: app-bars-e3d2eb
  it('shows up to two trailing icon buttons at the trailing edge in compact windows', async () => {
    const appBar = await render(
      html`<div style="width: 400px"
        ><md-gb-app-bar>
          Title
          <button slot="trailing" style="width: 48px">1</button>
          <button slot="trailing" style="width: 48px">2</button>
          <button slot="trailing" style="width: 48px">3</button>
        </md-gb-app-bar></div
      >`,
    );
    const actions = Array.from(
      appBar.querySelectorAll<HTMLElement>('[slot=trailing]'),
    );
    expect(actions.map((a) => a.hidden)).toEqual([false, false, true]);
    expect(appBar.overflowedActions).toEqual([actions[2]]);
    const bar = inner(appBar).getBoundingClientRect();
    expect(bar.right - actions[1].getBoundingClientRect().right).toBeLessThan(24);
  });

  // spec: app-bars-9b47af, app-bars-8eee25, app-bars-157f06
  it('mirrors the layout in right-to-left languages', async () => {
    const appBar = await render(
      html`<div dir="rtl" style="width: 600px"
        ><md-gb-app-bar>
          <button slot="leading" style="width: 48px">B</button>
          Title
          <button slot="trailing" style="width: 48px">A</button>
        </md-gb-app-bar></div
      >`,
    );
    const lead = appBar.querySelector('[slot=leading]')!.getBoundingClientRect();
    const trail = appBar.querySelector('[slot=trailing]')!.getBoundingClientRect();
    expect(lead.left).toBeGreaterThan(trail.left);
  });

  // spec: app-bars-42ac08
  it('shows the page title, key actions and a navigation action', async () => {
    const appBar = await render(
      html`<div style="width: 600px"
        ><md-gb-app-bar>
          <button slot="leading" style="width: 48px">Back</button>
          Inbox
          <button slot="trailing" style="width: 48px">Search</button>
        </md-gb-app-bar></div
      >`,
    );
    const title = inner(appBar).querySelector('.app-bar-title')!;
    expect(title.getBoundingClientRect().width).toBeGreaterThan(0);
    expect(appBar.textContent).toContain('Inbox');
    const lead = appBar.querySelector('[slot=leading]')!.getBoundingClientRect();
    const trail = appBar.querySelector('[slot=trailing]')!.getBoundingClientRect();
    const mid = title.getBoundingClientRect();
    expect(lead.right).toBeLessThanOrEqual(mid.left);
    expect(mid.right).toBeLessThanOrEqual(trail.left);
  });

  describe('search', () => {
    const search = (width = 600) =>
      html`<div style="width: ${width}px"
        ><md-gb-app-bar variant="search">
          <button slot="leading" style="width: 48px">B</button>
          <input slot="search" />
          <button slot="trailing" style="width: 48px">A</button>
        </md-gb-app-bar></div
      >`;

    // spec: app-bars-ba8343
    it('has a search field instead of heading text', async () => {
      const appBar = await render(search());
      expect(inner(appBar).querySelector('.app-bar-title')).toBeNull();
      expect(inner(appBar).querySelector('slot[name=search]')).not.toBeNull();
    });

    // spec: app-bars-228dec
    it('places a leading and a trailing element outside the search container', async () => {
      const appBar = await render(search());
      const field = inner(appBar)
        .querySelector('.app-bar-search-container')!
        .getBoundingClientRect();
      const lead = appBar.querySelector('[slot=leading]')!.getBoundingClientRect();
      const trail = appBar.querySelector('[slot=trailing]')!.getBoundingClientRect();
      expect(lead.right).toBeLessThanOrEqual(field.left);
      expect(field.right).toBeLessThanOrEqual(trail.left);
    });

    // spec: app-bars-6ede31, app-bars-7da413
    it('adapts the search field to the available width', async () => {
      const narrow = await render(search(360));
      const narrowWidth = inner(narrow)
        .querySelector('.app-bar-search-bar')!
        .getBoundingClientRect().width;
      const wide = await render(search(840));
      const wideWidth = inner(wide)
        .querySelector('.app-bar-search-bar')!
        .getBoundingClientRect().width;
      expect(wideWidth).toBeGreaterThan(narrowWidth);
    });

    // spec: app-bars-ad3b62, app-bars-098a82, app-bars-cdcafd
    it('uses the surface container color for the search container', async () => {
      const appBar = await render(search());
      const bar = inner(appBar).querySelector<HTMLElement>('.app-bar-search-bar')!;
      await settleTransitions();
      expect(getComputedStyle(bar).backgroundColor).toBe(
        resolvedColor('--md-sys-color-surface-container'),
      );
    });

    // spec: app-bars-48792f
    it('sets the search label typography to body large', async () => {
      const appBar = await render(search());
      const bar = inner(appBar).querySelector('.app-bar-search-bar')!;
      expect(getComputedStyle(bar).getPropertyValue('--search-label-text-font')).toBe(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--md-sys-typescale-body-lg',
        ),
      );
    });
    // spec: app-bars-243514
    it('places trailing icons inside the search bar or outside it', async () => {
      const appBar = await render(
        html`<div style="width: 600px"
          ><md-gb-app-bar variant="search">
            <input slot="search" style="width: 120px" />
            <button slot="search" style="width: 40px">In</button>
            <button slot="trailing" style="width: 48px">Out</button>
          </md-gb-app-bar></div
        >`,
      );
      const bar = inner(appBar)
        .querySelector('.app-bar-search-bar')!
        .getBoundingClientRect();
      const inside = appBar
        .querySelector('button[slot=search]')!
        .getBoundingClientRect();
      const outside = appBar
        .querySelector('button[slot=trailing]')!
        .getBoundingClientRect();
      expect(inside.left).toBeGreaterThanOrEqual(bar.left);
      expect(inside.right).toBeLessThanOrEqual(bar.right);
      expect(outside.left).toBeGreaterThanOrEqual(bar.right);
    });

    // spec: app-bars-7a65d3
    it('takes a leading logo that is cosmetic or triggers an action', async () => {
      const appBar = await render(
        html`<div style="width: 600px"
          ><md-gb-app-bar variant="search">
            <span slot="leading" id="logo" style="width: 40px; height: 40px"></span>
            <input slot="search" />
          </md-gb-app-bar></div
        >`,
      );
      const field = inner(appBar)
        .querySelector('.app-bar-search-container')!
        .getBoundingClientRect();
      const logo = appBar.querySelector('#logo')!;
      expect(logo.getBoundingClientRect().width).toBe(40);
      expect(logo.getBoundingClientRect().right).toBeLessThanOrEqual(field.left);
      // Replaced by a button, the same slot runs an action.
      let taps = 0;
      const button = document.createElement('button');
      button.slot = 'leading';
      button.addEventListener('click', () => taps++);
      logo.replaceWith(button);
      button.click();
      expect(taps).toBe(1);
    });

    // spec: app-bars-ab47a1, app-bars-ff82c1
    it('lets a search bar use a lighter container like surface bright', async () => {
      const appBar = await render(
        html`<div style="width: 600px"
          ><style>
            #bright::part(app-bar) {
              --search-container-color: var(--md-sys-color-surface-bright);
            }
          </style>
          <md-gb-app-bar id="bright" variant="search">
            <input slot="search" />
          </md-gb-app-bar></div
        >`,
      );
      const bar = inner(appBar).querySelector<HTMLElement>('.app-bar-search-bar')!;
      await settleTransitions();
      expect(getComputedStyle(bar).backgroundColor).toBe(
        resolvedColor('--md-sys-color-surface-bright'),
      );
    });
  });
});
