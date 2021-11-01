import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getMini } from "../scripts/idbAccessHelpers.js";
import { Mini } from "../scripts/Mini.js";
import { until } from "lit/directives/until.js";

@customElement("view-mini")
export class ViewMini extends LitElement {
  static styles = css`
    p {
      color: blue;
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

    img {
      width: 100%;
    }
  `;

  @property()
  name: string;

  @state()
  _mini: Promise<Mini>;

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
              <div>
                <img src="${data.base64Image}" />
              </div>
              <div class="stack">
                <div>
                  <h2>Tags</h2>
                  TEXT
                </div>
                <div>
                  <h2>URL</h2>
                  LINK
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
    "view-mini": ViewMini;
  }
}
