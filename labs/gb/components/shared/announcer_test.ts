/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement, render} from 'lit';

import {
  ANNOUNCER_ATTRIBUTE,
  AnnouncerController,
  type AnnouncerOptions,
  createLiveRegion,
  normalizeAnnouncement,
} from './announcer.js';

class AnnouncerHost extends LitElement {
  static options: AnnouncerOptions = {delay: 5};
  show = true;
  readonly announcer = new AnnouncerController(this, AnnouncerHost.options);

  protected override render() {
    return html`<p>Content</p>
      ${this.show ? html`<section id="surface"></section>` : ''}`;
  }
}
customElements.define('test-announcer-host', AnnouncerHost);

class SurfaceHost extends LitElement {
  modal = true;
  readonly announcer = new AnnouncerController(this, {
    delay: 5,
    container: () => this.renderRoot.querySelector('.surface'),
  });

  protected override render() {
    return this.modal
      ? html`<dialog class="surface"></dialog>`
      : html`<div class="surface"></div>`;
  }
}
customElements.define('test-announcer-surface-host', SurfaceHost);

let container: HTMLElement | undefined;

async function setup<T extends LitElement>(tag: string) {
  container?.remove();
  container = document.createElement('div');
  document.body.appendChild(container);
  render(html`${document.createElement(tag)}`, container);
  const host = container.firstElementChild as T;
  await host.updateComplete;
  return host;
}

function regionOf(host: LitElement, politeness: string) {
  return host.shadowRoot!.querySelector<HTMLElement>(
    `[${ANNOUNCER_ATTRIBUTE}="${politeness}"]`,
  );
}

describe('normalizeAnnouncement()', () => {
  it('collapses whitespace and trims', () => {
    expect(normalizeAnnouncement('  Message \n  sent  ')).toBe('Message sent');
  });

  it('turns nothing into an empty string', () => {
    expect(normalizeAnnouncement(null)).toBe('');
    expect(normalizeAnnouncement(undefined)).toBe('');
    expect(normalizeAnnouncement('   ')).toBe('');
  });
});

describe('createLiveRegion()', () => {
  it('is a polite status region that reads whole messages', () => {
    // spec: snackbar-953add
    const region = createLiveRegion('polite');
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
  });

  it('is an assertive alert region that reads whole messages', () => {
    // spec: text-fields-7bc15d
    const region = createLiveRegion('assertive');
    expect(region.getAttribute('role')).toBe('alert');
    expect(region.getAttribute('aria-live')).toBe('assertive');
    expect(region.getAttribute('aria-atomic')).toBe('true');
  });

  it('is hidden visually but stays in the accessibility tree', () => {
    const region = createLiveRegion('polite');
    document.body.appendChild(region);
    region.textContent = 'Hidden';
    const rect = region.getBoundingClientRect();
    expect(rect.width).toBeLessThanOrEqual(1);
    expect(rect.height).toBeLessThanOrEqual(1);
    expect(getComputedStyle(region).display).not.toBe('none');
    expect(region.hasAttribute('hidden')).toBeFalse();
    expect(region.getAttribute('aria-hidden')).toBeNull();
    region.remove();
  });
});

describe('AnnouncerController', () => {
  afterEach(() => container?.remove());

  describe('live regions', () => {
    it('adds a polite region inside the shadow root when connected', async () => {
      // spec: snackbar-953add
      const host = await setup<AnnouncerHost>('test-announcer-host');
      const polite = regionOf(host, 'polite')!;
      expect(polite).not.toBeNull();
      expect(polite.getAttribute('aria-live')).toBe('polite');
      expect(polite.getRootNode()).toBe(host.shadowRoot);
      expect(polite.textContent).toBe('');
    });

    it('creates the assertive region on first use', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      expect(regionOf(host, 'assertive')).toBeNull();
      await host.announcer.announce('Enter a valid ZIP code', 'assertive');
      const assertive = regionOf(host, 'assertive')!;
      expect(assertive.getAttribute('role')).toBe('alert');
      expect(assertive.textContent).toBe('Enter a valid ZIP code');
    });

    it('creates the regions listed in `regions` right away', async () => {
      class Both extends LitElement {
        readonly announcer = new AnnouncerController(this, {
          regions: ['polite', 'assertive'],
        });
      }
      customElements.define('test-announcer-both', Both);
      const host = await setup<Both>('test-announcer-both');
      expect(regionOf(host, 'polite')).not.toBeNull();
      expect(regionOf(host, 'assertive')).not.toBeNull();
    });

    it('keeps the region in the page across renders', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      const polite = regionOf(host, 'polite')!;
      host.requestUpdate();
      await host.updateComplete;
      expect(regionOf(host, 'polite')).toBe(polite);
    });

    it('works in a shadow root of a nested component', async () => {
      container?.remove();
      container = document.createElement('div');
      document.body.appendChild(container);
      const outer = document.createElement('div');
      const root = outer.attachShadow({mode: 'open'});
      container.appendChild(outer);
      const inner = document.createElement(
        'test-announcer-host',
      ) as AnnouncerHost;
      root.appendChild(inner);
      await inner.updateComplete;
      await inner.announcer.announce('Nested');
      expect(regionOf(inner, 'polite')!.textContent).toBe('Nested');
      expect(root.querySelector(`[${ANNOUNCER_ATTRIBUTE}]`)).toBeNull();
    });
  });

  describe('announce()', () => {
    it('sets a new message at once and the promise resolves', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      await host.announcer.announce('First');
      const promise = host.announcer.announce('Second');
      expect(regionOf(host, 'polite')!.textContent).toBe('Second');
      await promise;
    });

    it('normalizes whitespace in the message', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      await host.announcer.announce('  Message \n sent ');
      expect(host.announcer.text()).toBe('Message sent');
    });

    it('announces an identical message again by clearing the region first', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      const polite = regionOf(host, 'polite')!;
      await host.announcer.announce('Refreshing');
      const changes: string[] = [];
      new MutationObserver(() => changes.push(polite.textContent!)).observe(
        polite,
        {childList: true, characterData: true, subtree: true},
      );
      const promise = host.announcer.announce('Refreshing');
      expect(polite.textContent).toBe('');
      await promise;
      expect(polite.textContent).toBe('Refreshing');
      // The region went empty, then held the text again: a change to read.
      expect(changes).toContain('');
      expect(changes[changes.length - 1]).toBe('Refreshing');
    });

    it('announces the same message many times in a row', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      for (let i = 0; i < 3; i++) {
        await host.announcer.announce('Saved');
        expect(host.announcer.text()).toBe('Saved');
      }
    });

    it('lets the latest announcement win over a pending repeat', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      await host.announcer.announce('Same');
      const first = host.announcer.announce('Same');
      const second = host.announcer.announce('Other');
      await Promise.all([first, second]);
      expect(host.announcer.text()).toBe('Other');
    });

    it('keeps polite and assertive messages apart', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      await host.announcer.announce('Saved', 'polite');
      await host.announcer.announce('Failed', 'assertive');
      expect(host.announcer.text('polite')).toBe('Saved');
      expect(host.announcer.text('assertive')).toBe('Failed');
    });

    it('announces an empty message as clearing the region', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      await host.announcer.announce('Saved');
      await host.announcer.announce('');
      expect(host.announcer.text()).toBe('');
    });

    it('does not move focus', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      const button = document.createElement('button');
      container!.appendChild(button);
      button.focus();
      await host.announcer.announce('Hello');
      await host.announcer.announce('Alert', 'assertive');
      expect(document.activeElement).toBe(button);
    });
  });

  describe('clear()', () => {
    it('empties the regions', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      await host.announcer.announce('Saved');
      await host.announcer.announce('Failed', 'assertive');
      host.announcer.clear('polite');
      expect(host.announcer.text('polite')).toBe('');
      expect(host.announcer.text('assertive')).toBe('Failed');
      host.announcer.clear();
      expect(host.announcer.text('assertive')).toBe('');
    });

    it('drops an announcement that is still pending', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      await host.announcer.announce('Saved');
      const pending = host.announcer.announce('Saved');
      host.announcer.clear();
      await pending;
      expect(host.announcer.text()).toBe('');
    });
  });

  describe('disconnect', () => {
    it('removes the regions and drops pending announcements', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      await host.announcer.announce('Saved');
      const pending = host.announcer.announce('Saved');
      host.remove();
      await pending;
      expect(host.shadowRoot!.querySelector(`[${ANNOUNCER_ATTRIBUTE}]`))
        .withContext('no region left behind')
        .toBeNull();
      expect(host.shadowRoot!.querySelector(`[${ANNOUNCER_ATTRIBUTE}]`))
        .withContext('the dropped announcement does not come back')
        .toBeNull();
    });

    it('adds the regions again when reconnected', async () => {
      const host = await setup<AnnouncerHost>('test-announcer-host');
      await host.announcer.announce('Saved');
      host.remove();
      container!.appendChild(host);
      await host.updateComplete;
      const polite = regionOf(host, 'polite')!;
      expect(polite).not.toBeNull();
      expect(polite.textContent).toBe('');
      await host.announcer.announce('Again');
      expect(polite.textContent).toBe('Again');
    });
  });

  describe('container', () => {
    it('puts the regions in the element the container option returns', async () => {
      const host = await setup<SurfaceHost>('test-announcer-surface-host');
      await host.announcer.announce('In the dialog');
      const dialog = host.shadowRoot!.querySelector('dialog')!;
      expect(dialog.contains(regionOf(host, 'polite'))).toBeTrue();
      expect(regionOf(host, 'polite')!.textContent).toBe('In the dialog');
    });

    it('follows the container when the template replaces it', async () => {
      const host = await setup<SurfaceHost>('test-announcer-surface-host');
      await host.announcer.announce('Kept');
      host.modal = false;
      host.requestUpdate();
      await host.updateComplete;
      const div = host.shadowRoot!.querySelector('div.surface')!;
      expect(div.contains(regionOf(host, 'polite'))).toBeTrue();
      expect(host.shadowRoot!.querySelector('dialog')).toBeNull();
    });
  });
});
