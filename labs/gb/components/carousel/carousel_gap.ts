/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Gaps: spec requirements the carousel does not meet yet. The centered hero,
// the hero on larger screens and the press shape change are checked in
// `carousel_hero_test.ts`. Run with `npm run gb:check -- --gaps`.

// import 'jasmine'; (google3-only)

describe('carousel gaps', () => {
  // With no known gaps the suite would have no tests, which the runner
  // reports as a failed file ("Unknown error").
  it('has no known gaps', () => {
    expect([]).toEqual([]);
  });
});
