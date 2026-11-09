/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
import '../tooltip/md-gb-tooltip.js';
import { type FabColor, type FabSize } from './fab.js';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement>;
/**
 * A Material Design FAB, or an extended FAB when it has a `label`.
 *
 * An icon-only FAB needs an `aria-label`. An extended FAB's label is its
 * accessible name, also while it is collapsed.
 *
 * Focus not obscured (WCAG 2.4.11; FAB, FAB menu and snackbar spec pages):
 * a FAB fixed over scrolling content must not completely hide a focused
 * element or its focus indicator. Register it with `setupScrollPadding()`
 * (`appbar/scroll-padding.js`, as an `end` bar) so focused elements scroll
 * clear of it, and set a snackbar's `anchor` to the FAB so the snackbar
 * appears above it instead of covering it.
 *
 * @slot - The icon. Text placed here is shown but does not collapse; use
 *     `label` for an extended FAB.
 * @csspart fab - The FAB's root element.
 * @csspart label - The extended FAB's label.
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height
 * @cssprop --container-shape
 * @cssprop --container-width
 * @cssprop --icon-color
 * @cssprop --icon-label-space
 * @cssprop --icon-size
 * @cssprop --label-text
 * @cssprop --label-text-axes
 * @cssprop --label-text-color
 * @cssprop --label-text-tracking
 * @cssprop --leading-space
 * @cssprop --trailing-space
 */
export declare class FabElement extends baseClass {
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    color: FabColor;
    /**
     * The size. With a `label`, `default`, `md` and `lg` are the small, medium
     * and large extended FABs. `sm` is the small (40dp) icon-only FAB, which
     * the spec no longer recommends.
     */
    size: FabSize;
    /** The extended FAB's label. Without one, the FAB is icon-only. */
    label: string;
    /**
     * Whether the extended FAB shows its label. When `false`, the label
     * collapses and the FAB becomes an icon-only FAB. Set the attribute to
     * `expanded="false"` to collapse it from markup.
     */
    expanded: boolean;
    /**
     * Shows a tooltip with the FAB's name (the `label`, else `aria-label`) on
     * hover and keyboard focus. On by default for an icon-only FAB, whose icon
     * has no visible text (floating-action-button.md: on web, a FAB should
     * display a tooltip with its text label); `tooltip="false"` turns it off.
     */
    tooltip: boolean;
    /**
     * Opt-in: the `id` of a scroll container (in the same root), or `window`.
     * The FAB collapses while it scrolls down and expands while it scrolls up.
     */
    scrollTarget: string;
    private scrollCleanup?;
    /**
     * Collapsing and expanding on scroll fire a cancelable `toggle` event
     * first, so an app can keep the label.
     */
    private readonly disclosure;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1>;
    protected updated(changed: Map<PropertyKey, unknown>): void;
    private listenToScroll;
    private resolveScrollTarget;
}
export {};
