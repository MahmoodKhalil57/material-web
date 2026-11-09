/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import '../loadingindicator/md-gb-loading-indicator.js';
import { CSSResultOrNative, LitElement, type PropertyValues } from 'lit';
import { type PullToRefreshIndicator } from './pull-to-refresh.js';
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
export declare class PullToRefreshElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * Whether content is refreshing. Set by a pull past the threshold (or
     * `refresh()`); set it back to false once the content has refreshed.
     */
    refreshing: boolean;
    /** Whether pulling is turned off (Compose `enabled = false`). */
    disabled: boolean;
    /**
     * How far (px) the indicator must be pulled before releasing it refreshes
     * (Compose `PullToRefreshDefaults.PositionalThreshold`, 80dp).
     */
    threshold: number;
    /**
     * The indicator: `loading` (M3 Expressive contained loading indicator) or
     * `circular` (circular arrow and progress indicator).
     */
    indicator: PullToRefreshIndicator;
    /** Accessible label of the indicator, e.g. "Refreshing news". */
    indicatorLabel: string;
    /** The pull fraction (1 at the threshold), kept after a pull ends. */
    private fraction;
    private pulling;
    private readonly scroller;
    private gesture;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Starts a refresh without a gesture, e.g. from a refresh button: fires
     * `refresh` and, unless it is cancelled, sets `refreshing`.
     *
     * @return Whether a refresh started.
     */
    refresh(): boolean;
    /** Announces that content is refreshing (polite). */
    private readonly announcer;
    protected firstUpdated(): void;
    protected updated(changed: PropertyValues<this>): void;
    protected willUpdate(changed: PropertyValues<this>): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private renderLoading;
    private renderCircular;
    private connectGesture;
}
