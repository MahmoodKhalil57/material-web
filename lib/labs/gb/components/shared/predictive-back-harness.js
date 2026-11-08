var t=class s extends EventTarget{constructor(){super(),this.destroyed=!1,s.instances.push(this)}destroy(){this.destroyed=!0}requestClose(){this.destroyed||(this.destroyed=!0,this.dispatchEvent(new Event("close")))}static active(){return s.instances.filter(e=>!e.destroyed)}};t.instances=[];function a(s){let e=globalThis,r,o=!1;beforeEach(()=>{o="CloseWatcher"in e,r=e.CloseWatcher,t.instances=[],s?e.CloseWatcher=t:delete e.CloseWatcher}),afterEach(()=>{o?e.CloseWatcher=r:delete e.CloseWatcher})}export{t as FakeCloseWatcher,a as useCloseWatcher};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
