/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {until} from '../shared/central/subjects.js';

import '../button/md-gb-button.js';
import './md-gb-pane-scaffold.js';
import {type PaneScaffoldElement} from './pane-scaffold-element.js';

// The stacked panes scroll as a whole. A scroller a keyboard user can't reach
// fails axe's `scrollable-region-focusable`, so it becomes a focus stop (with
// a name) when it overflows and holds no focusable content.
describe('stacked pane scroller', () => {
  const env = new Environment();

  async function setup(content: ReturnType<typeof html>) {
    const root = env.render(
      html`<div style="width:400px;height:300px">${content}</div>`,
    );
    await env.waitForStability();
    await env.waitForStability();
    const scaffold = root.querySelector(
      'md-gb-pane-scaffold',
    ) as PaneScaffoldElement;
    const scroller = scaffold.shadowRoot!.querySelector<HTMLElement>(
      '.pane-scaffold-stacked',
    )!;
    return {root, scaffold, scroller};
  }

  const tall = html`<md-gb-pane-scaffold layout="supporting-pane">
    <div slot="secondary" style="height:200px">Supporting</div>
    <div style="height:400px">Focus</div>
  </md-gb-pane-scaffold>`;

  it('is focusable, a labelled region, when it overflows with nothing focusable', async () => {
    const {scaffold, scroller} = await setup(tall);
    expect(scroller.scrollHeight > scroller.clientHeight).toBeTrue();
    expect(await until(() => scroller.tabIndex === 0)).toBeTrue();
    expect(scroller.getAttribute('role')).toBe('region');
    expect(scroller.getAttribute('aria-label')).toBe('Panes');
    scaffold.scrollLabel = 'Order details';
    await scaffold.updateComplete;
    expect(scroller.getAttribute('aria-label')).toBe('Order details');
  });

  it('is not a focus stop or landmark when it does not overflow', async () => {
    const {scroller} = await setup(html`<md-gb-pane-scaffold layout="supporting-pane">
      <div slot="secondary" style="height:40px">Supporting</div>
      <div style="height:40px">Focus</div>
    </md-gb-pane-scaffold>`);
    expect(scroller.scrollHeight > scroller.clientHeight).toBeFalse();
    expect(scroller.hasAttribute('tabindex')).toBeFalse();
    expect(scroller.hasAttribute('role')).toBeFalse();
    expect(scroller.hasAttribute('aria-label')).toBeFalse();
  });

  it('is not a focus stop when its content has one', async () => {
    const {scroller} = await setup(html`<md-gb-pane-scaffold layout="supporting-pane">
      <div slot="secondary" style="height:200px">Supporting</div>
      <div style="height:400px"><md-gb-button>Act</md-gb-button></div>
    </md-gb-pane-scaffold>`);
    expect(scroller.scrollHeight > scroller.clientHeight).toBeTrue();
    expect(scroller.hasAttribute('tabindex')).toBeFalse();
    expect(scroller.hasAttribute('role')).toBeFalse();
  });

  it('follows the content as it overflows and gains focus stops', async () => {
    const {root, scaffold, scroller} = await setup(html`<md-gb-pane-scaffold layout="supporting-pane">
      <div slot="secondary" style="height:40px">Supporting</div>
      <div id="main" style="height:40px">Focus</div>
    </md-gb-pane-scaffold>`);
    const main = root.querySelector<HTMLElement>('#main')!;
    expect(scroller.hasAttribute('tabindex')).toBeFalse();
    main.style.height = '600px';
    expect(await until(() => scroller.tabIndex === 0)).toBeTrue();
    const button = document.createElement('md-gb-button');
    button.textContent = 'Act';
    main.append(button);
    // The new button is a focus stop, so the scroller steps aside once the
    // scaffold looks again (it does on the next size or slot change).
    main.style.height = '601px';
    expect(await until(() => !scroller.hasAttribute('tabindex'))).toBeTrue();
    expect(scaffold.isConnected).toBeTrue();
  });

  it('scrolls with the keyboard once focused', async () => {
    const {scroller} = await setup(tall);
    await until(() => scroller.tabIndex === 0);
    scroller.focus();
    expect(scroller.matches(':focus')).toBeTrue();
    const {sendKeys} = await import('@web/test-runner-commands');
    await sendKeys({press: 'ArrowDown'});
    expect(await until(() => scroller.scrollTop > 0)).toBeTrue();
  });
});
