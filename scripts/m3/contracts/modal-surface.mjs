/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contract tests for the shared ModalSurfaceController
 * (`labs/gb/components/shared/modal-surface.ts`): each modal surface closes
 * on Escape, back and the scrim, moves focus in and restores it, keeps Tab
 * inside, fires its events with reasons, and locks page scrolling only while
 * modal. See `MODULES` in `scripts/m3/gen-contract-tests.mjs`.
 *
 * Per component directory, `surfaces` lists the elements to check:
 * - id: identifier used in helper names (`setupModal<Id>`).
 * - label: shown in the describe title.
 * - tag: the element's tag name.
 * - imports: side-effect modules, relative to the component directory.
 * - modal / standard: markup of the modal and the non-modal variant (null
 *   when the element has no standard variant). Both hold at least two
 *   focusable controls, and are closed.
 * - mode: `lifecycle` (open / opened / close / closed events; `open`
 *   property, `show()`) or `toggle` (the host owns `expanded`; the `toggle`
 *   event's `detail.reason` says why it collapsed).
 * - dialog: whether the element renders a native `<dialog>`.
 * - scrim: `dialog` (click the shadow `<dialog>` itself), a selector inside
 *   the shadow root, or null when the element has no scrim click.
 * - closeCall: expression that closes `el` with the reason `custom`.
 * - spec: unit or section IDs per check (cited in the generated test).
 *   Keys: events, escape, escapeStandard, scrim, back, focusIn, focusRestore,
 *   trap, lock, lockStandard.
 */

const BUTTONS = '<button id="one">One</button><button id="two">Two</button>';
const DRAWER_ITEMS =
  '<md-gb-nav-drawer-item>Inbox</md-gb-nav-drawer-item><md-gb-nav-drawer-item>Outbox</md-gb-nav-drawer-item>';
const RAIL_ITEMS =
  '<md-gb-nav-rail-item label="Home"></md-gb-nav-rail-item><md-gb-nav-rail-item label="Search"></md-gb-nav-rail-item>';

export const entries = {
  dialog: {
    surfaces: [
      {
        id: 'Dialog',
        label: 'dialog',
        tag: 'md-gb-dialog',
        imports: ['./md-gb-dialog.js'],
        modal: `<md-gb-dialog quick><div slot="headline">Title</div>${BUTTONS}</md-gb-dialog>`,
        standard: null,
        mode: 'lifecycle',
        dialog: true,
        scrim: 'dialog',
        closeCall: "el.close('', 'custom')",
        spec: {
          events: ['dialogs-407431'],
          escape: ['dialogs-4f2409', 'dialogs-5653c5'],
          scrim: ['dialogs-34082e', 'dialogs-252e03'],
          back: ['dialogs-5653c5'],
          focusIn: ['dialogs-3e7f5f', 'dialogs-e430df'],
          focusRestore: ['dialogs-407431'],
          trap: ['dialogs-8a70b0', 'dialogs-588469', 'dialogs-37b901', 'dialogs-534693'],
          lock: ['dialogs-042920'],
        },
      },
    ],
  },
  sheet: {
    surfaces: [
      {
        id: 'BottomSheet',
        label: 'bottom sheet',
        tag: 'md-gb-bottom-sheet',
        imports: ['./md-gb-bottom-sheet.js'],
        modal: `<md-gb-bottom-sheet modal quick label="Share">${BUTTONS}</md-gb-bottom-sheet>`,
        standard: `<md-gb-bottom-sheet quick label="Player">${BUTTONS}</md-gb-bottom-sheet>`,
        mode: 'lifecycle',
        dialog: true,
        scrim: 'dialog',
        closeCall: "el.close('custom')",
        spec: {
          events: ['bottom-sheets-122e09', 'bottom-sheets-10e5ce'],
          escape: ['bottom-sheets-981b60'],
          escapeStandard: ['bottom-sheets-38347a'],
          scrim: ['bottom-sheets-271d76', 'bottom-sheets-5b84e7', 'bottom-sheets-dfd4af'],
          back: ['bottom-sheets-981b60'],
          focusIn: ['bottom-sheets-122e09'],
          focusRestore: ['bottom-sheets-122e09'],
          trap: ['bottom-sheets-122e09'],
          lock: ['bottom-sheets-122e09'],
          lockStandard: ['bottom-sheets-38347a'],
        },
      },
      {
        id: 'SideSheet',
        label: 'side sheet',
        tag: 'md-gb-side-sheet',
        imports: ['./md-gb-side-sheet.js'],
        modal: `<md-gb-side-sheet modal quick headline="Filters">${BUTTONS}</md-gb-side-sheet>`,
        standard: `<md-gb-side-sheet quick headline="Details">${BUTTONS}</md-gb-side-sheet>`,
        mode: 'lifecycle',
        dialog: true,
        scrim: 'dialog',
        closeCall: "el.close('custom')",
        spec: {
          events: ['side-sheets-fee745'],
          escape: ['side-sheets-5f01cc'],
          escapeStandard: ['side-sheets-7bf055'],
          scrim: ['side-sheets-05facd', 'side-sheets-fee745'],
          back: ['side-sheets-b4c4e6'],
          focusIn: ['side-sheets-fee745'],
          focusRestore: ['side-sheets-fee745'],
          trap: ['side-sheets-fee745'],
          lock: ['side-sheets-fee745'],
          lockStandard: ['side-sheets-7bf055'],
        },
      },
    ],
  },
  navdrawer: {
    surfaces: [
      {
        id: 'NavDrawer',
        label: 'navigation drawer',
        tag: 'md-gb-nav-drawer',
        imports: ['./md-gb-nav-drawer.js', './md-gb-nav-drawer-item.js'],
        modal: `<md-gb-nav-drawer modal quick aria-label="Mail">${DRAWER_ITEMS}</md-gb-nav-drawer>`,
        standard: `<md-gb-nav-drawer quick aria-label="Mail">${DRAWER_ITEMS}</md-gb-nav-drawer>`,
        mode: 'lifecycle',
        dialog: true,
        scrim: '.nav-drawer-scrim',
        closeCall: "el.close('custom')",
        spec: {
          events: ['navigation-drawer-cd9ced', 'navigation-drawer-4d53ac'],
          escape: ['navigation-drawer-4d53ac'],
          escapeStandard: ['navigation-drawer-93d0c9'],
          scrim: ['navigation-drawer-a212f9', 'navigation-drawer-170c39', 'navigation-drawer-f3dc79', 'navigation-drawer-6f03bd', 'navigation-drawer-200999'],
          back: ['navigation-drawer-4d53ac'],
          focusIn: ['navigation-drawer-054d25', 'navigation-drawer-b59187'],
          focusRestore: ['navigation-drawer-cd9ced'],
          trap: ['navigation-drawer-a48897'],
          lock: ['navigation-drawer-fb5d0f', 'navigation-drawer-b98bba'],
          lockStandard: ['navigation-drawer-93d0c9'],
        },
      },
    ],
  },
  navrail: {
    surfaces: [
      {
        id: 'NavRail',
        label: 'modal navigation rail',
        tag: 'md-gb-nav-rail',
        imports: ['./md-gb-nav-rail.js', './md-gb-nav-rail-item.js'],
        modal: `<md-gb-nav-rail modal collapsible>${RAIL_ITEMS}</md-gb-nav-rail>`,
        standard: `<md-gb-nav-rail collapsible>${RAIL_ITEMS}</md-gb-nav-rail>`,
        mode: 'toggle',
        dialog: false,
        scrim: '.nav-rail-scrim',
        spec: {
          events: ['navigation-rail-4fd459'],
          escape: ['navigation-rail-4fd459'],
          escapeStandard: ['navigation-rail-4fd459'],
          scrim: ['navigation-rail-4fd459'],
          back: ['navigation-rail-4fd459', 'navigation-rail-0bdbd0'],
          focusIn: ['navigation-rail-1bdef9'],
          focusRestore: ['navigation-rail-1bdef9'],
          trap: ['navigation-rail-111de3'],
          lock: ['navigation-rail-4fd459'],
          lockStandard: ['navigation-rail-4e0bd5'],
        },
      },
    ],
  },
  search: {
    surfaces: [
      {
        id: 'SearchView',
        label: 'search view (docked)',
        tag: 'md-gb-search-view',
        imports: ['./md-gb-search-view.js'],
        modal: '<md-gb-search-view docked quick placeholder="Search"><div>Result one</div><div>Result two</div></md-gb-search-view>',
        standard: null,
        mode: 'lifecycle',
        dialog: true,
        scrim: 'dialog',
        closeCall: "el.close('custom')",
        spec: {
          events: ['search-0434de'],
          escape: ['search-0434de'],
          scrim: ['search-7bb5f4', 'search-0841e1'],
          back: ['search-b5700b'],
          focusIn: ['search-87429a', 'search-c8d471', 'search-9cf7fd'],
          focusRestore: ['search-533862', 'search-515bab'],
          trap: ['search-0434de'],
          lock: ['search-7bb5f4'],
        },
      },
    ],
  },
  datepicker: {
    surfaces: [
      {
        id: 'DatePicker',
        label: 'modal date picker',
        tag: 'md-gb-date-picker',
        imports: ['./md-gb-date-picker.js'],
        modal: '<md-gb-date-picker variant="modal" quick label="Date"></md-gb-date-picker>',
        standard: null,
        mode: 'lifecycle',
        dialog: true,
        scrim: 'dialog',
        closeCall: "el.close('custom')",
        spec: {
          events: [],
          escape: [],
          scrim: ['date-pickers-37dbeb', 'date-pickers-135584'],
          back: [],
          focusIn: ['date-pickers-795bcb'],
          focusRestore: [],
          trap: ['date-pickers-795bcb'],
          lock: [],
        },
      },
    ],
  },
  timepicker: {
    surfaces: [
      {
        id: 'TimePicker',
        label: 'modal time picker',
        tag: 'md-gb-time-picker',
        imports: ['./md-gb-time-picker.js'],
        modal: '<md-gb-time-picker modal quick></md-gb-time-picker>',
        standard: '<md-gb-time-picker quick></md-gb-time-picker>',
        mode: 'lifecycle',
        dialog: true,
        scrim: 'dialog',
        closeCall: "el.close('custom')",
        spec: {
          events: [],
          escape: [],
          scrim: ['time-pickers-7b8acb'],
          back: [],
          focusIn: ['time-pickers-0ae5d3'],
          focusRestore: [],
          trap: ['time-pickers-0ae5d3'],
          lock: ['time-pickers-e115c0'],
        },
      },
    ],
  },
};

const cite = (s, key) =>
  s.spec[key]?.length ? `    // spec: ${s.spec[key].join(', ')}\n` : '';

function surfaceSetup(s) {
  const type = s.mode === 'lifecycle' ? 'ModalLifecycleElement' : 'ModalToggleElement';
  const modal = `html\`<button id="before">Before</button>${s.modal}\``;
  const standard = s.standard
    ? `html\`<button id="before">Before</button>${s.standard}\``
    : null;
  const template = standard ? `opts.standard ? ${standard} : ${modal}` : modal;
  return `async function setupModal${s.id}(${standard ? 'opts: {standard?: boolean} = {}' : ''}) {
  const root = await mount(${template});
  const el = root.querySelector<${type}>('${s.tag}')!;
  await settle();
  return {el, before: root.querySelector<HTMLElement>('#before')!};
}

async function openModal${s.id}(el: ${type}) {
  ${s.mode === 'lifecycle' ? 'await el.show();' : 'el.expanded = true;'}
  await settle();
  await new Promise((resolve) => setTimeout(resolve, 30));
}

function isOpenModal${s.id}(el: ${type}) {
  return ${s.mode === 'lifecycle' ? 'el.open' : 'el.expanded'};
}`;
}

function surfaceTests(s) {
  const id = s.id;
  const lifecycle = s.mode === 'lifecycle';
  const open = `await openModal${id}(el);`;
  const isOpen = `isOpenModal${id}(el)`;
  const dialogOf = `el.shadowRoot!.querySelector('dialog')!`;
  const cases = [];

  const beforeRequest = lifecycle ? `const closed = modalOnce(el, 'closed');` : '';
  const afterRequest = lifecycle
    ? 'await closed;'
    : `await settle();
    await new Promise((resolve) => setTimeout(resolve, 30));`;
  const record = lifecycle
    ? 'const log = modalRecord(el);'
    : `const reasons: string[] = [];
    el.addEventListener('toggle', (event) => {
      const reason = (event as unknown as CustomEvent).detail.reason;
      if (reason) reasons.push(reason);
    });`;
  const expectReason = (reason) =>
    lifecycle
      ? `expect(log).toEqual(['close:${reason}', 'closed:${reason}']);`
      : `expect(reasons).toEqual(['${reason}']);`;

  if (lifecycle) {
    cases.push(`  it('fires open and opened when it opens, and open can be canceled', async () => {
${cite(s, 'events')}    const {el} = await setupModal${id}();
    const log = modalRecord(el);
    await el.show();
    expect(log).toEqual(['open', 'opened']);
    expect(el.open).toBeTrue();
    await el.close();
    const canceled = await setupModal${id}();
    canceled.el.addEventListener('open', (event) => event.preventDefault());
    await canceled.el.show();
    expect(canceled.el.open).toBeFalse();
  });

  it('fires a cancelable close and closed with detail.reason, and stays open when close is canceled', async () => {
${cite(s, 'events')}    const {el} = await setupModal${id}();
    await el.show();
    const log = modalRecord(el);
    await ${s.closeCall};
    expect(log).toEqual(['close:custom', 'closed:custom']);
    expect(el.open).toBeFalse();
    await el.show();
    el.addEventListener('close', (event) => event.preventDefault(), {once: true});
    await el.close();
    expect(el.open).toBeTrue();
  });`);
  }

  cases.push(`  it('closes on Escape with the escape reason', async () => {
${cite(s, 'escape')}    const {el} = await setupModal${id}();
    ${open}
    ${record}
    ${beforeRequest}
    await press('Escape');
    ${afterRequest}
    expect(${isOpen}).toBeFalse();
    ${expectReason('escape')}
  });`);

  if (s.scrim) {
    const target =
      s.scrim === 'dialog'
        ? dialogOf
        : `el.shadowRoot!.querySelector<HTMLElement>('${s.scrim}')!`;
    cases.push(`  it('closes on a scrim click with the scrim reason', async () => {
${cite(s, 'scrim')}    const {el} = await setupModal${id}();
    ${open}
    ${record}
    ${beforeRequest}
    ${target}.click();
    ${afterRequest}
    expect(${isOpen}).toBeFalse();
    ${expectReason('scrim')}
  });`);
  }

  if (s.dialog) {
    cases.push(`  it('closes on a back request with the back reason', async () => {
${cite(s, 'back')}    const {el} = await setupModal${id}();
    ${open}
    const dialog = ${dialogOf};
    if (typeof dialog.requestClose !== 'function') {
      pending('HTMLDialogElement.requestClose() is not supported');
    }
    ${record}
    ${beforeRequest}
    await modalOutwaitEscape();
    dialog.requestClose();
    ${afterRequest}
    expect(${isOpen}).toBeFalse();
    ${expectReason('back')}
  });`);
  } else {
    cases.push(`  it('closes on a back request (close watcher) with the back reason', async () => {
${cite(s, 'back')}    const global = globalThis as {CloseWatcher?: unknown};
    const original = global.CloseWatcher;
    FakeCloseWatcher.instances = [];
    global.CloseWatcher = FakeCloseWatcher;
    try {
      const {el} = await setupModal${id}();
      ${open}
      ${record}
      await modalOutwaitEscape();
      FakeCloseWatcher.active()[0].requestClose();
      // The back motion plays before the rail collapses.
      el.shadowRoot!.querySelector('.nav-rail')!.getAnimations().forEach((a) => a.finish());
      ${afterRequest}
      expect(${isOpen}).toBeFalse();
      ${expectReason('back')}
    } finally {
      if (original === undefined) delete global.CloseWatcher;
      else global.CloseWatcher = original;
    }
  });`);
  }

  cases.push(`  it('moves focus into the surface when it opens and restores it when it closes', async () => {
${cite(s, 'focusIn')}${cite(s, 'focusRestore')}    const {el, before} = await setupModal${id}();
    before.focus();
    ${open}
    expect(el.matches(':focus-within')).withContext('focus is inside').toBeTrue();
    ${beforeRequest}
    await press('Escape');
    ${afterRequest}
    expect(document.activeElement).toBe(before);
  });

  it('keeps Tab and Shift+Tab inside the surface', async () => {
${cite(s, 'trap')}    const {el} = await setupModal${id}();
    ${open}
    for (let i = 0; i < 6; i++) {
      await press('Tab');
      expect(el.matches(':focus-within')).withContext(\`after Tab \${i + 1}\`).toBeTrue();
    }
    for (let i = 0; i < 6; i++) {
      await press('Shift+Tab');
      expect(el.matches(':focus-within')).withContext(\`after Shift+Tab \${i + 1}\`).toBeTrue();
    }
  });

  it('locks page scrolling while it is open, and releases the lock when it closes', async () => {
${cite(s, 'lock')}    const {el} = await setupModal${id}();
    expect(modalPageLocked()).toBeFalse();
    ${open}
    expect(modalPageLocked()).toBeTrue();
    ${beforeRequest}
    await press('Escape');
    ${afterRequest}
    expect(modalPageLocked()).toBeFalse();
  });`);

  if (s.standard) {
    cases.push(`  it('standard variant: no scroll lock, no focus move, ignores Escape', async () => {
${cite(s, 'lockStandard')}${cite(s, 'escapeStandard')}    const {el, before} = await setupModal${id}({standard: true});
    before.focus();
    ${open}
    expect(modalPageLocked()).withContext('no scroll lock').toBeFalse();
    expect(document.activeElement).withContext('focus stays').toBe(before);
    await press('Escape');
    await settle();
    expect(${isOpen}).withContext('Escape does not close it').toBeTrue();
  });`);
  }

  return `describe('<${s.tag}> modal surface contract (${s.label}; ModalSurfaceController)', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`;
}

export function tests(dir, config) {
  const surfaces = config.surfaces;
  const imports = [...new Set(surfaces.flatMap((s) => s.imports))];
  const lifecycle = surfaces.some((s) => s.mode === 'lifecycle');
  const toggle = surfaces.some((s) => s.mode === 'toggle');
  const common = [
    toggle
      ? "import {FakeCloseWatcher} from '../shared/predictive-back-harness.js';\n"
      : '',
    lifecycle
      ? `/** What the lifecycle surfaces share: \`show()\`, \`close()\`, \`open\` and events. */
interface ModalLifecycleElement extends HTMLElement {
  open: boolean;
  show(): Promise<void>;
  close(...args: string[]): Promise<void>;
}

/** Records open / opened / close / closed, with \`:reason\` for close events. */
function modalRecord(el: HTMLElement) {
  const log: string[] = [];
  for (const type of ['open', 'opened', 'close', 'closed']) {
    el.addEventListener(type, (event) => {
      const reason = (event as CustomEvent).detail?.reason;
      log.push(reason ? \`\${type}:\${reason}\` : type);
    });
  }
  return log;
}

function modalOnce(el: HTMLElement, type: string) {
  return new Promise<void>((resolve) =>
    el.addEventListener(type, () => resolve(), {once: true}),
  );
}
`
      : '',
    toggle
      ? `/** The modal rail: the host owns \`expanded\`. */
interface ModalToggleElement extends HTMLElement {
  expanded: boolean;
}
`
      : '',
    `/**
 * A close request counts as Escape for a second after an Escape press (the
 * browser reports Escape and the back gesture alike); waits that out so a
 * request is a back request.
 */
function modalOutwaitEscape() {
  return new Promise((resolve) => setTimeout(resolve, 1100));
}

/** Whether the page scroll is locked (CSS overflow of the root element). */
function modalPageLocked() {
  return getComputedStyle(document.documentElement).overflow === 'hidden';
}`,
  ]
    .filter(Boolean)
    .join('\n');
  return {
    imports,
    setup: `${common}\n\n${surfaces.map(surfaceSetup).join('\n\n')}`,
    describe: surfaces.map(surfaceTests).join('\n\n'),
  };
}
