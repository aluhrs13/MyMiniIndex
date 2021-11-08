import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";

import { Router } from "@vaadin/router";

import { Mini } from "../helpers/Mini";
import { getPendingMinis } from "../helpers/idbAccessHelpers";

@customElement("app-pending")
export class AppPending extends LitElement {
  static get styles() {
    return css`
      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
    `;
  }

  @state()
  _minis: Promise<Array<Mini>>;

  constructor() {
    super();
  }

  _goThroughAll() {
    this._minis.then((data) => {
      if (data.length > 0) {
        console.log("[Pending] Redirecting to " + data[0].name);
        Router.go({
          pathname: "/edit/" + encodeURI(data[0].fullPath.join("/")),
        });
      } else {
        Router.go({
          pathname: "/pending",
        });
      }
    });
  }

  _printPendingList(miniList: Mini[]) {
    if (miniList.length == 0) {
      return html`<div align="center">
        <br />
        <p style="font-size:large;">
          No Minis are pending approval. Go to the
          <a href="/directories">Directories page</a> to add a new directory to
          scan.
        </p>
      </div>`;
    } else {
      return html` <ul id="pendingList">
        ${miniList.map((mini) => {
          return html` <li>
            <a href="/edit/${mini.fullPath.join("/")}">
              <b>${mini.name}</b>
            </a>
            <br />
            ${mini.fullPath.slice(0, -1).join("/")}
            <hr />
          </li>`;
        })}
      </ul>`;
    }
  }

  render() {
    console.log("[Pending] Rendering...");
    this._minis = getPendingMinis();
    if (location.href.endsWith("pendingnext")) {
      this._goThroughAll();
    }

    return until(
      this._minis.then((data) => {
        return html`
          <mobile-header>
            <h1 slot="text">Pending Minis</h1>
          </mobile-header>
          ${this._printPendingList(data)}
        `;
      }),
      html`<span>Loading...</span>`
    );
  }
}
