import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getMini } from "../scripts/idbAccessHelpers";
import { Mini } from "../scripts/Mini";
import { until } from "lit/directives/until.js";

@customElement("mini-card")
export class MiniCard extends LitElement {
  static styles = css`
    .card {
      background-color: white;
      border-radius: 4px;
      border-style: solid;
      border-width: 1px;
      width: 100%;
    }

    .card-thumbnail {
      object-fit: contain;
      border-radius: 4px 4px 0px 0px;
      border-bottom-style: solid;
      border-bottom-width: 1px;
      border-bottom-color: gray;
      width: 100%;
    }

    .mini-name {
      text-align: left;
      line-height: 0.4em;
      white-space: nowrap;
      overflow: wrap;
      padding: 0rem 1rem;
    }

    h3 {
      font-family: "Montserrat", sans-serif !important;
      font-size: 1.25em;
      line-height: 1em;
      white-space: normal;
    }
  `;

  @property()
  name: string;

  @state()
  _mini: Promise<Mini>;

  render() {
    console.log("Rendering...");
    this._mini = getMini(this.name);
    return until(
      this._mini.then((data) => {
        return html`
          <div class="card">
            <div>
              <a href="#${data.name}">
                <img
                  class="card-thumbnail"
                  width="314"
                  height="236"
                  src="${data.base64Image}"
                />
              </a>
            </div>
            <div class="mini-name">
              <h3>${data.name}</h3>
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
    "mini-card": MiniCard;
  }
}
