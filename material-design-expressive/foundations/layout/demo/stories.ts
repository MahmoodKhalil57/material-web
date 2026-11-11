/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as layoutStyles} from '@material/web/foundations/layout/md-layout-tokens.cssresult.js';
import {
  observeFold,
  simulateViewportSegments,
} from '@material/web/foundations/layout/viewport-segments.js';
import {
  observeWindowSizeClasses,
  WINDOW_HEIGHT_CLASS_VALUES,
  WINDOW_HEIGHT_CLASSES,
  WINDOW_SIZE_CLASS_VALUES,
  WINDOW_SIZE_CLASSES,
} from '@material/web/foundations/layout/window-size-class.js';
import {css, html, nothing} from 'lit';
import {ref} from 'lit/directives/ref.js';

import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

/** Knob types for layout stories. */
export interface StoryKnobs {
  showColumns: boolean;
}

adoptStyles(document, [m3Styles, layoutStyles]);

const styles = css`
  ${layoutStyles}

  .demo {
    color: var(--md-sys-color-on-surface);
    display: flex;
    flex-direction: column;
    font: var(--md-sys-typescale-body-md);
    gap: 16px;
    padding: 16px;
  }

  .demo-scroller {
    overflow-x: auto;
  }

  /* A resizable stand-in for the window. */
  .frame {
    background: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 16px;
    box-sizing: border-box;
    inline-size: 900px;
    min-block-size: 200px;
    min-inline-size: 320px;
    overflow: hidden;
    resize: both;
  }

  .readout {
    font: var(--md-sys-typescale-title-md);
    padding: 16px var(--md-sys-layout-margin);
  }

  .md-layout-grid {
    min-block-size: 240px;
    padding-block-end: 16px;
  }

  .column {
    background: color-mix(
      in srgb,
      var(--md-sys-color-primary) 12%,
      transparent
    );
    border-radius: 4px;
    min-block-size: 200px;
  }

  /* Show as many column overlays as the class has columns (4 / 8 / 12). */
  @container md-window (width < 1200px) {
    .column:nth-child(n + 9) {
      display: none;
    }
  }

  @container md-window (width < 600px) {
    .column:nth-child(n + 5) {
      display: none;
    }
  }

  .content {
    background: var(--md-sys-color-secondary-container);
    border-radius: var(--md-sys-shape-corner-md);
    color: var(--md-sys-color-on-secondary-container);
    grid-column: 1 / -1;
    grid-row: 1;
    padding: 16px;
    z-index: 1;
  }

  .content.with-columns {
    align-self: start;
  }

  table {
    border-collapse: collapse;
    font: var(--md-sys-typescale-body-md);
  }

  th,
  td {
    border-block-end: 1px solid var(--md-sys-color-outline-variant);
    padding: 8px 12px;
    text-align: start;
  }
`;

const classOf = (min: number, max: number | null) =>
  max === null ? `${min}px and up` : `${min}–${max - 1}px`;

const windowClasses: MaterialStoryInit<StoryKnobs> = {
  name: 'Window size classes and grid',
  styles,
  render({showColumns}) {
    const observe = (el?: Element) => {
      if (!(el instanceof HTMLElement) || el.dataset['observed']) return;
      el.dataset['observed'] = 'true';
      const out = el.querySelector('.readout')!;
      observeWindowSizeClasses(el, ({width: cls, height}, width, h) => {
        const v = WINDOW_SIZE_CLASS_VALUES[cls];
        out.textContent = `${cls} (${Math.round(width)}px), ${height} height (${Math.round(h)}px): ${v.columns} columns, ${v.margin}px margins, ${v.spacer}px spacer`;
      });
    };
    return html`<div class="demo">
      <p>
        Drag the frame's corner (width and height). The frame is a
        <code>.md-window</code> size container, so its children get the
        <code>--md-sys-layout-*</code> tokens of its width, and
        <code>.md-layout-grid</code> lays content on the class's columns inside
        its margins.
      </p>
      <div class="demo-scroller">
        <div class="frame md-window" ${ref(observe)}>
          <div class="readout"></div>
          <div class="md-layout-grid">
            ${showColumns
              ? Array.from(
                  {length: 12},
                  (_, i) =>
                    html`<div
                      class="column"
                      style="grid-area: 1 / ${i + 1}"></div>`,
                )
              : nothing}
            <div class="content ${showColumns ? 'with-columns' : ''}">
              Content spans every column, between the window margins.
            </div>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Width</th>
            <th>Margin</th>
            <th>Spacer</th>
            <th>Fixed pane</th>
            <th>Columns</th>
            <th>Panes</th>
          </tr>
        </thead>
        <tbody>
          ${WINDOW_SIZE_CLASSES.map((cls) => {
            const v = WINDOW_SIZE_CLASS_VALUES[cls];
            return html`<tr>
              <td>${cls}</td>
              <td>${classOf(v.minWidth, v.maxWidth)}</td>
              <td>${v.margin}px</td>
              <td>${v.spacer}px</td>
              <td>${v.fixedPaneWidth}px</td>
              <td>${v.columns}</td>
              <td>
                ${v.panesRecommended}${v.panesMax > v.panesRecommended
                  ? ` (up to ${v.panesMax})`
                  : ''}
              </td>
            </tr>`;
          })}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Height class</th>
            <th>Height</th>
          </tr>
        </thead>
        <tbody>
          ${WINDOW_HEIGHT_CLASSES.map((cls) => {
            const v = WINDOW_HEIGHT_CLASS_VALUES[cls];
            return html`<tr>
              <td>${cls}</td>
              <td>${classOf(v.minHeight, v.maxHeight)}</td>
            </tr>`;
          })}
        </tbody>
      </table>
      <p>
        Height classes come from the spec's height breakpoints (ranges from the
        Android window size classes it links to). Most layouts scroll vertically
        and rarely adjust to height; the app scaffold keeps a navigation rail in
        compact-height windows.
      </p>
    </div>`;
  },
};

const folds: MaterialStoryInit<StoryKnobs> = {
  name: 'Foldables',
  styles,
  render() {
    const watch = (el?: Element) => {
      if (!(el instanceof HTMLElement) || el.dataset['observed']) return;
      el.dataset['observed'] = 'true';
      observeFold((fold) => {
        el.textContent = fold
          ? `${fold.orientation} fold at ${fold.orientation === 'vertical' ? `x = ${fold.x}px` : `y = ${fold.y}px`}, ${fold.orientation === 'vertical' ? fold.width : fold.height}px wide`
          : 'No fold: the viewport is one segment (or the browser has no Viewport Segments API).';
      });
    };
    const simulate = (kind: 'vertical' | 'horizontal' | 'none') => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      simulateViewportSegments(
        kind === 'none'
          ? undefined
          : kind === 'vertical'
            ? [
                {x: 0, y: 0, width: w / 2 - 10, height: h},
                {x: w / 2 + 10, y: 0, width: w / 2 - 10, height: h},
              ]
            : [
                {x: 0, y: 0, width: w, height: h / 2},
                {x: 0, y: h / 2, width: w, height: h / 2},
              ],
      );
    };
    return html`<div class="demo">
      <p>
        On foldable and dual-screen devices the Viewport Segments API
        (<code>window.viewport.segments</code>,
        <code>horizontal-viewport-segments</code> /
        <code>vertical-viewport-segments</code>) reports the fold. The spec
        defines the fold as "a flexible area of the screen or a hinge that
        separates two displays" and the spacer as "the space between two panes
        on a foldable device": <code>md-gb-pane-scaffold</code> splits its panes
        at the fold. In CSS, <code>md-layout-tokens.css</code> sets
        <code>--md-sys-layout-fold-left</code> / <code>-width</code> (or
        <code>-top</code> / <code>-height</code>) from
        <code>env(viewport-segment-*)</code>.
      </p>
      <div class="readout" ${ref(watch)}></div>
      <div>
        <button type="button" @click=${() => simulate('vertical')}>
          Simulate a vertical hinge
        </button>
        <button type="button" @click=${() => simulate('horizontal')}>
          Simulate tabletop
        </button>
        <button type="button" @click=${() => simulate('none')}>Reset</button>
      </div>
    </div>`;
  },
};

/** Layout demo stories. */
export const stories = [windowClasses, folds];
