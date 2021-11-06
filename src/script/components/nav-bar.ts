import { html, css, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("nav-bar")
export class NavBar extends LitElement {
  static styles = css`
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

    .head > p {
      margin-left: 0.5rem;
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

    .icon{
      display: inline-block;
      color: white;
      text-align: center;
      height: 100%;
      width: 25%;
    }

    .mobile-nav a {
      width: 100%;
      vertical-align:bottom;
    }

    .cluster {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space, 1rem);
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      width: 33%;
    }

    img {
      padding: 8px;
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

  //TODO: Get image link to work
  render() {
    if (this._size < 450) {
      return html`
        <div class="mobile-nav">
          <a href="/" class="icon"><br/><ion-icon name="home-outline"></ion-icon></a>
          <a href="/directories" class="icon"><br/><ion-icon name="folder-open-outline"></ion-icon></a>
          <a href="/pending" class="icon"><br/><ion-icon name="enter"></ion-icon></a>
          <!--<a href="/share"><br />Share</a>-->
        </div>
      `;
    } else {
      return html`
        <div class="head">
          <img src="../assets/icons/apple-touch-icon-57x57.png" />
          <a href="/"><p>MyMiniIndex</p></a>
          <div class="cluster" style="position: absolute; right: 2rem;">
            <a href="/" class="icon"><ion-icon name="home-outline"></ion-icon><br/>Home</a>
            <a href="/directories" class="icon"><ion-icon name="folder-open-outline"></ion-icon><br/>Directories</a>
            <a href="/pending" class="icon"><ion-icon name="enter"></ion-icon><br/>Pending</a>
            <!--<a href="/share"><br />Share</a>-->
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
