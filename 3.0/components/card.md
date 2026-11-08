# Card

A card contains content and actions about a single subject.

**Example: An outlined card with a headline, supporting text and two actions**

```html
<md-gb-card>
  <h2>Weekend in Lisbon</h2>
  <p>Flights and hotel for 2 nights.</p>
  <md-gb-button color="outlined">Details</md-gb-button>
  <md-gb-button color="filled">Book</md-gb-button>
</md-gb-card>
```

## Usage guidelines

*   **One subject per card.** A card shows related content and actions about a single topic, arranged so the hierarchy is clear.
*   **Choose a color.** Use [elevated, filled or outlined](#colors) to set how much the card stands out from its background.
*   **Make it an entry point.** An [interactive card](#interactive) can lead to more detail or another page.
*   **Lay out collections.** Cards work in a grid, a vertical list or a carousel.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A card is a container with 16dp of inline padding around its content. The `container` slot replaces its background.

**Example: A card with a custom container and content**

```html
<md-gb-card>
  <div slot="container" style="background: var(--md-sys-color-tertiary-container)"></div>
  Lemon pasta, ready in 20 minutes
</md-gb-card>
```

## Examples

### Colors

Set `color` to `elevated`, `filled` or `outlined` (default).

**Example: Elevated, filled and outlined cards**

```html
<md-gb-card color="elevated">Elevated</md-gb-card>
<md-gb-card color="filled">Filled</md-gb-card>
<md-gb-card color="outlined">Outlined</md-gb-card>
```

### Interactive

Add `interactive` to make the whole card a button. Add `href` to make it a link instead, and label it with `aria-label`.

**Example: A card that links to a details page**

```html
<md-gb-card interactive href="/trips/lisbon" aria-label="Open Weekend in Lisbon" color="filled">
  Weekend in Lisbon
</md-gb-card>
```

### Selectable

Add `selectable` to an interactive card so activating it toggles `selected`. A selected card shows a check mark.

**Example: A selectable card that starts selected**

```html
<md-gb-card interactive selectable selected aria-label="Weekend in Lisbon" color="filled">
  Weekend in Lisbon
</md-gb-card>
```

### Disabled

A `disabled` card can't be activated.

**Example: A disabled interactive card**

```html
<md-gb-card interactive disabled aria-label="Sold out" color="filled">
  Sold out
</md-gb-card>
```

## Accessibility

*   An interactive card has the button role, or the link role with `href`. Give it an accessible name with `aria-label` when its content isn't enough.
*   A card that isn't interactive is a plain container and needs no role. Its actions are focusable on their own.
*   Hide purely decorative images from assistive technology.
*   If a card can be dragged, offer a single-pointer alternative such as a menu with move and delete actions.
*   Tab moves to the next card or actionable element, and Enter or Space activates it.

## API reference

### &lt;md-gb-card&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>color</code><br><span class="gb-desc">The color of the card.</span> | <code>color</code> | <code>CardColor</code> | <code>'outlined'</code> |
| <code>disabled</code><br><span class="gb-desc">Whether the card is disabled.</span> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>dragged</code><br><span class="gb-desc">Whether the card is picked up and being dragged (raised elevation). The app moves the card. Spec Cards &gt; Accessibility &gt; Dragging and dismissing (WCAG 2.5.7): also offer a single-pointer alternative, e.g. a menu opened by tapping a "more" button or pressing and holding the card, with move and delete actions (see the "Reorder (drag or menu)" demo). Don't let the menu cover the card.</span> | <code>dragged</code> | <code>boolean</code> | <code>false</code> |
| <code>href</code><br><span class="gb-desc">Makes an interactive card a link (spec: directly actionable cards have the button or link role).</span> | <code>href</code> | <code>string</code> | <code>''</code> |
| <code>interactive</code><br><span class="gb-desc">Whether the card is interactive.</span> | <code>interactive</code> | <code>boolean</code> | <code>false</code> |
| <code>selectable</code><br><span class="gb-desc">Whether an interactive card can be selected: activating it toggles <code>selected</code> (selection.md lists cards among the components that can be selected).</span> | <code>selectable</code> | <code>boolean</code> | <code>false</code> |
| <code>selected</code><br><span class="gb-desc">Whether a <code>selectable</code> card is selected. A selected card shows a check mark and a change in surface color.</span> | <code>selected</code> | <code>boolean</code> | <code>false</code> |
| <code>target</code><br><span class="gb-desc">The link target, when <code>href</code> is set.</span> | <code>target</code> | <code>"" | "_blank" | "_parent" | "_self" | "_top"</code> | <code>''</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display the card's content. The card has 16dp left/right padding; set <code>--padding-inline: 0</code> for full-bleed content. Add padding to content, not the host &lt;md-gb-card&gt; element. |
| <code>container</code> | Used to set a custom background container for the card. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(card)</code> | The card's root element. |
| <code>::part(card-btn)</code> | The card's main action (a button, or a link when <code>href</code> is set), when interactive. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-color</code> |  |
| <code>--container-elevation</code> |  |
| <code>--container-shape</code> |  |
| <code>--disabled-content-opacity</code> |  |
| <code>--outline-color</code> |  |
| <code>--outline-width</code> |  |
| <code>--state-layer-color</code> |  |
