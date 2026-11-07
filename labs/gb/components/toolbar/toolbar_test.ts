/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../fab/md-gb-fab.js';
import '../iconbutton/md-gb-icon-button.js';
import '../../styles/icon/md-gb-icon.js';
import './md-gb-toolbar.js';

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {ToolbarElement} from './toolbar-element.js';

adoptStyles(document, [m3Styles]);

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

describe('md-gb-toolbar', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const toolbar = root.querySelector('md-gb-toolbar') as ToolbarElement;
    await toolbar.updateComplete;
    await toolbar.updateComplete;
    return toolbar;
  }

  function fabButton(toolbar: ToolbarElement) {
    const fab = toolbar
      .querySelector('md-gb-fab')!
      .shadowRoot!.querySelector<HTMLElement>('.fab')!;
    for (const animation of fab.getAnimations()) animation.finish();
    return fab;
  }

  function withFab(attrs = '') {
    // Attributes are set after render; `attrs` is a space-separated list.
    return html`<md-gb-toolbar data-attrs=${attrs}>
      <md-gb-icon-button aria-label="Bold">b</md-gb-icon-button>
      <md-gb-icon-button aria-label="Italic">i</md-gb-icon-button>
      <md-gb-fab slot="fab" aria-label="Add"><md-gb-icon>add</md-gb-icon></md-gb-fab>
    </md-gb-toolbar>`;
  }

  it('has the toolbar role', async () => {
    const toolbar = await render(html`<md-gb-toolbar></md-gb-toolbar>`);
    // ElementInternals role.
    expect(toolbar.hasAttribute('focusgroup')).toBeTrue();
  });

  it('uses the full floating container shape', async () => {
    const toolbar = await render(html`<md-gb-toolbar></md-gb-toolbar>`);
    const bar = toolbar.shadowRoot!.querySelector<HTMLElement>('.toolbar')!;
    expect(parseFloat(getComputedStyle(bar).borderTopLeftRadius)).toBeGreaterThanOrEqual(
      bar.getBoundingClientRect().height / 2,
    );
  });

  describe('with a FAB', () => {
    it('lays out the toolbar and the FAB 8px apart', async () => {
      const toolbar = await render(withFab());
      const layout = toolbar.shadowRoot!.querySelector<HTMLElement>(
        '.toolbar-with-fab',
      );
      expect(layout).not.toBeNull();
      expect(getComputedStyle(layout!).columnGap).toBe('8px');
      const bar = toolbar.shadowRoot!.querySelector('.toolbar')!.getBoundingClientRect();
      const fab = toolbar.querySelector('md-gb-fab')!.getBoundingClientRect();
      expect(fab.left).toBeGreaterThan(bar.right);
    });

    it('uses the standard toolbar FAB size and colors', async () => {
      const toolbar = await render(withFab());
      const fab = fabButton(toolbar);
      const style = getComputedStyle(fab);
      expect(fab.getBoundingClientRect().width).toBe(56);
      expect(style.backgroundColor).toBe(
        resolvedColor('--md-sys-color-secondary-container'),
      );
    });

    it('uses the vibrant toolbar FAB colors', async () => {
      const toolbar = await render(withFab());
      toolbar.color = 'vibrant';
      await toolbar.updateComplete;
      expect(getComputedStyle(fabButton(toolbar)).backgroundColor).toBe(
        resolvedColor('--md-sys-color-tertiary-container'),
      );
    });

    it('collapses the toolbar and grows the FAB', async () => {
      const toolbar = await render(withFab());
      toolbar.expanded = false;
      await toolbar.updateComplete;
      expect(toolbar.hasAttribute('expanded')).toBeFalse();
      expect(fabButton(toolbar).getBoundingClientRect().width).toBe(80);
      const bar = toolbar.shadowRoot!.querySelector<HTMLElement>('.toolbar')!;
      expect(bar.inert).toBeTrue();
    });

    it('reads expanded="false" from markup', async () => {
      const root = env.render(html`<md-gb-toolbar expanded="false"></md-gb-toolbar>`);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar') as ToolbarElement;
      expect(toolbar.expanded).toBeFalse();
    });

    it('puts the FAB first with fab-position="start"', async () => {
      const toolbar = await render(withFab());
      toolbar.fabPosition = 'start';
      await toolbar.updateComplete;
      const bar = toolbar.shadowRoot!.querySelector('.toolbar')!.getBoundingClientRect();
      const fab = toolbar.querySelector('md-gb-fab')!.getBoundingClientRect();
      expect(fab.right).toBeLessThan(bar.left);
    });

    it('ignores the FAB when docked', async () => {
      const toolbar = await render(withFab());
      toolbar.docked = true;
      await toolbar.updateComplete;
      expect(toolbar.shadowRoot!.querySelector('.toolbar-with-fab')).toBeNull();
    });
  });
});
