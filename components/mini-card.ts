import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getMini } from "../scripts/idbAccessHelpers";
import { Mini } from "../scripts/Mini";
import { until } from "lit/directives/until.js";


@customElement("mini-card")
export class MiniCard extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

@property()
name = "Somebody";

@state()
_mini: Mini;

  render() {
    return until(
      getMini(this.name).then((data)=>{
        this._mini = data;
        return html`
        <div class="card">
            <img src="${data.base64Image}" />
            <a href="#">${data.name}</a>
        </div>
        `
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

/*
var container = document.createElement("div");
        var link = document.createElement("a");
        link.href = "#";
        link.innerText = mini.name;
        link.addEventListener("click", () => {
            var ele = document.createElement("edit-mini");
            ele.name = mini.name;
            document.body.appendChild(ele);
        });
        container.appendChild(link);

        ele.appendChild(container);



*/
