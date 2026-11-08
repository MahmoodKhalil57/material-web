# Progress indicators

Progress indicators inform people about the status of ongoing processes, such as loading an app or submitting a form.

**Example: A linear progress indicator at 50 percent and an indeterminate circular one**

```html
<md-gb-progress value="0.5" aria-label="Upload progress"></md-gb-progress>
<md-gb-progress circular aria-label="Loading"></md-gb-progress>
```

## Usage guidelines

*   **Pick the variant.** Use [linear](#linear) for progress across a page or container and [circular](#circular) for a compact spot such as a button or a card.
*   **Use the same style for the same process.** Keep one configuration for all the instances of a process, like loading.
*   **Show real progress when you know it.** Set a [value](#determinate) for determinate progress, and leave it off when the length of the process is unknown.
*   **Use wavy sparingly.** A [wavy](#wavy) active indicator is more expressive; use it where that fits your product.
*   **For short waits, use a loading indicator.** The [loading indicator](/material-web/3.0/components/loading-indicator/) replaces most indeterminate circular progress indicators.

## Anatomy

A progress indicator is one element: an active indicator over a track. It is linear unless `circular` is set.

**Example: An indeterminate linear progress indicator**

```html
<md-gb-progress aria-label="Loading"></md-gb-progress>
```

## Examples

### Linear

The default indicator animates along a horizontal track.

**Example: An indeterminate and a determinate linear progress indicator**

```html
<md-gb-progress aria-label="Loading"></md-gb-progress>
<md-gb-progress value="0.6" aria-label="Download progress"></md-gb-progress>
```

### Circular

Add `circular` to animate clockwise along a circular track.

**Example: An indeterminate and a determinate circular progress indicator**

```html
<md-gb-progress circular aria-label="Loading"></md-gb-progress>
<md-gb-progress circular value="0.6" aria-label="Download progress"></md-gb-progress>
```

### Determinate

Set `value` from 0 to 1 when you know how far along the process is. Without a `value`, the indicator is indeterminate.

**Example: Linear progress indicators at 25, 50 and 75 percent**

```html
<md-gb-progress value="0.25" aria-label="Step 1 of 4"></md-gb-progress>
<md-gb-progress value="0.5" aria-label="Step 2 of 4"></md-gb-progress>
<md-gb-progress value="0.75" aria-label="Step 3 of 4"></md-gb-progress>
```

### Wavy

Add `wavy` to give the active indicator a wave. It works on linear and circular indicators, determinate or not.

**Example: A wavy linear indicator and a wavy circular indicator**

```html
<md-gb-progress wavy value="0.5" aria-label="Upload progress"></md-gb-progress>
<md-gb-progress circular wavy aria-label="Loading"></md-gb-progress>
```

## Accessibility

*   A progress indicator is a `progressbar`. Give it an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) that says what is in progress, such as "Download progress".
*   A determinate indicator exposes its value from 0 to 100 to assistive technology. An indeterminate one has no value.

**Example: A progress indicator labelled Download progress**

```html
<md-gb-progress value="0.5" aria-label="Download progress"></md-gb-progress>
```

## API reference

### &lt;md-gb-progress&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>circular</code><br><span class="gb-desc">Whether the indicator is circular instead of linear.</span> | <code>circular</code> | <code>boolean</code> | <code>false</code> |
| <code>value</code><br><span class="gb-desc">Progress from 0 to 1. When set, the indicator is determinate; when unset (the default), it is indeterminate.</span> | <code>value</code> | <code>number</code> |  |
| <code>wavy</code><br><span class="gb-desc">Whether the active indicator is wavy instead of flat (the default).</span> | <code>wavy</code> | <code>boolean</code> | <code>false</code> |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(indicator)</code> | The indicator container. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--active-indicator-color</code> |  |
| <code>--active-indicator-thickness</code> |  |
| <code>--height</code> | Linear only. |
| <code>--progress</code> |  |
| <code>--size</code> | Circular only. |
| <code>--stop-indicator-color</code> |  |
| <code>--stop-indicator-shape</code> |  |
| <code>--stop-indicator-size</code> |  |
| <code>--stop-indicator-trailing-space</code> |  |
| <code>--track-active-indicator-space</code> |  |
| <code>--track-color</code> |  |
| <code>--track-shape</code> |  |
| <code>--track-thickness</code> |  |
