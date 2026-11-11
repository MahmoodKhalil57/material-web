/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contract tests of the AnnouncerController
 * (`foundations/accessibility/announcer.ts`): each component announces what
 * the accessibility section of its spec page says, in a live region of the
 * right politeness, without moving focus, and cleans the region up when it
 * disconnects. Plugged into gen-contract-tests.mjs.
 *
 * `entries[dir]` is `{imports, cases}`; `imports` are side-effect modules,
 * relative to the component directory. Each case has:
 * - kind: `announce` (default), `text` or `custom`.
 * - title: the test name.
 * - fixture: lit `html` source of the component under test.
 * - selector: CSS selector of the component inside the fixture.
 * - spec: unit IDs the case proves (cited in the generated test).
 *
 * `announce` cases (the component says something in a live region):
 * - act: TS statements that trigger the announcement (`root`, `el`, `before`,
 *   `press`, `settle` are in scope; may `await`).
 * - text: the announced text.
 * - politeness: `polite` (default) or `assertive`.
 * - focusKept: whether focus must stay on the control it was on. Default true.
 * - disconnect: also generate a test that the regions are removed when the
 *   component disconnects (once per component, from the first case).
 *
 * `text` cases (the accessible text a screen reader reads, no live region):
 * - expr: TS expression (`el`) of the text, and `expected`.
 *
 * `custom` cases: `body`, TS statements (`root`, `el`).
 */

export const entries = {
  snackbar: {
    imports: ['./md-gb-snackbar.js'],
    cases: [
      {
        title: 'announces its message and action politely when it opens, without moving focus',
        fixture:
          '<md-gb-snackbar label-text="Message sent" action-label="Undo" quick></md-gb-snackbar>',
        selector: 'md-gb-snackbar',
        act: 'await el.show();',
        text: 'Message sent. Undo',
        politeness: 'polite',
        focusKept: true,
        disconnect: true,
        spec: [
          'snackbar-605bba',
          'snackbar-953add',
          'snackbar-8be74d',
          'snackbar-a9e7a9',
          'snackbar-4e0ffd',
        ],
      },
      {
        title: 'empties its live region when it closes',
        kind: 'custom',
        fixture:
          '<md-gb-snackbar label-text="Message sent" quick></md-gb-snackbar>',
        selector: 'md-gb-snackbar',
        spec: ['snackbar-953add'],
        body: `await el.show();
    expect(await annText(el, 'polite', 'Message sent')).toBe('Message sent');
    await el.close();
    expect(await annText(el, 'polite', '')).toBe('');`,
      },
    ],
  },
  datepicker: {
    imports: ['./md-gb-date-picker.js'],
    cases: [
      {
        title: 'announces the new month politely when PageDown changes it',
        fixture:
          '<md-gb-date-picker inline quick locale="en-US" value="2025-08-17"></md-gb-date-picker>',
        selector: 'md-gb-date-picker',
        act: `const cell = el.shadowRoot.querySelector('[data-date="2025-08-17"]') as HTMLElement;
  cell.focus();
  await press('PageDown');`,
        text: 'September 2025',
        politeness: 'polite',
        focusKept: false,
        disconnect: true,
        spec: ['date-pickers-bebbe9', 'date-pickers-a7daa0'],
      },
      {
        title: 'announces the new month when Shift+PageUp changes the year',
        fixture:
          '<md-gb-date-picker inline quick locale="en-US" value="2025-08-17"></md-gb-date-picker>',
        selector: 'md-gb-date-picker',
        act: `const cell = el.shadowRoot.querySelector('[data-date="2025-08-17"]') as HTMLElement;
  cell.focus();
  await press('Shift+PageUp');`,
        text: 'August 2024',
        politeness: 'polite',
        focusKept: false,
        spec: ['date-pickers-44900d'],
      },
    ],
  },
  timepicker: {
    imports: ['./md-gb-time-picker.js'],
    cases: [
      {
        title: 'announces the minutes politely when Enter moves the selection on, without moving focus off the dial',
        fixture:
          '<md-gb-time-picker value="14:30" hour-cycle="12" quick></md-gb-time-picker>',
        selector: 'md-gb-time-picker',
        act: `const dial = el.shadowRoot.querySelector('.time-picker-dial') as HTMLElement;
  dial.focus();
  await press('Enter');`,
        text: 'Select minutes',
        politeness: 'polite',
        focusKept: false,
        disconnect: true,
        spec: ['time-pickers-4d5943', 'time-pickers-22d7af'],
      },
    ],
  },
  pulltorefresh: {
    imports: ['./md-gb-pull-to-refresh.js'],
    cases: [
      {
        title: 'announces "Refreshing" politely when a refresh starts, and clears it when it ends',
        fixture:
          '<md-gb-pull-to-refresh style="block-size: 300px"><div style="block-size: 600px">Content</div></md-gb-pull-to-refresh>',
        selector: 'md-gb-pull-to-refresh',
        act: 'el.refresh();',
        text: 'Refreshing',
        politeness: 'polite',
        focusKept: true,
        disconnect: true,
        after: `el.refreshing = false;
  await settle();
  expect(await annText(el, 'polite', '')).toBe('');`,
        spec: ['loading-indicator-4621ff', 'progress-indicators-511521'],
      },
    ],
  },
  textfield: {
    imports: ['./md-gb-text-field.js'],
    cases: [
      {
        title: 'gives its error message the alert role',
        kind: 'custom',
        fixture:
          '<md-gb-text-field label="ZIP code" error error-text="Not a valid ZIP code"></md-gb-text-field>',
        selector: 'md-gb-text-field',
        spec: ['text-fields-fe438b', 'text-fields-7bc15d'],
        body: `const message = el.shadowRoot.querySelector('#supporting-text') as HTMLElement;
    expect(message.textContent).toBe('Not a valid ZIP code');
    expect(message.getAttribute('role')).toBe('alert');`,
      },
      {
        title: 'announces an unchanged error message again, assertively, when it is reported again',
        fixture: '<md-gb-text-field label="Email" required></md-gb-text-field>',
        selector: 'md-gb-text-field',
        act: `el.reportValidity();
  await settle();
  el.reportValidity();`,
        text: '${el.validationMessage}',
        textIsExpression: true,
        politeness: 'assertive',
        focusKept: false,
        disconnect: true,
        spec: ['text-fields-fe438b', 'text-fields-7bc15d'],
      },
    ],
  },
  badge: {
    imports: ['./md-gb-badge.js'],
    cases: [
      {
        title: 'reads a counting badge as its number',
        kind: 'text',
        fixture: '<md-gb-badge value="5"></md-gb-badge>',
        selector: 'md-gb-badge',
        expr: `el.shadowRoot.querySelector('[part="badge"]').textContent.trim()`,
        expected: '5',
        spec: ['badges-f128b3', 'badges-26ba4d'],
      },
      {
        title: 'reads a non-counting badge as "New notification"',
        kind: 'text',
        fixture: '<md-gb-badge></md-gb-badge>',
        selector: 'md-gb-badge',
        expr: `el.shadowRoot.querySelector('[part="badge"]').textContent.trim()`,
        expected: 'New notification',
        spec: ['badges-f128b3', 'badges-06fd34', 'badges-295eac'],
      },
    ],
  },
  carousel: {
    imports: ['./md-gb-carousel.js', './md-gb-carousel-item.js'],
    cases: [
      {
        title: 'is a list of labelled items, so assistive technology reads the item in focus and the total',
        kind: 'custom',
        fixture: `<md-gb-carousel aria-label="Destinations" style="inline-size: 360px; --item-width: 186px; --height: 200px">
        <md-gb-carousel-item label="Item 1"><span slot="label">One</span></md-gb-carousel-item>
        <md-gb-carousel-item label="Item 2"><span slot="label">Two</span></md-gb-carousel-item>
        <md-gb-carousel-item label="Item 3"><span slot="label">Three</span></md-gb-carousel-item>
      </md-gb-carousel>`,
        selector: 'md-gb-carousel',
        spec: ['carousel-2fcc15', 'carousel-e273a7'],
        body: `const scroller = el.shadowRoot.querySelector('[part="scroller"]') as HTMLElement;
    expect(scroller.getAttribute('role')).toBe('list');
    const items = [...el.querySelectorAll('md-gb-carousel-item')] as HTMLElement[];
    expect(items.length).toBe(3);
    for (const [i, item] of items.entries()) {
      expect((item as any).internals.role).toBe('listitem');
      const action = item.shadowRoot!.querySelector('.carousel-item-action')!;
      expect(action.getAttribute('aria-label')).toBe('Item ' + (i + 1));
    }`,
      },
    ],
  },
};

const quote = (s) => JSON.stringify(s).replace(/^"|"$/g, "'").replace(/\\"/g, '"');

function caseTest(c) {
  const cite = c.spec?.length ? `    // spec: ${c.spec.join(', ')}\n` : '';
  const open = `    const root = await mount(html\`
      <button id="before">Before</button>
      ${c.fixture}
    \`);
    const el = root.querySelector<any>('${c.selector}')!;
    const before = root.querySelector<HTMLElement>('#before')!;
    before.focus();
    await settle();`;
  if (c.kind === 'text') {
    return `  it(${quote(c.title)}, async () => {
${cite}${open}
    expect(${c.expr}).toBe(${quote(c.expected)});
  });`;
  }
  if (c.kind === 'custom') {
    return `  it(${quote(c.title)}, async () => {
${cite}${open}
    ${c.body}
  });`;
  }
  const politeness = c.politeness ?? 'polite';
  const role = politeness === 'assertive' ? 'alert' : 'status';
  const text = c.textIsExpression ? c.text.replace(/^\$\{|\}$/g, '') : quote(c.text);
  return `  it(${quote(c.title)}, async () => {
${cite}${open}
    ${c.act.replace(/\n/g, '\n  ')}
    const expected = ${text};
    expect(expected).not.toBe('');
    expect(await annText(el, '${politeness}', expected)).toBe(expected);
    const region = annRegion(el, '${politeness}')!;
    expect(region.getAttribute('role')).toBe('${role}');
    expect(region.getAttribute('aria-live')).toBe('${politeness}');
    expect(region.getAttribute('aria-atomic')).toBe('true');${
      c.focusKept === false ? '' : '\n    expect(document.activeElement).toBe(before);'
    }${c.after ? `\n    ${c.after.replace(/\n/g, '\n  ')}` : ''}
  });`;
}

export function tests(dir, config) {
  const cases = config.cases.map(caseTest);
  const first = config.cases.find((c) => c.disconnect);
  if (first) {
    cases.push(`  it('removes its live regions when it disconnects', async () => {
    const root = await mount(html\`${first.fixture}\`);
    const el = root.querySelector<any>('${first.selector}')!;
    ${first.act.replace(/\n/g, '\n  ')}
    await annText(el, '${first.politeness ?? 'polite'}', ${first.textIsExpression ? first.text.replace(/^\$\{|\}$/g, '') : quote(first.text)});
    expect(el.shadowRoot.querySelector('[data-announcer]')).not.toBeNull();
    el.remove();
    await settle();
    expect(el.shadowRoot.querySelector('[data-announcer]')).toBeNull();
  });`);
  }
  const tag = config.cases[0].selector;
  const live = config.cases.some((c) => !c.kind || c.kind === 'announce') || config.cases.some((c) => c.body?.includes('annText'));
  return {
    imports: config.imports,
    setup: !live ? '// Announcer contract: no live region to read in this component.' : `/** The live region of \`politeness\` in the shadow root of \`el\`. */
function annRegion(el: HTMLElement, politeness: 'polite' | 'assertive') {
  return el.shadowRoot!.querySelector<HTMLElement>(\`[data-announcer="\${politeness}"]\`);
}

/** Waits (at most a second) until the live region holds \`expected\`, and returns its text. */
async function annText(el: HTMLElement, politeness: 'polite' | 'assertive', expected: string) {
  const text = () => annRegion(el, politeness)?.textContent?.trim() ?? '';
  // Checks once per frame (the shared until() helper, inlined).
  const end = performance.now() + 1000;
  while (text() !== expected && performance.now() < end) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return text();
}`,
    describe: `describe('<${tag}> announcer contract (AnnouncerController)', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`,
  };
}
