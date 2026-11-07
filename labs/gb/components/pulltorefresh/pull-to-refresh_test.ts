/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, render} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import './md-gb-pull-to-refresh.js';
import {
  PULL_TO_REFRESH_CLASSES,
  PULL_TO_REFRESH_THRESHOLD_PX,
  pullToRefresh,
  pullToRefreshArrow,
  pullToRefreshClasses,
  pullToRefreshOffset,
} from './pull-to-refresh.js';
import pullToRefreshStyles from './pull-to-refresh.cssresult.js';
import {type PullToRefreshElement} from './pull-to-refresh-element.js';

adoptStyles(document, [m3Styles, pullToRefreshStyles]);

/** Dispatches a touch pointer event. */
function pointer(type: string, target: EventTarget, y: number, x = 100) {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      pointerId: 1,
      pointerType: 'touch',
      isPrimary: true,
      clientX: x,
      clientY: y,
    }),
  );
}

/** Presses at `from`, moves to each point, and optionally releases. */
function pull(target: EventTarget, from: number, to: number[], release = true) {
  pointer('pointerdown', target, from);
  for (const y of to) {
    pointer('pointermove', target, y);
  }
  if (release) {
    pointer('pointerup', target, to[to.length - 1]);
  }
}

describe('pull-to-refresh helpers', () => {
  it('returns classes', () => {
    expect(pullToRefreshClasses()).toEqual({
      [PULL_TO_REFRESH_CLASSES.pullToRefresh]: true,
      [PULL_TO_REFRESH_CLASSES.pullToRefreshCircular]: false,
      [PULL_TO_REFRESH_CLASSES.pullToRefreshPulling]: false,
      [PULL_TO_REFRESH_CLASSES.pullToRefreshRefreshing]: false,
      [PULL_TO_REFRESH_CLASSES.pullToRefreshDisabled]: false,
    });
    expect(
      pullToRefreshClasses({
        indicator: 'circular',
        pulling: true,
        refreshing: true,
        disabled: true,
      }),
    ).toEqual({
      [PULL_TO_REFRESH_CLASSES.pullToRefresh]: true,
      [PULL_TO_REFRESH_CLASSES.pullToRefreshCircular]: true,
      [PULL_TO_REFRESH_CLASSES.pullToRefreshPulling]: true,
      [PULL_TO_REFRESH_CLASSES.pullToRefreshRefreshing]: true,
      [PULL_TO_REFRESH_CLASSES.pullToRefreshDisabled]: true,
    });
  });

  it('offsets the indicator by half the pull up to the threshold', () => {
    expect(pullToRefreshOffset(0, 80)).toBe(0);
    expect(pullToRefreshOffset(100, 80)).toBe(50);
    expect(pullToRefreshOffset(160, 80)).toBe(80);
    expect(pullToRefreshOffset(-20, 80)).toBe(0);
  });

  it('adds non-linear tension beyond the threshold (Compose)', () => {
    // 50% beyond: tension 0.5 - 0.25 / 4.
    expect(pullToRefreshOffset(240, 80)).toBeCloseTo(80 + 80 * 0.4375, 5);
    // Limited to 200% beyond: 80 + 80 * (2 - 1).
    expect(pullToRefreshOffset(480, 80)).toBe(160);
    expect(pullToRefreshOffset(4000, 80)).toBe(160);
  });

  it('computes the circular arrow (Compose ArrowValues)', () => {
    const start = pullToRefreshArrow(0.4);
    expect(start.scale).toBe(0);
    expect(start.endAngle).toBeCloseTo(start.startAngle, 5);
    expect(start.alpha).toBe(0.3);
    const full = pullToRefreshArrow(1);
    expect(full.scale).toBe(1);
    expect(full.alpha).toBe(1);
    // 80% of a turn at the threshold.
    expect(full.endAngle - full.startAngle).toBeCloseTo(288, 5);
    expect(full.rotation).toBeCloseTo(0.075, 5);
  });
});

describe('<md-gb-pull-to-refresh>', () => {
  const env = new Environment();

  async function setupTest(attributes = '') {
    const root = env.render(html``);
    root.innerHTML = `
      <md-gb-pull-to-refresh style="height: 200px" ${attributes}>
        <ul style="margin: 0">
          ${Array.from({length: 40}, (_, i) => `<li style="height: 40px">Item ${i}</li>`).join('')}
        </ul>
      </md-gb-pull-to-refresh>`;
    const element = root.querySelector<PullToRefreshElement>(
      'md-gb-pull-to-refresh',
    )!;
    await env.waitForStability();
    const shadow = element.shadowRoot!;
    return {
      element,
      content: element.querySelector('li')!,
      container: shadow.querySelector<HTMLElement>('.pull-to-refresh')!,
      scroller: shadow.querySelector<HTMLElement>('.pull-to-refresh-scroller')!,
      indicator: shadow.querySelector<HTMLElement>(
        '.pull-to-refresh-indicator',
      )!,
    };
  }

  describe('rendering', () => {
    it('initializes with defaults', async () => {
      const {element} = await setupTest();
      expect(element.refreshing).toBeFalse();
      expect(element.disabled).toBeFalse();
      expect(element.threshold).toBe(PULL_TO_REFRESH_THRESHOLD_PX);
      expect(element.indicator).toBe('loading');
      expect(element.indicatorLabel).toBe('Refreshing');
    });

    it('scrolls its content and hides the indicator above the top', async () => {
      const {scroller, indicator} = await setupTest();
      expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
      expect(getComputedStyle(indicator).visibility).toBe('hidden');
      expect(indicator.getAttribute('aria-hidden')).toBe('true');
      expect(indicator.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        scroller.getBoundingClientRect().top + 0.5,
      );
    });

    it('uses a contained loading indicator by default', async () => {
      const {indicator} = await setupTest();
      const loading = indicator.querySelector('md-gb-loading-indicator')!;
      expect(loading === null).toBeFalse();
      expect(loading.contained).toBeTrue();
      expect(loading.getAttribute('aria-label')).toBe('Refreshing');
      const style = getComputedStyle(indicator);
      expect(style.width).toBe('48px');
      expect(style.height).toBe('48px');
    });

    it('renders the circular arrow indicator', async () => {
      const {indicator, element} = await setupTest('indicator="circular"');
      expect(indicator.querySelector('md-gb-loading-indicator') === null).toBeTrue();
      expect(indicator.querySelector('.pull-to-refresh-arrow') === null).toBeFalse();
      const style = getComputedStyle(indicator);
      expect(style.width).toBe('40px');
      // Compose PullToRefreshDefaults.indicatorContainerColor.
      const probe = document.createElement('div');
      probe.style.color = 'var(--md-sys-color-surface-container-high)';
      element.append(probe);
      expect(style.backgroundColor).toBe(getComputedStyle(probe).color);
      probe.remove();
    });

    it('marks the scroller at the top for touch-action', async () => {
      const {scroller} = await setupTest();
      expect(scroller.classList.contains('pull-to-refresh-at-top')).toBeTrue();
      expect(getComputedStyle(scroller).touchAction).toBe(
        'pan-x pan-down pinch-zoom',
      );
      scroller.scrollTop = 100;
      scroller.dispatchEvent(new Event('scroll'));
      expect(scroller.classList.contains('pull-to-refresh-at-top')).toBeFalse();
    });
  });

  describe('pulling', () => {
    it('moves the indicator with the pull', async () => {
      const {element, content, container, indicator} = await setupTest();
      pull(content, 0, [20, 100], false);
      await env.waitForStability();
      expect(container.classList.contains('pull-to-refresh-pulling')).toBeTrue();
      // 100px pull * 0.5 = 50px of an 80px threshold.
      expect(
        Number(container.style.getPropertyValue('--pull-to-refresh-fraction')),
      ).toBeCloseTo(50 / 80, 5);
      expect(getComputedStyle(indicator).visibility).toBe('visible');
      expect(indicator.hasAttribute('aria-hidden')).toBeFalse();
      const loading = indicator.querySelector('md-gb-loading-indicator')!;
      expect(loading.value).toBeCloseTo(50 / 80, 5);
      pointer('pointercancel', content, 100);
      await env.waitForStability();
      expect(container.classList.contains('pull-to-refresh-pulling')).toBeFalse();
      expect(element.refreshing).toBeFalse();
    });

    // spec: loading-indicator-1ec7ff, loading-indicator-c9516c
    it('refreshes when released past the threshold', async () => {
      const {element, content, container} = await setupTest();
      const refreshSpy = jasmine.createSpy('refresh');
      element.addEventListener('refresh', refreshSpy);
      pull(content, 0, [20, 170]);
      await env.waitForStability();
      expect(refreshSpy.calls.count()).toBe(1);
      expect(element.refreshing).toBeTrue();
      expect(element.hasAttribute('refreshing')).toBeTrue();
      expect(container.classList.contains('pull-to-refresh-refreshing')).toBeTrue();
      const loading = element.shadowRoot!.querySelector(
        'md-gb-loading-indicator',
      )!;
      // Indeterminate while refreshing.
      expect(loading.value).toBeUndefined();
      const status = element.shadowRoot!.querySelector('[role="status"]')!;
      expect(status.textContent!.trim()).toBe('Refreshing');
    });

    // spec: loading-indicator-1ec7ff
    it('does not refresh when released before the threshold', async () => {
      const {element, content} = await setupTest();
      const refreshSpy = jasmine.createSpy('refresh');
      element.addEventListener('refresh', refreshSpy);
      pull(content, 0, [20, 150]);
      await env.waitForStability();
      expect(refreshSpy.calls.count()).toBe(0);
      expect(element.refreshing).toBeFalse();
    });

    // spec: loading-indicator-34b068
    it('cancels when pulled back up', async () => {
      const {element, content} = await setupTest();
      pull(content, 0, [20, 200, 40]);
      await env.waitForStability();
      expect(element.refreshing).toBeFalse();
    });

    // spec: loading-indicator-3a2cdc, loading-indicator-15f70f
    it('rests the indicator at the threshold until refreshing ends', async () => {
      const {element, content, indicator} = await setupTest();
      pull(content, 0, [20, 400]);
      await env.waitForStability();
      // Turned past the threshold while pulling; upright while refreshing.
      const spin = indicator.querySelector<HTMLElement>(
        '.pull-to-refresh-loading',
      )!;
      expect(spin.style.rotate).toBe('');
      expect(getComputedStyle(indicator).visibility).toBe('visible');
      element.refreshing = false;
      await env.waitForStability();
      expect(indicator.getAttribute('aria-hidden')).toBe('true');
      const status = element.shadowRoot!.querySelector('[role="status"]')!;
      expect(status.textContent!.trim()).toBe('');
    });

    // spec: loading-indicator-bb0156
    it('keeps the indicator in view while the content scrolls during a refresh', async () => {
      const {element, content, indicator, scroller} = await setupTest();
      pull(content, 0, [20, 400]);
      await env.waitForStability();
      expect(element.refreshing).toBeTrue();
      scroller.scrollTop = 300;
      await env.waitForStability();
      indicator.getAnimations().forEach((a) => a.finish());
      const host = element.getBoundingClientRect();
      const box = indicator.getBoundingClientRect();
      expect(getComputedStyle(indicator).visibility).toBe('visible');
      expect(box.top).toBeGreaterThanOrEqual(host.top - 1);
      expect(box.bottom).toBeLessThanOrEqual(host.bottom + 1);
    });

    it('turns the loading indicator past the threshold', async () => {
      const {content, indicator} = await setupTest();
      pull(content, 0, [20, 240], false);
      await env.waitForStability();
      const spin = indicator.querySelector<HTMLElement>(
        '.pull-to-refresh-loading',
      )!;
      // Fraction 1.4375: -(0.4375) * 180deg.
      expect(parseFloat(spin.style.rotate)).toBeCloseTo(-78.75, 2);
      pointer('pointercancel', content, 240);
    });

    it('can cancel the refresh event', async () => {
      const {element, content} = await setupTest();
      element.addEventListener('refresh', (event) => {
        event.preventDefault();
      });
      pull(content, 0, [20, 200]);
      await env.waitForStability();
      expect(element.refreshing).toBeFalse();
    });

    it('does not pull while scrolled down', async () => {
      const {element, content, scroller, container} = await setupTest();
      scroller.scrollTop = 120;
      pull(content, 0, [20, 200], false);
      await env.waitForStability();
      expect(container.classList.contains('pull-to-refresh-pulling')).toBeFalse();
      pointer('pointerup', content, 200);
      await env.waitForStability();
      expect(element.refreshing).toBeFalse();
    });

    it('does not pull upward or sideways', async () => {
      const {content, container} = await setupTest();
      pull(content, 100, [80, 40], false);
      await env.waitForStability();
      expect(container.classList.contains('pull-to-refresh-pulling')).toBeFalse();
      pointer('pointerup', content, 40);
      pointer('pointerdown', content, 100, 100);
      pointer('pointermove', content, 110, 200);
      pointer('pointermove', content, 200, 200);
      await env.waitForStability();
      expect(container.classList.contains('pull-to-refresh-pulling')).toBeFalse();
      pointer('pointerup', content, 200, 200);
    });

    it('does not pull when disabled or already refreshing', async () => {
      const {element, content} = await setupTest('disabled');
      const refreshSpy = jasmine.createSpy('refresh');
      element.addEventListener('refresh', refreshSpy);
      pull(content, 0, [20, 200]);
      await env.waitForStability();
      expect(refreshSpy.calls.count()).toBe(0);

      element.disabled = false;
      element.refreshing = true;
      await env.waitForStability();
      pull(content, 0, [20, 200]);
      await env.waitForStability();
      expect(refreshSpy.calls.count()).toBe(0);
    });

    it('uses a custom threshold', async () => {
      const {element, content} = await setupTest();
      element.threshold = 40;
      pull(content, 0, [20, 90]);
      await env.waitForStability();
      expect(element.refreshing).toBeTrue();
    });

    it('does not click content after a pull', async () => {
      const {element, content} = await setupTest();
      const clickSpy = jasmine.createSpy('click');
      content.addEventListener('click', clickSpy);
      pull(content, 0, [20, 100]);
      content.click();
      expect(clickSpy.calls.count()).toBe(0);
      expect(element.refreshing).toBeFalse();
    });
  });

  describe('refresh() (gesture alternative)', () => {
    it('starts a refresh and fires refresh', async () => {
      const {element, indicator} = await setupTest();
      const refreshSpy = jasmine.createSpy('refresh');
      element.addEventListener('refresh', refreshSpy);
      expect(element.refresh()).toBeTrue();
      await env.waitForStability();
      expect(refreshSpy.calls.count()).toBe(1);
      expect(element.refreshing).toBeTrue();
      expect(getComputedStyle(indicator).visibility).toBe('visible');
      const loading = indicator.querySelector('md-gb-loading-indicator')!;
      const bar = loading.shadowRoot!.querySelector('[role="progressbar"]')!;
      expect(bar.getAttribute('aria-label')).toBe('Refreshing');
      // Already refreshing.
      expect(element.refresh()).toBeFalse();
      expect(refreshSpy.calls.count()).toBe(1);
    });

    it('labels the indicator with indicator-label', async () => {
      const {element, indicator} = await setupTest(
        'indicator-label="Refreshing news"',
      );
      element.refresh();
      await env.waitForStability();
      const loading = indicator.querySelector('md-gb-loading-indicator')!;
      expect(loading.getAttribute('aria-label')).toBe('Refreshing news');
    });

    it('shows a spinner progressbar for the circular indicator', async () => {
      const {element, indicator} = await setupTest('indicator="circular"');
      element.refresh();
      await env.waitForStability();
      const spinner = indicator.querySelector('.pull-to-refresh-spinner')!;
      expect(spinner.getAttribute('role')).toBe('progressbar');
      expect(spinner.getAttribute('aria-label')).toBe('Refreshing');
      const arrow = indicator.querySelector('.pull-to-refresh-arrow')!;
      expect(arrow.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('circular arrow', () => {
    it('reports pull progress as a progressbar', async () => {
      const {content, indicator} = await setupTest('indicator="circular"');
      pull(content, 0, [20, 80], false);
      await env.waitForStability();
      const arrow = indicator.querySelector('.pull-to-refresh-arrow')!;
      expect(arrow.getAttribute('role')).toBe('progressbar');
      expect(arrow.getAttribute('aria-valuenow')).toBe('50');
      pointer('pointercancel', content, 80);
    });
  });
});

describe('pullToRefresh() (Light DOM)', () => {
  const env = new Environment();

  it('pulls, fires refresh and adds the refreshing class', async () => {
    const root = env.render(html``);
    render(
      html`<div class="${pullToRefresh()}" style="height: 200px">
        <div class="pull-to-refresh-scroller"><p>Content</p></div>
        <div class="pull-to-refresh-indicator"></div>
      </div>`,
      root,
    );
    await env.waitForStability();
    const element = root.querySelector<HTMLElement>('.pull-to-refresh')!;
    const scroller = root.querySelector('.pull-to-refresh-scroller')!;
    expect(scroller.classList.contains('pull-to-refresh-at-top')).toBeTrue();
    const refreshSpy = jasmine.createSpy('refresh');
    element.addEventListener('refresh', refreshSpy);

    pull(root.querySelector('p')!, 0, [20, 100], false);
    expect(element.classList.contains('pull-to-refresh-pulling')).toBeTrue();
    expect(element.style.getPropertyValue('--pull-to-refresh-fraction')).toBe(
      String(50 / 80),
    );
    pointer('pointermove', root.querySelector('p')!, 200);
    pointer('pointerup', root.querySelector('p')!, 200);
    expect(element.classList.contains('pull-to-refresh-pulling')).toBeFalse();
    expect(refreshSpy.calls.count()).toBe(1);
    expect(element.classList.contains('pull-to-refresh-refreshing')).toBeTrue();
  });
});
