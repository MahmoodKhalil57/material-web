/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contract tests of the disclosure behavior
 * (`labs/gb/components/shared/disclosure.ts`): each component that expands
 * and collapses a region does it as its spec page says: the trigger carries
 * `aria-expanded` / `aria-controls`, the collapsed region is inert, Enter and
 * Space toggle it, a cancelable `toggle` event comes first, and the motion
 * goes through the motion tokens and stops under reduced motion. Plugged into
 * gen-contract-tests.mjs.
 *
 * `entries[dir]` is `{imports, cases}`; `imports` are side-effect modules,
 * relative to the component directory. Each case has:
 * - title: the test name.
 * - fixture: lit `html` source of the component under test.
 * - selector: CSS selector of the component inside the fixture.
 * - body: TS statements. In scope: `root`, `el` (the component), `part(sel)`
 *   (an element in the component's shadow root), `press(key)`, `settle()`,
 *   `reduceMotion(fn)` (runs `fn` with reduced motion on) and
 *   `finished(el)` (waits for its transitions).
 * - spec: unit IDs the case proves (cited in the generated test).
 */

export const entries = {
  list: {
    imports: ['./md-gb-list-item.js'],
    cases: [
      {
        title: 'links an expandable item to its nested items with aria-expanded and aria-controls',
        fixture:
          '<md-gb-list-item expandable>Folder<md-gb-list-item slot="nested">One</md-gb-list-item><md-gb-list-item slot="nested">Two</md-gb-list-item></md-gb-list-item>',
        selector: 'md-gb-list-item',
        spec: ['lists-ac25bc', 'lists-aa96e4'],
        body: `const trigger = part('#item');
    const region = part('#nested');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(region.id);
    expect(el.shadowRoot!.getElementById(trigger.getAttribute('aria-controls')!)).toBe(region);
    trigger.click();
    await settle();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');`,
      },
      {
        title: 'hides collapsed nested items from focus and assistive technology, and reveals them when expanded',
        fixture:
          '<md-gb-list-item expandable>Folder<md-gb-list-item slot="nested">One</md-gb-list-item><md-gb-list-item slot="nested">Two</md-gb-list-item></md-gb-list-item>',
        selector: 'md-gb-list-item',
        spec: ['lists-ac25bc', 'lists-aa96e4'],
        body: `const region = part('#nested');
    const [one, two] = el.querySelectorAll<HTMLElement>('md-gb-list-item');
    expect(region.inert).toBeTrue();
    part('#item').click();
    await settle();
    expect(el.expanded).toBeTrue();
    expect(region.inert).toBeFalse();
    expect(one.getClientRects().length).toBeGreaterThan(0);
    expect(two.getClientRects().length).toBeGreaterThan(0);
    part('#item').click();
    await settle();
    expect(el.expanded).toBeFalse();
    expect(region.inert).toBeTrue();`,
      },
      {
        title: 'expands and collapses with Enter and Space on the item',
        fixture:
          '<md-gb-list-item expandable>Folder<md-gb-list-item slot="nested">One</md-gb-list-item></md-gb-list-item>',
        selector: 'md-gb-list-item',
        spec: ['lists-ac25bc', 'lists-d24558'],
        body: `part('#item').focus();
    await press('Enter');
    expect(el.expanded).toBeTrue();
    await press('Space');
    expect(el.expanded).toBeFalse();`,
      },
      {
        title: 'fires a cancelable toggle event before it changes, and a cancelled one keeps the item as it is',
        fixture:
          '<md-gb-list-item expandable>Folder<md-gb-list-item slot="nested">One</md-gb-list-item></md-gb-list-item>',
        selector: 'md-gb-list-item',
        spec: [],
        body: `const states: string[] = [];
    let cancel = true;
    el.addEventListener('toggle', (event) => {
      const toggle = event as ToggleEvent;
      states.push(\`\${toggle.oldState}>\${toggle.newState}:\${el.expanded}\`);
      expect(toggle.cancelable).toBeTrue();
      if (cancel) toggle.preventDefault();
    });
    part('#item').click();
    await settle();
    expect(el.expanded).toBeFalse();
    expect(part('#item').getAttribute('aria-expanded')).toBe('false');
    cancel = false;
    part('#item').click();
    await settle();
    expect(el.expanded).toBeTrue();
    expect(states).toEqual(['closed>open:false', 'closed>open:false']);`,
      },
      {
        title: 'animates the nested region with the default spatial spring, and not at all under reduced motion',
        fixture:
          '<md-gb-list-item expandable>Folder<md-gb-list-item slot="nested">One</md-gb-list-item></md-gb-list-item>',
        selector: 'md-gb-list-item',
        spec: [],
        body: `const region = part('#nested');
    const durations = () => getComputedStyle(region).transitionDuration.split(',').map((d) => parseFloat(d));
    expect(Math.max(...durations())).toBeGreaterThan(0);
    expect(getComputedStyle(region).transitionProperty).toContain('grid-template-rows');
    await reduceMotion(async () => {
      const reduced = await discMount(el.outerHTML, 'md-gb-list-item');
      const reducedRegion = reduced.shadowRoot!.querySelector<HTMLElement>('#nested')!;
      const reducedDurations = getComputedStyle(reducedRegion).transitionDuration.split(',').map((d) => parseFloat(d));
      expect(Math.max(...reducedDurations)).toBe(0);
    });`,
      },
    ],
  },
  fab: {
    imports: ['./md-gb-fab.js'],
    cases: [
      {
        title: 'collapses to a FAB while its scroll container scrolls down and expands again when scrolling up',
        fixture:
          '<div id="scroller" style="height: 120px; overflow: auto"><div style="height: 1200px">Content</div></div><md-gb-fab label="Compose" scroll-target="scroller" aria-label="Compose"></md-gb-fab>',
        selector: 'md-gb-fab',
        spec: ['extended-fab-da3303', 'extended-fab-6598b6', 'extended-fab-b90208'],
        body: `const scroller = root.querySelector<HTMLElement>('#scroller')!;
    const scrollTo = async (top: number) => {
      scroller.scrollTop = top;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await settle();
    };
    expect(el.expanded).toBeTrue();
    await scrollTo(300);
    expect(el.expanded).toBeFalse();
    expect(part('.fab').classList.contains('fab-collapsed')).toBeTrue();
    await scrollTo(200);
    expect(el.expanded).toBeTrue();
    expect(part('.fab').classList.contains('fab-collapsed')).toBeFalse();`,
      },
      {
        title: 'fades the label out with the collapse and in again with the expansion',
        fixture: '<md-gb-fab label="Compose" aria-label="Compose"></md-gb-fab>',
        selector: 'md-gb-fab',
        spec: ['extended-fab-64136e'],
        body: `const label = part('.fab-label');
    expect(getComputedStyle(label).opacity).toBe('1');
    el.expanded = false;
    await settle();
    await finished(label);
    expect(getComputedStyle(label).opacity).toBe('0');
    el.expanded = true;
    await settle();
    await finished(label);
    expect(getComputedStyle(label).opacity).toBe('1');`,
      },
      {
        title: 'reads expanded="false" from markup, and expands again when the attribute is removed',
        fixture: '<md-gb-fab label="Compose" aria-label="Compose" expanded="false"></md-gb-fab>',
        selector: 'md-gb-fab',
        spec: ['extended-fab-6598b6'],
        body: `expect(el.expanded).toBeFalse();
    expect(part('.fab').classList.contains('fab-collapsed')).toBeTrue();
    el.removeAttribute('expanded');
    await settle();
    expect(el.expanded).toBeTrue();
    expect(part('.fab').classList.contains('fab-collapsed')).toBeFalse();`,
      },
      {
        title: 'fires a cancelable toggle event before a scroll collapses it, so an app can keep the label',
        fixture:
          '<div id="scroller" style="height: 120px; overflow: auto"><div style="height: 1200px">Content</div></div><md-gb-fab label="Compose" scroll-target="scroller" aria-label="Compose"></md-gb-fab>',
        selector: 'md-gb-fab',
        spec: [],
        body: `const scroller = root.querySelector<HTMLElement>('#scroller')!;
    const events: ToggleEvent[] = [];
    el.addEventListener('toggle', (event) => {
      events.push(event as ToggleEvent);
      event.preventDefault();
    });
    scroller.scrollTop = 300;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await settle();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].cancelable).toBeTrue();
    expect([events[0].oldState, events[0].newState]).toEqual(['open', 'closed']);
    expect(el.expanded).toBeTrue();`,
      },
      {
        title: 'moves the label with the fast spatial spring, and not at all under reduced motion',
        fixture: '<md-gb-fab label="Compose" aria-label="Compose"></md-gb-fab>',
        selector: 'md-gb-fab',
        spec: [],
        body: `const label = part('.fab-label');
    const durations = (e: Element) => getComputedStyle(e).transitionDuration.split(',').map((d) => parseFloat(d));
    expect(Math.max(...durations(label))).toBeGreaterThan(0);
    await reduceMotion(async () => {
      const reduced = await discMount(el.outerHTML, 'md-gb-fab');
      const reducedLabel = reduced.shadowRoot!.querySelector<HTMLElement>('.fab-label')!;
      expect(Math.max(...durations(reducedLabel))).toBe(0);
    });`,
      },
    ],
  },
  fabmenu: {
    imports: ['./md-gb-fab-menu.js', './md-gb-fab-menu-item.js'],
    cases: [
      {
        title: 'exposes the open state on the FAB with aria-expanded and aria-controls to the list',
        fixture:
          '<md-gb-fab-menu aria-label="Share"><md-gb-fab-menu-item>Copy</md-gb-fab-menu-item><md-gb-fab-menu-item>Mail</md-gb-fab-menu-item></md-gb-fab-menu>',
        selector: 'md-gb-fab-menu',
        spec: ['fab-menu-2a3498', 'fab-menu-0796df'],
        body: `const button = part('#button');
    const list = part('#list');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe(list.id);
    button.click();
    await settle();
    expect(el.open).toBeTrue();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    button.click();
    await settle();
    expect(button.getAttribute('aria-expanded')).toBe('false');`,
      },
      {
        title: 'keeps the closed list out of focus and assistive technology, and opens it from the FAB',
        fixture:
          '<md-gb-fab-menu aria-label="Share"><md-gb-fab-menu-item>Copy</md-gb-fab-menu-item><md-gb-fab-menu-item>Mail</md-gb-fab-menu-item></md-gb-fab-menu>',
        selector: 'md-gb-fab-menu',
        spec: ['fab-menu-021aef'],
        body: `const list = part('#list');
    expect(list.inert).toBeTrue();
    part('#button').click();
    await settle();
    expect(list.inert).toBeFalse();
    expect(el.items.length).toBe(2);
    part('#button').click();
    await settle();
    expect(list.inert).toBeTrue();`,
      },
      {
        title: 'toggles with Enter and Space on the FAB',
        fixture:
          '<md-gb-fab-menu aria-label="Share"><md-gb-fab-menu-item>Copy</md-gb-fab-menu-item></md-gb-fab-menu>',
        selector: 'md-gb-fab-menu',
        spec: ['fab-menu-021aef'],
        body: `part('#button').focus();
    await press('Enter');
    expect(el.open).toBeTrue();
    await press('Space');
    expect(el.open).toBeFalse();`,
      },
      {
        title: 'fires a cancelable toggle event before it changes, and a cancelled one keeps the menu as it is',
        fixture:
          '<md-gb-fab-menu aria-label="Share"><md-gb-fab-menu-item>Copy</md-gb-fab-menu-item></md-gb-fab-menu>',
        selector: 'md-gb-fab-menu',
        spec: [],
        body: `const events: ToggleEvent[] = [];
    let cancel = true;
    el.addEventListener('toggle', (event) => {
      events.push(event as ToggleEvent);
      if (cancel) event.preventDefault();
    });
    part('#button').click();
    await settle();
    expect(el.open).toBeFalse();
    expect(part('#list').inert).toBeTrue();
    expect(part('#button').getAttribute('aria-expanded')).toBe('false');
    cancel = false;
    part('#button').click();
    await settle();
    expect(el.open).toBeTrue();
    expect(events.every((event) => event.cancelable)).toBeTrue();
    expect(events.map((event) => event.newState)).toEqual(['open', 'open']);`,
      },
      {
        title: 'morphs the FAB into the close button with the fast spatial spring, and not at all under reduced motion',
        fixture:
          '<md-gb-fab-menu aria-label="Share"><md-gb-fab-menu-item>Copy</md-gb-fab-menu-item></md-gb-fab-menu>',
        selector: 'md-gb-fab-menu',
        spec: [],
        body: `// The morph is the width, height and shape (the ripple has its own timing).
    const durations = (e: Element) => {
      const style = getComputedStyle(e);
      const props = style.transitionProperty.split(',').map((p) => p.trim());
      const times = style.transitionDuration.split(',').map((d) => parseFloat(d));
      return props.flatMap((p, i) => (['width', 'height', 'border-radius'].includes(p) ? [times[i % times.length]] : []));
    };
    expect(Math.max(...durations(part('#button')))).toBeGreaterThan(0);
    await reduceMotion(async () => {
      const reduced = await discMount(el.outerHTML, 'md-gb-fab-menu');
      const button = reduced.shadowRoot!.querySelector<HTMLElement>('#button')!;
      expect(Math.max(...durations(button))).toBe(0);
    });`,
      },
    ],
  },
  toolbar: {
    imports: ['./md-gb-toolbar.js', '../fab/md-gb-fab.js', '../iconbutton/md-gb-icon-button.js'],
    cases: [
      {
        title: 'collapses a floating toolbar with a FAB into the FAB: its items are inert, the FAB stays',
        fixture:
          '<md-gb-toolbar><md-gb-icon-button aria-label="Undo"></md-gb-icon-button><md-gb-fab slot="fab" aria-label="Add"></md-gb-fab></md-gb-toolbar>',
        selector: 'md-gb-toolbar',
        spec: ['toolbars-2cfee0', 'toolbars-d967c9'],
        body: `const fab = el.querySelector<HTMLElement>('md-gb-fab')!;
    expect(part('.toolbar').inert).toBeFalse();
    el.expanded = false;
    await settle();
    expect(part('.toolbar').inert).toBeTrue();
    expect(fab.inert).toBeFalse();
    el.expanded = true;
    await settle();
    expect(part('.toolbar').inert).toBeFalse();`,
      },
      {
        title: 'reads expanded="false" from markup and reflects the state',
        fixture:
          '<md-gb-toolbar expanded="false"><md-gb-icon-button aria-label="Undo"></md-gb-icon-button><md-gb-fab slot="fab" aria-label="Add"></md-gb-fab></md-gb-toolbar>',
        selector: 'md-gb-toolbar',
        spec: ['toolbars-2cfee0'],
        body: `expect(el.expanded).toBeFalse();
    expect(part('.toolbar').inert).toBeTrue();
    el.expanded = true;
    await settle();
    expect(el.hasAttribute('expanded')).toBeTrue();`,
      },
      {
        title: 'never collapses a toolbar without a FAB, nor a docked one',
        fixture: '<md-gb-toolbar expanded="false"><md-gb-icon-button aria-label="Undo"></md-gb-icon-button></md-gb-toolbar>',
        selector: 'md-gb-toolbar',
        spec: [],
        body: `expect(part('.toolbar').inert).toBeFalse();
    const docked = await discMount('<md-gb-toolbar docked expanded="false"><md-gb-icon-button aria-label="Undo"></md-gb-icon-button><md-gb-fab slot="fab" aria-label="Add"></md-gb-fab></md-gb-toolbar>', 'md-gb-toolbar');
    expect(docked.shadowRoot!.querySelector<HTMLElement>('.toolbar')!.inert).toBeFalse();`,
      },
      {
        title: 'moves with the fast spatial spring, and not at all under reduced motion',
        fixture:
          '<md-gb-toolbar><md-gb-icon-button aria-label="Undo"></md-gb-icon-button><md-gb-fab slot="fab" aria-label="Add"></md-gb-fab></md-gb-toolbar>',
        selector: 'md-gb-toolbar',
        spec: [],
        body: `const durations = (e: Element) => getComputedStyle(e).transitionDuration.split(',').map((d) => parseFloat(d));
    expect(Math.max(...durations(part('.toolbar')))).toBeGreaterThan(0);
    await reduceMotion(async () => {
      const reduced = await discMount(el.outerHTML, 'md-gb-toolbar');
      expect(Math.max(...durations(reduced.shadowRoot!.querySelector<HTMLElement>('.toolbar')!))).toBe(0);
    });`,
      },
    ],
  },
};

const SETUP = `let discTokens = false;

/** Adopts the M3 tokens (once) so motion tokens and component styles resolve. */
async function discLoadTokens() {
  if (discTokens) return;
  discTokens = true;
  const [{adoptStyles}, {styles}] = await Promise.all([
    import('../../styles/adopt-styles.js'),
    import('../../styles/m3.cssresult.js'),
  ]);
  adoptStyles(document, [styles]);
}

/** Mounts markup next to the current fixture and waits for it to render. */
async function discMount(markup: string, selector: string) {
  await discLoadTokens();
  const host = document.createElement('div');
  host.innerHTML = markup;
  document.body.appendChild(host);
  await settle();
  const el = host.querySelector<HTMLElement>(selector)!;
  discExtra.push(host);
  return el;
}
const discExtra: HTMLElement[] = [];

async function discSetup(template: TemplateResult, selector: string) {
  await discLoadTokens();
  const root = await mount(template);

  const el = root.querySelector<HTMLElement>(selector)! as HTMLElement & {expanded: boolean; open: boolean; revealed: string | null; items: HTMLElement[]; paneWidth: number | null; collapsedPane: string | null};
  return {root, el};
}

/** Runs \`fn\` with reduced motion preferred, then restores the preference. */
async function discReduceMotion(fn: () => Promise<void>) {
  const {emulateMedia} = await import('@web/test-runner-commands');
  await emulateMedia({reducedMotion: 'reduce'});
  try {
    await fn();
  } finally {
    await emulateMedia({reducedMotion: 'no-preference'});
  }
}

/** Finishes the transitions running on an element (no real waiting). */
async function discFinished(el: Element) {
  el.getAnimations().forEach((animation) => animation.finish());
}

/** Presses a key on a real keyboard. */
async function discPress(key: string) {
  const {sendKeys} = await import('@web/test-runner-commands');
  await sendKeys({press: key});
  await settle();
}`;

/** TS source of a lit \`html\` template for a fixture string. */
function template(fixture) {
  return `html\`${fixture}\``;
}

export function tests(dir, c) {
  const cases = c.cases.map((k) => {
    const cite = k.spec?.length ? `    // spec: ${k.spec.join(', ')}\n` : '';
    return `  it(${JSON.stringify(k.title)}, async () => {
${cite}    const {root, el} = await discSetup(${template(k.fixture)}, '${k.selector}');
    const part = (selector: string) => el.shadowRoot!.querySelector<HTMLElement>(selector)!;
    const press = discPress;
    const reduceMotion = discReduceMotion;
    const finished = discFinished;
    void [root, part, press, reduceMotion, finished];
    ${k.body}
  });`;
  });
  const tag = c.cases[0].selector;
  return {
    imports: c.imports,
    setup: SETUP,
    describe: `describe('<${tag}> disclosure contract (DisclosureController: aria-expanded / aria-controls, inert, cancelable toggle, motion tokens)', () => {
  afterEach(() => {
    container?.remove();
    for (const extra of discExtra.splice(0)) extra.remove();
  });

${cases.join('\n\n')}
});`,
  };
}
