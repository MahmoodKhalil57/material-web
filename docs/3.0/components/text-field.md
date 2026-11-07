---
title: Text field
section: components
category: other
order: 34
summary: Let people type and edit text
description: Text fields let people enter and edit text.
---
{% demo "A filled text field with a label" %}
<md-gb-text-field label="Name"></md-gb-text-field>
{% enddemo %}

## Usage guidelines

*   **Filled or outlined.** Filled fields have more visual weight and suit most forms. [Outlined](#variants) fields are lighter and work where many fields sit together. Don't mix them in one form.
*   **Label every field.** The label floats above the text once the field has a value or focus. Use a [placeholder](#variants) only as an example of the input, never in place of the label.
*   **Help before and after.** Use [supporting text](#supporting-text-and-counter) for hints, and explain what went wrong in an [error](#error-and-validation).

## Anatomy

A text field has a label, the input, optional icons and prefix or suffix text, and supporting text.

{% demo "A field with a label, icons, prefix, suffix and supporting text" %}
<md-gb-text-field label="Website" prefix-text="https://" suffix-text=".com" supporting-text="Your public address">
  <md-gb-icon slot="leading-icon">language</md-gb-icon>
  <md-gb-icon slot="trailing-icon">link</md-gb-icon>
</md-gb-text-field>
{% enddemo %}

## Examples

### Variants

Text fields are `filled` by default. Set `variant="outlined"` for an outlined field. Add `placeholder` for an example of the input.

{% demo "An outlined text field with a placeholder" %}
<md-gb-text-field label="Email" variant="outlined" placeholder="name@example.com"></md-gb-text-field>
{% enddemo %}

### Input types

`type` changes the keyboard and the built-in validation. It can be `text` (default), `email`, `number`, `password`, `search`, `tel`, `url` or `textarea`.

{% demo "Password, email and number fields" %}
<md-gb-text-field type="password" label="Password"></md-gb-text-field>
<md-gb-text-field type="email" label="Email"></md-gb-text-field>
<md-gb-text-field type="number" label="Quantity" min="1" max="10"></md-gb-text-field>
{% enddemo %}

### Textarea

`type="textarea"` makes a multi-line field. Set `rows` for its height.

{% demo "A three-row textarea" %}
<md-gb-text-field type="textarea" label="Message" rows="3"></md-gb-text-field>
{% enddemo %}

### Icons

Icons in the `leading-icon` and `trailing-icon` slots sit before and after the input. A trailing icon button needs an `aria-label`.

{% demo "A search field with a leading icon and a clear button" %}
<md-gb-text-field label="Search" value="Pasta">
  <md-gb-icon slot="leading-icon">search</md-gb-icon>
  <md-gb-icon-button slot="trailing-icon" aria-label="Clear">
    <md-gb-icon>cancel</md-gb-icon>
  </md-gb-icon-button>
</md-gb-text-field>
{% enddemo %}

### Prefix and suffix

`prefix-text` and `suffix-text` show fixed text around the input, such as a currency or a domain.

{% demo "Fields with a prefix and a suffix" %}
<md-gb-text-field label="Amount" prefix-text="$" value="100"></md-gb-text-field>
<md-gb-text-field label="Email" suffix-text="@example.com" value="ada"></md-gb-text-field>
{% enddemo %}

### Supporting text and counter

`supporting-text` shows a hint below the field. A `maxlength` adds a character counter.

{% demo "A field with a hint and a 20 character limit" %}
<md-gb-text-field label="Bio" maxlength="20" value="Hello" supporting-text="Tell us about yourself"></md-gb-text-field>
{% enddemo %}

### Error and validation

Set `error` and `error-text` to show an error yourself. A field also validates with the browser's constraint attributes (`required`, `pattern`, `minlength`, `min`, `max`) when its form is submitted or `reportValidity()` is called, and shows the message in its supporting text.

{% demo "A field in an error state" %}
<md-gb-text-field label="ZIP code" value="1234" error error-text="Enter a 5-digit ZIP code"></md-gb-text-field>
{% enddemo %}

### Required

`required` adds an asterisk to the label and makes an empty field invalid. Add `no-asterisk` to hide it.

{% demo "A required field" %}
<md-gb-text-field label="Username" required supporting-text="Required"></md-gb-text-field>
{% enddemo %}

### Disabled and read-only

A `disabled` field can't be focused. A `readonly` field can be focused and selected but not edited.

{% demo "A disabled field and a read-only field" %}
<md-gb-text-field label="Account" value="Locked" disabled></md-gb-text-field>
<md-gb-text-field label="Order number" value="A-1042" readonly></md-gb-text-field>
{% enddemo %}

### In a form

Fields take part in a form through their `name` and `value`, and the form checks them on submit.

{% demo "A form with a required name and an email field" %}
<form>
  <md-gb-text-field name="name" label="Name" required></md-gb-text-field>
  <md-gb-text-field name="email" type="email" label="Email" required></md-gb-text-field>
  <md-gb-button type="submit">Subscribe</md-gb-button>
</form>
{% enddemo %}

### Density

Set `density` from 0 (default) to -3 to remove 4px of height per step.

{% demo "A field with a density of -2" %}
<md-gb-text-field label="Name" density="-2"></md-gb-text-field>
{% enddemo %}

## Accessibility

*   The field's `label` names the input. For a field with an external label, add an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label).
*   Supporting and error text are linked to the input, so screen readers read them with it. An invalid field is marked with `aria-invalid`.
*   Icon buttons in a slot need their own `aria-label`.

{% demo "A field with no visible label, named Search the catalog" %}
<md-gb-text-field aria-label="Search the catalog" placeholder="Search"></md-gb-text-field>
{% enddemo %}

## API reference

{% gbapi "textfield" %}
