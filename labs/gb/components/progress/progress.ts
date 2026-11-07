/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';
import {
  CIRCULAR_VIEW_BOX,
  CIRCULAR_FLAT_PATH,
  CIRCULAR_WAVY_PATH,
  LINEAR_FLAT_PATH,
  LINEAR_INDETERMINATE_WAVY_PATH,
  LINEAR_PATH_LENGTH,
  LINEAR_WAVY_PATH,
  PROGRESS_PROPERTIES,
} from './progress-paths.js';

/** Progress indicator classes. */
export const PROGRESS_CLASSES = {
  progress: 'progress',
  progressCircular: 'progress-circular',
  progressWavy: 'progress-wavy',
  progressDeterminate: 'progress-determinate',
  progressContainer: 'progress-container',
  progressTrack: 'progress-track',
  progressStop: 'progress-stop',
  progressWave: 'progress-wave',
  progressRing: 'progress-ring',
  progressRingTrack: 'progress-ring-track',
  progressActive: 'progress-active',
} as const;

/** The state provided to the `progressClasses()` function. */
export interface ProgressClassesState {
  /** Whether the indicator is circular instead of linear. */
  circular?: boolean;
  /** Whether the active indicator is wavy instead of flat (the default). */
  wavy?: boolean;
  /**
   * Whether the indicator shows progress. Set progress (0 to 1) with the
   * `--progress` custom property.
   */
  determinate?: boolean;
}

/**
 * Returns the progress indicator classes to apply to an element based on the
 * given state.
 *
 * @param state The state of the progress indicator.
 * @return An object of class names and truthy values if they apply.
 */
export function progressClasses({
  circular = false,
  wavy = false,
  determinate = false,
}: ProgressClassesState = {}): ClassInfo {
  return {
    [PROGRESS_CLASSES.progress]: true,
    [PROGRESS_CLASSES.progressCircular]: circular,
    [PROGRESS_CLASSES.progressWavy]: wavy,
    [PROGRESS_CLASSES.progressDeterminate]: determinate,
  };
}

let propertiesRegistered = false;

/**
 * Registers the custom properties the progress indicator animates.
 *
 * The styles also declare them with `@property`, but `@property` rules do not
 * apply in shadow roots.
 */
export function registerProgressProperties(): void {
  if (propertiesRegistered || typeof CSS === 'undefined' || !CSS.registerProperty) {
    return;
  }
  propertiesRegistered = true;
  for (const {name, syntax, initialValue} of PROGRESS_PROPERTIES) {
    try {
      CSS.registerProperty({name, syntax, initialValue, inherits: true});
    } catch {
      // Already registered.
    }
  }
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgElement(name: string, attributes: Record<string, string>) {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
}

/**
 * Creates the parts of a progress indicator: track segments, a stop
 * indicator and the active indicator(s), for both linear and circular
 * indicators so the shape can change later.
 */
export function createProgressContainer(): HTMLElement {
  const container = document.createElement('span');
  container.className = PROGRESS_CLASSES.progressContainer;
  container.setAttribute('aria-hidden', 'true');
  for (let i = 1; i <= 3; i++) {
    const track = document.createElement('span');
    track.className = `${PROGRESS_CLASSES.progressTrack} ${PROGRESS_CLASSES.progressTrack}-${i}`;
    container.append(track);
  }
  const wave = svgElement('svg', {class: PROGRESS_CLASSES.progressWave});
  for (let i = 1; i <= 2; i++) {
    wave.append(
      svgElement('path', {
        class: `${PROGRESS_CLASSES.progressActive} ${PROGRESS_CLASSES.progressActive}-${i}`,
        d: LINEAR_FLAT_PATH,
        pathLength: String(LINEAR_PATH_LENGTH),
      }),
    );
  }
  const stop = document.createElement('span');
  stop.className = PROGRESS_CLASSES.progressStop;
  const ring = svgElement('svg', {
    class: PROGRESS_CLASSES.progressRing,
    viewBox: CIRCULAR_VIEW_BOX,
  });
  ring.append(
    svgElement('circle', {class: PROGRESS_CLASSES.progressRingTrack}),
    svgElement('path', {
      class: PROGRESS_CLASSES.progressActive,
      d: CIRCULAR_FLAT_PATH,
      pathLength: '100',
    }),
  );
  container.append(wave, stop, ring);
  return container;
}

/**
 * Sets the `d` attribute of the indicator's paths to the shape of its
 * classes: the shapes for browsers without the CSS `d` property (the CSS
 * value replaces them elsewhere), the same ones `<md-gb-progress>` renders.
 */
function syncPaths(element: HTMLElement) {
  const wavy = element.classList.contains(PROGRESS_CLASSES.progressWavy);
  const determinate = element.classList.contains(
    PROGRESS_CLASSES.progressDeterminate,
  );
  const linear = !wavy
    ? LINEAR_FLAT_PATH
    : determinate
      ? LINEAR_WAVY_PATH
      : LINEAR_INDETERMINATE_WAVY_PATH;
  const circular = wavy ? CIRCULAR_WAVY_PATH : CIRCULAR_FLAT_PATH;
  const set = (selector: string, d: string) => {
    for (const path of element.querySelectorAll(selector)) {
      if (path.getAttribute('d') !== d) path.setAttribute('d', d);
    }
  };
  set(`.${PROGRESS_CLASSES.progressWave} > path`, linear);
  set(`.${PROGRESS_CLASSES.progressRing} > path`, circular);
}

const observed = new WeakSet<HTMLElement>();

/** Keeps the path shapes in step with the classes the directive applies. */
function observePaths(element: HTMLElement) {
  if (observed.has(element)) return;
  observed.add(element);
  new MutationObserver(() => syncPaths(element)).observe(element, {
    attributes: true,
    attributeFilter: ['class'],
  });
}

/**
 * Sets up a progress indicator element: adds its parts if the element has
 * none, and a `progressbar` role if it has no role.
 *
 * @param element The progress indicator element.
 */
export function setupProgress(element: HTMLElement): void {
  registerProgressProperties();
  if (!element.hasAttribute('role')) {
    element.setAttribute('role', 'progressbar');
  }
  observePaths(element);
  if (!element.querySelector(`.${PROGRESS_CLASSES.progressContainer}`)) {
    element.append(createProgressContainer());
  }
  syncPaths(element);
}

/**
 * A Lit directive that adds progress indicator styling to its element and
 * creates its parts.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${progress()}" aria-label="Loading"></div>
 *   <div class="${progress({circular: true})}" aria-label="Loading"></div>
 *   <div
 *     class="${progress({determinate: true})}"
 *     style="--progress: 0.4"
 *     aria-label="Downloading"
 *     aria-valuemin="0"
 *     aria-valuemax="100"
 *     aria-valuenow="40"></div>
 * `;
 * ```
 */
export const progress = createClassMapDirective({
  getClasses: progressClasses,
  setupElement: setupProgress,
});
