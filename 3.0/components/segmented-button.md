# Segmented button

A segmented button set lets people pick one or several options from two to five segments, such as a time range or a view.

**Example: A single-select set of three segments with Day selected**

```html
<md-gb-segmented-button-set aria-label="Time range">
  <md-gb-segmented-button value="day" selected>Day</md-gb-segmented-button>
  <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
  <md-gb-segmented-button value="month">Month</md-gb-segmented-button>
</md-gb-segmented-button-set>
```

## Usage guidelines

*   **Prefer a connected button group.** Material 3 Expressive no longer recommends segmented buttons; the connected [button group](/material-web/3.0/components/button-group/) has mostly the same function with an updated look.
*   **Keep it to two to five segments.** For more options or more complex choices, use [chips](/material-web/3.0/components/chip/).
*   **Pick the selection mode.** A set is [single-select](#examples) by default; add [multiselect](#multi-select) when people can choose several.
*   **Use icons, labels or both.** Make sure each [icon-only](#icons) segment has an accessible name.

## Anatomy

A segmented button set holds segments. Each segment has a label and an optional icon.

**Example: A segmented button set whose segments have an icon and a label**

```html
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
```

## Examples

### Multi-select

Add `multiselect` to the set so people can select more than one segment. A selected segment shows a checkmark; add `no-checkmark` to a segment to hide it.

**Example: A multi-select set of filters**

```html
<md-gb-segmented-button-set aria-label="Filters" multiselect>
  <md-gb-segmented-button value="vegan" selected>Vegan</md-gb-segmented-button>
  <md-gb-segmented-button value="gluten-free">Gluten free</md-gb-segmented-button>
  <md-gb-segmented-button value="nut-free">Nut free</md-gb-segmented-button>
</md-gb-segmented-button-set>
```

### Icons

Put an `md-gb-icon` in the `icon` slot, with or without a label. An icon-only segment needs an `aria-label`.

**Example: A set of segments with icons and labels, and a set with icons only**

```html
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
```

### Required

In a single-select set, add `required` so a segment always stays selected and the selected one can't be unselected.

**Example: A required single-select set**

```html
<md-gb-segmented-button-set aria-label="Cup size" required>
  <md-gb-segmented-button value="small">Small</md-gb-segmented-button>
  <md-gb-segmented-button value="medium" selected>Medium</md-gb-segmented-button>
  <md-gb-segmented-button value="large">Large</md-gb-segmented-button>
</md-gb-segmented-button-set>
```

### Disabled

Add `disabled` to a segment, or to the set to disable every segment.

**Example: A set with a disabled segment**

```html
<md-gb-segmented-button-set aria-label="Sort by">
  <md-gb-segmented-button value="name" selected>Name</md-gb-segmented-button>
  <md-gb-segmented-button value="date">Date</md-gb-segmented-button>
  <md-gb-segmented-button value="size" disabled>Size</md-gb-segmented-button>
</md-gb-segmented-button-set>
```

### Density

Set `density` on the set from `0` (default, 40px tall) down to `-3` to remove 4px of height per step. Keep it off by default and let people opt in.

**Example: A set at density -2**

```html
<md-gb-segmented-button-set aria-label="Range" density="-2">
  <md-gb-segmented-button value="day" selected>Day</md-gb-segmented-button>
  <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
</md-gb-segmented-button-set>
```

### In a form

The set is form-associated. Give it a `name` and it submits the selected segment's `value`, one entry for each selected segment in a multi-select set. It fires `input` and `change` when people change the selection.

**Example: A form whose segmented button set submits the chosen range**

*HTML*

```html
<form>
  <md-gb-segmented-button-set name="range" aria-label="Time range">
    <md-gb-segmented-button value="day" selected>Day</md-gb-segmented-button>
    <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
  </md-gb-segmented-button-set>
  <output></output>
</form>
```

*JavaScript*

```js
const form = document.querySelector('form');
const output = document.querySelector('output');
const show = () => {
  output.textContent = `range=${new FormData(form).get('range')}`;
};
form.addEventListener('change', show);
show();
```

## Accessibility

*   Give the set an `aria-label` that says what the choice is about.
*   In a single-select set the segments are radios, and in a multi-select set they are checkboxes. Tab enters the set, the arrow keys move between segments, and Space or Enter selects the focused one.
*   Icon-only segments need an `aria-label`.
*   A disabled segment is skipped by the keyboard.

## API reference

### &lt;md-gb-segmented-button&gt;

One segment of a Material Design segmented button set.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>disabled</code><br><span class="gb-desc">Whether the segment is disabled.</span> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>focusable</code><br><span class="gb-desc">Whether the segment is the set's tab stop (roving <code>tabindex</code>). Set by <code>md-gb-segmented-button-set</code>.</span> |  | <code>boolean</code> | <code>true</code> |
| <code>groupDisabled</code><br><span class="gb-desc">Whether the parent set is disabled. Set by <code>md-gb-segmented-button-set</code>.</span> |  | <code>boolean</code> | <code>false</code> |
| <code>label</code><br><span class="gb-desc">Label text, rendered before the default slot's content.</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>mode</code><br><span class="gb-desc">The selection mode of the parent set: <code>radio</code> semantics for <code>single</code>, <code>checkbox</code> for <code>multiple</code>. Set by <code>md-gb-segmented-button-set</code>.</span> |  | <code>SegmentedButtonMode</code> | <code>'single'</code> |
| <code>noCheckmark</code><br><span class="gb-desc">Whether to hide the checkmark that shows when selected.</span> | <code>no-checkmark</code> | <code>boolean</code> | <code>false</code> |
| <code>selected</code><br><span class="gb-desc">Whether the segment is selected.</span> | <code>selected</code> | <code>boolean</code> | <code>false</code> |
| <code>value</code><br><span class="gb-desc">The value submitted with the set's form when selected.</span> | <code>value</code> | <code>string</code> | <code>''</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The label text. |
| <code>icon</code> | An optional leading icon, such as <code>&lt;md-gb-icon&gt;</code>. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(button)</code> | The segment's <code>&lt;button&gt;</code>. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-height</code> | Segment height at density 0. |
| <code>--container-shape</code> | Outer corner radius of the first and last segments. |
| <code>--density-step</code> | Height removed per density step. |
| <code>--icon-label-space</code> | Space between the icon and the label. |
| <code>--icon-size</code> | Icon and checkmark size. |
| <code>--label-text</code> | Label typography. |
| <code>--label-text-axes</code> | Label font variation settings. |
| <code>--label-text-tracking</code> | Label letter spacing. |
| <code>--leading-space</code> | Padding before the content. |
| <code>--min-width</code> | Minimum segment width. |
| <code>--outline-color</code> | Outline color. |
| <code>--outline-width</code> | Outline width. |
| <code>--target-size</code> | Minimum touch target height. |
| <code>--trailing-space</code> | Padding after the content. |

### &lt;md-gb-segmented-button-set&gt;

A Material Design segmented button set.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>density</code><br><span class="gb-desc">The density, from 0 (default, 40px) to -3. Each step down removes 4px from the height. Values are clamped to that range.</span> | <code>density</code> | <code>SegmentedButtonDensity</code> |  |
| <code>multiselect</code><br><span class="gb-desc">Whether more than one segment can be selected.</span> | <code>multiselect</code> | <code>boolean</code> | <code>false</code> |
| <code>required</code><br><span class="gb-desc">In single-select mode, whether a segment must stay selected: the selected segment can't be unselected.</span> | <code>required</code> | <code>boolean</code> | <code>false</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The <code>md-gb-segmented-button</code> segments. |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when the user changes the selection. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when the user changes the selection. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-height</code> | Segment height at density 0. |
| <code>--container-shape</code> | Outer corner radius of the first and last segments. |
| <code>--density-step</code> | Height removed per density step. |
| <code>--icon-label-space</code> | Space between the icon and the label. |
| <code>--icon-size</code> | Icon and checkmark size. |
| <code>--label-text</code> | Label typography. |
| <code>--label-text-axes</code> | Label font variation settings. |
| <code>--label-text-tracking</code> | Label letter spacing. |
| <code>--leading-space</code> | Padding before each segment's content. |
| <code>--min-width</code> | Minimum segment width. |
| <code>--outline-color</code> | Outline color. |
| <code>--outline-width</code> | Outline width. |
| <code>--target-size</code> | Minimum touch target height. |
| <code>--trailing-space</code> | Padding after each segment's content. |
