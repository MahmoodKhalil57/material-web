# Floating action button (FAB)

A FAB represents the most important action on a screen, and an extended FAB adds a text label.

**Example: A FAB with an edit icon**

```html
<md-gb-fab aria-label="Compose">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-fab>
```

## Usage guidelines

*   **One main action.** Use a FAB for the most important action on a screen. It floats in front of other content.
*   **Pick a size.** Choose by visual hierarchy: the default FAB, a medium FAB (most recommended) or a [large FAB](#sizes).
*   **Add a label for emphasis.** An [extended FAB](#extended) shows a text label next to its icon. It can [collapse](#collapse-on-scroll) while a page scrolls.
*   **Place it consistently.** A FAB can sit at the start, center or end, above a navigation bar or nested in it.

## Anatomy

A FAB holds an icon in its default slot. Set `label` to make it an extended FAB.

**Example: A FAB with a share icon**

```html
<md-gb-fab aria-label="Share">
  <md-gb-icon>share</md-gb-icon>
</md-gb-fab>
```

## Examples

### Extended

Set `label` for an extended FAB. The label is its accessible name.

**Example: An extended FAB with an icon and the label Compose**

```html
<md-gb-fab label="Compose">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-fab>
```

### Without an icon

An extended FAB is the only FAB that can leave out its icon.

**Example: An extended FAB with only a label**

```html
<md-gb-fab label="Reroute"></md-gb-fab>
```

### Colors

Set `color` to `primary`, `primary-container` (default), `secondary`, `secondary-container`, `tertiary` or `tertiary-container`.

**Example: FABs in primary, secondary and tertiary container colors**

```html
<md-gb-fab color="primary-container" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
<md-gb-fab color="secondary-container" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
<md-gb-fab color="tertiary-container" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
```

### Sizes

Set `size` to `md` or `lg`. The default is the standard FAB. `sm` is a 40dp FAB that the spec no longer recommends.

**Example: A default, a medium and a large FAB**

```html
<md-gb-fab aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
<md-gb-fab size="md" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
<md-gb-fab size="lg" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
```

### Collapsed

Set `expanded="false"` to collapse an extended FAB to an icon-only FAB. Set the `expanded` property to change it later.

**Example: A collapsed extended FAB**

```html
<md-gb-fab label="Compose" expanded="false">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-fab>
```

### Collapse on scroll

Set `scroll-target` to the id of a scrolling container, or `window`. The FAB collapses while it scrolls down and expands while it scrolls up. A cancelable `toggle` event fires first.

**Example: An extended FAB that collapses while its list scrolls down**

*HTML*

```html
<div id="content">
  <p>Message 1</p>
  <p>Message 2</p>
  <p>Message 3</p>
  <p>Message 4</p>
  <p>Message 5</p>
  <p>Message 6</p>
  <p>Message 7</p>
  <p>Message 8</p>
  <md-gb-fab label="Compose" scroll-target="content">
    <md-gb-icon>edit</md-gb-icon>
  </md-gb-fab>
</div>
```

*CSS*

```css
#content {
  inline-size: 100%;
  block-size: 240px;
  overflow: auto;
}

md-gb-fab {
  position: sticky;
  inset-block-end: 16px;
}
```

## Accessibility

*   An icon-only FAB needs an `aria-label` that describes its action, such as "Compose a new message".
*   An extended FAB uses its `label` as its name, also while collapsed. Add `aria-label` only for more context.
*   An icon-only FAB shows a tooltip on hover and focus. Set `tooltip="false"` to turn it off.
*   A FAB fixed over scrolling content shouldn't hide focused elements. Register it with `setupScrollPadding()` from `appbar/scroll-padding.js`.
*   Tab focuses the FAB, and Enter or Space activates it.

## API reference

### &lt;md-gb-fab&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>color</code> | <code>color</code> | <code>FabColor</code> | <code>'primary-container'</code> |
| <code>expanded</code><br><span class="gb-desc">Whether the extended FAB shows its label. When <code>false</code>, the label collapses and the FAB becomes an icon-only FAB. Set the attribute to <code>expanded="false"</code> to collapse it from markup.</span> | <code>expanded</code> | <code>boolean</code> | <code>true</code> |
| <code>label</code><br><span class="gb-desc">The extended FAB's label. Without one, the FAB is icon-only.</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>scrollTarget</code><br><span class="gb-desc">Opt-in: the <code>id</code> of a scroll container (in the same root), or <code>window</code>. The FAB collapses while it scrolls down and expands while it scrolls up.</span> | <code>scroll-target</code> | <code>string</code> | <code>''</code> |
| <code>size</code><br><span class="gb-desc">The size. With a <code>label</code>, <code>default</code>, <code>md</code> and <code>lg</code> are the small, medium and large extended FABs. <code>sm</code> is the small (40dp) icon-only FAB, which the spec no longer recommends.</span> | <code>size</code> | <code>FabSize</code> | <code>'default'</code> |
| <code>tooltip</code><br><span class="gb-desc">Shows a tooltip with the FAB's name (the <code>label</code>, else <code>aria-label</code>) on hover and keyboard focus. On by default for an icon-only FAB, whose icon has no visible text (floating-action-button.md: on web, a FAB should display a tooltip with its text label); <code>tooltip="false"</code> turns it off.</span> | <code>tooltip</code> | <code>boolean</code> | <code>true</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The icon. Text placed here is shown but does not collapse; use <code>label</code> for an extended FAB. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(fab)</code> | The FAB's root element. |
| <code>::part(label)</code> | The extended FAB's label. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-color</code> |  |
| <code>--container-elevation</code> |  |
| <code>--container-height</code> |  |
| <code>--container-shape</code> |  |
| <code>--container-width</code> |  |
| <code>--icon-color</code> |  |
| <code>--icon-label-space</code> |  |
| <code>--icon-size</code> |  |
| <code>--label-text</code> |  |
| <code>--label-text-axes</code> |  |
| <code>--label-text-color</code> |  |
| <code>--label-text-tracking</code> |  |
| <code>--leading-space</code> |  |
| <code>--trailing-space</code> |  |
