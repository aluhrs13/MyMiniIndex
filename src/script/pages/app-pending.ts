import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Mini } from "../helpers/Mini";
import { getPendingMinis } from "../helpers/idbAccessHelpers";
import { until } from "lit/directives/until.js";


@customElement('app-pending')
export class AppPending extends LitElement {
  static get styles() {
    return css``;
  }

  @state()
  _minis: Promise<Array<Mini>>;

  constructor() {
    super();
  }
  render() {
    this._minis = getPendingMinis();
    console.log("RENDERING")

    return until(
      this._minis.then((data) => {
        html`
        <h1>Pending Minis</h1>
        <ul id="pendingList">${data.map((data2)=>{console.log(data2); return html`<li>${data2}</li>`})}</ul>
      `;
      }),
      html`<span>Loading...</span>`)
  }
}


