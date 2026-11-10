/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../testing/environment.js';
import {adoptStyles} from '../../adopt-styles.js';
import {styles as m3Styles} from '../../m3.cssresult.js';

import transitionStyles from './md-motion-transitions.cssresult.js';
import {
  containerTransform,
  containerTransformFadeKeyframes,
  coplanar,
  enter,
  enterExitClasses,
  exit,
  FADE_THROUGH_THRESHOLD,
  fadeThrough,
  fadeThroughKeyframes,
  lateral,
  lateralKeyframes,
  parseTime,
  reducedKeyframes,
  scrollEnterExit,
  sharedAxis,
  sharedAxisKeyframes,
  supportsViewTransitions,
  TRANSITION_CLASSES,
  transitionTiming,
  VIEW_TRANSITION_NAMES,
} from './transitions.js';

adoptStyles(document, [m3Styles, transitionStyles]);

/** Finishes every running animation until `promise` settles. */
async function finishAll<T>(promise: Promise<T>): Promise<T> {
  let done = false;
  const result = promise.finally(() => {
    done = true;
  });
  for (let i = 0; i < 50 && !done; i++) {
    for (const animation of document.getAnimations()) {
      if (animation.effect?.getComputedTiming().iterations !== Infinity) {
        animation.finish();
      }
    }
    await new Promise<void>((resolve) => {
      queueMicrotask(resolve);
    });
  }
  return result;
}

function opacityAt(frames: Keyframe[], offset: number) {
  return frames.find((f) => f['offset'] === offset)?.['opacity'];
}

describe('motion transitions', () => {
  const env = new Environment();

  function setup(
    template = html`<div class="scope" style="inline-size: 200px">
      <p class="page">One</p>
    </div>`,
  ) {
    const root = env.render(template);
    return root;
  }

  describe('timing', () => {
    it('reads the spec durations and easings from the tokens', () => {
      expect(transitionTiming('container-transform')).toEqual({
        duration: 500,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
      });
      expect(transitionTiming('shared-axis').duration).toBe(450);
      expect(transitionTiming('fade-through').duration).toBe(450);
      expect(transitionTiming('lateral').duration).toBe(500);
      expect(transitionTiming('reduced').duration).toBe(200);
    });

    it('defines enter and exit timings from the suggested pairs', () => {
      const style = getComputedStyle(document.documentElement);
      const get = (name: string) =>
        style.getPropertyValue(`--md-transition-${name}`).trim();
      expect(get('enter-duration')).toBe('400ms');
      expect(get('enter-easing')).toBe('cubic-bezier(0.05, 0.7, 0.1, 1)');
      expect(get('exit-duration')).toBe('200ms');
      expect(get('exit-easing')).toBe('cubic-bezier(0.3, 0, 0.8, 0.15)');
    });

    it('applies overrides', () => {
      expect(
        transitionTiming('lateral', document.documentElement, {
          duration: 10,
          easing: 'linear',
        }),
      ).toEqual({duration: 10, easing: 'linear'});
    });

    it('parses CSS times', () => {
      expect(parseTime('450ms')).toBe(450);
      expect(parseTime(' 0.5s ')).toBe(500);
      expect(parseTime('')).toBeUndefined();
    });
  });

  describe('keyframes', () => {
    it('forward slides in from the end and fades through', () => {
      const {out, in: incoming} = sharedAxisKeyframes('forward');
      expect(incoming[0]['translate']).toBe('30px 0');
      expect(incoming.slice(-1)[0]['translate']).toBe('0px 0');
      expect(out.slice(-1)[0]['translate']).toBe('-30px 0');
      expect(opacityAt(out, FADE_THROUGH_THRESHOLD)).toBe(0);
      expect(opacityAt(incoming, FADE_THROUGH_THRESHOLD)).toBe(0);
      expect(opacityAt(incoming, 1)).toBe(1);
    });

    it('backward slides in from the start', () => {
      const {out, in: incoming} = sharedAxisKeyframes('backward');
      expect(incoming[0]['translate']).toBe('-30px 0');
      expect(out.slice(-1)[0]['translate']).toBe('30px 0');
    });

    it('mirrors the x axis in RTL', () => {
      const {in: incoming} = sharedAxisKeyframes('forward', {rtl: true});
      expect(incoming[0]['translate']).toBe('-30px 0');
    });

    it('supports the y and z axes', () => {
      expect(
        sharedAxisKeyframes('forward', {axis: 'y'}).in[0]['translate'],
      ).toBe('0 30px');
      const z = sharedAxisKeyframes('forward', {axis: 'z'});
      expect(z.in[0]['scale']).toBe('0.8');
      expect(z.out.slice(-1)[0]['scale']).toBe('1.1');
      const back = sharedAxisKeyframes('backward', {axis: 'z'});
      expect(back.in[0]['scale']).toBe('1.1');
      expect(back.out.slice(-1)[0]['scale']).toBe('0.8');
    });

    it('lateral slides the full width without fading', () => {
      const next = lateralKeyframes('next');
      expect(next.out.slice(-1)[0]['translate']).toBe('-100% 0');
      expect(next.in[0]['translate']).toBe('100% 0');
      expect(JSON.stringify(next)).not.toContain('opacity');
      expect(lateralKeyframes('previous').in[0]['translate']).toBe('-100% 0');
      expect(lateralKeyframes('next', {rtl: true}).in[0]['translate']).toBe(
        '-100% 0',
      );
    });

    it('fade through scales the incoming screen from 92%', () => {
      const {out, in: incoming} = fadeThroughKeyframes();
      expect(incoming[0]['scale']).toBe('0.92');
      expect(JSON.stringify(out)).not.toContain('scale');
    });

    it('reduced motion only fades', () => {
      const {out, in: incoming} = reducedKeyframes();
      expect(JSON.stringify([out, incoming])).not.toMatch(/translate|scale/);
    });

    it('container transform fades early on enter and late on return', () => {
      const enterFade = containerTransformFadeKeyframes('enter');
      expect(opacityAt(enterFade.out, 0.25 * FADE_THROUGH_THRESHOLD)).toBe(0);
      expect(opacityAt(enterFade.in, 0.25)).toBe(1);
      const returnFade = containerTransformFadeKeyframes('return');
      expect(opacityAt(returnFade.out, 0.6)).toBe(1);
      expect(opacityAt(returnFade.in, 0.9)).toBe(1);
    });
  });

  describe('Web Animations fallback', () => {
    it('sharedAxis() animates a copy of the old content out', async () => {
      const root = setup();
      const scope = root.querySelector<HTMLElement>('.scope')!;
      let ghostDuringAnimation: Element | null = null;
      const done = sharedAxis(
        'forward',
        () => {
          scope.querySelector('.page')!.textContent = 'Two';
        },
        {scope, viewTransition: false, reducedMotion: false},
      );
      await Promise.resolve();
      await Promise.resolve();
      ghostDuringAnimation = scope.nextElementSibling;
      const incoming = scope.getAnimations();
      expect(incoming.length).toBe(1);
      expect((incoming[0].effect as KeyframeEffect).getTiming().duration).toBe(
        450,
      );
      expect(ghostDuringAnimation?.textContent).toContain('One');
      expect(ghostDuringAnimation?.getAttribute('aria-hidden')).toBe('true');
      await finishAll(done);
      expect(scope.textContent).toContain('Two');
      expect(scope.nextElementSibling).toBeNull();
    });

    it('lateral() and fadeThrough() resolve after updating', async () => {
      const root = setup();
      const scope = root.querySelector<HTMLElement>('.scope')!;
      const update = jasmine.createSpy('update');
      await finishAll(lateral('next', update, {scope, viewTransition: false}));
      await finishAll(fadeThrough(update, {scope, viewTransition: false}));
      expect(update).toHaveBeenCalledTimes(2);
    });

    it('uses a quick fade with reduced motion', async () => {
      const root = setup();
      const scope = root.querySelector<HTMLElement>('.scope')!;
      const done = sharedAxis('forward', () => {}, {
        scope,
        viewTransition: false,
        reducedMotion: true,
      });
      await Promise.resolve();
      await Promise.resolve();
      const [animation] = scope.getAnimations();
      const effect = animation.effect as KeyframeEffect;
      expect(effect.getTiming().duration).toBe(200);
      expect(JSON.stringify(effect.getKeyframes())).not.toMatch(
        /translate|scale/,
      );
      await finishAll(done);
    });

    it('containerTransform() morphs a container between the bounds', async () => {
      const root = setup(html`
        <div
          class="from"
          style="inline-size: 100px; block-size: 50px; border-radius: 12px; background-color: rgb(255, 0, 0)"
        >
          Card
        </div>
        <div
          class="to"
          hidden
          style="inline-size: 300px; block-size: 200px; border-radius: 28px; background-color: rgb(0, 0, 255)"
        >
          Details
        </div>
      `);
      const from = root.querySelector<HTMLElement>('.from')!;
      const to = root.querySelector<HTMLElement>('.to')!;
      const done = containerTransform(from, to, {
        viewTransition: false,
        reducedMotion: false,
        update: () => {
          to.hidden = false;
        },
      });
      await Promise.resolve();
      await Promise.resolve();
      const container = document.querySelector<HTMLElement>(
        'body > [data-md-transition="container-transform"]',
      );
      expect(container).withContext('morphing container').not.toBeNull();
      expect(container!.style.position).toBe('fixed');
      expect(container!.getAttribute('aria-hidden')).toBe('true');
      expect(to.style.visibility).toBe('hidden');
      const [morph] = container!.getAnimations();
      const [first, last] = (morph.effect as KeyframeEffect).getKeyframes();
      expect(first['width']).toBe('100px');
      expect(first['backgroundColor']).toBe('rgb(255, 0, 0)');
      expect(first['borderRadius']).toBe('12px');
      expect(last['width']).toBe('300px');
      expect(last['backgroundColor']).toBe('rgb(0, 0, 255)');
      expect((morph.effect as KeyframeEffect).getTiming().duration).toBe(500);
      await finishAll(done);
      expect(container!.isConnected).toBeFalse();
      expect(to.style.visibility).toBe('');
      expect(from.style.visibility).toBe('');
    });

    it('containerTransform() accepts a function for the end element', async () => {
      const root = setup(html`<div class="from">Card</div>`);
      const from = root.querySelector<HTMLElement>('.from')!;
      let created: HTMLElement | undefined;
      await finishAll(
        containerTransform(from, () => created, {
          viewTransition: false,
          update: () => {
            created = document.createElement('div');
            root.append(created);
          },
        }),
      );
      expect(created?.isConnected).toBeTrue();
    });
  });

  describe('View Transitions', () => {
    beforeEach(() => {
      if (!supportsViewTransitions()) {
        pending('View Transitions are not supported');
      }
    });

    it('names the scope and marks the root while running', async () => {
      const root = setup();
      const scope = root.querySelector<HTMLElement>('.scope')!;
      const html = document.documentElement;
      let pattern: string | undefined;
      let name = '';
      const done = sharedAxis(
        'backward',
        () => {
          pattern = html.dataset['mdTransition'];
          name = scope.style.getPropertyValue('view-transition-name');
        },
        {scope, reducedMotion: false},
      );
      await finishAll(done);
      expect(pattern).toBe('shared-axis');
      expect(name).toBe(VIEW_TRANSITION_NAMES.scope);
      expect(html.dataset['mdTransition']).toBeUndefined();
      expect(scope.style.getPropertyValue('view-transition-name')).toBe('');
    });

    it('moves the container transform name from the start to the end', async () => {
      const root = setup(html`
        <div class="from">Card</div>
        <div class="to" hidden>Details</div>
      `);
      const from = root.querySelector<HTMLElement>('.from')!;
      const to = root.querySelector<HTMLElement>('.to')!;
      const before = from.style.getPropertyValue('view-transition-name');
      const done = containerTransform(from, to, {
        update: () => {
          to.hidden = false;
          from.hidden = true;
        },
      });
      const during = from.style.getPropertyValue('view-transition-name');
      await finishAll(done);
      expect(before).toBe('');
      expect(during).toBe(VIEW_TRANSITION_NAMES.containerTransform);
      expect(to.style.getPropertyValue('view-transition-name')).toBe('');
      expect(document.documentElement.dataset['mdTransition']).toBeUndefined();
    });
    it('morphs the container group bounds, shape and color', async () => {
      const root = setup(html`
        <div
          class="from"
          style="inline-size: 100px; block-size: 50px; border-radius: 12px; background-color: rgb(255, 0, 0)"
        >
          Card
        </div>
        <div
          class="to"
          hidden
          style="inline-size: 300px; block-size: 200px; border-radius: 28px; background-color: rgb(0, 0, 255)"
        >
          Details
        </div>
      `);
      const from = root.querySelector<HTMLElement>('.from')!;
      const to = root.querySelector<HTMLElement>('.to')!;
      const name = VIEW_TRANSITION_NAMES.containerTransform;
      let groupAnimations: Animation[] = [];
      const done = containerTransform(from, to, {
        reducedMotion: false,
        update: () => {
          from.hidden = true;
          to.hidden = false;
        },
      });
      for (let i = 0; i < 60 && !groupAnimations.length; i++) {
        // Waits one real frame (the test clock is mocked).
        await document.body.animate([{}, {}], {duration: 16}).finished;
        groupAnimations = document
          .getAnimations()
          .filter(
            (a) =>
              (a.effect as KeyframeEffect).pseudoElement ===
              `::view-transition-group(${name})`,
          );
      }
      expect(groupAnimations.length)
        .withContext('container transform group animations')
        .toBeGreaterThan(0);
      await finishAll(done);
      {
        const names = groupAnimations.map(
          (a) => (a as CSSAnimation).animationName ?? 'js',
        );
        expect(names).toContain(`-ua-view-transition-group-anim-${name}`);
        const morph = groupAnimations.find(
          (a) => !(a instanceof CSSAnimation),
        )!;
        const [first, last] = (morph.effect as KeyframeEffect).getKeyframes();
        expect(first['backgroundColor']).toBe('rgb(255, 0, 0)');
        expect(last['borderRadius']).toBe('28px');
      }
    });

    it('falls back to Web Animations inside shadow DOM', async () => {
      const root = setup(html`<div class="host"></div>`);
      const host = root.querySelector('.host')!;
      const shadow = host.attachShadow({mode: 'open'});
      shadow.innerHTML = '<div class="scope">One</div>';
      const scope = shadow.querySelector('.scope')!;
      const done = fadeThrough(() => {}, {scope, reducedMotion: false});
      expect(document.documentElement.dataset['mdTransition']).toBeUndefined();
      await Promise.resolve();
      await Promise.resolve();
      expect(scope.getAnimations().length).toBe(1);
      for (const a of shadow.getAnimations()) a.finish();
      await done;
    });
  });

  describe('enter and exit', () => {
    function setupBox() {
      const root = setup(html`<div class="box" hidden>Menu</div>`);
      return root.querySelector<HTMLElement>('.box')!;
    }

    it('enter() shows the element with the enter classes', async () => {
      const box = setupBox();
      const done = enter(box, {origin: 'top'});
      expect(box.hidden).toBeFalse();
      expect(box.classList).toContain(TRANSITION_CLASSES.enter);
      expect(box.classList).toContain(TRANSITION_CLASSES.fromTop);
      const names = box
        .getAnimations()
        .map((a) => (a as CSSAnimation).animationName);
      expect(names).toEqual(['md-transition-clip-in', 'md-transition-fade-in']);
      await finishAll(done);
    });

    it('exit() keeps the element invisible when it ends', async () => {
      const box = setupBox();
      await finishAll(enter(box));
      await finishAll(exit(box, {origin: 'bottom'}));
      expect(box.classList).toContain(TRANSITION_CLASSES.exit);
      expect(box.classList).not.toContain(TRANSITION_CLASSES.enter);
      expect(getComputedStyle(box).opacity).toBe('0');
    });

    it('slides without fading beyond screen bounds', async () => {
      const box = setupBox();
      const done = enter(box, {style: 'slide'});
      expect(box.classList).toContain(TRANSITION_CLASSES.fromBottom);
      const names = box
        .getAnimations()
        .map((a) => (a as CSSAnimation).animationName);
      expect(names).toEqual(['md-transition-slide-in']);
      await finishAll(done);
    });

    it('only fades with reduced motion', async () => {
      const box = setupBox();
      const done = enter(box, {reducedMotion: true});
      const [animation] = box.getAnimations() as CSSAnimation[];
      expect(animation.animationName).toBe('md-transition-fade-in');
      expect(animation.effect?.getComputedTiming().duration).toBe(200);
      await finishAll(done);
    });

    it('enterExitClasses() maps the options to classes', () => {
      expect(
        enterExitClasses('exit', {
          origin: 'end',
          style: 'slide',
          temporary: true,
        }),
      ).toEqual(
        jasmine.objectContaining({
          [TRANSITION_CLASSES.exit]: true,
          [TRANSITION_CLASSES.enter]: false,
          [TRANSITION_CLASSES.fromEnd]: true,
          [TRANSITION_CLASSES.slide]: true,
          [TRANSITION_CLASSES.temporary]: true,
        }),
      );
    });
  });

  describe('scroll enter and exit', () => {
    function setupScroller() {
      const root = setup(html`<div
        class="scroller"
        style="block-size: 100px; overflow: auto"
      >
        <div class="bar" style="position: sticky; top: 0">
          <button>Action</button>
        </div>
        <div style="block-size: 1000px"></div>
      </div>`);
      return {
        scroller: root.querySelector<HTMLElement>('.scroller')!,
        bar: root.querySelector<HTMLElement>('.bar')!,
      };
    }
    function scrollTo(scroller: HTMLElement, top: number) {
      scroller.scrollTop = top;
      scroller.dispatchEvent(new Event('scroll'));
    }

    // spec: motion-transitions-31df78
    it('slides the element off the screen edge scrolling down and back scrolling up', async () => {
      const {scroller, bar} = setupScroller();
      const handle = scrollEnterExit(bar, {
        target: scroller,
        reducedMotion: false,
      });
      scrollTo(scroller, 50);
      expect(handle.hidden).toBeTrue();
      expect(bar.inert).toBeTrue();
      expect(bar.classList).toContain(TRANSITION_CLASSES.exit);
      expect(bar.classList).toContain(TRANSITION_CLASSES.slide);
      expect(bar.classList).toContain(TRANSITION_CLASSES.fromTop);
      scrollTo(scroller, 20);
      expect(handle.hidden).toBeFalse();
      expect(bar.inert).toBeFalse();
      expect(bar.classList).toContain(TRANSITION_CLASSES.enter);
      handle.destroy();
      expect(bar.classList).not.toContain(TRANSITION_CLASSES.enter);
    });

    // spec: motion-transitions-31df78
    it('reveals at the top and ignores scrolls below the threshold', () => {
      const {scroller, bar} = setupScroller();
      const handle = scrollEnterExit(bar, {target: scroller, threshold: 20});
      scrollTo(scroller, 10);
      expect(handle.hidden).toBeFalse();
      scrollTo(scroller, 60);
      expect(handle.hidden).toBeTrue();
      scrollTo(scroller, 0);
      expect(handle.hidden).toBeFalse();
      handle.destroy();
    });

    // spec: motion-transitions-31df78
    it('stays visible while focus is inside and reveals on focus', () => {
      const {scroller, bar} = setupScroller();
      const handle = scrollEnterExit(bar, {target: scroller});
      bar.dispatchEvent(new FocusEvent('focusin'));
      scrollTo(scroller, 80);
      expect(handle.hidden).toBeFalse();
      bar.dispatchEvent(new FocusEvent('focusout', {relatedTarget: null}));
      scrollTo(scroller, 200);
      expect(handle.hidden).toBeTrue();
      bar.dispatchEvent(new FocusEvent('focusin'));
      expect(handle.hidden).toBeFalse();
      handle.destroy();
    });

    // spec: motion-transitions-31df78
    it('fades instead of sliding with reduced motion', () => {
      const {scroller, bar} = setupScroller();
      const handle = scrollEnterExit(bar, {
        target: scroller,
        reducedMotion: true,
      });
      scrollTo(scroller, 50);
      expect(bar.classList).toContain(TRANSITION_CLASSES.reduced);
      const [animation] = bar.getAnimations() as CSSAnimation[];
      expect(animation.animationName).toBe('md-transition-fade-out');
      handle.destroy();
    });

    it('stops listening after destroy()', () => {
      const {scroller, bar} = setupScroller();
      const handle = scrollEnterExit(bar, {target: scroller});
      handle.destroy();
      scrollTo(scroller, 80);
      expect(handle.hidden).toBeFalse();
    });
  });

  describe('coplanar enter and exit', () => {
    function setupRow() {
      const root = setup(html`<div
        class="row"
        style="display: flex; inline-size: 400px"
      >
        <div class="main" style="flex: 1">Main</div>
        <div class="panel" hidden style="inline-size: 120px; flex: none">
          Panel
        </div>
      </div>`);
      return {
        main: root.querySelector<HTMLElement>('.main')!,
        panel: root.querySelector<HTMLElement>('.panel')!,
      };
    }

    // spec: motion-transitions-2754f3
    it('shrinks the content beside it while opening and grows it back closing', async () => {
      const {main, panel} = setupRow();
      expect(main.getBoundingClientRect().width).toBe(400);
      const opened = coplanar(panel, true, {reducedMotion: false});
      expect(panel.hidden).toBeFalse();
      const [animation] = panel.getAnimations();
      animation.pause();
      animation.currentTime =
        (animation.effect!.getComputedTiming().endTime as number) / 2;
      const mid = main.getBoundingClientRect().width;
      expect(mid).toBeLessThan(400);
      expect(mid).toBeGreaterThan(280);
      animation.play();
      await finishAll(opened);
      expect(main.getBoundingClientRect().width).toBe(280);

      await finishAll(coplanar(panel, false, {reducedMotion: false}));
      expect(panel.hidden).toBeTrue();
      expect(main.getBoundingClientRect().width).toBe(400);
      expect(panel.style.overflow).toBe('');
    });

    // spec: motion-transitions-2754f3
    it('uses the enter and exit timings', () => {
      const {panel} = setupRow();
      void coplanar(panel, true, {reducedMotion: false});
      const enterTiming = panel.getAnimations()[0].effect!.getComputedTiming();
      expect(enterTiming.duration).toBe(400);
      void coplanar(panel, false, {reducedMotion: false});
      const exitTiming = panel.getAnimations()[0].effect!.getComputedTiming();
      expect(exitTiming.duration).toBe(200);
    });

    // spec: motion-transitions-2754f3
    it('only fades with reduced motion, changing the size at once', async () => {
      const {main, panel} = setupRow();
      const done = coplanar(panel, true, {reducedMotion: true});
      expect(main.getBoundingClientRect().width).toBe(280);
      const [animation] = panel.getAnimations();
      expect(
        (animation.effect as KeyframeEffect).getKeyframes()[0]['opacity'],
      ).toBe('0');
      await finishAll(done);
    });
  });
});
