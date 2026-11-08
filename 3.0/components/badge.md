# Badge

A badge shows a small dot or a count to signal new or changed information.

**Example: A dot badge, a badge with a count and a badge with a capped count**

```html
<md-gb-badge></md-gb-badge>
<md-gb-badge>3</md-gb-badge>
<md-gb-badge>99+</md-gb-badge>
```

## Usage guidelines

*   **Use a dot for something new.** A badge without content signals new or changed information.
*   **Use a count for a number.** A large badge shows a number, such as unread messages.
*   **Keep counts short.** Content is limited to four characters, including a `+`, so large numbers show as `999+`.
*   **Attach it to an icon.** [Anchor](#anchored) the badge to the top trailing corner of the icon it describes.

## Anatomy

A badge is a single element. Without content it is a dot; with content it is a larger badge.

**Example: A badge with a count of 5**

```html
<md-gb-badge>5</md-gb-badge>
```

## Examples

### Count

Set `value` to show a number. Counts above `max` (999 by default) show as `max+`.

**Example: A badge with a count over the maximum**

```html
<md-gb-badge value="1200"></md-gb-badge>
```

### Anchored

Add `anchored` to place the badge on the top trailing corner of its positioned parent.

**Example: A bell icon with a count badge**

```html
<span style="position: relative; display: inline-flex">
  <md-gb-icon>notifications</md-gb-icon>
  <md-gb-badge anchored>3</md-gb-badge>
</span>
```

## Accessibility

*   A dot badge is announced with its `label`, which defaults to "New notification". Set it to match your content.
*   Place the badge after the label of the destination it belongs to, so it is read in that order.

## API reference

### &lt;md-gb-badge&gt;

A Material Design badge component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>anchored</code><br><span class="gb-desc">Anchors the badge to the top trailing corner of its positioned parent (the icon's bounding box).</span> | <code>anchored</code> | <code>boolean</code> | <code>false</code> |
| <code>label</code><br><span class="gb-desc">Screen reader text for a small (non-counting) badge. Spec: non-counting badges announce "New notification", read after the destination's label.</span> | <code>label</code> | <code>string</code> | <code>'New notification'</code> |
| <code>max</code><br><span class="gb-desc">The largest count shown before it is truncated to <code>max+</code>.</span> | <code>max</code> | <code>number</code> | <code>999</code> |
| <code>value</code><br><span class="gb-desc">A count to display. Counts above <code>max</code> show as <code>max+</code> (spec: limit content to four characters, including a +). Slotted content is shown when unset.</span> | <code>value</code> | <code>number</code> |  |

#### Slots

| Slot | Description |
| --- | --- |
| default | The large badge's label, e.g. a count. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(badge)</code> | The badge container. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-color</code> |  |
| <code>--label-text-color</code> |  |
| <code>--padding-inline</code> |  |
| <code>--shape</code> |  |
| <code>--size</code> |  |
