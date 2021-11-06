import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Mini } from "../helpers/Mini";
import { getPendingMinis } from "../helpers/idbAccessHelpers";
import { until } from "lit/directives/until.js";
import {Router} from '@vaadin/router';

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

    if(location.hash=="#next"){
      this._minis = getPendingMinis();
      this._goThroughAll();
    }
  }

  _goThroughAll(){
    this._minis.then((data) => {
      console.log("[Pending] Redirecting to "+data[0].name)
      Router.go({
        pathname: '/edit/'+encodeURI(data[0].fullPath.join("/"))
      });
    });
  }

  render() {
    console.log("[Pending] Rendering...")
    this._minis = getPendingMinis();

    return until(
      this._minis.then((data) => {
        return html`
        <h1>Pending Minis</h1>
        <div id="model"></div>
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