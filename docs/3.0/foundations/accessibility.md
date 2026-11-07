---
title: Accessibility
section: foundations
order: 3
icon: accessibility_new
description: Every labs/gb component works with a keyboard, a screen reader and reduced motion.
---

## Accessibility

Every labs/gb component works with a keyboard, a screen reader and reduced
motion. The rules below are the ones the components follow and the tests
check.

### Keyboard

Composite components (button groups, chip sets, lists, menus, tabs, navigation,
pickers) share one roving focus model in `labs/gb/components/shared/roving-focus.ts`:

- Arrow keys move between items along the orientation. Left and Right follow
  the reading direction, so they mirror in RTL.
- Home and End go to the first and last item. Focus wraps at the ends unless
  the component turns wrapping off.
- Disabled items are skipped. Soft-disabled items stay focusable.
- Only one item is in the tab order at a time (roving tabindex). Tab enters the
  group on the item that was focused last, or the first one.
- Keys pressed with Alt, Ctrl, Meta or Shift are left to the browser.

Escape clears keyboard focus: it hides the focus indicator and starts the focus
order over, so Tab after Escape reaches the first focusable element again. In a
text field, Escape removes the cursor and keeps the typed text. If a handler
already used the Escape key, the component leaves it alone.

A dialog fires `cancel` on Escape, a scrim click or the full-screen close
button. Canceling keeps the dialog open if you call `preventDefault()`:

{% demo "A dialog that stays open on Escape while there are unsaved changes" height=360 %}
```html
<md-gb-button id="open" color="filled">Edit</md-gb-button>
<md-gb-dialog id="dialog">
  <span slot="headline">Unsaved changes</span>
  Press Escape: the dialog stays open until you save.
  <md-gb-button slot="actions" id="save">Save</md-gb-button>
</md-gb-dialog>
```
```js
const dialog = document.querySelector('#dialog');
let hasUnsavedChanges = true;

document.querySelector('#open').addEventListener('click', () => dialog.show());
document.querySelector('#save').addEventListener('click', () => {
  hasUnsavedChanges = false;
  dialog.close();
});
dialog.addEventListener('cancel', (event) => {
  if (hasUnsavedChanges) event.preventDefault();
});
```
{% enddemo %}

### Focus ring

The focus ring is drawn with `outline`, using the `--focus-ring-outline` and
`--focus-ring-offset` variables from `labs/gb/components/focus/focus-ring.scss`.
The thickness, color and offsets come from the state focus indicator tokens, so
a theme changes them in one place. Do not remove the outline with CSS unless
you draw a replacement that passes the same tests.

### Screen readers and ARIA

Components use WAI-ARIA 1.3 roles, states and properties. The model of the
draft and the checks that report misuse live in
`labs/gb/components/shared/central/aria_test.ts`. Axe-core runs against every
component in `labs/gb/components/shared/central/axe_test.ts`, so a missing
label or an invalid attribute fails the suite.

Material Design 3 wins where it and WAI-ARIA 1.3 disagree. In every other case
the ARIA rules apply as written. When you add a component, follow the M3 page
for its behavior first, then check the ARIA role and attributes it uses.

### Reduced motion

Motion respects `prefers-reduced-motion: reduce`. The motion helpers in
`labs/gb/components/shared/motion.ts` resolve to 0 ms under that setting and
inside an ancestor with the `md-motion-reduced` class. The motion tokens in
`labs/gb/styles/motion/` follow the same rule. Ripples skip the animated press
and show their end state, and the effect tokens (color, opacity, shape) do not
change.

Do not animate with hard-coded durations. Read the duration from the motion
helpers or the tokens, so reduced motion applies to your component too.
