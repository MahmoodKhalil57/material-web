# layout

Elements: `md-gb-grid`, `md-gb-stack`.

## API

### `<md-gb-grid>`

The M3 layout grid: columns that adapt across breakpoints.

Source: `material-design-expressive/extras/layout/md-gb-grid.ts`  
Import: `import '@material/web/extras/layout/md-gb-grid.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `span` | `span` (reflects) | `number` | `4` | The number of columns each child spans (1 to 12), at most the window size class's columns. 1, 2, 4 or 12 make full rows at every breakpoint. |

Slots

- default slot: The grid's items.

### `<md-gb-stack>`

A column or row of children spaced with the M3 spacing scale.

Source: `material-design-expressive/extras/layout/md-gb-stack.ts`  
Import: `import '@material/web/extras/layout/md-gb-stack.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `alignItems` | `align-items` (reflects) | `"start" \| "center" \| "end" \| "stretch" \| "baseline"` | `'stretch'` | How the children line up across the stack (CSS align-items). |
| `direction` | `direction` (reflects) | `"column" \| "row"` | `'column'` | Children one below the other (`column`) or side by side (`row`). |
| `gap` | `gap` (reflects) | `"0" \| "25" \| "50" \| "75" \| "100" \| "125" \| "150" \| "175" \| "200" \| "250" \| "300" \| "400" \| "450" \| "500" \| "600" \| "700" \| "800" \| "900"` | `'200'` | The space between children: a step of the spacing scale (200 is 16px). |
| `justifyContent` | `justify-content` (reflects) | `"start" \| "center" \| "end" \| "space-between"` | `'start'` | How the children share the space along the stack (CSS justify-content). |
| `paddingBlock` | `padding-block` (reflects) | `"" \| "0" \| "25" \| "50" \| "75" \| "100" \| "125" \| "150" \| "175" \| "200" \| "250" \| "300" \| "400" \| "450" \| "500" \| "600" \| "700" \| "800" \| "900"` | `''` | Space above and below the children: a step of the spacing scale. In a card, which pads only its sides (16px), 200 gives its content the padding of cards.md Measurements on all sides. |
| `wrap` | `wrap` (reflects) | `boolean` | `false` | Whether a row wraps onto more lines when its children don't fit. |

Slots

- default slot: The stack's items.
