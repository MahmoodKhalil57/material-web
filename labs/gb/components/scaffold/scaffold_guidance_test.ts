/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import './md-gb-app-scaffold.js';
import './md-gb-pane-scaffold.js';

adoptStyles(document, [m3Styles]);

/** Waits for the element's next window size class change. */
function classChange(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    el.addEventListener('window-class-change', () => resolve(), {once: true});
  });
}

describe('list-detail selection across window sizes', () => {
  const env = new Environment();

  async function setup(width: number) {
    const root = env.render(
      html`<div style="width:${width}px;height:400px">
        <md-gb-pane-scaffold detail-open>
          <div slot="secondary">List</div>
          <div class="detail">Detail</div>
          <div slot="placeholder">Select an item</div>
        </md-gb-pane-scaffold>
      </div>`,
    );
    await env.waitForStability();
    const scaffold = root.querySelector('md-gb-pane-scaffold')!;
    const frame = root.firstElementChild as HTMLElement;
    const shown = (selector: string) => root.querySelector(selector)!.getClientRects().length > 0;
    return {scaffold, frame, shown};
  }

  // spec: layout-canonical-examples-819f69, layout-canonical-examples-465681
  it('shows both panes and the selected item when a single pane opens up', async () => {
    const {scaffold, frame, shown} = await setup(500);
    expect(scaffold.mode).toBe('single');
    expect(shown('.detail')).toBeTrue();
    expect(shown('[slot=secondary]')).toBeFalse();

    const changed = classChange(scaffold);
    frame.style.width = '1000px';
    await changed;
    await env.waitForStability();
    expect(scaffold.mode).toBe('two-pane');
    expect(shown('.detail')).toBeTrue();
    expect(shown('[slot=secondary]')).toBeTrue();
    expect(scaffold.detailOpen).toBeTrue();
  });

  // spec: layout-canonical-examples-652d79
  it('shows the detail view in the single pane when two panes close up', async () => {
    const {scaffold, frame, shown} = await setup(1000);
    expect(scaffold.mode).toBe('two-pane');
    const changed = classChange(scaffold);
    frame.style.width = '500px';
    await changed;
    await env.waitForStability();
    expect(scaffold.mode).toBe('single');
    expect(shown('.detail')).toBeTrue();
    expect(shown('[slot=secondary]')).toBeFalse();
  });
});

describe('modal levitated pane scrim', () => {
  const env = new Environment();

  // spec: elevation-cffb15, elevation-4b9ad0, elevation-904931
  it('uses the scrim color role at 32% opacity beneath the modal', async () => {
    const root = env.render(
      html`<div style="width:500px;height:400px">
        <md-gb-pane-scaffold layout="supporting-pane" levitate="docked" levitate-modal levitate-label="Comments">
          <div>Main</div>
          <div slot="secondary">Side</div>
        </md-gb-pane-scaffold>
      </div>`,
    );
    await env.waitForStability();
    const scaffold = root.querySelector('md-gb-pane-scaffold')!;
    scaffold.openLevitated();
    await env.waitForStability();
    scaffold.shadowRoot!.getAnimations().forEach((animation) => animation.finish());
    const scrim = scaffold.shadowRoot!.querySelector('.pane-scrim') as HTMLElement;
    expect(scrim).not.toBeNull();
    const style = getComputedStyle(scrim);
    expect(Number(style.opacity)).toBeCloseTo(0.32, 2);
    const probe = document.createElement('div');
    probe.style.color = 'var(--md-sys-color-scrim)';
    document.body.append(probe);
    const scrimColor = getComputedStyle(probe).color;
    probe.remove();
    expect(style.backgroundColor).toBe(scrimColor);
  });
});

describe('navigation in right-to-left languages', () => {
  const env = new Environment();

  // spec: layout-overview-658179
  it('places the navigation rail on the right', async () => {
    const root = env.render(
      html`<div dir="rtl" style="width:1000px;height:400px">
        <md-gb-app-scaffold>
          <nav slot="navigation-bar">Bar</nav>
          <nav slot="navigation-rail" class="rail" style="width:96px">Rail</nav>
          <div class="content">Content</div>
        </md-gb-app-scaffold>
      </div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    const rail = root.querySelector('.rail')!.getBoundingClientRect();
    const content = root.querySelector('.content')!.getBoundingClientRect();
    expect(rail.width).toBeGreaterThan(0);
    expect(rail.left).toBeGreaterThanOrEqual(content.right - 1);
  });
});
