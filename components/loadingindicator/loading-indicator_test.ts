/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import './md-gb-loading-indicator.js';
import {LoadingIndicatorElement} from './loading-indicator-element.js';
import {
  DETERMINATE_INITIAL_PATH,
  INDETERMINATE_INITIAL_PATH,
} from './loading-indicator-paths.js';
import {
  LOADING_INDICATOR_CLASSES,
  loadingIndicatorClasses,
  setupLoadingIndicator,
} from './loading-indicator.js';
import loadingIndicatorStyles from './loading-indicator.cssresult.js';

describe('loading indicator', () => {
  let container: HTMLElement;

  beforeAll(() => {
    adoptStyles(document, [m3Styles, loadingIndicatorStyles]);
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  function indicator(classes: string, style = '') {
    container.innerHTML = `<div class="${classes}" style="${style}"></div>`;
    const el = container.firstElementChild as HTMLElement;
    setupLoadingIndicator(el);
    return el;
  }

  describe('class API', () => {
    it('returns classes for the state', () => {
      expect(loadingIndicatorClasses({contained: true, determinate: true})).toEqual({
        'loading-indicator': true,
        'loading-indicator-contained': true,
        'loading-indicator-determinate': true,
      });
    });

    it('adds a progressbar role and the animated shape', () => {
      const el = indicator(LOADING_INDICATOR_CLASSES.loadingIndicator);
      expect(el.getAttribute('role')).toBe('progressbar');
      const path = el.querySelector('.loading-indicator-shape > path')!;
      expect(path.getAttribute('d')).toBe(INDETERMINATE_INITIAL_PATH);
    });

    it('does not duplicate the shape or replace a role', () => {
      const el = indicator('loading-indicator');
      el.setAttribute('role', 'status');
      setupLoadingIndicator(el);
      expect(el.querySelectorAll('.loading-indicator-spin').length).toBe(1);
      expect(el.getAttribute('role')).toBe('status');
    });

    it('starts determinate indicators from the determinate shape', () => {
      const el = indicator('loading-indicator loading-indicator-determinate');
      const path = el.querySelector('path')!;
      expect(path.getAttribute('d')).toBe(DETERMINATE_INITIAL_PATH);
    });
  });

  describe('styles', () => {
    it('sizes the container and the active indicator from the spec', () => {
      const el = indicator('loading-indicator');
      const spin = el.querySelector<HTMLElement>('.loading-indicator-spin')!;
      expect(getComputedStyle(el).width).toBe('48px');
      expect(getComputedStyle(el).height).toBe('48px');
      expect(getComputedStyle(spin).width).toBe('38px');
    });

    it('has no container unless contained', () => {
      const plain = indicator('loading-indicator');
      expect(getComputedStyle(plain).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    });

    it('runs the generated morph, rotation and spin animations', () => {
      const el = indicator('loading-indicator');
      const spin = el.querySelector<HTMLElement>('.loading-indicator-spin')!;
      const svg = el.querySelector<SVGElement>('.loading-indicator-shape')!;
      const path = el.querySelector<SVGPathElement>('path')!;
      expect(getComputedStyle(spin).animationName).toBe('md-loading-indicator-spin');
      expect(getComputedStyle(svg).animationName).toBe('md-loading-indicator-rotate');
      expect(getComputedStyle(path).animationName).toBe('md-loading-indicator-morph');
    });

    it('scrubs the determinate morph and rotation with --progress', () => {
      const el = indicator(
        'loading-indicator loading-indicator-determinate',
        '--progress: 0.5',
      );
      const svg = el.querySelector<SVGElement>('.loading-indicator-shape')!;
      const path = el.querySelector<SVGPathElement>('path')!;
      expect(getComputedStyle(svg).rotate).toBe('-90deg');
      expect(getComputedStyle(path).animationName).toBe(
        'md-loading-indicator-determinate',
      );
      expect(getComputedStyle(path).animationPlayState).toBe('paused');
      expect(getComputedStyle(path).animationDelay).toBe('-0.5s');
    });
  });

  describe('<md-gb-loading-indicator>', () => {
    async function element(html: string) {
      container.innerHTML = html;
      const el = container.firstElementChild as LoadingIndicatorElement;
      await el.updateComplete;
      return el.shadowRoot!.querySelector<HTMLElement>('[part="indicator"]')!;
    }

    it('is an indeterminate progressbar by default', async () => {
      const inner = await element(
        '<md-gb-loading-indicator aria-label="Loading"></md-gb-loading-indicator>',
      );
      expect(inner.getAttribute('role')).toBe('progressbar');
      expect(inner.getAttribute('aria-label')).toBe('Loading');
      expect(inner.hasAttribute('aria-valuenow')).toBeFalse();
      expect(inner.classList.contains('loading-indicator-determinate')).toBeFalse();
    });

    it('is determinate when a value is set', async () => {
      const inner = await element(
        '<md-gb-loading-indicator value="0.25"></md-gb-loading-indicator>',
      );
      expect(inner.classList.contains('loading-indicator-determinate')).toBeTrue();
      expect(inner.getAttribute('aria-valuenow')).toBe('25');
      expect(inner.style.getPropertyValue('--progress')).toBe('0.25');
    });

    it('applies the contained variant', async () => {
      const inner = await element(
        '<md-gb-loading-indicator contained></md-gb-loading-indicator>',
      );
      expect(inner.classList.contains('loading-indicator-contained')).toBeTrue();
    });
  });
});
