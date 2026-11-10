/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {Environment} from '../../testing/environment.js';
import '../../components/button/md-gb-button.js';
import '../../components/buttongroup/md-gb-button-group.js';
import '../../components/loadingindicator/md-gb-loading-indicator.js';
import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

describe('shape morphing', () => {
  const env = new Environment();

  // spec: shape-0a56c2, shape-2e3f75, shape-b7a84e, shape-62f61e, shape-08b286, shape-ae7f4c
  it('morphs the loading indicator shape and the selected button group shape', async () => {
    const root = env.render(html`
      <md-gb-loading-indicator aria-label="Loading"></md-gb-loading-indicator>
      <md-gb-button-group variant="connected" selection="single">
        <md-gb-button id="a" size="sm">One</md-gb-button>
        <md-gb-button id="b" size="sm">Two</md-gb-button>
      </md-gb-button-group>`);
    await env.waitForStability();

    const indicator = root.querySelector('md-gb-loading-indicator')!;
    const names = indicator
      .shadowRoot!.getAnimations()
      .map((a) => (a as CSSAnimation).animationName);
    expect(names.some((n) => n.includes('morph'))).withContext(names.join()).toBeTrue();

    const button = root.querySelector('#b')!.shadowRoot!.querySelector('.btn') as HTMLElement;
    const before = parseFloat(getComputedStyle(button).borderTopLeftRadius);
    // The radius is part of the button's transition, so selecting animates it.
    expect(getComputedStyle(button).transitionProperty).toMatch(/all|border|radius/);
    (root.querySelector('#b') as HTMLElement).toggleAttribute('selected', true);
    await env.waitForStability();
    button.getAnimations().forEach((a) => a.finish());
    expect(parseFloat(getComputedStyle(button).borderTopLeftRadius)).not.toBe(before);
  });
});
