# Text field

Text fields let people enter and edit text.

**Example: A filled text field with a label**

```html
<md-gb-text-field label="Name"></md-gb-text-field>
```

## Usage guidelines

*   **Filled or outlined.** Filled fields have more visual weight and suit most forms. [Outlined](#variants) fields are lighter and work where many fields sit together. Don't mix them in one form.
*   **Label every field.** The label floats above the text once the field has a value or focus. Use a [placeholder](#variants) only as an example of the input, never in place of the label.
*   **Help before and after.** Use [supporting text](#supporting-text-and-counter) for hints, and explain what went wrong in an [error](#error-and-validation).

## Anatomy

A text field has a label, the input, optional icons and prefix or suffix text, and supporting text.

**Example: A field with a label, icons, prefix, suffix and supporting text**

```html
<md-gb-text-field label="Website" prefix-text="https://" suffix-text=".com" supporting-text="Your public address">
  <md-gb-icon slot="leading-icon">language</md-gb-icon>
  <md-gb-icon slot="trailing-icon">link</md-gb-icon>
</md-gb-text-field>
```

## Examples

### Variants

Text fields are `filled` by default. Set `variant="outlined"` for an outlined field. Add `placeholder` for an example of the input.

**Example: An outlined text field with a placeholder**

```html
<md-gb-text-field label="Email" variant="outlined" placeholder="name@example.com"></md-gb-text-field>
```

### Input types

`type` changes the keyboard and the built-in validation. It can be `text` (default), `email`, `number`, `password`, `search`, `tel`, `url` or `textarea`.

**Example: Password, email and number fields**

```html
<md-gb-text-field type="password" label="Password"></md-gb-text-field>
<md-gb-text-field type="email" label="Email"></md-gb-text-field>
<md-gb-text-field type="number" label="Quantity" min="1" max="10"></md-gb-text-field>
```

### Textarea

`type="textarea"` makes a multi-line field. Set `rows` for its height.

**Example: A three-row textarea**

```html
<md-gb-text-field type="textarea" label="Message" rows="3"></md-gb-text-field>
```

### Icons

Icons in the `leading-icon` and `trailing-icon` slots sit before and after the input. A trailing icon button needs an `aria-label`.

**Example: A search field with a leading icon and a clear button**

```html
<md-gb-text-field label="Search" value="Pasta">
  <md-gb-icon slot="leading-icon">search</md-gb-icon>
  <md-gb-icon-button slot="trailing-icon" aria-label="Clear">
    <md-gb-icon>cancel</md-gb-icon>
  </md-gb-icon-button>
</md-gb-text-field>
```

### Prefix and suffix

`prefix-text` and `suffix-text` show fixed text around the input, such as a currency or a domain.

**Example: Fields with a prefix and a suffix**

```html
<md-gb-text-field label="Amount" prefix-text="$" value="100"></md-gb-text-field>
<md-gb-text-field label="Email" suffix-text="@example.com" value="ada"></md-gb-text-field>
```

### Supporting text and counter

`supporting-text` shows a hint below the field. A `maxlength` adds a character counter.

**Example: A field with a hint and a 20 character limit**

```html
<md-gb-text-field label="Bio" maxlength="20" value="Hello" supporting-text="Tell us about yourself"></md-gb-text-field>
```

### Error and validation

Set `error` and `error-text` to show an error yourself. A field also validates with the browser's constraint attributes (`required`, `pattern`, `minlength`, `min`, `max`) when its form is submitted or `reportValidity()` is called, and shows the message in its supporting text.

**Example: A field in an error state**

```html
<md-gb-text-field label="ZIP code" value="1234" error error-text="Enter a 5-digit ZIP code"></md-gb-text-field>
```

### Required

`required` adds an asterisk to the label and makes an empty field invalid. Add `no-asterisk` to hide it.

**Example: A required field**

```html
<md-gb-text-field label="Username" required supporting-text="Required"></md-gb-text-field>
```

### Disabled and read-only

A `disabled` field can't be focused. A `readonly` field can be focused and selected but not edited.

**Example: A disabled field and a read-only field**

```html
<md-gb-text-field label="Account" value="Locked" disabled></md-gb-text-field>
<md-gb-text-field label="Order number" value="A-1042" readonly></md-gb-text-field>
```

### In a form

Fields take part in a form through their `name` and `value`, and the form checks them on submit.

**Example: A form with a required name and an email field**

```html
<form>
  <md-gb-text-field name="name" label="Name" required></md-gb-text-field>
  <md-gb-text-field name="email" type="email" label="Email" required></md-gb-text-field>
  <md-gb-button type="submit">Subscribe</md-gb-button>
</form>
```

### Density

Set `density` from 0 (default) to -3 to remove 4px of height per step.

**Example: A field with a density of -2**

```html
<md-gb-text-field label="Name" density="-2"></md-gb-text-field>
```

## Accessibility

*   The field's `label` names the input. For a field with an external label, add an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label).
*   Supporting and error text are linked to the input, so screen readers read them with it. An invalid field is marked with `aria-invalid`.
*   Icon buttons in a slot need their own `aria-label`.

**Example: A field with no visible label, named Search the catalog**

```html
<md-gb-text-field aria-label="Search the catalog" placeholder="Search"></md-gb-text-field>
```

## API reference

### &lt;md-gb-text-field&gt;

A Material Design text field (filled or outlined).

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>autocomplete</code><br><span class="gb-desc">The input's <code>autocomplete</code> hint.</span> | <code>autocomplete</code> | <code>string</code> | <code>''</code> |
| <code>cols</code><br><span class="gb-desc">The number of columns of a <code>type="textarea"</code> field.</span> | <code>cols</code> | <code>number</code> | <code>20</code> |
| <code>density</code><br><span class="gb-desc">The density, from 0 (default) to -3. Each step down removes 4px from the container height (56px), half above and half below the content; text keeps its size. Values are clamped to that range. text-fields.md "Avoid applying density by default": dense fields are below the 48x48 CSS pixel target, so let people opt in (a denser layout or theme) and keep the controls that change it at 48x48.</span> | <code>density</code> | <code>Density</code> |  |
| <code>error</code><br><span class="gb-desc">Whether the field is in a visually invalid state. Overrides the error state set by <code>reportValidity()</code>.</span> | <code>error</code> | <code>boolean</code> | <code>false</code> |
| <code>errorIcon</code><br><span class="gb-desc">When the error icon shows in the trailing edge: <code>always</code> (default) in the error state, or <code>focus</code> only while the field has focus. Its space stays reserved, so focusing the field does not move the text.</span> | <code>error-icon</code> | <code>ErrorIconVisibility</code> | <code>'always'</code> |
| <code>errorText</code><br><span class="gb-desc">The message that replaces the supporting text while <code>error</code> is true. If empty, the supporting text keeps showing. Overrides the message shown by <code>reportValidity()</code>.</span> | <code>error-text</code> | <code>string</code> | <code>''</code> |
| <code>hasLeadingIcon</code><br><span class="gb-desc">Whether a leading icon is slotted. Set it for SSR.</span> | <code>has-leading-icon</code> | <code>boolean</code> | <code>false</code> |
| <code>hasTrailingIcon</code><br><span class="gb-desc">Whether a trailing icon is slotted. Set it for SSR.</span> | <code>has-trailing-icon</code> | <code>boolean</code> | <code>false</code> |
| <code>inputMode</code><br><span class="gb-desc">[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/inputMode)</span> | <code>inputmode</code> | <code>string</code> | <code>''</code> |
| <code>label</code><br><span class="gb-desc">The floating label. It is also the input's accessible name, unless <code>aria-label</code> is set.</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>max</code><br><span class="gb-desc">The greatest permitted value.</span> | <code>max</code> | <code>string</code> | <code>''</code> |
| <code>maxLength</code><br><span class="gb-desc">The maximum number of characters; shows a character counter. -1 for none.</span> | <code>maxlength</code> | <code>number</code> | <code>-1</code> |
| <code>min</code><br><span class="gb-desc">The least permitted value.</span> | <code>min</code> | <code>string</code> | <code>''</code> |
| <code>minLength</code><br><span class="gb-desc">The minimum number of characters. -1 for none.</span> | <code>minlength</code> | <code>number</code> | <code>-1</code> |
| <code>multiple</code><br><span class="gb-desc">Whether an email field accepts multiple addresses.</span> | <code>multiple</code> | <code>boolean</code> | <code>false</code> |
| <code>noAsterisk</code><br><span class="gb-desc">Hides the asterisk added to the label of a required field.</span> | <code>no-asterisk</code> | <code>boolean</code> | <code>false</code> |
| <code>noSpinner</code><br><span class="gb-desc">Hides the spinner of <code>type="number"</code> fields.</span> | <code>no-spinner</code> | <code>boolean</code> | <code>false</code> |
| <code>pattern</code><br><span class="gb-desc">A regular expression the value must match.</span> | <code>pattern</code> | <code>string</code> | <code>''</code> |
| <code>placeholder</code><br><span class="gb-desc">Hint text shown in the input while it is empty and the label is floated (or there is no label).</span> | <code>placeholder</code> | <code>string</code> | <code>''</code> |
| <code>prefixText</code><br><span class="gb-desc">Text shown before the input value, such as a currency symbol.</span> | <code>prefix-text</code> | <code>string</code> | <code>''</code> |
| <code>readOnly</code><br><span class="gb-desc">Whether the value cannot be edited.</span> | <code>readonly</code> | <code>boolean</code> | <code>false</code> |
| <code>required</code><br><span class="gb-desc">Whether a value is required for form submission. Adds an asterisk to the label.</span> | <code>required</code> | <code>boolean</code> | <code>false</code> |
| <code>rows</code><br><span class="gb-desc">The number of rows of a <code>type="textarea"</code> field.</span> | <code>rows</code> | <code>number</code> | <code>2</code> |
| <code>step</code><br><span class="gb-desc">The step between permitted numeric values.</span> | <code>step</code> | <code>string</code> | <code>''</code> |
| <code>suffixText</code><br><span class="gb-desc">Text shown after the input value, such as a unit.</span> | <code>suffix-text</code> | <code>string</code> | <code>''</code> |
| <code>supportingText</code><br><span class="gb-desc">Additional information shown below the field.</span> | <code>supporting-text</code> | <code>string</code> | <code>''</code> |
| <code>supportingTextVisibility</code><br><span class="gb-desc">When the supporting text shows: <code>always</code> (default), or <code>focus</code> only while the field has focus (text-fields-aed1bf). Its space stays reserved so the layout does not move, it stays in the input's accessible description, and an error message always shows.</span> | <code>supporting-text-visibility</code> | <code>SupportingTextVisibility</code> | <code>'always'</code> |
| <code>textDirection</code><br><span class="gb-desc">Overrides the input's CSS <code>direction</code>.</span> | <code>text-direction</code> | <code>string</code> | <code>''</code> |
| <code>type</code><br><span class="gb-desc">The input type, <code>text</code> by default. <code>textarea</code> renders a multi-line <code>&lt;textarea&gt;</code>.</span> | <code>type</code> | <code>TextFieldType | UnsupportedTextFieldType</code> | <code>'text'</code> |
| <code>value</code><br><span class="gb-desc">The current value. It is always a string.</span> | <code>value</code> | <code>string</code> | <code>''</code> |
| <code>variant</code><br><span class="gb-desc">The variant: <code>filled</code> (default) or <code>outlined</code>.</span> | <code>variant</code> | <code>TextFieldVariant</code> | <code>'filled'</code> |

#### Slots

| Slot | Description |
| --- | --- |
| <code>leading-icon</code> | An icon (or icon button) before the input. |
| <code>trailing-icon</code> | An icon (or icon button) after the input, such as a clear, visibility or error icon. |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | The native <code>change</code> event. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | The native <code>input</code> event. |
| <code>invalid</code><br><span class="gb-desc">Event</span> | Fired when <code>checkValidity()</code> or <code>reportValidity()</code> finds the field invalid. |
| <code>select</code><br><span class="gb-desc">Event</span> | The native <code>select</code> event. |

#### Methods

| Method | Description |
| --- | --- |
| <code>focus</code><br><span class="gb-desc">(options?: FocusOptions) =&gt; void</span> | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus) |
| <code>reset</code><br><span class="gb-desc">() =&gt; void</span> | Resets the value to the <code>value</code> attribute and clears native errors. |
| <code>select</code><br><span class="gb-desc">() =&gt; void</span> | Selects all the text. |
| <code>setCustomValidity</code><br><span class="gb-desc">(error: string) =&gt; void</span> | Sets the element's constraint validation error message. When set to a non-empty string, <code>validity.customError</code> will be true and <code>validationMessage</code> will display the provided error. Use this method to customize error messages reported. https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity |
| <code>setRangeText</code><br><span class="gb-desc">&#123; (replacement: string): void; (replacement: string, start: number, end: number, selectionMode?: SelectionMode): void; &#125;</span> | Replaces a range of text with a new string. |
| <code>setSelectionRange</code><br><span class="gb-desc">(start: number, end: number, direction?: "none" | "forward" | "backward") =&gt; void</span> | Sets the start and end of the text selection. |
| <code>showPicker</code><br><span class="gb-desc">() =&gt; void</span> | Shows the browser picker of a date, time or color field. |
| <code>stepDown</code><br><span class="gb-desc">(n?: number) =&gt; void</span> | Decrements a numeric value by <code>step</code>, <code>n</code> times. |
| <code>stepUp</code><br><span class="gb-desc">(n?: number) =&gt; void</span> | Increments a numeric value by <code>step</code>, <code>n</code> times. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(container)</code> | The field's container. |
| <code>::part(counter)</code> | The character counter. |
| <code>::part(input)</code> | The native <code>&lt;input&gt;</code> or <code>&lt;textarea&gt;</code>. |
| <code>::part(label)</code> | The floating label. |
| <code>::part(supporting-text)</code> | The supporting or error text. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--active-indicator-color</code> | Filled active indicator color. |
| <code>--active-indicator-height</code> | Filled active indicator thickness. |
| <code>--affix-space</code> | Space between the prefix/suffix and the input. |
| <code>--bottom-space</code> | Space below the input. |
| <code>--caret-color</code> | Input caret color. |
| <code>--container-color</code> | Container background color. |
| <code>--container-height</code> | Single-line container height. |
| <code>--container-shape</code> | Container corner radius. |
| <code>--counter-space</code> | Space between the supporting text and counter. |
| <code>--density-step</code> | Container height removed per density step. |
| <code>--icon-input-space</code> | Space between an icon and the input. |
| <code>--icon-leading-space</code> | Start padding before a leading icon. |
| <code>--icon-trailing-space</code> | End padding after a trailing icon. |
| <code>--input-text</code> | Input typography. |
| <code>--input-text-axes</code> | Input font variation settings. |
| <code>--input-text-color</code> | Input text color. |
| <code>--input-text-placeholder-color</code> | Placeholder color. |
| <code>--input-text-prefix-color</code> | Prefix text color. |
| <code>--input-text-suffix-color</code> | Suffix text color. |
| <code>--input-text-tracking</code> | Input letter spacing. |
| <code>--label-text</code> | Resting label typography. |
| <code>--label-text-axes</code> | Label font variation settings. |
| <code>--label-text-color</code> | Label color. |
| <code>--label-text-populated-line-height</code> | Floated label line height. |
| <code>--label-text-populated-size</code> | Floated label font size. |
| <code>--label-text-tracking</code> | Label letter spacing. |
| <code>--leading-icon-color</code> | Leading icon color. |
| <code>--leading-icon-size</code> | Leading icon size. |
| <code>--leading-space</code> | Start padding without a leading icon. |
| <code>--outline-color</code> | Outlined container outline color. |
| <code>--outline-label-padding</code> | Space around the floated label in the outline notch. |
| <code>--outline-width</code> | Outlined container outline width. |
| <code>--state-layer-color</code> | Hover state layer color (filled). |
| <code>--supporting-text</code> | Supporting text typography. |
| <code>--supporting-text-axes</code> | Supporting text font variation settings. |
| <code>--supporting-text-color</code> | Supporting text color. |
| <code>--supporting-text-top-space</code> | Space above the supporting text. |
| <code>--supporting-text-tracking</code> | Supporting text letter spacing. |
| <code>--top-space</code> | Space above the content (filled: above the floated label). |
| <code>--trailing-icon-color</code> | Trailing icon color. |
| <code>--trailing-icon-size</code> | Trailing icon size. |
| <code>--trailing-space</code> | End padding without a trailing icon. |
