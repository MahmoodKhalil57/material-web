/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../testing/environment.js';
import {adoptStyles} from '../../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../../styles/m3.cssresult.js';

import {BOTTOM_SHEET_STATES} from '../../../components/sheet/bottom-sheet.js';
import {type BottomSheetElement} from '../../../components/sheet/bottom-sheet-element.js';
import '../../../components/sheet/md-gb-bottom-sheet.js';
import '../../../components/sheet/md-gb-side-sheet.js';
import {
  BACK_REASON,
  BackHandler,
  closeRequestSource,
  ESCAPE_REASON,
  PREDICTIVE_BACK_EASING,
  playPredictiveBack,
  predictiveBackTransform,
} from './predictive-back.js';
import {CLOSE_REASONS} from '../../../components/sheet/sheet.js';
import {FakeCloseWatcher, useCloseWatcher} from './predictive-back-harness.js';
import {type SideSheetElement} from '../../../components/sheet/side-sheet-element.js';

adoptStyles(document, [m3Styles]);

function reasonOf(event: Event) {
  return (event as CustomEvent<{reason: string}>).detail.reason;
}

function dialogOf(sheet: HTMLElement) {
  return sheet.shadowRoot!.querySelector('dialog')!;
}

function scaleAnimations(el: Element) {
  return el.getAnimations().filter((animation) => {
    const effect = animation.effect as KeyframeEffect | null;
    return effect?.getKeyframes().some((frame) => 'scale' in frame);
  });
}

describe('predictive back', () => {
  const env = new Environment();

  describe('closeRequestSource()', () => {
    it('treats a synthetic cancel as Escape', () => {
      expect(closeRequestSource(new Event('cancel'))).toBe(ESCAPE_REASON);
    });
  });

  describe('BackHandler', () => {
    describe('with CloseWatcher', () => {
      useCloseWatcher(true);

      it('creates a close watcher while enabled', () => {
        const handler = new BackHandler(() => {});
        handler.enable();
        expect(handler.usesCloseWatcher).toBeTrue();
        expect(FakeCloseWatcher.active().length).toBe(1);
        handler.enable();
        expect(FakeCloseWatcher.instances.length)
          .withContext('enable() is idempotent')
          .toBe(1);
        handler.disable();
        expect(FakeCloseWatcher.active().length).toBe(0);
        expect(handler.enabled).toBeFalse();
      });

      it('reports a back request', () => {
        const onBack = jasmine.createSpy('onBack');
        const handler = new BackHandler(onBack);
        handler.enable();
        FakeCloseWatcher.instances[0].requestClose();
        expect(onBack).toHaveBeenCalledOnceWith(BACK_REASON);
        expect(handler.enabled)
          .withContext('a close watcher closes after one request')
          .toBeFalse();
      });

      it('ignores a destroyed watcher', () => {
        const onBack = jasmine.createSpy('onBack');
        const handler = new BackHandler(onBack);
        handler.enable();
        const watcher = FakeCloseWatcher.instances[0];
        handler.disable();
        watcher.dispatchEvent(new Event('close'));
        expect(onBack).not.toHaveBeenCalled();
      });
    });

    describe('without CloseWatcher', () => {
      useCloseWatcher(false);

      it('falls back to Escape on the document', () => {
        const onBack = jasmine.createSpy('onBack');
        const handler = new BackHandler(onBack);
        handler.enable();
        expect(handler.usesCloseWatcher).toBeFalse();
        const event = new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          cancelable: true,
        });
        document.body.dispatchEvent(event);
        expect(onBack).toHaveBeenCalledOnceWith(ESCAPE_REASON);
        expect(event.defaultPrevented).toBeTrue();
        handler.disable();
        document.body.dispatchEvent(
          new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
        );
        expect(onBack).toHaveBeenCalledTimes(1);
      });

      it('ignores an Escape another handler prevented', () => {
        const onBack = jasmine.createSpy('onBack');
        const handler = new BackHandler(onBack);
        handler.enable();
        const event = new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          cancelable: true,
        });
        event.preventDefault();
        document.body.dispatchEvent(event);
        expect(onBack).not.toHaveBeenCalled();
        handler.disable();
      });
    });
  });

  describe('transforms', () => {
    function box(width: number, height: number) {
      const root = env.render(
        html`<div
          style="inline-size: ${width}px; block-size: ${height}px"></div>`,
      );
      return root.querySelector('div')!;
    }

    it('shrinks a bottom sheet by 48px wide and 24px tall', () => {
      const el = box(400, 300);
      const {surface, content} = predictiveBackTransform(el, {
        kind: 'bottom-sheet',
      });
      expect(surface.scale).toBe(`${1 - 48 / 400} ${1 - 24 / 300}`);
      expect(surface.transformOrigin).toBe('50% 100%');
      // The content keeps its aspect ratio.
      expect(content!.scale).toBe(`1 ${(1 - 48 / 400) / (1 - 24 / 300)}`);
    });

    it('shrinks an edge surface toward its edge', () => {
      const el = box(360, 800);
      const {surface} = predictiveBackTransform(el, {
        kind: 'side',
        edge: 'end',
      });
      expect(surface.scale).toBe(`${1 - 24 / 360} ${1 - 48 / 800}`);
      expect(surface.transformOrigin).toBe('100% 50%');
      const start = predictiveBackTransform(el, {kind: 'side', edge: 'start'});
      expect(start.surface.transformOrigin).toBe('0% 50%');
    });

    // spec: layout-bidirectionality-rtl-612126, layout-bidirectionality-rtl-b55016
    it('mirrors the pivot in RTL', () => {
      const root = env.render(
        html`<div
          dir="rtl"
          style="inline-size: 360px; block-size: 800px"></div>`,
      );
      const el = root.querySelector('div')!;
      const {surface} = predictiveBackTransform(el, {
        kind: 'side',
        edge: 'start',
      });
      expect(surface.transformOrigin).toBe('100% 50%');
    });

    it('scales search to 90%', () => {
      const el = box(400, 800);
      const {surface} = predictiveBackTransform(el, {kind: 'search'});
      expect(surface.scale).toBe('0.9');
    });

    it('plays with the Compose predictive back easing and holds', () => {
      const el = box(400, 300);
      const motion = playPredictiveBack(el, {kind: 'bottom-sheet'})!;
      const timing = motion.animations[0].effect!.getTiming();
      expect(timing.easing).toBe(PREDICTIVE_BACK_EASING);
      expect(timing.fill).toBe('forwards');
      motion.cancel();
      expect(el.getAnimations().length).toBe(0);
    });
  });

  describe('<md-gb-bottom-sheet>', () => {
    async function setup(attrs = 'quick') {
      const root = env.render(html`
        <div style="position: relative; block-size: 600px">
          <md-gb-bottom-sheet modal ?quick=${attrs.includes('quick')}>
            <div style="block-size: 2000px">Tall content</div>
          </md-gb-bottom-sheet>
        </div>
      `);
      await env.waitForStability();
      const sheet = root.querySelector('md-gb-bottom-sheet')!;
      sheet.quick = true;
      await sheet.show();
      sheet.quick = attrs.includes('quick');
      return sheet as BottomSheetElement;
    }

    // spec: interaction-gestures-a6ed0c
    it('closes with reason back', async () => {
      const sheet = await setup();
      const reasons: string[] = [];
      sheet.addEventListener('closed', (e) => reasons.push(reasonOf(e)));
      await sheet.handleBack();
      expect(sheet.open).toBeFalse();
      expect(reasons).toEqual([CLOSE_REASONS.BACK]);
    });

    it('goes from expanded to partially expanded', async () => {
      const sheet = await setup();
      sheet.expand();
      await sheet.updateComplete;
      const stateChange = jasmine.createSpy('state-change');
      sheet.addEventListener('state-change', stateChange);
      await sheet.handleBack();
      expect(sheet.open).toBeTrue();
      expect(sheet.state).toBe(BOTTOM_SHEET_STATES.partiallyExpanded);
      expect(stateChange).toHaveBeenCalledTimes(1);
      await sheet.handleBack();
      expect(sheet.open).toBeFalse();
    });

    // spec: interaction-gestures-d00947
    it('stays open when the back close is canceled', async () => {
      const sheet = await setup();
      sheet.addEventListener('close', (e) => e.preventDefault());
      await sheet.handleBack();
      expect(sheet.open).toBeTrue();
    });

    it('plays the predictive back motion before closing', async () => {
      const sheet = await setup('');
      const dialog = dialogOf(sheet);
      const closed = jasmine.createSpy('closed');
      sheet.addEventListener('closed', closed);
      const done = sheet.handleBack();
      const [animation] = scaleAnimations(dialog);
      expect(animation).withContext('dialog scale animation').toBeDefined();
      const frames = (animation.effect as KeyframeEffect).getKeyframes();
      expect(frames[frames.length - 1]['transformOrigin']).toBe('50% 100%');
      const content = sheet.shadowRoot!.querySelector('.bottom-sheet-content')!;
      expect(scaleAnimations(content).length)
        .withContext('content counter-scale')
        .toBe(1);
      expect(closed).not.toHaveBeenCalled();
      sheet.quick = true;
      for (const a of [...dialog.getAnimations(), ...content.getAnimations()]) {
        a.finish();
      }
      await done;
      expect(closed).toHaveBeenCalledTimes(1);
      expect(scaleAnimations(dialog).length)
        .withContext('the motion is removed once closed')
        .toBe(0);
    });
  });

  describe('<md-gb-side-sheet>', () => {
    it('scales toward its edge and closes with reason back', async () => {
      const root = env.render(html`
        <md-gb-side-sheet modal headline="Filters"
          ><p>Content</p></md-gb-side-sheet
        >
      `);
      await env.waitForStability();
      const sheet = root.querySelector('md-gb-side-sheet') as SideSheetElement;
      sheet.quick = true;
      await sheet.show();
      sheet.quick = false;
      const dialog = dialogOf(sheet);
      let reason = '';
      sheet.addEventListener('close', (e) => {
        reason = reasonOf(e);
      });
      const done = sheet.handleBack();
      const [animation] = scaleAnimations(dialog);
      expect(animation).toBeDefined();
      const frames = (animation.effect as KeyframeEffect).getKeyframes();
      expect(frames[frames.length - 1]['transformOrigin']).toBe('100% 50%');
      sheet.quick = true;
      animation.finish();
      await done;
      expect(reason).toBe(CLOSE_REASONS.BACK);
      expect(sheet.open).toBeFalse();
    });

    it('keeps Escape (synthetic dialog cancel) as reason escape', async () => {
      const root = env.render(html`
        <md-gb-side-sheet modal quick><p>Content</p></md-gb-side-sheet>
      `);
      await env.waitForStability();
      const sheet = root.querySelector('md-gb-side-sheet') as SideSheetElement;
      await sheet.show();
      const closed = new Promise<string>((resolve) => {
        sheet.addEventListener('closed', (e) => resolve(reasonOf(e)));
      });
      dialogOf(sheet).dispatchEvent(new Event('cancel', {cancelable: true}));
      expect(await closed).toBe(CLOSE_REASONS.ESCAPE);
    });

    it('is in the top layer while modal, so nothing covers it', async () => {
      const root = env.render(html`
        <md-gb-side-sheet modal quick><p>Content</p></md-gb-side-sheet>
      `);
      await env.waitForStability();
      const sheet = root.querySelector('md-gb-side-sheet') as SideSheetElement;
      await sheet.show();
      expect(dialogOf(sheet).matches(':modal')).toBeTrue();
      await sheet.close();
    });
  });
});
