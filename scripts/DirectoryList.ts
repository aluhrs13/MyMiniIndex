import {
  set,
  createStore,
  values,
  //@ts-ignore
} from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";

export class DirectoryList {
  store: any;
  directories: Array<FileSystemHandle>;

  constructor() {
    try {
      this.directories = Array();
      this.store = createStore("My-Mini-Index", "directory-list");

      values(this.store).then((values) => {
        console.log(values);
        this.directories = values;
        this.refreshDirectoryList();
        return;
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  addDir(dir: FileSystemHandle): void {
    this.directories.push(dir);
    set(dir.name, dir, this.store);
    this.refreshDirectoryList();
  }

  refreshDirectoryList(): void {
    console.log("Refreshing directories...");
    let ele = document.getElementById("directoryList");
    ele.innerHTML = "";

    this.directories.forEach((directory) => {
      let newDiv = document.createElement("div");
      newDiv.innerHTML = directory.name;
      ele.appendChild(newDiv);
    });
  }
}
