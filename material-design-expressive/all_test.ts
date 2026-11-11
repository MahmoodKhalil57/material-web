/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {styles as m3Styles} from './styles/m3.cssresult.js';

import './all.js';

describe('all', () => {
  it('defines the components', () => {
    for (const tag of ['md-gb-button', 'md-gb-menu', 'md-gb-snackbar']) {
      expect(customElements.get(tag))
        .withContext(`${tag} is defined`)
        .toBeDefined();
    }
  });

  it('adopts the M3 styles into the document', () => {
    expect(document.adoptedStyleSheets)
      .withContext('document.adoptedStyleSheets')
      .toContain(m3Styles.styleSheet!);
  });
});
