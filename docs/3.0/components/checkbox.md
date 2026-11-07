---
title: Checkbox
section: components
order: 7
description: Checkboxes let people select one or more items from a set, or turn an option on or off.
---
{% demo "A checkbox with the label Remember me" %}
<label>
  <md-gb-checkbox></md-gb-checkbox>
  Remember me
</label>
{% enddemo %}

## Usage guidelines

*   **Select from a set.** Use checkboxes when people can pick any number of options from a list, or to turn one option on or off.
*   **Label every checkbox.** The label is the adjacent text, and it should say what checking the box does.
*   **Use a parent for a group.** A parent checkbox shows an [indeterminate](#indeterminate) state when only some of its children are checked.
*   **Don't apply density by default.** Let people opt in to a [denser layout](#density).

## Anatomy

A checkbox is one element. A `<label>` next to it, or around it, provides the text.

```html
<label>
  <md-gb-checkbox></md-gb-checkbox>
  …
</label>
```

## Examples

### Checked and indeterminate

Add `checked` for a selected checkbox. Add `indeterminate` for a parent whose children are partly selected.

{% demo "A checked checkbox and an indeterminate checkbox" %}
<label>
  <md-gb-checkbox checked></md-gb-checkbox>
  Email
</label>
<label>
  <md-gb-checkbox indeterminate></md-gb-checkbox>
  All notifications
</label>
{% enddemo %}

### Error

Add `error` to mark a checkbox as invalid. With `required`, it must be checked to submit a form.

{% demo "A required checkbox in the error state" %}
<label>
  <md-gb-checkbox required error></md-gb-checkbox>
  I accept the terms
</label>
{% enddemo %}

### Disabled

A `disabled` checkbox can't be changed.

{% demo "A disabled checkbox" %}
<label>
  <md-gb-checkbox disabled></md-gb-checkbox>
  Unavailable option
</label>
{% enddemo %}

### Density

Set `density` from 0 (default) to -3 to shrink the checkbox. The touch target stays 48px.

{% demo "A checkbox with density -2" %}
<label>
  <md-gb-checkbox density="-2"></md-gb-checkbox>
  Compact option
</label>
{% enddemo %}

### Parent and children

Call `linkParentCheckbox(parent, children)` from `checkbox-group.js`. Checking the parent checks every child, and a partial selection makes the parent indeterminate.

```js
import {linkParentCheckbox} from '@material/web/labs/gb/components/checkbox/checkbox-group.js';

linkParentCheckbox(parent, [...children]);
```

## Accessibility

*   The adjacent `<label>` text is the checkbox's accessible name. Use `aria-label` when there is no visible label or it needs more detail.
*   Space toggles the focused checkbox, and Tab moves between checkboxes.
*   A checkbox exposes its checked, unchecked or mixed state.

```html
<md-gb-checkbox aria-label="Select all messages"></md-gb-checkbox>
```

## API reference

{% gbapi "checkbox" %}
