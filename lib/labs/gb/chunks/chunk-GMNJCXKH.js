function r(t,e){return t===e?"":t.nodeType===Node.TEXT_NODE?t.textContent??"":t.nodeType!==Node.ELEMENT_NODE||t.hasAttribute("hidden")?"":[...t.childNodes].map(s=>r(s,e)).join("")}function h(t){return[...t.labels??[]].map(e=>r(e,t)).join(" ").replace(/\s+/g," ").trim()}var i=class{constructor(e){this.host=e,this.text="",this.refresh=()=>{let s=h(this.host);s!==this.text&&(this.text=s,this.host.requestUpdate())},e.addController(this)}hostConnected(){this.host.addEventListener("focusin",this.refresh),this.refresh()}hostDisconnected(){this.host.removeEventListener("focusin",this.refresh)}hostUpdated(){this.text||this.refresh()}};export{h as a,i as b};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
