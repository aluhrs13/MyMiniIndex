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
  window.addEventListener("hashchange", hashHandler, false);

  if (window.location.hash.length > 1) {
    hashHandler();
  }
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
  var container = document.getElementById("gallery");
  container.innerHTML = "";
  let minis = await getMiniList();

  minis.forEach((mini: Mini) => {
    console.log(`Gallerying Mini: ${mini.name}`);

    var ele = document.createElement("mini-card");
    ele.name = mini.name;

    container.appendChild(ele);
  });
}

export async function renderPendingMinis() {
  var ele = document.getElementById("pendingList");
  ele.innerHTML = "";
  let minis = await getPendingMinis();

  minis.forEach((mini: Mini) => {
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
  });
}

function hashHandler() {
  var ele = document.createElement("view-mini");
  ele.name = decodeURI(window.location.hash.substring(1));
  document.body.appendChild(ele);
}
