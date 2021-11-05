import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  showDirectoryDialog,
  scanAllDirectories,
} from "../helpers/fileAccessHelpers";
import { DirectoryList } from "../helpers/DirectoryList";

@customElement('app-directories')
export class AppDirectories extends LitElement {
  static get styles() {
    return css``;
  }


  @state()
  dirs: DirectoryList;

  constructor() {
    super();
    this.dirs = new DirectoryList();
  }

  _addDir(){
    showDirectoryDialog(this.dirs);
  }

  _scanDirs(){
    scanAllDirectories(this.dirs.directories);
  }

  render() {
    return html`
      <h1>Indexed Directories</h1>

      <div>
        <button @click="${this._addDir}">Add Directory</button>
        <button @click="${this._scanDirs}">Scan</button>
      </div>
      <h2>Directories</h2>
      <div id="directoryList"></div>
    `;
  }
}


