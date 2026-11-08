import {
  e,
  i,
  i2,
  l,
  n,
  s,
  t
} from "./chunk-KV6CMQ6O.js";
import {
  x
} from "./chunk-JVQ4V6KC.js";
import {
  __decorateClass
} from "./chunk-EUXUH3YW.js";

// src/components/copy-code-button.ts
var CopyCodeButton = class extends s {
  constructor() {
    super(...arguments);
    this.showCheckmark = false;
    this.label = "Copy code";
    this.successLabel = "Copy successful";
    this.buttonTitle = "Copy code";
  }
  render() {
    return x`
      <slot></slot>
      <md-icon-button
        toggle
        @click=${this.onClick}
        @input=${this.onInput}
        title=${this.buttonTitle}
        .selected=${this.showCheckmark}
        aria-label=${this.label}
        aria-label-selected=${this.successLabel}>
        <md-icon>content_copy</md-icon>
        <md-icon slot="selected">check</md-icon>
      </md-icon-button>
    `;
  }
  async onClick() {
    await navigator.clipboard.writeText(this.getCopyText());
    this.onCopySuccess();
  }
  onInput() {
    this.showCheckmark = this.copyButton.selected;
  }
  /**
   * Returns the text to be copied. By default, it copies the textContent of the
   * nodes slotted into the element. Override for custom functionality.
   */
  getCopyText() {
    let text = "";
    for (const el of this.slottedEls) {
      text += el.textContent;
    }
    return text;
  }
  onCopySuccess() {
    this.showCheckmark = true;
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => {
      this.showCheckmark = false;
    }, 2e3);
  }
};
CopyCodeButton.styles = i2`
    :host {
      display: block;
      position: relative;
      --_border-radius: calc(var(--catalog-code-block-border-radius) / 4);
    }

    md-icon-button {
      color: red;
      position: absolute;
      inset: var(
        --catalog-copy-code-button-inset,
        var(--_border-radius) var(--_border-radius) auto auto
      );
      --md-sys-color-on-surface-variant: var(--md-sys-color-on-surface);
      --md-sys-color-primary: var(--md-sys-color-on-surface);
    }
  `;
__decorateClass([
  t()
], CopyCodeButton.prototype, "showCheckmark", 2);
__decorateClass([
  n()
], CopyCodeButton.prototype, "label", 2);
__decorateClass([
  n({ attribute: "success-label" })
], CopyCodeButton.prototype, "successLabel", 2);
__decorateClass([
  n({ attribute: "button-title" })
], CopyCodeButton.prototype, "buttonTitle", 2);
__decorateClass([
  i("md-icon-button")
], CopyCodeButton.prototype, "copyButton", 2);
__decorateClass([
  l({ flatten: true, selector: "*" })
], CopyCodeButton.prototype, "slottedEls", 2);
CopyCodeButton = __decorateClass([
  e("copy-code-button")
], CopyCodeButton);
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=chunk-MSJ6O72X.js.map
