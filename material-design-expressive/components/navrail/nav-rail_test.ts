/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../fab/md-gb-fab.js';
import './md-gb-nav-rail.js';
import './md-gb-nav-rail-item.js';

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {FabElement} from '../fab/fab-element.js';
import {
  FakeCloseWatcher,
  useCloseWatcher,
} from '../shared/predictive-back-harness.js';
import {NavRailElement} from './nav-rail-element.js';

adoptStyles(document, [m3Styles]);

/** Dispatches a touch pointer event with a given `timeStamp` (ms). */
function pointer(type: string, target: EventTarget, x: number, time: number) {
  const event = new PointerEvent(type, {
    bubbles: true,
    composed: true,
    cancelable: true,
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    clientX: x,
    clientY: 100,
  });
  Object.defineProperty(event, 'timeStamp', {value: time});
  target.dispatchEvent(event);
}

describe('md-gb-nav-rail', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const rail = root.querySelector('md-gb-nav-rail') as NavRailElement;
    await rail.updateComplete;
    return rail;
  }

  function railEl(rail: NavRailElement) {
    return rail.shadowRoot!.querySelector<HTMLElement>('.nav-rail')!;
  }

  function scrim(rail: NavRailElement) {
    return rail.shadowRoot!.querySelector<HTMLElement>('.nav-rail-scrim');
  }

  const items = html`
    <md-gb-nav-rail-item selected>Inbox</md-gb-nav-rail-item>
    <md-gb-nav-rail-item>Chat</md-gb-nav-rail-item>
  `;

  // spec: navigation-rail-f0a5c6, navigation-rail-83e989
  it('uses the collapsed width and top space', async () => {
    const rail = await render(html`<md-gb-nav-rail>${items}</md-gb-nav-rail>`);
    const style = getComputedStyle(railEl(rail));
    expect(style.inlineSize).toBe('96px');
    expect(style.paddingBlockStart).toBe('44px');
  });

  it('uses the narrow collapsed width', async () => {
    const rail = await render(
      html`<md-gb-nav-rail narrow>${items}</md-gb-nav-rail>`,
    );
    expect(getComputedStyle(railEl(rail)).inlineSize).toBe('80px');
  });

  it('spaces collapsed items 4px apart and expanded items 0px', async () => {
    const rail = await render(html`<md-gb-nav-rail>${items}</md-gb-nav-rail>`);
    const list = rail.shadowRoot!.querySelector<HTMLElement>('.nav-rail-items')!;
    expect(getComputedStyle(list).rowGap).toBe('4px');
    list.style.transition = 'none';
    rail.expanded = true;
    await rail.updateComplete;
    expect(getComputedStyle(list).rowGap).toBe('0px');
  });

  describe('header FAB', () => {
    // spec: navigation-rail-ce2310
    it('is an extended FAB only while the rail is expanded', async () => {
      const rail = await render(
        html`<md-gb-nav-rail>
          <md-gb-fab slot="header" label="Compose"></md-gb-fab>
          ${items}
        </md-gb-nav-rail>`,
      );
      const fab = rail.querySelector('md-gb-fab') as FabElement;
      expect(fab.expanded).toBeFalse();
      rail.expanded = true;
      await rail.updateComplete;
      expect(fab.expanded).toBeTrue();
      rail.expanded = false;
      await rail.updateComplete;
      expect(fab.expanded).toBeFalse();
    });
  });

  describe('modal', () => {
    async function setupModal() {
      const rail = await render(
        html`<div style="display: flex; height: 400px">
          <md-gb-nav-rail modal>${items}</md-gb-nav-rail>
          <main style="flex: 1">Content</main>
        </div>`,
      );
      return rail;
    }

    // spec: navigation-rail-eddba8, navigation-rail-7610d0, navigation-rail-47a2d3, navigation-rail-1393b4, navigation-rail-0934d2
    it('expands over the content without changing the layout', async () => {
      const rail = await setupModal();
      const before = rail.getBoundingClientRect().width;
      rail.expanded = true;
      await rail.updateComplete;
      expect(rail.getBoundingClientRect().width).toBe(before);
      expect(getComputedStyle(railEl(rail)).position).toBe('absolute');
      expect(railEl(rail).getBoundingClientRect().width).toBeGreaterThan(before);
      expect(scrim(rail)).not.toBeNull();
    });

    it('has no scrim while collapsed', async () => {
      const rail = await setupModal();
      expect(scrim(rail)).toBeNull();
    });

    it('collapses on a scrim click', async () => {
      const rail = await setupModal();
      rail.expanded = true;
      await rail.updateComplete;
      const toggle = jasmine.createSpy('toggle');
      rail.addEventListener('toggle', toggle);
      scrim(rail)!.click();
      await rail.updateComplete;
      expect(rail.expanded).toBeFalse();
      expect(toggle).toHaveBeenCalledTimes(1);
    });

    it('collapses on Escape', async () => {
      const rail = await setupModal();
      rail.expanded = true;
      await rail.updateComplete;
      rail.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
      );
      await rail.updateComplete;
      expect(rail.expanded).toBeFalse();
    });

    it('follows a drag toward its edge and collapses past half', async () => {
      const rail = await setupModal();
      rail.expanded = true;
      await rail.updateComplete;
      const target = railEl(rail);
      const width = target.offsetWidth;
      pointer('pointerdown', target, 300, 0);
      pointer('pointermove', target, 250, 500);
      await rail.updateComplete;
      expect(parseFloat(target.style.translate)).toBe(-50);
      expect(target.classList.contains('nav-rail-dragging')).toBeTrue();
      const end = 300 - width / 2 - 10;
      pointer('pointermove', target, end, 1000);
      pointer('pointerup', target, end, 2000);
      await rail.updateComplete;
      expect(rail.expanded).toBeFalse();
    });

    it('stays expanded after a short slow drag', async () => {
      const rail = await setupModal();
      rail.expanded = true;
      await rail.updateComplete;
      const target = railEl(rail);
      pointer('pointerdown', target, 300, 0);
      pointer('pointermove', target, 280, 500);
      pointer('pointerup', target, 280, 1000);
      await rail.updateComplete;
      expect(rail.expanded).toBeTrue();
      expect(target.style.translate).toBe('');
    });

    describe('predictive back', () => {
      async function flush() {
        for (let i = 0; i < 10; i++) await Promise.resolve();
      }

      describe('with CloseWatcher', () => {
        useCloseWatcher(true);

        it('watches for back only while modal and expanded', async () => {
          const rail = await setupModal();
          expect(FakeCloseWatcher.active().length).toBe(0);
          rail.expanded = true;
          await rail.updateComplete;
          expect(FakeCloseWatcher.active().length).toBe(1);
          rail.expanded = false;
          await rail.updateComplete;
          expect(FakeCloseWatcher.active().length).toBe(0);
        });

        it('plays the back motion and collapses on a back request', async () => {
          const rail = await setupModal();
          rail.expanded = true;
          await rail.updateComplete;
          const toggle = jasmine.createSpy('toggle');
          rail.addEventListener('toggle', toggle);
          FakeCloseWatcher.active()[0].requestClose();
          const target = railEl(rail);
          const motion = target
            .getAnimations()
            .find((a) =>
              (a.effect as KeyframeEffect)
                .getKeyframes()
                .some((frame) => 'scale' in frame),
            );
          expect(motion).withContext('predictive back scale').toBeDefined();
          const frames = (motion!.effect as KeyframeEffect).getKeyframes();
          // The rail pivots on its start edge (Compose ModalWideNavigationRail).
          expect(frames[1]['transformOrigin']).toBe('0% 50%');
          expect(rail.expanded).toBeTrue();
          motion!.finish();
          await flush();
          expect(rail.expanded).toBeFalse();
          expect(toggle).toHaveBeenCalledTimes(1);
          for (const a of target.getAnimations()) a.finish();
          await flush();
        });

        it('collapses from handleBack()', async () => {
          const rail = await setupModal();
          rail.expanded = true;
          await rail.updateComplete;
          const done = rail.handleBack();
          for (const a of railEl(rail).getAnimations()) a.finish();
          await flush();
          expect(rail.expanded).toBeFalse();
          for (const a of railEl(rail).getAnimations()) a.finish();
          await done;
        });

        it('ignores back while not modal', async () => {
          const rail = await render(
            html`<md-gb-nav-rail expanded>${items}</md-gb-nav-rail>`,
          );
          expect(FakeCloseWatcher.active().length).toBe(0);
          await rail.handleBack();
          expect(rail.expanded).toBeTrue();
        });
      });

      describe('without CloseWatcher', () => {
        useCloseWatcher(false);

        it('collapses on Escape anywhere in the document', async () => {
          const rail = await setupModal();
          rail.expanded = true;
          await rail.updateComplete;
          document.body.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'Escape',
              bubbles: true,
              cancelable: true,
            }),
          );
          await rail.updateComplete;
          expect(rail.expanded).toBeFalse();
        });
      });
    });

    it('collapses on a fast fling', async () => {
      const rail = await setupModal();
      rail.expanded = true;
      await rail.updateComplete;
      const target = railEl(rail);
      pointer('pointerdown', target, 300, 0);
      pointer('pointermove', target, 280, 20);
      pointer('pointerup', target, 270, 40);
      await rail.updateComplete;
      expect(rail.expanded).toBeFalse();
    });
  });
});
