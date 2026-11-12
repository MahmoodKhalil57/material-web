# fab

Elements: `md-gb-fab`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Extended FAB**
  - Colors: primary, secondary, tertiary and their containers
  - Sizes: small, medium, large (from the extended-fab token sets)
  - `expanded` with Compose's springs; collapse on scroll (`scroll-target`)
- **FAB**
  - Sizes: default, medium, large
  - Six color sets
  - Small FAB (`size="sm"`, no longer recommended by the spec)
  - Token file generated from the spec; no gaps

## API

### `<md-gb-fab>`

A Material Design component.

Source: `material-design-expressive/components/fab/md-gb-fab.ts`  
Import: `import '@material/web/components/fab/md-gb-fab.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"primary" \| "primary-container" \| "secondary" \| "secondary-container" \| "tertiary" \| "tertiary-container"` | `'primary-container'` | The color set: `primary-container` (default), `secondary-container`, `tertiary-container`, or the stronger `primary`, `secondary` and `tertiary`. |
| `expanded` | `expanded` | `boolean` | `true` | Whether the extended FAB shows its label. When `false`, the label collapses and the FAB becomes an icon-only FAB. Set the attribute to `expanded="false"` to collapse it from markup. |
| `label` | `label` | `string` | `''` | The extended FAB's label. Without one, the FAB is icon-only. |
| `scrollTarget` | `scroll-target` | `string` | `''` | Opt-in: the `id` of a scroll container (in the same root), or `window`. The FAB collapses while it scrolls down and expands while it scrolls up. |
| `size` | `size` | `"sm" \| "md" \| "lg" \| "default"` | `'default'` | The size. With a `label`, `default`, `md` and `lg` are the small, medium and large extended FABs. `sm` is the small (40dp) icon-only FAB, which the spec no longer recommends. |
| `tooltip` | `tooltip` | `boolean` | `true` | Shows a tooltip with the FAB's name (the `label`, else `aria-label`) on hover and keyboard focus. On by default for an icon-only FAB, whose icon has no visible text (floating-action-button.md: on web, a FAB should display a tooltip with its text label); `tooltip="false"` turns it off. |

Slots

- default slot: The icon. Text placed here is shown but does not collapse; use `label` for an extended FAB.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.

CSS parts

- `::part(fab)`: The FAB's root element.
- `::part(label)`: The extended FAB's label.

CSS custom properties

- `--container-color`
- `--container-elevation`
- `--container-height`
- `--container-shape`
- `--container-width`
- `--icon-color`
- `--icon-label-space`
- `--icon-size`
- `--label-text`
- `--label-text-axes`
- `--label-text-color`
- `--label-text-tracking`
- `--leading-space`
- `--trailing-space`
