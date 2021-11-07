import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";
import {
  initSettings,
  setSetting,
  settingsDescriptions,
} from "../helpers/settings";

@customElement("app-settings")
export class AppSettings extends LitElement {
  static get styles() {
    return css`
      ul {
        list-style-type: none;
        margin: 0.5rem;
        padding: 0;
      }
      input {
        width: 100%;
      }
      h2 {
        line-height: 0;
      }
    `;
  }

  @state()
  _settings: Promise<Map<string, string>>;

  _updateSetting(e) {
    console.log(e.currentTarget);
    console.log(e.currentTarget.value);
    setSetting(e.currentTarget.name, e.currentTarget.value);
  }

  render() {
    console.log("[Settings] Rendering...");
    this._settings = initSettings();

    return until(
      this._settings.then((data) => {
        const itemTemplates = [];
        for (const setting of data) {
          itemTemplates.push(html`
            <li>
                <h2>${setting[0]}</h2>
                <div>
                    ${settingsDescriptions.get(setting[0])}
                </div>
                <input
                    type="text"
                    value="${setting[1]}"
                    placeholder="Comma separated list"
                    name="${setting[0]}"
                    @keyup="${(e) => {
                      this._updateSetting(e);
                    }}"
                >
                </input>
            </li>
        `);
        }
        console.log(data);
        return html`
          <mobile-header>
            <h1 slot="text">Settings</h1>
          </mobile-header>
          <p style="size: x-small;">Settings auto-save as you type</p>
          <ul>
            ${itemTemplates}
          </ul>
        `;
      }),
      html`<span>Loading...</span>`
    );
  }
}
