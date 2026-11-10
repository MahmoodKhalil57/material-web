/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-bottom-sheet.js';
import './md-gb-side-sheet.js';

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type BottomSheetElement} from './bottom-sheet-element.js';
import {type SideSheetElement} from './side-sheet-element.js';

adoptStyles(document, [m3Styles]);

function scaleAnimations(el: Element) {
  return el.getAnimations().filter((animation) => {
    const effect = animation.effect as KeyframeEffect | null;
    return effect?.getKeyframes().some((frame) => 'scale' in frame);
  });
}

describe('md-gb-bottom-sheet back gesture', () => {
  const env = new Environment();

  async function setup() {
    const root = env.render(html`
      <div style="position: relative; block-size: 600px">
        <md-gb-bottom-sheet modal>
          <div style="block-size: 300px">Content</div>
        </md-gb-bottom-sheet>
      </div>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-bottom-sheet') as BottomSheetElement;
    sheet.quick = true;
    await sheet.show();
    sheet.quick = false;
    return sheet;
  }

  // spec: bottom-sheets-eaed30
  it('shrinks the sheet so it detaches from the left and right edges while going back', async () => {
    const sheet = await setup();
    const dialog = sheet.shadowRoot!.querySelector('dialog')!;
    const done = sheet.handleBack();
    const [animation] = scaleAnimations(dialog);
    expect(animation).toBeDefined();
    const frames = (animation.effect as KeyframeEffect).getKeyframes();
    const [x, y] = String(frames[frames.length - 1]['scale']).split(' ').map(Number);
    // 24dp comes off each side, and the sheet stays anchored to the bottom.
    expect(x).toBeLessThan(1);
    expect(y).toBeLessThan(1);
    expect(frames[frames.length - 1]['transformOrigin']).toBe('50% 100%');
    const width = sheet.shadowRoot!.querySelector('.sheet-panel')!.getBoundingClientRect().width;
    expect(width * (1 - x)).toBeCloseTo(48, 0);
    sheet.quick = true;
    dialog.getAnimations().forEach((a) => a.finish());
    await done;
  });

  // spec: bottom-sheets-d41d81
  it('commits the gesture on release and cancels it when the close is prevented', async () => {
    const committed = await setup();
    const reasons: string[] = [];
    committed.addEventListener('close', (e) =>
      reasons.push((e as CustomEvent<{reason: string}>).detail.reason),
    );
    committed.quick = true;
    await committed.handleBack();
    expect(committed.open).toBeFalse();
    expect(reasons).toEqual(['back']);

    const canceled = await setup();
    canceled.addEventListener('close', (e) => e.preventDefault());
    canceled.quick = true;
    await canceled.handleBack();
    expect(canceled.open).toBeTrue();
  });
});

describe('md-gb-side-sheet back gesture', () => {
  const env = new Environment();

  async function setup(dir: string) {
    const root = env.render(html`
      <div dir=${dir} style="position: relative; block-size: 600px">
        <md-gb-side-sheet modal headline="Filters">Content</md-gb-side-sheet>
      </div>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-side-sheet') as SideSheetElement;
    sheet.quick = true;
    await sheet.show();
    sheet.quick = false;
    return sheet;
  }

  // spec: side-sheets-7f5718
  it('scales the sheet and its content toward the edge it sits on', async () => {
    for (const [dir, origin] of [
      ['ltr', '100% 50%'],
      ['rtl', '0% 50%'],
    ]) {
      const sheet = await setup(dir);
      const dialog = sheet.shadowRoot!.querySelector('dialog')!;
      const done = sheet.handleBack();
      const [animation] = scaleAnimations(dialog);
      expect(animation).withContext(dir).toBeDefined();
      const frames = (animation.effect as KeyframeEffect).getKeyframes();
      expect(frames[frames.length - 1]['transformOrigin'])
        .withContext(dir)
        .toBe(origin);
      sheet.quick = true;
      animation.finish();
      await done;
    }
  });

  // spec: side-sheets-cf56cd
  it('commits the gesture on release and cancels it when the close is prevented', async () => {
    const committed = await setup('ltr');
    committed.quick = true;
    await committed.handleBack();
    expect(committed.open).toBeFalse();

    const canceled = await setup('ltr');
    canceled.addEventListener('close', (e) => e.preventDefault());
    canceled.quick = true;
    await canceled.handleBack();
    expect(canceled.open).toBeTrue();
  });
});
