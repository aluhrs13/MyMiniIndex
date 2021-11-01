import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getImage } from "../scripts/stl.js";
import { renderFile } from "../scripts/fileAccessHelpers.js";
import { getMini, updateMini } from "../scripts/idbAccessHelpers.js";
import { Mini, Status } from "../scripts/Mini.js";
import { until } from "lit/directives/until.js";

@customElement("edit-mini")
export class EditMini extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
    .row {
      display: flex;
      flex-direction: row;
      flex-content: space-around;
      align-items: stretch;
    }
    .imposter {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      --margin: 1rem;
      overflow: auto;
      width: calc(100% - (var(--margin) * 2));
      max-height: calc(100% - (var(--margin) * 2));

      /* Custom design-y stuff */
      min-height: 80%;
      padding: 0.5rem;
      background-color: white;
      filter: drop-shadow(0.5rem 0.5rem 1rem #000);
      border-radius: 0.5rem;
    }
    .switcher {
      display: flex;
      flex-wrap: wrap;
      gap: var(1rem);
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

    textarea,
    input {
      width: calc(100% - 1rem);
      padding: 0.5rem;
    }
  `;

  @property()
  name: string;

  @state()
  _mini: Promise<Mini>;

  _approveMini() {
    this._mini.then((data) => {
      data.status = Status.Approved;
      data.base64Image = getImage();
      updateMini(data);
      this._close();
    });
  }

  _rejectMini() {
    this._mini.then((data) => {
      data.status = Status.Rejected;
      updateMini(data);
      this._close();
    });
  }

  _loadModel() {
    this.renderRoot.querySelector("#loadModelButton").remove();
    this._mini.then((data) => {
      renderFile(data, this.renderRoot.querySelector("#model"));
    });
  }

  _close() {
    document.body.removeChild(this);
    history.pushState(null, null, "#");
  }

  render() {
    this._mini = getMini(this.name);

    return until(
      this._mini.then((data) => {
        return html`
      <div class="imposter">
      <button
          @click="${this._close}"
        style="position: absolute; right: .5rem; top: .5rem; width: 2rem; height: 2rem;"
      >
        X
      </button>

      <h1 id="name">${data.name}</h1>
      <div class="switcher">
        <div align="center">
          <div
            id="model"
            style="width: 314px; height: 236px; border-style: solid"
          >
          <button
          id="loadModelButton"
            @click="${this._loadModel}"
              style="position: relative; left: 50%; top: 50%; transform: translate(-50%, -50%);"
            >
              Load Model...
            </button>
          </div>

        </div>
        <div class="stack">
          <div id="status">${data.status}</div>
          <div>
            <label>Tags</label>
            <br />
            <textarea></textarea>
          </div>
          <div>
            <label>URL</label>
            <br />
            <input type="text"></textarea>
          </div>
          <div class="row">
            <button @click="${this._approveMini}">Approve</button>
            <button @click="${this._rejectMini}">Reject</button>
          </div>
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
