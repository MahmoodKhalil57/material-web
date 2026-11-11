/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {stepScroll} from '../../foundations/interaction/gestures/scroll-behavior.js';
import {waitForDuration} from '../../styles/motion/motion.js';
import {
  PERF_TRACK,
  PERF_TRACK_GROUP,
  perfEnabled,
  perfEnd,
  perfSpan,
  perfStart,
  setPerfEnabled,
} from './perf.js';

function measures(name: string) {
  return performance.getEntriesByName(name, 'measure') as PerformanceMeasure[];
}

describe('perf', () => {
  beforeEach(() => {
    performance.clearMeasures();
  });

  afterEach(() => {
    performance.clearMeasures();
    setPerfEnabled(undefined);
  });

  it('is off by default and records nothing', async () => {
    setPerfEnabled(undefined);
    expect(perfEnabled()).toBe(false);
    expect(perfStart()).toBe(-1);
    perfEnd('md-gb-test', -1);
    expect(perfSpan('md-gb-test', () => 42)).toBe(42);
    await waitForDuration(5);
    expect(measures('md-gb-test').length).toBe(0);
    expect(measures('waitForDuration').length).toBe(0);
  });

  it('reads the flag from the md-gb-perf URL parameter', () => {
    const url = new URL(location.href);
    url.searchParams.set('md-gb-perf', '');
    history.replaceState(null, '', url);
    try {
      setPerfEnabled(undefined);
      expect(perfEnabled()).toBe(true);
    } finally {
      url.searchParams.delete('md-gb-perf');
      history.replaceState(null, '', url);
    }
    setPerfEnabled(undefined);
    expect(perfEnabled()).toBe(false);
  });

  it('records measures with the devtools detail when on', () => {
    setPerfEnabled(true);
    const result = perfSpan('md-gb-test', () => 'ok');
    expect(result).toBe('ok');
    const [entry] = measures('md-gb-test');
    expect(entry).toBeDefined();
    expect(entry.detail.devtools.track).toBe(PERF_TRACK);
    expect(entry.detail.devtools.trackGroup).toBe(PERF_TRACK_GROUP);
    expect(entry.detail.devtools.dataType).toBe('track-entry');
  });

  it('records a span that throws and a span that rejects', async () => {
    setPerfEnabled(true);
    expect(() =>
      perfSpan('md-gb-throw', () => {
        throw new Error('x');
      }),
    ).toThrowError('x');
    expect(measures('md-gb-throw').length).toBe(1);
    await perfSpan('md-gb-async', () => new Promise((r) => setTimeout(r, 5)));
    await Promise.resolve();
    expect(measures('md-gb-async').length).toBe(1);
    expect(measures('md-gb-async')[0].duration).toBeGreaterThan(0);
  });

  it('marks motion waits', async () => {
    setPerfEnabled(true);
    await waitForDuration(5);
    const [entry] = measures('waitForDuration');
    expect(entry.detail.devtools.track).toBe(PERF_TRACK);
    expect(entry.detail.duration).toBe(5);
  });

  it('keeps the pure scroll step unchanged when on', () => {
    setPerfEnabled(true);
    const next = stepScroll({y: 0, hidden: false, travel: 0}, 100);
    expect(next.hidden).toBe(true);
  });
});
