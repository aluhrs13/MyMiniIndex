import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Router } from "@vaadin/router";

import "./app-home";
import "../components/nav-bar";
import "../components/mobile-header";

@customElement("app-index")
export class AppIndex extends LitElement {
  static get styles() {
    return css`
      main {
        padding: 0.5rem;
      }

      #routerOutlet > * {
        width: 100% !important;
      }
    `;
  }

  constructor() {
    super();
  }

  firstUpdated() {
    const router = new Router(this.shadowRoot?.querySelector("#routerOutlet"));
    router.setRoutes([
      {
        path: "",
        animate: false,
        children: [
          { path: "/", component: "app-home" },
          {
            path: "/directories",
            component: "app-directories",
            action: async () => {
              await import("./app-directories.js");
            },
          },
          {
            path: "/pending",
            component: "app-pending",
            action: async () => {
              await import("./app-pending.js");
            },
          },
          {
            path: "/pendingnext",
            component: "app-pending",
            action: async () => {
              await import("./app-pending.js");
            },
          },
          {
            path: "/view/(.*)",
            component: "view-mini",
            action: async () => {
              await import("./view-mini.js");
            },
          },
          {
            path: "/edit/(.*)",
            component: "edit-mini",
            action: async () => {
              await import("./edit-mini.js");
            },
          },
        ],
      } as any,
    ]);
  }

  render() {
    return html`
      <div>
        <nav-bar></nav-bar>

        <main>
          <div id="routerOutlet"></div>
        </main>
      </div>
    `;
  }
}
