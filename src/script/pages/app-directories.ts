import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  scanAllDirectories,
} from "../helpers/fileAccessHelpers";
import { createStore, values, set, del } from "idb-keyval";
import {repeat} from 'lit/directives/repeat.js';

@customElement('app-directories')
export class AppDirectories extends LitElement {
  static get styles() {
    return css``;
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
      console.error("[Page]"+ error.message);
    }
  }

  _addDir(){
    window.showDirectoryPicker({
      startIn: "desktop",
    }).then((dir)=>{
        this.directories.push(dir);
        set(dir.name, dir, this.store);
        this._scanDirs();
    });
  }

  _scanDirs(){
    scanAllDirectories(this.directories);
    this.render();
  }

  _removeDir(dir:FileSystemHandle){
    console.log("[Directories] Removing" + dir.name)
    delete this.directories[this.directories.indexOf(dir)]
    del(dir.name, this.store)
  }

  _scanDir(dir:FileSystemHandle){
    console.log("[Directories] Scanning" + dir.name)
    scanAllDirectories(new Array(dir))
  }

  //TODO: For some reason when _addDir re-renders, these console logs have the updated directories list, but not the loop.
  render() {
    console.log("[Directories] Rendering...")
    return html`
      <h1>Indexed Directories</h1>

      <div>
        <button @click="${this._addDir}">Add New Directory</button>
        <button @click="${this._scanDirs}">Scan All Directories</button>
      </div>
      <h2>Directories</h2>
      <ul id="directoryList">
        ${repeat(this.directories, (directory)=>{directory.name}, (directory)=>{
          return html`<li>${directory.name} <a href="/directories" @click="${()=>{this._removeDir(directory)}}">Remove</a> <a href="/directories" @click="${()=>{this._scanDir(directory)}}">Scan</a></li>`
        })}
      </ul>
    `;
  }
}