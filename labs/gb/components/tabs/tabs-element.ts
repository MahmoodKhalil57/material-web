/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type CSSResultOrNative, type PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';
import {AriaTablistElement} from '../../../aria/tabs/tablist.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {clampDensity, type Density} from '../shared/density.js';
import {RovingFocusController} from '../shared/roving-focus.js';
import {SelectionController} from '../shared/selection.js';
import {updateClassList} from '../shared/update-class-list.js';

import tabsStyles from './tabs.css' with {type: 'css'}; // github-only
// import tabsStyles from './tabs.cssresult.js'; // google3-only

import {setupTabs, tabsClasses, type TabsVariant} from './tabs.js';

/**
 * A Material Design tabs component.
 *
 * This is a reference implementation of the `.tabs` utility class. The same
 * class can be applied to any element with `role="tablist"`.
 *
 * @slot - Used to display `<md-gb-tab>` children.
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-height
 * @cssprop --active-indicator-inset
 * @cssprop --active-indicator-min-length
 * @cssprop --active-indicator-shape
 * @cssprop --container-color
 * @cssprop --container-height
 * @cssprop --density-step - Tab height removed per density step.
 * @cssprop --container-shape
 * @cssprop --divider-color
 * @cssprop --divider-thickness
 */
// spec-labels: tabs/specs/primary-tabs, tabs/specs/secondary-tabs, tabs/guidelines/anatomy, tabs/guidelines/usage, tabs/specs/measurements
export class TabsElement extends AriaTablistElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [tabsStyles];

  /**
   * The visual variant of the tabs.
   */
  @property({reflect: true}) variant: TabsVariant = 'primary';

  /**
   * The density, from 0 (default) to -3. Each step down removes 4px from the
   * tabs' height (48px, or 64px with icon and label); values are clamped to
   * that range.
   *
   * tabs.md "Avoid applying density by default": dense tabs are below the
   * 48x48 CSS pixel target, so let people opt in (a denser layout or theme)
   * and keep the controls that change it at 48x48.
   */
  @property({type: Number, reflect: true})
  get density(): Density {
    return this.densityValue;
  }
  set density(density: number) {
    const old = this.densityValue;
    this.densityValue = clampDensity(Number(density));
    this.requestUpdate('density', old);
  }
  private densityValue: Density = 0;

  /**
   * The selection model (shared SelectionController): exactly one tab is
   * selected, by click or Space/Enter (the tab turns the key into a click),
   * with a `change` event for user changes. The controller selects during
   * the click, so the tab list's own click handling finds the tab already
   * selected and does nothing.
   */
  // spec: tabs/accessibility/keyboard-navigation
  protected readonly selectionModel = new SelectionController<HTMLElement>(this, {
    items: () => this.tabs,
    mode: () => 'single',
    required: () => true,
    // The tab list selects the first tab when its tabs change.
    autoSelectFirst: false,
    isSelected: (tab) => this.isTabSelected(tab),
    setSelected: (tab, selected) => this.setTabSelected(tab, selected),
    events: ['change'],
    vetoable: false,
  });

  /**
   * Arrow keys move focus between the tabs (tabs.md, Keyboard navigation:
   * "Use Arrow/Tab to navigate through items"). The tab list declares
   * `focusgroup` for browsers that ship it; Chromium does not, so the shared
   * RovingFocusController implements the arrows. Moving focus doesn't select:
   * Space and Enter activate the focused tab. Home and End go to the first
   * and last tab.
   */
  protected readonly rovingFocus = new RovingFocusController(this, {
    items: () => this.tabs,
    orientation: 'horizontal',
    tabStops: 'all',
  });

  constructor() {
    super();
    setupTabs(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    // Adopt the stylesheet into the scope this element is connected to, so that
    // `.tabs` and the `.tab` children resolve in the same tree scope. The
    // indicator is anchor-positioned and the anchor scope is the connected
    // scope, not the shadow root.
    adoptStyles(this, tabsStyles);
    // Apply initial classes synchronously on connect as a guard against a
    // frame of unstyled content before the first updated lifecycle callback.
    updateClassList(this, this.classes());
  }

  private classes() {
    return tabsClasses({variant: this.variant, density: this.density});
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (changedProperties.has('variant') || changedProperties.has('density')) {
      // The variant modifier is a utility class rather than an attribute
      // selector so that non-element consumers (raw HTML, React, Angular) use
      // the same hook.
      updateClassList(this, this.classes());
    }
  }
}
