/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/button/md-gb-button.js';
import '@material/web/components/carousel/md-gb-carousel.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type CarouselLayout} from '@material/web/components/carousel/carousel.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for carousel stories. */
export interface StoryKnobs {
  layout: string;
  centered: boolean;
  itemWidth: number;
  itemCount: number;
  labels: boolean;
  rtl: boolean;
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
    padding: 24px 0;
    box-sizing: border-box;
    max-inline-size: 840px;
  }

  .demo-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .demo-section > :is(h2, p, .row) {
    margin: 0 24px;
  }

  .demo-section h2 {
    font: var(--md-sys-typescale-title-lg);
    letter-spacing: var(--md-sys-typescale-title-lg-tracking);
    color: var(--md-sys-color-on-surface);
  }

  .demo-hint {
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
    color: var(--md-sys-color-on-surface-variant);
  }

  .row {
    display: flex;
    justify-content: flex-end;
  }

  .phone {
    inline-size: 360px;
    max-inline-size: 100%;
  }

  .full-screen {
    --height: 560px;
    inline-size: 320px;
    margin-inline: 24px;
    border-radius: 28px;
    overflow: hidden;
  }

  md-gb-carousel-item [slot='label'] {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .art {
    inline-size: 100%;
    block-size: 100%;
  }
`;

// Generated artwork stands in for photos: the theme's palette in layered
// gradients, so the demo works offline and in both themes.
const palettes = [
  ['primary', 'tertiary-container', 'secondary'],
  ['tertiary', 'primary-container', 'on-tertiary-container'],
  ['secondary', 'secondary-container', 'primary'],
  ['primary-container', 'tertiary', 'on-primary-container'],
  ['tertiary-container', 'secondary', 'tertiary'],
  ['on-secondary-container', 'primary-fixed-dim', 'secondary-fixed'],
];

const titles = [
  'Mountains',
  'Coastline',
  'Desert dunes',
  'Northern lights',
  'Rainforest',
  'Glacier',
  'Canyon',
  'Meadow',
  'Volcano',
  'Lagoon',
  'Tundra',
  'Savanna',
];

function art(index: number) {
  const [a, b, c] = palettes[index % palettes.length].map(
    (role) => `var(--md-sys-color-${role})`,
  );
  const x = (index * 37) % 100;
  const y = 20 + ((index * 53) % 60);
  return html`<div
    class="art"
    role="img"
    aria-label=${titles[index % titles.length]}
    style="background:
      radial-gradient(circle at ${x}% ${y}%, ${c} 0 12%, transparent 13%),
      linear-gradient(160deg, transparent 55%, ${b} 56%),
      linear-gradient(200deg, ${a}, ${b})"></div>`;
}

function items(count: number, labels: boolean, aspects?: string[]) {
  return Array.from(
    {length: Math.max(0, count)},
    (_, i) =>
      html`<md-gb-carousel-item
        label=${titles[i % titles.length]}
        style=${aspects
          ? `aspect-ratio: ${aspects[i % aspects.length]}`
          : nothing}>
        ${art(i)}
        ${labels
          ? html`<span slot="label">${titles[i % titles.length]}</span>`
          : nothing}
      </md-gb-carousel-item>`,
  );
}

const multiAspect = ['16 / 9', '9 / 16', '1 / 1', '3 / 4'];

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles: [demoStyles],
  render(knobs) {
    const layout = knobs.layout as CarouselLayout;
    return html`
      <div class="demo-container" dir=${knobs.rtl ? 'rtl' : 'ltr'}>
        <section class="demo-section">
          <p class="demo-hint">
            Swipe, drag with a mouse, scroll horizontally, or Tab to an item
            and use the arrow keys. The up and down arrows leave the carousel.
          </p>
          <md-gb-carousel
            class=${layout === 'full-screen' ? 'full-screen' : ''}
            aria-label="Destinations"
            layout=${layout}
            alignment=${knobs.centered ? 'center' : 'start'}
            style=${knobs.itemWidth > 0
              ? `--item-width: ${knobs.itemWidth}px`
              : nothing}>
            ${items(
              knobs.itemCount,
              knobs.labels,
              layout === 'uncontained-multi-aspect' ? multiAspect : undefined,
            )}
          </md-gb-carousel>
          <div class="row">
            <md-gb-button color="text">Show all</md-gb-button>
          </div>
        </section>
      </div>
    `;
  },
};

interface LayoutDemo {
  title: string;
  hint: string;
  layout: CarouselLayout;
  centered?: boolean;
  itemWidth?: number;
  aspects?: string[];
  className?: string;
}

// Spec "Specs": the carousel layouts, at a compact (360dp) width.
const layouts: LayoutDemo[] = [
  {
    title: 'Multi-browse',
    hint: 'Large, medium and small items. Snap-scrolls through many items.',
    layout: 'multi-browse',
    itemWidth: 186,
    className: 'phone',
  },
  {
    title: 'Uncontained',
    hint: 'Same-size items that scroll to the edge. Scrolls freely.',
    layout: 'uncontained',
    itemWidth: 240,
    className: 'phone',
  },
  {
    title: 'Uncontained multi-aspect ratio',
    hint: 'Items of their own widths mask with parallax at the edges.',
    layout: 'uncontained-multi-aspect',
    aspects: multiAspect,
    className: 'phone',
  },
  {
    title: 'Hero',
    hint: 'One large item and a small item. Snaps one item at a time.',
    layout: 'hero',
    className: 'phone',
  },
  {
    title: 'Center-aligned hero',
    hint: 'A centered large item between two small items.',
    layout: 'hero',
    centered: true,
    className: 'phone',
  },
  {
    title: 'Multi-browse, expanded',
    hint: 'More large and medium items fit in larger containers.',
    layout: 'multi-browse',
    itemWidth: 240,
  },
];

const variants: MaterialStoryInit<StoryKnobs> = {
  name: 'Layouts',
  styles: [demoStyles],
  render(knobs) {
    return html`
      <div class="demo-container" dir=${knobs.rtl ? 'rtl' : 'ltr'}>
        ${layouts.map(
          (demo) => html`
            <section class="demo-section">
              <h2>${demo.title}</h2>
              <p class="demo-hint">${demo.hint}</p>
              <md-gb-carousel
                class=${demo.className ?? nothing}
                aria-label=${demo.title}
                layout=${demo.layout}
                alignment=${demo.centered ? 'center' : 'start'}
                style=${demo.itemWidth
                  ? `--item-width: ${demo.itemWidth}px`
                  : nothing}>
                ${items(knobs.itemCount, knobs.labels, demo.aspects)}
              </md-gb-carousel>
            </section>
          `,
        )}
        <section class="demo-section">
          <h2>Full-screen</h2>
          <p class="demo-hint">
            One edge-to-edge item at a time; scrolls vertically and snaps.
          </p>
          <md-gb-carousel
            class="full-screen"
            aria-label="Full-screen"
            layout="full-screen">
            ${items(knobs.itemCount, knobs.labels)}
          </md-gb-carousel>
        </section>
      </div>
    `;
  },
};

/** Carousel demo stories. */
export const stories = [playground, variants];
