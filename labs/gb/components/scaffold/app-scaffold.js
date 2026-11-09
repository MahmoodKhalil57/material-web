/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { isWindowSizeClassAtLeast, } from '../../styles/layout/window-size-class.js';
import { createClassMapDirective } from '../shared/directives.js';
/**
 * Picks the navigation component for a window size class (spec:
 * foundations/layout/breakpoints, "Common swappable components" and the
 * medium navigation guidance: single-pane layouts use a navigation rail,
 * two-pane layouts a navigation bar). Falls back to whichever component is
 * provided.
 *
 * Height (spec: breakpoints, "Height breakpoints" adjust the layout "when
 * available vertical space is unusually small"): in a compact-height window
 * (e.g. a phone or foldable in landscape) a medium window keeps the
 * navigation rail for two panes instead of a bar, which would take scarce
 * vertical space.
 */
export function resolveNavigation({ navigation, windowClass, heightClass = 'medium', paneCount = 1, hasBar = false, hasRail = false, }) {
    if (navigation === 'none')
        return 'none';
    let preferred;
    if (navigation === 'auto') {
        if (windowClass === 'compact') {
            preferred = 'bar';
        }
        else if (windowClass === 'medium') {
            preferred = paneCount >= 2 && heightClass !== 'compact' ? 'bar' : 'rail';
        }
        else {
            preferred = 'rail';
        }
    }
    else {
        preferred = navigation;
    }
    if (preferred === 'bar') {
        return hasBar ? 'bar' : hasRail ? 'rail' : 'none';
    }
    return hasRail ? 'rail' : hasBar ? 'bar' : 'none';
}
/**
 * Whether an automatically expanded navigation rail should be expanded: a
 * collapsed rail at medium and expanded becomes an expanded rail at large and
 * extra-large (spec: breakpoints, "What should be swapped?").
 */
export function shouldExpandRail(windowClass) {
    return isWindowSizeClassAtLeast(windowClass, 'large');
}
/** App scaffold CSS classes. */
export const APP_SCAFFOLD_CLASSES = {
    appScaffold: 'app-scaffold',
    navBar: 'app-scaffold-nav-bar',
    navRail: 'app-scaffold-nav-rail',
};
/** Returns the class map object for the app scaffold. */
export function appScaffoldClasses({ navigation = 'none', } = {}) {
    return {
        [APP_SCAFFOLD_CLASSES.appScaffold]: true,
        [APP_SCAFFOLD_CLASSES.navBar]: navigation === 'bar',
        [APP_SCAFFOLD_CLASSES.navRail]: navigation === 'rail',
    };
}
/**
 * A Lit directive that adds app scaffold classes to an element.
 */
export const appScaffold = createClassMapDirective({
    getClasses: appScaffoldClasses,
});
//# sourceMappingURL=app-scaffold.js.map