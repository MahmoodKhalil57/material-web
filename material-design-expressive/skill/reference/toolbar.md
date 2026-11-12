# toolbar

Elements: `md-gb-toolbar`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Toolbars**
  - Docked, floating
  - Standard, vibrant
  - Horizontal, vertical
  - Floating toolbar with FAB, collapsing

## API

### `<md-gb-toolbar>`

A Material Design gBreeze toolbar custom element.

Source: `material-design-expressive/components/toolbar/md-gb-toolbar.ts`  
Import: `import '@material/web/components/toolbar/md-gb-toolbar.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `color` | `color` (reflects) | `"standard" \| "vibrant"` | `'standard'` | The color scheme of the toolbar. |
| `docked` | `docked` (reflects) | `boolean` | `false` | Whether the toolbar is docked across full width. |
| `expanded` | `expanded` (reflects) | `boolean` | `true` | Whether a floating toolbar with a FAB shows its items. When `false`, the toolbar collapses and its FAB grows to the medium size (Compose floating toolbar `expanded`). Set `expanded="false"` from markup. |
| `fabPosition` | `fab-position` (reflects) | `"start" \| "end"` | `'end'` | Which side of a floating toolbar the FAB is on (`end` or `start`). |
| `orientation` | `orientation` (reflects) | `"horizontal" \| "vertical"` | `'horizontal'` | The layout orientation. |
| `overflowMenu` | `overflow-menu` (reflects) | `boolean` | `false` | Whether trailing actions that do not fit move into an overflow menu in the trailing slot (toolbars.md, Adaptive design). On by itself when an `overflow` slot trigger is provided; this turns it on with the default "More actions" button. |
| `scrollBehavior` | `scroll-behavior` (reflects) | `"hide"` |  | How a docked or floating toolbar reacts to scrolling: `hide` slides it beyond the bottom edge when the page scrolls down and back on scroll up (toolbars.md: docked and floating toolbars "can animate offscreen"). |
| `scrollTarget` | `scroll-target` | `string` | `''` | The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. |

Slots

- default slot: Used to display toolbar items (buttons, icon buttons, or custom content).
- `fab`: An optional FAB (`md-gb-fab`) shown next to a floating toolbar, colored by the toolbar's `color` (standard: secondary container, vibrant: tertiary container).
- `leading`: Used to display leading toolbar items.
- `trailing`: Used to display trailing toolbar items.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.

CSS parts

- `::part(toolbar)`: The toolbar's root container.
- `::part(toolbar-with-fab)`: The toolbar and FAB layout, with a FAB.

CSS custom properties

- `--button-container-color`
- `--container-color`
- `--container-elevation`
- `--container-leading-space`
- `--container-shape`
- `--container-spacing`
- `--container-trailing-space`
- `--docked-container-elevation`
- `--docked-container-height`
- `--docked-container-leading-space`
- `--docked-container-max-spacing`
- `--docked-container-min-spacing`
- `--docked-container-shape`
- `--docked-container-trailing-space`
- `--horizontal-container-height`
- `--icon-color`
- `--label-text-color`
- `--min-button-size`
- `--motion-duration`
- `--motion-easing`
- `--selected-button-container-color`
- `--selected-icon-color`
- `--selected-label-text-color`
- `--vertical-container-width`
