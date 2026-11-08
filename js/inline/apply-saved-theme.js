"use strict";
(() => {
  // src/utils/apply-theme-string.ts
  function applyThemeString(doc, themeString, ssName = "material-theme") {
    let sheet = globalThis[ssName];
    if (!sheet) {
      sheet = new CSSStyleSheet();
      globalThis[ssName] = sheet;
      doc.adoptedStyleSheets.push(sheet);
    }
    const surfaceContainer = themeString.match(
      /--md-sys-color-surface-container:(.+?);/
    )?.[1];
    if (surfaceContainer) {
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", surfaceContainer);
    }
    sheet.replaceSync(themeString);
    localStorage.setItem(ssName, themeString);
  }

  // src/inline/apply-saved-theme.ts
  var lastThemeString = localStorage.getItem("material-theme");
  if (lastThemeString) {
    applyThemeString(document, lastThemeString);
  }
})();
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=apply-saved-theme.js.map
