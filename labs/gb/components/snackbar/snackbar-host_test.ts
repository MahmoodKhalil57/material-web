/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import './md-gb-snackbar.js';
import './md-gb-snackbar-host.js';
import {type SnackbarElement} from './snackbar-element.js';
import {
  SNACKBAR_DURATIONS,
  SNACKBAR_RESULTS,
  type SnackbarHostElement,
} from './snackbar-host-element.js';

adoptStyles(document, [m3Styles]);

/** Lets promise chains and Lit updates settle (the clock is mocked). */
async function flush() {
  for (let i = 0; i < 20; i++) {
    await Promise.resolve();
  }
}

function liveRegion(snackbar: SnackbarElement) {
  return snackbar.shadowRoot!.querySelector<HTMLElement>('[role="status"]')!;
}

function actionButton(snackbar: SnackbarElement) {
  return snackbar.shadowRoot!.querySelector<HTMLButtonElement>(
    '.snackbar-action',
  )!;
}

describe('<md-gb-snackbar-host>', () => {
  const env = new Environment();

  async function setup(
    template = html`<md-gb-snackbar-host quick></md-gb-snackbar-host>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const host = root.querySelector(
      'md-gb-snackbar-host',
    ) as SnackbarHostElement;
    await host.updateComplete;
    const snackbar = host.snackbar!;
    return {root, host, snackbar};
  }

  it('renders a built-in snackbar', async () => {
    const {host, snackbar} = await setup();
    expect(snackbar).not.toBeNull();
    expect(snackbar.getAttribute('part')).toBe('snackbar');
    expect(host.currentSnackbarData).toBeNull();
    expect(host.pendingCount).toBe(0);
  });

  // spec: snackbar-1668fa, snackbar-1daf2b
  it('shows consecutive snackbars one at a time', async () => {
    const {host, snackbar} = await setup();
    const first = host.showSnackbar('First');
    const second = host.showSnackbar('Second');
    await flush();
    expect(snackbar.open).toBeTrue();
    expect(snackbar.labelText).toBe('First');
    expect(host.pendingCount).toBe(1);

    host.currentSnackbarData!.dismiss();
    expect(await first).toBe(SNACKBAR_RESULTS.DISMISSED);
    await flush();
    expect(snackbar.open).toBeTrue();
    expect(snackbar.labelText).toBe('Second');
    expect(host.pendingCount).toBe(0);

    host.currentSnackbarData!.dismiss();
    expect(await second).toBe(SNACKBAR_RESULTS.DISMISSED);
    await flush();
    expect(snackbar.open).toBeFalse();
    expect(host.currentSnackbarData).toBeNull();
  });

  it('waits until the previous snackbar has closed', async () => {
    const {host, snackbar} = await setup(
      html`<md-gb-snackbar-host></md-gb-snackbar-host>`,
    );
    host.showSnackbar('First');
    host.showSnackbar('Second');
    jasmine.clock().tick(1000);
    await flush();
    expect(snackbar.labelText).toBe('First');
    host.currentSnackbarData!.dismiss();
    await flush();
    expect(snackbar.labelText)
      .withContext('still closing the first snackbar')
      .toBe('First');
    jasmine.clock().tick(1000);
    await flush();
    jasmine.clock().tick(1000);
    await flush();
    expect(snackbar.labelText).toBe('Second');
    expect(snackbar.open).toBeTrue();
  });

  it('resolves action-performed when the action is activated', async () => {
    const {host, snackbar} = await setup();
    const result = host.showSnackbar({
      message: 'Archived',
      actionLabel: 'Undo',
    });
    await flush();
    await snackbar.updateComplete;
    actionButton(snackbar).click();
    expect(await result).toBe(SNACKBAR_RESULTS.ACTION_PERFORMED);
  });

  // spec: snackbar-08f1be, snackbar-7b4505, snackbar-8ebee4, snackbar-6c1a8a, snackbar-7fe91a, snackbar-ea7b20, snackbar-dd7288
  it('times out by duration (Compose SnackbarDuration)', async () => {
    const {host, snackbar} = await setup();
    const result = host.showSnackbar({message: 'Saved'});
    await flush();
    expect(snackbar.timeoutMs).toBe(SNACKBAR_DURATIONS.short);
    jasmine.clock().tick(SNACKBAR_DURATIONS.short + 1);
    expect(await result).toBe(SNACKBAR_RESULTS.DISMISSED);

    host.showSnackbar({message: 'Archived', actionLabel: 'Undo'});
    await flush();
    expect(snackbar.timeoutMs)
      .withContext('a snackbar with an action stays until dismissed')
      .toBe(SNACKBAR_DURATIONS.indefinite);

    host.dismissAll();
    await flush();
    host.showSnackbar({message: 'Long', duration: 'long'});
    await flush();
    expect(snackbar.timeoutMs).toBe(SNACKBAR_DURATIONS.long);
    host.dismissAll();
    await flush();
    host.showSnackbar({message: 'Custom', duration: 7000});
    await flush();
    expect(snackbar.timeoutMs).toBe(7000);
  });

  it('shows the dismiss action', async () => {
    const {host, snackbar} = await setup();
    host.showSnackbar({message: 'Hi', withDismissAction: true});
    await flush();
    expect(snackbar.hasCloseButton).toBeTrue();
  });

  // spec: snackbar-6ae67f
  it('replaces an outdated snackbar immediately', async () => {
    const {host, snackbar} = await setup();
    const outdated = host.showSnackbar('Uploading 1 file');
    const queued = host.showSnackbar('Other');
    await flush();
    const updated = host.showSnackbar({
      message: 'Uploading 2 files',
      replace: true,
    });
    expect(await outdated).toBe(SNACKBAR_RESULTS.DISMISSED);
    await flush();
    expect(snackbar.labelText).toBe('Uploading 2 files');
    expect(host.pendingCount).toBe(1);
    host.dismissAll();
    expect(await updated).toBe(SNACKBAR_RESULTS.DISMISSED);
    expect(await queued).toBe(SNACKBAR_RESULTS.DISMISSED);
  });

  it('dismisses a queued snackbar before it shows', async () => {
    const {host, snackbar} = await setup();
    host.showSnackbar('First');
    const second = host.showSnackbar('Second');
    await flush();
    host.dismissAll();
    expect(await second).toBe(SNACKBAR_RESULTS.DISMISSED);
    await flush();
    expect(snackbar.open).toBeFalse();
  });

  it('announces each message in a polite live region', async () => {
    const {host, snackbar} = await setup();
    const region = liveRegion(snackbar);
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent!.trim()).toBe('');
    host.showSnackbar({message: 'Message sent', actionLabel: 'Undo'});
    await flush();
    await snackbar.updateComplete;
    expect(region.textContent!.trim()).toBe('Message sent. Undo');
    expect(liveRegion(snackbar))
      .withContext('the same region stays in the page')
      .toBe(region);
    host.currentSnackbarData!.dismiss();
    await flush();
    await snackbar.updateComplete;
    expect(region.textContent!.trim()).toBe('');
    host.showSnackbar('Second message');
    await flush();
    await snackbar.updateComplete;
    expect(region.textContent!.trim()).toBe('Second message');
  });

  it('does not move focus', async () => {
    const {root, host} = await setup(
      html`<button>Before</button>
        <md-gb-snackbar-host quick></md-gb-snackbar-host>`,
    );
    const button = root.querySelector('button')!;
    button.focus();
    host.showSnackbar({message: 'Hi', actionLabel: 'Undo'});
    await flush();
    expect(document.activeElement).toBe(button);
  });

  it('uses a slotted snackbar', async () => {
    const {host, snackbar} = await setup(
      html`<md-gb-snackbar-host
        ><md-gb-snackbar quick id="mine"></md-gb-snackbar
      ></md-gb-snackbar-host>`,
    );
    expect(snackbar.id).toBe('mine');
    expect(host.shadowRoot!.querySelector('md-gb-snackbar')).toBeNull();
    host.showSnackbar('Slotted');
    await flush();
    expect(snackbar.open).toBeTrue();
    expect(snackbar.labelText).toBe('Slotted');
  });

  it('skips a snackbar whose open is canceled', async () => {
    const {host, snackbar} = await setup();
    snackbar.addEventListener('open', (e) => e.preventDefault(), {once: true});
    const first = host.showSnackbar('Blocked');
    const second = host.showSnackbar('Shown');
    expect(await first).toBe(SNACKBAR_RESULTS.DISMISSED);
    await flush();
    expect(snackbar.labelText).toBe('Shown');
    host.dismissAll();
    await second;
  });

  // spec: snackbar-25c9f5, snackbar-3a9e88, snackbar-1381ca, snackbar-4e6745
  it('places the built-in snackbar above its anchor', async () => {
    const {host, snackbar, root} = await setup(
      html`<div style="position: relative; block-size: 400px">
        <button
          id="fab"
          style="position: absolute; inset-block-end: 16px; block-size: 56px">
          FAB
        </button>
        <md-gb-snackbar-host quick anchor="fab"></md-gb-snackbar-host>
      </div>`,
    );
    host.showSnackbar('Above the FAB');
    await flush();
    await snackbar.updateComplete;
    const fab = root.querySelector('#fab')!.getBoundingClientRect();
    const box = snackbar.getBoundingClientRect();
    // `--bottom-offset` (16px) above the FAB's top edge.
    expect(Math.round(fab.top - box.bottom)).toBe(16);
  });
});

describe('<md-gb-snackbar> anchor', () => {
  const env = new Environment();

  it('sits above the anchor only while open', async () => {
    const root = env.render(
      html`<div style="position: relative; block-size: 400px">
        <div
          id="toolbar"
          style="position: absolute; inset-block-end: 0; inline-size: 100%; block-size: 64px"></div>
        <md-gb-snackbar quick anchor="toolbar" label-text="Hi"></md-gb-snackbar>
      </div>`,
    );
    await env.waitForStability();
    const snackbar = root.querySelector('md-gb-snackbar') as SnackbarElement;
    const container = root.querySelector('div')!.getBoundingClientRect();
    expect(snackbar.resolvedAnchor?.id).toBe('toolbar');
    await snackbar.show();
    await snackbar.updateComplete;
    expect(snackbar.style.getPropertyValue('--_anchor-offset')).toBe('64px');
    expect(
      Math.round(container.bottom - snackbar.getBoundingClientRect().bottom),
    ).toBe(64 + 16);
    await snackbar.close();
    await snackbar.updateComplete;
    expect(snackbar.style.getPropertyValue('--_anchor-offset')).toBe('');
  });
});
