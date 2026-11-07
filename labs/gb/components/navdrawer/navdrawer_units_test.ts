/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../../styles/icon/md-gb-icon.js';
import './md-gb-nav-drawer.js';
import './md-gb-nav-drawer-item.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type NavDrawerElement} from './nav-drawer-element.js';
import {type NavDrawerItemElement} from './nav-drawer-item-element.js';

adoptStyles(document, [m3Styles]);

// Environment mocks requestAnimationFrame; keep the real one.
const realRaf = window.requestAnimationFrame.bind(window);
const nextFrame = () => new Promise((resolve) => realRaf(resolve));

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

function control(item: NavDrawerItemElement) {
  return item.shadowRoot!.querySelector<HTMLElement>('.nav-drawer-item')!;
}

function sheet(drawer: NavDrawerElement) {
  return drawer.shadowRoot!.querySelector<HTMLElement>('.nav-drawer')!;
}

/** Finishes color and fill transitions so computed styles are final. */
function finish(...hosts: Element[]) {
  document.body.offsetHeight;
  const roots: DocumentOrShadowRoot[] = [document];
  for (const host of hosts) if (host.shadowRoot) roots.push(host.shadowRoot);
  for (const root of roots) root.getAnimations().forEach((a) => a.finish());
  document.body.offsetHeight;
}

function iconOf(item: NavDrawerItemElement) {
  return item.querySelector<HTMLElement>('md-gb-icon')!;
}

describe('md-gb-nav-drawer spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(html`<button id="before">Before</button>${template}`);
    await env.waitForStability();
    const drawer = root.querySelector('md-gb-nav-drawer') as NavDrawerElement;
    await drawer.updateComplete;
    const items = Array.from(
      root.querySelectorAll<NavDrawerItemElement>('md-gb-nav-drawer-item'),
    );
    for (const item of items) await item.updateComplete;
    return {root, drawer, items, before: root.querySelector<HTMLElement>('#before')!};
  }

  const standard = html`<md-gb-nav-drawer quick open aria-label="Mail">
    <h2 slot="headline">Mail</h2>
    <md-gb-nav-drawer-item selected badge="24">
      <md-gb-icon slot="icon">inbox</md-gb-icon>
      Inbox
    </md-gb-nav-drawer-item>
    <md-gb-nav-drawer-item>
      <md-gb-icon slot="icon">send</md-gb-icon>
      Outbox
    </md-gb-nav-drawer-item>
    <md-gb-nav-drawer-item>Trash</md-gb-nav-drawer-item>
  </md-gb-nav-drawer>`;

  const modal = html`<md-gb-nav-drawer quick modal aria-label="Mail">
    <md-gb-nav-drawer-item selected>Inbox</md-gb-nav-drawer-item>
    <md-gb-nav-drawer-item>Outbox</md-gb-nav-drawer-item>
  </md-gb-nav-drawer>`;

  afterEach(() => {
    for (const drawer of document.querySelectorAll('md-gb-nav-drawer')) {
      drawer.shadowRoot?.querySelector('dialog')?.close();
    }
  });

  // spec: navigation-drawer-826218, navigation-drawer-d5fae5, navigation-drawer-185821, navigation-drawer-38a904
  it('colors a modal drawer container surface container low', async () => {
    const {drawer} = await render(modal);
    await drawer.show();
    expect(getComputedStyle(sheet(drawer)).backgroundColor).toBe(
      resolvedColor('--md-sys-color-surface-container-low'),
    );
  });

  // spec: navigation-drawer-9eb3c5, navigation-drawer-67d832, navigation-drawer-5316be
  it('colors the headline, unselected icons and unselected labels on surface variant', async () => {
    const {items, root} = await render(standard);
    const headline = root.querySelector('[slot="headline"]')!;
    const onSurfaceVariant = resolvedColor('--md-sys-color-on-surface-variant');
    expect(getComputedStyle(headline).color).withContext('headline').toBe(onSurfaceVariant);
    expect(getComputedStyle(iconOf(items[1])).color)
      .withContext('icon')
      .toBe(onSurfaceVariant);
    expect(getComputedStyle(control(items[1])).color)
      .withContext('label')
      .toBe(onSurfaceVariant);
  });

  // spec: navigation-drawer-e64403, navigation-drawer-2c8ad5, navigation-drawer-37c268, navigation-drawer-79d6c3, navigation-drawer-c731e4
  it('backs the selected destination with a secondary container indicator and on secondary container content', async () => {
    const {items} = await render(standard);
    const active = control(items[0]);
    const onSecondaryContainer = resolvedColor('--md-sys-color-on-secondary-container');
    expect(getComputedStyle(active).backgroundColor)
      .withContext('indicator')
      .toBe(resolvedColor('--md-sys-color-secondary-container'));
    expect(getComputedStyle(iconOf(items[0])).color)
      .withContext('icon')
      .toBe(onSecondaryContainer);
    expect(getComputedStyle(active).color).withContext('label').toBe(onSecondaryContainer);
    const badge = items[0].shadowRoot!.querySelector('.nav-drawer-item-badge')!;
    expect(getComputedStyle(badge).color)
      .withContext('badge')
      .toBe(onSecondaryContainer);
  });

  // spec: navigation-drawer-3c0e63, navigation-drawer-f16b9f, navigation-drawer-2aca32, navigation-drawer-0c6b9a
  it('changes label color across enabled, hovered, focused and pressed states', async () => {
    const {items, before} = await render(standard);
    const item = control(items[1]);
    const onSurface = resolvedColor('--md-sys-color-on-surface');
    expect(getComputedStyle(item).color)
      .withContext('enabled')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));

    // The `hover` and `active` classes emulate those pseudo-classes.
    item.classList.add('hover');
    finish(items[1]);
    expect(getComputedStyle(item).color).withContext('hovered').toBe(onSurface);
    item.classList.remove('hover');

    item.classList.add('active');
    finish(items[1]);
    expect(getComputedStyle(item).color).withContext('pressed').toBe(onSurface);
    item.classList.remove('active');

    // Tab from the button before the drawer reaches the selected item; the
    // arrow key moves to the next one.
    before.focus();
    await sendKeys({press: 'Tab'});
    await sendKeys({press: 'ArrowDown'});
    expect(items[1].shadowRoot!.activeElement).toBe(item);
    finish(items[1]);
    expect(getComputedStyle(item).color).withContext('focused').toBe(onSurface);
  });

  // spec: navigation-drawer-97cd2b
  it('scrolls its contents when the destinations are taller than the drawer', async () => {
    const many = Array.from({length: 30}, (_, i) => i);
    const {drawer} = await render(html`
      <div style="block-size: 300px; display: flex">
        <md-gb-nav-drawer quick open aria-label="Mail">
          ${many.map(
            (i) =>
              html`<md-gb-nav-drawer-item>Destination ${i}</md-gb-nav-drawer-item>`,
          )}
        </md-gb-nav-drawer>
      </div>
    `);
    const el = sheet(drawer);
    expect(el.getBoundingClientRect().height).toBe(300);
    expect(el.scrollHeight).toBeGreaterThan(el.clientHeight);
    el.scrollTop = 200;
    expect(el.scrollTop).toBe(200);
  });

  // spec: navigation-drawer-ec04e5, navigation-drawer-bddb5c
  it('animates on screen with a transition', async () => {
    const {drawer} = await render(
      html`<md-gb-nav-drawer modal aria-label="Mail">
        <md-gb-nav-drawer-item>Inbox</md-gb-nav-drawer-item>
      </md-gb-nav-drawer>`,
    );
    const offsets = async () => {
      const result: string[] = [];
      for (let i = 0; i < 12; i++) {
        await nextFrame();
        result.push(getComputedStyle(sheet(drawer)).translate);
      }
      return new Set(result);
    };
    const shown = drawer.show();
    expect((await offsets()).size).withContext('enter').toBeGreaterThan(2);
    await shown;
    const closing = drawer.close();
    expect((await offsets()).size).withContext('exit').toBeGreaterThan(2);
    await closing;
  });

  // spec: navigation-drawer-b1920e, navigation-drawer-dac883, navigation-drawer-677a49, navigation-drawer-f8d0b1, navigation-drawer-892984
  it('shows the active indicator in place when a destination is tapped', async () => {
    const {items} = await render(standard);
    const target = control(items[1]);
    expect(getComputedStyle(target).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    const rect = target.getBoundingClientRect();
    target.click();
    await env.waitForStability();
    finish(items[1]);
    expect(items[1].selected).toBeTrue();
    expect(target.getAttribute('aria-current')).toBe('page');
    expect(getComputedStyle(target).backgroundColor).toBe(
      resolvedColor('--md-sys-color-secondary-container'),
    );
    expect(target.getBoundingClientRect().top).toBe(rect.top);
    // The ripple is drawn on the same element as the indicator, so it
    // passes through the indicator.
    expect(target.classList).toContain('ripple');
    expect(getComputedStyle(target).backgroundImage).toContain('radial-gradient');
  });

  // spec: navigation-drawer-8ae3cf, navigation-drawer-49050f, navigation-drawer-ce85db, navigation-drawer-92aa37, navigation-drawer-e11552, navigation-drawer-1d4c45
  it('fills the icon of the selected destination and leaves the others outlined', async () => {
    const {items} = await render(standard);
    finish(...items);
    const fill = (item: NavDrawerItemElement) =>
      getComputedStyle(iconOf(item)).fontVariationSettings;
    expect(fill(items[0])).toContain('"FILL" 1');
    expect(fill(items[1])).toContain('"FILL" 0');
    items[1].selected = true;
    items[0].selected = false;
    await env.waitForStability();
    finish(...items);
    expect(fill(items[1])).toContain('"FILL" 1');
    expect(fill(items[0])).toContain('"FILL" 0');
  });

  // spec: navigation-drawer-1d5163, navigation-drawer-dd1155
  it('changes the icon color when the destination is selected', async () => {
    const {items} = await render(standard);
    const unselected = getComputedStyle(iconOf(items[1])).color;
    expect(getComputedStyle(iconOf(items[0])).color).not.toBe(unselected);
    expect(getComputedStyle(iconOf(items[0])).color).toBe(
      resolvedColor('--md-sys-color-on-secondary-container'),
    );
    expect(unselected).toBe(resolvedColor('--md-sys-color-on-surface-variant'));
  });

  // spec: navigation-drawer-ff897e
  it('exposes the label text as the name of a link or button', async () => {
    const {items} = await render(
      html`<md-gb-nav-drawer quick open aria-label="Mail">
        <md-gb-nav-drawer-item href="#inbox">Inbox</md-gb-nav-drawer-item>
        <md-gb-nav-drawer-item>Outbox</md-gb-nav-drawer-item>
      </md-gb-nav-drawer>`,
    );
    const link = control(items[0]);
    const button = control(items[1]);
    expect(link.tagName).toBe('A');
    expect(button.tagName).toBe('BUTTON');
    // No aria-label overrides the text, which a screen reader reads before
    // the role.
    expect(link.hasAttribute('aria-label')).toBeFalse();
    expect(button.hasAttribute('aria-label')).toBeFalse();
    expect(items[0].textContent!.trim()).toBe('Inbox');
    expect(items[1].textContent!.trim()).toBe('Outbox');
    expect(link.querySelector('slot:not([name])')).not.toBeNull();
    expect(button.querySelector('slot:not([name])')).not.toBeNull();
  });

  // spec: navigation-drawer-24047a, navigation-drawer-944144, navigation-drawer-c3c243, navigation-drawer-5fcf51, navigation-drawer-e66a63, navigation-drawer-24f9fc, navigation-drawer-1a0765
  it('holds a list of destinations, a headline, section labels and dividers in one side sheet', async () => {
    const {drawer, root, items} = await render(
      html`<md-gb-nav-drawer quick open aria-label="Mail">
        <h2 slot="headline">Mail</h2>
        <md-gb-nav-drawer-item selected>Inbox</md-gb-nav-drawer-item>
        <hr />
        <h3 class="nav-drawer-section-label">Labels</h3>
        <md-gb-nav-drawer-item>Family</md-gb-nav-drawer-item>
      </md-gb-nav-drawer>`,
    );
    const sheetEl = sheet(drawer);
    const headline = root.querySelector('[slot="headline"]')!;
    const label = root.querySelector('h3')!;
    const divider = root.querySelector('hr')!;
    for (const el of [headline, label, divider, ...items]) {
      const slot = el.assignedSlot;
      expect(slot !== null && sheetEl.contains(slot))
        .withContext(el.tagName)
        .toBeTrue();
    }
    // A vertical list: headline, destination, divider, section label, destination.
    const tops = [headline, items[0], divider, label, items[1]].map(
      (el) => el.getBoundingClientRect().top,
    );
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
    // The divider separates the groups; the section label heads the second.
    expect(divider.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      items[0].getBoundingClientRect().bottom,
    );
    expect(label.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      divider.getBoundingClientRect().bottom,
    );
    expect(getComputedStyle(label).fontSize).toBe(
      getComputedStyle(headline).fontSize,
    );
    expect(getComputedStyle(divider).borderBottomWidth).toBe('1px');
  });

  // spec: navigation-drawer-af2ff1, navigation-drawer-f78085
  it('opens from the start edge: left in LTR and right in RTL', async () => {
    for (const dir of ['ltr', 'rtl']) {
      const {drawer} = await render(
        html`<div dir=${dir}>
          <md-gb-nav-drawer quick modal aria-label="Mail">
            <md-gb-nav-drawer-item>Inbox</md-gb-nav-drawer-item>
          </md-gb-nav-drawer>
        </div>`,
      );
      await drawer.show();
      const rect = sheet(drawer).getBoundingClientRect();
      if (dir === 'ltr') {
        expect(rect.left).withContext(dir).toBeCloseTo(0, 0);
      } else {
        expect(rect.right).withContext(dir).toBeCloseTo(window.innerWidth, 0);
      }
      await drawer.close();
    }
  });

  // spec: navigation-drawer-0c6fba, navigation-drawer-a4e827
  it('marks only the current destination with a background-shaped active indicator', async () => {
    const {items} = await render(standard);
    const shape = (item: NavDrawerItemElement) =>
      getComputedStyle(control(item));
    expect(shape(items[0]).backgroundColor).toBe(
      resolvedColor('--md-sys-color-secondary-container'),
    );
    expect(parseFloat(shape(items[0]).borderTopLeftRadius)).toBeGreaterThan(0);
    expect(control(items[0]).getAttribute('aria-current')).toBe('page');
    for (const other of items.slice(1)) {
      expect(shape(other).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(control(other).hasAttribute('aria-current')).toBeFalse();
    }
  });

  // spec: navigation-drawer-36c0c2, navigation-drawer-aaf9af, navigation-drawer-59a217, navigation-drawer-cf0b10, navigation-drawer-730791
  it('makes each destination an actionable item with a label and an optional icon before it', async () => {
    const {items} = await render(
      html`<md-gb-nav-drawer quick open aria-label="Mail">
        <md-gb-nav-drawer-item>
          <md-gb-icon slot="icon">inbox</md-gb-icon>
          Inbox
        </md-gb-nav-drawer-item>
        <md-gb-nav-drawer-item>Trash</md-gb-nav-drawer-item>
      </md-gb-nav-drawer>`,
    );
    let activated = 0;
    items[0].addEventListener('click', () => activated++);
    control(items[0]).click();
    expect(activated).toBe(1);
    expect(['A', 'BUTTON']).toContain(control(items[0]).tagName);
    // The icon is drawn before the label text.
    const icon = iconOf(items[0]).getBoundingClientRect();
    const text = items[0]
      .shadowRoot!.querySelector('.nav-drawer-item-label')!
      .getBoundingClientRect();
    expect(icon.right).toBeLessThanOrEqual(text.left);
    // Without an icon, only the required label is shown.
    const bare = items[1].shadowRoot!.querySelector<HTMLElement>(
      '.nav-drawer-item-icon',
    )!;
    expect(getComputedStyle(bare).display).toBe('none');
    expect(
      items[1]
        .shadowRoot!.querySelector('.nav-drawer-item-label')!
        .getBoundingClientRect().width,
    ).toBeGreaterThan(0);
  });

  // spec: navigation-drawer-d2c051, navigation-drawer-649ecb
  it('lets a drawer use text labels without icons', async () => {
    const {items} = await render(
      html`<md-gb-nav-drawer quick open aria-label="Mail">
        <md-gb-nav-drawer-item selected>Inbox</md-gb-nav-drawer-item>
        <md-gb-nav-drawer-item>Outbox</md-gb-nav-drawer-item>
        <md-gb-nav-drawer-item>Favorites</md-gb-nav-drawer-item>
        <md-gb-nav-drawer-item>Trash</md-gb-nav-drawer-item>
      </md-gb-nav-drawer>`,
    );
    expect(items.length).toBe(4);
    for (const item of items) {
      const icon = item.shadowRoot!.querySelector<HTMLElement>(
        '.nav-drawer-item-icon',
      )!;
      expect(getComputedStyle(icon).display).toBe('none');
    }
    expect(control(items[0]).getAttribute('aria-current')).toBe('page');
    expect(items[0].textContent!.trim()).toBe('Inbox');
  });

  // spec: navigation-drawer-bb4a70, navigation-drawer-a6c46d, navigation-drawer-323180
  it('truncates a long label on one line without shrinking its text', async () => {
    const {items} = await render(
      html`<div style="inline-size: 360px; display: flex">
        <md-gb-nav-drawer quick open aria-label="Mail">
          <md-gb-nav-drawer-item>Inbox</md-gb-nav-drawer-item>
          <md-gb-nav-drawer-item
            >A destination label far too long to fit inside the drawer width
            without being cut off</md-gb-nav-drawer-item
          >
        </md-gb-nav-drawer>
      </div>`,
    );
    const label = (item: NavDrawerItemElement) =>
      item.shadowRoot!.querySelector<HTMLElement>('.nav-drawer-item-label')!;
    const long = label(items[1]);
    expect(getComputedStyle(long).whiteSpace).toBe('nowrap');
    expect(getComputedStyle(long).textOverflow).toBe('ellipsis');
    expect(long.scrollWidth).toBeGreaterThan(long.clientWidth);
    expect(control(items[1]).getBoundingClientRect().height).toBe(
      control(items[0]).getBoundingClientRect().height,
    );
    expect(getComputedStyle(long).fontSize).toBe(
      getComputedStyle(label(items[0])).fontSize,
    );
  });

  // spec: navigation-drawer-a17b82
  it('applies a scrim behind a modal drawer and none behind a standard one', async () => {
    const {drawer} = await render(modal);
    await drawer.show();
    const scrim = drawer.shadowRoot!.querySelector<HTMLElement>(
      '.nav-drawer-scrim',
    )!;
    finish(drawer);
    const style = getComputedStyle(scrim);
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(Number(style.opacity)).toBe(1);
    expect(scrim.getBoundingClientRect().width).toBeGreaterThanOrEqual(
      window.innerWidth - 1,
    );
    expect(
      scrim.compareDocumentPosition(sheet(drawer)) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    await drawer.close();
    const {drawer: standardDrawer} = await render(standard);
    expect(
      standardDrawer.shadowRoot!.querySelector('.nav-drawer-scrim'),
    ).toBeNull();
  });
});
