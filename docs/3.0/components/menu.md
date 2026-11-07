---
title: Menus
section: components
category: other
order: 26
summary: Offer a list of choices on a temporary surface
description: Menus show a temporary set of actions or choices, opened from a button, a text field or a context.
---
{% demo "A button that opens a menu of file actions" %}
<md-gb-button popovertarget="file-menu">File</md-gb-button>
<md-gb-menu id="file-menu">
  <md-gb-menu-item>New</md-gb-menu-item>
  <md-gb-menu-item>Open</md-gb-menu-item>
  <md-gb-menu-item disabled>Save</md-gb-menu-item>
</md-gb-menu>
{% enddemo %}

## Usage guidelines

*   **Use it for temporary actions.** A menu shows a short set of actions on demand. To show actions on screen at all times, use a [toolbar](/3.0/components/toolbar/).
*   **Open it from many places.** A menu can open from a button, an icon button, a split button or a text field, or as a [context menu](#context-menu).
*   **Organize long menus.** Use [groups](#groups) with labels and dividers to separate related choices.
*   **Choose a color.** The `standard` color suits most menus; `vibrant` makes the selected items stand out.

## Anatomy

A menu holds items, groups and dividers. An item holds a label and optional slots, including a submenu.

{% demo "A menu with a group, an item with all of its slots, a divider and another item" height=360 %}
```html
<md-gb-button id="more">More</md-gb-button>
<md-gb-menu id="more-menu">
  <md-gb-menu-group>
    <md-gb-menu-item>
      <md-gb-icon slot="leading">share</md-gb-icon>
      Share
      <span slot="supporting-text">Send a link</span>
      <span slot="trailing-text">Ctrl+S</span>
      <md-gb-icon slot="trailing">chevron_right</md-gb-icon>
      <md-gb-menu slot="submenu">
        <md-gb-menu-item>Email</md-gb-menu-item>
        <md-gb-menu-item>Messages</md-gb-menu-item>
      </md-gb-menu>
    </md-gb-menu-item>
  </md-gb-menu-group>
  <md-gb-divider></md-gb-divider>
  <md-gb-menu-item>Delete</md-gb-menu-item>
</md-gb-menu>
```
```ts
const menu = document.querySelector('#more-menu')!;
menu.showPopover({source: document.querySelector('#more')!});
```
{% enddemo %}

## Examples

### Opening a menu

A menu is a popover. Point an `md-gb-button` (or `md-gb-icon-button`, or a native button) at it with `popovertarget`, or call `showPopover()` from script. The menu positions itself next to the button and closes on Escape, when focus leaves, or when an item is chosen.

{% demo "A button that opens a menu of sort options" %}
<md-gb-button popovertarget="sort-menu">Sort</md-gb-button>
<md-gb-menu id="sort-menu">
  <md-gb-menu-item>Name</md-gb-menu-item>
  <md-gb-menu-item>Date modified</md-gb-menu-item>
  <md-gb-menu-item>Size</md-gb-menu-item>
</md-gb-menu>
{% enddemo %}

### Icons and supporting text

Fill the `leading`, `supporting-text`, `trailing-text` and `trailing` slots to add detail to an item.

{% demo "Menu items with leading icons and keyboard shortcuts" %}
<md-gb-button popovertarget="edit-menu">Edit</md-gb-button>
<md-gb-menu id="edit-menu">
  <md-gb-menu-item>
    <md-gb-icon slot="leading">content_cut</md-gb-icon>
    Cut
    <span slot="trailing-text">Ctrl+X</span>
  </md-gb-menu-item>
  <md-gb-menu-item>
    <md-gb-icon slot="leading">content_copy</md-gb-icon>
    Copy
    <span slot="trailing-text">Ctrl+C</span>
  </md-gb-menu-item>
  <md-gb-menu-item>
    <md-gb-icon slot="leading">content_paste</md-gb-icon>
    Paste
    <span slot="trailing-text">Ctrl+V</span>
  </md-gb-menu-item>
</md-gb-menu>
{% enddemo %}

### Groups

Wrap related items in an `md-gb-menu-group`. Set `label` for a heading, and `checkable` to `single` or `multiple` to make the items selectable like radio buttons or checkboxes. Use `checked` on the selected items.

{% demo "A menu with a single-select group and a multi-select group" %}
<md-gb-button popovertarget="view-menu">View</md-gb-button>
<md-gb-menu id="view-menu">
  <md-gb-menu-group label="Sort by" checkable="single">
    <md-gb-menu-item checked>Name</md-gb-menu-item>
    <md-gb-menu-item>Date modified</md-gb-menu-item>
  </md-gb-menu-group>
  <md-gb-divider></md-gb-divider>
  <md-gb-menu-group label="Show" checkable="multiple">
    <md-gb-menu-item checked>Hidden files</md-gb-menu-item>
    <md-gb-menu-item>File extensions</md-gb-menu-item>
  </md-gb-menu-group>
</md-gb-menu>
{% enddemo %}

### Grouped layout

Set `layout="grouped"` to show each group on its own surface with a gap between them, instead of one surface with dividers.

{% demo "A menu with two groups on separate surfaces" %}
<md-gb-button popovertarget="actions-menu">Actions</md-gb-button>
<md-gb-menu id="actions-menu" layout="grouped">
  <md-gb-menu-group>
    <md-gb-menu-item>Undo</md-gb-menu-item>
    <md-gb-menu-item>Redo</md-gb-menu-item>
  </md-gb-menu-group>
  <md-gb-menu-group>
    <md-gb-menu-item>Cut</md-gb-menu-item>
    <md-gb-menu-item>Copy</md-gb-menu-item>
    <md-gb-menu-item>Paste</md-gb-menu-item>
  </md-gb-menu-group>
</md-gb-menu>
{% enddemo %}

### Vibrant color

Set `color="vibrant"` to use the tertiary color roles instead of the surface-based `standard` style.

{% demo "A vibrant menu with a checked item" %}
<md-gb-button popovertarget="theme-menu">Theme</md-gb-button>
<md-gb-menu id="theme-menu" color="vibrant">
  <md-gb-menu-group checkable="single">
    <md-gb-menu-item checked>System</md-gb-menu-item>
    <md-gb-menu-item>Light</md-gb-menu-item>
    <md-gb-menu-item>Dark</md-gb-menu-item>
  </md-gb-menu-group>
</md-gb-menu>
{% enddemo %}

### Submenus

Put an `md-gb-menu` in an item's `submenu` slot. It opens beside the item on click, Enter, Space or the Right arrow key (Left in right-to-left layouts).

{% demo "A menu item that opens a submenu" %}
<md-gb-button popovertarget="share-menu">Share</md-gb-button>
<md-gb-menu id="share-menu">
  <md-gb-menu-item>Copy link</md-gb-menu-item>
  <md-gb-menu-item>
    Send to
    <md-gb-menu slot="submenu">
      <md-gb-menu-item>Email</md-gb-menu-item>
      <md-gb-menu-item>Message</md-gb-menu-item>
    </md-gb-menu>
  </md-gb-menu-item>
</md-gb-menu>
{% enddemo %}

### Context menu

Set `context-for` to the id of an element to open the menu on a secondary click, the context menu key or a long press.

{% demo "A menu that opens on right-click" %}
<div id="photo" tabindex="0">Right-click or long press this photo</div>
<md-gb-menu context-for="photo">
  <md-gb-menu-item>Open in new window</md-gb-menu-item>
  <md-gb-menu-item>Save as</md-gb-menu-item>
  <md-gb-menu-item>Copy link</md-gb-menu-item>
</md-gb-menu>
{% enddemo %}

### Density

Set `density` from `0` (default) down to `-3` to remove 4px of height per item for each step. Submenus inherit it. Keep it off by default and let people opt in.

{% demo "A menu at density -2" %}
<md-gb-button popovertarget="dense-menu">Open</md-gb-button>
<md-gb-menu id="dense-menu" density="-2">
  <md-gb-menu-item>Rename</md-gb-menu-item>
  <md-gb-menu-item>Duplicate</md-gb-menu-item>
  <md-gb-menu-item>Delete</md-gb-menu-item>
</md-gb-menu>
{% enddemo %}

## Accessibility

*   The menu has `role="menu"`, and items have `role="menuitem"`, or `menuitemradio` and `menuitemcheckbox` in checkable groups.
*   On the button that opens the menu, Up and Down open it and focus the first item; Enter and Space open it natively.
*   In an open menu, Up and Down move between items (disabled items included), Home and End go to the first and last item, and typing a letter jumps to the next item that starts with it.
*   Escape and Tab close the menu and return focus to the button. Left (Right in right-to-left layouts) closes a submenu.
*   Give a menu that has no clear visible title an `aria-label`.

## API reference

{% gbapi "menu" %}
