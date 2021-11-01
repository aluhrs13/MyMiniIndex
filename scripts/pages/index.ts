import { Mini } from "../Mini.js";
import { getMiniList, getPendingMinis } from "../idbAccessHelpers.js";

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
    console.log(`Gallerying Mini: ${mini.name}`);

    var ele = document.createElement("mini-card");
    ele.name = mini.name;

    container.appendChild(ele);
  });
}

function hashHandler() {
  var ele = document.createElement("view-mini");
  ele.name = decodeURI(window.location.hash.substring(1));
  document.body.appendChild(ele);
}
