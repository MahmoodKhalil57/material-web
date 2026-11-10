/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import '../navrail/md-gb-nav-rail.js';

import {type AppScaffoldElement} from './app-scaffold-element.js';
import './md-gb-app-scaffold.js';
import './md-gb-pane-scaffold.js';
import {type PaneScaffoldElement} from './pane-scaffold-element.js';

describe('<md-gb-app-scaffold> rail regions', () => {
  const env = new Environment();

  async function setup(width: number) {
    const root = env.render(
      html`<div style="width:${width}px;height:600px">
        <md-gb-app-scaffold>
          <nav slot="navigation-bar">Bar</nav>
          <nav slot="navigation-rail" class="rail" style="width:96px">Rail</nav>
          <aside slot="companion-rail" class="companion" style="width:96px">
            Companion
          </aside>
          <div slot="toolbar" class="toolbar" style="height:64px">Toolbar</div>
          <div class="content" style="height:100%">Content</div>
        </md-gb-app-scaffold>
      </div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    return root;
  }

  // spec: layout-scaffold-66bb92, layout-scaffold-8504d2, layout-scaffold-d3a7e1, layout-scaffold-4b82c4, layout-overview-de1192, layout-overview-6fce1a
  it('puts a companion rail on the trailing side of a large window', async () => {
    const root = await setup(1300);
    const rail = root.querySelector('.rail')!.getBoundingClientRect();
    const companion = root.querySelector('.companion')!.getBoundingClientRect();
    const content = root.querySelector('.content')!.getBoundingClientRect();
    expect(rail.right).toBeLessThanOrEqual(content.left + 1);
    expect(companion.width).toBeGreaterThan(0);
    expect(companion.left).toBeGreaterThanOrEqual(content.right - 1);
    // The rails fill the perimeter next to the panes, full height.
    const frame = root.firstElementChild!.getBoundingClientRect();
    expect(companion.right).toBeCloseTo(frame.right, 0);
    expect(companion.height).toBeCloseTo(frame.height, 0);
  });

  it('shows the companion rail on large and extra-large windows only', async () => {
    const root = await setup(1000);
    expect(
      root.querySelector('.companion')!.getBoundingClientRect().width,
    ).toBe(0);
  });

  // spec: layout-scaffold-5e7da3, layout-scaffold-236688, layout-scaffold-170db1, layout-overview-80b2f7
  it('floats a toolbar in the bottom rail region of a compact window', async () => {
    const root = await setup(400);
    const toolbar = root.querySelector('.toolbar')!.getBoundingClientRect();
    const content = root.querySelector('.content')!.getBoundingClientRect();
    const frame = root.firstElementChild!.getBoundingClientRect();
    expect(toolbar.height).toBeGreaterThan(0);
    expect(toolbar.bottom).toBeLessThanOrEqual(content.bottom + 1);
    // It floats above the content, centered in the window.
    expect(toolbar.top).toBeGreaterThanOrEqual(content.top);
    expect((toolbar.left + toolbar.right) / 2).toBeCloseTo(
      (frame.left + frame.right) / 2,
      0,
    );
  });

  // spec: layout-scaffold-82f725, layout-scaffold-22cdd6
  describe('safe areas', () => {
    it('insets the bars and the content from the system UI regions', async () => {
      const root = await setup(400);
      const app = root.querySelector('md-gb-app-scaffold') as AppScaffoldElement;
      const frame = root.firstElementChild!.getBoundingClientRect();
      const bar = root.querySelector('nav[slot="navigation-bar"]')!;
      const content = root.querySelector('.content')!;
      const barBefore = bar.getBoundingClientRect();
      expect(frame.bottom - barBefore.bottom).toBe(0);

      app.style.setProperty('--md-gb-scaffold-safe-bottom', '34px');
      app.style.setProperty('--md-gb-scaffold-safe-top', '24px');
      await env.waitForStability();
      const barAfter = bar.getBoundingClientRect();
      expect(frame.bottom - barAfter.bottom).toBe(34);
      expect(content.getBoundingClientRect().top - frame.top).toBeGreaterThanOrEqual(24);
    });

    it('takes the insets from env(safe-area-inset-*) by default', async () => {
      const root = await setup(400);
      const app = root.querySelector('md-gb-app-scaffold') as AppScaffoldElement;
      const css = Array.from(app.shadowRoot!.adoptedStyleSheets)
        .map((sheet) =>
          Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n'),
        )
        .join('\n');
      for (const side of ['top', 'right', 'bottom', 'left']) {
        expect(css).toContain(`env(safe-area-inset-${side}`);
      }
    });
  });

  describe('side sheet', () => {
    async function withRail(sheet: string) {
      const root = env.render(
        html`<div style="width:1000px;height:600px">
          <md-gb-app-scaffold side-sheet-navigation=${sheet}>
            <md-gb-nav-rail slot="navigation-rail" expanded></md-gb-nav-rail>
            <div class="content">Content</div>
          </md-gb-app-scaffold>
        </div>`,
      );
      await env.waitForStability();
      await env.waitForStability();
      const app = root.querySelector('md-gb-app-scaffold') as AppScaffoldElement;
      const rail = root.querySelector('md-gb-nav-rail') as HTMLElement & {
        expanded: boolean;
      };
      const region = () =>
        app.shadowRoot!.querySelector<HTMLElement>('.app-scaffold-rail')!;
      const openSheet = async (open: boolean) => {
        app.sideSheetOpen = open;
        await app.updateComplete;
        await env.waitForStability();
      };
      return {app, rail, region, openSheet};
    }

    // spec: layout-breakpoints-5f5a06, layout-scaffold-5b1ebf
    it('keeps the rail visible', async () => {
      const {app, rail, region, openSheet} = await withRail('keep');
      expect(rail.expanded).toBeTrue();
      await openSheet(true);
      expect(app.sideSheetOpen).toBeTrue();
      expect(app.hasAttribute('side-sheet-open')).toBeTrue();
      expect(region().hidden).toBeFalse();
      expect(rail.expanded).toBeTrue();
      expect(rail.getBoundingClientRect().width).toBeGreaterThan(0);
    });

    // spec: layout-breakpoints-5f5a06, layout-scaffold-5b1ebf
    it('tells keep, collapse and hide apart with a visible side sheet', async () => {
      const outcome: Record<string, {sheet: number; hidden: boolean; expanded: boolean}> = {};
      for (const mode of ['keep', 'collapse', 'hide']) {
        const root = env.render(
          html`<div style="width:1700px;height:600px">
            <md-gb-app-scaffold side-sheet-navigation=${mode}>
              <md-gb-nav-rail slot="navigation-rail" expanded></md-gb-nav-rail>
              <md-gb-pane-scaffold>
                <div slot="secondary">List</div>
                <div>Detail</div>
                <div slot="tertiary" class="sheet">Sheet</div>
              </md-gb-pane-scaffold>
            </md-gb-app-scaffold>
          </div>`,
        );
        await env.waitForStability();
        await env.waitForStability();
        const app = root.querySelector('md-gb-app-scaffold') as AppScaffoldElement;
        const rail = root.querySelector('md-gb-nav-rail') as HTMLElement & {
          expanded: boolean;
        };
        outcome[mode] = {
          sheet: root.querySelector('.sheet')!.getBoundingClientRect().width,
          hidden: !!app.shadowRoot!.querySelector<HTMLElement>('.app-scaffold-rail')!.hidden,
          expanded: rail.expanded,
        };
      }
      for (const mode of ['keep', 'collapse', 'hide']) {
        expect(outcome[mode].sheet).withContext(mode).toBeGreaterThan(0);
      }
      expect(outcome['keep']).toEqual(jasmine.objectContaining({hidden: false, expanded: true}));
      expect(outcome['collapse']).toEqual(jasmine.objectContaining({hidden: false, expanded: false}));
      expect(outcome['hide'].hidden).toBeTrue();
    });

    // spec: layout-breakpoints-5f5a06, layout-scaffold-5b1ebf
    it('collapses the rail while the side sheet is open, then restores it', async () => {
      const {rail, region, openSheet} = await withRail('collapse');
      expect(rail.expanded).toBeTrue();
      await openSheet(true);
      expect(region().hidden).toBeFalse();
      expect(rail.expanded).toBeFalse();
      await openSheet(false);
      expect(rail.expanded).toBeTrue();
    });

    // spec: layout-breakpoints-5f5a06, layout-scaffold-5b1ebf
    it('hides the rail completely while the side sheet is open', async () => {
      const {region, openSheet} = await withRail('hide');
      expect(region().hidden).toBeFalse();
      await openSheet(true);
      expect(region().hidden).toBeTrue();
      await openSheet(false);
      expect(region().hidden).toBeFalse();
    });

    // spec: layout-breakpoints-5f5a06, layout-scaffold-5b1ebf
    it('detects the pane scaffold side sheet (tertiary pane)', async () => {
      const root = env.render(
        html`<div style="width:1700px;height:600px">
          <md-gb-app-scaffold side-sheet-navigation="hide">
            <nav slot="navigation-rail" style="width:96px">Rail</nav>
            <md-gb-pane-scaffold>
              <div slot="secondary">List</div>
              <div>Detail</div>
              <div slot="tertiary">Sheet</div>
            </md-gb-pane-scaffold>
          </md-gb-app-scaffold>
        </div>`,
      );
      await env.waitForStability();
      await env.waitForStability();
      const app = root.querySelector('md-gb-app-scaffold') as AppScaffoldElement;
      const scaffold = root.querySelector(
        'md-gb-pane-scaffold',
      ) as PaneScaffoldElement;
      expect(scaffold.paneCount).toBe(3);
      expect(
        app.shadowRoot!.querySelector<HTMLElement>('.app-scaffold-rail')!.hidden,
      ).toBeTrue();
    });
  });
});

describe('split-pane layout with navigation', () => {
  const env = new Environment();

  async function setup(width: number, railWidth: number, companion = 0) {
    const root = env.render(
      html`<div style="width:${width}px;height:400px">
        <md-gb-app-scaffold>
          <nav slot="navigation-bar">Bar</nav>
          <nav slot="navigation-rail" style="width:${railWidth}px">Rail</nav>
          ${companion
            ? html`<aside slot="companion-rail" style="width:${companion}px">
                Companion
              </aside>`
            : ''}
          <md-gb-pane-scaffold arrangement="split" medium-two-pane>
            <div slot="secondary">List</div>
            <div>Detail</div>
          </md-gb-pane-scaffold>
        </md-gb-app-scaffold>
      </div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    const scaffold = root.querySelector(
      'md-gb-pane-scaffold',
    ) as PaneScaffoldElement;
    const pane = (name: string) =>
      scaffold.shadowRoot!.querySelector<HTMLElement>(
        `.pane-${name}`,
      )!.getBoundingClientRect();
    return {
      root,
      scaffold,
      pane,
      frame: root.firstElementChild!.getBoundingClientRect(),
    };
  }

  // spec: layout-breakpoints-e0012f, layout-breakpoints-b5ee27, layout-breakpoints-68f992, layout-breakpoints-74b819
  it('visually centers the spacer by shrinking the leading pane for the navigation', async () => {
    for (const railWidth of [96, 220]) {
      const {pane, frame} = await setup(1000, railWidth);
      const leading = pane('secondary');
      const trailing = pane('primary');
      const center = (leading.right + trailing.left) / 2;
      expect(center)
        .withContext(`rail ${railWidth}`)
        .toBeCloseTo(frame.left + frame.width / 2, 0);
      // The navigation and the first pane together fill half of the window.
      expect(leading.right - frame.left)
        .withContext(`rail ${railWidth}`)
        .toBeLessThanOrEqual(frame.width / 2);
      expect(leading.width).toBeGreaterThan(0);
      expect(trailing.width).toBeGreaterThan(0);
    }
  });

  // spec: layout-breakpoints-74b819
  it('keeps the spacer centered with a companion rail too', async () => {
    const {pane, frame} = await setup(1300, 96, 80);
    const center = (pane('secondary').right + pane('primary').left) / 2;
    expect(center).toBeCloseTo(frame.left + frame.width / 2, 0);
  });
});

describe('floating pane', () => {
  const env = new Environment();

  // spec: layout-scaffold-df1132
  it('keeps a modal temporary task floating at every window size class', async () => {
    for (const width of [400, 700, 1000, 1500]) {
      const root = env.render(
        html`<div style="width:${width}px;height:500px">
          <md-gb-pane-scaffold
            layout="supporting-pane"
            levitate="floating"
            levitate-modal
            levitate-open>
            <div slot="secondary">Task</div>
            <div>Main</div>
          </md-gb-pane-scaffold>
        </div>`,
      );
      await env.waitForStability();
      await env.waitForStability();
      const scaffold = root.querySelector(
        'md-gb-pane-scaffold',
      ) as PaneScaffoldElement;
      expect(scaffold.mode).withContext(`${width}`).toBe('levitated');
      expect(
        scaffold.shadowRoot!.querySelector('.pane-scaffold-floating'),
      )
        .withContext(`${width}`)
        .not.toBeNull();
    }
  });
});
