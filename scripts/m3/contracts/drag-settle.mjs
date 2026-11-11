/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contract tests of the drag-and-settle behavior
 * (`foundations/interaction/gestures/drag-settle.ts`): each component that drags a
 * surface between anchors does it as its spec page says: the surface follows
 * the pointer, settles at an anchor on release, mirrors in right-to-left,
 * returns on cancel, honors reduced motion, and has a single-pointer
 * alternative. Plugged into gen-contract-tests.mjs.
 *
 * `entries[dir]` is `{imports, cases}`; `imports` are side-effect modules,
 * relative to the component directory. Each case has:
 * - title: the test name.
 * - fixture: lit `html` source of the component under test. `${dir}` is the
 *   reading direction (`ltr`, or `rtl` when the case sets `rtl`).
 * - selector: CSS selector of the component inside the fixture.
 * - rtl: whether the fixture is right to left.
 * - body: TS statements. In scope: `root`, `el` (the component), `part(sel)`
 *   (an element in the component's shadow root), `drag(target, dx, opts)`
 *   (pointer events with timestamps: slow by default, `fast: true` flings,
 *   `release: false` stays pressed), `pointer(target, type, x, y, time)`,
 *   `centerOf(element)`, `press(key)`, `settle()`, `reduceMotion(fn)`.
 * - spec: unit IDs the case proves (cited in the generated test).
 */

export const entries = {
  list: {
    imports: ['./md-gb-list-item.js'],
    cases: [
      {
        title: 'reveals the actions when swiped past the positional threshold, and settles open',
        fixture: `<md-gb-list-item>Recipe<button slot="trailing-actions" aria-label="Archive">A</button></md-gb-list-item>`,
        selector: 'md-gb-list-item',
        spec: ['lists-60e140', 'lists-d93ed8', 'interaction-gestures-7c1f64'],
        body: `const revealed = jasmine.createSpy('reveal-change');
    el.addEventListener('reveal-change', revealed);
    const item = part('#item');
    const width = el.shadowRoot!.querySelector<HTMLElement>('slot[name="trailing-actions"]')!.getBoundingClientRect().width;
    drag(item, -(width * 0.8));
    await settle();
    expect(el.revealed).toBe('trailing');
    expect(revealed).toHaveBeenCalledTimes(1);
    expect(parseFloat(item.style.translate)).toBeCloseTo(-width, 0);`,
      },
      {
        title: 'returns closed when swiped less than the positional threshold, and keeps moving with the pointer meanwhile',
        fixture: `<md-gb-list-item>Recipe<button slot="trailing-actions" aria-label="Archive">A</button></md-gb-list-item>`,
        selector: 'md-gb-list-item',
        spec: ['interaction-gestures-94b35c'],
        body: `const revealed = jasmine.createSpy('reveal-change');
    el.addEventListener('reveal-change', revealed);
    const item = part('#item');
    drag(item, -30, {release: false});
    // The item follows the pointer in real time (past the touch slop).
    expect(parseFloat(item.style.translate)).toBeLessThan(-10);
    expect(parseFloat(item.style.translate)).toBeGreaterThan(-31);
    const {x, y} = centerOf(item);
    pointer(item, 'pointerup', x - 30, y, 600);
    await settle();
    expect(el.revealed).toBe('');
    expect(revealed).not.toHaveBeenCalled();
    expect(item.style.translate).toBe('');`,
      },
      {
        title: 'reveals the actions on a short fling faster than the velocity threshold',
        fixture: `<md-gb-list-item>Recipe<button slot="trailing-actions" aria-label="Archive">A</button></md-gb-list-item>`,
        selector: 'md-gb-list-item',
        spec: ['interaction-gestures-7c1f64'],
        body: `drag(part('#item'), -30, {fast: true});
    await settle();
    expect(el.revealed).toBe('trailing');`,
      },
      {
        title: 'triggers the primary action on a full swipe, clearing the item off-screen',
        fixture: `<md-gb-list-item>Recipe<button slot="trailing-actions" aria-label="Flag">F</button><button slot="trailing-actions" aria-label="Archive">A</button></md-gb-list-item>`,
        selector: 'md-gb-list-item',
        spec: ['lists-7cebc6'],
        body: `const flag = jasmine.createSpy('flag');
    const archive = jasmine.createSpy('archive');
    el.querySelector('[aria-label="Flag"]')!.addEventListener('click', flag);
    el.querySelector('[aria-label="Archive"]')!.addEventListener('click', archive);
    const item = part('#item');
    drag(item, -(item.offsetWidth * 0.9));
    await settle();
    expect(archive).toHaveBeenCalledTimes(1);
    expect(flag).not.toHaveBeenCalled();
    expect(parseFloat(item.style.translate)).toBeLessThanOrEqual(-item.offsetWidth);`,
      },
      {
        title: 'mirrors the swipe in right-to-left layouts: toward the start reveals the trailing actions',
        fixture: `<md-gb-list-item dir="\${dir}">Recipe<button slot="trailing-actions" aria-label="Archive">A</button></md-gb-list-item>`,
        selector: 'md-gb-list-item',
        rtl: true,
        spec: ['layout-bidirectionality-rtl-822768', 'layout-bidirectionality-rtl-b61a7c', 'layout-bidirectionality-rtl-20546a'],
        body: `const item = part('#item');
    drag(item, -80);
    await settle();
    // Toward the end in RTL: there are no leading actions to reveal.
    expect(el.revealed).toBe('');
    drag(item, 80);
    await settle();
    expect(el.revealed).toBe('trailing');
    expect(parseFloat(item.style.translate)).toBeGreaterThan(0);`,
      },
      {
        title: 'returns closed without a reveal when the gesture is cancelled',
        fixture: `<md-gb-list-item>Recipe<button slot="trailing-actions" aria-label="Archive">A</button></md-gb-list-item>`,
        selector: 'md-gb-list-item',
        spec: ['interaction-gestures-94b35c'],
        body: `const revealed = jasmine.createSpy('reveal-change');
    el.addEventListener('reveal-change', revealed);
    const item = part('#item');
    drag(item, -50, {release: false});
    const {x, y} = centerOf(item);
    pointer(item, 'pointercancel', x - 50, y, 700);
    await settle();
    expect(el.revealed).toBe('');
    expect(revealed).not.toHaveBeenCalled();
    expect(item.style.translate).toBe('');`,
      },
      {
        title: 'offers a "more" button as the single-pointer alternative to the swipe',
        fixture: `<md-gb-list-item>Recipe<button slot="trailing-actions" aria-label="Archive">A</button></md-gb-list-item>`,
        selector: 'md-gb-list-item',
        spec: ['lists-b2bf5a', 'lists-5743ee', 'lists-a33c4a'],
        body: `const revealed = jasmine.createSpy('reveal-change');
    el.addEventListener('reveal-change', revealed);
    const more = part('.list-item-reveal-button');
    more.click();
    await settle();
    expect(el.revealed).toBe('trailing');
    expect(more.getAttribute('aria-expanded')).toBe('true');
    expect(parseFloat(part('#item').style.translate)).toBeLessThan(0);
    more.click();
    await settle();
    expect(el.revealed).toBe('');
    expect(more.getAttribute('aria-expanded')).toBe('false');
    expect(revealed).toHaveBeenCalledTimes(2);`,
      },
      {
        title: 'settles with the default spatial spring, and without motion under reduced motion',
        fixture: `<md-gb-list-item>Recipe<button slot="trailing-actions" aria-label="Archive">A</button></md-gb-list-item>`,
        selector: 'md-gb-list-item',
        spec: [],
        body: `const durations = (e: Element) => getComputedStyle(e).transitionDuration.split(',').map((d) => parseFloat(d));
    expect(Math.max(...durations(part('#item')))).toBeGreaterThan(0);
    expect(getComputedStyle(part('#item')).transitionProperty).toContain('translate');
    await reduceMotion(async () => {
      const reduced = await dsMount(el.outerHTML, 'md-gb-list-item');
      const item = reduced.shadowRoot!.querySelector<HTMLElement>('#item')!;
      expect(Math.max(...durations(item))).toBe(0);
    });`,
      },
    ],
  },
  scaffold: {
    imports: ['./md-gb-pane-scaffold.js'],
    cases: [
      {
        title: 'resizes the secondary pane while the drag handle is dragged, in real time',
        fixture: `<div dir="\${dir}" style="width: 1000px; height: 400px"><md-gb-pane-scaffold resizable><div slot="secondary">List</div><div>Detail</div></md-gb-pane-scaffold></div>`,
        selector: 'md-gb-pane-scaffold',
        spec: ['layout-overview-363d3b', 'layout-overview-817d0e', 'layout-scaffold-e3982f'],
        body: `const handle = part('.drag-handle');
    const before = el.shadowRoot!.querySelector<HTMLElement>('.pane-secondary')!.getBoundingClientRect().width;
    drag(handle, 30, {release: false});
    await settle();
    expect(handle.classList.contains('drag-handle-dragged')).toBeTrue();
    expect(el.paneWidth).toBe(Math.round(before) + 30);`,
      },
      {
        title: 'snaps to a set width when the drag handle is released',
        fixture: `<div dir="\${dir}" style="width: 1000px; height: 400px"><md-gb-pane-scaffold resizable><div slot="secondary">List</div><div>Detail</div></md-gb-pane-scaffold></div>`,
        selector: 'md-gb-pane-scaffold',
        spec: ['layout-scaffold-8b7fa4', 'layout-scaffold-6f1bcb', 'layout-scaffold-9aba0f'],
        body: `const events: unknown[] = [];
    el.addEventListener('pane-resize', (e) => events.push((e as CustomEvent).detail));
    drag(part('.drag-handle'), 30);
    await settle();
    // 360dp + 30 is past the middle of 360 and 412: it settles on 412.
    expect(el.paneWidth).toBe(412);
    expect(events).toEqual([{paneWidth: 412, collapsedPane: null}]);`,
      },
      {
        title: 'collapses the secondary pane when dragged all the way to the edge',
        fixture: `<div dir="\${dir}" style="width: 1000px; height: 400px"><md-gb-pane-scaffold resizable><div slot="secondary">List</div><div>Detail</div></md-gb-pane-scaffold></div>`,
        selector: 'md-gb-pane-scaffold',
        spec: ['layout-overview-ec56e2', 'layout-scaffold-0e5e5e'],
        body: `drag(part('.drag-handle'), -600, {steps: 8});
    await settle();
    expect(el.collapsedPane).toBe('secondary');`,
      },
      {
        title: 'toggles between one and two panes when the handle is tapped, the single-pointer alternative to dragging',
        fixture: `<div dir="\${dir}" style="width: 1000px; height: 400px"><md-gb-pane-scaffold resizable><div slot="secondary">List</div><div>Detail</div></md-gb-pane-scaffold></div>`,
        selector: 'md-gb-pane-scaffold',
        spec: ['layout-scaffold-1e0240', 'layout-scaffold-8463de'],
        body: `part('.drag-handle').click();
    await settle();
    expect(el.collapsedPane).toBe('secondary');
    part('.drag-handle').click();
    await settle();
    expect(el.collapsedPane).toBeNull();`,
      },
      {
        title: 'steps through the snap widths with the arrow keys, the same widths a drag reaches',
        fixture: `<div dir="\${dir}" style="width: 1000px; height: 400px"><md-gb-pane-scaffold resizable><div slot="secondary">List</div><div>Detail</div></md-gb-pane-scaffold></div>`,
        selector: 'md-gb-pane-scaffold',
        spec: ['layout-scaffold-9aba0f'],
        body: `part('.drag-handle').focus();
    await press('ArrowRight');
    expect(el.paneWidth).toBe(412);
    await press('ArrowLeft');
    expect(el.paneWidth).toBe(360);`,
      },
      {
        title: 'mirrors the drag in right-to-left layouts: the secondary pane grows toward the start',
        fixture: `<div dir="\${dir}" style="width: 1000px; height: 400px"><md-gb-pane-scaffold resizable><div slot="secondary">List</div><div>Detail</div></md-gb-pane-scaffold></div>`,
        selector: 'md-gb-pane-scaffold',
        rtl: true,
        spec: ['layout-bidirectionality-rtl-822768'],
        body: `const handle = part('.drag-handle');
    const before = Math.round(el.shadowRoot!.querySelector<HTMLElement>('.pane-secondary')!.getBoundingClientRect().width);
    // The secondary pane is on the right in RTL: dragging left grows it.
    drag(handle, -30, {release: false});
    await settle();
    expect(el.paneWidth).toBe(before + 30);`,
      },
      {
        title: 'leaves the layout as it was when the drag is cancelled',
        fixture: `<div dir="\${dir}" style="width: 1000px; height: 400px"><md-gb-pane-scaffold resizable><div slot="secondary">List</div><div>Detail</div></md-gb-pane-scaffold></div>`,
        selector: 'md-gb-pane-scaffold',
        spec: ['interaction-gestures-94b35c'],
        body: `const handle = part('.drag-handle');
    const events: unknown[] = [];
    el.addEventListener('pane-resize', (e) => events.push((e as CustomEvent).detail));
    drag(handle, 30, {release: false});
    const {x, y} = centerOf(handle);
    pointer(handle, 'pointercancel', x + 30, y, 700);
    await settle();
    expect(el.paneWidth).toBeNull();
    expect(el.collapsedPane).toBeNull();
    expect(events.length).toBe(0);
    expect(handle.classList.contains('drag-handle-dragged')).toBeFalse();`,
      },
    ],
  },
  sheet: {
    sharedPress: true,
    imports: ['./md-gb-bottom-sheet.js', './md-gb-side-sheet.js'],
    cases: [
      {
        title: 'bottom sheet: the sheet follows the pointer while the drag handle area is dragged, in real time',
        fixture: `<md-gb-bottom-sheet modal quick state="expanded" label="Share"><div style="block-size: 300px">Tall content</div></md-gb-bottom-sheet>`,
        selector: 'md-gb-bottom-sheet',
        spec: ['bottom-sheets-ba6d67', 'interaction-gestures-94b35c'],
        body: `await el.show();
    await settle();
    const panel = part('.bottom-sheet-panel');
    const top = panel.getBoundingClientRect().top;
    drag(part('.bottom-sheet-drag-area'), 40, {axis: 'y', release: false});
    await settle();
    expect(panel.getBoundingClientRect().top).toBeCloseTo(top + 40, 0);`,
      },
      {
        title: 'bottom sheet: dragging the handle up past the positional threshold expands a partially expanded sheet',
        fixture: `<md-gb-bottom-sheet quick label="Player"><div style="block-size: 400px">Tall content</div></md-gb-bottom-sheet>`,
        selector: 'md-gb-bottom-sheet',
        spec: ['bottom-sheets-ba6d67', 'bottom-sheets-350a86', 'bottom-sheets-95e993'],
        body: `await el.show();
    await settle();
    const changed = jasmine.createSpy('state-change');
    el.addEventListener('state-change', changed);
    expect(el.state).toBe('partially-expanded');
    drag(part('.bottom-sheet-drag-area'), -120, {axis: 'y'});
    await settle();
    expect(el.state).toBe('expanded');
    expect(changed).toHaveBeenCalledTimes(1);
    expect(el.open).toBeTrue();`,
      },
      {
        title: 'bottom sheet: a short drag returns to the height it started from',
        fixture: `<md-gb-bottom-sheet quick label="Player"><div style="block-size: 400px">Tall content</div></md-gb-bottom-sheet>`,
        selector: 'md-gb-bottom-sheet',
        spec: ['interaction-gestures-94b35c'],
        body: `await el.show();
    await settle();
    const changed = jasmine.createSpy('state-change');
    el.addEventListener('state-change', changed);
    const panel = part('.bottom-sheet-panel');
    drag(part('.bottom-sheet-drag-area'), -20, {axis: 'y'});
    await settle();
    expect(el.state).toBe('partially-expanded');
    expect(changed).not.toHaveBeenCalled();
    expect(panel.style.transform).toBe('');`,
      },
      {
        title: 'bottom sheet: swiping a modal sheet down past its height dismisses it with the swipe reason',
        fixture: `<md-gb-bottom-sheet modal quick state="expanded" label="Share"><div style="block-size: 300px">Tall content</div></md-gb-bottom-sheet>`,
        selector: 'md-gb-bottom-sheet',
        spec: ['bottom-sheets-aca585', 'bottom-sheets-2562c2'],
        body: `await el.show();
    await settle();
    const reasons: string[] = [];
    el.addEventListener('close', (e) => reasons.push((e as CustomEvent).detail.reason));
    drag(part('.bottom-sheet-drag-area'), part('.bottom-sheet-panel').offsetHeight, {axis: 'y'});
    await settle();
    expect(reasons).toEqual(['swipe']);`,
      },
      {
        title: 'bottom sheet: a fast fling down dismisses a sheet that has no lower height',
        fixture: `<md-gb-bottom-sheet modal quick skip-partially-expanded label="Share"><div style="block-size: 300px">Tall content</div></md-gb-bottom-sheet>`,
        selector: 'md-gb-bottom-sheet',
        spec: ['bottom-sheets-aca585'],
        body: `await el.show();
    await settle();
    const reasons: string[] = [];
    el.addEventListener('close', (e) => reasons.push((e as CustomEvent).detail.reason));
    drag(part('.bottom-sheet-drag-area'), 30, {axis: 'y', fast: true});
    await settle();
    expect(reasons).toEqual(['swipe']);`,
      },
      {
        title: 'bottom sheet: a cancelled drag leaves the sheet where it was',
        fixture: `<md-gb-bottom-sheet modal quick state="expanded" label="Share"><div style="block-size: 300px">Tall content</div></md-gb-bottom-sheet>`,
        selector: 'md-gb-bottom-sheet',
        spec: ['interaction-gestures-94b35c'],
        body: `await el.show();
    await settle();
    const reasons: string[] = [];
    el.addEventListener('close', (e) => reasons.push((e as CustomEvent).detail.reason));
    const area = part('.bottom-sheet-drag-area');
    const panel = part('.bottom-sheet-panel');
    const top = panel.getBoundingClientRect().top;
    drag(area, 80, {axis: 'y', release: false});
    const {x, y} = centerOf(area);
    pointer(area, 'pointercancel', x, y + 80, 700);
    await settle();
    expect(reasons).toEqual([]);
    expect(el.state).toBe('expanded');
    expect(panel.getBoundingClientRect().top).toBeCloseTo(top, 0);`,
      },
      {
        title: 'bottom sheet: the drag handle button is the single-pointer alternative, and the click after a drag does not toggle',
        fixture: `<md-gb-bottom-sheet quick label="Player"><div style="block-size: 400px">Tall content</div></md-gb-bottom-sheet>`,
        selector: 'md-gb-bottom-sheet',
        spec: ['bottom-sheets-4f8489'],
        body: `await el.show();
    await settle();
    const handle = part('.bottom-sheet-drag-handle');
    handle.click();
    await settle();
    expect(el.state).toBe('expanded');
    handle.click();
    await settle();
    expect(el.state).toBe('partially-expanded');
    // A drag that ends over the handle is not a click on it.
    drag(handle, -120, {axis: 'y'});
    handle.click();
    await settle();
    expect(el.state).toBe('expanded');`,
      },
      {
        title: 'side sheet: swiping a modal sheet toward its edge past half its width dismisses it with the swipe reason',
        fixture: `<md-gb-side-sheet modal quick headline="Filters"><button>One</button></md-gb-side-sheet>`,
        selector: 'md-gb-side-sheet',
        spec: [],
        body: `await el.show();
    await settle();
    const reasons: string[] = [];
    el.addEventListener('close', (e) => reasons.push((e as CustomEvent).detail.reason));
    drag(part('dialog'), part('.sheet-panel').offsetWidth * 0.8);
    await settle();
    expect(reasons).toEqual(['swipe']);`,
      },
      {
        title: 'side sheet: follows the pointer toward the edge, and returns after a short swipe or a cancel',
        fixture: `<md-gb-side-sheet modal quick headline="Filters"><button>One</button></md-gb-side-sheet>`,
        selector: 'md-gb-side-sheet',
        spec: ['interaction-gestures-94b35c'],
        body: `await el.show();
    await settle();
    const reasons: string[] = [];
    el.addEventListener('close', (e) => reasons.push((e as CustomEvent).detail.reason));
    const dialog = part('dialog');
    const panel = part('.sheet-panel');
    const left = panel.getBoundingClientRect().left;
    drag(dialog, 40, {release: false});
    await settle();
    expect(panel.getBoundingClientRect().left).toBeCloseTo(left + 40, 0);
    const {x, y} = centerOf(dialog);
    pointer(dialog, 'pointercancel', x + 40, y, 700);
    await settle();
    expect(panel.getBoundingClientRect().left).toBeCloseTo(left, 0);
    drag(dialog, 30);
    await settle();
    expect(reasons).toEqual([]);
    expect(el.open).toBeTrue();`,
      },
      {
        title: 'side sheet: mirrors the swipe in right-to-left layouts: toward the start edge dismisses',
        fixture: `<div dir="\${dir}"><md-gb-side-sheet modal quick headline="Filters"><button>One</button></md-gb-side-sheet></div>`,
        selector: 'md-gb-side-sheet',
        rtl: true,
        spec: ['layout-bidirectionality-rtl-822768'],
        body: `await el.show();
    await settle();
    const reasons: string[] = [];
    el.addEventListener('close', (e) => reasons.push((e as CustomEvent).detail.reason));
    const dialog = part('dialog');
    const width = part('.sheet-panel').offsetWidth;
    // Toward the end edge (the way an LTR sheet closes) does not dismiss.
    drag(dialog, width * 0.8);
    await settle();
    expect(reasons).toEqual([]);
    drag(dialog, -width * 0.8);
    await settle();
    expect(reasons).toEqual(['swipe']);`,
      },
      {
        title: 'side sheet: gestures-disabled turns the swipe off',
        fixture: `<md-gb-side-sheet modal quick gestures-disabled headline="Filters"><button>One</button></md-gb-side-sheet>`,
        selector: 'md-gb-side-sheet',
        spec: [],
        body: `await el.show();
    await settle();
    drag(part('dialog'), part('.sheet-panel').offsetWidth * 0.9);
    await settle();
    expect(el.open).toBeTrue();`,
      },
    ],
  },
  navdrawer: {
    sharedPress: true,
    imports: ['./md-gb-nav-drawer.js', './md-gb-nav-drawer-item.js'],
    cases: [
      {
        title: 'swiping the sheet toward its anchoring edge past half its width dismisses a modal drawer with the swipe reason',
        fixture: `<md-gb-nav-drawer modal quick aria-label="Mail"><md-gb-nav-drawer-item selected>Inbox</md-gb-nav-drawer-item><md-gb-nav-drawer-item>Sent</md-gb-nav-drawer-item></md-gb-nav-drawer>`,
        selector: 'md-gb-nav-drawer',
        spec: ['navigation-drawer-d450da', 'navigation-drawer-f7bd4b', 'navigation-drawer-3f8d7a'],
        body: `await el.show();
    await settle();
    const reasons: string[] = [];
    el.addEventListener('close', (e) => reasons.push((e as CustomEvent).detail.reason));
    drag(part('.nav-drawer'), -(part('.nav-drawer').offsetWidth * 0.8));
    await settle();
    expect(reasons).toEqual(['swipe']);
    expect(el.open).toBeFalse();`,
      },
      {
        title: 'the sheet and the scrim follow the pointer while swiping, in real time',
        fixture: `<md-gb-nav-drawer modal quick aria-label="Mail"><md-gb-nav-drawer-item selected>Inbox</md-gb-nav-drawer-item></md-gb-nav-drawer>`,
        selector: 'md-gb-nav-drawer',
        spec: ['interaction-gestures-94b35c'],
        body: `await el.show();
    await settle();
    const sheet = part('.nav-drawer');
    const left = sheet.getBoundingClientRect().left;
    drag(sheet, -60, {release: false});
    await settle();
    expect(sheet.getBoundingClientRect().left).toBeCloseTo(left - 60, 0);
    expect(parseFloat(getComputedStyle(part('.nav-drawer-scrim')).opacity)).toBeLessThan(1);
    // Moving away from the anchoring edge does not pull the sheet past open.
    const {x, y} = centerOf(sheet);
    pointer(sheet, 'pointermove', x + 80, y, 400);
    await settle();
    expect(sheet.getBoundingClientRect().left).toBeCloseTo(left, 0);`,
      },
      {
        title: 'a short swipe, and a cancelled one, settle the drawer open again',
        fixture: `<md-gb-nav-drawer modal quick aria-label="Mail"><md-gb-nav-drawer-item selected>Inbox</md-gb-nav-drawer-item></md-gb-nav-drawer>`,
        selector: 'md-gb-nav-drawer',
        spec: ['interaction-gestures-94b35c'],
        body: `await el.show();
    await settle();
    const reasons: string[] = [];
    el.addEventListener('close', (e) => reasons.push((e as CustomEvent).detail.reason));
    const sheet = part('.nav-drawer');
    const left = sheet.getBoundingClientRect().left;
    drag(sheet, -40);
    await settle();
    expect(el.open).toBeTrue();
    expect(sheet.getBoundingClientRect().left).toBeCloseTo(left, 0);
    drag(sheet, -120, {release: false});
    const {x, y} = centerOf(sheet);
    pointer(sheet, 'pointercancel', x - 120, y, 700);
    await settle();
    expect(el.open).toBeTrue();
    expect(sheet.style.translate).toBe('');
    expect(reasons).toEqual([]);`,
      },
      {
        title: 'a fast fling toward the anchoring edge dismisses the drawer however short it is',
        fixture: `<md-gb-nav-drawer modal quick aria-label="Mail"><md-gb-nav-drawer-item selected>Inbox</md-gb-nav-drawer-item></md-gb-nav-drawer>`,
        selector: 'md-gb-nav-drawer',
        spec: ['navigation-drawer-3f8d7a'],
        body: `await el.show();
    await settle();
    drag(part('.nav-drawer'), -30, {fast: true});
    await settle();
    expect(el.open).toBeFalse();`,
      },
      {
        title: 'gestures-disabled turns the swipe off',
        fixture: `<md-gb-nav-drawer modal quick gestures-disabled aria-label="Mail"><md-gb-nav-drawer-item selected>Inbox</md-gb-nav-drawer-item></md-gb-nav-drawer>`,
        selector: 'md-gb-nav-drawer',
        spec: [],
        body: `await el.show();
    await settle();
    drag(part('.nav-drawer'), -(part('.nav-drawer').offsetWidth * 0.9));
    await settle();
    expect(el.open).toBeTrue();`,
      },
      {
        title: 'mirrors the swipe in right-to-left layouts: the drawer is anchored to the right and closes toward it',
        fixture: `<div dir="\${dir}"><md-gb-nav-drawer modal quick aria-label="Mail"><md-gb-nav-drawer-item selected>Inbox</md-gb-nav-drawer-item></md-gb-nav-drawer></div>`,
        selector: 'md-gb-nav-drawer',
        rtl: true,
        spec: ['layout-bidirectionality-rtl-822768'],
        body: `await el.show();
    await settle();
    const reasons: string[] = [];
    el.addEventListener('close', (e) => reasons.push((e as CustomEvent).detail.reason));
    const sheet = part('.nav-drawer');
    const width = sheet.offsetWidth;
    // Toward the left, the edge an LTR drawer closes toward: nothing happens.
    drag(sheet, -width * 0.8);
    await settle();
    expect(reasons).toEqual([]);
    drag(sheet, width * 0.8);
    await settle();
    expect(reasons).toEqual(['swipe']);`,
      },
    ],
  },
  navrail: {
    sharedPress: true,
    imports: ['./md-gb-nav-rail.js', './md-gb-nav-rail-item.js'],
    cases: [
      {
        title: 'swiping an expanded modal rail toward its edge past half its width collapses it with the swipe reason',
        fixture: `<div style="display: flex; height: 400px"><md-gb-nav-rail modal expanded aria-label="Main"><md-gb-nav-rail-item selected>Home</md-gb-nav-rail-item><md-gb-nav-rail-item>Search</md-gb-nav-rail-item></md-gb-nav-rail><main style="flex: 1">Content</main></div>`,
        selector: 'md-gb-nav-rail',
        spec: [],
        body: `const reasons: Array<string | undefined> = [];
    el.addEventListener('toggle', (e) => reasons.push((e as unknown as CustomEvent).detail.reason));
    drag(part('.nav-rail'), -(part('.nav-rail').offsetWidth * 0.8));
    await settle();
    expect(el.expanded).toBeFalse();
    expect(reasons).toEqual(['swipe']);`,
      },
      {
        title: 'the rail follows the pointer while swiping, and returns after a short swipe or a cancel',
        fixture: `<div style="display: flex; height: 400px"><md-gb-nav-rail modal expanded aria-label="Main"><md-gb-nav-rail-item selected>Home</md-gb-nav-rail-item></md-gb-nav-rail><main style="flex: 1">Content</main></div>`,
        selector: 'md-gb-nav-rail',
        spec: ['interaction-gestures-94b35c'],
        body: `const rail = part('.nav-rail');
    const left = rail.getBoundingClientRect().left;
    drag(rail, -60, {release: false});
    await settle();
    expect(rail.getBoundingClientRect().left).toBeCloseTo(left - 60, 0);
    const {x, y} = centerOf(rail);
    pointer(rail, 'pointercancel', x - 60, y, 700);
    await settle();
    el.shadowRoot!.getAnimations().forEach((a) => a.finish());
    expect(el.expanded).toBeTrue();
    expect(rail.getBoundingClientRect().left).toBeCloseTo(left, 0);
    drag(rail, -30);
    await settle();
    expect(el.expanded).toBeTrue();`,
      },
      {
        title: 'a fast fling dismisses the expanded modal rail however short it is',
        fixture: `<div style="display: flex; height: 400px"><md-gb-nav-rail modal expanded aria-label="Main"><md-gb-nav-rail-item selected>Home</md-gb-nav-rail-item></md-gb-nav-rail><main style="flex: 1">Content</main></div>`,
        selector: 'md-gb-nav-rail',
        spec: [],
        body: `drag(part('.nav-rail'), -30, {fast: true});
    await settle();
    expect(el.expanded).toBeFalse();`,
      },
      {
        title: 'mirrors the swipe in right-to-left layouts: the rail closes toward the right',
        fixture: `<div dir="\${dir}" style="display: flex; height: 400px"><md-gb-nav-rail modal expanded aria-label="Main"><md-gb-nav-rail-item selected>Home</md-gb-nav-rail-item></md-gb-nav-rail><main style="flex: 1">Content</main></div>`,
        selector: 'md-gb-nav-rail',
        rtl: true,
        spec: ['layout-bidirectionality-rtl-822768'],
        body: `const rail = part('.nav-rail');
    const width = rail.offsetWidth;
    drag(rail, -width * 0.8);
    await settle();
    expect(el.expanded).toBeTrue();
    drag(rail, width * 0.8);
    await settle();
    expect(el.expanded).toBeFalse();`,
      },
    ],
  },
  tabs: {
    sharedPress: true,
    imports: ['./md-gb-tabs.js', './md-gb-tab.js', './md-gb-tab-panels.js'],
    cases: [
      {
        title: 'swiping the content area toward the start past half its width selects the next tab and panel',
        fixture: `<md-gb-tabs aria-label="Topics"><md-gb-tab><span slot="label">One</span></md-gb-tab><md-gb-tab><span slot="label">Two</span></md-gb-tab><md-gb-tab><span slot="label">Three</span></md-gb-tab></md-gb-tabs><md-gb-tab-panels style="inline-size: 400px"><md-aria-tabpanel>Panel one</md-aria-tabpanel><md-aria-tabpanel>Panel two</md-aria-tabpanel><md-aria-tabpanel>Panel three</md-aria-tabpanel></md-gb-tab-panels>`,
        selector: 'md-gb-tab-panels',
        spec: ['tabs-79df51', 'tabs-fd3bbd', 'tabs-52e127'],
        body: `const tabs = root.querySelector<any>('md-gb-tabs')!;
    const changed = jasmine.createSpy('change');
    tabs.addEventListener('change', changed);
    drag(el, -240);
    await settle();
    expect(el.selectedIndex).toBe(1);
    expect(tabs.selectedTabIndex).toBe(1);
    expect(changed).toHaveBeenCalledTimes(1);
    drag(el, -240);
    await settle();
    expect(el.selectedIndex).toBe(2);
    // There is no panel past the last one.
    drag(el, -240);
    await settle();
    expect(el.selectedIndex).toBe(2);
    expect(changed).toHaveBeenCalledTimes(2);`,
      },
      {
        title: 'the panels follow the pointer while swiping, clamped to the neighboring panels, and return after a short swipe or a cancel',
        fixture: `<md-gb-tabs aria-label="Topics"><md-gb-tab><span slot="label">One</span></md-gb-tab><md-gb-tab><span slot="label">Two</span></md-gb-tab></md-gb-tabs><md-gb-tab-panels style="inline-size: 400px"><md-aria-tabpanel>Panel one</md-aria-tabpanel><md-aria-tabpanel>Panel two</md-aria-tabpanel></md-gb-tab-panels>`,
        selector: 'md-gb-tab-panels',
        spec: ['interaction-gestures-94b35c'],
        body: `const tabs = root.querySelector<any>('md-gb-tabs')!;
    const panels = el.panels;
    drag(el, -100, {release: false});
    await settle();
    expect(panels[0].getBoundingClientRect().left).toBeCloseTo(el.getBoundingClientRect().left - 100, 0);
    expect(panels[1].hidden).toBeFalse();
    const {x, y} = centerOf(el);
    pointer(el, 'pointercancel', x - 100, y, 700);
    await settle();
    expect(tabs.selectedTabIndex).toBe(0);
    drag(el, -100);
    await settle();
    expect(tabs.selectedTabIndex).toBe(0);
    expect(el.selectedIndex).toBe(0);`,
      },
      {
        title: 'a fast fling selects the next panel however short it is, and none past the first',
        fixture: `<md-gb-tabs aria-label="Topics"><md-gb-tab><span slot="label">One</span></md-gb-tab><md-gb-tab><span slot="label">Two</span></md-gb-tab></md-gb-tabs><md-gb-tab-panels style="inline-size: 400px"><md-aria-tabpanel>Panel one</md-aria-tabpanel><md-aria-tabpanel>Panel two</md-aria-tabpanel></md-gb-tab-panels>`,
        selector: 'md-gb-tab-panels',
        spec: ['tabs-79df51'],
        body: `drag(el, 40, {fast: true});
    await settle();
    expect(el.selectedIndex).toBe(0);
    drag(el, -40, {fast: true});
    await settle();
    expect(el.selectedIndex).toBe(1);
    drag(el, 40, {fast: true});
    await settle();
    expect(el.selectedIndex).toBe(0);`,
      },
      {
        title: 'mirrors the swipe in right-to-left layouts: swiping toward the start (right) selects the next tab',
        fixture: `<div dir="\${dir}"><md-gb-tabs aria-label="Topics"><md-gb-tab><span slot="label">One</span></md-gb-tab><md-gb-tab><span slot="label">Two</span></md-gb-tab></md-gb-tabs><md-gb-tab-panels style="inline-size: 400px"><md-aria-tabpanel>Panel one</md-aria-tabpanel><md-aria-tabpanel>Panel two</md-aria-tabpanel></md-gb-tab-panels></div>`,
        selector: 'md-gb-tab-panels',
        rtl: true,
        spec: ['layout-bidirectionality-rtl-822768'],
        body: `drag(el, -240);
    await settle();
    expect(el.selectedIndex).toBe(0);
    drag(el, 240);
    await settle();
    expect(el.selectedIndex).toBe(1);`,
      },
      {
        title: 'gestures-disabled turns the swipe off',
        fixture: `<md-gb-tabs aria-label="Topics"><md-gb-tab><span slot="label">One</span></md-gb-tab><md-gb-tab><span slot="label">Two</span></md-gb-tab></md-gb-tabs><md-gb-tab-panels gestures-disabled style="inline-size: 400px"><md-aria-tabpanel>Panel one</md-aria-tabpanel><md-aria-tabpanel>Panel two</md-aria-tabpanel></md-gb-tab-panels>`,
        selector: 'md-gb-tab-panels',
        spec: [],
        body: `drag(el, -300);
    await settle();
    expect(el.selectedIndex).toBe(0);`,
      },
    ],
  },
};

const SETUP = `/** Dispatches a pointer event with a given \`timeStamp\` (ms). */
function dsPointer(target: EventTarget, type: string, x: number, y: number, time: number) {
  const event = new PointerEvent(type, {
    bubbles: true,
    composed: true,
    cancelable: true,
    pointerId: 7,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    clientX: x,
    clientY: y,
  });
  Object.defineProperty(event, 'timeStamp', {value: time});
  target.dispatchEvent(event);
}

function dsCenter(element: Element) {
  const rect = element.getBoundingClientRect();
  return {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
}

/**
 * Presses the center of \`target\`, moves \`dx\` along x in \`steps\` moves and
 * releases (axis y moves along y instead). Slow by default (50ms per step); \`fast\` flings (2ms per step).
 */
function dsDrag(
  target: Element,
  dx: number,
  {release = true, fast = false, steps = 4, axis = 'x'}: {release?: boolean; fast?: boolean; steps?: number; axis?: 'x' | 'y'} = {},
) {
  const {x, y} = dsCenter(target);
  const ms = fast ? 2 : 50;
  dsPointer(target, 'pointerdown', x, y, 0);
  for (let i = 1; i <= steps; i++) {
    const d = (dx * i) / steps;
    dsPointer(target, 'pointermove', axis === 'y' ? x : x + d, axis === 'y' ? y + d : y, ms * i);
  }
  if (release) dsPointer(target, 'pointerup', axis === 'y' ? x : x + dx, axis === 'y' ? y + dx : y, ms * steps + (fast ? 0 : 500));
}

let dsTokens = false;
const dsExtra: HTMLElement[] = [];

/** Adopts the M3 tokens (once) so motion tokens and component styles resolve. */
async function dsLoadTokens() {
  if (dsTokens) return;
  dsTokens = true;
  const [{adoptStyles}, {styles}] = await Promise.all([
    import('../../styles/adopt-styles.js'),
    import('../../styles/m3.cssresult.js'),
  ]);
  adoptStyles(document, [styles]);
}

async function dsMount(markup: string, selector: string) {
  await dsLoadTokens();
  const host = document.createElement('div');
  host.innerHTML = markup;
  document.body.appendChild(host);
  await settle();
  dsExtra.push(host);
  return host.querySelector<HTMLElement>(selector)!;
}
void dsMount; // Not every component uses it.

async function dsSetup(template: TemplateResult, selector: string) {
  await dsLoadTokens();
  const root = await mount(template);

  const el = root.querySelector<HTMLElement>(selector)! as HTMLElement & {expanded: boolean; open: boolean; revealed: string | null; items: HTMLElement[]; paneWidth: number | null; collapsedPane: string | null; state: string; selectedIndex: number; panels: HTMLElement[]; show(): Promise<void>};
  return {root, el};
}

/** Runs \`fn\` with reduced motion preferred, then restores the preference. */
async function dsReduceMotion(fn: () => Promise<void>) {
  const {emulateMedia} = await import('@web/test-runner-commands');
  await emulateMedia({reducedMotion: 'reduce'});
  try {
    await fn();
  } finally {
    await emulateMedia({reducedMotion: 'no-preference'});
  }
}

/** Presses a key on a real keyboard. */
async function dsPress(key: string) {
  const {sendKeys} = await import('@web/test-runner-commands');
  await sendKeys({press: key});
  await settle();
}`;

export function tests(dir, c) {
  // `sharedPress`: the file's shared `press` helper (other modules press keys
  // too, and a per-test `press` here would hide it from the generator).
  const press = c.sharedPress ? '' : '    const press = dsPress;\n';
  const voided = c.sharedPress ? '' : 'press, ';
  const cases = c.cases.map((k) => {
    const cite = k.spec?.length ? `    // spec: ${k.spec.join(', ')}\n` : '';
    const direction = k.rtl ? 'rtl' : 'ltr';
    return `  it(${JSON.stringify(k.title)}, async () => {
${cite}    const dir = '${direction}';
    const {root, el} = await dsSetup(html\`${k.fixture}\`, '${k.selector}');
    const part = (selector: string) => el.shadowRoot!.querySelector<HTMLElement>(selector)!;
    const drag = dsDrag;
    const pointer = dsPointer;
    const centerOf = dsCenter;
${press}    const reduceMotion = dsReduceMotion;
    void [root, part, ${voided}drag, pointer, centerOf, reduceMotion, dir];
    ${k.body}
  });`;
  });
  const tag = c.cases[0].selector;
  return {
    imports: c.imports,
    setup: c.sharedPress ? SETUP.slice(0, SETUP.indexOf('\n/** Presses a key on a real keyboard. */')) : SETUP,
    describe: `describe('<${tag}> drag and settle contract (DragSettleController: follows the pointer, settles at an anchor, RTL, cancel, reduced motion, single-pointer alternative)', () => {
  afterEach(() => {
    container?.remove();
    for (const extra of dsExtra.splice(0)) extra.remove();
  });

${cases.join('\n\n')}
});`,
  };
}
