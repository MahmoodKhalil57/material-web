import{a as c,b as a,c as d}from"./chunk-MSNV3O7X.js";import{d as v,f as m}from"./chunk-YRNKHAFN.js";var{I:T}=m;var C=e=>e.strings===void 0,f=()=>document.createComment(""),S=(e,t,i)=>{var s;let n=e._$AA.parentNode,r=t===void 0?e._$AB:t._$AA;if(i===void 0){let l=n.insertBefore(f(),r),h=n.insertBefore(f(),r);i=new T(l,h,e,e.options)}else{let l=i._$AB.nextSibling,h=i._$AM,A=h!==e;if(A){let o;(s=i._$AQ)===null||s===void 0||s.call(i,e),i._$AM=e,i._$AP!==void 0&&(o=e._$AU)!==h._$AU&&i._$AP(o)}if(l!==r||A){let o=i._$AA;for(;o!==l;){let y=o.nextSibling;n.insertBefore(o,r),o=y}}}return i},N=(e,t,i=e)=>(e._$AI(t,i),e),b={},w=(e,t=b)=>e._$AH=t,B=e=>e._$AH,H=e=>{var t;(t=e._$AP)===null||t===void 0||t.call(e,!1,!0);let i=e._$AA,s=e._$AB.nextSibling;for(;i!==s;){let n=i.nextSibling;i.remove(),i=n}};var u=(e,t)=>{var i,s;let n=e._$AN;if(n===void 0)return!1;for(let r of n)(s=(i=r)._$AO)===null||s===void 0||s.call(i,t,!1),u(r,t);return!0},$=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while(i?.size===0)},g=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),M(t)}};function D(e){this._$AN!==void 0?($(this),this._$AM=e,g(this)):this._$AM=e}function P(e,t=!1,i=0){let s=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(s))for(let r=i;r<s.length;r++)u(s[r],!1),$(s[r]);else s!=null&&(u(s,!1),$(s));else u(this,e)}var M=e=>{var t,i,s,n;e.type==c.CHILD&&((t=(s=e)._$AP)!==null&&t!==void 0||(s._$AP=P),(i=(n=e)._$AQ)!==null&&i!==void 0||(n._$AQ=D))},p=class extends d{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,s){super._$AT(t,i,s),g(this),this.isConnected=t._$AU}_$AO(t,i=!0){var s,n;t!==this.isConnected&&(this.isConnected=t,t?(s=this.reconnected)===null||s===void 0||s.call(this):(n=this.disconnected)===null||n===void 0||n.call(this)),i&&(u(this,t),$(this))}setValue(t){if(C(this._$Ct))this._$Ct._$AI(t,this);else{let i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}};var x=a(class extends d{constructor(e){var t;if(super(e),e.type!==c.ATTRIBUTE||e.name!=="class"||((t=e.strings)===null||t===void 0?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var i,s;if(this.it===void 0){this.it=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(let r in t)t[r]&&!(!((i=this.nt)===null||i===void 0)&&i.has(r))&&this.it.add(r);return this.render(t)}let n=e.element.classList;this.it.forEach(r=>{r in t||(n.remove(r),this.it.delete(r))});for(let r in t){let l=!!t[r];l===this.it.has(r)||!((s=this.nt)===null||s===void 0)&&s.has(r)||(l?(n.add(r),this.it.add(r)):(n.remove(r),this.it.delete(r)))}return v}});function Y(e){return a(class extends _{constructor(){super(...arguments),this.setupElement=e.setupElement}render(i){return x({...i?.classes||{},...e.getClasses(i)})}})}function ee(e){return a(class extends _{constructor(){super(...arguments),this.setupElement=e}render(){return v}})}var _=class extends p{update({element:t},i){return t!==this.element&&(this.element=t,this.disconnected(),this.isConnected&&this.reconnected()),this.render(...i)}disconnected(){this.cleanup?.abort()}reconnected(){this.element&&this.setupElement&&(this.cleanup=new AbortController,this.setupElement(this.element,{signal:this.cleanup.signal}))}};export{C as a,S as b,N as c,w as d,B as e,H as f,x as g,Y as h,ee as i};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/*! Bundled license information:

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
