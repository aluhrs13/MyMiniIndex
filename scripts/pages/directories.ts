import {
  showDirectoryDialog,
  scanAllDirectories,
} from "../fileAccessHelpers.js";
import { DirectoryList } from "../DirectoryList.js";

var dirs = new DirectoryList();

window.onload = function () {
  attachListeners();
};

async function attachListeners() {
  document.getElementById("loadDirectory").addEventListener("click", () => {
    showDirectoryDialog(dirs);
  });

  document.getElementById("scanDirectories").addEventListener("click", () => {
    scanAllDirectories(dirs.directories);
  });
}
