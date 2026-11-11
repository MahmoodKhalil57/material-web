/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/button/md-gb-button.js';
import '@material/web/components/tooltip/md-gb-tooltip.js';
import '@material/web/styles/icons/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {button} from '@material/web/components/button/button.js';
import {styles as buttonStyles} from '@material/web/components/button/button.cssresult.js';
import {styles as focusRingStyles} from '@material/web/foundations/interaction/states/focus/focus-ring.cssresult.js';
import {iconButton} from '@material/web/components/iconbutton/icon-button.js';
import {styles as iconButtonStyles} from '@material/web/components/iconbutton/icon-button.cssresult.js';
import {styles as rippleStyles} from '@material/web/foundations/interaction/states/ripple/ripple.cssresult.js';
import {
  tooltip,
  type TooltipPlacement,
  type TooltipSide,
} from '@material/web/components/tooltip/tooltip.js';
import {styles as tooltipStyles} from '@material/web/components/tooltip/tooltip.cssresult.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for tooltip stories. */
export interface StoryKnobs {
  text: string;
  subhead: string;
  supportingText: string;
  placement?: string;
  caret: boolean;
  actions: number;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const demoStyles = css`
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 24px;
    box-sizing: border-box;
  }

  .demo-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .demo-section h2 {
    font: var(--md-sys-typescale-headline-sm);
    letter-spacing: var(--md-sys-typescale-headline-sm-tracking);
    margin: 0;
    color: var(--md-sys-color-on-surface);
  }

  .demo-hint {
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
  }

  .static-grid {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 32px;
  }
`;

const styles = [
  buttonStyles,
  iconButtonStyles,
  rippleStyles,
  focusRingStyles,
  tooltipStyles,
  demoStyles,
];

function actionButtons(count: number) {
  return [
    html`<md-gb-button slot="action" color="text">Learn more</md-gb-button>`,
    html`<md-gb-button slot="action" color="text">Dismiss</md-gb-button>`,
  ].slice(0, Math.min(2, Math.max(0, count)));
}

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return html`
      <div class="demo-container">
        <section class="demo-section">
          <h2>Plain</h2>
          <p class="demo-hint">
            Hover, focus with the keyboard, or long-press an icon button. The
            tooltip hides 1.5 seconds after the pointer leaves, or on Escape.
          </p>
          <div class="row">
            ${['edit', 'share', 'delete'].map(
              (icon) => html`
                <button
                  id="plain-${icon}"
                  class=${iconButton({color: 'standard'})}
                  aria-label=${icon}>
                  <md-gb-icon>${icon}</md-gb-icon>
                </button>
                <md-gb-tooltip
                  for="plain-${icon}"
                  placement=${(knobs.placement as TooltipPlacement) || nothing}
                  ?caret=${knobs.caret}
                  >${icon === 'edit' ? knobs.text : icon}</md-gb-tooltip
                >
              `,
            )}
          </div>
        </section>

        <section class="demo-section">
          <h2>Rich</h2>
          <p class="demo-hint">
            A transient rich tooltip on hover / focus; Tab from the anchor
            moves focus into its buttons.
          </p>
          <div class="row">
            <button id="rich-anchor" class=${button({color: 'outlined'})}>
              Hover for details
            </button>
            <md-gb-tooltip
              for="rich-anchor"
              variant="rich"
              subhead=${knobs.subhead}
              placement=${(knobs.placement as TooltipPlacement) || nothing}
              ?caret=${knobs.caret}>
              ${knobs.supportingText} ${actionButtons(knobs.actions)}
            </md-gb-tooltip>
          </div>
        </section>

        <section class="demo-section">
          <h2>Persistent rich</h2>
          <p class="demo-hint">
            Opens on click and stays until you interact elsewhere or press
            Escape.
          </p>
          <div class="row">
            <button id="persistent-anchor" class=${button({color: 'tonal'})}>
              What's new
            </button>
            <md-gb-tooltip
              for="persistent-anchor"
              variant="rich"
              persistent
              subhead=${knobs.subhead}
              placement=${(knobs.placement as TooltipPlacement) || nothing}
              ?caret=${knobs.caret}>
              ${knobs.supportingText} ${actionButtons(Math.max(1, knobs.actions))}
            </md-gb-tooltip>
          </div>
        </section>
      </div>
    `;
  },
};

interface StaticRich {
  subhead?: string;
  actions: number;
}

// Spec "Rich tooltip configurations".
const richConfigurations: StaticRich[] = [
  {subhead: 'Subhead', actions: 2},
  {subhead: 'Subhead', actions: 1},
  {subhead: 'Subhead', actions: 0},
  {actions: 1},
  {actions: 2},
];

const staticText =
  'Rich tooltips bring attention to a particular element or feature that warrants the user’s focus.';

function staticCaret(side: TooltipSide) {
  return html`<div class=${tooltip({side, caret: true})} role="tooltip">
    <span class="tooltip-caret" aria-hidden="true"></span>
    <span class="tooltip-supporting-text">Caret ${side}</span>
  </div>`;
}

const variants: MaterialStoryInit<StoryKnobs> = {
  name: 'Variants',
  styles,
  render() {
    return html`
      <div class="demo-container">
        <section class="demo-section">
          <h2>Plain</h2>
          <div class="static-grid">
            <div class=${tooltip()} role="tooltip">
              <span class="tooltip-supporting-text">Plain tooltip</span>
            </div>
            ${(['above', 'below', 'left', 'right'] as TooltipSide[]).map(
              staticCaret,
            )}
          </div>
        </section>

        <section class="demo-section">
          <h2>Rich configurations</h2>
          <div class="static-grid">
            ${richConfigurations.map(
              ({subhead, actions}) => html`
                <div
                  class=${tooltip({
                    variant: 'rich',
                    hasSubhead: !!subhead,
                    hasActions: actions > 0,
                  })}
                  role=${actions > 0 ? 'dialog' : 'tooltip'}>
                  <span class="tooltip-caret" aria-hidden="true"></span>
                  <div class="tooltip-subhead">${subhead ?? ''}</div>
                  <div class="tooltip-supporting-text">${staticText}</div>
                  <div class="tooltip-actions">
                    ${[
                      html`<button class=${button({color: 'text', size: 'sm'})}>
                        Action 1
                      </button>`,
                      html`<button class=${button({color: 'text', size: 'sm'})}>
                        Action 2
                      </button>`,
                    ].slice(0, actions)}
                  </div>
                </div>
              `,
            )}
          </div>
        </section>
      </div>
    `;
  },
};

/** Tooltip demo stories. */
export const stories = [playground, variants];
