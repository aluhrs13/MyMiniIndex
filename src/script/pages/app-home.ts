import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";

import Fuse from "fuse.js";

import { Mini } from "../helpers/Mini";
import { getMiniList } from "../helpers/idbAccessHelpers";

import "../components/mini-card";

@customElement("app-home")
export class AppHome extends LitElement {
  static get styles() {
    return css`
      .fullWidth {
        width: 100%;
      }
      #gallery {
      }
      #searchString {
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
  _minis: Promise<Fuse.FuseResult<Mini>[] | Mini[]>;
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
        for (const i of data) {
          //@ts-ignore
          if (i.item) {
            itemTemplates.push(
              //@ts-ignore
              html`<mini-card name=${i.item.fullPath.join("/")}></mini-card>`
            );
          } else {
            itemTemplates.push(
              //@ts-ignore
              html`<mini-card name=${i.fullPath.join("/")}></mini-card>`
            );
          }
        }

        if (itemTemplates.length == 0) {
          itemTemplates.push(
            html`<div align="center">
              <br />
              <p style="font-size:large;">
                No Minis found. Go to
                <a href="/directories">Directories page</a> to add a directory
                or <a href="/pending">Pending page</a> to tag them.
              </p>
            </div>`
          );
        }

        return html` <mobile-header>
            <h1 slot="text">Your Index</h1>
          </mobile-header>
          <div style="width: 100%">
            <form class="row">
              <input
                type="text"
                placeholder="Search"
                id="searchString"
                class="fullWidth"
                value="${this._searchString}"
                autofocus
                }
              />
              <button
                style="font-size: large; width: 6rem;"
                @click="${this._search}"
              >
                <ion-icon name="search-outline"></ion-icon>
              </button>
            </form>
            <div class="grid fullWidth" id="gallery">${itemTemplates}</div>
          </div>`;
      }),
      html`<span>Loading...</span>`
    );
  }
}
