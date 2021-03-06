import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";

import { Router } from "@vaadin/router";
import { RouterLocation } from "@vaadin/router";

import { getImage, cleanUp } from "../helpers/stl";
import { renderFile } from "../helpers/fileAccessHelpers";
import { getMini, updateMini } from "../helpers/idbAccessHelpers";
import { Mini, Status } from "../helpers/Mini";
import { getSetting, initSettings } from "../helpers/settings";

@customElement("edit-mini")
export class EditMini extends LitElement {
  static styles = css`
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

    textarea,
    input {
      width: calc(100% - 1rem);
      padding: 0.5rem;
    }

    textarea {
      height: 7rem;
    }

    #loadModelButton {
      position: relative;
      right: 0px;
    }
  `;

  @property()
  name: string;

  @state()
  _mini: Promise<Mini>;

  //Saves the current Mini
  _saveMini(goToView: boolean) {
    this._mini.then((data) => {
      data.status = Status.Approved;

      //If there's no load button, we can get the STL image
      if (!this.renderRoot.querySelector("#loadModelButton")) {
        data.base64Image = getImage();
      }

      data.tags = this.renderRoot
        .querySelector("#tagStr")
        //@ts-ignore
        .value.split(",")
        .map((ele: string) => {
          return ele.trim();
        });

      //@ts-ignore
      data.url = this.renderRoot.querySelector("#url").value;
      //@ts-ignore
      data.name = this.renderRoot.querySelector("#nameStr").value;

      updateMini(data);

      if (goToView) {
        Router.go({
          pathname: "/view/" + encodeURI(data.fullPath.join("/")),
        });
      } else {
        Router.go({
          pathname: "/pendingnext",
        });
      }
    });
  }

  _removeMini() {
    this._mini.then((data) => {
      data.status = Status.Rejected;
      updateMini(data);
      window.location.replace("/pending");
    });
  }

  _loadModel() {
    try {
      this._mini.then((data) => {
        console.log(data);
        renderFile(data, this.renderRoot.querySelector("#model")).then(() => {
          this.renderRoot.querySelector("#loadModelButton").remove();
        });
      });
    } catch (e) {
      return;
    }
  }

  public onAfterEnter(location: RouterLocation): void {
    this.name = decodeURI(location.pathname.replace("/edit/", ""));
    console.log("[Edit Mini] Editing " + this.name);
  }

  async _handler() {
    await this.updateComplete;
    this._loadModel();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    cleanUp();
  }

  constructor() {
    super();
  }

  render() {
    this._mini = getMini(this.name);

    return until(
      this._mini.then((data) => {
        this._handler();
        var tagData = "";
        if (data.tags.length > 0) {
          tagData = data.tags.join(", ");
        } else {
          tagData = data.name
            .split(" ")
            .concat(data.fullPath.slice(0, -1))
            .join(", ");
        }

        return html`
          <mobile-header>
            <h1 slot="text">${data.name}</h1>
          </mobile-header>
          <div class="switcher">
            <div>
              <div id=" row">
                Position model in box for thumbnail

                <button @click="${this._loadModel}" id="loadModelButton">
                  Load Model...
                </button>
              </div>
              <div
                id="model"
                style="width: 628px; height: 472px; border-style: solid"
              ></div>
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
                <button
                  @click="${() => {
                    this._saveMini(true);
                  }}"
                >
                  Save
                </button>
                <button
                  @click="${() => {
                    this._saveMini(false);
                  }}"
                >
                  Save and Next
                </button>
                <button @click="${this._removeMini}">Remove from Index</button>
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
