/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import './md-gb-progress.js';
import {ProgressElement} from './progress-element.js';
import {
  CIRCULAR_VIEW_BOX,
  LINEAR_PATH_LENGTH,
  PROGRESS_PROPERTIES,
} from './progress-paths.js';
import {
  PROGRESS_CLASSES,
  progressClasses,
  setupProgress,
} from './progress.js';
import progressStyles from './progress.cssresult.js';

describe('progress', () => {
  let container: HTMLElement;

  beforeAll(() => {
    adoptStyles(document, [m3Styles, progressStyles]);
  });

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '200px';
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  function indicator(classes: string, style = '') {
    container.innerHTML = `<div class="${classes}" style="${style}"></div>`;
    const el = container.firstElementChild as HTMLElement;
    setupProgress(el);
    return el;
  }

  function part<T extends Element = HTMLElement>(el: Element, selector: string) {
    return el.querySelector(selector) as T;
  }

  function px(value: string) {
    return Math.round(parseFloat(value) * 100) / 100;
  }

  describe('class API', () => {
    it('returns classes for the state', () => {
      expect(
        progressClasses({circular: true, wavy: true, determinate: true}),
      ).toEqual({
        'progress': true,
        'progress-circular': true,
        'progress-wavy': true,
        'progress-determinate': true,
      });
      expect(progressClasses()).toEqual({
        'progress': true,
        'progress-circular': false,
        'progress-wavy': false,
        'progress-determinate': false,
      });
    });

    it('adds a progressbar role and the indicator parts', () => {
      const el = indicator(PROGRESS_CLASSES.progress);
      expect(el.getAttribute('role')).toBe('progressbar');
      const parts = part(el, '.progress-container');
      expect(parts.getAttribute('aria-hidden')).toBe('true');
      expect(parts.querySelectorAll('.progress-track').length).toBe(3);
      expect(parts.querySelectorAll('.progress-wave > path').length).toBe(2);
      expect(
        part(el, '.progress-wave > path').getAttribute('pathLength'),
      ).toBe(String(LINEAR_PATH_LENGTH));
      expect(part(el, '.progress-stop')).not.toBeNull();
      expect(part(el, '.progress-ring').getAttribute('viewBox')).toBe(
        CIRCULAR_VIEW_BOX,
      );
      expect(part(el, '.progress-ring > circle')).not.toBeNull();
    });

    it('does not duplicate the parts or replace a role', () => {
      const el = indicator('progress');
      el.setAttribute('role', 'status');
      setupProgress(el);
      expect(el.querySelectorAll('.progress-container').length).toBe(1);
      expect(el.getAttribute('role')).toBe('status');
    });

    it('registers the animated custom properties', () => {
      indicator('progress');
      const probe = document.createElement('div');
      container.append(probe);
      for (const {name, initialValue} of PROGRESS_PROPERTIES) {
        expect(getComputedStyle(probe).getPropertyValue(name))
          .withContext(name)
          .toBe(initialValue);
      }
    });
  });

  describe('linear styles', () => {
    it('sizes a wavy indicator from the spec', () => {
      const el = indicator(
        'progress progress-wavy progress-determinate',
        '--progress: 0.5',
      );
      expect(getComputedStyle(el).height).toBe('10px');
      expect(getComputedStyle(el).width).toBe('200px');
      const track = part(el, '.progress-track-1');
      expect(getComputedStyle(track).height).toBe('4px');
    });

    it('is flat and 4px tall by default', () => {
      const el = indicator('progress progress-determinate', '--progress: 0.5');
      expect(getComputedStyle(el).height).toBe('4px');
      expect(getComputedStyle(part(el, '.progress-active-1')).d).toContain(
        'Q 10 0 20 0',
      );
    });

    it('uses the indeterminate wavelength when wavy', () => {
      const el = indicator('progress progress-wavy');
      expect(getComputedStyle(part(el, '.progress-active-1')).d).toContain(
        'Q 5 6 10 0',
      );
    });

    it('uses the spec colors', () => {
      const el = indicator('progress progress-determinate', '--progress: 0.5');
      const probe = document.createElement('div');
      probe.style.color = 'var(--md-sys-color-primary)';
      probe.style.backgroundColor = 'var(--md-sys-color-secondary-container)';
      container.append(probe);
      const primary = getComputedStyle(probe).color;
      const secondaryContainer = getComputedStyle(probe).backgroundColor;
      expect(getComputedStyle(part(el, '.progress-active-1')).stroke).toBe(
        primary,
      );
      expect(
        getComputedStyle(part(el, '.progress-track-1')).backgroundColor,
      ).toBe(secondaryContainer);
      expect(getComputedStyle(part(el, '.progress-stop')).backgroundColor).toBe(
        primary,
      );
    });

    it('draws the active indicator to the progress, then a gap and the track', () => {
      const el = indicator('progress progress-determinate', '--progress: 0.5');
      const active = part(el, '.progress-active-1');
      // From the start cap (2px) to the head (100px).
      expect(px(getComputedStyle(active).strokeDasharray)).toBe(98);
      expect(getComputedStyle(active).strokeWidth).toBe('4px');
      // The track starts after the head, the gap (4px) and both caps (4px),
      // minus its own cap.
      const track = part(el, '.progress-track-1');
      expect(px(getComputedStyle(track).left)).toBe(106);
      // ...and ends a cap before the end (200 - 2 + 2).
      expect(px(getComputedStyle(track).left) + px(getComputedStyle(track).width)).toBe(200);
    });

    it('shows the stop indicator at the end of the track', () => {
      const el = indicator('progress progress-determinate', '--progress: 0.5');
      const stop = part(el, '.progress-stop');
      expect(getComputedStyle(stop).width).toBe('4px');
      expect(getComputedStyle(stop).height).toBe('4px');
      expect(getComputedStyle(stop).right).toBe('0px');
    });

    it('shrinks the stop indicator when progress reaches it', () => {
      const el = indicator('progress progress-determinate', '--progress: 1');
      expect(getComputedStyle(part(el, '.progress-stop')).width).toBe('0px');
    });

    it('hides the active indicator at 0 and shows a dot just after', () => {
      const zero = indicator('progress progress-determinate', '--progress: 0');
      expect(getComputedStyle(part(zero, '.progress-active-1')).strokeWidth).toBe(
        '0px',
      );
      const dot = indicator('progress progress-determinate', '--progress: 0.001');
      const active = part(dot, '.progress-active-1');
      expect(getComputedStyle(active).strokeWidth).toBe('4px');
      expect(px(getComputedStyle(active).strokeDasharray)).toBe(0);
    });

    it('flattens the wave near 0% and 100%', () => {
      const flat = indicator(
        'progress progress-wavy progress-determinate',
        '--progress: 0.05',
      );
      const flatD = getComputedStyle(part(flat, '.progress-active-1')).d;
      const wavy = indicator(
        'progress progress-wavy progress-determinate',
        '--progress: 0.5',
      );
      const wavyD = getComputedStyle(part(wavy, '.progress-active-1')).d;
      expect(flatD).toContain('Q 10 0 20 0');
      expect(wavyD).toContain('Q 10 6 20 0');
    });

    it('runs the wave and indeterminate line animations', () => {
      const el = indicator('progress');
      const names = getComputedStyle(part(el, '.progress-container')).animationName;
      expect(names).toBe(
        'md-progress-linear-head-1, md-progress-linear-tail-1, ' +
          'md-progress-linear-head-2, md-progress-linear-tail-2, ' +
          'md-progress-wave',
      );
      expect(getComputedStyle(part(el, '.progress-stop')).display).toBe('none');
      expect(getComputedStyle(part(el, '.progress-ring')).display).toBe('none');
    });

    it('only draws one line when determinate', () => {
      const el = indicator('progress progress-determinate', '--progress: 0.5');
      expect(getComputedStyle(part(el, '.progress-container')).animationName).toBe(
        'md-progress-wave',
      );
      for (const selector of ['.progress-active-2', '.progress-track-2', '.progress-track-3']) {
        expect(getComputedStyle(part(el, selector)).display)
          .withContext(selector)
          .toBe('none');
      }
    });
  });

  describe('circular styles', () => {
    it('sizes a wavy indicator from the spec', () => {
      const el = indicator(
        'progress progress-circular progress-wavy progress-determinate',
      );
      expect(getComputedStyle(el).width).toBe('48px');
      expect(getComputedStyle(el).height).toBe('48px');
      const track = part(el, '.progress-ring-track');
      // (48 - 4) / 2
      expect(getComputedStyle(track).r).toBe('22px');
      expect(getComputedStyle(track).strokeWidth).toBe('4px');
    });

    it('is flat and 40px by default', () => {
      const el = indicator('progress progress-circular progress-determinate');
      expect(getComputedStyle(el).width).toBe('40px');
      expect(getComputedStyle(part(el, '.progress-ring-track')).r).toBe('18px');
    });

    it('draws the progress along the path and the track after a gap', () => {
      const el = indicator(
        'progress progress-circular progress-wavy progress-determinate',
        '--progress: 0.25',
      );
      const active = part(el, '.progress-ring .progress-active');
      // pathLength is 100.
      const dashes = getComputedStyle(active).strokeDasharray.match(/[\d.]+/g);
      expect(dashes).toEqual(['25', '75']);
      const track = part(el, '.progress-ring-track');
      const c = 2 * Math.PI * 22;
      // Track from the progress end + gap + caps (8px) to 8px before the start.
      expect(px(getComputedStyle(track).strokeDashoffset)).toBe(
        Math.round(-(0.25 * c + 8) * 100) / 100,
      );
      expect(px(getComputedStyle(track).strokeDasharray)).toBeCloseTo(
        c - 16 - 0.25 * c,
        1,
      );
    });

    it('runs the indeterminate rotations, sweep and wave', () => {
      const el = indicator('progress progress-circular progress-wavy');
      expect(getComputedStyle(part(el, '.progress-container')).animationName).toBe(
        'md-progress-circular-rotate, md-progress-circular-sweep, md-progress-wave',
      );
      expect(getComputedStyle(part(el, '.progress-ring')).animationName).toBe(
        'md-progress-circular-rotate-steps',
      );
      for (const selector of ['.progress-wave', '.progress-track-1', '.progress-stop']) {
        expect(getComputedStyle(part(el, selector)).display)
          .withContext(selector)
          .toBe('none');
      }
    });
  });

  describe('<md-gb-progress>', () => {
    async function element(html: string) {
      container.innerHTML = html;
      const el = container.firstElementChild as ProgressElement;
      await el.updateComplete;
      return el.shadowRoot!.querySelector<HTMLElement>('[part="indicator"]')!;
    }

    it('is an indeterminate progressbar by default', async () => {
      const inner = await element(
        '<md-gb-progress aria-label="Loading"></md-gb-progress>',
      );
      expect(inner.getAttribute('role')).toBe('progressbar');
      expect(inner.getAttribute('aria-label')).toBe('Loading');
      expect(inner.hasAttribute('aria-valuenow')).toBeFalse();
      expect(inner.hasAttribute('aria-valuemin')).toBeFalse();
      expect(inner.classList.contains('progress-determinate')).toBeFalse();
    });

    it('is determinate when a value is set', async () => {
      const inner = await element('<md-gb-progress value="0.25"></md-gb-progress>');
      expect(inner.classList.contains('progress-determinate')).toBeTrue();
      expect(inner.getAttribute('aria-valuemin')).toBe('0');
      expect(inner.getAttribute('aria-valuemax')).toBe('100');
      expect(inner.getAttribute('aria-valuenow')).toBe('25');
      expect(inner.style.getPropertyValue('--progress')).toBe('0.25');
    });

    it('draws a wavy determinate indicator in its shadow root', async () => {
      const inner = await element(
        '<md-gb-progress wavy value="0.5" style="width: 200px"></md-gb-progress>',
      );
      const active = inner.querySelector<SVGPathElement>('.progress-active-1')!;
      expect(getComputedStyle(active).d).toContain('Q 10 6 20 0');
      expect(px(getComputedStyle(active).strokeDasharray)).toBe(98);
    });

    it('clamps the value', async () => {
      const inner = await element('<md-gb-progress value="1.5"></md-gb-progress>');
      expect(inner.getAttribute('aria-valuenow')).toBe('100');
    });

    it('is flat by default', async () => {
      const inner = await element('<md-gb-progress circular></md-gb-progress>');
      expect(inner.classList.contains('progress-wavy')).toBeFalse();
      expect(getComputedStyle(inner).width).toBe('40px');
    });

    it('applies the circular and wavy variants', async () => {
      const inner = await element(
        '<md-gb-progress circular wavy></md-gb-progress>',
      );
      expect(inner.classList.contains('progress-circular')).toBeTrue();
      expect(inner.classList.contains('progress-wavy')).toBeTrue();
      expect(getComputedStyle(inner).width).toBe('48px');
    });

    it('animates in its shadow root', async () => {
      const inner = await element('<md-gb-progress></md-gb-progress>');
      const parts = inner.querySelector<HTMLElement>('.progress-container')!;
      expect(getComputedStyle(parts).animationName).toContain(
        'md-progress-linear-head-1',
      );
      // Registered (numeric) values interpolate instead of flipping.
      const head = Number(
        getComputedStyle(parts).getPropertyValue('--_md-progress-head-1'),
      );
      expect(Number.isNaN(head)).toBeFalse();
    });
  });
});
