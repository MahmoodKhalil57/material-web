# loadingindicator

Elements: `md-gb-loading-indicator`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Loading indicator**
  - Default, contained
  - Shape morph sequence

## API

### `<md-gb-loading-indicator>`

A Material Design component.

Source: `labs/gb/components/loadingindicator/md-gb-loading-indicator.ts`  
Import: `import '@material/web/labs/gb/components/loadingindicator/md-gb-loading-indicator.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `contained` | `contained` (reflects) | `boolean` | `false` | Whether the indicator has a container. |
| `value` | `value` | `number` |  | Progress from 0 to 1. When set, the indicator is determinate; when unset (the default), it is indeterminate. |

CSS parts

- `::part(indicator)`: The indicator container.

CSS custom properties

- `--active-indicator-color`
- `--active-indicator-size`
- `--container-color`
- `--container-height`
- `--container-shape`
- `--container-width`
- `--progress`
- `--size`: The container size, clamped to 24dp-240dp (48dp default).
