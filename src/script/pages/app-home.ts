import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Mini } from "../helpers/Mini";
import { getMiniList } from "../helpers/idbAccessHelpers";
import { until } from "lit/directives/until.js";

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import "@pwabuilder/pwainstall";

@customElement("app-home")
export class AppHome extends LitElement {
  static get styles() {
    return css`
      #gallery {
        width: 100%;
      }

      #searchString {
        width: 100%;
        font-size: large;
      }
      .grid {
        display: inline-grid;
        grid-gap: 1rem;
      }

      @supports (width: min(318px, 100%)) {
        .grid {
          grid-template-columns: repeat(
            auto-fit,
            minmax(min(318px, 100%), 1fr)
          );
        }
      }

      .row {
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        align-items: stretch;
        margin: 0.5rem;
      }
    `;
  }

  constructor() {
    super();
    this._minis = getMiniList();
    this._searchString = window.location.hash.substring(1);
  }

  @state()
  _minis: Promise<Set<Mini>>;
  _searchString: string;

  _search(e?: Event) {
    if (e) {
      e.preventDefault();
      //@ts-ignore
      this._searchString = this.renderRoot.querySelector("#searchString").value;
    }
    console.log("[Home] Searching...");
    this._minis = getMiniList(this._searchString);
    history.pushState(null, null, "#" + this._searchString);
  }

  firstUpdated() {
    if (this._searchString) {
      this._search();
    }
  }

  render() {
    console.log("[Home] Rendering...");
    return until(
      this._minis.then((data) => {
        const itemTemplates = [];
        for (const i of data.values()) {
          itemTemplates.push(
            html`<mini-card name=${i.fullPath.join("/")}></mini-card>`
          );
        }
        return html` <mobile-header>
            <h1 slot="text">Your Index</h1>
          </mobile-header>
          <div style="width: 100%">
            <div class="row">
              <input
                type="text"
                placeholder="Search"
                id="searchString"
                value="${this._searchString}"
                }
              />
              <button style="font-size: large" @click="${this._search}">
                <ion-icon name="search-outline"></ion-icon>
              </button>
            </div>
            <div class="grid" id="gallery">${itemTemplates}</div>
          </div>`;
      }),
      html`<span>Loading...</span>`
    );
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
