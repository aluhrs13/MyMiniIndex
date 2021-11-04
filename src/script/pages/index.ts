import { Mini } from "../helpers/Mini";
import { getMiniList } from "../helpers/idbAccessHelpers";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

window.onload = function () {
  search();

  window.addEventListener("hashchange", hashHandler, false);
  document.getElementById("searchString").addEventListener("keyup", search);

  if (window.location.hash.length > 1) {
    hashHandler();
  }
};

async function renderMinis(minis: Set<Mini>) {
  var container = document.getElementById("gallery");
  container.innerHTML = "";

  minis.forEach((mini: Mini) => {
    var ele = document.createElement("mini-card");
    ele.name = mini.fullPath.join("\\");
    container.appendChild(ele);
  });
}

function hashHandler() {
  var ele = document.createElement("view-mini");
  ele.name = decodeURI(window.location.hash.substring(1));
  document.getElementById("viewer").innerHTML = "";
  document.getElementById("viewer").appendChild(ele);
}

async function search() {
  //@ts-ignore
  let minis = await getMiniList(document.getElementById("searchString").value);
  renderMinis(minis);
}
