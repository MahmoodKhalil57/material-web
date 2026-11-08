// ../list/internal/list-navigation-helpers.js
function activateFirstItem(items, isActivatable = isItemNotDisabled) {
  const firstItem = getFirstActivatableItem(items, isActivatable);
  if (firstItem) {
    firstItem.tabIndex = 0;
    firstItem.focus();
  }
  return firstItem;
}
function activateLastItem(items, isActivatable = isItemNotDisabled) {
  const lastItem = getLastActivatableItem(items, isActivatable);
  if (lastItem) {
    lastItem.tabIndex = 0;
    lastItem.focus();
  }
  return lastItem;
}
function deactivateActiveItem(items, isActivatable = isItemNotDisabled) {
  const activeItem = getActiveItem(items, isActivatable);
  if (activeItem) {
    activeItem.item.tabIndex = -1;
  }
  return activeItem;
}
function getActiveItem(items, isActivatable = isItemNotDisabled) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.tabIndex === 0 && isActivatable(item)) {
      return {
        item,
        index: i
      };
    }
  }
  return null;
}
function getFirstActivatableItem(items, isActivatable = isItemNotDisabled) {
  for (const item of items) {
    if (isActivatable(item)) {
      return item;
    }
  }
  return null;
}
function getLastActivatableItem(items, isActivatable = isItemNotDisabled) {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (isActivatable(item)) {
      return item;
    }
  }
  return null;
}
function getNextItem(items, index, isActivatable = isItemNotDisabled, wrap = true) {
  for (let i = 1; i < items.length; i++) {
    const nextIndex = (i + index) % items.length;
    if (nextIndex < index && !wrap) {
      return null;
    }
    const item = items[nextIndex];
    if (isActivatable(item)) {
      return item;
    }
  }
  return items[index] ? items[index] : null;
}
function getPrevItem(items, index, isActivatable = isItemNotDisabled, wrap = true) {
  for (let i = 1; i < items.length; i++) {
    const prevIndex = (index - i + items.length) % items.length;
    if (prevIndex > index && !wrap) {
      return null;
    }
    const item = items[prevIndex];
    if (isActivatable(item)) {
      return item;
    }
  }
  return items[index] ? items[index] : null;
}
function activateNextItem(items, activeItemRecord, isActivatable = isItemNotDisabled, wrap = true) {
  if (activeItemRecord) {
    const next = getNextItem(items, activeItemRecord.index, isActivatable, wrap);
    if (next) {
      next.tabIndex = 0;
      next.focus();
    }
    return next;
  } else {
    return activateFirstItem(items, isActivatable);
  }
}
function activatePreviousItem(items, activeItemRecord, isActivatable = isItemNotDisabled, wrap = true) {
  if (activeItemRecord) {
    const prev = getPrevItem(items, activeItemRecord.index, isActivatable, wrap);
    if (prev) {
      prev.tabIndex = 0;
      prev.focus();
    }
    return prev;
  } else {
    return activateLastItem(items, isActivatable);
  }
}
function createDeactivateItemsEvent() {
  return new Event("deactivate-items", { bubbles: true, composed: true });
}
function createRequestActivationEvent() {
  return new Event("request-activation", { bubbles: true, composed: true });
}
function isItemNotDisabled(item) {
  return !item.disabled;
}

// ../list/internal/list-controller.js
var NavigableKeys = {
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowUp: "ArrowUp",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End"
};
var ListController = class {
  constructor(config) {
    this.handleKeydown = (event) => {
      const key = event.key;
      if (event.defaultPrevented || !this.isNavigableKey(key)) {
        return;
      }
      const items = this.items;
      if (!items.length) {
        return;
      }
      const activeItemRecord = getActiveItem(items, this.isActivatable);
      event.preventDefault();
      const isRtl2 = this.isRtl();
      const inlinePrevious = isRtl2 ? NavigableKeys.ArrowRight : NavigableKeys.ArrowLeft;
      const inlineNext = isRtl2 ? NavigableKeys.ArrowLeft : NavigableKeys.ArrowRight;
      let nextActiveItem = null;
      switch (key) {
        // Activate the next item
        case NavigableKeys.ArrowDown:
        case inlineNext:
          nextActiveItem = activateNextItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
          break;
        // Activate the previous item
        case NavigableKeys.ArrowUp:
        case inlinePrevious:
          nextActiveItem = activatePreviousItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
          break;
        // Activate the first item
        case NavigableKeys.Home:
          nextActiveItem = activateFirstItem(items, this.isActivatable);
          break;
        // Activate the last item
        case NavigableKeys.End:
          nextActiveItem = activateLastItem(items, this.isActivatable);
          break;
        default:
          break;
      }
      if (nextActiveItem && activeItemRecord && activeItemRecord.item !== nextActiveItem) {
        activeItemRecord.item.tabIndex = -1;
      }
    };
    this.onDeactivateItems = () => {
      const items = this.items;
      for (const item of items) {
        this.deactivateItem(item);
      }
    };
    this.onRequestActivation = (event) => {
      this.onDeactivateItems();
      const target = event.target;
      this.activateItem(target);
      target.focus();
    };
    this.onSlotchange = () => {
      const items = this.items;
      let encounteredActivated = false;
      for (const item of items) {
        const isActivated = !item.disabled && item.tabIndex > -1;
        if (isActivated && !encounteredActivated) {
          encounteredActivated = true;
          item.tabIndex = 0;
          continue;
        }
        item.tabIndex = -1;
      }
      if (encounteredActivated) {
        return;
      }
      const firstActivatableItem = getFirstActivatableItem(items, this.isActivatable);
      if (!firstActivatableItem) {
        return;
      }
      firstActivatableItem.tabIndex = 0;
    };
    const { isItem, getPossibleItems, isRtl, deactivateItem, activateItem, isNavigableKey, isActivatable, wrapNavigation } = config;
    this.isItem = isItem;
    this.getPossibleItems = getPossibleItems;
    this.isRtl = isRtl;
    this.deactivateItem = deactivateItem;
    this.activateItem = activateItem;
    this.isNavigableKey = isNavigableKey;
    this.isActivatable = isActivatable;
    this.wrapNavigation = wrapNavigation ?? (() => true);
  }
  /**
   * The items being managed by the list. Additionally, attempts to see if the
   * object has a sub-item in the `.item` property.
   */
  get items() {
    const maybeItems = this.getPossibleItems();
    const items = [];
    for (const itemOrParent of maybeItems) {
      const isItem = this.isItem(itemOrParent);
      if (isItem) {
        items.push(itemOrParent);
        continue;
      }
      const subItem = itemOrParent.item;
      if (subItem && this.isItem(subItem)) {
        items.push(subItem);
      }
    }
    return items;
  }
  /**
   * Activates the next item in the list. If at the end of the list, the first
   * item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activateNextItem() {
    const items = this.items;
    const activeItemRecord = getActiveItem(items, this.isActivatable);
    if (activeItemRecord) {
      activeItemRecord.item.tabIndex = -1;
    }
    return activateNextItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
  }
  /**
   * Activates the previous item in the list. If at the start of the list, the
   * last item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activatePreviousItem() {
    const items = this.items;
    const activeItemRecord = getActiveItem(items, this.isActivatable);
    if (activeItemRecord) {
      activeItemRecord.item.tabIndex = -1;
    }
    return activatePreviousItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
  }
};

export {
  deactivateActiveItem,
  getActiveItem,
  getFirstActivatableItem,
  getLastActivatableItem,
  createDeactivateItemsEvent,
  createRequestActivationEvent,
  NavigableKeys,
  ListController
};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=chunk-BCJ5JKJX.js.map
