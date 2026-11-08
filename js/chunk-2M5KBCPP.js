import {
  __decorate,
  e,
  i2 as i,
  s
} from "./chunk-KV6CMQ6O.js";
import {
  x
} from "./chunk-JVQ4V6KC.js";

// ../icon/internal/icon.js
var Icon = class extends s {
  render() {
    return x`<slot></slot>`;
  }
  connectedCallback() {
    super.connectedCallback();
    const ariaHidden = this.getAttribute("aria-hidden");
    if (ariaHidden === "false") {
      this.removeAttribute("aria-hidden");
      return;
    }
    this.setAttribute("aria-hidden", "true");
  }
};

// ../icon/internal/icon-styles.cssresult.js
var styles = i`:host{font-size:var(--md-icon-size, 24px);width:var(--md-icon-size, 24px);height:var(--md-icon-size, 24px);color:inherit;font-variation-settings:inherit;font-weight:400;font-family:var(--md-icon-font, Material Symbols Outlined);display:inline-flex;font-style:normal;place-items:center;place-content:center;line-height:1;overflow:hidden;letter-spacing:normal;text-transform:none;user-select:none;white-space:nowrap;word-wrap:normal;flex-shrink:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale}::slotted(svg){fill:currentColor}::slotted(*){height:100%;width:100%}
`;
var icon_styles_cssresult_default = styles.styleSheet;

// ../icon/icon.js
var MdIcon = class MdIcon2 extends Icon {
};
MdIcon.styles = [styles];
MdIcon = __decorate([
  e("md-icon")
], MdIcon);
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=chunk-2M5KBCPP.js.map
