---
title: Card
section: components
order: 5
description: A card contains content and actions about a single subject.
---
{% demo "An outlined card with a headline, supporting text and two actions" %}
<md-gb-card>
  <h2>Weekend in Lisbon</h2>
  <p>Flights and hotel for 2 nights.</p>
  <md-gb-button color="outlined">Details</md-gb-button>
  <md-gb-button color="filled">Book</md-gb-button>
</md-gb-card>
{% enddemo %}

## Usage guidelines

*   **One subject per card.** A card shows related content and actions about a single topic, arranged so the hierarchy is clear.
*   **Choose a color.** Use [elevated, filled or outlined](#colors) to set how much the card stands out from its background.
*   **Make it an entry point.** An [interactive card](#interactive) can lead to more detail or another page.
*   **Lay out collections.** Cards work in a grid, a vertical list or a carousel.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A card is a container with 16dp of inline padding around its content. The `container` slot replaces its background.

```html
<md-gb-card>
  <div slot="container"></div>
  …
</md-gb-card>
```

## Examples

### Colors

Set `color` to `elevated`, `filled` or `outlined` (default).

{% demo "Elevated, filled and outlined cards" %}
<md-gb-card color="elevated">Elevated</md-gb-card>
<md-gb-card color="filled">Filled</md-gb-card>
<md-gb-card color="outlined">Outlined</md-gb-card>
{% enddemo %}

### Interactive

Add `interactive` to make the whole card a button. Add `href` to make it a link instead, and label it with `aria-label`.

{% demo "A card that links to a details page" %}
<md-gb-card interactive href="/trips/lisbon" aria-label="Open Weekend in Lisbon" color="filled">
  Weekend in Lisbon
</md-gb-card>
{% enddemo %}

### Selectable

Add `selectable` to an interactive card so activating it toggles `selected`. A selected card shows a check mark.

{% demo "A selectable card that starts selected" %}
<md-gb-card interactive selectable selected aria-label="Weekend in Lisbon" color="filled">
  Weekend in Lisbon
</md-gb-card>
{% enddemo %}

### Disabled

A `disabled` card can't be activated.

{% demo "A disabled interactive card" %}
<md-gb-card interactive disabled aria-label="Sold out" color="filled">
  Sold out
</md-gb-card>
{% enddemo %}

## Accessibility

*   An interactive card has the button role, or the link role with `href`. Give it an accessible name with `aria-label` when its content isn't enough.
*   A card that isn't interactive is a plain container and needs no role. Its actions are focusable on their own.
*   Hide purely decorative images from assistive technology.
*   If a card can be dragged, offer a single-pointer alternative such as a menu with move and delete actions.
*   Tab moves to the next card or actionable element, and Enter or Space activates it.

## API reference

{% gbapi "card" %}
