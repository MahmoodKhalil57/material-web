import{a as S,b as N}from"./chunk-6YZYAUIO.js";import{a as k,b as F,c as R}from"./chunk-OHLBSXD3.js";import{a as g,b as M}from"./chunk-RBE7MNX2.js";import{a as m}from"./chunk-VLERZ7M6.js";import{f as q}from"./chunk-4ALLPR45.js";import{a as V}from"./chunk-I43TUDDJ.js";import{a as C,b as A,c as D}from"./chunk-DSSYOSP4.js";import{i as w,j as E}from"./chunk-FGXB35OK.js";import{b as O}from"./chunk-PV5BZ7Q3.js";import{a as I,c as L}from"./chunk-4GP2DOSS.js";import{b as T}from"./chunk-THNPU74B.js";import{a as $}from"./chunk-LAM7XTM2.js";import{a as b}from"./chunk-HSWNOLES.js";import{a as s,b as r,d as y}from"./chunk-TY6MUWQF.js";import{g as f}from"./chunk-MZFGRIKD.js";import{a as v,b as l,e as n,h as x}from"./chunk-YRNKHAFN.js";var B=new Set(["color","date","datetime-local","file","month","time","week"]),U=b(F(D(L(T(x))))),i=class extends U{constructor(){super(...arguments),this.variant="filled",this.densityValue=0,this.error=!1,this.errorIcon="always",this.errorText="",this.label="",this.noAsterisk=!1,this.required=!1,this.value="",this.prefixText="",this.suffixText="",this.hasLeadingIcon=!1,this.hasTrailingIcon=!1,this.supportingText="",this.supportingTextVisibility="always",this.textDirection="",this.rows=2,this.cols=20,this.inputMode="",this.max="",this.maxLength=-1,this.min="",this.minLength=-1,this.noSpinner=!1,this.pattern="",this.placeholder="",this.readOnly=!1,this.multiple=!1,this.step="",this.type="text",this.autocomplete="",this.formDisabled=new w(this),this.announcer=new q(this),this.field=new E(this,{onRepeat:t=>this.announcer.announce(t,"assertive")}),this.interacted=!1}get density(){return this.densityValue}set density(t){let e=this.densityValue;this.densityValue=O(Number(t)),this.requestUpdate("density",e)}get defaultValue(){return this.getAttribute("value")??""}set defaultValue(t){this.setAttribute("value",t)}get disabled(){return super.disabled||!!this.formDisabled?.value}set disabled(t){super.disabled=t}formDisabledCallback(t){this.formDisabled.set(t)}setCustomValidity(t){super.setCustomValidity(t),this.requestUpdate()}get selectionDirection(){return this.getInputOrTextarea().selectionDirection}set selectionDirection(t){this.getInputOrTextarea().selectionDirection=t}get selectionEnd(){return this.getInputOrTextarea().selectionEnd}set selectionEnd(t){this.getInputOrTextarea().selectionEnd=t}get selectionStart(){return this.getInputOrTextarea().selectionStart}set selectionStart(t){this.getInputOrTextarea().selectionStart=t}get valueAsNumber(){return this.getInput()?.valueAsNumber??NaN}set valueAsNumber(t){let e=this.getInput();e&&(e.valueAsNumber=t,this.value=e.value)}get valueAsDate(){return this.getInput()?.valueAsDate??null}set valueAsDate(t){let e=this.getInput();e&&(e.valueAsDate=t,this.value=e.value)}select(){this.getInputOrTextarea().select()}setRangeText(...t){this.getInputOrTextarea().setRangeText(...t),this.value=this.getInputOrTextarea().value}setSelectionRange(t,e,a){this.getInputOrTextarea().setSelectionRange(t,e,a)}showPicker(){this.getInput()?.showPicker()}stepDown(t){let e=this.getInput();e&&(e.stepDown(t),this.value=e.value)}stepUp(t){let e=this.getInput();e&&(e.stepUp(t),this.value=e.value)}reset(){this.field.reset(),this.interacted=!1,this.value=this.defaultValue}focus(t){this.getInputOrTextarea().focus(t)}attributeChangedCallback(t,e,a){this.field?.ignoresAttribute(t)||super.attributeChangedCallback(t,e,a)}updated(t){super.updated(t);let e=this.getInputOrTextarea().value;this.value!==e&&(this.value=e)}handleFocusOut(){!this.field.isDirty||this.interacted||(this.interacted=!0,this.requestUpdate())}render(){let t=this.type==="textarea",e=this.interacted&&!this.validity.valid,a=!this.disabled&&(this.field.hasError||e),p=this.field.hasError?this.field.message:e?this.validationMessage:"",o=a&&p?p:this.supportingText,h=(this.maxLength??-1)>-1,d=[this.prefixText&&!t?"prefix":"",this.suffixText&&!t?"suffix":"",o?"supporting-text":"",h?"counter":""].filter(Boolean).join(" "),c=M({variant:this.variant,populated:!!this.value||B.has(this.type),error:a,hasLabel:!!this.label,hasLeadingIcon:this.hasLeadingIcon,hasTrailingIcon:this.hasTrailingIcon||a,textarea:t,noSpinner:this.noSpinner,disabled:this.disabled,density:this.density}),u=this.getLabelText();return l`
      <div class=${f(c)}>
        <div
          class="text-field-container"
          part="container"
          @click=${this.handleContainerClick}
        >
          <span class="text-field-leading-icon">
            <slot
              name="leading-icon"
              @slotchange=${this.handleIconChange}
            ></slot>
          </span>
          ${u?l`<label
                  id="label"
                  class="text-field-label"
                  part="label"
                  for="input"
                  >${u}</label
                >`:n}
          <div class="text-field-content">
            <div class="text-field-input-row">
              ${this.renderAffix("prefix",this.prefixText,t)}
              ${this.renderInput(t,a,d)}
              ${this.renderAffix("suffix",this.suffixText,t)}
            </div>
          </div>
          <span class="text-field-trailing-icon">
            <slot
              name="trailing-icon"
              @slotchange=${this.handleIconChange}
            ></slot>
            ${this.renderErrorIcon(a)}
          </span>
          <div class="text-field-outline" aria-hidden="true">
            <div class="text-field-outline-start"></div>
            <div class="text-field-outline-notch">
              <span class="text-field-outline-label">${u}</span>
            </div>
            <div class="text-field-outline-end"></div>
          </div>
        </div>
        ${o||h?l`<div class="text-field-supporting">
                <span
                  id="supporting-text"
                  class=${f({"text-field-supporting-text":!0,[g.supportingTextFocus]:this.supportingTextVisibility==="focus"&&!(a&&p)})}
                  part="supporting-text"
                  role=${a&&p?"alert":n}
                  >${o}</span
                >
                ${h?l`<span
                        id="counter"
                        class="text-field-counter"
                        part="counter"
                        aria-label="Character count, ${this.value.length}/${this.maxLength}"
                        >${this.value.length}/${this.maxLength}</span
                      >`:n}
              </div>`:n}
      </div>
    `}renderInput(t,e,a){let p=V({direction:this.textDirection||null,"--_rows":t?String(this.rows):null}),{ariaLabel:o}=this,h=this.autocomplete||n,d=(this.maxLength??-1)>-1,c=(this.minLength??-1)>-1;if(t)return l`<textarea
        id="input"
        class="text-field-input"
        part="input"
        style=${p}
        aria-describedby=${a||n}
        aria-invalid=${e?"true":"false"}
        aria-label=${o||n}
        autocomplete=${h}
        name=${this.name||n}
        ?disabled=${this.disabled}
        maxlength=${d?this.maxLength:n}
        minlength=${c?this.minLength:n}
        placeholder=${this.placeholder||n}
        ?readonly=${this.readOnly}
        ?required=${this.required}
        rows=${this.rows}
        cols=${this.cols}
        .value=${m(this.value)}
        @change=${this.redispatchEvent}
        @input=${this.handleInput}
        @focusout=${this.handleFocusOut}
        @select=${this.redispatchEvent}
      ></textarea>`;let u=this.inputMode||n;return l`<input
      id="input"
      class="text-field-input"
      part="input"
      style=${p}
      aria-describedby=${a||n}
      aria-invalid=${e?"true":"false"}
      aria-label=${o||n}
      autocomplete=${h}
      name=${this.name||n}
      ?disabled=${this.disabled}
      inputmode=${u}
      max=${this.max||n}
      maxlength=${d?this.maxLength:n}
      min=${this.min||n}
      minlength=${c?this.minLength:n}
      pattern=${this.pattern||n}
      placeholder=${this.placeholder||n}
      ?readonly=${this.readOnly}
      ?required=${this.required}
      ?multiple=${this.multiple}
      step=${this.step||n}
      type=${this.type}
      .value=${m(this.value)}
      @change=${this.redispatchEvent}
      @input=${this.handleInput}
      @focusout=${this.handleFocusOut}
      @select=${this.redispatchEvent}
    />`}renderErrorIcon(t){let e=f({"text-field-error-icon":!0,[g.errorIconFocus]:this.errorIcon==="focus"});return l`<svg
      class=${e}
      viewBox="0 0 24 24"
      role=${t?"img":n}
      aria-label=${t?"Error":n}
      aria-hidden=${t?n:"true"}
      focusable="false"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
      />
    </svg>`}renderAffix(t,e,a){return!e||a?n:l`<span id=${t} class="text-field-${t}">${e}</span>`}getLabelText(){return this.label?this.required&&!this.noAsterisk?`${this.label}*`:this.label:""}handleInput(t){this.field.markDirty(),this.value=t.target.value}redispatchEvent(t){$(this,t)}handleContainerClick(t){if(this.disabled)return;let e=t.composedPath(),a=this.inputOrTextarea;if(!a||e.includes(a))return;e.some(o=>o instanceof HTMLElement&&(o.classList.contains("text-field-leading-icon")||o.classList.contains("text-field-trailing-icon")))||a.focus()}handleIconChange(t){let e=t.target,a=e.assignedElements({flatten:!0}).length>0;e.name==="leading-icon"?this.hasLeadingIcon=a:this.hasTrailingIcon=a}getInputOrTextarea(){return this.inputOrTextarea||(this.connectedCallback(),this.scheduleUpdate()),this.isUpdatePending&&this.scheduleUpdate(),this.inputOrTextarea}getInput(){return this.type==="textarea"?null:this.getInputOrTextarea()}[I](){return this.value}formResetCallback(){this.reset()}formStateRestoreCallback(t){this.value=t??""}[C](){return new N(()=>({state:this,renderedControl:this.inputOrTextarea}))}[A](){return this.inputOrTextarea}[k](t){this.field.report(t)}};i.shadowRootOptions={...x.shadowRootOptions,delegatesFocus:!0};i.styles=[R,v`
      :host {
        display: inline-flex;
        vertical-align: top;
      }
      :host([hidden]) {
        display: none;
      }
      .text-field {
        flex: 1;
        min-inline-size: 0;
      }
    `];s([r({reflect:!0})],i.prototype,"variant",void 0);s([r({type:Number,reflect:!0})],i.prototype,"density",null);s([r({type:Boolean,reflect:!0})],i.prototype,"error",void 0);s([r({attribute:"error-icon"})],i.prototype,"errorIcon",void 0);s([r({attribute:"error-text"})],i.prototype,"errorText",void 0);s([r()],i.prototype,"label",void 0);s([r({type:Boolean,attribute:"no-asterisk"})],i.prototype,"noAsterisk",void 0);s([r({type:Boolean,reflect:!0})],i.prototype,"required",void 0);s([r()],i.prototype,"value",void 0);s([r({attribute:"prefix-text"})],i.prototype,"prefixText",void 0);s([r({attribute:"suffix-text"})],i.prototype,"suffixText",void 0);s([r({type:Boolean,attribute:"has-leading-icon"})],i.prototype,"hasLeadingIcon",void 0);s([r({type:Boolean,attribute:"has-trailing-icon"})],i.prototype,"hasTrailingIcon",void 0);s([r({attribute:"supporting-text"})],i.prototype,"supportingText",void 0);s([r({attribute:"supporting-text-visibility"})],i.prototype,"supportingTextVisibility",void 0);s([r({attribute:"text-direction"})],i.prototype,"textDirection",void 0);s([r({type:Number})],i.prototype,"rows",void 0);s([r({type:Number})],i.prototype,"cols",void 0);s([r({reflect:!0})],i.prototype,"inputMode",void 0);s([r()],i.prototype,"max",void 0);s([r({type:Number})],i.prototype,"maxLength",void 0);s([r()],i.prototype,"min",void 0);s([r({type:Number})],i.prototype,"minLength",void 0);s([r({type:Boolean,attribute:"no-spinner"})],i.prototype,"noSpinner",void 0);s([r()],i.prototype,"pattern",void 0);s([r({reflect:!0,converter:S})],i.prototype,"placeholder",void 0);s([r({type:Boolean,reflect:!0})],i.prototype,"readOnly",void 0);s([r({type:Boolean,reflect:!0})],i.prototype,"multiple",void 0);s([r()],i.prototype,"step",void 0);s([r({reflect:!0})],i.prototype,"type",void 0);s([r({reflect:!0})],i.prototype,"autocomplete",void 0);s([y(".text-field-input")],i.prototype,"inputOrTextarea",void 0);export{i as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
