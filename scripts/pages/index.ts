import { Mini } from "../Mini.js";
import { getMiniList } from "../idbAccessHelpers.js";

window.onload = function () {
  renderMinis();

  window.addEventListener("hashchange", hashHandler, false);

  if (window.location.hash.length > 1) {
    hashHandler();
  }
};

async function renderMinis() {
  var container = document.getElementById("gallery");
  container.innerHTML = "";
  let minis = await getMiniList();

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
