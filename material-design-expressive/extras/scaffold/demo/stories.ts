/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/appbar/md-gb-app-bar.js';
import '@material/web/components/card/md-gb-card.js';
import '@material/web/components/fab/md-gb-fab.js';
import '@material/web/components/iconbutton/md-gb-icon-button.js';
import '@material/web/components/navbar/md-gb-nav-bar.js';
import '@material/web/components/navbar/md-gb-nav-bar-item.js';
import '@material/web/components/navrail/md-gb-nav-rail.js';
import '@material/web/components/navrail/md-gb-nav-rail-item.js';
import '@material/web/extras/scaffold/md-gb-app-scaffold.js';
import '@material/web/extras/scaffold/md-gb-pane-scaffold.js';
import '@material/web/styles/icons/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {
  type PaneArrangement,
  type PaneHandleTap,
  type PaneLevitate,
} from '@material/web/extras/scaffold/pane-scaffold.js';
import {type PaneScaffoldElement} from '@material/web/extras/scaffold/pane-scaffold-element.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {simulateViewportSegments} from '@material/web/foundations/layout/viewport-segments.js';
import {css, html, nothing, type TemplateResult} from 'lit';

import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

/** Knob types for scaffold stories. */
export interface StoryKnobs {
  resizable: boolean;
  handleTap: string;
  mediumTwoPane: boolean;
  arrangement: string;
  dir: string;
  levitate: string;
  levitateModal: boolean;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const styles = css`
  .demo {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    box-sizing: border-box;
    inline-size: 100%;
  }

  .demo-controls {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font: var(--md-sys-typescale-body-md);
    color: var(--md-sys-color-on-surface-variant);
  }

  .demo-controls button {
    background: var(--md-sys-color-surface-container-high);
    border: none;
    border-radius: var(--md-sys-shape-corner-full);
    color: var(--md-sys-color-on-surface);
    cursor: pointer;
    font: var(--md-sys-typescale-label-lg);
    padding: 6px 12px;
  }

  .demo-controls output {
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-title-sm);
    margin-inline-start: auto;
  }

  /* A resizable stand-in for the window: the scaffolds measure their own
     width, so dragging the corner moves through the window size classes. */
  .demo-scroller {
    overflow-x: auto;
  }

  .demo-frame {
    background-color: var(--md-sys-color-surface);
    block-size: 560px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 16px;
    box-sizing: border-box;
    inline-size: 1000px;
    max-inline-size: none;
    min-inline-size: 320px;
    overflow: hidden;
    resize: horizontal;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-block: 8px;
  }

  .list-item {
    align-items: center;
    background: var(--md-sys-color-surface-container);
    border: none;
    border-radius: var(--md-sys-shape-corner-lg);
    color: var(--md-sys-color-on-surface);
    cursor: pointer;
    display: flex;
    font: var(--md-sys-typescale-body-lg);
    gap: 16px;
    min-block-size: 72px;
    padding-inline: 16px;
    text-align: start;
  }

  .list-item small {
    color: var(--md-sys-color-on-surface-variant);
    display: block;
    font: var(--md-sys-typescale-body-md);
  }

  /* Selected state: two-pane layouts only (spec: list-detail behavior). */
  md-gb-pane-scaffold[mode='two-pane'] .list-item[aria-current='true'] {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  .avatar {
    align-items: center;
    background: var(--md-sys-color-primary-container);
    border-radius: 50%;
    color: var(--md-sys-color-on-primary-container);
    display: inline-flex;
    flex: none;
    font: var(--md-sys-typescale-title-md);
    block-size: 40px;
    inline-size: 40px;
    justify-content: center;
  }

  .detail {
    background: var(--md-sys-color-surface-container-low);
    border-radius: var(--md-sys-shape-corner-xl);
    box-sizing: border-box;
    color: var(--md-sys-color-on-surface);
    min-block-size: 100%;
    padding: 8px 24px 24px;
  }

  .detail-header {
    align-items: center;
    display: flex;
    gap: 8px;
    min-block-size: 56px;
  }

  .detail h2 {
    font: var(--md-sys-typescale-headline-sm);
    margin: 0;
  }

  .detail p {
    font: var(--md-sys-typescale-body-lg);
    max-inline-size: 60ch;
  }

  /* Back button: single-pane layouts only. */
  .back {
    display: none;
  }

  md-gb-pane-scaffold[mode='single'] .back {
    display: inline-flex;
  }

  /* Mirror the back arrow in RTL (spec: bidirectionality, icons). */
  :dir(rtl) .back md-gb-icon {
    transform: scaleX(-1);
  }

  .placeholder {
    align-items: center;
    background: var(--md-sys-color-surface-container-low);
    border-radius: var(--md-sys-shape-corner-xl);
    color: var(--md-sys-color-on-surface-variant);
    display: flex;
    font: var(--md-sys-typescale-body-lg);
    justify-content: center;
    min-block-size: 100%;
  }

  .focus-pane {
    background: var(--md-sys-color-surface-container-low);
    border-radius: var(--md-sys-shape-corner-xl);
    color: var(--md-sys-color-on-surface);
    padding: 24px;
  }

  .media {
    aspect-ratio: 16 / 9;
    background: linear-gradient(
      135deg,
      var(--md-sys-color-primary-container),
      var(--md-sys-color-tertiary-container)
    );
    border-radius: var(--md-sys-shape-corner-lg);
  }

  .supporting {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-block-end: 16px;
  }

  md-gb-pane-scaffold[mode='stacked'] .supporting {
    flex-direction: row;
    overflow-x: auto;
  }

  md-gb-pane-scaffold[mode='stacked'] .supporting md-gb-card {
    flex: 0 0 240px;
  }

  .card-body {
    color: var(--md-sys-color-on-surface);
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
  }

  .card-body strong {
    font: var(--md-sys-typescale-title-md);
  }

  .card-body span {
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-body-md);
  }

  .card-media {
    aspect-ratio: 4 / 3;
    background: var(--md-sys-color-secondary-container);
    border-radius: var(--md-sys-shape-corner-md);
    margin: 8px 8px 0;
  }

  .feed-wide {
    grid-column: span 2;
  }

  md-gb-pane-scaffold[window-class='compact'] .feed-wide {
    grid-column: auto;
  }

  .side-sheet {
    background: var(--md-sys-color-surface-container-low);
    block-size: 100%;
    border-radius: var(--md-sys-shape-corner-lg);
    box-sizing: border-box;
    color: var(--md-sys-color-on-surface);
    padding: 24px;
  }

  .levitate-pane {
    box-sizing: border-box;
    color: var(--md-sys-color-on-surface);
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
  }

  .levitate-pane h3 {
    font: var(--md-sys-typescale-title-lg);
    margin: 0;
  }

  .levitate-pane .close {
    align-self: flex-end;
  }

  /* Hide the close button where the pane is co-planar. */
  md-gb-pane-scaffold:not([mode='levitated']) .levitate-pane .close,
  md-gb-pane-scaffold:not([mode='levitated']) .open-levitated {
    display: none;
  }

  .open-levitated {
    margin-block-start: 16px;
  }

  /* The simulated hinge, drawn over the frame. */
  .demo-frame.fold-frame {
    position: relative;
  }

  .hinge {
    background: repeating-linear-gradient(
      45deg,
      var(--md-sys-color-outline),
      var(--md-sys-color-outline) 4px,
      transparent 4px,
      transparent 8px
    );
    opacity: 0.6;
    pointer-events: none;
    position: absolute;
    z-index: 10;
  }

  .side-sheet h3 {
    font: var(--md-sys-typescale-title-lg);
    margin: 0 0 16px;
  }
`;

const PRESETS: Array<[string, number]> = [
  ['Compact 412', 412],
  ['Medium 700', 700],
  ['Expanded 1000', 1000],
  ['Large 1300', 1300],
  ['Extra-large 1700', 1700],
];

/** Width presets and a live readout of the frame's window size class. */
function controls() {
  const setWidth = (event: Event, width: number) => {
    const frame = (event.currentTarget as HTMLElement)
      .closest('.demo')
      ?.querySelector<HTMLElement>('.demo-frame');
    if (frame) frame.style.inlineSize = `${width}px`;
  };
  return html`<div class="demo-controls">
    ${PRESETS.map(
      ([label, width]) =>
        html`<button type="button" @click=${(e: Event) => setWidth(e, width)}>
          ${label}
        </button>`,
    )}
    <output aria-live="polite"></output>
  </div>`;
}

/** Updates the readout when a scaffold's window size class changes. */
function updateReadout(event: Event) {
  const target = event.target as HTMLElement & {windowClass?: string};
  const out = (event.currentTarget as HTMLElement)
    .closest('.demo')
    ?.querySelector('output');
  if (out && target.windowClass && target.localName === 'md-gb-app-scaffold') {
    out.textContent = `Window size class: ${target.windowClass}`;
  }
}

function frame(content: TemplateResult, width = 1000) {
  return html`<div class="demo">
    ${controls()}
    <div class="demo-scroller">
      <div
        class="demo-frame"
        style="inline-size: ${width}px"
        @window-class-change=${updateReadout}>
        ${content}
      </div>
    </div>
  </div>`;
}

const PEOPLE = [
  ['Ali Connors', 'Brunch this weekend?'],
  ['Sandra Adams', 'Summer BBQ'],
  ['Trevor Hansen', 'Oui oui'],
  ['Britta Holt', 'Recipe to try'],
  ['Ruth Clarke', 'Birthday gift'],
  ['Kai Nakamura', 'Trip photos'],
];

function navigation() {
  const destinations = [
    ['inbox', 'Inbox'],
    ['chat_bubble', 'Chat'],
    ['group', 'Spaces'],
    ['videocam', 'Meet'],
  ];
  // Keep the bar and rail selection in sync; only one is shown.
  const sync = (event: Event) => {
    const source = event.target as HTMLElement & {selectedIndex: number};
    const scaffold = source.closest('md-gb-app-scaffold');
    for (const nav of scaffold?.querySelectorAll<
      HTMLElement & {selectedIndex: number}
    >('md-gb-nav-bar, md-gb-nav-rail') ?? []) {
      if (nav !== source) nav.selectedIndex = source.selectedIndex;
    }
  };
  return html`
    <md-gb-nav-bar
      slot="navigation-bar"
      aria-label="Primary navigation"
      @change=${sync}>
      ${destinations.map(
        ([icon, label], i) =>
          html`<md-gb-nav-bar-item ?active=${i === 0}>
            <md-gb-icon slot="icon">${icon}</md-gb-icon>
            ${label}
          </md-gb-nav-bar-item>`,
      )}
    </md-gb-nav-bar>
    <md-gb-nav-rail
      slot="navigation-rail"
      aria-label="Primary navigation"
      @change=${sync}>
      ${destinations.map(
        ([icon, label], i) =>
          html`<md-gb-nav-rail-item ?selected=${i === 0}>
            <md-gb-icon slot="icon">${icon}</md-gb-icon>
            ${label}
          </md-gb-nav-rail-item>`,
      )}
    </md-gb-nav-rail>
  `;
}

function listDetailPanes(knobs: Partial<StoryKnobs>, tertiary = false) {
  let selected = -1;
  const select = (event: Event, index: number) => {
    const scaffold = (event.currentTarget as HTMLElement).closest(
      'md-gb-pane-scaffold',
    ) as PaneScaffoldElement;
    selected = index;
    for (const [i, item] of scaffold.querySelectorAll('.list-item').entries()) {
      item.setAttribute('aria-current', String(i === selected));
    }
    const [name, subject] = PEOPLE[index];
    scaffold.querySelector('.detail h2')!.textContent = subject;
    scaffold.querySelector('.detail .from')!.textContent = `From ${name}`;
    scaffold.openDetail();
  };
  const back = (event: Event) => {
    (
      (event.currentTarget as HTMLElement).closest(
        'md-gb-pane-scaffold',
      ) as PaneScaffoldElement
    ).closeDetail();
  };
  return html`<md-gb-pane-scaffold
    layout="list-detail"
    arrangement=${(knobs.arrangement as PaneArrangement) || 'fixed-flexible'}
    ?resizable=${knobs.resizable ?? true}
    handle-tap=${(knobs.handleTap as PaneHandleTap) || 'toggle'}
    ?medium-two-pane=${knobs.mediumTwoPane ?? false}>
    <div slot="secondary" class="list" role="list">
      ${PEOPLE.map(
        ([name, subject], i) =>
          html`<button
            type="button"
            class="list-item"
            role="listitem"
            aria-current="false"
            @click=${(e: Event) => select(e, i)}>
            <span class="avatar" aria-hidden="true">${name[0]}</span>
            <span>${name}<small>${subject}</small></span>
          </button>`,
      )}
    </div>
    <article class="detail">
      <div class="detail-header">
        <md-gb-icon-button class="back" aria-label="Back" @click=${back}>
          <md-gb-icon>arrow_back</md-gb-icon>
        </md-gb-icon-button>
        <h2>Message</h2>
      </div>
      <p class="from"></p>
      <p>
        In a single-pane window the list and the detail take turns, and a back
        button returns to the list. From expanded up, both panes show side by
        side with the list at 360px (412px at large), and the selected item is
        highlighted.
      </p>
    </article>
    <div slot="placeholder" class="placeholder">Select a conversation</div>
    ${tertiary
      ? html`<aside slot="tertiary" class="side-sheet">
          <h3>Details</h3>
          <p>
            A standard side sheet is a third pane at extra-large only (at most
            400px). Narrow the frame below 1600px and it hides.
          </p>
        </aside>`
      : nothing}
  </md-gb-pane-scaffold>`;
}

/** A supporting pane layout whose supporting pane levitates. */
const levitate: MaterialStoryInit<StoryKnobs> = {
  name: 'Floating and docked panes',
  styles,
  render(knobs) {
    const scaffoldOf = (event: Event) =>
      (event.currentTarget as HTMLElement).closest(
        'md-gb-pane-scaffold',
      ) as PaneScaffoldElement;
    return html`<div dir=${knobs.dir || 'ltr'}>
      ${frame(
        html`<md-gb-app-scaffold>
          <md-gb-app-bar slot="top-app-bar" size="sm">Document</md-gb-app-bar>
          ${navigation()}
          <md-gb-pane-scaffold
            layout="supporting-pane"
            levitate=${(knobs.levitate as PaneLevitate) || 'docked'}
            ?levitate-modal=${knobs.levitateModal ?? false}
            levitate-label="Comments">
            <section class="focus-pane">
              <h2>Quarterly plan</h2>
              <p>
                Below expanded there is no room for a co-planar supporting pane,
                so it levitates: a docked pane pinned to the bottom edge at
                compact (like a bottom sheet) that adapts into a floating pane
                at medium, or a floating pane at every size. From expanded up it
                is co-planar again. Modal panes add a scrim, take focus and
                close when you use something behind them.
              </p>
              <md-gb-icon-button
                class="open-levitated"
                aria-label="Show comments"
                @click=${(e: Event) => scaffoldOf(e).openLevitated()}>
                <md-gb-icon>comment</md-gb-icon>
              </md-gb-icon-button>
            </section>
            <div slot="secondary" class="levitate-pane">
              <md-gb-icon-button
                class="close"
                aria-label="Close comments"
                @click=${(e: Event) => scaffoldOf(e).closeLevitated()}>
                <md-gb-icon>close</md-gb-icon>
              </md-gb-icon-button>
              <h3>Comments</h3>
              ${[1, 2, 3].map(
                (i) =>
                  html`<md-gb-card color="filled">
                    <div class="card-body">
                      <strong>Comment ${i}</strong>
                      <span>Looks good, ship it.</span>
                    </div>
                  </md-gb-card>`,
              )}
            </div>
          </md-gb-pane-scaffold>
        </md-gb-app-scaffold>`,
        412,
      )}
    </div>`;
  },
};

/**
 * Simulates a foldable's segments over the demo frame (the Viewport
 * Segments API reports them on real devices).
 */
function simulateFold(
  event: Event,
  kind: 'vertical' | 'hinge' | 'tabletop' | 'none',
) {
  const demo = (event.currentTarget as HTMLElement).closest('.demo');
  const frameEl = demo?.querySelector<HTMLElement>('.demo-frame');
  const hinge = demo?.querySelector<HTMLElement>('.hinge');
  if (!frameEl || !hinge) return;
  const r = frameEl.getBoundingClientRect();
  const BIG = 10000;
  if (kind === 'none') {
    simulateViewportSegments(undefined);
    hinge.hidden = true;
    return;
  }
  if (kind === 'tabletop') {
    const y = r.top + r.height / 2;
    simulateViewportSegments([
      {x: 0, y: 0, width: BIG, height: y},
      {x: 0, y, width: BIG, height: BIG},
    ]);
    Object.assign(hinge.style, {
      insetInline: '0',
      insetBlockStart: `${r.height / 2 - 1}px`,
      blockSize: '2px',
      inlineSize: 'auto',
    });
  } else {
    // A seamless fold (0px) or a dual-screen hinge (28px).
    const size = kind === 'hinge' ? 28 : 0;
    const x = r.left + r.width / 2 - size / 2;
    simulateViewportSegments([
      {x: 0, y: 0, width: x, height: BIG},
      {x: x + size, y: 0, width: BIG, height: BIG},
    ]);
    Object.assign(hinge.style, {
      insetBlock: '0',
      insetInlineStart: '',
      left: `${r.width / 2 - Math.max(size, 2) / 2}px`,
      inlineSize: `${Math.max(size, 2)}px`,
      blockSize: 'auto',
    });
  }
  hinge.hidden = false;
}

const foldable: MaterialStoryInit<StoryKnobs> = {
  name: 'Foldables (simulated fold)',
  styles,
  render(knobs) {
    return html`<div class="demo" dir=${knobs.dir || 'ltr'}>
      <div class="demo-controls">
        <button
          type="button"
          @click=${(e: Event) => simulateFold(e, 'vertical')}>
          Book posture (fold)
        </button>
        <button type="button" @click=${(e: Event) => simulateFold(e, 'hinge')}>
          Dual screen (28px hinge)
        </button>
        <button
          type="button"
          @click=${(e: Event) => simulateFold(e, 'tabletop')}>
          Tabletop
        </button>
        <button type="button" @click=${(e: Event) => simulateFold(e, 'none')}>
          No fold
        </button>
      </div>
      <p>
        On foldables the Viewport Segments API reports the fold; here the
        buttons fake it at the middle of the frame. Panes keep off the fold: two
        panes split at it with the spacer on the hinge (even in compact and
        medium windows), and in tabletop posture the supporting pane moves below
        the fold. Resize or scroll, then click again: a real fold stays fixed to
        the screen.
      </p>
      <div class="demo-scroller">
        <div class="demo-frame fold-frame" style="inline-size: 820px">
          <div class="hinge" hidden></div>
          <md-gb-pane-scaffold
            layout="supporting-pane"
            arrangement=${(knobs.arrangement as PaneArrangement) ||
            'fixed-flexible'}>
            <section class="focus-pane">
              <div class="media" role="img" aria-label="Course video"></div>
              <h2>Intro to layout</h2>
              <p>The focus pane sits on the first segment.</p>
            </section>
            <div slot="secondary" class="supporting" role="list">
              ${[1, 2, 3, 4].map(
                (i) =>
                  html`<md-gb-card color="filled" role="listitem">
                    <div class="card-body">
                      <strong>Lesson ${i}</strong>
                      <span>${5 + i} min</span>
                    </div>
                  </md-gb-card>`,
              )}
            </div>
          </md-gb-pane-scaffold>
        </div>
      </div>
    </div>`;
  },
};

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'List-detail',
  styles,
  render(knobs) {
    return html`<div dir=${knobs.dir || 'ltr'}>
      ${frame(
        html`<md-gb-app-scaffold auto-expand-rail>
          <md-gb-app-bar slot="top-app-bar" size="sm">
            <md-gb-icon-button slot="leading" aria-label="Menu">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            Mail
            <md-gb-icon-button slot="trailing" aria-label="Search">
              <md-gb-icon>search</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
          ${navigation()} ${listDetailPanes(knobs)}
          <md-gb-fab slot="fab" aria-label="Compose">
            <md-gb-icon>edit</md-gb-icon>
          </md-gb-fab>
        </md-gb-app-scaffold>`,
      )}
    </div>`;
  },
};

const supportingPane: MaterialStoryInit<StoryKnobs> = {
  name: 'Supporting pane',
  styles,
  render(knobs) {
    return html`<div dir=${knobs.dir || 'ltr'}>
      ${frame(
        html`<md-gb-app-scaffold>
          <md-gb-app-bar slot="top-app-bar" size="sm">Course</md-gb-app-bar>
          ${navigation()}
          <md-gb-pane-scaffold
            layout="supporting-pane"
            ?resizable=${knobs.resizable ?? true}
            handle-tap=${(knobs.handleTap as PaneHandleTap) || 'toggle'}>
            <section class="focus-pane">
              <div class="media" role="img" aria-label="Course video"></div>
              <h2>Intro to layout</h2>
              <p>
                The focus pane takes most of the window. Below expanded, the
                supporting pane reflows underneath it; from expanded up it sits
                beside it at a fixed width.
              </p>
            </section>
            <div slot="secondary" class="supporting" role="list">
              ${[1, 2, 3, 4, 5].map(
                (i) =>
                  html`<md-gb-card color="filled" role="listitem">
                    <div class="card-body">
                      <strong>Lesson ${i}</strong>
                      <span>${5 + i} min</span>
                    </div>
                  </md-gb-card>`,
              )}
            </div>
          </md-gb-pane-scaffold>
        </md-gb-app-scaffold>`,
      )}
    </div>`;
  },
};

const feed: MaterialStoryInit<StoryKnobs> = {
  name: 'Feed',
  styles,
  render(knobs) {
    return html`<div dir=${knobs.dir || 'ltr'}>
      ${frame(
        html`<md-gb-app-scaffold>
          <md-gb-app-bar slot="top-app-bar" size="sm">Discover</md-gb-app-bar>
          ${navigation()}
          <md-gb-pane-scaffold layout="feed">
            ${Array.from(
              {length: 12},
              (_, i) =>
                html`<md-gb-card
                  color=${i === 0 ? 'filled' : 'outlined'}
                  class=${i === 0 ? 'feed-wide' : nothing}>
                  <div class="card-media"></div>
                  <div class="card-body">
                    <strong>${i === 0 ? 'Featured' : `Course ${i}`}</strong>
                    <span>Cards reflow as the window grows</span>
                  </div>
                </md-gb-card>`,
            )}
          </md-gb-pane-scaffold>
        </md-gb-app-scaffold>`,
      )}
    </div>`;
  },
};

const threePanes: MaterialStoryInit<StoryKnobs> = {
  name: 'Three panes (extra-large)',
  styles,
  render(knobs) {
    return html`<div dir=${knobs.dir || 'ltr'}>
      ${frame(
        html`<md-gb-app-scaffold auto-expand-rail>
          ${navigation()} ${listDetailPanes({...knobs, resizable: false}, true)}
        </md-gb-app-scaffold>`,
        1700,
      )}
    </div>`;
  },
};

/** Scaffold demo stories. */
export const stories = [
  playground,
  supportingPane,
  feed,
  threePanes,
  levitate,
  foldable,
];
