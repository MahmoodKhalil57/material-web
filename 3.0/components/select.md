# Select

Select menus let people choose one option from a list that opens on a temporary surface.

**Example: A filled select with a label**

```html
<md-gb-select label="Fruit">
  <md-gb-select-option value="apple">Apple</md-gb-select-option>
  <md-gb-select-option value="apricot">Apricot</md-gb-select-option>
  <md-gb-select-option value="banana">Banana</md-gb-select-option>
</md-gb-select>
```

## Usage guidelines

*   **Fixed list of choices.** Use a select to choose one value from a short, fixed list, like the native `<select>`. For a longer list that people can search, use the [autocomplete](#autocomplete).
*   **Pick the variant by emphasis.** Filled selects stand out more; [outlined](#variants) selects are lighter on dense forms.
*   **Say what is wrong.** Pair an [error](#error-and-supporting-text) with text that explains how to fix it.

## Anatomy

A select holds options and a field that shows the chosen one. Options can have icons and extra text.

**Example: A select whose options have icons, supporting text and trailing text**

```html
<md-gb-select label="Delivery">
  <md-gb-icon slot="leading-icon">local_shipping</md-gb-icon>
  <md-gb-select-option value="standard">
    <md-gb-icon slot="leading">schedule</md-gb-icon>
    <span slot="supporting-text">3 to 5 days</span>
    <span slot="trailing-text">Free</span>
    <md-gb-icon slot="trailing">check</md-gb-icon>
    Standard
  </md-gb-select-option>
  <md-gb-select-option value="express">
    <md-gb-icon slot="leading">bolt</md-gb-icon>
    <span slot="supporting-text">Next day</span>
    <span slot="trailing-text">$8</span>
    Express
  </md-gb-select-option>
</md-gb-select>
```

## Examples

### Variants

Selects are `filled` by default. Set `variant="outlined"` for an outlined field.

**Example: An outlined select with a label**

```html
<md-gb-select label="Fruit" variant="outlined">
  <md-gb-select-option value="apple">Apple</md-gb-select-option>
  <md-gb-select-option value="apricot">Apricot</md-gb-select-option>
</md-gb-select>
```

### Selected option

Add `selected` to an option, or set `value` on the select, to choose one at the start.

**Example: A select with Mobile chosen**

```html
<md-gb-select label="Phone type" value="mobile">
  <md-gb-select-option value="home">Home</md-gb-select-option>
  <md-gb-select-option value="mobile">Mobile</md-gb-select-option>
  <md-gb-select-option value="work">Work</md-gb-select-option>
</md-gb-select>
```

### Option content

Options take a `leading` icon, `supporting-text`, `trailing-text` and a `trailing` icon. Disabled options can't be chosen.

**Example: Options with supporting and trailing text, one disabled**

```html
<md-gb-select label="Plan" variant="outlined">
  <md-gb-select-option value="free">
    Free
    <span slot="supporting-text">1 project</span>
    <span slot="trailing-text">$0</span>
  </md-gb-select-option>
  <md-gb-select-option value="pro">
    Pro
    <span slot="supporting-text">Unlimited projects</span>
    <span slot="trailing-text">$8</span>
  </md-gb-select-option>
  <md-gb-select-option value="team" disabled>
    Team
    <span slot="supporting-text">Coming soon</span>
  </md-gb-select-option>
</md-gb-select>
```

### Leading icon

An icon in the `leading-icon` slot sits before the chosen text.

**Example: A select with a leading icon and icons on its options**

```html
<md-gb-select label="Phone type" value="mobile">
  <md-gb-icon slot="leading-icon">phone</md-gb-icon>
  <md-gb-select-option value="business">
    <md-gb-icon slot="leading">business_center</md-gb-icon>
    Business
  </md-gb-select-option>
  <md-gb-select-option value="mobile">
    <md-gb-icon slot="leading">smartphone</md-gb-icon>
    Mobile
  </md-gb-select-option>
</md-gb-select>
```

### Error and supporting text

Use `supporting-text` for a hint. When `error` is set, `error-text` replaces it. Add `required` to mark the field as mandatory.

**Example: A required select in an error state**

```html
<md-gb-select label="Country" required error error-text="Choose a country">
  <md-gb-select-option value="ca">Canada</md-gb-select-option>
  <md-gb-select-option value="mx">Mexico</md-gb-select-option>
</md-gb-select>
```

### Autocomplete

`md-gb-autocomplete` is a text field with the same options, filtered as people type. Set `filter` to change how options match.

**Example: An autocomplete for US states**

```html
<md-gb-autocomplete label="State">
  <md-gb-select-option>Alabama</md-gb-select-option>
  <md-gb-select-option>Alaska</md-gb-select-option>
  <md-gb-select-option>Arizona</md-gb-select-option>
</md-gb-autocomplete>
```

### In a form

A select takes part in a form through its `name` and `value`, and `required` is checked on submit.

**Example: A required select with a submit button**

```html
<form>
  <md-gb-select name="size" label="Size" required>
    <md-gb-select-option value="s">Small</md-gb-select-option>
    <md-gb-select-option value="m">Medium</md-gb-select-option>
    <md-gb-select-option value="l">Large</md-gb-select-option>
  </md-gb-select>
  <md-gb-button type="submit">Order</md-gb-button>
</form>
```

## Accessibility

*   The field is a `combobox` and the menu a `listbox`. The `label` names the field; add an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) when the label is elsewhere.
*   Enter, Space, or the arrow keys open the menu, the arrow keys move between options, and Escape closes it. Typing a few letters jumps to a matching option.

**Example: A select with no visible label, named Sort by**

```html
<md-gb-select aria-label="Sort by" value="new">
  <md-gb-select-option value="new">Newest</md-gb-select-option>
  <md-gb-select-option value="old">Oldest</md-gb-select-option>
</md-gb-select>
```

## API reference

### &lt;md-gb-autocomplete&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>error</code><br><span class="gb-desc">Whether the field is in a visually invalid state. Overrides the error state set by <code>reportValidity()</code>.</span> | <code>error</code> | <code>boolean</code> | <code>false</code> |
| <code>errorText</code><br><span class="gb-desc">The message that replaces the supporting text while <code>error</code> is true. Overrides the message shown by <code>reportValidity()</code>.</span> | <code>error-text</code> | <code>string</code> | <code>''</code> |
| <code>filter</code><br><span class="gb-desc">How options are filtered by the typed text: <code>contains</code> (default), <code>starts-with</code>, or <code>none</code> (the page updates the options itself, e.g. from a server, on <code>input</code>).</span> | <code>filter</code> | <code>AutocompleteFilter</code> | <code>'contains'</code> |
| <code>hasLeadingIcon</code><br><span class="gb-desc">Whether a leading icon is slotted. Set it for SSR.</span> | <code>has-leading-icon</code> | <code>boolean</code> | <code>false</code> |
| <code>label</code><br><span class="gb-desc">The floating label; also the field's accessible name.</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>noAsterisk</code><br><span class="gb-desc">Hides the asterisk added to the label of a required field.</span> | <code>no-asterisk</code> | <code>boolean</code> | <code>false</code> |
| <code>open</code><br><span class="gb-desc">Whether the menu is open.</span> | <code>open</code> | <code>boolean</code> | <code>false</code> |
| <code>placeholder</code><br><span class="gb-desc">Hint text shown in the input while it is empty and the label floats.</span> | <code>placeholder</code> | <code>string</code> | <code>''</code> |
| <code>required</code><br><span class="gb-desc">Whether a value is required. Adds an asterisk to the label.</span> | <code>required</code> | <code>boolean</code> | <code>false</code> |
| <code>supportingText</code><br><span class="gb-desc">Additional information shown below the field.</span> | <code>supporting-text</code> | <code>string</code> | <code>''</code> |
| <code>value</code><br><span class="gb-desc">The text in the field.</span> | <code>value</code> | <code>string</code> | <code>''</code> |
| <code>variant</code><br><span class="gb-desc">The variant: <code>filled</code> (default) or <code>outlined</code>.</span> | <code>variant</code> | <code>TextFieldVariant</code> | <code>'filled'</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The <code>md-gb-select-option</code> suggestions. |
| <code>leading-icon</code> | An icon before the input. |
| <code>trailing-icon</code> | Replaces the dropdown arrow icon. |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | The text was committed (picked option or native change). |
| <code>closed</code><br><span class="gb-desc">Event</span> | The menu closed. |
| <code>closing</code><br><span class="gb-desc">Event</span> | The menu is about to close. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | The text changed by typing or picking an option. |
| <code>invalid</code><br><span class="gb-desc">Event</span> | Fired when <code>checkValidity()</code> or <code>reportValidity()</code> finds the field invalid. |
| <code>opened</code><br><span class="gb-desc">Event</span> | The menu opened. |
| <code>opening</code><br><span class="gb-desc">Event</span> | The menu is about to open. |

#### Methods

| Method | Description |
| --- | --- |
| <code>blur</code><br><span class="gb-desc">() =&gt; void</span> | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/blur) |
| <code>focus</code><br><span class="gb-desc">(options?: FocusOptions) =&gt; void</span> | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus) |
| <code>reset</code><br><span class="gb-desc">() =&gt; void</span> | Restores the <code>value</code> attribute and clears native errors. |
| <code>select</code><br><span class="gb-desc">() =&gt; void</span> | Selects all the text. |
| <code>setCustomValidity</code><br><span class="gb-desc">(error: string) =&gt; void</span> | Sets the element's constraint validation error message. When set to a non-empty string, <code>validity.customError</code> will be true and <code>validationMessage</code> will display the provided error. Use this method to customize error messages reported. https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity |
| <code>showPicker</code><br><span class="gb-desc">() =&gt; void</span> | Opens the menu. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(arrow)</code> | The dropdown arrow. |
| <code>::part(container)</code> | The field's container. |
| <code>::part(input)</code> | The native <code>&lt;input&gt;</code>. |
| <code>::part(label)</code> | The floating label. |
| <code>::part(menu)</code> | The <code>listbox</code> menu. |
| <code>::part(supporting-text)</code> | The supporting or error text. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--caret-color</code> | Input caret color. |
| <code>--container-color</code> | Field container color. |
| <code>--input-text-color</code> | Input text color. |
| <code>--label-text-color</code> | Label color. |
| <code>--menu-min-width</code> | Minimum menu width. |
| <code>--trailing-icon-expanded-rotation</code> | Dropdown arrow rotation while open. |

### &lt;md-gb-select&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>displayText</code><br><span class="gb-desc">The text shown in the field. Defaults to the selected option's <code>displayText</code>; set it for SSR.</span> | <code>display-text</code> | <code>string</code> |  |
| <code>error</code><br><span class="gb-desc">Whether the field is in a visually invalid state. Overrides the error state set by <code>reportValidity()</code>.</span> | <code>error</code> | <code>boolean</code> | <code>false</code> |
| <code>errorText</code><br><span class="gb-desc">The message that replaces the supporting text while <code>error</code> is true. Overrides the message shown by <code>reportValidity()</code>.</span> | <code>error-text</code> | <code>string</code> | <code>''</code> |
| <code>hasLeadingIcon</code><br><span class="gb-desc">Whether a leading icon is slotted. Set it for SSR.</span> | <code>has-leading-icon</code> | <code>boolean</code> | <code>false</code> |
| <code>label</code><br><span class="gb-desc">The floating label; also the field's accessible name.</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>noAsterisk</code><br><span class="gb-desc">Hides the asterisk added to the label of a required field.</span> | <code>no-asterisk</code> | <code>boolean</code> | <code>false</code> |
| <code>open</code><br><span class="gb-desc">Whether the menu is open.</span> | <code>open</code> | <code>boolean</code> | <code>false</code> |
| <code>required</code><br><span class="gb-desc">Whether a value is required. Adds an asterisk to the label.</span> | <code>required</code> | <code>boolean</code> | <code>false</code> |
| <code>selectedIndex</code><br><span class="gb-desc">The index of the selected option, or -1.</span> | <code>selected-index</code> | <code>number</code> |  |
| <code>supportingText</code><br><span class="gb-desc">Additional information shown below the field.</span> | <code>supporting-text</code> | <code>string</code> | <code>''</code> |
| <code>typeaheadDelay</code><br><span class="gb-desc">The longest time between typeahead keystrokes, in milliseconds.</span> | <code>typeahead-delay</code> | <code>number</code> | <code>DEFAULT_TYPEAHEAD_DELAY</code> |
| <code>value</code><br><span class="gb-desc">The value of the selected option, or <code>''</code>. Setting it selects the first option with that value (or none).</span> | <code>value</code> | <code>string</code> |  |
| <code>variant</code><br><span class="gb-desc">The variant: <code>filled</code> (default) or <code>outlined</code>.</span> | <code>variant</code> | <code>TextFieldVariant</code> | <code>'filled'</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The <code>md-gb-select-option</code>s (and dividers). |
| <code>leading-icon</code> | An icon before the selected text. |
| <code>trailing-icon</code> | Replaces the dropdown arrow icon. |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | The person selected a different option. |
| <code>closed</code><br><span class="gb-desc">Event</span> | The menu closed. |
| <code>closing</code><br><span class="gb-desc">Event</span> | The menu is about to close. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | The person selected a different option. |
| <code>invalid</code><br><span class="gb-desc">Event</span> | Fired when <code>checkValidity()</code> or <code>reportValidity()</code> finds the select invalid. |
| <code>opened</code><br><span class="gb-desc">Event</span> | The menu opened. |
| <code>opening</code><br><span class="gb-desc">Event</span> | The menu is about to open. |

#### Methods

| Method | Description |
| --- | --- |
| <code>blur</code><br><span class="gb-desc">() =&gt; void</span> | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/blur) |
| <code>focus</code><br><span class="gb-desc">(options?: FocusOptions) =&gt; void</span> | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus) |
| <code>reset</code><br><span class="gb-desc">() =&gt; void</span> | Restores the default selection (<code>selected</code> attributes). |
| <code>select</code><br><span class="gb-desc">(value: string) =&gt; void</span> | Selects the first option with the given value. |
| <code>selectIndex</code><br><span class="gb-desc">(index: number) =&gt; void</span> | Selects the option at the given index. |
| <code>setCustomValidity</code><br><span class="gb-desc">(error: string) =&gt; void</span> | Sets the element's constraint validation error message. When set to a non-empty string, <code>validity.customError</code> will be true and <code>validationMessage</code> will display the provided error. Use this method to customize error messages reported. https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity |
| <code>showPicker</code><br><span class="gb-desc">() =&gt; void</span> | Opens the menu. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(arrow)</code> | The dropdown arrow. |
| <code>::part(container)</code> | The field's container. |
| <code>::part(field)</code> | The <code>combobox</code> showing the selected text. |
| <code>::part(label)</code> | The floating label. |
| <code>::part(menu)</code> | The <code>listbox</code> menu. |
| <code>::part(supporting-text)</code> | The supporting or error text. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--active-indicator-color</code> | Filled active indicator color. |
| <code>--active-indicator-height</code> | Filled active indicator thickness. |
| <code>--container-color</code> | Field container color. |
| <code>--container-shape</code> | Field container corner radius. |
| <code>--input-text</code> | Selected text typography. |
| <code>--input-text-axes</code> | Selected text font variation settings. |
| <code>--input-text-color</code> | Selected text color. |
| <code>--input-text-tracking</code> | Selected text letter spacing. |
| <code>--label-text</code> | Label typography. |
| <code>--label-text-axes</code> | Label font variation settings. |
| <code>--label-text-color</code> | Label color. |
| <code>--label-text-populated-line-height</code> | Floated label line height. |
| <code>--label-text-populated-size</code> | Floated label font size. |
| <code>--label-text-tracking</code> | Label letter spacing. |
| <code>--leading-icon-color</code> | Leading icon color. |
| <code>--leading-icon-size</code> | Leading icon size. |
| <code>--menu-closed-scale</code> | Scale the menu opens from. |
| <code>--menu-min-width</code> | Minimum menu width. |
| <code>--menu-window-margin</code> | Space kept between the menu and the window edge. |
| <code>--outline-color</code> | Outlined container outline color. |
| <code>--outline-width</code> | Outlined container outline width. |
| <code>--supporting-text</code> | Supporting text typography. |
| <code>--supporting-text-axes</code> | Supporting text font variation settings. |
| <code>--supporting-text-color</code> | Supporting text color. |
| <code>--supporting-text-tracking</code> | Supporting text letter spacing. |
| <code>--trailing-icon-color</code> | Dropdown arrow color. |
| <code>--trailing-icon-expanded-rotation</code> | Dropdown arrow rotation while open. |
| <code>--trailing-icon-size</code> | Dropdown arrow size. |

### &lt;md-gb-select-option&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>disabled</code><br><span class="gb-desc">Whether the option cannot be selected. It can still become active.</span> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>displayText</code><br><span class="gb-desc">The text shown in the field when the option is selected. Defaults to the option's label text.</span> | <code>display-text</code> | <code>string</code> |  |
| <code>selected</code><br><span class="gb-desc">Whether the option is selected. The <code>selected</code> attribute is the default selection restored on form reset.</span> | <code>selected</code> | <code>boolean</code> |  |
| <code>typeaheadText</code><br><span class="gb-desc">The text matched by typeahead and filtering. Defaults to <code>displayText</code>.</span> | <code>typeahead-text</code> | <code>string</code> |  |
| <code>value</code><br><span class="gb-desc">The form value. Defaults to <code>displayText</code>, like a native <code>&lt;option&gt;</code>.</span> | <code>value</code> | <code>string</code> |  |

#### Slots

| Slot | Description |
| --- | --- |
| default | The option's label. |
| <code>leading</code> | An icon before the label. Without one, a selected option shows a checkmark. |
| <code>supporting-text</code> | Supporting text below the label. |
| <code>trailing</code> | An icon after the label. |
| <code>trailing-text</code> | Metadata after the label, such as a keyboard shortcut. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(menu-item)</code> | The option's root element. |
