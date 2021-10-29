import { Mini } from "./Mini.js";
import {
  showDirectoryDialog,
  scanAllDirectories,
} from "./fileAccessHelpers.js";

import { getMiniList, getPendingMinis } from "./idbAccessHelpers.js";
import { DirectoryList } from "./DirectoryList.js";

var dirs = new DirectoryList();

window.onload = function () {
  renderMinis();
  renderPendingMinis();
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

async function renderMinis() {
  var ele = document.getElementById("gallery");
  ele.innerHTML = "";
  let minis = await getMiniList();

  minis.forEach((mini: Mini) => {
    var container = document.createElement("div");

    if (mini.base64Image) {
      let miniImg = new Image();
      miniImg.src = mini.base64Image;
      container.appendChild(miniImg);
    }

    var link = document.createElement("a");
    link.href = "/edit?id=" + mini.name;
    link.innerText = mini.name;
    container.appendChild(link);

    ele.appendChild(container);
  });
}

async function renderPendingMinis() {
  var ele = document.getElementById("pendingList");
  ele.innerHTML = "";
  let minis = await getPendingMinis();

  minis.forEach((mini: Mini) => {
    var container = document.createElement("div");
    var link = document.createElement("a");
    link.href = "/edit?id=" + mini.name;
    link.innerText = mini.name;
    container.appendChild(link);

    ele.appendChild(container);
  });
}
