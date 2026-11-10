/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';

import {Environment} from '../../testing/environment.js';
import '../../components/fab/md-gb-fab.js';
import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

function shadowOf(level: number) {
  const el = document.createElement('div');
  el.style.boxShadow = `var(--md-sys-elevation-shadow-${level})`;
  document.body.append(el);
  const value = getComputedStyle(el).boxShadow;
  el.remove();
  return value;
}

describe('interaction elevation', () => {
  const env = new Environment();

  // spec: elevation-f0be7e, elevation-69b3fd
  it('lifts a FAB by one level (3 to 4) while it is hovered', async () => {
    const root = env.render(html`<md-gb-fab aria-label="Add" style="margin:40px"></md-gb-fab>`);
    await env.waitForStability();
    const fab = root.querySelector('md-gb-fab')!;
    const container = (fab.shadowRoot!.querySelector('.fab') ?? fab.shadowRoot!.querySelector('button')) as HTMLElement;
    const settle = () => container.getAnimations().forEach((a) => a.finish());
    settle();
    expect(getComputedStyle(container).boxShadow).toBe(shadowOf(3));

    const box = container.getBoundingClientRect();
    await sendMouse({type: 'move', position: [Math.round(box.x + box.width / 2), Math.round(box.y + box.height / 2)]});
    await env.waitForStability();
    settle();
    expect(getComputedStyle(container).boxShadow).toBe(shadowOf(4));
    await sendMouse({type: 'move', position: [0, 0]});
  });
});
