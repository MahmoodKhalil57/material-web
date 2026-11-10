/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './aria-internals.js';

import {
  ariaViolations,
  checkMarkup,
  describeAria,
  disabledConsistency,
  loadModel,
  renderMarkup,
  SECTIONS,
  stateConsistency,
  stats,
  type Rule,
  type Violation,
} from './aria-helpers.js';
import {ARIA_GAPS, ARIA_ROWS, isGap, OVERLAY_ROWS} from './aria-rows.js';
import {renderRow} from './axe-helpers.js';
import {sheetsOf, walkRules} from './subjects.js';

// Central suite: WAI-ARIA 1.3. The role model is read from the saved W3C draft
// (`node scripts/m3/gen-aria-model.mjs` writes `.m3-specs/aria/`), and every
// subject of the central table plus the open overlays and the states ARIA
// depends on (`aria-rows.ts`) is walked as an accessibility tree: light DOM,
// open shadow roots, slotted content, roles and ARIA from attributes and from
// ElementInternals. Rows with a real violation are in `ARIA_GAPS` and run as
// red tests in `aria_gap.ts`.

/** Which findings a fixture is expected to produce: `rule:attr`. */
const found = (violations: Violation[]) => violations.map((v) => `${v.rule}:${v.attr}`);

describe('WAI-ARIA 1.3 model (central)', () => {
  // Facts checked by hand against the saved spec (section 5.4, 6.8).
  it('has the 100 roles and 53 states and properties of the draft', async () => {
    const model = await loadModel();
    expect(Object.keys(model.roles).length).toBe(100);
    expect(Object.values(model.roles).filter((r) => r.abstract).length).toBe(12);
    expect(Object.keys(model.attrs).length).toBe(53);
  });

  it('knows the roles that matter to labs/gb', async () => {
    const {roles} = await loadModel();
    const names = (list: Array<{role: string}>) => list.map((c) => c.role);
    expect(names(roles['listbox']!.allowedChildren)).toEqual(['group', 'option']);
    expect(names(roles['option']!.requiredContext)).toEqual(['listbox', 'group']);
    expect(names(roles['tab']!.requiredContext)).toEqual(['tablist']);
    expect(names(roles['tablist']!.allowedChildren)).toEqual(['tab']);
    expect(names(roles['menuitem']!.requiredContext)).toContain('menu');
    expect(names(roles['menuitem']!.requiredContext)).toContain('menubar');
    expect(names(roles['gridcell']!.requiredContext)).toEqual(['row']);
    expect(roles['radio']!.requiredProps).toEqual(['aria-checked']);
    expect(roles['switch']!.requiredProps).toEqual(['aria-checked']);
    expect(roles['slider']!.requiredProps).toEqual(['aria-valuenow']);
    expect(roles['combobox']!.requiredProps).toEqual(['aria-expanded']);
    expect(roles['dialog']!.nameRequired).toBeFalse();
    expect(roles['tabpanel']!.nameRequired).toBeTrue();
    expect(roles['toolbar']!.supportedProps.map((p) => p.name)).toEqual(['aria-orientation']);
    expect(roles['generic']!.nameFrom).toEqual(['prohibited']);
    expect(roles['option']!.childrenPresentational).toBeTrue();
  });

  it('marks aria-grabbed and aria-dropeffect deprecated', async () => {
    const {attrs} = await loadModel();
    expect(Object.entries(attrs).filter(([, a]) => a.deprecated).map(([n]) => n).sort()).toEqual([
      'aria-dropeffect',
      'aria-grabbed',
    ]);
  });

  it('knows the value types', async () => {
    const {attrs} = await loadModel();
    expect(attrs['aria-checked']!.valueType).toBe('tristate');
    expect(attrs['aria-pressed']!.valueType).toBe('tristate');
    expect(attrs['aria-expanded']!.valueType).toBe('true/false/undefined');
    expect(attrs['aria-haspopup']!.values).toEqual(['false', 'true', 'menu', 'listbox', 'tree', 'grid', 'dialog']);
    expect(attrs['aria-activedescendant']!.valueType).toBe('ID reference');
    expect(attrs['aria-controls']!.valueType).toBe('ID reference list');
  });
});

describe('WAI-ARIA 1.3 checks can fail (central)', () => {
  // One deliberately broken fixture per rule category: the checker must name
  // the rule and the attribute. A correct fixture must stay clean.
  const BROKEN: Array<[Rule, string, string]> = [
    ['role', 'role', '<div role="widget">x</div>'],
    ['role', 'role', '<div role="no-such-role">x</div>'],
    ['required', 'aria-checked', '<div role="checkbox" aria-label="x" tabindex="0"></div>'],
    ['required', 'aria-valuenow', '<div role="slider" aria-label="x" tabindex="0"></div>'],
    ['required', 'aria-expanded', '<div role="combobox" aria-label="x" tabindex="0"></div>'],
    ['unsupported', 'aria-checked', '<div role="button" aria-checked="true" tabindex="0">x</div>'],
    ['unsupported', 'aria-foo', '<div role="button" aria-foo="1" tabindex="0">x</div>'],
    ['prohibited', 'aria-roledescription', '<div aria-roledescription="carousel">x</div>'],
    ['prohibited', 'aria-braillelabel', '<p aria-braillelabel="x">x</p>'],
    ['name-prohibited', 'aria-labelledby', '<span id="l">l</span><div role="tooltip" aria-labelledby="l">x</div>'],
    ['name-prohibited', 'aria-label', '<span aria-label="x">x</span>'],
    ['deprecated', 'aria-grabbed', '<div aria-grabbed="true">x</div>'],
    ['deprecated', 'aria-dropeffect', '<div aria-dropeffect="move">x</div>'],
    ['deprecated', 'aria-disabled', '<div role="dialog" aria-label="x" aria-disabled="true">x</div>'],
    ['value', 'aria-expanded', '<button aria-expanded="maybe">x</button>'],
    ['value', 'aria-pressed', '<button aria-pressed="yes">x</button>'],
    ['value', 'aria-level', '<div role="heading" aria-level="first">x</div>'],
    ['value', 'aria-valuenow', '<div role="slider" aria-label="x" aria-valuenow="500" aria-valuemax="10" tabindex="0"></div>'],
    ['value', 'aria-checked', '<div role="radio" aria-label="x" aria-checked="mixed" tabindex="0"></div>'],
    ['value', 'aria-haspopup', '<button aria-haspopup="popup">x</button>'],
    ['context', 'role', '<div role="option" aria-label="x">x</div>'],
    ['context', 'role', '<div role="tab" aria-label="x">x</div>'],
    ['context', 'role', '<div role="menuitem">x</div>'],
    ['context', 'role', '<div role="gridcell">x</div>'],
    ['children', 'role', '<div role="listbox" aria-label="l"><div role="button" tabindex="0">x</div></div>'],
    ['children', 'role', '<div role="tablist"><div role="tab" aria-selected="true">a</div><button>b</button></div>'],
    ['name', '', '<div role="button" tabindex="0"></div>'],
    ['name', '', '<div role="listbox"><div role="option">a</div></div>'],
    ['idref', 'aria-labelledby', '<div role="group" aria-labelledby="missing">x</div>'],
    ['idref', 'aria-controls', '<button aria-controls="missing">x</button>'],
    ['idref', 'aria-activedescendant', '<div role="listbox" aria-label="l" aria-activedescendant="outside"><div role="option">a</div></div><div id="outside">x</div>'],
  ];
  for (const [rule, attr, html] of BROKEN) {
    it(`reports ${rule} on ${attr}: ${html.slice(0, 70)}`, async () => {
      const violations = await checkMarkup(html);
      expect(found(violations)).withContext(describeAria(violations)).toContain(`${rule}:${attr}`);
      for (const v of violations) expect(v.section).toBe(SECTIONS[v.rule]);
    });
  }

  it('reports role and attribute set only through ElementInternals', async () => {
    class Bad extends HTMLElement {
      constructor() {
        super();
        const internals = this.attachInternals();
        internals.role = 'checkbox';
        internals.ariaLabel = 'internal';
        internals.ariaPressed = 'sometimes';
      }
    }
    customElements.define('aria-fixture-internals', Bad);
    const violations = await checkMarkup('<aria-fixture-internals tabindex="0"></aria-fixture-internals>');
    expect(found(violations)).toContain('required:aria-checked');
    expect(found(violations)).toContain('unsupported:aria-pressed');
    expect(found(violations)).toContain('value:aria-pressed');
  });

  it('reports a shadow-DOM role problem and follows slots', async () => {
    class Host extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({mode: 'open'}).innerHTML = '<div role="listbox" aria-label="l"><slot></slot></div>';
      }
    }
    customElements.define('aria-fixture-shadow', Host);
    // A slotted tab is an accessibility child of the shadow listbox.
    const violations = await checkMarkup(
      '<aria-fixture-shadow><div role="option">a</div><div role="tab" aria-label="t"></div></aria-fixture-shadow>',
    );
    expect(found(violations)).toContain('children:role');
    expect(found(violations)).toContain('context:role');
  });

  it('reports a state that does not follow the component', async () => {
    class Stale extends HTMLElement {
      selected = false;
      updateComplete = Promise.resolve(true);
      connectedCallback() {
        this.setAttribute('role', 'tab');
        this.setAttribute('aria-selected', 'false');
      }
    }
    customElements.define('aria-fixture-stale', Stale);
    const {container, cleanup} = await renderMarkup(
      '<div role="tablist"><aria-fixture-stale aria-label="a"></aria-fixture-stale></div>',
    );
    const model = await loadModel();
    const violations = await stateConsistency(container, model);
    cleanup();
    expect(found(violations)).toEqual(['consistency:aria-selected']);
    expect(violations[0]!.message).toContain('aria-selected is "false" but aria-fixture-stale.selected is true');
  });

  it('reports a disabled component that is not exposed as disabled', async () => {
    class Loose extends HTMLElement {
      disabled = false;
      updateComplete = Promise.resolve(true);
      connectedCallback() {
        this.setAttribute('role', 'button');
        this.setAttribute('aria-label', 'x');
        this.tabIndex = 0;
      }
    }
    customElements.define('aria-fixture-loose', Loose);
    const {container, cleanup} = await renderMarkup('<aria-fixture-loose></aria-fixture-loose>');
    const violations = await disabledConsistency(container, await loadModel());
    cleanup();
    expect(found(violations)).toEqual(['consistency:aria-disabled']);
  });

  it('reports a tablist with no or two selected tabs, and a tooltip anchor that claims a menu', async () => {
    const none = await checkMarkup(
      '<div role="tablist" aria-label="t"><div role="tab" aria-selected="false">a</div><div role="tab" aria-selected="false">b</div></div>',
    );
    expect(found(none)).toContain('consistency:aria-selected');
    const two = await checkMarkup(
      '<div role="tablist" aria-label="t"><div role="tab" aria-selected="true">a</div><div role="tab" aria-selected="true">b</div></div>',
    );
    expect(found(two)).toContain('consistency:aria-selected');
    const anchor = await checkMarkup(
      '<button aria-haspopup="menu" aria-controls="p">x</button><div role="dialog" id="p" aria-label="p">d</div>',
    );
    expect(found(anchor)).toContain('consistency:aria-haspopup');
  });

  it('reports icon-font text that leaks into an accessible name', async () => {
    const violations = await checkMarkup(
      '<button><span style="font-family: \'Material Symbols Outlined\'">check</span>Name</button>',
    );
    expect(found(violations)).toContain('name:');
  });

  it('stays quiet on well-formed ARIA', async () => {
    const clean = await checkMarkup(`
      <div role="listbox" aria-label="Fruit" aria-multiselectable="true">
        <div role="option" aria-selected="true">Apple</div>
        <div><div role="option" aria-selected="false">Pear</div></div>
        <div role="group" aria-label="Citrus"><div role="option" aria-selected="false">Lime</div></div>
      </div>
      <div role="tablist" aria-label="Tabs"><div role="tab" aria-selected="true" aria-controls="p1" id="t1">One</div>
        <div role="tab" aria-selected="false" id="t2">Two</div></div>
      <div role="tabpanel" id="p1" aria-labelledby="t1">Panel</div>
      <div role="menu" aria-label="Menu"><div role="menuitem">Cut</div>
        <div role="group" aria-label="View"><div role="menuitemradio" aria-checked="true">A</div></div></div>
      <div role="slider" aria-label="Volume" aria-valuenow="10" aria-valuemin="0" aria-valuemax="20" tabindex="0"></div>
      <div role="switch" aria-checked="false" aria-label="Wi-Fi" tabindex="0"></div>
      <div role="dialog" aria-modal="true" aria-labelledby="h">Body<h2 id="h">Title</h2></div>
      <div role="grid" aria-label="Days"><div role="row"><div role="columnheader">Mon</div><div role="gridcell" aria-selected="false">1</div></div></div>
      <div role="combobox" aria-label="Pick" aria-expanded="true" aria-controls="lb" aria-haspopup="listbox" tabindex="0"></div>
      <div role="listbox" id="lb" aria-label="Choices"><div role="option">Choice</div></div>
      <div role="toolbar" aria-label="Tools"><button aria-label="Bold" aria-pressed="false">B</button></div>
      <div role="list" aria-owns="owned"><div role="listitem">One</div></div><div id="owned" role="listitem">Two</div>
      <ul><li>native</li></ul>
      <div aria-hidden="true"><div role="option">hidden, so not checked</div></div>
      <div role="button" aria-label="x" tabindex="0"><div role="option">inside presentational children</div></div>
    `);
    expect(clean.map((v) => `${v.rule}:${v.attr}:${v.target}`)).toEqual([]);
  });
});

describe('WAI-ARIA 1.3 (central)', () => {
  for (const row of ARIA_ROWS) {
    const gaps = ARIA_GAPS[row.id] ?? [];
    it(`${row.id} follows the ARIA 1.3 role model${gaps.length ? ' (apart from its known gaps)' : ''}`, async () => {
      const model = await loadModel();
      const {container, cleanup} = await renderRow(row);
      const violations = [...(await ariaViolations(container))];
      // The deprecated state attributes must not style or mark anything either.
      for (const sheet of sheetsOf(container)) {
        for (const {rule} of walkRules(sheet.cssRules)) {
          if (/aria-(grabbed|dropeffect)/.test(rule.selectorText)) {
            violations.push({
              rule: 'deprecated',
              role: 'generic',
              attr: /aria-(grabbed|dropeffect)/.exec(rule.selectorText)![0],
              section: SECTIONS.deprecated,
              message: `a style rule selects on the deprecated attribute: ${rule.selectorText.slice(0, 80)}`,
              target: row.id,
            });
          }
        }
      }
      cleanup();
      if (!OVERLAY_ROWS.has(row.id)) {
        const flipped = await renderRow(row);
        violations.push(...(await stateConsistency(flipped.container, model)));
        flipped.cleanup();
        const disabled = await renderRow(row);
        violations.push(...(await disabledConsistency(disabled.container, model)));
        disabled.cleanup();
      }
      const unexpected = violations.filter(
        (v) => !gaps.some((g) => isGap(v, g)),
      );
      expect(unexpected.length).withContext(describeAria(unexpected)).toBe(0);
    }, 30000);
  }

  it('the state checks compare real components', async () => {
    const before = stats.compared + stats.disabled;
    for (const id of ['switch-selected', 'tabs', 'chip-set-filter-selected']) {
      const row = ARIA_ROWS.find((r) => r.id === id)!;
      const first = await renderRow(row);
      await stateConsistency(first.container, await loadModel());
      first.cleanup();
      const second = await renderRow(row);
      await disabledConsistency(second.container, await loadModel());
      second.cleanup();
    }
    expect(stats.compared + stats.disabled).toBeGreaterThan(before + 3);
  });
});
