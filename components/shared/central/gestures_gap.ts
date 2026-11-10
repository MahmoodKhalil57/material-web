/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// Gap checks for this foundation: the reorder check moved to `gestures-reorder_test.ts`.
// Run with `npm run gb:check -- --gaps ...`.

describe('gestures (central gaps)', () => {
  // With no known gaps the suite would have no tests, which the runner
  // reports as a failed file ("Unknown error").
  it('has no known gaps', () => {
    expect([]).toEqual([]);
  });
});
