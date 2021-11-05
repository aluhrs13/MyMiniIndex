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

  _editMini(e:Event, name:string[]){
    e.preventDefault();
    let ele = document.createElement("edit-mini");
    ele.name = name.join("\\");
    document.body.appendChild(ele);
  }

  render() {
    this._minis = getPendingMinis();

    return until(
      this._minis.then((data) => {
        return html`
        <h1>Pending Minis</h1>
        <ul id="pendingList">
          ${data.map((mini) => {
            console.log(mini);
            return html`
              <li>
                <a href="#" @click="${(e) => this._editMini(e, mini.fullPath)}">
                <b>${mini.name}</b>
                <br/>
                ${mini.fullPath.join("\\")}
                </a>
              </li>`
          })}
        </ul>
      `;
      }),
      html`<span>Loading...</span>`)
  }
}
/*
    var container = document.createElement("li");
    var link = document.createElement("a");
    container.classList.add("pending-mini");
    link.href = `#${mini.fullPath}`;
    link.innerHTML = "<b>" + mini.name + "</b> <br>" + mini.fullPath.join("\\");
    container.appendChild(link);
    ele.appendChild(container);
*/



