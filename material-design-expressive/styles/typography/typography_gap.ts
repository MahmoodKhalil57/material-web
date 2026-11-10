/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// Red tests (gaps): not counted as tested. The individual type tokens and the
// language height checks are in `typography_tokens_test.ts`.

describe('typography gaps', () => {
  // With no known gaps the suite would have no tests, which the runner
  // reports as a failed file ("Unknown error").
  it('has no known gaps', () => {
    expect([]).toEqual([]);
  });
});
