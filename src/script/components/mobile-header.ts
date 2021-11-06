import { html, css, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("mobile-header")
export class MobileHeader extends LitElement {
  static styles = css`
    .row {
      display: flex;
      flex-direction: row;
      align-items: stretch;
    }

    .head {
      position: absolute;
      left: 0px;
      top: 0px;
      height: 56px;
      max-height: 56px;
      width: 100%;
      background-color: var(--app-primary-color);
      color: white;
      margin: 0px;
      padding: 0px;
      display: flex;
      direction: row;
    }

    .subheader {
      position: absolute;
      left: 0px;
      top: 56px;
      height: 56px;
      max-height: 56px;
      width: 100%;
      background-color: var(--app-secondary-color);
      color: black;
      margin: 0px;
      padding: 0px;
      display: flex;
      direction: row;
    }

    .headerText {
      width: 100%;
      font-size: medium;
      text-align: center;
    }

    .head ::slotted(h1) {
      margin: 0px;
      font-weight: lighter;
      font-size: large;
      height: 100%;
      vertical-align: middle;
    }

    .subheader ::slotted(h1) {
      margin: 0px;
      padding-top: 0.75rem;
      padding-left: 1rem;
      font-weight: lighter;
      font-size: x-large;
      height: 100%;
      vertical-align: middle;
    }

    .head ::slotted(button) {
      width: 56px;
      min-width: 48px;
      min-height: 48px;
      font-size: x-large;
      background-color: var(--app-primary-color);
      color: white;
      font-weight: 800;
      border: none;
    }

    .subheader ::slotted(button) {
      width: 56px;
      min-width: 48px;
      min-height: 48px;
      font-size: x-large;
      background-color: var(--app-secondary-color);
      color: black;
      font-weight: 800;
      border: none;
    }
    .spacer {
      height: 56px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this._handleResize);
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this._handleResize);
    super.disconnectedCallback();
  }

  @state() _size;

  constructor() {
    super();
    this._size = window.innerWidth;
  }

  //TODO: This doesn't work
  _handleResize() {
    this._size = window.innerWidth;
  }

  render() {
    if (this._size < 450) {
      return html`
        <div class="head row">
          <slot name="buttonOne"></slot>
          <div class="headerText">
            <slot name="text"></slot>
          </div>
          <slot name="buttonTwo"></slot>
        </div>
      `;
    } else {
      return html`
        <div class="subheader row">
          <slot name="buttonOne"></slot>
          <slot name="buttonTwo"></slot>
          <slot name="text"></slot>
        </div>
        <div class="spacer"></div>
      `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mobile-header": MobileHeader;
  }
}
