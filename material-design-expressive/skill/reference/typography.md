# typography

Elements: `md-gb-typography`.

## API

### `<md-gb-typography>`

Text in one role of the M3 type scale and a color role.

Source: `material-design-expressive/extras/typography/md-gb-typography.ts`  
Import: `import '@material/web/extras/typography/md-gb-typography.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `color` | `color` (reflects) | `"primary" \| "secondary" \| "tertiary" \| "inherit" \| "on-surface" \| "on-surface-variant" \| "error"` | `'inherit'` | The color role of the text. |
| `emphasized` | `emphasized` (reflects) | `boolean` | `false` | Whether to use the role's emphasized style (a heavier weight). |
| `scale` | `scale` (reflects) | `"display-lg" \| "display-md" \| "display-sm" \| "headline-lg" \| "headline-md" \| "headline-sm" \| "title-lg" \| "title-md" \| "title-sm" \| "label-lg" \| "label-md" \| "label-sm" \| "body-lg" \| "body-md" \| "body-sm"` | `'body-md'` | The role of the type scale. |

Slots

- default slot: The text, or a heading or paragraph with the text.
