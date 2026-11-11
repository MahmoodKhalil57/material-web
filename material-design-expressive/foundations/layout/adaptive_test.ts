/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement, render} from 'lit';

import {
  AdaptiveController,
  resolveAdaptiveOptions,
  WINDOW_HEIGHT_CLASS_ATTRIBUTE,
  WINDOW_SIZE_CLASS_ATTRIBUTE,
  type AdaptiveControllerOptions,
} from './adaptive.js';
import {type WindowSizeClass} from './window-size-class.js';

interface Opts {
  actions: number;
  label: string;
}

describe('resolveAdaptiveOptions()', () => {
  const base: Opts = {actions: 1, label: 'base'};

  // spec: layout-breakpoints-642b07
  it('returns the base when nothing is declared', () => {
    expect(resolveAdaptiveOptions(base, undefined, 'expanded')).toEqual(base);
    expect(resolveAdaptiveOptions(base, {}, 'compact')).toEqual(base);
  });

  // spec: layout-breakpoints-642b07
  it('uses the options of the class, over the base', () => {
    const options = {compact: {actions: 2}, medium: {actions: 3}};
    expect(resolveAdaptiveOptions(base, options, 'compact')).toEqual({actions: 2, label: 'base'});
    expect(resolveAdaptiveOptions(base, options, 'medium')).toEqual({actions: 3, label: 'base'});
  });

  // spec: layout-breakpoints-642b07
  it('cascades upward from the nearest smaller class like min-width', () => {
    const options = {compact: {actions: 2}, expanded: {actions: 4}};
    const actions = (cls: WindowSizeClass) =>
      resolveAdaptiveOptions(base, options, cls).actions;
    expect(actions('compact')).toBe(2);
    expect(actions('medium')).toBe(2);
    expect(actions('expanded')).toBe(4);
    expect(actions('large')).toBe(4);
    expect(actions('extra-large')).toBe(4);
  });

  it('keeps the base for classes below the first declared class', () => {
    const options = {expanded: {actions: 4}};
    expect(resolveAdaptiveOptions(base, options, 'compact').actions).toBe(1);
    expect(resolveAdaptiveOptions(base, options, 'medium').actions).toBe(1);
    expect(resolveAdaptiveOptions(base, options, 'expanded').actions).toBe(4);
  });

  it('merges field by field and does not change its inputs', () => {
    const options = {compact: {label: 'small'}, expanded: {actions: 4}};
    const frozen = JSON.stringify([base, options]);
    expect(resolveAdaptiveOptions(base, options, 'large')).toEqual({actions: 4, label: 'small'});
    expect(JSON.stringify([base, options])).toBe(frozen);
  });
});

class TestAdaptive extends LitElement {
  config: AdaptiveControllerOptions<Opts> = {
    base: {actions: 1, label: 'base'},
    options: {compact: {actions: 2}, expanded: {actions: 4, label: 'wide'}},
  };
  adaptive!: AdaptiveController<Opts>;
  renders = 0;
  changes: Array<[string, string | null]> = [];

  override connectedCallback() {
    this.adaptive ??= new AdaptiveController<Opts>(this, {
      ...this.config,
      onChange: (cls, previous) => this.changes.push([cls, previous]),
    });
    super.connectedCallback();
  }

  protected override render() {
    this.renders++;
    return html`${this.adaptive.sizeClass}:${this.adaptive.options.actions}`;
  }
}
customElements.define('test-adaptive', TestAdaptive);

let container: HTMLElement | undefined;

async function frame() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

function freshContainer(width?: number) {
  container?.remove();
  container = document.createElement('div');
  if (width !== undefined) container.style.width = `${width}px`;
  document.body.append(container);
  return container;
}

async function mount(width: number) {
  const root = freshContainer();
  render(
    html`<test-adaptive
      style="display: block; width: ${width}px; height: 100px"></test-adaptive>`,
    root,
  );
  const el = root.querySelector<TestAdaptive>('test-adaptive')!;
  await el.updateComplete;
  return el;
}

async function resize(el: TestAdaptive, width: number) {
  el.style.width = `${width}px`;
  await frame();
  await el.updateComplete;
}

describe('AdaptiveController', () => {
  afterEach(() => container?.remove());

  // spec: layout-breakpoints-70b89b, layout-breakpoints-642b07
  it('measures the host and exposes each window size class', async () => {
    for (const [width, cls] of [
      [400, 'compact'],
      [599, 'compact'],
      [600, 'medium'],
      [839, 'medium'],
      [840, 'expanded'],
      [1199, 'expanded'],
      [1200, 'large'],
      [1599, 'large'],
      [1600, 'extra-large'],
    ] as const) {
      const el = await mount(width);
      expect(el.adaptive.sizeClass).withContext(`${width}px`).toBe(cls);
    }
  });

  // spec: layout-breakpoints-642b07
  it('reflects the classes on the host for CSS', async () => {
    const el = await mount(700);
    expect(el.getAttribute(WINDOW_SIZE_CLASS_ATTRIBUTE)).toBe('medium');
    expect(el.hasAttribute(WINDOW_HEIGHT_CLASS_ATTRIBUTE)).toBeTrue();
    expect(el.matches('[window-size-class="medium"]')).toBeTrue();
  });

  // spec: layout-breakpoints-642b07
  it('re-renders and updates the attribute when the class changes', async () => {
    const el = await mount(400);
    expect(el.shadowRoot!.textContent).toContain('compact:2');
    const before = el.renders;
    await resize(el, 900);
    expect(el.adaptive.sizeClass).toBe('expanded');
    expect(el.getAttribute(WINDOW_SIZE_CLASS_ATTRIBUTE)).toBe('expanded');
    expect(el.shadowRoot!.textContent).toContain('expanded:4');
    expect(el.renders).toBeGreaterThan(before);
    await resize(el, 400);
    expect(el.getAttribute(WINDOW_SIZE_CLASS_ATTRIBUTE)).toBe('compact');
    expect(el.shadowRoot!.textContent).toContain('compact:2');
  });

  it('does not re-render for a resize inside one class', async () => {
    const el = await mount(400);
    await frame();
    const before = el.renders;
    await resize(el, 500);
    await resize(el, 590);
    expect(el.renders).toBe(before);
  });

  // spec: layout-breakpoints-642b07
  it('resolves the options of the current class and of another class', async () => {
    const el = await mount(700);
    expect(el.adaptive.options).toEqual({actions: 2, label: 'base'});
    expect(el.adaptive.optionsFor('expanded')).toEqual({actions: 4, label: 'wide'});
    expect(el.adaptive.optionsFor('compact').actions).toBe(2);
    await resize(el, 1300);
    expect(el.adaptive.options).toEqual({actions: 4, label: 'wide'});
  });

  it('declare() replaces the per-class options and re-renders', async () => {
    const el = await mount(400);
    el.adaptive.declare({compact: {actions: 9}});
    await el.updateComplete;
    expect(el.adaptive.options.actions).toBe(9);
    expect(el.shadowRoot!.textContent).toContain('compact:9');
    el.adaptive.declare({}, {actions: 5, label: 'b'});
    expect(el.adaptive.options).toEqual({actions: 5, label: 'b'});
  });

  it('atLeast() compares width classes', async () => {
    const el = await mount(700);
    expect(el.adaptive.atLeast('compact')).toBeTrue();
    expect(el.adaptive.atLeast('medium')).toBeTrue();
    expect(el.adaptive.atLeast('expanded')).toBeFalse();
  });

  it('tracks the height class', async () => {
    const el = await mount(700);
    expect(el.adaptive.heightClass).toBe('compact');
    expect(el.adaptive.heightAtLeast('compact')).toBeTrue();
    expect(el.adaptive.heightAtLeast('medium')).toBeFalse();
  });

  it('calls onChange with the class and the previous one', async () => {
    const el = await mount(400);
    await resize(el, 900);
    expect(el.changes).toEqual([
      ['compact', null],
      ['expanded', 'compact'],
    ]);
  });

  it('set() feeds the class directly when nothing is measured', async () => {
    const root = freshContainer();
    const el = new TestAdaptive();
    el.config = {...el.config, target: () => null};
    root.append(el);
    await el.updateComplete;
    el.adaptive.set('large');
    await el.updateComplete;
    expect(el.adaptive.sizeClass).toBe('large');
    expect(el.getAttribute(WINDOW_SIZE_CLASS_ATTRIBUTE)).toBe('large');
  });

  it('measures another target, such as an ancestor', async () => {
    const root = freshContainer(900);
    const el = new TestAdaptive();
    el.config = {...el.config, target: () => root};
    root.append(el);
    await el.updateComplete;
    expect(el.adaptive.sizeClass).toBe('expanded');
  });

  it('removes the attributes when disconnected and can skip reflecting', async () => {
    const el = await mount(700);
    expect(el.hasAttribute(WINDOW_SIZE_CLASS_ATTRIBUTE)).toBeTrue();
    el.remove();
    expect(el.hasAttribute(WINDOW_SIZE_CLASS_ATTRIBUTE)).toBeFalse();
    expect(el.hasAttribute(WINDOW_HEIGHT_CLASS_ATTRIBUTE)).toBeFalse();

    const quiet = new TestAdaptive();
    quiet.config = {...quiet.config, reflect: false};
    container!.append(quiet);
    await quiet.updateComplete;
    expect(quiet.hasAttribute(WINDOW_SIZE_CLASS_ATTRIBUTE)).toBeFalse();
  });
});
