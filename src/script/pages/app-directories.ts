import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { scanAllDirectories } from "../helpers/fileAccessHelpers";
import { createStore, values, set, del } from "idb-keyval";
import { repeat } from "lit/directives/repeat.js";

@customElement("app-directories")
export class AppDirectories extends LitElement {
  static get styles() {
    return css`
      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: stretch;
      }
      .row {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
      }
      button {
        height: 100%;
        min-width: 48px;
        min-height: 48px;
        font-size: x-large;
        background: none;
        border: none;
      }
    `;
  }

  @state()
  directories: Array<FileSystemHandle>;
  store: any;

  constructor() {
    super();
    try {
      this.directories = Array();
      this.store = createStore("My-Mini-Index", "directory-list");

      values(this.store).then((values) => {
        this.directories = values;
      });
    } catch (error) {
      console.error("[Page]" + error.message);
    }
  }

  _addDir() {
    window
      .showDirectoryPicker({
        startIn: "desktop",
      })
      .then((dir) => {
        this.directories.push(dir);
        set(dir.name, dir, this.store);
        this._scanDirs();
      });
  }

  _scanDirs() {
    scanAllDirectories(this.directories);
    this.render();
  }

  _removeDir(dir: FileSystemHandle) {
    console.log("[Directories] Removing" + dir.name);
    delete this.directories[this.directories.indexOf(dir)];
    del(dir.name, this.store);
  }

  _scanDir(dir: FileSystemHandle) {
    console.log("[Directories] Scanning" + dir.name);
    scanAllDirectories(new Array(dir));
  }

  //TODO: For some reason when _addDir re-renders, these console logs have the updated directories list, but not the loop.
  render() {
    console.log("[Directories] Rendering...");
    return html`
      <mobile-header>
        <button slot="buttonOne" @click="${this._addDir}">
          <ion-icon name="add-outline"></ion-icon>
        </button>
        <button slot="buttonTwo" @click="${this._scanDirs}">
          <ion-icon name="refresh-outline"></ion-icon>
        </button>
        <h1 slot="text">Directories</h1>
      </mobile-header>
      <ul id="directoryList">
        ${repeat(
          this.directories,
          (directory) => {
            directory.name;
          },
          (directory) => {
            return html` <li class="row">
              <div>
                <button
                  @click="${() => {
                    this._removeDir(directory);
                  }}"
                >
                  <ion-icon name="trash-outline"></ion-icon>
                </button>
              </div>
              <div>
                <button
                  @click="${() => {
                    this._scanDir(directory);
                  }}"
                >
                  <ion-icon name="refresh-outline"></ion-icon>
                </button>
              </div>

              <div>${directory.name}</div>
            </li>`;
          }
        )}
      </ul>
    `;
  }
}
