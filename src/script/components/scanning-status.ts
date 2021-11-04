import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("scanning-status")
export class ScanningStatus extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

  @property()
  name = "Somebody";

  //TODO: Communicate scanning status
  render() {
    return html`
      <div>
        <div id="status">a</div>
        <div id="scanningDir">b</div>
        <div id="minisFound">c</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "scanning-status": ScanningStatus;
  }
}
