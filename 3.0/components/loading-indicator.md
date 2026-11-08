# Loading indicator

A loading indicator shows that a short process is running, with a shape that morphs through Material shapes while it turns.

**Example: An indeterminate loading indicator**

```html
<md-gb-loading-indicator aria-label="Loading"></md-gb-loading-indicator>
```

## Usage guidelines

*   **Use it for short waits.** A loading indicator suits processes that finish in under five seconds, and replaces most uses of an indeterminate circular [progress indicator](/material-web/3.0/components/progress/).
*   **Reflect real work.** It always represents an ongoing process and is never only decorative.
*   **Don't switch to determinate.** Avoid it for processes that start indeterminate and later report progress; use a progress indicator there.
*   **Use it for refreshing.** A [pull to refresh](/material-web/3.0/components/pull-to-refresh/) container shows a contained loading indicator.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A loading indicator is one element: a shape, with an optional container behind it.

**Example: A loading indicator**

```html
<md-gb-loading-indicator aria-label="Loading"></md-gb-loading-indicator>
```

## Examples

### Contained

Add `contained` to put the shape on a container, which helps it stand out over content.

**Example: A contained loading indicator**

```html
<md-gb-loading-indicator contained aria-label="Loading"></md-gb-loading-indicator>
```

### Determinate

Set `value` from 0 to 1 to show progress. Without it, the indicator is indeterminate.

**Example: A loading indicator at 40 percent**

```html
<md-gb-loading-indicator value="0.4" aria-label="Downloading"></md-gb-loading-indicator>
```

## Accessibility

*   The indicator is a `progressbar`, so give it an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) that says what is loading.
*   A determinate indicator exposes its value to assistive technology.
*   With reduced motion, the shape stops morphing and only turns slowly.

## API reference

### &lt;md-gb-loading-indicator&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>contained</code><br><span class="gb-desc">Whether the indicator has a container.</span> | <code>contained</code> | <code>boolean</code> | <code>false</code> |
| <code>value</code><br><span class="gb-desc">Progress from 0 to 1. When set, the indicator is determinate; when unset (the default), it is indeterminate.</span> | <code>value</code> | <code>number</code> |  |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(indicator)</code> | The indicator container. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--active-indicator-color</code> |  |
| <code>--active-indicator-size</code> |  |
| <code>--container-color</code> |  |
| <code>--container-height</code> |  |
| <code>--container-shape</code> |  |
| <code>--container-width</code> |  |
| <code>--progress</code> |  |
| <code>--size</code> | The container size, clamped to 24dp-240dp (48dp default). |
