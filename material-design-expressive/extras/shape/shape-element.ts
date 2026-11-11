/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, html, LitElement, svg, type CSSResultOrNative, type PropertyValues} from 'lit';
import {property, state} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

import {MATERIAL_SHAPES} from '../../styles/shape/material-shapes.js';

/** The name of one of the 35 Material shapes. */
export type MaterialShapeName = keyof typeof MATERIAL_SHAPES;

/** The color role that fills a shape; `current` is the text color. */
export type ShapeColor =
  | 'current'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'primary-container'
  | 'secondary-container'
  | 'tertiary-container'
  | 'error-container'
  | 'surface-container-highest';

type MorphPaths = readonly [string, string];

/** The morph paths, loaded once, by the first shape that morphs. */
let morphs: Promise<Readonly<Record<string, MorphPaths>>> | undefined;
function loadMorphs() {
  morphs ??= import('./shape-morphs.js').then((m) => m.SHAPE_MORPHS);
  return morphs;
}

/**
 * A Material shape (m3.material.io/styles/shape), for decorative moments
 * such as illustrations and backgrounds. The shape is decorative: it is
 * hidden from assistive technology, so put its meaning in text.
 *
 * With `to`, the shape can morph into another Material shape
 * (m3.material.io/styles/shape/shape-morph): set `morphed` to show `to`,
 * for example while the surface around it is hovered or focused, or `loop`
 * to morph back and forth. Morphs follow the spatial springs of the motion
 * tokens, so they stop when motion is reduced. The pairs that morph are the
 * keys of `SHAPE_MORPHS` (`shape-morphs.js`), in either direction; a shape
 * without a morph to `to` stays still.
 *
 * Content, such as an icon, is centered on the shape, in the `on-` color of
 * the fill's role (`on-primary-container` on `primary-container`).
 *
 * @slot - Content centered on the shape.
 * @csspart shape - The SVG of the shape.
 */
export class ShapeElement extends LitElement {
  static override styles: CSSResultOrNative[] = [
    css`
      :host {
        display: inline-grid;
        place-items: center;
        line-height: 0;
        vertical-align: middle;
      }
      :host([hidden]) {
        display: none;
      }
      :host([color='primary']) {
        --_fill: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
      }
      :host([color='secondary']) {
        --_fill: var(--md-sys-color-secondary);
        color: var(--md-sys-color-on-secondary);
      }
      :host([color='tertiary']) {
        --_fill: var(--md-sys-color-tertiary);
        color: var(--md-sys-color-on-tertiary);
      }
      :host([color='primary-container']) {
        --_fill: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
      }
      :host([color='secondary-container']) {
        --_fill: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }
      :host([color='tertiary-container']) {
        --_fill: var(--md-sys-color-tertiary-container);
        color: var(--md-sys-color-on-tertiary-container);
      }
      :host([color='error-container']) {
        --_fill: var(--md-sys-color-error-container);
        color: var(--md-sys-color-on-error-container);
      }
      :host([color='surface-container-highest']) {
        --_fill: var(--md-sys-color-surface-container-highest);
        color: var(--md-sys-color-on-surface-variant);
      }
      svg,
      .content {
        grid-area: 1 / 1;
      }
      svg {
        display: block;
        fill: var(--_fill, currentColor);
        overflow: visible;
      }
      .content {
        line-height: normal;
      }
      @supports (d: path('M0 0')) {
        .morph path {
          d: var(--_from);
          transition: d var(--md-sys-motion-spring-default-spatial-duration, 420ms)
            var(--md-sys-motion-spring-default-spatial, ease);
        }
        :host([morphed]) .morph path {
          d: var(--_to);
        }
        /* Holds, morphs, holds and morphs back, on the slow spatial spring
           (about 8s: 14 times its duration, so 0s, no loop, under reduced
           motion). A delay of 1-3 starts it a quarter of the loop later. */
        :host([loop]) .morph path {
          --_loop: calc(var(--md-sys-motion-spring-slow-spatial-duration, 570ms) * 14);
          animation: shape-morph-loop var(--_loop) infinite;
          animation-delay: calc(var(--_loop) * var(--_delay, 0) / -4);
          transition: none;
        }
      }
      @keyframes shape-morph-loop {
        0% {
          d: var(--_from);
          animation-timing-function: linear;
        }
        35% {
          d: var(--_from);
          animation-timing-function: var(--md-sys-motion-spring-slow-spatial, ease);
        }
        50% {
          d: var(--_to);
          animation-timing-function: linear;
        }
        85% {
          d: var(--_to);
          animation-timing-function: var(--md-sys-motion-spring-slow-spatial, ease);
        }
        100% {
          d: var(--_from);
        }
      }
    `,
  ];

  /** The Material shape. */
  @property() shape: MaterialShapeName = 'circle';

  /** The Material shape it morphs into (with `morphed` or `loop`). */
  @property() to: MaterialShapeName | '' = '';

  /** Shows the `to` shape, morphing into it. */
  @property({type: Boolean, reflect: true}) morphed = false;

  /** Morphs into `to` and back, in a loop. */
  @property({type: Boolean, reflect: true}) loop = false;

  /** Starts the loop 1, 2 or 3 quarters later, so shapes don't morph together. */
  @property({type: Number}) delay: 0 | 1 | 2 | 3 = 0;

  /** The color role of the fill. */
  @property({reflect: true}) color: ShapeColor = 'current';

  /** The width and height, in pixels. */
  @property({type: Number}) size = 48;

  @state() private paths: MorphPaths | null = null;

  protected override willUpdate(changed: PropertyValues<this>) {
    if (changed.has('shape') || changed.has('to')) this.loadPaths();
  }

  private async loadPaths() {
    const {shape, to} = this;
    if (!to || to === shape) {
      this.paths = null;
      return;
    }
    const table = await loadMorphs();
    if (this.shape !== shape || this.to !== to) return; // Changed meanwhile.
    const forward = table[`${shape}:${to}`];
    const back = table[`${to}:${shape}`];
    this.paths = forward ?? (back ? [back[1], back[0]] : null);
  }

  protected override render() {
    const size = `${Math.max(0, this.size)}px`;
    const paths = this.paths;
    const style = paths
      ? {'--_from': `path('${paths[0]}')`, '--_to': `path('${paths[1]}')`, '--_delay': String(this.delay)}
      : {};
    return html`<svg
      part="shape"
      class=${paths ? 'morph' : ''}
      viewBox="0 0 1 1"
      width=${size}
      height=${size}
      aria-hidden="true"
      focusable="false"
      style=${styleMap(style)}>${svg`<path d=${MATERIAL_SHAPES[this.shape] ?? MATERIAL_SHAPES.circle}></path>`}</svg
      ><div class="content"><slot></slot></div>`;
  }
}
