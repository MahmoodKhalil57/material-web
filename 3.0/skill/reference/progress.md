# progress

Elements: `md-gb-progress`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Progress indicators**
  - Linear, circular
  - Flat, wavy
  - Determinate, indeterminate
  - Token gaps: only the wave wavelength, which is baked into the generated wave paths

## API

### `<md-gb-progress>`

A Material Design component.

Source: `labs/gb/components/progress/md-gb-progress.ts`  
Import: `import '@material/web/labs/gb/components/progress/md-gb-progress.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `circular` | `circular` (reflects) | `boolean` | `false` | Whether the indicator is circular instead of linear. |
| `value` | `value` | `number` |  | Progress from 0 to 1. When set, the indicator is determinate; when unset (the default), it is indeterminate. |
| `wavy` | `wavy` (reflects) | `boolean` | `false` | Whether the active indicator is wavy instead of flat (the default). |

CSS parts

- `::part(indicator)`: The indicator container.

CSS custom properties

- `--active-indicator-color`
- `--active-indicator-thickness`
- `--height`: Linear only.
- `--progress`
- `--size`: Circular only.
- `--stop-indicator-color`
- `--stop-indicator-shape`
- `--stop-indicator-size`
- `--stop-indicator-trailing-space`
- `--track-active-indicator-space`
- `--track-color`
- `--track-shape`
- `--track-thickness`
