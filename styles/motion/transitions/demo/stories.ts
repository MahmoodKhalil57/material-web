/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/button/md-gb-button.js';
import '@material/web/styles/motion/transitions/md-gb-skeleton.js';

import {type MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import transitionStyles, {
  styles as transitionCss,
} from '@material/web/styles/motion/transitions/md-motion-transitions.cssresult.js';
import {
  containerTransform,
  enter,
  type EnterExitOptions,
  exit,
  fadeThrough,
  lateral,
  sharedAxis,
  type TransitionOptions,
} from '@material/web/styles/motion/transitions/transitions.js';
import {type SkeletonElement} from '@material/web/styles/motion/transitions/skeleton-element.js';
import {css, html} from 'lit';

import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

/** Knob types for transition stories. */
export interface StoryKnobs {
  reducedMotion: boolean;
  viewTransition: boolean;
}

// The View Transition pseudo-elements live in the document, so the
// transition styles are adopted there.
adoptStyles(document, [m3Styles, transitionStyles]);

function options(knobs: StoryKnobs): TransitionOptions {
  return {
    // Unchecked follows the system setting.
    reducedMotion: knobs.reducedMotion || undefined,
    viewTransition: knobs.viewTransition,
  };
}

/** The element a click came from, inside the story's shadow root. */
function closestIn<T extends Element>(event: Event, selector: string) {
  return (event.currentTarget as Element).closest<T>(selector);
}

function stageOf(event: Event) {
  return closestIn<HTMLElement>(event, '.stage')!;
}

// The enter/exit and skeleton classes are also needed in the story's own
// shadow root.
const demoStyles = css`
  .stage {
    background-color: var(--md-sys-color-surface-container-low);
    border-radius: var(--md-sys-shape-corner-lg);
    box-sizing: border-box;
    color: var(--md-sys-color-on-surface);
    display: flex;
    flex-direction: column;
    font: var(--md-sys-typescale-body-md);
    gap: 16px;
    inline-size: min(100%, 420px);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
    overflow: hidden;
    padding: 16px;
    position: relative;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .hint {
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-body-sm);
    letter-spacing: var(--md-sys-typescale-body-sm-tracking);
    margin: 0;
  }

  h3 {
    font: var(--md-sys-typescale-title-md);
    letter-spacing: var(--md-sys-typescale-title-md-tracking);
    margin: 0;
  }

  /* Container transform */
  .grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
  }

  .card {
    all: unset;
    background-color: var(--md-sys-color-secondary-container);
    border-radius: var(--md-sys-shape-corner-md);
    box-sizing: border-box;
    color: var(--md-sys-color-on-secondary-container);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-block-size: 112px;
    padding: 16px;
  }

  .card:focus-visible {
    outline: 3px solid var(--md-sys-color-secondary);
    outline-offset: 2px;
  }

  .thumb {
    background-color: var(--md-sys-color-tertiary);
    border-radius: var(--md-sys-shape-corner-sm);
    block-size: 40px;
  }

  .detail {
    background-color: var(--md-sys-color-surface-container-highest);
    border-radius: var(--md-sys-shape-corner-xl);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;
    inset: 0;
    padding: 24px;
    position: absolute;
  }

  .detail[hidden] {
    display: none;
  }

  .detail .thumb {
    block-size: 140px;
  }

  .fab {
    all: unset;
    align-items: center;
    align-self: flex-end;
    background-color: var(--md-sys-color-primary-container);
    border-radius: var(--md-sys-shape-corner-lg);
    block-size: 56px;
    color: var(--md-sys-color-on-primary-container);
    cursor: pointer;
    display: flex;
    font: var(--md-sys-typescale-label-lg);
    justify-content: center;
    inline-size: 56px;
  }

  .fab-sheet {
    background-color: var(--md-sys-color-primary-container);
    border-radius: var(--md-sys-shape-corner-xl);
    color: var(--md-sys-color-on-primary-container);
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
  }

  .fab-sheet[hidden] {
    display: none;
  }

  /* Forward and backward, lateral, top level */
  .scope {
    background-color: var(--md-sys-color-surface);
    border-radius: var(--md-sys-shape-corner-md);
    min-block-size: 200px;
    padding: 16px;
  }

  .row {
    border-block-end: 1px solid var(--md-sys-color-outline-variant);
    padding-block: 12px;
  }

  .peer {
    align-items: center;
    border-radius: var(--md-sys-shape-corner-md);
    display: flex;
    font: var(--md-sys-typescale-display-sm);
    justify-content: center;
    min-block-size: 168px;
  }

  .nav {
    display: flex;
    gap: 8px;
    justify-content: space-around;
  }

  .nav button {
    all: unset;
    border-radius: var(--md-sys-shape-corner-full);
    cursor: pointer;
    font: var(--md-sys-typescale-label-md);
    padding: 4px 16px;
  }

  .nav button[aria-current='page'] {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  .nav button:focus-visible {
    outline: 3px solid var(--md-sys-color-secondary);
  }

  /* Enter and exit */
  .enter-stage {
    block-size: 320px;
  }

  .surface {
    background-color: var(--md-sys-color-surface-container);
    border-radius: var(--md-sys-shape-corner-xs);
    box-shadow: var(--md-sys-elevation-shadow-level2, 0 2px 6px #0004);
    padding: 8px 0;
    position: absolute;
  }

  .surface[hidden] {
    display: none;
  }

  .menu {
    inline-size: 160px;
    inset-block-start: 64px;
    inset-inline-end: 16px;
  }

  .menu div {
    padding: 8px 16px;
  }

  .snackbar {
    background-color: var(--md-sys-color-inverse-surface);
    border-radius: var(--md-sys-shape-corner-xs);
    color: var(--md-sys-color-inverse-on-surface);
    inset-block-end: 16px;
    inset-inline: 16px;
    padding: 14px 16px;
  }

  .dialog {
    background-color: var(--md-sys-color-surface-container-high);
    border-radius: var(--md-sys-shape-corner-xl);
    inset-block-start: 88px;
    inset-inline: 48px;
    padding: 24px;
  }

  .sheet {
    background-color: var(--md-sys-color-surface-container-low);
    border-radius: var(--md-sys-shape-corner-xl-top, 28px 28px 0 0);
    block-size: 160px;
    inset-block-end: 0;
    inset-inline: 0;
    padding: 16px;
  }

  /* Skeleton loaders */
  .item {
    align-items: center;
    display: grid;
    gap: 4px 16px;
    grid-template-columns: 40px 1fr;
  }

  .item md-gb-skeleton[shape='circle'] {
    grid-row: span 2;
    inline-size: 40px;
  }

  .avatar {
    background-color: var(--md-sys-color-primary);
    border-radius: var(--md-sys-shape-corner-full);
    block-size: 40px;
  }
`;

const styles = [demoStyles, transitionCss];

const containerTransformStory: MaterialStoryInit<StoryKnobs> = {
  name: 'Container transform',
  styles,
  render(knobs) {
    const open = async (event: Event) => {
      const card = event.currentTarget as HTMLElement;
      const stage = stageOf(event);
      const detail = stage.querySelector<HTMLElement>('.detail')!;
      await containerTransform(card, detail, {
        ...options(knobs),
        update: () => {
          detail.querySelector('h3')!.textContent = card.dataset['title']!;
          detail.hidden = false;
          stage.dataset['openCard'] = card.dataset['title'];
        },
      });
      detail.querySelector('md-gb-button')?.focus();
    };
    const close = async (event: Event) => {
      const stage = stageOf(event);
      const detail = stage.querySelector<HTMLElement>('.detail')!;
      const card = stage.querySelector<HTMLElement>(
        `.card[data-title="${stage.dataset['openCard']}"]`,
      )!;
      await containerTransform(detail, card, {
        ...options(knobs),
        update: () => {
          detail.hidden = true;
        },
      });
      card.focus();
    };
    const toggleFab = async (event: Event) => {
      const stage = stageOf(event);
      const fab = stage.querySelector<HTMLElement>('.fab')!;
      const sheet = stage.querySelector<HTMLElement>('.fab-sheet')!;
      const opening = sheet.hidden;
      await containerTransform(opening ? fab : sheet, opening ? sheet : fab, {
        ...options(knobs),
        update: () => {
          sheet.hidden = !opening;
          fab.hidden = opening;
        },
      });
    };
    const cards = ['Flowers', 'Mountains', 'City', 'Ocean'];
    return html`
      <div class="stage">
        <p class="hint">
          A card expands into a details page (500ms, Emphasized); its bounds,
          corner shape and color morph while the content fades through.
        </p>
        <div class="grid">
          ${cards.map(
            (title) => html`
              <button class="card" data-title=${title} @click=${open}>
                <div class="thumb"></div>
                <span>${title}</span>
              </button>
            `,
          )}
        </div>
        <button class="fab" aria-label="Compose" @click=${toggleFab}>+</button>
        <div class="fab-sheet" hidden>
          <h3>Compose</h3>
          <span>A FAB transforms into a sheet.</span>
          <md-gb-button color="text" @click=${toggleFab}>Close</md-gb-button>
        </div>
        <div class="detail" hidden role="region" aria-label="Details">
          <div class="thumb"></div>
          <h3></h3>
          <span>The details page shares the card's container.</span>
          <md-gb-button color="filled" @click=${close}>Back</md-gb-button>
        </div>
      </div>
    `;
  },
};

const messages = ['Lunch on Friday?', 'Trip photos', 'Project update'];

const forwardBackwardStory: MaterialStoryInit<StoryKnobs> = {
  name: 'Forward and backward',
  styles,
  render(knobs) {
    const show = (stage: HTMLElement, message?: string) => {
      stage.querySelector<HTMLElement>('.inbox')!.hidden = !!message;
      const thread = stage.querySelector<HTMLElement>('.thread')!;
      thread.hidden = !message;
      if (message) thread.querySelector('h3')!.textContent = message;
    };
    const forward = (event: Event) => {
      const stage = stageOf(event);
      const message = (event.currentTarget as HTMLElement).dataset['message'];
      sharedAxis('forward', () => show(stage, message), {
        ...options(knobs),
        scope: stage.querySelector('.scope')!,
      });
    };
    const backward = (event: Event) => {
      const stage = stageOf(event);
      sharedAxis('backward', () => show(stage), {
        ...options(knobs),
        scope: stage.querySelector('.scope')!,
      });
    };
    return html`
      <div class="stage">
        <p class="hint">
          Screens at consecutive levels of hierarchy slide 30px horizontally as
          they fade through.
        </p>
        <div class="scope">
          <div class="inbox">
            <h3>Inbox</h3>
            ${messages.map(
              (message) => html`
                <div class="row">
                  <md-gb-button
                    color="text"
                    data-message=${message}
                    @click=${forward}
                    >${message}</md-gb-button
                  >
                </div>
              `,
            )}
          </div>
          <div class="thread" hidden>
            <md-gb-button color="text" @click=${backward}>Back</md-gb-button>
            <h3></h3>
            <p>The message thread, one level deeper.</p>
          </div>
        </div>
      </div>
    `;
  },
};

const peers = [
  {label: 'Artists', color: 'var(--md-sys-color-primary-container)'},
  {label: 'Albums', color: 'var(--md-sys-color-secondary-container)'},
  {label: 'Songs', color: 'var(--md-sys-color-tertiary-container)'},
];

const lateralStory: MaterialStoryInit<StoryKnobs> = {
  name: 'Lateral',
  styles,
  render(knobs) {
    const go = (event: Event, step: 1 | -1) => {
      const stage = stageOf(event);
      const peer = stage.querySelector<HTMLElement>('.peer')!;
      const index =
        (Number(peer.dataset['index']) + step + peers.length) % peers.length;
      lateral(
        step === 1 ? 'next' : 'previous',
        () => {
          peer.dataset['index'] = String(index);
          peer.textContent = peers[index].label;
          peer.style.backgroundColor = peers[index].color;
        },
        {...options(knobs), scope: stage.querySelector('.scope')!},
      );
    };
    return html`
      <div class="stage">
        <p class="hint">
          Peers slide the full width in unison, without fading.
        </p>
        <div class="scope">
          <div
            class="peer"
            data-index="0"
            style="background-color: ${peers[0].color}"
          >
            ${peers[0].label}
          </div>
        </div>
        <div class="controls">
          <md-gb-button color="outlined" @click=${(e: Event) => go(e, -1)}
            >Previous</md-gb-button
          >
          <md-gb-button color="outlined" @click=${(e: Event) => go(e, 1)}
            >Next</md-gb-button
          >
        </div>
      </div>
    `;
  },
};

const destinations = ['Home', 'Music', 'Library'];

const topLevelStory: MaterialStoryInit<StoryKnobs> = {
  name: 'Top level',
  styles,
  render(knobs) {
    const navigate = (event: Event) => {
      const button = event.currentTarget as HTMLElement;
      const stage = stageOf(event);
      if (button.getAttribute('aria-current') === 'page') return;
      fadeThrough(
        () => {
          for (const b of stage.querySelectorAll('.nav button')) {
            b.setAttribute('aria-current', b === button ? 'page' : 'false');
          }
          const page = stage.querySelector('.scope')!;
          page.querySelector('h3')!.textContent = button.textContent;
        },
        {...options(knobs), scope: stage.querySelector('.scope')!},
      );
    };
    return html`
      <div class="stage">
        <p class="hint">
          The old destination quickly fades out, then the new one fades in.
        </p>
        <div class="scope">
          <h3>Home</h3>
          <p>Top level destinations aren't necessarily related.</p>
        </div>
        <nav class="nav" aria-label="Destinations">
          ${destinations.map(
            (d, i) => html`
              <button
                aria-current=${i === 0 ? 'page' : 'false'}
                @click=${navigate}
              >
                ${d}
              </button>
            `,
          )}
        </nav>
      </div>
    `;
  },
};

interface EnterExitDemo {
  label: string;
  selector: string;
  options: EnterExitOptions;
}

const enterExitDemos: EnterExitDemo[] = [
  {label: 'Menu', selector: '.menu', options: {origin: 'top'}},
  {label: 'Snackbar', selector: '.snackbar', options: {origin: 'bottom'}},
  {label: 'Dialog', selector: '.dialog', options: {origin: 'center'}},
  {
    label: 'Dialog (scale)',
    selector: '.dialog',
    options: {style: 'scale'},
  },
  {
    label: 'Bottom sheet',
    selector: '.sheet',
    options: {style: 'slide', origin: 'bottom'},
  },
];

const enterExitStory: MaterialStoryInit<StoryKnobs> = {
  name: 'Enter and exit',
  styles,
  render(knobs) {
    const toggle = async (event: Event, demo: EnterExitDemo) => {
      const stage = stageOf(event);
      const element = stage.querySelector<HTMLElement>(demo.selector)!;
      const opts = {
        ...demo.options,
        reducedMotion: knobs.reducedMotion || undefined,
      };
      if (element.hidden || element.dataset['state'] === 'exit') {
        element.dataset['state'] = 'enter';
        await enter(element, opts);
      } else {
        element.dataset['state'] = 'exit';
        await exit(element, opts);
        if (element.dataset['state'] === 'exit') element.hidden = true;
      }
    };
    return html`
      <div class="stage enter-stage">
        <div class="controls">
          ${enterExitDemos.map(
            (demo) => html`
              <md-gb-button
                color="tonal"
                @click=${(e: Event) => toggle(e, demo)}
                >${demo.label}</md-gb-button
              >
            `,
          )}
        </div>
        <p class="hint">
          Within screen bounds components expand away from the nearest edge
          (400ms Emphasized decelerate in, 200ms Emphasized accelerate out);
          sheets slide in from beyond the screen edge without fading.
        </p>
        <div class="surface menu" role="menu" hidden>
          <div role="menuitem">Share</div>
          <div role="menuitem">Rename</div>
          <div role="menuitem">Delete</div>
        </div>
        <div class="surface dialog" role="dialog" aria-label="Dialog" hidden>
          <h3>Permanently delete?</h3>
          <p>
            Deleting the selected messages also removes them from synced
            devices.
          </p>
        </div>
        <div class="surface sheet" hidden>A standard bottom sheet</div>
        <div class="surface snackbar" role="status" hidden>
          Message archived
        </div>
      </div>
    `;
  },
};

const skeletonStory: MaterialStoryInit<StoryKnobs> = {
  name: 'Skeleton loaders',
  styles,
  render() {
    const reload = (event: Event) => {
      const stage = stageOf(event);
      const skeletons = [
        ...stage.querySelectorAll<SkeletonElement>('md-gb-skeleton'),
      ];
      for (const s of skeletons) s.loading = true;
      // Content arrives later, in reading order.
      skeletons.forEach((s, i) => {
        window.setTimeout(() => (s.loading = false), 1500 + i * 80);
      });
    };
    const items = ['Morning playlist', 'Daily mix', 'Focus'];
    return html`
      <div class="stage">
        <p class="hint">
          The placeholders pulse from the top left to the bottom right; content
          quickly fades in on top of them once it loads.
        </p>
        ${items.map(
          (item) => html`
            <div class="item">
              <md-gb-skeleton loading shape="circle">
                <div class="avatar"></div>
              </md-gb-skeleton>
              <md-gb-skeleton loading shape="text">
                <h3>${item}</h3>
              </md-gb-skeleton>
              <md-gb-skeleton loading shape="text">
                <span>12 songs</span>
              </md-gb-skeleton>
            </div>
          `,
        )}
        <div class="controls">
          <md-gb-button color="filled" @click=${reload}>Load</md-gb-button>
        </div>
        <p class="hint">
          Without the element, the <code>md-skeleton</code> class styles any
          block:
        </p>
        <div class="md-skeleton" style="block-size: 64px"></div>
        <div
          class="md-skeleton md-skeleton-text"
          style="inline-size: 60%"
        ></div>
      </div>
    `;
  },
};

/** Transition demo stories. */
export const stories = [
  containerTransformStory,
  forwardBackwardStory,
  lateralStory,
  topLevelStory,
  enterExitStory,
  skeletonStory,
];
