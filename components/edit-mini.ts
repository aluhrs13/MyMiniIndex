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
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      --margin: 4rem;
      overflow: auto;
      width: calc(100% - (var(--margin) * 2));
      max-height: calc(100% - (var(--margin) * 2));
      padding: 1rem;
    }
    .flex-item {
      margin: 1rem;
    }
    textarea,
    input {
      width: 100%;
    }
  `;

  @property()
  name = "Somebody";

  @state()
  _mini: Mini;

  _approveMini() {
    this._mini.status = Status.Approved;
    this._mini.base64Image = getImage();
    updateMini(this._mini);
  }

  _rejectMini() {
    this._mini.status = Status.Rejected;
    updateMini(this._mini);
    this._close();
  }

  _loadModel() {
    renderFile(this._mini, this.renderRoot.querySelector('#model'));
  }

  _close() {
    document.body.removeChild(this);
    this._close();
  }

  render() {
    return until(
      getMini(this.name).then((data)=>{
        this._mini = data;
        return html`
      <div class="imposter" style="background-color:white; border-style:solid;">
      <button
          @click="${this._close}"
        style="position: absolute; right: .5rem; top: .5rem; width: 2rem; height: 2rem;"
      >
        X
      </button>

      <div class="row">
        <div class="flex-item">
          <div
            id="model"
            style="width: 500px; height: 400px; border-style: solid"
          >
            <button
            @click="${this._loadModel}"
              style="position: relative; left: 50%; top: 50%; transform: translate(-50%, -50%);"
            >
              Load...
            </button>
          </div>
        </div>
        <div class="flex-item">
          <div id="status">${data.status}</div>
          <h1 id="name">${data.name}</h1>
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
          <div class="row" style="position: absolute; bottom: 2rem;">
            <button @click="${this._approveMini}">Approve</button>
            <button @click="${this._rejectMini}">Reject</button>
          </div>
        </div>
      </div>
    </div>
    `}),
      html`<span>Loading...</span>`
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "edit-mini": EditMini;
  }
}