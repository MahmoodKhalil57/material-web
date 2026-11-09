/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import skeletonStyles from './skeleton.css' with { type: 'css' }; // github-only
/**
 * A skeleton loader: a placeholder that hints at where content will appear
 * and holds its space while it loads (m3.material.io/styles/motion/transitions,
 * "Skeleton loaders").
 *
 * While `loading`, the placeholder shows a subtle pulse that travels from the
 * top left of the screen to the bottom right, and the slotted content is
 * invisible but keeps its layout. When `loading` is removed, the content
 * quickly fades in on top of the placeholder. Size an empty skeleton with CSS
 * (`inline-size`, `block-size`).
 *
 * While loading the element sets `aria-busy="true"`, and its content is inert.
 * With reduced motion the placeholder does not pulse.
 *
 * @slot - The content that is loading.
 * @cssprop --md-skeleton-color - Placeholder color (default:
 *     `--md-sys-color-surface-container-highest`).
 * @cssprop --md-skeleton-highlight-color - Color of the pulse (default:
 *     `--md-sys-color-surface-container-low`).
 * @cssprop --md-skeleton-shape - Corner radius of the placeholder.
 * @cssprop --md-skeleton-pulse-duration - Length of one pulse cycle.
 */
export class SkeletonElement extends LitElement {
    constructor() {
        super(...arguments);
        /** Whether the content is loading: shows the placeholder. */
        this.loading = false;
        /** The placeholder's shape: a block, a line of text, or a circle. */
        this.shape = 'rect';
    }
    render() {
        return html `
      <div
        class="skeleton-placeholder"
        part="placeholder"
        aria-hidden="true"
      ></div>
      <div class="skeleton-content" part="content" ?inert=${this.loading}>
        <slot></slot>
      </div>
    `;
    }
    updated(changed) {
        if (changed.has('loading')) {
            if (this.loading) {
                this.setAttribute('aria-busy', 'true');
            }
            else {
                this.removeAttribute('aria-busy');
            }
        }
    }
}
SkeletonElement.styles = [skeletonStyles];
__decorate([
    property({ type: Boolean, reflect: true })
], SkeletonElement.prototype, "loading", void 0);
__decorate([
    property({ reflect: true })
], SkeletonElement.prototype, "shape", void 0);
//# sourceMappingURL=skeleton-element.js.map