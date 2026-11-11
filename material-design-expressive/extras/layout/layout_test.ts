/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {WINDOW_SIZE_CLASS_VALUES, WINDOW_SIZE_CLASSES} from '../../foundations/layout/layout-values.js';
import {windowSizeClass} from '../../foundations/layout/window-size-class.js';
import './md-gb-grid.js';
import './md-gb-stack.js';
import type {GridElement} from './grid-element.js';
import type {StackElement} from './stack-element.js';

/** A length token's computed value, in px. */
function space(step: string): number {
  const probe = document.createElement('div');
  probe.style.inlineSize = `var(--md-sys-space-${step})`;
  document.body.append(probe);
  const px = probe.getBoundingClientRect().width;
  probe.remove();
  return px;
}

describe('md-gb-grid', () => {
  let grid: GridElement;
  beforeAll(() => adoptStyles(document, [m3Styles]));
  beforeEach(async () => {
    grid = document.createElement('md-gb-grid');
    grid.style.inlineSize = '1000px';
    grid.innerHTML = '<div>1</div><div>2</div><div>3</div><div>4</div>';
    document.body.append(grid);
    await grid.updateComplete;
  });
  afterEach(() => grid.remove());

  const inner = () => grid.shadowRoot!.querySelector('.grid')!;
  const tops = () => [...grid.children].map((c) => Math.round(c.getBoundingClientRect().top));

  it("has the window size class's columns and spacer (grids-spacing, Grids)", () => {
    const {columns, spacer} = WINDOW_SIZE_CLASS_VALUES[windowSizeClass(window.innerWidth)];
    const style = getComputedStyle(inner());
    expect(style.gridTemplateColumns.split(' ').length).toBe(columns);
    expect(style.columnGap).toBe(`${spacer}px`);
  });

  it('has a column count for every window size class: 4, 8 and 12', () => {
    expect(WINDOW_SIZE_CLASSES.map((c) => WINDOW_SIZE_CLASS_VALUES[c].columns)).toEqual([4, 8, 8, 12, 12]);
  });

  it('places each child on `span` columns, so a row holds columns / span children', async () => {
    const {columns} = WINDOW_SIZE_CLASS_VALUES[windowSizeClass(window.innerWidth)];
    grid.span = 4;
    await grid.updateComplete;
    const perRow = columns / 4;
    expect(new Set(tops().slice(0, perRow)).size).withContext('the first row').toBe(1);
    if (perRow < 4) expect(tops()[perRow]).withContext('the next row').toBeGreaterThan(tops()[0]);
  });

  it('spans at most all the columns', async () => {
    grid.span = 12;
    await grid.updateComplete;
    const width = grid.getBoundingClientRect().width;
    for (const child of grid.children) expect(Math.round(child.getBoundingClientRect().width)).toBe(Math.round(width));
  });

  it('reflects span', async () => {
    grid.span = 6;
    await grid.updateComplete;
    expect(grid.getAttribute('span')).toBe('6');
  });
});

describe('md-gb-stack', () => {
  let stack: StackElement;
  beforeAll(() => adoptStyles(document, [m3Styles]));
  beforeEach(async () => {
    stack = document.createElement('md-gb-stack');
    stack.innerHTML = '<div style="block-size: 20px; inline-size: 50px">a</div><div style="block-size: 20px; inline-size: 50px">b</div>';
    document.body.append(stack);
    await stack.updateComplete;
  });
  afterEach(() => stack.remove());

  const [a, b] = [() => stack.children[0].getBoundingClientRect(), () => stack.children[1].getBoundingClientRect()];

  it('stacks its children in a column, 16px (space 200) apart by default', () => {
    expect(b().top - a().bottom).toBe(space('200'));
    expect(b().left).toBe(a().left);
  });

  it('puts them side by side in a row', async () => {
    stack.direction = 'row';
    await stack.updateComplete;
    expect(b().left - a().right).toBe(space('200'));
    expect(b().top).toBe(a().top);
  });

  it('spaces them with the step of the spacing scale it is given', async () => {
    for (const step of ['0', '50', '400', '900'] as const) {
      stack.gap = step;
      await stack.updateComplete;
      expect(b().top - a().bottom).withContext(step).toBe(space(step));
    }
  });

  it('wraps a row onto the next line when it runs out of room', async () => {
    stack.direction = 'row';
    stack.wrap = true;
    stack.style.inlineSize = '80px';
    await stack.updateComplete;
    expect(b().top).toBeGreaterThan(a().top);
  });

  it('pads its block edges with a step of the spacing scale', async () => {
    const top = a().top - stack.getBoundingClientRect().top;
    stack.paddingBlock = '200';
    await stack.updateComplete;
    expect(a().top - stack.getBoundingClientRect().top - top).toBe(space('200'));
    expect(stack.getAttribute('padding-block')).toBe('200');
  });

  it("centers its children without centering their text (no legacy align attribute)", async () => {
    stack.alignItems = 'center';
    await stack.updateComplete;
    expect(stack.hasAttribute('align')).toBeFalse();
    expect(getComputedStyle(stack).textAlign).toBe('start');
  });

  it('aligns and justifies its children', async () => {
    stack.direction = 'row';
    stack.justifyContent = 'end';
    stack.style.inlineSize = '400px';
    await stack.updateComplete;
    expect(Math.round(b().right)).toBe(Math.round(stack.getBoundingClientRect().right));
  });
});
