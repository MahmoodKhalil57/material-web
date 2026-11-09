/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, LitElement, nothing, svg } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { mixinDelegatesAria } from '../../../../internal/aria/delegate.js';
import progressStyles from './progress.css' with { type: 'css' }; // github-only
// import {styles as progressStyles} from './progress.cssresult.js'; // google3-only
import { CIRCULAR_VIEW_BOX, CIRCULAR_FLAT_PATH, LINEAR_PATH_LENGTH, LINEAR_FLAT_PATH, LINEAR_INDETERMINATE_WAVY_PATH, LINEAR_WAVY_PATH, CIRCULAR_WAVY_PATH, } from './progress-paths.js';
import { progressClasses, registerProgressProperties } from './progress.js';
// Separate variable needed for closure.
// spec-labels: progress-indicators/specs/anatomy, progress-indicators/guidelines/anatomy, progress-indicators/specs/variants, progress-indicators/guidelines/usage, progress-indicators/specs/configurations
const baseClass = mixinDelegatesAria(LitElement);
/**
 * A Material Design 3 Expressive progress indicator: a linear or circular
 * track with a flat (or wavy) active indicator.
 *
 * Set `value` (0 to 1) to show determinate progress.
 *
 * @csspart indicator - The indicator container.
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-thickness
 * @cssprop --height - Linear only.
 * @cssprop --progress
 * @cssprop --size - Circular only.
 * @cssprop --stop-indicator-color
 * @cssprop --stop-indicator-shape
 * @cssprop --stop-indicator-size
 * @cssprop --stop-indicator-trailing-space
 * @cssprop --track-active-indicator-space
 * @cssprop --track-color
 * @cssprop --track-shape
 * @cssprop --track-thickness
 */
export class ProgressElement extends baseClass {
    constructor() {
        super();
        /** Whether the indicator is circular instead of linear. */
        this.circular = false;
        /** Whether the active indicator is wavy instead of flat (the default). */
        this.wavy = false;
        registerProgressProperties();
    }
    render() {
        const determinate = this.value !== undefined && !Number.isNaN(this.value);
        const progress = determinate ? Math.min(1, Math.max(0, this.value)) : 0;
        // The `d` attributes are the shapes for browsers without the CSS `d`
        // property (the CSS value replaces them elsewhere).
        const linearPath = !this.wavy
            ? LINEAR_FLAT_PATH
            : determinate
                ? LINEAR_WAVY_PATH
                : LINEAR_INDETERMINATE_WAVY_PATH;
        const circularPath = this.wavy ? CIRCULAR_WAVY_PATH : CIRCULAR_FLAT_PATH;
        // The wave is flat at or below 10% and at or above 95% progress. The
        // class does what the style query on `--_md-progress-wavy` does, for
        // browsers without style queries.
        const waveAmplitude = this.wavy && determinate && progress > 0.1 && progress < 0.95;
        // Needed for closure conformance
        const { ariaLabel } = this;
        return html `<div
      part="indicator"
      class="${classMap({
            ...progressClasses({
                circular: this.circular,
                wavy: this.wavy,
                determinate,
            }),
            'progress-wave-amplitude': waveAmplitude,
        })}"
      style="${styleMap(determinate ? { '--progress': String(progress) } : {})}"
      role="progressbar"
      aria-label="${ariaLabel || nothing}"
      aria-valuemin="${determinate ? 0 : nothing}"
      aria-valuemax="${determinate ? 100 : nothing}"
      aria-valuenow="${determinate ? Math.round(progress * 100) : nothing}">
      <span class="progress-container" aria-hidden="true">
        <span class="progress-track progress-track-1"></span>
        <span class="progress-track progress-track-2"></span>
        <span class="progress-track progress-track-3"></span>
        ${svg `<svg class="progress-wave"><path
            class="progress-active progress-active-1"
            d="${linearPath}"
            pathLength="${LINEAR_PATH_LENGTH}"></path><path
            class="progress-active progress-active-2"
            d="${linearPath}"
            pathLength="${LINEAR_PATH_LENGTH}"></path></svg>`}
        <span class="progress-stop"></span>
        ${svg `<svg class="progress-ring" viewBox="${CIRCULAR_VIEW_BOX}"><circle
            class="progress-ring-track"></circle><path
            class="progress-active"
            d="${circularPath}"
            pathLength="100"></path></svg>`}
      </span>
    </div>`;
    }
}
/** @nocollapse */
ProgressElement.styles = [
    progressStyles,
    css `
      :host {
        display: block;
      }
      :host([circular]) {
        display: inline-flex;
        vertical-align: middle;
      }
    `,
];
__decorate([
    property({ type: Boolean, reflect: true })
], ProgressElement.prototype, "circular", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], ProgressElement.prototype, "wavy", void 0);
__decorate([
    property({ type: Number })
], ProgressElement.prototype, "value", void 0);
//# sourceMappingURL=progress-element.js.map