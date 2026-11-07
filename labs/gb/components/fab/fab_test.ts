/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import {FAB_CLASSES, fabClasses, setupCollapseOnScroll} from './fab.js';
import fabStyles from './fab.cssresult.js';
import {FabElement} from './fab-element.js';
import './md-gb-fab.js';

adoptStyles(document, [m3Styles, fabStyles]);

describe('fabClasses()', () => {
  it('defaults to a primary container FAB', () => {
    const classes = fabClasses();
    expect(classes[FAB_CLASSES.fab]).toBeTrue();
    expect(classes[FAB_CLASSES.fabPrimaryContainer]).toBeTrue();
    expect(classes[FAB_CLASSES.fabCollapsed]).toBeFalse();
  });

  it('adds the size classes', () => {
    expect(fabClasses({size: 'sm'})[FAB_CLASSES.fabSm]).toBeTrue();
    expect(fabClasses({size: 'md'})[FAB_CLASSES.fabMd]).toBeTrue();
    expect(fabClasses({size: 'lg'})[FAB_CLASSES.fabLg]).toBeTrue();
  });

  it('adds the collapsed class when not expanded', () => {
    expect(fabClasses({expanded: false})[FAB_CLASSES.fabCollapsed]).toBeTrue();
    expect(fabClasses({expanded: true})[FAB_CLASSES.fabCollapsed]).toBeFalse();
  });
});

describe('.fab styles', () => {
  const env = new Environment();

  function render(classes: string, label = '') {
    const root = env.render(html`
      <button class="${classes}">
        <span class="icon" style="display: inline-block"></span>
        ${label ? html`<span class="fab-label">${label}</span>` : ''}
      </button>
    `);
    const button = root.querySelector('button')!;
    const icon = root.querySelector<HTMLElement>('.icon')!;
    icon.style.inlineSize = 'var(--icon-size)';
    icon.style.blockSize = 'var(--icon-size)';
    return {
      button,
      label: root.querySelector<HTMLElement>('.fab-label'),
    };
  }

  // md.comp.fab(.small|.medium|.large).container.width/height
  for (const [size, px] of [
    ['fab-sm', 40],
    ['', 56],
    ['fab-md', 80],
    ['fab-lg', 96],
  ] as const) {
    it(`renders a square ${px}px icon-only FAB (${size || 'default'})`, () => {
      const {button} = render(`fab fab-primary-container ${size}`);
      const rect = button.getBoundingClientRect();
      expect(rect.height).toBe(px);
      expect(rect.width).toBe(px);
    });
  }

  it('gives the small FAB a 48px touch target', () => {
    const {button} = render('fab fab-primary-container fab-sm');
    const target = getComputedStyle(button, '::before');
    expect(target.position).toBe('absolute');
    expect(target.width).toBe('48px');
    expect(target.height).toBe('48px');
  });

  // md.comp.extended-fab.small|medium|large
  for (const [size, spec] of [
    ['', {leading: '16px', trailing: '16px', gap: '8px', font: '16px'}],
    ['fab-md', {leading: '26px', trailing: '26px', gap: '12px', font: '22px'}],
    ['fab-lg', {leading: '28px', trailing: '28px', gap: '16px', font: '24px'}],
  ] as const) {
    it(`uses the extended FAB ${size || 'small'} padding, gap and type`, () => {
      const {button} = render(`fab ${size}`, 'Compose');
      const style = getComputedStyle(button);
      expect(style.paddingInlineStart).toBe(spec.leading);
      expect(style.paddingInlineEnd).toBe(spec.trailing);
      expect(style.columnGap).toBe(spec.gap);
      expect(style.fontSize).toBe(spec.font);
    });
  }

  it('collapses an extended FAB to the icon-only FAB size', () => {
    const {button, label} = render('fab fab-collapsed', 'Compose');
    label!.style.transition = 'none';
    const rect = button.getBoundingClientRect();
    expect(rect.width).toBe(56);
    expect(label!.getBoundingClientRect().width).toBe(0);
    expect(getComputedStyle(label!).opacity).toBe('0');
  });

  it('animates the label width and opacity when collapsing', () => {
    const {button, label} = render('fab', 'Compose');
    getComputedStyle(label!).inlineSize; // Flush the expanded style.
    button.classList.add(FAB_CLASSES.fabCollapsed);
    const properties = label!
      .getAnimations()
      .map((a) => (a as CSSTransition).transitionProperty);
    // Logical properties are reported by their physical longhands.
    expect(properties).toContain('width');
    expect(properties).toContain('opacity');
  });

  it('is wider than the icon-only FAB when expanded', () => {
    const {button} = render('fab', 'Compose');
    expect(button.getBoundingClientRect().width).toBeGreaterThan(56);
  });
});

describe('<md-gb-fab>', () => {
  const env = new Environment();

  async function setupTest(template = html`<md-gb-fab></md-gb-fab>`) {
    const root = env.render(template);
    await env.waitForStability();
    const fab = root.querySelector('md-gb-fab')!;
    const button = fab.shadowRoot!.querySelector('button')!;
    return {root, fab, button};
  }

  it('initializes with default values', async () => {
    const {fab} = await setupTest();
    expect(fab).toBeInstanceOf(FabElement);
    expect(fab.color).toBe('primary-container');
    expect(fab.size).toBe('default');
    expect(fab.label).toBe('');
    expect(fab.expanded).toBeTrue();
    expect(fab.scrollTarget).toBe('');
  });

  it('renders the label as the accessible name', async () => {
    const {button} = await setupTest(
      html`<md-gb-fab label="Compose"><span>edit</span></md-gb-fab>`,
    );
    const label = button.querySelector('.fab-label');
    expect(label?.textContent).toBe('Compose');
    expect(button.textContent?.trim()).toBe('Compose');
  });

  it('does not render a label without one', async () => {
    const {button} = await setupTest();
    expect(button.querySelector('.fab-label')).toBeNull();
  });

  it('delegates aria-label to the button', async () => {
    const {button} = await setupTest(
      html`<md-gb-fab aria-label="Add"></md-gb-fab>`,
    );
    expect(button.getAttribute('aria-label')).toBe('Add');
  });

  it('collapses with expanded="false" and keeps the label', async () => {
    const {fab, button} = await setupTest(
      html`<md-gb-fab label="Compose" expanded="false"></md-gb-fab>`,
    );
    expect(fab.expanded).toBeFalse();
    expect(button.classList).toContain(FAB_CLASSES.fabCollapsed);
    // The collapsed label still names the button.
    expect(button.querySelector('.fab-label')).not.toBeNull();

    fab.expanded = true;
    await env.waitForStability();
    expect(button.classList).not.toContain(FAB_CLASSES.fabCollapsed);
  });

  it('treats a bare expanded attribute as expanded', async () => {
    const {fab} = await setupTest(
      html`<md-gb-fab label="Compose" expanded></md-gb-fab>`,
    );
    expect(fab.expanded).toBeTrue();
  });

  it('applies the size and color classes', async () => {
    const {button} = await setupTest(
      html`<md-gb-fab size="lg" color="tertiary"></md-gb-fab>`,
    );
    expect(button.classList).toContain(FAB_CLASSES.fabLg);
    expect(button.classList).toContain(FAB_CLASSES.fabTertiary);
  });

  it('collapses on scroll down and expands on scroll up', async () => {
    const {root, fab} = await setupTest(html`
      <div id="list" style="block-size: 100px; inline-size: 100px; overflow: auto">
        <div style="block-size: 1000px"></div>
      </div>
      <md-gb-fab label="Compose" scroll-target="list"></md-gb-fab>
    `);
    const list = root.querySelector<HTMLElement>('#list')!;
    const scroll = async (top: number) => {
      list.scrollTop = top;
      list.dispatchEvent(new Event('scroll'));
      await env.waitForStability();
    };

    await scroll(100);
    expect(fab.expanded).withContext('scrolled down').toBeFalse();
    await scroll(50);
    expect(fab.expanded).withContext('scrolled up').toBeTrue();
    await scroll(200);
    expect(fab.expanded).withContext('scrolled down again').toBeFalse();
    await scroll(0);
    expect(fab.expanded).withContext('scrolled to top').toBeTrue();
  });

  it('stops listening when scroll-target is removed', async () => {
    const {root, fab} = await setupTest(html`
      <div id="list2" style="block-size: 100px; inline-size: 100px; overflow: auto">
        <div style="block-size: 1000px"></div>
      </div>
      <md-gb-fab label="Compose" scroll-target="list2"></md-gb-fab>
    `);
    fab.scrollTarget = '';
    await env.waitForStability();
    const list = root.querySelector<HTMLElement>('#list2')!;
    list.scrollTop = 300;
    list.dispatchEvent(new Event('scroll'));
    expect(fab.expanded).toBeTrue();
  });
});

describe('setupCollapseOnScroll()', () => {
  const env = new Environment();

  it('ignores scrolling less than the threshold', () => {
    const root = env.render(html`
      <div style="block-size: 100px; inline-size: 100px; overflow: auto">
        <div style="block-size: 1000px"></div>
      </div>
    `);
    const list = root.querySelector('div')!;
    const changes: boolean[] = [];
    const cleanup = new AbortController();
    setupCollapseOnScroll(list, (expanded) => changes.push(expanded), {
      signal: cleanup.signal,
      threshold: 20,
    });
    const scroll = (top: number) => {
      list.scrollTop = top;
      list.dispatchEvent(new Event('scroll'));
    };

    scroll(10);
    expect(changes).toEqual([]);
    scroll(40);
    expect(changes).toEqual([false]);
    scroll(30);
    expect(changes).toEqual([false]);
    scroll(10);
    expect(changes).toEqual([false, true]);

    cleanup.abort();
    scroll(300);
    expect(changes).toEqual([false, true]);
  });
});
