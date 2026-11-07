/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {PullToRefreshElement} from './pull-to-refresh-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-pull-to-refresh': PullToRefreshElement;
  }
}

customElements.define('md-gb-pull-to-refresh', PullToRefreshElement);
