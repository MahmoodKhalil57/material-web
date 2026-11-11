/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../all.js';

import type {Spec} from '@json-render/core';

import {axeViolations, describeViolations} from '../foundations/accessibility/axe-helpers.js';
import {checkSpec, COMPONENTS, m3Prompt, M3_RULES, renderSpec} from './index.js';

/** Waits for the store's re-render and the elements' updates. */
async function settle(root: ParentNode) {
  await new Promise((r) => setTimeout(r));
  await Promise.all(
    [...root.querySelectorAll('*')].map((el) => (el as Element & {updateComplete?: Promise<unknown>}).updateComplete),
  );
}

/** A spec from a root element and the other elements. */
function spec(elements: Spec['elements'], state?: Record<string, unknown>, root = 'root'): Spec {
  return {root, elements, ...(state ? {state} : {})};
}

const text = (t: unknown) => ({type: 'Text', props: {text: t}, children: [] as string[]});

describe('json-render', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });
  afterEach(() => container.remove());

  describe('renderSpec', () => {
    it('renders elements with their props, text and named slots', async () => {
      renderSpec(
        spec({
          root: {type: 'Dialog', props: {open: false}, children: ['body'], slots: {headline: ['title'], actions: ['ok']}},
          title: text('Delete file?'),
          body: text('This cannot be undone.'),
          ok: {type: 'Button', props: {color: 'tonal'}, children: ['ok-label']},
          'ok-label': text('Delete'),
        }),
        container,
      );
      await settle(container);
      const dialog = container.querySelector('md-gb-dialog')!;
      expect(dialog).withContext('dialog').not.toBeNull();
      const button = dialog.querySelector('md-gb-button') as HTMLElement & {color: string};
      expect(button.getAttribute('slot')).toBe('actions');
      expect(button.color).toBe('tonal');
      expect(button.textContent).toBe('Delete');
      const headline = dialog.querySelector('span[slot="headline"]');
      expect(headline?.textContent).toBe('Delete file?');
      expect(dialog.textContent).toContain('This cannot be undone.');
    });

    it('resolves $state props and visibility, and re-renders on state changes', async () => {
      const view = renderSpec(
        spec(
          {
            root: {type: 'Html', props: {tag: 'div'}, children: ['field', 'note']},
            field: {type: 'TextField', props: {label: {$state: '/label'}}, children: []},
            note: {type: 'Html', props: {tag: 'p', text: 'Saved'}, children: [], visible: {$state: '/saved', eq: true}},
          },
          {label: 'Name', saved: false},
        ),
        container,
      );
      await settle(container);
      const field = container.querySelector('md-gb-text-field')!;
      expect(field.label).toBe('Name');
      expect(container.querySelector('p')).toBeNull();
      view.store.update({'/label': 'Full name', '/saved': true});
      await settle(container);
      expect(container.querySelector('md-gb-text-field')).withContext('the same element').toBe(field);
      expect(field.label).toBe('Full name');
      expect(container.querySelector('p')?.textContent).toBe('Saved');
    });

    it('writes $bindState props back to state on change', async () => {
      const view = renderSpec(
        spec({root: {type: 'Switch', props: {selected: {$bindState: '/wifi'}}, children: []}}, {wifi: false}),
        container,
      );
      await settle(container);
      const toggle = container.querySelector('md-gb-switch') as HTMLElement & {selected: boolean};
      expect(toggle.selected).toBeFalse();
      toggle.selected = true;
      toggle.dispatchEvent(new Event('change', {bubbles: true}));
      expect(view.store.get('/wifi')).toBeTrue();
    });

    it('runs built-in and app actions bound with on (press means click)', async () => {
      const saved: unknown[] = [];
      const view = renderSpec(
        spec(
          {
            root: {type: 'Html', props: {tag: 'div'}, children: ['set', 'save']},
            set: {
              type: 'Button',
              props: {},
              children: ['set-label'],
              on: {click: {action: 'setState', params: {statePath: '/count', value: 1}}},
            },
            'set-label': text('Set'),
            save: {
              type: 'Button',
              props: {},
              children: ['save-label'],
              on: {press: {action: 'save', params: {name: {$state: '/name'}}}},
            },
            'save-label': text('Save'),
          },
          {count: 0, name: 'Ada'},
        ),
        container,
        {handlers: {save: (params) => void saved.push(params)}},
      );
      await settle(container);
      const [setButton, saveButton] = [...container.querySelectorAll('md-gb-button')] as HTMLElement[];
      setButton.click();
      await settle(container);
      expect(view.store.get('/count')).toBe(1);
      saveButton.click();
      await settle(container);
      expect(saved).toEqual([{name: 'Ada'}]);
    });

    it('repeats children over a state array, with $item and pushState', async () => {
      const view = renderSpec(
        spec(
          {
            root: {type: 'List', props: {}, children: ['item'], repeat: {statePath: '/fruits', key: 'id'}},
            item: {type: 'ListItem', props: {}, children: ['name']},
            name: {type: 'Text', props: {text: {$item: 'name'}}, children: []},
          },
          {fruits: [{id: 'a', name: 'Apple'}, {id: 'b', name: 'Banana'}]},
        ),
        container,
      );
      await settle(container);
      const names = () => [...container.querySelectorAll('md-gb-list-item')].map((i) => i.textContent);
      expect(names()).toEqual(['Apple', 'Banana']);
      view.store.set('/fruits', [...(view.store.get('/fruits') as unknown[]), {id: 'c', name: 'Cherry'}]);
      await settle(container);
      expect(names()).toEqual(['Apple', 'Banana', 'Cherry']);
    });

    it('only creates allowed native elements and sanitizes their URLs', async () => {
      const warnings: string[] = [];
      renderSpec(
        spec({
          root: {type: 'Html', props: {tag: 'div'}, children: ['link', 'bad']},
          link: {type: 'Html', props: {tag: 'a', href: 'javascript:alert(1)', text: 'Link'}, children: []},
          bad: {type: 'Html', props: {tag: 'script', text: 'alert(1)'}, children: []},
        }),
        container,
        {onWarning: (m) => warnings.push(m)},
      );
      await settle(container);
      expect(container.querySelector('script')).toBeNull();
      expect(warnings.some((w) => w.includes('"script" is not allowed'))).toBeTrue();
      const href = container.querySelector('a')!.getAttribute('href') ?? '';
      expect(href.startsWith('javascript:')).withContext(href).toBeFalse();
    });

    it('skips unknown types and missing keys with a warning', async () => {
      const warnings: string[] = [];
      renderSpec(
        spec({root: {type: 'Html', props: {tag: 'div'}, children: ['nope', 'gone']}, nope: {type: 'Marquee', props: {}, children: []}}),
        container,
        {onWarning: (m) => warnings.push(m)},
      );
      await settle(container);
      expect(warnings).toEqual(['Unknown component type "Marquee" (element "nope").', 'Missing element "gone".']);
    });

    it('renders a screen that passes checkSpec and axe (WCAG 2.2 AA)', async () => {
      const screen = spec(
        {
          root: {type: 'Html', props: {tag: 'main'}, children: ['bar', 'form', 'view', 'list', 'fab']},
          bar: {type: 'AppBar', props: {}, children: ['bar-title']},
          'bar-title': {type: 'Html', props: {tag: 'h1', text: 'Settings'}, children: []},
          form: {type: 'Html', props: {tag: 'section', ariaLabel: 'Profile'}, children: ['name', 'wifi-label']},
          name: {type: 'TextField', props: {label: 'Name', value: {$bindState: '/name'}}, children: []},
          'wifi-label': {type: 'Html', props: {tag: 'label', text: 'Wi-Fi'}, children: ['wifi']},
          wifi: {type: 'Switch', props: {selected: {$bindState: '/wifi'}}, children: []},
          view: {type: 'SegmentedButtonSet', props: {ariaLabel: 'View'}, children: ['day', 'week', 'month']},
          day: {type: 'SegmentedButton', props: {label: 'Day', selected: true}, children: []},
          week: {type: 'SegmentedButton', props: {label: 'Week'}, children: []},
          month: {type: 'SegmentedButton', props: {label: 'Month'}, children: []},
          list: {type: 'List', props: {ariaLabel: 'Devices'}, children: ['device'], repeat: {statePath: '/devices', key: 'id'}},
          device: {type: 'ListItem', props: {}, children: ['device-name']},
          'device-name': {type: 'Text', props: {text: {$item: 'name'}}, children: []},
          fab: {type: 'Fab', props: {label: 'Add device'}, children: ['fab-icon']},
          'fab-icon': {type: 'Icon', props: {}, children: ['fab-icon-name']},
          'fab-icon-name': text('add'),
        },
        {name: 'Ada', wifi: true, devices: [{id: '1', name: 'Phone'}, {id: '2', name: 'Laptop'}]},
      );
      expect(checkSpec(screen).issues).toEqual([]);
      renderSpec(screen, container);
      await settle(container);
      const violations = await axeViolations(container);
      expect(violations).withContext(describeViolations(violations)).toEqual([]);
    });

    it('renders every catalog component as its element', async () => {
      for (const [name, component] of Object.entries(COMPONENTS)) {
        if (component.tag.startsWith('#')) continue;
        expect(customElements.get(component.tag)).withContext(`${component.tag} is defined`).toBeDefined();
        const view = renderSpec(spec({root: {type: name, props: {}, children: []}}), container);
        await settle(container);
        expect(container.firstElementChild?.localName).withContext(name).toBe(component.tag);
        view.dispose();
      }
    });
  });

  describe('checkSpec', () => {
    const issuesOf = (s: Spec) => checkSpec(s).issues.map((i) => `${i.kind}:${i.severity}:${i.rule ?? ''}`);

    it('accepts a valid spec, with expressions in typed props', () => {
      const result = checkSpec(
        spec(
          {
            root: {type: 'Switch', props: {selected: {$bindState: '/on'}, density: -1}, children: [], on: {change: {action: 'setState', params: {statePath: '/x', value: 1}}}},
          },
          {on: true},
        ),
      );
      expect(result.issues).toEqual([]);
      expect(result.valid).toBeTrue();
    });

    it('rejects unknown props, wrong enum values, slots and children', () => {
      const result = checkSpec(
        spec({
          root: {type: 'Button', props: {color: 'purple', bogus: 1}, children: [], slots: {header: []}},
          box: {type: 'Checkbox', props: {}, children: ['t']},
          t: text('x'),
        }),
      );
      expect(result.valid).toBeFalse();
      const messages = result.issues.map((i) => i.message).join('\n');
      expect(messages).toContain('elements.root.props.color');
      expect(messages).toContain('bogus');
      expect(messages).toContain('Button has no slot "header"');
      expect(messages).toContain('Checkbox takes no children');
    });

    it('warns about events the component does not fire', () => {
      expect(issuesOf(spec({root: {type: 'Divider', props: {}, children: [], on: {opened: {action: 'setState'}}}}))).toContain('events:warning:');
    });

    it('checks the M3 rules', () => {
      const n = (count: number, type: string, label = true) =>
        Object.fromEntries(
          Array.from({length: count}, (_, i) => [
            [`${type}-${i}`, {type, props: {}, children: label ? [`${type}-${i}-t`] : []}],
            [`${type}-${i}-t`, text(`Item ${i}`)],
          ]).flat(),
        );
      const keys = (count: number, type: string) => Array.from({length: count}, (_, i) => `${type}-${i}`);
      expect(issuesOf(spec({root: {type: 'SegmentedButtonSet', props: {}, children: keys(6, 'SegmentedButton')}, ...n(6, 'SegmentedButton')}))).toContain(
        'm3:error:segmented-buttons-2-to-5',
      );
      expect(issuesOf(spec({root: {type: 'SegmentedButtonSet', props: {}, children: keys(3, 'SegmentedButton')}, ...n(3, 'SegmentedButton')}))).not.toContain(
        'm3:error:segmented-buttons-2-to-5',
      );
      expect(issuesOf(spec({root: {type: 'NavBar', props: {}, children: keys(2, 'NavBarItem')}, ...n(2, 'NavBarItem')}))).toContain('m3:error:navigation-bar-3-to-5');
      expect(issuesOf(spec({root: {type: 'FabMenu', props: {}, children: keys(7, 'FabMenuItem')}, ...n(7, 'FabMenuItem')}))).toContain('m3:error:fab-menu-max-6');
      expect(issuesOf(spec({root: {type: 'FabMenu', props: {}, children: keys(2, 'FabMenuItem')}, ...n(2, 'FabMenuItem', false)}))).toContain(
        'm3:warning:fab-menu-item-label',
      );
      expect(issuesOf(spec({root: {type: 'NavDrawer', props: {}, children: []}}))).toContain('m3:warning:navigation-drawer-deprecated');
      expect(
        issuesOf(
          spec({
            root: {type: 'Dialog', props: {}, children: [], slots: {actions: keys(3, 'Button')}},
            ...n(3, 'Button'),
          }),
        ),
      ).toContain('m3:warning:dialog-max-2-actions');
      expect(
        issuesOf(
          spec({
            root: {type: 'Html', props: {tag: 'div'}, children: ['a', 'b', 'c']},
            a: {type: 'Fab', props: {label: 'Compose'}, children: []},
            b: {type: 'Fab', props: {label: 'Reply'}, children: []},
            c: {type: 'Snackbar', props: {}, children: []},
          }),
        ),
      ).toContain('m3:warning:one-extended-fab');
      expect(
        issuesOf(
          spec({
            root: {type: 'Html', props: {tag: 'div'}, children: ['a', 'b']},
            a: {type: 'Snackbar', props: {}, children: []},
            b: {type: 'Snackbar', props: {}, children: []},
          }),
        ),
      ).toContain('m3:warning:one-snackbar');
    });
  });

  describe('m3Prompt', () => {
    it('lists the components and the M3 rules with their spec quotes', () => {
      const prompt = m3Prompt();
      expect(prompt).toContain('- Button:');
      expect(prompt).toContain('- NavRail:');
      for (const rule of M3_RULES) expect(prompt).withContext(rule.id).toContain(rule.source.quote);
    });
  });
});
