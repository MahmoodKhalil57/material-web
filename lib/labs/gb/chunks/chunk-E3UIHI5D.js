import{g as y}from"./chunk-54QRLLG7.js";import{a as x}from"./chunk-EZKHESQI.js";import{a as l,b as c}from"./chunk-THNPU74B.js";import{a as n}from"./chunk-PSCELYSS.js";import{a as m}from"./chunk-SFW3MHH7.js";import{a as u}from"./chunk-AZF4SAF6.js";import{a as i,b as a,c as h}from"./chunk-TY6MUWQF.js";import{a as r,b as o,e as p,h as d}from"./chunk-YRNKHAFN.js";var f="md-gb-select-option-selected-change",T=c(d),s=class extends T{get selected(){return this.isSelected}set selected(e){let t=this.isSelected;e=!!e,t!==e&&(this.isSelected=e,this.requestUpdate("selected",t),this.dispatchEvent(new Event(f,{bubbles:!0})))}get value(){return this.explicitValue??this.displayText}set value(e){let t=this.value;this.explicitValue=e??null,this.requestUpdate("value",t)}get displayText(){return this.explicitDisplayText??this.getLabelText()}set displayText(e){let t=this.displayText;this.explicitDisplayText=e??null,this.requestUpdate("displayText",t)}get typeaheadText(){return this.explicitTypeaheadText??this.displayText}set typeaheadText(e){let t=this.typeaheadText;this.explicitTypeaheadText=e??null,this.requestUpdate("typeaheadText",t)}get filtered(){return this[l].states.has("filtered")}set filtered(e){e?this[l].states.add("filtered"):this[l].states.delete("filtered")}constructor(){super(),this.disabled=!1,this.active=!1,this.isSelected=!1,this.explicitValue=null,this.explicitDisplayText=null,this.explicitTypeaheadText=null,this[l].role="option"}render(){return o`<div
      part="menu-item"
      class="${y({selected:this.selected,disabled:this.disabled,active:this.active})} ripple-host focus-ring-host">
      <span class="menu-item-leading">
        <slot name="leading" ${n()}>
          ${this.selected?o`<svg
                class="checkmark"
                viewBox="0 0 24 24"
                aria-hidden="true">
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>`:p}
        </slot>
      </span>
      <span class="menu-item-content">
        <slot></slot>
        <slot name="supporting-text" class="menu-item-supporting-text"></slot>
      </span>
      <span class="menu-item-trailing">
        <slot
          name="trailing-text"
          class="menu-item-trailing-text"
          ${n()}></slot>
        <slot name="trailing" ${n()}></slot>
      </span>
    </div>`}updated(){this[l].ariaSelected=String(this.selected),this[l].ariaDisabled=String(this.disabled)}getLabelText(){let e="";for(let t of this.childNodes)(t.nodeType===Node.TEXT_NODE||t instanceof Element&&!t.hasAttribute("slot")&&!(t instanceof HTMLTemplateElement))&&(e+=t.textContent);return e.replace(/\s+/g," ").trim()}};s.styles=[u,m,x,r`
      :host {
        display: flex;
        outline: none;
      }
      :host([hidden]),
      :host(:state(filtered)) {
        display: none;
      }
      .menu-item {
        flex: 1;
        min-inline-size: 0;
      }
      .menu-item-content {
        min-inline-size: 0;
        overflow-wrap: anywhere;
      }
      :is(.menu-item-leading, .menu-item-trailing):not(
          :has(.has-slotted, .checkmark)
        ) {
        display: none;
      }
      slot:not(.has-slotted) {
        display: contents;
      }
      .checkmark {
        display: flex;
        inline-size: var(--leading-icon-size);
        block-size: var(--leading-icon-size);
        fill: currentColor;
      }
    `];i([a({type:Boolean,reflect:!0})],s.prototype,"disabled",void 0);i([a({type:Boolean})],s.prototype,"selected",null);i([a()],s.prototype,"value",null);i([a({attribute:"display-text"})],s.prototype,"displayText",null);i([a({attribute:"typeahead-text"})],s.prototype,"typeaheadText",null);i([h()],s.prototype,"active",void 0);export{f as a,s as b};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
