import{a as A}from"./chunk-YKSJESQ4.js";import{b as f,d as v,g as x}from"./chunk-PR4NFH5C.js";import{b as D}from"./chunk-VEUC3475.js";import{b as E}from"./chunk-YZRY4EP7.js";import{b as w}from"./chunk-PV5BZ7Q3.js";import{a as $}from"./chunk-L53ZTFE6.js";import{a as g}from"./chunk-LAM7XTM2.js";import{a as s,c as a,d,e as u}from"./chunk-SZVN5I3Q.js";import{a as m,b as h,e as l,h as b}from"./chunk-YRNKHAFN.js";var t=class extends b{get value(){return this.explicitValue??(this.label||this.textContent?.trim()||"")}set value(e){let i=this.value;this.explicitValue=e,this.requestUpdate("value",i)}get effectivelyDisabled(){return this.disabled||this.groupDisabled}get density(){return this.densityValue}set density(e){let i=this.densityValue;this.densityValue=w(Number(e)),this.requestUpdate("density",i)}get isEditing(){return this.editing}constructor(){super(),this.type="assist",this.elevated=!1,this.color="flat",this.selected=!1,this.removable=!1,this.editable=!1,this.dragged=!1,this.disabled=!1,this.explicitValue=null,this.groupDisabled=!1,this.softDisabled=!1,this.removeLabel="",this.href="",this.target="",this.rel="",this.referrerPolicy="",this.densityValue=0,this.hasLeadingIcon=!1,this.hasAvatar=!1,this.hasTrailingIcon=!1,this.label="",this.removeFocused=!1,this.editing=!1,this.handleActionNavigation=e=>{let i=e.key==="ArrowLeft",o=e.key==="ArrowRight",{primaryAction:r,removeAction:n}=this;if(!i&&!o||!r||!n)return;let p=getComputedStyle(this).direction==="rtl"?i:o,y=this.shadowRoot.activeElement;p&&y===n||!p&&y===r||(e.preventDefault(),e.stopPropagation(),(p?n:r).focus())},this.addEventListener("keydown",this.handleActionNavigation),this.addEventListener("dblclick",()=>this.startEdit())}focus(e){if(!this.effectivelyDisabled){if(e?.trailing&&this.removeAction){this.removeAction.focus(e);return}if(this.primaryAction){this.primaryAction.focus(e);return}super.focus(e)}}startEdit(){!this.editable||this.editing||v(this.type)!=="input"||this.effectivelyDisabled||this.softDisabled||(this.label=Array.from(this.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent??"").join("").replace(/\s+/g," ").trim()||this.label,this.selected=!0,this.editing=!0,this.updateComplete.then(()=>{let e=this.editInput;e?.focus(),e?.select()}))}commitEdit(){if(!this.editing)return;let e=this.label,i=(this.editInput?.value??"").replace(/\s+/g," ").trim();this.finishEdit(),!(!i||i===e)&&(this.setLabelText(i),this.label=i,this.dispatchEvent(new CustomEvent("edit",{detail:{value:i,previousValue:e},bubbles:!0,composed:!0})))}cancelEdit(){this.editing&&this.finishEdit()}finishEdit(){let e=this.shadowRoot?.activeElement===this.editInput;this.editing=!1,e&&this.updateComplete.then(()=>this.focus())}setLabelText(e){let i=Array.from(this.childNodes).filter(o=>o.nodeType===Node.TEXT_NODE&&o.textContent?.trim());if(i.length===0){this.append(document.createTextNode(e));return}i[0].textContent=e,i.slice(1).forEach(o=>o.remove())}handleEditKeydown(e){e.stopPropagation(),e.key==="Enter"?(e.preventDefault(),this.commitEdit()):e.key==="Escape"&&(e.preventDefault(),this.cancelEdit())}handleActivate(){!this.editable||v(this.type)!=="input"||(this.selected?this.startEdit():this.selected=!0)}updated(e){(e.has("disabled")&&e.get("disabled")!==void 0||e.has("groupDisabled")&&e.get("groupDisabled")!==void 0)&&this.dispatchEvent(new Event("update-focus",{bubbles:!0}))}get isFilter(){return v(this.type)==="filter"}render(){let e=this.isFilter&&this.selected,i=this.hasAvatar&&!e,o=this.hasLeadingIcon||e,r=this.isFilter?String(this.selected):l,n=x({type:this.href?"link":this.type,elevated:this.elevated||this.color==="elevated",selected:this.selected,removable:this.removable,dragged:this.dragged,disabled:this.softDisabled||this.effectivelyDisabled,withLeadingIcon:o,withAvatar:i,withTrailingIcon:this.removable||this.hasTrailingIcon,density:this.density}),c=this.renderContent(e);if(this.editing){let p=this.label?`Edit ${this.label}`:"Edit";return h`<div part="chip" class="${n}">
        <input
          class="chip-edit"
          type="text"
          aria-label=${p}
          .value=${this.label}
          @keydown=${this.handleEditKeydown}
          @blur=${()=>this.commitEdit()}
        />
        ${this.removable?this.renderRemoveButton():l}
      </div>`}return this.removable&&!this.href&&!this.label&&!this.hasLeadingIcon&&!this.hasAvatar?h`<button
        part="chip"
        class="${n}"
        type="button"
        aria-label=${this.removeLabel||"Remove"}
        ?disabled=${this.effectivelyDisabled}
        aria-disabled=${this.softDisabled?"true":l}
        @click=${this.handleRemove}
        @keydown=${this.handleKeydown}
      >
        ${c}
        <span class="chip-trailing-icon" aria-hidden="true">
          <slot name="remove-icon"
            ><span class="chip-glyph">close</span></slot
          >
        </span>
      </button>`:this.href||this.type==="link"?h`<a
        part="chip"
        class="${n}"
        href=${$(this.href)}
        target=${this.target||l}
        rel=${this.rel||l}
        referrerpolicy=${this.referrerPolicy||l}
        aria-disabled=${this.effectivelyDisabled||this.softDisabled?"true":l}
        tabindex=${this.effectivelyDisabled&&!this.softDisabled?-1:l}
        @keydown=${this.handleKeydown}
      >
        ${c}
      </a>`:this.removable?h`<div
        part="chip"
        class="${n}"
        @change=${this.handleChange}
      >
        <button
          class="${f.action} focus-ring-target ripple-target"
          type="button"
          tabindex=${this.removeFocused?-1:l}
          ?disabled=${this.effectivelyDisabled}
          aria-disabled=${this.softDisabled?"true":l}
          aria-pressed=${r}
          @click=${this.handleActivate}
          @keydown=${this.handleKeydown}
        >
          ${c}
        </button>
        ${this.renderRemoveButton()}
      </div>`:h`<button
      part="chip"
      class="${n}"
      type="button"
      ?disabled=${this.effectivelyDisabled}
      aria-disabled=${this.softDisabled?"true":l}
      aria-pressed=${r}
      @click=${this.handleActivate}
      @keydown=${this.handleKeydown}
      @change=${this.handleChange}
    >
      ${c}
    </button>`}renderContent(e){let i=this.hasLeadingIcon||e;return h`
      <span class="chip-icon" aria-hidden="true" ?hidden=${!i}>
        ${e?h`<span class="chip-glyph chip-checkmark">check</span>`:l}
        <slot
          name="icon"
          ?hidden=${e}
          @slotchange=${this.handleIconSlotChange}
        ></slot>
      </span>
      <span class="chip-label"
        ><slot @slotchange=${this.handleLabelSlotChange}></slot
      ></span>
      <span
        class="chip-trailing-icon"
        aria-hidden="true"
        ?hidden=${!this.hasTrailingIcon}
      >
        <slot
          name="trailing-icon"
          @slotchange=${this.handleTrailingIconSlotChange}
        ></slot>
      </span>
    `}renderRemoveButton(){let e=this.removeLabel||(this.label?`Remove ${this.label}`:"Remove");return h`<button
      class="${f.remove} focus-ring-outer"
      type="button"
      aria-label=${e}
      tabindex="-1"
      ?disabled=${this.effectivelyDisabled}
      aria-disabled=${this.softDisabled?"true":l}
      @focus=${this.handleRemoveFocus}
      @blur=${this.handleRemoveBlur}
      @click=${this.handleRemove}
    >
      <slot name="remove-icon" aria-hidden="true"
        ><span class="chip-glyph">close</span></slot
      >
    </button>`}handleIconSlotChange(e){let o=e.target.assignedElements({flatten:!0});this.hasLeadingIcon=o.length>0,this.hasAvatar=o.some(r=>r.classList.contains("chip-avatar")||r.hasAttribute("avatar")||r.localName==="img")}handleTrailingIconSlotChange(e){let i=e.target;this.hasTrailingIcon=i.assignedElements({flatten:!0}).length>0}handleLabelSlotChange(e){let i=e.target;i.isConnected&&(this.label=i.assignedNodes({flatten:!0}).map(o=>o.textContent??"").join("").replace(/\s+/g," ").trim())}handleChange(e){let i=e.target,o=i.querySelector(`:scope > .${f.action}`)??i;this.selected=o.ariaPressed==="true",g(this,e)}handleKeydown(e){this.removable&&(e.key==="Backspace"||e.key==="Delete")&&(e.preventDefault(),this.remove_())}handleRemoveFocus(){this.removeFocused=!0}handleRemoveBlur(){this.removeFocused=!1}handleRemove(e){e.stopPropagation(),this.remove_()}remove_(){this.effectivelyDisabled||this.softDisabled||this.dispatchEvent(new Event("remove",{bubbles:!0,composed:!0}))}};t.shadowRootOptions={...b.shadowRootOptions,delegatesFocus:!0};t.styles=[E,D,A,m`
      :host {
        display: inline-flex;
        max-inline-size: 100%;
        vertical-align: middle;
      }
      :host([hidden]) {
        display: none;
      }
      .chip {
        flex: 1;
      }
      [hidden] {
        display: none !important;
      }
      .chip-edit {
        flex: 1;
        min-inline-size: 4ch;
        margin: 0;
        border: none;
        outline: none;
        background: none;
        padding-inline: var(--leading-space, 12px) var(--trailing-space, 12px);
        color: var(--label-text-color, inherit);
        font: inherit;
      }
    `];s([a()],t.prototype,"type",void 0);s([a({type:Boolean,reflect:!0})],t.prototype,"elevated",void 0);s([a()],t.prototype,"color",void 0);s([a({type:Boolean,reflect:!0})],t.prototype,"selected",void 0);s([a({type:Boolean,reflect:!0})],t.prototype,"removable",void 0);s([a({type:Boolean,reflect:!0})],t.prototype,"editable",void 0);s([a({type:Boolean,reflect:!0})],t.prototype,"dragged",void 0);s([a({type:Boolean,reflect:!0})],t.prototype,"disabled",void 0);s([a()],t.prototype,"value",null);s([a({attribute:!1})],t.prototype,"groupDisabled",void 0);s([a({type:Boolean,attribute:"soft-disabled",reflect:!0})],t.prototype,"softDisabled",void 0);s([a({attribute:"remove-label"})],t.prototype,"removeLabel",void 0);s([a()],t.prototype,"href",void 0);s([a()],t.prototype,"target",void 0);s([a()],t.prototype,"rel",void 0);s([a()],t.prototype,"referrerPolicy",void 0);s([a({type:Number,reflect:!0})],t.prototype,"density",null);s([d()],t.prototype,"hasLeadingIcon",void 0);s([d()],t.prototype,"hasAvatar",void 0);s([d()],t.prototype,"hasTrailingIcon",void 0);s([d()],t.prototype,"label",void 0);s([d()],t.prototype,"removeFocused",void 0);s([d()],t.prototype,"editing",void 0);s([u(".chip-edit")],t.prototype,"editInput",void 0);s([u(".chip-action, .chip:not(div)")],t.prototype,"primaryAction",void 0);s([u(".chip-remove")],t.prototype,"removeAction",void 0);export{t as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
