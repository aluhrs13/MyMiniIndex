//Lit Imports
import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";

//Local Imports
import { getMini } from "../helpers/idbAccessHelpers";
import { Mini } from "../helpers/Mini";
import { getRelativeDirectoy } from "../helpers/settings";

import "./edit-mini";

import { RouterLocation, Router } from "@vaadin/router";

@customElement("view-mini")
export class ViewMini extends LitElement {
  static styles = css`
    .switcher {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .switcher > * {
      flex-grow: 1;
      flex-basis: calc((30rem - 100%) * 999);
    }

    .switcher > :nth-last-child(n + 3),
    .switcher > :nth-last-child(n + 3) ~ * {
      flex-basis: 100%;
    }

    .stack {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .stack > * {
      margin-top: 0;
      margin-bottom: 0;
    }

    .stack > * + * {
      margin-top: var(--space, 1.5rem);
    }

    .row {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }

    img {
      max-width: 100%;
    }
  `;
  @state()
  name: string;
  _mini: Promise<Mini>;

  public onAfterEnter(location: RouterLocation): void {
    this.name = decodeURI(location.pathname.replace("/view/", ""));
    console.log("[View Mini] Viewing " + this.name);
  }

  _editMini() {
    this._mini.then((data) => {
      Router.go({
        pathname: "/edit/" + encodeURI(data.fullPath.join("/")),
      });
    });
  }

  render() {
    console.log("[View Mini] Rendering Mini ");
    this._mini = getMini(this.name);

    return until(
      this._mini.then((data) => {
        var path =
          getRelativeDirectoy() + data.fullPath.slice(0, -1).join("\\");

        return html`
          <mobile-header>
            <button slot="buttonTwo" @click="${this._editMini}">
              <ion-icon name="pencil-outline"></ion-icon>
            </button>
            <h1 slot="text">${data.name}</h1>
          </mobile-header>
          <div>
            <div class="switcher">
              <div>
                <img src="${data.base64Image}" />
              </div>
              <div class="stack">
                <div>
                  <h2>Folder</h2>
                  <div>
                    <a target="_blank" href="${path}">${path}</a>
                  </div>
                </div>
                <div>
                  <h2>Tags</h2>
                  ${data.tags.join(", ")}
                </div>
                <div>
                  <h2>URL</h2>
                  ${data.url}
                </div>
                <div></div>
              </div>
            </div>
          </div>
        `;
      }),
      html`<div style="width: 628px; height:100%;">Loading...</div>`
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "view-mini": ViewMini;
  }
}
