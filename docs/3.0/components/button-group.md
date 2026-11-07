---
title: Button Group
section: components
order: 3
description: A button group arranges related buttons and can manage their selection, density and overflow.
---
{% demo "A standard button group of three buttons" %}
<md-gb-button-group aria-label="Text alignment">
  <md-gb-button color="tonal">Left</md-gb-button>
  <md-gb-button color="tonal">Center</md-gb-button>
  <md-gb-button color="tonal">Right</md-gb-button>
</md-gb-button-group>
{% enddemo %}

## Usage guidelines

*   **Choose standard or connected.** In a standard group, buttons respond to the one that is pressed; a [connected group](#connected) joins them into one control.
*   **Keep buttons alike.** Use the same size and shape for every button, and mix sizes only for hero moments.
*   **Group related buttons.** Mix colors and widths to emphasize what matters and to group related actions.
*   **Let it adapt.** On narrow screens, trailing buttons can collapse into an [overflow menu](#overflow-menu).

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A button group holds `md-gb-button` elements, each with an optional icon.

```html
<md-gb-button-group>
  <md-gb-button>
    <md-gb-icon></md-gb-icon>
  </md-gb-button>
  …
</md-gb-button-group>
```

## Examples

### Connected

Set `variant="connected"` for buttons that sit together as a single control.

{% demo "A connected button group" %}
<md-gb-button-group variant="connected" aria-label="View">
  <md-gb-button color="outlined">Day</md-gb-button>
  <md-gb-button color="outlined">Week</md-gb-button>
  <md-gb-button color="outlined">Month</md-gb-button>
</md-gb-button-group>
{% enddemo %}

### Selection

Set `selection` to `single` or `multiple` and give each button a `value`. Add `required` to keep one selected in a single-select group. A group fires `input` and `change` when selection changes.

{% demo "A single-select button group with Week selected" %}
<md-gb-button-group variant="connected" selection="single" required aria-label="View">
  <md-gb-button value="day" color="outlined">Day</md-gb-button>
  <md-gb-button value="week" color="outlined" selected>Week</md-gb-button>
  <md-gb-button value="month" color="outlined">Month</md-gb-button>
</md-gb-button-group>
{% enddemo %}

### Icons

Buttons in a group can be icon-only. Give each one an `aria-label`.

{% demo "A button group of icon buttons" %}
<md-gb-button-group aria-label="Reactions">
  <md-gb-button color="tonal" aria-label="Like">
    <md-gb-icon>thumb_up</md-gb-icon>
  </md-gb-button>
  <md-gb-button color="tonal" aria-label="Favorite">
    <md-gb-icon>favorite</md-gb-icon>
  </md-gb-button>
  <md-gb-button color="tonal" aria-label="Share">
    <md-gb-icon>share</md-gb-icon>
  </md-gb-button>
</md-gb-button-group>
{% enddemo %}

### Density

Set `density` from 0 (default) to -3 to make the buttons shorter. Touch targets stay 48px.

{% demo "A button group with density -2" %}
<md-gb-button-group density="-2" aria-label="Text alignment">
  <md-gb-button color="tonal">Left</md-gb-button>
  <md-gb-button color="tonal">Center</md-gb-button>
  <md-gb-button color="tonal">Right</md-gb-button>
</md-gb-button-group>
{% enddemo %}

### Overflow menu

Add `overflow-menu` to collapse the buttons that don't fit into a menu at the trailing edge. Choosing a menu entry clicks the original button.

{% demo "A button group with an overflow menu in a narrow container" %}
<md-gb-button-group overflow-menu aria-label="Actions" style="width: 240px">
  <md-gb-button color="tonal">Copy</md-gb-button>
  <md-gb-button color="tonal">Paste</md-gb-button>
  <md-gb-button color="tonal">Cut</md-gb-button>
  <md-gb-button color="tonal">Delete</md-gb-button>
</md-gb-button-group>
{% enddemo %}

## Accessibility

*   The group does not need a label of its own, but a name such as `aria-label="Text alignment"` helps when the buttons form a set.
*   Label each button as you would a [button](/3.0/components/button/); icon-only buttons need `aria-label`.
*   Tab enters the group, Arrow keys move between buttons, and Enter or Space activates the focused button.

## API reference

{% gbapi "buttongroup" %}
