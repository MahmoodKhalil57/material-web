/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-app-bar.js';
import '../iconbutton/md-gb-icon-button.js';
import '../../styles/icons/md-gb-icon.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import type {ReactiveElement} from 'lit';

adoptStyles(document, [m3Styles]);

let container: HTMLElement | undefined;

afterEach(() => container?.remove());

/** Renders the markup in a box of the given width and waits for updates. */
async function mount(markup: string, width = '600px') {
  container?.remove();
  container = document.createElement('div');
  container.style.width = width;
  document.body.appendChild(container);
  container.innerHTML = markup;
  await settle();
  return container;
}

async function settle(root: ParentNode = document.body) {
  for (const el of root.querySelectorAll('*')) {
    const update = (el as Partial<ReactiveElement>).updateComplete;
    if (update) await update;
    if (el.shadowRoot) await settle(el.shadowRoot);
  }
  if (root !== document.body) return;
  await new Promise((resolve) => requestAnimationFrame(resolve));
  // Finish transitions instead of waiting for them.
  document.getAnimations().forEach((a) => a instanceof CSSTransition && a.finish());
}

/** The app bar element in the mounted markup. */
function appBar(): HTMLElement {
  return container!.querySelector('md-gb-app-bar') as HTMLElement;
}

/** An element in the app bar's shadow root. */
function part(selector: string): HTMLElement {
  return appBar().shadowRoot!.querySelector(selector) as HTMLElement;
}

describe('<md-gb-app-bar> customization and layouts', () => {
  // spec: app-bars-f59139, app-bars-254ee1, app-bars-7eb2c3, app-bars-a29d67
  it('is customized with an image or logo, a subtitle and a filled icon button', async () => {
    await mount(`<md-gb-app-bar size="md">
      <span slot="image" class="logo" style="display:block;width:24px;height:24px"></span>
      Title
      <span slot="subtitle">Subtitle</span>
      <md-gb-icon-button slot="trailing" color="filled" aria-label="Add">
        <md-gb-icon>add</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button slot="trailing" aria-label="Search">
        <md-gb-icon>search</md-gb-icon>
      </md-gb-icon-button>
    </md-gb-app-bar>`);

    // The image or logo is slotted and rendered.
    const image = part('slot[name=image]') as HTMLSlotElement;
    expect(image.assignedElements().length).toBe(1);
    const logo = container!.querySelector('.logo')!;
    expect(logo.getBoundingClientRect().width).toBe(24);

    // The subtitle is slotted and rendered below the headline.
    const subtitle = part('slot[name=subtitle]') as HTMLSlotElement;
    expect(subtitle.assignedElements().length).toBe(1);
    const subtitleRect = subtitle.assignedElements()[0].getBoundingClientRect();
    expect(subtitleRect.height).toBeGreaterThan(0);

    // The filled icon button has a container fill; a standard one has none.
    const [filled, standard] = Array.from(
      container!.querySelectorAll('md-gb-icon-button'),
    ) as HTMLElement[];
    const fill = (el: HTMLElement) =>
      getComputedStyle(el.shadowRoot!.querySelector('.icon-btn')!).backgroundColor;
    expect(fill(filled)).not.toBe('rgba(0, 0, 0, 0)');
    expect(fill(standard)).toBe('rgba(0, 0, 0, 0)');
  });

  // spec: app-bars-2cbec6
  it('lays out a medium app bar taller when a subtitle is shown', async () => {
    await mount('<md-gb-app-bar size="md">Title</md-gb-app-bar>');
    const withoutSubtitle = appBar().getBoundingClientRect().height;

    await mount('<md-gb-app-bar size="md">Title<span slot="subtitle">Subtitle</span></md-gb-app-bar>');
    const withSubtitle = appBar().getBoundingClientRect().height;

    expect(withSubtitle).toBeGreaterThan(withoutSubtitle);
  });

  // spec: app-bars-2cbec6
  it('moves the small app bar title when a leading button is shown', async () => {
    await mount('<md-gb-app-bar>Title</md-gb-app-bar>');
    const alone = part('.app-bar-title').getBoundingClientRect().left;

    await mount(`<md-gb-app-bar>Title
      <md-gb-icon-button slot="leading" aria-label="Menu">
        <md-gb-icon>menu</md-gb-icon>
      </md-gb-icon-button>
    </md-gb-app-bar>`);
    const withLeading = part('.app-bar-title').getBoundingClientRect().left;
    const leading = container!.querySelector('[slot=leading]')!.getBoundingClientRect();

    expect(withLeading).toBeGreaterThan(alone);
    expect(withLeading).toBeGreaterThanOrEqual(leading.right);
  });

  // spec: app-bars-2cbec6
  it('shrinks the search field when trailing actions are shown', async () => {
    await mount('<md-gb-app-bar variant="search"><span slot="search">Search</span></md-gb-app-bar>');
    const alone = part('.app-bar-search-container').getBoundingClientRect().width;

    await mount(`<md-gb-app-bar variant="search"><span slot="search">Search</span>
      <md-gb-icon-button slot="trailing" aria-label="Account">
        <md-gb-icon>account_circle</md-gb-icon>
      </md-gb-icon-button>
    </md-gb-app-bar>`);
    const withTrailing = part('.app-bar-search-container').getBoundingClientRect().width;

    expect(withTrailing).toBeLessThan(alone);
  });
});
