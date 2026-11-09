/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, LitElement, nothing, } from 'lit';
import { property, state } from 'lit/decorators.js';
import { adoptStyles } from '../../styles/adopt-styles.js';
import { DisclosureController, reflectedExpandedConverter, } from '../shared/disclosure.js';
import '../iconbutton/md-gb-icon-button.js';
import '../menu/md-gb-menu.js';
import '../menu/md-gb-menu-item.js';
import { OverflowController, overflowIcon, overflowStyles, renderOverflowMenu, } from '../shared/overflow.js';
import { ScrollBehaviorController } from '../shared/scroll-behavior.js';
import { RovingFocusController, } from '../shared/roving-focus.js';
import toolbarStyles from './toolbar.css' with { type: 'css' }; // github-only
// import {styles as toolbarStyles} from './toolbar.cssresult.js'; // google3-only
import { toolbar } from './toolbar.js';
const CONTROL_SELECTOR = 'md-gb-button, md-gb-icon-button, md-gb-split-button, button, a[href], input, select, [tabindex]';
function rovingOptions(host) {
    return {
        items: () => host.controls,
        // Read on every key press: the orientation can change.
        get orientation() {
            return host.orientation === 'vertical' && !host.docked
                ? 'vertical'
                : 'horizontal';
        },
        homeEnd: false,
        tabStops: 'all',
    };
}
/**
 * A Material Design gBreeze toolbar component.
 *
 * Focus not obscured (WCAG 2.4.11): a docked or floating toolbar that stays
 * over scrolling content (sticky or fixed) must not hide focused elements.
 * Register it with `setupScrollPadding()` (`appbar/scroll-padding.js`, as an
 * `end` bar): it sets `scroll-padding-block-end` and
 * `--md-gb-obscured-block-end` on the scroll container so focused elements
 * and their focus indicators scroll clear of the toolbar. Snackbars should
 * appear above the toolbar: set their `anchor` to it.
 *
 * @slot - Used to display toolbar items (buttons, icon buttons, or custom
 *   content).
 * @slot leading - Used to display leading toolbar items.
 * @slot trailing - Used to display trailing toolbar items.
 * @slot fab - An optional FAB (`md-gb-fab`) shown next to a floating
 *     toolbar, colored by the toolbar's `color` (standard: secondary
 *     container, vibrant: tertiary container).
 * @csspart toolbar - The toolbar's root container.
 * @csspart toolbar-with-fab - The toolbar and FAB layout, with a FAB.
 * @cssprop --button-container-color
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-leading-space
 * @cssprop --container-shape
 * @cssprop --container-spacing
 * @cssprop --container-trailing-space
 * @cssprop --docked-container-elevation
 * @cssprop --docked-container-height
 * @cssprop --docked-container-leading-space
 * @cssprop --docked-container-max-spacing
 * @cssprop --docked-container-min-spacing
 * @cssprop --docked-container-shape
 * @cssprop --docked-container-trailing-space
 * @cssprop --horizontal-container-height
 * @cssprop --icon-color
 * @cssprop --label-text-color
 * @cssprop --min-button-size
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 * @cssprop --selected-button-container-color
 * @cssprop --selected-icon-color
 * @cssprop --selected-label-text-color
 * @cssprop --vertical-container-width
 */
// spec-labels: toolbars/guidelines/usage, toolbars/guidelines/anatomy, toolbars/specs/anatomy, toolbars/specs/configurations, toolbars/specs/variants, toolbars/specs/variants/baseline-variant
export class ToolbarElement extends LitElement {
    constructor() {
        super();
        this.internals = this.attachInternals();
        /** The color scheme of the toolbar. */
        this.color = 'standard';
        /** The layout orientation. */
        this.orientation = 'horizontal';
        /** Whether the toolbar is docked across full width. */
        this.docked = false;
        /**
         * Whether a floating toolbar with a FAB shows its items. When `false`,
         * the toolbar collapses and its FAB grows to the medium size (Compose
         * floating toolbar `expanded`). Set `expanded="false"` from markup.
         */
        this.expanded = true;
        /** Which side of a floating toolbar the FAB is on (`end` or `start`). */
        this.fabPosition = 'end';
        this.hasFab = false;
        /** A collapsed floating toolbar with a FAB hides its items (inert). */
        this.disclosure = new DisclosureController(this, {
            region: () => this.renderRoot.querySelector('.toolbar'),
            expanded: () => this.expanded,
            setExpanded: (expanded) => {
                this.expanded = expanded;
            },
            enabled: () => this.hasFab && !this.docked,
            aria: false,
        });
        /**
         * Arrow keys move focus between the controls (toolbars.md: the toolbar
         * declares `focusgroup="toolbar wrap inline|block"`, which Chromium does
         * not ship, so the shared RovingFocusController implements it). Up and
         * Down move in a vertical toolbar, Left and Right in a horizontal one
         * (mirrored in RTL). Every control stays in the tab order ("Use Tab to
         * navigate through all other actions"). Disabled controls are skipped.
         */
        this.rovingFocus = new RovingFocusController(this, rovingOptions(this));
        /**
         * Whether trailing actions that do not fit move into an overflow menu in
         * the trailing slot (toolbars.md, Adaptive design). On by itself when an
         * `overflow` slot trigger is provided; this turns it on with the default
         * "More actions" button.
         */
        this.overflowMenu = false;
        this.hasOverflowSlot = false;
        /**
         * Trailing actions hide, last first, while they do not fit the toolbar's
         * width (the window, the parent or a `max-width` on the toolbar), and
         * return when it grows. The menu in the trailing slot lists them and
         * clicks the original action (toolbars.md: "If there's not enough space
         * for all items, put them in an overflow menu in the trailing slot.").
         */
        this.overflowing = new OverflowController(this, {
            items: () => this.trailingActions,
            container: () => this.renderRoot.querySelector('.toolbar'),
            trigger: () => this.renderRoot
                .querySelector('slot[name=overflow]')
                ?.assignedElements({ flatten: true })[0] ??
                null,
            menu: () => this.renderRoot.querySelector('.overflow-menu'),
            enabled: () => this.overflowMenu || this.hasOverflowSlot,
            axis: () => !this.docked && this.orientation === 'vertical' ? 'block' : 'inline',
        });
        /** The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. */
        this.scrollTarget = '';
        /** Hides and reveals the toolbar on scroll (see `scroll-behavior`). */
        this.scrollController = new ScrollBehaviorController(this, {
            behavior: () => this.scrollBehavior,
            target: () => this.scrollTarget,
            // Past the bottom edge, including a floating toolbar's margin.
            hiddenTransform: 'translateY(calc(100% + 16px))',
        });
        this.internals.role = 'toolbar';
    }
    /**
     * The toolbar's interactive controls in the leading, default and trailing
     * slots.
     *
     * @internal
     */
    get controls() {
        const slots = Array.from(this.renderRoot.querySelectorAll('slot:not([name=fab])'));
        return slots
            .flatMap((slot) => slot.assignedElements({ flatten: true }))
            .filter((el) => el.matches(CONTROL_SELECTOR));
    }
    get trailingActions() {
        const slot = this.renderRoot?.querySelector('slot[name=trailing]');
        return (slot?.assignedElements({ flatten: true }) ?? []);
    }
    connectedCallback() {
        super.connectedCallback();
        adoptStyles(this, toolbarStyles);
    }
    willUpdate() {
        if (this.docked && this.orientation !== 'horizontal') {
            this.orientation = 'horizontal';
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('orientation') ||
            changedProperties.has('docked') ||
            !this.hasAttribute('focusgroup')) {
            const isVertical = !this.docked && this.orientation === 'vertical';
            this.internals.ariaOrientation = isVertical ? 'vertical' : 'horizontal';
            this.setAttribute('focusgroup', `toolbar wrap ${isVertical ? 'block' : 'inline'}`);
        }
    }
    render() {
        const withFab = this.hasFab && !this.docked;
        const bar = html `
      <div
        part="toolbar"
        class="${toolbar({
            color: this.color,
            orientation: this.docked ? 'horizontal' : this.orientation,
            docked: this.docked,
        })}">
        <slot name="leading"></slot>
        <slot></slot>
        <slot name="trailing" @slotchange=${this.handleTrailingSlotChange}></slot>
        <slot name="overflow" @slotchange=${this.handleOverflowSlotChange}
          >${this.overflowMenu
            ? html `<md-gb-icon-button
                class="overflow-trigger"
                aria-label="More actions"
                >${overflowIcon}</md-gb-icon-button
              >`
            : nothing}</slot
        >
        ${renderOverflowMenu(this.overflowing)}
      </div>
    `;
        const fabSlot = html `<slot
      name="fab"
      @slotchange=${this.handleFabSlotChange}></slot>`;
        if (!withFab) {
            return html `${bar}${fabSlot}`;
        }
        const vertical = this.orientation === 'vertical';
        const classes = [
            'toolbar-with-fab',
            `toolbar-with-fab-${this.color}`,
            vertical ? 'toolbar-with-fab-vertical' : '',
            this.fabPosition === 'start' ? 'toolbar-with-fab-start' : '',
            this.expanded ? '' : 'toolbar-with-fab-collapsed',
        ].join(' ');
        return html `<div part="toolbar-with-fab" class=${classes}>
      ${bar}${fabSlot}
    </div>`;
    }
    handleTrailingSlotChange() {
        this.overflowing.refresh();
    }
    handleOverflowSlotChange(event) {
        const slot = event.target;
        this.hasOverflowSlot = slot.assignedElements().length > 0;
    }
    handleFabSlotChange(event) {
        const slot = event.target;
        this.hasFab = slot.assignedElements({ flatten: true }).length > 0;
    }
}
/** @nocollapse */
ToolbarElement.styles = [
    toolbarStyles,
    overflowStyles,
    css `
      :host {
        display: inline-flex;
        max-inline-size: 100%;
      }

      :host([docked]) {
        display: flex;
        width: 100%;
      }

      :host([docked]) [part='toolbar'] {
        width: 100%;
      }
    `,
];
__decorate([
    property({ reflect: true })
], ToolbarElement.prototype, "color", void 0);
__decorate([
    property({ reflect: true })
], ToolbarElement.prototype, "orientation", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], ToolbarElement.prototype, "docked", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: reflectedExpandedConverter,
    })
], ToolbarElement.prototype, "expanded", void 0);
__decorate([
    property({ attribute: 'fab-position', reflect: true })
], ToolbarElement.prototype, "fabPosition", void 0);
__decorate([
    state()
], ToolbarElement.prototype, "hasFab", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'overflow-menu' })
], ToolbarElement.prototype, "overflowMenu", void 0);
__decorate([
    state()
], ToolbarElement.prototype, "hasOverflowSlot", void 0);
__decorate([
    property({ attribute: 'scroll-behavior', reflect: true })
], ToolbarElement.prototype, "scrollBehavior", void 0);
__decorate([
    property({ attribute: 'scroll-target' })
], ToolbarElement.prototype, "scrollTarget", void 0);
//# sourceMappingURL=toolbar-element.js.map