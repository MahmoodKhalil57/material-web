# Divider

A divider is a thin line that groups content in lists and containers.

**Example: A divider between two paragraphs**

```html
<p>Your order has shipped.</p>
<md-gb-divider></md-gb-divider>
<p>Delivery is expected on Friday.</p>
```

## Usage guidelines

*   **Group and create hierarchy.** Dividers visually group components and can imply a parent and child relationship.
*   **Full width for sections.** Use [full-width](#insets) dividers to separate larger sections of unrelated content.
*   **Inset for related items.** Use [inset dividers](#insets) to separate related content within a section, such as items in a list.
*   **Don't overuse.** Spacing and type styles often separate content well enough on their own.

## Anatomy

A divider is a single element.

**Example: A divider between two list rows**

```html
<p>Inbox</p>
<md-gb-divider></md-gb-divider>
<p>Sent</p>
```

## Examples

### Insets

Add `inset` to indent both ends by 16dp. Use `inset-start` or `inset-end` to indent only one end.

**Example: A full-width divider, a start-inset divider and a middle-inset divider**

```html
<md-gb-divider></md-gb-divider>
<md-gb-divider inset-start></md-gb-divider>
<md-gb-divider inset></md-gb-divider>
```

### Vertical

Add `vertical` for a divider between side-by-side content.

**Example: A vertical divider between two labels**

```html
<div style="display: flex; align-items: center; gap: 8px">
  <span>Day</span>
  <md-gb-divider vertical></md-gb-divider>
  <span>Week</span>
</div>
```

### Class API

For plain HTML, the divider classes style a native `<hr>`. `divider()` is a Lit directive that adds them, and `dividerClasses()` returns them for other code. Pass `{vertical: true}` for a vertical divider.

**Example: A native hr styled as a vertical divider with the divider classes**

*HTML*

```html
<span>Day</span>
<hr id="rule">
<span>Week</span>
```

*CSS*

```css
@import '@material/web/labs/gb/components/divider/divider.css';

#rule {
  align-self: stretch;
}
```

*TypeScript*

```ts
import {dividerClasses} from '@material/web/labs/gb/components/divider/divider.js';

const classes = dividerClasses({vertical: true});
document.querySelector('#rule')!.className = Object.keys(classes)
  .filter((name) => classes[name])
  .join(' ');
```

## Accessibility

*   A divider is decorative and not announced by assistive technology. It has no contrast minimum.
*   Add `role="separator"` to a divider that should be announced.

**Example: A divider announced as a separator**

```html
<p>Account</p>
<md-gb-divider role="separator"></md-gb-divider>
<p>Privacy</p>
```

## API reference

### &lt;md-gb-divider&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>inset</code><br><span class="gb-desc">Indents both ends 16dp (spec: middle-inset divider).</span> | <code>inset</code> | <code>boolean</code> | <code>false</code> |
| <code>insetEnd</code><br><span class="gb-desc">Indents the trailing end 16dp.</span> | <code>inset-end</code> | <code>boolean</code> | <code>false</code> |
| <code>insetStart</code><br><span class="gb-desc">Indents the leading end 16dp (spec: inset divider).</span> | <code>inset-start</code> | <code>boolean</code> | <code>false</code> |
| <code>vertical</code><br><span class="gb-desc">Whether or not the divider is vertical.</span> | <code>vertical</code> | <code>boolean</code> | <code>false</code> |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(divider)</code> | The divider element. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--color</code> |  |
| <code>--inset-leading-space</code> |  |
| <code>--inset-trailing-space</code> |  |
| <code>--thickness</code> |  |
