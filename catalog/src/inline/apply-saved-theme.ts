/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {applyThemeString} from '../utils/apply-theme-string.js';

// Checks if there has been a theme already generated from a prior visit
const lastThemeString = localStorage.getItem('material-theme');

// Applies the theme string to the document if available.
if (lastThemeString) {
  applyThemeString(document, lastThemeString);
}

// In the v3.0-Alpha pages (local `npm run catalog:dev` builds), the labs/gb
// tokens follow the same theme. The page script in _includes/default.html
// caches the generated CSS; applying it here avoids a flash of the baseline.
if (location.pathname === '/3.0' || location.pathname.startsWith('/3.0/')) {
  const gbThemeString = localStorage.getItem('material-theme-gb');
  if (gbThemeString) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(gbThemeString);
    (globalThis as unknown as Record<string, unknown>)['material-theme-gb'] =
      sheet;
    document.adoptedStyleSheets.push(sheet);
  }
}
