# Sliders

Sliders let people view and select a value, or a range of values, along a track.

**Example: A volume slider with a value label**

```html
<md-gb-slider aria-label="Volume" value="50" labeled></md-gb-slider>
```

## Usage guidelines

*   **Show the full range.** A slider should present every value that can be chosen, with `min` and `max` set to match.
*   **Apply the value right away.** Use sliders for settings such as volume or brightness, where people see the effect as they drag.
*   **Pick the variant by the value.** A standard slider fills from the start, a [centered](#centered) slider fills from the middle, and a [range](#range) slider selects two values.

## Anatomy

A slider has a track, a handle, an optional value label and an optional icon.

**Example: A slider with an icon and a value label**

```html
<md-gb-slider aria-label="Volume" value="40" labeled>
  <md-gb-icon slot="icon">volume_up</md-gb-icon>
</md-gb-slider>
```

## Examples

### Stops

Set `step` for a slider that snaps to values, and add `ticks` to show a stop at each one.

**Example: A slider that snaps every 10 with tick marks**

```html
<md-gb-slider aria-label="Brightness" min="0" max="100" step="10" value="50" ticks labeled></md-gb-slider>
```

### Centered

A centered slider starts its active track at the middle of the range, which suits values with a neutral point, such as balance.

**Example: A centered slider from -50 to 50**

```html
<md-gb-slider aria-label="Balance" centered min="-50" max="50" value="0" labeled></md-gb-slider>
```

### Range

Set `range` for two handles. Use `value-start` and `value-end` for the chosen values, and `label-start` and `label-end` to name the handles.

**Example: A price range slider**

```html
<md-gb-slider range min="0" max="100" value-start="25" value-end="75" label-start="Minimum price" label-end="Maximum price" labeled></md-gb-slider>
```

### Icon and size

Put an icon in the `icon` slot to show it inside the track. Sizes run from `xs` (the default) to `xl`.

**Example: A large slider with a volume icon**

```html
<md-gb-slider aria-label="Volume" size="lg" value="60" labeled>
  <md-gb-icon slot="icon">volume_up</md-gb-icon>
</md-gb-slider>
```

### Vertical

Set `orientation="vertical"` for a vertical slider. Range sliders can't be vertical.

**Example: A vertical brightness slider**

```html
<md-gb-slider aria-label="Brightness" orientation="vertical" value="40" labeled></md-gb-slider>
```

### Disabled

A `disabled` slider can't be changed and leaves the focus order.

**Example: A disabled slider**

```html
<md-gb-slider aria-label="Volume" value="30" disabled></md-gb-slider>
```

## Accessibility

*   Name every slider with an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) or a visible label. A range slider names each handle with `label-start` and `label-end`.
*   The handle is a `slider` that exposes its minimum, maximum and value. Set `value-label` (or `value-label-start` and `value-label-end`) when the number alone is unclear: the text is shown on the label and read out, such as "5 minutes".
*   Arrow keys change the value by one step, Page Up and Page Down by a larger amount, and Home and End jump to the ends.

**Example: A slider whose value label reads 5 minutes**

```html
<md-gb-slider aria-label="Timer" min="1" max="60" value="5" value-label="5 minutes" labeled></md-gb-slider>
```

## API reference

### &lt;md-gb-slider&gt;

A Material Design slider component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>ariaLabelEnd</code> | <code>label-end</code> | <code>string</code> | <code>''</code> |
| <code>ariaLabelStart</code> | <code>label-start</code> | <code>string</code> | <code>''</code> |
| <code>ariaValueTextEnd</code> | <code>valuetext-end</code> | <code>string</code> | <code>''</code> |
| <code>ariaValueTextStart</code> | <code>valuetext-start</code> | <code>string</code> | <code>''</code> |
| <code>centered</code> | <code>centered</code> | <code>boolean</code> | <code>false</code> |
| <code>labeled</code> | <code>labeled</code> | <code>boolean</code> | <code>false</code> |
| <code>max</code> | <code>max</code> | <code>number</code> | <code>100</code> |
| <code>min</code> | <code>min</code> | <code>number</code> | <code>0</code> |
| <code>orientation</code><br><span class="gb-desc">The orientation of the slider. Vertical orientation applies to standard, discrete, and centered variants (range is not supported in vertical orientation).</span> | <code>orientation</code> | <code>SliderOrientation</code> | <code>'horizontal'</code> |
| <code>range</code> | <code>range</code> | <code>boolean</code> | <code>false</code> |
| <code>size</code> | <code>size</code> | <code>SliderSize</code> | <code>'xs'</code> |
| <code>step</code> | <code>step</code> | <code>number | "any"</code> | <code>1</code> |
| <code>ticks</code> | <code>ticks</code> | <code>boolean</code> | <code>false</code> |
| <code>value</code> | <code>value</code> | <code>number</code> |  |
| <code>valueEnd</code> | <code>value-end</code> | <code>number</code> |  |
| <code>valueLabel</code> | <code>value-label</code> | <code>string</code> | <code>''</code> |
| <code>valueLabelEnd</code> | <code>value-label-end</code> | <code>string</code> | <code>''</code> |
| <code>valueLabelStart</code> | <code>value-label-start</code> | <code>string</code> | <code>''</code> |
| <code>valueStart</code> | <code>value-start</code> | <code>number</code> |  |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when the slider value commit changes from user interaction. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when the slider value changes from user interaction. |

#### Methods

| Method | Description |
| --- | --- |
| <code>focus</code><br><span class="gb-desc">() =&gt; void</span> | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus) |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--active-handle-leading-space</code> |  |
| <code>--active-track-color</code> |  |
| <code>--active-track-inner-corner-size</code> |  |
| <code>--focus-handle-width</code> |  |
| <code>--handle-color</code> |  |
| <code>--handle-height</code> |  |
| <code>--handle-shape</code> |  |
| <code>--handle-width</code> |  |
| <code>--icon-color</code> |  |
| <code>--icon-color-active</code> |  |
| <code>--icon-size</code> |  |
| <code>--inactive-track-color</code> |  |
| <code>--inactive-track-shape-trailing</code> |  |
| <code>--state-layer-size</code> |  |
| <code>--stop-indicator-color</code> |  |
| <code>--stop-indicator-color-selected</code> |  |
| <code>--stop-indicator-min-spacing</code> |  |
| <code>--stop-indicator-size</code> |  |
| <code>--track-height</code> |  |
| <code>--track-shape</code> |  |
| <code>--value-indicator-bottom-space</code> |  |
| <code>--value-indicator-color</code> |  |
| <code>--value-indicator-label-text-color</code> |  |
| <code>--value-indicator-width</code> |  |
| <code>--with-overlap-handle-outline-color</code> |  |
| <code>--with-overlap-handle-outline-width</code> |  |
