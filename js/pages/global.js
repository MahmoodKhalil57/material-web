import {
  changeColor,
  changeColorAndMode,
  changeColorMode,
  getCurrentMode,
  getCurrentSeedColor,
  getCurrentThemeString,
  getLastSavedAutoColorMode,
  isModeDark
} from "../chunk-OAVXCLE4.js";
import "../chunk-EUXUH3YW.js";

// src/pages/global.ts
function applyColorThemeListeners() {
  document.body.addEventListener("change-color", (event) => {
    changeColor(event.color);
  });
  document.body.addEventListener("change-mode", (event) => {
    changeColorMode(event.mode);
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getCurrentMode() !== "auto") {
      return;
    }
    changeColor(getCurrentSeedColor());
  });
}
function initializeTheme() {
  if (!getCurrentThemeString()) {
    changeColorAndMode("#ECAA2E", "auto");
  }
}
function determinePageNavigationAutoMode() {
  if (getCurrentMode() !== "auto") {
    return;
  }
  const actualColorMode = isModeDark("auto", false) ? "dark" : "light";
  const lastSavedAutoColorMode = getLastSavedAutoColorMode();
  if (actualColorMode !== lastSavedAutoColorMode) {
    changeColorMode("auto");
  }
}
applyColorThemeListeners();
initializeTheme();
determinePageNavigationAutoMode();
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=global.js.map
