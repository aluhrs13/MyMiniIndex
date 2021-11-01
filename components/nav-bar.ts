import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("nav-bar")
export class NavBar extends LitElement {
  static styles = css`
    a {
      color: blue;
    }
  `;

  render() {
    return html`
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/pages/directories.html">Directories</a></li>
        <li><a href="/pages/pending.html">Pending Minis</a></li>
        <li><a href="/pages/share.html">Share</a></li>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nav-bar": NavBar;
  }
}
