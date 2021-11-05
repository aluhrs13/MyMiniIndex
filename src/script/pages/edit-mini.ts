//Lit Imports
import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";

//Local Imports
import { getImage } from "../helpers/stl";
import { renderFile } from "../helpers/fileAccessHelpers";
import { getMini, updateMini } from "../helpers/idbAccessHelpers";
import { Mini, Status } from "../helpers/Mini";
import { getExcludeTagSuggestions } from "../helpers/settings";

import {
  RouterLocation,
} from '@vaadin/router';

@customElement("edit-mini")
export class EditMini extends LitElement {
  static styles = css`
    /* Utility */
    .row {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: stretch;
    }


    .switcher {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .switcher > * {
      flex-grow: 1;
      flex-basis: calc((50rem - 100%) * 999);
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

    /* Style */
    textarea,
    input {
      width: calc(100% - 1rem);
      padding: 0.5rem;
    }

    textarea {
      height: 7rem;
    }

    #closeButton {
      position: absolute;
      right: 0.5rem;
      top: 0.5rem;
      width: 2rem;
      height: 2rem;
    }
  `;

  @property()
  name: string;

  @state()
  _mini: Promise<Mini>;

  //Saves the current Mini
  _saveMini() {
    this._mini.then((data) => {
      data.status = Status.Approved;

      //If there's no load button, we can get the STL image
      if (!this.renderRoot.querySelector("#loadModelButton")) {
        data.base64Image = getImage();
      }

      //TODO: Figure out how to do this right in TS
      data.tags = this.renderRoot
        .querySelector("#tagStr")
        //@ts-ignore
        .value.split(",")
        .map((ele:string) => {
          return ele.trim();
        });

      //@ts-ignore
      data.url = this.renderRoot.querySelector("#url").value;
      //@ts-ignore
      data.name = this.renderRoot.querySelector("#nameStr").value;

      updateMini(data);
      window.location.replace("/view/"+data.fullPath.join("/"))
    });
  }

  //Removes the Mini from the user's index
  _removeMini() {
    this._mini.then((data) => {
      data.status = Status.Rejected;
      updateMini(data);
      window.location.replace("/pending");
    });
  }

  _loadModel() {
    this.renderRoot.querySelector("#loadModelButton").remove();
    this._mini.then((data) => {
      renderFile(data, this.renderRoot.querySelector("#model"));
    });
  }

  public onAfterEnter(location: RouterLocation): void {
    this.name=decodeURI(location.pathname.replace("/edit/",""))
    console.log("[Edit Mini] Editing "+this.name)
  }

  render() {
    this._mini = getMini(this.name);

    return until(
      this._mini.then((data) => {
        var tagData = "";
        if (data.tags.length > 0) {
          tagData = data.tags.join(", ");
        } else {
          const toRemove = getExcludeTagSuggestions();
          tagData = data.name
            .split(" ")
            .concat(data.fullPath.slice(0, -1))
            .filter((ele) => {
              return !toRemove.includes(ele);
            })
            .join(", ");
        }

        return html`
            <button @click="${this._close}" id="closeButton">X</button>

            <h1>${data.name}</h1>
            <div class="switcher">
              <div align="center">
                <div
                  id="model"
                  style="width: 628px; height: 472px; border-style: solid"
                ></div>
                <br />
                <button @click="${this._loadModel}" id="loadModelButton">
                  Load Model...
                </button>
              </div>
              <div class="stack">
                <div>
                  <label>Name</label>
                  <br />
                  <input type="text" id="nameStr" value="${data.name}" />
                </div>
                <div>
                  <label>Tags</label>
                  <br />
                  <textarea id="tagStr">${tagData}</textarea>
                </div>
                <div>
                  <label>URL</label>
                  <br />
                  <input type="text" id="url" value="${data.url}" />
                </div>
                <div class="row">
                  <button @click="${this._saveMini}">Save</button>
                  <button @click="${this._removeMini}">
                    Remove from Index
                  </button>
                </div>
              </div>
            </div>
        `;
      }),
      html`<span>Loading...</span>`
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "edit-mini": EditMini;
  }
}
