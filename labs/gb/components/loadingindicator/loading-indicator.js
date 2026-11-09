/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { createClassMapDirective } from '../shared/directives.js';
import { DETERMINATE_INITIAL_PATH, INDETERMINATE_INITIAL_PATH, } from './loading-indicator-paths.js';
/** Loading indicator classes. */
export const LOADING_INDICATOR_CLASSES = {
    loadingIndicator: 'loading-indicator',
    loadingIndicatorContained: 'loading-indicator-contained',
    loadingIndicatorDeterminate: 'loading-indicator-determinate',
    loadingIndicatorSpin: 'loading-indicator-spin',
    loadingIndicatorShape: 'loading-indicator-shape',
};
/**
 * Returns the loading indicator classes to apply to an element based on the
 * given state.
 *
 * @param state The state of the loading indicator.
 * @return An object of class names and truthy values if they apply.
 */
export function loadingIndicatorClasses({ contained = false, determinate = false, } = {}) {
    return {
        [LOADING_INDICATOR_CLASSES.loadingIndicator]: true,
        [LOADING_INDICATOR_CLASSES.loadingIndicatorContained]: contained,
        [LOADING_INDICATOR_CLASSES.loadingIndicatorDeterminate]: determinate,
    };
}
const SVG_NS = 'http://www.w3.org/2000/svg';
/**
 * Sets up a loading indicator element: adds the animated shape if the
 * element has none, and a `progressbar` role if it has no role.
 *
 * @param element The loading indicator element.
 */
export function setupLoadingIndicator(element) {
    if (!element.hasAttribute('role')) {
        element.setAttribute('role', 'progressbar');
    }
    if (element.querySelector(`.${LOADING_INDICATOR_CLASSES.loadingIndicatorSpin}`)) {
        return;
    }
    const determinate = element.classList.contains(LOADING_INDICATOR_CLASSES.loadingIndicatorDeterminate);
    const spin = document.createElement('span');
    spin.className = LOADING_INDICATOR_CLASSES.loadingIndicatorSpin;
    spin.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', LOADING_INDICATOR_CLASSES.loadingIndicatorShape);
    svg.setAttribute('viewBox', '0 0 100 100');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', determinate ? DETERMINATE_INITIAL_PATH : INDETERMINATE_INITIAL_PATH);
    svg.append(path);
    spin.append(svg);
    element.append(spin);
}
/**
 * A Lit directive that adds loading indicator styling to its element and
 * creates its animated shape.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${loadingIndicator()}" aria-label="Loading"></div>
 *   <div class="${loadingIndicator({contained: true})}" aria-label="Loading">
 *   </div>
 *   <div
 *     class="${loadingIndicator({determinate: true})}"
 *     style="--progress: 0.4"
 *     aria-label="Downloading"
 *     aria-valuenow="40"></div>
 * `;
 * ```
 */
export const loadingIndicator = createClassMapDirective({
    getClasses: loadingIndicatorClasses,
    setupElement: setupLoadingIndicator,
});
//# sourceMappingURL=loading-indicator.js.map