import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Mini } from "../helpers/Mini";
import { getPendingMinis } from "../helpers/idbAccessHelpers";
import { until } from "lit/directives/until.js";


@customElement('app-pending')
export class AppPending extends LitElement {
  static get styles() {
    return css`
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }`;
  }

  @state()
  _minis: Promise<Array<Mini>>;

  constructor() {
    super();
  }

  render() {
    console.log("[Pending] Rendering...")
    this._minis = getPendingMinis();

    return until(
      this._minis.then((data) => {
        return html`
        <h1>Pending Minis</h1>
        <ul id="pendingList">
          ${data.map((mini) => {
            return html`
              <li>
                <a href="/edit/${mini.fullPath.join("/")}">
                <b>${mini.name}</b>
                <br/>
                ${mini.fullPath.join("/")}
                </a>
              </li>`
          })}
        </ul>
      `;
      }),
      html`<span>Loading...</span>`)
  }
}