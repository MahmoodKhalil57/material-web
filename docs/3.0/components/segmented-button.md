---
title: Segmented button
section: components
category: buttons
order: 6
summary: Switch between options in a connected row
description: A segmented button set lets people pick one or several options from two to five segments, such as a time range or a view.
---
{% demo "A single-select set of three segments with Day selected" %}
<md-gb-segmented-button-set aria-label="Time range">
  <md-gb-segmented-button value="day" selected>Day</md-gb-segmented-button>
  <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
  <md-gb-segmented-button value="month">Month</md-gb-segmented-button>
</md-gb-segmented-button-set>
{% enddemo %}

## Usage guidelines

*   **Prefer a connected button group.** Material 3 Expressive no longer recommends segmented buttons; the connected [button group](/3.0/components/button-group/) has mostly the same function with an updated look.
*   **Keep it to two to five segments.** For more options or more complex choices, use [chips](/3.0/components/chip/).
*   **Pick the selection mode.** A set is [single-select](#examples) by default; add [multiselect](#multi-select) when people can choose several.
*   **Use icons, labels or both.** Make sure each [icon-only](#icons) segment has an accessible name.

## Anatomy

A segmented button set holds segments. Each segment has a label and an optional icon.

{% demo "A segmented button set whose segments have an icon and a label" %}
<md-gb-segmented-button-set aria-label="View">
  <md-gb-segmented-button selected>
    <md-gb-icon slot="icon">view_list</md-gb-icon>
    List
  </md-gb-segmented-button>
  <md-gb-segmented-button>
    <md-gb-icon slot="icon">grid_view</md-gb-icon>
    Grid
  </md-gb-segmented-button>
</md-gb-segmented-button-set>
{% enddemo %}

## Examples

### Multi-select

Add `multiselect` to the set so people can select more than one segment. A selected segment shows a checkmark; add `no-checkmark` to a segment to hide it.

{% demo "A multi-select set of filters" %}
<md-gb-segmented-button-set aria-label="Filters" multiselect>
  <md-gb-segmented-button value="vegan" selected>Vegan</md-gb-segmented-button>
  <md-gb-segmented-button value="gluten-free">Gluten free</md-gb-segmented-button>
  <md-gb-segmented-button value="nut-free">Nut free</md-gb-segmented-button>
</md-gb-segmented-button-set>
{% enddemo %}

### Icons

Put an `md-gb-icon` in the `icon` slot, with or without a label. An icon-only segment needs an `aria-label`.

{% demo "A set of segments with icons and labels, and a set with icons only" %}
<md-gb-segmented-button-set aria-label="Layout">
  <md-gb-segmented-button value="list" selected>
    <md-gb-icon slot="icon">view_list</md-gb-icon>
    List
  </md-gb-segmented-button>
  <md-gb-segmented-button value="grid">
    <md-gb-icon slot="icon">grid_view</md-gb-icon>
    Grid
  </md-gb-segmented-button>
</md-gb-segmented-button-set>
<md-gb-segmented-button-set aria-label="Text alignment">
  <md-gb-segmented-button value="left" selected aria-label="Left">
    <md-gb-icon slot="icon">format_align_left</md-gb-icon>
  </md-gb-segmented-button>
  <md-gb-segmented-button value="center" aria-label="Center">
    <md-gb-icon slot="icon">format_align_center</md-gb-icon>
  </md-gb-segmented-button>
  <md-gb-segmented-button value="right" aria-label="Right">
    <md-gb-icon slot="icon">format_align_right</md-gb-icon>
  </md-gb-segmented-button>
</md-gb-segmented-button-set>
{% enddemo %}

### Required

In a single-select set, add `required` so a segment always stays selected and the selected one can't be unselected.

{% demo "A required single-select set" %}
<md-gb-segmented-button-set aria-label="Cup size" required>
  <md-gb-segmented-button value="small">Small</md-gb-segmented-button>
  <md-gb-segmented-button value="medium" selected>Medium</md-gb-segmented-button>
  <md-gb-segmented-button value="large">Large</md-gb-segmented-button>
</md-gb-segmented-button-set>
{% enddemo %}

### Disabled

Add `disabled` to a segment, or to the set to disable every segment.

{% demo "A set with a disabled segment" %}
<md-gb-segmented-button-set aria-label="Sort by">
  <md-gb-segmented-button value="name" selected>Name</md-gb-segmented-button>
  <md-gb-segmented-button value="date">Date</md-gb-segmented-button>
  <md-gb-segmented-button value="size" disabled>Size</md-gb-segmented-button>
</md-gb-segmented-button-set>
{% enddemo %}

### Density

Set `density` on the set from `0` (default, 40px tall) down to `-3` to remove 4px of height per step. Keep it off by default and let people opt in.

{% demo "A set at density -2" %}
<md-gb-segmented-button-set aria-label="Range" density="-2">
  <md-gb-segmented-button value="day" selected>Day</md-gb-segmented-button>
  <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
</md-gb-segmented-button-set>
{% enddemo %}

### In a form

The set is form-associated. Give it a `name` and it submits the selected segment's `value`, one entry for each selected segment in a multi-select set. It fires `input` and `change` when people change the selection.

{% demo "A form whose segmented button set submits the chosen range" height=120 %}
```html
<form>
  <md-gb-segmented-button-set name="range" aria-label="Time range">
    <md-gb-segmented-button value="day" selected>Day</md-gb-segmented-button>
    <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
  </md-gb-segmented-button-set>
  <output></output>
</form>
```
```js
const form = document.querySelector('form');
const output = document.querySelector('output');
const show = () => {
  output.textContent = `range=${new FormData(form).get('range')}`;
};
form.addEventListener('change', show);
show();
```
{% enddemo %}

## Accessibility

*   Give the set an `aria-label` that says what the choice is about.
*   In a single-select set the segments are radios, and in a multi-select set they are checkboxes. Tab enters the set, the arrow keys move between segments, and Space or Enter selects the focused one.
*   Icon-only segments need an `aria-label`.
*   A disabled segment is skipped by the keyboard.

## API reference

{% gbapi "segmentedbutton" %}
