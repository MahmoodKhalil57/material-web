# Checkbox

Checkboxes let people select one or more items from a set, or turn an option on or off.

**Example: A checkbox with the label Remember me**

```html
<label>
  <md-gb-checkbox></md-gb-checkbox>
  Remember me
</label>
```

## Usage guidelines

*   **Select from a set.** Use checkboxes when people can pick any number of options from a list, or to turn one option on or off.
*   **Label every checkbox.** The label is the adjacent text, and it should say what checking the box does.
*   **Use a parent for a group.** A parent checkbox shows an [indeterminate](#indeterminate) state when only some of its children are checked.
*   **Don't apply density by default.** Let people opt in to a [denser layout](#density).

## Anatomy

A checkbox is one element. A `<label>` next to it, or around it, provides the text.

**Example: A checkbox inside a label**

```html
<label>
  <md-gb-checkbox></md-gb-checkbox>
  Send me updates
</label>
```

## Examples

### Checked and indeterminate

Add `checked` for a selected checkbox. Add `indeterminate` for a parent whose children are partly selected.

**Example: A checked checkbox and an indeterminate checkbox**

```html
<label>
  <md-gb-checkbox checked></md-gb-checkbox>
  Email
</label>
<label>
  <md-gb-checkbox indeterminate></md-gb-checkbox>
  All notifications
</label>
```

### Error

Add `error` to mark a checkbox as invalid. With `required`, it must be checked to submit a form.

**Example: A required checkbox in the error state**

```html
<label>
  <md-gb-checkbox required error></md-gb-checkbox>
  I accept the terms
</label>
```

### Disabled

A `disabled` checkbox can't be changed.

**Example: A disabled checkbox**

```html
<label>
  <md-gb-checkbox disabled></md-gb-checkbox>
  Unavailable option
</label>
```

### Density

Set `density` from 0 (default) to -3 to shrink the checkbox. The touch target stays 48px.

**Example: A checkbox with density -2**

```html
<label>
  <md-gb-checkbox density="-2"></md-gb-checkbox>
  Compact option
</label>
```

### Parent and children

Call `linkParentCheckbox(parent, children)` from `checkbox-group.js`. Checking the parent checks every child, and a partial selection makes the parent indeterminate.

**Example: A parent checkbox linked to two child checkboxes**

*HTML*

```html
<label>
  <md-gb-checkbox id="all"></md-gb-checkbox>
  All notifications
</label>
<label>
  <md-gb-checkbox class="channel" checked></md-gb-checkbox>
  Email
</label>
<label>
  <md-gb-checkbox class="channel"></md-gb-checkbox>
  Push
</label>
```

*TypeScript*

```ts
import {linkParentCheckbox} from '@material/web/labs/gb/components/checkbox/checkbox-group.js';

const parent = document.querySelector('md-gb-checkbox#all')!;
const children = [...document.querySelectorAll('md-gb-checkbox.channel')];
linkParentCheckbox(parent, children);
```

## Accessibility

*   The adjacent `<label>` text is the checkbox's accessible name. Use `aria-label` when there is no visible label or it needs more detail.
*   Space toggles the focused checkbox, and Tab moves between checkboxes.
*   A checkbox exposes its checked, unchecked or mixed state.

**Example: A checkbox with only an aria-label**

```html
<md-gb-checkbox aria-label="Select all messages"></md-gb-checkbox>
```

## API reference

### &lt;md-gb-checkbox&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>checked</code><br><span class="gb-desc">Whether or not the checkbox is selected.</span> | <code>checked</code> | <code>boolean</code> | <code>false</code> |
| <code>density</code><br><span class="gb-desc">The density, from 0 (default) to -3. Each step down removes 4px from the checkbox's layout box (48px) and state layer (40px); the touch target stays 48px. Values are clamped to that range. checkbox.md: don't apply density by default; let people opt in to a denser layout.</span> | <code>density</code> | <code>Density</code> |  |
| <code>error</code><br><span class="gb-desc">Whether or not the checkbox is invalid.</span> | <code>error</code> | <code>boolean</code> | <code>false</code> |
| <code>indeterminate</code><br><span class="gb-desc">Whether or not the checkbox is indeterminate. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes</span> | <code>indeterminate</code> | <code>boolean</code> | <code>false</code> |
| <code>required</code><br><span class="gb-desc">When true, require the checkbox to be selected when participating in form submission. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#validation</span> | <code>required</code> | <code>boolean</code> | <code>false</code> |
| <code>value</code><br><span class="gb-desc">The value of the checkbox that is submitted with a form when selected. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value</span> | <code>value</code> | <code>string</code> | <code>'on'</code> |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when the checkbox is checked or unchecked. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when the checkbox is checked or unchecked. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(checkbox)</code> | The checkbox's root element. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-color</code> |  |
| <code>--container-shape</code> |  |
| <code>--container-size</code> |  |
| <code>--density-step</code> | Size removed per density step. |
| <code>--icon-color</code> |  |
| <code>--icon-size</code> |  |
| <code>--outline-color</code> |  |
| <code>--outline-width</code> |  |
| <code>--state-layer-color</code> |  |
| <code>--state-layer-shape</code> |  |
| <code>--state-layer-size</code> | State layer size at density 0. |
| <code>--target-size</code> | The minimum touch target size, kept at any density. |
