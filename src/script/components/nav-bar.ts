import { html, css, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("nav-bar")
export class NavBar extends LitElement {
  static styles = css`
    a {
      color: white;
      text-decoration: none;
    }

    img {
      padding: 8px;
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

    .mobile-nav {
      position: fixed;
      left: 0px;
      bottom: 0px;
      height: 56px;
      max-height: 56px;
      width: 100%;
      background-color: var(--app-primary-color);
      color: white;
      display: flex;
      justify-content: space-around;
    }

    .icon {
      display: inline-block;
      color: white;
      text-align: center;
      height: 100%;
      width: 20%;
      font-size: large;
    }

    .mobile-nav a {
      width: 100%;
      vertical-align: bottom;
    }

    .cluster {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space, 1rem);
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      width: 40%;
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

  _handleResize() {
    this._size = window.innerWidth;
  }

  render() {
    if (this._size < 450) {
      return html`
        <div class="mobile-nav">
          <a href="/" class="icon"
            ><br /><ion-icon name="home-outline"></ion-icon
          ></a>
          <a href="/directories" class="icon"
            ><br /><ion-icon name="folder-open-outline"></ion-icon
          ></a>
          <a href="/pending" class="icon"
            ><br /><ion-icon name="enter"></ion-icon
          ></a>
          <a href="/settings" class="icon"
            ><br /><ion-icon name="settings-outline"></ion-icon
          ></a>
        </div>
      `;
    } else {
      return html`
        <div class="head">
          <img src="../assets/icons/apple-touch-icon-57x57.png" />
          <a href="/"><p>MyMiniIndex</p></a>
          <div class="cluster" style="position: absolute; right: 2rem;">
            <a href="/" class="icon">
              <br />
              <ion-icon name="home-outline"></ion-icon>
            </a>
            <a href="/directories" class="icon">
              <br />
              <ion-icon name="folder-open-outline"></ion-icon
            ></a>
            <a href="/pending" class="icon"
              ><br /><ion-icon name="enter"></ion-icon
            ></a>
            <a href="/settings" class="icon"
              ><br /><ion-icon name="settings-outline"></ion-icon
            ></a>
          </div>
        </div>
      `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nav-bar": NavBar;
  }
}
