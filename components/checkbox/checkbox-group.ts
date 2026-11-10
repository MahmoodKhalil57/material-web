/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type CheckboxElement} from './checkbox-element.js';

/**
 * Links a parent checkbox to its child checkboxes (checkbox.md, Behavior):
 *
 * - Checking the parent checks every child; unchecking it unchecks them all.
 * - Checking some, but not all, children makes the parent indeterminate.
 *   Checking an indeterminate parent checks every child.
 *
 * Disabled children keep their state and are left out of the parent's bulk
 * changes. The parent's state is synced once when linked.
 *
 * @param parent The parent checkbox.
 * @param children The child checkboxes.
 * @return A function that removes the links.
 */
export function linkParentCheckbox(
  parent: CheckboxElement,
  children: readonly CheckboxElement[],
): () => void {
  const syncParent = () => {
    const checked = children.filter((child) => child.checked).length;
    parent.checked = children.length > 0 && checked === children.length;
    parent.indeterminate = checked > 0 && checked < children.length;
  };
  const onParentChange = () => {
    for (const child of children) {
      if (!child.disabled) child.checked = parent.checked;
    }
    syncParent();
  };

  parent.addEventListener('change', onParentChange);
  for (const child of children) child.addEventListener('change', syncParent);
  syncParent();
  return () => {
    parent.removeEventListener('change', onParentChange);
    for (const child of children) {
      child.removeEventListener('change', syncParent);
    }
  };
}
