/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/card/md-gb-card.js';
import '@material/web/labs/gb/components/menu/md-gb-menu.js';
import '@material/web/labs/gb/components/menu/md-gb-menu-item.js';

import {MaterialStoryInit} from './material-collection.js';
import {CardColor} from '@material/web/labs/gb/components/card/card.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html, nothing} from 'lit';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

/** Knob types for card stories. */
export interface StoryKnobs {
  color?: CardColor;
  disabled: boolean;
  interactive: boolean;
  dragged: boolean;
}

adoptStyles(document, [m3Styles]);

const styles = css`
  md-gb-card {
    --padding-inline: 0px;
  }

  .row {
    display: flex;
    gap: 16px;
  }

  .content {
    padding: 16px;
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
  }

  .layout-card {
    width: 320px;

    .content {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;

      h2 {
        font: var(--md-sys-typescale-headline-sm);
        letter-spacing: var(--md-sys-typescale-headline-sm-tracking);
        margin-block: 0 4px;
      }
      h3 {
        font: var(--md-sys-typescale-body-lg);
        letter-spacing: var(--md-sys-typescale-body-lg-tracking);
        margin-block: 0 16px;
      }
      p {
        margin-block: 0 24px;
      }
      .actions {
        margin-top: 16px;
        display: flex;
        justify-content: end;
        gap: 8px;
      }
    }
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return html`
      <md-gb-card
        color=${knobs.color || nothing}
        ?disabled=${knobs.disabled}
        ?interactive=${knobs.interactive}
        ?dragged=${knobs.dragged}>
        <div class="content">Card content</div>
      </md-gb-card>
    `;
  },
};

const colors: MaterialStoryInit<StoryKnobs> = {
  name: 'Colors',
  styles,
  render(knobs) {
    return html`
      <div class="row">
        <md-gb-card
          color="elevated"
          ?disabled=${knobs.disabled}
          ?interactive=${knobs.interactive}>
          <div class="content">Card content</div>
        </md-gb-card>
        <md-gb-card
          color="filled"
          ?disabled=${knobs.disabled}
          ?interactive=${knobs.interactive}>
          <div class="content">Card content</div>
        </md-gb-card>
        <md-gb-card
          color="outlined"
          ?disabled=${knobs.disabled}
          ?interactive=${knobs.interactive}>
          <div class="content">Card content</div>
        </md-gb-card>
      </div>
    `;
  },
};

const layouts: MaterialStoryInit<StoryKnobs> = {
  name: 'Layouts',
  styles,
  render(knobs) {
    return html`
      <md-gb-card
        class="layout-card"
        color=${knobs.color || 'elevated'}
        ?disabled=${knobs.disabled}
        ?interactive=${knobs.interactive}>
        <div class="content">
          <h2>Headline</h2>
          <h3>Subhead</h3>
          <p>
            Explain more about the topic shown in the medium display and subhead
            through supporting text here.
          </p>
          <div class="actions">
            <md-gb-button color="outlined">Action</md-gb-button>
            <md-gb-button color="filled">Action</md-gb-button>
          </div>
        </div>
      </md-gb-card>
    `;
  },
};

const link: MaterialStoryInit<StoryKnobs> = {
  name: 'Link card',
  styles,
  render(knobs) {
    // Spec: directly actionable cards can have the button or link role.
    return html`
      <md-gb-card
        color=${knobs.color || 'filled'}
        interactive
        href="#card-link"
        aria-label="Open details"
        ?disabled=${knobs.disabled}
        ?dragged=${knobs.dragged}>
        <div class="content">Link card</div>
      </md-gb-card>
    `;
  },
};

const reorderStyles = css`
  .reorder {
    display: flex;
    flex-direction: column;
    gap: 8px;
    inline-size: 320px;
    touch-action: none;
  }

  .reorder md-gb-card {
    display: flex;
    cursor: grab;
    user-select: none;
    -webkit-touch-callout: none;
  }

  .reorder md-gb-card[dragged] {
    cursor: grabbing;
    z-index: 1;
  }

  .reorder .content {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 8px;
    padding-block: 4px;
    padding-inline: 16px 4px;
  }

  .reorder .label {
    flex: 1;
  }

  .more {
    display: grid;
    place-items: center;
    inline-size: 48px;
    block-size: 48px;
    padding: 0;
    border: none;
    border-radius: var(--md-sys-shape-corner-full);
    background: none;
    color: var(--md-sys-color-on-surface-variant);
    font: 24px var(--md-icon-font, 'Material Symbols Outlined');
    cursor: pointer;
  }

  .more:hover {
    background: hsl(from var(--md-sys-color-on-surface-variant) h s l / 8%);
  }

  .more:focus-visible {
    outline: 3px solid var(--md-sys-color-secondary);
  }
`;

// Spec Cards > Accessibility > Dragging and dismissing: "any dragging and
// swiping interactions need a single-pointer alternative, like selecting the
// same actions from a menu ... tapping a card, or pressing and holding, should
// open a menu to change its position in a list. That menu could also contain
// an action to delete the card." The card shows the `dragged` state; the app
// moves it.
const reorder: MaterialStoryInit<StoryKnobs> = {
  name: 'Reorder (drag or menu)',
  styles: [styles, reorderStyles],
  render(knobs) {
    let active: HTMLElement | null = null;
    let drag: {card: HTMLElement; pointerId: number; startY: number} | null =
      null;

    const menuOf = (el: Element) =>
      (el.getRootNode() as Document | ShadowRoot).querySelector(
        '#card-menu',
      ) as (HTMLElement & {showAt(x: number, y: number): void}) | null;

    const openMenu = (card: HTMLElement, x: number, y: number) => {
      active = card;
      menuOf(card)?.showAt(x, y);
    };

    const onMore = (event: Event) => {
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      openMenu(button.closest('md-gb-card')!, rect.left, rect.bottom);
    };

    // Press and hold (touch) or right-click also opens the menu.
    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      openMenu(
        event.currentTarget as HTMLElement,
        event.clientX,
        event.clientY,
      );
    };

    const move = (action: string) => {
      const card = active;
      const list = card?.parentElement;
      if (!card || !list) return;
      const cards = Array.from(list.children);
      const index = cards.indexOf(card);
      if (action === 'up' && index > 0) cards[index - 1].before(card);
      if (action === 'down' && index < cards.length - 1) {
        cards[index + 1].after(card);
      }
      if (action === 'top') list.prepend(card);
      if (action === 'bottom') list.append(card);
      if (action === 'delete') {
        card.remove();
        return;
      }
      card.querySelector<HTMLElement>('.more')?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if ((event.target as Element).closest('.more')) return;
      const card = event.currentTarget as HTMLElement;
      drag = {card, pointerId: event.pointerId, startY: event.clientY};
      card.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const dy = event.clientY - drag.startY;
      if (!drag.card.hasAttribute('dragged') && Math.abs(dy) < 8) return;
      (drag.card as HTMLElement & {dragged: boolean}).dragged = true;
      drag.card.style.translate = `0 ${dy}px`;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const {card} = drag;
      drag = null;
      if (!card.hasAttribute('dragged')) return;
      const center = card.getBoundingClientRect();
      const y = center.top + center.height / 2;
      card.style.translate = '';
      (card as HTMLElement & {dragged: boolean}).dragged = false;
      const others = Array.from(card.parentElement!.children).filter(
        (el) => el !== card,
      );
      const before = others.find((el) => {
        const rect = el.getBoundingClientRect();
        return y < rect.top + rect.height / 2;
      });
      if (before) before.before(card);
      else card.parentElement!.append(card);
    };

    const tasks = ['Groceries', 'Laundry', 'Water the plants', 'Pay rent'];
    return html`
      <p>
        Drag a card, or use its menu (tap the more button, or press and hold
        the card) to move or delete it without dragging.
      </p>
      <div class="reorder" role="list" aria-label="Tasks">
        ${tasks.map(
          (task) => html`
            <md-gb-card
              role="listitem"
              color=${knobs.color || 'elevated'}
              @contextmenu=${onContextMenu}
              @pointerdown=${onPointerDown}
              @pointermove=${onPointerMove}
              @pointerup=${onPointerUp}
              @pointercancel=${onPointerUp}>
              <div class="content">
                <span class="label">${task}</span>
                <button
                  class="more"
                  aria-label="Move or delete ${task}"
                  aria-haspopup="menu"
                  @click=${onMore}>
                  more_vert
                </button>
              </div>
            </md-gb-card>
          `,
        )}
      </div>
      <md-gb-menu id="card-menu" aria-label="Card actions">
        <md-gb-menu-item @click=${() => move('top')}>Move to top</md-gb-menu-item>
        <md-gb-menu-item @click=${() => move('up')}>Move up</md-gb-menu-item>
        <md-gb-menu-item @click=${() => move('down')}>Move down</md-gb-menu-item>
        <md-gb-menu-item @click=${() => move('bottom')}>
          Move to bottom
        </md-gb-menu-item>
        <md-gb-menu-item @click=${() => move('delete')}>Delete</md-gb-menu-item>
      </md-gb-menu>
    `;
  },
};

/** Card stories. */
export const stories = [playground, colors, layouts, link, reorder];
