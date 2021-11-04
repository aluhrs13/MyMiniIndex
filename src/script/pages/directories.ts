import {
  showDirectoryDialog,
  scanAllDirectories,
} from "../helpers/fileAccessHelpers";
import { DirectoryList } from "../helpers/DirectoryList";

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
