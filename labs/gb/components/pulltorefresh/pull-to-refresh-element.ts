/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../loadingindicator/md-gb-loading-indicator.js';

import {
  css,
  CSSResultOrNative,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  svg,
} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

import pullToRefreshStyles from './pull-to-refresh.css' with {type: 'css'}; // github-only
// import {styles as pullToRefreshStyles} from './pull-to-refresh.cssresult.js'; // google3-only

import {
  PULL_TO_REFRESH_THRESHOLD_PX,
  pullToRefreshArrow,
  pullToRefreshClasses,
  PullToRefreshGesture,
  type PullToRefreshIndicator,
} from './pull-to-refresh.js';

/** Default accessible name of the indicator (spec: "refreshing page"). */
const DEFAULT_LABEL = 'Refreshing';

/** Compose arrow geometry (dp): ArcRadius, StrokeWidth, ArrowWidth/Height. */
const ARC_RADIUS = 5.5;
const STROKE_WIDTH = 2.5;
const ARROW_WIDTH = 10;
const ARROW_HEIGHT = 5;
/** Compose SpinnerSize (16dp): the arrow canvas. */
const SPINNER_SIZE = 16;

/**
 * A Material Design pull to refresh container, after Jetpack Compose
 * `PullToRefreshBox`.
 *
 * Its content scrolls inside it (give it a height). Pulling down while the
 * content is at its top drags an indicator down from the top edge; releasing
 * it past the threshold fires `refresh` and sets `refreshing`, which keeps the
 * indicator in view until the app sets `refreshing` back to false. Releasing
 * before the threshold, or pulling back up, cancels.
 *
 * The default indicator is the M3 Expressive contained loading indicator,
 * which morphs with the pull and then turns while refreshing; set
 * `indicator="circular"` for the baseline circular arrow indicator.
 *
 * Accessibility: pulling is not available to everyone, so also provide
 * another way to refresh with a single pointer or the keyboard, such as a
 * refresh button in the top app bar, and call `refresh()` from it. While
 * refreshing, the indicator is a labelled `progressbar` and the label is
 * announced.
 *
 * @slot - The scrolling content.
 * @csspart scroller - The element that scrolls the content.
 * @csspart indicator - The indicator container.
 * @fires {Event} refresh - Fired when a pull (or `refresh()`) starts a
 *     refresh. Cancel it to keep `refreshing` false. --cancelable
 * @cssprop --indicator-color
 * @cssprop --indicator-container-color
 * @cssprop --indicator-container-height
 * @cssprop --indicator-container-shape
 * @cssprop --indicator-container-width
 * @cssprop --indicator-elevation
 * @cssprop --indicator-max-distance - How far the indicator moves below the
 *     top edge at the threshold.
 * @cssprop --motion-effects-duration
 * @cssprop --motion-effects-easing
 * @cssprop --motion-settle-duration
 * @cssprop --motion-settle-easing
 */
export class PullToRefreshElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    pullToRefreshStyles,
    css`
      :host {
        display: block;
        position: relative;
      }

      :host([hidden]) {
        display: none;
      }
    `,
  ];

  /**
   * Whether content is refreshing. Set by a pull past the threshold (or
   * `refresh()`); set it back to false once the content has refreshed.
   */
  @property({type: Boolean, reflect: true}) refreshing = false;

  /** Whether pulling is turned off (Compose `enabled = false`). */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * How far (px) the indicator must be pulled before releasing it refreshes
   * (Compose `PullToRefreshDefaults.PositionalThreshold`, 80dp).
   */
  @property({type: Number}) threshold = PULL_TO_REFRESH_THRESHOLD_PX;

  /**
   * The indicator: `loading` (M3 Expressive contained loading indicator) or
   * `circular` (circular arrow and progress indicator).
   */
  @property({reflect: true}) indicator: PullToRefreshIndicator = 'loading';

  /** Accessible label of the indicator, e.g. "Refreshing news". */
  @property({attribute: 'indicator-label'}) indicatorLabel = DEFAULT_LABEL;

  /** The pull fraction (1 at the threshold), kept after a pull ends. */
  @state() private fraction = 0;
  @state() private pulling = false;

  @query('.pull-to-refresh-scroller')
  private readonly scroller!: HTMLElement | null;

  private gesture: PullToRefreshGesture | null = null;

  override connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated) {
      this.connectGesture();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.gesture?.disconnect();
    this.gesture = null;
    this.pulling = false;
  }

  /**
   * Starts a refresh without a gesture, e.g. from a refresh button: fires
   * `refresh` and, unless it is cancelled, sets `refreshing`.
   *
   * @return Whether a refresh started.
   */
  refresh(): boolean {
    if (this.refreshing) {
      return false;
    }
    if (!this.dispatchEvent(new Event('refresh', {cancelable: true}))) {
      return false;
    }
    this.refreshing = true;
    return true;
  }

  protected override firstUpdated() {
    this.connectGesture();
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    super.willUpdate(changed);
    if (changed.has('refreshing') && this.refreshing) {
      // Compose animateToThreshold: the indicator rests at the threshold.
      this.fraction = 1;
    }
  }

  protected override render() {
    const showing = this.pulling || this.refreshing;
    return html`
      <div
        class=${classMap(
          pullToRefreshClasses({
            indicator: this.indicator,
            pulling: this.pulling,
            refreshing: this.refreshing,
            disabled: this.disabled,
          }),
        )}
        style=${styleMap(
          this.pulling
            ? {'--pull-to-refresh-fraction': String(this.fraction)}
            : {},
        )}>
        <div part="scroller" class="pull-to-refresh-scroller">
          <slot></slot>
        </div>
        <div
          part="indicator"
          class="pull-to-refresh-indicator"
          aria-hidden=${showing ? nothing : 'true'}>
          ${this.indicator === 'circular'
            ? this.renderCircular()
            : this.renderLoading()}
        </div>
        <div class="pull-to-refresh-status" role="status">
          ${this.refreshing ? this.indicatorLabel : nothing}
        </div>
      </div>
    `;
  }

  private renderLoading() {
    const progress = this.fraction;
    // Past the threshold the whole indicator keeps turning.
    const rotate = !this.refreshing && progress > 1 ? -(progress - 1) * 180 : 0;
    return html`<span
      class="pull-to-refresh-loading"
      style=${styleMap(rotate ? {rotate: `${rotate}deg`} : {})}>
      <md-gb-loading-indicator
        contained
        aria-label=${this.indicatorLabel}
        .value=${this.refreshing ? undefined : Math.min(1, progress)}>
      </md-gb-loading-indicator>
    </span>`;
  }

  private renderCircular() {
    const progress = this.fraction;
    const values = pullToRefreshArrow(progress);
    const c = SPINNER_SIZE / 2;
    const r = ARC_RADIUS + STROKE_WIDTH / 2;
    const point = (deg: number) => {
      const rad = (deg * Math.PI) / 180;
      return `${c + r * Math.cos(rad)} ${c + r * Math.sin(rad)}`;
    };
    const sweep = values.endAngle - values.startAngle;
    const arc =
      sweep > 0
        ? `M ${point(values.startAngle)} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${point(values.endAngle)}`
        : '';
    // The arrow head, drawn at 3 o'clock then turned to the arc's end.
    const w = ARROW_WIDTH * values.scale;
    const h = ARROW_HEIGHT * values.scale;
    const x = r + c - w / 2;
    const y = c - STROKE_WIDTH;
    const arrow = `M ${x} ${y} L ${x + w / 2} ${y + h} L ${x + w} ${y}`;
    const determinate = progress > 0 && !this.refreshing;
    return html`<span class="pull-to-refresh-circular-stack">
      <svg
        class="pull-to-refresh-arrow"
        viewBox="0 0 ${SPINNER_SIZE} ${SPINNER_SIZE}"
        role="progressbar"
        aria-label=${this.indicatorLabel}
        aria-hidden=${this.refreshing ? 'true' : nothing}
        aria-valuemin=${determinate ? 0 : nothing}
        aria-valuemax=${determinate ? 100 : nothing}
        aria-valuenow=${determinate
          ? Math.round(Math.min(1, progress) * 100)
          : nothing}
        style="--_alpha: ${values.alpha}">
        ${svg`<g class="pull-to-refresh-arrow-arc"
          transform="rotate(${values.rotation} ${c} ${c})">
          <path d=${arc}></path>
          <path d=${arrow}
            transform="rotate(${values.endAngle - STROKE_WIDTH} ${c} ${c})"></path>
        </g>`}
      </svg>
      <svg
        class="pull-to-refresh-spinner"
        viewBox="0 0 ${SPINNER_SIZE} ${SPINNER_SIZE}"
        role=${this.refreshing ? 'progressbar' : nothing}
        aria-label=${this.refreshing ? this.indicatorLabel : nothing}
        aria-hidden=${this.refreshing ? nothing : 'true'}>
        ${svg`<circle cx=${c} cy=${c} r=${r}></circle>`}
      </svg>
    </span>`;
  }

  private connectGesture() {
    if (this.gesture) {
      this.gesture.syncScroller();
      return;
    }
    const container = this.renderRoot.querySelector<HTMLElement>(
      '.pull-to-refresh',
    );
    if (!container) {
      return;
    }
    this.gesture = new PullToRefreshGesture(container, {
      scroller: () => this.scroller,
      threshold: () => this.threshold,
      enabled: () => !this.disabled && !this.refreshing,
      onPull: (fraction) => {
        this.fraction = fraction;
        this.pulling = fraction > 0;
      },
      onRelease: (refresh) => {
        // Otherwise (Compose animateToHidden) the indicator returns above
        // the edge; the fraction stays so it keeps its shape on the way.
        this.pulling = false;
        if (refresh) {
          this.refresh();
        }
      },
    });
  }
}
