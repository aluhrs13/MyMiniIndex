import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Mini } from "../helpers/Mini";
import { getMiniList } from "../helpers/idbAccessHelpers";
import { until } from "lit/directives/until.js";

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

@customElement('app-home')
export class AppHome extends LitElement {

  static get styles() {
    return css`
    `;
  }

  constructor() {
    super();
  }

  @state()
  _minis:Promise<Set<Mini>>

  render() {
    this._minis = getMiniList();

    return until(
      this._minis.then((data) => {
        const itemTemplates = [];
        for (const i of data.values()) {
          itemTemplates.push(html`<mini-card name=${i.fullPath.join("\\")}></mini-card>`);
        }
        console.log(itemTemplates)
        return html`;
        <span id="viewerbg" hidden></span>

        <h1>MyMiniIndex</h1>

        <div class="row">
          <div style="width: 100%">
            <div align="center">
              <input type="text" placeholder="Search" id="searchString" @keyup="${this.firstUpdated}" />
              <button style="font-size: large">Search</button>
            </div>
            <div class="grid" id="gallery">
            ${itemTemplates}
            </div>
          </div>
          <div id="viewer"></div>
        </div>`
      })
      ,html`<span>Loading...</span>`);

    return ;
  }
}

/*

  updated(changedProperties) {
    //@ts-ignore
    let minis = await getMiniList(this.renderRoot.querySelector("#searchString").value);
    console.log(minis)

    //@ts-ignore
    var container = this.renderRoot.querySelector("#gallery");
    container.innerHTML = "";

    minis.forEach((mini: Mini) => {
      var ele = document.createElement("mini-card");
      ele.name = mini.fullPath.join("\\");
      container.appendChild(ele);
    });
  }

window.onload = function () {
  search();

  window.addEventListener("hashchange", hashHandler, false);
  document.getElementById("searchString").addEventListener("keyup", search);

  if (window.location.hash.length > 1) {
    hashHandler();
  }
};



function hashHandler() {
  var ele = document.createElement("view-mini");
  ele.name = decodeURI(window.location.hash.substring(1));
  document.getElementById("viewer").innerHTML = "";
  document.getElementById("viewer").appendChild(ele);
}



*/