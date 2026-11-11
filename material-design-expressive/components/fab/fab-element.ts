/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property} from 'lit/decorators.js';
import '../tooltip/md-gb-tooltip.js';
import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../internal/aria/delegate.js';
import {
  DisclosureController,
  expandedUnlessFalseConverter,
} from '../shared/disclosure.js';

import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../../foundations/interaction/states/ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../../foundations/interaction/states/ripple/ripple.cssresult.js'; // google3-only
import fabStyles from './fab.css' with {type: 'css'}; // github-only
// import {styles as fabStyles} from './fab.cssresult.js'; // google3-only

import {
  fab,
  FAB_CLASSES,
  setupCollapseOnScroll,
  type FabColor,
  type FabSize,
} from './fab.js';

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(LitElement);

// spec-labels: extended-fab/specs/anatomy, extended-fab/guidelines/anatomy, extended-fab/specs/variants,
// spec-labels: extended-fab/specs/baseline-extended-fab,
// spec-labels: extended-fab/specs/baseline-extended-fab/baseline-measurements,
// spec-labels: extended-fab/specs/variants/baseline-variants, extended-fab/guidelines/behavior/scrolling,
// spec-labels: extended-fab/guidelines/responsive-layout/breakpoints,
// spec-labels: floating-action-button/guidelines/usage,
// spec-labels: floating-action-button/specs/variants/baseline-variants,
// spec-labels: floating-action-button/specs/anatomy, floating-action-button/guidelines/anatomy,
// spec-labels: floating-action-button/specs/variants, floating-action-button/specs/configurations
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
export class FabElement extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    fabStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }
      .fab {
        flex: 1;
      }
    `,
  ];

  @property() color: FabColor = 'primary-container';

  /**
   * The size. With a `label`, `default`, `md` and `lg` are the small, medium
   * and large extended FABs. `sm` is the small (40dp) icon-only FAB, which
   * the spec no longer recommends.
   */
  @property() size: FabSize = 'default';

  /** The extended FAB's label. Without one, the FAB is icon-only. */
  @property() label = '';

  /**
   * Whether the extended FAB shows its label. When `false`, the label
   * collapses and the FAB becomes an icon-only FAB. Set the attribute to
   * `expanded="false"` to collapse it from markup.
   */
  @property({type: Boolean, converter: expandedUnlessFalseConverter})
  expanded = true;

  /**
   * Shows a tooltip with the FAB's name (the `label`, else `aria-label`) on
   * hover and keyboard focus. On by default for an icon-only FAB, whose icon
   * has no visible text (floating-action-button.md: on web, a FAB should
   * display a tooltip with its text label); `tooltip="false"` turns it off.
   */
  @property({type: Boolean, converter: expandedUnlessFalseConverter})
  tooltip = true;

  /**
   * Opt-in: the `id` of a scroll container (in the same root), or `window`.
   * The FAB collapses while it scrolls down and expands while it scrolls up.
   */
  @property({attribute: 'scroll-target'}) scrollTarget = '';

  private scrollCleanup?: AbortController;

  /**
   * Collapsing and expanding on scroll fire a cancelable `toggle` event
   * first, so an app can keep the label.
   */
  private readonly disclosure = new DisclosureController(this, {
    expanded: () => this.expanded,
    setExpanded: (expanded) => {
      this.expanded = expanded;
    },
    aria: false,
  });

  override connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated) this.listenToScroll();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.scrollCleanup?.abort();
    this.scrollCleanup = undefined;
  }

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    const label = this.label
      ? html`<span part="label" class="${FAB_CLASSES.fabLabel}"
          >${this.label}</span
        >`
      : nothing;
    const name = this.label || ariaLabel;
    const iconOnly = !this.label || !this.expanded;
    const tooltip =
      this.tooltip && iconOnly && name
        ? html`<md-gb-tooltip for="fab">${name}</md-gb-tooltip>`
        : nothing;
    return html`<button
      id="fab"
      part="fab"
      class="${fab({
        color: this.color,
        size: this.size,
        expanded: this.expanded,
      })}"
      aria-label=${ariaLabel || nothing}>
      <slot></slot>${label}
    </button>${tooltip}`;
  }

  protected override updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has('scrollTarget')) this.listenToScroll();
  }

  private listenToScroll() {
    this.scrollCleanup?.abort();
    this.scrollCleanup = undefined;
    const target = this.resolveScrollTarget();
    if (!target) return;
    this.scrollCleanup = new AbortController();
    setupCollapseOnScroll(
      target,
      (expanded) => {
        if (expanded) {
          this.disclosure.expand();
        } else {
          this.disclosure.collapse();
        }
      },
      {signal: this.scrollCleanup.signal},
    );
  }

  private resolveScrollTarget(): Element | Window | null {
    const id = this.scrollTarget;
    if (!id) return null;
    if (id === 'window') return window;
    const root = this.getRootNode() as Document | ShadowRoot;
    return root.getElementById?.(id) ?? document.getElementById(id);
  }
}
