# Toolbar

A toolbar holds actions that relate to the content on the screen, docked to an edge or floating above it.

**Example: A floating toolbar with formatting actions**

```html
<md-gb-toolbar aria-label="Text formatting">
  <md-gb-icon-button aria-label="Bold"><md-gb-icon>format_bold</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Italic"><md-gb-icon>format_italic</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Underline"><md-gb-icon>format_underlined</md-gb-icon></md-gb-icon-button>
</md-gb-toolbar>
```

## Usage guidelines

*   **Actions for the page.** A toolbar offers actions related to the current page and can show more of them in larger windows.
*   **Docked or floating.** A [docked](#docked) toolbar spans the window and suits global actions that stay the same across pages. A floating toolbar hovers over the content and suits actions for that content.
*   **Vibrant for emphasis.** Use the [vibrant](#colors) color for more emphasis.
*   **Not with a navigation bar.** Don't show a toolbar at the same time as a navigation bar.

## Anatomy

A toolbar holds actions, such as buttons and icon buttons. A floating toolbar can have a FAB.

**Example: A toolbar with leading and trailing buttons, a button and a FAB**

```html
<md-gb-toolbar aria-label="Compose actions">
  <md-gb-icon-button slot="leading" aria-label="Attach"><md-gb-icon>attach_file</md-gb-icon></md-gb-icon-button>
  <md-gb-button>Draft</md-gb-button>
  <md-gb-icon-button slot="trailing" aria-label="Delete"><md-gb-icon>delete</md-gb-icon></md-gb-icon-button>
  <md-gb-fab slot="fab" aria-label="Send"><md-gb-icon>send</md-gb-icon></md-gb-fab>
</md-gb-toolbar>
```

## Examples

### Colors

Toolbars are `standard` by default. Set `color="vibrant"` for a more prominent toolbar.

**Example: A vibrant toolbar**

```html
<md-gb-toolbar color="vibrant" aria-label="Editing">
  <md-gb-icon-button aria-label="Undo"><md-gb-icon>undo</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Redo"><md-gb-icon>redo</md-gb-icon></md-gb-icon-button>
</md-gb-toolbar>
```

### Docked

Add `docked` to stretch the toolbar across the full width of its container.

**Example: A docked toolbar**

```html
<md-gb-toolbar docked aria-label="Editing">
  <md-gb-icon-button aria-label="Undo"><md-gb-icon>undo</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Redo"><md-gb-icon>redo</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Share"><md-gb-icon>share</md-gb-icon></md-gb-icon-button>
</md-gb-toolbar>
```

### Buttons with labels

Toolbars can hold buttons with labels as well as icon buttons. Use toggle buttons to show a selected state.

**Example: A toolbar with toggle buttons**

```html
<md-gb-toolbar aria-label="View">
  <md-gb-button type="toggle" selected>
    <md-gb-icon>edit</md-gb-icon>
    Edit
  </md-gb-button>
  <md-gb-button type="toggle">
    <md-gb-icon>palette</md-gb-icon>
    Style
  </md-gb-button>
</md-gb-toolbar>
```

### Orientation

Set `orientation="vertical"` to stack the actions in a column.

**Example: A vertical toolbar**

```html
<md-gb-toolbar orientation="vertical" aria-label="Tools">
  <md-gb-icon-button aria-label="Draw"><md-gb-icon>brush</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Erase"><md-gb-icon>ink_eraser</md-gb-icon></md-gb-icon-button>
</md-gb-toolbar>
```

### With a FAB

A floating toolbar can sit beside a FAB in the `fab` slot. Set `fab-position="start"` to move it to the leading side, or `expanded="false"` to collapse the toolbar to just the FAB.

**Example: A floating toolbar with a FAB**

```html
<md-gb-toolbar aria-label="Compose actions">
  <md-gb-icon-button aria-label="Attach"><md-gb-icon>attach_file</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Insert photo"><md-gb-icon>image</md-gb-icon></md-gb-icon-button>
  <md-gb-fab slot="fab" aria-label="Send"><md-gb-icon>send</md-gb-icon></md-gb-fab>
</md-gb-toolbar>
```

### Overflow

Add `overflow-menu` to move trailing actions that don't fit into a "More actions" menu.

**Example: A narrow toolbar with an overflow menu**

```html
<md-gb-toolbar overflow-menu aria-label="Document actions" style="max-inline-size: 200px">
  <md-gb-icon-button aria-label="Print"><md-gb-icon>print</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Share"><md-gb-icon>share</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Download"><md-gb-icon>download</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Delete"><md-gb-icon>delete</md-gb-icon></md-gb-icon-button>
</md-gb-toolbar>
```

### Hide on scroll

Set `scroll-behavior="hide"` to move a docked or floating toolbar off screen when the page scrolls down and bring it back when it scrolls up. `scroll-target` names the element that scrolls; it defaults to the window.

**Example: A docked toolbar that hides when its page scrolls down**

*HTML*

```html
<div id="page">
  <p>Scroll this page down to hide the toolbar and up to bring it back.</p>
  <p>Bread, milk, eggs, butter, cheese, apples, rice, beans, flour, sugar.</p>
  <p>Coffee, tea, honey, oats, lentils, pasta, tomatoes, onions, garlic.</p>
  <p>Lemons, limes, oranges, bananas, grapes, pears, plums, peaches, figs.</p>
  <md-gb-toolbar docked scroll-behavior="hide" scroll-target="page" aria-label="Page actions">
    <md-gb-icon-button aria-label="Undo"><md-gb-icon>undo</md-gb-icon></md-gb-icon-button>
    <md-gb-icon-button aria-label="Share"><md-gb-icon>share</md-gb-icon></md-gb-icon-button>
  </md-gb-toolbar>
</div>
```

*CSS*

```css
#page {
  block-size: 200px;
  overflow-y: auto;
  padding-inline: 16px;
}
#page md-gb-toolbar {
  position: sticky;
  inset-block-end: 0;
}
#page p {
  margin-block: 56px;
}
```

## Accessibility

*   A toolbar has the `toolbar` role. Label it with [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) or [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby).
*   Every action stays in the Tab order, and the arrow keys also move between them (up and down in a vertical toolbar).
*   Icon-only actions need an `aria-label`.
*   A collapsed toolbar makes its hidden actions inert.

## API reference

### &lt;md-gb-toolbar&gt;

A Material Design gBreeze toolbar custom element.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>color</code><br><span class="gb-desc">The color scheme of the toolbar.</span> | <code>color</code> | <code>ToolbarColor</code> | <code>'standard'</code> |
| <code>docked</code><br><span class="gb-desc">Whether the toolbar is docked across full width.</span> | <code>docked</code> | <code>boolean</code> | <code>false</code> |
| <code>expanded</code><br><span class="gb-desc">Whether a floating toolbar with a FAB shows its items. When <code>false</code>, the toolbar collapses and its FAB grows to the medium size (Compose floating toolbar <code>expanded</code>). Set <code>expanded="false"</code> from markup.</span> | <code>expanded</code> | <code>boolean</code> | <code>true</code> |
| <code>fabPosition</code><br><span class="gb-desc">Which side of a floating toolbar the FAB is on (<code>end</code> or <code>start</code>).</span> | <code>fab-position</code> | <code>"start" | "end"</code> | <code>'end'</code> |
| <code>orientation</code><br><span class="gb-desc">The layout orientation.</span> | <code>orientation</code> | <code>ToolbarOrientation</code> | <code>'horizontal'</code> |
| <code>overflowMenu</code><br><span class="gb-desc">Whether trailing actions that do not fit move into an overflow menu in the trailing slot (toolbars.md, Adaptive design). On by itself when an <code>overflow</code> slot trigger is provided; this turns it on with the default "More actions" button.</span> | <code>overflow-menu</code> | <code>boolean</code> | <code>false</code> |
| <code>scrollBehavior</code><br><span class="gb-desc">How a docked or floating toolbar reacts to scrolling: <code>hide</code> slides it beyond the bottom edge when the page scrolls down and back on scroll up (toolbars.md: docked and floating toolbars "can animate offscreen").</span> | <code>scroll-behavior</code> | <code>"hide"</code> |  |
| <code>scrollTarget</code><br><span class="gb-desc">The id of the element whose scrolling drives <code>scroll-behavior</code>. Defaults to the window.</span> | <code>scroll-target</code> | <code>string</code> | <code>''</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display toolbar items (buttons, icon buttons, or custom content). |
| <code>fab</code> | An optional FAB (<code>md-gb-fab</code>) shown next to a floating toolbar, colored by the toolbar's <code>color</code> (standard: secondary container, vibrant: tertiary container). |
| <code>leading</code> | Used to display leading toolbar items. |
| <code>trailing</code> | Used to display trailing toolbar items. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(toolbar)</code> | The toolbar's root container. |
| <code>::part(toolbar-with-fab)</code> | The toolbar and FAB layout, with a FAB. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--button-container-color</code> |  |
| <code>--container-color</code> |  |
| <code>--container-elevation</code> |  |
| <code>--container-leading-space</code> |  |
| <code>--container-shape</code> |  |
| <code>--container-spacing</code> |  |
| <code>--container-trailing-space</code> |  |
| <code>--docked-container-elevation</code> |  |
| <code>--docked-container-height</code> |  |
| <code>--docked-container-leading-space</code> |  |
| <code>--docked-container-max-spacing</code> |  |
| <code>--docked-container-min-spacing</code> |  |
| <code>--docked-container-shape</code> |  |
| <code>--docked-container-trailing-space</code> |  |
| <code>--horizontal-container-height</code> |  |
| <code>--icon-color</code> |  |
| <code>--label-text-color</code> |  |
| <code>--min-button-size</code> |  |
| <code>--motion-duration</code> |  |
| <code>--motion-easing</code> |  |
| <code>--selected-button-container-color</code> |  |
| <code>--selected-icon-color</code> |  |
| <code>--selected-label-text-color</code> |  |
| <code>--vertical-container-width</code> |  |
