/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contract tests for adaptive components
 * (`components/shared/adaptive.ts`, `AdaptiveController`): the
 * component tracks the window size class of its width, exposes it as the
 * `window-size-class` attribute, and applies its per-class options.
 *
 * Entry:
 * - tag / imports: the element and its side-effect modules.
 * - actions: `{slot, limits: [[width, shown], ...]}` for a component that
 *   collapses trailing actions: `shown` actions are visible at `width`
 *   (a container width in px).
 * - fillsWidth: whether the element fills the width of its container.
 * - spec: unit IDs per check (`classes`, `fill`, `collapse`, `restore`,
 *   `event`).
 */
export const entries = {
  appbar: {
    tag: 'md-gb-app-bar',
    imports: ['./md-gb-app-bar.js'],
    fillsWidth: true,
    actions: {
      count: 4,
      limits: [
        [400, 2],
        [700, 2],
        [900, 4],
        [1300, 4],
      ],
    },
    spec: {
      classes: ['app-bars-2a067a'],
      fill: ['app-bars-2a067a', 'app-bars-e8f0a0', 'app-bars-eaad97', 'app-bars-f835ee'],
      collapse: ['app-bars-5df259', 'app-bars-0bd52a'],
      restore: ['app-bars-55598c', 'app-bars-26844e', 'app-bars-08238f'],
      event: ['app-bars-0bd52a'],
    },
  },
};

const cite = (c, key) => (c.spec[key]?.length ? `    // spec: ${c.spec[key].join(', ')}\n` : '');

export function tests(dir, c) {
  const {tag, actions} = c;
  const setup = `async function setupAdaptive(width: number, count = ${actions.count}) {
  const root = await mount(html\`
    <div id="frame" style=\${'width: ' + width + 'px'}>
      <${tag}>
        Title
        \${Array.from({length: count}, (_, i) => html\`<button slot="trailing" aria-label=\${'Action ' + i}>\${i}</button>\`)}
        <button slot="overflow" aria-label="More">More</button>
      </${tag}>
    </div>
  \`);
  const el = root.querySelector<any>('${tag}')!;
  await frames();
  return {el, frame: root.querySelector<HTMLElement>('#frame')!};
}

async function resizeAdaptive(f: {frame: HTMLElement; el: any}, width: number) {
  f.frame.style.width = width + 'px';
  await frames();
}

async function frames() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await settle();
}

const WINDOW_CLASSES: Array<[number, string]> = [[400, 'compact'], [700, 'medium'], [900, 'expanded'], [1300, 'large'], [1700, 'extra-large']];

function visibleActions(el: HTMLElement) {
  return [...el.querySelectorAll<HTMLElement>('[slot="trailing"]')].filter((a) => !a.hidden);
}

function overflowShown(el: HTMLElement) {
  const slot = el.shadowRoot!.querySelector<HTMLElement>('slot[name="overflow"]')!;
  return getComputedStyle(slot).display !== 'none';
}`;

  const cases = [];
  cases.push(`  it('tracks the window size class of its width', async () => {
${cite(c, 'classes')}    for (const [width, cls] of WINDOW_CLASSES) {
      const f = await setupAdaptive(width);
      expect(f.el.getAttribute('window-size-class')).withContext(width + 'px').toBe(cls);
    }
  });

  it('follows the class when the width changes', async () => {
${cite(c, 'classes')}    const f = await setupAdaptive(400);
    expect(f.el.getAttribute('window-size-class')).toBe('compact');
    await resizeAdaptive(f, 900);
    expect(f.el.getAttribute('window-size-class')).toBe('expanded');
    await resizeAdaptive(f, 700);
    expect(f.el.getAttribute('window-size-class')).toBe('medium');
  });`);
  if (c.fillsWidth) {
    cases.push(`  it('fills the width of its container at every size', async () => {
${cite(c, 'fill')}    for (const [width] of WINDOW_CLASSES) {
      const f = await setupAdaptive(width);
      expect(f.el.getBoundingClientRect().width).withContext(width + 'px').toBe(width);
    }
  });`);
  }
  cases.push(`  it('collapses trailing actions beyond the limit of a small window', async () => {
${cite(c, 'collapse')}    const f = await setupAdaptive(${actions.limits[0][0]});
    expect(visibleActions(f.el).length).toBe(${actions.limits[0][1]});
    expect(f.el.hasAttribute('overflowing')).toBeTrue();
    expect(overflowShown(f.el)).toBeTrue();
    for (const action of ([...f.el.querySelectorAll('[slot="trailing"]')] as HTMLElement[]).slice(${actions.limits[0][1]})) {
      expect(getComputedStyle(action).display).toBe('none');
    }
  });

  it('shows the actions again at larger sizes and hides the overflow slot', async () => {
${cite(c, 'restore')}    const f = await setupAdaptive(400);
    expect(visibleActions(f.el).length).toBe(2);
    await resizeAdaptive(f, 900);
    expect(visibleActions(f.el).length).toBe(4);
    expect(f.el.hasAttribute('overflowing')).toBeFalse();
    expect(overflowShown(f.el)).toBeFalse();
    await resizeAdaptive(f, 400);
    expect(visibleActions(f.el).length).toBe(2);
    expect(overflowShown(f.el)).toBeTrue();
  });

  it('shows every action when they fit the limit', async () => {
${cite(c, 'restore')}    const f = await setupAdaptive(400, 2);
    expect(visibleActions(f.el).length).toBe(2);
    expect(f.el.hasAttribute('overflowing')).toBeFalse();
    expect(overflowShown(f.el)).toBeFalse();
  });

  it('does not unhide actions the app hid itself', async () => {
${cite(c, 'restore')}    const f = await setupAdaptive(900);
    const mine = f.el.querySelector('[slot="trailing"]') as HTMLElement;
    mine.hidden = true;
    await resizeAdaptive(f, 400);
    await resizeAdaptive(f, 900);
    expect(mine.hidden).toBeTrue();
  });

  it('fires overflowchange with the collapsed actions, once per change', async () => {
${cite(c, 'event')}    const f = await setupAdaptive(900);
    const events: Element[][] = [];
    f.el.addEventListener('overflowchange', (e: CustomEvent) => events.push(e.detail.overflowed));
    await resizeAdaptive(f, 400);
    expect(events.length).toBe(1);
    expect(events[0].map((a) => a.getAttribute('aria-label'))).toEqual(['Action 2', 'Action 3']);
    await resizeAdaptive(f, 500);
    expect(events.length).toBe(1);
    await resizeAdaptive(f, 900);
    expect(events.length).toBe(2);
    expect(events[1]).toEqual([]);
  });`);

  return {
    tag,
    imports: c.imports,
    setup,
    describe: `describe('<${tag}> adaptive contract (AdaptiveController)', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`,
  };
}
