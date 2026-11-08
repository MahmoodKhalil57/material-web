# badge

Elements: `md-gb-badge`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Badges**
  - Small (dot), large (count, `max` shows "999+"), screen reader label

## API

### `<md-gb-badge>`

A Material Design badge component.

Source: `labs/gb/components/badge/md-gb-badge.ts`  
Import: `import '@material/web/labs/gb/components/badge/md-gb-badge.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `anchored` | `anchored` (reflects) | `boolean` | `false` | Anchors the badge to the top trailing corner of its positioned parent (the icon's bounding box). |
| `label` | `label` | `string` | `'New notification'` | Screen reader text for a small (non-counting) badge. Spec: non-counting badges announce "New notification", read after the destination's label. |
| `max` | `max` | `number` | `999` | The largest count shown before it is truncated to `max+`. |
| `value` | `value` | `number` |  | A count to display. Counts above `max` show as `max+` (spec: limit content to four characters, including a +). Slotted content is shown when unset. |

Slots

- default slot: The large badge's label, e.g. a count.

CSS parts

- `::part(badge)`: The badge container.

CSS custom properties

- `--container-color`
- `--label-text-color`
- `--padding-inline`
- `--shape`
- `--size`
