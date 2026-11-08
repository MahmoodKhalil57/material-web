import {
  getCurrentThemeString
} from "../chunk-OAVXCLE4.js";
import "../chunk-GXAVMFIU.js";
import "../chunk-G4K3MFK5.js";
import "../chunk-23AR7BXN.js";
import "../chunk-AAO4BAFU.js";
import "../chunk-AE6MH53A.js";
import "../chunk-2L6NDFVR.js";
import "../chunk-AE4DAVXE.js";
import "../chunk-KV6CMQ6O.js";
import "../chunk-JVQ4V6KC.js";
import "../chunk-EUXUH3YW.js";

// ../node_modules/postdoc-lib/lib/postdoc.js
var defaultConfig = {
  origin: "*",
  inferTarget: false,
  onMessage: () => {
  }
};
var MESSAGE_TYPE;
(function(MESSAGE_TYPE2) {
  MESSAGE_TYPE2["HANDSHAKE"] = "_DOCTOR_HANDSHAKE";
  MESSAGE_TYPE2["HANDSHAKE_ACK"] = "_DOCTOR_HANDSHAKE_ACK";
})(MESSAGE_TYPE || (MESSAGE_TYPE = {}));
var PostDoc = class {
  /**
   * @param config Optional configuration object. All items other than `origin`
   *   can be set as properties after instantiation, but `messageTarget` should
   *   not be set before `messageReceiver` is set or else postdoc may miss the
   *   handskake acknowledgement message. `origin` defaults to `'*'` and is
   *   only used if `messageTarget` is a `Window`.
   */
  constructor(config) {
    this._messageTarget = null;
    this._messageReceiver = null;
    this._resolveHandshake = () => {
    };
    this._messageChannel = null;
    this._messagePort = null;
    this._handshakeComplete = false;
    this._messagePortDirty = false;
    this._inferTarget = true;
    this._onMessageReceiverMessage = (event) => {
      switch (event.data) {
        case MESSAGE_TYPE.HANDSHAKE:
          this._onHandshake(event);
          break;
        case MESSAGE_TYPE.HANDSHAKE_ACK:
          this._onHandshakeAck(event);
          break;
        default:
          /* @__PURE__ */ ((never) => never)(event.data);
          break;
      }
    };
    const { inferTarget: infer, origin, messageTarget, messageReceiver, onMessage } = {
      ...defaultConfig,
      ...config
    };
    this._onMessage = onMessage;
    this._origin = origin;
    this._inferTarget = infer;
    this._resetHandshake(true);
    if (messageReceiver) {
      this.messageReceiver = messageReceiver;
    }
    if (messageTarget) {
      this.messageTarget = messageTarget;
    }
  }
  /**
   * Promise that resolves when the handshake is complete.
   */
  get handshake() {
    return this._handshake;
  }
  /**
   * Function to be called when a message is received through the PostDoc
   * message channel.
   */
  get onMessage() {
    return this._onMessage;
  }
  set onMessage(newOnMessage) {
    if (this._messagePort) {
      this._messagePort.removeEventListener("message", this._onMessage);
    }
    this._onMessage = newOnMessage;
    if (this._messagePort) {
      this._messagePort.addEventListener("message", newOnMessage);
    }
  }
  set messageReceiver(newReceiver) {
    if (this._messageReceiver) {
      this._messageReceiver.removeEventListener("message", this._onMessageReceiverMessage);
    }
    this._messageReceiver = newReceiver;
    if (newReceiver) {
      newReceiver.addEventListener("message", this._onMessageReceiverMessage);
    }
  }
  /**
   * MessageEventSource that should be listended to for handshake messages.
   */
  get messageReceiver() {
    return this._messageReceiver;
  }
  set messageTarget(newTarget) {
    this._messageTarget = newTarget;
    if (this._messageTarget) {
      this._destroyMessagePort();
      this._resetHandshake();
      this._postMessageToTarget(MESSAGE_TYPE.HANDSHAKE);
    }
  }
  /**
   * Target for handshake messages. If `inferTarget` is `true` and
   * `messageTarget` is omitted, `messageTarget` will be set to the first
   * `MessageEventSource` that fires a handshake message to the given
   * `messageReceiver`.
   *
   * Note, if handshake is fired to receiver before PostDoc is instantiated, the
   * handshake will not resolve. This can be prevented in most cases by setting
   * messageTarget in both message sources. Additionally, `messageReceiver`
   * should be set before `messageTarget` or set in the constructor.
   */
  get messageTarget() {
    return this._messageTarget;
  }
  /**
   * Resets the handshake if already completed and sets the handshake promise to
   * a new, unresolved promise.
   *
   * @param force If true, will reset the handshake even if it not complete.
   *   This is useful for initialization.
   */
  _resetHandshake(force = false) {
    if (force || this._handshakeComplete) {
      this._handshakeComplete = false;
      this._handshake = new Promise((resolve) => {
        this._resolveHandshake = resolve;
      });
    }
  }
  /**
   * Posts a message to the messageTarget. If it is a Window, it will post the
   * message with the origin of `this.origin`. Necessary to normalize the
   * signatures of `Window.postMessage` and
   * `(MessagePort|ServiceWorker).postMessage`.
   *
   * @param message The message to be posted to messageTarget.
   * @param transfer Transferables to be transferred to messageTarget.
   */
  _postMessageToTarget(message, transfer) {
    if (!this._messageTarget) {
      throw new Error("messageTarget not defined");
    }
    if ("window" in this._messageTarget) {
      this._messageTarget.postMessage(message, this._origin, transfer);
    } else {
      this._messageTarget.postMessage(message, { transfer });
    }
  }
  /**
   * Triggered whenever a handshake message request is received.
   *
   * Creates a new message channel, cleans up previous message channel listeners
   * from previous handshakes if necessary, sets messageTarget if necessary, and
   * posts a handshake acknowledgement message back with one of the message
   * channel ports.
   *
   * @param event The handshake MessageEvent.
   */
  _onHandshake(event) {
    if (this._inferTarget && !this.messageTarget && event.source) {
      this._messageTarget = event.source;
    } else if (this.messageTarget && event.source && event.source !== this.messageTarget) {
      return;
    }
    if (!this.messageTarget) {
      return;
    }
    this._resetHandshake();
    if (this._messagePort) {
      this._destroyMessagePort();
    }
    this._messagePortDirty = true;
    this._messageChannel = new MessageChannel();
    this._messagePort = this._messageChannel.port1;
    this._messagePort.addEventListener("message", this.onMessage);
    this._messagePort.start();
    this._postMessageToTarget(MESSAGE_TYPE.HANDSHAKE_ACK, [
      this._messageChannel.port2
    ]);
  }
  /**
   * Triggered whenever a handshake acknowledgement message is received. That
   * would be a response when a handshake message was sent or whether the
   * receiving end has acknowledged an acknowledgement.
   *
   * If this message event source posted a handshake, this will receive the
   * transferrred message port, listen to it, fire an acknowledgement of the
   * acknowledgement, and resolve the handshake.
   *
   * If this message even source did not post a handshake but rather posted an
   * acknowledgement to a previous handshake, then this will resolve the
   * handhsake.
   *
   * @param event The handshake acknowledgement MessageEvent.
   */
  _onHandshakeAck(event) {
    if (!this._inferTarget && !this.messageTarget) {
      return;
    }
    if (!this.messageTarget) {
      throw new Error("messageTarget not defined");
    }
    if (event.source && event.source !== this.messageTarget) {
      return;
    }
    if (!this._messagePort || this._messagePortDirty && event.ports[0]) {
      this._messagePort = event.ports[0];
      this._messagePort.addEventListener("message", this.onMessage);
      this._messagePort.start();
      this._postMessageToTarget(MESSAGE_TYPE.HANDSHAKE_ACK);
    }
    this._messagePortDirty = false;
    this._handshakeComplete = true;
    this._resolveHandshake(this);
  }
  _destroyMessagePort() {
    if (this._messageChannel) {
      this._messageChannel.port1.removeEventListener("message", this.onMessage);
      this._messageChannel.port1.close();
      this._messageChannel.port2.removeEventListener("message", this.onMessage);
      this._messageChannel.port2.close();
    } else if (this._messagePort) {
      this._messagePort.removeEventListener("message", this.onMessage);
      this._messagePort.close();
    }
    this._messageChannel = null;
    this._messagePort = null;
  }
  /**
   * Posts a message to the paired postdoc. It is expected to await the
   * handshake promise before calling this method. If the handshake is not
   * resolved, then this will throw an error.
   *
   * @param message The message to be sent to the paired postdoc.
   */
  postMessage(message, options) {
    if (!this._messagePort || !this._handshakeComplete) {
      throw new Error("Handhsake not complete");
    }
    this._messagePort.postMessage(message, options);
  }
};

// src/pages/components.ts
async function updateMessageTargetOnIframeLoad(postdoc, previewEl) {
  await previewEl.updateComplete;
  const iframe = previewEl.iframe;
  iframe.addEventListener("load", (e) => {
    postdoc.messageTarget = iframe.contentWindow;
  });
}
async function syncPlaygroundThemeWithPage() {
  async function onPlaygroundMessage(e) {
    if (e.data === "request-theme") {
      await postdoc.handshake;
      postdoc.postMessage(getCurrentThemeString());
    }
  }
  const postdoc = new PostDoc({
    messageReceiver: window,
    onMessage: onPlaygroundMessage
  });
  const previewEl = document.querySelector("playground-preview");
  if (!previewEl) {
    return;
  }
  await customElements.whenDefined("playground-preview");
  await updateMessageTargetOnIframeLoad(postdoc, previewEl);
  await postdoc.handshake;
  window.addEventListener("theme-changed", async () => {
    await postdoc.handshake;
    postdoc.postMessage(localStorage.getItem("material-theme"));
  });
}
function demoDropdown() {
  const detailsEl = document.querySelector("details");
  const expandButton = detailsEl?.querySelector(
    "summary md-outlined-icon-button"
  );
  detailsEl?.addEventListener("toggle", () => {
    expandButton.selected = detailsEl.open;
  });
  expandButton?.addEventListener("click", () => {
    setTimeout(() => {
      if (detailsEl?.open !== expandButton.selected) {
        detailsEl.toggleAttribute("open");
      }
    });
  });
}
syncPlaygroundThemeWithPage();
demoDropdown();
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=components.js.map
