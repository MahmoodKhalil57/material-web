/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-segmented-button-set.js';
import './md-gb-segmented-button.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-segmented-button-set> layout and anatomy', () => {
  const env = new Environment();

  const segments = (count: number) =>
    Array.from(
      {length: count},
      (_, i) =>
        html`<md-gb-segmented-button
          value=${i}
          label="Option ${i}"></md-gb-segmented-button>`,
    );

  // spec: segmented-buttons-fbf3b2, segmented-buttons-c7b4b2, segmented-buttons-e4deab
  it('keeps its own width and segment padding on larger screens', async () => {
    const widths: number[] = [];
    const paddings: string[] = [];
    let container!: HTMLElement;
    for (const width of [400, 1600]) {
      const root = env.render(html`<div
        style="width: ${width}px; padding: 0 24px; box-sizing: border-box">
        <md-gb-segmented-button-set aria-label="View">
          ${segments(3)}
        </md-gb-segmented-button-set>
      </div>`);
      await env.waitForStability();
      container = root.firstElementChild as HTMLElement;
      const set = root.querySelector('md-gb-segmented-button-set')!;
      widths.push(set.getBoundingClientRect().width);
      const segment = set.querySelector('md-gb-segmented-button')!;
      paddings.push(
        getComputedStyle(
          segment.shadowRoot!.querySelector('button, [part="button"]') ?? segment,
        ).paddingInlineStart,
      );
    }
    // The set sizes to its segments instead of stretching with the window,
    // and each segment keeps the same padding.
    expect(widths[1]).toBe(widths[0]);
    expect(paddings[1]).toBe(paddings[0]);
    // It does not reach the edge of the viewport or its container.
    expect(widths[1]).toBeLessThan(container.getBoundingClientRect().width / 2);
  });

  // spec: segmented-buttons-8046ea, segmented-buttons-a265a0
  it('accepts 2 to 5 segments and warns about any other count', async () => {
    const warn = spyOn(console, 'warn');
    for (const count of [2, 3, 4, 5]) {
      env.render(html`<md-gb-segmented-button-set aria-label="View">
        ${segments(count)}
      </md-gb-segmented-button-set>`);
      await env.waitForStability();
    }
    expect(warn).not.toHaveBeenCalled();
    for (const count of [1, 6]) {
      env.render(html`<md-gb-segmented-button-set aria-label="View">
        ${segments(count)}
      </md-gb-segmented-button-set>`);
      await env.waitForStability();
    }
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.calls.argsFor(0)[0]).toContain('1 segments');
    expect(warn.calls.argsFor(1)[0]).toContain('6 segments');
  });
});
