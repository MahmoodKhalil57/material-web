/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Test helpers for predictive back: a fake `CloseWatcher`.

/** A stand-in for the platform `CloseWatcher`. */
export class FakeCloseWatcher extends EventTarget {
  static instances: FakeCloseWatcher[] = [];
  destroyed = false;

  constructor() {
    super();
    FakeCloseWatcher.instances.push(this);
  }

  destroy() {
    this.destroyed = true;
  }

  /** Simulates a back gesture: fires `close` and deactivates. */
  requestClose() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.dispatchEvent(new Event('close'));
  }

  static active() {
    return FakeCloseWatcher.instances.filter((w) => !w.destroyed);
  }
}

/** Installs `FakeCloseWatcher` (or removes `CloseWatcher`) for a suite. */
export function useCloseWatcher(fake: boolean) {
  const global = globalThis as {CloseWatcher?: unknown};
  let original: unknown;
  let had = false;
  beforeEach(() => {
    had = 'CloseWatcher' in global;
    original = global.CloseWatcher;
    FakeCloseWatcher.instances = [];
    if (fake) {
      global.CloseWatcher = FakeCloseWatcher;
    } else {
      delete global.CloseWatcher;
    }
  });
  afterEach(() => {
    if (had) {
      global.CloseWatcher = original;
    } else {
      delete global.CloseWatcher;
    }
  });
}
