---
title: Sliders
section: components
category: other
order: 30
summary: Pick a value from a range by dragging
description: Sliders let people view and select a value, or a range of values, along a track.
---
{% demo "A volume slider with a value label" %}
<md-gb-slider aria-label="Volume" value="50" labeled></md-gb-slider>
{% enddemo %}

{% gbshadcn "slider" %}

## Usage guidelines

*   **Show the full range.** A slider should present every value that can be chosen, with `min` and `max` set to match.
*   **Apply the value right away.** Use sliders for settings such as volume or brightness, where people see the effect as they drag.
*   **Pick the variant by the value.** A standard slider fills from the start, a [centered](#centered) slider fills from the middle, and a [range](#range) slider selects two values.

## Anatomy

A slider has a track, a handle, an optional value label and an optional icon.

{% demo "A slider with an icon and a value label" %}
<md-gb-slider aria-label="Volume" value="40" labeled>
  <md-gb-icon slot="icon">volume_up</md-gb-icon>
</md-gb-slider>
{% enddemo %}

## Examples

### Stops

Set `step` for a slider that snaps to values, and add `ticks` to show a stop at each one.

{% demo "A slider that snaps every 10 with tick marks" %}
<md-gb-slider aria-label="Brightness" min="0" max="100" step="10" value="50" ticks labeled></md-gb-slider>
{% enddemo %}

### Centered

A centered slider starts its active track at the middle of the range, which suits values with a neutral point, such as balance.

{% demo "A centered slider from -50 to 50" %}
<md-gb-slider aria-label="Balance" centered min="-50" max="50" value="0" labeled></md-gb-slider>
{% enddemo %}

### Range

Set `range` for two handles. Use `value-start` and `value-end` for the chosen values, and `label-start` and `label-end` to name the handles.

{% demo "A price range slider" %}
<md-gb-slider range min="0" max="100" value-start="25" value-end="75" label-start="Minimum price" label-end="Maximum price" labeled></md-gb-slider>
{% enddemo %}

### Icon and size

Put an icon in the `icon` slot to show it inside the track. Sizes run from `xs` (the default) to `xl`.

{% demo "A large slider with a volume icon" %}
<md-gb-slider aria-label="Volume" size="lg" value="60" labeled>
  <md-gb-icon slot="icon">volume_up</md-gb-icon>
</md-gb-slider>
{% enddemo %}

### Vertical

Set `orientation="vertical"` for a vertical slider. Range sliders can't be vertical.

{% demo "A vertical brightness slider" %}
<md-gb-slider aria-label="Brightness" orientation="vertical" value="40" labeled></md-gb-slider>
{% enddemo %}

### Disabled

A `disabled` slider can't be changed and leaves the focus order.

{% demo "A disabled slider" %}
<md-gb-slider aria-label="Volume" value="30" disabled></md-gb-slider>
{% enddemo %}

## Accessibility

*   Name every slider with an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) or a visible label. A range slider names each handle with `label-start` and `label-end`.
*   The handle is a `slider` that exposes its minimum, maximum and value. Set `value-label` (or `value-label-start` and `value-label-end`) when the number alone is unclear: the text is shown on the label and read out, such as "5 minutes".
*   Arrow keys change the value by one step, Page Up and Page Down by a larger amount, and Home and End jump to the ends.

{% demo "A slider whose value label reads 5 minutes" %}
<md-gb-slider aria-label="Timer" min="1" max="60" value="5" value-label="5 minutes" labeled></md-gb-slider>
{% enddemo %}

## API reference

{% gbapi "slider" %}
