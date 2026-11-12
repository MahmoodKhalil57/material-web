# demo

Elements: `md-gb-demo`, `md-gb-demo-code`.

## API

### `<md-gb-demo>`

An example and its code.

Source: `material-design-expressive/extras/demo/md-gb-demo.ts`  
Import: `import '@material/web/extras/demo/md-gb-demo.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `expanded` | `expanded` (reflects) | `boolean` | `false` | Whether long code shows in full. |
| `label` | `label` | `string` | `''` | The accessible name of the demo (what it shows). |
| `previewHeight` | `preview-height` | `number` | `0` | The block size the preview reserves (px), so the page doesn't move as it loads. A `srcdoc` frame starts at this height (not the browser's default 150px), until its document posts its own: give its exact height and the page doesn't move at all. |
| `sandbox` | `sandbox` | `string` | `'allow-scripts allow-forms'` | The `sandbox` of the `srcdoc` frame. By default scripts and forms run in an opaque origin, so the document can't reach the page, and it can only load cross-origin resources that send CORS headers. Add `allow-same-origin` only for documents you trust, such as your own examples: they then share the page's origin, cache and fonts. |
| `srcdoc` | `srcdoc` | `string` | `''` | A document to show as the example instead of the slotted elements (an example with its own script or styles): it renders in a sandboxed iframe, sized to the height it posts. |

Slots

- default slot: The example: elements, or an iframe.
- `code`: The code: one `md-gb-demo-code` per file.

Events

- `copy` (`CustomEvent<{code: string}>`): Fired when the code is copied. --bubbles --composed

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.

CSS parts

- `::part(code)`: The code's container.
- `::part(preview)`: The example's container.

### `<md-gb-demo-code>`

One highlighted file of a demo's code.

Source: `material-design-expressive/extras/demo/md-gb-demo-code.ts`  
Import: `import '@material/web/extras/demo/md-gb-demo-code.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `code` | `code` | `string` | `''` | The code, as plain text. |
| `collapsed` | `collapsed` (reflects) | `boolean` | `false` | Whether only the first lines show (the demo's Show code expands it). |
| `label` | `label` | `string` | `''` | The file's name in the demo's tabs (default: the language). |
| `language` | `language` (reflects) | `string` | `'html'` | Its language: `html`, `css`, `js` or `ts` (others aren't highlighted). |

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.

CSS custom properties

- `--max-lines`: Lines shown while the demo collapses its code.
