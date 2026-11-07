---
title: Scaffold
section: foundations
order: 7
icon: dashboard
description: A scaffold arranges the bars, rails and panes around an app's content, and adapts them to the window size.
---
{% demo "An app scaffold with an app bar, a navigation bar, a navigation rail and content" %}
<md-gb-app-scaffold style="inline-size: 100%; block-size: 360px">
  <md-gb-app-bar slot="top-app-bar">Inbox</md-gb-app-bar>
  <md-gb-nav-bar slot="navigation-bar" aria-label="Primary">
    <md-gb-nav-bar-item active>
      <md-gb-icon slot="icon">inbox</md-gb-icon>
      Inbox
    </md-gb-nav-bar-item>
    <md-gb-nav-bar-item>
      <md-gb-icon slot="icon">send</md-gb-icon>
      Sent
    </md-gb-nav-bar-item>
  </md-gb-nav-bar>
  <md-gb-nav-rail slot="navigation-rail" aria-label="Primary">
    <md-gb-nav-rail-item selected>
      <md-gb-icon slot="icon">inbox</md-gb-icon>
      Inbox
    </md-gb-nav-rail-item>
    <md-gb-nav-rail-item>
      <md-gb-icon slot="icon">send</md-gb-icon>
      Sent
    </md-gb-nav-rail-item>
  </md-gb-nav-rail>
  <p>Your messages appear here.</p>
</md-gb-app-scaffold>
{% enddemo %}

## Usage guidelines

*   **Structure the app in bars, rails and panes.** Bars frame the page, rails run along its edges, and panes hold the content.
*   **Provide both navigation components.** Give the scaffold a navigation bar and a navigation rail with the same destinations. It shows the bar in compact windows and the rail from medium windows up, and you keep their selection in sync.
*   **Pick the pane layout by content.** Use [list-detail](#list-detail) for a collection and its details, [supporting pane](#supporting-pane) for a focus area with related content, and [feed](#feed) for a grid of items.
*   **Use one to three panes.** The number of visible panes follows the window size.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

`md-gb-app-scaffold` places bars and rails around its content. `md-gb-pane-scaffold` goes in the content and arranges the panes.

{% demo "An app scaffold with a top app bar, navigation, a FAB and a pane scaffold" height=360 %}
<md-gb-app-scaffold style="inline-size: 100%; block-size: 360px">
  <md-gb-app-bar slot="top-app-bar">Notes</md-gb-app-bar>
  <md-gb-nav-bar slot="navigation-bar" aria-label="Primary">
    <md-gb-nav-bar-item active>
      <md-gb-icon slot="icon">notes</md-gb-icon>
      Notes
    </md-gb-nav-bar-item>
    <md-gb-nav-bar-item>
      <md-gb-icon slot="icon">archive</md-gb-icon>
      Archive
    </md-gb-nav-bar-item>
  </md-gb-nav-bar>
  <md-gb-nav-rail slot="navigation-rail" aria-label="Primary">
    <md-gb-nav-rail-item selected>
      <md-gb-icon slot="icon">notes</md-gb-icon>
      Notes
    </md-gb-nav-rail-item>
    <md-gb-nav-rail-item>
      <md-gb-icon slot="icon">archive</md-gb-icon>
      Archive
    </md-gb-nav-rail-item>
  </md-gb-nav-rail>
  <md-gb-fab slot="fab" aria-label="New note">
    <md-gb-icon>add</md-gb-icon>
  </md-gb-fab>
  <md-gb-pane-scaffold>
    <md-gb-list slot="secondary" aria-label="Notes">
      <md-gb-list-item>Groceries</md-gb-list-item>
      <md-gb-list-item>Trip ideas</md-gb-list-item>
    </md-gb-list>
    <article>
      <h2>Groceries</h2>
      <p>Milk, eggs and bread.</p>
    </article>
    <p slot="placeholder">Select a note</p>
  </md-gb-pane-scaffold>
</md-gb-app-scaffold>
{% enddemo %}

## Examples

### List-detail

The default layout shows a list in the `secondary` slot and its detail in the default slot. In windows with one pane they take turns: call `openDetail()` when someone picks an item and `closeDetail()` from a back button. The `placeholder` slot fills the detail pane until one is open.

{% demo "A list-detail layout with a list of conversations and an empty detail pane" %}
<md-gb-pane-scaffold style="inline-size: 100%; block-size: 240px">
  <md-gb-list slot="secondary" aria-label="Conversations">
    <md-gb-list-item>Ali Connors</md-gb-list-item>
    <md-gb-list-item>Sandra Adams</md-gb-list-item>
    <md-gb-list-item>Trevor Hansen</md-gb-list-item>
  </md-gb-list>
  <article>
    <h2>Brunch this weekend?</h2>
    <p>From Ali Connors</p>
  </article>
  <p slot="placeholder">Select a conversation</p>
</md-gb-pane-scaffold>
{% enddemo %}

### Supporting pane

Set `layout="supporting-pane"` for a focus area in the default slot with related content in the `secondary` slot, at the trailing side by default.

{% demo "A focus pane with a supporting pane of related notes" %}
<md-gb-pane-scaffold layout="supporting-pane" style="inline-size: 100%; block-size: 360px">
  <article>
    <h2>Quarterly plan</h2>
    <p>The goals and milestones for the next three months.</p>
  </article>
  <aside slot="secondary">
    <h3>Related notes</h3>
    <p>Budget review</p>
  </aside>
</md-gb-pane-scaffold>
{% enddemo %}

### Feed

Set `layout="feed"` to lay the default slot's items out on a grid, with an optional `secondary` pane beside it.

{% demo "A feed of four cards" %}
<md-gb-pane-scaffold layout="feed" style="inline-size: 100%; block-size: 240px">
  <md-gb-card>Lemon pasta</md-gb-card>
  <md-gb-card>Sourdough</md-gb-card>
  <md-gb-card>Pad thai</md-gb-card>
  <md-gb-card>Summer salad</md-gb-card>
</md-gb-pane-scaffold>
{% enddemo %}

### Resizable panes

Add `resizable` to a two-pane layout to show a drag handle between the panes. `pane-width` sets the width of the `secondary` pane in pixels, and `collapsed-pane` records a pane collapsed with the handle. The scaffold fires `pane-resize` when the panes change size.

{% demo "A two-pane layout with a drag handle between the panes" height=300 %}
<md-gb-pane-scaffold resizable pane-width="240" style="inline-size: 100%; block-size: 240px">
  <md-gb-list slot="secondary" aria-label="Folders">
    <md-gb-list-item>Inbox</md-gb-list-item>
    <md-gb-list-item>Drafts</md-gb-list-item>
  </md-gb-list>
  <article>
    <h2>Inbox</h2>
    <p>Drag the handle to resize the list.</p>
  </article>
</md-gb-pane-scaffold>
{% enddemo %}

### Floating and docked panes

When there is no room for a supporting pane beside the content, set `levitate` to `floating` or `docked` to lift the `secondary` pane above it instead of stacking it below. A docked pane sits at the bottom edge on compact windows, like a bottom sheet. Open it with `openLevitated()` and close it with `closeLevitated()`. Add `levitate-modal` for a scrim, and `levitate-label` to name the pane.

{% demo "A button that opens a floating supporting pane of comments" height=400 %}
```html
<md-gb-button id="comments-button">Comments</md-gb-button>
<md-gb-pane-scaffold layout="supporting-pane" levitate="floating" levitate-label="Comments">
  <article>
    <h2>Quarterly plan</h2>
    <p>The goals and milestones for the next three months.</p>
  </article>
  <aside slot="secondary">
    <h3>Comments</h3>
    <p>Looks good to me.</p>
  </aside>
</md-gb-pane-scaffold>
```
```css
md-gb-pane-scaffold {
  inline-size: 100%;
  block-size: 280px;
}
```
```ts
const scaffold = document.querySelector('md-gb-pane-scaffold')!;
document.querySelector('#comments-button')!.addEventListener('click', () => {
  scaffold.openLevitated();
});
```
{% enddemo %}

## Accessibility

*   Give each navigation component an `aria-label`, such as "Primary navigation", and keep the bar and rail selections in sync.
*   In a single-pane list-detail layout, provide a back button that calls `closeDetail()`.
*   A modal levitated pane takes focus, closes with Escape and when someone uses the content behind it, and is named by `levitate-label`.
*   A floating pane's move and resize handles also work with the arrow keys. Use `drag-handle-label`, `levitate-move-label` and `levitate-resize-label` to translate their names.

## API reference

{% gbapi "scaffold" %}
