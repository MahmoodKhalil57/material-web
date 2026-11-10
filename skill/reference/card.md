# card

Elements: `md-gb-card`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Cards**
  - Elevated, filled, outlined
  - Interactive (button or link), disabled, dragged

## API

### `<md-gb-card>`

A Material Design component.

Source: `components/card/md-gb-card.ts`  
Import: `import '@material/web/components/card/md-gb-card.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `color` | `color` | `CardColor` | `'outlined'` | The color of the card. |
| `disabled` | `disabled` | `boolean` | `false` | Whether the card is disabled. |
| `dragged` | `dragged` (reflects) | `boolean` | `false` | Whether the card is picked up and being dragged (raised elevation). The app moves the card. Spec Cards > Accessibility > Dragging and dismissing (WCAG 2.5.7): also offer a single-pointer alternative, e.g. a menu opened by tapping a "more" button or pressing and holding the card, with move and delete actions (see the "Reorder (drag or menu)" demo). Don't let the menu cover the card. |
| `href` | `href` | `string` | `''` | Makes an interactive card a link (spec: directly actionable cards have the button or link role). |
| `interactive` | `interactive` | `boolean` | `false` | Whether the card is interactive. |
| `selectable` | `selectable` (reflects) | `boolean` | `false` | Whether an interactive card can be selected: activating it toggles `selected` (selection.md lists cards among the components that can be selected). |
| `selected` | `selected` (reflects) | `boolean` | `false` | Whether a `selectable` card is selected. A selected card shows a check mark and a change in surface color. |
| `target` | `target` | `"" \| "_blank" \| "_parent" \| "_self" \| "_top"` | `''` | The link target, when `href` is set. |

Slots

- default slot: Used to display the card's content. The card has 16dp left/right padding; set `--padding-inline: 0` for full-bleed content. Add padding to content, not the host <md-gb-card> element.
- `container`: Used to set a custom background container for the card.

CSS parts

- `::part(card)`: The card's root element.
- `::part(card-btn)`: The card's main action (a button, or a link when `href` is set), when interactive.

CSS custom properties

- `--container-color`
- `--container-elevation`
- `--container-shape`
- `--disabled-content-opacity`
- `--outline-color`
- `--outline-width`
- `--state-layer-color`
