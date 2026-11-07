# buttongroup

Elements: `md-gb-button-group`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Button groups**
  - Standard, connected
  - Sizes xs–xl
  - Selection: none, single, multiple
  - Token gaps: none

## API

### `<md-gb-button-group>`

A Material Design button group.

Source: `labs/gb/components/buttongroup/md-gb-button-group.ts`  
Import: `import '@material/web/labs/gb/components/buttongroup/md-gb-button-group.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | `density` (reflects) | `Density` |  | The density of the buttons inside, from 0 (default) to -3. Each step down removes 4px from the buttons' height (button-groups.md: "Button groups adapt to the height of the buttons inside, including when density is applied"); touch targets stay 48px. A button's own non-zero `density` wins. Values are clamped to that range. |
| `disabled` | `disabled` (reflects) | `boolean` | `false` | Whether the button group is disabled. |
| `overflowMenu` | `overflow-menu` (reflects) | `boolean` | `false` | Whether the buttons at the trailing edge that do not fit collapse into a trailing overflow menu, and come back when the group has room again (button-groups.md, Adaptive design: "Buttons at the trailing edge of the button group can be customized to collapse into an overflow menu at smaller breakpoints, and become visible again at larger sizes."). The group is as wide as its container allows: give it a width, or put it in a narrower container, to make buttons overflow. Choosing a menu entry clicks the original button. |
| `required` | `required` (reflects) | `boolean` | `false` | Whether selection is required in single-select mode. |
| `resizing` | `resizing` (reflects) | `ButtonGroupResizing` | `""` | How the group and its buttons resize (button-groups.md, Resizing). `fixed`: every button keeps the width its own size and width give it. `flexible`: the group fills the width of its container and its buttons grow with it; an icon button does not stretch past its set width, and a button with `resizing="fixed"` keeps its width. A button with `resizing="flexible"` in a fixed group grows when the group is given more width. Unset: a connected group is flexible (it spans its surface), a standard group is fixed. |
| `selection` | `selection` (reflects) | `ButtonGroupSelection` | `"none"` | The selection mode. |
| `variant` | `variant` (reflects) | `ButtonGroupVariant` | `"standard"` | The visual variant of the button group. |

Slots

- default slot: Used to display buttons.
- `overflow`: Replaces the default overflow button (see `overflowMenu`).

Events

- `change` (`Event`): Fired when selection changes. --bubbles
- `input` (`InputEvent`): Fired when selection changes. --bubbles --composed

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.

CSS custom properties

- `--between-space`
- `--density-step`: Button height removed per density step.
- `--inner-corner-size`
- `--motion-spring-fast-spatial`
- `--motion-spring-fast-spatial-duration`
- `--outer-corner-size`
- `--outer-corner-square-size`
- `--pressed-inner-corner-size`
- `--pressed-item-width-multiplier`
