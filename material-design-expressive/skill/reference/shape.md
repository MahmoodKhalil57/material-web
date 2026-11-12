# shape

Elements: `md-gb-shape`.

## API

### `<md-gb-shape>`

A decorative Material shape that can morph into another.

Source: `material-design-expressive/extras/shape/md-gb-shape.ts`  
Import: `import '@material/web/extras/shape/md-gb-shape.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `color` | `color` (reflects) | `"primary" \| "primary-container" \| "secondary" \| "secondary-container" \| "tertiary" \| "tertiary-container" \| "current" \| "error-container" \| "surface-container-highest"` | `'current'` | The color role of the fill. |
| `delay` | `delay` | `0 \| 1 \| 2 \| 3` | `0` | Starts the loop 1, 2 or 3 quarters later, so shapes don't morph together. |
| `loop` | `loop` (reflects) | `boolean` | `false` | Morphs into `to` and back, in a loop. |
| `morphed` | `morphed` (reflects) | `boolean` | `false` | Shows the `to` shape, morphing into it. |
| `morphOnHover` | `morph-on-hover` | `boolean` | `false` | Morphs into `to` while the surface it decorates is hovered or holds focus (it sets `morphed`): its closest link, button, card, list item, carousel item, summary or focusable ancestor, or else its parent. |
| `shape` | `shape` | `"circle" \| "square" \| "slanted" \| "arch" \| "fan" \| "arrow" \| "semiCircle" \| "oval" \| "pill" \| "triangle" \| "diamond" \| "clamShell" \| "pentagon" \| "gem" \| "sunny" \| "verySunny" \| "cookie4Sided" \| "cookie6Sided" \| "cookie7Sided" \| "cookie9Sided" \| "cookie12Sided" \| "ghostish" \| "clover4Leaf" \| "clover8Leaf" \| "burst" \| "softBurst" \| "boom" \| "softBoom" \| "flower" \| "puffy" \| "puffyDiamond" \| "pixelCircle" \| "pixelTriangle" \| "bun" \| "heart"` | `'circle'` | The Material shape. |
| `size` | `size` | `number` | `48` | The width and height, in pixels. |
| `to` | `to` | `"" \| "circle" \| "square" \| "slanted" \| "arch" \| "fan" \| "arrow" \| "semiCircle" \| "oval" \| "pill" \| "triangle" \| "diamond" \| "clamShell" \| "pentagon" \| "gem" \| "sunny" \| "verySunny" \| "cookie4Sided" \| "cookie6Sided" \| "cookie7Sided" \| "cookie9Sided" \| "cookie12Sided" \| "ghostish" \| "clover4Leaf" \| "clover8Leaf" \| "burst" \| "softBurst" \| "boom" \| "softBoom" \| "flower" \| "puffy" \| "puffyDiamond" \| "pixelCircle" \| "pixelTriangle" \| "bun" \| "heart"` | `''` | The Material shape it morphs into (with `morphed` or `loop`). |

Slots

- default slot: Content centered on the shape.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.

CSS parts

- `::part(shape)`: The SVG of the shape.
