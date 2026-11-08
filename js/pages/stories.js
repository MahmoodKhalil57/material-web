import "../chunk-2M5KBCPP.js";
import {
  o as o2
} from "../chunk-KNPMS4HC.js";
import {
  e,
  i,
  i2,
  o3 as o,
  s,
  t
} from "../chunk-KV6CMQ6O.js";
import {
  x
} from "../chunk-JVQ4V6KC.js";
import {
  __decorateClass
} from "../chunk-EUXUH3YW.js";

// src/components/drag-playground.ts
var DragPlayground = class extends s {
  constructor() {
    super(...arguments);
    this.isDragging = false;
    this.editorHeightPercent = 0;
    /**
     * A set of pointer IDs in the case that the user is dragging with multiple
     * pointers.
     */
    this.pointerIds = /* @__PURE__ */ new Set();
  }
  render() {
    return x`<div
      id="wrapper"
      style=${o2({
      "--editor-percentage": `${this.editorHeightPercent}%`
    })}
    >
      <slot name="preview"></slot>
      <div
        id="drag-bar"
        tabindex="0"
        role="slider"
        aria-orientation="vertical"
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow="${this.editorHeightPercent}"
        aria-valuetext="${this.editorHeightPercent} percent"
        aria-label="Editor height"
        @focus=${this.onFocus}
        @blur=${this.onBlur}
        @keydown=${this.onKeydown}
        @pointerdown=${this.onPointerdown}
        @pointerup=${this.onPointerup}
        @pointermove=${this.onPointermove}
        class=${o({
      isDragging: this.isDragging
    })}
      >
        <md-icon>drag_handle</md-icon>
      </div>
      <slot name="editor"></slot>
    </div>`;
  }
  onFocus() {
    this.isDragging = true;
  }
  onBlur() {
    this.isDragging = false;
  }
  onKeydown(event) {
    const { key } = event;
    switch (key) {
      case "ArrowRight":
      case "ArrowUp":
        this.editorHeightPercent = Math.min(this.editorHeightPercent + 1, 100);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        this.editorHeightPercent = Math.max(this.editorHeightPercent - 1, 0);
        break;
      case "PageUp":
        this.editorHeightPercent = Math.min(this.editorHeightPercent + 10, 100);
        break;
      case "PageDown":
        this.editorHeightPercent = Math.max(this.editorHeightPercent - 10, 0);
        break;
      case "Home":
        this.editorHeightPercent = 0;
        break;
      case "End":
        this.editorHeightPercent = 100;
        break;
      default:
        break;
    }
  }
  onPointerdown(event) {
    this.isDragging = true;
    if (this.pointerIds.has(event.pointerId)) return;
    this.pointerIds.add(event.pointerId);
    event.target.setPointerCapture(event.pointerId);
  }
  onPointerup(event) {
    this.pointerIds.delete(event.pointerId);
    event.target.releasePointerCapture(event.pointerId);
    if (this.pointerIds.size === 0) {
      this.isDragging = false;
    }
  }
  onPointermove(event) {
    if (!this.isDragging) return;
    const { clientY: mouseY } = event;
    const { top: wrapperTop, bottom: wrapperBottom } = this.wrapperEl.getBoundingClientRect();
    const height = wrapperBottom - wrapperTop;
    const editorHeightPercent = 100 - (mouseY - wrapperTop) / height * 100;
    this.editorHeightPercent = Math.min(Math.max(editorHeightPercent, 0), 100);
  }
};
DragPlayground.styles = i2`
    :host {
      display: block;
      --_drag-bar-height: 24px;
      --_drag-bar-border-width: 1px;
      --_half-drag-bar-height: calc(
        (var(--_drag-bar-height) / 2) + var(--_drag-bar-border-width)
      );
    }

    #wrapper {
      display: flex;
      flex-direction: column;
    }

    :host,
    #wrapper,
    ::slotted(*) {
      height: 100%;
    }

    slot {
      display: block;
      overflow: hidden;
    }

    [name='preview'] {
      height: max(
        calc(
          100% - var(--editor-percentage, 0%) - var(--_half-drag-bar-height)
        ),
        0px
      );
    }

    [name='editor'] {
      height: max(
        calc(var(--editor-percentage, 0px) - var(--_half-drag-bar-height)),
        0px
      );
    }

    #drag-bar {
      touch-action: none;
      background-color: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface);
      border: var(--_drag-bar-border-width) solid var(--md-sys-color-outline);
      border-radius: 12px;
      height: var(--_drag-bar-height);
      display: flex;
      justify-content: center;
      align-items: center;
      -webkit-user-select: none;
      user-select: none;
    }

    #drag-bar:hover {
      background-color: var(--md-sys-color-surface-container-high);
      cursor: grab;
    }

    #drag-bar.isDragging {
      background-color: var(--md-sys-color-inverse-surface);
      color: var(--md-sys-color-inverse-on-surface);
      cursor: grabbing;
    }
  `;
__decorateClass([
  t()
], DragPlayground.prototype, "isDragging", 2);
__decorateClass([
  t()
], DragPlayground.prototype, "editorHeightPercent", 2);
__decorateClass([
  i("#wrapper")
], DragPlayground.prototype, "wrapperEl", 2);
DragPlayground = __decorateClass([
  e("drag-playground")
], DragPlayground);
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=stories.js.map
